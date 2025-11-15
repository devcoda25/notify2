// src/TeamInbox/components/chat/TypingPresenceBar.jsx
// Small, dependency-free typing indicator bar for chat timelines.
// Props:
//   typing?: Array<{ userId:string, displayName?:string, avatarUrl?:string }>
// Renders nothing when no one is typing.

import React, { useMemo } from "react";
import { Box, Fade, Avatar, AvatarGroup, Typography, Stack } from "@mui/material";

function initials(name = "") {
  const parts = String(name).trim().split(/\s+/);
  const a = (parts[0]?.[0] || "").toUpperCase();
  const b = (parts[1]?.[0] || "").toUpperCase();
  return (a + b || "U").slice(0, 2);
}

function summaryLine(names) {
  if (names.length === 0) return "";
  if (names.length === 1) return `${names[0]} is typing…`;
  if (names.length === 2) return `${names[0]} and ${names[1]} are typing…`;
  const [first, second] = names;
  return `${first}, ${second} and ${names.length - 2} others are typing…`;
}

/**
 * @param {{ typing?: Array<{ userId:string, displayName?:string, avatarUrl?:string }> }} props
 */
export function TypingPresenceBar({ typing = [] }) {
  // Deduplicate by userId and strip falsy entries
  const list = useMemo(() => {
    if (!Array.isArray(typing)) return [];
    const seen = new Set();
    const out = [];
    for (const t of typing) {
      const id = String(t?.userId || "");
      if (!id || seen.has(id)) continue;
      seen.add(id);
      out.push({
        userId: id,
        displayName: t?.displayName || "Someone",
        avatarUrl: t?.avatarUrl || "",
      });
    }
    return out;
  }, [typing]);

  if (list.length === 0) return null;

  const names = list.map((t) => t.displayName);

  return (
    <Fade in timeout={150}>
      <Box
        sx={(th) => ({
          borderTop: `1px solid ${th.palette.divider}`,
          px: 1.25,
          py: 0.75,
          bgcolor: th.palette.background.paper,
        })}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 11 } }}>
            {list.map((t) => (
              <Avatar key={t.userId} src={t.avatarUrl} alt={t.displayName}>
                {initials(t.displayName)}
              </Avatar>
            ))}
          </AvatarGroup>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {summaryLine(names)}
          </Typography>

          {/* Three-dot bouncing indicator (CSS-only, no extra deps) */}
          <Box
            aria-hidden
            sx={{
              ml: 0.5,
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              "& span": {
                width: 4,
                height: 4,
                borderRadius: "50%",
                bgcolor: "text.secondary",
                display: "inline-block",
                animation: "tpb-bounce 1.2s infinite ease-in-out",
              },
              "& span:nth-of-type(2)": { animationDelay: "0.15s" },
              "& span:nth-of-type(3)": { animationDelay: "0.3s" },
              "@keyframes tpb-bounce": {
                "0%, 80%, 100%": { transform: "scale(0.6)", opacity: 0.6 },
                "40%": { transform: "scale(1)", opacity: 1 },
              },
            }}
          >
            <span />
            <span />
            <span />
          </Box>
        </Stack>
      </Box>
    </Fade>
  );
}

export default TypingPresenceBar;
