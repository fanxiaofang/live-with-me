import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from '@playwright/test';
import { SofaWorkChair } from '../src/components/desk/SofaWorkChair';
import { AtticDesk } from '../src/components/desk/AtticDesk';
import { DeskWorkstations } from '../src/components/desk/DeskWorkstations';
import { DEFAULT_ROOM_LAYOUT as layout } from '../src/components/layout-gizmo/layoutStore';
import { INITIAL_PEOPLE } from '../src/data/initialData';
import { DeskFrame } from '../src/components/desk/DeskFrame';
import { LaptopDisplay } from '../src/components/desk/DeskItems';

const evidence = 'docs/architecture/metrics/SOFA-CHAIR-NW-2026-10-16/v2';
fs.mkdirSync(evidence, { recursive: true });
const person = { ...INITIAL_PEOPLE[0], currentState: 'coding' as const, shirtColor: '#c98669',
  beanieColor: '#425b6e', hairColor: '#514435' };
const shadow = <defs><filter id="softShadow"><feGaussianBlur stdDeviation=".7" /></filter></defs>;
const svg = (children: React.ReactNode, bounds = '-21 -36 43 62') =>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox={bounds} role="img">{children}</svg>;
const cards = (['club', 'recliner'] as const).map((variant, i) => {
  const title = i === 0 ? 'A · 苔绿方扶手沙发椅' : 'B · 烟蓝高背电竞沙发椅';
  return <section key={variant}><h2>{title}</h2><p>{i === 0
    ? '参考 1：低靠背与实体侧板，肩背露出较多。' : '参考 3：厚扶手与高靠背，更大范围遮挡腰背。'}</p>
    <div className="pair">{[false, true].map(seated => {
      const content = svg(<SofaWorkChair interactive={false} variant={variant} isSeated={seated} occupant={person} />);
      const file = `sofa-chair-${variant}-${seated ? 'occupied' : 'empty'}.svg`;
      fs.writeFileSync(`public/${file}`, renderToStaticMarkup(content));
      return <figure key={String(seated)}><figcaption>{seated ? 'NW 上身入椅' : '空椅'}</figcaption>{content}
        <a href={`/${file}`} download>下载 SVG</a></figure>;
    })}</div></section>;
});
const desk = svg(<g>{shadow}<AtticDesk layout={layout} /><DeskWorkstations layout={layout} relativeToDesk occupants={{
  desk_workstation: person, desk_workstation_secondary: { ...person, id: 'sofa-study-second', shirtColor: '#d7b285' },
}} /></g>, '-61 -41 126 88');
const focus = <section className="focus"><h2>A 款结构与桌前手臂</h2>
  <p>先看完整空沙发，再看同一人物的桌前关系。近手放在桌面上，远手靠近键盘。</p>
  <div className="pair"><figure><figcaption>完整空沙发</figcaption>{svg(<SofaWorkChair interactive={false} />, '-26 -33 54 63')}</figure>
    <figure><figcaption>单人桌前放大</figcaption>{svg(<g>{shadow}
    <g transform="translate(1,-10.6)"><DeskFrame><g transform="translate(-1,3.6)"><LaptopDisplay instance="-focus" /></g></DeskFrame></g>
      <SofaWorkChair interactive={false} isSeated occupant={person} />
    </g>, '-26 -33 54 63')}</figure></div>
</section>;
const markup = renderToStaticMarkup(<main><h1>沙发椅 · 结构与手臂修订</h1>
  <p>完整底座连接扶手和靠背；裁掉原站姿垂袖，重画肩、肘和前臂。保留定稿 NW 头部与躯干比例。本轮为修订试样。</p>
  {focus}
  <div className="chairs">{cards}</div><section className="desk"><h2>放回同一张桌子</h2>
    <p>双人示意：实际桌椅位置与键盘锚点。左侧 A，右侧 B。</p>{desk}</section>
  <footer>原温莎椅、复古椅 SVG 组件保留，可在项目的「原椅保留对比」中查看。此页面的示例不修改实际人物或保存布局。</footer></main>);
let svgIndex = 0;
const scopedMarkup = markup.replace(/<svg\b[\s\S]*?<\/svg>/g, original => {
  const prefix = `sofa-review-${++svgIndex}-`;
  const ids = new Set([...original.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  return original.replace(/\bid="([^"]+)"/g, (_, id) => `id="${prefix}${id}"`)
    .replace(/url\(#([^)]+)\)/g, (match, id) => ids.has(id) ? `url(#${prefix}${id})` : match);
});
const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>沙发椅 NW 对照</title><style>
*{box-sizing:border-box}body{margin:0;background:#241b16;color:#eee2d3;font:15px/1.7 'Microsoft YaHei',sans-serif}main{max-width:1280px;margin:auto;padding:24px}h1{font-size:24px;margin:0 0 8px}h2{font-size:18px;margin:0}p{color:#d1bca5;margin:8px 0 16px;max-width:76ch}.chairs{display:grid;grid-template-columns:1fr 1fr;gap:24px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:12px}figure{margin:0}figcaption{margin-bottom:8px}svg{display:block;width:100%;background:#ddd8cf;border-radius:8px}a{color:#e7bb86;display:inline-block;margin:8px 0}section{min-width:0}.desk{margin-top:24px}.desk svg{max-height:640px}footer{color:#d1bca5;margin-top:20px}@media(max-width:700px){main{padding:16px}.chairs{grid-template-columns:1fr}h1{font-size:21px}}
</style>${scopedMarkup}</html>`;
fs.writeFileSync('public/sofa-chair-nw-review.html', html);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1060 } });
  await page.setContent(html);
  await page.locator('.focus').screenshot({ path: `${evidence}/single-chair-and-desk.png` });
  await page.locator('.chairs').screenshot({ path: `${evidence}/two-chair-comparison.png` });
  await page.locator('.desk').screenshot({ path: `${evidence}/desk-two-samples.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `${evidence}/review-390.png`, fullPage: true });
} finally { await browser.close(); }
console.log(`Saved public/sofa-chair-nw-review.html and SVG exports; screenshots in ${evidence}`);
