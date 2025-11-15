// src/TeamInbox/utils/keys.js
// Use: Generate stable keys for React lists (no index keys).
// Works with: TicketsVirtualList, MessageVirtualList, Sidebar components.
// Uses: Pure helpers only. No side effects.

/**
 * Lightweight deterministic string hash (djb2 variant).
 * Pure and stable across runs; not for security.
 * @param {string} s
 * @returns {string} hex-like string
 */
export function hashString(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  const u = h >>> 0; // unsigned
  return u.toString(16).padStart(8, "0");
}

/**
 * Key for a ticket list item. Prefer intrinsic stable IDs.
 * Fallback derives a hash from critical fields.
 * @param {{id?: string, roomId?: string, title?: string, updatedAt?: string}} item
 * @returns {string}
 */
export function keyForTicket(item) {
  if (item && item.id) return String(item.id);
  const roomId = item?.roomId ?? "";
  const title = item?.title ?? "";
  const updatedAt = item?.updatedAt ?? "";
  return `t_${hashString(`${roomId}|${title}|${updatedAt}`)}`;
}

/**
 * Key for a message. Prefer message.id; fall back to (roomId + createdAt + short text hash).
 * @param {{id?: string, roomId?: string, createdAt?: string, text?: string}} msg
 * @returns {string}
 */
export function keyForMessage(msg) {
  if (msg && msg.id) return String(msg.id);
  const roomId = msg?.roomId ?? "";
  const createdAt = msg?.createdAt ?? "";
  const text = msg?.text ?? "";
  return `m_${hashString(`${roomId}|${createdAt}|${text.slice(0, 32)}`)}`;
}

/**
 * Key for a room list entry. Prefer room.id; fall back to (division + title).
 * @param {{id?: string, division?: string, title?: string}} room
 * @returns {string}
 */
export function keyForRoom(room) {
  if (room && room.id) return String(room.id);
  const division = room?.division ?? "";
  const title = room?.title ?? "";
  return `r_${hashString(`${division}|${title}`)}`;
}
