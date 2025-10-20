// Path: /src/Component/Meetings/views/Systems/SecurityRetentionView.jsx
import React, { useState } from "react";
import {
  Stack,
  Typography,
  Divider,
  Paper,
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  Chip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { ShieldCheck, Save } from "lucide-react";

export default function SecurityRetentionView() {
  const theme = useTheme();
  const [v, setV] = useState({
    retentionDays: 90,
    redactInviteePII: true,
    maskEmailsInLogs: true,
    contentHashing: false,
    exportFormat: "jsonl", // jsonl|csv
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    // client-only: pretend saved to server
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="h6">Security & Retention</Typography>
          <Chip
            size="small"
            icon={<ShieldCheck size={14} />}
            label="Org policy"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.main,
            }}
          />
        </Stack>
      </Stack>
      <Divider />

      {saved && <Alert severity="success">Saved</Alert>}

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          borderColor: theme.palette.divider,
          bgcolor: "background.paper",
        }}
      >
        <Stack direction="row" gap={2} flexWrap="wrap">
          <TextField
            label="Retention (days)"
            type="number"
            value={v.retentionDays}
            onChange={(e) => setV({ ...v, retentionDays: Number(e.target.value || 0) })}
            sx={{ width: 240 }}
            helperText="How long to retain meeting metadata & logs"
          />
          <TextField
            select
            label="Export format"
            value={v.exportFormat}
            onChange={(e) => setV({ ...v, exportFormat: e.target.value })}
            sx={{ width: 240 }}
            helperText="Default format for manual exports"
          >
            <MenuItem value="jsonl">JSONL</MenuItem>
            <MenuItem value="csv">CSV</MenuItem>
          </TextField>
        </Stack>

        <FormGroup sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={v.redactInviteePII}
                onChange={(_, checked) => setV({ ...v, redactInviteePII: checked })}
              />
            }
            label="Redact invitee PII in exports"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={v.maskEmailsInLogs}
                onChange={(_, checked) => setV({ ...v, maskEmailsInLogs: checked })}
              />
            }
            label="Mask emails in logs"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={v.contentHashing}
                onChange={(_, checked) => setV({ ...v, contentHashing: checked })}
              />
            }
            label="Hash content at rest (mock)"
          />
        </FormGroup>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button startIcon={<Save />} variant="contained" onClick={save}>
            Save
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
