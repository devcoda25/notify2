// Path: src/Component/Meetings/utils/slotProbe.js

/** Normalize weekday (accept ISO 1–7 or JS 0–6) => JS 0–6 */
function normalizeWeekday(w) {
  const n = Number(w);
  if (n >= 0 && n <= 6) return n;      // JS
  if (n >= 1 && n <= 7) return n % 7;  // ISO -> JS
  return null;
}

const JS_TO_DAY = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

/** Parse HH:MM -> minutes */
function toMins(hhmm) {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(":").map((n) => parseInt(n || "0", 10));
  return h * 60 + m;
}

/** Get tz offset in minutes for a given calendar date (YYYY-MM-DD) at 00:00 local time */
function getOffsetMinutes(tz, y, m, d) {
  try {
    // Build the "same moment" in UTC and in the target tz, then diff.
    const utcMidnight = new Date(Date.UTC(y, m, d, 0, 0, 0));
    const asZoned = new Date(
      new Date(utcMidnight).toLocaleString("en-US", { timeZone: tz || "UTC" })
    );
    // (zoned - utc) gives local offset minutes
    const mins = Math.round((asZoned.getTime() - utcMidnight.getTime()) / 60000);
    return mins;
  } catch {
    return 0;
  }
}

/** Build ISO string in UTC from a local date+minutes-of-day in tz */
function localMinutesToISO(dateStr, minutesOfDay, tz) {
  const [Y, M, D] = dateStr.split("-").map((n) => parseInt(n, 10));
  const offset = getOffsetMinutes(tz, Y, M - 1, D);
  const hh = Math.floor(minutesOfDay / 60);
  const mm = minutesOfDay % 60;
  // local wall time -> UTC by subtracting offset
  const utc = new Date(Date.UTC(Y, M - 1, D, hh, mm));
  utc.setUTCMinutes(utc.getUTCMinutes() - offset);
  return utc.toISOString();
}

/** Simple inclusive date iter */
function* iterDates(startDate, endDate) {
  const d = new Date(`${startDate}T00:00:00Z`);
  const last = new Date(`${endDate}T00:00:00Z`);
  while (d <= last) {
    yield d.toISOString().slice(0, 10);
    d.setUTCDate(d.getUTCDate() + 1);
  }
}

/**
 * generateSlotsFromRules
 * A tiny probe that produces bookable slots from weekly rules.
 * - rules: [{ weekday: ISO(1–7) or JS(0–6), weekdayJS?: 0–6, intervals:[{start:"HH:MM", end:"HH:MM"}] }]
 * - timezone: e.g. "Africa/Kampala"
 * - startDate/endDate: "YYYY-MM-DD"
 */
export function generateSlotsFromRules(
  rules = [],
  timezone = "UTC",
  startDate,
  endDate,
  { slotSizeMinutes = 30 } = {}
) {
  const byJS = new Map(); // js weekday -> [{start,end}]
  for (const r of rules) {
    const js = r.weekdayJS != null ? Number(r.weekdayJS) : normalizeWeekday(r.weekday);
    if (js == null) continue;
    const arr = byJS.get(js) || [];
    for (const iv of r.intervals || []) {
      const a = toMins(iv.start);
      const b = toMins(iv.end);
      if (b > a) arr.push([a, b]);
    }
    byJS.set(js, arr);
  }

  const out = { days: {}, slotSizeMinutes };
  for (const dateStr of iterDates(startDate, endDate)) {
    const js = new Date(`${dateStr}T00:00:00Z`).getUTCDay(); // 0–6 (Sun–Sat)
    const ivs = byJS.get(js) || [];
    const slots = [];
    for (const [a, b] of ivs) {
      for (let t = a; t + slotSizeMinutes <= b; t += slotSizeMinutes) {
        const startISO = localMinutesToISO(dateStr, t, timezone);
        const endISO = localMinutesToISO(dateStr, t + slotSizeMinutes, timezone);
        slots.push({ start: startISO, end: endISO });
      }
    }
    out.days[dateStr] = slots;
  }
  return out;
}
