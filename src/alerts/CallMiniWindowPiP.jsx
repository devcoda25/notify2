// /src/alerts/CallMiniWindowPiP.jsx
import React, {
  useImperativeHandle,
  useMemo,
  useRef,
  forwardRef,
  useCallback,
  useState,                // ← needed
} from "react";
import { createPortal } from "react-dom";
import {
  Card, CardContent, Avatar, Typography, Chip, Box, Stack, Button, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { keyframes } from "@mui/system";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

// ---- subtle ring shimmer (mirrors AgentProfileCard vibe) ----
const ringShimmer = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;

// Minimal default theme if none provided
const fallbackTheme = createTheme();

function MiniCard({ call, onAnswer, onOpen, onClose }) {
  const t = useTheme();
  const ringBase = t.palette.mode === "dark"
    ? (t.palette.info?.main || "#00BCD4")
    : (t.palette.primary?.main || "#3F51B5");

  const initials = useMemo(() => {
    const s = String(call?.callerName || "Unknown");
    const parts = s.trim().split(/\s+/);
    return (parts[0]?.[0] || "U") + (parts[1]?.[0] || "");
  }, [call?.callerName]);

  return (
    <Card
      sx={(theme) => ({
        width: 360,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[8],
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "38%",
          background: `linear-gradient(90deg,
              rgba(255,255,255,0) 0%,
              ${theme.palette.mode === 'dark' ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.06)"} 50%,
              rgba(255,255,255,0) 100%
          )`,
          transform: "translateX(-100%)",
          animation: `${ringShimmer} 1.6s linear infinite`,
          pointerEvents: "none",
        },
      })}
    >
      <CardContent sx={{ p: 1.25 }}>
        <Stack spacing={1}>
          {/* Header row */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: ringBase,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                  {call?.callerName || "Incoming call"}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {call?.phoneMasked || "—"}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {call?.priority && (
                <Chip size="small" color="warning" variant="outlined" label={String(call.priority)} />
              )}
              <IconButton size="small" onClick={onClose} sx={{ borderRadius: 1 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          {/* Actions */}
          <Stack direction="row" spacing={1}>
            <Button
              onClick={onAnswer}
              variant="contained"
              startIcon={<LocalPhoneOutlinedIcon />}
              sx={{ flex: 1, textTransform: "none" }}
            >
              Answer
            </Button>
            <Button
              onClick={onOpen}
              variant="outlined"
              startIcon={<VisibilityOutlinedIcon />}
              sx={{ textTransform: "none" }}
            >
              Open
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * CallMiniWindowPiP
 * - Uses Document Picture-in-Picture to float a mini call card above all windows.
 * - Must be "armed" at least once by a user gesture (enable button).
 * - Exposes .openOrUpdate(call) and .close() via ref for the controller to drive it.
 */
const CallMiniWindowPiP = forwardRef(function CallMiniWindowPiP(
  {
    theme = fallbackTheme,
    onAnswer = () => {},
    onOpen = () => {},
    onClosed = () => {},
  },
  ref
) {
  const pipWinRef = useRef(null);
  const rootElRef = useRef(null);
  const [pipDoc, setPipDoc] = useState(null);
  const [call, setCall] = useState(null);

  // Emotion cache that injects styles into the PiP document
  const cache = useMemo(() => {
    if (!pipDoc) return null;
    return createCache({
      key: "pip",
      container: pipDoc.head,
      prepend: true,
    });
  }, [pipDoc]);

  // Open PiP window (requires user activation the first time)
  const requestPiPWindow = useCallback(async (size = { width: 380, height: 160 }) => {
    if (!("documentPictureInPicture" in window)) {
      throw new Error("Document Picture-in-Picture not supported in this browser.");
    }
    if (pipWinRef.current && !pipWinRef.current.closed) return pipWinRef.current;

    const pipWindow = await window.documentPictureInPicture.requestWindow(size);
    pipWinRef.current = pipWindow;

    // Basic page styling inside PiP doc
    pipWindow.document.body.style.margin = "6px";
    pipWindow.document.body.style.background = "transparent";

    // Root element to portal into
    const root = pipWindow.document.createElement("div");
    root.id = "pip-root";
    pipWindow.document.body.appendChild(root);
    rootElRef.current = root;

    // Close handler (user can close)
    const onClose = () => {
      pipWinRef.current = null;
      rootElRef.current = null;
      setPipDoc(null);
      onClosed?.();
    };
    pipWindow.addEventListener("pagehide", onClose, { once: true });
    pipWindow.addEventListener("unload", onClose, { once: true });

    setPipDoc(pipWindow.document);
    return pipWindow;
  }, [onClosed]); // ← stable + correct deps

  const closePiPWindow = useCallback(() => {
    try { pipWinRef.current?.close(); } catch {}
  }, []);

  useImperativeHandle(ref, () => ({
    /**
     * Ensure the PiP window is open, then render/refresh the given call.
     * The first call must come from a user gesture if API enforces it.
     */
    async openOrUpdate(nextCall, size) {
      await requestPiPWindow(size);
      setCall(nextCall || null);
    },
    /** Programmatically close the mini window */
    async close() {
      closePiPWindow();
    },
    /** True if PiP is supported */
    isSupported() {
      return "documentPictureInPicture" in window;
    }
  }), [requestPiPWindow, closePiPWindow]); // ← include deps

  const handleAnswer = () => onAnswer?.(call);
  const handleOpen = () => onOpen?.(call);
  const handleClose = () => closePiPWindow();

  // Guard until the PiP doc exists and cache is ready
  if (!pipDoc || !rootElRef.current || !cache) return null;

  // Portal MUI card into PiP doc with its own emotion cache + theme
  return createPortal(
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <MiniCard call={call} onAnswer={handleAnswer} onOpen={handleOpen} onClose={handleClose} />
      </ThemeProvider>
    </CacheProvider>,
    rootElRef.current
  );
});

export default CallMiniWindowPiP;
