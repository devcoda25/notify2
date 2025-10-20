// Path: src/Component/Meetings/constants/booking.constants.js

/**
 * Booking flow constants (client-only).
 * Keep this file free of any runtime logic or imports.
 */

/** Step labels used by the Booking wizard (public + internal). */
export const STEPS = Object.freeze([
  "Book a slot",
  "Your details",
  "Confirm",
  "Scheduled",
]);

/** Lightweight email validator (UI-level only; server-side rules may differ). */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Common, user-facing timezones (keep short for dropdowns). */
export const COMMON_TZS = Object.freeze([
  "Africa/Kampala",
  "Africa/Nairobi",
  "UTC",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
  "Asia/Kolkata",
]);

/**
 * Fallback host profiles (used when an eventType does not provide hostProfile).
 * Keys are ownerIds. Extend safely without breaking existing ones.
 */
export const HOST_PROFILES = Object.freeze({
  usr_alpha: Object.freeze({
    name: "alpha alpha",
    email: "alpha@notify.local",
    organization: "Notify / PBX",
    website: "notify.local",
    location: "Kampala, Uganda",
    logoUrl: "", // optional avatar/logo URL
  }),
});

/** Aggregate default export for convenience (optional). */
const bookingConstants = {
  STEPS,
  EMAIL_RE,
  COMMON_TZS,
  HOST_PROFILES,
};

export default bookingConstants;
