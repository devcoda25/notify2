// Path: src/Component/store/templates/useApprovalsStore.js

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import approvalsFx from "../../templates/fixtures/approvals.fixtures.json";
import APPROVAL_STATES from "../../templates/constants/APPROVAL_STATES";

const STORAGE_KEY = "notify.templates.approvals.v2"; // bump
const nowISO = () => new Date().toISOString();

/* ---------------- local consts (avoid cycles) ---------------- */
const PROVIDERS_BY_CHANNEL = {
  whatsapp: ["WATI", "Meta"],
  sms: ["Submail", "SMS.to", "Africa's Talking"],
  push: ["FCM"],
  email: [],
  platform: [],
};

const normalizeChannel = (val) => {
  const s = String(val || "").toLowerCase().trim();
  if (["email", "mail"].includes(s)) return "email";
  if (["sms", "text"].includes(s)) return "sms";
  if (["whatsapp", "wa"].includes(s)) return "whatsapp";
  if (["push", "push-notification", "notification"].includes(s)) return "push";
  if (["platform", "inapp", "in-app", "web"].includes(s)) return "platform";
  return s || "platform";
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randPast = (days = 30) => {
  const now = Date.now();
  const past = now - Math.floor(Math.random() * days * 86400000);
  return new Date(past).toISOString();
};

/* ---------------- legacy demo seed helpers ---------------- */
const makeHistoryForState = (baseState) => {
  const ts1 = randPast(20);
  const ts2 = randPast(10);
  const ts3 = randPast(3);

  if (baseState === APPROVAL_STATES.APPROVED) {
    return [
      { at: ts1, state: APPROVAL_STATES.SUBMITTED },
      { at: ts2, state: APPROVAL_STATES.IN_REVIEW },
      { at: ts3, state: APPROVAL_STATES.APPROVED },
    ];
  }
  if (baseState === APPROVAL_STATES.REJECTED) {
    return [
      { at: ts1, state: APPROVAL_STATES.SUBMITTED },
      { at: ts2, state: APPROVAL_STATES.IN_REVIEW },
      { at: ts3, state: APPROVAL_STATES.REJECTED, note: sample(["Brand mismatch", "Compliance issue", "Copy length"]) },
    ];
  }
  if (baseState === APPROVAL_STATES.IN_REVIEW) {
    return [
      { at: ts1, state: APPROVAL_STATES.SUBMITTED },
      { at: ts2, state: APPROVAL_STATES.IN_REVIEW },
    ];
  }
  if (baseState === APPROVAL_STATES.SUBMITTED) {
    return [{ at: ts1, state: APPROVAL_STATES.SUBMITTED }];
  }
  return []; // Draft/Archived skip
};

const ensureFromTemplates = (currentApprovals = {}, templates = []) => {
  const next = { ...currentApprovals };
  for (const t of templates) {
    const baseState = t.status || t.state || "Draft";
    if (baseState === "Draft") continue;
    if (next[t.id]) continue;

    const history = makeHistoryForState(baseState);
    const submittedAt =
      history.find((h) => h.state === APPROVAL_STATES.SUBMITTED)?.at || null;
    const inReviewAt =
      history.find((h) => h.state === APPROVAL_STATES.IN_REVIEW)?.at || null;
    const decidedAt =
      history.find((h) =>
        [APPROVAL_STATES.APPROVED, APPROVAL_STATES.REJECTED].includes(h.state)
      )?.at || null;

    next[t.id] = {
      templateId: t.id,
      state: baseState,
      history,
      submittedAt,
      inReviewAt,
      decidedAt,
      decision:
        baseState === APPROVAL_STATES.APPROVED
          ? "approved"
          : baseState === APPROVAL_STATES.REJECTED
          ? "rejected"
          : null,
      reason: null,
      slaSeconds: 3600,
      // graph will be added lazily by backfill
    };
  }
  return next;
};

const seedFromTemplates = (currentApprovals = {}, templates = []) => {
  const next = { ...currentApprovals };

  for (const t of templates) {
    const id = t.id;
    const rec = next[id] || {
      templateId: id,
      state: t.status || "Draft",
      history: [],
      submittedAt: null,
      inReviewAt: null,
      decidedAt: null,
      decision: null,
      reason: null,
      slaSeconds: 3600,
    };

    const ch = normalizeChannel(t.channel || (t.channels || [])[0] || "platform");
    const providers = PROVIDERS_BY_CHANNEL[ch] || [];

    const providerStates = {};
    for (const p of providers) {
      let state = "Pending";
      const tplState = t.status || t.state || "Draft";
      if (tplState === APPROVAL_STATES.APPROVED) state = sample(["Approved", "Approved", "In-Review"]);
      else if (tplState === APPROVAL_STATES.REJECTED) state = "Rejected";
      else if (tplState === APPROVAL_STATES.IN_REVIEW) state = sample(["In-Review", "Submitted"]);
      else if (tplState === APPROVAL_STATES.SUBMITTED) state = "Submitted";
      else state = "Pending";

      providerStates[p] = {
        state,
        updatedAt: randPast(7),
        reason: state === "Rejected" ? sample(["Brand mismatch", "Template too long", "Unsupported variable"]) : "",
        externalId: `${p}-${id.slice(0, 6)}-${rand(100, 999)}`,
        lastSyncAt: randPast(3),
      };
    }

    const variants = Array.isArray(t.variants) && t.variants.length
      ? t.variants
      : [{ id: `${id}-en`, lang: "en" }];

    const variantProviders = {};
    for (const v of variants) {
      const perProv = {};
      for (const p of providers) {
        perProv[p] = {
          state: providerStates[p]?.state || "Pending",
          updatedAt: randPast(10),
        };
      }
      variantProviders[v.id] = {
        ...perProv,
        lastSubmittedAt: t.status !== "Draft" ? randPast(15) : null,
      };
    }

    next[id] = {
      ...rec,
      providers: providerStates,
      providerStates: providerStates,
      variantProviders,
    };
  }

  return next;
};

/* ---------------- minimal graph model ---------------- */
const createEmptyGraph = () => ({
  nodes: [], // { id, templateId, variantId?, provider?, type, state?, at, by?, note?, commitId?, meta? }
  edges: [], // { from, to, kind?: "sequence" | "fork" | "merge" }
  heads: { trunk: null, variants: {} }, // heads.variants[variantId] = nodeId
});

const ensureGraph = (rec) => {
  if (rec && rec.graph && rec.graph.nodes && rec.graph.edges) return rec.graph;
  return createEmptyGraph();
};

let _nextNodeSeq = 1;
const makeNodeId = (tplId) => `${tplId}#${_nextNodeSeq++}`;

/**
 * Append a node to the graph and wire an edge from the appropriate head.
 * evt: { templateId, variantId?, provider?, type, state?, at?, by?, note?, commitId?, meta?, parentIds? }
 */
const appendEventToGraph = (graph, evt) => {
  const g = graph ? { ...graph, nodes: [...graph.nodes], edges: [...graph.edges], heads: { trunk: graph.heads.trunk, variants: { ...graph.heads.variants } } } : createEmptyGraph();
  const id = makeNodeId(evt.templateId);
  const at = evt.at || nowISO();

  const node = {
    id,
    templateId: evt.templateId,
    variantId: evt.variantId || null,
    provider: evt.provider || null,
    type: evt.type,
    state: evt.state || null,
    at,
    by: evt.by || null,
    note: evt.note || null,
    commitId: evt.commitId || null,
    meta: evt.meta || null,
  };
  g.nodes.push(node);

  // Parent selection
  let parentId = null;
  if (Array.isArray(evt.parentIds) && evt.parentIds.length) {
    // create fork edges for all parents and no head update beyond main parent (use first as main)
    parentId = evt.parentIds[0];
    evt.parentIds.forEach((pid) => {
      g.edges.push({ from: pid, to: id, kind: "merge" });
    });
  } else if (evt.variantId) {
    parentId = g.heads.variants[evt.variantId] || g.heads.trunk || null;
    if (parentId) g.edges.push({ from: parentId, to: id, kind: parentId === g.heads.trunk ? "fork" : "sequence" });
    g.heads.variants[evt.variantId] = id;
  } else {
    parentId = g.heads.trunk;
    if (parentId) g.edges.push({ from: parentId, to: id, kind: "sequence" });
    g.heads.trunk = id;
  }

  return g;
};

/** Linearize nodes from graph for feeds/steppers. scope: "trunk" | "all" | { variantId } */
const linearizeFromGraph = (graph, scope = "trunk") => {
  if (!graph || !graph.nodes?.length) return [];
  let filtered = graph.nodes;
  if (scope === "trunk") {
    filtered = graph.nodes.filter((n) => !n.variantId);
  } else if (typeof scope === "object" && scope?.variantId) {
    filtered = graph.nodes.filter((n) => n.variantId === scope.variantId);
  }
  // sort by time asc
  const events = [...filtered].sort((a, b) => new Date(a.at || 0) - new Date(b.at || 0));
  // map to the shape used by StatusTimeline (history)
  return events.map((n) => ({
    state: n.state || n.type || "Event",
    at: n.at,
    by: n.by || undefined,
    note: n.note || undefined,
    commitId: n.commitId || undefined,
    _node: n,
  }));
};

/** Backfill a graph from legacy fields: history (template), variantProviders, etc. */
const backfillGraphFromLegacy = (rec) => {
  let g = ensureGraph(rec);

  // If already has nodes, skip
  if (g.nodes.length) return g;

  // Seed a CREATED (or earliest known) if nothing exists
  const earliest = (rec.history || []).slice().sort((a, b) => new Date(a.at || 0) - new Date(b.at || 0))[0];
  const createdAt = earliest?.at || rec.submittedAt || rec.inReviewAt || rec.decidedAt || nowISO();
  g = appendEventToGraph(g, {
    templateId: rec.templateId,
    type: "CREATED",
    state: "Draft",
    at: createdAt,
  });

  // Template-level history → trunk
  (rec.history || []).forEach((h) => {
    g = appendEventToGraph(g, {
      templateId: rec.templateId,
      type: h.state,
      state: h.state,
      at: h.at,
      by: h.by,
      note: h.note,
      commitId: h.commitId,
    });
  });

  // Variant & provider-level hints
  const variantProviders = rec.variantProviders || {};
  Object.keys(variantProviders).forEach((variantId) => {
    const vp = variantProviders[variantId] || {};
    // a synthetic VARIANT_CREATED at first sighting
    g = appendEventToGraph(g, {
      templateId: rec.templateId,
      variantId,
      type: "VARIANT_CREATED",
      state: "Draft",
      at: (vp.lastSubmittedAt || createdAt),
    });

    Object.keys(vp).forEach((prov) => {
      if (prov === "lastSubmittedAt") return;
      const state = vp[prov]?.state || "Pending";
      // Create a status snapshot node per provider (you can later refine with real timestamps if available)
      g = appendEventToGraph(g, {
        templateId: rec.templateId,
        variantId,
        provider: prov,
        type: "PROVIDER_STATUS",
        state,
        at: vp[prov]?.updatedAt || vp.lastSubmittedAt || createdAt,
        meta: { provider: prov },
      });
    });

    if (vp.lastSubmittedAt) {
      g = appendEventToGraph(g, {
        templateId: rec.templateId,
        variantId,
        type: "SUBMITTED",
        state: "Submitted",
        at: vp.lastSubmittedAt,
      });
    }
  });

  return g;
};

/* ---------------- the store ---------------- */
const useApprovalsStore = create(
  persist(
    (set, get) => ({
      approvals: approvalsFx || {},

      /* ---------- graph-aware public selectors/helpers ---------- */
      selectGraph: (templateId) => {
        const rec = get().approvals?.[templateId];
        return rec?.graph || null;
      },

      /** Derive a linear history array suitable for StatusTimeline */
      deriveHistory: (templateId, scope = "trunk") => {
        const rec = get().approvals?.[templateId];
        if (!rec) return [];
        const g = rec.graph && rec.graph.nodes?.length ? rec.graph : backfillGraphFromLegacy(rec);
        // lazily persist backfilled graph
        if (!rec.graph || !rec.graph.nodes?.length) {
          set((s) => ({
            approvals: {
              ...s.approvals,
              [templateId]: { ...rec, graph: g },
            },
          }));
        }
        return linearizeFromGraph(g, scope);
      },

      /* ---------- event append API (single entry point) ---------- */
      appendEvent: ({ templateId, variantId, provider, type, state, at, by, note, commitId, meta, parentIds }) =>
        set((s) => {
          const rec = s.approvals?.[templateId] || { templateId, state: "Draft", history: [] };
          const currentGraph = ensureGraph(rec);
          const graph = appendEventToGraph(currentGraph, {
            templateId, variantId, provider, type, state, at, by, note, commitId, meta, parentIds,
          });

          // Keep legacy fields roughly in sync for backward-compat
          const newHistoryEntry = { at: at || nowISO(), state: state || type, by, note, commitId };
          const history = [...(rec.history || []), newHistoryEntry];

          // high-level state mirrors trunk head where meaningful
          const nextState = state || rec.state;

          return {
            approvals: {
              ...s.approvals,
              [templateId]: {
                ...rec,
                state: nextState,
                history,
                graph,
              },
            },
          };
        }),

      /* ---------- existing actions updated to use appendEvent ---------- */
      submit: (templateId, payload = {}) => {
        const at = nowISO();
        // trunk submission
        get().appendEvent({
          templateId,
          type: APPROVAL_STATES.SUBMITTED,
          state: APPROVAL_STATES.SUBMITTED,
          at,
          note: payload.note || "",
        });
        // maintain convenience timestamps
        set((s) => ({
          approvals: {
            ...s.approvals,
            [templateId]: {
              ...s.approvals?.[templateId],
              submittedAt: at,
              inReviewAt: null,
              decidedAt: null,
              decision: null,
              reason: null,
              slaSeconds: payload.slaSeconds ?? 3600,
            },
          },
        }));
      },

      setInReview: (templateId) => {
        const at = nowISO();
        get().appendEvent({
          templateId,
          type: APPROVAL_STATES.IN_REVIEW,
          state: APPROVAL_STATES.IN_REVIEW,
          at,
        });
        set((s) => ({
          approvals: {
            ...s.approvals,
            [templateId]: {
              ...s.approvals?.[templateId],
              inReviewAt: at,
            },
          },
        }));
      },

      approve: (templateId) => {
        const at = nowISO();
        get().appendEvent({
          templateId,
          type: APPROVAL_STATES.APPROVED,
          state: APPROVAL_STATES.APPROVED,
          at,
        });
        set((s) => ({
          approvals: {
            ...s.approvals,
            [templateId]: {
              ...s.approvals?.[templateId],
              decision: "approved",
              decidedAt: at,
            },
          },
        }));
      },

      reject: (templateId, reason = "Not specified") => {
        const at = nowISO();
        get().appendEvent({
          templateId,
          type: APPROVAL_STATES.REJECTED,
          state: APPROVAL_STATES.REJECTED,
          at,
          note: reason,
        });
        set((s) => ({
          approvals: {
            ...s.approvals,
            [templateId]: {
              ...s.approvals?.[templateId],
              decision: "rejected",
              reason,
              decidedAt: at,
            },
          },
        }));
      },

      clear: (templateId) =>
        set((s) => {
          const next = { ...(s.approvals || {}) };
          delete next[templateId];
          return { approvals: next };
        }),

      ensureForTemplates: (templates) =>
        set((s) => ({
          approvals: ensureFromTemplates(s.approvals, templates),
        })),

      seedDemoForTemplates: (templates) =>
        set((s) => ({
          approvals: seedFromTemplates(s.approvals, templates),
        })),

      getSlaRemaining: (templateId) => {
        const rec = get().approvals?.[templateId];
        if (!rec || !rec.submittedAt || !rec.slaSeconds) return null;
        const elapsed = (Date.now() - new Date(rec.submittedAt).getTime()) / 1000;
        return Math.max(0, Math.floor(rec.slaSeconds - elapsed));
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 4,
      migrate: (persisted) => {
        const base = persisted || { approvals: {} };
        // Backfill graph for every approval record on load
        const approvals = Object.fromEntries(
          Object.entries(base.approvals || {}).map(([k, rec]) => {
            const graph = backfillGraphFromLegacy(rec);
            return [k, { ...rec, graph }];
          })
        );
        return { ...base, approvals };
      },
    }
  )
);

export default useApprovalsStore;
