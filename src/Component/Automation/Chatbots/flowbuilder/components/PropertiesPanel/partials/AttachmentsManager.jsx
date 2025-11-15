import React from "react";
import {
  Box,
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
  Image as ImageIcon,
  Video,
  Music2,
  FileText,
  FileArchive,
} from "lucide-react";

/* --- helpers --- */
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
}) {
  const inputRef = React.useRef(null);
  const dropRef = React.useRef(null);

  // cleanup object URLs
  React.useEffect(() => {
    return () => {
      (value || []).forEach((att) => {
        if (att.previewUrl?.startsWith("blob:")) {
          try { URL.revokeObjectURL(att.previewUrl); } catch {}
        }
      });
    };
  }, [value]);

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
    return clampToMax(
      filtered.map((f) =>
        withPreview({
          id: makeId(),
          name: f.name,
          size: f.size,
          type: f.type || "application/octet-stream",
          file: f,
        })
      )
    );
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
        ) : (
          <Stack alignItems="center" spacing={0.5} sx={{ p: 1, textAlign: "center" }}>
            <Icon size={32} />
            <Typography variant="caption" sx={{ px: 1 }} noWrap title={att.name}>
              {att.name}
            </Typography>
          </Stack>
        )}

        {/* top-right: only Delete */}
        <Stack direction="row" spacing={0.5} sx={{ position: "absolute", top: 6, right: 6 }}>
          <Tooltip title="Remove">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation(); // don't trigger upload click
                removeAt(idx);
              }}
              sx={{
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "background.paper" },
              }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* bottom-left: size chip */}
        <Chip
          size="small"
          label={`${kb.toLocaleString()} KB`}
          sx={{ position: "absolute", left: 6, bottom: 6 }}
        />
      </Box>
    );
  };

  /* ---------------- CENTERED LAYOUT ---------------- */
  return (
    <Box
      ref={dropRef}
      sx={{
        minHeight: "30vh",
        display: "grid",
        placeItems: "center",
        px: 2,
      }}
    >
      <Stack spacing={1} sx={{ width: "100%", maxWidth: 900 }}>
        {/* header (optional) */}
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
          <Paperclip size={16} />
          <Typography variant="subtitle2">{title}</Typography>
          {showTitleChip && (
            <Chip size="small" label={`${value?.length || 0}/${maxCount}`} variant="outlined" />
          )}
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
        </Stack>

        {/* Clickable grid */}
        <Box onClick={() => inputRef.current?.click()} sx={{ cursor: "pointer", width: "100%" }}>
          <Grid container spacing={1.5} alignItems="stretch" justifyContent="center">
            {(value || []).map((att, idx) => (
              <Grid key={att.id} item xs={10} sm={6} md={4} lg={3}>
                {renderTile(att, idx)}
              </Grid>
            ))}

            {/* "+" tile */}
            <Grid item xs={10} sm={6} md={4} lg={3}>
              <Box
                sx={{
                  border: (t) => `2px dashed ${t.palette.divider}`,
                  borderRadius: 1.5,
                  aspectRatio: "4 / 3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Stack alignItems="center" spacing={0.5}>
                  <Plus size={24} />
                  <Typography variant="caption">Add</Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
}
