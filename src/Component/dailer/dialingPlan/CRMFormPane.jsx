// /src/Component/crm/CRMFormPane.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Paper, Typography, Box, Alert, Stack, Button, IconButton, Tooltip, Divider, LinearProgress, Fade
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardAltOutlinedIcon from "@mui/icons-material/KeyboardAltOutlined";
import { keyframes } from "@mui/system";
import * as XLSX from "xlsx";
import FieldRenderer from "./FieldRenderer";

/* === TUNABLES =========================================================== */
const QUESTIONS_PER_PAGE = 1;           // questions per slide
const QUESTION_STACK_SPACING = 2;       // space between questions on a page
const CONTENT_MAX_WIDTH = "90%";        // max content width
const QUESTION_PART_GAP = 1.75;         // space between name/desc/sample/input/tip

// --- New UX tunables (mirroring script upgrades) ---
const LABEL_FONT_SIZE = "1rem";         // label text size (was subtitle2 default)
const DESC_FONT_SIZE = "0.95rem";       // description text size (was body2 default)
const SAMPLE_FONT_SIZE = "0.92rem";     // sample chip font size
const INPUT_TOP_MARGIN = 1.25;          // extra gap between [label+desc+sample] and the input
const SHOW_COACH_CUE_FROM = "sm";       // show right coach panel from this breakpoint and up
const COACH_CUE_BOX_WIDTH = 280;        // width of right coach cue panel (px)
const COACH_CUE_MIN_HEIGHT = 240;       // min height of coach cue card (px)
/* ====================================================================== */

/* ---------- responsive helpers (no computed keys in JSX) ---------- */
const BREAKPOINTS_ORDER = ["xs", "sm", "md", "lg", "xl"];
function makeVisibility(bp = "sm") {
  const idx = Math.max(0, BREAKPOINTS_ORDER.indexOf(bp));
  const vis = {};
  BREAKPOINTS_ORDER.forEach((k, i) => (vis[k] = i >= idx ? "block" : "none"));
  return vis;
}
function makeGridCols(bp = "sm", width = 260) {
  const idx = Math.max(0, BREAKPOINTS_ORDER.indexOf(bp));
  const cols = {};
  BREAKPOINTS_ORDER.forEach((k, i) => (cols[k] = i >= idx ? `1fr ${width}px` : "1fr"));
  return cols;
}
const CUE_VISIBILITY = makeVisibility(SHOW_COACH_CUE_FROM);
const GRID_COLS = makeGridCols(SHOW_COACH_CUE_FROM, COACH_CUE_BOX_WIDTH);

/* ---------- tiny pulse for coach cue ---------- */
const pulse = keyframes`
  0% { transform: scale(1); opacity: .6; }
  50% { transform: scale(1.25); opacity: 1; }
  100% { transform: scale(1); opacity: .6; }
`;

/* helpers */
function normBool(v) { if (typeof v === "boolean") return v; const s = String(v ?? "").trim().toLowerCase(); return s === "true" || s === "1" || s === "yes"; }
function normNum(v, d) { if (v === "" || v == null) return d; const n = Number(v); return Number.isFinite(n) ? n : d; }
function normType(raw) { const t = String(raw || "").trim().toLowerCase().replace(/\s+/g, "_"); if (t === "dropdown") return "select"; if (t === "multiselect" || t === "multi-choice" || t === "multi_choice") return "multi_select"; if (t === "imageupload" || t === "image_upload") return "image_upload"; if (t === "docupload" || t === "documentupload") return "document_upload"; if (t === "fileupload") return "file_upload"; if (t === "shorttext") return "short_text"; if (t === "longtext") return "long_text"; if (t === "toggle") return "switch"; return t || "short_text"; }
function toOptions(val) { const s = String(val ?? ""); return s.split(/[,|]/).map(x => x.trim()).filter(Boolean); }
function basenameNoExt(s) { const base = String(s || "").split(/[\\/]/).pop(); return base.replace(/\.[^.]+$/, ""); }

async function parseExcelToSchema(file, { title = "Uploaded CRM Form" } = {}) {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
  const fields = rows.map(r => {
    const name = String(r.name || r.qtn || r.question || r["qtn name"] || r["question_name"] || r["question name"] || "").trim();
    if (!name) return null;
    const type = normType(r.type || r["input type"] || r["input_type"] || r["answer type"] || "short_text");
    const options = toOptions(r.options || r.choices || r["multi-choice"] || r["multi_choice"]);
    const description = r.description || r.desc || r["question description"] || "";
    const sample = r.sample || r["sample answer"] || r.example || "";
    return {
      name,
      label: r.label || r["question label"] || name,
      type,
      required: normBool(r.required),
      options,
      multi: normBool(r.multi || r["multi-choice"] || r["multi_choice"]),
      min: r.min === "" ? undefined : Number(r.min),
      max: r.max === "" ? undefined : Number(r.max),
      rows: normNum(r.rows, 3),
      description: String(description || ""),
      sample: String(sample || ""),
      placeholder: r.placeholder || (sample ? String(sample) : ""),
      helperText: r.helperText || r.help || (description ? String(description) : ""),
      default: r.default ?? "",
      accept: r.accept || "",
      currencyCode: r.currencyCode || r.currency || "",
    };
  }).filter(Boolean);
  return { title: title || "Uploaded CRM Form", fields };
}

export default function CRMFormPane({
  paneHeight = "450px",
  loading = false,
  schema = null,
  values = {},
  onChange = () => {},
  onSave = () => {},
  onSaveFinal = () => {},
  onCancelForm = () => {},
  onCompletionChange = () => {},
  notFoundMessage = "No manager form found for the selected path.",
  canUpload = false,                // ← upload button only when true
}) {
  const [localSchema, setLocalSchema] = useState(null);
  const [localValues, setLocalValues] = useState({});
  const [parseError, setParseError] = useState("");
  const [page, setPage] = useState(0);
  const [completed, setCompleted] = useState(false); // after final page saved

  // If upload gets disabled while a local form exists, clear it
  useEffect(() => {
    if (!canUpload && (localSchema || Object.keys(localValues).length)) {
      setLocalSchema(null);
      setLocalValues({});
      setPage(0);
      setCompleted(false);
      onCompletionChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUpload]);

  const effectiveSchema = useMemo(() => schema || localSchema, [schema, localSchema]);
  const effectiveValues = useMemo(() => schema ? values : localValues, [schema, values, localValues]);

  const fields = effectiveSchema?.fields || [];
  const totalQuestions = fields.length;

  const QPP = Math.max(1, Number(QUESTIONS_PER_PAGE));
  const totalPages = Math.max(1, Math.ceil(totalQuestions / QPP));
  const atStart = page <= 0;
  const atEnd = totalQuestions > 0 && page === totalPages - 1;

  const startIdx = page * QPP;
  const endIdx = Math.min(startIdx + QPP, totalQuestions);
  const pageFields = fields.slice(startIdx, endIdx);

  useEffect(() => { setPage(0); setCompleted(false); onCompletionChange(false); }, [effectiveSchema]); // reset when schema changes

  const setValue = (name, val) => { onChange(name, val); if (!schema) setLocalValues(s => ({ ...s, [name]: val })); };

  const handleUpload = async (file) => {
    if (!file) return;
    try {
      setParseError("");
      const parsed = await parseExcelToSchema(file, { title: file.name });
      setLocalSchema(parsed);
      const initVals = {};
      for (const f of parsed.fields || []) {
        initVals[f.name] =
          f.default !== undefined && f.default !== ""
            ? f.default
            : (f.type === "checkbox" || f.type === "switch") ? false
              : (f.type === "multi_select" || f.type === "tags" || f.type === "chips") ? []
                : (f.type?.includes("upload")) ? null
                  : "";
      }
      setLocalValues(initVals);
      setPage(0);
      setCompleted(false);
      onCompletionChange(false);
    } catch (e) {
      console.error(e);
      setLocalSchema(null);
      setParseError("Failed to read the spreadsheet. Ensure it’s a valid .xlsx/.xls file.");
    }
  };

  const clearLocal = () => { setParseError(""); setLocalSchema(null); setLocalValues({}); setPage(0); setCompleted(false); onCompletionChange(false); };

  const goPrev = useCallback(() => setPage(p => Math.max(0, p - 1)), []);
  const goNext = useCallback(() => setPage(p => Math.min(Math.max(totalPages - 1, 0), p + 1)), [totalPages]);

  // Enter = Save current page, and advance (or complete on last page)
  useEffect(() => {
    const onKey = e => {
      if (e.key !== "Enter" || completed) return;
      if (!totalQuestions) return;
      e.preventDefault();
      onSave(effectiveValues, effectiveSchema);
      if (atEnd) {
        setCompleted(true);
        onCompletionChange(true);
      } else {
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [completed, totalQuestions, atEnd, goNext, onSave, effectiveValues, effectiveSchema, onCompletionChange]);

  const noFields = !!effectiveSchema && totalQuestions === 0;
  const rawTitle = loading ? "Loading CRM form…" : effectiveSchema?.title || "CRM Form";
  const displayTitle = basenameNoExt(rawTitle);

  // Prepare coach content from the first field on the page (good default since QPP=1)
  const primaryField = pageFields[0] || null;
  const coachBullets = useMemo(() => {
    if (!primaryField) return [];
    const bullets = [];
    if (primaryField.description) bullets.push(`Goal: ${primaryField.description}`);
    if (primaryField.sample) bullets.push(`Example: ${primaryField.sample}`);
    if (primaryField.required) bullets.push("Required: yes");
    if (primaryField.type) bullets.push(`Type: ${primaryField.type}`);
    return bullets.slice(0, 4);
  }, [primaryField]);

  return (
    <Paper
      variant="outlined"
      sx={{
        height: paneHeight,
        flex: "0 0 auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        p: 2,
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {/* header row */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Stack spacing={1.25}>
          <Typography variant="body2">{displayTitle}</Typography>
          {totalQuestions > 0 && !completed && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 180 }}>
              <Box sx={{ flex: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={totalPages ? Math.round(((page + 1) / totalPages) * 100) : 0}
                  sx={{ height: 6, borderRadius: 1 }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {page + 1}/{totalPages}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {localSchema && !completed && canUpload && (
            <Tooltip title="Clear uploaded form">
              <IconButton size="small" onClick={clearLocal} sx={{ borderRadius: 1 }}>
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {canUpload && !completed && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              component="label"
              sx={{ borderRadius: 1 }}
            >
              Upload XLSX
              <input
                hidden
                type="file"
                accept=".xlsx,.xls"
                onChange={async (e) => { const file = e.target.files?.[0]; await handleUpload(file); e.target.value = ""; }}
              />
            </Button>
          )}
        </Stack>
      </Stack>

      <Divider sx={{ mb: 1 }} />

      {/* Body */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: CONTENT_MAX_WIDTH, py: 1 }}>
          {!!parseError && <Alert severity="error" sx={{ mb: 1, borderRadius: 1 }}>{parseError}</Alert>}

          {/* Blank-state (nice icon + title) when no schema */}
          {!loading && !effectiveSchema && (
            <Box
              sx={{
                height: "100%",
                minHeight: 260,
                border: (t) => `1px dashed ${t.palette.divider}`,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2
              }}
            >
              <Stack spacing={1.25} alignItems="center">
                <DescriptionOutlinedIcon sx={{ fontSize: 40, color: "text.disabled" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  No CRM form available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {notFoundMessage}
                </Typography>
              </Stack>
            </Box>
          )}

          {/* No fields warning */}
          {noFields && (
            <Alert severity="warning" sx={{ width: "100%", borderRadius: 1 }}>
              Found a sheet but no fields. Include at least <strong>name</strong> and <strong>type</strong>.
              Options go in <strong>options / multi-choice</strong>. You can add <strong>description</strong> and <strong>sample</strong>.
            </Alert>
          )}

          {/* Questions OR Success */}
          {!!effectiveSchema && !loading && !noFields && !completed && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: GRID_COLS,  // main content + right coach panel from sm+
                columnGap: 2,
                alignItems: "start",
                minHeight: 0,
              }}
            >
              {/* LEFT: questions */}
              <Stack spacing={QUESTION_STACK_SPACING} sx={{ minWidth: 0 }}>
                {pageFields.map((f) => {
                  const fieldForRenderer = { ...f, helperText: undefined };
                  const tooltipText = f.helperText || f.description || "No additional guidance";
                  return (
                    <Stack
                      key={String(f.name)}
                      spacing={0}
                      sx={{ "& .crm-part + .crm-part": { mt: QUESTION_PART_GAP } }}
                    >
                      {/* Label row with tooltip */}
                      <Stack direction="row" alignItems="center" spacing={0.75} className="crm-part">
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: LABEL_FONT_SIZE }}>
                          {f.label || f.name}{f.required ? " *" : ""}
                        </Typography>
                        {(f.helperText || f.description) && (
                          <Tooltip title={tooltipText}>
                            <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary", cursor: "help" }} />
                          </Tooltip>
                        )}
                      </Stack>

                      {/* Description */}
                      {f.description && (
                        <Typography className="crm-part" sx={{ fontSize: DESC_FONT_SIZE }} color="text.secondary">
                          {f.description}
                        </Typography>
                      )}

                      {/* SAMPLE: faint purple */}
                      {f.sample && (
                        <Box
                          className="crm-part"
                          sx={{
                            display: "inline-block",
                            px: 1,
                            py: 0.5,
                            bgcolor: (t) =>
                              t.palette.mode === "dark"
                                ? "rgba(103, 58, 183, 0.22)"
                                : "rgba(103, 58, 183, 0.10)",
                            borderRadius: 1,
                            fontSize: SAMPLE_FONT_SIZE,
                          }}
                        >
                          <strong>Sample:</strong> {f.sample}
                        </Box>
                      )}

                      {/* INPUT — give extra top gap for visual separation */}
                      <Box className="crm-part" sx={{ mt: INPUT_TOP_MARGIN }}>
                        <FieldRenderer field={fieldForRenderer} value={effectiveValues?.[f.name]} onChange={setValue} />
                      </Box>

                      {/* Helper (kept, since tooltip is quick-glance) */}
                      {f.helperText && (
                        <Typography className="crm-part" variant="caption" color="text.secondary">
                          {f.helperText}
                        </Typography>
                      )}
                    </Stack>
                  );
                })}

                {/* Tip at the very bottom (Enter to save & advance) */}
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ pt: 1 }}>
                  <KeyboardAltOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">
                    Tip: Press <strong>Enter</strong> to save this page and continue.
                  </Typography>
                </Stack>
              </Stack>

              {/* RIGHT: Coach Cue panel (from sm+) */}
              <Box sx={{ display: CUE_VISIBILITY }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.25,
                    borderRadius: 1,
                    minHeight: COACH_CUE_MIN_HEIGHT,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    bgcolor: (t) =>
                      t.palette.mode === "dark"
                        ? "rgba(103, 58, 183, 0.10)"
                        : "rgba(103, 58, 183, 0.06)",
                  }}
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          animation: `${pulse} 1.8s ease-in-out infinite`,
                        }}
                      />
                      <TipsAndUpdatesOutlinedIcon fontSize="small" />
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        Coach Cue
                      </Typography>
                    </Stack>

                    {primaryField ? (
                      <Stack spacing={0.5}>
                        {coachBullets.map((b, i) => (
                          <Typography key={i} variant="body2" sx={{ lineHeight: 1.35 }}>
                            • {b}
                          </Typography>
                        ))}
                        {!coachBullets.length && (
                          <Typography variant="body2" color="text.secondary">
                            Contextual guidance will appear here for this field.
                          </Typography>
                        )}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Contextual guidance will appear here for this field.
                      </Typography>
                    )}
                  </Box>

                  {/* Optional: small reminder */}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Keep answers concise and accurate. Required fields are marked with *.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )}

          {/* Success message (animated) */}
          {completed && (
            <Fade in>
              <Stack
                spacing={1}
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: 260, textAlign: "center" }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 56, color: "success.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Interaction has been logged successfully
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You can save the interaction or cancel to go back.
                </Typography>
              </Stack>
            </Fade>
          )}
        </Box>
      </Box>

      {/* Footer: pinned at bottom */}
      {!!effectiveSchema && !loading && !noFields && (
        <Box
          sx={{
            mt: 1,
            pt: 1,
            borderTop: (t) => `1px solid ${t.palette.divider}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          {!completed ? (
            <>
              <Tooltip title={atStart ? "You're at the first page" : "Go to previous page"}>
                <span>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ArrowBackIosNewIcon fontSize="inherit" />}
                    onClick={goPrev}
                    disabled={atStart}
                    sx={{ borderRadius: 1 }}
                  >
                    Prev
                  </Button>
                </span>
              </Tooltip>

              <Tooltip title={atEnd ? "Save and complete" : "Save and continue"}>
                <Button
                  size="small"
                  variant="contained"
                  endIcon={<ArrowForwardIosIcon fontSize="inherit" />}
                  onClick={() => {
                    onSave(effectiveValues, effectiveSchema);      // save current page
                    if (atEnd) {
                      setCompleted(true);
                      onCompletionChange(true);
                    } else {
                      goNext();
                    }
                  }}
                  sx={{ borderRadius: 1 }}
                >
                  Save
                </Button>
              </Tooltip>
            </>
          ) : (
            // Completed: only Save Interaction + Cancel
            <Stack direction="row" spacing={2} sx={{ ml: "auto" }}>
              <Button size="small" variant="text" color="inherit" onClick={onCancelForm} sx={{ borderRadius: 1 }}>
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => onSaveFinal(effectiveValues, effectiveSchema)}
                sx={{ borderRadius: 1 }}
              >
                Save Interaction
              </Button>
            </Stack>
          )}
        </Box>
      )}
    </Paper>
  );
}
