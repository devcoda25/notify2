
// Path: src/Component/Meetings/utils/phone.js
// --- Lightweight fallbacks specific to Booking UI ---
import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Reuse-first phone utilities for Booking.
 *
 * - Re-exports everything from Contacts' phone utils (if you already consume those, nothing breaks).
 * - Adds small, dependency-light helpers used by Booking screens.
 * - Client-only. No network. Safe to tree-shake.
 */

export * from "../../contacts/utils/phone.jsx"; // reuse existing named exports

/**
 * Try to parse either national digits (w/ countryIso) or an E.164 string.
 * Returns a libphonenumber object (with .isValid(), .formatX(), etc.) or null.
 */
export function tryParse(nationalOrE164 = "", countryIso = "UG") {
  const raw = String(nationalOrE164 || "").trim();
  if (!raw) return null;

  // Already looks like E.164?
  if (/^\+\d{6,15}$/.test(raw)) {
    try { return parsePhoneNumberFromString(raw); } catch { return null; }
  }

  // Otherwise treat as national digits + ISO
  try {
    const p = parsePhoneNumberFromString(raw.replace(/\D/g, ""), countryIso);
    return p || null;
  } catch {
    return null;
  }
}

/** Return E.164 (e.g., +256700000000) or empty string if invalid. */
export function toE164(nationalOrE164 = "", countryIso = "UG") {
  const p = tryParse(nationalOrE164, countryIso);
  return p && p.isValid() ? p.format("E.164") : "";
}

/** Quick plausibility check for user typing (not strict validation). */
export function isPossible(nationalOrE164 = "", countryIso = "UG") {
  const p = tryParse(nationalOrE164, countryIso);
  return Boolean(p && (p.isValid() || p.isPossible?.()));
}

/** Format for display (international if valid, else digits-only fallback). */
export function formatIntl(nationalOrE164 = "", countryIso = "UG") {
  const p = tryParse(nationalOrE164, countryIso);
  if (p && p.isValid?.()) return p.formatInternational();
  return String(nationalOrE164 || "").replace(/\D/g, "");
}

/** Common helper for the Booking form: national digits → E.164 (or "") */
export function normalizeNationalToE164(nationalDigits = "", countryIso = "UG") {
  const digits = String(nationalDigits || "").replace(/\D/g, "");
  return toE164(digits, countryIso);
}
