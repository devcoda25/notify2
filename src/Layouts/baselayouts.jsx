import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import TeamInbox from "../Pages/TeamInbox";
import Meetings from "../Pages/Meetings";
// import BroadcastBody from '../Component/Broadcast/BroadcastBody';
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
import { setISODay } from "date-fns";

const AppRoutes = () => {
  const location = useLocation();
  const [authUser, setauthUser] = useState(null);

  
    // const checkAuthStatus = () => {
    //   const params = new URLSearchParams(window.location.search);
    //   const x_authuser = params.get("x_authuser");
    //   setauthUser(x_authuser);
  
    //   if (x_authuser) {
    //     console.log("x_authuser", x_authuser);
    //     window.location.href = `/u/${x_authuser}${
    //       window.location.pathname !== "/" ? window.location.pathname : ""
    //     }`;
    //   }
    // };
  
    // useEffect(() => {
    //   checkAuthStatus();
    // }, []);

  const hideNavbarPaths = ["/hepto"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<TeamInbox />} />
        {/* <Route path='login' element={<Login />} /> */}
        {/* <Route path={`u/${authUser}/Teaminbox`} element={<TeamInbox />} /> */}
        <Route path={`/Teaminbox`} element={<TeamInbox />} />
        <Route path="/extended" element={<TeamInbox />} />
        <Route path="/chatbot" element={<TeamInbox />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="Broadcast" element={<Broadcast />} />
        <Route path="contactus" element={<ContactUs />} />
        <Route path="automations" element={<Automations />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="Reports" element={<Reports />} />
        <Route path="UserManagement" element={<UserManagement />} />
        <Route path="AccountDetails" element={<AccountDetails />} />
        <Route path="/hepto" element={<CopyMeetingLink />} />
        <Route path="/edit-event" element={<EditEventType />} />
        <Route path="/edit-eventtype" element={<EditEvent />} />
        <Route path="/one-on-one" element={<OneononeMeeting />} />
        <Route path="/event-types" element={<Event />} />
        <Route path="/meet" element={<Meeting />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/analytic" element={<Analytic />} />
      </Routes>
    </>
  );
};

const BaseLayouts = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("auth") === "true"
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    // <>
    //     <React.Fragment>

    //         <BrowserRouter>
    //         <Navbar/>
    //             <Routes>
    //                 <Route path='/' element={<TeamInbox />} />
    //                 <Route path='Teaminbox' element={<TeamInbox />} />
    //                 <Route path='meetings' element={<Meetings />} />
    //                 <Route path='Broadcast' element={<Broadcast />} />
    //                 <Route path='contactus' element={<ContactUs/>}/>
    //                 <Route path='automations' element={<Automations/>}/>
    //                 <Route path='analytics' element={<Analytics/>} />
    //                 <Route path='Reports' element={<Reports/>}/>
    //                 <Route path='UserManagement' element={<UserManagement/>}/>
    //                 <Route path='AccountDetails' element={<AccountDetails/>}/>
    //                 <Route path='/hepto' element={<CopyMeetingLink/>}/>
    //                 <Route path='/edit-event' element={<EditEventType/>}/>
    //                 <Route path='/edit-eventtype' element={<EditEvent/>}/>
    //                 <Route path='/one-on-one' element={<OneononeMeeting/>}/>
    //                 <Route path='/event-types' element={<Event/>}/>
    //                 <Route path='/meet' element={<Meeting/>}/>
    //                 <Route path='/availability' element={<Availability/>}/>
    //                 <Route path='/analytic' element={<Analytic/>}/>

    //             </Routes>
    //         </BrowserRouter>
    //     </React.Fragment>
    // </>
    <>
      <BrowserRouter>
        {isAuthenticated || window.location.pathname === "/hepto" ? (
          <AppRoutes />
        ) : (
          <Login onLogin={handleLogin} />
          // <>
          // <Route path="/" element={<Login onLogin={handleLogin} />} />
          // <Route path="*" element={<Navigate to="/" />} />
          // </>
        )}
      </BrowserRouter>
    </>
  );
};
export default BaseLayouts;
