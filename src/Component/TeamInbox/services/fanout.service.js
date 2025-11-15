// src/TeamInbox/services/fanout.service.js
// Transport → State bridge. Consumes normalized WS events and updates TeamInbox stores.
//
// Streams (logical):
//  - room.*     → rooms slice (rooms.upsert/remove)
//  - ticket.*   → tickets slice (tickets.upsert/remove)
//  - message.*  → chat slice (ticket thread messages/receipts only)
//
// NOTE: We no longer hydrate chat from any room-scoped WARM_WINDOW frames here.

import { EVENTS } from "../constants/EVENTS.js";
import {
  mapServerMessageToMessage,
  mapServerRoomToRoom,
  mapServerTicketToListItem,
} from "../utils/mappers.js";

const sinks = { rooms: null, tickets: null, chat: null };

export function registerSinks(next = {}) {
  if (next.rooms)   sinks.rooms = next.rooms;
  if (next.tickets) sinks.tickets = next.tickets;
  if (next.chat)    sinks.chat = next.chat;

  if (process.env.NODE_ENV !== "production") {
    console.log("[fanout] sinks registered", {
      rooms: !!sinks.rooms,
      tickets: !!sinks.tickets,
      chat: !!sinks.chat,
    });
  }
}

// Small utilities
const S = (v) => (v == null ? "" : String(v));
const isObj = (x) => x && typeof x === "object";

// Coalescing buffers (kept small & simple)
let roomUpserts = new Map();
let ticketUpserts = new Map();
let scheduled = false;

function scheduleFlush() {
  if (!scheduled) {
    scheduled = true;
    Promise.resolve().then(flush);
  }
}

function flush() {
  scheduled = false;

  if (roomUpserts.size && sinks.rooms?.upsert) {
    for (const r of roomUpserts.values()) {
      try {
        sinks.rooms.upsert(r);
      } catch (e) {
        logWarn("rooms.upsert", e);
      }
    }
  }
  roomUpserts.clear();

  if (ticketUpserts.size && sinks.tickets?.upsert) {
    const items = Array.from(ticketUpserts.values());
    try {
      sinks.tickets.upsert(items);
    } catch (e) {
      logWarn("tickets.upsert", e);
    }
  }
  ticketUpserts.clear();
}

function logWarn(where, e) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[fanout] ${where} error`, e);
  }
}

/** --------------------------------- Handler ---------------------------------- **/
export function handleEvent(evt) {
  if (!evt || typeof evt !== "object") return;

  switch (evt.type) {
    case EVENTS.STATE: {
      const status = evt.data?.status ?? "unknown";
      sinks.rooms?.setTransportStatus?.(status);
      sinks.chat?.setTransportStatus?.(status);
      if (process.env.NODE_ENV !== "production") {
        console.log("[fanout] STATE", status);
      }
      break;
    }

    case EVENTS.MESSAGE: {
      const payload = evt.data;
      if (!isObj(payload)) break;

      // Normalize a string subtype if provided (e.g., "room.created", "ticket.updated", "message.created")
      const subtype = S(payload.type || payload.event || "");

      // ───────── presence + protocol noise ─────────
      if (subtype === "presence.update") {
        const body =
          payload.data ??
          payload.presence ??
          payload.members ??
          payload.items ??
          payload;

        const items = Array.isArray(body) ? body : [body];

        for (const it of items) {
          if (!it) continue;
          const roomId = S(
            it.roomId ||
              it.room_id ||
              payload.roomId ||
              payload.room_id ||
              ""
          );
          if (!roomId) continue;

          try {
            sinks.rooms?.setPresence?.(roomId, [it]);
          } catch (e) {
            logWarn("rooms.setPresence(presence.update)", e);
          }
          try {
            sinks.chat?.setPresence?.(roomId, [it]);
          } catch (e) {
            logWarn("chat.setPresence(presence.update)", e);
          }
        }
        break;
      }

      if (
        subtype === "WELCOME" ||
        subtype === "READY" ||
        subtype === "pong" ||
        subtype === "PONG" ||
        subtype === "ping" ||
        subtype === "PING"
      ) {
        // pure protocol frames → ignore for UI
        break;
      }
      // ─────────────────────────────────────────────

      // ───────── ROOM stream: room.* ─────────
      if (subtype.startsWith("room.")) {
        if (!sinks.rooms) break;

        const rawRoom =
          payload.room ??
          payload.data?.room ??
          payload.data ??
          payload;

        const room = mapServerRoomToRoom(rawRoom);
        if (!room || !room.id) {
          if (process.env.NODE_ENV !== "production") {
            console.log("[fanout] room.* payload without mappable room", payload);
          }
          break;
        }

        const isDelete =
          subtype === "room.deleted" ||
          subtype === "room.removed";

        if (isDelete && typeof sinks.rooms.remove === "function") {
          try {
            sinks.rooms.remove(room.id);
          } catch (e) {
            logWarn("rooms.remove(room.*)", e);
          }
        } else {
          roomUpserts.set(room.id, room);
          scheduleFlush();
        }
        break;
      }

      // ───────── TICKET stream: ticket.* ─────────
      if (subtype.startsWith("ticket.")) {
        if (!sinks.tickets) break;

        // If the backend ever emits ticket.message.* we treat those as message-stream
        if (subtype.startsWith("ticket.message.")) {
          // Let the message.* handler below deal with message payloads
          if (process.env.NODE_ENV !== "production") {
            console.log("[fanout] ticket.message.* received; treat as message.*");
          }
          // Drop through to message branch by not breaking here.
        } else {
          const rawTicket =
            payload.ticket ??
            payload.data?.ticket ??
            payload.data ??
            payload;

          const item = mapServerTicketToListItem(rawTicket);
          if (!item?.id) break;

          const isDelete =
            subtype === "ticket.deleted" ||
            subtype === "ticket.removed";

          if (isDelete && typeof sinks.tickets.remove === "function") {
            try {
              sinks.tickets.remove(item.id);
            } catch (e) {
              logWarn("tickets.remove(ticket.*)", e);
            }
          } else {
            ticketUpserts.set(item.id, item);
            scheduleFlush();
          }
          break;
        }
      }

      // ───────── MESSAGE stream: message.* (ticket thread messages / receipts) ─────────
      if (subtype.startsWith("message.")) {
        if (!sinks.chat) break;

        const roomId = S(
          payload.roomId ??
          payload.room_id ??
          payload.data?.roomId ??
          payload.data?.room_id ??
          ""
        );
        const ticketId = S(
          payload.ticketId ??
          payload.ticket_id ??
          payload.data?.ticketId ??
          payload.data?.ticket_id ??
          ""
        );
        if (!ticketId) {
          if (process.env.NODE_ENV !== "production") {
            console.log("[fanout] message.* ignored (no ticketId)", payload);
          }
          break;
        }

        if (subtype === "message.created" || subtype === "message.updated") {
          const rawMsg =
            payload.message ??
            payload.data?.message ??
            payload;

          const msg = mapServerMessageToMessage(rawMsg);
          try {
            sinks.chat.appendTicket?.({ roomId, ticketId }, [msg], undefined);
          } catch (e) {
            logWarn("chat.appendTicket(message.*)", e);
          }
          break;
        }

        if (subtype === "message.receipt") {
          const recsRaw =
            payload.receipts ??
            payload.data?.receipts ??
            (payload.receipt || payload.data?.receipt
              ? [payload.receipt || payload.data?.receipt]
              : []);

          const recsArr = Array.isArray(recsRaw) ? recsRaw : [];
          const norm = recsArr
            .map((r) => {
              const messageId = S(
                r.messageId ??
                r.message_id ??
                r.id ??
                ""
              );
              if (!messageId) return null;

              return {
                messageId,
                type:
                  r.type ??
                  r.status ??
                  r.state ??
                  "sent",
                at:
                  r.at ??
                  r.ts ??
                  r.timestamp ??
                  r.updated_at ??
                  new Date().toISOString(),
                by:
                  r.by ??
                  r.by_party_id ??
                  r.party_id ??
                  r.actorId ??
                  null,
              };
            })
            .filter(Boolean);

          if (norm.length) {
            try {
              sinks.chat.applyReceiptsTicket?.({ roomId, ticketId }, norm);
            } catch (e) {
              logWarn("chat.applyReceiptsTicket(message.receipt)", e);
            }
          }
          break;
        }

        // Other message.* types (typing, etc.) can be added here later.
        break;
      }

      // ───────── Legacy fallback: plain room/ticket shapes ─────────
      if (looksLikeRoom(payload)) {
        if (sinks.rooms) {
          const room = mapServerRoomToRoom(payload);
          if (room?.id) {
            roomUpserts.set(room.id, room);
            scheduleFlush();
          }
        }
        break;
      }

      if (looksLikeTicket(payload)) {
        if (sinks.tickets) {
          const item = mapServerTicketToListItem(payload);
          if (item?.id) {
            ticketUpserts.set(item.id, item);
            scheduleFlush();
          }
        }
        break;
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("[fanout] MESSAGE (unhandled)", subtype || payload);
      }
      break;
    }

    case EVENTS.RECEIPT: {
      // If backend still emits room-scoped receipts, ignore here (ticket threads own receipts).
      if (process.env.NODE_ENV !== "production") {
        console.log(
          "[fanout] RECEIPT ignored at room-level (message.* owns receipts)"
        );
      }
      break;
    }

    case EVENTS.PRESENCE: {
      // Presence remains room-scoped; forward to rooms/chat presence if wired.
      const p = evt.data;
      const items = Array.isArray(p) ? p : [p];
      for (const it of items) {
        const roomId = S(it.roomId || it.room_id || "");
        if (!roomId) continue;
        try {
          sinks.rooms?.setPresence?.(roomId, [it]);
        } catch (e) {
          logWarn("rooms.setPresence", e);
        }
        try {
          sinks.chat?.setPresence?.(roomId, [it]);
        } catch (e) {
          logWarn("chat.setPresence", e);
        }
      }
      break;
    }

    case EVENTS.SYSTEM: {
      const s = evt.data || {};
      if (s.kind === "ticket_upsert" && sinks.tickets) {
        const rawTicket = s.ticket ?? s;
        const item = mapServerTicketToListItem(rawTicket);
        if (item?.id) {
          ticketUpserts.set(item.id, item);
          scheduleFlush();
        }
      }
      if (s.kind === "room_upsert" && sinks.rooms) {
        const rawRoom = s.room ?? s;
        const room = mapServerRoomToRoom(rawRoom);
        if (room?.id) {
          roomUpserts.set(room.id, room);
          scheduleFlush();
        }
      }
      break;
    }

    case EVENTS.ERROR: {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[fanout] ERROR", evt.data);
      }
      break;
    }

    default: {
      if (process.env.NODE_ENV !== "production") {
        console.log("[fanout] unknown evt.type", evt?.type);
      }
    }
  }
}

/** ----------------------------- Type Guards -------------------------------- */
function looksLikeRoom(payload) {
  if (!payload) return false;
  return !!(
    payload.id ||
    payload.roomId ||
    payload.room_id
  ) && !!(
    payload.title ||
    payload.name ||
    payload.roommates ||
    payload.participants
  );
}

function looksLikeTicket(payload) {
  if (!payload) return false;
  return !!(
    payload.id ||
    payload.ticketId ||
    payload.ticket_id
  ) && (
    payload.subject ||
    payload.title ||
    payload.preview ||
    payload.channel ||
    payload.status
  );
}

/** ----------------------------- Test Reset --------------------------------- */
export function _resetForTests() {
  roomUpserts.clear();
  ticketUpserts.clear();
  scheduled = false;
}
