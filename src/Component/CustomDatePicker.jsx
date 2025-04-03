import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

const CustomDatePicker = ({ value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          value={value}
          onChange={onChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              border: "none",
              background: "white !important",
              width: "80%",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none !important",
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
