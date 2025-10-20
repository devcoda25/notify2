import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import styles from "../canvas-layout.module.css";
import panelStyles from "../../PropertiesPanel/properties-panel.module.css";
import listNodeStyles from "./list-node.module.css";
import NodeAvatars from "../../Presence/NodeAvatars";
import {
  MoreHorizontal,
  Trash2,
  Copy,
  PlayCircle,
  XCircle,
  Settings,
  File as FileIcon,
  Film,
  Music,
  FileQuestion,
  FileSpreadsheet,
  FileJson,
  FileText,
  Send,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { useFlowStore } from "../../../store/flow";
import { nanoid } from "nanoid";
import { cn } from "../../../lib/utils";
import RichTextEditor from "../../PropertiesPanel/partials/RichTextEditor";

// 🔑 constants
const MEDIA_TYPES = ["image", "video", "audio", "document"];
const isMediaPart = (part) => MEDIA_TYPES.includes(part.type);

// 🔑 migrate old data into new structure
const migrateData = (data) => {
  if (typeof data.content === "string" && !data.parts) {
    return { ...data, parts: [{ id: nanoid(), type: "text", content: data.content }] };
  }
  if (!data.parts) {
    return { ...data, parts: [{ id: nanoid(), type: "text", content: "" }] };
  }
  return data;
};

// 🔑 file icon
const getFileIcon = (fileName) => {
  if (!fileName) return <FileIcon className="w-8 h-8" />;
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "mp3":
    case "wav":
      return <Music className="w-8 h-8 text-orange-500" />;
    case "mp4":
    case "mov":
      return <Film className="w-8 h-8 text-purple-500" />;
    case "pdf":
    case "docx":
    case "txt":
      return <FileText className="w-8 h-8 text-blue-500" />;
    case "csv":
    case "xlsx":
      return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
    case "json":
      return <FileJson className="w-8 h-8 text-yellow-500" />;
    default:
      return <FileQuestion className="w-8 h-8 text-muted-foreground" />;
  }
};

// 🔑 guess file type
const guessFileType = (fileName = "") => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (["mp4", "mov", "avi"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg"].includes(ext)) return "audio";
  return "document";
};

export default function BaseNode({ id, data, selected }) {
  const { deleteNode, duplicateNode, setStartNode, startNodeId, updateNodeData, nodes } = useFlowStore();
  const { getNode } = useReactFlow();

  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState("");
  const [tempAttachments, setTempAttachments] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const migratedData = useMemo(() => migrateData(data), [data]);
  const parts = migratedData.parts || [];
  const textPart = useMemo(
    () => parts.find((p) => p.type === "text") || { id: nanoid(), type: "text", content: "" },
    [parts]
  );
  const mediaParts = useMemo(() => parts.filter(isMediaPart), [parts]);

  const prevSelected = useRef(selected);

  // delete attachment
  const handleDeleteAttachment = useCallback(
    (event, partIdToDelete) => {
      event.stopPropagation();
      event.preventDefault();
      const newParts = parts.filter((p) => p.id !== partIdToDelete);
      updateNodeData(id, { parts: newParts });
    },
    [id, parts, updateNodeData]
  );

  // style + icon
  const customStyle = { "--node-color": data.color || "hsl(var(--primary))" };
  const Icon = data.icon ? (LucideIcons[data.icon] ?? LucideIcons.MessageSquare) : Send;

  // node type checks
  const isMessageNode = data.type === "messaging" && data.label === "Send a Message";
  const isStartNode = startNodeId === id;
  const thisNode = nodes.find((n) => n.id === id);

  // double click → edit
  const handleDoubleClick = useCallback(() => {
    if (!thisNode) return;
    if (isMessageNode) {
      setTempContent(textPart.content || "");
      setTempAttachments(mediaParts);
      setIsEditing(true);
      return;
    }
    data.onNodeDoubleClick?.(thisNode);
  }, [thisNode, isMessageNode, textPart.content, mediaParts, data.onNodeDoubleClick]);

  const handleContentChange = (newContent) => setTempContent(newContent);

  // ✅ normalize attachments on save
  const handleSave = useCallback(() => {
    const otherParts = parts.filter((p) => !isMediaPart(p) && p.type !== "text");
    const newTextPart = { ...textPart, content: tempContent };

    const normalizedAttachments = (tempAttachments || []).map((att) => ({
      id: att.id || nanoid(),
      type: att.type || guessFileType(att.name || att.url),
      name: att.name || "Attachment",
      url: att.url || att.preview || "",
    }));

    const newParts = [newTextPart, ...normalizedAttachments, ...otherParts];
    updateNodeData(id, { parts: newParts });
    setIsEditing(false);
  }, [id, tempContent, tempAttachments, textPart, updateNodeData, parts]);

  const handleCancel = useCallback(() => {
    setTempContent(textPart.content || "");
    setTempAttachments(mediaParts);
    setIsEditing(false);
  }, [textPart.content, mediaParts]);

  const handleEditAttachment = (partId) => {
    const part = mediaParts.find((p) => p.id === partId);
    if (!part) return;
    const type = part.type || guessFileType(part.name);
    if (type === "image") {
      data.onOpenImageEditor?.(id, partId);
    } else {
      data.onOpenAttachmentModal?.(id, partId, type);
    }
  };

  // menu
  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  // auto save when deselected
  useEffect(() => {
    if (prevSelected.current && !selected && isMessageNode && isEditing) {
      handleSave();
    }
    prevSelected.current = selected;
  }, [selected, isMessageNode, isEditing, handleSave]);

  // 📨 message body
  const messageBody = (
    <div className={styles.messageNodeBody}>
      <div
        className="w-full max-w-full px-3 py-2 cursor-text border-0 outline-none"
        onDoubleClick={handleDoubleClick}
        dangerouslySetInnerHTML={{
          __html: textPart.content || '<p class="text-muted-foreground">Double-click to edit message...</p>',
        }}
      />
      {mediaParts.length > 0 && (
        <div className={cn(styles.messagePart, "p-3")}>
          <div className={cn(panelStyles.attachmentGrid)}>
            {mediaParts.slice(0, 4).map((part, index) => {
              if (mediaParts.length > 4 && index === 3) {
                return (
                  <div
                    key="more"
                    className={panelStyles.attachmentCard}
                    onClick={() => handleEditAttachment(part.id)}
                  >
                    {part.type === "image" && part.url ? (
                      <img src={part.url} alt={part.name || "Attachment"} className={panelStyles.attachmentImage} />
                    ) : (
                      <div className={panelStyles.attachmentIcon}>{getFileIcon(part.name)}</div>
                    )}
                    <div className={panelStyles.attachmentOverlay}>+{mediaParts.length - 3}</div>
                  </div>
                );
              }
              return (
                <div
                  key={part.id}
                  className={panelStyles.attachmentCard}
                  onClick={() => handleEditAttachment(part.id)}
                >
                  {part.type === "image" && part.url ? (
                    <img src={part.url} alt={part.name || "Attachment"} className={panelStyles.attachmentImage} />
                  ) : (
                    <div className={panelStyles.attachmentIcon}>{getFileIcon(part.name)}</div>
                  )}
                  <div className={panelStyles.attachmentLabel}>{part.name}</div>
                  <button
                    onClick={(e) => handleDeleteAttachment(e, part.id)}
                    className={panelStyles.attachmentDelete}
                    aria-label="Remove attachment"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={cn(styles.baseNode, isMessageNode && styles.messageNode)}
      style={customStyle}
      aria-selected={selected}
    >
      <NodeAvatars nodeId={id} />
      <div className={styles.nodeHeader} onDoubleClick={handleDoubleClick}>
        <div className={styles.headerLeft}>
          <Icon className={styles.nodeIcon} size={16} />
          <span className={styles.nodeTitle}>{data.label}</span>
          {isStartNode && (
            <Badge color="secondary" className="ml-2">
              Start
            </Badge>
          )}
        </div>

        <IconButton size="medium" sx={{ color: "white", marginLeft: "12rem" }} onClick={handleMenuOpen}>
          <MoreHorizontal size={18} />
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {thisNode && data.onOpenProperties && (
            <MenuItem
              onClick={() => {
                data.onOpenProperties(thisNode);
                handleMenuClose();
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Properties
            </MenuItem>
          )}
          <Divider />
          {isStartNode ? (
            <MenuItem
              onClick={() => {
                setStartNode(null);
                handleMenuClose();
              }}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reset start node
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                setStartNode(id);
                handleMenuClose();
              }}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Set as start node
            </MenuItem>
          )}
          <Divider />
          <MenuItem
            onClick={() => {
              duplicateNode(id);
              handleMenuClose();
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </MenuItem>
          <MenuItem
            onClick={() => {
              deleteNode(id);
              handleMenuClose();
            }}
            sx={{ color: "red" }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </MenuItem>
        </Menu>
      </div>

      <div className={styles.nodeBody}>
        {isMessageNode ? messageBody : <p onDoubleClick={handleDoubleClick}>{data.description || "Double-click to configure."}</p>}
      </div>

      {isMessageNode && (
        <Dialog open={isEditing} onClose={handleSave} maxWidth="md" fullWidth scroll="paper">
          <DialogTitle>Edit Message</DialogTitle>
          <DialogContent dividers>
            <RichTextEditor
              key={id + (isEditing ? "-editing" : "-viewing")}
              value={tempContent}
              onChange={handleContentChange}
              placeholder="Type message..."
              variables={["name", "email", "order_id"]}
              attachments={tempAttachments}
              onAttachmentsChange={setTempAttachments}
            />
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "space-between", px: 3, py: 2 }}>
            <Box>
              <Button onClick={handleCancel} color="inherit" sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button onClick={handleSave} variant="contained">
                Save
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}

      <Handle type="target" position={Position.Left} className={styles.handle} />
      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
}
