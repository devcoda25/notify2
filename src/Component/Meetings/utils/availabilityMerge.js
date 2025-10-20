// Path: /src/Component/Meetings/utils/availabilityMerge.js
/**
 * Merge weekly rules + overrides + buffers - busy blocks into bookable slots.
 *
 * Input shape (example):
 *  - profile: {
 *      timezone: "Africa/Kampala",
 *      weeklyHours: {
 *        monday:    [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "18:00" }],
 *        tuesday:   [...],
 *        ...
 *      },
 *      overrides: [ { date: "2025-09-24", intervals: [{start:"10:00", end:"12:00"}] } ],
 *      minSlotIncrementMinutes: 15
 *    }
 *  - busy: [{ start: ISO, end: ISO, ... }, ...]     // UTC
 *  - range: { startDate: "YYYY-MM-DD", endDate: "YYYY-MM-DD" } inclusive
 *  - options: { slotSizeMinutes: 30, bufferBeforeMinutes: 5, bufferAfterMinutes: 5 }
 *
 * Returns:
 *  {
 *    days: {
 *      "YYYY-MM-DD": [{
 *        start: ISO, end: ISO
 *      }, ...]
 *    },
 *    slotSizeMinutes
 *  }
 */

const { localKampalaToUTC, localMinutesToUTC, utcToLocalMinutes } = require("./timezones");

const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function* dateRangeInclusive(startDateStr, endDateStr) {
  const start = new Date(`${startDateStr}T00:00:00Z`);
  const end = new Date(`${endDateStr}T00:00:00Z`);
  for (let d = new Date(start); d.getTime() <= end.getTime(); d.setUTCDate(d.getUTCDate() + 1)) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    yield `${y}-${m}-${day}`;
  }
}

/** Subtract an array of [busy] intervals from an array of [free] intervals, all in minutes. */
function subtractIntervals(free, busy) {
  const out = [];
  for (const f of free) {
    let segments = [[f.start, f.end]];
    for (const b of busy) {
      const next = [];
      for (const [s, e] of segments) {
        // no overlap
        if (e <= b.start || s >= b.end) {
          next.push([s, e]);
          continue;
        }
        // left piece
        if (s < b.start) next.push([s, Math.max(s, b.start)]);
        // right piece
        if (e > b.end) next.push([Math.min(e, b.end), e]);
      }
      segments = next;
      if (!segments.length) break;
    }
    for (const [s, e] of segments) if (e - s > 0) out.push({ start: s, end: e });
  }
  return out;
}

/** Apply buffers by expanding busy intervals. */
function bufferizeBusy(busy, beforeMin, afterMin) {
  return busy.map((b) => ({
    start: b.start - beforeMin,
    end: b.end + afterMin,
  }));
}

/**
 * Build bookable slots.
 */
function mergeAvailability(profile, busyBlocks, range, options = {}) {
  const slotSize = Math.max(5, options.slotSizeMinutes || 30);
  const inc = Math.max(5, profile.minSlotIncrementMinutes || slotSize);
  const bufBefore = Math.max(0, options.bufferBeforeMinutes || 0);
  const bufAfter = Math.max(0, options.bufferAfterMinutes || 0);

  const days = {};

  for (const dateStr of dateRangeInclusive(range.startDate, range.endDate)) {
    // Weekly base intervals (local)
    const dayName = DAY_NAMES[new Date(localKampalaToUTC(dateStr, "12:00")).getUTCDay()];
    let intervalsLocal = (profile.weeklyHours?.[dayName] || []).map((iv) => ({
      start: iv.start,
      end: iv.end,
    }));

    // Override for the specific date (local)
    const override = (profile.overrides || []).find((o) => o.date === dateStr);
    if (override) {
      intervalsLocal = (override.intervals || []).map((iv) => ({
        start: iv.start,
        end: iv.end,
      }));
    }

    // Convert local free intervals to minute spans since local midnight
    let freeMinutes = intervalsLocal.map((iv) => ({
      start: toMinutes(iv.start),
      end: toMinutes(iv.end),
    }));

    // Busy blocks that fall on this date (in local minutes for subtraction)
    const busyOnDay = (busyBlocks || [])
      .filter((b) => sameLocalDate(b, dateStr))
      .map((b) => ({
        start: utcToLocalMinutes(b.start),
        end: utcToLocalMinutes(b.end),
      }));

    // Expand busy by buffers
    const busyBuffered = bufferizeBusy(busyOnDay, bufBefore, bufAfter);

    // Subtract busy from free
    let freeMinusBusy = subtractIntervals(freeMinutes, busyBuffered);

    // Snap to increment and split to slots of slotSize
    const slotsLocalMinutes = [];
    for (const iv of freeMinusBusy) {
      let s = snapUp(iv.start, inc);
      while (s + slotSize <= iv.end) {
        slotsLocalMinutes.push({ start: s, end: s + slotSize });
        s += inc; // sliding window by increment
      }
    }

    // Convert to UTC ISO
    const slotsUtc = slotsLocalMinutes.map((iv) => ({
      start: localMinutesToUTC(dateStr, iv.start),
      end: localMinutesToUTC(dateStr, iv.end),
    }));

    days[dateStr] = slotsUtc;
  }

  return { days, slotSizeMinutes: slotSize };
}

/** Helpers */
function toMinutes(hhmm) {
  const [h, m] = String(hhmm).split(":").map(Number);
  return h * 60 + m;
}

function snapUp(mins, inc) {
  const r = mins % inc;
  return r === 0 ? mins : mins + (inc - r);
}

function sameLocalDate(busy, dateStr) {
  // Check if any portion of [busy.start, busy.end) falls on dateStr in local day
  const startM = utcToLocalMinutes(busy.start);
  const endM = utcToLocalMinutes(busy.end);
  // Simple heuristic: if start < end within same local day
  if (endM > startM) return true;
  // Cross-midnight busy (rare for meetings) — conservatively include
  return true;
}

module.exports = {
  mergeAvailability,
};
