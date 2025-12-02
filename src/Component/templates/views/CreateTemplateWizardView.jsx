// Path: src/Component/templates/views/CreateTemplateWizardView.jsx
import React, { useReducer, useMemo, useCallback } from "react";
import {
  Box,
  Stack,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  Divider,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Type as TypeIcon,
  Files,
  Palette,
  Eye,
  Save,
  Plus,
} from "lucide-react";

import CHANNELS from "../constants/CHANNELS";
import TEMPLATE_TYPES from "../constants/TEMPLATE_TYPES";
import APPROVAL_STATES from "../constants/APPROVAL_STATES";

import useTemplatesApi from "../hooks/useTemplatesApi";

import { resolveVariablesInString, resolveAndReport } from "../core/variableResolver";
import { validateTemplate } from "../core/validators";

import TemplatePreviewPane from "../utils/TemplatePreviewPane";
import ValidationPanel from "../utils/ValidationPanel";
import { VariantManager, BuildPane } from "./TemplateParts";

function newVariantId() {
  return "v_" + Math.random().toString(36).slice(2, 8);
}

const initialState = {
  step: 0,
  name: "",
  description: "",
  channel: "email",
  type: Object.values(TEMPLATE_TYPES)[0]?.id || "utility",
  requireApproval: false,
  tags: [],
  variants: [],
  activeVariantId: null,
  variantDrafts: {},
  variablesJSON: '{\n  "user_name": "Ada Lovelace",\n  "current_short_date": "2025-09-10"\n}',
  snack: { open: false, message: "", severity: "info" },
};

function wizardReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'ADD_VARIANT': {
      console.log("[Reducer] ADD_VARIANT called. State before:", state);
      const id = newVariantId();
      const newVariant = {
        id,
        name: action.payload.name || "Untitled",
        description: action.payload.description || "",
        tags: action.payload.tags || [],
        locale: action.payload.locale || "en",
        steps: {},
      };
      const newState = {
        ...state,
        variants: [...state.variants, newVariant],
        variantDrafts: {
          ...state.variantDrafts,
          [id]: {
            content: { subject: "", title: "", body: "", html: "", headerText: "", headerHtml: "", footerText: "", footerHtml: "", buttons: [], links: [], media: [] },
          },
        },
      };
      console.log("[Reducer] ADD_VARIANT finished. State after:", newState);
      return newState;
    }
    case 'UPDATE_VARIANT':
      return {
        ...state,
        variants: state.variants.map((v) => (v.id === action.id ? { ...v, ...action.patch } : v)),
      };
    case 'DELETE_VARIANT':
      const newDrafts = { ...state.variantDrafts };
      delete newDrafts[action.id];
      return {
        ...state,
        variants: state.variants.filter((v) => v.id !== action.id),
        variantDrafts: newDrafts,
        activeVariantId: state.activeVariantId === action.id ? null : state.activeVariantId,
      };
    case 'UPDATE_ACTIVE_DRAFT':
      if (!state.activeVariantId) return state;
      return {
        ...state,
        variantDrafts: {
          ...state.variantDrafts,
          [state.activeVariantId]: {
            content: action.patch.content ? { ...(state.variantDrafts[state.activeVariantId]?.content || {}), ...action.patch.content } : state.variantDrafts[state.activeVariantId]?.content || {},
          },
        },
      };
    case 'SHOW_SNACK':
      return { ...state, snack: { open: true, ...action.payload } };
    case 'HIDE_SNACK':
      return { ...state, snack: { ...state.snack, open: false } };
    default:
      return state;
  }
}

export default function CreateTemplateWizardView({ defaultChannel = "email", onDone }) {
  const t = useTheme();
  const api = useTemplatesApi();

  const [state, dispatch] = useReducer(wizardReducer, {
    ...initialState,
    channel: defaultChannel,
    requireApproval: ["whatsapp"].includes(defaultChannel),
  });

  const {
    step, name, description, channel, type, requireApproval, tags,
    variants, activeVariantId, variantDrafts, variablesJSON, snack
  } = state;

  const channelsById = useMemo(() => Object.fromEntries(CHANNELS.map((c) => [c.id, c])), []);

  // ---- Actions dispatched from children ----
  const addVariantSeed = (payload) => dispatch({ type: 'ADD_VARIANT', payload });
  const updateVariant = (id, patch) => dispatch({ type: 'UPDATE_VARIANT', id, patch });
  const deleteVariant = (id) => dispatch({ type: 'DELETE_VARIANT', id });
  const updateActiveDraft = (patch) => dispatch({ type: 'UPDATE_ACTIVE_DRAFT', patch });
  const setSnack = (payload) => dispatch({ type: 'SHOW_SNACK', payload });

  const markVariantStepDone = (id, key) => {
    const variant = variants.find(v => v.id === id);
    if (variant) {
      dispatch({ type: 'UPDATE_VARIANT', id, patch: { steps: { ...(variant.steps || {}), [key]: true } } });
    }  };

  const variantRemainingLabels = (v) => {
    const remaining = [];
    if (!(v.steps || {}).build) remaining.push("Build");
    if (!(v.steps || {}).validation) remaining.push("Validation");
    return remaining;
  };

  // ---- Validation and Payload Logic ----
  const parseVars = useCallback(() => {
    try {
      const v = JSON.parse(variablesJSON || "{}");
      return v && typeof v === "object" ? v : {};
    } catch { return null; }
  }, [variablesJSON]);
  const vars = parseVars();

  // This is now a pure function that takes the current state to avoid stale closures.
  const draftToTemplatePayload = (currentState, varsObj) => {
    const { name, description, tags, type, channel, variants, variantDrafts } = currentState;
    const vlist = (variants || []).map((v) => {
      const d = variantDrafts[v.id] || { content: {} };
      const resolve = (s) => resolveVariablesInString(s || "", varsObj || {});
      const content = d.content || {};
      const resolved = {
        subject: resolve(content.subject),
        title: resolve(content.title),
        body: resolve(content.body),
        html: resolve(content.html),
        headerText: resolve(content.headerText),
        headerHtml: resolve(content.headerHtml),
        footerText: resolve(content.footerText),
        footerHtml: resolve(content.footerHtml),
      };
      return { 
        locale: v.locale, 
        name: v.name,
        content: { ...resolved, buttons: content.buttons || [], links: content.links || [], media: content.media || [] }
      };
    });
  
    return {
      name: name.trim(),
      description: description.trim(),
      tags,
      type,
      channel,
      versions: [
        {
          notes: "Initial version from wizard",
          variants: vlist,
        }
      ]
    };
  };

  const isVariantContentValid = (draft) => {
    if (!draft) return false;
    if (channel === "email") return Boolean((draft.content.subject || "").trim()) && Boolean((draft.content.html || draft.content.body || "").trim());
    if (channel === "sms") { const body = (draft.content.body || "").trim(); return body.length > 0 && body.length <= 480; }
    if (channel === "push") return Boolean((draft.content.title || "").trim()) && Boolean((draft.content.body || "").trim());
    return Boolean((draft.content.body || draft.content.html || "").trim());
  };

  const requireVarsSatisfied = (variantId) => {
    if (!variantId || vars === null) return false;
    const d = variantDrafts[variantId] || { content: {} };
    const { content = {} } = d;
    const scanObj = { subject: content.subject || "", title: content.title || "", body: content.body || "", html: content.html || "", headerText: content.headerText || "", headerHtml: content.headerHtml || "", footerText: content.footerText || "", footerHtml: content.footerHtml || "" };
    const { missing } = resolveAndReport(scanObj, vars || {});
    return (missing || []).length === 0;
  };

  const stepValid = () => {
    if (step === 0) return name.trim().length >= 2 && !!channel && !!type;
    if (step === 1) return variants.length >= 1;
    if (step === 2) {
      if (!activeVariantId) return false;
      const d = variantDrafts[activeVariantId];
      return d ? isVariantContentValid(d) && requireVarsSatisfied(activeVariantId) : false;
    }
    return true;
  };

  // ---- Navigation and Submission ----
  const next = () => {
    if (!stepValid()) {
      setSnack({ message: step === 2 && vars === null ? "Provide valid JSON variables and cover all placeholders." : "Please complete this step before continuing.", severity: "warning" });
      return;
    }
    if (activeVariantId && step === 2) markVariantStepDone(activeVariantId, "build");
    dispatch({ type: 'SET_STEP', step: Math.min(step + 1, 3) });
  };

  const back = () => dispatch({ type: 'SET_STEP', step: Math.max(step - 1, 0) });

  const finishVariant = async () => {
    const payload = draftToTemplatePayload(state, vars || {});
    const errors = validateTemplate(payload);
    if (errors.length) {
      setSnack({ message: `Validation has ${errors.length} error(s): ${errors.join(', ')}. Fix before finishing.`, severity: "error" });
      return;
    }

    if (activeVariantId) {
      markVariantStepDone(activeVariantId, "validation");
    }

    const hasIncomplete = variants.some((v) => variantRemainingLabels(v).length > 0);
    if (hasIncomplete) {
      dispatch({ type: 'SET_STEP', step: 1 });
      dispatch({ type: 'SET_FIELD', field: 'activeVariantId', value: null });
      setSnack({ severity: "success", message: "Variant finished. Complete remaining variants." });
    } else {
      try {
        const newTemplate = await api.createTemplate(payload);
        setSnack({ message: "All variants complete. Template saved.", severity: "success" });
        onDone?.(newTemplate.id);
      } catch (error) {
        setSnack({ message: `Error: ${error.message || "Failed to save template."}` , severity: "error"});
      }
    }
  };

  // ---- Derived State for Rendering ----
  const activeDraft = useMemo(() => {
    const emptyContent = { subject: "", title: "", body: "", html: "", headerText: "", headerHtml: "", footerText: "", footerHtml: "", buttons: [], media: [], links: [] };
    if (!activeVariantId) return { content: emptyContent };
    return variantDrafts[activeVariantId] ? { content: { ...emptyContent, ...(variantDrafts[activeVariantId].content || {}) } } : { content: emptyContent };
  }, [activeVariantId, variantDrafts]);

  const previewVariant = useMemo(() => ({
    channel,
    content: {
      subject: resolveVariablesInString(activeDraft.content.subject || "", (vars || {})),
      title: resolveVariablesInString(activeDraft.content.title || "", (vars || {})),
      body: resolveVariablesInString(activeDraft.content.body || "", (vars || {})),
      html: resolveVariablesInString(activeDraft.content.html || "", (vars || {})),
      headerText: resolveVariablesInString(activeDraft.content.headerText || "", (vars || {})),
      headerHtml: resolveVariablesInString(activeDraft.content.headerHtml || "", (vars || {})),
      footerText: resolveVariablesInString(activeDraft.content.footerText || "", (vars || {})),
      footerHtml: resolveVariablesInString(activeDraft.content.footerHtml || "", (vars || {})),
      buttons: activeDraft.content.buttons || [],
      links: activeDraft.content.links || [],
      media: activeDraft.content.media || [],
    },
  }), [channel, activeDraft, vars]);

  const activeVariant = activeVariantId ? variants.find((v) => v.id === activeVariantId) : null;

  return (
    <Stack spacing={2} sx={{ height: "100%", p: 1 }}>
      {/* Header */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" sx={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
            {step === 0 && <TypeIcon size={18} />}
            {step === 1 && <Files size={18} />}
            {step === 2 && <Palette size={18} />}
            {step === 3 && <CheckCircle2 size={18} />}
            Create Template – Step {step + 1} / 4
          </Typography>
          <Box flexGrow={1} />
          <Chip label={channelsById[channel]?.label || channel} size="small" />
          <Chip label={TEMPLATE_TYPES?.[type]?.label || type} size="small" />
          {!!activeVariant && step >= 2 && (
            <Chip size="small" color="primary" label={`Variant: ${activeVariant.name || activeVariant.locale} (${activeVariant.locale})`} />
          )}
        </Stack>
      </Paper>

      {/* Grid area */}
      <Grid container rowGap={5} alignItems="stretch" justifyContent="space-between" sx={{ minHeight: 0, flex: 1, overflow: "auto" }}>
        <Grid item xs={12} md={6.9} lg={6.9} sx={{ minHeight: 0 }}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
            {/* STEP 0: BASICS */}
            {step === 0 && (
              <Stack spacing={2}>
                <Typography variant="subtitle1">Basics</Typography>
                <TextField label="Template Name" value={name} onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })} />
                <TextField label="Description" value={description} onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })} multiline minRows={3} />
                <Grid container spacing={0.5}>
                  <Grid item xs={12} md={6}>
                    <TextField select label="Channel" value={channel} onChange={(e) => {
                      const ch = e.target.value;
                      dispatch({ type: 'SET_FIELD', field: 'channel', value: ch });
                      dispatch({ type: 'SET_FIELD', field: 'requireApproval', value: ["whatsapp"].includes(ch) });
                    }} fullWidth>
                      {CHANNELS.map((c) => (<MenuItem key={c.id} value={c.id}>{c.label}</MenuItem>))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select label="Template Type" value={type} onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'type', value: e.target.value })} fullWidth>
                      {Object.values(TEMPLATE_TYPES).map((tt) => (<MenuItem key={tt.id} value={tt.id}>{tt.label}</MenuItem>))}
                    </TextField>
                  </Grid>
                </Grid>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">Requires external platform pre-approval</Typography>
                  <Chip size="small" color={requireApproval ? "primary" : "default"} label={requireApproval ? "Yes" : "No"} onClick={() => dispatch({ type: 'SET_FIELD', field: 'requireApproval', value: !requireApproval })} sx={{ cursor: "pointer" }} />
                </Stack>
              </Stack>
            )}

            {/* STEP 1: VARIANTS */}
            {step === 1 && (
              <VariantManager variants={variants} addVariantSeed={addVariantSeed} updateVariant={updateVariant} deleteVariant={deleteVariant} buildVariant={(id) => {
                dispatch({ type: 'SET_FIELD', field: 'activeVariantId', value: id });
                dispatch({ type: 'SET_STEP', step: 2 });
              }} />
            )}

            {/* STEP 2: BUILD */}
            {step === 2 && (
              <BuildPane channel={channel} activeVariant={activeVariant} activeVariantId={activeVariantId} variantDrafts={variantDrafts} updateActiveDraft={updateActiveDraft} variablesJSON={variablesJSON} setVariablesJSON={(v) => dispatch({ type: 'SET_FIELD', field: 'variablesJSON', value: v })} vars={vars || {}} markVariantStepDone={markVariantStepDone} setSnack={setSnack} />
            )}

            {/* STEP 3: VALIDATION */}
            {step === 3 && (
              <Stack spacing={1.5}>
                <Typography variant="subtitle1">Validation {activeVariant ? `— ${activeVariant.name} (${activeVariant.locale})` : ""}</Typography>
                <ValidationPanel payload={draftToTemplatePayload(vars || {})} channel={channel} />
                <Typography variant="body2" color="text.secondary">Fix any errors shown above. When it’s green, finish this variant.</Typography>
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Preview column */}
        <Grid item xs={12} md={5} lg={5} sx={{ minHeight: 0 }}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}><Typography variant="subtitle2" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}><Eye size={16} /> Live Preview</Typography></Stack>
            <Box sx={{ flex: 1, minHeight: 0 }}><TemplatePreviewPane variant={previewVariant} initialDevice="mobile" initialOrientation="portrait" height={640} /></Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer actions */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ position: "sticky", bottom: 0, zIndex: 5, backgroundColor: t.palette.background.paper, py: 1, boxShadow: "0 -1px 4px rgba(0,0,0,0.04)" }}>
        <Button startIcon={<ArrowLeft size={16} />} onClick={back} disabled={step === 0}>Back</Button>
        <Box flexGrow={1} />
        {step === 1 ? null : step < 3 ? (
          <Button variant="contained" endIcon={<ArrowRight size={16} />} onClick={next}>Next</Button>
        ) : (
          <Button variant="contained" startIcon={<Save size={16} />} onClick={finishVariant}>Finish Variant</Button>
        )}
      </Stack>

      <Snackbar open={snack.open} onClose={() => dispatch({ type: 'HIDE_SNACK' })} autoHideDuration={3000}>
        <Alert severity={snack.severity} onClose={() => dispatch({ type: 'HIDE_SNACK' })}>{snack.message}</Alert>
      </Snackbar>
    </Stack>
  );
}
