// Path: src/Component/templates/fsm/approvals.machine.js

import APPROVAL_STATES from "../constants/APPROVAL_STATES.js";

/**
 * Events the UI can dispatch to the approvals machine.
 */
export const APPROVAL_EVENTS = Object.freeze({
  SUBMIT: "SUBMIT",
  START_REVIEW: "START_REVIEW",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  DEPRECATE: "DEPRECATE",
  ARCHIVE: "ARCHIVE",
  EDIT: "EDIT", // move back to Draft
  RESUBMIT: "RESUBMIT", // from Rejected/Deprecated to Submitted
  RESET: "RESET",
});

/**
 * Transition table: { [fromState]: { [event]: toState } }
 */
const transitions = Object.freeze({
  [APPROVAL_STATES.DRAFT]: {
    [APPROVAL_EVENTS.SUBMIT]: APPROVAL_STATES.SUBMITTED,
    [APPROVAL_EVENTS.ARCHIVE]: APPROVAL_STATES.ARCHIVED,
  },
  [APPROVAL_STATES.SUBMITTED]: {
    [APPROVAL_EVENTS.START_REVIEW]: APPROVAL_STATES.IN_REVIEW,
    [APPROVAL_EVENTS.REJECT]: APPROVAL_STATES.REJECTED,
    // Allow cancel back to Draft via EDIT
    [APPROVAL_EVENTS.EDIT]: APPROVAL_STATES.DRAFT,
  },
  [APPROVAL_STATES.IN_REVIEW]: {
    [APPROVAL_EVENTS.APPROVE]: APPROVAL_STATES.APPROVED,
    [APPROVAL_EVENTS.REJECT]: APPROVAL_STATES.REJECTED,
  },
  [APPROVAL_STATES.APPROVED]: {
    [APPROVAL_EVENTS.DEPRECATE]: APPROVAL_STATES.DEPRECATED,
    [APPROVAL_EVENTS.ARCHIVE]: APPROVAL_STATES.ARCHIVED,
    // if content changes significantly, resubmit
    [APPROVAL_EVENTS.RESUBMIT]: APPROVAL_STATES.SUBMITTED,
  },
  [APPROVAL_STATES.REJECTED]: {
    [APPROVAL_EVENTS.EDIT]: APPROVAL_STATES.DRAFT,
    [APPROVAL_EVENTS.RESUBMIT]: APPROVAL_STATES.SUBMITTED,
    [APPROVAL_EVENTS.ARCHIVE]: APPROVAL_STATES.ARCHIVED,
  },
  [APPROVAL_STATES.DEPRECATED]: {
    [APPROVAL_EVENTS.RESUBMIT]: APPROVAL_STATES.SUBMITTED,
    [APPROVAL_EVENTS.ARCHIVE]: APPROVAL_STATES.ARCHIVED,
  },
  [APPROVAL_STATES.ARCHIVED]: {
    // no outgoing transitions
  },
});

/** Utility: current ISO time */
const nowISO = () => new Date().toISOString();

/**
 * Return the next state for (state, event), or null if invalid.
 */
export function nextState(state, event) {
  return transitions[state]?.[event] ?? null;
}

/**
 * Return allowed events from a given state.
 */
export function allowedEvents(state) {
  return Object.keys(transitions[state] || {});
}

/**
 * High-level apply that mutates an approval record immutably, updating timestamps/history.
 * @param {object} record - { state, history, submittedAt, inReviewAt, decidedAt, decision, reason, slaSeconds }
 * @param {string} event  - one of APPROVAL_EVENTS
 * @param {object} payload - optional { note, reason }
 * @returns {{ ok: boolean, record?: object, error?: string }}
 */
export function apply(record, event, payload = {}) {
  const from = record?.state || APPROVAL_STATES.DRAFT;
  const to = nextState(from, event);
  if (!to) {
    return { ok: false, error: `Invalid transition: ${from} --${event}--> ?` };
  }

  const ts = nowISO();
  const base = {
    ...record,
    state: to,
    history: [...(record?.history || []), { at: ts, state: to, note: payload.note || undefined }].filter(Boolean),
  };

  // Timestamp & decision side-effects
  if (event === APPROVAL_EVENTS.SUBMIT || event === APPROVAL_EVENTS.RESUBMIT) {
    base.submittedAt = ts;
    base.inReviewAt = null;
    base.decidedAt = null;
    base.decision = null;
    base.reason = null;
    // default SLA (48h) if missing
    if (!base.slaSeconds && base.slaSeconds !== 0) base.slaSeconds = 172800;
  } else if (event === APPROVAL_EVENTS.START_REVIEW) {
    base.inReviewAt = ts;
  } else if (event === APPROVAL_EVENTS.APPROVE) {
    base.decidedAt = ts;
    base.decision = "approved";
    base.reason = null;
  } else if (event === APPROVAL_EVENTS.REJECT) {
    base.decidedAt = ts;
    base.decision = "rejected";
    base.reason = payload.reason || "Not specified";
  } else if (event === APPROVAL_EVENTS.EDIT) {
    // move back to Draft; clear decision timestamps
    base.submittedAt = null;
    base.inReviewAt = null;
    base.decidedAt = null;
    base.decision = null;
    base.reason = null;
  }

  return { ok: true, record: base };
}

/**
 * For UI timers: compute remaining SLA seconds from submittedAt.
 */
export function slaRemainingSeconds(record) {
  if (!record?.submittedAt || !record?.slaSeconds) return null;
  const elapsed = (Date.now() - new Date(record.submittedAt).getTime()) / 1000;
  return Math.max(0, Math.floor(record.slaSeconds - elapsed));
}

const ApprovalsMachine = {
  APPROVAL_EVENTS,
  nextState,
  allowedEvents,
  apply,
  slaRemainingSeconds,
};

export default ApprovalsMachine;
