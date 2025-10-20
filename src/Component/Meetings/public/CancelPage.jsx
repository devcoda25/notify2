// Path: /src/Component/Meetings/public/CancelPageThemed.jsx
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { notifyTheme } from "../../../theme/notifyTheme";
import CancelPageComponent from "../components/CancelPage";

export default function CancelPage() {
  return (
    <ThemeProvider theme={notifyTheme}>
      <CssBaseline />
      <CancelPageComponent />
    </ThemeProvider>
  );
}
