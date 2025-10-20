// /src/Component/dailer/Softphone/CallScript.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Paper, Typography, Box, Stack, Button, Chip, Tooltip, LinearProgress, Divider
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import KeyboardAltOutlinedIcon from "@mui/icons-material/KeyboardAltOutlined";
import { keyframes } from "@mui/system";
import { useDialerStore } from "../../store/useDialerStore";

/* === TUNABLES (match CRMFormPane’s spirit) ============================== */
const CONTENT_MAX_WIDTH = "90%";     // center column width cap
const SCRIPT_PANE_MIN_HEIGHT = 450;  // ↑ overall script box minimum height (px)
const PROMPT_STACK_SPACING = 1.25;   // gap between title and prompt
const OPTIONS_TOP_MARGIN = 1.5;      // extra space between [title+prompt] and options
const OPTION_STACK_SPACING = 0.75;   // vertical spacing between quick-reply buttons
const OPTIONS_MAX_WIDTH = "50%";     // cut options stack width by half
const TIMER_HEIGHT = 6;              // LinearProgress height
const COACH_CUE_BOX_WIDTH = 280;     // right-side “coach cue” box width (px)
const COACH_CUE_MIN_HEIGHT = 280;    // min height for the coach cue box (px)
const COACH_CUE_HIDE_BP = "sm";      // hide coach cue on xs (shows from sm and up)
/* ======================================================================= */

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
const CUE_VISIBILITY = makeVisibility(COACH_CUE_HIDE_BP);
const GRID_COLS = makeGridCols(COACH_CUE_HIDE_BP, COACH_CUE_BOX_WIDTH);

/* ---------- utils ---------- */
const tpl = (text, ctx) =>
  String(text || "").replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, path) => {
    const parts = path.split(".");
    let cur = ctx;
    for (const p of parts) cur = cur?.[p];
    return cur == null ? "" : String(cur);
  });

function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  const s = String(val).trim();
  if (!s) return [];
  try {
    const parsed = JSON.parse(s);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {}
  return s.split(",").map((v) => v.trim()).filter(Boolean);
}
function parseBranchMap(s) {
  if (!s) return {};
  try {
    const m = JSON.parse(String(s));
    return typeof m === "object" && m ? m : {};
  } catch {
    return String(s)
      .split(",")
      .map((p) => p.split(":").map((x) => x.trim()))
      .filter((pair) => pair.length === 2)
      .reduce((acc, [k, v]) => ((acc[k] = v), acc), {});
  }
}
function normalizeRowsToScriptJson(rows) {
  const steps = {};
  let start = null;
  rows.forEach((r, idx) => {
    const step_id = String(r.step_id || "").trim() || `step_${idx + 1}`;
    if (!start) start = step_id;
    steps[step_id] = {
      title: r.title ? String(r.title) : undefined,
      prompt: r.prompt ? String(r.prompt) : "",
      cue: r.cue ? String(r.cue) : undefined,
      quick_replies: toArray(r.quick_replies),
      branch: (r.branch_on || r.branch_map)
        ? { on: String(r.branch_on || "auto"), map: parseBranchMap(r.branch_map) }
        : undefined,
      next: r.next_step ? String(r.next_step) : "END",
      timer_secs: r.timer_secs !== "" && r.timer_secs != null ? Number(r.timer_secs) : undefined,
      action: r.action ? String(r.action) : undefined,
      qa_flag: r.qa_flag ? String(r.qa_flag) : undefined,
      crm_jump: r.crm_jump ? String(r.crm_jump) : undefined,
      disposition_hint: r.disposition_hint ? String(r.disposition_hint) : undefined,
    };
  });
  return { meta: { version: 1, name: "Uploaded Script" }, start, steps };
}
async function parseExcelFile(file) {
  const XLSX = await import(/* webpackChunkName: "xlsx" */ "xlsx");
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, { type: "array" });
  const sheetName = wb.SheetNames.includes("Script") ? "Script" : wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
  return normalizeRowsToScriptJson(rows);
}

/* ---------- tiny pulse for coach cue ---------- */
const pulse = keyframes`
  0% { transform: scale(1); opacity: .6; }
  50% { transform: scale(1.25); opacity: 1; }
  100% { transform: scale(1); opacity: .6; }
`;

export default function CallScript() {
  const lead = useDialerStore((s) => s.currentLead || {});
  const agent = useDialerStore((s) => s.agentProfile || {}); // <-- typo fixed below in final version
  const [script, setScript] = useState(null);
  const [stepId, setStepId] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [completed, setCompleted] = useState(false);
  const fileRef = useRef(null);
  const timerRef = useRef(null);

  // minimal fallback so panel isn’t empty before upload
  const fallback = useMemo(
    () => ({
      meta: { version: 1, name: "Minimal Greeting" },
      start: "intro",
      steps: {
        intro: {
          title: "Introduction",
          prompt: "Hi {{lead.name}}, I’m Alpha from Support. Do you have a minute?",
          cue: "Friendly tone; keep it light",
          quick_replies: ["Yes", "No"],
          branch: { on: "auto", map: { Yes: "wrap", No: "wrap" } },
          next: "wrap",
          timer_secs: 10,
        },
        wrap: {
          title: "Close",
          prompt: "Thanks — talk soon.",
          next: "END",
          timer_secs: 8,
          qa_flag: "CLOSE_OK",
          disposition_hint: "Interested",
        },
      },
    }),
    []
  );

  useEffect(() => {
    setScript(fallback);
    setStepId(fallback.start);
  }, [fallback]);

  const ctx = { lead, agent };
  const step = script?.steps?.[stepId] || null;
  const title = script?.meta?.name || "Call Script";
  const finished = stepId === "END";

  // countdown
  useEffect(() => {
    if (!step) return;
    if (!step.timer_secs) {
      setCountdown(null);
      return;
    }
    setCountdown(Number(step.timer_secs));
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev == null) return prev;
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [stepId, step?.timer_secs]);

  // keyboard shortcuts 1..9
  useEffect(() => {
    const handler = (e) => {
      if (!step?.quick_replies?.length) return;
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1 || n > 9) return;
      const idx = n - 1;
      const label = step.quick_replies[idx];
      if (label) {
        e.preventDefault();
        goNextVia(label);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step]);

  function goNextVia(replyLabel) {
    if (!step) return;

    // emit signals here if you wire them (qa_flag, crm_jump, disposition_hint, action)
    // useDialerStore.getState().emitScriptSignal?.({...})

    let next = step.next || "END";
    if (step.branch?.on?.toLowerCase() === "auto") {
      const mapped = step.branch?.map?.[String(replyLabel)];
      if (mapped) next = mapped;
    }
    if (next === "END" || !script.steps[next]) {
      setCompleted(true);
      setStepId("END");
      return;
    }
    setStepId(next);
  }

  async function handleFileChosen(file) {
    if (!file) return;
    try {
      const parsed = await parseExcelFile(file);
      setScript(parsed);
      setStepId(parsed.start);
      setCompleted(false);
    } catch (err) {
      console.error("Failed to parse script file:", err);
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        height: "100%",
        minHeight: SCRIPT_PANE_MIN_HEIGHT, // ← more height (tunable)
        flex: "1 1 auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        p: 2,
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {/* Header (mirrors CRMFormPane header density) */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2">{title}</Typography>
          {finished ? (
            <Chip size="small" label="Completed" />
          ) : stepId ? (
            <Chip size="small" label={`Step: ${stepId}`} />
          ) : null}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            hidden
            onChange={(e) => handleFileChosen(e.target.files?.[0])}
          />
          <Tooltip title="Upload script (.xlsx/.csv)">
            <span>
              <Button
                size="small"
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={() => fileRef.current?.click()}
                sx={{ borderRadius: 1 }}
              >
                Upload XLSX
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 1 }} />

      {/* Body: centered width, like CRMFormPane */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: CONTENT_MAX_WIDTH, py: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          {!finished && step ? (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: GRID_COLS, // left main + right coach cue from breakpoint
                  columnGap: 2,
                  rowGap: 1,
                  alignItems: "start",
                  flex: "1 1 auto",
                  minHeight: 0,
                }}
              >
                {/* LEFT: content (title, prompt, options) */}
                <Stack spacing={PROMPT_STACK_SPACING} sx={{ minWidth: 0 }}>
                  {step.title && (
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {step.title}
                    </Typography>
                  )}

                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                    {tpl(step.prompt, { lead, agent })}
                  </Typography>

                  {/* Quick replies — VERTICAL list (outlined-only, half width) */}
                  {step.quick_replies?.length ? (
                    <Stack spacing={OPTION_STACK_SPACING} sx={{ mt: OPTIONS_TOP_MARGIN, maxWidth: OPTIONS_MAX_WIDTH }}>
                      {step.quick_replies.map((label, i) => (
                        <Button
                          key={label}
                          size="small"
                          variant="outlined"           // ← outlined only (no purple fill)
                          color="inherit"              // neutral text/border
                          onClick={() => goNextVia(label)}
                          sx={{
                            justifyContent: "flex-start",
                            borderColor: "divider",
                            bgcolor: "transparent",
                            "&:hover": { borderColor: "text.primary", bgcolor: "action.hover" },
                            textTransform: "none",
                          }}
                          fullWidth
                        >
                          {i < 9 ? `${i + 1}. ` : ""}{label}
                        </Button>
                      ))}
                    </Stack>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      onClick={() => goNextVia("(next)")}
                      sx={{ alignSelf: "flex-start", mt: OPTIONS_TOP_MARGIN, borderColor: "divider" }}
                    >
                      Next
                    </Button>
                  )}
                </Stack>

                {/* RIGHT: Coach Cue box (extreme right) WITH TIMER */}
                {step.cue ? (
                  <Box sx={{ display: CUE_VISIBILITY, position: "relative" }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.25,
                        borderRadius: 1,
                        minHeight: COACH_CUE_MIN_HEIGHT,     // ← taller cue box
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
                        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                          {step.cue}
                        </Typography>
                      </Box>

                      {/* Timer lives here now */}
                      {typeof countdown === "number" && step.timer_secs ? (
                        <Box sx={{ pt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.max(0, Math.min(100, (100 * (step.timer_secs - Math.max(0, countdown))) / step.timer_secs))}
                            sx={{ height: TIMER_HEIGHT, borderRadius: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Time: {countdown}s
                          </Typography>
                        </Box>
                      ) : null}
                    </Paper>
                  </Box>
                ) : (
                  <Box sx={{ display: CUE_VISIBILITY }} />
                )}
              </Box>

              {/* Tip at the very bottom */}
              {step.quick_replies?.length ? (
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ pt: 1.25 }}>
                  <KeyboardAltOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">
                    Tip: press 1–9 to choose quickly
                  </Typography>
                </Stack>
              ) : null}
            </>
          ) : (
            <Stack spacing={1} alignItems="center" justifyContent="center" sx={{ minHeight: 220, textAlign: "center" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Script completed</Typography>
              <Typography variant="body2" color="text.secondary">
                You can upload a new script or restart from the first step.
              </Typography>
            </Stack>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
