// src/TeamInbox/components/composer/EditorPieces.jsx
import React from "react";
import {
  Box,
  Stack,
  Tooltip,
  IconButton,
  Dialog,
  Button,
  TextField,
  Typography,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  List as ListBulleted,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Braces,
  Code2,
  Paperclip,
  AtSign,
} from "lucide-react";

/* ---------------- Toolbar config per channel ---------------- */
export function toolbarConfigForChannel(channel) {
  if (["email", "platform"].includes(channel))
    return [
      "bold",
      "italic",
      "underline",
      "strike",
      "ul",
      "ol",
      "left",
      "center",
      "right",
      "link",
      "attach",
      "vars",
      "mention",
    ];
  if (channel === "whatsapp")
    return ["bold", "italic", "strike", "link", "attach", "vars", "mention"];
  return ["mention", "attach", "vars"];
}

/* ---------------- Toolbar (with active-state feedback) ---------------- */
export function RichToolbar({
  config = [],
  onBold,
  onItalic,
  onUnderline,
  onStrike,
  onLink,
  onUL,
  onOL,
  onLeft,
  onCenter,
  onRight,
  onCodeBlock,
  onAttach,
  onVars,
  onMention,
  active = {},
}) {
  const Btn = ({ when = true, title, onClick, on, children }) =>
    when ? (
      <Tooltip title={title}>
        <IconButton
          size="small"
          // Prevent the editor from losing focus/caret when clicking toolbar
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClick}
          sx={{
            mr: 0.25,
            color: on ? "primary.main" : "inherit",
            bgcolor: on ? (t) => t.palette.primary.main + "14" : "transparent",
            "&:hover": {
              bgcolor: on ? (t) => t.palette.primary.main + "24" : "action.hover",
            },
          }}
        >
          {children}
        </IconButton>
      </Tooltip>
    ) : null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ flexWrap: "wrap", justifyContent: "space-between", gap: 0.5 }}
    >
      {/* LEFT: formatting and alignment */}
      <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
        <Btn when={config.includes("bold")} title="Bold" onClick={onBold} on={!!active.bold}>
          <Bold size={16} />
        </Btn>
        <Btn when={config.includes("italic")} title="Italic" onClick={onItalic} on={!!active.italic}>
          <Italic size={16} />
        </Btn>
        <Btn
          when={config.includes("underline")}
          title="Underline"
          onClick={onUnderline}
          on={!!active.underline}
        >
          <Underline size={16} />
        </Btn>
        <Btn
          when={config.includes("strike")}
          title="Strikethrough"
          onClick={onStrike}
          on={!!active.strike}
        >
          <Strikethrough size={16} />
        </Btn>
        <Btn when={config.includes("ul")} title="Bulleted List" onClick={onUL} on={!!active.ul}>
          <ListBulleted size={16} />
        </Btn>
        <Btn when={config.includes("ol")} title="Numbered List" onClick={onOL} on={!!active.ol}>
          <ListOrdered size={16} />
        </Btn>
        <Btn when={config.includes("left")} title="Align Left" onClick={onLeft} on={!!active.left}>
          <AlignLeft size={16} />
        </Btn>
        <Btn
          when={config.includes("center")}
          title="Align Center"
          onClick={onCenter}
          on={!!active.center}
        >
          <AlignCenter size={16} />
        </Btn>
        <Btn when={config.includes("right")} title="Align Right" onClick={onRight} on={!!active.right}>
          <AlignRight size={16} />
        </Btn>
        <Btn title="Code Block" onClick={onCodeBlock}>
          <Code2 size={16} />
        </Btn>
      </Stack>

      {/* RIGHT: link, attach, vars, mention */}
      <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
        <Btn when={config.includes("link")} title="Insert Link" onClick={onLink} on={!!active.link}>
          <LinkIcon size={16} />
        </Btn>
        <Btn when={config.includes("attach") || true} title="Add Attachment" onClick={onAttach}>
          <Paperclip size={16} />
        </Btn>
        <Btn when={config.includes("vars") || true} title="Insert Variable" onClick={onVars}>
          <Braces size={16} />
        </Btn>
        <Btn when={config.includes("mention")} title="Mention @member" onClick={onMention}>
          <AtSign size={16} />
        </Btn>
      </Stack>
    </Stack>
  );
}

/* ---------------- Link mini-modal ---------------- */
function LinkDialog({ open, onClose, onSave }) {
  const [label, setLabel] = React.useState("");
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setLabel("");
      setUrl("");
    }
  }, [open]);

  const save = () => {
    const u = url.trim();
    if (!u) return onClose?.();
    onSave?.({ label: label.trim(), url: u });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <Box sx={{ px: 3, pt: 2 }}>
        <Typography variant="h6">Insert Link</Typography>
      </Box>
      <Box sx={{ px: 3, py: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Label (optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
          />
          <TextField
            label="URL"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                save();
              }
            }}
          />
        </Stack>
      </Box>
      <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save}>
          Insert
        </Button>
      </Stack>
    </Dialog>
  );
}

/* -------- Helpers: caret bookmark (path + offset) that survives rerenders --- */
function nodeIndexInParent(node) {
  if (!node || !node.parentNode) return -1;
  let i = 0;
  let n = node;
  while (n && n.previousSibling) {
    n = n.previousSibling;
    i++;
  }
  return i;
}

function makePathFromNode(root, node) {
  const path = [];
  let n = node;
  while (n && n !== root) {
    const idx = nodeIndexInParent(n);
    if (idx < 0) break;
    path.unshift(idx);
    n = n.parentNode;
  }
  return path;
}

function resolvePathToNode(root, path) {
  let n = root;
  for (const idx of path) {
    if (!n || !n.childNodes || idx >= n.childNodes.length) return null;
    n = n.childNodes[idx];
  }
  return n;
}

function getBookmark(root) {
  const sel = window.getSelection?.();
  if (!root || !sel || sel.rangeCount === 0) return null;
  const r = sel.getRangeAt(0);
  if (!root.contains(r.startContainer) || !root.contains(r.endContainer)) return null;
  return {
    startPath: makePathFromNode(root, r.startContainer),
    startOffset: r.startOffset,
    endPath: makePathFromNode(root, r.endContainer),
    endOffset: r.endOffset,
    collapsed: r.collapsed,
  };
}

function restoreBookmark(root, bm) {
  if (!root || !bm) return false;
  const sel = window.getSelection?.();
  if (!sel) return false;

  const startNode = resolvePathToNode(root, bm.startPath);
  const endNode = resolvePathToNode(root, bm.endPath);
  if (!startNode || !endNode) return false;

  try {
    const range = document.createRange();
    const startLimit = startNode.nodeType === 3 ? startNode.length : (startNode.childNodes?.length ?? 0);
    const endLimit = endNode.nodeType === 3 ? endNode.length : (endNode.childNodes?.length ?? 0);
    range.setStart(startNode, Math.min(bm.startOffset ?? 0, startLimit));
    range.setEnd(endNode, Math.min(bm.endOffset ?? 0, endLimit));
    sel.removeAllRanges();
    sel.addRange(range);
    return true;
  } catch {
    return false;
  }
}

/* Precise insertion at caret using Range APIs (no execCommand) */
function insertHTMLWithRange(html) {
  const sel = window.getSelection?.();
  if (!sel || sel.rangeCount === 0) return;

  let range = sel.getRangeAt(0);
  range.deleteContents();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;

  const frag = document.createDocumentFragment();
  let lastNode = null;
  while (wrapper.firstChild) {
    lastNode = frag.appendChild(wrapper.firstChild);
  }
  range.insertNode(frag);

  // Move caret just after the inserted content
  if (lastNode) {
    range = range.cloneRange();
    range.setStartAfter(lastNode);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

function insertTextWithRange(text) {
  const sel = window.getSelection?.();
  if (!sel || sel.rangeCount === 0) return;

  let range = sel.getRangeAt(0);
  range.deleteContents();

  const textNode = document.createTextNode(text);
  range.insertNode(textNode);

  // Place caret after text node
  range = range.cloneRange();
  range.setStartAfter(textNode);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

/* ---------------- Rich editor + @mentions ---------------- */
export const RichHtmlArea = React.forwardRef(function RichHtmlArea(
  {
    value = "",
    onChangeHtml,
    sanitizeHtml,

    minRows = 5,
    maxRows = 10,
    rowPx = 22,

    toolbarConfig = [],
    onBold,
    onItalic,
    onUnderline,
    onStrike,
    onUL,
    onOL,
    onLeft,
    onCenter,
    onRight,
    onVars,
    onAttach,

    placeholder = "Type your message…",

    // members for @mentions
    membersForMentions = [], // [{ id, displayName, role, avatarUrl, availability }]
  },
  ref
) {
  const editableRef = React.useRef(null);
  const measureRef = React.useRef(null);

  // caret bookmark that persists across DOM changes
  const lastBookmarkRef = React.useRef(null);

  const isNodeInsideEditor = React.useCallback((node) => {
    const root = editableRef.current;
    if (!root || !node) return false;
    return node === root || (node.nodeType ? root.contains(node) : false);
  }, []);

  const saveBookmark = React.useCallback(() => {
    const root = editableRef.current;
    const sel = window.getSelection?.();
    if (!root || !sel || sel.rangeCount === 0) return;
    const r = sel.getRangeAt(0);
    if (isNodeInsideEditor(r.startContainer) && isNodeInsideEditor(r.endContainer)) {
      lastBookmarkRef.current = getBookmark(root);
    }
  }, [isNodeInsideEditor]);

  const placeCaretAtEnd = React.useCallback(() => {
    const root = editableRef.current;
    if (!root) return;
    const sel = window.getSelection?.();
    const range = document.createRange();
    range.selectNodeContents(root);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
    lastBookmarkRef.current = getBookmark(root);
  }, []);

  const focusAndRestore = React.useCallback(() => {
    const root = editableRef.current;
    if (!root) return;
    root.focus();
    const ok = restoreBookmark(root, lastBookmarkRef.current);
    if (!ok) {
      placeCaretAtEnd();
    }
  }, [placeCaretAtEnd]);

  // active-state map for toolbar
  const [active, setActive] = React.useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    ul: false,
    ol: false,
    left: false,
    center: false,
    right: false,
    link: false,
  });

  // link and mentions modals
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [mentionOpen, setMentionOpen] = React.useState(false);
  const [mentionQuery, setMentionQuery] = React.useState("");

  const refreshActive = React.useCallback(() => {
    const sel = document.getSelection?.();
    let node =
      sel && sel.rangeCount > 0 ? sel.anchorNode : editableRef.current || null;
    if (node && node.nodeType === 3) node = node.parentElement;

    const hasAncestor = (tag) => {
      let el = node;
      tag = String(tag).toUpperCase();
      while (el && el !== editableRef.current) {
        if (el.tagName === tag) return true;
        el = el.parentElement;
      }
      return false;
    };
    const q = (cmd) => !!document.queryCommandState?.(cmd);

    // alignment
    let textAlign = "left";
    if (node) {
      const block =
        node.closest?.(
          "[style*='text-align'], p, div, li, h1, h2, h3, h4, h5, h6"
        ) || node;
      textAlign = window.getComputedStyle(block).textAlign || "left";
    }

    setActive({
      bold: q("bold"),
      italic: q("italic"),
      underline: q("underline"),
      strike: q("strikeThrough"),
      ul: hasAncestor("UL"),
      ol: hasAncestor("OL"),
      link: hasAncestor("A"),
      left: textAlign === "left",
      center: textAlign === "center",
      right: textAlign === "right",
    });
  }, []);

  /* NEW: robust caret-based insertion helpers */
  const insertHTMLAtCaret = React.useCallback(
    (html) => {
      focusAndRestore();
      insertHTMLWithRange(html);
      saveBookmark();
      refreshActive();
    },
    [focusAndRestore, saveBookmark, refreshActive]
  );

  const insertTextAtCaret = React.useCallback(
    (text) => {
      focusAndRestore();
      insertTextWithRange(text);
      saveBookmark();
      refreshActive();
    },
    [focusAndRestore, saveBookmark, refreshActive]
  );

  const def = React.useMemo(
    () => ({
      onBold: () => {
        focusAndRestore();
        document.execCommand("bold");
        saveBookmark();
        refreshActive();
      },
      onItalic: () => {
        focusAndRestore();
        document.execCommand("italic");
        saveBookmark();
        refreshActive();
      },
      onUnderline: () => {
        focusAndRestore();
        document.execCommand("underline");
        saveBookmark();
        refreshActive();
      },
      onStrike: () => {
        focusAndRestore();
        document.execCommand("strikeThrough");
        saveBookmark();
        refreshActive();
      },
      onUL: () => {
        focusAndRestore();
        document.execCommand("insertUnorderedList");
        saveBookmark();
        refreshActive();
      },
      onOL: () => {
        focusAndRestore();
        document.execCommand("insertOrderedList");
        saveBookmark();
        refreshActive();
      },
      onLeft: () => {
        focusAndRestore();
        document.execCommand("justifyLeft");
        saveBookmark();
        refreshActive();
      },
      onCenter: () => {
        focusAndRestore();
        document.execCommand("justifyCenter");
        saveBookmark();
        refreshActive();
      },
      onRight: () => {
        focusAndRestore();
        document.execCommand("justifyRight");
        saveBookmark();
        refreshActive();
      },
      onVars: () => {
        // bookmark before any dialogs/insertions
        saveBookmark();
        insertTextAtCaret("{{variable_key}}");
      },
      onLinkOpen: () => {
        // save caret before opening dialog
        saveBookmark();
        setLinkOpen(true);
      },
      onCodeBlock: () => {
        const snippet = "\n```\n{{Paste your code here}}\n```\n";
        saveBookmark();
        insertTextAtCaret(snippet);
      },
      onAttach: () => onAttach?.(),
      onMention: () => {
        // save caret before opening mentions dialog
        saveBookmark();
        setMentionOpen(true);
      },
    }),
    [insertTextAtCaret, onAttach, refreshActive, saveBookmark, focusAndRestore]
  );

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      focusAndRestore();
    },
    insertText: (text) => {
      saveBookmark();
      insertTextAtCaret(String(text ?? ""));
    },
    insertHTML: (html) => {
      saveBookmark();
      insertHTMLAtCaret(String(html ?? ""));
    },
  }));

  // Keep CE in sync with value and mirror for measuring
  React.useEffect(() => {
    const el = editableRef.current;
    if (!el) return;
    if (el.innerHTML !== (value || "")) {
      // Try to preserve caret across external value pushes
      const root = editableRef.current;
      const preBm = getBookmark(root);
      el.innerHTML = value || "";
      if (measureRef.current && measureRef.current.innerHTML !== (value || "")) {
        measureRef.current.innerHTML = value || "";
      }
      // Restore caret after DOM rewrite
      if (preBm) {
        restoreBookmark(root, preBm);
        lastBookmarkRef.current = preBm;
      }
    }
  }, [value]);

  // Selection-change tracking for active-state + save selection (inside editor only)
  React.useEffect(() => {
    const onSel = () => {
      const sel = window.getSelection?.();
      if (!sel || sel.rangeCount === 0) return;
      const r = sel.getRangeAt(0);
      if (!isNodeInsideEditor(r.startContainer) || !isNodeInsideEditor(r.endContainer)) return;
      refreshActive();
      lastBookmarkRef.current = getBookmark(editableRef.current);
    };
    document.addEventListener("selectionchange", onSel);
    return () => document.removeEventListener("selectionchange", onSel);
  }, [refreshActive, isNodeInsideEditor]);

  // Height measure for 5–10 lines
  const [contentPx, setContentPx] = React.useState(0);
  React.useEffect(() => {
    const m = measureRef.current;
    if (!m) return;
    const ro = new ResizeObserver(() => setContentPx(m.scrollHeight));
    ro.observe(m);
    setContentPx(m.scrollHeight);
    return () => ro.disconnect();
  }, []);

  const minPx = Math.max(minRows, 1) * rowPx + 24; // padding allowance
  const maxPx = Math.max(maxRows, minRows) * rowPx + 24;
  const editorHeight = Math.min(Math.max(contentPx || minPx, minPx), maxPx);

  // Insert link from mini modal
  const handleInsertLink = ({ label, url }) => {
    setLinkOpen(false);
    const safeUrl = url;
    focusAndRestore();
    if (label) {
      insertHTMLAtCaret(
        `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`
      );
    } else {
      // If no label, apply createLink to current selection
      document.execCommand("createLink", false, safeUrl);
      saveBookmark();
      refreshActive();
    }
  };

  // Insert a semantic mention node
  const insertMention = (member) => {
    if (!member) return;
    const id = String(member.id || "").trim();
    const name = String(member.displayName || "Unknown").trim();
    const role = String(member.role || "").trim();
    const safeName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const html = `<span class="mention" data-mention="${id}" data-role="${role}">@${safeName}</span>&nbsp;`;
    insertHTMLAtCaret(html);
  };

  // Mentions filter
  const filteredMembers = React.useMemo(() => {
    const q = (mentionQuery || "").toLowerCase().trim();
    if (!q) return membersForMentions || [];
    return (membersForMentions || []).filter((m) => {
      const name = (m.displayName || "").toLowerCase();
      const role = (m.role || "").toLowerCase();
      return name.includes(q) || role.includes(q);
    });
  }, [mentionQuery, membersForMentions]);

  // Detect visual "emptiness" for placeholder (handles <br> cases)
  const isVisuallyEmpty = () => {
    const el = editableRef.current;
    if (!el) return true;
    const html = (el.innerHTML || "").replace(/&nbsp;|\s|<br\s*\/?>/gi, "");
    return html.length === 0;
  };

  return (
    <Box
      sx={{
        border: (t) => `1px solid ${t.palette.divider}`,
        borderRadius: 1,
        overflow: "hidden",
        "&:focus-within": {
          borderColor: (t) => t.palette.primary.main,
          boxShadow: (t) =>
            t.palette.mode === "dark"
              ? `0 0 0 1px ${t.palette.primary.main}`
              : `0 0 0 1px ${t.palette.primary.main}33`,
        },
      }}
    >
      {/* Toolbar (sticky) */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          px: 0.5,
          py: 0.5,
          bgcolor: (t) => t.palette.background.paper,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <RichToolbar
          config={toolbarConfig}
          onBold={onBold || def.onBold}
          onItalic={onItalic || def.onItalic}
          onUnderline={onUnderline || def.onUnderline}
          onStrike={onStrike || def.onStrike}
          onLink={def.onLinkOpen}
          onUL={onUL || def.onUL}
          onOL={onOL || def.onOL}
          onLeft={onLeft || def.onLeft}
          onCenter={onCenter || def.onCenter}
          onRight={onRight || def.onRight}
          onCodeBlock={def.onCodeBlock}
          onAttach={def.onAttach}
          onVars={onVars || def.onVars}
          onMention={def.onMention}
          active={active}
        />
      </Box>

      {/* Editable area */}
      <Box
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        tabIndex={0}
        data-placeholder={placeholder}
        onFocus={saveBookmark}
        onClick={saveBookmark}
        onKeyUp={saveBookmark}
        onMouseUp={saveBookmark}
        onInput={(e) => {
          onChangeHtml?.(
            sanitizeHtml?.(e.currentTarget.innerHTML) ?? e.currentTarget.innerHTML
          );
          // mirror for measurement
          if (measureRef.current)
            measureRef.current.innerHTML =
              sanitizeHtml?.(e.currentTarget.innerHTML) ??
              e.currentTarget.innerHTML;
          // refresh + re-save caret
          refreshActive();
          saveBookmark();
        }}
        sx={{
          height: editorHeight,
          overflowY: "auto",
          p: 1,
          outline: "none",
          "& ul": {
            listStyle: "disc",
            paddingLeft: 3,
            margin: 0,
            marginBottom: 1,
          },
          "& ol": {
            listStyle: "decimal",
            paddingLeft: 3,
            margin: 0,
            marginBottom: 1,
          },
          "& li": { marginLeft: 0.5, paddingLeft: 0.5 },
          // mention styling
          "& .mention": {
            padding: "0 3px",
            borderRadius: "6px",
            display: "inline-block",
            background: (t) => t.palette.action.hover,
          },
          // placeholder styling
          "&:empty:before": {
            content: "attr(data-placeholder)",
            color: (t) => t.palette.text.disabled,
          },
        }}
      />

      {/* Hidden mirror (for height calc) */}
      <Box
        ref={measureRef}
        sx={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          zIndex: -1,
          p: 1,
          whiteSpace: "normal",
          border: "none",
        }}
      />

      {/* Link dialog */}
      <LinkDialog
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        onSave={handleInsertLink}
      />

      {/* Mentions dialog */}
      <Dialog
        open={mentionOpen}
        onClose={() => { setMentionOpen(false); setMentionQuery(""); }}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ px: 3, pt: 2, pb: 1 }}>
          <Typography variant="h6">Mention a teammate</Typography>
        </Box>
        <Box sx={{ px: 3, pb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search name or role"
            value={mentionQuery}
            onChange={(e) => setMentionQuery(e.target.value)}
            autoFocus
          />
        </Box>
        <Box sx={{ px: 1, pb: 2 }}>
          <List dense disablePadding sx={{ maxHeight: 320, overflowY: "auto" }}>
            {(filteredMembers || []).length ? (
              filteredMembers.map((m) => (
                <ListItemButton
                  key={m.id}
                  onClick={() => {
                    insertMention(m);
                    setMentionOpen(false);
                    setMentionQuery("");
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={m.avatarUrl || ""}>
                      {(m.displayName || "?").charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {m.displayName || "Unknown"}
                        </Typography>
                        {m.role && <Chip size="small" label={m.role} />}
                      </Stack>
                    }
                    secondary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AvailabilityDot state={m.availability} />
                        <Typography variant="caption" color="text.secondary">
                          {m.availability || "unknown"}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItemButton>
              ))
            ) : (
              <Box sx={{ px: 2, py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No matching roommates
                </Typography>
              </Box>
            )}
          </List>
        </Box>
        <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setMentionOpen(false); setMentionQuery(""); }}>
            Close
          </Button>
        </Stack>
      </Dialog>
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
      <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave?.(key, sample)}>
          Save & Insert
        </Button>
      </Stack>
    </Dialog>
  );
}

/* ---------------- Small helper: Availability dot ---------------- */
function AvailabilityDot({ state }) {
  const tone =
    state === "available" ? "success.main" :
    state === "busy" ? "warning.main" :
    state === "away" ? "info.main" :
    state === "offline" ? "text.disabled" : "text.disabled";
  return (
    <Box
      component="span"
      sx={{
        width: 8, height: 8, borderRadius: "50%",
        bgcolor: (t) => t.palette[tone?.split(".")[0]]?.[tone?.split(".")[1]] || t.palette.text.disabled,
        display: "inline-block",
      }}
    />
  );
}
