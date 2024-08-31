import React, { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import TeamInbox from '../Pages/TeamInbox';
import BroadcastBody from '../Component/Broadcast/BroadcastBody';
import Navbar from '../Component/Navbar/Navbar';
const BaseLayouts = () => {

    return (
        <>
            <React.Fragment>
                <Navbar></Navbar>
                <BrowserRouter>
                    <Routes>
                        <Route path='BroadcastBody' element={<BroadcastBody/>}/>
                       <Route path='Teaminbox' element={<TeamInbox/>}/>
                    </Routes>
                </BrowserRouter>
            </React.Fragment>
        </>
    );
}
export default BaseLayouts;