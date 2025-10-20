// /src/Component/dailer/Softphone/SoftphoneCard.jsx
import {
  Card, CardContent, Stack, TextField, Chip, IconButton, Tooltip,
  Fab, InputAdornment, Paper, Box, Typography, Popover, List, ListItem,
  ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import { PhoneCall, Mic, MicOff, Keyboard, RotateCcw, Delete, PhoneIncoming, Disc, Play, Pause, Bell, BellOff } from 'lucide-react';
import WrapUpChip from './WrapUpChip';
import SoftphoneKeypad from './SoftphoneKeypad';
import ShimmerGlitch from './ShimmerGlitch';
import QualityPill from './QualityPill';
import useDialerShortcuts from './useDialerShortcuts';
import ScenarioCallView from './ScenarioCallView';
import SignalMeters from './SignalMeters';
import VolumeBar from './VolumeBar';
import useAudioMeters from './useAudioMeters';
import { useDialerStore } from '../../store/useDialerStore';
import { detectAndFormat, sanitizeDialInput } from './phoneUtils'; // ← no fmtDuration import
import CountryPicker from './CountryPicker';
import { useEffect, useMemo, useRef, useState } from 'react';

/* local duration helper (avoids missing export) */
const isoLang = (iso, lang) => [iso, lang].filter(Boolean).join(' • ');
function fmtDuration(ms = 0) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ⏱️ Auto-drop ringing after 60s
const RING_TIMEOUT_MS = 60_000;

export default function SoftphoneCard() {
  useDialerShortcuts();
  useAudioMeters();

  const callStatus = useDialerStore((s) => s.callStatus);
  const number = useDialerStore((s) => s.number);
  const setNumber = useDialerStore((s) => s.setNumber);
  const setDialMeta = useDialerStore((s) => s.setDialMeta);
  const currentLead = useDialerStore((s) => s.currentLead);

  const keypadOpen = useDialerStore((s) => s.keypadOpen);
  const toggleKeypad = useDialerStore((s) => s.toggleKeypad);

  const startCall = useDialerStore((s) => s.startCall);
  const inboundRinging = useDialerStore((s) => s.inboundRinging);
  const muted = useDialerStore((s) => s.muted);
  const toggleMute = useDialerStore((s) => s.toggleMute);

  const micLevel = useDialerStore((s) => s.micLevel);
  const spkLevel = useDialerStore((s) => s.spkLevel);

  const recentCalls = useDialerStore((s) => s.recentCalls);
  const lastMissed = useDialerStore((s) => s.lastMissed); // ← NEW: used to detect missed ACW

  const glitchActive = ['ringing-in', 'ringing-out', 'ended'].includes(callStatus);
  const scenarioActive = ['ringing-in', 'ringing-out', 'in-call', 'ended', 'acw'].includes(callStatus) && callStatus !== 'idle';

  // keep popover confined to the card
  const cardRef = useRef(null);

  // single, hidden audio player for recording playback
  const audioRef = useRef(typeof Audio !== 'undefined' ? new Audio() : null);
  const [playingId, setPlayingId] = useState(null);

  // --- Ring sound (opt-in) ---
  const [ringSoundOn, setRingSoundOn] = useState(() => localStorage.getItem('ringSound') === '1');
  const isRinging = callStatus === 'ringing-in' || callStatus === 'ringing-out';
  const audioCtxRef = useRef(null);
  const ringTimerRef = useRef(null);

  const ensureAudio = async () => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      try { await audioCtxRef.current.resume(); } catch { }
    }
  };

  const stopRingLoop = () => {
    if (ringTimerRef.current) {
      clearInterval(ringTimerRef.current);
      ringTimerRef.current = null;
    }
  };

  const startRingLoop = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const beep = (freq = 880, ms = 180) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms / 1000);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + ms / 1000 + 0.02);
    };
    stopRingLoop();
    ringTimerRef.current = setInterval(() => {
      beep(880, 180);
      setTimeout(() => beep(660, 180), 240);
    }, 1400);
  };

  useEffect(() => {
    if (!ringSoundOn) { stopRingLoop(); return; }
    if (isRinging) { ensureAudio().then(startRingLoop); } else { stopRingLoop(); }
    return stopRingLoop;
  }, [isRinging, ringSoundOn]);

  const toggleRingSound = async () => {
    const next = !ringSoundOn;
    setRingSoundOn(next);
    localStorage.setItem('ringSound', next ? '1' : '0');
    if (next) await ensureAudio();
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnded = () => setPlayingId(null);
    const onError = () => setPlayingId(null);
    a.addEventListener('ended', onEnded);
    a.addEventListener('error', onError);
    return () => {
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('error', onError);
    };
  }, []);

  // stop playback if we switch into a call screen
  useEffect(() => {
    if (!scenarioActive) return;
    const a = audioRef.current;
    if (a) { a.pause(); a.currentTime = 0; }
    setPlayingId(null);
  }, [scenarioActive]);

  const togglePlay = async (id, url) => {
    const a = audioRef.current;
    if (!a) return;
    if (!url) {
      useDialerStore.getState()._setToast('No recording available for this call');
      return;
    }
    try {
      if (playingId === id) {
        a.pause();
        a.currentTime = 0;
        setPlayingId(null);
      } else {
        a.pause();
        a.src = url;
        await a.play();
        setPlayingId(id);
      }
    } catch {
      setPlayingId(null);
      useDialerStore.getState()._setToast('Could not play recording');
    }
  };

  // country picker + validation (disabled during scenario screens)
  const [iso, setIso] = useState('UG');
  const info = useMemo(
    () => (scenarioActive ? { formatted: number || '', valid: true, iso, national: '', e164: number || '' } : detectAndFormat(number || '', iso)),
    [number, iso, scenarioActive]
  );

  useEffect(() => {
    if (!scenarioActive && String(number || '').startsWith('+') && info.iso && info.iso !== iso) setIso(info.iso);
  }, [number, info.iso, iso, scenarioActive]);

  const hasInput = Boolean((number || '').length);
  const isInvalid = hasInput && info.valid === false;

  const digits = String(number || '').replace(/\D/g, '');
  const helperText =
    !hasInput ? ' ' :
      isInvalid
        ? (info.reason || info.hint ||
          (digits.length < 7 ? 'Number is too short' :
            digits.length > 15 ? 'Number is too long' :
              'Number format looks invalid'))
        : ' ';

  const [nudgeNoNumber, setNudgeNoNumber] = useState(false);
  useEffect(() => {
    if (!nudgeNoNumber) return;
    const t = setTimeout(() => setNudgeNoNumber(false), 900);
    return () => clearTimeout(t);
  }, [nudgeNoNumber]);

  const onBackspace = () => setNumber?.(String(number || '').slice(0, -1));
  const onChange = (e) => setNumber?.(sanitizeDialInput(e.target.value));
  const onCall = () => {
    if (!hasInput) { setNudgeNoNumber(true); return; }
    if (!info.valid) { useDialerStore.getState()._pushLog('[CALL] Dial blocked: invalid number'); return; }
    setDialMeta({ iso: info.iso || iso, language: currentLead?.language || null });
    const toDial = info.e164 || number;
    setNumber?.(toDial);
    startCall?.(toDial);
  };

  const handleCountryChange = (c) => {
    const national = info.national || '';
    const newE164 = `+${c.cc}${national}`;
    setIso(c.iso);
    setNumber(newE164);
  };

  const canIdleActions = callStatus === 'idle';

  // === NEW: if we're in ACW because of a MISSED call, swap WrapUpChip for a blocking message chip
  const missedACW = callStatus === 'acw' && !!lastMissed;

  const statusChip =
    callStatus === 'in-call' ? (
      <Chip size="small" color="success" label="On Call" />
    ) : callStatus?.startsWith('ringing') ? (
      <Chip size="small" color="warning" label="Ringing…" />
    ) : callStatus === 'ended' ? (
      <Chip size="small" label="Call Ended" />
    ) : callStatus === 'acw' ? (
      missedACW ? (
        <Chip
          size="small"
          color="error"
          variant="filled"
          label="Unable to receive next call — please dispose"
          sx={{ fontWeight: 600 }}
        />
      ) : (
        <WrapUpChip dense />
      )
    ) : (
      <Chip size="small" label="Idle" />
    );

  /* ---------- Redial history (single-click opens popup) ---------- */
  const [redialAnchor, setRedialAnchor] = useState(null);
  const redialBtnRef = useRef(null);

  const openRedialPopup = () => setRedialAnchor(redialBtnRef.current);
  const closeRedialPopup = () => setRedialAnchor(null);
  const openRedial = Boolean(redialAnchor);

  // ensure the popup never lingers after transitioning into scenario view
  useEffect(() => {
    if (scenarioActive && openRedial) setRedialAnchor(null);
  }, [scenarioActive, openRedial]);

  const dialFromHistory = (raw) => {
    const v = detectAndFormat(raw, iso);
    if (!v.valid) return;
    setDialMeta({ iso: v.iso || iso, language: null });
    const toDial = v.e164 || raw;
    setNumber(toDial);
    startCall(toDial);
    closeRedialPopup();
  };

  /* =========================
     AUTO-DROP RINGING TIMER
     ========================= */
  const ringTimeoutRef = useRef(null);

  useEffect(() => {
    const isRingingState = callStatus === 'ringing-in' || callStatus === 'ringing-out';

    // Clear any existing timer
    if (ringTimeoutRef.current) {
      clearTimeout(ringTimeoutRef.current);
      ringTimeoutRef.current = null;
    }

    if (isRingingState) {
      ringTimeoutRef.current = setTimeout(() => {
        const state = useDialerStore.getState();
        const num = state.number || number || '';
        const kind = callStatus === 'ringing-in' ? 'missed-incoming' : 'no-answer-outbound';

        // Log the missed/no-answer outcome
        const msg =
          kind === 'missed-incoming'
            ? `[CALL] Missed incoming call${num ? ` from ${num}` : ''} (60s timeout)`
            : `[CALL] No answer dialing ${num || '(unknown)'} (40s timeout)`;

        if (typeof state._pushLog === 'function') {
          state._pushLog(msg);
        } else {
          // fallback in case _pushLog not present
          useDialerStore.setState((s) => ({
            log: [...(s.log || []), { t: Date.now(), src: 'CALL', msg }],
          }));
        }

        // Add to recent calls (duration 0, not recorded)
        useDialerStore.setState((s) => ({
          recentCalls: [
            ...(s.recentCalls || []),
            {
              when: Date.now(),
              number: num || '(unknown)',
              name: state.currentLead?.name || 'Unknown',
              honorific: state.currentLead?.honorific || undefined,
              durationMs: 0,
              recorded: false,
              recordingUrl: null,
              iso: state.dialMeta?.iso || undefined,
              language: state.currentLead?.language || undefined,
              outcome: kind,
            },
          ],
        }));

        // End the call (drop ringing)
        useDialerStore.setState({ callStatus: 'ended' });
        stopRingLoop();          // stop local ring sound loop if active
        setPlayingId(null);      // ensure no playback UI state lingering
      }, RING_TIMEOUT_MS);
    }

    // Cleanup on status change/unmount
    return () => {
      if (ringTimeoutRef.current) {
        clearTimeout(ringTimeoutRef.current);
        ringTimeoutRef.current = null;
      }
    };
  }, [callStatus, number]); // re-evaluates when status/number changes

  /* =========================
   AUTO-DROP INCOMING RING → ACW
   ========================= */
  useEffect(() => {
    const isIncomingRing = callStatus === 'ringing-in';

    // Clear any existing timer
    if (ringTimeoutRef.current) {
      clearTimeout(ringTimeoutRef.current);
      ringTimeoutRef.current = null;
    }

    // Only auto-drop incoming rings
    if (isIncomingRing) {
      ringTimeoutRef.current = setTimeout(() => {
        const state = useDialerStore.getState();
        const num = state.number || number || '';

        // Log outcome
        const msg = `[CALL] Missed incoming call${num ? ` from ${num}` : ''} (${RING_TIMEOUT_MS / 1000}s timeout → ACW)`;
        if (typeof state._pushLog === 'function') {
          state._pushLog(msg);
        } else {
          useDialerStore.setState((s) => ({
            log: [...(s.log || []), { t: Date.now(), src: 'CALL', msg }],
          }));
        }

        // Add to recent calls (no recording, duration 0)
        useDialerStore.setState((s) => ({
          recentCalls: [
            ...(s.recentCalls || []),
            {
              when: Date.now(),
              number: num || '(unknown)',
              name: state.currentLead?.name || 'Unknown',
              honorific: state.currentLead?.honorific || undefined,
              durationMs: 0,
              recorded: false,
              recordingUrl: null,
              iso: state.dialMeta?.iso || undefined,
              language: state.currentLead?.language || undefined,
              outcome: 'missed-incoming',
            },
          ],
        }));

        // Mark the miss (for Agent card warning)
        if (typeof state.markMissed === 'function') {
          state.markMissed({ number: num || undefined, kind: 'missed-incoming', reason: 'timeout' });
        } else {
          useDialerStore.setState({
            lastMissed: { at: Date.now(), number: num || undefined, kind: 'missed-incoming', reason: 'timeout' }
          });
        }

        // Move to ACW (not ended)
        if (typeof state.setACW === 'function') {
          state.setACW();
        } else {
          useDialerStore.setState({ callStatus: 'acw', acwStartedAt: Date.now() });
        }

        stopRingLoop();   // stop local ring sound loop if active
        setPlayingId(null);
      }, RING_TIMEOUT_MS);
    }

    return () => {
      if (ringTimeoutRef.current) {
        clearTimeout(ringTimeoutRef.current);
        ringTimeoutRef.current = null;
      }
    };
  }, [callStatus, number]);

  // ---- CALL SCREENS ----
  if (scenarioActive) {
    return (
      <Card sx={{ position: 'relative' }} ref={cardRef}>
        <ShimmerGlitch active={glitchActive} />
        <CardContent>
          {/* pass containerEl so participants popover is confined */}
          <ScenarioCallView containerEl={cardRef.current} />
        </CardContent>
      </Card>
    );
  }

  // ---- IDLE ----
  return (
    <Card sx={{ position: 'relative' }} ref={cardRef}>
      <ShimmerGlitch active={glitchActive} />
      <CardContent sx={{ position: 'relative', zIndex: 2 }}>
        <Stack spacing={2}>
          {/* Phone "display" */}
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 1,
              p: 2,
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              '@keyframes shake': {
                '10%, 90%': { transform: 'translateX(-1px)' },
                '20%, 80%': { transform: 'translateX(2px)' },
                '30%, 50%, 70%': { transform: 'translateX(-4px)' },
                '40%, 60%': { transform: 'translateX(4px)' },
                '100%': { transform: 'translateX(0)' },
              },
            }}
          >
            {/* header row: status + quality on left, network on right */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center">
                {statusChip}
                <QualityPill />
              </Stack>

              {/* Right group: Bell + Signal meters */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ transform: 'translateY(-2px)' }}
              >
                <Tooltip title={ringSoundOn ? 'Disable ring sound' : 'Enable ring sound'}>
                  <IconButton size="small" onClick={toggleRingSound} sx={{ p: 0.5 }}>
                    {ringSoundOn ? <Bell size={16} /> : <BellOff size={16} />}
                  </IconButton>
                </Tooltip>

                <Box
                  sx={{
                    borderColor: 'divider',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <SignalMeters />
                </Box>
              </Stack>
            </Stack>

            {/* center message with side volume bars */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <VolumeBar level={micLevel} />
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                Waiting for new call…
              </Typography>
              <VolumeBar level={spkLevel} color="secondary.main" />
            </Box>

            {/* phone input + keypad toggle at bottom */}
            <Box sx={{ animation: nudgeNoNumber ? 'shake 0.45s ease-in-out' : 'none' }}>
              <TextField
                fullWidth
                size="medium"
                type="tel"
                placeholder="Enter phone number"
                value={info.formatted}
                onChange={onChange}
                error={isInvalid || nudgeNoNumber}
                helperText={helperText}
                autoComplete="off"
                inputProps={{ autoComplete: 'off', name: 'softphone-number' }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  '& input::placeholder': { color: nudgeNoNumber ? 'error.main' : 'text.secondary', opacity: 1 },
                  '& input:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0px 1000px transparent inset',
                    WebkitTextFillColor: 'inherit',
                    transition: 'background-color 9999s ease-out 0s'
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pointerEvents: 'auto' }}>
                      <CountryPicker iso={iso} onChange={handleCountryChange} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end" sx={{ pointerEvents: 'auto' }}>
                      <Tooltip title="Show/Hide keypad">
                        <IconButton onClick={toggleKeypad} aria-label="Toggle keypad">
                          <Keyboard size={18} />
                        </IconButton>
                      </Tooltip>
                      {hasInput && (
                        <Tooltip title="Backspace">
                          <IconButton onClick={onBackspace} aria-label="Backspace">
                            <Delete size={18} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>

          {/* keypad (visible by default) — centered OR a placeholder when hidden */}
          {keypadOpen ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <SoftphoneKeypad />
            </Box>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                // ~4 rows * 56px + row gaps ~ 248px total height to match the keypad
                minHeight: 248,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                borderStyle: 'dashed',
                color: 'text.secondary',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.08)' },
                  '100%': { transform: 'scale(1)' }
                }
              }}
            >
              <Keyboard size={18} style={{ animation: 'pulse 1.8s ease-in-out infinite' }} />
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Tip: type with your keyboard or tap the keypad button to show the pad.
              </Typography>
            </Paper>
          )}


          {/* actions row (now 4 buttons incl. inbound) */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Fab color="success" onClick={onCall} aria-label="Call" disabled={!canIdleActions}>
              <PhoneCall size={20} />
            </Fab>

            <Tooltip title={muted ? 'Unmute' : 'Mute'}>
              <span>
                <Fab
                  color="default"
                  onClick={toggleMute}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                  sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}
                  disabled={!canIdleActions}
                >
                  {muted ? <MicOff size={20} /> : <Mic size={20} />}
                </Fab>
              </span>
            </Tooltip>

            {/* Redial: single click opens popup (no more dbl-click) */}
            <Tooltip title="Redial — pick from recent">
              <span>
                <Fab
                  ref={redialBtnRef}
                  color="default"
                  onClick={openRedialPopup}
                  aria-label="Redial"
                  sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}
                  disabled={!canIdleActions}
                >
                  <RotateCcw size={20} />
                </Fab>
              </span>
            </Tooltip>

            <Tooltip title="Get new call">
              <span>
                <Fab
                  color="default"
                  onClick={() => inboundRinging('+256 200 123 456')}
                  aria-label="Get new call"
                  sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}
                  disabled={!canIdleActions}
                >
                  <PhoneIncoming size={20} />
                </Fab>
              </span>
            </Tooltip>
          </Stack>

          {/* Redial history popup (confined to card) */}
          <Popover
            open={openRedial}
            anchorEl={redialAnchor}
            onClose={closeRedialPopup}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            disablePortal
            container={cardRef.current}
            PaperProps={{ sx: { p: 1, width: 420, maxWidth: 'calc(100% - 24px)' } }}
          >
            <List dense>
              {recentCalls.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center', opacity: 0.7 }}>
                  <Typography variant="body2">No recent calls.</Typography>
                </Box>
              ) : (
                recentCalls
                  .slice()
                  .reverse()
                  .slice(0, 20)
                  .map((c, idx) => (
                    <ListItem key={idx}>
                      <ListItemAvatar><Avatar /></ListItemAvatar>
                      <ListItemText
                        primary={`${c.honorific ? c.honorific + ' ' : ''}${c.name || 'Unknown'}`}
                        secondary={`${c.number} • ${fmtDuration(c.durationMs)}${(c.iso || c.language) ? ' • ' + isoLang(c.iso, c.language) : ''}`}
                      />

                      <ListItemSecondaryAction>
                        {c.recorded && (
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}>
                            <Disc size={14} color="#e53935" style={{ marginRight: 6 }} />
                            <Typography variant="caption" sx={{ mr: 1 }}>
                              {fmtDuration(c.recordDurationMs ?? c.durationMs)}
                            </Typography>
                            <Tooltip title={playingId === c.when ? 'Stop playback' : (c.recordingUrl ? 'Play recording' : 'No recording file')}>
                              <span>
                                <IconButton
                                  edge="end"
                                  onClick={() => togglePlay(c.when, c.recordingUrl)}
                                  disabled={!c.recordingUrl}
                                  sx={{ mr: 0.5 }}
                                >
                                  {playingId === c.when ? <Pause size={18} /> : <Play size={18} />}
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
                        )}
                        <Tooltip title="Redial">
                          <IconButton edge="end" onClick={() => dialFromHistory(c.number)}>
                            <PhoneCall size={18} />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
              )}
            </List>
          </Popover>
        </Stack>
      </CardContent>
    </Card>
  );
}
