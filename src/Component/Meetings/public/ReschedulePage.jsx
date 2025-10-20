// Path: /src/Component/Meetings/public/ReschedulePageThemed.jsx
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { notifyTheme } from "../../../theme/notifyTheme";
import ReschedulePageComponent from "../components/ReschedulePage";

export default function ReschedulePage() {
  return (
    <ThemeProvider theme={notifyTheme}>
      <CssBaseline />
      <ReschedulePageComponent />
    </ThemeProvider>
  );
}
