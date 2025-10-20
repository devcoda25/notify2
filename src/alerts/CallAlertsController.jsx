/* @refresh skip */  // tell the dev plugin to skip react-refresh transform for THIS file

// /src/alerts/CallAlertsController.jsx
import { useEffect, useRef, useState } from "react";
import { Chip, Stack, Tooltip } from "@mui/material";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import PictureInPictureAltOutlinedIcon from "@mui/icons-material/PictureInPictureAltOutlined";

import { registerServiceWorker } from "../swRegistration";
import { ensurePermission, subscribePush, unsubscribePush } from "../push/pushClient";
// NOTE: your store lives under 'dailer' per your tree
import { useDialerStore } from "../Component/store/useDialerStore";

import CallMiniWindowPiP from "./CallMiniWindowPiP";
import CallMiniWindow from "./CallMiniWindow";

export default function CallAlertsController({ agentId, minimal = true }) {
  const { focusCallById } = useDialerStore((s) => ({ focusCallById: s.focusCallById }));

  const [reg, setReg] = useState(null);
  const [perm, setPerm] = useState(() =>
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [pipSupported] = useState(
    () => typeof window !== "undefined" && "documentPictureInPicture" in window
  );

  const subscribedRef = useRef(false);
  const pipRef = useRef(null); // CallMiniWindowPiP
  const [inlineCall, setInlineCall] = useState(null); // in-tab fallback

  useEffect(() => {
    let visibilityHandler = null;
    let messageHandler = null;
    let aborted = false;

    const setup = async () => {
      try {
        const r = await registerServiceWorker();
        if (aborted) return;
        setReg(r);

        // Post visibility
        const postVis = () =>
          navigator.serviceWorker?.controller?.postMessage({
            type: "APP_VISIBILITY",
            state: document.visibilityState,
          });

        visibilityHandler = postVis;
        postVis();
        document.addEventListener("visibilitychange", visibilityHandler);

        // SW messages
        messageHandler = (ev) => {
          const msg = ev?.data || {};
          if (msg.type === "CALL_ALERT") {
            const call = msg.payload;
            if (pipSupported && pipRef.current?.isSupported?.()) {
              pipRef.current.openOrUpdate?.(call);
            } else {
              setInlineCall(call);
            }
          }
          if (msg.type === "CALL_ALERT_ACTION") {
            const { _intent, callId, payload } = msg;
            focusCallById?.(callId, payload);
          }
        };

        navigator.serviceWorker?.addEventListener?.("message", messageHandler);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("CallAlertsController setup failed:", e);
      }
    };

    setup();

    return () => {
      aborted = true;
      if (visibilityHandler) document.removeEventListener("visibilitychange", visibilityHandler);
      if (messageHandler) navigator.serviceWorker?.removeEventListener?.("message", messageHandler);
    };
  }, [pipSupported, focusCallById]);

  // Minimal mode: if permission granted, keep only the hidden PiP target mounted
  if (minimal && perm === "granted") {
    return (
      <>
        <CallMiniWindowPiP
          ref={pipRef}
          onAnswer={(call) => focusCallById?.(call?.callId, call)}
          onOpen={(call) => focusCallById?.(call?.callId, call)}
          onClosed={() => {}}
        />
        {!pipSupported && inlineCall && (
          <CallMiniWindow
            open={!!inlineCall}
            call={inlineCall}
            onAnswer={() => focusCallById?.(inlineCall?.callId, inlineCall)}
            onOpen={() => focusCallById?.(inlineCall?.callId, inlineCall)}
            onClose={() => setInlineCall(null)}
          />
        )}
      </>
    );
  }

  const enableSystemAlerts = async () => {
    const p = await ensurePermission();
    setPerm(p);
    if (p !== "granted" || !reg) return;
    if (!subscribedRef.current) {
      try {
        await subscribePush(reg, agentId || "me");
        subscribedRef.current = true;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("subscribePush failed:", e);
      }
    }
  };

  const disableSystemAlerts = async () => {
    if (!reg) return;
    try {
      await unsubscribePush(reg, agentId || "me");
    } catch {}
    subscribedRef.current = false;
  };

  const armPiP = async () => {
    if (!pipSupported) return;
    try {
      await pipRef.current?.openOrUpdate?.({
        callId: "arm-" + Date.now(),
        callerName: "Ready for floating alerts",
        phoneMasked: "",
        priority: "P3",
      });
      await pipRef.current?.close?.();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("PiP arm failed:", e);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={1}>
        {perm !== "granted" ? (
          <Tooltip title="Enable system notifications for new calls (works even if app is backgrounded)">
            <Chip
              size="small"
              variant="outlined"
              color="primary"
              icon={<NotificationsActiveOutlinedIcon />}
              label="Enable Call Alertsxxx"
              onClick={enableSystemAlerts}
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
              onClick={disableSystemAlerts}
              sx={{ borderRadius: 1, cursor: "pointer" }}
            />
          </Tooltip>
        )}

        {pipSupported && (
          <Tooltip title="Enable floating mini window (Document Picture-in-Picture)">
            <Chip
              size="small"
              variant="outlined"
              icon={<PictureInPictureAltOutlinedIcon />}
              label="Enable Floating Window"
              onClick={armPiP}
              sx={{ borderRadius: 1, cursor: "pointer" }}
            />
          </Tooltip>
        )}
      </Stack>

      {/* PiP target + fallback inline mini window */}
      <CallMiniWindowPiP
        ref={pipRef}
        onAnswer={(call) => focusCallById?.(call?.callId, call)}
        onOpen={(call) => focusCallById?.(call?.callId, call)}
        onClosed={() => {}}
      />
      {!pipSupported && inlineCall && (
        <CallMiniWindow
          open={!!inlineCall}
          call={inlineCall}
          onAnswer={() => focusCallById?.(inlineCall?.callId, inlineCall)}
          onOpen={() => focusCallById?.(inlineCall?.callId, inlineCall)}
          onClose={() => setInlineCall(null)}
        />
      )}
    </>
  );
}
