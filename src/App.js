import React, { useEffect } from "react";
import BaseLayouts from "./Layouts/baselayouts";
import { registerServiceWorker } from "./swRegistration";
import { simulateIncomingCall } from "./alerts/demoSim";

// hydrate global user store from auth on app bootstrap
import { setupUserAuthBridge, teardownUserAuthBridge } from "./auth/setupUserAuthBridge";

function App() {
  useEffect(() => {
    // Boot the auth → user store bridge (no dummies; uses claims as-is)
    setupUserAuthBridge();

    // Existing SW + dev helper
    registerServiceWorker();
    if (process.env.NODE_ENV !== "production") {
      window.simulateIncomingCall = simulateIncomingCall;
      console.info("Dev: window.simulateIncomingCall({...}) is available");
    }

    return () => {
      // Clean up the bridge on unmount (safety for HMR/tests)
      teardownUserAuthBridge();
    };
  }, []);

  return (
    <React.Fragment>
      <BaseLayouts />
    </React.Fragment>
  );
}

export default App;
