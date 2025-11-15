import React from 'react';
import { Box, Paper, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import { ArrowUp, ArrowDown, Copy, X, Eye, EyeOff } from 'lucide-react';
import { humanDelay } from '../utils.js';

export default function BranchRow({
  branch,
  idx,
  selected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
  onToggleDisabled
}) {

  const handleAction = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <Paper
      elevation={selected ? 3 : 1}
      onClick={onSelect}
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 1,
        alignItems: 'center',
        p: '8px 10px',
        cursor: 'pointer',
        opacity: branch.disabled ? 0.6 : 1,
        border: selected ? 2 : 1,
        borderColor: selected ? 'primary.main' : 'divider',
        '&:hover': {
          backgroundColor: 'action.hover'
        }
      }}
    >
      <Box sx={{ display: 'grid', gap: 0.5, overflow: 'hidden' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          <Chip size="small" label={branch.isElse ? 'ELSE' : (idx === 0 ? 'IF' : 'ELSE IF')} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {branch.label || '(unnamed)'}
          </Typography>
        </Box>
        <Box sx={{ display: 'inline-flex', flexWrap: 'wrap', gap: 1, color: 'text.secondary', fontSize: 12 }}>
          {!branch.isElse && 
            <Typography variant="caption" noWrap title={branch.condition} sx={{ maxWidth: 300 }}>
              {branch.condition || '—'}
            </Typography>
          }
          <Typography variant="caption">Delay: {humanDelay(branch.delay)}</Typography>
          {branch.target && <Typography variant="caption">→ {branch.target}</Typography>}
        </Box>
      </Box>

      <Box sx={{ display: 'inline-flex', gap: 0.5 }}>
        <Tooltip title="Move up"><IconButton size="small" onClick={(e) => handleAction(e, onMoveUp)}><ArrowUp size={16} /></IconButton></Tooltip>
        <Tooltip title="Move down"><IconButton size="small" onClick={(e) => handleAction(e, onMoveDown)}><ArrowDown size={16} /></IconButton></Tooltip>
        <Tooltip title="Duplicate"><IconButton size="small" onClick={(e) => handleAction(e, onDuplicate)}><Copy size={16} /></IconButton></Tooltip>
        <Tooltip title={branch.disabled ? 'Enable' : 'Disable'}><IconButton size="small" onClick={(e) => handleAction(e, onToggleDisabled)}>{branch.disabled ? <EyeOff size={16} /> : <Eye size={16} />}</IconButton></Tooltip>
        <Tooltip title="Remove"><IconButton size="small" onClick={(e) => handleAction(e, onRemove)}><X size={16} /></IconButton></Tooltip>
      </Box>
    </Paper>
  );
}
