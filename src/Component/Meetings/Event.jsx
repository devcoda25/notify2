import React, { useState } from "react";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AutocompleteComponent from "../AutocompleteComponent";
import TimeZoneMenu from "./TimeZoneMenu";
import TextfieldComponent from "../TextfieldComponent";
import TimePickerComponent from '../TimePickerComponent'
import DataSpecificHoursComponent from "./DataSpecificHoursComponent";
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography,IconButton, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions,
 Tabs, Tab
} from "@mui/material";
import {
    SettingsOutlinedIcon,
    ContentCopyOutlinedIcon,
    CloseIcon,
    ArrowForwardIosIcon,
    ChevronLeftOutlinedIcon,
    CalendarTodayOutlinedIcon,
    ExpandMoreIcon,
    PublicOutlinedIcon,
    AddCircleOutlineIcon
} from '../Icon';
import CustomButton from "./CustomButton";
import WeeklyHours from "./WeeklyHours";
import SelectDateandTimeComponent from "./SelectDateandTimeComponent";
import style from "../MuiStyles/muiStyle";
import LocationSelector from "./LocationSelector";
import ScheduleOptions from "./ScheduleOptions";


const styles = {
    tooltipStyle: {
        position: "fixed",
        bottom: 20,
        right: '33%',
        boxShadow: 3,
        borderRadius: 2,
        border: '1px solid rgb(0 105 255 / 50%)',
        background: 'rgb(242, 248, 255)',
        padding: 2,
        maxWidth: 300,
        zIndex: 1000,
        "&::before": {
            content: '""',
            position: "absolute",
            top: "20px",
            left: "-10px",
            width: "0",
            height: "0",
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderRight: "10px solid rgb(0 105 255 / 50%)",
            filter: "drop-shadow(-2px 2px 2px rgba(0,0,0,0.1))",
        },
    },
    tooltipContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    tooltipMessage: {
        fontSize: '15px'
    },
    neweventGrid: {
        maxWidth: 600,
        margin: "auto",
        marginLeft: '0px',
        paddingTop: '25px'
    },
    cardStyle: {
        display: "flex",
        alignItems: "center",
        p: 2,
        cursor: 'pointer',
        "&:hover": {
            borderColor: "blue",
        },
    },
    forwardArrow: {
        color: "gray",
        "&:hover": { color: "blue" }
    },
    title: {
        color: 'black',
        fontWeight: 600,
    },

    hostheading: {
        fontWeight: 600,
        color: 'black'
    },
    hostsubtitle: {
        marginTop: "20px",
        fontStyle: "italic",
        fontSize: "14px",
    },

    select_host: {
        color: 'black'
    },
    inviteUser: {
        "& .MuiDialog-paper": {
            width: "388px",
        },
    },
    shareBtn: {
        color: 'blue',
        border: '1px solid blue',
        width: '100px'

    },
    customizeBtn: {
        width: '237px',
        height: '41px'
    }


};
const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
];
const locationOptions = [
    { title: "In-person meeting", img: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 10" role="img"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M8 3.5c0 2.5-3 6-3 6S2 6 2 3.5a3 3 0 1 1 6 0v0Z"></path><path stroke="currentColor" d="M5 4a.5.5 0 0 1 0-1M5 4a.5.5 0 0 0 0-1"></path></svg> },
    { title: "Phone call", img: <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M6.216 9.151a2.215 2.215 0 0 0 2.758-.3l.31-.31a.738.738 0 0 0 0-1.043l-1.3-1.3a.739.739 0 0 0-1.044 0h0a.738.738 0 0 1-1.043 0L3.806 4.107a.738.738 0 0 1 0-1.043h0a.739.739 0 0 0 0-1.044L2.5.716a.738.738 0 0 0-1.043 0l-.31.31a2.214 2.214 0 0 0-.3 2.758 19.976 19.976 0 0 0 5.369 5.367Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg> },
    { title: "Zoom", img: "/assets/images/Zoom.svg" },
    { title: "Microsoft Teams", img: "/assets/images/Teams.svg" },
    { title: "Webex", img: "/assets/images/webex.svg" },
    { title: "GoTo Meeting", img: "/assets/images/gotomeeting.svg" },
];
const newEventOptions = [
    { id: 1, title: 'One-on-One', subTitle: 'One host with one invitee', description: "Good for: coffee chats, 1:1 interviews, etc.", icon: "assets/images/one_on_one.svg", popupType: 'hostSelection' },
    { id: 2, title: 'Group', subTitle: 'One host with group of invitees', description: 'Good for: webinars, online classes, etc.', icon: "assets/images/group.svg", popupType: 'hostSelection' },
    { id: 3, title: 'Collective', subTitle: 'More than one host with one invitee', description: 'Good for: panel interviews, group sales calls, etc.', icon: 'assets/images/collective.svg', popupType: "inviteUsers" },
    { id: 4, title: 'Round Robin', subTitle: 'One rotating host with one invitee', description: 'Good for destributing incoming sales leads', icon: 'assets/images/round_robin.svg', popupType: "inviteUsers" }

]

const Event = ({ onCreateClick }) => {
    const hostOptions = ['hepto(me)'];
    const durationOptions = ['15 Minutes', '30 Minutes', '45 Minutes', '1 hour', 'Custom'];
    const navigate=useNavigate();
    const [state, setState] = useState({
        open: true,
        createNewEvent: false,
        openHostModal: false,
        openInviteModal: false,
        selectedOption: null,
        selectedHost: hostOptions[0],
        shareOpen: false,
        tabIndex: 0,
        showPreview: false,
        selectedDate: dayjs(),
        showTimeSlots: false,
        selectedTime: [],
        timeZoneAnchor: null,
        durationContent: durationOptions[1],
        showLocationDropdown: false,
        selectedLocation: "",
        selectedRadioSchedule: "future",
        customizeShareModal: false,
        selectedTimeZone: "Eastern Time - US & Canada",
        isLocationCardVisible: true,
    });
    const [meetingHours, setMeetingHours] = useState({
        Sunday: [{ from: "09:00", to: "17:00", available: true }],
        Monday: [{ from: "09:00", to: "17:00", available: true }],
        Tuesday: [{ from: "09:00", to: "17:00", available: true }],
        Wednesday: [{ from: "09:00", to: "17:00", available: true }],
        Thursday: [{ from: "09:00", to: "17:00", available: true }],
        Friday: [{ from: "09:00", to: "17:00", available: true }],
        Saturday: [{ from: "09:00", to: "17:00", available: true }],
    });

    const updateState = (newState) => {
        setState((prevState) => ({ ...prevState, ...newState }));
    };

    const handleOpen = (option) => {
        updateState({
            selectedOption: option,
            openHostModal: option.popupType === "hostSelection",
            openInviteModal: option.popupType === "inviteUsers",
        });
    };

    const handleClose = () => {
        updateState({ openHostModal: false, openInviteModal: false });
    };

    const handleShareOpen = () => updateState({ shareOpen: true });
    const handleShareClose = () => updateState({ shareOpen: false });

    const handleTabChange = (event, newValue) => updateState({ tabIndex: newValue });

    const togglePreview = () => updateState({ showPreview: !state.showPreview });

    const handleTimeZoneClick = (event) => {
        updateState({ timeZoneAnchor: event.currentTarget });
    };

    const handleTimeZoneSelect = (zone) => {
        updateState({ selectedTimeZone: zone, timeZoneAnchor: null });
    };

    const handleDateChange = (newDate) => {
        updateState({ selectedDate: newDate, showTimeSlots: true, selectedTime: [] });
    };

    const handleCustomizebtn = () => updateState({ customizeShareModal: true });

    const handleAddLocation = () => updateState({ showLocationDropdown: true });

    const handleLocationChange = (event) => {
        updateState({ selectedLocation: event.target.value });
    };

    const disablePastDates = (date) => date.isBefore(dayjs(), "day");

    const handleTimeClick = (Time) => {
        updateState({
            selectedTime: state.selectedTime.includes(Time)
                ? state.selectedTime.filter((t) => t !== Time)
                : [...state.selectedTime, Time],
        });
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
    const handleCopyLink = () => {
        const urlToCopy = `${window.location.origin}/hepto`;
        navigator.clipboard.writeText(urlToCopy).catch((err) =>
            console.error("Failed to copy:", err)
        );
    };
    const handleEventClose = () => {
        setState((prev) => ({ ...prev, isLocationCardVisible: false }));
      };
    const handleCardClick=(option)=>{
        if (option.title === "One-on-One") {
            navigate('/one-on-one');
          } else {
          
          }
    }
    // const [open, setOpen] = useState(true);
    // const [createNewEvent, setCreateNewEvent] = useState(false);
    // const [openHostModal, setOpenHostModal] = useState(false);
    // const [openInviteModal, setOpenInviteModal] = useState(false);
    // const [selectedOption, setSelectedOption] = useState(null);
    // const [selectedHost, setSelectedHost] = useState(hostOptions[0]);
    // const [shareOpen, setShareOpen] = useState(false);
    // const [tabIndex, setTabIndex] = useState(0);
    // const [showPreview, setShowPreview] = useState(false);
    // const [selectedDate, setSelectedDate] = useState(dayjs());
    // const [showTimeSlots, setShowTimeSlots] = useState(false);
    // const [selectedTime, setSelectedTime] = useState([]);
    // const [timeZoneAnchor, setTimeZoneAnchor] = useState(null);
    // const [durationContent, setDurationContent] = useState(durationOptions[1]);
    // const [showLocationDropdown, setLocationDropdown] = useState(false);
    // const [selectedLocation, setSelectedLocation] = useState("");
    // const [selectedRadioSchedule, setSelectedRadioSchedule] = useState("future")
    // const [customizeShareModal, setCustomizeShareModal] = useState(false);
    // const [selectedTimeZone, setSelectedTimeZone] = useState("Eastern Time - US & Canada");

    // const handleOpen = (option) => {
    //     setSelectedOption(option)
    //     if (option.popupType === 'hostSelection') {
    //         setOpenHostModal(true);
    //     }
    //     else if (option.popupType === 'inviteUsers') {
    //         setOpenInviteModal(true);
    //     }
    // }
    // const handleClose = () => {
    //     setOpenHostModal(false);
    //     setOpenInviteModal(false);
    // };

    // const handleShareOpen = () => setShareOpen(true);
    // const handleShareClose = () => setShareOpen(false);
    // const handleTabChange = (event, newValue) => setTabIndex(newValue);

    // const togglePreview = () => setShowPreview(!showPreview);



    // const handleTimeZoneClick = (event) => {
    //     setTimeZoneAnchor(event.currentTarget);
    // };

    // const handleTimeZoneSelect = (zone) => {
    //     setSelectedTimeZone(zone);
    //     setTimeZoneAnchor(null);
    // };
    // const handleDateChange = (newDate) => {
    //     setSelectedDate(newDate);
    //     setShowTimeSlots(true);
    //     setSelectedTime([]);
    // };

    // const handleCustomizebtn = () => {
    //     setCustomizeShareModal(true);
    // }
    // const handleAddLocation = () => {
    //     setLocationDropdown(true);
    // }
    // const handleLocationChange = (event) => {
    //     setSelectedLocation(event.target.value)
    // }
    // const disablePastDates = (date) => {
    //     return date.isBefore(dayjs(), "day");
    // };
    // const handleTimeClick = (Time) => {
    //     setSelectedTime((prevTimes) =>
    //         prevTimes.includes(Time) ? prevTimes.filter((t) => t !== Time) : [...prevTimes, Time]
    //     )
    // }

    return (
        <>
            <div className="calendar_Eventtype">
                {
                    state.customizeShareModal ? (
                        <>
                            <Dialog open={state.customizeShareModal} className="customizationShareModal">
                                <DialogTitle >Customize once and share</DialogTitle>
                                <DialogContent>
                                    <p className="content_text">Modify the details or available hours of this event type before sharing it with someone</p>
                                    <p className="meet_heading">Meeting details</p>
                                    <div>
                                        <label>Event name</label>
                                        <TextfieldComponent placeholder='30 Minute Meeting' customStyle='new_meeting_event_textbox' />
                                    </div>
                                    <div>
                                        <label>Duration</label>
                                        <AutocompleteComponent
                                            options={durationOptions}
                                            value={state.durationContent}
                                            onChange={(event, newValue) => updateState({ durationContent: newValue })}
                                            customStyles={{...style.newticketsAutocomplete,width:'50%'}}
                                        />
                                    </div>
                                    <div>
                                     
                                        <LocationSelector
                                            selectedLocation={state.selectedLocation}
                                            showLocationDropdown={state.showLocationDropdown}
                                            locationOptions={locationOptions}
                                            handleLocationChange={handleLocationChange}
                                            handleAddLocation={handleAddLocation}
                                            onClose={handleEventClose} 
                                            isLocationCardVisible={state.isLocationCardVisible}
                                        />
                                        <div className="scedule_data">
                                            <p className="meet_heading">Availability offered</p>
                                            <label>Data Range</label>
                                            <ScheduleOptions selectedValue={state.selectedRadioSchedule} onChange={(e) => updateState({ selectedRadioSchedule: e.target.value })} />
                                          
                                            <div>
                                                
                                                <div>
                                                    <label>Weekly Hours</label>
                                                    <div className="select_timezone">
                                                        <div
                                                            onClick={handleTimeZoneClick} className="timezone"

                                                        >
                                                            <PublicOutlinedIcon /> {state.selectedTimeZone}  <ExpandMoreIcon fontSize="small" />
                                                        </div>
                                                        <TimeZoneMenu anchorEl={state.timeZoneAnchor} open={Boolean(state.timeZoneAnchor)} onClose={() => updateState({ timeZoneAnchor: null })} onSelect={handleTimeZoneSelect} />
                                                    </div>
                                                    {/* <div>
                                                        {
                                                            Object.entries(meetingHours).map(([day, slots], dayIndex) => (
                                                                <div key={dayIndex} className='setmeeting_hours_container'>
                                                                    <div className="day">
                                                                        <input type="checkbox" checked={true} />
                                                                        <div>{day.slice(0, 3)}</div>
                                                                    </div>
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
                                                    </div> */}
                                                    <div>  <WeeklyHours meetingHours={meetingHours} setMeetingHours={setMeetingHours} /></div>

                                                    <div>
                                                        <DataSpecificHoursComponent />

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </>
                    ) : (
                        <Dialog open={state.shareOpen} onClose={handleShareClose} fullWidth className="event_share_btn_container">
                            <DialogTitle className="title">30 Minute Meeting</DialogTitle>

                            <DialogContent>
                                <div className="meet_details">
                                    <p>30 mins</p>
                                    <p>one-on-one</p>
                                    <p><img src="/assets/images/Googlemeet.svg" />Google meet</p>
                                </div>
                                <Tabs value={state.tabIndex} onChange={handleTabChange} centered>
                                    <Tab label="Share a Link" />
                                    <Tab label="Add times to email" />
                                </Tabs>

                                {/* Tab Content */}
                                <div>
                                    {state.tabIndex === 0 && (
                                        <div className="sharelink">
                                            {
                                                state.showPreview ? (
                                                    <div className="event_preview_btn_container">
                                                        <div className='event_preview_heading' style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <h4>PREVIEW</h4>
                                                            <CustomButton variant='text' onClick={togglePreview} sx={{ color: 'blue' }}>Hide Preview</CustomButton>
                                                        </div>
                                                        <p>Available event times</p>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <StaticDatePicker
                                                                displayStaticWrapperAs="desktop"
                                                                value={state.selectedDate}
                                                                onChange={(newDate) => updateState({ selectedDate: newDate })}
                                                            />
                                                        </LocalizationProvider>
                                                        <div className="select_timezone">
                                                            <div
                                                                onClick={handleTimeZoneClick} className="timezone"

                                                            >
                                                                <PublicOutlinedIcon /> {state.selectedTimeZone}  <ExpandMoreIcon fontSize="small" />
                                                            </div>
                                                            <TimeZoneMenu anchorEl={state.timeZoneAnchor} open={Boolean(state.timeZoneAnchor)} onClose={() => updateState({ timeZoneAnchor: null })} onSelect={handleTimeZoneSelect} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p>Copy and paste your scheduling link into a message</p>

                                                        <div className="copy_link_container">
                                                            <span className="copy_link_text">
                                                                https://calendly.com/hepto/30min
                                                            </span>
                                                            {/* <button className="copy_link_button">Copy Link</button> */}
                                                            <CustomButton variant="contained">Copy Link</CustomButton>
                                                        </div>
                                                        <a className="preview" onClick={togglePreview}><CalendarTodayOutlinedIcon />Preview Availability</a>

                                                        <div className="customization_container">
                                                            <h4>Customize one and share</h4>
                                                            <div className="customize_content">
                                                                <p>Make a one-off change to your available hours before sharing. This won’t affect your primary link.</p>
                                                                <CustomButton variant="outlined" onClick={handleCustomizebtn} sx={{ ...styles.customizeBtn }}>Customize & share</CustomButton>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }

                                        </div>
                                    )}

                                    {state.tabIndex === 1 && (
                                        <>
                                            <p className="sharecontainer_choose_date">Choose dates and times to share</p>
                                            <div className="add_time_toemail_container" style={{ width: state.showTimeSlots ? '550px' : '400px' }}>

                                                {/* <Grid container spacing={2}>

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
                                                                    <ListItem key={index} disablePadding className="timeslots_list_item" onClick={() => handleTimeClick(time)}
                                                                        sx={{
                                                                            backgroundColor:
                                                                                state.selectedTime.includes(time) ? "rgb(0, 105, 255)" : "transparent",
                                                                            color: state.selectedTime.includes(time) ? "#fff" : "rgb(0, 105, 255)",
                                                                        }}>
                                                                        <ListItemButton>{time}</ListItemButton>
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        </Grid>
                                                    )}
                                                </Grid> */}
                                                <SelectDateandTimeComponent selectedDate={state.selectedDate}
                                                    showTimeSlots={state.showTimeSlots}
                                                    selectedTime={state.selectedTime}
                                                    updateState={updateState}
                                                />

                                                <div className="select_timezone">
                                                    <div
                                                        onClick={handleTimeZoneClick} className="timezone"

                                                    >
                                                        <PublicOutlinedIcon /> {state.selectedTimeZone}  <ExpandMoreIcon fontSize="small" />
                                                    </div>
                                                    <TimeZoneMenu anchorEl={state.timeZoneAnchor} open={Boolean(state.timeZoneAnchor)} onClose={() => updateState({ timeZoneAnchor: null })} onSelect={handleTimeZoneSelect} />
                                                </div>
                                                <p>Dates Selected : <b>0/7</b></p>
                                                <p>Time slot Selected:<b>0</b></p>
                                            </div>
                                            <div className="event_share_btn_container">
                                                <CustomButton variant="text">Close</CustomButton>
                                                <CustomButton variant='contained'>Continue</CustomButton>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )
                }

                {
                    state.createNewEvent ? (
                        <>
                            <div className="back_button" onClick={() => updateState({ createNewEvent: false })}><ChevronLeftOutlinedIcon />Back</div>
                            <h1>Create New Event Type</h1>
                            <Grid container spacing={2} sx={{ ...styles.neweventGrid }}>
                                {newEventOptions.map((option, index) => (
                                    <Grid item xs={12} key={index} sx={{ paddingTop: '0px !important' }}>
                                        <Card variant="outlined" sx={{ ...styles.cardStyle }} onClick={()=>handleCardClick(option)}>
                                            <Box sx={{ mr: 2 }}><img src={option.icon} /></Box>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" sx={{ ...styles.title }}>{option.title}</Typography>
                                                <Typography variant="subtitle1" color="textSecondary" sx={{ ...styles.title }}>
                                                    {option.subTitle}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {option.description}
                                                </Typography>
                                            </CardContent>
                                            <ArrowForwardIosIcon fontSize="small" color="disabled" sx={{ ...styles.forwardArrow }}
                                                // onClick={() => handleOpen(option)}
                                                 />
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            {/* <Dialog open={state.openHostModal} onClose={handleClose} >
                                <DialogTitle sx={{ ...styles.hostheading }}>
                                    Who will host this {state.selectedOption?.title.toLowerCase()} event type?
                                </DialogTitle>
                                <DialogContent>
                                    <Typography sx={{ mb: 2 }}>
                                        Create a {state.selectedOption?.title.toLowerCase()} event type for
                                        yourself or on behalf of another user.
                                    </Typography>
                                    <Typography className="select_host">Choose a host</Typography>
                                    <AutocompleteComponent
                                        options={hostOptions}
                                        value={state.selectedHost}
                                        onChange={(event, newValue) => updateState({ selectedHost: newValue })}
                                        customStyles={style.newticketsAutocomplete}
                                    />
                                    <Typography sx={{ ...styles.hostsubtitle }}>
                                        You'll be the owner of this event type so you'll be able to edit it.
                                    </Typography>
                                </DialogContent>
                                <DialogActions>
                                    <CustomButton variant="text" onClick={handleClose}>Cancel</CustomButton>
                                    <CustomButton variant="contained" onClick={handleClose}>Next</CustomButton>

                                </DialogActions>
                            </Dialog> */}

                            <Dialog open={state.openInviteModal} onClose={handleClose} sx={{ ...styles.inviteUser }}>
                                <DialogTitle sx={{ ...styles.hostheading }}>Invite people to your account</DialogTitle>
                                <DialogContent>
                                    <Typography>
                                        Get started with Round Robin and other shared event types by
                                        inviting people to join your Calendly account.
                                    </Typography>
                                </DialogContent>
                                <DialogActions>

                                    <CustomButton onClick={handleClose} variant="outlined" sx={{ width: '130px' }}>
                                        Cancel
                                    </CustomButton>
                                    <CustomButton onClick={handleClose} variant="contained">Invite users</CustomButton>
                                </DialogActions>
                            </Dialog>
                            <div className="event_create_meeting_card">
                                <p className="heading">More ways to meet</p>
                                <div className="card_content">
                                    <div className="create_meet">
                                        <p className="card_title">One-off meeting</p>
                                        <p>Invite someone to pick a time with you without creating an Event Type.</p>
                                        <a className="create_button" onClick={onCreateClick}>Create</a>
                                    </div>
                                    <div className="create_meet">
                                        <p className="card_title">Meeting pool</p>
                                        <p>Let your group of invitees vote on a time that works for everyone.</p>
                                        <a className="create_button" onClick={onCreateClick}>Create</a>
                                    </div>
                                </div>
                            </div>

                        </>
                    ) : (
                        <>
                            <h1>Event types</h1>

                            <div>
                                <div className="mail_account_container">
                                    <div className="mail_acc">
                                        <button className="user_logo">H</button>
                                        <div className="user_name"><p>hepto</p>
                                            <a>https://calendly.com/hepto</a>
                                        </div>
                                    </div>
                                    <div className="new_event_content">
                                        <CustomButton variant='outlined' onClick={() => updateState({ createNewEvent: true })} >+ New Event Type</CustomButton>
                                        <SettingsOutlinedIcon />
                                    </div>
                                </div>
                                <div className="event_type_card_list">
                                    <div className="meeting_card">
                                        <div className="event_type_card_cap"></div>
                                        <div className="selected_card">
                                            <input type="checkbox" />
                                            <SettingsOutlinedIcon />
                                        </div>
                                        <div className="selected_meeting_time">
                                            <h2>30 Minute Meeting</h2>
                                            <p>30 min, One-on-One</p>
                                            <a>View booking page</a>
                                        </div>
                                        <div className="meeting_card_button">
                                            <CustomButton variant="text" icon={<ContentCopyOutlinedIcon />} sx={{ color: 'blue' }} onClick={handleCopyLink}>Copy link</CustomButton>

                                            <CustomButton variant="outlined" onClick={handleShareOpen} sx={{ ...styles.shareBtn }}>Share</CustomButton>
                                        </div>
                                        <Box sx={{ ...styles.tooltipStyle }}  >
                                            <Box sx={{ ...styles.tooltipContainer }} >
                                                <Typography fontWeight="bold">Get your first meeting booked!</Typography>
                                                <IconButton size="small" onClick={() => updateState({ open: false })}>
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                            <Typography variant="body2" mt={1} sx={{ ...styles.tooltipMessage }}>
                                                You've successfully set up your first event. Preview your page, copy your link, or share your availability from here.
                                            </Typography>
                                            <CustomButton variant="contained" onClick={() => updateState({ open: false })} sx={{ marginLeft: '113px' }}>Got it</CustomButton>

                                        </Box>
                                    </div>

                                </div>
                            </div>

                        </>
                    )
                }

            </div >
        </>
    )
}
export default Event;