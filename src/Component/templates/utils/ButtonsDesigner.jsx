// Path: src/Component/templates/utils/ButtonsDesigner.jsx

import React from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Divider,
  Chip,
  Tooltip,
  InputAdornment,
  Menu,
  MenuItem as MUIMenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  ListChecks,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ArrowRight,
  Phone as PhoneIcon,
  Code2,
  Share2,
  Copy as CopyIcon,
  Smartphone,
  CircleOff,
  Link2,
  ChevronDown,
} from "lucide-react";
import { FieldStable } from "./EditorPieces";
import { parsePhoneNumberFromString } from "libphonenumber-js";

/* ---------- small helpers ---------- */
const uid = () =>
  `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

const ACTION_META = {
  link: { label: "Open Link", Icon: ExternalLink },
  deeplink: { label: "Deep Link", Icon: ArrowRight },
  call: { label: "Dial / Call Number", Icon: PhoneIcon },
  reply: { label: "Reply (chat/platform)", Icon: ArrowRight },
  webhook: { label: "Trigger Webhook", Icon: Code2 },
  copy: { label: "Copy to Clipboard", Icon: CopyIcon },
  share: { label: "Share", Icon: Share2 },
  navigate: { label: "Navigate (in-app)", Icon: ArrowRight },
  open_app: { label: "Open App", Icon: Smartphone },
  none: { label: "Do Nothing", Icon: CircleOff },
};

function allowedActions(channel) {
  switch (channel) {
    case "email":
      return ["link", "call", "copy", "share", "none"];
    case "sms":
      return ["link", "call", "none"];
    case "push":
      return ["deeplink", "open_app", "link", "copy", "none"];
    case "platform":
      return [
        "link",
        "deeplink",
        "reply",
        "webhook",
        "navigate",
        "copy",
        "share",
        "none",
      ];
    case "whatsapp":
      return ["link", "reply", "none"];
    default:
      return ["link", "none"];
  }
}

const DEFAULT_ACTION_PAYLOAD = {
  link: { type: "link", url: "" },
  deeplink: { type: "deeplink", url: "" },
  call: { type: "call", phone: "", countryIso: "UG", nationalPhone: "" },
  reply: { type: "reply", text: "", payload: "" },
  webhook: {
    type: "webhook",
    method: "POST",
    url: "",
    headersJSON: "{}",
    bodyJSON: "{}",
  },
  copy: { type: "copy", text: "" },
  share: { type: "share", text: "", url: "" },
  navigate: { type: "navigate", route: "", paramsJSON: "{}" },
  open_app: { type: "open_app", url: "" },
  none: { type: "none" },
};

const NEW_BUTTON = () => ({
  id: uid(),
  label: "Button",
  action: { ...DEFAULT_ACTION_PAYLOAD.link },
});

/* ---------- migrate any legacy compose actions to call ---------- */
function normalizeAction(a) {
  if (!a) return { type: "none" };
  if (a.type === "email" || a.type === "sms") {
    return {
      type: "call",
      phone: a.to || "",
      countryIso: "UG",
      nationalPhone: "",
    };
  }
  return a;
}

/* ---------- country data + utils (compact) ---------- */
const COUNTRY_OPTIONS = [
  { iso: "UG", dial: "+256", label: "Uganda" },
  { iso: "KE", dial: "+254", label: "Kenya" },
  { iso: "TZ", dial: "+255", label: "Tanzania" },
  { iso: "RW", dial: "+250", label: "Rwanda" },
  { iso: "BI", dial: "+257", label: "Burundi" },
  { iso: "CD", dial: "+243", label: "DR Congo" },
  { iso: "US", dial: "+1", label: "United States" },
  { iso: "GB", dial: "+44", label: "United Kingdom" },
  { iso: "IN", dial: "+91", label: "India" },
];
const isoToFlag = (iso = "") => {
  try {
    return iso
      .toUpperCase()
      .replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt()));
  } catch {
    return "🏳️";
  }
};

/* ---------- compact phone input with country picker + validation ---------- */
function MiniPhoneInput({
  value,
  onChange,
  countryIso = "UG",
  onCountryIso,
  helperText,
  error,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const current =
    COUNTRY_OPTIONS.find((c) => c.iso === countryIso) || COUNTRY_OPTIONS[0];

  const onOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const onCloseMenu = () => setAnchorEl(null);

  const onSelectCountry = (iso) => {
    onCountryIso?.(iso);
    onCloseMenu();
  };

  const onBlurNormalize = () => {
    if (!value) return;
    try {
      const p = parsePhoneNumberFromString(value, countryIso);
      if (p && p.isValid()) {
        onChange?.(p.nationalNumber); // keep national in field
      }
    } catch {
      /* noop */
    }
  };

  return (
    <>
      <TextField
        size="small"
        fullWidth
        label="Phone"
        placeholder="700000000"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlurNormalize}
        error={!!error}
        helperText={helperText}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ pl: 0.25 }}>
              <Button
                onClick={onOpenMenu}
                variant="text"
                size="small"
                sx={{
                  minWidth: "unset",
                  px: 0.75,
                  gap: 0.5,
                  borderRight: (t) => `1px solid ${t.palette.divider}`,
                  borderRadius: 0,
                  height: 30,
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>
                  {isoToFlag(current.iso)}
                </span>
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {current.dial}
                </Typography>
                <ChevronDown size={16} />
              </Button>
              <PhoneIcon size={16} style={{ marginLeft: 8 }} />
            </InputAdornment>
          ),
        }}
      />
      <Menu anchorEl={anchorEl} open={open} onClose={onCloseMenu} keepMounted>
        {COUNTRY_OPTIONS.map((c) => (
          <MUIMenuItem key={c.iso} onClick={() => onSelectCountry(c.iso)}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <span style={{ fontSize: 18 }}>{isoToFlag(c.iso)}</span>
            </ListItemIcon>
            <ListItemText
              primary={c.label}
              secondary={`${c.dial}  •  ${c.iso}`}
              primaryTypographyProps={{ variant: "body2" }}
              secondaryTypographyProps={{ variant: "caption" }}
            />
          </MUIMenuItem>
        ))}
      </Menu>
    </>
  );
}

/* ========================== Action-specific subcomponents ========================== */

function LinkFields({ action, onActionChange }) {
  const set = (patch) => onActionChange?.({ ...action, ...patch });
  return (
    <FieldStable
      size="small"
      label={action.type === "link" ? "URL" : "Deep Link URL"}
      value={action.url || ""}
      onChange={(v) => set({ url: v })}
      startIcon={<Link2 size={14} />}
    />
  );
}

function CallFields({ action, onActionChange }) {
  const set = (patch) => onActionChange?.({ ...action, ...patch });
  const [liveError, setLiveError] = React.useState("");

  const validateAndSaveE164 = (national, iso) => {
    if (!national) {
      set({ nationalPhone: "", phone: "" });
      setLiveError("");
      return;
    }
    try {
      const p = parsePhoneNumberFromString(national, iso);
      if (p && p.isValid()) {
        set({
          nationalPhone: national,
          countryIso: iso,
          phone: p.format("E.164"),
        });
        setLiveError(`Will dial ${p.format("E.164")}`);
      } else {
        set({ nationalPhone: national, countryIso: iso, phone: "" });
        setLiveError("Enter a valid number");
      }
    } catch {
      set({ nationalPhone: national, countryIso: iso, phone: "" });
      setLiveError("Enter a valid number");
    }
  };

  return (
    <MiniPhoneInput
      value={action.nationalPhone || ""}
      onChange={(nv) => validateAndSaveE164(nv, action.countryIso || "UG")}
      countryIso={action.countryIso || "UG"}
      onCountryIso={(iso) =>
        validateAndSaveE164(action.nationalPhone || "", iso)
      }
      helperText={liveError}
      error={liveError && !liveError.startsWith("Will dial")}
    />
  );
}

function ReplyFields({ action, onActionChange }) {
  const set = (patch) => onActionChange?.({ ...action, ...patch });
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
      <FieldStable
        size="small"
        label="Reply text (visible)"
        value={action.text || ""}
        onChange={(v) => set({ text: v })}
      />
      <FieldStable
        size="small"
        label="Payload (programmatic)"
        value={action.payload || ""}
        onChange={(v) => set({ payload: v })}
      />
    </Stack>
  );
}

function WebhookFields({ action, onActionChange }) {
  const set = (patch) => onActionChange?.({ ...action, ...patch });
  return (
    <Stack spacing={1}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
        <TextField
          select
          size="small"
          label="Method"
          value={action.method || "POST"}
          onChange={(e) => set({ method: e.target.value })}
          sx={{ minWidth: 140 }}
        >
          {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </TextField>
        <FieldStable
          size="small"
          label="URL"
          value={action.url || ""}
          onChange={(v) => set({ url: v })}
        />
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
        <FieldStable
          size="small"
          label="Headers (JSON)"
          value={action.headersJSON || "{}"}
          onChange={(v) => set({ headersJSON: v })}
          multiline
          rows={3}
          helperText='Example: {"Authorization":"Bearer {{token}}"}'
        />
        <FieldStable
          size="small"
          label="Body (JSON)"
          value={action.bodyJSON || "{}"}
          onChange={(v) => set({ bodyJSON: v })}
          multiline
          rows={3}
          helperText='Example: {"user":"{{user_id}}"}'
        />
      </Stack>
    </Stack>
  );
}

function CopyFields({ action, onActionChange }) {
  const set = (patch) => onActionChange?.({ ...action, ...patch });
  return (
    <FieldStable
      size="small"
      label="Text to copy"
      value={action.text || ""}
      onChange={(v) => set({ text: v })}
      placeholder="{{coupon_code}}"
    />
  );
}

function ShareFields({ action, onActionChange }) {
  const set = (patch) => onActionChange?.({ ...action, ...patch });
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
      <FieldStable
        size="small"
        label="Share text"
        value={action.text || ""}
        onChange={(v) => set({ text: v })}
      />
      <FieldStable
        size="small"
        label="Share URL (optional)"
        value={action.url || ""}
        onChange={(v) => set({ url: v })}
      />
    </Stack>
  );
}

function NavigateFields({ action, onActionChange }) {
  const set = (patch) => onActionChange?.({ ...action, ...patch });
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
      <FieldStable
        size="small"
        label="Route"
        value={action.route || ""}
        onChange={(v) => set({ route: v })}
      />
      <FieldStable
        size="small"
        label="Params (JSON)"
        value={action.paramsJSON || "{}"}
        onChange={(v) => set({ paramsJSON: v })}
        multiline
        rows={2}
      />
    </Stack>
  );
}

function OpenAppFields({ action, onActionChange }) {
  const set = (patch) => onActionChange?.({ ...action, ...patch });
  return (
    <FieldStable
      size="small"
      label="App/Store URL or Scheme"
      value={action.url || ""}
      onChange={(v) => set({ url: v })}
      placeholder="myapp://home or https://store…"
    />
  );
}

/* ---------- dispatcher with NO hooks here ---------- */
function ActionFields({ action, onActionChange }) {
  switch (action?.type) {
    case "link":
    case "deeplink":
      return <LinkFields action={action} onActionChange={onActionChange} />;
    case "call":
      return <CallFields action={action} onActionChange={onActionChange} />;
    case "reply":
      return <ReplyFields action={action} onActionChange={onActionChange} />;
    case "webhook":
      return <WebhookFields action={action} onActionChange={onActionChange} />;
    case "copy":
      return <CopyFields action={action} onActionChange={onActionChange} />;
    case "share":
      return <ShareFields action={action} onActionChange={onActionChange} />;
    case "navigate":
      return <NavigateFields action={action} onActionChange={onActionChange} />;
    case "open_app":
      return <OpenAppFields action={action} onActionChange={onActionChange} />;
    case "none":
    default:
      return (
        <Typography variant="body2" color="text.secondary">
          No extra fields for “Do Nothing”.
        </Typography>
      );
  }
}

/* =============================== main component =============================== */

export default function ButtonsDesigner({
  channel = "email",
  value = [],
  onChange,
  max = 8,
  title = "Buttons",
}) {
  const buttons = Array.isArray(value) ? value : [];
  const allowed = allowedActions(channel);

  const add = () => {
    const base = NEW_BUTTON();
    const defType = allowed.includes("link") ? "link" : allowed[0] || "none";
    base.action = { ...DEFAULT_ACTION_PAYLOAD[defType] };
    onChange?.([...buttons, base]);
  };

  const remove = (id) => onChange?.(buttons.filter((b) => b.id !== id));

  const move = (id, dir) => {
    const idx = buttons.findIndex((b) => b.id === id);
    if (idx < 0) return;
    const j = idx + dir;
    if (j < 0 || j >= buttons.length) return;
    const next = [...buttons];
    const [item] = next.splice(idx, 1);
    next.splice(j, 0, item);
    onChange?.(next);
  };

  const setBtn = (id, patch) => {
    const next = buttons.map((b) => (b.id === id ? { ...b, ...patch } : b));
    onChange?.(next);
  };

  const setBtnActionType = (id, type) => {
    const next = buttons.map((b) => {
      if (b.id !== id) return b;
      const payload = DEFAULT_ACTION_PAYLOAD[type]
        ? { ...DEFAULT_ACTION_PAYLOAD[type] }
        : { type: "none" };
      return { ...b, action: payload };
    });
    onChange?.(next);
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <ListChecks size={16} />
        <Typography variant="subtitle2">{title}</Typography>
        <Chip label={buttons.length} size="small" />
        <Box flexGrow={1} />
        <Button
          size="small"
          startIcon={<Plus size={16} />}
          onClick={add}
          disabled={buttons.length >= max}
        >
          Add Button
        </Button>
      </Stack>

      <Divider sx={{ mb: 1 }} />

      <Stack spacing={1.25}>
        {buttons.map((b, i) => {
          const action = normalizeAction(b.action);
          const Icon = ACTION_META[action?.type]?.Icon || CircleOff;

          return (
            <Paper key={b.id} variant="outlined" sx={{ p: 1.25, borderRadius: 1.5 }}>
              {/* Row 1: Action first (small), then Label with icon; consistent sizing */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1}
                alignItems="flex-start"
              >
                <Box sx={{ minWidth: 240 }}>
                  <TextField
                    select
                    size="small"
                    label="Action"
                    value={action?.type || "none"}
                    onChange={(e) => setBtnActionType(b.id, e.target.value)}
                    fullWidth
                  >
                    {allowed.map((t) => {
                      const AIcon = ACTION_META[t]?.Icon || CircleOff;
                      return (
                        <MenuItem key={t} value={t}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <AIcon size={14} />
                            <span>{ACTION_META[t]?.label || t}</span>
                          </Stack>
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </Box>

                <Box sx={{ flex: 1, minWidth: 240 }}>
                  <FieldStable
                    size="small"
                    label="Label"
                    value={b.label || ""}
                    onChange={(v) => setBtn(b.id, { label: v })}
                    startIcon={<Icon size={14} />} // icon shown inside the label field
                    placeholder="e.g., Learn more"
                  />
                </Box>

                <Box flexGrow={1} />

                <Stack
                  direction="row"
                  spacing={0.5}
                  alignSelf={{ xs: "flex-end", md: "center" }}
                >
                  <Tooltip title="Move up">
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => move(b.id, -1)}
                        disabled={i === 0}
                      >
                        <ArrowUp size={16} />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Move down">
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => move(b.id, +1)}
                        disabled={i === buttons.length - 1}
                      >
                        <ArrowDown size={16} />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Remove">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => remove(b.id)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              {/* Row 2: Action-specific helper fields */}
              <Box sx={{ mt: 1 }}>
                <ActionFields
                  action={action}
                  onActionChange={(a) => setBtn(b.id, { action: a })}
                />
              </Box>
            </Paper>
          );
        })}

        {!buttons.length && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
            No buttons yet. Click “Add Button” to create one. Available actions
            depend on the current channel ({channel}).
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
