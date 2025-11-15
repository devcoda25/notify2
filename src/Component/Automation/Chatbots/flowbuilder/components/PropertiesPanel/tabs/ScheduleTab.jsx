import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';

export default function ScheduleTab() {
    const { register, watch, formState: { errors } } = useFormContext();
    const mode = watch('mode') ?? 'delay';

    return (
        <Stack spacing={2} sx={{ p: 1 }}>
            <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={5}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Mode</InputLabel>
                        <Select {...register('mode')} defaultValue="delay" label="Mode">
                            <MenuItem value="delay">Delay</MenuItem>
                            <MenuItem value="datetime">Date & Time</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={7}>
                    {mode === 'delay' ? (
                        <TextField
                            type="number"
                            {...register('delayMinutes', { valueAsNumber: true })}
                            label="Delay (minutes)"
                            fullWidth
                            size="small"
                        />
                    ) : (
                        <TextField
                            type="datetime-local"
                            {...register('runAt')}
                            label="Run at (ISO)"
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />
                    )}
                </Grid>
            </Grid>
            {errors.root && <Typography color="error" variant="caption">{String(errors.root.message)}</Typography>}
        </Stack>
    );
}