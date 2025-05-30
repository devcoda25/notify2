import React, { useState, useEffect } from "react";
import { IconButton, Modal } from "@mui/material";
import { CloseIcon } from "../Component/Icon";
import { Navigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [selectedToggle, setSelectedToggle] = useState(null);
//   const [authUserId, setAuthUserId] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

  const redirect_url = "http://localhost:3000/Teaminbox";
  // const redirect_url = "https://notify.dev.evzone.app/Teaminbox";
  const handleContinue = () => {
    setShowPasscode(true);
  };

  const checkAuthStatus = () => {
    const params = new URLSearchParams(window.location.search);
    const x_authuser = params.get("x_authuser");

    if (x_authuser) {
      console.log("x_authuser", x_authuser);
      sessionStorage.setItem("auth", "true");
    //   window.location.href = `/u/${x_authuser}${
    //     window.location.pathname !== "/" ? window.location.pathname : ""
    //   }`;
      onLogin();
      return;
    }
    // setAuthUserId(null);
    // setIsLoggedIn(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLogin = () => {
    console.log("window.globalValue", window.globalValue);
    if (!window.globalValue) {
      window.location.href = `https://accounts.dev.evzone.app/?redirecturl=${redirect_url}`;
    } else {
        window.location.href = `https://accounts.dev.evzone.app/?redirecturl=${redirect_url}`;
    //   window.location.href = `https://myaccount.evzone.app/u/${window.globalValue}/profile?change=${redirect_url}`;
    }
  };

  const handleInputChange = (index, value) => {
    const numeric = value.replace(/\D/, ""); // Only digits
    const updated = passcode.split("");
    updated[index] = numeric;
    const newPasscode = updated.join("");
    setPasscode(newPasscode);

    // move to next input
    if (numeric && index < 5) {
      const nextInput = document.getElementById(`pass-${index + 1}`);
      nextInput?.focus();
    }

    // check passcode
    if (newPasscode.length === 6) {
      if (newPasscode === "123456") {
        setTimeout(() => {
          sessionStorage.setItem("auth", "true");
          onLogin();
          sessionStorage.removeItem("selectedToggle");
        }, 1000);
      } else {
        alert("Invalid passcode");
        setPasscode("");
      }
    }
  };
  useEffect(() => {
    const toggle = sessionStorage.getItem("selectedToggle");
    if (toggle) {
      setSelectedToggle(toggle);
    }
  }, []);
  return (
    <>
      <div className="login_page_container">
        {
          <Modal open={showPasscode} onClose={() => setShowPasscode(false)}>
            <div className="modal_style_login">
              <IconButton
                onClick={() => setShowPasscode(false)}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              <div>
                <img src="/assets/images/profile.png" alt="profile" />
              </div>
              <h4>Passcode Required</h4>
              <p>
                To access your Work Account, Please enter your Access Passcode
              </p>
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  id={`pass-${index}`}
                  type="text"
                  maxLength="1"
                  value={passcode[index] || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="circle-input"
                  autoFocus={index === 0}
                />
              ))}
              <h5>
                <a style={{ color: "#f77f00" }}>
                  <span style={{ color: "black" }}>Forgot Access code?</span>
                  Contact your Supervisor
                </a>
              </h5>
            </div>
          </Modal>
        }
        <div className="left_content">
          <>
            <img src="/assets/images/Notify_login_logo.svg" alt="welcome" />

            {selectedToggle && (
              <>
                <div>
                  <table className="break_table">
                    <tbody>
                      <tr>
                        <th>Break Type</th>
                        <td>Lunch</td>
                      </tr>
                      <tr>
                        <th>Time Out</th>
                        <td>5:49 PM</td>
                      </tr>
                      <tr>
                        <th>Time Back</th>
                        <td>6:10 PM</td>
                      </tr>
                      <tr>
                        <th>Duration</th>
                        <td>00:21:02</td>
                      </tr>
                      <tr>
                        <th>Break Time allowed</th>
                        <td>Maxed Out</td>
                      </tr>
                      <tr>
                        <th>Remaining Break Time</th>
                        <td>00:00:00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        </div>
        <div className="right_content">
          <h2>Welcome back, thameem!</h2>
          <p>You're almost there! Log in to access your work page</p>
          <div>
            <img src="/assets/images/profile.png" alt="profile" />
          </div>
          <div className="userinfo_container">
            <div className="userinfo">
              <div>Continue as Thameem </div>
              <p>thameem@heptotechnologies.org</p>
            </div>
            <button className="continue_button" onClick={handleContinue}>
              Continue
            </button>
          </div>
          x
          <h4>
            <a style={{ color: "#f77f00" }}>
              <span style={{ color: "black" }}>Not you?</span> Log in with a
              different personal account
            </a>
          </h4>
          <button onClick={handleLogin} className="login_btn">
            Login
          </button>
        </div>
      </div>
    </>
  );
};
export default Login;
