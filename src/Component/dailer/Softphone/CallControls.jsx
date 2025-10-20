// /src/Component/dailer/Softphone/CallControls.jsx
import { Stack, Tooltip, IconButton } from '@mui/material';
import { Mic, MicOff, PauseCircle, PlayCircle, Hash, Voicemail, PhoneOff } from 'lucide-react';
import { useDialerStore } from '../../store/useDialerStore';

export default function CallControls() {
  const callStatus   = useDialerStore(s => s.callStatus);
  const muted        = useDialerStore(s => s.muted);
  const held         = useDialerStore(s => s.held);
  const toggleMute   = useDialerStore(s => s.toggleMute);
  const toggleHold   = useDialerStore(s => s.toggleHold);
  const toggleKeypad = useDialerStore(s => s.toggleKeypad);
  const endCall      = useDialerStore(s => s.endCall);

  const disabled = callStatus !== 'in-call';

  return (
    <Stack direction="row" spacing={1} justifyContent="space-between">
      <Tooltip title={muted ? 'Unmute' : 'Mute'}>
        <span>
          <IconButton onClick={toggleMute} disabled={disabled}>
            {muted ? <MicOff size={18}/> : <Mic size={18}/>}
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title={held ? 'Resume' : 'Hold'}>
        <span>
          <IconButton onClick={toggleHold} disabled={disabled}>
            {held ? <PlayCircle size={18}/> : <PauseCircle size={18}/>}
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="DTMF keypad">
        <span>
          <IconButton onClick={toggleKeypad} disabled={callStatus === 'idle'}>
            <Hash size={18}/>
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Record (coming soon)">
        <span>
          <IconButton disabled>
            <Voicemail size={18}/>
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Hang up">
        <span>
          <IconButton color="error" onClick={endCall} disabled={callStatus === 'idle'}>
            <PhoneOff size={18}/>
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
