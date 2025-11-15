// /src/Component/contacts/drawers/EditContactDrawer.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Drawer, Stack, IconButton, Typography, Divider, TextField, Button, Grid, Tooltip,
  Autocomplete, Chip, Paper, InputAdornment, Menu, MenuItem, ListItemIcon, ListItemText, Checkbox
} from "@mui/material";
import { X, Save, Plus, Minus, ChevronDown, Mail, Phone as PhoneIcon, Check } from "lucide-react";
import { FIELD_META } from "../utils/schema";
import { canEdit } from "../utils/editability";
import { validateContact, isValid } from "../utils/validation";
import { parsePhoneNumberFromString } from "libphonenumber-js";

/* -------------------------------- constants -------------------------------- */

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

/* -------------------------------- helpers -------------------------------- */

const channelLabel = (id) => CHANNELS.find((c) => c.id === id)?.label || id;

function isoToFlag(iso = "") {
  try {
    return iso
      .toUpperCase()
      .replace(/./g, ch => String.fromCodePoint(127397 + ch.charCodeAt()));
  } catch { return "🏳️"; }
}

function splitCsv(s) {
  return (s || "").split(",").map(v => v.trim()).filter(Boolean);
}

// Helper function to convert to E.164 format
const toE164 = (countryIso, nationalNumber) => {
  try {
    const phoneNumber = parsePhoneNumberFromString(nationalNumber, countryIso);
    return phoneNumber && phoneNumber.isValid() ? phoneNumber.format("E.164") : "";
  } catch (e) {
    return "";
  }
};

function labelToId(label) {
  const l = (label || "").toLowerCase();
  const match = CHANNELS.find(c => c.label.toLowerCase() === l || c.id === l);
  return match ? match.id : null;
}

/* -------------------- Single input: phone with country picker -------------------- */

function PhoneSingleInput({
  countryIso, nationalPhone, setCountryIso, setNationalPhone, setE164,
  error, helperText, disabled
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const current = COUNTRY_OPTIONS.find(c => c.iso === countryIso) || COUNTRY_OPTIONS[0];

  const onOpenMenu = (e) => !disabled && setAnchorEl(e.currentTarget);
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
        disabled={disabled}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pl: 0.5 }}>
              <Button
                onClick={onOpenMenu}
                variant="text"
                size="small"
                disabled={disabled}
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
        {COUNTRY_OPTIONS.map((c) => (
          <MenuItem key={c.iso} onClick={() => onSelectCountry(c.iso)}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <span style={{ fontSize: 18 }}>{isoToFlag(c.iso)}</span>
            </ListItemIcon>
            <ListItemText
              primary={c.label}
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

/* ---------------------------------- main ---------------------------------- */

export default function EditContactDrawer({ open, contact, onClose, onSubmit }) {
  const origin = contact?._origin || "db";

  const [form, setForm] = useState(() => seed(contact));
  const [errors, setErrors] = useState({});

  // add inputs for devices/services
  const [devInput, setDevInput] = useState("");
  const [svcInput, setSvcInput] = useState("");

  // attributes add row
  const [attrKey, setAttrKey] = useState("");
  const [attrVal, setAttrVal] = useState("");
  const [attrError, setAttrError] = useState("");

  useEffect(() => {
    setForm(seed(contact));
    setErrors({});
    setDevInput("");
    setSvcInput("");
    setAttrKey("");
    setAttrVal("");
    setAttrError("");
  }, [contact, open]);

  // editability map (fallback true if key not in FIELD_META)
  const editableMap = useMemo(() => {
    const out = {};
    Object.keys(FIELD_META).forEach((k) => { out[k] = canEdit(origin, k); });
    // for new keys not in FIELD_META, treat as editable by default
    return out;
  }, [origin]);
  const can = (k, fallbackK) => {
    const a = editableMap[k];
    if (typeof a === "boolean") return a;
    if (fallbackK && typeof editableMap[fallbackK] === "boolean") return editableMap[fallbackK];
    return true;
  };

  const onField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  /* ----------------------------- live validation ----------------------------- */
  const emailLiveError = useMemo(() => form.email && !EMAIL_RE.test(form.email), [form.email]);

  const parsedPhone = useMemo(() => {
    if (!form.nationalPhone) return null;
    try {
      const p = parsePhoneNumberFromString(form.nationalPhone, form.countryIso);
      return p && p.isValid() ? p : null;
    } catch { return null; }
  }, [form.nationalPhone, form.countryIso]);

  const phoneLiveError = !!form.nationalPhone && !parsedPhone;
  const e164Preview = parsedPhone ? parsedPhone.format("E.164") : "";

  /* ------------------------ Preferred ↔ Opt-in behavior ----------------------- */
  const onPreferredChange = (ids) => {
    const allowed = new Set(ids);
    const newOptIn = { ...(form.optIn || {}) };
    Object.keys(newOptIn).forEach((k) => { if (!allowed.has(k)) newOptIn[k] = false; });
    onField("preferredChannels", ids);
    onField("optIn", newOptIn);
  };
  const removePreferred = (id) => {
    const next = form.preferredChannels.filter((x) => x !== id);
    onPreferredChange(next);
  };
  const toggleOptIn = (id, checked) => {
    if (!form.preferredChannels.includes(id)) return;
    onField("optIn", { ...(form.optIn || {}), [id]: checked });
  };

  /* ------------------------- Devices / Services handlers ---------------------- */
  const addDevice = () => {
    const v = devInput.trim();
    if (!v) return;
    if (form.devices.includes(v)) { setDevInput(""); return; }
    onField("devices", [...form.devices, v]);
    setDevInput("");
    if (!form.deviceMostUsed) onField("deviceMostUsed", v);
  };
  const removeDevice = (v) => {
    const filtered = form.devices.filter((x) => x !== v);
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
    const filtered = form.services.filter((x) => x !== v);
    onField("services", filtered);
    if (form.serviceMostUsed === v) onField("serviceMostUsed", filtered[0] || "");
  };
  const pickMostService = (v) => onField("serviceMostUsed", v);

  /* ------------------------------ attributes kv ------------------------------ */
  const addAttribute = () => {
    const k = attrKey.trim();
    const v = attrVal.trim();
    if (!k || !v) { setAttrError("Both key and value are required"); return; }
    setAttrError("");
    onField("attributes", [...form.attributes, { key: k, value: v }]);
    setAttrKey(""); setAttrVal("");
  };
  const removeAttribute = (idx) =>
    onField("attributes", form.attributes.filter((_, i) => i !== idx));

  /* -------------------------------- save flow -------------------------------- */
  const payloadForValidate = useMemo(() => ({
    ...form,
    languagesCsv: (form.languages || []).join(", "),
    devicesCsv: (form.devices || []).join(", "),
    servicesCsv: (form.services || []).join(", "),
  }), [form]);

  const handleSave = async () => {
    // Validate the form first
    const errs = validateContact(payloadForValidate);
    setErrors(errs);
    if (!isValid(errs)) return;

    // 1. Prepare contactInfos
    const contactInfos = [];
    if (form.email || form.nationalPhone) {
      contactInfos.push({
        email: form.email,
        phoneNumber: toE164(form.countryIso, form.nationalPhone) || form.phone, // Ensure phone is E.164
        countryIso: form.countryIso || "",
        nationalPhone: form.nationalPhone, // Store national phone as well
        label: 'Primary', // Or derive from UI
      });
    }

    // 2. Prepare preferences (assuming preferredChannels and languages are arrays)
    const preferences = form.preferredChannels.map(channel => ({
      preferenceChannel: channel,
      languages: form.languages,
    }));

    // 4. Prepare devices
    const devices = form.devices.map(d => ({
      deviceType: d, // d is now a string (deviceType)
      isMostUsed: d === form.deviceMostUsed, // Compare strings
    }));

    // 5. Prepare services
    const services = form.services.map(s => ({
      serviceType: s, // s is now a string (serviceType)
      isMostUsed: s === form.serviceMostUsed, // Compare strings
    }));

    // 6. Prepare meta for other fields not directly mapped
    const meta = {
      source: form.source,
      // Any other miscellaneous data
    };

    // 7. Construct the final patch object for the backend
    const patch = {
      fullName: form.name, // Rename 'name' to 'fullName'
      title: form.title,
      attribute: form.attributes, // Assuming attributes is already an array of {key, value}
      contactInfos,
      preferences,
      devices,
      services,
      meta,
    };

    await onSubmit?.(form.id, patch);
    onClose?.();
  };

  // guard
  if (!open || !contact) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: 360, sm: 520, md: 560 } } }}
    >
      {/* Header */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Edit contact</Typography>
          <Stack direction="row" gap={0.5}>
            <Tooltip title="Save">
              <span>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Save size={16} />}
                  onClick={handleSave}
                  disabled={!isValid(validateContact(payloadForValidate))}
                >
                  Save
                </Button>
              </span>
            </Tooltip>
            <IconButton size="small" onClick={onClose} aria-label="Close">
              <X size={18} />
            </IconButton>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Only fields permitted by policy are editable for this source ({origin === "db" ? "DB" : "Upload"}).
        </Typography>
      </Box>

      <Divider />

      {/* Body */}
      <Box sx={{ px: 2, py: 2 }}>
        <Grid container spacing={1.5}>
          {/* Title (left) + Full name (right) */}
          <Grid item xs={12} md={3}>
            <Field
              label={FIELD_META.title?.label || "Title"}
              value={form.title}
              onChange={(v) => onField("title", v)}
              disabled={!can("title")}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Field
              label={FIELD_META.name?.label || "Full name"}
              value={form.name}
              onChange={(v) => onField("name", v)}
              error={errors.name}
              disabled={!can("name")}
            />
          </Grid>

          {/* Email + Phone (single) */}
          <Grid item xs={12} md={6}>
            <TextField
              label={FIELD_META.email?.label || "Email"}
              value={form.email}
              onChange={(e) => onField("email", e.target.value)}
              fullWidth
              size="small"
              error={!!errors.email || emailLiveError}
              helperText={errors.email || (form.email && emailLiveError ? "Invalid email" : "")}
              disabled={!can("email")}
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
              disabled={!can("phone")}
            />
          </Grid>

          {/* Preferred (multi) + Languages */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={CHANNELS.map((c) => c.id)}
              value={form.preferredChannels}
              onChange={(_, val) => onPreferredChange(val)}
              getOptionLabel={(id) => channelLabel(id)}
              renderTags={() => null}
              renderInput={(params) => (
                <TextField {...params} size="small" label={FIELD_META.preferredChannel?.label || "Preferred channels"} placeholder="Select…" />
              )}
              disabled={!can("preferredChannels", "preferredChannel")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={LANG_OPTIONS}
              value={form.languages}
              onChange={(_, val) => onField("languages", val)}
              renderInput={(params) => (
                <TextField {...params} size="small" label="Languages" placeholder="Select languages" />
              )}
              disabled={!can("languages")}
            />
          </Grid>

          {/* Opt-in chips (generated from Preferred) */}
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
                    onDelete={() => removePreferred(id)}
                    deleteIcon={<X size={16} />}
                    label={
                      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                        <Checkbox
                          size="small"
                          checked={!!form.optIn[id]}
                          onChange={(e) => toggleOptIn(id, e.target.checked)}
                          sx={{ p: 0, mr: 0.5 }}
                          disabled={!can("optIn")}
                        />
                        <Typography variant="body2">{channelLabel(id)}</Typography>
                      </Box>
                    }
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Source */}
          <Grid item xs={12} md={6}>
            <Field
              label={FIELD_META.source?.label || "Source"}
              value={form.source}
              onChange={(v) => onField("source", v)}
              disabled={!can("source")}
            />
          </Grid>
        </Grid>

        {/* Devices & Services */}
        <Section title="Devices & Services">
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
                    disabled={!can("devices")}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={addDevice}
                    disabled={!can("devices")}
                    startIcon={<Plus size={16} />}
                  >
                    Add
                  </Button>
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
                        onClick={() => can("deviceMostUsed") && pickMostDevice(v)}
                        onDelete={() => can("devices") && removeDevice(v)}
                      />
                    );
                  })}
                </Stack>
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
                    disabled={!can("services")}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={addService}
                    disabled={!can("services")}
                    startIcon={<Plus size={16} />}
                  >
                    Add
                  </Button>
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
                        onClick={() => can("serviceMostUsed") && pickMostService(v)}
                        onDelete={() => can("services") && removeService(v)}
                      />
                    );
                  })}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Section>

        {/* Attributes — chips + add row (match modal) */}
        <Section title={FIELD_META.attributes?.label || "Attributes"} note="Key/value tags that help segment contacts.">
          {form.attributes.length > 0 && (
            <Stack direction="row" flexWrap="wrap" useFlexGap gap={1} sx={{ mb: 1 }}>
              {form.attributes.map((a, idx) => (
                <Chip
                  key={`${a.key}-${idx}`}
                  size="small"
                  variant="outlined"
                  label={`${a.key}: ${a.value}`}
                  onDelete={() => removeAttribute(idx)}
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
              fullWidth
              disabled={!can("attributes")}
              error={!!attrError}
            />
            <TextField
              size="small"
              placeholder="value"
              value={attrVal}
              onChange={(e) => setAttrVal(e.target.value)}
              fullWidth
              disabled={!can("attributes")}
              error={!!attrError}
              helperText={attrError || ""}
            />
            <IconButton
              size="small"
              onClick={addAttribute}
              disabled={!can("attributes")}
              aria-label="Add attribute"
            >
              <Check size={18} />
            </IconButton>
          </Stack>
        </Section>

        {/* Footer */}
        <Stack direction="row" gap={1.5} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<Save size={16} />}
            onClick={handleSave}
            disabled={!isValid(validateContact(payloadForValidate))}
          >
            Save changes
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}

/* ---------------------------- small building blocks ---------------------------- */
function seed(c) {
  const d = c ?? {};

  // attempt to derive country + national from E.164 phone
  let countryIso = d.countryIso || "UG";
  let nationalPhone = d.nationalPhone || "";
  try {
    if (d.phone && d.phone.startsWith("+")) {
      const p = parsePhoneNumberFromString(d.phone);
      if (p && p.isValid()) {
        countryIso = d.countryIso || p.country || countryIso;
        nationalPhone = p.nationalNumber || nationalPhone;
      }
    }
  } catch {}

  // preferred channels: accept legacy single label
  let preferredChannels = Array.isArray(d.preferredChannels) ? [...d.preferredChannels] : [];
  if (!preferredChannels.length && d.preferredChannel) {
    const id = labelToId(d.preferredChannel);
    if (id) preferredChannels = [id];
  }

  const devices = Array.isArray(d.devices) ? [...d.devices] : splitCsv(d.devicesCsv);
  const services = Array.isArray(d.services) ? [...d.services] : splitCsv(d.servicesCsv);
  const languages = Array.isArray(d.languages) ? [...d.languages] : splitCsv(d.languagesCsv);

  return {
    id: d.id ?? null,
    // identity
    name: d.name ?? "",
    email: d.email ?? "",
    title: d.title ?? "",

    // phone (hybrid)
    phone: d.phone ?? "",
    countryIso,
    nationalPhone,

    // prefs
    preferredChannels,
    languages,
    optIn: typeof d.optIn === "object" && d.optIn ? { ...d.optIn } : {
      email: false, sms: false, whatsapp: false, calls: false,
      telegram: false, messenger: false, viber: false, wechat: false,
      signal: false, instagram: false, xdm: false,
    },

    // source
    source: d.source ?? "",

    // devices/services
    devices,
    deviceMostUsed: d.deviceMostUsed ?? (devices[0] || ""),
    services,
    serviceMostUsed: d.serviceMostUsed ?? (services[0] || ""),

    // attributes
    attributes: Array.isArray(d.attributes)
      ? d.attributes.map((x) => ({ key: x?.key ?? "", value: x?.value ?? "" }))
      : [],

    _origin: d._origin ?? "db",
  };
}

function Section({ title, note, children }) {
  return (
    <Box sx={{ mt: 2.5 }}>
      <Typography variant="overline" sx={{ letterSpacing: 0.4 }}>{title}</Typography>
      {note ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, mb: 1 }}>
          {note}
        </Typography>
      ) : null}
      {children}
    </Box>
  );
}

function Field({ label, value, onChange, error, placeholder, disabled }) {
  return (
    <TextField
      label={label}
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      fullWidth
      size="small"
      placeholder={placeholder}
      disabled={disabled}
      error={!!error}
      helperText={error || ""}
      InputProps={{
        startAdornment: label?.toLowerCase().includes("email") ? (
          <InputAdornment position="start">
            <Mail size={16} />
          </InputAdornment>
        ) : undefined,
      }}
    />
  );
}
