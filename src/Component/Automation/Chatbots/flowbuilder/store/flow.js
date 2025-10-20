import create from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge, MarkerType } from 'reactflow';
import { nanoid } from 'nanoid';
import { useHistoryStore } from './history';

// snapshot of tracked parts
const snapshot = (s) => ({
  nodes: s.nodes,
  edges: s.edges,
  startNodeId: s.startNodeId,
});

// sync undo/redo flags stored elsewhere
const syncHistoryFlags = (past, future) => {
  const { setCanUndo, setCanRedo } = useHistoryStore.getState();
  setCanUndo(past.length > 0);
  setCanRedo(future.length > 0);
};

const flowSlice = (set, get) => ({
  nodes: [],
  edges: [],
  startNodeId: null,
  connectingNodeId: null,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    if (connection.source === connection.target) {
      console.warn('Cannot connect a node to itself.');
      return;
    }

    const { edges, nodes } = get();

    // prevent loops
    const loop = edges.find(
      (e) => e.source === connection.target && e.target === connection.source
    );
    if (loop) {
      console.warn('Cannot create a connection that forms a loop.');
      return;
    }

    const sourceNode = nodes.find((n) => n.id === connection.source);
    if (
      sourceNode?.data.type !== 'logic' &&
      sourceNode?.data.label !== 'Buttons' &&
      sourceNode?.data.label !== 'List'
    ) {
      const sourceHandleHasConnection = edges.some(
        (e) => e.source === connection.source && e.sourceHandle === connection.sourceHandle
      );
      if (sourceHandleHasConnection) {
        console.warn(
          `Connection from source ${connection.source} (handle: ${connection.sourceHandle}) already exists.`
        );
        return;
      }
    }

    set({
      edges: addEdge(
        {
          ...connection,
          type: 'buttonedge',
          markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
        },
        get().edges
      ),
    });
  },

  onConnectStart: (_, params) => set({ connectingNodeId: params }),
  onConnectEnd: () => set({ connectingNodeId: null }),

  addNode: (node) => set({ nodes: get().nodes.concat(node) }),

  deleteNode: (nodeId) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== nodeId),
      edges: s.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    })),

  deleteEdge: (edgeId) =>
    set((s) => ({
      edges: s.edges.filter((e) => e.id !== edgeId),
    })),

  duplicateNode: (nodeId) => {
    const { nodes } = get();
    const nodeToDuplicate = nodes.find((n) => n.id === nodeId);
    if (!nodeToDuplicate) return;

    const newId = nanoid();
    const isButtonItem =
      nodeToDuplicate.data.label === 'Buttons' || nodeToDuplicate.data.label === 'List';

    let newQuickReplies = nodeToDuplicate.data.quickReplies;
    if (isButtonItem && Array.isArray(nodeToDuplicate.data.quickReplies)) {
      newQuickReplies = nodeToDuplicate.data.quickReplies.map((qr) => ({
        ...qr,
        id: nanoid(),
      }));
    }

    const newNode = {
      ...nodeToDuplicate,
      id: newId,
      position: {
        x: nodeToDuplicate.position.x + 30,
        y: nodeToDuplicate.position.y + 30,
      },
      data: { ...nodeToDuplicate.data, quickReplies: newQuickReplies },
      selected: false,
    };

    set({ nodes: [...nodes, newNode] });
  },

  updateNodeData: (nodeId, data) =>
    set({
      nodes: get().nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n)),
    }),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setStartNode: (nodeId) => set({ startNodeId: nodeId }),
});

// build store with history-aware set
export const useFlowStore = create((set, get) => {
  const initial = { _past: [], _future: [] };

  const setWithHistory = (partial, replace) => {
    // compute next
    const apply = typeof partial === 'function' ? partial(get()) : partial;
    const prevSnap = snapshot(get());

    set((s) => {
      const nextState = typeof partial === 'function' ? partial(s) : partial;
      const past = [...s._past, prevSnap];
      const future = []; // clear future

      const merged = replace ? nextState : { ...s, ...nextState };
      const result = { ...merged, _past: past, _future: future };

      syncHistoryFlags(past, future);
      return result;
    }, replace);
  };

  const slice = flowSlice(setWithHistory, get);

  const undo = () => {
    const s = get();
    if (!s._past.length) return;
    const prev = s._past[s._past.length - 1];
    const current = snapshot(s);
    set({ ...prev, _past: s._past.slice(0, -1), _future: [...s._future, current] });
    syncHistoryFlags(get()._past, get()._future);
  };

  const redo = () => {
    const s = get();
    if (!s._future.length) return;
    const next = s._future[s._future.length - 1];
    const current = snapshot(s);
    set({ ...next, _past: [...s._past, current], _future: s._future.slice(0, -1) });
    syncHistoryFlags(get()._past, get()._future);
  };

  const canUndo = () => get()._past.length > 0;
  const canRedo = () => get()._future.length > 0;

  return { ...initial, ...slice, undo, redo, canUndo, canRedo };
});

// meta store unchanged
export const useFlowMetaStore = create((set) => ({
  meta: {
    id: 'draft-1',
    title: 'Untitled Flow',
    channels: ['whatsapp'],
    waMessageContext: 'template',
    lastModified: Date.now(),
  },
  setTitle: (title) =>
    set((s) => ({
      meta: { ...s.meta, title: title.trim() || 'Untitled Flow', lastModified: Date.now() },
    })),
  setChannels: (channels) =>
    set((s) => ({ meta: { ...s.meta, channels, lastModified: Date.now() } })),
  setWaContext: (waMessageContext) =>
    set((s) => ({ meta: { ...s.meta, waMessageContext, lastModified: Date.now() } })),
  setMeta: (meta) => set({ meta }),
}));

// helpers
export const undo = () => useFlowStore.getState().undo();
export const redo = () => useFlowStore.getState().redo();
export const canUndo = () => useFlowStore.getState().canUndo();
export const canRedo = () => useFlowStore.getState().canRedo();
