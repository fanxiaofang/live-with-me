import type { YorkshireSceneTheme } from '../../components/scenery/yorkshire/landscapeTypes';
import { fieldAccessPalette, gardenSoilPalette } from '../../components/scenery/yorkshire/terrain/groundReferencePalette';
import { WEAR_DAY_PALETTE } from './wearMaterial';

const shift=(hex:string,amount:number)=>'#'+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(hex.slice(i,i+2),16)+amount)).toString(16).padStart(2,'0')).join('');
const surface=(soil:string)=>({...WEAR_DAY_PALETTE,soil,light:shift(soil,10),shade:shift(soil,-12)});

/** Review candidates taken from existing visible ground materials. These colours
 * are already themed: do not send them through F2 or the old night transform. */
export function wearReferencePalette(theme: YorkshireSceneTheme, reference: 'path' | 'garden') {
  if (!theme.isNight && theme.timeOfDay !== 'dusk') return WEAR_DAY_PALETTE;
  // Garden's dusk earth is deliberately rich for cultivated soil; a worn path
  // needs the lighter fixed-path relationship instead. Keep garden at night.
  if (reference === 'garden' && theme.isNight) {
    const p = gardenSoilPalette(theme);
    return surface(p.earth);
  }
  const path = fieldAccessPalette(theme);
  const grass = theme.landscapeEnvironment?.grassMid ?? theme.hillGreenMid;
  // The reference is mostly exposed grass with a low-coverage soil wash. Match
  // that subdued appearance with the unchanged continuous-path opacity.
  const mix = (hex: string) => '#' + [1, 3, 5].map(i => {
    const a = parseInt(grass.slice(i, i + 2), 16), b = parseInt(hex.slice(i, i + 2), 16);
    return Math.round(a + (b - a) * .48).toString(16).padStart(2, '0');
  }).join('');
  return surface(mix(path.roadColor));
}
