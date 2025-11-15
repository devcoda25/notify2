// src/TeamInbox/components/filters/FiltersDialog.jsx
// Modal wrapper that renders filters vertically. Stateless; parent owns selections.

import React from "react";
import {
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { X } from "lucide-react";

function Section({ title, children }) {
  return (
    <Stack spacing={1.25}>
      <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 0.6 }}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onClearAll?: () => void,
 *   onApply: (next: {
 *     statusIds: string[],
 *     channelId: string|null,
 *     tagIds: string[],
 *   }) => void,
 *   // data
 *   statuses?: Array<{ id: string, label: string, color?: any }>,
 *   channels?: Array<{ id: string, label: string, icon?: any }>,
 *   tags?: Array<{ id: string, label: string }>,
 *   // selections
 *   selectedStatusIds?: string[],
 *   selectedChannelId?: string|null,
 *   selectedTagIds?: string[],
 * }} props
 */
export default function FiltersDialog(props) {
  const {
    open, onClose, onClearAll, onApply,
    statuses = [], channels = [], tags = [],
    selectedStatusIds = [],
    selectedChannelId = null,
    selectedTagIds = [],
  } = props;

  const [local, setLocal] = React.useState({
    statusIds: selectedStatusIds,
    channelId: selectedChannelId,
    tagIds: selectedTagIds,
  });

  React.useEffect(() => {
    if (open) {
      setLocal({
        statusIds: selectedStatusIds,
        channelId: selectedChannelId,
        tagIds: selectedTagIds,
      });
    }
  }, [open, selectedStatusIds, selectedChannelId, selectedTagIds]);

  const toggle = (arr, id) => {
    const s = new Set(arr);
    s.has(id) ? s.delete(id) : s.add(id);
    return Array.from(s);
  };

  const hasAny =
    (local.statusIds?.length || 0) +
    (local.tagIds?.length || 0) +
    (local.channelId ? 1 : 0) > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1 }}>
        Filters
        <Tooltip title="Close">
          <IconButton onClick={onClose} size="small" aria-label="Close filters">
            <X size={18} />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Status (multi) */}
          {statuses.length > 0 && (
            <>
              <Section title="Status">
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {statuses.map((s) => {
                    const active = local.statusIds.includes(s.id);
                    return (
                      <Chip
                        key={s.id}
                        size="small"
                        color={active ? (s.color || "primary") : "default"}
                        variant={active ? "filled" : "outlined"}
                        label={s.label}
                        onClick={() =>
                          setLocal((v) => ({ ...v, statusIds: toggle(v.statusIds, s.id) }))
                        }
                        sx={{ borderRadius: 2 }}
                        aria-pressed={active}
                      />
                    );
                  })}
                </Stack>
              </Section>
              <Divider />
            </>
          )}

          {/* Channel (single) */}
          {channels.length > 0 && (
            <>
              <Section title="Channel">
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {channels.map((c) => {
                    const active = local.channelId === c.id;
                    return (
                      <Chip
                        key={c.id}
                        size="small"
                        color={active ? "primary" : "default"}
                        variant={active ? "filled" : "outlined"}
                        label={c.label}
                        onClick={() =>
                          setLocal((v) => ({ ...v, channelId: active ? null : c.id }))
                        }
                        sx={{ borderRadius: 2 }}
                        aria-pressed={active}
                      />
                    );
                  })}
                </Stack>
              </Section>
              <Divider />
            </>
          )}

          {/* Tags (multi) */}
          {tags.length > 0 && (
            <Section title="Tags">
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {tags.map((t) => {
                  const active = local.tagIds.includes(t.id);
                  return (
                    <Chip
                      key={t.id}
                      size="small"
                      color={active ? "secondary" : "default"}
                      variant={active ? "filled" : "outlined"}
                      label={t.label}
                      onClick={() =>
                        setLocal((v) => ({ ...v, tagIds: toggle(v.tagIds, t.id) }))
                      }
                      sx={{ borderRadius: 2 }}
                      aria-pressed={active}
                    />
                  );
                })}
              </Stack>
            </Section>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.25 }}>
        <Button
          onClick={() => {
            setLocal({ statusIds: [], channelId: null, tagIds: [] });
            onClearAll?.();
          }}
          disabled={!hasAny}
          color="inherit"
        >
          Clear all
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => onApply(local)}
          variant="contained"
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
