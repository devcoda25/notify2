// /src/Pages/AuthCallback.jsx
import React from "react";
import { resumeLogin } from "../auth/authAgent";

function friendly(e) {
  const code = e?.code || "";
  const base = e?.message || "We couldn’t finish signing you in.";
  const hint =
    code === "HELLO_FAILED" ? "Check your network/VPN and try again." :
    code === "CLOCK_IN_FAILED" ? "Your access may be missing or expired. Contact your supervisor." :
    code === "TICKET_FAILED" ? "Session could not be prepared. Refresh and try again." :
    code === "WS_REJECT" ? "Live updates failed to initialize. Reload the page." :
    "";
  return hint ? `${base} ${hint}` : base;
}

export default function AuthCallback({ onLogin }) {
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        await resumeLogin();      // cookie-backed finalize (no prompts)
        if (!ctrl.signal.aborted) onLogin?.();
      } catch (e) {
        if (!ctrl.signal.aborted) setErr(friendly(e));
      }
    })();
    return () => ctrl.abort();
  }, [onLogin]);

  return (
    <div style={{ padding: 24 }}>
      <h3>Completing sign-in…</h3>
      {err ? <p style={{ color: "#b00020" }}>{err}</p> : <p>Please wait.</p>}
      {err ? (
        <p style={{ marginTop: 12 }}>
          <a href="/console/pass">Try again</a>
        </p>
      ) : null}
    </div>
  );
}
