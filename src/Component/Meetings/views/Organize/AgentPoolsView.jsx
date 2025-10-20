// Path: src/Component/Meetings/views/AgentPoolsView.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  TextField,
  Paper,
  TableContainer,
  Box,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Plus, Eye } from "lucide-react";

import PoolEditor from "../../components/PoolEditor";
import { usePoolsStore } from "../../../store/scheduling/usePoolsStore";
import PoolDetailsDialog from "../../components/PoolDetailsDialog";

function tzOffsetLabel(tz) {
  try {
    const now = new Date();
    const utc = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
    const zoned = new Date(now.toLocaleString("en-US", { timeZone: tz }));
    const mins = Math.round((zoned.getTime() - utc.getTime()) / 60000);
    const sign = mins >= 0 ? "+" : "-";
    const abs = Math.abs(mins);
    const hh = String(Math.floor(abs / 60)).padStart(2, "0");
    const mm = String(abs % 60).padStart(2, "0");
    return `${tz || "—"} - ${sign}${hh}:${mm}`;
  } catch {
    return tz || "—";
  }
}

export default function AgentPoolsView() {
  const theme = useTheme();
  const store = usePoolsStore();

  const [q, setQ] = useState("");
  const [dialog, setDialog] = useState({ open: false, id: null }); // editor (new/edit)
  const [details, setDetails] = useState({ open: false, id: null }); // viewer

  // pagination
  const [page, setPage] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(25);
  const rppOptions = [10, 25, 50, 100];

  useEffect(() => {
    store.loaded || store.loadFixtures();
  }, [store]);

  const filtered = useMemo(() => {
    const all = store.pools || [];
    const qq = q.trim().toLowerCase();
    if (!qq) return all;
    return all.filter((p) =>
      [p.name, p.slug, p.type, p.distribution].some((s) =>
        String(s || "").toLowerCase().includes(qq)
      )
    );
  }, [store.pools, q]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const members = filtered.reduce((acc, p) => acc + (p.members?.length || 0), 0);
    return { total, members };
  }, [filtered]);

  // pagination math
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  const safePage = Math.min(page, pages - 1);
  const from = total === 0 ? 0 : safePage * pageSize + 1;
  const to = Math.min(total, (safePage + 1) * pageSize);

  const start = safePage * pageSize;
  const pageRows = useMemo(
    () => filtered.slice(start, start + pageSize),
    [filtered, start, pageSize]
  );

  // reset on filter/pageSize change
  useEffect(() => setPage(0), [q, pageSize, filtered.length]);

  const openEditor = (id = null) => setDialog({ open: true, id });
  const closeEditor = () => setDialog({ open: false, id: null });

  const openDetails = (id) => setDetails({ open: true, id });
  const closeDetails = () => setDetails({ open: false, id: null });

  return (
    <Stack gap={2}>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            px: 2,
            py: 1,
            gap: 1,
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
            bgcolor: (t) => alpha(t.palette.primary.main, 0.03),
          }}
          flexWrap="wrap"
          useFlexGap
        >
          <Typography variant="subtitle2" fontWeight={700}>
            Agent Pools ({stats.total})
          </Typography>
          <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Chip
              size="small"
              label={`Pools: ${stats.total}`}
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: "primary.main" }}
            />
            <Chip size="small" label={`Members: ${stats.members}`} />
            <TextField
              size="small"
              label="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button startIcon={<Plus />} variant="contained" onClick={() => openEditor(null)}>
              New Pool
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <TableContainer
          sx={{
            maxHeight: 560,
            "& .MuiTableCell-head": { backgroundColor: alpha(theme.palette.primary.main, 0.04) },
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Strategy</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Timezone</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((p) => (
                <TableRow
                  key={p.id}
                  hover
                  onClick={() => openDetails(p.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{p.name}</TableCell>

                  {/* Strategy = Type • Distribution */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {(p.type || "—") + " • " + (p.distribution || "—")}
                  </TableCell>

                  {/* Members preview */}
                  <TableCell>
                    {(p.members || [])
                      .slice(0, 3)
                      .map((m) => (
                        <Chip key={m.userId} label={m.userId} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    {(p.members || []).length > 3 && (
                      <Chip size="small" label={`+${(p.members || []).length - 3}`} />
                    )}
                  </TableCell>

                  {/* Timezone as Name - ±HH:MM */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {tzOffsetLabel(p.timezone)}
                  </TableCell>

                  {/* Single action: View (row click also opens) */}
                  <TableCell
                    align="right"
                    onClick={(e) => e.stopPropagation()}
                    sx={{ minWidth: 120 }}
                  >
                    <Button size="small" startIcon={<Eye size={16} />} onClick={() => openDetails(p.id)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {!filtered.length && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography align="center" sx={{ py: 3, color: "text.secondary" }}>
                      No pools
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
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

      {/* Editor dialog (no Close button; click outside/ESC to dismiss) */}
      <Dialog open={dialog.open} onClose={closeEditor} maxWidth="md" fullWidth>
        <DialogTitle>{dialog.id ? "Edit Pool" : "New Pool"}</DialogTitle>
        <DialogContent dividers>
          <PoolEditor poolId={dialog.id || undefined} onSaved={closeEditor} />
        </DialogContent>
      </Dialog>

      {/* Details dialog (Edit/Delete from inside) */}
      <PoolDetailsDialog
        open={details.open}
        poolId={details.id}
        onClose={closeDetails}
        onEdit={() => {
          const id = details.id;
          closeDetails();
          setDialog({ open: true, id });
        }}
      />
    </Stack>
  );
}
