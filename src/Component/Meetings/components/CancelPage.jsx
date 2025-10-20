// Path: /src/Component/Meetings/components/CancelPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Stack, Paper, Typography, Divider, Chip, Button, Alert, CircularProgress, Tooltip
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarX2, Clock, Video, Phone, User as UserIcon, Notebook, MapPin } from "lucide-react";
import { useMeetingsStore } from "../../store/scheduling/useMeetingsStore";

const viewerTZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const pad2 = (n) => String(n).padStart(2, "0");
function fmtLocal(iso, tz = viewerTZ) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric", month: "long", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: true, timeZone: tz,
    }).format(new Date(iso));
  } catch {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }
}

function DetailRow({ icon, label, value }) {
  return (
    <Stack direction="row" gap={1.25} alignItems="flex-start">
      <Box
        aria-hidden
        sx={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: (t) => t.palette.action.hover,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Stack sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.25, wordBreak: "break-word" }}>
          {value}
        </Typography>
      </Stack>
    </Stack>
  );
}

function MediumBadge({ kind }) {
  const theme = useTheme();
  const meta =
    kind === "phone"
      ? { icon: <Phone size={16} />, label: "Phone Call", bg: alpha(theme.palette.secondary.main, 0.10) }
      : { icon: <Video size={16} />, label: "Internet call", bg: alpha(theme.palette.info.main, 0.10) };
  return (
    <Tooltip title={meta.label}>
      <Box
        sx={{
          px: 1,
          py: 0.5,
          borderRadius: 1.5,
          bgcolor: meta.bg,
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          fontSize: 12,
        }}
      >
        {meta.icon}
        <span style={{ textTransform: "capitalize" }}>
          {kind === "phone" ? "Phone Call" : "Internet"}
        </span>
      </Box>
    </Tooltip>
  );
}

export default function CancelPageComponent() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const mtg = useMeetingsStore();
  const theme = useTheme();

  const [busy, setBusy] = useState(false);
  const [ok,   setOk]   = useState(false);
  const [err,  setErr]  = useState("");

  useEffect(() => {
    mtg.loaded || mtg.loadFixtures?.();
  }, [mtg]);

  const direct = useMemo(
    () => (mtg.meetings || []).find((m) => m.id === bookingId),
    [mtg.meetings, bookingId]
  );
  const fallback = useMemo(
    () => (!direct ? (mtg.meetings && mtg.meetings[0]) : null),
    [direct, mtg.meetings]
  );
  const meeting   = direct || fallback;
  const isPreview = !direct && !!meeting;

  const cancel = async () => {
    if (!meeting) return;
    setBusy(true);
    setErr("");
    try {
      await mtg.cancel?.(meeting.id, "invitee_request");
      setOk(true);
    } catch (e) {
      setErr(e?.message || "Failed to cancel (mock).");
    } finally {
      setBusy(false);
    }
  };

  // Back to booking confirm step (stage=confirm) — if no history, jump via /book/:slug?stage=confirm
  const goBackToConfirm = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    const slugOrId =
      meeting?.slug ||
      meeting?.eventTypeSlug ||
      meeting?.eventTypeId ||
      meeting?.id;
    navigate(`/book/${slugOrId}?stage=confirm`, {
      replace: false,
      state: { stage: "confirm", bookingId: meeting?.id },
    });
  };

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
        <Button onClick={goBackToConfirm} variant="contained">Go Back</Button>
      </Stack>
    );
  }

  const tz = meeting.timezone || viewerTZ;
  const isPhone = String(meeting.locationPreference || meeting.location || "") === "phone";

  return (
    <Stack gap={2} sx={{ maxWidth: 960, m: "40px auto", px: 2 }}>
      {/* Title */}
      <Stack direction="row" alignItems="center" gap={1}>
        <CalendarX2 size={20} />
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Cancel booking</Typography>
        <Chip size="small" label={meeting.id} />
      </Stack>

      {isPreview && (
        <Alert severity="info">Previewing a demo booking because <code>{bookingId}</code> wasn’t found.</Alert>
      )}

      {/* Card */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2,
          borderColor: alpha(theme.palette.divider, 0.1),
          background: `linear-gradient(180deg, ${alpha(
            theme.palette.warning.light,
            0.10
          )} 0%, ${alpha(theme.palette.warning.main, 0.04)} 100%)`,
        }}
      >
        <Stack gap={1.25}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Booking summary</Typography>
            <MediumBadge kind={isPhone ? "phone" : "online"} />
          </Stack>

          <Divider sx={{ my: 1 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1.25,
            }}
          >
            <DetailRow icon={<Clock size={16} />} label="Starts" value={fmtLocal(meeting.start, tz)} />
            <DetailRow icon={<Clock size={16} />} label="Ends" value={fmtLocal(meeting.end, tz)} />
            <DetailRow icon={<MapPin size={16} />} label="Timezone" value={tz} />
            <DetailRow
              icon={isPhone ? <Phone size={16} /> : <Video size={16} />}
              label="Meeting type"
              value={isPhone ? "Phone call" : "Online call"}
            />
            <DetailRow
              icon={<UserIcon size={16} />}
              label="Invitee"
              value={`${meeting.invitee?.name || "—"}${
                meeting.invitee?.email ? ` • ${meeting.invitee.email}` : ""
              }${meeting.invitee?.phone ? ` • ${meeting.invitee.phone}` : ""}`}
            />
            {/* Notes full width */}
            <Box sx={{ gridColumn: "1 / -1" }}>
              <DetailRow
                icon={<Notebook size={16} />}
                label="Notes"
                value={
                  <span style={{ whiteSpace: "pre-wrap" }}>
                    {meeting.invitee?.purpose?.trim()
                      ? meeting.invitee.purpose.trim()
                      : "No notes provided."}
                  </span>
                }
              />
            </Box>
          </Box>

          {/* Red banner after successful cancel */}
          {ok && (
            <Alert severity="error" sx={{ mt: 1 }}>
              This booking has been <strong>cancelled</strong>. You can reschedule below or close this tab.
            </Alert>
          )}
          {err && <Alert severity="error" sx={{ mt: 1 }}>{err}</Alert>}

          <Stack direction="row" justifyContent="space-between" gap={1} flexWrap="wrap">
            {/* ✅ Correct relative route to /book/:bookingId/reschedule */}
            <Button
              onClick={() => navigate("../reschedule", { relative: "path" })}
              sx={{ px: 2 }}
            >
              Reschedule
            </Button>

            <Box>
              <Button onClick={goBackToConfirm} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={cancel}
                disabled={busy || ok}
              >
                {busy ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} /> Cancelling…
                  </>
                ) : ok ? (
                  "Cancelled"
                ) : (
                  "Confirm cancel"
                )}
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
