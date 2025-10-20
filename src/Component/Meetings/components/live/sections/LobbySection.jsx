// /src/Component/Meetings/components/live/sections/LobbySection.jsx
import React, { useEffect, useRef, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { TimerReset, ShieldAlert, WifiOff, Mic, MicOff } from "lucide-react";
import { ParticipantTile } from "../tiles";

function genderTint(g, t) {
  if (g === "f") return alpha(t.palette.secondary.main, 0.08);
  if (g === "m") return alpha(t.palette.primary.main, 0.08);
  return alpha(t.palette.info.main, 0.08);
}

/** Self tile: shows real local camera preview (if camOn & stream available) and mic state. */
function SelfPreviewTile({ name, gender = "o", camOn, micOn, localStream }) {
  const theme = useTheme();
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const hasVideo = !!(camOn && localStream && localStream.getVideoTracks?.().length);
    if (hasVideo) {
      el.srcObject = localStream;
      el.play?.().catch(() => {});
    } else if (el.srcObject) {
      el.srcObject = null;
    }
  }, [camOn, localStream]);

  const showVideo = !!(camOn && localStream && localStream.getVideoTracks?.().length);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: showVideo ? "transparent" : genderTint(gender, theme),
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {showVideo ? (
        <video
          ref={videoRef}
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            backgroundColor: theme.palette.grey[100], // soft light grey
          }}
        />
      ) : (
        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", color: "text.secondary", userSelect: "none" }}>
          <Box
            sx={{
              width: { xs: 56, sm: 72, md: 88 },
              height: { xs: 56, sm: 72, md: 88 },
              borderRadius: "50%",
              bgcolor: "background.paper",
              border: `1px solid ${theme.palette.divider}`,
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            {(name || "?").slice(0, 1).toUpperCase()}
          </Box>
          <Typography variant="caption" sx={{ mt: 1, opacity: 0.8 }}>
            {camOn ? "Camera unavailable" : "Audio only"}
          </Typography>
        </Stack>
      )}

      {/* Mic status (top-right) */}
      <Box sx={{ position: "absolute", right: 10, top: 10, zIndex: 2 }}>
        <Chip
          size="small"
          icon={micOn ? <Mic size={14} /> : <MicOff size={14} />}
          label={micOn ? "Mic on" : "Muted"}
          sx={{
            bgcolor: (t) => alpha(t.palette.background.paper, 0.9),
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: 999,
            backdropFilter: "blur(6px)",
          }}
        />
      </Box>

      {/* Identity tag (bottom-right) */}
      <Chip
        size="small"
        label="You"
        sx={{
          position: "absolute",
          right: 10,
          bottom: 10,
          zIndex: 2,
          borderRadius: 999,
          bgcolor: (t) => alpha(t.palette.background.paper, 0.9),
          border: (t) => `1px solid ${t.palette.divider}`,
          backdropFilter: "blur(6px)",
        }}
      />
    </Paper>
  );
}

export function LobbySection({
  role,
  displayName,
  callType,          // "internet" | "callcenter"
  camOn,
  micOn,
  endForAll,
  hostAdmits,
  joinLiveDirect,
  simulate,
  STATES,
  cardBorder,

  // Optional props
  others = [],          // <-- before meeting starts: default to empty (no active participants)
  waiting = [],         // names waiting to join
  leftAttempts = [],    // names who left earlier

  // Live preview & mic control
  localStream = null,   // MediaStream for real preview
  onToggleMic = () => {},
}) {
  const theme = useTheme();

  // Defaults: no active participants pre-meeting, but show join attempts
  const demoOthers = useMemo(() => [], []); // always empty in lobby before start
  const demoWaiting = waiting.length ? waiting : ["Chris", "Taylor", "Irene"];
  const demoLeft    = leftAttempts.length ? leftAttempts : ["Grace (left 2m ago)"];

  const youCamOff = callType === "callcenter" ? true : !camOn;
  const youMuted  = callType === "callcenter" ? false : !micOn;

  const friendlyMsg =
    role === "host"
      ? `You're the host — start the meeting when you're ready. ${
          demoWaiting.length ? `${demoWaiting.length} waiting in the lobby.` : "No one is waiting yet."
        }`
      : "You're in the lobby. The host will start the meeting soon. You’ll auto-join when it begins.";

  return (
    <Stack gap={2} sx={{ minHeight: 460, position: "relative" }}>
      {/* Dev/test buttons pinned top-right */}
      <Stack direction="row" gap={1} sx={{ position: "absolute", top: 0, right: 0 }}>
        <Button size="small" onClick={() => simulate(STATES.TIMEOUT, "Request timed out.")} startIcon={<TimerReset size={16} />}>
          Timeout
        </Button>
        <Button size="small" onClick={() => simulate(STATES.UNAVAILABLE, "Room not found.")} startIcon={<ShieldAlert size={16} />}>
          Unavailable
        </Button>
        <Button size="small" onClick={() => simulate(STATES.SLOW, "Network is slow.")} startIcon={<WifiOff size={16} />}>
          Slow
        </Button>
      </Stack>

      <Typography fontWeight={700}>Lobby</Typography>

      <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
        <Typography variant="body2" color="text.secondary">
          {friendlyMsg}
        </Typography>
      </Paper>

      {/* Two columns */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
          gap: 2,
          alignItems: "stretch",
        }}
      >
        {/* LEFT — You */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: cardBorder, display: "flex", flexDirection: "column" }}>
          <Box sx={{ position: "relative", height: 240, mb: 1.25 }}>
            <SelfPreviewTile
              name={displayName}
              gender="m"
              camOn={!youCamOff}
              micOn={!youMuted}
              localStream={localStream}
            />
          </Box>

          {/* Mic toggle only (as requested) */}
          <FormControlLabel
            control={
              <Switch checked={!youMuted} onChange={() => onToggleMic()} />
            }
            label={!youMuted ? "Mic on" : "Mic off"}
          />

          {/* Actions */}
          <Stack direction="row" gap={1} sx={{ mt: 1.5, flexWrap: "wrap" }}>
            {role === "host" ? (
              <>
                <Button variant="contained" onClick={hostAdmits}>Start meeting</Button>
                <Button variant="outlined" color="error" onClick={endForAll}>End for all</Button>
              </>
            ) : (
              <>
                <Button variant="contained" onClick={joinLiveDirect}>Ask to join (simulate)</Button>
                <Button variant="outlined" onClick={() => window.history.back()}>Leave</Button>
              </>
            )}
          </Stack>
        </Paper>

        {/* RIGHT — Others (none before start) + Join attempts */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: cardBorder, display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Other participants {demoOthers.length ? `(${demoOthers.length})` : "(0)"}
          </Typography>

          {/* Empty state pre-meeting */}
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              height: 140,
              border: `1px dashed ${theme.palette.divider}`,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.03),
            }}
          >
            <Typography color="text.secondary">No one is in the call yet.</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Join attempts */}
          <Stack gap={1}>
            <Typography variant="subtitle2">Join requests</Typography>
            {!demoWaiting.length && !demoLeft.length ? (
              <Typography variant="body2" color="text.secondary">No join attempts yet.</Typography>
            ) : (
              <Stack gap={0.75}>
                {demoWaiting.length > 0 && (
                  <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Waiting:</Typography>
                    {demoWaiting.map((n, i) => (
                      <Chip key={i} size="small" label={n} />
                    ))}
                  </Stack>
                )}
                {demoLeft.length > 0 && (
                  <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                      Left earlier:
                    </Typography>
                    {demoLeft.map((n, i) => (
                      <Chip key={i} size="small" variant="outlined" label={n} />
                    ))}
                  </Stack>
                )}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
