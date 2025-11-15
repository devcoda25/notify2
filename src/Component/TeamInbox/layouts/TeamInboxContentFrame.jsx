// src/TeamInbox/layouts/TeamInboxContentFrame.jsx
// 3-pane responsive content frame for TeamInbox — Sidebar simplifies to flat Rooms; global "+" in sidebar header.

import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  Box,
  Divider,
  IconButton,
  Toolbar,
  AppBar,
  Typography,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ChevronLeft } from "lucide-react";

/* hooks */
import useRooms from "../hooks/useRooms";
import useTickets from "../hooks/useTickets";
import useChat from "../hooks/useChat";
import useWs from "../hooks/useWs";
import useComposer from "../hooks/useComposer";
import { useTeamInboxStore } from "../store/useTeamInboxStore";

/* stores */
import { useRoomsStore } from "../store/useRoomsStore";
// OPTIONAL: if your tickets store exposes active ticket selection, we mirror to it.
import { useTicketsStore } from "../store/useTicketsStore";

/* constants */
import { CHANNELS } from "../constants/CHANNELS";

/* presentational */
import SidebarRooms from "../components/sidebar/SidebarTickets.jsx";
import TicketsHeader from "../components/tickets/TicketsHeader.jsx";
import TicketsVirtualList from "../components/tickets/TicketsVirtualList.jsx";
import TicketsListEmpty from "../components/tickets/TicketsListEmpty.jsx";
import ChatPane from "../components/chat/ChatPane.jsx";
import Composer from "../components/composer/Composer.jsx";
import EmptyChatState from "../components/chat/EmptyChatState.jsx";

/* dialogs */
import NewRoomDialog from "../modals/NewRoomDialog.jsx";
import NewTicketDialog from "../components/tickets/NewTicketDialog.jsx";
import FiltersDialog from "../components/filters/FiltersDialogue.jsx";
import RoomRoommatesDialog from "../modals/RoomRoommatesDialog.jsx";

/* API facade */
import { apiService as api } from "../services/api.service.js";

/* dev safety */
function assertComponent(fn, name) {
  if (typeof fn !== "function") {
    console.error(`[TeamInbox] Bad component import: ${name}`, fn);
    throw new Error(`Component "${name}" is not a function. Check its export.`);
  }
}
[
  ["SidebarRooms", SidebarRooms],
  ["TicketsHeader", TicketsHeader],
  ["TicketsVirtualList", TicketsVirtualList],
  ["TicketsListEmpty", TicketsListEmpty],
  ["ChatPane", ChatPane],
  ["Composer", Composer],
  ["EmptyChatState", EmptyChatState],
  ["NewRoomDialog", NewRoomDialog],
  ["NewTicketDialog", NewTicketDialog],
  ["FiltersDialog", FiltersDialog],
  ["RoomRoommatesDialog", RoomRoommatesDialog],
].forEach(([n, c]) => assertComponent(c, n));

export default function TeamInboxContentFrame() {
  useWs();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });

  // Rooms + unread counters
  const { groups, activeRoomId, setActiveRoom, transportStatus, unreadTotal } = useRooms();

  // UI store: sidebar toggle + global activeTicketId (single source of truth)
  const {
    isSidebarOpen,
    setSidebarOpen,
    activeTicketId,
    setActiveTicket,
  } = useTeamInboxStore((s) => ({
    isSidebarOpen: s.sidebarOpen,
    setSidebarOpen: s.setSidebarOpen,
    activeTicketId: s.activeTicketId,
    setActiveTicket: s.setActiveTicket,
  }));

  // Mirror global activeTicketId into the tickets store (for useChat & others)
  useEffect(() => {
    try {
      useTicketsStore.getState().setActiveTicket?.(activeTicketId || null);
    } catch {
      /* no-op */
    }
  }, [activeTicketId]);

  // Tickets
  const {
    items: ticketItems,
    isEmpty: ticketsEmpty,
    isLoading: ticketsLoading,
    loadMore: loadMoreTickets,
    searchText,
    setSearchText,
    error: ticketsError,
  } = useTickets();

  // Chat (ticket-scoped in the underlying hook/store)
  const { messages, isHydrated, loadPrev, bottomLock } = useChat();

  // Composer (kept, but only shown when a ticket is active)
  const {
    value,
    setValue,
    canSend,
    sendNow,
    sending,
    setChannel: setComposerChannel,
    selectedChannel,
  } = useComposer(activeRoomId);

  const CHANNEL_OPTIONS = useMemo(
    () => [
      { id: CHANNELS.EMAIL, label: "Email", icon: "email" },
      { id: CHANNELS.SMS, label: "SMS", icon: "sms" },
      { id: CHANNELS.WABA, label: "WhatsApp", icon: "whatsapp", sublabel: "Business" },
      { id: CHANNELS.INAPP, label: "In-app", icon: "inapp" },
    ],
    []
  );

  // ---------- Filters modal ----------
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedStatusIds, setSelectedStatusIds] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  const FILTER_STATUSES = useMemo(
    () => [
      { id: "open", label: "Open", color: "success" },
      { id: "pending", label: "Pending", color: "warning" },
      { id: "closed", label: "Closed", color: "default" },
    ],
    []
  );
  const FILTER_CHANNELS = useMemo(
    () => [
      { id: CHANNELS.EMAIL, label: "Email" },
      { id: CHANNELS.SMS, label: "SMS" },
      { id: CHANNELS.WABA, label: "WhatsApp" },
      { id: CHANNELS.INAPP, label: "In-App" },
    ],
    []
  );
  const FILTER_TAGS = useMemo(
    () => [
      { id: "vip", label: "VIP" },
      { id: "billing", label: "Billing" },
      { id: "bug", label: "Bug" },
    ],
    []
  );

  // ---------- New Room / Conversation ----------
  const [newRoomOpen, setNewRoomOpen] = useState(false);
  const [newConvOpen, setNewConvOpen] = useState(false);

  // ---------- Roommates modal ----------
  const [membersOpen, setMembersOpen] = useState(false);
  const [membersForRoom, setMembersForRoom] = useState({ roomId: null, list: [] });

  // ---------- Rename modal ----------
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameRoomId, setRenameRoomId] = useState(null);
  const [renameTitle, setRenameTitle] = useState("");

  // Helper: derive roster by roomId for quick lookup
  const rosterById = useMemo(() => {
    const map = new Map();
    const buckets = [groups.business?.rooms, groups.insider?.rooms, groups.personal?.rooms].filter(Boolean);
    for (const arr of buckets) {
      for (const r of arr || []) {
        const list = Array.isArray(r.participants) ? r.participants : r.roommates || [];
        map.set(r.id, list);
      }
    }
    return map;
  }, [groups]);

  const activeRoomMembers = useMemo(() => {
    if (!activeRoomId) return [];
    const list = rosterById.get(activeRoomId) || [];
    return list
      .map((p) => ({
        id: String(p.id || p.address || p.phone || p.email || p.userId || ""),
        displayName: p.displayName || p.name || String(p.id || ""),
        actorType: p.actorType || undefined,
        participantType: p.participantType || undefined,
        avatarUrl: p.avatarUrl || "",
        availability: (p.availability || "offline").toLowerCase(),
        isDefault: !!p.isDefault,
        muted: !!p.muted,
        meta: p.meta || {},
      }))
      .filter((m) => m.id);
  }, [activeRoomId, rosterById]);

  // Context-aware empty chat state
  const chatRenderEmpty = useMemo(() => {
    if (!activeRoomId) {
      return <EmptyChatState state="noRoom" onCreateRoom={() => setNewRoomOpen(true)} />;
    }
    if (!activeTicketId) {
      return <EmptyChatState state="noConversation" onCreateConversation={() => setNewConvOpen(true)} />;
    }
    // Ticket selected, but no messages after hydrate → thread empty
    if (
      activeTicketId &&
      isHydrated &&
      (Array.isArray(messages) ? messages.length === 0 : true)
    ) {
      return <EmptyChatState state="noMessages" />;
    }
    return null;
  }, [activeRoomId, activeTicketId, isHydrated, messages]);

  // Sidebar mapping (rooms overview)
  const sidebarTickets = useMemo(() => {
    const toList = (arr = []) => {
      const items = [];
      for (const r of arr || []) {
        items.push({
          id: r.id,
          title: r.title,
          division: r.division || "business",
          unreadCount: r.unreadCount || 0,
          pinned: !!r.pinned,
          muted: !!r.muted,
          lastMessagePreview: r.lastMessagePreview,
          updatedAt: r.updatedAt,
          roommates: Array.isArray(r.participants) ? r.participants : r.roommates || [],
        });
      }
      const sum = (xs) => xs.reduce((a, b) => a + (b.unreadCount | 0), 0);
      return { items, unreadTotal: sum(items) };
    };
    return {
      business: toList(groups.business?.rooms),
      insider: toList(groups.insider?.rooms),
      personal: toList(groups.personal?.rooms),
    };
  }, [groups]);

  /**
   * Register room, upsert+activate, then (post-create flow) open NewTicketDialog.
   */
  const registerRoomPassThrough = useCallback(
    async (payload) => {
      const body = {
        title: String(payload?.title || "").trim(),
        division: payload?.division,
        roommates: Array.isArray(payload?.roommates) ? payload.roommates : [],
        meta: payload?.meta ?? undefined,
      };
      const { data: room } = await api.registerRoom?.(body);
      if (room?.id) {
        useRoomsStore.getState().upsert(room);
        setActiveRoom(room.id);
        setNewConvOpen(true);
      }
      return room;
    },
    [setActiveRoom]
  );

  // Small helper to remove a room even if store lacks .remove()
  const removeRoomFromStore = useCallback((roomId) => {
    const st = useRoomsStore.getState();
    if (typeof st.remove === "function") {
      st.remove(roomId);
      return;
    }
    useRoomsStore.setState((s) => {
      if (!s.byId[roomId]) return s;
      const nextById = { ...s.byId };
      delete nextById[roomId];
      const nextIds = s.allIds.filter((id) => id !== roomId);
      const nextActive =
        s.activeRoomId === roomId ? nextIds[0] || null : s.activeRoomId;
      return { ...s, byId: nextById, allIds: nextIds, activeRoomId: nextActive };
    });
  }, []);

  // Helper: refresh a room from API and upsert
  const refreshRoom = useCallback(async (roomId) => {
    try {
      const { data: fresh } = await api.getRoom?.({ roomId });
      if (fresh?.id) {
        useRoomsStore.getState().upsert(fresh);
      }
      return fresh;
    } catch (e) {
      console.warn("[UI] refreshRoom failed", roomId, e);
      return null;
    }
  }, []);

  // ---------- Room Actions handlers ----------
  const handleRoomAction = useCallback(
    async (roomId, action) => {
      const s = useRoomsStore.getState();
      const room = s.byId[roomId];

      try {
        if (action === "view_members") {
          setMembersForRoom({ roomId, list: rosterById.get(roomId) || [] });
          setMembersOpen(true);
          return;
        }
        if (action === "create_ticket") {
          setActiveRoom(roomId);
          setNewConvOpen(true);
          return;
        }
        if (action === "pin" || action === "unpin") {
          await (action === "pin"
            ? api.pinRoom?.({ roomId })
            : api.unpinRoom?.({ roomId }));
          s.upsert({
            id: roomId,
            pinned: action === "pin",
            updatedAt: new Date().toISOString(),
          });
          return;
        }
        if (action === "mute" || action === "unmute") {
          await (action === "mute"
            ? api.muteRoom?.({ roomId })
            : api.unmuteRoom?.({ roomId }));
          s.upsert({
            id: roomId,
            muted: action === "mute",
            updatedAt: new Date().toISOString(),
          });
          return;
        }
        if (action === "rename") {
          setRenameRoomId(roomId);
          setRenameTitle(room?.title || "");
          setRenameOpen(true);
          return;
        }
        if (action === "leave") {
          const ok = window.confirm("Leave this room?");
          if (!ok) return;
          await api.leaveRoom?.({ roomId });
          removeRoomFromStore(roomId);
          return;
        }
        if (action === "delete") {
          const ok = window.confirm("This deletes all conversations. Continue?");
          if (!ok) return;
          await api.deleteRoom?.({ roomId });
          removeRoomFromStore(roomId);
          return;
        }
      } catch (e) {
        console.warn("[UI] Room action failed:", action, roomId, e);
      }
    },
    [removeRoomFromStore, rosterById, setActiveRoom]
  );

  // ---------- Debug snapshot ----------
  useEffect(() => {
    console.log("[TI] Snapshot", {
      itemsLen: ticketItems?.length ?? 0,
      ticketsEmpty,
      ticketsLoading,
      activeRoomId,
      activeTicketId,
      messages: messages?.length ?? 0,
      hydrated: isHydrated,
    });
  }, [
    ticketItems,
    ticketsEmpty,
    ticketsLoading,
    activeRoomId,
    activeTicketId,
    messages,
    isHydrated,
  ]);

  const showTicketsEmpty = ticketsEmpty && !ticketsLoading;

  return (
    <Box
      data-testid="TeamInboxRoot"
      sx={{
        display: "flex",
        height: "100%",
        minHeight: 0,
        bgcolor: "background.default",
      }}
    >
      {/* ---------- LEFT: Rooms (sidebar) ---------- */}
      <SidebarRooms
        tickets={sidebarTickets}
        activeTicketId={activeRoomId}
        onSelectTicket={(id) => {
          setActiveRoom(id);
          setActiveTicket(null); // clear active ticket when changing room
        }}
        onNewRoom={() => setNewRoomOpen(true)}
        onRoomAction={handleRoomAction}
        transportStatus={transportStatus}
        collapsed={!isSidebarOpen}
        showSearch={false}
      />

      <Divider orientation="vertical" flexItem />

      {/* ---------- MIDDLE: Tickets panel (scroll constrained) ---------- */}
      <Box
        sx={{
          width: { xs: "100%", sm: 380, md: 420 },
          maxWidth: 520,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          bgcolor: "background.paper",
        }}
      >
        <TicketsHeader
          searchText={searchText}
          onSearchChange={setSearchText}
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          onOpenFilters={() => setFiltersOpen(true)}
          onNewTicket={() => {
            if (activeRoomId) setNewConvOpen(true);
          }}
          newEnabled={!!activeRoomId}
        />

        {/* Clamp height and let the list scroll */}
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {showTicketsEmpty ? (
            <TicketsListEmpty
              reason={ticketsError || "No tickets yet. Create the first ticket."}
              onNewTicket={
                activeRoomId ? () => setNewConvOpen(true) : undefined
              }
              onResetFilters={() => setSearchText("")}
            />
          ) : (
            <TicketsVirtualList
              tickets={ticketItems}
              activeId={activeTicketId}
              onSelect={(roomId, meta) => {
                setActiveRoom(roomId);
                const nextTid = meta?.ticketId ?? null;
                setActiveTicket(nextTid);
                try {
                  useTicketsStore.getState().setActiveTicket?.(nextTid);
                } catch {
                  /* no-op */
                }
              }}
              onEndReached={loadMoreTickets}
              isLoading={ticketsLoading}
            />
          )}
        </Box>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* ---------- RIGHT: Chat + (optional) Composer ---------- */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {isXs && activeRoomId && (
          <AppBar
            elevation={0}
            color="default"
            position="static"
            sx={{ borderBottom: (th) => `1px solid ${th.palette.divider}` }}
          >
            <Toolbar variant="dense" sx={{ gap: 1 }}>
              <IconButton
                edge="start"
                color="primary"
                onClick={() => {
                  setActiveRoom(null);
                  setActiveTicket(null);
                }}
                aria-label="Back to tickets"
              >
                <ChevronLeft size={20} />
              </IconButton>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Back to tickets
              </Typography>
            </Toolbar>
          </AppBar>
        )}

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <ChatPane
            messages={messages}
            isHydrated={isHydrated}
            loadPrev={loadPrev}
            bottomLock={bottomLock}
            typing={{}}
            windowBounds={{}}
            renderEmpty={chatRenderEmpty}
          />
        </Box>

        {/* Show Composer only when a ticket is selected; we'll refine when we handle chats */}
        {activeRoomId && activeTicketId && (
          <>
            <Divider />
            <Box sx={{ p: 1 }}>
              <Composer
                value={value}
                setValue={setValue}
                canSend={canSend}
                sendNow={sendNow}
                isSending={sending}
                channels={CHANNEL_OPTIONS}
                currentChannelId={selectedChannel}
                onChangeChannel={setComposerChannel}
                allowSchedule
                upcomingPresets={[]}
                roomMembers={activeRoomMembers}
              />
            </Box>
          </>
        )}
      </Box>

      {/* ---------- NEW ROOM MODAL ---------- */}
      <NewRoomDialog
        open={newRoomOpen}
        onClose={() => setNewRoomOpen(false)}
        onSubmit={async (payload) => {
          try {
            await registerRoomPassThrough(payload);
          } catch (e) {
            console.warn("[UI] registerRoom failed", e);
          } finally {
            setNewRoomOpen(false);
          }
        }}
        allowDivisionPick={true}
      />

      {/* ---------- NEW CONVERSATION MODAL ---------- */}
      <NewTicketDialog
        open={newConvOpen}
        onClose={() => setNewConvOpen(false)}
        onSubmit={async (payload) => {
          try {
            const body = {
              roomId: payload.roomId || activeRoomId, // roomId === tenantId
              subject: payload.subject || "",
              purpose: payload.purpose || undefined,
              participantIds: Array.isArray(payload.participantIds)
                ? payload.participantIds
                : [],
              agentIds: Array.isArray(payload.agentIds)
                ? payload.agentIds
                : [],
              tags: Array.isArray(payload.tags) ? payload.tags : [],
              meta: payload.meta ?? undefined,
            };
            const { data } = await api.registerTicket?.(body);
            if (data?.ticketId) {
              setActiveTicket(data.ticketId);
              try {
                useTicketsStore.getState().setActiveTicket?.(data.ticketId);
              } catch {
                /* no-op */
              }
            }
          } catch (e) {
            console.warn("[UI] registerTicket failed", e);
          } finally {
            setNewConvOpen(false);
          }
        }}
        roomId={activeRoomId || ""}
        roomMembers={activeRoomMembers}
        channels={[
          { id: CHANNELS.EMAIL, label: "Email" },
          { id: CHANNELS.SMS, label: "SMS" },
          { id: CHANNELS.WABA, label: "WhatsApp" },
          { id: CHANNELS.INAPP, label: "In-App" },
        ]}
        defaultChannelId={CHANNELS.EMAIL}
        allowPriority
        allowTags
      />

      {/* ---------- FILTERS MODAL ---------- */}
      <FiltersDialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onClearAll={() => {
          setSelectedStatusIds([]);
          setSelectedChannelId(null);
          setSelectedTagIds([]);
        }}
        onApply={(next) => {
          setSelectedStatusIds(next.statusIds);
          setSelectedChannelId(next.channelId);
          setSelectedTagIds(next.tagIds);
          setFiltersOpen(false);
        }}
        statuses={FILTER_STATUSES}
        channels={FILTER_CHANNELS}
        tags={FILTER_TAGS}
        selectedStatusIds={selectedStatusIds}
        selectedChannelId={selectedChannelId}
        selectedTagIds={selectedTagIds}
      />

      {/* ---------- ROOM ROOMMATES (rich modal) ---------- */}
      <RoomRoommatesDialog
        open={membersOpen}
        onClose={() => setMembersOpen(false)}
        roomId={membersForRoom.roomId}
        roommates={membersForRoom.list}
        onRoomAction={async (action) => {
          const roomId = membersForRoom.roomId;
          try {
            if (!roomId) return;
            if (action === "invite") {
              console.debug("[UI] invite roommates (open dialog)…");
            }
            if (action === "ping") {
              await api.pingRoom?.({ roomId });
            }
            if (action === "call") {
              await api.callRoom?.({ roomId });
            }
          } catch (e) {
            console.warn("[UI] Room roommates action failed:", action, roomId, e);
          } finally {
            if (roomId) await refreshRoom(roomId);
            setMembersForRoom({
              roomId,
              list: rosterById.get(roomId) || [],
            });
          }
        }}
        onRoommateAction={async (roommateId, action) => {
          const roomId = membersForRoom.roomId;
          try {
            if (!roomId || !roommateId) return;
            if (action === "mute") {
              await api.muteWatcher?.({ roomId, roommateId });
            } else if (action === "unmute") {
              await api.unmuteWatcher?.({ roomId, roommateId });
            } else if (action === "make_default") {
              await api.makeDefaultRoommate?.({ roomId, roommateId });
            } else if (action === "unmake_default") {
              await api.unmakeDefaultRoommate?.({ roomId, roommateId });
            } else if (action === "remove") {
              const ok = window.confirm(
                "Remove this roommate from the room?"
              );
              if (!ok) return;
              await api.removeRoommate?.({ roomId, roommateId });
            }
          } catch (e) {
            console.warn(
              "[UI] Roommate action failed:",
              action,
              roomId,
              roommateId,
              e
            );
          } finally {
            if (roomId) {
              await refreshRoom(roomId);
              setMembersForRoom({
                roomId,
                list: rosterById.get(roomId) || [],
              });
            }
          }
        }}
      />

      {/* ---------- RENAME ROOM ---------- */}
      <Dialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Rename room</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Title"
            value={renameTitle}
            onChange={(e) => setRenameTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                document.getElementById("renameRoomSubmit")?.click();
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button
            id="renameRoomSubmit"
            variant="contained"
            onClick={async () => {
              const id = renameRoomId;
              const title = (renameTitle || "").trim();
              if (!id || !title) {
                setRenameOpen(false);
                return;
              }
              try {
                await api.renameRoom?.({ roomId: id, title });
                useRoomsStore
                  .getState()
                  .upsert({ id, title, updatedAt: new Date().toISOString() });
              } catch (e) {
                console.warn("[UI] renameRoom failed", e);
              } finally {
                setRenameOpen(false);
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
