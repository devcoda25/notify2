// src/TeamInbox/components/chat/parts/MessageMetaLine.jsx
// Use: Compact row beneath/alongside a bubble: channel chip, label chips, delivery ticks, timestamp.
// Works with: MessageVirtualList (row renderer), hooks/useChat (provides data).
// Uses: ChannelChip, DeliveryTicks, MUI (Stack/Chip/Typography/Tooltip), utils/formatting.

import React from "react";
import { Stack, Chip, Typography, Tooltip } from "@mui/material";
import ChannelChip from "./ChannelChip.jsx";
import DeliveryTicks from "./DeliveryTicks.jsx";
import { formatTimeAgo } from "../../../utils/formatting.js";

/**
 * @param {{
 *   channel: string,
 *   inappKind?: "insider"|"sdk"|"personal"|"room"|string,
 *   labels?: string[],
 *   delivery?: "pending"|"sent"|"delivered"|"read"|"failed",
 *   timestamp?: string|number|Date,
 *   dense?: boolean,                 // tighter spacing
 *   reverse?: boolean,               // place ticks/time before chips
 *   sx?: object
 * }} props
 */
export default function MessageMetaLine({
  channel,
  inappKind,
  labels = [],
  delivery,
  timestamp,
  dense = false,
  reverse = false,
  sx,
}) {
  const time = timestamp ? formatTimeAgo(timestamp) : "";

  const left = (
    <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
      <ChannelChip channel={channel} sublabel={inappKind} tooltip size="small" />
      {labels.slice(0, 3).map((l) => (
        <Chip
          key={l}
          size="small"
          variant="outlined"
          label={l}
          sx={{ height: 20, "& .MuiChip-label": { px: 0.75, fontSize: 11 } }}
        />
      ))}
    </Stack>
  );

  const right = (
    <Stack direction="row" spacing={0.75} alignItems="center">
      {delivery && <DeliveryTicks delivery={delivery} />}
      {time && (
        <Tooltip title={new Date(timestamp).toLocaleString()} arrow>
          <Typography variant="caption" color="text.secondary">{time}</Typography>
        </Tooltip>
      )}
    </Stack>
  );

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={dense ? 0.5 : 1}
      sx={sx}
    >
      {reverse ? right : left}
      {reverse ? left : right}
    </Stack>
  );
}
