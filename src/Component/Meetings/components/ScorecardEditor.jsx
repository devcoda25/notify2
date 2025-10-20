// Path: /src/Component/Meetings/components/ScorecardEditor.jsx
import React, { useMemo, useState } from "react";
import { Stack, Typography, Divider, TextField, Rating, Button, Chip, Paper } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Save } from "lucide-react";

export default function ScorecardEditor({ defaultValue, onSave }) {
  const theme = useTheme();
  const [v, setV] = useState(defaultValue || {
    clarity: 3,
    value: 3,
    demoQuality: 3,
    notes: "",
  });

  const avg = useMemo(() => {
    const n = 3;
    return Math.round(((v.clarity + v.value + v.demoQuality) / n) * 10) / 10;
  }, [v]);

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
      <Stack gap={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Scorecard</Typography>
          <Chip
            label={`Avg ${avg.toFixed(1)}/5`}
            sx={{
              bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
              color: "primary.main",
              fontWeight: 700,
            }}
          />
        </Stack>
        <Divider />

        <Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems="center">
          <Typography sx={{ minWidth: 160 }}>Clarity</Typography>
          <Rating value={v.clarity} onChange={(_, val) => setV({ ...v, clarity: val || 0 })} />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems="center">
          <Typography sx={{ minWidth: 160 }}>Value</Typography>
          <Rating value={v.value} onChange={(_, val) => setV({ ...v, value: val || 0 })} />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems="center">
          <Typography sx={{ minWidth: 160 }}>Demo Quality</Typography>
          <Rating value={v.demoQuality} onChange={(_, val) => setV({ ...v, demoQuality: val || 0 })} />
        </Stack>

        <TextField
          label="Notes"
          value={v.notes}
          onChange={(e) => setV({ ...v, notes: e.target.value })}
          minRows={3}
          multiline
          fullWidth
        />

        <Stack direction="row" justifyContent="flex-end">
          <Button startIcon={<Save />} variant="contained" onClick={() => onSave?.(v)}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
