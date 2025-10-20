// /src/Component/Meetings/components/live/sections/EndAndOverlays.jsx
import React from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Tv,
  Home,
  RefreshCcw,
  RotateCcw,
  PhoneOff,
  AlertTriangle,
  ShieldAlert,
  TimerOff,
  WifiOff,
  Wifi,
  Copy,
} from "lucide-react";
import { ChatDrawer, RosterDrawer, AllMembersDialog } from "../views";

function IconBubble({ color = "primary", children }) {
  const theme = useTheme();
  const c = theme.palette[color]?.main || theme.palette.primary.main;
  return (
    <Box
      sx={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        bgcolor: alpha(c, 0.12),
        color: c,
      }}
    >
      {children}
    </Box>
  );
}

export function EndPanel({ state, reason, setState, STATES }) {
  const theme = useTheme();

  // meta per scenario: icon, title, body, bullets, primary/secondary actions
  const meta = (() => {
    if (state === STATES.ENDED) {
      return {
        color: "primary",
        icon: <PhoneOff size={34} />,
        title: "Class ended",
        body:
          reason ||
          "The host has ended this class for everyone. You can return to the lobby or head back to your dashboard.",
        bullets: [
          "If the host restarts, you can rejoin from the lobby.",
          "You can still view chat or notes if saved elsewhere.",
        ],
        primary: { label: "Rejoin lobby", icon: <RefreshCcw size={16} />, action: () => setState(STATES.LOBBY) },
        secondary: { label: "Back to home", icon: <Home size={16} />, action: () => (window.location.href = "/") },
      };
    }
    if (state === STATES.ERROR) {
      return {
        color: "error",
        icon: <AlertTriangle size={34} />,
        title: "Something went wrong",
        body: reason || "We hit an unexpected error while preparing your class.",
        bullets: [
          "Check camera/mic permissions in your browser.",
          "Close other apps using your camera or microphone.",
        ],
        primary: { label: "Try again", icon: <RotateCcw size={16} />, action: () => setState(STATES.LOBBY) },
        secondary: { label: "Back to home", icon: <Home size={16} />, action: () => (window.location.href = "/") },
      };
    }
    if (state === STATES.TIMEOUT) {
      return {
        color: "warning",
        icon: <TimerOff size={34} />,
        title: "Request timed out",
        body: reason || "The server didn’t respond in time.",
        bullets: ["Check your internet connection.", "Try again in a few seconds."],
        primary: { label: "Try again", icon: <RotateCcw size={16} />, action: () => setState(STATES.LOBBY) },
        secondary: { label: "Back to home", icon: <Home size={16} />, action: () => (window.location.href = "/") },
      };
    }
    if (state === STATES.UNAVAILABLE) {
      return {
        color: "info",
        icon: <ShieldAlert size={34} />,
        title: "Room unavailable",
        body: reason || "This room can’t be found or isn’t active.",
        bullets: ["Confirm the invite link with the host.", "If this is your class, create a new room."],
        primary: { label: "Retry", icon: <RotateCcw size={16} />, action: () => setState(STATES.LOBBY) },
        secondary: { label: "Back to home", icon: <Home size={16} />, action: () => (window.location.href = "/") },
      };
    }
    // STATES.SLOW
    return {
      color: "warning",
      icon: <Wifi size={34} />,
      title: "Network looks slow",
      body: reason || "Your connection seems unstable.",
      bullets: ["Turn off your camera to reduce bandwidth.", "Pause large downloads or switch networks."],
      primary: { label: "Try again", icon: <RotateCcw size={16} />, action: () => setState(STATES.LOBBY) },
      secondary: { label: "Back to home", icon: <Home size={16} />, action: () => (window.location.href = "/") },
      extra: { label: "Network help", icon: <WifiOff size={16} />, action: () => setState(STATES.LOBBY) },
    };
  })();

  const copyLink = () => navigator.clipboard?.writeText(window.location.href);

  return (
    <Stack
      gap={2.5}
      alignItems="center"
      textAlign="center"
      sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 720, mx: "auto" }}
    >
      <IconBubble color={meta.color}>{meta.icon}</IconBubble>

      <Stack gap={0.75}>
        <Typography variant="h5" fontWeight={800}>
          {meta.title}
        </Typography>
        <Typography color="text.secondary">{meta.body}</Typography>

        {/* Friendly tips */}
        {meta.bullets?.length > 0 && (
          <Stack
            component="ul"
            sx={{
              listStyle: "disc",
              textAlign: "left",
              p: 0,
              pl: 3,
              m: 0,
              color: "text.secondary",
            }}
            gap={0.5}
          >
            {meta.bullets.map((b, i) => (
              <Typography key={i} component="li" variant="body2">
                {b}
              </Typography>
            ))}
          </Stack>
        )}
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
        <Button variant="contained" onClick={meta.primary.action} startIcon={meta.primary.icon}>
          {meta.primary.label}
        </Button>
        <Button variant="outlined" onClick={meta.secondary.action} startIcon={meta.secondary.icon}>
          {meta.secondary.label}
        </Button>
        <Button variant="text" onClick={copyLink} startIcon={<Copy size={16} />}>
          Copy link
        </Button>
      </Stack>
    </Stack>
  );
}

export function Overlays({
  // Leave dialog
  leaveOpen,
  setLeaveOpen,
  leaveMeeting,
  // Chat
  displayName,
  messages,
  draft,
  setDraft,
  sendMessage,
  openChat,
  setOpenChat,
  // Roster
  openRoster,
  setOpenRoster,
  participants,
  role,
  waiting,
  admit,
  reject,
  // All members
  allOpen,
  setAllOpen,
}) {
  return (
    <>
      {/* Leave confirm */}
      <Dialog open={leaveOpen} onClose={() => setLeaveOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 1 }}>
          <PhoneOff size={18} /> Leave class?
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            You’ll disconnect from this session, but others can continue. You can rejoin from the lobby at any time.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveOpen(false)}>Stay</Button>
          <Button onClick={leaveMeeting} color="error" variant="contained" startIcon={<PhoneOff size={16} />}>
            Leave class
          </Button>
        </DialogActions>
      </Dialog>

      {/* Drawers / Dialogs */}
      <ChatDrawer
        open={openChat}
        onClose={() => setOpenChat(false)}
        messages={messages}
        draft={draft}
        setDraft={setDraft}
        onSend={sendMessage}
      />

      <RosterDrawer
        open={openRoster}
        onClose={() => setOpenRoster(false)}
        participants={participants}
        role={role}
        waiting={waiting}
        admit={admit}
        reject={reject}
      />

      <AllMembersDialog open={allOpen} onClose={() => setAllOpen(false)} participants={participants} />
    </>
  );
}
