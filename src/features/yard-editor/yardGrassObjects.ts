import { DEFAULT_SCENE_LAYOUT } from '../../world/scene/sceneLayout';
import { MEADOW_FOREGROUND_CLUSTERS, MEADOW_ENTRANCE } from '../../components/scenery/yorkshire/vegetation/meadowForeground';
import { OUTER_MEADOW_ISLANDS } from '../../components/scenery/yorkshire/vegetation/meadowOuterLayout';
import { meadowPerimeterGroups } from '../../components/scenery/yorkshire/vegetation/meadowPerimeterLayout';
import { HOMESTEAD_MEADOW_PLANTS } from '../../components/scenery/yorkshire/vegetation/meadowPlantingLayout';

export const DETACHED_MEADOW_GROUPS = [
  { id: 'grass_detached_cabin-front', zone: 'cabin-transition', anchor: 'wooden_cabin', name: '林间小木屋前草簇' },
  { id: 'grass_detached_pod-rear', zone: 'pod-outer', anchor: 'capsule_pod', name: '胶囊仓后草簇' },
] as const;

const foregroundNames = {
  'left-inner': '树前低草簇', 'right-inner': '羊圈前低草簇',
  'left-middle': '西侧穗草丛', 'right-middle': '东侧花草丛',
  'left-outer': '西侧边缘穗草', 'right-outer': '东侧边缘穗草',
} as const;
const perimeterNames = {
  'rear-0': '田边草簇一', 'rear-1': '田边草簇二', 'rear-2': '田边草簇三', 'rear-3': '田边草簇四',
  'cabin-outer': '小木屋外侧花草', 'cabin-side': '小木屋侧前草簇', 'pod-outer': '胶囊仓外侧花草',
  'west-front': '桂花树外侧花草', 'east-front': '羊圈前方草簇', 'east-outer': '羊圈外侧花草',
} as const;
export type YardGrassId = `grass_foreground_${keyof typeof foregroundNames}`
  | `grass_perimeter_${keyof typeof perimeterNames}` | 'grass_outer_west' | 'grass_outer_east'
  | typeof DETACHED_MEADOW_GROUPS[number]['id'];
type GrassObject = { name: string; x: number; y: number; grass: true; parent?: 'wooden_cabin' | 'capsule_pod' | 'osmanthus' | 'sheep_pen' };
const parents: Partial<Record<keyof typeof perimeterNames, GrassObject['parent']>> = {
  'cabin-outer': 'wooden_cabin', 'cabin-side': 'wooden_cabin', 'pod-outer': 'capsule_pod',
  'west-front': 'osmanthus', 'east-front': 'sheep_pen', 'east-outer': 'sheep_pen',
};
export const GRASS_YARD_OBJECTS = Object.fromEntries([
  ...DETACHED_MEADOW_GROUPS.map(group => {
    const plants = HOMESTEAD_MEADOW_PLANTS.filter(p => p.zone === group.zone);
    const entity = DEFAULT_SCENE_LAYOUT[group.anchor];
    return [group.id, { name: group.name, grass: true,
      x: entity.position.x + plants.reduce((sum, p) => sum + p.x, 0) / plants.length * entity.scale,
      y: entity.position.y + plants.reduce((sum, p) => sum + p.y, 0) / plants.length * entity.scale }];
  }),
  ...MEADOW_FOREGROUND_CLUSTERS.map(c => [`grass_foreground_${c.id}`, {
    name: foregroundNames[c.id], x: c.x + (c.id === 'left-middle' ? MEADOW_ENTRANCE.leftMiddlePlantOffset.x : 0),
    y: c.y + (c.id === 'left-middle' ? MEADOW_ENTRANCE.leftMiddlePlantOffset.y : 0), grass: true,
  }]),
  ...meadowPerimeterGroups(DEFAULT_SCENE_LAYOUT).map(c => [`grass_perimeter_${c.id}`, {
    name: perimeterNames[c.id as keyof typeof perimeterNames], x: c.x, y: c.y, grass: true,
    parent: parents[c.id as keyof typeof perimeterNames],
  }]),
  ...OUTER_MEADOW_ISLANDS.map(c => [`grass_outer_${c.id}`, {
    name: c.id === 'west' ? '西侧大片草花' : '东侧三叶草花丛', x: c.x, y: c.y, grass: true,
  }]),
]) as Record<YardGrassId, GrassObject>;
