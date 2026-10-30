import type { LandscapeTreeSpecies } from '../../components/scenery/yorkshire/vegetation/LandscapeTreeShape';

export const MEADOW_GROUND_ROLES=['meadow','dryGrass','understory'] as const;
export type MeadowGroundRole=typeof MEADOW_GROUND_ROLES[number];
export interface MeadowTreePalette { leaf:string; light:string; shade:string; trunk:string }
/** Colour slots are separate from spatial coverage: a season can replace colours
 * per vegetation type without changing the hill, masks or tree positions. */
export interface MeadowVegetationPalette {
  ground:Record<MeadowGroundRole,string>;
  trees:Record<LandscapeTreeSpecies,MeadowTreePalette>;
}
export const SUMMER_MEADOW_VEGETATION:MeadowVegetationPalette={
  ground:{meadow:'#899b70',dryGrass:'#a0aa78',understory:'#748e6b'},
  trees:{
    pine:{leaf:'#5a7557',light:'#718960',shade:'#425d49',trunk:'#53654b'},
    birch:{leaf:'#68805b',light:'#83966a',shade:'#506c4e',trunk:'#bfc3a4'},
    broadleaf:{leaf:'#6d8158',light:'#89966a',shade:'#536c4c',trunk:'#666c4c'},
  },
};
const smooth=(a:number,b:number,v:number)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};

/** Broad, deterministic coverage in hill-local coordinates. No animated noise,
 * raster textures, distance-field engine or extra render pass. */
export function meadowVegetationWeights(x:number,depth:number):readonly number[] {
  const d=Math.max(0,Math.min(1,depth));
  const u=x+22*Math.sin(x/87+d*4)+11*Math.sin(x/43-d*3);
  const v=d+.045*Math.sin(x/71+d*5);
  const width=.20+.075*(1+Math.sin(x/103+d*3));
  const area=(cx:number,cy:number,rx:number,ry:number)=>{
    const distance=Math.hypot((u-cx)/rx,(v-cy)/ry);
    return 1-smooth(.25,1+width,distance);
  };
  const dry=.37*Math.max(area(405,.30,185,.31),area(545,.68,140,.30)*.62);
  const understory=.34*Math.max(area(241,.76,88,.32),area(393,.73,107,.34),area(676,.69,126,.35));
  return [1-dry-understory,dry,understory];
}

// Narrow columns suppress visible horizontal sampling steps on the broad slope.
// Fixed sampling coordinates remain independent of time/season (6,120 stops).
export const BLENDED_MEADOW_STEP=2.5;
export const BLENDED_MEADOW_COLUMNS=Array.from({length:360},(_,i)=>90+i*BLENDED_MEADOW_STEP);
export const BLENDED_MEADOW_DEPTHS=Array.from({length:17},(_,i)=>i/16);
