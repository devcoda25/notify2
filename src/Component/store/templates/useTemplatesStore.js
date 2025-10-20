// Path: src/Component/store/templates/useTemplatesStore.js

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import templatesFx from "../../templates/fixtures/templates.fixtures.json";
import variantsFx from "../../templates/fixtures/variants.fixtures.json";
import TYPES from "../../templates/constants/TEMPLATE_TYPES";
import CHANNELS from "../../templates/constants/CHANNELS";
import APPROVAL_STATES from "../../templates/constants/APPROVAL_STATES";

import { generateId } from "../../templates/core/idGen";
import { normalizeTemplate } from "../../templates/core/formatters";
import { saveToLocal, readFromLocal } from "../../templates/core/localStore";

import useApprovalsStore from "./useApprovalsStore";

const STORAGE_KEY = "notify.templates.v1";

// -------- helpers for demo generation --------
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randPast = (days = 60) => {
  const now = Date.now();
  const past = now - Math.floor(Math.random() * days * 86400000);
  return new Date(past).toISOString();
};

const CHANNEL_IDS = ["email", "sms", "whatsapp", "push", "platform"];
const STATUSES = ["Draft", "Submitted", "In-Review", "Approved", "Rejected"];
const TYPES_FALLBACK = ["transactional", "marketing", "system", "security", "announcement"];

const NAMES_BY_CHANNEL = {
  email: ["Welcome", "Password Reset", "Order Shipped", "Payment Receipt", "Weekly Digest", "Winback"],
  sms: ["OTP", "2FA Code", "Delivery ETA", "Balance Alert", "Promo Blast"],
  whatsapp: ["Promo", "Reactivation", "Survey", "Feedback", "Drop Reminder"],
  push: ["Reminder", "Release Notes", "Nudge", "Streak Alert", "Offer"],
  platform: ["In-app Alert", "Banner", "Interstitial", "Toast", "Modal"],
};

const DESCS = [
  "Automatically generated demo template.",
  "Used for QA and UI demos.",
  "Lorem ipsum placeholder content.",
  "Short copy with CTA.",
  "Localized variants included.",
];

const withChannelBackfill = (tpl) => {
  if (tpl.channel) return tpl;
  const ch = Array.isArray(tpl.channels) && tpl.channels.length ? tpl.channels[0] : "platform";
  return { ...tpl, channel: ch };
};

const makeVariants = (id, status) => {
  const langs = ["en", "fr", "es", "de"];
  const count = sample([1, 2, 2, 3]);
  const chosen = [...langs].sort(() => 0.5 - Math.random()).slice(0, count);
  return chosen.map((l) => ({
    id: `${id}-${l}`,
    lang: l,
    name: `${id.split("_")[0]} (${l.toUpperCase()})`,
    lastSubmittedAt: status !== "Draft" ? randPast(15) : null,
  }));
};

const makeTpl = ({ name, channel, status, type }) => {
  const id = generateId("tmpl");
  const createdAt = randPast(120);
  const updatedAt = randPast(30);
  const tags = [channel, status.toLowerCase()];
  const usageTotal = status === "Draft" ? 0 : rand(50, 50000);

  return normalizeTemplate(
    withChannelBackfill({
      id,
      name,
      description: `${sample(DESCS)} (${channel})`,
      type,
      status,
      version: 1,
      channel,
      channels: [channel],
      locales: ["en", "fr", "es", "de"].slice(0, sample([1, 2, 2, 3])),
      owner: sample(["You", "Ops", "Growth", "CRM", "Security"]),
      usage: { total: usageTotal },
      tags,
      createdAt,
      updatedAt,
      variants: makeVariants(id, status),
    })
  );
};

// Seed a small starter set (existing logic, kept)
const seedDemoTemplates = (existing = []) => {
  if (existing && existing.length > 1) return existing;
  const demo = [
    makeTpl({ name: "Welcome Email", channel: "email", status: "Approved", type: "transactional" }),
    makeTpl({ name: "OTP SMS", channel: "sms", status: "Approved", type: "security" }),
    makeTpl({ name: "WhatsApp Promo", channel: "whatsapp", status: "In-Review", type: "marketing" }),
    makeTpl({ name: "Push Reminder", channel: "push", status: "Rejected", type: "system" }),
    makeTpl({ name: "In-app Alert", channel: "platform", status: "Draft", type: "system" }),
    makeTpl({ name: "Order Shipped", channel: "email", status: "Submitted", type: "transactional" }),
  ];
  return [...demo, ...existing];
};

// -------- NEW: generate hundreds of mixed templates --------
const generateBulkDemoTemplates = (count = 300) => {
  const out = [];
  // Distribute across channels & statuses fairly
  for (let i = 0; i < count; i++) {
    const ch = CHANNEL_IDS[i % CHANNEL_IDS.length];
    const status = STATUSES[(i + Math.floor(Math.random() * 3)) % STATUSES.length]; // skew slightly
    const baseNames = NAMES_BY_CHANNEL[ch] || ["Template"];
    const name = `${sample(baseNames)} ${rand(1, 9999)}`;
    const type = (TYPES && Array.isArray(TYPES) && TYPES.length ? sample(TYPES) : sample(TYPES_FALLBACK));
    out.push(makeTpl({ name, channel: ch, status, type }));
  }
  return out.map(withChannelBackfill);
};

const initialState = () => {
  const saved = readFromLocal(STORAGE_KEY);
  if (saved && Array.isArray(saved.templates)) return saved;

  const templatesRaw = (templatesFx || []).map(normalizeTemplate);
  const seeded = seedDemoTemplates(templatesRaw).map(withChannelBackfill);
  const variants = variantsFx || [];
  return {
    templates: seeded,
    variants,
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
  };
};

const useTemplatesStore = create(
  persist(
    (set, get) => ({
      ...initialState(),

      // ---------- Query / Filters / Sort ----------
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

      // ---------- Selection ----------
      selectTemplate: (templateId) => set({ selectedTemplateId: templateId }),
      selectChannel: (channel) => set({ selectedChannel: channel }),

      // ---------- CRUD ----------
      createDraft: ({ name, type = "system", channels = [] }) =>
        set((s) => {
          const id = generateId("tmpl");
          const now = new Date().toISOString();
          const ch = channels.length ? channels : ["platform"];
          const t = withChannelBackfill({
            id,
            name,
            type,
            version: 1,
            status: "Draft",
            quality: "green",
            channel: ch[0],
            channels: ch,
            locales: ["en"],
            owner: "You",
            usage: { total: 0 },
            tags: ["draft"],
            createdAt: now,
            updatedAt: now,
            variants: [{ id: `${id}-en`, lang: "en", name: `${name} (EN)` }],
          });
          return { templates: [t, ...s.templates], selectedTemplateId: id };
        }),

      updateTemplate: (templateId, patch) =>
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === templateId ? withChannelBackfill({ ...t, ...patch, updatedAt: new Date().toISOString() }) : t
          ),
        })),

      duplicateTemplate: (templateId) =>
        set((s) => {
          const base = s.templates.find((t) => t.id === templateId);
          if (!base) return {};
          const id = generateId("tmpl");
          const now = new Date().toISOString();
          const copy = withChannelBackfill({
            ...base,
            id,
            name: base.name + " (Copy)",
            status: "Draft",
            version: 1,
            createdAt: now,
            updatedAt: now,
            tags: Array.from(new Set([...(base.tags || []), "copy"])),
          });
          return { templates: [copy, ...s.templates], selectedTemplateId: id };
        }),

      archiveTemplate: (templateId) =>
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === templateId ? { ...t, status: "Archived", updatedAt: new Date().toISOString() } : t
          ),
        })),

      // ---------- Variants ----------
      upsertVariant: (variant) =>
        set((s) => {
          const exists = s.variants.some(
            (v) => v.template_id === variant.template_id && v.channel === variant.channel
          );
          if (exists) {
            return {
              variants: s.variants.map((v) =>
                v.template_id === variant.template_id && v.channel === variant.channel ? { ...v, ...variant } : v
              ),
            };
          }
          return { variants: [...s.variants, variant] };
        }),

      removeVariant: (templateId, channel) =>
        set((s) => ({
          variants: s.variants.filter((v) => !(v.template_id === templateId && v.channel === channel)),
        })),

      // ---------- Derived ----------
      listForChannel: (channel) => {
        const { templates } = get();
        if (!channel || channel === "all") return templates.map(withChannelBackfill);
        return templates
          .map(withChannelBackfill)
          .filter((t) => (t.channels || []).includes(channel) || t.channel === channel);
      },

      searchAndFilter: () => {
        const { templates, query, filters } = get();
        const q = query.trim().toLowerCase();
        return templates
          .map(withChannelBackfill)
          .filter((t) => {
            if (q && !(t.name?.toLowerCase().includes(q) || t.id?.toLowerCase().includes(q))) return false;
            if (
              filters.channel !== "all" &&
              !((t.channels || []).includes(filters.channel) || t.channel === filters.channel)
            )
              return false;
            if (filters.type !== "all" && t.type !== filters.type) return false;
            if (filters.status !== "all" && (t.status || t.state) !== filters.status) return false;
            if (filters.locale !== "all" && !(t.locales || []).includes(filters.locale)) return false;
            if (filters.owner !== "all" && (t.owner || "unknown") !== filters.owner) return false;
            if (filters.hasDraft && (t.status || t.state) !== "Draft") return false;
            if (
              filters.requiresApproval &&
              !["whatsapp", "rcs"].some((ch) => (t.channels || []).includes(ch) || t.channel === ch)
            )
              return false;
            return true;
          });
      },

      // ---------- Demo hooks ----------
      seedDemoIfSparse: () =>
        set((s) => {
          const next = seedDemoTemplates(s.templates || []).map(withChannelBackfill);
          // Mirror approval states so views have content
          const approvals = useApprovalsStore.getState();
          approvals.ensureForTemplates(next);
          approvals.seedDemoForTemplates(next);
          return { templates: next };
        }),

        

      // NEW: blow away and generate N rich demo templates (hundreds)
      resetToBigDemo: (n = 300) =>
        set(() => {
          const generated = generateBulkDemoTemplates(n);
          const approvals = useApprovalsStore.getState();
          approvals.ensureForTemplates(generated);
          approvals.seedDemoForTemplates(generated);
          return {
            templates: generated,
            variants: variantsFx || [],
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
          };
        }),

      saveNow: () => saveToLocal(STORAGE_KEY, get()),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 3,
      migrate: (persisted) => {
        try {
          const templates = persisted?.templates || [];
          if (!templates.length || templates.length < 5) {
            // If sparse, generate a solid demo so your tables aren't empty
            const generated = generateBulkDemoTemplates(250);
            const approvals = useApprovalsStore.getState();
            approvals.ensureForTemplates(generated);
            approvals.seedDemoForTemplates(generated);
            return {
              templates: generated,
              variants: variantsFx || [],
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
            };
          }
          const fixed = templates.map(withChannelBackfill);
          const approvals = useApprovalsStore.getState();
          approvals.ensureForTemplates(fixed);
          approvals.seedDemoForTemplates(fixed);
          return { ...persisted, templates: fixed };
        } catch {
          const fresh = initialState();
          const approvals = useApprovalsStore.getState();
          approvals.ensureForTemplates(fresh.templates || []);
          approvals.seedDemoForTemplates(fresh.templates || []);
          return fresh;
        }
      },
      partialize: (s) => ({
        templates: s.templates,
        variants: s.variants,
        query: s.query,
        filters: s.filters,
        sort: s.sort,
        selectedTemplateId: s.selectedTemplateId,
        selectedChannel: s.selectedChannel,
      }),
    }
  )
);

export default useTemplatesStore;
