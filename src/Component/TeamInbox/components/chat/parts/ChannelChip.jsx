// src/TeamInbox/components/chat/parts/ChannelChip.jsx
// Use: Tiny badge for delivery channel (WA/SMS/Email/In-App) + optional sublabel (Insider/SDK/Personal/Room).
// Works with: MessageMetaLine (placed under/next to bubbles), TicketsCard (optional).
// Uses: MUI (Chip/Tooltip), constants/CHANNELS, lightweight mapping. No stores/services.

import React from "react";
import { Chip, Tooltip } from "@mui/material";
import { CHANNELS } from "../../../constants/CHANNELS.js";

/**
 * @param {{
 *   channel: string,                         // one of CHANNELS.*
 *   sublabel?: "insider"|"sdk"|"personal"|"room"|string, // only meaningful for in-app
 *   size?: "small"|"medium",
 *   variant?: "filled"|"outlined",
 *   tooltip?: boolean,                       // show tooltip with full text
 *   sx?: object
 * }} props
 */
export default function ChannelChip({
  channel,
  sublabel,
  size = "small",
  variant = "outlined",
  tooltip = true,
  sx,
}) {
  const ch = String(channel || "").toLowerCase();

  const base = (() => {
    switch (ch) {
      case CHANNELS.WABA: return { label: "WhatsApp", short: "WA" };
      case CHANNELS.SMS:  return { label: "SMS", short: "SMS" };
      case CHANNELS.EMAIL:return { label: "Email", short: "Email" };
      case CHANNELS.VOICE:return { label: "Voice", short: "Voice" };
      case CHANNELS.PUSH: return { label: "Push", short: "Push" };
      case CHANNELS.INAPP:
      default:            return { label: "In-App", short: "In-App" };
    }
  })();

  const sub = ch === CHANNELS.INAPP && sublabel
    ? ` · ${prettyInapp(sublabel)}`
    : "";

  const label = `${base.short}${sub}`;

  const chip = (
    <Chip
      size={size}
      label={label}
      variant={variant}
      sx={{
        height: size === "small" ? 20 : undefined,
        "& .MuiChip-label": { px: 0.75, fontSize: size === "small" ? 11 : 12 },
        ...sx,
      }}
      aria-label={`Channel: ${base.label}${sub ? ` — ${prettyInapp(sublabel)}` : ""}`}
    />
  );

  if (!tooltip) return chip;
  return (
    <Tooltip title={`${base.label}${sub ? ` — ${prettyInapp(sublabel)}` : ""}`} arrow>
      <span>{chip}</span>
    </Tooltip>
  );
}

function prettyInapp(x) {
  const v = String(x || "").toLowerCase();
  if (v === "insider") return "Insider";
  if (v === "sdk") return "SDK";
  if (v === "personal") return "Personal";
  if (v === "room") return "Room";
  return x;
}
