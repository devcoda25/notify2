// Path: /src/routes/BaseLayouts.jsx
import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Outlet,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { notifyTheme } from "../theme/notifyTheme";

import Navbar from "../Component/Navbar/Navbar";
import BootGate from "../boot/BootGate";

// App sections
import TeamInbox from "../Pages/TeamInbox";
import Meetings from "../Pages/Meetings";
import Templates from "../Pages/Templates";
import Contacts from "../Pages/Contacts";
import Automations from "../Pages/automations";
import Analytics from "../Pages/Analytics";
import UserManagement from "../Pages/UserManagement";
import AccountDetails from "../Pages/AccountDetails";
import Login from "../Pages/Login";
import Reports from "../Pages/Reports";
import CopyMeetingLink from "../Component/Meetings/CopyMeetingLink";
import Meeting from "../Component/Meetings/Meeting";
import Availability from "../Component/Meetings/Availability";
import OneononeMeeting from "../Component/Meetings/OneononeMeeting";
import EditEvent from "../Component/Meetings/EditEvent";
import MeetingHistory from "../Component/Meetings/MeetingHistory";
import EditChatbotPage from "../Component/Automation/Chatbots/EditChatbotPage";
import DailerPage from "../Pages/Dailer";

// Public booking/live pages
import BookingPage from "../Component/Meetings/public/BookingPage";
import ReschedulePage from "../Component/Meetings/public/ReschedulePage";
import CancelPage from "../Component/Meetings/public/CancelPage";
import LivePage from "../Component/Meetings/public/LivePage";
import LiveLeft from "../Component/Meetings/public/LiveLeft";
import LiveInvalid from "../Component/Meetings/public/LiveInvalid";

// Call alerts (internal only)
import CallMiniWindow from "../alerts/CallMiniWindow";
import CallAlertsController from "../alerts/CallAlertsController";

const NAVBAR_H_DESKTOP = 64;
const NAVBAR_H_MOBILE = 56;

// ===== DEV FLAG: allow bootstrapping session auth from /u/:authUser path =====
// Turn this to false in production to force real sign-in via /console/pass
const ALLOW_PATH_BOOTSTRAP = true;

/** ---------- Layouts ---------- **/

// Never mount Navbar/overlays on public pages to avoid any flash.
const PublicLayout = () => (
  <Box sx={{ pt: 0 }}>
    <Outlet />
  </Box>
);

// Private layout always shows Navbar and internal overlays.
const PrivateLayout = ({ agentId }) => (
  <>
    <Navbar />
    <Box sx={{ pt: { xs: `${NAVBAR_H_MOBILE}px`, md: `${NAVBAR_H_DESKTOP}px` } }}>
      <Box sx={{ position: "fixed", zIndex: 1600, left: 16, bottom: 16 }}>
        <CallAlertsController agentId={agentId || "me"} minimal />
      </Box>
      <CallMiniWindow />
      <Outlet />
    </Box>
  </>
);

/** Guard for /u/:authUser/* routes → punts to /console/pass if unauthenticated */
const AuthUserRoute = ({ children }) => {
  const { authUser: pathAuthUser } = useParams();
  const location = useLocation();

  // Already authenticated?
  const hasAuthFlag = sessionStorage.getItem("auth") === "true";

  // If we allow path bootstrap (dev), and a path user is present, adopt it into session
  if (!hasAuthFlag && ALLOW_PATH_BOOTSTRAP && pathAuthUser) {
    sessionStorage.setItem("auth", "true");
    sessionStorage.setItem("authUser", pathAuthUser);
  }

  const authed =
    sessionStorage.getItem("auth") === "true" ||
    Boolean(sessionStorage.getItem("authUser"));

  if (!authed || !pathAuthUser) {
    // Prefer sending people to the sign-in, with return path
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/console/pass?next=${next}`} replace />;
  }
  return children;
};

/** Optional: normalize repeated slashes BEFORE routes resolve */
const SlashNormalizer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    const cleaned = location.pathname.replace(/\/{2,}/g, "/");
    if (cleaned !== location.pathname) {
      navigate({ pathname: cleaned, search: location.search }, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);
  return null;
};

const AppRoutes = () => {
  const location = useLocation();
  const [authUser, setAuthUser] = React.useState(() => {
    const stored = sessionStorage.getItem("authUser");
    if (stored) return stored;
    const params = new URLSearchParams(window.location.search);
    return params.get("x_authuser");
  });

  // capture x_authuser -> session (highest priority)
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const x_authuser = params.get("x_authuser");
    if (x_authuser && x_authuser !== authUser) {
      setAuthUser(x_authuser);
      sessionStorage.setItem("authUser", x_authuser);
      sessionStorage.setItem("auth", "true");
    }
  }, [location.search, authUser]);

  // Also, if we’re inside /u/:authUser and session has no user yet, adopt the path (when dev flag is on)
  React.useEffect(() => {
    if (!ALLOW_PATH_BOOTSTRAP) return;
    const match = location.pathname.match(/^\/u\/([^/]+)/);
    if (match && !sessionStorage.getItem("authUser")) {
      const fromPath = match[1];
      sessionStorage.setItem("authUser", fromPath);
      sessionStorage.setItem("auth", "true");
      setAuthUser(fromPath);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Keep URL tidy */}
      <SlashNormalizer />

      <Routes>
        {/* Root → send to sign-in (cleaner than invalid for first touch) */}
        <Route path="/" element={<Navigate to="/console/pass" replace />} />

        {/* ---------- Public layout (NO NAVBAR, NO OVERLAYS) ---------- */}
        <Route element={<PublicLayout />}>
          {/* Booking */}
          <Route path="/book/:slug" element={<BookingPage />} />
          <Route path="/book/:bookingId/reschedule" element={<ReschedulePage />} />
          <Route path="/book/:bookingId/cancel" element={<CancelPage />} />

          {/* Live (invite-only) */}
          <Route path="/live" element={<LiveInvalid />} />
          <Route path="/live/invalid" element={<LiveInvalid />} />
          <Route path="/live/:roomId/left" element={<LiveLeft />} />
          <Route path="/live/:roomId" element={<LivePage />} />

          {/* Optional alias */}
          <Route path="/meet/:slug" element={<BookingPage />} />

          {/* Public one-off */}
          <Route path="/hepto" element={<CopyMeetingLink />} />

          {/* Explicit public invalid */}
          <Route path="/invalid" element={<LiveInvalid />} />

          {/* Sign-in route */}
          <Route path="/console/pass" element={<Login />} />
        </Route>

        {/* ---------- Private layout (NAVBAR + OVERLAYS) ---------- */}
        <Route element={<PrivateLayout agentId={authUser} />}>
          <Route
            path="/u/:authUser"
            element={
              <AuthUserRoute>
                <TeamInbox />
              </AuthUserRoute>
            }
          />
          <Route
            path="/u/:authUser/teaminbox"
            element={
              <AuthUserRoute>
                <TeamInbox />
              </AuthUserRoute>
            }
          />
          <Route
            path="/u/:authUser/dialer"
            element={
              <AuthUserRoute>
                <DailerPage />
              </AuthUserRoute>
            }
          />
          <Route
            path="/u/:authUser/chatbots"
            element={
              <AuthUserRoute>
                <TeamInbox />
              </AuthUserRoute>
            }
          />
          <Route
            path="/u/:authUser/extended"
            element={
              <AuthUserRoute>
                <TeamInbox />
              </AuthUserRoute>
            }
          />

          {/* Meetings module (wildcard) */}
          <Route
            path="/u/:authUser/meetings/*"
            element={
              <AuthUserRoute>
                <Meetings />
              </AuthUserRoute>
            }
          />

          <Route
            path="/u/:authUser/templates"
            element={
              <AuthUserRoute>
                <Templates />
              </AuthUserRoute>
            }
          />
          <Route
            path="/u/:authUser/contacts"
            element={
              <AuthUserRoute>
                <Contacts />
              </AuthUserRoute>
            }
          />
          <Route
            path="/u/:authUser/automations"
            element={
              <AuthUserRoute>
                <Automations />
              </AuthUserRoute>
            }
          />
          <Route
            path="/u/:authUser/analytics"
            element={
              <AuthUserRoute>
                <Analytics />
              </AuthUserRoute>
            }
          />
          <Route
            path="/u/:authUser/reports"
            element={
              <AuthUserRoute>
                <Reports />
              </AuthUserRoute>
            }
          />
          <Route
            path="/u/:authUser/userManagement"
            element={
              <AuthUserRoute>
                <UserManagement />
              </AuthUserRoute>
            }
          />
          <Route
            path="/u/:authUser/accountdetails"
            element={
              <AuthUserRoute>
                <AccountDetails />
              </AuthUserRoute>
            }
          />
          <Route
            path="/u/:authUser/meetinghistory"
            element={
              <AuthUserRoute>
                <MeetingHistory />
              </AuthUserRoute>
            }
          />
          <Route
            path="/u/:authUser/editchatbotpage"
            element={
              <AuthUserRoute>
                <EditChatbotPage />
              </AuthUserRoute>
            }
          />

          {/* Misc internal (kept inside private shell) */}
          <Route path="/edit-eventtype" element={<EditEvent />} />
          <Route path="/one-on-one" element={<OneononeMeeting />} />
          <Route path="/meet" element={<Meeting />} />
          <Route path="/availability" element={<Availability />} />
        </Route>

        {/* Catch all → invalid */}
        <Route path="*" element={<Navigate to="/invalid" replace />} />
      </Routes>
    </>
  );
};

const BaseLayouts = () => {
  // Flip this to true when you actually need to BLOCK on async bootstrap.
  const ENABLE_BLOCKING_BOOTSTRAP = true;

  return (
    <BootGate block={ENABLE_BLOCKING_BOOTSTRAP}>
      {/* 🔮 App-wide theme (Navbar + all routes) */}
      <ThemeProvider theme={notifyTheme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </BootGate>
  );
};

export default BaseLayouts;
