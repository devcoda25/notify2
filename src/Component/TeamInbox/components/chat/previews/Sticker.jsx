// src/TeamInbox/components/chat/previews/Sticker.jsx
import React from "react";
import { Box } from "@mui/material";

export default function Sticker({ part }) {
  const src = part?.meta?.thumb || part?.url;
  if (!src) return null;
  return (
    <Box
      sx={(th) => ({
        display: "inline-block",
        borderRadius: 2,
        border: `1px solid ${th.palette.divider}`,
        overflow: "hidden",
        bgcolor: th.palette.background.paper,
      })}
    >
      <img src={src} alt={part?.name || "sticker"} style={{ maxWidth: 160, maxHeight: 160, display: "block" }} />
    </Box>
  );
}
