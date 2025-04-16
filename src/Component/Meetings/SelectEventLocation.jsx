import React, { useState } from "react";
import { ExpandMoreIcon, LinkOutlinedIcon,SettingsOutlinedIcon,VideocamOutlinedIcon,LocalPhoneOutlinedIcon,LocationOnOutlinedIcon} from '../Icon';

const eventOptions = [
    { icon: <VideocamOutlinedIcon />, label: "Zoom",value:'zoom' },
    { icon: <LocalPhoneOutlinedIcon />, label: "Phone",value:'phone' },
    { icon: <LocationOnOutlinedIcon />, label: "In-person meeting",value:'inperson' },
];
const SelectEventLocation = ({ options, showWebConfOptions = true,onSelect }) => {
    const [showOptions, setShowOptions] = useState(false);

    return (
        <div className="select_event_location">
          
            <div className="event_container">
                {eventOptions.map((option, index) => (
                    <div key={index} className="select_event_content"   onClick={() => onSelect(option.value)}>
                        {option.icon}
                        <div>{option.label}</div>
                    </div>
                ))}
                <div className="options_container" onClick={() => setShowOptions(!showOptions)}>
                    <ExpandMoreIcon />
                    All options
                </div>
            </div>

            {showOptions && (
                <div className="new_meeting_option_menu">
                    <div  className ='option_content' onClick={() => onSelect("ask")}>
                        <svg className='event_customsvg'viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 2.5C15 1.94772 15.4477 1.5 16 1.5H17C17.7957 1.5 18.5587 1.81607 19.1213 2.37868C19.6839 2.94129 20 3.70435 20 4.5V12.9999C20 13.7956 19.6839 14.5586 19.1213 15.1212C18.5587 15.6838 17.7957 15.9999 17 15.9999H10.3508L5.62469 19.7808C5.32452 20.0209 4.91328 20.0677 4.56681 19.9012C4.22035 19.7347 4 19.3843 4 18.9999V15.9999H3C2.20435 15.9999 1.44129 15.6838 0.87868 15.1212C0.316071 14.5586 0 13.7956 0 12.9999V4.5C0 3.70435 0.316071 2.94129 0.87868 2.37868C1.44129 1.81607 2.20435 1.5 3 1.5H4C4.55228 1.5 5 1.94772 5 2.5C5 3.05228 4.55228 3.5 4 3.5H3C2.73478 3.5 2.48043 3.60536 2.29289 3.79289C2.10536 3.98043 2 4.23478 2 4.5V12.9999C2 13.2651 2.10536 13.5195 2.29289 13.707C2.48043 13.8946 2.73478 13.9999 3 13.9999H5C5.55229 13.9999 6 14.4476 6 14.9999V16.9193L9.37531 14.219C9.55262 14.0772 9.77293 13.9999 10 13.9999H17C17.2652 13.9999 17.5196 13.8946 17.7071 13.707C17.8946 13.5195 18 13.2651 18 12.9999V4.5C18 4.23479 17.8946 3.98043 17.7071 3.79289C17.5196 3.60536 17.2652 3.5 17 3.5H16C15.4477 3.5 15 3.05228 15 2.5Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.0417 2C9.36757 2 8.72109 2.26778 8.24444 2.74444C7.76778 3.22109 7.5 3.86758 7.5 4.54167C7.5 5.09514 7.67014 5.76866 7.9774 6.5112C8.28053 7.24377 8.69222 7.98462 9.11632 8.65611C9.43974 9.1682 9.76417 9.63019 10.0417 10.0056C10.3192 9.63019 10.6436 9.1682 10.967 8.65611C11.3911 7.98462 11.8028 7.24377 12.1059 6.5112C12.4132 5.76866 12.5833 5.09514 12.5833 4.54167C12.5833 3.86758 12.3156 3.22109 11.8389 2.74444C11.3622 2.26778 10.7158 2 10.0417 2ZM10.0417 11.625C9.28241 12.2758 9.28228 12.2756 9.28214 12.2755L9.28086 12.274L9.27803 12.2707L9.26858 12.2595L9.23513 12.2198C9.20659 12.1857 9.1658 12.1366 9.11452 12.0737C9.01202 11.948 8.8673 11.7671 8.6944 11.5413C8.34943 11.091 7.88824 10.457 7.42534 9.7241C6.96403 8.99368 6.4903 8.14816 6.12937 7.27591C5.77257 6.41364 5.5 5.46389 5.5 4.54167C5.5 3.33714 5.9785 2.18195 6.83022 1.33022C7.68195 0.478496 8.83714 0 10.0417 0C11.2462 0 12.4014 0.478496 13.2531 1.33022C14.1048 2.18195 14.5833 3.33714 14.5833 4.54167C14.5833 5.46389 14.3108 6.41364 13.954 7.27591C13.593 8.14816 13.1193 8.99368 12.658 9.7241C12.1951 10.457 11.7339 11.091 11.3889 11.5413C11.216 11.7671 11.0713 11.948 10.9688 12.0737C10.9175 12.1366 10.8767 12.1857 10.8482 12.2198L10.8148 12.2595L10.8053 12.2707L10.8025 12.274L10.8015 12.2751C10.8014 12.2752 10.8009 12.2758 10.0417 11.625ZM10.0417 11.625L10.8015 12.2751C10.6116 12.4967 10.3336 12.625 10.0417 12.625C9.74974 12.625 9.47213 12.4971 9.28214 12.2755L10.0417 11.625Z" fill="currentColor"></path><path d="M8.86133 4.54188C8.86133 4.85499 8.98571 5.15527 9.20711 5.37666C9.4285 5.59806 9.72878 5.72244 10.0419 5.72244C10.355 5.72244 10.6553 5.59806 10.8767 5.37666C11.0981 5.15527 11.2224 4.85499 11.2224 4.54188C11.2224 4.22878 11.0981 3.9285 10.8767 3.7071C10.6553 3.48571 10.355 3.36133 10.0419 3.36133C9.72878 3.36133 9.4285 3.48571 9.20711 3.7071C8.98571 3.9285 8.86133 4.22878 8.86133 4.54188Z" fill="currentColor"></path></svg>
                  Ask invitee</div>
                    <div  onClick={() => onSelect("custom")} className ='option_content'>
                        <svg className='event_customsvg' viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M5.5 3.25H9a.5.5 0 0 1 .5.5v2.5a.5.5 0 0 1-.5.5H5.5M1.5 6.75H1a.5.5 0 0 1-.5-.5v-2.5a.5.5 0 0 1 .5-.5h.5M2.5 1.25h2M2.5 8.75h2M3.5 1.25v7.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    Custom</div>

                    {showWebConfOptions && (
                        <>
                            <div><b>WEB CONFERENCING</b></div>
                            <div className ='option_content'  onClick={() => onSelect("google")}><img src="/assets/images/Googlemeet.svg" alt="Google Meet" /> Google Meet</div>
                            <div className ='option_content' onClick={() => onSelect("teams")}><img src="/assets/images/Teams.svg" alt="Microsoft Teams" /> Microsoft Teams</div>
                            <div className ='option_content'onClick={() => onSelect("webex")}><img src="/assets/images/webex.svg" alt="Webex" /> Webex</div>
                            <div className ='option_content'  onClick={() => onSelect("gotomeeting")}><img src="/assets/images/gotomeeting.svg" alt="GoTo Meeting" /> GoTo Meeting</div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectEventLocation;
