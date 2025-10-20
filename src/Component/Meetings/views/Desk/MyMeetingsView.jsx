// Path: /src/Component/Meetings/views/Desk/MyMeetingsView.jsx
import React, { useEffect, useMemo, useState, Fragment } from "react";
import {
  Stack, Typography, Divider, Paper, TextField, MenuItem, Button, Chip,
  IconButton, Tooltip, Snackbar, Alert, Grid, Pagination, Box, Tabs, Tab,
  Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { CalendarSearch, Download, RefreshCcw, Video, X } from "lucide-react";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // CHANGED (restore date UI)
import { isSameDay, startOfDay } from "date-fns";

import MeetingTable from "../../components/MeetingTable";
import MeetingCard from "../../components/MeetingCard";

import { useMeetingsStore } from "../../../store/scheduling/useMeetingsStore";
import { useConferencingStore } from "../../../store/scheduling/useConferencingStore";

/* ---------- human timezone + formats ---------- */
const deviceTZ = (() => {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch { return ""; }
})();
const fmtDayLong = (d) => d.toLocaleDateString(undefined, { weekday:"long", year:"numeric", month:"long", day:"numeric" });
const fmtTime = (d) => d.toLocaleTimeString(undefined, { hour:"numeric", minute:"2-digit" });

function deriveStatus(m){
  const now = Date.now();
  const s = (m.status || m.state || "").toLowerCase();
  if (s.includes("cancel")) return { label:"Cancelled", color:"error" };
  if (s.includes("done") || s.includes("complete")) return { label:"Done", color:"success" };
  if (now >= new Date(m.start).getTime() && now <= new Date(m.end).getTime()) return { label:"Live", color:"warning" };
  if (new Date(m.end).getTime() < now) return { label:"Done", color:"success" };
  return { label:"Upcoming", color:"primary" };
}

/* ---------- compact day table ---------- */
function DayTable({ rows, onJoin, onCancel, onIcs }) {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 180, fontWeight: 700 }}>Time ({deviceTZ})</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Invitee / Title</TableCell>
            <TableCell align="right" sx={{ width: 130, fontWeight: 700 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((m) => {
            const s = new Date(m.start), e = new Date(m.end);
            return (
              <TableRow key={m.id} hover>
                <TableCell sx={{ whiteSpace:"nowrap", fontWeight:600 }}>
                  {fmtTime(s)} – {fmtTime(e)}
                </TableCell>
                <TableCell sx={{ maxWidth:0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip size="small" label={m.eventTypeId || "Meeting"} />
                    <Typography variant="body2" noWrap title={m.invitee?.name || m.invitee?.email || ""}>
                      {m.invitee?.name || m.invitee?.email || "Invitee"}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Join"><span><IconButton size="small" onClick={() => onJoin(m)}><Video size={16}/></IconButton></span></Tooltip>
                  <Tooltip title="Download .ics"><IconButton size="small" onClick={() => onIcs(m)}><Download size={16}/></IconButton></Tooltip>
                  <Tooltip title="Cancel"><IconButton size="small" onClick={() => onCancel(m)}><X size={16}/></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
          {!rows.length && (
            <TableRow>
              <TableCell colSpan={3}>
                <Typography variant="body2" color="text.secondary">No meetings.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default function MyMeetingsView() {
  const theme = useTheme();
  const mtg = useMeetingsStore();
  const conf = useConferencingStore();

  const [view, setView] = useState("calendar");       // default Calendar
  const [scope, setScope] = useState("upcoming");
  const [q, setQ] = useState("");
  const [toast, setToast] = useState(null);

  // Table/Cards date filter (MUI calendar input) — hidden on Calendar tab
  const [filterDay, setFilterDay] = useState(null);   // CHANGED

  // Cards pagination
  const [cardPage, setCardPage] = useState(1);
  const [cardRpp, setCardRpp] = useState(6);

  // Calendar selection
  const [selectedDay, setSelectedDay] = useState(() => startOfDay(new Date()));

  // Day table pagination
  const [dayPage, setDayPage] = useState(1);
  const [dayRpp, setDayRpp] = useState(8);

  useEffect(() => { mtg.loaded || mtg.loadFixtures(); }, [mtg]);

  const baseAll = mtg.meetings || [];

  // Search
  const searched = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return baseAll;
    return baseAll.filter((m) =>
      [m.eventTypeId, m.invitee?.name, m.invitee?.email, m.location?.type, m.location?.link, m.id]
        .join(" ").toLowerCase().includes(qq)
    );
  }, [baseAll, q]);

  // Table/Cards filtered (Calendar ignores scope + has its own selectedDay)
  const filtered = useMemo(() => {
    const now = Date.now();
    return searched.filter((m) => {
      if (view === "calendar") return true;
      const t = new Date(m.start).getTime();
      if (scope === "upcoming" && t < now) return false;
      if (scope === "past" && t >= now) return false;
      if (filterDay) return isSameDay(new Date(m.start), filterDay); // CHANGED (date filter)
      return true;
    });
  }, [searched, scope, view, filterDay]);

  useEffect(() => setCardPage(1), [filtered.length, cardRpp, view]);
  const cardTotalPages = Math.max(1, Math.ceil((filtered.length || 0) / cardRpp));
  const cardSlice = useMemo(() => filtered.slice((cardPage - 1) * cardRpp, (cardPage - 1) * cardRpp + cardRpp), [filtered, cardPage, cardRpp]);

  // Calendar data uses searched (search applies; scope doesn’t)
  const meetingsByDay = useMemo(() => {
    const map = new Map();
    for (const m of searched) {
      const key = startOfDay(new Date(m.start)).toISOString();
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [searched]);

  const dayMeetings = useMemo(
    () => searched.filter((m) => isSameDay(new Date(m.start), selectedDay)),
    [searched, selectedDay]
  );

  useEffect(() => setDayPage(1), [selectedDay, dayRpp, dayMeetings.length]);
  const dayTotalPages = Math.max(1, Math.ceil((dayMeetings.length || 0) / dayRpp));
  const daySlice = useMemo(() => dayMeetings.slice((dayPage - 1) * dayRpp, (dayPage - 1) * dayRpp + dayRpp), [dayMeetings, dayPage, dayRpp]);

  /* --- Calendar day: reliable dot + tooltip; purple ring for selected --- */
  const renderDayCell = (date, _sel, pickersDayProps) => {
    const dayKey = startOfDay(date).toISOString();
    const count = meetingsByDay.get(dayKey) || 0;
    const has = count > 0;

    const day = (
      <PickersDay
        {...pickersDayProps}
        day={date}
        sx={{
          position: "relative",
          // Selected ring in purple (transparent fill)
          "&.Mui-selected": {
            bgcolor: "transparent !important",
            color: "inherit",
            border: `2px solid ${theme.palette.primary.main}`,
          },
          // Today ring also purple-ish
          "&.MuiPickersDay-today": {
            border: `1px solid ${alpha(theme.palette.primary.main, 0.8)}`,
          },
        }}
      />
    );

    // Overlay a tiny centered dot (like your screenshot)
    const withDot = has ? (
      <Box sx={{ position: "relative" }}>
        {day}
        <Box
          sx={{
            position: "absolute",
            bottom: 6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: theme.palette.primary.main,
          }}
        />
      </Box>
    ) : (
      day
    );

    return has ? (
      <Tooltip
        title={`You have ${count} meeting${count === 1 ? "" : "s"} on ${fmtDayLong(date)}${deviceTZ ? ` (${deviceTZ})` : ""}`}
        placement="top"
        arrow
      >
        <Box component="span">{withDot}</Box>
      </Tooltip>
    ) : (
      withDot
    );
  };

  const refresh = () => setToast({ msg: "Refreshed (mock)", sev: "info" });

  const onJoin = async (m) => {
    const res = await conf.createRoomForMeeting(m.id, {
      provider: m.location?.type || "google_meet",
      title: `Notify • ${m.eventTypeId}`,
      start: m.start,
      end: m.end,
      attendees: (m.attendees || []).map((a) => ({ name: a.name, email: a.email })),
    });
    if (res?.joinUrl) {
      mtg.markJoined(m.id);
      window.open(res.joinUrl, "_blank", "noopener,noreferrer");
    }
  };
  const onCancel = async (m) => { if (window.confirm("Cancel this meeting?")) { await mtg.cancel(m.id, "user_request"); setToast({ msg:"Meeting cancelled", sev:"success" }); } };
  const onOpen = (m) => setToast({ msg: `Open meeting ${m.id} (placeholder)`, sev: "info" });
  const downloadICS = (m) => {
    const ics = mtg.buildICSFor(m.id);
    if (!ics) return;
    const blob = new Blob([ics.text], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = ics.filename; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 400);
  };

  return (
    <Stack gap={2}>
      {/* Title + Tabs on left; filters on right */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0 }}>
          <Typography variant="h6">My Meetings</Typography>
          <Tabs
            value={view}
            onChange={(_, v) => setView(v)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ minHeight: 36, "& .MuiTab-root": { minHeight: 36, px: 1.25, textTransform: "none" } }}
          >
            <Tab value="calendar" label="Calendar" />
            <Tab value="table" label="Table" />
            <Tab value="cards" label="Cards" />
          </Tabs>
        </Stack>

        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
          <TextField
            size="small"
            label="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            InputProps={{ startAdornment: <CalendarSearch size={16} style={{ marginRight: 6 }} /> }}
          />

          {/* Scope (disabled on Calendar) */}
          <TextField
            select
            size="small"
            label="Scope"
            disabled={view === "calendar"}
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="past">Past</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </TextField>

          {/* Date filter — show only for Table/Cards, not Calendar (MUI DatePicker UI) */}
          {view !== "calendar" && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Filter date"
                value={filterDay}
                onChange={(v) => setFilterDay(v ? startOfDay(v) : null)}
                slotProps={{ textField: { size: "small", sx: { minWidth: 170 } } }}
                views={["year", "month", "day"]}
              />
            </LocalizationProvider>
          )}

          <Button startIcon={<RefreshCcw />} onClick={refresh} variant="contained">Refresh</Button>
          <Chip
            size="small"
            label={`${filtered.length} item${filtered.length === 1 ? "" : "s"}`}
            sx={{ bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: "primary.main" }}
          />
        </Stack>
      </Stack>
      <Divider />

      <Paper
        variant="outlined"
        sx={{
          p: view === "cards" || view === "calendar" ? 2 : 0,
          borderRadius: 2,
          borderColor: (t) => alpha(t.palette.primary.main, 0.45), // purple border
          bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
          minHeight: 500, // keep height
        }}
      >
        {view === "table" && (
          <MeetingTable meetings={filtered} onJoin={onJoin} onCancel={onCancel} onOpen={onOpen} />
        )}

        {view === "cards" && (
          <Stack gap={2}>
            <Grid container spacing={2}>
              {cardSlice.map((m) => (
                <Grid item xs={12} sm={6} lg={4} key={m.id}>
                  <Stack gap={1}>
                    <MeetingCard meeting={m} onJoin={onJoin} onCancel={onCancel} onOpen={onOpen} />
                    <Stack direction="row" gap={1} justifyContent="flex-end">
                      <Tooltip title="Download .ics"><IconButton onClick={() => downloadICS(m)}><Download size={16}/></IconButton></Tooltip>
                      <Chip size="small" label={m.id} />
                    </Stack>
                  </Stack>
                </Grid>
              ))}
            </Grid>

            {!filtered.length && <Typography align="center">No meetings</Typography>}

            {filtered.length > cardRpp && (
              <Stack alignItems="center" sx={{ pt: 1 }}>
                <Pagination page={cardPage} count={cardTotalPages} onChange={(_, p) => setCardPage(p)} />
              </Stack>
            )}
          </Stack>
        )}

        {view === "calendar" && (
          <Fragment>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack direction={{ xs: "column", md: "row" }} gap={2}>
                {/* LEFT: Calendar + summary */}
                <Box
                  sx={{
                    minWidth: { xs: 320, sm: 360, md: 380 },
                    pr: { md: 1 },
                    "& .MuiPickersDay-root": { width: 44, height: 44 },
                    "& .MuiDayCalendar-weekDayLabel": { fontWeight: 600 },
                  }}
                >
                  <DateCalendar
                    value={selectedDay}
                    onChange={(d) => setSelectedDay(startOfDay(d))}
                    showDaysOutsideCurrentMonth
                    renderDay={renderDayCell}
                  />

                  {/* Summary under calendar (same as before) */}
                  <Stack gap={1} sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Summary — {fmtDayLong(selectedDay)}{deviceTZ ? ` (${deviceTZ})` : ""}
                    </Typography>

                    {dayMeetings.slice(0, 6).map((m) => {
                      const s = new Date(m.start), e = new Date(m.end);
                      const st = deriveStatus(m);
                      return (
                        <Paper key={`summary-${m.id}`} variant="outlined" sx={{ p: 1, borderRadius: 2, display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{
                            width: 8, height: 8, borderRadius: "50%",
                            bgcolor: st.color==="error" ? theme.palette.error.main
                              : st.color==="success" ? theme.palette.success.main
                              : st.color==="warning" ? theme.palette.warning.main
                              : theme.palette.primary.main
                          }}/>
                          <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 600 }}>
                            {fmtTime(s)} – {fmtTime(e)}
                          </Typography>
                          <Typography variant="body2" sx={{ flex: 1 }} noWrap title={m.invitee?.name || m.invitee?.email || "Invitee"}>
                            {m.invitee?.name || m.invitee?.email || "Invitee"}
                          </Typography>
                          <Chip size="small" color={st.color} label={st.label} />
                        </Paper>
                      );
                    })}
                    {dayMeetings.length === 0 && (
                      <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">No meetings scheduled.</Typography>
                      </Paper>
                    )}
                    {dayMeetings.length > 6 && (
                      <Typography variant="caption" color="text.secondary">+{dayMeetings.length - 6} more…</Typography>
                    )}
                  </Stack>
                </Box>

                {/* RIGHT: day table + pagination, fixed min height */}
                <Box sx={{ flex: 1, minWidth: 320, minHeight: 500, display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {dayMeetings.length
                      ? `Meetings on ${fmtDayLong(selectedDay)}${deviceTZ ? ` (${deviceTZ})` : ""}`
                      : `No meetings on ${fmtDayLong(selectedDay)}${deviceTZ ? ` (${deviceTZ})` : ""}`}
                  </Typography>

                  <Box sx={{ flex: 1 }}>
                    <DayTable rows={daySlice} onJoin={onJoin} onCancel={onCancel} onIcs={downloadICS} />
                  </Box>

                  {dayMeetings.length > dayRpp && (
                    <Stack alignItems="center" sx={{ pt: 1 }}>
                      <Pagination page={dayPage} count={dayTotalPages} onChange={(_, p) => setDayPage(p)} />
                    </Stack>
                  )}
                </Box>
              </Stack>
            </LocalizationProvider>
          </Fragment>
        )}
      </Paper>

      <Snackbar open={!!toast} autoHideDuration={2000} onClose={() => setToast(null)} anchorOrigin={{ vertical:"bottom", horizontal:"center" }}>
        {toast ? <Alert severity={toast.sev}>{toast.msg}</Alert> : null}
      </Snackbar>
    </Stack>
  );
}
