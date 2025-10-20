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
  Dialog,
  Paper,
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
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import AttachmentsManager from "./AttachmentsManager";

/* ---------------- Toolbar configuration ---------------- */
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
  return ["vars"];
}

/* ---------------- Toolbar ---------------- */
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
      <Btn when={config.includes("ul")} title="Bulleted List" onClick={onUL}>
        <ListBulleted size={16} />
      </Btn>
      <Btn when={config.includes("ol")} title="Numbered List" onClick={onOL}>
        <ListOrdered size={16} />
      </Btn>
      <Btn when={config.includes("quote")} title="Blockquote" onClick={onQuote}>
        <Quote size={16} />
      </Btn>
      <Btn when={config.includes("left")} title="Align Left" onClick={onLeft}>
        <AlignLeft size={16} />
      </Btn>
      <Btn when={config.includes("center")} title="Align Center" onClick={onCenter}>
        <AlignCenter size={16} />
      </Btn>
      <Btn when={config.includes("right")} title="Align Right" onClick={onRight}>
        <AlignRight size={16} />
      </Btn>
      <Btn when={config.includes("vars")} title="Insert Variable" onClick={onVars}>
        <Braces size={16} />
      </Btn>
    </Stack>
  );
}

/* ---------------- Rich Area (HTML tab removed) ---------------- */
export const RichHtmlArea = React.forwardRef(function RichHtmlArea(
  { value = "", onChangeHtml, label = "Body" },
  ref
) {
  const editableRef = React.useRef(null);
  const savedRange = React.useRef(null);
  const [isComposing, setIsComposing] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    focus: () => editableRef.current?.focus(),
    insertText: (text) => {
      const el = editableRef.current;
      if (!el) return;
      el.focus();
      setTimeout(() => {
        const sel = window.getSelection();
        if (savedRange.current) {
          sel.removeAllRanges();
          sel.addRange(savedRange.current);
        }
        const range = sel.getRangeAt(0);
        range.deleteContents();

        const variableSpan = document.createElement("span");
        variableSpan.className = "editor-variable";
        variableSpan.contentEditable = "false";
        variableSpan.textContent = text;
        variableSpan.dataset.variable = text.replace(/[{}]/g, '');
        range.insertNode(variableSpan);

        range.setStartAfter(variableSpan);
        range.setEndAfter(variableSpan);
        sel.removeAllRanges();
        sel.addRange(range);

        el.dispatchEvent(new Event("input", { bubbles: true }));
      }, 0);
    }
  }), []);

  React.useEffect(() => {
    if (editableRef.current && editableRef.current.innerHTML !== value) {
      editableRef.current.innerHTML = value || "";
    }
  }, [value]);

  const rememberCaret = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0);
  };

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
        {label}
      </Typography>

      <Box
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => {
          if (!isComposing) onChangeHtml?.(e.currentTarget.innerHTML);
        }}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={(e) => {
          setIsComposing(false);
          onChangeHtml?.(e.currentTarget.innerHTML);
        }}
        onKeyUp={rememberCaret}
        onMouseUp={rememberCaret}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 1,
          minHeight: 180,
          p: 1,
          fontFamily: "inherit",
          fontSize: "14px",
          lineHeight: 1.5,
          "&:focus": {
            outline: "none",
            boxShadow: (t) => `0 0 0 2px ${t.palette.primary.main}33`,
          },
          /* ✅ variable chips: no background highlight */
          "& .editor-variable": {
            color: "#1976d2",
            padding: "2px 4px",
            borderRadius: "3px",
            fontWeight: 500,
            border: "1px solid #bbdefb",
            display: "inline-block",
            userSelect: "none",
            cursor: "default",
            whiteSpace: "nowrap",
          },
        }}
      />
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

  const handleSave = () => {
    if (key.trim()) {
      onSave?.(key.trim(), sample);
    }
  };

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
            placeholder="e.g. firstName"
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
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
            }}
          />
          <TextField
            label="Sample value"
            value={sample}
            onChange={(e) => setSample(e.target.value)}
            placeholder="e.g. John"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
            }}
          />
        </Stack>
      </Box>
      <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!key.trim()}>
          Insert Variable
        </Button>
      </Stack>
    </Dialog>
  );
}

/* ---------------- Attachments ---------------- */
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
