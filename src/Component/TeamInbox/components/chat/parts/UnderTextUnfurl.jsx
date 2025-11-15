// src/TeamInbox/components/chat/parts/UnderTextUnfurl.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import { fetchUnfurl } from "../../../services/unfurl.service.js";
import CompactUrlPill from "../previews/CompactUrlPill.jsx";
import LinkCard from "../previews/LinkCard.jsx";

/**
 * @param {{ text:string }} props
 */
export default function UnderTextUnfurl({ text }) {
  const urls = useMemo(() => extractUrls(text), [text]);
  const [cards, setCards] = useState(() => urls.map((u) => ({ url: u, data: null })));

  useEffect(() => {
    let alive = true;
    (async () => {
      const results = await Promise.all(urls.map((u) => fetchUnfurl(u)));
      if (!alive) return;
      setCards(urls.map((u, i) => ({ url: u, data: results[i] || null })));
    })();
    return () => { alive = false; };
  }, [urls.join("|")]); // stable enough

  if (urls.length === 0) return null;

  return (
    <Stack spacing={1}>
      {cards.map((c, i) =>
        c.data ? (
          <LinkCard key={i} part={{ kind: "link", meta: { href: c.url, unfurl: c.data } }} />
        ) : (
          <CompactUrlPill key={i} href={c.url} />
        )
      )}
    </Stack>
  );
}

function extractUrls(s = "") {
  const re = /https?:\/\/[^\s)]+/g;
  const out = []; let m;
  while ((m = re.exec(s))) out.push(m[0]);
  // dedupe
  return Array.from(new Set(out));
}
