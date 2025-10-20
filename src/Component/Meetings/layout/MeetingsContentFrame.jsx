// Path: /src/Component/Meetings/layout/MeetingsContentFrame.jsx
import React from "react";
import { Box, Stack, useTheme, useMediaQuery } from "@mui/material";
import { alpha } from "@mui/material/styles";

/**
 * MeetingsContentFrame
 *
 * A thin layout wrapper for Meetings pages. It applies left padding equal to
 * the nav width (via CSS var --nav-w) plus theme spacing for breathing room.
 *
 * Props:
 *  - children (node): page content
 *  - maxWidth (number|string): optional, e.g. 1400
 *  - topGap (number): extra top spacing (in theme.spacing units), default 2
 *  - disableGutters (bool): if true, don’t add the horizontal padding
 */
export default function MeetingsContentFrame({
  children,
  maxWidth = 1400,
  topGap = 2,
  disableGutters = false,
}) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  // On desktop, push content to the right by the nav width; on mobile, no push.
  // We rely on CSS var --nav-w set by MeetingsLeftNav, with a safe fallback (264px).
  const leftPad =
    mdUp && !disableGutters ? `calc(var(--nav-w, 264px) + ${theme.spacing(3)})` : theme.spacing(1);
  const horizPad = disableGutters ? 0 : theme.spacing(3);

  return (
    <Box
      component="main"
      role="main"
      sx={{
        pl: leftPad,
        pr: horizPad,
        pt: theme.spacing(topGap),
        pb: theme.spacing(3),
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
        // faint separator to visually detach content from nav on large screens
        backgroundImage: mdUp
          ? `linear-gradient(90deg, ${alpha(theme.palette.divider, 0.18)} 0, transparent 1px)`
          : "none",
        backgroundRepeat: "no-repeat",
        backgroundSize: mdUp ? "1px 100%" : "auto",
        backgroundPosition: "calc(var(--nav-w, 264px)) 0",
      }}
    >
      <Stack
        sx={{
          mx: "auto",
          width: "100%",
          maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
          gap: 0,
        }}
      >
        {children}
      </Stack>
    </Box>
  );
}
