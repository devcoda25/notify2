// src/Component/store/useContactsStore.js
import create from "zustand";
import { subscribeWithSelector, persist } from "zustand/middleware";

// If/when you move the dialer store under ./store, update this import.
// Current tree shows it at: src/Component/dailer/store/useDialerStore.js
import { useDialerStore } from "./useDialerStore";

/* --------------------------------- Utils ---------------------------------- */

function genContactId() {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

const toLower = (v) => String(v || "").toLowerCase();

function pickPrimaryNumber(contact) {
  // Try common shapes
  const phones = contact?.phones || [];
  if (Array.isArray(phones) && phones.length) {
    const preferred =
      phones.find((p) => /primary|mobile/i.test(String(p?.label))) ||
      phones[0];
    return preferred?.e164 || preferred?.number || preferred?.phone || preferred || null;
  }
  return (
    contact?.phone?.e164 ||
    contact?.phone?.number ||
    contact?.phone ||
    contact?.mobile ||
    contact?.whatsapp ||
    null
  );
}

function compareContacts(a, b, sortBy, dir) {
  const mul = dir === "asc" ? 1 : -1;

  if (sortBy === "name") {
    return mul * toLower(a.name).localeCompare(toLower(b.name));
  }
  if (sortBy === "createdAt") {
    const av = +new Date(a.createdAt || a.created_at || 0);
    const bv = +new Date(b.createdAt || b.created_at || 0);
    return mul * (av - bv);
  }
  // default: lastUpdated
  const au =
    +new Date(a.updatedAt || a.updated_at || a.lastUpdated || a.last_updated || 0);
  const bu =
    +new Date(b.updatedAt || b.updated_at || b.lastUpdated || b.last_updated || 0);
  return mul * (au - bu);
}

function matchesSearch(contact, search) {
  if (!search) return true;
  const s = toLower(search);
  const hay = [
    contact?.name,
    contact?.email,
    contact?.source,
    pickPrimaryNumber(contact),
    ...(Array.isArray(contact?.attributes)
      ? contact.attributes.map((x) => `${x.key}:${x.value}`)
      : []),
  ]
    .filter(Boolean)
    .map(toLower)
    .join(" | ");
  return hay.includes(s);
}

/* You moved the filter to utils/ContactFilter.js.
   We’ll try to use it if present; otherwise fall back to identity. */
let applyExternalFilters = null;
try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const CF = require("../contacts/utils/ContactFilter");
  applyExternalFilters =
    CF?.applyFilters || CF?.filterContacts || CF?.default || null;
} catch {
  // no-op; optional dependency
}

function applyFiltersArr(arr, filters) {
  if (!filters || !Object.keys(filters).length) return arr;
  if (typeof applyExternalFilters === "function") {
    try {
      return applyExternalFilters(arr, filters);
    } catch {
      // fall back (don’t break UI if util throws)
    }
  }
  // Minimal built-in: only "source" equality & tag includes if provided
  const src = filters.source || null;
  const tags = Array.isArray(filters.tags) ? filters.tags : null;
  return arr.filter((c) => {
    const okSource = src ? String(c.source || "") === String(src) : true;
    const okTags = tags
      ? (Array.isArray(c.attributes) ? c.attributes.map((t) => t.value) : []).some(
          (v) => tags.includes(v)
        )
      : true;
    return okSource && okTags;
  });
}

/* --------------------------------- Store ---------------------------------- */

export const useContactsStore = create(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        /* ------------------------------- Data ------------------------------- */
        data: {
          byId: {},
          order: [], // insertion order / stable keys
          total: 0,
          loading: false,
          error: null,
        },

        /* ------------------------------- Query ------------------------------ */
        query: {
          search: "",
          sortBy: "lastUpdated", // 'lastUpdated' | 'name' | 'createdAt'
          sortDir: "desc", // 'asc' | 'desc'
          page: 0,
          pageSize: 10,
          filters: {}, // free-form; piped into utils/ContactFilter if available
        },

        /* ----------------------------- Selection ---------------------------- */
        selection: {
          ids: new Set(),
          selectAllOnPage: false,
        },

        /* --------------------------------- UI ------------------------------- */
        ui: {
          addOpen: false,
          editOpen: false,
          importOpen: false,
          exportOpen: false,
          deleteOpen: false,
          editingId: null,
        },

        /* ---------------------------- Derived (get) ------------------------- */
        getAllRows: () => {
          const { byId, order } = get().data;
          return order.map((id) => byId[id]).filter(Boolean);
        },

        getFilteredRows: () => {
          const { search, filters } = get().query;
          const rows = get().getAllRows();
          const filtered = rows.filter((r) => matchesSearch(r, search));
          return applyFiltersArr(filtered, filters);
        },

        getSortedRows: () => {
          const { sortBy, sortDir } = get().query;
          const arr = [...get().getFilteredRows()];
          arr.sort((a, b) => compareContacts(a, b, sortBy, sortDir));
          return arr;
        },

        getPagedRows: () => {
          const { page, pageSize } = get().query;
          const arr = get().getSortedRows();
          const start = page * pageSize;
          const end = start + pageSize;
          return arr.slice(start, end);
        },

        getSelectedCount: () => get().selection.ids.size,

        /* ------------------------------ Actions ----------------------------- */

        // Data
        hydrate: (list = []) => {
          const byId = {};
          const order = [];
          list.forEach((c) => {
            const id = c?.id ?? genContactId();
            byId[id] = { id, ...c };
            order.push(id);
          });
          set((s) => ({
            data: {
              ...s.data,
              byId,
              order,
              total: order.length,
              loading: false,
              error: null,
            },
          }));
        },

        setLoading: (loading = true) =>
          set((s) => ({ data: { ...s.data, loading } })),

        setError: (error = null) =>
          set((s) => ({ data: { ...s.data, error } })),

        addContact: (contact) => {
          const id = contact?.id ?? genContactId();
          set((s) => {
            if (s.data.byId[id]) {
              // already exists; do update
              return {
                data: {
                  ...s.data,
                  byId: { ...s.data.byId, [id]: { ...s.data.byId[id], ...contact, id } },
                },
              };
            }
            return {
              data: {
                ...s.data,
                byId: { ...s.data.byId, [id]: { id, ...contact } },
                order: [...s.data.order, id],
                total: (s.data.total || 0) + 1,
              },
            };
          });
        },

        updateContact: (id, patch) =>
          set((s) => ({
            data: {
              ...s.data,
              byId: { ...s.data.byId, [id]: { ...s.data.byId[id], ...patch } },
            },
          })),

        removeContact: (id) =>
          set((s) => {
            if (!s.data.byId[id]) return {};
            const { [id]: _, ...rest } = s.data.byId;
            const order = s.data.order.filter((x) => x !== id);
            const sel = new Set(s.selection.ids);
            sel.delete(id);
            return {
              data: { ...s.data, byId: rest, order, total: Math.max(0, (s.data.total || 1) - 1) },
              selection: { ...s.selection, ids: sel },
            };
          }),

        bulkRemove: (ids = []) =>
          set((s) => {
            let byId = { ...s.data.byId };
            let removed = 0;
            ids.forEach((id) => {
              if (byId[id]) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [id]: __, ...rest } = byId;
                byId = rest;
                removed++;
              }
            });
            const order = s.data.order.filter((x) => !ids.includes(x));
            const sel = new Set(s.selection.ids);
            ids.forEach((id) => sel.delete(id));
            return {
              data: {
                ...s.data,
                byId,
                order,
                total: Math.max(0, (s.data.total || 0) - removed),
              },
              selection: { ...s.selection, ids: sel },
            };
          }),

        // Query
        setQuery: (next) =>
          set((s) => ({ query: { ...s.query, ...next } })),

        mergeQuery: (patch) =>
          set((s) => ({ query: { ...s.query, ...patch } })),

        resetQuery: () =>
          set(() => ({
            query: {
              search: "",
              sortBy: "lastUpdated",
              sortDir: "desc",
              page: 0,
              pageSize: 10,
              filters: {},
            },
          })),

        // Selection
        toggleSelect: (id) =>
          set((s) => {
            const next = new Set(s.selection.ids);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return { selection: { ...s.selection, ids: next } };
          }),

        selectPage: (ids = []) =>
          set((s) => ({
            selection: {
              ...s.selection,
              ids: new Set(ids),
              selectAllOnPage: ids.length > 0,
            },
          })),

        clearSelection: () =>
          set((s) => ({ selection: { ...s.selection, ids: new Set(), selectAllOnPage: false } })),

        // UI
        open: (modal, id = null) =>
          set((s) => ({
            ui: {
              ...s.ui,
              addOpen: modal === "add" ? true : s.ui.addOpen,
              editOpen: modal === "edit" ? true : s.ui.editOpen,
              importOpen: modal === "import" ? true : s.ui.importOpen,
              exportOpen: modal === "export" ? true : s.ui.exportOpen,
              deleteOpen: modal === "delete" ? true : s.ui.deleteOpen,
              editingId: modal === "edit" ? id : s.ui.editingId,
            },
          })),

        close: (modal) =>
          set((s) => ({
            ui: {
              ...s.ui,
              addOpen: modal === "add" ? false : s.ui.addOpen,
              editOpen: modal === "edit" ? false : s.ui.editOpen,
              importOpen: modal === "import" ? false : s.ui.importOpen,
              exportOpen: modal === "export" ? false : s.ui.exportOpen,
              deleteOpen: modal === "delete" ? false : s.ui.deleteOpen,
              editingId: modal === "edit" ? null : s.ui.editingId,
            },
          })),

        /* ------------------------------ Interop ------------------------------ */
        callContact: (id) => {
          const c = get().data.byId[id];
          if (!c) return;

          const number = pickPrimaryNumber(c);
          if (!number) return;

          // Lightweight shaping for the dialer’s "currentLead"
          const leadLike = {
            id: c.id,
            name: c.name || c.fullName || "Unknown",
            email: c.email || null,
            phones: [{ label: "Primary", e164: number, whatsapp: !!c.whatsapp }],
            preferredChannel: c.preferredChannel || "Calls",
            optIn: c.optIn || { email: true, sms: true, whatsapp: true, calls: true },
            timezone: c.timezone || null,
            ids: { leadId: c.leadId || null, crmId: c.crmId || null },
            location: c.location || null,
          };

          try {
            const d = useDialerStore.getState?.();
            if (!d) return;

            d.setCurrentLead?.(leadLike);
            d.setDialMeta?.({ iso: c.iso || null, language: c.language || null });
            d.setNumber?.(number);
            d.startCall?.();
          } catch {
            // swallow; interop optional
          }
        },
      }),
      {
        name: "contacts-store",
        version: 1,
        partialize: (state) => ({
          // Persist only the query prefs (UX nicety)
          query: state.query,
        }),
      }
    )
  )
);

/* ------------------------------ Pure selectors ------------------------------ */
/** Selects the full query object */
export const selectContactsQuery = (s) => s.query;

/** Selects *paged* rows based on current query (search, filters, sort, pagination) */
export const selectContactsPagedRows = (s) => {
  const { page, pageSize, sortBy, sortDir, search, filters } = s.query;
  const rows = s.data.order.map((id) => s.data.byId[id]).filter(Boolean);
  const filtered = applyFiltersArr(rows.filter((r) => matchesSearch(r, search)), filters);
  const sorted = [...filtered].sort((a, b) => compareContacts(a, b, sortBy, sortDir));
  const start = page * pageSize;
  const end = start + pageSize;
  return sorted.slice(start, end);
};

/** Total rows *after* filters/search (for pagination count) */
export const selectContactsFilteredCount = (s) => {
  const { search, filters } = s.query;
  const rows = s.data.order.map((id) => s.data.byId[id]).filter(Boolean);
  return applyFiltersArr(rows.filter((r) => matchesSearch(r, search)), filters).length;
};

/** Selected count (for bulk bar) */
export const selectContactsSelectedCount = (s) => s.selection.ids.size;

/** Returns true if the current page is fully selected */
export const selectIsPageFullySelected = (s) => {
  const pageRows = selectContactsPagedRows(s);
  if (!pageRows.length) return false;
  for (const r of pageRows) {
    if (!s.selection.ids.has(r.id)) return false;
  }
  return true;
};
