// Path: /src/Component/Meetings/views/Review/ScorecardsView.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Divider,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  TableContainer,
  Select,
  Pagination,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Pencil, Download, Filter } from "lucide-react";

import ScorecardEditor from "../../components/ScorecardEditor";
import { useMeetingsStore } from "../../../store/scheduling/useMeetingsStore";

/** Lightweight LS helpers (no new deps) */
const LS_KEY = "meetings.scorecards";
const loadLS = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
};
const saveLS = (obj) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(obj));
  } catch {}
};

export default function ScorecardsView() {
  const theme = useTheme();
  const mtg = useMeetingsStore();
  const [cards, setCards] = useState({});
  const [scope, setScope] = useState("last_30d");
  const [dialog, setDialog] = useState({ open: false, id: null });

  // unified pagination (TemplatesTable style)
  const [page, setPage] = useState(0);       // 0-based
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    mtg.loaded || mtg.loadFixtures();
  }, [mtg]);

  useEffect(() => setCards(loadLS()), []);

  const persist = (next) => {
    setCards(next);
    saveLS(next);
  };

  const rowsAll = useMemo(() => {
    const now = Date.now();
    const min = scope === "last_7d" ? now - 7 * 864e5 : scope === "last_30d" ? now - 30 * 864e5 : 0;
    return (mtg.meetings || [])
      .filter((m) => new Date(m.end).getTime() >= min)
      .map((m) => ({ m, sc: cards[m.id] || null }))
      .sort((a, b) => new Date(b.m.end) - new Date(a.m.end));
  }, [mtg.meetings, cards, scope]);

  // footer math
  const total = rowsAll.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  const safePage = Math.min(page, pages - 1);
  const from = total === 0 ? 0 : safePage * pageSize + 1;
  const to = Math.min(total, (safePage + 1) * pageSize);
  const rppOptions = [10, 25, 50, 100];

  const rows = useMemo(
    () => rowsAll.slice(safePage * pageSize, safePage * pageSize + pageSize),
    [rowsAll, safePage, pageSize]
  );

  useEffect(() => setPage(0), [scope, pageSize, total]);

  const open = (id) => setDialog({ open: true, id });
  const close = () => setDialog({ open: false, id: null });

  const avg = (sc) => (sc ? Math.round(((sc.clarity + sc.value + sc.demoQuality) / 3) * 10) / 10 : null);

  const exportCSV = () => {
    const head = ["meetingId", "date", "invitee", "clarity", "value", "demoQuality", "notes", "avg"];
    const lines = [head.join(",")];
    rowsAll.forEach(({ m, sc }) => {
      const row = [
        m.id,
        m.start,
        (m.invitee?.email || "").replace(/,/g, " "),
        sc?.clarity ?? "",
        sc?.value ?? "",
        sc?.demoQuality ?? "",
        (sc?.notes || "").replace(/[\r\n,]+/g, " "),
        avg(sc) ?? "",
      ];
      lines.push(row.join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "scorecards.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 400);
  };

  const stats = useMemo(() => {
    const withScores = rowsAll.filter(({ sc }) => !!sc).length;
    return { total: rowsAll.length, withScores, without: rowsAll.length - withScores };
  }, [rowsAll]);

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Typography variant="h6">Scorecards</Typography>
        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
          <Chip
            size="small"
            label={`In range: ${stats.total}`}
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: "primary.main" }}
          />
          <Chip size="small" color="success" label={`Scored: ${stats.withScores}`} />
          <Chip size="small" label={`Missing: ${stats.without}`} />
          <Filter size={16} />
          <TextField select size="small" label="Scope" value={scope} onChange={(e) => setScope(e.target.value)}>
            <MenuItem value="last_7d">Last 7 days</MenuItem>
            <MenuItem value="last_30d">Last 30 days</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </TextField>
          <Button startIcon={<Download />} onClick={exportCSV}>
            Export CSV
          </Button>
        </Stack>
      </Stack>
      <Divider />

      <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden", bgcolor: "background.paper" }}>
        {/* Height: tweak here */}
        <TableContainer sx={{ maxHeight: 560 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>When</TableCell>
                <TableCell>Invitee</TableCell>
                <TableCell>Event Type</TableCell>
                <TableCell>Scores</TableCell>
                <TableCell>Avg</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(({ m, sc }) => (
                <TableRow key={m.id} hover>
                  <TableCell>{m.start} → {m.end}</TableCell>
                  <TableCell>
                    {m.invitee?.name} <Chip size="small" label={m.invitee?.email} sx={{ ml: 0.5 }} />
                  </TableCell>
                  <TableCell>{m.eventTypeId}</TableCell>
                  <TableCell>
                    {sc ? (
                      <>
                        <Chip size="small" label={`Clarity ${sc.clarity}`} sx={{ mr: 0.5 }} />
                        <Chip size="small" label={`Value ${sc.value}`} sx={{ mr: 0.5 }} />
                        <Chip size="small" label={`Demo ${sc.demoQuality}`} />
                      </>
                    ) : (
                      <Chip size="small" label="—" />
                    )}
                  </TableCell>
                  <TableCell>{avg(sc) ?? "—"}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" gap={0.75} justifyContent="flex-end">
                      <Tooltip title="Edit scorecard">
                        <IconButton onClick={() => open(m.id)}>
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography align="center" sx={{ py: 3, color: "text.secondary" }}>
                      No meetings in range
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Custom footer (TemplatesTable style) */}
        <Box
          sx={{
            px: 1.5,
            py: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: 1,
            borderTop: (th) => `1px solid ${th.palette.divider}`,
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
                border: (th) => `1px solid ${alpha(th.palette.primary.main, 0.4)}`,
                borderRadius: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Select
                size="small"
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                variant="standard"
                disableUnderline
                sx={{ minWidth: 76, "& .MuiSelect-select": { px: 0.5 } }}
              >
                {rppOptions.map((n) => (
                  <MenuItem key={n} value={n}>
                    {n} / page
                  </MenuItem>
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

      <Dialog open={dialog.open} onClose={close} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Scorecard</DialogTitle>
        <DialogContent dividers>
          <ScorecardEditor
            defaultValue={cards[dialog.id] || undefined}
            onSave={(val) => {
              const next = { ...cards, [dialog.id]: val };
              persist(next);
              close();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Close</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
