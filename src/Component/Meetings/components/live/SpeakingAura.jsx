// Path: /src/Component/Meetings/components/live/components/SpeakingAura.jsx
import React from "react";
import { Box } from "@mui/material";

/**
 * SpeakingAura
 * - Shows 3 concentric ripples when `active === true`.
 * - If `level` (0..1) is provided, it subtly scales brightness/size.
 * - Place it in a relatively positioned container; it fills the parent.
 */
export default function SpeakingAura({
  active = false,
  level = 0,            // 0..1 (optional)
  ringColor,            // fallback to theme via sx
  ringWidth = 2,        // px border per ring
  maxScale = 1.35,      // how far the outer ring grows
  duration = 1400,      // ms per ring
  style = {},
  sx,
}) {
  // Soft modulation by level (avoid 0 = fully off when active):
  const L = Math.max(0.15, Math.min(1, level || 0)); // 0.15..1

  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        borderRadius: "50%",
        // subtle glow that follows level
        boxShadow: active
          ? (t) =>
              `0 0 ${8 + 10 * L}px ${Math.max(2, 4 * L)}px ${ringColor || t.palette.primary.main}33`
          : "none",
        // provide a keyframes scope
        "@keyframes auraPulse": {
          "0%":   { transform: "scale(1)",   opacity: 0.38 },
          "70%":  { transform: `scale(${maxScale})`, opacity: 0 },
          "100%": { transform: `scale(${maxScale})`, opacity: 0 },
        },
        ...sx,
      }}
      style={style}
    >
      {/* 3 staggered rings */}
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: (t) => `${ringWidth}px solid ${(ringColor || t.palette.primary.main)}`,
            opacity: 0,
            transform: "scale(1)",
            animation: active
              ? `auraPulse ${duration}ms ease-out ${i * (duration / 3)}ms infinite`
              : "none",
            // Reduced motion respect
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
              opacity: 0,
            },
          }}
        />
      ))}
    </Box>
  );
}
