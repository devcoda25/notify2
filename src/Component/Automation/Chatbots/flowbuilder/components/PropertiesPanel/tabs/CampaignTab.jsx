import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
    Box,
    Button,
    IconButton,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { X } from 'lucide-react';

export default function CampaignTab() {
    const { register, control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: 'tags' });

    return (
        <Stack spacing={3} sx={{ p: 1 }}>
            <TextField {...register('name')} label="Campaign Name" fullWidth size="small" />

            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Tags</Typography>
                    <Button size="small" type="button" onClick={() => append({ value: '' })}>+ Add</Button>
                </Box>
                <Stack spacing={1}>
                    {fields.map((f, i) => (
                        <Stack direction="row" key={f.id} spacing={1} alignItems="center">
                            <TextField {...register(`tags.${i}.value`)} placeholder="Tag" size="small" fullWidth />
                            <IconButton onClick={() => remove(i)} aria-label="Remove tag">
                                <X size={16} />
                            </IconButton>
                        </Stack>
                    ))}
                </Stack>
            </Box>

            <TextField
                type="number"
                {...register('windowHours', { valueAsNumber: true })}
                label="Window (hours)"
                fullWidth
                size="small"
            />
        </Stack>
    );
}