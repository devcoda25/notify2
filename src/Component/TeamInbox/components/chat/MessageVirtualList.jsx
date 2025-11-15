// src/TeamInbox/components/chat/MessageVirtualList.jsx
// Use: Dependency-free simple virtual-ish list for chat timelines.
//      - Calls onReachTop() when user scrolls near the top
//      - Maintains stick-to-bottom when bottomLock.isAtBottom === true
//      - Uses stable keys via itemKey()
// Works with: ChatPane.jsx
// Uses: MUI only (Box)

import React, { useRef, useEffect, useCallback, useState } from "react";
import { Box } from "@mui/material";

/**
 * @param {{
 *   items: any[],
 *   itemKey: (node:any)=>string,
 *   renderItem: (node:any)=>React.ReactNode,
 *   onReachTop?: ()=>void,
 *   bottomLock?: { isAtBottom:boolean, setAtBottom:(b:boolean)=>void, bumpKey?:number },
 *   estimateItemHeight?: number
 * }} props
 */
export default function MessageVirtualList({
  items = [],
  itemKey,
  renderItem,
  onReachTop,
  bottomLock,
  estimateItemHeight = 72,
}) {
  const scrollerRef = useRef(null);
  const contentRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Keep external lock state in sync if provided
  useEffect(() => {
    if (!bottomLock?.isAtBottom) return;
    // Scroll to bottom when the lock says so (e.g., new message appended).
    const el = scrollerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
      setIsAtBottom(true);
    }
  }, [items.length, bottomLock?.isAtBottom, bottomLock?.bumpKey]);

  // Detect nearing top to fetch older messages
  const handleScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const nearTop = el.scrollTop <= 48;
    if (nearTop && typeof onReachTop === "function") {
      onReachTop();
    }

    const atBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 8;
    setIsAtBottom(atBottom);
    if (bottomLock?.setAtBottom) bottomLock.setAtBottom(atBottom);
  }, [onReachTop, bottomLock]);

  // On mount: stick to bottom
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
      setIsAtBottom(true);
      if (bottomLock?.setAtBottom) bottomLock.setAtBottom(true);
    }
  }, []); // mount only

  return (
    <Box
      ref={scrollerRef}
      onScroll={handleScroll}
      sx={{
        position: "relative",
        height: "100%",
        overflowY: "auto",
        overscrollBehavior: "contain",
        // small perf hint
        contain: "content",
      }}
    >
      <Box
        ref={contentRef}
        sx={{
          display: "grid",
          gridAutoRows: "min-content",
          rowGap: 0.75,
          py: 1,
        }}
      >
        {items.map((node) => (
          <Box key={itemKey(node)} sx={{ minHeight: estimateItemHeight }}>
            {renderItem(node)}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
