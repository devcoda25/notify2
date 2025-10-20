import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  Divider,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TextField,
  MenuItem,
  TableContainer,
  Box,
  Select,
  Pagination,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Gauge, Users } from "lucide-react";
import { useMeetingsStore } from "../../../store/scheduling/useMeetingsStore";

/** Pull scorecards from LS (same key used by ScorecardsView) */
const LS_KEY = "meetings.scorecards";
const TABLE_MAX_HEIGHT = 560; // 🔧 tweak table viewport height here

const loadCards = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
};

/**
 * For calibration we pretend multiple reviewers have left scores.
 * If only one reviewer exists in LS, we synthesize a second with slight noise for demo.
 */
function synthesizePeers(baseCards) {
  const out = {};
  for (const [id, sc] of Object.entries(baseCards)) {
    const jitter = (x) => Math.min(5, Math.max(1, Math.round(x + (Math.random() * 2 - 1))));
    out[id] = [
      { reviewer: "you", ...sc },
      {
        reviewer: "peerA",
        clarity: jitter(sc.clarity || 3),
        value: jitter(sc.value || 3),
        demoQuality: jitter(sc.demoQuality || 3),
        notes: "",
      },
    ];
  }
  return out;
}

export default function CalibrationView() {
  const theme = useTheme();
  const mtg = useMeetingsStore();
  const [scope, setScope] = useState("last_30d");
  const [byMeeting, setByMeeting] = useState({});

  // pagination (TemplatesTable style)
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(25);
  const rppOptions = [10, 25, 50, 100];

  useEffect(() => { mtg.loaded || mtg.loadFixtures(); }, [mtg]);
  useEffect(() => { setByMeeting(synthesizePeers(loadCards())); }, []);

  const rowsAll = useMemo(() => {
    const now = Date.now();
    const min = scope === "last_7d" ? now - 7 * 864e5 : scope === "last_30d" ? now - 30 * 864e5 : 0;
    return (mtg.meetings || [])
      .filter((m) => new Date(m.end).getTime() >= min)
      .map((m) => ({ m, reviews: byMeeting[m.id] || [] }))
      .filter((x) => x.reviews.length)
      .sort((a, b) => new Date(b.m.end) - new Date(a.m.end));
  }, [mtg.meetings, byMeeting, scope]);

  // pagination math
  const total = rowsAll.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, rpp)));
  const safePage = Math.min(page, pages - 1);
  const start = safePage * rpp;
  const pageRows = rowsAll.slice(start, start + rpp);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(total, start + rpp);

  useEffect(() => setPage(0), [scope, rpp, total]);

  const avg = (arr, k) =>
    arr.length ? Math.round((arr.reduce((s, r) => s + (r[k] || 0), 0) / arr.length) * 10) / 10 : 0;

  const stats = useMemo(() => {
    let n = 0, cl = 0, va = 0, de = 0;
    rowsAll.forEach(({ reviews }) => {
      if (!reviews.length) return;
      cl += avg(reviews, "clarity");
      va += avg(reviews, "value");
      de += avg(reviews, "demoQuality");
      n += 1;
    });
    return {
      total,
      avgClarity: n ? Math.round((cl / n) * 10) / 10 : "—",
      avgValue: n ? Math.round((va / n) * 10) / 10 : "—",
      avgDemo: n ? Math.round((de / n) * 10) / 10 : "—",
    };
  }, [rowsAll, total]);

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Stack direction="row" gap={1} alignItems="center">
          <Gauge size={16} />
          <Typography variant="h6">Calibration</Typography>
        </Stack>
        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
          <Chip
            size="small"
            label={`Items: ${stats.total}`}
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: "primary.main" }}
          />
          <Chip size="small" label={`Avg Clarity: ${stats.avgClarity}`} />
          <Chip size="small" label={`Avg Value: ${stats.avgValue}`} />
          <Chip size="small" label={`Avg Demo: ${stats.avgDemo}`} />
          <TextField
            select
            size="small"
            label="Scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            <MenuItem value="last_7d">Last 7 days</MenuItem>
            <MenuItem value="last_30d">Last 30 days</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </TextField>
        </Stack>
      </Stack>
      <Divider />

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          borderColor: (t) => alpha(t.palette.primary.main, 0.25),
          bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
        }}
      >
        <TableContainer
          sx={{
            maxHeight: TABLE_MAX_HEIGHT,
            "& .MuiTableCell-head": { backgroundColor: alpha(theme.palette.primary.main, 0.04) },
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>When</TableCell>
                <TableCell>Invitee</TableCell>
                <TableCell>Reviewers</TableCell>
                <TableCell>Clarity (avg | spread)</TableCell>
                <TableCell>Value (avg | spread)</TableCell>
                <TableCell>Demo (avg | spread)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map(({ m, reviews }) => {
                const cl = avg(reviews, "clarity");
                const va = avg(reviews, "value");
                const de = avg(reviews, "demoQuality");
                const spreadCl = Math.max(...reviews.map((r) => r.clarity || 0)) - Math.min(...reviews.map((r) => r.clarity || 0));
                const spreadVa = Math.max(...reviews.map((r) => r.value || 0)) - Math.min(...reviews.map((r) => r.value || 0));
                const spreadDe = Math.max(...reviews.map((r) => r.demoQuality || 0)) - Math.min(...reviews.map((r) => r.demoQuality || 0));
                return (
                  <TableRow key={m.id} hover>
                    <TableCell>{m.start}</TableCell>
                    <TableCell>
                      {m.invitee?.name}{" "}
                      <Chip size="small" label={m.invitee?.email} sx={{ ml: 0.5 }} />
                    </TableCell>
                    <TableCell>
                      <Chip size="small" icon={<Users size={14} />} label={reviews.map((r) => r.reviewer).join(", ")} />
                    </TableCell>
                    <TableCell>{cl} | ±{spreadCl}</TableCell>
                    <TableCell>{va} | ±{spreadVa}</TableCell>
                    <TableCell>{de} | ±{spreadDe}</TableCell>
                  </TableRow>
                );
              })}
              {!total && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography align="center">No scorecards to calibrate</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer (TemplatesTable-style) */}
        <Box
          sx={{
            px: 1.5,
            py: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: 1,
            borderTop: (t) => `1px solid ${t.palette.divider}`,
            backgroundColor: alpha(theme.palette.primary.main, 0.015),
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {total ? `Showing ${from}–${to} of ${total}` : "No results"}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                px: 1,
                py: 0.25,
                border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.4)}`,
                borderRadius: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Select
                size="small"
                value={rpp}
                onChange={(e) => setRpp(parseInt(e.target.value, 10))}
                variant="standard"
                disableUnderline
                sx={{ minWidth: 76, "& .MuiSelect-select": { px: 0.5 } }}
              >
                {rppOptions.map((n) => (
                  <MenuItem key={n} value={n}>{n} / page</MenuItem>
                ))}
              </Select>
            </Box>

            <Pagination
              color="primary"
              count={pages}
              page={Math.min(safePage + 1, pages)}
              onChange={(_, v) => setPage(v - 1)}
              size="small"
              shape="rounded"
              showFirstButton
              showLastButton
              disabled={pages <= 1}
            />
          </Stack>
        </Box>
      </Paper>
    </Stack>
  );
}
