// Path: /src/Component/Meetings/mocks/adapters/conferencing.mock.js
/**
 * Simulates conferencing provider links (Google Meet, Zoom) and room lifecycle.
 *
 * Public API (backwards compatible):
 * - createConference({ provider?, title, start, end, attendees[], meetingId? })
 * - revokeConference(conferenceId)
 * - getConference(conferenceId)
 *
 * Added (optional helpers for richer demos):
 * - getConferenceByMeeting(meetingId)
 * - listConferences({ status?, provider?, limit=50, offset=0 })
 * - endConference(conferenceId)  // force end "now"
 * - clearAll()
 *
 * Notes:
 * - If you pass `meetingId`, creation is idempotent: the same active/ended room is returned.
 * - Recording becomes available a short time *after* the meeting ends.
 */

const LATENCY_MS = 180;
const MIN_RECORDING_DELAY_MS = 30_000;  // 30s
const MAX_RECORDING_DELAY_MS = 120_000; // 120s

const PROVIDERS = ["google_meet", "zoom"];

const store = {
  // id -> Conference
  byId: new Map(),
  // meetingId -> id
  byMeetingId: new Map(),
};

const rnd = (() => {
  let s = 777;
  return () => (s = (1664525 * s + 1013904223) % 2 ** 32);
})();
const newId = (p = "conf") => `${p}_${(Date.now() ^ rnd()).toString(36)}`;
const nowIso = () => new Date().toISOString();

function pickProvider(pref) {
  if (pref && PROVIDERS.includes(pref)) return pref;
  return PROVIDERS[rnd() % PROVIDERS.length];
}

function mkJoinUrl(provider) {
  if (provider === "google_meet") {
    const code = (rnd().toString(36) + rnd().toString(36)).slice(0, 10);
    return `https://meet.google.com/${code.slice(0, 3)}-${code.slice(3, 7)}-${code.slice(7)}`;
  }
  const num = String(1000000000 + (rnd() % 8999999999));
  return `https://zoom.us/j/${num}?pwd=${rnd().toString(36).slice(0, 8)}`;
}

function mkDialIn(provider) {
  return provider === "google_meet"
    ? { number: "+1 650-555-0000", pin: String(100000 + (rnd() % 899999)) }
    : { number: "+1 669-444-0000", pin: String(1000 + (rnd() % 8999)) };
}

function mkRecordingUrl(provider, conferenceId) {
  return provider === "google_meet"
    ? `https://drive.google.com/file/d/${conferenceId}/view`
    : `https://zoom.us/rec/share/${conferenceId}`;
}

/**
 * Internal: advance lifecycle based on time.
 * - active -> ended when now > end
 * - ended -> recording_ready when now > (endedAt + processingDelay)
 */
function materializeLifecycle(conf) {
  const now = Date.now();

  if (conf.status === "active") {
    const endMs = new Date(conf.end).getTime();
    if (now >= endMs) {
      conf.status = "ended";
      conf.endedAt = nowIso();
      // choose a deterministic-ish processing delay per conference
      conf.processingDelayMs =
        MIN_RECORDING_DELAY_MS +
        (Math.abs(conf.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
          (MAX_RECORDING_DELAY_MS - MIN_RECORDING_DELAY_MS));
      conf.processingStartedAt = nowIso();
    }
  }

  if (conf.status === "ended" && !conf.recordingUrl) {
    const startedMs = new Date(conf.processingStartedAt || conf.end).getTime();
    if (Date.now() >= startedMs + (conf.processingDelayMs || MIN_RECORDING_DELAY_MS)) {
      conf.recordingUrl = mkRecordingUrl(conf.provider, conf.id);
      conf.recordingReadyAt = nowIso();
      // keep status as "ended" (recording is a property, not a separate status)
    }
  }

  return conf;
}

/** Create or return an existing room for the same meeting (idempotent if meetingId provided). */
async function createConference({ provider, title, start, end, attendees = [], meetingId } = {}) {
  await new Promise((r) => setTimeout(r, LATENCY_MS));

  // Idempotency by meetingId
  if (meetingId && store.byMeetingId.has(meetingId)) {
    const existing = store.byId.get(store.byMeetingId.get(meetingId));
    return materializeLifecycle({ ...existing });
  }

  const chosen = pickProvider(provider);
  const conferenceId = newId(chosen === "google_meet" ? "gmeet" : "zoom");
  const joinUrl = mkJoinUrl(chosen);
  const dialIn = mkDialIn(chosen);

  const payload = {
    id: conferenceId,
    meetingId: meetingId || null,
    provider: chosen,
    title: title || "Notify Meeting",
    start: new Date(start || Date.now() + 10 * 60 * 1000).toISOString(),
    end: new Date(end || Date.now() + 40 * 60 * 1000).toISOString(),
    attendees: attendees.map((a) => ({ name: a.name, email: a.email })).filter((a) => a.email),
    joinUrl,
    dialIn,
    createdAt: nowIso(),
    status: "active", // active | ended | revoked
    endedAt: null,
    processingStartedAt: null,
    processingDelayMs: null,
    recordingUrl: null,
    recordingReadyAt: null,
  };

  store.byId.set(conferenceId, payload);
  if (meetingId) store.byMeetingId.set(meetingId, conferenceId);

  return { ...payload };
}

/** Force end "now" (useful in demos). */
async function endConference(conferenceId) {
  await new Promise((r) => setTimeout(r, LATENCY_MS / 2));
  const conf = store.byId.get(conferenceId);
  if (!conf) return { ok: false, reason: "not_found" };
  if (conf.status === "revoked") return { ok: false, reason: "revoked" };

  conf.end = nowIso();
  conf.status = "ended";
  conf.endedAt = nowIso();
  conf.processingStartedAt = nowIso();
  conf.processingDelayMs =
    MIN_RECORDING_DELAY_MS +
    (Math.abs(conf.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
      (MAX_RECORDING_DELAY_MS - MIN_RECORDING_DELAY_MS));
  return { ok: true, conferenceId };
}

/** Soft-delete / revoke a room. */
async function revokeConference(conferenceId) {
  await new Promise((r) => setTimeout(r, LATENCY_MS / 2));
  const conf = store.byId.get(conferenceId);
  if (!conf) return { ok: false, reason: "not_found" };

  conf.status = "revoked";
  conf.revokedAt = nowIso();
  return { ok: true, conferenceId };
}

/** Fetch + progress lifecycle lazily. */
async function getConference(conferenceId) {
  await new Promise((r) => setTimeout(r, LATENCY_MS / 2));
  const conf = store.byId.get(conferenceId);
  if (!conf) return null;
  return { ...materializeLifecycle(conf) };
}

/** Convenience: fetch by meetingId (if you created with meetingId). */
async function getConferenceByMeeting(meetingId) {
  await new Promise((r) => setTimeout(r, LATENCY_MS / 3));
  const id = store.byMeetingId.get(meetingId);
  if (!id) return null;
  return getConference(id);
}

/** List with simple filters for dashboards. */
async function listConferences({ status, provider, limit = 50, offset = 0 } = {}) {
  await new Promise((r) => setTimeout(r, LATENCY_MS / 2));
  const all = Array.from(store.byId.values()).map((c) => materializeLifecycle(c));
  const filtered = all.filter(
    (c) =>
      (status ? c.status === status : true) &&
      (provider ? c.provider === provider : true)
  );
  return filtered.slice(offset, offset + limit).map((c) => ({ ...c }));
}

/** Reset all (handy for tests). */
function clearAll() {
  store.byId.clear();
  store.byMeetingId.clear();
}

module.exports = {
  // core API (existing)
  createConference,
  revokeConference,
  getConference,
  // extras
  getConferenceByMeeting,
  listConferences,
  endConference,
  clearAll,
};
