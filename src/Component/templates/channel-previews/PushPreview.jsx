// Path: src/Component/templates/channel-previews/PushPreview.jsx
import React from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import DeviceFrame from "./DeviceFrame";
import { Bell, ExternalLink, Phone as PhoneIcon, MoreHorizontal, X, Check } from "lucide-react";

/**
 * Push styles included:
 * - "banner" (heads-up banner)
 * - "inbox"  (OS inbox list item)
 * - "rich"   (expanded with image + CTA)
 * - "lock"   (lock screen compact)
 */
const STYLES = ["banner", "inbox", "rich", "lock"];

function normalizeMedia(input) {
  if (!input) return null;
  if (Array.isArray(input) && input.length) return normalizeMedia(input[0]);
  if (typeof input === "string") return { url: input, type: "image" };
  const url = input?.url || input?.image || input?.src || null;
  if (!url) return null;
  const lower = String(url).toLowerCase();
  const isVideo = /\.(mp4|webm|mov|mkv)(\?.*)?$/.test(lower) || lower.includes("video");
  return { url, type: isVideo ? "video" : "image", thumbnail: input?.thumbnail || input?.poster || null };
}

export default function PushPreview({
  variant,
  device = "mobile",
  orientation = "portrait",
  radius = 2,
  frameBorder = 12,
  frameRadius = 4,
  shadow = 0.9,
}) {
  const t = useTheme();
  const [mode, setMode] = React.useState("banner");

  const c = variant?.content || {};
  const title = c.title || "New message";
  const body = c.body || "Here is a push notification preview with sample text.";
  const buttons = Array.isArray(c.buttons) ? c.buttons : [];
  const media = normalizeMedia(c.media);

  const maxWrap = device === "mobile" ? 420 : device === "tablet" ? 560 : 680;

  const makeHref = (b) => {
    const tt = b?.action?.type;
    if (tt === "call") return b?.action?.phone ? `tel:${b.action.phone}` : "";
    if (tt === "link") return b?.action?.url || "";
    return "";
  };
  const isClickable = (b) => ["link", "call"].includes(b?.action?.type);

  // header/menu state
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const openMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  // header height constant for vertical alignment
  const HEADER_HEIGHT = 48;

  const MediaBlock = ({ m }) => {
    if (!m) return null;
    if (m.type === "video") {
      const poster = m.thumbnail || m.url;
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
          <Box component="img" src={poster} alt="video preview" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <Box sx={{ bgcolor: alpha(t.palette.common.black, 0.5), borderRadius: "50%", p: 1.25 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v18l15-9L5 3z" /></svg>
            </Box>
          </Box>
        </Box>
      );
    }

    return (
      <Box
        component="img"
        src={m.url}
        alt="image"
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

  return (
    <DeviceFrame
      device={device}
      orientation={orientation}
      frameBorder={frameBorder}
      frameRadius={frameRadius}
      shadow={shadow}
      addressBarText="Push Notification"
    >
      <Box
        sx={{
          p: { xs: 1.25, sm: 2 },
          bgcolor: alpha(t.palette.primary.main, 0.02),
          minHeight: "100%",
        }}
      >
        <Stack spacing={1} sx={{ maxWidth: maxWrap, mx: "auto", height: "100%" }}>
          {/* TOP TITLE — centered */}
          <Box sx={{ textAlign: "center", py: 0.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Push Preview
            </Typography>
          </Box>

          {/* Compact header row (icons / menu) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              height: HEADER_HEIGHT,
              minHeight: HEADER_HEIGHT,
            }}
          >
            <Bell size={18} />

            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              Current style:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, ml: 0.5 }}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Typography>

            <Box sx={{ flex: 1 }} />

            {/* three-dots menu: pick style */}
            <IconButton size="small" aria-label="more" onClick={openMenu}>
              <MoreHorizontal size={16} />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
              {STYLES.map((s) => (
                <MenuItem
                  key={s}
                  selected={s === mode}
                  onClick={() => {
                    setMode(s);
                    closeMenu();
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                    <Typography sx={{ textTransform: "capitalize", flex: 1 }}>{s}</Typography>
                    {s === mode && <Check size={16} />}
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Content area */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
            {/* BANNER: heads-up */}
            {mode === "banner" && (
              <Paper
                variant="outlined"
                sx={{
                  p: 1.25,
                  borderRadius: radius,
                  border: `1px solid ${alpha(t.palette.text.primary, 0.12)}`,
                  bgcolor: "background.paper",
                }}
              >
                {media ? <MediaBlock m={media} /> : null}
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {body}
                </Typography>
              </Paper>
            )}

            {/* INBOX: list item */}
            {mode === "inbox" && (
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: radius,
                  overflow: "hidden",
                  border: `1px solid ${alpha(t.palette.text.primary, 0.12)}`,
                  bgcolor: "background.paper",
                }}
              >
                <Box sx={{ p: 1.25 }}>
                  <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {body}
                  </Typography>
                </Box>
                <Box sx={{ height: 1, bgcolor: "divider" }} />
                <Box sx={{ p: 1.0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="text.secondary">
                    Other notifications…
                  </Typography>
                  <IconButton size="small" aria-label="dismiss">
                    <X size={14} />
                  </IconButton>
                </Box>
              </Paper>
            )}

            {/* RICH: image + CTA(s) */}
            {mode === "rich" && (
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: radius,
                  border: `1px solid ${alpha(t.palette.text.primary, 0.12)}`,
                  overflow: "hidden",
                  bgcolor: "background.paper",
                }}
              >
                {media ? <MediaBlock m={media} /> : (
                  <Box
                    sx={{
                      width: "100%",
                      height: 160,
                      bgcolor: alpha(t.palette.primary.main, 0.08),
                    }}
                  />
                )}
                <Box sx={{ p: 1.25 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {body}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 1 }}
                    useFlexGap
                    flexWrap="wrap"
                  >
                    {(buttons.length
                      ? buttons
                      : [{ id: "open", label: "Open", action: { type: "link", url: "#" } }]
                    ).map((b) => {
                      const href = makeHref(b);
                      const isCall = (b?.action?.type || "") === "call";
                      const canGo = isClickable(b) && !!href;
                      return (
                        <Button
                          key={b.id}
                          size="small"
                          variant="contained"
                          endIcon={
                            isCall ? <PhoneIcon size={14} /> : <ExternalLink size={14} />
                          }
                          href={canGo ? href : undefined}
                          target={canGo ? "_blank" : undefined}
                          rel={canGo ? "noreferrer" : undefined}
                          disabled={!canGo}
                          onClick={(e) => {
                            if (!canGo) e.preventDefault();
                          }}
                        >
                          {b.label || (isCall ? "Call" : "Open")}
                        </Button>
                      );
                    })}
                  </Stack>
                </Box>
              </Paper>
            )}

            {/* LOCK: compact lock screen */}
            {mode === "lock" && (
              <Paper
                variant="outlined"
                sx={{
                  p: 1.25,
                  borderRadius: radius,
                  border: `1px solid ${alpha(t.palette.text.primary, 0.12)}`,
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  9:41 AM
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {body}
                </Typography>
              </Paper>
            )}
          </Box>
        </Stack>
      </Box>
    </DeviceFrame>
  );
}
