import { useEffect } from 'react';
import { useDialerStore } from '../store/useDialerStore';

export default function useAudioMeters() {
  const setMic = (v) => useDialerStore.setState({ micLevel: v });
  const setSpk = (v) => useDialerStore.setState({ spkLevel: v });

  useEffect(() => {
    let micStream, micCtx, micAnalyser, micData, micReq;
    let spkCtx, spkAnalyser, spkData, spkReq, spkSrc;

    const smooth = (prev, next, a = 0.35) => prev * (1 - a) + next * a;

    // MIC
    (async () => {
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micCtx = new (window.AudioContext || window.webkitAudioContext)();
        const src = micCtx.createMediaStreamSource(micStream);
        micAnalyser = micCtx.createAnalyser();
        micAnalyser.fftSize = 256;
        micData = new Uint8Array(micAnalyser.frequencyBinCount);
        src.connect(micAnalyser);

        let micLevel = 0.05;
        const micLoop = () => {
          micAnalyser.getByteTimeDomainData(micData);
          // compute RMS
          let sum = 0;
          for (let i = 0; i < micData.length; i++) {
            const v = (micData[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / micData.length);
          micLevel = smooth(micLevel, Math.min(1, rms * 3.2));
          setMic(micLevel);
          micReq = requestAnimationFrame(micLoop);
        };
        micLoop();
      } catch {
        // no mic permission; leave store-driven simulation
      }
    })();

    // SPEAKER (if you attach a remote <audio id="softphone-remote-audio">)
    const audioEl = document.getElementById('softphone-remote-audio');
    if (audioEl) {
      try {
        spkCtx = new (window.AudioContext || window.webkitAudioContext)();
        spkSrc = spkCtx.createMediaElementSource(audioEl);
        spkAnalyser = spkCtx.createAnalyser();
        spkAnalyser.fftSize = 256;
        spkData = new Uint8Array(spkAnalyser.frequencyBinCount);
        spkSrc.connect(spkAnalyser).connect(spkCtx.destination);

        let spkLevel = 0.05;
        const spkLoop = () => {
          spkAnalyser.getByteTimeDomainData(spkData);
          let sum = 0;
          for (let i = 0; i < spkData.length; i++) {
            const v = (spkData[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / spkData.length);
          spkLevel = smooth(spkLevel, Math.min(1, rms * 3.2));
          setSpk(spkLevel);
          spkReq = requestAnimationFrame(spkLoop);
        };
        spkLoop();
      } catch {
        // ignore
      }
    }

    return () => {
      cancelAnimationFrame(micReq);
      cancelAnimationFrame(spkReq);
      micStream && micStream.getTracks().forEach(t => t.stop());
      micCtx && micCtx.close();
      spkCtx && spkCtx.close();
    };
  }, []);
}
