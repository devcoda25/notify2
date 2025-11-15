import { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { ReactFlowProvider, useReactFlow } from 'reactflow';
import { nanoid } from 'nanoid';
import { Box, Skeleton } from '@mui/material';

import HeaderBar from './HeaderBar';
import SidebarPalette from './SidebarPalette';
import CanvasWithLayoutWorker from './CanvasWithLayoutWorker/CanvasWithLayoutWorker';
import { useFlowStore, useFlowMetaStore, undo, redo } from '../store/flow';
import { useFlowsStore } from '../store/flows';
import TestConsole from './TestConsole';
import { useUIStore } from '../store/ui';
import { FlowEngine } from '../engine/FlowEngine';
import { useHistoryStore } from '../store/history';
import { getRandomColor } from '../lib/color-utils';
import { useToast } from '../hooks/use-toast';

// Lazy-loaded components
const PropertiesPanel = lazy(() => import('./PropertiesPanel'));

const WebhookModal = lazy(() => import('./PropertiesPanel/partials/WebhookModal'));
const ConditionModal = lazy(() => import('./PropertiesPanel/partials/ConditionModal'));
const AssignUserModal = lazy(() => import('./PropertiesPanel/partials/AssignUserModal'));
const AssignTeamModal = lazy(() => import('./PropertiesPanel/partials/AssignTeamModal'));
const FlowsModal = lazy(() => import('./FlowsModal/FlowsModal'));
const ListModal = lazy(() => import('./PropertiesPanel/partials/ListModal'));
const ButtonsModal = lazy(() => import('./PropertiesPanel/partials/ButtonsModal'));
const QuestionModal = lazy(() => import('./PropertiesPanel/partials/QuestionModal'));
const ImageEditorModal = lazy(() => import('./PropertiesPanel/partials/ImageEditorModal'));
const DelayModal = lazy(() => import('./PropertiesPanel/partials/DelayModal'));


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
        if (nodeLabel === 'Question') setModalState({ type: 'question', nodeId: node.id });
        else if (nodeLabel === 'Buttons') setModalState({ type: 'buttons', nodeId: node.id });
        else if (nodeLabel === 'List') setModalState({ type: 'list', nodeId: node.id });
        else if (nodeLabel === 'Webhook') setModalState({ type: 'webhook', nodeId: node.id, data: node.data });
        else if (nodeLabel === 'Set a Condition') setModalState({ type: 'condition', nodeId: node.id, data: { groups: node.data.groups } });
      
        else if (nodeLabel === 'Assign to User') setModalState({ type: 'assignUser', nodeId: node.id, data: node.data });
        else if (nodeLabel === 'Assign to Team') setModalState({ type: 'assignTeam', nodeId: node.id, data: node.data });
        else if (nodeLabel === 'Add a Delay') setModalState({ type: 'delay', nodeId: node.id, data: node.data });
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
            newParts[existingPartIndex] = { ...newParts[existingPartIndex], ...newMediaArray[0] };
            if (newMediaArray.length > 1) {
                const additionalParts = newMediaArray.slice(1).map(media => ({ ...media }));
                newParts.splice(existingPartIndex + 1, 0, ...additionalParts);
            }
        } else {
            const partsToAdd = newMediaArray.map((media, index) => ({ id: index === 0 ? modalState.partId : media.id, ...media }));
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
        addNode({
            id: nanoid(),
            type: 'base',
            position: { x: x - 200, y: y - 100 },
            data: { ...item, color: item.color || getRandomColor() },
        });
    };

    const handleSaveFlow = useCallback(() => {
        saveFlow({ ...meta, nodes, edges });
        toast({ title: 'Flow Saved', description: `"${meta.title}" has been saved successfully.` });
    }, [meta, nodes, edges, saveFlow, toast]);

    const handleNewFlow = () => {
        createNewFlow();
        toast({ title: 'New Flow Created', description: 'A new empty flow has been created.' });
    };

    const handleDeleteFlow = () => {
        if (window.confirm(`Are you sure you want to delete the flow "${meta.title}"?`)) {
            deleteFlow(meta.id);
            toast({ title: 'Flow Deleted', description: `"${meta.title}" has been deleted.`, variant: 'destructive' });
        }
    };

    
    const loadingFallback = <Box sx={{ width: 420, height: '100%', bgcolor: 'grey.200', borderLeft: 1, borderColor: 'divider', p: 4 }}><Skeleton variant="rectangular" sx={{ height: '100%', width: '100%' }} /></Box>;

    return (
        <Box sx={{ height: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr', overflow: 'hidden' }}>
            <Box sx={{ gridRow: 1, gridColumn: '1 / -1', zIndex: 10 }}>
                <HeaderBar title={meta.title} onSave={setTitle} channels={meta.channels} onChannelsChange={setChannels} waContext={meta.waMessageContext} onWaContextChange={setWaContext} onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} onTest={toggleTestConsole} onSaveClick={handleSaveFlow} onNewFlow={handleNewFlow} onOpenFlows={() => setModalState({ type: 'flows' })} onDeleteFlow={handleDeleteFlow} />
            </Box>

            <Box sx={{ gridRow: 2, gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '280px 1fr', overflow: 'hidden' }}>
                <Box sx={{ p: 2, overflowY: 'auto', borderRight: 1, borderColor: 'divider' }}>
                    <SidebarPalette onItemClick={handleClickAdd} filterChannels={meta.channels} />
                </Box>

                <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'grey.50' }}>
                    <CanvasWithLayoutWorker nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onConnectStart={onConnectStart} onConnectEnd={onConnectEnd} setNodes={setNodes} onNodeDoubleClick={handleNodeDoubleClick} onOpenProperties={openPropertiesForNode} onOpenAttachmentModal={openAttachmentModal} onOpenImageEditor={openImageEditorModal} viewportKey="flow-editor-viewport" />
                </Box>
            </Box>

            <TestConsole isOpen={isTestConsoleOpen} onClose={toggleTestConsole} engine={engine} flowId={meta.id} />

            <Suspense fallback={loadingFallback}>
                {selectedNodeId && <PropertiesPanel node={selectedNode} onClose={() => setSelectedNodeId(null)} onSave={handleSaveNode} waContext={meta.waMessageContext} channels={meta.channels} />}
                {modalState?.type === 'question' && <QuestionModal isOpen={true} onClose={() => setModalState(null)} nodeId={modalState.nodeId} />}
                {modalState?.type === 'buttons' && <ButtonsModal isOpen={true} onClose={() => setModalState(null)} nodeId={modalState.nodeId} />}
                {modalState?.type === 'list' && <ListModal isOpen={true} onClose={() => setModalState(null)} nodeId={modalState.nodeId} />}
                {modalState?.type === 'flows' && <FlowsModal isOpen={true} onClose={() => setModalState(null)} />}
               
               
               
               
                {modalState?.type === 'webhook' && <WebhookModal isOpen={true} onClose={() => setModalState(null)} onSave={onSaveModal} initialData={modalState?.data} />}
                {modalState?.type === 'condition' && <ConditionModal isOpen={true} onClose={() => setModalState(null)} onSave={onSaveModal} initialData={modalState?.data} />}
                {modalState?.type === 'delay' && <DelayModal isOpen={true} onClose={() => setModalState(null)} onSave={onSaveModal} initialData={modalState?.data} />}
               
                {modalState?.type === 'assignUser' && <AssignUserModal isOpen={true} onClose={() => setModalState(null)} onSave={onSaveModal} initialData={modalState?.data} />}
                {modalState?.type === 'assignTeam' && <AssignTeamModal isOpen={true} onClose={() => setModalState(null)} onSave={onSaveModal} initialData={modalState?.data} />}
            </Suspense>
        </Box>
    );
}

export default function StudioClientPage() {
    return (
        <ReactFlowProvider>
            <StudioPageContent />
        </ReactFlowProvider>
    );
}
