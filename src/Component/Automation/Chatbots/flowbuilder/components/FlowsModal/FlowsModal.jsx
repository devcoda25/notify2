import React from 'react';
import { useFlowsStore } from '../../store/flows.js';
import { useToast } from '../../hooks/use-toast.js';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogContentText,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography
} from '@mui/material';
import { Trash2 } from 'lucide-react';

export default function FlowsModal({ isOpen, onClose }) {
    const { flows, activeFlowId, setActiveFlow, deleteFlow } = useFlowsStore();
    const { toast } = useToast();

    const handleSelectFlow = (flowId) => {
        setActiveFlow(flowId);
        onClose();
    };

    const handleDeleteFlow = (e, flowId, flowTitle) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the flow "${flowTitle}"? This cannot be undone.`)) {
            deleteFlow(flowId);
            toast({
                title: "Flow Deleted",
                description: `"${flowTitle}" has been deleted.`,
                variant: "destructive"
            });
            if (flows.length <= 1) {
                onClose();
            }
        }
    }

    const sortedFlows = [...flows].sort((a, b) => b.lastModified - a.lastModified);

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Open Flow</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    Select a previously saved flow to open it in the editor.
                </DialogContentText>
                <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {sortedFlows.map(flow => (
                            <ListItem
                                key={flow.id}
                                disablePadding
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteFlow(e, flow.id, flow.title)}>
                                        <Trash2 size={16} color="#ef4444" />
                                    </IconButton>
                                }
                            >
                                <ListItemButton
                                    selected={flow.id === activeFlowId}
                                    onClick={() => handleSelectFlow(flow.id)}
                                    sx={{ borderRadius: 2, border: 1, borderColor: 'divider' }}
                                >
                                    <ListItemText
                                        primary={<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{flow.title}</Typography>}
                                        secondary={`Last modified: ${new Date(flow.lastModified).toLocaleString()}`}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        {flows.length === 0 && (
                            <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 8 }}>
                                <Typography>No saved flows found.</Typography>
                                <Typography variant="body2">Create a new one from the "Flows" menu.</Typography>
                            </Box>
                        )}
                    </List>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
