// Converts store-normalized messages → canonical UI Message shape.

import { CHANNEL, DELIVERY } from "../types/chat";

/**
 * @param {any} s - store message (useChatStore selectors)
 * @returns {import("../types/chat").MessageUI | null}
 */
export function toUiMessage(s) {
  if (!s || !s.id) return null;

  const sender =
    s.sender ||
    (Array.isArray(s.from) && s.from.length ? s.from[0] : null) || {
      id: "unknown",
      kind: "system",
      displayName: "Unknown",
    };

  const c = (s.channel?.kind || s.channel || "inapp").toString().toLowerCase();
  const channel =
    c === "whatsapp" ? CHANNEL.WABA :
    c === "waba"     ? CHANNEL.WABA :
    c === "sms"      ? CHANNEL.SMS :
    c === "email"    ? CHANNEL.EMAIL :
    c === "voice"    ? CHANNEL.VOICE :
    c === "push"     ? CHANNEL.PUSH  : CHANNEL.INAPP;

  const inappKind = s.channel?.sub
    ? String(s.channel.sub).toLowerCase()
    : s.meta?.inappKind
    ? String(s.meta.inappKind).toLowerCase()
    : undefined;

  const st = (s.status || "").toString().toLowerCase();
  const delivery =
    st === "read"      ? DELIVERY.READ :
    st === "delivered" ? DELIVERY.DELIVERED :
    st === "failed"    ? DELIVERY.FAILED :
    st === "pending"   ? DELIVERY.PENDING : DELIVERY.SENT;

  const parts = Array.isArray(s.parts)
    ? s.parts.map((p) => ({
        id: String(p.id || ""),
        kind: String(p.kind || "document"),
        name: p.name ? String(p.name) : undefined,
        mime: p.mime ? String(p.mime) : undefined,
        url: p.url ? String(p.url) : undefined,
      }))
    : undefined;

  return {
    id: String(s.id),
    createdAt: String(s.createdAt || new Date().toISOString()),
    sender: {
      id: String(sender.id || "unknown"),
      kind: String(sender.kind || "system"),
      displayName: String(sender.displayName || "Unknown"),
      avatarUrl: sender.avatarUrl || undefined,
    },
    channel,
    meta: {
      inappKind,
      labels: Array.isArray(s.labels) && s.labels.length ? s.labels.map(String) : undefined,
      flag: s.flag || undefined,
    },
    delivery,
    text: typeof s.text === "string" ? s.text : undefined,
    parts,
  };
}

/**
 * @param {any[]} list
 * @returns {import("../types/chat").MessageUI[]}
 */
export function toUiMessages(list) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const s of list) {
    const m = toUiMessage(s);
    if (m) out.push(m);
  }
  return out;
}
