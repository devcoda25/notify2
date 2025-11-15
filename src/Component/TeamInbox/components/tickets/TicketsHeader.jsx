// src/TeamInbox/components/tickets/TicketsHeader.jsx
// Use: Header for Tickets panel — emits debounced search text upward, renders quick filter chips,
// and a "New" button (treated as "New Conversation"). Purely presentational.
// Improvements:
// - Proper MUI InputAdornment usage for the search icon.
// - Optional Clear button inside the input.
// - Avoid redundant onSearchChange calls by tracking lastEmitted.
// - Keyboard: Enter triggers immediate emit (no debounce wait).

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  TextField,
  Chip,
  Tooltip,
  Button,
  InputAdornment,
} from "@mui/material";
import { Search, Plus, Filter, X as ClearIcon } from "lucide-react";
import { UX } from "../../constants/UX.js";

export default function TicketsHeader({
  searchText,
  onSearchChange,
  onNewTicket,        // ← treat as "New Conversation"
  onOpenFilters,      // ← used by the Filters button
  filterChips = [],
  rightActions = null,
  newEnabled = true,  // ← OPTIONAL: disable "New" if no Room selected
}) {
  const [local, setLocal] = useState(searchText || "");
  const lastEmitted = useRef(local);

  // keep local input in sync when parent resets
  useEffect(() => {
    setLocal(searchText || "");
    lastEmitted.current = searchText || "";
  }, [searchText]);

  const emit = (val) => {
    const trimmed = (val || "").trim();
    if (trimmed === lastEmitted.current) return;
    lastEmitted.current = trimmed;
    if (typeof onSearchChange === "function") onSearchChange(trimmed);
  };

  // Debounce fire upward
  const debounceMs = UX?.SEARCH_DEBOUNCE_MS ?? 300;
  useEffect(() => {
    const id = setTimeout(() => emit(local), debounceMs);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local, debounceMs]);

  const hasFilters = useMemo(() => Array.isArray(filterChips) && filterChips.length > 0, [filterChips]);
  const showClear = Boolean(local);

  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        borderBottom: (th) => `1px solid ${th.palette.divider}`,
        bgcolor: "background.paper",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      {/* Top row: Title, search, actions */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%" }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mr: 0.5 }}>
          Tickets
        </Typography>

        <Box sx={{ flex: 1, minWidth: 120 }}>
          <TextField
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                emit(local); // immediate emit on Enter
              }
            }}
            size="small"
            fullWidth
            placeholder="Search tickets…"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 0.5 }}>
                  <Search size={16} />
                </InputAdornment>
              ),
              endAdornment: showClear ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Clear search"
                    size="small"
                    onClick={() => setLocal("")}
                    edge="end"
                  >
                    <ClearIcon size={16} />
                  </IconButton>
                </InputAdornment>
              ) : null,
              sx: { borderRadius: 2 },
              inputProps: { "aria-label": "Search tickets" },
            }}
          />
        </Box>

        <Tooltip title="Filters" arrow>
          <span>
            <IconButton color="primary" onClick={onOpenFilters} aria-label="Open filters">
              <Filter size={18} />
            </IconButton>
          </span>
        </Tooltip>

        {rightActions}

        {onNewTicket && (
          <Button
            onClick={onNewTicket}
            disabled={!newEnabled}
            variant="contained"
            startIcon={<Plus size={18} />}
            sx={{ borderRadius: 2 }}
          >
            New
          </Button>
        )}
      </Stack>

      {/* Filters row (summary chips, optional) */}
      {hasFilters && (
        <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
          {filterChips.map((c) => (
            <Chip
              key={c.key}
              label={c.label}
              color={c.color || "default"}
              onDelete={c.onDelete}
              variant={c.color ? "filled" : "outlined"}
              sx={{ height: 26, borderRadius: 999 }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
