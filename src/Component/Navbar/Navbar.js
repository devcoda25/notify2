// Path: src/Component/Navbar/Navbar.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Stack,
  IconButton,
  ButtonBase,
  Typography,
  Chip,
  Popover,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { IoMdPerson } from "react-icons/io";

// assets
import logo from "../Assets/img/Notify_login_logo.svg";
import TeaminboxImg from "../Assets/img/Team-inbox.png";
import MeetingImg from "../Assets/img/Meeting.png";
import BroadcastImg from "../Assets/img/Broadcast.png";
import ContactImg from "../Assets/img/Contacts.png";
import AutomationImg from "../Assets/img/Automations.png";
import AnalyticsImg from "../Assets/img/Analytics.png";
import ReportsImg from "../Assets/img/Reports.png";
import WalletImg from "../Assets/img/Wallet.png";
import ClockImg from "../Assets/img/clock-square.png";
import ClickImg from "../Assets/img/click.png";
import UserImg from "../Assets/img/friends.png";

const NAVBAR_H_DESKTOP = 64;
const NAVBAR_H_MOBILE = 56;

// ——— Tweaks ———
const TAB_SPACING = 1.25;           // more space between tabs
const ACTIVE_PURPLE = "#7C3AED";    // active tab font color

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

    // Collect widths for every item from the measuring row (always mounted)
    const children = Array.from(meas.querySelectorAll("[data-tab-measure='1']"));
    const widths = children.map((el) => el.offsetWidth || 0);

    // Width of the “More” trigger (from hidden sample)
    const moreW = moreBtn ? moreBtn.offsetWidth || 60 : 60;

    let used = 0;
    let fits = 0;
    for (let i = 0; i < widths.length; i += 1) {
      const w = widths[i];
      const remaining = widths.length - (i + 1);
      const reserve = remaining > 0 ? moreW : 0; // if more remain, reserve space for More
      if (used + w + reserve <= hostWidth) {
        used += w;
        fits = i + 1;
      } else {
        break;
      }
    }

    // Guarantee at least one tab visible
    setVisibleCount(Math.max(1, fits));
  }, []);

  // Recalc on resize and when items/path change (font changes can also shift widths)
  React.useEffect(() => {
    recalc();
    const obs = new ResizeObserver(recalc);
    if (containerRef.current) obs.observe(containerRef.current);
    // also observe the body to catch global layout shifts
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
                <Typography variant="body2" noWrap>
                  {item.label}
                </Typography>
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
                    sx={{
                      gap: 1,
                      ...(active && { color: ACTIVE_PURPLE, fontWeight: 600 }),
                    }}
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

      {/* Hidden measuring row (does not affect layout) */}
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
          <ButtonBase
            data-tab-measure="1"
            key={`measure-${item.path}`}
            sx={linkSx(false)}
          >
            <Box component="img" src={item.icon} alt="" sx={{ width: 18, height: 18, flexShrink: 0 }} />
            <Typography variant="body2" noWrap>
              {item.label}
            </Typography>
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

  const authUser = React.useMemo(() => {
    if (routeAuthUser) return routeAuthUser;
    const match = location.pathname.match(/\/u\/([^/]+)/);
    return match ? match[1] : "0";
  }, [routeAuthUser, location.pathname]);

  const menuItems = React.useMemo(
    () => [
      { path: `/u/${authUser}/teaminbox`, label: "Team Inbox", icon: TeaminboxImg },
      { path: `/u/${authUser}/dialer`, label: "Dailer", icon: ClickImg },
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

  // Break-time state as a Popover
  const [breakAnchor, setBreakAnchor] = React.useState(null);
  const openBreak = Boolean(breakAnchor);
  const handleOpenBreak = (e) => setBreakAnchor(e.currentTarget);
  const handleCloseBreak = () => setBreakAnchor(null);

  // Toggle switches state
  const [toggles, setToggles] = React.useState({
    lunch: false,
    teaBreak: false,
    bioBreak: false,
    meeting: false,
    qa: false,
    briefing: false,
    technical: false,
    unwell: false,
  });

  const toggleSwitches = React.useMemo(
    () => [
      { key: "lunch", label: "Lunch" },
      { key: "teaBreak", label: "Tea Break" },
      { key: "bioBreak", label: "Bio Break" },
      { key: "meeting", label: "Meeting" },
      { key: "qa", label: "QA" },
      { key: "briefing", label: "Briefing" },
      { key: "technical", label: "Technical" },
      { key: "unwell", label: "Unwell" },
    ],
    []
  );

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    sessionStorage.setItem("selectedToggle", key);
    sessionStorage.setItem("auth", "false");
    window.location.reload();
  };

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

        {/* Divider between brand and tabs */}
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* 2) Tabs (with responsive More) */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <OverflowTabs items={menuItems} />
        </Box>

        {/* 3) Right actions (stick to far right) */}
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ ml: 1 }}>
          <Tooltip title="Wallet">
            <IconButton
              size="small"
              component="a"
              href="https://wallet.evzone.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Box component="img" src={WalletImg} alt="" sx={{ width: 20, height: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Break time">
            <IconButton size="small" onClick={handleOpenBreak}>
              <Box component="img" src={ClockImg} alt="" sx={{ width: 20, height: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton size="small" color="primary">
              <IoMdPerson />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Break-time popover */}
        <Popover
          open={openBreak}
          onClose={handleCloseBreak}
          anchorEl={breakAnchor}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              mt: 1,
              p: 1,
              borderRadius: theme.shape.borderRadius + 2,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: 3,
              minWidth: 220,
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ px: 1, py: 0.5, fontWeight: 700 }}>
            Break time
          </Typography>
          <Divider sx={{ mb: 0.5 }} />
          <Stack spacing={0.5} sx={{ px: 0.5, pb: 0.5 }}>
            {toggleSwitches.map(({ key, label }) => (
              <Stack
                key={key}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  px: 1,
                  py: 0.75,
                  borderRadius: 1,
                  "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                }}
                onClick={() => handleToggle(key)}
              >
                <Typography variant="body2">{label}</Typography>
                <Chip
                  size="small"
                  label={toggles[key] ? "On" : "Off"}
                  color={toggles[key] ? "primary" : "default"}
                  variant={toggles[key] ? "filled" : "outlined"}
                />
              </Stack>
            ))}
          </Stack>
        </Popover>
      </Toolbar>
    </AppBar>
  );
}
