import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { nanoid } from 'nanoid';
import * as LucideIcons from 'lucide-react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    ListItemIcon,
    ListItemText,
    Card,
    CardMedia,
    Grid,
} from '@mui/material';
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
} from 'lucide-react';

import NodeAvatars from '../../Presence/NodeAvatars';
import { useFlowStore } from '../../../store/flow';
import RichTextEditor from '../../PropertiesPanel/partials/RichTextEditor';

// Constants
const MEDIA_TYPES = ["image", "video", "audio", "document"];
const isMediaPart = (part) => MEDIA_TYPES.includes(part.type);

// Data migration
const migrateData = (data) => {
    if (typeof data.content === "string" && !data.parts) {
        return { ...data, parts: [{ id: nanoid(), type: "text", content: data.content }] };
    }
    if (!data.parts) {
        return { ...data, parts: [{ id: nanoid(), type: "text", content: "" }] };
    }
    return data;
};

// File icon utility
const getFileIcon = (fileName) => {
    if (!fileName) return <FileIcon size={32} />;
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
        case "mp3": case "wav": return <Music size={32} color="#f97316" />;
        case "mp4": case "mov": return <Film size={32} color="#8b5cf6" />;
        case "pdf": case "docx": case "txt": return <FileText size={32} color="#3b82f6" />;
        case "csv": case "xlsx": return <FileSpreadsheet size={32} color="#22c55e" />;
        case "json": return <FileJson size={32} color="#eab308" />;
        default: return <FileQuestion size={32} color="#64748b" />;
    }
};

const guessFileType = (fileName = "") => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["mp4", "mov", "avi"].includes(ext)) return "video";
    if (["mp3", "wav", "ogg"].includes(ext)) return "audio";
    return "document";
};

const getPreviewUrlFromFile = (file) => {
    if (file instanceof File) {
        try {
            return URL.createObjectURL(file);
        } catch (e) {
            console.error("Error creating object URL:", e);
            return "";
        }
    }
    return "";
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
    const textPart = useMemo(() => parts.find((p) => p.type === "text") || { id: nanoid(), type: "text", content: "" }, [parts]);
    const mediaParts = useMemo(() => {
        return parts.filter(isMediaPart).map(part => {
            if (!part.url && part.file) {
                return { ...part, previewUrl: getPreviewUrlFromFile(part.file) };
            }
            return part;
        });
    }, [parts]);

    const prevSelected = useRef(selected);

    const handleDeleteAttachment = useCallback((event, partIdToDelete) => {
        event.stopPropagation();
        event.preventDefault();
        const newParts = parts.filter((p) => p.id !== partIdToDelete);
        updateNodeData(id, { parts: newParts });
    }, [id, parts, updateNodeData]);

    const Icon = data.icon ? (LucideIcons[data.icon] ?? LucideIcons.MessageSquare) : Send;
    const isMessageNode = data.type === "messaging" && data.label === "Send a Message";
    const isStartNode = startNodeId === id;
    const thisNode = nodes.find((n) => n.id === id);

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

    const handleSave = useCallback(() => {
        const otherParts = parts.filter((p) => !isMediaPart(p) && p.type !== "text");
        const newTextPart = { ...textPart, content: tempContent };
        const normalizedAttachments = (tempAttachments || []).map((att) => ({
            id: att.id || nanoid(),
            type: att.type || guessFileType(att.name || att.url),
            name: att.name || "Attachment",
            url: att.url && !att.url.startsWith("blob:") ? att.url : "", // Keep existing persistent URLs, clear blob: URLs
            file: att.file, // Store the File object directly for now
        }));
        const newParts = [newTextPart, ...normalizedAttachments, ...otherParts];
        updateNodeData(id, { parts: newParts });
        setIsEditing(false);
    }, [id, tempContent, tempAttachments, textPart, updateNodeData, parts]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
    }, []);

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

    const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
    const handleMenuClose = () => setMenuAnchor(null);

    useEffect(() => {
        if (prevSelected.current && !selected && isMessageNode && isEditing) {
            handleSave();
        }
        prevSelected.current = selected;
    }, [selected, isMessageNode, isEditing, handleSave]);

    const messageBody = (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box
                sx={{ width: '100%', maxWidth: '100%', px: 1.5, py: 1, cursor: 'text', outline: 'none' }}
                onDoubleClick={handleDoubleClick}
                dangerouslySetInnerHTML={{ __html: textPart.content || '<p style="color: #64748b">Double-click to edit message...</p>' }}
            />
            {mediaParts.length > 0 && (
                <Box sx={{ p: 1.5 }}>
                    <Grid container spacing={1}>
                        {mediaParts.slice(0, 4).map((part, index) => (
                            <Grid item xs={6} key={part.id || index}>
                                <Card
                                    sx={{ position: 'relative', aspectRatio: '1 / 1', cursor: 'pointer' }}
                                    onClick={() => handleEditAttachment(part.id)}
                                >
                                    {part.type === 'image' && (part.url || part.previewUrl) ? (
                                        <CardMedia component="img" image={part.url || part.previewUrl} alt={part.name || "Attachment"} sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Box sx={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', backgroundColor: 'grey.200' }}>
                                            {getFileIcon(part.name)}
                                        </Box>
                                    )}
                                    {mediaParts.length > 4 && index === 3 ? (
                                        <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 20, fontWeight: 600, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                            +{mediaParts.length - 3}
                                        </Box>
                                    ) : (
                                        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: '2px', backgroundColor: 'rgba(255,255,255,0.8)', textAlign: 'center', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {part.name}
                                        </Box>
                                    )}
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleDeleteAttachment(e, part.id)}
                                        aria-label="Remove attachment"
                                        sx={{ position: 'absolute', top: 4, right: 4, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.7)', '&:hover': { backgroundColor: 'error.main', color: 'white' } }}
                                    >
                                        <XCircle size={18} />
                                    </IconButton>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );

    return (
        <Paper
            elevation={2}
            sx={{
                borderRadius: 0.5,
                border: 1,
                borderColor: 'divider',
                width: isMessageNode ? 340 : 280,
                transition: 'box-shadow 0.2s ease-in-out',
                boxShadow: selected ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' : 1,
            }}
        >
            <NodeAvatars nodeId={id} />
            <Box
                onDoubleClick={handleDoubleClick}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: '8px 12px',
                    borderBottom: 1,
                    borderColor: 'divider',
                    backgroundColor: data.color || 'primary.main',
                    color: 'white',
                    borderTopLeftRadius: 'inherit',
                    borderTopRightRadius: 'inherit',
                }}
            >
                <Icon size={16} />
                <Typography sx={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexGrow: 1,color: 'white' }}>
                    {data.label}
                </Typography>
                {isStartNode && <Badge color="secondary" badgeContent="Start" />}
                <IconButton size="small" sx={{ color: "white" }} onClick={handleMenuOpen}>
                    <MoreHorizontal size={18} />
                </IconButton>
            </Box>

            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                {thisNode && data.onOpenProperties && (
                    <MenuItem onClick={() => { data.onOpenProperties(thisNode); handleMenuClose(); }}>
                        <ListItemIcon><Settings size={16} /></ListItemIcon>
                        <ListItemText>Properties</ListItemText>
                    </MenuItem>
                )}
                <Divider />
                {isStartNode ? (
                    <MenuItem onClick={() => { setStartNode(null); handleMenuClose(); }}>
                        <ListItemIcon><XCircle size={16} /></ListItemIcon>
                        <ListItemText>Reset start node</ListItemText>
                    </MenuItem>
                ) : (
                    <MenuItem onClick={() => { setStartNode(id); handleMenuClose(); }}>
                        <ListItemIcon><PlayCircle size={16} /></ListItemIcon>
                        <ListItemText>Set as start node</ListItemText>
                    </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={() => { duplicateNode(id); handleMenuClose(); }}>
                    <ListItemIcon><Copy size={16} /></ListItemIcon>
                    <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { deleteNode(id); handleMenuClose(); }} sx={{ color: 'error.main' }}>
                    <ListItemIcon><Trash2 size={16} color="inherit" /></ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            <Box sx={{ p: '12px 14px', fontSize: 14, color: 'text.secondary' }}>
                {isMessageNode ? messageBody : <Typography variant="body2" onDoubleClick={handleDoubleClick}>{data.description || "Double-click to configure."}</Typography>}
            </Box>

            {isMessageNode && (
                <Dialog open={isEditing} onClose={handleCancel} maxWidth="md" fullWidth scroll="paper">
                    <DialogTitle>Edit Message</DialogTitle>
                    <DialogContent dividers>
                        <RichTextEditor key={id} value={tempContent} onChange={setTempContent} placeholder="Type message..." variables={["name", "email", "order_id"]} attachments={tempAttachments} onAttachmentsChange={setTempAttachments} />
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
                        <Button onClick={handleCancel} color="inherit">Cancel</Button>
                        <Button onClick={handleSave} variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>
            )}

            <Handle type="target" position={Position.Left} style={{ width: 10, height: 10, background: '#fff', border: '2px solid #ddd', borderRadius: '50%' }} />
            <Handle type="source" position={Position.Right} style={{ width: 10, height: 10, background: '#fff', border: '2px solid #ddd', borderRadius: '50%' }} />
        </Paper>
    );
}