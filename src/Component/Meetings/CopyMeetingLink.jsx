import React, { useState, useEffect } from "react";
import CustomButton from '../Meetings/CustomButton';
import TimeZoneMenu from "./TimeZoneMenu";
import TextfieldComponent from "../TextfieldComponent";
import { Typography, Grid, List, ListItem, ListItemButton, Box, IconButton, Button, Switch, FormControlLabel, RadioGroup, Radio, Tooltip } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import { ArrowDropDownIcon, ArrowDropUpIcon, InfoOutlinedIcon } from '../Icon';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import style from "../MuiStyles/muiStyle";
import { parse, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import 'dayjs/locale/en-gb';
import {
    PermIdentityOutlinedIcon,
    OpenInNewIcon,
    PublicOutlinedIcon,
    AccessTimeIcon,
    VideocamOutlinedIcon,
    CheckCircleIcon,
    BuildOutlinedIcon,
    CalendarTodayOutlinedIcon,
    ArrowBackOutlinedIcon,
    KeyboardArrowDownOutlinedIcon,
    LinkOutlinedIcon,
    
} from '../Icon';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale('en-gb');


const baseTimeSlots = [
    "9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am",
    "12:00 pm", "12:30 pm", "1:00 pm", "1:30 pm", "2:00 pm", "2:30 pm", "3:00 pm", "3:30 pm",
    "4:00 pm", "4:30 pm", "5:00 pm", "5:30 pm", "6:00 pm", "6:30 pm", "7:00 pm", "7:30 pm",
    "8:00 pm", "8:30 pm", "9:00 pm", "9:30 pm", "10:00 pm", "10:30 pm", "11:00 pm", "11:30 pm"
];

const CustomCalendarHeader = ({ currentMonth, onMonthChange }) => {
    const minMonth = dayjs(); // Disable going back before current month
    const isPrevDisabled = currentMonth.isSame(minMonth, 'month');

    const handlePrev = () => {
        if (!isPrevDisabled) {
            onMonthChange(currentMonth.subtract(1, 'month'));
        }
    };

    const handleNext = () => {
        onMonthChange(currentMonth.add(1, 'month'));
    };

    const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    const iconButtonStyle = (isDisabled) => ({
        backgroundColor: isDisabled ? 'transparent' : '#E3F2FD',
        color: isDisabled ? '#ccc' : '#007FFF',
        borderRadius: '50%', // 👈 Fully rounded
        padding: '6px',
        width: '32px',
        height: '32px',
        transition: 'all 0.2s',
        '&:hover': {
            backgroundColor: isDisabled ? 'transparent' : '#BBDEFB',
        },
    });

    return (
        <Box>
            {/* Month + Arrows */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: '6px 6px 15px',
                    gap: '32px',
                }}
            >
                <IconButton
                    onClick={handlePrev}
                    size="small"
                    disabled={isPrevDisabled}
                    sx={iconButtonStyle(isPrevDisabled)}
                >
                    <ChevronLeft />
                </IconButton>
                <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
                    {currentMonth.format('MMMM YYYY')}
                </Typography>
                <IconButton
                    onClick={handleNext}
                    size="small"
                    sx={iconButtonStyle(false)}
                >
                    <ChevronRight />
                </IconButton>
            </Box>

            {/* Weekday Labels */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingRight: '16px',
                    mb: 1,
                }}
            >
                {weekDays.map((day) => (
                    <Box
                        key={day}
                        sx={{
                            fontWeight: 400,
                            fontSize: '12px',
                            lineHeight: 1,
                            textTransform: 'uppercase',
                            width: '100%',
                            textAlign: 'center',
                        }}
                    >
                        {day}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

const CopyMeetingLink = () => {
    const [state, setState] = useState({
        selectedDate: null,
        showTimeSlots: false,
        selectedTime: [],
        timeZoneAnchor: null,
        isOpenTimeZone: false,
        selectedTimeZone: "Eastern Time - US & Canada",
        eventDetails: false,
        addGuests: false,
        menuModal: false,
        is24HourFormat: false,
        currentTime: '',
        selectedLocation: '',
        meetingStatus: false,

    })
    const timeZone = 'America/New_York';

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
    // const disablePastDates = (date) => date.isBefore(dayjs(), "day");
    const disablePastDates = (date) => {
        const today = dayjs().startOf('day');
        const isPast = date.isBefore(today);
        const isSunday = date.day() === 0;
        return isPast || isSunday;
    };

    const handleTimeZoneClick = (event) => {
        updateState({ timeZoneAnchor: event.currentTarget });
    };

    const handleTimeZoneSelect = (zone) => {
        updateState({ selectedTimeZone: zone, timeZoneAnchor: null });
    };
    const formatTime = (time) => {
        const parsed = parse(time, 'h:mm a', new Date());
        return state.is24HourFormat ? format(parsed, 'HH:mm') : format(parsed, 'h:mm a');
    };

    const timeSlots = baseTimeSlots.map(formatTime);
    const handleToggle = () => {
        setState((prev) => ({ ...prev, isOpenTimeZone: !prev.isOpenTimeZone }));
    };

    const handleFormatSwitch = () => {
        setState((prev) => ({ ...prev, is24HourFormat: !prev.is24HourFormat }));
    };
    const handleChange = (event) => {
        setState((prevState) => ({
            ...prevState,
            selectedLocation: event.target.value
        }));
    };
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
                        maxWidth: state.showTimeSlots ? '1060px' : '800px'
                    }}>
                        <a className="brand_container">
                            <div className="branding_content">
                                <div className="powered_text">powered by</div>
                                <div className="title">Notify</div>
                            </div>
                        </a>
                        {
                            state.meetingStatus ? (
                                <div className="schedulemeet_status_container">
                                    <div className="confirmation_header">
                                        <h1><CheckCircleIcon sx={style.checkcircle} />You are scheduled</h1>
                                        <div>A calendar invitation has been sent to your email address.</div>
                                        <div>
                                            <CustomButton variant="outlined" endicon={<OpenInNewIcon />}>Open invitation</CustomButton></div>
                                    </div>
                                    <div className="status_container">
                                        <div className="time_location_event"><PermIdentityOutlinedIcon /><span>hepto</span>  </div>
                                        <div className="time_location_event"><CalendarTodayOutlinedIcon /><span>8:30pm - 9:00pm, Wednesday, March 26, 2025</span></div>
                                        <div className="time_location_event"><PublicOutlinedIcon /><span>Eastern Time - US & Canada</span></div>
                                        <div className="time_location_event"><VideocamOutlinedIcon /><span>Web conferencing details to follow.</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (

                                <>
                                    {
                                        state.eventDetails ? (
                                            <>
                                                <div className="left_container">
                                                    <ArrowBackOutlinedIcon className="back_button" onClick={() => updateState({ eventDetails: false })} />
                                                    <p>hepto</p>
                                                    <h1>30 Minute Meeting</h1>
                                                    <div className="timeconatiner">
                                                        <div className="time_location_event">
                                                            <AccessTimeIcon /><span>30 min</span>
                                                        </div>

                                                        <div className="time_location_event"><CalendarTodayOutlinedIcon /><span>8:30pm - 9:00pm, Wednesday, March 26, 2025</span></div>
                                                        <div className="time_location_event"><PublicOutlinedIcon /><span>Eastern Time - US & Canada</span></div>
                                                    </div>
                                                    <div className="button_container">
                                                        <CustomButton variant='text' sx={style.cookie_btn}>Cookie settings</CustomButton>
                                                        <CustomButton variant='text' sx={style.report_btn}>Report abuse</CustomButton>
                                                    </div>

                                                </div>
                                                <div className="right_container" style={{ minWidth: '500px' }}>
                                                    <div className="copylink_eventdetails_content">
                                                        <h4>Enter Details</h4>
                                                        <div className="eventdetail_content">
                                                            <label>Name<span>*</span></label>
                                                            <TextfieldComponent type='text' customStyle='custom_textfield_box' />
                                                        </div>
                                                        <div className="eventdetail_content">
                                                            <label>Email<span>*</span></label>
                                                            <TextfieldComponent type='email' customStyle='custom_textfield_box' />
                                                        </div >
                                                        <div className="eventdetail_content">
                                                            <label>Location<span>*</span></label>
                                                            <RadioGroup
                                                                aria-label="location"
                                                                name="location"
                                                                value={state.selectedLocation}
                                                                onChange={handleChange}
                                                            >
                                                                <FormControlLabel
                                                                    value="googleMeet"
                                                                    control={<Radio />}
                                                                    label={
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <img src="/assets/images/Googlemeet.svg" alt="Google Meet" style={{ width: 20, height: 20, marginRight: 8 }} />
                                                                            Google Meet
                                                                        </div>
                                                                    }
                                                                />
                                                                {state.selectedLocation === 'googleMeet' && (
                                                                    <p className="location_subtext">Web conferencing details provided upon confirmation.</p>
                                                                )}
                                                                <FormControlLabel
                                                                    value="microsoftTeams"
                                                                    control={<Radio />}
                                                                    label={
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <img src="/assets/images/Teams.svg" alt="Microsoft Teams" style={{ width: 20, height: 20, marginRight: 8 }} />
                                                                            Microsoft Teams
                                                                        </div>
                                                                    }
                                                                />
                                                                {state.selectedLocation === 'microsoftTeams' && (
                                                                    <p className="location_subtext">Web conferencing details provided upon confirmation.</p>
                                                                )}
                                                            </RadioGroup>
                                                        </div >
                                                        {
                                                            state.addGuests ? (
                                                                <div className="addguests_container">
                                                                    <label>Guest Email(s)</label>
                                                                    <TextfieldComponent customStyle='custom_textfield_box guestsemail_textbox' />
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
                                                        <CustomButton variant="contained" onClick={() => updateState({ meetingStatus: true })}>Schedule Event</CustomButton>

                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="left_container">

                                                    <p>hepto</p>
                                                    <h1>30 Minute Meeting</h1>
                                                    <div className="timeconatiner">
                                                        <div className="time_location_event">
                                                            <AccessTimeIcon /> <span>30 min</span>
                                                        </div>

                                                        <div className="button_container">
                                                            <CustomButton variant='text' sx={style.cookie_btn}>Cookie settings</CustomButton>
                                                            <CustomButton variant='text' sx={style.report_btn}>Report abuse</CustomButton>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="right_container" style={{
                                                    minWidth: state.showTimeSlots ? '559px' : '300px'
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
                                                                            <StaticDatePicker
                                                                                displayStaticWrapperAs="desktop"
                                                                                value={state.selectedDate}
                                                                                onChange={handleDateChange}
                                                                                shouldDisableDate={disablePastDates}
                                                                                slots={{
                                                                                    toolbar: false,
                                                                                    calendarHeader: CustomCalendarHeader,
                                                                                }}
                                                                                slotProps={{

                                                                                    day: {
                                                                                        sx: {
                                                                                            margin: '0px 4px 0px 4px',

                                                                                            '&.Mui-disabled': {
                                                                                                color: '#9e9e9e',
                                                                                                fontSize: '14px',
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                padding: '1px 0 0',
                                                                                                width: '44px',
                                                                                                height: '44px',
                                                                                                marginTop: '2px'
                                                                                            },
                                                                                            '&.Mui-selected': {
                                                                                                backgroundColor: 'rgb(0 105 255 / 7%)',
                                                                                                color: 'white',
                                                                                                width: '44px',
                                                                                                height: '44px',
                                                                                                textAlign: 'center',
                                                                                                marginTop: '2px',
                                                                                                padding: '1px 0 0',
                                                                                                fontWeight: 'bold',
                                                                                                fontSize: '14px',
                                                                                            },
                                                                                            '&:not(.Mui-selected):not(.Mui-disabled)': {
                                                                                                backgroundColor: 'rgb(0 105 255 / 7%)',
                                                                                                color: ' #0060e6',
                                                                                                fontWeight: 'bold',
                                                                                                fontSize: '14px',
                                                                                                width: '44px',
                                                                                                height: '44px',
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                marginTop: '2px',
                                                                                                padding: '1px 0 0',
                                                                                            },
                                                                                            '&.MuiPickersDay-today': {
                                                                                                border: 'none !important',
                                                                                                position: 'relative',
                                                                                                '&::after': {
                                                                                                    content: '""',
                                                                                                    position: 'absolute',
                                                                                                    bottom: 6,
                                                                                                    left: '50%',
                                                                                                    transform: 'translateX(-50%)',
                                                                                                    width: 4,
                                                                                                    height: 4,
                                                                                                    borderRadius: '50%',
                                                                                                    backgroundColor: '#007FFF',
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                    // Optional customization of weekday header
                                                                                    dayOfWeekLabel: {
                                                                                        sx: {
                                                                                            display: 'none',
                                                                                        },
                                                                                    },

                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </LocalizationProvider>
                                                                <div className="timezone_troubleshoot">
                                                                    <div className="timeZone_copylink">
                                                                        <label>Time zone</label>
                                                                        <button className='copylink_timezone_container' onClick={handleToggle} >
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
                                                                        {/* <div className="select_timezone">
                                                        <div
                                                            onClick={handleTimeZoneClick} className="timezone"

                                                        >
                                                            <PublicOutlinedIcon /> {state.selectedTimeZone}  <ExpandMoreIcon fontSize="small" />
                                                        </div>
                                                        <TimeZoneMenu anchorEl={state.timeZoneAnchor} open={Boolean(state.timeZoneAnchor)} onClose={() => updateState({ timeZoneAnchor: null })} onSelect={handleTimeZoneSelect} />
                                                    </div> */}
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

                                                                    <List className="timeslots_list">
                                                                        {timeSlots.map((time, index) => (
                                                                            <ListItem
                                                                                key={index}
                                                                                disablePadding
                                                                                className="timeslots_list_item"
                                                                                onClick={() => handleTimeClick(time)}

                                                                            >
                                                                                <Button variant='contained' className="timeslots_list_button" sx={{
                                                                                    backgroundColor: state.selectedTime.includes(time) ? "rgb(66, 66, 66) !important" : "white !important",
                                                                                    color: state.selectedTime.includes(time) ? "#fff" : "rgb(0, 105, 255)",
                                                                                    width: state.selectedTime.includes(time) ? '48.5%  !important' : '100%',
                                                                                    border: state.selectedTime.includes(time) && 'none !important'
                                                                                }}
                                                                                >{time}</Button>
                                                                                {state.selectedTime.includes(time) && (
                                                                                    <CustomButton variant="contained" sx={style.timeslots_list_nextbtn} onClick={() => updateState({ eventDetails: true })} >
                                                                                        Next
                                                                                    </CustomButton>
                                                                                )}
                                                                            </ListItem>
                                                                        ))}
                                                                    </List>

                                                                </Grid>
                                                            )}
                                                        </Grid>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }
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