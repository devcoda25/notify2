import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from './header-bar.module.css';
import { CHANNELS } from './channel-meta.js';
import { Input } from '../ui/input.jsx';
import { Undo, Redo, TestTube, Save, ChevronDown, Check, File as FileIcon, Folder, Trash2 } from 'lucide-react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

/** Handy class combiner */
function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

export default function HeaderBar({
  title,
  initialTitle = 'Untitled Flow',
  channels,
  availableChannels,
  onChannelsChange,
  waContext,
  onWaContextChange,
  onSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onTest,
  onSaveClick,
  onNewFlow,
  onOpenFlows,
  onDeleteFlow,
  className,
}) {
  const [currentTitle, setCurrentTitle] = useState(title ?? initialTitle);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (title) setCurrentTitle(title);
  }, [title]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const allChannels = useMemo(
    () =>
      availableChannels && availableChannels.length
        ? CHANNELS.filter((c) => availableChannels.includes(c.id))
        : CHANNELS,
    [availableChannels]
  );

  const headerId = useId();
  const selectedMeta = allChannels.filter((c) => channels.includes(c.id));
  const MAX_BADGES = 4;
  const overflow = Math.max(0, selectedMeta.length - MAX_BADGES);
  const showBadges = selectedMeta.slice(0, MAX_BADGES);

  function commitTitle(val) {
    const trimmed = val.trim().length ? val.trim() : 'Untitled Flow';
    setCurrentTitle(trimmed);
    onSave?.(trimmed);
    setEditing(false);
  }

  function onTitleKeyDown(e) {
    if (e.key === 'Enter') commitTitle(e.currentTarget.value);
    else if (e.key === 'Escape') {
      setCurrentTitle(title ?? initialTitle);
      setEditing(false);
    }
  }

  function toggleChannel(ch) {
    const set = new Set(channels);
    set.has(ch) ? set.delete(ch) : set.add(ch);
    onChannelsChange(Array.from(set));
  }

  // --- Material UI menu state ---
  const [flowsAnchorEl, setFlowsAnchorEl] = useState(null);
  const [channelsAnchorEl, setChannelsAnchorEl] = useState(null);

  const openFlows = Boolean(flowsAnchorEl);
  const openChannels = Boolean(channelsAnchorEl);

  const handleFlowsClick = (event) => setFlowsAnchorEl(event.currentTarget);
  const handleFlowsClose = () => setFlowsAnchorEl(null);

  const handleChannelsClick = (event) => setChannelsAnchorEl(event.currentTarget);
  const handleChannelsClose = () => setChannelsAnchorEl(null);

  return (
    <header className={cn(styles.header, className)} aria-labelledby={headerId}>
      <h2 id={headerId} className={styles.visuallyHidden}>Flow Builder Header</h2>
      <div className={styles.left}>
        {/* --- Flows Menu --- */}
        <Button variant="outlined" onClick={handleFlowsClick}>
          Flows <ChevronDown className="h-4 w-4" />
        </Button>
        <Menu anchorEl={flowsAnchorEl} open={openFlows} onClose={handleFlowsClose}>
          <MenuItem onClick={() => { onNewFlow?.(); handleFlowsClose(); }}>
            <FileIcon className="mr-2 h-4 w-4" /> New Flow
          </MenuItem>
          <MenuItem onClick={() => { onOpenFlows?.(); handleFlowsClose(); }}>
            <Folder className="mr-2 h-4 w-4" /> Open Flow…
          </MenuItem>
          <MenuItem onClick={() => { onDeleteFlow?.(); handleFlowsClose(); }} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" /> Delete Current Flow
          </MenuItem>
        </Menu>

        {/* --- Channels Menu --- */}
        <Button variant="outlined" onClick={handleChannelsClick} aria-haspopup="listbox" aria-expanded={openChannels}>
          Channels <ChevronDown className="h-4 w-4" />
        </Button>
        <Menu anchorEl={channelsAnchorEl} open={openChannels} onClose={handleChannelsClose}>
          <div className={styles.popHeader}>
            <span className={styles.popTitle}>Channels</span>
            <div className={styles.popActions}>
              <Button size="small" onClick={() => onChannelsChange(allChannels.map((c) => c.id))}>Select all</Button>
              <Button size="small" onClick={() => onChannelsChange([])}>Clear</Button>
            </div>
          </div>
          {allChannels.map((ch) => {
            const checked = channels.includes(ch.id);
            return (
              <MenuItem key={ch.id} onClick={() => toggleChannel(ch.id)}>
                <input type="checkbox" checked={checked} readOnly className="hidden" />
                {checked ? <Check size={16} /> : <div className="w-4 h-4" />}
                <span className={styles.itemLabel}>{ch.label}</span>
                <span className={styles.itemShort}>{ch.short}</span>
              </MenuItem>
            );
          })}
        </Menu>

        {/* --- WhatsApp Context --- */}
        {channels.includes('whatsapp') && onWaContextChange && (
          <label className={styles.segment} aria-label="WhatsApp message context">
            <span className={styles.segmentLabel}>WA Context</span>
            <select
              className={styles.select}
              value={waContext ?? 'template'}
              onChange={(e) => onWaContextChange(e.target.value)}
            >
              <option value="template">Template</option>
              <option value="in-session">In‑session</option>
            </select>
          </label>
        )}

        {/* --- Flow Title --- */}
        <div className={styles.titleWrap}>
          {editing ? (
            <Input
              ref={inputRef}
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              onBlur={(e) => commitTitle(e.target.value)}
              onKeyDown={onTitleKeyDown}
              className={styles.titleInput}
              aria-label="Flow title"
              maxLength={50}
            />
          ) : (
            <button
              type="button"
              className={styles.titleButton}
              onClick={() => setEditing(true)}
              title="Click to rename"
              aria-label="Flow title. Click to rename."
            >
              <span className={styles.titleText} title={currentTitle}>{currentTitle}</span>
            </button>
          )}
        </div>
      </div>

      {/* --- Right Controls --- */}
      <div className={styles.right}>
        <div className={styles.group}>
          <Button variant="text" size="small" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl/Cmd+Z)"><Undo /></Button>
          <Button variant="text" size="small" onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl/Cmd+Shift+Z)"><Redo /></Button>
        </div>
        <Button variant="outlined" onClick={onTest}><TestTube className="mr-2 h-4 w-4" /> Test Flow</Button>
        <div className={styles.group}>
          {onSaveClick && <Button   sx={{backgroundColor: '#710193',

          }} variant="contained"  onClick={onSaveClick}><Save  className="mr-2 h-4 w-4" /> Save</Button>}
        </div>
      </div>
    </header>
  );
}
