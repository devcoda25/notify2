// Path: /src/Component/Meetings/public/LiveInvalid.jsx
import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../../../theme/notifyTheme";

import {
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Divider,
  Chip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertTriangle, Keyboard, Link2, Mail, HelpCircle } from "lucide-react";
import { alpha } from "@mui/material/styles";

export default function LiveInvalid() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");

  const join = () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    navigate(`/live/${trimmed}`);
  };

  // If user landed here from a bad URL, show last path segment for context
  const lastSegment = location.pathname.split("/").filter(Boolean).pop();
  const maybeBadCode = lastSegment && lastSegment !== "invalid" ? lastSegment : "";

  return (

      <Stack sx={{ maxWidth: 960, mx: "auto", px: 2, py: { xs: 4, md: 6 } }} gap={3}>
        {/* Alert block */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            borderColor: (t) => alpha(t.palette.error.main, 0.25),
            background: (t) =>
              `linear-gradient(180deg, ${alpha(
                t.palette.error.light,
                0.12
              )} 0%, ${alpha(t.palette.error.main, 0.06)} 100%)`,
          }}
        >
          <Stack gap={1.25}>
            <Stack direction="row" alignItems="center" gap={1}>
              <AlertTriangle size={20} color={theme.palette.error.main} />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Can’t open this meeting
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              The meeting link or code appears to be invalid, expired, or no longer available.
              This service is invite-only — attendees can join only with a valid code or link from the organizer.
            </Typography>

            {!!maybeBadCode && (
              <Chip
                label={`Tried: ${maybeBadCode}`}
                variant="outlined"
                color="error"
                size="small"
                sx={{ alignSelf: "flex-start" }}
              />
            )}
          </Stack>
        </Paper>

        {/* Join by code/link */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            borderColor: (t) => alpha(t.palette.primary.main, 0.2),
            background: (t) =>
              `linear-gradient(180deg, ${alpha(
                t.palette.primary.light,
                0.10
              )} 0%, ${alpha(t.palette.primary.main, 0.04)} 100%)`,
          }}
        >
          <Stack gap={1.25}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              Join with a code or link
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} gap={1.25} alignItems={{ xs: "stretch", sm: "center" }}>
              <TextField
                fullWidth
                size="medium"
                placeholder="Paste your meeting code or link"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Keyboard size={16} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="contained" onClick={join} disabled={!code.trim()} sx={{ px: 3 }}>
                Join
              </Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Tips */}
            <Stack gap={1}>
              <Stack direction="row" alignItems="center" gap={0.75}>
                <HelpCircle size={16} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Tips
                </Typography>
              </Stack>

              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Meeting codes look like <code>abc-defg-hij</code> (letters and dashes only).
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  You can paste a full link like <code>https://yourapp.com/live/abc-defg-hij</code>.
                </Typography>
                <Typography component="li" variant="body2">
                  Open the original invite from your email or chat to avoid typos.
                </Typography>
              </Box>

              <Stack direction="row" alignItems="center" gap={0.75} sx={{ mt: 1 }}>
                <Link2 size={16} />
                <Typography variant="caption" color="text.secondary">
                  Don’t have a link? Ask the organizer to resend your invite. New meetings cannot be created by guests.
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        {/* Contact organizer hint (no navigation out) */}
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Mail size={16} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Need help?
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            Contact the meeting organizer to verify your access or to receive a fresh link.
          </Typography>
        </Paper>
      </Stack>
  );
}
