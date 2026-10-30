import type { YorkshireSceneTheme } from '../landscapeTypes';

// Accepted meadow colour roles, with restrained night and rainy variants.
export function meadowSurfacePalette(theme: YorkshireSceneTheme) {
  return theme.isNight
    ? { warm: '#849a63', cool: '#426451', deep: '#3f593f', trace: '#46613f', pale: '#92a471', strength: .65 }
    : theme.isRainy
      ? { warm: '#bcc77d', cool: '#548571', deep: '#4d704a', trace: '#4e703e', pale: '#b2c281', strength: .85 }
      : { warm: '#d0d68a', cool: '#628e76', deep: '#4f754d', trace: '#537336', pale: '#c1cd84', strength: 1 };
}

export function meadowPlantPaletteCss(theme: YorkshireSceneTheme, selector: string) {
  const source = ['#526f3f', '#648449', '#829954', '#9eaf65', '#9aab70', '#dedcc6', '#c2a34f', '#c7ad51', '#9b8b3e', '#95677c', '#b08b9c', '#c4a6ad'];
  const target = theme.isNight
    ? ['#354d36', '#496140', '#65794c', '#7a8a58', '#70815c', '#9dada0', '#8e8950', '#9b9255', '#717341', '#6d596b', '#887382', '#9b8c95']
    : theme.isRainy
      ? ['#486342', '#597a49', '#758e57', '#8b9f66', '#86986d', '#c3cabb', '#aa9b56', '#b4a359', '#898445', '#896d7d', '#a18a99', '#b4a2a9']
      : theme.timeOfDay === 'dusk'
        ? ['#526c40', '#71894f', '#99a366', '#b5b67c', '#9ca574', ...source.slice(5)]
        : ['#54773b', '#73974a', '#a3b764', '#c0ce7d', '#a6b979', ...source.slice(5)];
  return source.map((color, i) => `${selector} [fill="${color}"]{fill:${target[i]}}`).join('\n');
}

/** Seed heads stay green-gold in daylight; preserve the accepted moonlit colours. */
export function meadowSeedPalette(theme: YorkshireSceneTheme) {
  return theme.isNight ? { plume: '#879987', stem: '#536344' }
    : theme.isRainy ? { plume: '#adb7a2', stem: '#6c8051' }
      : theme.timeOfDay === 'dusk' ? { plume: '#b6b78a', stem: '#849354' }
        : { plume: '#b4bd7b', stem: '#779249' };
}

/** Only the smallest, faint companion tufts need help surviving downsampling. */
export function meadowGrassOpacity(theme: YorkshireSceneTheme, opacity: number, scale: number) {
  if (theme.isNight || theme.isRainy || scale > .19) return opacity;
  return Math.max(opacity, theme.timeOfDay === 'dusk' ? .52 : .58);
}
