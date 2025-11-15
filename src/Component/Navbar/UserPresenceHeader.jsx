/* eslint react/prop-types: 0 */
import React from "react";
import {
  Box, Stack, Avatar, Typography, Menu, MenuItem, ListItemText, Divider,
  IconButton, Chip, Button, Link as MuiLink,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/CheckCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import BadgeIcon from "@mui/icons-material/Badge";
import ApartmentIcon from "@mui/icons-material/Apartment";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import LaunchIcon from "@mui/icons-material/Launch";
import WalletImg from "../Assets/img/Wallet.png";

/** @typedef {"available"|"busy"|"away"|"offline"} Availability */

export default function UserPresenceHeader({
  user,
  stats,
  breaksLog = [],
  pending = false,
  onChangeAvailability,
  onBreakSelect,
  onLogout,
  onSwitch,
  walletHref = "https://wallet.evzone.app/",
  profileHref = "/u/me/profile",
  privacyHref = "/legal/privacy",
  termsHref = "/legal/terms",
}) {
  const theme = useTheme();

  const displayName = user?.displayName || user?.email || user?.id || "User";
  const role = (typeof user?.role === "string" && user.role.trim()) ? user.role : "";
  const avatarUrl = user?.avatarUrl || "";
  const employeeId = user?.employeeId || "";
  const tenantId = user?.tenantId ?? "";

  // Do NOT default to "available" — keep pending until we know
  const availability = String(user?.availability ?? "").toLowerCase();
  const isPending = !!pending || !availability;

  const STATUS = [
    { id: "available", label: "Available", desc: "Receive calls & messages", color: theme.palette.success.main },
    { id: "busy", label: "Busy", desc: "Do not disturb", color: theme.palette.error.main },
    { id: "away", label: "Away", desc: "Temporarily away", color: theme.palette.warning.main },
    { id: "offline", label: "Offline", desc: "Signed in, not receiving", color: theme.palette.text.disabled },
  ];

  const BREAK_META = {
    lunch: { label: "Lunch", desc: "30–60 min break", max: 60 },
    teaBreak: { label: "Tea Break", desc: "10–15 min pause", max: 15 },
    bioBreak: { label: "Bio Break", desc: "Quick 5 min", max: 5 },
    meeting: { label: "Meeting", desc: "In a meeting" },
    qa: { label: "QA", desc: "Quality review" },
    briefing: { label: "Briefing", desc: "Team briefing" },
    technical: { label: "Technical", desc: "Handling tech issue" },
    unwell: { label: "Unwell", desc: "Not feeling well" },
  };

  const initials = displayName.trim()[0]?.toUpperCase?.() || "U";
  const avatarSrc = avatarUrl || "/assets/images/profile.png";

  // ── Menus
  const [menuEl, setMenuEl] = React.useState(null);
  const menuOpen = Boolean(menuEl);
  const openMenu = (e) => setMenuEl(e.currentTarget);
  const closeMenu = () => setMenuEl(null);

  const [profileEl, setProfileEl] = React.useState(null);
  const profileOpen = Boolean(profileEl);
  const openProfile = (e) => setProfileEl(e.currentTarget);
  const closeProfile = () => setProfileEl(null);

  // ── Live tick every 30s (for timers)
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);
  const _ = tick; // eslint-disable-line no-unused-vars

  // ── Optimistic break state (covers “shows Away but no break name”)
  const [localBreakKey, setLocalBreakKey] = React.useState(null);
  const [localBreakStartIso, setLocalBreakStartIso] = React.useState(null);

  // ── Time helpers
  const nowMs = Date.now();
  const nowIso = new Date(nowMs).toISOString();
  const parseIso = (s) => {
    const t = Date.parse(String(s || ""));
    return Number.isFinite(t) ? t : null;
  };
  const minutesBetween = (aIso, bIsoOrNow) => {
    const a = parseIso(aIso);
    const b = bIsoOrNow ? parseIso(bIsoOrNow) : nowMs;
    if (!a || !b || b <= a) return 0;
    return Math.round((b - a) / 60000);
  };
  const clamp0 = (n) => Math.max(0, Number.isFinite(n) ? n : 0);

  // Derivations from store-provided stats
  const shiftStartIso = stats?.shiftWindow?.startAt || "";
  const shiftEndIso = stats?.shiftWindow?.endAt || "";
  const leftMin = shiftEndIso ? clamp0(minutesBetween(nowIso, shiftEndIso)) : (stats?.remainingMin ?? 0);
  const onBreakKey = stats?.onBreakKey || undefined;

  const openBreak =
    (Array.isArray(breaksLog) && breaksLog.find(b => !b.end && (onBreakKey ? b.key === onBreakKey : true))) ||
    (Array.isArray(breaksLog) && breaksLog.find(b => !b.end)) ||
    null;

  const isOnBreak = Boolean(onBreakKey) || availability === "away" || Boolean(localBreakKey);

  const currentBreakKey =
    onBreakKey || openBreak?.key || localBreakKey || null;

  const currentBreakLabel =
    currentBreakKey ? (BREAK_META[currentBreakKey]?.label || currentBreakKey) : null;

  const currentBreakDurationMin =
    openBreak?.start
      ? minutesBetween(openBreak.start)
      : (localBreakStartIso ? minutesBetween(localBreakStartIso) : 0);

  const btaUsedMinProp = stats?.btaUsedMin ?? 0;
  const btaRemainingMinProp = stats?.btaRemainingMin ?? 0;
  const btaTotal = btaUsedMinProp + btaRemainingMinProp;

  const fromLogUsed = Array.isArray(breaksLog) && breaksLog.length > 0
    ? breaksLog.reduce((sum, b) => {
      const mins = minutesBetween(b.start, b.end || nowIso);
      return sum + clamp0(mins);
    }, 0)
    : null;

  const optimisticExtra = (!openBreak && localBreakStartIso)
    ? clamp0(minutesBetween(localBreakStartIso))
    : 0;

  const btaUsedLiveMin = fromLogUsed !== null
    ? clamp0(fromLogUsed + optimisticExtra)
    : clamp0(btaUsedMinProp + (isOnBreak ? currentBreakDurationMin : 0));

  const btaRemainingLiveMin = clamp0((btaTotal || 0) - (btaUsedLiveMin || 0));

  const workedMinFallback = stats?.workedMin ?? 0;
  const sumBreakMinutesFrom = (fromIso) => {
    const fromMs = parseIso(fromIso);
    if (!fromMs) return 0;
    const base = (Array.isArray(breaksLog) ? breaksLog : []);
    const totalFromLog = base.reduce((sum, b) => {
      const s = parseIso(b.start);
      const e = parseIso(b.end) || nowMs;
      if (!s) return sum;
      const startClamped = Math.max(s, fromMs);
      if (e <= startClamped) return sum;
      return sum + Math.round((e - startClamped) / 60000);
    }, 0);
    const optimistic = (!openBreak && localBreakStartIso)
      ? Math.round((nowMs - Math.max(parseIso(localBreakStartIso) || 0, fromMs)) / 60000)
      : 0;
    return clamp0(totalFromLog + optimistic);
  };

  const workedLiveMin = shiftStartIso
    ? clamp0(minutesBetween(shiftStartIso) - sumBreakMinutesFrom(shiftStartIso))
    : workedMinFallback;

  const recommendedMax = currentBreakKey ? BREAK_META[currentBreakKey]?.max : undefined;
  const advisoryNote = (() => {
    if (!currentBreakKey) return "Away";
    if (!recommendedMax) return BREAK_META[currentBreakKey]?.desc || "On break";
    if (currentBreakDurationMin > recommendedMax) {
      return `Over by ${currentBreakDurationMin - recommendedMax}m`;
    }
    const remain = recommendedMax - currentBreakDurationMin;
    return remain <= 2 ? "Almost time" : `Up to ${remain}m left (guideline)`;
  })();

  const previousBreaks = Array.isArray(breaksLog)
    ? breaksLog
      .filter((b) => b.end && (!onBreakKey || b.key !== onBreakKey))
      .slice(-10)
      .reverse()
      .map((b) => ({
        key: b.key,
        label: BREAK_META[b.key]?.label || b.key,
        minutes: minutesBetween(b.start, b.end),
      }))
    : [];

  const currentStatus = STATUS.find((s) => s.id === availability) || STATUS[0];
  const displayStatusLabel = isPending
    ? "Loading Status"
    : (isOnBreak && currentBreakLabel ? `Away · ${currentBreakLabel}` : currentStatus.label);

  // ── Actions
  const doStartBreak = (key) => {
    try {
      setLocalBreakKey(key);
      setLocalBreakStartIso(new Date().toISOString());
      onBreakSelect?.(key);
      onChangeAvailability?.("away");
    } catch {}
  };

  const doEndBreak = () => {
    try {
      setLocalBreakKey(null);
      setLocalBreakStartIso(null);
      onBreakSelect?.("end");
      onChangeAvailability?.("available");
    } catch {}
  };

  const chipStyles = (s, selected) => {
    const base = s.color || theme.palette.text.secondary;
    return {
      borderColor: alpha(base, 0.5),
      color: selected ? theme.palette.getContrastText(alpha(base, 0.2)) : base,
      bgcolor: selected ? alpha(base, 0.2) : "transparent",
      "&:hover": { bgcolor: selected ? alpha(base, 0.25) : alpha(theme.palette.primary.main, 0.06) },
      "& .MuiChip-icon": { color: base, mr: 0.75 },
      fontWeight: selected ? 700 : 500,
    };
  };

  const statusColorMap = {
    available: theme.palette.success.main,
    busy: theme.palette.error.main,
    away: theme.palette.warning.main,
    offline: theme.palette.text.disabled,
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        borderRadius: theme.shape.borderRadius + 2,
        px: 1,
        py: 0.5,
        bgcolor: alpha(theme.palette.primary.main, 0.03),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        minWidth: 420,
      }}
      role="contentinfo"
      aria-label="Current user and presence controls"
      aria-busy={isPending ? "true" : undefined}
    >
      {/* Avatar → profile */}
      <IconButton size="small" onClick={openProfile} sx={{ p: 0, borderRadius: "50%" }} aria-label="Open profile" disabled={isPending}>
        <Avatar src={avatarSrc} alt={displayName} sx={{ width: 28, height: 28, fontSize: 12, flexShrink: 0 }}>
          {initials}
        </Avatar>
      </IconButton>

      {/* Name + small identity */}
      <Box sx={{ minWidth: 0, maxWidth: 220 }}>
        <Typography variant="body2" noWrap title={displayName} sx={{ fontWeight: 700, lineHeight: 1.1 }}>
          {displayName}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap title={[role, employeeId && `Employee ID: ${employeeId}`].filter(Boolean).join(" • ")}>
          {[role, employeeId && `${employeeId}`].filter(Boolean).join(" • ")}
        </Typography>
      </Box>

      {/* Availability pill */}
      <Box
        onClick={isPending ? undefined : openMenu}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 1.25,
          pb: 0.75,
          pt: isPending ? 1 : 0.75,
          minWidth: 260,
          height: 40,
          borderRadius: 999,
          cursor: isPending ? "progress" : "pointer",
          userSelect: "none",
          border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
          bgcolor: theme.palette.background.paper,
          "&:hover": { bgcolor: isPending ? theme.palette.background.paper : alpha(theme.palette.primary.main, 0.05) },
        }}
        aria-haspopup="menu"
        aria-expanded={menuOpen ? "true" : undefined}
        title={
          stats?.shiftWindow?.startAt && stats?.shiftWindow?.endAt
            ? `Shift: ${stats.shiftWindow.startAt} → ${stats.shiftWindow.endAt}`
            : "Status & time"
        }
      >
        {isPending ? (
          <Box
            aria-label="Updating status…"
            sx={{
              width: 16, height: 16, borderRadius: "50%",
              border: `2px solid ${alpha(theme.palette.text.primary, 0.35)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.06)}`,
              flexShrink: 0,
            }}
          />
        ) : (
          <FiberManualRecordIcon fontSize="small" sx={{ color: statusColorMap[availability] || theme.palette.text.disabled }} />
        )}

        <Box sx={{ minWidth: 0, opacity: isPending ? 0.9 : 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1 }} noWrap>
            {displayStatusLabel}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ lineHeight: 1.1 }}>
            Active {workedLiveMin}m · Left {leftMin}m · Break {btaUsedLiveMin}/{btaTotal}m
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1 }} />

      {/* Status/Breaks menu */}
      <Menu
        open={menuOpen}
        anchorEl={menuEl}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 420, p: 0.75 } } }}
      >
        <Box sx={{ px: 1.25, pt: 0.5, pb: 0.5 }}>
          <Typography variant="overline" color="text.secondary">
            {isOnBreak ? "Break summary" : "Breaks"}
          </Typography>
        </Box>

        {isOnBreak ? (
          <Box sx={{ px: 1.25, pb: 1 }}>
            <Box sx={{
              p: 1.25, borderRadius: 2,
              border: `1px dashed ${alpha(theme.palette.warning.main, 0.6)}`,
              bgcolor: alpha(theme.palette.warning.main, 0.06),
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {currentBreakLabel || "Away"}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.25 }}>
                Duration: <b>{currentBreakDurationMin}m</b>
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.25 }}>
                Note: <b>{advisoryNote}</b>
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.25 }}>
                Remaining BTA: <b>{btaRemainingLiveMin}m</b>
              </Typography>

              <Button
                onClick={() => { doEndBreak(); closeMenu(); }}
                variant="contained" color="primary" size="small"
                sx={{ mt: 1.25, textTransform: "none", borderRadius: 999 }}
                disabled={isPending}
              >
                Resume work
              </Button>
            </Box>

            {previousBreaks.length > 0 ? (
              <Box sx={{ mt: 1.25 }}>
                <Typography variant="overline" color="text.secondary">Previous breaks</Typography>
                <Box sx={{ mt: 0.75, display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                  {previousBreaks.slice(0, 6).map((b, idx) => (
                    <Chip key={`${b.key}-${idx}`} label={`${b.label}: ${b.minutes}m`} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            ) : null}
          </Box>
        ) : (
          <>
            {Object.entries(BREAK_META).map(([key, meta]) => (
              <MenuItem key={key} onClick={() => { doStartBreak(key); closeMenu(); }} sx={{ py: 1 }} disabled={isPending}>
                <ListItemText
                  primary={meta.label}
                  secondary={meta.desc}
                  primaryTypographyProps={{ variant: "body2" }}
                  secondaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                />
              </MenuItem>
            ))}
          </>
        )}

        {!isOnBreak && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <Box sx={{ px: 1.25, pt: 0.5, pb: 1 }}>
              <Typography variant="overline" color="text.secondary">Status</Typography>
              <Box sx={{ mt: 0.75, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {STATUS.map((s) => {
                  const selected = s.id === availability;
                  return (
                    <Chip
                      key={s.id}
                      icon={<FiberManualRecordIcon sx={{ color: s.color }} />}
                      label={<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <span>{s.label}</span>{selected ? <CheckIcon sx={{ fontSize: 16 }} /> : null}
                      </Box>}
                      variant={selected ? "filled" : "outlined"}
                      onClick={() => { if (!isPending) { try { onChangeAvailability?.(s.id); } catch {} closeMenu(); } }}
                      disabled={isPending}
                      sx={chipStyles(s, selected)}
                      size="medium"
                    />
                  );
                })}
              </Box>
            </Box>
          </>
        )}
      </Menu>

      {/* Profile popover — borderless, minimal */}
      <Menu
        open={profileOpen}
        anchorEl={profileEl}
        onClose={closeProfile}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              width: 320,
              p: 0,
              borderRadius: 3,
              boxShadow: theme.shadows[6],
              border: "none",
              outline: "none",
              overflow: "hidden",
              backgroundImage: "none",
            },
          },
        }}
      >
        {/* Header */}
        <Box sx={{ position: "relative", p: 2, pb: 1.5 }}>
          <IconButton
            size="small"
            onClick={closeProfile}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: alpha(theme.palette.text.primary, 0.06),
              "&:hover": { bgcolor: alpha(theme.palette.text.primary, 0.12) },
            }}
            aria-label="Close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {user?.email && (
            <Typography variant="caption" color="text.secondary" noWrap title={user.email}
              sx={{ display: "block", textAlign: "center", mb: 1 }}>
              {user.email}
            </Typography>
          )}

          <Avatar
            src={avatarSrc}
            alt={displayName}
            sx={{ width: 56, height: 56, fontSize: 22, mx: "auto", mb: 1, boxShadow: theme.shadows[1] }}
          >
            {initials}
          </Avatar>

          <Typography variant="subtitle1" sx={{ textAlign: "center", fontWeight: 700, textTransform: "capitalize" }}>
            Hi, {String(displayName).split(" ")[0] || "there"}!
          </Typography>

          <Box sx={{ mt: 0.75, display: "flex", justifyContent: "center", gap: 0.5, flexWrap: "nowrap", overflow: "hidden" }}>
            {role && (
              <Chip
                size="small"
                variant="filled"
                icon={<AssignmentIndIcon sx={{ fontSize: 16 }} />}
                label={role}
                sx={{
                  bgcolor: alpha(theme.palette.text.primary, 0.06),
                  "& .MuiChip-icon": { color: alpha(theme.palette.text.primary, 0.6) },
                  "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
                }}
              />
            )}
            {employeeId && (
              <Chip
                size="small"
                variant="filled"
                icon={<BadgeIcon sx={{ fontSize: 16 }} />}
                label={employeeId}
                sx={{
                  bgcolor: alpha(theme.palette.text.primary, 0.06),
                  "& .MuiChip-icon": { color: alpha(theme.palette.text.primary, 0.6) },
                  "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
                }}
              />
            )}
            {tenantId && (
              <Chip
                size="small"
                variant="filled"
                icon={<ApartmentIcon sx={{ fontSize: 16 }} />}
                label={tenantId}
                sx={{
                  bgcolor: alpha(theme.palette.text.primary, 0.06),
                  "& .MuiChip-icon": { color: alpha(theme.palette.text.primary, 0.6) },
                  "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
                }}
              />
            )}
          </Box>
        </Box>

        {/* Body */}
        <Box sx={{ p: 1.5, pt: 1.25 }}>
          <Button
            component={MuiLink}
            href={profileHref}
            underline="none"
            target="_self"
            rel="noopener noreferrer"
            variant="text"
            endIcon={<LaunchIcon />}
            fullWidth
            disableElevation
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              py: 0.9,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.12) },
            }}
          >
            View profile
          </Button>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              variant="text"
              onClick={() => { closeProfile(); try { (onSwitch || onLogout)?.(); } catch {} }}
              startIcon={<SwapHorizIcon />}
              fullWidth
              disabled={isPending}
              sx={{ textTransform: "none" }}
            >
              Switch
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => { closeProfile(); try { onLogout?.(); } catch {} }}
              startIcon={<LogoutIcon />}
              fullWidth
              disabled={isPending}
              sx={{ textTransform: "none", boxShadow: "none" }}
            >
              Sign out
            </Button>
          </Stack>

          <Button
            component={MuiLink}
            href={walletHref}
            underline="none"
            target="_blank"
            rel="noopener noreferrer"
            variant="text"
            size="small"
            startIcon={<Box component="img" src={WalletImg} alt="" sx={{ width: 16, height: 16 }} />}
            endIcon={<LaunchIcon />}
            sx={{ mt: 0.75, textTransform: "none", mx: "auto", display: "flex" }}
          >
            Open Wallet
          </Button>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 1.25, pt: 0.75, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            <MuiLink href={privacyHref} underline="hover" color="inherit" target="_self" rel="noopener noreferrer" sx={{ mx: 0.75 }}>
              Privacy Policy
            </MuiLink>
            •
            <MuiLink href={termsHref} underline="hover" color="inherit" target="_self" rel="noopener noreferrer" sx={{ mx: 0.75 }}>
              Terms of Service
            </MuiLink>
          </Typography>
        </Box>
      </Menu>
    </Box>
  );
}
