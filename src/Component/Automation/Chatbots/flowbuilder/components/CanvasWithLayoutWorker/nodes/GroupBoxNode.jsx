import React from 'react';
import { NodeResizer } from 'reactflow';
import { Box, Typography } from '@mui/material';

export default function GroupBoxNode({ selected }) {
  return (
    <Box
      sx={{
        backgroundColor: 'grey.100',
        padding: '6px',
        height: '100%',
        border: 1,
        borderColor: 'divider'
      }}
    >
      <NodeResizer isVisible={selected} minWidth={240} minHeight={120} />
      <Typography
        sx={{
          fontWeight: 600,
          color: 'text.secondary',
          p: '6px 8px'
        }}
      >
        Group
      </Typography>
    </Box>
  );
}
