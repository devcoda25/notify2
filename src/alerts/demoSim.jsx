// src/alerts/demoSim.js
export async function simulateIncomingCall(overrides = {}) {
  if (!navigator.serviceWorker?.controller) {
    await navigator.serviceWorker.ready; // first load needs a refresh after SW install
  }
  const callId = overrides.callId || ('demo-' + Date.now());
  const payload = {
    callId,
    callerName: overrides.callerName || 'Demo Caller',
    phoneMasked: overrides.phoneMasked || '+256••• ••3456',
    priority: overrides.priority || 'P2',
    deepLink: overrides.deepLink || `/?pop=call&callId=${callId}`,
  };
  navigator.serviceWorker.controller?.postMessage({
    type: 'SIMULATE_NEW_CALL',
    payload,
  });
}
