/* eslint react/prop-types: 0 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Search,
  RefreshCcw,
  ChevronDown,
  Filter,
  Layers,
  Users,
  Bot as BotIcon,
  Mail,
  Phone as PhoneIcon,
  CheckCircle2,
  Clock4,
  Globe,
  Laptop,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { apiService as api } from "../services/api.service.js";

/* ---------------------------------- CONSTS --------------------------------- */

const PAGE_SIZE = 30;

// Contacts enums (from your schema)
const PARTY_TYPES = ["INSIDER", "CLIENT", "TEMP"];
const PARTY_STATUS = ["ACTIVE", "PENDING", "DISABLED"];
const PRESENCE = ["ONLINE", "AWAY", "OFFLINE"];
const CONSENT_SCOPE = ["EMAIL", "SMS", "WHATSAPP", "PUSH", "CALL"];
const CONSENT_STATUS = ["GRANTED", "DENIED", "REVOKED", "UNKNOWN"];
const IDENTITY_TYPES = ["EMAIL", "PHONE", "WHATSAPP", "PUSH", "EXTERNAL_ID"];
const DEFAULT_SORT = { field: "Party.updatedAt", dir: "desc" };

const FALLBACK_ACTOR_TYPES = {
  business: ["AGENT", "CLIENT", "SDK"],
  insider: ["AGENT"],
  personal: [],
};

/* --------------------------- UTILS & NORMALIZERS --------------------------- */

function uniqBy(xs, keyFn) {
  const seen = new Set();
  const out = [];
  for (const x of xs) {
    const k = keyFn(x);
    if (k && !seen.has(k)) {
      seen.add(k);
      out.push(x);
    }
  }
  return out;
}

function pickIdentity(identities = [], typeUpper) {
  return identities.find((i) => String(i.type).toUpperCase() === typeUpper);
}

function toParticipantType(v) {
  const up = String(v || "").toUpperCase();
  if (up === "CLIENT") return "client";
  if (up === "INSIDER") return "insider";
  if (up === "TEMP") return "temp";
  return ""; // unknown
}

/** Party → Participant-ish row */
function normalizePartyLike(it) {
  const partyId = String(it.partyId || it.id || "");
  const principalId = String(
    it.principalId || it.userId || it.actorId || it.address || it.externalId || ""
  );
  const name = it.name || it.fullName || it.displayName || partyId || "Unknown";

  const identities = Array.isArray(it.identities) ? it.identities : [];

  const emailId = pickIdentity(identities, "EMAIL");
  const phoneId = pickIdentity(identities, "PHONE");

  const partyTypeUpper = it.partyType || it.type || "";
  const participantType = toParticipantType(partyTypeUpper);

  // Best-effort actorType hint:
  // - Clients default to "client"
  // - Others left undefined; creator dialog will choose agents/watchers, etc.
  const actorType =
    participantType === "client" ? "client" : undefined;

  return {
    partyId,
    id: partyId, // canonical selection id
    principalId,
    displayName: name,
    avatarUrl: it.avatarUrl || it.imageUrl || "",
    participantType,
    actorType, // hint; not enforced here
    partyType: partyTypeUpper || "",
    status: it.status || "",
    labels: Array.isArray(it.labels) ? it.labels : [],
    presence: it.presence || it.availability || "",
    lastSeen: it.lastSeen || it.lastSeenAt || null,
    identities,
    email: emailId?.value || "",
    phone: phoneId?.value || "",
    consents: Array.isArray(it.consents) ? it.consents : [],
    groups: Array.isArray(it.groups) ? it.groups : [],
    services: Array.isArray(it.services) ? it.services : [],
    devices: Array.isArray(it.devices) ? it.devices : [],
    isBot: false,
    meta: it.meta || {},
  };
}

/** Bot → Participant-ish row (bot is an actorType; pick an internal participantType) */
function normalizeBotLike(it) {
  const id = String(it.id || it.botId || it.flowId || "");
  return {
    id,
    partyId: id,
    principalId: id,
    displayName: it.name || it.title || id || "Unknown",
    avatarUrl: it.avatarUrl || "",
    isBot: true,
    participantType: "insider", // bots are internal participants
    actorType: "bot",
    partyType: "BOT",
    status: it.status || "ACTIVE",
    labels: Array.isArray(it.tags) ? it.tags : [],
    identities: [],
    email: "",
    phone: "",
    consents: [],
    presence: "",
    groups: [],
    services: [],
    devices: [],
    meta: {
      flowId: it.flowId || id,
      capabilities: it.capabilities || [],
      tags: it.tags || [],
    },
  };
}

function missingMsg(row) {
  const miss = [];
  if (!row.id) miss.push("id");
  if (!row.displayName) miss.push("name");
  return miss.length ? `Missing ${miss.join(" & ")}` : null;
}

/* ------------------------------ QUERY PAYLOADS ----------------------------- */

function makePartyQuery({ state, cursor }) {
  const filtersAND = [];

  // Broad → Narrow ordering
  if (state.partyTypes.length) filtersAND.push({ facet: "partyType", op: "IN", value: state.partyTypes });
  if (state.partyStatus.length) filtersAND.push({ facet: "status", op: "IN", value: state.partyStatus });

  if (state.presence.length) filtersAND.push({ facet: "presence", op: "IN", value: state.presence });
  if (state.lastSeenHours) filtersAND.push({ facet: "lastSeen", op: "GTE_HOURS_AGO", value: Number(state.lastSeenHours) });

  if (state.identityTypes.length) {
    filtersAND.push({ facet: "identity", op: "EXISTS", value: state.identityTypes.map((t) => ({ type: t })) });
  }
  if (state.emailContains) filtersAND.push({ facet: "identity", op: "LIKE", value: [{ type: "EMAIL", like: state.emailContains }] });
  if (state.phoneContains) filtersAND.push({ facet: "identity", op: "LIKE", value: [{ type: "PHONE", like: state.phoneContains }] });

  if (state.consentScope.length) filtersAND.push({ facet: "consent.scope", op: "IN", value: state.consentScope });
  if (state.consentStatus.length) filtersAND.push({ facet: "consent.status", op: "IN", value: state.consentStatus });

  if (state.groups.length) filtersAND.push({ facet: "group", op: "IN", value: state.groups });
  if (state.services.length) filtersAND.push({ facet: "serviceType", op: "IN", value: state.services });

  if (state.deviceTypes.length) filtersAND.push({ facet: "deviceType", op: "IN", value: state.deviceTypes });
  if (state.requireDeviceId) filtersAND.push({ facet: "deviceId", op: "EXISTS", value: true });

  if (state.country) filtersAND.push({ facet: "country", op: "EQ", value: state.country });
  if (state.city) filtersAND.push({ facet: "city", op: "EQ", value: state.city });

  return {
    q: state.q || "",
    dsl: state.dsl || "",
    limit: PAGE_SIZE,
    cursor: cursor || null,
    sort: [DEFAULT_SORT],
    filters: { AND: filtersAND },
  };
}

function makeBotQuery({ botState, cursor }) {
  const filtersAND = [];
  if (botState.tags.length) filtersAND.push({ facet: "bot.tags", op: "ANY", value: botState.tags });
  if (botState.capabilities.length) filtersAND.push({ facet: "bot.capabilities", op: "ANY", value: botState.capabilities });
  if (botState.flowIds.length) filtersAND.push({ facet: "bot.flowId", op: "IN", value: botState.flowIds });

  return {
    q: botState.q || "",
    dsl: botState.dsl || "",
    limit: PAGE_SIZE,
    cursor: cursor || null,
    sort: [{ field: "updatedAt", dir: "desc" }],
    filters: { AND: filtersAND },
  };
}

/* --------------------------- FETCH ADAPTERS -------------------------------- */

async function fetchPartiesAdvancedOrFallback({ division, state, cursor }) {
  if (typeof api.contactsAdvanced === "function") {
    const payload = makePartyQuery({ state, cursor });
    const res = await api.contactsAdvanced(payload);
    const items = Array.isArray(res?.data?.items) ? res.data.items : Array.isArray(res?.items) ? res.items : [];
    const nextCursor = res?.data?.cursor ?? res?.cursor ?? null;
    return { items: items.map(normalizePartyLike), cursor: nextCursor };
  }

  // Fallback: actorType merges
  const actorTypes = FALLBACK_ACTOR_TYPES[division] || [];
  if (actorTypes.length === 0) return { items: [], cursor: null };

  const jobs = actorTypes.map((actorType) =>
    api.searchContacts({
      actorType,
      q: state.q || undefined,
      limit: PAGE_SIZE,
      cursor: cursor || null,
    })
  );

  const results = await Promise.allSettled(jobs);
  const flat = [];
  let mergedCursor = null;
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    const data = r.value;
    const arr = Array.isArray(data?.data?.items)
      ? data.data.items
      : Array.isArray(data?.items)
        ? data.items
        : [];
    for (const it of arr) flat.push(normalizePartyLike(it));
    mergedCursor = mergedCursor || data?.data?.pageInfo?.nextCursor || data?.pageInfo?.nextCursor || null;
  }

  // Light client screening
  const screened = flat.filter((x) => {
    if (state.partyTypes.length && !state.partyTypes.includes(String(x.partyType || "").toUpperCase())) return false;
    if (state.partyStatus.length && !state.partyStatus.includes(String(x.status || "").toUpperCase())) return false;
    if (state.presence.length && !state.presence.includes(String(x.presence || "").toUpperCase())) return false;
    return true;
  });

  return { items: uniqBy(screened, (z) => z.id), cursor: mergedCursor };
}

async function fetchBots({ botState, cursor }) {
  if (typeof api.searchBots === "function") {
    const payload = makeBotQuery({ botState, cursor });
    const res = await api.searchBots(payload);
    const list = Array.isArray(res?.data?.items) ? res.data.items : Array.isArray(res?.items) ? res.items : [];
    const nextCursor = res?.data?.cursor ?? res?.cursor ?? null;
    return { items: list.map(normalizeBotLike), cursor: nextCursor };
  }
  // No bots endpoint → guidance only
  return { items: [], cursor: null, hint: "Add api.searchBots(payload) to enable bot queries." };
}

/* ------------------------------- SUBCOMPONENTS ----------------------------- */

function FacetSection({ title, children, icon, defaultExpanded = false }) {
  return (
    <Accordion defaultExpanded={defaultExpanded} disableGutters>
      <AccordionSummary expandIcon={<ChevronDown size={16} />}>
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{title}</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}

/* ---------- Identity rendering ---------- */

function buildIdentityChunks(row) {
  const chunks = [];
  const phone = row.phone && String(row.phone).trim();
  const email = row.email && String(row.email).trim();
  const hasBoth = !!(phone && email);
  const shouldShowId = !hasBoth; // show id only if something is missing

  if (phone) {
    chunks.push({
      key: "phone",
      icon: <PhoneIcon size={14} />,
      text: phone,
      title: phone,
    });
  }
  if (email) {
    chunks.push({
      key: "email",
      icon: <Mail size={14} />,
      text: email,
      title: email,
    });
  }
  if (shouldShowId && row.id) {
    chunks.push({
      key: "id",
      icon: <ShieldAlert size={14} />,
      text: row.id,
      title: row.id,
      mono: true,
    });
  }
  return chunks;
}

function RowDetailLines({ row }) {
  const chunks = buildIdentityChunks(row);

  if (chunks.length === 0) {
    return (
      <Typography variant="caption" color="text.secondary">
        —
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        rowGap: 0.25,
      }}
    >
      {chunks.map((c, idx) => (
        <React.Fragment key={c.key}>
          {idx > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mx: 0.5 }}>
              •
            </Typography>
          )}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              minWidth: 0,
              overflow: "visible",
            }}
            title={c.title}
          >
            <Box sx={{ display: "inline-flex", mr: 0.5 }}>{c.icon}</Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                wordBreak: "break-word",
                fontFamily: c.mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined,
              }}
            >
              {c.text}
            </Typography>
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
}

function SelectedInlineIdentities({ row }) {
  const chunks = buildIdentityChunks(row);
  if (chunks.length === 0) {
    return <Typography variant="caption" color="text.secondary">—</Typography>;
  }
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", rowGap: 0.25 }}>
      {chunks.map((c, idx) => (
        <React.Fragment key={c.key}>
          {idx > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mx: 0.5 }}>•</Typography>
          )}
          <Box sx={{ display: "inline-flex", alignItems: "center", minWidth: 0 }} title={c.title}>
            <Box sx={{ display: "inline-flex", mr: 0.5 }}>{c.icon}</Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                wordBreak: "break-word",
                fontFamily: c.mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined,
              }}
            >
              {c.text}
            </Typography>
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
}

/* Chips WITHOUT identities to avoid duplication; now show actorType & participantType */
function RowChips({ row }) {
  const waConsent = (row.consents || []).find((c) => c.scope === "WHATSAPP");
  const pt = row.participantType ? String(row.participantType).toLowerCase() : "";
  const at = row.actorType ? String(row.actorType).toLowerCase() : "";
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
      {row.isBot && <Chip size="small" icon={<BotIcon size={14} />} label="bot" />}
      {at && <Chip size="small" label={at} variant="outlined" />}
      {pt && <Chip size="small" icon={<Users size={14} />} label={pt} />}
      {row.status && <Chip size="small" label={String(row.status).toLowerCase()} />}
      {row.presence && (
        <Chip size="small" icon={<Clock4 size={14} />} label={String(row.presence).toLowerCase()} />
      )}
      {waConsent && (
        <Chip
          size="small"
          icon={<CheckCircle2 size={14} />}
          label={`wa:${String(waConsent.status).toLowerCase()}`}
        />
      )}
    </Stack>
  );
}

function ResultsList({
  items,
  loading,
  selectedIds,
  onSelectToggle,
  onSelectAll,
  onLoadMore,
  hasMore,
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", mx: "auto", width: "min(780px, 100%)" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Results</Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={onSelectAll}
          disabled={loading || items.length === 0}
        >
          Select all visible
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 2, flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {/* Independent vertical scroll for results */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {loading && items.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
              <CircularProgress size={22} />
              <Typography variant="caption" sx={{ mt: 1 }}>Loading…</Typography>
            </Stack>
          ) : items.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 6, px: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">No matches. Adjust filters or apply another query.</Typography>
            </Stack>
          ) : (
            <List dense disablePadding>
              {items.map((row) => {
                const checked = selectedIds.has(row.id);
                const err = missingMsg(row);
                return (
                  <ListItem
                    key={row.id || row.principalId || row.displayName}
                    divider
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        checked={checked}
                        onChange={() => onSelectToggle(row)}
                        inputProps={{ "aria-label": `Select ${row.displayName}` }}
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={row.avatarUrl}>
                        {(row.displayName || row.id || "U").slice(0, 1).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Typography variant="body2" sx={{ fontWeight: 800 }} noWrap title={row.displayName}>
                            {row.displayName || "Unknown"}
                          </Typography>
                          {err && <Chip size="small" color="error" label={err} />}
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={0.25}>
                          <RowDetailLines row={row} />
                          <RowChips row={row} />
                        </Stack>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>

        <Divider />
        <Box sx={{ p: 1 }}>
          <Button
            onClick={onLoadMore}
            disabled={loading || !hasMore}
            variant="outlined"
            size="small"
            fullWidth
            startIcon={<RefreshCcw size={16} />}
          >
            {loading ? "Loading…" : hasMore ? "Load more" : "All loaded"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

function SelectedPanel({ selected, setSelected, onSave, filtersSnapshot }) {
  const removeOne = (id) => setSelected((prev) => { const n = new Map(prev); n.delete(id); return n; });
  const clearAll = () => setSelected(new Map());

  const payload = Array.from(selected.values()).map((r) => ({
    id: r.id,
    displayName: r.displayName,
    avatarUrl: r.avatarUrl,
    email: r.email || "",
    phone: r.phone || "",
    participantType: r.participantType || "",
    actorType: r.actorType || undefined,
    isBot: !!r.isBot,
  }));

  const chips = useMemo(() => {
    const out = [];
    if (!filtersSnapshot) return out;

    if (filtersSnapshot.sources?.parties && filtersSnapshot.sources?.bots) out.push({ k: "source", v: "both" });
    else if (filtersSnapshot.sources?.parties) out.push({ k: "source", v: "parties" });
    else if (filtersSnapshot.sources?.bots) out.push({ k: "source", v: "bots" });

    if (filtersSnapshot.division) out.push({ k: "division", v: filtersSnapshot.division });

    const st = filtersSnapshot.parties || {};
    const bt = filtersSnapshot.bots || {};

    if (st.q) out.push({ k: "q", v: st.q });
    if (st.partyTypes?.length) out.push({ k: "types", v: st.partyTypes.join(",") });
    if (st.partyStatus?.length) out.push({ k: "status", v: st.partyStatus.join(",") });
    if (st.presence?.length) out.push({ k: "presence", v: st.presence.join(",") });
    if (st.lastSeenHours) out.push({ k: "lastSeen≤h", v: String(st.lastSeenHours) });
    if (st.identityTypes?.length) out.push({ k: "ids", v: st.identityTypes.join(",") });
    if (st.emailContains) out.push({ k: "email~", v: st.emailContains });
    if (st.phoneContains) out.push({ k: "phone~", v: st.phoneContains });
    if (st.consentScope?.length) out.push({ k: "consent", v: st.consentScope.join(",") });
    if (st.consentStatus?.length) out.push({ k: "c.status", v: st.consentStatus.join(",") });
    if (st.groups?.length) out.push({ k: "groups", v: st.groups.join(",") });
    if (st.services?.length) out.push({ k: "services", v: st.services.join(",") });
    if (st.deviceTypes?.length) out.push({ k: "devices", v: st.deviceTypes.join(",") });
    if (st.requireDeviceId) out.push({ k: "hasDeviceId", v: "yes" });
    if (st.country) out.push({ k: "country", v: st.country });
    if (st.city) out.push({ k: "city", v: st.city });
    if (st.dsl) out.push({ k: "dsl", v: st.dsl });

    if (bt.q) out.push({ k: "bot.q", v: bt.q });
    if (bt.tags?.length) out.push({ k: "bot.tags", v: bt.tags.join(",") });
    if (bt.capabilities?.length) out.push({ k: "bot.cap", v: bt.capabilities.join(",") });
    if (bt.flowIds?.length) out.push({ k: "bot.flows", v: bt.flowIds.join(",") });
    if (bt.dsl) out.push({ k: "bot.dsl", v: bt.dsl });

    return out;
  }, [filtersSnapshot]);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      {/* Active filters moved to TOP; sticky within the panel */}
      <Box
        sx={{
          p: 1,
          borderBottom: (th) => `1px solid ${th.palette.divider}`,
          position: "sticky",
          top: 0,
          zIndex: 1,
          bgcolor: (th) => th.palette.background.paper,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, fontWeight: 700 }}>
          Active filters:
        </Typography>
        <Box sx={{ mt: 0.5, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {chips.length === 0 ? (
            <Chip size="small" label="(none)" />
          ) : (
            chips.map((c, idx) => (
              <Chip key={`${c.k}-${idx}`} size="small" label={`${c.k}:${c.v}`} variant="outlined" />
            ))
          )}
        </Box>
      </Box>

      {/* Independent vertical scroll for selected */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 1, minHeight: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Selected ({selected.size})
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="text" onClick={clearAll} startIcon={<Trash2 size={14} />}>
              Clear
            </Button>
            <Button size="small" variant="contained" onClick={() => onSave?.(payload)}>
              Use {selected.size} participant{selected.size === 1 ? "" : "s"}
            </Button>
          </Stack>
        </Stack>

        {selected.size === 0 ? (
          <Typography variant="body2" color="text.secondary">Nothing selected yet.</Typography>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 1 }}>
            {Array.from(selected.values()).map((r) => {
              return (
                <Paper key={r.id} variant="outlined" sx={{ p: 1, borderRadius: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={r.avatarUrl} sx={{ width: 28, height: 28 }}>
                      {(r.displayName || r.id || "U").slice(0, 1).toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {r.displayName || "Unknown"}
                      </Typography>
                      <SelectedInlineIdentities row={r} />
                      <Stack direction="row" spacing={0.5} sx={{ mt: 0.25 }}>
                        {r.actorType && <Chip size="small" variant="outlined" label={r.actorType} />}
                        {r.participantType && <Chip size="small" variant="outlined" label={r.participantType} />}
                      </Stack>
                    </Box>
                    <IconButton size="small" onClick={() => removeOne(r.id)} aria-label="Remove">
                      <Trash2 size={16} />
                    </IconButton>
                  </Stack>
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>
    </Paper>
  );
}

/* -------------------------------- MAIN MODAL ------------------------------- */

export default function RoommatePowerPicker({
  open,
  onClose,
  onSave,                 // (payload: ParticipantLite[])
  initialSelected = [],
  defaultDivision = "business", // fallback party search scope
}) {
  // Header-level global source selector: 'parties' | 'bots' | 'both'
  const [sourceMode, setSourceMode] = useState("both");

  const includeParties = sourceMode !== "bots";
  const includeBots = sourceMode !== "parties";

  // Division (fallback mode only for parties) – kept in builder and collapsed with search
  const [division, setDivision] = useState(defaultDivision);

  // Parties filter state (broad → narrow)
  const initialPartyState = useRef({
    q: "",
    dsl: "",
    autoApply: true,
    partyTypes: [],        // INSIDER|CLIENT|TEMP
    partyStatus: [],       // ACTIVE|PENDING|DISABLED
    presence: [],
    lastSeenHours: "",
    identityTypes: [],
    emailContains: "",
    phoneContains: "",
    consentScope: [],
    consentStatus: [],
    groups: [],
    services: [],
    deviceTypes: [],
    requireDeviceId: false,
    country: "",
    city: "",
  }).current;
  const [state, setState] = useState({ ...initialPartyState });

  // Bots filter state
  const initialBotState = useRef({
    q: "",
    dsl: "",
    tags: [],
    capabilities: [],
    flowIds: [],
    autoApply: true,
  }).current;
  const [botState, setBotState] = useState({ ...initialBotState });

  // Results
  const [items, setItems] = useState([]);
  const [cursorParties, setCursorParties] = useState(null);
  const [cursorBots, setCursorBots] = useState(null);
  const [loading, setLoading] = useState(false);
  const [botsHint, setBotsHint] = useState("");

  // Selected (map id -> row)
  const [selected, setSelected] = useState(() => {
    const m = new Map();
    (initialSelected || []).forEach((p) => {
      m.set(String(p.id), {
        ...p,
        isBot: !!p.isBot,
        phone: p.phone || "",
        email: p.email || "",
        participantType: p.participantType || "", // tolerate old inputs
        actorType: p.actorType || (p.isBot ? "bot" : p.participantType === "client" ? "client" : undefined),
      });
    });
    return m;
  });
  const selectedIds = useMemo(() => new Set(Array.from(selected.keys())), [selected]);

  // Filters snapshot for summary (updated whenever Apply runs)
  const [filtersSnapshot, setFiltersSnapshot] = useState(null);

  // ── FIX (1): debouncer uses latest fetchNow via ref (no stale closures)
  const debounceRef = useRef(null);
  const fetchNowRef = useRef(null);

  const fetchNow = useCallback(async ({ reset = false } = {}) => {
    setLoading(true);
    try {
      const jobs = [];
      if (includeParties) {
        jobs.push(
          fetchPartiesAdvancedOrFallback({
            division,
            state,
            cursor: reset ? null : cursorParties,
          }).then((r) => ({ kind: "parties", ...r }))
        );
      }
      if (includeBots) {
        jobs.push(
          fetchBots({
            botState,
            cursor: reset ? null : cursorBots,
          }).then((r) => ({ kind: "bots", ...r }))
        );
      }

      const results = await Promise.all(jobs);
      let merged = reset ? [] : items.slice(0);
      let nextParties = reset ? null : cursorParties;
      let nextBots = reset ? null : cursorBots;

      for (const r of results) {
        if (Array.isArray(r.items)) {
          merged = uniqBy(
            [...merged, ...r.items],
            (x) => `${x.isBot ? "b" : "p"}:${x.id}`
          );
        }
        if (r.kind === "parties") nextParties = r.cursor || null;
        if (r.kind === "bots") { nextBots = r.cursor || null; if (r.hint) setBotsHint(r.hint); }
      }

      setItems(merged);
      setCursorParties(nextParties);
      setCursorBots(nextBots);

      // Snapshot active filters for the Selected panel summary
      setFiltersSnapshot({
        sources: { parties: includeParties, bots: includeBots },
        division: includeParties ? division : null,
        parties: includeParties ? { ...state } : null,
        bots: includeBots ? { ...botState } : null,
      });
    } catch (e) {
      console.warn("[RoommatePowerPicker] fetch failed", e);
      if (reset) {
        setItems([]);
        setCursorParties(null);
        setCursorBots(null);
      }
    } finally {
      setLoading(false);
    }
  }, [includeParties, includeBots, division, state, botState, cursorParties, cursorBots, items]);

  // keep ref in sync with latest fetchNow
  useEffect(() => { fetchNowRef.current = fetchNow; }, [fetchNow]);

  const triggerFetch = useCallback((opts = { reset: true }) => {
    const wantsAuto =
      (includeParties && state.autoApply) ||
      (includeBots && botState.autoApply);

    if (!wantsAuto) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // call the freshest fetchNow
      fetchNowRef.current?.(opts);
    }, 300);
  }, [includeParties, includeBots, state.autoApply, botState.autoApply]);

  useEffect(() => {
    if (!open) return;
    fetchNow({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Handlers
  const onSelectToggle = (row) => {
    setSelected((prev) => {
      const id = String(row.id);
      const next = new Map(prev);
      if (next.has(id)) next.delete(id);
      else next.set(id, {
        id,
        displayName: row.displayName,
        avatarUrl: row.avatarUrl,
        isBot: !!row.isBot,
        phone: row.phone || "",
        email: row.email || "",
        participantType: row.participantType || "",
        actorType: row.actorType || (row.isBot ? "bot" : row.participantType === "client" ? "client" : undefined),
      });
      return next;
    });
  };

  const onSelectAll = () => {
    setSelected((prev) => {
      const next = new Map(prev);
      for (const r of items) {
        next.set(String(r.id), {
          id: r.id,
          displayName: r.displayName,
          avatarUrl: r.avatarUrl,
          isBot: !!r.isBot,
          phone: r.phone || "",
          email: r.email || "",
          participantType: r.participantType || "",
          actorType: r.actorType || (r.isBot ? "bot" : r.participantType === "client" ? "client" : undefined),
        });
      }
      return next;
    });
  };

  const applyNow = () => fetchNow({ reset: true });
  const loadMore = () => fetchNow({ reset: false });

  const resetFilters = () => {
    setState({ ...initialPartyState });
    setBotState({ ...initialBotState });
    setItems([]);
    setCursorParties(null);
    setCursorBots(null);
    setTimeout(() => fetchNowRef.current?.({ reset: true }), 0);
  };

  const parseCSV = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);

  /* --------------------------------- RENDER -------------------------------- */

  // HEADER: Global source selector (top of modal)
  const headerRight = (
    <Stack direction="row" spacing={1} alignItems="center">
      <ToggleButtonGroup
        size="small"
        exclusive
        value={sourceMode}
        onChange={(_, v) => {
          if (!v) return;
          setSourceMode(v);
          // clear cursors & refetch for new mode
          setItems([]);
          setCursorParties(null);
          setCursorBots(null);
          setTimeout(() => applyNow(), 0);
        }}
      >
        <ToggleButton value="parties">Parties</ToggleButton>
        <ToggleButton value="bots">Bots</ToggleButton>
        <ToggleButton value="both">Both</ToggleButton>
      </ToggleButtonGroup>
      <Button size="small" variant="outlined" startIcon={<RefreshCcw size={16} />} onClick={applyNow}>
        Apply
      </Button>
      <Button size="small" variant="text" onClick={resetFilters}>
        Reset filters
      </Button>
    </Stack>
  );

  // LEFT: Builder (division + search collapsed into one row)
  const builderPane = (
    <Box sx={{ borderRight: (th) => `1px solid ${th.palette.divider}`, p: 1.25, display: "flex", flexDirection: "column", minHeight: 0 }}>
      {/* Collapsed row: Division (parties only) + Search input */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        {includeParties && (
          <Select
            size="small"
            value={division}
            onChange={(e) => { setDivision(e.target.value); triggerFetch({ reset: true }); }}
            sx={{ width: 160, flex: "0 0 auto" }}
          >
            <MenuItem value="business">Business</MenuItem>
            <MenuItem value="insider">Insider</MenuItem>
            <MenuItem value="personal">Personal</MenuItem>
          </Select>
        )}
        <TextField
          placeholder="Search name, email, phone, external id, tags…"
          value={state.q || botState.q}
          onChange={(e) => {
            const v = e.target.value;
            setState((s) => ({ ...s, q: v }));
            setBotState((s) => ({ ...s, q: v }));
            triggerFetch({ reset: true });
          }}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {/* Scrollable facets area */}
      <Box sx={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {/* Parties facets — Broad → Narrow */}
        {includeParties && (
          <>
            <FacetSection title="Party (type & status)" icon={<Users size={16} />} defaultExpanded>
              <Stack spacing={1}>
                <TextField
                  label="Types (comma)"
                  size="small"
                  placeholder="INSIDER, CLIENT, TEMP"
                  value={state.partyTypes.join(",")}
                  onChange={(e) => { setState((s) => ({ ...s, partyTypes: parseCSV(e.target.value).map(v => v.toUpperCase()) })); triggerFetch({ reset: true }); }}
                  fullWidth
                />
                <TextField
                  label="Status (comma)"
                  size="small"
                  placeholder="ACTIVE"
                  value={state.partyStatus.join(",")}
                  onChange={(e) => { setState((s) => ({ ...s, partyStatus: parseCSV(e.target.value).map(v => v.toUpperCase()) })); triggerFetch({ reset: true }); }}
                  fullWidth
                />
              </Stack>
            </FacetSection>

            <FacetSection title="Presence & activity" icon={<Clock4 size={16} />} defaultExpanded>
              <Stack spacing={1}>
                <TextField
                  label="Presence (comma)"
                  size="small"
                  placeholder="ONLINE, AWAY, OFFLINE"
                  value={state.presence.join(",")}
                  onChange={(e) => { setState((s) => ({ ...s, presence: parseCSV(e.target.value).map(v => v.toUpperCase()) })); triggerFetch({ reset: true }); }}
                />
                <TextField
                  label="Last seen (hours)"
                  size="small"
                  placeholder="24"
                  value={state.lastSeenHours}
                  onChange={(e) => { setState((s) => ({ ...s, lastSeenHours: e.target.value })); triggerFetch({ reset: true }); }}
                />
              </Stack>
            </FacetSection>

            <FacetSection title="Identities" icon={<Mail size={16} />}>
              <Stack spacing={1}>
                <TextField
                  label="Types (comma)"
                  size="small"
                  placeholder="EMAIL, PHONE, WHATSAPP"
                  value={state.identityTypes.join(",")}
                  onChange={(e) => { setState((s) => ({ ...s, identityTypes: parseCSV(e.target.value).map(v => v.toUpperCase()) })); triggerFetch({ reset: true }); }}
                />
                <TextField
                  label="Email contains"
                  size="small"
                  placeholder="@company.com"
                  value={state.emailContains}
                  onChange={(e) => { setState((s) => ({ ...s, emailContains: e.target.value })); triggerFetch({ reset: true }); }}
                />
                <TextField
                  label="Phone contains"
                  size="small"
                  placeholder="+256"
                  value={state.phoneContains}
                  onChange={(e) => { setState((s) => ({ ...s, phoneContains: e.target.value })); triggerFetch({ reset: true }); }}
                />
              </Stack>
            </FacetSection>

            <FacetSection title="Consent" icon={<CheckCircle2 size={16} />}>
              <Stack spacing={1}>
                <TextField
                  label="Scopes (comma)"
                  size="small"
                  placeholder="WHATSAPP, SMS"
                  value={state.consentScope.join(",")}
                  onChange={(e) => { setState((s) => ({ ...s, consentScope: parseCSV(e.target.value).map(v => v.toUpperCase()) })); triggerFetch({ reset: true }); }}
                />
                <TextField
                  label="Status (comma)"
                  size="small"
                  placeholder="GRANTED, DENIED"
                  value={state.consentStatus.join(",")}
                  onChange={(e) => { setState((s) => ({ ...s, consentStatus: parseCSV(e.target.value).map(v => v.toUpperCase()) })); triggerFetch({ reset: true }); }}
                />
              </Stack>
            </FacetSection>

            <FacetSection title="Groups & services" icon={<Users size={16} />}>
              <Stack spacing={1}>
                <TextField
                  label="Groups (comma)"
                  size="small"
                  placeholder="VIP,Billing"
                  value={state.groups.join(",")}
                  onChange={(e) => { setState((s) => ({ ...s, groups: parseCSV(e.target.value) })); triggerFetch({ reset: true }); }}
                />
                <TextField
                  label="Services (comma)"
                  size="small"
                  placeholder="payments,support"
                  value={state.services.join(",")}
                  onChange={(e) => { setState((s) => ({ ...s, services: parseCSV(e.target.value) })); triggerFetch({ reset: true }); }}
                />
              </Stack>
            </FacetSection>

            <FacetSection title="Devices" icon={<Laptop size={16} />}>
              <Stack spacing={1}>
                <TextField
                  label="Types (comma)"
                  size="small"
                  placeholder="ios,android,web"
                  value={state.deviceTypes.join(",")}
                  onChange={(e) => { setState((s) => ({ ...s, deviceTypes: parseCSV(e.target.value) })); triggerFetch({ reset: true }); }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={state.requireDeviceId}
                      onChange={(e) => { setState((s) => ({ ...s, requireDeviceId: e.target.checked })); triggerFetch({ reset: true }); }}
                    />
                  }
                  label={<Typography variant="caption">Require deviceId</Typography>}
                />
              </Stack>
            </FacetSection>

            <FacetSection title="Geography" icon={<Globe size={16} />}>
              <Stack spacing={1} direction="row">
                <TextField
                  label="Country"
                  size="small"
                  placeholder="UG"
                  value={state.country}
                  onChange={(e) => { setState((s) => ({ ...s, country: e.target.value })); triggerFetch({ reset: true }); }}
                  fullWidth
                />
                <TextField
                  label="City"
                  size="small"
                  placeholder="Kampala"
                  value={state.city}
                  onChange={(e) => { setState((s) => ({ ...s, city: e.target.value })); triggerFetch({ reset: true }); }}
                  fullWidth
                />
              </Stack>
            </FacetSection>

            <FacetSection title="Advanced (DSL)" icon={<Layers size={16} />}>
              <TextField
                placeholder='e.g. presence:online AND consent.whatsapp=granted'
                value={state.dsl}
                onChange={(e) => { setState((s) => ({ ...s, dsl: e.target.value })); triggerFetch({ reset: true }); }}
                size="small"
                fullWidth
                multiline
                minRows={2}
              />
            </FacetSection>
          </>
        )}

        {/* Bots facets */}
        {includeBots && (
          <>
            <FacetSection title="Bots" icon={<BotIcon size={16} />} defaultExpanded>
              <Stack spacing={1}>
                <TextField
                  label="Tags (comma)"
                  size="small"
                  placeholder="support,payments"
                  value={botState.tags.join(",")}
                  onChange={(e) => { setBotState((s) => ({ ...s, tags: parseCSV(e.target.value) })); triggerFetch({ reset: true }); }}
                  fullWidth
                />
                <TextField
                  label="Capabilities (comma)"
                  size="small"
                  placeholder="faq,intents,handover"
                  value={botState.capabilities.join(",")}
                  onChange={(e) => { setBotState((s) => ({ ...s, capabilities: parseCSV(e.target.value) })); triggerFetch({ reset: true }); }}
                  fullWidth
                />
                <TextField
                  label="Flow IDs (comma)"
                  size="small"
                  placeholder="flow_123,returns_flow"
                  value={botState.flowIds.join(",")}
                  onChange={(e) => { setBotState((s) => ({ ...s, flowIds: parseCSV(e.target.value) })); triggerFetch({ reset: true }); }}
                  fullWidth
                />
              </Stack>
            </FacetSection>

            <FacetSection title="Advanced (DSL)" icon={<Layers size={16} />}>
              <TextField
                placeholder='e.g. bot.tags:payments AND bot.capabilities:handover'
                value={botState.dsl}
                onChange={(e) => { setBotState((s) => ({ ...s, dsl: e.target.value })); triggerFetch({ reset: true }); }}
                size="small"
                fullWidth
                multiline
                minRows={2}
              />
            </FacetSection>

            {botsHint && (
              <Paper variant="outlined" sx={{ p: 1, mt: 1, borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">{botsHint}</Typography>
              </Paper>
            )}
          </>
        )}
      </Box>

      {/* Apply + Auto at bottom of builder */}
      <Stack direction="row" spacing={1} sx={{ pt: 1, justifyContent: "flex-start", alignItems: "center" }}>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={state.autoApply && botState.autoApply}
              onChange={(e) => {
                setState((s) => ({ ...s, autoApply: e.target.checked }));
                setBotState((s) => ({ ...s, autoApply: e.target.checked }));
              }}
            />
          }
          label={<Typography variant="caption">Auto-apply</Typography>}
        />
        <Button size="small" variant="outlined" startIcon={<RefreshCcw size={16} />} onClick={applyNow}>
          Apply
        </Button>
        <Button size="small" variant="text" onClick={resetFilters}>
          Reset
        </Button>
      </Stack>
    </Box>
  );

  // CENTER: Results (own scrollbar)
  const resultsPane = (
    <Box sx={{ p: 1.25, borderRight: (th) => `1px solid ${th.palette.divider}`, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <ResultsList
          items={items}
          loading={loading}
          selectedIds={selectedIds}
          onSelectToggle={onSelectToggle}
          onSelectAll={onSelectAll}
          onLoadMore={loadMore}
          hasMore={!!(cursorParties || cursorBots)}
        />
      </Box>
    </Box>
  );

  // RIGHT: Selected + Filters summary (own scrollbar)
  const selectedPane = (
    <Box sx={{ p: 1.25, minWidth: 400, width: 400, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <SelectedPanel
        selected={selected}
        setSelected={setSelected}
        onSave={onSave}
        filtersSnapshot={filtersSnapshot}
      />
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl" aria-labelledby="power-picker">
      <DialogTitle id="power-picker">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Filter size={18} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Pick participants</Typography>
          </Stack>
          {headerRight}
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {/* Three fixed columns; each owns its vertical scroll */}
        <Box sx={{ display: "grid", gridTemplateColumns: "430px 1fr 400px", height: "80vh", minHeight: 560 }}>
          {builderPane}
          {resultsPane}
          {selectedPane}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
