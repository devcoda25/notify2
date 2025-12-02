// /src/auth/authAgent.js
// Single source of truth for auth in the SPA.
// Unified login with: beginLogin() for expired cookie (redirect/interactive)
// and resumeLogin() for cookie-present restore.

const t = () => new Date().toISOString();
const log = (...a) => console.log(`[auth ${t()}]`, ...a);

// Human-friendly error wrapper (no raw server dumps)
function friendlyError(code, detail) {
  const e = new Error(({
    NO_TOKEN: "We couldn’t start sign-in. Please try again or contact support.",
    HELLO_FAILED: "Couldn’t reach the server to start sign-in. Check your connection and try again.",
    CLOCK_IN_FAILED: "We couldn’t open your session. Please refresh and try again.",
    TICKET_FAILED: "We couldn’t prepare a secure session. Please refresh and try again.",
    WS_REJECT: "Live updates could not be initialized. Try reloading the page.",
    RESUME_TIMEOUT: "We couldn’t confirm your session quickly. Please refresh.",
  })[code] || "Something went wrong. Please try again.");
  e.code = code;
  if (detail) e.detail = detail; // log-safe detail for devtools
  return e;
}

const cfg = {
  // Gateways/WS
  gwapiHelloUrl: process.env.REACT_APP_GWAPI_HELLO_URL || "http://localhost:7440/hello",
  gwapiClockInUrl: process.env.REACT_APP_GWAPI_CLOCKIN_URL || "http://localhost:7440/clock/in",
  gwapiUrl: process.env.REACT_APP_GWAPI_URL || "http://localhost:7440/ws/ticket",
  sidPingUrl: process.env.REACT_APP_GWAPI_SID_PING_URL || "http://localhost:7440/sid/ping",
  wsUrl: process.env.REACT_APP_WS_URL || "ws://localhost:8080/ws",

  // IdP (treat current dev IdP as THE IdP)
  idpBaseUrl: process.env.REACT_APP_IDP_BASE_URL || "https://accounts.dev.evzone.app",
  idpAuthPath: process.env.REACT_APP_IDP_AUTH_PATH || "/oauth2/authorize",
  idpClientId: process.env.REACT_APP_IDP_CLIENT_ID || "notify_web_local",
  idpRedirectUrl: process.env.REACT_APP_IDP_REDIRECT_URL || "http://localhost:3000/console/pass/callback",
  idpScope: process.env.REACT_APP_IDP_SCOPE || "openid profile email",

  // Device + dev token
  deviceId: (process.env.REACT_APP_DEVICE_ID || "dev-web-test-001").toLowerCase(),
  idpAccessTokenDev: process.env.REACT_APP_IDP_ACCESS_TOKEN_DEV || "",

  // WS probe behavior
  wsAuthViaQuery: /^true|1|yes$/i.test(String(process.env.REACT_APP_WS_AUTH_VIA_QUERY ?? "false")),
};

let _accessToken = null;
let _ticket = null;
let _authUser = null;
let _tenantId = null;
let _listeners = new Set();

function notify() {
  const state = getAuthState();
  for (const fn of _listeners) { try { fn(state); } catch { } }
}

export function onAuthChange(cb) { _listeners.add(cb); return () => _listeners.delete(cb); }
export function getAuthState() {
  return { hasTicket: !!_ticket, authUser: _authUser, tenantId: _tenantId };
}

function parseJwtPayload(jwt) {
  try {
    const [, payloadB64] = String(jwt).split(".");
    const json = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch { return {}; }
}

export function getAuthClaims() {
  if (!_ticket) return {};
  try { return parseJwtPayload(_ticket) || {}; } catch { return {}; }
}

async function fetchGwapiTicket({ accessToken }) {
  const headers = {
    "Content-Type": "application/json",
    ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
    "X-Device-ID": cfg.deviceId,
  };
  let res;
  try {
    res = await fetch(cfg.gwapiUrl, { method: "POST", headers, body: JSON.stringify({}), credentials: "include" });
  } catch (err) {
    throw friendlyError("TICKET_FAILED", err?.message || err);
  }
  let json;
  try { json = await res.json(); } catch { json = {}; }
  if (!res.ok || !json?.token) throw friendlyError("TICKET_FAILED", { status: res.status, body: json });
  return json.token;
}

// --- ultra-fast session ping (cookie-only) ---
async function hasSessionViaPing({ timeoutMs = 300 } = {}) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), Math.max(120, timeoutMs));
  try {
    const res = await fetch(cfg.sidPingUrl, {
      method: "HEAD",
      credentials: "include",
      headers: { "X-Device-ID": cfg.deviceId },
      signal: ctrl.signal,
    }).catch(() => null);
    if (res && (res.status === 204 || res.status === 200)) return true;
  } catch { }
  finally { clearTimeout(to); }

  // fallback GET
  const ctrl2 = new AbortController();
  const to2 = setTimeout(() => ctrl2.abort(), Math.max(120, timeoutMs));
  try {
    const res = await fetch(cfg.sidPingUrl, {
      method: "GET",
      credentials: "include",
      headers: { "X-Device-ID": cfg.deviceId, Accept: "text/plain" },
      signal: ctrl2.signal,
    }).catch(() => null);
    return !!(res && (res.status === 204 || res.status === 200));
  } catch { return false; }
  finally { clearTimeout(to2); }
}

// --- Hello / Clock helpers ---
async function postHello({ accessToken }) {
  const headers = {
    "Content-Type": "application/json",
    ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
    "X-Device-ID": cfg.deviceId,
  };
  const res = await fetch(cfg.gwapiHelloUrl, { method: "POST", headers, credentials: "include", body: JSON.stringify({}) });
  if (!res.ok) throw friendlyError("HELLO_FAILED", { status: res.status });
}

async function postClockIn({ accessToken, passcode, jti, expiresAt, meta } = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
    "X-Device-ID": cfg.deviceId,
    ...(passcode ? { "X-Access-Passcode": String(passcode) } : {}),
    ...(jti ? { "X-Session-JTI": String(jti) } : {}),
  };
  const body = { jti, expiresAt, meta: { source: "spa", ...meta } };
  const res = await fetch(cfg.gwapiClockInUrl, { method: "POST", headers, credentials: "include", body: JSON.stringify(body) });
  if (!res.ok) {
    let details = null; try { details = await res.json(); } catch { }
    throw friendlyError("CLOCK_IN_FAILED", { status: res.status, body: details });
  }
  try { return await res.json(); } catch { return {}; }
}

function genJti() {
  try {
    if (crypto?.randomUUID) return `web-${cfg.deviceId}-${crypto.randomUUID()}`;
    const r = Math.random().toString(36).slice(2);
    return `web-${cfg.deviceId}-${Date.now()}-${r}`;
  } catch {
    return `web-${cfg.deviceId}-${Date.now()}`;
  }
}

async function probeWsAcceptance(ticket) {
  if (!cfg.wsAuthViaQuery) return true;
  return new Promise((resolve) => {
    let settled = false;
    const url = new URL(cfg.wsUrl);
    url.searchParams.set("ticket", ticket);
    const ws = new WebSocket(url.toString());
    const safeSettle = (ok) => { if (settled) return; settled = true; try { ws.close(1000, "probe-complete"); } catch { } resolve(ok); };
    const reg = () => {
      try {
        ws.send(JSON.stringify({
          type: "REGISTER",
          device: { platform: "web", agent: `web/${navigator.userAgent}`, app_version: "spa-1.0.0", id: cfg.deviceId },
          subscribe: { rooms: [], direct: true },
          cursors: [],
        }));
      } catch { }
      setTimeout(() => safeSettle(true), 250);
    };
    ws.onopen = () => { };
    ws.onmessage = (ev) => {
      let msg; try { msg = JSON.parse(String(ev.data || "")); } catch { msg = {}; }
      if (msg?.type === "WELCOME") reg();
      else if (msg?.type === "ERROR") safeSettle(false);
    };
    ws.onerror = () => safeSettle(false);
    ws.onclose = () => safeSettle(true);
    setTimeout(() => safeSettle(false), 3000);
  });
}

/* ---------------- Public API (SINGLE LOGIN) ---------------- */

/**
 * beginLogin
 * - For expired cookie flows (interactive login).
 * - If a dev access token is available, we use it (treat as real IdP).
 * - Otherwise, redirect the browser to the IdP authorize endpoint.
 */
export async function beginLogin({ passcode, manualIdpAccessToken } = {}) {
  // DUMMY LOGIN: Simulate a successful login
  console.log('[DUMMY AUTH] beginLogin called');
  
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  _accessToken = 'dummy-access-token';
  _ticket = 'dummy-ws-ticket'; // A non-null value to make hasTicket true
  _authUser = 'dummy-user';
  _tenantId = 'dummy-tenant';

  notify(); // Notify listeners (like the router) about the auth state change
  
  return getAuthState(); // Return the new dummy state
}

/**
 * resumeLogin
 * - Cookie-session restore on refresh (no IdP redirect).
 * - Sequence:
 *    1) quick /sid/ping
 *    2) in parallel: /me, /clock/in (idempotent), /ws/ticket
 *    3) require ticket; hydrate store best-effort
 */
export async function resumeLogin() {
  // DUMMY LOGIN: Disabled auto-login on refresh
  return false;
}

// Debug snapshot
export function __authDebug() {
  return { cfg, accessToken: !!_accessToken, hasTicket: !!_ticket, authUser: _authUser, tenantId: _tenantId };
}

// Accessors
export function getAccessToken() { return _accessToken; }
export function getApiAuthHeader() { const tok = _accessToken; return tok ? { Authorization: `Bearer ${tok}` } : {}; }
export function getToken() { return _accessToken; }
export function getWsTicket() { return _ticket; }
export function getTenantId() { return _tenantId; }
export function getAuthUser() { return _authUser; }
