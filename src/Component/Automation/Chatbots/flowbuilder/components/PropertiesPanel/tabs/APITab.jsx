import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { X } from 'lucide-react';

export default function APITab() {
    const { register, control, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: 'headers' });

    return (
        <Stack spacing={3} sx={{ p: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Method</InputLabel>
                        <Select {...register('method')} defaultValue="GET" label="Method">
                            <MenuItem value="GET">GET</MenuItem>
                            <MenuItem value="POST">POST</MenuItem>
                            <MenuItem value="PUT">PUT</MenuItem>
                            <MenuItem value="PATCH">PATCH</MenuItem>
                            <MenuItem value="DELETE">DELETE</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        {...register('url')}
                        label="URL"
                        fullWidth
                        size="small"
                        error={!!errors.url}
                        helperText={errors.url ? String(errors.url.message) : null}
                    />
                </Grid>
            </Grid>

            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Headers</Typography>
                    <Button size="small" onClick={() => append({ key: '', value: '' })}>+ Add</Button>
                </Box>
                <Stack spacing={1}>
                    {fields.map((f, i) => (
                        <Stack direction="row" key={f.id} spacing={1} alignItems="center">
                            <TextField {...register(`headers.${i}.key`)} placeholder="Key" size="small" fullWidth />
                            <TextField {...register(`headers.${i}.value`)} placeholder="Value" size="small" fullWidth />
                            <IconButton onClick={() => remove(i)} aria-label="Remove header">
                                <X size={16} />
                            </IconButton>
                        </Stack>
                    ))}
                </Stack>
            </Box>

            <TextField
                {...register('body')}
                label="Body (JSON)"
                multiline
                rows={6}
                fullWidth
                placeholder='{"foo":"bar"}'
                error={!!errors.body}
                helperText={errors.body ? String(errors.body.message) : null}
                sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace' } }}
            />
        </Stack>
    );
}