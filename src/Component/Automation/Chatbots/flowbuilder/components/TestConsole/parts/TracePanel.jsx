import React, { useMemo, useState } from 'react';
import {
    Box,
    FormControl,
    InputAdornment,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { Search } from 'lucide-react';

export default function TracePanel({ trace, onClear }) {
    const [q, setQ] = useState('');
    const [typeFilter, setTypeFilter] = useState('all-types');

    const types = useMemo(() => {
        const s = new Set(trace.map(t => t.type).filter(Boolean));
        return ['all-types', ...Array.from(s)];
    }, [trace]);

    const filtered = useMemo(() => trace.filter(t => {
        if (typeFilter && typeFilter !== 'all-types' && t.type !== typeFilter) return false;
        if (!q) return true;
        const line = `${t.type} ${t.nodeId ?? ''} ${t.nodeLabel ?? ''} ${t.result ?? ''} ${JSON.stringify(t.data ?? {})}`.toLowerCase();
        return line.includes(q.toLowerCase());
    }), [trace, q, typeFilter]);

    return (
        <Stack sx={{ height: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search trace…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment>,
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        {types.map(t => <MenuItem key={t} value={t}>{t === 'all-types' ? 'All types' : t}</MenuItem>)}
                    </Select>
                </FormControl>
            </Stack>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1, fontFamily: 'monospace', fontSize: 12 }}>
                {filtered.length === 0 && <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', p: 2 }}>No trace events.</Typography>}
                {filtered.map((line, idx) => (
                    <Stack key={idx} direction="row" spacing={1} sx={{ color: line.type === 'error' ? 'error.main' : 'text.primary' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{new Date(line.ts).toLocaleTimeString()}</Typography>
                        {line.nodeId && <Typography variant="caption" sx={{ color: 'primary.main' }}>[{line.nodeId}{line.nodeLabel ? ` • ${line.nodeLabel}` : ''}]</Typography>}
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{line.type}</Typography>
                        {line.result && <Typography variant="caption" sx={{ whiteSpace: 'pre-wrap' }}>— {line.result}</Typography>}
                    </Stack>
                ))}
            </Box>
        </Stack>
    );
}