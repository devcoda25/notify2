// Path: /src/Component/Meetings/live/core.js
import { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";

/* ---------- State enum ---------- */
export const STATES = {
  SETUP: "setup",
  LOBBY: "lobby",
  LIVE: "live",
  PAUSED: "paused",
  ENDED: "ended",
  ERROR: "error",
  TIMEOUT: "timeout",
  UNAVAILABLE: "unavailable",
  SLOW: "slow",
};

export const DEVICE_OPTS = {
  cameras: ["Default Camera", "HD Webcam C920", "Virtual Cam"],
  mics: ["Default Mic", "USB Mic", "Array Mic"],
  speakers: ["Default Speakers", "Headset", "HDMI Output"],
};

/* ---------- Hooks ---------- */
export function useSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect;
      setSize({ width: cr.width, height: cr.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

/**
 * computeBestGrid
 * Finds a grid (cols/rows) that:
 * - maximizes tile height while preserving aspect ratio,
 * - avoids stretching the last row,
 * - respects a minimum tile width,
 * - returns per-row height and basic coverage info.
 */
export function computeBestGrid(n, W, H, {
  gap = 12,
  aspect = 16 / 9,
  minTileW = 140,
  padding = 32, // inner padding same as views
} = {}) {
  const W2 = Math.max(0, W - padding);
  const H2 = Math.max(0, H - padding);
  if (n <= 0 || W2 <= 0 || H2 <= 0) {
    return { cols: 1, rows: 1, tileW: W2, tileH: H2, visible: 0, coverage: 0, lastRowCount: 0 };
  }

  let best = null;
  const maxCols = Math.min(8, Math.max(1, n));

  for (let cols = 1; cols <= maxCols; cols++) {
    const rows = Math.ceil(n / cols);
    const cellW = (W2 - gap * (cols - 1)) / cols;
    const cellH = (H2 - gap * (rows - 1)) / rows;

    // fit to aspect
    const widthLimitedH = cellW / aspect;
    const heightLimitedW = cellH * aspect;
    const tileW = heightLimitedW <= cellW ? heightLimitedW : cellW;
    const tileH = heightLimitedW <= cellW ? cellH : widthLimitedH;

    if (tileW < minTileW) continue;

    const usedW = tileW * cols + gap * (cols - 1);
    const usedH = tileH * rows + gap * (rows - 1);
    const coverage = (usedW * usedH) / (W2 * H2);
    const score = tileH + coverage * 0.25; // prioritize size, then coverage

    if (!best || score > best.score) best = { score, cols, rows, tileW, tileH, coverage };
  }

  if (!best) {
    // fallback: single column
    const rows = Math.max(1, Math.floor(H2 / ((W2 / aspect) + gap)));
    return { cols: 1, rows, tileW: W2, tileH: (W2 / aspect), visible: Math.min(n, rows), coverage: 0, lastRowCount: 0 };
  }

  const { cols, rows, tileW, tileH, coverage } = best;
  const capacity = cols * rows;
  const visible = Math.min(n, capacity);
  const filled = (rows - 1) * cols;
  const lastRowCount = Math.max(0, visible - filled);

  return { cols, rows, tileW, tileH, visible, coverage, lastRowCount };
}

/* ---------- Helpers ---------- */
export const genderTint = (gender, theme) => {
  if (gender === "f") return alpha(theme.palette.secondary.main, 0.08);
  if (gender === "m") return alpha(theme.palette.primary.main, 0.08);
  return alpha(theme.palette.info.main, 0.08);
};
