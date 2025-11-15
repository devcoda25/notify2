// src/TeamInbox/store/useTeamInboxStore.js
// Use: Single source of truth for TeamInbox UI/frame state (no messages/data).
// Works with: Sidebar (rooms), Tickets list, Chat pane, Side panel, New Chat modal.
// Uses: Zustand only. No services/WS imports (SSR-safe, synchronous, idempotent).

import { create } from "zustand";

/**
 * @typedef {Object} TeamInboxUIState
 * @property {boolean} sidebarOpen               // left drawer expanded/collapsed
 * @property {boolean} sidePanelOpen             // right inspector panel visible
 * @property {string|null} activeRoomId          // selected room in sidebar
 * @property {string|null} activeTicketId        // selected ticket in list
 * @property {string} searchQuery                // tickets/rooms search string
 * @property {{ [key:string]: string|number|boolean }} filters // simple chip filters
 * @property {boolean} isMobile                  // responsive flag from layout
 * @property {boolean} newChatModalOpen          // "New Chat" wizard/dialog
 * @property {boolean} addRecipientModalOpen     // nested add-recipient dialog
 */

/**
 * @typedef {Object} TeamInboxUIActions
 * @property {(open?: boolean) => void} setSidebarOpen
 * @property {() => void} toggleSidebar
 * @property {(open?: boolean) => void} setSidePanelOpen
 * @property {(roomId: string|null) => void} setActiveRoom
 * @property {(ticketId: string|null) => void} setActiveTicket
 * @property {(q: string) => void} setSearchQuery
 * @property {(key: string, value: string|number|boolean) => void} setFilter
 * @property {(key: string) => void} removeFilter
 * @property {() => void} clearFilters
 * @property {(mobile: boolean) => void} setIsMobile
 * @property {() => void} openNewChatModal
 * @property {() => void} closeNewChatModal
 * @property {(open?: boolean) => void} setAddRecipientModalOpen
 * @property {() => void} resetUI
 */

const initialState = /** @type {TeamInboxUIState} */ ({
  sidebarOpen: true,
  sidePanelOpen: false,
  activeRoomId: null,
  activeTicketId: null,
  searchQuery: "",
  filters: Object.create(null),
  isMobile: false,
  newChatModalOpen: false,
  addRecipientModalOpen: false,
});

/**
 * TeamInbox UI/frame store.
 * Small, focused, SSR-safe (pure state; no window/service access).
 */
export const useTeamInboxStore = create((set) => (/** @type {TeamInboxUIState & TeamInboxUIActions} */({
  ...initialState,

  // Sidebar (left drawer)
  setSidebarOpen(open) {
    if (typeof open === "boolean") {
      set((s) => (s.sidebarOpen === open ? s : { sidebarOpen: open }));
    } else {
      set((s) => ({ sidebarOpen: !s.sidebarOpen }));
    }
  },
  toggleSidebar() {
    set((s) => ({ sidebarOpen: !s.sidebarOpen }));
  },

  // Side panel (right inspector)
  setSidePanelOpen(open = true) {
    set((s) => (s.sidePanelOpen === open ? s : { sidePanelOpen: open }));
  },

  // Active selections
  setActiveRoom(roomId) {
    set((s) => {
      const nextRoom = roomId ?? null;
      if (s.activeRoomId === nextRoom) return s;
      // Changing room deselects ticket by default
      return { activeRoomId: nextRoom, activeTicketId: null };
    });
  },
  setActiveTicket(ticketId) {
    set((s) => {
      const nextTicket = ticketId ?? null;
      if (s.activeTicketId === nextTicket) return s;
      return { activeTicketId: nextTicket };
    });
  },

  // Search & filters
  setSearchQuery(q) {
    const next = String(q ?? "");
    set((s) => (s.searchQuery === next ? s : { searchQuery: next }));
  },
  setFilter(key, value) {
    set((s) => {
      const k = String(key);
      const v = /** @type {any} */ (value);
      const prev = s.filters[k];
      if (prev === v) return s;
      return { filters: { ...s.filters, [k]: v } };
    });
  },
  removeFilter(key) {
    set((s) => {
      if (!(key in s.filters)) return s;
      const next = { ...s.filters };
      delete next[key];
      return { filters: next };
    });
  },
  clearFilters() {
    set((s) => (Object.keys(s.filters).length ? { filters: Object.create(null) } : s));
  },

  // Responsive flag (provided by layout effect in a top-level frame)
  setIsMobile(mobile) {
    set((s) => (s.isMobile === !!mobile ? s : { isMobile: !!mobile }));
  },

  // Modals
  openNewChatModal() { set({ newChatModalOpen: true }); },
  closeNewChatModal() { set({ newChatModalOpen: false }); },
  setAddRecipientModalOpen(open = true) {
    set((s) => (s.addRecipientModalOpen === open ? s : { addRecipientModalOpen: open }));
  },

  // Reset UI-only state to defaults (does not touch data stores)
  resetUI() {
    set((s) => ({
      ...s,
      ...initialState,  
      // preserve responsive flag and sidebar state on reset to avoid layout jumps
      isMobile: s.isMobile,
      sidebarOpen: s.sidebarOpen,
    }));
  },
})));

// ------------------------- Selectors (optional) ------------------------------
// Usage: const activeRoomId = useTeamInboxStore(s => s.activeRoomId);
// Keep selectors colocated for ergonomics; they don't import services.

export const selectActiveRoomId = (s) => s.activeRoomId;
export const selectActiveTicketId = (s) => s.activeTicketId;
export const selectSearchQuery = (s) => s.searchQuery;
export const selectFilters = (s) => s.filters;
export const selectSidebarOpen = (s) => s.sidebarOpen;
export const selectSidePanelOpen = (s) => s.sidePanelOpen;
export const selectIsMobile = (s) => s.isMobile;
export const selectNewChatModalOpen = (s) => s.newChatModalOpen;
export const selectAddRecipientModalOpen = (s) => s.addRecipientModalOpen;
