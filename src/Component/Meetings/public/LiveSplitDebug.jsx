import React from "react";
import { Stack, Box } from "@mui/material";
import LiveApp from "../components/notify-live";
import { RoleProvider } from "./live-sync/RoleContext";
import { LiveBusProvider } from "./live-sync/LiveBusContext";
import { useParams } from "react-router-dom";

export default function LiveSplitDebug() {
  const { roomId } = useParams();
  return (
      <Stack direction="row" sx={{ height: "100vh" }}>
        <Box sx={{ flex: 1, borderRight: 1, borderColor: "divider" }}>
          <RoleProvider role="host">
            <LiveBusProvider roomId={roomId}>
              <LiveApp roomId={roomId} role="host" host="alpha" displayName="Host" />
            </LiveBusProvider>
          </RoleProvider>
        </Box>
        <Box sx={{ flex: 1 }}>
          <RoleProvider role="participant">
            <LiveBusProvider roomId={roomId}>
              <LiveApp roomId={roomId} role="participant" host="alpha" displayName="Guest" />
            </LiveBusProvider>
          </RoleProvider>
        </Box>
      </Stack>
  );
}
