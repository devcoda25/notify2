import React, { useState, useRef } from "react";
import dayjs from "dayjs";
import { Button, IconButton } from "@mui/material";
import TimezoneDropdown from "./TimeZoneMenu";
import AutocompleteComponent from "../AutocompleteComponent";
import TextfieldComponent from "../TextfieldComponent";
import style from "../MuiStyles/muiStyle";
import {
    ExpandMoreIcon,
    NavigateBeforeIcon,
    NavigateNextIcon,
    EditOutlinedIcon,
    PeopleAltOutlinedIcon,
    AccessTimeOutlinedIcon,
    CalendarTodayOutlinedIcon,
    KeyboardArrowDownOutlinedIcon,
    VideoCameraFrontIcon,
    PhoneIcon,
    RoomIcon,
    FormatBoldIcon,
    FormatItalicIcon,
    FormatUnderlinedIcon,
    FormatListBulletedIcon,
    FormatListNumberedIcon,
    InsertLinkIcon,
    UndoIcon,
    RedoIcon

} from "../Icon";
import CustomButton from "./CustomButton";
import SelectEventLocation from "./SelectEventLocation";
import TextEditor from "./TextEditor";

const eventOptions = [
    { icon: <VideoCameraFrontIcon />, label: "Zoom" },
    { icon: <PhoneIcon />, label: "Phone" },
    { icon: <RoomIcon />, label: "In-person" },
];
const timezones = [
    { label: "Eastern Time - US & Canada", time: "12:00am" },
    { label: "Central Time - US & Canada", time: "8:20am" },
    { label: "Mountain Time - US & Canada", time: "7:20am" },
    { label: "Pacific Time - US & Canada", time: "9:20am" },
    { label: "Alaska Time", time: "5.20am" },
    { label: "Arizona, Yukon Time", time: "5:00pm" },
    { label: "Newfoundland Time", time: "10:50am" },
];

const CreateNewMeetingComponent = () => {
    const durationOptions = ['15 Minutes', '30 Minutes', '45 Minutes', '1 hour', 'Custom'];
    const currentTime = dayjs();

    const [state, setState] = useState({
        timeZoneAnchor: "Eastern Time - US & Canada",
        selectedTimeZone: "Eastern Time - US & Canada",
        durationContent: durationOptions[1],
        currentDate: dayjs(),
        selectedSlots: [],
        daySlots: {},
        showEditor: false,
        newMeetNext: false,
    });
    const editorRef = useRef(null);

    const handleNextClick = () => {
        setState((prev) => ({ ...prev, newMeetNext: true }));
    };
    const handleTimeZoneClick = (event) => {
        setState((prev) => ({ ...prev, timeZoneAnchor: event.currentTarget }));
    };

    const handleTimeZoneSelect = (zone) => {
        setState((prev) => ({ ...prev, selectedTimeZone: zone, timeZoneAnchor: null }));
    };

    const getWeekDays = (date) => {
        return Array.from({ length: 7 }, (_, i) => date.startOf("week").add(i, "day"));
    };
    const weekDays = getWeekDays(state.currentDate);



    const timeSlots = Array.from({ length: 24 }, (_, i) =>
        dayjs().hour(i).minute(0).format("hA")
    );

    const handleSlotClick = (day, hour, isSecondHalf) => {
        const slotTime = isSecondHalf ? hour.clone().add(30, "minute") : hour;

        if (day.isBefore(currentTime, "day") || (day.isSame(currentTime, "day") && slotTime.isBefore(currentTime))) {
            return;
        }

        const slot = {
            day: day.format("YYYY-MM-DD"),
            time: `${slotTime.format("h:mm A")} - ${slotTime.clone().add(30, "minute").format("h:mm A")}`,
        };

        setState((prev) => ({
            ...prev,
            selectedSlots: [...prev.selectedSlots, slot],
            daySlots: { ...prev.daySlots, [day.format("YYYY-MM-DD")]: true },
        }));
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

        setState((prev) => ({
            ...prev,
            selectedSlots: [...prev.selectedSlots, ...slots],
            daySlots: { ...prev.daySlots, [day.format("YYYY-MM-DD")]: true },
        }));
    };

    const handleClearItem = (day) => {
        if (day.isBefore(currentTime, "day")) return;

        setState((prev) => ({
            ...prev,
            selectedSlots: prev.selectedSlots.filter(slot => slot.day !== day.format("YYYY-MM-DD")),
            daySlots: { ...prev.daySlots, [day.format("YYYY-MM-DD")]: false },
        }));
    };



    //     const [timeZoneAnchor, setTimeZoneAnchor] = useState(null);
    //     const [selectedTimeZone, setSelectedTimeZone] = useState("Eastern Time - US & Canada");
    //    const [durationContent, setDurationContent] = useState(durationOptions[1]);
    //     const [currentDate, setCurrentDate] = useState(dayjs());
    //     const [selectedSlots, setSelectedSlots] = useState([]);
    //     const [daySlots, setDaySlots] = useState({});
    //     const [showEditor, setShowEditor] = useState(false);
    //     const [showOptions, setShowOptions] = useState(false);
    //     const [isFocused, setIsFocused] = useState(false);
    //     const [newmeetNext, setNewMeetNext] = useState(false);



    // const handleNextClick = () => {
    //     setNewMeetNext(true)
    // }

    // const handleTimeZoneClick = (event) => {
    //     setTimeZoneAnchor(event.currentTarget);
    // };

    // const handleTimeZoneSelect = (zone) => {
    //     setSelectedTimeZone(zone);
    //     setTimeZoneAnchor(null);
    // };
    // const getWeekDays = (date) => {
    //     let startOfWeek = date.startOf("week"); // Start of week (Sunday)
    //     return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
    // };


    // const timeSlots = Array.from({ length: 24 }, (_, i) =>
    //     dayjs().hour(i).minute(0).format("hA")
    // );

    //  const handleSlotClick = (day, hour, isSecondHalf) => {
    //     const slotTime = isSecondHalf ? hour.clone().add(30, "minute") : hour;

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

    //     setSelectedSlots((prev) => [...prev, slot]);
    //     setDaySlots((prev) => ({ ...prev, [day.format("YYYY-MM-DD")]: true }));
    // };
    // const handleAddItem = (day) => {
    //     if (day.isBefore(currentTime, "day")) return;

    //     const slots = [];
    //     for (let i = 0; i < 24; i++) {
    //         const hour = day.clone().hour(i).minute(0);
    //         if (day.isSame(currentTime, "day") && hour.isBefore(currentTime)) {
    //             continue;
    //         }
    //         slots.push({
    //             day: day.format("YYYY-MM-DD"),
    //             time: `${hour.format("h:mm A")} - ${hour.clone().add(30, "minute").format("h:mm A")}`
    //         });
    //         slots.push({
    //             day: day.format("YYYY-MM-DD"),
    //             time: `${hour.clone().add(30, "minute").format("h:mm A")} - ${hour.clone().add(1, "hour").format("h:mm A")}`
    //         });
    //     }

    //     setSelectedSlots((prev) => [...prev, ...slots]);
    //     setDaySlots((prev) => ({ ...prev, [day.format("YYYY-MM-DD")]: true }));
    // };

    // const handleClearItem = (day) => {
    //     if (day.isBefore(currentTime, "day")) return;
    //     setSelectedSlots((prev) => prev.filter(slot => slot.day !== day.format("YYYY-MM-DD")));
    //     setDaySlots((prev) => ({ ...prev, [day.format("YYYY-MM-DD")]: false }));
    // };



    return (
        <>
            <div>
                {
                    state.newMeetNext ? (
                        <>
                            <div className="newmeeting_container">
                                <div className="selection_container">
                                    <div className="heading">
                                        <h2>Selections</h2>
                                        <Button variant="text" className="editbutton"><EditOutlinedIcon />Edit</Button>
                                    </div>
                                    <div className="selection_details"><PeopleAltOutlinedIcon />Hepto</div>
                                    <div className="selection_details"><AccessTimeOutlinedIcon />30 min</div>
                                    <div className="selection_details"><CalendarTodayOutlinedIcon />1 time 0n 1 day <KeyboardArrowDownOutlinedIcon /></div>
                                </div>
                                <div className="event_details_container">
                                    <div className="heading">
                                        <h2>Event Details</h2></div>
                                    <div>
                                        <label>Meeting Name</label>
                                        <TextfieldComponent customStyle='new_meeting_event_textbox' />
                                    </div>
                                    <div>
                                        <label>Location</label>
                                        <SelectEventLocation options={eventOptions} />
                                    </div>
                                    <div>
                                        {!state.showEditor ? (
                                            <a className="newmeet_description" onClick={() => setState(prev => ({ ...prev, showEditor: true }))}>
                                                + Add description/instruction
                                            </a>
                                        ) : (
                                            <div className="new_meet_event_description">

                                                <TextEditor placeholder="Add any information relevant to this event" />

                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="optional_container">
                                    <div className="heading">
                                        <h2>Optionl Settings</h2>

                                    </div>
                                    <div className="optional_content">
                                        <h4>Reserve times</h4>
                                    </div>
                                    <p>Put placeholders on your calendar for all offered times until one of them is booked.</p>
                                    <div className="optional_content">
                                        <h4>Invite language</h4>
                                        <a className="newmeet_description">English</a>
                                    </div>
                                    <p>Sets the language of your booking page and communications.</p>
                                </div>
                                <div className="button_container">
                                    <CustomButton variant="text">Back</CustomButton>
                                    <CustomButton variant="contained">Share meeting link</CustomButton>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="createNewMeeting">
                                <div className="leftContainer">
                                    <div className="content">
                                        <label>
                                            Time zone
                                        </label>
                                        {/* <div
                                            onClick={handleTimeZoneClick} className="timezone"

                                        >
                                            {state.selectedTimeZone}  <ExpandMoreIcon fontSize="small" />
                                        </div>
                                        <TimeZoneMenu anchorEl={state.timeZoneAnchor} open={Boolean(state.timeZoneAnchor)} onClose={() => setState(prev => ({ ...prev, timeZoneAnchor: null }))} onSelect={handleTimeZoneSelect} />
                                  */}
                                        <TimezoneDropdown
                                            options={timezones}
                                            selectedValue={state.timeZoneAnchor}
                                            onSelect={(zone) => setState({ ...state, timeZoneAnchor: zone })}
                                        />
                                    </div>
                                    <div className="content">
                                        <label>Duration</label>
                                        <AutocompleteComponent
                                            options={durationOptions}
                                            value={state.durationContent}
                                            onChange={(event, newValue) => setState(prev => ({ ...prev, durationContent: newValue }))}
                                            customStyles={{ ...style.newticketsAutocomplete, width: '50%' }}
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
                                            {state.currentDate.format("MMMM YYYY")}
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
                                                    {state.daySlots[day.format("YYYY-MM-DD")] ? (
                                                        <a style={{ color: 'blue', fontSize: '12px' }} onClick={() => handleClearItem(day)}  >Clear Item</a>
                                                    ) : (
                                                        <a style={{ color: 'blue', fontSize: '12px' }} onClick={() => handleAddItem(day)}>Add Item</a>
                                                    )}
                                                </div>
                                            )
                                        ))}


                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "100px repeat(7, 1fr)", maxHeight: '400px', overflowY: 'auto' }}>
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
                                                                    border: state.selectedSlots.some(s => s.day === day.format("YYYY-MM-DD") && s.time === `${hour.format("h:mm A")} - ${hour.add(30, "minute").format("h:mm A")}`)
                                                                        ? "1px solid blue" : "none",
                                                                }}
                                                                title={(day.isBefore(currentTime, "day") || (day.isSame(currentTime, "day") && hour.isBefore(currentTime))) ? "Unavailable" : ""}
                                                            >
                                                                {state.selectedSlots.some(s => s.day === day.format("YYYY-MM-DD") && s.time === `${hour.format("h:mm A")} - ${hour.add(30, "minute").format("h:mm A")}`)
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

                                                                    border: state.selectedSlots.some(s => s.day === day.format("YYYY-MM-DD") && s.time === `${hour.add(30, "minute").format("h:mm A")} - ${hour.add(60, "minute").format("h:mm A")}`)
                                                                        ? "1px solid blue" : "none",
                                                                }}
                                                                title={(day.isBefore(currentTime, "day") || (day.isSame(currentTime, "day") && hour.clone().add(30, "minute").isBefore(currentTime))) ? "Unavailable" : ""}
                                                            >
                                                                {state.selectedSlots.some(s => s.day === day.format("YYYY-MM-DD") && s.time === `${hour.add(30, "minute").format("h:mm A")} - ${hour.add(60, "minute").format("h:mm A")}`)
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
                                <CustomButton variant="contained" onClick={handleNextClick} sx={{ marginLeft: '10px' }}>Next</CustomButton>

                            </div>
                        </>
                    )
                }

            </div>
        </>
    )
}
export default CreateNewMeetingComponent;