// Centralized uploads history utils (localStorage-backed)

export const LS_HISTORY_KEY = "contacts.uploadHistory";

export function loadHistory() {
  try {
    const raw = localStorage.getItem(LS_HISTORY_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveHistory(arr) {
  try {
    localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(arr));
  } catch {}
}

export function clearHistory() {
  saveHistory([]);
}

/**
 * Persist an array of entries (one per chosen file).
 * entries: Array<{
 *   fileName: string,
 *   at: ISOString,
 *   byteSize: number,
 *   mime?: string,
 *   ext?: string,
 *   sheets: Array<{ name: string, rowsCount: number }>,
 *   totalRows: number,
 *   campaigns: string[]
 * }>
 */
export function persistHistory(entries = []) {
  if (!Array.isArray(entries) || !entries.length) return;
  const prev = loadHistory();
  const now = new Date().toISOString();

  const normalized = entries.map((e) => ({
    id: `${(e.fileName || "file").replace(/\.[^.]+$/, "")}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 6)}`,
    fileName: e.fileName || "file",
    at: e.at || now,
    byteSize: Number(e.byteSize || 0),
    mime: e.mime || "",
    ext: e.ext || guessExt(e.fileName),
    sheets: Array.isArray(e.sheets) ? e.sheets : [],
    totalRows: Number(e.totalRows || 0),
    campaigns: Array.from(new Set(e.campaigns || [])),
  }));

  saveHistory([...normalized, ...prev].slice(0, 1000));
}

function guessExt(name = "") {
  const ext = (name.split(".").pop() || "").toLowerCase();
  return ext || "";
}
