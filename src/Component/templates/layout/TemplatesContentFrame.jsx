import React from "react";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import theme from "../../../theme/notifyTheme";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";

import TemplatesLeftNav from "./TemplatesLeftNav";

const DRAWER_WIDTH = 260;

/**
 * Responsive frame for the Templates section.
 * - Left nav (permanent on md+, temporary on sm)
 * - Scrollable content area for views
 *
 * Top bar removed — views now own their own filter toolbars.
 */
export default function TemplatesContentFrame({
  children,
  currentView,
  selectedChannel,
  onNavigate,       // (view, channel?) => void
  onCreateTemplate, // unused here; passed directly to views now if needed
}) {
  const outerTheme = useTheme() || theme;
  const isMdUp = useMediaQuery(outerTheme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleNav = (view, ch) => {
    onNavigate?.(view, ch);
    setMobileOpen(false);
  };

  const nav = (
    <Paper square elevation={0} sx={{ height: "100%", borderRight: (t) => `1px solid ${t.palette.divider}` }}>
      <TemplatesLeftNav
        currentView={currentView}
        selectedChannel={selectedChannel}
        onNavigate={handleNav}
        
      />
    </Paper>
  );

  return (
    <ThemeProvider theme={outerTheme ?? theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100%", minHeight: 0 }}>
        {/* Left navigation */}
        {isMdUp ? (
          <Box
            component="nav"
            sx={{ width: DRAWER_WIDTH, flexShrink: 0, borderRight: (t) => `1px solid ${t.palette.divider}` }}
            aria-label="Templates navigation"
          >
            <Box sx={{ width: DRAWER_WIDTH, height: "100vh", position: "sticky", top: 0 }}>{nav}</Box>
          </Box>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            PaperProps={{ sx: { width: DRAWER_WIDTH } }}
          >
            {nav}
          </Drawer>
        )}

        {/* Main content (views render their own toolbars/filters) */}
        <Box sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh" }}>
          <Box sx={{ flexGrow: 1, minHeight: 0, overflow: "auto", p: { xs: 2, md: 3 } }}>{children}</Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
