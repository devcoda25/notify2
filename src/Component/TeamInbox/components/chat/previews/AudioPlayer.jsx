import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { FileAudio } from "lucide-react";

/**
 * @param {{ part:any }} props
 */
export default function AudioPlayer({ part }) {
  const name = part?.name || "audio";
  const size = formatBytes(part?.bytes);

  if (!part?.url) return null;

  return (
    <Box sx={(th) => ({ border: `1px solid ${th.palette.divider}`, borderRadius: 8, p: 1, minWidth: 260, maxWidth: 420 })}>
      <Stack spacing={0.5}>
        <audio controls preload="metadata" style={{ width: "100%" }}>
          <source src={part.url} type={part?.mime || "audio/mpeg"} />
        </audio>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <FileAudio size={16} />
          <Typography variant="caption" sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }} title={name}>
            {name} {size ? `• ${size}` : ""}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

function formatBytes(n) {
  const b = Number(n);
  if (!Number.isFinite(b) || b <= 0) return "";
  const units = ["B", "KB", "MB"];
  let i = 0, v = b;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}
