import { create } from 'zustand';
import {
  getFlows as apiGetFlows,
  saveFlow as apiSaveFlow,
  createFlow as apiCreateFlow,
  deleteFlow as apiDeleteFlow,
} from '../api/flows';

const getDefaultFlow = () => ({
  title: 'Untitled Flow',
  channels: ['whatsapp'],
  waMessageContext: 'template',
  lastModified: Date.now(),
  nodes: [],
  edges: [],
});

export const useFlowsStore = create((set, get) => ({
  flows: [],
  activeFlowId: null,
  activeFlow: null,

  loadFlows: async () => {
    const flows = await apiGetFlows();
    if (flows.length > 0) {
      const sorted = flows.sort((a, b) => b.lastModified - a.lastModified);
      set({ flows: sorted });
      get().setActiveFlow(sorted[0].id);
    } else {
      const newFlow = await apiCreateFlow(getDefaultFlow());
      set({ flows: [newFlow], activeFlow: newFlow, activeFlowId: newFlow.id });
    }
  },

  saveFlow: async (flowData) => {
    const updatedFlow = await apiSaveFlow(flowData);
    const flows = get().flows;
    const existingIndex = flows.findIndex((f) => f.id === updatedFlow.id);

    const newFlows =
      existingIndex > -1
        ? flows.map((f, i) => (i === existingIndex ? updatedFlow : f))
        : [...flows, updatedFlow];

    set({ flows: newFlows, activeFlow: updatedFlow, activeFlowId: updatedFlow.id });
  },

  setActiveFlow: (flowId) => {
    const flow = get().flows.find((f) => f.id === flowId);
    if (flow) set({ activeFlow: flow, activeFlowId: flow.id });
  },

  createNewFlow: async () => {
    const newFlow = await apiCreateFlow(getDefaultFlow());
    const newFlows = [...get().flows, newFlow];
    set({ flows: newFlows });
    get().setActiveFlow(newFlow.id);
  },

  deleteFlow: async (flowId) => {
    await apiDeleteFlow(flowId);
    let newFlows = get().flows.filter((f) => f.id !== flowId);

    if (get().activeFlowId === flowId) {
      if (newFlows.length > 0) {
        const nextActiveFlow = newFlows.sort((a, b) => b.lastModified - a.lastModified)[0];
        get().setActiveFlow(nextActiveFlow.id);
      } else {
        const newFlow = await apiCreateFlow(getDefaultFlow());
        newFlows = [newFlow];
        get().setActiveFlow(newFlow.id);
      }
    }

    set({ flows: newFlows });
  },
}));

// Initialize on client
if (typeof window !== 'undefined') {
  useFlowsStore.getState().loadFlows();
}
