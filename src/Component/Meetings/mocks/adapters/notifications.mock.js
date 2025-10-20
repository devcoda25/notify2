// Path: /src/Component/Meetings/mocks/adapters/notifications.mock.js
/**
 * Simulates sending confirmations/reminders via Email, SMS, and WhatsApp.
 *
 * Backwards-compatible API:
 * - sendEmail({ to, subject, html?, text?, templateId?, vars? })
 * - sendSMS({ to, text, templateId?, vars? })
 * - sendWhatsApp({ to, text?, templateId?, vars?, mediaUrl? })
 * - getLog({ channel?, status?, since?, to?, q?, limit=100, offset=0 })
 * - clearLog()
 *
 * New (optional) features:
 * - Idempotency: pass `dedupeKey` to avoid duplicate sends (same channel+dedupeKey).
 * - Scheduling: pass `sendAt` (ISO string or ms) to schedule a future send. Status "scheduled" until due.
 * - Event stream: subscribe(fn), unsubscribe(fn) to observe status changes.
 * - Tuning: setGlobalLatency(ms), setFailureRates({ email, sms, whatsapp }), setDeliveryWindow({ minSec, maxSec })
 *
 * Return value on send:
 *   { id, status, providerMessageId, estimatedDeliveryAt }
 */

/////////////////////////////
// Config & internal state //
/////////////////////////////

let BASE_LATENCY_MS = 140;
let DELIVERY_WINDOW = { minSec: 5, maxSec: 45 };
let FAILURE_RATES = { email: 0.02, sms: 0.1, whatsapp: 0.05 }; // simulated failure odds

const CHANNELS = ["email", "sms", "whatsapp"];
const LOG_CAP = 1000;

const deliveryLog = []; // newest first
const byId = new Map(); // id -> entry (live reference)
const dedupe = new Map(); // `${channel}:${dedupeKey}` -> id
const subscribers = new Set(); // fn(entry)

const rand = () => Math.random().toString(36).slice(2, 8);
const nowIso = () => new Date().toISOString();
const jitter = (ms, pct = 0.35) => Math.max(0, Math.round(ms * (1 - pct + Math.random() * pct * 2)));
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

function eta() {
  const sec = clamp(
    DELIVERY_WINDOW.minSec + Math.floor(Math.random() * (DELIVERY_WINDOW.maxSec - DELIVERY_WINDOW.minSec + 1)),
    1,
    300
  );
  return new Date(Date.now() + sec * 1000).toISOString();
}

function notify(entry) {
  // call subscribers with a copy
  subscribers.forEach((fn) => {
    try {
      fn({ ...entry });
    } catch {}
  });
}

function pushLog(entry) {
  deliveryLog.unshift(entry);
  byId.set(entry.id, entry);
  if (deliveryLog.length > LOG_CAP) {
    const trimmed = deliveryLog.splice(LOG_CAP);
    trimmed.forEach((e) => byId.delete(e.id));
  }
  notify(entry);
}

function updateStatus(id, status, patch = {}) {
  const entry = byId.get(id);
  if (!entry) return;
  Object.assign(entry, { status, ...patch });
  notify(entry);
}

function makeProviderId(channel) {
  const tag =
    channel === "email" ? "mock-mailgun" : channel === "sms" ? "mock-twilio" : "mock-wati";
  return `${tag}-${rand()}`;
}

function normalizeSendAt(sendAt) {
  if (!sendAt) return null;
  if (typeof sendAt === "number") return new Date(sendAt);
  const d = new Date(sendAt);
  return Number.isNaN(d.getTime()) ? null : d;
}

///////////////////////
// Public send calls //
///////////////////////

async function sendEmail({ to, subject, html, text, templateId, vars, dedupeKey, sendAt } = {}) {
  return coreSend({
    channel: "email",
    to,
    payload: {
      subject: subject || "[Notify] Confirmation",
      html: html || null,
      text: text || "Your meeting is confirmed.",
      templateId: templateId || null,
      vars: vars || {},
    },
    dedupeKey,
    sendAt,
  });
}

async function sendSMS({ to, text, templateId, vars, dedupeKey, sendAt } = {}) {
  return coreSend({
    channel: "sms",
    to,
    payload: {
      text: text || "Reminder: your meeting starts soon.",
      templateId: templateId || null,
      vars: vars || {},
    },
    dedupeKey,
    sendAt,
  });
}

async function sendWhatsApp({ to, text, templateId, vars, mediaUrl, dedupeKey, sendAt } = {}) {
  return coreSend({
    channel: "whatsapp",
    to,
    payload: {
      text: text || "✅ Booking confirmed. See you soon!",
      templateId: templateId || null,
      vars: vars || {},
      mediaUrl: mediaUrl || null,
    },
    dedupeKey,
    sendAt,
  });
}

async function coreSend({ channel, to, payload, dedupeKey, sendAt }) {
  if (!CHANNELS.includes(channel)) throw new Error(`Unsupported channel: ${channel}`);
  if (!to) throw new Error(`Missing recipient 'to' for ${channel}`);

  // simulate network/SDK call latency
  await new Promise((r) => setTimeout(r, jitter(BASE_LATENCY_MS)));

  // idempotency (optional)
  if (dedupeKey) {
    const key = `${channel}:${dedupeKey}`;
    const existingId = dedupe.get(key);
    if (existingId && byId.has(existingId)) {
      const e = byId.get(existingId);
      // return a light response (no mutation)
      return {
        id: e.id,
        status: e.status,
        providerMessageId: e.providerMessageId,
        estimatedDeliveryAt: e.estimatedDeliveryAt,
        deduped: true,
      };
    }
  }

  const id = `${channel}_${rand()}_${Date.now().toString(36)}`;
  const providerMessageId = makeProviderId(channel);
  const scheduledAt = normalizeSendAt(sendAt);
  const initialStatus = scheduledAt && scheduledAt.getTime() > Date.now() ? "scheduled" : "queued";
  const estimatedDeliveryAt = eta();

  const entry = {
    id,
    channel,
    to,
    payload,
    status: initialStatus, // scheduled | queued | delivered | failed
    providerMessageId,
    ts: nowIso(), // created
    scheduledFor: scheduledAt ? scheduledAt.toISOString() : null,
    estimatedDeliveryAt,
    meta: { attempt: 0 },
  };

  pushLog(entry);
  if (dedupeKey) dedupe.set(`${channel}:${dedupeKey}`, id);

  // schedule the actual delivery/ failure flip
  scheduleProgress(entry);

  return { id, status: entry.status, providerMessageId, estimatedDeliveryAt };
}

//////////////////////////
// Progress & scheduling //
//////////////////////////

function scheduleProgress(entry) {
  const deliver = () => {
    // simple failure simulation per channel
    const failOdds = FAILURE_RATES[entry.channel] || 0;
    const willFail = Math.random() < failOdds;

    // queue -> delivered/failed
    updateStatus(
      entry.id,
      willFail ? "failed" : "delivered",
      { deliveredAt: willFail ? null : nowIso(), failedAt: willFail ? nowIso() : null }
    );
  };

  // If scheduled in the future, wait until scheduled time first
  let delayToQueue = 0;
  if (entry.status === "scheduled" && entry.scheduledFor) {
    const ms = new Date(entry.scheduledFor).getTime() - Date.now();
    delayToQueue = Math.max(0, ms);
    setTimeout(() => {
      updateStatus(entry.id, "queued", { queuedAt: nowIso() });
      // after queued, simulate provider latency before delivery
      setTimeout(deliver, jitter(BASE_LATENCY_MS + 800));
    }, delayToQueue);
    return;
  }

  // Already queued: simulate provider latency before delivery
  setTimeout(deliver, jitter(BASE_LATENCY_MS + 800));
}

//////////////////////
// Querying the log //
//////////////////////

/**
 * getLog filters:
 *  - channel?: 'email' | 'sms' | 'whatsapp'
 *  - status?: 'scheduled' | 'queued' | 'delivered' | 'failed'
 *  - since?: ISO timestamp (return entries with ts >= since)
 *  - to?: string (exact match or substring)
 *  - q?: string (search in subject/text/templateId)
 *  - limit?: number (default 100)
 *  - offset?: number (default 0)
 */
function getLog({ channel, status, since, to, q, limit = 100, offset = 0 } = {}) {
  const sinceMs = since ? new Date(since).getTime() : null;
  const qLower = q ? String(q).toLowerCase() : null;

  const filtered = deliveryLog.filter((e) => {
    if (channel && e.channel !== channel) return false;
    if (status && e.status !== status) return false;
    if (sinceMs && new Date(e.ts).getTime() < sinceMs) return false;
    if (to && !String(e.to).toLowerCase().includes(String(to).toLowerCase())) return false;

    if (qLower) {
      const hay =
        (e.payload?.subject || "") +
        " " +
        (e.payload?.text || "") +
        " " +
        (e.payload?.templateId || "") +
        " " +
        JSON.stringify(e.payload?.vars || {});
      if (!hay.toLowerCase().includes(qLower)) return false;
    }

    return true;
  });

  return filtered.slice(offset, offset + limit).map((e) => ({ ...e }));
}

function clearLog() {
  deliveryLog.length = 0;
  byId.clear();
  dedupe.clear();
  // don't clear subscribers
}

/////////////////////////
// Observability hooks //
/////////////////////////

function subscribe(fn) {
  if (typeof fn !== "function") return () => {};
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function unsubscribe(fn) {
  subscribers.delete(fn);
}

//////////////////////
// Tuning utilities //
//////////////////////

function setGlobalLatency(ms) {
  BASE_LATENCY_MS = Math.max(0, Number(ms) || 0);
}
function setFailureRates(next = {}) {
  FAILURE_RATES = { ...FAILURE_RATES, ...next };
}
function setDeliveryWindow({ minSec, maxSec } = {}) {
  const min = Number(minSec ?? DELIVERY_WINDOW.minSec);
  const max = Number(maxSec ?? DELIVERY_WINDOW.maxSec);
  DELIVERY_WINDOW = { minSec: clamp(min, 1, 600), maxSec: clamp(max, 1, 600) };
  if (DELIVERY_WINDOW.maxSec < DELIVERY_WINDOW.minSec) {
    DELIVERY_WINDOW.maxSec = DELIVERY_WINDOW.minSec;
  }
}

/////////////////////
// Module export(s) //
/////////////////////

module.exports = {
  // main API (backwards compatible)
  sendEmail,
  sendSMS,
  sendWhatsApp,
  getLog,
  clearLog,

  // optional extras
  subscribe,
  unsubscribe,
  setGlobalLatency,
  setFailureRates,
  setDeliveryWindow,
};
