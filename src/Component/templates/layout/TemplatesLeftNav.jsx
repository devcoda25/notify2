// Path: src/Component/templates/layout/TemplatesLeftNav.jsx
import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

import CHANNELS from "../constants/CHANNELS";
import useTemplatesStore from "../store/useTemplatesStore";

// lucide icons
import {
  Mail,
  MonitorSmartphone,
  Bell,
  MessageSquare,
  MessageCircle,
  LayoutList,
  ShieldCheck,
} from "lucide-react";

const NAV = {
  ALL: "all",
  APPROVALS: "approvals",
  THEMES: "themes",
  STATS: "stats",
  SETTINGS: "settings",
};

const channelIconFor = (id) => {
  switch (id) {
    case "email":
      return Mail;
    case "platform":
      return MonitorSmartphone;
    case "push":
      return Bell;
    case "sms":
      return MessageSquare;
    case "whatsapp":
      return MessageCircle;
    default:
      return LayoutList;
  }
};

function ChannelRow({ ch, selected, count, onClick }) {
  const Icon = channelIconFor(ch.id);
  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      sx={{
        borderRadius: 1.5,
        mb: 0.5,
        "&.Mui-selected": (t) => ({
          backgroundColor: alpha(t.palette.primary.main, 0.08),
          "&:hover": { backgroundColor: alpha(t.palette.primary.main, 0.14) },
        }),
      }}
    >
      <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
        <Icon size={18} />
      </ListItemIcon>
      <ListItemText primary={ch.label} />
      <Chip size="small" label={count} />
    </ListItemButton>
  );
}

export default function TemplatesLeftNav({ currentView, selectedChannel, onNavigate }) {
  const { templates, totalCount, listForChannel } = useTemplatesStore((s) => ({
    templates: s.templates,
    totalCount: s.totalCount,
    listForChannel: s.listForChannel,
  }));

  const total = totalCount || templates?.length || 0;
  const pendingApprovals = (templates || []).filter(
    (t) => ["Submitted", "In-Review", "Rejected"].includes(t.status)
  ).length;

  return (
    <Box sx={{ p: 1.5 }}>
      <Typography variant="h6" sx={{ px: 1, pb: 1 }}>
        Templates
      </Typography>

      <List
        dense
        subheader={<ListSubheader component="div">Overview</ListSubheader>}
        sx={{ mb: 1 }}
      >
        <ListItemButton
          selected={currentView === NAV.ALL}
          onClick={() => onNavigate?.(NAV.ALL, "all")}
          sx={{ borderRadius: 1.5, mb: 0.5 }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
            <LayoutList size={18} />
          </ListItemIcon>
          <ListItemText primary="All Templates" />
          <Chip size="small" label={total} />
        </ListItemButton>

        <ListItemButton
          selected={currentView === NAV.APPROVALS}
          onClick={() => onNavigate?.(NAV.APPROVALS)}
          sx={{ borderRadius: 1.5, mb: 0.5 }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
            <ShieldCheck size={18} />
          </ListItemIcon>
          <ListItemText primary="Approvals Center" />
          <Chip size="small" color={pendingApprovals ? "warning" : "default"} label={pendingApprovals} />
        </ListItemButton>
      </List>

      <Divider sx={{ my: 1 }} />

      <List
        dense
        subheader={<ListSubheader component="div">Channels</ListSubheader>}
        sx={{ mb: 1 }}
      >
        {CHANNELS.map((ch) => (
          <ChannelRow
            key={ch.id}
            ch={ch}
            selected={currentView === "channel" && selectedChannel === ch.id}
            count={listForChannel(ch.id).length}
            onClick={() => onNavigate?.("channel", ch.id)}
          />
        ))}
      </List>

    </Box>
  );
}
