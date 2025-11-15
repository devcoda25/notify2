// src/TeamInbox/components/chat/previews/ImageGrid.jsx
import React, { useMemo, useState } from "react";
import { Box, Dialog } from "@mui/material";
import BUBBLE from "../../../constants/BUBBLE_TOKENS";
import FileTile from "./FileTile.jsx";

/**
 * @param {{ parts: any[] }} props
 */
export default function ImageGrid({ parts = [] }) {
  const images = useMemo(() => (parts || []).filter(isImage), [parts]);

  // Hooks must always run in the same order (move before early return)
  const [openIdx, setOpenIdx] = useState(-1);
  const onOpen = (i) => setOpenIdx(i);
  const onClose = () => setOpenIdx(-1);

  if (!images.length) return null;

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(4, images.length)}, minmax(0, 1fr))`,
          gap: BUBBLE.imageGap,
        }}
      >
        {images.map((p, i) => (
          <ImageThumb key={p.id || i} part={p} onClick={() => onOpen(i)} />
        ))}
      </Box>

      <Dialog open={openIdx >= 0} onClose={onClose} maxWidth="lg" fullWidth>
        {openIdx >= 0 ? (
          <Box sx={{ bgcolor: "black", display: "grid", placeItems: "center", p: 2 }}>
            <img
              src={images[openIdx]?.url}
              alt={images[openIdx]?.name || "image"}
              style={{ maxWidth: "100%", maxHeight: "80vh" }}
            />
          </Box>
        ) : null}
      </Dialog>
    </>
  );
}

function ImageThumb({ part, onClick }) {
  const oversize = Number(part?.bytes) > 15 * 1024 * 1024; // 15MB inline cap
  const src = part?.meta?.thumb || part?.url;

  if (oversize || !src) return <FileTile part={part} />;

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        width: "100%",
        pt: "66%", // 3:2 thumb
        borderRadius: BUBBLE.imageRadius,
        overflow: "hidden",
        cursor: "zoom-in",
        border: (th) => `1px solid ${th.palette.divider}`,
      }}
    >
      <img
        loading="lazy"
        src={src}
        alt={part?.name || "image"}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
        }}
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    </Box>
  );
}

function isImage(p) {
  const k = String(p?.kind || "").toLowerCase();
  const m = String(p?.mime || "").toLowerCase();
  return k === "image" || m.startsWith("image/");
}
