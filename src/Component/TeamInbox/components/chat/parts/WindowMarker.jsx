// src/TeamInbox/components/chat/parts/WindowMarker.jsx
// Use: “Conversation window opened/expired” divider with tooltip timestamps.
// Works with: ChatPane timeline to visualize the 24h (or policy) chat window bounds.
// Uses: MUI (Divider/Chip/Tooltip), utils/window for state math, utils/formatting for relative labels.

import React, { useMemo } from "react";
import { Divider, Chip, Tooltip } from "@mui/material";
import { isOpen, expiresInMs } from "../../../utils/window.js";
import { formatTimeAgo } from "../../../utils/formatting.js";

/**
 * @param {{
 *   startAt?: string|number|Date,      // when the window opened
 *   endAt?: string|number|Date,        // when the window expires(d)
 *   now?: Date,                        // testing/override clock
 *   sx?: object,
 * }} props
 */
export default function WindowMarker({ startAt, endAt, now = new Date(), sx }) {
  const start = startAt ? new Date(startAt) : null;
  const end = endAt ? new Date(endAt) : null;

  const state = useMemo(() => {
    if (!start && !end) return { label: "Conversation window", hint: "" };
    if (end && end.getTime() <= now.getTime()) {
      const since = formatTimeAgo(end, now); // e.g., “2h”
      return { label: "Conversation window expired", hint: `Expired ${since} ago` };
    }
    if (isOpen(now, start, end)) {
      const ms = expiresInMs(now, end);
      const inStr = ms != null ? humanIn(ms) : "";
      return { label: "Conversation window open", hint: inStr ? `Expires in ${inStr}` : "" };
    }
    // Future-open (rare, but handle)
    if (start && start.getTime() > now.getTime()) {
      const until = start.getTime() - now.getTime();
      return { label: "Conversation window opens soon", hint: `Opens in ${humanIn(until)}` };
    }
    return { label: "Conversation window", hint: "" };
  }, [start, end, now]);

  const tooltip = [
    start ? `Opened: ${start.toLocaleString()}` : null,
    end ? `Expires: ${end.toLocaleString()}` : null,
  ].filter(Boolean).join(" • ");

  const chip = (
    <Chip
      size="small"
      color="info"
      variant="outlined"
      label={state.hint ? `${state.label} — ${state.hint}` : state.label}
      sx={{
        fontWeight: 600,
        "& .MuiChip-label": { px: 1.25, py: 0.25, letterSpacing: 0.2 },
      }}
      aria-label={state.label}
    />
  );

  return (
    <Divider textAlign="center" sx={{ my: 1.25, ...sx }}>
      {tooltip ? <Tooltip title={tooltip} arrow><span>{chip}</span></Tooltip> : chip}
    </Divider>
  );
}

function humanIn(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}
