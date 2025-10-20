// Path: /src/Component/Meetings/live/views.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box, Stack, Paper, Typography, Chip, IconButton,
  Drawer, List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction,
  ToggleButtonGroup, ToggleButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, Avatar, ButtonBase, Tooltip, TextField,
  Tabs, Tab, InputAdornment,
} from "@mui/material";
import MuiMenu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import MuiListItemIcon from "@mui/material/ListItemIcon";
import MuiListItemText from "@mui/material/ListItemText";
import { useTheme, alpha } from "@mui/material/styles";

import {
  Tv, X, MessageSquare, Users, Timer as TimerIcon,
  Mic, MicOff, Video as Cam, VideoOff, Square, Play, Pause, Check, Mail, Phone, Send, UserPlus, ChevronDown, LayoutGrid, Hash,
  User,
} from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { ParticipantTile } from "./tiles";

/* --------------------------- Header bar --------------------------- */

export default function HeaderBar({
  isImmersive = true,
  state = "idle", // "live" | "paused" | "idle"
  title = "Meeting title",
  roomId,
  host,

  viewMode = "stage",
  setViewMode = () => { },

  onOpenChat,
  onOpenRoster,
  onOpenInvite,

  meetingSeconds = 0,
  recordSeconds = 0,
  recordState = "idle", // "idle" | "recording" | "paused"
  onPause = () => { },
  onResume = () => { },
  onStop = () => { },
}) {
  const theme = useTheme();

  // flash “Saved” when recordState transitions -> idle
  const prevRef = useRef(recordState);
  const [savedFlash, setSavedFlash] = useState(false);
  useEffect(() => {
    if (prevRef.current !== "idle" && recordState === "idle") {
      setSavedFlash(true);
      const t = setTimeout(() => setSavedFlash(false), 2200);
      return () => clearTimeout(t);
    }
    prevRef.current = recordState;
  }, [recordState]);

  // action acknowledgements (pause/resume/stop)
  const ackRef = useRef(null);
  const [actionAck, setActionAck] = useState(null);
  const showAck = (label, color = "info") => {
    setActionAck({ label, color });
    clearTimeout(ackRef.current);
    ackRef.current = setTimeout(() => setActionAck(null), 1800);
  };
  const handlePause = () => { onPause?.(); showAck("Paused", "warning"); };
  const handleResume = () => { onResume?.(); showAck("Resumed", "info"); };
  const handleStop = () => { onStop?.(); showAck("Stopped", "default"); };

  const recColor =
    recordState === "recording"
      ? theme.palette.error.main
      : recordState === "paused"
        ? theme.palette.warning.main
        : theme.palette.text.secondary;

  const fmt = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    const mm = String(m).padStart(2, "0");
    const ss = String(sec).padStart(2, "0");
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  };

  const isLive = state === "live" || state === "paused";

  const roundIconBtnSx = {
    width: 36,
    height: 36,
    p: 0,
    borderRadius: 999,
    border: `1px solid ${theme.palette.divider}`,
    bgcolor: alpha(theme.palette.background.paper, 0.85),
    "&:hover": { bgcolor: alpha(theme.palette.background.paper, 1) },
  };

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 0, // normalize stacking
        px: isImmersive ? { xs: 1.5, md: 2 } : 0,
        py: isImmersive ? 1 : 0,
        ...(isImmersive && {
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          bgcolor: "background.paper",
        }),
        display: "grid",
        gridTemplateColumns: "1fr minmax(460px,auto) auto auto", // Title | Combined | View | Actions
        alignItems: "center",
        columnGap: 12,
      }}
    >
      {/* 1) TITLE */}
      <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0, justifySelf: "start" }}>
        <Tv size={22} />
        <Typography variant="h6" fontWeight={800} noWrap title={title}>
          {title}
        </Typography>
      </Stack>

      {/* 2) COMBINED: Room + Host + Timers (one polished pill) */}
      {isLive ? (
        <Paper
          elevation={0}
          sx={{
            justifySelf: "center",
            borderRadius: 999,
            px: 1.5,
            py: 0.65,
            border: (t) => `1px solid ${t.palette.divider}`,
            bgcolor: (t) => alpha(t.palette.background.paper, 0.9),
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            pointerEvents: "auto",
          }}
          aria-live="polite"
        >
          {/* Room */}
          {roomId && (
            <Chip
              size="small"
              variant="outlined"
              sx={{ "& .MuiChip-label": { display: "flex", alignItems: "center", gap: 6 } }}
              label={
                <>
                  <Hash size={14} />
                  <Typography variant="caption" fontWeight={800}>Room</Typography>
                  <Typography variant="caption">{roomId}</Typography>
                </>
              }
            />
          )}

          {/* Separator */}
          <Box sx={{ width: 4, height: 4, borderRadius: 999, bgcolor: "text.disabled" }} />

          {/* Host */}
          {host && (
            <Chip
              size="small"
              color="info"
              sx={{
                "& .MuiChip-label": { display: "flex", alignItems: "center", gap: 6 },
              }}
              label={
                <>
                  <User size={14} />
                  <Typography variant="caption" fontWeight={800}>Host</Typography>
                  <Typography variant="caption">{host}</Typography>
                </>
              }
            />
          )}

          {/* Separator */}
          <Box sx={{ width: 4, height: 4, borderRadius: 999, bgcolor: "text.disabled" }} />

          {/* Meeting timer */}
          <Chip
            size="small"
            variant="outlined"
            sx={{ "& .MuiChip-label": { display: "flex", alignItems: "center", gap: 6 } }}
            label={
              <>
                <TimerIcon size={14} />
                <Typography variant="caption" fontWeight={800}>Meeting</Typography>
                <Typography variant="caption">{fmt(meetingSeconds)}</Typography>
              </>
            }
          />

          {/* Separator */}
          <Box sx={{ width: 4, height: 4, borderRadius: 999, bgcolor: "text.disabled" }} />

          {/* Recording status + time + controls + acks */}
          <Stack direction="row" alignItems="center" gap={0.75}>
            {/* pulsing dot */}
            <Box
              sx={{
                position: "relative",
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: recColor,
                ...(recordState === "recording" && {
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: `2px solid ${recColor}`,
                    animation: "recPulse 1.25s ease-out infinite",
                  },
                  "@keyframes recPulse": {
                    "0%": { transform: "scale(1)", opacity: 0.6 },
                    "70%": { transform: "scale(1.9)", opacity: 0 },
                    "100%": { transform: "scale(1.9)", opacity: 0 },
                  },
                }),
              }}
              aria-label={
                recordState === "recording"
                  ? "Recording"
                  : recordState === "paused"
                    ? "Paused"
                    : "Not recording"
              }
            />
            <Typography
              variant="caption"
              fontWeight={800}
              sx={{ color: recColor }}
              title={
                recordState === "recording"
                  ? "Recording"
                  : recordState === "paused"
                    ? "Paused"
                    : "Not recording"
              }
            >
              {recordState === "recording" ? "Recording" : recordState === "paused" ? "Paused" : "Not recording"}
            </Typography>
            <Typography variant="caption" sx={{ color: recColor, minWidth: 64, textAlign: "left" }}>
              {recordState === "idle" ? "" : fmt(recordSeconds)}
            </Typography>

            {recordState === "recording" && (
              <>
                <Tooltip title="Pause recording">
                  <IconButton size="small" onClick={handlePause} aria-label="Pause recording">
                    <Pause size={14} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Stop recording">
                  <IconButton size="small" onClick={handleStop} aria-label="Stop recording">
                    <Square size={12} />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {recordState === "paused" && (
              <>
                <Tooltip title="Resume recording">
                  <IconButton size="small" onClick={handleResume} aria-label="Resume recording">
                    <Play size={14} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Stop recording">
                  <IconButton size="small" onClick={handleStop} aria-label="Stop recording">
                    <Square size={12} />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {savedFlash && (
              <Chip size="small" color="success" icon={<Check size={14} />} label="Saved" sx={{ ml: 0.5 }} />
            )}
            {actionAck && (
              <Chip size="small" color={actionAck.color} label={actionAck.label} sx={{ ml: 0.5 }} />
            )}
          </Stack>
        </Paper>
      ) : (
        <Box />
      )}

      {/* 3) VIEW TOGGLES (taller segmented pill) */}
      <Box sx={{ justifySelf: "center" }}>
        {isLive && (
          <ToggleButtonGroup
            exclusive
            value={viewMode}
            onChange={(_, v) => v && setViewMode(v)}
            size="small"
            sx={{
              borderRadius: 999,
              overflow: "hidden",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
              bgcolor: alpha(theme.palette.primary.main, 0.06),
              "& .MuiToggleButton-root": {
                px: 1.4,
                py: 0.6,              // bump height
                minHeight: 36,        // ensure height matches other controls
                fontWeight: 700,
                textTransform: "none",
                color: theme.palette.primary.main,
                border: "none",
              },
              "& .Mui-selected": {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": { bgcolor: theme.palette.primary.dark },
              },
            }}
          >
            <ToggleButton value="stage" aria-label="Stage view">
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Tv size={14} /> <span>Stage</span>
              </Stack>
            </ToggleButton>
            <ToggleButton value="grid" aria-label="Grid view">
              <Stack direction="row" alignItems="center" gap={0.5}>
                <LayoutGrid size={14} /> <span>Grid</span>
              </Stack>
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      {/* 4) ACTIONS (round, far right; raised to avoid stray overlays) */}
      <Stack
        direction="row"
        gap={0.75}
        alignItems="center"
        sx={{ justifySelf: "end", position: "relative", zIndex: 1, pointerEvents: "auto" }}
      >
        <Tooltip title="Open chat">
          <IconButton onClick={onOpenChat} aria-label="Open chat" sx={roundIconBtnSx}>
            <MessageSquare size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Open people">
          <IconButton onClick={onOpenRoster} aria-label="Open people" sx={roundIconBtnSx}>
            <Users size={18} />
          </IconButton>
        </Tooltip>
        {!!onOpenInvite && (
          <Tooltip title="Invite participant">
            <IconButton onClick={onOpenInvite} aria-label="Invite participant" sx={roundIconBtnSx}>
              <UserPlus size={18} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
}


/* ------------------------------ Chat drawer ------------------------------ */
function linkify(text) {
  if (!text) return null;
  const parts = String(text).split(/(\s+)/);
  return parts.map((part, i) => {
    const urlMatch = part.match(/^((https?:\/\/)|www\.)[^\s]+$/i);
    if (urlMatch) {
      const href = part.startsWith("http") ? part : `https://${part}`;
      return (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

const URL_RE = /((https?:\/\/|www\.)[^\s]+)/i;
const normalizeUrl = (u) => (u?.startsWith("http") ? u : `https://${u}`);
const domainOf = (u) => {
  try { return new URL(normalizeUrl(u)).hostname.replace(/^www\./, ""); } catch { return u; }
};

function LinkPreviewInline({ url, meta }) {
  if (!url) return null;
  const full = normalizeUrl(url);
  const site = meta?.siteName || domainOf(full);

  return (
    <Paper variant="outlined" sx={{ mt: 0.75, borderRadius: 1.5, overflow: "hidden", bgcolor: (t) => alpha(t.palette.primary.main, 0.03) }}>
      {meta?.image && (
        <Box component="img" src={meta.image} alt="" loading="lazy" sx={{ display: "block", width: "100%", height: 140, objectFit: "cover" }} />
      )}
      <Box sx={{ p: 1 }}>
        <Typography variant="subtitle2" noWrap title={meta?.title || full}>
          {meta?.title || full}
        </Typography>
        {meta?.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }} noWrap title={meta.description}>
            {meta.description}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
          {site}
        </Typography>
      </Box>
    </Paper>
  );
}

function DraftPreview({ value }) {
  if (!value?.trim()) return null;
  const lines = value.split(/\r?\n/);
  const blocks = [];
  let i = 0, key = 0;

  const isBullet = (l) => /^\s*[-*]\s+/.test(l);
  const isNumber = (l) => /^\s*\d+\.\s+/.test(l);

  while (i < lines.length) {
    const line = lines[i];

    if (isBullet(line)) {
      const items = [];
      while (i < lines.length && isBullet(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={`ul-${key++}`} style={{ margin: "0 0 .5rem .9rem", padding: 0, listStylePosition: "inside" }}>
          {items.map((t, idx) => <li key={idx}>{linkify(t)}</li>)}
        </ul>
      );
      continue;
    }

    if (isNumber(line)) {
      const items = [];
      while (i < lines.length && isNumber(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={`ol-${key++}`} style={{ margin: "0 0 .5rem .9rem", padding: 0, listStylePosition: "inside" }}>
          {items.map((t, idx) => <li key={idx}>{linkify(t)}</li>)}
        </ol>
      );
      continue;
    }

    const buff = [];
    while (i < lines.length && !isBullet(lines[i]) && !isNumber(lines[i]) && lines[i].trim() !== "") {
      buff.push(lines[i]); i++;
    }
    if (buff.length) {
      blocks.push(
        <Typography key={`p-${key++}`} variant="body2" sx={{ mb: 0.5, whiteSpace: "pre-wrap" }}>
          {linkify(buff.join("\n"))}
        </Typography>
      );
    }
    if (i < lines.length && lines[i].trim() === "") i++;
  }

  return (
    <Paper variant="outlined" sx={{ mb: 1, p: 1.25, borderRadius: 2, bgcolor: (t) => alpha(t.palette.primary.main, 0.04) }}>
      <Typography variant="caption" fontWeight={700} sx={{ display: "block", mb: 0.75 }}>
        Preview
      </Typography>
      <Box>{blocks}</Box>
    </Paper>
  );
}

export function ChatDrawer({
  open, onClose, messages = [], draft, setDraft, onSend,
  selfName = "You",
  linkPreviewMap = {},
}) {
  const canSend = !!draft?.trim();
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const asciiOnly = (s) => (s || "").replace(/[^\x00-\x7F]/g, "");
  const handleChange = (e) => setDraft(asciiOnly(e.target.value));
  const handlePaste = (e) => {
    if (!e.clipboardData) return;
    e.preventDefault();
    const text = asciiOnly(e.clipboardData.getData("text/plain"));
    const target = e.target;
    const start = target.selectionStart ?? draft.length;
    const end = target.selectionEnd ?? draft.length;
    const next = asciiOnly(draft.slice(0, start) + text + draft.slice(end));
    setDraft(next);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 340, sm: 380 }, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper", p: 2, pb: 1, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight={700}>Chat</Typography>
          </Stack>
        </Box>

        {/* Messages */}
        <Box ref={listRef} sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          <Stack gap={1.25}>
            {messages.map((m, i) => {
              const isMe =
                m?.isYou === true ||
                (m?.from && selfName && m.from === selfName) ||
                /^you$/i.test(m?.from || "");

              const bubbleSx = isMe
                ? { bgcolor: (t) => alpha(t.palette.primary.main, 0.12), border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.35)}` }
                : { bgcolor: (t) => alpha(t.palette.primary.main, 0.06) };

              const match = (m.text || "").match(URL_RE);
              const firstUrl = match?.[1];
              const meta = firstUrl ? linkPreviewMap[normalizeUrl(firstUrl)] || linkPreviewMap[firstUrl] : null;

              return (
                <Stack key={i} direction="row" gap={1} alignItems="flex-start" justifyContent={isMe ? "flex-end" : "flex-start"}>
                  {!isMe && <Avatar sx={{ width: 28, height: 28 }}>{m.from?.[0] || "?"}</Avatar>}

                  <Paper variant="outlined" sx={{ p: 1, borderRadius: 2, maxWidth: "75%", wordBreak: "break-word", ...bubbleSx }}>
                    <Typography variant="caption" fontWeight={700} sx={{ display: "block", mb: 0.25, textAlign: "left" }}>
                      {m.from || (isMe ? selfName : "User")}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                      {linkify(m.text)}
                    </Typography>
                    {firstUrl && <LinkPreviewInline url={firstUrl} meta={meta} />}
                  </Paper>

                  {isMe && <Avatar sx={{ width: 28, height: 28 }}>{(selfName || "Y")?.[0]}</Avatar>}
                </Stack>
              );
            })}
          </Stack>
        </Box>

        {/* Composer */}
        <Box sx={{ p: 1.25, borderTop: (t) => `1px solid ${t.palette.divider}`, bgcolor: "background.paper" }}>
          <DraftPreview value={draft} />
          <Box sx={{ position: "relative" }}>
            <TextField
              fullWidth
              placeholder="Write a message…"
              value={draft}
              multiline
              minRows={5}
              maxRows={10}
              onChange={handleChange}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (canSend) onSend(); }
              }}
              sx={{ "& .MuiInputBase-root": { pr: 7 } }}
            />
            <Tooltip title={canSend ? "Send" : "Type a message"}>
              <span>
                <IconButton
                  onClick={onSend}
                  disabled={!canSend}
                  aria-label="Send message"
                  sx={{
                    position: "absolute",
                    right: 6,
                    bottom: 6,
                    zIndex: 1,
                    borderRadius: "12px",
                    border: (t) => `1px solid ${t.palette.divider}`,
                    bgcolor: "background.paper",
                  }}
                >
                  <Send size={18} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Enter to send • Shift+Enter for new line • Non-ASCII characters are removed
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

/* ------------------------------ Roster drawer ------------------------------ */
function statusChip(p, theme) {
  const s = (p.status || "").toLowerCase();
  if (s === "speaking") {
    return <Chip size="small" label="Speaking" sx={{ bgcolor: alpha(theme.palette.success.main, 0.12), color: theme.palette.success.main, fontWeight: 700 }} />;
  }
  if (s === "paused") {
    return <Chip size="small" label="Paused" sx={{ bgcolor: alpha(theme.palette.warning.main, 0.12), color: theme.palette.warning.main, fontWeight: 700 }} />;
  }
  if (p.muted || s === "muted") {
    return <Chip size="small" label="Muted" sx={{ bgcolor: alpha(theme.palette.error.main, 0.12), color: theme.palette.error.main, fontWeight: 700 }} />;
  }
  return <Chip size="small" label="Active" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.12), color: theme.palette.primary.main, fontWeight: 700 }} />;
}

export function RosterDrawer({
  open, onClose,
  participants = [],
  role,
  waiting = [],
  admit = () => { },
  reject = () => { },
  onToggleMic = () => { },
  onToggleCam = () => { },
}) {
  const theme = useTheme();

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 360, sm: 400 }, height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper", p: 2, pb: 1, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight={700}>People</Typography>
            <Tooltip title="Close">
              <IconButton size="large" onClick={onClose} aria-label="Close people list"><X size={22} /></IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Box sx={{ p: 2, pt: 2 }}>
            <List dense>
              {participants.map((p, i) => (
                <ListItem key={i} sx={{ alignItems: "center" }}>
                  <ListItemAvatar><Avatar>{p.name?.[0] || "?"}</Avatar></ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
                        <Typography noWrap>{p.name}{p.isYou ? " (you)" : ""}</Typography>
                        {statusChip(p, theme)}
                      </Stack>
                    }
                    secondary={`${p.camOff ? "Cam off" : "Cam on"} • ${p.muted ? "Muted" : "Mic on"}`}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title={p.muted ? "Unmute" : "Mute"}>
                      <IconButton size="small" onClick={() => onToggleMic(p, i)} sx={{ mr: 0.5 }} aria-label={p.muted ? "Unmute" : "Mute"}>
                        {p.muted ? <MicOff size={16} /> : <Mic size={16} />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={p.camOff ? "Turn camera on" : "Turn camera off"}>
                      <IconButton size="small" onClick={() => onToggleCam(p, i)} aria-label={p.camOff ? "Turn camera on" : "Turn camera off"}>
                        {p.camOff ? <VideoOff size={16} /> : <Cam size={16} />}
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>

          {role === "host" && (
            <Box sx={{ p: 2, pt: 0 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Lobby</Typography>
              {waiting.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No one waiting.</Typography>
              ) : (
                <List dense>
                  {waiting.map((name) => (
                    <ListItem key={name}>
                      <ListItemAvatar><Avatar>{name[0]}</Avatar></ListItemAvatar>
                      <ListItemText primary={name} />
                      <ListItemSecondaryAction>
                        <Tooltip title="Admit">
                          <IconButton size="small" color="primary" onClick={() => admit(name)} aria-label={`Admit ${name}`}><span><Check size={16} /></span></IconButton>
                        </Tooltip>
                        <Tooltip title="Remove">
                          <IconButton size="small" color="error" onClick={() => reject(name)} aria-label={`Remove ${name}`}><span><X size={16} /></span></IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}

/* ------------------------------ Invite drawer ------------------------------ */
const COUNTRIES = [
  { iso: "UG", dial: "+256", label: "Uganda" },
  { iso: "KE", dial: "+254", label: "Kenya" },
  { iso: "TZ", dial: "+255", label: "Tanzania" },
  { iso: "RW", dial: "+250", label: "Rwanda" },
  { iso: "BI", dial: "+257", label: "Burundi" },
  { iso: "CD", dial: "+243", label: "DR Congo" },
  { iso: "US", dial: "+1", label: "United States" },
  { iso: "GB", dial: "+44", label: "United Kingdom" },
  { iso: "IN", dial: "+91", label: "India" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const flag = (iso) => {
  try { return iso.toUpperCase().replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt())); }
  catch { return "🏳️"; }
};

export function InviteDrawer({
  open,
  onClose,
  onInviteEmail = (payload) => console.log("invite email", payload),
  onInvitePhone = (payload) => console.log("invite phone", payload),
}) {
  const [tab, setTab] = useState(0); // 0=email, 1=phone
  const [name, setName] = useState("");

  // email
  const [email, setEmail] = useState("");
  const emailValid = useMemo(() => (email ? EMAIL_RE.test(email) : false), [email]);

  // phone
  const [countryIso, setCountryIso] = useState("UG");
  const [nationalPhone, setNationalPhone] = useState("");
  const parsedPhone = useMemo(() => {
    if (!nationalPhone) return null;
    try {
      const p = parsePhoneNumberFromString(nationalPhone, countryIso);
      return p && p.isValid() ? p : null;
    } catch { return null; }
  }, [nationalPhone, countryIso]);
  const e164 = parsedPhone ? parsedPhone.format("E.164") : "";
  const phoneValid = !!parsedPhone;

  const canSend = tab === 0 ? emailValid : phoneValid;

  const [anchorEl, setAnchorEl] = useState(null);
  const current = COUNTRIES.find((c) => c.iso === countryIso) || COUNTRIES[0];

  const handleSend = () => {
    if (!canSend) return;
    if (tab === 0) onInviteEmail({ name: name.trim(), email: email.trim() });
    else onInvitePhone({ name: name.trim(), phone: e164 });
    setName(""); setEmail(""); setNationalPhone(""); onClose?.();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 360, sm: 400 }, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper", p: 2, pb: 1, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight={700}>Invite participant</Typography>
          </Stack>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 1 }}>
            <Tab icon={<Mail size={14} />} iconPosition="start" label="Email" />
            <Tab icon={<Phone size={14} />} iconPosition="start" label="Phone" />
          </Tabs>
        </Box>

        {/* Body */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          <Stack gap={1.25}>
            <TextField label="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            {tab === 0 ? (
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!email && !emailValid}
                helperText={email && !emailValid ? "Enter a valid email" : " "}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Mail size={16} /></InputAdornment>,
                }}
              />
            ) : (
              <TextField
                label="Phone"
                value={nationalPhone}
                onChange={(e) => setNationalPhone(e.target.value)}
                error={!!nationalPhone && !phoneValid}
                helperText={
                  nationalPhone
                    ? phoneValid ? `Will send to ${e164}` : `Enter a valid number for ${countryIso}`
                    : "Enter number without country code; we’ll add it"
                }
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: 0.5 }}>
                      <Button
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        variant="text"
                        size="small"
                        sx={{
                          minWidth: "unset",
                          px: 0.75,
                          gap: 0.5,
                          borderRight: (t) => `1px solid ${t.palette.divider}`,
                          borderRadius: 0,
                          height: 30,
                        }}
                      >
                        <span style={{ fontSize: 18, lineHeight: 1 }}>{flag(current.iso)}</span>
                        <Typography variant="body2" sx={{ ml: 0.5 }}>{current.dial}</Typography>
                        <ChevronDown size={16} />
                      </Button>
                      <Phone size={16} style={{ marginLeft: 8 }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 1.25, borderTop: (t) => `1px solid ${t.palette.divider}`, bgcolor: "background.paper" }}>
          <Stack direction="row" gap={1} justifyContent="flex-end">
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSend} disabled={!canSend}>Send invite</Button>
          </Stack>
        </Box>
      </Box>

      {/* Country menu */}
      <MuiMenu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)} keepMounted>
        {COUNTRIES.map((c) => (
          <MuiMenuItem key={c.iso} onClick={() => { setCountryIso(c.iso); setAnchorEl(null); }}>
            <MuiListItemIcon sx={{ minWidth: 28 }}>
              <span style={{ fontSize: 18 }}>{flag(c.iso)}</span>
            </MuiListItemIcon>
            <MuiListItemText
              primary={c.label}
              secondary={`${c.dial}  •  ${c.iso}`}
              primaryTypographyProps={{ variant: "body2" }}
              secondaryTypographyProps={{ variant: "caption" }}
            />
          </MuiMenuItem>
        ))}
      </MuiMenu>
    </Drawer>
  );
}

