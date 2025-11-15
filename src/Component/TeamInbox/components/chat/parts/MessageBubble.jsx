// src/TeamInbox/components/chat/parts/MessageBubble.jsx
// One message → one bubble. Pure presentational atom.
// Internals: FlagStripe, MessageContentRouter (text + parts), MessageMetaLine (data props only).

import React, { useMemo } from "react";
import { Box, Avatar } from "@mui/material";
import { alpha } from "@mui/material/styles";
import FlagStripe from "./FlagStripe.jsx";
import MessageMetaLine from "./MessageMetaLine.jsx";
import MessageContentRouter from "./MessageContentRouter.jsx";
import BUBBLE from "../../../constants/BUBBLE_TOKENS.js";

/**
 * @typedef {import("../../../types/chat.js").MessageUI} MessageUI
 */

/**
 * @param {{
 *   message: MessageUI,
 *   isMine?: boolean,
 *   groupedPrev?: boolean,
 *   groupedNext?: boolean,
 *   showAvatar?: boolean,
 * }} props
 */
export default function MessageBubble({
  message,
  isMine = false,
  groupedPrev = false,
  groupedNext = false,
  showAvatar = true,
}) {
  const sender = message?.sender || { displayName: "Unknown" };
  const avatarSide = isMine ? "end" : "start";

  const radii = useMemo(() => {
    const r = BUBBLE.radius;
    const g = BUBBLE.radiusGrouped;
    return {
      tl: isMine ? g : (groupedPrev ? g : r),
      tr: isMine ? (groupedPrev ? g : r) : g,
      bl: isMine ? g : (groupedNext ? g : r),
      br: isMine ? (groupedNext ? g : r) : g,
    };
  }, [isMine, groupedPrev, groupedNext]);

  // Tail is shown only when the avatar is visible for this message
  const showTail = showAvatar && !groupedPrev;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: isMine ? "1fr auto" : "auto 1fr",
        columnGap: 1,
        alignItems: "end",
        px: { xs: 1, sm: 1.5 },
      }}
    >
      {/* Left avatar (incoming) */}
      {!isMine && (
        <AvatarMini
          visible={showAvatar && !groupedPrev}
          name={sender.displayName}
          src={sender.avatarUrl}
          align="start"
        />
      )}

      {/* Bubble */}
      <Box
        sx={(th) => {
          // Colors
          const faintPurpleBg = alpha(th.palette.primary.main, 0.12);
          const faintPurpleBorder = alpha(th.palette.primary.main, 0.28);
          const bg = isMine ? faintPurpleBg : th.palette.background.paper;
          const fg = th.palette.text.primary;
          const borderCol = isMine ? faintPurpleBorder : th.palette.divider;

          // Tail geometry (a tiny 10x10 square, rotated 45°)
          // Positioned near the bottom on the avatar-facing side, overlapping into the avatar gutter.
          const tailCommon = {
            content: '""',
            position: "absolute",
            width: 10,
            height: 10,
            transform: "rotate(45deg)",
            bottom: 8,
            backgroundColor: bg,
            boxSizing: "border-box",
          };

          const tailLeft = showTail
            ? {
                "&::after": {
                  ...tailCommon,
                  left: -5, // overlaps toward avatar
                  borderLeft: `1px solid ${borderCol}`,
                  borderBottom: `1px solid ${borderCol}`,
                },
              }
            : {};

          const tailRight = showTail
            ? {
                "&::after": {
                  ...tailCommon,
                  right: -5, // overlaps toward avatar
                  borderRight: `1px solid ${borderCol}`,
                  borderBottom: `1px solid ${borderCol}`,
                },
              }
            : {};

          return {
            maxWidth: BUBBLE.maxWidth,
            justifySelf: avatarSide,
            bgcolor: bg,
            color: fg,
            border: `1px solid ${borderCol}`,
            borderTopLeftRadius: radii.tl,
            borderTopRightRadius: radii.tr,
            borderBottomLeftRadius: radii.bl,
            borderBottomRightRadius: radii.br,
            px: BUBBLE.padX,
            py: BUBBLE.padY,
            position: "relative",
            ...(isMine ? tailRight : tailLeft),
          };
        }}
      >
        {message?.meta?.flag && (
          <FlagStripe
            flag={message.meta.flag}
            orientation="vertical"
            thickness={3}
            sx={{ position: "absolute", left: -6, top: 4, bottom: 4, borderRadius: 2 }}
          />
        )}

        {/* Body + attachments routed via registry (single bubble blankets everything) */}
        <MessageContentRouter message={message} />

        <MessageMetaLine
          channel={message.channel}
          inappKind={message?.meta?.inappKind}
          labels={message?.meta?.labels || []}
          delivery={message.delivery}
          timestamp={message.createdAt}
          dense
          reverse={isMine}
          sx={{ mt: 0.5 }}
        />
      </Box>

      {/* Right avatar (outgoing) */}
      {isMine && (
        <AvatarMini
          visible={showAvatar && !groupedPrev}
          name={sender.displayName || "You"}
          src={sender.avatarUrl}
          align="end"
        />
      )}
    </Box>
  );
}

/* ------------------------ Local tiny helper ------------------------ */

function AvatarMini({ visible, name, src, align = "start" }) {
  if (!visible) return <Box sx={{ width: 28, height: 28 }} aria-hidden />;
  const initial = (name && name.trim()[0]?.toUpperCase()) || "U";
  return (
    <Avatar
      src={src}
      alt={name || "User"}
      sx={{ width: 28, height: 28, fontSize: 12, justifySelf: align }}
    >
      {initial}
    </Avatar>
  );
}
