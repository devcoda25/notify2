// Path: /src/Component/Meetings/views/Organize/CreateMeetingWizard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Stack, Paper, Typography, Divider, Button, Stepper, Step, StepLabel,
  TextField, MenuItem, Chip, IconButton, Alert, FormGroup, FormControlLabel,
  Checkbox, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  ChevronLeft, ChevronRight, CheckCircle2, Download, Mail, Phone, Video,
  X, Link as LinkIcon, Copy, Users, User, Tv, Circle, CheckCircle2 as RadioOn
} from "lucide-react";

import SlotPicker from "../../components/SlotPicker";
import PersonalLinkCard from "../../components/PersonalLinkCard";
import { buildICS } from "../../utils/icsClient";

import { usePoolsStore } from "../../../store/scheduling/usePoolsStore";
import { useAvailabilityStore } from "../../../store/scheduling/useAvailabilityStore";
import { useMeetingsStore } from "../../../store/scheduling/useMeetingsStore";

const steps = ["Start", "Pick a time", "Invitee details", "Confirm"];

const AGENT_ID = "usr_alpha";
const agentPublicBase = "https://cal.example.com"; // demo base
const DEFAULT_DURATION_LABEL = "30-min default";
const DEFAULT_BUFFERS_LABEL = "buffers 5/5";

function buildPublicLink(ownerType, ownerId) {
  const slug = "intro-30";
  return `${agentPublicBase}/${ownerType === "pool" ? "team" : "alpha"}/${slug}`;
}
function buildInstantLink() {
  return "https://meet.google.com/new";
}

// NEW: build /live link and open in a new tab
function makeLiveRoomId() {
  try {
    const b = new Uint8Array(8);
    crypto.getRandomValues(b);
    return [...b].map(x => x.toString(16).padStart(2, "0")).join("");
  } catch {
    return `room-${Date.now()}`;
  }
}
function buildLiveUrl({ host = "alpha" } = {}) {
  const roomId = makeLiveRoomId();
  const qs = new URLSearchParams({ host }).toString();
  return `/live/${roomId}?${qs}`;
}

export default function CreateMeetingWizard({ open = false, onClose }) {
  const theme = useTheme();
  const pools = usePoolsStore();
  const av = useAvailabilityStore();
  const mtg = useMeetingsStore();

  useEffect(() => {
    pools.loaded || pools.loadFixtures();
    av.loaded || av.loadFixtures();
    mtg.loaded || mtg.loadFixtures();
    // eslint-disable-next-line
  }, []);

  const [active, setActive] = useState(0);
  const [selectedOwner, setSelectedOwner] = useState({ ownerType: "user", ownerId: AGENT_ID });

  const slotSize = 30;
  const bufferBefore = 5;
  const bufferAfter = 5;

  const [slot, setSlot] = useState(null);
  const [invitee, setInvitee] = useState({
    name: "", email: "", phone: "", timezone: "Africa/Kampala",
  });
  const [locationPreference, setLocationPreference] = useState("google_meet");
  const [channelPrefs, setChannelPrefs] = useState({ email: true, sms: false, whatsapp: false });

  const bookingState = mtg.bookingState;
  const lastBooking = mtg.lastBooking;
  const bookingBusy = [
    "validating_input","checking_availability","reserving_slot","creating_conference","sending_notifications",
  ].includes(bookingState);

  const canNextFrom1 = !!slot;
  const canNextFrom2 = !!invitee.name && !!invitee.email;

  const next = () => setActive((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setActive((s) => Math.max(s - 1, 0));

  const doBook = async () => {
    if (!slot) return;
    await mtg.book({
      eventTypeId: "agent-default",
      host: selectedOwner,
      invitee,
      start: slot.start,
      end: slot.end,
      locationPreference,
      channelPrefs,
    });
  };

  const downloadICS = () => {
    if (!lastBooking) return;
    const ics =
      mtg.buildICSFor(lastBooking.id) ||
      buildICS({
        title: `Meeting • ${lastBooking.eventTypeId}`,
        start: lastBooking.start,
        end: lastBooking.end,
        url: lastBooking.rescheduleUrl,
        attendees: (lastBooking.attendees || []).map((a) => ({ name: a.name, email: a.email })),
      });
    const blob = new Blob([ics.text], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = ics.filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
  };

  const agentPools = useMemo(() => {
    return (pools.pools || []).filter((p) =>
      Array.isArray(p.members) ? p.members.includes(AGENT_ID) : false
    );
  }, [pools.pools]);

  const [providerDlgOpen, setProviderDlgOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("gmeet");

  const providerOptions = [
    { id: "zoom",   label: "Zoom",         desc: "Host a Zoom video call from your Zoom account.", href: "https://zoom.us/start", badge: "ZOOM",  tags: ["HD", "Recording", "Breakouts"] },
    { id: "wechat", label: "WeChat",       desc: "Start a WeChat call (app required and signed in).", href: "https://www.wechat.com/en/", badge: "WECHAT", tags: ["China-friendly", "Mobile-first"] },
    { id: "gmeet",  label: "Google Meet",  desc: "Instant Meet link — quick and simple.", href: "https://meet.google.com/new", badge: "MEET", tags: ["Easy join", "No install"] },
    { id: "notify", label: "Notify-Live",  desc: "Use the built-in Notify conferencing experience.", href: null, badge: "LIVE", tags: ["Built-in", "Lightweight"] },
  ];

  const startNow = () => setProviderDlgOpen(true);

  // NEW: always open the public Notify-Live page in a new tab
  const openNotifyLive = () => {
    const url = buildLiveUrl({ host: selectedOwner.ownerId || "alpha" });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const confirmProvider = () => {
    setProviderDlgOpen(false);
    if (selectedProvider === "notify") {
      openNotifyLive();
      return;
    }
    const opt = providerOptions.find((o) => o.id === selectedProvider);
    if (opt?.href) window.open(opt.href, "_blank", "noopener,noreferrer");
  };

  const LinkRow = ({ icon, label, url }) => (
    <Stack direction={{ xs: "column", sm: "row" }} gap={1} alignItems={{ sm: "center" }}>
      <TextField
        size="small"
        label={label}
        value={url}
        fullWidth
        InputProps={{
          readOnly: true,
          startAdornment: icon,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label="Copy link"
                onClick={async () => { try { await navigator.clipboard.writeText(url); } catch {} }}
              >
                <Copy size={16} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Stack direction="row" gap={1} sx={{ minWidth: 300, flexShrink: 0 }}>
        <Button variant="contained" onClick={startNow}>
          Start Now
        </Button>
        <Button variant="outlined" startIcon={<Tv size={16} />} onClick={openNotifyLive}>
          Notify Live
        </Button>
      </Stack>
    </Stack>
  );

  useEffect(() => {
    if (!open) {
      setActive(0);
      setSelectedOwner({ ownerType: "user", ownerId: AGENT_ID });
      setSlot(null);
      setInvitee({ name: "", email: "", phone: "", timezone: "Africa/Kampala" });
      setLocationPreference("google_meet");
      setChannelPrefs({ email: true, sms: false, whatsapp: false });
      setProviderDlgOpen(false);
      setSelectedProvider("gmeet");
    }
  }, [open]);

  const ownerChipLabel =
    selectedOwner.ownerType === "pool"
      ? `Scheduling for pool:${selectedOwner.ownerId}`
      : `Scheduling for user:${selectedOwner.ownerId}`;

  const softBg = alpha(theme.palette.primary.main, 0.03);
  const cardBorder = `1px solid ${theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[300]}`;

  const ProviderCard = ({ opt, selected, onSelect }) => (
    <Paper
      onClick={onSelect}
      variant="elevation"
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        cursor: "pointer",
        border: `1.5px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
        bgcolor: selected ? alpha(theme.palette.primary.light, 0.08) : theme.palette.background.paper,
        transition: "border-color 120ms, background 120ms",
        position: "relative",
        "&:hover": { borderColor: theme.palette.primary.main },
      }}
    >
      <Chip size="small" label={opt.badge} sx={{ position: "absolute", right: 10, top: 10, fontWeight: 700 }} />
      <Stack direction="row" alignItems="center" gap={1}>
        {selected ? <RadioOn size={20} color={theme.palette.primary.main} /> : <Circle size={20} color={theme.palette.text.disabled} />}
        <Typography variant="h6" fontWeight={800}>{opt.label}</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{opt.desc}</Typography>
      <Stack direction="row" gap={1} sx={{ mt: 1 }} flexWrap="wrap">
        {(opt.tags || []).map((t) => <Chip key={t} size="small" label={t} sx={{ bgcolor: theme.palette.action.hover }} />)}
      </Stack>
    </Paper>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" keepMounted PaperProps={{ sx: { height: { xs: "95vh", md: "90vh" }, display: "flex" } }}>
      <DialogTitle sx={{ pr: 6 }}>
        Create Meeting
        <IconButton aria-label="close" onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ overflow: "auto", p: 2 }}>
        <Stack gap={2}>
          <Stepper activeStep={active} alternativeLabel>
            {steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
          </Stepper>

          {/* STEP 0 */}
          {active === 0 && (
            <Box sx={{ p: 2, borderRadius: 2, background: softBg }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Pick how you want to meet
              </Typography>
              <Stack direction="column" gap={3}>
                <Paper variant="elevation" elevation={0} sx={{ p: 2, borderRadius: 2, border: cardBorder, background: theme.palette.background.paper }}>
                  <Stack gap={1.25}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <LinkIcon size={16} />
                      <Typography variant="subtitle2" fontWeight={700}>Instant meeting (now)</Typography>
                    </Stack>

                    <LinkRow
                      icon={<User size={14} style={{ marginRight: 6 }} />}
                      label="Your instant link"
                      url={buildInstantLink()}
                    />

                    {agentPools.length > 0 && (
                      <Stack gap={0.75} sx={{ mt: 0.5 }}>
                        {agentPools.map((p) => (
                          <LinkRow
                            key={p.id}
                            icon={<Users size={14} style={{ marginRight: 6 }} />}
                            label={`Pool: ${p.name}`}
                            url={buildInstantLink()}
                          />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Paper>

                <PersonalLinkCard
                  title="Schedule or share"
                  ownerLabel={`user:${AGENT_ID}`}
                  personalUrl={buildPublicLink("user", AGENT_ID)}
                  personalOwner={{ ownerType: "user", ownerId: AGENT_ID }}
                  poolLinks={agentPools.map((p) => ({
                    id: p.id, name: p.name, url: buildPublicLink("pool", p.id),
                    ownerType: "pool", ownerId: p.id,
                  }))}
                  onScheduleOwner={(owner) => { setSelectedOwner(owner); setActive(1); }}
                  durationLabel={DEFAULT_DURATION_LABEL}
                  buffersLabel={DEFAULT_BUFFERS_LABEL}
                  sxOverrides={{ border: cardBorder, background: theme.palette.background.paper }}
                />
              </Stack>
            </Box>
          )}

          {/* STEP 1 */}
          {active === 1 && (
            <Paper variant="elevation" elevation={0} sx={{ p: 2, borderRadius: 2, border: cardBorder }}>
              <Stack gap={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">Pick a time</Typography>
                  <Chip size="small" color="info" label={ownerChipLabel} />
                </Stack>
                <SlotPicker
                  owner={selectedOwner}
                  slotSizeMinutes={slotSize}
                  bufferBeforeMinutes={bufferBefore}
                  bufferAfterMinutes={bufferAfter}
                  onPick={(s) => setSlot(s)}
                />
                <Stack direction="row" justifyContent="space-between">
                  <Button startIcon={<ChevronLeft />} onClick={back}>Back</Button>
                  <Stack direction="row" gap={1}>
                    {slot && <Chip color="success" icon={<CheckCircle2 size={14} />} label="Slot selected" />}
                    <Button startIcon={<ChevronRight />} variant="contained" disabled={!canNextFrom1} onClick={next}>Next</Button>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          )}

          {/* STEP 2 */}
          {active === 2 && (
            <Paper variant="elevation" elevation={0} sx={{ p: 2, borderRadius: 2, border: cardBorder }}>
              <Stack gap={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">Invitee details</Typography>
                  <Chip size="small" color="info" label={ownerChipLabel} />
                </Stack>

                <Stack direction={{ xs: "column", md: "row" }} gap={2}>
                  <TextField label="Invitee Name" value={invitee.name}
                    onChange={(e) => setInvitee({ ...invitee, name: e.target.value })} fullWidth />
                  <TextField label="Email" value={invitee.email}
                    onChange={(e) => setInvitee({ ...invitee, email: e.target.value })} fullWidth
                    InputProps={{ startAdornment: <Mail size={16} style={{ marginRight: 6 }} /> }} />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} gap={2}>
                  <TextField label="Phone (SMS/WA)" value={invitee.phone}
                    onChange={(e) => setInvitee({ ...invitee, phone: e.target.value })} fullWidth
                    InputProps={{ startAdornment: <Phone size={16} style={{ marginRight: 6 }} /> }} />
                  <TextField select label="Meeting Location" value={locationPreference}
                    onChange={(e) => setLocationPreference(e.target.value)} sx={{ minWidth: 240 }}>
                    {["google_meet","zoom","in_person","phone"].map((opt) => (<MenuItem key={opt} value={opt}>{opt}</MenuItem>))}
                  </TextField>
                </Stack>
                <FormGroup row>
                  <FormControlLabel control={<Checkbox checked={channelPrefs.email}
                    onChange={(_, v) => setChannelPrefs({ ...channelPrefs, email: v })} />} label="Email" />
                  <FormControlLabel control={<Checkbox checked={channelPrefs.sms}
                    onChange={(_, v) => setChannelPrefs({ ...channelPrefs, sms: v })} />} label="SMS" />
                  <FormControlLabel control={<Checkbox checked={channelPrefs.whatsapp}
                    onChange={(_, v) => setChannelPrefs({ ...channelPrefs, whatsapp: v })} />} label="WhatsApp" />
                </FormGroup>
                <Stack direction="row" justifyContent="space-between">
                  <Button startIcon={<ChevronLeft />} onClick={back}>Back</Button>
                  <Button startIcon={<ChevronRight />} variant="contained" disabled={!canNextFrom2} onClick={next}>Next</Button>
                </Stack>
              </Stack>
            </Paper>
          )}

          {/* STEP 3 */}
          {active === 3 && (
            <Paper variant="elevation" elevation={0} sx={{ p: 2, borderRadius: 2, border: cardBorder }}>
              <Stack gap={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">Review</Typography>
                  <Chip size="small" color="info" label={ownerChipLabel} />
                </Stack>
                <Divider />
                <Stack direction="row" gap={1} flexWrap="wrap">
                  <Chip label="Type: Scheduled" />
                  <Chip label={`Host: ${selectedOwner.ownerType}:${selectedOwner.ownerId}`} />
                  <Chip label={`When: ${slot?.start} → ${slot?.end} (UTC)`} />
                  <Chip label={`Invitee: ${invitee.name} <${invitee.email}>`} />
                  <Chip label={`Notify: ${Object.entries(channelPrefs).filter(([, v]) => v).map(([k]) => k).join(", ") || "—"}`} />
                  <Chip icon={<Video size={14} />} label={`Location: ${locationPreference}`} />
                </Stack>

                {mtg.lastError && <Alert severity="error">{mtg.lastError}</Alert>}
                {bookingBusy && (
                  <Stack direction="row" gap={1} alignItems="center">
                    <CircularProgress size={18} />
                    <Typography variant="body2">Processing: {bookingState.replace(/_/g, " ")}</Typography>
                  </Stack>
                )}
                {bookingState === "confirmed" && lastBooking && (
                  <Alert severity="success">Booked! Meeting ID: <strong>{lastBooking.id}</strong></Alert>
                )}

                <Stack direction="row" justifyContent="space-between">
                  <Button startIcon={<ChevronLeft />} onClick={back} disabled={bookingBusy}>Back</Button>
                  <Stack direction="row" gap={1}>
                    <Button variant="outlined" startIcon={<Download />} disabled={!lastBooking} onClick={downloadICS}>
                      Download .ics
                    </Button>
                    <Button variant="contained" onClick={doBook} disabled={bookingBusy || bookingState === "confirmed"}>
                      {bookingBusy ? "Booking..." : "Confirm & Book"}
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <Dialog open={providerDlgOpen} onClose={() => setProviderDlgOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Choose a conferencing option</DialogTitle>
        <DialogContent dividers>
          <Stack gap={1.25}>
            {providerOptions.map((opt) => (
              <ProviderCard
                key={opt.id}
                opt={opt}
                selected={selectedProvider === opt.id}
                onSelect={() => setSelectedProvider(opt.id)}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProviderDlgOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={confirmProvider}>Continue</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
