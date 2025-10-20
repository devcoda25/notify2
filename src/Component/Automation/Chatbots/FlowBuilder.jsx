import { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { ReactFlowProvider, useReactFlow } from 'reactflow';
import { nanoid } from 'nanoid';
import { useFlowStore, useFlowMetaStore, undo, redo } from './flowbuilder/store/flow';
import { useFlowsStore } from './flowbuilder/store/flows';
import { useUIStore } from './flowbuilder/store/ui';
import { FlowEngine } from './flowbuilder/engine/FlowEngine';
import { useHistoryStore } from './flowbuilder/store/history';
import { getRandomColor } from './flowbuilder/lib/color-utils';
import { PresenceProvider } from './flowbuilder/presence/PresenceProvider';

// MUI Theme imports
import { alpha, useTheme } from '@mui/material/styles';
import { ReactComponent as LoadingSpinner } from './flowbuilder/sp.svg';

import './FlowBuilder.css';

// Lazy-loaded components
const HeaderBar = lazy(() => import('./flowbuilder/components/HeaderBar/HeaderBar'));
const SidebarPalette = lazy(() => import('./flowbuilder/components/SidebarPalette/SidebarPalette'));
const CanvasWithLayoutWorker = lazy(() => import('./flowbuilder/components/CanvasWithLayoutWorker/CanvasWithLayoutWorker'));
const PropertiesPanel = lazy(() => import('./flowbuilder/components/PropertiesPanel/PropertiesPanel'));
const TestConsole = lazy(() => import('./flowbuilder/components/TestConsole/TestConsole'));
const PublishBanner = lazy(() => import('./flowbuilder/components/Presence/PublishBanner'));

const ImageAttachmentModal = lazy(() => import('./flowbuilder/components/PropertiesPanel/partials/ImageAttachmentModal'));
const VideoAttachmentModal = lazy(() => import('./flowbuilder/components/PropertiesPanel/partials/VideoAttachmentModal'));
const DocumentAttachmentModal = lazy(() => import('./flowbuilder/components/PropertiesPanel/partials/DocumentAttachmentModal'));
const AudioAttachmentModal = lazy(() => import('./flowbuilder/components/PropertiesPanel/partials/AudioAttachmentModal'));
const WebhookModal = lazy(() => import('./flowbuilder/components/PropertiesPanel/partials/WebhookModal'));
const ConditionModal = lazy(() => import('./flowbuilder/components/PropertiesPanel/partials/ConditionModal'));
const AssignUserModal = lazy(() => import('./flowbuilder/components/PropertiesPanel/partials/AssignUserModal'));
const AssignTeamModal = lazy(() => import('./flowbuilder/components/PropertiesPanel/partials/AssignTeamModal'));
const FlowsModal = lazy(() => import('./flowbuilder/components/FlowsModal/FlowsModal'));
const ListModal = lazy(() => import('./flowbuilder/components/PropertiesPanel/partials/ListModal'));
const ButtonsModal = lazy(() => import('./flowbuilder/components/PropertiesPanel/partials/ButtonsModal'));
const QuestionModal = lazy(() => import('./flowbuilder/components/PropertiesPanel/partials/QuestionModal'));
const ImageEditorModal = lazy(() => import('./flowbuilder/components/PropertiesPanel/partials/ImageEditorModal'));
const DelayModal = lazy(() => import('./flowbuilder/components/PropertiesPanel/partials/DelayModal'));

// Helpers
const isMediaPart = (part) => {
  return !!part && ['image', 'video', 'audio', 'document'].includes(part.type);
};

function StudioPageContent() {
  const { nodes, edges, addNode, setNodes, onNodesChange, onEdgesChange, onConnect, updateNodeData, onConnectStart, onConnectEnd, setEdges } = useFlowStore();
  const { meta, setTitle, setChannels, setWaContext, setMeta } = useFlowMetaStore();

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [modalState, setModalState] = useState(null);
  const { saveFlow, createNewFlow, deleteFlow, activeFlow } = useFlowsStore();

  const { isTestConsoleOpen, toggleTestConsole } = useUIStore();
  const { canUndo, canRedo } = useHistoryStore();

  const engine = useMemo(() => new FlowEngine({ channel: meta.channels[0], clock: 'real' }), [meta.channels]);
  const { screenToFlowPosition } = useReactFlow();

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);

  // ✅ Access theme
  const theme = useTheme();

  useEffect(() => {
    if (activeFlow) {
      const { nodes, edges, ...meta } = activeFlow;
      setNodes(nodes);
      setEdges(edges);
      setMeta(meta);
    }
  }, [activeFlow?.id, setNodes, setEdges, setMeta, activeFlow]);

  engine.setFlow(nodes, edges);

  // Example usage of MUI theme
  const containerStyle = {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    minHeight: '100vh',
  };

  const toast = (options) => {
    window.alert(options.title + '\n' + options.description);
  };

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
  }, [meta, nodes, edges, saveFlow]);

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

  

  return (
    <div className="flow-builder-container" style={containerStyle}>
      <Suspense fallback={<div className="loading-container"><LoadingSpinner /></div>}>
        <PublishBanner />
        <PublishBanner />
        <div className="flow-builder-header">
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
        <div className="flow-builder-body">
          <div className="flow-builder-sidebar">
            <SidebarPalette onItemClick={handleClickAdd} filterChannels={meta.channels} />
          </div>
          <div className="flow-builder-main">
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
          </div>
        </div>

        {selectedNodeId && (
          <PropertiesPanel
            node={selectedNode}
            onClose={() => setSelectedNodeId(null)}
            onSave={handleSaveNode}
            waContext={meta.waMessageContext}
            channels={meta.channels}
          />
        )}

        {/* Modals */}
        {modalState?.type === 'question' && <QuestionModal isOpen onClose={() => setModalState(null)} nodeId={modalState.nodeId} />}
        {modalState?.type === 'buttons' && <ButtonsModal isOpen onClose={() => setModalState(null)} nodeId={modalState.nodeId} />}
        {modalState?.type === 'list' && <ListModal isOpen onClose={() => setModalState(null)} nodeId={modalState.nodeId} />}
        {modalState?.type === 'flows' && <FlowsModal isOpen onClose={() => setModalState(null)} />}
        {modalState?.type === 'image' && <ImageAttachmentModal isOpen onClose={() => setModalState(null)} onSave={onSaveMedia} onDelete={onDeleteMedia} media={activePart} />}
        {modalState?.type === 'imageEditor' && <ImageEditorModal isOpen onClose={() => setModalState(null)} onSave={onSaveMedia} media={activePart} />}
        {modalState?.type === 'video' && <VideoAttachmentModal isOpen onClose={() => setModalState(null)} onSave={onSaveMedia} onDelete={onDeleteMedia} media={activePart} />}
        {modalState?.type === 'audio' && <AudioAttachmentModal isOpen onClose={() => setModalState(null)} onSave={onSaveMedia} onDelete={onDeleteMedia} media={activePart} />}
        {modalState?.type === 'document' && <DocumentAttachmentModal isOpen onClose={() => setModalState(null)} onSave={onSaveMedia} onDelete={onDeleteMedia} media={activePart} />}
        {modalState?.type === 'webhook' && <WebhookModal isOpen onClose={() => setModalState(null)} onSave={onSaveModal} initialData={modalState?.data} />}
        {modalState?.type === 'condition' && <ConditionModal isOpen onClose={() => setModalState(null)} onSave={onSaveModal} initialData={modalState?.data} />}
        {modalState?.type === 'delay' && <DelayModal isOpen onClose={() => setModalState(null)} onSave={onSaveModal} initialData={modalState?.data} />}
        
        {modalState?.type === 'assignUser' && <AssignUserModal isOpen onClose={() => setModalState(null)} onSave={onSaveModal} initialData={modalState?.data} />}
        {modalState?.type === 'assignTeam' && <AssignTeamModal isOpen onClose={() => setModalState(null)} onSave={onSaveModal} initialData={modalState?.data} />}

        <TestConsole isOpen={isTestConsoleOpen} onClose={toggleTestConsole} engine={engine} flowId={meta.id} />
      </Suspense>
    </div>
  );
}


export default function FlowBuilder() {
  return (
      <ReactFlowProvider>
        <PresenceProvider>
          <StudioPageContent />
        </PresenceProvider>
      </ReactFlowProvider>
  );
}
