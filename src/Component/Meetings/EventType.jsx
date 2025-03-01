import React, { useState } from "react";
import Event from '../Meetings/Event';
import Availability from '../Meetings/Availability';
import Meeting from '../Meetings/Meeting';
import Analytic from '../Meetings/Analytic';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';


const EventType = () => {
    const [activeContent, setActiveContent] = useState('event types');
    const handleNavigationClick = (e, content) => {
        e.preventDefault();
        setActiveContent(content);
    };

    const renderContent = () => {
        switch (activeContent) {
            case 'event types':
                return <Event />
            case 'meetings':
                return <Meeting />
            case 'availability':
                return <Availability />
            case 'analytics':
                return <Analytic />

            default:
                return <Event />
        }
    }
    return (
        <>
            <div >


                <div className='msgCont'>

                    <div className='msgContL analytics__left__content'>
                        <li><button className="event_createbutton"><AddOutlinedIcon />Create</button></li>
                        <li className='solo'><a href='#' onClick={(e) => handleNavigationClick(e, 'event types')} ><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.707 7.2929C4.09752 7.68343 4.09752 8.31659 3.707 8.70712L3.207 9.20712C2.21681 10.1973 2.21681 11.8027
       3.207 12.7929C4.19718 13.7831 5.8026 13.7831 6.79278 12.7929L7.29278 12.2929C7.68331 11.9024 8.31647 11.9024
       8.707 12.2929C9.09752 12.6834 9.09752 13.3166 8.707 13.7071L8.207 14.2071C6.43576 15.9784 3.56402 15.9784
        1.79278 14.2071C0.0215446 12.4359 0.021548 9.56414 1.79278 7.7929L2.29278 7.2929C2.68331 6.90238 3.31647 6.90238 3.707 7.2929Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12.2928 8.70712C11.9023 8.31659 11.9023 7.68343 12.2928 7.2929L12.7928 6.79291C13.783 5.80272 13.783 4.19731
       12.7928 3.20712C11.8026 2.21693 10.1972 2.21693 9.20699 3.20712L8.707 3.70712C8.31647 4.09764 7.68331 4.09764
        7.29278 3.70712C6.90226 3.31659 6.90226 2.68343 7.29278 2.2929L7.79278 1.79291C9.56402 0.0216699 12.4358 0.021667
         14.207 1.7929C15.9782 3.56414 15.9782 6.43588 14.207 8.20712L13.707 8.70712C13.3165 9.09764 12.6833 9.09764 12.2928 8.70712Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.707 5.2929C11.0975 5.68343 11.0975 6.31659 10.707 6.70712L6.707 10.7071C6.31647 11.0976 5.68331 11.0976
       5.29278 10.7071C4.90226 10.3166 4.90226 9.68343 5.29278 9.2929L9.29278 5.2929C9.68331 4.90238 10.3165 4.90238
        10.707 5.2929Z" fill="currentColor"></path></svg><span className='leftbar__item__title' >Event types</span></a></li>
                        <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'meetings')} ><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 1C4 0.447715 4.44772 0 5 0C5.55228 0 6 0.447715 6 1H11C11 0.447715
     11.4477 0 12 0C12.5523 0 13 0.447715 13 1C14.6569 1 16 2.34315 16 4V13C16 14.6569 14.6569 16 13 16H11C10.4477 16 10
      15.5523 10 15C10 14.4477 10.4477 14 11 14H13C13.5523 14 14 13.5523 14 13V7H2V13C2 13.5523 2.44772 14 3 14H5C5.55228
       14 6 14.4477 6 15C6 15.5523 5.55228 16 5 16H3C1.34315 16 0 14.6569 0 13V4C0 2.34315 1.34315 1 3 1H4ZM3 3C2.44772
        3 2 3.44772 2 4V5H14V4C14 3.44772 13.5523 3 13 3H3Z" fill="currentColor"></path><path d="M4 10C4 9.44772 4.44772 9 5 9C5.55228 9 6 9.44772 6 10C6 10.5523 5.55228 11 5 11C4.44772 11 4 10.5523 4 10Z" fill="currentColor"></path><path d="M8 9C7.44772 9 7 9.44772 7 10C7 10.5523 7.44772 11 8 11C8.55228 11 9 10.5523 9 10C9 9.44772 8.55228 9 8 9Z" fill="currentColor"></path><path d="M10 10C10 9.44772 10.4477 9 11 9C11.5523 9 12 9.44772 12 10C12 10.5523 11.5523 11 11 11C10.4477 11 10 10.5523
     10 10Z" fill="currentColor"></path></svg><span className='leftbar__item__title'>Meetings</span></a></li>
                        <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'availability')} ><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 1 0 0-2H9V5a1 1 0 0 0-1-1Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-2 0A6 6 0 1 1 2 8a6 6 0 0 1 12 0Z" fill="currentColor"></path></svg><span className='leftbar__item__title'>Availability</span></a></li>
                        <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'analytics')}><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4 10C4 9.44772 4.44772 9 5 9C5.55228 9 6 9.44772 6 10V12C6 12.5523 5.55228 13 5 13C4.44772 13 4 12.5523
    4 12V10Z" fill="currentColor"></path><path d="M7 7C7 6.44772 7.44772 6 8 6C8.55228 6 9 6.44772 9 7V12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7
    12V7Z" fill="currentColor"></path><path d="M10 5C10 4.44772 10.4477 4 11 4C11.5523 4 12 4.44772 12 5V12C12 12.5523 11.5523 13 11 13C10.4477 13 10
    12.5523 10 12V5Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M3 2C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H13C13.5523
    14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2H3ZM0 3C0 1.34315 1.34315 0 3 0H13C14.6569 0 16 1.34315 16 3V13C16
    14.6569 14.6569 16 13 16H3C1.34315 16 0 14.6569 0 13V3Z" fill="currentColor"></path></svg><span className='leftbar__item__title'>Analytics</span></a></li>

                    </div>
                    <div className='msgContR'>
                        {renderContent()}

                    </div>
                </div>

            </div>

        </>
    )
}
export default EventType;