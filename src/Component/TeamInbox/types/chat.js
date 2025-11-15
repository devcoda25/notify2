// src/TeamInbox/types/chat.js
// Canonical doc-types for TeamInbox chat timelines.
// ✅ Keeps your existing store/transport types
// ✅ Adds a flat UI-facing MessageUI contract + enums (CHANNEL, DELIVERY)
// ✅ Expands UIPart to carry preview hints in meta
// Works with: utils/mappers, stores (useChatStore), hooks (useChat), services (fanout, chat.adapter)

// -----------------------------------------------------------------------------
// Transport / Store-centric types (your existing definitions)
// -----------------------------------------------------------------------------

/**
 * Cursor token returned by server for pagination of chat history.
 * @typedef {Object} Cursor
 * @property {"server"|"ulid"|"offset"} type
 * @property {string} token
 * @property {"backward"|"forward"} direction
 * @property {boolean} hasMore
 */

/**
 * A participant in the conversation (agent/contact/system/bot).
 * @typedef {Object} Participant
 * @property {string} id
 * @property {"agent"|"contact"|"system"|"bot"} kind
 * @property {string} displayName
 * @property {string=} avatarUrl
 * @property {Record<string, any>=} meta
 */

/**
 * A single attached binary or structured part for a message.
 * @typedef {Object} Attachment
 * @property {string} id
 * @property {"image"|"video"|"audio"|"document"|"sticker"|"contact"|"location"|"payload"} kind
 * @property {string} mime
 * @property {number=} bytes
 * @property {string=} name
 * @property {string=} url
 * @property {string=} thumbnailUrl
 * @property {Record<string, any>=} meta
 */

/**
 * Delivery/engagement receipt for a specific message.
 * @typedef {Object} Receipt
 * @property {"sent"|"delivered"|"read"|"failed"} type
 * @property {string} messageId
 * @property {string} roomId
 * @property {string} at
 * @property {string=} by
 * @property {{code?: string, message?: string}=} error
 * @property {Record<string, any>=} meta
 */

/**
 * Presence (typing/online).
 * @typedef {Object} Presence
 * @property {string} roomId
 * @property {string} userId
 * @property {"online"|"offline"|"idle"} state
 * @property {boolean=} typing
 * @property {string=} lastSeenAt
 * @property {Record<string, any>=} meta
 */

/**
 * Channel descriptor for a message.
 * @typedef {Object} Channel
 * @property {"email"|"sms"|"waba"|"inapp"|"voice"|"push"} kind
 * @property {"insider"|"sdk"|"personal"|"room"=} sub
 * @property {string=} provider
 * @property {Record<string, any>=} meta
 */

/**
 * Store-level message (normalized, rich).
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} roomId
 * @property {string=} ticketId
 * @property {Channel} channel
 * @property {Participant[]=} from
 * @property {Participant[]=} to
 * @property {Participant=} sender
 * @property {string=} text
 * @property {Attachment[]=} parts
 * @property {"local_echo"|"queued"|"sent"|"delivered"|"read"|"failed"} status
 * @property {"marketing"|"info"|"confirmation"|"alerts"=} flag
 * @property {string[]=} labels
 * @property {string} createdAt
 * @property {string=} sentAt
 * @property {string=} deliveredAt
 * @property {string=} readAt
 * @property {string=} editedAt
 * @property {string=} deletedAt
 * @property {Cursor=} prevCursor
 * @property {Record<string, any>=} meta
 */

/**
 * Chat window metadata.
 * @typedef {Object} ChatWindow
 * @property {string} roomId
 * @property {string} startAt
 * @property {string} endAt
 * @property {boolean} isOpen
 * @property {number=} expiresInMs
 * @property {Record<string, any>=} meta
 */

/**
 * Fanout event envelope.
 * @typedef {Object} ChatEvent
 * @property {"state"|"message"|"receipt"|"presence"|"errorFrame"|"system"|"window"} type
 * @property {any} data
 * @property {number} t
 */

export const ChatTypes = Object.freeze({});

// -----------------------------------------------------------------------------
// UI-centric contract (flat, presentation-friendly) + enums
// -----------------------------------------------------------------------------

export const CHANNEL = /** @type {const} */ ({
  WABA: "waba",
  SMS: "sms",
  EMAIL: "email",
  INAPP: "inapp",
  VOICE: "voice",
  PUSH: "push",
});

export const DELIVERY = /** @type {const} */ ({
  PENDING: "pending",
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
  FAILED: "failed",
});

/**
 * Minimal sender for UI
 * @typedef {Object} UISender
 * @property {string} id
 * @property {'agent'|'contact'|'system'|'bot'|string} kind
 * @property {string} displayName
 * @property {string=} avatarUrl
 */

/**
 * Minimal attachment/part for UI previewing.
 * Extended with optional hints used by previewers; safe to ignore.
 * @typedef {Object} UIPart
 * @property {string} id
 * @property {('image'|'video'|'audio'|'sticker'|'document'|'archive'|'html'|'code'|'link'|'apk'|'payload'|string)} kind
 * @property {string=} name
 * @property {string=} mime
 * @property {string=} url
 * @property {number=} bytes
 * @property {Record<string, any>=} meta  // renderer hints (optional):
 *   // Link/unfurl
 *   // meta.href?: string
 *   // meta.unfurl?: { title?:string; desc?:string; site?:string; icon?:string; image?:string }
 *   // Code/HTML
 *   // meta.language?: string
 *   // meta.safeHtml?: string
 *   // meta.sandboxToken?: string
 *   // Archives
 *   // meta.archiveList?: Array<{path:string,size:number,type:'file'|'dir'}>
 *   // APK
 *   // meta.apk?: { package?:string; versionName?:string; versionCode?:string; icon?:string }
 *   // Thumbnails
 *   // meta.thumb?: string
 */

/**
 * Flat UI-facing message (what components consume).
 * Produced by the adapter: store Message → MessageUI.
 * @typedef {Object} MessageUI
 * @property {string} id
 * @property {string} createdAt
 * @property {UISender} sender
 * @property {'waba'|'sms'|'email'|'inapp'|'voice'|'push'} channel
 * @property {{
 *   inappKind?: 'insider'|'sdk'|'personal'|'room',
 *   labels?: string[],
 *   flag?: string
 * }} meta
 * @property {'pending'|'sent'|'delivered'|'read'|'failed'} delivery
 * @property {string=} text
 * @property {UIPart[]=} parts
 */
