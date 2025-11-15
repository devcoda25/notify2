// src/TeamInbox/utils/virtualize.js
// Use: Virtual list tuning and scroll helpers (pure).
// Works with: TicketsVirtualList, MessageVirtualList, ChatPane.
// Uses: UX constants for defaults. No DOM mutation, pure calculations.

import { UX } from "../constants/UX.js";

/**
 * Compute overscan rows given item count and optional override.
 * Ensures a sane minimum and caps by list size.
 * @param {number} itemCount
 * @param {number} [override]
 * @returns {number}
 */
export function getOverscan(itemCount, override) {
  const base = Number.isFinite(override) ? override : UX.VLIST_OVERSCAN;
  const n = Math.max(2, base | 0);
  return Math.min(n, Math.max(0, itemCount));
}

/**
 * Determine if the viewport is near the bottom to auto-stick chat tails.
 * Edge cases:
 *  - Negative/NaN inputs are treated as 0.
 * @param {number} scrollTop
 * @param {number} scrollHeight
 * @param {number} clientHeight
 * @param {number} [thresholdPx=48]
 * @returns {boolean}
 */
export function isNearBottom(scrollTop, scrollHeight, clientHeight, thresholdPx = 48) {
  const st = Math.max(0, scrollTop | 0);
  const sh = Math.max(0, scrollHeight | 0);
  const ch = Math.max(0, clientHeight | 0);
  const delta = sh - (st + ch);
  return delta <= Math.max(0, thresholdPx | 0);
}

/**
 * Compute a reasonable list height given container size and paddings.
 * @param {{containerHeight:number, headerPx?:number, footerPx?:number, minPx?:number}} p
 * @returns {number}
 */
export function computeListHeight({ containerHeight, headerPx = 0, footerPx = 0, minPx = 120 }) {
  const h = Math.max(0, containerHeight | 0) - Math.max(0, headerPx | 0) - Math.max(0, footerPx | 0);
  return Math.max(minPx, h);
}

/**
 * Estimate total list height for fixed-height rows (useful for skeletons).
 * @param {number} itemCount
 * @param {number} rowPx
 * @param {number} [gapPx=0]
 * @returns {number}
 */
export function estimateListPixels(itemCount, rowPx, gapPx = 0) {
  const c = Math.max(0, itemCount | 0);
  const r = Math.max(1, rowPx | 0);
  const g = Math.max(0, gapPx | 0);
  return c * r + Math.max(0, c - 1) * g;
}

/**
 * Return new scrollTop that keeps the viewport anchored at bottom when new content appends.
 * Pure calculation: it doesn't mutate DOM; caller applies result.
 * @param {{prevScrollTop:number, prevScrollHeight:number, newScrollHeight:number}} p
 * @returns {number}
 */
export function stickToBottomAfterAppend({ prevScrollTop, prevScrollHeight, newScrollHeight }) {
  const pst = Math.max(0, prevScrollTop | 0);
  const psh = Math.max(0, prevScrollHeight | 0);
  const nsh = Math.max(0, newScrollHeight | 0);
  const delta = nsh - psh;
  return pst + Math.max(0, delta);
}
