const flows = [];
let flowIdCounter = 1;

export async function getFlows() {
  await new Promise((res) => setTimeout(res, 300));
  console.info('[api] getFlows');
  return flows;
}

export async function getFlow(flowId) {
    await new Promise((res) => setTimeout(res, 300));
    const flow = flows.find(f => f.id === flowId);
    console.info('[api] getFlow', { flowId, flow });
    return flow;
}

export async function saveFlow(flowData) {
    await new Promise((res) => setTimeout(res, 300));
    const existingIndex = flows.findIndex(f => f.id === flowData.id);
    if (existingIndex > -1) {
        flows[existingIndex] = { ...flows[existingIndex], ...flowData, lastModified: Date.now() };
        console.info('[api] saveFlow (update)', { flowData });
        return flows[existingIndex];
    } else {
        const newFlow = { ...flowData, id: String(flowIdCounter++), lastModified: Date.now() };
        flows.push(newFlow);
        console.info('[api] saveFlow (create)', { flowData });
        return newFlow;
    }
}

export async function createFlow(flowData) {
    await new Promise((res) => setTimeout(res, 300));
    const newFlow = { ...flowData, id: String(flowIdCounter++), lastModified: Date.now() };
    flows.push(newFlow);
    console.info('[api] createFlow', { newFlow });
    return newFlow;
}

export async function deleteFlow(flowId) {
    await new Promise((res) => setTimeout(res, 300));
    const index = flows.findIndex(f => f.id === flowId);
    if (index > -1) {
        flows.splice(index, 1);
        console.info('[api] deleteFlow', { flowId });
        return { ok: true };
    }
    return { ok: false, message: 'Flow not found' };
}

export async function publishFlow(flowId, publish) {
  await new Promise((res) => setTimeout(res, 300));
  console.info('[api] publish', { flowId, publish });
  return { ok: true, published: publish };
}