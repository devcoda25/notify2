// src/TeamInbox/components/chat/richtext/CodeBlock.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";

/**
 * @param {{ code:string, language?:string, collapsibleLines?:number }} props
 */
export default function CodeBlock({ code = "", language = "", collapsibleLines = 20 }) {
  const lines = useMemo(() => code.split(/\r?\n/), [code]);
  const long = lines.length > collapsibleLines;
  const [open, setOpen] = useState(!long);
  const codeRef = useRef(null);

  // Optional syntax highlighting if highlight.js is globally available
  useEffect(() => {
    try {
      if (window.hljs && codeRef.current) {
        window.hljs.highlightElement(codeRef.current);
      }
    } catch {}
  }, [code, language, open]);

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(code); } catch {}
  };

  return (
    <Box
      sx={(th) => ({
        border: `1px solid ${th.palette.divider}`,
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: th.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "action.hover",
      })}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 0.5 }}>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {language ? language.toUpperCase() : "CODE"}
        </Typography>
        <Stack direction="row" spacing={0.25}>
          {long ? (
            <Tooltip title={open ? "Collapse" : "Expand"}>
              <IconButton size="small" onClick={() => setOpen((v) => !v)}>
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </IconButton>
            </Tooltip>
          ) : null}
          <Tooltip title="Copy">
            <IconButton size="small" onClick={onCopy}><Copy size={16} /></IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Box sx={{ px: 1, pb: 1 }}>
        <pre
          style={{
            margin: 0,
            maxHeight: open ? 480 : Math.min(collapsibleLines, 12) * 20 + 16,
            overflow: "auto",
          }}
        >
          <code ref={codeRef} className={language ? `language-${language}` : undefined}>
            {code}
          </code>
        </pre>
      </Box>
    </Box>
  );
}
