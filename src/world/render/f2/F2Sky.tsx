import type { YorkshireSceneTheme } from '../../../components/scenery/yorkshire/landscapeTypes';

/** SVG compatibility sky for loading/context failure. The active renderer owns
 * the source shader gradient and dithering; both consume the same palette. */
export function F2Sky({ theme }: { theme: YorkshireSceneTheme }) {
  return <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
    <defs>
      <linearGradient id="f2-existing-sky" gradientUnits="userSpaceOnUse" x1="0" y1="-320" x2="0" y2="420">
        <stop offset="0%" stopColor={theme.skyTop} />
        <stop offset="50%" stopColor={theme.skyMid || theme.skyTop} />
        <stop offset="100%" stopColor={theme.skyBottom} />
      </linearGradient>
    </defs>
    <rect x="-4000" y="-3000" width="10000" height="7000" fill="url(#f2-existing-sky)" />
  </svg>;
}
