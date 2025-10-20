// Path: /src/Component/Meetings/components/live/sections/ControlsAndMenu.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  ButtonBase,
  Divider,
  Tooltip,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { PillControls } from "../controls";
import {
  MessageSquare,
  Users,
  LayoutGrid,
  CircleDot,
  Play,
  Pause,
  Minimize2,
  Maximize2,
  Copy,
  Mic,
  MicOff,
  Video as Cam,
  VideoOff,
  MonitorUp,
  Timer as TimerIcon,
  Phone,
  Hand,
} from "lucide-react";

/* ----------------- Floating controls ----------------- */
export function FloatingControls({
  visible,

  // live toggles
  micOn, camOn, screenOn, recording,
  setMicOn = () => {}, setCamOn = () => {}, setScreenOn = () => {}, setRecording = () => {},

  // mini "End" handler
  setLeaveOpen = () => {},

  // compatibility
  setMoreEl, // eslint-disable-line no-unused-vars

  /* extras used in the full sheet */
  viewMode, setViewMode = () => {},
  setOpenChat = () => {},
  setOpenRoster = () => {},
  setOpenInvite = () => {},
  state, togglePause = () => {},
  fullscreen, toggleFullscreen = () => {},
  role = "host", endForAll = () => {},
  timerLabel = "00:00",
}) {
  const theme = useTheme();

  // Lower than drawers (1200) and modals (1300), higher than default content.
  const Z = theme.zIndex.appBar; // 1100

  const [actionsOpen, setActionsOpen] = useState(false);

  // Close the sheet on ESC
  useEffect(() => {
    if (!actionsOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActionsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [actionsOpen]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop for click-outside when expanded (invisible) */}
      {actionsOpen && (
        <Box
          onClick={() => setActionsOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: Z - 1,
            pointerEvents: "auto",
            bgcolor: "transparent",
          }}
        />
      )}

      {/* Controls container */}
      <Box
        sx={{
          position: "fixed",
          left: "50%",
          bottom: 16,
          transform: "translateX(-50%)",
          zIndex: Z,
          pointerEvents: "none", // avoid blocking page; children opt-in
        }}
      >
        {/* Mini pill — hidden when sheet is open */}
        {!actionsOpen && (
          <Box sx={{ pointerEvents: "auto" }}>
            <PillControls
              micOn={micOn}
              camOn={camOn}
              screenOn={screenOn}
              recording={recording}
              onMic={() => setMicOn((v) => !v)}
              onCam={() => setCamOn((v) => !v)}
              onScreen={() => setScreenOn((v) => !v)}
              onRecord={() => setRecording((v) => !v)}
              onMoreOpen={() => setActionsOpen(true)}
              onHand={() => {}}
              onLeave={() => setLeaveOpen(true)}
            />
          </Box>
        )}

        {/* Expanded action sheet */}
        {actionsOpen && (
          <Box sx={{ pointerEvents: "auto" }}>
            <ActionSheet
              onClose={() => setActionsOpen(false)}
              // state
              micOn={micOn} camOn={camOn} screenOn={screenOn} recording={recording}
              // handlers
              setMicOn={setMicOn} setCamOn={setCamOn} setScreenOn={setScreenOn} setRecording={setRecording}
              setLeaveOpen={setLeaveOpen}
              // extras
              viewMode={viewMode} setViewMode={setViewMode}
              setOpenChat={setOpenChat} setOpenRoster={setOpenRoster} setOpenInvite={setOpenInvite}
              state={state} togglePause={togglePause}
              fullscreen={fullscreen} toggleFullscreen={toggleFullscreen}
              role={role} endForAll={endForAll}
              timerLabel={timerLabel}
            />
          </Box>
        )}
      </Box>
    </>
  );
}

/* ----------------- Action sheet (inline) ----------------- */
function ActionSheet(props) {
  const {
    onClose,

    micOn, camOn, screenOn, recording,
    setMicOn, setCamOn, setScreenOn, setRecording,
    setLeaveOpen,

    viewMode, setViewMode,
    setOpenChat, setOpenRoster, setOpenInvite,
    state, togglePause,
    fullscreen, toggleFullscreen,
    role, endForAll,
    timerLabel,
  } = props;

  const theme = useTheme();
  const paused = String(state || "").toLowerCase() === "paused";

  const GridItem = ({ icon, title, desc, onClick, disabled }) => (
    <ButtonBase
      disabled={disabled}
      onClick={async () => {
        await onClick?.();
        onClose?.();
      }}
      sx={{
        textAlign: "left",
        width: "100%",
        borderRadius: 2,
        p: 1,
        alignItems: "flex-start",
        display: "grid",
        gridTemplateColumns: "30px 1fr",
        gap: 1,
        opacity: disabled ? 0.55 : 1,
        "&:hover": { bgcolor: disabled ? "transparent" : alpha(theme.palette.primary.main, 0.06) },
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: 1,
          display: "grid",
          placeItems: "center",
          bgcolor: alpha(theme.palette.primary.main, 0.12),
          color: theme.palette.primary.main,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography fontWeight={700} sx={{ lineHeight: 1.15 }} noWrap>
          {title}
        </Typography>
        {!!desc && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            {desc}
          </Typography>
        )}
      </Box>
    </ButtonBase>
  );

  const QuickItem = ({ icon, label, color, onClick }) => (
    <ButtonBase
      onClick={async () => {
        await onClick?.();
        onClose?.();
      }}
      sx={{
        borderRadius: 2,
        px: 1,
        py: 1,
        display: "grid",
        placeItems: "center",
        gap: 0.5,
        minWidth: 72,
        "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.06) },
      }}
    >
      <Box sx={{ color }}>{icon}</Box>
      <Typography variant="caption" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
    </ButtonBase>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 1,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: alpha(theme.palette.background.paper, 0.96),
        backdropFilter: "saturate(120%) blur(8px)",
        minWidth: 380,
        maxWidth: 680,
        mx: "auto",
        p: 1.25,
        pointerEvents: "auto",
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 0.5, pb: 0.75 }}>
        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="subtitle2" fontWeight={800}>Controls</Typography>
          <Chip
            size="small"
            icon={<TimerIcon size={14} />}
            label={timerLabel || "00:00"}
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.12) }}
          />
          {recording && (
            <Chip size="small" color="error" icon={<CircleDot size={14} />} label="REC" sx={{ fontWeight: 700 }} />
          )}
        </Stack>
        <Tooltip title="Collapse">
          <IconButton size="small" onClick={onClose}>
            <Minimize2 size={18} />
          </IconButton>
        </Tooltip>
      </Stack>

      <Divider sx={{ mb: 1 }} />

      {/* Main actions */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1,
          px: 0.25,
        }}
      >
        <GridItem
          icon={<LayoutGrid size={16} />}
          title={viewMode === "stage" ? "Switch to Grid view" : "Switch to Stage view"}
          desc={viewMode === "stage" ? "See everyone equally." : "Focus the stage and keep others smaller."}
          onClick={() => setViewMode((v) => (v === "stage" ? "grid" : "stage"))}
        />
        <GridItem icon={<MessageSquare size={16} />} title="Open chat" desc="Send a message to everyone." onClick={() => setOpenChat(true)} />
        <GridItem icon={<Users size={16} />} title="Open people" desc="View participants and lobby." onClick={() => setOpenRoster(true)} />
        <GridItem icon={<Users size={16} />} title="Invite participant" desc="Send an invite via email or phone." onClick={() => setOpenInvite?.(true)} />
        <GridItem
          icon={paused ? <Play size={16} /> : <Pause size={16} />}
          title={paused ? "Resume meeting" : "Pause meeting"}
          desc={paused ? "Continue the session." : "Temporarily pause for everyone."}
          onClick={() => togglePause()}
        />
        <GridItem
          icon={fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          title={fullscreen ? "Exit full screen" : "Go full screen"}
          desc={fullscreen ? "Return to windowed view." : "Fill the screen for fewer distractions."}
          onClick={() => toggleFullscreen()}
        />
        <GridItem icon={<Copy size={16} />} title="Copy meeting link" desc="Share this link to invite others." onClick={() => navigator.clipboard?.writeText?.(window.location.href)} />
        <Box sx={{ display: { xs: "none", sm: "block" } }} />
      </Box>

      {/* Footer quick bar */}
      <Divider sx={{ my: 1 }} />
      <Stack direction="row" alignItems="stretch" justifyContent="space-between" sx={{ px: 0.5, flexWrap: "wrap", rowGap: 0.5 }}>
        <QuickItem icon={micOn ? <Mic /> : <MicOff />} label={micOn ? "Mute" : "Unmute"} color={theme.palette.primary.main} onClick={() => setMicOn((v) => !v)} />
        <QuickItem icon={camOn ? <Cam /> : <VideoOff />} label={camOn ? "Cam off" : "Cam on"} color={theme.palette.primary.main} onClick={() => setCamOn((v) => !v)} />
        <QuickItem icon={<MonitorUp />} label={screenOn ? "Stop share" : "Share"} color={theme.palette.primary.main} onClick={() => setScreenOn((v) => !v)} />
        <QuickItem icon={<Hand />} label="Hand" color={theme.palette.primary.main} onClick={() => {}} />
        <QuickItem icon={<CircleDot />} label={recording ? "Stop rec" : "Record"} color={recording ? theme.palette.error.main : theme.palette.primary.main} onClick={() => setRecording((v) => !v)} />
        <QuickItem icon={<Phone />} label={role === "host" ? "End for all" : "Leave"} color={theme.palette.error.main} onClick={role === "host" ? endForAll : () => setLeaveOpen(true)} />
      </Stack>
    </Paper>
  );
}

/* ----------------- Back-compat stub ----------------- */
export function MoreMenu() {
  return null;
}
