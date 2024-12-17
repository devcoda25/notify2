import React, { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import TeamInbox from '../Pages/TeamInbox';
import BroadcastBody from '../Component/Broadcast/BroadcastBody';
import Navbar from '../Component/Navbar/Navbar';
import ContactUs from '../Pages/contactus';
import Automations from '../Pages/automations';
import Analytics from '../Pages/Analytics';
import UserManagement from '../Pages/UserManagement';
import AccountDetails from '../Pages/AccountDetails';
const BaseLayouts = () => {

    return (
        <>
            <React.Fragment>
                
                <BrowserRouter>
                <Navbar/>
                    <Routes>
                        <Route path='/' element={<TeamInbox />} />
                        <Route path='Teaminbox' element={<TeamInbox />} />
                        <Route path='BroadcastBody' element={<BroadcastBody />} />
                        <Route path='contactus' element={<ContactUs/>}/>
                        <Route path='automations' element={<Automations/>}/>
                        <Route path='Analytics' element={<Analytics/>} />
                        <Route path='UserManagement' element={<UserManagement/>}/>
                        <Route path='AccountDetails' element={<AccountDetails/>}/>
                    </Routes>
                </BrowserRouter>
            </React.Fragment>
        </>
    );
}
export default BaseLayouts;