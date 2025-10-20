// /src/Component/contacts/drawers/ContactDetailsDrawer.jsx
import React from "react";
import {
  Box, Drawer, Stack, IconButton, Typography, Divider, Chip, Grid, Link, Tooltip, Button, Avatar
} from "@mui/material";
import {
  X, Pencil, Phone, PhoneCall, Trash2, Mail, Building2, Globe2, CalendarClock, MessageCircle,
  Smartphone, MonitorSmartphone, Languages as LanguagesIcon, BadgeCheck, MapPin,
  ShieldCheck, ShieldAlert, Timer, Medal, Link2, Users, Star, BarChart2, ClipboardList, Rocket
} from "lucide-react";

const Row = ({ icon: Icon, label, value }) => (
  <Stack direction="row" alignItems="center" gap={0.75}>
    <Icon size={14} />
    <Typography variant="caption" color="text.secondary">{label}:</Typography>
    <Typography variant="body2">{value ?? "—"}</Typography>
  </Stack>
);

const Tag = ({ label, color = "default", variant = "outlined" }) =>
  <Chip size="small" label={label} color={color} variant={variant} />;

const initials = (name = "") =>
  String(name).split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("") || "•";

export default function ContactDetailsDrawer({
  open,
  contact,
  onClose,
  onEdit,
  onDelete,
  onCall,
}) {
  if (!contact) return null;

  // ----- derived / fallbacks to match LeadProfileOverview -----
  const origin = contact._origin || "db";
  const headerNote = origin === "db"
    ? "Rich profile from your Contacts store."
    : "Preview from uploaded sheet — lighter but editable.";

  const phones = contact.phones || (contact.phone ? [{ label: "Mobile", e164: contact.phone, whatsapp: true }] : []);
  const opt = contact.optIn || {};
  const d = contact.devices || {};
  const s = contact.services || {};
  const engagement = contact.engagement || {};
  const location = [
    contact?.location?.city,
    contact?.location?.region,
    contact?.location?.country,
  ].filter(Boolean).join(", ");

  const joinedAt = contact.joinedAt || contact.createdAt;
  const lastActiveAt = contact.lastActiveAt || engagement.lastContactAt || contact.updatedAt;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: 360, sm: 520, md: 640 } } }}
    >
      {/* Header */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={1.25}>
            <Avatar sx={{ width: 40, height: 40, fontSize: 14 }}>
              {initials(contact?.name)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
                {contact?.name || "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {headerNote}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" gap={0.5} alignItems="center">
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onEdit?.(contact)} aria-label="Edit">
                <Pencil size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Call">
              <IconButton size="small" onClick={() => onCall?.(contact.id)} aria-label="Call">
                <PhoneCall size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => onDelete?.(contact.id)} aria-label="Delete">
                <Trash2 size={18} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      <Divider />

      {/* Body */}
      <Box sx={{ px: 2, py: 2 }}>
        {/* 1) CONTACT & PREFERENCES */}
        <Typography variant="overline" sx={{ letterSpacing: 0.4 }}>Contact & Preferences</Typography>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <Stack spacing={0.75}>
              {phones.length ? phones.map((p, i) => (
                <Stack key={`${p.e164 || i}-${i}`} direction="row" alignItems="center" gap={1}>
                  {(p.label || "").toLowerCase().includes("mobile") ? <Smartphone size={14} /> : <Phone size={14} />}
                  <Typography variant="body2">
                    {p.label ? `${p.label}: ` : ""}{p.e164 || "—"}
                  </Typography>
                </Stack>
              )) : <Row icon={Phone} label="Phone" value="—" />}

              {contact?.email ? (
                <Stack direction="row" alignItems="center" gap={1}>
                  <Mail size={14} />
                  <Link href={`mailto:${contact.email}`} underline="hover" variant="body2">
                    {contact.email}
                  </Link>
                </Stack>
              ) : (
                <Row icon={Mail} label="Email" value="—" />
              )}

              {!!contact?.languages?.length && (
                <Stack direction="row" alignItems="center" gap={0.75}>
                  <LanguagesIcon size={14} />
                  <Typography variant="body2">{contact.languages.join(", ")}</Typography>
                </Stack>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Preferences</Typography>
            <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.75 }}>
              {contact?.preferredChannel && (
                <Chip
                  size="small"
                  icon={<MessageCircle size={14} />}
                  label={`Preferred: ${contact.preferredChannel}`}
                  color="success"
                  variant="filled"
                />
              )}
              <Chip size="small" icon={<Mail size={14} />} label={`Email: ${opt.email ? "On" : "Off"}`} variant="outlined" />
              <Chip size="small" icon={<MessageCircle size={14} />} label={`SMS: ${opt.sms ? "On" : "Off"}`} variant="outlined" />
              <Chip size="small" icon={<MessageCircle size={14} />} label={`WhatsApp: ${opt.whatsapp ? "On" : "Off"}`} variant="outlined" />
              <Chip size="small" icon={<Phone size={14} />} label={`Calls: ${opt.calls ? "On" : "Off"}`} variant="outlined" />
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* 2) DEVICES & SERVICES */}
        <Typography variant="overline" sx={{ letterSpacing: 0.4 }}>Devices & Services</Typography>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Row icon={MonitorSmartphone} label="Devices" value={(d.all || []).join(" • ") || "—"} />
              <Typography variant="body2" color="text.secondary">
                Most Used: <strong>{d.mostUsed || "—"}</strong>
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={0.75}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Services Used</Typography>
              {(s.consumed?.length || s.mostUsed || s.newlyJoined?.length || s.rarelyUsed?.length || s.neverUsed?.length) ? (
                <>
                  {s.consumed?.length ? (
                    <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.75 }}>
                      {s.consumed.map((x) => <Tag key={`c-${x}`} label={x} />)}
                    </Stack>
                  ) : null}
                  <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.75 }}>
                    {s.mostUsed && <Tag label={s.mostUsed} color="primary" variant="filled" />}
                    {(s.newlyJoined || []).map((x) => <Tag key={`n-${x}`} label={x} color="success" />)}
                    {(s.rarelyUsed || []).map((x) => <Tag key={`r-${x}`} label={x} color="warning" />)}
                    {(s.neverUsed || []).map((x) => <Tag key={`nv-${x}`} label={x} color="default" />)}
                  </Stack>
                </>
              ) : <Typography variant="body2" color="text.secondary">No services yet.</Typography>}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* 3) IDENTITY & ACCOUNT */}
        <Typography variant="overline" sx={{ letterSpacing: 0.4 }}>Identity & Account</Typography>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <Stack spacing={0.75}>
              {/* Extra helpful fields */}
              <Row icon={BadgeCheck} label="Lead ID" value={contact?.ids?.leadId} />
              <Row icon={BadgeCheck} label="CRM ID" value={contact?.ids?.crmId} />
              <Row icon={Globe2} label="Timezone" value={contact?.timezone || "—"} />
              <Row icon={MapPin} label="Location" value={location || "—"} />
              <Row icon={CalendarClock} label="Joined" value={fmtDate(joinedAt)} />
              <Row icon={Timer} label="Last Active" value={fmtDateTime(lastActiveAt)} />
              {/* Keep your original created/updated too */}
              <Row icon={CalendarClock} label="Created" value={fmtDate(contact?.createdAt)} />
              <Row icon={CalendarClock} label="Updated" value={fmtDateTime(contact?.updatedAt)} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Account</Typography>
            <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.75 }}>
              {contact?.segmentTier && <Chip size="small" icon={<Medal size={14} />} label={`Tier: ${contact.segmentTier}`} color="primary" variant="outlined" />}
              {contact?.lifecycleStage && <Chip size="small" icon={<Rocket size={14} />} label={contact.lifecycleStage} variant="outlined" />}
              {typeof contact?.riskScore === "number" && (
                <Chip
                  size="small"
                  label={`Risk: ${riskLabel(contact.riskScore)}`}
                  color={riskColor(contact.riskScore)}
                  variant="outlined"
                />
              )}
              {contact?.kycStatus && (
                <Chip
                  size="small"
                  icon={contact.kycStatus === "verified" ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                  label={`KYC: ${contact.kycStatus}`}
                  color={contact.kycStatus === "verified" ? "success" : contact.kycStatus === "pending" ? "warning" : "error"}
                  variant="outlined"
                />
              )}
              {contact?.acquisition && <Chip size="small" icon={<Link2 size={14} />} label={`Source: ${contact.acquisition}`} variant="outlined" />}
              {contact?.referrer && <Chip size="small" icon={<Users size={14} />} label={`Referrer: ${contact.referrer}`} variant="outlined" />}
              {typeof contact?.csat === "number" && <Chip size="small" icon={<Star size={14} />} label={`CSAT ${contact.csat}/5`} variant="outlined" />}
              {contact?.preferredWindow && <Chip size="small" icon={<Timer size={14} />} label={`Contact: ${contact.preferredWindow}`} variant="outlined" />}
            </Stack>

            {/* Attributes (keep from your original) */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>Attributes</Typography>
            <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.75 }}>
              {(contact?.attributes || []).length
                ? contact.attributes.map((a, i) => (
                    <Chip key={`${a.key}-${i}`} size="small" variant="outlined" label={`${a.key}: ${a.value}`} />
                  ))
                : <Chip size="small" variant="outlined" label="No attributes" />}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* 4) ENGAGEMENT & HISTORY */}
        <Typography variant="overline" sx={{ letterSpacing: 0.4 }}>Engagement & History</Typography>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <Stack spacing={0.75}>
              <Row
                icon={BarChart2}
                label="Engagement Score"
                value={typeof engagement.score === "number" ? engagementLabel(engagement.score) : "—"}
              />
              <Row icon={MessageCircle} label="Recent Channel" value={engagement.lastChannel || "—"} />
              <Row icon={Phone} label="Last Contact" value={fmtDateTime(engagement.lastContactAt)} />
              <Row icon={ClipboardList} label="Appointments Missed" value={numOrZero(engagement.appointmentsMissed)} />
              <Row icon={ClipboardList} label="Support Cases" value={numOrZero(engagement.casesCount)} />
              <Row icon={Rocket} label="Last Campaign" value={engagement.campaign || "—"} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Feedback & Sentiment</Typography>
            <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.75 }}>
              {typeof engagement.csat === "number"
                ? <Chip size="small" icon={<Star size={14} />} label={`CSAT ${engagement.csat}/5`} variant="outlined" />
                : <Chip size="small" icon={<Star size={14} />} label="CSAT N/A" variant="outlined" />
              }
              {typeof engagement.nps === "number"
                ? <Chip size="small" icon={<Star size={14} />} label={`NPS ${engagement.nps}`} variant="outlined" />
                : <Chip size="small" icon={<Star size={14} />} label="NPS N/A" variant="outlined" />
              }
              {engagement.lastFeedback
                ? <Chip size="small" label={`Last: ${engagement.lastFeedback}`} variant="outlined" />
                : <Chip size="small" label="No recent feedback" variant="outlined" />
              }
              {!engagement.csat && !engagement.nps && !engagement.lastFeedback && (
                <Chip size="small" label="No engagement signals yet" variant="outlined" />
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
}

/* ------------------------------ helpers ------------------------------ */
function fmtDate(v) {
  if (!v) return "—";
  try { return new Date(v).toLocaleDateString(); } catch { return String(v); }
}
function fmtDateTime(v) {
  if (!v) return "—";
  try { return new Date(v).toLocaleString(); } catch { return String(v); }
}
function engagementLabel(score) {
  if (typeof score !== "number") return "—";
  return score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";
}
function riskLabel(score) {
  if (typeof score !== "number") return "—";
  return score >= 70 ? "High" : score >= 40 ? "Med" : "Low";
}
function riskColor(score) {
  if (typeof score !== "number") return "default";
  return score >= 70 ? "error" : score >= 40 ? "warning" : "success";
}
function numOrZero(v) {
  return typeof v === "number" ? String(v) : "0";
}
