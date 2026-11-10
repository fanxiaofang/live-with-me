import { DEFAULT_GARDEN_PLACEMENTS, DEFAULT_SCENE_LAYOUT } from '../../world/scene/sceneLayout';
import { scenePoint, type SceneLayout } from '../../world/scene/sceneTypes';
import { YORKSHIRE_LAYOUT } from '../../components/scenery/yorkshire/landscapeLayout';
import { sceneExplorationBounds } from '../../world/scene/explorationBounds';
import { DETACHED_MEADOW_GROUPS, GRASS_YARD_OBJECTS } from './yardGrassObjects';
import { isGardenCrop, isCropDensity, type GardenCrop, type CropDensity } from './yardCrops';
export { rotateGroundPoint } from '../../world/scene/placementMath';

export const PAVING_MATERIALS = {
  fieldstone: '不规则田野石',
  limestone: '浅色石板',
  cobble: '圆角卵石',
  rawGranite: '暖灰椭圆景石',
  riverRock: '苔青椭圆景石',
  splitSlate: '扁长椭圆景石',
  brick: '红褐旧砖',
  oak: '橡木栈板',
  weathered: '风化木板',
} as const;
export type PavingMaterial = keyof typeof PAVING_MATERIALS;
export const PAVING_SIZES = { small: '小号', medium: '中号', large: '大号' } as const;
export type PavingSize = keyof typeof PAVING_SIZES;
export const PAVING_SIZE_SCALE: Record<PavingSize, number> = { small: .75, medium: 1, large: 1.35 };
export type PavingId = `paving_${number}`;
export const PAVING_IDS = Array.from({ length: 48 }, (_, i) => `paving_${i + 1}` as PavingId);
const PAVING_OBJECTS = Object.fromEntries(PAVING_IDS.map((id, i) => [id, {
  name: `道路铺装 ${String(i + 1).padStart(2, '0')}`, x: 0, y: 0, paving: true as const, rotate: true as const,
}])) as Record<PavingId, { name: string; x: number; y: number; paving: true; rotate: true }>;

export const TILLED_PLOTS = {
  tilled_plot: { name: '开垦土地 · 东西向（原版）', x: 45, y: 530, ground: true, plotView: 'original', heading: 0 },
  tilled_plot_front: { name: '开垦土地 · 东北—西南向', x: -115, y: 590, ground: true, plotView: 'front', heading: -45 },
  tilled_plot_perpendicular: { name: '开垦土地 · 南北向', x: -110, y: 760, ground: true, plotView: 'perpendicular', heading: 90 },
} as const;
export type TilledPlotId = keyof typeof TILLED_PLOTS;
export const TILLED_PLOT_IDS = Object.keys(TILLED_PLOTS) as TilledPlotId[];

const cabin = DEFAULT_SCENE_LAYOUT.wooden_cabin;
export const YARD_OBJECTS = Object.assign({
  main_cottage: { name: '大木屋', x: 540, y: 375, locked: true },
  main_cottage_venus: { name: '阁楼金星花', x: 590, y: 376 },
  wooden_cabin: { name: '林间小木屋', x: cabin.position.x + 9 * cabin.scale, y: cabin.position.y + 57 * cabin.scale },
  capsule_pod: { name: '旧胶囊仓', x: 950, y: 453 },
  observatory: { name: '电波观测台', x: DEFAULT_SCENE_LAYOUT.observatory.position.x,
    y: DEFAULT_SCENE_LAYOUT.observatory.position.y + 48 * DEFAULT_SCENE_LAYOUT.observatory.scale },
  pumpkin: { name: '南瓜架', x: DEFAULT_GARDEN_PLACEMENTS.pumpkin.position.x + 60 * DEFAULT_GARDEN_PLACEMENTS.pumpkin.scale,
    y: DEFAULT_GARDEN_PLACEMENTS.pumpkin.position.y + 50 * DEFAULT_GARDEN_PLACEMENTS.pumpkin.scale },
  beehive: { name: '蜂箱与花丛', x: DEFAULT_GARDEN_PLACEMENTS.beehive.position.x + 50 * DEFAULT_GARDEN_PLACEMENTS.beehive.scale,
    y: DEFAULT_GARDEN_PLACEMENTS.beehive.position.y + 25 * DEFAULT_GARDEN_PLACEMENTS.beehive.scale },
  sheep_pen: { name: '羊圈', x: YORKSHIRE_LAYOUT.sheepPen.anchor.x + 90, y: YORKSHIRE_LAYOUT.sheepPen.anchor.y + 35 },
  supply_shed: { name: '农具木棚与储备物资', x: 1390, y: 670 },
  hand_pump: { name: '乡村手压井与水桶', x: 1260, y: 675 },
  sheep_water_station: { name: '羊圈橡木饮水槽', x: 940, y: 648 },
  sheep_hand_pump: { name: '羊圈独立压水井', x: 1030, y: 687 },
  wild_sunflowers: { name: '野生向日葵丛', x: 1545, y: 665, grass: true },
  osmanthus: { name: '桂花树与秋千', x: 295, y: 568 + 48 * 1.08 },
  fence_west: { name: '西侧木栅栏与门', x: -155, y: 671, rotate: true },
  fence_east: { name: '东侧木栅栏', x: 269, y: 718, rotate: true },
  sheep_1: { name: '啃草小羊', x: -420, y: 474 },
  sheep_2: { name: '安睡小羊', x: -50, y: 624 },
  sheep_3: { name: '散养母羊', x: 735, y: 591 },
  sheep_4: { name: '散养羊羔', x: 790, y: 605 },
  sheep_5: { name: '探头小羊', x: 640, y: 432 },
  picnic: { name: '野餐垫与野餐篮', x: 570, y: 620 },
  herb_nursery: { name: '清新香草苗圃', x: 400, y: 555 },
  tractor: { name: '田边拖拉机与农场物资', x: 45, y: 310 },
  ...TILLED_PLOTS,
  ...GRASS_YARD_OBJECTS,
} as const, PAVING_OBJECTS);
export type YardId = keyof typeof YARD_OBJECTS;
export const YARD_IDS = Object.keys(YARD_OBJECTS) as YardId[];
export type YardPlacement = { dx: number; dy: number; angle: number; length?: number; width?: number; removed?: boolean; crop?: GardenCrop; cropDensity?: CropDensity; material?: PavingMaterial; pavingSize?: PavingSize };
export type YardLayout = Record<YardId, YardPlacement>;
export const YARD_STORAGE_KEY = 'live_with_me_yard_layout_v1';
export const canResize = (id: YardId): id is TilledPlotId => 'plotView' in YARD_OBJECTS[id];
export const emptyYardLayout = (): YardLayout => Object.fromEntries(YARD_IDS.map(id => [id, { dx: 0, dy: 0, angle: 0, ...(canResize(id) ? { length: 100, width: 100 } : {}) }])) as YardLayout;
export const canRotate = (id: YardId) => 'rotate' in YARD_OBJECTS[id] || canResize(id);
export const isPaving = (id: YardId): id is PavingId => 'paving' in YARD_OBJECTS[id];
export const isPavingMaterial = (value: unknown): value is PavingMaterial => typeof value === 'string' && value in PAVING_MATERIALS;
export const isPavingSize = (value: unknown): value is PavingSize => typeof value === 'string' && value in PAVING_SIZES;
export const isLocked = (id: YardId) => 'locked' in YARD_OBJECTS[id];
export const isGrass = (id: YardId) => 'grass' in YARD_OBJECTS[id];
export const isGround = (id: YardId) => 'ground' in YARD_OBJECTS[id];
export function constrainPlacement(id: YardId, value: YardPlacement): YardPlacement {
  if (isLocked(id)) return { dx: 0, dy: 0, angle: 0 };
  const anchor = YARD_OBJECTS[id];
  return {
    dx: Math.round(Math.max(-700 - anchor.x, Math.min(1850 - anchor.x, value.dx)) * 10) / 10,
    dy: Math.round(Math.max(Math.min(240, anchor.y) - anchor.y, Math.min(840 - anchor.y, value.dy)) * 10) / 10,
    angle: canRotate(id) ? Math.max(canResize(id) ? -180 : -75, Math.min(canResize(id) ? 180 : 75, value.angle)) : 0,
    ...(canResize(id) ? {
      length: Number.isFinite(value.length) ? Math.max(50, Math.min(250, value.length!)) : 100,
      width: Number.isFinite(value.width) ? Math.max(50, Math.min(250, value.width!)) : 100,
      ...(value.removed === true ? { removed: true } : {}),
      ...(isGardenCrop(value.crop) ? { crop: value.crop } : {}),
      ...(isCropDensity(value.cropDensity) ? { cropDensity: value.cropDensity } : {}),
    } : {}),
    ...(isPaving(id) && isPavingMaterial(value.material) ? { material: value.material } : {}),
    ...(isPaving(id) && isPavingSize(value.pavingSize) ? { pavingSize: value.pavingSize } : {}),
  };
}
export function resolveYardLayout(value: unknown): YardLayout {
  const result = emptyYardLayout();
  if (!value || typeof value !== 'object') return result;
  for (const id of YARD_IDS) {
    const p = (value as Record<string, unknown>)[id] as Partial<YardPlacement> | undefined;
    if (p && Number.isFinite(p.dx) && Number.isFinite(p.dy) && Number.isFinite(p.angle))
      result[id] = constrainPlacement(id, p as YardPlacement);
  }
  // Detach at the current saved building position once; subsequent moves are independent.
  if (!('sheep_water_station' in value)) {
    result.sheep_water_station = constrainPlacement('sheep_water_station', { ...result.sheep_pen, angle: 0 });
  }
  if (!('sheep_hand_pump' in value)) {
    result.sheep_hand_pump = constrainPlacement('sheep_hand_pump', { ...result.sheep_water_station, angle: 0 });
  }
  for (const group of DETACHED_MEADOW_GROUPS) {
    if (!(group.id in value)) result[group.id] = constrainPlacement(group.id, { ...result[group.anchor], angle: 0 });
  }
  return result;
}
export function yardSceneLayout(layout: YardLayout, base = DEFAULT_SCENE_LAYOUT): SceneLayout {
  return Object.fromEntries(Object.entries(base).map(([id, p]) => {
    const offset = layout[id as keyof SceneLayout];
    return [id, { ...p, position: scenePoint(p.position.x + offset.dx, p.position.y + offset.dy) }];
  })) as SceneLayout;
}
function parentOffset(id: YardId, layout: YardLayout) {
  const object = YARD_OBJECTS[id];
  return 'parent' in object && object.parent ? layout[object.parent] : { dx: 0, dy: 0 };
}
export function yardDepth(id: YardId, layout: YardLayout) { return YARD_OBJECTS[id].y + parentOffset(id, layout).dy + layout[id].dy; }

export function yardExplorationBounds(layout: YardLayout, scene = yardSceneLayout(layout)) {
  const bounds = sceneExplorationBounds(scene);
  // Preserve the approved default framing. Only moved outdoor groups extend it.
  for (const id of YARD_IDS) {
    const p = layout[id];
    if (p.removed) continue;
    if (!(p.dx || p.dy || p.angle || (p.length ?? 100) !== 100 || (p.width ?? 100) !== 100) || id in scene) continue;
    const base = YARD_OBJECTS[id], parent = parentOffset(id, layout);
    const anchor = { x: base.x + parent.dx, y: base.y + parent.dy };
    if (canResize(id)) {
      // Rotation is performed on the uncompressed ground plane; these radii cover every angle.
      const radius = Math.hypot(80, 80) * (p.length ?? 100) / 100 + Math.hypot(28, 35) * (p.width ?? 100) / 100 + 8;
      bounds.minX = Math.min(bounds.minX, anchor.x + p.dx - radius);
      bounds.maxX = Math.max(bounds.maxX, anchor.x + p.dx + radius);
      bounds.minY = Math.min(bounds.minY, anchor.y + p.dy - radius * .285 - 5);
      bounds.maxY = Math.max(bounds.maxY, anchor.y + p.dy + radius * .285 + 5);
      continue;
    }
    const radiusX = isPaving(id) ? 36 : id === 'tractor' ? 150 : id === 'herb_nursery' ? 80 : id === 'supply_shed' ? 100 : id === 'sheep_hand_pump' ? 44 : id === 'sheep_water_station' ? 82 : id === 'hand_pump' ? 48 : id === 'wild_sunflowers' ? 60 : isGround(id) ? 115 : isGrass(id) ? 180 : id.startsWith('fence_') ? 400 : id === 'sheep_pen' ? 300 : id === 'osmanthus' ? 110 : id === 'pumpkin' ? 115 : id === 'beehive' ? 100 : id === 'picnic' ? 85 : 25;
    const above = isPaving(id) ? 14 : id === 'tractor' ? 75 : id === 'herb_nursery' ? 65 : id === 'supply_shed' ? 120 : id === 'sheep_hand_pump' ? 104 : id === 'sheep_water_station' ? 28 : id === 'hand_pump' ? 68 : id === 'wild_sunflowers' ? 100 : id === 'osmanthus' ? 215 : id === 'sheep_pen' ? 115 : 80;
    bounds.minX = Math.min(bounds.minX, anchor.x + p.dx - radiusX);
    bounds.maxX = Math.max(bounds.maxX, anchor.x + p.dx + radiusX);
    bounds.minY = Math.min(bounds.minY, anchor.y + p.dy - above);
    bounds.maxY = Math.max(bounds.maxY, anchor.y + p.dy + (isPaving(id) ? 14 : id === 'sheep_pen' ? 70 : 35));
  }
  return bounds;
}
