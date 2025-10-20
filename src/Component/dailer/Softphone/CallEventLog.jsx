import { Paper, Stack, Typography } from '@mui/material';
import { useDialerStore } from '../../store/useDialerStore';

export default function CallEventLog() {
  const log = useDialerStore(s => s.log);
  if (!log?.length) return null;
  return (
    <Paper variant="outlined" sx={{ p: 1, maxHeight: 96, overflow: 'auto' }}>
      <Stack spacing={0.25}>
        {log.slice(-5).map((e, i) => (
          <Typography key={i} variant="caption" sx={{ opacity: 0.8 }}>
            {new Date(e.t).toLocaleTimeString()} — {e.msg}
          </Typography>
        ))}
      </Stack>
    </Paper>
  );
}
