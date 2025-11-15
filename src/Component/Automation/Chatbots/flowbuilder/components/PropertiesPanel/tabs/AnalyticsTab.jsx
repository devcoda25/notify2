import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Stack, TextField } from '@mui/material';

export default function AnalyticsTab() {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <Stack spacing={3} sx={{ p: 1 }}>
      <TextField 
        {...register('eventName')} 
        label="Event Name"
        fullWidth
        size="small"
      />

      <TextField 
        {...register('propertiesJson')} 
        label="Properties (JSON)"
        multiline
        rows={6}
        fullWidth
        size="small"
        error={!!errors.propertiesJson}
        helperText={errors.propertiesJson ? String(errors.propertiesJson.message) : null}
      />
    </Stack>
  );
}