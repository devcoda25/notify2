// src/TeamInbox/utils/receipts.js
// Use: Pure helpers for delivery state math and idempotent receipt merges.
// Works with: useChatStore (merge receipts), TicketsCard (last-message ticks), mappers.
// Uses: constants/MESSAGE (DELIVERY). No side effects.

import { DELIVERY } from "../constants/MESSAGE.js";

/**
 * Given a message (timestamps or status), compute the normalized delivery status.
 * It is monotonic: read > delivered > sent > pending/failed (failed is terminal unless later success).
 * @param {{status?:string, sentAt?:string, deliveredAt?:string, readAt?:string, deletedAt?:string}} m
 * @returns {"pending"|"sent"|"delivered"|"read"|"failed"}
 */
export function computeDeliveryStatus(m = {}) {
  const s = String(m.status || "").toLowerCase();
  if (s === DELIVERY.FAILED) return DELIVERY.FAILED;
  if (m.readAt) return DELIVERY.READ;
  if (m.deliveredAt) return DELIVERY.DELIVERED;
  if (m.sentAt) return DELIVERY.SENT;
  if (s === DELIVERY.SENT || s === DELIVERY.DELIVERED || s === DELIVERY.READ) return s;
  return DELIVERY.PENDING;
}

const RANK = Object.freeze({
  [DELIVERY.PENDING]: 0,
  [DELIVERY.SENT]: 1,
  [DELIVERY.DELIVERED]: 2,
  [DELIVERY.READ]: 3,
  [DELIVERY.FAILED]: -1, // treat failed as terminal but lower than delivered/read for promotion rules
});

/**
 * Merge a single receipt into a message snapshot (idempotent).
 * @param {{status?:string, sentAt?:string, deliveredAt?:string, readAt?:string}} msg
 * @param {{type:string, at?:string}} r
 * @returns {object} patch fields to apply onto the message
 */
export function mergeReceipt(msg = {}, r = {}) {
  const type = String(r?.type || "").toLowerCase();
  const at = r?.at ?? new Date().toISOString();

  const prev = computeDeliveryStatus(msg);

  if (type === "read") {
    return {
      readAt: latest(msg.readAt, at),
      status: DELIVERY.READ,
    };
  }
  if (type === "delivered") {
    if (prev === DELIVERY.READ) {
      // already maxed
      return { deliveredAt: latest(msg.deliveredAt, at) };
    }
    return {
      deliveredAt: latest(msg.deliveredAt, at),
      status: DELIVERY.DELIVERED,
    };
  }
  if (type === "sent") {
    const nextStatus =
      prev === DELIVERY.READ || prev === DELIVERY.DELIVERED ? prev : DELIVERY.SENT;
    return {
      sentAt: latest(msg.sentAt, at),
      status: nextStatus,
    };
  }
  if (type === "failed") {
    // If we already have delivered/read, ignore failure; otherwise mark failed.
    if (prev === DELIVERY.READ || prev === DELIVERY.DELIVERED) return {};
    return { status: DELIVERY.FAILED };
  }
  return {};
}

/**
 * Merge multiple receipts in a stable way (order-agnostic).
 * @param {object} msg
 * @param {Array<{type:string, at?:string}>} receipts
 * @returns {object} patch
 */
export function mergeReceipts(msg = {}, receipts = []) {
  let patch = {};
  for (const r of receipts) {
    const p = mergeReceipt({ ...msg, ...patch }, r);
    if (p && Object.keys(p).length) {
      patch = { ...patch, ...p };
    }
  }
  return patch;
}

/** Compare two delivery statuses; returns negative/zero/positive like sort(). */
export function compareStatus(a, b) {
  return (RANK[a] ?? 0) - (RANK[b] ?? 0);
}

function latest(a, b) {
  if (!a) return b ?? undefined;
  if (!b) return a ?? undefined;
  return a > b ? a : b;
}
