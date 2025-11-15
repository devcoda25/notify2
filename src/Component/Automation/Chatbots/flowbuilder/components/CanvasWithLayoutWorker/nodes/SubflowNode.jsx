import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Paper, Typography } from '@mui/material';
import NodeAvatars from '../../Presence/NodeAvatars.jsx';

export default function SubflowNode({ id, selected }) {
  return (
    <Paper
      elevation={selected ? 4 : 1}
      sx={{
        borderRadius: 1.5,
        border: 1,
        borderColor: 'divider',
        width: 320,
        transition: 'box-shadow 0.2s ease-in-out',
        boxShadow: selected ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' : 1,
      }}
    >
      <NodeAvatars nodeId={id} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: '8px 12px',
          borderBottom: 1,
          borderColor: 'divider',
          borderTopLeftRadius: 'inherit',
          borderTopRightRadius: 'inherit',
        }}
      >
        <Typography component="span" sx={{ mr: 1 }}>🗂️</Typography>
        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Sub-flow</Typography>
      </Box>
      <Box sx={{ p: '12px 14px', fontSize: 14, color: 'text.secondary' }}>
        <Typography variant="body2">Double-click to drill-down</Typography>
      </Box>
      <Handle type="target" position={Position.Left} style={{ width: 10, height: 10, background: '#fff', border: '2px solid #ddd', borderRadius: '50%' }} />
      <Handle type="source" position={Position.Right} style={{ width: 10, height: 10, background: '#fff', border: '2px solid #ddd', borderRadius: '50%' }} />
    </Paper>
  );
}
