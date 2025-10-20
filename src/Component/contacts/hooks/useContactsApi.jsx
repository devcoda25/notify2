import { useMemo } from "react";
import { useContactsStore } from "../../store/useContactsStore"; // your provided store
import { normalizeContact } from "../utils/mappers";

export default function useContactsApi() {
  const hydrate        = useContactsStore((s) => s.hydrate);
  const addContact     = useContactsStore((s) => s.addContact);
  const updateContact  = useContactsStore((s) => s.updateContact);
  const removeContact  = useContactsStore((s) => s.removeContact);
  const bulkRemove     = useContactsStore((s) => s.bulkRemove);
  const getAllRows     = useContactsStore((s) => s.getAllRows);
  const setLoading     = useContactsStore((s) => s.setLoading);
  const setError       = useContactsStore((s) => s.setError);

  const api = useMemo(() => ({
    // Initialize/replace all (demo data, seed, etc.)
    hydrate(list = []) {
      const normalized = list.map((c) => normalizeContact(c, { origin: "db" }));
      hydrate(normalized);
    },

    // CRUD
    add(row) {
      const c = normalizeContact(row, { origin: "db" });
      addContact(c);
      return c;
    },

    update(id, patch) {
      const p = normalizeContact({ id, ...patch }, { origin: "db" });
      updateContact(id, p);
      return p;
    },

    remove(id) {
      removeContact(id);
    },

    removeMany(ids = []) {
      bulkRemove(ids);
    },

    // Bulk upsert for imports
    upsertMany(rows = [], opts = {}) {
      // naive: treat as add if id not present; update if id exists
      const existing = new Map(getAllRows().map((r) => [r.id, r]));
      const added = [];
      const updated = [];
      for (const r of rows) {
        const norm = normalizeContact(r, { origin: "db" });
        if (norm.id && existing.has(norm.id)) {
          updateContact(norm.id, norm);
          updated.push(norm.id);
        } else {
          addContact(norm);
          added.push(norm.id);
        }
      }
      return { added, updated };
    },

    // progress indicators
    setLoading,
    setError,
  }), [hydrate, addContact, updateContact, removeContact, bulkRemove, getAllRows, setLoading, setError]);

  return api;
}
