// Path: /src/Component/Meetings/public/BookingPage.jsx
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { notifyTheme } from "../../../theme/notifyTheme";
import BookingWizardInner from "../components/BookingWizard";

export default function BookingWizardThemed() {
  return (
    <ThemeProvider theme={notifyTheme}>
      <CssBaseline />
      <BookingWizardInner />
    </ThemeProvider>
  );
}
