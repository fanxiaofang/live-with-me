import type { EditableObjectId, RoomLayoutConfig } from '../../components/layout-gizmo/layoutStore';
import { DEFAULT_ROOM_LAYOUT } from '../../components/layout-gizmo/layoutStore';
import { DEFAULT_SCENE_LAYOUT } from '../../world/scene/sceneLayout';
import { scenePoint, type SceneLayout } from '../../world/scene/sceneTypes';

export type FurnitureParent = 'main_cottage' | 'cabinet-group' | 'desk-group' | 'bookshelf-group' | 'craft-wall';
export interface ParentContract { parent: FurnitureParent; selector: string }
const parents = Object.fromEntries(Object.keys(DEFAULT_ROOM_LAYOUT).map(id => [id, {
  parent: 'main_cottage', selector: '#living-cottage-haven',
}])) as Record<EditableObjectId, ParentContract>;
for (const id of ['record-player','moka-pot','coffee-beans','ceramic-cups'] as const) {
  parents[id] = { parent:'cabinet-group', selector:'#isometric-turntable-console' };
}
for (const id of ['desk-laptop','desk-lamp','desk-cup'] as const) {
  parents[id] = { parent:'desk-group', selector:'#isometric-desk-container' };
}
for (const id of Object.keys(DEFAULT_ROOM_LAYOUT) as EditableObjectId[]) {
  if (id.startsWith('shelf-')) parents[id] = { parent:'bookshelf-group', selector:'#isometric-bookshelf-container' };
}
for (const id of ['craft-tool-wall','left-wall-photos','craft-wind-chime'] as const) {
  parents[id] = { parent:'craft-wall', selector:'#left-wall-craft-board' };
}
export const FURNITURE_PARENTS: Readonly<Record<EditableObjectId, ParentContract>> = parents;

/** Resolve existing v6 coordinate conventions without reparenting chairs or cushions. */
export function furnitureScenePoint(id: EditableObjectId, layout: RoomLayoutConfig, scene: SceneLayout = DEFAULT_SCENE_LAYOUT) {
  let { x, y } = layout[id].screen;
  const parent = FURNITURE_PARENTS[id].parent;
  if (parent === 'craft-wall') {
    // The saved pair is a translated point before the left-wall shear.
    y += -0.2852 * (x + 124);
  } else if (parent !== 'main_cottage') {
    x += layout[parent].screen.x;
    y += layout[parent].screen.y;
  }
  const main = scene.main_cottage;
  return scenePoint(main.position.x + x * main.scale, main.position.y + y * main.scale);
}
