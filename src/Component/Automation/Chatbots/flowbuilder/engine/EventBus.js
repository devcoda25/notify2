export class EventBus {
  constructor() {
    this.map = new Map();
  }

  on(event, fn) {
    if (!this.map.has(event)) this.map.set(event, new Set());
    this.map.get(event).add(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    this.map.get(event)?.delete(fn);
  }

  emit(event, payload) {
    this.map.get(event)?.forEach((fn) => fn(payload));
  }

  clear() {
    this.map.clear();
  }
}
