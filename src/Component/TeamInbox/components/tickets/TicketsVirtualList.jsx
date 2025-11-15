// src/TeamInbox/components/tickets/TicketsVirtualList.jsx
// Use: Virtualized list wrapper for tickets; renders TicketsCard rows with stable keys.
// Improvements:
// - IntersectionObserver sentinel for reliable "Load more" trigger.
// - Accessible empty state.
// - Removes noisy console logging in production builds.

import React, { useEffect, useMemo, useRef } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { keyForTicket } from "../../utils/keys.js";
import TicketsCard from "./TicketsCard.jsx";

/**
 * @param {{
 *  tickets?: Array<any>,
 *  items?: Array<any>,          // legacy alias
 *  activeId?: string|null,      // ticketId to highlight
 *  onSelect?: (roomId:string, meta?:{ticketId?:string}) => void,
 *  height?: number|string,
 *  isLoading?: boolean,
 *  onEndReached?: () => void,
 *  renderLoadMoreButton?: boolean, // if true, render a button instead of auto-observe
 * }} props
 */
export default function TicketsVirtualList({
  tickets,
  items,
  activeId = null,
  onSelect,
  height = "100%",
  isLoading = false,
  onEndReached,
  renderLoadMoreButton = false,
}) {
  const source = tickets ?? items ?? [];
  const list = useMemo(() => (Array.isArray(source) ? source : []), [source]);
  const sentinelRef = useRef(null);
  const hasMore = typeof onEndReached === "function";

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const sample = list?.[0] ? { id: list[0].id, roomId: list[0].roomId, title: list[0].title } : null;
      // eslint-disable-next-line no-console
      console.debug("[TI] TicketsVirtualList", { count: list.length, isLoading, activeId, sample });
    }
  }, [list.length, isLoading, activeId, list]);

  useEffect(() => {
    if (!hasMore || renderLoadMoreButton) return;
    const node = sentinelRef.current;
    if (!node) return;

    let ticking = false;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting && !ticking && !isLoading) {
          ticking = true;
          Promise.resolve()
            .then(() => onEndReached?.())
            .finally(() => { ticking = false; });
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [hasMore, isLoading, onEndReached, renderLoadMoreButton]);

  if (!isLoading && list.length === 0) {
    return (
      <Box role="status" aria-live="polite" p={3}>
        <Typography variant="body1" color="text.secondary">No tickets yet.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, overflowY: "auto", bgcolor: "background.paper" }}>
      {list.map((t) => (
        <Box key={keyForTicket(t)}>
          <TicketsCard
            ticket={t}
            active={String(t.id) === String(activeId)}
            onClick={() => onSelect?.(String(t.roomId || ""), { ticketId: String(t.id || "") })}
          />
        </Box>
      ))}

      {isLoading && (
        <Box sx={{ py: 1, textAlign: "center", fontSize: 12, opacity: 0.7 }}>
          <CircularProgress size={16} sx={{ mr: 1 }} />
          Loading…
        </Box>
      )}

      {hasMore && !renderLoadMoreButton && (
        <Box ref={sentinelRef} role="presentation" data-testid="tickets-end" sx={{ height: 1 }} />
      )}

      {hasMore && renderLoadMoreButton && (
        <Box sx={{ py: 1, textAlign: "center" }}>
          <Button onClick={() => onEndReached?.()} disabled={isLoading} variant="outlined">
            {isLoading ? "Loading…" : "Load more"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
