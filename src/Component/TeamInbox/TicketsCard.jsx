import React, { useState } from "react";
import {
  IconButton,
  Box,
  Chip,
  Avatar,
  AvatarGroup,
  Typography,
  Tooltip,
  List,
  ListItem,
  Popover,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { FlagIcon } from "../Icon";

const TicketsCard = ({
  id,
  isActive,
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
  logo,
  count,
  description,
  createdDate,
  updatedDate,
  createdAgo,
  updatedAgo,
  users,
  handleOpenChat,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    handleOpenChat(id);
  };

  const open = Boolean(anchorEl);

  return (
    <Box
      onClick={handleOpen}
      sx={{
        background: "#F8F8F8",
        border: isActive ? "1px solid #1976d2" : "1px solid #ccc",
        borderRadius: "10px",
        padding: "8px",
        margin: "8px 0",
        minWidth: { xs: '100%', sm: '280px', md:'280px', lg:'280px', xl:'280px' },
        maxWidth: "100%",
        transition: "all 0.3s ease-in-out",
        boxShadow: isActive ? "0 4px 12px rgba(25, 118, 210, 0.3)" : "0 2px 6px rgba(0,0,0,0.05)",
        fontSize: '14px',
        color: '#000000',
        
      }}
    >
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ padding: "4px 4px" ,
          fontSize: '20px',
        }}>
          <List sx={{ p: 0 }}>
            {avatars.map((avatar, idx) => (
              <ListItem key={idx}>
                <ListItemAvatar>
                  <Avatar src={avatar.src} />
                </ListItemAvatar>
                <ListItemText primary={avatar.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>

      {/* Top Row */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={1}
      >
        {/* Left */}
        <Box display="flex" flexDirection="column" gap={0.5} >
          <Typography fontWeight="bold" variant="body2" fontSize={12} sx={{ color: '#000000' }}>
            {title}
          </Typography>

          <Box display="flex" alignItems="center" gap={0.5}>
            <img height="14px" width="14px" src={logo[0].src} alt="wplogo" />
            <Typography variant="caption" color="text.disabled" fontSize={12} >
              {logo[0].logo_name}
            </Typography>
          </Box>
        </Box>

        {/* Right */}
        <Box
          display="flex"
          alignItems="center"
          gap={0.5}
          mt={{ xs: 1, sm: 0 }}
          sx={{ cursor: "pointer" }}
        >
          <Chip
            label={status}
            size="small"
            sx={{
              backgroundColor: statusBgColor,
              color: statusColor,
              px: 1,
              fontSize: "11px",
              border: `1px solid ${statusColor}`,
            }}
          />
          <IconButton
            sx={{
              border: `1px solid ${flagColor}`,
              width: "28px",
              height: "28px",
              background: flagBgColor,
              color: flagColor,
            }}
          >
            <FlagIcon fontSize="small" />
          </IconButton>
          <Chip
            label={subStatus}
            size="small"
            sx={{
              backgroundColor: subStatusColor,
              color: "#fff",
              px: 1,
              fontSize: "11px",
            }}
          />
          <Box display="flex" alignItems="center" onClick={handleClick}>
            {avatars.length > 0 && (
              <Tooltip title={avatars[0].name}>
                <Avatar
                  src={avatars[0].src}
                  sx={{
                    width: 28,
                    height: 28,
                    border: "2px solid white",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Tooltip>
            )}
          </Box>

          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: 12,
              bgcolor: "#0897FF",
              color: "#fff",
            }}
          >
            {count}
          </Avatar>
        </Box>
      </Box>

      {/* Description */}
      <Box mt={1} p={1} bgcolor="white" borderRadius={2}>
        <Typography variant="body2"  sx={{ fontSize: '12px' }}>
          {description}
        </Typography>
      </Box>

      {/* Bottom section */}
      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
      >
        <Box display="flex" gap={1}>
          {users.map((user, idx) => (
            <Box
              key={idx}
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{ minWidth: "120px" }}
            >
              <Avatar src={user.avatar} sx={{ width: 28, height: 28 }} />
              <Box display="flex" flexDirection="column">
                <Typography variant="caption" fontWeight="bold" fontSize={11}>
                  {user.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontSize={10}
                >
                  {user.role}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box textAlign="left" mt={{ xs: 1, sm: 0 }}>
          <Typography variant="caption" fontSize={10}>
            Created: <strong>{createdDate}</strong> ({createdAgo})
          </Typography>
          <br />
          <Typography variant="caption" fontSize={10}>
            <strong style={{ color: "#1976d2" }}>
              Last Update: {updatedDate}
            </strong>{" "}
            ({updatedAgo})
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketsCard;