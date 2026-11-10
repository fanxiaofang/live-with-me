import type { YorkshireSceneTheme } from '../landscapeTypes';

export function fieldAccessPalette(theme: YorkshireSceneTheme) {
  return {
    soil: theme.isNight ? '#68694e' : theme.isRainy ? '#9b9269' : theme.timeOfDay === 'dusk' ? '#b2a176' : '#bcb180',
    roadColor: theme.isNight ? '#68715a' : theme.isRainy ? '#8b8964' : theme.timeOfDay === 'dusk' ? '#a39771' : theme.roadColor,
    hillGreenFar: theme.isNight ? '#5f6e50' : theme.hillGreenFar,
  };
}

export function gardenSoilPalette(theme: YorkshireSceneTheme) {
  if (theme.isNight) return { earth: '#515446', patch: '#595a49', ridge: '#6c6b53', trough: '#3c443a', clod: '#474c3f', crumb: '#74745b' };
  if (theme.timeOfDay === 'dusk') return { earth: '#805d3b', patch: '#956f44', ridge: '#a7804e', trough: '#5b412b', clod: '#704f32', crumb: '#b5915b' };
  return { earth: '#936b43', patch: '#a77d4c', ridge: '#b58b55', trough: '#69492f', clod: '#805a37', crumb: '#c39b63' };
}
