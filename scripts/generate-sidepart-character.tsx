import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SeatedReferenceCharacter } from '../src/components/characters/SeatedReferenceCharacter';
import { StandingCharacter } from '../src/components/characters/StandingCharacter';
import { CHARACTER_PREVIEW_PALETTE as preview } from '../src/components/characters/characterPreviewPalette';
import type { IsoDirection4 } from '../src/utils/characterFacing';

// Render the reference's asymmetric hairstyle on existing pose components.
// The original long_wavy ID now represents the new side part and low nape tie.
const views: { direction: IsoDirection4; title: string; note: string }[] = [
  { direction: 'SE', title: '正面 · SE', note: '一侧长前发垂落，另一侧收向耳后' },
  { direction: 'SW', title: '左侧 · SW', note: '耳后侧，远侧长前发仅露窄轮廓' },
  { direction: 'NW', title: '背面 · NW', note: '紧凑后发，小发束在后颈低扎' },
  { direction: 'NE', title: '右侧 · NE', note: '长前发侧，主发片从太阳穴垂落' },
];
const panels = views.map((view, index) => {
  let markup = renderToStaticMarkup(<svg><SeatedReferenceCharacter facing={view.direction}
    hairStyle="long_wavy" hairColor="#b8afa0" /></svg>).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const prefix = `sidepart-${view.direction}`;
  for (const id of [...markup.matchAll(/id="([^"]+)"/g)].map(match => match[1])) {
    markup = markup.replaceAll(`id="${id}"`, `id="${prefix}-${id}"`).replaceAll(`url(#${id})`, `url(#${prefix}-${id})`);
  }
  const filename = ['front', 'left', 'back', 'right'][index];
  fs.writeFileSync(path.resolve(`public/character-sidepart-${filename}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-22 -40 44 48" width="220" height="240" role="img" aria-label="偏分低束发坐姿 ${view.direction}">${markup}</svg>\n`);
  const x = index % 2 === 0 ? 260 : 740;
  const floorY = index < 2 ? 449 : 869;
  return `<g data-sidepart-review="${view.direction}">
    <rect data-character-preview-background="true" x="${x - 162}" y="${floorY - 300}" width="324" height="365" rx="12" fill="${preview.background}" />
    <text x="${x}" y="${floorY - 325}" text-anchor="middle" fill="#ded4c7" font-size="18">${view.title}</text>
    <g transform="translate(${x},${floorY - 10}) scale(8)">${markup}</g>
    <text x="${x}" y="${floorY + 52}" text-anchor="middle" fill="${preview.caption}" font-size="14">${view.note}</text>
  </g>`;
}).join('');
fs.writeFileSync(path.resolve('public/character-sidepart-4views.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 980" width="100%" height="100%" role="img" aria-labelledby="sidepart-title" style="font-family:'Microsoft YaHei','Segoe UI',sans-serif">
    <title id="sidepart-title">偏分低束发 · 四朝向重绘 v16</title>
    <rect width="1000" height="980" fill="#211e1b" />
    <text x="44" y="49" fill="#f5ede2" font-size="26" font-weight="600">偏分低束发 · 四朝向重绘</text>
    <text x="44" y="82" fill="#c7b7a4" font-size="14">参考偏分长前发与后颈低束 · 两侧分别绘制 · 沿用当前帽型和身体</text>
    ${panels}
    <text x="44" y="963" fill="#c7b7a4" font-size="13">预览发色 #B8AFA0；场景继续使用角色所选发色。共享组件同步，纯 SVG 路径。</text>
  </svg>\n`);
const standingPanels = views.map((view, index) => {
  let markup = renderToStaticMarkup(<svg><StandingCharacter facing={view.direction}
    hairStyle="long_wavy" hairColor="#b8afa0" /></svg>).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const prefix = `sidepart-standing-${view.direction}`;
  for (const id of [...markup.matchAll(/id="([^"]+)"/g)].map(match => match[1])) {
    markup = markup.replaceAll(`id="${id}"`, `id="${prefix}-${id}"`).replaceAll(`url(#${id})`, `url(#${prefix}-${id})`);
  }
  const filename = ['front', 'left', 'back', 'right'][index];
  fs.writeFileSync(path.resolve(`public/character-sidepart-standing-${filename}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -50 40 56" width="240" height="336" role="img" aria-label="偏分低束发站姿 ${view.direction}">${markup}</svg>\n`);
  const x = 48 + index * 282;
  return `<g transform="translate(${x},0)">
    <rect data-character-preview-background="true" x="0" y="198" width="248" height="440" rx="12" fill="${preview.background}" />
    <text x="124" y="170" text-anchor="middle" fill="#ded4c7" font-size="18">${view.title}</text>
    <g transform="translate(124,600) scale(8)">${markup}</g>
    <text x="124" y="650" text-anchor="middle" fill="#c7b7a4" font-size="14">同一头部与偏分发 · 长袍盖脚</text>
    <text x="124" y="675" text-anchor="middle" fill="#c7b7a4" font-size="14">双手自然垂在袖口旁</text>
  </g>`;
}).join('');
fs.writeFileSync(path.resolve('public/character-sidepart-standing-4views.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" width="100%" height="100%" role="img" aria-labelledby="sidepart-standing-title" style="font-family:'Microsoft YaHei','Segoe UI',sans-serif">
    <title id="sidepart-standing-title">偏分低束发 · 长袍站姿四视图</title>
    <rect width="1200" height="760" fill="#211e1b" />
    <text x="48" y="59" fill="#f5ede2" font-size="28" font-weight="600">偏分低束发 · 长袍站立四视图</text>
    <text x="48" y="94" fill="#c7b7a4" font-size="15">与坐姿共享头部、帽型和偏分发 · 标准站高 48 · 四朝向同倍率 · 预览发色 #B8AFA0</text>
    ${standingPanels}
    <path d="M48,711 H1152" stroke="#4d3d30" />
    <text x="48" y="740" fill="#c7b7a4" font-size="14">沿用当前站姿身体与接地阴影；长发由同一头部组件绘制，场景继续使用角色所选发色。</text>
  </svg>\n`);
console.log('Generated side-parted low-tie seated/standing sheets and individual views.');
