// src/Pages/TeamInbox.jsx
// Page integration: renders the new TeamInbox layout-only view.
// No legacy toggle, no suspense — keep it simple and loud for debugging.

import React, { useEffect } from "react";
import { Box } from "@mui/material";
import TeamInboxContentFrame from "../Component/TeamInbox/layouts/TeamInboxContentFrame";

export default function TeamInboxPage() {
  useEffect(() => {
    console.log("[TI] TeamInboxPage mount");
  }, []);

  return (
    <Box
      data-testid="TeamInboxPage"
      sx={{ height: "100dvh", display: "flex", flexDirection: "column", minHeight: 0 }}
    >
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <TeamInboxContentFrame />
      </Box>
    </Box>
  );
}
