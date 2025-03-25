import React, { useState } from "react";
import CustomButton from '../Meetings/CustomButton';
import TimeZoneMenu from "./TimeZoneMenu";
import TextfieldComponent from "../TextfieldComponent";
import { Typography, Grid, List, ListItem, ListItemButton } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
    ExpandMoreIcon,
    PublicOutlinedIcon,
    AccessTimeIcon,
    VideocamOutlinedIcon,
    BuildOutlinedIcon,
    CalendarTodayOutlinedIcon,
    ArrowBackOutlinedIcon,
    KeyboardArrowDownOutlinedIcon,
    LinkOutlinedIcon
} from '../Icon';



const timeSlots = [
    "12:00 AM", "12:30 AM", "1:00 AM", "1:30 AM", "2:00 AM", "2:30 AM", "3:00 AM", "3:30 AM", "4:00 AM", "4:30 AM", "5:00 AM", "5:30 AM", "6:00 AM", "6:30 AM", "7:00 AM",
    "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
    "5:00PM", "5:30PM", "6:00PM", "6:30PM", '7:00PM', '7:30PM', '8:00PM', '8:30PM', '9:00PM', '9:30PM', '10:00PM', '10:30PM', '11:00PM', '11:30PM'
];
const CopyMeetingLink = () => {
    const [state, setState] = useState({
        selectedDate: dayjs(),
        showTimeSlots: false,
        selectedTime: [],
        timeZoneAnchor: null,
        selectedTimeZone: "Eastern Time - US & Canada",
        eventDetails: false,
        addGuests: false,
        menuModal: false,

    })
    const updateState = (newState) => {
        setState((prevState) => ({ ...prevState, ...newState }));
    };
    const handleDateChange = (newDate) => {
        updateState({ selectedDate: newDate, showTimeSlots: true, selectedTime: [] });
    };
    const handleTimeClick = (time) => {
        updateState({
            selectedTime: [time]
        });
    };
    const disablePastDates = (date) => date.isBefore(dayjs(), "day");

    const handleTimeZoneClick = (event) => {
        updateState({ timeZoneAnchor: event.currentTarget });
    };

    const handleTimeZoneSelect = (zone) => {
        updateState({ selectedTimeZone: zone, timeZoneAnchor: null });
    };

    return (
        <>
            <div className="meeting_copylink_container">
                <div className="top_content">
                    <CustomButton variant="text" endicon={<KeyboardArrowDownOutlinedIcon />} onClick={() => updateState({ menuModal: !state.menuModal })}>Menu</CustomButton>
                    <CustomButton variant="outlined" icon={<LinkOutlinedIcon />}>Copy link</CustomButton>

                </div>
                {
                    state.menuModal && (
                        <div className="menu_content">
                            <p>Home</p>
                            <p>Edit event type</p>
                            <p>Troubleshoot Availability</p>
                        </div>
                    )
                }
                <div className="event_container">
                    <div className="event_content" style={{
                        maxWidth: state.showTimeSlots ? '949px' : '800px'
                    }}>
                        {
                            state.eventDetails ? (
                                <>
                                    <div className="left_container">
                                        <ArrowBackOutlinedIcon className="back_button" onClick={() => updateState({ eventDetails: false })} />
                                        <p>hepto</p>
                                        <h1>30 Minute Meeting</h1>
                                        <div className="timeconatiner">
                                            <div>
                                                <AccessTimeIcon /> <span>30 min</span></div>
                                            <div>
                                                <VideocamOutlinedIcon /><span>Web conferencing details provided upon confirmation.</span>
                                            </div>
                                            <div><CalendarTodayOutlinedIcon /><span>8:30pm - 9:00pm, Wednesday, March 26, 2025</span></div>
                                            <div><PublicOutlinedIcon /><span>India Standard Time</span></div>
                                        </div>
                                        <div className="button_container">
                                            <CustomButton variant='text' sx={{ color: 'blue' }}>Cookie settings</CustomButton>
                                            <CustomButton variant='text'>Report abuse</CustomButton>
                                        </div>

                                    </div>
                                    <div className="right_container" style={{ minWidth: '500px' }}>
                                        <h4>Enter Details</h4>
                                        <div className="eventdetail_content">
                                            <label>Name</label>
                                            <TextfieldComponent customStyle='new_meeting_event_textbox' />
                                        </div>
                                        <div className="eventdetail_content">
                                            <label>Email</label>
                                            <TextfieldComponent customStyle='new_meeting_event_textbox' />
                                        </div >
                                        {
                                            state.addGuests ? (
                                                <div className="addguests_container">
                                                    <label>Guest Email(s)</label>
                                                    <TextfieldComponent customStyle='new_meeting_event_textbox guestsemail_textbox' />
                                                    <p>Notify up to 10 additional guests of the scheduled event.</p>
                                                </div>
                                            ) : (
                                                <CustomButton variant="outlined" sx={{ color: '#004796', backgroundColor: '1px solid #004796' }} onClick={() => updateState({ addGuests: true })}>Add Guests</CustomButton>
                                            )
                                        }
                                        <div className="eventdetail_content">
                                            <label>Please share anything that will help prepare for our meeting.</label>
                                            <textarea className="addguests_details"></textarea>
                                        </div>
                                        <p>By proceeding, you confirm that you have read and agree to <a>Calendly's Terms of Use</a> and <a>Privacy Notice.</a></p>
                                        <CustomButton variant="contained">Schedule Event</CustomButton>
                                    </div>

                                </>
                            ) : (
                                <>
                                    <div className="left_container">

                                        <p>hepto</p>
                                        <h1>30 Minute Meeting</h1>
                                        <div className="timeconatiner">
                                            <div>
                                                <AccessTimeIcon /> <span>30 min</span>
                                            </div>
                                            <div>
                                                <VideocamOutlinedIcon /><span>Web conferencing details provided upon confirmation.</span>
                                            </div>
                                            <div className="button_container">
                                                <CustomButton variant='text' sx={{ color: 'blue' }}>Cookie settings</CustomButton>
                                                <CustomButton variant='text'>Report abuse</CustomButton>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="right_container" style={{
                                        minWidth: state.showTimeSlots ? '559px' : '300px'
                                    }}>
                                        <h3>Select a Date and Time</h3>
                                        <div className="add_time_copylink_container" style={{
                                            width: state.showTimeSlots ? '550px' : '345px'
                                        }}>

                                            <Grid container spacing={2}>

                                                <Grid item xs={12} md={state.showTimeSlots ? 6 : 12}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <StaticDatePicker
                                                            displayStaticWrapperAs="desktop"
                                                            value={state.selectedDate}
                                                            onChange={handleDateChange}
                                                            shouldDisableDate={disablePastDates}
                                                        />
                                                    </LocalizationProvider>
                                                </Grid>


                                                {state.showTimeSlots && (
                                                    <Grid item xs={12} md={6} className="timeslots_grid">
                                                        <Typography variant="h6">
                                                            {state.selectedDate
                                                                ? dayjs(state.selectedDate).format("dddd, MMMM D")
                                                                : "Select a date"}
                                                        </Typography>

                                                        <List className="timeslots_list">
                                                            {timeSlots.map((time, index) => (
                                                                <ListItem
                                                                    key={index}
                                                                    disablePadding
                                                                    className="timeslots_list_item"
                                                                    onClick={() => handleTimeClick(time)}
                                                                    sx={{

                                                                        display: "flex",
                                                                        justifyContent: "space-between",
                                                                        alignItems: "center",
                                                                        border: state.selectedTime.includes(time) ? "none" : "1px solid rgb(0 105 255 / 50%)",
                                                                        marginBottom: '20px',


                                                                    }}
                                                                >
                                                                    <ListItemButton sx={{
                                                                        backgroundColor: state.selectedTime.includes(time) ? "rgb(66, 66, 66)" : "transparent",
                                                                        color: state.selectedTime.includes(time) ? "#fff" : "rgb(0, 105, 255)",
                                                                        borderRadius: "8px",
                                                                        marginBottom: "0px",
                                                                        padding: state.selectedTime.includes(time) ? "0px 12px" : "0px 55px",
                                                                        fontSize: '12px',
                                                                        height: '46px',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                    >{time}</ListItemButton>
                                                                    {state.selectedTime.includes(time) && (
                                                                        <CustomButton variant="contained" sx={{
                                                                            marginLeft: "10px", fontSize: '12px', width: '100px', fontWeight: 'bold',
                                                                            borderRadius: '2px', padding: '0px'
                                                                        }} onClick={() => updateState({ eventDetails: true })} >
                                                                            Next
                                                                        </CustomButton>
                                                                    )}
                                                                </ListItem>
                                                            ))}
                                                        </List>

                                                    </Grid>
                                                )}
                                            </Grid>
                                            <h4>Time zone</h4>

                                            <div className="select_timezone">
                                                <div
                                                    onClick={handleTimeZoneClick} className="timezone"

                                                >
                                                    <PublicOutlinedIcon /> {state.selectedTimeZone}  <ExpandMoreIcon fontSize="small" />
                                                </div>
                                                <TimeZoneMenu anchorEl={state.timeZoneAnchor} open={Boolean(state.timeZoneAnchor)} onClose={() => updateState({ timeZoneAnchor: null })} onSelect={handleTimeZoneSelect} />
                                            </div>
                                            <CustomButton variant="outlined" icon={<BuildOutlinedIcon />}>Troubleshoot</CustomButton>
                                        </div>
                                    </div>
                                </>
                            )
                        }

                    </div>
                </div>
            </div>
        </>
    )
}
export default CopyMeetingLink;