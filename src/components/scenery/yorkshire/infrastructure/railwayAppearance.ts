import type { YorkshireSceneTheme } from '../landscapeTypes';

/** One emission vocabulary for both membranes and all suspended stones. */
export const RAILWAY_SPATIAL_LIGHT = {
  core: '#e0f2fe', edge: '#93c5fd', white: '#f0f9ff', coreOpacity: .8,
  strength: { day: .6, dusk: .8, night: 1 }, transitionMs: 1400,
} as const;

export function railwayAppearance(theme: YorkshireSceneTheme) {
  const period = theme.isNight ? 'night' : theme.timeOfDay === 'dusk' ? 'dusk' : 'day';
  const air = theme.railwayAtmosphere;
  const strength = air?.strength ?? 0;
  // SVG filter uses linearRGB, matching the source ridge shader's colour mixing.
  const color = air?.air || '#000000';
  const channels = [1, 3, 5].map(i => {
    const srgb = parseInt(color.slice(i, i + 2), 16) / 255;
    return srgb <= .04045 ? srgb / 12.92 : ((srgb + .055) / 1.055) ** 2.4;
  });
  return { light: RAILWAY_SPATIAL_LIGHT, emission: RAILWAY_SPATIAL_LIGHT.strength[period],
    air: { strength, slope: 1 - strength, intercepts: channels.map(c => c * strength) } };
}
