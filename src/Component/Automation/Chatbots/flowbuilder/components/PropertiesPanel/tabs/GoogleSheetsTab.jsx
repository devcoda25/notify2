import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
    Box,
    Button,
    Paper,
    Stack,
    Typography
} from '@mui/material';

export default function GoogleSheetsTab() {
    const { watch, setValue } = useFormContext();
    const accountId = watch('googleSheets.googleAccountId');

    const handleConnect = () => {
        alert('Connecting to Google Account...');
        setValue('googleSheets.googleAccountId', 'fake-account-id-123', { shouldDirty: true });
    };

    const handleDisconnect = () => {
        setValue('googleSheets.googleAccountId', null, { shouldDirty: true });
    }

    return (
        <Stack spacing={3} sx={{ p: 1 }}>
            <Paper variant="outlined">
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Google Spreadsheet</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                    <Stack spacing={1}>
                        <Typography variant="caption" color="text.secondary">Google Account</Typography>
                        {accountId ? (
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2">Connected as: <Typography component="span" sx={{ fontWeight: 600 }}>{accountId}</Typography></Typography>
                                <Button color="error" size="small" onClick={handleDisconnect}>Disconnect</Button>
                            </Stack>
                        ) : (
                            <Box>
                                <Button 
                                    variant="contained" 
                                    onClick={handleConnect} 
                                    sx={{ backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' } }}
                                >
                                    Add new Google Account
                                </Button>
                            </Box>
                        )}
                    </Stack>
                </Box>
            </Paper>
        </Stack>
    );
}