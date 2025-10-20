import { useMemo, useState } from "react";
import { Card, CardHeader, CardContent, Tabs, Tab, Box } from "@mui/material";
import { useDialerStore } from "./store/useDialerStore";
import { LeadOverviewHeader } from "./lead";
import LeadProfileOverview from "./lead/LeadProfileOverview";
import LeadActivityPanel from "./lead/LeadActivityPanel";
import LeadNotificationsPanel from "./lead/LeadNotificationsPanel";
import { MessageSquare, IdCard, Bell } from "lucide-react";

export default function ServiceEngagementCard() {
  const { currentLead, leadDetails } = useDialerStore();
  const [tab, setTab] = useState(0);

  const mergedLead = useMemo(() => {
    const base = leadDetails || null;
    const patch = currentLead || null;
    if (!base && !patch) return null;
    if (!base) return patch;
    if (!patch) return base;
    const out = { ...base };
    for (const k of Object.keys(patch)) {
      const v = patch[k];
      out[k] = (v && typeof v === "object" && !Array.isArray(v)) ? { ...(base[k] || {}), ...v } : v;
    }
    return out;
  }, [leadDetails, currentLead]);

  if (!mergedLead) return null;

  const handleWhatsApp = () => {
    const phones = mergedLead.phones || (mergedLead.phone ? [{ e164: mergedLead.phone, whatsapp: true }] : []);
    const wa = phones.find((p) => p.whatsapp) || phones[0];
    if (!wa?.e164) return;
    const n = String(wa.e164).replace(/^\+/, "");
    window.open(`https://wa.me/${n}`, "_blank", "noopener,noreferrer");
  };
  const handleSchedule = () => {};
  const handleProfile = () => {};

  const Section = ({ children }) => (
    <Box sx={{ p: 2, borderRadius: 2, border: (t) => `1px solid ${t.palette.divider}` }}>{children}</Box>
  );

  return (
    <Card sx={{ borderRadius: 1, height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <CardHeader
        sx={{ pb: 1, pt: 1.25 }}
        title={
          <LeadOverviewHeader
            lead={mergedLead}
            onWhatsApp={handleWhatsApp}
            onSchedule={handleSchedule}
            onProfile={handleProfile}
            embedded
          />
        }
      />
      <CardContent sx={{ pt: 0, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ mb: 2, "& .MuiTab-root": { textTransform: "none", minHeight: 40 }, flexShrink: 0 }}
        >
          <Tab icon={<IdCard size={16} />} iconPosition="start" label="Profile & Usage" />
          <Tab icon={<MessageSquare size={16} />} iconPosition="start" label="Interactions" />
          <Tab icon={<Bell size={16} />} iconPosition="start" label="Notifications" />
        </Tabs>

        {/* body scrolls inside */}
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          {tab === 0 && (
            <Section>
              <LeadProfileOverview lead={mergedLead} />
            </Section>
          )}

          {tab === 1 && (
            <Section>
              <LeadActivityPanel lead={mergedLead} embedded />
            </Section>
          )}

          {tab === 2 && (
            <Section>
              <LeadNotificationsPanel lead={mergedLead} embedded pageSize={5} />
            </Section>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
