
import React, { useState } from "react";
import { Button, Popover, Tabs, Tab, Checkbox, FormControlLabel } from "@mui/material";
import TextfieldComponent from "../TextfieldComponent";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import {
    ArrowDropDownIcon,
    FilterListOutlinedIcon,
    AutorenewOutlinedIcon,
    OutlinedFlagOutlinedIcon,
    KeyboardArrowDownIcon,
    SystemUpdateAltIcon,
    FilterListIcon
} from "../Icon";
import CustomButton from "./CustomButton";


const styles = {
    buttonStyle: {
        width: "80%",
        textAlign: "left",
        justifyContent: "space-between",
        display: "flex",
        fontSize: "16px",
        padding: "10px",
        borderRadius: "5px",
        textTransform: 'capitalize',
        color: 'black',
        fontSize: '13px',
        background: 'white'
    },
    dropdownText: {
        flex: 1,
        textAlign: 'left'
    },
    buttonArrow: {
        marginLeft: 'auto'
    },

}
const Meeting = () => {

    const [state, setState] = useState({
        anchorEl: null,
        tabValue: 0,
        startDate: dayjs(),
        endDate: dayjs(),
        showFilter: false,
        teamsAnchorEl: null,
        hostAnchorEl: null,
        eventTypeAnchorE1: null,
        activeEventsAnchorE1: null,
        allInviteeEventsAnchorE1: null,
        allIdAnchorE1: null,
        showDetails: false,
        isHovered: false
    });
    const open = Boolean(state.anchorEl);
    const updateState = (newState) => {
        setState((prevState) => ({ ...prevState, ...newState }));
    };

    const handleClick = (event) => updateState({ anchorEl: event.currentTarget });
    const handleTabChange = (event, newValue) => updateState({ tabValue: newValue });
    const handleClose = () => updateState({ anchorEl: null });
    const handleTeamsClick = (event) => updateState({ teamsAnchorEl: event.currentTarget });
    const handleHostClick = (event) => updateState({ hostAnchorEl: event.currentTarget });
    const handleEventTypeClick = (event) => updateState({ eventTypeAnchorE1: event.currentTarget });
    const handleActiveEventClick = (event) => updateState({ activeEventsAnchorE1: event.currentTarget });
    const handleAllInviteeEvents = (event) => updateState({ allInviteeEventsAnchorE1: event.currentTarget });
    const handleAllIdClick = (event) => updateState({ allIdAnchorE1: event.currentTarget });

    const handleClosePopup = () => updateState({
        teamsAnchorEl: null,
        hostAnchorEl: null,
        eventTypeAnchorE1: null,
        activeEventsAnchorE1: null,
        allInviteeEventsAnchorE1: null,
        allIdAnchorE1: null
    });

    const toggleDetails = () => updateState({ showDetails: !state.showDetails });


    // const [anchorEl, setAnchorEl] = useState(null);
    // const [tabValue, setTabValue] = useState(0);
    // const [startDate, setStartDate] = useState(dayjs());
    // const [endDate, setEndDate] = useState(dayjs());
    // const [showFilter, setShowFilter] = useState(false);
    // const [teamsAnchorEl, setTeamsAnchorEl] = useState(null);
    // const [hostAnchorEl, setHostAnchorEl] = useState(null);
    // const [eventTypeAnchorE1, setEventTypeAnchorE1] = useState(null);
    // const [activeEventsAnchorE1, setActiveEventAnchorE1] = useState(null);
    // const [allInviteeEventsAnchorE1, setAllInviteeEventsAnchorE1] = useState(null);
    // const [allIdAnchorE1, setAllIdAnchorE1] = useState(null);
    // const [showDetails, setShowDetails] = useState(false);
    // const [isHovered, setIsHovered] = useState(false);

    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // const handleTabChange = (event, newValue) => {
    //     setTabValue(newValue);

    // };

    // //popup
    // const handleClose = () => {
    //     setAnchorEl(null);
    // };




    // const handleTeamsClick = (event) => {
    //     setTeamsAnchorEl(event.currentTarget);
    // };

    // const handleHostClick = (event) => {
    //     setHostAnchorEl(event.currentTarget);
    // };
    // const handleEventTypeClick = (event) => {
    //     setEventTypeAnchorE1(event.currentTarget)
    // }
    // const handleActiveEventClick = (event) => {
    //     setActiveEventAnchorE1(event.currentTarget);
    // }
    // const handleAllInviteeEvents = (event) => {
    //     setAllInviteeEventsAnchorE1(event.currentTarget);
    // }
    // const handleAllIdClick = (event) => {
    //     setAllIdAnchorE1(event.currentTarget);
    // }
    // const handleClosePopup = () => {
    //     setTeamsAnchorEl(null);
    //     setHostAnchorEl(null);
    //     setEventTypeAnchorE1(null);
    //     setActiveEventAnchorE1(null);
    //     setAllInviteeEventsAnchorE1(null);
    //     setAllIdAnchorE1(null)
    // };

    // const toggleDetails = () => {
    //     setShowDetails(!showDetails);
    // };


    return (
        <>
            <div className="calendar_meet">
                <h1>Meetings</h1>
                <div >
                    <div className="meetings_dropdown_container">
                        <Button
                            variant="outlined"

                            onClick={handleClick}
                            style={styles.buttonStyle}
                        >
                            <span style={styles.dropdownText}>My Calendly</span>
                            <ArrowDropDownIcon style={styles.buttonArrow} />
                        </Button>
                        <span> Displaying 0 – 0 of 0 Events</span>
                    </div>
                    <Popover

                        open={open}
                        anchorEl={state.anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        className="meetings_dropdown"
                    >
                        <div className="popup_container">
                            <TextfieldComponent placeholder='Filter' customStyle="meetings_textfield" />
                            <div className='popup_text'>
                                Work together with a Calendly organization.
                            </div>
                            <div className='popup_text'>
                                When you add users to your Calendly organization, you can create
                                Team Pages, Team Event Types, and much more.
                            </div>
                            <div className="popup_link" >
                                Visit your Users page to learn more
                            </div>
                            <div className="popup_link"  >
                                Add seats
                            </div>
                        </div>
                    </Popover>
                </div>
                <div className="meeting_table">
                    <div className="tabs_container">
                        <Tabs value={state.tabValue} onChange={handleTabChange}>

                            <Tab label='upcoming' />
                            <Tab label='Pending' />
                            <Tab label='Past' />
                            <Tab label='Data Range' icon={<KeyboardArrowDownIcon />} iconPosition="end" onMouseEnter={() => updateState({ isHovered: true })}
                                onMouseLeave={() => updateState({ isHovered: false })} />
                            <Tab />
                        </Tabs>
                        <div className="buttons">
                            <Button variant="outlined" size="small" className="exportbtn"><SystemUpdateAltIcon />Export</Button>
                            <Button
                                variant="outlined"
                                size="small"
                                className="filterbtn"
                                onClick={() => updateState({ showFilter: !state.showFilter })}
                                endIcon={<KeyboardArrowDownIcon />}
                                startIcon={<FilterListIcon />}
                            >
                                Filter
                            </Button>

                        </div>
                    </div>
                    {state.showFilter && (
                        <>
                            <div className="filter_section">

                                <div>Teams<div className="filter_sec_content" onClick={handleTeamsClick}> All Teams <KeyboardArrowDownIcon /></div></div>
                                <div>Host <div className="filter_sec_content" onClick={handleHostClick}>Host<KeyboardArrowDownIcon /></div></div>
                                <div>Event Types <div className="filter_sec_content" onClick={handleEventTypeClick}>All Event Types<KeyboardArrowDownIcon /></div></div>
                                <div>Status<div className="filter_sec_content" onClick={handleActiveEventClick}>Active Events<KeyboardArrowDownIcon /></div></div>
                                <div>Tracking ID<div className="filter_sec_content" onClick={handleAllIdClick}>All ID's<KeyboardArrowDownIcon /></div></div>
                                <div>Invitee Emails<div className="filter_sec_content" onClick={handleAllInviteeEvents}>All Invite Email<KeyboardArrowDownIcon /></div></div>
                                <div className="clear_btn">
                                    <Button size="small" color="primary">Clear all filters</Button>
                                </div>

                            </div>
                            {/* All Teams */}
                            <Popover
                                open={Boolean(state.teamsAnchorEl)}
                                anchorEl={state.teamsAnchorEl}
                                onClose={handleClosePopup}
                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}

                            >
                                <div className="calendar_allteamcontainer">
                                    <TextfieldComponent placeholder='Filter' customStyle="meetings_textfield" />
                                    <div className="selectlink">select all / clear</div>
                                    <div className="team_count">
                                        <div >Teams</div>
                                        <div >No items found</div>
                                    </div>
                                    <div className="button_container">
                                        <Button variant="outlined" size="small" onClick={handleClose} className="cancel_btn">Cancel</Button>
                                        <CustomButton variant="contained">Apply</CustomButton>
                                        
                                    </div>
                                </div>
                            </Popover>
                            {/* Host */}
                            <Popover
                                open={Boolean(state.hostAnchorEl)}
                                anchorEl={state.hostAnchorEl}
                                onClose={handleClosePopup}
                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}

                            >
                                <div className="calendar_allteamcontainer">
                                    <div className="team_count">
                                        <div >Host</div>
                                        <FormControlLabel control={<Checkbox defaultChecked />} label="Host" />
                                        <FormControlLabel control={<Checkbox />} label="Non-host" />
                                    </div>
                                    <div className="button_container">
                                        <Button variant="outlined" size="small" onClick={handleClose} className="cancel_btn">Cancel</Button>
                                        <CustomButton variant="contained">Apply</CustomButton>
                                      
                                    </div>
                                </div>
                            </Popover>
                            {/* All Event Type */}
                            <Popover
                                open={Boolean(state.eventTypeAnchorE1)}
                                anchorEl={state.eventTypeAnchorE1}
                                onClose={handleClosePopup}
                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}

                            >
                                <div className="calendar_allteamcontainer">
                                    <TextfieldComponent placeholder='Filter' customStyle="meetings_textfield" />
                                    <div className="selectlink">select all / clear</div>
                                    <div className="team_count">
                                        <div >HEPTO</div>
                                        <FormControlLabel control={<Checkbox />} label="30 Minute Meeting" />
                                    </div>
                                    <div className="button_container">
                                        <Button variant="outlined" size="small" onClick={handleClose} className="cancel_btn">Cancel</Button>
                                        <CustomButton variant="contained">Apply</CustomButton>
                                    </div>
                                </div>
                            </Popover>
                            {/* Active Event */}
                            <Popover
                                open={Boolean(state.activeEventsAnchorE1)}
                                anchorEl={state.activeEventsAnchorE1}
                                onClose={handleClosePopup}
                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}

                            >
                                <div className="calendar_allteamcontainer">
                                    <div className="team_count">
                                        <div >Status</div>
                                        <FormControlLabel control={<Checkbox defaultChecked />} label="Active events" />
                                        <FormControlLabel control={<Checkbox />} label="Canceled events" />
                                    </div>
                                    <div className="button_container">
                                        <Button variant="outlined" size="small" onClick={handleClose} className="cancel_btn">Cancel</Button>
                                        <CustomButton variant="contained">Apply</CustomButton>
                                    </div>
                                </div>
                            </Popover>
                            {/* All id */}
                            <Popover
                                open={Boolean(state.allIdAnchorE1)}
                                anchorEl={state.allIdAnchorE1}
                                onClose={handleClosePopup}
                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}

                            >
                                <div className="calendar_allteamcontainer" style={{ height: '332px' }}>
                                    <TextfieldComponent placeholder='Filter' customStyle="meetings_textfield" />
                                    <div className="selectlink">select all / clear</div>
                                    <div className="team_count">
                                        <div >UTM_SOURCE</div>
                                        <div >No items found</div>
                                        <div >UTM_MEDIUM</div>
                                        <div >No items found</div>
                                        <div >UTM_CONTENT</div>
                                        <div >No items found</div>
                                        <div >UTM_TERM</div>
                                        <div >No items found</div>
                                    </div>
                                    <div className="button_container">
                                        <Button variant="outlined" size="small" onClick={handleClose} className="cancel_btn">Cancel</Button>
                                        <CustomButton variant="contained">Apply</CustomButton>
                                    </div>
                                </div>
                            </Popover>
                            {/* All Invitee Emails */}
                            <Popover
                                open={Boolean(state.allInviteeEventsAnchorE1)}
                                anchorEl={state.allInviteeEventsAnchorE1}
                                onClose={handleClosePopup}
                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}

                            >
                                <div className="calendar_allteamcontainer">
                                    <TextfieldComponent placeholder='Filter' customStyle="meetings_textfield" />
                                    <div className="selectlink">select all / clear</div>
                                    <div className="team_count">
                                        <div >INVITEE EMAILS</div>
                                        <div >No items found</div>
                                    </div>
                                    <div className="button_container">
                                        <Button variant="outlined" size="small" onClick={handleClose} className="cancel_btn">Cancel</Button>
                                        <CustomButton variant="contained">Apply</CustomButton>
                                    </div>
                                </div>
                            </Popover>
                        </>
                    )}
                    <div className="content">
                        {state.tabValue === 0 && (
                            <div className="upcoming_tab_event">

                                <h2 className="event_date">Saturday, 15 March 2025</h2>
                                <div className="event_box">
                                    <div className="event_details">
                                        <div className="event_info">
                                            <span className="event_dot"></span>
                                            <p className="event_time">12:00pm - 12:30pm</p>
                                            <div>

                                                <p className="event_host">Hepto</p>
                                                <p className="event_type">Event type <b>30 Minute Meeting</b></p>
                                            </div>
                                        </div>
                                        <div className="event_participants">1 host | 0 non-hosts</div>
                                        <button className="event_details_btn" onClick={toggleDetails}>▶ Details</button>

                                    </div>
                                    {
                                        state.showDetails && (
                                            <div className="meet_upcoming_event_grid_container">
                                                <div className="left_container">
                                                    <div className="event_control">
                                                        <button className="reschedule_btn">Reschedule</button>
                                                        <button className="cancel_btn">Cancel</button>
                                                    </div>
                                                    <div className="event_control">
                                                        <a>Edit Event Type</a>
                                                        <a><FilterListOutlinedIcon />Filter by Event Type</a>
                                                        <a><AutorenewOutlinedIcon />Schedule invite again</a>
                                                        <a><OutlinedFlagOutlinedIcon />Report this event</a>
                                                    </div>
                                                </div>
                                                <div className="right_container">
                                                    <div className="right_content">
                                                        <label>Email</label>
                                                        <div>hepto@gmail.com</div>
                                                    </div>
                                                    <div className="right_content">
                                                        <label>Location</label>
                                                        <div>This is Google Meet web conference. <a>Join now</a></div>
                                                    </div>
                                                    <div className="right_content">
                                                        <label>Invitee Time Zone</label>
                                                        <div>India Standard Time</div>
                                                    </div>
                                                    <div className="right_content">
                                                        <label>Meeting Host</label>
                                                        <div>Host will attend this meeting</div>
                                                        <div className="logo">
                                                            H
                                                        </div>
                                                    </div>
                                                    <div className="meeting_note">
                                                        <a>Add meeting notes</a>
                                                        <p>only the host will see these</p>
                                                        <p>created  17 March 2025 by hepto</p>
                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                <p className="event_end_text">You've reached the end of the list</p>


                                {/* <img src="assets/images/no_events.svg" />
                                <h2>No Events Yet</h2>
                                <p>Share Event Type links to schedule events.</p>
                                <Button variant="contained" color="primary" className="view_event_button" >View Event Types</Button> */}
                            </div>
                        )}
                        {state.tabValue === 1 && (
                            <div className="tab_content">
                                <img src="assets/images/no_events.svg" />
                                <h2>No Pending Events</h2>
                            </div>
                        )}
                        {state.tabValue === 2 && (
                            <div className="tab_content">
                                <img src="assets/images/no_events.svg" />
                                <h2>No Past Events</h2>
                            </div>
                        )}
                        {state.isHovered && (


                            <div className="calendar_popup">
                                <div className="days">
                                    <span>Today</span>
                                    <span>This week</span>
                                    <span>This month</span>
                                    <span>All time</span>
                                </div>
                                <div style={{ display: "flex", gap: "20px" }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        {/* Start Date Calendar */}
                                        <div>
                                            <DateCalendar
                                                value={state.startDate}
                                                onChange={(newDate) => updateState({ startDate: newDate })}
                                            />

                                        </div>

                                        {/* End Date Calendar */}
                                        <div>

                                            <DateCalendar
                                                value={state.endDate}
                                                onChange={(newDate) => updateState({ endDate: newDate })}
                                            />
                                        </div>
                                    </LocalizationProvider>
                                </div>
                                <div className="datarange_button">
                                    <CustomButton variant="text">Canel</CustomButton>
                                    <CustomButton variant="contained" sx={{marginLeft:'10px'}}>Apply</CustomButton>
                                </div>
                            </div>

                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
export default Meeting;