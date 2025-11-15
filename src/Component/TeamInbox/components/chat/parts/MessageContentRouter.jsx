// src/TeamInbox/components/chat/parts/MessageContentRouter.jsx
// Routes message text + parts into proper preview components.
// Phase 3: Markdown body (with clamp) + image grid + registry-driven previews.

import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { renderPart } from "../previews";
import BUBBLE from "../../../constants/BUBBLE_TOKENS";
import ImageGrid from "../previews/ImageGrid.jsx";
import Collapsible from "./richtext/Collapsible.jsx";
import LiteMarkdown from "./richtext/LiteMarkdown.jsx";
import UnderTextUnfurl from "./UnderTextUnfurl.jsx";

/**
 * @param {{ message: import("../../../types/chat").MessageUI }} props
 */
export default function MessageContentRouter({ message }) {
  const text = message?.text || "";
  const parts = Array.isArray(message?.parts) ? message.parts : [];

  // Split link parts from others for ordering similar to your comps
  const linkParts = parts.filter(
    (p) => (p?.kind || "").toLowerCase() === "link" || !!p?.meta?.unfurl
  );
  const otherParts = parts.filter((p) => !linkParts.includes(p));

  // Group images separately (grid), render others as tiles/players
  const imageParts = otherParts.filter(isImage);
  const nonImageParts = otherParts.filter((p) => !isImage(p));

  const hasBody = text.length > 0;
  const hasAttachments = otherParts.length > 0;

  return (
    <Stack spacing={1}>
      {/* Rich text body (markdown) with clamp */}
      {hasBody ? (
        <Collapsible>
          <LiteMarkdown text={text} />
        </Collapsible>
      ) : null}

      {/* Prominent link card(s) under body (Meet-like) */}
      {linkParts.length > 0 ? (
        <Stack spacing={1}>
          {linkParts.map((p) => renderPart(p))}
        </Stack>
      ) : null}

      {/* If body has URLs but no link parts, render compact pills and auto-unfurl */}
      {linkParts.length === 0 && hasBody ? <UnderTextUnfurl text={text} /> : null}

      {/* Divider + "Attachment" label if there are non-link parts */}
      {hasAttachments ? (
        <Box
          sx={(th) => ({
            mt: BUBBLE.sectionGapY - 2,
            pt: BUBBLE.sectionGapY - 2,
            borderTop: `1px solid ${th.palette.divider}`,
          })}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Attachment
          </Typography>

          {/* Images grid */}
          {imageParts.length > 0 ? (
            <Box sx={{ mb: nonImageParts.length ? 1.25 : 0 }}>
              <ImageGrid parts={imageParts} />
            </Box>
          ) : null}

          {/* Other parts via registry (file tiles, audio/video, code, etc.) */}
          {nonImageParts.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: `${BUBBLE.attachGridGap}px`,
              }}
            >
              {nonImageParts.map((p) => renderPart(p))}
            </Box>
          ) : null}
        </Box>
      ) : null}
    </Stack>
  );
}

/* ---------------- helpers ---------------- */

function isImage(p) {
  const k = String(p?.kind || "").toLowerCase();
  const m = String(p?.mime || "").toLowerCase();
  return k === "image" || m.startsWith("image/");
}
