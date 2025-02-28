import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';

const Styles = {
    timePicker: {

        width: '170px',
        borderRadius: '5px',
        background: 'rgb(245, 246, 250)',
        height: '40px',
        fontWeight: 400,
        fontSize: '1rem',
        color: 'rgba(0, 0, 0, 0.87)',
        '& .MuiOutlinedInput-root': {
            border: 'none',
            '&:hover fieldset': { border: 'none' },
            '&.Mui-focused fieldset': { border: 'none' },
        },
        '& fieldset': { border: 'none' },
        '& .MuiInputBase-input': {
            padding: '10.5px 14px',
        },

    }
}
const TimePickerComponent = ({ initialValue, disabled,customStyles }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
                disabled={disabled}
                ampm={false}
                value={initialValue ? dayjs(initialValue) : null}
                viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                }}
                slotProps={{
                    textField: {
                        sx: { ...Styles.timePicker,...customStyles },
                    },
                }}
            />
        </LocalizationProvider>
    );
};
export default TimePickerComponent;