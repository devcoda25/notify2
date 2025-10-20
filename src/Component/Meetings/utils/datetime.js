// Path: src/Component/Meetings/utils/datetime.js

/**
 * Tiny date/time helpers for the booking UI.
 * No external deps; safe for client-only usage.
 */

const DEFAULT_TZ = "Africa/Kampala";

/** YYYY-MM-DD from a Date (local date of that Date object). */
export function toISODate(dateObj) {
  const d = new Date(dateObj);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Format a time (or date-time) in a specific IANA timezone.
 * @param {string|number|Date} dateish
 * @param {string} [tz=DEFAULT_TZ]
 */
export function fmtTime(dateish, tz = DEFAULT_TZ) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: tz,
    }).format(new Date(dateish));
  } catch {
    const d = new Date(dateish);
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
}

/** Start of today (00:00:00.000) in the browser’s local time. */
export function startOfToday() {
  const n = new Date();
  n.setHours(0, 0, 0, 0);
  return n;
}

/** Add whole days, return a new Date at 00:00 local time. */
export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Add whole months, clamp to the 1st and 00:00 for calendar paging. */
export function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Safely coerce into a valid Date or return null. */
export function safeDate(v) {
  const d = v ? new Date(v) : null;
  return d && !isNaN(d.getTime()) ? d : null;
}

/** Optional helper: Localized long day label from "YYYY-MM-DD". */
export function humanDayISO(isoYYYYMMDD) {
  try {
    const d = new Date(`${isoYYYYMMDD}T00:00:00`);
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoYYYYMMDD;
  }
}

export default {
  toISODate,
  fmtTime,
  startOfToday,
  addDays,
  addMonths,
  safeDate,
  humanDayISO,
};
