// src/TeamInbox/components/chat/previews/index.js
// Preview registry (JS). Plug different previewers by kind/mime.
// API:
//   register({ test:(part)=>boolean, weight?:number, Component })
//   renderPart(part) -> ReactNode (best match)

import React from "react";
import LinkCard from "./LinkCard.jsx";
import FileTile from "./FileTile.jsx";
import FallbackPreview from "./FallbackPreview.jsx";
import AudioPlayer from "./AudioPlayer.jsx";
import VideoPlayer from "./VideoPlayer.jsx";
import CodePartPreview from "./CodePartPreview.jsx";

const _registry = [];

/**
 * Register a previewer.
 * @param {{ test:(part:any)=>boolean, weight?:number, Component:React.ComponentType<any> }} entry
 */
export function register(entry) {
  if (!entry || typeof entry.test !== "function" || !entry.Component) return;
  _registry.push({
    ...entry,
    weight: Number.isFinite(entry.weight) ? entry.weight : 0,
  });
  _registry.sort((a, b) => b.weight - a.weight);
}

/** Return a shallow copy of the registry (debug/tests) */
export function getRegisteredPreviews() {
  return [..._registry];
}

/** Clear the registry (tests) */
export function _clearRegistry() {
  _registry.length = 0;
}

/** Pick the best renderer for a part, or return null. */
export function pickPreview(part) {
  for (const r of _registry) {
    try {
      if (r.test(part)) return r;
    } catch {}
  }
  return null;
}

/**
 * Render a part with the best match renderer.
 * @param {any} part
 * @param {object=} extraProps optional props passed into the preview Component
 */
export function renderPart(part, extraProps = {}) {
  const match = pickPreview(part);
  const Comp = match?.Component || FallbackPreview;
  return <Comp key={part?.id || Math.random()} part={part} {...extraProps} />;
}

/* -------------------- Match helpers -------------------- */
const isLinkish = (p) => {
  const k = String(p?.kind || "").toLowerCase();
  return k === "link" || !!p?.meta?.href || !!p?.meta?.unfurl;
};
const isImage = (p) =>
  String(p?.kind || "").toLowerCase() === "image" ||
  String(p?.mime || "").toLowerCase().startsWith("image/");
const isAudio = (p) =>
  String(p?.kind || "").toLowerCase() === "audio" ||
  String(p?.mime || "").toLowerCase().startsWith("audio/");
const isVideo = (p) =>
  String(p?.kind || "").toLowerCase() === "video" ||
  String(p?.mime || "").toLowerCase().startsWith("video/");
const isCode = (p) => String(p?.kind || "").toLowerCase() === "code";

/* -------------------- Registrations -------------------- */

// Link preview
register({ test: (p) => isLinkish(p), weight: 90, Component: LinkCard });

// Audio
register({ test: (p) => isAudio(p), weight: 60, Component: AudioPlayer });

// Video
register({ test: (p) => isVideo(p), weight: 60, Component: VideoPlayer });

// Code (inline text via part.meta.text or fallback to file tile)
register({ test: (p) => isCode(p), weight: 55, Component: CodePartPreview });

// Generic file (exclude images; ImageGrid handles them)
register({
  test: (p) => !isImage(p) && !!(p?.url || p?.name),
  weight: 10,
  Component: FileTile,
});

// Fallback
register({ test: (_p) => true, weight: -999, Component: FallbackPreview });
