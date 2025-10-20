// Path: /src/Component/Meetings/components/DevicePreflight.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Paper,
  Stack,
  Typography,
  Divider,
  Button,
  Alert,
  FormControlLabel,
  Switch,
  TextField,
  MenuItem,
  LinearProgress,
  Box,
} from "@mui/material";
import { Camera, Mic, Power, PowerOff, RefreshCw } from "lucide-react";
import { useConferencingStore } from "../../store/scheduling/useConferencingStore";

export default function DevicePreflight() {
  const videoRef = useRef(null);
  const audioAnalyserRef = useRef(null);
  const rafRef = useRef(null);

  const { devicePrefs, setDevicePref } = useConferencingStore();
  const [err, setErr] = useState(null);
  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState({ cams: [], mics: [] });
  const [level, setLevel] = useState(0);

  const hasStream = !!stream;

  const enumerate = async () => {
    try {
      const devs = await navigator.mediaDevices.enumerateDevices();
      setDevices({
        cams: devs.filter((d) => d.kind === "videoinput"),
        mics: devs.filter((d) => d.kind === "audioinput"),
      });
    } catch (e) {
      // noop
    }
  };

  useEffect(() => {
    enumerate();
    navigator.mediaDevices?.addEventListener?.("devicechange", enumerate);
    return () =>
      navigator.mediaDevices?.removeEventListener?.("devicechange", enumerate);
  }, []);

  const start = async () => {
    setErr(null);
    try {
      const constraints = {
        video: devicePrefs.cameraId
          ? { deviceId: { exact: devicePrefs.cameraId } }
          : { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: devicePrefs.micId
          ? { deviceId: { exact: devicePrefs.micId } }
          : true,
      };
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;

      // Audio meter
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      audioAnalyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(s);
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        // Calculate simple RMS
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        setLevel(Math.min(100, Math.max(0, Math.round(rms * 140))));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      setErr(e.message || String(e));
    }
  };

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioAnalyserRef.current = null;
    stream?.getTracks()?.forEach((t) => t.stop());
    setStream(null);
    setLevel(0);
  };

  useEffect(() => () => stop(), []); // cleanup

  const videoBg = useMemo(
    () => ({ width: "100%", maxHeight: 320, background: "#0b1020", borderRadius: 8 }),
    []
  );

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 2 }}
    >
      <Stack gap={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Device Preflight
          </Typography>
          <Stack direction="row" gap={1}>
            {!hasStream ? (
              <Button startIcon={<Power />} variant="contained" onClick={start}>
                Start Test
              </Button>
            ) : (
              <Button startIcon={<PowerOff />} variant="outlined" onClick={stop}>
                Stop
              </Button>
            )}
            <Button startIcon={<RefreshCw />} onClick={enumerate}>
              Refresh
            </Button>
          </Stack>
        </Stack>

        <Divider />

        {err && (
          <Alert severity="error" onClose={() => setErr(null)}>
            {err}
          </Alert>
        )}

        <Stack direction={{ xs: "column", md: "row" }} gap={2}>
          <TextField
            select
            fullWidth
            label="Camera"
            value={devicePrefs.cameraId || ""}
            onChange={(e) => setDevicePref("cameraId", e.target.value)}
          >
            {devices.cams.length === 0 && (
              <MenuItem value="">No cameras found</MenuItem>
            )}
            {devices.cams.map((d) => (
              <MenuItem key={d.deviceId} value={d.deviceId}>
                {d.label || `Camera ${d.deviceId.slice(0, 6)}`}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Microphone"
            value={devicePrefs.micId || ""}
            onChange={(e) => setDevicePref("micId", e.target.value)}
          >
            {devices.mics.length === 0 && (
              <MenuItem value="">No microphones found</MenuItem>
            )}
            {devices.mics.map((d) => (
              <MenuItem key={d.deviceId} value={d.deviceId}>
                {d.label || `Mic ${d.deviceId.slice(0, 6)}`}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
          <FormControlLabel
            control={
              <Switch
                checked={devicePrefs.noiseSuppression}
                onChange={(_, v) => setDevicePref("noiseSuppression", v)}
              />
            }
            label="Noise suppression"
          />
          <FormControlLabel
            control={
              <Switch
                checked={devicePrefs.echoCancellation}
                onChange={(_, v) => setDevicePref("echoCancellation", v)}
              />
            }
            label="Echo cancellation"
          />
          <FormControlLabel
            control={
              <Switch
                checked={devicePrefs.autoGainControl ?? false}
                onChange={(_, v) => setDevicePref("autoGainControl", v)}
              />
            }
            label="Auto gain control"
          />
        </Stack>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={videoBg}
          poster="/assets/images/preview_header_video.png"
        />

        <Stack gap={0.5}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Mic size={16} />
            <Typography variant="caption" color="text.secondary">
              Live mic level
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={level}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption">Quiet</Typography>
            <Typography variant="caption">Loud</Typography>
          </Box>
        </Stack>

        <Stack direction="row" gap={1}>
          <Button startIcon={<Camera />} onClick={start} variant="contained" disabled={hasStream}>
            Test Camera/Mic
          </Button>
          <Button startIcon={<PowerOff />} onClick={stop} variant="outlined" disabled={!hasStream}>
            Stop
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
