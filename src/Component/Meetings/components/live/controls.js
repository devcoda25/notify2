// Path: /src/Component/Meetings/live/controls.js
import React from "react";
import { Paper, Stack, Tooltip, IconButton, Divider, Button } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  MoreHorizontal,
  Mic, MicOff,
  Video as Cam, VideoOff,
  MonitorUp,
  Hand,
  CircleDot,
  Phone, // red hangup, no slash
} from "lucide-react";

/**
 * PillControls
 * - Set `compact` to true when your full actions panel is open to avoid duplicates.
 *   In compact mode we show only: More • End
 */
export function PillControls({
  micOn, camOn, screenOn, recording,
  onMic, onCam, onScreen, onRecord,
  onMoreOpen, onHand, onLeave,
  compact = false,
}) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 999,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: alpha(theme.palette.background.paper, 0.92),
        backdropFilter: "saturate(120%) blur(6px)",
        px: 1,
      }}
    >
      <Stack direction="row" alignItems="center" gap={0.25} sx={{ p: 0.5 }}>
        {/* More / Expand */}
        <Tooltip title="More">
          <IconButton onClick={onMoreOpen} aria-label="Open more actions">
            <MoreHorizontal />
          </IconButton>
        </Tooltip>

        {/* Main quick actions (hidden when compact to avoid repetition) */}
        {!compact && (
          <>
            <Tooltip title={micOn ? "Mute" : "Unmute"}>
              <IconButton onClick={onMic} aria-label={micOn ? "Mute microphone" : "Unmute microphone"}>
                {micOn ? <Mic /> : <MicOff />}
              </IconButton>
            </Tooltip>

            <Tooltip title={camOn ? "Turn camera off" : "Turn camera on"}>
              <IconButton onClick={onCam} aria-label={camOn ? "Turn camera off" : "Turn camera on"}>
                {camOn ? <Cam /> : <VideoOff />}
              </IconButton>
            </Tooltip>

            <Tooltip title={screenOn ? "Stop sharing" : "Share screen"}>
              <IconButton onClick={onScreen} aria-label={screenOn ? "Stop screen share" : "Start screen share"}>
                <MonitorUp />
              </IconButton>
            </Tooltip>

            <Tooltip title="Raise hand">
              <IconButton onClick={onHand} aria-label="Raise hand">
                <Hand />
              </IconButton>
            </Tooltip>

            <Tooltip title={recording ? "Stop recording" : "Start recording"}>
              <IconButton
                onClick={onRecord}
                color={recording ? "error" : "default"}
                aria-label={recording ? "Stop recording" : "Start recording"}
              >
                <CircleDot />
              </IconButton>
            </Tooltip>
          </>
        )}

        <Divider flexItem sx={{ mx: 0.5 }} orientation="vertical" />

        {/* End / Leave — always available; red phone (no slash) */}
        <Button
          variant="contained"
          color="error"
          onClick={onLeave}
          sx={{ borderRadius: 999 }}
          startIcon={<Phone size={16} />}
        >
          End
        </Button>
      </Stack>
    </Paper>
  );
}
