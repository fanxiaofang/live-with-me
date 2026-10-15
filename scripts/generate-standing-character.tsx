import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StandingCharacter } from '../src/components/characters/StandingCharacter';
import { SeatedReferenceCharacter } from '../src/components/characters/SeatedReferenceCharacter';
import { TimberFlooring } from '../src/components/architecture/TimberFlooring';
import { YorkshireDefs } from '../src/components/scenery/yorkshire/landscapeTheme';
import { COUNTRYSIDE_THEMES } from '../src/world/theme/worldTheme';
import { STANDING_CHARACTER_PROPORTIONS as proportions, CHARACTER_WORLD_SIZE as size, SEATED_SIDE_ROBE, SEATED_SIDE_HEIGHT } from '../src/components/characters/characterProportions';
import { CHARACTER_GROUND_ANGLE, characterPoint, referenceGroundPoint } from '../src/components/characters/characterProjection';
import type { IsoDirection4 } from '../src/utils/characterFacing';
import { CHARACTER_PREVIEW_PALETTE as preview } from '../src/components/characters/characterPreviewPalette';

// Regenerate the same pose components used by the scene with node --import tsx scripts/generate-standing-character.tsx.
const headDiameter = (size.headRadius * 2).toFixed(2);
const views: { file: string; direction: IsoDirection4; title: string; note: string }[] = [
  { file: 'front', direction: 'SE', title: '01 · 正面 Front', note: '自然落肩，双手垂在袖口旁' },
  { file: 'left', direction: 'SW', title: '02 · 左侧 Left', note: '前缘在左，近袖覆盖侧面衣片' },
  { file: 'back', direction: 'NW', title: '03 · 背面 Back', note: '后领与背缝，保留短发发际' },
  { file: 'right', direction: 'NE', title: '04 · 右侧 Right', note: '前缘在右，远侧手臂被袍身遮挡' },
];
function scopedResources(markup: string, prefix: string) {
  const ids = [...markup.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
  return ids.reduce((output, id) => output.replaceAll(`id="${id}"`, `id="${prefix}-${id}"`)
    .replaceAll(`url(#${id})`, `url(#${prefix}-${id})`), markup);
}
function svgMarkup(content: React.ReactNode) {
  return renderToStaticMarkup(<svg>{content}</svg>).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
}
function character(direction: IsoDirection4, prefix: string, seated = false) {
  return scopedResources(svgMarkup(seated ? <SeatedReferenceCharacter facing={direction} /> : <StandingCharacter facing={direction} />), prefix);
}
const directory = path.resolve('public');
for (const view of views) {
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -50 40 56" width="240" height="336" role="img" aria-labelledby="standing-title standing-description">
  <title id="standing-title">短发毛线帽小人 · 长袍站姿 · ${view.direction}</title>
  <desc id="standing-description">统一头圆直径${headDiameter}，站姿含帽总高约48，约3.2头身；长袍下摆盖住腿脚，落地锚点为0,0。${view.note}。</desc>
  ${character(view.direction, view.file)}
</svg>\n`;
  fs.writeFileSync(path.join(directory, `character-shorthair-standing-${view.file}.svg`), markup);
}
const panels = views.map((view, index) => {
  const x = 48 + index * 282;
  return `<g transform="translate(${x},205)">
    <text x="0" y="0" fill="#f5ede2" font-size="18" font-weight="600">${view.title}</text>
    <text x="0" y="26" fill="#d1a582" font-size="13">${view.direction} 朝向 · 长袍遮脚</text>
    <path d="M0,48 H248" stroke="#4d3d30" />
    <rect data-character-preview-background="true" x="0" y="95" width="248" height="345" rx="12" fill="${preview.background}" />
    <g stroke="#a08a75" stroke-opacity="0.28" stroke-width="0.8" stroke-dasharray="3 5">
      <path d="M8,${410 - 27 * size.authoringScale * 6} H240 M8,${410 + proportions.shoulderY * size.authoringScale * 6} H240 M8,410 H240" />
    </g>
    <g transform="translate(124,410) scale(6)">${character(view.direction, `sheet-${view.file}`)}</g>
    <path d="M8,410 H240" stroke="#a08a75" stroke-width="1" />
    <text x="0" y="455" fill="#d6c6b4" font-size="13">${view.note}</text>
    <text x="0" y="478" fill="#d6c6b4" font-size="13">袍身自然垂坠，无外露鞋脚</text>
  </g>`;
}).join('\n');
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 780" width="1200" height="780" role="img" aria-labelledby="sheet-title sheet-description" style="font-family:'Microsoft YaHei','Segoe UI',sans-serif">
  <title id="sheet-title">短发毛线帽小人 · 长袍站立四视图</title>
  <desc id="sheet-description">站高约48场景单位，头圆直径${headDiameter}，约3.2头身，与坐姿共享头部大小和色板。保留当前轮廓、刘海与袖子遮挡。落地锚点0,0，四个朝向同倍率展示。</desc>
  <rect width="1200" height="780" fill="#171412" />
  <text x="48" y="59" fill="#f5ede2" font-size="28" font-weight="600">经典短发毛线帽小人 · 长袍站立四视图</text>
  <text x="48" y="93" fill="#d6c6b4" font-size="15">比例样例 v9 · 标准站高 48 场景单位 · 圆手与袖口统一 · 同头大小坐姿 · 长袍盖脚</text>
  <g transform="translate(48,129)">
    <rect width="22" height="22" rx="4" fill="#425b6e" /><text x="32" y="17" fill="#d6c6b4" font-size="14">毛线帽 #425B6E</text>
    <rect x="230" width="22" height="22" rx="4" fill="#1f1b18" stroke="#706252" /><text x="262" y="17" fill="#d6c6b4" font-size="14">短发 #1F1B18</text>
    <rect x="460" width="22" height="22" rx="4" fill="#f5d6be" /><text x="492" y="17" fill="#d6c6b4" font-size="14">肤色 #F5D6BE</text>
    <rect x="690" width="22" height="22" rx="4" fill="#e07a5f" /><text x="722" y="17" fill="#d6c6b4" font-size="14">长袍 #E07A5F</text>
  </g>
  ${panels}
  <path d="M48,710 H1152" stroke="#4d3d30" />
  <text x="48" y="738" fill="#d6c6b4" font-size="14">头圆直径 ${headDiameter} · 袖口 y ≈ −14.08 · 袍摆正背宽 19.2 / 侧宽 14.08 · 四朝向同倍率</text>
  <text x="48" y="762" fill="#d6c6b4" font-size="13">头与衣服自然衔接；正背面使用连续衣服轮廓和淡领缝。地面参照为 ±${CHARACTER_GROUND_ANGLE.toFixed(2)}°。</text>
</svg>\n`;
fs.writeFileSync(path.join(directory, 'character-shorthair-standing-4views.svg'), sheet);
// Preserve the seated paths, normalize their dimensions and floor anchor.
for (const view of views) fs.writeFileSync(path.join(directory, `character-shorthair-${view.file}.svg`),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-22 -40 44 48" width="220" height="240" role="img" aria-label="经典短发毛线帽小人坐姿 ${view.direction}">${character(view.direction, `seated-${view.file}`, true)}</svg>\n`);

function replaceGroup(source: string, id: string, content: string) {
  const start = source.indexOf(`<g id="${id}"`);
  if (start < 0) throw new Error(`Missing original seated view ${id}`);
  const tags = /<\/?g\b[^>]*>/g; tags.lastIndex = start;
  let depth = 0, match: RegExpExecArray | null;
  while ((match = tags.exec(source))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return source.slice(0, start) + content + source.slice(tags.lastIndex);
  }
  throw new Error(`Unclosed seated view ${id}`);
}
const seatedFile = path.join(directory, 'character-shorthair-4views.svg');
let seatedSheet = fs.readFileSync(seatedFile, 'utf8');
// The original seated sheet is its own template. Replace these presentation
// backdrops idempotently, leaving the exported character groups untouched.
seatedSheet = seatedSheet.replace(/\s*<rect data-character-preview-background="true"[^>]*\/>/g, '')
  .replaceAll('<!-- Floor Podium / Axis -->',
    `<rect data-character-preview-background="true" x="8" y="124" width="189" height="202" rx="8" fill="${preview.background}" />\n    <!-- Floor Podium / Axis -->`);
for (const view of views) seatedSheet = replaceGroup(seatedSheet, `char-${view.file}-view`,
  `<g id="char-${view.file}-view" transform="translate(102, 292) scale(4)">${character(view.direction, `seated-sheet-${view.file}`, true)}</g>`);
seatedSheet = seatedSheet.replace(/规范版本：v2\.\d+/, '规范版本：v2.11')
  .replace('2.5D 轴测透视 (2:1 Isometric Ratio)', '手绘人物四朝向 · 地面参照 ±15.81°')
  .replaceAll('M 52 275 L 102 250 L 152 275 L 102 300 Z', 'M52 292 L102 277.846 L152 292 L102 306.154 Z')
  .replace('• 侧脸线条圆润饱满，消除压扁感', '• 侧面收窄，胸腹与后背保持圆润')
  .replace('• 额侧探出一抹纤细月牙发梢(非墨镜)', '• 近侧袖前屈，手轻放在前方膝上')
  .replace('• 帽身前高后低自然扣住后枕骨', '• 帽型、刘海与头肩连接沿用当前版本')
  .replace('• 右侧视角对称渲染，动态自然平衡', '• 与左侧共享身体轮廓，镜像转向')
  .replace('• 适配 2.5D 轴测图右上走廊/窗台朝向', '• 前膝与近侧袖共同表达朝向')
  .replace('• 轮廓与空间几何体 100% 严密对齐', '• 同头大小、同坐高，身体保持体积');
seatedSheet = seatedSheet.replace('• 侧面收窄，胸腹与后背保持圆润', '• 胸腹舒展，前后轮廓表达侧身')
  .replace('• 近侧袖前屈，手轻放在前方膝上', '• 圆手轻放膝面，袖线短而浅')
  .replace('• 同头大小、同坐高，身体保持体积', '• 同头大小，宽扁袍摆自然贴地');
fs.writeFileSync(seatedFile, seatedSheet);

const extraSheet = (title: string, subtitle: string, content: string, footer: string, height = 700) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 ${height}" width="1200" height="${height}" role="img" aria-labelledby="extra-title" style="font-family:'Microsoft YaHei','Segoe UI',sans-serif">
  <title id="extra-title">${title}</title><rect width="1200" height="${height}" fill="#171412" />
  <text x="48" y="59" fill="#f5ede2" font-size="27" font-weight="600">${title}</text>
  <text x="48" y="94" fill="#d6c6b4" font-size="15">${subtitle}</text>
  ${content}<path d="M48,${height - 65} H1152" stroke="#4d3d30" />
  <text x="48" y="${height - 36}" fill="#d6c6b4" font-size="14">${footer}</text></svg>\n`;
const comparison = views.map((view, index) => {
  const x = 48 + index * 282;
  const seatedGround = view.direction === 'SW' || view.direction === 'NE' ? SEATED_SIDE_ROBE.groundY : 8;
  return `<g transform="translate(${x},0)"><text x="0" y="169" fill="#f5ede2" font-size="18">${view.title}</text>
  <text x="28" y="213" fill="#d6c6b4" font-size="14">坐姿</text><text x="153" y="213" fill="#d6c6b4" font-size="14">站姿</text>
  <rect data-character-preview-background="true" x="0" y="240" width="248" height="300" rx="12" fill="${preview.background}" />
  <path d="M8,320 H240" stroke="#a08a75" stroke-opacity="0.3" stroke-dasharray="3 5" />
  <g transform="translate(62,${320 + (14 + seatedGround) * size.authoringScale * 5}) scale(5)">${character(view.direction, `comparison-seated-${view.file}`, true)}</g>
  <g transform="translate(188,${320 + 34 * size.authoringScale * 5}) scale(5)">${character(view.direction, `comparison-standing-${view.file}`)}</g>
  <text x="0" y="554" fill="#d6c6b4" font-size="13">头圆同为 ${headDiameter}，图中倍率 5×</text>
  <text x="0" y="578" fill="#d6c6b4" font-size="13">横线对齐头心，比较肩颈与体型</text></g>`;
}).join('');
fs.writeFileSync(path.join(directory, 'character-shorthair-proportion-comparison.svg'), extraSheet(
  '坐姿与站姿 · 同头大小对照', `v11 · 用户手绘侧坐 · 站高 48 / 侧坐 ${SEATED_SIDE_HEIGHT.toFixed(1)} / 正背坐姿 35.2 · 同头大小`, comparison,
  '两种姿态保持相同头部大小。坐姿折叠身体，站姿自然垂落长袍；两者均以地面接触点为锚点。', 680));

// A light background exposes gaps and heavy shadows that dark sheets can hide.
const contactPanels = views.filter(view => view.file === 'left' || view.file === 'right').map((view, index) => {
  const x = 225 + index * 450;
  return `<g data-contact-review="${view.direction}">
    <text x="${x}" y="128" text-anchor="middle" fill="#66564c" font-size="17">${view.direction === 'SW' ? '左侧 · SW' : '右侧 · NE'}</text>
    <g transform="translate(${x},472) scale(9)">${character(view.direction, `contact-${view.file}`, true)}</g>
    <path d="M${x - 139},472 H${x - 110} M${x + 110},472 H${x + 139}" stroke="#a7988a" stroke-width="1" />
    <text x="${x}" y="521" text-anchor="middle" fill="#66564c" font-size="14">圆手放膝面 · 下摆与地面相贴</text>
  </g>`;
}).join('');
fs.writeFileSync(path.join(directory, 'character-seated-side-contact-v11.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="100%" height="100%" role="img" aria-labelledby="contact-title" style="font-family:'Microsoft YaHei','Segoe UI',sans-serif">
  <title id="contact-title">用户手绘侧坐 · 左右侧与接地对照 v11</title>
  <rect width="900" height="600" fill="#faf8f4" />
  <text x="40" y="53" fill="#332b26" font-size="25" font-weight="600">侧坐 · 采用你的轮廓，校准袍底接地</text>
  <text x="40" y="86" fill="#66564c" font-size="14">同头大小、同倍率 · 保留宽扁袍摆与圆润胸背 · 左右对应转向</text>
  ${contactPanels}
  <text x="40" y="570" fill="#66564c" font-size="13">薄接触影贴合下摆，轻柔投影在边缘淡出；地面标记对齐袍底最低点。</text>
  </svg>\n`);

const groundTile = () => {
  const points = [[-11, -11], [11, -11], [11, 11], [-11, 11]].map(([u, v]) => referenceGroundPoint(u, v));
  const lines = [-5.5, 0, 5.5].flatMap(t => [[[t, -11], [t, 11]], [[-11, t], [11, t]]])
    .map(line => { const [a, b] = line.map(([u, v]) => referenceGroundPoint(u, v)); return `M${a.x},${a.y} L${b.x},${b.y}`; }).join(' ');
  return `<g data-ground-reference="true"><polygon points="${points.map(point => `${point.x},${point.y}`).join(' ')}" fill="#322a21" stroke="#927657" stroke-width="0.2" />
    <path d="${lines}" stroke="#927657" stroke-opacity="0.35" stroke-width="0.15" fill="none" /></g>`;
};
const groundPanels = views.map((view, index) => {
  const x = 48 + index * 282;
  const arrow = characterPoint(0, 16, 0, view.direction);
  return `<g transform="translate(${x},0)"><text x="0" y="173" fill="#f5ede2" font-size="18">${view.title}</text>
    <text x="0" y="202" fill="#d6c6b4" font-size="14">${view.direction} · 相同地面与观察条件</text>
    <g transform="translate(124,542) scale(5)">${groundTile()}
      <path d="M0,0 L${arrow.x},${arrow.y}" stroke="#d1a582" stroke-width="0.5" stroke-dasharray="1 1" />
      ${character(view.direction, `ground-${view.file}`)}</g>
    <text x="0" y="606" fill="#d6c6b4" font-size="13">地面边与水平线夹角 ±15.81°</text>
    <text x="0" y="630" fill="#d6c6b4" font-size="13">侧身轻补厚，袍摆加入接触阴影</text>
    <text x="0" y="664" fill="#d6c6b4" font-size="13">小尺寸参考（人物约 65px 高）</text>
    <g data-size-preview="true" transform="translate(124,742) scale(${1.4 / size.authoringScale})">${character(view.direction, `small-${view.file}`)}</g></g>`;
}).join('');
fs.writeFileSync(path.join(directory, 'character-shorthair-standing-ground-4views.svg'), extraSheet(
  '站姿四朝向 · 浅轴测地面参照', '地面来自主屋边向量 (272, 77)；人物保留手绘轮廓，地面用于检查接地位置与朝向。', groundPanels,
  '15.81° 为屏幕地面斜线角度；头部仍为手绘圆润造型，此图用于检查接地与前后遮挡。', 845));
// Material inspection only: reuse the real timber component and extract only
// the meadow's referenced gradient, keeping unrelated world filters out of this SVG.
const timberMarkup = svgMarkup(<TimberFlooring />);
const meadowGradient = svgMarkup(<YorkshireDefs theme={COUNTRYSIDE_THEMES.afternoon} />)
  .match(/<linearGradient id="isoGroundPastureGrad"[\s\S]*?<\/linearGradient>/)?.[0];
if (!meadowGradient) throw new Error('Missing the project meadow gradient');
const surfaceRows = (['wood', 'grass'] as const).map((surface, row) => {
  const floorY = row === 0 ? 337 : 610;
  const label = surface === 'wood' ? '木地板 · 复用主屋实木地板' : '草地 · 项目下午主题大地渐变';
  return `<g data-surface="${surface}"><text x="48" y="${floorY - 185}" fill="#f5ede2" font-size="18" font-weight="600">${label}</text>
    ${views.map((view, index) => {
      const prefix = `surface-${surface}-${view.file}`;
      const floor = surface === 'wood'
        ? `<g transform="scale(0.145) translate(0,-135)">${scopedResources(timberMarkup, `${prefix}-floor`)}</g>`
        : scopedResources(`<defs>${meadowGradient}</defs><polygon points="-39.44,0 0,-11.165 39.44,0 0,11.165" fill="url(#isoGroundPastureGrad)" />`, `${prefix}-floor`);
      return `<g transform="translate(${48 + index * 282},0)">
        <text x="0" y="${floorY - 158}" fill="#d6c6b4" font-size="14">${view.title} · ${view.direction}</text>
        <g transform="translate(124,${floorY}) scale(3)">${floor}
          <g transform="translate(-13,0)">${character(view.direction, `${prefix}-large`)}</g>
          <g data-size-preview="true" transform="translate(19,0) scale(${1.4 / 3 / size.authoringScale})">${character(view.direction, `${prefix}-small`)}</g>
        </g>
        <text x="0" y="${floorY + 60}" fill="#d6c6b4" font-size="13">左：放大参照 · 右：约 65px 高</text></g>`;
    }).join('')}</g>`;
}).join('');
fs.writeFileSync(path.join(directory, 'character-shorthair-standing-surfaces.svg'), extraSheet(
  '站姿 · 木地板与草地接地对照', '两种地面同倍率展示四朝向；保留柔和椭圆投影，窄接触阴影紧贴袍摆。', surfaceRows,
  '标准站高约48场景单位；材质对照用于检查体积与接地，场景中还会受到镜头倍率及家具遮挡影响。', 750));
console.log('Generated seated/standing views, equal-head comparison, ground-reference and material sheets.');
