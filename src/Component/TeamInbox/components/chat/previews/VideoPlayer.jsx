import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { FileVideo } from "lucide-react";
import BUBBLE from "../../../constants/BUBBLE_TOKENS";

/**
 * @param {{ part:any }} props
 */
export default function VideoPlayer({ part }) {
  const name = part?.name || "video";
  const size = formatBytes(part?.bytes);
  const poster = part?.meta?.thumb;

  if (!part?.url) return null;

  return (
    <Box sx={(th) => ({ border: `1px solid ${th.palette.divider}`, borderRadius: 8, p: 1, minWidth: 260, maxWidth: 520 })}>
      <Stack spacing={0.5}>
        <video
          controls
          preload="metadata"
          poster={poster}
          style={{ width: "100%", height: BUBBLE.videoHeight, objectFit: "cover", borderRadius: 6 }}
        >
          <source src={part.url} type={part?.mime || "video/mp4"} />
        </video>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <FileVideo size={16} />
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
