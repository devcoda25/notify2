import { memo } from 'react';
import { Grid, Button } from '@mui/material';
import { useDialerStore } from '../store/useDialerStore';

const KEYS = ['1','2','3','4','5','6','7','8','9','*','0','#'];

function SoftphoneKeypadImpl() {
  const {
    callStatus, consulting, consultStage,
    appendDigit, consultAppendDigit, sendDtmf
  } = useDialerStore(s => ({
    callStatus: s.callStatus,
    consulting: s.consulting,
    consultStage: s.consultStage,
    appendDigit: s.appendDigit,
    consultAppendDigit: s.consultAppendDigit,
    sendDtmf: s.sendDtmf
  }));

  const useDtmf =
    callStatus === 'in-call' &&
    (!consulting || consultStage === 'active');

  const onPress = (k) => {
    if (useDtmf) sendDtmf(k);
    else if (consulting) consultAppendDigit(k);
    else appendDigit(k);
  };

  return (
    <Grid container spacing={1} sx={{ userSelect: 'none' }} aria-label="Dial pad">
      {KEYS.map((k) => (
        <Grid key={k} item xs={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => onPress(k)}
            sx={{
              height: 56, borderRadius: 1, fontWeight: 700, lineHeight: 1,
              fontSize: (k === '*' || k === '#') ? 24 : 18,
              backgroundColor: 'primary.main',
              '&:hover': { backgroundColor: 'primary.dark' }
            }}
            aria-label={k === '*' ? 'Star' : k === '#' ? 'Hash' : `Digit ${k}`}
          >
            {k}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

export default memo(SoftphoneKeypadImpl);
