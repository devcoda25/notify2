// /src/Component/contacts/Toolbar/SavedViewsMenu.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider
} from "@mui/material";
import { Bookmark, BookmarkPlus, Save, Trash2, Edit3 } from "lucide-react";

/**
 * Saves & restores query state (search/sort/filters/pageSize ...) to localStorage.
 *
 * Props
 * - storageKey: string  (e.g., "contacts:views:db" or "contacts:views:upload")
 * - query: object       (current query state)
 * - onApply: (query) => void
 */
export default function SavedViewsMenu({ storageKey = "contacts:views", query, onApply }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [views, setViews] = useState(() => load(storageKey));

  useEffect(() => {
    // keep in sync if another tab updates
    const onStorage = (e) => {
      if (e.key === storageKey) setViews(load(storageKey));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const saveCurrent = () => {
    const name = window.prompt("Save current view as…", "My view");
    if (!name) return;
    const id = `v_${Date.now().toString(36)}`;
    const next = [...views, { id, name, query }];
    persist(storageKey, next);
    setViews(next);
  };

  const applyView = (v) => {
    onApply?.(v.query);
    handleClose();
  };

  const renameView = (id) => {
    const view = views.find((v) => v.id === id);
    if (!view) return;
    const name = window.prompt("Rename view", view.name);
    if (!name) return;
    const next = views.map((v) => (v.id === id ? { ...v, name } : v));
    persist(storageKey, next);
    setViews(next);
  };

  const deleteView = (id) => {
    const next = views.filter((v) => v.id !== id);
    persist(storageKey, next);
    setViews(next);
  };

  const hasViews = views.length > 0;

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        startIcon={<Bookmark size={16} />}
        onClick={handleOpen}
      >
        Views
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={saveCurrent}>
          <ListItemIcon><BookmarkPlus size={16} /></ListItemIcon>
          <ListItemText primary="Save current view…" />
        </MenuItem>

        <Divider />

        {hasViews ? (
          views.map((v) => (
            <MenuItem key={v.id} onClick={() => applyView(v)}>
              <ListItemIcon><Save size={16} /></ListItemIcon>
              <ListItemText primary={v.name} secondary={summary(v.query)} />
              <Button
                size="small"
                onClick={(e) => { e.stopPropagation(); renameView(v.id); }}
                startIcon={<Edit3 size={14} />}
                sx={{ mr: 1 }}
              >
                Rename
              </Button>
              <Button
                size="small"
                color="error"
                onClick={(e) => { e.stopPropagation(); deleteView(v.id); }}
                startIcon={<Trash2 size={14} />}
              >
                Delete
              </Button>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <ListItemText primary="No saved views yet" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

/* ----------------------------- helpers ----------------------------- */
function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function persist(key, arr) {
  try {
    localStorage.setItem(key, JSON.stringify(arr || []));
  } catch {/* ignore */}
}
function summary(q = {}) {
  const parts = [];
  if (q.search) parts.push(`q:“${String(q.search).slice(0, 16)}”`);
  if (q.sortBy) parts.push(`sort:${q.sortBy}/${q.sortDir || "desc"}`);
  const f = q.filters || {};
  const fLen = Array.isArray(f) ? f.length : Object.keys(f).length;
  if (fLen) parts.push(`filters:${fLen}`);
  if (q.pageSize) parts.push(`pageSize:${q.pageSize}`);
  return parts.join(" • ");
}
