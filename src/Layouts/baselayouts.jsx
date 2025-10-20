// routes/BaseLayouts.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import { Box } from "@mui/material";
import { ReactComponent as LoadingSpinner } from './sp.svg';


import TeamInbox from "../Pages/TeamInbox";
import Meetings from "../Pages/Meetings";
import Broadcast from "../Pages/Broadcast";
import Navbar from "../Component/Navbar/Navbar";
import ContactUs from "../Pages/contactus";
import Automations from "../Pages/automations";
import Analytics from "../Pages/Analytics";
import UserManagement from "../Pages/UserManagement";
import AccountDetails from "../Pages/AccountDetails";
import Reports from "../Pages/Reports";
import CopyMeetingLink from "../Component/Meetings/CopyMeetingLink";
import EditEventType from "../Component/Meetings/EditEventType";
import Event from "../Component/Meetings/Event";
import Meeting from "../Component/Meetings/Meeting";
import Availability from "../Component/Meetings/Availability";
import Analytic from "../Component/Meetings/Analytic";
import OneononeMeeting from "../Component/Meetings/OneononeMeeting";
import EditEvent from "../Component/Meetings/EditEvent";
import Login from "../Pages/Login";
import MeetingHistory from "../Component/Meetings/MeetingHistory";

import DailerPage from "../Pages/Dailer";

// NEW: call alerts glue
import CallMiniWindow from "../alerts/CallMiniWindow";
import CallAlertsController from "../alerts/CallAlertsController";

const NAVBAR_H_DESKTOP = 64; // px
const NAVBAR_H_MOBILE = 56; // px

const AuthUserRoute = ({ children }) => {
  const { authUser } = useParams();
  const location = useLocation();

  if (!authUser) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  const [authUser, setAuthUser] = useState(() => {
    const stored = sessionStorage.getItem("authUser");
    if (stored) return stored;
    const params = new URLSearchParams(window.location.search);
    return params.get("x_authuser");
  });

  // keep authUser in sessionStorage if URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const x_authuser = params.get("x_authuser");
    if (x_authuser && x_authuser !== authUser) {
      setAuthUser(x_authuser);
      sessionStorage.setItem("authUser", x_authuser);
      // eslint-disable-next-line no-console
      console.log("x_authuser", x_authuser);
    }
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tell the SW when the app is visible/hidden (so it only notifies on *new* calls when hidden)
  useEffect(() => {
    const postVis = async (state) => {
      try {
        if (navigator.serviceWorker?.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "APP_VISIBILITY",
            state,
          });
        } else if ("serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.ready;
          reg?.active?.postMessage({ type: "APP_VISIBILITY", state });
        }
      } catch { }
    };

    const send = () => postVis(document.visibilityState);
    send(); // initial
    document.addEventListener("visibilitychange", send);
    return () => document.removeEventListener("visibilitychange", send);
  }, []);

  const hideNavbarPaths = ["/hepto"];
  const shouldHideNavbar = hideNavbarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      {/* Offset all pages so they start BELOW the fixed navbar */}
      <Box
        sx={{
          pt: shouldHideNavbar
            ? 0
            : { xs: `${NAVBAR_H_MOBILE}px`, md: `${NAVBAR_H_DESKTOP}px` },
        }}
      >
        {/* --- Always-on alert helpers (mounted at app root) --- */}
        {/* Minimal opt-in chip appears until notifications are granted; SW also gets registered here */}
        <Box sx={{ position: "fixed", zIndex: 1600, left: 16, bottom: 16 }}>
          <CallAlertsController agentId={authUser || "me"} minimal />
        </Box>
        {/* The floating 3CX-like mini window that shows on NEW CALL while app/tab is visible */}
        <CallMiniWindow />

        <Routes>
          {/* Root redirect */}
          <Route
            path="/"
            element={<Navigate to={`/u/${authUser || "default"}`} replace />}
          />

          {/* Auth user routes */}
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
            path="/u/:authUser/meetings"
            element={
              <AuthUserRoute>
                <Meetings />
              </AuthUserRoute>
            }
          />

          <Route
            path="/u/:authUser/broadcast"
            element={
              <AuthUserRoute>
                <Broadcast authUser={authUser} />
              </AuthUserRoute>
            }
          />

          <Route
            path="/u/:authUser/contactus"
            element={
              <AuthUserRoute>
                <ContactUs />
              </AuthUserRoute>
            }
          />

          <Route
            path="/u/:authUser/automations"
            element={
              <AuthUserRoute>
                <Automations authUser={authUser} />
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

          

          {/* Meeting-related routes that might not need auth user in URL */}
          <Route path="/hepto" element={<CopyMeetingLink />} />
          <Route path="/edit-event" element={<EditEventType />} />
          <Route path="/edit-eventtype" element={<EditEvent />} />
          <Route path="/one-on-one" element={<OneononeMeeting />} />
          <Route path="/event-types" element={<Event />} />
          <Route path="/meet" element={<Meeting />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/analytic" element={<Analytic />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </>
  );
};

const BaseLayouts = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const params = new URLSearchParams(window.location.search);
      const x_authuser = params.get("x_authuser");
      const sessionAuth = sessionStorage.getItem("auth") === "true";

      if (x_authuser) {
        sessionStorage.setItem("auth", "true");
        sessionStorage.setItem("authUser", x_authuser);
        setIsAuthenticated(true);
      } else if (sessionAuth) {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("auth", "true");
  };

  if (loading) return <div className="loading-container"><LoadingSpinner /></div>;

  return (
    <BrowserRouter>
      {isAuthenticated || window.location.pathname === "/hepto" ? (
        <AppRoutes />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </BrowserRouter>
  );
};

export default BaseLayouts;
