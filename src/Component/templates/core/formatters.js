// Path: src/Component/templates/core/formatters.js

/** Normalize a template record from fixtures into a consistent shape */
export function normalizeTemplate(t = {}) {
  return {
    id: String(t.id ?? ""),
    name: t.name ?? "Untitled",
    type: t.type ?? "blue",
    version: Number.isFinite(t.version) ? t.version : 1,
    status: t.status ?? "Draft",
    quality: t.quality ?? "green",
    channels: Array.isArray(t.channels) ? t.channels : [],
    locales: Array.isArray(t.locales) ? t.locales : ["en"],
    owner: t.owner ?? "Unknown",
    usage7d: Number(t.usage7d ?? 0),
    usage30d: Number(t.usage30d ?? 0),
    triggered: Number(t.triggered ?? 0),
    createdAt: t.createdAt ?? new Date().toISOString(),
    updatedAt: t.updatedAt ?? t.createdAt ?? new Date().toISOString(),
  };
}

export function formatNumber(n) {
  const v = Number(n ?? 0);
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(v);
}

export function formatDateISO(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso || "";
  }
}

const Formatters = { normalizeTemplate, formatNumber, formatDateISO };
export default Formatters;