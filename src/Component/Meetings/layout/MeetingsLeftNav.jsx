// Path: /src/Component/Meetings/layout/MeetingsLeftNav.jsx
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Box, List, ListSubheader, ListItemButton, ListItemIcon, ListItemText, Divider, Tooltip, IconButton,
} from "@mui/material";
import {
  LayoutGrid, Crosshair, ClipboardList, Settings2, Wrench, BookOpen,
  CalendarDays, Video, UserCheck, Users, Star, RotateCcw, Film,
  Gauge, FileEdit, Shield, ServerCog, BellRing, FileSearch,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { hoverScroll } from "../../dailer/hoverScroll";

// widths (same behavior as your dialer nav)
const NAV_WIDTH_EXPANDED = 230;
const NAV_WIDTH_COLLAPSED = 68;

// top offsets (match your top navbar heights)
const TOP_H_MOBILE = 56;
const TOP_H_DESKTOP = 64;

/** Build meetings sections just like the dialer’s `sections` */
const getMeetingsSections = (base) => ([
  {
    title: "Desk",
    items: [
      { to: `${base}/desk/my`, icon: CalendarDays, label: "My Meetings" },
      { to: `${base}/desk/join`, icon: Video, label: "Join Now" },
      { to: `${base}/desk/attendance`, icon: UserCheck, label: "My Attendance" },
    ],
  },
  {
    title: "Focus",
    items: [
      { to: `${base}/focus/pools`, icon: Users, label: "Pool Schedules" },
      { to: `${base}/focus/special`, icon: Star, label: "Special Meetings" },
      { to: `${base}/focus/followups`, icon: RotateCcw, label: "Follow-ups" },
    ],
  },
  {
    title: "Review",
    items: [
      { to: `${base}/review/recordings`, icon: Film, label: "Recordings" },
      { to: `${base}/review/scorecards`, icon: FileEdit, label: "Scorecards" },
      { to: `${base}/review/calibration`, icon: Gauge, label: "Calibration" },
      { to: `${base}/review/disputes`, icon: FileSearch, label: "Disputes" },
    ],
  },
  {
    title: "Organize",
    items: [
      { to: `${base}/organize/wizard`, icon: CalendarDays, label: "Create Meeting" },
      { to: `${base}/organize/event-types`, icon: ClipboardList, label: "Event Types" },
      { to: `${base}/organize/pools`, icon: Users, label: "Agent Pools" },
      { to: `${base}/organize/availability`, icon: Crosshair, label: "Availability & Routing" },
    ],
  },
  {
    title: "My Setup",
    items: [
      { to: `${base}/my/calendar`, icon: CalendarDays, label: "Calendar Connections" },
      { to: `${base}/my/email`, icon: BellRing, label: "Email Pairing" },
      { to: `${base}/my/preferences`, icon: Video, label: "Preferences • Devices" },
      { to: `${base}/my/personal`, icon: Users, label: "Personal Link & Pools" },
    ],
  },
  {
    title: "Systems",
    items: [
      { to: `${base}/systems/calendar`, icon: CalendarDays, label: "Calendar Integrations" },
      { to: `${base}/systems/conferencing`, icon: ServerCog, label: "Conferencing Nodes" },
      { to: `${base}/systems/reminders`, icon: BellRing, label: "Reminder Policies" },
      { to: `${base}/systems/security`, icon: Shield, label: "Security & Retention" },
    ],
  },
  {
    title: "Chronicle",
    items: [
      { to: `${base}/chronicle/bookings`, icon: ClipboardList, label: "Booking Logs" },
      { to: `${base}/chronicle/audit`, icon: FileSearch, label: "Audit Trail" },
    ],
  },
]);

function NavItem({ to, icon: Icon, label, collapsed }) {
  return (
    <ListItemButton
      component={NavLink}
      to={to}
      className={({ isActive }) => (isActive ? "active" : undefined)}
      sx={{
        px: collapsed ? 1 : 2,
        py: 1,
        borderRadius: 1.5,
        justifyContent: collapsed ? "center" : "flex-start",
        "& .MuiListItemIcon-root": { minWidth: collapsed ? "auto" : 28 },
        "&.active": (t) => ({
          bgcolor: t.palette.action.selected,
          color: t.palette.primary.main,
          "& .MuiListItemIcon-root": { color: t.palette.primary.main },
        }),
      }}
    >
      <ListItemIcon sx={{ ...(collapsed ? { mr: 0 } : {}) }}>
        <Icon size={18} />
      </ListItemIcon>
      {!collapsed && (
        <ListItemText
          primary={label}
          primaryTypographyProps={{ variant: "body2", noWrap: true }}
        />
      )}
    </ListItemButton>
  );
}

export default function MeetingsLeftNav() {
  const { authUser } = useParams();
  const base = `/u/${encodeURIComponent(authUser || "default")}/meetings`;

  // persistent collapse (same LS pattern as dialer)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("meetings_nav_collapsed") === "1";
    } catch {
      return false;
    }
  });

  // expose width via CSS var so pages can pad accordingly
  const navWidth = collapsed ? NAV_WIDTH_COLLAPSED : NAV_WIDTH_EXPANDED;
  useEffect(() => {
    document.documentElement.style.setProperty("--nav-w", `${navWidth}px`);
    try {
      localStorage.setItem("meetings_nav_collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed, navWidth]);

  const sections = useMemo(() => getMeetingsSections(base), [base]);

  return (
    <Box
      id="meetings-leftnav"
      tabIndex={0}
      sx={{
        position: "fixed",
        left: 0,
        top: { xs: TOP_H_MOBILE, md: TOP_H_DESKTOP },
        height: {
          xs: `calc(100vh - ${TOP_H_MOBILE}px)`,
          md: `calc(100vh - ${TOP_H_DESKTOP}px)`,
        },
        width: `${navWidth}px`,
        minWidth: `${navWidth}px`,
        flexShrink: 0,
        borderRight: (t) => `1px solid ${t.palette.divider}`,
        bgcolor: "background.paper",
        p: 1,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        zIndex: 2,
        ...hoverScroll,
      }}
    >
      {/* header with collapse toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          mb: 1,
          px: collapsed ? 0 : 1,
        }}
      >
        {!collapsed && (
          <Box sx={{ typography: "subtitle2", opacity: 0.8 }}>Navigation</Box>
        )}
        <IconButton
          size="small"
          onClick={() => setCollapsed((v) => !v)}
          sx={{ ml: collapsed ? 0 : 1 }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </IconButton>
      </Box>

      {/* sections */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        {sections.map((sec, idx) => (
          <Box key={sec.title} sx={{ mb: 1.5 }}>
            {!collapsed && (
              <List
                dense
                subheader={
                  <ListSubheader
                    component="div"
                    disableSticky
                    sx={{ bgcolor: "transparent", px: 1, py: 0.5, typography: "overline" }}
                  >
                    {sec.title}
                  </ListSubheader>
                }
                sx={{ p: 0 }}
              >
                {sec.items.map((it) => (
                  <Tooltip key={it.to} title={it.label} arrow placement="right">
                    <Box>
                      <NavItem to={it.to} icon={it.icon} label={it.label} collapsed={collapsed} />
                    </Box>
                  </Tooltip>
                ))}
              </List>
            )}

            {collapsed && (
              <List dense sx={{ p: 0 }}>
                {sec.items.map((it) => (
                  <Tooltip key={it.to} title={it.label} arrow placement="right">
                    <Box>
                      <NavItem to={it.to} icon={it.icon} label={it.label} collapsed />
                    </Box>
                  </Tooltip>
                ))}
              </List>
            )}

            {idx < sections.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
