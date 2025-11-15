// src/TeamInbox/constants/EVENTS.js
// Use: Canonical event names emitted from ws.service → fanout → stores.
// Works with: ws.service, fanout.service, useWs/useChat/useRooms hooks, stores.
// Uses: No imports. Frozen at runtime.

export const EVENTS = Object.freeze({
  STATE: "state",              // Transport state changes (connecting/open/closed/error)
  MESSAGE: "message",          // Chat message payloads (history/live)
  RECEIPT: "receipt",          // Delivery/read/failure receipts
  PRESENCE: "presence",        // Online/typing/away signals
  SYSTEM: "system",            // Non-user system notices (room created/archived, etc.)
  ERROR: "errorFrame",         // Structured server error frames
  WINDOW_UPDATE: "window",     // Chat window start/end/remaining updates for a room
});
