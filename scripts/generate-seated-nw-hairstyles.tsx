import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from '@playwright/test';
import { NwFloorSeatedCharacter } from '../src/components/characters/NwFloorSeatedCharacter';
import { NW_SEATED_HEAD_ASSETS } from '../src/components/desk/nwSeatedHeadAssets';
import { FINALIZED_NW_STANDING } from '../src/components/characters/finalizedNwStandingAssets';
import { INITIAL_PEOPLE } from '../src/data/initialData';

const evidence = 'docs/architecture/metrics/SEATED-NW-HAIRSTYLES-2026-10-18';
fs.mkdirSync(evidence, { recursive: true });
// Protect current authoring inputs, rather than a historical workspace manifest
// which can include retired experiments that have since been archived.
const protectedPaths = [
  'src/components/characters/NwFloorSeatedCharacter.tsx',
  'src/components/characters/approvedNwFloorSeatedAssets.ts',
  'src/components/desk/nwSeatedHeadAssets.ts',
  'src/components/characters/finalizedNwStandingAssets.ts',
  'public/character-shorthair-seated-nw-floor-study.svg',
  'public/character-shorthair-seated-5views-study.svg',
  ...['shorthair', 'curly', 'sidepart', 'shaggy'].flatMap(id => [
    `public/character-${id}-standing-nw.svg`,
    ...['front', 'left', 'back', 'right'].map(view => `public/character-${id}-${view}.svg`),
  ]),
];
const hash = (file: string) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const inputHashes = protectedPaths.map(file => ({ file, sha256: hash(file) }));
const hairstyles = [
  { id: 'shorthair', label: '经典短发', style: 'curtain_crescent', color: '#1f1b18' },
  { id: 'curly', label: '层叠长卷发', style: 'wavy_curly', color: '#514435' },
  { id: 'sidepart', label: '偏分低束发', style: 'long_wavy', color: '#514435' },
  { id: 'shaggy', label: '双色蓬松碎发', style: 'medium_straight', color: '#e4c983' },
] as const;
function scope(svg: string, prefix: string) {
  const ids = [...new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]))];
  for (const id of ids) svg = svg.replaceAll(`id="${id}"`, `id="${prefix}-${id}"`)
    .replaceAll(`url(#${id})`, `url(#${prefix}-${id})`).replaceAll(`href="#${id}"`, `href="#${prefix}-${id}"`);
  return svg.replace(/aria-labelledby="([^"]+)"/g, (_, value: string) =>
    `aria-labelledby="${value.split(' ').map(id => ids.includes(id) ? `${prefix}-${id}` : id).join(' ')}"`);
}
const inner = (svg: string) => svg.replace(/^<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const views = [['front', '正面'], ['left', '左侧'], ['back', '背面'], ['right', '右侧'], ['nw', 'NW 斜侧']] as const;
const assets = hairstyles.map(hair => {
  assert.equal(NW_SEATED_HEAD_ASSETS[hair.id].sourceSha256, FINALIZED_NW_STANDING.heads[hair.id].sourceSha256);
  const filename = `character-${hair.id}-seated-nw-floor-study.svg`;
  const person = { ...INITIAL_PEOPLE[0], skinColor: '#f5d6be', beanieColor: '#425b6e',
    hairColor: hair.color, shirtColor: '#e07a5f', hairStyle: hair.style, hasPompom: true };
  // The approved short-haired export is read unchanged. Every new hairstyle uses
  // exactly the same body component, head anchor and uniform scale.
  const svg = hair.id === 'shorthair' ? fs.readFileSync(`public/${filename}`, 'utf8') : renderToStaticMarkup(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-22 -40 44 48" width="220" height="240"
      role="img" aria-labelledby="nw-floor-title nw-floor-description">
      <title id="nw-floor-title">{`${hair.label} · NW 收腿坐姿`}</title>
      <desc id="nw-floor-description">共用短发定稿坐姿身体，配用对应的定稿 NW 站姿头部与发型。</desc>
      <NwFloorSeatedCharacter person={person} />
    </svg>) + '\n';
  if (hair.id !== 'shorthair') {
    fs.writeFileSync(`public/${filename}`, svg);
    const panels = views.map(([direction, label], i) => {
      const content = scope(inner(direction === 'nw' ? svg : fs.readFileSync(`public/character-${hair.id}-${direction}.svg`, 'utf8')), `seated-five-${hair.id}-${direction}`);
      return `<g data-view="${direction}" transform="translate(${24 + i * 236},0)"><text x="110" y="106" text-anchor="middle" fill="#e5d9cb" font-size="16">${label}</text><rect x="0" y="124" width="220" height="290" rx="10" fill="#ddd8cf"/><svg x="0" y="124" width="220" height="290" viewBox="-22 -40 44 48">${content}</svg></g>`;
    }).join('');
    fs.writeFileSync(`public/character-${hair.id}-seated-5views-study.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="1220" height="450" viewBox="0 0 1220 450" role="img" aria-label="${hair.label}坐姿四视图加NW" style="font-family:'Microsoft YaHei',sans-serif"><rect width="1220" height="450" fill="#211e1b"/><text x="24" y="40" fill="#f5ede2" font-size="24">${hair.label} · 坐姿四视图 + NW</text><text x="24" y="70" fill="#c7b7a4" font-size="14">原四图保持 · NW 共用定稿身体及对应头部</text>${panels}</svg>\n`);
  }
  return { ...hair, filename, svg };
});
const figures = assets.map(hair => `<figure data-hairstyle="${hair.id}"><figcaption>${hair.label}${hair.id === 'shorthair' ? ' · 已定稿基准' : ''}</figcaption>${scope(hair.svg, `review-${hair.id}`)}<nav><a href="/${hair.filename}" download>下载 NW SVG</a><a href="/character-${hair.id}-seated-5views-study.svg" target="_blank" rel="noreferrer">坐姿五方向</a></nav></figure>`).join('');
const review = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>四款发型 · NW 收腿坐姿</title><style>*{box-sizing:border-box}body{margin:0;background:#211e1b;color:#f5ede2;font:15px/1.65 'Microsoft YaHei',sans-serif}main{max-width:1240px;margin:auto;padding:28px}h1{font-size:24px;margin:0 0 8px}p{color:#c7b7a4;margin:8px 0 24px;max-width:70ch}.views{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}figure{margin:0;min-width:0}figcaption{padding:0 0 12px}figure svg{display:block;width:100%;height:auto;background:#ddd8cf;border-radius:10px}nav{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px}a{color:#f0c394;text-underline-offset:4px}a:focus-visible{outline:2px solid #f0c394;outline-offset:4px}@media(max-width:680px){main{padding:18px}h1{font-size:21px}.views{grid-template-columns:repeat(2,minmax(0,1fr))}}</style><main><h1>四款发型 · NW 收腿坐姿</h1><p>共用短发已定稿的收腿坐姿身体，搭配各自已定稿的 NW 头部与发型。四款使用相同的身体、头部位置与缩放；新增三款组合待视觉审阅。</p><div class="views">${figures}</div></main></html>`;
fs.writeFileSync('public/character-seated-nw-review.html', review);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1240, height: 620 }, deviceScaleFactor: 1 });
  await page.setContent(review);
  const result = await page.evaluate<{
    duplicateIds: number; missingRefs: string[]; bodiesEqual: boolean; scalesEqual: boolean;
    heads: { hairstyle: string; transform: string }[]; invalid: number;
  }>(`(() => {
    const ids = [...document.querySelectorAll('[id]')].map(n => n.id);
    const figures = [...document.querySelectorAll('figure')];
    const body = f => f.querySelector('[data-character-pose]').firstElementChild.innerHTML.replace(/review-(shorthair|curly|sidepart|shaggy)-/g, '').replace(/nw-floor-seated-[\\w-]+/g, 'BODY_PREFIX');
    const transform = f => f.querySelector('[data-character-pose]').getAttribute('transform');
    return { duplicateIds: ids.length - new Set(ids).size,
      missingRefs: [...document.querySelectorAll('*')].flatMap(n => [...n.attributes].flatMap(a => [...a.value.matchAll(/url\\(#([^)]*)\\)/g)].filter(m => !ids.includes(m[1])).map(m => m[1]))),
      bodiesEqual: figures.every(f => body(f) === body(figures[0])),
      scalesEqual: figures.every(f => transform(f) === transform(figures[0])),
      heads: figures.map(f => ({ hairstyle: f.querySelector('[data-nw-hairstyle]').getAttribute('data-nw-hairstyle'), transform: f.querySelector('[data-windsor-head]').getAttribute('transform') })),
      invalid: document.querySelectorAll('image,foreignObject,script,parsererror').length };
  })()`);
  assert.equal(result.duplicateIds, 0); assert.deepEqual(result.missingRefs, []);
  assert.ok(result.bodiesEqual); assert.ok(result.scalesEqual); assert.equal(result.invalid, 0);
  assert.ok(result.heads.every(h => h.transform === result.heads[0].transform));
  assert.deepEqual(result.heads.map(h => h.hairstyle), hairstyles.map(h => h.id));
  fs.writeFileSync(`${evidence}/geometry-verification.json`, JSON.stringify(result, null, 2));
  await page.screenshot({ path: `${evidence}/four-seated-nw.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.screenshot({ path: `${evidence}/review-390.png`, fullPage: true });
} finally { await browser.close(); }
for (const input of inputHashes) assert.equal(hash(input.file), input.sha256, input.file);
fs.writeFileSync(`${evidence}/protection.json`, JSON.stringify({ checked: inputHashes.length, allUnchanged: true }, null, 2));
console.log('Generated three NW seated exports, three five-view sheets and four-hairstyle review; protected assets unchanged.');
