import React from 'react';
import { useCredentialVault } from '../../cred/useCredentials.jsx';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from '@mui/material';

export default function CredentialSelector({
    value,
    onChange,
    allowManage = true,
    label = 'Credential'
}) {
    const { credentials, openVault } = useCredentialVault();

    return (
        <Box sx={{ display: 'grid', gap: 0.75 }}>
            <InputLabel sx={{ fontSize: 12, color: 'text.secondary' }}>{label}</InputLabel>
            <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                <FormControl fullWidth size="small">
                    <Select
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value || undefined)}
                        displayEmpty
                    >
                        <MenuItem value=""><em>— None —</em></MenuItem>
                        {credentials.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                                {c.name} ({c.type})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {allowManage && (
                    <Button variant="outlined" onClick={openVault} type="button" size="small">
                        Manage…
                    </Button>
                )}
            </Box>
        </Box>
    );
}
