// /src/TeamInbox/store/useRoomsStore.js
// Use: Central rooms slice — divisions, metadata, unread counters, selection, presence, and per-user scoping.
// Notes:
// - Presence here is ECHO-ONLY. Do NOT set it from UI. It should be mirrored from user.store
//   when the server emits presence.update.
// - Default presence is PENDING (null + pending:true) so UI shows the ring at boot.

import { create } from "zustand";
import { DIVISIONS, normalizeDivision } from "../constants/DIVISIONS.js";

/**
 * @typedef {"available"|"busy"|"away"|"offline"|null} Av
 */

/**
 * @typedef {Object} RoomsState
 * @property {Record<string, any>} byId
 * @property {string[]} allIds
 * @property {string|null} activeRoomId
 * @property {Record<string, Array<any>>} presenceByRoom
 * @property {"connecting"|"open"|"closed"|"error"|"unknown"} transportStatus
 * @property {string} userScopeKey
 * @property {Av} myAvailability               // confirmed (server-echoed) value
 * @property {boolean} myAvailabilityPending   // true while waiting for server echo
 */

/**
 * @typedef {Object} RoomsActions
 * @property {(rooms: any[]) => void} setRooms
 * @property {(room: any) => void} upsert
 * @property {(id: string) => void} remove
 * @property {(ids: string[]) => void} bulkRemove
 * @property {(roomId: string, mode: { delta?: number, absolute?: number }) => void} updateUnread
 * @property {(roomId: string|null) => void} setActiveRoom
 * @property {(roomId: string, presenceList: any[]) => void} setPresence
 * @property {(status: RoomsState["transportStatus"]) => void} setTransportStatus
 * @property {() => number} getUnreadTotal
 * @property {() => void} clear
 * @property {(key: string) => void} setUserScopeKey
 *
 * // Presence (echo-only; called by user.store on server updates):
 * @property {(next: Av) => void} setMyAvailability
 * @property {(pending: boolean) => void} setMyAvailabilityPending
 */

const initial = /** @type {RoomsState} */ ({
  byId: Object.create(null),
  allIds: [],
  activeRoomId: null,
  presenceByRoom: Object.create(null),

  transportStatus: "unknown",
  userScopeKey: "",

  // Presence: start as "pending"
  myAvailability: /** @type {Av} */ (null),
  myAvailabilityPending: true,
});

// ------------------------------ Helpers -------------------------------------

function defaultSortRooms(a, b, byId) {
  const ra = byId[a], rb = byId[b];
  if (ra?.pinned && !rb?.pinned) return -1;
  if (!ra?.pinned && rb?.pinned) return 1;
  const ta = ra?.updatedAt || "", tb = rb?.updatedAt || "";
  if (ta !== tb) return tb > ta ? 1 : -1;
  const na = (ra?.title || "").toLowerCase();
  const nb = (rb?.title || "").toLowerCase();
  return na.localeCompare(nb);
}

function summarizePresence(list = []) {
  let online = 0, typing = 0;
  for (const p of list) {
    if (p?.typing) typing++;
    if (p?.state === "online") online++;
  }
  return { online, typing };
}

function normalizeRoom(r = {}) {
  return {
    id: r.id != null ? String(r.id) : "",
    division: normalizeDivision(r.division) || DIVISIONS.BUSINESS,
    title: String(r.title ?? "Untitled"),
    participants: Array.isArray(r.participants)
      ? r.participants
      : Array.isArray(r.roommates)   // ← fallback during rollout
      ? r.roommates
      : [],
    unreadCount: Number.isFinite(r.unreadCount) ? r.unreadCount : 0,
    pinned: !!r.pinned,
    archived: !!r.archived,
    muted: !!r.muted,
    lastMessagePreview: r.lastMessagePreview
      ? {
          text: String(r.lastMessagePreview.text ?? ""),
          at: r.lastMessagePreview.at ?? null,
          from: r.lastMessagePreview.from ?? null,
        }
      : undefined,
    createdAt: r.createdAt ?? new Date().toISOString(),
    updatedAt: r.updatedAt ?? r.createdAt ?? new Date().toISOString(),
    meta: r.meta ?? {},
  };
}

function latest(a, b) {
  if (!a) return b ?? undefined;
  if (!b) return a ?? undefined;
  return a > b ? a : b;
}

function earlier(a, b) {
  if (!a) return b ?? undefined;
  if (!b) return a ?? undefined;
  return a < b ? a : b;
}

/**
 * Merge two normalized room objects, preserving existing flags unless the incoming
 * explicitly provides them; take latest updatedAt, earliest createdAt, and shallow-merge meta.
 * Also choose the most recent lastMessagePreview by timestamp.
 */
function mergeRoom(prev = {}, next = {}) {
  const pinned =
    typeof next.pinned === "boolean" ? next.pinned : !!prev.pinned;
  const muted =
    typeof next.muted === "boolean" ? next.muted : !!prev.muted;
  const archived =
    typeof next.archived === "boolean" ? next.archived : !!prev.archived;

  const createdAt = earlier(prev.createdAt, next.createdAt);
  const updatedAt = latest(prev.updatedAt, next.updatedAt);

  const meta = { ...(prev.meta || {}), ...(next.meta || {}) };

  let lastMessagePreview = prev.lastMessagePreview || next.lastMessagePreview || undefined;
  if (prev.lastMessagePreview && next.lastMessagePreview) {
    const pa = prev.lastMessagePreview.at || "";
    const na = next.lastMessagePreview.at || "";
    lastMessagePreview = na && na > pa ? next.lastMessagePreview : prev.lastMessagePreview;
  }

  return {
    ...prev,
    ...next,
    pinned,
    muted,
    archived,
    createdAt,
    updatedAt,
    meta,
    lastMessagePreview,
    // unreadCount: prefer explicit incoming number; else keep previous
    unreadCount:
      Number.isFinite(next.unreadCount) ? next.unreadCount :
      Number.isFinite(prev.unreadCount) ? prev.unreadCount : 0,
    // participants: prefer explicit incoming (canonical); else keep previous; else legacy fallback
    participants: Array.isArray(next.participants)
      ? next.participants
      : Array.isArray(prev.participants)
      ? prev.participants
      : (Array.isArray(next.roommates) ? next.roommates : []),
  };
}

const ALLOWED = new Set(["available", "busy", "away", "offline"]);

// ------------------------------- Store --------------------------------------

export const useRoomsStore = create((set, get) => (/** @type {RoomsState & RoomsActions} */({
  ...initial,

  clear() {
    set((s) => ({
      ...s,
      byId: Object.create(null),
      allIds: [],
      activeRoomId: null,
      presenceByRoom: Object.create(null),

      // reset presence to pending
      myAvailability: null,
      myAvailabilityPending: true,
    }));
  },

  setUserScopeKey(key) {
    const k = String(key || "");
    set((s) => (
      s.userScopeKey === k
        ? s
        : {
            userScopeKey: k,
            // on identity/tenant switch → pending until hydrated (via echo)
            myAvailability: null,
            myAvailabilityPending: true,
          }
    ));
  },

  // ECHO from server (mirrored by user.store). Only path that flips the dot.
  setMyAvailability(next) {
    const v = next ? String(next).toLowerCase() : null;
    const val = /** @type {Av} */ (v && ALLOWED.has(v) ? v : null);
    set(() => ({
      myAvailability: val,
      myAvailabilityPending: false,
    }));
  },

  // Allow navbar/user.store to toggle the ring while awaiting echo (no dot flip here).
  setMyAvailabilityPending(pending) {
    const flag = !!pending;
    set((s) => (s.myAvailabilityPending === flag ? s : { myAvailabilityPending: flag }));
  },

  /**
   * Merge a fresh list into existing state, preserving pinned/muted where not explicitly provided,
   * and computing updatedAt/createdAt/meta correctly. Re-sorts after merge.
   */
  setRooms(rooms) {
    const incoming = Array.isArray(rooms) ? rooms : [];
    set((s) => {
      const nextById = { ...s.byId };
      for (const r of incoming) {
        if (!r?.id) continue;
        const id = String(r.id);
        const normalized = normalizeRoom(r);
        nextById[id] = mergeRoom(nextById[id] || {}, normalized);
      }
      // Build allIds from union of previous and incoming ids to avoid dropping rooms unintentionally
      const allIds = Array.from(new Set([...Object.keys(nextById)]));
      allIds.sort((a, b) => defaultSortRooms(a, b, nextById));
      return { byId: nextById, allIds };
    });
  },

  /**
   * Upsert a single room with merge semantics consistent with setRooms.
   */
  upsert(room) {
    if (!room?.id) return;
    const id = String(room.id);
    set((s) => {
      const normalized = normalizeRoom(room);
      const merged = mergeRoom(s.byId[id] || {}, normalized);
      const nextById = { ...s.byId, [id]: merged };
      let nextIds = s.allIds;
      if (!s.byId[id]) nextIds = [...s.allIds, id];
      nextIds = [...new Set(nextIds)];
      nextIds.sort((a, b) => defaultSortRooms(a, b, nextById));
      return { byId: nextById, allIds: nextIds };
    });
  },

  /**
   * Remove a single room by id, cleaning presence and active selection.
   */
  remove(id) {
    if (!id) return;
    const rid = String(id);
    set((s) => {
      if (!s.byId[rid]) return s;
      const byId = { ...s.byId };
      delete byId[rid];

      const presenceByRoom = { ...s.presenceByRoom };
      delete presenceByRoom[rid];

      const allIds = s.allIds.filter((x) => x !== rid);
      const activeRoomId = s.activeRoomId === rid ? null : s.activeRoomId;

      return { byId, allIds, presenceByRoom, activeRoomId };
    });
  },

  /**
   * Remove multiple rooms at once.
   */
  bulkRemove(ids) {
    const list = Array.isArray(ids) ? ids.map(String) : [];
    if (!list.length) return;
    set((s) => {
      let byIdChanged = false;
      const byId = { ...s.byId };
      const presenceByRoom = { ...s.presenceByRoom };

      for (const rid of list) {
        if (byId[rid]) { delete byId[rid]; byIdChanged = true; }
        if (presenceByRoom[rid]) delete presenceByRoom[rid];
      }
      if (!byIdChanged) return s;

      const removeSet = new Set(list);
      const allIds = s.allIds.filter((x) => !removeSet.has(x));
      const activeRoomId = removeSet.has(s.activeRoomId) ? null : s.activeRoomId;

      return { byId, allIds, presenceByRoom, activeRoomId };
    });
  },

  updateUnread(roomId, mode) {
    if (!roomId || !mode) return;
    const id = String(roomId);
    set((s) => {
      const cur = s.byId[id];
      if (!cur) return s;
      let nextUnread = cur.unreadCount | 0;
      if (typeof mode.absolute === "number") nextUnread = Math.max(0, mode.absolute | 0);
      if (typeof mode.delta === "number") nextUnread = Math.max(0, nextUnread + (mode.delta | 0));
      if (nextUnread === cur.unreadCount) return s;

      const updatedAt = latest(cur.updatedAt, cur.updatedAt); // unchanged here; keep as-is
      const merged = { ...cur, unreadCount: nextUnread, updatedAt };
      return { byId: { ...s.byId, [id]: merged } };
    });
  },

  setActiveRoom(roomId) {
    const id = roomId ? String(roomId) : null;
    set((s) => (s.activeRoomId === id ? s : { activeRoomId: id }));
  },

  setPresence(roomId, presenceList) {
    if (!roomId) return;
    const id = String(roomId);
    const list = Array.isArray(presenceList) ? presenceList : [];
    set((s) => {
      const prev = s.presenceByRoom[id];
      if (prev && prev.length === list.length) {
        let same = true;
        for (let i = 0; i < list.length; i++) {
          const a = prev[i], b = list[i];
          if (
            a?.userId !== b?.userId ||
            a?.state !== b?.state ||
            !!a?.typing !== !!b?.typing ||
            (a?.lastSeenAt || "") !== (b?.lastSeenAt || "")
          ) { same = false; break; }
        }
        if (same) return s;
      }
      return { presenceByRoom: { ...s.presenceByRoom, [id]: list } };
    });
  },

  setTransportStatus(status) {
    const st = status || "unknown";
    set((s) => (s.transportStatus === st ? s : { transportStatus: st }));
  },

  getUnreadTotal() {
    const s = get();
    let sum = 0;
    for (const id of s.allIds) {
      const r = s.byId[id];
      sum += (r?.unreadCount | 0);
    }
    return sum;
  },
})));

// ------------------------------ Selectors -----------------------------------

export const selectRoomsAll = (s) => s.allIds.map((id) => s.byId[id]).filter(Boolean);

export const makeSelectRoomsByDivision = (division) => (s) => {
  const key = normalizeDivision(division);
  return s.allIds.map((id) => s.byId[id]).filter((r) => r?.division === key);
};

export const selectActiveRoomId = (s) => s.activeRoomId;
export const selectActiveRoom = (s) => (s.activeRoomId ? s.byId[s.activeRoomId] : null);

export const makeSelectPresenceSummary = (roomId) => (s) =>
  summarizePresence(s.presenceByRoom[roomId] || []);

export const selectTransportStatus = (s) => s.transportStatus;
export const selectUserScopeKey = (s) => s.userScopeKey;

// Presence (echo-only)
export const selectMyAvailability = (s) => s.myAvailability;           // confirmed (may be null)
export const selectMyAvailabilityPending = (s) => !!s.myAvailabilityPending;
