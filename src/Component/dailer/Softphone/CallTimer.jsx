import { useEffect, useRef, useState } from 'react';
import { Chip, Stack, Typography } from '@mui/material';
import { useDialerStore } from '../store/useDialerStore';

function fmt(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * CallTimer
 * - mode="text": shows ticking time (ringing or call)
 * - mode="chip": status chip
 */
export default function CallTimer({ mode = 'text', align = 'right' }) {
  const callStatus    = useDialerStore((s) => s.callStatus || 'idle');
  const callStartedAt = useDialerStore((s) => s.callStartedAt || null);
  const ringStartedAt = useDialerStore((s) => s.ringStartedAt || null);

  const [now, setNow] = useState(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    clearInterval(timerRef.current);
    const shouldTick =
      (callStatus?.startsWith('ringing') && ringStartedAt) ||
      (callStatus === 'in-call' && callStartedAt);
    if (shouldTick) {
      timerRef.current = setInterval(() => setNow(Date.now()), 1000);
    } else {
      setNow(Date.now());
    }
    return () => clearInterval(timerRef.current);
  }, [callStatus, callStartedAt, ringStartedAt]);

  const base =
    (callStatus === 'in-call' && callStartedAt) ? callStartedAt
    : (callStatus?.startsWith('ringing') && ringStartedAt) ? ringStartedAt
    : null;

  const elapsedMs = base ? (now - base) : 0;

  if (mode === 'chip') {
    const color =
      callStatus === 'in-call' ? 'success'
      : callStatus?.startsWith('ringing') ? 'warning'
      : 'default';

    const label =
      callStatus === 'in-call' ? `On Call • ${fmt(elapsedMs)}`
      : callStatus?.startsWith('ringing') ? `Ringing… • ${fmt(elapsedMs)}`
      : callStatus === 'ended' ? 'Call Ended'
      : 'Idle';

    return (
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">Call Status</Typography>
        <Chip label={label} color={color} size="small" />
      </Stack>
    );
  }

  return (
    <Typography
      variant="body2"
      sx={{ fontWeight: 600, minWidth: 64, textAlign: align, fontVariantNumeric: 'tabular-nums' }}
      aria-label="call duration"
    >
      {fmt(elapsedMs)}
    </Typography>
  );
}
