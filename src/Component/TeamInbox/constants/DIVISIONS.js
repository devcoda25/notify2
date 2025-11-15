// src/TeamInbox/constants/DIVISIONS.js
// Use: Canonical division names + helper to normalize legacy inputs.

export const DIVISIONS = Object.freeze({
  INSIDER: "insider",
  PERSONAL: "personal",
  BUSINESS: "business",
});

// Legacy → Canonical mapping (frontend compatibility layer)
const LEGACY_TO_CANON = Object.freeze({
  employee: DIVISIONS.INSIDER,
  private: DIVISIONS.PERSONAL,
  business: DIVISIONS.BUSINESS,
});

/**
 * Normalize backend or legacy input into canonical division keys.
 * Defaults to BUSINESS when unknown.
 * @param {string} v
 * @returns {"insider"|"personal"|"business"}
 */
export function normalizeDivision(v) {
  if (!v) return DIVISIONS.BUSINESS;
  const key = String(v).toLowerCase();
  return LEGACY_TO_CANON[key] || (Object.values(DIVISIONS).includes(key) ? key : DIVISIONS.BUSINESS);
}
