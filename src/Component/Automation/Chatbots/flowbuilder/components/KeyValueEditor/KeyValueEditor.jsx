import React from 'react';
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import { Trash2 } from 'lucide-react';

export default function KeyValueEditor({
  label,
  items = [],
  onChange,
  placeholderKey = 'key',
  placeholderValue = 'value'
}) {
  const update = (idx, patch) => {
    const next = items.map((r, i) => (i === idx ? { ...r, ...patch } : r));
    onChange(next);
  };
  const add = () => onChange([...(items || []), { key: '', value: '' }]);
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));

  return (
    <Stack spacing={1}>
      {label && <Typography variant="caption" color="text.secondary">{label}</Typography>}
      <Stack spacing={1}>
        {items.map((r, i) => (
          <Stack direction="row" spacing={1} key={i} alignItems="center">
            <TextField
              placeholder={placeholderKey}
              value={r.key}
              onChange={(e) => update(i, { key: e.target.value })}
              size="small"
              fullWidth
            />
            <TextField
              placeholder={placeholderValue}
              value={r.value}
              onChange={(e) => update(i, { value: e.target.value })}
              size="small"
              fullWidth
            />
            <IconButton onClick={() => remove(i)} aria-label="Remove item">
                <Trash2 size={16} />
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <Box>
        <Button variant="outlined" size="small" onClick={add} type="button">
          + Add
        </Button>
      </Box>
    </Stack>
  );
}