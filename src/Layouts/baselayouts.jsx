// /src/Layouts/baselayouts.jsx
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
import PrivateGate from "../routes/PrivateGate";

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

// Auth glue
import AuthCallback from "../Pages/AuthCallback";
import { getAuthState, onAuthChange } from "../auth/authAgent";

const NAVBAR_H_DESKTOP = 64;
const NAVBAR_H_MOBILE = 56;

/** ---------- Layouts ---------- **/

const PublicLayout = () => (
  <Box sx={{ pt: 0 }}>
    <Outlet />
  </Box>
);

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

/** Guard for /u/:authUser/* routes AFTER auth is confirmed by PrivateGate */
const AuthUserRoute = ({ children }) => {
  const { authUser: pathAuthUser } = useParams();
  const authed = getAuthState().hasTicket;
  if (!authed || !pathAuthUser) {
    return <Navigate to="/console/pass" replace />;
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

function useAuthedKick() {
  const location = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    const goInbox = () => {
      const s = getAuthState();
      if (!s?.hasTicket) return;
      // only kick from public auth screens or root
      const p = location.pathname;
      const onPublic = p === "/" || p.startsWith("/console/pass");
      if (!onPublic) return;
      const u = encodeURIComponent(s.authUser || "me");
      navigate(`/u/${u}/teaminbox`, { replace: true });
    };
    goInbox();
    const unsub = onAuthChange(goInbox);
    return () => { try { unsub?.(); } catch {} };
  }, [location.pathname, navigate]);
}

const AppRoutes = () => {
  const navigate = useNavigate();
  useAuthedKick();

  const onLogin = React.useCallback(() => {
    const user = getAuthState().authUser || "me";
    const safe = encodeURIComponent(user);
    navigate(`/u/${safe}/teaminbox`, { replace: true });
  }, [navigate]);

  return (
    <>
      <SlashNormalizer />

      <Routes>
        {/* Root → authed inbox or sign-in */}
        <Route
          path="/"
          element={
            getAuthState().hasTicket
              ? <Navigate to={`/u/${encodeURIComponent(getAuthState().authUser || "me")}/teaminbox`} replace />
              : <Navigate to="/console/pass" replace />
          }
        />

        {/* ---------- Public (no navbar) ---------- */}
        <Route element={<PublicLayout />}>
          <Route path="/book/:slug" element={<BookingPage />} />
          <Route path="/book/:bookingId/reschedule" element={<ReschedulePage />} />
          <Route path="/book/:bookingId/cancel" element={<CancelPage />} />

          <Route path="/live" element={<LiveInvalid />} />
          <Route path="/live/invalid" element={<LiveInvalid />} />
          <Route path="/live/:roomId/left" element={<LiveLeft />} />
          <Route path="/live/:roomId" element={<LivePage />} />

          <Route path="/meet/:slug" element={<BookingPage />} />
          <Route path="/invalid" element={<LiveInvalid />} />

          {/* Sign-in + IdP callback */}
          <Route
            path="/console/pass"
            element={
              getAuthState().hasTicket
                ? <Navigate to={`/u/${encodeURIComponent(getAuthState().authUser || "me")}/teaminbox`} replace />
                : <Login onLogin={onLogin} />
            }
          />
          <Route path="/console/pass/callback" element={<AuthCallback onLogin={onLogin} />} />
        </Route>

        {/* ---------- Private (GATED SHELL: navbar renders only when authed) ---------- */}
        <Route element={<PrivateGate />}>
          <Route element={<PrivateLayout agentId={getAuthState().authUser || "me"} />}>
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
            <Route
              path="/u/:authUser/meetings/*"
              element={
                <AuthUserRoute>
                  <Meetings />
                </AuthUserRoute>
              }
            />
            <Route path="/u/:authUser/templates" element={<AuthUserRoute><Templates /></AuthUserRoute>} />
            <Route path="/u/:authUser/contacts" element={<AuthUserRoute><Contacts /></AuthUserRoute>} />
            <Route path="/u/:authUser/automations" element={<AuthUserRoute><Automations /></AuthUserRoute>} />
            <Route path="/u/:authUser/analytics" element={<AuthUserRoute><Analytics /></AuthUserRoute>} />
            <Route path="/u/:authUser/reports" element={<AuthUserRoute><Reports /></AuthUserRoute>} />
            <Route path="/u/:authUser/userManagement" element={<AuthUserRoute><UserManagement /></AuthUserRoute>} />
            <Route path="/u/:authUser/accountdetails" element={<AuthUserRoute><AccountDetails /></AuthUserRoute>} />
            <Route path="/u/:authUser/meetinghistory" element={<AuthUserRoute><MeetingHistory /></AuthUserRoute>} />
            <Route path="/u/:authUser/editchatbotpage" element={<AuthUserRoute><EditChatbotPage /></AuthUserRoute>} />
            {/* kept inside private shell */}
            <Route path="/edit-eventtype" element={<EditEvent />} />
            <Route path="/one-on-one" element={<OneononeMeeting />} />
            <Route path="/meet" element={<Meeting />} />
            <Route path="/availability" element={<Availability />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/invalid" replace />} />
      </Routes>
    </>
  );
};

const BaseLayouts = () => {
  const ENABLE_BLOCKING_BOOTSTRAP = true;

  return (
    <BootGate block={ENABLE_BLOCKING_BOOTSTRAP}>
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
