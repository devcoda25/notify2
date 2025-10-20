import { EventBus } from './EventBus.js';
import { RealClock, MockClock } from './clock.js';
import { evalExpression, parseDelay, renderTemplate } from './evaluator.js';
import { compile } from './FlowCompiler.js';
import { sendTestRequest } from '../api/mockServer.js';
import { useFlowStore } from '../store/flow.js';
import { nanoid } from 'nanoid';

const isMediaPart = (part) => {
    return ['image', 'video', 'audio', 'document'].includes(part.type);
};

function trunc(s, n = 80) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

export class FlowEngine {
  constructor(opts) {
    this.bus = new EventBus();
    this.opts = { channel: 'whatsapp', clock: 'real', initialVars: {} };
    this.clock = new RealClock();
    this.compiled = null;
    this.status = 'idle';
    this.queue = [];
    this.timers = new Set();
    this.waiting = null;
    this.vars = {};

    if (opts) this.configure(opts);
  }

  configure(opts) {
    this.opts = { ...this.opts, ...opts };
    this.clock = this.opts.clock === 'mock' ? new MockClock() : new RealClock();
    this.vars = { ...(this.opts.initialVars || {}) };
  }

  setFlow(nodes, edges) {
    this.compiled = compile(nodes, edges);
  }

  reset() {
    this.queue = [];
    this.waiting = null;
    this.vars = { ...(this.opts.initialVars || {}) };
    this.timers.forEach((t) => this.clock.clear(t));
    this.timers.clear();
    this.setStatus('idle');
  }

  start(flowId) {
    if (!this.compiled) throw new Error('FlowEngine: setFlow() first');
    this.reset();
    
    const startNodeIdFromStore = useFlowStore.getState().startNodeId;

    const start = startNodeIdFromStore || this.compiled.starts[0];

    if (!start) {
        this.bus.emit('error', { nodeId: 'N/A', message: 'No start node found for the flow.' });
        this.setStatus('stopped');
        return;
    }
    
    this.queue.push(start);
    this.setStatus('running');
    this.drain();
  }

  startFrom(nodeId) { this.start(nodeId); }

  stop() {
    this.setStatus('stopped');
    this.timers.forEach((t) => this.clock.clear(t));
    this.timers.clear();
    this.queue = [];
    this.waiting = null;
    this.bus.emit('done', { reason: 'stopped' });
  }

  pushUserInput(text) {
    this.vars.last_user_message = text;
    if (this.waiting) {
      const { nodeId, varName, kind } = this.waiting;
      this.vars[varName] = text;
      this.waiting = null;
      this.setStatus('running');
      
      let nextNodeId = null;
      if (kind === 'buttons' || kind === 'list') {
          const outs = this.compiled?.next.get(nodeId) || [];
          const sourceNode = this.compiled?.nodes.get(nodeId);
          const replies = sourceNode?.data?.quickReplies || sourceNode?.data?.list?.sections?.flatMap((s) => s.items) || [];
          const matchingReply = replies.find((r) => r.label === text || r.title === text);
          if(matchingReply) {
              const matchingEdge = outs.find(o => o.branch === matchingReply.id);
              if (matchingEdge) {
                  nextNodeId = matchingEdge.to;
              }
          }
      } else { // 'ask'
         nextNodeId = this.next(nodeId);
      }

      if (nextNodeId) { 
        this.queue.push(nextNodeId);
      } else {
        const defaultEdge = (this.compiled?.next.get(nodeId) || []).find(e => !e.branch);
        if (defaultEdge) this.queue.push(defaultEdge.to);
      }

      this.drain();
    }
  }

  on(ev, fn) { return this.bus.on(ev, fn); }
  off(ev, fn) { return this.bus.off(ev, fn); }

  getVariables() { return { ...this.vars }; }

  advanceMock(ms) { this.clock.flush?.(ms); }

  setStatus(s) {
    this.status = s;
    this.bus.emit('status', s);
  }

  next(fromId) {
    const n = this.compiled.next.get(fromId) || [];
    if (n.length === 0) return null;
    return n[0].to;
  }

  chooseBranch(fromId, truthy) {
    const outs = this.compiled.next.get(fromId) || [];
    const want = truthy ? ['true','yes','1'] : ['false','no','0','else','default'];
    const e = outs.find(o => (o.branch && want.includes(String(o.branch).toLowerCase())) ||
                             (o.label && want.includes(String(o.label).toLowerCase())))
           || (truthy ? outs.find(o => o.branch === 'true') : outs.find(o => o.branch === 'false'));
    return e ? e.to : null;
  }

  drain() {
    while (this.queue.length && this.status === 'running') {
      const nodeId = this.queue.shift();
      const node = this.compiled.nodes.get(nodeId);
      if (!node) continue;
      try {
        const proceed = this.execute(node);
        if (proceed === 'async' || proceed === 'wait') break;
      } catch (e) {
        this.bus.emit('error', { nodeId, message: e?.message || String(e) });
      }
    }
    if (this.status === 'running' && this.queue.length === 0 && !this.waiting && this.timers.size === 0) {
      this.setStatus('completed');
      this.bus.emit('done', { reason: 'completed' });
    }
  }

  execute(n) {
    const data = n.data || {};
    this.bus.emit('trace', { ts: Date.now(), type: 'enterNode', nodeId: n.id, nodeLabel: data.label });

    switch (n.kind) {
      case 'message': {
        const parts = data.parts || (data.content ? [{type: 'text', content: data.content, id: 'text-part'}] : []);
        const textPart = parts.find(p => p.type === 'text');
        const text = renderTemplate(textPart?.content || data.label || '', this.vars);
        const attachments = parts.filter(isMediaPart).map(p => ({
            id: p.id,
            type: p.type,
            name: p.name || 'file',
            url: p.url,
        }));

        this.emitBot(text, data.quickReplies, attachments);
        this.trace(n.id, `message("${trunc(text)}")`);
        const nx = this.next(n.id);
        if (nx) this.queue.push(nx);
        return 'sync';
      }
      case 'ask':
      case 'buttons':
      case 'list': {
        const varName = data.variableName || 'answer';
        const prompt = data.content ? renderTemplate(String(data.content), this.vars) : 'Please reply';
        const buttons = n.kind === 'buttons' ? data.quickReplies :
                        n.kind === 'list' ? (data.list?.sections || []).flatMap((s) => s.items.map((i) => ({id: i.id, label: i.title}))) : [];
        
        this.emitBot(prompt, buttons.length > 0 ? buttons : undefined);
        this.waiting = { nodeId: n.id, varName, kind: n.kind };
        this.setStatus('waiting');
        this.bus.emit('waitingForInput', { nodeId: n.id, varName });
        this.trace(n.id, `${n.kind}("${varName}")`);
        return 'wait';
      }
      case 'condition': {
        const expr = String(data.groups?.[0]?.conditions?.[0]?.variable || ''); // Simplified for now
        const val = String(data.groups?.[0]?.conditions?.[0]?.value || '');
        const op = String(data.groups?.[0]?.conditions?.[0]?.operator || 'equals');
        const contextVar = this.vars[expr];

        let res = false;
        if(op === 'equals') res = contextVar == val;
        else if (op === 'contains') res = String(contextVar).includes(val);
        else res = evalExpression(expr, { ...this.vars });
        
        const tgt = this.chooseBranch(n.id, !!res);
        this.trace(n.id, `condition(${res ? 'true' : 'false'})`);
        if (tgt) this.queue.push(tgt);
        return 'sync';
      }
      case 'delay': {
        const ms = data.mode === 'delay'
          ? (data.delayMinutes || 0) * 60000
          : new Date(data.runAt).getTime() - Date.now();

        if (ms <= 0) {
            this.trace(n.id, 'delay 0ms');
            const nx = this.next(n.id);
            if (nx) this.queue.push(nx);
            return 'sync';
        }

        const id = this.clock.set(() => {
          this.trace(n.id, `delay ${ms}ms`);
          const nx = this.next(n.id);
          if (nx) this.queue.push(nx);
          this.timers.delete(id);
          if (this.status === 'running') this.drain();
        }, ms);
        this.timers.add(id);
        return 'async';
      }
      case 'api': {
        const req = this.buildApiRequest(n);
        sendTestRequest(req).then((res) => {
          this.vars.last_api_response = res;
          if (data.assignTo) this.vars[data.assignTo] = res;
          this.trace(n.id, `api ${req.method} ${req.url} → ${res.statusCode}`);
          const nx = this.next(n.id);
          if (nx) this.queue.push(nx);
          if (this.status === 'running') this.drain();
        }).catch((err) => {
          this.trace(n.id, `api error: ${err?.message || err}`);
        });
        return 'async';
      }
      default: {
        this.trace(n.id, 'noop');
        const nx = this.next(n.id);
        if (nx) this.queue.push(nx);
        return 'sync';
      }
    }
  }

  buildApiRequest(n) {
    const { url = '', method = 'GET', headers = [], body = '' } = n.data;
    return {
      url: renderTemplate(url, this.vars),
      method: method.toUpperCase(),
      headers: headers.map(({key, value}) => ({
        key: renderTemplate(key, this.vars),
        value: renderTemplate(value, this.vars),
      })),
      body: renderTemplate(body, this.vars)
    };
  }

  trace(nodeId, result, data) {
    this.bus.emit('trace', { ts: Date.now(), type: 'log', nodeId, result, data });
  }

  emitBot(text, quickReplies, attachments) {
    const msg = {
      id: nanoid(),
      channel: this.opts.channel,
      text,
      actions: quickReplies ? { buttons: quickReplies } : undefined,
      attachments,
    };
    this.bus.emit('botMessage', msg);
  }
}