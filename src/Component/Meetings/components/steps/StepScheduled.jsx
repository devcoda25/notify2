// Path: src/Component/Meetings/components/steps/StepScheduled.jsx
import React from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Divider,
  Button,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  CheckCircle2,
  Clock,
  Video,
  Phone,
  User as UserIcon,
  Notebook,
  MapPin,
  Calendar as CalendarIcon,
} from "lucide-react";
import { humanDayISO, toISODate, fmtTime } from "../../utils/datetime";

/**
 * Final success page (client-only).
 * Props:
 * - eventType, invitee, pickedDay, slot, timezone, locationPreference
 * - bookingId
 * - onCancel(), onReschedule()
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

export default function StepScheduled({
  eventType,
  invitee,
  pickedDay,
  slot,
  timezone,
  locationPreference,
  bookingId,
  onCancel,
  onReschedule,
}) {
  const theme = useTheme();

  const dayISO = pickedDay ? toISODate(pickedDay) : null;
  const dayLabel = dayISO ? humanDayISO(dayISO) : "—";
  const startLabel = slot ? `${fmtTime(slot.start, timezone)}` : "—";
  const endLabel = slot ? `${fmtTime(slot.end, timezone)}` : "—";

  const isPhone = String(locationPreference) === "phone";
  const meetingTypeText = isPhone ? "Cellular call (your phone number)" : "Online call";

  return (
    <Stack
      gap={2}
      sx={{
        mt: 2,
        px: 1,
        maxWidth: 820,
        mx: "auto",
        minHeight: { xs: 360, md: 480 },
        display: "flex",
      }}
    >
      {/* Success header */}
      <Stack alignItems="center" gap={0.75}>
        <Stack direction="row" alignItems="center" gap={1}>
          <CheckCircle2 size={22} color={theme.palette.success.main} />
          <Typography variant="h6" color="success.main" sx={{ fontWeight: 800 }}>
            You’re scheduled!
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          We’ve emailed <strong>{invitee?.email}</strong> a calendar invitation and details.
        </Typography>
      </Stack>

      {/* Summary card */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2,
          width: "100%",
          mx: "auto",
          borderColor: alpha(theme.palette.divider, 0.1),
          background: `linear-gradient(180deg, ${alpha(
            theme.palette.success.light,
            0.08
          )} 0%, ${alpha(theme.palette.success.main, 0.04)} 100%)`,
          position: "relative",
        }}
      >
        {/* Card header row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Booking summary
          </Typography>
          <MediumBadge kind={isPhone ? "phone" : "online"} />
        </Stack>

        {/* Title */}
        <Stack direction="row" alignItems="center" gap={0.75} sx={{ mb: 1 }}>
          <CalendarIcon size={18} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {eventType?.name || "Scheduled meeting"}
          </Typography>
        </Stack>

        <Divider sx={{ my: 1 }} />

        {/* Details grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1.25,
          }}
        >
          <DetailRow icon={<Clock size={16} />} label="Day" value={dayLabel} />
          <DetailRow icon={<MapPin size={16} />} label="Timezone" value={timezone} />
          <DetailRow icon={<Clock size={16} />} label="Starts" value={`${startLabel} (${timezone})`} />
          <DetailRow icon={<Clock size={16} />} label="Ends" value={`${endLabel} (${timezone})`} />
          <DetailRow
            icon={isPhone ? <Phone size={16} /> : <Video size={16} />}
            label="Meeting type"
            value={meetingTypeText}
          />
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


        {bookingId && (
          <>
            <Divider sx={{ my: 1.25 }} />
            <Typography variant="caption" color="text.secondary">
              Booking ID: {bookingId}
            </Typography>
          </>
        )}
      </Paper>

      {/* Footer actions */}
      <Box
        sx={{
          mt: "auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          columnGap: 1,
          rowGap: 1,
          alignItems: "center",
          maxWidth: 820,
          mx: "auto",
        }}
      >
        <Button
          variant="outlined"
          sx={{ justifySelf: { xs: "stretch", sm: "start" }, px: 2 }}
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          sx={{ justifySelf: { xs: "stretch", sm: "end" }, px: 2 }}
          onClick={onReschedule}
        >
          Reschedule
        </Button>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", mt: 1 }}>
        Need to change something later? Use the buttons above to cancel or reschedule.
      </Typography>
    </Stack>
  );
}
