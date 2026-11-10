import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';

// Browser-captured real courtyard, using the same saved hand-drawn paths.
// The page presents the captures; it does not regenerate an ideal route.
const out='public/art-studies/wear-composite';
const live='/?wearTime=night';
function jpegSize(bytes:Buffer){
  assert.equal(bytes.readUInt16BE(0),0xffd8);
  for(let offset=2;offset<bytes.length;){
    const marker=bytes.readUInt16BE(offset),length=bytes.readUInt16BE(offset+2);
    if([0xffc0,0xffc1,0xffc2].includes(marker))return [bytes.readUInt16BE(offset+7),bytes.readUInt16BE(offset+5)];
    offset+=length+2;
  }
  throw new Error('JPEG dimensions missing');
}
const sections=(['day','dusk','night'] as const).map(time=>{
  for(const mode of ['original','shared']){
    assert.deepEqual(jpegSize(readFileSync(`${out}/${time}-${mode}.jpg`)),[1572,1252]);
  }
  const cards=(detail:boolean)=>['original','shared'].map((mode,i)=>`<article><h2>${i?'候选 · 统一覆盖':'A · 原版分开裁切'}</h2>${detail?'<div class="crop">':''}<img src="${time}-${mode}.jpg" alt="${time} ${mode} 真实庭院截图">${detail?'</div>':''}</article>`).join('');
  return `<section id="${time}" ${time==='night'?'':'hidden'}><div class="grid">${cards(false)}</div><details><summary>同一位置局部放大：中间直段与右侧缓弯</summary><div class="grid">${cards(true)}</div></details></section>`;
}).join('');
writeFileSync(`${out}/index.html`,`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>统一覆盖 · 真实庭院对照</title><style>body{margin:0;background:#252e27;color:#eee8d8;font:14px/1.7 "Microsoft YaHei",sans-serif}main{max-width:1500px;margin:auto;padding:24px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}article{border:1px solid #59634d;border-radius:8px;overflow:hidden}img{display:block;width:100%}p{max-width:1050px}h1{font-size:24px}h2{font-size:15px;margin:10px 14px}button{padding:8px 18px;background:#354333;color:#eee8d8;border:1px solid #8a9872;cursor:pointer}button[aria-pressed=true]{background:#c9d0ac;color:#253020}[hidden]{display:none!important}summary{cursor:pointer;margin:16px 0}a{color:#c9d0ac}.crop{position:relative;overflow:hidden;aspect-ratio:325/285}.crop img{position:absolute;max-width:none;width:483.6923%;left:-244.6154%;top:-296.4912%}nav{margin:16px 0}</style><main><h1>统一边缘覆盖 · 真实庭院对照</h1><p>同一庭院、同一组已有手绘路径、同一视角。左侧 A 保留原版；右侧让土色、路面细节与环境色共同经过一个遮罩。配色、路线、模糊宽度、细草与接触暗带相同。截图中的风、烟、热气球和动物会随时间运动。</p><p><a href="${live}">返回正式场景 A</a> · 实验已结束：采用 A。统一覆盖候选已撤回，本页仅保留历史截图。</p><nav>${['day','dusk','night'].map((t,i)=>`<button data-time="${t}" aria-pressed="${i===2}">${['白天','黄昏','夜晚'][i]}</button>`).join('')}</nav>${sections}</main><script>document.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-time]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));['day','dusk','night'].forEach(k=>document.getElementById(k).hidden=k!==b.dataset.time)})</script></html>`);
console.log('Generated public/art-studies/wear-composite/index.html from 6 actual-scene captures.');
