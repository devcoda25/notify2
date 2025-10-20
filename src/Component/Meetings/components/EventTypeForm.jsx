// Path: src/Component/Meetings/components/EventTypeForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  TextField,
  Button,
  Chip,
  MenuItem,
  Typography,
  Divider,
  InputAdornment,
  Tooltip,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
} from "@mui/material";
import { Save, Clock, Palette, Link as LinkIcon, Info } from "lucide-react";
import { useEventTypesStore } from "../../store/scheduling/useEventTypesStore";

const COLORS = ["#0ea5e9", "#22c55e", "#a855f7", "#ef4444", "#f59e0b", "#14b8a6"];
const LOCATION_OPTIONS = ["google_meet", "zoom", "in_person", "phone"];

const slugify = (txt) =>
  (txt || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const numberInputSx = {
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
};

export default function EventTypeForm({
  eventTypeId,
  defaultOwner = { ownerType: "user", ownerId: "usr_alpha" },
  onSaved,
}) {
  const { getById, createEventType, updateEventType, loadFixtures, loaded } =
    useEventTypesStore();
  const existing = useMemo(
    () => (eventTypeId ? getById(eventTypeId) : null),
    [eventTypeId, getById]
  );

  const [v, setV] = useState(
    existing || {
      id: "",
      ownerType: defaultOwner.ownerType,
      ownerId: defaultOwner.ownerId,
      name: "",
      slug: "",
      description: "",
      durationMinutes: 30,
      color: COLORS[0],
      locations: ["google_meet"],
      timezone: "Africa/Kampala",
      minSchedulingNoticeMinutes: 120,
      maxBookingDaysInFuture: 60,
      bufferBeforeMinutes: 5,
      bufferAfterMinutes: 5,
    }
  );

  const [errors, setErrors] = useState({});

  useEffect(() => { if (!loaded) loadFixtures(); }, [loaded, loadFixtures]);
  useEffect(() => { if (existing) setV(existing); }, [existing?.id]); // eslint-disable-line

  const validate = () => {
    const e = {};
    if (!v.name?.trim()) e.name = "Name is required";
    if (!v.durationMinutes || v.durationMinutes <= 0) e.durationMinutes = "Enter a positive duration";
    if (!v.maxBookingDaysInFuture || v.maxBookingDaysInFuture < 1) e.maxBookingDaysInFuture = "Must be at least 1 day";
    if (v.bufferBeforeMinutes < 0 || v.bufferAfterMinutes < 0 || Number.isNaN(v.bufferAfterMinutes) || Number.isNaN(v.bufferBeforeMinutes)) {
      e.buffers = "Buffers cannot be negative";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const data = { ...v, slug: v.slug ? slugify(v.slug) : slugify(v.name) };
    if (existing) {
      updateEventType(existing.id, data);
      onSaved?.(data);
    } else {
      const id = createEventType({ ...data, active: true }); // default active
      onSaved?.({ ...data, id, active: true });
    }
  };

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/book/${v.slug || slugify(v.name || "your-event")}`;

  return (
    <Paper elevation={0} sx={{ p: 2, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 2 }}>
      <Stack gap={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={700}>Event Type</Typography>
          <Chip label={`Owner: ${v.ownerType}:${v.ownerId}`} size="small" />
        </Stack>

        {Object.keys(errors).length > 0 && (
          <Stack gap={0.5}>
            <Typography variant="body2" color="error" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Info size={16} /> Fix the issues below to continue.
            </Typography>
          </Stack>
        )}

        <Divider />

        {/* Uniform heights via size="small" on everything */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              size="small"
              label="Name"
              value={v.name}
              onChange={(e) => {
                const name = e.target.value;
                setV((cur) => ({
                  ...cur,
                  name,
                  slug: !cur.slug || cur.slug === slugify(cur.name) ? slugify(name) : cur.slug,
                }));
              }}
              error={!!errors.name}
              helperText={errors.name || " "}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              size="small"
              label="Slug"
              value={v.slug}
              onChange={(e) => setV({ ...v, slug: e.target.value })}
              helperText=" "
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon size={16} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Color selector — inline, aligned */}
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ height: 40 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", minWidth: 56, textAlign: "right" }}>
                Color
              </Typography>
              <Palette size={16} />
              <ToggleButtonGroup
                exclusive
                value={v.color}
                onChange={(_, val) => val && setV({ ...v, color: val })}
                size="small"
              >
                {COLORS.map((c) => (
                  <ToggleButton key={c} value={c} sx={{ p: 0.5 }}>
                    <Box sx={{ width: 18, height: 18, bgcolor: c, borderRadius: 0.75, border: (t) => `1px solid ${t.palette.divider}` }} />
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <TextField
              size="small"
              label="Description"
              value={v.description}
              onChange={(e) => setV({ ...v, description: e.target.value })}
              minRows={3}
              multiline
              fullWidth
              helperText=" "
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              size="small"
              label="Duration (minutes)"
              type="number"
              value={v.durationMinutes}
              onChange={(e) =>
                setV({
                  ...v,
                  durationMinutes: Math.max(5, Number(e.target.value || 15)),
                })
              }
              error={!!errors.durationMinutes}
              helperText={errors.durationMinutes || " "}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Clock size={16} />
                  </InputAdornment>
                ),
              }}
              sx={numberInputSx}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              size="small"
              label="Min notice (minutes)"
              type="number"
              value={v.minSchedulingNoticeMinutes}
              onChange={(e) =>
                setV({
                  ...v,
                  minSchedulingNoticeMinutes: Math.max(0, Number(e.target.value || 0)),
                })
              }
              sx={numberInputSx}
              fullWidth
              helperText=" "
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              size="small"
              label="Max booking window (days)"
              type="number"
              value={v.maxBookingDaysInFuture}
              onChange={(e) =>
                setV({
                  ...v,
                  maxBookingDaysInFuture: Math.max(1, Number(e.target.value || 30)),
                })
              }
              error={!!errors.maxBookingDaysInFuture}
              helperText={errors.maxBookingDaysInFuture || " "}
              sx={numberInputSx}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              size="small"
              label="Buffer before (minutes)"
              type="number"
              value={v.bufferBeforeMinutes}
              onChange={(e) =>
                setV({
                  ...v,
                  bufferBeforeMinutes: Math.max(0, Number(e.target.value || 0)),
                })
              }
              sx={numberInputSx}
              fullWidth
              helperText=" "
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              size="small"
              label="Buffer after (minutes)"
              type="number"
              value={v.bufferAfterMinutes}
              onChange={(e) =>
                setV({
                  ...v,
                  bufferAfterMinutes: Math.max(0, Number(e.target.value || 0)),
                })
              }
              error={!!errors.buffers}
              helperText={errors.buffers || " "}
              sx={numberInputSx}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={8}>
            {/* Multi-select as chips */}
            <Autocomplete
              multiple
              size="small"
              options={LOCATION_OPTIONS}
              value={v.locations || []}
              onChange={(_, newVal) => setV({ ...v, locations: newVal })}
              renderInput={(params) => (
                <TextField {...params} label="Allowed location(s)" placeholder="Select location(s)" helperText=" " />
              )}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Public URL chip preview */}
        <Tooltip title="Public booking URL (sample)">
          <Chip
            icon={<LinkIcon size={14} />}
            variant="outlined"
            label={publicUrl}
            sx={{
              maxWidth: "100%",
              "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
              alignSelf: "flex-start",
            }}
          />
        </Tooltip>

        {/* Bottom-right Save */}
        <Stack direction="row" justifyContent="flex-end">
          <Button startIcon={<Save />} variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
