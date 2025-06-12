import React, { useState } from 'react';
import { IconButton, Box, Chip, Avatar, AvatarGroup, Typography, Checkbox, Tooltip, List, ListItem, Popover, ListItemAvatar, ListItemText } from '@mui/material';
import { FlagIcon } from '../Icon';

const TicketsCard = ({
    title,
    checkboxLabel,
    status,
    subStatus,
    statusBgColor,
    statusColor,
    subStatusColor,
    flagColor,
    flagBgColor,
    avatars,
    count,
    description,
    createdDate,
    updatedDate,
    createdAgo,
    updatedAgo,
    users
}) => {

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return (
        <Box sx={{ background: '#F8F8F8', border: '1px solid #ccc', borderRadius: '8px', padding: '10px 20px', margin: '10px 0px' }}>
            <Popover

                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ padding: '2px 10px' }}>
                    <List sx={{ p: 0 }}>
                        {avatars.map((avatar, idx) => (
                            <ListItem key={idx}>
                                <ListItemAvatar>
                                    <Avatar src={avatar.src}></Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={avatar.name} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Popover>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
                <Box display="flex" flexDirection="column" gap={0.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontWeight="bold" variant="subtitle1">
                            {title}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <Checkbox size="small" />
                        <Typography variant="caption" color="text.disabled">
                            {checkboxLabel}
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mt={{ xs: 2, sm: 0 }} sx={{ cursor: 'pointer' }}>
                    <Chip label={status} size="small" sx={{ backgroundColor: statusBgColor, color: statusColor, p: '4px 6px', border: `1px solid ${statusColor}` }} />
                    <IconButton sx={{ border: `1px solid ${flagColor}`, width: '30px', height: '30px', background: flagBgColor, color: flagColor }}>
                        <FlagIcon fontSize="small" />
                    </IconButton>
                    <Chip label={subStatus} size="small" sx={{ backgroundColor: subStatusColor, color: '#fff', p: '4px 6px' }} />
                    <Box display="flex" alignItems="center" sx={{ pl: '4px' }} onClick={handleClick}>
                        <AvatarGroup max={3}>
                            {avatars.map((avatar, idx) => (
                                <Tooltip key={idx} title={avatar.name}>
                                    <Avatar
                                        src={avatar.src}
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            zIndex: avatars.length - idx,
                                            ml: idx === 0 ? 0 : '-12px',
                                            border: '2px solid white',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                zIndex: 100
                                            }
                                        }}
                                    />
                                </Tooltip>
                            ))}
                        </AvatarGroup>
                    </Box>
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            fontSize: 14,
                            bgcolor: '#0897FF',
                            color: '#fff',
                        }}
                    >
                        {count}
                    </Avatar>
                </Box>
            </Box>

            <Box mt={1} p={1.2} bgcolor="white" borderRadius={2}>
                <Typography variant="body2" color="#595959">{description}</Typography>
            </Box>

            <Box mt={2} display="flex" justifyContent="space-between" flexWrap="wrap">
                <Box display="flex" gap={3}>
                    {users.map((user, idx) => (
                        <Box key={idx} display="flex" alignItems="center" gap={1}>
                            <Avatar src={user.avatar} sx={{ width: 36, height: 36 }} />
                            <Box display="flex" flexDirection="column">
                                <Typography variant="caption" fontWeight="bold" fontSize={13}>{user.name}</Typography>
                                <Typography variant="caption" color="text.secondary" fontSize={12}>{user.role}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Box textAlign="right" mt={{ xs: 2, sm: 0 }}>
                    <Typography variant="caption" fontSize={12}>
                        Created : <strong>{createdDate}</strong> ({createdAgo})
                    </Typography>
                    <br />
                    <Typography variant="caption" fontSize={12}>
                        <strong style={{ color: '#1976d2' }}>Last Update : {updatedDate}</strong> ({updatedAgo})
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
export default TicketsCard;