// Path: src/Component/templates/modals/ChooseChannelModal.jsx
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  List, ListItemButton, ListItemIcon, ListItemText, Divider, TextField, MenuItem
} from "@mui/material";
import CHANNELS from "../constants/CHANNELS";
import TEMPLATE_TYPES from "../constants/TEMPLATE_TYPES";
import {
  Mail, MonitorSmartphone, Bell, MessageSquare, MessageCircle,
  Layers, CheckCircle2
} from "lucide-react";

/**
 * Props:
 * - open: boolean
 * - initialChannel?: string
 * - initialType?: string
 * - onClose: () => void
 * - onChoose: ({ channel, type }) => void
 */
const channelIconFor = (id) => {
  switch (id) {
    case "email": return Mail;
    case "platform": return MonitorSmartphone;
    case "push": return Bell;
    case "sms": return MessageSquare;
    case "whatsapp": return MessageCircle;
    default: return Layers;
  }
};

export default function ChooseChannelModal({
  open,
  initialChannel = "email",
  initialType = Object.values(TEMPLATE_TYPES)[0]?.id || "utility",
  onClose,
  onChoose,
}) {
  const [sel, setSel] = React.useState(initialChannel);
  const [type, setType] = React.useState(initialType);

  React.useEffect(() => {
    if (open) {
      setSel(initialChannel);
      setType(initialType);
    }
  }, [open, initialChannel, initialType]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Layers size={18} /> Choose Channel & Type
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          select
          fullWidth
          label="Template Category"
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{ mb: 2 }}
        >
          {Object.values(TEMPLATE_TYPES).map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.label}
            </MenuItem>
          ))}
        </TextField>

        <Divider sx={{ mb: 1 }} />
        <List dense>
          {CHANNELS.map((ch) => {
            const Icon = channelIconFor(ch.id);
            const selected = sel === ch.id;
            return (
              <ListItemButton
                key={ch.id}
                selected={selected}
                onClick={() => setSel(ch.id)}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Icon size={18} />
                </ListItemIcon>
                <ListItemText
                  primary={ch.label}
                  secondary={ch.description || ch.id}
                />
                {selected && <CheckCircle2 size={16} />}
              </ListItemButton>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onChoose?.({ channel: sel, type })}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
