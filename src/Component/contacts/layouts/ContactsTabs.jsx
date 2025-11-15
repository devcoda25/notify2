import React, { useState } from "react";
import {
  Tabs, Tab, Box, Typography, Stack, Chip, Tooltip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, TextField, Divider, Checkbox
} from "@mui/material";
import {
  Database, FileSpreadsheet, X as CloseIcon, Edit, Trash2, PlusCircle, FolderCog
} from "lucide-react";
import UploadsManagerDialog from "../Modals/UploadsManagerDialog";

export default function ContactsTabs({
  value,
  onChange,
  tabs = [],
  onClose,
  onRename,
  onToggleVisibility,
  campaignOptions = [],
  onOpenImport,
  onOpenNewGroup,
}) {
  const [uploadsOpen, setUploadsOpen] = useState(false);
  const [cfgOpen, setCfgOpen] = useState(false);

  // State for inline editing
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const visibleTabs = React.useMemo(() => tabs.filter(t => t.visible), [tabs]);

  const openConfig = () => setCfgOpen(true);
  const closeConfig = () => {
    setCfgOpen(false);
    setEditingId(null); // Reset editing state on close
  };

  const handleStartRename = (tab) => {
    setEditingId(tab.id);
    setEditingName(tab.label);
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleSaveRename = () => {
    if (editingId && editingName.trim()) {
      onRename?.(editingId, editingName.trim());
    }
    handleCancelRename();
  };

  const stopTabSelect = (e) => { e.stopPropagation(); e.preventDefault(); };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
            "& .MuiTab-root": { textTransform: "none", minHeight: 44, alignItems: "center" },
          }}
        >
          {visibleTabs.map((t) => {
            const Icon = t.icon === "db" ? Database : FileSpreadsheet;
            const isActive = value === t.id;
            const hasCount = typeof t.count === "number";
            const chipLabel = hasCount ? `${t.count.toLocaleString()} rows` : "";

            const label = (
              <Stack direction="row" alignItems="center" gap={1} sx={{ minHeight: 36, maxWidth: 280 }}>
                <Icon size={16} />
                <Tooltip title={t.label}>
                  <Typography
                    variant="button"
                    noWrap
                    sx={{
                      maxWidth: 180,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "primary.main" : "text.primary",
                      lineHeight: 1.2,
                    }}
                  >
                    {t.label}
                  </Typography>
                </Tooltip>

                {hasCount && (
                  <Chip
                    size="small"
                    variant={isActive ? "filled" : "outlined"}
                    color={isActive ? "primary" : "default"}
                    label={chipLabel}
                    onDelete={t.closable ? () => onToggleVisibility?.(t.id) : undefined}
                    deleteIcon={t.closable ? <CloseIcon size={14} /> : undefined}
                    onMouseDown={stopTabSelect}
                    onClick={stopTabSelect}
                    aria-label={t.closable ? `Hide ${t.label}. ${chipLabel}` : `${chipLabel}`}
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

        <Tooltip title="Manage, rename, and create groups">
          <Button onClick={openConfig} variant="outlined" size="small" color="primary" startIcon={<Edit size={16} />} sx={{ mr: 0.5 }}>
            Groups
          </Button>
        </Tooltip>

        <Tooltip title="See previously uploaded files & import">
          <Button variant="outlined" size="small" color="primary" startIcon={<FolderCog size={16} />} onClick={() => setUploadsOpen(true)}>
            Uploads
          </Button>
        </Tooltip>
      </Box>

      <Dialog open={cfgOpen} onClose={closeConfig} fullWidth maxWidth="sm">
        <DialogTitle>Manage Groups</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<PlusCircle size={16} />}
              onClick={() => {
                onOpenNewGroup?.();
                closeConfig();
              }}
            >
              New Group
            </Button>
            <Divider />
            {tabs.map((t) => (
              <Box key={t.id} sx={{ display: "flex", alignItems: "center", gap: 1, "&:hover": { bgcolor: "action.hover" }, p: 0.5, borderRadius: 1 }}>
                <Checkbox
                  checked={t.id === 'db' ? true : t.visible}
                  disabled={t.id === 'db'}
                  onChange={() => onToggleVisibility?.(t.id)}
                  size="small"
                />

                {editingId === t.id ? (
                  <TextField
                    sx={{ flex: 1, mr: 1 }}
                    size="small"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveRename()}
                    autoFocus
                  />
                ) : (
                  <>
                    <Typography sx={{ flex: 1, fontWeight: t.id === 'db' ? 600 : 400 }}>{t.label}</Typography>
                    <Chip size="small" label={`${t.count || 0} contacts`} />
                  </>
                )}

                <Stack direction="row" spacing={0.5} sx={{ minWidth: 90, justifyContent: "flex-end" }}>
                  {editingId === t.id ? (
                    <>
                      <Button size="small" onClick={handleSaveRename}>Save</Button>
                      <Button size="small" color="inherit" onClick={handleCancelRename}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      {t.id !== 'db' && (
                        <>
                          <Tooltip title="Rename Group">
                            <IconButton size="small" onClick={() => handleStartRename(t)}>
                              <Edit size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Group">
                            <IconButton size="small" onClick={() => onClose?.(t.id)}>
                              <Trash2 size={16} />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </>
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfig}>Close</Button>
        </DialogActions>
      </Dialog>

      <UploadsManagerDialog
        open={uploadsOpen}
        onClose={() => setUploadsOpen(false)}
        campaignOptions={campaignOptions}
        onOpenImport={onOpenImport}
      />
    </Box>
  );
}
