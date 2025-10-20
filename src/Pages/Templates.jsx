// Path: src/Pages/Templates.jsx

import React from "react";

import { ThemeProvider } from '@mui/material';
import { notifyTheme } from '../theme/notifyTheme';
import TemplatesApp from "../Component/templates";

export default function Templates() {
  // Single exposed page for the whole Templates section
  return <ThemeProvider theme={notifyTheme}><TemplatesApp /></ThemeProvider>;
}


