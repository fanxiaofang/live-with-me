import { useEffect, useRef } from 'react';
import { TimerScope } from './TimerScope';
export function useTimerScope(enabled = true) {
  const scope = useRef<TimerScope | null>(null);
  if (!scope.current) scope.current = new TimerScope();
  const timers = scope.current;
  useEffect(() => { if (enabled) timers.activate(); else timers.dispose(); return () => timers.dispose(); }, [timers, enabled]);
  return timers;
}
