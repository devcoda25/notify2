import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    Stack,
    Typography
} from '@mui/material';

export default function VoicePreview({ ttsText }) {
    const [voices, setVoices] = useState([]);
    const [voiceIdx, setVoiceIdx] = useState(0);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);

    useEffect(() => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        function populate() {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            const defaultVoiceIndex = availableVoices.findIndex(v => v.default);
            setVoiceIdx(defaultVoiceIndex > -1 ? defaultVoiceIndex : 0);
        }
        populate();
        window.speechSynthesis.onvoiceschanged = populate;
        return () => { window.speechSynthesis.onvoiceschanged = null; };
    }, []);

    useEffect(() => {
        if (!ttsText || typeof window === 'undefined' || !('speechSynthesis' in window) || voices.length === 0) return;
        const u = new SpeechSynthesisUtterance(ttsText);
        u.voice = voices[voiceIdx];
        u.rate = rate;
        u.pitch = pitch;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
    }, [ttsText, voices, voiceIdx, rate, pitch]);

    const canSpeak = useMemo(() => typeof window !== 'undefined' && 'speechSynthesis' in window, []);

    if (!canSpeak) {
        return <Typography sx={{ p: 2, color: 'text.secondary' }}>Web Speech not supported in this browser.</Typography>;
    }

    return (
        <Stack spacing={2} sx={{ p: 2 }}>
            <Stack spacing={3}>
                <FormControl fullWidth size="small">
                    <InputLabel>Voice</InputLabel>
                    <Select value={voiceIdx} label="Voice" onChange={(e) => setVoiceIdx(Number(e.target.value))}>
                        {voices.map((v, i) => <MenuItem key={v.name + i} value={i}>{v.name} ({v.lang})</MenuItem>)}
                    </Select>
                </FormControl>
                <Box>
                    <Typography gutterBottom>Rate ({rate.toFixed(1)})</Typography>
                    <Slider value={rate} min={0.5} max={1.5} step={0.1} onChange={(e, newValue) => setRate(newValue)} />
                </Box>
                <Box>
                    <Typography gutterBottom>Pitch ({pitch.toFixed(1)})</Typography>
                    <Slider value={pitch} min={0.5} max={1.5} step={0.1} onChange={(e, newValue) => setPitch(newValue)} />
                </Box>
            </Stack>
            <Typography variant="caption" color="text.secondary" align="center" sx={{ pt: 2 }}>
                Last bot message is spoken automatically.
            </Typography>
        </Stack>
    );
}