// Path: /src/Component/Meetings/utils/poolAssignment.js
/**
 * Client-only pool assignment helpers:
 *  - roundRobin(poolId, members)
 *  - leastLoad(poolId, members)
 *  - bySkills(poolId, members, requiredSkills = [])
 *
 * Member shape (suggested):
 *  { userId: "usr_alpha", isActive: true, weight?: 1, skills?: ["sales","en"], load?: number }
 */

const state = {
  rrIndex: new Map(),   // poolId -> index
  loads: new Map(),     // poolId -> Map<userId, number>
};

function _active(m) {
  return Array.isArray(m) ? m.filter((x) => x && x.isActive !== false) : [];
}

function roundRobin(poolId, members = []) {
  const actives = _active(members);
  if (!actives.length) return null;

  const idx = state.rrIndex.get(poolId) ?? 0;
  const chosen = actives[idx % actives.length];
  state.rrIndex.set(poolId, (idx + 1) % actives.length);
  _bumpLoad(poolId, chosen.userId, 1);
  return chosen;
}

function leastLoad(poolId, members = []) {
  const actives = _active(members);
  if (!actives.length) return null;

  const loads = _ensureLoadMap(poolId);
  let best = null;
  let bestLoad = Infinity;

  for (const m of actives) {
    const l = loads.get(m.userId) ?? 0;
    if (l < bestLoad) {
      best = m;
      bestLoad = l;
    }
  }

  if (best) _bumpLoad(poolId, best.userId, 1);
  return best;
}

function bySkills(poolId, members = [], required = []) {
  const req = new Set((required || []).map((s) => String(s).toLowerCase()));
  const actives = _active(members).filter((m) => {
    if (!req.size) return true;
    const skills = new Set((m.skills || []).map((s) => String(s).toLowerCase()));
    for (const s of req) if (!skills.has(s)) return false;
    return true;
  });

  if (!actives.length) return null;
  // among qualified, pick least loaded
  const loads = _ensureLoadMap(poolId);
  let best = null;
  let bestLoad = Infinity;
  for (const m of actives) {
    const l = loads.get(m.userId) ?? 0;
    if (l < bestLoad) {
      best = m;
      bestLoad = l;
    }
  }
  if (best) _bumpLoad(poolId, best.userId, 1);
  return best;
}

/** Resets tracking for a pool (useful in tests/dev). */
function resetPool(poolId) {
  state.rrIndex.delete(poolId);
  state.loads.delete(poolId);
}

/** Internal */
function _ensureLoadMap(poolId) {
  if (!state.loads.has(poolId)) state.loads.set(poolId, new Map());
  return state.loads.get(poolId);
}
function _bumpLoad(poolId, userId, delta) {
  const loads = _ensureLoadMap(poolId);
  loads.set(userId, (loads.get(userId) ?? 0) + delta);
}

module.exports = {
  roundRobin,
  leastLoad,
  bySkills,
  resetPool,
};
