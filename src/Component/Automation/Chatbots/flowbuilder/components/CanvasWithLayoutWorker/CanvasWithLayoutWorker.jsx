import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Controls,
  MiniMap,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ConnectionMode,
  BackgroundVariant,
  Background,
  ConnectionLineType,
} from 'reactflow';
import styles from './canvas-layout.module.css';
import 'reactflow/dist/style.css';
import { nanoid } from 'nanoid';
import BaseNode from './nodes/BaseNode';
import GroupBoxNode from './nodes/GroupBoxNode';
import SubflowNode from './nodes/SubflowNode';
import ButtonEdge from './edges/ButtonEdge';
import NodeSelector from './NodeSelector';
import LiveCursors from '../Presence/LiveCursors';
import { useFlowStore } from '../../store/flow';
import { getRandomColor } from '../../lib/color-utils';
import { usePresence } from '../../presence/PresenceProvider';

const GRID_SIZE = 20;

const nodeTypes = { base: BaseNode, group: GroupBoxNode, subflow: SubflowNode };
const edgeTypes = { buttonedge: ButtonEdge };

export default function CanvasWithLayoutWorker({
  nodes,
  edges,
  setNodes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onConnectStart,
  onConnectEnd,
  onNodeDoubleClick,
  onOpenProperties,
  onOpenAttachmentModal,
  onOpenImageEditor,
}) {
  const rfRef = useRef(null);
  const canvasRef = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const { awareness } = usePresence();
  const { addNode } = useFlowStore();

  const [connectingNodeId, setConnectingNodeId] = useState(null);
  const [nodeSelector, setNodeSelector] = useState(null);

  // Drag & drop
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      if (!pos) return;

      const data = e.dataTransfer.getData('application/x-flow-node');
      if (!data) return;

      const item = JSON.parse(data);
      const newNode = {
        id: nanoid(),
        type: 'base',
        position: { x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE, y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE },
        data: {
          label: item.label,
          icon: item.icon,
          color: item.color || getRandomColor(),
          description: item.description,
          type: item.type,
          content: item.content,
          quickReplies: item.quickReplies,
          onOpenProperties,
        },
      };
      addNode(newNode);
    },
    [screenToFlowPosition, addNode, onOpenProperties]
  );

  // Selection awareness
  const onSelectionChange = useCallback(
    ({ nodes: selNodes }) => {
      if (!awareness) return;
      const st = awareness.getLocalState() || {};
      const nodeId = selNodes?.[0]?.id;
      awareness.setLocalState({ ...st, selection: { nodeId, ts: Date.now() } });
    },
    [awareness]
  );

  // Node double-click
  const handleNodeDoubleClick = useCallback(
    (_e, node) => {
      if (node.data.onNodeDoubleClick) node.data.onNodeDoubleClick(node);
      else onNodeDoubleClick?.(node);
    },
    [onNodeDoubleClick]
  );

  // Connection handlers
  const handleConnectStart = useCallback(
    (_, params) => {
      setConnectingNodeId(params);
      onConnectStart?.(_, params);
    },
    [onConnectStart]
  );

  const handleConnectEnd = useCallback(
    (event) => {
      const targetIsPane = event.target.classList.contains('react-flow__pane');
      if (targetIsPane && connectingNodeId) {
        const { nodeId, handleId } = connectingNodeId;
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        setTimeout(() => {
          setNodeSelector({ x: clientX, y: clientY, sourceNode: nodeId, sourceHandle: handleId });
        }, 10);
      }
      setConnectingNodeId(null);
      onConnectEnd?.(event);
    },
    [connectingNodeId, onConnectEnd]
  );

  const handlePaneClick = useCallback(() => setNodeSelector(null), []);

  const handleSelectNode = (item) => {
    if (!nodeSelector) return;
    const { x: paneX, y: paneY, sourceNode, sourceHandle } = nodeSelector;
    const { x, y } = screenToFlowPosition({ x: paneX, y: paneY });

    const newNodeId = nanoid();
    const newNode = {
      id: newNodeId,
      type: 'base',
      position: { x: x - 150, y: y - 50 },
      data: {
        label: item.label,
        icon: item.icon,
        color: item.color || getRandomColor(),
        description: item.description,
        type: item.type,
        content: item.content,
        quickReplies: item.quickReplies,
      },
    };
    addNode(newNode);

    onConnect?.({
      source: sourceNode,
      sourceHandle,
      target: newNodeId,
      targetHandle: null,
    });

    setNodeSelector(null);
  };

  const nodesWithProps = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onOpenProperties,
          onNodeDoubleClick,
          onOpenAttachmentModal,
          onOpenImageEditor,
        },
      })),
    [nodes, onOpenProperties, onNodeDoubleClick, onOpenAttachmentModal, onOpenImageEditor]
  );

  return (
    <div ref={canvasRef} className={styles.root}>
  <div className={styles.canvas} onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodesWithProps}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={handleConnectStart}
          onConnectEnd={handleConnectEnd}
          onInit={(inst) => (rfRef.current = inst)}
          onSelectionChange={onSelectionChange}
          onNodeDoubleClick={handleNodeDoubleClick}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineType={ConnectionLineType.Bezier}
          connectionMode={ConnectionMode.Loose}
          snapToGrid
          snapGrid={[GRID_SIZE, GRID_SIZE]}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={2} />
          <Controls className={`${styles.controls} flow-builder-controls`} />
          <MiniMap pannable zoomable />
          <div className="position-absolute w-100 h-100" style={{ zIndex: 5, pointerEvents: 'none' }}>
            <LiveCursors />
          </div>
        </ReactFlow>

        {nodeSelector && (
          <div
            className="position-fixed"
            style={{ left: nodeSelector.x + 10, top: nodeSelector.y, zIndex: 2000 }}
          >
            <NodeSelector onSelect={handleSelectNode} onClose={() => setNodeSelector(null)} />
          </div>
        )}
      </div>
    </div>
  );
}
