
import React, { useState } from "react";
import { Button, Popover } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TextfieldComponent from "../TextfieldComponent";
import { Tabs, Tab, Menu, MenuItem, Typography, Checkbox, FormControlLabel } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

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
    const [anchorEl, setAnchorEl] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [showFilter, setShowFilter] = useState(false);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);

    };

    //popup
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const [teamsAnchorEl, setTeamsAnchorEl] = useState(null);
    const [hostAnchorEl, setHostAnchorEl] = useState(null);
    const [eventTypeAnchorE1, setEventTypeAnchorE1] = useState(null);
    const [activeEventsAnchorE1, setActiveEventAnchorE1] = useState(null);
    const [allInviteeEventsAnchorE1, setAllInviteeEventsAnchorE1] = useState(null);
    const [allIdAnchorE1, setAllIdAnchorE1] = useState(null);
    const handleTeamsClick = (event) => {
        setTeamsAnchorEl(event.currentTarget);
    };

    const handleHostClick = (event) => {
        setHostAnchorEl(event.currentTarget);
    };
    const handleEventTypeClick = (event) => {
        setEventTypeAnchorE1(event.currentTarget)
    }
    const handleActiveEventClick = (event) => {
        setActiveEventAnchorE1(event.currentTarget);
    }
    const handleAllInviteeEvents = (event) => {
        setAllInviteeEventsAnchorE1(event.currentTarget);
    }
    const handleAllIdClick = (event) => {
        setAllIdAnchorE1(event.currentTarget);
    }
    const handleClosePopup = () => {
        setTeamsAnchorEl(null);
        setHostAnchorEl(null);
        setEventTypeAnchorE1(null);
        setActiveEventAnchorE1(null);
        setAllInviteeEventsAnchorE1(null);
        setAllIdAnchorE1(null)
    };

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
                        anchorEl={anchorEl}
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
                        <Tabs value={tabValue} onChange={handleTabChange}>

                            <Tab label='upcoming' />
                            <Tab label='Pending' />
                            <Tab label='Past' />
                            <Tab label='Data Range' icon={<KeyboardArrowDownIcon />} iconPosition="end" />
                            <Tab />
                        </Tabs>
                        <div className="buttons">
                            <Button variant="outlined" size="small" className="exportbtn"><SystemUpdateAltIcon />Export</Button>
                            <Button
                                variant="outlined"
                                size="small"
                                className="filterbtn"
                                onClick={() => setShowFilter(!showFilter)}
                                endIcon={<KeyboardArrowDownIcon />}
                                startIcon={<FilterListIcon />}
                            >
                                Filter
                            </Button>

                        </div>
                    </div>
                    {showFilter && (
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
                                open={Boolean(teamsAnchorEl)}
                                anchorEl={teamsAnchorEl}
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
                                        <Button variant="contained" size="small" color="primary" className="apply_btn">Apply</Button>
                                    </div>
                                </div>
                            </Popover>
                            {/* Host */}
                            <Popover
                                open={Boolean(hostAnchorEl)}
                                anchorEl={hostAnchorEl}
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
                                        <Button variant="contained" size="small" color="primary" className="apply_btn">Apply</Button>
                                    </div>
                                </div>
                            </Popover>
                            {/* All Event Type */}
                            <Popover
                                open={Boolean(eventTypeAnchorE1)}
                                anchorEl={eventTypeAnchorE1}
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
                                        <Button variant="contained" size="small" color="primary" className="apply_btn">Apply</Button>
                                    </div>
                                </div>
                            </Popover>
                            {/* Active Event */}
                            <Popover
                                open={Boolean(activeEventsAnchorE1)}
                                anchorEl={activeEventsAnchorE1}
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
                                        <Button variant="contained" size="small" color="primary" className="apply_btn">Apply</Button>
                                    </div>
                                </div>
                            </Popover>
                            {/* All id */}
                            <Popover
                                open={Boolean(allIdAnchorE1)}
                                anchorEl={allIdAnchorE1}
                                onClose={handleClosePopup}
                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}

                            >
                                <div className="calendar_allteamcontainer" style={{height:'332px'}}>
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
                                        <Button variant="contained" size="small" color="primary" className="apply_btn">Apply</Button>
                                    </div>
                                </div>
                            </Popover>
                            {/* All Invitee Emails */}
                            <Popover
                                open={Boolean(allInviteeEventsAnchorE1)}
                                anchorEl={allInviteeEventsAnchorE1}
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
                                        <Button variant="contained" size="small" color="primary" className="apply_btn">Apply</Button>
                                    </div>
                                </div>
                            </Popover>
                        </>
                    )}
                    <div className="content">
                        {tabValue === 0 && (
                            <div className="tab_content">
                                <img src="assets/images/no_events.svg" />
                                <h2>No Events Yet</h2>
                                <p>Share Event Type links to schedule events.</p>
                                <Button variant="contained" color="primary" className="view_event_button" >View Event Types</Button>
                            </div>
                        )}
                        {tabValue === 1 && (
                            <div className="tab_content">
                                <img src="assets/images/no_events.svg" />
                                <h2>No Pending Events</h2>
                            </div>
                        )}
                        {tabValue === 2 && (
                            <div className="tab_content">
                                <img src="assets/images/no_events.svg" />
                                <h2>No Past Events</h2>
                            </div>
                        )}
                        {tabValue === 3 && (


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
                                                value={startDate}
                                                onChange={(newDate) => setStartDate(newDate)}
                                            />

                                        </div>

                                        {/* End Date Calendar */}
                                        <div>

                                            <DateCalendar
                                                value={endDate}
                                                onChange={(newDate) => setEndDate(newDate)}
                                            />
                                        </div>
                                    </LocalizationProvider>
                                </div>
                                <div className="datarange_button">
                                    <Button variant="text">Canel</Button>
                                    <Button variant="contained" className="apply_btn">Apply</Button>
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