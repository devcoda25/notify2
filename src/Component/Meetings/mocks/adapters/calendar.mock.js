/**
 * Simulates Google/Outlook calendar "busy blocks" for users & pools — at scale.
 * Public API (unchanged):
 *  - getBusyBlocks({ ownerType, ownerId, start, end })
 *  - addBusyBlock(block)
 *  - removeBusyBlock(id)
 *  - clearAll()
 *
 * Extras (optional):
 *  - seedOwner(ownerType, ownerId)
 *  - seedMany({ owners, pastDays, futureDays })
 *  - setConfig(partialCfg)
 *
 * Times are ISO strings in UTC. Return shape mirrors common provider APIs.
 */
const usersFixtures = require("../fixtures/users.fixtures.json");

/** ── Config (override safely at runtime via window.MEETINGS_ADAPTERS?.calendar) ── */
const DEFAULT_CFG = {
  latencyMs: 220,
  ownersLimit: 120,         // seed first N users from fixtures
  pastDays: 60,             // seed range back
  futureDays: 45,           // seed range forward
  workHours: [8, 18],       // daily hour window for seeding
  blocksPerWeek: [6, 14],   // min/max blocks per week, on average
  blockMinutes: [20, 90],   // duration bounds
  onDemandSeed: true,       // seed an owner when first requested if missing
  deterministic: true,      // deterministic per-owner RNG for stable demos
  weekendLoadFactor: 0.25,  // weekends have less busy
};

const runtimeCfg =
  (typeof window !== "undefined" && window.MEETINGS_ADAPTERS && window.MEETINGS_ADAPTERS.calendar) || {};
let CFG = { ...DEFAULT_CFG, ...runtimeCfg };
function setConfig(patch = {}) { CFG = { ...CFG, ...patch }; }

const LATENCY_MS = () => CFG.latencyMs;

/** ── State ─────────────────────────────────────────────────────────────────── */
const inMemory = {
  // key => array of { id, start, end, summary?, source? }
  busyByOwner: new Map(),
};

const mkKey = (ownerType, ownerId) => `${ownerType}:${ownerId}`;

/** ── RNG helpers (per-owner deterministic by default) ──────────────────────── */
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededFromString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return mulberry32(h);
}
const pick = (rand, arr) => arr[Math.floor(rand() * arr.length)];
const randi = (rand, min, max) => Math.floor(rand() * (max - min + 1)) + min;

const uid = (prefix = "blk") =>
  `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e9)
    .toString(36)
    .padStart(6, "0")}`;

/** ── Time helpers ──────────────────────────────────────────────────────────── */
const toIso = (d) => new Date(d).toISOString().slice(0, 19) + "Z";
const addMin = (iso, m) => toIso(new Date(new Date(iso).getTime() + m * 60000));
const clip = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function dayIterator(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const arr = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    arr.push(new Date(d));
  }
  return arr;
}

/** ── Core seeding ─────────────────────────────────────────────────────────── */
function seedOwner(ownerType, ownerId, opts = {}) {
  const key = mkKey(ownerType, ownerId);
  if (inMemory.busyByOwner.has(key)) return; // already done

  const {
    pastDays = CFG.pastDays,
    futureDays = CFG.futureDays,
    blocksPerWeek = CFG.blocksPerWeek,
    blockMinutes = CFG.blockMinutes,
    workHours = CFG.workHours,
    deterministic = CFG.deterministic,
    weekendLoadFactor = CFG.weekendLoadFactor,
  } = opts;

  const rand = deterministic ? seededFromString(key) : Math.random;

  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - pastDays);
  startDate.setUTCHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setUTCDate(endDate.getUTCDate() + futureDays);
  endDate.setUTCHours(23, 59, 59, 0);

  const perWeek = randi(rand, blocksPerWeek[0], blocksPerWeek[1]);
  const perDayAvg = perWeek / 5; // concentrate on weekdays
  const out = [];

  const days = dayIterator(startDate, endDate);
  for (const d of days) {
    const wday = d.getUTCDay(); // 0 Sun .. 6 Sat
    const isWeekend = wday === 0 || wday === 6;

    // Number of blocks today
    const lambda = isWeekend ? perDayAvg * weekendLoadFactor : perDayAvg;
    const todaysBlocks = clip(Math.round(lambda + (rand() - 0.5) * 1.2), 0, 4);
    if (todaysBlocks <= 0) continue;

    const dayStart = new Date(d);
    const [hStart, hEnd] = workHours;
    const minHour = hStart;
    const maxHour = hEnd;

    // generate simple non-overlapping blocks
    const taken = [];
    for (let i = 0; i < todaysBlocks; i++) {
      const hour = randi(rand, minHour, maxHour - 1);
      const minute = [0, 15, 30, 45][randi(rand, 0, 3)];
      const dur = randi(rand, blockMinutes[0], blockMinutes[1]);
      const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), hour, minute, 0));
      const end = new Date(start.getTime() + dur * 60000);

      // avoid obvious overlaps quickly
      const s = start.getTime();
      const e = end.getTime();
      const collides = taken.some(([ts, te]) => ts < e && s < te);
      if (collides) continue;
      taken.push([s, e]);

      out.push({
        id: uid(),
        start: toIso(start),
        end: toIso(end),
        summary: pick(rand, ["Busy", "Hold", "Internal", "Out of office", "Focus"]),
        source: pick(rand, ["google", "outlook", "mock"]),
      });
    }
  }

  // store sorted
  out.sort((a, b) => new Date(a.start) - new Date(b.start));
  inMemory.busyByOwner.set(key, out);
}

function seedMany({ owners, pastDays, futureDays } = {}) {
  const list =
    owners ||
    (usersFixtures || [])
      .slice(0, CFG.ownersLimit)
      .map((u) => ({ ownerType: "user", ownerId: u.id }));
  list.forEach((o) => seedOwner(o.ownerType, o.ownerId, { pastDays, futureDays }));
}

/** ── Public API (compat) ───────────────────────────────────────────────────── */
async function getBusyBlocks({ ownerType, ownerId, start, end }) {
  await new Promise((r) => setTimeout(r, LATENCY_MS()));
  const key = mkKey(ownerType, ownerId);

  // Lazy seed if needed
  if (CFG.onDemandSeed && !inMemory.busyByOwner.has(key)) {
    seedOwner(ownerType, ownerId);
  }

  const arr = inMemory.busyByOwner.get(key) || [];
  if (!start || !end) return arr.slice();

  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return arr.filter((b) => {
    const bs = new Date(b.start).getTime();
    const be = new Date(b.end).getTime();
    return bs < e && s < be;
  });
}

function addBusyBlock(block) {
  const { ownerType, ownerId } = block;
  const key = mkKey(ownerType, ownerId);
  const arr = inMemory.busyByOwner.get(key) || [];
  const id = block.id || uid();
  const normalized = {
    id,
    start: new Date(block.start).toISOString(),
    end: new Date(block.end).toISOString(),
    summary: block.summary || "Busy",
    source: block.source || "mock",
  };
  arr.push(normalized);
  arr.sort((a, b) => new Date(a.start) - new Date(b.start));
  inMemory.busyByOwner.set(key, arr);
  return { ...normalized, ownerType, ownerId };
}

function removeBusyBlock(id) {
  for (const [key, arr] of inMemory.busyByOwner) {
    const idx = arr.findIndex((b) => b.id === id);
    if (idx >= 0) {
      const [removed] = arr.splice(idx, 1);
      inMemory.busyByOwner.set(key, arr);
      return removed;
    }
  }
  return null;
}

function clearAll() {
  inMemory.busyByOwner.clear();
}

/** ── Initial seed (bulk) ───────────────────────────────────────────────────── */
seedMany(); // seed first N users for instant “hundreds of blocks” UX

module.exports = {
  // public (compat)
  getBusyBlocks,
  addBusyBlock,
  removeBusyBlock,
  clearAll,
  // extras
  seedOwner,
  seedMany,
  setConfig,
  __state: inMemory,
};
