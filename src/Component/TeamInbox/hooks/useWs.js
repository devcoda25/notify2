// /src/TeamInbox/hooks/useWs.js
// Mount once near TeamInbox root to connect ws.service → fanout.service.
// Room-level SUBSCRIBE/UNSUBSCRIBE orchestration is kept.
// Ticket-level subscribe_ticket/unsubscribe_ticket mirrors the same pattern.

import { useEffect, useMemo, useCallback, useRef } from "react";

import { wsService } from "../services/ws.service.js";
import { handleEvent, registerSinks } from "../services/fanout.service.js";

import {
  useRoomsStore,
  selectTransportStatus as selectRoomsStatus,
  selectActiveRoomId,
} from "../store/useRoomsStore.js";
import { useTicketsStore } from "../store/useTicketsStore.js";
import { useChatStore, selectChatTransportStatus } from "../store/useChatStore.js";
import { useUserStore } from "../../../auth/user.store.js";

/** Bind store actions without React deps (Zustand facades) */
function makeRoomsSink() {
  const api = useRoomsStore.getState();
  return {
    upsert: api.upsert,
    updateUnread: api.updateUnread,
    setPresence: api.setPresence,
    setTransportStatus: api.setTransportStatus,
    remove: api.remove || (() => {}),
    setMyAvailability: api.setMyAvailability || (() => {}),
  };
}
function makeTicketsSink() {
  const api = useTicketsStore.getState();
  return {
    hydrate: api.hydrate,
    append: api.append,
    upsert: api.upsert,
    refresh: api.refresh || undefined, // if exposed, fanout may call refresh after bursts
    remove: api.remove || (() => {}),
  };
}
function makeChatSink() {
  const api = useChatStore.getState();
  return {
    // legacy room-scoped (left intact, but fanout won’t hydrate from room anymore)
    hydrate: api.hydrate,
    append: api.append,
    applyReceipts: api.applyReceipts,

    // ticket-scoped sinks
    hydrateTicket: api.hydrateTicket,
    appendTicket: api.appendTicket,
    applyReceiptsTicket: api.applyReceiptsTicket,

    setPresence: api.setPresence || undefined,
    setTransportStatus: api.setTransportStatus,
  };
}

export function useWs() {
  const initializedRef = useRef(false);

  // Prefer chat status if present (fanout writes both)
  const roomsStatus = useRoomsStore(selectRoomsStatus);
  const chatStatus = useChatStore(selectChatTransportStatus);
  const status = chatStatus !== "unknown" ? chatStatus : roomsStatus;

  const activeRoomId = useRoomsStore(selectActiveRoomId);
  const prevRoomIdRef = useRef(null);

  // Active ticket is read from TicketsStore (single-ish source of truth for now)
  const activeTicketId = useTicketsStore((s) =>
    s.activeTicketId ??
    s.activeTicket?.id ??
    s.selectedTicketId ??
    null
  );
  const prevTicketIdRef = useRef(null);

  const send = useCallback((payload) => {
    if (process.env.NODE_ENV !== "production") console.log("[WS] send", payload);
    wsService.send?.(payload);
  }, []);

  const subscribe = useCallback((roomId) => {
    if (!roomId) return;
    if (process.env.NODE_ENV !== "production") {
      console.log("[WS] subscribe → room", String(roomId));
    }
    wsService.subscribe?.(String(roomId));
  }, []);

  const unsubscribe = useCallback((roomId) => {
    if (!roomId) return;
    if (process.env.NODE_ENV !== "production") {
      console.log("[WS] unsubscribe ← room", String(roomId));
    }
    wsService.unsubscribe?.(String(roomId));
  }, []);

  // One-time registration & connection
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    registerSinks({
      rooms: makeRoomsSink(),
      tickets: makeTicketsSink(),
      chat: makeChatSink(),
    });

    const off = wsService.onEvent?.((evt) => {
      try {
        // Dev help: log ticket/room typed messages
        if (
          process.env.NODE_ENV !== "production" &&
          evt?.data &&
          typeof evt.data.type === "string" &&
          (evt.data.type.startsWith("ticket.") ||
            evt.data.type.startsWith("room.") ||
            evt.data.type.startsWith("message."))
        ) {
          console.log("[WS EVT]", evt.data.type, {
            roomId: evt.data.roomId,
            ticketId: evt.data.ticketId,
          });
        }
        handleEvent(evt);
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[useWs] fanout.handleEvent error:", e, "evt:", evt);
        }
      }
    });

    // Mirror global availability → rooms store (once + subscribe)
    try {
      const curr =
        useUserStore.getState().currentUser?.availability || "available";
      useRoomsStore.getState().setMyAvailability?.(curr);
      const unsub = useUserStore.subscribe(
        (s) => s.currentUser?.availability || "available",
        (av) => {
          try {
            useRoomsStore.getState().setMyAvailability?.(av);
          } catch {}
        }
      );
      wsService.__unsubAvailability = unsub;
    } catch {}

    try {
      if (process.env.NODE_ENV !== "production") console.log("[WS] connect()");
      wsService.connect?.();
    } catch {}

    return () => {
      try {
        off?.();
      } catch {}
      try {
        wsService.__unsubAvailability?.();
      } catch {}
    };
  }, []);

  // Keep SUBSCRIBE/UNSUBSCRIBE at room scope (rooms pipe for ticket.*)
  useEffect(() => {
    const prev = prevRoomIdRef.current;
    const next = activeRoomId ? String(activeRoomId) : null;
    if (prev && prev !== next) wsService.unsubscribe?.(prev);
    if (next && next !== prev) wsService.subscribe?.(next);
    prevRoomIdRef.current = next;
  }, [activeRoomId]);

  // Ticket-level subscribe_ticket / unsubscribe_ticket (ticket pipe for message.*)
  useEffect(() => {
    const prevTid = prevTicketIdRef.current;
    const nextTid = activeTicketId ? String(activeTicketId) : null;

    // Unsubscribe previous ticket if changed
    if (prevTid && prevTid !== nextTid) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[WS] unsubscribe_ticket ←", prevTid);
      }
      wsService.unsubscribeTicket?.(prevTid);
    }

    // Subscribe new ticket if present
    if (nextTid && nextTid !== prevTid) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[WS] subscribe_ticket →", {
          ticketId: nextTid,
          roomId: activeRoomId || null,
        });
      }
      wsService.subscribeTicket?.({
        roomId: activeRoomId || null,
        ticketId: nextTid,
      });
    }

    prevTicketIdRef.current = nextTid;
  }, [activeRoomId, activeTicketId]);

  // Public API
  return useMemo(
    () => ({ status, send, subscribe, unsubscribe }),
    [status, send, subscribe, unsubscribe]
  );
}

export default useWs;
