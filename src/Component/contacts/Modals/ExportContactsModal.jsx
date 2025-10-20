import React, { useMemo, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, FormControlLabel, RadioGroup, Radio, TextField, Typography } from "@mui/material";
import { Download, X } from "lucide-react";
import { contactToFlat } from "../utils/mappers";

/**
 * Props:
 * - open
 * - onClose
 * - rows: Contact[]                 // already filtered rows (for "filtered" scope)
 * - selectedIds?: string[]
 * - byId?: Record<string, Contact>  // if you want to export selected by lookup
 */
export default function ExportContactsModal({ open, onClose, rows = [], selectedIds = [], byId = {} }) {
  const [scope, setScope] = useState("filtered"); // 'filtered' | 'selected'
  const [fileName, setFileName] = useState(`contacts_${new Date().toISOString().slice(0,10)}.csv`);

  const exportRows = useMemo(() => {
    if (scope === "selected" && selectedIds.length) {
      return selectedIds.map((id) => byId[id]).filter(Boolean);
    }
    return rows;
  }, [scope, rows, selectedIds, byId]);

  const handleExport = () => {
    const plain = exportRows.map(contactToFlat);
    const csv = toCSV(plain);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export contacts</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Choose the export scope and filename. CSV is UTF-8 with headers.
        </Typography>

        <Stack spacing={1.5}>
          <RadioGroup row value={scope} onChange={(e) => setScope(e.target.value)}>
            <FormControlLabel value="filtered" control={<Radio />} label={`All filtered (${rows.length})`} />
            <FormControlLabel value="selected" control={<Radio />} label={`Selected only (${selectedIds.length})`} />
          </RadioGroup>

          <TextField size="small" label="Filename" value={fileName} onChange={(e) => setFileName(e.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<X size={16} />} onClick={onClose}>Cancel</Button>
        <Button variant="contained" startIcon={<Download size={16} />} onClick={handleExport} disabled={!exportRows.length}>
          Export CSV
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ------------------- simple CSV builder ------------------- */
function toCSV(rows = []) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => esc(r[h])).join(","));
  return lines.join("\n");
}
