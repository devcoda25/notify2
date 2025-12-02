/* Improved: src/Component/store/scheduling/useMeetingsStore.js */
import { create } from "zustand";
import { attachPersistence } from "../../store/__persist__/persist";
import usersFixtures from "../../Meetings/mocks/fixtures/users.fixtures.json";
import { buildICS } from "../../Meetings/utils/icsClient";
// import * as notify from "../../Meetings/mocks/adapters/notifications.mock";
// import * as calendar from "../../Meetings/mocks/adapters/calendar.mock";
import { createBookingMachine } from "../../Meetings/mocks/fsm/booking.machine";

/** ── Volume knobs (override by window.MEETINGS_SEED if you want) ───────────── */
const SEED = {
  meetings: 400,                 // total meetings to synthesize
  pastDays: 60,                  // how far back to spread past meetings
  futureDays: 45,                // how far ahead to spread future meetings
  pastRatio: 0.6,                // portion of meetings in the past
  cancelledRatioPast: 0.12,      // cancellation rate for past meetings
  cancelledRatioFuture: 0.06,    // cancellation rate for upcoming
  recordingsRatio: 0.6,          // portion of PAST meetings with recordings
  attendanceJoinRatio: 0.72,     // portion of PAST meetings that have a join (vs no-show)
  historyPerMeeting: [1, 4],     // min/max history events per meeting (besides created/updated)
};
const CFG = typeof window !== "undefined" && window.MEETINGS_SEED ? { ...SEED, ...window.MEETINGS_SEED } : SEED;

/** helpers */
const randi = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const id = (pfx) => `${pfx}_${Math.random().toString(36).slice(2, 10)}`;
const addMinutes = (iso, mins) => new Date(new Date(iso).getTime() + mins * 60000).toISOString().slice(0, 19) + "Z";
const nowIso = () => new Date().toISOString();
const roundTo5 = (min) => Math.round(min / 5) * 5;

const EVENT_TYPES_POOL = [
  { id: "intro_15", name: "Intro 15", dur: 15, color: "#7c3aed" },
  { id: "demo_30", name: "Product Demo 30", dur: 30, color: "#2563eb" },
  { id: "deepdive_45", name: "Deep Dive 45", dur: 45, color: "#10b981" },
  { id: "vip_60", name: "VIP 60", dur: 60, color: "#eab308" },
  { id: "support_30", name: "Support 30", dur: 30, color: "#ef4444" },
  { id: "review_30", name: "Quarterly Review 30", dur: 30, color: "#06b6d4" },
];

const LOCATIONS = [
  { type: "google_meet", make: (id) => `https://meet.google.com/${id.slice(-3)}-${id.slice(-6, -3)}-${id.slice(-9, -6)}` },
  { type: "zoom",        make: (id) => `https://zoom.us/j/${randi(1000000000, 9999999999)}` },
  { type: "phone",       make: () => "" },
  { type: "in_person",   make: () => "HQ Boardroom" },
];

const INV_DOMAINS = ["example.com", "contoso.com", "bigco.com", "acme.io", "gov.ug", "edu.edu"];

/** synth core rows */
function synthMeetings() {
  const out = [];
  const total = CFG.meetings;
  const pastCount = Math.round(total * CFG.pastRatio);
  const futureCount = total - pastCount;

  // helper to make one meeting
  const makeOne = (isPast) => {
    const host = pick(usersFixtures);
    const et = pick(EVENT_TYPES_POOL);
    const dayOffset = isPast ? -randi(0, CFG.pastDays) : randi(0, CFG.futureDays);
    const hour = randi(8, 17);
    const minute = roundTo5(randi(0, 55));
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + dayOffset);
    d.setUTCHours(hour, minute, 0, 0);
    const start = d.toISOString().slice(0, 19) + "Z";
    const end = addMinutes(start, et.dur);
    const cancelled = Math.random() < (isPast ? CFG.cancelledRatioPast : CFG.cancelledRatioFuture);

    const inviteeName = `User ${randi(1000, 9999)}`;
    const inviteeEmail = `user${randi(100000, 999999)}@${pick(INV_DOMAINS)}`;

    const loc = pick(LOCATIONS);
    const mtgId = id("mtg");
    const meeting = {
      id: mtgId,
      eventTypeId: et.id,
      eventTypeName: et.name,
      host: { ownerType: "user", ownerId: host.id },
      poolId: null,
      invitee: { name: inviteeName, email: inviteeEmail },
      attendees: [
        { type: "host", name: host.name, email: host.email },
        { type: "invitee", name: inviteeName, email: inviteeEmail },
      ],
      start,
      end,
      timezone: host.timezone || "UTC",
      location: { type: loc.type, link: loc.make(mtgId), address: loc.type === "in_person" ? "HQ Boardroom" : undefined },
      status: cancelled ? "cancelled" : "scheduled",
      createdAt: addMinutes(start, -randi(60, 7 * 24 * 60)),
      updatedAt: addMinutes(start, -randi(15, 120)),
      rescheduleUrl: `/#/book/${mtgId}/reschedule`,
      cancelUrl: `/#/book/${mtgId}/cancel`,
      notes: Math.random() < 0.1 ? "[VIP] priority prospect" : "",
      remindersApplied: null,
    };
    return meeting;
  };

  for (let i = 0; i < pastCount; i++) out.push(makeOne(true));
  for (let i = 0; i < futureCount; i++) out.push(makeOne(false));

  // sort recent first
  out.sort((a, b) => new Date(b.start) - new Date(a.start));
  return out;
}

function synthAttendanceAndRecordings(meetings) {
  const attendance = {};
  const recordings = {};
  const history = [];

  meetings.forEach((m) => {
    // history: always at least a created event
    history.push({
      id: id("h"),
      at: m.createdAt || nowIso(),
      type: "meeting.created",
      data: { id: m.id, eventTypeId: m.eventTypeId, host: m.host, invitee: m.invitee?.email },
    });

    const extra = randi(CFG.historyPerMeeting[0], CFG.historyPerMeeting[1]);
    for (let i = 0; i < extra; i++) {
      const evtType = pick(["fsm.reserved", "fsm.slot_checked", "fsm.reminders_applied", "meeting.updated"]);
      history.push({
        id: id("h"),
        at: addMinutes(m.createdAt || m.start, randi(1, 120)),
        type: evtType,
        data: { eventTypeId: m.eventTypeId, host: m.host, invitee: m.invitee?.email },
      });
    }
    if (m.status === "cancelled") {
      history.push({
        id: id("h"),
        at: m.updatedAt || m.start,
        type: "meeting.cancelled",
        data: { id: m.id, reason: "seeded" },
      });
    }

    const isPast = new Date(m.end).getTime() < Date.now();
    if (isPast) {
      const joined = Math.random() < CFG.attendanceJoinRatio && m.status !== "cancelled";
      if (joined) {
        const joinedAt = addMinutes(m.start, randi(0, 5));
        const leftAt = addMinutes(m.end, randi(0, 3));
        const durationSec = Math.max(60, Math.floor((new Date(leftAt) - new Date(joinedAt)) / 1000));
        attendance[m.id] = { joinedAt, leftAt, durationSec };
      }
      if (Math.random() < CFG.recordingsRatio && m.status !== "cancelled") {
        const url = `https://cdn.example.com/recs/${m.id}.mp4`;
        recordings[m.id] = { url, readyAt: addMinutes(m.end, randi(5, 240)) };
      }
    }
  });

  // newest first for history
  history.sort((a, b) => new Date(b.at) - new Date(a.at));
  return { attendance, recordings, history };
}

const initial = {
  meetings: [],
  attendance: {},   // meetingId -> { joinedAt?, leftAt?, durationSec? }
  recordings: {},   // meetingId -> { url, readyAt }
  history: [],      // array of { id, at, type, data }
  loaded: false,

  // ephemeral booking state for UI flows
  bookingState: "idle",
  lastBooking: null,
  lastError: null,
};

export const useMeetingsStore = create((set, get) => ({
  ...initial,

  loadFixtures: () => {
    if (get().loaded) return;
    const meetings = synthMeetings();
    const { attendance, recordings, history } = synthAttendanceAndRecordings(meetings);
    set({
      meetings,
      attendance,
      recordings,
      history,
      loaded: true,
    });
  },

  /** CRUD */
  upsertMeeting: (mtg) =>
    set((s) => {
      const i = s.meetings.findIndex((m) => m.id === mtg.id);
      if (i >= 0) {
        const copy = s.meetings.slice();
        copy[i] = { ...copy[i], ...mtg, updatedAt: new Date().toISOString() };
        return { meetings: copy };
      }
      return { meetings: [{ ...mtg }, ...s.meetings] };
    }),

  deleteMeeting: (id) =>
    set((s) => ({ meetings: s.meetings.filter((m) => m.id !== id) })),

  getById: (id) => get().meetings.find((m) => m.id === id),

  /** Attendance & recordings (mock) */
  markJoined: (meetingId) =>
    set((s) => ({
      attendance: {
        ...s.attendance,
        [meetingId]: { ...(s.attendance[meetingId] || {}), joinedAt: new Date().toISOString() },
      },
    })),
  markLeft: (meetingId) =>
    set((s) => {
      const prev = s.attendance[meetingId] || {};
      const joined = prev.joinedAt ? new Date(prev.joinedAt).getTime() : Date.now();
      const dur = Math.max(0, Math.floor((Date.now() - joined) / 1000));
      return {
        attendance: {
          ...s.attendance,
          [meetingId]: { ...prev, leftAt: new Date().toISOString(), durationSec: dur },
        },
      };
    }),

  setRecordingUrl: (meetingId, url) =>
    set((s) => ({
      recordings: { ...s.recordings, [meetingId]: { url, readyAt: new Date().toISOString() } },
    })),

  /** ICS generation for client-only downloads */
  buildICSFor: (meetingId) => {
    const mtg = get().getById(meetingId);
    if (!mtg) return null;
    const host =
      usersFixtures.find((u) => u.id === (mtg.host?.ownerId || "")) ||
      { name: "Host", email: "host@example.com" };

    const ics = buildICS({
      uid: `${meetingId}@notify`,
      title: `Meeting • ${mtg.eventTypeId}`,
      description: mtg.notes || "Scheduled via Notify",
      start: mtg.start,
      end: mtg.end,
      organizer: { name: host.name, email: host.email },
      attendees: (mtg.attendees || [])
        .filter((a) => a.email)
        .map((a) => ({ name: a.name, email: a.email })),
      location: mtg.location?.link || mtg.location?.address || "Online",
      url: mtg.rescheduleUrl,
      alarms: [{ minutesBefore: 30 }],
    });
    return ics;
  },

  /** Booking flow via the FSM mock */
  book: async ({ eventTypeId, host, invitee, start, end, locationPreference, channelPrefs }) => {
    set({ bookingState: "validating_input", lastError: null, lastBooking: null });

    const machine = createBookingMachine({
      onReserved: async (ctx) => {
        // Log reservation
        set((s) => ({
          history: [{ id: `h_${Date.now()}`, at: new Date().toISOString(), type: "reserved", data: ctx }, ...s.history],
        }));
      },
      onConfirmed: async (ctx) => {
        // Save meeting
        const newId = id("mtg");
        const meeting = {
          id: newId,
          eventTypeId: ctx.eventTypeId,
          host: ctx.host,
          poolId: ctx.host.ownerType === "pool" ? ctx.host.ownerId : null,
          invitee: ctx.invitee,
          attendees: ctx.attendees || [
            { type: "host", name: "Host", email: "host@example.com" },
            { type: "invitee", name: ctx.invitee.name, email: ctx.invitee.email },
          ],
          start: ctx.start,
          end: ctx.end,
          timezone: ctx.invitee.timezone || "UTC",
          location: { type: ctx.conference.provider, link: ctx.conference.joinUrl },
          status: "scheduled",
          createdAt: nowIso(),
          updatedAt: nowIso(),
          rescheduleUrl: `/#/book/${newId}/reschedule`,
          cancelUrl: `/#/book/${newId}/cancel`,
          notes: "",
          remindersApplied: null,
        };
        set((s) => ({ meetings: [meeting, ...s.meetings], lastBooking: meeting }));
        set({ bookingState: "confirmed" });
      },
      onFailed: async (_ctx, err) => {
        set({ bookingState: "failed", lastError: err?.message || String(err) });
      },
    });

    const unsub = machine.on("transition", ({ state }) => {
      set({ bookingState: state });
    });

    machine.send({
      type: "BOOK",
      payload: { eventTypeId, host, invitee, start, end, locationPreference, channelPrefs },
    });

    setTimeout(() => unsub?.(), 10000);
  },

  /** Cancel: drop the meeting & free the calendar hold (mock) */
  cancel: async (meetingId, reason = "user_request") => {
    const mtg = get().getById(meetingId);
    if (!mtg) return false;

    /* DUMMY IMPLEMENTATION - calendar block removed
    const busy = await calendar.getBusyBlocks({
      ownerType: mtg.host.ownerType,
      ownerId: mtg.host.ownerId,
      start: mtg.start,
      end: mtg.end,
    });
    const target = busy.find((b) => b.start === mtg.start && b.end === mtg.end) || busy[0];
    if (target) {
      try { calendar.removeBusyBlock(target.id); } catch {}
    }
    */

    // DUMMY IMPLEMENTATION
    console.log(`[DUMMY] Sending cancellation email to ${mtg.invitee.email}`);

    get().deleteMeeting(meetingId);
    return true;
  },
}));

attachPersistence(useMeetingsStore, {
  key: "meetings.core",
  select: (s) => ({
    meetings: s.meetings,
    attendance: s.attendance,
    recordings: s.recordings,
    history: s.history,
    loaded: s.loaded,
  }),
});
