import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdirSync, writeFileSync } from 'node:fs';
import { MeadowWearPatch } from '../../src/components/scenery/yorkshire/dressing/MeadowWearPatch';
import { WearMaterialDrawing } from '../../src/components/scenery/yorkshire/dressing/WearBrushSurface';
import { HomesteadMeadowSurface } from '../../src/components/scenery/yorkshire/vegetation/HomesteadMeadowSurface';
import { COUNTRYSIDE_THEMES } from '../../src/world/theme/worldTheme';
import { createF2SceneTheme } from '../../src/world/render/f2/F2Environment';
import { buildWearMaterial } from '../../src/features/yard-editor/wearMaterial';
import { extendWearStroke, type WearStroke, type WearPoint } from '../../src/features/yard-editor/yardWear';
import { fitWearStroke } from '../../src/features/yard-editor/wearCurve';

const out='public/art-studies/wear-material';
mkdirSync(out,{recursive:true});
const curve=(a:WearPoint,b:WearPoint,c:WearPoint,d:WearPoint)=>Array.from({length:49},(_,i)=>{
  const t=i/48,u=1-t;
  return {x:u**3*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t**3*d.x,y:u**3*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t**3*d.y};
});
const main=curve({x:43,y:429},{x:117,y:428},{x:173,y:365},{x:295,y:376});
const cross=curve({x:95,y:362},{x:137,y:381},{x:188,y:430},{x:254,y:443});
function input(points:WearPoint[],strength:WearStroke['strength']='trail',size=92) {
  const raw=points.slice(1).reduce((stroke,p)=>extendWearStroke(stroke,p,8000-stroke.points.length),{strength,size,points:[points[0]]} as WearStroke);
  return fitWearStroke(raw).stroke;
}
const cases:{title:string;note:string;strokes:WearStroke[];dab?:boolean}[]=[
  {title:'01 · 原版单点',note:'单点组件保留；与连续土径分开判断。',strokes:[],dab:true},
  {title:'02 · 连续中度踩踏',note:'原预设路线，调用正式输入与材质实现。',strokes:[input(main,'medium')]},
  {title:'03 · 重度土径',note:'直径 92；与编辑器使用同一个生成器。',strokes:[input(main)]},
  {title:'04 · 路径交叉',note:'覆盖合并，交叉处不重复叠色。',strokes:[input(main),input(cross)]},
  {title:'05 · 横向',note:'地面长度 300，直径 64；允许正常的投影压缩。',strokes:[input([{x:20,y:390},{x:320,y:390}],'trail',64)]},
  {title:'06 · 纵深向',note:'地面长度 300，直径 64；检查两侧路肩。',strokes:[input([{x:170,y:347.25},{x:170,y:432.75}],'trail',64)]},
  {title:'07 · 斜向',note:'直径 64，使用原始分段输入，不自动美化。',strokes:[input([{x:40,y:425},{x:75,y:415},{x:125,y:401},{x:180,y:385},{x:235,y:370},{x:290,y:354}],'trail',64)]},
  {title:'08 · 转弯与补刷',note:'保留转折和收笔；两笔相接，不做轨迹平滑。',strokes:[input([{x:40,y:430},{x:165,y:430},{x:165,y:370}],'trail',64),input([{x:165,y:370},{x:290,y:370}],'trail',64)]},
];
function scene(index:number,light:'day'|'night') {
  const theme=createF2SceneTheme(COUNTRYSIDE_THEMES[light],light),id=`study-${light}-${index}`,test=cases[index];
  return renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 300 340 180" role="img" aria-label={test.title}>
    <rect x="0" y="300" width="340" height="180" fill={theme.landscapeEnvironment!.grassMid}/>
    <HomesteadMeadowSurface theme={theme} surfaceId={id+'-background'}/>
    {test.dab?<MeadowWearPatch id={id+'-dab'} theme={theme} transform="translate(170 390) scale(1.65 .8) translate(3 -22)"/>:
      <WearMaterialDrawing id={id} geometry={buildWearMaterial(test.strokes)} theme={theme}/>}
  </svg>);
}
const cards=(light:'day'|'night')=>cases.map((test,i)=>`<article>${scene(i,light)}<h2>${test.title}</h2><p>${test.note}</p></article>`).join('');
writeFileSync(`${out}/index.html`,`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>草土笔刷 · 共用实现对照</title><style>*{box-sizing:border-box}body{margin:0;background:#242b22;color:#ede8d7;font:15px/1.6 "Microsoft YaHei",sans-serif}main{max-width:1000px;margin:auto;padding:24px}header{display:flex;justify-content:space-between;align-items:center;gap:12px}h1{font-size:25px;margin:0}p{color:#bbc2ac}a{color:#d4d5ab}nav{display:flex;gap:8px}button{padding:9px 18px;background:#30392b;border:1px solid #667257;border-radius:9px;color:#dfe5d3;cursor:pointer}button[aria-pressed=true]{background:#d4d5ab;color:#292c21}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}article{overflow:hidden;border:1px solid #4d5945;border-radius:12px;background:#30382c}svg{display:block;width:100%}h2{font-size:16px;margin:12px 16px 0}article p{font-size:12px;margin:4px 16px 16px}[hidden]{display:none!important}@media(max-width:650px){.grid{grid-template-columns:1fr}}</style><main><header><h1>草土笔刷 · 共用实现对照</h1><nav><button data-light="day" aria-pressed="true">白天</button><button data-light="night" aria-pressed="false">夜晚</button></nav></header><p>预设输入经过正式笔刷生成器与材质组件；背景使用 F2 草色与庭院色晕。此页不是手绘操作验证。<br><a href="baseline.html">查看保留的旧小样</a> · <a href="/">进入庭院实际涂刷</a></p><section id="day" class="grid">${cards('day')}</section><section id="night" class="grid" hidden>${cards('night')}</section></main><script>document.querySelectorAll('[data-light]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-light]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));['day','night'].forEach(k=>document.getElementById(k).hidden=k!==b.dataset.light)})</script></html>`);
for(const light of ['day','night'] as const) {
  const panels=cases.map((test,i)=>`<g transform="translate(${i%2*520} ${Math.floor(i/2)*330})"><svg y="35" width="500" height="265" viewBox="0 300 340 180">${scene(i,light).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg><text x="12" y="23" fill="#e9e6d6" font-size="17">${test.title}</text></g>`).join('');
  writeFileSync(`${out}/comparison-${light}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="1320" style="font-family:Microsoft YaHei,sans-serif"><rect width="1040" height="1320" fill="#242b22"/>${panels}</svg>`);
}
console.log('Generated shared-renderer study and direction comparisons.');
