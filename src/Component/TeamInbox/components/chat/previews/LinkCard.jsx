import React from "react";
import { Box, Stack, Typography, Skeleton } from "@mui/material";
import BUBBLE from "../../../constants/BUBBLE_TOKENS";

/**
 * @param {{ part: any }} props
 */
export default function LinkCard({ part }) {
  const unfurl = part?.meta?.unfurl || null;
  const href = part?.meta?.href || part?.url || "";

  const site = unfurl?.site || prettyHost(href);
  const title = unfurl?.title || href;
  const desc = unfurl?.desc || "";

  return (
    <Box
      sx={(th) => ({
        mt: 1,
        border: `1px solid ${th.palette.divider}`,
        borderRadius: BUBBLE.linkCard.radius,
        overflow: "hidden",
        bgcolor: th.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : th.palette.background.paper,
        position: "relative",
      })}
    >
      {/* Accent spine */}
      <Box
        sx={(th) => ({
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: BUBBLE.linkCard.accentWidth,
          bgcolor: th.palette.primary.light,
        })}
      />
      <Stack spacing={0.5} sx={{ px: BUBBLE.linkCard.padX, py: BUBBLE.linkCard.padY, pl: BUBBLE.linkCard.padX + BUBBLE.linkCard.accentWidth }}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {site || <Skeleton width={80} />}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: BUBBLE.linkCard.titleSize }}>
          {title || <Skeleton width="60%" />}
        </Typography>
        {desc ? (
          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: BUBBLE.linkCard.descSize }}>
            {desc}
          </Typography>
        ) : null}
        <Typography variant="body2" sx={{ color: "primary.main", fontSize: BUBBLE.linkCard.urlSize, pt: 0.5 }}>
          {href}
        </Typography>
      </Stack>
    </Box>
  );
}

function prettyHost(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
