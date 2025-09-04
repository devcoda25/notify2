// /src/Component/dailer/lead/NotificationViewDialog.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Stack, Typography, Chip, IconButton, Tooltip, Divider, Link, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid
} from "@mui/material";
import {
  Mail, Smartphone, X, MessageCircle, Bell, Monitor, Laptop, Tablet as TabletIcon,
  AlertTriangle, Info, Megaphone, Reply, Clock, ExternalLink, Bot,
  Image as ImageIcon, File as FileIcon, Video as VideoIcon, Music2
} from "lucide-react";

/* --- helpers --- */
const channelIcon = { email: Mail, sms: Smartphone, whatsapp: MessageCircle, push: Bell, inapp: Monitor };

const typeMeta = (t) => {
  const k = String(t || "").toLowerCase();
  if (k.includes("marketing") || k.includes("promo")) return { colorKey: "warning", label: "Marketing", Icon: Megaphone };
  if (k.includes("warning") || k.includes("alert"))   return { colorKey: "error",   label: "Warning",   Icon: AlertTriangle };
  if (k.includes("update"))                           return { colorKey: "info",    label: "Update",    Icon: Info };
  if (k.includes("survey")  || k.includes("feedback"))return { colorKey: "primary", label: "Survey",    Icon: Info };
  return { colorKey: "default", label: "Info", Icon: Info };
};

const statusChip = (s) => {
  const k = String(s || "").toLowerCase();
  if (["delivered","opened","click","clicked"].some(x => k.includes(x))) return { color: "success", variant: "outlined" };
  if (["bounced","failed","error"].some(x => k.includes(x)))             return { color: "error",   variant: "outlined" };
  if (["queued","sending","scheduled"].some(x => k.includes(x)))         return { color: "default", variant: "outlined" };
  return { color: "default", variant: "outlined" };
};

const deviceIcon = (d, channel) => {
  const k = String(d || (channel === "sms" ? "mobile" : "")).toLowerCase();
  if (k.includes("mobile") || k.includes("phone")) return Smartphone;
  if (k.includes("desktop")) return Laptop;
  if (k.includes("tablet") || k.includes("tab"))   return TabletIcon;
  return Monitor;
};

const classifyMedia = (m = {}) => {
  const name = (m.name || "").toLowerCase();
  const t = String(m.type || "").toLowerCase();
  const is = (exts) => exts.some((x) => name.endsWith("." + x) || t.includes(x));
  if (is(["png","jpg","jpeg","gif","webp","svg"])) return "image";
  if (is(["mp4","webm","ogg"]))                    return "video";
  if (is(["mp3","wav","ogg"]))                     return "audio";
  if (is(["pdf"]))                                 return "pdf";
  return "file";
};

const ThumbIcon = ({ kind, size = 14 }) => {
  if (kind === "image") return <ImageIcon size={size} />;
  if (kind === "video") return <VideoIcon  size={size} />;
  if (kind === "audio") return <Music2     size={size} />;
  if (kind === "pdf")   return <FileIcon   size={size} />;
  return <FileIcon size={size} />;
};

/* --- component --- */
export default function NotificationViewDialog({
  open, onClose, notification, preview, onTogglePreview
}) {
  // ❗ No early return before hooks
  const hasNotif = !!notification;

  // Derivatives guarded with optional chaining so we can return later safely
  const ChanIcon = channelIcon[notification?.channel] || Bell;
  const DevIcon  = deviceIcon(notification?.device, notification?.channel);
  const { colorKey, label: typeLabel, Icon: TypeIcon } = typeMeta(notification?.type);
  const sMeta = statusChip(notification?.status);
  const isBot = (notification?.sender?.type || "").toLowerCase() === "bot";
  const senderName = notification?.sender?.name || (isBot ? "System Bot" : "(Unknown)");

  // Stable media list
  const media = useMemo(
    () => (Array.isArray(notification?.media) ? notification.media : []),
    [notification]
  );

  // Selected media key (id or index fallback)
  const [selectedId, setSelectedId] = useState(null);

  // Seed selection when opened / preview changes
  useEffect(() => {
    if (!open || !hasNotif) return;
    const pid = preview?.id;
    if (pid) {
      setSelectedId(pid);
    } else if (media.length) {
      setSelectedId(media[0].id || "idx_0");
    } else {
      setSelectedId(null);
    }
  }, [open, hasNotif, preview, media]);

  // Resolve selected item
  const selectedItem = useMemo(() => {
    if (!media.length || !selectedId) return null;
    const idx = media.findIndex((m, i) => (m.id || `idx_${i}`) === selectedId);
    return idx >= 0 ? media[idx] : null;
  }, [media, selectedId]);

  // ✅ Now it's safe to exit if nothing to show
  if (!hasNotif) return null;

  // Inline right-pane media viewer
  const MediaViewer = ({ item }) => {
    if (!item?.url) {
      return <Typography variant="body2" color="text.secondary">No preview available.</Typography>;
    }
    const kind = classifyMedia(item);
    const src  = item.url;

    if (kind === "image") {
      return (
        <Box component="img" src={src} alt={item.name}
             sx={{ width: "100%", height: "auto", borderRadius: 1, display: "block" }} />
      );
    }
    if (kind === "video") {
      return (
        <video controls muted playsInline preload="metadata"
               style={{ width: "100%", borderRadius: 8, display: "block" }}>
          <source src={src} />
        </video>
      );
    }
    if (kind === "audio") {
      return (
        <audio controls muted preload="metadata" style={{ width: "100%", display: "block" }}>
          <source src={src} />
        </audio>
      );
    }
    if (kind === "pdf") {
      return (
        <Box sx={{ width: "100%", height: 420, borderRadius: 1, overflow: "hidden",
                   bgcolor: (t) => t.palette.background.default }}>
          <iframe title={item.name || "PDF"} src={src} style={{ width: "100%", height: "100%", border: 0 }} />
        </Box>
      );
    }
    return (
      <Stack alignItems="center" spacing={1}>
        <FileIcon size={20} />
        <Typography variant="body2" color="text.secondary">
          No inline preview for this file type.
        </Typography>
        <Button size="small" component={Link} href={src} target="_blank" rel="noreferrer"
                startIcon={<ExternalLink size={16} />}>
          Open
        </Button>
      </Stack>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ pr: 2 }}>
  <Stack direction="row" alignItems="center" justifyContent="space-between">
    <Stack direction="row" alignItems="center" spacing={1.25}>
      <ChanIcon size={18} />
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {notification?.title || "(no subject)"}
      </Typography>
      <Chip
        size="small"
        icon={<TypeIcon size={14} />}
        label={typeLabel}
        color={colorKey === "default" ? "default" : colorKey}
        sx={{ ml: 1 }}
      />
    </Stack>

    {/* close button */}
    <IconButton onClick={onClose} size="small">
      <X size={18} />
    </IconButton>
  </Stack>
</DialogTitle>

      <DialogContent dividers>
        {/* Meta row */}
        <Stack spacing={1.25} sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Clock size={14} />
              <Typography variant="caption" color="text.secondary">
                {notification?.at ? new Date(notification.at).toLocaleString() : ""}
              </Typography>
            </Stack>
            {notification?.status && (
              <>
                <Typography variant="caption">·</Typography>
                <Chip size="small" label={String(notification.status)} {...sMeta} />
              </>
            )}
            {notification?.noReply && (
              <>
                <Typography variant="caption">·</Typography>
                <Chip size="small" label="No-reply" variant="outlined" />
              </>
            )}
          </Stack>

          {/* Sender */}
          <Stack direction="row" alignItems="center" spacing={0.75}>
            {isBot ? (
              <Box sx={{
                width: 28, height: 28, borderRadius: "50%",
                display: "grid", placeItems: "center",
                bgcolor: (t) => t.palette.action.hover
              }}>
                <Bot size={16} />
              </Box>
            ) : (
              <Avatar src={notification?.sender?.avatar} alt={senderName} sx={{ width: 28, height: 28 }} />
            )}
            <Typography variant="body2">{senderName}</Typography>
          </Stack>

          {/* Device + Channel + UA */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              {React.createElement(DevIcon, { size: 14 })}
              <Typography variant="caption">
                {notification?.device || (notification?.channel === "sms" ? "mobile" : "device")}
              </Typography>
            </Stack>
            <Typography variant="caption">·</Typography>
            <Typography variant="caption">{(notification?.channel || "channel").toUpperCase()}</Typography>
            {notification?.userAgent && (
              <>
                <Typography variant="caption">·</Typography>
                <Tooltip title={notification.userAgent} arrow>
                  <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 360 }} noWrap>
                    {notification.userAgent}
                  </Typography>
                </Tooltip>
              </>
            )}
          </Stack>

          {!!(notification?.statusHistory?.length) && (
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
              {notification.statusHistory.map((e, i) => (
                <Chip
                  key={i}
                  size="small"
                  label={`${e.status}${e.at ? ` • ${new Date(e.at).toLocaleString()}` : ""}`}
                  variant="outlined"
                />
              ))}
            </Stack>
          )}
        </Stack>

        <Grid container spacing={2}>
          {/* LEFT: Full content + thread + metadata */}
          <Grid item xs={12} md={7}>
            {notification?.html ? (
              <Box
                sx={{
                  p: 1, borderRadius: 1.5,
                  bgcolor: (t) => t.palette.background.default,
                  "& a": { textDecoration: "underline" }
                }}
                dangerouslySetInnerHTML={{ __html: notification.html }}
              />
            ) : (
              notification?.text && (
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {notification.text}
                </Typography>
              )
            )}

            {!!(notification?.thread?.length) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Thread</Typography>
                <Stack spacing={0.75}>
                  {notification.thread.map((m) => {
                    const MIcon = channelIcon[m.channel] || Reply;
                    const isInbound = (m.direction || "").toLowerCase() === "inbound";
                    return (
                      <Stack
                        key={m.id}
                        direction="row"
                        spacing={0.75}
                        sx={{
                          alignSelf: isInbound ? "flex-start" : "flex-end",
                          maxWidth: { xs: "100%", sm: "85%" },
                          p: 1,
                          borderRadius: 1.5,
                          border: (t) => `1px solid ${t.palette.divider}`,
                          bgcolor: (t) => isInbound ? t.palette.action.hover : t.palette.background.default,
                        }}
                      >
                        <MIcon size={14} />
                        <Stack spacing={0.25}>
                          <Typography variant="caption" color="text.secondary">
                            {isInbound ? "Client" : "Us"} · {m.at ? new Date(m.at).toLocaleString() : ""}
                          </Typography>
                          {m.text && (
                            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                              {m.text}
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                    );
                  })}
                </Stack>
              </>
            )}

            {!!(notification?.meta && Object.keys(notification.meta).length) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Metadata</Typography>
                <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 1, rowGap: 0.75 }}>
                  {Object.entries(notification.meta).map(([k, v]) => (
                    <Chip key={k} size="small" label={`${k}: ${v}`} variant="outlined" />
                  ))}
                </Stack>
              </>
            )}
          </Grid>

          {/* RIGHT: Sticky media gallery */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: { md: "sticky" }, top: { md: 8 } }}>
              {media.length ? (
                <>
                  <Box sx={{ mb: 1.25 }}>
                    <MediaViewer item={selectedItem} />
                  </Box>

                  <Stack direction="row" spacing={0.75} flexWrap="wrap">
                    {media.map((m, i) => {
                      const kind   = classifyMedia(m);
                      const key    = m.id || `idx_${i}`;
                      const active = key === selectedId;
                      return (
                        <Stack
                          key={key}
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          onClick={() => {
                            setSelectedId(key);
                            onTogglePreview?.(notification.id, m);
                          }}
                          sx={{
                            px: 0.75, py: 0.5, borderRadius: 1,
                            border: (t) => `1px solid ${active ? t.palette.primary.main : t.palette.divider}`,
                            bgcolor: (t) => active ? t.palette.action.selected : t.palette.background.paper,
                            cursor: "pointer",
                          }}
                        >
                          <ThumbIcon kind={kind} size={14} />
                          <Typography variant="caption" noWrap sx={{ maxWidth: 140 }}>
                            {m.name || m.type || "Attachment"}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </>
              ) : (
                <Box sx={{
                  p: 2, borderRadius: 1,
                  border: (t) => `1px dashed ${t.palette.divider}`,
                  color: "text.secondary",
                }}>
                  <Typography variant="body2">No attachments.</Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        {notification?.url && (
          <Button
            component={Link}
            href={notification.url}
            target="_blank"
            rel="noreferrer"
            startIcon={<ExternalLink size={16} />}
          >
            Open original
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
