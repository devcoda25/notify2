// Path: src/Component/Meetings/hooks/useCalendarSwipe.js
import { useCallback, useRef, useState } from "react";
import { addMonths as _addMonths } from "../utils/datetime";

/**
 * Minimal swipe-to-change-month helpers for touch devices.
 * Keeps month state local but allows external control via setter return.
 */
export default function useCalendarSwipe(initialMonth = new Date()) {
  const [month, setMonth] = useState(() => {
    const d = new Date(initialMonth);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const touch = useRef({ x: 0, y: 0 });

  const onTouchStart = useCallback((e) => {
    const t = e.touches?.[0];
    if (!t) return;
    touch.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback((e) => {
    const t = e.changedTouches?.[0];
    if (!t) return;
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      const dir = dx < 0 ? 1 : -1; // left swipe → next month
      setMonth((m) => _addMonths(m, dir));
    }
  }, []);

  const addMonths = useCallback((n) => setMonth((m) => _addMonths(m, n)), []);

  return { month, setMonth, onTouchStart, onTouchEnd, addMonths };
}
