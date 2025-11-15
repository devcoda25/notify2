// src/TeamInbox/types/room.js
// Use: Canonical doc-types for TeamInbox rooms/tickets metadata (descriptive only).
// Works with: utils/mappers, stores (useRoomsStore/useTicketsStore), sidebar/tickets UI.
// Uses: No imports. These are JSDoc typedefs for editors/tooling; not runtime validators.

/**
 * Divisions used to segment the sidebar room list.
 * @typedef {"employee"|"private"|"business"} Division
 */

 /**
  * Participant in a room (agent, customer, or bot).
  * @typedef {Object} Participant
  * @property {string} id
  * @property {"agent"|"member"|"guest"|"bot"} role
  * @property {string} displayName
  * @property {string=} avatarUrl
  * @property {boolean=} muted
  * @property {Record<string, any>=} meta
  */

 /**
  * Lightweight “ticket” row used in the middle panel (list of conversations).
  * @typedef {Object} Ticket
  * @property {string} id
  * @property {string} roomId
  * @property {string} subject
  * @property {"active"|"pending"|"ended"} status
  * @property {"sent"|"received"|"failed"|"read"|"none"} subStatus
  * @property {"email"|"sms"|"waba"|"inapp"|"voice"|"push"} channel
  * @property {number} unreadCount
  * @property {string} createdAt                 - ISO
  * @property {string} updatedAt                 - ISO
  * @property {{ name: string, role?: string, avatarUrl?: string }[]=} assignees
  * @property {Record<string, any>=} meta
  */

 /**
  * A room groups roommates and messages under a division (sidebar entity).
  * @typedef {Object} Room
  * @property {string} id
  * @property {Division} division
  * @property {string} title
  * @property {Participant[]} roommates
  * @property {number} unreadCount
  * @property {boolean=} pinned
  * @property {boolean=} archived
  * @property {boolean=} muted
  * @property {{ text?: string, at?: string, from?: string }=} lastMessagePreview
  * @property {string} createdAt                 - ISO
  * @property {string} updatedAt                 - ISO
  * @property {Record<string, any>=} meta
  */

 /**
  * Aggregate counters rendered in the “Tickets / Insider” groups.
  * @typedef {Object} RoomGroupCounter
  * @property {string} key                       - e.g., "Initiated", "Broadcast", "Groups"
  * @property {number} count
  * @property {boolean=} hasUnread
  */

 /**
  * Minimal list item shape used by virtualized tickets list.
  * This is intentionally small for performance; hydrate details on demand.
  * @typedef {Object} TicketListItem
  * @property {string} id
  * @property {string} roomId
  * @property {string} title
  * @property {string} subtitle
  * @property {number} unreadCount
  * @property {string} updatedAt                 - ISO
  * @property {("active"|"pending"|"ended")=} status
  * @property {("sent"|"received"|"failed"|"read"|"none")=} subStatus
  * @property {("email"|"sms"|"waba"|"inapp"|"voice"|"push")=} channel
  */

 // Exporting an empty frozen map so imports are valid while keeping this module descriptive-only.
 export const RoomTypes = Object.freeze({});
