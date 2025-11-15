// /src/boot/bootstrap.js
// SPA bootstrap: fast session resume + rich /me hydration via the store (single login).
// Design goals:
//  - Fast fail for session resume (no 5–10s “mystery wait”).
//  - Let private routes decide redirect as soon as we know there’s no session.
//  - Hydrate UI identity/presence from a single rich /me call (store-owned).

// --- tiny utility: timeout promise ---
const timeout = (ms, label = "bootstrap:timeout") =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(label)), ms));

// --- 1) Minimal synchronous “param tap” so dev deep-links can set auth quickly ---
export function syncBootstrap() {
  try {
    const params = new URLSearchParams(window.location.search);
    const x = params.get("x_authuser");
    if (x) {
      sessionStorage.setItem("auth", "true");
      sessionStorage.setItem("authUser", x);
    }
  } catch {}
}

// --- 2) Async bootstrap orchestrator (single-login world) ---
export async function asyncBootstrap({ signal } = {}) {
  const { resumeLogin, getAuthState } = await import("../auth/authAgent.js");
  const storeMod = await import("../auth/user.store.js").catch(() => ({}));
  const store = storeMod?.useUserStore?.getState?.();

  // Step A: Try to restore via cookie-backed session (fast race).
  // If we already have a ticket, skip; otherwise attempt resume.
  try {
    if (!getAuthState().hasTicket) {
      await Promise.race([
        resumeLogin(),                 // establishes session + WS ticket using cookie if present
        timeout(900, "resumeLogin:timeout"),
      ]);
    }
  } catch {
    // Swallow — private routes will check auth state and redirect if needed
  }

  // Step B: Ask the STORE to enrich from /me (single endpoint, de-duplicated inside the store).
  try {
    const m = await import("../auth/user.store.js");
    await Promise.race([
      m?.useUserStore?.getState?.().fetchPartyEnrichmentViaGwapi?.(),
      timeout(2000, "fetchPartyEnrichmentViaGwapi:timeout"),
    ]);
  } catch {
    // don’t block boot if store isn’t ready
  }

  // Step C: Publish auth state to the store and signal we’re done checking.
  try {
    const s = getAuthState();
    store?.setAuthState?.({ hasTicket: !!s?.hasTicket, authUser: s?.authUser });
    store?.finishAuthCheck?.();
  } catch {}

  if (signal?.aborted) throw new Error("bootstrap:aborted");
  return true;
}
