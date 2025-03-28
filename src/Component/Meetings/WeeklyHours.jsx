import React, { useState } from "react";
import TimePickerComponent from '../TimePickerComponent'
import { AddCircleOutlineIcon, ContentCopyIcon, CloseIcon } from '../Icon'

const styles = {
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
}
const WeeklyHours = ({meetingHours,setMeetingHours}) => {
    
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
    return (
        <div className="Weeklyhours_meet_container">
            {
                Object.entries(meetingHours).map(([day, slots], dayIndex) => (
                    <div key={dayIndex} className='setmeeting_hours_container'>
                        <div className="day">
                            <input type="checkbox" checked={true} />
                         <span>  {day.slice(0, 3)}</span>
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
    )
}
export default WeeklyHours;