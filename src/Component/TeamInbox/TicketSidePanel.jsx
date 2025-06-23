import React from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from 'dayjs';
import {  DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const options = ["Option 1", "Option 2", "Option 3"];

const labels = [
  "Channel",
  "Priority",
  "Assigned To",
  "Module",
  "Ticket Type",
];

const TicketSidePanel = ({ onClose }) => {
  return (
    <Paper elevation={3} sx={{ maxWidth: "200px", p: 0, height:"100%" }}>
      {/* Top Header: Only Bottom Border */}
      <Box
        sx={{
          borderBottom: "1px solid #C4C4C4",
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: 1.5,
        }}
      >
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Content Padding */}
      <Box sx={{ p: 2 }}>
        {labels.map((label, index) => (
          <FormControl
            key={index}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            variant="outlined"
          >
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{ mb: 0.5 }}
            >
              {label}
            </Typography>
            
            <Select sx={{backgroundColor:"#F5F5F5"}} defaultValue="">
              {options.map((opt, idx) => (
                <MenuItem key={idx} value={opt}>
                  {opt}
                </MenuItem>
                
              ))}
            </Select>
          </FormControl>
        ))}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* <DemoContainer
              components={[
                'DatePicker',
                'MobileDatePicker',
                'DesktopDatePicker',
                'StaticDatePicker',
              ]}
            > */}
              <DemoItem label="Date">
                <DesktopDatePicker defaultValue={dayjs('2022-04-17')} />
              </DemoItem>
            
            {/* </DemoContainer> */}
          </LocalizationProvider>
      </Box>
    </Paper>
  );
};

export default TicketSidePanel;
