import React, { useState, useEffect } from "react";
import { Grid, List, Switch, Tooltip, Button, ListItem, Typography } from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails, RadioGroup, Radio, FormControlLabel, Menu } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CloseIcon, AccessTimeOutlinedIcon, LocationOnOutlinedIcon, ReportGmailerrorredIcon, InfoOutlinedIcon, BuildOutlinedIcon, CampaignIcon, PublicOutlinedIcon, ArrowDropDownIcon, ArrowDropUpIcon, AddIcon, OpenInNewIcon, DeleteOutlineIcon, LockOutlinedIcon, EmailOutlinedIcon, MoreVertOutlinedIcon, ChatBubbleOutlineOutlinedIcon, EditOutlinedIcon } from "../Icon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { parse, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import CustomDatePicker from "./CustomDatePicker";
import CustomButton from "./CustomButton";
import dayjs from "dayjs";
import style from "../MuiStyles/muiStyle";
import TextEditor from "./TextEditor";
import CustomDropdown from "./CustomDropdown";
import TextfieldComponent from "../TextfieldComponent";
import VariableBox from "./VariableBox";
const bufferTimeOptions = ['0 min', '5 min', '10 min', '15 min', '30 min', '45 min'];
const buffterMaxMeetOption = ['day', 'week', 'month'];
const meetExeptionOption = ['includes', 'matches exactly'];
const inviteDetailsOptions = ['Name Email', 'First Name,Last Name,Email'];
const answerTypeOptions = ['one Line', 'Multiple lines', 'Radio buttons', 'checkboxes', 'Dropdown', 'Phone Number'];
const pageBookingOption = ['Display confirmation page', 'Redirect to an external site'];
const replyAddressOptions = ["Host's email address", 'No-reply address'];
const timeOptions = ["minute(s)", "hour(s)", "day(s)"];
const baseTimeSlots = [
    "9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am",
    "12:00 pm", "12:30 pm", "1:00 pm", "1:30 pm", "2:00 pm", "2:30 pm", "3:00 pm", "3:30 pm",
    "4:00 pm", "4:30 pm", "5:00 pm", "5:30 pm", "6:00 pm", "6:30 pm", "7:00 pm", "7:30 pm",
    "8:00 pm", "8:30 pm", "9:00 pm", "9:30 pm", "10:00 pm", "10:30 pm", "11:00 pm", "11:30 pm"
];

const EditEvent = () => {
    const [state, setState] = useState({
        selectedDate: null,
        showTimeSlots: false,
        selectedTime: [],
        is24HourFormat: false,
        currentTime: '',
        isOpenTimeZone: false,
        expandedPanel: null,
        bufferBeforeEvent: bufferTimeOptions[0],
        bufferAfterEvent: bufferTimeOptions[0],
        // bufferMaxMeet: buffterMaxMeetOption[0],
        meetException: meetExeptionOption[0],
        showAddException: true,
        bookingPageValue: bufferTimeOptions[0],
        inviteDetailsValue: inviteDetailsOptions[0],
        answerTypeValue: answerTypeOptions[0],
        notificationAnchorE1: null,
        notificationSelectedItem: '',
        answerTypeValue: answerTypeOptions[0],
        pageBookingValue: pageBookingOption[0],
        isOn: false,
        questions: [{ id: 1, answerTypeValue: '' }],
        links: [{ id: 1, isOn: true }],
        openCalendarInvitation: false,
        openEmailFollowup: false,
        openEmailReminders: false,
        openTextReminders: false,
        replyAddressContent: replyAddressOptions[0],
        selectedTimeUnit: timeOptions[1],

    })
    const [limits, setLimits] = useState([
        { bufferMaxMeet: buffterMaxMeetOption[0] }
    ]);
    const timeZone = 'America/New_York';
    const updateState = (newState) => {
        setState((prevState) => ({ ...prevState, ...newState }));
    };
    const disablePastDates = (date) => {
        const today = dayjs().startOf('day');
        const isPast = date.isBefore(today);
        const isSunday = date.day() === 0;
        return isPast || isSunday;
    };
    const handleDateChange = (newDate) => {
        updateState({ selectedDate: newDate, showTimeSlots: true, selectedTime: [] });

    };
    const handleTimezone = () => {
        setState((prev) => ({ ...prev, isOpenTimeZone: !prev.isOpenTimeZone }));
    };
    const formatTime = (time) => {
        const parsed = parse(time, 'h:mm a', new Date());
        return state.is24HourFormat ? format(parsed, 'HH:mm') : format(parsed, 'h:mm a');
    };
    const timeSlots = baseTimeSlots.map(formatTime);
    const handleFormatSwitch = () => {
        setState((prev) => ({ ...prev, is24HourFormat: !prev.is24HourFormat }));
    };
    const handleTimeClick = (time) => {
        updateState({
            selectedTime: [time]
        });
    };
    const handleAddLimit = () => {
        if (limits.length < 3) {
            setLimits([...limits, { bufferMaxMeet: '' }]);
        }
    };
    const handleAddMeetingException = () => {
        setState(prevState => ({
            ...prevState,
            showAddException: !prevState.showAddException,
        }));
    }
    const handleNotificationClick = (event, item) => {
        updateState({ notificationAnchorE1: event.currentTarget, notificationSelectedItem: item });
    };
    const handleNotificationClose = () => {
        updateState({ notificationAnchorE1: null, notificationSelectedItem: "" });
    };

    const handleAddQuestion = () => {
        updateState({
            questions: [
                ...state.questions,
                { id: state.questions.length + 1, answerTypeValue: '', isQuesOn: true },
            ],
        });
    };
    const handleDeleteQuestion = (id) => {
        const updatedQuestions = state.questions.filter((q) => q.id !== id);
        updateState({ questions: updatedQuestions });
    };
    const handleAddLink = () => {
        setState((prev) => ({
            ...prev,
            links: [
                ...prev.links,
                { id: prev.links.length + 1, isOn: true },
            ],
        }));
    };
    const handleSwitchChange = (id, checked) => {
        const updatedLinks = state.links.map((link) =>
            link.id === id ? { ...link, isOn: checked } : link
        );
        setState((prev) => ({ ...prev, links: updatedLinks }));
    };
    const handleLinkNameChange = (id, value) => {
        const updatedLinks = state.links.map((link) =>
            link.id === id ? { ...link, linkName: value } : link
        );
        setState((prev) => ({ ...prev, links: updatedLinks }));
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
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const zonedDate = toZonedTime(now, timeZone);
            const timeFormat = state.is24HourFormat ? 'HH:mm' : 'hh:mm a';
            const formattedTime = format(zonedDate, timeFormat).toLowerCase();
            setState((prev) => ({ ...prev, currentTime: formattedTime }));
        };

        updateTime();
        const interval = setInterval(updateTime, 30000);
        return () => clearInterval(interval);
    }, [state.is24HourFormat]);


    const accordionData = [
        {
            key: 'panel1',
            title: 'Description',
            subText: (
                <><svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 9.99979C0 9.4475 0.447715 8.99979 1 8.99979H19C19.5523 8.99979 20 9.4475 20 9.99979C20 10.5521 19.5523 10.9998 19 10.9998H1C0.447715 10.9998 0 10.5521 0 9.99979Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M0 3.99995C0 3.44766 0.447715 2.99995 1 2.99995H19C19.5523 2.99995 20 3.44766 20 3.99995C20 4.55223 19.5523 4.99995 19 4.99995H1C0.447715 4.99995 0 4.55223 0 3.99995Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M0 15.9997C0 15.4474 0.447715 14.9997 1 14.9997H14C14.5523 14.9997 15 15.4474 15 15.9997C15 16.552 14.5523 16.9997 14 16.9997H1C0.447715 16.9997 0 16.552 0 15.9997Z" fill="currentColor"></path></svg><div>Tell your invitees what this meeting is about</div></>
            ),
            details: (
                <><TextEditor placeholder="Write a summary and any details your invitee should know about the event." /></>
            )

        },

        {
            key: 'panel2',
            title: 'Availability',
            subText: (
                <>Mon,Tue,Wed,Thu,Fri,Sat,hours Vary</>
            )
        },
        {
            key: 'panel3',
            title: 'Host',
            subHostText: (
                <div className="host_invitees">
                    <button className="user_logo">H</button>
                    <div>hepto(you)</div>
                </div>
            ),
            details: (
                <div className="host_invitee_content">
                    <Typography sx={{ ...style.eventheading }}>Invitees</Typography>
                    <div><input type='checkbox' checked /><label>Allow invitees to add guests</label></div>
                </div>
            )
        },
        {
            key: 'panel4',
            title: 'Limits and buffer',
            subText: (
                <><svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M9.5 2.5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1M2.5.5v1M7.5.5v1M.5 4H3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.5 7a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0ZM5.232 8.768l3.536-3.535" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg><div>Buffer times,max limits</div></>
            ),
            details: (
                <><div className="limit_buffer_container">
                    <>
                        <p className="buffter_text">Buffer times</p>
                        <p className="buffter_event_text">Add buffer time before or after booked Calendly events</p>
                        <div className="buffter_event_container">
                            <p className="buffter_event_text">Before event</p>
                            <CustomDropdown
                                value={state.bufferBeforeEvent}
                                onChange={(e) =>
                                    setState((prev) => ({
                                        ...prev,
                                        bufferBeforeEvent: e.target.value,
                                    }))
                                }
                                options={bufferTimeOptions}

                            />
                            <p className="buffter_event_text">After event</p>
                            <CustomDropdown
                                value={state.bufferAfterEvent}
                                onChange={(e) =>
                                    setState((prev) => ({
                                        ...prev,
                                        bufferAfterEvent: e.target.value,
                                    }))
                                }
                                options={bufferTimeOptions}

                            />

                        </div>
                    </>
                    <>
                        <p className="buffter_text">Max meetings</p>
                        <p className="buffter_event_text">Set the maximum events allowed per day, week or month</p>
                        {/* <div className="max_meeting_container">
                        <TextfieldComponent customStyle="custom_textfield_box"/>
                        <span>Meeting per</span>
                        <CustomDropdown
                            value={state.bufferMaxMeet}
                             onChange={(e) =>
                                setState((prev) => ({
                                  ...prev,
                                  bufferMaxMeet: e.target.value,
                                }))
                              }
                            options={buffterMaxMeetOption}
                        />
                        <CloseIcon/>
                    </div> */}
                        {limits.map((limit, index) => (
                            <div key={index} className="max_meeting_container">
                                <TextfieldComponent customStyle="custom_textfield_box" />
                                <span>Meeting per</span>
                                <CustomDropdown
                                    value={limit.bufferMaxMeet}
                                    onChange={(e) => {
                                        const newLimits = [...limits];
                                        newLimits[index].bufferMaxMeet = e.target.value;
                                        setLimits(newLimits);
                                    }}
                                    options={buffterMaxMeetOption}
                                />
                                <CloseIcon onClick={() => {
                                    const newLimits = limits.filter((_, i) => i !== index);
                                    setLimits(newLimits);
                                }} />
                            </div>
                        ))}
                        {limits.length < 3 && (
                            <CustomButton
                                variant="text"
                                icon={<AddIcon />}
                                sx={{ color: '#004eba' }}
                                onClick={handleAddLimit}
                            >
                                Add another limit
                            </CustomButton>
                        )}
                    </>
                </div>
                </>
            )
        },
        {
            key: 'panel5',
            title: 'Free/busy rules',
            subText: (
                <><svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 0.999512C6 0.447227 5.55229 -0.000488281 5 -0.000488281C4.44772 -0.000488281 4 0.447227 4 0.999512V1.99951H3C2.20435 1.99951 1.44129 2.31558 0.87868 2.87819C0.316071 3.4408 0 4.20386 0 4.99951V7.99951V16.9995C0 17.7952 0.316071 18.5582 0.87868 19.1208C1.44129 19.6834 2.20435 19.9995 3 19.9995H17C17.7957 19.9995 18.5587 19.6834 19.1213 19.1208C19.6839 18.5582 20 17.7952 20 16.9995V7.99951V4.99951C20 4.20386 19.6839 3.4408 19.1213 2.87819C18.5587 2.31558 17.7957 1.99951 17 1.99951H16V0.999512C16 0.447227 15.5523 -0.000488281 15 -0.000488281C14.4477 -0.000488281 14 0.447227 14 0.999512V1.99951H6V0.999512ZM18 6.99951V4.99951C18 4.7343 17.8946 4.47994 17.7071 4.29241C17.5196 4.10487 17.2652 3.99951 17 3.99951H15.001L15 3.99951L14.999 3.99951H5.00099L5 3.99951L4.99901 3.99951H3C2.73478 3.99951 2.48043 4.10487 2.29289 4.29241C2.10536 4.47994 2 4.7343 2 4.99951V6.99951H18ZM2 8.99951H18V16.9995C18 17.2647 17.8946 17.5191 17.7071 17.7066C17.5196 17.8942 17.2652 17.9995 17 17.9995H3C2.73478 17.9995 2.48043 17.8942 2.29289 17.7066C2.10536 17.5191 2 17.2647 2 16.9995V8.99951Z" fill="currentColor"></path></svg><div>Allow invitees to book over selected meetings on your connected calendars</div></>
            ),
            details: (
                <>
                    <div className="busyrule_container">
                        <p>Allow invitees to book over selected meetings on your<CustomButton variant='text' endicon={<OpenInNewIcon />} sx={{ color: '#004eba' }}>Connected calendars</CustomButton></p>
                    </div>
                    {
                        state.showAddException && (
                            <div className="free_busyrule_content">
                                <div className="addmeet_exception_container">
                                    <p>Meeting Name</p>
                                    <CustomDropdown
                                        value={state.meetException}
                                        onChange={(e) =>
                                            setState((prev) => ({
                                                ...prev,
                                                meetException: e.target.value,
                                            }))
                                        }
                                        sx={{
                                            width: '150px',
                                            color: '#004eba',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                border: 'none',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                border: 'none',
                                            },
                                        }}
                                        options={meetExeptionOption}

                                    />

                                </div>
                                <TextfieldComponent placeholder='Meeting name' customStyle="custom_textfield_box" />
                            </div>
                        )
                    }

                    <CustomButton variant="text" icon={<AddIcon />} sx={{ color: '#004eba' }} onClick={handleAddMeetingException}>Add meeting exception</CustomButton>
                </>
            )
        },
        {
            key: 'panel6',
            title: 'Booking page options',
            subText: (
                <><svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M.5 2.75a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0ZM3.781 7.25a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0ZM3 2.75h6.5M.562 7.25h3.219M6.281 7.25H9.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg><div>/new-meeting-2 • 30 min increments • auto time zone</div></>
            ),
            details: (
                <div className="booking_page_option">
                    <div className='container'>
                        <p className="booking_text">You can edit the slug for your event</p>
                        <p className="booking_subtext">calendly.com/hepto/</p>
                        <TextfieldComponent value='new-meeting-3' customStyle="custom_textfield_box" />
                    </div>
                    <div className='container'>
                        <p className="booking_text">Start time increments</p>
                        <p className="booking_subtext">Set the frequency of available time slots for invitees</p>
                        <p className="booking_subtext">show available start times in increments of...</p>
                        <CustomDropdown
                            value={state.bookingPageValue}
                            onChange={(e) =>
                                setState((prev) => ({
                                    ...prev,
                                    bookingPageValue: e.target.value,
                                }))
                            }
                            options={bufferTimeOptions}

                        />
                    </div>
                    <div className="container">
                        <p className="booking_text">Time zone display</p>
                        <p className="booking_subtext">Sets how timezone shows on your booking page</p>
                        <RadioGroup>
                            <FormControlLabel value="invitee's time zone" control={<Radio />} label="Automatically detect and show the times in my invitee's time zone" />
                            <FormControlLabel value="Lock time Zone" control={<Radio />} label="Lock the timezone (best for in-person events)" />
                        </RadioGroup>
                    </div>
                </div>
            )
        },
        {
            key: 'panel7',
            title: 'Invitee form',
            subText: (
                <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" role="img"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M.5 6.5h9M.5 9.5h7"></path><rect x="0.5" y="0.5" width="8.98" height="3" rx="0.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></rect></svg><div>Asking for name, email, +1 question</div></>
            ),
            details: (
                <>
                    <div className="invitee_container">
                        <p className="booking_text">invitee details</p>
                        <p className="booking_subtext">Collect invitees first name and email, or full name and email</p>
                        <CustomDropdown
                            value={state.inviteDetailsValue}
                            onChange={(e) =>
                                setState((prev) => ({
                                    ...prev,
                                    inviteDetailsValue: e.target.value,
                                }))
                            }
                            options={inviteDetailsOptions}

                        />
                        <div className="invitee_checkbox"><input type='checkbox' /><span>Autofill Invitee Name, Email, and Text Reminder Phone Number (when applicable) from prior bookings</span></div>

                    </div>
                    <div className="invitee_container">
                        <p className="booking_text">Invitee guests</p>
                        <p className="booking_subtext">Allow invitees to add guests<Switch defaultChecked /></p>
                    </div>
                    <div className="invitee_container">
                        <p className="booking_text">Invitee questions</p>
                        {state.questions.map((question, index) => (
                            <div key={index} className="invitee_question_container">
                                <div className="invitee_question_content">
                                    <div className="invitee_ques_heading">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" role="img"><circle cx="6.5" cy="3" r="2.25" fill="currentColor"></circle><circle cx="6.5" cy="10" r="2.25" fill="currentColor"></circle><circle cx="6.5" cy="17.0002" r="2.25" fill="currentColor"></circle><circle cx="13.4961" cy="3" r="2.25" fill="currentColor"></circle><circle cx="13.4961" cy="10" r="2.25" fill="currentColor"></circle><circle cx="13.4961" cy="17.0002" r="2.25" fill="currentColor"></circle></svg>
                                        <p>Question {question.id}</p>
                                    </div>
                                    <DeleteOutlineIcon onClick={() => handleDeleteQuestion(question.id)}
                                        style={{ cursor: 'pointer' }} />
                                </div>
                                <textarea className="addguests_details" value='Please share anything that will help prepare for our meeting.'></textarea>
                                <div className="invitee_checkbox"><input type='checkbox' />Required</div>
                                <div className="answertype">
                                    <p>Answer type</p>
                                    <CustomDropdown
                                        value={question.answerTypeValue}
                                        onChange={(e) => {
                                            const updatedQuestions = state.questions.map((q) =>
                                                q.id === question.id ? { ...q, answerTypeValue: e.target.value } : q
                                            );
                                            setState((prev) => ({ ...prev, questions: updatedQuestions }));
                                        }}
                                        options={answerTypeOptions}

                                    />
                                </div>
                                <div className="answertype">
                                    <p>Status</p>
                                    <div>
                                        <label>{question.isQuesOn ? 'On' : 'Off'}</label>
                                        <Switch
                                            checked={question.isQuesOn}
                                            onChange={(e) => {
                                                const updatedQuestions = state.questions.map((q) =>
                                                    q.id === question.id ? { ...q, isQuesOn: e.target.checked } : q
                                                );
                                                setState((prev) => ({ ...prev, questions: updatedQuestions }));
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                    <CustomButton variant="text" icon={<AddIcon />} sx={{ color: '#004eba' }} onClick={handleAddQuestion} >Add new question</CustomButton>
                </>
            )
        },
        // {
        //     key: 'panel8',
        //     title: 'payment',
        //     subText: (
        //         <><svg fill="none" viewBox="0 0 10 10" role="img"><path d="M5.027 2.378V2m0 6v-.44M6.25 3.75v0a1 1 0 0 0-1-1h-.401c-.607 0-1.099.492-1.099 1.099v0c0 .524.37.975.883 1.078l.734.146a1.1 1.1 0 0 1 .883 1.078v0c0 .607-.492 1.099-1.099 1.099H4.75a1 1 0 0 1-1-1v0" stroke="currentColor" stroke-linecap="round"></path><circle cx="5" cy="5" r="4.5" stroke="currentColor"></circle></svg><div>Collect payment for your event</div></>
        //     )
        // },
        {
            key: 'panel8',
            title: 'Notification and workflows',
            subText: (
                <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" role="img"><path d="M8 7.5H2v-4a3 3 0 0 1 6 0ZM4.5 9.499h1M.5 7.499h9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg><div>Calendar invitations</div></>
            ),
            details: (
                <div className="notification_workflows">
                    <>
                        <p>Workflows</p>
                        <div className="workflows_container">
                            <LockOutlinedIcon />
                            <span>Only the owner of the event type can make changes to workflows</span>
                        </div>
                        <div className="none_container">None</div>
                    </>
                    <>
                        <p>Basic notifications</p>
                        <div className="event_invitee_container">
                            <div className="event_invitee_content">
                                <EmailOutlinedIcon />
                                <div className="event_invitee_center_content">Calendar Invitation<p>Immediately after booking</p></div>
                                <MoreVertOutlinedIcon onClick={(e) => handleNotificationClick(e, "calendar_invitation")} sx={{cursor:'pointer'}} />
                            </div>
                            <div className="event_invitee_content">
                                <EmailOutlinedIcon />
                                <div className="event_invitee_center_content">Email reminders</div>
                                <div><span>Off</span><MoreVertOutlinedIcon onClick={(e) => handleNotificationClick(e, "email_reminders")} sx={{cursor:'pointer'}}/></div>
                            </div>
                            <div className="event_invitee_content">
                                <ChatBubbleOutlineOutlinedIcon />
                                <div className="event_invitee_center_content">Text reminders</div>
                                <div><span>Off</span>  <MoreVertOutlinedIcon onClick={(e) => handleNotificationClick(e, "text_reminders")} sx={{cursor:'pointer'}}/></div>
                            </div>
                            <div className="event_invitee_content">
                                <EmailOutlinedIcon />
                                <div className="event_invitee_center_content">Email follow-up</div>
                                <div><span>Off</span>  <MoreVertOutlinedIcon onClick={(e) => handleNotificationClick(e, "email_followup")} sx={{cursor:'pointer'}}/></div>
                            </div>
                            <Menu anchorEl={state.notificationAnchorE1} open={Boolean(state.notificationAnchorE1)} onClose={handleNotificationClose}
                                PaperProps={{
                                    style: { padding: "10px", minWidth: "120px" }
                                }}>

                                {(state.notificationSelectedItem === "calendar_invitation" || state.notificationSelectedItem === "email_reminders" || state.notificationSelectedItem === "text_reminders" || state.notificationSelectedItem === "email_followup") && (
                                    <div onClick={handleNotificationEditClick} style={{cursor:'pointer'}}><EditOutlinedIcon />Edit</div>
                                )}


                                {(state.notificationSelectedItem === "email_reminders" || state.notificationSelectedItem === "text_reminders" || state.notificationSelectedItem === "email_followup") && (
                                    <div>On <Switch defaultChecked /></div>
                                )}


                            </Menu>
                        </div>
                    </>
                </div>
            )
        },
        {
            key: 'panel9',
            title: 'Confirmation page',
            subText: (
                <><svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M.5 3.5v-2a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v2M9.5 7.5v1a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-1M2 5.5l1 1 2-3M6.5 5.5h2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg><div>Display confirmation page</div></>
            ),
            details: (
                <div className="confirmation_page">
                    <div className="afterbooking_content">
                        <p className="booking_text">After booking</p>
                        <CustomDropdown
                            value={state.pageBookingValue}
                            onChange={(e) =>
                                setState((prev) => ({
                                    ...prev,
                                    pageBookingValue: e.target.value,
                                }))
                            }
                            options={pageBookingOption}

                        />

                    </div>
                    <div className="afterbooking_content">
                        <p className="booking_text">Links on confirmation page</p>
                        {state.links.map((link) => (
                            <>
                                <div className="link_content"><LockOutlinedIcon /><p>Link name</p></div>
                                <TextfieldComponent type='text' value={link.linkName}
                                    customStyle="custom_textfield_box"
                                    onChange={(e) => handleLinkNameChange(link.id, e.target.value)} />
                                <p className="booking_text">Status</p>
                                <div><label>{link.isOn ? 'On' : 'Off'}</label><Switch checked={link.isOn}
                                    onChange={(e) => handleSwitchChange(link.id, e.target.checked)} /></div>
                            </>
                        ))}
                    </div>

                    <CustomButton variant="text" icon={<AddIcon />} sx={{ color: '#004eba' }} onClick={handleAddLink}>Add new link</CustomButton>
                </div>
            )
        },

    ]
    return (
        <>
            <div className="edit_event_container">
                <div className="left_container">
                    <div className="left_content">
                        <div className="header">
                            <CloseIcon />
                        </div>
                        <div className="main_container">
                            <div className="main_content">
                                <div className="event_details">
                                    {
                                        state.openCalendarInvitation ? (
                                            <div className="calendar_invitation_modal">
                                                <h1>Calendar Invitation</h1>
                                                <div className="calendar_invitation">
                                                    <div className="edit">
                                                        <CampaignIcon />
                                                        <div><CustomButton variant="text" sx={style.calendar_invitation_custombtn}>Upgrade to Standard</CustomButton>to edit your calendar invitations.</div>
                                                    </div>
                                                    <div>A calendar invitation is sent to your invitee when booking, which adds the event to their calendar.
                                                        <CustomButton variant="text" sx={style.calendar_invitation_custombtn}>Switch to email confirmation</CustomButton>
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
                                                                <CustomButton variant="text" sx={style.calendar_invitation_custombtn}>Upgrade to Standard</CustomButton> to edit your cancellation agreement.</div>
                                                        </div>
                                                    </div>
                                                    <fieldset className="cancelation_content" disabled>
                                                        <label>Cancellation policy</label>
                                                        <textarea className="addguests_details cancellation_textarea"></textarea>
                                                        <div className="edit">
                                                            <ReportGmailerrorredIcon />
                                                            <div>
                                                                <CustomButton variant="text" sx={style.calendar_invitation_custombtn}>Upgrade to Standard</CustomButton> to edit your cancellation agreement.</div>
                                                        </div>
                                                        <div><input type='checkbox' checked disabled /><span>Include cancel and reschedule links in email invitations and reminders (recommended)</span> </div>
                                                    </fieldset>
                                                </div>
                                            </div>
                                        ) : state.openEmailReminders ? (
                                            <>
                                                <div className="calendar_invitation_modal">
                                                    <h1>Email reminders</h1>
                                                    <div className="calendar_invitation">
                                                        <div className="edit">
                                                            <CampaignIcon />
                                                            <div><CustomButton variant="text" sx={style.calendar_invitation_custombtn}>Upgrade to Standard</CustomButton>to edit your calendar invitations.</div>
                                                        </div>
                                                        <div>An invitee will receive a reminder email before a scheduled event at specified times.</div>
                                                        <div>
                                                            <label>Reply-to address</label>
                                                            <CustomDropdown
                                                                value={state.replyAddressContent}
                                                                onChange={(e, newValue) => updateState({ replyAddressContent: newValue })}
                                                                options={replyAddressOptions}

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
                                                        <fieldset disabled>
                                                            <div>
                                                                <label>Timing</label>
                                                                <div className="timing_container">
                                                                    <TextfieldComponent value='1' customStyle='eventTimingTextfield' />
                                                                    <CustomDropdown
                                                                        value={state.selectedTimeUnit}
                                                                        onChange={(e, newValue) => updateState({ selectedTimeUnit: newValue })}
                                                                        options={timeOptions}
                                                                        disabled

                                                                    />

                                                                    <span>before event</span>
                                                                </div>
                                                                <CustomButton variant="text" icon={<AddIcon />} sx={{ color: '#a6bbd1', fontSize: 16 }}>Add another reminder</CustomButton>
                                                            </div>
                                                            <div>
                                                                <label>Status</label>
                                                                <div className='status_container'>Off <FormControlLabel disabled control={<Switch />} /></div>
                                                            </div>
                                                        </fieldset >
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
                                                </div>
                                            </>
                                        ) : state.openTextReminders ? (
                                            <div className="calendar_invitation_modal">
                                                <h1>Text reminders</h1>
                                                <div className="calendar_invitation">
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
                                                            <CustomDropdown
                                                                value={state.selectedTimeUnit}
                                                                onChange={(e, newValue) => updateState({ selectedTimeUnit: newValue })}
                                                                options={timeOptions}
                                                                disabled

                                                            />
                                                            {/* <AutocompleteComponent
                                                                options={timeOptions}
                                                                value={state.selectedTimeUnit}
                                                                onChange={(e, newValue) => updateState({ selectedTimeUnit: newValue })}
                                                                customStyles={{ ...style.newticketsAutocomplete, ...style.eventTimingDropdown }}
                                                                disabled={state.isDropdownDisabled}
                                                            /> */}
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
                                            </div>
                                        ) : state.openEmailFollowup ? (
                                            <div className="calendar_invitation_modal">
                                                <h1>Email Follow-up</h1>
                                                <div className="calendar_invitation">
                                                    <div className="edit">
                                                        <CampaignIcon />
                                                        <div><a>Upgrade to Standard</a> to edit your calendar invitations.</div>
                                                    </div>
                                                    <div>An invitee will receive a reminder email before a scheduled event at specified times.</div>
                                                    <div>
                                                        <label>Reply-to address</label>
                                                        <CustomDropdown
                                                            value={state.replyAddressContent}
                                                            onChange={(e, newValue) => updateState({ replyAddressContent: newValue })}
                                                            options={replyAddressOptions}


                                                        />
                                                        {/* <AutocompleteComponent
                                                            options={replyAddressOptions}
                                                            value={state.replyAddressContent}
                                                            onChange={(e, newValue) => updateState({ replyAddressContent: newValue })}
                                                            customStyles={{ ...style.newticketsAutocomplete }}
                                                        /> */}
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
                                                            <CustomDropdown
                                                                options={timeOptions}
                                                                value={state.selectedTimeUnit}
                                                                onChange={(e, newValue) => updateState({ selectedTimeUnit: newValue })}
                                                                disabled
                                                            />
                                                            {/* <AutocompleteComponent
                                                                options={timeOptions}
                                                                value={state.selectedTimeUnit}
                                                                onChange={(e, newValue) => updateState({ selectedTimeUnit: newValue })}
                                                                customStyles={{ ...style.newticketsAutocomplete, ...style.eventTimingDropdown }}
                                                                disabled={state.isDropdownDisabled}
                                                            /> */}
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
                                            </div>
                                        ) : (
                                            <>
                                                {accordionData.map(({ key, title, subText, details, subHostText }) => (
                                                    <Accordion
                                                        key={key}
                                                        sx={{ ...style.eventAccordion }}
                                                        expanded={state.expandedPanel === key}
                                                        onChange={(e, isExpanded) =>
                                                            updateState({ expandedPanel: isExpanded ? key : null })
                                                        }
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            sx={{
                                                                padding: '16px 24px',
                                                                '& .MuiAccordionSummary-content': {
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: '5px',
                                                                    color: 'black',
                                                                    margin: 0,
                                                                },
                                                            }}
                                                        >
                                                            <Typography sx={{ ...style.eventheading }}>{title}</Typography>
                                                            <div>{subHostText}</div>
                                                            {state.expandedPanel !== key && (
                                                                <div className="accordion_headingsubtext">{subText}</div>
                                                            )}
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            {details}
                                                        </AccordionDetails>
                                                    </Accordion>
                                                ))}
                                            </>
                                        )
                                    }



                                    {/* <Accordion sx={{ ...style.eventAccordion }}
                                        expanded={state.expandedPanel === 'panel8'}
                                        onChange={(e, isExpanded) =>
                                            updateState({ expandedPanel: isExpanded ? 'panel8' : null })
                                        }>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                                            padding: '16px 24px',
                                            '& .MuiAccordionSummary-content': {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '5px',
                                                color: 'black',
                                                margin: 0,
                                            },
                                        }}>
                                            <Typography sx={{ ...style.eventheading }}>Event Details</Typography>
                                            {state.expandedPanel !== 'panel8' && (
                                                <div className="accordion_headingsubtext"><svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 9.99979C0 9.4475 0.447715 8.99979 1 8.99979H19C19.5523 8.99979 20 9.4475 20 9.99979C20 10.5521 19.5523 10.9998 19 10.9998H1C0.447715 10.9998 0 10.5521 0 9.99979Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M0 3.99995C0 3.44766 0.447715 2.99995 1 2.99995H19C19.5523 2.99995 20 3.44766 20 3.99995C20 4.55223 19.5523 4.99995 19 4.99995H1C0.447715 4.99995 0 4.55223 0 3.99995Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M0 15.9997C0 15.4474 0.447715 14.9997 1 14.9997H14C14.5523 14.9997 15 15.4474 15 15.9997C15 16.552 14.5523 16.9997 14 16.9997H1C0.447715 16.9997 0 16.552 0 15.9997Z" fill="currentColor"></path></svg><div>Tell your invitees what this meeting is about</div></div>
                                            )}
                                        </AccordionSummary>
                                        <AccordionDetails>

                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ ...style.eventAccordion }}
                                        expanded={state.expandedPanel === 'panel9'}
                                        onChange={(e, isExpanded) =>
                                            updateState({ expandedPanel: isExpanded ? 'panel9' : null })
                                        }>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                                            padding: '16px 24px',
                                            '& .MuiAccordionSummary-content': {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '5px',
                                                color: 'black',
                                                margin: 0,
                                            },
                                        }}>
                                            <Typography sx={{ ...style.eventheading }}>Availability</Typography>
                                            {state.expandedPanel !== 'panel9' && (
                                                <div className="accordion_headingsubtext"><div>Mon,Tue,Wed,Thu,Fri,Sat,hours Vary</div></div>
                                            )}
                                        </AccordionSummary>
                                        <AccordionDetails>

                                        </AccordionDetails>
                                    </Accordion>

                                    <Accordion sx={{ ...style.eventAccordion }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />} sx={{
                                                padding: '16px 24px',
                                                '& .MuiAccordionSummary-content': {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '5px',
                                                    color: 'black',
                                                    margin: '0px !important',
                                                },
                                            }}>
                                            <Typography sx={{ ...style.eventheading }}>Host</Typography>
                                            <div className="host_invitees">
                                                <button className="user_logo">H</button>
                                                <div>hepto(you)</div>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails >
                                            <div className="host_invitee_content">
                                                <Typography sx={{ ...style.eventheading }}>Invitees</Typography>
                                                <div> <input type='checkbox' checked /><label>Allow invitees to add guests</label></div>
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ ...style.eventAccordion }} expanded={state.expandedPanel === 'panel1'}
                                        onChange={(e, isExpanded) =>
                                            updateState({ expandedPanel: isExpanded ? 'panel1' : null })
                                        } >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />} sx={{
                                                padding: '16px 24px',
                                                '& .MuiAccordionSummary-content': {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '5px',
                                                    color: 'black',
                                                    margin: 0,
                                                },
                                            }}>
                                            <Typography sx={{ ...style.eventheading }}>Limits and buffer</Typography>
                                            {state.expandedPanel !== 'panel1' && (
                                                <div className="accordion_headingsubtext"><svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M9.5 2.5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1M2.5.5v1M7.5.5v1M.5 4H3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.5 7a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0ZM5.232 8.768l3.536-3.535" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg><div>Buffer times,max limits</div></div>
                                            )}
                                        </AccordionSummary>
                                        <AccordionDetails >

                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        sx={{ ...style.eventAccordion }} expanded={state.expandedPanel === 'panel2'}
                                        onChange={(e, isExpanded) =>
                                            updateState({ expandedPanel: isExpanded ? 'panel2' : null })
                                        }>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />} sx={{
                                                padding: '16px 24px',
                                                '& .MuiAccordionSummary-content': {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '5px',
                                                    color: 'black',
                                                    margin: 0,
                                                },
                                            }}>
                                            <Typography sx={{ ...style.eventheading }}>Free/busy rules</Typography>
                                            {state.expandedPanel !== 'panel2' && (
                                                <div className="accordion_headingsubtext"><svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 0.999512C6 0.447227 5.55229 -0.000488281 5 -0.000488281C4.44772 -0.000488281 4 0.447227 4 0.999512V1.99951H3C2.20435 1.99951 1.44129 2.31558 0.87868 2.87819C0.316071 3.4408 0 4.20386 0 4.99951V7.99951V16.9995C0 17.7952 0.316071 18.5582 0.87868 19.1208C1.44129 19.6834 2.20435 19.9995 3 19.9995H17C17.7957 19.9995 18.5587 19.6834 19.1213 19.1208C19.6839 18.5582 20 17.7952 20 16.9995V7.99951V4.99951C20 4.20386 19.6839 3.4408 19.1213 2.87819C18.5587 2.31558 17.7957 1.99951 17 1.99951H16V0.999512C16 0.447227 15.5523 -0.000488281 15 -0.000488281C14.4477 -0.000488281 14 0.447227 14 0.999512V1.99951H6V0.999512ZM18 6.99951V4.99951C18 4.7343 17.8946 4.47994 17.7071 4.29241C17.5196 4.10487 17.2652 3.99951 17 3.99951H15.001L15 3.99951L14.999 3.99951H5.00099L5 3.99951L4.99901 3.99951H3C2.73478 3.99951 2.48043 4.10487 2.29289 4.29241C2.10536 4.47994 2 4.7343 2 4.99951V6.99951H18ZM2 8.99951H18V16.9995C18 17.2647 17.8946 17.5191 17.7071 17.7066C17.5196 17.8942 17.2652 17.9995 17 17.9995H3C2.73478 17.9995 2.48043 17.8942 2.29289 17.7066C2.10536 17.5191 2 17.2647 2 16.9995V8.99951Z" fill="currentColor"></path></svg><div>Allow invitees to book over selected meetings on your connected calendars</div></div>
                                            )}
                                        </AccordionSummary>
                                        <AccordionDetails >

                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ ...style.eventAccordion }}
                                        expanded={state.expandedPanel === 'panel3'}
                                        onChange={(e, isExpanded) =>
                                            updateState({ expandedPanel: isExpanded ? 'panel3' : null })
                                        }>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />} sx={{
                                                padding: '16px 24px',
                                                '& .MuiAccordionSummary-content': {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '5px',
                                                    color: 'black',
                                                    margin: 0,
                                                },
                                            }}>
                                            <Typography sx={{ ...style.eventheading }}>Booking page options</Typography>
                                            {state.expandedPanel !== 'panel3' && (
                                                <div className="accordion_headingsubtext"><svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M.5 2.75a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0ZM3.781 7.25a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0ZM3 2.75h6.5M.562 7.25h3.219M6.281 7.25H9.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg><div>/new-meeting-2 • 30 min increments • auto time zone</div></div>
                                            )}

                                        </AccordionSummary>
                                        <AccordionDetails >

                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ ...style.eventAccordion }}
                                        expanded={state.expandedPanel === 'panel4'}
                                        onChange={(e, isExpanded) =>
                                            updateState({ expandedPanel: isExpanded ? 'panel4' : null })
                                        }>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />} sx={{
                                                padding: '16px 24px',
                                                '& .MuiAccordionSummary-content': {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '5px',
                                                    color: 'black',
                                                    margin: 0,
                                                },
                                            }}>
                                            <Typography sx={{ ...style.eventheading }}>Invitee form</Typography>
                                            {state.expandedPanel !== 'panel4' && (
                                                <div className="accordion_headingsubtext"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" role="img"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M.5 6.5h9M.5 9.5h7"></path><rect x="0.5" y="0.5" width="8.98" height="3" rx="0.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></rect></svg><div>Asking for name, email, +1 question</div></div>
                                            )}
                                        </AccordionSummary>
                                        <AccordionDetails >

                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ ...style.eventAccordion }}
                                        expanded={state.expandedPanel === 'panel5'}
                                        onChange={(e, isExpanded) =>
                                            updateState({ expandedPanel: isExpanded ? 'panel5' : null })
                                        }>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />} sx={{
                                                padding: '16px 24px',
                                                '& .MuiAccordionSummary-content': {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '5px',
                                                    color: 'black',
                                                    margin: 0,
                                                },
                                            }}>
                                            <Typography sx={{ ...style.eventheading }}>Payment</Typography>
                                            {state.expandedPanel !== 'panel5' && (
                                                <div className="accordion_headingsubtext"><svg fill="none" viewBox="0 0 10 10" role="img"><path d="M5.027 2.378V2m0 6v-.44M6.25 3.75v0a1 1 0 0 0-1-1h-.401c-.607 0-1.099.492-1.099 1.099v0c0 .524.37.975.883 1.078l.734.146a1.1 1.1 0 0 1 .883 1.078v0c0 .607-.492 1.099-1.099 1.099H4.75a1 1 0 0 1-1-1v0" stroke="currentColor" stroke-linecap="round"></path><circle cx="5" cy="5" r="4.5" stroke="currentColor"></circle></svg><div>Collect payment for your event</div></div>
                                            )}
                                        </AccordionSummary>
                                        <AccordionDetails >

                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ ...style.eventAccordion }}
                                        expanded={state.expandedPanel === 'panel6'}
                                        onChange={(e, isExpanded) =>
                                            updateState({ expandedPanel: isExpanded ? 'panel6' : null })
                                        }>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />} sx={{
                                                padding: '16px 24px',
                                                '& .MuiAccordionSummary-content': {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '5px',
                                                    color: 'black',
                                                    margin: 0,
                                                },
                                            }}>
                                            <Typography sx={{ ...style.eventheading }}>Notification and workflows</Typography>
                                            {state.expandedPanel !== 'panel6' && (
                                                <div className="accordion_headingsubtext"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" role="img"><path d="M8 7.5H2v-4a3 3 0 0 1 6 0ZM4.5 9.499h1M.5 7.499h9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg><div>Calendar invitations</div></div>
                                            )}
                                        </AccordionSummary>
                                        <AccordionDetails >

                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ ...style.eventAccordion }}
                                        expanded={state.expandedPanel === 'panel7'}
                                        onChange={(e, isExpanded) =>
                                            updateState({ expandedPanel: isExpanded ? 'panel7' : null })
                                        }>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />} sx={{
                                                padding: '16px 24px',
                                                '& .MuiAccordionSummary-content': {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '5px',
                                                    color: 'black',
                                                    margin: 0,
                                                },
                                            }}>
                                            <Typography sx={{ ...style.eventheading }}>Confirmation page</Typography>
                                            {state.expandedPanel !== 'panel7' && (
                                                <div className="accordion_headingsubtext"><svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M.5 3.5v-2a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v2M9.5 7.5v1a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-1M2 5.5l1 1 2-3M6.5 5.5h2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg><div>Display confirmation page</div></div>
                                            )}

                                        </AccordionSummary>
                                        <AccordionDetails >

                                        </AccordionDetails>
                                    </Accordion> */}
                                </div>
                                <div className="button_footer">
                                    <CustomButton variant="text" sx={{ maginLeft: 'auto' }}>Back</CustomButton>
                                    <CustomButton variant="contained" sx={{ margin: '0px' }}>
                                        Save changes
                                    </CustomButton>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="right_container">
                    <div className="right_content">
                        <div className="main_content">
                            <div className="header">
                                <p><b>This is a preview.</b> To book an event, share the link with your invitees.</p>
                            </div>
                            <div className="middle_content">
                                <div className="middle_header">
                                    <div className="user">hepto</div>
                                    <div className="eventname">Event name here</div>
                                    <div className="location_container">

                                        <div className="loc_content"><AccessTimeOutlinedIcon /><span>30 min</span></div>

                                        <div className="loc_content"><LocationOnOutlinedIcon /><span>Add a location for it to show here</span></div>


                                    </div>
                                </div>

                                <div className="select_dateandtime_container" style={{
                                    maxWidth: state.showTimeSlots ? '571px' : '400px'
                                }}>

                                    <h3>Select a Date & Time</h3>
                                    <div className="add_time_copylink_container" style={{
                                        width: state.showTimeSlots ? '550px' : '345px'
                                    }}>

                                        <Grid container spacing={2}>

                                            <Grid item xs={12} md={state.showTimeSlots ? 6 : 12}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                                                    <div style={{ width: 320, overflowY: 'hidden' }}>
                                                        <div className="copylink_datepicker">
                                                            <CustomDatePicker
                                                                value={state.selectedDate}
                                                                onChange={handleDateChange}
                                                                disablePastDates={disablePastDates}
                                                            />

                                                        </div>
                                                    </div>
                                                </LocalizationProvider>
                                                <div className="timezone_troubleshoot">
                                                    <div className="timeZone_copylink">
                                                        <label>Time zone</label>
                                                        <button className='copylink_timezone_container' onClick={handleTimezone} >
                                                            <PublicOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                                                            <p>Eastern Time - US & Canada  ({state.currentTime})</p>
                                                            {state.isOpenTimeZone ? <ArrowDropDownIcon fontSize="small" /> : <ArrowDropUpIcon fontSize="small" />}
                                                        </button>
                                                        {state.isOpenTimeZone && (
                                                            <div className="custom_timezone_dropdown">
                                                                <div className="time_container">
                                                                    <p>Available times locked to</p>
                                                                    <div>Eastern Time - US & Canada({state.currentTime})</div>
                                                                </div>
                                                                <div className="timeformat_container">
                                                                    <p>TIME FORMAT</p>
                                                                    <div className="time_format_toggle">
                                                                        <span>am/pm</span>
                                                                        <Switch size="small" checked={state.is24HourFormat} onChange={handleFormatSwitch} />
                                                                        <span>24h</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}


                                                    </div>

                                                    <div className="troubleshoot_content">
                                                        <Tooltip
                                                            title={
                                                                <div className="troubleshoot_tooltipcontainer">
                                                                    <h4>  Troubleshoot your availability</h4>
                                                                    <p>See why specific times are not available on your calendar.</p>
                                                                    <div className='content'>
                                                                        <InfoOutlinedIcon fontSize="small" />
                                                                        <span variant="caption">
                                                                            <strong>Don't worry</strong>-your invitees will never see this information.
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            }

                                                            placement="top"
                                                            enterTouchDelay={0}
                                                            leaveTouchDelay={4000}
                                                            componentsProps={{
                                                                tooltip: {
                                                                    sx: {

                                                                        backgroundColor: ' #666666;',
                                                                        color: 'white',
                                                                        borderRadius: 1.5,
                                                                        width: '290px'
                                                                    },
                                                                },
                                                            }}
                                                        >

                                                            <Button variant="outlined" sx={style.troubleshoot_btn} startIcon={<BuildOutlinedIcon />}>Troubleshoot</Button>


                                                        </Tooltip>
                                                        <InfoOutlinedIcon fontSize="small" />
                                                    </div>
                                                </div>
                                            </Grid>


                                            {state.showTimeSlots && (
                                                <Grid item xs={12} md={6} className="timeslots_grid">
                                                    <h3>
                                                        {state.selectedDate
                                                            ? dayjs(state.selectedDate).format("dddd, MMMM D")
                                                            : "Select a date"}
                                                    </h3>

                                                    <List className="edit_timeslots_list">
                                                        {timeSlots.map((time, index) => (
                                                            <ListItem
                                                                key={index}
                                                                disablePadding
                                                                className="timeslots_list_item"
                                                                onClick={() => handleTimeClick(time)}

                                                            >
                                                                <Button variant='contained' className="timeslots_list_button" sx={{
                                                                    backgroundColor: "white !important",
                                                                    color: "rgb(0, 105, 255)",
                                                                    width: '100%',

                                                                }}
                                                                >{time}</Button>

                                                            </ListItem>
                                                        ))}
                                                    </List>

                                                </Grid>
                                            )}
                                        </Grid>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default EditEvent;