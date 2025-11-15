// /src/Component/Navbar/Navbar.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Stack,
  ButtonBase,
  Typography,
  Chip,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { NavLink, useLocation, useParams } from "react-router-dom";

// Global store only
import { useUserStore } from "../../auth/user.store";

// Presentational header (far right)
import UserPresenceHeader from "./UserPresenceHeader";

// assets
import logo from "../Assets/img/Notify_login_logo.svg";
import TeaminboxImg from "../Assets/img/Team-inbox.png";
import MeetingImg from "../Assets/img/Meeting.png";
import BroadcastImg from "../Assets/img/Broadcast.png";
import ContactImg from "../Assets/img/Contacts.png";
import AutomationImg from "../Assets/img/Automations.png";
import AnalyticsImg from "../Assets/img/Analytics.png";
import ReportsImg from "../Assets/img/Reports.png";
import ClickImg from "../Assets/img/click.png";
import UserImg from "../Assets/img/friends.png";

const NAVBAR_H_DESKTOP = 64;
const NAVBAR_H_MOBILE = 56;

const TAB_SPACING = 1.25;
const ACTIVE_PURPLE = "#7C3AED";

/** ---- Overflow-aware tabs row with hidden measuring row ---- */
function OverflowTabs({ items }) {
  const theme = useTheme();
  const location = useLocation();

  const containerRef = React.useRef(null);
  const measureRef = React.useRef(null);
  const moreMeasureRef = React.useRef(null);

  const [visibleCount, setVisibleCount] = React.useState(items.length);

  const [moreEl, setMoreEl] = React.useState(null);
  const moreOpen = Boolean(moreEl);
  const openMore = (e) => setMoreEl(e.currentTarget);
  const closeMore = () => setMoreEl(null);

  const linkSx = (active) => ({
    px: 1,
    py: 0.75,
    gap: 1,
    alignItems: "center",
    borderRadius: theme.shape.borderRadius,
    color: active ? ACTIVE_PURPLE : theme.palette.text.secondary,
    textDecoration: "none",
    whiteSpace: "nowrap",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.06),
      ...(active ? { color: ACTIVE_PURPLE } : { color: theme.palette.text.primary }),
    },
    ...(active && {
      backgroundColor: alpha(ACTIVE_PURPLE, 0.1),
      boxShadow: `inset 0 0 0 1px ${alpha(ACTIVE_PURPLE, 0.28)}`,
    }),
  });

  const recalc = React.useCallback(() => {
    const host = containerRef.current;
    const meas = measureRef.current;
    const moreBtn = moreMeasureRef.current;
    if (!host || !meas) return;

    const hostWidth = host.clientWidth;
    if (hostWidth <= 0) return;

    const children = Array.from(meas.querySelectorAll("[data-tab-measure='1']"));
    const widths = children.map((el) => el.offsetWidth || 0);
    const moreW = moreBtn ? moreBtn.offsetWidth || 60 : 60;

    let used = 0;
    let fits = 0;
    for (let i = 0; i < widths.length; i += 1) {
      const w = widths[i];
      const remaining = widths.length - (i + 1);
      const reserve = remaining > 0 ? moreW : 0;
      if (used + w + reserve <= hostWidth) {
        used += w;
        fits = i + 1;
      } else {
        break;
      }
    }
    setVisibleCount(Math.max(1, fits));
  }, []);

  React.useEffect(() => {
    recalc();
    const obs = new ResizeObserver(recalc);
    if (containerRef.current) obs.observe(containerRef.current);
    obs.observe(document.body);
    return () => obs.disconnect();
  }, [recalc]);

  React.useEffect(() => {
    recalc();
  }, [items, location.pathname, recalc]);

  const visible = items.slice(0, visibleCount);
  const overflow = items.slice(visibleCount);

  return (
    <Box sx={{ position: "relative", minWidth: 0 }}>
      {/* Visible row */}
      <Stack direction="row" alignItems="center" spacing={TAB_SPACING} sx={{ minWidth: 0 }} ref={containerRef}>
        <Stack direction="row" alignItems="center" spacing={TAB_SPACING} sx={{ overflow: "hidden", minWidth: 0, flex: 1 }}>
          {visible.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ButtonBase
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={linkSx(active)}
              >
                <Box component="img" src={item.icon} alt="" sx={{ width: 18, height: 18, flexShrink: 0 }} />
                <Typography variant="body2" noWrap>{item.label}</Typography>
                {active ? (
                  <Chip
                    size="small"
                    label=" "
                    sx={{
                      ml: 0.25,
                      width: 6,
                      height: 6,
                      p: 0,
                      borderRadius: "50%",
                      bgcolor: ACTIVE_PURPLE,
                    }}
                  />
                ) : null}
              </ButtonBase>
            );
          })}
        </Stack>

        {overflow.length > 0 && (
          <>
            <ButtonBase
              onClick={openMore}
              sx={{
                px: 1,
                py: 0.75,
                borderRadius: theme.shape.borderRadius,
                color: theme.palette.text.secondary,
                "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.06) },
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <Typography variant="body2">More</Typography>
            </ButtonBase>

            <Menu
              open={moreOpen}
              anchorEl={moreEl}
              onClose={closeMore}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{ paper: { sx: { minWidth: 220 } } }}
            >
              {overflow.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <MenuItem
                    key={item.path}
                    component={NavLink}
                    to={item.path}
                    onClick={closeMore}
                    sx={{ gap: 1, ...(active && { color: ACTIVE_PURPLE, fontWeight: 600 }) }}
                  >
                    <Box component="img" src={item.icon} alt="" sx={{ width: 18, height: 18 }} />
                    {item.label}
                  </MenuItem>
                );
              })}
            </Menu>
          </>
        )}
      </Stack>

      {/* Hidden measuring row */}
      <Stack
        direction="row"
        spacing={TAB_SPACING}
        ref={measureRef}
        sx={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
          height: 0,
        }}
      >
        {items.map((item) => (
          <ButtonBase data-tab-measure="1" key={`measure-${item.path}`} sx={linkSx(false)}>
            <Box component="img" src={item.icon} alt="" sx={{ width: 18, height: 18, flexShrink: 0 }} />
            <Typography variant="body2" noWrap>{item.label}</Typography>
          </ButtonBase>
        ))}
        <ButtonBase ref={moreMeasureRef} sx={linkSx(false)}>
          <Typography variant="body2">More</Typography>
        </ButtonBase>
      </Stack>
    </Box>
  );
}

/** ---- Main navbar ---- */
export default function Navbar() {
  const theme = useTheme();
  const location = useLocation();
  const { authUser: routeAuthUser } = useParams();

  // Read only from the store
  const currentUser = useUserStore((s) => s.currentUser);
  const stats = useUserStore((s) => s.getStats());
  const presencePending = useUserStore((s) => s.presencePending);
  const isHydratedFromAuth = useUserStore((s) => s.isHydratedFromAuth); // NEW
  const setAvail = useUserStore((s) => s.setAvailability);
  const startBreak = useUserStore((s) => s.startBreak);
  const endBreak = useUserStore((s) => s.endBreak);
  const resetUser = useUserStore((s) => s.resetUser);

  const authUser = React.useMemo(() => {
    if (routeAuthUser) return routeAuthUser;
    const match = location.pathname.match(/\/u\/([^/]+)/);
    return match ? match[1] : "0";
  }, [routeAuthUser, location.pathname]);

  const menuItems = React.useMemo(
    () => [
      { path: `/u/${authUser}/teaminbox`, label: "Team Inbox", icon: TeaminboxImg },
      { path: `/u/${authUser}/dialer`, label: "Dialer", icon: ClickImg },
      { path: `/u/${authUser}/meetings`, label: "Meetings", icon: MeetingImg },
      { path: `/u/${authUser}/templates`, label: "Templates", icon: BroadcastImg },
      { path: `/u/${authUser}/contacts`, label: "Contacts", icon: ContactImg },
      { path: `/u/${authUser}/automations`, label: "Automations", icon: AutomationImg },
      { path: `/u/${authUser}/analytics`, label: "Analytics", icon: AnalyticsImg },
      { path: `/u/${authUser}/reports`, label: "Reports", icon: ReportsImg },
      { path: `/u/${authUser}/userManagement`, label: "User Management", icon: UserImg },
    ],
    [authUser]
  );

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        height: { xs: NAVBAR_H_MOBILE, md: NAVBAR_H_DESKTOP },
        borderBottom: `1px solid ${theme.palette.divider}`,
        justifyContent: "center",
        bgcolor: "background.paper",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "unset",
          height: "100%",
          px: { xs: 1, md: 2 },
          gap: 1,
        }}
      >
        {/* 1) Brand */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 1 }}>
          <Box component="img" src={logo} alt="Notify" sx={{ width: 40, height: 40 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.1 }}>
            Notify
          </Typography>
        </Stack>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* 2) Tabs */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <OverflowTabs items={menuItems} />
        </Box>

        {/* 3) Far right: unified header fully wired to the store */}
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ ml: 1 }}>
          <UserPresenceHeader
            user={currentUser}
            stats={stats}
            pending={Boolean(presencePending)}
            onChangeAvailability={(next) => { try { setAvail(next); } catch { } }}
            onBreakSelect={(key) => {
              try { key === "end" ? endBreak() : startBreak(key); }
              catch (e) { console.warn("[Navbar] break toggle failed", e); }
            }}
            onLogout={() => {
              try {
                resetUser();
                // window.location.href = "/login";
              } catch (e) {
                console.warn("[Navbar] logout failed", e);
              }
            }}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
