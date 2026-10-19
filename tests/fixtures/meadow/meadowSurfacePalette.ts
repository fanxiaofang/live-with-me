import type { YorkshireSceneTheme } from '../../../src/components/scenery/yorkshire/landscapeTypes';

// Shared verbatim by rounds 4–6; this revision changes planting and marks only.
export function meadowSurfacePalette(theme: YorkshireSceneTheme) {
  return theme.isNight
    ? { warm: '#849a63', cool: '#426451', deep: '#3f593f', trace: '#46613f', pale: '#92a471', strength: .65 }
    : theme.isRainy
      ? { warm: '#bcc77d', cool: '#548571', deep: '#4d704a', trace: '#4e703e', pale: '#b2c281', strength: .85 }
      : { warm: '#d0d68a', cool: '#628e76', deep: '#4f754d', trace: '#537336', pale: '#c1cd84', strength: 1 };
}
