import type { KeyboardEvent } from 'react';
/** Keyboard activation follows the same click handlers and propagation rules. */
export function svgAction(label: string) {
  return { role: 'button', tabIndex: 0, 'aria-label': label, onKeyDown: (event: KeyboardEvent<SVGGElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault(); event.stopPropagation();
    event.currentTarget.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  } };
}
