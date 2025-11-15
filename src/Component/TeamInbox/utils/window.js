// src/TeamInbox/utils/window.js
// Use: Pure helpers for chat-window calculations (24h or provider-specific).
// Works with: ChatPane (markers), TicketsCard (labeling), useComposer (enable/disable send).
// Uses: No imports. Pure, no side effects.

/**
 * Is the chat window considered open right now?
 * Accepts Date|string|number for start/end. Missing start means "open" unless end is present.
 */
export function isOpen(now = new Date(), startAt, endAt) {
  const t = toMs(now);
  const s = toMs(startAt);
  const e = toMs(endAt);
  if (e != null && t > e) return false;
  if (s != null && t < s) return false;
  return true;
}

/** Milliseconds until expiration; returns 0 if expired or no endAt. */
export function expiresInMs(now = new Date(), endAt) {
  const t = toMs(now);
  const e = toMs(endAt);
  if (e == null) return 0;
  return Math.max(0, e - t);
}

/**
 * Compute marker placements for a timeline renderer.
 * Returns normalized { startsAt?: ISO, endsAt?: ISO } or nulls if not provided.
 */
export function markers(startAt, endAt) {
  const s = toIso(startAt);
  const e = toIso(endAt);
  return { startsAt: s || null, endsAt: e || null };
}

/** Clamp a nominal 24h window from a given base time (e.g., last customer message). */
export function window24hFrom(base) {
  const s = toMs(base);
  if (s == null) return { startsAt: null, endsAt: null };
  const e = s + 24 * 60 * 60 * 1000;
  return { startsAt: new Date(s).toISOString(), endsAt: new Date(e).toISOString() };
}

function toMs(x) {
  if (x == null) return null;
  if (x instanceof Date) return x.getTime();
  const d = new Date(x);
  if (isNaN(d.getTime())) return null;
  return d.getTime();
}

function toIso(x) {
  const ms = toMs(x);
  return ms == null ? null : new Date(ms).toISOString();
}
