import React, { useState, useEffect } from "react";
import { AddIcon, ArrowBackIosIcon, CloseIcon, InfoOutlinedIcon, KeyboardArrowDownOutlinedIcon } from "../Icon";
import TextfieldComponent from "../TextfieldComponent";
import { Modal, Box, Typography, FormControl, RadioGroup, Radio, FormControlLabel, Button, Select, MenuItem, InputLabel, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { CheckIcon, VideocamOutlinedIcon, LocalPhoneOutlinedIcon, LinkOutlinedIcon, SettingsOutlinedIcon, LocationOnOutlinedIcon, AccessTimeOutlinedIcon } from "../Icon";
import style from "../MuiStyles/muiStyle";
import SelectEventLocation from "./SelectEventLocation";
import ButtonComponent from "../ButtonComponent";
import CustomButton from "./CustomButton";
import CustomDropdown from "./CustomDropdown";
import { Link } from "react-router-dom";


const options = ['15 min', '30 min', '45 min', '60 min', 'Custom'];

const colors = [
    "#FF5722", "#F48FB1", "#E040FB", "#7C4DFF", "#2196F3",
    "#00BCD4", "#4CAF50", "#CDDC39", "#FFEB3B", "#FF9800"
];

const meetingOptions = [
    { label: 'Phone call', value: 'phone', icon: <LocalPhoneOutlinedIcon /> },
    { label: 'In-person meeting', value: 'inperson', icon: <LocationOnOutlinedIcon /> },
    { label: 'Ask invitee', value: 'ask', icon: (<svg className='event_customsvg' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 2.5C15 1.94772 15.4477 1.5 16 1.5H17C17.7957 1.5 18.5587 1.81607 19.1213 2.37868C19.6839 2.94129 20 3.70435 20 4.5V12.9999C20 13.7956 19.6839 14.5586 19.1213 15.1212C18.5587 15.6838 17.7957 15.9999 17 15.9999H10.3508L5.62469 19.7808C5.32452 20.0209 4.91328 20.0677 4.56681 19.9012C4.22035 19.7347 4 19.3843 4 18.9999V15.9999H3C2.20435 15.9999 1.44129 15.6838 0.87868 15.1212C0.316071 14.5586 0 13.7956 0 12.9999V4.5C0 3.70435 0.316071 2.94129 0.87868 2.37868C1.44129 1.81607 2.20435 1.5 3 1.5H4C4.55228 1.5 5 1.94772 5 2.5C5 3.05228 4.55228 3.5 4 3.5H3C2.73478 3.5 2.48043 3.60536 2.29289 3.79289C2.10536 3.98043 2 4.23478 2 4.5V12.9999C2 13.2651 2.10536 13.5195 2.29289 13.707C2.48043 13.8946 2.73478 13.9999 3 13.9999H5C5.55229 13.9999 6 14.4476 6 14.9999V16.9193L9.37531 14.219C9.55262 14.0772 9.77293 13.9999 10 13.9999H17C17.2652 13.9999 17.5196 13.8946 17.7071 13.707C17.8946 13.5195 18 13.2651 18 12.9999V4.5C18 4.23479 17.8946 3.98043 17.7071 3.79289C17.5196 3.60536 17.2652 3.5 17 3.5H16C15.4477 3.5 15 3.05228 15 2.5Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.0417 2C9.36757 2 8.72109 2.26778 8.24444 2.74444C7.76778 3.22109 7.5 3.86758 7.5 4.54167C7.5 5.09514 7.67014 5.76866 7.9774 6.5112C8.28053 7.24377 8.69222 7.98462 9.11632 8.65611C9.43974 9.1682 9.76417 9.63019 10.0417 10.0056C10.3192 9.63019 10.6436 9.1682 10.967 8.65611C11.3911 7.98462 11.8028 7.24377 12.1059 6.5112C12.4132 5.76866 12.5833 5.09514 12.5833 4.54167C12.5833 3.86758 12.3156 3.22109 11.8389 2.74444C11.3622 2.26778 10.7158 2 10.0417 2ZM10.0417 11.625C9.28241 12.2758 9.28228 12.2756 9.28214 12.2755L9.28086 12.274L9.27803 12.2707L9.26858 12.2595L9.23513 12.2198C9.20659 12.1857 9.1658 12.1366 9.11452 12.0737C9.01202 11.948 8.8673 11.7671 8.6944 11.5413C8.34943 11.091 7.88824 10.457 7.42534 9.7241C6.96403 8.99368 6.4903 8.14816 6.12937 7.27591C5.77257 6.41364 5.5 5.46389 5.5 4.54167C5.5 3.33714 5.9785 2.18195 6.83022 1.33022C7.68195 0.478496 8.83714 0 10.0417 0C11.2462 0 12.4014 0.478496 13.2531 1.33022C14.1048 2.18195 14.5833 3.33714 14.5833 4.54167C14.5833 5.46389 14.3108 6.41364 13.954 7.27591C13.593 8.14816 13.1193 8.99368 12.658 9.7241C12.1951 10.457 11.7339 11.091 11.3889 11.5413C11.216 11.7671 11.0713 11.948 10.9688 12.0737C10.9175 12.1366 10.8767 12.1857 10.8482 12.2198L10.8148 12.2595L10.8053 12.2707L10.8025 12.274L10.8015 12.2751C10.8014 12.2752 10.8009 12.2758 10.0417 11.625ZM10.0417 11.625L10.8015 12.2751C10.6116 12.4967 10.3336 12.625 10.0417 12.625C9.74974 12.625 9.47213 12.4971 9.28214 12.2755L10.0417 11.625Z" fill="currentColor"></path><path d="M8.86133 4.54188C8.86133 4.85499 8.98571 5.15527 9.20711 5.37666C9.4285 5.59806 9.72878 5.72244 10.0419 5.72244C10.355 5.72244 10.6553 5.59806 10.8767 5.37666C11.0981 5.15527 11.2224 4.85499 11.2224 4.54188C11.2224 4.22878 11.0981 3.9285 10.8767 3.7071C10.6553 3.48571 10.355 3.36133 10.0419 3.36133C9.72878 3.36133 9.4285 3.48571 9.20711 3.7071C8.98571 3.9285 8.86133 4.22878 8.86133 4.54188Z" fill="currentColor"></path></svg>) },
    { label: 'Custom', value: 'custom', icon: (<svg className='event_customsvg' viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M5.5 3.25H9a.5.5 0 0 1 .5.5v2.5a.5.5 0 0 1-.5.5H5.5M1.5 6.75H1a.5.5 0 0 1-.5-.5v-2.5a.5.5 0 0 1 .5-.5h.5M2.5 1.25h2M2.5 8.75h2M3.5 1.25v7.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>) },
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

const eventLocations = {
    zoom: {
        icon: '/assets/images/zoom.svg',
        label: 'Zoom',
        description: 'Zoom is not connected. Visit the <a style="color: #004eba">Zoom integration page</a> to connect your account.'
    },

    teams: {
        icon: '/assets/images/teams.svg',
        label: 'Teams',
        description: 'Microsoft Teams is not connected. Visit the <a style="color: #004eba">Microsoft Teams integration page</a> to connect your account.'
    },
    webex: {
        icon: '/assets/images/webex.svg',
        label: 'Webex',
        description: 'Webex is not connected. Visit the <a style="color: #004eba">Webex integration page</a> to connect your account.'
    },
    gotomeeting: {
        icon: '/assets/images/gotomeeting.svg',
        label: 'GoToMeeting',
        description: 'GoToMeeting is not connected. Visit the <a style="color: #004eba">GoToMeeting integration page</a>e to connect your account.'
    },
    google: {
        icon: '/assets/images/googlemeet.svg',
        label: 'Google Meet',
        description: 'Google Meet is not connected. Visit the <a style="color: #004eba">Google meet integration page</a> to connect your account.'
    },
    ask: {
        icon: (
            <svg className="event_customsvg" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 2.5C15 1.94772 15.4477 1.5 16 1.5H17C17.7957 1.5 18.5587 1.81607 19.1213 2.37868C19.6839 2.94129 20 3.70435 20 4.5V12.9999C20 13.7956 19.6839 14.5586 19.1213 15.1212C18.5587 15.6838 17.7957 15.9999 17 15.9999H10.3508L5.62469 19.7808C5.32452 20.0209 4.91328 20.0677 4.56681 19.9012C4.22035 19.7347 4 19.3843 4 18.9999V15.9999H3C2.20435 15.9999 1.44129 15.6838 0.87868 15.1212C0.316071 14.5586 0 13.7956 0 12.9999V4.5C0 3.70435 0.316071 2.94129 0.87868 2.37868C1.44129 1.81607 2.20435 1.5 3 1.5H4C4.55228 1.5 5 1.94772 5 2.5C5 3.05228 4.55228 3.5 4 3.5H3C2.73478 3.5 2.48043 3.60536 2.29289 3.79289C2.10536 3.98043 2 4.23478 2 4.5V12.9999C2 13.2651 2.10536 13.5195 2.29289 13.707C2.48043 13.8946 2.73478 13.9999 3 13.9999H5C5.55229 13.9999 6 14.4476 6 14.9999V16.9193L9.37531 14.219C9.55262 14.0772 9.77293 13.9999 10 13.9999H17C17.2652 13.9999 17.5196 13.8946 17.7071 13.707C17.8946 13.5195 18 13.2651 18 12.9999V4.5C18 4.23479 17.8946 3.98043 17.7071 3.79289C17.5196 3.60536 17.2652 3.5 17 3.5H16C15.4477 3.5 15 3.05228 15 2.5Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.0417 2C9.36757 2 8.72109 2.26778 8.24444 2.74444C7.76778 3.22109 7.5 3.86758 7.5 4.54167C7.5 5.09514 7.67014 5.76866 7.9774 6.5112C8.28053 7.24377 8.69222 7.98462 9.11632 8.65611C9.43974 9.1682 9.76417 9.63019 10.0417 10.0056C10.3192 9.63019 10.6436 9.1682 10.967 8.65611C11.3911 7.98462 11.8028 7.24377 12.1059 6.5112C12.4132 5.76866 12.5833 5.09514 12.5833 4.54167C12.5833 3.86758 12.3156 3.22109 11.8389 2.74444C11.3622 2.26778 10.7158 2 10.0417 2ZM10.0417 11.625C9.28241 12.2758 9.28228 12.2756 9.28214 12.2755L9.28086 12.274L9.27803 12.2707L9.26858 12.2595L9.23513 12.2198C9.20659 12.1857 9.1658 12.1366 9.11452 12.0737C9.01202 11.948 8.8673 11.7671 8.6944 11.5413C8.34943 11.091 7.88824 10.457 7.42534 9.7241C6.96403 8.99368 6.4903 8.14816 6.12937 7.27591C5.77257 6.41364 5.5 5.46389 5.5 4.54167C5.5 3.33714 5.9785 2.18195 6.83022 1.33022C7.68195 0.478496 8.83714 0 10.0417 0C11.2462 0 12.4014 0.478496 13.2531 1.33022C14.1048 2.18195 14.5833 3.33714 14.5833 4.54167C14.5833 5.46389 14.3108 6.41364 13.954 7.27591C13.593 8.14816 13.1193 8.99368 12.658 9.7241C12.1951 10.457 11.7339 11.091 11.3889 11.5413C11.216 11.7671 11.0713 11.948 10.9688 12.0737C10.9175 12.1366 10.8767 12.1857 10.8482 12.2198L10.8148 12.2595L10.8053 12.2707L10.8025 12.274L10.8015 12.2751C10.8014 12.2752 10.8009 12.2758 10.0417 11.625ZM10.0417 11.625L10.8015 12.2751C10.6116 12.4967 10.3336 12.625 10.0417 12.625C9.74974 12.625 9.47213 12.4971 9.28214 12.2755L10.0417 11.625Z" fill="currentColor"></path><path d="M8.86133 4.54188C8.86133 4.85499 8.98571 5.15527 9.20711 5.37666C9.4285 5.59806 9.72878 5.72244 10.0419 5.72244C10.355 5.72244 10.6553 5.59806 10.8767 5.37666C11.0981 5.15527 11.2224 4.85499 11.2224 4.54188C11.2224 4.22878 11.0981 3.9285 10.8767 3.7071C10.6553 3.48571 10.355 3.36133 10.0419 3.36133C9.72878 3.36133 9.4285 3.48571 9.20711 3.7071C8.98571 3.9285 8.86133 4.22878 8.86133 4.54188Z" fill="currentColor"></path></svg>
        ),
        label: 'Ask invitee'

    },

};

const EditLocationPopup = ({ open, handleClose, initialMeetingType, onUpdate }) => {
    const [meetingType, setMeetingType] = useState('');
    const [callOption, setCallOption] = useState('I will call my invitee');
    const [customOption, setCustomOption] = useState('Display location while booking');
    const [ShowAdditionalText, setShowAdditionalText] = useState(false);
    const renderMeetingContent = () => {
        switch (meetingType) {
            case 'phone':
                return (
                    <FormControl>
                        <RadioGroup value={callOption} onChange={(e) => setCallOption(e.target.value)}>
                            <FormControlLabel
                                value="I will call my invitee"
                                control={<Radio />}
                                label={
                                    <div className="editlocationmodal_radiocontent">
                                        I will call my invitee
                                        <p>Calendly will require your invitee's phone number before scheduling.</p>
                                    </div>
                                }
                            />
                            <FormControlLabel
                                value="My invitee should call me"
                                control={<Radio />}
                                label={
                                    <div className="editlocationmodal_radiocontent">
                                        My invitee should call me
                                        <p>Calendly will provide your number after the call has been scheduled.</p>
                                    </div>
                                }
                            />
                        </RadioGroup>
                    </FormControl>
                );
            case 'inperson':
                return (
                    <>
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
                    </>
                );
            case 'ask':
                return <p className="ask">Your invitee can type any response which will be used as the location on confirmation.</p>;
            case 'custom':
                return (
                    <>
                        <TextfieldComponent type='text' customStyle='custom_textfield_box' />
                        <FormControl>
                            <RadioGroup value={customOption} onChange={(e) => setCustomOption(e.target.value)}>
                                <FormControlLabel
                                    value="Display location while booking"
                                    control={<Radio />}
                                    label='Display location while booking'
                                />
                                <FormControlLabel
                                    value="Display location only after confirmation"
                                    control={<Radio />}
                                    label='Display location only after confirmation'
                                />
                            </RadioGroup>
                        </FormControl>
                    </>
                )
                    ;
            case 'zoom':
            case 'google':
            case 'webex':
            case 'gotomeeting':
                return (
                    <div className="editeventlocation_text">
                        Conferencing details will be provided upon booking completion.
                    </div>
                );

            default:
                return null;
        }
    };
    useEffect(() => {
        if (open && initialMeetingType) {
            setMeetingType(initialMeetingType);
        }
    }, [open, initialMeetingType]);
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
                    <div>
                        {renderMeetingContent()}
                    </div>

                    <div className="editlocationModal_button">
                        <CustomButton variant="outlined" sx={{ width: '160px' }} onClick={handleClose}>Cancel</CustomButton>

                        {/* <CustomButton variant="contained" sx={{ margin: 0 }} onClick={() => {
                            onUpdate(meetingType);
                            handleClose();
                        }}>Update</CustomButton> */}
                        <CustomButton
                            variant="contained"
                            sx={{ margin: 0 }}
                            onClick={() => {
                                const selected = meetingOptions.find(opt => opt.value === meetingType);
                                if (selected) {
                                    onUpdate({
                                        value: selected.value,
                                        label: selected.label,
                                        icon: selected.icon
                                    });
                                }
                                handleClose();
                            }}
                        >
                            Update
                        </CustomButton>
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
    // const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOption, setSelectedOption] = useState({
        value: '',
        label: '',
        icon: null
    });

    // const [addLocationOption, setLocationOption] = useState(null);
    const [addLocationOption, setLocationOption] = useState({
        value: '',
        label: '',
        icon: null
    });
    // const [addLocationOption, setLocationOption] = useState(null);
    const [openLocationModal, setOpenLocationModal] = useState(false);
    const [openAddLocationModal, setOpenAddLocationModal] = useState(false);
    const [showEventLocationContent, setShowEventLocationContent] = useState(false);
    const [openEventLocation, setEventLocation] = useState(false);
    const [addLocationDropdown, setAddLocationDropdown] = useState(false);
    const [meetingType, setMeetingType] = useState('');
    const [editEventLocation, setEditEventLocation] = useState(false);
    const [editAddEventLocation, setEditAddEventLocation] = useState(false);


    const handleSelectOption = (option) => {
        setSelectedOption(option);

        if (option === "phone" || option === "inperson" || option === 'custom') {
            setOpenLocationModal(true);
        }
        // else if (option === "zoom" || option === "google" || option === "webex" || option === "gotomeeting" || option === "teams" || option === 'ask') {
        //     setEventLocation(true);
        // }
        else {
            setEventLocation(true);
        }
    };
    const handleAddLocation = (option, fromModal = false) => {
        setLocationOption(option);

        setShowEventLocationContent(true);
        setAddLocationDropdown(false);
        if (!fromModal && (option?.value === "phone" || option?.value === "inperson" || option?.value === 'custom')) {
            setOpenAddLocationModal(true);

        }

    }
    // else if (eventBasedOptions.includes(option)) {
    //     setAddLocationDropdown(false);
    //     setShowEventLocationContent(true);
    // }
    // else {
    //     setAddLocationDropdown(false);
    //    // setShowEventLocationContent(true);
    // }
    // };

    const handleCloseAddLocation = () => [
        setAddLocationDropdown(false),
        setShowEventLocationContent(false)
    ]

    return (
        <div className="oneonone_container">
            {(selectedOption === "phone" || selectedOption === "inperson" || selectedOption === 'custom') && (
                <EditLocationPopup
                    open={openLocationModal}
                    handleClose={() => setOpenLocationModal(false)}
                    initialMeetingType={selectedOption}
                    onUpdate={handleSelectOption}

                />
            )}
            {(addLocationOption?.value === 'phone' || addLocationOption?.value === "inperson" || addLocationOption?.value === 'custom') && (
                <EditLocationPopup
                    open={openAddLocationModal}
                    handleClose={() => setOpenAddLocationModal(false)}
                    initialMeetingType={addLocationOption?.value}
                    onUpdate={handleAddLocation}

                />
            )}
            {
                editEventLocation && (
                    <>
                        <EditLocationPopup open={editEventLocation} handleClose={() => setEditEventLocation(false)} initialMeetingType={selectedOption?.value} onUpdate={handleSelectOption} />

                    </>
                )
            }
            {
                editAddEventLocation && (
                    <EditLocationPopup open={editAddEventLocation} handleClose={() => setEditAddEventLocation(false)} initialMeetingType={addLocationOption?.value} onUpdate={handleAddLocation} />
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
                                                    style={{ backgroundColor: selectedColor }} /><KeyboardArrowDownOutlinedIcon />
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
                                            openEventLocation ? (
                                                <>
                                                    <div className="selectedeventlocation_container"
                                                        style={{
                                                            backgroundColor: (selectedOption.value !== 'ask' && selectedOption.value !== 'google')
                                                                ? 'rgb(227 22 0 / 10%)'
                                                                : 'rgb(0 105 255 / 7%)'
                                                        }}>
                                                        {/* <div className="location_left_content">
                                                            {typeof eventLocations[selectedOption]?.icon === 'string' ? (
                                                                <img src={eventLocations[selectedOption]?.icon} alt={selectedOption} />
                                                            ) : (
                                                                eventLocations[selectedOption]?.icon
                                                            )}
                                                            <span>{eventLocations[selectedOption]?.label}</span>
                                                        </div>
                                                        <div className="location_right_content">
                                                            <CustomButton
                                                                variant="text"
                                                                sx={{ color: '#0060e6', borderRight: '1px solid rgb(26 26 26 / 10%) !important' }}
                                                                onClick={() => setEditEventLocation(true)}
                                                            >
                                                                Edit
                                                            </CustomButton>
                                                            <CloseIcon onClick={() => setEventLocation(false)} />
                                                        </div> */}
                                                        <div className="location_left_content">
                                                            {typeof selectedOption?.icon === 'string' ? (
                                                                <img src={selectedOption.icon} alt={selectedOption.label} />
                                                            ) : (
                                                                selectedOption?.icon
                                                            )}
                                                            <span>{selectedOption?.label}</span>
                                                        </div>

                                                        <div className="location_right_content">
                                                            <CustomButton
                                                                variant="text"
                                                                sx={{
                                                                    color: '#0060e6',
                                                                    borderRight: '1px solid rgb(26 26 26 / 10%) !important'
                                                                }}
                                                                onClick={() => setEditEventLocation(true)}
                                                            >
                                                                Edit
                                                            </CustomButton>
                                                            <CloseIcon onClick={() => setEventLocation(false)} />
                                                        </div>
                                                    </div>
                                                    {(selectedOption.value !== 'ask' && selectedOption.value !== 'google') && (
                                                        <div className="selectedeventLocation_subtext">
                                                            {selectedOption.label} is not connected. Visit the <a style={{ color: '#004eba' }}>{selectedOption.label}integration page</a> to connect your account.
                                                        </div>
                                                    )}

                                                    {addLocationDropdown ? (
                                                        <CustomDropdown
                                                            value={meetingType}
                                                            //  onChange={(e) => setMeetingType(e.target.value)}
                                                            // onChange={(e) => {
                                                            //     const selectedValue = e.target.value;
                                                            //     setMeetingType(selectedValue);
                                                            //     handleAddLocation(selectedValue);
                                                            //     console.log(selectedValue);
                                                            // }}
                                                            onChange={(e) => {
                                                                const selectedValue = e.target.value;
                                                                const selectedOption = meetingOptions.find((o) => o.value === selectedValue);

                                                                setMeetingType(selectedValue);
                                                                handleAddLocation(selectedOption);
                                                                console.log(selectedOption);
                                                            }}
                                                            options={meetingOptions}

                                                            getValueLabel={(val) => {
                                                                const selectedOption = meetingOptions.find((o) => o.value === val);
                                                                if (!selectedOption) return 'Add a Location';

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
                                                    ) : null}
                                                    {showEventLocationContent && (
                                                        <>
                                                            <div className="selectedeventlocation_container"
                                                                style={{
                                                                    backgroundColor: (addLocationOption.value !== 'ask' && addLocationOption.value !== 'google')
                                                                        ? 'rgb(227 22 0 / 10%)'
                                                                        : 'rgb(0 105 255 / 7%)'
                                                                }}>
                                                                {/* <div className="location_left_content">
                                                                    {typeof eventLocations[addLocationOption]?.icon === 'string' ? (
                                                                        <img src={eventLocations[addLocationOption]?.icon} alt={selectedOption} />
                                                                    ) : (
                                                                        eventLocations[addLocationOption]?.icon
                                                                    )}
                                                                    <span>{eventLocations[addLocationOption]?.label}</span>
                                                                </div> */}
                                                                <div className="location_left_content">
                                                                    {typeof addLocationOption?.icon === 'string' ? (
                                                                        <img src={addLocationOption?.icon} alt={selectedOption} />
                                                                    ) : (
                                                                        addLocationOption?.icon
                                                                    )}
                                                                    <span>{addLocationOption?.label}</span>
                                                                </div>
                                                                <div className="location_right_content">
                                                                    <CustomButton
                                                                        variant="text"
                                                                        sx={{ color: '#0060e6', borderRight: '1px solid rgb(26 26 26 / 10%) !important' }}
                                                                        onClick={() => setEditAddEventLocation(true)}
                                                                    >
                                                                        Edit
                                                                    </CustomButton>
                                                                    <CloseIcon onClick={handleCloseAddLocation} />
                                                                </div>
                                                            </div>
                                                            {(addLocationOption.value !== 'ask' && addLocationOption.value !== 'google') && (
                                                                <div className="selectedeventLocation_subtext">
                                                                    {addLocationOption.label} is not connected. Visit the <a style={{ color: '#004eba' }}>{addLocationOption.label}integration page</a> to connect your account.
                                                                </div>
                                                            )}
                                                            {/* <div className="selectedeventLocation_subtext"
                                                                dangerouslySetInnerHTML={{ __html: eventLocations[addLocationOption]?.description }}
                                                            /> */}
                                                            <CustomButton
                                                                variant="text"
                                                                sx={style.location_option_btn}
                                                                icon={<AddIcon />}

                                                            >
                                                                Add a location option
                                                            </CustomButton>
                                                        </>
                                                    )}
                                                    {!showEventLocationContent && !addLocationDropdown && (
                                                        <>
                                                            <div className="selectedeventloc_option">
                                                                Want to offer choices to your invitee?
                                                            </div>
                                                            <CustomButton
                                                                variant="text"
                                                                sx={style.location_option_btn}
                                                                onClick={() => setAddLocationDropdown(true)}
                                                            >
                                                                Add a location option
                                                            </CustomButton>
                                                        </>
                                                    )}
                                                </>
                                            ) : (

                                                <SelectEventLocation onSelect={handleSelectOption} />
                                            )
                                        }
                                    </div>

                                </div>

                            </div>
                            <div className="button_footer">
                                <CustomButton variant="text" sx={{ maginLeft: 'auto' }}>Cancel</CustomButton>
                                <Link to="/edit-eventtype" style={{ textDecoration: 'none' }}>
                                    <CustomButton variant="contained" sx={{ margin: '0px', width: '100px' }}>
                                        Continue
                                    </CustomButton></Link>
                                {/* <CustomButton variant="contained" sx={{ margin: '0px', width: '100px' }}>Continue</CustomButton> */}
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
                                <div className="user1">hepto</div>
                                <div className="eventname">{eventName ? eventName: 'Event name here'}</div>
                                <div className="location_container">

                                    <div className="loc_content"><AccessTimeOutlinedIcon /><span>{duration ? duration :'30 min'}</span></div>
                                    {
                                        selectedOption.value === 'google' && (
                                            <div className="loc_content"><VideocamOutlinedIcon />Web conferencing details provided upon confirmation.</div>
                                        )
                                    }
                                    {
                                        !selectedOption.value && (
                                            <div className="loc_content"><LocationOnOutlinedIcon /><span>Add a location for it to show here</span></div>
                                        )
                                    }

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