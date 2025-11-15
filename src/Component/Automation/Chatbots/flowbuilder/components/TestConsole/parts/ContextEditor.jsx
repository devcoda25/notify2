import React, { useMemo, useState } from 'react';
import {
    Box,
    Button,
    Stack,
    TextField,
    Typography
} from '@mui/material';

export default function ContextEditor({
    initial,
    onApply
}) {
    const [text, setText] = useState(() => JSON.stringify(initial ?? {}, null, 2));
    const [err, setErr] = useState(null);

    const valid = useMemo(() => {
        try { JSON.parse(text); return true; } catch { return false; }
    }, [text]);

    function apply() {
        try {
            const json = JSON.parse(text);
            onApply(json);
            setErr(null);
        } catch (e) {
            setErr(e?.message || 'Invalid JSON');
        }
    }

    return (
        <Stack spacing={1} sx={{ p: 1, backgroundColor: 'grey.50', borderRadius: 1, border: 1, borderColor: 'divider', height: '100%' }}>
            <TextField
                multiline
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
                sx={{ flexGrow: 1, '& .MuiInputBase-root': { height: '100%' }, '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: 12 } }}
            />
            <Stack direction="row" spacing={1} alignItems="center">
                <Button size="small" onClick={apply} disabled={!valid} variant="contained">Apply</Button>
                <Typography variant="caption" color={err ? 'error' : 'text.secondary'}>
                    {err ? `Error: ${err}` : 'Context affects evaluation of conditions & variables.'}
                </Typography>
            </Stack>
        </Stack>
    );
}