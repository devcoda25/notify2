// Path: /src/Component/Meetings/components/MeetingTable.jsx
import React from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Chip,
  Checkbox,
  Toolbar,
  Typography,
  TableContainer,
  Stack,
  Select,
  MenuItem,
  Pagination,
  IconButton,
  Tooltip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Eye, Video, X } from "lucide-react";

/* ---------- sort helpers (same style as TemplatesTable) ---------- */
function cmp(a, b, orderBy) {
  const va = a?.[orderBy];
  const vb = b?.[orderBy];

  if (orderBy === "start" || orderBy === "end") {
    const da = new Date(va || 0).getTime();
    const db = new Date(vb || 0).getTime();
    return da - db;
  }

  // nested invitee sort (by email then name) when orderBy === 'invitee'
  if (orderBy === "invitee") {
    const ae = (a?.invitee?.email || "").toLowerCase();
    const be = (b?.invitee?.email || "").toLowerCase();
    if (ae !== be) return ae.localeCompare(be);
    const an = (a?.invitee?.name || "").toLowerCase();
    const bn = (b?.invitee?.name || "").toLowerCase();
    return an.localeCompare(bn);
  }

  // generic: number or string
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

/* ---------- component ---------- */
export default function MeetingTable({
  meetings = [],
  onJoin,
  onCancel,
  onOpen,

  // visual
  dense = false,
  stickyHeader = true,
  maxHeight = 520,

  // optional controlled pagination (mirrors TemplatesTable)
  page: pageProp,
  pageSize: pageSizeProp,
  total: totalProp,
  onPageChange,
  onPageSizeChange,
}) {
  const t = useTheme();

  // sorting
  const [orderBy, setOrderBy] = React.useState("start");
  const [order, setOrder] = React.useState("desc");

  // internal pagination fallbacks (if parent doesn’t control)
  const [pageLocal, setPageLocal] = React.useState(0); // 0-based
  const [pageSizeLocal, setPageSizeLocal] = React.useState(25);
  const page = typeof pageProp === "number" ? pageProp : pageLocal;
  const pageSize = typeof pageSizeProp === "number" ? pageSizeProp : pageSizeLocal;

  // totals & slicing
  const total = typeof totalProp === "number" ? totalProp : meetings.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  const safePage = Math.min(page, pages - 1);
  const startIndex = safePage * pageSize;
  const rppOptions = [10, 25, 50, 100];

  // sort + page rows
  const sorted = React.useMemo(() => sortRows(meetings, orderBy, order), [meetings, orderBy, order]);
  const pageRows = React.useMemo(() => sorted.slice(startIndex, startIndex + pageSize), [sorted, startIndex, pageSize]);

  // selection (per page)
  const [selected, setSelected] = React.useState([]);
  const pageIds = pageRows.map((r) => r.id);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const toggleAllOnPage = () =>
    setSelected((sel) => (allChecked ? sel.filter((id) => !pageIds.includes(id)) : Array.from(new Set([...sel, ...pageIds]))));
  const toggle = (id) => setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));

  // toolbar counts
  const from = total === 0 ? 0 : safePage * pageSize + 1;
  const to = Math.min(total, (safePage + 1) * pageSize);

  // handlers
  const setPage = (v) => {
    if (typeof onPageChange === "function") onPageChange(v);
    else setPageLocal(v);
  };
  const setPageSize = (v) => {
    if (typeof onPageSizeChange === "function") onPageSizeChange(v);
    else {
      setPageSizeLocal(v);
      setPageLocal(0);
    }
  };

  const headerCell = (id, label) => (
    <TableCell sortDirection={orderBy === id ? order : false}>
      <TableSortLabel
        active={orderBy === id}
        direction={orderBy === id ? order : "asc"}
        onClick={() => {
          setOrderBy(id);
          setOrder(orderBy === id && order === "asc" ? "desc" : "asc");
        }}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      {/* Top toolbar (matches TemplatesTable) */}
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
          <Typography variant="subtitle2">Meetings ({total})</Typography>
        )}
      </Toolbar>

      {/* Table */}
      <TableContainer
        sx={{
          maxHeight,
          "& .MuiTableCell-head": { backgroundColor: alpha(t.palette.primary.main, 0.04) },
        }}
      >
        <Table stickyHeader={stickyHeader} size={dense ? "small" : "medium"}>
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
              {headerCell("start", "When (UTC)")}
              {headerCell("eventTypeId", "Event Type")}
              {headerCell("invitee", "Invitee")}
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pageRows.map((m) => {
              const invitee = `${m.invitee?.name || "—"}${m.invitee?.email ? ` (${m.invitee.email})` : ""}`;
              const loc = m.location?.type || m.location?.link || m.location?.address || "—";
              const selectedRow = selected.includes(m.id);

              return (
                <TableRow key={m.id} hover selected={selectedRow}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedRow} onChange={() => toggle(m.id)} />
                  </TableCell>

                  <TableCell sx={{ minWidth: 220 }}>
                    <Stack direction="row" gap={0.75} alignItems="center" flexWrap="wrap">
                      <Box component="span" sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                        {m.start}
                      </Box>
                      <Box component="span" sx={{ color: "text.secondary" }}>
                        →
                      </Box>
                      <Box component="span" sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                        {m.end}
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ minWidth: 160 }}>
                    <Typography variant="body2" noWrap title={m.eventTypeId}>
                      {m.eventTypeId}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ minWidth: 260 }}>
                    <Typography variant="body2" noWrap title={invitee}>
                      {invitee}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ minWidth: 120 }}>
                    <Chip
                      size="small"
                      label={m.status || "—"}
                      color={m.status === "scheduled" ? "success" : "default"}
                      sx={{
                        "&.MuiChip-filled": {
                          bgcolor: (th) => alpha(th.palette.success.main, 0.12),
                          color: "success.dark",
                        },
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ minWidth: 180 }}>
                    <Typography variant="body2" noWrap title={loc}>
                      {loc}
                    </Typography>
                  </TableCell>

                  <TableCell align="right" sx={{ minWidth: 160 }}>
                    <Tooltip title="Join">
                      <IconButton onClick={() => onJoin?.(m)} size="small" color="primary">
                        <Video size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Open details">
                      <IconButton onClick={() => onOpen?.(m)} size="small">
                        <Eye size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancel">
                      <IconButton onClick={() => onCancel?.(m)} size="small" color="error">
                        <X size={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}

            {!pageRows.length && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No meetings match your filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer (same pattern as TemplatesTable) */}
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
  );
}
