// /src/routes/PrivateGate.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../auth/user.store";

/**
 * Gates the entire private shell (Navbar + pages).
 * Renders nothing until authChecked === true (BootGate splash stays visible).
 * When checked: renders children if isAuthed, else redirects to /console/pass.
 */
export default function PrivateGate({ Fallback = null }) {
  const authChecked = useUserStore((s) => s.authChecked);
  const isAuthed = useUserStore((s) => s.isAuthed);

  if (!authChecked) return Fallback ? <Fallback /> : null;
  if (!isAuthed) return <Navigate to="/console/pass" replace />;
  return <Outlet />;
}
