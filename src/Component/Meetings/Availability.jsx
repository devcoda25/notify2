import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Tabs, Tab, Box, Typography, Button, ToggleButton, ToggleButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewListIcon from "@mui/icons-material/ViewList";
import TimePickerComponent from '../TimePickerComponent'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import AutocompleteComponent from "../AutocompleteComponent";
import TextfieldComponent from "../TextfieldComponent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TimeZoneMenu from "./TimeZoneMenu";
import {
  Menu,
  MenuItem,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import dayjs from "dayjs";
const localizer = momentLocalizer(moment);

const styles = {
  newticketsAutocomplete: {
    height: '32px',
    border: '1px solid #c9c9cd',
    width: '100',
    marginBottom: '15px',
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
    width: "139px",

    "& .MuiFormControl-root": {
      width: "139px",
    },

    "& .MuiTextField-root": {
      width: "139px",
    },

    "& .MuiOutlinedInput-root": {
      width: "139px",

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
  selectdateTitle: {
    color: "black",
  },
  listview_date_apply: {
    boxShadow: "none",
    margin: "0px 0px 0px 12px",
    borderRadius: "20px",
    textTransform: "capitalize",
    width: "145px",
    height: "37px",
  },
  listview_date_cancel: {
    width: "145px",
    marginTop: "0px",
    height: "37px",
    textTransform: "capitalize",
    color: "black",
    borderRadius: "20px",
    border: "1px solid #476788",
  },
  listHolidayText: {
    marginBottom: '30px',
    color: "black",
    fontSize: "16px"
  },
  country_holidays: {
    marginBottom: '10px',
    fontWeight: 'bold',
    color: 'black'
  }
}

const EventTypeMenu = ({ anchorEl, open, onClose, selected, setSelected }) => {
  const handleToggle = () => {
    setSelected((prev) => !prev);
  };

  return (
  
    <Menu anchorEl={anchorEl} open={open} onClose={onClose} >
    <div className="availability_eventtype">
   
       
        <TextField
          variant="outlined"
          placeholder="Search..."
          fullWidth
          size="small"
          className="textfield"
         
        />

        {/* Select / Deselect All */}
        <div  className='select_deselect_container'>
          <span  className='select_deselect'  onClick={() => setSelected(true)}>
            Select all
          </span>
          <span  className='select_deselect' onClick={() => setSelected(false)}>
            Deselect all
          </span>
        </div>

        {/* 30 Minute Meeting Checkbox */}
        <List className="list"
        >
          <ListItem button onClick={handleToggle}>
            <ListItemIcon>
              <Checkbox checked={selected} />
            </ListItemIcon>
            <ListItemText primary="30 Minute Meeting" />
          </ListItem>
        </List>
        <Button variant="outlined" sx={{ ...styles.listview_date_cancel }}>cancel</Button>
        <Button variant="contained" color="primary"  sx={{ ...styles.listview_date_apply }}>Apply</Button>
      
      </div>
    </Menu>
   
  );
};
// const TimeZoneMenu = ({ anchorEl, open, onClose }) => {
//   const timeZones = [
//     { region: "AFRICA", zones: ["Africa/Cairo", "Central Africa Time", "West Africa Time", "Africa/Windhoek"] },
//     { region: "ASIA", zones: ["Jordan Time"] },
//   ];
//   const [searchTerm, setSearchTerm] = useState("");

//   // Filter time zones based on search
//   const filteredZones = timeZones.map((group) => ({
//     region: group.region,
//     zones: group.zones.filter((zone) => zone.toLowerCase().includes(searchTerm.toLowerCase())),
//   }));

//   return (
//     <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
//       <div className="timezone">
      
//         <TextField
//           variant="outlined"
//           placeholder="Search..."
//           fullWidth
//           size="small"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="textfield"
          
//         />

//         {/* Time Zones List */}
//         <List  className='list'>
//           {filteredZones.map((group) =>
//             group.zones.length > 0 ? (
//               <div key={group.region}>
//                 <Typography variant="body2" className='listitem'>
//                   {group.region}
//                 </Typography>
//                 {group.zones.map((zone) => (
//                   <ListItem button key={zone} onClick={onClose}>
//                     <ListItemText primary={zone} secondary="1:42pm" />
//                   </ListItem>
//                 ))}
//               </div>
//             ) : null
//           )}
//         </List>
//       </div>
//     </Menu>
//   );
// };
const CustomToolbar = ({ label, onNavigate }) => {
  return (
    <div className="calendar_custom_toolbar">
      <h2 style={{ margin: 0 }}>{label}<div className="set_weeklyhrs">set your weekly hours </div></h2>
      <div>
        <button onClick={() => onNavigate("PREV")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", marginRight: "10px" }}>
          <FaChevronLeft />
        </button>
        <button onClick={() => onNavigate("NEXT")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

const DatePickerModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{
        sx: { maxWidth: "360px !important" }
      }}
    >
      <DialogTitle sx={{ ...styles.selectdateTitle }}>Select the date(s) you want to assign specific hours</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            value={null} />
        </LocalizationProvider>
        <Button onClick={onClose} variant="outlined" sx={{ ...styles.listview_date_cancel }}>Cancel</Button>
        <Button variant="contained" color="primary" sx={{ ...styles.listview_date_apply }}>Apply</Button>
      </DialogContent>

    </Dialog>
  );
};
const Availability = () => {
  const holidaySettings = ['Australia', 'Brazil', 'Canada', 'France', 'Germany', 'Others'];
  const [tabIndex, setTabIndex] = useState(0);
  const [view, setView] = useState("calendar");
  const [meetingHours, setMeetingHours] = useState({
    Sunday: [{ from: "09:00", to: "17:00", available: true }],
    Monday: [{ from: "09:00", to: "17:00", available: true }],
    Tuesday: [{ from: "09:00", to: "17:00", available: true }],
    Wednesday: [{ from: "09:00", to: "17:00", available: true }],
    Thursday: [{ from: "09:00", to: "17:00", available: true }],
    Friday: [{ from: "09:00", to: "17:00", available: true }],
    Saturday: [{ from: "09:00", to: "17:00", available: true }],
  });
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
  const handleChange = (event, newIndex) => {
    setTabIndex(newIndex);
  }
  const [events, setEvents] = useState([
    {
      title: "9:00am - 5:00pm",
      start: new Date(2025, 2, 2, 9, 0),
      end: new Date(2025, 2, 2, 17, 0),
    },
    {
      title: "6:00pm - 7:00pm",
      start: new Date(2025, 2, 24, 18, 0),
      end: new Date(2025, 2, 24, 19, 0),
    },
    {
      title: "12:00am - 1:00am",
      start: new Date(2025, 2, 25, 0, 0),
      end: new Date(2025, 2, 25, 1, 0),
    },
  ]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //holiday_settings 
  const [holidayOpen, setHolidayOpen] = useState(false);
  const [holidayDropdown, setHolidayDropdown] = useState('Others');
  //new schedule
  const [newScheduleOpen, setNewScheduleOpen] = useState(false);
  const [scheduleName, setScheduleName] = useState("");

  //activeon 
  const [eventAnchor, setEventAnchor] = useState(null);
  const [timeZoneAnchor, setTimeZoneAnchor] = useState(null);
  const [selected, setSelected] = useState(true); 

  const handleEventClick = (event) => {
    setEventAnchor(event.currentTarget);
  };
  const handleTimeZoneClick = (event) => {
    setTimeZoneAnchor(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setEventAnchor(null);
    setTimeZoneAnchor(null);
  };
  return (
    <div className="calendar_availability">
      <DatePickerModal open={open} onClose={handleClose} />
      <Dialog
        open={newScheduleOpen}
        onClose={() => setNewScheduleOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { maxWidth: "360px" }
        }}
      >
        <DialogTitle sx={{ ...styles.selectdateTitle }} >
          New schedule
          <IconButton
            onClick={() => setNewScheduleOpen(false)}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ ...styles.selectdateTitle }}>
            Schedule name
          </Typography>
          <TextfieldComponent placeholder='Working Hours,Exclusive Hours,etc...' customStyle='calendar_new_scedule_textbox' />
          <Button onClick={() => setNewScheduleOpen(false)} variant="outlined" sx={{ ...styles.listview_date_cancel }}>Cancel</Button>
          <Button onClick={() => setNewScheduleOpen(false)} variant="contained" color="primary" sx={{ ...styles.listview_date_apply }}>Apply</Button>
        </DialogContent>

      </Dialog>
      <h1>Availability</h1>
      <Tabs value={tabIndex} onChange={handleChange}>
        <Tab label="Schedules" />
        <Tab label="Holidays" />
      </Tabs>
      <Box >
        {tabIndex === 0 && (
          <>
            <div className="scedule_container">
              <h3>Schedule</h3>
              <div className="scedule_btn_container">
                <Button variant='contained' className="workinghrs_btn"><svg style={{ width: '14px', height: '15px' }} viewBox="0 0 20 20" fill="c" xmlns="http://www.w3.org/2000/svg" role="img"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 0.5C6 -0.0522847 5.55229 -0.5 5 -0.5C4.44772 -0.5 4 -0.0522847 4 0.5V1.5H3C2.20435 1.5 1.44129 1.81607 0.87868 2.37868C0.316071 2.94129 0 3.70435 0 4.5V7.5V16.5C0 17.2957 0.316071 18.0587 0.87868 18.6213C1.44129 19.1839 2.20435 19.5 3 19.5C3.55228 19.5 4 19.0523 4 18.5C4 17.9477 3.55228 17.5 3 17.5C2.73478 17.5 2.48043 17.3946 2.29289 17.2071C2.10536 17.0196 2 16.7652 2 16.5V8.5H18V16.5C18 16.7652 17.8946 17.0196 17.7071 17.2071C17.5196 17.3946 17.2652 17.5 17 17.5C16.4477 17.5 16 17.9477 16 18.5C16 19.0523 16.4477 19.5 17 19.5C17.7957 19.5 18.5587 19.1839 19.1213 18.6213C19.6839 18.0587 20 17.2957 20 16.5V7.5V4.5C20 3.70435 19.6839 2.94129 19.1213 2.37868C18.5587 1.81607 17.7957 1.5 17 1.5H16V0.5C16 -0.0522847 15.5523 -0.5 15 -0.5C14.4477 -0.5 14 -0.0522847 14 0.5V1.5H6V0.5ZM18 6.5V4.5C18 4.23478 17.8946 3.98043 17.7071 3.79289C17.5196 3.60536 17.2652 3.5 17 3.5H15.001L15 3.5L14.999 3.5H5.00099L5 3.5L4.99901 3.5H3C2.73478 3.5 2.48043 3.60536 2.29289 3.79289C2.10536 3.98043 2 4.23478 2 4.5V6.5H18Z" fill="currentColor"></path><path d="M10.3386 10.722L11.4346 13.048C11.4609 13.1047 11.5008 13.154 11.5507 13.1917C11.6005 13.2293 11.6589 13.2542 11.7206 13.264L14.1726 13.638C14.2444 13.651 14.3112 13.6834 14.366 13.7317C14.4207 13.78 14.4611 13.8423 14.483 13.9119C14.5048 13.9816 14.5072 14.0558 14.4898 14.1267C14.4725 14.1976 14.4361 14.2624 14.3846 14.314L12.6086 16.126C12.5637 16.1718 12.5305 16.2276 12.5117 16.2889C12.4929 16.3501 12.4891 16.415 12.5006 16.478L12.9186 19.036C12.9336 19.1069 12.9281 19.1805 12.9029 19.2483C12.8776 19.3162 12.8336 19.3755 12.776 19.4193C12.7184 19.4631 12.6495 19.4896 12.5773 19.4958C12.5052 19.5019 12.4328 19.4874 12.3686 19.454L10.1686 18.254C10.1146 18.2244 10.0541 18.2089 9.99258 18.2089C9.93105 18.2089 9.87052 18.2244 9.81658 18.254L7.61658 19.454C7.55235 19.4874 7.47996 19.5019 7.40782 19.4958C7.33569 19.4896 7.26679 19.4631 7.20915 19.4193C7.15152 19.3755 7.10751 19.3162 7.08227 19.2483C7.05703 19.1805 7.05159 19.1069 7.06658 19.036L7.48458 16.478C7.49896 16.4167 7.49867 16.3529 7.48372 16.2917C7.46878 16.2306 7.43961 16.1738 7.39858 16.126L5.62258 14.314C5.57106 14.2624 5.53466 14.1976 5.51732 14.1267C5.49998 14.0558 5.50235 13.9816 5.52419 13.9119C5.54602 13.8423 5.58648 13.78 5.64119 13.7317C5.69591 13.6834 5.76278 13.651 5.83458 13.638L8.28658 13.264C8.34828 13.2542 8.40662 13.2293 8.45648 13.1917C8.50634 13.154 8.54621 13.1047 8.57258 13.048L9.65858 10.722C9.68779 10.6562 9.73546 10.6003 9.7958 10.5611C9.85615 10.5219 9.92659 10.501 9.99858 10.501C10.0706 10.501 10.141 10.5219 10.2013 10.5611C10.2617 10.6003 10.3094 10.6562 10.3386 10.722Z" fill="currentColor"></path></svg>Working hours</Button>
                <Button variant="text" className="createscedule_btn" onClick={() => setNewScheduleOpen(true)}>+ Create schedule</Button>
              </div>

              <div className="schedulecalendar_container">
                <div className="header_container">
                  <div style={{ display: "flex", gap: "40px", alignItems: "center",padding:'15px' }}>
                    {/* Active On Dropdown */}
                    <div>
                      <Typography variant="body2" style={{ fontWeight: "bold", color: "#333" }}>
                        Active on
                      </Typography>
                      <div
                        onClick={handleEventClick}
                        style={{ color: "#007bff", cursor: "pointer", display: "flex", alignItems: "center" }}
                      >
                        {selected ? "1 Event Type" : "No Event Type"} <ExpandMoreIcon fontSize="small" />
                      </div>
                      <EventTypeMenu
                        anchorEl={eventAnchor}
                        open={Boolean(eventAnchor)}
                        onClose={handleCalendarClose}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </div>

                    {/* Time Zone Dropdown */}
                    <div>
                      <Typography variant="body2" style={{ fontWeight: "bold", color: "#333" }}>
                        Time zone
                      </Typography>
                      <div
                        onClick={handleTimeZoneClick}
                        style={{ color: "#007bff", cursor: "pointer", display: "flex", alignItems: "center" }}
                      >
                        Eastern Time - US & Canada <ExpandMoreIcon fontSize="small" />
                      </div>
                      <TimeZoneMenu anchorEl={timeZoneAnchor} open={Boolean(timeZoneAnchor)} onClose={() => setTimeZoneAnchor(null)} />
                    </div>
                  </div>
                  <ToggleButtonGroup className="scedule_calendar_toggle"
                    value={view}
                    exclusive
                    onChange={(e, newView) => newView && setView(newView)}
                    sx={{ background: "#f4f6f8", borderRadius: "8px", padding: "4px" }}
                  >
                    <ToggleButton value="list" sx={{ textTransform: "none", borderRadius: "8px" }}>
                      <ViewListIcon sx={{ fontSize: 18, marginRight: "4px" }} />
                      List view
                    </ToggleButton>
                    <ToggleButton value="calendar" sx={{ textTransform: "none", borderRadius: "8px" }}>
                      <CalendarMonthIcon sx={{ fontSize: 18, marginRight: "4px" }} />
                      Calendar view
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
                {view === "calendar" ? (
                  <div style={{ padding: "20px" }}>
                    <Calendar
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      views={{ month: true }}
                      defaultView="month"
                      components={{ toolbar: CustomToolbar }}
                      formats={{
                        weekdayFormat: (date, culture, localizer) => localizer.format(date, "ddd", culture).toUpperCase(),
                      }}

                      style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
                    />
                  </div>
                ) : (
                  <>
                    <div className="calendar_list_container">
                      <div className="leftcontainer">
                        <h3>Weekly hours</h3>
                        <div>
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
                      <div className="right_container">
                        <h3>Data Specific Hours</h3>
                        <p>Override your availability for specific dates when your hours differ from your regular weekly hours.</p>
                        <Button className="add_meet_hours" onClick={handleOpen}>+ Add date-specific hours</Button>
                      </div>
                    </div>
                  </>
                )
                }

              </div>
            </div>
          </>
        )}
        {tabIndex === 1 && (
          <div className="holiday_calendar">
            <Dialog
              open={holidayOpen}
              onClose={() => setHolidayOpen(false)}
              maxWidth="xs"
              fullWidth
              PaperProps={{
                sx: { maxWidth: "360px" }
              }}
            >
              <DialogTitle sx={{ ...styles.selectdateTitle }}>
                Holiday settings
                <IconButton
                  onClick={() => setHolidayOpen(false)}
                  sx={{ position: "absolute", right: 10, top: 10 }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent>
                <Typography sx={{ ...styles.listHolidayText }}>
                  This will change the list of holidays used across <b>all of your Event Types.</b>
                </Typography>
                <Typography sx={{ ...styles.country_holidays }}>
                  Country to use for holidays
                </Typography>
                <AutocompleteComponent
                  options={holidaySettings}
                  value={holidayDropdown}
                  onChange={(event, newValue) => setHolidayDropdown(newValue)}
                  customStyles={styles.newticketsAutocomplete}
                />
                <Button onClick={() => setHolidayOpen(false)} variant="outlined" sx={{ ...styles.listview_date_cancel }}>Cancel</Button>
                <Button onClick={() => setHolidayOpen(false)} variant="contained" color="primary" sx={{ ...styles.listview_date_apply }}>Apply</Button>
              </DialogContent>

            </Dialog>
            <h3>Holidays</h3>
            <div>
              <p className="event_text">Calendly automatically removes certain holidays from your availability <b>on all your Event Types</b> based on your country. You can choose which holidays you observe here.</p>
              <div className="holiday_text"><b>Tip:</b> Don’t see a holiday you observe? Add an all-day, busy, or out-of-office event to your connected calendar to prevent Calendly from booking that date.</div>
              <div className="country_used_holiday_container">
                <div className="country_holiday_content">
                  <p>Country used for holidays</p>
                  <div><b>Other</b><span onClick={() => setHolidayOpen(true)}><a>Change</a></span></div>
                </div>
                <div className="country_notsupport">Holidays for other countries are not yet supported.</div>
              </div>
            </div>
          </div>
        )}
      </Box>

    </div>
  );
};

export default Availability;
