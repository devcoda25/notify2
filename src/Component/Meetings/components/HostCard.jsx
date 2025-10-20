// Path: src/Component/Meetings/components/HostCard.jsx
import React from "react";
import { Paper, Stack, Avatar, Typography, Chip, Divider, Box } from "@mui/material";
import { Mail, Globe, MapPin, Clock, Briefcase, Building2 } from "lucide-react";

/**
 * Portrait Host Card (clean)
 *
 * Props:
 * - profile: {
 *     name, email, organization, website, location, logoUrl,
 *     company?, title?
 *   }
 * - eventName: string
 * - durationMinutes: number
 */
export default function HostCard({ profile = {}, eventName, durationMinutes = 30 }) {
  const {
    name,
    email,
    organization,
    website,
    location,
    logoUrl,
    company: companyProp,
    title,
  } = profile;

  const company = companyProp || organization;

  const initials = (n = "") =>
    String(n)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || "")
      .join("");

  const MetaRow = ({ icon, children }) => (
    <Stack direction="row" alignItems="flex-start" gap={1}>
      <Box sx={{ mt: "2px" }}>{icon}</Box>
      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
        {children}
      </Typography>
    </Stack>
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        px: { xs: 1.75, sm: 2 },
        py: { xs: 2, sm: 2.25 },
        borderRadius: 2,
        width: "100%",
        boxShadow: (t) => `0 1px 0 ${t.palette.divider}`,
      }}
    >
      {/* Header: avatar + name */}
      <Stack alignItems="center" gap={1.25}>
        <Avatar
          src={logoUrl || undefined}
          alt={name || "Meeting Host"}
          sx={{
            width: 64,
            height: 64,
            fontSize: 20,
            bgcolor: (t) => t.palette.primary.light,
            boxShadow: (t) =>
              `0 0 0 2px ${t.palette.background.paper}, 0 0 0 3px ${t.palette.primary.main}`,
          }}
        >
          {!logoUrl && initials(name || "Meeting Host")}
        </Avatar>

        <Typography
          variant="h6"
          sx={{ fontWeight: 700, lineHeight: 1.2, textAlign: "center", width: "100%" }}
          noWrap={false}
        >
          {name || "Meeting Host"}
        </Typography>

        {/* Event + duration */}
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          sx={{ flexWrap: "wrap", justifyContent: "center", textAlign: "center" }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            title={eventName}
            sx={{ maxWidth: 360 }}
          >
            {eventName || "Event"}
          </Typography>
          <Chip
            size="small"
            icon={<Clock size={14} />}
            label={`${durationMinutes} min`}
            sx={{ height: 22, "& .MuiChip-label": { px: 0.75, fontSize: 12 } }}
          />
        </Stack>
      </Stack>

      <Divider sx={{ my: 1.5 }} />

      {/* Meta rows */}
      <Stack gap={1.0}>
        {title && <MetaRow icon={<Briefcase size={16} />}>{title}</MetaRow>}

        {(company || website) && (
          <MetaRow icon={<Building2 size={16} />}>
            {company}
            {company && website ? " • " : ""}
            {website}
          </MetaRow>
        )}

        {email && <MetaRow icon={<Mail size={16} />}>{email}</MetaRow>}

        {!company && website && <MetaRow icon={<Globe size={16} />}>{website}</MetaRow>}

        {location && <MetaRow icon={<MapPin size={16} />}>{location}</MetaRow>}
      </Stack>
    </Paper>
  );
}
