// src/TeamInbox/components/chat/previews/FileTile.jsx

import React from "react";
import { Box, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import {
  Download, Copy, File, FileArchive, FileCode, FileImage, FileText, FileAudio, FileVideo
} from "lucide-react";
import BUBBLE from "../../../constants/BUBBLE_TOKENS";

/**
 * @param {{ part:any }} props
 */
export default function FileTile({ part }) {
  const name = part?.name || part?.url || "file";
  const size = formatBytes(part?.bytes);
  const ext = extOf(name);
  const Icon = pickIcon(part?.mime, ext);

  const onCopy = async (e) => {
    e?.preventDefault?.();
    try {
      if (part?.url) await navigator.clipboard.writeText(part.url);
    } catch {}
  };

  return (
    <Box
      sx={(th) => ({
        display: "inline-flex",
        alignItems: "center",
        minWidth: 240,
        height: BUBBLE.fileTile.height,
        px: BUBBLE.fileTile.padX,
        py: BUBBLE.fileTile.padY,
        borderRadius: BUBBLE.fileTile.radius,
        border: `1px solid ${th.palette.divider}`,
        bgcolor: th.palette.background.paper,
      })}
    >
      <Box
        sx={(th) => ({
          width: 36, height: 36, borderRadius: 8, mr: 1,
          display: "grid", placeItems: "center",
          color: th.palette.text.secondary,
          background:
            th.palette.mode === "dark"
              ? "linear-gradient(135deg, #2e2e2e, #1e1e1e)"
              : "linear-gradient(135deg, #f4f4f4, #e9e9e9)",
        })}
        aria-hidden
      >
        <Icon size={18} />
      </Box>

      <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="body2"
          sx={{ fontSize: BUBBLE.fileTile.nameSize, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}
          title={name}
        >
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: BUBBLE.fileTile.metaSize }}>
          {ext ? `${ext.toUpperCase()} • ` : ""}{size}
        </Typography>
      </Stack>

      {part?.url ? (
        <>
          <Tooltip title="Copy link"><IconButton size="small" onClick={onCopy} aria-label="Copy link"><Copy size={18} /></IconButton></Tooltip>
          <Tooltip title="Download">
            <IconButton size="small" component="a" href={part.url} target="_blank" rel="noopener noreferrer" aria-label="Download">
              <Download size={18} />
            </IconButton>
          </Tooltip>
        </>
      ) : null}
    </Box>
  );
}

function pickIcon(mime = "", ext = "") {
  const m = String(mime).toLowerCase();
  const e = String(ext).toLowerCase();

  if (m.startsWith("image/")) return FileImage;
  if (m.startsWith("video/")) return FileVideo;
  if (m.startsWith("audio/")) return FileAudio;
  if (m === "application/zip" || ["zip", "gz", "tar", "7z"].includes(e)) return FileArchive;
  if (m === "text/html" || ["html", "htm"].includes(e)) return FileCode;
  if (m === "text/markdown" || ["md", "json", "js", "ts", "css"].includes(e)) return FileCode;
  if (m === "application/pdf" || ["pdf", "doc", "docx", "ppt", "pptx", "txt"].includes(e)) return FileText;
  return File;
}

function extOf(name = "") {
  const m = String(name).match(/\.([a-z0-9]+)$/i);
  return m ? m[1] : "";
}
function formatBytes(n) {
  const b = Number(n);
  if (!Number.isFinite(b) || b <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0, v = b;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}
