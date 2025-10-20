// Path: src/Component/templates/modals/TestSendModal.jsx
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, TextField, MenuItem, Alert, Tabs, Tab, Box, ListItemIcon
} from "@mui/material";
import CHANNELS from "../constants/CHANNELS";
import {
  Send, Mail, MonitorSmartphone, Bell, MessageSquare, MessageCircle,
  Wand2, Braces
} from "lucide-react";

/**
 * Props:
 * - open: boolean
 * - template: { id, name } | null
 * - defaultChannel?: string
 * - onClose: () => void
 * - onSendTest: ({ channel, destination, subjectOverride, variables }) => void
 */
const channelIconFor = (id) => {
  switch (id) {
    case "email": return Mail;
    case "platform": return MonitorSmartphone;
    case "push": return Bell;
    case "sms": return MessageSquare;
    case "whatsapp": return MessageCircle;
    default: return MonitorSmartphone;
  }
};

export default function TestSendModal({
  open,
  template,
  defaultChannel = "email",
  onClose,
  onSendTest,
}) {
  const [channel, setChannel] = React.useState(defaultChannel);
  const [destination, setDestination] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [varsTab, setVarsTab] = React.useState(0); // 0 = Quick, 1 = JSON
  const [variablesJSON, setVariablesJSON] = React.useState("{\n  \"user_name\": \"Ada\"\n}");

  React.useEffect(() => {
    if (open) {
      setChannel(defaultChannel);
      setDestination("");
      setSubject("");
      setVarsTab(0);
      setVariablesJSON("{\n  \"user_name\": \"Ada\"\n}");
    }
  }, [open, defaultChannel]);

  const parseVariables = () => {
    if (varsTab === 1) {
      try {
        const v = JSON.parse(variablesJSON || "{}");
        return v && typeof v === "object" ? v : {};
      } catch {
        return "__JSON_ERROR__";
      }
    }
    try {
      const v = JSON.parse(variablesJSON || "{}");
      return v && typeof v === "object" ? v : {};
    } catch {
      return {};
    }
  };

  const varsParsed = parseVariables();
  const jsonError = varsParsed === "__JSON_ERROR__";
  const canSend = !!template && !!destination && !jsonError;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Send size={18} /> Send Test • {template?.name || "Template"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            select
            label="Channel"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            {CHANNELS.map((c) => {
              const Icon = channelIconFor(c.id);
              return (
                <MenuItem key={c.id} value={c.id}>
                  <ListItemIcon sx={{ minWidth: 28 }}><Icon size={16} /></ListItemIcon>
                  {c.label}
                </MenuItem>
              );
            })}
          </TextField>

          <TextField
            label={`Destination`}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={
              channel === "email" ? "name@example.com" : channel === "sms" ? "+2567..." : "recipient"
            }
          />

          {channel === "email" && (
            <TextField
              label="Subject override (optional)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          )}

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={varsTab} onChange={(_, v) => setVarsTab(v)}>
              <Tab icon={<Wand2 size={14} />} iconPosition="start" label="Quick" />
              <Tab icon={<Braces size={14} />} iconPosition="start" label="JSON" />
            </Tabs>
          </Box>

          {varsTab === 1 ? (
            <TextField
              label="Variables (JSON)"
              value={variablesJSON}
              onChange={(e) => setVariablesJSON(e.target.value)}
              multiline
              minRows={6}
              error={jsonError}
              helperText={jsonError ? "Invalid JSON" : "Inject variables into the template preview"}
            />
          ) : (
            <TextField
              label="Variables (Quick editor)"
              value={variablesJSON}
              onChange={(e) => setVariablesJSON(e.target.value)}
              multiline
              minRows={4}
              helperText="For now this mirrors JSON. Replace with key/value fields later."
            />
          )}

          {jsonError && (
            <Alert severity="error">Variables JSON is invalid.</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          startIcon={<Send size={16} />}
          disabled={!canSend}
          onClick={() =>
            onSendTest?.({
              channel,
              destination: destination.trim(),
              subjectOverride: subject.trim() || null,
              variables: jsonError ? {} : varsParsed,
            })
          }
        >
          Send Test
        </Button>
      </DialogActions>
    </Dialog>
  );
}
