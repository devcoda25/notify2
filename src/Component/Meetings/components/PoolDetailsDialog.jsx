// Path: src/Component/Meetings/components/PoolDetailsDialog.jsx
import React, { useMemo, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Typography, Divider, Box, Chip, Paper, IconButton, Tooltip
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Pencil, Trash2, Users, Globe, Target, Scale, Hash } from "lucide-react";
import { usePoolsStore } from "../../store/scheduling/usePoolsStore";
import ConfirmDialog from "../utils/ConfirmDialog";

function tzOffsetLabel(tz) {
  try {
    const now = new Date();
    const utc = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
    const zoned = new Date(now.toLocaleString("en-US", { timeZone: tz }));
    const mins = Math.round((zoned.getTime() - utc.getTime()) / 60000);
    const sign = mins >= 0 ? "+" : "-";
    const abs = Math.abs(mins);
    const hh = String(Math.floor(abs / 60)).padStart(2, "0");
    const mm = String(abs % 60).padStart(2, "0");
    return `${tz || "—"} - ${sign}${hh}:${mm}`;
  } catch {
    return tz || "—";
  }
}

export default function PoolDetailsDialog({ open, poolId, onClose, onEdit }) {
  const theme = useTheme();
  const store = usePoolsStore();
  const [confirm, setConfirm] = useState(false);

  const data = useMemo(() => {
    if (!poolId) return null;
    return (store.pools || []).find((p) => p.id === poolId) || null;
  }, [poolId, store.pools]);

  if (!data) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Pool</DialogTitle>
        <DialogContent dividers>
          <Typography color="text.secondary">Not found.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const total = data.members?.length || 0;
  const active = (data.members || []).filter((m) => m.isActive).length;

  const handleDelete = () => {
    store.deletePool?.(data.id);
    setConfirm(false);
    onClose?.();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            pb: 1,
            background: `linear-gradient(0deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, transparent 100%)`,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
              <Users size={18} />
              <Typography variant="h6" noWrap title={data.name}>{data.name}</Typography>
            </Stack>
            <Chip
              size="small"
              color="primary"
              label={`${active} active of ${total}`}
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 2 }}>
          {/* Summary grid */}
          <DetailsGrid>
            <GridRow icon={<Hash size={14} />} label="ID">
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>{data.id}</Typography>
            </GridRow>

            <GridRow icon={<Target size={14} />} label="Strategy">
              <Typography variant="body2">
                {data.type || "—"} • {data.distribution || "—"}
              </Typography>
            </GridRow>

            <GridRow icon={<Globe size={14} />} label="Timezone">
              <Typography variant="body2">{tzOffsetLabel(data.timezone)}</Typography>
            </GridRow>

            <GridRow icon={<Scale size={14} />} label="Slug">
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                {data.slug || "—"}
              </Typography>
            </GridRow>
          </DetailsGrid>

          <Divider sx={{ my: 2 }} />

          {/* Members list */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Members</Typography>
          <Stack gap={1}>
            {(data.members || []).length === 0 && (
              <Typography variant="body2" color="text.secondary">No members.</Typography>
            )}

            {(data.members || []).map((m, idx) => (
              <Paper
                key={`${m.userId || idx}-${idx}`}
                variant="outlined"
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  borderColor: m.isActive ? "success.light" : "divider",
                  bgcolor: m.isActive ? (t) => alpha(t.palette.success.main, 0.05) : "background.paper",
                }}
              >
                <Stack direction={{ xs: "column", md: "row" }} spacing={1.25} alignItems="center">
                  <Chip
                    size="small"
                    color={m.isActive ? "success" : "default"}
                    label={m.isActive ? "Active" : "Inactive"}
                    sx={{ minWidth: 88 }}
                  />
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    <strong>User:</strong> {m.userId || "—"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Weight:</strong> {m.weight ?? 1}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button startIcon={<Trash2 size={16} />} color="error" onClick={() => setConfirm(true)}>
            Delete
          </Button>
          <Button startIcon={<Pencil size={16} />} variant="contained" onClick={onEdit}>
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={handleDelete}
        title="Delete this pool?"
        itemName={data.name}
        message={
          <Typography variant="body2">
            This will permanently remove the pool <strong>{data.name}</strong> and its configuration.
            You can’t undo this action.
          </Typography>
        }
        confirmText="Delete"
        confirmColor="error"
      />
    </>
  );
}

/** Layout helpers for perfect two-column alignment */
function DetailsGrid({ children }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "160px 1fr",
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
        <Typography variant="body2" sx={{ fontWeight: 500 }}>{label}</Typography>
      </Box>
      <Box sx={{ minWidth: 0 }}>{children}</Box>
    </>
  );
}
