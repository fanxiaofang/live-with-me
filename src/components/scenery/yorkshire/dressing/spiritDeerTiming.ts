import {smooth} from './spiritDeerRig';

export const DEER_TIMING={period:132,depart:18,walk:24,turn:39.5,home:47,homeTurn:68.5,rest:76,hop:12,scatter:2.5,absent:3,condense:1.5,settle:.5,turnDuration:7.5} as const;
export type DeerEffectPhase='none'|'dispersing'|'absent'|'condensing'|'settling';
/** Scatter overlaps the final moving steps. The completely empty interval is [2.5,5.5). */
export function deerTurnPhase(seconds:number){
  if(seconds<2.5)return {effectPhase:'dispersing' as DeerEffectPhase,transition:.48*Math.max(0,seconds)/2.5,visibility:1-smooth(seconds/2.3),groundVisibility:1-smooth(seconds/2.5),veil:1};
  if(seconds<5.5)return {effectPhase:'absent' as DeerEffectPhase,transition:.5,visibility:0,groundVisibility:0,veil:0};
  if(seconds<7)return {effectPhase:'condensing' as DeerEffectPhase,transition:.54+.46*(seconds-5.5)/1.5,visibility:smooth((seconds-5.85)/1.15),groundVisibility:smooth((seconds-5.5)/1.5),veil:1};
  return {effectPhase:'settling' as DeerEffectPhase,transition:1,visibility:1,groundVisibility:1,veil:0};
}
