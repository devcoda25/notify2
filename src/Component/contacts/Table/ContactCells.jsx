import React from "react";
import { Avatar, Chip, Link, Stack, Tooltip, Typography } from "@mui/material";
import { Mail, MessageCircle, PhoneCall } from "lucide-react";

/* small helpers */
const initials = (name = "") =>
  String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "•";

const safeText = (v, dash = "—") => (v && String(v).trim().length ? String(v) : dash);

const pill = (label, color = "default", variant = "outlined") => (
  <Chip size="small" label={label} color={color} variant={variant} />
);

const ContactCells = {
  /* Name + (optional) company line) */
  Name({ value, subtitle, avatarName }) {
    return (
      <Stack direction="row" alignItems="center" gap={1.25}>
        <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>{initials(avatarName || value)}</Avatar>
        <Stack spacing={0} className="min-w-0">
          <Typography noWrap variant="body2">{safeText(value)}</Typography>
          {subtitle ? (
            <Typography noWrap variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    );
  },

  /* Phone with tiny channel hints */
  Phone({ value, whatsapp, iso }) {
    const v = safeText(value);
    return (
      <Stack direction="row" alignItems="center" gap={0.75}>
        <PhoneCall size={14} />
        <Typography variant="body2">{v}</Typography>
        {whatsapp ? (
          <Tooltip title="WhatsApp">
            <MessageCircle size={14} />
          </Tooltip>
        ) : null}
        {iso ? pill(iso, "default", "outlined") : null}
      </Stack>
    );
  },

  /* Email link (mailto) */
  Email({ value }) {
    const v = safeText(value);
    if (!value) return <Typography variant="body2" color="text.secondary">{v}</Typography>;
    return (
      <Stack direction="row" alignItems="center" gap={0.75}>
        <Mail size={14} />
        <Link href={`mailto:${value}`} underline="hover" variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {value}
        </Link>
      </Stack>
    );
  },

  /* Plain text with optional muted dash */
  Text({ value, mutedIfEmpty = false }) {
    const empty = !value || String(value).trim() === "";
    return (
      <Typography variant="body2" color={empty && mutedIfEmpty ? "text.secondary" : "text.primary"}>
        {empty ? "—" : String(value)}
      </Typography>
    );
  },

  /* Source chip — tint slightly based on origin (db/upload) via color scheme */
  Source({ value, origin }) {
    const label = safeText(value);
    const color = origin === "upload" ? "default" : "primary";
    const variant = origin === "upload" ? "outlined" : "filled";
    return pill(label, color, variant);
  },

  /* Compact attributes (show up to 2, then +N) */
  Attributes({ value }) {
    const arr = Array.isArray(value) ? value.filter(Boolean) : [];
    const shown = arr.slice(0, 2);
    const rest = arr.length - shown.length;
    return (
      <Stack direction="row" alignItems="center" flexWrap="wrap" className="gap-1">
        {shown.map((a, i) => (
          <Chip key={`${a.key}-${i}`} size="small" variant="outlined" label={`${a.key}: ${a.value}`} />
        ))}
        {rest > 0 ? <Chip size="small" variant="outlined" label={`+${rest}`} /> : null}
      </Stack>
    );
  },
};

export default ContactCells;
