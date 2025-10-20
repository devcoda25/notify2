import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Styled components for better code readability and reusability
const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  height: '100vh',
  maxHeight: '100vh',
  p: 0,
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  top: 0,
  right: 0,
  zIndex: theme.zIndex.drawer + 1,
  [theme.breakpoints.up('sm')]: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    maxWidth: 'none',
    width: 250, // Adjusted for a better desktop side panel width
  },
}));

const PanelHeader = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  height: 56,
  
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1.5),
  flexShrink: 0,
  [theme.breakpoints.up('sm')]: {
    height: 48,
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    marginBottom: theme.spacing(2),
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100], // Using theme color
  height: 44,
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none',
    boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
  },
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.875rem',
  [theme.breakpoints.up('sm')]: {
    height: 40,
    fontSize: '0.8125rem',
  },
}));

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiInputBase-root': {
    height: 44,
    backgroundColor: theme.palette.grey[100],
    fontSize: '0.875rem',
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('sm')]: {
      height: 40,
      fontSize: '0.8125rem',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none',
    boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
  },
}));

const options = ['Option 1', 'Option 2', 'Option 3'];
const labels = ['Channel', 'Priority', 'Assigned To', 'Module', 'Ticket Type'];

const TicketSidePanel = ({ onClose }) => {
  const theme = useTheme();
  return (
    <StyledPaper elevation={5}>
      <PanelHeader>
        <Typography variant="h6" component="h2" sx={{ mr: 'auto', pl: 1 }}>
          Ticket Details
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: theme.palette.text.secondary }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </PanelHeader>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: { xs: 3, sm: 2 },
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.grey[200],
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.grey[400],
            borderRadius: '4px',
            '&:hover': {
              background: theme.palette.grey[500],
            },
          },
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.grey[400]} ${theme.palette.grey[200]}`,
        }}
      >
        {labels.map((label, index) => (
          <StyledFormControl key={index} fullWidth size="small">
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{
                mb: { xs: 1, sm: 0.5 },
                fontSize: { xs: '0.875rem', sm: '0.75rem' },
                color:"#000",
              }}
            >
              {label}
            </Typography>
            <StyledSelect defaultValue="">
              {options.map((opt, idx) => (
                <MenuItem key={idx} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </StyledSelect>
          </StyledFormControl>
        ))}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ mb: { xs: 3, sm: 2 } }}>
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{
                mb: { xs: 1, sm: 0.5 },
                fontSize: { xs: '0.875rem', sm: '0.75rem' },
              }}
            >
              Date
            </Typography>
            <StyledDatePicker format="MMMM D, YYYY" slotProps={{ textField: { fullWidth: true } }} />
          </Box>
        </LocalizationProvider>
      </Box>
    </StyledPaper>
  );
};

export default TicketSidePanel;