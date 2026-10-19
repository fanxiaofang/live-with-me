import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdir, writeFile } from 'node:fs/promises';
import { studies, StudySvg, speciesStudies, SpeciesSvg } from '../tests/fixtures/meadow/GrassStudiesV2';

const directory = 'docs/architecture/metrics/MEADOW-VEGETATION-B-2026-10-19/v2';
await mkdir(directory, { recursive: true });
const assetNames = { soft: 'short-meadow.svg', wild: 'wild-grass.svg', flower: 'wildflower-mix.svg' };
const rows: string[] = [];
for (const study of studies) {
  const overview = renderToStaticMarkup(<StudySvg kind={study.kind} overview />);
  const detail = renderToStaticMarkup(<StudySvg kind={study.kind} />);
  await writeFile(`${directory}/${study.kind}.svg`, detail);
  rows.push(`<section aria-labelledby="title-${study.kind}"><div class="description"><h2 id="title-${study.kind}">${study.name}</h2><p>${study.description}</p><a href="${study.kind}.svg" download>下载原样板 SVG</a> · <a href="/src/assets/meadow/${assetNames[study.kind]}" download>下载透明资产</a></div><figure class="overview">${overview}<figcaption>总览尺度 · 0.66 × · 按实际像素显示</figcaption></figure><figure class="detail">${detail}<figcaption>放大观察 · 检查叶片与遮挡关系</figcaption></figure></section>`);
}
const flowers: string[] = [];
for (const species of speciesStudies) {
  const svg = renderToStaticMarkup(<SpeciesSvg species={species.id} />);
  await writeFile(`${directory}/${species.id}.svg`, svg);
  flowers.push(`<article><h3>${species.name}</h3><p class="latin">${species.latin}</p>${svg}<p>${species.description}</p><a href="${species.id}.svg" download>下载植物小样</a></article>`);
}
await writeFile(`${directory}/index.html`, `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>平整草甸 · 植物结构修订 v2</title><style>
*{box-sizing:border-box}body{margin:0;background:#1b231f;color:#edf1e8;font:16px/1.6 system-ui,sans-serif}main{max-width:1150px;margin:auto;padding:34px 24px 44px}h1{font-size:32px;font-weight:600;letter-spacing:-.02em;margin:0;text-wrap:balance}header p{max-width:65ch;color:#bbc9bb;margin:10px 0 0}.status{font-size:14px;color:#b4c6a8;margin-top:6px}nav{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:22px 0 18px}button{font:inherit;color:#d5dfd1;background:transparent;border:1px solid #64735f;border-radius:5px;padding:8px 16px;cursor:pointer}button[aria-pressed=true]{background:#cbdcb8;color:#1b231f;border-color:#cbdcb8}button:hover{border-color:#e1ebd9}:focus-visible{outline:3px solid #e1ebd9;outline-offset:4px}section{display:grid;grid-template-columns:minmax(150px,1fr) 300px 520px;gap:20px;align-items:center;padding:22px 0;border-top:1px solid #445044}h2{font-size:21px;font-weight:550;margin:0 0 8px}.description p{font-size:14px;color:#bbc9bb;margin:0 0 14px}a{color:#cfdfbc;text-underline-offset:4px}figure{margin:0;min-width:0}svg{display:block}.overview svg{width:300px;height:180px;max-width:none}.detail svg{width:100%;height:auto}figcaption{font-size:12px;color:#bcc9b7;margin-top:7px}.description a{font-size:13px}body[data-mode=silhouette] [data-part=detail],body[data-mode=silhouette] [data-part=flowers],body[data-mode=flowerless] [data-part=flowers]{display:none}body[data-mode=silhouette] [data-part=body]{fill:#42613c}footer{border-top:1px solid #445044;padding-top:20px;color:#bbc9bb;font-size:14px}footer p{max-width:78ch}.note{margin-left:auto;font-size:13px;color:#bbc9bb}#mode-description{font-size:14px;color:#cfdfbc;margin:0 0 20px;min-height:23px}@media(max-width:1100px){section{grid-template-columns:minmax(150px,1fr) 300px;gap:18px}.detail{grid-column:1/-1;width:520px;max-width:100%;justify-self:center}.note{margin-left:0}}@media(max-width:560px){main{padding:24px 16px}h1{font-size:26px}section{display:flex;flex-direction:column;align-items:stretch;gap:15px}.overview{overflow-x:auto}.overview svg{margin:auto}.description p{margin-bottom:8px}.note{width:100%}.detail{width:100%}}
.botany{border-top:1px solid #445044;padding:28px 0}.botany>p{color:#bbc9bb;max-width:75ch}.species{display:flex;flex-wrap:wrap;gap:30px;justify-content:space-between}.species article{width:300px;max-width:100%;overflow-x:auto}.species h3{font-size:19px;font-weight:550;margin:14px 0 0}.species .latin{font-style:italic;font-size:13px;margin:0 0 16px}.species p{font-size:13px;color:#bbc9bb}.criteria{display:flex;flex-wrap:wrap;gap:8px 22px;list-style:none;padding:0;color:#bbc9bb;font-size:14px}.criteria li::before{content:'复用参考 · ';color:#cfdfbc}body[data-mode=silhouette] [data-part=body]{fill:#4c693e}
</style></head><body data-mode="full"><main>
<header><h1>草叶疏透，植物各有形态。</h1><p>短草沿地面交织，禾草左右弯垂，野花从各自的叶丛中生长。相同平地、相同尺度，不用厚重底座连接整组植物。</p><div class="status">Phase B v2 · 2026-10-19 已验收保留三组资产 · <a href="approved/README.md">资产记录</a></div></header>
<nav aria-label="草丛检查方式"><button data-mode="full" aria-pressed="true">完整造型</button><button data-mode="silhouette" aria-pressed="false">只看剪影</button><button data-mode="flowerless" aria-pressed="false">隐藏花朵</button><span class="note">左侧判断总览效果，右侧辅助检查细节</span></nav>
<p id="mode-description" aria-live="polite">叶片以独立封闭形状交叠，基部留有空隙。三组使用相同纯色地面。</p>
${rows.join('\n')}
<div class="botany"><h2>三种野花，三种生长结构</h2><p>每个小样左侧为 0.66 倍，右侧为 2.4 倍。乳白、暖黄、灰粉紫沿用当前保留资产；蜂箱局部混生组合已随第九轮验收，新的场景搭配仍需结合周围物件检查。</p><div class="species">${flowers.join('\n')}</div></div>
<footer><p>三组造型已按用户确认保留为当前资产基准，以下项目作为后续复用的检查参考。总览尺度以 1200 × 800 世界画布、缩放 0.66 为基准。花种的细瓣、复叶等细节主要在放大视图检查；总览优先检查植物形态与花色是否突兀。</p><ul class="criteria"><li>短草柔软疏透</li><li>禾草自然弯垂</li><li>雏菊低矮细瓣</li><li>毛茛圆润五瓣</li><li>三叶草花序与复叶</li><li>剪影互相区分</li><li>0.66 倍下成立</li></ul><p>下载同时保留带背景样板和透明 SVG 资产。原生矢量，无滤镜、噪声、随机纹理或动画。组件已整理到可复用资产目录；当前场景组合已验收并接入正式场景。</p><p><a href="/" target="_blank" rel="noopener">正式场景</a> · <a href="README.md">资产说明</a> · <a href="approved/README.md">留存与校验</a></p></footer>
</main><script>
const descriptions={full:'叶片以独立封闭形状交叠，基部留有空隙。三组使用相同纯色地面。',silhouette:'隐藏花头与内部叶纹，草叶、花梗和叶丛统一为单色。检查三组结构是否不同，基部能否透出地面。',flowerless:'只隐藏花头，保留花梗及各自的叶丛。检查野花组是否仍能与禾草组区分。'};
document.querySelectorAll('button[data-mode]').forEach(button=>button.addEventListener('click',()=>{document.body.dataset.mode=button.dataset.mode;document.querySelectorAll('button[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.getElementById('mode-description').textContent=descriptions[button.dataset.mode];}));
</script></body></html>`);
console.log(`Rendered three standalone SVGs and comparison page in ${directory}`);