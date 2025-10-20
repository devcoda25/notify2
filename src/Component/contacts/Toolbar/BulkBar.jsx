// /src/Component/contacts/Toolbar/BulkBar.jsx
import React from "react";
import { Paper, Stack, Typography, Button, IconButton, Tooltip } from "@mui/material";
import { Trash2, Download, X } from "lucide-react";

/**
 * Props
 * - count: number
 * - onClear: () => void
 * - onDelete: () => void
 * - onExport: () => void
 * - rightExtra?: ReactNode
 */
export default function BulkBar({ count = 0, onClear, onDelete, onExport, rightExtra = null }) {
  if (!count) return null;

  return (
    <Paper
      elevation={1}
      sx={{
        mt: 1,
        mb: 1,
        px: 1.5,
        py: 1,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
        position: "sticky",
        top: 0,
        zIndex: 2,
      }}
    >
      <Stack direction="row" alignItems="center" gap={1} sx={{ flex: 1 }}>
        <Typography variant="body2">
          <strong>{count}</strong> selected
        </Typography>

        <Tooltip title="Delete selected">
          <Button size="small" color="error" startIcon={<Trash2 size={16} />} onClick={onDelete} variant="outlined">
            Delete
          </Button>
        </Tooltip>

        <Tooltip title="Export selected">
          <Button size="small" startIcon={<Download size={16} />} onClick={onExport} variant="outlined">
            Export
          </Button>
        </Tooltip>
      </Stack>

      <Stack direction="row" alignItems="center" gap={1}>
        {rightExtra}
        <Tooltip title="Clear selection">
          <IconButton size="small" onClick={onClear} aria-label="Clear selection">
            <X size={16} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
}
