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
  TableContainer,
  TableSortLabel,
  Box,
  Toolbar,
  Checkbox,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useMeetingsStore } from "../../../store/scheduling/useMeetingsStore";

/* ---------- sort helpers ---------- */
function cmp(a, b, orderBy) {
  const va = orderBy === "at" ? new Date(a.at).getTime() : a?.[orderBy];
  const vb = orderBy === "at" ? new Date(b.at).getTime() : b?.[orderBy];
  if (typeof va === "number" && typeof vb === "number") return va - vb;
  return String(va ?? "").localeCompare(String(vb ?? ""));
}
function sortRows(rows, orderBy, order) {
  const copy = [...rows];
  copy.sort((a, b) => {
    const base = cmp(a, b, orderBy);
    return order === "asc" ? base : -base;
  });
  return copy;
}

export default function AuditTrailView() {
  const t = useTheme();
  const mtg = useMeetingsStore();

  const [orderBy, setOrderBy] = useState("at");
  const [order, setOrder] = useState("desc");

  // pagination
  const [page, setPage] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(25);
  const rppOptions = [10, 25, 50, 100];

  // selection (page only)
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!mtg.loaded) mtg.loadFixtures();
  }, [mtg]);

  // Build events list
  const eventsAll = useMemo(() => {
    const list = [];
    (mtg.meetings || []).forEach((m) => {
      list.push({
        id: `mtg.created.${m.id}`,
        at: m.createdAt || new Date().toISOString(),
        type: "meeting.created",
        data: { id: m.id, eventTypeId: m.eventTypeId, invitee: m.invitee?.email },
      });
      if (m.updatedAt && m.updatedAt !== m.createdAt) {
        list.push({ id: `mtg.updated.${m.id}`, at: m.updatedAt, type: "meeting.updated", data: { id: m.id } });
      }
      if (m.status === "cancelled") {
        list.push({
          id: `mtg.cancelled.${m.id}`,
          at: m.updatedAt || new Date().toISOString(),
          type: "meeting.cancelled",
          data: { id: m.id },
        });
      }
    });
    (mtg.history || []).forEach((h) => {
      list.push({
        id: h.id,
        at: h.at,
        type: `fsm.${h.type}`,
        data: { eventTypeId: h.data?.eventTypeId, host: h.data?.host, invitee: h.data?.invitee },
      });
    });
    return list;
  }, [mtg.meetings, mtg.history]);

  const sorted = useMemo(() => sortRows(eventsAll, orderBy, order), [eventsAll, orderBy, order]);

  // pagination math + slice
  const total = sorted.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  const safePage = Math.min(page, pages - 1);
  const startIndex = safePage * pageSize;
  const pageRows = useMemo(() => sorted.slice(startIndex, startIndex + pageSize), [sorted, startIndex, pageSize]);

  // selection scope (page only)
  const pageIds = pageRows.map((r, idx) => r.id || `${r.type}.${r.at}.${idx}`);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const toggleAllOnPage = () =>
    setSelected((sel) => (allChecked ? sel.filter((id) => !pageIds.includes(id)) : Array.from(new Set([...sel, ...pageIds]))));
  const toggle = (id) => setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));

  // reset page/selection when data or pageSize changes
  useEffect(() => setPage(0), [total, pageSize]);
  useEffect(() => setSelected([]), [safePage, pageSize]);

  const from = total === 0 ? 0 : safePage * pageSize + 1;
  const to = Math.min(total, (safePage + 1) * pageSize);

  const headerWhen = (
    <TableCell sortDirection={orderBy === "at" ? order : false} sx={{ width: 240 }}>
      <TableSortLabel
        active={orderBy === "at"}
        direction={orderBy === "at" ? order : "asc"}
        onClick={() => {
          setOrderBy("at");
          setOrder(orderBy === "at" && order === "asc" ? "desc" : "asc");
        }}
      >
        When
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Stack gap={2}>
      <Typography variant="h6">Audit Trail</Typography>
      <Divider />

      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        {/* Toolbar */}
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
            <Typography variant="subtitle2">Events ({total})</Typography>
          )}
          <Box sx={{ flex: 1 }} />
          <Chip
            size="small"
            label={order === "desc" ? "Newest first" : "Oldest first"}
            sx={{ bgcolor: (th) => alpha(th.palette.primary.main, 0.08), color: "primary.main" }}
          />
        </Toolbar>

        {/* Table */}
        <TableContainer
          sx={{
            maxHeight: 520,
            "& .MuiTableCell-head": { backgroundColor: alpha(t.palette.primary.main, 0.04) },
          }}
        >
          <Table stickyHeader size="small" aria-label="audit trail table">
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
                {headerWhen}
                <TableCell sx={{ width: 220 }}>Event</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((e, i) => {
                const rowId = e.id || `${e.type}.${e.at}.${i}`;
                const selectedRow = selected.includes(rowId);
                return (
                  <TableRow key={rowId} hover selected={selectedRow}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedRow} onChange={() => toggle(rowId)} />
                    </TableCell>
                    <TableCell>{new Date(e.at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={e.type}
                        sx={{
                          "& .MuiChip-label": { fontWeight: 600 },
                          bgcolor: (th) => alpha(th.palette.primary.main, 0.06),
                          color: "primary.main",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        component="code"
                        sx={{
                          fontSize: 12,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: (th) => alpha(th.palette.primary.main, 0.06),
                          border: (th) => `1px dashed ${alpha(th.palette.primary.main, 0.25)}`,
                          display: "inline-block",
                          maxWidth: "100%",
                          overflow: "auto",
                        }}
                      >
                        {JSON.stringify(e.data, null, 2)}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}

              {!total && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No audit events
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
                {[10, 25, 50, 100].map((n) => (
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
