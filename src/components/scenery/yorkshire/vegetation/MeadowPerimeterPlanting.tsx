import { memo, useId } from 'react';
import { frontEdgeY } from '../../../../world/scene/fieldEdges';
import type { SceneLayout } from '../../../../world/scene/sceneTypes';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';
import { Grass, Plant } from './MeadowVegetationAssets';
import { meadowPlantPaletteCss } from './meadowPalette';
import { MeadowOuterPlanting } from './MeadowOuterPlanting';

export function meadowPerimeterGroups(layout: SceneLayout) {
  const cabin = layout.wooden_cabin, pod = layout.capsule_pod;
  const tree = YORKSHIRE_LAYOUT.guardianTree;
  const pen = YORKSHIRE_LAYOUT.sheepPen.anchor;
  return [
    ...[-78, 48, 1190, 1310].map((x, i) => ({ id: `rear-${i}`, x, y: frontEdgeY(x) + (i % 2 ? 42 : 27), scale: .38, flowers: i % 2 === 0 })),
    { id: 'cabin-outer', x: cabin.position.x - 205 * cabin.scale, y: cabin.position.y + 2 * cabin.scale, scale: .62, flowers: true },
    { id: 'cabin-side', x: cabin.position.x - 235 * cabin.scale, y: cabin.position.y + 149 * cabin.scale, scale: .67, flowers: false },
    { id: 'pod-outer', x: pod.position.x + 285 * pod.scale, y: pod.position.y + 18 * pod.scale, scale: .64, flowers: true },
    { id: 'west-front', x: tree.position.x - 88, y: tree.position.y + tree.root.y * tree.scale + 76, scale: .76, flowers: true },
    { id: 'east-front', x: pen.x + 90, y: pen.y + 154, scale: .78, flowers: false },
    { id: 'east-outer', x: pen.x + 409, y: pen.y + 57, scale: .84, flowers: true },
  ];
}

/** Loose perimeter islands, attached to world/structure roots. The porch axis,
 * cabin steps, capsule ladder and pasture gate stay open. No contact pads. */
export const MeadowPerimeterPlanting = memo(function MeadowPerimeterPlanting({ theme, layout }: {
  theme: YorkshireSceneTheme; layout: SceneLayout;
}) {
  const id = 'meadow-perimeter-' + useId().replace(/:/g, '');
  const groups = meadowPerimeterGroups(layout);
  return <g id={id} data-meadow-perimeter="" pointerEvents="none" aria-hidden="true">
    <style>{meadowPlantPaletteCss(theme, '#' + id)}</style>
    <MeadowOuterPlanting />
    {groups.map((group, i) => <g key={group.id} data-perimeter-island={group.id}
      data-world-root={`${group.x},${group.y}`} transform={`translate(${group.x} ${group.y}) scale(${group.scale})`}>
      <Grass type="leaning" x={-12} scale={.54} flip={i % 2 === 0} />
      <Grass type="woven" x={24} y={5} scale={.54} flip={i % 2 !== 0} />
      <Grass type="short" x={-48} y={9} scale={.3} />
      <Grass type="short" x={51} y={13} scale={.24} flip />
      {group.flowers && <g transform="translate(12 -1) scale(.43)"><Plant species={i % 3 === 0 ? 'clover' : 'daisy'} /></g>}
    </g>)}
  </g>;
});
