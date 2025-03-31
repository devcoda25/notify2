import React, { useState } from "react";
import CustomButton from "./CustomButton";
import SelectDateandTimeComponent from "./SelectDateandTimeComponent";
import TimeZoneMenu from "./TimeZoneMenu";
import { Popover, IconButton, Switch, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import dayjs from "dayjs";
import TextfieldComponent from "../TextfieldComponent";
import AutocompleteComponent from "../AutocompleteComponent";
import style from "../MuiStyles/muiStyle";
import LocationSelector from "./LocationSelector";
import SelectEventLocation from "./SelectEventLocation";
import {
    ArrowBackIosIcon, SettingsOutlinedIcon, LinkOutlinedIcon, IosShareOutlinedIcon, MenuIcon, ArrowForwardIosOutlinedIcon, PeopleAltOutlinedIcon, CalendarTodayOutlinedIcon, EventNoteIcon, EmailOutlinedIcon, AccessTimeIcon, VideocamOutlinedIcon, PublicOutlinedIcon, ExpandMoreIcon, BuildOutlinedIcon, CircleIcon, ArrowDropDownIcon, VideoCameraFrontIcon,
    PhoneIcon, EditOutlinedIcon,
    RoomIcon,
    MoreVertOutlinedIcon,
    ChatBubbleOutlineOutlinedIcon, LockOutlinedIcon,
} from '../Icon'
import TextEditor from "./TextEditor";
import ScheduleOptions from "./ScheduleOptions";
import SearchboxComponent from "../SearchboxComponent";

const eventOptions = [
    { icon: <VideoCameraFrontIcon />, label: "Zoom" },
    { icon: <PhoneIcon />, label: "Phone" },
    { icon: <RoomIcon />, label: "In-person" },
];
const locationOptions = [
    { title: "In-person meeting", img: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 10" role="img"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M8 3.5c0 2.5-3 6-3 6S2 6 2 3.5a3 3 0 1 1 6 0v0Z"></path><path stroke="currentColor" d="M5 4a.5.5 0 0 1 0-1M5 4a.5.5 0 0 0 0-1"></path></svg> },
    { title: "Phone call", img: <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M6.216 9.151a2.215 2.215 0 0 0 2.758-.3l.31-.31a.738.738 0 0 0 0-1.043l-1.3-1.3a.739.739 0 0 0-1.044 0h0a.738.738 0 0 1-1.043 0L3.806 4.107a.738.738 0 0 1 0-1.043h0a.739.739 0 0 0 0-1.044L2.5.716a.738.738 0 0 0-1.043 0l-.31.31a2.214 2.214 0 0 0-.3 2.758 19.976 19.976 0 0 0 5.369 5.367Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg> },
    { title: "Zoom", img: "/assets/images/Zoom.svg" },
    { title: "Microsoft Teams", img: "/assets/images/Teams.svg" },
    { title: "Webex", img: "/assets/images/webex.svg" },
    { title: "GoTo Meeting", img: "/assets/images/gotomeeting.svg" },
];
const notifications = [
    { icon: <EmailOutlinedIcon />, title: "Calendar invitation", subtitle: "Immediately after booking", switchStatus: "" },
    { icon: <EmailOutlinedIcon />, title: "Email reminders", switchStatus: "off" },
    { icon: <ChatBubbleOutlineOutlinedIcon />, title: "Text reminders", switchStatus: "off" },
    { icon: <EmailOutlinedIcon />, title: "Email Follow-up", switchStatus: "off" }
];
const colors = ["#FF5722", "#FF4081", "#D96EFF", "#673AB7", "#2196F3", "#00BCD4", "#4CAF50", "#FFEB3B", "#FFC107"];
const durationOptions = ['15 Minutes', '30 Minutes', '45 Minutes', '1 hour', 'Custom'];
const bufferTimeOptions = ['0 min', '5 min', '10 min', '15 min', '30 min', '45 min'];
const miniumNoticeOptions = ['minutes', 'hours', 'days'];
const startTimeIncrementsOptions=['5 min','10 min','15 min','20 min','30 min','custom']

const EditEventType = () => {

    const [state, setState] = useState({
        selectedDate: dayjs(),
        showTimeSlots: false,
        selectedTime: [],
        timeZoneAnchor: null,
        selectedTimeZone: "Eastern Time - US & Canada",
        selectedCard: null,
        selectedColor: "#DA70D6",
        anchorEl: null,
        durationContent: durationOptions[1],
        showLocationDropdown: false,
        selectedLocation: "",
        isLocationCardVisible: true,
        anchorElNotification: null,
        selectedNotification: null,
        selectedRadioSchedule: "future",
        searchTerm: "",
        copyModal: false,
        isBufferOpen: false,
        bufferBeforeEvent: bufferTimeOptions[0],
        bufferAfterEvent: bufferTimeOptions[0],
        isMinimumNotice: false,
        minimumNoticeContent: miniumNoticeOptions[1],
        isDailyLimit: false,
        IsTimeZoneDisplay: false,
        isStartTimeIncrements: false,
        startTimeIncrementsContent:startTimeIncrementsOptions[4],

    })
    const updateState = (newState) => {
        setState((prevState) => ({ ...prevState, ...newState }));
    };
    const handleTimeZoneClick = (event) => {
        updateState({ timeZoneAnchor: event.currentTarget });
    };

    const handleTimeZoneSelect = (zone) => {
        updateState({ selectedTimeZone: zone, timeZoneAnchor: null });
    };

    const handleOpen = (event) => {
        updateState({ anchorEl: event.currentTarget });
    };

    const handleClose = () => {
        updateState({ anchorEl: null });
    };

    const handleColorSelect = (color) => {
        updateState({ selectedColor: color, anchorEl: null });
    };
    const handleAddLocation = () => updateState({ showLocationDropdown: true });

    const handleLocationChange = (event) => {
        updateState({ selectedLocation: event.target.value });
    };
    const handleEventClose = () => {
        setState((prev) => ({
            ...prev,
            isLocationCardVisible: false,
        }));
    };
    const handleCardClick = (cardTitle) => {
        updateState({ selectedCard: cardTitle });
    };
    const handleOpenPopover = (event, notification) => {
        updateState({
            anchorElNotification: event.currentTarget,
            selectedNotification: notification
        });
    };


    const handleClosePopover = () => {
        updateState({
            anchorElNotification: null,
            selectedNotification: null
        });
    };
    return (
        <>
            <div className="edit_event_type_container">
                <div className="left_container">
                    {
                        state.selectedCard ? (
                            <div className="edit_event_details">
                                <div className="event_header">
                                    <CustomButton variant="text" icon={<ArrowBackIosIcon />} onClick={() => updateState({ selectedCard: null })}>Event Type Summary</CustomButton>
                                    <h3>{state.selectedCard}</h3>
                                </div>
                                <div className="details_main_content">
                                    {
                                        state.selectedCard === 'Event details' && (
                                            <>
                                                <div>
                                                    <label>Event name</label>
                                                    <div className="details_event_name">
                                                        <div className="color_container">
                                                            <IconButton onClick={handleOpen} style={{ backgroundColor: state.selectedColor }}>
                                                                <CircleIcon sx={{ color: state.selectedColor, fontSize: 24 }} />
                                                            </IconButton>
                                                            <ArrowDropDownIcon />
                                                        </div>
                                                        <TextfieldComponent placeholder='30 Minute Meeting' customStyle='new_meeting_event_textbox' />


                                                        {/* Color Picker Popover */}
                                                        <Popover
                                                            open={Boolean(state.anchorEl)}
                                                            anchorEl={state.anchorEl}
                                                            onClose={handleClose}
                                                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                                        >
                                                            <div className='color_picker_dropdown'>
                                                                {colors.map((color) => (
                                                                    <IconButton
                                                                        key={color}
                                                                        onClick={() => handleColorSelect(color)}
                                                                        style={{
                                                                            backgroundColor: color,
                                                                            border: state.selectedColor === color ? "2px solid blue" : "none"
                                                                        }}
                                                                    >
                                                                        <CircleIcon sx={{ color: color, fontSize: 24 }} />
                                                                    </IconButton>
                                                                ))}
                                                            </div>
                                                        </Popover>
                                                    </div>

                                                </div>

                                                <div>
                                                    <label>Duration</label>
                                                    <AutocompleteComponent
                                                        options={durationOptions}
                                                        value={state.durationContent}
                                                        onChange={(event, newValue) => updateState({ durationContent: newValue })}
                                                        customStyles={{ ...style.newticketsAutocomplete, width: '50%' }}
                                                    />
                                                </div>
                                                <div>
                                                    {
                                                        state.isLocationCardVisible ? (
                                                            <LocationSelector
                                                                selectedLocation={state.selectedLocation}
                                                                showLocationDropdown={state.showLocationDropdown}
                                                                locationOptions={locationOptions}
                                                                handleLocationChange={handleLocationChange}
                                                                handleAddLocation={handleAddLocation}
                                                                onClose={handleEventClose}
                                                                isLocationCardVisible={state.isLocationCardVisible}
                                                            />
                                                        ) : (
                                                            <div>  <SelectEventLocation options={eventOptions} /></div>
                                                        )
                                                    }

                                                </div>
                                                <TextEditor placeholder="Add any information relevant to this event" /></>
                                        )
                                    }
                                    {
                                        state.selectedCard === 'Host and invitees' && (
                                            <div>
                                                <div>
                                                    <label>Host</label>
                                                    <div className="host_invitees">
                                                        <button className="user_logo">H</button>
                                                        <div>hepto(you)</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label>Invitees</label>
                                                    <div className="host_invitees">
                                                        <input type='checkbox' checked />
                                                        <div>Allow invitees to add guests</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        state.selectedCard === 'Scheduling settings' && (
                                            <div className="scheduling_settings">
                                                <label>Data range</label>
                                                <ScheduleOptions selectedValue={state.selectedRadioSchedule} onChange={(e) => updateState({ selectedRadioSchedule: e.target.value })} />
                                                <div>
                                                    <div className="calendar_setting">
                                                        <label>Hours and calendar settings</label> <CustomButton variant="outlined" onClick={() => updateState({ copyModal: !state.copyModal })}>Copy from...</CustomButton>

                                                    </div>
                                                    {state.copyModal && (
                                                        <div className="scheduling_card">
                                                            <SearchboxComponent
                                                                placeholder="Search event types"
                                                                value={state.searchTerm}
                                                                onChange={(e) => updateState({ searchTerm: e.target.value })}
                                                            />
                                                            <p className="no_result">We couldn't find a valid event type with that name</p>
                                                        </div>
                                                    )

                                                    }
                                                </div>
                                                <p className="set_time">Set times that hosts can be scheduled for these types of events.</p>
                                                <div className="user_container">
                                                    <button className="user_logo">H</button>
                                                    <div>hepto(you)
                                                        <p>Mon,Tue,Wed,Thu,Fri,Sat,hours vary</p>
                                                    </div>
                                                    <ArrowForwardIosOutlinedIcon />
                                                </div>
                                                <div>
                                                    <label>Event limits</label>
                                                    <div>
                                                        <div className="buffer_time_container">
                                                            <div className="buffer_header">
                                                                <span className="buffer_label">Buffer time</span>
                                                                <span className="buffer_value" onClick={() => updateState({ isBufferOpen: !state.isBufferOpen })}>
                                                                    None
                                                                </span>
                                                            </div>
                                                            {state.isBufferOpen && (
                                                                <div className="buffer_dropdown">
                                                                    <div className="buffer_option">
                                                                        <label>Before event:</label>
                                                                        <div className="dropdown_content">
                                                                            <AutocompleteComponent
                                                                                options={bufferTimeOptions}
                                                                                value={state.bufferBeforeEvent}
                                                                                onChange={(event, newValue) => updateState({ bufferBeforeEvent: newValue })}
                                                                                customStyles={style.newticketsAutocomplete}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="buffer_option">
                                                                        <label>After event:</label>
                                                                        <div className="dropdown_content">
                                                                            <AutocompleteComponent
                                                                                options={bufferTimeOptions}
                                                                                value={state.bufferAfterEvent}
                                                                                onChange={(event, newValue) => updateState({ bufferAfterEvent: newValue })}
                                                                                customStyles={style.newticketsAutocomplete}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                        </div>
                                                        <p className="set_time">Add time before or after booked Calendly events.</p>
                                                    </div>
                                                    <div>
                                                        <div className="buffer_time_container">
                                                            <div className="buffer_header">
                                                                <span className="buffer_label">Minimum notice</span>
                                                                <span className="buffer_value" onClick={() => updateState({ isMinimumNotice: !state.isMinimumNotice })}>
                                                                    4 hours
                                                                </span>
                                                            </div>
                                                            {
                                                                state.isMinimumNotice && (
                                                                    <div>
                                                                        <p className="set_time">Invitees can't schedule within...</p>
                                                                        <div className="minimum_notice_container">
                                                                            <TextfieldComponent value='4' customStyle='custom_textfield_box minimum_notice_textfield' />
                                                                            <AutocompleteComponent
                                                                                options={miniumNoticeOptions}
                                                                                value={state.minimumNoticeContent}
                                                                                onChange={(event, newValue) => updateState({ minimumNoticeContent: newValue })}
                                                                                customStyles={style.newticketsAutocomplete}
                                                                            />
                                                                            <p className="set_time">  of an event start time.</p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }

                                                        </div>
                                                        <p className="set_time">Set the minimum amount of notice that is required.</p>
                                                    </div>
                                                    <div>
                                                        <div className="buffer_time_container">
                                                            <div className="buffer_header">
                                                                <span className="buffer_label">Daily limit</span>
                                                                <span className="buffer_value" onClick={() => updateState({ isDailyLimit: !state.isDailyLimit })}>
                                                                    Not set
                                                                </span>
                                                            </div>
                                                            {
                                                                state.isDailyLimit && (
                                                                    <>
                                                                        <div className="daily_limit_container">
                                                                            <TextfieldComponent customStyle='custom_textfield_box minimum_notice_textfield' />
                                                                            <p className="set_time">
                                                                                events max per day</p>
                                                                        </div>
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                        <p className="set_time">Set the maximum events allowed per day.</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label>Additional options</label>

                                                    <div>
                                                        <div className="buffer_time_container">
                                                            <div className="buffer_header">
                                                                <span className="buffer_label">Time zone display</span>
                                                                <span className="buffer_value" onClick={() => updateState({ IsTimeZoneDisplay: !state.IsTimeZoneDisplay })}>
                                                                    Use invitee's
                                                                </span>
                                                            </div>
                                                            {
                                                                state.IsTimeZoneDisplay && (
                                                                    <div className="timezonedisplay_container">
                                                                        <RadioGroup>
                                                                            <FormControlLabel value="Use invitee's" control={<Radio />} label="Automatically detect and show the times in my invitee's time zone" />
                                                                            <FormControlLabel value="Locked" control={<Radio />} label="Lock the timezone (best for in-person events)" />

                                                                        </RadioGroup>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                        <p className="set_time">Sets how timezone shows on your booking page.</p>
                                                    </div>
                                                    <div>
                                                        <div className="buffer_time_container">
                                                            <div className="buffer_header">
                                                                <span className="buffer_label">Start time increments</span>
                                                                <span className="buffer_value" onClick={() => updateState({ isStartTimeIncrements: !state.isStartTimeIncrements })}>
                                                                    30 min
                                                                </span>
                                                            </div>
                                                            {
                                                                state.isStartTimeIncrements && (
                                                                    <>
                                                                    <p className="set_time">Show available start times in increments of...</p>
                                                                    <AutocompleteComponent
                                                                                options={startTimeIncrementsOptions}
                                                                                value={state.startTimeIncrementsContent}
                                                                                onChange={(event, newValue) => updateState({ startTimeIncrementsContent: newValue })}
                                                                                customStyles={style.newticketsAutocomplete}
                                                                            />
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                        <p className="set_time">Set the frequency of available time slots for invitees.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        state.selectedCard === 'Notification and workflows' && (
                                            <div>
                                                <p>Send automatic communications for your events</p>
                                                <div>
                                                    <label>Basic notifications</label>

                                                    <table className="event_notification_table">
                                                        <tbody>
                                                            {notifications.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{item.icon}</td>
                                                                    <td className="text">
                                                                        <span>{item.title}</span>
                                                                        {item.subtitle && <br />}
                                                                        {item.subtitle && <span>{item.subtitle}</span>}
                                                                    </td>
                                                                    <td>{item.switchStatus && <span className="switch">{item.switchStatus}</span>}</td>
                                                                    <td onClick={(e) => handleOpenPopover(e, item)}><MoreVertOutlinedIcon /></td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <Popover
                                                        open={Boolean(state.anchorElNotification)}
                                                        anchorEl={state.anchorElNotification}
                                                        onClose={handleClosePopover}
                                                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                                    >
                                                        <div className='basicnotification_edit'>
                                                            <div>
                                                                <EditOutlinedIcon />Edit
                                                            </div>
                                                            {state.selectedNotification?.switchStatus && (
                                                                <div className="basicnotification_switch">
                                                                    <div>Off</div>
                                                                    <Switch checked={state.selectedNotification?.switchStatus === "on"} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Popover>

                                                </div>
                                                <div>
                                                    <label>Workflows</label>
                                                    <div className="workflows_container">
                                                        <LockOutlinedIcon />
                                                        <span>Only the owner of the event type can make changes to workflows</span>
                                                    </div>
                                                    <div className="none_container">None</div>
                                                </div>
                                            </div>
                                        )
                                    }

                                </div>
                                <div className="edit_event_details_footer">
                                    <CustomButton variant="text">Cancel</CustomButton>
                                    <CustomButton variant="contained">Save and close</CustomButton>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="header">
                                    <div className="header_button">
                                        <CustomButton variant="text" icon={<ArrowBackIosIcon />}>Done</CustomButton>
                                        <div>
                                            <SettingsOutlinedIcon />
                                            <LinkOutlinedIcon />
                                            <CustomButton variant="contained" icon={<IosShareOutlinedIcon />}>Share</CustomButton>
                                        </div>
                                    </div>
                                    <h2>30 Minute Meeting</h2>
                                </div>
                                <div className="main_content">
                                    <div className='card_container' onClick={() => handleCardClick("Event details")}>
                                        <MenuIcon />
                                        <div className="card_details" >
                                            <h3>Event details</h3>
                                            <p>30 min</p>
                                            <p>Google meet</p>
                                        </div>
                                        <ArrowForwardIosOutlinedIcon />
                                    </div>
                                    <div className='card_container' onClick={() => handleCardClick("Host and invitees")}>
                                        <PeopleAltOutlinedIcon />
                                        <div className="card_details">
                                            <h3>Host and invitees</h3>
                                            <p>hepto(you)</p>
                                            <p>one-on-one event</p>
                                        </div>
                                        <ArrowForwardIosOutlinedIcon />
                                    </div>
                                    <div className='card_container' onClick={() => handleCardClick("Scheduling settings")}>
                                        <CalendarTodayOutlinedIcon />
                                        <div className="card_details">
                                            <h3>Scheduling settings</h3>
                                            <p>60 rolling calendar days</p>
                                            <p>Mon,Tue,Wed,Thu,Fri,Sat,hours vary</p>
                                        </div>
                                        <ArrowForwardIosOutlinedIcon />
                                    </div>
                                    <div className='card_container'>
                                        <EventNoteIcon />
                                        <div className="card_details">
                                            <h3>Booking page options</h3>
                                            <p>Asking for name,email,+1 question</p>
                                            <p>Canlendly confirmation page</p>
                                        </div>
                                        <ArrowForwardIosOutlinedIcon />
                                    </div>
                                    <div className='card_container' onClick={() => handleCardClick("Notification and workflows")}>
                                        <EmailOutlinedIcon />
                                        <div className="card_details">
                                            <h3>Notifications and workflows</h3>
                                            <p>Calendar invitations</p>
                                            <p>No reminders or workflows</p>
                                        </div>
                                        <ArrowForwardIosOutlinedIcon />
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </div>
                <div className="right_container">
                    <div className="header">
                        <p><b>This is a preview.</b> To book an event, share the link with your invitees.</p>
                        <CustomButton variant="text" icon={<IosShareOutlinedIcon />} sx={{ color: 'white' }}>View live page</CustomButton>
                    </div>
                    <div className="main_content">
                        <div className="eventdetails_content">
                            <p className="event">hepto</p>
                            <h3 className="event">30 Minute Meeting</h3>
                            <div><span><AccessTimeIcon />30 min</span> <span><VideocamOutlinedIcon />Web conferencing details provided upon confirmation.</span></div>
                        </div>
                        <div className="select_dateandtime_container">
                            <h4>Select a Date & Time</h4>
                            <SelectDateandTimeComponent selectedDate={state.selectedDate}
                                showTimeSlots={state.showTimeSlots}
                                selectedTime={state.selectedTime}
                                updateState={updateState}
                            />
                            <h4>Time zone</h4>
                            <div
                                onClick={handleTimeZoneClick} className="timezone"

                            >
                                <PublicOutlinedIcon /> {state.selectedTimeZone}  <ExpandMoreIcon fontSize="small" />
                            </div>
                            <TimeZoneMenu anchorEl={state.timeZoneAnchor} open={Boolean(state.timeZoneAnchor)} onClose={() => updateState({ timeZoneAnchor: null })} onSelect={handleTimeZoneSelect} />
                            <CustomButton variant="outlined" icon={<BuildOutlinedIcon />}>Troubleshoot</CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default EditEventType;