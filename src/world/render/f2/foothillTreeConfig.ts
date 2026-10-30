import { resolveSceneOptions } from '../../scene/currentScene';

export function requestedFoothillTrees(search = typeof window === 'undefined' ? '' : window.location.search) {
  return resolveSceneOptions(search).hillsTrees === 'sparse';
}
