// src/TeamInbox/constants/UX.js
// Use: UX tuning knobs for TeamInbox (kept centralized for easy tweaking).
// Works with: TicketsVirtualList, MessageVirtualList, useTickets/useChat/useComposer hooks.
// Uses: No imports. Frozen at runtime.

export  const UX = Object.freeze({
  // Lists & search
  SEARCH_DEBOUNCE_MS: 300,     // Debounce for search inputs (ms)
  VLIST_OVERSCAN: 8,           // Extra rows to render above/below viewport
  WARM_WINDOW: 50,             // Initial messages to hydrate on room open

  // Composer
  MAX_COMPOSER_ROWS: 6,        // Multi-line composer visual cap

  // Presence & unread smoothing
  UNREAD_BATCH_MS: 250,        // Coalesce unread updates to avoid UI thrash
  PRESENCE_IDLE_MS: 60_000,    // Consider presence idle after N ms without ping

  // Chat window semantics (e.g., WhatsApp’s 24h)
  CHAT_WINDOW_DURATION_MS: 24 * 60 * 60 * 1000, // default 24h unless server overrides
  WINDOW_COUNTDOWN_TICK_MS: 30_000,             // refresh countdown labels every 30s
});
