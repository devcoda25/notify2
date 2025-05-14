import React, { useState } from "react";
import { Modal } from "@mui/material";
import DataSpecificHoursModal from "./DataSpecificHoursComponent";
import { CloseIcon, AddCircleOutlineIcon, ContentCopyIcon, CampaignIcon, AddIcon, CalendarMonthIcon, CloseOutlinedIcon, ListIcon, CalendarTodayOutlinedIcon } from "../Icon";
import CustomButton from "./CustomButton";
import style from "../MuiStyles/muiStyle";
import TimezoneDropdown from "./TimeZoneMenu";
import TimePickerComponent from "../TimePickerComponent";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import moment from "moment";
import dayjs from "dayjs";

const localizer = momentLocalizer(moment);
const timezones = [

    { label: "Eastern Time - US & Canada", time: "12:00am" },
    { label: "Central Time - US & Canada", time: "8:20am" },
    { label: "Mountain Time - US & Canada", time: "7:20am" },
    { label: "Pacific Time - US & Canada", time: "9:20am" },
    { label: "Alaska Time", time: "5.20am" },
    { label: "Arizona, Yukon Time", time: "5:00pm" },
    { label: "Newfoundland Time", time: "10:50am" },
];

const defaultMeetingHours = {
    Sunday: [{ from: "09:00", to: "17:00", available: true }],
    Monday: [{ from: "09:00", to: "17:00", available: true }],
    Tuesday: [{ from: "09:00", to: "17:00", available: true }],
    Wednesday: [{ from: "09:00", to: "17:00", available: true }],
    Thursday: [{ from: "09:00", to: "17:00", available: true }],
    Friday: [{ from: "09:00", to: "17:00", available: true }],
    Saturday: [{ from: "09:00", to: "17:00", available: true }],
};
const defaultEvents = [
    {
        title: "9:00am - 5:00pm",
        start: new Date(2025, 4, 2, 9, 0),
        end: new Date(2025, 4, 2, 17, 0),
    },
    {
        title: "6:00pm - 7:00pm",
        start: new Date(2025, 4, 7, 18, 0),
        end: new Date(2025, 4, 7, 19, 0),
    },
    {
        title: "12:00am - 1:00am",
        start: new Date(2025, 4, 15, 0, 0),
        end: new Date(2025, 4, 15, 1, 0),
    },
    {
        title: "9:00am - 5:00pm",
        start: new Date(2025, 4, 30, 9, 0),
        end: new Date(2025, 4, 30, 17, 0),
    },
]

const CustomToolbar = ({ label, onNavigate, currentDate }) => {
    const now = new Date();
    const disablePrev =
        currentDate.getFullYear() <= now.getFullYear() &&
        currentDate.getMonth() <= now.getMonth();
    return (
        <div className="calendar_custom_toolbar">


            <button onClick={() => onNavigate("PREV")}
                disabled={disablePrev}
                style={{
                    background: "none",
                    border: "none",
                    cursor: disablePrev ? "not-allowed" : "pointer",
                    fontSize: "18px",
                    marginRight: "10px",
                    opacity: disablePrev ? 0.3 : 1,
                    color: disablePrev ? "gray" : "black",
                }}>
                <FaChevronLeft />
            </button>
            <h2 style={{ margin: 0 }}>{label}</h2>
            <button onClick={() => onNavigate("NEXT")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>
                <FaChevronRight />
            </button>

        </div>
    );
};
const WorkingHoursModal = ({ open, onClose }) => {
    const [activeView, setActiveView] = useState("calendar");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [state, setState] = useState({
        selectedDate: null,
        showTimeSlots: false,
        showAddHours: false,
        selectedZone: "Eastern Time - US & Canada",

    })
    const [events, setEvents] = useState(defaultEvents);
    const [meetingHours, setMeetingHours] = useState(defaultMeetingHours);
    const [timePickers, setTimePickers] = useState([
        { id: Date.now(), from: '', to: '' }
    ]);
    const handleAddTimepicker = () => {
        setTimePickers([
            ...timePickers,
            { id: Date.now(), from: '', to: '' }
        ]);
    };
    const handleRemoveTimepicker = (id) => {
        const updated = timePickers.filter(tp => tp.id !== id);
        setTimePickers(updated);
    };
    const updateState = (newState) => {
        setState((prevState) => ({ ...prevState, ...newState }));
    };
    const handleNavigate = (action) => {
        let newDate = new Date(currentDate);

        if (action === "PREV") {
            newDate.setMonth(newDate.getMonth() - 1);
        } else if (action === "NEXT") {
            newDate.setMonth(newDate.getMonth() + 1);
        }

        const now = new Date();
        const isPrevDisabled =
            newDate.getFullYear() < now.getFullYear() ||
            (newDate.getFullYear() === now.getFullYear() && newDate.getMonth() < now.getMonth());

        if (action === "NEXT" || !isPrevDisabled) {
            setCurrentDate(newDate);
        }
    };
    const handleAddSlot = (day) => {
        setMeetingHours((prevHours) => ({
            ...prevHours,
            [day]: [...prevHours[day], { from: "09:00", to: "17:00", available: true }],
        }));
    };
    const handleRemoveSlot = (day, index) => {
        setMeetingHours((prev) => {
            const updateSlots = prev[day].filter((_, i) => i !== index);
            return { ...prev, [day]: updateSlots }
        })
    }
    const disablePastDates = (date) => {
        const today = dayjs().startOf('day');
        const isPast = date.isBefore(today);
        const isSunday = date.day() === 0;
        return isPast || isSunday;
    };
    const handleDateChange = (newDate) => {
        updateState({ selectedDate: newDate, showTimeSlots: true });

    };
    const handleHoursbtn = () => {
        updateState({ showAddHours: true })
    }
    const handleCloseAddHours = () => {
        updateState({ showAddHours: false })
    }

    return (
        <>
            <Modal open={open} sx={{ zIndex: 1300 }} onClose={onClose}>
                <div className="event_workinghours_modal">
                    {
                        state.showAddHours && (
                            
                            <DataSpecificHoursModal 
                                open={state.showAddHours}
                                onClose={handleCloseAddHours}
                                onDataChange={handleDateChange}
                                selectedDate={state.selectedDate}
                                disablePastDates={disablePastDates}
                                showTimeSlots={state.showTimeSlots} 
                            />
                        )
                    }
                    
                    <div className="title_content">
                        <div className="user_info">
                            <div>
                                <button className="user_logo">H</button>
                                <span>hepto</span>
                            </div>
                            <CloseOutlinedIcon onClick={onClose} sx={{ cursor: 'pointer' }} />

                        </div>
                        <div className="user_info">
                            <h3>Working hours (default)</h3>
                            <div className="toggle_container">
                                <button
                                    className={activeView === "list" ? "toggle_btn active" : "toggle_btn"}
                                    onClick={() => setActiveView("list")}
                                >
                                    <ListIcon /> List
                                </button>
                                <button
                                    className={activeView === "calendar" ? "toggle_btn active" : "toggle_btn"}
                                    onClick={() => setActiveView("calendar")}
                                >
                                    <CalendarMonthIcon /> Calendar
                                </button>
                            </div>

                        </div>

                        <div className="edit">
                            <CampaignIcon />
                            <div>Updating your schedule here will update it on </div>
                        </div>

                    </div>
                    <div className="main_content">
                        {
                            activeView === 'list' ? (
                                <div className="working_hours_list_container">
                                    <div className="left_container">
                                        <div className="title">
                                            <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="m6.5.5 2 1.75L6.5 4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M.5 4.5V3.25a1 1 0 0 1 1-1h7M3.5 9.5l-2-1.75L3.5 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.5 5.5v1.25a1 1 0 0 1-1 1h-7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                            <p>Weekly hours</p>
                                        </div>
                                        <p>Set when you are typically available for meetings</p>
                                        <div className="weekly_hours">
                                            {
                                                Object.entries(meetingHours).map(([day, slots], dayIndex) => (
                                                    <div key={dayIndex} className='setmeeting_hours_container'>
                                                        <div className="day">{day.charAt(0)}</div>
                                                        <div className="set_time_container">
                                                            {
                                                                slots.length > 0 && slots[0].available ? (
                                                                    slots.map((slot, index) => (
                                                                        <div key={index} className='set_time'>

                                                                            <TimePickerComponent
                                                                                initialValue={slot.from}
                                                                                disabled={false}
                                                                                customStyles={style.calendarlist_timePickerStyles}

                                                                            />
                                                                            <span style={{ margin: "0 5px" }}>—</span>
                                                                            <TimePickerComponent
                                                                                initialValue={slot.from}
                                                                                disabled={false}
                                                                                customStyles={style.calendarlist_timePickerStyles}

                                                                            />
                                                                            <CloseIcon onClick={() => handleRemoveSlot(day, index)} style={style.calendarlist_iconStyle} />

                                                                            {index === 0 && (
                                                                                <>
                                                                                    <AddCircleOutlineIcon onClick={() => handleAddSlot(day)} style={style.calendarlist_iconStyle} />
                                                                                    <ContentCopyIcon style={style.calendarlist_iconStyle} />
                                                                                </>
                                                                            )}

                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <> <span style={{ color: "gray" }}>Unavailable
                                                                        <AddCircleOutlineIcon onClick={() => handleAddSlot(day)} style={style.calendarlist_iconStyle} /></span>
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <TimezoneDropdown
                                            options={timezones}
                                            selectedValue={state.selectedZone}
                                            onSelect={(zone) => setState({ ...state, selectedZone: zone })}
                                        />
                                    </div>
                                    <div className="right_container">
                                        <div className="heading">
                                            <div className="title">
                                                <CalendarTodayOutlinedIcon />
                                                <p>Date-specific hours</p>
                                            </div>
                                            <CustomButton variant='outlined' icon={<AddIcon />} onClick={handleHoursbtn}>Hours</CustomButton>
                                        </div>
                                        <p>Adjust hours for specific days</p>

                                    </div>
                                </div>
                            ) : (
                                <div className="working_hours_calendar_container">
                                    <div className="timezone_container">
                                        <TimezoneDropdown
                                            options={timezones}
                                            selectedValue={state.selectedZone}
                                            onSelect={(zone) => setState({ ...state, selectedZone: zone })}
                                        /></div>
                                    <div style={{ padding: "20px 0px" }}>
                                        <Calendar
                                            localizer={localizer}
                                            events={events}
                                            startAccessor="start"
                                            endAccessor="end"
                                            views={{ month: true }}
                                            defaultView="month"
                                            date={currentDate}
                                            onNavigate={(newDate) => setCurrentDate(newDate)}
                                            components={{
                                                toolbar: (props) => (
                                                    <CustomToolbar {...props} currentDate={currentDate} onNavigate={handleNavigate} />
                                                ),
                                            }}
                                            formats={{
                                                weekdayFormat: (date, culture, localizer) => localizer.format(date, "ddd", culture).toUpperCase(),
                                            }}
                                            dayPropGetter={(date) => {
                                                const now = new Date();
                                                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                                                const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                                        
                                                if (day < today) {
                                                    // Past dates: gray background
                                                    return {
                                                        style: {
                                                            backgroundColor: '#f0f0f0', 
                                                            color: '#999'
                                                        },
                                                    };
                                                } else if (day.getTime() === today.getTime()) {
                                                    // Today: no background color
                                                    return {
                                                        style: {
                                                            backgroundColor: 'transparent'
                                                        },
                                                    };
                                                }
                                                return {}; // Default styling for future dates
                                            }}
                                         

                                            style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className="footer_container">
                        <CustomButton variant="outlined" sx={{ width: '120px' }}>cancel</CustomButton>
                        <CustomButton variant="contained" sx={{ width: '222px', marginLeft: '0px' }}>Apply to 11 event types</CustomButton>
                    </div>
                </div>
            </Modal>
        </>
    )
}
export default WorkingHoursModal;