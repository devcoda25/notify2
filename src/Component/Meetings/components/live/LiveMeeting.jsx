// Path: /src/Component/Meetings/components/live/LiveMeeting.jsx
import React, { useMemo, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Play, PhoneOff } from "lucide-react";

import HeaderBar, { ChatDrawer, RosterDrawer, InviteDrawer } from "./views";
import { StageView, GridView, AllMembersDialog } from "./sections/LivePausedSection";
import { FloatingControls } from "./sections/ControlsAndMenu";

const fmt = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

export default function LiveMeeting({
  state = "live",
  viewMode,
  setViewMode,

  micOn,
  camOn,
  screenOn,
  recState = "idle",
  meetingSeconds = 0,
  recordSeconds = 0,
  screenStream = null,

  setMicOn = () => {},
  setCamOn = () => {},
  setScreenOn = () => {},
  setRecording = () => {},

  onRecordPause = () => {},
  onRecordResume = () => {},
  onRecordStop = () => {},
  togglePause = () => {},

  fullscreen = false,
  toggleFullscreen = () => {},
  role = "host",
  endForAll = () => {},
  setLeaveOpen = () => {},

  onToggleMicFor = () => {},
  onToggleCamFor = () => {},
  onEject = () => {},

  participants = [],

  onInviteEmail = (p) => console.log("invite email", p),
  onInvitePhone = (p) => console.log("invite phone", p),

  roomId = "—",
  host = "—",
  title = "Meeting name/title",
}) {
  const liveAreaRef = useRef(null);
  const mainPaneRef = useRef(null);

  const [overlay, setOverlay] = useState(null);
  const open = (key) => setOverlay(key);
  const close = () => setOverlay(null);

  const chatOpen = overlay === "chat";
  const rosterOpen = overlay === "roster";
  const inviteOpen = overlay === "invite";
  const openAll = overlay === "all";
  const actionsOpen = overlay === "actions";

  const [messages, setMessages] = useState([
    { from: "Jessica", text: "Hi everyone!" },
    { from: "Host", text: "Welcome 👋" },
  ]);
  const [draft, setDraft] = useState("");
  const sendMessage = () => {
    const t = draft.trim();
    if (!t) return;
    setMessages((m) => m.concat({ from: "You", text: t }));
    setDraft("");
  };

  const self = useMemo(
    () => participants.find((p) => p.isYou || p.isSelf || /you/i.test(p.name || "")) || null,
    [participants]
  );

  const [pinned, setPinned] = useState(null);

  // Adapters: map local/filtered participant back to original array index
  const toggleMicP = (p, i) => {
    const idx = typeof i === "number" && i >= 0 ? i : participants.findIndex((x) => x?.name === p?.name);
    onToggleMicFor?.(p, idx);
  };
  const toggleCamP = (p, i) => {
    const idx = typeof i === "number" && i >= 0 ? i : participants.findIndex((x) => x?.name === p?.name);
    onToggleCamFor?.(p, idx);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100%",
        display: "grid",
        gridTemplateRows: "auto minmax(0, 1fr)",
        bgcolor: "background.default",
        minWidth: 0,
      }}
    >
      <HeaderBar
        isImmersive
        state={state}
        roomId={roomId}
        host={host}
        title={title}
        viewMode={viewMode}
        setViewMode={(m) => {
          setViewMode(m);
          if (overlay) close();
        }}
        onOpenChat={() => open("chat")}
        onOpenRoster={() => open("roster")}
        onOpenInvite={() => open("invite")}
        meetingSeconds={meetingSeconds}
        recordSeconds={recordSeconds}
        recordState={recState}
        onPause={onRecordPause}
        onResume={onRecordResume}
        onStop={() => {
          onRecordStop();
          if (overlay) close();
        }}
      />

      <Box
        ref={liveAreaRef}
        sx={{
          minHeight: 0,
          height: "100%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box ref={mainPaneRef} sx={{ flex: 1, minHeight: 0, position: "relative" }}>
          {viewMode === "stage" || screenOn ? (
            <StageView
              participants={participants.filter((p) => p.name !== self?.name)}
              recording={recState === "recording"}
              cardBorder={(t) => `1px solid ${t.palette.divider}`}
              screenStream={screenStream}
              self={self}
              pinned={pinned}
              canEject={role === "host"}
              onEject={onEject}
              onToggleMic={toggleMicP}
              onToggleCam={toggleCamP}
              containerRef={mainPaneRef}
              onOpenAll={() => open("all")}
            />
          ) : (
            <GridView
              participants={participants}
              self={self}
              pinned={pinned}
              onPinParticipant={setPinned}
              canEject={role === "host"}
              onEject={onEject}
              onToggleMic={toggleMicP}
              onToggleCam={toggleCamP}
              containerRef={mainPaneRef}
              onOpenAll={() => open("all")}
            />
          )}

          {/* Paused overlay — always visible on top when paused */}
          {state === "paused" && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 6,
                bgcolor: (t) => alpha(t.palette.background.default, 0.65),
                backdropFilter: "blur(2px)",
                display: "grid",
                placeItems: "center",
                p: 2,
              }}
            >
              <Stack alignItems="center" spacing={1.5}>
                <Typography variant="h5" fontWeight={800}>
                  Live Paused
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 560, textAlign: "center" }}>
                  The genius behind the scenes will be right back—probably brewing coffee or solving world problems!
                </Typography>
                <Stack direction="row" gap={1}>
                  <Button variant="contained" onClick={onRecordResume} startIcon={<Play />}>
                    Resume
                  </Button>
                  <Button variant="outlined" onClick={() => endForAll()} startIcon={<PhoneOff />}>
                    Leave
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>

      <FloatingControls
        key={actionsOpen ? "fc-open" : "fc-closed"}
        visible
        micOn={micOn}
        camOn={camOn}
        screenOn={screenOn}
        recording={recState === "recording" || recState === "paused"}
        setMicOn={(v) => {
          setMicOn(v);
          if (overlay) close();
        }}
        setCamOn={(v) => {
          setCamOn(v);
          if (overlay) close();
        }}
        setScreenOn={(v) => {
          setScreenOn(v);
          if (overlay) close();
        }}
        setRecording={(v) => {
          setRecording(v);
          if (overlay) close();
        }}
        openActions={() => open("actions")}
        closeActions={close}
        setLeaveOpen={(v) => {
          setLeaveOpen(v);
          if (v) open("actions");
          else close();
        }}
        viewMode={viewMode}
        setViewMode={(m) => {
          setViewMode(m);
          if (overlay) close();
        }}
        setOpenChat={() => open("chat")}
        setOpenRoster={() => open("roster")}
        setOpenInvite={() => open("invite")}
        state={state}
        togglePause={() => {
          togglePause();
          if (overlay) close();
        }}
        fullscreen={fullscreen}
        toggleFullscreen={() => {
          toggleFullscreen();
          if (overlay) close();
        }}
        role={role}
        endForAll={() => {
          endForAll();
          if (overlay) close();
        }}
        timerLabel={fmt(meetingSeconds)}
      />

      <ChatDrawer
        open={chatOpen}
        onClose={close}
        messages={messages}
        draft={draft}
        setDraft={setDraft}
        onSend={sendMessage}
        selfName="You"
      />
      <RosterDrawer
        open={rosterOpen}
        onClose={close}
        participants={participants}
        role={role}
        waiting={[]}
        admit={(name) => {}}
        reject={(name) => {}}
        onToggleMic={onToggleMicFor}
        onToggleCam={onToggleCamFor}
      />
      <InviteDrawer open={inviteOpen} onClose={close} onInviteEmail={onInviteEmail} onInvitePhone={onInvitePhone} />
      <AllMembersDialog
        open={openAll}
        onClose={close}
        participants={participants}
        onToggleMic={onToggleMicFor}
        onToggleCam={onToggleCamFor}
        onEject={onEject}
        canEject
      />
    </Box>
  );
}
