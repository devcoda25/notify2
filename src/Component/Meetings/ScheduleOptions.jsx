import React from "react";
import { FormControl, Typography, RadioGroup, FormControlLabel, Radio, TextField, Select, MenuItem } from "@mui/material";

const ScheduleOptions = ({ selectedValue, onChange }) => {
  return (
    <div className="datarange_scheduleoptions">
      
    <FormControl>
      <Typography>Invitees can schedule...</Typography>
      <RadioGroup value={selectedValue} onChange={onChange}>
        <FormControlLabel
          value="future"
          control={<Radio />}
          label={
            <div className="radio_container">
              <TextField type="text" variant="outlined" className="textfield"/>
              <Select size="small">
                <MenuItem value="calendar days">calendar days</MenuItem>
                <MenuItem value="weekdays">weekdays</MenuItem>
              </Select>
              <span>into the future</span>
            </div>
          }
        />
        <FormControlLabel value="dateRange" control={<Radio />} label="Within a date range" />
        <FormControlLabel value="indefinite" control={<Radio />} label="Indefinitely into the future" />
      </RadioGroup>
    </FormControl>
    </div>
  );
};

export default ScheduleOptions;
