// Path: src/Component/Meetings/components/steps/StepInviteeDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Divider,
  TextField,
  Button,
  Chip,
  InputAdornment,
  Paper,
  Radio,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Mail,
  Video,
  Phone,
  TimerReset,
  Clock,
  Notebook,
  User as UserIcon,
} from "lucide-react";
import { EMAIL_RE } from "../../constants/booking.constants";
import PhoneInputLite from "../PhoneInputLite";

/* ---------------- helpers ---------------- */

const viewerTZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const pad2 = (n) => String(n).padStart(2, "0");
function fmtLocal(iso, tz = viewerTZ) {
  if (!iso) return "—";
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
    return `${d.toLocaleDateString()} ${pad2(d.getHours())}:${pad2(
      d.getMinutes()
    )}`;
  }
}
function durationMinutes(startIso, endIso) {
  if (!startIso || !endIso) return 0;
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  return Math.max(0, Math.round(ms / 60000));
}

/** Humanize difference between two dates as:
 *  "1 month, 3 days, 2 hours, 45 minutes"
 *  Uses calendar-aware increments (adds months/days/hours forward).
 */
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

function MediumBadge({ kind }) {
  const theme = useTheme();
  const meta =
    kind === "phone"
      ? { icon: <Phone size={16} />, label: "Cellular", bg: alpha(theme.palette.secondary.main, 0.10) }
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

/* ---------------- component ---------------- */

export default function StepInviteeDetails({
  invitee,
  setInvitee,
  locationPreference,
  setLocationPreference,
  validateInvitee,
  onBack,
  onNext,
  pickedDay, // Date | null
  slot,      // { start, end } | null  (ISO)
  timezone,  // selected scheduler TZ (still render user-local here)
}) {
  const theme = useTheme();

  const emailLiveError = useMemo(
    () => (invitee.email ? !EMAIL_RE.test(invitee.email) : false),
    [invitee.email]
  );

  const hasDetails = Boolean(
    String(invitee.name || "").trim() && EMAIL_RE.test(invitee.email || "")
  );

  useEffect(() => {
    if (!locationPreference) setLocationPreference?.("online");
  }, [locationPreference, setLocationPreference]);

  const selectedLoc = locationPreference || "online";
  const displayPhone =
    invitee?.phone ||
    (invitee?.nationalPhone ? invitee.nationalPhone : "your phone number");

  // 1-sec ticking "now" to keep countdown fresh; also refresh on focus/visibility
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
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
  const now = new Date(nowMs);

  /** Option card (compact rail for radio; icon inline with title) */
  const OptionCard = ({
    value,
    title,
    subtitle,
    icon,
    tags = [],
    recommended = false,
  }) => {
    const checked = selectedLoc === value;
    const stroke = checked
      ? alpha(theme.palette.primary.main, 0.35)
      : alpha(theme.palette.divider, 0.7);
    const tint = checked
      ? `linear-gradient(180deg, ${alpha(
        theme.palette.primary.light,
        0.10
      )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
      : "transparent";

    return (
      <Paper
        elevation={0}
        onClick={() => setLocationPreference?.(value)}
        role="radio"
        aria-checked={checked}
        tabIndex={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2,
          cursor: "pointer",
          outline: "none",
          border: `1px solid ${stroke}`,
          background: tint,
          position: "relative",
          transition: (t) =>
            t.transitions.create(["border-color", "background"], {
              duration: t.transitions.duration.shorter,
            }),
          "&:hover": { borderColor: alpha(theme.palette.primary.main, 0.45) },
          display: "grid",
          gridTemplateColumns: "28px 1fr",
          columnGap: 3,
        }}
      >
        {/* Absolute badge */}
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <MediumBadge kind={value === "phone" ? "phone" : "online"} />
        </Box>

        {/* Rail: radio only */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Radio
            checked={checked}
            onChange={() => setLocationPreference?.(value)}
            value={value}
            inputProps={{ "aria-label": title }}
            sx={{ p: 0.5, mt: 0.25 }}
          />
        </Box>

        {/* Content */}
        <Stack sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" sx={{ pr: 8 }}>
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
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {title}
            </Typography>
            {recommended && (
              <Chip size="small" label="Recommended" color="primary" variant="outlined" />
            )}
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, wordBreak: "break-word" }}>
            {subtitle}
          </Typography>

          {!!tags.length && (
            <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
              {tags.map((t, i) => (
                <Chip key={i} size="small" label={t} variant="outlined" />
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>
    );
  };

  /* ---------- UI ---------- */

  return (
    <Box
      component="form"
      autoComplete="off"
      sx={{
        mt: 2,
        maxWidth: 820,
        mx: "auto",
        "& input:-webkit-autofill": {
          WebkitBoxShadow: "0 0 0px 1000px transparent inset",
          WebkitTextFillColor: "inherit",
          caretColor: "inherit",
          transition: "background-color 9999s ease-in-out 0s",
        },
      }}
      onSubmit={(e) => {
        e.preventDefault();
        if (validateInvitee?.()) onNext?.();
      }}
    >
      <Stack gap={2.5}>
        <Typography variant="subtitle2">Your details</Typography>

        <Stack gap={1.25}>
          <TextField
            label="Full name"
            value={invitee.name}
            onChange={(e) => setInvitee({ ...invitee, name: e.target.value })}
            fullWidth
            helperText=" "
          />

          <TextField
            label="Email"
            value={invitee.email}
            onChange={(e) =>
              setInvitee({ ...invitee, email: e.target.value.trim() })
            }
            error={emailLiveError}
            helperText={invitee.email && emailLiveError ? "Invalid email" : " "}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={16} />
                </InputAdornment>
              ),
            }}
          />

          {/* Phone (used when Cell is chosen) */}
          <PhoneInputLite
            countryIso={invitee.countryIso}
            nationalPhone={invitee.nationalPhone}
            onCountryChange={(iso) =>
              setInvitee((v) => ({ ...v, countryIso: iso }))
            }
            onNationalChange={(val) =>
              setInvitee((v) => ({ ...v, nationalPhone: val.replace(/\D/g, "") }))
            }
            onE164Change={(val) => setInvitee((v) => ({ ...v, phone: val }))}
          />

          <TextField
            label="Purpose / notes for the meeting"
            value={invitee.purpose || ""}
            onChange={(e) => setInvitee({ ...invitee, purpose: e.target.value })}
            fullWidth
            multiline
            minRows={3}
            placeholder="What would you like to cover?"
          />
        </Stack>

        {/* Conferencing option chooser */}
        <Stack gap={1.25}>
          <Typography variant="subtitle2">Choose a meeting option</Typography>

          <OptionCard
            value="online"
            title="Online call"
            icon={<Video size={18} />}
            recommended
            subtitle="Instant video link — quick and simple. Best for screen sharing and the most reliable AV."
            tags={["Easy join", "No install"]}
          />

          <OptionCard
            value="phone"
            title="Cellular Call"
            icon={<Phone size={18} />}
            subtitle={
              <>
                Talk by phone at the scheduled time. You can <strong>call us</strong> (preferred),
                or we can <strong>call you</strong> at <strong>{displayPhone}</strong>. Make sure
                your number is correct and reachable.
              </>
            }
            tags={["Flexible", "No data required"]}
          />

          <Typography variant="caption" color="text.secondary">
            Tip: For clarity and reliability, most guests prefer to place the call to the host when choosing
            <em> Phone</em>. We’ll include dial-in details in your confirmation.
          </Typography>
        </Stack>

        <Divider sx={{ my: 0.5 }} />

        {/* Selection summary — card layout with humanized countdown */}
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
          }}
        >
          <Stack gap={1.25}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Selection summary
              </Typography>
              <MediumBadge kind={selectedLoc === "phone" ? "phone" : "online"} />
            </Stack>

            {/* Humanized countdown banner */}
            {slot?.start && (
              <Box
                role="status"
                aria-live="polite"
                sx={{
                  alignSelf: "flex-start",
                  px: 1.25,
                  py: 0.75,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.warning.light, 0.25),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.25)}`,
                  minWidth: 260,
                }}
              >
                {/* Top row: label */}
                <Typography
                  variant="caption"
                  sx={{ display: "block", mb: 0.25, letterSpacing: 0.2, color: "text.secondary" }}
                >
                  Starts in
                </Typography>

                {/* Bottom row: counter + icon */}
                <Stack direction="row" alignItems="center" gap={1}>
                  <TimerReset size={18} />
                  <Typography
                    variant="h5"
                    sx={{ m: 0, p: 0, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}
                  >
                    {humanizeDiff(now, new Date(slot.start))}
                  </Typography>
                </Stack>
              </Box>

            )}

            {/* Details grid */}  
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 1.25,
              }}
            >
              <DetailRow icon={<Clock size={16} />} label="Start" value={`${fmtLocal(slot?.start)} (${viewerTZ})`} />
              <DetailRow icon={<Clock size={16} />} label="End" value={`${fmtLocal(slot?.end)} (${viewerTZ})`} />
              <DetailRow icon={<Clock size={16} />} label="Duration" value={`${durationMinutes(slot?.start, slot?.end)} min`} />
              <DetailRow
                icon={selectedLoc === "online" ? <Video size={16} /> : <Phone size={16} />}
                label="Meeting type"
                value={selectedLoc === "online" ? "Online call" : `Cellular call (your phone number)`}
              />
              <DetailRow
                icon={<UserIcon size={16} />}
                label="Invitee"
                value={`${invitee?.name ? invitee.name : "—"}${invitee?.email ? ` • ${invitee.email}` : ""}`}
              />

              {/* NOTES — span full row */}
              <Box sx={{ gridColumn: "1 / -1" }}>
                <DetailRow
                  icon={<Notebook size={16} />}
                  label="Notes"
                  value={
                    <span style={{ whiteSpace: "pre-wrap" }}>
                      {invitee?.purpose?.trim() ? invitee.purpose.trim() : "No notes added yet."}
                    </span>
                  }
                />
              </Box>
            </Box>

          </Stack>
        </Paper>

        {/* Actions */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
          <Button onClick={onBack}>Back</Button>
          <Button type="submit" variant="contained" disabled={!slot || !hasDetails}>
            Continue
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
