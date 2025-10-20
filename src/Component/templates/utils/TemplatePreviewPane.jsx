// Path: src/Component/templates/utils/TemplatePreviewPane.jsx
import React from "react";
import { Box, Stack, Paper, Typography } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

import EmailPreview from "../channel-previews/EmailPreview";
import SmsPreview from "../channel-previews/SmsPreview";
import PushPreview from "../channel-previews/PushPreview";
import PlatformPreview from "../channel-previews/PlatformPreview";
import WhatsAppPreview from "../channel-previews/WhatsAppPreview";
import { DeviceToolbar } from "./DeviceToggle"; // <-- use the new toolbar

export default function TemplatePreviewPane({
  variant,
  initialDevice = "mobile",
  initialOrientation = "portrait",
  device: deviceProp,
  onDeviceChange,
  orientation: orientationProp,
  onOrientationChange,
  showToolbar = true,
  height = "auto",          // treat as MIN height if number is passed
  title = "Preview",
  stagePadding = 2,
}) {
  const t = useTheme();

  // uncontrolled fallbacks
  const [uDevice, setUDevice] = React.useState(initialDevice);
  const [uOrientation, setUOrientation] = React.useState(initialOrientation);
  const device = deviceProp ?? uDevice;
  const setDevice = onDeviceChange ?? setUDevice;
  const orientation = orientationProp ?? uOrientation;
  const setOrientation = onOrientationChange ?? setUOrientation;

  const channel = variant?.channel || "email";
  const Preview =
    (channel === "email" && EmailPreview) ||
    (channel === "sms" && SmsPreview) ||
    (channel === "push" && PushPreview) ||
    (channel === "platform" && PlatformPreview) ||
    (channel === "whatsapp" && WhatsAppPreview) ||
    (() => <Box p={2}>Unsupported channel</Box>);

  const paneSx = {
    p: showToolbar ? 1.25 : 0,
    borderRadius: 2,
    height: "100%",
    minHeight: typeof height === "number" ? height : undefined,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: 0,
    overflow: "visible",
  };

  return (
    <Paper variant="outlined" sx={paneSx}>
      {showToolbar && (
        <DeviceToolbar
          title={title}
          device={device}
          onDeviceChange={setDevice}
          orientation={orientation}
          onOrientationChange={setOrientation}
          compact
        />
      )}

      {/* Stage: fills remaining space, centers device, no cropping, no shadow clipping */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          border: `1px solid ${alpha(t.palette.primary.main, 0.1)}`,
          borderRadius: showToolbar ? 1.5 : 2,
          background: alpha(t.palette.primary.main, 0.02),
          display: "grid",
          alignItems: "start",
          justifyItems: "center",
          pt: "2rem",
          px: stagePadding,
          pb: stagePadding,
          overflow: "visible",
        }}
      >
        <Preview
          variant={variant}
          device={device}
          orientation={orientation}
          frameBorder={10}
          frameRadius={4}
          fitPadding={4}
          scaleBias={0.12}
        />
      </Box>
    </Paper>
  );
}
