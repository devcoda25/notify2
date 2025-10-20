// Path: /src/Component/Meetings/views/Desk/MyAttendanceView.jsx
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
  Button,
  TableContainer,
  Toolbar,
  Checkbox,
  Select,
  MenuItem,
  Pagination,
  Box,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Download } from "lucide-react";
import { useMeetingsStore } from "../../../store/scheduling/useMeetingsStore";

function toCsv(rows) {
  const head = ["meetingId", "joinedAt", "leftAt", "durationSec"];
  const lines = [head.join(",")];
  rows.forEach((r) =>
    lines.push([r.meetingId, r.joinedAt || "", r.leftAt || "", r.durationSec ?? ""].join(","))
  );
  return lines.join("\n");
}

export default function MyAttendanceView() {
  const t = useTheme();
  const mtg = useMeetingsStore();

  const [rowsAll, setRowsAll] = useState([]);
  // pagination (TemplatesTable-style)
  const [page, setPage] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(25);
  const rppOptions = [10, 25, 50, 100];

  // page-scoped selection
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!mtg.loaded) mtg.loadFixtures();
  }, [mtg]);

  useEffect(() => {
    const arr = Object.entries(mtg.attendance || {}).map(([meetingId, v]) => ({
      meetingId,
      ...v,
    }));
    // sort recent first by joinedAt
    const sorted = arr.sort((a, b) => new Date(b.joinedAt || 0) - new Date(a.joinedAt || 0));
    setRowsAll(sorted);
  }, [mtg.attendance]);

  // pagination math
  const total = rowsAll.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  const safePage = Math.min(page, pages - 1);
  const startIdx = safePage * pageSize;
  const pageRows = useMemo(() => rowsAll.slice(startIdx, startIdx + pageSize), [rowsAll, startIdx, pageSize]);

  // selection helpers (page only)
  const pageIds = pageRows.map((r) => r.meetingId);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const toggleAllOnPage = () =>
    setSelected((sel) =>
      allChecked ? sel.filter((id) => !pageIds.includes(id)) : Array.from(new Set([...sel, ...pageIds]))
    );
  const toggle = (id) => setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));

  // reset page / selection on data-size or page-size change
  useEffect(() => setPage(0), [total, pageSize]);
  useEffect(() => setSelected([]), [safePage, pageSize]);

  const from = total === 0 ? 0 : safePage * pageSize + 1;
  const to = Math.min(total, (safePage + 1) * pageSize);

  const download = () => {
    const csv = toCsv(rowsAll);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "attendance.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 400);
  };

  const totalMin = useMemo(
    () => Math.round(rowsAll.reduce((acc, r) => acc + (r.durationSec || 0), 0) / 60),
    [rowsAll]
  );

  return (
    <Stack gap={2}>
      <Typography variant="h6">My Attendance</Typography>
      <Divider />

      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        {/* Toolbar (like TemplatesTable) */}
        <Toolbar
          sx={{
            px: 2,
            py: 1,
            gap: 1,
            borderBottom: (th) => `1px solid ${th.palette.divider}`,
            bgcolor: selected.length ? alpha(t.palette.primary.main, 0.06) : "transparent",
          }}
        >
          {selected.length ? (
            <Typography variant="subtitle2">{selected.length} selected</Typography>
          ) : (
            <Typography variant="subtitle2">Attendance ({total})</Typography>
          )}
          <Box sx={{ flex: 1 }} />
          <Chip size="small" label={`Total time: ${totalMin} min`} />
          <Button startIcon={<Download />} onClick={download} variant="contained">
            Export CSV
          </Button>
        </Toolbar>

        {/* Table */}
        <TableContainer
          sx={{
            maxHeight: 600,
            "& .MuiTableCell-head": { backgroundColor: alpha(t.palette.primary.main, 0.04) },
          }}
        >
          <Table stickyHeader size="small" aria-label="attendance table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={allChecked}
                    indeterminate={pageIds.some((id) => selected.includes(id)) && !allChecked}
                    onChange={toggleAllOnPage}
                    inputProps={{ "aria-label": "Select all on page" }}
                  />
                </TableCell>
                <TableCell sx={{ width: 380 }}>Meeting</TableCell>
                <TableCell sx={{ width: 240 }}>Joined</TableCell>
                <TableCell sx={{ width: 240 }}>Left</TableCell>
                <TableCell>Duration (min)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((r) => {
                const isSel = selected.includes(r.meetingId);
                return (
                  <TableRow key={r.meetingId} hover selected={isSel}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSel} onChange={() => toggle(r.meetingId)} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={r.meetingId}
                        sx={{
                          "& .MuiChip-label": { fontFamily: "monospace" },
                          bgcolor: (th) => alpha(th.palette.primary.main, 0.06),
                          color: "primary.main",
                        }}
                      />
                    </TableCell>
                    <TableCell>{r.joinedAt ? new Date(r.joinedAt).toLocaleString() : "—"}</TableCell>
                    <TableCell>{r.leftAt ? new Date(r.leftAt).toLocaleString() : "—"}</TableCell>
                    <TableCell>{r.durationSec ? Math.round(r.durationSec / 60) : "—"}</TableCell>
                  </TableRow>
                );
              })}
              {!total && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No attendance yet
                    </Typography>
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
            borderTop: (th) => `1px solid ${th.palette.divider}`,
            backgroundColor: alpha(t.palette.primary.main, 0.015),
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {total ? `Showing ${from}–${to} of ${total}` : "No results"}
            {selected.length ? ` • ${selected.length} selected` : ""}
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
                backgroundColor: t.palette.background.paper,
              }}
            >
              <Select
                size="small"
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(String(e.target.value), 10))}
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
    </Stack>
  );
}
