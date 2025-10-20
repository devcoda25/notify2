// /src/Component/dailer/lead/LeadIdentityCard.jsx
import { Box, Grid, Typography, Stack } from "@mui/material";
import { BadgeCheck, Globe2, Info, User, Building2 } from "lucide-react";

const Row = ({ icon: Icon, label, value }) => (
  <Grid item xs={6} md={4}>
    <Stack direction="row" alignItems="center" gap={0.75}>
      <Icon size={14} />
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Stack>
    <Typography variant="body2" sx={{ mt: 0.25 }}>{value ?? "—"}</Typography>
  </Grid>
);

export default function LeadIdentityCard({ lead, embedded = false }) {
  if (!lead) return null;
  const Content = (
    <Box>
      <Typography variant="subtitle2" gutterBottom>Identity</Typography>
      <Grid container spacing={1.5}>
        <Row icon={User} label="Gender" value={lead.gender} />
        <Row icon={Info} label="Age" value={lead.ageYears ? `${lead.ageYears} Years` : "—"} />
        <Row icon={Globe2} label="Timezone" value={lead.timezone} />
        <Row icon={BadgeCheck} label="Lead ID" value={lead?.ids?.leadId} />
        <Row icon={BadgeCheck} label="CRM ID" value={lead?.ids?.crmId} />
      </Grid>
    </Box>
  );
  return embedded ? Content : <Box sx={{ p: 2 }}>{Content}</Box>;
}
