import React, { useEffect, useMemo, useState } from 'react';
import { Box, IconButton, Typography, Paper, Tabs, Tab } from '@mui/material';
import { X } from 'lucide-react';
import { nanoid } from 'nanoid';

import Toolbar from './parts/Toolbar';
import ChatPreview from './parts/ChatPreview';
import VoicePreview from './parts/VoicePreview';
import TracePanel from './parts/TracePanel';
import ContextEditor from './parts/ContextEditor';

const DEFAULT_CHANNEL = 'whatsapp';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`console-tabpanel-${index}`}
            aria-labelledby={`console-tab-${index}`}
            sx={{ flexGrow: 1, overflowY: 'auto' }}
            {...other}
        >
            {value === index && <Box sx={{ p: 1.5 }}>{children}</Box>}
        </Box>
    );
}

export default function TestConsole({
    isOpen,
    onClose,
    engine,
    initialChannel = DEFAULT_CHANNEL,
    initialContext,
    flowId,
}) {
    const [channel, setChannel] = useState(initialChannel);
    const [status, setStatus] = useState('idle');
    const [messages, setMessages] = useState([]);
    const [trace, setTrace] = useState([]);
    const [showContext, setShowContext] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!engine) return;
        const onBot = (msg) => setMessages((m) => m.concat({ ...msg, id: msg.id || nanoid(), from: 'bot' }));
        const onTrace = (evt) => setTrace((t) => t.concat(evt));
        const onStatus = (st) => setStatus(st);

        const unsubBot = engine.on('botMessage', onBot);
        const unsubTrace = engine.on('trace', onTrace);
        const unsubStatus = engine.on('status', onStatus);

        if (isOpen) {
            engine.start(flowId);
        } else {
            engine.stop();
        }

        return () => {
            unsubBot();
            unsubTrace();
            unsubStatus();
        };
    }, [engine, flowId, isOpen]);

    useEffect(() => {
        if (engine) engine.configure({ channel });
    }, [channel, engine]);

    const lastBotText = useMemo(() => {
        const b = [...messages].reverse().find(m => m.from === 'bot');
        return b?.text;
    }, [messages]);

    function sendUserReply(text) {
        const msg = { id: nanoid(), from: 'user', text };
        setMessages((m) => m.concat(msg));
        engine?.pushUserInput(text);
    }

    const onRestart = () => {
        engine?.reset?.();
        engine?.start(flowId);
        setMessages([]);
        setTrace([]);
    };

    const onExportTrace = () => {
        const blob = new Blob([JSON.stringify(trace, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'trace.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Paper
            elevation={8}
            sx={{
                position: 'fixed',
                right: 10, // Added margin
                bottom: 16, // Added margin
                width: '40vw',
                height: '85vh',
                display: isOpen ? 'flex' : 'none',
                flexDirection: 'column',
                overflow: 'hidden',
                borderTopLeftRadius: 2,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                zIndex: 1300, // Ensure it's above most content
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700 }}>Test Console</Typography>
                <IconButton onClick={onClose} aria-label="Close"><X size={18} /></IconButton>
            </Box>

            <Toolbar channel={channel} setChannel={setChannel} status={status} onPlay={() => engine.start()} onPause={() => engine.stop()} onStep={() => {}} onRestart={onRestart} onClearChat={() => setMessages([])} onClearTrace={() => setTrace([])} onToggleContext={() => setShowContext((v) => !v)} onExportTrace={onExportTrace} autoScroll={autoScroll} onAutoScrollChange={setAutoScroll} />

            <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="fullWidth">
                    <Tab label="Preview" id="console-tab-0" />
                    <Tab label="Trace" id="console-tab-1" />
                </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
                <Box sx={{ display: 'grid', gridTemplateColumns: showContext ? '1fr 300px' : '1fr', height: '100%', gap: 1.5 }}>
                    <Paper variant="outlined" sx={{ overflow: 'hidden', height: '100%' }}>
                        {channel === 'voice' ? (
                            <VoicePreview ttsText={lastBotText} />
                        ) : (
                            <ChatPreview messages={messages} channel={channel} onUserReply={sendUserReply} autoScroll={autoScroll} />
                        )}
                    </Paper>
                    {showContext && (
                        <ContextEditor initial={initialContext} onApply={(ctx) => { engine.reset(); engine.configure({ channel, ...ctx }); engine.start(flowId); }} />
                    )}
                </Box>
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
                <TracePanel trace={trace} onClear={() => setTrace([])} />
            </TabPanel>
        </Paper>
    );
}