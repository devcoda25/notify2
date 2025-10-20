// /src/Component/dailer/DispositionPanel.jsx
import {
  Card,
  CardContent,
  Stack,
  MenuItem,
  TextField,
  Button,
  Chip,
  Autocomplete,
  Typography,
  Box,
} from "@mui/material";
import { Tag as TagIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useDialerStore } from "../store/useDialerStore";

const TYPE_OPTIONS = ["normal", "escalated", "conference", "dropped", "client hangup", "transferred"];
const RESULT_OPTIONS = [
  "Connected - Qualified",
  "Connected - Not Interested",
  "Left Voicemail",
  "No Answer / Busy",
  "Schedule Follow-up",
  "Resolved",
  "Transferred to Sales",
];

function msToSec(ms) { return Math.max(0, Math.round((ms || 0) / 1000)); }
function suggestResult(sec) {
  if (sec < 10) return "No Answer / Busy";
  if (sec < 30) return "Left Voicemail";
  if (sec < 90) return "Connected - Not Interested";
  return "Connected - Qualified";
}

export default function DispositionPanel() {
  const st = useDialerStore();
  const {
    saveDisposition,
    acwSecondsLeft,
    callStatus,
    callStartedAt,
    direction,
    conferenceActive,
    consultLegs,
  } = st;

  const durationSec = useMemo(() => {
    if (!callStartedAt) return 0;
    const now = Date.now();
    return msToSec(now - callStartedAt);
  }, [callStartedAt]);

  // form state
  const [type, setType] = useState("normal");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(suggestResult(durationSec));
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState([]);
  const [followUpAt, setFollowUpAt] = useState("");
  const [touched, setTouched] = useState(false);

  const missing = useMemo(
    () => ({ type: !type, result: !result, title: !title.trim() }),
    [type, result, title]
  );
  const canSave = !missing.type && !missing.result && !missing.title;

  const onSave = () => {
    setTouched(true);
    if (!canSave) return;

    const payload = {
      id: `n_${Date.now()}`,
      title: title.trim(),
      text: notes || "",
      at: new Date().toISOString(),
      type,
      direction: direction || null,
      durationSec,
      conference: !!(conferenceActive || (consultLegs && consultLegs.length > 0)),
      participants: null,
      outcome: result || null,
      followUpAt: followUpAt || null,
      tags,
      agent: st?.currentAgent?.name || st?.agentName || null,
    };

    saveDisposition(payload);

    // reset form
    setTitle(""); setNotes(""); setTags([]); setFollowUpAt("");
    setType("normal"); setResult(suggestResult(durationSec)); setTouched(false);
  };

  const inAcw = callStatus === "acw" || acwSecondsLeft > 0;

  return (
    <Card
      sx={{
        mt: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <CardContent
        sx={{
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          minHeight: 0,
          // IMPORTANT: allow floating labels to render fully
          overflow: "visible",
        }}
      >
        {/* Top row — responsive sizes, wrap cleanly on small screens */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            minWidth: 0,
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <TextField
            select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            onBlur={() => setTouched(true)}
            size="small"
            margin="dense"
            required
            error={touched && missing.type}
            helperText={touched && missing.type ? "Type is required" : undefined}
            FormHelperTextProps={{ sx: { m: 0 } }}
            // No squeezing: grows but won't go below 180px; on xs it can take full width
            sx={{
              flex: "1 1 220px",
              minWidth: 180,
            }}
          >
            {TYPE_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Call Result"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            onBlur={() => setTouched(true)}
            size="small"
            margin="dense"
            required
            error={touched && missing.result}
            helperText={touched && missing.result ? "Call Result is required" : undefined}
            FormHelperTextProps={{ sx: { m: 0 } }}
            // Wider by default; wraps beneath Type on very small widths
            sx={{
              flex: "2 1 320px",
              minWidth: 220,
            }}
          >
            {RESULT_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </Stack>

        <TextField
          label="Summary"
          placeholder="Summarise the call"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched(true)}
          fullWidth
          required
          error={touched && missing.title}
          helperText={touched && missing.title ? "Summary is required" : undefined}
          FormHelperTextProps={{ sx: { m: 0 } }}
          size="small"
          margin="dense"
        />

        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={tags}
          onChange={(_, v) => setTags(v)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                size="small"
                icon={<TagIcon size={14} />}
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              margin="dense"
              label="Call & Client behavior"
              placeholder="Give a checklist about the call"
            />
          )}
        />

        <TextField
          label="Call Notes"
          multiline
          minRows={8}              // ← a little more height
          maxRows={20}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add the context, steps taken, education provided, and any commitments made…"
          size="small"
          margin="dense"
          variant="outlined"
        />

        {/* Metrics + Submit on the same row */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ flexWrap: "wrap", mt: 0.5 }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", minWidth: 0, flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Direction: <b>{direction || "—"}</b>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Duration: <b>{durationSec ? `${Math.floor(durationSec / 60)}m ${durationSec % 60}s` : "—"}</b>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Mode: <b>{conferenceActive || (consultLegs && consultLegs.length > 0) ? "Conference" : "1:1"}</b>
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={onSave}
            disabled={!canSave}
            sx={{ textTransform: "none", ml: "auto" }}
            size="small"
          >
            Submit
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
