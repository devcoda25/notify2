import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Grid, Stack, Typography, Paper, Chip,
  Tooltip, IconButton, Button, TextField, FormControl, Select, MenuItem, InputLabel, Pagination
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDialerStore } from "../../store/useDialerStore";
import EscalationDetailsDialog from "./EscalationDetailsDialog";

/* =================== TUNABLES =================== */
const CONTENT_MAX_WIDTH = "96%";
const LEFT_COL_XS = 12, LEFT_COL_MD = 3, LEFT_COL_LG = 2.8;   // counters column (narrow)
const RIGHT_COL_XS = 12, RIGHT_COL_MD = 9, RIGHT_COL_LG = 9.2; // table column (wide)
const RIGHT_PANE_HEIGHT = 450;          // fixed height of the right panel
const ROWS_PER_PAGE = 4;                // paginate 4 per page
const SLA_SOON_MINUTES = 60;
/* ================================================= */

/* ---------------- tiny sparkline ---------------- */
function Sparkline({ data = [], width = 90, height = 20 }) {
  const t = useTheme();
  if (!data.length) return null;
  const pad = 2;
  const n = Math.max(1, data.length);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = (max - min) || 1;
  const x = (i) => pad + ((width - 2 * pad) * i) / Math.max(1, n - 1);
  const y = (v) => height - pad - ((v - min) / span) * (height - 2 * pad);
  let d = "";
  data.forEach((v, i) => { d += (i === 0 ? `M ${x(i)} ${y(v)}` : ` L ${x(i)} ${y(v)}`); });

  const last = data[n - 1] ?? 0;
  const prev = data[n - 2] ?? last;
  const dir = last > prev ? "up" : last < prev ? "down" : "flat";
  const stroke =
    dir === "up" ? t.palette.success.main :
    dir === "down" ? t.palette.error.main :
    t.palette.text.secondary;

  return (
    <svg width={width} height={height} style={{ display: "block" }} aria-hidden>
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

/* ------------- compact stat with trend ---------- */
function Stat({ label, value, series, hint }) {
  const t = useTheme();
  const hasTrend = Array.isArray(series) && series.length > 1;
  const last = hasTrend ? series[series.length - 1] : null;
  const prev = hasTrend ? series[series.length - 2] : last;
  const delta = hasTrend ? (last - prev) : 0;
  const pct = hasTrend ? Math.round((delta / (prev === 0 ? 1 : prev)) * 100) : 0;
  const dir = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const color =
    dir === "up" ? t.palette.success.main :
    dir === "down" ? t.palette.error.main :
    t.palette.text.secondary;

  return (
    <Paper variant="outlined" sx={{ p: 1, borderRadius: 1, minHeight: 52 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ minWidth: 0, pr: 1.25 }}>
          <Typography variant="caption" color="text.secondary" noWrap>{label}</Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="subtitle1" sx={{ lineHeight: 1.1 }} noWrap>{value ?? "—"}</Typography>
            {hasTrend ? (
              <Stack direction="row" alignItems="center" spacing={0} sx={{ color }}>
                {dir === "up" && <ArrowDropUpIcon fontSize="small" />}
                {dir === "down" && <ArrowDropDownIcon fontSize="small" />}
                {dir === "flat" && <RemoveIcon fontSize="small" />}
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {pct > 0 ? `+${pct}%` : `${pct}%`}
                </Typography>
              </Stack>
            ) : hint ? (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }} noWrap>{hint}</Typography>
            ) : null}
          </Stack>
        </Box>
        <Box sx={{ flexShrink: 0 }}>{hasTrend && <Sparkline data={series} />}</Box>
      </Box>
    </Paper>
  );
}

/* --------------- helpers / formatting ---------- */
const toDate = (s) => s ? new Date(s) : null;
const fmtTime = (d) => d ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(d) : "—";
const minutesUntil = (d) => d ? Math.floor((d.getTime() - Date.now()) / 60000) : null;

const STATUS_COLORS = {
  Open: "default",
  "In Progress": "primary",
  "Waiting Customer": "warning",
  Resolved: "success",
  Closed: "success",
};

const PRIORITY_COLORS = {
  "P1": "error",
  "P2": "warning",
  "P3": "default",
  "P4": "default",
};

/* ---------- default sample if none provided ---- */
function makeSample() {
  const now = Date.now();
  const addMin = (m) => new Date(now + m * 60000).toISOString();
  return [
    {
      id: "ESC-1001", customerName: "Jane Doe", phone: "+256700123456",
      category: "Escalations", subCategory: "Supervisor Intervention", reason: "Urgent Resolution",
      priority: "P1", openedAt: addMin(-90), updatedAt: addMin(-5), slaDue: addMin(30),
      status: "In Progress", progress: 40, tags: ["voice", "drop"], notes: "Investigating SIP trunk"
    },
    {
      id: "ESC-1002", customerName: "Mark L", phone: "+256781234567",
      category: "Escalations", subCategory: "Supervisor Intervention", reason: "Urgent Resolution",
      priority: "P2", openedAt: addMin(-300), updatedAt: addMin(-120), slaDue: addMin(-10),
      status: "Open", progress: 10, tags: ["billing"], notes: "Awaiting logs"
    },
    {
      id: "ESC-1003", customerName: "Ada K", phone: "+256772223344",
      category: "Escalations", subCategory: "Supervisor Intervention", reason: "Urgent Resolution",
      priority: "P3", openedAt: addMin(-1440), updatedAt: addMin(-60), slaDue: addMin(240),
      status: "Waiting Customer", progress: 60, tags: ["followup"], notes: "Customer to retry"
    },
    {
      id: "ESC-1004", customerName: "Liam O", phone: "+256709991111",
      category: "Escalations", subCategory: "Supervisor Intervention", reason: "Urgent Resolution",
      priority: "P1", openedAt: addMin(-30), updatedAt: addMin(-5), slaDue: addMin(15),
      status: "Open", progress: 5, tags: ["network"], notes: "Packet loss detected"
    },
    {
      id: "ESC-0999", customerName: "Nora B", phone: "+256701010101",
      category: "Escalations", subCategory: "Supervisor Intervention", reason: "Urgent Resolution",
      priority: "P2", openedAt: addMin(-180), updatedAt: addMin(-10), slaDue: addMin(-120),
      status: "Resolved", progress: 100, tags: ["resolved"], notes: "Patched by Tier2"
    },
  ];
}

/* ----- Status chip that self-fills for IN PROGRESS (no external bar) ----- */
function StatusProgressChip({ status, progress = 0 }) {
  const t = useTheme();
  const isProgress = String(status) === "In Progress";
  const p = Math.max(0, Math.min(100, Number(progress || 0)));

  if (!isProgress) {
    const color = STATUS_COLORS[status] || "default";
    return <Chip size="small" label={status || "Open"} color={color} sx={{ borderRadius: 1 }} />;
  }

  const baseBg = t.palette.mode === "dark"
    ? alpha(t.palette.primary.main, 0.18)
    : alpha(t.palette.primary.main, 0.14);

  return (
    <Chip
      size="small"
      label="In Progress"
      sx={{
        borderRadius: 1,
        position: "relative",
        overflow: "hidden",
        // light purple base
        bgcolor: baseBg,
        border: `1px solid ${t.palette.primary.main}`,
        // text color adapts as fill grows
        "& .MuiChip-label": {
          position: "relative",
          zIndex: 1,
          color: p > 50 ? t.palette.common.white : t.palette.text.primary,
          fontWeight: 600,
        },
        // purple fill grows left→right
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          width: `${p}%`,
          backgroundColor: t.palette.primary.main,
          transition: "width 300ms ease",
          zIndex: 0,
        },
      }}
    />
  );
}

/* ----------- main: EscalationPanel ------------- */
export default function EscalationPanel({
  items,
  data = {},
  onCopyId,
}) {
  const allItems = useMemo(() => {
    const fromData = Array.isArray(data?.items) ? data.items
      : Array.isArray(data?.cases)
        ? data.cases.map((c, i) => ({
            id: c.id || `CASE-${i + 1}`,
            customerName: c.customerName || c.title || "Unknown",
            reason: c.reason || c.description || "—",
            priority: c.priority || "P3",
            openedAt: c.openedAt, updatedAt: c.updatedAt, slaDue: c.slaDue,
            status: c.status || "Open", progress: c.progress ?? 0, phone: c.phone || "",
            category: c.category || "Escalations", subCategory: c.subCategory || "Supervisor Intervention",
            tags: c.tags || [],
            notes: c.notes || "",
          }))
        : null;
    return Array.isArray(items) ? items : (fromData || makeSample());
  }, [items, data]);

  /* live tick for SLA countdown */
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((x) => (x + 1) % 1000000), 60_000);
    return () => clearInterval(id);
  }, []);

  /* metrics for left counters */
  const now = new Date();
  const minutesUntil = (d) => d ? Math.floor((d.getTime() - Date.now()) / 60000) : null;
  const metrics = useMemo(() => {
    const openStatuses = new Set(["Open", "In Progress", "Waiting Customer"]);
    const resolvedStatuses = new Set(["Resolved", "Closed"]);
    let open = 0, overdue = 0, dueSoon = 0, resolvedToday = 0;
    for (const it of allItems) {
      const st = String(it.status || "Open");
      const isOpen = openStatuses.has(st);
      const due = toDate(it.slaDue);
      if (isOpen) {
        open += 1;
        if (due) {
          const mins = minutesUntil(due);
          if (mins != null) {
            if (mins < 0) overdue += 1;
            else if (mins <= SLA_SOON_MINUTES) dueSoon += 1;
          }
        }
      } else if (resolvedStatuses.has(st)) {
        const upd = toDate(it.updatedAt);
        if (upd && upd.toDateString() === now.toDateString()) resolvedToday += 1;
      }
    }
    return { open, overdue, dueSoon, resolvedToday };
  }, [allItems, now]);

  // rolling series so sparklines animate
  const [seriesOpen, setSeriesOpen] = useState([metrics.open]);
  const [seriesOverdue, setSeriesOverdue] = useState([metrics.overdue]);
  const [seriesDueSoon, setSeriesDueSoon] = useState([metrics.dueSoon]);
  const [seriesResolved, setSeriesResolved] = useState([metrics.resolvedToday]);
  useEffect(() => {
    setSeriesOpen((s) => [...s, metrics.open].slice(-20));
    setSeriesOverdue((s) => [...s, metrics.overdue].slice(-20));
    setSeriesDueSoon((s) => [...s, metrics.dueSoon].slice(-20));
    setSeriesResolved((s) => [...s, metrics.resolvedToday].slice(-20));
  }, [metrics.open, metrics.overdue, metrics.dueSoon, metrics.resolvedToday]);

  /* filters (selects) + search (half width) */
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const statuses = ["All", "Open", "In Progress", "Waiting Customer", "Resolved", "Closed"];
  const priorities = ["All", "P1", "P2", "P3", "P4"];

  const filtered = useMemo(() => {
    const s = String(q || "").toLowerCase();
    return allItems.filter((it) => {
      if (statusFilter !== "All" && String(it.status) !== statusFilter) return false;
      if (priorityFilter !== "All" && String(it.priority) !== priorityFilter) return false;
      if (!s) return true;
      const hay = [
        it.id, it.customerName, it.phone, it.reason,
        it.category, it.subCategory, (it.tags || []).join(" ")
      ].join(" ").toLowerCase();
      return hay.includes(s);
    });
  }, [allItems, q, statusFilter, priorityFilter]);

  const hasActiveFilter =
    q.trim() !== "" || statusFilter !== "All" || priorityFilter !== "All";

  /* pagination (4 per page) */
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  useEffect(() => { setPage(1); }, [q, statusFilter, priorityFilter]);
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  /* dialing (inherit NextCallCard behavior) */
  const { setNumber, startCall } = useDialerStore(s => ({
    setNumber: s.setNumber,
    startCall: s.startCall,
  }));
  const callNumber = (raw) => {
    if (!raw) return;
    const num = String(raw).replace(/\s+/g, "");
    try { setNumber(num); } catch {}
    try { startCall(num); } catch {}
  };

  /* details dialog */
  const [selected, setSelected] = useState(null);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {/* LEFT: counters */}
        <Grid item xs={LEFT_COL_XS} md={LEFT_COL_MD} lg={LEFT_COL_LG}>
          <Stack spacing={1}>
            <Stat label="Open" value={metrics.open} series={seriesOpen} hint="Active escalations" />
            <Stat label="Overdue (SLA)" value={metrics.overdue} series={seriesOverdue} hint="Past due" />
            <Stat label={`Due ≤ ${SLA_SOON_MINUTES}m`} value={metrics.dueSoon} series={seriesDueSoon} hint="Imminent" />
            <Stat label="Resolved Today" value={metrics.resolvedToday} series={seriesResolved} hint="Completed today" />
          </Stack>
        </Grid>

        {/* RIGHT: table area (fixed height + pagination) */}
        <Grid item xs={RIGHT_COL_XS} md={RIGHT_COL_MD} lg={RIGHT_COL_LG} sx={{ display: "flex", minHeight: 0 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 1.25,
              borderRadius: 1,
              height: RIGHT_PANE_HEIGHT,
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Filters row */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ mb: 1 }}
            >
              <TextField
                size="small"
                placeholder="Search (ID, customer, phone, reason, tag)…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                sx={{ width: { xs: "100%", sm: "50%" }, minWidth: 200 }}
              />

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select labelId="status-label" value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                  {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select labelId="priority-label" value={priorityFilter} label="Priority" onChange={(e) => setPriorityFilter(e.target.value)}>
                  {priorities.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </Select>
              </FormControl>

              {hasActiveFilter && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => { setQ(""); setStatusFilter("All"); setPriorityFilter("All"); }}
                  sx={{ borderRadius: 1, ml: { sm: "auto" } }}
                >
                  Clear
                </Button>
              )}
            </Stack>

            {/* Header (no separate Progress col) */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "140px 1.25fr 1fr 110px 170px 160px 120px",
                gap: 0.75,
                px: 0.5,
                py: 0.5,
                borderBottom: (t) => `1px solid ${t.palette.divider}`,
                position: "sticky",
                top: 0,
                bgcolor: "background.paper",
                zIndex: 1,
              }}
            >
              {["Case","Customer / Reason","Tags","Priority","SLA","Status","Actions"].map((h) => (
                <Typography key={h} variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  {h}
                </Typography>
              ))}
            </Box>

            {/* Body (paginated) */}
            <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <Box sx={{ flex: 1, overflow: "auto", py: 0.5 }}>
                {paginated.length === 0 ? (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 220 }}>
                    <Typography variant="body2" color="text.secondary">No escalations match your filters.</Typography>
                  </Box>
                ) : (
                  <Stack spacing={0.5}>
                    {paginated.map((it) => {
                      const opened = toDate(it.openedAt);
                      const due = toDate(it.slaDue);
                      const minsLeft = minutesUntil(due);
                      const overdue = minsLeft != null && minsLeft < 0 && !["Resolved", "Closed"].includes(it.status);
                      const dueSoon = minsLeft != null && minsLeft <= SLA_SOON_MINUTES && minsLeft >= 0;
                      const priColor = PRIORITY_COLORS[String(it.priority).toUpperCase()] || "default";

                      return (
                        <Paper key={it.id} variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "140px 1.25fr 1fr 110px 170px 160px 120px",
                              gap: 0.75,
                              alignItems: "center",
                            }}
                          >
                            {/* Case */}
                            <Stack spacing={0}>
                              <Typography variant="subtitle2" noWrap>{it.id}</Typography>
                              <Typography variant="caption" color="text.secondary" noWrap>
                                Opened: {fmtTime(opened)}
                              </Typography>
                            </Stack>

                            {/* Customer / Reason */}
                            <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                              <Typography variant="body2" noWrap>
                                {it.customerName || "Unknown"} {it.phone ? `(${it.phone})` : ""}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {it.category} › {it.subCategory} — {it.reason}
                              </Typography>
                              {it.notes && (
                                <Typography variant="caption" color="text.secondary" noWrap>
                                  Note: {it.notes}
                                </Typography>
                              )}
                            </Stack>

                            {/* Tags */}
                            <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
                              {(it.tags || []).slice(0, 4).map((t) => (
                                <Chip key={t} size="small" label={t} variant="outlined" sx={{ borderRadius: 1 }} />
                              ))}
                              {(!it.tags || it.tags.length === 0) && (
                                <Typography variant="caption" color="text.secondary">—</Typography>
                              )}
                            </Stack>

                            {/* Priority */}
                            <Chip size="small" label={String(it.priority || "P3")} color={priColor} variant="outlined" sx={{ borderRadius: 1 }} />

                            {/* SLA */}
                            <Stack spacing={0} sx={{ minWidth: 0 }}>
                              <Typography variant="caption" noWrap>
                                {due ? fmtTime(due) : "—"}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: overdue ? "error.main" : (dueSoon ? "warning.main" : "text.secondary"),
                                  fontWeight: overdue ? 700 : 400
                                }}
                                noWrap
                              >
                                {due
                                  ? overdue
                                    ? `Overdue by ${Math.abs(minsLeft)}m`
                                    : `Due in ${minsLeft}m`
                                  : "No SLA"}
                              </Typography>
                            </Stack>

                            {/* Status (self-filling chip for In Progress) */}
                            <StatusProgressChip status={it.status} progress={it.progress} />

                            {/* Actions */}
                            <Stack direction="row" spacing={0.5} justifyContent="flex-start">
                              <Tooltip title="View Case">
                                <IconButton size="small" sx={{ borderRadius: 1 }} onClick={() => setSelected(it)}>
                                  <VisibilityOutlinedIcon fontSize="inherit" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={it.phone ? "Call Back" : "No phone"}>
                                <span>
                                  <IconButton
                                    size="small"
                                    sx={{ borderRadius: 1 }}
                                    disabled={!it.phone}
                                    onClick={() => it.phone && callNumber(it.phone)}
                                  >
                                    <LocalPhoneOutlinedIcon fontSize="inherit" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <Tooltip title="Copy Case ID">
                                <IconButton
                                  size="small"
                                  sx={{ borderRadius: 1 }}
                                  onClick={async () => {
                                    try { await navigator.clipboard.writeText(String(it.id)); } catch {}
                                    onCopyId?.(it.id);
                                  }}
                                >
                                  <ContentCopyIcon fontSize="inherit" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Stack>
                )}
              </Box>

              {/* Pagination controls */}
              <Box sx={{ pt: 1, borderTop: (t) => `1px solid ${t.palette.divider}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">
                  Showing {paginated.length} of {filtered.length} (Total: {allItems.length})
                </Typography>
                <Pagination
                  size="small"
                  page={page}
                  count={totalPages}
                  onChange={(_, p) => setPage(p)}
                  showFirstButton
                  showLastButton
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Details dialog */}
      <EscalationDetailsDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        item={selected}
        onCall={() => selected?.phone && callNumber(selected.phone)}
      />
    </Box>
  );
}
