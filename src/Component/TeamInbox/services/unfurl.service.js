// src/TeamInbox/services/unfurl.service.js
// Tiny client for your server unfurl endpoint. Caches by URL in-memory.

const cache = new Map();

/**
 * @param {string} url
 * @returns {Promise<{title?:string, desc?:string, site?:string, icon?:string, image?:string} | null>}
 */
export async function fetchUnfurl(url) {
  const u = String(url || "").trim();
  if (!u) return null;
  if (cache.has(u)) return cache.get(u);

  try {
    const res = await fetch(`/api/unfurl?url=${encodeURIComponent(u)}`, {
      method: "GET",
      credentials: "include",
      headers: { "Accept": "application/json" },
    });
    if (!res.ok) throw new Error(`Unfurl failed ${res.status}`);
    const data = await res.json();
    cache.set(u, data);
    return data;
  } catch (e) {
    cache.set(u, null);
    return null;
  }
}
