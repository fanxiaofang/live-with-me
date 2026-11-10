import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { buildWearMaterial } from '../../src/features/yard-editor/wearMaterial';
import type { WearStroke } from '../../src/features/yard-editor/yardWear';
import { WearMaterialDrawing } from '../../src/components/scenery/yorkshire/dressing/WearBrushSurface';
import { HomesteadMeadowSurface } from '../../src/components/scenery/yorkshire/vegetation/HomesteadMeadowSurface';
import { createF2SceneTheme } from '../../src/world/render/f2/F2Environment';
import { COUNTRYSIDE_THEMES } from '../../src/world/theme/worldTheme';

const cases:{name:string;stroke:WearStroke;view:string}[]=[
  {name:'细土径 · 64',stroke:{size:64,strength:'trail',points:[{x:170,y:335},{x:170,y:470}]},view:'100 320 140 165'},
  {name:'宽土径 · 140',stroke:{size:140,strength:'trail',points:[{x:170,y:335},{x:170,y:470}]},view:'75 315 190 170'},
  {name:'缓弯土径 · 96',stroke:{size:96,strength:'trail',points:Array.from({length:61},(_,i)=>{const t=i/60;return {x:35+t*270,y:435-70*(3*t*t-2*t*t*t)};})},view:'0 335 340 125'},
];

const sections=(['day','dusk','night'] as const).map(time=>{
  const theme=createF2SceneTheme(COUNTRYSIDE_THEMES[time],time);
  return `<section id="${time}" ${time==='night'?'':'hidden'}>`+cases.map((c,row)=>{
    const geometry=buildWearMaterial([c.stroke]);
    // Verify the single variable in emitted SVG, including preservation of the
    // companion grass-colour rim and every other material/grass element.
    const baseline=renderToStaticMarkup(<svg><WearMaterialDrawing geometry={geometry} theme={theme} id="verify"/></svg>);
    const reduced=renderToStaticMarkup(<svg><WearMaterialDrawing geometry={geometry} theme={theme} id="verify" contactShade={false}/></svg>);
    const darkPaths=/<path\b[^>]*stroke-width="1\.05"[^>]*><\/path>/g;
    assert.equal((baseline.match(darkPaths)||[]).length,geometry.contacts.length);
    assert.equal(baseline.replace(darkPaths,''),reduced);
    const site=geometry.tufts[0];
    return `<h2>${c.name}</h2><div class="grid">`+[true,false].map(contactShade=>{
      const id=`contact-${time}-${row}-${contactShade}`;
      const drawing=(view:string,suffix:string)=>renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" viewBox={view}>
        <rect x="0" y="300" width="340" height="220" fill={theme.landscapeEnvironment!.grassMid}/>
        <HomesteadMeadowSurface theme={theme} surfaceId={id+suffix+'-bg'}/>
        <WearMaterialDrawing geometry={geometry} theme={theme} id={id+suffix} contactShade={contactShade}/>
      </svg>);
      return '<article>'+drawing(c.view,'-whole')+`<p>${contactShade?'A · 当前基准：保留接触暗带':'C · 减法对照：仅撤掉接触暗带'}</p><details><summary>同一位置局部放大</summary>`+drawing(`${site.x-18} ${site.y-10} 36 20`,'-detail')+'</details></article>';
    }).join('')+'</div>';
  }).join('')+'</section>';
}).join('');
mkdirSync('public/art-studies/wear-contact',{recursive:true});
writeFileSync('public/art-studies/wear-contact/index.html',`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>土径接触暗带减法对照</title><style>body{margin:0;background:#252e27;color:#eee8d8;font:14px/1.7 "Microsoft YaHei",sans-serif}main{max-width:1050px;margin:auto;padding:24px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}article{border:1px solid #59634d;border-radius:8px;overflow:hidden}svg{display:block;width:100%;max-height:380px}p{margin:12px}h1{font-size:24px}h2{font-size:16px}button{padding:8px 18px;background:#354333;color:#eee8d8;border:1px solid #8a9872;cursor:pointer}button[aria-pressed=true]{background:#c9d0ac;color:#253020}[hidden]{display:none!important}summary{cursor:pointer}a{color:#c9d0ac}</style><main><h1>土径边界 · 接触暗带减法对照</h1><p>左 A 保留当前效果；右 C 仅撤掉断续的边界接触暗带。土面、轮廓、原有过渡、草色薄边、路面细节和细草相同。独立实验，正式场景沿用 A。</p><p><a href="/art-studies/wear-turf/index.html">查看上轮 A／B 草皮补丁实验记录</a></p><nav>${['day','dusk','night'].map((t,i)=>`<button data-time="${t}" aria-pressed="${i===2}">${['白天','黄昏','夜晚'][i]}</button>`).join('')}</nav>${sections}</main><script>document.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-time]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));['day','dusk','night'].forEach(k=>document.getElementById(k).hidden=k!==b.dataset.time)})</script></html>`);
console.log('Generated public/art-studies/wear-contact/index.html; all 9 SVG single-variable comparisons passed.');
