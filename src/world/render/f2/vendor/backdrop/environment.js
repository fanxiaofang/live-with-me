import * as THREE from 'three';
import {PALETTES} from './config.js';
const rgb=v=>new THREE.Color(v);
const SURFACE={spring:{light:'#c6d8a4',shadow:'#597b70'},summer:{light:'#cccb93',shadow:'#4e7168'},autumn:{light:'#d6bc80',shadow:'#697967'},winter:{light:'#e6ded2',shadow:'#718aa8'}};
// Explicit lighting and atmosphere palettes. No screen overlay or celestial objects.
export const TIME_LOOKS={
 day:{baseScale:1,baseTint:'#7e927f',baseMix:0,top:null,horizon:null,air:null,light:null,shadow:null,lightScale:1,contrast:1},
 dusk:{baseScale:.72,baseTint:'#727981',baseMix:.22,top:'#71859f',horizon:'#d0b296',air:'#ada8a1',light:'#d5aa80',shadow:'#617383',lightScale:.72,contrast:.88},
 night:{baseScale:.16,baseTint:'#33485e',baseMix:.36,top:'#1b2c47',horizon:'#45556e',air:'#42516a',light:'#64748c',shadow:'#2b3e57',lightScale:.14,contrast:.72}
};
const LOOKS={clear:{skyMix:0,airBoost:0,footBoost:0,lightScale:1,wet:0},lightRain:{skyMix:.65,airBoost:.10,footBoost:.07,lightScale:.42,wet:.12},snow:{skyMix:.56,airBoost:.14,footBoost:.12,lightScale:.36,wet:0},lightFog:{skyMix:.18,airBoost:.035,footBoost:.34,lightScale:.72,wet:0}};
export function environmentLook(config,layer,index,{season=config.season,weather=config.weather,timeOfDay=config.timeOfDay,useConfig=true}={}){
 const p=PALETTES[season],t=TIME_LOOKS[timeOfDay],w=LOOKS[weather];
 const base=rgb(useConfig?layer.color:p.colors[config.layers.length===2?index*2:index]);
 const top=rgb(useConfig?config.palette.skyTop:p.skyTop),air=rgb(useConfig?config.palette.air:p.air),horizon=air.clone();
 let lit=base.clone().lerp(rgb(SURFACE[season].light),.58).multiplyScalar(1.17),shade=base.clone().lerp(rgb(SURFACE[season].shadow),.48).multiplyScalar(.78);
 if(timeOfDay!=='day'){
  base.multiplyScalar(t.baseScale).lerp(rgb(t.baseTint),t.baseMix);top.set(t.top);horizon.set(t.horizon);air.set(t.air);
  lit=base.clone().lerp(rgb(t.light),timeOfDay==='night'?.16:.48);shade=base.clone().lerp(rgb(t.shadow),.44).multiplyScalar(timeOfDay==='night'?.90:.86);
 }
 // Current-time weather air prevents daytime white fog from leaking into night.
 const weatherAir=rgb(timeOfDay==='night'?(weather==='snow'?'#596479':'#4d5c70'):timeOfDay==='dusk'?'#aaa5a6':weather==='lightRain'?'#bcc8cc':weather==='snow'?'#d1d9df':'#d5ddd7');
 top.lerp(weatherAir,w.skyMix);horizon.lerp(weatherAir,w.skyMix*.40);air.lerp(weatherAir,w.skyMix*.25);
 if(w.wet)base.lerp(rgb(timeOfDay==='night'?'#304b5c':'#6f8d82'),w.wet);
 return{base,air,top,horizon,lit,shade,layerAir:Math.min(.88,layer.air*t.contrast+w.airBoost),foot:Math.min(.65,layer.footAir+w.footBoost),light:w.lightScale*t.lightScale};
}
