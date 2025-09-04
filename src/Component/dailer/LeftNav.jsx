import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Box, List, ListSubheader, ListItemButton, ListItemIcon, ListItemText, Divider, Tooltip, IconButton,
} from "@mui/material";
import {
  PhoneCall, LayoutDashboard, Users, User, Headphones, BarChart2, ClipboardList, ListChecks,
  FolderOpen, MonitorDot, Settings, Shield, FileText, FileCog, Radio, Map, Bell,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { hoverScroll } from "./hoverScroll";

// widths
const NAV_WIDTH_EXPANDED = 230;
const NAV_WIDTH_COLLAPSED = 68;

const TOP_H_MOBILE = 56;   // same as your navbar (mobile)
const TOP_H_DESKTOP = 64;  // same as your navbar (desktop)

function NavItem({ to, icon: Icon, label, collapsed }) {
  return (
    <ListItemButton
      component={NavLink}
      to={to}
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

export default function LeftNav() {
  const { authUser } = useParams();
  const base = `/u/${authUser}/dialer`;

  // persistent collapse state (localStorage so it sticks across reloads)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("dialer_nav_collapsed") === "1";
    } catch {
      return false;
    }
  });

  // expose width via CSS var so content can auto-pad without prop drilling
  const navWidth = collapsed ? NAV_WIDTH_COLLAPSED : NAV_WIDTH_EXPANDED;
  useEffect(() => {
    document.documentElement.style.setProperty("--nav-w", `${navWidth}px`);
    try {
      localStorage.setItem("dialer_nav_collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed, navWidth]);

  const sections = useMemo(() => ([
    {
      title: "Desk",
      items: [
        { to: `${base}`, icon: PhoneCall, label: "Dialer" },
        { to: `${base}/queue`, icon: ClipboardList, label: "Queue" },
        { to: `${base}/dispositions`, icon: ListChecks, label: "Dispositions" },
        { to: `${base}/performance`, icon: BarChart2, label: "QA" },
      ],
    },
    {
      title: "Focus",
      items: [
        { to: `${base}/focus/vip`, icon: Users, label: "VIP Desk" },
        { to: `${base}/focus/escalations`, icon: MonitorDot, label: "Escalations" },
        { to: `${base}/focus/callbacks`, icon: Bell, label: "Callbacks" },
        { to: `${base}/focus/appointments`, icon: ClipboardList, label: "Appointments" },
      ],
    },
    {
      title: "Review",
      items: [
        { to: `${base}/review/monitors`, icon: MonitorDot, label: "Monitors" },
        { to: `${base}/review/scorecards`, icon: ListChecks, label: "Scorecards" },
        { to: `${base}/review/calibration`, icon: FileCog, label: "Calibration" },
        { to: `${base}/review/disputes`, icon: Shield, label: "Disputes" },
      ],
    },
    {
      title: "Backline",
      items: [
        { to: `${base}/backline/scripts`, icon: FileCog, label: "Call Scripts" },
        { to: `${base}/backline/cases`, icon: FolderOpen, label: "Cases" },
        { to: `${base}/backline/tickets`, icon: ClipboardList, label: "Tickets" },
        { to: `${base}/backline/workorders`, icon: FileText, label: "Work Orders" },
      ],
    },
    {
      title: "Overwatch",
      items: [
        { to: `${base}/overwatch/wallboard`, icon: LayoutDashboard, label: "Wallboard" },
        { to: `${base}/overwatch/staffing`, icon: Users, label: "Staffing" },
        { to: `${base}/overwatch/routing`, icon: Map, label: "Routing" },
        { to: `${base}/overwatch/playbooks`, icon: FileText, label: "Playbooks" },
      ],
    },
    {
      title: "Command",
      items: [
        { to: `${base}/dashboard`, icon: LayoutDashboard, label: "Dashboard" },
        { to: `${base}/campaigns`, icon: MonitorDot, label: "Campaigns" },
        { to: `${base}/leads`, icon: FolderOpen, label: "Leads" },
        { to: `${base}/team`, icon: Users, label: "Teams" },
        { to: `${base}/agents`, icon: User, label: "Agents" },
        { to: `${base}/settings/rbac`, icon: Shield, label: "Access Control" },
      ],
    },
    {
      title: "Chronicle",
      items: [
        { to: `${base}/logs/cdrs`, icon: FileText, label: "CDRs" },
        { to: `${base}/logs/recordings`, icon: Headphones, label: "Recordings" },
        { to: `${base}/logs/audit`, icon: FileCog, label: "Audit Trail" },
      ],
    },
    {
      title: "Systems",
      items: [
        { to: `${base}/settings/trunks`, icon: Radio, label: "SIP Trunks" },
        { to: `${base}/settings/fs`, icon: MonitorDot, label: "FreeSWITCH" },
        { to: `${base}/settings/regions`, icon: Map, label: "FS Nodes" },
        { to: `${base}/settings/app`, icon: Settings, label: "App Config" },
      ],
    },
    {
      title: "Bulletin",
      items: [
        { to: `${base}/bulletin/alerts`, icon: Bell, label: "Alerts" },
        { to: `${base}/bulletin/announcements`, icon: FileText, label: "Announcements" },
      ],
    },
  ]), [base]);

  return (
    <Box
      id="dialer-leftnav"
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
