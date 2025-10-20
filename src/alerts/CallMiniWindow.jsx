// /src/alerts/CallMiniWindow.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Paper, Stack, Typography, IconButton, Button, Avatar, Chip, Box, Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { keyframes } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { useDialerStore } from "../Component/store/useDialerStore";

/* ==== Visuals borrowed from AgentProfileCard ==== */
const ringShimmer = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;
const makeRingPulse = (rgba) => keyframes`
  0% {
    box-shadow:
      0 0 0 0 ${rgba(0.40)},
      0 0 0 0 ${rgba(0.20)};
    transform: translateZ(0);
  }
  60% {
    box-shadow:
      0 0 0 10px ${rgba(0)},
      0 0 0 22px ${rgba(0)};
  }
  100% {
    box-shadow:
      0 0 0 0 ${rgba(0)},
      0 0 0 0 ${rgba(0)};
  }
`;

/* hex → rgba(alpha) */
const toRGBA = (hex, alpha) => {
  const h = String(hex || "").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return `rgba(0,0,0,${alpha})`;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function CallMiniWindow() {
  const theme = useTheme();
  const ringBase = theme.palette.mode === 'dark'
    ? (theme.palette.info?.main || '#00BCD4')
    : (theme.palette.primary?.main || '#3F51B5');
  const ringRGBA = useCallback((a) => toRGBA(ringBase, a), [ringBase]);
  const ringPulseKF = useMemo(() => makeRingPulse((a) => ringRGBA(a)), [ringRGBA]);

  const { startCall, setNumber, focusCallById } = useDialerStore(s => ({
    startCall: s.startCall,
    setNumber: s.setNumber,
    focusCallById: s.focusCallById,
  }));

  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null); // { callId, callerName, phoneMasked, priority, deepLink, msisdn? }
  const lastShownIdRef = useRef(null);

  // Listen for SW broadcasts
  useEffect(() => {
    const onMsg = (ev) => {
      const { type } = ev?.data || {};
      if (type === "CALL_ALERT") {
        const { callId, payload } = ev.data;
        if (!callId) return;
        if (lastShownIdRef.current === callId) return;
        lastShownIdRef.current = callId;

        setData({
          callId,
          callerName: payload?.callerName || "Incoming Call",
          phoneMasked: payload?.phoneMasked || "",
          priority: payload?.priority || "P3",
          deepLink: payload?.deepLink || `/?pop=call&callId=${callId}`,
          msisdn: payload?.msisdn || payload?.phone || null,
        });
        setVisible(true);
      } else if (type === "CALL_ALERT_CLOSED") {
        const { callId } = ev.data || {};
        if (callId && data?.callId === callId) {
          setVisible(false);
        }
      } else if (type === "CALL_ALERT_ACTION") {
        const { intent, callId, payload } = ev.data || {};
        if (!callId) return;
        // Mirror actions inside app too (if user handled from system tray)
        if (intent === "answer") {
          focusCallById?.(callId, payload);
          setVisible(false);
        } else if (intent === "decline") {
          focusCallById?.(callId, payload);
          setVisible(false);
        } else {
          focusCallById?.(callId, payload);
          setVisible(false);
        }
      }
    };
    navigator.serviceWorker?.addEventListener("message", onMsg);
    return () => navigator.serviceWorker?.removeEventListener("message", onMsg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.callId, focusCallById]);

  // Actions
  const doAnswer = () => {
    if (!data) return;
    if (data.msisdn) {
      setNumber?.(String(data.msisdn));
      startCall?.(String(data.msisdn));
    }
    focusCallById?.(data.callId, data);
    setVisible(false);
  };

  const doOpen = () => {
    if (!data) return;
    focusCallById?.(data.callId, data);
    setVisible(false);
  };

  const doClose = () => setVisible(false);

  const colorByPriority = useMemo(() => {
    const p = String(data?.priority || "P3").toUpperCase();
    return p === "P1" ? "error" : p === "P2" ? "warning" : "default";
  }, [data?.priority]);

  if (!visible || !data) return null;

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        right: 16,
        bottom: 16,
        width: 360,
        maxWidth: "94vw",
        borderRadius: 1.5,
        p: 1.25,
        zIndex: 1600,
        border: (t) => `1px solid ${t.palette.divider}`,
        bgcolor: "background.paper",
        overflow: "hidden",
        // Ringing glow
        borderColor: ringBase,
        animation: `${ringPulseKF} 1.6s ease-out infinite`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "40%",
          background: `linear-gradient(90deg,
            rgba(255,255,255,0) 0%,
            ${ringRGBA(theme.palette.mode === 'dark' ? 0.18 : 0.12)} 50%,
            rgba(255,255,255,0) 100%
          )`,
          transform: "translateX(-100%)",
          animation: `${ringShimmer} 1.6s linear infinite`,
          mixBlendMode: theme.palette.mode === "dark" ? "screen" : "multiply",
          pointerEvents: "none",
        },
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
          "&::before": { animation: "none" },
        },
      }}
    >
      <Stack spacing={1}>
        {/* Header row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
            <Avatar sx={{ width: 40, height: 40 }}>
              {(data.callerName || "?").slice(0, 2).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                {data.callerName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {data.phoneMasked || "—"}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <Chip size="small" label={data.priority || "P3"} color={colorByPriority} variant="outlined" />
            <Tooltip title="Close">
              <IconButton size="small" onClick={doClose} sx={{ borderRadius: 1 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Actions */}
        <Stack direction="row" spacing={1}>
          <Button
            onClick={doAnswer}
            variant="contained"
            startIcon={<LocalPhoneOutlinedIcon />}
            sx={{ flex: 1, textTransform: "none" }}
          >
            Answer
          </Button>
          <Button
            onClick={doOpen}
            variant="outlined"
            startIcon={<VisibilityOutlinedIcon />}
            sx={{ textTransform: "none" }}
          >
            Open
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
