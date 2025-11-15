import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';

const FormSection = ({ title, description, children }) => (
    <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={2}>
            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
                {description && <Typography variant="body2" color="text.secondary">{description}</Typography>}
            </Box>
            {children}
        </Stack>
    </Paper>
);

export default function GeneralTab() {
    const { control, register, formState: { errors } } = useFormContext();

    return (
        <Stack spacing={3} sx={{ p: 1 }}>
            <FormSection
                title="Node Details"
                description="Basic information for this node."
            >
                <TextField
                    {...register('label')}
                    label="Label"
                    fullWidth
                    size="small"
                    error={!!errors.label}
                    helperText={errors.label ? String(errors.label.message) : null}
                />
                <TextField
                    {...register('icon')}
                    label="Icon (from Lucide)"
                    placeholder="e.g. MessageSquare"
                    fullWidth
                    size="small"
                />
            </FormSection>

            <FormSection
                title="Channel Override"
                description="Force this node to use a specific channel, overriding the flow's default."
            >
                <FormControl fullWidth size="small">
                    <InputLabel>Channel</InputLabel>
                    <Controller
                        control={control}
                        name="channel"
                        defaultValue="default"
                        render={({ field }) => (
                            <Select {...field} label="Channel">
                                <MenuItem value="default">— Default —</MenuItem>
                                <MenuItem value="whatsapp">WhatsApp</MenuItem>
                                <MenuItem value="sms">SMS</MenuItem>
                                <MenuItem value="email">Email</MenuItem>
                            </Select>
                        )}
                    />
                </FormControl>
            </FormSection>
        </Stack>
    );
}