// Safe, merge-only localStorage persistence for Zustand
//
// Usage:
// attachPersistence(useAvailabilityStore, {
//   key: "meetings.availability",
//   select: (s) => ({ profiles: s.profiles, loaded: s.loaded }),
// });

export function attachPersistence(store, { key, select } = {}) {
  if (!key) {
    console.warn("[persist] Missing key; skipping persistence attach.");
    return;
  }

  // ---- Rehydrate once (MERGE, do not replace) ----
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      // merge saved slice into current state so functions remain
      store.setState((s) => ({ ...s, ...parsed }), false); // replace=false
    }
  } catch (e) {
    console.warn("[persist] Failed to rehydrate:", e);
  }

  // ---- Subscribe to changes (save only the selected slice) ----
  const unsub = store.subscribe(
    (state) => {
      try {
        const toSave = select ? select(state) : state;
        localStorage.setItem(key, JSON.stringify(toSave));
      } catch (e) {
        // Avoid breaking the app due to storage quota, etc.
        console.warn("[persist] Failed to persist:", e);
      }
    }
    // Note: no selector function here; we always save the latest snapshot.
  );

  // Optional: return an unsubscribe so you can detach in tests, etc.
  return () => {
    try {
      unsub?.();
    } catch {
      /* noop */
    }
  };
}
