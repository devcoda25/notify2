// public/dev-sim.js
export async function simulateIncomingCall(overrides = {}) {
  const callId = overrides.callId || ("demo-" + Date.now());
  const payload = {
    callId,
    callerName: overrides.callerName || "Demo Caller",
    phoneMasked: overrides.phoneMasked || "+256••• ••3456",
    priority: overrides.priority || "P2",
    deepLink: overrides.deepLink || `/?pop=call&callId=${callId}`,
    // Dev-only flag: force a system notification even if the tab is visible
    notifyIfVisible: !!overrides.notifyIfVisible,
  };

  // Make sure the SW is ready (registration exists)
  const reg = await navigator.serviceWorker.ready.catch(() => null);

  // Prefer the controller (if this page is controlled),
  // otherwise talk directly to the active worker via registration.
  const target =
    navigator.serviceWorker?.controller ||
    (reg && reg.active) ||
    null;

  if (target && typeof target.postMessage === "function") {
    target.postMessage({ type: "SIMULATE_NEW_CALL", payload });
    return;
  }

  // Last resort: trigger a notification directly via the registration.
  // (This won’t run the visibility gating in your SW, but is fine for local testing.)
  try {
    await reg?.showNotification?.(
      "New call" + (payload.priority ? ` • ${payload.priority}` : ""),
      {
        body: payload.phoneMasked
          ? `${payload.callerName} — ${payload.phoneMasked}`
          : payload.callerName,
        tag: String(callId),
        renotify: true,
        requireInteraction: true,
        icon: "/logo192.png",
        badge: "/logo192.png",
        data: { deepLink: payload.deepLink, callId, payload },
        actions: [
          { action: "answer", title: "Answer" },
          { action: "open", title: "Open Dialer" },
          { action: "decline", title: "Decline" },
        ],
      }
    );
  } catch (e) {
    console.warn(
      "[dev-sim] Could not reach the service worker or show a notification. " +
        "Make sure the SW is registered, notifications are granted, " +
        "and then retry.",
      e
    );
  }
}
