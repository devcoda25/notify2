import React, { useMemo, useRef, useState, useEffect } from "react";
import { Box, Paper, Divider, Button, Typography, Dialog, Stack } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { STATES } from "./live/core";
import { SetupSection } from "./live/sections/SetupSection";
import { LobbySection } from "./live/sections/LobbySection";
import LiveMeeting from "./live/LiveMeeting";

import useLiveSync from "../public/live-sync/useLiveSync";

/* Country helper (display-only) */
const COUNTRY_OPTIONS = [
  { iso: "UG", dial: "+256", label: "Uganda" },
  { iso: "KE", dial: "+254", label: "Kenya" },
  { iso: "TZ", dial: "+255", label: "Tanzania" },
  { iso: "RW", dial: "+250", label: "Rwanda" },
  { iso: "BI", dial: "+257", label: "Burundi" },
  { iso: "CD", dial: "+243", label: "DR Congo" },
  { iso: "US", dial: "+1", label: "United States" },
  { iso: "GB", dial: "+44", label: "United Kingdom" },
  { iso: "IN", dial: "+91", label: "India" },
];
const detectCountryByE164 = (e164) => {
  if (!e164) return COUNTRY_OPTIONS[0];
  const sorted = [...COUNTRY_OPTIONS].sort((a, b) => b.dial.length - a.dial.length);
  return sorted.find((c) => e164.startsWith(c.dial)) || COUNTRY_OPTIONS[0];
};

// 👇 Set this to the number of OTHER people (not counting you).
const FAKE_COUNT = 7;

const makeFake = (i) => {
  const names = ["Alex","Bree","Chris","Dev","Eli","Fran","Gabe","Hana","Ivan","Jade","Kai","Liam","Mia","Nora","Omar","Pia","Quin","Rae","Sol","Tess","Uma","Vic","Wes","Yara","Zed"];
  return { name: `${names[i % names.length]} ${i + 1}`, gender: i % 2 ? "m" : "f", camOff: i % 3 === 0, muted: i % 2 === 0 };
};

export default function LiveApp({
  roomId,
  role = "host",
  host = "alpha",
  displayName = "Guest",
  callCenterNumber = "+256700123456",
}) {
  const theme = useTheme();
  const navigate = useNavigate();

  /* ---------------- core state ---------------- */
  const [state, setState] = useState(STATES.SETUP);     // SETUP | LOBBY | LIVE | PAUSED | ENDED | ...
  const [viewMode, setViewMode] = useState("stage");    // "stage" | "grid"
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const [screenOn, setScreenOn] = useState(false);
  const screenStreamRef = useRef(null);

  const [recState, setRecState] = useState("idle"); // "idle" | "recording" | "paused"
  const [meetingSeconds, setMeetingSeconds] = useState(0);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [meetingStartAt, setMeetingStartAt] = useState(null);
  const recActiveStartRef = useRef(null);
  const [recAccumMs, setRecAccumMs] = useState(0);

  const [fullscreen, setFullscreen] = useState(false);
  const [reason, setReason] = useState("");
  const [callType, setCallType] = useState("internet"); // "internet" | "callcenter"

  /* devices for SetupSection */
  const [cams, setCams] = useState([]);
  const [mics, setMics] = useState([]);
  const [spks, setSpks] = useState([]);
  const [selectedCam, setSelectedCam] = useState("");
  const [selectedMic, setSelectedMic] = useState("");
  const [selectedSpk, setSelectedSpk] = useState("");
  const [mediaErr, setMediaErr] = useState("");

  const [leaveOpen, setLeaveOpen] = useState(false);
  const [waiting, setWaiting] = useState(["Chris", "Taylor"]);

  /* ---------------- participants: EXACT others count ---------------- */
  const others = useMemo(() => {
    // Start with N fakes
    const base = Array.from({ length: FAKE_COUNT }, (_, i) => makeFake(i));

    // If you're not the host, make sure the "host" occupies one of the slots (replace first).
    if (role !== "host" && FAKE_COUNT > 0) {
      base[0] = { name: host, gender: "f", camOff: callType === "callcenter", muted: false };
    }

    // If you ARE the host, do NOT add a separate host participant (you are self).
    return base;
  }, [role, host, callType]);

  // Final list for LiveMeeting. Self is included ONCE with isYou=true.
  const participants = useMemo(() => {
    const self = {
      name: displayName,
      gender: "m",
      camOff: callType === "callcenter" ? true : !camOn,
      muted:  callType === "callcenter" ? false : !micOn,
      isYou: true,
    };

    if (state === STATES.LIVE || state === STATES.PAUSED) return [self, ...others];
    if (state === STATES.LOBBY) return [self];
    return [];
  }, [state, displayName, camOn, micOn, callType, others]);

  /* ---------- device enumeration for Setup ---------- */
  const videoRef = useRef(null);
  const audioPreviewRef = useRef(null);
  const currentStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micSourceRef = useRef(null);
  const rafRef = useRef(null);
  const meterTokenRef = useRef(0);
  const [level, setLevel] = useState(0);

  const enumerate = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const list = await navigator.mediaDevices.enumerateDevices();
    const _cams = list.filter((d) => d.kind === "videoinput");
    const _mics = list.filter((d) => d.kind === "audioinput");
    const _spks = list.filter((d) => d.kind === "audiooutput");
    setCams(_cams); setMics(_mics); setSpks(_spks);
    if (!selectedCam && _cams[0]) setSelectedCam(_cams[0].deviceId);
    if (!selectedMic && _mics[0]) setSelectedMic(_mics[0].deviceId);
    if (!selectedSpk && _spks[0]) setSelectedSpk(_spks[0].deviceId);
  };

  useEffect(() => {
    (async () => {
      try {
        const tmp = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        tmp.getTracks().forEach((t) => t.stop());
      } catch {}
      try { await enumerate(); } catch {}
    })();
    const onChange = () => enumerate();
    navigator.mediaDevices?.addEventListener?.("devicechange", onChange);
    return () => navigator.mediaDevices?.removeEventListener?.("devicechange", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCurrentStream = () => {
    meterTokenRef.current += 1;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    try { micSourceRef.current?.disconnect(); } catch {}
    try { analyserRef.current?.disconnect(); } catch {}
    micSourceRef.current = null; analyserRef.current = null;
    const s = currentStreamRef.current;
    if (s) s.getTracks().forEach((t) => t.stop());
    currentStreamRef.current = null;
  };

  const startMicMeter = (stream) => {
    try {
      const token = ++meterTokenRef.current;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = audioContextRef.current || (Ctx ? new Ctx() : null);
      const ctx = audioContextRef.current; if (!ctx) return;
      const analyser = ctx.createAnalyser(); analyser.fftSize = 512;
      const micSource = ctx.createMediaStreamSource(stream);
      micSource.connect(analyser); analyserRef.current = analyser; micSourceRef.current = micSource;
      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        if (meterTokenRef.current !== token) return;
        analyser.getByteTimeDomainData(data);
        let sum = 0; for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
        const rms = Math.sqrt(sum / data.length);
        setLevel(Math.min(100, Math.round(rms * 160)));
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch {}
  };

  const startStream = async () => {
    stopCurrentStream();
    setMediaErr("");
    try {
      const wantVideo = callType === "internet" && camOn;
      const wantAudio = micOn;
      const constraints = {
        video: wantVideo ? { deviceId: selectedCam ? { exact: selectedCam } : undefined, width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        audio: wantAudio ? { deviceId: selectedMic ? { exact: selectedMic } : undefined, echoCancellation: true, noiseSuppression: true } : false,
      };
      if (!constraints.video && !constraints.audio) { if (videoRef.current) videoRef.current.srcObject = null; return; }
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      currentStreamRef.current = stream;
      if (videoRef.current) {
        if (constraints.video) { videoRef.current.srcObject = stream; await videoRef.current.play().catch(() => {}); }
        else { videoRef.current.srcObject = null; }
      }
      if (constraints.audio) startMicMeter(stream);
    } catch (e) { setMediaErr(e?.message || "Could not access media devices."); }
  };

  useEffect(() => { startStream(); }, [callType, camOn, micOn, selectedCam, selectedMic]);
  useEffect(() => {
    const el = audioPreviewRef.current;
    if (!el || !selectedSpk) return;
    if (typeof el.setSinkId === "function") el.setSinkId(selectedSpk).catch(() => {});
  }, [selectedSpk]);
  useEffect(() => () => stopCurrentStream(), []);

  /* ---------------- LIVE actions ---------------- */

  // sync bridge: converts external "LIVE"/"PAUSED"/"ENDED" -> our STATES enum
  const sync = useLiveSync(roomId, role, {
    setMeetingState: (s) => {
      const map = { LIVE: STATES.LIVE, PAUSED: STATES.PAUSED, ENDED: STATES.ENDED, LOBBY: STATES.LOBBY, SETUP: STATES.SETUP };
      setState(map[s] || s);
    },
    setMeetingStartAt: (ts) => setMeetingStartAt(ts),
    setRecState: (r) => setRecState(r),
    setScreenOnBool: (fnOrBool) => setScreenOnBool(fnOrBool),
  });

  const proceedFromSetup = () => setState(STATES.LOBBY);
  const hostAdmits = () => { sync.host.start(); };
  const joinLiveDirect = () => { sync.host.start(); };
  const togglePause = () => {
    setState((curr) => {
      const next = curr === STATES.PAUSED ? STATES.LIVE : STATES.PAUSED;
      if (next === STATES.LIVE) sync.host.resume(); else sync.host.pause();
      return next;
    });
  };

  const hasNavigatedRef = useRef(false);
  const cleanupAndNavigateLeft = (why) => {
    setReason(why || "");
    try { stopCurrentStream(); } catch {}
    try { if (screenOn) stopScreenShare(); } catch {}
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch {}
    if (!hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      navigate(`/live/${roomId}/left`, { replace: true, state: { reason: why || "" } });
    }
  };
  const leaveMeeting = () => { setState(STATES.ENDED); cleanupAndNavigateLeft("You left the meeting."); };
  const endForAll = () => { sync.host.end(); cleanupAndNavigateLeft("Host ended the meeting for everyone."); };
  const simulate = (s, r = "") => { setReason(r); setState(s); };

  const admit = (name) => setWaiting((w) => w.filter((x) => x !== name));
  const reject = (name) => setWaiting((w) => w.filter((x) => x !== name));

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) { await document.exitFullscreen(); setFullscreen(false); }
      else { await document.documentElement.requestFullscreen(); setFullscreen(true); }
    } catch {}
  };

  /* ---------------- timers (meeting + recording) ---------------- */
  useEffect(() => {
    const id = setInterval(() => {
      if (meetingStartAt) setMeetingSeconds(Math.floor((Date.now() - meetingStartAt) / 1000));
      if (recState === "recording" && recActiveStartRef.current) {
        const runningMs = Date.now() - recActiveStartRef.current;
        setRecordSeconds(Math.floor((recAccumMs + runningMs) / 1000));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [meetingStartAt, recState, recAccumMs]);

  const startRecording = () => {
    if (recState !== "idle") return;
    setRecState("recording");
    recActiveStartRef.current = Date.now();
    setRecAccumMs(0);
    setRecordSeconds(0);
  };
  const pauseRecording = () => {
    if (recState !== "recording" || !recActiveStartRef.current) return;
    const add = Date.now() - recActiveStartRef.current;
    setRecAccumMs((ms) => ms + add);
    recActiveStartRef.current = null;
    setRecState("paused");
  };
  const resumeRecording = () => {
    if (recState !== "paused") return;
    recActiveStartRef.current = Date.now();
    setRecState("recording");
  };
  const stopRecording = () => {
    setRecState("idle");
    recActiveStartRef.current = null;
    setRecAccumMs(0);
    setRecordSeconds(0);
  };
  const setRecordingBool = (nextOrFn) => {
    setRecState((prev) => {
      const wasOn = prev !== "idle";
      const wantOn = typeof nextOrFn === "function" ? !!nextOrFn(wasOn) : !!nextOrFn;
      if (wantOn === wasOn) return prev;
      if (wantOn) { sync.host.recStart(); return "recording"; }
      sync.host.recStop(); return "idle";
    });
  };

  /* ---------------- screen share ---------------- */
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      screenStreamRef.current = stream;
      setScreenOn(true);
      const [track] = stream.getVideoTracks();
      if (track) track.onended = () => stopScreenShare();
    } catch {
      setScreenOn(false);
      screenStreamRef.current = null;
    }
  };
  const stopScreenShare = () => {
    const s = screenStreamRef.current;
    if (s) s.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    setScreenOn(false);
  };
  const setScreenOnBool = (nextOrFn) => {
    setScreenOn((prev) => {
      const next = typeof nextOrFn === "function" ? !!nextOrFn(prev) : !!nextOrFn;
      if (next && !prev) { startScreenShare(); if (role === "host") sync.host.screenOn(); }
      if (!next && prev) { stopScreenShare();  if (role === "host") sync.host.screenOff(); }
      return next;
    });
  };

  const ccCountry = detectCountryByE164(callCenterNumber);
  const isImmersive = state === STATES.LIVE || state === STATES.PAUSED;
  const softBg = alpha(theme.palette.primary.main, 0.03);

  useEffect(() => {
    if (state === STATES.ENDED || state === STATES.ERROR || state === STATES.TIMEOUT) {
      if (state === STATES.ENDED) {
        cleanupAndNavigateLeft(reason || "");
      } else if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        try { stopCurrentStream(); } catch {}
        try { if (screenOn) stopScreenShare(); } catch {}
        try { if (document.fullscreenElement) document.exitFullscreen(); } catch {}
        navigate("/invalid", { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: softBg,
        ...(isImmersive
          ? { p: 0, bgcolor: "background.default" }
          : { display: "grid", placeItems: "center", px: { xs: 1.5, md: 2.5 }, py: { xs: 2, md: 4 } }),
      }}
    >
      <Paper
        elevation={0}
        sx={
          isImmersive
            ? { m: 0, borderRadius: 0, border: "none", minHeight: "100vh", display: "flex", flexDirection: "column" }
            : { width: "min(1100px, 98vw)", borderRadius: 2, border: `1px solid ${theme.palette.divider}`, p: { xs: 2, sm: 3, md: 4 }, gap: 2 }
        }
      >
        {state === STATES.SETUP && (
          <>
            <Divider sx={{ my: 1 }} />
            <SetupSection
              callType={callType}
              setCallType={setCallType}
              cams={cams}
              mics={mics}
              spks={spks}
              selectedCam={selectedCam}
              setSelectedCam={setSelectedCam}
              selectedMic={selectedMic}
              setSelectedMic={setSelectedMic}
              selectedSpk={selectedSpk}
              setSelectedSpk={setSelectedSpk}
              micOn={micOn}
              setMicOn={setMicOn}
              camOn={camOn}
              setCamOn={setCamOn}
              proceedFromSetup={() => setState(STATES.LOBBY)}
              cardBorder={`1px solid ${theme.palette.divider}`}
              ccCountry={ccCountry}
              callCenterNumber={callCenterNumber}
              mediaErr={mediaErr}
              audioPreviewRef={audioPreviewRef}
              videoRef={videoRef}
              level={level}
            />
          </>
        )}

        {state === STATES.LOBBY && (
          <LobbySection
            role={role}
            displayName={displayName}
            callType={callType}
            camOn={camOn}
            micOn={micOn}
            endForAll={endForAll}
            hostAdmits={hostAdmits}
            joinLiveDirect={joinLiveDirect}
            simulate={(s, r = "") => { setReason(r); setState(s); }}
            STATES={STATES}
            cardBorder={`1px solid ${theme.palette.divider}`}
            localStream={null}
            onToggleMic={() => setMicOn((v) => !v)}
          />
        )}

        {(state === STATES.LIVE || state === STATES.PAUSED) && (
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <LiveMeeting
              state={state === STATES.PAUSED ? "paused" : "live"}
              viewMode={viewMode}
              setViewMode={setViewMode}
              roomId={roomId}
              host={host}

              micOn={micOn}
              camOn={camOn}
              screenOn={screenOn}
              recState={recState}
              meetingSeconds={meetingSeconds}
              recordSeconds={recordSeconds}
              screenStream={screenStreamRef.current}

              setMicOn={setMicOn}
              setCamOn={setCamOn}
              setScreenOn={setScreenOnBool}
              setRecording={setRecordingBool}

              onRecordPause={() => { pauseRecording(); sync.host.recPause(); }}
              onRecordResume={() => { resumeRecording(); sync.host.recStart(); }}
              onRecordStop={() => { stopRecording(); sync.host.recStop(); }}

              togglePause={togglePause}
              fullscreen={fullscreen}
              toggleFullscreen={toggleFullscreen}
              role={role}
              endForAll={endForAll}
              setLeaveOpen={setLeaveOpen}

              onToggleMicFor={(p) => { if (p.isYou) setMicOn((v) => !v); }}
              onToggleCamFor={(p) => { if (p.isYou) setCamOn((v) => !v); }}
              onEject={() => {}}

              onInviteEmail={(payload) => console.log("invite email", payload)}
              onInvitePhone={(payload) => console.log("invite phone", payload)}

              participants={participants}
            />
          </Box>
        )}
      </Paper>

      <Dialog open={leaveOpen} onClose={() => setLeaveOpen(false)}>
        <Typography variant="h6" sx={{ px: 3, pt: 2 }}>Leave Meeting</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography sx={{ px: 3, pb: 2 }}>Are you sure you want to leave this meeting?</Typography>
        <Stack direction="row" gap={1} sx={{ px: 2, pb: 2, justifyContent: "flex-end" }}>
          <Button onClick={() => setLeaveOpen(false)}>Stay</Button>
          <Button onClick={leaveMeeting} color="error" variant="contained">Leave</Button>
        </Stack>
      </Dialog>
    </Box>
  );
}
