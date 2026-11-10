import { meadowPerimeterGroups } from './meadowPerimeterLayout';
export { meadowPerimeterGroups } from './meadowPerimeterLayout';
import { YardObject } from '../../../../features/yard-editor/YardWorld';
import type { YardGrassId } from '../../../../features/yard-editor/yardGrassObjects';
import { useYardPlacement } from '../../../../features/yard-editor/YardWorld';
import { memo, useId } from 'react';
import type { SceneLayout } from '../../../../world/scene/sceneTypes';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { Grass, Plant } from './MeadowVegetationAssets';
import { meadowPlantPaletteCss } from './meadowPalette';
import { MeadowOuterPlanting } from './MeadowOuterPlanting';

/** Loose perimeter islands, attached to world/structure roots. The porch axis,
 * cabin steps, capsule ladder and pasture gate stay open. No contact pads. */
export const MeadowPerimeterPlanting = memo(function MeadowPerimeterPlanting({ theme, layout }: {
  theme: YorkshireSceneTheme; layout: SceneLayout;
}) {
  const id = 'meadow-perimeter-' + useId().replace(/:/g, '');
  const treeOffset = useYardPlacement('osmanthus'), penOffset = useYardPlacement('sheep_pen');
  const groups = meadowPerimeterGroups(layout).map(group => {
    const offset = group.id === 'west-front' ? treeOffset : ['east-front', 'east-outer'].includes(group.id) ? penOffset : { dx: 0, dy: 0 };
    return { ...group, x: group.x + offset.dx, y: group.y + offset.dy };
  });
  return <g id={id} data-meadow-perimeter="" pointerEvents="none" aria-hidden="true">
    <style>{meadowPlantPaletteCss(theme, '#' + id)}</style>
    <MeadowOuterPlanting theme={theme} />
    {groups.map((group, i) => <YardObject key={group.id} id={`grass_perimeter_${group.id}` as YardGrassId}><g id={`${id}-${group.id}`} data-perimeter-island={group.id}
      data-world-root={`${group.x},${group.y}`} transform={`translate(${group.x} ${group.y}) scale(${group.scale})`}>
      <style>{meadowPlantPaletteCss(theme, '#' + id + '-' + group.id)}</style>
      <Grass type="leaning" x={-12} scale={.54} flip={i % 2 === 0} />
      <Grass type="woven" x={24} y={5} scale={.54} flip={i % 2 !== 0} />
      <Grass type="short" x={-48} y={9} scale={.3} />
      <Grass type="short" x={51} y={13} scale={.24} flip />
      {group.flowers && <g transform="translate(12 -1) scale(.43)"><Plant species={i % 3 === 0 ? 'clover' : 'daisy'} /></g>}
    </g></YardObject>)}
  </g>;
});
