// src/TeamInbox/utils/formatting.js
// Use: Human-friendly formatting utilities (timestamps, counts, labels).
// Works with: Tickets/Chat UI, headers, chips, badges.
// Uses: constants/CHANNELS for labeling. Pure functions only.

import { CHANNELS, INAPP_SUBCHANNELS } from "../constants/CHANNELS.js";

/**
 * Format a relative time like "2m", "3h", "yesterday", "2024-05-11" for older items.
 * Edge cases:
 *  - Empty/invalid date → returns "".
 *  - Future dates clamp to "0s".
 * @param {string|number|Date} iso
 * @param {Date} [now=new Date()]
 * @returns {string}
 */
export function formatTimeAgo(iso, now = new Date()) {
  if (!iso) return "";
  const t = new Date(iso);
  if (isNaN(t.getTime())) return "";
  const diff = Math.max(0, now.getTime() - t.getTime());
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1) return "yesterday";
  if (d < 7) return `${d}d`;
  // Older than a week → ISO date (YYYY-MM-DD)
  const yyyy = t.getFullYear();
  const mm = String(t.getMonth() + 1).padStart(2, "0");
  const dd = String(t.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Format large counts to compact notation: 1.2k, 3.4M.
 * Edge cases:
 *  - null/undefined/NaN → "0".
 *  - Negative values preserve sign.
 * @param {number} n
 * @returns {string}
 */
export function formatCount(n) {
  const v = Number.isFinite(n) ? n : 0;
  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v);
  if (abs < 1000) return `${v}`;
  if (abs < 1_000_000) return `${sign}${(abs / 1000).toFixed(abs >= 100_000 ? 0 : 1)}k`;
  if (abs < 1_000_000_000) return `${sign}${(abs / 1_000_000).toFixed(abs >= 100_000_000 ? 0 : 1)}M`;
  return `${sign}${(abs / 1_000_000_000).toFixed(1)}B`;
}

/**
 * Truncate a string to max length with ellipsis.
 * Edge cases:
 *  - Empty/null -> "".
 *  - max <= 1 -> ellipsis if needed.
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
export function truncate(str, max) {
  if (!str) return "";
  const m = Math.max(0, max | 0);
  if (str.length <= m) return str;
  if (m <= 1) return "…";
  return str.slice(0, m - 1) + "…";
}

/**
 * Channel to human-readable label (short). Accepts either a string or
 * a normalized channel object {kind, sub}.
 * @param {string|{kind:string, sub?:string}} channel
 * @returns {string}
 */
export function channelLabel(channel) {
  const obj = typeof channel === "string" ? { kind: channel } : channel || {};
  switch (obj.kind) {
    case CHANNELS.EMAIL: return "Email";
    case CHANNELS.SMS: return "SMS";
    case CHANNELS.WABA: return "WhatsApp";
    case CHANNELS.VOICE: return "Voice";
    case CHANNELS.PUSH: return "Push";
    case CHANNELS.INAPP: {
      const sub = obj.sub;
      if (sub === INAPP_SUBCHANNELS.INSIDER) return "In-app • Insider";
      if (sub === INAPP_SUBCHANNELS.SDK) return "In-app • SDK";
      if (sub === INAPP_SUBCHANNELS.PERSONAL) return "In-app • Personal";
      if (sub === INAPP_SUBCHANNELS.ROOM) return "In-app • Room";
      return "In-app";
    }
    default:
      return "Other";
  }
}

/**
 * Map receipt type to a short badge text (fallback if we can't render ticks).
 * @param {"sent"|"delivered"|"read"|"failed"} type
 * @returns {string}
 */
export function receiptBadge(type) {
  switch (type) {
    case "sent": return "Sent";
    case "delivered": return "Delivered";
    case "read": return "Read";
    case "failed": return "Failed";
    default: return "";
  }
}

/**
 * Optional color key for message flag → UI chip (yellow/blue/green/red family).
 * @param {"marketing"|"info"|"confirmation"|"alerts"|undefined} flag
 * @returns {"warning"|"info"|"success"|"error"|undefined}
 */
export function flagColor(flag) {
  if (flag === "marketing") return "warning";
  if (flag === "info") return "info";
  if (flag === "confirmation") return "success";
  if (flag === "alerts") return "error";
  return undefined;
}
