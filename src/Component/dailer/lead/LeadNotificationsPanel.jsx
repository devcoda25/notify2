import React, { useMemo, useState } from "react";
import {
  Box, Stack, Typography, Chip, IconButton, Tooltip, Divider, Pagination, Link, Avatar
} from "@mui/material";
import {
  Mail, Smartphone, MessageCircle, Bell, Monitor, Laptop, Tablet as TabletIcon,
  AlertTriangle, Info, Megaphone, Clock, Bot, Eye
} from "lucide-react";
import NotificationViewDialog from "./NotificationViewDialog";

/* helpers */
const channelIcon = { email: Mail, sms: Smartphone, whatsapp: MessageCircle, push: Bell, inapp: Monitor };
const typeMeta = (t) => {
  const k = String(t || "").toLowerCase();
  if (k.includes("marketing") || k.includes("promo")) return { colorKey: "warning", label: "Marketing", Icon: Megaphone };
  if (k.includes("warning") || k.includes("alert")) return { colorKey: "error", label: "Warning", Icon: AlertTriangle };
  if (k.includes("update")) return { colorKey: "info", label: "Update", Icon: Info };
  if (k.includes("survey") || k.includes("feedback")) return { colorKey: "primary", label: "Survey", Icon: Info };
  return { colorKey: "default", label: "Info", Icon: Info };
};
const statusChip = (s) => {
  const k = String(s || "").toLowerCase();
  if (["delivered", "opened", "click", "clicked"].some(x => k.includes(x))) return { color: "success", variant: "outlined" };
  if (["bounced", "failed", "error"].some(x => k.includes(x))) return { color: "error", variant: "outlined" };
  if (["queued", "sending", "scheduled"].some(x => k.includes(x))) return { color: "default", variant: "outlined" };
  return { color: "default", variant: "outlined" };
};
const deviceIcon = (d, channel) => {
  const k = String(d || (channel === "sms" ? "mobile" : "")).toLowerCase();
  if (k.includes("mobile") || k.includes("phone")) return Smartphone;
  if (k.includes("desktop")) return Laptop;
  if (k.includes("tablet") || k.includes("tab")) return TabletIcon;
  return Monitor;
};
const classifyMedia = (m = {}) => {
  const name = (m.name || "").toLowerCase();
  const t = String(m.type || "").toLowerCase();
  const is = (exts) => exts.some((x) => name.endsWith("." + x) || t.includes(x));
  if (is(["png", "jpg", "jpeg", "gif", "webp", "svg"])) return "image";
  if (is(["mp4", "webm", "ogg"])) return "video";
  if (is(["mp3", "wav", "ogg"])) return "audio";
  if (is(["pdf"])) return "pdf";
  return "file";
};
const truncate = (s, n = 180) => (!s ? "" : (s.length > n ? s.slice(0, n - 1) + "…" : s));
const build = (lead) => [...(Array.isArray(lead?.notifications) ? lead.notifications : [])]
  .sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));

/* component */
export default function LeadNotificationsPanel({ lead, embedded = false, pageSize = 4 }) {
  const data = useMemo(() => build(lead), [lead]);

  // pagination (3 per page by default)
  const [page, setPage] = useState(1);
  const PER = Math.max(1, pageSize);
  const pages = Math.max(1, Math.ceil(data.length / PER));
  const items = useMemo(
    () => data.slice((page - 1) * PER, (page - 1) * PER + PER),
    [data, page, PER]
  );

  // inline preview state per notification
  const [previewMap, setPreviewMap] = useState({});
  const togglePreview = (id, media) =>
    setPreviewMap((prev) => ({ ...prev, [id]: prev[id]?.id === media.id ? null : media }));

  // full-view dialog
  const [viewId, setViewId] = useState(null);
  const viewed = useMemo(() => data.find(n => n.id === viewId) || null, [viewId, data]);

  const Wrapper = ({ children }) =>
    embedded ? (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
        {/* inner scroller to keep it contained */}
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>{children}</Box>
      </Box>
    ) : (
      <Box sx={{ p: 2 }}>{children}</Box>
    );

  return (
    <Wrapper>
      {!data.length && (
        <Typography variant="body2" color="text.secondary">No notifications yet.</Typography>
      )}

      <Stack spacing={1}>
        {items.map(n => {
          const ChanIcon = channelIcon[n.channel] || Bell;
          const { colorKey, label: typeLabel, Icon: TypeIcon } = typeMeta(n.type);
          const sMeta = statusChip(n.status);
          const DevIcon = deviceIcon(n.device, n.channel);
          const isBot = (n?.sender?.type || "").toLowerCase() === "bot";
          const senderName = n?.sender?.name || (isBot ? "System Bot" : "(Unknown)");
          const accent = (t) => colorKey === "default"
            ? t.palette.divider
            : (t.palette?.[colorKey]?.main || t.palette.primary.main);
          const preview = previewMap[n.id];

          return (
            <Box
              key={n.id}
              sx={{
                p: 1.25, pl: 1.75, borderRadius: 1,
                border: (t) => `1px solid ${t.palette.divider}`,
                bgcolor: (t) => t.palette.background.paper,
                boxShadow: (t) => `inset 4px 0 0 0 ${accent(t)}`,
              }}
            >
              {/* header row */}
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                  <ChanIcon size={16} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap title={n.title || "(no subject)"}>
                    {n.title || "(no subject)"}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Clock size={14} />
                    <Typography variant="caption" color="text.secondary">
                      {n.at ? new Date(n.at).toLocaleString() : ""}
                    </Typography>
                  </Stack>
                  {n.status && <Chip size="small" label={String(n.status)} {...sMeta} />}
                  {n.noReply && <Chip size="small" label="No-reply" variant="outlined" />}

                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    {isBot ? (
                      <Box sx={{
                        width: 22, height: 22, borderRadius: "50%", display: "grid", placeItems: "center",
                        bgcolor: (t) => t.palette.action.hover
                      }}>
                        <Bot size={13} />
                      </Box>
                    ) : (
                      <Avatar src={n?.sender?.avatar} alt={senderName} sx={{ width: 22, height: 22 }} />
                    )}
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 140 }} title={senderName}>
                      {senderName}
                    </Typography>
                  </Stack>

                  <Tooltip title="View full notification" arrow>
                    <IconButton size="small" onClick={() => setViewId(n.id)}>
                      <Eye size={16} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              {/* context row */}
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={0.5} sx={{ mt: 0.5 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    {React.createElement(DevIcon, { size: 14 })}
                    <Typography variant="caption">
                      {n.device || (n.channel === "sms" ? "mobile" : "device")}
                    </Typography>
                  </Stack>
                  <Typography variant="caption">·</Typography>
                  <Typography variant="caption">{(n.channel || "channel").toUpperCase()}</Typography>
                  {n.userAgent && (
                    <>
                      <Typography variant="caption">·</Typography>
                      <Tooltip title={n.userAgent} arrow>
                        <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 240 }} noWrap>
                          {n.userAgent}
                        </Typography>
                      </Tooltip>
                    </>
                  )}
                </Stack>
              </Stack>

              {(n.text || (n.media && n.media.length)) && <Divider sx={{ my: 0.75 }} />}

              {n.text && (
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {truncate(n.text)}
                </Typography>
              )}

              {/* inline media preview */}
              {preview && (
                <Box sx={{
                  mt: 0.75, p: 1, borderRadius: 1.25,
                  border: (t) => `1px dashed ${t.palette.divider}`,
                  bgcolor: (t) => t.palette.action.hover
                }}>
                  {(() => {
                    const kind = classifyMedia(preview);
                    const src = preview.url;
                    if (!src) return <Typography variant="body2" color="text.secondary">Preview not available.</Typography>;
                    if (kind === "image") return <Box component="img" src={src} alt={preview.name} sx={{ maxWidth: "100%", borderRadius: 1 }} />;
                    if (kind === "video") return <video controls style={{ width: "100%", borderRadius: 6 }}><source src={src} /></video>;
                    if (kind === "audio") return <audio controls style={{ width: "100%" }}><source src={src} /></audio>;
                    if (kind === "pdf") return <Box sx={{ width: "100%", height: 320, borderRadius: 1, overflow: "hidden" }}>
                      <iframe title={preview.name || "PDF"} src={src} style={{ width: "100%", height: "100%", border: 0 }} />
                    </Box>;
                    return <Typography variant="body2" color="text.secondary">No inline preview for this file type.</Typography>;
                  })()}
                </Box>
              )}

              {/* footer row */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: 0.75 }}
              >
                <Chip
                  size="small"
                  icon={<TypeIcon size={14} />}
                  label={typeLabel}
                  color={colorKey === "default" ? "default" : colorKey}
                  variant="filled"
                />
                {!!(n.media?.length) && (
                  <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.5 }}>
                    {n.media.map((m, i) => (
                      <Chip
                        key={m.id || i}
                        size="small"
                        label={m.name || m.type || "Attachment"}
                        onClick={() => togglePreview(n.id, m)}
                        clickable
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                )}
              </Stack>

            </Box>
          );
        })}

        {data.length > PER && (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 0.5 }}>
            <Pagination
              count={pages}
              page={page}
              size="small"
              onChange={(_, v) => setPage(v)}
              siblingCount={0}
            />
          </Box>
        )}
      </Stack>

      {/* full viewer */}
      <NotificationViewDialog
        open={!!viewId}
        onClose={() => setViewId(null)}
        notification={viewed}
        preview={viewed ? previewMap[viewed.id] : null}
        onTogglePreview={togglePreview}
      />
    </Wrapper>
  );
}
