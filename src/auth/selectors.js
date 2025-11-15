// /src/auth/selectors.js
// Small, reusable selectors to keep feature hooks simple.
// Works with: /src/auth/user.store.js
// Party-first: currentUser.id === partyId. No tenantId.

export const selectCurrentUser = (s) => s.currentUser;
export const selectIsHydrated  = (s) => s.isHydratedFromAuth;

/**
 * A user is "ready" when:
 * - we've hydrated from auth (claims/profile loaded),
 * - and we have a stable party id on currentUser.id.
 */
export function isUserReady(state) {
  const u = state.currentUser || {};
  return !!state.isHydratedFromAuth && !!u.id;
}

/**
 * Scope key used to separate caches (rooms, tickets, etc.)
 * In a pure party-first world, the scope is just the partyId.
 */
export function getUserScopeKey(state) {
  const u = state.currentUser || {};
  const pid = u.id || "";
  return pid ? String(pid) : "";
}
