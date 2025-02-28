import React, { useState } from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { Grid, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AutocompleteComponent from "../Component/AutocompleteComponent";
import TimePickerComponent from "../Component/TimePickerComponent";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';


const styles = {
    newticketsAutocomplete: {
        height: '32px',
        border: '1px solid #c9c9cd',
        width: '50%',
        '&:hover': {
            border: '1px solid blue !important',
        },
        '&.Mui-focused': {
            border: '1px solid blue !important',
            outline: 'none',
        },


    },
    timePickerStyles: {
        background: 'white',
        border: '1px solid #a6bbd1',

        "& .MuiOutlinedInput-root": {

            "&:hover fieldset": {
                border: "2px solid #006bff",


            },
            "&.Mui-focused fieldset": {
                border: "2px solid #006bff",


            },
        },
    },
    iconStyle: {
        marginLeft: '10px',
        cursor: "pointer",
        width: "16px",
        height: "16px"
    },
    buttonStyles: (selected) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        padding: "12px",
        border: selected ? "2px solid #0057FF" : "1px solid #ccc",
        backgroundColor: selected ? "#F0F7FF" : "#fff",
        textTransform: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "bold",
        gap: "10px",
        color: selected ? "#0057FF" : "black",
        cursor: "pointer",
        "&:hover": {
            border: "2px solid #0057FF",
            background: 'white'
        },
    }),
}
const locations = [
    { id: 'zoom', name: 'Zoom', icon: '/assets/images/Zoom.svg' },
    { id: 'googlemeet', name: 'Google Meet', icon: "/assets/images/Googlemeet.svg" },
    { id: 'teams', name: 'Microsoft Teams', icon: '/assets/images/Teams.svg' },
    { id: 'notify', name: 'Notify', icon: '' },
    { id: 'inperson', name: 'In-person', icon: FmdGoodOutlinedIcon },
    { id: 'call', name: 'Phone call', icon: LocalPhoneOutlinedIcon }
]
const CalendarButton = ({ imageSrc, name, onClick, isConnected }) => {
    return (
        <button className="button_calendar" onClick={onClick}>
            <img className="calendar_image" src={imageSrc} alt={`${name} Logo`} />
            <div className="calendar_name">{name}</div>
            <div className={`connect_btn ${isConnected ? "Connected" : ""}`}>{isConnected ? "Connected" : "Connect"}</div>
        </button>
    );
};
const Meetings = () => {
    const mailAccountOptions = ['hepto@gmail.com'];
    const [selectedCalendar, setSelectedCalendar] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [showEditModal, setEditModal] = useState(false);
    const [mailAccount, setMailAccount] = useState(mailAccountOptions[0]);
    const [showWeeklyHours, setShowWeeklyHours] = useState(false);
    const [showLocation, setShowLocation] = useState(false);
    const [meetingHours, setMeetingHours] = useState({
        Sunday: [{ from: "09:00", to: "17:00", available: true }],
        Monday: [{ from: "09:00", to: "17:00", available: true }],
        Tuesday: [{ from: "09:00", to: "17:00", available: true }],
        Wednesday: [{ from: "09:00", to: "17:00", available: true }],
        Thursday: [{ from: "09:00", to: "17:00", available: true }],
        Friday: [{ from: "09:00", to: "17:00", available: true }],
        Saturday: [{ from: "09:00", to: "17:00", available: true }],
    });
    const [selectedLocation, setSelectedLocation] = useState('googlemeet');
    const handlerCalendarSelect = (imageSrc, name) => {
        setSelectedCalendar({ imageSrc, name });
    }
    const handleNextClick = () => {
        if (!showConfirmation) {
            setShowConfirmation(true);
        } else if (!showWeeklyHours) {
            setShowWeeklyHours(true);
        }
        else if (showWeeklyHours) {
            setShowLocation(true);
        }
    };
    const handleBackClick = () => {
        if (showWeeklyHours) {
            setShowWeeklyHours(false);
        } else if (showConfirmation) {
            setShowConfirmation(false);
        }
    };
    const handleRemoveSlot = (day, index) => {
        setMeetingHours((prev) => {
            const updateSlots = prev[day].filter((_, i) => i !== index);
            return { ...prev, [day]: updateSlots }
        })
    }
    const handleAddSlot = (day) => {
        setMeetingHours((prevHours) => ({
            ...prevHours,
            [day]: [...prevHours[day], { from: "09:00", to: "17:00", available: true }],
        }));
    };
    return (
        <>
            <div className='maincontent'>
                <div className="meetings_container">
                    <div className="left_container">
                        <div className="left_content">
                            {
                                !showConfirmation && !showWeeklyHours && !showLocation ? (
                                    <>
                                        <h1 className="heading">Set up the calendar that will be used to check for existing events</h1>
                                        <div className="calendar_container">
                                            <CalendarButton
                                                imageSrc="/assets/images/google_calendar.svg"
                                                name="Google Calendar"
                                                onClick={() => handlerCalendarSelect("/assets/images/google_calendar.svg", "Google Calendar")}
                                            />
                                            <CalendarButton
                                                imageSrc="/assets/images/outlook.svg"
                                                name="Outlook Calendar"
                                                onClick={() => handlerCalendarSelect("/assets/images/outlook.svg", "Outlook Calendar")} />
                                            <CalendarButton
                                                imageSrc="/assets/images/exchange.svg"
                                                name="Exchange Calendar"
                                                onClick={() => handlerCalendarSelect("/assets/images/exchange.svg", "Exchange Calendar")} />
                                        </div>
                                    </>
                                ) : showConfirmation && !showWeeklyHours && !showLocation ? (
                                    <>
                                        <h1 className="heading">Set up how your calendar will be used</h1>
                                        <div className="calendar_container">
                                            <h2>Your Calendar</h2>
                                            <CalendarButton
                                                imageSrc={selectedCalendar.imageSrc}
                                                name={selectedCalendar.name}
                                                isConnected={true} />
                                            <button className="select_different_calendar_btn" onClick={() => setShowCalendarModal(true)}>Use a different calendar</button>
                                            <div className="check_conflicts">
                                                <h2>Check for conflicts</h2>
                                                <p>Select calendar(s) to check for conflicts to prevent double bookings.</p>
                                                <ul>
                                                    <li>hepto@gmail.com</li>
                                                </ul>
                                                <button className="select_different_calendar_btn" onClick={() => setEditModal(true)}>Edit</button>

                                            </div>
                                            <div className="add_calendar">
                                                <h2>Add Calendar</h2>
                                                <p>Select the calendar you would like to add new events to as they’re scheduled.</p>
                                                <AutocompleteComponent
                                                    options={mailAccountOptions}
                                                    value={mailAccount}
                                                    onChange={(event, newValue) => setMailAccount(newValue)}
                                                    customStyles={styles.newticketsAutocomplete}
                                                />
                                                <div className="deleting_event_container">
                                                    <input type='checkbox' /><span className="deleting_event">Deleting or declining an event in your calendar will also cancel it in Calendly.</span>
                                                </div>
                                            </div>
                                            {
                                                showCalendarModal && (
                                                    <>
                                                        <Dialog open={showCalendarModal} onClose={() => setShowCalendarModal(false)} className="select_different_calendar">
                                                            <DialogTitle>
                                                                <h2>Use a different calendar</h2>
                                                                <IconButton
                                                                    onClick={() => setShowCalendarModal(false)}
                                                                    style={{ position: 'absolute', right: 8, top: 8, color: 'black' }}
                                                                >
                                                                    <CloseIcon />
                                                                </IconButton>
                                                                <p>Switching to a different calendar won't change how you sign in. You can modify this later.</p>
                                                            </DialogTitle>
                                                            <DialogContent>
                                                                <div className="calendar_container">
                                                                    <CalendarButton
                                                                        imageSrc="/assets/images/google_calendar.svg"
                                                                        name="Google Calendar"
                                                                        onClick={() => handlerCalendarSelect("/assets/images/google_calendar.svg", "Google Calendar")}
                                                                    />
                                                                    <CalendarButton
                                                                        imageSrc="/assets/images/outlook.svg"
                                                                        name="Outlook Calendar"
                                                                        onClick={() => handlerCalendarSelect("/assets/images/outlook.svg", "Outlook Calendar")} />
                                                                    <CalendarButton
                                                                        imageSrc="/assets/images/exchange.svg"
                                                                        name="Exchange Calendar"
                                                                        onClick={() => handlerCalendarSelect("/assets/images/exchange.svg", "Exchange Calendar")} />
                                                                </div>
                                                            </DialogContent>

                                                        </Dialog>
                                                    </>
                                                )
                                            }
                                            {
                                                showEditModal && (
                                                    <>
                                                        <Dialog open={showEditModal} onClose={() => setEditModal(false)} className="calendar_edit_modal">
                                                            <DialogTitle>
                                                                <h2>Check for conflicts</h2>
                                                                <p>Select calendar(s) to check for conflicts to prevent double bookings.</p>
                                                            </DialogTitle>
                                                            <DialogContent>
                                                                <div>
                                                                    <input type='checkbox' /><span className="mail_id">hepto@gmail.com</span>

                                                                </div>
                                                                <div className="button_container">
                                                                    <button className="cancelbutton" onClick={() => setEditModal(false)}>Cancel</button>
                                                                    <button className="updatebutton" onClick={() => setEditModal(false)}>Update</button>
                                                                </div>
                                                            </DialogContent>

                                                        </Dialog>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </>
                                ) : showWeeklyHours && !showLocation ? (
                                    <div className="weekly_hours">
                                        <h1 className="heading">When are you available to meet with people?</h1>
                                        <p>You’ll only be booked during these times (you can change these times and add other schedules later)</p>
                                        <div className="calendar_container">
                                            <h2>Weekly hours</h2>
                                            <p>Set when you are typically available for meetings</p>

                                            <div>
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
                                                                                    customStyles={styles.timePickerStyles}

                                                                                />
                                                                                <span style={{ margin: "0 5px" }}>—</span>
                                                                                <TimePickerComponent
                                                                                    initialValue={slot.from}
                                                                                    disabled={false}
                                                                                    customStyles={styles.timePickerStyles}

                                                                                />
                                                                                <CloseIcon onClick={() => handleRemoveSlot(day, index)} style={styles.iconStyle} />

                                                                                {index === 0 && (
                                                                                    <>
                                                                                        <AddCircleOutlineIcon onClick={() => handleAddSlot(day)} style={styles.iconStyle} />
                                                                                        <ContentCopyIcon style={styles.iconStyle} />
                                                                                    </>
                                                                                )}

                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <> <span style={{ color: "gray" }}>Unavailable
                                                                            <AddCircleOutlineIcon onClick={() => handleAddSlot(day)} style={styles.iconStyle} /></span>
                                                                        </>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>

                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <h1 className="heading">How would you like to meet with people?</h1>
                                            <p>Set a meeting location for your first scheduling link. You can always change this later.</p>
                                            <div className="calendar_container">
                                                <Grid container spacing={2}>
                                                    {
                                                        locations.map((location) => (
                                                            <Grid item xs={6} key={location.id}>
                                                                <Button sx={styles.buttonStyles(selectedLocation === location.id)} onClick={() => setSelectedLocation(location.id)}>
                                                                    {typeof location.icon === "string" && location.icon ? (
                                                                        <img src={location.icon} alt={location.name} width="20" height="20" />
                                                                    ) : location.icon ? (
                                                                        React.createElement(location.icon)
                                                                    ) : null}
                                                                    {location.name}
                                                                </Button>
                                                            </Grid>
                                                        ))
                                                    }
                                                </Grid>
                                            </div>
                                        </div>
                                    </>
                                )
                            }

                            <div className="footer_button">
                                {showConfirmation && <button className="backbutton" onClick={handleBackClick}><ArrowBackIosIcon /> Back</button>}
                                <button className="nextbutton" onClick={handleNextClick}>Next</button>
                            </div>
                        </div>
                    </div>
                    <div className="right_container">
                        {!showWeeklyHours && !showLocation ? (
                            <div>
                                <div className="calendar_connection">
                                    <img src='/assets/images/calendarconnection.svg' alt="Calendar Connection" />
                                </div>
                                <img src='/assets/images/calendar.svg' className="right_calendar" alt="Calendar" />
                            </div>
                        ) : showWeeklyHours && !showLocation ? (
                            <div>
                                <img src='/assets/images/availability.svg' alt="Availability" className="availability_image" />
                            </div>
                        ) : (

                            <div>
                                <img src='/assets/images/Location.svg' />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
export default Meetings;