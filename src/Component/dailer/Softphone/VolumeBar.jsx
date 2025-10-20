import { Box } from '@mui/material';

export default function VolumeBar({ level = 0, segments = 8, height = 96, width = 12, gap = 2, color = 'primary.main' }) {
  const segH = Math.floor((height - gap * (segments - 1)) / segments);
  const active = Math.round(level * segments);

  return (
    <Box sx={{ width, height, display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between' }}>
      {Array.from({ length: segments }).map((_, i) => {
        const on = i < active;
        return (
          <Box
            key={i}
            sx={{
              height: segH,
              borderRadius: 1,
              bgcolor: on ? color : 'action.hover',
            }}
          />
        );
      })}
    </Box>
  );
}
