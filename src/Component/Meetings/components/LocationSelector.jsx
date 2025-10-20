// Path: src/Component/Meetings/components/LocationSelector.jsx
import React from "react";
import {
  TextField,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Video,
  Phone as PhoneIcon,
  MapPin,
  ScreenShare,
} from "lucide-react";

/**
 * Simple, client-only location selector.
 * Props:
 * - value: string
 * - onChange: (next: string) => void
 * - options?: string[] (optional override)
 */
const DEFAULT_OPTIONS = [
  "google_meet",
  "zoom",
  "teams",
  "webex",
  "in_person",
  "phone",
];

const LABELS = {
  google_meet: "Google Meet",
  zoom: "Zoom",
  teams: "Microsoft Teams",
  webex: "Webex",
  in_person: "In person",
  phone: "Phone call",
};

function iconFor(opt) {
  switch (opt) {
    case "in_person":
      return <MapPin size={16} />;
    case "phone":
      return <PhoneIcon size={16} />;
    case "teams":
    case "webex":
    case "zoom":
    case "google_meet":
      return <Video size={16} />;
    default:
      return <ScreenShare size={16} />;
  }
}

export default function LocationSelector({ value, onChange, options }) {
  const opts = Array.isArray(options) && options.length ? options : DEFAULT_OPTIONS;

  return (
    <TextField
      select
      label="Location"
      value={value || opts[0]}
      onChange={(e) => onChange?.(e.target.value)}
      fullWidth
    >
      {opts.map((opt) => (
        <MenuItem key={opt} value={opt}>
          <ListItemIcon sx={{ minWidth: 28 }}>{iconFor(opt)}</ListItemIcon>
          <ListItemText
            primary={LABELS[opt] || opt}
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
      ))}
    </TextField>
  );
}
