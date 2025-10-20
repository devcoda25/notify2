// Path: src/Component/templates/utils/LocaleTabs.jsx
import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Autocomplete,
} from "@mui/material";
import { Languages } from "lucide-react";

export const LOCALES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pt-BR", label: "Português (BR)" },
  { code: "pt-PT", label: "Português (PT)" },
  { code: "nl", label: "Nederlands" },
  { code: "sv", label: "Svenska" },
  { code: "no", label: "Norsk" },
  { code: "da", label: "Dansk" },
  { code: "fi", label: "Suomi" },
  { code: "ru", label: "Русский" },
  { code: "tr", label: "Türkçe" },
  { code: "pl", label: "Polski" },
  { code: "el", label: "Ελληνικά" },
  { code: "he", label: "עברית" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "th", label: "ไทย" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "zh-CN", label: "中文（简体）" },
  { code: "zh-TW", label: "中文（繁體）" },
  { code: "zh-HK", label: "中文（香港）" },
];

/**
 * LocaleSelect (dropdown)
 * Props:
 *  - value: locale code (string | "")
 *  - onChange: (code) => void
 *  - label?: string
 *  - inline?: boolean  // if true, renders just the field (no header/paper)
 */
export default function LocaleTabs({ value = "", onChange, label = "Locale", inline = false }) {
  const curr = React.useMemo(
    () => LOCALES.find((l) => l.code === value) || null,
    [value]
  );

  const Field = (
    <Autocomplete
      size="small"
      options={LOCALES}
      value={curr}
      getOptionLabel={(o) => (o ? `${o.label} — ${o.code}` : "")}
      onChange={(_, opt) => onChange?.(opt?.code || "")}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Search locales…"
          sx={{
            minWidth: 220,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.25,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            },
          }}
        />
      )}
      isOptionEqualToValue={(o, v) => o.code === v.code}
    />
  );

  if (inline) return Field;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 2,
        boxShadow: "none",
        "&:focus-within": { borderColor: "primary.main" },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Languages size={16} />
        <Typography variant="subtitle2">Locale</Typography>
        <Box flexGrow={1} />
        {/* keep it clean; no extra search box since Autocomplete already searches */}
      </Stack>
      {Field}
    </Paper>
  );
}
