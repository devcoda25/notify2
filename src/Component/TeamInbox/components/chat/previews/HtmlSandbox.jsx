// src/TeamInbox/components/chat/previews/HtmlSandbox.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Box, Stack, Typography, Button, Tooltip } from "@mui/material";
import { Shield, Play, ShieldAlert } from "lucide-react";

/**
 * @param {{ part:any, allowRun?: boolean }} props
 * part.meta.safeHtml: string   (server sanitized HTML)
 * part.meta.sandboxToken?: string  (optional server token for CSP)
 */
export default function HtmlSandbox({ part, allowRun = false }) {
  const safeHtml = part?.meta?.safeHtml || "";
  const token = part?.meta?.sandboxToken || "";
  const [run, setRun] = useState(false);

  // data URL for sandboxed iframe (no JS by default)
  const srcDoc = useMemo(() => {
    // safe mode: no scripts, no external fetches
    return `
<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>body{margin:8px;font:14px/1.4 system-ui}</style>
${safeHtml || "<div style='opacity:.7'>No preview</div>"}
    `.trim();
  }, [safeHtml]);

  // Optional "Run" mode (feature-flag/agent-only): allow scripts but pin CSP and block network via service worker shim if you need.
  const sandbox = run ? "allow-scripts allow-same-origin" : "allow-forms allow-popups allow-pointer-lock";
  const csp = run
    ? `default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:; script-src 'unsafe-inline' 'nonce-${token}';`
    : `default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; frame-ancestors 'none';`;

  return (
    <Box sx={(th) => ({ border: `1px solid ${th.palette.divider}`, borderRadius: 1, overflow: "hidden" })}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 0.5 }}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          {run ? <ShieldAlert size={16} /> : <Shield size={16} />}
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            HTML preview {run ? "(scripts ON)" : "(safe mode)"}
          </Typography>
        </Stack>

        {allowRun ? (
          <Tooltip title={run ? "Disable scripts" : "Enable scripts (unsafe)"}>
            <Button size="small" variant="outlined" onClick={() => setRun((v) => !v)} startIcon={<Play size={14} />}>
              {run ? "Stop" : "Run"}
            </Button>
          </Tooltip>
        ) : null}
      </Stack>

      <Box sx={{ height: 280 }}>
        <iframe
          title={part?.name || "HTML preview"}
          sandbox={sandbox}
          srcDoc={srcDoc}
          referrerPolicy="no-referrer"
          style={{ border: 0, width: "100%", height: "100%", background: "white" }}
          csp={csp}
        />
      </Box>
    </Box>
  );
}
