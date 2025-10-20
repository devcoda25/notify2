// Path: src/Component/Meetings/components/PoolEditor.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Tooltip,
  Grid,
  Autocomplete,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Trash2, Save, Info, Check } from "lucide-react";
import { usePoolsStore } from "../../store/scheduling/usePoolsStore";

// Intuitive language list: code + human label
const LANG_OPTIONS = [
  { code: "en-US", label: "English — United States" },
  { code: "en-GB", label: "English — United Kingdom" },
  { code: "sw-KE", label: "Swahili — Kenya" },
  { code: "sw-TZ", label: "Swahili — Tanzania" },
  { code: "fr-FR", label: "French — France" },
  { code: "es-ES", label: "Spanish — Spain" },
  { code: "de-DE", label: "German — Germany" },
];
const LANG_MAP = Object.fromEntries(LANG_OPTIONS.map((o) => [o.code, o.label]));

const numberInputSx = {
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
};

export default function PoolEditor({ poolId, onSaved }) {
  const theme = useTheme();
  const store = usePoolsStore();
  const { loadFixtures, loaded, getById, updatePool, createPool } = store;

  const pool = useMemo(() => (poolId ? getById?.(poolId) : null), [getById, poolId]);

  const [v, setV] = useState(
    pool || {
      id: "",
      name: "",
      type: "round_robin",
      slug: "",
      members: [],
      distribution: "longest_idle",
      timezone: "Africa/Kampala",
    }
  );

  // single inline add-member form state
  const [newMember, setNewMember] = useState({ userId: "", weight: 1, languages: [] });

  useEffect(() => {
    if (!loaded) loadFixtures();
  }, [loaded, loadFixtures]);

  useEffect(() => {
    if (pool) setV(pool);
  }, [pool]);

  const disabled = !v.name?.trim();

  const addMemberToList = () => {
    if (!newMember.userId?.trim()) return;
    const member = {
      userId: newMember.userId.trim(),
      weight: Math.max(1, Number(newMember.weight || 1)),
      languages: newMember.languages, // store as codes array
      isActive: true, // default active; no switch shown
    };
    setV((s) => ({ ...s, members: [...(s.members || []), member] }));
    setNewMember({ userId: "", weight: 1, languages: [] });
  };

  const removeMemberAt = (idx) => {
    setV((s) => {
      const members = [...(s.members || [])];
      members.splice(idx, 1);
      return { ...s, members };
    });
  };

  const save = () => {
    const patch = {
      ...v,
      slug: v.slug?.trim() || v.name.trim().toLowerCase().replace(/\s+/g, "-"),
    };

    if (v.id) {
      updatePool?.(v.id, patch);
      onSaved?.(patch);
    } else if (createPool) {
      const id = createPool(patch);
      onSaved?.({ ...patch, id });
    } else {
      const id = `pol_${Date.now()}`;
      updatePool?.(id, { ...patch, id });
      onSaved?.({ ...patch, id });
    }
  };

  // Map selected codes -> option objects for the Autocomplete's value
  const selectedLangOptions = LANG_OPTIONS.filter((o) => newMember.languages.includes(o.code));

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        {v.id ? "Edit Pool" : "New Pool"}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Uniform layout via grid (size="small" everywhere) */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField
            size="small"
            label="Name"
            value={v.name}
            onChange={(e) => setV({ ...v, name: e.target.value })}
            fullWidth
            helperText=" "
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            size="small"
            label="Slug"
            value={v.slug}
            onChange={(e) => setV({ ...v, slug: e.target.value })}
            fullWidth
            helperText=" "
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            size="small"
            select
            label="Type"
            value={v.type}
            onChange={(e) => setV({ ...v, type: e.target.value })}
            fullWidth
            helperText=" "
          >
            <MenuItem value="round_robin">round_robin</MenuItem>
            <MenuItem value="collective">collective</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            size="small"
            select
            label="Distribution"
            value={v.distribution}
            onChange={(e) => setV({ ...v, distribution: e.target.value })}
            fullWidth
            helperText=" "
          >
            <MenuItem value="longest_idle">longest_idle</MenuItem>
            <MenuItem value="weighted">weighted</MenuItem>
            <MenuItem value="random">random</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            size="small"
            label="Timezone"
            value={v.timezone}
            onChange={(e) => setV({ ...v, timezone: e.target.value })}
            fullWidth
            helperText=" "
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Members */}
      <Stack gap={1.25}>
        <Typography variant="subtitle1">Members</Typography>

        {/* Empty state */}
        {(v.members || []).length === 0 && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: (t) => alpha(t.palette.primary.main, 0.03),
              borderColor: (t) => alpha(t.palette.primary.main, 0.25),
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Info size={18} />
              <Typography variant="body2" color="text.secondary">
                No members yet — add the first member using the form below, then press the ✓ button to save them.
              </Typography>
            </Stack>
          </Paper>
        )}

        {/* Existing members list as tidy cards */}
        <Stack gap={1}>
          {(v.members || []).map((m, i) => (
            <Paper
              key={`${m.userId}-${i}`}
              variant="outlined"
              sx={{
                p: 1.25,
                borderRadius: 2,
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={1.25} alignItems="center">
                <Chip size="small" color="success" label="Active" sx={{ minWidth: 80 }} />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  <strong>User:</strong> {m.userId}
                </Typography>
                <Typography variant="body2">
                  <strong>Weight:</strong> {m.weight ?? 1}
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {(m.languages || []).map((code) => (
                    <Chip key={code} size="small" label={`${code} (${LANG_MAP[code] || "Unknown"})`} />
                  ))}
                </Stack>
                <Tooltip title="Remove member">
                  <IconButton color="error" size="small" onClick={() => removeMemberAt(i)}>
                    <Trash2 size={18} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Paper>
          ))}
        </Stack>

        {/* Single inline add-member form (perfectly bottom-aligned with ✓) */}
        <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 2 }}>
          <Grid container spacing={1.25} alignItems="flex-end">
            <Grid item xs={12} md={4}>
              <TextField
                size="small"
                label="User ID"
                value={newMember.userId}
                onChange={(e) => setNewMember((s) => ({ ...s, userId: e.target.value }))}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={2.5}>
              <TextField
                size="small"
                label="Weight"
                type="number"
                value={newMember.weight}
                onChange={(e) =>
                  setNewMember((s) => ({ ...s, weight: Math.max(1, Number(e.target.value || 1)) }))
                }
                sx={numberInputSx}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4.5}>
              <Autocomplete
                multiple
                size="small"
                options={LANG_OPTIONS}
                value={selectedLangOptions}
                onChange={(_, val) =>
                  setNewMember((s) => ({ ...s, languages: val.map((o) => o.code) }))
                }
                disableCloseOnSelect
                getOptionLabel={(o) => `${o.code} (${o.label})`}
                renderInput={(params) => (
                  <TextField {...params} label="Languages" placeholder="Select language(s)" />
                )}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={1}>
              <Tooltip title="Add member">
                <IconButton
                  color="primary"
                  onClick={addMemberToList}
                  size="large"
                  sx={{
                    border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.35)}`,
                    borderRadius: 2,
                    width: "100%",
                    height: 40, // matches small TextField input height
                  }}
                >
                  <Check size={18} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>
      </Stack>

      {/* Bottom-right Save */}
      <Divider sx={{ my: 2 }} />
      <Stack direction="row" justifyContent="flex-end">
        <Button startIcon={<Save />} variant="contained" onClick={save} disabled={disabled}>
          Save
        </Button>
      </Stack>
    </Paper>
  );
}
