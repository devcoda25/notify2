import React, { useEffect } from "react";
import BaseLayouts from "./Layouts/baselayouts";
import { registerServiceWorker } from "./swRegistration";
import { simulateIncomingCall } from "./alerts/demoSim";


function App() {
    useEffect(() => {
    registerServiceWorker();
       if (process.env.NODE_ENV !== "production") {
      // make it easy to call from DevTools:
      window.simulateIncomingCall = simulateIncomingCall;
      console.info("Dev: window.simulateIncomingCall({...}) is available");
    }
  }, []);
  return (
    <React.Fragment>
      <BaseLayouts></BaseLayouts>
    </React.Fragment>
  );
}

export default App;
