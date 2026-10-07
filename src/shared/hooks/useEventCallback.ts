import { useCallback, useLayoutEffect, useRef } from 'react';
/** Stable callback identity with the latest committed state and props. */
export function useEventCallback<Args extends unknown[], Result>(callback: (...args: Args) => Result) {
  const latest = useRef(callback);
  useLayoutEffect(() => { latest.current = callback; });
  return useCallback((...args: Args) => latest.current(...args), []);
}
