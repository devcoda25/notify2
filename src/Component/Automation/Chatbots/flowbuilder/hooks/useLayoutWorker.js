import { useCallback, useEffect, useRef, useState } from 'react';
import { Position } from 'reactflow';

export function useLayoutWorker(
  nodes,
  edges,
  setNodes,
  opts = {}
) {
  const {
    gridSize = 20,
    respectLocked = true,
    directionAwareHandles = true,
    measureNodes,
  } = opts;

  const workerRef = useRef(null);
  const runIdRef = useRef(0);
  const pendingId = useRef(null);
  const [busy, setBusy] = useState(false);
  const [lastStats, setLastStats] = useState(null);

  // snapshot for "Undo last layout"
  const lastSnapshotRef = useRef(null);

  // Create worker
  useEffect(() => {
    const w = new Worker(new URL('../layoutWorker/layoutWorker.js', import.meta.url), { type: 'module' });
    workerRef.current = w;

    w.onmessage = (ev) => {
      const msg = ev.data;
      if (pendingId.current !== msg.runId) return;

      if (msg.type === 'layout:done') {
        const movedIds = new Set(Object.keys(msg.positions));
        const handleMode = (msg.stats.algo.startsWith('dagre:LR') ? 'LR' : 'TB');

        setNodes((nds) =>
          nds.map((n) => {
            let next = n;
            if (movedIds.has(n.id)) {
              next = { ...next, position: msg.positions[n.id] };
              // direction-aware handle orientation
              if (directionAwareHandles) {
                const src = handleMode === 'LR' ? Position.Right : Position.Bottom;
                const tgt = handleMode === 'LR' ? Position.Left : Position.Top;
                next = {
                  ...next,
                  sourcePosition: src,
                  targetPosition: tgt,
                  data: {
                    ...next.data,
                    preferredHandles: { source: src, target: tgt }, // for custom node renderers
                  },
                };
              }
            }
            return next;
          })
        );

        setBusy(false);
        setLastStats({ algo: msg.stats.algo, durationMs: msg.stats.durationMs });
        pendingId.current = null;
      } else if (msg.type === 'layout:error') {
        console.warn('[layout-worker]', msg.message);
        setBusy(false);
        pendingId.current = null;
      }
    };

    return () => {
      w.terminate();
      workerRef.current = null;
    };
  }, [setNodes, directionAwareHandles]);

  /** Build payload, optionally restricted to selection, using **measured** node sizes if available. */
  const buildPayload = useCallback(
    (mode, runOpts) => {
      const measure = measureNodes?.() ?? nodes;
      const selectionIds = new Set(
        runOpts.selectionIds && runOpts.selectionIds.length
          ? runOpts.selectionIds
          : measure.filter((n) => n.selected).map((n) => n.id)
      );

      const scope = runOpts.scope ?? 'graph';
      const nodeList = scope === 'selection' ? measure.filter((n) => selectionIds.has(n.id)) : measure;

      // Edges only between included nodes
      const idSet = new Set(nodeList.map((n) => n.id));
      const edgeList = edges.filter((e) => idSet.has(e.source) && idSet.has(e.target));

      // Snapshot previous positions for undo (only affected nodes)
      const snap = {};
      for (const n of nodeList) {
        snap[n.id] = {
          pos: n.position,
          source: n.sourcePosition,
          target: n.targetPosition,
          dataPreferred: n.data?.preferredHandles,
        };
      }
      lastSnapshotRef.current = snap;

      // Build node payload with real sizes
      const nodePayload = nodeList.map((n) => ({
        id: n.id,
        width: n.width ?? 180,
        height: n.height ?? 60,
        position: n.position,
        locked: n.locked === true,
      }));
      const edgePayload = edgeList.map((e) => ({ id: e.id, source: e.source, target: e.target }));

      const msg = {
        type: 'layout',
        runId: ++runIdRef.current,
        mode,
        gridSize,
        nodes: nodePayload,
        edges: edgePayload,
        respectLocked: runOpts.respectLocked ?? respectLocked,
      };

      return msg;
    },
    [nodes, edges, gridSize, respectLocked, measureNodes]
  );

  /** Trigger layout. Use scope='selection' for subgraph layout. */
  const runLayout = useCallback(
    (mode, runOpts = {}) => {
      if (!workerRef.current) return;
      const msg = buildPayload(mode, runOpts);
      pendingId.current = msg.runId;
      setBusy(true);
      workerRef.current.postMessage(msg);
    },
    [buildPayload]
  );

  /** Undo last layout (restores positions + handle orientation). */
  const undoLastLayout = useCallback(() => {
    const snap = lastSnapshotRef.current;
    if (!snap) return false;
    setNodes((nds) =>
      nds.map((n) => {
        const s = snap[n.id];
        if (!s) return n;
        return {
          ...n,
          position: s.pos,
          sourcePosition: s.source,
          targetPosition: s.target,
          data: {
            ...n.data,
            preferredHandles: s.dataPreferred,
          },
        };
      })
    );
    lastSnapshotRef.current = null;
    return true;
  }, [setNodes]);

  return { runLayout, undoLastLayout, busy, lastStats };
}
