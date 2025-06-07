import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import TeamInbox from "../Pages/TeamInbox";
import Meetings from "../Pages/Meetings";
import Broadcast from '../Pages/Broadcast';
import Navbar from '../Component/Navbar/Navbar';
import ContactUs from '../Pages/contactus';
import Automations from '../Pages/automations';
import Analytics from '../Pages/Analytics';
import UserManagement from '../Pages/UserManagement';
import AccountDetails from '../Pages/AccountDetails';
import Reports from '../Pages/Reports';
import CopyMeetingLink from '../Component/Meetings/CopyMeetingLink';
import EditEventType from '../Component/Meetings/EditEventType';
import Event from '../Component/Meetings/Event';
import Meeting from '../Component/Meetings/Meeting';
import Availability from '../Component/Meetings/Availability';
import Analytic from '../Component/Meetings/Analytic';
import OneononeMeeting from '../Component/Meetings/OneononeMeeting';
import EditEvent from '../Component/Meetings/EditEvent';
import Login from '../Pages/Login';
import MeetingHistory from "../Component/Meetings/MeetingHistory";
import EditChatbotPage from "../Component/Automation/Chatbots/EditChatbotPage";

const AuthUserRoute = ({ children }) => {
  const { authUser } = useParams();
  const location = useLocation();
  
  if (!authUser) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  const [authUser, setAuthUser] = useState(() => {
    // Initialize from sessionStorage or URL params
    const stored = sessionStorage.getItem("authUser");
    if (stored) return stored;
    
    const params = new URLSearchParams(window.location.search);
    return params.get("x_authuser");
  });

  const checkAuthStatus = () => {
    const params = new URLSearchParams(window.location.search);
    const x_authuser = params.get("x_authuser");

    if (x_authuser && x_authuser !== authUser) {
      setAuthUser(x_authuser);
      sessionStorage.setItem("authUser", x_authuser);
      console.log("x_authuser", x_authuser);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [location.search]); // Re-run when URL search params change


  const hideNavbarPaths = ["/hepto"];
  const shouldHideNavbar = hideNavbarPaths.some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        {/* Root redirect - Fixed to handle null authUser properly */}
        <Route path="/" element={<Navigate to={`/u/${authUser || 'default'}`} replace />} />
        
        {/* Auth user routes */}
        <Route path="/u/:authUser" element={
          <AuthUserRoute>
            <TeamInbox />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/teaminbox" element={
          <AuthUserRoute>
            <TeamInbox />
          </AuthUserRoute>
        } />
        <Route path="/u/:authUser/chatbots" element={
          <AuthUserRoute>
            <TeamInbox />
          </AuthUserRoute>
        } />
        <Route path="/u/:authUser/extended" element={
          <AuthUserRoute>
            <TeamInbox />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/meetings" element={
          <AuthUserRoute>
            <Meetings />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/broadcast" element={
          <AuthUserRoute>
            <Broadcast authUser = {authUser} />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/contactus" element={
          <AuthUserRoute>
            <ContactUs />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/automations" element={
          <AuthUserRoute>
            <Automations authUser ={authUser} />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/analytics" element={
          <AuthUserRoute>
            <Analytics />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/reports" element={
          <AuthUserRoute>
            <Reports />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/userManagement" element={
          <AuthUserRoute>
            <UserManagement />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/accountdetails" element={
          <AuthUserRoute>
            <AccountDetails />
          </AuthUserRoute>
        } />

        <Route path="/u/:authUser/meetinghistory" element={
          <AuthUserRoute>
            <MeetingHistory />
          </AuthUserRoute>
        } />

        <Route path="/u/:authUser/editchatbotpage" element={
          <AuthUserRoute>
            <EditChatbotPage />
          </AuthUserRoute>
        } />

        
        {/* Meeting-related routes that might not need auth user in URL */}
        <Route path="/hepto" element={<CopyMeetingLink />} />
        <Route path="/edit-event" element={<EditEventType />} />
        <Route path="/edit-eventtype" element={<EditEvent />} />
        <Route path="/one-on-one" element={<OneononeMeeting />} />
        <Route path="/event-types" element={<Event />} />
        <Route path="/meet" element={<Meeting />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/analytic" element={<Analytic />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const BaseLayouts = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const params = new URLSearchParams(window.location.search);
      const x_authuser = params.get("x_authuser");
      const sessionAuth = sessionStorage.getItem("auth") === "true";

      if (x_authuser) {
        // If x_authuser is present, set auth to true
        sessionStorage.setItem("auth", "true");
        sessionStorage.setItem("authUser", x_authuser);
        setIsAuthenticated(true);
      } else if (sessionAuth) {
        // If session auth exists, keep authenticated
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

  // Show loading while checking auth status
  if (loading) {
    return <div>Loading...</div>; // You can replace with your loading component
  }

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