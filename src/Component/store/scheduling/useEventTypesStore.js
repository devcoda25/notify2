/* Improved: src/Component/store/scheduling/useEventTypesStore.js */
import { create } from "zustand";
import { attachPersistence } from "../../store/__persist__/persist";
import baseFixtures from "../../Meetings/mocks/fixtures/eventTypes.fixtures.json";

const SEED = { target: 24 }; // total event types desired

const palette = [
  "#7c3aed", "#2563eb", "#10b981", "#eab308", "#ef4444", "#06b6d4",
  "#f43f5e", "#84cc16", "#8b5cf6", "#f97316", "#22c55e", "#0ea5e9",
];

const durations = [15, 20, 25, 30, 30, 30, 45, 45, 60, 60];
const locations = [
  ["google_meet"], ["zoom"], ["google_meet","zoom"], ["in_person"], ["phone"], ["google_meet","phone"],
];

function expand(fixtures) {
  const out = [...fixtures];
  let i = 0;
  while (out.length < SEED.target) {
    const dur = durations[i % durations.length];
    const col = palette[i % palette.length];
    const base = fixtures[i % fixtures.length] || fixtures[0];
    const id = `evt_auto_${i}`;
    out.push({
      ...base,
      id,
      name: `${base.name.split(" ")[0]} ${dur}m #${i + 1}`,
      slug: `${(base.slug || base.name || "type")
        .toLowerCase().replace(/\s+/g, "-")}-${dur}-${i + 1}`,
      color: col,
      durationMinutes: dur,
      bufferBeforeMinutes: (dur >= 45 ? 10 : 5),
      bufferAfterMinutes: (dur >= 45 ? 10 : 5),
      locations: locations[i % locations.length],
      active: Math.random() > 0.08,
      updatedAt: new Date().toISOString(),
      createdAt: base.createdAt || new Date().toISOString(),
    });
    i++;
  }
  return out;
}

const initial = {
  eventTypes: [],
  loaded: false,
};

export const useEventTypesStore = create((set, get) => ({
  ...initial,

  loadFixtures: () => {
    if (get().loaded) return;
    const full = expand(baseFixtures || []);
    set({ eventTypes: full, loaded: true });
  },

  createEventType: (data) => {
    const id = data.id || `evt_${Math.random().toString(36).slice(2, 10)}`;
    set((s) => ({ eventTypes: [{ ...data, id }, ...s.eventTypes] }));
    return id;
  },

  updateEventType: (id, patch) =>
    set((s) => ({
      eventTypes: s.eventTypes.map((e) => (e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e)),
    })),

  deleteEventType: (id) =>
    set((s) => ({
      eventTypes: s.eventTypes.filter((e) => e.id !== id),
    })),

  setActive: (id, active) => get().updateEventType(id, { active }),

  getById: (id) => get().eventTypes.find((e) => e.id === id),
}));

attachPersistence(useEventTypesStore, {
  key: "meetings.eventTypes",
  select: (s) => ({ eventTypes: s.eventTypes, loaded: s.loaded }),
});
