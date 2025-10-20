import React from "react";
import { syncBootstrap, asyncBootstrap } from "./bootstrap";

// Usage modes:
// - block = false  → only sync pre-paint work (no flash), render app immediately
// - block = true   → do sync pre-paint, then BLOCK on async bootstrap (shows Splash)

export default function BootGate({ children, block = false, Splash = null }) {
  const [ready, setReady] = React.useState(block ? false : true);

  // Pre-paint sync work (no flicker)
  React.useLayoutEffect(() => {
    syncBootstrap();
  }, []);

  // Optional async bootstrap
  React.useEffect(() => {
    if (!block) return;
    const ctrl = new AbortController();
    asyncBootstrap({ signal: ctrl.signal })
      .catch(() => {}) // decide what to do on error (log, sentry, etc.)
      .finally(() => setReady(true));
    return () => ctrl.abort();
  }, [block]);

  if (!ready) {
    // No flash: render nothing OR a branded Splash component you pass in.
    return Splash ? <Splash /> : null;
  }
  return children;
}
