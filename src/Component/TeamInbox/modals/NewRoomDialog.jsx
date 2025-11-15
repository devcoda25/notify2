// src/TeamInbox/modals/NewRoomDialog.jsx
/* eslint react/prop-types: 0 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Paper, Stack, TextField, Typography, Tooltip, Alert, Avatar, MenuItem,
} from "@mui/material";
import { useUserStore } from "../../../auth/user.store.js";
import RoommatePickerModal from "./RoommatePickerModal.jsx";

/* ----------------------- tiny persistence helpers ----------------------- */

const LS_KEY = "ti:newRoomDraft";

// Convert Sets ↔ Arrays for JSON
function serializeDraft(d) {
  return JSON.stringify({
    ...d,
    agentIds: Array.from(d.agentIds || []),
    seniorIds: Array.from(d.seniorIds || []),
    watcherIds: Array.from(d.watcherIds || []),
  });
}
function deserializeDraft(raw) {
  try {
    const d = JSON.parse(raw || "{}");
    return {
      roomTitle: d.roomTitle || "",
      roomDivision: d.roomDivision || "business",
      participants: Array.isArray(d.participants) ? d.participants : [],
      agentIds: new Set(Array.isArray(d.agentIds) ? d.agentIds : []),
      seniorIds: new Set(Array.isArray(d.seniorIds) ? d.seniorIds : []),
      watcherIds: new Set(Array.isArray(d.watcherIds) ? d.watcherIds : []),
    };
  } catch {
    return null;
  }
}

function saveDraftSafe(draft) {
  try { localStorage.setItem(LS_KEY, serializeDraft(draft)); } catch {}
}
function readDraftSafe() {
  try { return deserializeDraft(localStorage.getItem(LS_KEY)); } catch { return null; }
}
function clearDraftSafe() {
  try { localStorage.removeItem(LS_KEY); } catch {}
}

/* ----------------------------- UI bits ----------------------------- */

function AvailabilityChip({ isPending, isAvailable }) {
  return (
    <Chip
      size="small"
      color={isAvailable ? "success" : isPending ? "default" : "warning"}
      label={isPending ? "Updating…" : isAvailable ? "Available" : "Unavailable"}
      variant="outlined"
    />
  );
}

/* ==================================================================== */

export default function NewRoomDialog({ open, onClose, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const extKeyRef = useRef(null); // idempotency key (resets per successful creation)

  const availability = (useUserStore((s) => s.currentUser?.availability) || "").toLowerCase();
  const isPending = !!useUserStore((s) => s.presencePending);
  const isAvailable = availability === "available";

  // -------------------- STATE (with persisted draft) --------------------
  const [roomTitle, setRoomTitle] = useState("");
  const [roomDivision, setRoomDivision] = useState("business");
  const [participants, setParticipants] = useState([]);
  const [agentIds, setAgentIds] = useState(new Set());
  const [seniorIds, setSeniorIds] = useState(new Set());
  const [watcherIds, setWatcherIds] = useState(new Set());
  const [pickerOpen, setPickerOpen] = useState(false);

  // Load draft only once when dialog first opens
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!open) return;
    if (hydratedRef.current) return;
    const draft = readDraftSafe();
    if (draft) {
      setRoomTitle(draft.roomTitle);
      setRoomDivision(draft.roomDivision);
      setParticipants(draft.participants);
      setAgentIds(draft.agentIds);
      setSeniorIds(draft.seniorIds);
      setWatcherIds(draft.watcherIds);
    }
    hydratedRef.current = true;
  }, [open]);

  // Debounced persist on any change
  const draftDebounceRef = useRef(null);
  useEffect(() => {
    if (!open) return; // only persist while dialog is open (prevents stale overwrites from background)
    if (draftDebounceRef.current) clearTimeout(draftDebounceRef.current);
    draftDebounceRef.current = setTimeout(() => {
      saveDraftSafe({
        roomTitle,
        roomDivision,
        participants,
        agentIds,
        seniorIds,
        watcherIds,
      });
    }, 200);
    return () => {
      if (draftDebounceRef.current) clearTimeout(draftDebounceRef.current);
    };
  }, [open, roomTitle, roomDivision, participants, agentIds, seniorIds, watcherIds]);

  // Helpers to reset all state + clear draft (after successful create)
  function resetAll() {
    setRoomTitle("");
    setRoomDivision("business");
    setParticipants([]);
    setAgentIds(new Set());
    setSeniorIds(new Set());
    setWatcherIds(new Set());
    extKeyRef.current = null;
    clearDraftSafe();
    hydratedRef.current = false; // next open can re-hydrate (will be empty)
  }

  // -------------------- business rules & gating --------------------
  const handlersRequired = useMemo(
    () => ({
      agents: roomDivision === "business",
      seniors: roomDivision === "insider",
      watchers: false,
    }),
    [roomDivision]
  );

  const isEligibleAgent = (p) => {
    const t = String(p?.actorType || "").toUpperCase();
    if (!t) return true; // tolerate unknown; server enforces strictly
    return t === "AGENT" || t === "BOT";
  };

  const canCreate = useMemo(() => {
    if (!isAvailable) return false;
    if (!roomTitle.trim()) return false;
    if (roomDivision !== "personal" && participants.length === 0) return false;
    if (handlersRequired.agents && agentIds.size === 0) return false;
    if (handlersRequired.seniors && seniorIds.size === 0) return false;
    if (isSubmitting) return false;

    const rmSet = new Set(participants.map((p) => p.id));
    if ([...agentIds].some((id) => !rmSet.has(id))) return false;
    if ([...seniorIds].some((id) => !rmSet.has(id))) return false;
    if ([...watcherIds].some((id) => !rmSet.has(id))) return false;

    if (roomDivision === "business") {
      for (const id of agentIds) {
        const p = participants.find((r) => r.id === id);
        if (p && !isEligibleAgent(p)) return false;
      }
    }
    return true;
  }, [
    isAvailable,
    roomTitle,
    roomDivision,
    participants,
    agentIds,
    seniorIds,
    watcherIds,
    handlersRequired,
    isSubmitting,
  ]);

  // -------------------- submit --------------------
  const submit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const participantIds = participants.map((p) => String(p.id)).filter(Boolean);

    // stable idempotency key per dialog session (resets after a successful create)
    if (!extKeyRef.current) {
      extKeyRef.current = `newroom_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }

    try {
      const payload = {
        externalKey: "ui-newroom", // stays in the top-level for older gateways, harmless
        title: roomTitle.trim(),
        division: roomDivision,
        participants: participantIds, // canonical
        roommates: participantIds,    // legacy fallback (server ignores or uses)
        meta: {
          ...(agentIds.size ? { defaultAgents: [...agentIds] } : {}),
          ...(seniorIds.size ? { defaultSeniors: [...seniorIds] } : {}),
          ...(watcherIds.size ? { watchers: [...watcherIds] } : {}),
          externalKey: extKeyRef.current,
        },
      };

      const res = await onSubmit?.(payload);

      // If onSubmit didn't throw, treat as success → wipe draft/state
      resetAll();
      onClose?.();
      return res;
    } catch (e) {
      // keep the draft — user can fix and retry
      // eslint-disable-next-line no-console
      console.warn("[NewRoomDialog] Create failed; keeping draft for retry", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- memoized maps --------------------
  const participantsMap = useMemo(() => {
    const m = new Map();
    participants.forEach((p) => m.set(p.id, p));
    return m;
  }, [participants]);

  const toggleHandler = (kind, id) => {
    const next =
      kind === "agent" ? new Set(agentIds) : kind === "senior" ? new Set(seniorIds) : new Set(watcherIds);
    next.has(id) ? next.delete(id) : next.add(id);
    (kind === "agent" ? setAgentIds : kind === "senior" ? setSeniorIds : setWatcherIds)(next);
  };

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} fullWidth maxWidth="lg" aria-labelledby="new-room-title">
      <DialogTitle id="new-room-title">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Create a room
          </Typography>
          <AvailabilityChip isPending={isPending} isAvailable={isAvailable} />
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Grid container>
          {/* LEFT column */}
          <Grid item xs={12} md={7}>
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.25 }}>
              {/* Title + Division in one row */}
              <Stack direction="row" alignItems="center" spacing={1.25}>
                <TextField
                  label="Room title"
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  size="small"
                  fullWidth
                  inputProps={{ maxLength: 120 }}
                  disabled={isSubmitting}
                />
                <TextField
                  select
                  label="Room division"
                  value={roomDivision}
                  onChange={(e) => setRoomDivision(e.target.value)}
                  size="small"
                  sx={{ minWidth: 240 }}
                  disabled={isSubmitting}
                >
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="insider">Insider</MenuItem>
                  <MenuItem value="personal">Personal</MenuItem>
                </TextField>
              </Stack>

              {/* Pick participants */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Button variant="outlined" size="small" onClick={() => setPickerOpen(true)} disabled={isSubmitting}>
                  Pick Participants
                </Button>
                <Typography variant="caption" color="text.secondary">
                  Filter & select in the picker modal.
                </Typography>
              </Stack>

              {roomDivision === "business" && (
                <HandlerChooser
                  title="Default Agents (required)"
                  people={participants}
                  chosen={agentIds}
                  onToggle={(id) => !isSubmitting && toggleHandler("agent", id)}
                  required
                  minBodyHeight={220}
                  disabled={isSubmitting}
                />
              )}

              {roomDivision === "insider" && (
                <HandlerChooser
                  title="Default Seniors (required)"
                  people={participants}
                  chosen={seniorIds}
                  onToggle={(id) => !isSubmitting && toggleHandler("senior", id)}
                  required
                  minBodyHeight={220}
                  disabled={isSubmitting}
                />
              )}

              {roomDivision !== "personal" && (
                <HandlerChooser
                  title="Watchers (optional)"
                  people={participants}
                  chosen={watcherIds}
                  onToggle={(id) => !isSubmitting && toggleHandler("watcher", id)}
                  minBodyHeight={190}
                  disabled={isSubmitting}
                />
              )}

              {/* Inline validations */}
              {!isAvailable && (
                <Alert severity="warning" variant="outlined">
                  You must be <b>Available</b> to create a room.
                </Alert>
              )}
              {roomDivision !== "personal" && participants.length === 0 && (
                <Alert severity="info" variant="outlined">
                  Select at least one Participant.
                </Alert>
              )}
              {roomDivision === "business" && agentIds.size === 0 && (
                <Alert severity="warning" variant="outlined">
                  Agents are required for Business rooms.
                </Alert>
              )}
              {roomDivision === "insider" && seniorIds.size === 0 && (
                <Alert severity="warning" variant="outlined">
                  Seniors are required for Insider rooms.
                </Alert>
              )}
            </Box>
          </Grid>

          {/* RIGHT column (review) */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                p: 2,
                position: { md: "sticky" },
                top: 0,
                alignSelf: "flex-start",
                maxHeight: "100vh",
                borderLeft: (th) => `1px solid ${th.palette.divider}`,
                bgcolor: "background.paper",
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
              }}
            >
              <Typography variant="overline">Review</Typography>

              <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap title={roomTitle || "Untitled"}>
                  {roomTitle || "Untitled"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Division: {roomDivision}
                </Typography>
              </Paper>

              <Typography variant="overline">Participants ({participants.length})</Typography>
              <PeopleList
                items={participants}
                onRemove={(id) => {
                  if (isSubmitting) return;
                  setParticipants((prev) => prev.filter((p) => p.id !== id));
                  setAgentIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
                  setSeniorIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
                  setWatcherIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
                }}
                onClear={() => {
                  if (isSubmitting) return;
                  setParticipants([]);
                  setAgentIds(new Set());
                  setSeniorIds(new Set());
                  setWatcherIds(new Set());
                }}
              />

              {(roomDivision === "business" || roomDivision === "insider") && (
                <>
                  <Typography variant="overline">
                    {roomDivision === "business" ? "Agents" : "Seniors"} (
                    {roomDivision === "business" ? agentIds.size : seniorIds.size})
                  </Typography>
                  <ChosenList ids={roomDivision === "business" ? agentIds : seniorIds} map={participantsMap} />
                </>
              )}

              {roomDivision !== "personal" && (
                <>
                  <Typography variant="overline">Watchers ({watcherIds.size})</Typography>
                  <ChosenList ids={watcherIds} map={participantsMap} />
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>

        <Tooltip
          arrow
          title={
            !isAvailable
              ? "You must be Available"
              : !roomTitle.trim()
                ? "Add a room title"
                : roomDivision !== "personal" && participants.length === 0
                  ? "Pick Participants"
                  : roomDivision === "business" && agentIds.size === 0
                    ? "Pick Agents"
                    : roomDivision === "insider" && seniorIds.size === 0
                      ? "Pick Seniors"
                      : "Create room"
          }
        >
          <span>
            <Button
              disabled={!canCreate}
              variant="contained"
              onClick={submit}
              sx={{ position: "relative", minWidth: 96 }}
            >
              {isSubmitting ? "Creating…" : "Create"}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>

      {pickerOpen && (
        <RoommatePickerModal
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          initialSelected={participants}
          onSave={(list) => {
            setParticipants(list);
            setPickerOpen(false);
          }}
          disabled={isSubmitting}
        />
      )}
    </Dialog>
  );
}

/* --- shared widgets --- */

function ScrollPaper({ children, minBodyHeight = 0 }) {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ p: 1, maxHeight: 220, minHeight: minBodyHeight, overflowY: "auto" }}>{children}</Box>
    </Paper>
  );
}

function PeopleList({ items, onRemove, onClear, minBodyHeight }) {
  return (
    <ScrollPaper minBodyHeight={minBodyHeight}>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No Participants selected yet.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {items.map((p) => (
            <Stack key={p.id} direction="row" alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                <Avatar src={p.avatarUrl} sx={{ width: 28, height: 28 }}>
                  {(p.displayName || p.id).slice(0, 1).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 600 }} title={p.displayName}>
                    {p.displayName}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
                    {p.actorType && <Chip size="small" variant="outlined" label={p.actorType} />}
                  </Stack>
                </Box>
              </Stack>
              <Button size="small" onClick={() => onRemove(p.id)}>
                Remove
              </Button>
            </Stack>
          ))}
          {items.length > 0 && (
            <Box>
              <Button size="small" onClick={onClear}>
                Clear participants
              </Button>
            </Box>
          )}
        </Stack>
      )}
    </ScrollPaper>
  );
}

function HandlerChooser({ title, people, chosen, onToggle, required = false, minBodyHeight = 0, disabled = false }) {
  return (
    <ScrollPaper minBodyHeight={minBodyHeight}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75 }}>
        {title} {required && <Chip size="small" label="Required" color="warning" variant="outlined" sx={{ ml: 0.5 }} />}
      </Typography>
      {people.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Pick participants first.
        </Typography>
      ) : (
        <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.75 }}>
          {people.map((p) => {
            const active = chosen.has(p.id);
            return (
              <Chip
                key={`h-${p.id}`}
                size="small"
                clickable={!disabled}
                color={active ? "primary" : "default"}
                variant={active ? "filled" : "outlined"}
                onClick={() => !disabled && onToggle(p.id)}
                label={p.displayName}
              />
            );
          })}
        </Stack>
      )}
    </ScrollPaper>
  );
}

function ChosenList({ ids, map, minBodyHeight = 0 }) {
  const list = [...ids].map((id) => map.get(id)).filter(Boolean);
  return (
    <ScrollPaper minBodyHeight={minBodyHeight}>
      {list.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          None selected.
        </Typography>
      ) : (
        <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.75 }}>
          {list.map((p) => (
            <Chip key={`chosen-${p.id}`} size="small" label={p.displayName} variant="outlined" />
          ))}
        </Stack>
      )}
    </ScrollPaper>
  );
}
