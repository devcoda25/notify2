// /src/auth/ws/wsClient.js
// Cookie-auth WS client with REGISTER/SYNC/PING and a tiny event bus.
// Exports: on, send, close, getState, connectAndRegister
//          + shims used by ws.service.js: addEventListener, removeEventListener,
//            subscribe, onMessage/onOpen/onClose/onError/onReconnect, connect
//          + presence helpers: sendPresenceSet, sendBreakStart, sendBreakEnd

const DEFAULT_URL = process.env.REACT_APP_WS_URL || "ws://localhost:8080/ws";
const HANDSHAKE_TIMEOUT_MS = 7000;
const PING_EVERY_MS = 25000;
const isDev = process.env.NODE_ENV !== "production";
const LOG = (...a) => { if (isDev) console.log("[wsClient", new Date().toISOString(), "]", ...a); };

let sock = null;
let status = "closed";
let currentUrl = DEFAULT_URL;
let connectPromise = null;
let pendingFrames = [];

const listeners = {
  open: new Set(),
  close: new Set(),
  error: new Set(),
  message: new Set(),
  reconnect: new Set(),
  registered: new Set(),
};

let pingTimer = null;
let handshakeTimer = null;

// ---------- tiny bus ----------
function emit(type, payload) {
  const set = listeners[type];
  if (!set) return;
  for (const cb of [...set]) {
    try { cb(payload); } catch (e) { console.warn("[wsClient] listener error", e); }
  }
}
export function on(event, cb) {
  if (!listeners[event]) listeners[event] = new Set();
  listeners[event].add(cb);
  return () => listeners[event]?.delete(cb);
}
function setStatus(s) {
  if (status === s) return;
  status = s;
  if (s === "open") emit("open");
  else if (s === "registered") emit("registered");
  else if (s === "closed") emit("close");
  else if (s === "error") emit("error");
}
export function getState() {
  return { status, connected: status === "open" || status === "registered", url: currentUrl };
}

// ---------- timers ----------
function clearTimer(t) { if (t) clearTimeout(t); return null; }
function stopHandshakeTimer() { handshakeTimer = clearTimer(handshakeTimer); }
function startHandshakeTimer(reject) {
  stopHandshakeTimer();
  handshakeTimer = setTimeout(() => {
    LOG("handshake timeout");
    try { sock?.close(4000, "handshake-timeout"); } catch { }
    reject?.(new Error("WS handshake timeout"));
  }, HANDSHAKE_TIMEOUT_MS);
}
function stopPingLoop() { if (pingTimer) clearInterval(pingTimer); pingTimer = null; }
function startPingLoop() {
  stopPingLoop();
  pingTimer = setInterval(() => {
    try {
      if (sock && sock.readyState === WebSocket.OPEN) {
        const ts = Date.now();
        LOG("→ ping", ts);
        sock.send(JSON.stringify({ type: "ping", ts }));
      }
    } catch { }
  }, PING_EVERY_MS);
}

// ---------- internal send helpers ----------
function assertOpen() {
  if (!sock || sock.readyState !== WebSocket.OPEN) {
    const e = new Error("ws not open");
    e.code = "WS_NOT_OPEN";
    throw e;
  }
}
function sendRaw(objOrStr) {
  const frame = typeof objOrStr === "string" ? objOrStr : JSON.stringify(objOrStr);
  const t = typeof objOrStr === "string" ? "TEXT" : (objOrStr?.type || "frame");
  LOG("→", t);
  if (sock && sock.readyState === WebSocket.OPEN) {
    sock.send(frame);
  } else {
    pendingFrames.push(frame);
    if (pendingFrames.length > 20) pendingFrames.shift(); // drop oldest
  }
}

// Public: generic sender — preferred for app frames.
export function send(type, payload = {}) {
  const frame = { type, ...(payload && typeof payload === "object" ? payload : {}) };
  sendRaw(frame);
}

// ---------- socket wiring ----------
function wireSocket(resolve, reject, registerOpts) {
  sock.onopen = () => {
    LOG("socket open");
    setStatus("open");
    try { for (const f of pendingFrames.splice(0)) sock.send(f); } catch { }
  };

  sock.onmessage = (ev) => {
    let msg;
    try { msg = JSON.parse(String(ev.data || "")); }
    catch { msg = { type: "message", data: ev.data }; }

    // bubble raw frame for consumers (raw string for compatibility)
    emit("message", { data: ev.data });

    // ── DEV: presence echo tracer (lowest level) ────────────────────────────
    try {
      const t = String(msg?.type || "");
      if (t === "presence.update" || t === "presence.telemetry") {
        LOG("← PRESENCE_ECHO (raw)", msg);
      }
    } catch { }
    // -----------------------------------------------------------------------

    if (msg?.type === "WELCOME") {
      LOG("← frame", { type: "WELCOME" });
      stopHandshakeTimer();

      const payload = {
        type: "REGISTER",
        device: {
          platform: "web",
          agent: `web/${navigator.userAgent}`,
          app_version: "spa-1.0.0",
          id: (process.env.REACT_APP_DEVICE_ID || "dev-web-test-001"),
        },
        subscribe: { rooms: [], direct: true },
        cursors: Array.isArray(registerOpts?.cursors) ? registerOpts.cursors : [],
      };
      LOG("→ REGISTER", { rooms: 0, cursors: payload.cursors.length });
      try { sendRaw(payload); } catch (e) { return reject?.(e); }

      if (registerOpts?.syncOnStart) {
        const limit = Number.isFinite(registerOpts?.limit) ? registerOpts.limit : 50;
        const sync = { type: "sync", since: registerOpts?.since || null, limit };
        setTimeout(() => {
          LOG("→ sync", { sinceCount: Array.isArray(sync.since) ? sync.since.length : 0, limit });
          try { sendRaw(sync); } catch { }
        }, 250);
      }

      startPingLoop();
      return resolve?.(true);
    }

    if (msg?.type === "READY" || msg?.type === "REGISTERED") {
      LOG("← frame", { type: "REGISTERED" });
      setStatus("registered");
      return; // status setter triggers "registered" event
    }

    if (String(msg?.type).toLowerCase() === "pong") {
      LOG("← frame", { type: "pong" });
      return;
    }

    if (msg?.type === "ERROR" || msg?.type === "ERROR_FRAME") {
      LOG("← frame", { type: "ERROR", code: msg.code, reason: msg.reason });
      setStatus("error");
    }
  };

  sock.onerror = (e) => {
    LOG("socket error", e?.message || e);
    setStatus("error");
    emit("error", e);
  };

  sock.onclose = (e) => {
    LOG("socket closed", e?.code, e?.reason);
    stopHandshakeTimer();
    stopPingLoop();
    setStatus("closed");
    // Hint so callers can re-assert presence on next connect
    emit("reconnect");
  };
}

// ---------- public connect ----------
export function connectAndRegister(optsOrUrl, maybeOpts) {
  const isUrlPassed = typeof optsOrUrl === "string";
  const url = isUrlPassed ? optsOrUrl : currentUrl;
  const opts = isUrlPassed ? (maybeOpts || {}) : (optsOrUrl || {});
  currentUrl = url || DEFAULT_URL;

  if (connectPromise) return connectPromise;
  connectPromise = new Promise((resolve, reject) => {
    if (sock && sock.readyState === WebSocket.OPEN) {
      LOG("connect: already open");
      return resolve(true);
    }

    LOG("connect: begin", { url: currentUrl, HANDSHAKE_TIMEOUT_MS });
    try { sock?.close(1000, "reconnect"); } catch { }
    stopPingLoop();
    stopHandshakeTimer();

    sock = new WebSocket(currentUrl);
    startHandshakeTimer(reject);
    wireSocket(resolve, reject, opts);
  }).finally(() => { connectPromise = null; });
}

// ---------- close ----------
export function close(code = 1000, reason = "client-close") {
  try { sock?.close(code, reason); } catch { }
  stopPingLoop();
  stopHandshakeTimer();
  setStatus("closed");
}

// ---------- presence helpers (unified lower-case dotted) ----------
/**
 * sendPresenceSet
 * @param {"ONLINE"|"AWAY"|"OFFLINE"|"BUSY"|string} statusUpper
 * @param {string=} reason
 */
export function sendPresenceSet(statusUpper, reason) {
  const status = String(statusUpper || "").toUpperCase();
  if (!status) return;
  send("presence.set", { status, ...(reason ? { reason } : {}) });
}
export function sendBreakStart(code) {
  const payload = {};
  if (code != null && String(code)) payload.code = String(code);
  send("presence.break_start", payload);
}
export function sendBreakEnd() {
  send("presence.break_end", {});
}
export function _raw() { return sock; }

// ---------- compatibility shims ----------
export function addEventListener(event, cb) { return on(event, cb); }
export function removeEventListener(event, cb) { try { listeners[event]?.delete(cb); } catch { } }
export function subscribe(event, cb) { return on(event, cb); }
export function onMessage(cb) { return on("message", cb); }
export function onOpen(cb) { return on("open", cb); }
export function onClose(cb) { return on("close", cb); }
export function onError(cb) { return on("error", cb); }
export function onReconnect(cb) { return on("reconnect", cb); }
export function connect(url, opts) { return connectAndRegister(url, opts); }
