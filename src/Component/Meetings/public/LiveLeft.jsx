// Path: /src/Component/Meetings/public/LiveLeft.jsx
import React, { useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../../../theme/notifyTheme";

import {
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { alpha, useTheme } from "@mui/material/styles";
import {
  DoorOpen,
  RotateCcw,
  HelpCircle,
  MessageSquare,
  Info,
} from "lucide-react";

export default function LiveLeft() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mui = useTheme();

  // Reason forwarded from notify-live via navigate(..., { state: { reason }})
  const reason = (location.state && location.state.reason) || "";

  // Show “Rejoin” only if it wasn’t explicitly ended
  const canRejoin = useMemo(() => !/ended/i.test(reason), [reason]);

  // Notes dialog
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesText, setNotesText] = useState("");
  const [sent, setSent] = useState(false);

  const rejoin = () => {
    if (!roomId) return navigate("/live/invalid", { replace: true });
    navigate(`/live/${roomId}`);
  };

  const submitNotes = () => {
    // TODO: wire to backend
    // eslint-disable-next-line no-console
    console.log("Additional notes for host:", { roomId, reason, notes: notesText.trim() });
    setSent(true);
    setTimeout(() => {
      setNotesOpen(false);
      setNotesText("");
      setSent(false);
    }, 900);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Stack sx={{ maxWidth: 960, mx: "auto", px: 2, py: { xs: 4, md: 6 } }} gap={3}>
        {/* Header card */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            borderColor: (t) => alpha(t.palette.primary.main, 0.22),
            background: (t) =>
              `linear-gradient(180deg, ${alpha(
                t.palette.primary.light,
                0.10
              )} 0%, ${alpha(t.palette.primary.main, 0.04)} 100%)`,
          }}
        >
          <Stack gap={1.5}>
            <Stack direction="row" alignItems="center" gap={1}>
              <DoorOpen size={20} />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                You left the meeting
              </Typography>
            </Stack>

            {reason ? (
              <Stack
                direction="row"
                alignItems="flex-start"
                gap={1}
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  bgcolor: alpha(mui.palette.primary.main, 0.06),
                  border: `1px solid ${alpha(mui.palette.primary.main, 0.16)}`,
                }}
              >
                <Info size={16} style={{ marginTop: 2 }} />
                <Typography variant="body2">{reason}</Typography>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Your session has ended on this device.
              </Typography>
            )}

            <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                If the call is still active, you can rejoin using the same link.
              </Typography>
              {roomId && <Chip size="small" label={`Room: ${roomId}`} />}
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              gap={1}
              sx={{ mt: 0.5, "& > *": { minWidth: 180 } }}
            >
              {canRejoin && (
                <Button
                  variant="contained"
                  onClick={rejoin}
                  startIcon={<RotateCcw size={16} />}
                >
                  Rejoin meeting
                </Button>
              )}
              <Button
                variant={canRejoin ? "outlined" : "contained"}
                onClick={() => setNotesOpen(true)}
                startIcon={<MessageSquare size={16} />}
              >
                Add notes for the host
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Helpful tips */}
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <Stack gap={1.25}>
            <Stack direction="row" alignItems="center" gap={0.75}>
              <HelpCircle size={16} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Quick tips
              </Typography>
            </Stack>

            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                If you still need to share details, use <strong>Add notes for the host</strong> above.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                To rejoin, open the original link (e.g. <code>/live/abc-defg-hij</code>).
              </Typography>
              <Typography component="li" variant="body2">
                Close other apps that might be using your mic/camera before rejoining.
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Session URL: <code>{location.pathname}</code>
            </Typography>
          </Stack>
        </Paper>
      </Stack>

      {/* Notes popup */}
      <Dialog open={notesOpen} onClose={() => setNotesOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add notes for the host</DialogTitle>
        <DialogContent dividers>
          {sent ? (
            <Stack
              gap={1}
              sx={{
                p: 1.25,
                borderRadius: 2,
                bgcolor: alpha(mui.palette.primary.main, 0.06),
                border: `1px solid ${alpha(mui.palette.primary.main, 0.16)}`,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Thanks — your notes were saved.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                You can close this window now.
              </Typography>
            </Stack>
          ) : (
            <Stack gap={1.5}>
              <Typography variant="body2" color="text.secondary">
                Share anything you forgot to mention or any additional details the host should know.
              </Typography>
              <TextField
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="e.g., Please send the pricing deck; I prefer mornings; follow up on ticket #4821…"
                multiline
                minRows={5}
                autoFocus
                fullWidth
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={submitNotes}
            disabled={sent || notesText.trim().length < 3}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
