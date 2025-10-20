import React, { useState, useEffect, Suspense } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { lazy } from 'react';

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl" ref={modalRef}>
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
          <DialogDescription>Modify the rich text content of your message below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="message-text">Message Content</Label>
            <Suspense fallback={<div className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2">Loading editor...</div>}>
              <RichTextEditor
                value={text}
                onChange={setText}
                placeholder="Type your message here..."
                onAddMedia={onAddMedia}
                variables={['name', 'email', 'order_id']}
                modalRef={modalRef}
              />
            </Suspense>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
