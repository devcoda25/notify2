// Path: src/Component/templates/modals/CloneTemplateModal.jsx
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, TextField, FormControlLabel, Checkbox, MenuItem, ListItemIcon
} from "@mui/material";
import CHANNELS from "../constants/CHANNELS";
import { Copy, Mail, MonitorSmartphone, Bell, MessageSquare, MessageCircle } from "lucide-react";

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

/**
 * Props:
 * - open: boolean
 * - sourceTemplate: { id, name, channel } | null
 * - onClose: () => void
 * - onConfirm: ({ name, targetChannel, copyVariants, copyTheme, copyMetadata }) => void
 */
export default function CloneTemplateModal({ open, sourceTemplate, onClose, onConfirm }) {
  const [name, setName] = React.useState("");
  const [targetChannel, setTargetChannel] = React.useState(sourceTemplate?.channel || "email");
  const [copyVariants, setCopyVariants] = React.useState(true);
  const [copyTheme, setCopyTheme] = React.useState(true);
  const [copyMetadata, setCopyMetadata] = React.useState(true);

  React.useEffect(() => {
    if (open) {
      setName(sourceTemplate ? `${sourceTemplate.name} (Copy)` : "");
      setTargetChannel(sourceTemplate?.channel || "email");
      setCopyVariants(true);
      setCopyTheme(true);
      setCopyMetadata(true);
    }
  }, [open, sourceTemplate]);

  const canConfirm = name.trim().length >= 2;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Copy size={18} /> Clone Template
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="New Template Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <TextField
            select
            label="Target Channel"
            value={targetChannel}
            onChange={(e) => setTargetChannel(e.target.value)}
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
          <FormControlLabel
            control={<Checkbox checked={copyVariants} onChange={(e) => setCopyVariants(e.target.checked)} />}
            label="Copy channel variants (content & buttons)"
          />
          <FormControlLabel
            control={<Checkbox checked={copyTheme} onChange={(e) => setCopyTheme(e.target.checked)} />}
            label="Copy theme and layout settings"
          />
          <FormControlLabel
            control={<Checkbox checked={copyMetadata} onChange={(e) => setCopyMetadata(e.target.checked)} />}
            label="Copy metadata (tags, locales, owner)"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<Copy size={16} />}
          disabled={!canConfirm}
          onClick={() =>
            onConfirm?.({
              name: name.trim(),
              targetChannel,
              copyVariants,
              copyTheme,
              copyMetadata,
            })
          }
        >
          Create Copy
        </Button>
      </DialogActions>
    </Dialog>
  );
}
