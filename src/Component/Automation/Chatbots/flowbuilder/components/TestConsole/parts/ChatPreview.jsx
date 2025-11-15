import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material';
import { FileText, Music, Video } from 'lucide-react';

function AttachmentPreview({ attachment }) {
    switch (attachment.type) {
        case 'image':
            return <Box component="img" src={attachment.url} alt={attachment.name || 'image'} sx={{ maxWidth: '100%', height: 'auto', borderRadius: 1 }} />;
        case 'video':
            return <Stack direction="row" spacing={1} alignItems="center"><Video size={16} /><Typography variant="caption">{attachment.name || 'video'}</Typography></Stack>;
        case 'audio':
            return <Stack direction="row" spacing={1} alignItems="center"><Music size={16} /><Typography variant="caption">{attachment.name || 'audio'}</Typography></Stack>;
        default:
            return <Stack direction="row" spacing={1} alignItems="center"><FileText size={16} /><Typography variant="caption">{attachment.name || 'file'}</Typography></Stack>;
    }
}

const channelStyles = {
    whatsapp: {
        backgroundColor: 'grey.100',
        // backgroundImage: 'url("https://i.imgur.com/G7aHhta.png")',
        userBg: '#dcf8c6',
        botBg: '#fff',
    },
    default: {
        backgroundColor: 'grey.100',
        userBg: 'primary.light',
        botBg: '#fff',
    }
}

export default function ChatPreview({ messages, channel, onUserReply, autoScroll = true }) {
    const scrollRef = useRef(null);
    const [text, setText] = useState('');

    const quickReplies = useMemo(() => {
        const lastBot = [...messages].reverse().find(m => m.from === 'bot');
        return lastBot?.actions?.buttons ?? [];
    }, [messages]);

    useEffect(() => {
        if (!autoScroll || !scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, autoScroll]);

    function send() {
        const val = text.trim();
        if (!val) return;
        onUserReply(val);
        setText('');
    }

    const theme = channelStyles[channel] || channelStyles.default;

    return (
        <Stack sx={{ height: '100%' }}>
            <Box
                ref={scrollRef}
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 2,
                    backgroundImage: theme.backgroundImage,
                    backgroundColor: theme.backgroundColor,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Stack spacing={1.5}>
                    {messages.map((msg) => (
                        <Box
                            key={msg.id}
                            sx={{
                                display: 'flex',
                                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 1,
                                    maxWidth: '80%',
                                    bgcolor: msg.from === 'user' ? theme.userBg : theme.botBg,
                                    borderRadius: 2,
                                }}
                            >
                                {msg.text && <Typography variant="body2" dangerouslySetInnerHTML={{ __html: msg.text }} />}

                                {msg.attachments && msg.attachments.length > 0 && (
                                    <Stack spacing={1} sx={{ mt: 1 }}>
                                        {msg.attachments.map(a => (
                                            <Chip key={a.id} label={<AttachmentPreview attachment={a} />} size="small" />
                                        ))}
                                    </Stack>
                                )}

                                {msg.actions?.buttons && msg.actions.buttons.length > 0 && (
                                    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                                        {(msg.actions.buttons ?? []).map(b => 
                                            <Button key={b.id} size="small" variant="outlined" onClick={() => onUserReply(b.label)} sx={{ textTransform: 'none' }}>
                                                {b.label}
                                            </Button>
                                        )}
                                    </Stack>
                                )}
                            </Paper>
                        </Box>
                    ))}
                </Stack>
            </Box>

            {channel !== 'voice' && (
                <Stack direction="row" spacing={1} sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                        placeholder="Type a reply…"
                        fullWidth
                        size="small"
                        variant="outlined"
                    />
                    <Button onClick={send} variant="contained">Send</Button>
                </Stack>
            )}
        </Stack>
    );
}