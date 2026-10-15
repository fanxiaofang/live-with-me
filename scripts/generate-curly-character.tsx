import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SeatedReferenceCharacter } from '../src/components/characters/SeatedReferenceCharacter';
import { StandingCharacter } from '../src/components/characters/StandingCharacter';
import { CHARACTER_PREVIEW_PALETTE as preview } from '../src/components/characters/characterPreviewPalette';
import type { IsoDirection4 } from '../src/utils/characterFacing';

// Review the real shared head on the accepted seated body; no raster reference
// is embedded, and the reference's body/hat geometry is not copied.
const views: { direction: IsoDirection4; title: string; note: string }[] = [
  { direction: 'SE', title: '正面 · SE', note: '分束帽下发丝，脸侧卷梢自然展开' },
  { direction: 'SW', title: '左侧 · SW', note: '脸侧内弯，后侧长发层叠外翻' },
  { direction: 'NW', title: '背面 · NW', note: '后背长卷发，不绘制前额刘海' },
  { direction: 'NE', title: '右侧 · NE', note: '同一发型对应转向，保留圆手与袍摆' },
];
const panels = views.map((view, index) => {
  let markup = renderToStaticMarkup(<svg><SeatedReferenceCharacter facing={view.direction}
    hairStyle="wavy_curly" hairColor="#57483d" /></svg>).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const prefix = `curly-${view.direction}`;
  for (const id of [...markup.matchAll(/id="([^"]+)"/g)].map(match => match[1])) {
    markup = markup.replaceAll(`id="${id}"`, `id="${prefix}-${id}"`).replaceAll(`url(#${id})`, `url(#${prefix}-${id})`);
  }
  const filename = ['front', 'left', 'back', 'right'][index];
  fs.writeFileSync(path.resolve(`public/character-curly-${filename}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-22 -40 44 48" width="220" height="240" role="img" aria-label="层叠长卷发坐姿 ${view.direction}">${markup}</svg>\n`);
  const x = index % 2 === 0 ? 260 : 740;
  const floorY = index < 2 ? 449 : 869;
  return `<g data-curly-review="${view.direction}">
    <rect data-character-preview-background="true" x="${x - 162}" y="${floorY - 300}" width="324" height="365" rx="12" fill="${preview.background}" />
    <text x="${x}" y="${floorY - 325}" text-anchor="middle" fill="#ded4c7" font-size="18">${view.title}</text>
    <g transform="translate(${x},${floorY - 10}) scale(8)">${markup}</g>
    <text x="${x}" y="${floorY + 52}" text-anchor="middle" fill="${preview.caption}" font-size="14">${view.note}</text>
  </g>`;
}).join('');
fs.writeFileSync(path.resolve('public/character-curly-4views.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 980" width="100%" height="100%" role="img" aria-labelledby="curly-title" style="font-family:'Microsoft YaHei','Segoe UI',sans-serif">
    <title id="curly-title">层叠长卷发 · 四朝向重绘 v13</title>
    <rect width="1000" height="980" fill="#211e1b" />
    <text x="44" y="49" fill="#f5ede2" font-size="26" font-weight="600">长卷发 · 四朝向重绘</text>
    <text x="44" y="82" fill="#c7b7a4" font-size="14">仅参考卷发结构 · 替换短发月牙刘海 · 沿用当前帽型、头身和坐姿</text>
    ${panels}
    <text x="44" y="963" fill="#c7b7a4" font-size="13">预览发色 #57483D；场景继续使用角色所选发色。共享组件同步，纯 SVG 路径。</text>
  </svg>\n`);
const standingPanels = views.map((view, index) => {
  let markup = renderToStaticMarkup(<svg><StandingCharacter facing={view.direction}
    hairStyle="wavy_curly" hairColor="#57483d" /></svg>).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const prefix = `curly-standing-${view.direction}`;
  for (const id of [...markup.matchAll(/id="([^"]+)"/g)].map(match => match[1])) {
    markup = markup.replaceAll(`id="${id}"`, `id="${prefix}-${id}"`).replaceAll(`url(#${id})`, `url(#${prefix}-${id})`);
  }
  const filename = ['front', 'left', 'back', 'right'][index];
  fs.writeFileSync(path.resolve(`public/character-curly-standing-${filename}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -50 40 56" width="240" height="336" role="img" aria-label="层叠长卷发站姿 ${view.direction}">${markup}</svg>\n`);
  const x = 48 + index * 282;
  return `<g transform="translate(${x},0)">
    <rect data-character-preview-background="true" x="0" y="198" width="248" height="440" rx="12" fill="${preview.background}" />
    <text x="124" y="170" text-anchor="middle" fill="#ded4c7" font-size="18">${view.title}</text>
    <g transform="translate(124,600) scale(8)">${markup}</g>
    <text x="124" y="650" text-anchor="middle" fill="#c7b7a4" font-size="14">同一头部与卷发 · 长袍盖脚</text>
    <text x="124" y="675" text-anchor="middle" fill="#c7b7a4" font-size="14">双手自然垂在袖口旁</text>
  </g>`;
}).join('');
fs.writeFileSync(path.resolve('public/character-curly-standing-4views.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" width="100%" height="100%" role="img" aria-labelledby="curly-standing-title" style="font-family:'Microsoft YaHei','Segoe UI',sans-serif">
    <title id="curly-standing-title">层叠长卷发 · 长袍站姿四视图</title>
    <rect width="1200" height="760" fill="#211e1b" />
    <text x="48" y="59" fill="#f5ede2" font-size="28" font-weight="600">层叠长卷发 · 长袍站立四视图</text>
    <text x="48" y="94" fill="#c7b7a4" font-size="15">与坐姿共享头部、帽型和卷发 · 标准站高 48 · 四朝向同倍率 · 预览发色 #57483D</text>
    ${standingPanels}
    <path d="M48,711 H1152" stroke="#4d3d30" />
    <text x="48" y="740" fill="#c7b7a4" font-size="14">沿用当前站姿身体与接地阴影；长发由同一头部组件绘制，场景继续使用角色所选发色。</text>
  </svg>\n`);
console.log('Generated layered curly seated/standing sheets and individual views.');
