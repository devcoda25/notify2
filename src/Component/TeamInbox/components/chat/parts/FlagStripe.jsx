// src/TeamInbox/components/chat/parts/FlagStripe.jsx
// Use: Thin colored accent (stripe or pill) based on flag (yellow/blue/green/red).
// Works with: message bubbles, TicketsCard (left accent).
// Uses: MUI Box, constants/MESSAGE (FLAGS). No stores/services.

import React from "react";
import { Box } from "@mui/material";
import { FLAGS } from "../../../constants/MESSAGE.js";

/**
 * @param {{
 *   flag?: "marketing"|"info"|"confirmation"|"alerts"|string,
 *   orientation?: "vertical"|"horizontal"|"pill",   // visual style
 *   length?: number|string,                         // for horizontal pill/stripe
 *   thickness?: number,                             // px thickness (stripe) or height (pill)
 *   radius?: number,                                // border radius for pill
 *   sx?: object
 * }} props
 */
export default function FlagStripe({
  flag,
  orientation = "vertical",
  length = "100%",
  thickness = 3,
  radius = 999,
  sx,
}) {
  const color = pickColor(flag);

  if (orientation === "pill") {
    return (
      <Box
        sx={{
          display: "inline-block",
          width: typeof length === "number" ? `${length}px` : length,
          height: thickness,
          backgroundColor: color,
          borderRadius: radius,
          ...sx,
        }}
        aria-label={`Flag: ${flag || "none"}`}
      />
    );
  }

  if (orientation === "horizontal") {
    return (
      <Box
        sx={{
          width: typeof length === "number" ? `${length}px` : length,
          height: thickness,
          backgroundColor: color,
          borderRadius: 2,
          ...sx,
        }}
        aria-label={`Flag: ${flag || "none"}`}
      />
    );
  }

  // vertical (default)
  return (
    <Box
      sx={{
        width: thickness,
        alignSelf: "stretch",
        backgroundColor: color,
        borderRadius: 2,
        ...sx,
      }}
      aria-label={`Flag: ${flag || "none"}`}
    />
  );
}

function pickColor(flag) {
  const f = String(flag || "").toLowerCase();
  if (f in FLAGS) return FLAGS[f];
  return "transparent";
}
