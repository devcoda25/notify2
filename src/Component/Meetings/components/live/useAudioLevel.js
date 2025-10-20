// Path: /src/Component/Meetings/components/live/hooks/useAudioLevel.js
import { useEffect, useRef, useState } from "react";

// Reuse one AudioContext for all tiles
let sharedCtx = null;
function getCtx() {
  if (!sharedCtx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (Ctor) sharedCtx = new Ctor();
  }
  return sharedCtx;
}

/**
 * useAudioLevel(stream, opts) -> level 0..1
 * - Lightweight RMS-based VAD. No extra deps.
 * - Works even if stream isn’t attached to an <audio> element.
 */
export default function useAudioLevel(
  stream,
  {
    fftSize = 2048,
    smoothing = 0.8,
    minDb = -80,      // noise floor
    maxDb = -15,      // loud speech
    interval = 60,    // ms sample cadence
  } = {}
) {
  const [level, setLevel] = useState(0);
  const rafRef = useRef(0);
  const tickRef = useRef(0);
  const srcRef = useRef(null);
  const analyserRef = useRef(null);
  const dataRef = useRef(null);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    const ctx = getCtx();
    const hasAudio = !!stream?.getAudioTracks?.().length;
    if (!ctx || !stream || !hasAudio) {
      setLevel(0);
      return () => { aliveRef.current = false; };
    }

    try {
      // Create nodes
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothing;
      source.connect(analyser);

      srcRef.current = source;
      analyserRef.current = analyser;
      dataRef.current = new Float32Array(analyser.fftSize);

      // rAF sampler throttled to ~interval ms
      const loop = (t) => {
        if (!aliveRef.current) return;
        if (!tickRef.current) tickRef.current = t;
        const dt = t - tickRef.current;

        if (dt >= interval) {
          tickRef.current = t;
          const buf = dataRef.current;
          analyser.getFloatTimeDomainData(buf);

          // RMS
          let sum = 0;
          for (let i = 0; i < buf.length; i++) {
            const v = buf[i];
            sum += v * v;
          }
          const rms = Math.sqrt(sum / buf.length) || 0;

          // Convert to dB relative to full scale (approx)
          const db = 20 * Math.log10(rms || 1e-8);

          // Normalize to 0..1
          const norm = (db - minDb) / Math.max(1, (maxDb - minDb));
          const clamped = Math.max(0, Math.min(1, norm));

          // A little extra easing so UI feels stable
          setLevel((prev) => prev + (clamped - prev) * 0.35);
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (e) {
      // Some browsers block without user gesture
      console.warn("useAudioLevel: failed to init analyser", e);
      setLevel(0);
    }

    return () => {
      aliveRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try {
        srcRef.current?.disconnect();
        analyserRef.current?.disconnect?.();
      } catch {}
      srcRef.current = null;
      analyserRef.current = null;
      dataRef.current = null;
    };
  }, [stream, fftSize, smoothing, minDb, maxDb, interval]);

  return level;
}
