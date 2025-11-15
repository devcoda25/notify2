// /src/auth/setupUserAuthBridge.js
// Bridges authAgent → global user store (party-first), boots WS presence,
// and defers ALL REST enrichment to the STORE (owner of state).

import { onAuthChange, getAuthClaims, getAuthState } from "./authAgent";
import { useUserStore } from "./user.store";
import * as wsbus from "./ws/wsClient";

let _installed = false;
let _unsubAuth = null;
let _unsubBridge = null;

/* ---------------- helpers ---------------- */

function pick(v) { return v === undefined || v === null ? undefined : v; }
function firstRole(roles) {
  return Array.isArray(roles) && roles.length ? String(roles[0]) : undefined;
}

function claimsToIdentity(claims = {}) {
  const id = claims.sub || claims.id || "";
  const name = claims.name || claims.preferred_username || claims.email || id || "User";
  return {
    userId: id,
    displayName: name,
    email: pick(claims.email),
    avatarUrl: pick(claims.picture),
    role: pick(claims.role || firstRole(claims.roles)),
    _rawClaims: claims,
  };
}

function hydrateFromAuth() {
  const raw = (typeof getAuthClaims === "function" ? getAuthClaims() : {}) || {};
  const id = claimsToIdentity(raw);

  const st = useUserStore.getState();
  // keep auth flags in sync
  try {
    const as = getAuthState?.() || {};
    st.setAuthState?.({ hasTicket: !!as.hasTicket, authUser: as.authUser });
  } catch {}

  if (typeof st.hydrateFromClaims === "function") {
    st.hydrateFromClaims({
      sub: id.userId,
      name: id.displayName,
      email: id.email,
      picture: id.avatarUrl,
      role: id.role,
      roles: Array.isArray(raw.roles) ? raw.roles : (id.role ? [id.role] : []),
    });
  } else if (typeof st.mergeProfile === "function") {
    st.mergeProfile({
      displayName: id.displayName,
      email: id.email,
      avatarUrl: id.avatarUrl,
      role: id.role,
    });
  }
}

/* ---------------- main ---------------- */

export function setupUserAuthBridge() {
  if (_installed) return;
  _installed = true;

  // 1) Hydrate identity from in-memory claims
  try { hydrateFromAuth(); } catch {}

  // 1b) Proactively fetch rich /me to reduce UI role/name flash on reload
  try { useUserStore.getState().fetchPartyEnrichmentViaGwapi?.(); } catch {}

  // 2) Connect WS immediately if we already have a ticket
  try {
    const s = getAuthState?.() || {};
    if (s.hasTicket) wsbus.connectAndRegister();
  } catch {}

  // 3) Start WS → presence reconciliation bridge (idempotent)
  if (_unsubBridge) { try { _unsubBridge(); } catch {} }
  if (typeof useUserStore.getState().initPresenceBridge === "function") {
    _unsubBridge = useUserStore.getState().initPresenceBridge(wsbus);
  }

  // 4) React to future auth changes
  if (_unsubAuth) { try { _unsubAuth(); } catch {} }
  _unsubAuth = onAuthChange((state) => {
    const store = useUserStore.getState();
    try {
      store.setAuthState?.({ hasTicket: !!state?.hasTicket, authUser: state?.authUser });
      hydrateFromAuth();

      if (state?.hasTicket) {
        wsbus.connectAndRegister();
        // Ensure we reconcile with rich /me once ticket exists
        store.fetchPartyEnrichmentViaGwapi?.();
      } else {
        wsbus.close(1000, "auth-logout");
      }
    } catch {}
  });
}

export function teardownUserAuthBridge() {
  if (_unsubAuth) { try { _unsubAuth(); } catch {} }
  if (_unsubBridge) { try { _unsubBridge(); } catch {} }
  try { wsbus.close(1000, "teardown"); } catch {}
  _unsubAuth = _unsubBridge = null;
  _installed = false;
}
