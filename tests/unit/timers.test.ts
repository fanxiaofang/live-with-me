import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TimerScope, type TimerClock } from '../../src/shared/timers/TimerScope';
function fakeClock() {
  let now = 0, nextId = 0;
  const pending = new Map<number, { due: number; callback: () => void }>();
  const clock: TimerClock = { setTimeout(callback, delay) { const id = ++nextId; pending.set(id, { due: now + delay, callback }); return id as unknown as ReturnType<typeof setTimeout>; }, clearTimeout(handle) { pending.delete(handle as unknown as number); } };
  return { clock, pending, advance(delay: number) { now += delay; for (const [id, entry] of [...pending]) if (entry.due <= now) { pending.delete(id); entry.callback(); } } };
}
test('repeated feedback replaces its deadline without shortening another channel', () => {
  const fake = fakeClock(), scope = new TimerScope(fake.clock), calls: string[] = [];
  scope.schedule('toast', () => calls.push('old'), 3200);
  scope.schedule('pulse', () => calls.push('pulse'), 1400);
  fake.advance(1000); scope.schedule('toast', () => calls.push('new'), 3200);
  fake.advance(2200); assert.deepEqual(calls, ['pulse']);
  fake.advance(1000); assert.deepEqual(calls, ['pulse', 'new']);
  assert.equal(fake.pending.size, 0);
});
test('unmount disposes all deadlines; remount starts a fresh lifecycle', () => {
  const fake = fakeClock(), scope = new TimerScope(fake.clock); let calls = 0;
  scope.schedule('a', () => calls++, 100); scope.schedule('b', () => calls++, 200);
  scope.dispose(); assert.equal(fake.pending.size, 0);
  scope.schedule('late async callback', () => calls++, 100); fake.advance(1000); assert.equal(calls, 0);
  scope.activate(); scope.schedule('a', () => calls++, 100); fake.advance(100); assert.equal(calls, 1);
});
