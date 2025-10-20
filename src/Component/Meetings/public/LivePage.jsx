import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import theme, { notifyTheme } from "../../../theme/notifyTheme";
import LiveApp from "../components/notify-live";

import { RoleProvider } from "./live-sync/RoleContext";
import { LiveBusProvider } from "./live-sync/LiveBusContext";

/**
 * Public entry for Notify-Live.
 * Adds Role + LiveBus providers so host/participant stay in sync.
 */
export default function LivePage() {
  const { roomId } = useParams();
  const [qs] = useSearchParams();

  const roleRaw = (qs.get("role") || "host").toLowerCase(); // "host" | "invitee"
  const role = /host/.test(roleRaw) ? "host" : "participant";
  const host = qs.get("host") || "alpha";
  const name = qs.get("name") || (role === "host" ? "Host" : "Guest");
  const token = qs.get("token") || "";
  const debug = qs.get("debug") === "1";

  const activeTheme = theme || notifyTheme;

  return (
      <RoleProvider role={role}>
        <LiveBusProvider roomId={roomId}>
          <LiveApp
            roomId={roomId}
            role={role}
            host={host}
            displayName={name}
            token={token}
            debug={debug}
          />
        </LiveBusProvider>
      </RoleProvider>
  );
}
