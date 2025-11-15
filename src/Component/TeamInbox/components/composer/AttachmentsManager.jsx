// src/TeamInbox/components/composer/AttachmentsManager.jsx
import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Alert,
  LinearProgress,
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
  File as FileIcon,
  Info,
} from "lucide-react";

/**
 * Attachment shape
 * {
 *   id: string, name: string, size: number, type: string,
 *   file?: File, url?: string, previewUrl?: string,
 *   source?: string, encoding?: string,
 *   status?: 'pending'|'uploading'|'ready'|'error',
 *   progress?: number // 0..100 (only while uploading)
 * }
 */

const MAX_COUNT_DEFAULT = 30;     // up to 30 files
const MAX_TOTAL_MB_DEFAULT = 5120; // up to 5 GB

const isImage   = (m = {}) => /^image\//.test(m.type || "");
const isVideo   = (m = {}) => /^video\//.test(m.type || "");
const isAudio   = (m = {}) => /^audio\//.test(m.type || "");
const isPdf     = (m = {}) => (m.type || "").includes("pdf");
const isArchive = (m = {}) => /(zip|rar|7z|tar|gz|bz2)/i.test(m.type || m.name || "");

const iconForType = (att = {}) => {
  if (isImage(att)) return ImageIcon;
  if (isVideo(att)) return Video;
  if (isAudio(att)) return Music2;
  if (isPdf(att)) return FileText;
  if (isArchive(att)) return FileArchive;
  if ((att.type || "").startsWith("text/")) return FileText;
  return FileIcon;
};

const prettyBytes = (n = 0) => {
  if (!n) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  const v = n / Math.pow(1024, i);
  return `${v >= 100 ? Math.round(v) : v >= 10 ? v.toFixed(1) : v.toFixed(2)} ${u[i]}`;
};

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function withPreview(att) {
  if (att.previewUrl) return att;
  if (att.file && (isImage(att) || isVideo(att))) {
    try {
      return { ...att, previewUrl: URL.createObjectURL(att.file) };
    } catch {}
  }
  return att;
}
const detectEncoding = (att) => (att.type || "").startsWith("text/") ? "utf-8 (assumed)" : "binary";
const sourcePath     = (att) => att.file?.webkitRelativePath || att.file?.name || att.name || "Local file";

/**
 * Props:
 * - value?: Attachment[]
 * - onCommit?: (next:Attachment[]) => void
 * - onUpload?: (pending:Attachment[]) => Promise<Attachment[]>
 * - accept?: string
 * - title?: string
 * - maxCount?: number (default 30)
 * - maxTotalMB?: number (default 5120 MB)
 * - showTitleChip?: boolean
 *
 * Exposes ref:
 * - uploadAndCommit(): Promise<Attachment[]>
 */
const AttachmentsManager = React.forwardRef(function AttachmentsManager(
  {
    value = [],
    onCommit,
    onUpload,
    accept = "*/*",
    title = "Attachments",
    maxCount = MAX_COUNT_DEFAULT,
    maxTotalMB = MAX_TOTAL_MB_DEFAULT,
    showTitleChip = true,
  },
  ref
) {
  const [local, setLocal] = React.useState(() =>
    (value || []).map((a) => ({ ...a, status: a.status || "ready", progress: 100 }))
  );
  const [errors, setErrors] = React.useState([]);
  const [isUploading, setIsUploading] = React.useState(false);

  const inputRef = React.useRef(null);
  const dropRef  = React.useRef(null);

  // revoke blobs on unmount/remove
  React.useEffect(() => {
    return () => {
      (local || []).forEach((att) => {
        if (att.previewUrl?.startsWith("blob:")) {
          try { URL.revokeObjectURL(att.previewUrl); } catch {}
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSize = React.useMemo(
    () => local.reduce((s, a) => s + (a.size | 0), 0),
    [local]
  );

  // validate new files against limits
  const validateIncoming = (incoming = []) => {
    const errs = [];
    const room = Math.max(0, maxCount - local.length);
    if (incoming.length > room) {
      errs.push(`You can add up to ${maxCount} files. You tried ${incoming.length}; only ${room} slot(s) left.`);
      incoming = incoming.slice(0, room);
    }

    let sizeAfter = totalSize;
    const accepted = [];
    for (const f of incoming) {
      const att = {
        id: makeId(),
        name: f.name,
        size: f.size,
        type: f.type || "application/octet-stream",
        file: f,
        encoding: detectEncoding({ type: f.type, name: f.name }),
        source: f.webkitRelativePath || f.name,
        status: "pending",
        progress: 0,
      };
      sizeAfter += att.size;
      if (sizeAfter > maxTotalMB * 1024 * 1024) {
        errs.push(`Total size would exceed ${maxTotalMB} MB. "${f.name}" skipped.`);
        sizeAfter -= att.size;
        continue;
      }
      accepted.push(withPreview(att));
    }

    if (errs.length) setErrors((prev) => [...prev, ...errs]);
    return accepted;
  };

  const addFiles = (files) => {
    const list = Array.from(files || []);
    const accepted = validateIncoming(list);
    if (!accepted.length) return;
    setLocal((xs) => [...xs, ...accepted]);
  };

  const removeAt = (idx) => {
    setLocal((xs) => {
      const arr = [...xs];
      const [removed] = arr.splice(idx, 1);
      if (removed?.previewUrl?.startsWith("blob:")) {
        try { URL.revokeObjectURL(removed.previewUrl); } catch {}
      }
      return arr;
    });
  };

  // DnD & paste
  React.useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };
    const onDrop = (e) => { prevent(e); if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files); };
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

  React.useEffect(() => {
    const onPaste = (e) => { if (e.clipboardData?.files?.length) addFiles(e.clipboardData.files); };
    const el = dropRef.current;
    el?.addEventListener("paste", onPaste);
    return () => el?.removeEventListener("paste", onPaste);
  }, []); // eslint-disable-line

  // Upload & commit
  const uploadAndCommit = React.useCallback(async () => {
    const pending = local.filter((f) => f.status === "pending");
    if (pending.length === 0) {
      onCommit?.(local);
      return local;
    }

    if (!onUpload) {
      // no uploader provided → instantly mark ready (no animation)
      const next = local.map((a) =>
        a.status === "pending" ? { ...a, status: "ready", progress: 100 } : a
      );
      setLocal(next);
      onCommit?.(next);
      return next;
    }

    // real upload path with visual progress (only while uploading)
    setIsUploading(true);
    setLocal((xs) =>
      xs.map((a) => (a.status === "pending" ? { ...a, status: "uploading", progress: 0 } : a))
    );

    try {
      const uploaded = await onUpload(pending);
      const byId = Object.fromEntries((uploaded || []).map((a) => [a.id || "", a]));
      const next = local.map((a) => {
        if (a.status !== "uploading" && a.status !== "pending") return a;
        const patch = byId[a.id] || {};
        return { ...a, ...patch, status: "ready", progress: 100 };
      });
      setLocal(next);
      onCommit?.(next);
      return next;
    } catch (err) {
      setErrors((xs) => [...xs, (err && err.message) || "Upload failed. Please try again."]);
      setLocal((xs) => xs.map((a) => (a.status === "uploading" ? { ...a, status: "error", progress: 0 } : a)));
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [local, onCommit, onUpload]);

  React.useImperativeHandle(ref, () => ({ uploadAndCommit }));

  const hasFiles = local.length > 0;

  const header = (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
      <Paperclip size={16} />
      <Typography variant="subtitle2">{title}</Typography>
      <Box flexGrow={1} />
      {showTitleChip && (
        <Stack direction="row" spacing={1}>
          <Chip size="small" label={`${local.length}/${maxCount}`} variant="outlined" />
          <Chip size="small" label={prettyBytes(totalSize)} variant="outlined" />
        </Stack>
      )}
    </Stack>
  );

  return (
    <Stack spacing={1} ref={dropRef}>
      {header}

      {/* Errors */}
      {errors.length > 0 && (
        <Stack spacing={1}>
          {errors.map((e, i) => (
            <Alert
              key={i}
              severity="error"
              variant="outlined"
              onClose={() => setErrors((xs) => xs.filter((_, idx) => idx !== i))}
              icon={<Info size={18} />}
            >
              {e}
            </Alert>
          ))}
        </Stack>
      )}

      <Paper
        variant="outlined"
        sx={{
          position: "relative",
          p: 2,
          borderRadius: 2,
          minHeight: 200,
          bgcolor: (t) => (hasFiles ? t.palette.background.paper : t.palette.action.hover),
          outline: "none",
        }}
        role="group"
        tabIndex={0}
        onKeyDown={(e) => {
          // delete focused tile with Delete key
          if (e.key === "Delete") {
            const target = e.target.closest?.('[data-att-idx]');
            if (target) {
              const idx = Number(target.getAttribute('data-att-idx'));
              if (!Number.isNaN(idx)) removeAt(idx);
            }
          }
        }}
      >
        {/* Empty state */}
        {!hasFiles && (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200, textAlign: "center" }} spacing={1.5}>
            <IconButton
              aria-label="Add files"
              onClick={() => inputRef.current?.click()}
              sx={{
                width: 80, height: 80, borderRadius: "50%",
                border: (t) => `2px dashed ${t.palette.divider}`,
                bgcolor: (t) => t.palette.background.paper,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Plus size={34} />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Drag & drop files here, paste from clipboard, or click the plus to add files.
              <br />
              Up to {maxCount} files, total ≤ {maxTotalMB} MB.
            </Typography>
          </Stack>
        )}

        {/* Files grid — compact and wraps gracefully */}
        {hasFiles && (
          <Box
            sx={{
              display: "grid",
              gap: 12 / 8, // 1.5 theme spacing without over-widening
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              overflowX: "hidden",
            }}
          >
            {local.map((att, idx) => {
              const Icon = iconForType(att);
              const status = att.status || "pending";
              const showProgress = status === "uploading";

              return (
                <Paper
                  key={att.id}
                  data-att-idx={idx}
                  variant="outlined"
                  sx={{
                    position: "relative",
                    p: 1,
                    borderRadius: 1.5,
                    minHeight: 168,                 // compact tile
                    display: "grid",
                    gridTemplateColumns: "72px 1fr",
                    gridTemplateRows: "auto auto 1fr auto",
                    columnGap: 1,
                    rowGap: 0.25,
                  }}
                >
                  {/* Square preview */}
                  <Box
                    sx={{
                      gridColumn: "1 / 2",
                      gridRow: "1 / 3",
                      width: 72,
                      height: 72,                  // square
                      borderRadius: 1,
                      bgcolor: (t) => t.palette.action.hover,
                      display: "grid",
                      placeItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    {isImage(att) && att.previewUrl ? (
                      <Box component="img" alt={att.name} src={att.previewUrl}
                           sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <Icon size={24} />
                    )}
                  </Box>

                  {/* Title + size/type (clamped) */}
                  <Box sx={{ gridColumn: "2 / 3", gridRow: "1 / 2", minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        wordBreak: "break-word",
                      }}
                      title={att.name}
                    >
                      {att.name || "Attachment"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", wordBreak: "break-word" }}
                      title={`${att.type || "application/octet-stream"} • ${prettyBytes(att.size)}`}
                    >
                      {(att.type || "application/octet-stream")} • {prettyBytes(att.size)}
                    </Typography>
                  </Box>

                  {/* Source / encoding (soft clamp) */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      gridColumn: "2 / 3",
                      gridRow: "2 / 3",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      wordBreak: "break-word",
                    }}
                    title={`${att.source || sourcePath(att)}`}
                  >
                    src: {att.source || sourcePath(att)} 
                  </Typography>

                  {/* Status + progress */}
                  <Stack direction="row" alignItems="center" spacing={0.75} sx={{ gridColumn: "1 / 3", gridRow: "3 / 4", alignSelf: "end" }}>
                    <Chip
                      size="small"
                      label={
                        status === "pending"   ? "Pending"   :
                        status === "uploading" ? "Uploading" :
                        status === "ready"     ? "Ready"     : "Error"
                      }
                      color={
                        status === "pending"   ? "warning" :
                        status === "uploading" ? "info"    :
                        status === "ready"     ? "success" : "error"
                      }
                      variant="outlined"
                    />
                    {showProgress && (
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress variant="indeterminate" sx={{ height: 6, borderRadius: 999 }} />
                      </Box>
                    )}
                  </Stack>

                  {/* Bottom-right delete */}
                  <Tooltip title="Remove">
                    <IconButton
                      aria-label={`Remove ${att.name || "attachment"}`}
                      size="small"
                      color="error"
                      onClick={() => removeAt(idx)}
                      sx={{ position: "absolute", right: 8, bottom: 8 }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Tooltip>
                </Paper>
              );
            })}
          </Box>
        )}

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
        />

        {/* Floating + button (only when there ARE files) */}
        {hasFiles && (
          <Tooltip title="Add files">
            <IconButton
              onClick={() => inputRef.current?.click()}
              sx={{
                position: "absolute",
                right: 12,
                bottom: 12,
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: (t) => `1px dashed ${t.palette.divider}`,
                bgcolor: (t) => t.palette.background.paper,
                "&:hover": { bgcolor: "action.hover" },
              }}
              aria-label="Add files"
            >
              <Plus size={22} />
            </IconButton>
          </Tooltip>
        )}
      </Paper>
    </Stack>
  );
});

export default AttachmentsManager;
