// src/TeamInbox/utils/mappers.js
// Use: Map raw server payloads ↔ normalized UI models (rooms, tickets, messages).
// Works with: fanout.service, stores (useRoomsStore/useTicketsStore/useChatStore), components.
// Uses: CHANNELS constants (labels/validation). Pure helpers only.

import { CHANNELS, INAPP_SUBCHANNELS } from "../constants/CHANNELS.js";

/**
 * Normalize a raw server room into the Room shape (types/room.js).
 * Tolerant of missing fields; fills safe defaults.
 * @param {any} raw
 * @returns {import("./_internal.js").RoomLike}
 */
export function mapServerRoomToRoom(raw) {
  const r = raw || {};
  return {
    id: String(r.id ?? r.roomId ?? ""),
    division: normalizeDivision(r.division),
    title: String(r.title ?? r.name ?? "Untitled"),
    roommates: Array.isArray(r.roommates) ? r.roommates.map(mapServerParticipant) : [],
    unreadCount: Number.isFinite(r.unreadCount) ? r.unreadCount : 0,
    pinned: !!r.pinned,
    archived: !!r.archived,
    muted: !!r.muted,
    lastMessagePreview: r.lastMessage
      ? {
          text: String(r.lastMessage.text ?? ""),
          at: r.lastMessage.at ?? r.lastMessage.createdAt ?? null,
          from:
            r.lastMessage.from?.[0]?.displayName ??
            r.lastMessage.sender?.displayName ??
            r.lastMessage.fromName ??
            null,
        }
      : undefined,
    createdAt: r.createdAt ?? new Date().toISOString(),
    updatedAt: r.updatedAt ?? r.createdAt ?? new Date().toISOString(),
    meta: r.meta ?? {},
  };
}

/** Normalize division to the canonical set. */
function normalizeDivision(x) {
  const s = String(x || "").toLowerCase();
  if (s === "business" || s === "insider" || s === "personal") return s;
  // Common legacy aliases
  if (s === "employee") return "insider";
  if (s === "private") return "personal";
  return "business";
}

/**
 * Normalize participant.
 * @param {any} p
 * @returns {{id:string, role:string, displayName:string, avatarUrl?:string, muted?:boolean, meta?:object}}
 */
export function mapServerParticipant(p) {
  const x = p || {};
  return {
    id: String(x.id ?? x.userId ?? ""),
    role: x.role ?? "member",
    displayName: String(x.displayName ?? x.name ?? "Unknown"),
    avatarUrl: x.avatarUrl ?? undefined,
    muted: !!x.muted,
    meta: x.meta ?? {},
  };
}

/**
 * Normalize a raw ticket into a TicketListItem (compact list shape).
 * @param {any} raw
 * @returns {{id:string, roomId:string, title:string, subtitle:string, unreadCount:number, updatedAt:string, status?:string, subStatus?:string, channel?:ReturnType<typeof normalizeChannel>}}
 */
export function mapServerTicketToListItem(raw) {
  const t = raw || {};
  const channel = normalizeChannel(t.channel, t.subchannel || t.inappSub);
  return {
    id: String(t.id ?? t.ticketId ?? ""),
    roomId: String(t.roomId ?? t.id ?? ""),
    title: String(t.title ?? t.subject ?? "Untitled"),
    subtitle: String(t.subtitle ?? t.preview ?? t.lastMessage?.text ?? ""),
    unreadCount: Number.isFinite(t.unreadCount) ? t.unreadCount : 0,
    updatedAt: t.updatedAt ?? t.createdAt ?? new Date().toISOString(),
    status: t.status ?? undefined,
    subStatus: t.subStatus ?? undefined,
    channel,
  };
}

/**
 * Normalize a raw message payload into Message shape (types/chat.js).
 * - Supports multi-sender `from` / multi-recipient `to`
 * - `channel` becomes an object: { kind, sub?, provider?, meta? }
 * - Supports labels & flag
 * @param {any} raw
 * @returns {import("./_internal.js").MessageLike}
 */
export function mapServerMessageToMessage(raw) {
  const m = raw || {};
  const channel = normalizeChannel(m.channel, m.subchannel || m.inappSub, m.provider, m.channelMeta);

  // Normalize roommates
  const fromArr = Array.isArray(m.from) ? m.from.map(mapServerParticipant) : undefined;
  const toArr = Array.isArray(m.to) ? m.to.map(mapServerParticipant) : undefined;

  // Back-compat: some payloads still use single `sender`
  const sender = m.sender ? mapServerParticipant(m.sender) : (fromArr?.[0] ?? undefined);

  return {
    id: String(m.id ?? m.messageId ?? ""),
    roomId: String(m.roomId ?? ""),
    ticketId: m.ticketId ? String(m.ticketId) : undefined,
    channel,
    from: fromArr,
    to: toArr,
    sender,
    text: typeof m.text === "string" ? m.text : undefined,
    parts: Array.isArray(m.parts) ? m.parts.map(mapServerAttachment) : undefined,
    status: normalizeStatus(m.status),
    flag: normalizeFlag(m.flag ?? m.category),
    labels: Array.isArray(m.labels) ? m.labels.map(String) : undefined,
    createdAt: m.createdAt ?? new Date().toISOString(),
    sentAt: m.sentAt ?? undefined,
    deliveredAt: m.deliveredAt ?? undefined,
    readAt: m.readAt ?? undefined,
    editedAt: m.editedAt ?? undefined,
    deletedAt: m.deletedAt ?? undefined,
    prevCursor: normalizeCursor(m.prevCursor),
    meta: m.meta ?? {},
  };
}

/**
 * Prepare an outgoing compose payload for WS send.
 * Note: This is UI → transport, not the final server envelope (transport may add fields).
 * Accepts either a string `channel` (legacy) or an object `{kind, sub}`.
 * @param {{text?:string, parts?:Array, roomId:string, ticketId?:string, channel:string|{kind:string, sub?:string}, provider?:string}} draft
 * @returns {{type:string, roomId:string, ticketId?:string, channel:{kind:string, sub?:string}, text?:string, parts?:Array, t:number, provider?:string}}
 */
export function mapOutgoingComposeToEnvelope(draft) {
  const chan = typeof draft.channel === "string"
    ? normalizeChannel(draft.channel)
    : normalizeChannel(draft.channel?.kind, draft.channel?.sub, draft.provider);

  return {
    type: "APP/SEND",
    roomId: String(draft.roomId),
    ticketId: draft.ticketId ? String(draft.ticketId) : undefined,
    channel: chan,
    text: typeof draft.text === "string" ? draft.text : undefined,
    parts: Array.isArray(draft.parts) ? draft.parts : undefined,
    provider: draft.provider ?? undefined,
    t: Date.now(),
  };
}

/**
 * Normalize channel (+ optional in-app subchannel) into canonical object.
 * Accepts:
 *   - kind only: "sms" | "email" | "waba" | "inapp" | "voice" | "push"
 *   - sub for in-app: "insider" | "sdk" | "personal" | "room"
 * @param {string|object} kindOrObj
 * @param {string=} subMaybe
 * @param {string=} provider
 * @param {Record<string, any>=} meta
 * @returns {{kind:string, sub?:string, provider?:string, meta?:Record<string,any>}}
 */
export function normalizeChannel(kindOrObj, subMaybe, provider, meta) {
  // If already a shaped object, re-normalize fields
  if (kindOrObj && typeof kindOrObj === "object") {
    return normalizeChannel(kindOrObj.kind, kindOrObj.sub, kindOrObj.provider ?? provider, kindOrObj.meta ?? meta);
  }

  const k = String(kindOrObj || "").toLowerCase();
  /** @type {{kind:string, sub?:string, provider?:string, meta?:Record<string,any>}} */
  const out = { kind: CHANNELS.INAPP, provider: provider ?? undefined, meta: meta ?? undefined };

  switch (k) {
    case CHANNELS.EMAIL: out.kind = CHANNELS.EMAIL; return out;
    case CHANNELS.SMS: out.kind = CHANNELS.SMS; return out;
    case CHANNELS.WABA: out.kind = CHANNELS.WABA; return out;
    case CHANNELS.VOICE: out.kind = CHANNELS.VOICE; return out;
    case CHANNELS.PUSH: out.kind = CHANNELS.PUSH; return out;
    case CHANNELS.INAPP:
    default:
      out.kind = CHANNELS.INAPP;
      // Subchannel normalization
      const sub = String(subMaybe || "").toLowerCase();
      if (sub === INAPP_SUBCHANNELS.INSIDER) out.sub = INAPP_SUBCHANNELS.INSIDER;
      else if (sub === INAPP_SUBCHANNELS.SDK) out.sub = INAPP_SUBCHANNELS.SDK;
      else if (sub === INAPP_SUBCHANNELS.PERSONAL) out.sub = INAPP_SUBCHANNELS.PERSONAL;
      else if (sub === INAPP_SUBCHANNELS.ROOM) out.sub = INAPP_SUBCHANNELS.ROOM;
      // leave undefined if unknown
      return out;
  }
}

/** Normalize message status to one of the supported UI states. */
export function normalizeStatus(x) {
  const s = String(x || "").toLowerCase();
  switch (s) {
    case "local_echo":
    case "local-echo":
    case "echo":
      return "local_echo";
    case "queued":
      return "queued";
    case "sent":
      return "sent";
    case "delivered":
      return "delivered";
    case "read":
      return "read";
    case "failed":
      return "failed";
    default:
      return "sent";
  }
}

/** Normalize high-level message category to our 4-color flag set. */
export function normalizeFlag(v) {
  const s = String(v || "").toLowerCase();
  if (s === "marketing") return "marketing";     // yellow
  if (s === "info" || s === "information") return "info"; // blue
  if (s === "confirmation" || s === "confirm") return "confirmation"; // green
  if (s === "alert" || s === "alerts" || s === "warning") return "alerts"; // red
  return undefined;
}

/** Normalize cursor shape. Accepts null/undefined. */
export function normalizeCursor(c) {
  if (!c) return undefined;
  return {
    type: c.type ?? "server",
    token: String(c.token ?? ""),
    direction: c.direction ?? "backward",
    hasMore: !!c.hasMore,
  };
}

/** Map an attachment part. */
export function mapServerAttachment(p) {
  const a = p || {};
  return {
    id: String(a.id ?? a.partId ?? ""),
    kind: a.kind ?? guessAttachmentKind(a.mime),
    mime: String(a.mime ?? a.mimetype ?? "application/octet-stream"),
    bytes: Number.isFinite(a.bytes) ? a.bytes : undefined,
    name: a.name ?? undefined,
    url: a.url ?? undefined,
    thumbnailUrl: a.thumbnailUrl ?? undefined,
    meta: a.meta ?? {},
  };
}

function guessAttachmentKind(mime = "") {
  const m = String(mime).toLowerCase();
  if (m.startsWith("image/")) return "image";
  if (m.startsWith("video/")) return "video";
  if (m.startsWith("audio/")) return "audio";
  if (m === "application/vcard+json" || m === "text/vcard") return "contact";
  return "document";
}
