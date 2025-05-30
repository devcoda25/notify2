// import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter,
//   Navigate,
//   Route,
//   Routes,
//   useLocation,
// } from "react-router-dom";
// import TeamInbox from "../Pages/TeamInbox";
// import Meetings from "../Pages/Meetings";
// // import BroadcastBody from '../Component/Broadcast/BroadcastBody';
// import Broadcast from '../Pages/Broadcast';
// import Navbar from '../Component/Navbar/Navbar';
// import ContactUs from '../Pages/contactus';
// import Automations from '../Pages/automations';
// import Analytics from '../Pages/Analytics';
// import UserManagement from '../Pages/UserManagement';
// import AccountDetails from '../Pages/AccountDetails';
// import Reports from '../Pages/Reports';
// import CopyMeetingLink from '../Component/Meetings/CopyMeetingLink';
// import EditEventType from '../Component/Meetings/EditEventType';
// import Event from '../Component/Meetings/Event';
// import Meeting from '../Component/Meetings/Meeting';
// import Availability from '../Component/Meetings/Availability';
// import Analytic from '../Component/Meetings/Analytic';
// import OneononeMeeting from '../Component/Meetings/OneononeMeeting';
// import EditEvent from '../Component/Meetings/EditEvent';
// import Login from '../Pages/Login';
// import { setISODay } from 'date-fns';

// const AppRoutes = () => {
//   const location = useLocation();
//   const [authUser, setauthUser] = useState(null);

  
//     const checkAuthStatus = () => {
//       const params = new URLSearchParams(window.location.search);
//       const x_authuser = params.get("x_authuser");
//       setauthUser(x_authuser);
  
//       if (x_authuser) {
//         console.log("x_authuser", x_authuser);
//         window.location.href = `/u/${x_authuser}`;
//       }
//     };
  
//     useEffect(() => {
//       checkAuthStatus();
//     }, []);

//   const hideNavbarPaths = ["/hepto"];
//   const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

//     return (
//         <>
//             {/* {!shouldHideNavbar && <Navbar />} */}
//             <Routes>
//                 <Route path='/' element={<TeamInbox />} />
//                 {/* <Route path='login' element={<Login />} /> */}
//                 <Route path={`u/${authUser}/Teaminbox`} element={<TeamInbox />} />
//                 {/* <Route path='/Teaminbox' element={<TeamInbox />} /> */}
//                 <Route path='meetings' element={<Meetings />} />
//                 <Route path='Broadcast' element={<Broadcast />} />
//                 <Route path='contactus' element={<ContactUs />} />
//                 <Route path='automations' element={<Automations />} />
//                 <Route path='analytics' element={<Analytics />} />
//                 <Route path='Reports' element={<Reports />} />
//                 <Route path='UserManagement' element={<UserManagement />} />
//                 <Route path='AccountDetails' element={<AccountDetails />} />
//                 <Route path='/hepto' element={<CopyMeetingLink />} />
//                 <Route path='/edit-event' element={<EditEventType />} />
//                 <Route path='/edit-eventtype' element={<EditEvent />} />
//                 <Route path='/one-on-one' element={<OneononeMeeting />} />
//                 <Route path='/event-types' element={<Event />} />
//                 <Route path='/meet' element={<Meeting />} />
//                 <Route path='/availability' element={<Availability />} />
//                 <Route path='/analytic' element={<Analytic />} />
//             </Routes>
//         </>
//     );
// };

// const BaseLayouts = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     () => sessionStorage.getItem("auth") === "true"
//   );

//   const handleLogin = () => {
//     setIsAuthenticated(true);
//   };

//   return (
//     // <>
//     //     <React.Fragment>

//     //         <BrowserRouter>
//     //         <Navbar/>
//     //             <Routes>
//     //                 <Route path='/' element={<TeamInbox />} />
//     //                 <Route path='Teaminbox' element={<TeamInbox />} />
//     //                 <Route path='meetings' element={<Meetings />} />
//     //                 <Route path='Broadcast' element={<Broadcast />} />
//     //                 <Route path='contactus' element={<ContactUs/>}/>
//     //                 <Route path='automations' element={<Automations/>}/>
//     //                 <Route path='analytics' element={<Analytics/>} />
//     //                 <Route path='Reports' element={<Reports/>}/>
//     //                 <Route path='UserManagement' element={<UserManagement/>}/>
//     //                 <Route path='AccountDetails' element={<AccountDetails/>}/>
//     //                 <Route path='/hepto' element={<CopyMeetingLink/>}/>
//     //                 <Route path='/edit-event' element={<EditEventType/>}/>
//     //                 <Route path='/edit-eventtype' element={<EditEvent/>}/>
//     //                 <Route path='/one-on-one' element={<OneononeMeeting/>}/>
//     //                 <Route path='/event-types' element={<Event/>}/>
//     //                 <Route path='/meet' element={<Meeting/>}/>
//     //                 <Route path='/availability' element={<Availability/>}/>
//     //                 <Route path='/analytic' element={<Analytic/>}/>

//     //             </Routes>
//     //         </BrowserRouter>
//     //     </React.Fragment>
//     // </>
//     <>
//       <BrowserRouter>
//         {isAuthenticated || window.location.pathname === "/hepto" ? (
//           <AppRoutes />
//         ) : (
//           <Login onLogin={handleLogin} />
//           // <>
//           // <Route path="/" element={<Login onLogin={handleLogin} />} />
//           // <Route path="*" element={<Navigate to="/" />} />
//           // </>
//         )}
//       </BrowserRouter>
//     </>
//   );
// };
// export default BaseLayouts;

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
  const [authUser, setAuthUser] = useState(null);

  const checkAuthStatus = () => {
    const params = new URLSearchParams(window.location.search);
    const x_authuser = params.get("x_authuser");
    setAuthUser(x_authuser);

    if (x_authuser) {
      console.log("x_authuser", x_authuser);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const hideNavbarPaths = ["/hepto"];
  const shouldHideNavbar = hideNavbarPaths.some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to={`/u/${authUser || '0'}`} replace />} />
        
        {/* Auth user routes */}
        <Route path="/u/:authUser" element={
          <AuthUserRoute>
            <TeamInbox />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/Teaminbox" element={
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
        
        <Route path="/u/:authUser/Broadcast" element={
          <AuthUserRoute>
            <Broadcast />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/contactus" element={
          <AuthUserRoute>
            <ContactUs />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/automations" element={
          <AuthUserRoute>
            <Automations />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/analytics" element={
          <AuthUserRoute>
            <Analytics />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/Reports" element={
          <AuthUserRoute>
            <Reports />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/UserManagement" element={
          <AuthUserRoute>
            <UserManagement />
          </AuthUserRoute>
        } />
        
        <Route path="/u/:authUser/AccountDetails" element={
          <AuthUserRoute>
            <AccountDetails />
          </AuthUserRoute>
        } />

        <Route path="/u/:authUser/MeetingHistory" element={
          <AuthUserRoute>
            <MeetingHistory />
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
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("auth") === "true"
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("auth", "true");
  };

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