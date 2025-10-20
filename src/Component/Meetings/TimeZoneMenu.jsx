
// Path: src/Component/Meetings/TimeZoneMenu.jsx
import React, { useMemo } from "react";
import { TextField, MenuItem, ListSubheader, Typography } from "@mui/material";
import { COMMON_TZS } from "./constants/booking.constants";

/**
 * Lightweight timezone selector for client-only flows.
 *
 * Props:
 * - value: string (IANA tz)
 * - onChange: (tz: string) => void
 * - label?: string
 * - fullWidth?: boolean
 * - options?: string[]        // optional override list
 * - includeSystemOption?: boolean  // include the browser's current tz at the top (default: true)
 */
export default function TimeZoneMenu({
  value,
  onChange,
  label = "Timezone",
  fullWidth = true,
  options,
  includeSystemOption = true,
}) {
  const systemTZ = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch {
      return "UTC";
    }
  }, []);

  const list = useMemo(() => {
    const base = Array.isArray(options) && options.length ? options : COMMON_TZS;
    // Ensure uniqueness and optionally prepend system tz
    const out = new Set(base);
    if (includeSystemOption) out.add(systemTZ);
    // Keep a friendly small list; move system tz to the front if present
    const arr = Array.from(out);
    // If system tz is present, make it first
    arr.sort((a, b) => (a === systemTZ ? -1 : b === systemTZ ? 1 : a.localeCompare(b)));
    return arr;
  }, [options, systemTZ, includeSystemOption]);

  const displayTz = value && list.includes(value) ? value : (includeSystemOption ? systemTZ : list[0]);

  return (
    <TextField
      select
      label={label}
      value={displayTz}
      onChange={(e) => onChange?.(e.target.value)}
      fullWidth={fullWidth}
      size="small"
    >
      {includeSystemOption && (
        <ListSubheader>
          <Typography variant="caption">
            System: {systemTZ}
          </Typography>
        </ListSubheader>
      )}
      {list.map((tz) => (
        <MenuItem key={tz} value={tz}>
          {tz}
        </MenuItem>
      ))}
    </TextField>
  );
}
