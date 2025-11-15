import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    Typography
} from '@mui/material';

export default function ImageEditorModal({
    isOpen,
    onClose,
    onSave,
    media,
}) {
    const [editedMedia, setEditedMedia] = useState(media);

    useEffect(() => {
        if (isOpen) {
            setEditedMedia(media);
        }
    }, [media, isOpen]);

    const handleSave = () => {
        if (editedMedia) {
            onSave(editedMedia);
        }
        onClose();
    };

    if (!isOpen || !editedMedia) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Image</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Crop, rotate, or adjust your image. (Editor coming soon)
                </DialogContentText>
                <Stack spacing={2} sx={{ py: 2 }}>
                    <Box sx={{ minHeight: 400, backgroundColor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                        {editedMedia.url && (
                            <Box
                                component="img"
                                src={editedMedia.url}
                                alt={editedMedia.name || 'Image to edit'}
                                sx={{ maxWidth: '100%', maxHeight: 400, height: 'auto', objectFit: 'contain', borderRadius: 1 }}
                            />
                        )}
                    </Box>
                    <Typography variant="caption" color="text.secondary" align="center">
                        Full image editing capabilities will be available here soon.
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
}