
import React from 'react';
import styles from '../test-console.module.css';
import clsx from 'clsx';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Play, Pause, SkipForward, RotateCcw, Binary, Download } from 'lucide-react';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';

export default function Toolbar({
  channel, setChannel,
  status,
  onPlay, onPause, onStep, onRestart,
  onClearChat, onClearTrace,
  onToggleContext, onExportTrace,
  autoScroll, onAutoScrollChange,
}) {
  const CHANNELS = ['whatsapp','sms','email','push','voice','slack','teams','telegram'];
  const busy = status === 'running';

  return (
    <div className={styles.toolbar}>
      <div className={styles.group}>
        <Select value={channel} onValueChange={(v) => setChannel(v)}>
            <SelectTrigger className="w-[120px] h-9">
                <SelectValue/>
            </SelectTrigger>
            <SelectContent>
                {CHANNELS.map(ch => <SelectItem key={ch} value={ch}>{ch.charAt(0).toUpperCase() + ch.slice(1)}</SelectItem>)}
            </SelectContent>
        </Select>
      </div>

      <div className={styles.group}>
        {status !== 'running' ? (
          <Button size="sm" variant="outline" onClick={onPlay} disabled={busy} title="Play"><Play className="h-4 w-4"/></Button>
        ) : (
          <Button size="sm" variant="outline" onClick={onPause} disabled={!busy} title="Pause"><Pause className="h-4 w-4"/></Button>
        )}
        <Button size="sm" variant="outline" onClick={onStep} disabled={true} title="Step (Not implemented)"><SkipForward className="h-4 w-4"/></Button>
        <Button size="sm" variant="outline" onClick={onRestart} title="Restart"><RotateCcw className="h-4 w-4"/></Button>
      </div>
      
      <div className="flex-grow" />

      <div className={styles.group}>
          <div className="flex items-center space-x-2">
            <Checkbox id="autoscroll" checked={autoScroll} onCheckedChange={(c) => onAutoScrollChange(!!c)} />
            <Label htmlFor="autoscroll" className="text-xs font-normal">Auto-scroll</Label>
          </div>
        <Button size="sm" variant="outline" onClick={onToggleContext}><Binary className="h-4 w-4 mr-1"/> Context</Button>
        <Button size="sm" variant="outline" onClick={onExportTrace}><Download className="h-4 w-4 mr-1"/> Export Trace</Button>
      </div>

      <span className={clsx(styles.badge, status === 'running' && styles.badgeGreen, status === 'paused' && styles.badgeOrange, status === 'waiting' && styles.badgeOrange)}>
        {status.toUpperCase()}
      </span>
    </div>
  );
}
