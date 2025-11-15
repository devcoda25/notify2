import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    Typography,
    Skeleton
} from '@mui/material';

const RichTextEditor = lazy(() => import('./RichTextEditor'));

export default function MessageContentModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    onAddMedia,
}) {
    const [text, setText] = useState('');
    const modalRef = React.useRef(null);

    useEffect(() => {
        if (isOpen) {
            setText(initialData?.content || '');
        }
    }, [initialData, isOpen]);

    const handleSave = () => {
        onSave({ content: text });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Message</DialogTitle>
            <DialogContent ref={modalRef}>
                <DialogContentText>Modify the rich text content of your message below.</DialogContentText>
                <Stack spacing={1} sx={{ py: 2 }}>
                    <Typography variant="caption" color="text.secondary">Message Content</Typography>
                    <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={200} />}>
                        <RichTextEditor
                            value={text}
                            onChange={setText}
                            placeholder="Type your message here..."
                            onAddMedia={onAddMedia}
                            variables={['name', 'email', 'order_id']}
                            modalRef={modalRef}
                        />
                    </Suspense>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
}