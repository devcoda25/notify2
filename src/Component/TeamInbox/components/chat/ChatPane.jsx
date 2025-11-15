// src/TeamInbox/components/chat/ChatPane.jsx
// High-level chat timeline wrapper. Composes MessageVirtualList and TypingPresenceBar,
// injects day dividers, window marker (state-driven), and unread marker into a flat render list.

import React, { useMemo, useCallback } from "react";
import { Box } from "@mui/material";
import { keyForMessage } from "../../utils/keys.js";

/* structural atoms */
import DayDivider from "./parts/DayDivider.jsx";
import WindowMarker from "./parts/WindowMarker.jsx";
import NewMessagesMarker from "./parts/NewMessagesMarker.jsx";

/* timeline + footer */
import TypingPresenceBar from "./TypingPresenceBar.jsx";
import MessageVirtualList from "./MessageVirtualList.jsx";

/* bubble atom */
import MessageBubble from "./parts/MessageBubble.jsx";

/**
 * @typedef {import("../../types/chat.js").MessageUI} MessageUI
 */

/**
 * @param {{
 *  messages: MessageUI[],
 *  isHydrated: boolean,
 *  loadPrev: () => Promise<void>|void,
 *  bottomLock?: { isAtBottom:boolean, setAtBottom:(b:boolean)=>void, bumpKey?:number },
 *  typing?: Array<{ userId:string, displayName:string, avatarUrl?:string }>,
 *  unreadBoundaryId?: string | null,
 *  windowBounds?: { openedAt?: string|null, expiresAt?: string|null },
 *  renderEmpty?: React.ReactNode,
 * }} props
 */
export default function ChatPane({
  messages = [],
  isHydrated,
  loadPrev,
  bottomLock = { isAtBottom: true, setAtBottom: () => {}, bumpKey: 0 },
  typing = [],
  unreadBoundaryId = null,
  windowBounds = {},
  renderEmpty = null,
}) {
  // Build the flat render list with structural items interleaved.
  const items = useMemo(() => {
    /** @type {Array<{type:'msg'|'day'|'window'|'unread', id:string, payload?:any}>} */
    const out = [];
    if (!Array.isArray(messages) || messages.length === 0) return out;

    let prevDay = "";
    const openAt = windowBounds?.openedAt || null;
    const expiresAt = windowBounds?.expiresAt || null;

    for (let i = 0; i < messages.length; i++) {
      const m = messages[i];

      // Day divider
      const day = (m.createdAt || "").slice(0, 10);
      if (day && day !== prevDay) {
        out.push({ type: "day", id: `day-${day}`, payload: { date: day } });
        prevDay = day;
      }

      // Unread marker (before the first unread message)
      if (unreadBoundaryId && m.id === unreadBoundaryId) {
        out.push({ type: "unread", id: `unread-${m.id}` });
      }

      out.push({ type: "msg", id: keyForMessage(m), payload: m });
    }

    // Optional: single state-driven window marker (placed at end)
    if (openAt || expiresAt) {
      const id = `win-state-${openAt || "x"}-${expiresAt || "y"}`;
      out.push({ type: "window", id, payload: { startAt: openAt, endAt: expiresAt } });
    }

    return out;
  }, [messages, unreadBoundaryId, windowBounds]);

  // Render switch for the virtual list
  const renderItem = useCallback((node) => {
    switch (node.type) {
      case "day":
        // ✅ DayDivider expects { date }
        return <DayDivider date={node.payload.date} />;

      case "window":
        // ✅ WindowMarker expects { startAt, endAt }
        return (
          <WindowMarker
            startAt={node.payload.startAt}
            endAt={node.payload.endAt}
          />
        );

      case "unread":
        return <NewMessagesMarker />;

      case "msg": {
        /** @type {MessageUI} */
        const m = node.payload;
        const isMine = m?.sender?.kind === "agent" || m?.sender?.id === "me";
        const groupedPrev = false; // add real grouping later
        const groupedNext = false;
        const showAvatar = !groupedPrev;

        return (
          <MessageBubble
            message={m}
            isMine={isMine}
            groupedPrev={groupedPrev}
            groupedNext={groupedNext}
            showAvatar={showAvatar}
          />
        );
      }

      default:
        return null;
    }
  }, []);

  // Empty state
  if (items.length === 0 && renderEmpty) {
    return <Box sx={{ height: "100%" }}>{renderEmpty}</Box>;
  }

  return (
    <Box sx={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <MessageVirtualList
          items={items}
          itemKey={(n) => n.id}
          renderItem={renderItem}
          onReachTop={isHydrated ? loadPrev : undefined}
          bottomLock={bottomLock}
          estimateItemHeight={72}
        />
      </Box>

      <TypingPresenceBar typing={typing} />
    </Box>
  );
}
