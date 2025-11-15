import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, TextField, IconButton, Typography, Grid, Chip,
  FormGroup, FormControlLabel, Checkbox, MenuItem, Divider, InputAdornment,
  Autocomplete, Box, Menu, ListItemIcon, ListItemText, Paper, Tooltip
} from "@mui/material";
import {
  Check, Save, X, Phone as PhoneIcon, Mail, Languages as LanguagesIcon, ChevronDown, Plus
} from "lucide-react";
import { FIELD_META } from "../utils/schema";
import { validateContact, isValid } from "../utils/validation";
import { parsePhoneNumberFromString } from "libphonenumber-js";

/* ------------------------------- constants ------------------------------- */

const COUNTRY_OPTIONS = [
  { iso: "UG", dial: "+256", label: "Uganda" },
  { iso: "KE", dial: "+254", label: "Kenya" },
  { iso: "TZ", dial: "+255", label: "Tanzania" },
  { iso: "RW", dial: "+250", label: "Rwanda" },
  { iso: "BI", dial: "+257", label: "Burundi" },
  { iso: "CD", dial: "+243", label: "DR Congo" },
  { iso: "US", dial: "+1",   label: "United States" },
  { iso: "GB", dial: "+44",  label: "United Kingdom" },
  { iso: "IN", dial: "+91",  label: "India" },
];

const CHANNELS = [
  { id: "email", label: "Email" },
  { id: "sms", label: "SMS" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "calls", label: "Calls" },
  { id: "telegram", label: "Telegram" },
  { id: "messenger", label: "Facebook Messenger" },
  { id: "viber", label: "Viber" },
  { id: "wechat", label: "WeChat" },
  { id: "signal", label: "Signal" },
  { id: "instagram", label: "Instagram DM" },
  { id: "xdm", label: "X/Twitter DM" },
];

const LANG_OPTIONS = [
  "English", "Luganda", "Swahili", "Kinyarwanda", "French", "Arabic",
  "Kirundi", "Luo", "Acholi", "Runyankole", "Ateso", "Lumasaba",
  "Hindi", "Bengali", "Mandarin", "Cantonese", "Portuguese", "Spanish",
  "German", "Italian", "Russian"
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ------------------------------- helpers ------------------------------- */

function isoToFlag(iso = "") {
  try {
    return iso
      .toUpperCase()
      .replace(/./g, ch => String.fromCodePoint(127397 + ch.charCodeAt()));
  } catch { return "🏳️"; }
}
const channelLabel = (id) => CHANNELS.find(c => c.id === id)?.label || id;

/* ---------------------- Single input: phone with country --------------------- */

function PhoneSingleInput({
  countryIso,
  nationalPhone,
  setCountryIso,
  setNationalPhone,
  setE164,
  error,
  helperText,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const current = COUNTRY_OPTIONS.find(c => c.iso === countryIso) || COUNTRY_OPTIONS[0];

  const onOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const onCloseMenu = () => setAnchorEl(null);

  const onSelectCountry = (iso) => {
    setCountryIso(iso);
    onCloseMenu();
    if (nationalPhone) {
      try {
        const p = parsePhoneNumberFromString(nationalPhone, iso);
        if (p && p.isValid()) setE164(p.format("E.164"));
      } catch {}
    }
  };

  const onBlurNormalize = () => {
    if (!nationalPhone) return;
    try {
      const p = parsePhoneNumberFromString(nationalPhone, countryIso);
      if (p && p.isValid()) setE164(p.format("E.164"));
      else setE164("");
    } catch { setE164(""); }
  };

  return (
    <>
      <TextField
        size="small"
        fullWidth
        label="Phone"
        placeholder="700000000"
        value={nationalPhone}
        onChange={(e) => setNationalPhone(e.target.value)}
        onBlur={onBlurNormalize}
        error={!!error}
        helperText={helperText}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pl: 0.5 }}>
              <Button
                onClick={onOpenMenu}
                variant="text"
                size="small"
                sx={{
                  minWidth: "unset",
                  px: 0.75,
                  gap: 0.5,
                  borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 0,
                  height: 30,
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{isoToFlag(current.iso)}</span>
                <Typography variant="body2" sx={{ ml: 0.5 }}>{current.dial}</Typography>
                <ChevronDown size={16} />
              </Button>
              <PhoneIcon size={16} style={{ marginLeft: 8 }} />
            </InputAdornment>
          ),
        }}
      />

      <Menu anchorEl={anchorEl} open={open} onClose={onCloseMenu} keepMounted>
        {COUNTRY_OPTIONS.map(c => (
          <MenuItem key={c.iso} onClick={() => onSelectCountry(c.iso)}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <span style={{ fontSize: 18 }}>{isoToFlag(c.iso)}</span>
            </ListItemIcon>
            <ListItemText
              primary={`${c.label}`}
              secondary={`${c.dial}  •  ${c.iso}`}
              primaryTypographyProps={{ variant: "body2" }}
              secondaryTypographyProps={{ variant: "caption" }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

/* ----------------------------------- main ----------------------------------- */

export default function AddContactModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(seed());
  const [errors, setErrors] = useState({});

  // attributes
  const [attrKey, setAttrKey] = useState("");
  const [attrVal, setAttrVal] = useState("");
  const [attrError, setAttrError] = useState("");

  // devices/services add boxes
  const [devInput, setDevInput] = useState("");
  const [svcInput, setSvcInput] = useState("");

  useEffect(() => {
    if (open) {
      setForm(seed());
      setErrors({});
      setAttrKey(""); setAttrVal(""); setAttrError("");
      setDevInput(""); setSvcInput("");
    }
  }, [open]);

  const onField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Live validation
  const emailLiveError = useMemo(() => form.email && !EMAIL_RE.test(form.email), [form.email]);

  // phone
  const parsedPhone = useMemo(() => {
    if (!form.nationalPhone) return null;
    try {
      const p = parsePhoneNumberFromString(form.nationalPhone, form.countryIso);
      return p && p.isValid() ? p : null;
    } catch { return null; }
  }, [form.nationalPhone, form.countryIso]);

  const phoneLiveError = !!form.nationalPhone && !parsedPhone;
  const e164Preview = parsedPhone ? parsedPhone.format("E.164") : "";

  /* ---------- Preferred ↔ Opt-in behavior: render chips only for Preferred ---------- */
  const onPreferredChange = (ids) => {
    const allowed = new Set(ids);
    const newOptIn = { ...(form.optIn || {}) };
    Object.keys(newOptIn).forEach(k => { if (!allowed.has(k)) newOptIn[k] = false; });
    onField("preferredChannels", ids);
    onField("optIn", newOptIn);
  };
  const removePreferred = (id) => {
    const next = form.preferredChannels.filter(x => x !== id);
    onPreferredChange(next); // also clears its opt-in
  };
  const toggleOptIn = (id, checked) => {
    if (!form.preferredChannels.includes(id)) return;
    onField("optIn", { ...(form.optIn || {}), [id]: checked });
  };

  /* ------------------------- Devices / Services handlers ------------------------- */
  const addDevice = () => {
    const v = devInput.trim();
    if (!v) return;
    if (form.devices.includes(v)) { setDevInput(""); return; }
    onField("devices", [...form.devices, v]);
    setDevInput("");
    if (!form.deviceMostUsed) onField("deviceMostUsed", v);
  };
  const removeDevice = (v) => {
    const filtered = form.devices.filter(x => x !== v);
    onField("devices", filtered);
    if (form.deviceMostUsed === v) onField("deviceMostUsed", filtered[0] || "");
  };
  const pickMostDevice = (v) => onField("deviceMostUsed", v);

  const addService = () => {
    const v = svcInput.trim();
    if (!v) return;
    if (form.services.includes(v)) { setSvcInput(""); return; }
    onField("services", [...form.services, v]);
    setSvcInput("");
    if (!form.serviceMostUsed) onField("serviceMostUsed", v);
  };
  const removeService = (v) => {
    const filtered = form.services.filter(x => x !== v);
    onField("services", filtered);
    if (form.serviceMostUsed === v) onField("serviceMostUsed", filtered[0] || "");
  };
  const pickMostService = (v) => onField("serviceMostUsed", v);

  /* -------------------------------- Save -------------------------------- */
  const handleSave = () => {
    // normalize phone to E.164 before validation
    if (form.nationalPhone) {
      try {
        const p = parsePhoneNumberFromString(form.nationalPhone, form.countryIso);
        onField("phone", p && p.isValid() ? p.format("E.164") : "");
      } catch { onField("phone", ""); }
    }

    const errs = validateContact(form);
    setErrors(errs);
    if (!isValid(errs)) return;

    const contactInfos = [];
    if (form.email || form.phone) {
      contactInfos.push({
        email: form.email,
        phoneNumber: form.phone,
        countryIso: form.countryIso,
        nationalPhone: form.nationalPhone,
        label: 'Primary',
      });
    }

    const preferences = form.preferredChannels.map(channel => ({
      preferenceChannel: channel,
      languages: form.languages,
    }));

    const payload = {
      fullName: form.name,
      title: form.title,
      attribute: form.attributes,
      devices: form.devices.map(d => ({ deviceType: d })),
      services: form.services.map(s => ({ serviceType: s, isMostUsed: s === form.serviceMostUsed })),
      contactInfos,
      preferences,
      meta: {
        deviceMostUsed: form.deviceMostUsed,
        serviceMostUsed: form.serviceMostUsed,
      },
    };

    onSubmit?.(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>New contact</DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Add a contact to your Contacts (DB). Only valid fields will be saved.
        </Typography>

        {/* Identity */}
        <Stack spacing={1.25} sx={{ mb: 1.5 }}>
          {/* Title (25%) + Full name (75%) */}
          <Grid container spacing={1}>
            <Grid item xs={12} md={3}>
              <TextField
                size="small"
                label={FIELD_META?.title?.label || "Title"}
                value={form.title}
                onChange={(e) => onField("title", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <TextField
                size="small"
                label={FIELD_META?.name?.label || "Full name"}
                value={form.name}
                onChange={(e) => onField("name", e.target.value)}
                error={!!errors.name}
                helperText={errors.name || ""}
                fullWidth
              />
            </Grid>
          </Grid>

          {/* Email + (single) Phone side-by-side */}
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                label={FIELD_META?.email?.label || "Email"}
                value={form.email}
                onChange={(e) => onField("email", e.target.value)}
                error={!!errors.email || emailLiveError}
                helperText={errors.email || (form.email && emailLiveError ? "Invalid email" : "")}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={16} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <PhoneSingleInput
                countryIso={form.countryIso}
                nationalPhone={form.nationalPhone}
                setCountryIso={(iso) => onField("countryIso", iso)}
                setNationalPhone={(v) => onField("nationalPhone", v)}
                setE164={(v) => onField("phone", v)}
                error={!!errors.phone || phoneLiveError}
                helperText={
                  errors.phone
                    ? errors.phone
                    : form.nationalPhone
                      ? (phoneLiveError ? `Enter a valid number for ${form.countryIso}` : `Will save as ${e164Preview}`)
                      : "Enter number without country code; we'll save with country code"
                }
              />
            </Grid>
          </Grid>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        {/* Contact & Preferences */}
        <Typography variant="overline" sx={{ letterSpacing: 0.4 }}>Contact & Preferences</Typography>
        <Grid container spacing={1} sx={{ mt: 0.5 }}>
          {/* Preferred (multi-select) — no chips rendered inside the field */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={CHANNELS.map(c => c.id)}
              value={form.preferredChannels}
              onChange={(_, val) => onPreferredChange(val)}
              getOptionLabel={(id) => channelLabel(id)}
              renderTags={() => null}    // ← do NOT render chips inside the input
              renderInput={(params) => (
                <TextField {...params} size="small" label="Preferred channels" placeholder="Select…" />
              )}
            />
          </Grid>

          {/* Languages */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={LANG_OPTIONS}
              value={form.languages}
              onChange={(_, val) => onField("languages", val)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Languages"
                  placeholder="Select languages"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <LanguagesIcon size={16} />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          

          {/* Opt-in chips generated from Preferred */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 1 }}>
              <Typography variant="caption" color="text.secondary">Opt-in permissions</Typography>
              <Stack direction="row" flexWrap="wrap" useFlexGap gap={1} sx={{ mt: 1 }}>
                {form.preferredChannels.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Select Preferred channels to manage opt-ins here.
                  </Typography>
                )}
                {form.preferredChannels.map((id) => (
                  <Chip
                    key={`opt-${id}`}
                    variant="outlined"
                    onDelete={() => removePreferred(id)}   // removes from Preferred & clears opt-in
                    deleteIcon={<X size={16} />}
                    label={
                      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                        <Checkbox
                          size="small"
                          checked={!!form.optIn[id]}
                          onChange={(e) => toggleOptIn(id, e.target.checked)}
                          sx={{ p: 0, mr: 0.5 }}
                        />
                        <Typography variant="body2">{channelLabel(id)}</Typography>
                      </Box>
                    }
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 1.5 }} />

        {/* Devices & Services */}
        <Typography variant="overline" sx={{ letterSpacing: 0.4, display: "block", mb: 1 }}>
          Devices & Services
        </Typography>

        <Grid container spacing={1.5}>
          {/* Devices */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="Add device (e.g., Android, iPhone, Desktop)"
                  value={devInput}
                  onChange={(e) => setDevInput(e.target.value)}
                  fullWidth
                />
                <IconButton size="small" color="primary" onClick={addDevice} aria-label="Add device">
                  <Plus size={18} />
                </IconButton>
              </Stack>

              <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
                {form.devices.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No devices added yet.</Typography>
                )}
                {form.devices.map((v) => {
                  const isMost = form.deviceMostUsed === v;
                  return (
                    <Chip
                      key={`dev-${v}`}
                      label={isMost ? `★ ${v} (Most)` : v}
                      color={isMost ? "primary" : undefined}
                      variant={isMost ? "filled" : "outlined"}
                      onClick={() => pickMostDevice(v)}            // pick “Most used”
                      onDelete={() => removeDevice(v)}              // remove device
                    />
                  );
                })}
              </Stack>

              {form.devices.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  Tip: click a chip to mark it as <strong>Most used</strong>.
                </Typography>
              )}
            </Stack>
          </Grid>

          {/* Services */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="Add service (e.g., Billing, Support, Sales)"
                  value={svcInput}
                  onChange={(e) => setSvcInput(e.target.value)}
                  fullWidth
                />
                <IconButton size="small" color="primary" onClick={addService} aria-label="Add service">
                  <Plus size={18} />
                </IconButton>
              </Stack>

              <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
                {form.services.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No services added yet.</Typography>
                )}
                {form.services.map((v) => {
                  const isMost = form.serviceMostUsed === v;
                  return (
                    <Chip
                      key={`svc-${v}`}
                      label={isMost ? `★ ${v} (Most)` : v}
                      color={isMost ? "primary" : undefined}
                      variant={isMost ? "filled" : "outlined"}
                      onClick={() => pickMostService(v)}           // pick “Most used”
                      onDelete={() => removeService(v)}            // remove service
                    />
                  );
                })}
              </Stack>

              {form.services.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  Tip: click a chip to mark it as <strong>Most used</strong>.
                </Typography>
              )}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 1.5 }} />

        {/* Attributes */}
        <Typography variant="overline" sx={{ letterSpacing: 0.4, display: "block", mb: 1 }}>Attributes</Typography>

        {form.attributes.length > 0 && (
          <Stack direction="row" flexWrap="wrap" useFlexGap gap={1} sx={{ mb: 1 }}>
            {form.attributes.map((a, idx) => (
              <Chip
                key={`${a.key}-${idx}`}
                size="small"
                variant="outlined"
                label={`${a.key}: ${a.value}`}
                onDelete={() =>
                  onField("attributes", form.attributes.filter((_, i) => i !== idx))
                }
              />
            ))}
          </Stack>
        )}

        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            placeholder="key"
            value={attrKey}
            onChange={(e) => setAttrKey(e.target.value)}
            error={!!attrError}
            fullWidth
          />
          <TextField
            size="small"
            placeholder="value"
            value={attrVal}
            onChange={(e) => setAttrVal(e.target.value)}
            error={!!attrError}
            helperText={attrError || ""}
            fullWidth
          />
          <IconButton
            size="small"
            onClick={() => {
              const k = attrKey.trim();
              const v = attrVal.trim();
              if (!k || !v) { setAttrError("Both key and value are required"); return; }
              setAttrError("");
              onField("attributes", [...form.attributes, { key: k, value: v }]);
              setAttrKey(""); setAttrVal("");
            }}
            aria-label="Add attribute"
          >
            <Check size={18} />
          </IconButton>
        </Stack>

      </DialogContent>

      <DialogActions>
        <Button startIcon={<X size={16} />} onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<Save size={16} />}
          onClick={handleSave}
          disabled={!isValid(validateContact({
            ...form,
            languagesCsv: (form.languages || []).join(", "),
            devicesCsv: (form.devices || []).join(", "),
            servicesCsv: (form.services || []).join(", "),
          }))}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function seed() {
  return {
    // core identity
    name: "",
    title: "",

    // phone (single input UI with embedded country selector)
    countryIso: "UG",
    nationalPhone: "",
    phone: "",
    email: "",

    // prefs
    preferredChannels: [],          // multi-select; drives opt-ins list
    languages: [],
    optIn: {
      email: false, sms: false, whatsapp: false, calls: false,
      telegram: false, messenger: false, viber: false, wechat: false,
      signal: false, instagram: false, xdm: false,
    },

    // devices/services as arrays (display as chips; choose “Most” from list)
    devices: [],
    deviceMostUsed: "",
    services: [],
    serviceMostUsed: "",

    // attributes
    attributes: [],
  };
}
