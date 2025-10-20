// Path: src/Component/Meetings/components/PhoneInputLite.jsx
import React, { useMemo, useState } from "react";
import {
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { ChevronDown, Phone as PhoneIcon } from "lucide-react";
import { toE164, tryParse } from "../utils/phone";

const COUNTRY_OPTIONS = [
  { iso: "UG", dial: "+256", label: "Uganda" },
  { iso: "KE", dial: "+254", label: "Kenya" },
  { iso: "TZ", dial: "+255", label: "Tanzania" },
  { iso: "RW", dial: "+250", label: "Rwanda" },
  { iso: "US", dial: "+1", label: "United States" },
  { iso: "GB", dial: "+44", label: "United Kingdom" },
  { iso: "IN", dial: "+91", label: "India" },
];

function isoToFlag(iso = "") {
  try {
    return iso
      .toUpperCase()
      .replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt()));
  } catch {
    return "🏳️";
  }
}

/**
 * Props:
 * - countryIso, nationalPhone
 * - onCountryChange(iso), onNationalChange(digits), onE164Change(+XXXX or "")
 */
export default function PhoneInputLite({
  countryIso = "UG",
  nationalPhone = "",
  onCountryChange,
  onNationalChange,
  onE164Change,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const current = useMemo(
    () => COUNTRY_OPTIONS.find((c) => c.iso === countryIso) || COUNTRY_OPTIONS[0],
    [countryIso]
  );

  const parsed = useMemo(() => tryParse(nationalPhone, countryIso), [
    nationalPhone,
    countryIso,
  ]);
  const liveE164 = useMemo(
    () => (nationalPhone ? toE164(nationalPhone, countryIso) : ""),
    [nationalPhone, countryIso]
  );
  const phoneLiveError = Boolean(nationalPhone) && (!parsed || !parsed.isValid?.());

  const helperText = nationalPhone
    ? phoneLiveError
      ? `Enter a valid number for ${countryIso}`
      : `Will save as ${liveE164}`
    : "Enter number without country code; we'll save with country code";

  const handleSelectCountry = (iso) => {
    onCountryChange?.(iso);
    // try recompute E.164 immediately if digits exist
    if (nationalPhone) onE164Change?.(toE164(nationalPhone, iso));
    setAnchorEl(null);
  };

  const handleBlurNormalize = () => {
    if (!nationalPhone) return onE164Change?.("");
    onE164Change?.(toE164(nationalPhone, countryIso));
  };

  return (
    <TextField
      label="Phone"
      placeholder="700000000"
      value={nationalPhone}
      onChange={(e) => onNationalChange?.(e.target.value)}
      onBlur={handleBlurNormalize}
      error={phoneLiveError}
      helperText={helperText}
      fullWidth
      inputProps={{ inputMode: "tel", autoComplete: "off" }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ pl: 0.5 }}>
            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
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
              <span style={{ fontSize: 18, lineHeight: 1 }}>
                {isoToFlag(current.iso)}
              </span>
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {current.dial}
              </Typography>
              <ChevronDown size={16} />
            </Button>
            <PhoneIcon size={16} style={{ marginLeft: 8 }} />
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              keepMounted
            >
              {COUNTRY_OPTIONS.map((c) => (
                <MenuItem key={c.iso} onClick={() => handleSelectCountry(c.iso)}>
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
          </InputAdornment>
        ),
      }}
    />
  );
}
