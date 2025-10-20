import React from "react";
import {
  Box,
  Stack,
  Chip,
  Button,
  IconButton,
  Tooltip,
  TextField,
  Typography,
  Paper,
  Dialog,
} from "@mui/material";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  List as ListBulleted,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Braces,
  Code2,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import AttachmentsManager from "./AttachmentsManager";

/* ---------------- Focus-stable TextField ---------------- */
export function FieldStable({
  label,
  value,
  onChange,
  helperText,
  multiline = false,
  rows = 4,
}) {
  const inputRef = React.useRef(null);
  const wasFocused = React.useRef(false);
  const caret = React.useRef({ start: 0, end: 0 });

  const rememberCaret = (el) => {
    if (!el || el.selectionStart == null) return;
    caret.current = { start: el.selectionStart, end: el.selectionEnd };
  };

  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => {
        rememberCaret(e.target);
        onChange?.(e.target.value);
      }}
      inputRef={(el) => {
        const prev = inputRef.current;
        inputRef.current = el;
        if (el && wasFocused.current) {
          el.focus();
          try {
            el.setSelectionRange(caret.current.start, caret.current.end);
          } catch {}
        }
      }}
      onFocus={(e) => {
        wasFocused.current = true;
        rememberCaret(e.target);
      }}
      onBlur={() => (wasFocused.current = false)}
      onKeyUp={(e) => rememberCaret(e.target)}
      onClick={(e) => rememberCaret(e.target)}
      helperText={helperText}
      fullWidth
      multiline={multiline}
      minRows={multiline ? rows : undefined}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="none"
      spellCheck={false}
      inputProps={{ inputMode: "text" }}
    />
  );
}

/* ---------------- Toolbar ---------------- */
export function toolbarConfigForChannel(channel) {
  if (["email", "platform"].includes(channel))
    return [
      "bold",
      "italic",
      "underline",
      "strike",
      "link",
      "ul",
      "ol",
      "quote",
      "left",
      "center",
      "right",
      "vars",
    ];
  if (channel === "whatsapp")
    return ["bold", "italic", "strike", "link", "vars"];
  return ["vars"]; // sms/push
}

export function RichToolbar({
  config = [],
  onBold,
  onItalic,
  onUnderline,
  onStrike,
  onLink,
  onUL,
  onOL,
  onQuote,
  onLeft,
  onCenter,
  onRight,
  onVars,
}) {
  const Btn = ({ when, title, onClick, children }) =>
    when ? (
      <Tooltip title={title}>
        <IconButton size="small" onClick={onClick} sx={{ mr: 0.25 }}>
          {children}
        </IconButton>
      </Tooltip>
    ) : null;

  return (
    <Stack direction="row" spacing={0.5} sx={{ mb: 1, flexWrap: "wrap" }}>
      <Btn when={config.includes("bold")} title="Bold" onClick={onBold}>
        <Bold size={16} />
      </Btn>
      <Btn when={config.includes("italic")} title="Italic" onClick={onItalic}>
        <Italic size={16} />
      </Btn>
      <Btn
        when={config.includes("underline")}
        title="Underline"
        onClick={onUnderline}
      >
        <Underline size={16} />
      </Btn>
      <Btn
        when={config.includes("strike")}
        title="Strikethrough"
        onClick={onStrike}
      >
        <Strikethrough size={16} />
      </Btn>
      <Btn when={config.includes("link")} title="Insert Link" onClick={onLink}>
        <LinkIcon size={16} />
      </Btn>
      <Btn
        when={config.includes("ul")}
        title="Bulleted List"
        onClick={onUL}
      >
        <ListBulleted size={16} />
      </Btn>
      <Btn
        when={config.includes("ol")}
        title="Numbered List"
        onClick={onOL}
      >
        <ListOrdered size={16} />
      </Btn>
      <Btn
        when={config.includes("quote")}
        title="Blockquote"
        onClick={onQuote}
      >
        <Quote size={16} />
      </Btn>
      <Btn
        when={config.includes("left")}
        title="Align Left"
        onClick={onLeft}
      >
        <AlignLeft size={16} />
      </Btn>
      <Btn
        when={config.includes("center")}
        title="Align Center"
        onClick={onCenter}
      >
        <AlignCenter size={16} />
      </Btn>
      <Btn
        when={config.includes("right")}
        title="Align Right"
        onClick={onRight}
      >
        <AlignRight size={16} />
      </Btn>
      <Btn
        when={config.includes("vars")}
        title="Insert Variable"
        onClick={onVars}
      >
        <Braces size={16} />
      </Btn>
    </Stack>
  );
}

/* ---------------- Rich / HTML Area (enhanced) ---------------- */
export const RichHtmlArea = React.forwardRef(function RichHtmlArea(
  {
    value = "",
    tab = "rich",
    onChangeTab,
    onChangeHtml,
    sanitizeHtml,
    htmlError = "",
    htmlLabel = "HTML Source",
    label = "Body (Rich)",

    /** NEW: inline toolbar inside the editor box */
    inlineToolbar = false,
    toolbarConfig = [],
    // Optional handlers; if not provided we use safe execCommand defaults
    onBold,
    onItalic,
    onUnderline,
    onStrike,
    onLink,
    onUL,
    onOL,
    onQuote,
    onLeft,
    onCenter,
    onRight,
    onVars,
  },
  ref
) {
  const editableRef = React.useRef(null);

  // Provide default simple formatting actions using execCommand
  const def = React.useMemo(
    () => ({
      onBold: () => document.execCommand("bold"),
      onItalic: () => document.execCommand("italic"),
      onUnderline: () => document.execCommand("underline"),
      onStrike: () => document.execCommand("strikeThrough"),
      onLink: () => {
        const url = window.prompt("Enter URL");
        if (url) document.execCommand("createLink", false, url);
      },
      onUL: () => document.execCommand("insertUnorderedList"),
      onOL: () => document.execCommand("insertOrderedList"),
      onQuote: () => document.execCommand("formatBlock", false, "blockquote"),
      onLeft: () => document.execCommand("justifyLeft"),
      onCenter: () => document.execCommand("justifyCenter"),
      onRight: () => document.execCommand("justifyRight"),
      onVars: () => {
        editableRef.current?.focus();
        document.execCommand("insertText", false, "{{variable_key}}");
      },
    }),
    []
  );

  React.useImperativeHandle(ref, () => ({
    focus: () => editableRef.current?.focus(),
    insertText: (text) => {
      editableRef.current?.focus();
      document.execCommand("insertText", false, text);
    },
  }));

  // Keep contentEditable in sync with `value` while in rich mode
  React.useEffect(() => {
    if (editableRef.current && tab === "rich") {
      if (editableRef.current.innerHTML !== value) {
        editableRef.current.innerHTML = value || "";
      }
    }
  }, [value, tab]);

  const [isComposing, setIsComposing] = React.useState(false);

  // Helper: sync current rich content -> HTML value
  const syncFromEditable = React.useCallback(() => {
    if (!editableRef.current) return;
    const html =
      sanitizeHtml?.(editableRef.current.innerHTML) ??
      editableRef.current.innerHTML;
    onChangeHtml?.(html);
  }, [onChangeHtml, sanitizeHtml]);

  // Ensure that switching to "HTML" first syncs the rich content as HTML
  const handleSwitch = (nextTab) => {
    if (nextTab === "html") {
      syncFromEditable();
    }
    onChangeTab?.(nextTab);
  };

  const ToolbarInline =
    inlineToolbar && tab === "rich" ? (
      <Box
        sx={{
          position: "absolute",
          top: 6,
          left: 6,
          zIndex: 2,
          // bgcolor: (t) => t.palette.background.paper,
          // border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 1,
          px: 0.5,
          py: 0.25,
          // boxShadow: (t) =>
          //   t.palette.mode === "dark" ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <RichToolbar
          config={toolbarConfig}
          onBold={onBold || def.onBold}
          onItalic={onItalic || def.onItalic}
          onUnderline={onUnderline || def.onUnderline}
          onStrike={onStrike || def.onStrike}
          onLink={onLink || def.onLink}
          onUL={onUL || def.onUL}
          onOL={onOL || def.onOL}
          onQuote={onQuote || def.onQuote}
          onLeft={onLeft || def.onLeft}
          onCenter={onCenter || def.onCenter}
          onRight={onRight || def.onRight}
          onVars={onVars || def.onVars}
        />
      </Box>
    ) : null;

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 0.5 }}
      >
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            size="small"
            label="Rich"
            color={tab === "rich" ? "primary" : "default"}
            onClick={() => handleSwitch("rich")}
            variant={tab === "rich" ? "filled" : "outlined"}
          />
          <Chip
            size="small"
            label="HTML"
            icon={<Code2 size={12} />}
            color={tab === "html" ? "primary" : "default"}
            onClick={() => handleSwitch("html")}
            variant={tab === "html" ? "filled" : "outlined"}
          />
        </Stack>
      </Stack>

      {tab === "rich" ? (
        <Box
          sx={{
            position: "relative",
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: 1,
          }}
        >
          {ToolbarInline}
          <Box
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) =>
              onChangeHtml?.(
                sanitizeHtml?.(e.currentTarget.innerHTML) ??
                  e.currentTarget.innerHTML
              )
            }
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(e) => {
              setIsComposing(false);
              onChangeHtml?.(
                sanitizeHtml?.(e.currentTarget.innerHTML) ??
                  e.currentTarget.innerHTML
              );
            }}
            sx={{
              minHeight: 180,
              p: 1,
              pt: inlineToolbar ? 5.5 : 1, // space for inline toolbar
              "&:focus": {
                outline: "none",
                boxShadow: (t) => `0 0 0 2px ${t.palette.primary.main}33`,
              },
            }}
          />
        </Box>
      ) : (
        <TextField
          label={htmlLabel}
          value={value}
          onChange={(e) => onChangeHtml?.(e.target.value)}
          multiline
          minRows={10}
          fullWidth
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          inputProps={{ inputMode: "text" }}
          helperText={
            htmlError ||
            "HTML supported (email/whatsapp: no scripts; platform: risky patterns are removed)."
          }
          error={Boolean(htmlError)}
        />
      )}
    </Box>
  );
});

/* ---------------- Variable Dialog ---------------- */
export function VariableDialog({ open, onClose, onSave, variableKeys = [] }) {
  const [key, setKey] = React.useState("");
  const [sample, setSample] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setKey("");
      setSample("");
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Typography variant="h6" component="div" sx={{ px: 3, pt: 2 }}>
        Add or Insert Variable
      </Typography>
      <Box component="div" sx={{ px: 3, py: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Variable key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="e.g. user_first_name"
            helperText={
              variableKeys.length
                ? `Suggestions: ${variableKeys.join(", ")}`
                : "Type a new key or paste an existing one"
            }
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSave?.(key, sample);
              }
            }}
          />
          <TextField
            label="Sample value"
            value={sample}
            onChange={(e) => setSample(e.target.value)}
            placeholder="e.g. Ada"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSave?.(key, sample);
              }
            }}
          />
        </Stack>
      </Box>
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={1}
        sx={{ px: 3, pb: 2 }}
      >
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave?.(key, sample)}>
          Save & Insert
        </Button>
      </Stack>
    </Dialog>
  );
}

/* ---------------- Header / Footer rail (refined) ---------------- */
export function stripHtmlPreview(s) {
  return String(s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 64);
}

export function HeaderFooterRail({
  label,
  hasContent,
  previewText,
  onAdd,
  onEdit,
  onClear,
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25 }}>
        <Box flex={1} sx={{ height: 1, bgcolor: (t) => t.palette.divider }} />
        {hasContent ? (
          <Paper
            variant="outlined"
            sx={{
              px: 1.25,
              py: 0.75,
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <Chip size="small" label={label} color="primary" variant="outlined" />
            <Typography
              variant="body2"
              sx={{
                maxWidth: 360,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={previewText}
            >
              {previewText || "—"}
            </Typography>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={onEdit}>
                <Pencil size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove">
              <IconButton size="small" color="error" onClick={onClear}>
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          </Paper>
        ) : (
          <Button size="small" startIcon={<Plus size={14} />} onClick={onAdd}>
            Add {label}
          </Button>
        )}
        <Box flex={1} sx={{ height: 1, bgcolor: (t) => t.palette.divider }} />
    </Stack>
  );
}

/* ---------------- Attachments (shared manager) ---------------- */
export function EditorAttachments({
  attachments = [],
  setAttachments,
  title = "Attachments (optional)",
  accept = "image/*,application/pdf,video/*,audio/*",
  maxCount = 10,
  maxSizeMB = 10,
}) {
  return (
    <AttachmentsManager
      value={attachments}
      onChange={setAttachments}
      title={title}
      accept={accept}
      maxCount={maxCount}
      maxSizeMB={maxSizeMB}
      layout="grid"
    />
  );
}
