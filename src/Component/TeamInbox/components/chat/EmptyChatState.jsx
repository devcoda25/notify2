// src/TeamInbox/components/chat/EmptyChatState.jsx
// Context-aware empty chat UX (purely presentational).
//
// Props:
// - state: 'noRoom' | 'noConversation' | 'noMessages'   (default: 'noRoom')
// - onCreateRoom?: () => void
// - onCreateConversation?: () => void
//
// Behavior:
// - noRoom: headline + "New room" CTA (gated by availability)
// - noConversation: headline + "New conversation" CTA (gated by availability)
// - noMessages: headline "Send the first ticket" (no CTA)

import React from "react";
import { Box, Stack, Typography, Button, Tooltip } from "@mui/material";

// Mirror presence from Rooms store (echo-only), same as Sidebar
import {
  useRoomsStore,
  selectMyAvailability,
  selectMyAvailabilityPending,
} from "../../store/useRoomsStore.js";

export default function EmptyChatState({
  state = "noRoom",
  onCreateRoom,
  onCreateConversation,
}) {
  const isNoRoom = state === "noRoom";
  const isNoConversation = state === "noConversation";
  const isNoMessages = state === "noMessages";

  const title = isNoMessages
    ? "Send the first ticket"
    : isNoConversation
      ? "No conversation selected"
      : "No room selected";

  const subtitle = isNoMessages
    ? "Type below to start the conversation."
    : isNoConversation
      ? "Create a conversation for this room to begin messaging."
      : "Create a room to organize roommates and start conversations.";

  const ctaText = isNoRoom ? "New room" : isNoConversation ? "New conversation" : null;
  const ctaHandler = isNoRoom ? onCreateRoom : isNoConversation ? onCreateConversation : undefined;

  // ---- Presence gating (same gate as sidebar/new-room dialog) ----
  const rawAvailability = useRoomsStore(selectMyAvailability);
  const pending = useRoomsStore(selectMyAvailabilityPending);
  const availability = (rawAvailability || "").toLowerCase();
  const isAvailable = availability === "available" && !pending;

  const ctaDisabled = !!ctaText && (!!pending || !isAvailable);
  const tooltipMsg = pending
    ? "Updating your status…"
    : "You must be Available to proceed";

  return (
    <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
      <Stack spacing={1.5} sx={{ textAlign: "center", maxWidth: 360, px: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>

        {ctaText && ctaHandler && (
          <Box sx={{ pt: 1 }}>
            <Tooltip arrow title={ctaDisabled ? tooltipMsg : (isNoRoom ? "Create a room" : "Create a conversation")}>
              {/* Wrap disabled Button with span so Tooltip still works */}
              <span>
                <Button
                  variant="contained"
                  size="small"
                  onClick={ctaHandler}
                  disabled={ctaDisabled}
                  aria-disabled={ctaDisabled ? "true" : "false"}
                >
                  {ctaText}
                </Button>
              </span>
            </Tooltip>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
