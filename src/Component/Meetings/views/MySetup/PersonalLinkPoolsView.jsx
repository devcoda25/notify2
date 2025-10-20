// Path: /src/Component/Meetings/views/MySetup/PersonalLinkPoolsView.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  Divider,
  Paper,
  TextField,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Copy, Link2 } from "lucide-react";

import { usePoolsStore } from "../../../store/scheduling/usePoolsStore";
import { useEventTypesStore } from "../../../store/scheduling/useEventTypesStore";
import PersonalLinkCard from "../../components/PersonalLinkCard";

export default function PersonalLinkPoolsView() {
  const theme = useTheme();
  const pools = usePoolsStore();
  const ets = useEventTypesStore();

  useEffect(() => {
    pools.loaded || pools.loadFixtures();
    ets.loaded || ets.loadFixtures();
  }, [pools, ets]);

  const [ownerType, setOwnerType] = useState("user");
  const [ownerId, setOwnerId] = useState("usr_alpha");
  const [eventTypeId, setEventTypeId] = useState(() => ets.eventTypes?.[0]?.id || "");

  useEffect(() => {
    if (!eventTypeId && ets.eventTypes?.length) setEventTypeId(ets.eventTypes[0].id);
  }, [ets.eventTypes, eventTypeId]);

  const eventType = useMemo(() => ets.getById?.(eventTypeId), [ets, eventTypeId]);
  const url = useMemo(() => {
    const slug = eventType?.slug || "intro-15";
    return ownerType === "pool"
      ? `https://cal.example.com/team/${slug}`
      : `https://cal.example.com/alpha/${slug}`;
  }, [ownerType, eventType]);

  return (
    <Stack gap={2}>
      <Typography variant="h6">Personal Link & Pools</Typography>
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
        <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
          <TextField select label="Owner Type" value={ownerType} onChange={(e) => setOwnerType(e.target.value)}>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="pool">Pool</MenuItem>
          </TextField>

          {ownerType === "user" ? (
            <TextField
              label="User ID"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              sx={{ minWidth: 260 }}
            />
          ) : (
            <TextField
              select
              label="Pool"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              sx={{ minWidth: 260 }}
            >
              {(pools.pools || []).map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            select
            label="Event Type"
            value={eventTypeId}
            onChange={(e) => setEventTypeId(e.target.value)}
            sx={{ minWidth: 260 }}
          >
            {(ets.eventTypes || []).map((et) => (
              <MenuItem key={et.id} value={et.id}>
                {et.name} <Chip size="small" label={`${et.durationMinutes}m`} sx={{ ml: 1 }} />
              </MenuItem>
            ))}
          </TextField>

          <Tooltip title="Copy URL">
            <IconButton
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(url);
                } catch {}
              }}
            >
              <Copy size={18} />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<Link2 size={16} />}
            onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
          >
            Open
          </Button>
        </Stack>
      </Paper>

      <PersonalLinkCard title="Public Booking Link" url={url} ownerLabel={`${ownerType}:${ownerId}`} />

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Tips
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            Use <code>?prefill_email=</code> and <code>?prefill_name=</code> to pre-populate the booking form.
          </li>
          <li>For pools, share the team link to auto-assign via round-robin or least-load.</li>
          <li>You can create vanity slugs on the Event Types page for easy URLs.</li>
        </ul>
        <Stack direction="row" gap={1} alignItems="center" sx={{ mt: 1 }}>
          <Link2 size={16} />
          <code>{url}</code>
        </Stack>
      </Paper>
    </Stack>
  );
}
