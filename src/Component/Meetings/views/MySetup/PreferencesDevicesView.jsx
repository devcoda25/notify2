// Path: /src/Component/Meetings/views/MySetup/PreferencesDevicesView.jsx
import React from "react";
import { Stack, Typography, Divider, Paper, Box } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import DevicePreflight from "../../components/DevicePreflight";
import { useConferencingStore } from "../../../store/scheduling/useConferencingStore";

export default function PreferencesDevicesView() {
  const theme = useTheme();
  const { devicePrefs } = useConferencingStore();

  return (
    <Stack gap={2}>
      <Typography variant="h6">Preferences • Devices</Typography>
      <Divider />

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          borderColor: (t) => alpha(t.palette.primary.main, 0.25),
          bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Saved Preferences
        </Typography>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 1.5,
            borderRadius: 1,
            overflow: "auto",
            fontSize: 12,
            lineHeight: 1.6,
            bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.100",
            color: theme.palette.text.primary,
          }}
        >
          {JSON.stringify(devicePrefs, null, 2)}
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <DevicePreflight />
      </Paper>
    </Stack>
  );
}
