type TimerHandle = ReturnType<typeof setTimeout>;
export interface TimerClock { setTimeout: (callback: () => void, delay: number) => TimerHandle; clearTimeout: (handle: TimerHandle) => void }
const defaultClock: TimerClock = { setTimeout: (callback, delay) => setTimeout(callback, delay), clearTimeout: handle => clearTimeout(handle) };
/** A named feedback deadline replaces its predecessor and cannot run after disposal. */
export class TimerScope {
  private timers = new Map<string, TimerHandle>();
  private active = true;
  constructor(private clock: TimerClock = defaultClock) {}
  get isActive() { return this.active; }
  activate() { this.active = true; }
  schedule = (key: string, callback: () => void, delay: number) => {
    if (!this.active) return;
    this.cancel(key);
    const handle = this.clock.setTimeout(() => { this.timers.delete(key); if (this.active) callback(); }, delay);
    this.timers.set(key, handle);
  };
  cancel(key: string) { const handle = this.timers.get(key); if (handle !== undefined) { this.clock.clearTimeout(handle); this.timers.delete(key); } }
  clear() { for (const key of this.timers.keys()) this.cancel(key); }
  dispose() { this.clear(); this.active = false; }
}
