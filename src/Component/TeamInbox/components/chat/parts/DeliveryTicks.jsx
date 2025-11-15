// src/TeamInbox/components/chat/parts/DeliveryTicks.jsx
// Use: WhatsApp-style ticks renderer from a delivery prop (clock/✓/✓✓/blue ✓✓ + failed state).
// Works with: MessageMetaLine (inline), TicketsCard (last-message state).
// Uses: MUI (Box/Tooltip), lucide-react icons, constants/MESSAGE (DELIVERY). No stores/services.

import React from "react";
import { Box, Tooltip } from "@mui/material";
import { Clock, Check, CheckCheck, AlertTriangle } from "lucide-react";
import { DELIVERY } from "../../../constants/MESSAGE.js";

/**
 * @param {{
 *   delivery?: "pending"|"sent"|"delivered"|"read"|"failed",
 *   size?: number,                 // icon size
 *   colorOverride?: string,        // e.g., "primary.main"
 *   tooltip?: boolean,
 *   sx?: object
 * }} props
 */
export default function DeliveryTicks({
  delivery = DELIVERY.SENT,
  size = 14,
  colorOverride,
  tooltip = true,
  sx,
}) {
  const d = String(delivery || "").toLowerCase();
  const { icon: Icon, title, color } = map(d);

  const node = (
    <Box
      aria-label={`Delivery: ${title}`}
      sx={{ display: "inline-flex", alignItems: "center", color: colorOverride || color, ...sx }}
    >
      <Icon size={size} />
    </Box>
  );

  if (!tooltip) return node;
  return (
    <Tooltip title={title} arrow>
      <span>{node}</span>
    </Tooltip>
  );
}

function map(d) {
  if (d === DELIVERY.PENDING) return { icon: Clock, title: "Pending", color: "text.secondary" };
  if (d === DELIVERY.SENT) return { icon: Check, title: "Sent", color: "text.secondary" };
  if (d === DELIVERY.DELIVERED) return { icon: CheckCheck, title: "Delivered", color: "text.secondary" };
  if (d === DELIVERY.READ) return { icon: CheckCheck, title: "Read", color: "primary.main" };
  if (d === DELIVERY.FAILED) return { icon: AlertTriangle, title: "Failed", color: "error.main" };
  return { icon: Check, title: "Sent", color: "text.secondary" };
}
