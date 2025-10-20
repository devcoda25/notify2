import React from "react";
import { Select, MenuItem } from "@mui/material";
import { CloseIcon } from "../Icon"

const LocationSelector = ({
    selectedLocation,
    showLocationDropdown,
    locationOptions,
    handleLocationChange,
    handleAddLocation,
    defaultImg = "/assets/images/Googlemeet.svg",
    defaultTitle = "Google Meet",
    onClose,
    isLocationCardVisible,
}) => {
    return (
        <div className="location_selector">
            <label>Location</label>
            {isLocationCardVisible && (
                <div className="location_Card">
                    <img src={defaultImg} alt={defaultTitle} />
                    <span>{defaultTitle}</span>
                    <a>Edit</a>
                    <CloseIcon onClick={onClose} style={{ cursor: "pointer" }} />
                </div>
            )}
            {!showLocationDropdown ? (
                <div className="add_location_container">
                    <p>Want to offer choices to your invitee?</p>
                    <a onClick={handleAddLocation}>Add a location Option</a>
                </div>
            ) : (
                <>
                    <Select
                        value={selectedLocation}
                        onChange={handleLocationChange}
                        className="select_add_location"
                        renderValue={(selected) => {
                            if (!selected) {
                                return <span style={{ color: "black" }}>Add a location</span>;
                            }
                            const option = locationOptions.find((opt) => opt.title === selected);
                            return (
                                option && (
                                    <div className='location_options'>
                                        {typeof option.img === "string" ? (
                                            <img src={option.img} alt={option.title} width="20" height="20" />
                                        ) : (
                                            React.cloneElement(option.img, { width: 15, height: 15 })
                                        )}
                                        {option.title}
                                    </div>
                                )
                            );
                        }}
                    >
                        {locationOptions.map((option, index) => (
                            <MenuItem key={index} value={option.title}>
                                {typeof option.img === "string" ? (
                                    <img src={option.img} alt={option.title} width="20" height="20" />
                                ) : (
                                    React.cloneElement(option.img, { width: 15, height: 15 })
                                )}
                                {option.title}
                            </MenuItem>
                        ))}
                    </Select>
                </>
            )}
        </div>
    );
};

export default LocationSelector;
