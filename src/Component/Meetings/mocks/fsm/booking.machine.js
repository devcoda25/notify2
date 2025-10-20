// Path: /src/Component/Meetings/mocks/fsm/booking.machine.js
/**
 * Booking FSM (mock)
 * ------------------------------------------------------------
 * Simulates the end-to-end Calendly booking flow as a finite state machine:
 *
 * idle
 *  └─> validating_input
 *        └─> checking_availability
 *              ├─(no overlap)─> reserving_slot
 *              │                  └─> creating_conference
 *              │                          └─> sending_notifications
 *              │                                  └─> confirmed
 *              └─(busy/invalid)─> rejected
 *
 * Side paths:
 *  - cancel (from most states) -> cancelled
 *  - error anywhere -> failed
 *
 * Integrations (mocks):
 *  - adapters/calendar.mock.js      → checks busy blocks
 *  - adapters/conferencing.mock.js  → creates join links / recordings
 *  - adapters/notifications.mock.js → sends email/SMS/WhatsApp confirmations
 *
 * This file is self-contained and framework-agnostic.
 */

const { EventEmitter } = require("events");
const calendar = require("../adapters/calendar.mock");
const conf = require("../adapters/conferencing.mock");
const notify = require("../adapters/notifications.mock");

// ---- Utilities -------------------------------------------------------------

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const iso = (d) => new Date(d).toISOString();

function overlaps(aStart, aEnd, bStart, bEnd) {
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);
}

function assertFields(obj, fields) {
  const missing = fields.filter((f) => obj[f] == null || obj[f] === "");
  if (missing.length) {
    const err = new Error(`Missing required field(s): ${missing.join(", ")}`);
    err.code = "VALIDATION_ERROR";
    throw err;
  }
}

// ---- Machine Factory -------------------------------------------------------

/**
 * createBookingMachine
 * @param {Object} options
 * @param {function(ctx):Promise<void>=} options.onReserved   Hook after reserving slot
 * @param {function(ctx):Promise<void>=} options.onConfirmed  Hook after confirmation
 * @param {function(ctx, err):Promise<void>=} options.onFailed Hook when failed
 * @returns {{ send: (event) => void, state: () => string, getContext: () => any, on:(evt,fn)=>any, off:(evt,fn)=>any }}
 */
function createBookingMachine(options = {}) {
  const emitter = new EventEmitter();

  // Context carries all mutable runtime data for the booking
  const ctx = {
    // input
    eventTypeId: null,
    host: null, // { ownerType: "user"|"pool", ownerId: "usr_*"|"pool_*" }
    invitee: null, // { name, email, timezone }
    start: null, // ISO
    end: null, // ISO
    locationPreference: "google_meet", // "google_meet"|"zoom"|"in_person"
    channelPrefs: { email: true, sms: false, whatsapp: false },

    // computed
    durationMinutes: null,
    slotCheck: null, // details from availability check
    reservationId: null, // mock "hold" id for the slot
    conference: null, // returned from conferencing.mock
    notifications: [],

    // meta
    createdAt: iso(Date.now()),
    statusHistory: [],
  };

  let current = "idle";
  let cancelled = false;

  function setState(next, meta = {}) {
    current = next;
    ctx.statusHistory.push({ state: next, at: iso(Date.now()), ...meta });
    emitter.emit("transition", { state: next, context: { ...ctx } });
  }

  function ensureNotCancelled() {
    if (cancelled) {
      setState("cancelled");
      throw Object.assign(new Error("Flow cancelled"), { code: "CANCELLED" });
    }
  }

  async function run(event) {
    try {
      switch (current) {
        case "idle": {
          if (event.type !== "BOOK") return;
          setState("validating_input");
          Object.assign(ctx, event.payload);

          // simple computed duration
          ctx.durationMinutes = Math.max(
            1,
            Math.round((new Date(ctx.end) - new Date(ctx.start)) / 60000)
          );

          // Validate base fields
          assertFields(ctx, [
            "eventTypeId",
            "host",
            "invitee",
            "invitee.email",
            "start",
            "end",
          ]);

          // tiny debounce to simulate work
          await wait(80);
          ensureNotCancelled();

          setState("checking_availability");
          // query busy blocks for the host (user or pool)
          const busy = await calendar.getBusyBlocks({
            ownerType: ctx.host.ownerType,
            ownerId: ctx.host.ownerId,
            start: iso(new Date(new Date(ctx.start).getTime() - 4 * 3600 * 1000)),
            end: iso(new Date(new Date(ctx.end).getTime() + 4 * 3600 * 1000)),
          });

          const conflict = busy.some((b) => overlaps(ctx.start, ctx.end, b.start, b.end));
          ctx.slotCheck = { busy, conflict };

          if (conflict) {
            setState("rejected", { reason: "busy_conflict" });
            return;
          }

          ensureNotCancelled();
          setState("reserving_slot");

          // Simulate a reservation/hold by inserting a temporary busy block
          const hold = calendar.addBusyBlock({
            ownerType: ctx.host.ownerType,
            ownerId: ctx.host.ownerId,
            start: ctx.start,
            end: ctx.end,
            summary: "HOLD: Notify booking (mock)",
            source: "mock_hold",
          });
          ctx.reservationId = hold.id;

          if (typeof options.onReserved === "function") {
            await options.onReserved(ctx);
          }

          ensureNotCancelled();
          setState("creating_conference");

          ctx.conference = await conf.createConference({
            provider: ctx.locationPreference,
            title: `Notify • ${ctx.eventTypeId}`,
            start: ctx.start,
            end: ctx.end,
            attendees: [
              { name: "Host", email: "host@example.com" },
              { name: ctx.invitee.name || "Invitee", email: ctx.invitee.email },
            ],
          });

          ensureNotCancelled();
          setState("sending_notifications");

          // EMAIL (always if enabled)
          if (ctx.channelPrefs?.email !== false) {
            const res = await notify.sendEmail({
              to: ctx.invitee.email,
              subject: "Your meeting is confirmed ✅",
              text: `Hi ${ctx.invitee.name || ""}, your ${ctx.durationMinutes} min meeting is set.
Join: ${ctx.conference.joinUrl}
When: ${ctx.start} → ${ctx.end} (your TZ: ${ctx.invitee.timezone || "UTC"})`,
              vars: {
                inviteeName: ctx.invitee.name,
                start: ctx.start,
                end: ctx.end,
                joinUrl: ctx.conference.joinUrl,
              },
            });
            ctx.notifications.push(res);
          }

          // SMS
          if (ctx.channelPrefs?.sms) {
            const res = await notify.sendSMS({
              to: ctx.invitee.phone || "+15555550123",
              text: `Confirm: ${ctx.durationMinutes}m at ${ctx.start}. Link: ${ctx.conference.joinUrl}`,
              vars: { joinUrl: ctx.conference.joinUrl },
            });
            ctx.notifications.push(res);
          }

          // WhatsApp
          if (ctx.channelPrefs?.whatsapp) {
            const res = await notify.sendWhatsApp({
              to: ctx.invitee.whatsapp || ctx.invitee.phone || "+15555550123",
              text: `📅 Confirmed: ${ctx.durationMinutes}m. Link: ${ctx.conference.joinUrl}`,
              vars: { joinUrl: ctx.conference.joinUrl },
            });
            ctx.notifications.push(res);
          }

          ensureNotCancelled();
          setState("confirmed");

          if (typeof options.onConfirmed === "function") {
            await options.onConfirmed(ctx);
          }
          break;
        }

        case "validating_input":
        case "checking_availability":
        case "reserving_slot":
        case "creating_conference":
        case "sending_notifications":
          // fallthrough — these are driven internally; external events can cancel
          if (event.type === "CANCEL") {
            cancelled = true;
            ensureNotCancelled(); // will throw and set "cancelled"
          }
          break;

        case "rejected":
        case "failed":
        case "cancelled":
        case "confirmed":
        default:
          // terminal states: ignore further events
          break;
      }
    } catch (err) {
      if (err && err.code === "CANCELLED") return;
      setState("failed", { error: err?.message || String(err) });
      if (typeof options.onFailed === "function") {
        try {
          await options.onFailed(ctx, err);
        } catch {}
      }
    }
  }

  // Public facade ------------------------------------------------------------
  return {
    /**
     * @param {{type: string, payload?: any}} event
     *   - { type: "BOOK", payload: { eventTypeId, host, invitee, start, end, locationPreference?, channelPrefs? } }
     *   - { type: "CANCEL" }
     */
    send: (event) => {
      // async fire-and-forget; consumers should subscribe to "transition"
      run(event);
    },

    /** current state string */
    state: () => current,

    /** deep clone of context */
    getContext: () => JSON.parse(JSON.stringify(ctx)),

    /** subscribe to machine transitions */
    on: (evt, fn) => {
      emitter.on(evt, fn);
      return () => emitter.off(evt, fn);
    },

    /** unsubscribe */
    off: (evt, fn) => emitter.off(evt, fn),
  };
}

module.exports = {
  createBookingMachine,
};

/* -----------------------------------------------------------------------------
 * Example (for local dev / unit tests)
 *
 * const { createBookingMachine } = require("./booking.machine");
 * const m = createBookingMachine({
 *   onReserved: async (ctx) => console.log("Reserved:", ctx.reservationId),
 *   onConfirmed: async (ctx) => console.log("Confirmed:", ctx.conference?.joinUrl),
 *   onFailed: async (ctx, err) => console.error("Failed:", err),
 * });
 * m.on("transition", ({ state, context }) => console.log("[FSM]", state));
 * m.send({
 *   type: "BOOK",
 *   payload: {
 *     eventTypeId: "evt_30min_demo",
 *     host: { ownerType: "user", ownerId: "usr_alpha" },
 *     invitee: { name: "Jane Doe", email: "jane@example.com", timezone: "America/New_York" },
 *     start: "2025-09-25T09:30:00Z",
 *     end: "2025-09-25T10:00:00Z",
 *     locationPreference: "zoom",
 *     channelPrefs: { email: true, sms: true, whatsapp: false },
 *   },
 * });
 * ---------------------------------------------------------------------------*/
