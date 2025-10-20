// /src/Component/contacts/Modals/UploadsManagerDialog.jsx
import React, { useMemo, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Stack, Paper, Typography, TextField, InputAdornment, Button, Tooltip,
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Chip, Divider, Pagination, Autocomplete
} from "@mui/material";
import {
  Search, Upload, X, Trash2, FileSpreadsheet, ChevronRight, ChevronDown
} from "lucide-react";

/** Keep in sync with ImportContactsModal */
const LS_HISTORY_KEY = "contacts.uploadHistory";

/* ------------------------------- utils ------------------------------- */
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(LS_HISTORY_KEY) || "[]"); }
  catch { return []; }
}
function saveHistory(arr) {
  try { localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(arr)); } catch {}
}
function fmtDateTime(v) {
  if (!v) return "—";
  try { return new Date(v).toLocaleString(); } catch { return String(v); }
}
function num(v) {
  if (v === null || v === undefined) return 0;
  return typeof v === "number" ? v : Number(v) || 0;
}
function msToHMS(ms) {
  if (!ms && ms !== 0) return "—";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
           : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/* ------------------------------- module ------------------------------- */
export default function UploadsManagerDialog({
  open,
  onClose,
  campaignOptions = [],
  /** Called to open the actual import flow (we close this first) */
  onOpenImport,
}) {
  const [items, setItems] = useState(() => loadHistory());
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const PER = 10;

  const filtered = useMemo(() => {
    if (!q) return items;
    const s = q.toLowerCase();
    return items.filter((it) => {
      const hay = [
        it.fileName,
        ...(Array.isArray(it.campaigns) ? it.campaigns : []),
      ].join(" | ").toLowerCase();
      return hay.includes(s);
    });
  }, [items, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const visible = useMemo(
    () => filtered.slice((page - 1) * PER, (page - 1) * PER + PER),
    [filtered, page]
  );

  const updateItem = (id, patch) => {
    const next = items.map((it) => (it.id === id ? { ...it, ...patch } : it));
    setItems(next);
    saveHistory(next);
  };

  const deleteItem = (id) => {
    const next = items.filter((it) => it.id !== id);
    setItems(next);
    saveHistory(next);
  };

  /* ---------- UI helpers --------- */
  const CONTROL_H = 40; // keep input & buttons same height

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          width: "min(1100px, 96vw)",
          borderRadius: 2,
          position: "relative",
        },
      }}
    >
      <DialogTitle sx={{ py: 1.25, pr: 6 }}>
        {/* Close (top-right) */}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", top: 8, right: 8 }}
          aria-label="Close"
        >
          <X size={18} />
        </IconButton>

        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Typography variant="h6" noWrap>Uploaded files</Typography>

          {/* Controls: Search grows, Import at extreme right */}
          <Stack direction="row" alignItems="center" gap={1.25} sx={{ flex: 1, minWidth: 0, ml: 2 }}>
            <TextField
              size="small"
              placeholder="Search file or campaign…"
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              sx={{
                flex: 1,
                minWidth: 0,
                maxWidth: { xs: "100%", sm: 560 },
                "& .MuiOutlinedInput-root": { height: CONTROL_H, pr: 0.5 },
                "& .MuiOutlinedInput-input": { py: 0 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ flex: 1 }} />

            <Button
              variant="contained"
              size="medium"
              startIcon={<Upload size={16} />}
              onClick={() => { onClose?.(); onOpenImport?.(); }}
              sx={{ height: CONTROL_H, px: 2, flexShrink: 0 }}
            >
              Import
            </Button>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {/* Table */}
        <Table
          size="small"
          stickyHeader
          aria-label="Uploaded files"
          sx={{
            tableLayout: "fixed",
            width: "100%",
            "& .MuiTableCell-head": { whiteSpace: "nowrap" },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 42 }} />
              <TableCell sx={{ width: { xs: "44%", md: "36%" } }}>File</TableCell>
              <TableCell sx={{ width: { xs: "28%", md: "20%" } }}>Imported At</TableCell>
              <TableCell sx={{ width: { xs: "14%", md: "12%" } }}>Sheets</TableCell>
              <TableCell sx={{ width: { xs: "14%", md: "16%" } }}>Total Rows</TableCell>
              <TableCell sx={{ width: { xs: "14%", md: "16%" } }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 6 }}>
                  <Stack alignItems="center" spacing={1}>
                    <Typography variant="body1" color="text.secondary">
                      No uploads found{q ? " for your search" : ""}.
                    </Typography>
                    {!q && (
                      <Button
                        variant="contained"
                        startIcon={<Upload size={16} />}
                        onClick={() => { onClose?.(); onOpenImport?.(); }}
                      >
                        Import contacts
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              visible.map((it) => (
                <UploadRow
                  key={it.id}
                  item={it}
                  campaignOptions={campaignOptions}
                  onUpdate={updateItem}
                  onDelete={deleteItem}
                />
              ))
            )}
          </TableBody>
        </Table>
      </DialogContent>

      <DialogActions sx={{ px: 2 }}>
        <Stack direction="row" alignItems="center" gap={1} sx={{ mr: "auto", pl: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {filtered.length.toLocaleString()} file{filtered.length === 1 ? "" : "s"}
          </Typography>
        </Stack>

        {pages > 1 && (
          <Pagination
            count={pages}
            page={page}
            onChange={(_, v) => setPage(v)}
            size="small"
            sx={{ ".MuiPagination-ul": { py: 0.5 } }}
          />
        )}
      </DialogActions>
    </Dialog>
  );
}

/* ------------------------------ row ------------------------------ */
function UploadRow({ item, onUpdate, onDelete, campaignOptions }) {
  const [open, setOpen] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const sheetsCount = num(item.sheetsCount);
  const totalRows = num(item.totalRows);

  return (
    <>
      <TableRow hover sx={{ verticalAlign: "middle" }}>
        {/* Expand */}
        <TableCell sx={{ py: 1 }}>
          <IconButton size="small" onClick={() => setOpen((v) => !v)} aria-label="Toggle details">
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </IconButton>
        </TableCell>

        {/* File */}
        <TableCell sx={{ py: 1.25, overflow: "hidden" }}>
          <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
            <FileSpreadsheet size={16} />
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
              }}
              title={item.fileName}
            >
              {item.fileName}
            </Typography>
          </Stack>
        </TableCell>

        {/* Imported At */}
        <TableCell sx={{ py: 1.25, overflow: "hidden" }}>
          <Typography variant="body2" noWrap>{fmtDateTime(item.at)}</Typography>
        </TableCell>

        {/* Sheets */}
        <TableCell sx={{ py: 1.25 }}>
          <Typography variant="body2" noWrap>{sheetsCount}</Typography>
        </TableCell>

        {/* Total Rows */}
        <TableCell sx={{ py: 1.25 }}>
          <Typography variant="body2" noWrap>{totalRows}</Typography>
        </TableCell>

        {/* Actions */}
        <TableCell align="right" sx={{ py: 1 }}>
          <Tooltip title="Delete file from history">
            <IconButton size="small" color="error" onClick={() => onDelete(item.id)}>
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      {/* Details row */}
      {open && (
        <TableRow>
          <TableCell colSpan={6} sx={{ py: 0, backgroundColor: (t) => t.palette.action.hover }}>
            <Box sx={{ px: 2.5, py: 1.5 }}>
              {/* Summary grid */}
              <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={2} flexWrap="wrap">
                <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 200 }}>
                  <Typography variant="body2" color="text.secondary">File</Typography>
                  <Typography variant="body2" sx={{ maxWidth: 360 }} noWrap title={item.fileName}>{item.fileName}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="body2" color="text.secondary">Imported</Typography>
                  <Typography variant="body2">{fmtDateTime(item.at)}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="body2" color="text.secondary">Sheets</Typography>
                  <Chip size="small" label={sheetsCount} />
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="body2" color="text.secondary">Total Rows</Typography>
                  <Chip size="small" label={totalRows} />
                </Stack>
                {item.durationMs !== undefined && (
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography variant="body2" color="text.secondary">Duration</Typography>
                    <Chip size="small" label={msToHMS(item.durationMs)} />
                  </Stack>
                )}
                {item.errorCount !== undefined && (
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography variant="body2" color="text.secondary">Errors</Typography>
                    <Chip size="small" color={item.errorCount ? "error" : "success"} label={num(item.errorCount)} />
                  </Stack>
                )}
                {item.duplicates !== undefined && (
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography variant="body2" color="text.secondary">Duplicates</Typography>
                    <Chip size="small" label={num(item.duplicates)} />
                  </Stack>
                )}
                {item.createdBy && (
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography variant="body2" color="text.secondary">Created By</Typography>
                    <Chip size="small" variant="outlined" label={item.createdBy} />
                  </Stack>
                )}
              </Stack>

              <Divider sx={{ my: 1.25 }} />

              {/* Campaigns editor (inline) */}
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                Campaigns
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "stretch", sm: "center" }}>
                <Autocomplete
                  multiple
                  size="small"
                  options={campaignOptions}
                  value={item.campaigns || []}
                  onChange={(_, v) => onUpdate(item.id, { campaigns: v })}
                  sx={{
                    flex: 1,
                    minWidth: 240,
                    "& .MuiOutlinedInput-root": { py: 0.25, minHeight: 36 },
                    "& .MuiChip-root": { height: 22 },
                  }}
                  renderInput={(params) => <TextField {...params} placeholder="Add campaigns" />}
                />
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="text" onClick={() => setShowRaw((s) => !s)}>
                    {showRaw ? "Hide JSON" : "View JSON"}
                  </Button>
                </Stack>
              </Stack>

              {/* Mapping summary */}
              {(item.mappedFields || item.unmatchedColumns) && (
                <>
                  <Divider sx={{ my: 1.25 }} />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    {item.mappedFields && (
                      <Box sx={{ minWidth: 200 }}>
                        <Typography variant="caption" color="text.secondary">Mapped Fields</Typography>
                        <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.75, mt: 0.5 }}>
                          {Object.entries(item.mappedFields).map(([k, v]) => (
                            <Chip key={k} size="small" label={`${k} → ${v}`} />
                          ))}
                        </Stack>
                      </Box>
                    )}
                    {item.unmatchedColumns && (
                      <Box sx={{ minWidth: 200 }}>
                        <Typography variant="caption" color="text.secondary">Unmatched Columns</Typography>
                        <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.75, mt: 0.5 }}>
                          {item.unmatchedColumns.length
                            ? item.unmatchedColumns.map((c) => <Chip key={c} size="small" variant="outlined" label={c} />)
                            : <Chip size="small" variant="outlined" label="None" />}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </>
              )}

              {/* Sheets list */}
              {Array.isArray(item.sheetNames) && (
                <>
                  <Divider sx={{ my: 1.25 }} />
                  <Typography variant="caption" color="text.secondary">Sheets</Typography>
                  <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.75, mt: 0.5 }}>
                    {item.sheetNames.length
                      ? item.sheetNames.map((s) => <Chip key={s} size="small" label={s} />)
                      : <Chip size="small" variant="outlined" label="No sheets" />}
                  </Stack>
                </>
              )}

              {/* Notes */}
              {item.notes && (
                <>
                  <Divider sx={{ my: 1.25 }} />
                  <Typography variant="caption" color="text.secondary">Notes</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{item.notes}</Typography>
                </>
              )}

              {/* Raw JSON for debugging */}
              {showRaw && (
                <>
                  <Divider sx={{ my: 1.25 }} />
                  <Paper variant="outlined" sx={{ p: 1, overflow: "auto", maxHeight: 240 }}>
                    <pre style={{ margin: 0, fontSize: 12 }}>
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </Paper>
                </>
              )}
            </Box>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
