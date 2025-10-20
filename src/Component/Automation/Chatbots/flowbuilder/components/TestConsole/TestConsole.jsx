import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './test-console.module.css';
import clsx from 'clsx';
import Toolbar from './parts/Toolbar';
import ChatPreview from './parts/ChatPreview';
import VoicePreview from './parts/VoicePreview';
import TracePanel from './parts/TracePanel';
import ContextEditor from './parts/ContextEditor';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { nanoid } from 'nanoid';

const DEFAULT_CHANNEL = 'whatsapp';

export default function TestConsole({
  isOpen,
  onClose,
  engine,
  initialChannel = DEFAULT_CHANNEL,
  initialContext,
  flowId,
  className
}) {
  const [channel, setChannel] = useState(initialChannel);
  const [status, setStatus] = useState('idle');
  const [messages, setMessages] = useState([]);
  const [trace, setTrace] = useState([]);
  const [showContext, setShowContext] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!engine) return;
    const onBot = (msg) => setMessages((m) => m.concat({ ...msg, id: msg.id || nanoid(), from: 'bot' }));
    const onTrace = (evt) => setTrace((t) => t.concat(evt));
    const onStatus = (st) => setStatus(st);

    const unsubBot = engine.on('botMessage', onBot);
    const unsubTrace = engine.on('trace', onTrace);
    const unsubStatus = engine.on('status', onStatus);

    if (isOpen) {
      engine.start(flowId);
    } else {
        engine.stop();
    }

    return () => {
      unsubBot();
      unsubTrace();
      unsubStatus();
    };
  }, [engine, flowId, isOpen]);

  useEffect(() => {
    if (engine) engine.configure({ channel });
  }, [channel, engine]);
  
  const lastBotText = useMemo(() => {
    const b = [...messages].reverse().find(m => m.from === 'bot');
    return b?.text;
  }, [messages]);

  function sendUserReply(text) {
    const msg = { id: nanoid(), from: 'user', text };
    setMessages((m) => m.concat(msg));
    engine?.pushUserInput(text);
  }

  const onRestart = () => {
    engine?.reset?.();
    engine?.start(flowId);
    setMessages([]);
    setTrace([]);
  };

  const onExportTrace = () => {
    const blob = new Blob([JSON.stringify(trace, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trace.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <aside ref={panelRef} className={clsx(styles.root, className)} aria-label="Test Console">
      <div className={styles.header}>
        <h2 className={styles.title}>Test Console</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="h-8 w-8">
            <X className="h-4 w-4" />
        </Button>
      </div>

      <Toolbar
        channel={channel}
        setChannel={setChannel}
        status={status}
        onPlay={() => engine.start()}
        onPause={() => engine.stop()} 
        onStep={() => {}} 
        onRestart={onRestart}
        onClearChat={() => setMessages([])}
        onClearTrace={() => setTrace([])}
        onToggleContext={() => setShowContext((v) => !v)}
        onExportTrace={onExportTrace}
        autoScroll={autoScroll}
        onAutoScrollChange={setAutoScroll}
      />

      <div className={styles.body}>
        <div className={styles.mainAndContext}>
            {channel === 'voice' ? (
              <VoicePreview ttsText={lastBotText} />
            ) : (
              <ChatPreview messages={messages} channel={channel} onUserReply={sendUserReply} autoScroll={autoScroll} />
            )}

            {showContext && (
              <div className={styles.contextPanel}>
                <ContextEditor
                  initial={initialContext}
                  onApply={(ctx) => {
                    engine.reset();
                    engine.configure({ channel, ...ctx });
                    engine.start(flowId);
                  }}
                />
              </div>
            )}
        </div>

        <div className={styles.tracePanel}>
          <TracePanel trace={trace} onClear={() => setTrace([])} />
        </div>
      </div>
    </aside>
  );
}