// /src/TeamInbox/hooks/useRooms.js
// Use: Powers the Rooms sidebar. Groups rooms, exposes active selection,
//      WS subscribe/unsubscribe for the active room, initial fetch,
//      safe room removal after delete/leave, and tickets warmup.
// Works with: useRoomsStore, useWs, api.service, auth user store (selectors).

import { useMemo, useEffect, useRef, useCallback, useState } from "react";
import {
  useRoomsStore,
  selectTransportStatus,
  selectActiveRoomId,
  makeSelectRoomsByDivision,
  selectUserScopeKey as selectRoomsScopeKey,
} from "../store/useRoomsStore.js";
import { DIVISIONS } from "../constants/DIVISIONS.js";
import useWs from "./useWs.js";

// user store + selectors (party-first)
import { useUserStore } from "../../../auth/user.store.js";
import { isUserReady, getUserScopeKey } from "../../../auth/selectors.js";

// REST api
import { apiService as api } from "../services/api.service.js";

export function useRooms() {
  const { status: wsStatusRaw, subscribe, unsubscribe } = useWs();
  const activeRoomId = useRoomsStore(selectActiveRoomId);

  const selectInsider  = useMemo(() => makeSelectRoomsByDivision(DIVISIONS.INSIDER), []);
  const selectPersonal = useMemo(() => makeSelectRoomsByDivision(DIVISIONS.PERSONAL), []);
  const selectBusiness = useMemo(() => makeSelectRoomsByDivision(DIVISIONS.BUSINESS), []);

  const insiderRooms  = useRoomsStore(selectInsider);
  const personalRooms = useRoomsStore(selectPersonal);
  const businessRooms = useRoomsStore(selectBusiness);

  const roomsTransportStatus = useRoomsStore(selectTransportStatus);
  const transportStatus =
    wsStatusRaw !== "unknown" ? wsStatusRaw : roomsTransportStatus;

  // ---------- USER SCOPE (party-first) ----------
  // Use the hook, not getState(), so we react when auth/user changes.
  const userState   = useUserStore((s) => s);
  const userReady   = isUserReady(userState);           // hydrated + partyId
  const userScopeKey = userReady ? getUserScopeKey(userState) : ""; // partyId
  const roomsScopeKey = useRoomsStore(selectRoomsScopeKey);

  // ---------- LOCAL LOADING STATE (HTTP only; WS uses transportStatus) ----------
  const [loading, setLoading]     = useState(false);
  const [loadError, setLoadError] = useState(null);

  // ---------- Helpers ----------
  const pickNextActiveRoom = useCallback(() => {
    const s = useRoomsStore.getState();
    const currentlyActive = s.activeRoomId;
    if (currentlyActive && s.byId[currentlyActive]) return; // still valid
    const nextId = s.allIds[0] || null;
    s.setActiveRoom(nextId);
  }, []);

  const removeRoomLocally = useCallback(
    (roomId) => {
      if (!roomId) return;
      const s = useRoomsStore.getState();
      s.remove?.(roomId);
      // If the removed room was active, choose the next one
      if (s.activeRoomId === String(roomId)) {
        pickNextActiveRoom();
      }
    },
    [pickNextActiveRoom]
  );

  // Public actions
  const leaveRoom = useCallback(
    async (roomId) => {
      if (!roomId) return;
      try {
        await api.leaveRoom?.({ roomId });
        removeRoomLocally(roomId);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[TI] useRooms.leaveRoom failed", e);
        throw e;
      }
    },
    [removeRoomLocally]
  );

  const deleteRoom = useCallback(
    async (roomId) => {
      if (!roomId) return;
      try {
        await api.deleteRoom?.({ roomId });
        removeRoomLocally(roomId);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[TI] useRooms.deleteRoom failed", e);
        throw e;
      }
    },
    [removeRoomLocally]
  );

  // Reset slice when identity/party scope changes
  useEffect(() => {
    if (!userReady) return;
    const apiRooms = useRoomsStore.getState();
    const prevKey  = apiRooms.userScopeKey;
    if (prevKey !== userScopeKey) {
      apiRooms.clear();
      apiRooms.setUserScopeKey(userScopeKey);
      // eslint-disable-next-line no-console
      console.info("[TI] useRooms: scope changed → cleared rooms", {
        prevKey,
        userScopeKey,
      });
    }
  }, [userReady, userScopeKey]);

  // Fetch rooms once auth ready and scope is set (party-first: by partyId)
  useEffect(() => {
    if (!userReady) return;
    if (!userScopeKey) return;

    const apiRooms = useRoomsStore.getState();
    const alreadyLoaded =
      apiRooms.userScopeKey === userScopeKey &&
      apiRooms.allIds.length > 0;
    if (alreadyLoaded) return;

    const ac = new AbortController();
    setLoading(true);
    setLoadError(null);

    (async () => {
      try {
        const res  = await api.getRooms({ signal: ac.signal });
        const list = Array.isArray(res?.data) ? res.data : [];
        apiRooms.setRooms(list);

        // Choose sensible default active room if none
        if (!useRoomsStore.getState().activeRoomId) {
          const firstId =
            useRoomsStore.getState().allIds?.[0] || null;
          if (firstId) apiRooms.setActiveRoom(firstId);
        }

        // ---------- Tickets warmup for mostly-used rooms (up to 20) ----------
        // PARTY-FIRST:
        // - Rooms are fetched by partyId.
        // - Tickets are fetched by (roomId, partyId) on the backend.
        // Here we just hydrate SPA cache per-room via REST.
        try {
          const { useTicketsStore } = await import(
            "../store/useTicketsStore.js"
          );
          const MAX_WARM_ROOMS = 20;

          const allRoomIds = useRoomsStore.getState().allIds || [];
          const warmRoomIds = allRoomIds.slice(0, MAX_WARM_ROOMS);

          await Promise.all(
            warmRoomIds.map(async (roomId) => {
              if (!roomId) return;
              const rid = String(roomId); // doubles as tenantId in backend, but SPA treats it just as roomId

              const tState = useTicketsStore.getState();
              const existingBucket = tState.byRoomId?.[rid];
              if (existingBucket && existingBucket.status === "loaded") return;

              try {
                const page = await api.fetchTicketsPage({
                  roomId: rid,
                  cursor: null,
                  // warm window size per room; adjust as needed
                  limit: 50,
                  signal: ac.signal,
                });

                const safe = page || {
                  items: [],
                  cursor: null,
                  total: 0,
                };
                const store = useTicketsStore.getState();
                store.hydrateRoom?.(
                  rid,
                  safe.items || [],
                  safe.cursor ?? null,
                  safe.total ?? 0
                );
              } catch (err) {
                if (err?.name === "AbortError") return;
                // eslint-disable-next-line no-console
                console.info(
                  "[TI] useRooms: tickets warmup failed for room",
                  { roomId: rid, err }
                );
              }
            })
          );
        } catch (e) {
          // eslint-disable-next-line no-console
          console.info("[TI] useRooms: tickets warmup skipped", e);
        }
      } catch (e) {
        if (e?.name !== "AbortError") {
          setLoadError(e);
          // eslint-disable-next-line no-console
          console.error("[TI] useRooms: initial fetch failed", e);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [userReady, userScopeKey]);

  // ---------- Membership gate for subscribe ----------
  const amMemberOfActiveRoom = useMemo(() => {
    if (!activeRoomId) return false;
    const me = useUserStore.getState().currentUser?.id || "";
    if (!me) return false;
    const room = useRoomsStore.getState().byId[activeRoomId];
    const roster = Array.isArray(room?.participants)
      ? room.participants
      : Array.isArray(room?.roommates)
      ? room.roommates
      : [];
    // party-first: participants[].id is partyId
    return roster.some((p) => String(p?.id) === String(me));
  }, [activeRoomId]);

  // WS subscribe/unsubscribe for active room — gated by auth + membership
  const prevActiveRef = useRef(null);
  useEffect(() => {
    if (!userReady) return;
    const readyTransport =
      transportStatus === "open" ||
      transportStatus === "registered";
    if (!readyTransport) return;

    const prev = prevActiveRef.current;
    if (prev && prev !== activeRoomId) {
      try {
        unsubscribe(prev);
      } catch {}
    }

    // Only subscribe if I am a participant in the room (party-first consistency)
    if (activeRoomId && amMemberOfActiveRoom) {
      try {
        subscribe(activeRoomId);
      } catch {}
    } else if (activeRoomId && !amMemberOfActiveRoom) {
      // eslint-disable-next-line no-console
      console.info(
        "[TI] useRooms: skip SUBSCRIBE (not a member yet)",
        { activeRoomId }
      );
    }

    prevActiveRef.current = activeRoomId || null;

    return () => {
      const last = prevActiveRef.current;
      if (last) {
        try {
          unsubscribe(last);
        } catch {}
      }
      prevActiveRef.current = null;
    };
  }, [
    userReady,
    transportStatus,
    activeRoomId,
    amMemberOfActiveRoom,
    subscribe,
    unsubscribe,
  ]);

  // If the active room disappears (e.g., via WS room.deleted), pick the next
  useEffect(() => {
    pickNextActiveRoom();
  }, [insiderRooms, personalRooms, businessRooms, pickNextActiveRoom]);

  const setActiveRoom = useCallback((roomId) => {
    useRoomsStore.getState().setActiveRoom(roomId ?? null);
  }, []);

  const groups = useMemo(() => {
    const calcUnread = (arr) =>
      arr.reduce((sum, r) => sum + (r?.unreadCount | 0), 0);
    return {
      insider: {
        rooms: insiderRooms,
        unreadTotal: calcUnread(insiderRooms),
      },
      personal: {
        rooms: personalRooms,
        unreadTotal: calcUnread(personalRooms),
      },
      business: {
        rooms: businessRooms,
        unreadTotal: calcUnread(businessRooms),
      },
    };
  }, [insiderRooms, personalRooms, businessRooms]);

  const unreadTotal = useMemo(() => {
    const calc = (arr) =>
      arr.reduce((sum, r) => sum + (r?.unreadCount | 0), 0);
    return (
      calc(insiderRooms) +
      calc(personalRooms) +
      calc(businessRooms)
    );
  }, [insiderRooms, personalRooms, businessRooms]);

  const wsStatus = transportStatus;

  return {
    // data
    groups,
    activeRoomId,
    unreadTotal,

    // actions
    setActiveRoom,
    leaveRoom,
    deleteRoom,

    // status
    userReady,
    userScopeKey: roomsScopeKey || userScopeKey,
    loading,
    loadError,
    transportStatus: wsStatus,
  };
}

export default useRooms;
