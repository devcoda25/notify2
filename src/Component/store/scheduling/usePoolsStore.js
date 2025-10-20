/* Improved: src/Component/store/scheduling/usePoolsStore.js */
import { create } from "zustand";
import { attachPersistence } from "../../store/__persist__/persist";
import usersFixtures from "../../Meetings/mocks/fixtures/users.fixtures.json";
import { roundRobin, leastLoad, bySkills, resetPool } from "../../Meetings/utils/poolAssignment";

/** scale knobs */
const SEED = {
  pools: 12,
  membersPerPool: [6, 16], // min,max
};
const randi = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const id = (pfx) => `${pfx}_${Math.random().toString(36).slice(2, 9)}`;

const SKILLS = ["sales", "support", "demo", "en", "fr", "es", "de", "enterprise", "smb", "api"];

function seedPools() {
  const out = [];
  for (let i = 0; i < SEED.pools; i++) {
    const members = [];
    const n = randi(SEED.membersPerPool[0], SEED.membersPerPool[1]);
    for (let k = 0; k < n; k++) {
      const u = pick(usersFixtures);
      const uniqSkills = Array.from(new Set(Array.from({ length: randi(1, 3) }, () => pick(SKILLS))));
      members.push({
        userId: u.id,
        isActive: Math.random() > 0.06,
        weight: randi(1, 3),
        skills: uniqSkills,
        // optional load tracking fields can be added by assignment utils
      });
    }
    out.push({
      id: id("pool"),
      name: `Pool ${i + 1}`,
      type: Math.random() > 0.2 ? "round_robin" : "collective",
      slug: `pool-${i + 1}`,
      members,
      distribution: pick(["longest_idle", "least_load", "round_robin"]),
      timezone: pick(["UTC", "America/New_York", "Europe/London", "Africa/Kampala"]),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return out;
}

const initial = {
  pools: [],
  loaded: false,
};

export const usePoolsStore = create((set, get) => ({
  ...initial,

  loadFixtures: () => {
    if (get().loaded) return;
    set({ pools: seedPools(), loaded: true });
  },

  createPool: (data) => {
    const _id = data.id || id("pool");
    set((s) => ({ pools: [{ ...data, id: _id }, ...s.pools] }));
    return _id;
  },

  updatePool: (idX, patch) =>
    set((s) => ({
      pools: s.pools.map((p) => (p.id === idX ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)),
    })),

  deletePool: (idX) =>
    set((s) => ({ pools: s.pools.filter((p) => p.id !== idX) })),

  getById: (idX) => get().pools.find((p) => p.id === idX),

  /** Assignment helpers (client-only) */
  pickMemberRoundRobin: (poolId) => {
    const pool = get().getById(poolId);
    return pool ? roundRobin(poolId, pool.members || []) : null;
  },
  pickMemberLeastLoad: (poolId) => {
    const pool = get().getById(poolId);
    return pool ? leastLoad(poolId, pool.members || []) : null;
  },
  pickMemberBySkills: (poolId, skills = []) => {
    const pool = get().getById(poolId);
    return pool ? bySkills(poolId, pool.members || [], skills) : null;
  },
  resetLoadTracking: (poolId) => resetPool(poolId),
}));

attachPersistence(usePoolsStore, {
  key: "meetings.pools",
  select: (s) => ({ pools: s.pools, loaded: s.loaded }),
});
