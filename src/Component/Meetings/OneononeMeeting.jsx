import React, { useState } from "react";
import { AddIcon, ArrowBackIosIcon, InfoOutlinedIcon } from "../Icon";
import TextfieldComponent from "../TextfieldComponent";
import { Modal, Box, Typography, FormControl, RadioGroup, Radio, FormControlLabel, Button, Select, MenuItem, InputLabel, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { CheckIcon, VideocamOutlinedIcon, LocalPhoneOutlinedIcon, LinkOutlinedIcon, SettingsOutlinedIcon, LocationOnOutlinedIcon, AccessTimeOutlinedIcon } from "../Icon";
import style from "../MuiStyles/muiStyle";
import SelectEventLocation from "./SelectEventLocation";
import ButtonComponent from "../ButtonComponent";
import CustomButton from "./CustomButton";
import CustomDropdown from "./CustomDropdown";

const options = ['15 min', '30 min', '45 min', '60 min', 'Custom'];

const colors = [
    "#FF5722", "#F48FB1", "#E040FB", "#7C4DFF", "#2196F3",
    "#00BCD4", "#4CAF50", "#CDDC39", "#FFEB3B", "#FF9800"
];
const eventOptions = [
    { icon: <VideocamOutlinedIcon />, label: "Zoom" },
    { icon: <LocalPhoneOutlinedIcon />, label: "Phone" },
    { icon: <LocationOnOutlinedIcon />, label: "In-person meeting" },
];
const meetingOptions = [
    { label: 'Phone call', value: 'phone', icon: <LocalPhoneOutlinedIcon /> },
    { label: 'In-person meeting', value: 'inperson', icon: <LocationOnOutlinedIcon /> },
    { label: 'Ask invitee', value: 'ask', icon: <LinkOutlinedIcon /> },
    { label: 'Custom', value: 'custom', icon: <SettingsOutlinedIcon /> },
    { type: 'heading', label: 'WEB CONFERENCING' },
    {
        label: 'Zoom',
        value: 'zoom',
        icon: <img src="/assets/images/zoom.svg" alt="Zoom" width={24} />
    },
    {
        label: 'Google Meet',
        value: 'google',
        icon: <img src="/assets/images/Googlemeet.svg" alt="Google Meet" width={24} />
    },
    {
        label: 'Microsoft Teams',
        value: 'teams',
        icon: <img src="/assets/images/Teams.svg" alt="Teams" width={24} />
    },
    {
        label: 'Webex',
        value: 'webex',
        icon: <img src="/assets/images/webex.svg" alt="Teams" width={24} />
    },
    {
        label: 'GoTo Meeting',
        value: 'gotomeeting',
        icon: <img src="/assets/images/gotomeeting.svg" alt="Teams" width={24} />
    }
];
const EditLocationPopup = ({ open, handleClose }) => {
    const [meetingType, setMeetingType] = useState('');
    const [callOption, setCallOption] = useState('I will call my invitee');
    return (

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
            PaperProps={{
                sx: { ...style.editlocation_modal }
            }} >
            <DialogTitle sx={style.editlocation_heading}>Edit Location</DialogTitle>

            <DialogContent>
                <div className="editlocationmodal_content">
                    <CustomDropdown
                        value={meetingType}
                        onChange={(e) => setMeetingType(e.target.value)}
                        options={meetingOptions}

                        getValueLabel={(val) => {
                            const selectedOption = meetingOptions.find((o) => o.value === val);
                            if (!selectedOption) return 'Select';

                            return (
                                <div className="editlocation_custom_dropdown">
                                    {selectedOption.icon && (
                                        <span>
                                            {selectedOption.icon}
                                        </span>
                                    )}
                                    {selectedOption.label}
                                </div>
                            );
                        }}

                        renderOption={(opt, selectedVal) => {
                            if (opt.type === 'heading') {
                                return (
                                    <div className="editlocation_dropdown_heading" >
                                        {opt.label}
                                    </div>
                                );
                            }

                            return (
                                <>
                                    <ListItemIcon>{opt.icon}</ListItemIcon>
                                    <ListItemText primary={opt.label} />
                                    {selectedVal === opt.value && (
                                        <CheckIcon
                                            fontSize="small"
                                            sx={{ color: '#006bff', marginLeft: 'auto' }}
                                        />
                                    )}
                                </>
                            );
                        }}
                    />

                    <FormControl>

                        <RadioGroup value={callOption}
                            onChange={(e) => setCallOption(e.target.value)}>
                            <FormControlLabel value="I will call my invitee" control={<Radio />} label={
                                <div className="editlocationmodal_radiocontent">
                                    I will call my invitee
                                    <p>
                                        Calendly will require your invitee's phone number before scheduling.
                                    </p>
                                </div>
                            } />
                            <FormControlLabel value="My invitee should call me" control={<Radio />}
                                label={
                                    <div className="editlocationmodal_radiocontent">
                                        My invitee should call me
                                        <p>Calendly will provide your number after the call has been scheduled</p>
                                    </div>
                                }
                            />

                        </RadioGroup>
                    </FormControl>
                    <div className="editlocationModal_button">
                        <CustomButton variant="outlined" sx={{ width: '160px' }} onClick={handleClose}>Cancel</CustomButton>
                        <CustomButton variant="contained" sx={{ margin: 0 }}>Update</CustomButton>
                    </div>
                </div>
            </DialogContent>


        </Dialog>
    )
}
const EditLocationInPerson = ({ open, handleClose }) => {
    const [meetingType, setMeetingType] = useState('');
    const [ShowAdditionalText, setShowAdditionalText] = useState(false);

    return (

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
            PaperProps={{
                sx: { ...style.editlocation_modal }
            }} >
            <DialogTitle sx={style.editlocation_heading}>Edit Location</DialogTitle>

            <DialogContent>
                <div className="editlocationmodal_content">
                    <CustomDropdown
                        value={meetingType}
                        onChange={(e) => setMeetingType(e.target.value)}
                        options={meetingOptions}

                        getValueLabel={(val) => {
                            const selectedOption = meetingOptions.find((o) => o.value === val);
                            if (!selectedOption) return 'Select';

                            return (
                                <div className="editlocation_custom_dropdown">
                                    {selectedOption.icon && (
                                        <span>
                                            {selectedOption.icon}
                                        </span>
                                    )}
                                    {selectedOption.label}
                                </div>
                            );
                        }}

                        renderOption={(opt, selectedVal) => {
                            if (opt.type === 'heading') {
                                return (
                                    <div className="editlocation_dropdown_heading" >
                                        {opt.label}
                                    </div>
                                );
                            }

                            return (
                                <>
                                    <ListItemIcon>{opt.icon}</ListItemIcon>
                                    <ListItemText primary={opt.label} />
                                    {selectedVal === opt.value && (
                                        <CheckIcon
                                            fontSize="small"
                                            sx={{ color: '#006bff', marginLeft: 'auto' }}
                                        />
                                    )}
                                </>
                            );
                        }}
                    />
                    <TextfieldComponent type='text' customStyle='custom_textfield_box' />
                    <>
                        {
                            ShowAdditionalText ? (
                                <textarea className="editlocationmodal_textarea" ></textarea>
                            ) : (
                                <a className='link' onClick={() => setShowAdditionalText(true)}><AddIcon />Include additional information</a>
                            )
                        }
                    </>
                    <div className="editlocationModal_button">
                        <CustomButton variant="outlined" sx={{ width: '160px' }} onClick={handleClose}>Cancel</CustomButton>
                        <CustomButton variant="contained" sx={{ margin: 0 }}>Update</CustomButton>
                    </div>
                </div>
            </DialogContent>


        </Dialog>
    )
}
const OneononeMeeting = () => {
    const [eventName, setEventName] = useState("");
    const [selectedColor, setSelectedColor] = useState(colors[3]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [duration, setDuration] = useState('30 min');
    const [selectedOption, setSelectedOption] = useState(null);
    const [openLocationModal, setOpenLocationModal] = useState(false);
    const [openInpersonModal, setOpenInpersonModal] = useState(false);

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        if (option === "Phone") {
            setOpenLocationModal(true);
        } else if (option === 'In-person meeting') {
            setOpenInpersonModal(true);
        }
    };

    return (
        <div className="oneonone_container">
            {selectedOption === "Phone" && (
                <EditLocationPopup open={openLocationModal} handleClose={() => setOpenLocationModal(false)} />
            )}
            {
                selectedOption === 'In-person meeting' && (
                    <EditLocationInPerson open={openInpersonModal} handleClose={() => setOpenInpersonModal(false)} />
                )
            }
            <div className="left_container">
                <div className="left_content">
                    <div className="header">
                        <div>
                            <ArrowBackIosIcon />
                            <a>Cancel</a>
                        </div>
                        <h1>New Event Type</h1>
                    </div>
                    <div className="main_container">
                        <div className="main_content">
                            <div className="event_details">
                                <div>
                                    <div className="label_container">
                                        <label>Event name<span>*</span></label>
                                        <InfoOutlinedIcon sx={{ width: '15px' }} />
                                    </div>
                                    <div className="event_color_container">
                                        <div className="input_wrapper">
                                            <div className="selected_color_container" onClick={() => setShowDropdown(!showDropdown)}>
                                                <div
                                                    className="color_button"
                                                    style={{ backgroundColor: selectedColor }} />

                                            </div>
                                            <TextfieldComponent type='text' placeholder='Name your event' customStyle='custom_textfield_box color_input_field'
                                                value={eventName}
                                                onChange={(e) => setEventName(e.target.value)} />

                                        </div>

                                        {showDropdown && (
                                            <div className="event_color_dropdown">
                                                <h6>Event color <span>*</span></h6>
                                                <div className="color_grid">
                                                    {colors.map((color, index) => (
                                                        <div
                                                            key={index}
                                                            className={`color_option ${selectedColor === color ? "selected" : ""
                                                                }`}
                                                            style={{ backgroundColor: color }}
                                                            onClick={() => {
                                                                setSelectedColor(color);
                                                                setShowDropdown(false);
                                                            }}

                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="label_container">
                                        <label>Duration<span>*</span></label>
                                        <InfoOutlinedIcon sx={{ width: '15px' }} />
                                    </div>
                                    {/* <Select
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        displayEmpty
                                        fullWidth
                                        sx={style.oneonone_select_container}
                                        renderValue={(selected) => selected || 'Select Duration'}
                                    >
                                        {options.map((opt) => (
                                            <MenuItem
                                                key={opt}
                                                value={opt}
                                                sx={style.oneone_select_menu}
                                            >
                                                <ListItemText primary={opt} />
                                                {duration === opt && (
                                                    <CheckIcon fontSize="small" sx={{ color: '#006bff' }} />
                                                )}
                                            </MenuItem>
                                        ))}
                                    </Select> */}
                                    <div className="duration_dropdown">
                                        <CustomDropdown
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            options={options}

                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="label_container">
                                        <label>Location<span>*</span></label>
                                        <InfoOutlinedIcon sx={{ width: '15px' }} />
                                    </div>
                                    <div>
                                        {
                                            selectedOption === 'Zoom' ? (
                                                <div className="selectedeventlocation_container">
                                               <div className="left_content">

                                               </div>
                                                </div>
                                            ) : (

                                                <SelectEventLocation options={eventOptions} onSelect={handleSelectOption} />
                                            )
                                        }
                                    </div>

                                </div>

                            </div>
                            <div className="button_footer">
                                <CustomButton variant="text" sx={{ maginLeft: 'auto' }}>Cancel</CustomButton>
                                <CustomButton variant="contained" sx={{ margin: '0px', width: '100px' }}>Continue</CustomButton>
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
                            <div className="sub_content">
                                <span>A preview of your availability will show on the next step</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default OneononeMeeting;