export class RealClock {
  set(fn, ms) { return setTimeout(fn, ms); }
  clear(id) { clearTimeout(id); }
}

export class MockClock {
  constructor() {
    this.now = 0;
    this.q = [];
    this.seq = 1;
  }

  set(fn, ms) {
    const id = this.seq++;
    this.q.push({ id, at: this.now + ms, fn });
    this.q.sort((a, b) => a.at - b.at);
    return id;
  }
  clear(id) { this.q = this.q.filter(t => t.id !== id); }
  flush(ms) {
    const end = ms == null ? Number.POSITIVE_INFINITY : this.now + ms;
    while (this.q.length && this.q[0].at <= end) {
      const t = this.q.shift();
      this.now = t.at;
      t.fn();
    }
    this.now = Math.min(this.now, end);
  }
}
