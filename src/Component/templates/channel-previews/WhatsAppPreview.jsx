// Path: src/Component/templates/channel-previews/WhatsAppPreview.jsx
import React from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import DeviceFrame from "./DeviceFrame";
import {
  ExternalLink,
  Phone as PhoneIcon,
  MoreHorizontal,
  Play,
  ChevronLeft,
} from "lucide-react";

/**
 * WhatsApp preview — actions rendered as stacked white cards (WhatsApp style)
 *
 * Props:
 * - variant: { channel:'whatsapp', content:{ header?, body?, footer?, buttons?, media?, fromName?, fromNumber?, time?, showUserReply? } }
 * - device, orientation, radius, frameBorder, frameRadius, shadow
 *
 * NOTE: preserves `radius` exactly as provided by caller.
 */
export default function WhatsAppPreview({
  variant,
  device = "mobile",
  orientation = "portrait",
  radius = 1.5,
  frameBorder = 12,
  frameRadius = 6,
  shadow = 0.9,
}) {
  const t = useTheme();
  const c = variant?.content || {};

  const headerText = c.header || "";
  const body = (c.body || "").trim() || "Hello {{user_name}}, this is how your WhatsApp template will appear.";
  const footer = c.footer || "";
  const buttons = Array.isArray(c.buttons) ? c.buttons : [];

  const media = (() => {
    if (!c.media) return null;
    if (typeof c.media === "string") return { url: c.media, type: "image" };
    const url = c.media?.url || c.media?.image || c.media?.src;
    if (!url) return null;
    const lower = String(url).toLowerCase();
    if (/\.(mp4|webm|mov|mkv)(\?.*)?$/.test(lower) || lower.includes("video")) return { url, type: "video" };
    return { url, type: "image" };
  })();

  const fromName = c.fromName || "Acme Store";
  const fromNumber = c.fromNumber || "+1 ••• ••• •01";
  const time = c.time || "now";

  const maxWrap = device === "mobile" ? 420 : device === "tablet" ? 560 : 640;

  // Partition actions (we treat all buttons same visually here)
  const actions = Array.isArray(buttons) ? buttons : [];

  const makeHref = (b) => {
    const t = b?.action?.type;
    if (t === "call") return b?.action?.phone ? `tel:${b.action.phone}` : "";
    if (t === "link") return b?.action?.url || "";
    return "";
  };

  // Media renderer (unchanged)
  const MediaPreview = ({ m }) => {
    if (!m) return null;
    if (m.type === "video") {
      return (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            borderRadius: radius,
            overflow: "hidden",
            border: `1px solid ${alpha(t.palette.text.primary, 0.08)}`,
            height: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: alpha(t.palette.common.black, 0.04),
          }}
        >
          <Box
            component="img"
            src={m.thumbnail || m.url}
            alt="video preview"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <Box sx={{ bgcolor: alpha(t.palette.common.black, 0.5), borderRadius: "50%", p: 1.25 }}>
              <Play size={18} color="#fff" />
            </Box>
          </Box>
        </Box>
      );
    }

    // image
    return (
      <Box
        component="img"
        src={m.url}
        alt="media"
        sx={{
          width: "100%",
          height: 220,
          objectFit: "cover",
          borderRadius: radius,
          border: `1px solid ${alpha(t.palette.text.primary, 0.08)}`,
        }}
      />
    );
  };

  // The incoming bubble contains the text + stacked white action cards (WhatsApp style)
  const IncomingBubble = ({ children, ts, actionsInside = [] }) => {
    const bubbleBg = "#DCF8C6"; // green
    const borderColor = alpha("#000", 0.06);

    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Box sx={{ width: 40, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: alpha(t.palette.success.main, 0.12),
              color: t.palette.success.main,
              fontSize: 13,
            }}
          >
            {String(fromName || "A").split(/\s+/).map(s => s[0]).slice(0, 2).join("").toUpperCase() || "A"}
          </Avatar>
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
          {/* green bubble (text + optional media) */}
          <Box
            sx={{
              maxWidth: "88%",
              px: 1.5,
              py: 1,
              borderRadius: radius,
              borderTopLeftRadius: radius * 0.9,
              background: bubbleBg,
              color: t.palette.text.primary,
              border: `1px solid ${borderColor}`,
              boxShadow: `0 1px 0 ${alpha(t.palette.common.black, 0.02)}`,
              wordBreak: "break-word",
            }}
          >
            {/* text */}
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.45 }}>
              {children}
            </Typography>

            {/* If there are inline actions but you want them visually attached to the message
                render a thin divider and then the stacked white cards */}
            {actionsInside.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {/* divider line like WhatsApp */}
                <Box sx={{ height: 1, bgcolor: alpha(t.palette.text.primary, 0.04), borderRadius: 1, mb: 0.75 }} />

                <Stack spacing={0.75}>
                  {actionsInside.map((a, i) => {
                    const href = makeHref(a);
                    const isCall = (a?.action?.type || "") === "call";

                    return (
                      <Box
                        key={a.id || `act-${i}`}
                        component="a"
                        href={href || undefined}
                        target={href ? "_blank" : undefined}
                        rel={href ? "noreferrer" : undefined}
                        onClick={(e) => { if (!href) e.preventDefault(); }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                          px: 1.25,
                          py: 0.9,
                          borderRadius: Math.max(6, radius),
                          bgcolor: "common.white",
                          border: `1px solid ${alpha(t.palette.text.primary, 0.08)}`,
                          boxShadow: `0 1px 0 ${alpha(t.palette.common.black, 0.02)}`,
                          textDecoration: "none",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <ChevronLeft size={16} style={{ color: t.palette.success.main }} />
                          <Typography sx={{ color: t.palette.success.main, fontWeight: 700, fontSize: 14 }}>
                            {a.label || a.text || "Option"}
                          </Typography>
                        </Box>

                        {/* optional right-side icon for link */}
                        {!isCall && <ExternalLink size={14} color={t.palette.text.primary} />}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            )}
          </Box>

          {ts && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              {ts}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  const OutgoingBubble = ({ children, ts }) => (
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
      <Box sx={{ flex: "0 0 auto", maxWidth: "82%" }}>
        <Box
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: radius,
            borderTopRightRadius: radius * 0.9,
            background: t.palette.primary.main,
            color: "#fff",
            border: `1px solid ${alpha(t.palette.primary.dark, 0.16)}`,
            boxShadow: `0 1px 0 ${alpha(t.palette.common.black, 0.04)}`,
            wordBreak: "break-word",
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.45 }}>
            {children}
          </Typography>
        </Box>
        {ts && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, textAlign: "right" }}>
            {ts}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <DeviceFrame
      device={device}
      orientation={orientation}
      frameBorder={frameBorder}
      frameRadius={frameRadius}
      shadow={shadow}
      addressBarText="WhatsApp"
    >
      <Box sx={{ p: { xs: 1.25, sm: 2 }, bgcolor: alpha(t.palette.primary.main, 0.02), minHeight: "100%" }}>
        <Stack spacing={1} sx={{ maxWidth: maxWrap, mx: "auto" }}>
          {/* header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 0.5,
              py: 0.5,
            }}
          >
            <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(t.palette.success.main, 0.12), color: t.palette.success.main }}>
              {String(fromName || "A").split(/\s+/).map(s => s[0]).slice(0,2).join("").toUpperCase()}
            </Avatar>

            <Box sx={{ minWidth: 0, overflow: "hidden" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {fromName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                {fromNumber} · {time}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }} />

            <IconButton size="small" aria-label="call" sx={{ mr: 0.5 }}>
              <PhoneIcon size={16} />
            </IconButton>
            <IconButton size="small" aria-label="more">
              <MoreHorizontal size={16} />
            </IconButton>
          </Box>

          {/* surface */}
          <Paper
            variant="outlined"
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: `1px solid ${alpha(t.palette.text.primary, 0.06)}`,
            }}
          >
            <Stack spacing={1.25}>
              {/* optional header block */}
              {headerText ? (
                <Box sx={{
                  p: 1,
                  borderRadius: 1.5,
                  bgcolor: alpha(t.palette.text.primary, 0.04),
                  border: `1px solid ${alpha(t.palette.text.primary, 0.06)}`,
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{headerText}</Typography>
                </Box>
              ) : null}

              {/* optional media */}
              {media ? <MediaPreview m={media} /> : null}

              {/* incoming body with actions rendered as stacked white cards (WhatsApp style) */}
              <IncomingBubble ts={time} actionsInside={actions} >
                {body}
              </IncomingBubble>

              {/* optionally show a user reply bubble to the right */}
              {variant?.content?.showUserReply && (
                <OutgoingBubble ts="Just now">
                  Thanks — looking forward to it!
                </OutgoingBubble>
              )}

              {/* footer */}
              {footer ? (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {footer}
                </Typography>
              ) : null}
            </Stack>
          </Paper>

          <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
            Preview approximation — WhatsApp rendering may vary by device/client.
          </Typography>
        </Stack>
      </Box>
    </DeviceFrame>
  );
}
