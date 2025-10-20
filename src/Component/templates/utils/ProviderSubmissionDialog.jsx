// Path: src/Component/templates/utils/ProviderSubmissionDialog.jsx
// Purpose: submission-only (Internal | Provider), no Withdraw UI
// Fixes:
// - Uniform small-sized inputs, consistent grid alignment
// - Proper per-variant selection (with Select all)
// - Languages shown in a labeled FormControl (aligned with TextField)
// - Single "Submission Path" toggle at the top; one Submit button with correct label

import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Box, Stack, Typography, Divider, Grid, Paper,
  TextField, MenuItem, Select, Checkbox, FormControlLabel, Chip,
  IconButton, Tooltip, Alert, FormHelperText, FormControl, InputLabel,
  ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import { Send, Eye } from "lucide-react";
import PROVIDERS_BY_CHANNEL from "../constants/PROVIDERS_BY_CHANNEL";

const normalizeChannel = (val) => {
  const s = String(val || "").toLowerCase().trim();
  if (["email", "mail"].includes(s)) return "email";
  if (["sms", "text"].includes(s)) return "sms";
  if (["whatsapp", "wa"].includes(s)) return "whatsapp";
  if (["push", "push-notification", "notification"].includes(s)) return "push";
  if (["platform", "inapp", "in-app", "web"].includes(s)) return "platform";
  return s || "platform";
};
const uniq = (arr) => Array.from(new Set(arr));

export default function ProviderSubmissionDialog({
  open,
  onClose,
  details, // { template, variants }
  onSubmitInternal,
  onSubmitProvider,
  // Kept for back-compat with callers that pass "submit-internal" | "submit-provider"
  initialTab = "submit-internal",
}) {
  const tpl = details?.template || {};
  const variants = details?.variants || [];

  const channel = normalizeChannel(tpl?.channel);
  const providerNames = PROVIDERS_BY_CHANNEL?.[channel] || [];

  const derivedLangs = uniq(
    (variants || [])
      .map((v) => (v.lang || v.language || v.locale || "").toLowerCase())
      .filter(Boolean)
  );
  const languagesFallback = derivedLangs.length ? derivedLangs : ["en"];

  // Path toggle (internal | provider)
  const inferInitialPath = () =>
    initialTab === "submit-provider" && providerNames.length ? "provider" : "internal";
  const [path, setPath] = React.useState(inferInitialPath());
  React.useEffect(() => {
    if (open) setPath(inferInitialPath());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialTab, providerNames.join("|")]);

  // Shared state
  const [note, setNote] = React.useState("");

  // Internal
  const [internalApprover, setInternalApprover] = React.useState("Compliance");

  // Provider
  const [providerName, setProviderName] = React.useState(providerNames[0] || "");
  const [providerConfig, setProviderConfig] = React.useState({
    category: "UTILITY",
    namespace: "",
    languages: languagesFallback,
    senderId: "",
    msgType: "TRANSACTIONAL",
    topic: "",
  });

  // Variants selection
  const [selectedVariantIds, setSelectedVariantIds] = React.useState([]);
  const allChecked = selectedVariantIds.length > 0 && selectedVariantIds.length === variants.length;

  const toggleAll = () =>
    setSelectedVariantIds((prev) => (allChecked ? [] : (variants || []).map((v) => v.id)));
  const toggleVariant = (id) =>
    setSelectedVariantIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // Init on open
  React.useEffect(() => {
    if (!open) return;
    setNote("");
    setInternalApprover("Compliance");
    setProviderName(providerNames[0] || "");
    setSelectedVariantIds((variants || []).map((v) => v.id));
    setProviderConfig((cfg) => ({ ...cfg, languages: languagesFallback }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tpl?.id]);

  // Validation
  const noteOk = note.trim().length >= 3;
  const providerValid = !!providerName || path === "internal";
  const hasVariants = path === "internal" ? true : selectedVariantIds.length > 0;

  const canSubmit =
    path === "internal" ? noteOk && !!internalApprover : noteOk && providerValid && hasVariants;

  // Helpers
  const providerKind = (name) => {
    const n = String(name || "").toLowerCase();
    if (channel === "whatsapp" || /wati|meta/.test(n)) return "whatsapp";
    if (channel === "sms" || /submail|sms\.to|africa/.test(n)) return "sms";
    if (channel === "push" || /fcm/.test(n)) return "push";
    return "generic";
  };

  const submit = () => {
    if (path === "internal") {
      onSubmitInternal?.({
        templateId: tpl.id,
        approver: internalApprover,
        note: note.trim(),
      });
      return;
    }
    onSubmitProvider?.({
      templateId: tpl.id,
      provider: providerName,
      selectedVariantIds,
      providerConfig,
      note: note.trim(),
    });
  };

  // UI building blocks
  const SectionTitle = ({ children }) => (
    <Typography variant="subtitle2" sx={{ mb: 1 }}>
      {children}
    </Typography>
  );

  const InternalSection = (
    <Grid container spacing={1.25}>
      <Grid item xs={12} sm={6}>
        <TextField
          size="small"
          select
          label="Approver / Queue"
          value={internalApprover}
          onChange={(e) => setInternalApprover(e.target.value)}
          fullWidth
        >
          {["Compliance", "CRM", "Security", "Ops"].map((v) => (
            <MenuItem key={v} value={v}>
              {v}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );

  const ProviderSection = (
    <>
      {!providerNames.length && (
        <Alert severity="warning" sx={{ mb: 1 }}>
          No providers configured for channel <strong>{channel}</strong>. Switch to “Internal”
          or configure providers first.
        </Alert>
      )}

      <Grid container spacing={1.25}>
        <Grid item xs={12} sm={6}>
          <TextField
            size="small"
            select
            label="Provider"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
            fullWidth
            disabled={!providerNames.length}
          >
            {providerNames.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Provider-specific fields */}
        {(() => {
          const kind = providerKind(providerName);

          if (kind === "whatsapp") {
            return (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    select
                    label="Category"
                    value={providerConfig.category}
                    onChange={(e) =>
                      setProviderConfig((c) => ({ ...c, category: e.target.value }))
                    }
                    fullWidth
                  >
                    {["UTILITY", "MARKETING", "AUTHENTICATION"].map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    label="Namespace (optional)"
                    value={providerConfig.namespace}
                    onChange={(e) =>
                      setProviderConfig((c) => ({ ...c, namespace: e.target.value }))
                    }
                    fullWidth
                    placeholder="business namespace"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <InputLabel id="psd-languages-label">Languages</InputLabel>
                    <Select
                      labelId="psd-languages-label"
                      label="Languages"
                      multiple
                      value={providerConfig.languages || []}
                      onChange={(e) =>
                        setProviderConfig((c) => ({ ...c, languages: e.target.value }))
                      }
                      renderValue={(vals) =>
                        (vals || []).map((v) => v.toUpperCase()).join(", ")
                      }
                    >
                      {(languagesFallback || []).map((lg) => (
                        <MenuItem key={lg} value={lg}>
                          <Checkbox
                            checked={(providerConfig.languages || []).includes(lg)}
                          />
                          {lg.toUpperCase()}
                        </MenuItem>
                      ))}
                    </Select>
                    {!languagesFallback.length && (
                      <FormHelperText>No language metadata found.</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </>
            );
          }

          if (kind === "sms") {
            return (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    label="Sender ID"
                    value={providerConfig.senderId}
                    onChange={(e) =>
                      setProviderConfig((c) => ({ ...c, senderId: e.target.value }))
                    }
                    fullWidth
                    placeholder="e.g. ACME"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    select
                    label="Message Type"
                    value={providerConfig.msgType}
                    onChange={(e) =>
                      setProviderConfig((c) => ({ ...c, msgType: e.target.value }))
                    }
                    fullWidth
                  >
                    {["TRANSACTIONAL", "PROMOTIONAL"].map((v) => (
                      <MenuItem key={v} value={v}>
                        {v}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </>
            );
          }

          if (kind === "push") {
            return (
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  label="Topic (optional)"
                  value={providerConfig.topic}
                  onChange={(e) =>
                    setProviderConfig((c) => ({ ...c, topic: e.target.value }))
                  }
                  fullWidth
                  placeholder="/topics/news"
                />
              </Grid>
            );
          }

          return null;
        })()}

        {/* Variants */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 0.5 }}
            >
              <SectionTitle>Variants</SectionTitle>
              <FormControlLabel
                control={<Checkbox checked={allChecked} onChange={toggleAll} />}
                label="Select all"
              />
            </Stack>

            <Grid container spacing={0.75}>
              {variants.map((v) => {
                const id = v.id;
                const lang = (v.lang || v.locale || "").toUpperCase();
                const checked = selectedVariantIds.includes(id);
                return (
                  <Grid item xs={12} key={id}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 0.75,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        borderColor: checked ? "primary.main" : undefined,
                      }}
                    >
                      <FormControlLabel
                        sx={{ m: 0 }}
                        control={
                          <Checkbox
                            checked={checked}
                            onChange={() => toggleVariant(id)}
                          />
                        }
                        label={
                          <Stack spacing={0.25}>
                            <Typography variant="body2" noWrap title={v.name || v.id}>
                              {v.name || v.id}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                              sx={{ flexWrap: "wrap" }}
                            >
                              <Chip size="small" variant="outlined" label={lang || "—"} />
                            </Stack>
                          </Stack>
                        }
                      />
                      <Tooltip title="View">
                        <IconButton size="small">
                          <Eye size={16} />
                        </IconButton>
                      </Tooltip>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {path === "provider" && selectedVariantIds.length === 0 && (
              <FormHelperText error sx={{ mt: 1 }}>
                Select at least one variant to submit to the provider.
              </FormHelperText>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ pb: 0.5 }}>
        {tpl.name || "Template"} — Submit
        <Typography variant="body2" color="text.secondary">
          {(tpl.channel || "—")} • {(tpl.type || "—")} • {(tpl.status || tpl.state || "Draft")}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 1.25 }}>
        {/* Submission Path */}
        <Box sx={{ mb: 1 }}>
          <SectionTitle>Submission Path</SectionTitle>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={path}
            onChange={(_, v) => v && setPath(v)}
          >
            <ToggleButton value="internal">Internal</ToggleButton>
            <ToggleButton value="provider" disabled={!providerNames.length}>
              Provider
            </ToggleButton>
          </ToggleButtonGroup>
          {!providerNames.length && path === "provider" && (
            <FormHelperText error sx={{ mt: 0.5 }}>
              No provider available for this channel.
            </FormHelperText>
          )}
        </Box>

        <Divider sx={{ my: 1.25 }} />

        {/* Path-specific UI (uniform grid & sizes) */}
        {path === "internal" ? InternalSection : ProviderSection}

        {/* Shared Note */}
        <TextField
          size="small"
          sx={{ mt: 1.25 }}
          label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          multiline
          minRows={4}
          fullWidth
          helperText={
            path === "provider"
              ? "Add context for provider reviewers."
              : "Explain the change for internal review."
          }
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          startIcon={<Send size={16} />}
          disabled={!canSubmit}
          onClick={submit}
        >
          {path === "provider" ? "Submit to Provider" : "Submit (Internal)"}
        </Button>
        <Button variant="outlined" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
