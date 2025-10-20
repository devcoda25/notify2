import { Box } from '@mui/material';
import { memo } from 'react';
import { useDialerStore } from '../../store/useDialerStore';

function barsFromMetrics({ mos, rttMs }) {
  if (mos != null) return mos >= 4.1 ? 4 : mos >= 3.8 ? 3 : mos >= 3.4 ? 2 : mos >= 3.0 ? 1 : 0;
  if (rttMs != null) return rttMs < 60 ? 4 : rttMs < 90 ? 3 : rttMs < 130 ? 2 : rttMs < 200 ? 1 : 0;
  return 2;
}

function SignalMetersImpl({ sx }) {
  const metrics = useDialerStore(s => s.metrics || {});
  const bars = Math.max(0, Math.min(4, barsFromMetrics(metrics)));

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, ...sx }}>
      {[0, 1, 2, 3].map(i => (
        <Box
          key={i}
          sx={{
            width: 5,
            height: 8 + i * 5,
            borderRadius: 1,
            bgcolor: i <= bars - 1 ? 'success.main' : 'action.disabled',
          }}
        />
      ))}
    </Box>
  );
}

export default memo(SignalMetersImpl);
