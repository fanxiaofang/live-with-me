import type { YorkshireSceneTheme } from '../landscapeTypes';
import { YardObject } from '../../../../features/yard-editor/YardWorld';

/** Reuse the complete preserved SVG asset, including its cloth, props and contact shadows. */
export function CountryPicnic({ theme }: { theme: YorkshireSceneTheme }) {
  return <YardObject id="picnic">
    <g id="country-picnic" transform="translate(335 -50)"
      filter={theme.landscapeEnvironment ? 'url(#field-environment-tone)' : undefined}
      opacity={!theme.landscapeEnvironment && theme.isNight ? .65 : 1}>
      <title>红白格野餐垫与野餐用品</title>
      <use href="#asset-country-picnic-scene" />
    </g>
  </YardObject>;
}
