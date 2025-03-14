import React, { useState } from "react";
import Event from '../Meetings/Event';
import Availability from '../Meetings/Availability';
import Meeting from '../Meetings/Meeting';
import Analytic from '../Meetings/Analytic';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EventIcon from "@mui/icons-material/Event";
import GroupsIcon from "@mui/icons-material/Groups";
import PollIcon from "@mui/icons-material/Poll";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TimeZoneMenu from "./TimeZoneMenu";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AutocompleteComponent from "../AutocompleteComponent";

const styles = {
    newticketsAutocomplete: {
        height: '32px',
        border: '1px solid #c9c9cd',
        width: '70%',
        '&:hover': {
            border: '1px solid blue !important',
        },
        '&.Mui-focused': {
            border: '1px solid blue !important',
            outline: 'none',
        },


    },
}
const CreateNewMeetingComponent = () => {
    const [timeZoneAnchor, setTimeZoneAnchor] = useState(null);
    const [selectedTimeZone, setSelectedTimeZone] = useState("Eastern Time - US & Canada");
    const durationOptions = ['15 Minutes', '30 Minutes', '45 Minutes', '1 hour', 'Custom'];
    const [durationContent, setDurationContent] = useState(durationOptions[1]);
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [daySlots, setDaySlots] = useState({});
    const currentTime = dayjs();
    const handleTimeZoneClick = (event) => {
        setTimeZoneAnchor(event.currentTarget);
    };

    const handleTimeZoneSelect = (zone) => {
        setSelectedTimeZone(zone);
        setTimeZoneAnchor(null);
    };
    const getWeekDays = (date) => {
        let startOfWeek = date.startOf("week"); // Start of week (Sunday)
        return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
    };

    const weekDays = getWeekDays(currentDate);
    const timeSlots = Array.from({ length: 24 }, (_, i) =>
        dayjs().hour(i).minute(0).format("hA")
    );
    // const handleSlotClick = (day, hour, isSecondHalf) => {
    //     const slotTime = isSecondHalf ? hour.clone().add(30, "minute") : hour;

    //     // Prevent selecting past time slots
    //     if (
    //         day.isBefore(currentTime, "day") ||
    //         (day.isSame(currentTime, "day") && slotTime.isBefore(currentTime))
    //     ) {
    //         return;
    //     }

    //     const slot = {
    //         day: day.format("YYYY-MM-DD"),
    //         time: `${slotTime.format("h:mm A")} - ${slotTime.clone().add(30, "minute").format("h:mm A")}`,
    //     };

    //     // Add both halves without removing any previous selections
    //     setSelectedSlots((prev) => [...prev, slot]);
    // };
    const handleSlotClick = (day, hour, isSecondHalf) => {
        const slotTime = isSecondHalf ? hour.clone().add(30, "minute") : hour;

        if (
            day.isBefore(currentTime, "day") || 
            (day.isSame(currentTime, "day") && slotTime.isBefore(currentTime))
        ) {
            return;
        }

        const slot = {
            day: day.format("YYYY-MM-DD"),
            time: `${slotTime.format("h:mm A")} - ${slotTime.clone().add(30, "minute").format("h:mm A")}`,
        };

        setSelectedSlots((prev) => [...prev, slot]);
        setDaySlots((prev) => ({ ...prev, [day.format("YYYY-MM-DD")]: true }));
    };
    const handleAddItem = (day) => {
        if (day.isBefore(currentTime, "day")) return;

        const slots = [];
        for (let i = 0; i < 24; i++) {
            const hour = day.clone().hour(i).minute(0);
            if (day.isSame(currentTime, "day") && hour.isBefore(currentTime)) {
                continue;
            }
            slots.push({
                day: day.format("YYYY-MM-DD"),
                time: `${hour.format("h:mm A")} - ${hour.clone().add(30, "minute").format("h:mm A")}`
            });
            slots.push({
                day: day.format("YYYY-MM-DD"),
                time: `${hour.clone().add(30, "minute").format("h:mm A")} - ${hour.clone().add(1, "hour").format("h:mm A")}`
            });
        }

        setSelectedSlots((prev) => [...prev, ...slots]);
        setDaySlots((prev) => ({ ...prev, [day.format("YYYY-MM-DD")]: true }));
    };

    const handleClearItem = (day) => {
        if (day.isBefore(currentTime, "day")) return;
        setSelectedSlots((prev) => prev.filter(slot => slot.day !== day.format("YYYY-MM-DD")));
        setDaySlots((prev) => ({ ...prev, [day.format("YYYY-MM-DD")]: false }));
    };

    return (
        <>
        <div className="createNewMeeting">
            <div className="leftContainer">
                <div className="content">
                    <label>
                        Time zone
                    </label>
                    <div
                        onClick={handleTimeZoneClick} className="timezone"

                    >
                        {selectedTimeZone}  <ExpandMoreIcon fontSize="small" />
                    </div>
                    <TimeZoneMenu anchorEl={timeZoneAnchor} open={Boolean(timeZoneAnchor)} onClose={() => setTimeZoneAnchor(null)} onSelect={handleTimeZoneSelect} />
                </div>
                <div className="content">
                    <label>Duration</label>
                    <AutocompleteComponent
                        options={durationOptions}
                        value={durationContent}
                        onChange={(event, newValue) => setDurationContent
                            (newValue)}
                        customStyles={styles.newticketsAutocomplete}
                    />
                </div>
                <div className="content">
                    <label>Host</label>
                    <div className="host_container">
                        <div className="logo">H</div>
                        <div><p className="username">Hepto (you)</p>
                            <p>Mon, Tue, Wed, Thu, Fri, Sat, hours vary</p>
                        </div>
                    </div>
                </div>
                <div>You are the only one in your organization. Add users to include them as hosts.</div>
            </div>
            <div className="rightContainer">

                {/* Navigation Controls */}
                <div className="month_name">
                    <NavigateBeforeIcon /><NavigateNextIcon />
                    <span>
                        {currentDate.format("MMMM YYYY")}
                    </span>

                </div>

                {/* Week Days Display */}
                <div className='week_days'>
                    {weekDays.map((day) => (
                        <>
                            <div className="days"
                                key={day.format("YYYY-MM-DD")}
                                style={{ backgroundColor: day.isSame(dayjs(), "day") ? "rgb(0 105 255 / 15%)" : "white" }}
                            >
                                {day.format("ddd")} <br /> {day.format("D")} <br />


                            </div>

                        </>
                    ))}

                </div>
                <div style={{ display: 'flex', gap: '72px', margin: '0px 96px 15px' }}>
                    {weekDays.map(day => (
                        !day.isBefore(currentTime, "day") && (
                            <div key={day.format("YYYY-MM-DD")}>
                                {daySlots[day.format("YYYY-MM-DD")] ? (
                                    <a style={{ color: 'blue', fontSize: '12px' }} onClick={() => handleClearItem(day)}  >Clear Item</a>
                                ) : (
                                    <a style={{ color: 'blue', fontSize: '12px' }} onClick={() => handleAddItem(day)}>Add Item</a>
                                )}
                            </div>
                        )
                    ))}


                </div>
                <div style={{ display: "grid", gridTemplateColumns: "100px repeat(7, 1fr)",maxHeight:'400px',overflowY:'auto' }}>
                    {/* Time Column */}
                    {timeSlots.map((slot, index) => (
                        <React.Fragment key={index}>
                            <div
                                style={{
                                    paddingRight: "17px",
                                    fontSize: "12px",
                                    borderRight: "1px solid gray",
                                    textAlign: "end",

                                }}
                            >
                                {slot}
                            </div>

                            {/* Time Slots for Each Day */}

                            {weekDays.map((day, i) => {
                                const hour = dayjs().hour(index).minute(0);

                                return (
                                    <div key={i + slot} style={{
                                        display: "grid", gridTemplateRows: "1fr 1fr", borderTop: "1px solid lightgray",
                                        borderRight: "1px solid lightgray",
                                        //  padding: "10px",
                                        minHeight: "60px",
                                        cursor: "pointer",
                                        backgroundColor: "#fff",

                                    }}>
                                        {/* First Half (12:00 - 12:30) */}
                                        <div
                                            onClick={() => handleSlotClick(day, hour, false)}
                                            style={{
                                                padding: "5px",
                                                // borderTop: "1px solid lightgray",
                                                cursor: (day.isBefore(currentTime, "day") || (day.isSame(currentTime, "day") && hour.isBefore(currentTime))) ? "not-allowed" : "pointer",
                                                backgroundColor: 'white',
                                                borderLeftWidth: 'medium',
                                                fontSize: '10px',
                                                marginBottom: '5px',
                                                border: selectedSlots.some(s => s.day === day.format("YYYY-MM-DD") && s.time === `${hour.format("h:mm A")} - ${hour.add(30, "minute").format("h:mm A")}`)
                                                    ? "1px solid blue" : "none",
                                            }}
                                            title={(day.isBefore(currentTime, "day") || (day.isSame(currentTime, "day") && hour.isBefore(currentTime))) ? "Unavailable" : ""}
                                        >
                                            {selectedSlots.some(s => s.day === day.format("YYYY-MM-DD") && s.time === `${hour.format("h:mm A")} - ${hour.add(30, "minute").format("h:mm A")}`)
                                                ? `${hour.format("h:mm A")} - ${hour.add(30, "minute").format("h:mm A")}` : ""}
                                        </div>

                                        {/* Second Half (12:30 - 1:00) */}
                                        <div
                                            onClick={() => handleSlotClick(day, hour, true)}
                                            style={{
                                                padding: "5px",
                                                // borderTop: "1px solid lightgray",
                                                cursor: (day.isBefore(currentTime, "day") || (day.isSame(currentTime, "day") && hour.clone().add(30, "minute").isBefore(currentTime))) ? "not-allowed" : "pointer",
                                                backgroundColor: 'white',
                                                borderLeftWidth: 'medium',
                                                fontSize: '10px',
                                                marginBottom: '5px',

                                                border: selectedSlots.some(s => s.day === day.format("YYYY-MM-DD") && s.time === `${hour.add(30, "minute").format("h:mm A")} - ${hour.add(60, "minute").format("h:mm A")}`)
                                                    ? "1px solid blue" : "none",
                                            }}
                                            title={(day.isBefore(currentTime, "day") || (day.isSame(currentTime, "day") && hour.clone().add(30, "minute").isBefore(currentTime))) ? "Unavailable" : ""}
                                        >
                                            {selectedSlots.some(s => s.day === day.format("YYYY-MM-DD") && s.time === `${hour.add(30, "minute").format("h:mm A")} - ${hour.add(60, "minute").format("h:mm A")}`)
                                                ? `${hour.add(30, "minute").format("h:mm A")} - ${hour.add(60, "minute").format("h:mm A")}` : ""}
                                        </div>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>


            </div>
           
        </div>
         <div className="create_newmeet_footer">
         <a>Select time to share</a>
         <Button>Next</Button>
     </div>
   </>
    )
}
const EventType = () => {
    const [activeContent, setActiveContent] = useState('event types');
    const [showMenu, setShowMenu] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const handleToggle = () => {
        setShowMenu(!showMenu);
    };
    const handleNavigationClick = (e, content) => {
        e.preventDefault();
        setActiveContent(content);
    };

    const renderContent = () => {
        switch (activeContent) {
            case 'event types':
                return <Event onCreateClick={() => setShowCreate(true)} />
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
            <div>
                {showCreate ? (<CreateNewMeetingComponent />) : (



                    <div className='msgCont'>

                        <div className='msgContL analytics__left__content'>
                            <li><button className="event_createbutton" onClick={handleToggle}><AddOutlinedIcon />Create</button></li>
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
                            <>

                                {showMenu && (
                                    <div className="calendar_create_button" >
                                        <div className="content">
                                            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 1C0 0.447715 0.447715 0 1 0H19C19.5523 0 20 0.447715 20 1V19C20 19.5523 19.5523 20 19 20H1C0.447715 20 0 19.5523 0 19V1ZM2 2V18H18V2H2Z" fill="currentColor"></path><circle cx="6" cy="6" r="2" fill="currentColor"></circle><path fill-rule="evenodd" clip-rule="evenodd" d="M4 11C4 10.4477 4.44772 10 5 10H15.625C16.1773 10 16.625 10.4477 16.625 11C16.625 11.5523 16.1773 12 15.625 12H5C4.44772 12 4 11.5523 4 11Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4 15C4 14.4477 4.44772 14 5 14H15.625C16.1773 14 16.625 14.4477 16.625 15C16.625 15.5523 16.1773 16 15.625 16H5C4.44772 16 4 15.5523 4 15Z" fill="currentColor"></path></svg>
                                            <div>
                                                <strong>Event type</strong>
                                                <p >
                                                    Create a new template for your regularly scheduled events.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="content">
                                            <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M.5 9.5h8A.5.5 0 0 0 9 9a1.5 1.5 0 0 0-1.5-1.5h-4M.5 5.5h3a2 2 0 0 1 2 2M8.766 5.808A3.25 3.25 0 1 0 3.009 3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.25 2.25v1.5H7.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                            <div>
                                                <strong>One-off meeting</strong>
                                                <p>
                                                    Invite someone to pick a time to meet with you.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="content">
                                            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 3.19985C5 2.86848 5.26863 2.59985 5.6 2.59985H15.2C15.5314 2.59985 15.8 2.86848 15.8 3.19985C15.8 3.53122 15.5314 3.79985 15.2 3.79985H5.6C5.26863 3.79985 5 3.53122 5 3.19985Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5 7.9999C5 7.66853 5.26863 7.3999 5.6 7.3999H12C12.3314 7.3999 12.6 7.66853 12.6 7.9999C12.6 8.33127 12.3314 8.5999 12 8.5999H5.6C5.26863 8.5999 5 8.33127 5 7.9999Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5 12.8C5 12.4686 5.26863 12.2 5.6 12.2H8.8C9.13137 12.2 9.4 12.4686 9.4 12.8C9.4 13.1313 9.13137 13.4 8.8 13.4H5.6C5.26863 13.4 5 13.1313 5 12.8Z" fill="currentColor"></path><path d="M0 3.19995C0 3.46517 0.105357 3.71952 0.292893 3.90706C0.48043 4.09459 0.734784 4.19995 1 4.19995C1.26522 4.19995 1.51957 4.09459 1.70711 3.90706C1.89464 3.71952 2 3.46517 2 3.19995C2 2.93473 1.89464 2.68038 1.70711 2.49284C1.51957 2.30531 1.26522 2.19995 1 2.19995C0.734784 2.19995 0.48043 2.30531 0.292893 2.49284C0.105357 2.68038 0 2.93473 0 3.19995Z" fill="currentColor"></path><path d="M0 8C0 8.26522 0.105357 8.51957 0.292893 8.70711C0.48043 8.89464 0.734784 9 1 9C1.26522 9 1.51957 8.89464 1.70711 8.70711C1.89464 8.51957 2 8.26522 2 8C2 7.73478 1.89464 7.48043 1.70711 7.29289C1.51957 7.10536 1.26522 7 1 7C0.734784 7 0.48043 7.10536 0.292893 7.29289C0.105357 7.48043 0 7.73478 0 8H0Z" fill="currentColor"></path><path d="M0 12.9007C0 13.166 0.105357 13.4203 0.292893 13.6078C0.48043 13.7954 0.734784 13.9007 1 13.9007C1.26522 13.9007 1.51957 13.7954 1.70711 13.6078C1.89464 13.4203 2 13.166 2 12.9007C2 12.6355 1.89464 12.3812 1.70711 12.1936C1.51957 12.0061 1.26522 11.9007 1 11.9007C0.734784 11.9007 0.48043 12.0061 0.292893 12.1936C0.105357 12.3812 0 12.6355 0 12.9007Z" fill="currentColor"></path></svg>
                                            <div>
                                                <strong>Meeting poll</strong>
                                                <p>
                                                    Schedule a group meeting after offering times for a vote.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {renderContent()}
                            </>
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}
export default EventType;