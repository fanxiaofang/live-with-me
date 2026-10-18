import { useEffect, type RefObject } from 'react';

// One shared gust, then a genuine quiet interval. No per-frame JS or React updates.
// The gust window accommodates the existing staggered delays plus one sway.
const GUST_WINDOW_MS = 12_000;
const QUIET_WINDOW_MS = 18_000;

export function useIntermittentBreeze(svgRef: RefObject<SVGSVGElement | null>) {
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setTimeout> | undefined;

    const gust = () => {
      svg.dataset.breeze = 'gust';
      timer = setTimeout(() => {
        svg.dataset.breeze = 'quiet';
        timer = setTimeout(gust, QUIET_WINDOW_MS);
      }, GUST_WINDOW_MS);
    };
    const sync = () => {
      clearTimeout(timer);
      svg.dataset.breeze = 'quiet';
      if (!document.hidden && !reducedMotion.matches) {
        // Resume from rest, rather than jumping into a partially finished sway.
        timer = setTimeout(gust, 1000);
      }
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', sync);
      reducedMotion.removeEventListener('change', sync);
      delete svg.dataset.breeze;
    };
  }, [svgRef]);
}
