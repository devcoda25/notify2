// src/TeamInbox/components/chat/previews/ApkPreview.jsx
import React from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import { Smartphone, ShieldCheck } from "lucide-react";

/**
 * @param {{ part:any, onScan?: (part:any)=>void }} props
 * part.meta.apk?: { icon?:string, package?:string, versionName?:string, versionCode?:string }
 */
export default function ApkPreview({ part, onScan }) {
  const apk = part?.meta?.apk || {};
  const icon = apk.icon;
  const pkg = apk.package || "Android App";
  const ver = apk.versionName ? `v${apk.versionName}` : (apk.versionCode ? `#${apk.versionCode}` : "");

  return (
    <Box sx={(th) => ({ border: `1px solid ${th.palette.divider}`, borderRadius: 1, p: 1, minWidth: 260, maxWidth: 520 })}>
      <Stack direction="row" spacing={1}>
        <Box sx={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", display: "grid", placeItems: "center", bgcolor: "action.hover" }}>
          {icon ? <img src={icon} alt="icon" style={{ width: 40, height: 40, objectFit: "cover" }} /> : <Smartphone size={20} />}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {pkg}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {ver}{part?.bytes ? ` • ${fmt(part.bytes)}` : ""}
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.5}>
          {part?.url ? (
            <Button size="small" variant="outlined" component="a" href={part.url} target="_blank" rel="noopener noreferrer">
              Download
            </Button>
          ) : null}
          {onScan ? (
            <Button size="small" variant="outlined" startIcon={<ShieldCheck size={14} />} onClick={() => onScan(part)}>
              Scan
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}

function fmt(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return "";
  const u = ["B", "KB", "MB", "GB"]; let i = 0, x = v;
  while (x >= 1024 && i < u.length - 1) { x /= 1024; i++; }
  return `${x.toFixed(x >= 10 || i === 0 ? 0 : 1)} ${u[i]}`;
}
