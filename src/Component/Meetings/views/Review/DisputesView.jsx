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
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  TableContainer,
  Box,
  Select,
  Pagination,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { AlertTriangle, CheckCircle2, Plus } from "lucide-react";
import { useMeetingsStore } from "../../../store/scheduling/useMeetingsStore";

/** Minimal LS store for disputes */
const LS_KEY = "meetings.disputes";
const loadLS = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
};
const saveLS = (arr) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  } catch {}
};

const TABLE_MAX_HEIGHT = 560; // 🔧 tweak scrollable table height here

export default function DisputesView() {
  const theme = useTheme();
  const mtg = useMeetingsStore();
  const [items, setItems] = useState([]);
  const [scope, setScope] = useState("open"); // open | resolved | all
  const [dlg, setDlg] = useState({ open: false, id: null, meetingId: "", reason: "" });

  // pagination (TemplatesTable style)
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(25);
  const rppOptions = [10, 25, 50, 100];

  useEffect(() => { mtg.loaded || mtg.loadFixtures(); }, [mtg]);
  useEffect(() => { setItems(loadLS()); }, []);

  const persist = (next) => { setItems(next); saveLS(next); };

  const filteredSorted = useMemo(() => {
    const base = scope === "all" ? items : items.filter((d) => d.status === scope);
    return base.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [items, scope]);

  // pagination math
  const total = filteredSorted.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, rpp)));
  const safePage = Math.min(page, pages - 1);
  const start = safePage * rpp;
  const pageRows = filteredSorted.slice(start, start + rpp);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(total, start + rpp);

  useEffect(() => setPage(0), [scope, rpp, total]);

  const create = () => setDlg({ open: true, id: null, meetingId: "", reason: "" });
  const save = () => {
    if (!dlg.meetingId || !dlg.reason) return;
    const rec = {
      id: `dsp_${Math.random().toString(36).slice(2, 9)}`,
      meetingId: dlg.meetingId,
      reason: dlg.reason,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    persist([rec, ...items]);
    setDlg({ open: false, id: null, meetingId: "", reason: "" });
  };

  const setStatus = (id, status) => {
    const next = items.map((d) =>
      d.id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d
    );
    persist(next);
  };

  const opts = (mtg.meetings || []).map((m) => ({
    value: m.id,
    label: `${m.start} — ${m.invitee?.email || ""}`,
  }));

  const stats = useMemo(() => {
    const open = items.filter((i) => i.status === "open").length;
    const resolved = items.filter((i) => i.status === "resolved").length;
    return { open, resolved, total: items.length };
  }, [items]);

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Typography variant="h6">Disputes</Typography>
        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
          <Chip
            size="small"
            label={`Open: ${stats.open}`}
            color="warning"
            sx={{ bgcolor: alpha(theme.palette.warning.main, 0.15) }}
          />
          <Chip size="small" color="success" label={`Resolved: ${stats.resolved}`} />
          <Chip size="small" label={`Total: ${stats.total}`} />
          <TextField
            select
            size="small"
            label="Scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </TextField>
          <Button startIcon={<Plus />} variant="contained" onClick={create}>
            New
          </Button>
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
                <TableCell>Meeting</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((d) => (
                <TableRow key={d.id} hover>
                  <TableCell><Chip size="small" label={d.meetingId} /></TableCell>
                  <TableCell>{d.reason}</TableCell>
                  <TableCell>
                    {d.status === "open" ? (
                      <Chip size="small" color="warning" icon={<AlertTriangle size={14} />} label="Open" />
                    ) : (
                      <Chip size="small" color="success" icon={<CheckCircle2 size={14} />} label="Resolved" />
                    )}
                  </TableCell>
                  <TableCell>{new Date(d.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{new Date(d.updatedAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={1} useFlexGap>
                      {d.status === "open" ? (
                        <Tooltip title="Mark resolved">
                          <Button size="small" onClick={() => setStatus(d.id, "resolved")}>
                            Mark resolved
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Reopen dispute">
                          <Button size="small" onClick={() => setStatus(d.id, "open")}>Reopen</Button>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {!total && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography align="center">No disputes</Typography>
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

      <Dialog open={dlg.open} onClose={() => setDlg({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>New Dispute</DialogTitle>
        <DialogContent dividers>
          <Stack gap={2}>
            <TextField
              select
              label="Meeting"
              value={dlg.meetingId}
              onChange={(e) => setDlg({ ...dlg, meetingId: e.target.value })}
              fullWidth
            >
              {opts.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Reason"
              value={dlg.reason}
              onChange={(e) => setDlg({ ...dlg, reason: e.target.value })}
              minRows={3}
              multiline
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlg({ open: false })}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={!dlg.meetingId || !dlg.reason}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
