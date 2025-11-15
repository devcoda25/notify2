import React, { useMemo } from 'react';
import { SECTION_DATA } from './sections-data';
import * as LucideIcons from 'lucide-react';
import {
    Box,
    Grid,
    Paper,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';

export default function SidebarPalette({
    onDragStart,
    onItemClick,
    filterChannels,
}) {

    const allItems = useMemo(() => {
        let items = SECTION_DATA.flatMap(sec => sec.items);
        if (!filterChannels || filterChannels.length === 0) return items;

        const allowed = new Set(filterChannels);
        return items.filter((it) => !it.channels || it.channels.some((c) => allowed.has(c)));
    }, [filterChannels]);

    function toPayload(it) {
        return {
            key: it.key,
            label: it.label,
            icon: it.icon,
            type: it.type,
            color: it.color,
            description: it.description,
            content: it.content,
            quickReplies: it.quickReplies,
        };
    }

    function handleDragStart(e, item) {
        const payload = toPayload(item);
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('application/x-flow-node', JSON.stringify(payload));
        e.dataTransfer.setData('text/plain', item.label);
        onDragStart?.(e, payload);
    }

    function handleItemClick(item) {
        const payload = toPayload(item);
        onItemClick?.(payload);
    }

    return (
        <Stack component="nav" spacing={2} aria-label="Node palette">
            {SECTION_DATA.map(section => {
                const sectionItems = section.items.filter(item => allItems.some(ai => ai.key === item.key));
                if (sectionItems.length === 0) return null;

                return (
                    <Box key={section.key}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1, px: 1, color: 'black' }}>
                            {section.title}
                        </Typography>
                        <Grid container spacing={1}>
                            {sectionItems.map(item => {
                                const Icon = typeof item.icon === 'string' ? LucideIcons[item.icon] ?? LucideIcons.HelpCircle : item.icon;
                                
                                return (
                                     <Grid item xs={6} key={item.key}>
                                        <Tooltip title={`${item.label}${item.description ? ` - ${item.description}` : ''}`} placement="top">
                                            <Paper
                                                variant="outlined"
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, item)}
                                                onClick={() => handleItemClick(item)}
                                                aria-label={`Add ${item.label}`}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: 70,
                                                    // width: 70,
                                                    textAlign: 'center',
                                                    p: 1,
                                                    cursor: 'grab',
                                                    userSelect: 'none',
                                                    transition: (theme) => theme.transitions.create(['box-shadow', 'border-color']),
                                                    '&:hover': {
                                                        boxShadow: 2,
                                                        borderColor: 'primary.light'
                                                    },
                                                    '&:active': {
                                                        cursor: 'grabbing',
                                                        transform: 'scale(0.98)'
                                                    }
                                                }}
                                            >
                                                <Box sx={{
                                                    width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center',
                                                    color: '#6f3cff',
                                                    mb: 0.5
                                                }}>
                                                    <Icon size={20} />
                                                </Box>
                                                <Typography sx={{ fontSize: '0.6rem', fontWeight: 500, lineHeight: 1.2, color: 'black' }}>
                                                    {item.label}
                                                </Typography>
                                            </Paper>
                                        </Tooltip>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                );
            })}
        </Stack>
    );
}
