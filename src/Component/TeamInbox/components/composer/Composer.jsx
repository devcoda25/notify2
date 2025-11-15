// src/TeamInbox/components/composer/Composer.jsx
// Presentational WATI-like composer: outer (attachments + sender tools) and inner (rich editor).
// No stores/WS. All data via props.

import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  CalendarClock,
  ChevronDown,
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  X,
} from "lucide-react";

import {
  RichHtmlArea,
  toolbarConfigForChannel,
  VariableDialog,
} from "./EditorPieces";
import AttachmentsManager from "./AttachmentsManager";

// Cards data (defaults) — single source of truth
import {
  CHANNEL_CARDS as DEFAULT_CHANNELS,
  TEMPLATE_CARDS as DEFAULT_TEMPLATES,
  QUICK_REPLY_CARDS as DEFAULT_QR,
  BOT_CARDS as DEFAULT_BOTS,
} from "../../constants/SENDER_CHOICES";

/** Types (doc only)
 * ChannelCard: { id:string, title:string, description:string, tags:string[], badge?, Icon? }
 * TemplateCard / QuickReplyCard / BotCard: same shape { id,title,description,tags,badge? }
 * Attachment: { id, name, size, type, file?, url?, previewUrl? }
 */

export default function Composer({
  valueHtml,
  onChangeHtml,
  canSend,
  sendNow,
  isSending = false,
  disabled = false,

  // Menus data (fallback to constants if not provided)
  channels = DEFAULT_CHANNELS,
  currentChannelId,
  onChangeChannel,

  templates = DEFAULT_TEMPLATES,
  onPickTemplate,

  replyMaterials = DEFAULT_QR,
  onPickReplyMaterial,

  bots = DEFAULT_BOTS,
  onPickBot,

  // Attachments (controlled by parent)
  attachments = [],
  onChangeAttachments,
  attachmentsTitle = "Attachments",

  // Scheduling
  allowSchedule = true,
  upcomingPresets = [],

  // Variables mini-modal
  variableKeys = [],

  // Private toggle (left side)
  isPrivate = true,
  onTogglePrivate,

  // NEW: mentions — only members of the current room
  roomMembers = [], // [{ id, displayName, role, avatarUrl, availability }]
}) {
  const isDisabled = disabled || isSending;

  // ----- Menus & dialogs -----
  const [anchorBots, setAnchorBots] = useState(null);
  const [anchorQR, setAnchorQR] = useState(null);
  const [anchorTemplate, setAnchorTemplate] = useState(null);
  const [anchorChannel, setAnchorChannel] = useState(null);
  const [anchorSubmit, setAnchorSubmit] = useState(null);

  const openBots = Boolean(anchorBots);
  const openQR = Boolean(anchorQR);
  const openTemplate = Boolean(anchorTemplate);
  const openChannel = Boolean(anchorChannel);
  const openSubmit = Boolean(anchorSubmit);

  const [attachOpen, setAttachOpen] = useState(false);
  const [varsOpen, setVarsOpen] = useState(false);

  // Track dialog upload-in-flight to disable the button
  const [uploading, setUploading] = useState(false);
  const attachMgrRef = useRef(null);

  // ----- Derived channel & toolbar -----
  const channel = useMemo(
    () => channels.find((c) => c.id === currentChannelId) || channels[0],
    [channels, currentChannelId]
  );

  const ChannelGlyph = useMemo(() => iconForChannelId(channel?.id), [channel?.id]);
  const channelLabel = useMemo(() => labelForChannelId(channel?.id), [channel?.id]);
  const tcfg = toolbarConfigForChannel(channel?.id || "inapp");

  // Editor ref so we can insert variables
  const editorRef = useRef(null);

  // ----- Handlers -----
  const chooseBot = (b) => {
    setAnchorBots(null);
    onPickBot?.(b.id);
  };
  const chooseQR = (rm) => {
    setAnchorQR(null);
    onPickReplyMaterial?.(rm.id);
  };
  const chooseTemplate = (tpl) => {
    setAnchorTemplate(null);
    onPickTemplate?.(tpl.id);
  };
  const chooseChannel = (id) => {
    setAnchorChannel(null);
    onChangeChannel?.(id);
  };

  const submitNow = () => sendNow?.({ scheduleAt: null });
  const submitWithPreset = (opt) => {
    setAnchorSubmit(null);
    if (opt) sendNow?.({ scheduleAt: opt.scheduleAt });
  };

  const removeAttachmentById = (id) => {
    if (!onChangeAttachments) return;
    onChangeAttachments((attachments || []).filter((a) => a.id !== id));
  };

  const onInsertVariable = (key /*, sample */) => {
    const token = `{{${String(key || "").trim()}}}`;
    editorRef.current?.insertText?.(token);
    setVarsOpen(false);
  };

  // ----- UI -----
  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      {/* ====== TOP: attachments preview (outer box) ====== */}
      {attachments?.length > 0 && (
        <Box sx={{ px: 1.25, pt: 1 }}>
          <CondensedAttachmentsTray
            title={attachmentsTitle}
            items={attachments}
            onRemove={removeAttachmentById}
            onOpenManager={() => setAttachOpen(true)}
          />
        </Box>
      )}

      {/* ====== EDITOR (inner box) ====== */}
      <Box sx={{ px: 1.25, py: 1 }}>
        {/* RichHtmlArea governs height & internal scrolling per spec */}
        <RichHtmlArea
          ref={editorRef}
          value={valueHtml}
          onChangeHtml={onChangeHtml}
          toolbarConfig={[...tcfg, "codeblock", "attach", "vars", "mention" /* NEW */]}
          onVars={() => setVarsOpen(true)}
          onAttach={() => setAttachOpen(true)}
          // NEW: supply members list for @ mentions
          membersForMentions={roomMembers}
          minRows={5}
          maxRows={10}
        />
      </Box>

      {/* ====== SENDER TOOLS (WATI-like row under editor) ====== */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ px: 1.25, pt: 0.75, pb: 0.75 }}
      >
        {/* Private toggle (left) */}
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={!!isPrivate}
              onChange={(e) => onTogglePrivate?.(e.target.checked)}
            />
          }
          label={<Typography variant="caption">Private</Typography>}
          sx={{ mr: 1.5 }}
        />

        {/* Bots */}
        <Tooltip title="Bots">
          <Chip
            variant="outlined"
            onClick={(e) => setAnchorBots(e.currentTarget)}
            label="Bots"
            deleteIcon={<ChevronDown size={16} />}
            sx={{ borderRadius: 2, px: 0.75, py: 0.5 }}
          />
        </Tooltip>

        {/* Quick Replies */}
        <Tooltip title="Quick Replies">
          <Chip
            variant="outlined"
            disabled={replyMaterials.length === 0}
            onClick={(e) => setAnchorQR(e.currentTarget)}
            label="Quick Replies"
            deleteIcon={<ChevronDown size={16} />}
            sx={{ borderRadius: 2, px: 0.75, py: 0.5 }}
          />
        </Tooltip>

        {/* Templates */}
        <Tooltip title="Templates">
          <Chip
            variant="outlined"
            disabled={templates.length === 0}
            onClick={(e) => setAnchorTemplate(e.currentTarget)}
            label="Templates"
            deleteIcon={<ChevronDown size={16} />}
            sx={{ borderRadius: 2, px: 0.75, py: 0.5 }}
          />
        </Tooltip>

        {/* Channel chip (shows current) */}
        <Tooltip title="Channel">
          <Chip
            variant="outlined"
            onClick={(e) => setAnchorChannel(e.currentTarget)}
            icon={<Box sx={{ width: 18, height: 18, display: "grid", placeItems: "center" }}>{ChannelGlyph}</Box>}
            label={
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {channelLabel}
                </Typography>
              </Stack>
            }
            deleteIcon={<ChevronDown size={16} />}
            sx={{ borderRadius: 2, px: 0.75, py: 0.5 }}
          />
        </Tooltip>

        <Box sx={{ flex: 1 }} />

        {/* Submit (primary, with dropdown) */}
        <Tooltip title={canSend && !isDisabled ? "Submit" : "Unavailable"}>
          <span>
            <Button
              variant="contained"
              endIcon={<ChevronDown size={16} />}
              onClick={(e) => (canSend && !isDisabled ? setAnchorSubmit(e.currentTarget) : undefined)}
              disabled={!canSend || isDisabled}
              sx={{ minWidth: 112, borderRadius: 2 }}
            >
              Submit
            </Button>
          </span>
        </Tooltip>
      </Stack>

      {/* ====== MENUS (card-style) ====== */}
      {/* Bots */}
      <Menu
        anchorEl={anchorBots}
        open={openBots}
        onClose={() => setAnchorBots(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{ sx: { p: 1.25, maxWidth: 560 } }}
      >
        {(bots || []).length ? (
          bots.map((b) => (
            <OptionCard
              key={b.id}
              title={b.title || b.name}
              description={b.description}
              tags={b.tags}
              badge={b.badge}
              onSelect={() => chooseBot(b)}
              sx={{ mb: 1 }}
            />
          ))
        ) : (
          <EmptyItem text="No bots" />
        )}
      </Menu>

      {/* Quick Replies */}
      <Menu
        anchorEl={anchorQR}
        open={openQR}
        onClose={() => setAnchorQR(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{ sx: { p: 1.25, maxWidth: 560 } }}
      >
        {(replyMaterials || []).length ? (
          replyMaterials.map((rm) => (
            <OptionCard
              key={rm.id}
              title={rm.title || rm.name}
              description={rm.description || rm.preview}
              tags={rm.tags}
              badge={rm.badge}
              onSelect={() => chooseQR(rm)}
              sx={{ mb: 1 }}
            />
          ))
        ) : (
          <EmptyItem text="No quick replies" />
        )}
      </Menu>

      {/* Templates */}
      <Menu
        anchorEl={anchorTemplate}
        open={openTemplate}
        onClose={() => setAnchorTemplate(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{ sx: { p: 1.25, maxWidth: 560 } }}
      >
        {(templates || []).length ? (
          templates.map((tpl) => (
            <OptionCard
              key={tpl.id}
              title={tpl.title || tpl.name}
              description={tpl.description || tpl.preview}
              tags={tpl.tags}
              badge={tpl.badge}
              onSelect={() => chooseTemplate(tpl)}
              sx={{ mb: 1 }}
            />
          ))
        ) : (
          <EmptyItem text="No templates" />
        )}
      </Menu>

      {/* Channel */}
      <Menu
        anchorEl={anchorChannel}
        open={openChannel}
        onClose={() => setAnchorChannel(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{ sx: { p: 1.25, maxWidth: 560 } }}
      >
        {(channels || []).length ? (
          channels.map((c) => (
            <OptionCard
              key={c.id}
              selected={c.id === channel?.id}
              title={c.title || labelForChannelId(c.id)}
              description={c.description}
              tags={c.tags}
              badge={c.badge}
              onSelect={() => chooseChannel(c.id)}
              sx={{ mb: 1 }}
            />
          ))
        ) : (
          <EmptyItem text="No channels" />
        )}
      </Menu>

      {/* Submit menu: top item = “Send now”, below = schedule presets if allowed */}
      <Menu
        anchorEl={anchorSubmit}
        open={openSubmit}
        onClose={() => setAnchorSubmit(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MenuItemLike onClick={submitNow} icon={<Send size={16} />} text="Send now" />
        {allowSchedule &&
          (upcomingPresets && upcomingPresets.length > 0
            ? upcomingPresets
            : defaultPresets()
          ).map((opt) => (
            <MenuItemLike
              key={opt.id}
              onClick={() => submitWithPreset(opt)}
              icon={<CalendarClock size={16} />}
              text={opt.label}
            />
          ))}
      </Menu>

      {/* ====== DIALOGS ====== */}
      {/* Variables mini modal */}
      <VariableDialog
        open={varsOpen}
        onClose={() => setVarsOpen(false)}
        onSave={onInsertVariable}
        variableKeys={variableKeys}
      />

      {/* Attachments manager */}
      <Dialog open={attachOpen} onClose={() => setAttachOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Upload attachments</DialogTitle>
        <DialogContent dividers>
          <AttachmentsManager
            ref={attachMgrRef}
            value={attachments}
            onCommit={(next) => onChangeAttachments?.(next)}
            // If you have a real uploader, pass it as onUpload={yourAsyncUploader}
            title={attachmentsTitle}
            accept="*/*"
            maxCount={30}
            maxTotalMB={5120}
            showTitleChip
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            disabled={uploading}
            onClick={async () => {
              if (!attachMgrRef.current?.uploadAndCommit) return setAttachOpen(false);
              try {
                setUploading(true);
                const next = await attachMgrRef.current.uploadAndCommit();
                onChangeAttachments?.(next);
                setAttachOpen(false);
              } finally {
                setUploading(false);
              }
            }}
          >
            Upload
          </Button>
          <Button onClick={() => setAttachOpen(false)} disabled={uploading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* ---------------- Small parts ---------------- */

function MenuItemLike({ onClick, icon, text }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 1.5,
        py: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
        cursor: "pointer",
        "&:hover": { bgcolor: (t) => t.palette.action.hover },
      }}
    >
      {icon}
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
}

function iconForChannelId(id, size = 16) {
  if (id === "email") return <Mail size={size} />;
  if (id === "sms") return <Smartphone size={size} />;
  if (id === "waba") return <MessageSquare size={size} />;
  if (id === "inapp") return <MessageSquare size={size} />;
  return <MessageSquare size={size} />;
}

function labelForChannelId(id) {
  if (!id) return "Channel";
  const map = { email: "Email", sms: "SMS", waba: "WhatsApp", inapp: "In-App", voice: "Voice", push: "Push" };
  return map[id] || id.charAt(0).toUpperCase() + id.slice(1);
}

function defaultPresets() {
  const addHours = (h) => new Date(Date.now() + h * 3600e3).toISOString();
  const tomorrowAt = (hour, minute = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };
  return [
    { id: "in-1h", label: "In 1 hour", scheduleAt: addHours(1) },
    { id: "tomorrow-9", label: "Tomorrow 09:00", scheduleAt: tomorrowAt(9) },
  ];
}

/** Compact preview chips above the editor */
function CondensedAttachmentsTray({ title, items = [], onRemove, onOpenManager }) {
  return (
    <Paper variant="outlined" sx={{ p: 1, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {title} ({items.length})
        </Typography>
        <Box flex={1} />
        <Button size="small" onClick={onOpenManager}>Manage</Button>
      </Stack>
      <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap" }}>
        {items.map((a) => (
          <Chip
            key={a.id}
            size="small"
            label={a.name || "Attachment"}
            onDelete={() => onRemove?.(a.id)}
            deleteIcon={<X size={14} />}
            variant="outlined"
            sx={{
              maxWidth: 220,
              "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
            }}
          />
        ))}
      </Stack>
    </Paper>
  );
}

/** Card-like option used in menus */
function OptionCard({ selected = false, title, description, tags = [], badge, onSelect, sx }) {
  return (
    <Paper
      onClick={onSelect}
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        cursor: "pointer",
        outline: selected ? (t) => `2px solid ${t.palette.primary.main}` : "none",
        bgcolor: selected ? (t) => t.palette.primary.main + "0D" : "background.paper",
        "&:hover": { boxShadow: 1 },
        ...sx,
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 18, height: 18, borderRadius: "50%",
              border: (t) => `2px solid ${selected ? t.palette.primary.main : t.palette.text.disabled}`,
              display: "grid", placeItems: "center",
            }}
          >
            {selected && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main" }} />}
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
            {title}
          </Typography>

          {badge?.kind === "icon" && badge.Icon && <badge.Icon size={18} />}
          {badge?.kind === "chip" && (
            <Box
              sx={{
                fontSize: 11, px: 1, py: 0.25, borderRadius: 1,
                bgcolor: (t) =>
                  badge.tone === "success" ? t.palette.success.light :
                  badge.tone === "info" ? t.palette.info.light :
                  badge.tone === "warning" ? t.palette.warning.light :
                  t.palette.action.hover,
                color: "text.primary",
              }}
            >
              {badge.label}
            </Box>
          )}
        </Stack>

        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}

        {!!tags.length && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {tags.map((t) => (
              <Box
                key={t}
                sx={{ fontSize: 12, px: 1, py: 0.25, borderRadius: 1, bgcolor: (th) => th.palette.action.hover }}
              >
                {t}
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

function EmptyItem({ text }) {
  return (
    <Box sx={{ px: 1.5, py: 1, color: "text.secondary" }}>
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
}
