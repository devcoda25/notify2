import { useEffect, useRef, useState } from "react";
import { Chip, Stack, Tooltip } from "@mui/material";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import { registerServiceWorker } from "../swRegistration";
import { ensurePermission, subscribePush, unsubscribePush } from "../push/pushClient";
import { useDialerStore } from "../Component/dailer/store/useDialerStore";

/**
 * Responsibilities:
 * - Register SW and wire message channel
 * - Gate notifications on permission
 * - Optionally register push (if your pushClient is configured); otherwise just use SW postMessage
 * - Keep SW informed about page visibility so it only notifies for NEW calls when hidden
 * - Forward notification actions into the dialer UI (focus call, etc.)
 */

export default function CallAlertsController({ agentId, minimal = true }) {
  const { focusCallById } = useDialerStore((s) => ({
    focusCallById: s.focusCallById, // route UI to call screen by id
  }));

  const [reg, setReg] = useState(null);
  const [perm, setPerm] = useState(typeof Notification !== "undefined" ? Notification.permission : "default");
  const subscribedRef = useRef(false);

  // Keep SW in sync with page visibility
  useEffect(() => {
    const sendVisibility = (state) => {
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({ type: "APP_VISIBILITY", state });
      }
    };
    const onVis = () => sendVisibility(document.visibilityState);
    const onFocus = () => sendVisibility("visible");
    const onBlur = () => sendVisibility(document.visibilityState || "hidden");

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    // Initial push
    sendVisibility(document.visibilityState || "visible");

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  // DEV-ONLY helper so you can trigger calls from the console
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const expose = async (overrides = {}) => {
      await navigator.serviceWorker.ready; // ensure SW ready
      if (!navigator.serviceWorker.controller) {
        console.warn("[demo] SW has no controller yet. Refresh once after first install.");
      }
      const callId = overrides.callId || ("demo-" + Date.now());
      const payload = {
        callId,
        callerName: overrides.callerName || "Demo Caller",
        phoneMasked: overrides.phoneMasked || "+256••• ••3456",
        priority: overrides.priority || "P2",
        deepLink: overrides.deepLink || `/?pop=call&callId=${callId}`,
        notifyIfVisible: !!overrides.notifyIfVisible,
        ttlSec: overrides.ttlSec ?? 45,
      };
      navigator.serviceWorker.controller?.postMessage({
        type: "SIMULATE_NEW_CALL",
        payload,
      });
    };
    window.simulateIncomingCall = expose;
    return () => { delete window.simulateIncomingCall; };
  }, []);

  // Register SW + wire message listener
  useEffect(() => {
    (async () => {
      const r = await registerServiceWorker();
      setReg(r);

      const handler = (ev) => {
        const msg = ev?.data || {};
        if (msg.type === "CALL_ALERT_ACTION") {
          // From notification click buttons
          const { intent, callId, payload } = msg;
          // For now: route to call view; you can branch on intent if needed
          if (callId) focusCallById?.(callId, payload);
        } else if (msg.type === "CALL_ALERT") {
          // SW also broadcasts arrivals; use for inline toasts if you like
          const { callId, payload } = msg;
          // Optionally show a lightweight in-app toast
          // e.g., useDialerStore.getState().showInlineCallToast?.(callId, payload)
        }
      };

      navigator.serviceWorker?.addEventListener("message", handler);
      return () => navigator.serviceWorker?.removeEventListener("message", handler);
    })();
  }, [focusCallById]);

  // Minimal opt-in UI: hide if permission granted and minimal=true
  if (minimal && perm === "granted") return null;

  const enable = async () => {
    // Ask user for system permission
    const p = await ensurePermission();
    setPerm(p);

    // Optional push subscription (client-only mode can skip if you haven't wired VAPID/server)
    if (p === "granted" && reg && !subscribedRef.current) {
      try {
        await subscribePush?.(reg, agentId || "me"); // NO-OP if not implemented
        subscribedRef.current = true;
      } catch (e) {
        console.warn("[CallAlerts] subscribePush skipped/failed:", e?.message || e);
      }
    }
  };

  const disable = async () => {
    if (!reg) return;
    try { await unsubscribePush?.(reg, agentId || "me"); } catch { }
    subscribedRef.current = false;
  };

  return (
    <Stack direction="row" spacing={1}>
      {/* {perm !== "granted" ? (
        <Tooltip title="Enable system notifications for NEW calls (even if the app is backgrounded)">
          <Chip
            size="small"
            variant="outlined"
            color="primary"
            icon={<NotificationsActiveOutlinedIcon />}
            label="Enable Call Alerts"
            onClick={enable}
            sx={{ borderRadius: 1, cursor: "pointer" }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Disable call alerts on this device">
          <Chip
            size="small"
            variant="outlined"
            icon={<NotificationsOffOutlinedIcon />}
            label="Alerts Enabled"
            onClick={disable}
            sx={{ borderRadius: 1, cursor: "pointer" }}
          />
        </Tooltip>
      )} */}
    </Stack>
  );
}
