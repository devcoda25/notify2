// Path: src/Component/Meetings/utils/hostProfile.js

/**
 * Host profile helpers.
 * Kept small and framework-agnostic.
 */

import { HOST_PROFILES } from "../constants/booking.constants";

/**
 * Resolve a host profile for display.
 * Prefers eventType.hostProfile, then falls back to a known ownerId profile,
 * then returns a generic profile.
 */
export function resolveHostProfile({ eventType, ownerType, ownerId }) {
  const fromEvent = eventType?.hostProfile;
  if (fromEvent && (fromEvent.name || fromEvent.email)) return sanitize(fromEvent);

  const fallback = (HOST_PROFILES && HOST_PROFILES[ownerId]) || {};
  return sanitize({
    name: fallback.name || "Meeting Host",
    email: fallback.email || "",
    organization: fallback.organization || "",
    website: fallback.website || "",
    location: fallback.location || "",
    logoUrl: fallback.logoUrl || "",
  });
}

/** Compute initials from a name (first two words). */
export function initials(name = "") {
  const parts = String(name).trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("");
}

/** Make sure only expected fields are returned (avoid leaking extras). */
function sanitize(p = {}) {
  return {
    name: String(p.name || ""),
    email: String(p.email || ""),
    organization: String(p.organization || ""),
    website: String(p.website || ""),
    location: String(p.location || ""),
    logoUrl: String(p.logoUrl || ""),
  };
}

export default { resolveHostProfile, initials };
