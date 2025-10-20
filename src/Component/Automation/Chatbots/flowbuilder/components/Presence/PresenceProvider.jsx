import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { hashHsl } from './colors';

const PresenceContext = createContext(null);

export function PresenceProvider({
  children,
  roomId = 'flow-room',
  serverUrl = 'wss://y-webrtc-signaling-eu.herokuapp.com',
  identity,
}) {
  const self = useMemo(() => {
    const id = (identity?.id) || (typeof window !== 'undefined' ? crypto.randomUUID().slice(0, 6) : 'server-user');
    const name = identity?.name || `User-${id}`;
    const color = identity?.color || hashHsl(id + name);
    return { id, name, color, avatarUrl: identity?.avatarUrl };
  }, [identity]);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const provider = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return new WebsocketProvider(serverUrl, roomId, ydoc, { connect: true });
  }, [serverUrl, roomId, ydoc]);
  
  const awareness = provider?.awareness ?? null;

  useEffect(() => {
    if (!awareness) return;
    const current = awareness.getLocalState() || {};
    awareness.setLocalState({ ...(current || {}), user: self });

    const clear = () => {
      const st = awareness.getLocalState() || {};
      awareness.setLocalState({ ...st, cursor: undefined, selection: undefined, editing: undefined, publishInProgress: false });
    };
    window.addEventListener('beforeunload', clear);
    return () => {
      clear();
      provider?.destroy();
      window.removeEventListener('beforeunload', clear);
    };
  }, [awareness, provider, self]);

  const updateSelf = (patch) => {
    if (!awareness) return;
    const st = awareness.getLocalState() || {};
    const next = { ...(st.user || self), ...patch };
    awareness.setLocalState({ ...st, user: next });
  };

  return (
    <PresenceContext.Provider value={{ ydoc, provider, awareness, self, updateSelf }}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence() {
  const ctx = useContext(PresenceContext);
  if (!ctx) throw new Error('PresenceProvider missing');
  return ctx;
}

export function useAwarenessStates(mapFn) {
  const { awareness } = usePresence();
  const [states, setStates] = useState([]);
  
  const stableMapFn = useCallback(mapFn || ((s) => s), []);

  useEffect(() => {
    if (!awareness) return;
    const pull = () => {
      const arr = [...awareness.getStates().values()];
      const mapped = stableMapFn ? arr.map(stableMapFn).filter(Boolean) : arr;
      setStates(mapped);
    };
    pull();
    awareness.on('change', pull);
    return () => awareness.off('change', pull);
  }, [awareness, stableMapFn]);

  return states;
}
