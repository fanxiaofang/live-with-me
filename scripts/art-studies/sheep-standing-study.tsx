import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdirSync, writeFileSync } from 'node:fs';
import { StorybookSheep } from '../../src/components/scenery/yorkshire/dressing/StorybookSheep';

const figure = (small = false, pose: 'standing' | 'grazing' | 'resting' = 'standing') => renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" viewBox="-31 -25 76 54" role="img" aria-label={small ? '站立羊羔样本' : '站立成年羊样本'}>
  <StorybookSheep lamb={small} pose={pose} />
</svg>);
const pair = renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 108" role="img" aria-label="成年羊与羊羔的相对比例">
  <g transform="translate(135 57) scale(1.45)"><StorybookSheep /></g>
  <g transform="translate(225 69) scale(.986)"><StorybookSheep lamb /></g>
</svg>);
const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>小羊造型 · 场景替换</title><style>
*{box-sizing:border-box}body{margin:0;background:#efe8d9;color:#463e30;font:15px/1.7 system-ui,sans-serif}main{max-width:1000px;margin:auto;padding:32px 24px}h1{font-size:24px;margin:0 0 8px}p{margin:0 0 22px;color:#6d6453}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}figure{margin:0;background:#8f9d55;border-radius:12px;overflow:hidden}figure svg{width:100%;display:block;padding:30px 20px 16px}figcaption{background:#e5dcc9;padding:12px 18px}section{margin-top:22px;background:#8f9d55;border-radius:12px;overflow:hidden}section svg{display:block;width:380px;max-width:100%;margin:auto}section p{margin:0;background:#e5dcc9;padding:12px 18px;font-size:14px}@media(max-width:600px){.grid{grid-template-columns:1fr}main{padding:24px 16px}}
</style><main><h1>小羊造型 · 场景替换</h1><p>站立造型已暂时通过，现已替换庭院与羊圈中的八只羊；下方补充吃草与卧姿适配。</p>
<div class="grid"><figure>${figure()}<figcaption>成年羊：敦实身体、肩背与胸前承接、短尾和小蹄</figcaption></figure><figure>${figure(true)}<figcaption>羊羔：短身体、较大的头、侧眼、短尾与放松的耳朵</figcaption></figure></div>
<div class="grid" style="margin-top:20px"><figure>${figure(false, 'grazing')}<figcaption>吃草：头颈一起下探，嘴部靠近草面</figcaption></figure><figure>${figure(false, 'resting')}<figcaption>卧姿：闭眼、收腿，腹部承接地面</figcaption></figure></div><section>${pair}<p>比例参考：成年羊与羊羔保持正式场景中的缩放关系。</p></section></main></html>`;
mkdirSync('public/art-studies/sheep-standing', { recursive: true });
writeFileSync('public/art-studies/sheep-standing/index.html', html);
console.log('Generated public/art-studies/sheep-standing/index.html');
