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
export default function ExportContactsModal({ open, onClose, rows = [], selectedIds = [], byId = {}, onExport }) {
  const [scope, setScope] = useState("filtered"); // 'filtered' | 'selected'
  const [fileName, setFileName] = useState(`contacts_${new Date().toISOString().slice(0,10)}.csv`);

  const exportRows = useMemo(() => {
    if (scope === "selected" && selectedIds.length) {
      return selectedIds.map((id) => byId[id]).filter(Boolean);
    }
    return rows;
  }, [scope, rows, selectedIds, byId]);

  const handleExport = async () => {
    // Assuming format is always 'csv' for now, and filters can be derived from query state
    // The `onExport` prop is `api.exportContacts` which expects (format, filters)
    // We need to pass the current query filters to the API for export
    // For simplicity, let's assume `onExport` will handle the filename and download
    await onExport?.('csv', { /* pass relevant filters from query state if available */ });
    onClose(); // Close modal after triggering export
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

