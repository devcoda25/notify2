import React from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Checkbox, IconButton, Tooltip, Stack, Pagination, FormControl, Select, MenuItem, Typography
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Pencil, Trash2 } from "lucide-react";
import ContactRow from "./ContactRow";
import LoadingBar from "./LoadingBar";
import EmptyState from "./EmptyState";
import { DEFAULT_COLUMNS } from "../utils/mappers";

/* ----------------------------- turnables (local) ----------------------------- */
/** Adjust these here */
const TURNABLES = {
  table: {
    /** Minimum height of the scrollable table body */
    bodyMinHeight: 560, // change this if you want (e.g., 500/600)
    /** Max height to keep header+footer visible while body scrolls */
    bodyMaxHeight: "calc(100vh - 220px)", // page layout padding/bars considered
  },
};

/**
 * Presentational table (no internal filtering/sorting).
 *
 * Props:
 * - rows: Contact[] (already filtered & paginated for the current tab)
 * - columns?: Array<{ key:string, label:string, width?:number }>
 * - page: number (0-based)
 * - pageSize: number
 * - total: number
 * - onPageChange(page:number): void
 * - onPageSizeChange(size:number): void
 * - selection: { isSelected, toggle, isPageFullySelected, selectPage, selectNone, selectedIds, count }
 * - onRowClick(row), onEdit(row), onDelete(id)
 * - loading?: boolean
 * - dense?: boolean
 * - minBodyHeight?: number | string
 * - maxBodyHeight?: number | string
 */
export default function ContactsTable({
  rows = [],
  columns = DEFAULT_COLUMNS,
  page = 0,
  pageSize = 25,
  total = 0,
  onPageChange,
  onPageSizeChange,
  selection,
  onRowClick,
  onEdit,
  onDelete,
  loading = false,
  dense = true,
  minBodyHeight = TURNABLES.table.bodyMinHeight,
  maxBodyHeight = TURNABLES.table.bodyMaxHeight,
}) {
  const theme = useTheme();
  const size = dense ? "small" : "medium";

  // pagination maths
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min(total, (page + 1) * pageSize);
  const rppOptions = [10, 25, 50, 100];

  // empty-state centering height (approx header height depends on density)
  const headerApprox = size === "small" ? 44 : 56;
  const emptyMinHeight =
    typeof minBodyHeight === "number"
      ? Math.max(320, minBodyHeight - headerApprox)
      : 360; // fallback if using a CSS string

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {loading && <LoadingBar />}

      <TableContainer
        sx={{
          minHeight: minBodyHeight,
          maxHeight: maxBodyHeight,
          overflow: "auto",
          // subtle purple-tinted header (also reinforced by global theme override)
          "& .MuiTableCell-head": {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          },
          // nicer scrollbars, tinted purple
          "&::-webkit-scrollbar": { height: 10, width: 10 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: alpha(theme.palette.primary.main, 0.28),
            borderRadius: 8,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.45),
          },
        }}
      >
        <Table stickyHeader size={size} aria-label="Contacts table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ width: 48 }}>
                <Checkbox
                  color="primary"
                  size="small"
                  indeterminate={!!selection?.count && !selection?.isPageFullySelected}
                  checked={!!selection?.isPageFullySelected}
                  onChange={() => {
                    if (!selection) return;
                    selection.isPageFullySelected ? selection.selectNone() : selection.selectPage();
                  }}
                  inputProps={{ "aria-label": "Select all on page" }}
                />
              </TableCell>

              {columns.map((c) => (
                <TableCell
                  key={c.key}
                  sx={{
                    whiteSpace: "nowrap",
                    width: c.width || "auto",
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                  }}
                >
                  {c.label}
                </TableCell>
              ))}

              <TableCell align="right" sx={{ width: 120, fontWeight: 600, color: theme.palette.text.secondary }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(!rows || rows.length === 0) && !loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} sx={{ p: 0 }}>
                  {/* Centered placeholder in the visible body area */}
                  <Box
                    sx={{
                      minHeight: emptyMinHeight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 2.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.02),
                      borderTop: `1px dashed ${theme.palette.divider}`,
                      borderBottom: `1px dashed ${theme.palette.divider}`,
                    }}
                  >
                    <EmptyState
                      title="No contacts to show"
                      hint="Try changing filters, searching for a different term, or importing a file."
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const selected = !!selection?.isSelected?.(row.id);
                return (
                  <ContactRow
                    key={row.id || row._tmpKey}
                    row={row}
                    columns={columns}
                    selected={selected}
                    onToggleSelect={() => selection?.toggle?.(row.id)}
                    onClick={() => onRowClick?.(row)}
                    rightActions={
                      <Stack direction="row" alignItems="center" gap={0.5} className="pr-1">
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit?.(row);
                            }}
                            aria-label="Edit contact"
                          >
                            <Pencil size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete?.(row.id);
                            }}
                            aria-label="Delete contact"
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                  />
                );
              })
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
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.primary.main, 0.015),
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {total ? `Showing ${from}–${to} of ${total}` : "No results"}
          {selection?.count ? ` • ${selection.count} selected` : ""}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value) || 25)}
              displayEmpty
              renderValue={(v) => (v ? `${v} / page` : "Rows per page")}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(theme.palette.primary.main, 0.6),
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {rppOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt} / page
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Pagination
            color="primary"
            count={pages}
            page={Math.min(page + 1, pages)}
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
