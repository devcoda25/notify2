// /src/Component/dailer/Softphone/WrapUpChip.jsx
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDialerStore } from "../../store/useDialerStore";

function msToSec(ms) { return Math.max(0, Math.round((ms || 0) / 1000)); }

/** Stage thresholds + visuals
 *  - Early (ok/tooMuch): border-only (no fill)
 *  - Mid (late/warning): filled warning styles
 *  - Late (beeping/tooBad): filled error styles
 *  - Final (tooBad): stronger pulse + dual radiating halos
 */
function stageFor(sec, palette) {
  if (sec < 15) {
    return {
      stage: "ok",
      sx: {
        bgcolor: "transparent",
        color: palette.success.main,
        border: "2px solid",
        borderColor: palette.success.main,
      },
    };
  }
  if (sec < 30) {
    return {
      stage: "tooMuch",
      sx: {
        bgcolor: "transparent",
        color: palette.info.main,
        border: "2px solid",
        borderColor: palette.info.main,
      },
    };
  }
  if (sec < 45) {
    return {
      stage: "late",
      sx: {
        bgcolor: palette.warning.light,
        color: palette.warning.contrastText,
        border: "1px solid",
        borderColor: palette.warning.main,
      },
    };
  }
  if (sec < 60) {
    return {
      stage: "warning",
      sx: {
        bgcolor: palette.warning.main,
        color: palette.common.white,
        border: "1px solid",
        borderColor: palette.warning.dark,
      },
    };
  }
  if (sec < 90) {
    return {
      stage: "beeping",
      sx: {
        bgcolor: palette.error.light,
        color: palette.error.contrastText,
        border: "1px solid",
        borderColor: palette.error.main,
        animation: "wrapPulse 1s ease-in-out infinite",
      },
    };
  }
  // FINAL
  return {
    stage: "tooBad",
    sx: {
      bgcolor: palette.error.main,
      color: palette.common.white,
      border: "1px solid",
      borderColor: palette.error.dark,
      animation: "wrapPulseStrong 0.8s ease-in-out infinite",
      position: "relative",
      overflow: "visible",
      // Dual radiating halos (staggered for more aggressive attention)
      "&::after, &::before": {
        content: '""',
        position: "absolute",
        inset: -8,
        borderRadius: 999,
        border: "2px solid",
        borderColor: palette.error.main,
        opacity: 0,
        pointerEvents: "none",
      },
      "&::after": {
        animation: "halo 0.9s ease-out infinite",
      },
      "&::before": {
        inset: -12,                       // slightly larger ring
        borderColor: palette.error.dark,  // darker outer ring
        animation: "halo2 1.1s ease-out infinite",
        animationDelay: "0.35s",
      },
      boxShadow: `0 0 0 0 rgba(244,67,54,0.35)`,
    },
  };
}

/* --- tiny audio helpers --- */
let __beepCtx = null;
function ensureCtx() {
  if (!__beepCtx && typeof window !== "undefined") {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) __beepCtx = new Ctx();
  }
  return __beepCtx;
}
function beepOnce({ freq = 1200, ms = 120, gain = 0.05 } = {}) {
  const ctx = ensureCtx();
  if (!ctx) return;
  if (ctx.state === "suspended" && ctx.resume) ctx.resume().catch(() => {});
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  g.gain.value = gain;
  osc.frequency.value = freq;
  osc.type = "triangle";
  osc.connect(g).connect(ctx.destination);
  const now = ctx.currentTime;
  osc.start(now);
  osc.stop(now + ms / 1000);
}
function doubleBeep() {
  beepOnce({ freq: 1250, ms: 110, gain: 0.06 });
  setTimeout(() => beepOnce({ freq: 1450, ms: 110, gain: 0.06 }), 220);
}

/**
 * WrapUpChip
 * - Counts up from ACW start, never stops while mounted
 * - Beeps on "beeping" (gentle) and "tooBad" (urgent double-beep)
 * - Bigger by default (use dense to shrink)
 * - Early stages: border-only (no fill), later stages: filled for emphasis
 * - Smooth fades between colors/borders
 */
export default function WrapUpChip({ dense = false, label = "Wrap-up" }) {
  const { callStatus, acwStartedAt } = useDialerStore.getState();
  const inAcw = callStatus === "acw";

  // count-up
  const [sec, setSec] = useState(() =>
    inAcw && acwStartedAt ? msToSec(Date.now() - acwStartedAt) : 0
  );
  useEffect(() => {
    if (!inAcw) return;
    const t = setInterval(() => {
      const base = acwStartedAt || Date.now();
      setSec(msToSec(Date.now() - base));
    }, 1000);
    return () => clearInterval(t);
  }, [inAcw, acwStartedAt]);

  // beeping per stage
  const lastStageRef = useRef(null);
  const timerRef = useRef(null);
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <Box
      sx={(theme) => {
        const { sx, stage } = stageFor(sec, theme.palette);

        // manage beep timers per stage
        if (stage !== lastStageRef.current) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (stage === "beeping") {
            timerRef.current = setInterval(
              () => beepOnce({ freq: 1200, ms: 120, gain: 0.05 }),
              2000
            );
          } else if (stage === "tooBad") {
            timerRef.current = setInterval(() => doubleBeep(), 1100);
          }
          lastStageRef.current = stage;
        }

        return {
          ...sx,
          borderRadius: 999,
          px: dense ? 1.25 : 1.9,
          py: dense ? 0.4 : 0.7,
          lineHeight: 1.45,
          fontSize: dense ? theme.typography.caption.fontSize : theme.typography.body2.fontSize,
          fontWeight: 800,
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          willChange: "background-color, color, border-color, box-shadow, transform, filter",
          transition: "background-color 240ms ease, color 240ms ease, border-color 240ms ease, box-shadow 240ms ease, transform 240ms ease, filter 240ms ease",
          "@keyframes wrapPulse": {
            "0%":   { filter: "brightness(100%)", transform: "scale(1)" },
            "50%":  { filter: "brightness(88%)",  transform: "scale(0.985)" },
            "100%": { filter: "brightness(100%)", transform: "scale(1)" },
          },
          "@keyframes wrapPulseStrong": {
            "0%":   { filter: "brightness(120%)", transform: "scale(1)" },
            "50%":  { filter: "brightness(76%)",  transform: "scale(0.955)" },
            "100%": { filter: "brightness(120%)", transform: "scale(1)" },
          },
          // Radiating halos — bigger, faster, stronger
          "@keyframes halo": {
            "0%":   { transform: "scale(1)",    opacity: 0.0 },
            "30%":  { transform: "scale(1.25)", opacity: 0.45 },
            "100%": { transform: "scale(1.75)", opacity: 0 },
          },
          "@keyframes halo2": {
            "0%":   { transform: "scale(1)",    opacity: 0.0 },
            "35%":  { transform: "scale(1.35)", opacity: 0.35 },
            "100%": { transform: "scale(2.0)",  opacity: 0 },
          },
          // Respect reduced motion
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
            "&::after, &::before": { animation: "none" },
            transition: "none",
          },
        };
      }}
      aria-live="polite"
    >
      {label} {sec}s
    </Box>
  );
}
