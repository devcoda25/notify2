// src/TeamInbox/hooks/useChat.js
// Use: Warm window hydrate + older-page paging for the ACTIVE TICKET,
//      with scroll bottom-lock helpers.
// Works with: useChatStore (ticket-scoped hydrate/append), api.service (ticket messages),
//             useRoomsStore (activeRoomId) + useTicketsStore (activeTicketId).
// Fixtures: If REACT_APP_TI_FIXTURES=1 (or ?tiFixtures=1 / localStorage.tiFixtures='1'),
//           generate local demo messages (ticket-scoped).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRoomsStore, selectActiveRoomId } from "../store/useRoomsStore.js";
import {
  useChatStore,
  makeSelectMessagesUI,
  makeSelectCursor,
} from "../store/useChatStore.js";

import { api } from "../services/api.service.js";
import { UX } from "../constants/UX.js";

const WARM_LIMIT = UX.CHAT_WARM_WINDOW ?? 80;
const PAGE_LIMIT = UX.CHAT_PAGE_SIZE ?? 40;

/* ---------- fixtures toggle ---------- */
const envFixtures =
  String(process.env.REACT_APP_TI_FIXTURES ?? process.env.VITE_TI_FIXTURES ?? "0") === "1";

function runtimeFixturesEnabled() {
  if (envFixtures) return true;
  if (typeof window !== "undefined") {
    try {
      if (window.location?.search?.includes("tiFixtures=1")) return true;
      const ls = window.localStorage?.getItem("tiFixtures");
      if (ls === "1" || ls === "true") return true;
    } catch {}
  }
  return false;
}
const USE_FIXTURES = runtimeFixturesEnabled();
/* ------------------------------------ */

function useBottomLock(messagesRef) {
  const [isAtBottom, setAtBottom] = useState(true);
  const bumpSeqRef = useRef(0);
  const prevLenRef = useRef(0);
  const [bumpKey, setBumpKey] = useState(0);

  useEffect(() => {
    const len = messagesRef.current?.length ?? 0;
    const prev = prevLenRef.current;
    if (isAtBottom && len > prev) {
      bumpSeqRef.current += 1;
      setBumpKey(bumpSeqRef.current);
    }
    prevLenRef.current = len;
  }, [messagesRef, isAtBottom, messagesRef.current?.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isAtBottom, setAtBottom, bumpKey };
}

/* ---------------- fixtures: deterministic demo messages (ticket-scoped) ---------------- */
function makeDemoMessages({ roomId, ticketId }, count = 18) {
  const senders = [
    { id: "me", kind: "agent", displayName: "You" },
    { id: "c1", kind: "contact", displayName: "Alex" },
    { id: "c2", kind: "contact", displayName: "Sam" },
  ];
  const texts = [
    "Hey there 👋",
    "Thanks, noted.",
    "Can you share the PO?",
    "Sent! Check your inbox.",
    "Awesome, we’re good to go.",
    "Would Friday 2pm work?",
    "Yes, that works. See you then!",
  ];
  const channels = ["whatsapp", "sms", "email", "inapp"];

  // deterministic-ish seed from roomId + ticketId
  let seed = 0;
  for (const ch of (String(roomId || "") + "|" + String(ticketId || ""))) {
    seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  }
  const rnd = (max) => ((seed = (seed * 1664525 + 1013904223) >>> 0) % max);

  const now = Date.now();
  const list = [];
  for (let i = count - 1; i >= 0; i--) {
    const sender = senders[rnd(senders.length)];
    const id = `m-${ticketId || "x"}-${i}`;
    const createdAt = new Date(now - (count - i) * 60_000 * (1 + rnd(4))).toISOString();
    list.push({
      id,
      roomId: String(roomId || ""),
      ticketId: String(ticketId || ""),
      channel: channels[rnd(channels.length)],
      sender,
      text: texts[rnd(texts.length)],
      status: "sent",
      createdAt,
      meta: {},
    });
  }
  return list.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}
/* -------------------------------------------------------------------------------------- */

// Best-effort: read active ticket from tickets store without coupling at import time.
function useActiveTicketId() {
  const [ticketId, setTicketId] = useState(null);

  useEffect(() => {
    let unsub = null;
    (async () => {
      try {
        const mod = await import("../store/useTicketsStore.js");
        const store = mod?.useTicketsStore;
        if (!store) return;

        const pick = (s) =>
          s.activeTicketId ??
          s.activeTicket?.id ??
          s.selectedTicketId ??
          null;

        // PRIME
        setTicketId(pick(store.getState()));

        // SUBSCRIBE
        unsub = store.subscribe((st, prev) => {
          const nextId = pick(st);
          const prevId = pick(prev);
          if (nextId !== prevId) setTicketId(nextId || null);
        });
      } catch {
        // no-op
      }
    })();

    return () => { try { unsub?.(); } catch {} };
  }, []);

  return ticketId;
}

export function useChat() {
  const roomId = useRoomsStore(selectActiveRoomId);
  const ticketId = useActiveTicketId(); // ← NEW: chat is ticket-scoped

  // Ticket-scoped selectors
  const selectMsgs = useMemo(() => makeSelectMessagesUI({ roomId, ticketId }), [roomId, ticketId]);
  const selectCursor = useMemo(() => makeSelectCursor({ roomId, ticketId }), [roomId, ticketId]);

  const messages = useChatStore(selectMsgs);
  const prevCursor = useChatStore(selectCursor);
  const hydrated =
    !!messages.length ||
    !!useChatStore.getState().byThread?.[String(ticketId || "")]?.hydrated;

  const [isLoadingWarm, setIsLoadingWarm] = useState(false);
  const [isLoadingPrev, setIsLoadingPrev] = useState(false);
  const [error, setError] = useState(null);

  const messagesRef = useRef(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const bottomLock = useBottomLock(messagesRef);

  const abortRef = useRef(null);
  const inflightKeyRef = useRef(0);
  const cancelInFlight = useCallback(() => {
    try { abortRef.current?.abort?.(); } catch {}
    abortRef.current = null;
    inflightKeyRef.current += 1;
  }, []);

  // ───────────────────────── Warm hydrate (TICKET-SCOPED) ─────────────────────────
  useEffect(() => {
    // Guard: stop ANY room-scoped warm window fetch
    if (!roomId || !ticketId) {
      cancelInFlight();
      setIsLoadingWarm(false);
      setError(null);
      return;
    }

    const already = useChatStore.getState().byThread?.[String(ticketId)]?.hydrated;
    if (already) return;

    let alive = true;
    const runKey = ++inflightKeyRef.current;

    (async () => {
      setIsLoadingWarm(true);
      setError(null);
      cancelInFlight();

      // Fixtures path
      if (USE_FIXTURES) {
        const demo = makeDemoMessages({ roomId, ticketId }, 18);
        useChatStore.getState().hydrateTicket({ roomId, ticketId }, demo, null);
        if (alive && runKey === inflightKeyRef.current) setIsLoadingWarm(false);
        return;
      }

      // Real network path — NEW ticket-scoped calls
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const page = await api.getTicketWarmWindow({
          roomId,
          ticketId,
          limit: WARM_LIMIT,
          signal: controller.signal,
        });
        if (!alive || runKey !== inflightKeyRef.current) return;

        const list = Array.isArray(page?.data) ? page.data : Array.isArray(page?.items) ? page.items : [];
        const cursor = page?.prevCursor ?? page?.cursor ?? null;
        useChatStore.getState().hydrateTicket({ roomId, ticketId }, list, cursor);
      } catch (e) {
        if (e?.name !== "AbortError" && alive) {
          setError(String(e?.message || e || "Failed to load conversation"));
          useChatStore.getState().hydrateTicket({ roomId, ticketId }, [], null);
        }
      } finally {
        if (alive) setIsLoadingWarm(false);
      }
    })();

    return () => { alive = false; cancelInFlight(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, ticketId]);

  // ───────────────────────── Older page (TICKET-SCOPED) ─────────────────────────
  const loadPrev = useCallback(async () => {
    if (!roomId || !ticketId || !prevCursor || isLoadingPrev) return;
    if (USE_FIXTURES) return; // no pagination in fixtures

    setIsLoadingPrev(true);
    setError(null);
    cancelInFlight();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const page = await api.getTicketOlderMessages({
        roomId,
        ticketId,
        beforeCursor: prevCursor,
        limit: PAGE_LIMIT,
        signal: controller.signal,
      });
      const list = Array.isArray(page?.items) ? page.items : [];
      const nextPrevCursor = page?.prevCursor ?? null;

      useChatStore.getState().appendTicket({ roomId, ticketId }, list, nextPrevCursor);
    } catch (e) {
      if (e?.name !== "AbortError") {
        setError(String(e?.message || e || "Failed to load older messages"));
      }
    } finally {
      setIsLoadingPrev(false);
    }
  }, [roomId, ticketId, prevCursor, isLoadingPrev, cancelInFlight]);

  return useMemo(() => ({
    // data
    messages,
    isHydrated: hydrated,
    // actions
    loadPrev,
    bottomLock,
    // status (expose if UI wants them)
    // isLoadingWarm, isLoadingPrev, error,
  }), [messages, hydrated, loadPrev, bottomLock]);
}

export default useChat;
