// /src/Component/dailer/Softphone/ScenarioCallView.jsx
import {
  Avatar, Box, Stack, Typography, IconButton, Tooltip, Chip, Paper, Collapse, TextField,
  InputAdornment, Divider, Popover, List, ListItem, Button
} from '@mui/material';
import {
  PhoneCall, PhoneOff, Pause, Play, Mic, MicOff, Volume2, VolumeX,
  UserPlus, Grid3X3, Disc, GitMerge, XCircle, PhoneIncoming, PhoneOutgoing,
  Delete, PhoneForwarded, User, X as CloseIcon
} from 'lucide-react';
import RecordingTimer from './RecordingTimer';
import CallTimer from './CallTimer';
import { useDialerStore } from '../../store/useDialerStore';
import SoftphoneKeypad from './SoftphoneKeypad';
import SignalMeters from './SignalMeters';
import VolumeBar from './VolumeBar';
import CountryPicker from './CountryPicker';
import DispositionPanel from '../DispositionPanel';
import { detectAndFormat, sanitizeDialInput } from './phoneUtils';
import { useMemo, useState, useEffect, useRef } from 'react';
import WrapUpChip from './WrapUpChip';

/* ---------- helpers ---------- */
const isoLangBadge = (iso, lang) => (
  <span style={{ opacity: 0.7, fontSize: 12 }}>{iso || ''}{lang ? ` • ${lang}` : ''}</span>
);

function formatPretty(num = '') {
  const n = String(num).replace(/[^\d+]/g, '');
  return n.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3,})/, '$1 $2 $3 $4') || n;
}

/* Small ticking timer for consult legs */
function LegTimer({ startMs }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!startMs) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [startMs]);
  if (!startMs) return <Typography variant="caption">00:00</Typography>;
  const total = Math.max(0, Math.floor((now - startMs) / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums' }}>{m}:{s}</Typography>;
}

const CircleBtn = ({ title, onClick, disabled, children, active = false, danger = false }) => (
  <Tooltip title={title}>
    <span>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        sx={{
          width: 56, height: 56, borderRadius: '50%',
          bgcolor: 'background.default',
          color: disabled ? 'text.disabled' : 'inherit',
          border: active || danger ? '2px solid' : '1px solid',
          borderColor: active || danger ? 'error.main' : 'divider',
          boxShadow: active ? 'inset 0 0 0 2px rgba(211,47,47,0.9)' : 'none',
          '&:hover': { bgcolor: disabled ? 'background.default' : 'action.hover' }
        }}
      >
        {children}
      </IconButton>
    </span>
  </Tooltip>
);

/** Accepts optional { containerEl } to confine Popovers to the softphone card */
export default function ScenarioCallView({ containerEl }) {
  const {
    callStatus, direction, number, lastEndReason,
    muted, held, speakerOn, recording, keypadOpen,
    consulting, consultStage, consultNumber, consultStartedAt, conferenceActive,
    answer, endCall, toggleMute, toggleHold, toggleSpeaker,
    toggleKeypad, toggleRecording, addCall, mergeCalls, dropConsult, startConsultCall,
    micLevel, spkLevel, currentLead, setConsultNumber, forwardCall, cancelConsult,
    dialISO, dialLanguage,
    // single-leg meta (fallback)
    consultDialISO, consultDialLanguage, consultLead,
    // multi-leg
    consultLegs = [],
    toggleConsultHold,
    // DTMF overlay
    dtmfOverlayVisible = false, dtmfBuffer = '', clearDtmfOverlay = () => { },
  } = useDialerStore((st) => st);

  // Was the current ACW entered due to a missed incoming call?
  const lastMissed = useDialerStore((st) => st.lastMissed);

  /* Clear consult input whenever we enter the "enter" stage again */
  useEffect(() => {
    if (consulting && consultStage === 'enter') setConsultNumber('');
  }, [consulting, consultStage, setConsultNumber]);

  /* one-at-a-time inline text */
  const [inlineMsg, setInlineMsg] = useState('');
  const clearTimer = useRef(null);
  const showInline = (txt) => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    setInlineMsg(txt || '');
    clearTimer.current = setTimeout(() => setInlineMsg(''), 3000);
  };
  useEffect(() => () => clearTimeout(clearTimer.current), []);

  const onToggleMute = () => { toggleMute(); showInline(muted ? 'Unmuted' : 'Muted'); };
  const onToggleHold = () => { toggleHold(); showInline(held ? 'Resumed' : 'On hold'); };
  const onToggleSpeaker = () => { toggleSpeaker(); showInline(speakerOn ? 'Speaker off' : 'Speaker on'); };
  const onToggleRecording = () => {
    const next =
      recording === 'off' ? 'Recording started'
        : recording === 'on' ? 'Recording paused'
          : 'Recording resumed';
    toggleRecording();
    showInline(next);
  };

  /* status + tags */
  const variant =
    callStatus === 'in-call' ? 'ongoing'
      : callStatus === 'ringing-in' ? 'incoming'
        : callStatus === 'ringing-out' ? 'outgoing'
          : callStatus === 'ended' && lastEndReason === 'no-answer' ? 'not-picked'
            : callStatus === 'ended' ? 'ended'
              : callStatus === 'acw' ? 'acw'
                : null;

  const statusBase =
    variant === 'ongoing' ? 'Ongoing call'
      : variant === 'incoming' ? 'Incoming call'
        : variant === 'outgoing' ? 'Outgoing call'
          : variant === 'not-picked' ? 'Not yet picked'
            : variant === 'ended' ? 'Call Ended'
              : variant === 'acw' ? 'Wrap-up Required'
                : '';

  const destructive = /end|fail|error|drop|decline|block|invalid|hangup/i.test(inlineMsg);
  const tagIcon = direction === 'in' ? <PhoneIncoming size={14} /> : <PhoneOutgoing size={14} />;

  // Primary leg display
  const honorific = currentLead?.honorific || currentLead?.salutation || '';
  const contactName = currentLead?.name || 'Unknown';
  const contactTitle = currentLead?.title || undefined;
  const displayName = `${honorific ? honorific + ' ' : ''}${contactName}`;

  // Fallback single consult leg display (if no consultLegs[])
  const cHonorific = consultLead?.honorific || consultLead?.salutation || '';
  const cName = consultLead?.name || 'Unknown';
  const cTitle = consultLead?.title || undefined;
  const cDisplayName = `${cHonorific ? cHonorific + ' ' : ''}${cName}`;

  /* consult input + validation */
  const [cIso, setCIso] = useState('UG');
  const cInfo = useMemo(() => detectAndFormat(consultNumber || '', cIso), [consultNumber, cIso]);
  useEffect(() => {
    if (String(consultNumber || '').startsWith('+') && cInfo.iso && cInfo.iso !== cIso) setCIso(cInfo.iso);
  }, [consultNumber, cInfo.iso, cIso]);

  const consultDigits = String(consultNumber || '').replace(/\D/g, '');
  const consultInvalid = (consultNumber || '').length > 0 && cInfo.valid === false;
  const consultHelper =
    !consultNumber ? ' ' :
      consultInvalid
        ? (cInfo.reason || cInfo.hint ||
          (consultDigits.length < 7 ? 'Number is too short' :
            consultDigits.length > 15 ? 'Number is too long' :
              'Number format looks invalid'))
        : ' ';

  const onConsultChange = (e) => setConsultNumber(sanitizeDialInput(e.target.value));
  const onConsultBack = () => setConsultNumber(String(consultNumber || '').slice(0, -1));

  const disabledInCall = !(callStatus === 'in-call');

  /* --- Conference participants popover (confined to card) --- */
  const [confAnchor, setConfAnchor] = useState(null);
  const openConf = Boolean(confAnchor);
  const handleOpenConf = (e) => setConfAnchor(e.currentTarget);
  const handleCloseConf = () => setConfAnchor(null);

  // ✅ Only show conference chip AFTER merge
  const showConferenceChip = !!conferenceActive;

  // Show only the most recently added consult leg in the main card
  const latestLeg = Array.isArray(consultLegs) && consultLegs.length > 0
    ? consultLegs[consultLegs.length - 1]
    : null;

  return (
    <Box
      sx={{
        borderRadius: 1,
        border: '2px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        p: 2,
        position: 'relative',
        minHeight: 480,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Avatar sx={{ width: 48, height: 48 }} />
          <Stack>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {displayName}
            </Typography>
            {contactTitle && (
              <Typography variant="caption" sx={{ opacity: 0.7, mb: 0.25 }}>
                {contactTitle}
              </Typography>
            )}

            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <span>{formatPretty(number)}</span>
              {(variant === 'ongoing' || variant === 'outgoing' || variant === 'incoming') && (
                isoLangBadge(dialISO, dialLanguage)
              )}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
              <Chip size="small" icon={tagIcon} label={direction === 'in' ? 'Inbound' : 'Outbound'} />
              <CallTimer />
              {recording !== 'off' && <RecordingTimer />}

              {/* Conference indicator — clickable (only after merge) */}
              {showConferenceChip && (
                <>
                  <Chip
                    size="small"
                    icon={<GitMerge size={14} />}
                    label="Conference"
                    onClick={handleOpenConf}
                    sx={{ ml: 0.5, cursor: 'pointer' }}
                    clickable
                  />
                  <Popover
                    open={openConf}
                    anchorEl={confAnchor}
                    onClose={handleCloseConf}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    disablePortal
                    container={containerEl || undefined}
                    PaperProps={{ sx: { p: 1, width: 360, maxWidth: 'calc(100% - 24px)' } }}
                  >
                    <Typography variant="subtitle2" sx={{ px: 1, py: 0.5, fontWeight: 700 }}>
                      Participants
                    </Typography>
                    <Divider sx={{ mb: 1 }} />

                    <List dense sx={{ py: 0 }}>
                      {/* Primary leg */}
                      <ListItem
                        secondaryAction={
                          <Stack direction="row" alignItems="center" spacing={1.25}>
                            <CallTimer />
                            <Tooltip title="Drop primary">
                              <span>
                                <IconButton size="small" onClick={() => endCall('hangup')} sx={{ color: 'error.main' }}>
                                  <PhoneOff size={16} />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        }
                      >
                        <Avatar sx={{ width: 28, height: 28, mr: 1 }}><User size={14} /></Avatar>
                        <Stack spacing={0.2}>
                          <Typography variant="body2" noWrap>{displayName || 'Primary'}</Typography>
                          <Typography variant="caption" noWrap>
                            {formatPretty(number)} {isoLangBadge(dialISO, dialLanguage)}
                          </Typography>
                        </Stack>
                      </ListItem>

                      {/* All consult legs */}
                      {Array.isArray(consultLegs) && consultLegs.length > 0 ? (
                        consultLegs.map((leg) => (
                          <ListItem
                            key={leg.id}
                            secondaryAction={
                              <Stack direction="row" alignItems="center" spacing={1.25}>
                                <LegTimer startMs={leg.startedAt} />
                                <Tooltip title={leg.held ? 'Resume leg' : 'Hold leg'}>
                                  <span>
                                    <IconButton
                                      size="small"
                                      onClick={() => toggleConsultHold?.(leg.id)}
                                      sx={{ color: leg.held ? 'success.main' : 'warning.main' }}
                                    >
                                      {leg.held ? <Play size={16} /> : <Pause size={16} />}
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="Drop">
                                  <span>
                                    <IconButton size="small" onClick={() => dropConsult(leg.id)} sx={{ color: 'error.main' }}>
                                      <XCircle size={16} />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Stack>
                            }
                          >
                            <Avatar sx={{ width: 28, height: 28, mr: 1 }}><User size={14} /></Avatar>
                            <Stack spacing={0.2}>
                              <Typography variant="body2" noWrap>
                                {leg.name || formatPretty(leg.number)}
                              </Typography>
                              <Typography variant="caption" noWrap>
                                {formatPretty(leg.number)} {isoLangBadge(leg.iso, leg.language)}
                              </Typography>
                            </Stack>
                          </ListItem>
                        ))
                      ) : (
                        // Fallback: single consult leg fields you already have
                        (consulting || conferenceActive) && (
                          <ListItem
                            secondaryAction={
                              <Stack direction="row" alignItems="center" spacing={1.25}>
                                <LegTimer startMs={consultStartedAt} />
                                <Tooltip title="Drop second leg">
                                  <span>
                                    <IconButton size="small" onClick={() => dropConsult()} sx={{ color: 'error.main' }}>
                                      <XCircle size={16} />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Stack>
                            }
                          >
                            <Avatar sx={{ width: 28, height: 28, mr: 1 }}><User size={14} /></Avatar>
                            <Stack spacing={0.2}>
                              <Typography variant="body2" noWrap>{cDisplayName}</Typography>
                              <Typography variant="caption" noWrap>
                                {formatPretty(consultNumber || '')} {isoLangBadge(consultDialISO, consultDialLanguage)}
                              </Typography>
                            </Stack>
                          </ListItem>
                        )
                      )}
                    </List>
                  </Popover>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>

        <SignalMeters />
      </Stack>

      {/* STATUS ROW (with DTMF overlay in the middle) */}
      {statusBase && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 1, mb: keypadOpen ? 1 : 0,
            minHeight: 40,
            position: 'relative'
          }}
        >
          <VolumeBar level={micLevel ?? 0} />
          {variant === 'acw'
            ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', px: 2 }}>
                {/* Missed-call ACW: show message. Otherwise show WrapUpChip */}
                {lastMissed
                  ? (
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: 'error.main', textAlign: 'center' }}
                    >
                      Unable to receive next call — please dispose
                    </Typography>
                  )
                  : <WrapUpChip />
                }
              </Box>
            )
            : (
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  px: 2,
                  color: destructive ? 'error.main' : 'text.primary'
                }}
              >
                {statusBase}{inlineMsg ? `: ${inlineMsg}` : ''}
              </Typography>
            )
          }
          <VolumeBar level={spkLevel ?? 0} color="secondary.main" />

          {/* DTMF overlay (auto-hide handled in store; close manually here) */}
          {dtmfOverlayVisible && (
            <Paper
              elevation={3}
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                px: 2, py: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderRadius: 1
              }}
            >
              <Typography variant="h6" sx={{ fontVariantNumeric: 'tabular-nums', letterSpacing: 1 }}>
                {dtmfBuffer || ''}
              </Typography>
              <IconButton size="small" onClick={clearDtmfOverlay}>
                <CloseIcon size={16} />
              </IconButton>
            </Paper>
          )}
        </Box>
      )}

      {!keypadOpen && variant !== 'acw' && <Box sx={{ flex: 1 }} />}

      {/* Only the most recent consult leg card (pre-merge) */}
      {latestLeg ? (
        <Paper key={latestLeg.id} variant="outlined" sx={{ p: 1.25, borderRadius: 1, mb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar sx={{ width: 36, height: 36 }}><User size={16} /></Avatar>
              <Stack>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {latestLeg.name || formatPretty(latestLeg.number)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {formatPretty(latestLeg.number)} {isoLangBadge(latestLeg.iso, latestLeg.language)}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LegTimer startMs={latestLeg.startedAt} />
              <Tooltip title={latestLeg.held ? 'Resume leg' : 'Hold leg'}>
                <span>
                  <IconButton
                    size="small"
                    onClick={() => toggleConsultHold?.(latestLeg.id)}
                    sx={{ color: latestLeg.held ? 'success.main' : 'warning.main' }}
                  >
                    {latestLeg.held ? <Play size={18} /> : <Pause size={18} />}
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Stack>
        </Paper>
      ) : (
        consulting && consultStage === 'active' && (
          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1, mb: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Avatar sx={{ width: 36, height: 36 }}><User size={16} /></Avatar>
                <Stack>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {cDisplayName}
                  </Typography>
                  {cTitle && (
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {cTitle}
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {formatPretty(consultNumber || '')} {isoLangBadge(consultDialISO, consultDialLanguage)}
                  </Typography>
                </Stack>
              </Stack>
              <LegTimer startMs={consultStartedAt} />
            </Stack>
          </Paper>
        )
      )}

      {/* INCOMING: Answer / Forward / Reject */}
      {variant === 'incoming' && (
        <Stack direction="row" spacing={6} sx={{ mt: 2, justifyContent: 'center' }}>
          <IconButton onClick={answer}
            sx={{ width: 64, height: 64, bgcolor: 'success.main', color: '#fff', '&:hover': { bgcolor: 'success.dark' } }}>
            <PhoneCall />
          </IconButton>
          <IconButton onClick={forwardCall}
            sx={{ width: 64, height: 64, bgcolor: 'warning.main', color: '#fff', '&:hover': { bgcolor: 'warning.dark' } }}>
            <PhoneForwarded />
          </IconButton>
          <IconButton onClick={() => endCall('decline')}
            sx={{ width: 64, height: 64, bgcolor: 'error.main', color: '#fff', '&:hover': { bgcolor: 'error.dark' } }}>
            <PhoneOff />
          </IconButton>
        </Stack>
      )}

      {/* OUTGOING/ONGOING controls */}
      {(variant === 'outgoing' || variant === 'ongoing') && (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 64px)',
              justifyContent: 'center',
              gap: 1.5,
              mb: 1,
              opacity: disabledInCall ? 0.5 : 1,
              pointerEvents: disabledInCall ? 'none' : 'auto'
            }}
          >
            <CircleBtn title="Keypad" onClick={toggleKeypad} disabled={disabledInCall}><Grid3X3 /></CircleBtn>
            <CircleBtn title={muted ? 'Unmute' : 'Mute'} onClick={onToggleMute} disabled={disabledInCall}>
              {muted ? <MicOff /> : <Mic />}
            </CircleBtn>
            <CircleBtn title={held ? 'Resume' : 'Hold'} onClick={onToggleHold} disabled={disabledInCall}>
              {held ? <Play /> : <Pause />}
            </CircleBtn>
            <CircleBtn title={speakerOn ? 'Speaker off' : 'Speaker on'} onClick={onToggleSpeaker} disabled={disabledInCall}>
              {speakerOn ? <VolumeX /> : <Volume2 />}
            </CircleBtn>

            {!consulting && (
              <>
                <CircleBtn title="Add call" onClick={() => { addCall(); showInline('Add call…'); }} disabled={disabledInCall}>
                  <UserPlus />
                </CircleBtn>
                <Box sx={{ gridColumn: '2 / span 2', display: 'flex', justifyContent: 'center' }}>
                  <Tooltip title="Hang up">
                    <IconButton
                      onClick={() => { endCall('hangup'); showInline('Hang up'); }}
                      sx={{
                        width: 72, height: 72, borderRadius: '50%', bgcolor: 'error.main', color: '#fff',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                      aria-label="Hang up"
                      disabled={disabledInCall}
                    >
                      <PhoneOff />
                    </IconButton>
                  </Tooltip>
                </Box>
                <CircleBtn
                  title={recording === 'off' ? 'Start recording' : recording === 'on' ? 'Pause recording' : 'Resume recording'}
                  onClick={onToggleRecording}
                  active={recording === 'on'}
                  disabled={disabledInCall}
                >
                  <Disc />
                </CircleBtn>
              </>
            )}

            {consulting && consultStage === 'active' && (
              <>
                <CircleBtn title="Consult active" onClick={() => { }} disabled>
                  <UserPlus />
                </CircleBtn>
                <CircleBtn title="Merge to conference" onClick={() => { mergeCalls(); showInline('Merged to conference'); }} disabled={disabledInCall}><GitMerge /></CircleBtn>
                <CircleBtn title="Drop consult" onClick={() => { dropConsult(); showInline('Consult dropped'); }} danger disabled={disabledInCall}><XCircle /></CircleBtn>
                <CircleBtn
                  title={recording === 'off' ? 'Start recording' : recording === 'on' ? 'Pause recording' : 'Resume recording'}
                  onClick={onToggleRecording}
                  active={recording === 'on'}
                  disabled={disabledInCall}
                >
                  <Disc />
                </CircleBtn>
              </>
            )}
          </Box>
        </>
      )}

      {/* CONSULT ENTRY / DIALING — icon-only, aligned with input, helper text on its own row */}
      {consulting && (consultStage === 'enter' || consultStage === 'dialing') && (
        <Box
          sx={{
            mt: 1,
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gridTemplateRows: 'auto auto',          // row 1 = input+icon, row 2 = helper text
            columnGap: 0.5,
            rowGap: 0.25,
            alignItems: 'center',
            minWidth: 0
          }}
        >
          {/* Row 1, Col 1: Text input (no built-in helperText so it won’t affect height) */}
          <TextField
            fullWidth
            size="medium"
            type="tel"
            placeholder="Enter phone number"
            value={cInfo.formatted}
            onChange={onConsultChange}
            error={(consultNumber || '').length > 0 && cInfo.valid === false}
            autoComplete="off"
            inputProps={{ autoComplete: 'off', name: 'consult-number' }}
            disabled={consultStage === 'dialing'}
            sx={{
              gridColumn: '1 / 2',
              gridRow: '1 / 2',
              minWidth: 0,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              bgcolor: 'background.paper',
              borderRadius: 1,
              '& input:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0px 1000px transparent inset',
                WebkitTextFillColor: 'inherit',
                transition: 'background-color 9999s ease-out 0s'
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CountryPicker
                    iso={cIso}
                    onChange={(c) => {
                      setCIso(c.iso);
                      const national = cInfo.national || '';
                      setConsultNumber(`+${c.cc}${national}`);
                    }}
                    disabled={consultStage === 'dialing'}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {/* Close when empty; Delete when typed (never both) */}
                  {consultStage !== 'dialing' && (
                    (consultNumber || '').length === 0 ? (
                      <Tooltip title="Close">
                        <IconButton
                          onClick={() => { cancelConsult(); showInline('Consult closed'); }}
                          aria-label="Close consult"
                          size="small"
                          sx={{ p: 0.5, color: 'text.secondary' }}
                        >
                          <CloseIcon size={18} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Backspace">
                        <IconButton
                          onClick={onConsultBack}
                          aria-label="Backspace"
                          size="small"
                          sx={{ p: 0.5, color: 'text.secondary' }}
                        >
                          <Delete size={18} />
                        </IconButton>
                      </Tooltip>
                    )
                  )}
                </InputAdornment>
              ),
            }}
          />

          {/* Row 1, Col 2: Action icon; perfectly centered against the input */}
          <Box
            sx={{
              gridColumn: '2 / 3',
              gridRow: '1 / 2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ml: 0.5,
            }}
          >
            {consultStage !== 'dialing' ? (
              <Tooltip title={!cInfo.valid ? 'Enter valid number' : 'Start consult call'}>
                <span>
                  <IconButton
                    onClick={() => { startConsultCall(); showInline('Dialing consult…'); }}
                    disabled={!cInfo.valid}
                    aria-label="Start consult call"
                    sx={{ p: 0.5, color: (t) => t.palette.success.main }}
                  >
                    <PhoneCall size={20} />
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Cancel">
                <IconButton
                  onClick={() => { cancelConsult(); showInline('Consult cancelled'); }}
                  aria-label="Cancel consult"
                  sx={{ p: 0.5, color: (t) => t.palette.error.main }}
                >
                  <XCircle size={20} />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Row 2: Helper text spans both columns so it no longer affects row-1 height */}
          <Typography
            variant="caption"
            sx={{
              gridColumn: '1 / -1',
              gridRow: '2 / 3',
              ml: 0.5,
              color: ((consultNumber || '').length > 0 && cInfo.valid === false)
                ? 'error.main'
                : 'text.secondary'
            }}
          >
            {consultHelper}
          </Typography>
        </Box>
      )}

      {/* Keypad (not in ACW) */}
      {(variant !== 'acw' && variant !== 'ended') && (
        <Collapse in={keypadOpen} unmountOnExit>
          <Paper variant="outlined" sx={{ p: 1.25, mt: 1 }}>
            <SoftphoneKeypad />
          </Paper>
        </Collapse>
      )}

      {/* ACW: DispositionPanel inline (shown for ended & acw) */}
      {(variant === 'ended' || variant === 'acw') && (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <DispositionPanel />
        </Box>
      )}

      {!keypadOpen && variant !== 'acw' && <Box sx={{ flex: 1 }} />}
    </Box>
  );
}
