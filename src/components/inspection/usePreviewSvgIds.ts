import { useId, useLayoutEffect, type ReactNode, type RefObject } from 'react';

const references = ['fill', 'stroke', 'filter', 'clip-path', 'mask', 'href', 'xlink:href', 'style', 'aria-labelledby', 'aria-describedby'];

/**
 * Authored scene assets contain stable SVG IDs. Only the preview boundary owns
 * their local IDs/references, leaving the shared geometry and the world intact.
 */
export function usePreviewSvgIds(content: RefObject<SVGGElement | null>, children: ReactNode) {
  const prefix = `preview-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}-`;
  useLayoutEffect(() => {
    const root = content.current;
    if (!root) return;
    const scope = () => {
      const ids = new Map<string, string>();
      const occurrences = new Map<string, number>();
      for (const node of root.querySelectorAll('[id]')) {
        const original = node.id.startsWith(prefix) ? node.getAttribute('data-asset-id') ?? node.id.slice(prefix.length) : node.id;
        const occurrence = (occurrences.get(original) ?? 0) + 1;
        occurrences.set(original, occurrence);
        const scoped = `${prefix}${original}${occurrence > 1 ? `-${occurrence}` : ''}`;
        if (!ids.has(original)) ids.set(original, scoped);
        if (node.getAttribute('data-asset-id') !== original) node.setAttribute('data-asset-id', original);
        if (node.id !== scoped) node.id = scoped;
      }
      for (const node of root.querySelectorAll('*')) {
        for (const name of references) {
          const value = node.getAttribute(name);
          if (!value) continue;
          let next = value.replace(/url\(\s*['"]?#([^)'"\s]+)['"]?\s*\)/g,
            (match, id: string) => ids.has(id) ? `url(#${ids.get(id)})` : match);
          if ((name === 'href' || name === 'xlink:href') && value.startsWith('#') && ids.has(value.slice(1))) {
            next = `#${ids.get(value.slice(1))}`;
          }
          if (name.startsWith('aria-')) next = value.split(' ').map(id => ids.get(id) ?? id).join(' ');
          if (next !== value) node.setAttribute(name, next);
        }
      }
    };
    scope();
    // Internal asset updates can introduce new nodes without re-rendering the
    // viewer. Exclude transform/opacity animations from this observer.
    const observer = new MutationObserver(scope);
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['id', ...references] });
    return () => observer.disconnect();
  }, [content, children, prefix]);
}
