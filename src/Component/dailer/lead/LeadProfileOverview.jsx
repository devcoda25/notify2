// /src/Component/dailer/lead/LeadProfileOverview.jsx
import { Box, Grid, Stack, Typography, Chip, Divider, Link } from "@mui/material";
import {
  Phone, Smartphone, Mail, MessageCircle, MonitorSmartphone, Rocket,
  Languages as LanguagesIcon, BadgeCheck, Globe2, CalendarClock, MapPin,
  ShieldCheck, ShieldAlert, Timer, Medal, Link2, Users, Star, BarChart2, ClipboardList
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

export default function LeadProfileOverview({ lead }) {
  if (!lead) return null;
  const d = lead.devices || {};
  const s = lead.services || {};
  const opt = lead.optIn || {};
  const engagement = lead.engagement || {};
  const phones = lead.phones || (lead.phone ? [{ label: "Mobile", e164: lead.phone, whatsapp: true }] : []);
  const location = [
    lead?.location?.city,
    lead?.location?.region,
    lead?.location?.country
  ].filter(Boolean).join(", ");

  return (
    <Box>
      {/* 1) CONTACT & PREFERENCES */}
      <Typography variant="overline" sx={{ letterSpacing: 0.4 }}>Contact & Preferences</Typography>
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={6}>
          <Stack spacing={0.75}>
            {phones.map((p, i) => (
              <Stack key={`${p.e164 || i}-${i}`} direction="row" alignItems="center" gap={1}>
                {(p.label || "").toLowerCase().includes("mobile") ? <Smartphone size={14} /> : <Phone size={14} />}
                <Typography variant="body2">{p.label ? `${p.label}: ` : ""}{p.e164 || "—"}</Typography>
              </Stack>
            ))}
            {lead.email && (
              <Stack direction="row" alignItems="center" gap={1}>
                <Mail size={14} />
                <Link href={`mailto:${lead.email}`} underline="hover" variant="body2">{lead.email}</Link>
              </Stack>
            )}
            {!!lead.languages?.length && (
              <Stack direction="row" alignItems="center" gap={0.75}>
                <LanguagesIcon size={14} />
                <Typography variant="body2">{lead.languages.join(", ")}</Typography>
              </Stack>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>Preferences</Typography>
          <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.75 }}>
            {lead.preferredChannel && (
              <Chip size="small" icon={<MessageCircle size={14} />} label={`Preferred: ${lead.preferredChannel}`} color="success" variant="filled" />
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
            <Row icon={BadgeCheck} label="Lead ID" value={lead?.ids?.leadId} />
            <Row icon={BadgeCheck} label="CRM ID" value={lead?.ids?.crmId} />
            <Row icon={Globe2} label="Timezone" value={lead?.timezone} />
            <Row icon={MapPin} label="Location" value={location || "—"} />
            <Row icon={CalendarClock} label="Joined" value={lead?.joinedAt ? new Date(lead.joinedAt).toLocaleDateString() : "—"} />
            <Row icon={Timer} label="Last Active" value={lead?.lastActiveAt ? new Date(lead.lastActiveAt).toLocaleString() : "—"} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>Account</Typography>
          <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.75 }}>
            {lead?.segmentTier && <Chip size="small" icon={<Medal size={14} />} label={`Tier: ${lead.segmentTier}`} color="primary" variant="outlined" />}
            {lead?.lifecycleStage && <Chip size="small" icon={<Rocket size={14} />} label={lead.lifecycleStage} variant="outlined" />}
            {typeof lead?.riskScore === "number" && (
              <Chip
                size="small"
                label={`Risk: ${lead.riskScore >= 70 ? "High" : lead.riskScore >= 40 ? "Med" : "Low"}`}
                color={lead.riskScore >= 70 ? "error" : lead.riskScore >= 40 ? "warning" : "success"}
                variant="outlined"
              />
            )}
            {lead?.kycStatus && (
              <Chip
                size="small"
                icon={lead.kycStatus === "verified" ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                label={`KYC: ${lead.kycStatus}`}
                color={lead.kycStatus === "verified" ? "success" : lead.kycStatus === "pending" ? "warning" : "error"}
                variant="outlined"
              />
            )}
            {lead?.acquisition && <Chip size="small" icon={<Link2 size={14} />} label={`Source: ${lead.acquisition}`} variant="outlined" />}
            {lead?.referrer && <Chip size="small" icon={<Users size={14} />} label={`Referrer: ${lead.referrer}`} variant="outlined" />}
            {typeof lead?.csat === "number" && <Chip size="small" icon={<Star size={14} />} label={`CSAT ${lead.csat}/5`} variant="outlined" />}
            {lead?.preferredWindow && <Chip size="small" icon={<Timer size={14} />} label={`Contact: ${lead.preferredWindow}`} variant="outlined" />}
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
              value={
                typeof engagement.score === "number"
                  ? (engagement.score >= 70 ? "High" : engagement.score >= 40 ? "Medium" : "Low")
                  : "—"
              }
            />
            <Row
              icon={MessageCircle}
              label="Recent Channel"
              value={engagement.lastChannel || "—"}
            />
            <Row
              icon={Phone}
              label="Last Contact"
              value={engagement.lastContactAt ? new Date(engagement.lastContactAt).toLocaleString() : "—"}
            />
            <Row
              icon={ClipboardList}
              label="Appointments Missed"
              value={typeof engagement.appointmentsMissed === "number" ? engagement.appointmentsMissed : "0"}
            />
            <Row
              icon={ClipboardList}
              label="Support Cases"
              value={typeof engagement.casesCount === "number" ? engagement.casesCount : "0"}
            />
            <Row
              icon={Rocket}
              label="Last Campaign"
              value={engagement.campaign || "—"}
            />
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
            {/* Always show at least one highlight so it's never visually empty */}
            {!engagement.csat && !engagement.nps && !engagement.lastFeedback && (
              <Chip size="small" label="No engagement signals yet" variant="outlined" />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
