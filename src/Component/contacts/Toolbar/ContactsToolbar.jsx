// /src/Component/contacts/layouts/ContactsToolbar.jsx
import React, { useMemo } from "react";
import {
  Paper, Stack, TextField, InputAdornment, Button, Tooltip, Divider, MenuItem, Box, Chip
} from "@mui/material";
import { Search, Plus, Filter, ArrowUp01, ArrowDown10 } from "lucide-react";

/**
 * Props
 * - query: { search, sortBy, sortDir, page, pageSize, filters }
 * - onQueryChange: (patch) => void
 * - onOpenAdd, onOpenFilter: () => void
 * - context?: 'db' | 'upload'
 * - totalCount?: number
 *
 * Changes:
 * - No hard-coded colors; only theme (primary).
 * - "Filters" + "Sort" moved to the LEFT of the Search field.
 * - "Filters" button height aligned with fields (better sizing).
 * - Removed "Export" button.
 * - "Add" button moved to the extreme RIGHT with prominent sizing.
 */
export default function ContactsToolbar({
  query,
  onQueryChange,
  onOpenAdd,
  onOpenFilter,
  context = "db",
  totalCount,
}) {
  const CONTROL_H = 40; // ensures consistent control height across TextFields & Buttons

  const filterCount = useMemo(() => {
    const f = query?.filters || {};
    return Array.isArray(f) ? f.length : Object.keys(f).length;
  }, [query?.filters]);

  const SORT_OPTIONS = [
    { value: "updated_desc", label: "Updated (newest)", sortBy: "lastUpdated", dir: "desc", Icon: ArrowDown10 },
    { value: "updated_asc",  label: "Updated (oldest)", sortBy: "lastUpdated", dir: "asc",  Icon: ArrowUp01   },
    { value: "name_asc",     label: "Name (A–Z)",       sortBy: "name",        dir: "asc",  Icon: ArrowUp01   },
    { value: "name_desc",    label: "Name (Z–A)",       sortBy: "name",        dir: "desc", Icon: ArrowDown10 },
    { value: "created_desc", label: "Created (newest)", sortBy: "createdAt",   dir: "desc", Icon: ArrowDown10 },
    { value: "created_asc",  label: "Created (oldest)", sortBy: "createdAt",   dir: "asc",  Icon: ArrowUp01   },
  ];

  const currentSortValue = useMemo(() => {
    const sb = query?.sortBy || "lastUpdated";
    const sd = query?.sortDir || "desc";
    const hit = SORT_OPTIONS.find(o => o.sortBy === sb && o.dir === sd);
    return hit ? hit.value : "updated_desc";
  }, [query?.sortBy, query?.sortDir]);

  const onChangeSort = (value) => {
    const hit = SORT_OPTIONS.find(o => o.value === value);
    if (!hit) return;
    onQueryChange?.({ sortBy: hit.sortBy, sortDir: hit.dir, page: 0 });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {/* LEFT GROUP: Sort + Filters */}
      <TextField
        select
        size="small"
        label="Sort"
        value={currentSortValue}
        onChange={(e) => onChangeSort(e.target.value)}
        sx={{
          minWidth: { xs: 160, sm: 200 },
          "& .MuiInputBase-root": { height: CONTROL_H },
        }}
      >
        {SORT_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            <Stack direction="row" gap={1} alignItems="center">
              <opt.Icon size={14} />
              <span>{opt.label}</span>
            </Stack>
          </MenuItem>
        ))}
      </TextField>

      <Tooltip title="Filter">
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={onOpenFilter}
          startIcon={<Filter size={16} />}
          sx={{
            ml: 0.5,
            height: CONTROL_H,
            textTransform: "none",
            px: 1.5,
          }}
        >
          Filters
          {filterCount ? (
            <Chip
              size="small"
              color="primary"
              label={filterCount}
              sx={{ ml: 1 }}
            />
          ) : null}
        </Button>
      </Tooltip>

      <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />

      {/* SEARCH */}
      <TextField
        size="small"
        label="Search Contact"
        placeholder="Search name, phone, email, attributes…"
        value={query?.search || ""}
        onChange={(e) => onQueryChange?.({ search: e.target.value, page: 0 })}
        sx={{
          minWidth: { xs: 220, sm: 320 },
          flexShrink: 0,
          "& .MuiInputBase-root": { height: CONTROL_H },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={16} />
            </InputAdornment>
          ),
        }}
      />
      {/* FILL */}
      <Box sx={{ flex: 1 }} />

      {/* RIGHT: Add (prominent) */}
      <Tooltip title="Add contact">
        <Button
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<Plus size={18} />}
          onClick={onOpenAdd}
          sx={{
            height: CONTROL_H,
            px: 2,
            textTransform: "none",
            borderRadius: 1.5,
          }}
        >
          Add
        </Button>
      </Tooltip>
    </Paper>
  );
}
