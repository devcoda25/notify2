// src/TeamInbox/components/chat/parts/MessagePartsPreview.jsx
// Lightweight attachments preview used inside a bubble (UI-facing MessageUI.parts)

import React from "react";
import { Stack, Typography } from "@mui/material";

/**
 * @param {{ parts?: Array<{ id:string, kind:string, name?:string, mime?:string, url?:string }> }} props
 */
export default function MessagePartsPreview({ parts = [] }) {
  if (!Array.isArray(parts) || parts.length === 0) return null;

  return (
    <Stack spacing={0.5} sx={{ mt: 0.5 }}>
      {parts.map((p) => (
        <Typography
          key={p.id || `${p.kind}-${p.name || p.url || Math.random()}`}
          variant="caption"
          sx={{ opacity: 0.9 }}
        >
          {(p.kind || "part").toUpperCase()} • {p.name || p.mime || p.url || ""}
        </Typography>
      ))}
    </Stack>
  );
}
