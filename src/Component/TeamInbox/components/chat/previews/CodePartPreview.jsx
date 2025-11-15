// src/TeamInbox/components/chat/previews/CodePartPreview.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import CodeBlock from "../parts/richtext/CodeBlock.jsx";
import FileTile from "./FileTile.jsx";

/**
 * Renders a code UIPart using CodeBlock when text is available in meta,
 * otherwise falls back to a FileTile (download/open).
 * @param {{ part:any }} props
 */
export default function CodePartPreview({ part }) {
  const language = part?.meta?.language || guessLang(part?.name);
  const code = part?.meta?.text || part?.meta?.code || null;

  if (!code) {
    // no inline text to show; fall back to file tile
    return <FileTile part={part} />;
  }

  return (
    <Box sx={{ minWidth: 260, maxWidth: 640 }}>
      <CodeBlock code={code} language={language} />
      {part?.name ? (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
          {part.name}
        </Typography>
      ) : null}
    </Box>
  );
}

function guessLang(name = "") {
  const ext = String(name).split(".").pop()?.toLowerCase();
  const map = { js: "javascript", jsx: "jsx", ts: "typescript", tsx: "tsx", json: "json", css: "css", html: "html", md: "markdown", py: "python", rb: "ruby", go: "go", rs: "rust", java: "java", kt: "kotlin", php: "php", sh: "bash", yml: "yaml", yaml: "yaml" };
  return map[ext] || "";
}
