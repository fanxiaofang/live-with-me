import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SeatedReferenceCharacter } from '../src/components/characters/SeatedReferenceCharacter';
import { StandingCharacter } from '../src/components/characters/StandingCharacter';
import { CHARACTER_PREVIEW_PALETTE as preview } from '../src/components/characters/characterPreviewPalette';
import type { IsoDirection4 } from '../src/utils/characterFacing';

// Render the reference's feathered top and dark nape on existing pose components.
// Preserve the old medium_straight ID so saved appearances use the replacement.
const views: { direction: IsoDirection4; title: string; note: string }[] = [
  { direction: 'SE', title: '正面 · SE', note: '帽下错落碎刘海，两侧轻轻外翘' },
  { direction: 'SW', title: '左侧 · SW', note: '侧前发束分层，后颈深色短发' },
  { direction: 'NW', title: '背面 · NW', note: '浅色碎发覆在深色后颈底发上' },
  { direction: 'NE', title: '右侧 · NE', note: '与左侧对应，保持两层短碎发' },
];
const panels = views.map((view, index) => {
  let markup = renderToStaticMarkup(<svg><SeatedReferenceCharacter facing={view.direction}
    hairStyle="medium_straight" hairColor="#e4c983" /></svg>).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const prefix = `shaggy-${view.direction}`;
  for (const id of [...markup.matchAll(/id="([^"]+)"/g)].map(match => match[1])) {
    markup = markup.replaceAll(`id="${id}"`, `id="${prefix}-${id}"`).replaceAll(`url(#${id})`, `url(#${prefix}-${id})`);
  }
  const filename = ['front', 'left', 'back', 'right'][index];
  fs.writeFileSync(path.resolve(`public/character-shaggy-${filename}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-22 -40 44 48" width="220" height="240" role="img" aria-label="双色蓬松碎发坐姿 ${view.direction}">${markup}</svg>\n`);
  const x = index % 2 === 0 ? 260 : 740;
  const floorY = index < 2 ? 449 : 869;
  return `<g data-shaggy-review="${view.direction}">
    <rect data-character-preview-background="true" x="${x - 162}" y="${floorY - 300}" width="324" height="365" rx="12" fill="${preview.background}" />
    <text x="${x}" y="${floorY - 325}" text-anchor="middle" fill="#ded4c7" font-size="18">${view.title}</text>
    <g transform="translate(${x},${floorY - 10}) scale(8)">${markup}</g>
    <text x="${x}" y="${floorY + 52}" text-anchor="middle" fill="${preview.caption}" font-size="14">${view.note}</text>
  </g>`;
}).join('');
fs.writeFileSync(path.resolve('public/character-shaggy-4views.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 980" width="100%" height="100%" role="img" aria-labelledby="shaggy-title" style="font-family:'Microsoft YaHei','Segoe UI',sans-serif">
    <title id="shaggy-title">双色蓬松碎发 · 四朝向重绘 v17</title>
    <rect width="1000" height="980" fill="#211e1b" />
    <text x="44" y="49" fill="#f5ede2" font-size="26" font-weight="600">双色蓬松碎发 · 四朝向重绘</text>
    <text x="44" y="82" fill="#c7b7a4" font-size="14">参考蓬松碎刘海与深色后颈底发 · 四朝向同倍率 · 沿用当前帽型和身体</text>
    ${panels}
    <text x="44" y="963" fill="#c7b7a4" font-size="13">预览发色 #E4C983；场景继续使用角色所选发色。共享组件同步，纯 SVG 路径。</text>
  </svg>\n`);
const standingPanels = views.map((view, index) => {
  let markup = renderToStaticMarkup(<svg><StandingCharacter facing={view.direction}
    hairStyle="medium_straight" hairColor="#e4c983" /></svg>).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const prefix = `shaggy-standing-${view.direction}`;
  for (const id of [...markup.matchAll(/id="([^"]+)"/g)].map(match => match[1])) {
    markup = markup.replaceAll(`id="${id}"`, `id="${prefix}-${id}"`).replaceAll(`url(#${id})`, `url(#${prefix}-${id})`);
  }
  const filename = ['front', 'left', 'back', 'right'][index];
  fs.writeFileSync(path.resolve(`public/character-shaggy-standing-${filename}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -50 40 56" width="240" height="336" role="img" aria-label="双色蓬松碎发站姿 ${view.direction}">${markup}</svg>\n`);
  const x = 48 + index * 282;
  return `<g transform="translate(${x},0)">
    <rect data-character-preview-background="true" x="0" y="198" width="248" height="440" rx="12" fill="${preview.background}" />
    <text x="124" y="170" text-anchor="middle" fill="#ded4c7" font-size="18">${view.title}</text>
    <g transform="translate(124,600) scale(8)">${markup}</g>
    <text x="124" y="650" text-anchor="middle" fill="#c7b7a4" font-size="14">同一头部与碎发 · 长袍盖脚</text>
    <text x="124" y="675" text-anchor="middle" fill="#c7b7a4" font-size="14">双手自然垂在袖口旁</text>
  </g>`;
}).join('');
fs.writeFileSync(path.resolve('public/character-shaggy-standing-4views.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" width="100%" height="100%" role="img" aria-labelledby="shaggy-standing-title" style="font-family:'Microsoft YaHei','Segoe UI',sans-serif">
    <title id="shaggy-standing-title">双色蓬松碎发 · 长袍站姿四视图</title>
    <rect width="1200" height="760" fill="#211e1b" />
    <text x="48" y="59" fill="#f5ede2" font-size="28" font-weight="600">双色蓬松碎发 · 长袍站立四视图</text>
    <text x="48" y="94" fill="#c7b7a4" font-size="15">与坐姿共享头部、帽型和碎发 · 标准站高 48 · 四朝向同倍率 · 预览发色 #E4C983</text>
    ${standingPanels}
    <path d="M48,711 H1152" stroke="#4d3d30" />
    <text x="48" y="740" fill="#c7b7a4" font-size="14">沿用当前站姿身体与接地阴影；长发由同一头部组件绘制，场景继续使用角色所选发色。</text>
  </svg>\n`);
console.log('Generated two-tone shaggy seated/standing sheets and individual views.');
