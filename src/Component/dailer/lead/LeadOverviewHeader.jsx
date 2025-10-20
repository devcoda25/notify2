// /src/Component/dailer/lead/LeadOverviewHeader.jsx
import {
  Box, Chip, Avatar, Stack, Typography, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Button, Badge
} from "@mui/material";
import { MessageCircle, CalendarClock, UserRound, Languages as LanguagesIcon, Phone, Smartphone, Mail } from "lucide-react";
import { useMemo, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function LeadOverviewHeader({ lead, onWhatsApp, onSchedule, onProfile, embedded = false }) {
  const [open, setOpen] = useState(false);
  const [when, setWhen] = useState(null);
  const [note, setNote] = useState("");

  const statusMeta = useMemo(() => {
    const tag = (lead?.statusTag || "").toLowerCase();
    if (!tag) return { ring: (t) => t.palette.divider, label: null, chipColor: "default" };
    if (tag.includes("hot")) return { ring: (t) => t.palette.warning.main, label: "HOT", chipColor: "warning" };
    if (tag.includes("vip")) return { ring: (t) => t.palette.success.main, label: "VIP", chipColor: "success" };
    if (tag.includes("cold")) return { ring: (t) => t.palette.grey[500], label: "COLD", chipColor: "default" };
    return { ring: (t) => t.palette.primary.main, label: tag.toUpperCase(), chipColor: "primary" };
  }, [lead?.statusTag]);

  const designation = useMemo(() => {
    const parts = [lead?.honorific || lead?.salutation || lead?.title || lead?.designation].filter(Boolean);
    return parts.length ? parts[0] : null;
  }, [lead]);

  const phones = useMemo(
    () => lead?.phones || (lead?.phone ? [{ label: "Mobile", e164: lead.phone, whatsapp: true }] : []),
    [lead]
  );
  const primaryPhone = phones[0];
  const languages = Array.isArray(lead?.languages) ? lead.languages : (lead?.language ? [lead.language] : []);

  if (!lead) return null;

  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setWhen(null); setNote(""); };
  const handleSave = () => {
    onSchedule?.({ when: when ? when.toISOString() : null, note, leadId: lead?.ids?.leadId || lead?.leadId || null });
    handleClose();
  };

  const content = (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <Stack direction="row" alignItems="center" gap={1.75} minWidth={0}>
          {/* Avatar with status ring + tiny badge */}
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={statusMeta.label ? (
              <Box sx={{
                px: 0.5, py: 0.25, borderRadius: 1, fontSize: 10, lineHeight: 1,
                bgcolor: (t) => t.palette[statusMeta.chipColor]?.main || t.palette.grey[500], color: "white", boxShadow: 1
              }}>{statusMeta.label}</Box>
            ) : null}
          >
            <Box sx={{
              width: 64, height: 64, borderRadius: "50%", p: 0.5, border: "2px solid",
              borderColor: statusMeta.ring, boxShadow: (t) => `0 0 0 3px ${t.palette.background.paper}`,
              display: "flex", alignItems: "center", justifyContent: "center", bgcolor: (t) => t.palette.background.paper
            }}>
              <Avatar src={lead.avatar} alt={lead.name} sx={{ width: 56, height: 56 }} />
            </Box>
          </Badge>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap>
              {designation ? `${designation} ${lead.name}` : lead.name}
            </Typography>

            {/* Company • Languages • Primary contact (compact, no duplication with tab) */}
            <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 0.25, flexWrap: "wrap", rowGap: 0.5 }}>
              
              {!!languages.length && (
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <LanguagesIcon size={14} />
                  <Typography variant="caption" color="text.secondary" noWrap title={languages.join(", ")}>
                    {languages.join(", ")}
                  </Typography>
                </Stack>
              )}
              {primaryPhone && (
                <Stack direction="row" alignItems="center" gap={0.5}>
                  {(primaryPhone.label || "").toLowerCase().includes("mobile") ? <Smartphone size={14}/> : <Phone size={14}/>}
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {primaryPhone.e164}
                  </Typography>
                </Stack>
              )}
              {lead.email && (
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <Mail size={14} />
                  <Typography variant="caption" color="text.secondary" noWrap>{lead.email}</Typography>
                </Stack>
              )}
            </Stack>
          </Box>

          {lead.followUpAt && (
            <Chip size="small" variant="outlined" color="info" label={`Follow-up ${new Date(lead.followUpAt).toLocaleString()}`} sx={{ ml: 0.5 }} />
          )}
        </Stack>

        {/* Actions */}
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Tooltip title="View Contact" arrow>
            <IconButton size="small" onClick={onProfile} aria-label="View Contact"><UserRound size={18} /></IconButton>
          </Tooltip>
          <Tooltip title="Chat" arrow>
            <IconButton size="small" onClick={onWhatsApp} aria-label="Send Message" color="success"><MessageCircle size={18} /></IconButton>
          </Tooltip>
          <Tooltip title="Schedule Follow-Up" arrow>
            <IconButton size="small" onClick={handleOpen} aria-label="Schedule follow-up" color="primary">
              <CalendarClock size={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Follow-up dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Schedule Follow-Up</DialogTitle>
        <DialogContent dividers>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={1.5}>
              <DateTimePicker
                label="When"
                value={when}
                onChange={(v) => setWhen(v)}
                disablePast
                minutesStep={5}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
              <TextField
                label="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What should we do next?"
                fullWidth size="small" multiline minRows={2}
              />
            </Stack>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!when}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  return embedded ? content : <Box sx={{ p: 1.5 }}>{content}</Box>;
}
