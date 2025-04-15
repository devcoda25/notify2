import React, { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import TeamInbox from '../Pages/TeamInbox';
import Meetings from '../Pages/Meetings';
// import BroadcastBody from '../Component/Broadcast/BroadcastBody';
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
const BaseLayouts = () => {

    return (
        <>
            <React.Fragment>
                
                <BrowserRouter>
                <Navbar/>
                    <Routes>
                        <Route path='/' element={<TeamInbox />} />
                        <Route path='Teaminbox' element={<TeamInbox />} />
                        <Route path='meetings' element={<Meetings />} />
                        <Route path='Broadcast' element={<Broadcast />} />
                        <Route path='contactus' element={<ContactUs/>}/>
                        <Route path='automations' element={<Automations/>}/>
                        <Route path='analytics' element={<Analytics/>} />
                        <Route path='Reports' element={<Reports/>}/>
                        <Route path='UserManagement' element={<UserManagement/>}/>
                        <Route path='AccountDetails' element={<AccountDetails/>}/>
                        <Route path='/hepto' element={<CopyMeetingLink/>}/>
                        <Route path='/edit-event' element={<EditEventType/>}/>
                        <Route path='/event-types' element={<Event/>}/>
                        <Route path='/meet' element={<Meeting/>}/>
                        <Route path='/availability' element={<Availability/>}/>
                        <Route path='/analytic' element={<Analytic/>}/>
                        <Route path='/one-on-one' element={<OneononeMeeting/>}/>
                    </Routes>
                </BrowserRouter>
            </React.Fragment>
        </>
    );
}
export default BaseLayouts;