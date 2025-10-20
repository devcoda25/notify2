// Path: src/Component/Meetings/views/EventTypesView.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  Divider,
  Button,
  TextField,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Select,
  Pagination,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Plus, Pencil, Link as LinkIcon, Clock, Shield } from "lucide-react";

import EventTypeForm from "../../components/EventTypeForm";
import { useEventTypesStore } from "../../../store/scheduling/useEventTypesStore";
import EventTypeDetailsDialog from "../../components/EventTypeDetailsDialog";

function formatLocal(dateLike) {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; // current location
    const d = new Date(dateLike || Date.now());
    return new Intl.DateTimeFormat(undefined, {
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

export default function EventTypesView() {
  const theme = useTheme();
  const store = useEventTypesStore();
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState({ open: false, id: null });
  const [details, setDetails] = useState({ open: false, id: null });

  // pagination (cards)
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(12); // cards per page
  const rppOptions = [8, 12, 24, 48];

  useEffect(() => { store.loaded || store.loadFixtures(); }, [store]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return store.eventTypes || [];
    return (store.eventTypes || []).filter((e) =>
      [e.name, e.slug, e.description].some((s) => String(s || "").toLowerCase().includes(q))
    );
  }, [query, store.eventTypes]);

  // pagination math
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, rpp)));
  const safePage = Math.min(page, pages - 1);
  const start = safePage * rpp;
  const pageRows = filtered.slice(start, start + rpp);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(total, start + rpp);

  useEffect(() => setPage(0), [query, rpp, total]);

  const openEdit = (id) => setDialog({ open: true, id });
  const openCreate = () => setDialog({ open: true, id: null });
  const closeDialog = () => setDialog({ open: false, id: null });

  const openDetails = (id) => setDetails({ open: true, id });
  const closeDetails = () => setDetails({ open: false, id: null });

  const stats = useMemo(() => {
    const active = filtered.filter((e) => e.active).length;
    return { total, active, inactive: total - active };
  }, [filtered, total]);

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" rowGap={1}>
        <Typography variant="h6">Event Types</Typography>
        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
          <Chip
            size="small"
            label={`Total: ${stats.total}`}
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: "primary.main" }}
          />
          <Chip size="small" color="success" label={`Active: ${stats.active}`} />
          <Chip size="small" label={`Inactive: ${stats.inactive}`} />
          <TextField
            label="Search"
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button startIcon={<Plus />} variant="contained" onClick={openCreate}>
            New
          </Button>
        </Stack>
      </Stack>
      <Divider />

      {/* Cards grid */}
      <Grid container spacing={2}>
        {(pageRows || []).map((e) => (
          <Grid key={e.id} item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={0}
              onClick={() => openDetails(e.id)}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                cursor: "pointer",
                "&:hover": { boxShadow: 1 },
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  px: 2,
                  py: 1.25,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: alpha(e.color || theme.palette.primary.main, 0.08),
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                  <Box sx={{ width: 10, height: 10, bgcolor: e.color, borderRadius: 0.5 }} />
                  <Typography variant="subtitle1" fontWeight={700} noWrap title={e.name}>
                    {e.name}
                  </Typography>
                </Stack>

                {/* Status chip is the toggle (and stops card click) */}
                <Chip
                  onClick={(ev) => { ev.stopPropagation(); store.setActive(e.id, !e.active); }}
                  clickable
                  size="small"
                  color={e.active ? "success" : "default"}
                  label={e.active ? "Active" : "Inactive"}
                />
              </Box>

              {/* Body — perfectly aligned two-column rows */}
              <Stack sx={{ p: 2, flex: 1, overflow: "hidden" }} spacing={1.25}>
                {/* Public link row */}
                <CardGrid>
                  <GridRow label="Link" icon={<LinkIcon size={14} />}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      title={`/book/${e.slug}`}
                    >
                      /book/{e.slug}
                    </Typography>
                  </GridRow>

                  {/* Description (trimmed) */}
                  {e.description ? (
                    <GridRow label="About">
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {e.description}
                      </Typography>
                    </GridRow>
                  ) : null}

                  {/* Key facts */}
                  <GridRow label="Duration" icon={<Clock size={14} />}>
                    <Typography variant="body2">{e.durationMinutes} min</Typography>
                  </GridRow>

                  <GridRow label="Buffers">
                    <Typography variant="body2">
                      {e.bufferBeforeMinutes}/{e.bufferAfterMinutes} min
                    </Typography>
                  </GridRow>

                  <GridRow label="Notice" icon={<Shield size={14} />}>
                    <Typography variant="body2">{e.minSchedulingNoticeMinutes} min</Typography>
                  </GridRow>

                  <GridRow label="Window">
                    <Typography variant="body2">{e.maxBookingDaysInFuture} days</Typography>
                  </GridRow>

                  {e.locations?.length ? (
                    <GridRow label="Locations">
                      <Typography variant="body2">{(e.locations || []).join(", ")}</Typography>
                    </GridRow>
                  ) : null}
                </CardGrid>

                <Typography variant="caption" color="text.secondary" sx={{ mt: "auto" }}>
                  Updated {formatLocal(e.updatedAt || e.createdAt)}
                </Typography>
              </Stack>

              {/* Footer actions — Edit only, delete moved to details */}
              <Box
                onClick={(ev) => ev.stopPropagation()}
                sx={{
                  px: 1.25,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: `1px solid ${theme.palette.divider}`,
                  backgroundColor: alpha(theme.palette.primary.main, 0.015),
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Pencil size={14} />}
                  onClick={() => openEdit(e.id)}
                >
                  Edit
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}

        {!total && (
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 3 }}
            >
              <Typography align="center" color="text.secondary">No event types</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Footer with pagination & page size */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: 1,
            backgroundColor: alpha(theme.palette.primary.main, 0.015),
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {total ? `Showing ${from}–${to} of ${total}` : "No results"}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                px: 1,
                py: 0.25,
                border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.4)}`,
                borderRadius: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Select
                size="small"
                value={rpp}
                onChange={(e) => setRpp(parseInt(e.target.value, 10))}
                variant="standard"
                disableUnderline
                sx={{ minWidth: 76, "& .MuiSelect-select": { px: 0.5 } }}
              >
                {rppOptions.map((n) => (
                  <MenuItem key={n} value={n}>{n} / page</MenuItem>
                ))}
              </Select>
            </Box>

            <Pagination
              color="primary"
              count={pages}
              page={Math.min(safePage + 1, pages)}
              onChange={(_, v) => setPage(v - 1)}
              size="small"
              shape="rounded"
              showFirstButton
              showLastButton
              disabled={pages <= 1}
            />
          </Stack>
        </Box>
      </Paper>

      {/* Create/Edit dialog */}
      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialog.id ? "Edit Event Type" : "New Event Type"}</DialogTitle>
        <DialogContent dividers>
          <EventTypeForm
            eventTypeId={dialog.id || undefined}
            onSaved={closeDialog}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Details dialog (delete lives here) */}
      <EventTypeDetailsDialog
        open={details.open}
        eventTypeId={details.id}
        onClose={closeDetails}
        onEdit={() => {
          const id = details.id;
          closeDetails();
          setDialog({ open: true, id });
        }}
      />
    </Stack>
  );
}

/** ---------- Card layout helpers: fixed label column for alignment ---------- */
const CARD_LABEL_COL = "110px";

function CardGrid({ children }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `${CARD_LABEL_COL} 1fr`,
        alignItems: "start",
        rowGap: 0.75,
        columnGap: 1.5,
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
