// Path: src/Component/templates/channel-previews/DeviceFrame.jsx
import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

const PRESETS = {
  mobile: { w: 390, h: 844, barH: 22 },
  tablet: { w: 834, h: 1112, barH: 26 },
  desktop: { w: 1200, h: 750, barH: 36 },
};

/**
 * Props:
 * - device: 'mobile' | 'tablet' | 'desktop'
 * - orientation: 'portrait' | 'landscape'
 * - frameBorder?: number   // bezel thickness (default 10)
 * - frameRadius?: number   // OUTER corner radius (default 8)
 * - shadow?: number        // 0..1 shadow multiplier (default 0.9)
 * - addressBarText?: string
 * - fitPadding?: number    // space around device inside stage (default 4)  ← smaller = larger device
 * - scaleBias?: number     // gentle size boost within safe limit (default 0.12)
 * - children
 */
export default function DeviceFrame({
  device = "mobile",
  orientation = "portrait",
  frameBorder = 10,
  frameRadius = 4,
  shadow = 0.9,
  addressBarText = "Template preview",
  fitPadding = 4,
  scaleBias = 0.12,
  children,
  alignTop = false,
}) {
  const t = useTheme();
  const preset = PRESETS[device] || PRESETS.mobile;
  const isLandscape = orientation === "landscape";

  // Screen size for this orientation
  const baseW = isLandscape ? preset.h : preset.w;
  const baseH = isLandscape ? preset.w : preset.h;

  // Hardware size (screen + bezel)
  const HW_W = baseW + frameBorder * 2;
  const HW_H = baseH + frameBorder * 2;

  // Stage measurement → scale to fit (centered, no crop)
  const stageRef = React.useRef(null);
  const [stage, setStage] = React.useState({ w: 1, h: 1 });
  React.useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect || {};
      if (width && height) setStage({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pad = Math.max(fitPadding, 0);
  const fitScale = Math.min(
    Math.max(stage.w - pad, 1) / HW_W,
    Math.max(stage.h - pad, 1) / HW_H,
    1
  );

  // Upper bound with zero padding (still no-crop)
  const maxScaleNoPad = Math.min(
    Math.max(stage.w, 1) / HW_W,
    Math.max(stage.h, 1) / HW_H,
    1
  );

  // Final scale = “fit” * (1 + bias) but clamped to no-pad max
  const scale = Math.min(fitScale * (1 + Math.max(scaleBias, 0)), maxScaleNoPad);

  // Scaled footprint so layout knows the painted size (no cropping)
  const scaledW = Math.round(HW_W * scale);
  const scaledH = Math.round(HW_H * scale);

  const screenRadius = Math.max(frameRadius - frameBorder, 4);

  // Side buttons
  const btnThick = 3;
  const btnLenLg = Math.max(Math.round(baseH * 0.10), 56);
  const btnLenSm = Math.max(Math.round(baseH * 0.07), 40);
  const btnOffsetTop = Math.max(Math.round(baseH * 0.18), 120);
  const btnGap = 12;

  const winDot = (c) => <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c }} />;

  const dropShadow = `
    0 ${12 * shadow}px ${28 * shadow}px ${alpha("#000", 0.28 * shadow)},
    0 ${3 * shadow}px ${10 * shadow}px ${alpha("#000", 0.18 * shadow)}
  `;

  return (
    <Box
      ref={stageRef}
      sx={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        overflow: "visible",
        p: 1.5,
        alignItems: "start",
        justifyItems: "center",
      }}
    >
      {/* Footprint that matches the scaled hardware */}
      <Box sx={{ width: scaledW, height: scaledH, position: "relative" }}>
        {/* Hardware shell (scaled & centered) */}
        <Box
          sx={{
            width: HW_W,
            height: HW_H,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: "center",
            borderRadius: frameRadius,
            background: alpha(t.palette.text.primary, 0.06),
            boxShadow: dropShadow,
          }}
        >
          {/* Side buttons (mobile/tablet) */}
          {device !== "desktop" && (
            !isLandscape ? (
              <>
                <Box sx={{ position: "absolute", left: 0, top: btnOffsetTop, width: btnThick, height: btnLenLg, transform: "translateX(-50%)", borderRadius: btnThick, bgcolor: alpha("#000", 0.24) }} />
                <Box sx={{ position: "absolute", left: 0, top: btnOffsetTop + btnLenLg + btnGap, width: btnThick, height: btnLenSm, transform: "translateX(-50%)", borderRadius: btnThick, bgcolor: alpha("#000", 0.24) }} />
                <Box sx={{ position: "absolute", right: 0, top: btnOffsetTop + Math.round(btnLenLg / 2), width: btnThick, height: btnLenLg + 6, transform: "translateX(50%)", borderRadius: btnThick, bgcolor: alpha("#000", 0.24) }} />
              </>
            ) : (
              <>
                <Box sx={{ position: "absolute", top: 0, left: frameBorder + 24, width: btnLenSm, height: btnThick, transform: "translateY(-50%)", borderRadius: btnThick, bgcolor: alpha("#000", 0.24) }} />
                <Box sx={{ position: "absolute", top: 0, left: frameBorder + 24 + btnLenSm + btnGap, width: btnLenLg, height: btnThick, transform: "translateY(-50%)", borderRadius: btnThick, bgcolor: alpha("#000", 0.24) }} />
                <Box sx={{ position: "absolute", top: 0, right: frameBorder + 24, width: btnLenSm + 10, height: btnThick, transform: "translateY(-50%)", borderRadius: btnThick, bgcolor: alpha("#000", 0.24) }} />
              </>
            )
          )}

          {/* Screen / glass */}
          <Box
            sx={{
              position: "absolute",
              top: frameBorder,
              left: frameBorder,
              width: baseW,
              height: baseH,
              borderRadius: screenRadius,
              overflow: "hidden",
              background: t.palette.background.paper,
              border: `1px solid ${alpha(t.palette.text.primary, 0.12)}`,
            }}
          >
            {/* Status / URL bar */}
            <Box
              sx={{
                height: preset.barH,
                width: "100%",
                bgcolor: device === "desktop" ? alpha(t.palette.primary.main, 0.08) : alpha(t.palette.text.primary, 0.06),
                borderBottom: `1px solid ${alpha(t.palette.text.primary, 0.08)}`,
                display: "flex",
                alignItems: "center",
                px: 1,
                gap: 1,
              }}
            >
              {device === "desktop" ? (
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ width: "100%" }}>
                  {winDot("#ff5f56")}
                  {winDot("#ffbd2e")}
                  {winDot("#27c93f")}
                  <Typography variant="caption" sx={{ ml: 1, color: "text.secondary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {addressBarText}
                  </Typography>
                </Stack>
              ) : (
                <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                  <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 88, height: 6, borderRadius: 6, bgcolor: alpha(t.palette.text.primary, 0.28) }} />
                  <Box sx={{ position: "absolute", top: "50%", right: 10, transform: "translateY(-50%)", width: 8, height: 8, borderRadius: "50%", bgcolor: alpha("#000", 0.45) }} />
                </Box>
              )}
            </Box>

            {/* Viewport for preview content */}
            <Box sx={{ width: "100%", height: `calc(100% - ${preset.barH}px)`, overflow: "auto" }}>
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
