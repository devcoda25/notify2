// src/TeamInbox/constants/CHANNELS.js
// Use: Canonical channel identifiers (frontend-facing) + in-app subdivisions.
// Works with: mappers, filters, composer hints, API/WS payloads.
// Uses: No imports. Frozen at runtime.

export const CHANNELS = Object.freeze({
  EMAIL: "email",
  SMS: "sms",
  WABA: "waba",         // WhatsApp Business (WhatsApp API)
  INAPP: "inapp",       // In-app / WS (see INAPP_SUBCHANNELS for subdivisions)
  VOICE: "voice",       // IVR / call interactions
  PUSH: "push",         // Push to mobile/app
});

/**
 * In-app subchannels (refine CHANNELS.INAPP).
 * - insider: employee ↔ employee (internal)
 * - sdk: end-user via embedded widget / SDK
 * - personal: agent’s personal scratch / self-chat & informal tickets
 * - room: ad-hoc in-app rooms not covered by the above (general lobby etc.)
 */
export const INAPP_SUBCHANNELS = Object.freeze({
  INSIDER: "insider",
  SDK: "sdk",
  PERSONAL: "personal",
  ROOM: "room",
});
