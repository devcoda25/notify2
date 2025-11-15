import { useCallback, useEffect, useMemo, useState } from "react";
import useContactsApi from "./useContactsApi"; // Import useContactsApi

function genId(prefix = "xls") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * @typedef {{ id:string, name:string, createdAt:number,
 *   rows?:Array<any>, mapping?:Record<string,string>, stats?:{ total:number, invalid:number, duplicates:number },
 *   isPersistent?:boolean, backendSheetId?:string, originalFileName?:string }} UploadTab
 */

export default function useUploadWorkspace() {
  /** @type {[UploadTab[], Function]} */
  const [tabs, setTabs] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const api = useContactsApi(); // Initialize useContactsApi

  // Load persistent groups from backend on initialization
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const groups = await api.fetchGroups();
        console.log("useUploadWorkspace - fetched persistent groups:", groups); // DEBUG LOG
        if (groups?.length) {
          addGroups(groups);
        }
      } catch (error) {
        console.error("Failed to load persistent groups:", error);
      }
    };
    loadGroups();
  }, [api]); // Dependency on api to ensure it's stable

  const addTab = useCallback((name, rows = [], mapping = {}) => {
    const id = genId();
    const tab = {
      id, name: String(name || "Sheet"),
      createdAt: Date.now(),
      rows: Array.isArray(rows) ? rows : [],
      mapping: mapping || {},
      stats: { total: rows.length || 0, invalid: 0, duplicates: 0 },
      isPersistent: false, // Default for client-side added tabs
      visible: true,
    };
    setTabs((prev) => [...prev, tab]);
    setActiveId(id);
    return id;
  }, []);

  const addWorkbook = useCallback((sheets = []) => {
    // sheets: [{ name, rows, mapping? }]
    const ids = [];
    const newTabs = sheets.map(s => {
      const id = genId();
      ids.push(id);
      return {
        id,
        name: String(s?.name || "Sheet"),
        createdAt: Date.now(),
        rows: Array.isArray(s?.rows) ? s.rows : [],
        mapping: s?.mapping || {},
        stats: { total: (s?.rows?.length || 0), invalid: 0, duplicates: 0 },
        isPersistent: false, // Default for client-side added workbooks
        visible: true,
      };
    });
    setTabs(prev => [...prev, ...newTabs]);
    if (ids.length) setActiveId(ids[0]);
    return ids;
  }, []);

  const addGroups = useCallback((backendGroups = []) => {
    // backendSheets: [{ id: backendSheetId, name: sheetName, originalFileName: fileName, rowCount: number }]
    const ids = [];
    const newTabs = backendGroups.map(s => {
      const id = genId("ps"); // Generate a client-side ID for the tab
      ids.push(id);
      return {
        id,
        name: String(s?.name || "Group"),
        createdAt: Date.now(),
        isPersistent: true,
        groupId: s.id, // Store the backend ID
        originalFileName: s.originalFileName,
        stats: { total: s.rowCount || 0, invalid: 0, duplicates: 0 }, // Use backend rowCount
        visible: true,
        // Note: 'rows' is NOT stored here; it will be fetched from backend
      };
    });
    setTabs(prev => [...prev, ...newTabs]);
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

  const toggleTabVisibility = useCallback((id) => {
    setTabs(prev => prev.map(t => {
      if (t.id === id) {
        // Here you would also make an API call to persist this change
        console.log(`API CALL: set group ${t.groupId} visibility to ${!t.visible}`);
        return { ...t, visible: !t.visible };
      }
      return t;
    }));
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
    for (const t of tabs) {
      items.push({
        id: t.id,
        label: t.name || "Sheet",
        icon: t.isPersistent ? "db-xls" : "xls", // Differentiate persistent tabs
        closable: !t.isPersistent, // Persistent tabs might not be closable from UI
      });
    }
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
    addGroups, // <--- New function
    removeTab,
    updateTab,
    toggleTabVisibility,
    clear,

    // helpers for header
    headerTabs,
  };
}
