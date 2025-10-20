// Path: src/Component/Meetings/hooks/useLiveClock.js
import { useEffect, useMemo, useState } from "react";

/**
 * Live clock labels for a given timezone.
 * Ticks every ~20s to keep the UI fresh without being noisy.
 */
export default function useLiveClock(timezone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(id);
  }, []);

  const labels = useMemo(() => {
    try {
      const dtfDay = new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: timezone,
      });
      const dtfTime = new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: timezone,
      });
      return {
        dateLabel: dtfDay.format(now),
        timeLabel: dtfTime.format(now),
      };
    } catch {
      return {
        dateLabel: now.toDateString(),
        timeLabel: now.toLocaleTimeString(),
      };
    }
  }, [now, timezone]);

  return { now, ...labels };
}
