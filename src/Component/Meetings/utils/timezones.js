// Path: /src/Component/Meetings/utils/timezones.js
/**
 * Simple timezone helpers tuned for Africa/Kampala (EAT, UTC+03:00, no DST).
 * These are purpose-built for our client utils to avoid external deps.
 */

const KAMPALA_TZ = "Africa/Kampala";
const KAMPALA_OFFSET_MIN = 3 * 60; // UTC+3, no DST

/** Returns the canonical project timezone string. */
function getProjectTimeZone() {
  return KAMPALA_TZ;
}

/** Returns the fixed offset in minutes for Africa/Kampala (always +180). */
function getProjectTzOffsetMinutes() {
  return KAMPALA_OFFSET_MIN;
}

/**
 * Convert a local wall time in Africa/Kampala to a UTC ISO string.
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {string} timeStr - "HH:mm" (24h)
 * @returns {string} ISO string in UTC
 */
function localKampalaToUTC(dateStr, timeStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  // Treat these as minutes since local midnight (Kampala), subtract offset to reach UTC.
  const utc = Date.UTC(y, m - 1, d, hh, mm) - getProjectTzOffsetMinutes() * 60 * 1000;
  return new Date(utc).toISOString();
}

/**
 * Convert a UTC ISO string to local date/time parts in Africa/Kampala.
 * @param {string|Date} isoUtc
 * @returns {{date: string, time: string}} date "YYYY-MM-DD", time "HH:mm"
 */
function utcToLocalKampala(isoUtc) {
  const t = typeof isoUtc === "string" ? new Date(isoUtc) : isoUtc;
  const ms = t.getTime() + getProjectTzOffsetMinutes() * 60 * 1000;
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return { date: `${y}-${m}-${day}`, time: `${hh}:${mm}` };
}

/**
 * Create a UTC ISO from a local date and minutes since local midnight (Africa/Kampala).
 * @param {string} dateStr "YYYY-MM-DD"
 * @param {number} minutes 0..1440
 */
function localMinutesToUTC(dateStr, minutes) {
  const hh = Math.floor(minutes / 60);
  const mm = minutes % 60;
  return localKampalaToUTC(dateStr, `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
}

/**
 * Get minutes since local midnight (Africa/Kampala) for a given UTC instant.
 * @param {string|Date} isoUtc
 */
function utcToLocalMinutes(isoUtc) {
  const { time } = utcToLocalKampala(isoUtc);
  const [hh, mm] = time.split(":").map(Number);
  return hh * 60 + mm;
}

/** Format a date/time in Kampala (helpful for UI logs). */
function formatInKampala(isoUtc) {
  const { date, time } = utcToLocalKampala(isoUtc);
  return `${date} ${time} EAT`;
}

module.exports = {
  getProjectTimeZone,
  getProjectTzOffsetMinutes,
  localKampalaToUTC,
  utcToLocalKampala,
  localMinutesToUTC,
  utcToLocalMinutes,
  formatInKampala,
};
