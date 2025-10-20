import React, { createContext, useContext, useMemo } from "react";

const CAPS = {
  host: ["pause", "resume", "end", "record", "screenshare"],
  participant: [],
};

const RoleCtx = createContext({ role: "participant", can: () => false });

export function RoleProvider({ role = "participant", children }) {
  const normalized =
    /host/i.test(role) ? "host" :
    /participant|invitee|guest/i.test(role) ? "participant" :
    "participant";

  const value = useMemo(
    () => ({ role: normalized, can: (cap) => CAPS[normalized].includes(cap) }),
    [normalized]
  );

  return <RoleCtx.Provider value={value}>{children}</RoleCtx.Provider>;
}

export const useRole = () => useContext(RoleCtx);
