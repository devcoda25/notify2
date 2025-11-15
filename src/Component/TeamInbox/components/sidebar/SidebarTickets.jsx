// /src/TeamInbox/components/sidebar/SidebarTickets.jsx
/* eslint react/prop-types: 0 */
import React, { useMemo, useCallback, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import { Building2, Users, User, Pin, BellOff, Plus, MoreVertical } from "lucide-react";

import {
  useRoomsStore,
  selectMyAvailability,
  selectMyAvailabilityPending,
} from "../../store/useRoomsStore.js";

/**
 * @typedef {{ id:string, title:string, division:'business'|'insider'|'personal',
 * unreadCount:number, pinned?:boolean, pinnedAt?:string, muted?:boolean,
 * lastMessagePreview?:{ text?:string, at?:string, from?:string },
 * updatedAt?:string, roommates?:Array<{id:string,displayName:string,avatarUrl?:string}> }} RoomTicket
 * @typedef {{ items: RoomTicket[], unreadTotal: number }} TicketList
 * @typedef {{
 *  business: TicketList,
 *  insider:  TicketList,
 *  personal: TicketList,
 * }} TicketsByDivision
 */

/**
 * @param {{
 *  tickets: TicketsByDivision,
 *  activeTicketId: string | null,
 *  onSelectTicket: (id:string) => void,
 *  onNewRoom?: () => void,
 *  onRoomAction?: (id:string, action:
 *     "view_members"|"create_ticket"|"pin"|"unpin"|"mute"|"unmute"|"rename"|"leave"|"delete") => void,
 *  collapsed?: boolean,
 *  showSearch?: boolean,
 * }} props
 */
export default function SidebarTickets(props) {
  const {
    tickets,
    activeTicketId,
    onSelectTicket,
    onNewRoom,
    onRoomAction,
    collapsed = false,
    showSearch = false,
  } = props;

  // Global (mirrored) presence (scoped to TeamInbox store)
  const rawAvailability = useRoomsStore(selectMyAvailability);
  const storePending = useRoomsStore(selectMyAvailabilityPending);

  // Normalize availability; if store hasn't provided a status yet, treat as pending.
  const availability = (rawAvailability || "").toLowerCase();
  const isPending = storePending || !availability;

  const presenceColor = useMemo(() => {
    return {
      available: "success.main",
      busy: "error.main",
      away: "warning.main",
      offline: "text.disabled",
    }[availability] || "text.disabled";
  }, [availability]);

  // Sort: pinned first; then by (pinnedAt||updatedAt) desc; then title asc.
  const sortRooms = useCallback((arr) => {
    return [...(arr || [])].sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      const ta = (a.pinnedAt || a.updatedAt || "") + "";
      const tb = (b.pinnedAt || b.updatedAt || "") + "";
      if (ta !== tb) return tb > ta ? 1 : -1;
      const na = (a.title || "").toLowerCase();
      const nb = (b.title || "").toLowerCase();
      return na.localeCompare(nb);
    });
  }, []);

  const DivIcon = { business: Building2, insider: Users, personal: User };

  const divisionMeta = [
    { key: "business", label: "Business", hint: "Client-facing rooms" },
    { key: "insider", label: "Insider", hint: "Internal company rooms" },
    { key: "personal", label: "Personal", hint: "Your self-chats & informal rooms" },
  ];

  // -------------------------- Collapsed (rail) mode --------------------------
  if (collapsed) {
    return (
      <Box
        component="nav"
        aria-label="Rooms"
        sx={{
          width: 64,
          flexShrink: 0,
          py: 1,
          px: 0.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 1,
          borderRight: (th) => `1px solid ${th.palette.divider}`,
        }}
      >
        {/* Status indicator */}
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ px: 1 }}>
          {isPending ? (
            <Box
              aria-label="Updating status…"
              sx={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: (th) => `2px solid ${th.palette.action.disabled}`,
                backgroundColor: (th) => th.palette.action.hover,
                boxShadow: (th) => `0 0 0 2px ${th.palette.action.focus}`,
              }}
            />
          ) : (
            <Box
              aria-label={`Status ${availability || "unknown"}`}
              sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: presenceColor }}
            />
          )}
        </Stack>

        {divisionMeta.map(({ key, label }) => {
          const Icon = DivIcon[key];
          const roomsSorted = sortRooms(tickets?.[key]?.items || []);
          const compact = roomsSorted.slice(0, 5);

          return (
            <Box key={key} sx={{ textAlign: "center" }}>
              <Tooltip title={label} arrow>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label={`${label} rooms`}
                    sx={{ border: (th) => `1px solid ${th.palette.divider}` }}
                  >
                    <Icon size={18} />
                  </IconButton>
                </Box>
              </Tooltip>

              <Stack spacing={0.5} alignItems="center">
                {compact.map((t) => {
                  const first = t.roommates?.[0];
                  const initials =
                    first?.displayName?.[0]?.toUpperCase?.() ||
                    t.title?.[0]?.toUpperCase?.() ||
                    "T";
                  const hasUnread = (t.unreadCount | 0) > 0;
                  return (
                    <Tooltip key={t.id} title={t.title || "Room"} arrow placement="right">
                      <Badge
                        color="primary"
                        overlap="circular"
                        variant={hasUnread ? "dot" : "standard"}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      >
                        <Avatar
                          alt={first?.displayName || t.title || "Room"}
                          src={first?.avatarUrl}
                          sx={{
                            width: 28,
                            height: 28,
                            fontSize: 12,
                            bgcolor: (th) => th.palette.grey[300],
                            color: (th) => th.palette.text.primary,
                            cursor: "default",
                          }}
                        >
                          {initials}
                        </Avatar>
                      </Badge>
                    </Tooltip>
                  );
                })}
              </Stack>
            </Box>
          );
        })}

        <Box sx={{ flexGrow: 1 }} />
      </Box>
    );
  }

  // -------------------------- Full sidebar --------------------------
  return (
    <Box
      component="nav"
      aria-label="Rooms"
      sx={{
        width: { xs: "100%", sm: 300, md: 320 },
        maxWidth: 400,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRight: (th) => `1px solid ${th.palette.divider}`,
        bgcolor: "background.paper",
      }}
    >
      {/* Header: "Rooms" + global "+" */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.25 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Rooms
          </Typography>

          {/* Availability indicator */}
          {isPending ? (
            <Box
              aria-label="Updating status…"
              sx={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: (th) => `2px solid ${th.palette.action.disabled}`,
                backgroundColor: (th) => th.palette.action.hover,
                boxShadow: (th) => `0 0 0 2px ${th.palette.action.focus}`,
              }}
            />
          ) : (
            <Box
              aria-label={`Status ${availability || "unknown"}`}
              sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: presenceColor }}
            />
          )}
        </Stack>

        {onNewRoom && (
          <Tooltip
            title={
              isPending
                ? "Updating your status…"
                : (availability === "available" ? "New room" : "You must be Available to create a room")
            }
            arrow
          >
            <span>
              <IconButton
                size="small"
                color="primary"
                onClick={() => onNewRoom?.()}
                aria-label="New room"
                disabled={isPending || availability !== "available"}
              >
                <Plus size={18} />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Stack>

      {showSearch && (
        <Box sx={{ px: 1.25, pb: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search rooms…"
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Box>
      )}

      <Divider />

      {/* Divisions with spacing + inter-division dividers */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {["business", "insider", "personal"].map((key, idx) => {
          const labels = {
            business: { label: "Business", hint: "Client-facing rooms" },
            insider: { label: "Insider", hint: "Internal company rooms" },
            personal: { label: "Personal", hint: "Your self-chats & informal rooms" },
          }[key];
          const Icon = { business: Building2, insider: Users, personal: User }[key];

          const roomsSorted = sortRooms(tickets?.[key]?.items || []);
          const unread = tickets?.[key]?.unreadTotal || 0;

          return (
            <Box key={key} sx={{ py: 1.25 }}>
              {/* Division header */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 1.25, pb: 0.5 }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Icon size={18} />
                  <Tooltip title={labels.hint} arrow disableInteractive>
                    <Typography
                      variant="overline"
                      sx={{ letterSpacing: 0.6, color: "text.secondary" }}
                    >
                      {labels.label}
                    </Typography>
                  </Tooltip>
                </Stack>

                <Chip
                  size="small"
                  color={unread ? "primary" : "default"}
                  variant={unread ? "filled" : "outlined"}
                  label={unread ? (unread > 99 ? "99+" : unread) : 0}
                  sx={{ height: 20 }}
                />
              </Stack>

              <TicketListView
                items={roomsSorted}
                activeId={activeTicketId}
                onSelect={onSelectTicket}
                onRoomAction={onRoomAction}
              />

              {idx < 2 && <Divider sx={{ my: 1 }} />}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

/* ------------------------------ Subcomponents ------------------------------ */

function TicketListView({ items, activeId, onSelect, onRoomAction }) {
  const [menu, setMenu] = useState({ anchorEl: null, room: null });

  const openMenu = (evt, room) => {
    evt.stopPropagation();
    setMenu({ anchorEl: evt.currentTarget, room });
  };
  const closeMenu = () => setMenu({ anchorEl: null, room: null });

  const emit = (action) => {
    const id = menu.room?.id;
    closeMenu();
    if (id && onRoomAction) onRoomAction(id, action);
  };

  if (!items || items.length === 0) {
    return (
      <Typography variant="body2" color="text.disabled" sx={{ px: 3.5, py: 1 }}>
        No rooms yet
      </Typography>
    );
  }

  return (
    <>
      <List dense disablePadding role="list">
        {items.map((t) => {
          const first = t.roommates?.[0];
          const initials =
            first?.displayName?.[0]?.toUpperCase?.() ||
            t.title?.[0]?.toUpperCase?.() ||
            "T";
          const isActive = t.id === activeId;
          const unread = t.unreadCount | 0;

          const secondary = t.lastMessagePreview?.text
            ? t.lastMessagePreview.text
            : t.lastMessagePreview?.from
              ? `${t.lastMessagePreview.from}: —`
              : "";

          return (
            <ListItemButton
              key={t.id}
              selected={isActive}
              onClick={() => onSelect?.(t.id)}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              aria-label={`Open room: ${t.title || "Untitled"}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect?.(t.id);
                }
              }}
              sx={{
                px: 1.25,
                py: 0.75,
                alignItems: "center",
                "&.Mui-selected": {
                  bgcolor: (th) => (th.palette.mode === "light" ? "primary.50" : "action.selected"),
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Avatar
                  src={first?.avatarUrl}
                  alt={first?.displayName || t.title || "Room"}
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: 12,
                    bgcolor: (th) => (isActive ? th.palette.primary.main : th.palette.grey[300]),
                    color: (th) => (isActive ? th.palette.primary.contrastText : th.palette.text.primary),
                  }}
                >
                  {initials}
                </Avatar>
              </ListItemIcon>

              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ fontWeight: isActive ? 700 : 600 }}
                      title={t.title}
                    >
                      {t.title || "Untitled"}
                    </Typography>
                    {t.pinned && (
                      <Tooltip title="Pinned" arrow>
                        <Box sx={{ display: "inline-flex", color: "text.secondary" }}>
                          <Pin size={14} />
                        </Box>
                      </Tooltip>
                    )}
                    {t.muted && (
                      <Tooltip title="Muted" arrow>
                        <Box sx={{ display: "inline-flex", color: "text.secondary" }}>
                          <BellOff size={14} />
                        </Box>
                      </Tooltip>
                    )}
                  </Stack>
                }
                secondary={
                  secondary ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      title={secondary}
                      sx={{ display: "block" }}
                    >
                      {secondary}
                    </Typography>
                  ) : null
                }
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, pl: 1 }}>
                {unread > 0 && (
                  <Chip
                    size="small"
                    color={isActive ? "primary" : "default"}
                    variant={isActive ? "filled" : "outlined"}
                    label={unread > 99 ? "99+" : unread}
                    sx={{ height: 22 }}
                  />
                )}
                {/* trailing more */}
                <IconButton
                  size="small"
                  aria-label="Room actions"
                  onClick={(e) => openMenu(e, t)}
                  edge="end"
                  sx={{ ml: 0.5 }}
                >
                  <MoreVertical size={16} />
                </IconButton>
              </Box>
            </ListItemButton>
          );
        })}
      </List>

      {/* Actions menu (presentational emit only) */}
      <Menu
        open={!!menu.anchorEl}
        anchorEl={menu.anchorEl}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => emit("view_members")}>View members</MenuItem>
        <MenuItem onClick={() => emit("create_ticket")}>Create ticket</MenuItem>
        <Divider />
        {menu.room?.pinned
          ? <MenuItem onClick={() => emit("unpin")}>Unpin</MenuItem>
          : <MenuItem onClick={() => emit("pin")}>Pin</MenuItem>}
        {menu.room?.muted
          ? <MenuItem onClick={() => emit("unmute")}>Unmute</MenuItem>
          : <MenuItem onClick={() => emit("mute")}>Mute</MenuItem>}
        <MenuItem onClick={() => emit("rename")}>Rename</MenuItem>
        <Divider />
        <MenuItem onClick={() => emit("leave")}>Leave room</MenuItem>
        <MenuItem onClick={() => emit("delete")} sx={{ color: "error.main" }}>
          Delete room
        </MenuItem>
      </Menu>
    </>
  );
}
