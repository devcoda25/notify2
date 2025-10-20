import { useEffect, useState } from 'react';
import { Chip } from '@mui/material';
import { useDialerStore } from '../../store/useDialerStore';

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
 * Accurate across pause/resume:
 * - total = recordAccumMs + (recording === 'on' ? Date.now() - recordStartedAt : 0)
 * - ticks every 1s while recording, stops ticking when paused/off (value stays static)
 */
export default function RecordingTimer({ chip = true }) {
  const recording       = useDialerStore(s => s.recording);        // 'off' | 'on' | 'paused'
  const recordStartedAt = useDialerStore(s => s.recordStartedAt);  // ms | null
  const recordAccumMs   = useDialerStore(s => s.recordAccumMs);    // ms

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let id;
    // tick ONLY when recording, so the UI updates without needing user interaction
    if (recording === 'on') {
      id = setInterval(() => setNow(Date.now()), 1000);
    } else {
      // force one refresh on transitions to keep display exact at boundary
      setNow(Date.now());
    }
    return () => clearInterval(id);
  }, [recording, recordStartedAt]);

  const live  = (recording === 'on' && recordStartedAt) ? (now - recordStartedAt) : 0;
  const total = recordAccumMs + live;

  if (!chip) return fmt(total);

  // RED BORDER ONLY when recording; not a solid red fill
  return (
    <Chip
      size="small"
      variant="outlined"
      color={recording === 'on' ? 'error' : 'default'}
      label={`REC ${fmt(total)}`}
      sx={{
        borderColor: recording === 'on' ? 'error.main' : 'divider'
      }}
    />
  );
}
