// /src/Component/dailer/AgentProfileCard.js
import { useEffect, useMemo, useState } from 'react';
import {
  Card, CardContent, Avatar, Typography, Chip, Box, Stack, Tooltip, LinearProgress
} from '@mui/material';
import { keyframes } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { AlertTriangle } from 'lucide-react';
import { useDialerStore } from '../store/useDialerStore';

/* ---------- helpers ---------- */
const hms = (ms) => {
  const sec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h
    ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};
const mmss = (s) => {
  const mm = String(Math.max(0, Math.floor(s / 60))).padStart(2, '0');
  const ss = String(Math.max(0, s % 60)).padStart(2, '0');
  return `${mm}:${ss}`;
};

function KPI({ label, value, hint }) {
  return (
    <Tooltip title={hint || ''} arrow disableHoverListener={!hint}>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" noWrap>{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.1 }} noWrap>
          {value}
        </Typography>
      </Box>
    </Tooltip>
  );
}

/** Theme-aware ring pulse */
const makeRingPulse = (rgba) => keyframes`
  0% {
    box-shadow:
      0 0 0 0 ${rgba(0.40)},
      0 0 0 0 ${rgba(0.20)};
    transform: translateZ(0);
  }
  60% {
    box-shadow:
      0 0 0 10px ${rgba(0)},
      0 0 0 22px ${rgba(0)};
  }
  100% {
    box-shadow:
      0 0 0 0 ${rgba(0)},
      0 0 0 0 ${rgba(0)};
  }
`;

const ringShimmer = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;

/** Soft error pulse for missed→ACW */
const makeWarnPulse = (rgba) => keyframes`
  0%   { box-shadow: 0 0 0 0 ${rgba(0.36)}; }
  60%  { box-shadow: 0 0 0 14px ${rgba(0)}; }
  100% { box-shadow: 0 0 0 0 ${rgba(0)}; }
`;

/** Continuous gentle shake */
const shakeLoopKF = keyframes`
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
  100% { transform: translateX(0); }
`;

export default function AgentProfileCard() {
  const t = useTheme();

  // Cool, night-friendly highlight:
  const ringBase = t.palette.mode === 'dark'
    ? (t.palette.info?.main || '#00BCD4')
    : (t.palette.primary?.main || '#3F51B5');

  // hex → rgba(alpha)
  const toRGBA = (hex, alpha) => {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const n = parseInt(full, 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const ringRGBA = (a) => toRGBA(ringBase, a);
  const ringPulseKF = useMemo(() => makeRingPulse((a) => ringRGBA(a)), [ringBase]);

  const errorBase = t.palette.error?.main || '#f44336';
  const errorRGBA = (a) => toRGBA(errorBase, a);
  const warnPulseKF = useMemo(() => makeWarnPulse((a) => errorRGBA(a)), [errorBase]);

  const {
    agentStatus,
    agentProfile,
    loginAt, setLoginAt,
    callStatus,
    engagementStartedAt,
    metrics,
    lastMissed,
  } = useDialerStore((s) => ({
    agentStatus: s.agentStatus,
    agentProfile: s.agentProfile,
    loginAt: s.loginAt, setLoginAt: s.setLoginAt,
    callStatus: s.callStatus,
    engagementStartedAt: s.engagementStartedAt,
    metrics: s.metrics,
    lastMissed: s.lastMissed,
  }));

  const isRinging = callStatus === 'ringing-in' || callStatus === 'ringing-out';

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Ensure login time exists so UI never shows dashes
  useEffect(() => {
    if (!loginAt && typeof setLoginAt === 'function') setLoginAt(Date.now());
  }, [loginAt, setLoginAt]);

  const loginMs = useMemo(() => (loginAt ? new Date(loginAt).getTime() : null), [loginAt]);

  // Timers
  const engagedTimer = useMemo(() => {
    if (!engagementStartedAt) return null;
    return hms(now - engagementStartedAt);
  }, [engagementStartedAt, now]);

  const shiftTimer = useMemo(() => (loginMs ? hms(now - loginMs) : null), [loginMs, now]);

  const timeUnderName = useMemo(() => {
    if (isRinging && engagedTimer) return `Incoming call… · ${engagedTimer}`;
    if (callStatus === 'acw' && engagedTimer) return `ACW · ${engagedTimer}`;
    if (engagedTimer) return `Engaged · ${engagedTimer}`;
    if (shiftTimer) return `On shift · ${shiftTimer}`;
    return 'Ready';
  }, [isRinging, callStatus, engagedTimer, shiftTimer]);

  const statusChip = useMemo(() => {
    const map = {
      idle:          { label: 'Idle', color: 'default' },
      'ringing-in':  { label: 'Ringing', color: 'info' },
      'ringing-out': { label: 'Ringing', color: 'info' },
      'in-call':     { label: 'In Call', color: 'success' },
      ended:         { label: 'Ended', color: 'default' },
      acw:           { label: 'ACW', color: 'secondary' },
    };
    return map[callStatus] || { label: agentStatus || 'Available', color: 'default' };
  }, [callStatus, agentStatus]);

  // KPIs (kept — except "Today" and "Target" removed)
  const mos = typeof metrics?.mos === 'number' ? metrics.mos : 3.76;
  const mosColor = mos >= 4 ? 'success' : mos >= 3 ? 'warning' : 'error';
  const aht = typeof metrics?.ahtSec === 'number' ? mmss(Math.round(metrics.ahtSec)) : '00:00';
  const asr = typeof metrics?.asr === 'number' ? `${Math.round(metrics.asr)}%` : '0%';
  const cph = typeof metrics?.callsPerHour === 'number' ? metrics.callsPerHour.toFixed(1) : '0.0';
  const connect = typeof metrics?.connectRate === 'number' ? `${Math.round(metrics.connectRate)}%` : '0%';

  // Identity
  const initials = agentProfile?.initials || 'AA';
  const displayName = agentProfile?.name || 'Agent';

  // Bottom row
  const campaignStatic = 'Acquisition – Q3';
  const bottomLogin = loginMs
    ? new Date(loginMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '00:00';
  const bottomDuration = shiftTimer || '00:00';

  // === Missed→ACW signal (PERSIST through ACW) ===
  const missedActive = Boolean(lastMissed && callStatus === 'acw');

  return (
    <Card
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1.5,
        m: 0,
        minHeight: 140,
        display: 'flex',
        border: `1px solid ${theme.palette.divider}`,

        // Ringing glow (cool color)
        ...(isRinging && {
          borderColor: ringBase,
          animation: `${ringPulseKF} 1.6s ease-out infinite`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '40%',
            background: `linear-gradient(90deg,
              rgba(255,255,255,0) 0%,
              ${ringRGBA(theme.palette.mode === 'dark' ? 0.18 : 0.12)} 50%,
              rgba(255,255,255,0) 100%
            )`,
            transform: 'translateX(-100%)',
            animation: `${ringShimmer} 1.6s linear infinite`,
            mixBlendMode: theme.palette.mode === 'dark' ? 'screen' : 'multiply',
            pointerEvents: 'none',
          },
        }),

        // Missed→ACW halo (persists) + continuous shake until ACW ends
        ...(missedActive && {
          borderColor: errorBase,
          animation: `${warnPulseKF} 1.8s ease-out infinite, ${shakeLoopKF} .6s ease-in-out infinite`,
        }),

        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          '&::before': { animation: 'none' },
        },
      })}
    >
      <CardContent
        sx={{
          p: 1.25,
          width: '100%',
          display: 'grid',
          gridTemplateRows: 'auto auto auto', // header, KPIs, bottom row
          rowGap: 0.75,
        }}
      >
        {/* HEADER */}
        <Box sx={{ minWidth: 0 }}>
          <Stack spacing={0.75}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0, flex: 1 }}>
                <Avatar
                  src={agentProfile?.avatarUrl || undefined}
                  sx={{
                    width: 40,
                    height: 40,
                    fontSize: 15,
                    bgcolor: isRinging ? ringBase : t.palette.primary.main,
                    flexShrink: 0,
                    transition: 'background-color .2s ease',
                  }}
                >
                  {initials}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" title={displayName} sx={{ fontWeight: 700 }} noWrap={false}>
                    {displayName}
                  </Typography>

                  {/* time line (no Missed chip here anymore) */}
                  <Typography variant="caption" color="text.secondary">
                    {timeUnderName}
                  </Typography>
                </Box>
              </Stack>

              {/* Right chips row — Missed chip moved here, on the LEFT of status+MOS */}
              <Stack direction="row" spacing={0.5} alignItems="center" flexShrink={0}>
                {missedActive && (
                  <Chip
                    size="small"
                    color="error"
                    variant="filled"
                    label="Missed call"
                    icon={<AlertTriangle size={14} />}
                    sx={{ height: 22 }}
                  />
                )}
                <Chip size="small" label={statusChip.label} color={statusChip.color} />
                <Chip size="small" color={mosColor} label={`MOS ${mos.toFixed(2)}`} variant="outlined" />
              </Stack>
            </Stack>

            {/* Progress row — left in place but neutral (no Today/Target state usage) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 6,
                  borderRadius: 999,
                  flex: 1,
                  '& .MuiLinearProgress-bar': { borderRadius: 999 },
                  ...(isRinging && {
                    background: `repeating-linear-gradient(45deg,
                      ${ringRGBA(t.palette.mode === 'dark' ? 0.28 : 0.18)} 0 8px,
                      ${ringRGBA(t.palette.mode === 'dark' ? 0.44 : 0.32)} 8px 16px
                    )`,
                  }),
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                {/* intentionally blank label to avoid showing Today/Target counts */}
                &nbsp;
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* KPI GRID — “Today” and “Target” removed */}
        <Box
          sx={{
            minWidth: 0,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, minmax(0,1fr))' },
            gap: 1,
          }}
        >
          <KPI label="AHT" value={aht} hint="Average Handle Time" />
          <KPI label="ASR" value={asr} hint="Answer Seizure Rate" />
          <KPI label="CPH" value={cph} hint="Calls Per Hour" />
          <KPI label="Connect" value={connect} hint="Answered ÷ Attempts" />
        </Box>

        {/* BOTTOM ROW */}
        <Box sx={{ mt: 0.25, pt: 0.5, borderTop: (th) => `1px solid ${th.palette.divider}` }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: { xs: 0.5, sm: 2 },
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">Login</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {bottomLogin}
              </Typography>
            </Box>
            <Box sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
              <Typography variant="caption" color="text.secondary">Duration</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {bottomDuration}
              </Typography>
            </Box>
            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant="caption" color="text.secondary">Campaign</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                {campaignStatic}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
