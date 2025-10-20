// Path: /src/Component/Meetings/views/Desk/JoinNowView.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  Divider,
  Paper,
  Chip,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Video,
  TimerReset,
  Clock,
  Plus,
  X as XIcon,
  Mail,
  CalendarDays,
  Notebook,
  PhoneCall,
  MapPin,
  Globe,
} from "lucide-react";

import { useMeetingsStore } from "../../../store/scheduling/useMeetingsStore";
import { useConferencingStore } from "../../../store/scheduling/useConferencingStore";
import CreateMeetingWizard from "../Organize/CreateMeetingWizard";

/* ---------- helpers ---------- */

const viewerTZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const pad2 = (n) => String(n).padStart(2, "0");

function fmtLocal(iso, tz = viewerTZ) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz,
    }).format(new Date(iso));
  } catch {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }
}

function durationMinutes(startIso, endIso) {
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  return Math.max(0, Math.round(ms / 60000));
}

/** Determine medium & provider */
function getCallMedium(m) {
  const type = (m?.location?.type || "").toLowerCase();
  const hasLink = !!m?.location?.link;
  if (type === "in_person" || type === "in-person") return { medium: "in_person", provider: "in_person" };
  if (type === "phone" || type === "gsm") return { medium: "gsm", provider: type };
  if (hasLink) return { medium: "internet", provider: type || "link" };
  if (["google_meet", "zoom", "teams", "webex", "notify_live", "meet", "online"].includes(type))
    return { medium: "internet", provider: type };
  if (type) return { medium: "internet", provider: type }; // default unknown provider -> internet
  return { medium: "internet", provider: "online" };
}

function MediumBadge({ meeting }) {
  const theme = useTheme();
  const { medium, provider } = getCallMedium(meeting);
  const info = {
    internet: { icon: <Video size={16} />, label: "Internet call" },
    gsm: { icon: <PhoneCall size={16} />, label: "Cellular phone" },
    in_person: { icon: <MapPin size={16} />, label: "In person" },
  }[medium] || { icon: <Globe size={16} />, label: "Online" };

  const colorMap = {
    internet: alpha(theme.palette.info.main, 0.1),
    gsm: alpha(theme.palette.secondary.main, 0.1),
    in_person: alpha(theme.palette.success.main, 0.1),
  };

  return (
    <Tooltip title={`${info.label}${provider ? ` • ${provider}` : ""}`}>
      <Box
        sx={{
          px: 1,
          py: 0.5,
          borderRadius: 1.5,
          bgcolor: colorMap[medium] || alpha(theme.palette.primary.main, 0.06),
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          fontSize: 12,
        }}
      >
        {info.icon}
        <span style={{ textTransform: "capitalize" }}>
          {medium === "in_person" ? "In person" : medium}
        </span>
      </Box>
    </Tooltip>
  );
}

/** Calendar-aware humanized diff: "1 month, 3 days, 2 hours, 45 minutes" */
function humanizeDiff(fromDate, toDate) {
  if (!(fromDate instanceof Date) || !(toDate instanceof Date)) return "";
  if (toDate <= fromDate) return "less than a minute";

  const addMonths = (d, n = 1) => new Date(d.getFullYear(), d.getMonth() + n, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
  const addDays = (d, n = 1) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, d.getHours(), d.getMinutes(), d.getSeconds());
  const addHours = (d, n = 1) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + n, d.getMinutes(), d.getSeconds());
  const addMinutes = (d, n = 1) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + n, d.getSeconds());

  let temp = new Date(fromDate.getTime());
  let months = 0, days = 0, hours = 0, minutes = 0;

  while (addMonths(temp) <= toDate) { temp = addMonths(temp); months++; }
  while (addDays(temp) <= toDate) { temp = addDays(temp); days++; }
  while (addHours(temp) <= toDate) { temp = addHours(temp); hours++; }
  while (addMinutes(temp) <= toDate) { temp = addMinutes(temp); minutes++; }

  const parts = [];
  if (months) parts.push(`${months} month${months === 1 ? "" : "s"}`);
  if (days) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  if (hours) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  if (minutes || parts.length === 0) parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);

  return parts.join(", ");
}

/** Starts In — isolated 1s ticker so only this badge re-renders */
function StartsInBadge({ startIso }) {
  const theme = useTheme();
  const [nowMs, setNowMs] = React.useState(() => Date.now());

  React.useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    const bump = () => setNowMs(Date.now());
    window.addEventListener("focus", bump);
    document.addEventListener("visibilitychange", bump);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", bump);
      document.removeEventListener("visibilitychange", bump);
    };
  }, []);

  const label = React.useMemo(
    () => humanizeDiff(new Date(nowMs), new Date(startIso)),
    [nowMs, startIso]
  );

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        alignSelf: "flex-start",
        px: 1.25,
        py: 0.75,
        borderRadius: 2,
        display: "inline-flex",
        flexDirection: "column",
        bgcolor: alpha(theme.palette.warning.light, 0.25),
        border: `1px solid ${alpha(theme.palette.warning.main, 0.25)}`,
        minWidth: 260,
      }}
    >
      <Typography
        variant="caption"
        sx={{ mb: 0.25, letterSpacing: 0.2, color: "text.secondary" }}
      >
        Starts in
      </Typography>
      <Stack direction="row" alignItems="center" gap={1}>
        <TimerReset size={18} />
        <Typography
          variant="h5"
          sx={{ m: 0, p: 0, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}
        >
          {label}
        </Typography>
      </Stack>
    </Box>
  );
}

/* ---------- view ---------- */

export default function JoinNowView() {
  const theme = useTheme();
  const mtg = useMeetingsStore();
  const conf = useConferencingStore();

  const [openWizard, setOpenWizard] = useState(false);

  // Tame the parent-level ticker: update every 30s + on focus/visibility
  const [nowMs, setNowMs] = useState(Date.now());
  useEffect(() => {
    const tick = () => setNowMs(Date.now());
    const id = setInterval(tick, 30_000);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);

  useEffect(() => {
    mtg.loaded || mtg.loadFixtures();
  }, [mtg]);

  const meetings = mtg.meetings || [];

  const pastSorted = useMemo(
    () =>
      [...meetings]
        .filter((m) => new Date(m.end).getTime() < nowMs)
        .sort((a, b) => new Date(b.end) - new Date(a.end)),
    [meetings, nowMs]
  );

  const futureSorted = useMemo(
    () =>
      [...meetings]
        .filter((m) => new Date(m.end).getTime() >= nowMs)
        .sort((a, b) => new Date(a.start) - new Date(b.start)),
    [meetings, nowMs]
  );

  const current = useMemo(() => {
    return (
      futureSorted.find((m) => {
        const st = new Date(m.start).getTime();
        const en = new Date(m.end).getTime();
        return nowMs >= st && nowMs <= en;
      }) || null
    );
  }, [futureSorted, nowMs]);

  const upcoming = useMemo(() => current || futureSorted[0] || null, [current, futureSorted]);

  const nextInLine = useMemo(() => {
    if (!upcoming) return null;
    const idx = futureSorted.findIndex((m) => m.id === upcoming.id);
    return idx >= 0 && futureSorted[idx + 1] ? futureSorted[idx + 1] : null;
  }, [upcoming, futureSorted]);

  const previous = pastSorted[0] || null;

  const join = async (m) => {
    if (!m) return;
    const res = await conf.createRoomForMeeting?.(m.id, {
      provider: m.location?.type || "google_meet",
      title: `Notify • ${m.eventTypeId}`,
      start: m.start,
      end: m.end,
      attendees: (m.attendees || []).map((a) => ({ name: a.name, email: a.email })),
    });
    if (res?.joinUrl) {
      mtg.markJoined?.(m.id);
      window.open(res.joinUrl, "_blank", "noopener,noreferrer");
    }
  };

  const cancelMeeting = async (m) => {
    await mtg.cancelMeeting?.(m.id);
  };
  const rescheduleMeeting = () => setOpenWizard(true);
  const emailInvitee = (m) => {
    const to = m?.invitee?.email || "";
    const subject = encodeURIComponent(`About our meeting: ${m?.eventTypeId || ""}`);
    const body = encodeURIComponent(
      `Hi ${m?.invitee?.name || ""},\n\n` +
        `This is about our meeting scheduled for ${fmtLocal(m?.start)}.\n\n` +
        `Best,\n`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  const neutralStroke = alpha(theme.palette.divider, 0.7);
  const successStroke = alpha(theme.palette.success.main, 0.35);
  const warnStroke = alpha(theme.palette.warning.main, 0.35);

  const Tile = ({ title, stroke, tint, meeting, children }) => (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 3,
        borderColor: stroke,
        background: tint,
        minHeight: 340,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        position: "relative",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1" fontWeight={800}>
          {title}
        </Typography>
        {meeting && <MediumBadge meeting={meeting} />}
      </Stack>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, flex: 1 }}>{children}</Box>
    </Paper>
  );

  const DetailRow = ({ icon, label, value }) => (
    <Stack direction="row" alignItems="center" gap={1}>
      <Box sx={{ width: 18, display: "grid", placeItems: "center", color: "text.secondary" }}>{icon}</Box>
      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 92 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
    </Stack>
  );

  const MeetingDetails = ({ m, role }) => {
    const dur = `${durationMinutes(m.start, m.end)} min`;
    const startL = fmtLocal(m.start);
    const endL = fmtLocal(m.end);
    const notes = m.notes || m.description || "No notes added yet.";

    return (
      <Stack gap={0.75}>
        {/* Humanized "Starts in" (only when not current) */}
        {!role?.includes("current") && role?.includes("upcoming") && (
          <StartsInBadge startIso={m.start} />
        )}

        {role === "current" && <Chip color="success" size="small" label="Happening now" />}

        <DetailRow icon={<Clock size={14} />} label="Start" value={`${startL} (${viewerTZ})`} />
        <DetailRow icon={<Clock size={14} />} label="End" value={`${endL} (${viewerTZ})`} />
        <DetailRow icon={<CalendarDays size={14} />} label="Duration" value={dur} />
        <DetailRow
          icon={<Mail size={14} />}
          label="Invitee"
          value={`${m.invitee?.name || "—"}${m.invitee?.email ? ` • ${m.invitee.email}` : ""}`}
        />
        <DetailRow icon={<Notebook size={14} />} label="Notes" value={notes} />
      </Stack>
    );
  };

  return (
    <>
      <Stack gap={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Join Now</Typography>
          <Button startIcon={<Plus size={16} />} variant="contained" onClick={() => setOpenWizard(true)}>
            New Meeting
          </Button>
        </Stack>
        <Divider />

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            alignItems: "stretch",
            gridAutoRows: "1fr",
          }}
        >
          {/* Previous */}
          <Tile title="Previous meeting" stroke={neutralStroke} tint="transparent" meeting={previous}>
            {previous ? (
              <>
                <MeetingDetails m={previous} role="previous" />
                <Stack direction={{ xs: "column", sm: "row" }} gap={0.75} sx={{ mt: "auto" }}>
                  <Button variant="text" startIcon={<Mail size={16} />} onClick={() => emailInvitee(previous)}>
                    Email invitee
                  </Button>
                  <Button variant="text" startIcon={<Plus size={16} />} onClick={() => setOpenWizard(true)}>
                    New meeting
                  </Button>
                </Stack>
              </>
            ) : (
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: `1px dashed ${alpha(theme.palette.divider, 0.1)}`,
                  textAlign: "center",
                  color: "text.secondary",
                  mt: 1,
                }}
              >
                <Typography variant="body2">No previous meeting found.</Typography>
                <Typography variant="body2">Finished meetings will show here for quick follow-ups.</Typography>
                <Button sx={{ mt: 1 }} variant="text" startIcon={<Plus size={16} />} onClick={() => setOpenWizard(true)}>
                  New meeting
                </Button>
              </Box>
            )}
          </Tile>

          {/* Upcoming */}
          <Tile
            title="Upcoming meeting"
            stroke={successStroke}
            tint={`linear-gradient(180deg, ${alpha(theme.palette.success.light, 0.10)} 0%, ${alpha(
              theme.palette.success.main,
              0.05
            )} 100%)`}
            meeting={upcoming}
          >
            {upcoming ? (
              <>
                <MeetingDetails m={upcoming} role={current ? "current" : "upcoming"} />
                <Stack direction={{ xs: "column", sm: "row" }} gap={0.75} sx={{ mt: "auto" }}>
                  <Button startIcon={<Video />} variant="contained" onClick={() => join(upcoming)}>
                    {current ? "Rejoin" : "Join"}
                  </Button>
                  <Button startIcon={<CalendarDays size={16} />} variant="text" onClick={() => rescheduleMeeting(upcoming)}>
                    Reschedule
                  </Button>
                  <Button startIcon={<Mail size={16} />} variant="text" onClick={() => emailInvitee(upcoming)}>
                    Email invitee
                  </Button>
                  <Button startIcon={<XIcon size={16} />} variant="text" color="error" onClick={() => cancelMeeting(upcoming)}>
                    Cancel
                  </Button>
                </Stack>
              </>
            ) : (
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: `1px dashed ${alpha(theme.palette.success.main, 0.1)}`,
                  textAlign: "center",
                  color: "text.secondary",
                  mt: 1,
                }}
              >
                <Typography variant="body2">No meeting in progress or starting soon.</Typography>
                <Button sx={{ mt: 1 }} variant="contained" startIcon={<Plus size={16} />} onClick={() => setOpenWizard(true)}>
                  New meeting
                </Button>
              </Box>
            )}
          </Tile>

          {/* Next in line */}
          <Tile
            title="Next in line"
            stroke={warnStroke}
            tint={`linear-gradient(180deg, ${alpha(theme.palette.warning.light, 0.10)} 0%, ${alpha(
              theme.palette.warning.main,
              0.05
            )} 100%)`}
            meeting={nextInLine}
          >
            {nextInLine ? (
              <>
                <MeetingDetails m={nextInLine} role="next" />
                <Stack direction={{ xs: "column", sm: "row" }} gap={0.75} sx={{ mt: "auto" }}>
                  <Button startIcon={<CalendarDays size={16} />} variant="text" onClick={() => rescheduleMeeting(nextInLine)}>
                    Reschedule
                  </Button>
                  <Button startIcon={<Mail size={16} />} variant="text" onClick={() => emailInvitee(nextInLine)}>
                    Email invitee
                  </Button>
                </Stack>
              </>
            ) : (
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: `1px dashed ${alpha(theme.palette.warning.main, 0.1)}`,
                  textAlign: "center",
                  color: "text.secondary",
                  mt: 1,
                }}
              >
                <Typography variant="body2">No meeting is queued after the upcoming one.</Typography>
                <Button sx={{ mt: 1 }} variant="text" startIcon={<Plus size={16} />} onClick={() => setOpenWizard(true)}>
                  New meeting
                </Button>
              </Box>
            )}
          </Tile>
        </Box>
      </Stack>

      <CreateMeetingWizard open={openWizard} onClose={() => setOpenWizard(false)} />
    </>
  );
}
