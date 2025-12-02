// Path: /src/Component/Meetings/views/MySetup/EmailPairingView.jsx
import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Divider,
  Paper,
  TextField,
  Button,
  Chip,
  Alert,
  LinearProgress,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import usersFixtures from "../../mocks/fixtures/users.fixtures.json";
// import * as notify from "../../mocks/adapters/notifications.mock";

export default function EmailPairingView() {
  const theme = useTheme();
  const me = usersFixtures.find((u) => u.id === "usr_alpha") || usersFixtures[0];
  const [email, setEmail] = useState(me?.email || "");
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [lastMsg, setLastMsg] = useState(null);

  useEffect(() => setEmail(me?.email || ""), [me?.email]);

  const sendTest = async () => {
    setStatus("sending");
    // DUMMY IMPLEMENTATION
    console.log(`[DUMMY] Sending test email to ${email}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const res = { providerMessageId: 'dummy-email-id-test', estimatedDeliveryAt: new Date().toISOString() };
    setLastMsg(res);
    setTimeout(() => setStatus("sent"), 400);
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6">Email Pairing</Typography>
      <Divider />
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          borderColor: (t) => alpha(t.palette.primary.main, 0.25),
          bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
        }}
      >
        <Stack gap={2}>
          <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              label="Your email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: <Mail size={16} style={{ marginRight: 6 }} />,
              }}
              helperText="We’ll send a mock test via the notifications adapter to verify delivery."
            />
            <Button startIcon={<Send />} variant="contained" onClick={sendTest} disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send test"}
            </Button>
            {status === "sent" && (
              <Chip color="success" icon={<CheckCircle2 size={14} />} label="Delivered (mock)" />
            )}
          </Stack>

          {status === "sending" && <LinearProgress />}

          {lastMsg && (
            <Alert
              severity="info"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.06),
                "& .MuiAlert-icon": { color: "primary.main" },
              }}
            >
              Provider ID: <strong>{lastMsg.providerMessageId}</strong> &nbsp; ETA: {lastMsg.estimatedDeliveryAt}
            </Alert>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
