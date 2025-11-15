// src/TeamInbox/constants/MESSAGE.js
// Use: Central message-specific enums/constants used across UI & utils.
// Works with: utils/receipts.js, MessageVirtualList, TicketsCard (ticks/flags/labels).
// Uses: No imports. Frozen at runtime.

export const FLAGS = Object.freeze({
  marketing: "#facc15",     // yellow-400
  info: "#60a5fa",          // blue-400
  confirmation: "#34d399",  // green-400
  alerts: "#f87171",        // red-400
});

export const LABELS = Object.freeze([
  "Active",
  "Expired",
  "Closed",
  "Escalated",
  "Muted",
  "Pinned",
]);

export const DELIVERY = Object.freeze({
  PENDING: "pending",
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
  FAILED: "failed",
});
