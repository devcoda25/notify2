// src/TeamInbox/components/chat/richtext/Collapsible.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Box, Button } from "@mui/material";

/**
 * Collapses tall content with a fade and "Show more".
 * Heuristic: collapsed if contentHeight > maxCollapsed
 */
export default function Collapsible({
  children,
  defaultCollapsed = true,
  maxCollapsed = 240, // px
  fadeSize = 36,
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [needClamp, setNeedClamp] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = el.scrollHeight;
    setNeedClamp(h > maxCollapsed + 8);
  }, [children, maxCollapsed]);

  const toggle = () => setCollapsed((v) => !v);

  const clampStyles = collapsed && needClamp
    ? { maxHeight: maxCollapsed, overflow: "hidden", position: "relative" }
    : {};

  return (
    <Box>
      <Box ref={ref} sx={clampStyles}>
        {children}
        {collapsed && needClamp ? (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: fadeSize,
              background: (th) =>
                `linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${th.palette.background.paper} 70%)`,
            }}
          />
        ) : null}
      </Box>

      {needClamp ? (
        <Box sx={{ pt: 0.5 }}>
          <Button size="small" onClick={toggle}>
            {collapsed ? "Show more" : "Show less"}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}
