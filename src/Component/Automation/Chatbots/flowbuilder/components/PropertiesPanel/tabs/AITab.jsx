import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Stack, TextField } from '@mui/material';

export default function AITab() {
  const { register } = useFormContext();
  
  return (
    <Stack spacing={3} sx={{ p: 1 }}>
      <TextField 
        {...register('model')} 
        label="Model"
        placeholder="e.g., gpt-4o-mini or internal-model" 
        fullWidth
        size="small"
      />

      <TextField 
        type="number"
        {...register('temperature', { valueAsNumber: true })}
        label="Temperature"
        fullWidth
        size="small"
        inputProps={{
          step: 0.1,
          min: 0,
          max: 1
        }}
      />

      <TextField 
        {...register('systemPrompt')} 
        label="System Prompt"
        multiline
        rows={5}
        fullWidth
        size="small"
      />
    </Stack>
  );
}