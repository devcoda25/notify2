import React from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { IconButton, Typography, Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import dayjs from 'dayjs';

const CustomCalendarHeader = ({ currentMonth, onMonthChange }) => {
  const minMonth = dayjs();
  const isPrevDisabled = currentMonth.isSame(minMonth, 'month');

  const handlePrev = () => {
    if (!isPrevDisabled) {
      onMonthChange(currentMonth.subtract(1, 'month'));
    }
  };

  const handleNext = () => {
    onMonthChange(currentMonth.add(1, 'month'));
  };

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const iconButtonStyle = (isDisabled) => ({
    backgroundColor: isDisabled ? 'transparent' : '#E3F2FD',
    color: isDisabled ? '#ccc' : '#007FFF',
    borderRadius: '50%',
    padding: '6px',
    width: '32px',
    height: '32px',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: isDisabled ? 'transparent' : '#BBDEFB',
    },
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: '6px 6px 15px',
          gap: '32px',
        }}
      >
        <IconButton onClick={handlePrev} size="small" disabled={isPrevDisabled} sx={iconButtonStyle(isPrevDisabled)}>
          <ChevronLeft />
        </IconButton>
        <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
          {currentMonth.format('MMMM YYYY')}
        </Typography>
        <IconButton onClick={handleNext} size="small" sx={iconButtonStyle(false)}>
          <ChevronRight />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingRight: '16px',
          mb: 1,
        }}
      >
        {weekDays.map((day) => (
          <Box
            key={day}
            sx={{
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: 1,
              textTransform: 'uppercase',
              width: '100%',
              textAlign: 'center',
            }}
          >
            {day}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const CustomDatePicker = ({ value, onChange, disablePastDates }) => {
  return (
    <StaticDatePicker
      displayStaticWrapperAs="desktop"
      value={value}
      onChange={onChange}
      shouldDisableDate={disablePastDates}
      slots={{
        toolbar: false,
        calendarHeader: CustomCalendarHeader,
      }}
      slotProps={{
        day: {
          sx: {
            margin: '0px 4px 0px 4px',
            '&.Mui-disabled': {
              color: '#9e9e9e',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              padding: '1px 0 0',
              width: '44px',
              height: '44px',
              marginTop: '2px',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgb(0 105 255 / 7%)',
              color: 'white',
              width: '44px',
              height: '44px',
              textAlign: 'center',
              marginTop: '2px',
              padding: '1px 0 0',
              fontWeight: 'bold',
              fontSize: '14px',
            },
            '&:not(.Mui-selected):not(.Mui-disabled)': {
              backgroundColor: 'rgb(0 105 255 / 7%)',
              color: '#0060e6',
              fontWeight: 'bold',
              fontSize: '14px',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              marginTop: '2px',
              padding: '1px 0 0',
            },
            '&.MuiPickersDay-today': {
              border: 'none !important',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 6,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: '#007FFF',
              },
            },
          },
        },
        dayOfWeekLabel: {
          sx: {
            display: 'none',
          },
        },
      }}
    />
  );
};

export default CustomDatePicker;
