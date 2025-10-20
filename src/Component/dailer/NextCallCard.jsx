import { Card, CardContent, Stack, Avatar, Typography, Chip, Button } from '@mui/material';
import { useDialerStore } from '../store/useDialerStore'; // adjust if needed

export default function NextCallCard() {
  const { nextLead, shuffleNextLead, setNumber, startCall } = useDialerStore(s => ({
    nextLead: s.nextLead,
    shuffleNextLead: s.shuffleNextLead,
    setNumber: s.setNumber,
    startCall: s.startCall,
  }));

  const dialNext = () => {
    if (!nextLead?.mobile) return;
    setNumber(nextLead.mobile.replace(/\s+/g, ''));
    startCall(nextLead.mobile);
  };

  const skip = () => {
    // stub: record skip in log; in future, open modal for reason
    console.log('Skipped next lead');
    shuffleNextLead();
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={1.2}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Avatar alt={nextLead?.name} />
            <Stack>
              <Typography fontWeight={600}>{nextLead?.name}</Typography>
              <Typography variant="caption">Language: {nextLead?.language}</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}><Typography variant="caption">Place</Typography><Typography variant="body2">{nextLead?.place}</Typography></Stack>
          <Stack direction="row" spacing={1}><Typography variant="caption">Priority</Typography><Chip size="small" color="warning" label={nextLead?.priority} /></Stack>
          <Stack direction="row" spacing={1}><Typography variant="caption">Scheduled</Typography><Typography variant="body2">{nextLead?.scheduled}</Typography></Stack>
          <Stack direction="row" spacing={1}><Typography variant="caption">Mobile Number</Typography><Typography variant="body2">{nextLead?.mobile}</Typography></Stack>
          <Stack direction="row" spacing={1}><Typography variant="caption">Last Call</Typography><Typography variant="body2">{nextLead?.lastCall}</Typography></Stack>

          <Stack direction="row" spacing={1}>
            <Button onClick={dialNext} variant="contained" sx={{ flex: 1, textTransform: 'none' }}>
              Dial Next
            </Button>
            <Button onClick={shuffleNextLead} variant="outlined" sx={{ textTransform: 'none' }}>
              Shuffle
            </Button>
            <Button onClick={skip} variant="text" sx={{ textTransform: 'none' }}>
              Skip
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
