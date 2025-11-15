// src/TeamInbox/store/useChatStore.js
// Use: Ticket-scoped AND room-scoped message timelines.
// - New: byThread[ticketId] with hydrateTicket/appendTicket/applyReceiptTicket...
// - Legacy kept: byRoom[roomId] and hydrate/append for backward compatibility.

import { create } from "zustand";
import { toUiMessages } from "../services/chat.adapter";

/** Types omitted for brevity; shapes are same as before plus ticketId on Message. */

const initialRoom = () => ({
  byId: Object.create(null),
  order: [],
  cursor: undefined,
  hydrated: false,
  pendingByTemp: Object.create(null),
  pendingOrder: [],
});

const initialThread = () => ({
  byId: Object.create(null),
  order: [],
  cursor: undefined,
  hydrated: false,
});

const initial = {
  byRoom: Object.create(null),    // legacy
  byThread: Object.create(null),  // NEW ticket-scoped
  transportStatus: "unknown",
};

// ------------------------------ Helpers -------------------------------------

const normId = (x) => (x == null ? "" : String(x));

function normalizeSender(v) {
  if (!v) return undefined;
  return {
    id: normId(v.id ?? v.userId),
    kind: v.kind ?? "agent",
    displayName: String(v.displayName ?? v.name ?? "Unknown"),
    avatarUrl: v.avatarUrl ?? undefined,
    meta: v.meta ?? {},
  };
}

function normalizeChannel(c) {
  if (!c) return { kind: "inapp" };
  if (typeof c === "string") return { kind: c.toLowerCase() };
  return { kind: String(c.kind || "inapp").toLowerCase(), sub: c.sub ? String(c.sub).toLowerCase() : undefined };
}

function inferStatus(m) {
  const s = (m.status || "").toString().toLowerCase();
  if (s) return s;
  if (m.readAt) return "read";
  if (m.deliveredAt) return "delivered";
  if (m.sentAt) return "sent";
  if (m.deletedAt) return "deleted";
  return "sent";
}

function normalizeMessage(m = {}) {
  const id = normId(m.id ?? m.messageId);
  return {
    id,
    roomId: normId(m.roomId),
    ticketId: m.ticketId != null ? normId(m.ticketId) : undefined,
    channel: normalizeChannel(m.channel),
    provider: m.provider ?? undefined,
    sender: normalizeSender(m.sender),
    from: Array.isArray(m.from) ? m.from.map(normalizeSender).filter(Boolean) : (m.sender ? [normalizeSender(m.sender)] : []),
    to: Array.isArray(m.to) ? m.to.map(normalizeSender).filter(Boolean) : [],
    text: typeof m.text === "string" ? m.text : undefined,
    parts: Array.isArray(m.parts) ? m.parts.map((p) => ({
      id: normId(p.id ?? p.partId),
      kind: p.kind ?? "document",
      mime: String(p.mime ?? p.mimetype ?? "application/octet-stream"),
      url: p.url ?? undefined,
      name: p.name ?? undefined,
      bytes: Number.isFinite(p.bytes) ? p.bytes : undefined,
      meta: p.meta ?? {},
    })) : [],
    labels: Array.isArray(m.labels) ? m.labels.map(String) : undefined,
    flag: m.flag ?? undefined,
    status: inferStatus(m),
    createdAt: m.createdAt ?? new Date().toISOString(),
    sentAt: m.sentAt ?? undefined,
    deliveredAt: m.deliveredAt ?? undefined,
    readAt: m.readAt ?? undefined,
    editedAt: m.editedAt ?? undefined,
    deletedAt: m.deletedAt ?? undefined,
    prevCursor: m.prevCursor ?? undefined,
    meta: m.meta ?? {},
  };
}

function sortAscByCreated(order, byId) {
  return [...order].sort((a, b) => {
    const ta = byId[a]?.createdAt || "";
    const tb = byId[b]?.createdAt || "";
    if (ta === tb) return a.localeCompare(b);
    return ta < tb ? -1 : 1;
  });
}

function indexMessages(prevById, list) {
  const byId = { ...(prevById || {}) };
  for (const raw of (Array.isArray(list) ? list : [])) {
    const msg = normalizeMessage(raw);
    if (!msg.id) continue;
    const prev = byId[msg.id] || {};
    byId[msg.id] = mergeMessage(prev, msg);
  }
  return byId;
}

function mergeMessage(prev = {}, next = {}) {
  const statusRank = { pending: 0, queued: 1, failed: 1, sent: 2, delivered: 3, read: 4, deleted: 5 };
  const status =
    (statusRank[next.status] ?? 0) >= (statusRank[prev.status] ?? 0)
      ? next.status
      : prev.status;

  const latest = (a, b) => (!a ? b : !b ? a : (a > b ? a : b));

  return {
    ...prev,
    ...next,
    from: dedupeSenders(prev.from, next.from),
    to: dedupeSenders(prev.to, next.to),
    labels: dedupeStrings(prev.labels, next.labels),
    sentAt: latest(prev.sentAt, next.sentAt),
    deliveredAt: latest(prev.deliveredAt, next.deliveredAt),
    readAt: latest(prev.readAt, next.readAt),
    editedAt: latest(prev.editedAt, next.editedAt),
    deletedAt: latest(prev.deletedAt, next.deletedAt),
    status,
  };
}

function dedupeSenders(a = [], b = []) {
  const map = new Map();
  for (const x of [...(a || []), ...(b || [])]) if (x?.id) map.set(String(x.id), x);
  return Array.from(map.values());
}
function dedupeStrings(a = [], b = []) {
  const set = new Set([...(a || []), ...(b || [])].map(String));
  return set.size ? Array.from(set) : undefined;
}

function ensureRoom(state, roomId) {
  const id = normId(roomId);
  const existing = state.byRoom[id];
  if (existing) return existing;
  const fresh = initialRoom();
  state.byRoom = { ...state.byRoom, [id]: fresh };
  return fresh;
}

function ensureThread(state, ticketId) {
  const id = normId(ticketId);
  const existing = state.byThread[id];
  if (existing) return existing;
  const fresh = initialThread();
  state.byThread = { ...state.byThread, [id]: fresh };
  return fresh;
}

function upsertPending(room, tempId, draft) {
  const id = normId(tempId);
  const next = normalizeMessage({
    id,
    roomId: draft.roomId,
    ticketId: draft.ticketId,
    channel: draft.channel || { kind: "inapp" },
    from: draft.from || undefined,
    to: draft.to || undefined,
    text: typeof draft.text === "string" ? draft.text : undefined,
    parts: Array.isArray(draft.parts) ? draft.parts : [],
    labels: draft.labels,
    flag: draft.flag,
    status: "pending",
    createdAt: draft.createdAt ?? new Date().toISOString(),
    meta: draft.meta ?? {},
  });
  room.pendingByTemp[id] = next;
  if (!room.pendingOrder.includes(id)) room.pendingOrder.push(id);
}

// ------------------------------- Store --------------------------------------

export const useChatStore = create((set, get) => ({
  ...initial,

  // ─────────── ROOM-SCOPED (legacy; unchanged) ───────────
  hydrate(roomId, list, cursor) {
    const rid = normId(roomId);
    set((s) => {
      const room = ensureRoom({ ...s }, rid);
      const byId = indexMessages({}, list);
      const order = sortAscByCreated(Object.keys(byId), byId);
      const nextRoom = {
        ...room,
        byId,
        order,
        cursor,
        hydrated: true,
        pendingByTemp: room.pendingByTemp,
        pendingOrder: room.pendingOrder,
      };
      return { byRoom: { ...s.byRoom, [rid]: nextRoom } };
    });
  },

  append(roomId, list, nextCursor) {
    if (!Array.isArray(list) || list.length === 0) return;
    const rid = normId(roomId);
    set((s) => {
      const room = ensureRoom({ ...s }, rid);
      const byId = indexMessages(room.byId, list);
      const nextIds = new Set([...room.order, ...list.map((m) => normId(m.id ?? m.messageId))].filter(Boolean));
      const order = sortAscByCreated(Array.from(nextIds), byId);
      const nextRoom = { ...room, byId, order, cursor: nextCursor ?? room.cursor };
      return { byRoom: { ...s.byRoom, [rid]: nextRoom } };
    });
  },

  // ─────────── TICKET-SCOPED (NEW canonical) ───────────
  hydrateTicket({ roomId, ticketId }, list, cursor) {
    const tid = normId(ticketId);
    set((s) => {
      const thread = ensureThread({ ...s }, tid);
      const byId = indexMessages({}, list);
      const order = sortAscByCreated(Object.keys(byId), byId);
      const nextThread = { ...thread, byId, order, cursor, hydrated: true };
      return { byThread: { ...s.byThread, [tid]: nextThread } };
    });
  },

  appendTicket({ roomId, ticketId }, list, nextCursor) {
    const tid = normId(ticketId);
    if (!Array.isArray(list) || list.length === 0 || !tid) return;
    set((s) => {
      const thread = ensureThread({ ...s }, tid);
      const byId = indexMessages(thread.byId, list);
      const nextIds = new Set([...thread.order, ...list.map((m) => normId(m.id ?? m.messageId))].filter(Boolean));
      const order = sortAscByCreated(Array.from(nextIds), byId);
      const nextThread = { ...thread, byId, order, cursor: nextCursor ?? thread.cursor };
      return { byThread: { ...s.byThread, [tid]: nextThread } };
    });
  },

  applyReceiptTicket({ roomId, ticketId }, msgId, receipt) {
    const tid = normId(ticketId);
    const mid = normId(msgId);
    if (!tid || !mid || !receipt) return;
    set((s) => {
      const thread = s.byThread[tid];
      if (!thread) return s;
      const prev = thread.byId[mid];
      if (!prev) return s;
      const patch = receiptToPatch(prev, receipt);
      if (!patch) return s;
      const nextMsg = mergeMessage(prev, { id: mid, ...patch });
      const nextThread = { ...thread, byId: { ...thread.byId, [mid]: nextMsg } };
      return { byThread: { ...s.byThread, [tid]: nextThread } };
    });
  },

  applyReceiptsTicket({ roomId, ticketId }, receipts) {
    const tid = normId(ticketId);
    if (!tid || !Array.isArray(receipts) || receipts.length === 0) return;
    set((s) => {
      const thread = s.byThread[tid];
      if (!thread) return s;

      let changed = false;
      const byId = { ...thread.byId };

      for (const r of receipts) {
        const mid = normId(r.messageId ?? r.id);
        if (!mid || !byId[mid]) continue;
        const patch = receiptToPatch(byId[mid], r);
        if (!patch) continue;
        byId[mid] = mergeMessage(byId[mid], { id: mid, ...patch });
        changed = true;
      }

      if (!changed) return s;
      const nextThread = { ...thread, byId };
      return { byThread: { ...s.byThread, [tid]: nextThread } };
    });
  },

  // Pending queue remains room-scoped (composer sends under room; tickets piggyback via ticketId)
  enqueuePending(roomId, draft) {
    const rid = normId(roomId);
    const tempId = normId(draft?.tempId) || makeTempId();
    set((s) => {
      const room = ensureRoom({ ...s }, rid);
      const nextRoom = { ...room, pendingByTemp: { ...room.pendingByTemp }, pendingOrder: [...room.pendingOrder] };
      upsertPending(nextRoom, tempId, { ...draft, roomId: rid });
      return { byRoom: { ...s.byRoom, [rid]: nextRoom } };
    });
    return tempId;
  },

  confirmPending(roomId, tempId, finalId, patch = {}) {
    const rid = normId(roomId);
    const tid = normId(tempId);
    const fid = normId(finalId);
    if (!rid || !tid || !fid) return;
    set((s) => {
      const room = s.byRoom[rid];
      if (!room) return s;
      const pending = room.pendingByTemp[tid];
      if (!pending) return s;

      const nextPendingByTemp = { ...room.pendingByTemp };
      delete nextPendingByTemp[tid];
      const nextPendingOrder = room.pendingOrder.filter((id) => id !== tid);

      const confirmed = mergeMessage(
        normalizeMessage({ ...pending, id: fid, status: "sent", sentAt: new Date().toISOString() }),
        normalizeMessage({ id: fid, ...patch })
      );
      const byId = { ...room.byId, [fid]: confirmed };
      const order = sortAscByCreated([...room.order, fid], byId);

      const nextRoom = {
        ...room,
        byId,
        order,
        pendingByTemp: nextPendingByTemp,
        pendingOrder: nextPendingOrder,
      };
      return { byRoom: { ...s.byRoom, [rid]: nextRoom } };
    });
  },

  failPending(roomId, tempId, error) {
    const rid = normId(roomId);
    const tid = normId(tempId);
    set((s) => {
      const room = s.byRoom[rid];
      if (!room || !room.pendingByTemp[tid]) return s;
      const failed = { ...room.pendingByTemp[tid], status: "failed", meta: { ...(room.pendingByTemp[tid].meta || {}), error: error ?? true } };
      const nextPendingByTemp = { ...room.pendingByTemp, [tid]: failed };
      const nextRoom = { ...room, pendingByTemp: nextPendingByTemp };
      return { byRoom: { ...s.byRoom, [rid]: nextRoom } };
    });
  },

  setTransportStatus(status) {
    const st = status || "unknown";
    set((s) => (s.transportStatus === st ? s : { transportStatus: st }));
  },

  // Convenience getters
  getMessages(roomId) {
    const rid = normId(roomId);
    const s = get();
    const room = s.byRoom[rid] || initialRoom();
    return room.order.map((id) => room.byId[id]).filter(Boolean);
  },
  getMessagesByTicket(ticketId) {
    const tid = normId(ticketId);
    const s = get();
    const thread = s.byThread[tid] || initialThread();
    return thread.order.map((id) => thread.byId[id]).filter(Boolean);
  },
  getPending(roomId) {
    const rid = normId(roomId);
    const s = get();
    const room = s.byRoom[rid] || initialRoom();
    return room.pendingOrder.map((id) => room.pendingByTemp[id]).filter(Boolean);
  },
}));

// ------------------------------ Selectors -----------------------------------

// Flexible selector: accept roomId (legacy) OR { roomId, ticketId } (new)
export const makeSelectMessages = (arg) => (s) => {
  if (arg && typeof arg === "object") {
    const tid = normId(arg.ticketId);
    if (tid) {
      const thread = s.byThread[tid];
      if (!thread) return [];
      return thread.order.map((id) => thread.byId[id]).filter(Boolean);
    }
    const rid = normId(arg.roomId);
    const room = s.byRoom[rid];
    if (!room) return [];
    return room.order.map((id) => room.byId[id]).filter(Boolean);
  }
  // legacy string
  const rid = normId(arg);
  const room = s.byRoom[rid];
  if (!room) return [];
  return room.order.map((id) => room.byId[id]).filter(Boolean);
};

export const makeSelectCursor = (arg) => (s) => {
  if (arg && typeof arg === "object") {
    const tid = normId(arg.ticketId);
    if (tid) return s.byThread[tid]?.cursor;
    const rid = normId(arg.roomId);
    return s.byRoom[rid]?.cursor;
  }
  const rid = normId(arg);
  return s.byRoom[rid]?.cursor;
};

export const selectChatTransportStatus = (s) => s.transportStatus;

export const makeSelectMessagesUI = (arg) => (s) => {
  const base = makeSelectMessages(arg)(s);
  return toUiMessages(base);
};

// ------------------------------ Utilities -----------------------------------

function receiptToPatch(prevMsg, r) {
  const type = String(r?.type || "").toLowerCase();
  const at = r?.at ?? new Date().toISOString();

  if (type === "read") {
    return { readAt: pickLatest(prevMsg.readAt, at), status: "read" };
  }
  if (type === "delivered") {
    const status = prevMsg.readAt ? prevMsg.status : "delivered";
    return { deliveredAt: pickLatest(prevMsg.deliveredAt, at), status };
  }
  if (type === "sent") {
    const status = prevMsg.readAt || prevMsg.deliveredAt ? prevMsg.status : "sent";
    return { sentAt: pickLatest(prevMsg.sentAt, at), status };
  }
  if (type === "failed") {
    return { status: "failed" };
  }
  return null;
}

function pickLatest(a, b) {
  if (!a) return b ?? undefined;
  if (!b) return a ?? undefined;
  return a > b ? a : b;
}

function makeTempId() {
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
