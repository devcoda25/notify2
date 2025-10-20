// Path: src/Component/templates/channel-previews/SmsPreview.jsx
import React from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Avatar,
  IconButton,
  InputBase,
  Divider,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import DeviceFrame from "./DeviceFrame";
import { MessageSquare, MoreHorizontal, ChevronLeft } from "lucide-react";

/**
 * Props:
 * - variant: { channel: 'sms', content: { body, fromName?, fromNumber?, time? } }
 * - device: 'mobile' | 'tablet' | 'desktop'
 * - orientation: 'portrait' | 'landscape'
 * - radius?: number         // corner radius for bubbles & cards (default 12)
 * - frameBorder?: number    // outer device border thickness (default 12)
 * - frameRadius?: number    // outer device corner radius (default 6)
 * - shadow?: number         // device drop-shadow strength (0..1, default 0.9)
 * - showReplyHint?: boolean // show “user reply” ghost input (default true)
 */
export default function SmsPreview({
  variant,
  device = "mobile",
  orientation = "portrait",
  radius = 12,
  frameBorder = 12,
  frameRadius = 6,
  shadow = 0.9,
  showReplyHint = true,
}) {
  const t = useTheme();

  // message text (allows variables like {{order_id}})
  const brandText = (variant?.content?.body || "").trim() ||
    "Hi {{user_first_name}} — your order {{order_id}} has been received. Track: {{tracking_url}}";

  // contact meta
  const contactName = variant?.content?.fromName || variant?.fromName || "Acme Store";
  const contactNumber = variant?.content?.fromNumber || variant?.fromNumber || "+1 ••• ••• •••01";
  const lastSeen = variant?.content?.time || variant?.time || "now";

  // max width to keep bubbles readable
  const maxWrap = device === "mobile" ? 360 : device === "tablet" ? 620 : 720;

  // realistic bubble component
  const Bubble = ({ children, side = "left", time }) => {
    const isLeft = side === "left";
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: isLeft ? "flex-start" : "flex-end",
          gap: 6,
          width: "100%",
        }}
      >
        <Box
          sx={{
            maxWidth: "82%",
            px: 2,
            py: 1,
            borderRadius: `${radius}px`,
            // Slightly different corner rounding for sent vs received
            borderTopLeftRadius: isLeft ? radius : Math.max(radius - 6, 6),
            borderTopRightRadius: isLeft ? Math.max(radius - 6, 6) : radius,
            borderBottomLeftRadius: radius,
            borderBottomRightRadius: radius,
            bgcolor: isLeft ? alpha(t.palette.grey[100], 1) : t.palette.primary.main,
            color: isLeft ? "text.primary" : "common.white",
            boxShadow: `0 1px 0 ${alpha(t.palette.common.black, 0.04)}`,
            border: isLeft
              ? `1px solid ${alpha(t.palette.text.primary, 0.06)}`
              : `1px solid ${alpha(t.palette.primary.dark, 0.16)}`,
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.45 }}>
            {children}
          </Typography>
        </Box>

        {time && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
            {time}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <DeviceFrame
      device={device}
      orientation={orientation}
      frameBorder={frameBorder}
      frameRadius={frameRadius}
      shadow={shadow}
      addressBarText="Messages"
    >
      <Box
        sx={{
          p: { xs: 1, sm: 2 },
          bgcolor: alpha(t.palette.primary.main, 0.02),
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack spacing={1} sx={{ width: "100%", maxWidth: maxWrap, mx: "auto" }}>
          {/* Top header — realistic message app header */}
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1,
              py: 0.75,
              borderRadius: 2,
              bgcolor: "transparent",
            }}
          >
            <IconButton size="small" sx={{ mr: 0 }}>
              <ChevronLeft size={18} />
            </IconButton>

            <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(t.palette.primary.main, 0.14), color: t.palette.primary.main }}>
              {String(contactName).split(/\s+/).slice(0,2).map(s => s[0]).join("").toUpperCase() || "A"}
            </Avatar>

            <Box sx={{ minWidth: 0, overflow: "hidden" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1 }}>
                {contactName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                {contactNumber} · {lastSeen}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }} />

            <IconButton size="small" aria-label="more">
              <MoreHorizontal size={16} />
            </IconButton>
          </Paper>

          {/* Conversation surface */}
          <Paper
            variant="outlined"
            sx={{
              p: 1.25,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: `1px solid ${alpha(t.palette.text.primary, 0.06)}`,
              minHeight: 240,
              maxHeight: "50vh",
              overflow: "auto",
            }}
          >
            <Stack spacing={2} sx={{ width: "100%" }}>
              {/* Brand -> left bubble */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <Box sx={{ width: 25, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
                  <Avatar sx={{ width: 20, height: 20, bgcolor: alpha(t.palette.primary.main, 0.12), color: t.palette.primary.main, fontSize: 12 }}>
                    {String(contactName).split(/\s+/).slice(0,1).map(s => s[0]).join("").toUpperCase() || "A"}
                  </Avatar>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Bubble side="left" time={lastSeen}>
                    {brandText}
                  </Bubble>
                </Box>
              </Box>

              {/* reply hint */}
              {showReplyHint && (
                <Box sx={{ px: 0.25, mt: 1 }}>
                  {/* <Divider sx={{ mb: 1 }} /> */}
                  <Paper
                    elevation={0}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 1,
                      py: 0.5,
                      borderRadius: 999,
                      border: `1px solid ${alpha(t.palette.text.primary, 0.06)}`,
                      bgcolor: alpha(t.palette.background.paper, 1),
                    }}
                  >
                    <InputBase
                      placeholder="Message"
                      fullWidth
                      inputProps={{ "aria-label": "reply" }}
                      sx={{
                        px: 0.5,
                        py: 0.5,
                        fontSize: 13,
                      }}
                      value=""
                      readOnly
                    />
                    <IconButton size="small" disabled aria-label="send">
                      <MessageSquare size={16} />
                    </IconButton>
                  </Paper>
                </Box>
              )}
            </Stack>
          </Paper>

          {/* small caption */}
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", mt: 0.25 }}>
            This is a preview. Real device rendering may vary.
          </Typography>
        </Stack>
      </Box>
    </DeviceFrame>
  );
}
