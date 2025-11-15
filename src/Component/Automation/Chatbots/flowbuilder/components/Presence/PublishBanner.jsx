import React, { useCallback } from 'react';
import { useAwarenessStates } from '../../presence/PresenceProvider';
import { Paper, Typography } from '@mui/material';

export default function PublishBanner() {
    const mapFn = useCallback((s) => (s.publishInProgress ? s : null), []);
    const states = useAwarenessStates(mapFn);

    if (states.length === 0) return null;

    const names = states.map((s) => s.user?.name).filter(Boolean);
    const label = names.length === 1
        ? `${names[0]} is publishing… 🕒`
        : `${names[0]} and ${names.length - 1} more are publishing… 🕒`;

    return (
        <Paper
            elevation={2}
            square
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 'appBar', // Use theme zIndex
                textAlign: 'center',
                p: '6px 8px',
                backgroundColor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {label}
            </Typography>
        </Paper>
    );
}