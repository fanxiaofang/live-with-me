import React from 'react';
import { GrassComposition, Plant, type MeadowClusterKind as Kind, type MeadowFlowerSpecies as Species } from '../../../src/components/scenery/yorkshire/vegetation/MeadowVegetationAssets';

// Authoring previews share the retained asset source; no duplicated geometry.
export { Grass, Plant, GrassComposition } from '../../../src/components/scenery/yorkshire/vegetation/MeadowVegetationAssets';
const ground = '#78933f';

export const studies = [
  { kind: 'soft' as const, name: '短草甸簇', description: '沿地面分散生根，短叶交织。保留横向展开的构图，叶片之间露出地面。' },
  { kind: 'wild' as const, name: '禾本科野草簇', description: '细长带状叶左右伸展，交叉与弯垂共存；暗部只来自叶片叠合。' },
  { kind: 'flower' as const, name: '野花混生簇', description: '雏菊贴地叶丛、三叶草复叶与毛茛分枝独立生长，间隔少量短草。' },
];
export const speciesStudies = [
  { id: 'daisy' as const, name: '雏菊', latin: 'Bellis perennis', description: '贴地匙形叶 · 低花梗 · 乳白细瓣与金黄花心' },
  { id: 'buttercup' as const, name: '草甸毛茛', latin: 'Ranunculus acris', description: '分枝细梗 · 分裂叶 · 五片圆润黄瓣' },
  { id: 'clover' as const, name: '红三叶草', latin: 'Trifolium pratense', description: '三出复叶 · 淡色叶纹 · 灰粉紫色卵球花序' },
];

export function StudySvg({ kind, overview = false }: { kind: Kind; overview?: boolean }) {
  const width = overview ? 300 : 520, height = overview ? 180 : 200;
  return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`}
    role="img" aria-label={`${studies.find(s => s.kind === kind)!.name}，${overview ? '世界总览缩放 0.66' : '放大细节'}，平整草地样板`}>
    <rect data-ground="flat" width={width} height={height} fill={ground} />
    <g transform={overview ? 'translate(145 113) scale(0.66)' : 'translate(245 141) scale(2.1)'}><GrassComposition kind={kind} /></g>
  </svg>;
}

export function SpeciesSvg({ species }: { species: Species }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180" role="img"
    aria-label={`${speciesStudies.find(s => s.id === species)!.name}植物结构小样`}>
    <rect width="300" height="180" fill={ground} />
    <g transform="translate(80 116) scale(0.66)"><Plant species={species} /></g>
    <g transform="translate(205 130) scale(2.4)"><Plant species={species} /></g>
  </svg>;
}
