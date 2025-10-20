// Path: src/Component/templates/utils/UsageSummary.jsx

import React from "react";
import { Box, Stack, Typography, LinearProgress, Chip, alpha, useTheme } from "@mui/material";
import { Trophy, Star, Mail, Bell, MessageSquare, MessageCircle, MonitorSmartphone } from "lucide-react";
import CHANNELS from "../constants/CHANNELS";

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
 * items: Array<{ id, name, channel, sends, ctr, failures }>
 */
export default function UsageSummary({ items = [] }) {
  const t = useTheme();
  const total = items.reduce((a, b) => a + (b.sends || 0), 0) || 1;

  if (!items.length) {
    return (
      <Box sx={{ p: 2, textAlign: "center", color: "text.secondary", bgcolor: alpha(t.palette.primary.main, 0.02), borderRadius: 1 }}>
        No usage data available.
      </Box>
    );
  }

  return (
    <Stack spacing={1.25}>
      {items.slice(0, 8).map((it, idx) => {
        const share = Math.round(((it.sends || 0) / total) * 100);
        const Icon = channelIconFor(it.channel);
        return (
          <Box
            key={it.id}
            sx={{
              p: 1,
              borderRadius: 1,
              border: `1px solid ${alpha(t.palette.divider, 1)}`,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" label={`#${idx + 1}`} />
              <Icon size={14} />
              <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 600 }}>
                {it.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">{(it.sends || 0).toLocaleString()} sends</Typography>
              {idx === 0 && <Star size={14} style={{ marginLeft: 6 }} />}
            </Stack>
            <LinearProgress
              variant="determinate"
              value={share}
              sx={{
                mt: 0.75,
                height: 6,
                borderRadius: 999,
                backgroundColor: alpha(t.palette.primary.main, 0.1),
                "& .MuiLinearProgress-bar": { backgroundColor: t.palette.primary.main },
              }}
            />
            <Stack direction="row" spacing={2} sx={{ mt: 0.5 }} alignItems="center">
              <Typography variant="caption" color="text.secondary">{share}% of period</Typography>
              <Typography variant="caption">CTR: {it.ctr ?? "—"}</Typography>
              <Typography variant="caption">Failures: {it.failures ?? "—"}</Typography>
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}
