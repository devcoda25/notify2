import React, { useCallback, useMemo } from 'react';
import { usePresence, useAwarenessStates } from '../../presence/PresenceProvider';
import { useViewport } from 'reactflow';
import { Box, Typography } from '@mui/material';

export default function LiveCursors({ staleMs = 15000 }) {
    const { self } = usePresence();
    const { x: viewX, y: viewY, zoom } = useViewport();

    const mapFn = useCallback((s) => (s.user && s.user.id !== self.id ? s : null), [self.id]);
    const others = useAwarenessStates(mapFn);

    const fresh = useMemo(() => {
        const now = Date.now();
        return others.filter((s) => !!s.cursor && now - (s.cursor.ts || 0) <= staleMs);
    }, [others, staleMs]);

    return (
        <>
            {fresh.map((s) => {
                if (!s.cursor || !s.user) return null;
                const { x, y } = s.cursor;
                const sx = viewX + x * zoom;
                const sy = viewY + y * zoom;
                const color = s.user.color;

                return (
                    <Box
                        key={s.user.id}
                        sx={{
                            position: 'absolute',
                            zIndex: 100,
                            pointerEvents: 'none',
                            transform: `translate(${sx}px, ${sy}px)`,
                            transition: 'transform 0.1s linear',
                        }}
                    >
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                boxShadow: '0 0 0 2px white, 0 0 4px 2px rgba(0,0,0,0.3)',
                                backgroundColor: color,
                            }}
                        />
                        <Typography
                            component="span"
                            sx={{
                                position: 'absolute',
                                left: 12,
                                top: -2,
                                fontSize: 12,
                                lineHeight: 1,
                                p: '4px 8px',
                                borderRadius: '6px',
                                boxShadow: '0 1px 6px rgba(0,0,0,.15)',
                                whiteSpace: 'nowrap',
                                fontWeight: 600,
                                backgroundColor: color,
                                color: '#fff',
                            }}
                        >
                            {s.user.name}
                        </Typography>
                    </Box>
                );
            })}
        </>
    );
}