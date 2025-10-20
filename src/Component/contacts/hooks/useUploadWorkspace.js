import { useCallback, useMemo, useState } from "react";

function genId(prefix = "xls") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * @typedef {{ id:string, name:string, createdAt:number,
 *   rows:Array<any>, mapping?:Record<string,string>, stats?:{ total:number, invalid:number, duplicates:number } }} UploadTab
 */

export default function useUploadWorkspace() {
  /** @type {[UploadTab[], Function]} */
  const [tabs, setTabs] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const addTab = useCallback((name, rows = [], mapping = {}) => {
    const id = genId();
    const tab = {
      id, name: String(name || "Sheet"),
      createdAt: Date.now(),
      rows: Array.isArray(rows) ? rows : [],
      mapping: mapping || {},
      stats: { total: rows.length || 0, invalid: 0, duplicates: 0 },
    };
    setTabs((prev) => [...prev, tab]);
    setActiveId(id);
    return id;
  }, []);

  const addWorkbook = useCallback((sheets = []) => {
    // sheets: [{ name, rows, mapping? }]
    const ids = [];
    setTabs((prev) => {
      const next = [...prev];
      for (const s of sheets) {
        const id = genId();
        ids.push(id);
        next.push({
          id,
          name: String(s?.name || "Sheet"),
          createdAt: Date.now(),
          rows: Array.isArray(s?.rows) ? s.rows : [],
          mapping: s?.mapping || {},
          stats: { total: (s?.rows?.length || 0), invalid: 0, duplicates: 0 },
        });
      }
      return next;
    });
    if (ids.length) setActiveId(ids[0]);
    return ids;
  }, []);

  const removeTab = useCallback((id) => {
    setTabs((prev) => prev.filter((t) => t.id !== id));
    setActiveId((cur) => (cur === id ? null : cur));
  }, []);

  const updateTab = useCallback((id, patch) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const clear = useCallback(() => {
    setTabs([]);
    setActiveId(null);
  }, []);

  const active = useMemo(() => tabs.find((t) => t.id === activeId) || null, [tabs, activeId]);

  // For rendering tabs header: DB tab + uploads
  const headerTabs = useMemo(() => {
    const items = [];
    items.push({ id: "db", label: "Contacts", icon: "db" });
    for (const t of tabs) items.push({ id: t.id, label: t.name || "Sheet", icon: "xls" });
    return items;
  }, [tabs]);

  return {
    // state
    tabs,
    activeId,
    active,

    // api
    setActiveId,
    addTab,
    addWorkbook,
    removeTab,
    updateTab,
    clear,

    // helpers for header
    headerTabs,
  };
}
