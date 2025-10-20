// /src/Component/contacts/layouts/ContactsTabs.jsx
import React from "react";
import {
  Tabs, Tab, Box, Typography, Stack, Chip, Tooltip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Checkbox, FormControlLabel, TextField, Divider
} from "@mui/material";
import {
  Database, FileSpreadsheet, X as CloseIcon, ListChecks, FolderCog
} from "lucide-react";
import UploadsManagerDialog from "../Modals/UploadsManagerDialog";

/**
 * Props:
 * - value: string
 * - onChange: (id: string) => void
 * - tabs: Array<{ id: string; label: string; icon?: 'db'|'xls'; count?: number; closable?: boolean; }>
 * - onClose?: (id: string) => void
 * - onVisibleChange?: (ids: string[]) => void
 * - onRename?: (id: string, newName: string) => void
 * - campaignOptions?: string[]                  // for Uploads dialog
 * - onOpenImport?: () => void                   // for Uploads dialog
 *
 * Behavior:
 * - Active tab & chip use THEME PRIMARY purple (same family as NextCallCard).
 * - "Tabs" button opens selector (max 5 visible) + rename.
 * - **Uploads** button moved here (to the RIGHT of "Tabs") and opens UploadsManagerDialog.
 */
const MAX_VISIBLE = 5;

export default function ContactsTabs({
  value,
  onChange,
  tabs = [],
  onClose,
  onVisibleChange,
  onRename,
  campaignOptions = [],
  onOpenImport,
}) {
  const [uploadsOpen, setUploadsOpen] = React.useState(false);

  const allIds = React.useMemo(() => tabs.map(t => t.id), [tabs]);
  const [visibleIds, setVisibleIds] = React.useState(() => allIds.slice(0, MAX_VISIBLE));
  const [renameMap, setRenameMap] = React.useState({}); // id -> new label

  React.useEffect(() => {
    let next = visibleIds.filter(id => allIds.includes(id));
    if (next.length < Math.min(MAX_VISIBLE, allIds.length)) {
      for (const id of allIds) {
        if (next.length >= MAX_VISIBLE) break;
        if (!next.includes(id)) next.push(id);
      }
    }
    if (next.length > MAX_VISIBLE) next = next.slice(0, MAX_VISIBLE);
    setVisibleIds(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

  React.useEffect(() => {
    if (!visibleIds.includes(value) && visibleIds.length > 0) onChange?.(visibleIds[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleIds]);

  // Config dialog state
  const [cfgOpen, setCfgOpen] = React.useState(false);
  const openConfig = () => setCfgOpen(true);
  const closeConfig = () => setCfgOpen(false);

  const [tmpVisible, setTmpVisible] = React.useState(visibleIds);
  const [tmpNames, setTmpNames] = React.useState(() => {
    const initial = {};
    tabs.forEach(t => { if (renameMap[t.id]) initial[t.id] = renameMap[t.id]; });
    return initial;
  });

  React.useEffect(() => {
    if (cfgOpen) {
      setTmpVisible(visibleIds);
      setTmpNames(prev => {
        const fresh = { ...prev };
        tabs.forEach(t => {
          if (fresh[t.id] == null && renameMap[t.id] != null) fresh[t.id] = renameMap[t.id];
        });
        return fresh;
      });
    }
  }, [cfgOpen, tabs, visibleIds, renameMap]);

  const selectedCount = tmpVisible.length;
  const toggleTmpVisible = (id) => {
    setTmpVisible(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_VISIBLE) return prev;
      return [...prev, id];
    });
  };
  const handleTmpName = (id, val) => setTmpNames(m => ({ ...m, [id]: val }));

  const handleCfgSave = () => {
    setVisibleIds(tmpVisible);
    onVisibleChange?.(tmpVisible);

    const newMap = {};
    tabs.forEach(t => {
      const v = (tmpNames[t.id] ?? "").trim();
      if (v && v !== t.label) newMap[t.id] = v;
    });
    setRenameMap(newMap);
    if (onRename) Object.entries(newMap).forEach(([id, newName]) => onRename(id, newName));
    closeConfig();
  };

  const stopTabSelect = (e) => { e.stopPropagation(); e.preventDefault(); };

  const displayTabs = tabs.filter(t => visibleIds.includes(t.id));
  const getLabelFor = (t) => renameMap[t.id] ?? t.label;

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      {/* Header: tabs (flex-grow) + "Tabs" + "Uploads" */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tabs
          value={value}
          onChange={(_, v) => onChange?.(v)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Contacts data sources"
          sx={{
            flex: 1,
            px: { xs: 0.5, sm: 1 },
            "& .MuiTab-root": {
              textTransform: "none",
              minHeight: 44,
              alignItems: "center",
            },
          }}
        >
          {displayTabs.map((t) => {
            const Icon = t.icon === "db" ? Database : FileSpreadsheet;
            const isActive = value === t.id;
            const hasCount = typeof t.count === "number";
            const chipLabel = hasCount ? `${t.count.toLocaleString()} rows` : "";

            const label = (
              <Stack direction="row" alignItems="center" gap={1} sx={{ minHeight: 36, maxWidth: 280 }}>
                <Icon size={16} />
                <Tooltip title={getLabelFor(t)}>
                  <Typography
                    variant="button"
                    noWrap
                    sx={{
                      maxWidth: 180,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "primary.main" : "text.primary", // PRIMARY purple active
                      lineHeight: 1.2,
                    }}
                  >
                    {getLabelFor(t)}
                  </Typography>
                </Tooltip>

                {hasCount && (
                  <Chip
                    size="small"
                    variant={isActive ? "filled" : "outlined"}
                    color={isActive ? "primary" : "default"} // PRIMARY purple for active chip
                    label={chipLabel}
                    onDelete={t.closable ? () => onClose?.(t.id) : undefined}
                    deleteIcon={t.closable ? <CloseIcon size={14} /> : undefined}
                    onMouseDown={stopTabSelect}
                    onClick={stopTabSelect}
                    aria-label={t.closable ? `Close ${getLabelFor(t)}. ${chipLabel}` : `${chipLabel}`}
                    sx={{ borderRadius: "999px", fontWeight: 600, py: 0, "& .MuiChip-label": { px: 1 } }}
                  />
                )}
              </Stack>
            );

            return (
              <Tab
                key={t.id}
                value={t.id}
                label={label}
                disableRipple
                sx={{
                  py: 0.5,
                  px: { xs: 1, sm: 1.5 },
                  minHeight: 44,
                  ...(isActive && { "&.Mui-selected": { color: "primary.main" } }),
                }}
              />
            );
          })}
        </Tabs>

        {/* Config button (PRIMARY purple) */}
        <Tooltip title="Select which tabs to show (max 5) & rename">
          <Button
            onClick={openConfig}
            variant="outlined"
            size="small"
            color="primary"
            startIcon={<ListChecks size={16} />}
            sx={{ mr: 0.5 }}
          >
            Tabs
          </Button>
        </Tooltip>

        {/* Uploads button moved here, RIGHT of "Tabs" (PRIMARY purple) */}
        <Tooltip title="See previously uploaded files & import">
          <Button
            variant="outlined"
            size="small"
            color="primary"
            startIcon={<FolderCog size={16} />}
            onClick={() => setUploadsOpen(true)}
          >
            Uploads
          </Button>
        </Tooltip>
      </Box>

      {/* Optional subtitle/notes */}
      <Box className="px-3 py-2">
        <Typography variant="body2" color="text.secondary">
          Contacts (DB) contain the richest profile; uploaded sheets are lightweight but editable.
        </Typography>
      </Box>

      {/* Configuration dialog (PRIMARY purple accents) */}
      <Dialog open={cfgOpen} onClose={closeConfig} fullWidth maxWidth="sm">
        <DialogTitle>Display & Rename Tabs</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Select up to {MAX_VISIBLE} tabs to display. Rename labels as needed.
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <Stack spacing={1.5}>
            {tabs.map((t) => {
              const checked = tmpVisible.includes(t.id);
              const disabled = !checked && selectedCount >= MAX_VISIBLE;
              return (
                <Box key={t.id} sx={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={() => toggleTmpVisible(t.id)}
                        disabled={disabled}
                        size="small"
                        color="primary"   // PRIMARY purple
                      />
                    }
                    label={
                      <Stack direction="row" alignItems="center" gap={1}>
                        {t.icon === "db" ? <Database size={16} /> : <FileSpreadsheet size={16} />}
                        <Typography variant="body2">{t.label}</Typography>
                        {typeof t.count === "number" && (
                          <Chip size="small" variant="outlined" label={`${t.count.toLocaleString()} rows`} />
                        )}
                      </Stack>
                    }
                  />
                  <TextField
                    size="small"
                    fullWidth
                    label="Rename"
                    placeholder={t.label}
                    value={tmpNames[t.id] ?? ""}
                    onChange={(e) => handleTmpName(t.id, e.target.value)}
                    color="primary"     // PRIMARY purple focus
                  />
                </Box>
              );
            })}
          </Stack>
          <Typography variant="caption" color={selectedCount > MAX_VISIBLE ? "error" : "text.secondary"} sx={{ mt: 1, display: "block" }}>
            {selectedCount} selected (max {MAX_VISIBLE})
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfig}>Cancel</Button>
          <Button
            onClick={handleCfgSave}
            variant="contained"
            color="primary"
            disabled={selectedCount === 0 || selectedCount > MAX_VISIBLE}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Uploads Manager (moved from Toolbar) */}
      <UploadsManagerDialog
        open={uploadsOpen}
        onClose={() => setUploadsOpen(false)}
        campaignOptions={campaignOptions}
        onOpenImport={onOpenImport}
      />
    </Box>
  );
}
