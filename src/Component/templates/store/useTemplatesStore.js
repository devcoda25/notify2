// Path: src/Component/templates/store/useTemplatesStore.js

import { create } from "zustand";

const withChannelBackfill = (tpl) => {
  if (tpl.channel) return tpl;
  const ch = Array.isArray(tpl.channels) && tpl.channels.length ? tpl.channels[0] : "platform";
  return { ...tpl, channel: ch };
};

const useTemplatesStore = create((set, get) => ({
  templates: [],
  totalCount: 0,
  loading: false,
  error: null,
  query: "",
  filters: {
    channel: "all",
    type: "all",
    status: "all",
    locale: "all",
    owner: "all",
    hasDraft: false,
    requiresApproval: false,
  },
  sort: { by: "updatedAt", dir: "desc" },
  selectedTemplateId: null,
  selectedChannel: "all",

  // --- Simple state setters to be called by the API hook ---

  setTemplates: (templates, totalCount) => set({
    templates: (templates || []).map(withChannelBackfill),
    totalCount: totalCount || (templates || []).length,
    loading: false,
    error: null,
  }),

  addTemplate: (template) => set((state) => ({
    templates: [withChannelBackfill(template), ...state.templates],
    totalCount: state.totalCount + 1,
  })),

  updateTemplateState: (templateId, updatedData) => set((state) => ({
    templates: state.templates.map((t) =>
      t.id === templateId ? withChannelBackfill({ ...t, ...updatedData }) : t
    ),
  })),

  removeTemplate: (templateId) => set((state) => ({
    templates: state.templates.filter((t) => t.id !== templateId),
    totalCount: state.totalCount - 1,
  })),

  upsertTemplate: (template) => set((state) => {
    const exists = state.templates.some(t => t.id === template.id);
    if (exists) {
      return {
        templates: state.templates.map(t => t.id === template.id ? withChannelBackfill(template) : t)
      };
    }
    return { templates: [withChannelBackfill(template), ...state.templates] };
  }),

  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (error) => set({ error, loading: false }),


  // --- UI state setters ---

  setQuery: (q) => set({ query: q ?? "" }),
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  clearFilters: () =>
    set((s) => ({
      filters: {
        ...s.filters,
        channel: "all",
        type: "all",
        status: "all",
        locale: "all",
        owner: "all",
        hasDraft: false,
        requiresApproval: false,
      },
    })),
  setSort: (by, dir) => set({ sort: { by, dir } }),
  selectTemplate: (templateId) => set({ selectedTemplateId: templateId }),
  selectChannel: (channel) => set({ selectedChannel: channel }),

  // --- Derived selector ---
  listForChannel: (channel) => {
    const { templates } = get();
    if (!channel || channel === "all") return templates.map(withChannelBackfill);
    return templates
      .map(withChannelBackfill)
      .filter((t) => (t.channels || []).includes(channel) || t.channel === channel);
  },

}));

export default useTemplatesStore;
