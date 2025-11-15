// src/TeamInbox/components/chat/parts/NewMessagesMarker.jsx
// Use: Thin, subtle “New messages” marker placed at the unread boundary.
// Works with: ChatPane/MessageVirtualList to inject between items once per timeline.
// Uses: MUI (Divider/Typography).

import React from "react";
import { Box, Divider, Typography } from "@mui/material";

/**
 * @param {{
 *   label?: string,
 *   sx?: object,
 * }} props
 */
export default function NewMessagesMarker({ label = "New messages", sx }) {
  return (
    <Box sx={{ my: 0.75, ...sx }} aria-label={label} role="separator">
      <Divider>
        <Typography
          variant="caption"
          color="primary"
          sx={{ fontWeight: 700, letterSpacing: 0.2, px: 1 }}
        >
          {label}
        </Typography>
      </Divider>
    </Box>
  );
}
