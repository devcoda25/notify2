import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Stack, TextField } from '@mui/material';

export default function HandoffTab() {
  const { register } = useFormContext();
  
  return (
    <Stack spacing={3} sx={{ p: 1 }}>
      <TextField 
        {...register('queue')} 
        label="Queue"
        fullWidth
        size="small"
      />

      <TextField 
        type="number"
        {...register('priority', { valueAsNumber: true })}
        label="Priority (0–10)"
        fullWidth
        size="small"
        inputProps={{
          min: 0,
          max: 10
        }}
      />

      <TextField 
        {...register('note')} 
        label="Note"
        multiline
        rows={4}
        fullWidth
        size="small"
      />
    </Stack>
  );
}