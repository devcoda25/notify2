// Path: src/Component/Meetings/utils/ConfirmDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { AlertTriangle } from "lucide-react";

/**
 * Clean, reusable confirmation dialog (no browser alerts, no inputs).
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onConfirm: () => void
 * - title?: string                      (default: "Confirm action")
 * - message?: string | ReactNode        (default: "This action cannot be undone.")
 * - itemName?: string                   (optional emphasis, e.g. event type name)
 * - confirmText?: string                (default: "Confirm")
 * - cancelText?: string                 (default: "Cancel")
 * - confirmColor?: "error" | "primary" | "warning" | ... (default: "error")
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm action",
  message = "This action cannot be undone.",
  itemName,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "error",
}) {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="confirm-title">
      <DialogTitle id="confirm-title">{title}</DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(theme.palette.error.main, 0.12),
              color: theme.palette.error.main,
              mt: 0.25,
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={18} />
          </Box>
          <Box>
            {itemName && (
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                <strong>{itemName}</strong>
              </Typography>
            )}
            {typeof message === "string" ? (
              <Typography variant="body2" color="text.secondary">{message}</Typography>
            ) : (
              message
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="contained" color={confirmColor} autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
