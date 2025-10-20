import React, { useState, useRef, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  Chip,
  Button,
  TextField,
  Dialog,
  Grid,
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
  Trash2,
  Paperclip,
  Image as ImageIcon,
  Video,
  Music2,
  FileText,
  FileArchive,
} from "lucide-react";

import './ChatInputToolbar.css'; // <--- IMPORT THE NEW CSS FILE HERE

/* --- START AttachmentsManager components & helpers --- */
const isImage = (m = {}) => /^image\//.test(m.type || "");
const isVideo = (m = {}) => /^video\//.test(m.type || "");
const isAudio = (m = {}) => /^audio\//.test(m.type || "");
const isPdf = (m = {}) => (m.type || "").includes("pdf");
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

function AttachmentsManager({
  value = [],
  onChange,
  accept = "image/*,application/pdf,video/*,audio/*",
  maxSizeMB = 10,
  maxCount = 10,
  title = "Attachments",
}) {
  const inputRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    return () => {
      (value || []).forEach((att) => {
        if (att.previewUrl?.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(att.previewUrl);
          } catch {}
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
      try {
        URL.revokeObjectURL(removed.previewUrl);
      } catch {}
    }
    onChange?.(arr);
  };

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const prevent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
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

  useEffect(() => {
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
          aspectRatio: "4 / 3",
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

        <Stack direction="row" spacing={0.5} sx={{ position: "absolute", top: 6, right: 6 }}>
          <Tooltip title="Remove">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
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
        <Chip
          size="small"
          label={`${kb.toLocaleString()} KB`}
          sx={{ position: "absolute", left: 6, bottom: 6 }}
        />
      </Box>
    );
  };

  return (
    <Box
      ref={dropRef}
      sx={{
        width: "100%",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Stack spacing={1} sx={{ width: "100%" }}>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="center"
        >
          <Paperclip size={16} />
          <Typography variant="subtitle2">{title}</Typography>
          <Chip
            size="small"
            label={`${value?.length || 0}/${maxCount}`}
            variant="outlined"
          />
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

        <Box onClick={() => inputRef.current?.click()} sx={{ cursor: "pointer", width: "100%" }}>
          <Grid
            container
            spacing={1.5}
            alignItems="stretch"
            justifyContent="center"
          >
            {(value || []).map((att, idx) => (
              <Grid key={att.id} item xs={10} sm={6} md={4} lg={3}>
                {renderTile(att, idx)}
              </Grid>
            ))}
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
/* --- END AttachmentsManager components & helpers --- */
<hr />

/* --- START EditorPieces components --- */
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
  activeCommands = {}
}) {
  const Btn = ({ when, title, onClick, children, command }) => {
    const isActive = activeCommands[command];
    return when ? (
      <Tooltip title={title}>
        <IconButton
          size="small"
          onClick={onClick}
          className={`toolbar-icon-button ${isActive ? 'active' : ''}`}
        >
          {children}
        </IconButton>
      </Tooltip>
    ) : null;
  };

  return (
    <Box className="toolbar-buttons-wrapper">
      <Btn when={config.includes("bold")} title="Bold" onClick={onBold} command="bold">
        <Bold size={16} />
      </Btn>
      <Btn when={config.includes("italic")} title="Italic" onClick={onItalic} command="italic">
        <Italic size={16} />
      </Btn>
      <Btn
        when={config.includes("underline")}
        title="Underline"
        onClick={onUnderline}
        command="underline"
      >
        <Underline size={16} />
      </Btn>
      <Btn
        when={config.includes("strike")}
        title="Strikethrough"
        onClick={onStrike}
        command="strikeThrough"
      >
        <Strikethrough size={16} />
      </Btn>
      <Btn when={config.includes("link")} title="Insert Link" onClick={onLink} command="createLink">
        <LinkIcon size={16} />
      </Btn>
      <Btn when={config.includes("ul")} title="Bulleted List" onClick={onUL} command="insertUnorderedList">
        <ListBulleted size={16} />
      </Btn>
      <Btn when={config.includes("ol")} title="Numbered List" onClick={onOL} command="insertOrderedList">
        <ListOrdered size={16} />
      </Btn>
      <Btn when={config.includes("quote")} title="Blockquote" onClick={onQuote} command="formatBlock">
        <Quote size={16} />
      </Btn>
      <Btn when={config.includes("left")} title="Align Left" onClick={onLeft} command="justifyLeft">
        <AlignLeft size={16} />
      </Btn>
      <Btn when={config.includes("center")} title="Align Center" onClick={onCenter} command="justifyCenter">
        <AlignCenter size={16} />
      </Btn>
      <Btn when={config.includes("right")} title="Align Right" onClick={onRight} command="justifyRight">
        <AlignRight size={16} />
      </Btn>
      <Btn when={config.includes("vars")} title="Insert Variable" onClick={onVars}>
        <Braces size={16} />
      </Btn>
    </Box>
  );
}

export const RichHtmlArea = forwardRef(function RichHtmlArea(
  { value = "", onChangeHtml, label = "Body" },
  ref
) {
  const editableRef = useRef(null);
  const savedRange = useRef(null);
  const [isComposing, setIsComposing] = useState(false);

  useImperativeHandle(ref, () => ({
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

        // Check if the selection is not collapsed (i.e., if text is highlighted)
        if (!range.collapsed) {
          range.deleteContents();
        }

        const variableSpan = document.createElement("span");
        variableSpan.className = "editor-variable";
        variableSpan.contentEditable = "false";
        variableSpan.textContent = text;
        variableSpan.dataset.variable = text.replace(/[{}]/g, "");
        
        range.insertNode(variableSpan);

        range.setStartAfter(variableSpan);
        range.setEndAfter(variableSpan);
        sel.removeAllRanges();
        sel.addRange(range);

        el.dispatchEvent(new Event("input", { bubbles: true }));
      }, 0);
    },
  }));

  useEffect(() => {
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
        className="chat-input-text-area"
      />
    </Box>
  );
});

export function VariableDialog({ open, onClose, onSave, variableKeys = [] }) {
  const [key, setKey] = useState("");
  const [sample, setSample] = useState("");

  useEffect(() => {
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
    />
  );
}
/* --- END EditorPieces components --- */

const ChatInputToolbar = forwardRef(({ channel = "email", onSubmit }, ref) => {
  const [html, setHtml] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isVarDialogOpen, setVarDialogOpen] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const editorRef = useRef(null);
  const [activeCommands, setActiveCommands] = useState({});

  const toolbarConfig = useMemo(() => toolbarConfigForChannel(channel), [channel]);

  // Expose handleSubmit via imperative handle so the parent can call it
  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      onSubmit(html, attachments);
      setHtml('');
      setAttachments([]);
    }
  }));

  const updateActiveCommands = () => {
    if (!editorRef.current) return;
    setActiveCommands({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
    });
  };

  const exec = (cmd, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(cmd, false, value);
      updateActiveCommands(); // Update the state after each command
    }
  };

  const handleInsertVariable = (key, sample) => {
    if (editorRef.current) {
      editorRef.current.insertText(`{{${key}}}`);
    }
    setVarDialogOpen(false);
  };
  
  return (
    <Paper
      elevation={0}
      className="chat-input-toolbar-container"
      
    >
      <Box sx={{ px: 0.2, pt: 0.5,
        minHeight: 30,
       }}>
        <RichHtmlArea
          ref={editorRef}
          value={html}
          onChangeHtml={setHtml}
          label="Compose new message"
          onKeyUp={updateActiveCommands}
          onMouseUp={updateActiveCommands}
        />
      </Box>

      {showAttachments && (
        <Box mt={1} sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <EditorAttachments
            attachments={attachments}
            setAttachments={setAttachments}
          />
        </Box>
      )}

      <Box sx={{ borderTop: "1px solid #e0e0e0" }} />

      <Box className="toolbar-buttons-wrapper">
        <RichToolbar
          config={toolbarConfig}
          onBold={() => exec("bold")}
          onItalic={() => exec("italic")}
          onUnderline={() => exec("underline")}
          onStrike={() => exec("strikeThrough")}
          onLink={() => exec("createLink", prompt("Enter URL:"))}
          onUL={() => exec("insertUnorderedList")}
          onOL={() => exec("insertOrderedList")}
          onQuote={() => exec("formatBlock", "blockquote")}
          onLeft={() => exec("justifyLeft")}
          onCenter={() => exec("justifyCenter")}
          onRight={() => exec("justifyRight")}
          onVars={() => setVarDialogOpen(true)}
          activeCommands={activeCommands}
        />
        
        <Box className="toolbar-divider" />

        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          flex: 1,
          justifyContent: "flex-start"
        }}>
          <Tooltip title="Attach files">
            <IconButton 
              size="small" 
              onClick={() => setShowAttachments(prev => !prev)}
              className="toolbar-icon-button"
            >
              <Paperclip size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <VariableDialog
        open={isVarDialogOpen}
        onClose={() => setVarDialogOpen(false)}
        onSave={handleInsertVariable}
        variableKeys={["firstName", "lastName", "email", "orderNumber"]}
      />

    </Paper>
  );
});

export default ChatInputToolbar;