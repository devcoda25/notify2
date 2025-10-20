// Path: src/Component/templates/views/CreateTemplateWizardView.jsx
import React from "react";
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

import useTemplatesStore from "../../store/templates/useTemplatesStore";

import { resolveVariablesInString, resolveAndReport } from "../core/variableResolver";
import { validateTemplate } from "../core/validators";

import TemplatePreviewPane from "../utils/TemplatePreviewPane";
import ValidationPanel from "../utils/ValidationPanel";

// **Parts (Variant table/dialog + Build pane) will be provided in TemplateParts.jsx**
import { VariantManager, BuildPane } from "./TemplateParts";

function newVariantId() {
  return "v_" + Math.random().toString(36).slice(2, 8);
}

export default function CreateTemplateWizardView({ defaultChannel = "email", onDone }) {
  const t = useTheme();

  // stores
  const createTemplate = useTemplatesStore((s) => s.createTemplate);

  // wizard state (4 steps: 0..3)
  const [step, setStep] = React.useState(0);

  // Step 0 — Basics
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [channel, setChannel] = React.useState(defaultChannel);
  const [type, setType] = React.useState(Object.values(TEMPLATE_TYPES)[0]?.id || "utility");
  const [requireApproval, setRequireApproval] = React.useState(["whatsapp"].includes(defaultChannel));

  // Template-level tags (kept for payload compatibility)
  const [tags] = React.useState([]);

  // Step 1 — Variants manager state
  const [variants, setVariants] = React.useState([]);
  const [activeVariantId, setActiveVariantId] = React.useState(null);

  // Variant dialog state (moved into TemplateParts but kept initial state here for completeness if needed)
  // (VariantManager will use setters passed down)

  // Per-variant build draft (content only; includes header/footer)
  const [variantDrafts, setVariantDrafts] = React.useState({});

  // Variables JSON (global)
  const [variablesJSON, setVariablesJSON] = React.useState(
    '{\n  "user_name": "Ada Lovelace",\n  "current_short_date": "2025-09-10"\n}'
  );

  const [snack, setSnack] = React.useState({ open: false, message: "", severity: "info" });

  const channelsById = React.useMemo(() => Object.fromEntries(CHANNELS.map((c) => [c.id, c])), []);

  // ---- Variant helpers (parent owns data; TemplateParts will call these) ----
  const addVariantSeed = (v) => {
    const id = newVariantId();
    const variant = {
      id,
      name: v.name || "Untitled",
      description: v.description || "",
      tags: v.tags || [],
      locale: v.locale || "en",
      steps: v.steps || {},
    };
    setVariants((prev) => [...prev, variant]);
    setVariantDrafts((prev) => ({
      ...prev,
      [id]: {
        content: {
          subject: "",
          title: "",
          body: "",
          html: "",
          headerText: "",
          headerHtml: "",
          footerText: "",
          footerHtml: "",
          buttons: [],
          links: [],
          media: [],
        },
      },
    }));
    return id;
  };

  const updateVariant = (id, patch) => {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  };

  const deleteVariant = (id) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
    setVariantDrafts((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
    if (activeVariantId === id) setActiveVariantId(null);
  };

  const markVariantStepDone = (id, key /* "build" | "validation" */) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, steps: { ...(v.steps || {}), [key]: true } } : v))
    );
  };

  const variantRemainingLabels = (v) => {
    const remaining = [];
    if (!(v.steps || {}).build) remaining.push("Build");
    if (!(v.steps || {}).validation) remaining.push("Validation");
    return remaining;
  };

  // ---- Validation + Payload build (kept in parent) ----
  const normalizeForValidation = (payload) => {
    const out = { ...payload };
    out.variants = Array.isArray(out.variants) ? out.variants : out.variants ? Object.values(out.variants) : [];
    return out;
  };
  const validateTemplateSafe = (payload, opts) => {
    try {
      const normalized = normalizeForValidation(payload);
      const res = validateTemplate(normalized, opts);
      return Array.isArray(res) ? res : [];
    } catch (err) {
      return [{ message: err?.message || "Validation error" }];
    }
  };

  const parseVars = React.useCallback(() => {
    try {
      const v = JSON.parse(variablesJSON || "{}");
      return v && typeof v === "object" ? v : {};
    } catch {
      return null; // parse error
    }
  }, [variablesJSON]);
  const vars = parseVars();

  const draftToTemplatePayload = (varsObj) => {
    const vlist = variants.map((v) => {
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
        id: v.id,
        name: v.name,
        description: v.description,
        tags: v.tags || [],
        locale: v.locale,
        channel,
        content: {
          ...resolved,
          buttons: content.buttons || [],
          links: content.links || [],
          media: content.media || [],
        },
        steps: v.steps || {},
      };
    });

    return {
      name: name.trim(),
      description: description.trim(),
      tags,
      type,
      channel,
      approvalRequired: requireApproval,
      state: requireApproval ? APPROVAL_STATES.DRAFT : APPROVAL_STATES.APPROVED,
      variants: vlist,
      meta: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "you",
      },
    };
  };

  // Step-specific validation helpers (kept here)
  const isVariantContentValid = (draft) => {
    if (!draft) return false;
    if (channel === "email") {
      return Boolean((draft.content.subject || "").trim()) && Boolean((draft.content.html || draft.content.body || "").trim());
    }
    if (channel === "sms") {
      const body = (draft.content.body || "").trim();
      return body.length > 0 && body.length <= 480;
    }
    if (channel === "push") {
      return Boolean((draft.content.title || "").trim()) && Boolean((draft.content.body || "").trim());
    }
    return Boolean((draft.content.body || draft.content.html || "").trim());
  };

  const requireVarsSatisfied = (variantId) => {
    if (!variantId) return false;
    if (vars === null) return false; // parse error
    const d = variantDrafts[variantId] || { content: {} };
    const { content = {} } = d;
    const scanObj = {
      subject: content.subject || "",
      title: content.title || "",
      body: content.body || "",
      html: content.html || "",
      headerText: content.headerText || "",
      headerHtml: content.headerHtml || "",
      footerText: content.footerText || "",
      footerHtml: content.footerHtml || "",
    };
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
    if (step === 3) return true;
    return true;
  };

  const next = () => {
    if (!stepValid()) {
      setSnack({
        open: true,
        message:
          step === 2 && vars === null
            ? "Provide valid JSON variables (and cover all placeholders) before continuing."
            : "Please complete this step before continuing.",
        severity: "warning",
      });
      return;
    }

    if (activeVariantId && step === 2) {
      markVariantStepDone(activeVariantId, "build");
    }

    setStep((s) => Math.min(s + 1, 3));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const finishVariant = () => {
    const payload = draftToTemplatePayload(vars || {});
    const errors = validateTemplateSafe(payload, { channel });
    if (errors.length) {
      setSnack({
        open: true,
        message: `Validation has ${errors.length} error(s). Fix before finishing.`,
        severity: "error",
      });
      return;
    }
    if (activeVariantId) {
      markVariantStepDone(activeVariantId, "validation");
    }

    const hasIncomplete = variants.some((v) => variantRemainingLabels(v).length > 0);
    if (hasIncomplete) {
      setStep(1);
      setActiveVariantId(null);
      setSnack({ open: true, severity: "success", message: "Variant finished. Complete remaining variants." });
    } else {
      const id = createTemplate(draftToTemplatePayload(vars || {}));
      setSnack({ open: true, message: "All variants complete. Template saved.", severity: "success" });
      onDone?.(id);
    }
  };

  // Active draft helpers
  const emptyContent = React.useMemo(
    () => ({
      subject: "",
      title: "",
      body: "",
      html: "",
      headerText: "",
      headerHtml: "",
      footerText: "",
      footerHtml: "",
      buttons: [],
      media: [],
      links: [],
    }),
    []
  );

  const activeDraft = React.useMemo(() => {
    if (!activeVariantId) return { content: { ...emptyContent } };
    return variantDrafts[activeVariantId]
      ? { content: { ...emptyContent, ...(variantDrafts[activeVariantId].content || {}) } }
      : { content: { ...emptyContent } };
  }, [activeVariantId, variantDrafts, emptyContent]);

  const updateActiveDraft = (patch) => {
    if (!activeVariantId) return;
    setVariantDrafts((prev) => ({
      ...prev,
      [activeVariantId]: {
        content: patch.content ? { ...(prev[activeVariantId]?.content || {}), ...patch.content } : prev[activeVariantId]?.content || {},
      },
    }));
  };

  // Live preview data
  const previewVariant = React.useMemo(
    () => ({
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
    }),
    [channel, activeDraft, vars]
  );

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
            <Chip
              size="small"
              color="primary"
              label={`Variant: ${activeVariant.name || activeVariant.locale} (${activeVariant.locale})`}
            />
          )}
        </Stack>
      </Paper>

      {/* Grid area */}
      <Grid
        container
        rowGap={5}
        alignItems="stretch"
        justifyContent="space-between"
        sx={{ minHeight: 0, flex: 1, overflow: "auto" }}
      >
        <Grid item xs={12} md={6.9} lg={6.9} sx={{ minHeight: 0 }}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
            {/* STEP 0: BASICS */}
            {step === 0 && (
              <Stack spacing={2}>
                <Typography variant="subtitle1">Basics</Typography>

                <TextField label="Template Name" value={name} onChange={(e) => setName(e.target.value)} />

                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  minRows={3}
                />

                <Grid container spacing={0.5}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Channel"
                      value={channel}
                      onChange={(e) => {
                        const ch = e.target.value;
                        setChannel(ch);
                        setRequireApproval(["whatsapp"].includes(ch));
                      }}
                      fullWidth
                    >
                      {CHANNELS.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField select label="Template Type" value={type} onChange={(e) => setType(e.target.value)} fullWidth>
                      {Object.values(TEMPLATE_TYPES).map((tt) => (
                        <MenuItem key={tt.id} value={tt.id}>
                          {tt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">Requires external platform pre-approval</Typography>
                  <Chip
                    size="small"
                    color={requireApproval ? "primary" : "default"}
                    label={requireApproval ? "Yes" : "No"}
                    onClick={() => setRequireApproval((v) => !v)}
                    sx={{ cursor: "pointer" }}
                  />
                </Stack>
              </Stack>
            )}

            {/* STEP 1: VARIANTS (delegated to VariantManager) */}
            {step === 1 && (
              <VariantManager
                variants={variants}
                setVariants={setVariants}
                addVariantSeed={addVariantSeed}
                updateVariant={updateVariant}
                deleteVariant={deleteVariant}
                buildVariant={(id) => {
                  setActiveVariantId(id);
                  setStep(2);
                }}
                activeVariantId={activeVariantId}
                setActiveVariantId={setActiveVariantId}
                setVariantDrafts={setVariantDrafts}
                setSnack={setSnack}
              />
            )}

            {/* STEP 2: BUILD (delegated to BuildPane) */}
            {step === 2 && (
              <BuildPane
                channel={channel}
                activeVariant={activeVariant}
                activeVariantId={activeVariantId}
                variantDrafts={variantDrafts}
                updateActiveDraft={updateActiveDraft}
                variablesJSON={variablesJSON}
                setVariablesJSON={setVariablesJSON}
                vars={vars || {}}
                markVariantStepDone={markVariantStepDone}
                setSnack={setSnack}
              />
            )}

            {/* STEP 3: VALIDATION (still in parent but BuildPane may show validation too) */}
            {step === 3 && (
              <Stack spacing={1.5}>
                <Typography variant="subtitle1">
                  Validation {activeVariant ? `— ${activeVariant.name} (${activeVariant.locale})` : ""}
                </Typography>
                <ValidationPanel payload={draftToTemplatePayload(vars || {})} channel={channel} />
                <Typography variant="body2" color="text.secondary">
                  Fix any errors shown above. When it’s green, finish this variant.
                </Typography>
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Preview column */}
        <Grid item xs={12} md={5} lg={5} sx={{ minHeight: 0 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                <Eye size={16} /> Live Preview
              </Typography>
            </Stack>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <TemplatePreviewPane variant={previewVariant} initialDevice="mobile" initialOrientation="portrait" height={640} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer actions */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 5,
          backgroundColor: t.palette.background.paper,
          py: 1,
          boxShadow: "0 -1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <Button startIcon={<ArrowLeft size={16} />} onClick={back} disabled={step === 0}>
          Back
        </Button>
        <Box flexGrow={1} />

        {step === 1 ? null : step < 3 ? (
          <Button variant="contained" endIcon={<ArrowRight size={16} />} onClick={next}>
            Next
          </Button>
        ) : (
          <Button variant="contained" startIcon={<Save size={16} />} onClick={finishVariant}>
            Finish Variant
          </Button>
        )}
      </Stack>

      <Snackbar open={snack.open} onClose={() => setSnack((s) => ({ ...s, open: false }))} autoHideDuration={3000}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
