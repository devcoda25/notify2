// Path: src/Component/templates/channel-previews/PlatformPreview.jsx
import React from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  Slide,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import DeviceFrame from "./DeviceFrame";
import {
  MonitorSmartphone,
  X,
  ExternalLink,
  Phone as PhoneIcon,
  MoreHorizontal,
  Check,
} from "lucide-react";

/**
 * Platform preview: in-app messages
 * Styles:
 * - "modal"   (center modal)
 * - "banner"  (top banner)
 * - "toast"   (bottom-right toast)
 * - "sheet"   (compact bottom sheet)
 * - "instant" (Instant App / tall sheet that slides up)
 * - "card"    (inline card content)
 *
 * Props:
 * - variant: { channel:'platform', content:{ title, body, html?, buttons[], media? } }
 */
const STYLES = ["modal", "banner", "toast", "sheet", "instant", "card"];

function normalizeMedia(input) {
  if (!input) return null;
  if (Array.isArray(input) && input.length) return normalizeMedia(input[0]);
  if (typeof input === "string") return { url: input, type: "image" };
  const url = input?.url || input?.image || input?.src || null;
  if (!url) return null;
  const lower = String(url).toLowerCase();
  const isVideo = /\.(mp4|webm|mov|mkv)(\?.*)?$/.test(lower) || lower.includes("video");
  return {
    url,
    type: isVideo ? "video" : "image",
    thumbnail: input?.thumbnail || input?.poster || null,
  };
}

export default function PlatformPreview({
  variant,
  device = "desktop",
  orientation = "portrait",
  radius = 2,
  frameBorder = 12,
  frameRadius = 4,
  shadow = 0.9,
}) {
  const t = useTheme();
  const [mode, setMode] = React.useState("modal");

  const c = variant?.content || {};
  const title = c.title || "Heads up!";
  const body = c.body || "This is an in-app message preview showing how your content might appear.";
  const html = c.html || "";
  const media = normalizeMedia(c.media);

  const buttons = Array.isArray(c.buttons) ? c.buttons : [];
  const CTA = buttons.length ? buttons : [{ id: "open", label: "Open", action: { type: "link", url: "#" } }];

  const maxWrap = device === "mobile" ? 420 : device === "tablet" ? 680 : 960;

  const makeHref = (b) => {
    const tt = b?.action?.type;
    if (tt === "call") return b?.action?.phone ? `tel:${b.action.phone}` : "";
    if (tt === "link") return b?.action?.url || "";
    return "";
  };
  const isClickable = (b) => ["link", "call"].includes(b?.action?.type);

  // menu state for styles
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const openMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  // header constants
  const HEADER_HEIGHT = 48;

  const MediaBlock = ({ m }) => {
    if (!m) return null;
    if (m.type === "video") {
      const poster = m.thumbnail || m.url;
      return (
        <Box
          sx={{
            width: "100%",
            height: 220,
            borderRadius: radius,
            overflow: "hidden",
            position: "relative",
            bgcolor: alpha(t.palette.common.black, 0.04),
            border: `1px solid ${alpha(t.palette.text.primary, 0.08)}`,
            display: "block",
            boxSizing: "border-box",
          }}
        >
          <Box
            component="img"
            src={poster}
            alt="video preview"
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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
          display: "block",
          boxSizing: "border-box",
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
      addressBarText="MyApp • In-App Message"
    >
      <Box sx={{ p: { xs: 1.25, sm: 2 }, bgcolor: alpha(t.palette.primary.main, 0.02), minHeight: "100%" }}>
        <Stack spacing={1} sx={{ maxWidth: maxWrap, mx: "auto", height: "100%" }}>
          {/* TOP TITLE — centered */}
          <Box sx={{ textAlign: "center", py: 0.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              In-App (Platform) Preview
            </Typography>
          </Box>

          {/* header row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              height: HEADER_HEIGHT,
              minHeight: HEADER_HEIGHT,
            }}
          >
            <MonitorSmartphone size={18} />

            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              Current style:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, ml: 0.5 }}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Typography>

            <Box sx={{ flex: 1 }} />

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

          {/* Stage area (represents the app surface). IMPORTANT: overflow visible so variants aren't clipped */}
          <Box
            sx={{
              position: "relative",
              flex: 1,
              bgcolor: "background.default",
              borderRadius: 2,
              border: `1px dashed ${alpha(t.palette.text.primary, 0.15)}`,
              overflow: "visible", // allow shadows etc.
            }}
          >
            {/* MODAL — centered inside the stage, constrained and scrollable */}
            {mode === "modal" && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  p: 2,
                  zIndex: 10,
                  width: "min(92%, 720px)",
                  maxWidth: "calc(100% - 32px)",
                  maxHeight: "calc(100% - 48px)",
                  boxSizing: "border-box",
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    width: "100%",
                    maxHeight: "100%",
                    overflow: "auto",
                    borderRadius: radius,
                    boxSizing: "border-box",
                    border: `1px solid ${alpha(t.palette.text.primary, 0.12)}`,
                  }}
                >
                  {media ? <MediaBlock m={media} /> : null}
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>{title}</Typography>
                    <IconButton size="small" aria-label="close">
                      <X size={16} />
                    </IconButton>
                  </Stack>
                  {html ? (
                    <Box
                      sx={{
                        "& a": { color: "primary.main" },
                        "& h1, & h2, & h3": { mt: 1, mb: 1, fontWeight: 700 },
                        "& p": { my: 1 },
                      }}
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">{body}</Typography>
                  )}
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap">
                    {CTA.map((b) => {
                      const href = makeHref(b);
                      const isCall = (b?.action?.type || "") === "call";
                      const canGo = isClickable(b) && !!href;
                      return (
                        <Button
                          key={b.id}
                          variant="contained"
                          size="small"
                          endIcon={isCall ? <PhoneIcon size={14} /> : <ExternalLink size={14} />}
                          href={canGo ? href : undefined}
                          target={canGo ? "_blank" : undefined}
                          rel={canGo ? "noreferrer" : undefined}
                          disabled={!canGo}
                          onClick={(e) => { if (!canGo) e.preventDefault(); }}
                          sx={{ boxSizing: "border-box" }}
                        >
                          {b.label || (isCall ? "Call" : "Open")}
                        </Button>
                      );
                    })}
                  </Stack>
                </Paper>
              </Box>
            )}

            {/* BANNER — pinned to top, constrained width */}
            {mode === "banner" && (
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "min(92%, 720px)",
                  maxWidth: "calc(100% - 32px)",
                  zIndex: 6,
                  boxSizing: "border-box",
                }}
              >
                <Paper
                  sx={{
                    p: 1.25,
                    borderRadius: radius,
                    border: `1px solid ${alpha(t.palette.text.primary, 0.12)}`,
                    boxSizing: "border-box",
                    width: "100%",
                  }}
                >
                  {media ? <MediaBlock m={media} /> : null}
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{title}</Typography>
                  {html ? (
                    <Box sx={{ "& a": { color: "primary.main" } }} dangerouslySetInnerHTML={{ __html: html }} />
                  ) : (
                    <Typography variant="body2" color="text.secondary">{body}</Typography>
                  )}
                </Paper>
              </Box>
            )}

            {/* TOAST — bottom-right, constrained so it doesn't overshoot */}
            {mode === "toast" && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  width: "min(92%, 320px)",
                  maxWidth: "calc(100% - 24px)",
                  zIndex: 7,
                  boxSizing: "border-box",
                }}
              >
                <Paper
                  sx={{
                    p: 1.25,
                    borderRadius: radius,
                    border: `1px solid ${alpha(t.palette.text.primary, 0.12)}`,
                    boxSizing: "border-box",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  {media ? <MediaBlock m={media} /> : null}
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{title}</Typography>
                  {html ? (
                    <Box sx={{ "& a": { color: "primary.main" } }} dangerouslySetInnerHTML={{ __html: html }} />
                  ) : (
                    <Typography variant="body2" color="text.secondary">{body}</Typography>
                  )}
                </Paper>
              </Box>
            )}

            {/* SHEET — bottom sheet capped height */}
            {mode === "sheet" && (
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  bottom: 0,
                  width: "min(100%, 960px)",
                  maxWidth: "calc(100% - 16px)",
                  zIndex: 8,
                  boxSizing: "border-box",
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    borderTopLeftRadius: Math.max(radius, 12),
                    borderTopRightRadius: Math.max(radius, 12),
                    border: `1px solid ${alpha(t.palette.text.primary, 0.12)}`,
                    borderBottom: "none",
                    maxHeight: "60vh",
                    overflow: "auto",
                    boxSizing: "border-box",
                    width: "100%",
                  }}
                >
                  <Box sx={{ width: 48, height: 4, borderRadius: 2, bgcolor: "divider", mx: "auto", mb: 1 }} />
                  {media ? <Box sx={{ mb: 1 }}><MediaBlock m={media} /></Box> : null}
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{title}</Typography>
                  {html ? (
                    <Box sx={{ "& a": { color: "primary.main" } }} dangerouslySetInnerHTML={{ __html: html }} />
                  ) : (
                    <Typography variant="body2" color="text.secondary">{body}</Typography>
                  )}
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                    {CTA.map((b) => {
                      const href = makeHref(b);
                      const isCall = (b?.action?.type || "") === "call";
                      const canGo = isClickable(b) && !!href;
                      return (
                        <Button
                          key={b.id}
                          variant="contained"
                          size="small"
                          endIcon={isCall ? <PhoneIcon size={14} /> : <ExternalLink size={14} />}
                          href={canGo ? href : undefined}
                          target={canGo ? "_blank" : undefined}
                          rel={canGo ? "noreferrer" : undefined}
                          disabled={!canGo}
                          onClick={(e) => { if (!canGo) e.preventDefault(); }}
                          sx={{ boxSizing: "border-box" }}
                        >
                          {b.label || (isCall ? "Call" : "Open")}
                        </Button>
                      );
                    })}
                  </Stack>
                </Paper>
              </Box>
            )}

            {/* INSTANT — responsive bottom sheet with scroll inside */}
            {mode === "instant" && (
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "grid",
                  placeItems: "end",
                  zIndex: 9,
                  boxSizing: "border-box",
                }}
              >
                <Slide in direction="up" appear>
                  <Paper
                    sx={{
                      width: "100%",
                      height: { xs: "60vh", sm: "55vh", md: "48vh" },
                      maxWidth: "100%",
                      borderTopLeftRadius: Math.max(radius, 16),
                      borderTopRightRadius: Math.max(radius, 16),
                      overflow: "auto",
                      border: `1px solid ${alpha(t.palette.text.primary, 0.12)}`,
                      display: "flex",
                      flexDirection: "column",
                      boxSizing: "border-box",
                    }}
                  >
                    {media ? <MediaBlock m={media} /> : <Box sx={{ width: "100%", height: 10, bgcolor: "transparent" }} />}

                    <Box sx={{ width: 48, height: 4, borderRadius: 2, bgcolor: "divider", mx: "auto", mt: 1 }} />

                    <Box sx={{ p: 2, pt: 1.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{title}</Typography>
                      {html ? (
                        <Box
                          sx={{ "& a": { color: "primary.main" }, "& h1, & h2, & h3": { mt: 1, mb: 1, fontWeight: 700 }, "& p": { my: 1 } }}
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">{body}</Typography>
                      )}

                      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap">
                        {CTA.map((b) => {
                          const href = makeHref(b);
                          const isCall = (b?.action?.type || "") === "call";
                          const canGo = isClickable(b) && !!href;
                          return (
                            <Button
                              key={b.id}
                              variant="contained"
                              size="small"
                              endIcon={isCall ? <PhoneIcon size={14} /> : <ExternalLink size={14} />}
                              href={canGo ? href : undefined}
                              target={canGo ? "_blank" : undefined}
                              rel={canGo ? "noreferrer" : undefined}
                              disabled={!canGo}
                              onClick={(e) => { if (!canGo) e.preventDefault(); }}
                              sx={{ boxSizing: "border-box" }}
                            >
                              {b.label || (isCall ? "Call" : "Open")}
                            </Button>
                          );
                        })}
                      </Stack>
                    </Box>
                  </Paper>
                </Slide>
              </Box>
            )}

            {/* CARD — inline card */}
            {mode === "card" && (
              <Box sx={{ p: 2 }}>
                <Paper sx={{ p: 2, borderRadius: radius, border: `1px solid ${alpha(t.palette.text.primary, 0.12)}`, zIndex: 5, boxSizing: "border-box" }}>
                  {media ? <Box sx={{ mb: 1 }}><MediaBlock m={media} /></Box> : null}
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{title}</Typography>
                  {html ? (
                    <Box sx={{ "& a": { color: "primary.main" } }} dangerouslySetInnerHTML={{ __html: html }} />
                  ) : (
                    <Typography variant="body2" color="text.secondary">{body}</Typography>
                  )}
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                    {CTA.map((b) => {
                      const href = makeHref(b);
                      const isCall = (b?.action?.type || "") === "call";
                      const canGo = isClickable(b) && !!href;
                      return (
                        <Button
                          key={b.id}
                          variant="contained"
                          size="small"
                          endIcon={isCall ? <PhoneIcon size={14} /> : <ExternalLink size={14} />}
                          href={canGo ? href : undefined}
                          target={canGo ? "_blank" : undefined}
                          rel={canGo ? "noreferrer" : undefined}
                          disabled={!canGo}
                          onClick={(e) => { if (!canGo) e.preventDefault(); }}
                          sx={{ boxSizing: "border-box" }}
                        >
                          {b.label || (isCall ? "Call" : "Open")}
                        </Button>
                      );
                    })}
                  </Stack>
                </Paper>
              </Box>
            )}
          </Box>
        </Stack>
      </Box>
    </DeviceFrame>
  );
}
