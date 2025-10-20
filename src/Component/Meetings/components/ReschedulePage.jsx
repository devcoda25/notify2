// Path: /src/Component/Meetings/components/ReschedulePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Stack, Paper, Typography, Divider, Chip, Button, Alert, CircularProgress, Tooltip
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarClock, Clock, Video, Phone, User as UserIcon, Notebook, MapPin } from "lucide-react";

import { useMeetingsStore } from "../../store/scheduling/useMeetingsStore";

const viewerTZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const pad2 = (n) => String(n).padStart(2, "0");
function fmtLocal(iso, tz = viewerTZ) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric", month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit",
      hour12: true, timeZone: tz,
    }).format(new Date(iso));
  } catch {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }
}
function DetailRow({ icon, label, value }) {
  return (
    <Stack direction="row" gap={1.25} alignItems="flex-start">
      <Box aria-hidden sx={{ width: 28, height: 28, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", bgcolor: (t) => t.palette.action.hover, flexShrink: 0 }}>
        {icon}
      </Box>
      <Stack sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>{label}</Typography>
        <Typography variant="body2" sx={{ mt: 0.25, wordBreak: "break-word" }}>{value}</Typography>
      </Stack>
    </Stack>
  );
}
function MediumBadge({ kind }) {
  const theme = useTheme();
  const meta = kind === "phone"
    ? { icon: <Phone size={16} />, label: "Phone Call", bg: alpha(theme.palette.secondary.main, 0.10) }
    : { icon: <Video size={16} />, label: "Internet call", bg: alpha(theme.palette.info.main, 0.10) };
  return (
    <Tooltip title={meta.label}>
      <Box sx={{ px: 1, py: 0.5, borderRadius: 1.5, bgcolor: meta.bg, display: "inline-flex", alignItems: "center", gap: 0.75, fontSize: 12 }}>
        {meta.icon}
        <span style={{ textTransform: "capitalize" }}>{kind === "phone" ? "Phone Call" : "Internet"}</span>
      </Box>
    </Tooltip>
  );
}

export default function ReschedulePageComponent() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const mtg = useMeetingsStore();

  const [busy] = useState(false);

  useEffect(() => {
    mtg.loaded || mtg.loadFixtures?.();
  }, [mtg]);

  const direct = useMemo(() => (mtg.meetings || []).find((m) => m.id === bookingId), [mtg.meetings, bookingId]);
  const fallback = useMemo(() => (!direct ? (mtg.meetings && mtg.meetings[0]) : null), [direct, mtg.meetings]);
  const meeting = direct || fallback;
  const isPreview = !direct && !!meeting;

  if (!mtg.loaded && !meeting) {
    return (
      <Stack gap={2} sx={{ maxWidth: 720, m: "40px auto", px: 2, alignItems: "center" }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">Loading bookings…</Typography>
      </Stack>
    );
  }

  if (!meeting) {
    return (
      <Stack gap={2} sx={{ maxWidth: 720, m: "40px auto", px: 2 }}>
        <Typography variant="h5">Booking not found</Typography>
        <Alert severity="warning">We couldn’t find booking <code>{bookingId}</code>.</Alert>
        <Button onClick={() => navigate("..", { relative: "path" })} variant="contained">
          Go Back
        </Button>
      </Stack>
    );
  }

  const tz = meeting.timezone || viewerTZ;
  const isPhone = String(meeting.locationPreference || meeting.location || "") === "phone";

  // ✅ Open the dedicated scheduler using slug (or event type fallback), not bookingId.
  const openScheduler = () => {
    const slugOrId =
      meeting.slug ||
      meeting.eventTypeSlug ||
      meeting.eventTypeId ||
      meeting.id;
    navigate(`/book/${slugOrId}?stage=pick`, {
      state: { stage: "pick", from: "reschedule", bookingId: meeting.id },
    });
  };

  return (
    <Stack gap={2} sx={{ maxWidth: 1040, m: "40px auto", px: 2 }}>
      {/* Title row */}
      <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
        <CalendarClock size={20} />
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Reschedule</Typography>
        <Chip size="small" label={meeting.id} />
        {/* ✅ Human readable, viewer TZ */}
        <Chip
          size="small"
          icon={<Clock size={14} />}
          label={`${fmtLocal(meeting.start, tz)} → ${fmtLocal(meeting.end, tz)} (${tz})`}
        />
      </Stack>

      {isPreview && (
        <Alert severity="info">Previewing a demo booking because <code>{bookingId}</code> wasn’t found.</Alert>
      )}

      {/* Current booking card */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2,
          borderColor: alpha(theme.palette.divider, 0.1),
          background: `linear-gradient(180deg, ${alpha(theme.palette.info.light, 0.10)} 0%, ${alpha(theme.palette.info.main, 0.04)} 100%)`,
        }}
      >
        <Stack gap={1.25}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Current booking</Typography>
            <MediumBadge kind={isPhone ? "phone" : "online"} />
          </Stack>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.25 }}>
            <DetailRow icon={<Clock size={16} />} label="Starts" value={fmtLocal(meeting.start, tz)} />
            <DetailRow icon={<Clock size={16} />} label="Ends" value={fmtLocal(meeting.end, tz)} />
            <DetailRow icon={<MapPin size={16} />} label="Timezone" value={tz} />
            <DetailRow icon={isPhone ? <Phone size={16} /> : <Video size={16} />} label="Meeting type" value={isPhone ? "Phone call" : "Online call"} />
            <DetailRow icon={<UserIcon size={16} />} label="Invitee" value={`${meeting.invitee?.name || "—"}${meeting.invitee?.email ? ` • ${meeting.invitee.email}` : ""}${meeting.invitee?.phone ? ` • ${meeting.invitee.phone}` : ""}`} />
            <Box sx={{ gridColumn: "1 / -1" }}>
              <DetailRow icon={<Notebook size={16} />} label="Notes" value={<span style={{ whiteSpace: "pre-wrap" }}>{meeting.invitee?.purpose?.trim() ? meeting.invitee.purpose.trim() : "No notes provided."}</span>} />
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* Link out to dedicated scheduler */}
      <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Typography variant="subtitle2">Pick a new time on the scheduling page</Typography>
          <Stack direction="row" gap={1}>
            {/* ✅ Sibling route to /book/:bookingId/cancel in RED */}
            <Button color="error" onClick={() => navigate("../cancel", { relative: "path" })}>
              Cancel instead
            </Button>
            {/* ✅ Correct scheduler link (slug-based) */}
            <Button variant="contained" onClick={openScheduler} disabled={busy}>
              Open scheduling page
            </Button>
          </Stack>
        </Stack>
        <Alert severity="info" sx={{ mt: 1 }}>
          You’ll choose an available time on the dedicated scheduler, then we’ll update this booking.
        </Alert>
      </Paper>
    </Stack>
  );
}
