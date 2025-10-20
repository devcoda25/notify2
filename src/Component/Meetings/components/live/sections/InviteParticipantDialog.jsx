import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, TextField, Stack, Button, InputAdornment, Typography
} from "@mui/material";
import { Mail, Phone, Send } from "lucide-react";

export default function InviteParticipantDialog({
  open,
  onClose = () => {},
  onInvite = () => {},
}) {
  const [tab, setTab] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const canSend =
    (tab === "email" && /\S+@\S+\.\S+/.test(email)) ||
    (tab === "phone" && phone.replace(/\D/g, "").length >= 8);

  const handleSend = () => {
    const payload =
      tab === "email"
        ? { via: "email", email, name }
        : { via: "phone", phone, name };
    onInvite(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="invite-title">
      <DialogTitle id="invite-title">Invite participant</DialogTitle>
      <DialogContent dividers>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab value="email" icon={<Mail size={14} />} label="Email" />
          <Tab value="phone" icon={<Phone size={14} />} label="Phone" />
        </Tabs>

        <Stack gap={1.25}>
          <TextField
            label="Display name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {tab === "email" ? (
            <TextField
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={14} />
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <TextField
              label="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+256700123456"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone size={14} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Typography variant="caption" color="text.secondary">
            We’ll send a one-time invite link for this meeting.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSend} variant="contained" disabled={!canSend} endIcon={<Send size={14} />}>
          Send invite
        </Button>
      </DialogActions>
    </Dialog>
  );
}
