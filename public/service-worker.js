// /public/service-worker.js
/* eslint-disable no-restricted-globals */

/**
 * Goals:
 * - Show notification only for NEW CALLS (not just when tab is left)
 * - Only surface a system notification when the app/tab is not visible
 * - Deduplicate per callId, auto-close after TTL
 * - Focus/open the dialer on click and notify page of actions
 * - Work in client-only mode (no backend push required)
 */

/* ----------------- SW lifecycle ----------------- */
self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

/* ----------------- SW state ----------------- */
let appVisibility = 'visible';                   // 'visible' | 'hidden' (updated by page)
const shownCalls = new Set();                    // callIds we’ve already notified
const NOTIF_ICON = '/logo192.png';               // CRA icons
const NOTIF_BADGE = '/logo192.png';

/* Focus existing window (prefer already-open app) or open one */
async function openOrFocusClient(url) {
  const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const c of all) {
    try {
      await c.focus();
      return c;
    } catch {}
  }
  return await self.clients.openWindow(url);
}

/* Broadcast a message to all controlled windows */
async function broadcastToPages(msg) {
  const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const c of all) {
    try { c.postMessage(msg); } catch {}
  }
}

/* Core: show NEW CALL notif (with gating + TTL) */
async function showNewCallNotification(raw = {}) {
  const {
    callId,
    callerName = 'Incoming Call',
    phoneMasked = '',
    priority = 'P3',
    deepLink = '/?pop=call&callId=' + (callId || ''),
    ttlSec = 45,
    /** override gates only for testing */
    notifyIfVisible = false,
  } = raw || {};

  if (!callId) return;

  // Gate to "new calls only": if we already showed this call, do nothing
  if (shownCalls.has(String(callId))) {
    // still tell page so any in-app UI can update
    await broadcastToPages({ type: 'CALL_ALERT', callId, payload: raw });
    return;
  }

  // Only notify if app is hidden, unless explicitly overridden (dev)
  const shouldNotify = notifyIfVisible || appVisibility === 'hidden';
  if (!shouldNotify) {
    // Still let the page know a call arrived (for inline toast/mini window)
    await broadcastToPages({ type: 'CALL_ALERT', callId, payload: raw });
    shownCalls.add(String(callId)); // mark as surfaced to avoid duplicate when it hides later
    return;
  }

  shownCalls.add(String(callId));

  const title = 'New call' + (priority ? ` • ${priority}` : '');
  const body = phoneMasked ? `${callerName} — ${phoneMasked}` : callerName;

  await self.registration.showNotification(title, {
    body,
    tag: String(callId),          // dedupe on platforms that respect tag
    renotify: true,
    requireInteraction: true,     // keep until user acts (if supported)
    icon: NOTIF_ICON,
    badge: NOTIF_BADGE,
    data: { deepLink, callId, payload: raw },
    actions: [
      { action: 'answer',  title: 'Answer' },
      { action: 'open',    title: 'Open Dialer' },
      { action: 'decline', title: 'Decline' }
    ]
  });

  // Let the page update inline UI too
  await broadcastToPages({ type: 'CALL_ALERT', callId, payload: raw });

  // Auto-close after TTL (if platform allows)
  if (Number(ttlSec) > 0) {
    setTimeout(async () => {
      const list = await self.registration.getNotifications({ tag: String(callId) });
      list.forEach(n => n.close());
    }, Number(ttlSec) * 1000);
  }
}

/* ----------------- Push (optional) ----------------- */
self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data?.json() ?? JSON.parse(event.data?.text() || '{}');
  } catch {
    payload = {};
  }
  const callId = payload?.callId;
  if (!callId) return;
  event.waitUntil(showNewCallNotification(payload));
});

/* ------------- Notification interactions ----------- */
self.addEventListener('notificationclick', (event) => {
  const { action, notification } = event;
  const { deepLink = '/', callId, payload } = notification.data || {};
  const intent = action || 'open';

  event.notification.close();

  event.waitUntil((async () => {
    const client = await openOrFocusClient(deepLink);
    if (client) {
      client.postMessage({
        type: 'CALL_ALERT_ACTION',
        intent,        // 'answer' | 'decline' | 'open'
        callId,
        payload
      });
    }
  })());
});

self.addEventListener('notificationclose', (event) => {
  const { callId } = event.notification?.data || {};
  if (callId) {
    broadcastToPages({ type: 'CALL_ALERT_CLOSED', callId });
  }
});

/* -------- Push subscription change (optional) ------ */
self.addEventListener('pushsubscriptionchange', async (_event) => {
  // Client-only demo: nothing to do. In production, re-register here.
});

/* ---------------- Page messages -------------------- */
self.addEventListener('message', (event) => {
  const msg = event?.data || {};
  switch (msg.type) {
    case 'SIMULATE_NEW_CALL': {
      // Used by demoSim and local dev to raise a-call
      event.waitUntil(showNewCallNotification(msg.payload || {}));
      break;
    }
    case 'APP_VISIBILITY': {
      // Page informs SW whenever visibility changes
      appVisibility = msg.state === 'hidden' ? 'hidden' : 'visible';
      break;
    }
    case 'RESET_SHOWN_CALLS': {
      shownCalls.clear();
      break;
    }
    default:
      break;
  }
});
