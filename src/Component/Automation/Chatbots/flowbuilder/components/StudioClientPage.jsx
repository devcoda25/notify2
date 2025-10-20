
import { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { ReactFlowProvider, useReactFlow } from 'reactflow';
import { nanoid } from 'nanoid';

import HeaderBar from './HeaderBar';
import SidebarPalette from './SidebarPalette';
import CanvasWithLayoutWorker from './CanvasWithLayoutWorker/CanvasWithLayoutWorker';
import { useFlowStore, useFlowMetaStore, undo, redo } from '../store/flow';
import { useFlowsStore } from '../store/flows';
import TestConsole from './TestConsole';
import { useUIStore } from '../store/ui';
import PublishBanner from './Presence/PublishBanner';
import { FlowEngine } from '../engine/FlowEngine';
import { useHistoryStore } from '../store/history';
import { getRandomColor } from '../lib/color-utils';
import { useToast } from '../hooks/use-toast';
import { Skeleton } from './ui/skeleton';

const PropertiesPanel = lazy(() => import('./PropertiesPanel'));
const ImageAttachmentModal = lazy(() => import('./PropertiesPanel/partials/ImageAttachmentModal'));
const VideoAttachmentModal = lazy(() => import('./PropertiesPanel/partials/VideoAttachmentModal'));
const DocumentAttachmentModal = lazy(() => import('./PropertiesPanel/partials/DocumentAttachmentModal'));
const AudioAttachmentModal = lazy(() => import('./PropertiesPanel/partials/AudioAttachmentModal'));
const WebhookModal = lazy(() => import('./PropertiesPanel/partials/WebhookModal'));
const ConditionModal = lazy(() => import('./PropertiesPanel/partials/ConditionModal'));
const GoogleSheetsModal = lazy(() => import('./PropertiesPanel/partials/GoogleSheetsModal'));
const AssignUserModal = lazy(() => import('./PropertiesPanel/partials/AssignUserModal'));
const AssignTeamModal = lazy(() => import('./PropertiesPanel/partials/AssignTeamModal'));
const FlowsModal = lazy(() => import('./FlowsModal/FlowsModal'));
const ListModal = lazy(() => import('./PropertiesPanel/partials/ListModal'));
const ButtonsModal = lazy(() => import('./PropertiesPanel/partials/ButtonsModal'));
const QuestionModal = lazy(() => import('./PropertiesPanel/partials/QuestionModal'));
const ImageEditorModal = lazy(() => import('./PropertiesPanel/partials/ImageEditorModal'));
const DelayModal = lazy(() => import('./PropertiesPanel/partials/DelayModal'));


const isMediaPart = (part) => {
  return !!part && ['image', 'video', 'audio', 'document'].includes(part.type);
};

function StudioPageContent() {
  const { nodes, edges, addNode, setNodes, onNodesChange, onEdgesChange, onConnect, updateNodeData, onConnectStart, onConnectEnd, setEdges } = useFlowStore();
  const { meta, setTitle, setChannels, setWaContext, setMeta } = useFlowMetaStore();

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [modalState, setModalState] = useState(null);
  const { saveFlow, createNewFlow, deleteFlow, activeFlow } = useFlowsStore();
  const { toast } = useToast();

  const { isTestConsoleOpen, toggleTestConsole } = useUIStore();
  const { canUndo, canRedo } = useHistoryStore();

  const engine = useMemo(() => new FlowEngine({ channel: meta.channels[0], clock: 'real' }), [meta.channels]);
  const { screenToFlowPosition } = useReactFlow();

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);

  useEffect(() => {
    if (activeFlow) {
      const { nodes, edges, ...meta } = activeFlow;
      setNodes(nodes);
      setEdges(edges);
      setMeta(meta);
    }
  }, [activeFlow?.id, setNodes, setEdges, setMeta, activeFlow]);

  engine.setFlow(nodes, edges);

  const handleNodeDoubleClick = useCallback((node) => {
    const nodeLabel = node.data?.label;

    if (nodeLabel === 'Send a Message') return;

    if (nodeLabel === 'Question') {
      setModalState({ type: 'question', nodeId: node.id });
      return;
    }

    if (nodeLabel === 'Buttons') {
      setModalState({ type: 'buttons', nodeId: node.id });
      return;
    }

    if (nodeLabel === 'List') {
      setModalState({ type: 'list', nodeId: node.id });
      return;
    }

    if (nodeLabel === 'Webhook') {
      setModalState({ type: 'webhook', nodeId: node.id, data: node.data });
    } else if (nodeLabel === 'Set a Condition') {
      setModalState({ type: 'condition', nodeId: node.id, data: { groups: node.data.groups } });
    } else if (nodeLabel === 'Google Sheets') {
      setModalState({ type: 'googleSheets', nodeId: node.id, data: node.data });
    } else if (nodeLabel === 'Assign to User') {
      setModalState({ type: 'assignUser', nodeId: node.id, data: node.data });
    } else if (nodeLabel === 'Assign to Team') {
      setModalState({ type: 'assignTeam', nodeId: node.id, data: node.data });
    } else if (nodeLabel === 'Add a Delay') {
      setModalState({ type: 'delay', nodeId: node.id, data: node.data });
    }
  }, []);

  const openAttachmentModal = useCallback((nodeId, partId, type) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const part = (node.data.parts || []).find((p) => p.id === partId);
    setModalState({ type, nodeId, partId, data: part });
  }, [nodes]);

  const openImageEditorModal = (nodeId, partId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const part = (node.data.parts || []).find((p) => p.id === partId);
    if (part && part.type === 'image') {
        setModalState({ type: 'imageEditor', nodeId, partId, data: part });
    }
  };

  const openPropertiesForNode = useCallback((node) => {
    setSelectedNodeId(node?.id || null);
  }, []);

  const handleSaveNode = (nodeId, data) => {
    updateNodeData(nodeId, data);
  };

  const onSaveModal = (data) => {
    if (!modalState || !modalState.nodeId) return;
    updateNodeData(modalState.nodeId, data);
    setModalState(null);
  };

  const onSaveMedia = (newMedia) => {
    if (!modalState || !modalState.nodeId || !modalState.partId) return;

    const node = nodes.find(n => n.id === modalState.nodeId);
    if (!node) return;

    const newMediaArray = Array.isArray(newMedia) ? newMedia : [newMedia];

    const existingPartIndex = (node.data.parts || []).findIndex((p) => p.id === modalState.partId);

    let newParts;

    if (existingPartIndex > -1) {
      newParts = [...(node.data.parts || [])];
      newParts[existingPartIndex] = {
        id: newParts[existingPartIndex].id,
        type: newMediaArray[0].type,
        url: newMediaArray[0].url,
        name: newMediaArray[0].name,
      };

      if (newMediaArray.length > 1) {
        const additionalParts = newMediaArray.slice(1).map(media => ({
          id: media.id,
          type: media.type,
          url: media.url,
          name: media.name,
        }));
        newParts.splice(existingPartIndex + 1, 0, ...additionalParts);
      }
    } else {
      const partsToAdd = newMediaArray.map((media, index) => {
        const id = index === 0 ? modalState.partId : media.id;
        return { id, type: media.type, url: media.url, name: media.name };
      });
      newParts = [...(node.data.parts || []), ...partsToAdd];
    }

    updateNodeData(modalState.nodeId, { parts: newParts });
    setModalState(null);
  };

  const onDeleteMedia = () => {
    if (!modalState || !modalState.partId || !modalState.nodeId) return;
    const node = nodes.find(n => n.id === modalState.nodeId);
    if (node) {
      const newParts = (node.data.parts || []).filter((p) => p.id !== modalState.partId);
      updateNodeData(modalState.nodeId, { parts: newParts });
    }
    setModalState(null);
  };

  const handleDragStart = (_e, item) => {};

  const handleClickAdd = (item) => {
    const { x, y } = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const newNode = {
      id: nanoid(),
      type: 'base',
      position: { x: x - 200, y: y - 100 },
      data: {
        label: item.label,
        icon: item.icon,
        type: item.type,
        color: item.color || getRandomColor(),
        description: item.description,
        content: item.content,
        quickReplies: item.quickReplies,
        list: item.list,
      },
    };
    addNode(newNode);
  };

  const handleSaveFlow = useCallback(() => {
    saveFlow({ ...meta, nodes, edges });
    toast({
      title: 'Flow Saved',
      description: `"${meta.title}" has been saved successfully.`,
    });
  }, [meta, nodes, edges, saveFlow, toast]);

  const handleNewFlow = () => {
    createNewFlow();
    toast({
      title: 'New Flow Created',
      description: 'A new empty flow has been created.',
    });
  };

  const handleDeleteFlow = () => {
    if (window.confirm(`Are you sure you want to delete the flow "${meta.title}"? This cannot be undone.`)) {
      deleteFlow(meta.id);
      toast({
        title: 'Flow Deleted',
        description: `"${meta.title}" has been deleted.`,
        variant: 'destructive',
      });
    }
  };

  const activePart = useMemo(() => {
    if (!modalState?.nodeId || !modalState?.partId) return undefined;
    const node = nodes.find(n => n.id === modalState.nodeId);
    const part = node?.data.parts?.find((p) => p.id === modalState.partId);
    if (isMediaPart(part)) {
      return part;
    }
    return undefined;
  }, [modalState, nodes]);

  const loadingFallback = <div className="w-[420px] h-full bg-muted border-l p-4"><Skeleton className="h-full w-full" /></div>;

  return (
    <div className="h-screen w-screen   grid grid-rows-[56px_1fr] md:grid-cols-[280px_1fr] bg-background text-foreground relative overflow-hidden">
      
      <div className="col-span-full row-start-1 z-10">
        <HeaderBar
          title={meta.title}
          onSave={setTitle}
          channels={meta.channels}
          onChannelsChange={setChannels}
          waContext={meta.waMessageContext}
          onWaContextChange={setWaContext}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onTest={toggleTestConsole}
          onSaveClick={handleSaveFlow}
          onNewFlow={handleNewFlow}
          onOpenFlows={() => setModalState({ type: 'flows' })}
          onDeleteFlow={handleDeleteFlow}
        />
      </div>
       
        <div className="p-4 ">
          <SidebarPalette onDragStart={handleDragStart} onItemClick={handleClickAdd} filterChannels={meta.channels} />
        </div>
      
      <main className="md:col-start-2 row-start-2 col-start-1 relative overflow-hidden bg-zinc-50">
        <CanvasWithLayoutWorker
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          setNodes={setNodes}
          onNodeDoubleClick={handleNodeDoubleClick}
          onOpenProperties={openPropertiesForNode}
          onOpenAttachmentModal={openAttachmentModal}
          onOpenImageEditor={openImageEditorModal}
          viewportKey="flow-editor-viewport"
        />
      </main>
      <Suspense fallback={loadingFallback}>
        {selectedNodeId && (
          <PropertiesPanel
            node={selectedNode}
            onClose={() => setSelectedNodeId(null)}
            onSave={handleSaveNode}
            waContext={meta.waMessageContext}
            channels={meta.channels}
          />
        )}

        {modalState?.type === 'question' && modalState.nodeId && (
          <QuestionModal isOpen={true} onClose={() => setModalState(null)} nodeId={modalState.nodeId} />
        )}
        {modalState?.type === 'buttons' && modalState.nodeId && (
          <ButtonsModal isOpen={true} onClose={() => setModalState(null)} nodeId={modalState.nodeId} />
        )}
        {modalState?.type === 'list' && modalState.nodeId && (
          <ListModal isOpen={true} onClose={() => setModalState(null)} nodeId={modalState.nodeId} />
        )}
        {modalState?.type === 'flows' && (
          <FlowsModal isOpen={true} onClose={() => setModalState(null)} />
        )}
        {modalState?.type === 'image' && modalState.nodeId && modalState.partId && (
          <ImageAttachmentModal
            isOpen={true}
            onClose={() => setModalState(null)}
            onSave={onSaveMedia}
            onDelete={onDeleteMedia}
            media={activePart}
            type={modalState.type}
          />
        )}
        {modalState?.type === 'imageEditor' && modalState.nodeId && modalState.partId && (
          <ImageEditorModal
              isOpen={true}
              onClose={() => setModalState(null)}
              onSave={(data) => onSaveMedia(data)}
              media={activePart}
          />
        )}
        {modalState?.type === 'video' && modalState.nodeId && modalState.partId && (
          <VideoAttachmentModal
            isOpen={true}
            onClose={() => setModalState(null)}
            onSave={onSaveMedia}
            onDelete={onDeleteMedia}
            media={activePart}
            type={modalState.type}
          />
        )}
        {modalState?.type === 'audio' && modalState.nodeId && modalState.partId && (
          <AudioAttachmentModal
            isOpen={true}
            onClose={() => setModalState(null)}
            onSave={onSaveMedia}
            onDelete={onDeleteMedia}
            media={activePart}
            type={modalState.type}
          />
        )}
        {modalState?.type === 'document' && modalState.nodeId && modalState.partId && (
          <DocumentAttachmentModal
            isOpen={true}
            onClose={() => setModalState(null)}
            onSave={onSaveMedia}
            onDelete={onDeleteMedia}
            media={activePart}
            type={modalState.type}
          />
        )}
        {modalState?.type === 'webhook' && (
          <WebhookModal
            isOpen={true}
            onClose={() => setModalState(null)}
            onSave={onSaveModal}
            initialData={modalState?.data}
          />
        )}
        {modalState?.type === 'condition' && (
          <ConditionModal
            isOpen={true}
            onClose={() => setModalState(null)}
            onSave={onSaveModal}
            initialData={modalState?.data}
          />
        )}
        {modalState?.type === 'delay' && (
          <DelayModal
            isOpen={true}
            onClose={() => setModalState(null)}
            onSave={onSaveModal}
            initialData={modalState?.data}
          />
        )}
        {modalState?.type === 'googleSheets' && (
          <GoogleSheetsModal
            isOpen={true}
            onClose={() => setModalState(null)}
            onSave={onSaveModal}
            initialData={modalState?.data}
          />
        )}
        {modalState?.type === 'assignUser' && (
          <AssignUserModal
            isOpen={true}
            onClose={() => setModalState(null)}
            onSave={onSaveModal}
            initialData={modalState?.data}
          />
        )}
        {modalState?.type === 'assignTeam' && (
          <AssignTeamModal
            isOpen={true}
            onClose={() => setModalState(null)}
            onSave={onSaveModal}
            initialData={modalState?.data}
          />
        )}
      </Suspense>

      <TestConsole isOpen={isTestConsoleOpen} onClose={toggleTestConsole} engine={engine} flowId={meta.id} />
    </div>
  );
}

export default function StudioClientPage() {
  return (
    <ReactFlowProvider>
      <StudioPageContent />
    </ReactFlowProvider>
  );
}
