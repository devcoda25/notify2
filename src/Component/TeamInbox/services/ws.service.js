// src/TeamInbox/services/ws.service.js
// One pipe in, one pipe out. Wraps wsClient to provide a tiny, normalized, batched WS API.

import * as lowWS from "../../../auth/ws/wsClient.js";
import { EVENTS } from "../constants/EVENTS.js";

/** ---------------- Normalization helpers ---------------- **/

function normalizeEvent(raw) {
  if (!raw || typeof raw !== "object") return null;

  // Already normalized?
  if (
    raw.type === EVENTS.STATE ||
    raw.type === EVENTS.MESSAGE ||
    raw.type === EVENTS.ERROR ||
    raw.type === EVENTS.PRESENCE ||
    raw.type === EVENTS.RECEIPT ||
    raw.type === EVENTS.SYSTEM
  ) {
    return { ...raw, t: raw.t ?? Date.now() };
  }

  if (raw.type === "state") {
    return {
      type: EVENTS.STATE,
      data: { status: raw.state?.status ?? "unknown" },
      t: Date.now(),
    };
  }
  if (raw.type === "message") {
    return { type: EVENTS.MESSAGE, data: raw.data, t: Date.now() };
  }
  if (raw.type === "errorFrame") {
    return { type: EVENTS.ERROR, data: raw.data, t: Date.now() };
  }

  // presence / presence.update → normalized PRESENCE event
  if (raw.type === "presence" || raw.type === "presence.update") {
    return {
      type: EVENTS.PRESENCE,
      data: raw.data ?? raw,
      t: Date.now(),
    };
  }

  if (raw.type === "receipt") {
    return { type: EVENTS.RECEIPT, data: raw.data, t: Date.now() };
  }
  if (raw.type === "system") {
    return { type: EVENTS.SYSTEM, data: raw.data, t: Date.now() };
  }

  // Fallback (raw frames like {type:"pong"} land here)
  return { type: EVENTS.MESSAGE, data: raw.data ?? raw, t: Date.now() };
}

/** --------------- Lightweight event bus w/ batching --------------- **/

const listeners = new Set();       // fn(evt)
const statusListeners = new Set(); // fn(status)

let queue = [];
let scheduled = false;

// Generic “frames to send later” (messages, presence, etc.), not for subscribes.
let pendingOutbox = [];

const subscribedRooms = new Set();   // roomIds (all fetched rooms that requested live updates)
const subscribedTickets = new Map(); // ticketId → { ticketId, roomId? }

// Single global party for this SPA session (identity only; server auto-subscribes)
let currentPartyId = null;

function scheduleFlush() {
  if (scheduled) return;
  scheduled = true;
  Promise.resolve().then(flush);
}

function flush() {
  scheduled = false;
  if (!queue.length) return;
  const batch = queue;
  queue = [];
  for (const evt of batch) {
    for (const cb of listeners) {
      try {
        cb(evt);
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[ws.service] listener error", e);
        }
      }
    }
  }
}

/** ----------------- Generic adapter for unknown client APIs ----------------- **/

function listenLow(event, cb) {
  // 1) on(event, cb)
  if (typeof lowWS.on === "function") {
    const res = lowWS.on(event, cb);
    return typeof res === "function" ? res : () => {};
  }

  // 2) addEventListener/removeEventListener
  if (typeof lowWS.addEventListener === "function") {
    lowWS.addEventListener(event, cb);
    return () => {
      try {
        lowWS.removeEventListener?.(event, cb);
      } catch {}
    };
  }

  // 3) subscribe(event, cb)
  if (typeof lowWS.subscribe === "function") {
    const res = lowWS.subscribe(event, cb);
    return typeof res === "function" ? res : () => {};
  }

  // 4) specific methods
  const specific = {
    message: lowWS.onMessage,
    open: lowWS.onOpen,
    close: lowWS.onClose,
    error: lowWS.onError,
    reconnect: lowWS.onReconnect,
  };
  if (typeof specific[event] === "function") {
    const res = specific[event].call(lowWS, cb);
    return typeof res === "function" ? res : () => {};
  }

  // 5) EventTarget-like single handler props (we wrap to avoid clobbering)
  const propMap = {
    message: "onmessage",
    open: "onopen",
    close: "onclose",
    error: "onerror",
    reconnect: "onreconnect",
  };
  const prop = propMap[event];
  if (prop && prop in lowWS) {
    const prev = lowWS[prop];
    const handler = (e) => {
      try {
        prev?.(e);
      } catch {}
      try {
        cb(e);
      } catch {}
    };
    lowWS[prop] = handler;
    return () => {
      if (lowWS[prop] === handler) lowWS[prop] = prev ?? null;
    };
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[ws.service] No compatible listener API for event "${event}" on wsClient`
    );
  }
  return () => {};
}

/** --------------------- Low-level send helper --------------------- **/

function _sendToLow(obj) {
  if (typeof obj === "string") {
    lowWS.send(obj, {});
    return;
  }
  const t = String(obj?.type || "frame");
  lowWS.send(t, obj);
}

/** --------------- Wire low-level client → our bus --------------- **/

let lowUnsubs = [];
let attached = false;
let currentStatus = "closed";
let reconnectTimer = null;
let reconnectAttempts = 0;
const AUTO_RECONNECT =
  String(process.env.REACT_APP_WS_AUTO_RECONNECT ?? "1") === "1";

function scheduleReconnect() {
  if (!AUTO_RECONNECT) return;
  if (reconnectTimer) return;
  const steps = [1000, 2000, 5000, 10000, 30000];
  const base = steps[Math.min(reconnectAttempts, steps.length - 1)];
  const jitter = base * (0.2 * (Math.random() - 0.5)) * 2; // ±20%
  const delay = Math.max(500, Math.round(base + jitter));
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    reconnectAttempts += 1;
    try {
      lowWS.connect?.();
      emitStatus("connecting");
    } catch {}
  }, delay);
}

function emitStatus(next) {
  currentStatus = next;
  for (const cb of statusListeners) {
    try {
      cb(next);
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[ws.service] status listener error", e);
      }
    }
  }
  const stateEvt = normalizeEvent({ type: "state", state: { status: next } });
  if (stateEvt) {
    queue.push(stateEvt);
    scheduleFlush();
  }

  // IMPORTANT:
  // - "open"  → TCP open, WELCOME/REGISTER handshake still in progress.
  // - "registered" → REGISTER/READY completed, safe to send app frames.
  if (next === "registered") {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    reconnectAttempts = 0;

    try {
      // Flush generic queued frames (non-subscribe) first
      if (pendingOutbox.length) {
        for (const frame of pendingOutbox.splice(0)) {
          try {
            _sendToLow(frame);
          } catch {
            /* keep going */
          }
        }
      }

      // NOTE:
      // - Party subscription is now automatic on server-side after auth.
      // - We DO NOT send any subscribe_party frame from the SPA.

      // 1) ROOM stream: all known rooms (all fetched rooms that requested live)
      if (subscribedRooms.size) {
        for (const roomId of subscribedRooms) {
          _sendRoomSubscribeNow(roomId);
        }
      }

      // 2) TICKET stream: all known tickets (for each room)
      if (subscribedTickets.size) {
        for (const { ticketId, roomId } of subscribedTickets.values()) {
          _sendTicketSubscribeNow({ ticketId, roomId });
        }
      }
    } catch {}
  } else if (next === "closed" || next === "error") {
    scheduleReconnect();
  }
}

// Idempotent
function attachLowLevel() {
  if (attached) return;
  attached = true;

  const unMsg = listenLow("message", (e) => {
    const raw = e?.data ?? e;
    let parsed = null;
    if (typeof raw === "string") {
      try {
        parsed = JSON.parse(raw);
      } catch {}
    }
    if (parsed && (parsed.type === "ERROR" || parsed.type === "ERROR_FRAME")) {
      const evt = normalizeEvent({ type: "errorFrame", data: parsed });
      if (evt) {
        queue.push(evt);
        scheduleFlush();
      }
      return;
    }
    const evt = normalizeEvent({ type: "message", data: parsed ?? raw });
    if (evt) {
      queue.push(evt);
      scheduleFlush();
    }
  });

  const unOpen = listenLow("open", () => emitStatus("open"));
  const unClose = listenLow("close", () => emitStatus("closed"));
  const unErr = listenLow("error", () => emitStatus("error"));
  const unRe = listenLow("reconnect", () => emitStatus("connecting"));
  const unReg = listenLow("registered", () => emitStatus("registered"));

  lowUnsubs = [unMsg, unOpen, unClose, unErr, unRe, unReg];
}

/** --------------------- Public connect --------------------- **/

function connect(url, opts) {
  attachLowLevel();
  if (typeof lowWS.connect === "function") {
    try {
      lowWS.connect(url, opts);
      emitStatus("connecting");
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[ws.service] connect error", e);
      }
    }
  }
}

const status$ = {
  get() {
    return currentStatus;
  },
  subscribe(cb) {
    if (typeof cb !== "function") return () => {};
    statusListeners.add(cb);
    try {
      cb(currentStatus);
    } catch {}
    return () => {
      statusListeners.delete(cb);
    };
  },
};

/** ----------------- Generic send (non-subscribe) ----------------- **/

function send(frame) {
  try {
    // For non-subscribe flows (messages, presence, etc.)
    if (currentStatus === "registered") {
      _sendToLow(frame);
    } else {
      pendingOutbox.push(frame);
    }
  } catch (e) {
    try {
      pendingOutbox.push(frame);
    } catch {}
    if (process.env.NODE_ENV !== "production") {
      console.warn("[ws.service] send (queued) error", e);
    }
  }
}

/** -------- Internal helpers for subscribe frames (no queue) -------- **/

function _sendRoomSubscribeNow(roomId) {
  const rid = String(roomId || "");
  if (!rid) return;
  try {
    _sendToLow({
      type: "APP/SUBSCRIBE_ROOM",
      roomId: rid,
      t: Date.now(),
    });
  } catch {}
  try {
    _sendToLow({
      type: "SUBSCRIBE",
      chat_id: rid,
      t: Date.now(),
    });
  } catch {}
}

function _sendRoomUnsubscribeNow(roomId) {
  const rid = String(roomId || "");
  if (!rid) return;
  try {
    _sendToLow({
      type: "APP/UNSUBSCRIBE_ROOM",
      roomId: rid,
      t: Date.now(),
    });
  } catch {}
  try {
    _sendToLow({
      type: "UNSUBSCRIBE",
      chat_id: rid,
      t: Date.now(),
    });
  } catch {}
}

function _sendTicketSubscribeNow({ ticketId, roomId }) {
  const tid = String(ticketId || "");
  if (!tid) return;
  const rid = roomId ? String(roomId) : undefined;

  const frame = {
    type: "subscribe_ticket",
    ticket_id: tid,
    t: Date.now(),
  };
  if (rid) frame.chat_id = rid;

  try {
    _sendToLow(frame);
  } catch {}
}

function _sendTicketUnsubscribeNow(ticketId) {
  const tid = String(ticketId || "");
  if (!tid) return;
  try {
    _sendToLow({
      type: "unsubscribe_ticket",
      ticket_id: tid,
      t: Date.now(),
    });
  } catch {}
}

/** 3 logical subscription helpers: party / room / ticket **/

// PARTY: global stream for room.* (and any other party-level events)
// NOTE: server auto-subscribes to ws:party:<partyId> after auth.
// We ONLY track currentPartyId locally; we DO NOT send subscribe_party.
function subscribeParty(partyId) {
  if (!partyId) return;
  const pid = String(partyId);
  currentPartyId = pid;
  // No outbound frame here; nty-ws attaches client to ws:party:<partyId> on REGISTER.
}

function unsubscribeParty(partyId) {
  if (!partyId) return;
  const pid = String(partyId);
  if (currentPartyId === pid) currentPartyId = null;
  // Unsubscribing from party is explicit; only meaningful when registered.
  if (currentStatus === "registered") {
    try {
      _sendToLow({ type: "unsubscribe_party", party_id: pid, t: Date.now() });
    } catch {}
  }
}

// ROOM: stream for ticket.* (room-scoped ticket list / status)
function subscribe(roomId) {
  if (!roomId) return;
  const rid = String(roomId);
  subscribedRooms.add(rid); // remember all rooms that requested live

  // Only send frame if already REGISTERED; otherwise “registered” replayer will handle it.
  if (currentStatus === "registered") {
    _sendRoomSubscribeNow(rid);
  }
}

function unsubscribe(roomId) {
  if (!roomId) return;
  const rid = String(roomId);
  subscribedRooms.delete(rid);

  if (currentStatus === "registered") {
    _sendRoomUnsubscribeNow(rid);
  }
}

// TICKET: stream for message.* (live messages / receipts / typing per ticket)
function subscribeTicket({ roomId, ticketId }) {
  if (!ticketId) return;
  const tid = String(ticketId);
  const rid = roomId ? String(roomId) : undefined;
  subscribedTickets.set(tid, { ticketId: tid, roomId: rid });

  if (currentStatus === "registered") {
    _sendTicketSubscribeNow({ ticketId: tid, roomId: rid });
  }
}

function unsubscribeTicket(ticketId) {
  if (!ticketId) return;
  const tid = String(ticketId);
  subscribedTickets.delete(tid);

  if (currentStatus === "registered") {
    _sendTicketUnsubscribeNow(tid);
  }
}

/** --------------------- Event subscription API --------------------- **/

function onEvent(cb) {
  if (typeof cb !== "function") return () => {};
  attachLowLevel();
  listeners.add(cb);
  try {
    cb({ type: EVENTS.STATE, data: { status: currentStatus }, t: Date.now() });
  } catch {}
  return () => {
    listeners.delete(cb);
  };
}

function off(cb) {
  listeners.delete(cb);
}

function _resetForTests() {
  queue = [];
  scheduled = false;
  listeners.clear();
  statusListeners.clear();
  pendingOutbox = [];
  subscribedRooms.clear();
  subscribedTickets.clear();
  currentPartyId = null;
}

export const wsService = Object.freeze({
  connect,
  status$,
  send,                // generic (non-subscribe) frames
  subscribeParty,
  unsubscribeParty,
  subscribe,           // room
  unsubscribe,         // room
  subscribeTicket,
  unsubscribeTicket,
  onEvent,
  off,
  _resetForTests,
});
