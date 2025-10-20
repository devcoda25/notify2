// Path: src/Pages/automations.jsx
import React from "react";
import {
  Box,
  Stack,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Tabs,
  Tab,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

// Section components (unchanged)
import DefaultAction from "../Component/Automation/DefaultAction";
import KeywordAction from "../Component/Automation/KeywordAction";
import Replymaterial from "../Component/Automation/Replymaterial";
import Routing from "../Component/Automation/Routing";
import Rules from "../Component/Automation/Rules";
import Sequence from "../Component/Automation/Sequence";
import Chatbots from "../Component/Automation/Chatbots";
import Whatsappflows from "../Component/Automation/Whatsappflows";
import FlowBuilder from "../Component/Automation/Chatbots/FlowBuilder";

// Tiny icon set from lucide-react (pure SVG, theme-colored by MUI)
import {
  Settings2,
  KeyRound,
  MessageSquareText,
  Route,
  Layers3,
  ListChecks,
  Bot,
  Workflow,
} from "lucide-react";

const SECTIONS = [
  { key: "defaultaction",  label: "Default Action",  Icon: Settings2,         comp: DefaultAction },
  { key: "keywordaction",  label: "Keyword Action",  Icon: KeyRound,          comp: KeywordAction },
  { key: "replymaterial",  label: "Reply Material",  Icon: MessageSquareText, comp: Replymaterial },
  { key: "routing",        label: "Routing",         Icon: Route,             comp: Routing },
  { key: "chatbots",       label: "Chatbots",        Icon: Bot,               comp: Chatbots },
  { key: "sequence",       label: "Sequence",        Icon: Layers3,           comp: Sequence },
  { key: "rules",          label: "Rules",           Icon: ListChecks,        comp: Rules },
  { key: "whatsappflows",  label: "Whatsapp Flows",  Icon: Workflow,          comp: Whatsappflows, badge: "New" },
];

export default function Automations() {
  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));

  // internal edit state (kept as-is)
  const [showEditChatbot, setShowEditChatbot] = React.useState(false);
  const handleEditChatbotbutton = () => setShowEditChatbot(true);

  // active section
  const [activeKey, setActiveKey] = React.useState("defaultaction");
  const activeIdx = Math.max(0, SECTIONS.findIndex((s) => s.key === activeKey));

  const ActiveComp = SECTIONS[activeIdx]?.comp || DefaultAction;

  // shared styles
  const railW = 232;
  const activeItemSx = {
    bgcolor: alpha(theme.palette.primary.main, 0.10),
    "& .MuiListItemText-primary": { color: theme.palette.primary.main, fontWeight: 600 },
    "& svg": { color: theme.palette.primary.main },
    borderRadius: 1.2,
  };

  const onPick = (key) => setActiveKey(key);

  if (showEditChatbot) {
    return <FlowBuilder />;
  }

  return (
    <Box sx={{ p: { xs: 1.5, md: 2 } }}>
      {/* xs: top Tabs; sm+: left rail  */}
      {isUpSm ? (
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {/* LEFT RAIL */}
          <Box
            sx={{
              width: railW,
              flexShrink: 0,
              borderRight: `1px solid ${theme.palette.divider}`,
              pr: 1.25,
            }}
          >
            <List dense disablePadding sx={{ py: 1 }}>
              {SECTIONS.map(({ key, label, Icon, badge }) => {
                const active = key === activeKey;
                return (
                  <ListItemButton
                    key={key}
                    onClick={() => onPick(key)}
                    sx={{
                      mb: 0.5,
                      borderRadius: 1.2,
                      ...(active ? activeItemSx : {
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.06),
                        },
                      }),
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 34 }}>
                      <Icon size={18} />
                    </ListItemIcon>
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                    {badge ? (
                      <Chip
                        size="small"
                        label={badge}
                        color="primary"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    ) : null}
                  </ListItemButton>
                );
              })}
            </List>
          </Box>

          {/* CONTENT */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <ActiveComp {...(activeKey === "chatbots" ? { handleEditChatbotbutton } : {})} />
          </Box>
        </Stack>
      ) : (
        // XS: TABS on top, content below (scrollable)
        <Box>
          <Tabs
            value={activeIdx}
            onChange={(_, idx) => onPick(SECTIONS[idx].key)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 1.25,
              "& .MuiTab-root": { minHeight: 44, textTransform: "none" },
            }}
          >
            {SECTIONS.map(({ label, badge, Icon }) => (
              <Tab
                key={label}
                iconPosition="start"
                icon={<Icon size={16} />}
                label={
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <span>{label}</span>
                    {badge ? <Chip size="small" label={badge} color="primary" /> : null}
                  </Stack>
                }
              />
            ))}
          </Tabs>

          <Divider sx={{ mb: 1.5 }} />

          <ActiveComp {...(activeKey === "chatbots" ? { handleEditChatbotbutton } : {})} />
        </Box>
      )}
    </Box>
  );
}
