/**
 * Git-like TREE model (no merges back), time-aware zoom, heavy demo seeding.
 * Trunk is conceptually the center line; languages are split so that
 * some appear ABOVE the trunk and others BELOW (roughly equal halves).
 * We DO NOT mirror lanes; the sets above/below are different.
 */

export const STATUS_COLORS = {
  Approved: "#16a34a",
  Rejected: "#dc2626",      // destructive
  "In-Review": "#d97706",
  Submitted: "#f59e0b",
  Pending: "#9ca3af",
  Draft: "#6b7280",
  Edited: "#3b82f6",
  Created: "#22c55e",
  Deprecated: "#a855f7",    // destructive-ish / terminal
  default: "#64748b",
};

export const ACTION_TO_STATE = {
  create: "Created",
  edit: "Edited",
  submit: "Submitted",
  review: "In-Review",
  approve: "Approved",
  reject: "Rejected",
  withdraw: "Pending",
  deprecate: "Deprecated",
};

const toTs = (v) => {
  const t = v?.at ?? v?.date ?? v?.timestamp;
  return Number.isFinite(t) ? t : new Date(t || Date.now()).getTime();
};

const rnd = (min, max) => Math.random() * (max - min) + min;
const choice = (arr) => arr[Math.floor(rnd(0, arr.length))];

/* ----------------------------- DEMO SEEDING ----------------------------- */

const ACTORS = [
  "Alice","Bob","Carol","Diego","Eve","Faye",
  "Grace","Hiro","Ivy","Jamal","Kira","Liam",
];

const PROVIDERS = ["Meta","WATI","SMS.to","Submail","FCM","Internal Review"];

/**
 * seedForestData(now, {heavy})
 * Builds a template + many branches that never merge back to trunk.
 * Lanes: we assign incremental integers for variants (1..N). Trunk is 0.
 * For layout, we split the set of variant lanes into TOP and BOTTOM halves
 * (different languages each side; NOT mirrored).
 */
export function seedForestData(now = Date.now(), { heavy = true } = {}) {
  const day = 24 * 60 * 60 * 1000;

  const template = {
    id: "tpl-forest-001",
    name: "Comms: Welcome / Nudge / Recovery",
    channel: "whatsapp",
    type: "transactional",
  };

  const totalVariants = heavy ? 10 : 6;
  const langs = ["en","es","fr","de","pt","id","th","hi","ar","jp"];
  const variants = Array.from({ length: totalVariants }, (_, i) => {
    const code = langs[i % langs.length].toUpperCase();
    return {
      id: `VAR-${code}`,
      lang: code.toLowerCase(),
      name: `Variant ${code}`,
    };
  });

  // Lane numbers 1..N for variants (no sign semantics here)
  const laneOfVariant = new Map();
  variants.forEach((v, i) => laneOfVariant.set(v.id, i + 1));

  const events = [];
  const E = (id, at, lane, state, extra = {}) => ({ id, at, lane, state, ...extra });

  // Trunk lifecycle — strictly monotonic time
  let t = now - 365 * day;
  const trunk = [];
  const trunkSteps = heavy ? 18 : 10;
  for (let i = 0; i < trunkSteps; i++) {
    const kind = i === 0 ? "create" : (Math.random() < 0.12 ? "deprecate" : "edit");
    const state = ACTION_TO_STATE[kind];
    const actor = choice(ACTORS);
    const id = `trunk-${String(i + 1).padStart(3,"0")}`;
    trunk.push(E(id, t, 0, state, {
      action: kind,
      actor,
      label: state,
      name: template.name,         // for name(id)
      sub: `by ${actor} • ${new Date(t).toLocaleString()}`,
      tag: id,
    }));
    events.push(trunk[trunk.length - 1]);
    // next time (monotonic)
    t += rnd(5, 25) * day;
  }

  // Branch lifecycles (never merging back)
  variants.forEach((variant) => {
    const lane = laneOfVariant.get(variant.id);

    // pick a trunk point to fork from (not the first, to avoid overlap)
    const forkIdx = Math.min(2, trunk.length - 1);
    const trunkFork = trunk[forkIdx] || trunk[0];
    const forkTime = trunkFork.at + rnd(1, 5) * day; // always after trunk creation

    const steps = heavy ? Math.floor(rnd(10, 18)) : Math.floor(rnd(6, 12));
    let vt = forkTime; // branch time cursor (monotonic)

    // First node: Created (strict causality)
    let id = `${variant.lang.toLowerCase()}-001`;
    let actor = choice(ACTORS);
    let node = E(id, vt, lane, "Created", {
      action: "create",
      actor,
      variantId: variant.id,
      label: "Created",
      name: variant.name,        // for name(id)
      sub: `by ${actor} • ${new Date(vt).toLocaleString()}`,
      tag: id,
      parents: [trunkFork.id],
    });
    events.push(node);

    // Subsequent nodes: strictly increasing time
    let previous = node;
    for (let s = 2; s <= steps; s++) {
      // advance time (sometimes shorter hops)
      vt += rnd(2, 35) * day * (Math.random() < 0.25 ? 0.2 : 1);

      const roll = Math.random();
      const kind =
        roll < 0.16 ? "edit" :
        roll < 0.40 ? "submit" :
        roll < 0.60 ? "review" :
        roll < 0.78 ? "approve" :
        roll < 0.92 ? "reject" :
        "deprecate";

      const state = ACTION_TO_STATE[kind];
      const actor2 = choice(ACTORS);
      const provider = Math.random() < 0.6 ? choice(PROVIDERS) : null;

      id = `${variant.lang.toLowerCase()}-${String(s).padStart(3,"0")}`;
      node = E(id, vt, lane, state, {
        action: kind,
        actor: actor2,
        target: provider,
        variantId: variant.id,
        label: provider
          ? `${state} ${kind === "submit" ? "to" : "by"} ${provider}`
          : state,
        name: variant.name,      // for name(id)
        sub: `by ${actor2}${provider ? ` • ${provider}` : ""} • ${new Date(vt).toLocaleString()}`,
        tag: id,
        parents: [previous.id],
      });
      events.push(node);
      previous = node;

      // Destructive actions end the branch
      if (state === "Deprecated" || state === "Rejected") break;
    }
  });

  return { template, variants, events };
}

/* ------------------------- NORMALIZATION & LAYOUT ------------------------- */

export function normalizeEvents(input = {}) {
  const { template, variants = [], events = [] } = input;
  const tplId = template?.id ?? "tpl-forest-001";
  const vMap = new Map(variants.map(v => [v.id, v]));
  const ev = events.length ? events : seedForestData(Date.now(), { heavy: false }).events;

  const nodes = ev
    .map((e) => {
      const at = toTs(e);
      const variant = e.variantId ? vMap.get(e.variantId) : null;
      const nodeName =
        e.name ??
        (variant ? variant.name : (template?.name || tplId));

      return {
        id: e.id || `${tplId}:${at}:${e.lane}`,
        at,
        state: e.state || "Edited",
        action: e.action || null,
        actor: e.actor || null,
        target: e.target || null,
        label: e.label || e.state,
        sub: e.sub || null,
        name: nodeName,
        commitId: e.id || null,
        templateId: tplId,
        variantId: e.variantId || null,
        lane: Number.isFinite(e.lane) ? e.lane : 0,
        parents: Array.isArray(e.parents) ? e.parents : [],
        synthetic: !!e.synthetic,
        kind: "event",
        tag: e.tag || e.id || "",
      };
    })
    .sort((a, b) => a.at - b.at || a.lane - b.lane);

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const byLane = new Map();
  nodes.forEach((n) => {
    const arr = byLane.get(n.lane) || [];
    arr.push(n);
    byLane.set(n.lane, arr);
  });

  // Prefer explicit parents; we'll repair missing ones later
  const links = [];
  for (const n of nodes) {
    for (const pid of n.parents) {
      const p = byId.get(pid);
      if (!p) continue;
      links.push({
        source: pid,
        target: n.id,
        l1: p.lane,
        l2: n.lane,
        t1: p.at,
        t2: n.at,
        sameLane: p.lane === n.lane,
        type: p.lane === n.lane ? "progress" : "fork",
      });
    }
  }

  const laneSet = new Set(nodes.map((n) => n.lane));

  return { nodes, links, laneSet, template, variants };
}

/**
 * Ensure:
 * - No node is isolated (every node has a parent or child).
 * - First node of each non-trunk lane has a parent (trunk or synthetic Created).
 * - Time is strictly causal within a lane.
 */
export function repairGraphConsistency(graph) {
  const nodes = [...graph.nodes].sort((a,b) => a.at - b.at || a.lane - b.lane);
  const byId = new Map(nodes.map(n => [n.id, n]));
  const byLane = new Map();
  nodes.forEach(n => {
    if (!byLane.has(n.lane)) byLane.set(n.lane, []);
    byLane.get(n.lane).push(n);
  });

  const trunk = byLane.get(0) || [];
  const findNearestTrunkBefore = (t) => {
    let lo = null;
    for (const n of trunk) if (n.at <= t) lo = n;
    return lo || trunk[0] || null;
  };

  // Repair per lane
  for (const [lane, arr] of byLane) {
    // ensure strictly increasing time on lane
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].at <= arr[i-1].at) {
        arr[i].at = arr[i-1].at + 1; // 1 ms after previous
      }
    }

    if (lane === 0) continue; // trunk ok

    // Ensure first lane node has a parent
    const first = arr[0];
    if (!first.parents?.length) {
      const trunkP = findNearestTrunkBefore(first.at);
      if (trunkP) {
        first.parents = [trunkP.id];
      } else {
        // synthesize a Created parent just before first.at
        const sid = `${first.id}-CREATED`;
        const created = {
          ...first,
          id: sid,
          at: first.at - 1,
          state: "Created",
          action: "create",
          label: "Created",
          sub: first.sub?.replace(/^by /, "created by ") || "created",
          parents: [trunk[0]?.id].filter(Boolean),
          synthetic: true,
        };
        byId.set(sid, created);
        arr.unshift(created);
        nodes.push(created);
        first.parents = [sid];
      }
    }

    // Ensure all others are chained if parents missing
    for (let i = 1; i < arr.length; i++) {
      const n = arr[i];
      if (!n.parents?.length) n.parents = [arr[i - 1].id];
    }
  }

  // Rebuild links from parents
  const links = [];
  for (const n of nodes) {
    for (const pid of n.parents || []) {
      const p = byId.get(pid);
      if (!p) continue;
      links.push({
        source: p.id,
        target: n.id,
        l1: p.lane, l2: n.lane,
        t1: p.at,   t2: n.at,
        sameLane: p.lane === n.lane,
        type: p.lane === n.lane ? "progress" : "fork",
      });
    }
  }

  const laneSet = new Set(nodes.map((n) => n.lane));
  nodes.sort((a,b) => a.at - b.at || a.lane - b.lane);
  return { ...graph, nodes, links, laneSet };
}

/**
 * layoutGraph
 * Returns helpers:
 *  - laneY(lane): trunk centered; some languages above, others below (not mirrored)
 *  - orderedLanes: top→bottom for grid rendering
 *  - extent, width/height, etc.
 */
export function layoutGraph(graph, opts = {}) {
  const {
    width = 1600,
    height = 540,
    laneGap = 80,
    padding = { left: 64, right: 32, top: 28, bottom: 28 },
  } = opts;

  if (!graph || !graph.nodes?.length) {
    return {
      ...graph,
      nodes: [],
      links: [],
      extent: [0, 1],
      width, height, padding, laneGap,
      orderedLanes: [0],
      laneY: () => padding.top + laneGap / 2,
    };
  }

  const times = graph.nodes.map((n) => n.at);
  const minT = Math.min(...times);
  const maxT = Math.max(...times);

  const lanes = [...graph.laneSet].sort((a,b) => a - b);
  // Remove trunk for splitting
  const variantLanes = lanes.filter(l => l !== 0);

  // Split into roughly equal halves: top and bottom (NOT mirrored)
  const half = Math.ceil(variantLanes.length / 2);
  const topLanes = variantLanes.slice(0, half);
  const bottomLanes = variantLanes.slice(half);

  // Row mapping: [top..., trunk, bottom...]
  const laneRowMap = new Map();
  let row = 0;
  for (const l of topLanes) laneRowMap.set(l, row++);
  laneRowMap.set(0, row++); // trunk in the middle
  for (const l of bottomLanes) laneRowMap.set(l, row++);

  const laneRow = (lane) => laneRowMap.get(lane) ?? 0;
  const laneY = (lane) => padding.top + laneRow(lane) * laneGap + laneGap / 2;

  const orderedLanes = [...topLanes, 0, ...bottomLanes];

  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const links = (graph.links || []).map((e) => {
    const s = byId.get(e.source);
    const t = byId.get(e.target);
    return {
      ...e,
      t1: e.t1 ?? s?.at ?? minT,
      t2: e.t2 ?? t?.at ?? maxT,
      l1: e.l1 ?? s?.lane ?? 0,
      l2: e.l2 ?? t?.lane ?? 0,
      sameLane: (e.l1 ?? s?.lane) === (e.l2 ?? t?.lane),
    };
  });

  const totalRows = orderedLanes.length;
  const totalH = Math.max(height, padding.top + totalRows * laneGap + padding.bottom);

  return {
    ...graph,
    links,
    extent: [minT, maxT],
    width,
    height: totalH,
    padding,
    laneGap,
    laneY,
    orderedLanes,
  };
}

export function buildGraph(input, opts) {
  const g0 = normalizeEvents(input || {});
  const g1 = repairGraphConsistency(g0);       // ensure no isolates & causal
  return layoutGraph(g1, opts);
}

export function buildGraphFromDemo(opts) {
  const seed = seedForestData(Date.now(), { heavy: true });
  return buildGraph(seed, opts);
}

/* ------------------------- TIME ZOOM / TICKS ------------------------- */

export function txFactoryForTimeZoom(graph, { zoom = 1, pan = 0.5 } = {}) {
  const [fullMin, fullMax] = graph.extent || [0, 1];
  const fullSpan = Math.max(1, fullMax - fullMin);

  // Allow zoom down to a 5-minute window
  const fiveMin = 5 * 60 * 1000;
  const maxZoom = Math.max(1, fullSpan / fiveMin);
  const z = Math.max(1, Math.min(maxZoom, zoom));

  const vSpan = fullSpan / z;
  const vMin = fullMin + (fullSpan - vSpan) * clamp01(pan);
  const vMax = vMin + vSpan;

  const x0 = graph.padding.left;
  const x1 = graph.width - graph.padding.right;

  const tx = (t) => {
    const clamped = Math.min(vMax, Math.max(vMin, t));
    return x0 + ((clamped - vMin) / vSpan) * (x1 - x0);
  };
  tx.invert = (x) => {
    const r = (x - x0) / Math.max(1, (x1 - x0));
    return vMin + r * vSpan;
  };

  return { tx, visibleMin: vMin, visibleMax: vMax, maxZoom };
}
const clamp01 = (v) => Math.max(0, Math.min(1, v));

export function timeTicks(minT, maxT, graph, approx = 6) {
  const span = Math.max(1, maxT - minT);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  let unit = "day";
  let step = day;

  if (span > 3 * year)        { unit = "year";   step = year; }
  else if (span > 4 * month)  { unit = "month";  step = month; }
  else if (span > 3 * day)    { unit = "day";    step = day; }
  else if (span > 6 * hour)   { unit = "hour";   step = hour; }
  else                        { unit = "minute"; step = 5 * minute; }

  const out = [];
  let t = alignTime(minT, unit) - step; // start one step before
  while (t <= maxT + step) {
    out.push({ t, unit });
    t += step;
  }
  return out;
}

function alignTime(t, unit) {
  const d = new Date(t);
  if (unit === "year")  return new Date(d.getFullYear(), 0, 1).getTime();
  if (unit === "month") return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  if (unit === "day")   return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  if (unit === "hour")  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()).getTime();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), Math.floor(d.getMinutes() / 5) * 5).getTime();
}

export function formatTick(epoch, unit = "day") {
  const d = new Date(epoch);
  if (unit === "year")  return String(d.getFullYear());
  if (unit === "month") return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  if (unit === "day")   return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
  if (unit === "hour")  return d.toLocaleTimeString(undefined, { hour: "2-digit" });
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/* ---------------------------- DRAWING HELPERS ---------------------------- */

export function cubicPath(x1, y1, x2, y2) {
  const dx = Math.max(24, Math.abs(x2 - x1) * 0.35);
  const x1c = x1 + dx;
  const x2c = x2 - dx;
  return `M ${x1} ${y1} C ${x1c} ${y1}, ${x2c} ${y2}, ${x2} ${y2}`;
}
