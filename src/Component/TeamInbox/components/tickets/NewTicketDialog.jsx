// src/TeamInbox/components/modals/NewTicketDialog.jsx
// Dialog to create a Ticket inside the current Room.
// Updated per requirements:
// - Subject mandatory (no asterisks). Submit stays disabled with a clear reason.
// - Tags mandatory (≥1). Enter to add; no "Add" button.
// - NO channel field, NO priority field.
// - Participants: subset of Room roommates.
// - Agents: at least one Agent is required for ALL rooms.
// - Business rooms: at least one Client AND at least one Agent.
// - Party-first: eligibility via actorType/role/isBot.
// - Creator is an Agent & roommate (auto-picked if detectable).
// - Chip layout: compact horizontal wrap (minimal vertical gap).
// - Labels carry helper hints (no "(what is …)" tooltips).
// - Display labels prefer name/email/phone, falling back to id.

import React from "react";
import {
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import { X } from "lucide-react";

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onSubmit: (payload: {
 *     roomId: string,
 *     subject: string,
 *    purpose?: string,
 *     participantIds: string[],
 *     agentIds: string[],
 *     tags: string[],
 *     meta?: any,
 *   }) => void,
 *   roomId: string,
 *   roomMembers: Array<{
 *     id: string,
 *     displayName?: string,
 *     name?: string,
 *     email?: string,
 *     phone?: string,
 *     address?: string,
 *     role?: string,
 *     actorType?: string,
 *     isBot?: boolean,
 *     meta?: any
 *   }>,
 *   roomDivision?: 'business'|'insider'|'personal',
 * }} props
 */
export default function NewTicketDialog({
  open,
  onClose,
  onSubmit,
  roomId,
  roomMembers = [],
  roomDivision = "business",
}) {
  const isBusiness = roomDivision === "business";

  /* ---------------------- Eligibility helpers (party-first) ---------------------- */
  const isAgentish = React.useCallback((m) => {
    const role = String(m.role || "").toLowerCase();
    const at = String(m.actorType || "").toUpperCase();
    return (
      at === "EMPLOYEE" ||
      at === "AGENT" ||
      role.includes("agent") ||
      role.includes("support") ||
      role.includes("manager") ||
      role.includes("watcher") ||
      m.isBot === true
    );
  }, []);

  const isClientish = React.useCallback((m) => {
    const role = String(m.role || "").toLowerCase();
    const at = String(m.actorType || "").toUpperCase();
    return (
      at === "CLIENT" ||
      at === "CUSTOMER" ||
      role.includes("client") ||
      role.includes("customer") ||
      role.includes("lead") ||
      role.includes("prospect")
    );
  }, []);

  const isCreator = React.useCallback((m) => {
    const role = String(m.role || "").toLowerCase();
    const meta = m.meta || {};
    return !!meta.isCreator || role.includes("creator") || role.includes("owner") || role.includes("initiator");
  }, []);

  const eligibleAgentIds = React.useMemo(() => {
    return new Set(roomMembers.filter(isAgentish).map((m) => m.id));
  }, [roomMembers, isAgentish]);

  const eligibleClientIds = React.useMemo(() => {
    return new Set(roomMembers.filter(isClientish).map((m) => m.id));
  }, [roomMembers, isClientish]);

  const eligibleAgentsList = React.useMemo(() => {
    const set = eligibleAgentIds;
    return [...roomMembers.filter((m) => set.has(m.id))].sort((a, b) =>
      (a.displayName || a.name || a.email || a.phone || a.id || "").localeCompare(
        b.displayName || b.name || b.email || b.phone || b.id || ""
      )
    );
  }, [roomMembers, eligibleAgentIds]);

  /* --------------------------------- Form state -------------------------------- */
  const [subject, setSubject] = React.useState("");
  const [purpose, setPurpose] = React.useState("");
  const [selected, setSelected] = React.useState([]); // participantIds
  const [agents, setAgents] = React.useState([]); // agentIds (subset of selected)
  const [tagInput, setTagInput] = React.useState("");
  const [tags, setTags] = React.useState([]);

  React.useEffect(() => {
    if (!open) return;

    // Reset clean
    setSubject("");
    setPurpose("");
    setTags([]);
    setTagInput("");

    // Default selection: insiders only (agents). Let creator pick clients.
    const creator = roomMembers.find(isCreator);
    const initialAgents = Array.from(
      new Set([
        ...(creator && isAgentish(creator) ? [creator.id] : []),
        ...(eligibleAgentsList.length ? [eligibleAgentsList[0].id] : []),
      ])
    ).filter(Boolean);

    setAgents(initialAgents);
    setSelected(initialAgents); // only insiders by default
  }, [open, roomMembers, eligibleAgentsList, isCreator, isAgentish]);

  /* ------------------------------- Selection helpers --------------------------- */
  const isSelected = React.useCallback((id) => selected.includes(id), [selected]);

  const toggleParticipant = (id) => {
    setSelected((xs) => {
      const exists = xs.includes(id);
      if (exists) {
        if (agents.includes(id)) setAgents((as) => as.filter((a) => a !== id)); // keep agent⊆participants
        return xs.filter((x) => x !== id);
      }
      return [...xs, id];
    });
  };

  const clearAll = () => {
    // Keep agents as participants
    setSelected([...agents]);
  };

  const toggleAgent = (id) => {
    if (!eligibleAgentIds.has(id)) return;
    setAgents((xs) => {
      const exists = xs.includes(id);
      const next = exists ? xs.filter((x) => x !== id) : [...xs, id];
      // Ensure agent ∈ participants
      setSelected((ps) => (ps.includes(id) ? ps : [...ps, id]));
      return next;
    });
  };

  /* ------------------------------------ Tags ----------------------------------- */
  const addTag = () => {
    const v = (tagInput || "").trim();
    if (!v) return;
    if (tags.some((t) => t.toLowerCase() === v.toLowerCase())) {
      setTagInput("");
      return;
    }
    setTags((xs) => [...xs, v]);
    setTagInput("");
  };
  const removeTag = (v) => setTags((xs) => xs.filter((x) => x !== v));

  /* ------------------------------ Validation logic ----------------------------- */
  const hasAgent = agents.length > 0;
  const hasClient = selected.some((id) => eligibleClientIds.has(id));
  const participantsRuleOk = isBusiness ? (hasAgent && hasClient) : hasAgent;

  const subjectOk = subject.trim().length > 0;
  const tagsOk = tags.length > 0;

  const canSubmit = subjectOk && tagsOk && participantsRuleOk;

  const firstBlocker = React.useMemo(() => {
    if (!subjectOk) return "Add a subject.";
    if (!tagsOk) return "Add at least one tag.";
    if (!hasAgent) return "Select at least one Agent.";
    if (isBusiness && !hasClient) return "Business Tickets also need a Client participant.";
    return "";
  }, [subjectOk, tagsOk, hasAgent, isBusiness, hasClient]);

  /* ---------------------------- Label render helpers --------------------------- */
  const labelFor = (m) => {
    const parts = [
      m.displayName || m.name || "",
      m.email || "",
      m.phone || "",
      m.address || "",
    ].filter(Boolean);
    const text = parts.length ? parts.join(" · ") : (m.id || "");
    // Shorten extremely long labels for chip readability
    return text.length > 80 ? text.slice(0, 77) + "…" : text;
  };

  /* ------------------------------------- UI ------------------------------------ */
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ pr: 6, fontWeight: 800 }}>
        New Ticket
      </DialogTitle>
      <IconButton aria-label="Close" onClick={onClose} sx={{ position: "absolute", right: 12, top: 10 }}>
        <X size={18} />
      </IconButton>

      <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
        {/* Subject */}
        <FieldLabel
          title="Ticket subject"
          hint="Use a short, specific title. Example: “Pricing follow-up (Q4)”."
        />
        <TextField
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
          placeholder="e.g. Pricing follow-up (Q4)"
          sx={{ mb: 2.5 }}
          inputProps={{ maxLength: 160 }}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        {/* Purpose & context (optional) */}
        <FieldLabel
          title="Purpose & context"
          hint="Briefly explain why this ticket exists and what outcome is expected."
        />
        <TextField
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          placeholder="Add background, expectations, links, or references for teammates…"
          sx={{ mb: 2.5 }}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        {/* Participants */}
        <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 0.75 }}>
          <FieldLabel
            title="Participants"
            hint={isBusiness
              ? "Pick roommates to include. Business Tickets must include at least one Client and one Agent."
              : "Pick roommates to include. Every Ticket needs at least one Agent."
            }
          />
          {!!roomMembers.length && (
            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={clearAll}>Clear</Button>
            </Stack>
          )}
        </Stack>

        <ChipCloud
          items={roomMembers}
          isActive={(m) => isSelected(m.id)}
          onToggle={(m) => toggleParticipant(m.id)}
          emptyText="This room has no roommates yet."
          renderLabel={labelFor}
          sx={{ mb: 1.25 }}
        />

        {/* Agents */}
        <FieldLabel
          title="Agents (Responsible)"
          hint="Agents are insiders. At least one Agent is required for every Ticket."
          sx={{ mt: 2 }}
        />

        <ChipCloud
          items={eligibleAgentsList}
          isActive={(m) => agents.includes(m.id)}
          onToggle={(m) => toggleAgent(m.id)}
          emptyText="No eligible Agents in this room. Add insiders to the room first."
          renderLabel={(m) => (labelFor(m) + (m.isBot ? " · Bot" : ""))}
          sx={{ mb: 1 }}
        />

        {/* Tags */}
        <FieldLabel
          title="Tags"
          hint="Press Enter to add. Use 1–3 concise tags to classify this Ticket."
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          placeholder="Type a tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          InputProps={{ sx: { borderRadius: 2 } }}
        />
        {!!tags.length && (
          <Stack
            direction="row"
            sx={{ mt: 1, flexWrap: "wrap", columnGap: 0.75, rowGap: 0.5 }}
          >
            {tags.map((t) => (
              <Chip key={t} label={t} onDelete={() => removeTag(t)} sx={{ borderRadius: 2 }} />
            ))}
          </Stack>
        )}

      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
        <Typography
          variant="caption"
          color={canSubmit ? "text.secondary" : "warning.main"}
          sx={{ pr: 2 }}
        >
          {canSubmit ? "Ready to create this Ticket." : firstBlocker}
        </Typography>

        <Box>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, px: 3, mr: 1 }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!canSubmit) return;
              // Clamp agents to selected & eligibility
              const sel = new Set(selected);
              const eligA = eligibleAgentIds;
              const finalAgents = (agents || []).filter((id) => sel.has(id) && eligA.has(id));

              onSubmit?.({
                roomId,
                subject: subject.trim(),
                purpose: purpose.trim() || undefined,
                participantIds: selected,
                agentIds: finalAgents,
                tags,
                agents: finalAgents,
                meta: {
                  policy: {
                    requiresAgent: true,
                    requiresClientForBusiness: isBusiness,
                  },
                },
              });
            }}
            disabled={!canSubmit}
            variant="contained"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Create Ticket
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

/* -------------------------------- Aux components ------------------------------ */

function FieldLabel({ title, hint, sx }) {
  return (
    <Box sx={{ mb: 0.75, ...(sx || {}) }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>
      {hint ? (
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      ) : null}
    </Box>
  );
}

/**
 * ChipCloud: compact horizontal wrap with minimal vertical spacing.
 */
function ChipCloud({
  items = [],
  isActive,
  onToggle,
  emptyText = "No items.",
  renderLabel = (m) => m.displayName || m.name || m.email || m.phone || m.address || m.id,
  sx,
}) {
  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
        {emptyText}
      </Typography>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: 0.75,
        rowGap: 0.5,
        ...(sx || {}),
      }}
    >
      {items.map((m) => {
        const active = isActive(m);
        return (
          <Chip
            key={m.id}
            label={renderLabel(m)}
            color={active ? "primary" : "default"}
            variant={active ? "filled" : "outlined"}
            onClick={() => onToggle(m)}
            aria-pressed={active}
            sx={{ borderRadius: 2, m: 0 }}
          />
        );
      })}
    </Box>
  );
}
