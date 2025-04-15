import React, { useState } from "react";
import CustomButton from "./CustomButton";
import SelectDateandTimeComponent from "./SelectDateandTimeComponent";
import TimeZoneMenu from "./TimeZoneMenu";
import { Popover, IconButton, Switch, FormControlLabel, RadioGroup, Radio, Dialog, DialogTitle, DialogContent, Menu, DialogActions, Tabs, Tab } from "@mui/material";
import dayjs from "dayjs";
import TextfieldComponent from "../TextfieldComponent";
import AutocompleteComponent from "../AutocompleteComponent";
import style from "../MuiStyles/muiStyle";
import LocationSelector from "./LocationSelector";
import SelectEventLocation from "./SelectEventLocation";
import {
    ArrowBackIosIcon, SettingsOutlinedIcon, LinkOutlinedIcon, IosShareOutlinedIcon, MenuIcon, ArrowForwardIosOutlinedIcon, PeopleAltOutlinedIcon, CalendarTodayOutlinedIcon, KeyboardArrowDownIcon, EventNoteIcon, EmailOutlinedIcon, AccessTimeIcon, VideocamOutlinedIcon, PublicOutlinedIcon, ExpandMoreIcon, BuildOutlinedIcon, CircleIcon, ArrowDropDownIcon, VideoCameraFrontIcon,
    PhoneIcon, EditOutlinedIcon,
    RoomIcon, AddIcon, DeleteOutlineIcon, CampaignIcon,
    MoreVertOutlinedIcon, ReportGmailerrorredIcon,
    ChatBubbleOutlineOutlinedIcon, LockOutlinedIcon, DragIndicatorIcon, CloseIcon, RedoOutlinedIcon
} from '../Icon'
import TextEditor from "./TextEditor";
import ScheduleOptions from "./ScheduleOptions";
import SearchboxComponent from "../SearchboxComponent";
import EditQuestionModal from "./EditQuestionModal";
import VariableBox from "./VariableBox";

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
const startTimeIncrementsOptions = ['5 min', '10 min', '15 min', '20 min', '30 min', 'custom'];
const bookingOptions = ['Display calendar confirmation image', 'Redirect to an external site'];
const editAnswerTypeOptions = ['one Line', 'Multiple Lines', 'Radio Buttons', 'Checkboxes', 'Dropdown', 'Phone Number'];
const editNameOptions = ['Name', 'First Name,Last Name'];
const replyAddressOptions = ["Host's email address", 'No-reply address'];
const timeOptions = ["minute(s)", "hour(s)", "day(s)"];
const weeklyHours = [{ day: 'SUN', hours: ['Unavailable'] },
{ day: 'MON', hours: ['6:00PM-7:00PM', '8:00PM-9:00PM'] },
{ day: 'TUE', hours: ['12:00AM-1:00AM', '2:00AM-3:00AM', '4:00AM-5:00AM'] },
{ day: 'WED', hours: ['9:00AM-5:00PM'] },
{ day: 'THU', hours: ['9:00AM-5:00PM'] },
{ day: 'FRI', hours: ['9:00AM-5:00PM'] },
{ day: 'SAT', hours: ['9:00AM-5:00PM'] }]
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
        startTimeIncrementsContent: startTimeIncrementsOptions[4],
        bookingContent: bookingOptions[0],
        editQuestionModal: false,
        isStatusOn: true,
        editAnswerTypeContent: editAnswerTypeOptions[0],
        bookingAnchorEl: null,
        bookingSelectedItem: "",
        availableHours: false,
        tabValue: 0,
        scheduleModal: false,
        selectedSchedule: 'working hours',
        addMeetingException: false,
        meetingExceptionModal: false,
        selectedException: 'includes',
        notificationAnchorE1: null,
        notificationSelectedItem: '',
        openNameEmailDialog: false,
        openQuestionDialog: false,
        editNameContent: editNameOptions[0],
        openLinkDialog: false,
        openCalendarInvitation: false,
        openEmailFollowup: false,
        replyAddressContent: replyAddressOptions[0],
        selectedTimeUnit: timeOptions[1],
        isDropdownDisabled: true,
        openEmailReminders: false,
        openTextReminders: false,

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
    const handleToggle = () => {
        updateState({ isStatusOn: !state.isStatusOn })
    }

    const handleBookingClick = (event, item) => {
        updateState({ bookingAnchorEl: event.currentTarget, bookingSelectedItem: item });
    };



    const handleBookingClose = () => {
        updateState({ bookingAnchorEl: null, bookingSelectedItem: "" });
    };
    const handleNotificationClick = (event, item) => {
        updateState({ notificationAnchorE1: event.currentTarget, notificationSelectedItem: item });
    };

    const handleNotificationClose = () => {
        updateState({ notificationAnchorE1: null, notificationSelectedItem: "" });
    };
    const handleTabChange = (event, newValue) => updateState({ tabValue: newValue });

    const handleEditClick = () => {
        handleBookingClose();
        if (state.bookingSelectedItem === "edit_name_email") {
            updateState({ openNameEmailDialog: true });
        } else if (state.bookingSelectedItem === "edit_question") {
            updateState({ openQuestionDialog: true });

        } else if (state.bookingSelectedItem === 'edit_link') {
            updateState({ openLinkDialog: true });
        }
    };
    const handleCloseDialogs = () => {
        updateState({ openNameEmailDialog: false, openQuestionDialog: false, openLinkDialog: false });
    };
    const handleNotificationEditClick = () => {
        handleNotificationClose();
        if (state.notificationSelectedItem === 'calendar_invitation') {
            updateState({ openCalendarInvitation: true })
        } else if (state.notificationSelectedItem === 'email_followup') {
            updateState({ openEmailFollowup: true })
        } else if (state.notificationSelectedItem === 'email_reminders') {
            updateState({ openEmailReminders: true })
        } else if (state.notificationSelectedItem === 'text_reminders') {
            updateState({ openTextReminders: true })
        }
    }
    return (
        <>
            <div className="edit_event_type_container">
                <Dialog open={state.openLinkDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth className="event_Edit_Question_modal">
                    <DialogTitle className="modal_title">
                        Edit Link
                        <CloseIcon onClick={handleCloseDialogs} />
                    </DialogTitle>

                    <DialogContent className="modal_content">
                        {/* Question Input */}
                        <div>
                            <p>Make it easy for your invitee to schedule recurring events by adding a link to this booking page.</p>
                            <label>Link name</label>
                            <TextfieldComponent placeholder='Schedule another event' customStyle="custom_textfield_box" />
                        </div>
                        <div>
                            <label>Status</label>
                            <div className="status_container">
                                {state.isStatusOn ? "On" : "Off"}
                                <FormControlLabel
                                    control={<Switch checked={state.isStatusOn} onChange={() => updateState({ isStatusOn: !state.isStatusOn })} />}
                                />
                            </div>
                        </div>
                    </DialogContent>

                    <DialogActions>
                        <CustomButton variant="contained" sx={{ width: "100%" }}>
                            Done
                        </CustomButton>
                    </DialogActions>
                </Dialog>
                <Dialog open={state.openNameEmailDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth className="event_Edit_Question_modal">
                    <DialogTitle className="modal_title">
                        Edit Name Question
                        <CloseIcon onClick={handleCloseDialogs} />
                    </DialogTitle>

                    <DialogContent className="modal_content">
                        {/* Question Input */}
                        <div>
                            <label>Name Input</label>
                            <AutocompleteComponent
                                options={editNameOptions}
                                value={state.editNameContent}
                                onChange={(e, newValue) => updateState({ editNameContent: newValue })}
                                customStyles={{ ...style.newticketsAutocomplete }}
                            />
                        </div>

                        {/* Required Checkbox */}
                        <div>
                            <input type="checkbox" /> <span>Autofill Invitee Name, Email, and Text Reminder Phone Number (when applicable) from prior bookings</span>
                        </div>
                    </DialogContent>

                    <DialogActions>
                        <CustomButton variant="contained" sx={{ width: "100%" }}>
                            Done
                        </CustomButton>
                    </DialogActions>
                </Dialog>
                <EditQuestionModal
                    open={state.editQuestionModal}
                    onClose={() => updateState({ editQuestionModal: false })}
                    answerTypeOptions={editAnswerTypeOptions}
                    selectedAnswerType={state.editAnswerTypeContent}
                    onAnswerTypeChange={(event, newValue) => updateState({ editAnswerTypeContent: newValue })}
                    status={state.isStatusOn}
                    onStatusChange={() => updateState({ isStatusOn: !state.isStatusOn })}

                />

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
                                                            <div> 
                                                                 <label>Location</label>
                                                                 <SelectEventLocation options={eventOptions} />
                                                                 </div>
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
                                            <>
                                                {
                                                    state.availableHours ? (
                                                        <div>
                                                            <h3>Available hours</h3>
                                                            <p className="set_time">Set the times that people will be able to schedule these types of meetings with you.</p>
                                                            <CustomButton variant="text" icon={<CalendarTodayOutlinedIcon />} endicon={<KeyboardArrowDownIcon />} sx={{ color: 'blue' }} onClick={() => updateState({ scheduleModal: !state.scheduleModal })}> {state.selectedSchedule}</CustomButton>
                                                            {
                                                                state.scheduleModal && (
                                                                    <div className="available_schedule_modal">
                                                                        <h4>SCHEDULES</h4>
                                                                        <CustomButton variant='text' onClick={() => updateState({ selectedSchedule: 'working hours', scheduleModal: false })}>Working hours (default)</CustomButton>
                                                                        <hr />
                                                                        <CustomButton variant='text' onClick={() => updateState({ selectedSchedule: 'custom hours', scheduleModal: false })}>Custom hours</CustomButton>
                                                                    </div>
                                                                )
                                                            }
                                                            <p className="set_time">Edit your saved schedules in<CustomButton variant="text" endicon={<RedoOutlinedIcon />} sx={{ color: 'blue' }}>settings</CustomButton></p>
                                                            <div className="availablehours_tabs_container">
                                                                <Tabs value={state.tabValue} onChange={handleTabChange}>
                                                                    <Tab label='Weekly hours' />
                                                                    <Tab label='Date-specific hours' />
                                                                </Tabs>
                                                                {state.tabValue === 0 && (
                                                                    <div className="tab_content">
                                                                        {weeklyHours.map((row, index) => (
                                                                            <div key={index} className="weeklyhours_tab_container">
                                                                                <div style={{ fontWeight: 'bold' }}>{row.day}</div>
                                                                                <div>
                                                                                    {row.hours.map((slot, i) => (
                                                                                        <div key={i}>{slot}</div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {
                                                                    state.tabValue === 1 && (
                                                                        <div className="tab_content">
                                                                            <p className="set_time">To override your hours on specific dates, update your schedule under Availability.</p>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                            <h3>Additional availability settings</h3>
                                                            <label>Observed holidays</label>
                                                            <p className="set_time">No observed holidays. Set up in<CustomButton variant="text" endicon={<RedoOutlinedIcon />} sx={{ color: 'blue' }}>account settings</CustomButton></p>
                                                            <label>Book over meetings<span className="scheduling_newbtn">New</span></label>
                                                            <p className="set_time">Allow invitees to book over selected meetings on your<CustomButton variant="text" endicon={<RedoOutlinedIcon />} sx={{ color: 'blue' }}>connected calendars</CustomButton></p>
                                                            {
                                                                state.addMeetingException && (
                                                                    <div className="addmeeting_exception_container">
                                                                        <div className="meeting_name_container">
                                                                            <h4>Meeting name</h4>
                                                                            <CustomButton variant="text" endicon={<KeyboardArrowDownIcon />} sx={{ color: 'blue' }} onClick={() => updateState({ meetingExceptionModal: true })}>{state.selectedException}</CustomButton>
                                                                            {
                                                                                state.meetingExceptionModal && (
                                                                                    <div className="available_schedule_modal">
                                                                                        <div>
                                                                                            <CustomButton variant="text" onClick={() => updateState({ selectedException: 'matches exactly', meetingExceptionModal: false })}>matches exactly</CustomButton>
                                                                                        </div>
                                                                                        <div>
                                                                                            <CustomButton variant="text" onClick={() => updateState({ selectedException: 'includes', meetingExceptionModal: false })}>includes</CustomButton>
                                                                                        </div>

                                                                                    </div>
                                                                                )
                                                                            }
                                                                        </div>
                                                                        <TextfieldComponent customStyle='custom_textfield_box' />
                                                                        <div>
                                                                            <CustomButton variant="contained">Apply</CustomButton>
                                                                            <CustomButton variant="text">cancel</CustomButton>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                            <CustomButton variant="text" icon={<AddIcon />} sx={{ color: 'blue' }} onClick={() => updateState({ addMeetingException: !state.addMeetingException })}>Add meeting exception</CustomButton>

                                                        </div>
                                                    ) : (
                                                        <div className="scheduling_settings">
                                                            <label>Data range</label>
                                                            <ScheduleOptions selectedValue={state.selectedRadioSchedule} onChange={(e) => updateState({ selectedRadioSchedule: e.target.value })} />
                                                            <div>
                                                                <div className="calendar_setting">
                                                                    <label>Hours and calendar settings</label> <CustomButton variant="outlined" onClick={() => updateState({ copyModal: !state.copyModal })} sx={{ width: '159px' }}>Copy from...</CustomButton>

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
                                                                <ArrowForwardIosOutlinedIcon onClick={() => updateState({ availableHours: true })} />
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

                                            </>
                                        )
                                    }
                                    {
                                        state.selectedCard === 'Booking page options' && (
                                            <div className="bookingpage_container">
                                                <label>Event link</label>
                                                <p className="set_time">calendly.com/hepto/</p>
                                                <TextfieldComponent placeholder='30 min' customStyle='custom_textfield_box' />
                                                <div className="booking_container">
                                                    <h4>Booking form</h4>
                                                    <div>
                                                        <label>Invitee questions</label>

                                                        <div className="event_invitee_container">
                                                            <div className="event_invitee_content">
                                                                <LockOutlinedIcon />
                                                                <div className="event_invitee_center_content">Name,Email</div>
                                                                <MoreVertOutlinedIcon onClick={(e) => handleBookingClick(e, "edit_name_email")} />
                                                            </div>
                                                            <div className="event_invitee_content">
                                                                <LockOutlinedIcon />
                                                                <div className="event_invitee_center_content">Allow invitees to add guests</div>
                                                                <MoreVertOutlinedIcon onClick={(e) => handleBookingClick(e, "switch")} />
                                                            </div>
                                                            <div className="event_invitee_content">
                                                                <DragIndicatorIcon />
                                                                <div className="event_invitee_center_content">Q1: Please share anything that will help prepare for our meeting.
                                                                    <p>Multiple Lines</p>
                                                                </div>
                                                                <MoreVertOutlinedIcon onClick={(e) => handleBookingClick(e, "edit_question")} />
                                                            </div>
                                                            <Menu anchorEl={state.bookingAnchorEl} open={Boolean(state.bookingAnchorEl)} onClose={handleBookingClose}
                                                                PaperProps={{
                                                                    style: { padding: "10px", minWidth: "120px" }
                                                                }}>

                                                                {(state.bookingSelectedItem === "edit_name_email" || state.bookingSelectedItem === "edit_question" || state.bookingSelectedItem === 'edit_link') && (
                                                                    <div onClick={handleEditClick} ><EditOutlinedIcon />Edit</div>
                                                                )}


                                                                {(state.bookingSelectedItem === "edit_question" || state.bookingSelectedItem === "switch" || state.bookingSelectedItem === 'edit_link') && (
                                                                    <div>On <Switch defaultChecked /></div>
                                                                )}

                                                                {state.bookingSelectedItem === "edit_question" && (
                                                                    <>
                                                                        <div><DeleteOutlineIcon />Delete</div>
                                                                    </>
                                                                )}
                                                            </Menu>
                                                        </div>
                                                        <EditQuestionModal
                                                            open={state.openQuestionDialog}
                                                            onClose={handleCloseDialogs}
                                                            answerTypeOptions={editAnswerTypeOptions}
                                                            selectedAnswerType={state.editAnswerTypeContent}
                                                            onAnswerTypeChange={(event, newValue) => updateState({ editAnswerTypeContent: newValue })}
                                                            status={state.isStatusOn}
                                                            onStatusChange={() => updateState({ isStatusOn: !state.isStatusOn })}

                                                        />
                                                        <CustomButton variant="text" icon={<AddIcon />} sx={{ ...style.meetingEventLinkBtn }} onClick={() => updateState({ editQuestionModal: true })}>Add new question</CustomButton>
                                                    </div>
                                                    <div>
                                                        <label>Collect payment on form</label>
                                                        <CustomButton variant="text" icon={<AddIcon />} sx={{ ...style.meetingEventLinkBtn }}>Collect payment</CustomButton>
                                                    </div>
                                                </div>
                                                <div className="booking_container">

                                                    <h4>Confirmation page</h4>
                                                    <div>
                                                        <label>After booking</label>
                                                        <AutocompleteComponent
                                                            options={bookingOptions}
                                                            value={state.bookingContent}
                                                            onChange={(event, newValue) => updateState({ bookingContent: newValue })}
                                                            customStyles={style.newticketsAutocomplete}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>Links on confirmation page</label>
                                                        <div className="event_invitee_container">
                                                            <div className="event_invitee_content">
                                                                <LockOutlinedIcon />
                                                                <div className="event_invitee_center_content">Schedule another event</div>
                                                                <div><span>Off</span><MoreVertOutlinedIcon onClick={(e) => handleBookingClick(e, "edit_link")} /></div>
                                                            </div>
                                                        </div>
                                                        <CustomButton variant="text" icon={<AddIcon />} sx={{ ...style.meetingEventLinkBtn }}>Add custom link</CustomButton>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        state.selectedCard === 'Notification and workflows' && (
                                            <>
                                                {
                                                    state.openCalendarInvitation ? (
                                                        <>
                                                            <div className="canlendar_invitation">
                                                                <div className="edit">
                                                                    <CampaignIcon />
                                                                    <div><a>Upgrade to Standard</a> to edit your calendar invitations.</div>
                                                                </div>
                                                                <div>A calendar invitation is sent to your invitee when booking, which adds the event to their calendar.
                                                                    <CustomButton variant="text" sx={{ color: 'blue' }}>Switch to email confirmation</CustomButton>
                                                                </div>
                                                                <div>
                                                                    <label>Subject</label>
                                                                    <VariableBox>
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Invitee Full Name</CustomButton>
                                                                        <span>and</span>
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>My Name</CustomButton>
                                                                    </VariableBox>
                                                                </div>
                                                                <div>
                                                                    <label>Body</label>
                                                                    <VariableBox>
                                                                        <p>Event Name:</p>
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Event Name</CustomButton>
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Event Description</CustomButton>
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Location</CustomButton>
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Questions And Answers</CustomButton>
                                                                    </VariableBox>
                                                                </div>
                                                                <div>
                                                                    <label>Timing</label>
                                                                    <p>Sends immediately when booked</p>
                                                                    <div className="edit">
                                                                        <CampaignIcon />
                                                                        <div>
                                                                            <a>Upgrade to Standard</a> to edit your cancellation agreement.</div>
                                                                    </div>
                                                                </div>
                                                                <div className="cancelation_content">
                                                                    <label>Cancellation policy</label>
                                                                    <div className="edit">
                                                                        <ReportGmailerrorredIcon />
                                                                        <div>
                                                                            <a>Upgrade to Standard</a> to edit your cancellation agreement.</div>
                                                                    </div>
                                                                    <div><input type='checkbox' checked disabled /><span>Include cancel and reschedule links in email invitations and reminders (recommended)</span> </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : state.openEmailReminders ? (
                                                        <>
                                                            <div className="canlendar_invitation">
                                                                <div className="edit">
                                                                    <CampaignIcon />
                                                                    <div><a>Upgrade to Standard</a> to add email reminders to your events.</div>
                                                                </div>
                                                                <div>An invitee will receive a reminder email before a scheduled event at specified times.</div>
                                                                <div>
                                                                    <label>Reply-to address</label>
                                                                    <AutocompleteComponent
                                                                        options={replyAddressOptions}
                                                                        value={state.replyAddressContent}
                                                                        onChange={(e, newValue) => updateState({ replyAddressContent: newValue })}
                                                                        customStyles={{ ...style.newticketsAutocomplete }}
                                                                    />
                                                                    <div className="edit">
                                                                        <ReportGmailerrorredIcon />
                                                                        <div>All email communication will use the same option</div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label>Subject</label>
                                                                    <VariableBox>
                                                                        Reminder:<CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Event Name</CustomButton>with
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>My Name</CustomButton> at
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Event Time</CustomButton> on
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Event Date</CustomButton>
                                                                    </VariableBox>
                                                                </div>
                                                                <div>
                                                                    <label>Body</label>
                                                                    <VariableBox showTextFormatIcons>
                                                                        Hi<CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Invitee Full Name</CustomButton>, This is a friendly reminder that your
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Event Name</CustomButton>with
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>My Name</CustomButton>is at
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Event Time</CustomButton> on
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Event Date</CustomButton>.
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Location</CustomButton>
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Event Description</CustomButton>
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Questions And Answers</CustomButton>
                                                                    </VariableBox>
                                                                </div>
                                                                <div>
                                                                    <label>Timing</label>
                                                                    <div className="timing_container">
                                                                        <TextfieldComponent value='1' customStyle='eventTimingTextfield' />
                                                                        <AutocompleteComponent
                                                                            options={timeOptions}
                                                                            value={state.selectedTimeUnit}
                                                                            onChange={(e, newValue) => updateState({ selectedTimeUnit: newValue })}
                                                                            customStyles={{ ...style.newticketsAutocomplete, ...style.eventTimingDropdown }}
                                                                            disabled={state.isDropdownDisabled}
                                                                        />
                                                                        <span>before event</span>
                                                                    </div>
                                                                    <CustomButton variant="text" icon={<AddIcon />}>Add another reminder</CustomButton>
                                                                </div>
                                                                <div>
                                                                    <label>Status</label>
                                                                    <div className='status_container'>Off <FormControlLabel disabled control={<Switch />} /></div>
                                                                </div>
                                                                <div className="edit">
                                                                    <CampaignIcon />
                                                                    <div><a>Upgrade to Standard</a> to edit your cancellation agreement.</div>
                                                                </div>
                                                                <div className="cancelation_content">
                                                                    <label>Cancellation policy</label>
                                                                    <div className="edit">
                                                                        <ReportGmailerrorredIcon />
                                                                        <div>
                                                                            <a>Upgrade to Standard</a>Updates to your cancellation policy apply to all emails for this event type</div>
                                                                    </div>
                                                                    <div><input type='checkbox' checked disabled /><span>Include cancel and reschedule links in email invitations and reminders (recommended)</span> </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : state.openTextReminders ? (
                                                        <>
                                                            <div className="canlendar_invitation">
                                                                <div className="edit">
                                                                    <CampaignIcon />
                                                                    <div><a>Upgrade to Standard</a> to add text reminders to your events.</div>
                                                                </div>
                                                                <div>Your invitees will have the option of receiving text reminders before a scheduled event at specified times.</div>
                                                                <div>
                                                                    <label>Text Message</label>
                                                                    <VariableBox>
                                                                        Reminder:<CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Event Name</CustomButton>with
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>My Name</CustomButton> at
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Event Time</CustomButton> on
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Event Date</CustomButton>
                                                                    </VariableBox>
                                                                </div>
                                                                <div>
                                                                    <label>Timing</label>
                                                                    <div className="timing_container">
                                                                        <TextfieldComponent value='1' customStyle='eventTimingTextfield' />
                                                                        <AutocompleteComponent
                                                                            options={timeOptions}
                                                                            value={state.selectedTimeUnit}
                                                                            onChange={(e, newValue) => updateState({ selectedTimeUnit: newValue })}
                                                                            customStyles={{ ...style.newticketsAutocomplete, ...style.eventTimingDropdown }}
                                                                            disabled={state.isDropdownDisabled}
                                                                        />
                                                                        <span>before event</span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label>Status</label>
                                                                    <div className='status_container'>Off <FormControlLabel disabled control={<Switch />} /></div>
                                                                </div>
                                                                <div className="edit">
                                                                    <CampaignIcon />
                                                                    <div><a>Upgrade to Standard</a> to edit your cancellation agreement.</div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : state.openEmailFollowup ? (
                                                        <>
                                                            <div className="canlendar_invitation">
                                                                <div className="edit">
                                                                    <CampaignIcon />
                                                                    <div><a>Upgrade to Standard</a> to edit your calendar invitations.</div>
                                                                </div>
                                                                <div>An invitee will receive a reminder email before a scheduled event at specified times.</div>
                                                                <div>
                                                                    <label>Reply-to address</label>
                                                                    <AutocompleteComponent
                                                                        options={replyAddressOptions}
                                                                        value={state.replyAddressContent}
                                                                        onChange={(e, newValue) => updateState({ replyAddressContent: newValue })}
                                                                        customStyles={{ ...style.newticketsAutocomplete }}
                                                                    />
                                                                    <div className="edit">
                                                                        <ReportGmailerrorredIcon />
                                                                        <div>All email communication will use the same option</div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label>Subject</label>
                                                                    <VariableBox>
                                                                        <span>Thank you for your time!</span>
                                                                    </VariableBox>
                                                                </div>
                                                                <div>
                                                                    <label>Body</label>
                                                                    <VariableBox showTextFormatIcons>
                                                                        Hi<CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Invitee Full Name</CustomButton>,
                                                                        Thank you for attending<CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Evant Name</CustomButton> at
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Event Time</CustomButton> on
                                                                        <CustomButton variant="text" sx={{ ...style.workflowVariableBtn }}>Event Date</CustomButton>.Please respond to this email with any feedback or additional requests.
                                                                    </VariableBox>
                                                                </div>
                                                                <div>
                                                                    <label>Timing</label>
                                                                    <div className="timing_container">
                                                                        <TextfieldComponent value='1' customStyle='eventTimingTextfield' />
                                                                        <AutocompleteComponent
                                                                            options={timeOptions}
                                                                            value={state.selectedTimeUnit}
                                                                            onChange={(e, newValue) => updateState({ selectedTimeUnit: newValue })}
                                                                            customStyles={{ ...style.newticketsAutocomplete, ...style.eventTimingDropdown }}
                                                                            disabled={state.isDropdownDisabled}
                                                                        />
                                                                        <span>after event</span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label>Status</label>
                                                                    <div className='status_container'>Off <FormControlLabel disabled control={<Switch />} /></div>
                                                                </div>
                                                                <div className="edit">
                                                                    <CampaignIcon />
                                                                    <div><a>Upgrade to Standard</a> to edit your cancellation agreement.</div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                        : (
                                                            <div>
                                                                <p>Send automatic communications for your events</p>
                                                                <div>
                                                                    <label>Basic notifications</label>
                                                                    <div className="event_invitee_container">
                                                                        <div className="event_invitee_content">
                                                                            <EmailOutlinedIcon />
                                                                            <div className="event_invitee_center_content">Calendar Invitation<p>Immediately after booking</p></div>
                                                                            <MoreVertOutlinedIcon onClick={(e) => handleNotificationClick(e, "calendar_invitation")} />
                                                                        </div>
                                                                        <div className="event_invitee_content">
                                                                            <EmailOutlinedIcon />
                                                                            <div className="event_invitee_center_content">Email reminders</div>
                                                                            <div><span>Off</span><MoreVertOutlinedIcon onClick={(e) => handleNotificationClick(e, "email_reminders")} /></div>
                                                                        </div>
                                                                        <div className="event_invitee_content">
                                                                            <ChatBubbleOutlineOutlinedIcon />
                                                                            <div className="event_invitee_center_content">Text reminders</div>
                                                                            <div><span>Off</span>  <MoreVertOutlinedIcon onClick={(e) => handleNotificationClick(e, "text_reminders")} /></div>
                                                                        </div>
                                                                        <div className="event_invitee_content">
                                                                            <EmailOutlinedIcon />
                                                                            <div className="event_invitee_center_content">Email follow-up</div>
                                                                            <div><span>Off</span>  <MoreVertOutlinedIcon onClick={(e) => handleNotificationClick(e, "email_followup")} /></div>
                                                                        </div>
                                                                        <Menu anchorEl={state.notificationAnchorE1} open={Boolean(state.notificationAnchorE1)} onClose={handleNotificationClose}
                                                                            PaperProps={{
                                                                                style: { padding: "10px", minWidth: "120px" }
                                                                            }}>

                                                                            {(state.notificationSelectedItem === "calendar_invitation" || state.notificationSelectedItem === "email_reminders" || state.notificationSelectedItem === "text_reminders" || state.notificationSelectedItem === "email_followup") && (
                                                                                <div onClick={handleNotificationEditClick}><EditOutlinedIcon />Edit</div>
                                                                            )}


                                                                            {(state.notificationSelectedItem === "email_reminders" || state.notificationSelectedItem === "text_reminders" || state.notificationSelectedItem === "email_followup") && (
                                                                                <div>On <Switch defaultChecked /></div>
                                                                            )}


                                                                        </Menu>
                                                                    </div>

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
                                            </>


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
                                    <div className='card_container' onClick={() => handleCardClick("Booking page options")}>
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