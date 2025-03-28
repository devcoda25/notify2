import React from "react";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Typography, Grid, List, ListItem, ListItemButton } from "@mui/material";
import dayjs from "dayjs";

const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
];

const SelectDateandTimeComponent = ({ selectedDate, showTimeSlots, selectedTime, updateState }) => {

    const handleDateChange = (newDate) => {
        updateState({ selectedDate: newDate, showTimeSlots: true, selectedTime: [] });
    };

    const disablePastDates = (date) => date.isBefore(dayjs(), "day");

    const handleTimeClick = (time) => {
        updateState({
            selectedTime: selectedTime.includes(time)
                ? selectedTime.filter((t) => t !== time)
                : [...selectedTime, time],
        });
    };

    return (
        <div className="select_dateandtime_content" >
            <Grid container spacing={2}>
                <Grid item xs={12} md={showTimeSlots ? 6 : 12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDatePicker
                            displayStaticWrapperAs="desktop"
                            value={selectedDate}
                            onChange={handleDateChange}
                            shouldDisableDate={disablePastDates}
                        />
                    </LocalizationProvider>
                </Grid>

                {showTimeSlots && (
                    <Grid item xs={12} md={6} className="timeslots_grid">
                        <Typography variant="h6">
                            {dayjs(selectedDate).format("dddd, MMMM D")}
                        </Typography>
                        <List className="timeslots_list">
                            {timeSlots.map((time, index) => (
                                <ListItem key={index} disablePadding className="timeslots_list_item" onClick={() => handleTimeClick(time)}
                                    sx={{
                                        backgroundColor: selectedTime.includes(time) ? "rgb(0, 105, 255)" : "transparent",
                                        color: selectedTime.includes(time) ? "#fff" : "rgb(0, 105, 255)",
                                    }}>
                                    <ListItemButton>{time}</ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                )}
            </Grid>
        </div>
    );
};

export default SelectDateandTimeComponent;
