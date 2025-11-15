import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Tooltip,
  TextField,
  Checkbox,
  ListItemIcon,
  ListItemText,
  Select,
  FormControl,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Undo,
  Redo,
  TestTube,
  Save,
  ChevronDown,
  File as FileIcon,
  Folder,
  Trash2,
  Hash,
  Check,
} from "lucide-react";
import { CHANNELS } from "./channel-meta.js";

function ChannelBadges({ selectedMeta, overflow }) {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ py: 0.25 }}>
      {selectedMeta.map((c) => (
        <Chip
          key={c.id}
          size="small"
          label={c.short || c.label}
          icon={<Hash size={14} />}
          sx={{
            px: 0.5,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.dark,
            "& .MuiChip-icon": { color: theme.palette.primary.main },
          }}
        />
      ))}
      {overflow > 0 && <Chip size="small" label={`+${overflow}`} />}
    </Stack>
  );
}

export default function HeaderBar({
  title,
  initialTitle = "Untitled Flow",
  channels = [],
  availableChannels,
  onChannelsChange,
  waContext,
  onWaContextChange,
  onSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onTest,
  onSaveClick,
  onNewFlow,
  onOpenFlows,
  onDeleteFlow,
  className,
}) {
  const theme = useTheme();
  const [currentTitle, setCurrentTitle] = useState(title ?? initialTitle);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (title) setCurrentTitle(title);
  }, [title]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const allChannels = useMemo(
    () =>
      availableChannels && availableChannels.length
        ? CHANNELS.filter((c) => availableChannels.includes(c.id))
        : CHANNELS,
    [availableChannels]
  );

  const selectedMeta = allChannels.filter((c) => channels.includes(c.id));
  const MAX_BADGES = 4;
  const overflow = Math.max(0, selectedMeta.length - MAX_BADGES);
  const showBadges = selectedMeta.slice(0, MAX_BADGES);

  const commitTitle = (val) => {
    const trimmed = val.trim().length ? val.trim() : "Untitled Flow";
    setCurrentTitle(trimmed);
    onSave?.(trimmed);
    setEditing(false);
  };

  const onTitleKeyDown = (e) => {
    if (e.key === "Enter") commitTitle(e.currentTarget.value);
    else if (e.key === "Escape") {
      setCurrentTitle(title ?? initialTitle);
      setEditing(false);
    }
  };

  const toggleChannel = (chId) => {
    const set = new Set(channels);
    set.has(chId) ? set.delete(chId) : set.add(chId);
    onChannelsChange?.(Array.from(set));
  };

  // menus
  const [flowsAnchorEl, setFlowsAnchorEl] = useState(null);
  const [channelsAnchorEl, setChannelsAnchorEl] = useState(null);
  const openFlows = Boolean(flowsAnchorEl);
  const openChannels = Boolean(channelsAnchorEl);

  return (
    <Paper
      elevation={0}
      className={className}
      sx={{
        px: { xs: 1, sm: 1.5, md: 2 },
        py: 1,
        mb: 1.5,
        borderRadius: 0,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        flexWrap="wrap" // Allow wrapping on very small screens
      >
        {/* LEFT cluster */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ flex: 1, minWidth: 0 }}
        >
          {/* Flows menu */}
          <Button
            variant="outlined"
            onClick={(e) => setFlowsAnchorEl(e.currentTarget)}
            endIcon={<ChevronDown size={16} />}
            sx={{ height: 36, flexShrink: 0 }}
          >
            Flows
          </Button>
          <Menu anchorEl={flowsAnchorEl} open={openFlows} onClose={() => setFlowsAnchorEl(null)}>
            <MenuItem
              onClick={() => {
                onNewFlow?.();
                setFlowsAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <FileIcon size={16} />
              </ListItemIcon>
              <ListItemText>New Flow</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                onOpenFlows?.();
                setFlowsAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <Folder size={16} />
              </ListItemIcon>
              <ListItemText>Open Flow…</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                onDeleteFlow?.();
                setFlowsAnchorEl(null);
              }}
              sx={{ color: "error.main" }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <Trash2 size={16} />
              </ListItemIcon>
              <ListItemText>Delete Current Flow</ListItemText>
            </MenuItem>
          </Menu>

          {/* Channels menu */}
          <Button
            variant="outlined"
            onClick={(e) => setChannelsAnchorEl(e.currentTarget)}
            aria-haspopup="listbox"
            aria-expanded={openChannels}
            endIcon={<ChevronDown size={16} />}
            sx={{ height: 36, flexShrink: 0 }}
          >
            Channels
          </Button>
          <Menu
            anchorEl={channelsAnchorEl}
            open={openChannels}
            onClose={() => setChannelsAnchorEl(null)}
            MenuListProps={{ dense: true, "aria-label": "Channels" }}
            PaperProps={{ sx: { minWidth: 280 } }}
          >
            <Box
              sx={{
                px: 1.5,
                pt: 1,
                pb: 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle2" fontWeight={700}>
                Channels
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  onClick={() => onChannelsChange?.(allChannels.map((c) => c.id))}
                >
                  Select all
                </Button>
                <Button size="small" onClick={() => onChannelsChange?.([])}>
                  Clear
                </Button>
              </Stack>
            </Box>
            <Divider />
            {allChannels.map((ch) => {
              const checked = channels.includes(ch.id);
              return (
                <MenuItem key={ch.id} onClick={() => toggleChannel(ch.id)} sx={{ gap: 1 }}>
                  <Checkbox size="small" checked={checked} tabIndex={-1} disableRipple />
                  <ListItemText
                    primary={ch.label}
                    secondary={ch.short}
                    primaryTypographyProps={{ variant: "body2" }}
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                </MenuItem>
              );
            })}
          </Menu>

          {/* WA context */}
          {channels.includes("whatsapp") && onWaContextChange && (
            <FormControl size="small" sx={{ minWidth: 160, flexShrink: 0 }}>
              <Select
                value={waContext ?? "template"}
                onChange={(e) => onWaContextChange(e.target.value)}
                displayEmpty
              >
                <MenuItem value="template">WA Context: Template</MenuItem>
                <MenuItem value="in-session">WA Context: In-session</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Title */}
          <Box sx={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'center' }}>
            {editing ? (
              <TextField
                inputRef={inputRef}
                size="small"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                onBlur={(e) => commitTitle(e.target.value)}
                onKeyDown={onTitleKeyDown}
                inputProps={{ maxLength: 50, "aria-label": "Flow title" }}
                sx={{ 
                  "& .MuiInputBase-root": { height: 36 },
                  minWidth: 200,
                  maxWidth: 400,
                }}
              />
            ) : (
              <Button
                variant="text"
                onClick={() => setEditing(true)}
                sx={{
                  justifyContent: "flex-start",
                  minWidth: 0,
                  px: 1,
                  height: 36,
                  color: "text.primary",
                  textTransform: "none",
                  "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.06) },
                }}
                title="Click to rename"
                aria-label="Flow title. Click to rename."
              >
                <Typography variant="subtitle1" fontWeight={700} noWrap title={currentTitle}>
                  {currentTitle}
                </Typography>
              </Button>
            )}

            {!!selectedMeta.length && (
              <ChannelBadges selectedMeta={showBadges} overflow={overflow} />
            )}
          </Box>
        </Stack>

        {/* RIGHT cluster */}
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
          <Tooltip title="Undo (Ctrl/Cmd+Z)">
            <span>
              <IconButton size="small" onClick={onUndo} disabled={!canUndo}>
                <Undo size={18} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Redo (Ctrl/Cmd+Shift+Z)">
            <span>
              <IconButton size="small" onClick={onRedo} disabled={!canRedo}>
                <Redo size={18} />
              </IconButton>
            </span>
          </Tooltip>

          <Button
            variant="outlined"
            size="small"
            onClick={onTest}
            startIcon={<TestTube size={16} />}
            sx={{ height: 36, flexShrink: 0 }}
          >
            Test Flow
          </Button>

          {onSaveClick && (
            <Button
              variant="contained"
              size="small"
              onClick={onSaveClick}
              startIcon={<Save size={16} />}
              sx={{ height: 36, flexShrink: 0 }}
            >
              Save
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
