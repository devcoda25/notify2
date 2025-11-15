// /src/Pages/Login.jsx
import React, { useState } from "react";
import { IconButton, Modal } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { beginLogin } from "../auth/authAgent";

const t = () => new Date().toISOString();
const log  = (...a) => console.log(`[Login ${t()}]`, ...a);
const warn = (...a) => console.warn(`[Login ${t()}] WARN`, ...a);
const err  = (...a) => console.error(`[Login ${t()}] ERROR`, ...a);

// Optional: translate internal codes to extra human hints (authAgent already friendly-izes .message)
function hintFor(e) {
  const code = e?.code || "";
  switch (code) {
    case "HELLO_FAILED":
      return "Make sure the server is reachable and you’re connected to the VPN/Wi-Fi.";
    case "CLOCK_IN_FAILED":
      return "If this keeps happening, your passcode may be wrong or expired—ask your supervisor.";
    case "TICKET_FAILED":
      return "We couldn’t prepare a secure session. Refresh and try again.";
    case "WS_REJECT":
      return "Live updates could not be initialized. Try reloading the page.";
    case "NO_TOKEN":
      return "No sign-in token configured. In production you’ll be redirected to the IdP.";
    default:
      return "";
  }
}

const Login = ({ onLogin }) => {
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [busy, setBusy] = useState(false);
  const [errMsg, setErr] = useState("");

  const openPasscode = () => {
    setErr("");
    setPasscode("");
    setShowPasscode(true);
    // focus first box shortly after open
    setTimeout(() => document.getElementById("pass-0")?.focus(), 20);
  };

  async function runLogin(p) {
    if (busy) return;
    log("runLogin start", { hasPass: !!p });
    setBusy(true);
    setErr("");
    try {
      // beginLogin handles both: dev-token flow OR IdP redirect if no token
      const res = await beginLogin({ passcode: p });
      // If beginLogin redirected to IdP, we won’t reach here immediately.
      // If it returned state (dev flow), continue:
      if (res && typeof onLogin === "function") onLogin();
    } catch (e) {
      err("login failed", e);
      const base = e?.message || "Sign-in failed. Please try again.";
      const extra = hintFor(e);
      setErr(extra ? `${base} ${extra}` : base);
    } finally {
      setBusy(false);
      log("runLogin end");
    }
  }

  const handleDigitChange = (index, value) => {
    const v = value.replace(/\D/g, "");
    const arr = passcode.split("");
    arr[index] = v;
    const next = arr.join("");
    setPasscode(next);

    if (v && index < 5) document.getElementById(`pass-${index + 1}`)?.focus();
    if (next.length === 6) {
      log("6 digits entered — triggering runLogin");
      void runLogin(next);
    }
  };

  return (
    <>
      <div className="login_page_container">
        <Modal open={showPasscode} onClose={() => setShowPasscode(false)}>
          <div className="modal_style_login" role="dialog" aria-modal="true" aria-label="Enter access passcode">
            <IconButton
              onClick={() => setShowPasscode(false)}
              sx={{ position: "absolute", top: 8, right: 8 }}
              disabled={busy}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>

            <div>
              <img src="/assets/images/profile.png" alt="profile" />
            </div>
            <h4>Passcode Required</h4>
            <p>To access your Work Account, please enter your Access Passcode</p>

            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  id={`pass-${i}`}
                  inputMode="numeric"
                  aria-label={`Passcode digit ${i + 1}`}
                  type="text"
                  maxLength={1}
                  value={passcode[i] || ""}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  className="circle-input"
                  autoFocus={i === 0}
                  disabled={busy}
                />
              ))}
            </div>

            {errMsg ? <p style={{ color: "#d32f2f", marginTop: 8 }}>{errMsg}</p> : null}

            <h5>
              <span style={{ color: "black" }}>Forgot Access code?</span>{" "}
              <span style={{ color: "#f77f00" }}>Contact your Supervisor</span>
            </h5>
          </div>
        </Modal>

        <div className="left_content">
          <img src="/assets/images/Notify_login_logo.svg" alt="welcome" />
        </div>

        <div className="right_content">
          <h2>Welcome back!</h2>
          <p>You're almost there! Log in to access your work page</p>
          <div>
            <img src="/assets/images/profile.png" alt="profile" />
          </div>

          <div className="userinfo_container">
            <div className="userinfo">
              <div>Continue</div>
              <p>Use passcode to proceed</p>
            </div>
            <button className="continue_button" onClick={openPasscode} disabled={busy}>
              {busy ? "Checking…" : "Continue"}
            </button>
          </div>

          <h4 style={{ opacity: 0.6 }}>For production, this will redirect to the IdP.</h4>

          <button
            onClick={() => { log("Sign-in button clicked"); void runLogin(""); }}
            className="login_btn"
            disabled={busy}
            title="Sign in (dev token if configured, else redirects to IdP)"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>

          {errMsg ? (
            <p style={{ color: "#d32f2f", marginTop: 12, textAlign: "center" }}>{errMsg}</p>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Login;
