// src/TeamInbox/components/chat/previews/CompactUrlPill.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { Link as LinkIcon } from "lucide-react";

export default function CompactUrlPill({ href }) {
  const url = String(href || "");
  if (!url) return null;
  const host = safeHost(url);

  return (
    <Box
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      sx={(th) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: 999,
        border: `1px solid ${th.palette.divider}`,
        textDecoration: "none",
        color: "inherit",
        maxWidth: "100%",
      })}
      title={url}
    >
      <LinkIcon size={14} />
      <Typography variant="caption" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {host}
      </Typography>
    </Box>
  );
}

function safeHost(u) { try { return new URL(u).host; } catch { return u; } }
