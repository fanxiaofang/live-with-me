import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdirSync, writeFileSync } from 'node:fs';
import { buildWearMaterial, wearHash, wearPalette, type WearMaterialGeometry } from '../../src/features/yard-editor/wearMaterial';
import { WEAR_GROUND_Y as groundY, type WearPoint, type WearStroke } from '../../src/features/yard-editor/yardWear';
import { WearMaterialDrawing } from '../../src/components/scenery/yorkshire/dressing/WearBrushSurface';
import { HomesteadMeadowSurface } from '../../src/components/scenery/yorkshire/vegetation/HomesteadMeadowSurface';
import { Grass } from '../../src/components/scenery/yorkshire/vegetation/MeadowVegetationAssets';
import { meadowGrassOpacity, meadowPlantPaletteCss } from '../../src/components/scenery/yorkshire/vegetation/meadowPalette';
import { createF2SceneTheme } from '../../src/world/render/f2/F2Environment';
import { COUNTRYSIDE_THEMES } from '../../src/world/theme/worldTheme';
import type { YorkshireSceneTheme } from '../../src/components/scenery/yorkshire/landscapeTypes';

// Study only. The editor's renderer and saved strokes remain untouched.
function contourPoints(outline:string) {
  const points:WearPoint[]=[];let current={x:0,y:0};
  for(const match of outline.matchAll(/([MQ])([^MQZ]+)/g)){
    const v=match[2].match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi)!.map(Number);
    if(match[1]==='M'){current={x:v[0],y:v[1]/groundY};continue;}
    const a=current,c={x:v[0],y:v[1]/groundY},b={x:v[2],y:v[3]/groundY};
    for(let j=0;j<4;j++){const t=j/4,u=1-t;points.push({x:u*u*a.x+2*u*t*c.x+t*t*b.x,y:u*u*a.y+2*u*t*c.y+t*t*b.y});}
    current=b;
  }
  return points;
}

function turfSites(geometry:WearMaterialGeometry) {
  const contour=contourPoints(geometry.outline);
  return geometry.tufts.filter((_,i)=>i%2===0).slice(0,4).map((tuft,i)=>{
    let nearest=0,distance=Infinity;
    contour.forEach((p,j)=>{const d=Math.hypot(p.x-tuft.x,p.y-tuft.y/groundY);if(d<distance){nearest=j;distance=d;}});
    const p=contour[nearest],a=contour[(nearest+contour.length-2)%contour.length],b=contour[(nearest+2)%contour.length];
    const length=Math.hypot(b.x-a.x,b.y-a.y)||1,tx=(b.x-a.x)/length,ty=(b.y-a.y)/length;
    return {x:p.x,y:p.y*groundY,transform:`matrix(${tx} ${ty*groundY} ${-ty} ${tx*groundY} ${p.x} ${p.y*groundY})`,width: .85+i%3*.12};
  });
}

function TurfCandidate({geometry,theme,id}:{geometry:WearMaterialGeometry;theme:YorkshireSceneTheme;id:string}) {
  const sites=turfSites(geometry),p=wearPalette(theme);
  const tongue='M-11,-6 L11,-6 L10,-1 Q8,0 6,1 Q4,1 2,4 Q0,5 -2,3 Q-4,1 -6,1 Q-9,2 -11,-1Z';
  const lip='M-11,-1 Q-9,2 -6,1 Q-4,1 -2,3 Q0,5 2,4 Q4,1 6,1 Q8,0 10,-1';
  return <g>
    <defs>
      <mask id={id+'-turf-mask'} maskUnits="userSpaceOnUse" {...geometry.bounds} style={{maskType:'luminance'}}>
        <rect {...geometry.bounds} fill="white"/>
        {sites.map((s,i)=><g key={i} transform={s.transform}><path d={tongue} transform={`scale(${s.width} 1)`} fill="black"/></g>)}
      </mask>
      <clipPath id={id+'-earth-clip'}><path d={geometry.outline}/></clipPath>
    </defs>
    {/* Reveal the actual lit meadow below, rather than painting a green patch. */}
    <g mask={`url(#${id}-turf-mask)`}><WearMaterialDrawing geometry={{...geometry,tufts:[]}} theme={theme} id={id+'-earth'}/></g>
    <g clipPath={`url(#${id}-earth-clip)`} pointerEvents="none">
      {sites.map((s,i)=><g key={i} transform={`translate(0 .45) ${s.transform}`}>
        <path d={lip} transform={`scale(${s.width} 1)`} fill="none" stroke={p.shade} strokeWidth=".85" opacity={theme.isNight?.48:.35} vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
      </g>)}
    </g>
    <g id={id+'-grass'}><style>{meadowPlantPaletteCss(theme,'#'+id+'-grass')}</style>
      {geometry.tufts.map(t=>{const variant=Math.floor(wearHash(t.x,17)*9),scale=Math.max(theme.isNight||theme.timeOfDay==='dusk'?.2:0,(t.side===-1?.14:.17)+wearHash(t.x,t.y)*.04);
        return <g key={`${t.x},${t.y}`} opacity={meadowGrassOpacity(theme,t.side===-1?.65:.85,scale)}><Grass type={variant%3===1?'woven':'short'} x={t.x} y={t.y} scale={scale} flip={variant%2===0}/></g>;
      })}
    </g>
  </g>;
}

const cases:{name:string;stroke:WearStroke;view:string}[]=[
  {name:'细土径 · 64',stroke:{size:64,strength:'trail',points:[{x:170,y:335},{x:170,y:470}]},view:'100 320 140 165'},
  {name:'宽土径 · 140',stroke:{size:140,strength:'trail',points:[{x:170,y:335},{x:170,y:470}]},view:'75 315 190 170'},
  {name:'缓弯土径 · 96',stroke:{size:96,strength:'trail',points:Array.from({length:61},(_,i)=>{const t=i/60;return {x:35+t*270,y:435-70*(3*t*t-2*t*t*t)};})},view:'0 335 340 125'},
];
const sections=(['day','dusk','night'] as const).map(time=>{
  const theme=createF2SceneTheme(COUNTRYSIDE_THEMES[time],time);
  return `<section id="${time}" ${time==='night'?'':'hidden'}>`+cases.map((c,row)=>{
    const geometry=buildWearMaterial([c.stroke]);
    return `<h2>${c.name}</h2><div class="grid">`+[false,true].map(candidate=>{
      const id=`turf-${time}-${row}-${candidate}`;
      const site=turfSites(geometry)[0];
      const drawing=(view:string,suffix:string)=>renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" viewBox={view}>
        <rect x="0" y="300" width="340" height="220" fill={theme.landscapeEnvironment!.grassMid}/>
        <HomesteadMeadowSurface theme={theme} surfaceId={id+suffix+'-bg'}/>
        {candidate?<TurfCandidate geometry={geometry} theme={theme} id={id+suffix}/>:<WearMaterialDrawing geometry={geometry} theme={theme} id={id+suffix}/>}
      </svg>);
      return '<article>'+drawing(c.view,'-whole')+`<p>${candidate?'B · 少量草皮遮挡＋短接触暗部':'A · 当前细草＋原有软边'}</p><details><summary>同一位置局部放大</summary>`+drawing(`${site.x-18} ${site.y-10} 36 20`,'-detail')+'</details></article>';
    }).join('')+'</div>';
  }).join('')+'</section>';
}).join('');
mkdirSync('public/art-studies/wear-turf',{recursive:true});
writeFileSync('public/art-studies/wear-turf/index.html',`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>草土交接局部对照</title><style>body{margin:0;background:#252e27;color:#eee8d8;font:14px/1.7 "Microsoft YaHei",sans-serif}main{max-width:1050px;margin:auto;padding:24px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}article{border:1px solid #59634d;border-radius:8px;overflow:hidden}svg{display:block;width:100%;max-height:380px}p{margin:12px}h1{font-size:24px}h2{font-size:16px}button{padding:8px 18px;background:#354333;color:#eee8d8;border:1px solid #8a9872;cursor:pointer}button[aria-pressed=true]{background:#c9d0ac;color:#253020}[hidden]{display:none!important}</style><main><h1>草土交接 · 局部遮挡对照</h1><p>同一路线、轮廓、土色、模糊和细草。右侧仅增加少量草皮遮挡与短接触暗部。草皮露出真实下层草地。独立小样，尚未接入正式场景。</p><nav>${['day','dusk','night'].map((t,i)=>`<button data-time="${t}" aria-pressed="${i===2}">${['白天','黄昏','夜晚'][i]}</button>`).join('')}</nav>${sections}</main><script>document.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-time]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));['day','dusk','night'].forEach(k=>document.getElementById(k).hidden=k!==b.dataset.time)})</script></html>`);
console.log('Generated public/art-studies/wear-turf/index.html');
