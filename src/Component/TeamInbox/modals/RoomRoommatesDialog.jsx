// File: src/TeamInbox/modals/RoomRoommatesDialog.jsx
/* eslint react/prop-types: 0 */
import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  UserPlus,
  MessageCircle,
  Phone,
  Bell,
  BellOff,
  Crown,
  Trash2,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";

/**
 * RoomRoommatesDialog — rich, resilient roster modal
 * Terminology: room, roommates (no: member, group)
 *
 * Props
 * - open: boolean
 * - onClose: fn()
 * - roomId: string
 * - roommates: Array<{
 *     id, displayName, avatarUrl, role, availability,
 *     joinedAt|meta.joinedAt|since|meta.since, muted, isDefault, meta
 *   }>
 * - onRoomAction: fn(action: "invite"|"ping"|"call")
 * - onRoommateAction: fn(roommateId, action: "mute"|"unmute"|"make_default"|"unmake_default"|"remove")
 *
 * Notes:
 * - “Watcher” == muted roommate (muted === true).
 * - Role chip precedence: bot → “Bot”; else muted → “Watcher”; else agent → “Agent”; fallback “Agent”.
 */

export default function RoomRoommatesDialog({
  open,
  onClose,
  roomId,
  roommates = [],
  onRoomAction,
  onRoommateAction,
}) {
  const [menu, setMenu] = useState({ anchorEl: null, rm: null });

  const openMenu = (evt, rm) => setMenu({ anchorEl: evt.currentTarget, rm });
  const closeMenu = () => setMenu({ anchorEl: null, rm: null });

  const sorted = useMemo(() => {
    const arr = Array.isArray(roommates) ? roommates.slice(0) : [];
    // default first, then bots (keep together), then role, then name
    return arr.sort((a, b) => {
      if (!!a.isDefault !== !!b.isDefault) return a.isDefault ? -1 : 1;
      const abot = String(a.role || "").toLowerCase() === "bot";
      const bbot = String(b.role || "").toLowerCase() === "bot";
      if (abot !== bbot) return abot ? -1 : 1;
      const ra = (a.role || "").toLowerCase();
      const rb = (b.role || "").toLowerCase();
      if (ra !== rb) return ra < rb ? -1 : 1;
      const na = (a.displayName || "").toLowerCase();
      const nb = (b.displayName || "").toLowerCase();
      return na.localeCompare(nb);
    });
  }, [roommates]);

  // Validation
  const hasMissingId = (m) => !m?.id;
  const hasMissingName = (m) => !m?.displayName;

  // Chips / labels
  const roleLabel = (m) => {
    const r = String(m?.role || "").toLowerCase();
    if (r === "bot") return "Bot";
    if (m?.muted) return "Watcher";
    if (r === "agent") return "Agent";
    return "Agent";
  };

  const availLabel = (m) =>
    m?.availability ? String(m.availability).toLowerCase() : null;

  const formatSince = (m) => {
    const raw = m?.joinedAt || m?.since || m?.meta?.joinedAt || m?.meta?.since;
    if (!raw) return null;
    try {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return null;
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
    } catch { return null; }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Title row with actions aligned right */}
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Typography component="span" variant="h6" sx={{ fontWeight: 800 }}>
            Roommates
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Invite roommates" arrow>
              <span>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<UserPlus size={16} />}
                  onClick={() => onRoomAction?.("invite")}
                >
                  Invite
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Ping all roommates" arrow>
              <span>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<MessageCircle size={16} />}
                  onClick={() => onRoomAction?.("ping")}
                >
                  Ping
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Call room" arrow>
              <span>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Phone size={16} />}
                  onClick={() => onRoomAction?.("call")}
                >
                  Call
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent dividers>
        {sorted.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No roommates</Typography>
        ) : (
          <List dense disablePadding>
            {sorted.map((m) => {
              const displayName = m?.displayName || "Unknown roommate";
              const initials = displayName?.[0]?.toUpperCase?.() || "U";
              const since = formatSince(m);
              const isDefault = !!m?.isDefault;
              const isMuted = !!m?.muted;
              const role = roleLabel(m);
              const availability = availLabel(m);

              const showError = hasMissingId(m) || hasMissingName(m);
              const errText =
                hasMissingId(m) && hasMissingName(m)
                  ? "Missing id & name"
                  : hasMissingId(m)
                    ? "Missing id"
                    : hasMissingName(m)
                      ? "Missing name"
                      : "";

              return (
                <ListItem
                  key={(m.id || displayName) + String(m.role || "")}
                  sx={{
                    alignItems: "flex-start",
                    "& + .MuiListItem-root": { borderTop: (th) => `1px dashed ${th.palette.divider}` },
                  }}
                  secondaryAction={
                    <>
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mr: 0.5 }}>
                        {isDefault && (
                          <Tooltip title="Default roommate" arrow>
                            <Crown size={16} style={{ opacity: 0.9 }} />
                          </Tooltip>
                        )}
                        {showError && (
                          <Tooltip title="Some profile info is missing" arrow>
                            <AlertTriangle size={16} style={{ color: "#ef4444" }} />
                          </Tooltip>
                        )}
                      </Stack>
                      <IconButton edge="end" size="small" aria-label="More" onClick={(e) => openMenu(e, m)}>
                        <MoreVertical size={16} />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={m?.avatarUrl} sx={{ width: 36, height: 36 }}>
                      {initials}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap title={displayName}>
                          {displayName}
                        </Typography>

                        {/* Role / watcher / bot */}
                        <Chip size="small" label={role} variant="outlined" sx={{ height: 20 }} />

                        {/* Availability */}
                        {availability && (
                          <Chip size="small" label={availability} sx={{ height: 20 }} />
                        )}

                        {/* Since */}
                        {since && (
                          <Chip size="small" label={`since ${since}`} variant="outlined" sx={{ height: 20 }} />
                        )}

                        {/* Muted indicator (redundant to “Watcher”, but helpful) */}
                        {isMuted && (
                          <Chip
                            size="small"
                            label="muted"
                            variant="outlined"
                            sx={{ height: 20, textTransform: "lowercase" }}
                            icon={<BellOff size={14} />}
                          />
                        )}
                      </Stack>
                    }
                    secondary={
                      showError ? (
                        <Typography variant="caption" sx={{ color: "error.main" }}>
                          {errText}
                        </Typography>
                      ) : null
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>

      {/* Per-roommate menu */}
      <Menu
        open={!!menu.anchorEl}
        anchorEl={menu.anchorEl}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {menu.rm?.muted ? (
          <MenuItem onClick={() => { onRoommateAction?.(menu.rm?.id, "unmute"); closeMenu(); }}>
            <Bell size={16} style={{ marginRight: 8 }} /> Unmute watcher
          </MenuItem>
        ) : (
          <MenuItem onClick={() => { onRoommateAction?.(menu.rm?.id, "mute"); closeMenu(); }}>
            <BellOff size={16} style={{ marginRight: 8 }} /> Mute watcher
          </MenuItem>
        )}
        {menu.rm?.isDefault ? (
          <MenuItem onClick={() => { onRoommateAction?.(menu.rm?.id, "unmake_default"); closeMenu(); }}>
            <Crown size={16} style={{ marginRight: 8 }} /> Unmake default
          </MenuItem>
        ) : (
          <MenuItem onClick={() => { onRoommateAction?.(menu.rm?.id, "make_default"); closeMenu(); }}>
            <Crown size={16} style={{ marginRight: 8 }} /> Make default
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={() => { onRoommateAction?.(menu.rm?.id, "remove"); closeMenu(); }} style={{ color: "#dc2626" }}>
          <Trash2 size={16} style={{ marginRight: 8 }} /> Remove from room
        </MenuItem>
      </Menu>
    </Dialog>
  );
}
