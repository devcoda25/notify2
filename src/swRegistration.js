export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;

  try {
    const reg = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });

    // Ensure a controller exists (first load after install has no controller)
    if (!navigator.serviceWorker.controller) {
      // After refresh you’ll have controller, but we don’t auto-reload here
      console.info('[SW] Registered. Refresh once to fully activate messaging.');
    }

    // Basic update log (non-intrusive)
    reg.addEventListener?.('updatefound', () => {
      const installing = reg.installing;
      installing?.addEventListener('statechange', () => {
        if (installing.state === 'installed') {
          console.info('[SW] Installed.');
        }
      });
    });

    return reg;
  } catch (e) {
    console.error('[SW] Registration failed:', e);
    return null;
  }
}
