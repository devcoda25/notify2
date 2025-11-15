import React, { useCallback, useMemo } from 'react';
import { useAwarenessStates, usePresence } from '../../presence/PresenceProvider';
import { initials } from '../../presence/color';
import { Avatar, AvatarGroup, Tooltip } from '@mui/material';

export default function NodeAvatars({ nodeId, max = 3 }) {
    const { self } = usePresence();

    const mapFn = useCallback((s) => {
        if (!s.user || s.user.id === self.id || s.selection?.nodeId !== nodeId) {
            return null;
        }
        return { id: s.user.id, name: s.user.name, color: s.user.color };
    }, [self.id, nodeId]);

    const users = useAwarenessStates(mapFn);

    if (users.length === 0) return null;

    return (
        <AvatarGroup
            max={max}
            sx={{
                position: 'absolute',
                top: -12,
                right: -12,
                flexDirection: 'row-reverse',
                '& .MuiAvatar-root': {
                    width: 24,
                    height: 24,
                    fontSize: 10,
                    fontWeight: 800,
                    border: '2px solid white',
                    marginLeft: -1, // Overlap avatars
                },
            }}
        >
            {users.map((u) => (
                <Tooltip title={u.name} key={u.id}>
                    <Avatar sx={{ bgcolor: u.color }}>
                        {initials(u.name)}
                    </Avatar>
                </Tooltip>
            ))}
        </AvatarGroup>
    );
}