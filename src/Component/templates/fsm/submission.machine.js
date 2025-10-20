// Path: src/Component/templates/fsm/submission.machine.js

import { validateTemplate, validateVariant } from "../core/validators.js";

/**
 * Submission flow states for the Template Editor (frontend-only).
 * This machine governs "can submit?" UX separate from provider approvals.
 */
export const SUBMISSION_STATES = Object.freeze({
  EDITING: "editing",
  VALIDATING: "validating",
  READY: "ready", // validation passed ⇒ can submit
  BLOCKED: "blocked", // validation failed ⇒ fix required
  SUBMITTING: "submitting",
  SUBMITTED: "submitted",
  ERROR: "error",
  CANCELED: "canceled",
});

export const SUBMISSION_EVENTS = Object.freeze({
  EDIT: "EDIT",             // any content change
  VALIDATE: "VALIDATE",     // trigger full validation
  PASS: "PASS",             // internal: validation passed
  FAIL: "FAIL",             // internal: validation failed
  SUBMIT: "SUBMIT",         // begin submit
  SUBMIT_OK: "SUBMIT_OK",   // internal: submit resolved
  SUBMIT_ERR: "SUBMIT_ERR", // internal: submit failed
  CANCEL: "CANCEL",
  RESET: "RESET",
});

const flow = Object.freeze({
  [SUBMISSION_STATES.EDITING]: {
    [SUBMISSION_EVENTS.VALIDATE]: SUBMISSION_STATES.VALIDATING,
    [SUBMISSION_EVENTS.CANCEL]: SUBMISSION_STATES.CANCELED,
  },
  [SUBMISSION_STATES.VALIDATING]: {
    [SUBMISSION_EVENTS.PASS]: SUBMISSION_STATES.READY,
    [SUBMISSION_EVENTS.FAIL]: SUBMISSION_STATES.BLOCKED,
    [SUBMISSION_EVENTS.CANCEL]: SUBMISSION_STATES.CANCELED,
  },
  [SUBMISSION_STATES.READY]: {
    [SUBMISSION_EVENTS.EDIT]: SUBMISSION_STATES.EDITING,
    [SUBMISSION_EVENTS.SUBMIT]: SUBMISSION_STATES.SUBMITTING,
    [SUBMISSION_EVENTS.CANCEL]: SUBMISSION_STATES.CANCELED,
  },
  [SUBMISSION_STATES.BLOCKED]: {
    [SUBMISSION_EVENTS.EDIT]: SUBMISSION_STATES.EDITING,
    [SUBMISSION_EVENTS.VALIDATE]: SUBMISSION_STATES.VALIDATING,
    [SUBMISSION_EVENTS.CANCEL]: SUBMISSION_STATES.CANCELED,
  },
  [SUBMISSION_STATES.SUBMITTING]: {
    [SUBMISSION_EVENTS.SUBMIT_OK]: SUBMISSION_STATES.SUBMITTED,
    [SUBMISSION_EVENTS.SUBMIT_ERR]: SUBMISSION_STATES.ERROR,
    [SUBMISSION_EVENTS.CANCEL]: SUBMISSION_STATES.CANCELED,
  },
  [SUBMISSION_STATES.SUBMITTED]: {
    [SUBMISSION_EVENTS.RESET]: SUBMISSION_STATES.EDITING,
  },
  [SUBMISSION_STATES.ERROR]: {
    [SUBMISSION_EVENTS.EDIT]: SUBMISSION_STATES.EDITING,
    [SUBMISSION_EVENTS.VALIDATE]: SUBMISSION_STATES.VALIDATING,
    [SUBMISSION_EVENTS.CANCEL]: SUBMISSION_STATES.CANCELED,
  },
  [SUBMISSION_STATES.CANCELED]: {
    [SUBMISSION_EVENTS.RESET]: SUBMISSION_STATES.EDITING,
  },
});

/**
 * Guarded transition helper.
 */
export function getNext(state, event) {
  return flow[state]?.[event] ?? null;
}

/**
 * Validate the template + its variants.
 * Returns { ok: boolean, errors: string[], warnings: string[], perChannel: { [ch]: { errors, warnings } } }
 */
export function runValidation(template, variants = []) {
  const base = validateTemplate(template, variants);
  const perChannel = {};
  for (const v of variants) {
    perChannel[v.channel] = validateVariant(v.channel, v.snapshot);
  }
  const errors = [
    ...(base.errors || []),
    ...Object.entries(perChannel).flatMap(([ch, r]) => (r.errors || []).map((e) => `[${ch}] ${e}`)),
  ];
  const warnings = [
    ...(base.warnings || []),
    ...Object.entries(perChannel).flatMap(([ch, r]) => (r.warnings || []).map((w) => `[${ch}] ${w}`)),
  ];
  return { ok: errors.length === 0, errors, warnings, perChannel };
}

/**
 * Apply submission flow with side-data for UI.
 * @param {object} ctx - { state, lastValidation, lastError }
 * @param {string} event
 * @param {object} payload - optional { template, variants, submitFn }
 * @returns {{ ok: boolean, ctx?: object, error?: string }}
 */
export function apply(ctx, event, payload = {}) {
  const from = ctx?.state || SUBMISSION_STATES.EDITING;

  // Special handling for VALIDATE: run checks and emit PASS/FAIL internally.
  if (event === SUBMISSION_EVENTS.VALIDATE) {
    const result = runValidation(payload.template, payload.variants || []);
    const nextEvent = result.ok ? SUBMISSION_EVENTS.PASS : SUBMISSION_EVENTS.FAIL;
    const mid = getNext(from, SUBMISSION_EVENTS.VALIDATE);
    if (!mid) return { ok: false, error: `Invalid transition: ${from} --VALIDATE--> ?` };
    const midCtx = { ...ctx, state: mid, lastValidation: result, lastError: null };
    const to = getNext(mid, nextEvent);
    if (!to) return { ok: false, error: `Invalid transition after VALIDATE: ${mid} --${nextEvent}--> ?` };
    return { ok: true, ctx: { ...midCtx, state: to } };
  }

  // SUBMIT: call provided submitFn (frontend-only) synchronously or promise.
  if (event === SUBMISSION_EVENTS.SUBMIT) {
    const to = getNext(from, SUBMISSION_EVENTS.SUBMIT);
    if (!to) return { ok: false, error: `Invalid transition: ${from} --SUBMIT--> ?` };
    const nextCtx = { ...ctx, state: to, lastError: null };

    const doSubmit = payload.submitFn;
    if (typeof doSubmit !== "function") {
      // No submitFn provided; treat as immediate success for demo mode
      const okTo = getNext(SUBMISSION_STATES.SUBMITTING, SUBMISSION_EVENTS.SUBMIT_OK);
      return { ok: true, ctx: { ...nextCtx, state: okTo } };
    }

    try {
      const ret = doSubmit(payload.template, payload.variants || []);
      // Support promise or sync
      if (ret && typeof ret.then === "function") {
        // Caller should dispatch SUBMIT_OK / SUBMIT_ERR after promise settles.
        return { ok: true, ctx: nextCtx };
      } else {
        const okTo = getNext(SUBMISSION_STATES.SUBMITTING, SUBMISSION_EVENTS.SUBMIT_OK);
        return { ok: true, ctx: { ...nextCtx, state: okTo } };
      }
    } catch (e) {
      const errTo = getNext(SUBMISSION_STATES.SUBMITTING, SUBMISSION_EVENTS.SUBMIT_ERR);
      return { ok: false, ctx: { ...nextCtx, state: errTo, lastError: String(e?.message || e) }, error: String(e?.message || e) };
    }
  }

  const to = getNext(from, event);
  if (!to) return { ok: false, error: `Invalid transition: ${from} --${event}--> ?` };

  const nextCtx = { ...ctx, state: to };
  if (event === SUBMISSION_EVENTS.EDIT) nextCtx.lastError = null;
  if (event === SUBMISSION_EVENTS.RESET) {
    nextCtx.lastError = null;
    nextCtx.lastValidation = null;
  }
  return { ok: true, ctx: nextCtx };
}

/**
 * Convenience: recommended primary CTA for each state.
 */
export function primaryAction(state) {
  switch (state) {
    case SUBMISSION_STATES.EDITING:
      return { event: SUBMISSION_EVENTS.VALIDATE, label: "Validate" };
    case SUBMISSION_STATES.VALIDATING:
      return { event: null, label: "Validating…" };
    case SUBMISSION_STATES.READY:
      return { event: SUBMISSION_EVENTS.SUBMIT, label: "Submit for Approval" };
    case SUBMISSION_STATES.BLOCKED:
      return { event: SUBMISSION_EVENTS.VALIDATE, label: "Re-Validate" };
    case SUBMISSION_STATES.SUBMITTING:
      return { event: null, label: "Submitting…" };
    case SUBMISSION_STATES.SUBMITTED:
      return { event: SUBMISSION_EVENTS.RESET, label: "Back to Editor" };
    case SUBMISSION_STATES.ERROR:
      return { event: SUBMISSION_EVENTS.VALIDATE, label: "Try Again" };
    case SUBMISSION_STATES.CANCELED:
      return { event: SUBMISSION_EVENTS.RESET, label: "Resume Editing" };
    default:
      return { event: SUBMISSION_EVENTS.VALIDATE, label: "Validate" };
  }
}

const SubmissionMachine = {
  SUBMISSION_STATES,
  SUBMISSION_EVENTS,
  getNext,
  runValidation,
  apply,
  primaryAction,
};

export default SubmissionMachine;
