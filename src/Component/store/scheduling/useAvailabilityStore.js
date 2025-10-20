// Path: src/Component/store/scheduling/useAvailabilityStore.js
import { create } from "zustand";
import { attachPersistence } from "../../store/__persist__/persist";
import { usePoolsStore } from "./usePoolsStore";
import { generateSlotsFromRules } from "../../Meetings/utils/slotProbe";

// Simple id helper (if you need to seed new profiles later)
const rid = (pfx) => `${pfx}_${Math.random().toString(36).slice(2, 9)}`;

const initial = {
  profiles: [],   // [{ id, ownerType:'user'|'pool', ownerId, timezone, rules:[{weekday|weekdayJS, intervals:[{start,end}]}], overrides:[], minSlotIncrementMinutes }]
  loaded: false,
};

export const useAvailabilityStore = create((set, get) => ({
  ...initial,

  /** One-time fixture load; keep whatever is already persisted */
  loadFixtures: () => {
    if (get().loaded) return;
    // If you wanted to seed something for demo:
    // const demo = {
    //   id: "av_usr_alpha",
    //   ownerType: "user",
    //   ownerId: "usr_alpha",
    //   timezone: "Africa/Kampala",
    //   rules: [
    //     { weekdayJS: 2, intervals: [{ start: "09:30", end: "17:30" }] }, // Tue
    //     { weekdayJS: 3, intervals: [{ start: "09:30", end: "17:30" }] }, // Wed
    //     { weekdayJS: 4, intervals: [{ start: "09:30", end: "17:30" }] }, // Thu
    //     { weekdayJS: 5, intervals: [{ start: "09:30", end: "17:30" }] }, // Fri
    //     { weekdayJS: 6, intervals: [{ start: "09:30", end: "17:30" }] }, // Sat
    //   ],
    //   overrides: [],
    //   minSlotIncrementMinutes: 15,
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // };
    // set({ profiles: [demo, ...get().profiles], loaded: true });

    set({ loaded: true }); // respect whatever persistence already has
  },

  /** Insert or update a profile by id */
  upsertProfile: (profile) =>
    set((s) => {
      const idx = s.profiles.findIndex((p) => p.id === profile.id);
      const stamped = {
        ...profile,
        updatedAt: new Date().toISOString(),
        createdAt: s.profiles[idx]?.createdAt || new Date().toISOString(),
      };
      if (idx >= 0) {
        const next = [...s.profiles];
        next[idx] = { ...s.profiles[idx], ...stamped };
        return { profiles: next };
      }
      return { profiles: [stamped, ...s.profiles] };
    }),

  /** Look up a profile for an owner entity */
  getProfileByOwner: (ownerType, ownerId) =>
    get().profiles.find((p) => p.ownerType === ownerType && p.ownerId === ownerId),

  /**
   * Compute bookable slots.
   * - entity: { ownerType: 'user'|'pool', ownerId }
   * - window: { startDate:'YYYY-MM-DD', endDate:'YYYY-MM-DD' }
   * - opts: { slotSizeMinutes=30, bufferBeforeMinutes, bufferAfterMinutes }
   *
   * For 'user': generate from that user's weekly rules.
   * For 'pool': union the slots of all ACTIVE members who have profiles.
   */
  computeSlots: async (entity, window, opts = {}) => {
    const { ownerType, ownerId } = entity || {};
    const { startDate, endDate } = window || {};
    const { slotSizeMinutes = 30 } = opts;

    // Helper to generate for one profile
    const genForProfile = (profile) => {
      if (!profile) return { days: {}, slotSizeMinutes };
      const rules = Array.isArray(profile.rules) ? profile.rules : [];
      const tz = profile.timezone || "UTC";
      return generateSlotsFromRules(rules, tz, startDate, endDate, { slotSizeMinutes });
    };

    // USER: direct
    if (ownerType === "user") {
      const profile = get().getProfileByOwner("user", ownerId);
      return genForProfile(profile);
    }

    // POOL: union of active members with profiles
    if (ownerType === "pool") {
      const pool = usePoolsStore.getState().getById?.(ownerId);
      if (!pool) return { days: {}, slotSizeMinutes };

      const days = {};
      for (const m of pool.members || []) {
        if (!m?.isActive) continue;
        const prof = get().getProfileByOwner("user", m.userId);
        if (!prof) continue;

        const memberSlots = genForProfile(prof);
        for (const [date, arr] of Object.entries(memberSlots.days || {})) {
          const list = days[date] || (days[date] = []);
          if (Array.isArray(arr) && arr.length) list.push(...arr);
        }
      }

      // de-dupe by (start|end)
      for (const date of Object.keys(days)) {
        const seen = new Set();
        days[date] = days[date].filter((s) => {
          const k = `${s.start}|${s.end}`;
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
      }

      return { days, slotSizeMinutes };
    }

    // default
    return { days: {}, slotSizeMinutes };
  },
}));

attachPersistence(useAvailabilityStore, {
  key: "meetings.availability",
  select: (s) => ({ profiles: s.profiles, loaded: s.loaded }),
});
