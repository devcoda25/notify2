// Path: src/Component/templates/utils/ChannelVariantPanel.jsx
import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
// Optionally import locale labels if you want to display them nicely:
import { LOCALES } from "./LocaleTabs";

/**
 * New shape for variants (example)
 * variants: Array<{
 *   id: string;
 *   locale: string;                       // e.g. "en", "fr"
 *   steps?: { 3?: boolean; 4?: boolean; 5?: boolean }; // true = completed
 *   // or provide `remainingSteps?: number[]` directly
 * }>
 *
 * Props:
 * - variants
 * - onAdd?: () => void
 * - onView?: (id) => void
 * - onEdit?: (id) => void
 * - onDelete?: (id) => void
 * - disableDeleteIfSingle?: boolean   // optional UX guard
 */
function getLocaleLabel(code) {
  return LOCALES.find((l) => l.code === code)?.label || code || "—";
}

function remainingFromSteps(steps) {
  const keys = [3, 4, 5];
  if (!steps) return keys; // nothing recorded yet
  return keys.filter((k) => !Boolean(steps[k]));
}

export default function ChannelVariantPanel({
  variants = [],
  onAdd,
  onView,
  onEdit,
  onDelete,
  disableDeleteIfSingle = false,
}) {
  const safeList = Array.isArray(variants) ? variants : [];
  const canDelete = (id) =>
    !(disableDeleteIfSingle && safeList.length <= 1);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        p: 1.5,
        boxShadow: "none",
        "&:focus-within": { borderColor: "primary.main" },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle2">Language Variants</Typography>
        <Box flexGrow={1} />
        <Button
          size="small"
          startIcon={<Plus size={14} />}
          onClick={() => onAdd?.()}
        >
          Add Variant
        </Button>
      </Stack>
      <Divider sx={{ mb: 1 }} />

      <Stack spacing={1}>
        {safeList.length === 0 && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 1.5,
              boxShadow: "none",
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            No variants yet. Click <b>Add Variant</b> to select languages for this template.
          </Paper>
        )}

        {safeList.map((v) => {
          const remaining =
            "remainingSteps" in v && Array.isArray(v.remainingSteps)
              ? v.remainingSteps
              : remainingFromSteps(v.steps);

          const done = remaining.length === 0;

          return (
            <Paper
              key={v.id}
              variant="outlined"
              sx={{
                p: 1.25,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
                boxShadow: "none",
              }}
            >
              {/* Left: locale label */}
              <Box sx={{ minWidth: 220 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {getLocaleLabel(v.locale)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {v.locale}
                </Typography>
              </Box>

              {/* Middle: status */}
              <Box sx={{ flexGrow: 1 }}>
                {done ? (
                  <Chip size="small" color="success" label="Completed" />
                ) : (
                  <Chip
                    size="small"
                    color="warning"
                    variant="outlined"
                    label={`Steps remaining: ${remaining.join(", ")}`}
                  />
                )}
              </Box>

              {/* Right: actions */}
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="View">
                  <IconButton size="small" onClick={() => onView?.(v.id)}>
                    <Eye size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => onEdit?.(v.id)}>
                    <Pencil size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <span>
                    <IconButton
                      size="small"
                      color="error"
                      disabled={!canDelete(v.id)}
                      onClick={() => onDelete?.(v.id)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Paper>
  );
}
