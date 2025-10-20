// /src/Component/contacts/modals/ImportContactsModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Typography, Paper, List, ListItem, ListItemText,
  Chip, Pagination, Divider, Autocomplete, TextField, CircularProgress, Box
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
export default function ImportContactsModal({ open, onClose, onImported, campaignOptions = [] }) {
  const [files, setFiles] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [sheetsPreview, setSheetsPreview] = useState([]); // [{ fileName, name, rowsCount }]
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  // pagination (unchanged)
  const PER_PAGE = 8;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(sheetsPreview.length / PER_PAGE));
  const visibleSheets = useMemo(
    () => sheetsPreview.slice((page - 1) * PER_PAGE, (page - 1) * PER_PAGE + PER_PAGE),
    [sheetsPreview, page]
  );

  // input + scan token to avoid stale updates
  const fileInputRef = useRef(null);
  const scanTokenRef = useRef(0);

  // Clear state every time the dialog opens
  useEffect(() => {
    if (open) {
      resetAll();
    }
  }, [open]);

  const resetAll = () => {
    setFiles([]);
    setSheetsPreview([]);
    setSelectedCampaigns([]);
    setScanning(false);
    setParsing(false);
    setPage(1);
    scanTokenRef.current += 1; // invalidate any in-flight scans
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onPick = async (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
    setSheetsPreview([]);
    setPage(1);
    if (!list.length) return;

    const myToken = ++scanTokenRef.current;
    setScanning(true);

    try {
      const nextPreview = [];

      for (const file of list) {
        const ext = (file.name.split(".").pop() || "").toLowerCase();

        if (ext === "csv") {
          const text = await file.text();
          const rows = csvToObjects(text);
          nextPreview.push({ fileName: file.name, name: baseName(file.name), rowsCount: rows.length });
        } else if (ext === "xlsx" || ext === "xls") {
          const XLSXns = await import(/* webpackChunkName: "xlsx" */ "xlsx");
          const XLSX = XLSXns && XLSXns.read ? XLSXns : (XLSXns?.default || null);
          if (!XLSX || typeof XLSX.read !== "function") continue;

          const data = file.arrayBuffer ? await file.arrayBuffer() : await readAsArrayBuffer(file);
          const wb = XLSX.read(data, { type: "array" });

          wb.SheetNames.forEach((sheetName) => {
            const ws = wb.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
            nextPreview.push({
              fileName: file.name,
              name: String(sheetName || "Sheet"),
              rowsCount: json.length,
            });
          });
        } else {
          // unsupported types are ignored
          continue;
        }
      }

      // Ignore stale scan results
      if (scanTokenRef.current !== myToken) return;

      setSheetsPreview(nextPreview);
    } catch (err) {
      // Ignore if stale; otherwise show
      if (scanTokenRef.current === myToken) {
        alert(`Failed to scan file(s): ${err?.message || err}`);
      }
    } finally {
      if (scanTokenRef.current === myToken) {
        setScanning(false);
      }
      // allow re-selecting the same file again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const parseAll = async () => {
    if (!files.length) return;
    setParsing(true);
    try {
      const allSheetResults = [];
      const historyEntries = [];

      for (const file of files) {
        const ext = (file.name.split(".").pop() || "").toLowerCase();
        const fileSheets = [];
        let totalRowsForFile = 0;

        if (ext === "csv") {
          const text = await file.text();
          const rows = csvToObjects(text).map((r) => rowToContact(r, "upload", file.name));
          allSheetResults.push({ name: baseName(file.name), rows, campaigns: [...selectedCampaigns] });
          fileSheets.push({ name: baseName(file.name), rowsCount: rows.length });
          totalRowsForFile += rows.length;
        } else if (ext === "xlsx" || ext === "xls") {
          const XLSXns = await import(/* webpackChunkName: "xlsx" */ "xlsx");
          const XLSX = XLSXns && XLSXns.read ? XLSXns : (XLSXns?.default || null);
          if (!XLSX || typeof XLSX.read !== "function") throw new Error("XLSX module didn’t expose read().");

          const data = file.arrayBuffer ? await file.arrayBuffer() : await readAsArrayBuffer(file);
          const wb = XLSX.read(data, { type: "array" });
          wb.SheetNames.forEach((sheetName) => {
            const ws = wb.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
            const rows = json.map((r) => rowToContact(r, "upload", sheetName));
            allSheetResults.push({ name: String(sheetName || "Sheet"), rows, campaigns: [...selectedCampaigns] });
            fileSheets.push({ name: String(sheetName || "Sheet"), rowsCount: rows.length });
            totalRowsForFile += rows.length;
          });
        } else {
          continue;
        }

        historyEntries.push({
          fileName: file.name,
          at: new Date().toISOString(),
          byteSize: file.size || 0,
          mime: file.type || "",
          ext,
          sheets: fileSheets,
          totalRows: totalRowsForFile,
          campaigns: [...selectedCampaigns],
        });
      }

      persistHistory(historyEntries);
      onImported?.(allSheetResults);
    } catch (err) {
      alert(`Failed to parse file(s): ${err?.message || err}`);
    } finally {
      setParsing(false);
    }
  };

  const canImport = files.length > 0 && !scanning && sheetsPreview.length > 0 && !parsing;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import contacts from Excel / CSV</DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Each Excel sheet becomes its own tab. We’ll auto-map common columns; you can edit after import.
        </Typography>

        {/* Campaign attachment */}
        <Paper variant="outlined" sx={{ p: 2, mb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Attach to dialing campaign(s) (optional)
          </Typography>
          <Autocomplete
            multiple
            options={campaignOptions}
            value={selectedCampaigns}
            onChange={(_, v) => setSelectedCampaigns(v)}
            renderInput={(params) => (
              <TextField {...params} size="small" placeholder="Select campaigns" />
            )}
          />
          {!!selectedCampaigns.length && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: "block" }}>
              Selected: {selectedCampaigns.join(", ")}
            </Typography>
          )}
        </Paper>

        {/* Picker */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <input
            id="contacts-import-input"
            type="file"
            multiple
            accept=".csv,.xlsx,.xls"
            ref={fileInputRef}
            onChange={onPick}
            onClick={(e) => {
              // allow choosing the same file again to re-trigger onChange
              e.currentTarget.value = "";
            }}
            style={{ display: "none" }}
          />
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
            <label htmlFor="contacts-import-input">
              <Button component="span" variant="outlined" startIcon={<Upload size={16} />}>
                Choose file(s)
              </Button>
            </label>
            <Stack direction="row" alignItems="center" gap={1}>
              {scanning && <CircularProgress size={16} />}
              <Typography variant="body2" color="text.secondary">
                {files.length
                  ? scanning
                    ? `Scanning ${files.length} file(s)…`
                    : `${files.length} file(s) selected`
                  : "CSV/XLSX up to thousands of rows"}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Detected sheets */}
        {(scanning || sheetsPreview.length > 0) && (
          <>
            <Divider sx={{ my: 1.25 }} />
            <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
              <Typography variant="subtitle2">
                {`Detected sheets${files.length ? ` in ${files[0]?.name}` : ""}`}
              </Typography>
              {scanning && <CircularProgress size={14} />}
            </Stack>


            {sheetsPreview.length === 0 && !scanning ? (
              <Typography variant="body2" color="text.secondary">No sheets detected.</Typography>
            ) : (
              <>
                <List dense sx={{ mt: 0, pt: 0 }}>
                  {visibleSheets.map((s, i) => (
                    <ListItem
                      key={`${s.fileName}-${s.name}-${i}`}
                      disableGutters
                      secondaryAction={<Chip size="small" label={`${s.rowsCount} rows`} sx={{ ml: 1, flexShrink: 0 }} />}
                    >
                      <FileSpreadsheet size={16} style={{ marginRight: 8 }} />
                      <ListItemText
                        primary={s.name}
                        secondary={s.fileName}
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                      />
                    </ListItem>
                  ))}
                </List>
                {totalPages > 1 && (
                  <Stack alignItems="center" sx={{ mt: 0.5 }}>
                    <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} size="small" />
                  </Stack>
                )}
              </>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button startIcon={<X size={16} />} onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          startIcon={<Upload size={16} />}
          onClick={parseAll}
          disabled={!canImport}
        >
          {parsing ? "Importing…" : "Import"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ------------------------------- helpers ------------------------------- */
function baseName(n = "") { return n.replace(/\.[^.]+$/, ""); }

function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = (e) => resolve(e.target.result);
    fr.onerror = reject;
    fr.readAsArrayBuffer(file);
  });
}

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
