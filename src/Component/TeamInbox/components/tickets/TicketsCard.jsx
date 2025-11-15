// src/TeamInbox/components/tickets/TicketsCard.jsx
// Use: Presentational row for a ticket in lists (virtualized or plain).
// Works with: TicketsVirtualList.jsx (row renderer), formatting/channelLabel, MESSAGE constants.
// Uses: MUI, lucide-react, theme `sx` only. No stores/services/WS imports.

import React, { memo, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Badge,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Pin, BellOff, Clock, Check, CheckCheck } from "lucide-react";
import { channelLabel, formatTimeAgo, truncate } from "../../utils/formatting.js";
import { FLAGS, DELIVERY } from "../../constants/MESSAGE.js";

/**
 * @typedef {Object} TicketRow
 * @property {string} id
 * @property {string} roomId
 * @property {string} title
 * @property {string=} subtitle
 * @property {number=} unreadCount
 * @property {string=} updatedAt
 * @property {string=} status               // ticket-level: Active/Closed/Expired...
 * @property {string=} subStatus
 * @property {string=} channel              // "email"|"sms"|"waba"|"inapp"|"voice"|"push"
 * @property {("marketing"|"info"|"confirmation"|"alerts")=} flag
 * @property {Array<string>=} labels
 * @property {{kind?:string}=} lastMessage
 * @property {{displayName?:string, avatarUrl?:string}=} primary
 * @property {boolean=} pinned
 * @property {boolean=} muted
 * @property {("pending"|"sent"|"delivered"|"read"|"failed")=} delivery
 * @property {string=} priority            // preferred: "red"|"yellow"|"blue"|"green"|"orange"
 *                                         // aliases: "urgent"|"high"|"medium"|"low"|"info" etc.
 */

/**
 * @param {{
 *   ticket: TicketRow,
 *   active?: boolean,
 *   onClick?: (id:string) => void
 * }} props
 */
function TicketsCard({ ticket, active = false, onClick }) {
  const {
    id,
    title,
    subtitle,
    unreadCount = 0,
    updatedAt,
    channel,
    status,
    subStatus,
    labels = [],
    primary,
    pinned,
    muted,
    delivery,
    flag,
    priority,
  } = ticket || {};

  // Map delivery → icon/color
  const deliveryIcon = useMemo(() => {
    const s = (delivery || "").toLowerCase();
    if (s === DELIVERY.PENDING)   return { icon: Clock,     color: "text.secondary", title: "Pending" };
    if (s === DELIVERY.SENT)      return { icon: Check,     color: "text.secondary", title: "Sent" };
    if (s === DELIVERY.DELIVERED) return { icon: CheckCheck, color: "text.secondary", title: "Delivered" };
    if (s === DELIVERY.READ)      return { icon: CheckCheck, color: "primary.main",  title: "Read" };
    if (s === DELIVERY.FAILED)    return { icon: Clock,     color: "error.main",     title: "Failed" };
    return null;
  }, [delivery]);

  // Flag accent color (small logic you already had)
  const accent = useMemo(() => {
    if (!flag) return null;
    const k = flag.toLowerCase();
    return (
      (k === "marketing"    && FLAGS.marketing)    ||
      (k === "info"         && FLAGS.info)         ||
      (k === "confirmation" && FLAGS.confirmation) ||
      (k === "alerts"       && FLAGS.alerts)       ||
      null
    );
  }, [flag]);

  // Priority stripe color (left)
  const priorityColor = (th) => {
    const val = String(priority || "").toLowerCase();
    const alias =
      val === "urgent" || val === "critical" || val === "high" ? "red" :
      val === "medium" || val === "warn"                        ? "orange" :
      val === "low"                                             ? "green" :
      val === "info"                                            ? "blue"  :
      val; // if already a color name

    switch (alias) {
      case "red":    return th.palette.error.main;
      case "yellow": return th.palette.warning.main;
      case "orange": return th.palette.warning.dark; // close to orange in most themes
      case "green":  return th.palette.success.main;
      case "blue":   return th.palette.info.main;
      default:       return accent || th.palette.divider; // fallback to existing accent or grey
    }
  };

  const initials =
    primary?.displayName?.[0]?.toUpperCase?.() || title?.[0]?.toUpperCase?.() || "T";

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(id);
        }
      }}
      aria-pressed={active}
      aria-label={`Open ticket: ${title || "Untitled"}`}
      sx={(th) => {
        // Selected visuals: background tint from primary that matches the border color alpha.
        const base = th.palette.primary.main;
        const selectedBg = alpha(base, th.palette.mode === "dark" ? 0.14 : 0.10); // slightly stronger than hover-grey
        const selectedBorder = alpha(base, 0.55);

        return {
          position: "relative",
          display: "flex",
          alignItems: "stretch",
          px: 1.25,
          py: 1,
          cursor: "pointer",
          gap: 1,
          borderRadius: 1,
          outline: "none",
          // Hover: keep theme grey (as requested)
          "&:hover": { backgroundColor: th.palette.action.hover },
          ...(active && {
            backgroundColor: selectedBg,
            boxShadow: `inset 0 0 0 1px ${selectedBorder}`,
          }),
        };
      }}
    >
      {/* Priority stripe (or flag) */}
      <Box
        sx={(th) => ({
          width: 3,
          borderRadius: 2,
          mr: 0.5,
          backgroundColor: priorityColor(th),
          alignSelf: "stretch",
          opacity: 1,
        })}
      />

      {/* Avatar + unread dot */}
      <Badge
        overlap="circular"
        color="primary"
        variant={unreadCount > 0 ? "dot" : "standard"}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ alignSelf: "center" }}
      >
        <Avatar
          src={primary?.avatarUrl}
          alt={primary?.displayName || title || "Ticket"}
          sx={(th) => ({
            width: 36,
            height: 36,
            fontSize: 13,
            bgcolor: active ? th.palette.primary.main : th.palette.grey[300],
            color: active ? th.palette.primary.contrastText : th.palette.text.primary,
            flexShrink: 0,
          })}
        >
          {initials}
        </Avatar>
      </Badge>

      {/* Main text */}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Typography
            variant="body2"
            noWrap
            sx={{ fontWeight: active ? 700 : 600 }}
            title={title}
          >
            {title || "Untitled"}
          </Typography>

          {pinned && (
            <Tooltip title="Pinned" arrow>
              <Box sx={{ display: "inline-flex", color: "text.secondary" }}>
                <Pin size={14} />
              </Box>
            </Tooltip>
          )}

          {muted && (
            <Tooltip title="Muted" arrow>
              <Box sx={{ display: "inline-flex", color: "text.secondary" }}>
                <BellOff size={14} />
              </Box>
            </Tooltip>
          )}

          {/* Delivery ticks */}
          {deliveryIcon && (
            <Tooltip title={deliveryIcon.title} arrow>
              <Box sx={{ display: "inline-flex", color: deliveryIcon.color }}>
                <deliveryIcon.icon size={14} />
              </Box>
            </Tooltip>
          )}
        </Stack>

        {!!subtitle && (
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            title={subtitle}
            sx={{ display: "block" }}
          >
            {truncate(subtitle, 120)}
          </Typography>
        )}

        {/* Chips row */}
        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }} flexWrap="wrap">
          {!!channel && (
            <Chip
              size="small"
              label={channelLabel(channel)}
              variant="outlined"
              sx={{ height: 20, "& .MuiChip-label": { px: 0.75, fontSize: 11 } }}
            />
          )}
          {status && (
            <Chip
              size="small"
              color={status.toLowerCase() === "active" ? "success" : "default"}
              label={status}
              sx={{ height: 20, "& .MuiChip-label": { px: 0.75, fontSize: 11 } }}
            />
          )}
          {subStatus && (
            <Chip
              size="small"
              variant="outlined"
              label={subStatus}
              sx={{ height: 20, "& .MuiChip-label": { px: 0.75, fontSize: 11 } }}
            />
          )}
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
      </Box>

      {/* Right meta (time + unread) */}
      <Stack alignItems="flex-end" sx={{ minWidth: 64, gap: 0.5, pt: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {formatTimeAgo(updatedAt)}
        </Typography>
        {unreadCount > 0 && (
          <Chip
            size="small"
            color={active ? "primary" : "default"}
            variant={active ? "filled" : "outlined"}
            label={unreadCount > 99 ? "99+" : unreadCount}
            sx={{ height: 22 }}
          />
        )}
      </Stack>
    </Box>
  );
}

export default memo(TicketsCard);
