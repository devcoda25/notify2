// src/TeamInbox/hooks/useTickets.js
// Tickets list hook — room-scoped VIEW on top of multi-room cache.
// - Watches activeRoomId from useRoomsStore.
// - Uses store.byRoomId[roomId] to decide whether to call REST or just restore from cache.

import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import {
  useRoomsStore,
  selectActiveRoomId,
} from "../store/useRoomsStore.js";

import {
  useTicketsStore,
  selectTicketsList,
} from "../store/useTicketsStore.js";

import { apiService as api } from "../services/api.service.js";
import { UX } from "../constants/UX.js";

const DEFAULT_LIMIT = 25;

/* ---------------- Error helper ---------------- */

function toFriendlyError(err) {
  if (!err) return "Couldn’t load tickets.";
  if (err.name === "AbortError") return null; // silent

  const status = err.status || 0;
  const bodyMsg =
    (typeof err.body === "object" &&
      err.body &&
      (err.body.message || err.body.error)) ||
    (typeof err.body === "string" ? err.body : null);

  if (status === 401) return bodyMsg || "You’re not signed in.";
  if (status === 403) return bodyMsg || "Access denied.";
  if (status === 404) return bodyMsg || "Tickets endpoint not found.";
  if (status >= 500) return bodyMsg || "Server error while loading tickets.";
  return bodyMsg || err.message || "Couldn’t load tickets.";
}

/* ---------------- Main hook ---------------- */

export function useTickets() {
  const activeRoomId = useRoomsStore(selectActiveRoomId);

  // Local UI status (mirrors store state but stays local to hook consumer)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tickets store selectors (VIEW for active room)
  const items = useTicketsStore(selectTicketsList);
  const cursor = useTicketsStore((s) => s.cursor);
  const total = useTicketsStore((s) => s.total);
  const searchText = useTicketsStore((s) => s.searchQuery ?? "");

  // Tickets store actions
  const setSearchInStore = useTicketsStore((s) => s.setSearch);
  const setStoreLoading = useTicketsStore((s) => s.setLoading);
  const setStoreError = useTicketsStore((s) => s.setError);
  const hydrateRoom = useTicketsStore((s) => s.hydrateRoom);
  const appendRoomPage = useTicketsStore((s) => s.appendRoomPage);
  const setActiveRoomInStore = useTicketsStore((s) => s.setActiveRoom);
  const markRoomStatus = useTicketsStore((s) => s.markRoomStatus);

  // If your real store has setActiveTicket, you can keep this;
  // here we just read it defensively.
  const setActiveTicket = useTicketsStore((s) => s.setActiveTicket);

  // In-flight tracking
  const abortRef = useRef(null);
  const inflightKeyRef = useRef(0);
  const lastQueryRef = useRef({
    roomId: null,
    search: "",
    cursor: null,
    limit: DEFAULT_LIMIT,
    reason: "bootstrap",
  });

  const cancelInFlight = useCallback(() => {
    try {
      abortRef.current?.abort?.();
    } catch {}
    abortRef.current = null;
    inflightKeyRef.current += 1;
  }, []);

  /* ---------------- Core fetcher (room-scoped only) ---------------- */

  const fetchPage = useCallback(
    async ({ roomId, search, cursor, limit, reason }) => {
      // Guard: we NEVER hit backend without a room
      if (!roomId) {
        return { items: [], cursor: null, total: 0 };
      }

      const rid = String(roomId);

      setIsLoading(true);
      setError(null);
      setStoreLoading?.(true);
      setStoreError?.(null);
      markRoomStatus?.(rid, "loading");
      cancelInFlight();

      const controller = new AbortController();
      abortRef.current = controller;
      const runKey = ++inflightKeyRef.current;

      const params = {
        roomId: rid,
        search: search || "",
        cursor: cursor ?? null,
        limit: limit ?? DEFAULT_LIMIT,
        reason,
      };
      lastQueryRef.current = params;

      try {
        const page = await api.fetchTicketsPage({
          roomId: params.roomId,
          search: params.search,
          cursor: params.cursor,
          limit: params.limit,
          signal: controller.signal,
        });

        if (runKey !== inflightKeyRef.current) {
          return null; // superseded by a newer call
        }

        setStoreError?.(null);
        const safePage = page || { items: [], cursor: null, total: 0 };
        return safePage;
      } catch (e) {
        const msg = toFriendlyError(e);
        if (msg) {
          setError(msg);
          setStoreError?.(msg);
        }
        markRoomStatus?.(rid, "error");
        return { items: [], cursor: null, total: 0 };
      } finally {
        setIsLoading(false);
        setStoreLoading?.(false);
      }
    },
    [cancelInFlight, markRoomStatus, setStoreError, setStoreLoading]
  );

  /* ---------------- Bootstrap on mount / room change ---------------- */

  useEffect(() => {
    let alive = true;

    const rid = activeRoomId ? String(activeRoomId) : null;

    // Update VIEW to point at this room (will restore cache if present)
    setActiveRoomInStore?.(rid);

    if (!rid) {
      cancelInFlight();
      return () => {
        alive = false;
        cancelInFlight();
      };
    }

    const state = useTicketsStore.getState();
    const bucket = state.byRoomId?.[rid];

    // If we already have a loaded cache for this room, do NOT refetch.
    if (bucket && bucket.status === "loaded") {
      // setActiveRoomInStore already applied the snapshot as VIEW.
      return () => {
        alive = false;
        cancelInFlight();
      };
    }

    (async () => {
      const page = await fetchPage({
        roomId: rid,
        search: state.searchQuery || "",
        cursor: null,
        limit: DEFAULT_LIMIT,
        reason: "bootstrap",
      });

      if (!alive || !page) return;

      hydrateRoom?.(rid, page.items || [], page.cursor ?? null, page.total ?? 0);

      // pick first ticket as active (if available)
      if (page.items && page.items[0] && setActiveTicket) {
        try {
          setActiveTicket(page.items[0].id ?? null);
        } catch {}
      }
    })();

    return () => {
      alive = false;
      cancelInFlight();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoomId]);

  /* ---------------- Debounced search (room-scoped) ---------------- */

  useEffect(() => {
    const rid = activeRoomId ? String(activeRoomId) : null;
    if (!rid) return;

    const timer = setTimeout(async () => {
      const currentSearch = useTicketsStore.getState().searchQuery || "";

      const page = await fetchPage({
        roomId: rid,
        search: currentSearch,
        cursor: null,
        limit: DEFAULT_LIMIT,
        reason: "search",
      });

      if (!page) return;

      hydrateRoom?.(rid, page.items || [], page.cursor ?? null, page.total ?? 0);

      if (page.items && page.items[0] && setActiveTicket) {
        try {
          setActiveTicket(page.items[0].id ?? null);
        } catch {}
      }
    }, UX.SEARCH_DEBOUNCE_MS || 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, activeRoomId, fetchPage, hydrateRoom]);

  /* ---------------- Public helpers ---------------- */

  const setSearchText = useCallback(
    (text) => {
      setSearchInStore?.(text ?? "");
    },
    [setSearchInStore]
  );

  const loadMore = useCallback(async () => {
    const rid = activeRoomId ? String(activeRoomId) : null;
    if (!rid) return;
    if (!cursor || isLoading) return;

    const currentSearch = useTicketsStore.getState().searchQuery || "";

    const page = await fetchPage({
      roomId: rid,
      search: currentSearch,
      cursor,
      limit: DEFAULT_LIMIT,
      reason: "loadMore",
    });

    if (!page) return;

    appendRoomPage?.(rid, page.items || [], page.cursor ?? null, page.total ?? 0);
  }, [activeRoomId, appendRoomPage, cursor, fetchPage, isLoading]);

  const refresh = useCallback(async () => {
    const rid = activeRoomId ? String(activeRoomId) : null;
    if (!rid) return null;

    const currentSearch = useTicketsStore.getState().searchQuery || "";

    const page = await fetchPage({
      roomId: rid,
      search: currentSearch,
      cursor: null,
      limit: DEFAULT_LIMIT,
      reason: "refresh",
    });

    if (!page) return null;

    hydrateRoom?.(rid, page.items || [], page.cursor ?? null, page.total ?? 0);

    if (page.items && page.items[0] && setActiveTicket) {
      try {
        setActiveTicket(page.items[0].id ?? null);
      } catch {}
    }

    return page;
  }, [activeRoomId, fetchPage, hydrateRoom, setActiveTicket]);

  const retryLast = useCallback(async () => {
    const params = lastQueryRef.current;
    const rid = params.roomId || (activeRoomId ? String(activeRoomId) : null);
    if (!rid) {
      return refresh();
    }

    const page = await fetchPage({
      ...params,
      roomId: rid,
      reason: "retry",
    });

    if (!page) return null;

    hydrateRoom?.(rid, page.items || [], page.cursor ?? null, page.total ?? 0);

    if (page.items && page.items[0] && setActiveTicket) {
      try {
        setActiveTicket(page.items[0].id ?? null);
      } catch {}
    }

    return page;
  }, [activeRoomId, fetchPage, hydrateRoom, refresh, setActiveTicket]);

  const isEmpty =
    !isLoading && (!Array.isArray(items) || items.length === 0);

  return {
    items,
    isEmpty,
    isLoading,
    error,
    searchText,
    setSearchText,
    loadMore,
    cursor,
    total,
    refresh,
    retryLast,
  };
}

export default useTickets;
