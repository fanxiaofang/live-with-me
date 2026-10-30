import { smoothEdgePath } from './fieldEdges';
import baseline from '../render/f2/config/baseline.json';
import { F2_STUDIES, requestedF2Study } from '../render/f2/f2Config';
import { ridgeAt } from '../render/f2/vendor/backdrop/ridgeGeometry.js';
import { LANDSCAPE_SURFACES } from './landscapeGeometry';
import { meadowHillSurfaceY } from './meadowFoothill';
import { requestedMeadowFoothill } from './currentScene';

/** The actual nearest source ridge, in the same local coordinates as the trees. */
export function nearestMountainRidgeY(x: number) {
  const p=F2_STUDIES[requestedF2Study()].placement, index=2;
  const unit=p.unitsPerDesignUnit*p.scale*p.layerScale[index];
  const sourceX=(x-p.centerX-p.offsetX)/unit;
  return p.horizonY+p.offsetY+p.layerOffsetY[index]
    -ridgeAt(baseline.layers[index].points,sourceX)*unit-LANDSCAPE_SURFACES.backgroundOffsetY;
}

export function foothillRidgeY(x: number) { return nearestMountainRidgeY(x)+20; }
export function foothillGroundY(x: number) { return foothillRidgeY(x)+25; }
export function foothillSurfaceY(x: number, depth: number, search = typeof window==='undefined' ? '' : window.location.search) {
  if (requestedMeadowFoothill(search)) {
    const surface = meadowHillSurfaceY(x, depth);
    if (surface !== undefined) return surface;
  }
  return foothillRidgeY(x)+25*Math.max(0,Math.min(1,depth));
}
export function foothillSurfacePath() {
  const points=Array.from({length:401},(_,i)=>{const x=-4000+i*25;return{x,y:nearestMountainRidgeY(x)};});
  return smoothEdgePath(points)+' L 6000,2800 L -4000,2800 Z';
}

export const FOOTHILL_WOODLAND = [
  { id: 'west', x: 245, kinds: ['pine','broadleaf','birch','pine','broadleaf','pine','birch','broadleaf','pine'] },
  { id: 'middle', x: 500, kinds: ['birch','broadleaf','pine','broadleaf','birch','pine','broadleaf'] },
  { id: 'east', x: 1320, kinds: ['pine','birch','broadleaf','pine','broadleaf','birch','pine','broadleaf','pine'] },
].flatMap(group => group.kinds.map((species, i) => ({
  id: group.id + '-' + i, group: group.id, species: species as 'pine' | 'birch' | 'broadleaf',
  x: group.x + (i - (group.kinds.length - 1) / 2) * 20 + [-5,3,-2,5,0,-4,4,1,-3][i],
  depth: [.3,.39,.34,.48,.35][i % 5], scale: [.44,.52,.4,.48,.46][i % 5],
})));

export const FOOTHILL_FARMSTEADS = [{ x: 380, depth: .3, height: 18 }, { x: 1320, depth: .35, height: 15 }];
