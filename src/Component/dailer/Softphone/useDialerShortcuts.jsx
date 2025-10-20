import { useEffect } from 'react';
import { useDialerStore } from '../../store/useDialerStore';

export default function useDialerShortcuts() {
  const {
    callStatus, appendDigit, sendDtmf, toggleMute, endCall, startCall, toggleKeypad,
  } = useDialerStore((s) => ({
    callStatus: s.callStatus,
    appendDigit: s.appendDigit,
    sendDtmf: s.sendDtmf,
    toggleMute: s.toggleMute,
    endCall: s.endCall,
    startCall: s.startCall,
    toggleKeypad: s.toggleKeypad,
  }));

  useEffect(() => {
    const onKey = (e) => {
      // ✅ Ignore when typing into an input/textarea/contentEditable
      const t = e.target;
      const tag = t?.tagName?.toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || t?.isContentEditable;
      if (typing) return;

      const k = e.key;
      const isDigit = /^[0-9]$/.test(k) || k === '*' || k === '#';

      if (isDigit) {
        if (callStatus === 'in-call') sendDtmf(k);
        else appendDigit(k);
        return;
      }
      if (k === 'm') { toggleMute(); return; }
      if (k === 'k') { toggleKeypad(); return; }
      if (k === 'Escape' && callStatus === 'in-call') endCall('hangup');
      if (k === 'Enter' && (callStatus === 'idle' || callStatus === 'ended' || callStatus === 'acw')) {
        startCall();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [callStatus, appendDigit, sendDtmf, toggleMute, endCall, startCall, toggleKeypad]);
}
