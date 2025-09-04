// /src/Component/dailer/store/useDialerStore.js
import create from 'zustand';

const ACW_DEFAULT_SECONDS = 45;
const ENDED_LINGER_MS = 2500;
const DTMF_HIDE_MS = 5000;

function genLegId() {
  return `leg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export const useDialerStore = create((set, get) => ({
  /* Agent & Lead */
  agentStatus: 'available',
  currentLead: null,
  setCurrentLead: (lead) => set({ currentLead: lead }),

  agentProfile: { name: 'Alpha Alpha', initials: 'AA', avatarUrl: '' },

  // live session meta
  loginAt: null, // Date | ISO | number
  setLoginAt: (when = Date.now()) => set({ loginAt: when }),
  clearLoginAt: () => set({ loginAt: null }),

  // performance counters
  callsMade: 0,
  dailyTarget: 100,
  currentCampaign: '—',

  setCallsMade: (n) => set({ callsMade: Math.max(0, Number(n) || 0) }),
  incrementCallsMade: (by = 1) =>
    set((s) => ({ callsMade: Math.max(0, (s.callsMade || 0) + (Number(by) || 0)) })),

  setDailyTarget: (n) => set({ dailyTarget: Math.max(0, Number(n) || 0) }),
  setCurrentCampaign: (name) => set({ currentCampaign: name || '—' }),

  // running tallies for the current day/session
  firstCallAt: null,
  lastCallAt: null,
  totalTalkMsToday: 0,
  resetDailyStats: () =>
    set({ callsMade: 0, firstCallAt: null, lastCallAt: null, totalTalkMsToday: 0 }),

  /* ---------------------- Lead sample payload (for demo) ---------------------- */
  leadDetails: {
    id: "lead_001",
    statusTag: "Hot Lead",
    name: "Berlin Charles",
    avatar: "/avatars/berlin.jpg",
    company: "EVzone",
    ageYears: 32,
    gender: "Female",
    email: "berlincharles@gmail.com",
    phones: [
      { label: "Primary", e164: "+256986545862", whatsapp: true },
      { label: "Alt", e164: "+256700000000", whatsapp: false }
    ],
    preferredChannel: "WhatsApp",
    optIn: { email: true, sms: true, whatsapp: true, calls: true },
    timezone: "Africa/Kampala",
    ids: { leadId: "EVZ-LEAD-4392", crmId: "CRM-9921" },

    joinedAt: "2023-02-10",
    devices: { all: ["iOS", "Android", "Web"], mostUsed: "iOS" },
    services: {
      consumed: ["Ride Hailing", "EV Charging", "E-Commerce"],
      mostUsed: "EV Charging",
      newlyJoined: ["EV-Ride"],
      rarelyUsed: ["FaithHub"],
      neverUsed: ["Online Library"]
    },

    lastAgents: [
      { name: "Jacob Jones", avatar: "/avatars/jacob.jpg", daysAgo: 2 },
      { name: "Geoffrey Charlebois", avatar: "/avatars/geoff.jpg", daysAgo: 3 },
      { name: "Georges Charette", avatar: "/avatars/georges.jpg", daysAgo: 3 },
      { name: "Anton Corbeil", avatar: "/avatars/anton.jpg", daysAgo: 5 }
    ],

    location: { city: "Kampala", region: "Central", country: "Uganda" },
    lastActiveAt: "2025-08-20T14:15:00+03:00",
    segmentTier: "Gold",
    lifecycleStage: "Active",
    kycStatus: "verified",
    riskScore: 28,
    acquisition: "Referral",
    referrer: "Jessica M.",
    csat: 4.6,
    preferredWindow: "9:00–12:00",

    notes: [
      { id: "n101", title: "Plan change request — retained via downgrade", text: "Lead wanted to cancel due to low usage. Reviewed monthly usage vs. on-peak rates and offered a lighter tier with off-peak incentives. They agreed to downgrade instead of canceling.", at: "2025-08-27T10:15:00+03:00", agent: "Jacob Jones", direction: "outbound", durationSec: 690, conference: false, initiatedBy: "Agent", outcome: "Downgraded plan", tags: ["Retention", "Billing"], participants: ["Jacob Jones", "Berlin Charles"] },
      { id: "n102", title: "Card update + autopay enrollment", text: "Caller updated expired card ending 2219 and opted into autopay. Verified a UGX 1 authorization, explained statement timing, and confirmed receipt email.", at: "2025-08-27T09:22:00+03:00", agent: "Geoffrey Charlebois", direction: "inbound", durationSec: 465, conference: false, initiatedBy: "Lead", outcome: "Payment method updated", followUpAt: "2025-09-02T11:00:00+03:00", tags: ["Billing", "Autopay"], participants: ["Geoffrey Charlebois", "Berlin Charles"] },
      { id: "n103", title: "Station fault — escalated with field tech (3-way)", text: "Lead reported a dead EVSE at Kira Mall. Ran remote diagnostics, then added Field Tech to confirm breaker status. Ticket raised and ETA shared with lead.", at: "2025-08-27T08:05:00+03:00", agent: "Georges Charette", direction: "inbound", durationSec: 730, conference: true, initiatedBy: "Lead", outcome: "Escalated to field", tags: ["EV Charging", "Outage", "Escalation"], participants: ["Georges Charette", "Berlin Charles", "Field Tech – Peter O."] },
      { id: "n104", title: "No answer — voicemail left with callback window", text: "Called to confirm tomorrow’s meter read. No answer; left voicemail with a 10:00–12:00 callback window and a WhatsApp alternative.", at: "2025-08-26T17:40:00+03:00", agent: "Anton Corbeil", direction: "outbound", durationSec: 62, conference: false, initiatedBy: "Agent", outcome: "Left voicemail", followUpAt: "2025-08-27T10:30:00+03:00", tags: ["Follow-up"], participants: ["Anton Corbeil", "Berlin Charles"] },
      { id: "n105", title: "KYC verification completed", text: "Verified NIN against profile and confirmed email/phone ownership. Reissued app session token and cleared previous device bindings.", at: "2025-08-26T15:10:00+03:00", agent: "Jacob Jones", direction: "inbound", durationSec: 315, conference: false, initiatedBy: "Lead", outcome: "KYC verified", tags: ["KYC", "Security"], participants: ["Jacob Jones", "Berlin Charles"] },
      { id: "n106", title: "App login failure — reset & device trust", text: "Lead stuck at 2FA loop after SIM swap. Reset 2FA, added device as trusted, and confirmed successful login and session sync.", at: "2025-08-25T12:35:00+03:00", agent: "Geoffrey Charlebois", direction: "outbound", durationSec: 380, conference: false, initiatedBy: "Agent", outcome: "Resolved", tags: ["App", "Authentication"], participants: ["Geoffrey Charlebois", "Berlin Charles"] },
      { id: "n107", title: "Misrouted call — warm transfer to Sales", text: "Lead requested new home charger pricing. Confirmed location eligibility and warm-transferred to Sales queue with context.", at: "2025-08-24T18:50:00+03:00", agent: "Georges Charette", direction: "inbound", durationSec: 58, conference: false, initiatedBy: "Lead", outcome: "Transferred to Sales", tags: ["Routing", "Sales"], participants: ["Georges Charette", "Berlin Charles"] }
    ],

    recordings: [
      { id: "r101", agent: "Jacob Jones", at: "2025-08-27T10:15:00+03:00", durationSec: 688, url: "/media/r101.mp3", noteId: "n101", direction: "outbound", conference: false, participants: ["Jacob Jones", "Berlin Charles"] },
      { id: "r102", agent: "Geoffrey Charlebois", at: "2025-08-27T09:22:00+03:00", durationSec: 463, url: "/media/r102.mp3", noteId: "n102", direction: "inbound", conference: false, participants: ["Geoffrey Charlebois", "Berlin Charles"] },
      { id: "r103", agent: "Georges Charette", at: "2025-08-27T08:05:00+03:00", durationSec: 728, url: "/media/r103.mp3", noteId: "n103", direction: "inbound", conference: true, participants: ["Georges Charette", "Berlin Charles", "Field Tech – Peter O."] },
      // r104 intentionally omitted to show "no recording available"
      { id: "r105", agent: "Jacob Jones", at: "2025-08-26T15:10:00+03:00", durationSec: 314, url: "/media/r105.mp3", noteId: "n105", direction: "inbound", conference: false, participants: ["Jacob Jones", "Berlin Charles"] },
      { id: "r106", agent: "Geoffrey Charlebois", at: "2025-08-25T12:35:00+03:00", durationSec: 378, url: "/media/r106.mp3", noteId: "n106", direction: "outbound", conference: false, participants: ["Geoffrey Charlebois", "Berlin Charles"] },
      { id: "r107", agent: "Georges Charette", at: "2025-08-24T18:50:00+03:00", durationSec: 57, url: "/media/r107.mp3", noteId: "n107", direction: "inbound", conference: false, participants: ["Georges Charette", "Berlin Charles"] }
    ],

    notifications: [
      { id: "n201", at: "2025-08-26T16:45:00+03:00", channel: "email", type: "update", direction: "outbound", title: "Charging session summary (Ntinda)", text: "Hi Berlin, here’s the summary of your charging session at EVzone Ntinda. Total: UGX 32,000.", status: "Opened", noReply: false, media: [{ id: "att201", name: "invoice-0826.pdf", url: "/files/invoice-0826.pdf", type: "pdf" }], thread: [{ id: "m201a", at: "2025-08-26T17:02:00+03:00", direction: "inbound", channel: "email", text: "Received, thanks!" }] },
      { id: "n202", at: "2025-08-26T09:10:00+03:00", channel: "push", type: "warning", direction: "outbound", title: "Low wallet balance", text: "Top up now to avoid charging interruptions.", status: "Delivered", noReply: true, thread: [] },
      { id: "n203", at: "2025-08-25T15:30:00+03:00", channel: "email", type: "marketing", direction: "outbound", title: "Limited-time: 15% off EV service", text: "Book a full service this week and save 15%. Use code EV15.", status: "Clicked", noReply: false, media: [{ id: "att203", name: "promo.pdf", url: "/files/promo-ev15.pdf", type: "pdf" }], thread: [] },
      { id: "n204", at: "2025-08-24T18:05:00+03:00", channel: "sms", type: "survey", direction: "outbound", title: "Quick survey", text: "Rate your last charging experience (1-5). Reply with a number.", status: "Delivered", noReply: false, thread: [{ id: "m204a", at: "2025-08-24T18:07:00+03:00", direction: "inbound", channel: "sms", text: "5" }] },
      { id: "n205", at: "2025-08-24T09:00:00+03:00", channel: "whatsapp", type: "informational", direction: "outbound", title: "Booking reminder", text: "Reminder: vehicle service tomorrow 10:00 at EVzone Lugogo.", status: "Delivered", noReply: false, thread: [{ id: "m205a", at: "2025-08-24T09:03:00+03:00", direction: "inbound", channel: "whatsapp", text: "Confirmed, thanks." }] },
      { id: "n206", at: "2025-08-22T11:20:00+03:00", channel: "inapp", type: "update", direction: "outbound", title: "App v3.2 released", text: "New: faster station search, richer receipts, and dark-mode improvements.", status: "Opened", noReply: true, thread: [] },
      { id: "n207", at: "2025-08-21T14:40:00+03:00", channel: "email", type: "marketing", direction: "outbound", title: "Refer a friend, get UGX 20,000 credit", text: "Share your code BER-9921. You both earn credit after their first charge.", status: "Opened", noReply: false, thread: [] },
      { id: "n208", at: "2025-08-21T07:55:00+03:00", channel: "push", type: "warning", direction: "outbound", title: "Unusual login attempt", text: "A login was attempted from a new device. If this wasn’t you, reset your password.", status: "Delivered", noReply: true, thread: [] },
      { id: "n209", at: "2025-08-20T12:10:00+03:00", channel: "sms", type: "update", direction: "outbound", title: "Technician en route", text: "Our technician will arrive in ~20 minutes. Reply HELP for assistance.", status: "Delivered", noReply: false, thread: [{ id: "m209a", at: "2025-08-20T12:13:00+03:00", direction: "inbound", channel: "sms", text: "OK, waiting." }] },
      { id: "n210", at: "2025-08-19T08:00:00+03:00", channel: "email", type: "informational", direction: "outbound", title: "Monthly statement (July)", text: "Your July statement is ready.", status: "Bounced", noReply: true, media: [{ id: "att210", name: "statement-july.pdf", url: "/files/statement-july.pdf", type: "pdf" }], thread: [] },
      { id: "n211", at: "2025-08-18T10:30:00+03:00", channel: "whatsapp", type: "marketing", direction: "outbound", title: "Weekend promo: 30 free minutes", text: "Charge this weekend and enjoy your first 30 minutes free at participating stations.", status: "Opened", noReply: false, thread: [] },
      { id: "n212", at: "2025-08-17T20:20:00+03:00", channel: "email", type: "warning", direction: "outbound", title: "Payment failed", text: "Your last payment attempt failed. Update your card to continue using services.", status: "Failed", noReply: false, thread: [{ id: "m212a", at: "2025-08-17T20:35:00+03:00", direction: "inbound", channel: "email", text: "Updated card, please retry." }] },
      { id: "n213", at: "2025-08-16T06:00:00+03:00", channel: "push", type: "update", direction: "outbound", title: "Planned maintenance", text: "Charging will be unavailable 02:00–03:30 on Aug 17 for maintenance.", status: "Scheduled", noReply: true, thread: [] },
      { id: "n214", at: "2025-08-15T19:15:00+03:00", channel: "inapp", type: "survey", direction: "outbound", title: "1-minute satisfaction survey", text: "Tell us how we’re doing. Your feedback helps improve EVzone.", status: "Opened", noReply: false, thread: [{ id: "m214a", at: "2025-08-15T19:18:00+03:00", direction: "inapp", channel: "inapp", text: "Rated 9/10. Great UX!" }] }
    ],
  },

  nextLead: {
    name: 'Sarah Corner',
    language: 'Swahili',
    place: 'Kampala',
    priority: 'High',
    scheduled: '10:30 AM',
    mobile: '+256 896 869 563',
    lastCall: 'Carolina',
  },
  shuffleNextLead: () => set({
    nextLead: {
      name: 'Anton Corbeil',
      language: 'Luganda',
      place: 'Kampala',
      priority: 'Medium',
      scheduled: '11:30 AM',
      mobile: '+256 700 000 000',
      lastCall: 'Jessica',
    },
  }),

  /* --------------------------- Engagement tracking --------------------------- */
  // Single number used by UI to show "Engaged hh:mm:ss"
  engagementStartedAt: null,

  // Detailed current-call phase accrual
  currentEngagement: {
    startedAt: null,
    endedAt: null,
    lastPhase: null,   // 'ring' | 'talk' | 'hold' | 'conf' | 'acw'
    lastPhaseAt: null, // timestamp when lastPhase began
    totals: { ringMs: 0, talkMs: 0, holdMs: 0, confMs: 0, acwMs: 0 },
  },

  // Internal: finalize time in the current phase and (optionally) switch to nextPhase
  _engagementPhaseTick: (nextPhase = null) => {
    const now = Date.now();
    const st = get().currentEngagement || {};
    const { lastPhase, lastPhaseAt, totals = {} } = st;
    if (lastPhase && lastPhaseAt) {
      const delta = Math.max(0, now - lastPhaseAt);
      const key =
        lastPhase === 'ring' ? 'ringMs' :
          lastPhase === 'hold' ? 'holdMs' :
            lastPhase === 'conf' ? 'confMs' :
              lastPhase === 'acw' ? 'acwMs' : 'talkMs';
      totals[key] = (totals[key] || 0) + delta;
    }
    set({
      currentEngagement: {
        ...st,
        totals,
        lastPhase: nextPhase ?? st.lastPhase,
        lastPhaseAt: nextPhase ? now : st.lastPhaseAt,
      },
    });
  },

  // Internal: infer phase from call state
  _recomputePhase: () => {
    const s = get();
    if (!s.engagementStartedAt) return; // not engaged yet
    let phase = null;
    if (s.callStatus === 'acw') phase = 'acw';
    else if (String(s.callStatus).startsWith('ringing')) phase = 'ring';
    else if (s.callStatus === 'in-call') phase = s.held ? 'hold' : (s.conferenceActive ? 'conf' : 'talk');

    const cur = s.currentEngagement;
    if (phase && phase !== cur.lastPhase) get()._engagementPhaseTick(phase);
  },

  // Useful getter for analytics / debugging
  getCurrentEngagementSnapshot: () => {
    const ce = get().currentEngagement;
    const liveNow = Date.now();
    let totals = { ...ce.totals };
    if (ce.lastPhase && ce.lastPhaseAt) {
      const delta = Math.max(0, liveNow - ce.lastPhaseAt);
      const key =
        ce.lastPhase === 'ring' ? 'ringMs' :
          ce.lastPhase === 'hold' ? 'holdMs' :
            ce.lastPhase === 'conf' ? 'confMs' :
              ce.lastPhase === 'acw' ? 'acwMs' : 'talkMs';
      totals[key] = (totals[key] || 0) + delta;
    }
    return {
      startedAt: ce.startedAt,
      endedAt: ce.endedAt,
      totals, // { ringMs, talkMs, holdMs, confMs, acwMs }
      lastPhase: ce.lastPhase,
    };
  },

  /* ------------------------------- Softphone -------------------------------- */
  callStatus: 'idle',
  direction: null,
  number: '',
  lastDialedNumber: null,
  lastSuccessfulDialedNumber: null,
  ringStartedAt: null,
  callStartedAt: null,
  lastEndReason: null,

  muted: true,
  held: false,
  speakerOn: false,

  keypadOpen: true,
  metrics: { rttMs: null, jitterMs: null, mos: null },

  // Recording state
  recording: 'off',
  recordStartedAt: null,
  recordAccumMs: 0,

  // Volume meters (live)
  micLevel: 0.15,
  spkLevel: 0.10,
  setMicLevel: (v) => set({ micLevel: v }),
  setSpkLevel: (v) => set({ spkLevel: v }),

  // Inline status toast
  inlineToast: null,
  _setToast: (msg, ms = 3000) => {
    clearTimeout(get()._toastTimer);
    set({ inlineToast: { msg } });
    const t = setTimeout(() => set({ inlineToast: null }), ms);
    set({ _toastTimer: t });
  },

  /* ---------- DTMF overlay ---------- */
  dtmfOverlayVisible: false,
  dtmfBuffer: '',
  clearDtmfOverlay: () => {
    clearTimeout(get()._dtmfTimer);
    set({ dtmfOverlayVisible: false, dtmfBuffer: '' });
  },

  /* ---------- Consult / second legs ---------- */
  consulting: false,
  consultStage: 'idle', // 'idle' | 'enter' | 'dialing' | 'active'
  consultNumber: '',
  consultStartedAt: null,
  consultDialISO: null,
  consultDialLanguage: null,
  consultLead: null, // { name, honorific, title }
  setConsultMeta: ({ iso = null, language = null, lead = null } = {}) =>
    set({ consultDialISO: iso, consultDialLanguage: language, consultLead: lead }),

  // Multiple legs
  consultLegs: [], // [{ id, number, name, iso, language, startedAt, held }]
  _pushConsultLeg: (leg) => set((s) => ({ consultLegs: [...s.consultLegs, leg] })),
  _removeConsultLeg: (id) =>
    set((s) => ({ consultLegs: s.consultLegs.filter((l) => l.id !== id) })),
  _updateConsultLeg: (id, patch) =>
    set((s) => ({
      consultLegs: s.consultLegs.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    })),

  toggleConsultHold: (legId = null) => {
    const legs = get().consultLegs;
    const id = legId ?? (legs.length ? legs[legs.length - 1].id : null);
    if (!id) return;
    const idx = legs.findIndex((l) => l.id === id);
    if (idx === -1) return;
    const leg = legs[idx];
    const next = { ...leg, held: !leg.held };
    set({
      consultLegs: [
        ...legs.slice(0, idx),
        next,
        ...legs.slice(idx + 1),
      ],
    });
    get()._pushLog(
      next.held
        ? `Consult leg ${next.number || id} on hold`
        : `Consult leg ${next.number || id} resumed`,
      'consult'
    );
  },

  // Conference (merged)
  conferenceActive: false,

  // Dial meta (shown in-call)
  dialISO: null,
  dialLanguage: null,
  setDialMeta: ({ iso = null, language = null } = {}) => set({ dialISO: iso, dialLanguage: language }),

  // Activity log (keep last 50)
  log: [],
  _pushLog: (msg, src = 'main') =>
    set((s) => ({ log: [...s.log.slice(-49), { t: Date.now(), msg, src }] })),

  // Recent calls (for redial popup) – keep last 20
  recentCalls: [],
  _pushRecentCall: (entry) =>
    set((s) => ({ recentCalls: [...s.recentCalls.slice(-19), entry] })),

  /* ----------------------------- Keypad & Number ----------------------------- */
  setNumber: (number) => set({ number }),
  appendDigit: (digit) => {
    const { callStatus, number } = get();
    if (callStatus === 'idle' || callStatus === 'ended' || callStatus === 'acw') {
      set({ number: String(number || '') + digit });
    } else if (callStatus === 'in-call' && !get().consulting) {
      get().sendDtmf(digit);
    }
  },
  backspace: () => {
    const { number, callStatus } = get();
    if (callStatus !== 'in-call') set({ number: String(number || '').slice(0, -1) });
  },

  setConsultNumber: (v) => set({ consultNumber: v }),
  consultAppendDigit: (digit) => set((s) => ({ consultNumber: String(s.consultNumber || '') + digit })),
  consultBackspace: () => set((s) => ({ consultNumber: String(s.consultNumber || '').slice(0, -1) })),

  /* --------------------------------- Controls -------------------------------- */
  startCall: (num) => {
    const n = num ?? get().number;
    if (!n) return;
    get()._pushLog(`Dialing ${n}`);
    const now = Date.now();
    const alreadyEngaged = !!get().engagementStartedAt;

    set({
      callStatus: 'ringing-out',
      direction: 'out',
      number: n,
      lastDialedNumber: n,
      ringStartedAt: now,
      held: false,
      conferenceActive: false,
      engagementStartedAt: alreadyEngaged ? get().engagementStartedAt : now,
      currentEngagement: alreadyEngaged
        ? get().currentEngagement
        : {
          startedAt: now,
          endedAt: null,
          lastPhase: 'ring',
          lastPhaseAt: now,
          totals: { ringMs: 0, talkMs: 0, holdMs: 0, confMs: 0, acwMs: 0 },
        },
    });

    get()._recomputePhase();

    clearTimeout(get()._connectTimer);
    const t = setTimeout(() => get().onConnected(), 800);
    set({ _connectTimer: t });
  },

  inboundRinging: (fromNumber) => {
    const now = Date.now();
    const alreadyEngaged = !!get().engagementStartedAt;

    set({
      callStatus: 'ringing-in',
      direction: 'in',
      number: fromNumber ?? get().number,
      ringStartedAt: now,
      conferenceActive: false,
      engagementStartedAt: alreadyEngaged ? get().engagementStartedAt : now,
      currentEngagement: alreadyEngaged
        ? get().currentEngagement
        : {
          startedAt: now,
          endedAt: null,
          lastPhase: 'ring',
          lastPhaseAt: now,
          totals: { ringMs: 0, talkMs: 0, holdMs: 0, confMs: 0, acwMs: 0 },
        },
    });
    get()._pushLog(`Incoming call from ${fromNumber || 'unknown'}`);
    get()._recomputePhase();
  },

  answer: () => {
    if (get().callStatus !== 'ringing-in') return;
    get().onConnected();
  },

  onConnected: () => {
    // If we were dialing a consult number, make that leg active & track it
    if (get().consulting && get().consultStage === 'dialing') {
      const leg = {
        id: genLegId(),
        number: get().consultNumber,
        name: get().consultLead?.name || null,
        iso: get().consultDialISO || null,
        language: get().consultDialLanguage || null,
        startedAt: Date.now(),
        held: false,
      };
      get()._pushConsultLeg(leg);
      set({ consultStage: 'active', consultStartedAt: leg.startedAt });
      get()._setToast('Consult connected');
      get()._pushLog('Consult leg connected', 'consult');
    } else {
      set({
        callStatus: 'in-call',
        callStartedAt: Date.now(),
        ringStartedAt: null,
        lastSuccessfulDialedNumber: get().number,
      });
      get()._pushLog('Connected');
    }
    get().startMetrics?.();
    get()._recomputePhase(); // switch to talk/conf
  },

  endCall: (reason = 'hangup') => {
    clearTimeout(get()._connectTimer);
    clearInterval(get()._metricsTimer);
    clearTimeout(get()._dtmfTimer);

    // push recent call entry for main leg (if connected)
    const st = get();
    if (st.callStartedAt) {
      const durationMs = Date.now() - st.callStartedAt;
      const recorded = st.recording !== 'off' || st.recordAccumMs > 0;
      const entry = {
        number: st.number,
        when: Date.now(),
        durationMs,
        recorded,
        direction: st.direction,
        name: st.currentLead?.name || null,
        honorific: st.currentLead?.honorific || st.currentLead?.salutation || null,
        language: st.dialLanguage || st.currentLead?.language || null,
        iso: st.dialISO || null,
      };
      get()._pushRecentCall(entry);
    }

    get()._pushLog(`Call ended (${reason})`);
    set({
      callStatus: 'ended',
      ringStartedAt: null,
      keypadOpen: false,
      recording: 'off',
      recordStartedAt: null,
      recordAccumMs: 0,
      lastEndReason: reason,
      consulting: false,
      dtmfOverlayVisible: false,
      dtmfBuffer: '',
      conferenceActive: false,
    });

    // After linger, move to ACW (phase will flip to 'acw' in _startAcw)
    clearTimeout(get()._endedTimer);
    const endedTimer = setTimeout(() => {
      set({
        callStatus: 'acw',
        keypadOpen: false,
        consultStage: 'idle',
        consultNumber: '',
        consultStartedAt: null,
        consultDialISO: null,
        consultDialLanguage: null,
        consultLead: null,
        consultLegs: [],
      });
      get()._startAcw();
      get()._recomputePhase();
    }, ENDED_LINGER_MS);
    set({ _endedTimer: endedTimer });
  },

  /* ------------------------------ ACW (UI up) ------------------------------- */
  acwSecondsLeft: 0, // kept for compatibility with any legacy UI
  acwStartedAt: null,

  _startAcw: () => {
    set({ acwSecondsLeft: ACW_DEFAULT_SECONDS, acwStartedAt: Date.now() });
    clearInterval(get()._acwTimer);
    const acw = setInterval(() => {
      // legacy countdown (kept), but UIs should show count-up via acwStartedAt
      const s = get().acwSecondsLeft;
      if (s <= 1) {
        clearInterval(acw);
        set({ acwSecondsLeft: 0 });
      } else {
        set({ acwSecondsLeft: s - 1 });
      }
    }, 1000);
    set({ _acwTimer: acw });
  },

  saveDisposition: (payload) => {
    get()._pushLog(`Disposition saved: ${JSON.stringify(payload)}`);

    // finalize last phase & close engagement
    get()._engagementPhaseTick(null);
    const ce = get().currentEngagement || {};
    set({ currentEngagement: { ...ce, endedAt: Date.now() } });

    clearInterval(get()._acwTimer);
    set({
  acwSecondsLeft: 0,
  acwStartedAt: null,
  callStatus: 'idle',
  number: '',
  inlineToast: null,
  engagementStartedAt: null,
  ringStartedAt: null,
  consulting: false,
  consultStage: 'idle',
  consultNumber: '',
  consultStartedAt: null,
  consultDialISO: null,
  consultDialLanguage: null,
  consultLead: null,
  consultLegs: [],
  dialISO: null,
  dialLanguage: null,
  keypadOpen: true,
  conferenceActive: false,
  // 🔴 clear the missed flag when disposition is submitted
  lastMissed: null,
});

  },

  /* ----------------------------- Toggles & DTMF ----------------------------- */
  toggleMute: () => {
    const next = !get().muted;
    set({ muted: next });
    get()._pushLog(next ? 'Muted' : 'Unmuted');
    get()._recomputePhase(); // if this should affect phase later, it’s already here
  },

  // Global hold (primary call or whole conference)
  toggleHold: () => {
    const st = get().callStatus;
    if (st === 'idle' || st === 'acw') return;
    const next = !get().held;
    set({ held: next });
    get()._pushLog(next ? 'On Hold' : 'Resumed');
    get()._recomputePhase();
  },

  toggleRecording: () => {
    if (get().callStatus !== 'in-call') return;
    const { recording, recordStartedAt, recordAccumMs } = get();
    if (recording === 'off') {
      set({ recording: 'on', recordStartedAt: Date.now(), recordAccumMs: 0 });
      get()._pushLog('Recording started');
    } else if (recording === 'on') {
      set({
        recording: 'paused',
        recordAccumMs: recordAccumMs + (Date.now() - recordStartedAt),
        recordStartedAt: null
      });
      get()._pushLog('Recording paused');
    } else {
      set({ recording: 'on', recordStartedAt: Date.now() });
      get()._pushLog('Recording resumed');
    }
  },

  toggleSpeaker: () => set((s) => ({ speakerOn: !s.speakerOn })),
  toggleKeypad: () => set((s) => ({ keypadOpen: !s.keypadOpen })),

  sendDtmf: (digit) => {
    if (get().callStatus !== 'in-call') return;
    if (get().consulting && get().consultStage !== 'active') return;
    get()._pushLog(`DTMF ${digit}`);
    clearTimeout(get()._dtmfTimer);
    const buf = (get().dtmfBuffer || '') + String(digit);
    set({ dtmfOverlayVisible: true, dtmfBuffer: buf });
    const t = setTimeout(() => {
      set({ dtmfOverlayVisible: false, dtmfBuffer: '' });
    }, DTMF_HIDE_MS);
    set({ _dtmfTimer: t });
  },

  /* ------------------------------- Consult flow ------------------------------ */
  addCall: () => {
    if (get().callStatus !== 'in-call') return;
    set({
      consulting: true,
      consultStage: 'enter',
      held: true, // put primary on hold while dialing consult
      keypadOpen: true,
      consultDialISO: get().dialISO || get().consultDialISO || null,
      consultDialLanguage: get().dialLanguage || get().consultDialLanguage || null,
    });
    get()._setToast('Consult: enter number');
    get()._recomputePhase();
  },

  endACW: () => set((s) => ({
  callStatus: 'idle',
  acwStartedAt: null,
  lastMissed: null,    // clear missed warning when shift resumes
})),




    // Missed / dropped indicator (for UI warnings)
  lastMissed: null, // { at: number, number?: string, kind: 'missed-incoming'|'dropped', reason?: string }

  markMissed: (payload) => set({ lastMissed: { at: Date.now(), ...payload } }),
  clearMissed: () => set({ lastMissed: null }),

  // When entering ACW, seed the timestamp if you use it elsewhere
  setACW: () => set({ callStatus: 'acw', acwStartedAt: Date.now() }),


  startConsultCall: () => {
    const n = get().consultNumber;
    if (!n) return;
    set({ consultStage: 'dialing' });
    get()._setToast('Consult dialing…');
    clearTimeout(get()._consultTimer);
    const t = setTimeout(() => {
      get().onConnected();
    }, 800);
    set({ _consultTimer: t });
  },

  cancelConsult: () => {
    if (!get().consulting) return;
    clearTimeout(get()._consultTimer);
    set({
      consulting: false,
      consultStage: 'idle',
      consultNumber: '',
      consultStartedAt: null,
      consultDialISO: null,
      consultDialLanguage: null,
      consultLead: null,
      held: false
    });
    get()._setToast('Consult cancelled');
    get()._recomputePhase();
  },

  mergeCalls: () => {
    // merge active consult legs into conference
    if (get().consultLegs.length === 0 && !(get().consulting && get().consultStage === 'active')) return;
    set({
      consulting: false,
      consultStage: 'idle',
      held: false,
      conferenceActive: true,
    });
    get()._setToast('Conference merged');
    get()._pushLog('Conference merged', 'consult');
    get()._recomputePhase();
  },

  dropConsult: (legId = null) => {
    if (legId) {
      get()._removeConsultLeg(legId);
      const left = get().consultLegs.length - 1; // state not yet updated
      if (left <= 0) set({ conferenceActive: false });
      get()._pushLog(`Consult leg ${legId} dropped`, 'consult');
      get()._recomputePhase();
      return;
    }

    // Legacy paths
    if (get().conferenceActive) {
      set({
        conferenceActive: false,
        consultNumber: '',
        consultStartedAt: null,
        consultDialISO: null,
        consultDialLanguage: null,
        consultLead: null,
        consultLegs: [],
      });
      get()._pushLog('Second leg dropped (conference ended)', 'consult');
      get()._recomputePhase();
      return;
    }
    if (!get().consulting) return;
    set({
      consulting: false,
      consultStage: 'idle',
      consultNumber: '',
      consultStartedAt: null,
      consultDialISO: null,
      consultDialLanguage: null,
      consultLead: null,
      held: false,
    });
    get()._setToast('Consult dropped');
    get()._pushLog('Consult dropped', 'consult');
    get()._recomputePhase();
  },

  /* ---------------------------- Metrics Simulation --------------------------- */
  startMetrics: () => {
    clearInterval(get()._metricsTimer);
    const m = setInterval(() => {
      if (get().callStatus !== 'in-call') return;
      const rttMs = Math.round(50 + Math.random() * 60);
      const jitterMs = Math.round(Math.random() * 15);
      const mos = +(4.1 - jitterMs / 100 - rttMs / 400).toFixed(2);
      set({ metrics: { rttMs, jitterMs, mos } });
    }, 2000);
    set({ _metricsTimer: m });
  },

  /* --------------------------------- Resets --------------------------------- */
  resetToIdle: () => {
    clearTimeout(get()._connectTimer);
    clearTimeout(get()._endedTimer);
    clearTimeout(get()._consultTimer);
    clearTimeout(get()._dtmfTimer);
    clearInterval(get()._acwTimer);
    clearInterval(get()._metricsTimer);
    set({
      callStatus: 'idle',
      acwStartedAt: null,
      lastEndReason: null,
      ringStartedAt: null,
      callStartedAt: null,
      muted: true,
      held: false,
      recording: 'off',
      recordStartedAt: null,
      engagementStartedAt: null,
      recordAccumMs: 0,
      consulting: false,
      consultStage: 'idle',
      consultNumber: '',
      consultStartedAt: null,
      consultDialISO: null,
      consultDialLanguage: null,
      consultLead: null,
      consultLegs: [],
      inlineToast: null,
      dialISO: null,
      dialLanguage: null,
      keypadOpen: true,
      conferenceActive: false,
      dtmfOverlayVisible: false,
      dtmfBuffer: '',
      // clear current engagement
      currentEngagement: {
        startedAt: null,
        endedAt: null,
        lastPhase: null,
        lastPhaseAt: null,
        totals: { ringMs: 0, talkMs: 0, holdMs: 0, confMs: 0, acwMs: 0 },
      },
    });
  },

  /* -------------------------------- Convenience ----------------------------- */
  redial: () => {
    const n = get().lastSuccessfulDialedNumber;
    if (n) get().startCall(n);
  },

  /* Incoming-call helpers */
  remindMe: () => get()._setToast('Reminder set'),
  sendQuickMessage: () => get()._setToast('Quick message sent'),
  forwardCall: () => get()._setToast('Forwarded (stub)'),
}));

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  window.__dialerStore = useDialerStore;
}
