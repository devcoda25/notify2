// Path: src/Component/Meetings/components/steps/StepConfirm.jsx
import React from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Divider,
  Alert,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Clock,
  Video,
  Phone,
  User as UserIcon,
  Notebook,
  MapPin,
} from "lucide-react";
import { humanDayISO, toISODate, fmtTime } from "../../utils/datetime";

/**
 * Confirmation step (no side effects here).
 * Props:
 * - eventType, invitee, pickedDay, slot, timezone, locationPreference
 * - error, busy
 * - onBack(), onConfirm()
 */

function MediumBadge({ kind }) {
  // kind: 'online' | 'phone'
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

export default function StepConfirm({
  eventType,
  invitee,
  pickedDay,
  slot,
  timezone,
  locationPreference,
  error,
  busy,
  onBack,
  onConfirm,
}) {
  const theme = useTheme();
  const dayLabel = pickedDay ? humanDayISO(toISODate(pickedDay)) : "—";
  const startLabel = slot ? `${dayLabel}, ${fmtTime(slot.start, timezone)}` : "—";
  const endLabel = slot ? `${dayLabel}, ${fmtTime(slot.end, timezone)}` : "—";
  const durationMin = slot ? Math.max(0, Math.round((new Date(slot.end) - new Date(slot.start)) / 60000)) : 0;

  const isPhone = String(locationPreference) === "phone";
  const meetingTypeText = isPhone ? "Cellular call (your phone number)" : "Online call";

  return (
    <Stack gap={2} sx={{ mt: 2, maxWidth: 720, mx: "auto" }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Confirm your booking
      </Typography>

      <Alert severity="info">
        Review the details below, then click <strong>Confirm &amp; schedule</strong>. You can go back to make changes.
      </Alert>

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2,
          borderColor: alpha(theme.palette.divider, 0.1),
          background: `linear-gradient(180deg, ${alpha(
            theme.palette.success.light,
            0.08
          )} 0%, ${alpha(theme.palette.success.main, 0.04)} 100%)`,
          position: "relative",
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Booking summary
          </Typography>
          <MediumBadge kind={isPhone ? "phone" : "online"} />
        </Stack>

        {/* Title */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          {eventType?.name || "Scheduled meeting"}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {/* Details grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1.25,
          }}
        >
          <DetailRow icon={<Clock size={16} />} label="Starts" value={`${startLabel} (${timezone})`} />
          <DetailRow icon={<Clock size={16} />} label="Ends" value={`${endLabel} (${timezone})`} />
          <DetailRow icon={<Clock size={16} />} label="Duration" value={durationMin ? `${durationMin} minutes` : "—"} />
          <DetailRow
            icon={isPhone ? <Phone size={16} /> : <Video size={16} />}
            label="Meeting type"
            value={meetingTypeText}
          />
          <DetailRow icon={<MapPin size={16} />} label="Timezone" value={timezone} />
          <DetailRow
            icon={<UserIcon size={16} />}
            label="Invitee"
            value={`${invitee?.name || "—"}${invitee?.email ? ` • ${invitee.email}` : ""}${invitee?.phone ? ` • ${invitee.phone}` : ""}`}
          />

          {/* NOTES — span full row */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <DetailRow
              icon={<Notebook size={16} />}
              label="Notes"
              value={
                <span style={{ whiteSpace: "pre-wrap" }}>
                  {invitee?.purpose?.trim() ? invitee.purpose.trim() : "No notes added."}
                </span>
              }
            />
          </Box>
        </Box>

      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack direction="row" gap={1} justifyContent="space-between">
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={onConfirm} disabled={busy}>
          {busy ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} /> Scheduling…
            </>
          ) : (
            "Confirm & schedule"
          )}
        </Button>
      </Stack>
    </Stack>
  );
}
