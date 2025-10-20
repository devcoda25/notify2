// Path: src/Component/templates/utils/EmptyState.jsx

import React from "react";
import { Box, Stack, Typography, Button, Paper } from "@mui/material";

export default function EmptyState({
  icon: Icon,
  title = "Nothing here yet",
  description = "Try changing your filters or creating something new.",
  actionLabel,
  onAction,
  compact = false,
}) {
  return (
    <Paper variant="outlined" sx={{ p: compact ? 2 : 4, borderRadius: 2 }}>
      <Stack alignItems="center" spacing={1.5} sx={{ textAlign: "center" }}>
        {Icon && <Icon size={28} />}
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
          {description}
        </Typography>
        {actionLabel && (
          <Box sx={{ pt: 0.5 }}>
            <Button variant="contained" onClick={onAction}>
              {actionLabel}
            </Button>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
