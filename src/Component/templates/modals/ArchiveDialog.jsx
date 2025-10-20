// Path: src/Component/templates/modals/ArchiveDialog.jsx
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, TextField, MenuItem, FormControlLabel, Checkbox, Alert
} from "@mui/material";
import { Archive, Ban, AlertTriangle, Eye, Calendar } from "lucide-react";

/**
 * Props:
 * - open: boolean
 * - template: { id, name } | null
 * - onClose: () => void
 * - onConfirm: ({ action, reason, keepVisibleUntil, keepVisible }) => void
 */
export default function ArchiveDialog({ open, template, onClose, onConfirm }) {
  const [action, setAction] = React.useState("deprecate"); // 'deprecate' | 'archive'
  const [reason, setReason] = React.useState("");
  const [keepVisible, setKeepVisible] = React.useState(true);
  const [keepVisibleUntil, setKeepVisibleUntil] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setAction("deprecate");
      setReason("");
      setKeepVisible(true);
      setKeepVisibleUntil("");
    }
  }, [open]);

  const canConfirm = !!template && (action === "deprecate" || action === "archive");
  const TitleIcon = action === "archive" ? Archive : Ban;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TitleIcon size={18} />
        {action === "archive" ? "Archive Template" : "Deprecate Template"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            select
            label="Action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            <MenuItem value="deprecate">
              <Ban size={14} style={{ marginRight: 8 }} /> Deprecate (stop new use, keep visible)
            </MenuItem>
            <MenuItem value="archive">
              <Archive size={14} style={{ marginRight: 8 }} /> Archive (remove from lists & usage)
            </MenuItem>
          </TextField>

          <Alert
            severity={action === "archive" ? "warning" : "info"}
            icon={<AlertTriangle size={16} />}
          >
            {action === "archive"
              ? "Archiving hides this template from lists and prevents any further use."
              : "Deprecating prevents new use but keeps the template visible in history and read-only previews."}
          </Alert>

          <TextField
            label="Reason / Notes"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            minRows={3}
            placeholder={`Why ${action}? (optional but recommended)`}
          />

          {action === "deprecate" && (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={keepVisible}
                    onChange={(e) => setKeepVisible(e.target.checked)}
                  />
                }
                label={<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Eye size={14} /> Keep template visible in library
                </span>}
              />
              <TextField
                label="Keep visible until (optional)"
                type="date"
                value={keepVisibleUntil}
                onChange={(e) => setKeepVisibleUntil(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{ startAdornment: <Calendar size={14} style={{ marginRight: 8 }} /> }}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color={action === "archive" ? "warning" : "primary"}
          variant="contained"
          startIcon={action === "archive" ? <Archive size={16} /> : <Ban size={16} />}
          disabled={!canConfirm}
          onClick={() =>
            onConfirm?.({
              action,
              reason: reason?.trim() || null,
              keepVisible: action === "deprecate" ? keepVisible : false,
              keepVisibleUntil: action === "deprecate" && keepVisibleUntil ? keepVisibleUntil : null,
            })
          }
        >
          {action === "archive" ? "Archive" : "Deprecate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
