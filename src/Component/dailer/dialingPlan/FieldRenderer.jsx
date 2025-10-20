// /src/Component/crm/inputs/FieldRenderer.jsx
import React from "react";
import {
    Box, Stack, TextField, FormControl, InputLabel, Select, MenuItem,
    FormControlLabel, Checkbox, RadioGroup, Radio, Switch, Slider, Typography,
    Rating, Button, Chip
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

function fileLabel(file) {
    if (!file) return "Choose file";
    if (Array.isArray(file)) return file.map((f) => f.name).join(", ");
    return file?.name || "Choose file";
}

export default function FieldRenderer({ field, value, onChange }) {
    const {
        name,
        label = name,
        type = "short_text",
        required,
        placeholder,
        helperText,
        options = [],
        multi = false,
        min,
        max,
        rows = 3,
        accept,       // for uploads
        currencyCode, // for currency text fields adornment
    } = field || {};

    const commonTextProps = {
        size: "small",
        fullWidth: true,
        label,
        required: !!required,
        placeholder,
        helperText,
        value: value ?? "",
        onChange: (e) => onChange(name, e.target.value),
    };

    // READ-ONLY / INFO
    if (type === "info" || type === "markdown") {
        return (
            <Box sx={{ p: 1, border: (t) => `1px dashed ${t.palette.divider}`, borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{label}</Typography>
                <Typography variant="body2" color="text.secondary">{helperText || placeholder || "—"}</Typography>
            </Box>
        );
    }

    // SHORT / LONG TEXT
    if (type === "short_text" || type === "text") {
        return <TextField {...commonTextProps} />;
    }
    if (type === "long_text" || type === "textarea") {
        return <TextField {...commonTextProps} multiline rows={rows} />;
    }

    // NUMBER
    if (type === "number") {
        return <TextField {...commonTextProps} type="number" inputProps={{ min, max }} />;
    }

    // SELECT / MULTI-SELECT
    if (type === "select") {
        return (
            <FormControl fullWidth size="small" required={!!required}>
                <InputLabel>{label}</InputLabel>
                <Select
                    label={label}
                    value={value ?? ""}
                    onChange={(e) => onChange(name, e.target.value)}
                >
                    {options.map((opt) => <MenuItem key={String(opt)} value={opt}>{String(opt)}</MenuItem>)}
                </Select>
            </FormControl>
        );
    }
    if (type === "multi_select") {
        return (
            <Autocomplete
                multiple
                options={options}
                value={Array.isArray(value) ? value : []}
                onChange={(_e, val) => onChange(name, val)}
                renderInput={(params) => (
                    <TextField {...params} size="small" label={label} placeholder={placeholder} helperText={helperText} />
                )}
            />
        );
    }

    // RADIO / CHECKBOX(boolean) / SWITCH
    if (type === "radio") {
        return (
            <FormControl required={!!required}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>{label}</Typography>
                <RadioGroup
                    value={value ?? ""}
                    onChange={(e) => onChange(name, e.target.value)}
                    row
                >
                    {options.map((opt) => (
                        <FormControlLabel key={String(opt)} value={opt} control={<Radio />} label={String(opt)} />
                    ))}
                </RadioGroup>
                {helperText && <Typography variant="caption" color="text.secondary">{helperText}</Typography>}
            </FormControl>
        );
    }
    if (type === "checkbox") {
        return (
            <FormControlLabel
                control={<Checkbox checked={!!value} onChange={(e) => onChange(name, e.target.checked)} />}
                label={label}
            />
        );
    }
    if (type === "switch" || type === "toggle") {
        return (
            <FormControlLabel
                control={<Switch checked={!!value} onChange={(e) => onChange(name, e.target.checked)} />}
                label={label}
            />
        );
    }

    // DATE / TIME
    if (type === "date" || type === "time" || type === "datetime") {
        const inputType = type === "date" ? "date" : type === "time" ? "time" : "datetime-local";
        return (
            <TextField
                {...commonTextProps}
                type={inputType}
                InputLabelProps={{ shrink: true }}
            />
        );
    }

    // COLOR
    if (type === "color") {
        return (
            <TextField
                size="small"
                fullWidth
                label={label}
                required={!!required}
                type="color"
                value={value ?? "#000000"}
                onChange={(e) => onChange(name, e.target.value)}
                helperText={helperText}
                InputLabelProps={{ shrink: true }}
            />
        );
    }

    // ICON (simple select of provided icon names)
    if (type === "icon") {
        return (
            <FormControl fullWidth size="small">
                <InputLabel>{label}</InputLabel>
                <Select
                    label={label}
                    value={value ?? ""}
                    onChange={(e) => onChange(name, e.target.value)}
                >
                    {options.map((opt) => <MenuItem key={String(opt)} value={opt}>{String(opt)}</MenuItem>)}
                </Select>
            </FormControl>
        );
    }

    // URL / EMAIL / PHONE / CURRENCY
    if (type === "url" || type === "email" || type === "phone" || type === "currency") {
        const inputType = type === "phone" ? "tel" : type;
        return (
            <TextField
                {...commonTextProps}
                type={type === "currency" ? "text" : inputType}
                inputProps={type === "currency" ? { inputMode: "decimal" } : {}}
                placeholder={placeholder || (type === "currency" && currencyCode ? `${currencyCode} 0.00` : undefined)}
            />
        );
    }

    // SLIDER
    if (type === "slider") {
        return (
            <Box>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                <Slider
                    size="small"
                    value={typeof value === "number" ? value : Number(min ?? 0)}
                    onChange={(_e, v) => onChange(name, Array.isArray(v) ? v[0] : v)}
                    step={1}
                    min={min ?? 0}
                    max={max ?? 100}
                />
                {helperText && <Typography variant="caption" color="text.secondary">{helperText}</Typography>}
            </Box>
        );
    }

    // RATING
    if (type === "rating") {
        return (
            <Box>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                <Rating
                    size="small"
                    value={Number(value || 0)}
                    onChange={(_e, v) => onChange(name, v ?? 0)}
                />
            </Box>
        );
    }

    // TAGS / CHIPS (free text list)
    if (type === "tags" || type === "chips") {
        return (
            <Autocomplete
                multiple
                freeSolo
                options={options || []}
                value={Array.isArray(value) ? value : []}
                onChange={(_e, val) => onChange(name, val)}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => <Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} />)
                }
                renderInput={(params) => (
                    <TextField {...params} size="small" label={label} placeholder={placeholder || "Type and press Enter"} helperText={helperText} />
                )}
            />
        );
    }

    // UPLOADS
    if (type === "image_upload" || type === "file_upload" || type === "document_upload") {
        const inputAccept = accept || (type === "image_upload" ? "image/*" :
            type === "document_upload" ? ".pdf,.doc,.docx,.xls,.xlsx" : "*/*");
        const multiple = !!multi;
        return (
            <Stack spacing={0.75}>
                <Typography variant="caption" color="text.secondary">{label}{required ? " *" : ""}</Typography>
                <Button variant="outlined" size="small" component="label">
                    {fileLabel(value)}
                    <input
                        hidden
                        type="file"
                        accept={inputAccept}
                        multiple={multiple}
                        onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            onChange(name, multiple ? files : files[0] || null);
                        }}
                    />
                </Button>
                {helperText && <Typography variant="caption" color="text.secondary">{helperText}</Typography>}
            </Stack>
        );
    }

    // FALLBACK → short text
    return <TextField {...commonTextProps} />;
}
