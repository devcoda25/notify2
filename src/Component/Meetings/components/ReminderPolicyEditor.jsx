// Path: /src/Component/Meetings/components/ReminderPolicyEditor.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Paper,
  FormControlLabel,
  Switch,
  Chip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Plus, Trash2, Save } from "lucide-react";
import { useReminderPoliciesStore } from "../../store/scheduling/useReminderPoliciesStore";

export default function ReminderPolicyEditor({ policyId, onSaved }) {
  const theme = useTheme();
  const { loadFixtures, loaded, getById, updatePolicy } = useReminderPoliciesStore();
  const policy = useMemo(() => (policyId ? getById(policyId) : null), [getById, policyId]);

  const [v, setV] = useState(
    policy || {
      id: "",
      name: "",
      appliesTo: { eventTypeIds: [] },
      channels: ["email"],
      steps: [{ offsetMinutes: -1440, channel: "email", template: "reminder_24h" }],
      reschedule: { enabled: true },
      cancellation: { enabled: true },
    }
  );

  useEffect(() => {
    if (!loaded) loadFixtures();
  }, [loaded, loadFixtures]);
  useEffect(() => {
    if (policy) setV(policy);
  }, [policy]);

  const addStep = () =>
    setV((s) => ({ ...s, steps: [...s.steps, { offsetMinutes: -60, channel: "email", template: "" }] }));

  const save = () => {
    updatePolicy(v.id, { ...v, updatedAt: new Date().toISOString() });
    onSaved?.(v);
  };

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
        Reminder Policy
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Stack gap={2}>
        <TextField
          label="Name"
          value={v.name}
          onChange={(e) => setV({ ...v, name: e.target.value })}
          fullWidth
          helperText="Display name for internal use"
        />
        <TextField
          label="Event Type IDs (comma)"
          value={(v.appliesTo?.eventTypeIds || []).join(",")}
          onChange={(e) =>
            setV({
              ...v,
              appliesTo: {
                eventTypeIds: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              },
            })
          }
          fullWidth
          helperText="Restrict this policy to specific event type IDs"
        />
        <TextField
          select
          label="Channels"
          value={v.channels}
          onChange={(e) =>
            setV({
              ...v,
              channels: typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value,
            })
          }
          SelectProps={{ multiple: true }}
          helperText="Delivery channels used by steps"
          sx={{ maxWidth: 420 }}
        >
          {["email", "sms", "whatsapp"].map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>

        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="subtitle1">Steps</Typography>
            <Button startIcon={<Plus />} onClick={addStep}>
              Add
            </Button>
          </Stack>

          <Stack gap={1}>
            {v.steps.map((st, i) => (
              <Paper key={i} variant="outlined" sx={{ p: 1, borderRadius: 2 }}>
                <Stack direction={{ xs: "column", md: "row" }} gap={1} alignItems="center">
                  <TextField
                    label="Offset (min)"
                    type="number"
                    value={st.offsetMinutes}
                    onChange={(e) => {
                      const steps = v.steps.slice();
                      steps[i] = { ...steps[i], offsetMinutes: Number(e.target.value || -60) };
                      setV({ ...v, steps });
                    }}
                    sx={{ width: 160 }}
                    helperText="Negative means before meeting"
                  />
                  <TextField
                    select
                    label="Channel"
                    value={st.channel}
                    onChange={(e) => {
                      const steps = v.steps.slice();
                      steps[i] = { ...steps[i], channel: e.target.value };
                      setV({ ...v, steps });
                    }}
                    sx={{ width: 180 }}
                  >
                    {["email", "sms", "whatsapp"].map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Template"
                    value={st.template}
                    onChange={(e) => {
                      const steps = v.steps.slice();
                      steps[i] = { ...steps[i], template: e.target.value };
                      setV({ ...v, steps });
                    }}
                    sx={{ minWidth: 260, flex: 1 }}
                    helperText="Provider template ID or code"
                  />
                  <IconButton
                    color="error"
                    onClick={() => {
                      const steps = v.steps.slice();
                      steps.splice(i, 1);
                      setV({ ...v, steps });
                    }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Paper>

        <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between">
          <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
            <FormControlLabel
              control={
                <Switch
                  checked={!!v.reschedule?.enabled}
                  onChange={(_, val) => setV({ ...v, reschedule: { ...(v.reschedule || {}), enabled: val } })}
                />
              }
              label="Reschedule enabled"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={!!v.cancellation?.enabled}
                  onChange={(_, val) => setV({ ...v, cancellation: { ...(v.cancellation || {}), enabled: val } })}
                />
              }
              label="Cancellation enabled"
            />
            <Chip
              size="small"
              label={`${v.steps.length} step${v.steps.length === 1 ? "" : "s"}`}
              sx={{ bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: "primary.main", fontWeight: 600 }}
            />
          </Stack>

          <Button startIcon={<Save />} variant="contained" onClick={save}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
