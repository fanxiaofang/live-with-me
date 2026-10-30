import { resolveSceneOptions } from '../../scene/currentScene';

export function requestedFoothillTransition(search = typeof window === 'undefined' ? '' : window.location.search) {
  return resolveSceneOptions(search).hillsTransition === 'foothill';
}
