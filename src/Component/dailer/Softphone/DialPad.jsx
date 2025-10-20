import { useEffect, useState } from 'react';
import { Stack, TextField, Button, IconButton, InputAdornment, Tooltip } from '@mui/material';
import { Phone, PhoneOff, Keyboard } from 'lucide-react';
import { useDialerStore } from '../store/useDialerStore';

export default function DialPad() {
  const callStatus    = useDialerStore(s => s.callStatus);
  const storeNumber   = useDialerStore(s => s.number);
  const setNumber     = useDialerStore(s => s.setNumber);   // must be a function
  const startCall     = useDialerStore(s => s.startCall);   // must be a function
  const endCall       = useDialerStore(s => s.endCall);     // must be a function
  const toggleKeypad  = useDialerStore(s => s.toggleKeypad);// must be a function

  const [input, setInput] = useState(storeNumber || '');

  useEffect(() => {
    if (storeNumber !== undefined && storeNumber !== input) setInput(storeNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeNumber]);

  const canCall = callStatus === 'idle' || callStatus === 'ended';

  function assertFns() {
    if (process.env.NODE_ENV !== 'production') {
      const missing = [];
      if (typeof setNumber !== 'function')   missing.push('setNumber');
      if (typeof startCall !== 'function')   missing.push('startCall');
      if (typeof endCall !== 'function')     missing.push('endCall');
      if (typeof toggleKeypad !== 'function')missing.push('toggleKeypad');
      if (missing.length) {
        console.error('[DialPad] Missing store actions:', missing);
      }
    }
  }

  const onChange = (e) => {
    const v = e.target.value;
    setInput(v);
    if (typeof setNumber === 'function') setNumber(v);
  };

  const onCall = () => {
    assertFns();
    if (!input.trim()) return;
    if (typeof startCall !== 'function') return; // bail loudly in console
    startCall(input);
  };

  const onHangup = () => {
    assertFns();
    if (typeof endCall !== 'function') return;
    endCall();
  };

  return (
    <Stack spacing={1}>
      <TextField
        placeholder="Enter phone number"
        size="medium"
        value={input}
        onChange={onChange}
        onKeyDown={(e) => { if (e.key === 'Enter' && canCall) onCall(); }}
        InputProps={{
          startAdornment: <InputAdornment position="start">+</InputAdornment>,
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="DTMF Keypad">
                <IconButton onClick={toggleKeypad} edge="end">
                  <Keyboard size={18} />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />

      {canCall ? (
        <Button
          variant="contained"
          size="large"
          onClick={onCall}
          startIcon={<Phone size={18} />}
          sx={{ textTransform: 'none' }}
        >
          Call
        </Button>
      ) : (
        <Button
          color="error"
          variant="contained"
          size="large"
          onClick={onHangup}
          startIcon={<PhoneOff size={18} />}
          sx={{ textTransform: 'none' }}
        >
          Hang up
        </Button>
      )}
    </Stack>
  );
}
  