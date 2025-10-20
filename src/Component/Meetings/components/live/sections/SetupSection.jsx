// /src/Component/Meetings/components/live/sections/SetupSection.jsx
import React from "react";
import { Box, Stack, Paper, Typography, Button, Chip, TextField, MenuItem, FormControlLabel, Switch, ToggleButtonGroup, ToggleButton, Tooltip, IconButton, LinearProgress } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Wifi, Phone, Volume2, Copy, X } from "lucide-react";

export function SetupSection({
  callType, setCallType,
  cams, mics, spks,
  selectedCam, setSelectedCam,
  selectedMic, setSelectedMic,
  selectedSpk, setSelectedSpk,
  micOn, setMicOn,
  camOn, setCamOn,
  proceedFromSetup,
  cardBorder,
  ccCountry,
  callCenterNumber,
  mediaErr,
  audioPreviewRef,
  videoRef,
  level,
}) {
  const theme = useTheme();

  // small speaker test (purely local)
  const playBeep = async () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.value = 0.06;
      osc.connect(gain);
      const dest = ctx.createMediaStreamDestination();
      gain.connect(dest);
      const el = audioPreviewRef.current;
      if (el) {
        el.srcObject = dest.stream;
        if (typeof el.setSinkId === "function" && selectedSpk) {
          await el.setSinkId(selectedSpk).catch(() => {});
        }
        await el.play().catch(() => {});
      }
      osc.start();
      setTimeout(() => {
        osc.stop();
        if (el) el.srcObject = null;
      }, 400);
    } catch {}
  };

  return (
    <Stack gap={2}>
      {/* 2 columns, equal heights */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, alignItems: "stretch" }}>
        {/* LEFT — Call & Devices */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: cardBorder, display: "flex", flexDirection: "column", height: "100%" }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>Setup: Call & Devices</Typography>

          <ToggleButtonGroup color="primary" exclusive value={callType} onChange={(_, v) => v && setCallType(v)} sx={{ mb: 2 }}>
            <ToggleButton value="internet"><Wifi size={16} style={{ marginRight: 8 }} /> Internet Call</ToggleButton>
            <ToggleButton value="callcenter"><Phone size={16} style={{ marginRight: 8 }} /> Cellular Call</ToggleButton>
          </ToggleButtonGroup>

          {/* Internet Call details card */}
          {callType === "internet" && (
            <Paper variant="outlined" sx={{ p: 1.5, mb: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 1 }}>
                <Chip size="small" label="WebRTC" />
                <Typography variant="caption" color="text.secondary">Using your device’s camera, mic & speakers</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">Browser: {navigator.userAgent.split(") ").pop() || "Unknown"}</Typography>
              <Typography variant="caption" color="text.secondary">Grant permissions and select devices below.</Typography>
            </Paper>
          )}

          {/* Call Center display card (read-only number) */}
          {callType === "callcenter" && (
            <Paper variant="outlined" sx={{ p: 1.5, mb: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Stack direction="row" gap={1} alignItems="center">
                  <Chip size="small" label={`Call Center • ${ccCountry.iso}`} />
                  <Typography variant="caption" color="text.secondary">System-assigned outbound line</Typography>
                </Stack>
                <Tooltip title="Copy number">
                  <IconButton size="small" onClick={() => navigator.clipboard?.writeText(callCenterNumber)}>
                    <Copy size={16} />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>{callCenterNumber}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Country: {ccCountry.label} ({ccCountry.dial})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Calls originate from this line. You still choose your microphone & speakers below.
              </Typography>
            </Paper>
          )}

          {/* Device selectors (camera only for Internet Call) */}
          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            {callType === "internet" && (
              <TextField select fullWidth label="Camera" value={selectedCam} onChange={(e) => setSelectedCam(e.target.value)}>
                {cams.length ? cams.map((d) => <MenuItem key={d.deviceId} value={d.deviceId}>{d.label || "Camera"}</MenuItem>) : <MenuItem value="">No cameras found</MenuItem>}
              </TextField>
            )}

            <TextField select fullWidth label="Microphone" value={selectedMic} onChange={(e) => setSelectedMic(e.target.value)}>
              {mics.length ? mics.map((d) => <MenuItem key={d.deviceId} value={d.deviceId}>{d.label || "Microphone"}</MenuItem>) : <MenuItem value="">No microphones found</MenuItem>}
            </TextField>

            <TextField select fullWidth label="Speakers" value={selectedSpk} onChange={(e) => setSelectedSpk(e.target.value)}>
              {spks.length ? spks.map((d) => <MenuItem key={d.deviceId} value={d.deviceId}>{d.label || "Speakers"}</MenuItem>) : <MenuItem value="">No speakers found</MenuItem>}
            </TextField>
          </Stack>

          <Stack direction="row" gap={2} alignItems="center" sx={{ mt: 2, flexWrap: "wrap" }}>
            <FormControlLabel control={<Switch checked={micOn} onChange={(_, v) => setMicOn(v)} />} label={micOn ? "Mic on" : "Mic off"} />
            {callType === "internet" && (
              <FormControlLabel control={<Switch checked={camOn} onChange={(_, v) => setCamOn(v)} />} label={camOn ? "Camera on" : "Camera off"} />
            )}
            <Button size="small" startIcon={<Volume2 size={16} />} onClick={playBeep}>Test speakers</Button>
            <audio ref={audioPreviewRef} hidden />
          </Stack>

          {mediaErr && <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>{mediaErr}</Typography>}

          {/* Footer actions */}
          <Stack direction="row" gap={1} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => window.history.back()} startIcon={<X size={16} />}>Close</Button>
            <Button variant="contained" onClick={proceedFromSetup}>Continue</Button>
          </Stack>
        </Paper>

        {/* RIGHT — Preview (same height as left) */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: cardBorder, display: "flex", flexDirection: "column", height: "100%" }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>Preview</Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, minHeight: 0 }}>
            {callType === "internet" && camOn ? (
              <Box sx={{ flex: 1, minHeight: 140, borderRadius: 2, overflow: "hidden", border: `1px solid ${theme.palette.divider}`, bgcolor: (t) => t.palette.grey[100], display: "grid" }}>
                <video ref={videoRef} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", backgroundColor: "transparent" }} />
              </Box>
            ) : (
              <Box sx={{ flex: 1, minHeight: 140, border: `1px dashed ${theme.palette.divider}`, borderRadius: 2, p: 2, display: "grid", placeItems: "center", bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                <Typography color="text.secondary">
                  {callType === "callcenter" ? "Voice-only (Call Center) — no camera preview" : "Camera is off"}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography variant="caption" color="text.secondary">Mic level</Typography>
              <LinearProgress variant="determinate" value={micOn ? level : 0} sx={{ height: 6, borderRadius: 999 }} />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Stack>
  );
}
