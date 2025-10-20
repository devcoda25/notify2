import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { Trash2, X } from "lucide-react";

export default function DeleteConfirmModal({ open, onClose, onConfirm, count = 1 }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete {count > 1 ? `${count} contacts` : "contact"}?</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary">
          This action can’t be undone. {count > 1 ? "Selected contacts" : "The contact"} will be removed from the list.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<X size={16} />} onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" startIcon={<Trash2 size={16} />} onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
