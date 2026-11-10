import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { buildWearMaterial, type WearMaterialGeometry } from '../../src/features/yard-editor/wearMaterial';
import type { WearStroke } from '../../src/features/yard-editor/yardWear';
import { WearMaterialDrawing } from '../../src/components/scenery/yorkshire/dressing/WearBrushSurface';
import { HomesteadMeadowSurface } from '../../src/components/scenery/yorkshire/vegetation/HomesteadMeadowSurface';
import { createF2SceneTheme } from '../../src/world/render/f2/F2Environment';
import { COUNTRYSIDE_THEMES } from '../../src/world/theme/worldTheme';

const out='public/art-studies/wear-outline',fixture='scripts/art-studies/fixtures/wear-outline-restrained.json';
const cases=[
  {name:'顺直向下 · 64',stroke:{size:64,strength:'trail',points:[{x:170,y:335},{x:170,y:470}] }},
  {name:'顺直向下 · 140',stroke:{size:140,strength:'trail',points:[{x:170,y:335},{x:170,y:470}] }},
  {name:'横向 · 64',stroke:{size:64,strength:'trail',points:[{x:30,y:400},{x:310,y:400}] }},
  {name:'缓弯 · 64',stroke:{size:64,strength:'trail',points:Array.from({length:81},(_,i)=>{const t=i/80;return {x:30+t*280,y:440-80*(3*t*t-2*t*t*t)};})}},
] as {name:string;stroke:WearStroke}[];
mkdirSync(out,{recursive:true});
if(process.argv.includes('--capture')){
  mkdirSync('scripts/art-studies/fixtures',{recursive:true});
  writeFileSync(fixture,JSON.stringify(cases.map(c=>buildWearMaterial([c.stroke]))));
  console.log('Captured previous material outlines.');
}else{
  const before=JSON.parse(readFileSync(fixture,'utf8')) as WearMaterialGeometry[];
  const section=(time:'day'|'dusk'|'night')=>cases.map((c,row)=>`<h2>${c.name}</h2><div class="grid">`+[before[row],buildWearMaterial([c.stroke])].map((geometry,col)=>{
    const theme=createF2SceneTheme(COUNTRYSIDE_THEMES[time],time),id=`outline-${time}-${row}-${col}`;
    return '<article>'+renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" viewBox={row<2?'95 320 150 165':'0 320 340 180'}>
      <rect x="0" y="300" width="340" height="220" fill={theme.landscapeEnvironment!.grassMid}/>
      <HomesteadMeadowSurface theme={theme} surfaceId={id+'-bg'}/>
      <WearMaterialDrawing id={id} geometry={geometry} theme={theme} tone="original"/>
    </svg>)+`<p>${col?'本轮：轻收尾、平顺轮廓、草叶压边':'上一轮：稳定路宽、明显收尾'}</p></article>`;
  }).join('')+'</div>').join('');
  writeFileSync(`${out}/index.html`,`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>路径轮廓调整对照</title><style>body{background:#252e27;color:#eee8d8;font:14px/1.7 "Microsoft YaHei",sans-serif}main{max-width:1000px;margin:auto;padding:20px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}article{border:1px solid #59634d;border-radius:8px;overflow:hidden}svg{display:block;width:100%;max-height:400px}p{margin:10px}h1{font-size:24px}h2{font-size:16px}button{padding:8px 18px;background:#354333;color:#eee8d8;border:1px solid #8a9872;cursor:pointer}button[aria-pressed=true]{background:#c9d0ac;color:#253020}[hidden]{display:none!important}a{color:#c9d0ac}</style><main><h1>相同输入 · 土面轮廓调整前后</h1><p>原版配色、边缘模糊、路线、笔刷尺寸均相同。左列保存本轮改动前的生成结果；右列使用当前生成器。<a href="/?wearToneStudy=original&wearTime=night&wearCurveStudy=1&wearEdgeStudy=original&wearNightEdge=soft">正式场景</a></p><nav>${['day','dusk','night'].map((t,i)=>`<button data-time="${t}" aria-pressed="${i===2}">${['白天','黄昏','夜晚'][i]}</button>`).join('')}</nav>${(['day','dusk','night'] as const).map(t=>`<section id="${t}" ${t==='night'?'':'hidden'}>${section(t)}</section>`).join('')}</main><script>document.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-time]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));['day','dusk','night'].forEach(k=>document.getElementById(k).hidden=k!==b.dataset.time)})</script></html>`);
  console.log('Generated public/art-studies/wear-outline/index.html');
}
