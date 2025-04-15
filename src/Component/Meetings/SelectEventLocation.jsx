import React, { useState } from "react";
import { ExpandMoreIcon, LinkOutlinedIcon,SettingsOutlinedIcon } from '../Icon';

const SelectEventLocation = ({ options, showWebConfOptions = true,onSelect }) => {
    const [showOptions, setShowOptions] = useState(false);

    return (
        <div className="select_event_location">
          
            <div className="event_container">
                {options.map((option, index) => (
                    <div key={index} className="select_event_content"   onClick={() => onSelect(option.label)}>
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
                    <div><LinkOutlinedIcon /> Ask invitee</div>
                    <div><SettingsOutlinedIcon />Custom</div>

                    {showWebConfOptions && (
                        <>
                            <div><b>WEB CONFERENCING</b></div>
                            <div><img src="/assets/images/Googlemeet.svg" alt="Google Meet" /> Google Meet</div>
                            <div><img src="/assets/images/Teams.svg" alt="Microsoft Teams" /> Microsoft Teams</div>
                            <div><img src="/assets/images/webex.svg" alt="Webex" /> Webex</div>
                            <div><img src="/assets/images/gotomeeting.svg" alt="GoTo Meeting" /> GoTo Meeting</div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectEventLocation;
