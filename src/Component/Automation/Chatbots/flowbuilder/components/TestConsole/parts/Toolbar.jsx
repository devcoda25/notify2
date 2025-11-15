import React from 'react';
import {
    Box,
    Chip,
    Checkbox,
    FormControl,
    FormControlLabel,
    IconButton,
    MenuItem,
    Select,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import { Play, Pause, SkipForward, RotateCcw, Binary, Download } from 'lucide-react';

export default function Toolbar({
    channel, setChannel,
    status,
    onPlay, onPause, onStep, onRestart,
    onClearChat, onClearTrace,
    onToggleContext, onExportTrace,
    autoScroll, onAutoScrollChange,
}) {
    const CHANNELS = ['whatsapp', 'sms', 'email', 'push', 'voice', 'slack', 'teams', 'telegram'];
    const busy = status === 'running';

    const statusColors = {
        running: 'success',
        paused: 'warning',
        waiting: 'warning',
        idle: 'default',
        stopped: 'error'
    };

    return (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 0.5, borderBottom: 1, borderColor: 'divider' }}>
            <FormControl size="small" sx={{ minWidth: 110 }}>
                <Select value={channel} onChange={(e) => setChannel(e.target.value)} sx={{ fontSize: '0.8rem' }}>
                    {CHANNELS.map(ch => <MenuItem key={ch} value={ch} sx={{ fontSize: '0.8rem' }}>{ch.charAt(0).toUpperCase() + ch.slice(1)}</MenuItem>)}
                </Select>
            </FormControl>

            <Stack direction="row" spacing={0.25}>
                {status !== 'running' ? (
                    <Tooltip title="Play">
                        <span>
                            <IconButton size="small" onClick={onPlay} disabled={busy}><Play size={16} /></IconButton>
                        </span>
                    </Tooltip>
                ) : (
                    <Tooltip title="Pause">
                        <span>
                            <IconButton size="small" onClick={onPause} disabled={!busy}><Pause size={16} /></IconButton>
                        </span>
                    </Tooltip>
                )}
                <Tooltip title="Step (Not implemented)">
                    <span>
                        <IconButton size="small" onClick={onStep} disabled={true}><SkipForward size={16} /></IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Restart">
                    <span>
                        <IconButton size="small" onClick={onRestart}><RotateCcw size={16} /></IconButton>
                    </span>
                </Tooltip>
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" spacing={0.5} alignItems="center">
                <FormControlLabel
                    control={<Checkbox id="autoscroll" checked={autoScroll} onChange={(e) => onAutoScrollChange(e.target.checked)} size="small" />}
                    label={<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Auto-scroll</Typography>}
                    sx={{ mr: 0.5 }}
                />
                <Tooltip title="Toggle Context Editor">
                    <IconButton size="small" onClick={onToggleContext}><Binary size={16} /></IconButton>
                </Tooltip>
                 <Tooltip title="Export Trace">
                    <IconButton size="small" onClick={onExportTrace}><Download size={16} /></IconButton>
                </Tooltip>
            </Stack>

            <Chip
                size="small"
                label={status.toUpperCase()}
                color={statusColors[status] || 'default'}
                sx={{ ml: 1, minWidth: 70, fontSize: '0.7rem' }}
            />
        </Stack>
    );
}