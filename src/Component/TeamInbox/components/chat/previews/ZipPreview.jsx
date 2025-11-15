// src/TeamInbox/components/chat/previews/ZipPreview.jsx
import React, { useState } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import { FileArchive } from "lucide-react";

/**
 * @param {{ part:any, onRequestList?: (part:any)=>Promise<any[]> }} props
 * part.meta.archiveList?: Array<{ name:string, bytes?:number }>
 */
export default function ZipPreview({ part, onRequestList }) {
  const [entries, setEntries] = useState(Array.isArray(part?.meta?.archiveList) ? part.meta.archiveList : null);
  const [loading, setLoading] = useState(false);

  const rows = (entries || []).slice(0, 8);
  const more = (entries || []).length - rows.length;

  const load = async () => {
    if (!onRequestList) return;
    setLoading(true);
    try {
      const list = await onRequestList(part);
      setEntries(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={(th) => ({ border: `1px solid ${th.palette.divider}`, borderRadius: 1, p: 1, minWidth: 260, maxWidth: 520 })}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        <FileArchive size={18} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{part?.name || "Archive"}</Typography>
        {part?.bytes ? <Typography variant="caption" color="text.secondary">• {fmt(part.bytes)}</Typography> : null}
      </Stack>

      {rows && rows.length > 0 ? (
        <Box sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12 }}>
          {rows.map((e, i) => (
            <Stack key={i} direction="row" justifyContent="space-between" sx={{ py: 0.25 }}>
              <Typography variant="caption" sx={{ mr: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {e.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">{fmt(e.bytes)}</Typography>
            </Stack>
          ))}
          {more > 0 ? (
            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>
              +{more} more…
            </Typography>
          ) : null}
        </Box>
      ) : (
        <Button size="small" variant="outlined" onClick={load} disabled={loading}>
          {loading ? "Loading…" : "Preview contents"}
        </Button>
      )}
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
