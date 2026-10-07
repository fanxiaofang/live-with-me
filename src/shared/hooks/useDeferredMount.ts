import { useRef } from 'react';
/** Defer the first mount, then retain a closed dialog's draft and local UI state. */
export function useDeferredMount(open: boolean) {
  const opened = useRef(false);
  if (open) opened.current = true;
  return opened.current;
}
