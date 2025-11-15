// /src/TeamInbox/store/useTicketsStore.js
// Use: Central tickets slice — now multi-room aware with per-room cache + LRU.
// - Top-level order/cursor/total/empty represent the CURRENT VIEW (active room).
// - byRoomId[roomId] keeps cached lists for up to MAX_ROOMS rooms.
// - No React/services imports here: zustand only.

import { create } from "zustand";

const MAX_ROOMS = 20;

/**
 * @typedef {Object} RoomTicketsBucket
 * @property {string[]} order
 * @property {any} cursor
 * @property {number|null} total
 * @property {boolean} empty
 * @property {"idle"|"loading"|"loaded"|"error"} status
 * @property {string|null} lastLoadedAt
 */

/**
 * @typedef {Object} TicketsState
 * @property {Record<string, any>} byId            // ticketId -> ticket item
 * @property {string[]} order                      // ordered ids for CURRENT VIEW (active room)
 * @property {any} cursor                          // paging cursor for CURRENT VIEW
 * @property {number|null} total                   // total for CURRENT VIEW
 * @property {boolean} empty                       // derived flag for CURRENT VIEW
 * @property {string} searchQuery                  // local search text
 * @property {"idle"|"loading"|"error"} loadState  // UX loading state
 * @property {string|null} error                   // last error message (if any)
 *
 * @property {Record<string, RoomTicketsBucket>} byRoomId  // roomId -> cached tickets
 * @property {string[]} roomLRU                            // most recently used roomIds
 * @property {string|null} activeRoomId                    // current room in view
 */

/**
 * @typedef {Object} TicketsActions
 * @property {(roomId: string|null) => void} setActiveRoom
 * @property {(roomId: string, list: any[], cursor?: any, total?: number|null) => void} hydrateRoom
 * @property {(roomId: string, list: any[], cursor?: any, total?: number|null) => void} appendRoomPage
 * @property {(roomId: string, status: RoomTicketsBucket["status"]) => void} markRoomStatus
 * @property {(items: any[]) => void} upsert
 * @property {(id: string) => void} remove
 * @property {() => void} reset
 * @property {(q: string) => void} setSearch
 * @property {(loading: boolean) => void} setLoading
 * @property {(msg: string|null) => void} setError
 */

const initial = /** @type {TicketsState} */ ({
  byId: Object.create(null),

  // VIEW (active room)
  order: [],
  cursor: undefined,
  total: null,
  empty: false,

  // UX
  searchQuery: "",
  loadState: "idle",
  error: null,

  // Multi-room cache
  byRoomId: Object.create(null),
  roomLRU: [],
  activeRoomId: null,
});

// ------------------------------ Helpers -------------------------------------

/** Stable sort: updatedAt desc, then title asc. */
function sortTickets(order, byId) {
  return [...order].sort((a, b) => {
    const ta = byId[a]?.updatedAt || "";
    const tb = byId[b]?.updatedAt || "";
    if (ta !== tb) return tb > ta ? 1 : -1;
    const na = (byId[a]?.title || "").toLowerCase();
    const nb = (byId[b]?.title || "").toLowerCase();
    return na.localeCompare(nb);
  });
}

function normalizeItem(x = {}) {
  return {
    id: String(x.id ?? ""),
    roomId: x.roomId != null ? String(x.roomId) : "",
    title: String(x.title ?? "Untitled"),
    subtitle: String(x.subtitle ?? ""),
    unreadCount: Number.isFinite(x.unreadCount) ? x.unreadCount : 0,
    updatedAt: x.updatedAt ?? x.createdAt ?? new Date().toISOString(),
    status: x.status ?? undefined,
    subStatus: x.subStatus ?? undefined,
    channel: x.channel ? String(x.channel).toLowerCase() : undefined,
  };
}

function indexById(list = [], prevById) {
  const next = { ...(prevById || {}) };
  for (const raw of list) {
    const it = normalizeItem(raw);
    if (!it.id) continue;
    next[it.id] = { ...(next[it.id] || {}), ...it };
  }
  return next;
}

function dedupeOrder(nextIds = []) {
  const seen = new Set();
  const out = [];
  for (const id of nextIds) {
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

function touchLRU(roomLRU, roomId) {
  const id = String(roomId);
  const out = [id];
  for (const r of roomLRU) {
    if (r !== id) out.push(r);
  }
  return out.slice(0, MAX_ROOMS + 5); // small buffer; we’ll evict properly
}

function evictIfNeeded(state) {
  const { roomLRU, byRoomId, byId } = state;
  if (!roomLRU || roomLRU.length <= MAX_ROOMS) return state;

  const keepCount = MAX_ROOMS;
  const keepRooms = roomLRU.slice(0, keepCount);
  const evictRooms = roomLRU.slice(keepCount);

  if (!evictRooms.length) return state;

  const nextByRoomId = { ...byRoomId };
  const nextById = { ...byId };

  for (const rid of evictRooms) {
    const bucket = nextByRoomId[rid];
    if (bucket && Array.isArray(bucket.order)) {
      for (const tid of bucket.order) {
        // Tickets are room-scoped; safe to delete them.
        delete nextById[tid];
      }
    }
    delete nextByRoomId[rid];
  }

  return {
    ...state,
    byRoomId: nextByRoomId,
    byId: nextById,
    roomLRU: keepRooms,
  };
}

// Apply a room bucket as the current view (order/cursor/total/empty)
function applyBucketToView(state, roomId) {
  const rid = roomId ? String(roomId) : null;
  if (!rid) {
    return {
      ...state,
      activeRoomId: null,
      order: [],
      cursor: null,
      total: null,
      empty: false,
    };
  }
  const bucket = state.byRoomId[rid];
  if (!bucket) {
    return {
      ...state,
      activeRoomId: rid,
      order: [],
      cursor: null,
      total: null,
      empty: false,
    };
  }
  return {
    ...state,
    activeRoomId: rid,
    order: bucket.order || [],
    cursor: bucket.cursor ?? null,
    total: bucket.total ?? null,
    empty: !!bucket.empty,
  };
}

// ------------------------------- Store --------------------------------------

export const useTicketsStore = create((set, get) => (/** @type {TicketsState & TicketsActions} */({
  ...initial,

  /* -------- Multi-room awareness -------- */

  setActiveRoom(roomId) {
    const rid = roomId ? String(roomId) : null;
    set((s) => applyBucketToView(s, rid));
  },

  markRoomStatus(roomId, status) {
    if (!roomId) return;
    const rid = String(roomId);
    set((s) => {
      const bucket = s.byRoomId[rid] || {
        order: [],
        cursor: null,
        total: null,
        empty: false,
        status: "idle",
        lastLoadedAt: null,
      };
      const byRoomId = { ...s.byRoomId, [rid]: { ...bucket, status } };
      return { ...s, byRoomId };
    });
  },

  /**
   * Hydrate a room with a fresh page (initial load / refresh / search).
   * Updates:
   *  - global byId
   *  - byRoomId[roomId] bucket
   *  - roomLRU (MRU at front)
   *  - VIEW if this room is active
   */
  hydrateRoom(roomId, list, cursor, total = null) {
    if (!roomId) return;
    const rid = String(roomId);
    const items = Array.isArray(list) ? list : [];

    set((s) => {
      const byId = indexById(items, s.byId);
      let order = items.map((x) => String(x.id ?? "")).filter(Boolean);
      order = sortTickets(dedupeOrder(order), byId);

      const bucket = {
        order,
        cursor,
        total: total ?? (Number.isFinite(total) ? total : null),
        empty: order.length === 0,
        status: "loaded",
        lastLoadedAt: new Date().toISOString(),
      };

      let next = {
        ...s,
        byId,
        byRoomId: { ...s.byRoomId, [rid]: bucket },
        roomLRU: touchLRU(s.roomLRU || [], rid),
        loadState: "idle",
        error: null,
      };

      // Apply to view if this room is active (or if there is no active room yet)
      if (!s.activeRoomId || s.activeRoomId === rid) {
        next = {
          ...next,
          ...applyBucketToView(next, rid),
        };
      }

      return evictIfNeeded(next);
    });
  },

  /**
   * Append a page for a given room.
   */
  appendRoomPage(roomId, list, cursor, total = null) {
    if (!roomId) return;
    const rid = String(roomId);
    const items = Array.isArray(list) ? list : [];

    if (!items.length) {
      set((s) => {
        const bucket = s.byRoomId[rid];
        if (!bucket) return s;
        const updatedBucket = {
          ...bucket,
          cursor,
          total: total ?? bucket.total,
          empty: bucket.order.length === 0,
        };
        const byRoomId = { ...s.byRoomId, [rid]: updatedBucket };
        let next = { ...s, byRoomId, roomLRU: touchLRU(s.roomLRU || [], rid) };
        if (s.activeRoomId === rid) {
          next = { ...next, ...applyBucketToView(next, rid) };
        }
        return evictIfNeeded(next);
      });
      return;
    }

    set((s) => {
      const byId = indexById(items, s.byId);
      const incomingIds = items.map((x) => String(x.id ?? "")).filter(Boolean);

      const bucket = s.byRoomId[rid] || {
        order: [],
        cursor: null,
        total: null,
        empty: false,
        status: "idle",
        lastLoadedAt: null,
      };

      const mergedOrder = sortTickets(
        dedupeOrder([...bucket.order, ...incomingIds]),
        byId
      );

      const updatedBucket = {
        ...bucket,
        order: mergedOrder,
        cursor,
        total: total ?? bucket.total,
        empty: mergedOrder.length === 0,
        status: "loaded",
        lastLoadedAt: new Date().toISOString(),
      };

      const byRoomId = { ...s.byRoomId, [rid]: updatedBucket };
      let next = {
        ...s,
        byId,
        byRoomId,
        roomLRU: touchLRU(s.roomLRU || [], rid),
        loadState: "idle",
        error: null,
      };

      if (s.activeRoomId === rid) {
        next = { ...next, ...applyBucketToView(next, rid) };
      }

      return evictIfNeeded(next);
    });
  },

  /* -------- Existing shape-compatible actions -------- */

  /**
   * Legacy hydrate: treat as hydrating the current active room (if any),
   * otherwise as a global "no-room" scope.
   *
   * For new code, prefer hydrateRoom(roomId, ...).
   */
  hydrate(list, cursor, total = null) {
    const rid = get().activeRoomId;
    if (rid) {
      get().hydrateRoom(rid, list, cursor, total);
      return;
    }

    // Fallback: behave like old single-scope store
    const byId = indexById(Array.isArray(list) ? list : [], null);
    let order = Object.keys(byId);
    order = sortTickets(order, byId);
    set({
      byId,
      order,
      cursor,
      total: total ?? (Number.isFinite(total) ? total : null),
      empty: order.length === 0,
      loadState: "idle",
      error: null,
    });
  },

  /**
   * Legacy append: append into active room if any, or into view only.
   * New code should prefer appendRoomPage(roomId, ...).
   */
  append(list, cursor) {
    const rid = get().activeRoomId;
    if (rid) {
      get().appendRoomPage(rid, list, cursor);
      return;
    }
    if (!Array.isArray(list) || list.length === 0) {
      set((s) => ({ cursor, empty: s.order.length === 0, loadState: "idle" }));
      return;
    }
    set((s) => {
      const byId = indexById(list, s.byId);
      const appendedIds = list.map((x) => String(x?.id ?? ""));
      const order = sortTickets(dedupeOrder([...s.order, ...appendedIds]), byId);
      return {
        byId,
        order,
        cursor,
        empty: order.length === 0,
        loadState: "idle",
        error: null,
      };
    });
  },

  /**
   * Upsert live updates (e.g., from WS).
   * We just update byId and, if ids are in the active view bucket, re-sort.
   */
  upsert(items) {
    if (!Array.isArray(items) || items.length === 0) return;
    set((s) => {
      const byId = indexById(items, s.byId);
      const ids = items.map((x) => String(x?.id ?? "")).filter(Boolean);

      // If current view contains any of these ids, re-sort the view order
      let order = s.order;
      const intersection = ids.some((id) => order.includes(id));
      if (intersection) {
        order = sortTickets(order, byId);
      }

      return { ...s, byId, order, empty: order.length === 0 };
    });
  },

  /** Remove a single ticket by id (used by live ticket.deleted). */
  remove(id) {
    if (!id) return;
    const tid = String(id);
    set((s) => {
      if (!s.byId[tid]) return s;

      const byId = { ...s.byId };
      delete byId[tid];

      // Remove from all buckets
      const byRoomId = { ...s.byRoomId };
      for (const rid of Object.keys(byRoomId)) {
        const bucket = byRoomId[rid];
        const order = bucket.order.filter((x) => x !== tid);
        byRoomId[rid] = {
          ...bucket,
          order,
          empty: order.length === 0,
        };
      }

      // Remove from current view
      const order = s.order.filter((x) => x !== tid);

      return {
        ...s,
        byId,
        byRoomId,
        order,
        empty: order.length === 0,
      };
    });
  },

  /**
   * Reset VIEW + UX state. We do NOT drop cached rooms by default.
   * If you truly want to nuke cache, do it explicitly.
   */
  reset() {
    set((s) => ({
      ...s,
      order: [],
      cursor: null,
      total: null,
      empty: false,
      loadState: "idle",
      error: null,
      // search preserved as before:
      searchQuery: s.searchQuery,
    }));
  },

  setSearch(q) {
    const next = String(q ?? "");
    set((s) => (s.searchQuery === next ? s : { searchQuery: next }));
  },

  setLoading(loading) {
    set((s) => ({
      loadState: loading ? "loading" : "idle",
      error: loading ? null : s.error,
    }));
  },

  setError(msg) {
    set({
      loadState: msg ? "error" : "idle",
      error: msg ?? null,
    });
  },
})));

// ------------------------------ Selectors -----------------------------------

export const selectTicketsOrder = (s) => s.order;
export const selectTicketById = (id) => (s) => s.byId[id] || null;
export const selectTicketsList = (s) => s.order.map((id) => s.byId[id]).filter(Boolean);
export const selectTicketsCursor = (s) => s.cursor;
export const selectTicketsTotal = (s) => s.total;
export const selectTicketsEmpty = (s) => s.empty;
export const selectTicketsSearch = (s) => s.searchQuery;
export const selectTicketsLoadState = (s) => s.loadState;
export const selectTicketsError = (s) => s.error;
