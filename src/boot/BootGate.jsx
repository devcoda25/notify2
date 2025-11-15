// /src/boot/BootGate.jsx
import React from "react";
import { syncBootstrap, asyncBootstrap } from "./bootstrap";

/**
 * BootGate
 * - If `block` is true, children do not render until bootstrap finishes.
 * - Pass an optional `Splash` component (e.g., a branded full-screen) for zero flash.
 *
 * Usage (wrap your private app shell):
 *   <BootGate block Splash={AppSplash}><PrivateApp /></BootGate>
 */
export default function BootGate({ children, block = false, Splash = null }) {
  const [ready, setReady] = React.useState(!block);

  // Always run quick, synchronous URL param bootstrap (x_authuser etc.)
  React.useLayoutEffect(() => {
    try { syncBootstrap(); } catch {}
  }, []);

  // If blocking, run async bootstrap and gate rendering
  React.useEffect(() => {
    if (!block) return;

    let cancelled = false;
    const ctrl = new AbortController();

    (async () => {
      try {
        await asyncBootstrap({ signal: ctrl.signal });
      } catch {
        // Private routes/components will handle redirect if needed
      } finally {
        if (!cancelled && !ctrl.signal.aborted) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [block]);

  if (!ready) return Splash ? <Splash /> : null;
  return children;
}
