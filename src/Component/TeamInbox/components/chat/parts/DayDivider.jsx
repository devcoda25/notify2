// src/TeamInbox/components/chat/parts/DayDivider.jsx
// Use: Centered date divider in the timeline (“Today”, “Yesterday”, or formatted date).
// Works with: MessageVirtualList row renderer in ChatPane.
// Uses: MUI (Divider/Chip/Tooltip), local label helper (no stores).

import React from "react";
import { Divider, Chip, Tooltip } from "@mui/material";

/**
 * @param {{
 *   date: string|number|Date,
 *   locale?: string,
 *   sx?: object,
 *   tooltip?: boolean,      // show full localized date in tooltip
 * }} props
 */
export default function DayDivider({ date, locale, sx, tooltip = true }) {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return null;

  const label = formatDayLabel(d, locale);
  const full = d.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const chip = (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 600,
        "& .MuiChip-label": { px: 1.25, py: 0.25, letterSpacing: 0.2 },
      }}
      aria-label={`Day divider: ${label}`}
    />
  );

  return (
    <Divider textAlign="center" sx={{ my: 1.25, ...sx }}>
      {tooltip ? <Tooltip title={full} arrow><span>{chip}</span></Tooltip> : chip}
    </Divider>
  );
}

function formatDayLabel(d, locale) {
  const now = new Date();
  const startOf = (dt) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  const a = startOf(now).getTime();
  const b = startOf(d).getTime();
  const diffDays = Math.round((a - b) / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  // Same year → “Mon, May 12”
  if (now.getFullYear() === d.getFullYear()) {
    return d.toLocaleDateString(locale, { weekday: "short", month: "short", day: "numeric" });
  }
  // Else include year
  return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}
