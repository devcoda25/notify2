// /src/Component/contacts/modals/ImportContactsModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Typography, Paper, List, ListItem, ListItemText,
  Chip, Pagination, Divider, Autocomplete, TextField, CircularProgress, Box,
  FormGroup, FormControlLabel, Checkbox
} from "@mui/material";
import { Upload, X, FileSpreadsheet } from "lucide-react";
import { rowToContact } from "../utils/mappers";
import { persistHistory } from "../utils/uploadHistory";

/**
 * Behavior:
 * - Immediately scans files on selection (CSV + XLSX) and shows "Detected sheets".
 * - Shows a spinner while scanning.
 * - When the dialog is reopened, all local state is cleared.
 * - Selecting the same file again still triggers a scan (input reset).
 * - New scans cancel/override previous results (token guard).
 */
export default function ImportContactsModal({
  open,
  onClose,
  onImportToActiveGroup,
  onImportAsNewGroups,
  isDbTabActive,
  campaignOptions = [],
}) {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null); // { file, sheets: [{ name, rows, rowsCount }] }
  const [createAsGroups, setCreateAsGroups] = useState(false);

  const fileInputRef = useRef(null);
  const parseTokenRef = useRef(0);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      resetAll();
    }
  }, [open]);

  // Set checkbox default based on active tab context
  useEffect(() => {
    if (parsedData) {
      setCreateAsGroups(isDbTabActive);
    }
  }, [isDbTabActive, parsedData]);

  const resetAll = () => {
    setFile(null);
    setParsedData(null);
    setCreateAsGroups(false);
    setParsing(false);
    parseTokenRef.current += 1;
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onPick = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    resetAll();
    setFile(selectedFile);
    setParsing(true);

    const myToken = ++parseTokenRef.current;

    try {
      const sheets = [];
      const ext = (selectedFile.name.split(".").pop() || "").toLowerCase();

      if (ext === "csv") {
        const text = await selectedFile.text();
        const rows = csvToObjects(text);
        sheets.push({ name: baseName(selectedFile.name), rows, rowsCount: rows.length });
      } else if (ext === "xlsx" || ext === "xls") {
        const XLSXns = await import(/* webpackChunkName: "xlsx" */ "xlsx");
        const XLSX = XLSXns.read ? XLSXns : XLSXns.default;
        const data = await selectedFile.arrayBuffer();
        const wb = XLSX.read(data, { type: "array" });

        wb.SheetNames.forEach((sheetName) => {
          const ws = wb.Sheets[sheetName];
          const jsonRows = XLSX.utils.sheet_to_json(ws, { defval: "" });
          sheets.push({ name: String(sheetName || "Sheet"), rows: jsonRows, rowsCount: jsonRows.length });
        });
      } else {
        throw new Error("Unsupported file type. Please use CSV, XLSX, or XLS.");
      }

      if (parseTokenRef.current !== myToken) return;
      setParsedData({ file: selectedFile, sheets });
    } catch (err) {
      if (parseTokenRef.current === myToken) {
        alert(`Failed to parse file: ${err?.message || err}`);
        resetAll();
      }
    } finally {
      if (parseTokenRef.current === myToken) {
        setParsing(false);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImport = () => {
    if (!parsedData) return;

    if (createAsGroups) {
      onImportAsNewGroups?.(parsedData.sheets);
    } else {
      onImportToActiveGroup?.(parsedData.file);
    }
  };

  const canImport = file && parsedData && !parsing;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Contacts</DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Import contacts from a single CSV or Excel file. You can either merge them into your active group or create new groups from the sheets.
        </Typography>

        {/* File Picker */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <input
            id="contacts-import-input"
            type="file"
            accept=".csv,.xlsx,.xls"
            ref={fileInputRef}
            onChange={onPick}
            style={{ display: "none" }}
          />
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
            <label htmlFor="contacts-import-input">
              <Button component="span" variant="outlined" startIcon={<Upload size={16} />}>
                Choose File
              </Button>
            </label>
            <Stack direction="row" alignItems="center" gap={1}>
              {parsing && <CircularProgress size={16} />}
              <Typography variant="body2" color="text.secondary">
                {file ? (parsing ? `Parsing ${file.name}...` : file.name) : "No file selected."}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Options and Sheet Preview */}
        {parsedData && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Detected Sheets
            </Typography>
            <List dense sx={{ mt: 0, pt: 0 }}>
              {parsedData.sheets.map((s, i) => (
                <ListItem
                  key={`${s.name}-${i}`}
                  disableGutters
                  secondaryAction={<Chip size="small" label={`${s.rowsCount} rows`} />}
                >
                  <FileSpreadsheet size={16} style={{ marginRight: 8 }} />
                  <ListItemText primary={s.name} primaryTypographyProps={{ variant: "body2" }} />
                </ListItem>
              ))}
            </List>

            <Paper variant="outlined" sx={{ p: 2, mt: 1.5 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={createAsGroups}
                      onChange={(e) => setCreateAsGroups(e.target.checked)}
                      disabled={isDbTabActive}
                    />
                  }
                  label="Create individual groups from sheets"
                />
              </FormGroup>
              {isDbTabActive && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                  (Required when the "All" tab is active)
                </Typography>
              )}
            </Paper>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button startIcon={<X size={16} />} onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          startIcon={<Upload size={16} />}
          onClick={handleImport}
          disabled={!canImport}
        >
          {parsing ? "Parsing..." : "Import"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ------------------------------- helpers ------------------------------- */
function baseName(n = "") { return n.replace(/\.[^.]+$/, ""); }

function csvToObjects(text = "") {
  const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.length > 0);
  if (!lines.length) return [];
  const headers = splitCSVLine(lines[0]).map((h) => h.trim());
  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCSVLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (cells[idx] ?? "").trim(); });
    out.push(obj);
  }
  return out;
}
function splitCSVLine(line) {
  const out = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else { inQ = !inQ; }
    } else if (ch === "," && !inQ) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}
