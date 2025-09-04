import { Box, Typography } from '@mui/material';
import { useDialerStore } from '../store/useDialerStore';

export default function InlineCallToast() {
  const toast = useDialerStore((s) => s.inlineToast);
  if (!toast) return null;
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 12,
        left: 16,
        right: 16,
        px: 1.25,
        py: 0.5,
        borderRadius: 1,
        bgcolor: 'rgba(0,0,0,0.06)',
        textAlign: 'center',
      }}
    >
      <Typography variant="caption" sx={{ opacity: 0.8 }}>
        {toast.msg}
      </Typography>
    </Box>
  );
}
