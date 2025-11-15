// /src/auth/user.store.js
// Party-first auth store.
// - currentUser.id === partyId (canonical ID used everywhere: WS, rooms, tickets)

import { create } from "zustand";
import * as wsbus from "./ws/wsClient";
import { useRoomsStore } from "../Component/TeamInbox/store/useRoomsStore";
// Global WS abstraction (party / room / ticket streams)
import { wsService } from "../Component/TeamInbox/services/ws.service.js";

/* ───────── Uniform REST helpers (store-owned) ───────── */

const REST_BASE = (process.env.REACT_APP_GWAPI_REST_BASE || "http://localhost:7440").replace(/\/+$/, "");

// Pull Authorization from authAgent if available (optional)
async function getAuthHeader() {
  try {
    const { getApiAuthHeader, getAccessToken } = await import("./authAgent.js");
    if (typeof getApiAuthHeader === "function") {
      const h = getApiAuthHeader();
      if (h && typeof h === "object" && h.Authorization) return h;
    }
    if (typeof getAccessToken === "function") {
      const tok = getAccessToken();
      if (tok) return { Authorization: `Bearer ${tok}` };
    }
  } catch {}
  return {};
}

// Always send a device header (used server-side for correlation/device bind)
async function getDeviceHeader() {
  try {
    const mod = await import("./authAgent.js");
    const cfg = mod?.__authDebug?.()?.cfg || null;
    const devId = cfg?.deviceId || process.env.REACT_APP_DEVICE_ID || "dev-web-test-001";
    return { "X-Device-ID": String(devId).toLowerCase() };
  } catch {
    const devFallback = (process.env.REACT_APP_DEVICE_ID || "dev-web-test-001").toLowerCase();
    return { "X-Device-ID": devFallback };
  }
}

// Tiny guard to avoid spamming fetches during boot
let _meFetchInFlight = false;

async function getJsonSafe(path, { signal, headers = {} } = {}) {
  const url = `${REST_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const [auth, device] = await Promise.all([getAuthHeader(), getDeviceHeader()]);
  const init = {
    method: "GET",
    signal,
    headers: { Accept: "application/json", ...auth, ...device, ...headers },
    credentials: "include",
  };
  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ───────── Identity normalization ───────── */

function normalizeUser(input = {}, prev = {}) {
  const obj = input || {};

  const claimsShape = {
    id: obj.sub || obj.id || "",
    displayName: obj.name || obj.preferred_username || obj.email || "",
    email: obj.email || "",
    avatarUrl: obj.picture || "",
    role:
      (Array.isArray(obj.roles) && obj.roles[0]) ||
      obj.role ||
      (obj.realm_access &&
        Array.isArray(obj.realm_access.roles) &&
        obj.realm_access.roles[0]) ||
      "",
  };

  const person = obj.person || null;
  const personName = person?.name || null;
  const primaryEmail =
    person?.email?.value ||
    (Array.isArray(person?.emails)
      ? (person.emails.find((e) => e?.primary)?.value ||
          person.emails[0]?.value)
      : "") ||
    "";

  const personShape = {
    id: obj.id || "",
    displayName:
      (personName &&
        (personName.full ||
          [personName.given, personName.family].filter(Boolean).join(" ") ||
          personName.given)) ||
      primaryEmail ||
      "",
    email: primaryEmail || "",
    avatarUrl: person?.picture || "",
    role: "",
  };

  const hasPersonish =
    (!!person &&
      (!!personName ||
        !!person?.email ||
        (Array.isArray(person?.emails) && person.emails.length > 0) ||
        !!person?.picture)) ||
    !!obj.external_refs;

  const base = hasPersonish ? personShape : claimsShape;

  const merged = {
    // IMPORTANT: this is our canonical partyId
    id: String(claimsShape.id || ""),
    displayName: String(base.displayName || claimsShape.displayName || ""),
    email: String(base.email || claimsShape.email || ""),
    avatarUrl: String(base.avatarUrl || claimsShape.avatarUrl || ""),
    role: (() => {
      const r = claimsShape.role || base.role || prev.role;
      return typeof r === "string" && r.trim() ? r : "";
    })(),
  };

  const availability = prev?.availability ?? null;
  return { ...merged, availability, meta: { raw: obj } };
}

/* ───────── misc helpers ───────── */

const minToMs = (m) => (Number.isFinite(m) ? m * 60_000 : 0);
const parseIso = (s) => {
  if (!s) return null;
  const t = Date.parse(String(s));
  return Number.isFinite(t) ? t : null;
};

const ALLOWED_UI = new Set(["available", "busy", "away", "offline"]);
const ALLOWED_SRV = new Set(["ONLINE", "BUSY", "AWAY", "OFFLINE"]);

const mapToServer = (ui) => {
  if (!ui) return undefined; // ⟵ important: do NOT default to ONLINE
  return (
    {
      available: "ONLINE",
      busy: "BUSY",
      away: "AWAY",
      offline: "OFFLINE",
    }[ui] ?? undefined
  );
};
const mapFromServer = (s) =>
  ({ ONLINE: "available", BUSY: "busy", AWAY: "away", OFFLINE: "offline" }[s] ??
  null);

function mirrorRooms(av, pending) {
  try {
    const rs = useRoomsStore.getState?.();
    if (!rs) return;
    if (typeof pending === "boolean") rs.setMyAvailabilityPending(pending);
    if (typeof av === "string" && ALLOWED_UI.has(av.toLowerCase())) {
      rs.setMyAvailability(av.toLowerCase());
    }
  } catch {}
}

function isValidUiAvailability(v) {
  return typeof v === "string" && ALLOWED_UI.has(v.toLowerCase());
}

const sendPresence = (ui) => {
  const status = mapToServer(ui);
  if (!status || !ALLOWED_SRV.has(status)) return; // don't send unknowns
  wsbus.send("presence.set", { status });
};

/* ───────── initial shapes ───────── */

const initialUser = {
  id: "",            // partyId
  displayName: "",
  email: "",
  role: "",
  avatarUrl: "",
  availability: null,
  meta: {},
};

const initialShift = { startAt: "", lengthMin: 0, btaMin: 0 };

/* ───────── store ───────── */

export const useUserStore = create((set, get) => ({
  currentUser: { ...initialUser },
  isHydratedFromAuth: false,
  authChecked: false, // becomes true when bootstrap finishes checking session
  isAuthed: false, // true when authAgent reports a valid ticket
  authUser: null,

  shift: { ...initialShift },
  sessions: [],
  breaks: [],

  presencePending: "connecting",
  presencePendingReason: "Connecting ...",
  breakPending: false,

  _bridgeInstalled: false,
  _bridgeUnsub: null,
  _presenceEchoToken: null,

  // Identity hydration (from claims ONLY; do NOT set pending here)
  async hydrateFromClaims(claimsOrProfile = {}) {
    const prev = get().currentUser || {};
    const next = normalizeUser(claimsOrProfile, prev);
    set({ currentUser: next, isHydratedFromAuth: true });

    // As soon as we know canonical partyId → subscribe global PARTY stream
    try {
      if (next.id) {
        wsService.subscribeParty?.(next.id);
      }
    } catch (e) {
      console.warn("[user.store] subscribeParty from claims failed:", e?.message || e);
    }
  },

  async hydrateFromEmployee(profile = {}) {
    const prev = get().currentUser || {};
    const next = normalizeUser(profile, prev);
    set({ currentUser: next, isHydratedFromAuth: true });

    // Same rule: canonical partyId → party stream
    try {
      if (next.id) {
        wsService.subscribeParty?.(next.id);
      }
    } catch (e) {
      console.warn("[user.store] subscribeParty from employee failed:", e?.message || e);
    }
  },

  mergeProfile(profile = {}) {
    set((s) => {
      const prev = s.currentUser || {};
      const r0 = Array.isArray(profile.roles) ? profile.roles[0] : profile.role;
      const role =
        typeof r0 === "string" && r0.trim()
          ? r0
          : typeof prev.role === "string" && prev.role.trim()
          ? prev.role
          : "";
      return {
        currentUser: {
          ...prev,
          displayName: String(
            profile.displayName ??
              profile.name ??
              prev.displayName ??
              ""
          ),
          email: String(profile.email ?? prev.email ?? ""),
          role,
          avatarUrl: String(
            profile.avatarUrl ??
              profile.picture ??
              prev.avatarUrl ??
              ""
          ),
        },
      };
    });
  },

  setAuthState({ hasTicket, authUser } = {}) {
    set((s) => ({
      isAuthed: !!hasTicket,
      authUser: authUser ?? s.authUser ?? null,
    }));
  },

  finishAuthCheck() {
    set({ authChecked: true });
  },

  // GWAPI enrichment (store-owned; single /me)
  async fetchPartyEnrichmentViaGwapi() {
    if (_meFetchInFlight) return;
    _meFetchInFlight = true;
    try {
      const me = await getJsonSafe("/me");
      if (!me) return;

      // Prefer rich party block; fallback flat
      const party = me.party || me.user || me;

      // 1) Merge human-facing profile fields
      get().mergeProfile({
        displayName: party?.name ?? party?.displayName ?? undefined,
        email: party?.email ?? undefined,
        role: Array.isArray(party?.roles)
          ? party.roles[0]
          : party?.role ?? undefined,
        avatarUrl: party?.picture ?? party?.avatarUrl ?? undefined,
      });

      // 2) Canonical Party ID ← absolutely required (party-first)
      if (party?.id) {
        const partyId = String(party.id);
        set((s) => ({
          currentUser: {
            ...s.currentUser,
            id: partyId, // partyId
          },
        }));

        // Subscribe PARTY stream when /me confirms partyId
        try {
          wsService.subscribeParty?.(partyId);
        } catch (e) {
          console.warn("[user.store] subscribeParty from /me failed:", e?.message || e);
        }
      }

      // 3) Presence from /me if present; otherwise, don't overwrite
      if (me.presence && typeof me.presence.availability === "string") {
        const srv = me.presence.availability.toUpperCase();
        const ui = mapFromServer(srv);
        if (ui && isValidUiAvailability(ui)) {
          const cur = get().currentUser || {};
          set({
            currentUser: { ...cur, availability: ui },
            presencePending: null,
            presencePendingReason: undefined,
            _presenceEchoToken: null,
          });
          mirrorRooms(ui, false);
        }
      } else {
        // No presence in /me → if not waiting for an echo, clear pending gently
        if (!get()._presenceEchoToken) {
          set({ presencePending: null, presencePendingReason: undefined });
          mirrorRooms(undefined, false);
        }
      }

      // 4) Shift config (from rich /me)
      const shift = me.shift || {};
      if (shift && (shift.startAt || shift.lengthMin || shift.btaMin)) {
        get().setShiftConfig({
          startAt: String(shift.startAt ?? ""),
          lengthMin: Number.isFinite(shift.lengthMin) ? shift.lengthMin : 0,
          btaMin: Number.isFinite(shift.btaMin) ? shift.btaMin : 0,
        });
      }

      // 5) Telemetry (from rich /me)
      const tel = me.telemetry || {};
      if (
        tel &&
        (Array.isArray(tel.sessions) || Array.isArray(tel.breaks))
      ) {
        get().setTelemetry({
          sessions: Array.isArray(tel.sessions) ? tel.sessions : [],
          breaks: Array.isArray(tel.breaks) ? tel.breaks : [],
        });
      }
    } finally {
      _meFetchInFlight = false;
    }
  },

  // Shift/telemetry state writers
  setShiftConfig(cfg = {}) {
    const safe = {
      startAt: typeof cfg.startAt === "string" ? cfg.startAt : "",
      lengthMin: Number.isFinite(cfg.lengthMin)
        ? Math.max(0, Math.round(cfg.lengthMin))
        : 0,
      btaMin: Number.isFinite(cfg.btaMin)
        ? Math.max(0, Math.round(cfg.btaMin))
        : 0,
    };
    set({ shift: safe });
  },

  setTelemetry({ sessions = [], breaks = [] } = {}) {
    const normSessions = Array.isArray(sessions)
      ? sessions.map((s) => ({
          in: String(s.in || s.start || ""),
          out: s.out ? String(s.out) : s.end ? String(s.end) : undefined,
        }))
      : [];
    const normBreaks = Array.isArray(breaks)
      ? breaks.map((b) => ({
          key: String(b.key || b.type || ""),
          start: String(b.start || ""),
          end: b.end ? String(b.end) : undefined,
        }))
      : [];
    set({ sessions: normSessions, breaks: normBreaks });
  },

  // Presence (optimistic; server is SoT)
  async setAvailability(next) {
    const valid = ALLOWED_UI.has(String(next).toLowerCase())
      ? String(next).toLowerCase()
      : "away";
    set((s) => ({
      presencePending: valid,
      presencePendingReason: "Updating ...",
      currentUser: { ...s.currentUser, availability: valid },
    }));
    mirrorRooms(undefined, true);
    try {
      sendPresence(valid);
    } catch (e) {
      console.warn(
        "[presence] setAvailability send failed:",
        e?.message || e
      );
      set({ presencePending: null, presencePendingReason: undefined });
      mirrorRooms(undefined, false);
    }
    const token = Symbol("presenceEchoWait");
    set({ _presenceEchoToken: token });
    setTimeout(() => {
      if (get()._presenceEchoToken === token) {
        set({ presencePending: null, presencePendingReason: undefined });
        mirrorRooms(undefined, false);
      }
    }, 4000);
  },

  async startBreak(key) {
    const k = String(key || "");
    if (!k) return;
    set((s) => ({
      breakPending: true,
      presencePending: "away",
      presencePendingReason: "Starting break ...",
      currentUser: { ...s.currentUser, availability: "away" },
    }));
    mirrorRooms(undefined, true);
    try {
      wsbus.send("presence.break_start", { code: k });
    } catch (e) {
      console.warn(
        "[presence] startBreak send failed:",
        e?.message || e
      );
      set({
        breakPending: false,
        presencePending: null,
        presencePendingReason: undefined,
      });
      mirrorRooms(undefined, false);
    }
  },

  async endBreak() {
    set((s) => ({
      breakPending: true,
      presencePending: "available",
      presencePendingReason: "Ending break ...",
      currentUser: { ...s.currentUser, availability: "available" },
    }));
    mirrorRooms(undefined, true);
    try {
      wsbus.send("presence.break_end", {});
    } catch (e) {
      console.warn(
        "[presence] endBreak send failed:",
        e?.message || e
      );
      set({
        breakPending: false,
        presencePending: null,
        presencePendingReason: undefined,
      });
      mirrorRooms(undefined, false);
    }
  },

  // Sessions
  startSession() {
    set((s) => {
      if (s.sessions.some((x) => !x.out)) return {};
      return {
        sessions: [...s.sessions, { in: new Date().toISOString() }],
      };
    });
  },

  stopSession() {
    set((s) => {
      const i = s.sessions.findIndex((x) => !x.out);
      if (i < 0) return {};
      const copy = s.sessions.slice();
      copy[i] = { ...copy[i], out: new Date().toISOString() };
      return { sessions: copy };
    });
  },

  // Derived stats
  getStats() {
    const { shift, sessions, breaks } = get();
    const startMs = parseIso(shift.startAt);
    const endMs =
      startMs && shift.lengthMin
        ? startMs + minToMs(shift.lengthMin)
        : null;
    const now = Date.now();

    let workedMs = 0;
    sessions.forEach(({ in: aIso, out }) => {
      const a = parseIso(aIso);
      const b = out ? parseIso(out) : now;
      if (!a || !b || b <= a) return;
      let from = a,
        to = b;
      if (startMs) from = Math.max(from, startMs);
      if (endMs) to = Math.min(to, endMs);
      if (to > from) workedMs += to - from;
    });

    let btaUsedMs = 0;
    breaks.forEach(({ start, end }) => {
      const a = parseIso(start);
      const b = end ? parseIso(end) : now;
      if (!a || !b || b <= a) return;
      btaUsedMs += b - a;
    });

    const workedMin = Math.round(workedMs / 60000);
    const btaUsedMin = Math.round(btaUsedMs / 60000);
    const btaRemainingMin = Math.max(
      0,
      (shift.btaMin || 0) - btaUsedMin
    );

    let remainingMin = 0;
    if (startMs && endMs) {
      const totalMin = Math.round((endMs - startMs) / 60000);
      remainingMin = Math.max(0, totalMin - workedMin);
    }

    const openBreak = breaks.find((b) => !b.end);
    const onBreakKey = openBreak?.key || undefined;

    return {
      shiftWindow: {
        startAt: shift.startAt || "",
        endAt: endMs ? new Date(endMs).toISOString() : "",
      },
      workedMin,
      remainingMin,
      btaUsedMin,
      btaRemainingMin,
      onShift: Boolean(
        startMs && endMs && now >= startMs && now <= endMs
      ),
      onBreakKey,
    };
  },

  // WS presence bootstrap
  bootstrapPresenceToWS() {
    try {
      const { currentUser, breaks } = get();
      const open =
        (Array.isArray(breaks) ? breaks : []).find((b) => !b?.end);
      if (open) {
        wsbus.send("presence.break_start", {
          code: open.key || "break",
        });
        return;
      }
      // Only send presence if we KNOW our UI value; never default to ONLINE
      const av = currentUser?.availability;
      if (isValidUiAvailability(av)) {
        sendPresence(av);
      }
    } catch (e) {
      console.warn(
        "[presence] bootstrapPresenceToWS failed:",
        e?.message || e
      );
    }
  },

  // Reset
  resetUser() {
    // Optional: drop party stream when user resets
    try {
      const prevId = get().currentUser?.id;
      if (prevId) {
        wsService.unsubscribeParty?.(prevId);
      }
    } catch (e) {
      console.warn("[user.store] unsubscribeParty on reset failed:", e?.message || e);
    }

    const unsub = get()._bridgeUnsub;
    if (typeof unsub === "function") {
      try {
        unsub();
      } catch {}
    }
    set({
      currentUser: { ...initialUser },
      isHydratedFromAuth: false,
      authChecked: false,
      isAuthed: false,
      authUser: null,
      shift: { ...initialShift },
      sessions: [],
      breaks: [],
      presencePending: null,
      presencePendingReason: undefined,
      breakPending: false,
      _bridgeInstalled: false,
      _bridgeUnsub: null,
      _presenceEchoToken: null,
    });
    mirrorRooms(undefined, true);
  },

  // WS reconciliation (setup once)
  initPresenceBridge(wsLike = wsbus) {
    if (!wsLike || typeof wsLike.addEventListener !== "function")
      return () => {};
    if (get()._bridgeInstalled)
      return get()._bridgeUnsub || (() => {});
    let acceptFirstPresenceAfterRegister = false;

    const isAboutMe = (evt) => {
      const mine = get().currentUser?.id || "";
      if (evt?.self === true) return true;
      const keys = [
        "user_id",
        "actor_id",
        "subject_id",
        "principal_id",
        "principalId",
        "party_id",
        "sub",
        "id",
      ];
      for (const k of keys) {
        if (
          evt &&
          typeof evt[k] === "string" &&
          mine &&
          evt[k] === mine
        )
          return true;
      }
      return false;
    };

    const onMessageUnsub = wsLike.addEventListener(
      "message",
      (ev) => {
        let data;
        try {
          data = JSON.parse(ev.data);
        } catch {
          return;
        }

        if (data?.type === "presence.update") {
          if (!isAboutMe(data)) {
            if (
              acceptFirstPresenceAfterRegister ||
              data?.self === true
            ) {
              acceptFirstPresenceAfterRegister = false;
            } else {
              return;
            }
          }

          const av = mapFromServer(
            String(data.availability || "").toUpperCase()
          );
          if (av) {
            set((s) => ({
              currentUser: { ...s.currentUser, availability: av },
              presencePending: null,
              presencePendingReason: undefined,
              breakPending: false,
              _presenceEchoToken: null,
            }));
            mirrorRooms(av, false);
          }

          if (
            Array.isArray(data.sessions) ||
            Array.isArray(data.breaks)
          ) {
            get().setTelemetry({
              sessions: Array.isArray(data.sessions)
                ? data.sessions
                : get().sessions,
              breaks: Array.isArray(data.breaks)
                ? data.breaks
                : get().breaks,
            });
          }
          return;
        }

        if (data?.type === "presence.telemetry" && isAboutMe(data)) {
          const sessions = Array.isArray(data.sessions)
            ? data.sessions
            : undefined;
          const breaks = Array.isArray(data.breaks)
            ? data.breaks
            : undefined;
          if (sessions || breaks) {
            get().setTelemetry({
              sessions: sessions || get().sessions,
              breaks: breaks || get().breaks,
            });
          }
          set({
            presencePending: null,
            presencePendingReason: undefined,
            breakPending: false,
            _presenceEchoToken: null,
          });
          mirrorRooms(undefined, false);
          return;
        }
      }
    );

    const onRegisteredUnsub = wsbus.on("registered", () => {
      acceptFirstPresenceAfterRegister = true;
      set({
        presencePending: "connecting",
        presencePendingReason: "Connecting ...",
      });
      get().bootstrapPresenceToWS();

      const token = Symbol("presenceRegisteredWait");
      set({ _presenceEchoToken: token });
      setTimeout(() => {
        if (get()._presenceEchoToken === token) {
          set({
            presencePending: null,
            presencePendingReason: undefined,
            _presenceEchoToken: null,
          });
          mirrorRooms(undefined, false);
        }
      }, 5000);
    });

    const onReconnectUnsub = wsbus.on("reconnect", () => {
      set({
        presencePending: "connecting",
        presencePendingReason: "Reconnecting ...",
      });
    });

    const onErrorUnsub = wsbus.on("error", () => {
      set({
        presencePending: null,
        presencePendingReason: undefined,
        breakPending: false,
      });
      mirrorRooms(undefined, false);
    });

    const unsubAll = () => {
      try {
        onMessageUnsub?.();
      } catch {}
      try {
        onRegisteredUnsub?.();
      } catch {}
      try {
        onReconnectUnsub?.();
      } catch {}
      try {
        onErrorUnsub?.();
      } catch {}
      set({ _bridgeInstalled: false, _bridgeUnsub: null });
    };

    set({ _bridgeInstalled: true, _bridgeUnsub: unsubAll });
    return unsubAll;
  },
}));
