import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";

/**
 * BroadcastChannel (cross-tab) + same-tab CustomEvent fallback.
 * Emits simple {type, payload, ts} messages namespaced per room.
 */
const Ctx = createContext({ emit: () => {}, subscribe: () => () => {} });

export function LiveBusProvider({ roomId, children }) {
  const channelName = `notify-live:${roomId}`;
  const bcRef = useRef(null);
  const subsRef = useRef(new Set());

  useEffect(() => {
    const bc = "BroadcastChannel" in window ? new BroadcastChannel(channelName) : null;
    bcRef.current = bc;

    const onMsg = (msg) => subsRef.current.forEach((fn) => {
      try { fn(msg); } catch {}
    });

    const onBC = (ev) => onMsg(ev.data);
    const onLocal = (ev) => onMsg(ev.detail);

    bc && bc.addEventListener("message", onBC);
    window.addEventListener(channelName, onLocal);

    return () => {
      bc && bc.removeEventListener("message", onBC);
      window.removeEventListener(channelName, onLocal);
      bc && bc.close();
      bcRef.current = null;
      subsRef.current.clear();
    };
  }, [channelName]);

  const api = useMemo(() => ({
    emit(type, payload) {
      const msg = { type, payload, ts: Date.now() };
      if (bcRef.current) bcRef.current.postMessage(msg);
      window.dispatchEvent(new CustomEvent(channelName, { detail: msg }));
    },
    subscribe(fn) {
      subsRef.current.add(fn);
      return () => subsRef.current.delete(fn);
    },
  }), [channelName]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useLiveBus = () => useContext(Ctx);
