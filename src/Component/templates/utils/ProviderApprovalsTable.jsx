// Path: src/Component/templates/utils/approvals/ProviderApprovalsTable.jsx

import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  Box,
  Stack,
  Typography,
  Pagination,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Menu,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Eye, ListTree, MoreVertical, ExternalLink, Send } from "lucide-react";
import EmptyState from "./EmptyState";

/* ---------- helpers ---------- */
const statusColor = (s) => {
  if (s === "Approved") return "success";
  if (s === "Rejected") return "error";
  if (["Submitted", "In-Review", "Pending"].includes(s)) return "warning";
  return "default";
};

function LimitedChips({
  items = [],
  limit = 3,
  format = (x) => x,
  size = "small",
  outlined = true,
  tooltipTitle,
}) {
  const shown = items.slice(0, limit);
  const remaining = Math.max(0, items.length - shown.length);
  const chipProps = outlined ? { variant: "outlined" } : {};
  const title = tooltipTitle || items.join(", ");

  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
      {shown.map((it, idx) => (
        <Chip key={`${it}-${idx}`} size={size} {...chipProps} label={format(it)} />
      ))}
      {remaining > 0 && (
        <Tooltip title={title}>
          <Chip size={size} {...chipProps} label={`+${remaining} more`} />
        </Tooltip>
      )}
    </Stack>
  );
}

/* ---------- Row actions (kebab) kept minimal; heavy actions live in dialog/drawer ---------- */
function RowActionsMenu({
  row,
  onOpenDetails,
  onOpenTimeline,
  onOpenProviderPortal,
  onOpenProviderSubmit,
}) {
  const [anchor, setAnchor] = React.useState(null);
  const open = Boolean(anchor);

  const items = [
    { key: "details", label: "View details", icon: <Eye size={16} />, onClick: () => onOpenDetails?.(row) },
    { key: "timeline", label: "Timeline", icon: <ListTree size={16} />, onClick: () => onOpenTimeline?.(row) },
    { key: "submit", label: "Send to provider", icon: <Send size={16} />, onClick: () => onOpenProviderSubmit?.(row) },
    { key: "portal", label: "Open provider portal", icon: <ExternalLink size={16} />, onClick: () => onOpenProviderPortal?.(row) },
  ];

  return (
    <>
      <Tooltip title="Actions">
        <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
          <MoreVertical size={16} />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
        {items.map((m) => (
          <MenuItem
            key={m.key}
            onClick={() => {
              setAnchor(null);
              m.onClick?.();
            }}
          >
            <Box sx={{ mr: 1, display: "inline-flex" }}>{m.icon}</Box>
            {m.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

/* ---------- Main table ---------- */
export default function ProviderApprovalsTable({
  rows = [],

  page = 0,
  pageSize = 25,
  total: totalProp,
  onPageChange,
  onPageSizeChange,

  onOpenTemplate,        // (templateId) => void
  onOpenDetails,         // (row) => void
  onOpenTimeline,        // (row) => void
  onOpenProviderPortal,  // (row) => void
  onOpenProviderSubmit,  // (row) => void

  // used only to render chips tooltips (full lists)
  getDetails,            // (templateId) => { providerStatuses, variants }
}) {
  const t = useTheme();

  const [orderBy, setOrderBy] = React.useState("submittedAt");
  const [order, setOrder] = React.useState("desc");

  const sortRows = React.useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      const A = a?.[orderBy];
      const B = b?.[orderBy];
      let cmp = 0;
      if (["submittedAt", "lastSyncAt"].includes(orderBy)) {
        cmp = new Date(A || 0).getTime() - new Date(B || 0).getTime();
      } else {
        cmp = String(A ?? "").localeCompare(String(B ?? ""));
      }
      return order === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [rows, orderBy, order]);

  const total = typeof totalProp === "number" ? totalProp : sortRows.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  const safePage = Math.min(page, pages - 1);
  const pageRows = sortRows.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const header = (id, label) => (
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

  // summaries derived from details provider to avoid undefineds
  const languagesForRow = (r) => {
    const d = getDetails?.(r.templateId);
    const langs = Array.from(
      new Set(
        (d?.variants || [])
          .map((v) => (v.lang || v.language || v.locale || "").toUpperCase())
          .filter(Boolean)
      )
    );
    return langs.length ? langs : ["EN"];
  };

  const providersForRow = (r) => {
    const d = getDetails?.(r.templateId);
    const names = (d?.providerStatuses || []).map((p) => p.name);
    return names.length ? names : ["Internal Review"];
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      <Box
        sx={{
          px: 2,
          py: 1,
          borderBottom: (th) => `1px solid ${th.palette.divider}`,
          backgroundColor: alpha(t.palette.primary.main, 0.04),
        }}
      >
        <Typography variant="subtitle2">Provider Submissions ({total})</Typography>
      </Box>

      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {header("templateName", "Template")}
              <TableCell>Providers</TableCell>
              <TableCell>Variants</TableCell>
              {header("submittedAt", "Submitted At")}
              <TableCell>Status</TableCell>
              {header("lastSyncAt", "Last Synced")}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pageRows.map((r) => {
              const langList = languagesForRow(r);
              const provList = providersForRow(r);

              return (
                <TableRow key={r.id} hover>
                  {/* Template */}
                  <TableCell sx={{ maxWidth: 320 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Tooltip title="Open template">
                        <IconButton size="small" onClick={() => onOpenTemplate?.(r.templateId)}>
                          <Eye size={16} />
                        </IconButton>
                      </Tooltip>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            cursor: "pointer",
                          }}
                          title={r.templateName}
                          onClick={() => onOpenDetails?.(r)}
                        >
                          {r.templateName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {r.channel}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  {/* Providers (first 3 + +n, hover shows full) */}
                  <TableCell sx={{ minWidth: 180 }}>
                    <Tooltip title={provList.join(", ")}>
                      <span>
                        <LimitedChips items={provList} limit={3} />
                      </span>
                    </Tooltip>
                  </TableCell>

                  {/* Variants (first 4 + +n, hover shows full) */}
                  <TableCell sx={{ minWidth: 150 }}>
                    <Tooltip title={langList.join(", ")}>
                      <span>
                        <LimitedChips items={langList} limit={4} />
                      </span>
                    </Tooltip>
                  </TableCell>

                  {/* Submitted */}
                  <TableCell>
                    <Typography variant="body2">
                      {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "—"}
                    </Typography>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip size="small" color={statusColor(r.status)} label={r.status || "—"} />
                  </TableCell>

                  {/* Last synced */}
                  <TableCell>
                    <Typography variant="body2">
                      {r.lastSyncAt ? new Date(r.lastSyncAt).toLocaleString() : "—"}
                    </Typography>
                  </TableCell>

                  {/* Kebab */}
                  <TableCell align="right">
                    <RowActionsMenu
                      row={r}
                      onOpenDetails={onOpenDetails}
                      onOpenTimeline={onOpenTimeline}
                      onOpenProviderPortal={onOpenProviderPortal}
                      onOpenProviderSubmit={onOpenProviderSubmit}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            {!pageRows.length && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <EmptyState
                    title="No provider submissions yet"
                    description="Try adjusting search, channel, status, or timeframe."
                  />
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
          {total
            ? `Showing ${total === 0 ? 0 : safePage * pageSize + 1}–${Math.min(
                total,
                (safePage + 1) * pageSize
              )} of ${total}`
            : "No results"}
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="center">
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
              onChange={(e) => onPageSizeChange?.(parseInt(e.target.value, 10))}
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
            onChange={(_, v) => onPageChange?.(v - 1)}
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
