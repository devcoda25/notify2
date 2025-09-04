// /src/Component/crm/InteractionForm.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Box, Stack, Typography, Alert, Grid, Paper,
  FormControl, InputLabel, Select, MenuItem,
  Button, Avatar, Chip
} from "@mui/material";
import CRMFormPane from "./CRMFormPane";

/* --- local reason matrix (no prop needed) --- */
const REASON_MATRIX = {
  "Support & Service": {
    "Technical Support": ["Device Not Working", "Call Quality Issue", "Setup Assistance"],
    "Billing & Payments": ["Payment Failed", "Refund Request", "Invoice Copy"],
    "Account Updates": ["Profile Change", "Contact Change", "Password Reset"],
    "Appointment / Scheduling": ["Book Visit", "Reschedule", "Cancel Appointment"]
  },
  "Sales & Promotions": {
    "Onboarding / Activation": ["New Customer Setup", "Re-activation"],
    "Upsell / Cross-sell": ["Upgrade Plan", "Add-on Offer"],
    "Promotions / Campaign Response": ["Promo Inquiry", "Coupon Issue"],
    "Product Demo / Education": ["Feature Walkthrough", "Training Call"]
  },
  "Customer Care & Retention": {
    "Wellness Call": ["Regular Check-in", "Satisfaction Check"],
    "Churn Risk / Retention": ["Win-back Attempt", "Cancel Save"],
    "Loyalty Program": ["Points Inquiry", "Tier Upgrade"]
  },
  "Compliance & Verification": {
    "KYC / Document Verification": ["ID Check", "Proof of Address"],
    "Regulatory Audit": ["Data Confirmation", "Policy Acknowledgment"],
    "Authentication / Security": ["2FA Help", "Suspicious Activity Check"]
  },
  "Feedback & Insights": {
    "Service Feedback": ["NPS Survey", "CSAT Survey"],
    "Product Survey": ["Feature Feedback", "Usability Feedback"],
    "Complaint / Grievance": ["Poor Service", "Rude Agent", "Delay Complaint"]
  },
  "Escalations": {
    "Tier 2 / Specialist": ["Technical Escalation", "Billing Escalation"],
    "Supervisor Intervention": ["Urgent Resolution", "Policy Exception"]
  }
};

const ALLOWED_CATEGORY = "Escalations";
const ALLOWED_SUBCATEGORY = "Supervisor Intervention";
const ALLOWED_REASON = "Urgent Resolution";

/* --- contact card (left-only) --- */
function ContactCard({ contact = {}, priorCount = 0 }) {
  const {
    name = "Unknown",
    photoUrl = "",
    dialedNumber = "—",
    language = "—",
    accountId,
    tags = []
  } = contact || {};

  return (
    <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar src={photoUrl} alt={name} sx={{ width: 44, height: 44 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap>{name}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {dialedNumber} • Lang: {language}{accountId ? ` • ID: ${accountId}` : ""}
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
          {(tags || []).slice(0, 3).map((t) => (<Chip key={t} size="small" label={t} />))}
          <Chip size="small" color="primary" variant="outlined" label={`Logged: ${priorCount}`} />
        </Stack>
      </Stack>
    </Paper>
  );
}

/* --- main form --- */
export default function InteractionForm({
  fetchAdminForm,
  onCancel,
  onSubmit,
  initial,        // kept for edit payload if you need it, but no preselects are applied
  contact,
  priorCount = 0
}) {
  // NOTE: No pre-selections. User must choose everything manually.
  const categories = useMemo(() => Object.keys(REASON_MATRIX || {}), []);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [reason, setReason] = useState("");

  const subCategories = useMemo(
    () => (category ? Object.keys(REASON_MATRIX?.[category] || {}) : []),
    [category]
  );
  const reasons = useMemo(
    () => (category && subCategory ? (REASON_MATRIX?.[category]?.[subCategory] || []) : []),
    [category, subCategory]
  );

  // Right-pane schema/values (loaded only after user selects all 3)
  const [formSchema, setFormSchema]   = useState(null);
  const [formValues, setFormValues]   = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError]             = useState("");
  const [formCompleted, setFormCompleted] = useState(false); // hide left buttons when completed

  const pathMatchesAllowed =
    category === ALLOWED_CATEGORY &&
    subCategory === ALLOWED_SUBCATEGORY &&
    reason === ALLOWED_REASON;

  useEffect(() => {
    setFormSchema(null);
    setError("");
    setFormCompleted(false);
    if (!category || !subCategory || !reason) return;

    // Only the allowed path should show a CRM form (via fetch or XLSX upload in the pane)
    if (!pathMatchesAllowed) {
      setLoadingForm(false);
      setFormSchema(null);
      return;
    }

    if (!fetchAdminForm) return;
    const path = { category, subCategory, reason };
    setLoadingForm(true);
    Promise.resolve(fetchAdminForm(path))
      .then((schema) => setFormSchema(schema || null))
      .catch((e) => setError(e?.message || "Failed to load form"))
      .finally(() => setLoadingForm(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, subCategory, reason, pathMatchesAllowed]);

  const handleChangeField = (name, value) => {
    setFormValues((s) => ({ ...s, [name]: value }));
  };

  const doSubmitInteraction = () => {
    if (!category || !subCategory || !reason) {
      setError("Please select Category, Sub-category, and Reason.");
      return;
    }
    onSubmit?.({ id: initial?.id, category, subCategory, reason, formValues, formSchema });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doSubmitInteraction();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Grid container spacing={0} sx={{ flex: 1, minHeight: 0, alignItems: "stretch" }}>
        {/* LEFT: contact card + path selectors + actions at bottom (always visible) */}
        <Grid item xs={12} md={5} sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <Box sx={{ p: 1.25, display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
            <Box sx={{ flexShrink: 0, mb: 1 }}>
              <ContactCard contact={contact} priorCount={priorCount} />
            </Box>

            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {initial ? "Edit Interaction" : "Log Interaction"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Select the reason path. Only <strong>Escalations → Supervisor Intervention → Urgent Resolution</strong> has a CRM form for now.
              </Typography>

              {!!error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

              <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: 520, lg: 560 } }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        label="Category"
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setSubCategory(""); setReason(""); }}
                      >
                        {categories.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small" disabled={!category}>
                      <InputLabel>Sub-category</InputLabel>
                      <Select
                        label="Sub-category"
                        value={subCategory}
                        onChange={(e) => { setSubCategory(e.target.value); setReason(""); }}
                      >
                        {subCategories.map((sc) => (<MenuItem key={sc} value={sc}>{sc}</MenuItem>))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small" disabled={!subCategory}>
                      <InputLabel>Reason</InputLabel>
                      <Select
                        label="Reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      >
                        {reasons.map((r) => (<MenuItem key={r} value={r}>{r}</MenuItem>))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Hide these when the right pane signals completion */}
            {!formCompleted && (
              <Box sx={{ pt: 1, display: "flex", gap: 1, flexShrink: 0 }}>
                <Button variant="contained" type="submit" size="small">
                  {initial ? "Save Changes" : "Submit Interaction"}
                </Button>
                <Button variant="text" color="inherit" size="small" onClick={onCancel}>
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </Grid>

        {/* RIGHT: CRM form depends on selections */}
        <Grid item xs={12} md={7} sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <CRMFormPane
            paneHeight="450px"
            loading={loadingForm}
            schema={formSchema}                 // null for all paths except the allowed one
            values={formValues}
            onChange={handleChangeField}
            onSave={() => { /* per-page save hook if needed */ }}
            onSaveFinal={() => { doSubmitInteraction(); }}
            onCancelForm={() => onCancel?.()}
            onCompletionChange={(done) => setFormCompleted(!!done)}
            notFoundMessage="No CRM form available for selected parameters."
            canUpload={pathMatchesAllowed}       // ← Upload button only if the selected path is the allowed one
          />
        </Grid>
      </Grid>
    </Box>
  );
}
