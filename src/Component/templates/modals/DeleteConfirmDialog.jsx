// Path: src/Component/templates/modals/DeleteConfirmDialog.jsx
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, TextField, Alert
} from "@mui/material";
import { Trash2, AlertTriangle } from "lucide-react";

/**
 * Props:
 * - open: boolean
 * - template: { id, name } | null
 * - onClose: () => void
 * - onConfirm: () => void
 */
export default function DeleteConfirmDialog({ open, template, onClose, onConfirm }) {
  const [typed, setTyped] = React.useState("");

  React.useEffect(() => {
    if (!open) setTyped("");
  }, [open]);

  const mustType = template?.name || "template";
  const ok = typed.trim() === mustType;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Trash2 size={18} /> Delete Template
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Alert severity="error" icon={<AlertTriangle size={16} />}>
            This action is permanent. To confirm, type the template name:
            <b> {mustType}</b>
          </Alert>
          <TextField
            autoFocus
            label="Type template name to confirm"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="error"
          variant="contained"
          startIcon={<Trash2 size={16} />}
          disabled={!ok}
          onClick={onConfirm}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
