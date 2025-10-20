// Path: src/Component/Meetings/components/EventTypeDetailsDialog.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Divider,
  Box,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
  Clock,
  Shield,
  Palette,
  Copy as CopyIcon,
  ExternalLink,
} from "lucide-react";
import { useEventTypesStore } from "../../store/scheduling/useEventTypesStore";
import ConfirmDialog from "../utils/ConfirmDialog";

function formatLocal(dateLike) {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const d = new Date(dateLike || Date.now());
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz,
    }).format(d);
  } catch {
    return new Date(dateLike || Date.now()).toLocaleString();
  }
}

export default function EventTypeDetailsDialog({
  open,
  eventTypeId,
  onClose,
  onEdit, // () => void
}) {
  const theme = useTheme();
  const store = useEventTypesStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  // Re-render on store changes (active toggle, edits, etc.)
  const data = useMemo(() => {
    if (!eventTypeId) return null;
    return (store.eventTypes || []).find((e) => e.id === eventTypeId) || null;
  }, [eventTypeId, store.eventTypes]);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  if (!data) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Event Type</DialogTitle>
        <DialogContent dividers>
          <Typography color="text.secondary">Not found.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const origin =
    typeof window !== "undefined" && window.location?.origin ? window.location.origin : "";
  const fullUrl = `${origin}/book/${data.slug}`;

  const toggleActive = () => store.setActive(data.id, !data.active);
  const askDelete = () => setConfirmDelete(true);
  const doDelete = () => {
    store.deleteEventType?.(data.id);
    setConfirmDelete(false);
    onClose?.();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback: select text? keeping silent to avoid noisy UX
    }
  };

  const preview = () => {
    if (origin) window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            pb: 1,
            background: `linear-gradient(0deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, transparent 100%)`,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0 }}>
              <Box sx={{ width: 10, height: 10, bgcolor: data.color, borderRadius: 0.5, flexShrink: 0 }} />
              <Typography variant="h6" noWrap title={data.name}>
                {data.name}
              </Typography>
            </Stack>

            {/* Status chip toggles active state */}
            <Tooltip title={data.active ? "Click to deactivate" : "Click to activate"}>
              <Chip
                onClick={toggleActive}
                clickable
                size="small"
                color={data.active ? "success" : "default"}
                icon={data.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                label={data.active ? "Active" : "Inactive"}
                sx={{
                  border: `1px solid ${
                    data.active
                      ? alpha(theme.palette.success.main, 0.25)
                      : alpha(theme.palette.text.primary, 0.15)
                  }`,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </Stack>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 2 }}>
          <Stack spacing={2.25}>
            {/* LINK ROW — perfectly aligned + copy + preview */}
            <DetailsGrid>
              <GridRow label="Public link" icon={<LinkIcon size={16} />}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    title={fullUrl}
                  >
                    {fullUrl}
                  </Typography>
                  <Tooltip title={copied ? "Copied!" : "Copy link"}>
                    <IconButton size="small" onClick={copyLink}>
                      <CopyIcon size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Open preview">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={preview}
                      startIcon={<ExternalLink size={14} />}
                    >
                      Preview
                    </Button>
                  </Tooltip>
                </Stack>
              </GridRow>

              {/* Description */}
              {data.description ? (
                <GridRow label="Description">
                  <Typography variant="body2" color="text.secondary">{data.description}</Typography>
                </GridRow>
              ) : null}

              <Divider sx={{ gridColumn: "1 / -1", my: 0.5 }} />

              {/* Key attributes */}
              <GridRow label="Duration" icon={<Clock size={16} />}>
                <Typography variant="body2">{data.durationMinutes} minutes</Typography>
              </GridRow>

              <GridRow label="Buffers">
                <Typography variant="body2">
                  {data.bufferBeforeMinutes} / {data.bufferAfterMinutes} minutes
                </Typography>
              </GridRow>

              <GridRow label="Booking window">
                <Typography variant="body2">{data.maxBookingDaysInFuture} days in advance</Typography>
              </GridRow>

              <GridRow label="Minimum notice" icon={<Shield size={16} />}>
                <Typography variant="body2">{data.minSchedulingNoticeMinutes} minutes</Typography>
              </GridRow>

              <GridRow label="Locations">
                <Typography variant="body2">{(data.locations || []).join(", ") || "—"}</Typography>
              </GridRow>

              <GridRow label="Owner">
                <Typography variant="body2">
                  {data.ownerType && data.ownerId ? `${data.ownerType}:${data.ownerId}` : "—"}
                </Typography>
              </GridRow>

              <GridRow label="Color" icon={<Palette size={16} />}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 14, height: 14, bgcolor: data.color, borderRadius: 0.5 }} />
                  <Typography variant="body2">{data.color}</Typography>
                </Stack>
              </GridRow>

              <GridRow label="Timezone">
                <Typography variant="body2">{data.timezone || "—"}</Typography>
              </GridRow>

              <GridRow label="Created">
                <Typography variant="body2">{formatLocal(data.createdAt)}</Typography>
              </GridRow>

              <GridRow label="Updated">
                <Typography variant="body2">{formatLocal(data.updatedAt || data.createdAt)}</Typography>
              </GridRow>
            </DetailsGrid>
          </Stack>
        </DialogContent>

        {/* Footer: only Edit & Delete */}
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button startIcon={<Trash2 size={16} />} color="error" onClick={askDelete}>
            Delete
          </Button>
          <Button startIcon={<Pencil size={16} />} variant="contained" onClick={onEdit}>
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear, friendly delete confirmation */}
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={doDelete}
        title="Delete this event type?"
        itemName={data.name}
        message={
          <Typography variant="body2">
            This will permanently remove <strong>{data.name}</strong> and its public link{" "}
            <Typography component="span" sx={{ fontFamily: "monospace" }}>
              /book/{data.slug}
            </Typography>
            . You can’t undo this action.
          </Typography>
        }
        confirmText="Delete"
        confirmColor="error"
      />
    </>
  );
}

/** ---------- Layout helpers: perfect two-column alignment ---------- */
function DetailsGrid({ children }) {
  // 180px label column, flexible value column; consistent across all rows
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        alignItems: "start",
        rowGap: 1.25,
        columnGap: 2,
      }}
    >
      {children}
    </Box>
  );
}

function GridRow({ icon, label, children }) {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "text.secondary" }}>
        {icon ? <Box sx={{ display: "inline-flex" }}>{icon}</Box> : null}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
      </Box>
      <Box sx={{ minWidth: 0 }}>{children}</Box>
    </>
  );
}
