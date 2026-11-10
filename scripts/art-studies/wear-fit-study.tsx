import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdirSync, writeFileSync } from 'node:fs';
import { WearMaterialDrawing } from '../../src/components/scenery/yorkshire/dressing/WearBrushSurface';
import { HomesteadMeadowSurface } from '../../src/components/scenery/yorkshire/vegetation/HomesteadMeadowSurface';
import { COUNTRYSIDE_THEMES } from '../../src/world/theme/worldTheme';
import { createF2SceneTheme } from '../../src/world/render/f2/F2Environment';
import { buildWearMaterial } from '../../src/features/yard-editor/wearMaterial';
import { fitWearStroke } from '../../src/features/yard-editor/wearCurve';
import { WEAR_GROUND_Y, type WearPoint, type WearStroke } from '../../src/features/yard-editor/yardWear';

const out='public/art-studies/wear-fit';
mkdirSync(out,{recursive:true});
const straight=Array.from({length:101},(_,i)=>({x:30+i*2.8,y:390}));
const curve=Array.from({length:121},(_,i)=>{
  const t=i/120,u=1-t;
  return {x:u*u*u*30+3*u*u*t*90+3*u*t*t*220+t*t*t*310,y:u*u*u*430+3*u*u*t*435+3*u*t*t*350+t*t*t*365};
});
const corner=[...Array.from({length:61},(_,i)=>({x:40+i*2,y:430})),...Array.from({length:61},(_,i)=>({x:160,y:430-i*.8}))];
const routes=[{name:'直线',points:straight},{name:'舒展缓弯',points:curve},{name:'有意转弯',points:corner}];
const noisy=(points:WearPoint[])=>points.map((p,i)=>{
  if(!i||i===points.length-1)return p;
  const a=points[i-1],b=points[i+1],dx=b.x-a.x,dy=(b.y-a.y)/WEAR_GROUND_Y,length=Math.hypot(dx,dy)||1;
  const offset=(i%2?2.8:-2.8)+Math.sin(i*1.7)*.4;
  return {x:p.x-dy/length*offset,y:p.y+dx/length*offset*WEAR_GROUND_Y};
});
const input=(points:WearPoint[]):WearStroke=>({size:64,strength:'trail',points});
function panels(time:'day'|'dusk'|'night') {
  const theme=createF2SceneTheme(COUNTRYSIDE_THEMES[time],time);
  return routes.map((route,row)=>{
    const raw=input(noisy(route.points)),fit=fitWearStroke(raw);
    const inputs=[input(route.points),raw,fit.stroke];
    return `<h2>${route.name} · 注入法向抖动 ±2.8 地面单位</h2><div class="grid">`+inputs.map((stroke,col)=>{
      const id=`fit-study-${time}-${row}-${col}`;
      const svg=renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 320 340 150">
        <rect x="0" y="320" width="340" height="150" fill={theme.landscapeEnvironment!.grassMid}/>
        <HomesteadMeadowSurface theme={theme} surfaceId={id+'-background'}/>
        <WearMaterialDrawing id={id} geometry={buildWearMaterial([stroke],true)} theme={theme} tone="original" edge="clean"/>
      </svg>);
      return `<article>${svg}<p>${['理想输入','带抖动输入，未经拟合','相同抖动输入，收笔拟合'][col]}${col===2?` · 最大采样偏离 ${fit.maxError.toFixed(2)} 地面单位`:''}</p></article>`;
    }).join('')+'</div>';
  }).join('');
}
writeFileSync(`${out}/index.html`,`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>路径输入与草皮接触对照</title><style>body{margin:0;background:#252e27;color:#eee8d8;font:14px/1.7 "Microsoft YaHei",sans-serif}main{max-width:1250px;margin:auto;padding:24px}h1{font-size:24px}h2{font-size:16px;margin:20px 0 8px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}article{border:1px solid #59634d;border-radius:8px;overflow:hidden}svg{width:100%;display:block}p{margin:8px 12px}button{padding:8px 20px;border:1px solid #8a9872;background:#354333;color:#eee8d8;cursor:pointer}button[aria-pressed=true]{background:#c9d0ac;color:#253020}[hidden]{display:none!important}a{color:#c9d0ac}</style><main><h1>相同路线：理想输入／抖动输入／收笔拟合</h1><p>三列使用同一个材质生成器、相同宽度和颜色。差异只来自输入路线；不是为每列手工绘制不同的土面。<br>黄昏、夜晚沿用之前独立小样的原版配色。局部草皮接触与路面明暗为本轮待评审效果。<a href="/?wearToneStudy=garden&wearTime=night&wearCurveStudy=1&wearEdgeStudy=clean">庭院实际涂刷</a></p><nav>${['day','dusk','night'].map((time,i)=>`<button data-time="${time}" aria-pressed="${i===2}">${['白天','黄昏','夜晚'][i]}</button>`).join('')}</nav>${(['day','dusk','night'] as const).map(time=>`<section id="${time}" ${time==='night'?'':'hidden'}>${panels(time)}</section>`).join('')}</main><script>document.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-time]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));['day','dusk','night'].forEach(k=>document.getElementById(k).hidden=k!==b.dataset.time)})</script></html>`);
console.log('Generated public/art-studies/wear-fit/index.html');
