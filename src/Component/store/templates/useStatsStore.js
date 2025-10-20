// src/Component/store/templates/useStatsStore.js

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import usageFx from "../../templates/fixtures/usage.fixtures.json";

const STORAGE_KEY = "notify.templates.stats.v1";

const safeKpis = (k = {}) => ({
  sends: k.sends || 0,
  delivered: k.delivered || 0,
  opened: k.opened || 0,
  clicked: k.clicked || 0,
  replied: k.replied || 0,
  optOuts: k.optOuts || 0,
});

const useStatsStore = create(
  persist(
    (set, get) => ({
      // Maps: templateId -> KPI & time series (frontend-only)
      kpis: usageFx?.kpis || {}, // { [templateId]: { sends, delivered, opened, clicked, replied, optOuts } }
      series: usageFx?.series || {}, // { [templateId]: [{ t, sends, delivered, ...}, ...] }

      // Increment helpers (used by TestSendModal / simulations)
      recordSend: (templateId, counts = { sends: 1 }) =>
        set((s) => ({
          kpis: {
            ...s.kpis,
            [templateId]: (() => {
              const cur = safeKpis(s.kpis?.[templateId]);
              return { ...cur, sends: cur.sends + (counts.sends || 1) };
            })(),
          },
        })),

      recordDelivery: (templateId, n = 1) =>
        set((s) => ({
          kpis: {
            ...s.kpis,
            [templateId]: (() => {
              const cur = safeKpis(s.kpis?.[templateId]);
              return { ...cur, delivered: cur.delivered + n };
            })(),
          },
        })),

      recordOpen: (templateId, n = 1) =>
        set((s) => ({
          kpis: {
            ...s.kpis,
            [templateId]: (() => {
              const cur = safeKpis(s.kpis?.[templateId]);
              return { ...cur, opened: cur.opened + n };
            })(),
          },
        })),

      recordClick: (templateId, n = 1) =>
        set((s) => ({
          kpis: {
            ...s.kpis,
            [templateId]: (() => {
              const cur = safeKpis(s.kpis?.[templateId]);
              return { ...cur, clicked: cur.clicked + n };
            })(),
          },
        })),

      recordReply: (templateId, n = 1) =>
        set((s) => ({
          kpis: {
            ...s.kpis,
            [templateId]: (() => {
              const cur = safeKpis(s.kpis?.[templateId]);
              return { ...cur, replied: cur.replied + n };
            })(),
          },
        })),

      recordOptOut: (templateId, n = 1) =>
        set((s) => ({
          kpis: {
            ...s.kpis,
            [templateId]: (() => {
              const cur = safeKpis(s.kpis?.[templateId]);
              return { ...cur, optOuts: cur.optOuts + n };
            })(),
          },
        })),

      // series append (for charts)
      pushPoint: (templateId, point) =>
        set((s) => ({
          series: {
            ...s.series,
            [templateId]: [...(s.series?.[templateId] || []), point],
          },
        })),

      resetStats: () => set({ kpis: {}, series: {} }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStatsStore;
