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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const options = ["Option 1", "Option 2", "Option 3"];

const labels = ["Channel", "Priority", "Assigned To", "Module", "Ticket Type"];

const TicketSidePanel = ({ onClose }) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: { xs: "100%", sm: "200px", md: "200px", lg: "100%", xl:"100%" },
        maxWidth: { xs: "100vw", sm: "400px" },
        height: { xs: "100vh", sm: "100vh" },
        maxHeight: { xs: "100vh", sm: "100vh", md:"100vh", lg:"100vh", xl:"100vh" },
        p: 0,
        display: "flex",
        flexDirection: "column",
        position: { xs: "fixed", sm: "relative" },
        top: { xs: 0, sm: "auto" },
        right: { xs: 0, sm: "auto" },
        zIndex: { xs: 1300, sm: "auto" },
        borderRadius: { xs: 0, sm: 1 },
      }}
    >
      {/* Top Header: Only Bottom Border */}
      <Box
        sx={{
          borderBottom: "1px solid #C4C4C4",
          height: { xs: 56, sm: 48 },
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: { xs: 2, sm: 1.5 },
          flexShrink: 0,
        }}
      >
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Scrollable Content */}
      <Box 
        sx={{ 
          flex: 1,
          overflow: "auto",
          p: { xs: 3, sm: 2 },
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
            '&:hover': {
              background: '#a8a8a8',
            },
          },
          // Firefox scrollbar
          scrollbarWidth: 'thin',
          scrollbarColor: '#c1c1c1 #f1f1f1',
        }}
      >
        {labels.map((label, index) => (
          <FormControl
            key={index}
            fullWidth
            size="small"
            sx={{ mb: { xs: 3, sm: 2 } }}
            variant="outlined"
          >
            <Typography 
              variant="body2" 
              fontWeight="medium" 
              sx={{ 
                mb: { xs: 1, sm: 0.5 },
                fontSize: { xs: '0.875rem', sm: '0.75rem' }
              }}
            >
              {label}
            </Typography>

            <Select 
              sx={{ 
                backgroundColor: "#F5F5F5",
                height: { xs: 44, sm: 40 },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                  boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                },
                borderRadius: 1,
                fontSize: { xs: '0.875rem', sm: '0.8125rem' },
              }} 
              defaultValue=""
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 200,
                    '& .MuiMenuItem-root': {
                      fontSize: { xs: '0.875rem', sm: '0.8125rem' },
                      py: { xs: 1.5, sm: 1 },
                    },
                  },
                },
              }}
            >
              {options.map((opt, idx) => (
                <MenuItem key={idx} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ mb: { xs: 3, sm: 2 } }}>
            <Typography 
              variant="body2" 
              fontWeight="medium" 
              sx={{ 
                mb: { xs: 1, sm: 0.5 },
                fontSize: { xs: '0.875rem', sm: '0.75rem' }
              }}
            >
              Date
            </Typography>
            <DatePicker
              format="MMMM D, YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  variant: "outlined",
                  label: "",
                  sx: {
                    backgroundColor: "#F5F5F5",
                    '& .MuiInputBase-root': {
                      height: { xs: 44, sm: 40 },
                      fontSize: { xs: '0.875rem', sm: '0.8125rem' },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                    },
                    borderRadius: 1,
                  },
                },
                popper: {
                  sx: {
                    '& .MuiPaper-root': {
                      fontSize: { xs: '0.875rem', sm: '0.8125rem' },
                    },
                  },
                },
              }}
            />
          </Box>
        </LocalizationProvider>

        {/* Add some extra content to demonstrate scrolling */}
        {/* {Array.from({ length: 3 }, (_, index) => (
          <FormControl
            key={`extra-${index}`}
            fullWidth
            size="small"
            sx={{ mb: { xs: 3, sm: 2 } }}
            variant="outlined"
          >
            <Typography 
              variant="body2" 
              fontWeight="medium" 
              sx={{ 
                mb: { xs: 1, sm: 0.5 },
                fontSize: { xs: '0.875rem', sm: '0.75rem' }
              }}
            >
              Extra Field {index + 1}
            </Typography>

            <Select 
              sx={{ 
                backgroundColor: "#F5F5F5",
                height: { xs: 44, sm: 40 },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                  boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                },
                borderRadius: 1,
                fontSize: { xs: '0.875rem', sm: '0.8125rem' },
              }} 
              defaultValue=""
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 200,
                    '& .MuiMenuItem-root': {
                      fontSize: { xs: '0.875rem', sm: '0.8125rem' },
                      py: { xs: 1.5, sm: 1 },
                    },
                  },
                },
              }}
            >
              {options.map((opt, idx) => (
                <MenuItem key={idx} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))} */}

      </Box>
    </Paper>
  );
};

export default TicketSidePanel;