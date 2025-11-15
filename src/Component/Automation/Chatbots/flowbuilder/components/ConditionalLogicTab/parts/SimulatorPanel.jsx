import React, { useMemo, useState } from 'react';
import { Box, Button, TextField, Paper, Typography } from '@mui/material';
import { safeEval, defaultHelpers } from '../../ExpressionBuilder/evaluator/safeEval.js';

export default function SimulatorPanel({
  branches,
  initial,
  onMatch
}) {
  const [json, setJson] = useState(() => JSON.stringify(initial ?? {}, null, 2));
  const [result, setResult] = useState('');

  const elseIndex = useMemo(() => branches.findIndex(b => b.isElse), [branches]);

  function run() {
    try {
      const ctx = json.trim() ? JSON.parse(json) : {};
      const lib = defaultHelpers();
      let matched = null;
      for (let i = 0; i < branches.length; i++) {
        const b = branches[i];
        if (b.disabled) continue;
        if (b.isElse) { matched = matched ?? i; break; }
        const ok = Boolean(safeEval(b.condition || 'false', ctx, lib));
        if (ok) { matched = i; break; }
      }
      if (matched == null && elseIndex >= 0 && !branches[elseIndex].disabled) {
        matched = elseIndex;
      }
      setResult(matched == null ? 'No branch matched' : `Matched: #${matched + 1} — ${branches[matched].label || (branches[matched].isElse ? 'ELSE' : '')}`);
      onMatch?.(matched);
    } catch (e) {
      setResult(`Error: ${e?.message ?? String(e)}`);
      onMatch?.(null);
    }
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr auto' }, gap: 1 }}>
      <TextField
        multiline
        minRows={5}
        value={json}
        onChange={(e) => setJson(e.target.value)}
        placeholder='{"country":"US","age":21,"message":"refund please"}'
        variant="outlined"
        fullWidth
        sx={{ 
          '& .MuiInputBase-input': {
            fontFamily: 'monospace',
            fontSize: 12,
          }
        }}
      />
      <Box sx={{ display: 'grid', gap: 1, alignContent: 'start' }}>
        <Button variant="contained" onClick={run}>Test</Button>
        <Paper 
          variant="outlined"
          aria-live="polite"
          sx={{ p: '6px 8px', minHeight: 34, backgroundColor: 'grey.100' }}
        >
          <Typography variant="body2">{result || 'Result will appear here'}</Typography>
        </Paper>
      </Box>
    </Box>
  );
}
