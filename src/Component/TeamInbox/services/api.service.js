// /src/TeamInbox/services/api.service.js — Ticket-scoped warm-window (plus legacy room-scoped)
// Notes:
// - Adds ticket-scoped message loaders: getTicketWarmWindow / getTicketOlderMessages.
// - Keeps room-scoped loaders (renamed to getRoomWarmWindow / getRoomOlderMessages) for backward compatibility.
// - Fix: normalizeTicketListItem now maps roomId strictly from payload.roomId (no fallback to ticket id).
// - Ensures tenant header (x-tenant-id) is sent for ALL ticket calls (list, register, messages).

async function maybeImport(modulePath) {
  try {
    // eslint-disable-next-line no-return-await
    return await import(/* @vite-ignore */ modulePath);
  } catch {
    return null;
  }
}

async function getDeviceHeaders() {
  try {
    const mod = await import("../../../auth/authAgent.js");
    const cfg = mod?.__authDebug?.()?.cfg || null;
    const devId =
      cfg?.deviceId ||
      process.env.REACT_APP_DEVICE_ID ||
      "dev-web-test-001";
    const v = String(devId).toLowerCase();
    return { "x-device-id": v, "x-did": v };
  } catch {
    const v = String(
      process.env.REACT_APP_DEVICE_ID || "dev-web-test-001"
    ).toLowerCase();
    return { "x-device-id": v, "x-did": v };
  }
}

// Best-effort cookie for did
try {
  // eslint-disable-next-line no-undef
  const v = (await getDeviceHeaders())["x-device-id"];
  if (!document.cookie.split("; ").some((c) => c.startsWith("did="))) {
    document.cookie = `did=${v}; path=/; max-age=${
      60 * 60 * 24 * 365
    }; samesite=lax`;
  }
} catch {}

// Special ID for "all tickets for this tenant" UI (if/when we add it).
export const INBOX_ID = "inbox";

// Normalize roomId for query params. INBOX_ID means "no explicit roomId filter".
const normRoomId = (rid) =>
  rid == null || rid === INBOX_ID ? undefined : rid;

let __cachedBase = null;
async function getBaseUrl() {
  if (__cachedBase !== null) return __cachedBase;
  const urlMod = await maybeImport("../../Url.js");
  const fromUrlJs =
    urlMod?.API_BASE_URL ||
    urlMod?.API ||
    urlMod?.BASE_URL ||
    (typeof urlMod?.default === "string" ? urlMod.default : null);
  const fromEnv =
    process.env.REACT_APP_API_BASE_URL ||
    process.env.VITE_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "";
  const raw = (fromUrlJs || fromEnv || "")
    .trim()
    .replace(/\/+$/g, "");
  __cachedBase = raw || "";
  return __cachedBase;
}

async function getAuthHeader() {
  try {
    const { getApiAuthHeader, getAccessToken } = await import(
      "../../../auth/authAgent.js"
    );
    if (typeof getApiAuthHeader === "function") {
      const h = getApiAuthHeader();
      if (h && typeof h === "object" && h.Authorization) return h;
    }
    if (typeof getAccessToken === "function") {
      const tok = getAccessToken();
      if (tok) return { Authorization: `Bearer ${tok}` };
    }
  } catch {
    // ignore
  }
  return {};
}

function buildQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) {
      v.forEach((it) => q.append(k, it));
    } else if (typeof v === "object") {
      q.set(k, JSON.stringify(v));
    } else {
      q.set(k, String(v));
    }
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

function safeJsonParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

async function fetchJson(
  path,
  { method = "GET", body, signal, headers = {} } = {}
) {
  const base = await getBaseUrl();
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  const [auth, device] = await Promise.all([
    getAuthHeader(),
    getDeviceHeaders(),
  ]);

  const init = {
    method,
    signal,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...auth,
      ...device,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  };

  let res;
  try {
    // eslint-disable-next-line no-undef
    res = await fetch(url, init);
  } catch (err) {
    if (err && err.name === "AbortError") {
      const e = new Error("Request aborted");
      e.name = "AbortError";
      throw e;
    }
    const e = new Error(`Network error fetching ${url}`);
    e.cause = err;
    throw e;
  }

  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;
  if (!res.ok) {
    const e = new Error(`HTTP ${res.status} for ${url}`);
    e.status = res.status;
    e.body = data ?? text;
    e.url = url;
    throw e;
  }
  return data;
}

// Tenant header (roomId === tenantId in Notify chat semantics).
// IMPORTANT: never send "inbox" as a tenant id.
function tenantHeaderFrom(id) {
  const vRaw = id == null || id === INBOX_ID ? "" : String(id).trim();
  return vRaw ? { "x-tenant-id": vRaw } : {};
}

// ---------- Normalizers ----------

function ensureArray(x) {
  return Array.isArray(x) ? x : x ? [x] : [];
}
function coerceStringId(x) {
  return x == null ? "" : String(x);
}

function normalizeTicketListResponse(payload) {
  if (Array.isArray(payload)) {
    return {
      data: payload.map(normalizeTicketListItem),
      cursor: undefined,
    };
  }
  const items = ensureArray(payload?.items ?? payload?.data ?? []);
  const cursor = payload?.cursor ?? payload?.nextCursor ?? undefined;
  return {
    data: items.map(normalizeTicketListItem),
    cursor,
    total: Number.isFinite(payload?.total) ? payload.total : undefined,
    page: Number.isFinite(payload?.page) ? payload.page : undefined,
    pageSize: Number.isFinite(payload?.pageSize)
      ? payload.pageSize
      : undefined,
  };
}

function normalizeTicketListItem(t = {}) {
  return {
    id: coerceStringId(t.id ?? t.ticketId),
    roomId: coerceStringId(t.roomId ?? ""), // STRICT: no fallback to ticket id
    title: String(t.title ?? t.subject ?? "Untitled"),
    subtitle: String(
      t.subtitle ??
        t.preview ??
        t.lastMessage?.text ??
        ""
    ),
    unreadCount: Number.isFinite(t.unreadCount) ? t.unreadCount : 0,
    updatedAt:
      t.updatedAt ?? t.createdAt ?? new Date().toISOString(),
    status: t.status ?? undefined,
    subStatus: t.subStatus ?? undefined,
    channel:
      (t.channel ?? "").toString().toLowerCase() || undefined,
  };
}

function normalizeRoomListResponse(payload) {
  const items = Array.isArray(payload)
    ? payload
    : ensureArray(payload?.items ?? payload?.data ?? []);
  return {
    data: items.map(normalizeRoom),
    total: Number.isFinite(payload?.total) ? payload.total : undefined,
    page: Number.isFinite(payload?.page) ? payload.page : undefined,
    pageSize: Number.isFinite(payload?.pageSize)
      ? payload.pageSize
      : undefined,
  };
}

function normalizeRoom(r = {}) {
  const participants = ensureArray(r.participants).map((p) => ({
    id: coerceStringId(
      p.id ??
        p.userId ??
        p.principalId ??
        p.partyId ??
        p.address
    ),
    displayName: String(
      p.displayName ?? p.name ?? "Unknown"
    ),
    email: p.email ?? undefined,
    phone: p.phone ?? undefined,
    avatarUrl: p.avatarUrl ?? undefined,
    participantType: p.participantType ?? undefined, // insider | client | temp
    actorType: p.actorType ?? undefined, // agent | watcher | bot | client
    availability: p.availability ?? undefined,
    isDefault: !!p.isDefault,
    muted: !!p.muted,
    meta: p.meta ?? {},
  }));

  const roommatesLegacy = ensureArray(r.roommates).map((p) => ({
    id: coerceStringId(
      p.id ??
        p.userId ??
        p.principalId ??
        p.partyId ??
        p.address
    ),
    displayName: String(
      p.displayName ?? p.name ?? "Unknown"
    ),
    avatarUrl: p.avatarUrl ?? undefined,
    muted: !!p.muted,
    meta: p.meta ?? {},
  }));

  return {
    id: coerceStringId(r.id ?? r.roomId),
    division: r.division ?? "business",
    title: String(r.title ?? r.name ?? "Untitled"),
    participants, // canonical
    roommates: roommatesLegacy, // legacy (read-only)
    unreadCount: Number.isFinite(r.unreadCount)
      ? r.unreadCount
      : 0,
    pinned: !!r.pinned,
    archived: !!r.archived,
    muted: !!r.muted,
    lastMessagePreview: r.lastMessage
      ? {
          text: String(r.lastMessage.text ?? ""),
          at:
            r.lastMessage.at ??
            r.lastMessage.createdAt ??
            null,
          from:
            r.lastMessage.from ??
            r.lastMessage.sender?.displayName ??
            null,
        }
      : undefined,
    createdAt: r.createdAt ?? new Date().toISOString(),
    updatedAt:
      r.updatedAt ??
      r.createdAt ??
      new Date().toISOString(),
    meta: r.meta ?? {},
  };
}

function normalizeMember(m = {}) {
  return {
    id: coerceStringId(m.id ?? m.userId ?? m.principalId),
    role: m.role ?? "member",
    actorType: m.actorType ?? undefined,
    displayName: String(m.displayName ?? m.name ?? "Unknown"),
    avatarUrl: m.avatarUrl ?? undefined,
    isBot: !!m.isBot,
    availability: m.availability ?? undefined,
    meta: m.meta ?? {},
  };
}

function normalizeMessagesResponse(payload) {
  const list = Array.isArray(payload)
    ? payload
    : ensureArray(payload?.messages ?? payload?.data ?? []);
  const cursor = payload?.cursor ?? undefined;
  return { data: list.map(normalizeMessage), cursor };
}

function normalizeMessage(m = {}) {
  return {
    id: coerceStringId(m.id ?? m.messageId),
    roomId:
      m.roomId != null ? coerceStringId(m.roomId) : undefined,
    ticketId:
      m.ticketId != null ? coerceStringId(m.ticketId) : undefined,
    channel:
      (m.channel ?? "").toString().toLowerCase() || "inapp",
    provider: m.provider ?? undefined,
    sender: {
      id: coerceStringId(
        m.sender?.id ??
          m.sender?.userId ??
          m.sender?.principalId
      ),
      kind: m.sender?.kind ?? "agent",
      displayName: String(
        m.sender?.displayName ?? m.sender?.name ?? "Unknown"
      ),
      avatarUrl: m.sender?.avatarUrl ?? undefined,
      meta: m.sender?.meta ?? {},
    },
    text: typeof m.text === "string" ? m.text : undefined,
    parts: ensureArray(m.parts).map((p) => ({
      id: coerceStringId(p.id ?? p.partId),
      kind: p.kind ?? "document",
      mime: String(
        p.mime ?? p.mimetype ?? "application/octet-stream"
      ),
      bytes: Number.isFinite(p.bytes) ? p.bytes : undefined,
      name: p.name ?? undefined,
      url: p.url ?? undefined,
      thumbnailUrl: p.thumbnailUrl ?? undefined,
      meta: p.meta ?? {},
    })),
    status:
      (m.status && String(m.status).toLowerCase()) || "sent",
    createdAt: m.createdAt ?? new Date().toISOString(),
    sentAt: m.sentAt ?? undefined,
    deliveredAt: m.deliveredAt ?? undefined,
    readAt: m.readAt ?? undefined,
    editedAt: m.editedAt ?? undefined,
    deletedAt: m.deletedAt ?? undefined,
    prevCursor: m.prevCursor
      ? {
          type: m.prevCursor.type ?? "server",
          token: coerceStringId(m.prevCursor.token),
          direction: m.prevCursor.direction ?? "backward",
          hasMore: !!m.prevCursor.hasMore,
        }
      : undefined,
    meta: m.meta ?? {},
  };
}

// ------------------------------ Endpoints -----------------------------------

// Advanced Party search
export async function contactsAdvanced(payload, { signal } = {}) {
  return fetchJson(`/contacts/advanced/search`, {
    method: "POST",
    body: payload,
    signal,
  });
}

// Bots advanced search
export async function searchBots(payload, { signal } = {}) {
  return fetchJson(`/bots/search`, {
    method: "POST",
    body: payload,
    signal,
  });
}

// ROOMS — list & read
export async function getRooms({
  division,
  page,
  pageSize,
  q,
  signal,
} = {}) {
  const qs = buildQuery({ division, page, pageSize, q });
  const res = await fetchJson(`/api/rooms${qs}`, { signal });
  return normalizeRoomListResponse(res);
}

export async function getRoom({ roomId, signal } = {}) {
  const res = await fetchJson(
    `/api/rooms/${encodeURIComponent(roomId)}`,
    { signal }
  );
  return { data: normalizeRoom(res?.data ?? res) };
}

export async function getRoomMeta({ roomId, signal }) {
  const res = await fetchJson(
    `/api/rooms/${encodeURIComponent(roomId)}/meta`,
    { signal }
  );
  return { data: normalizeRoom(res) };
}

export async function getRoomMembers({ roomId, signal } = {}) {
  const res = await fetchJson(
    `/api/rooms/${encodeURIComponent(roomId)}/members`,
    { signal }
  );
  const items = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res)
    ? res
    : [];
  return { data: items.map(normalizeMember) };
}

// ROOMS — mutations
export async function registerRoom({
  externalKey,
  title,
  division = "business",
  roommates = [],
  participants = [],
  meta,
  signal,
} = {}) {
  // Coerce to unique string IDs
  const toIdList = (list) => {
    const seen = new Set();
    const out = [];
    (Array.isArray(list) ? list : []).forEach((x) => {
      const id =
        typeof x === "string"
          ? x
          : x?.id ??
            x?.partyId ??
            x?.principalId ??
            x?.userId ??
            x?.address;
      if (id != null) {
        const s = String(id);
        if (!seen.has(s)) {
          seen.add(s);
          out.push(s);
        }
      }
    });
    return out;
  };
  const ids = toIdList(
    participants.length ? participants : roommates
  );

  const payload = {
    externalKey: externalKey || undefined,
    title: title ?? "Untitled",
    division,
    participants: ids,
    roommates: ids,
    meta: meta ?? undefined,
  };
  const res = await fetchJson(`/api/rooms/register`, {
    method: "POST",
    body: payload,
    signal,
  });
  const roomRaw = res?.room ?? res?.data ?? res;
  return { data: normalizeRoom(roomRaw) };
}

export async function renameRoom({
  roomId,
  title,
  signal,
} = {}) {
  const res = await fetchJson(
    `/api/rooms/${encodeURIComponent(roomId)}`,
    {
      method: "PATCH",
      body: { title: title ?? "" },
      signal,
    }
  );
  return { data: normalizeRoom(res?.data ?? res) };
}

export async function pinRoom({
  roomId,
  pinned = true,
  signal,
} = {}) {
  const res = await fetchJson(
    `/api/rooms/${encodeURIComponent(roomId)}`,
    {
      method: "PATCH",
      body: { pinned: !!pinned },
      signal,
    }
  );
  return { data: normalizeRoom(res?.data ?? res) };
}

export async function muteRoom({
  roomId,
  muted = true,
  signal,
} = {}) {
  const res = await fetchJson(
    `/api/rooms/${encodeURIComponent(roomId)}`,
    {
      method: "PATCH",
      body: { muted: !!muted },
      signal,
    }
  );
  return { data: normalizeRoom(res?.data ?? res) };
}

export async function leaveRoom({ roomId, signal } = {}) {
  const res = await fetchJson(
    `/api/rooms/${encodeURIComponent(roomId)}/leave`,
    {
      method: "POST",
      signal,
    }
  );
  const room = res?.data ?? res?.room ?? null;
  return room ? { data: normalizeRoom(room) } : { data: null };
}

export async function deleteRoom({ roomId, signal } = {}) {
  await fetchJson(`/api/rooms/${encodeURIComponent(roomId)}`, {
    method: "DELETE",
    signal,
  });
  return { ok: true };
}

// CHATS — creation
export async function createChat({
  subject,
  module,
  channel,
  recipients,
  files,
  signal,
}) {
  const payload = {
    subject: subject ?? "",
    module: module ?? "",
    channel,
    recipients: Array.isArray(recipients) ? recipients : [],
    files: Array.isArray(files)
      ? files.map((f) => ({
          name: f.name ?? undefined,
          size: f.size ?? undefined,
          type: f.type ?? undefined,
        }))
      : undefined,
  };
  const res = await fetchJson(`/api/chats`, {
    method: "POST",
    body: payload,
    signal,
  });
  const roomId = coerceStringId(
    res?.roomId ?? res?.data?.roomId
  );
  const ticketId = res?.ticketId
    ? coerceStringId(res.ticketId)
    : res?.data?.ticketId
    ? coerceStringId(res.data.ticketId)
    : undefined;
  return { data: { roomId, ticketId } };
}

// TICKETS
export async function getTickets({
  roomId,
  cursor,
  pageSize = 50,
  q,
  filters,
  signal,
} = {}) {
  const qs = buildQuery({
    roomId: normRoomId(roomId),
    cursor,
    pageSize,
    q,
    ...filters,
  });
  const res = await fetchJson(`/api/tickets${qs}`, {
    signal,
    headers: {
      ...tenantHeaderFrom(roomId), // tenantId === roomId
    },
  });
  return normalizeTicketListResponse(res);
}

export async function searchTickets({
  q,
  filters,
  pageSize = 50,
  cursor,
  signal,
} = {}) {
  return getTickets({ q, filters, pageSize, cursor, signal });
}

export async function registerTicket({
  roomId,
  subject,
  purpose,
  participantIds,
  agentIds,
  tags,
  meta,
  signal,
} = {}) {
  const payload = {
    roomId, // roomId === tenantId (party-first routing)
    subject: subject ?? "",
    purpose: purpose ?? undefined, // optional free-note
    participantIds: Array.isArray(participantIds)
      ? participantIds
      : [],
    agentIds: Array.isArray(agentIds) ? agentIds : [],
    tags: Array.isArray(tags) ? tags : [],
    meta: meta ?? undefined,
  };
  const res = await fetchJson(`/api/tickets/register`, {
    method: "POST",
    body: payload,
    signal,
    headers: {
      ...tenantHeaderFrom(roomId), // ensure GWAPI gets tenant context
    },
  });
  const rid = coerceStringId(
    res?.roomId ?? res?.data?.roomId ?? roomId
  );
  const tid = coerceStringId(
    res?.ticketId ??
      res?.data?.ticketId ??
      res?.id ??
      res?.data?.id
  );
  return { data: { roomId: rid, ticketId: tid } };
}

export async function fetchTicketsPage({
  roomId,
  search,
  cursor,
  limit,
  signal,
} = {}) {
  const res = await getTickets({
    roomId,
    q: search,
    cursor,
    pageSize: limit,
    signal,
  });
  return {
    items: res?.data ?? [],
    cursor: res?.cursor ?? null,
    total:
      typeof res?.total === "number" ? res.total : undefined,
  };
}

// MESSAGES — TICKET-SCOPED (canonical)
export async function getTicketWarmWindow({
  roomId,
  ticketId,
  limit = 50,
  before,
  signal,
}) {
  const qs = buildQuery({ limit, before });
  const res = await fetchJson(
    `/api/tickets/${encodeURIComponent(ticketId)}/messages${qs}`,
    {
      signal,
      headers: {
        ...tenantHeaderFrom(roomId),
      },
    }
  );
  return normalizeMessagesResponse(res);
}

export async function getTicketOlderMessages({
  roomId,
  ticketId,
  beforeCursor,
  limit = 40,
  signal,
} = {}) {
  const cursorToken =
    typeof beforeCursor === "string"
      ? beforeCursor
      : beforeCursor?.token ?? undefined;
  const qs = buildQuery({ cursor: cursorToken, limit });
  const res = await fetchJson(
    `/api/tickets/${encodeURIComponent(ticketId)}/messages${qs}`,
    {
      signal,
      headers: {
        ...tenantHeaderFrom(roomId),
      },
    }
  );
  const { data, cursor } = normalizeMessagesResponse(res);
  return { items: data, prevCursor: cursor };
}

// MESSAGES — ROOM-SCOPED (legacy / deprecated in UI)
export async function getRoomWarmWindow({
  roomId,
  limit = 50,
  before,
  signal,
}) {
  const qs = buildQuery({ limit, before });
  const res = await fetchJson(
    `/api/rooms/${encodeURIComponent(roomId)}/messages${qs}`,
    {
      signal,
      headers: {
        ...tenantHeaderFrom(roomId),
      },
    }
  );
  return normalizeMessagesResponse(res);
}

export async function getRoomOlderMessages({
  roomId,
  beforeCursor,
  limit = 40,
  signal,
} = {}) {
  const cursorToken =
    typeof beforeCursor === "string"
      ? beforeCursor
      : beforeCursor?.token ?? undefined;
  const qs = buildQuery({ cursor: cursorToken, limit });
  const res = await fetchJson(
    `/api/rooms/${encodeURIComponent(roomId)}/messages${qs}`,
    {
      signal,
      headers: {
        ...tenantHeaderFrom(roomId),
      },
    }
  );
  const { data, cursor } = normalizeMessagesResponse(res);
  return { items: data, prevCursor: cursor };
}

// Party-first contacts search (legacy/simple)
export async function searchContacts({
  actorType,
  role,
  isClient,
  q,
  limit = 20,
  cursor,
  signal,
} = {}) {
  const qs = buildQuery({
    actorType,
    role,
    isClient:
      typeof isClient === "boolean"
        ? String(isClient)
        : undefined,
    q,
    limit,
    cursor,
  });
  const res = await fetchJson(`/contacts${qs}`, { signal });
  return { data: res };
}

// ------------------------------ Export Bundle -----------------------------------

export const apiService = Object.freeze({
  // NEW advanced endpoints
  contactsAdvanced,
  searchBots,

  // contacts (legacy/simple)
  searchContacts,

  // rooms
  getRooms,
  getRoom,
  getRoomMeta,
  getRoomMembers,
  registerRoom,
  renameRoom,
  pinRoom,
  muteRoom,
  leaveRoom,
  deleteRoom,

  // chats
  createChat,

  // tickets
  getTickets,
  searchTickets,
  registerTicket,
  fetchTicketsPage,

  // messages — ticket-scoped (canonical)
  getTicketWarmWindow,
  getTicketOlderMessages,

  // messages — room-scoped (legacy)
  getRoomWarmWindow,
  getRoomOlderMessages,
});

// Backwards-compat convenience aliases for callers expecting "chat warm window"
export const api = Object.freeze({
  ...apiService,

  // Prefer ticket-scoped usage by new code:
  fetchTicketWarmWindow: ({
    roomId,
    ticketId,
    limit,
    before,
    signal,
  }) => getTicketWarmWindow({ roomId, ticketId, limit, before, signal }),
  fetchTicketOlderMessages: ({
    roomId,
    ticketId,
    beforeCursor,
    limit,
    signal,
  }) =>
    getTicketOlderMessages({
      roomId,
      ticketId,
      beforeCursor,
      limit,
      signal,
    }),

  // Legacy aliases:
  // Historically "chat warm window" meant the room timeline.
  // Keep them to avoid breaking old callers; new code should use the ticket versions above.
  fetchChatWarmWindow: ({ roomId, limit, before, signal }) =>
    getRoomWarmWindow({ roomId, limit, before, signal }),
  fetchOlderMessages: ({
    roomId,
    beforeCursor,
    limit,
    signal,
  }) =>
    getRoomOlderMessages({
      roomId,
      beforeCursor,
      limit,
      signal,
    }),
});

export default api;
