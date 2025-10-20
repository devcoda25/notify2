// Path: /src/Component/Meetings/views/AvailabilityRoutingView.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  Divider,
  Paper,
  TextField,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { CalendarRange, RefreshCw, Bug, Pencil } from "lucide-react";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AvailabilityEditor from "../../components/AvailabilityEditor";
import { useAvailabilityStore } from "../../../store/scheduling/useAvailabilityStore";
import { usePoolsStore } from "../../../store/scheduling/usePoolsStore";
import { generateSlotsFromRules } from "../../utils/slotProbe";

function ymd(date) {
  const pad = (n) => String(n).padStart(2, "0");
  const d = new Date(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function addDays(dateStr, delta) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + delta);
  return ymd(d);
}
function formatHHMMLocal(iso, tz) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz || Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
      .format(new Date(iso))
      .replace(/\s/g, "");
  } catch {
    return new Date(iso).toISOString().slice(11, 16);
  }
}
function weekdayLabel(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "long" });
}

export default function AvailabilityRoutingView() {
  const theme = useTheme();
  const av = useAvailabilityStore();
  const pools = usePoolsStore();

  useEffect(() => {
    av.loaded || av.loadFixtures?.();
    pools.loaded || pools.loadFixtures?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [ownerType, setOwnerType] = useState("user");
  const [ownerId, setOwnerId] = useState("usr_alpha");

  const [startDateStr, setStartDateStr] = useState(() => ymd(new Date()));
  const [startDateObj, setStartDateObj] = useState(() => new Date());
  const [rangeDays, setRangeDays] = useState(7);

  const endDate = useMemo(() => addDays(startDateStr, rangeDays - 1), [startDateStr, rangeDays]);

  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState({ days: {}, slotSizeMinutes: 30 });
  const [dirty, setDirty] = useState(false);
  const [probe, setProbe] = useState(null);
  const [showDiag, setShowDiag] = useState(false);

  const [openEditor, setOpenEditor] = useState(false);

  const profile = useMemo(
    () => (av.getProfileByOwner ? av.getProfileByOwner(ownerType, ownerId) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ownerType, ownerId, av.loaded]
  );

  const storeTZs = av.timezones || av.getTimezones?.() || [];
  const viewerTZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Kampala";
  const chipTZ = profile?.timezone || viewerTZ;

  const selectedPool = useMemo(
    () => (ownerType === "pool" ? (pools.pools || []).find((p) => p.id === ownerId) : null),
    [ownerType, ownerId, pools.pools]
  );
  const memberCount = selectedPool?.members?.length || 0;

  const runProbe = () => {
    if (!profile) return null;
    return generateSlotsFromRules(
      profile.rules || [],
      profile.timezone || viewerTZ,
      startDateStr,
      endDate,
      { slotSizeMinutes: 30 }
    );
  };

  const compute = async () => {
    if (dirty) return;
    setLoading(true);
    const merged = await av.computeSlots?.(
      { ownerType, ownerId },
      { startDate: startDateStr, endDate },
      { slotSizeMinutes: 30, bufferBeforeMinutes: 5, bufferAfterMinutes: 5 }
    );
    setSlots(merged || { days: {}, slotSizeMinutes: 30 });
    setProbe(runProbe());
    setLoading(false);
  };

  useEffect(() => {
    compute(); // auto on mount
    // eslint-disable-next-line
  }, []);

  const totalSlots = useMemo(
    () => Object.values(slots.days || {}).reduce((acc, arr) => acc + (arr?.length || 0), 0),
    [slots]
  );
  const probeTotal = useMemo(
    () => (probe ? Object.values(probe.days || {}).reduce((acc, arr) => acc + (arr?.length || 0), 0) : 0),
    [probe]
  );

  const mismatch =
    !loading && profile && ownerType === "user" && probe && probeTotal > 0 && totalSlots === 0;

  // Daily min–max range
  const dayRange = (arr = [], tz) => {
    if (!arr || arr.length === 0) return null;
    const starts = arr.map((s) => formatHHMMLocal(s.start, tz)).sort();
    const ends = arr.map((s) => formatHHMMLocal(s.end, tz)).sort();
    return `${starts[0]}–${ends[ends.length - 1]}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack gap={2}>
        <Typography variant="h6">Availability & Routing</Typography>
        <Divider />

        {/* Top Controls with fixed height & two-row grid (controls row + chips row) */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            borderColor: (t) => alpha(t.palette.primary.main, 0.25),
            bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
          }}
        >
          {/* Controls Row */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "130px 200px 170px 140px 1fr auto",
              columnGap: 1,
              rowGap: 1,
              alignItems: "center",
              minHeight: 72, // <-- ensures inputs don't get compressed
            }}
          >
            {/* Col 1: Owner Type */}
            <TextField
              size="small"
              select
              label="Owner Type"
              value={ownerType}
              onChange={(e) => setOwnerType(e.target.value)}
              sx={{ gridColumn: "1 / 2" }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="pool">Pool</MenuItem>
            </TextField>

            {/* Col 2: Owner Id / Pool */}
            {ownerType === "user" ? (
              <TextField
                size="small"
                label="User ID"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                sx={{ gridColumn: "2 / 3" }}
              />
            ) : (
              <TextField
                size="small"
                select
                label="Pool"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                sx={{ gridColumn: "2 / 3" }}
              >
                {(pools.pools || []).map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {/* Col 3: Start date */}
            <DatePicker
              label="Start date"
              value={startDateObj}
              onChange={(val) => {
                if (!val) return;
                const d = new Date(val);
                setStartDateObj(d);
                setStartDateStr(ymd(d));
              }}
              slotProps={{ textField: { size: "small" } }}
              sx={{ gridColumn: "3 / 4" }}
            />

            {/* Col 4: Range */}
            <TextField
              size="small"
              select
              label="Range"
              value={rangeDays}
              onChange={(e) => setRangeDays(Number(e.target.value))}
              sx={{ gridColumn: "4 / 5" }}
            >
              {[7, 14, 21, 28].map((d) => (
                <MenuItem key={d} value={d}>
                  {d} days
                </MenuItem>
              ))}
            </TextField>

            {/* Col 5: Toggle Diagnostics/Slots */}
            <Chip
              color={showDiag ? "warning" : "success"}
              clickable
              onClick={() => setShowDiag((s) => !s)}
              icon={<Bug size={14} />}
              label={showDiag ? "Show Bookable Slots" : `Slots: ${totalSlots}`}
              title={showDiag ? "Switch to bookable slots" : "Click to toggle diagnostics"}
              sx={{ gridColumn: "5 / 6", justifySelf: "start" }}
            />

            {/* Col 6: Compute (extreme right) */}
            <Button
              startIcon={<RefreshCw size={16} />}
              variant="contained"
              onClick={compute}
              disabled={dirty}
              title={dirty ? "Save changes in the editor before computing" : ""}
              sx={{ gridColumn: "6 / 7", justifySelf: "end" }}
            >
              Compute
            </Button>
          </Box>

          {/* Chips Row (aligned under their fields) */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "130px 200px 170px 140px 1fr auto",
              columnGap: 1,
              rowGap: 1,
              mt: 1,
            }}
          >
            {/* Under Owner Type + ID: Owner chip(s) */}
            <Stack direction="row" gap={1} sx={{ gridColumn: "1 / span 2" }}>
              <Chip size="small" label={`Owner: ${ownerType}:${ownerId}`} />
              {ownerType === "pool" && <Chip size="small" label={`Members: ${memberCount}`} />}
            </Stack>

            {/* Under Date + Range: TZ + date window */}
            <Stack direction="row" gap={1} sx={{ gridColumn: "3 / span 2" }}>
              <Chip size="small" label={`TZ: ${chipTZ}`} />
              <Chip
                icon={<CalendarRange size={14} />}
                size="small"
                label={`${startDateStr} → ${endDate}`}
              />
              {Array.isArray(storeTZs) && storeTZs.length > 0 && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={`Store TZs: ${storeTZs.length}`}
                  title={storeTZs.slice(0, 10).join(", ") + (storeTZs.length > 10 ? "…" : "")}
                />
              )}
            </Stack>
          </Box>
        </Paper>

        {/* Toggle: Diagnostics OR Bookable Slots */}
        {showDiag ? (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Diagnostics
            </Typography>
            {!profile ? (
              <Alert severity="info">No availability profile found for this owner.</Alert>
            ) : (
              <Stack gap={1}>
                <Box sx={{ fontFamily: "monospace", fontSize: 12, whiteSpace: "pre-wrap" }}>
                  <strong>Profile summary:</strong>{" "}
                  {JSON.stringify(
                    {
                      ownerType: profile.ownerType,
                      ownerId: profile.ownerId,
                      timezone: profile.timezone,
                      rules: (profile.rules || []).map((r) => ({
                        weekday: r.weekday,
                        weekdayJS: r.weekdayJS,
                        intervals: r.intervals,
                      })),
                    },
                    null,
                    2
                  )}
                </Box>

                <Stack direction="row" gap={1} flexWrap="wrap">
                  <Chip label={`Probe total: ${probeTotal}`} />
                  <Chip label={`Engine total: ${totalSlots}`} />
                  {!loading && profile && ownerType === "user" && probe && probeTotal > 0 && totalSlots === 0 && (
                    <Chip color="warning" label="Mismatch (probe found slots, engine returned none)" />
                  )}
                </Stack>

                {!loading && profile && ownerType === "user" && probe && probeTotal > 0 && totalSlots === 0 && (
                  <Alert severity="warning">
                    Local probe generated slots from your saved rules, but the store engine returned none.
                    Likely causes: weekday indexing mismatch (ISO vs JS), or engine ignores pool/user profiles.
                  </Alert>
                )}
              </Stack>
            )}
          </Paper>
        ) : (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="subtitle1">Bookable Slots</Typography>
              <Stack direction="row" gap={1}>
                <Chip size="small" label={`Timezone: ${chipTZ}`} />
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Pencil size={16} />}
                  onClick={() => setOpenEditor(true)}
                >
                  Edit Availability
                </Button>
              </Stack>
            </Stack>

            {!loading && totalSlots === 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                No slots available for <b>{ownerType}:{ownerId}</b> between <b>{startDateStr}</b> and <b>{endDate}</b>.
                <br />
                {ownerType === "pool"
                  ? memberCount === 0
                    ? "This pool has no members. Add members or switch to a user."
                    : "None of the pool members have available time in this window."
                  : profile
                  ? "You have a profile, but your intervals don’t intersect this date range. Extend the range or adjust your weekday hours."
                  : "No availability profile found. Click “Edit Availability” to add your working hours, then Save."}
              </Alert>
            )}

            {loading ? (
              <Stack alignItems="center" py={4}>
                <CircularProgress />
              </Stack>
            ) : (
              <Stack gap={1.25}>
                {Object.entries(slots.days || {}).map(([date, arr]) => {
                  const wday = weekdayLabel(date);
                  const range = dayRange(arr, chipTZ);
                  return (
                    <Box key={date}>
                      {/* Day header: all info on the top-left */}
                      <Typography variant="body2" color="text.secondary">
                        {wday} • {date} • TZ {chipTZ} • {range ? `Range: ${range}` : "No availability"}
                      </Typography>

                      <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 0.75 }}>
                        {arr.length === 0 ? (
                          <Chip
                            size="small"
                            label="No available time slots today — adjust your working hours or extend the window."
                            sx={{
                              bgcolor: alpha(theme.palette.primary.light, 0.08),
                              borderColor: alpha(theme.palette.primary.main, 0.25),
                            }}
                            variant="outlined"
                          />
                        ) : (
                          arr.map((s, i) => (
                            <Chip
                              key={i}
                              size="small"
                              label={`${formatHHMMLocal(s.start, chipTZ)}–${formatHHMMLocal(s.end, chipTZ)}`}
                              sx={{
                                bgcolor: alpha(theme.palette.primary.light, 0.12),
                                borderColor: alpha(theme.palette.primary.main, 0.25),
                              }}
                              variant="outlined"
                            />
                          ))
                        )}
                      </Stack>

                      <Divider sx={{ my: 1.25 }} />
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Paper>
        )}

        {/* Overlay editor */}
        {openEditor && (
          <Box
            onClick={() => setOpenEditor(false)}
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: (t) => t.zIndex.modal,
              bgcolor: "rgba(0,0,0,0.35)",
              display: "grid",
              placeItems: "center",
              p: 1.5,
            }}
          >
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                width: { xs: "98%", md: 980 },
                maxWidth: "98%",
                maxHeight: { xs: "92%", md: "90%" },
                overflow: "auto",
                bgcolor: (t) => t.palette.background.paper,
                p: 0,
                borderRadius: 2,
              }}
            >
              <AvailabilityEditor
                key={`editor:${ownerType}:${ownerId}`}
                ownerType={ownerType}
                ownerId={ownerId}
                onSaved={() => {
                  setDirty(false);
                  compute();
                  setOpenEditor(false);
                }}
                onDirtyChange={setDirty}
              />
            </Box>
          </Box>
        )}
      </Stack>
    </LocalizationProvider>
  );
}
