import { create } from "zustand";
import { subscribeWithSelector, persist } from "zustand/middleware";

// If/when you move the dialer store under ./store, update this import.
// Current tree shows it at: src/Component/dailer/store/useDialerStore.js
import { normalizeContact } from "../utils/mappers";
import { useDialerStore } from "../../store/useDialerStore";

/* --------------------------------- Utils ---------------------------------- */

function genContactId() {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

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
          sortBy: "updatedAt", // 'updatedAt' | 'fullName' | 'createdAt'
          sortDir: "desc", // 'asc' | 'desc'
          page: 0,
          pageSize: 10,
          filters: {},
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

        getSelectedCount: () => get().selection.ids.size,

        /* ------------------------------ Actions ----------------------------- */

        // Data
        hydrate: (list = [], totalCount = 0) => {
          set((s) => {
            const newById = {};
            const newOrder = [];
            list.forEach((c) => {
              const id = c?.id ?? genContactId();
              newById[id] = normalizeContact({ id, ...c });
              newOrder.push(id);
            });

            return {
              data: {
                ...s.data,
                byId: newById, // Replace, don't append
                order: newOrder, // Replace, don't append
                total: totalCount, // Set total from API response
                loading: false,
                error: null,
              },
            };
          });
        },

        setLoading: (loading = true) =>
          set((s) => ({ data: { ...s.data, loading } })),

        setError: (error = null) =>
          set((s) => ({ data: { ...s.data, error } })),

        addContact: (contact) => {
          const normalizedContact = normalizeContact(contact); // Normalize the incoming contact
          const id = normalizedContact?.id ?? genContactId();
          set((s) => {
            if (s.data.byId[id]) {
              // already exists; do update
              return {
                data: {
                  ...s.data,
                  byId: { ...s.data.byId, [id]: { ...s.data.byId[id], ...normalizedContact, id } },
                },
              };
            }
            return {
              data: {
                ...s.data,
                byId: { ...s.data.byId, [id]: { id, ...normalizedContact } },
                order: [id, ...s.data.order],
                total: (s.data.total || 0) + 1,
              },
            };
          });
        },

        updateContact: (id, patch) =>
          set((s) => {
            const existingContact = s.data.byId[id];
            if (!existingContact) return {}; // Contact not found

            const updatedContact = { ...existingContact, ...patch };
            const normalizedUpdatedContact = normalizeContact(updatedContact); // Normalize the updated contact

            return {
              data: {
                ...s.data,
                byId: { ...s.data.byId, [id]: normalizedUpdatedContact },
              },
            };
          }),

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
            const byId = { ...s.data.byId };
            let removed = 0;
            ids.forEach((id) => {
              if (byId[id]) {
                delete byId[id];
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
          set((s) => ({ query: { ...s.query, ...next, page: 0 } })),

        mergeQuery: (patch) =>
          set((s) => ({ query: { ...s.query, ...patch } })),

        resetQuery: () =>
          set(() => ({
            query: {
              search: "",
              sortBy: "updatedAt",
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
          query: state.query,
        }),
      }
    )
  )
);

/* ------------------------------ Pure selectors ------------------------------ */
export const selectContactsQuery = (s) => s.query;

export const selectContactsPagedRows = (s) => {
  const { byId, order } = s.data;
  return order.map((id) => byId[id]).filter(Boolean);
};

export const selectContactsFilteredCount = (s) => s.data.total;

export const selectContactsSelectedCount = (s) => s.selection.ids.size;

export const selectIsPageFullySelected = (s) => {
  const pageRows = selectContactsPagedRows(s);
  if (!pageRows.length) return false;
  for (const r of pageRows) {
    if (!s.selection.ids.has(r.id)) return false;
  }
  return true;
};
