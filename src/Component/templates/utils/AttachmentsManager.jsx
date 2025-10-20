// Path: src/Component/templates/utils/AttachmentsManager.jsx
import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Grid,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Paperclip,
  Trash2,
  Plus,
  Download,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Video,
  Music2,
  FileText,
  FileArchive,
} from "lucide-react";

/**
 * Attachment shape:
 * {
 *   id: string,
 *   name: string,
 *   size: number,
 *   type: string,
 *   file?: File,
 *   url?: string,
 *   previewUrl?: string,
 * }
 */

const isImage = (m = {}) => /^image\//.test(m.type || "");
const isVideo = (m = {}) => /^video\//.test(m.type || "");
const isAudio = (m = {}) => /^audio\//.test(m.type || "");
const isPdf   = (m = {}) => (m.type || "").includes("pdf");
const isArchive = (m = {}) => /(zip|rar|7z|tar|gz)/i.test(m.type || m.name || "");

const iconForType = (att = {}) => {
  if (isImage(att)) return ImageIcon;
  if (isVideo(att)) return Video;
  if (isAudio(att)) return Music2;
  if (isPdf(att)) return FileText;
  if (isArchive(att)) return FileArchive;
  return FileText;
};

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function AttachmentsManager({
  value = [],
  onChange,
  accept = "image/*,application/pdf,video/*,audio/*",
  maxSizeMB = 10,
  maxCount = 10,
  title = "Attachments",
  layout = "grid",
  tileAspect = "4 / 3",
  showTitleChip = true,
  allowReorder = true,
  allowDownload = true,
}) {
  const inputRef = React.useRef(null);
  const dropRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      (value || []).forEach((att) => {
        if (att.previewUrl?.startsWith("blob:")) {
          try { URL.revokeObjectURL(att.previewUrl); } catch {}
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const withPreview = (att) => {
    if (att.previewUrl) return att;
    if (att.file && (isImage(att) || isVideo(att))) {
      try {
        return { ...att, previewUrl: URL.createObjectURL(att.file) };
      } catch {}
    }
    return att;
  };

  const clampToMax = (incoming = []) => {
    const room = Math.max(0, maxCount - (value?.length || 0));
    return room > 0 ? incoming.slice(0, room) : [];
  };

  const normalizeNewFiles = (files) => {
    const list = Array.from(files || []);
    const filtered = list.filter((f) => f.size <= maxSizeMB * 1024 * 1024);
    const mapped = filtered.map((f) =>
      withPreview({
        id: makeId(),
        name: f.name,
        size: f.size,
        type: f.type || "application/octet-stream",
        file: f,
      })
    );
    return clampToMax(mapped);
  };

  const addFiles = (files) => {
    const entries = normalizeNewFiles(files);
    if (!entries.length) return;
    onChange?.([...(value || []), ...entries]);
  };

  const removeAt = (idx) => {
    const arr = [...(value || [])];
    const [removed] = arr.splice(idx, 1);
    if (removed?.previewUrl?.startsWith("blob:")) {
      try { URL.revokeObjectURL(removed.previewUrl); } catch {}
    }
    onChange?.(arr);
  };

  const move = (idx, dir) => {
    if (!allowReorder) return;
    const arr = [...(value || [])];
    const tgt = idx + dir;
    if (tgt < 0 || tgt >= arr.length) return;
    const [item] = arr.splice(idx, 1);
    arr.splice(tgt, 0, item);
    onChange?.(arr);
  };

  // Drag & drop
  React.useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };
    const onDrop = (e) => {
      prevent(e);
      if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
    };
    el.addEventListener("dragenter", prevent);
    el.addEventListener("dragover", prevent);
    el.addEventListener("dragleave", prevent);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragenter", prevent);
      el.removeEventListener("dragover", prevent);
      el.removeEventListener("dragleave", prevent);
      el.removeEventListener("drop", onDrop);
    };
  }, []); // eslint-disable-line

  // Paste from clipboard (images)
  React.useEffect(() => {
    const onPaste = (e) => {
      if (!e.clipboardData?.files?.length) return;
      addFiles(e.clipboardData.files);
    };
    const el = dropRef.current;
    el?.addEventListener("paste", onPaste);
    return () => el?.removeEventListener("paste", onPaste);
  }, []); // eslint-disable-line

  // Tile renderer (grid UX)
  const renderTile = (att, idx) => {
    const Icon = iconForType(att);
    const kb = att.size ? Math.round(att.size / 1024) : 0;

    return (
      <Box
        key={att.id}
        sx={{
          position: "relative",
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 1.5,
          overflow: "hidden",
          aspectRatio: tileAspect,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        {isImage(att) && att.previewUrl ? (
          <Box
            component="img"
            src={att.previewUrl}
            alt={att.name}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : isVideo(att) ? (
          <Stack alignItems="center" spacing={0.5} sx={{ p: 1, textAlign: "center" }}>
            <Video size={32} />
            <Typography variant="caption" sx={{ px: 1 }} noWrap title={att.name}>
              {att.name}
            </Typography>
          </Stack>
        ) : isAudio(att) ? (
          <Stack alignItems="center" spacing={0.5} sx={{ p: 1, textAlign: "center" }}>
            <Music2 size={32} />
            <Typography variant="caption" sx={{ px: 1 }} noWrap title={att.name}>
              {att.name}
            </Typography>
          </Stack>
        ) : isPdf(att) ? (
          <Stack alignItems="center" spacing={0.5} sx={{ p: 1, textAlign: "center" }}>
            <FileText size={32} />
            <Typography variant="caption" sx={{ px: 1 }} noWrap title={att.name}>
              {att.name}
            </Typography>
          </Stack>
        ) : (
          <Stack alignItems="center" spacing={0.5} sx={{ p: 1, textAlign: "center" }}>
            <Icon size={32} />
            <Typography variant="caption" sx={{ px: 1 }} noWrap title={att.name}>
              {att.name}
            </Typography>
          </Stack>
        )}

        {/* top-right controls */}
        <Stack direction="row" spacing={0.5} sx={{ position: "absolute", top: 6, right: 6 }}>
          {allowDownload && (
            <Tooltip title={att.url ? "Open / download" : "No URL"}>
              <span>
                <IconButton
                  size="small"
                  onClick={() => att.url && window.open(att.url, "_blank")}
                  disabled={!att.url}
                  sx={{
                    bgcolor: "background.paper",
                    "&:hover": { bgcolor: "background.paper" },
                  }}
                >
                  <Download size={16} />
                </IconButton>
              </span>
            </Tooltip>
          )}
          <Tooltip title="Remove">
            <IconButton
              size="small"
              color="error"
              onClick={() => removeAt(idx)}
              sx={{
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "background.paper" },
              }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* bottom-left info chip */}
        <Chip
          size="small"
          label={`${kb.toLocaleString()} KB`}
          sx={{ position: "absolute", left: 6, bottom: 6 }}
        />

        {/* bottom-right reorder */}
        {allowReorder && (
          <Stack direction="row" spacing={0.5} sx={{ position: "absolute", right: 6, bottom: 6 }}>
            <IconButton size="small" onClick={() => move(idx, -1)} disabled={idx === 0}>
              <ArrowUp size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => move(idx, +1)}
              disabled={idx === (value?.length || 0) - 1}
            >
              <ArrowDown size={16} />
            </IconButton>
          </Stack>
        )}
      </Box>
    );
  };

  const hasFiles = (value?.length || 0) > 0;

  return (
    <Stack spacing={1} ref={dropRef}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Paperclip size={16} />
        <Typography variant="subtitle2">{title}</Typography>
        <Box flexGrow={1} />
        {showTitleChip && (
          <Chip size="small" label={`${value?.length || 0}/${maxCount}`} variant="outlined" />
        )}
        {/* Hidden input (click target for drop zone and big plus) */}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {/* (Top-right + button intentionally removed) */}
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          minHeight: 140,
          bgcolor: (t) => (hasFiles ? t.palette.background.paper : t.palette.action.hover),
          outline: "none",
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        {layout === "grid" ? (
          <Grid container spacing={1.5} alignItems="stretch">
            {(value || []).map((att, idx) => (
              <Grid key={att.id} item xs={6} sm={4} md={3}>
                {renderTile(att, idx)}
              </Grid>
            ))}

            {/* "+ Add" tile only when at least one file exists */}
            {hasFiles && (
              <Grid item xs={6} sm={4} md={3}>
                <Box
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  sx={{
                    border: (t) => `1px dashed ${t.palette.divider}`,
                    borderRadius: 1.5,
                    aspectRatio: "4 / 3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                    cursor: "pointer",
                    transition: "background-color 120ms ease",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Stack alignItems="center" spacing={0.5}>
                    <Plus size={24} />
                    <Typography variant="caption">Add</Typography>
                  </Stack>
                </Box>
              </Grid>
            )}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No list layout implemented. Switch to grid or keep as is.
          </Typography>
        )}

        {/* Empty state with BIG plus button */}
        {!hasFiles && (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 120 }}>
            <Tooltip title="Add files">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  border: (t) => `2px dashed ${t.palette.divider}`,
                  bgcolor: (t) => t.palette.background.paper,
                  mb: 1,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Plus size={32} />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" color="text.secondary" align="center">
              Drag & drop files here, paste from clipboard, or click the plus to add files.<br />
              Up to {maxCount} files (≤ {maxSizeMB} MB each).
            </Typography>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
