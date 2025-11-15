// src/TeamInbox/components/tickets/TicketsListEmpty.jsx
// Simple empty-state for the tickets panel.
// Props:
//   reason?: string
//   onResetFilters?: () => void
//   onNewTicket?: () => void

import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";

export default function TicketsListEmpty({
  reason = "No tickets to show",
  onResetFilters,
  onNewTicket,
}) {
  // Debug: why are we rendering the empty state?
  console.debug("[TI] TicketsListEmpty reason =", reason);

  return (
    <Box
      sx={(th) => ({
        height: "100%",
        minHeight: 220,
        display: "grid",
        placeItems: "center",
        px: 2,
        bgcolor: th.palette.background.paper,
      })}
    >
      <Stack spacing={1.5} alignItems="center" sx={{ textAlign: "center", maxWidth: 360 }}>
        {/* Decorative circle */}
        <Box
          aria-hidden
          sx={(th) => ({
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: `2px dashed ${th.palette.divider}`,
            opacity: 0.8,
          })}
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {reason}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.75 }}>
          Try clearing filters or create a new ticket to get started.
        </Typography>

        <Stack direction="row" spacing={1} sx={{ pt: 0.5 }}>
          {onResetFilters && (
            <Button size="small" variant="outlined" onClick={onResetFilters}>
              Clear filters
            </Button>
          )}
          {onNewTicket && (
            <Button size="small" variant="contained" onClick={onNewTicket}>
              New ticket
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
