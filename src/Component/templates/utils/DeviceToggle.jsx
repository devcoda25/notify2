// Path: src/Component/templates/utils/DeviceToggle.jsx
import React from "react";
import {
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Tabs,
  Tab,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import {
  Smartphone,
  TabletSmartphone,
  MonitorSmartphone,
  LaptopMinimal,
  RectangleHorizontal,
  RectangleVertical,
  Eye,
  Download,
  Unplug,
} from "lucide-react";

/**
 * -------------------------------------------
 * Default export: Simple device/orientation toggle
 * (kept for backward compatibility)
 * -------------------------------------------
 *
 * Props:
 *  - device: "mobile" | "tablet" | "desktop" | "auto"
 *  - onChange: (next) => void
 *  - orientation?: "portrait" | "landscape"
 *  - onOrientationChange?: (next) => void
 *  - compact?: boolean
 *  - showAuto?: boolean           (default false to hide "All/Auto")
 *  - showTablet?: boolean         (default true)
 *  - showOrientation?: boolean    (default true)
 */
export default function DeviceToggle({
  device = "mobile",
  onChange,
  orientation = "portrait",
  onOrientationChange,
  compact = true,
  showAuto = false,       // <-- hide "Auto/All" by default per user request
  showTablet = true,
  showOrientation = true,
}) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <ToggleButtonGroup
        size={compact ? "small" : "medium"}
        exclusive
        value={device}
        onChange={(_, v) => v && onChange?.(v)}
      >
        {showAuto && (
          <ToggleButton value="auto">
            <MonitorSmartphone size={14} style={{ marginRight: 6 }} />
            Auto
          </ToggleButton>
        )}
        <ToggleButton value="mobile">
          <Smartphone size={14} style={{ marginRight: 6 }} />
          Mobile
        </ToggleButton>
        {showTablet && (
          <ToggleButton value="tablet">
            <TabletSmartphone size={14} style={{ marginRight: 6 }} />
            Tablet
          </ToggleButton>
        )}
        <ToggleButton value="desktop">
          <LaptopMinimal size={14} style={{ marginRight: 6 }} />
          Desktop
        </ToggleButton>
      </ToggleButtonGroup>

      {showOrientation && (
        <ToggleButtonGroup
          size={compact ? "small" : "medium"}
          exclusive
          value={orientation}
          onChange={(_, v) => v && onOrientationChange?.(v)}
        >
          <ToggleButton value="portrait">
            <RectangleVertical size={14} style={{ marginRight: 6 }} />
            Portrait
          </ToggleButton>
          <ToggleButton value="landscape">
            <RectangleHorizontal size={14} style={{ marginRight: 6 }} />
            Landscape
          </ToggleButton>
        </ToggleButtonGroup>
      )}
    </Stack>
  );
}

/**
 * -------------------------------------------
 * Named export: Full toolbar row for previews
 * (exactly matches the original row in TemplatePreviewPane)
 * -------------------------------------------
 *
 * Props:
 *  - title?: string
 *  - device: "mobile" | "tablet" | "desktop"
 *  - onDeviceChange: (next) => void
 *  - orientation: "portrait" | "landscape"
 *  - onOrientationChange: (next) => void
 *  - compact?: boolean
 *  - disableDownload?: boolean
 *  - disableConnect?: boolean
 */
export function DeviceToolbar({
  title = "Preview",
  device = "mobile",
  onDeviceChange,
  orientation = "portrait",
  onOrientationChange,
  compact = true,
  disableDownload = true,
  disableConnect = true,
}) {
  const deviceIndex = Math.max(0, ["mobile", "tablet", "desktop"].indexOf(device));

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
      {/* Left: title */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
        <Eye size={16} />
        <Typography variant="subtitle2" noWrap>
          {title}
        </Typography>
      </Stack>

      {/* Center: device tabs */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Tabs
          value={deviceIndex}
          onChange={(_, idx) => onDeviceChange?.(["mobile", "tablet", "desktop"][idx] || "mobile")}
          sx={{ minHeight: compact ? 32 : 40, "& .MuiTab-root": { minHeight: compact ? 32 : 40, px: 1.25 } }}
        >
          <Tab icon={<Smartphone size={16} />} iconPosition="start" label="Mobile" />
          <Tab icon={<TabletSmartphone size={16} />} iconPosition="start" label="Tablet" />
          <Tab icon={<LaptopMinimal size={16} />} iconPosition="start" label="Desktop" />
        </Tabs>
      </Box>

      {/* Right: orientation + (disabled) actions */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <ToggleButtonGroup
          size={compact ? "small" : "medium"}
          exclusive
          value={orientation}
          onChange={(_, v) => v && onOrientationChange?.(v)}
        >
          <ToggleButton value="portrait">Portrait</ToggleButton>
          <ToggleButton value="landscape">Landscape</ToggleButton>
        </ToggleButtonGroup>

        <Tooltip title="Download (coming soon)">
          <span>
            <IconButton size="small" disabled={disableDownload}>
              <Download size={16} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Connect to device (coming soon)">
          <span>
            <IconButton size="small" disabled={disableConnect}>
              <Unplug size={16} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
