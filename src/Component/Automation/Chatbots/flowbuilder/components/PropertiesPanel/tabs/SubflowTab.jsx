import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { ChevronDown } from 'lucide-react';

export default function SubflowTab() {
    const { register } = useFormContext();

    return (
        <Stack spacing={3} sx={{ p: 1 }}>
            <TextField
                {...register('targetFlowId')}
                label="Target Sub-flow ID"
                fullWidth
                size="small"
            />

            <Accordion sx={{ border: 1, borderColor: 'divider', boxShadow: 'none', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                    <Typography variant="subtitle2">Variable Mapping</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                        Map variables to pass into the sub-flow (coming soon).
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Stack>
    );
}