import { Chip, Tooltip } from '@mui/material';
import { useDialerStore } from '../../store/useDialerStore';

export default function QualityPill() {
  const { rttMs, jitterMs, mos } = useDialerStore(s => s.metrics) || {};
  const status =
    mos == null ? 'default' :
    mos >= 4 ? 'success' :
    mos >= 3.5 ? 'warning' : 'error';

  const label = mos == null ? 'QoS' : `MOS ${mos}`;
  const tip = `RTT: ${rttMs ?? '-'}ms • Jitter: ${jitterMs ?? '-'}ms`;

  return (
    <Tooltip title={tip}>
      <Chip size="small" color={status} label={label} />
    </Tooltip>
  );
}
