// Path: /src/Component/Meetings/views/Focus/PoolSchedulesView.jsx
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
  CircularProgress,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { CalendarRange, Shuffle } from "lucide-react";

import { usePoolsStore } from "../../../store/scheduling/usePoolsStore";
import { useAvailabilityStore } from "../../../store/scheduling/useAvailabilityStore";
import SlotPicker from "../../components/SlotPicker";

function addDays(dateStr, delta) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

export default function PoolSchedulesView() {
  const theme = useTheme();
  const pools = usePoolsStore();
  const av = useAvailabilityStore();

  const [poolId, setPoolId] = useState("");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [rangeDays, setRangeDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState({ days: {}, slotSizeMinutes: 30 });

  useEffect(() => {
    pools.loaded || pools.loadFixtures();
    av.loaded || av.loadFixtures();
  }, [pools, av]);

  useEffect(() => {
    if (!poolId && pools.pools?.length) setPoolId(pools.pools[0].id);
  }, [poolId, pools.pools]);

  const pool = useMemo(() => pools.getById?.(poolId), [pools, poolId]);
  const endDate = useMemo(() => addDays(startDate, rangeDays - 1), [startDate, rangeDays]);

  const compute = async () => {
    if (!pool) return;
    setLoading(true);
    const res = await av.computeSlots(
      { ownerType: "pool", ownerId: pool.id },
      { startDate, endDate },
      { slotSizeMinutes: 30, bufferBeforeMinutes: 5, bufferAfterMinutes: 5 }
    );
    setSlots(res);
    setLoading(false);
  };

  useEffect(() => {
    if (pool) compute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolId, startDate, rangeDays]);

  const nextRoundRobin = pool ? pools.pickMemberRoundRobin(pool.id) : null;

  return (
    <Stack gap={2}>
      <Typography variant="h6">Pool Schedules</Typography>
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
        <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            select
            label="Pool"
            value={poolId}
            onChange={(e) => setPoolId(e.target.value)}
            sx={{ minWidth: 260 }}
          >
            {(pools.pools || []).map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Start date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Range"
            value={rangeDays}
            onChange={(e) => setRangeDays(Number(e.target.value))}
          >
            {[7, 14, 21, 28].map((d) => (
              <MenuItem key={d} value={d}>
                {d} days
              </MenuItem>
            ))}
          </TextField>

          <Chip icon={<CalendarRange size={14} />} label={`${startDate} → ${endDate}`} />
          <Button
            startIcon={<Shuffle size={16} />}
            onClick={() => pools.resetLoadTracking(pool?.id)}
            disabled={!pool}
            variant="outlined"
          >
            Reset round-robin
          </Button>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Combined Pool Availability
        </Typography>
        {loading ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack gap={1}>
            {Object.entries(slots.days || {}).map(([date, arr]) => (
              <Stack key={date} gap={0.5}>
                <Typography variant="caption" color="text.secondary">
                  {date}
                </Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {arr.length === 0 && <Chip size="small" label="—" />}
                  {arr.map((s, i) => (
                    <Chip
                      key={i}
                      size="small"
                      sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}
                      label={`${new Date(s.start).toISOString().slice(11, 16)}–${new Date(s.end)
                        .toISOString()
                        .slice(11, 16)} UTC`}
                    />
                  ))}
                </Stack>
                <Divider sx={{ my: 1 }} />
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Pick Slot (Team Link)
        </Typography>
        {pool ? (
          <SlotPicker
            owner={{ ownerType: "pool", ownerId: pool.id }}
            onPick={() => {
              /* consumer handles booking; this is view-only */
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Select a pool to preview slots.
          </Typography>
        )}
      </Paper>

      {pool && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            borderColor: (t) => alpha(t.palette.primary.main, 0.25),
            bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Next Assignment (Round-robin)
          </Typography>
          <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
            <Chip label={`Pool: ${pool.name}`} />
            {nextRoundRobin ? (
              <Chip color="success" label={`Next: ${nextRoundRobin.userId}`} />
            ) : (
              <Chip label="No active members" />
            )}
            <Chip label={`Members: ${(pool.members || []).length}`} />
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
