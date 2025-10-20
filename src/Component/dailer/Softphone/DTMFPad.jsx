// /src/Component/dailer/Softphone/DTMFPad.jsx
import { Grid, Button, Paper } from '@mui/material';
import { useDialerStore } from '../../store/useDialerStore';

const keys = ['1','2','3','4','5','6','7','8','9','*','0','#'];

export default function DTMFPad() {
  const sendDtmf = useDialerStore(s => s.sendDtmf);
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Grid container spacing={1.5}>
        {keys.map((k) => (
          <Grid item xs={4} key={k}>
            <Button
              onClick={() => sendDtmf(k)}
              fullWidth
              variant="outlined"
              sx={{ py: 1.5, fontSize: '1.1rem' }}
            >
              {k}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
