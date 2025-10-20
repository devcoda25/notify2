// Path: src/Component/Meetings/hooks/useDaySlots.js
import { useEffect, useMemo, useState } from "react";
import { toISODate } from "../utils/datetime";
import { useAvailabilityStore } from "../../store/scheduling/useAvailabilityStore";
import { useMeetingsStore } from "../../store/scheduling/useMeetingsStore";

/**
 * Compute + filter slots for a single day, client-only.
 * Reads from availability + meetings stores; no network calls.
 */
export default function useDaySlots({
  ownerType,
  ownerId,
  eventType,            // expects { durationMinutes, bufferBeforeMinutes, bufferAfterMinutes }
  pickedDay,            // Date
}) {
  const av = useAvailabilityStore();
  const mtg = useMeetingsStore();

  const dayISO = pickedDay ? toISODate(pickedDay) : null;

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const busyBlocks = useMemo(() => getBusyBlocksLocalDay(mtg, { ownerType, ownerId, dayISO }), [
    mtg, ownerType, ownerId, dayISO,
  ]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!eventType || !dayISO) {
        setSlots([]);
        return;
      }
      setLoading(true);
      try {
        // Ensure fixtures exist in purely client runs.
        av.loaded || av.loadFixtures?.();
        mtg.loaded || mtg.loadFixtures?.();

        const merged = await av.computeSlots?.(
          { ownerType, ownerId },
          { startDate: dayISO, endDate: dayISO },
          {
            slotSizeMinutes: eventType.durationMinutes || 30,
            bufferBeforeMinutes: eventType.bufferBeforeMinutes || 5,
            bufferAfterMinutes: eventType.bufferAfterMinutes || 5,
          }
        );

        const raw = (merged?.days?.[dayISO] || []).slice();
        const free = raw.filter((s) => !overlapsBusy(s, busyBlocks));

        if (!cancelled) setSlots(free);
      } catch (e) {
        if (!cancelled) setSlots([]);
        // optional: console.warn("useDaySlots error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [av, mtg, eventType, ownerType, ownerId, dayISO, busyBlocks]);

  return { slots, loading, dayISO };
}

/* ---------- local helpers (client-only) ---------- */

function getBusyBlocksLocalDay(mtg, { ownerType, ownerId, dayISO }) {
  if (!dayISO) return [];
  // Prefer a store helper if available
  if (typeof mtg.getBusyForDay === "function") {
    return mtg.getBusyForDay({ ownerType, ownerId, dayISO }) || [];
  }
  const meetings = mtg.meetings || [];
  return meetings
    .filter((m) => m?.host?.ownerType === ownerType && m?.host?.ownerId === ownerId)
    .filter((m) => toISODate(new Date(m.start)) === dayISO)
    .map((m) => ({ start: m.start, end: m.end }));
}

function overlapsBusy(slot, busyBlocks) {
  if (!slot) return false;
  const s = new Date(slot.start).getTime();
  const e = new Date(slot.end).getTime();
  return busyBlocks.some((b) => {
    const bs = new Date(b.start).getTime();
    const be = new Date(b.end).getTime();
    return Math.max(s, bs) < Math.min(e, be);
  });
}
