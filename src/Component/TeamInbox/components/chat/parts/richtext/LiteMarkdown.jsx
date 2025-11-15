// src/TeamInbox/components/chat/richtext/LiteMarkdown.jsx
import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import CodeBlock from "./CodeBlock.jsx";

/**
 * Safe, minimal markdown renderer with headings, lists, bold/italic, inline links,
 * inline code, and fenced code blocks (```lang ... ```).
 * No HTML injection.
 * @param {{ text:string }} props
 */
export default function LiteMarkdown({ text = "" }) {
  const blocks = useMemo(() => parseMarkdown(text), [text]);
  return (
    <Box>
      {blocks.map((b, i) => {
        if (b.type === "code") {
          return <Box key={i} sx={{ my: 1 }}><CodeBlock code={b.code} language={b.lang} /></Box>;
        }
        if (b.type === "ul" || b.type === "ol") {
          const C = b.type === "ul" ? "ul" : "ol";
          return (
            <Box key={i} component={C} sx={{ pl: 2, my: 0.5 }}>
              {b.items.map((it, j) => (
                <li key={j}>
                  <Inline nodes={it} />
                </li>
              ))}
            </Box>
          );
        }
        if (b.type === "h") {
          const variant = b.level === 1 ? "h6" : b.level === 2 ? "subtitle1" : "subtitle2";
          return (
            <Typography key={i} variant={variant} sx={{ fontWeight: 700, mt: b.level === 1 ? 0.5 : 0.25, mb: 0.25 }}>
              <Inline nodes={b.nodes} />
            </Typography>
          );
        }
        // paragraph
        return (
          <Typography key={i} variant="body2" sx={{ my: 0.5, lineHeight: 1.6 }}>
            <Inline nodes={b.nodes} />
          </Typography>
        );
      })}
    </Box>
  );
}

/* ---------------- Inline renderer ---------------- */
function Inline({ nodes }) {
  return nodes.map((n, i) => {
    if (typeof n === "string") return <React.Fragment key={i}>{n}</React.Fragment>;
    if (n.t === "b") return <strong key={i}>{n.c}</strong>;
    if (n.t === "i") return <em key={i}>{n.c}</em>;
    if (n.t === "code") return <code key={i} style={{ padding: "0 3px", borderRadius: 3, background: "rgba(127,127,127,.15)" }}>{n.c}</code>;
    if (n.t === "a") return <a key={i} href={n.href} target="_blank" rel="noopener noreferrer">{n.c}</a>;
    return null;
  });
}

/* ---------------- Parser (lightweight) ---------------- */

// Turn markdown text into a sequence of block nodes
function parseMarkdown(src = "") {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block ```lang
    const fence = line.match(/^```([a-zA-Z0-9_-]+)?\s*$/);
    if (fence) {
      const lang = fence[1] || "";
      let j = i + 1;
      const buf = [];
      while (j < lines.length && !/^```\s*$/.test(lines[j])) {
        buf.push(lines[j]);
        j++;
      }
      out.push({ type: "code", lang, code: buf.join("\n") });
      i = j + 1;
      continue;
    }

    // Headings: #, ##, ###
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      out.push({ type: "h", level: h[1].length, nodes: parseInline(h[2]) });
      i++;
      continue;
    }

    // Lists
    const ulMark = line.match(/^\s*[-*]\s+(.*)$/);
    const olMark = line.match(/^\s*\d+\.\s+(.*)$/);
    if (ulMark || olMark) {
      const items = [];
      const isOl = !!olMark;
      while (i < lines.length) {
        const m = isOl ? lines[i].match(/^\s*\d+\.\s+(.*)$/) : lines[i].match(/^\s*[-*]\s+(.*)$/);
        if (!m) break;
        items.push(parseInline(m[1]));
        i++;
      }
      out.push({ type: isOl ? "ol" : "ul", items });
      continue;
    }

    // Blank line → paragraph break
    if (/^\s*$/.test(line)) { i++; continue; }

    // Paragraph (consume until blank or next block)
    const buf = [line];
    let j = i + 1;
    while (j < lines.length && !/^\s*$/.test(lines[j]) && !/^```/.test(lines[j]) && !/^(#{1,3})\s+/.test(lines[j]) && !/^\s*[-*]\s+/.test(lines[j]) && !/^\s*\d+\.\s+/.test(lines[j])) {
      buf.push(lines[j]);
      j++;
    }
    out.push({ type: "p", nodes: parseInline(buf.join(" ")) });
    i = j;
  }

  return out;
}

function parseInline(s = "") {
  // Inline code first: `code`
  const codeRe = /`([^`]+?)`/g;
  const chunks = splitKeep(s, codeRe, (m) => ({ t: "code", c: m[1] }));

  // Then bold ** ** and italic * *
  const out = [];
  for (const ch of chunks) {
    if (typeof ch !== "string") { out.push(ch); continue; }

    // links [text](url)
    const linkRe = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    let last = 0, m;
    const buf = [];
    while ((m = linkRe.exec(ch))) {
      if (m.index > last) buf.push(ch.slice(last, m.index));
      buf.push({ t: "a", c: m[1], href: m[2] });
      last = m.index + m[0].length;
    }
    if (last < ch.length) buf.push(ch.slice(last));

    for (const piece of buf) {
      if (typeof piece !== "string") { out.push(piece); continue; }

      // bold
      const boldRe = /\*\*(.+?)\*\*/g;
      let l = 0, mm;
      const mid = [];
      while ((mm = boldRe.exec(piece))) {
        if (mm.index > l) mid.push(piece.slice(l, mm.index));
        mid.push({ t: "b", c: mm[1] });
        l = mm.index + mm[0].length;
      }
      if (l < piece.length) mid.push(piece.slice(l));

      // italic
      for (const seg of mid) {
        if (typeof seg !== "string") { out.push(seg); continue; }
        const itRe = /\*(.+?)\*/g; let li = 0, mi;
        while ((mi = itRe.exec(seg))) {
          if (mi.index > li) out.push(seg.slice(li, mi.index));
          out.push({ t: "i", c: mi[1] });
          li = mi.index + mi[0].length;
        }
        if (li < seg.length) out.push(seg.slice(li));
      }
    }
  }
  return out;
}

function splitKeep(str, regex, mapMatch) {
  const out = [];
  let last = 0; let m;
  while ((m = regex.exec(str))) {
    if (m.index > last) out.push(str.slice(last, m.index));
    out.push(mapMatch(m));
    last = m.index + m[0].length;
  }
  if (last < str.length) out.push(str.slice(last));
  return out;
}
