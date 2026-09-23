import { ScreenPoint2D } from './isoMath';

export type RoomCategory = 'living' | 'cabinet' | 'study' | 'porch' | 'attic' | 'bookshelf';

export type EditableObjectId =
  // 1. 咖啡黑胶边柜及台面物品 (Cabinet Group)
  | 'cabinet-group'
  | 'record-player'
  | 'moka-pot'
  | 'coffee-beans'
  | 'ceramic-cups'
  // 2. 阁楼手工书桌、左墙挂物及台面摆件 (Attic Desk & Wall Group)
  | 'desk-group'
  | 'attic-chair'
  | 'desk-laptop'
  | 'desk-lamp'
  | 'desk-cup'
  | 'desk-monstera'
  | 'left-wall-poster'
  | 'craft-tool-wall'
  | 'left-wall-photos'
  | 'craft-wind-chime'
  // 3. 原木四层书架及各层槽位 (Bookshelf & Shelf Slots Group)
  | 'bookshelf-group'
  | 'shelf-vase'
  | 'shelf-compass'
  | 'shelf-tier3-books'
  | 'shelf-bird'
  | 'shelf-ivy'
  | 'shelf-tier2-books'
  | 'shelf-tier1-books'
  | 'shelf-stone'
  | 'shelf-basket'
  // 4. 起居室与茶室核心大家具与蒲团 (Living Room & Tea Cushions Group)
  | 'tea-table'
  | 'tea-cushion-east'
  | 'tea-cushion-west'
  | 'tea-cushion-south'
  | 'daybed'
  | 'wood-stove'
  // 5. 林木的花园书房 (Study Group)
  | 'lazy-sofa'
  | 'fiddle-plant'
  | 'wall-posters'
  // 6. 前廊门厅 (Porch Group)
  | 'shiba-inu';

export interface LayoutItemConfig {
  id: EditableObjectId;
  name: string;
  category: RoomCategory;
  categoryLabel: string;
  screen: ScreenPoint2D;
  fixedW: number; // 所在基准高度平面 (地板通常为0, 柜顶为28.2等)
  scale?: number;
}

export type RoomLayoutConfig = Record<EditableObjectId, LayoutItemConfig>;

export const DEFAULT_ROOM_LAYOUT: RoomLayoutConfig = {
  // --- 1. 咖啡黑胶边柜及部件 ---
  'cabinet-group': {
    id: 'cabinet-group',
    name: '北欧轻量咖啡黑胶柜 (整体)',
    category: 'cabinet',
    categoryLabel: '咖啡黑胶区',
    screen: { x: -72.0, y: 75.0 },
    fixedW: 0.0,
  },
  'record-player': {
    id: 'record-player',
    name: '复古黑胶唱片机',
    category: 'cabinet',
    categoryLabel: '咖啡黑胶区',
    screen: { x: -6.7, y: -24.6 },
    fixedW: 28.2,
    scale: 0.68,
  },
  'moka-pot': {
    id: 'moka-pot',
    name: '经典意式摩卡咖啡壶',
    category: 'cabinet',
    categoryLabel: '咖啡黑胶区',
    screen: { x: 13.7, y: -32.1 },
    fixedW: 28.2,
    scale: 0.85,
  },
  'coffee-beans': {
    id: 'coffee-beans',
    name: '现烘咖啡豆与密封罐',
    category: 'cabinet',
    categoryLabel: '咖啡黑胶区',
    screen: { x: -2.1, y: -10.6 },
    fixedW: 9.5,
    scale: 0.85,
  },
  'ceramic-cups': {
    id: 'ceramic-cups',
    name: '手作陶土咖啡杯组',
    category: 'cabinet',
    categoryLabel: '咖啡黑胶区',
    screen: { x: 18.5, y: -15.7 },
    fixedW: 9.5,
    scale: 0.85,
  },

  // --- 2. 阁楼手工书桌及台面摆件 ---
  'desk-group': {
    id: 'desk-group',
    name: '阁楼手工白橡木书桌 (整体)',
    category: 'attic',
    categoryLabel: '阁楼书屋',
    screen: { x: -147.0, y: 95.0 },
    fixedW: 0.0,
  },
  'attic-chair': {
    id: 'attic-chair',
    name: '阁楼手作白橡木温莎椅 (含工作者)',
    category: 'attic',
    categoryLabel: '阁楼书屋',
    screen: { x: -132.0, y: 101.0 },
    fixedW: 0.0,
  },
  'desk-laptop': {
    id: 'desk-laptop',
    name: '便携轻薄办公电脑',
    category: 'attic',
    categoryLabel: '阁楼书屋',
    screen: { x: 15.0, y: -1.0 },
    fixedW: 22.0,
  },
  'desk-lamp': {
    id: 'desk-lamp',
    name: '复古墨绿银行家台灯',
    category: 'attic',
    categoryLabel: '阁楼书屋',
    screen: { x: -25.0, y: 6.0 },
    fixedW: 22.0,
  },
  'desk-cup': {
    id: 'desk-cup',
    name: '手作白瓷温热咖啡杯',
    category: 'attic',
    categoryLabel: '阁楼书屋',
    screen: { x: 41.0, y: -7.0 },
    fixedW: 22.0,
  },
  'desk-monstera': {
    id: 'desk-monstera',
    name: '书桌生机龟背竹盆栽',
    category: 'attic',
    categoryLabel: '阁楼书屋',
    screen: { x: -198.0, y: 122.0 },
    fixedW: 0.0,
  },
  'left-wall-poster': {
    id: 'left-wall-poster',
    name: '左墙艺术印画 ·《山谷与远行》',
    category: 'attic',
    categoryLabel: '阁楼书屋',
    screen: { x: -112.0, y: 10.0 },
    fixedW: 0.0,
  },
  'craft-tool-wall': {
    id: 'craft-tool-wall',
    name: '左墙手作工具洞洞板 (含锤子螺丝刀剪刀电烙铁)',
    category: 'attic',
    categoryLabel: '阁楼书屋',
    screen: { x: -124.0, y: -26.0 },
    fixedW: 0.0,
  },
  'left-wall-photos': {
    id: 'left-wall-photos',
    name: '左墙拍立得三人萌感背影相框',
    category: 'attic',
    categoryLabel: '阁楼书屋',
    screen: { x: -118.0, y: 13.0 },
    fixedW: 0.0,
  },
  'craft-wind-chime': {
    id: 'craft-wind-chime',
    name: '左墙陶艺微鸣三色风铃挂饰',
    category: 'attic',
    categoryLabel: '阁楼书屋',
    screen: { x: -72.0, y: -36.0 },
    fixedW: 0.0,
  },

  // --- 3. 原木四层书架及各层槽位 (Bookshelf & Shelf Slots Group) ---
  'bookshelf-group': {
    id: 'bookshelf-group',
    name: '原木四层书架 (整体)',
    category: 'bookshelf',
    categoryLabel: '原木书架',
    screen: { x: 193.0, y: 124.0 },
    fixedW: 0.0,
  },
  'shelf-vase': {
    id: 'shelf-vase',
    name: '书架顶层 · 粗陶干花瓶槽位',
    category: 'bookshelf',
    categoryLabel: '原木书架',
    screen: { x: -7.0, y: -53.1 },
    fixedW: 56.0,
  },
  'shelf-compass': {
    id: 'shelf-compass',
    name: '书架顶层 · 复古黄铜罗盘槽位',
    category: 'bookshelf',
    categoryLabel: '原木书架',
    screen: { x: 13.0, y: -47.5 },
    fixedW: 56.0,
  },
  'shelf-tier3-books': {
    id: 'shelf-tier3-books',
    name: '书架第3层 · 诗集与手记藏书区',
    category: 'bookshelf',
    categoryLabel: '原木书架',
    screen: { x: -5.0, y: -38.5 },
    fixedW: 42.0,
  },
  'shelf-bird': {
    id: 'shelf-bird',
    name: '书架第3层 · 胡桃木雕鸣禽槽位',
    category: 'bookshelf',
    categoryLabel: '原木书架',
    screen: { x: 13.0, y: -33.5 },
    fixedW: 42.0,
  },
  'shelf-ivy': {
    id: 'shelf-ivy',
    name: '书架第2层 · 悬垂多肉盆栽槽位',
    category: 'bookshelf',
    categoryLabel: '原木书架',
    screen: { x: -14.0, y: -27.0 },
    fixedW: 28.0,
  },
  'shelf-tier2-books': {
    id: 'shelf-tier2-books',
    name: '书架第2层 · 经典藏书主展区',
    category: 'bookshelf',
    categoryLabel: '原木书架',
    screen: { x: -5.0, y: -24.5 },
    fixedW: 28.0,
  },
  'shelf-tier1-books': {
    id: 'shelf-tier1-books',
    name: '书架底层 · 植物志典籍大开本',
    category: 'bookshelf',
    categoryLabel: '原木书架',
    screen: { x: -3.0, y: -9.9 },
    fixedW: 14.0,
  },
  'shelf-stone': {
    id: 'shelf-stone',
    name: '书架底层 · 天然溪流石书立槽位',
    category: 'bookshelf',
    categoryLabel: '原木书架',
    screen: { x: 5.0, y: -7.7 },
    fixedW: 14.0,
  },
  'shelf-basket': {
    id: 'shelf-basket',
    name: '书架底层 · 手工松果小竹篓槽位',
    category: 'bookshelf',
    categoryLabel: '原木书架',
    screen: { x: 13.0, y: -5.5 },
    fixedW: 14.0,
  },

  // --- 4. 起居室与茶室核心组件 ---
  'tea-table': {
    id: 'tea-table',
    name: '日式原木圆矮茶几 (含茶具盘)',
    category: 'living',
    categoryLabel: '暖炉茶室',
    screen: { x: 10.0, y: 128.0 },
    fixedW: 0.0,
  },
  'tea-cushion-east': {
    id: 'tea-cushion-east',
    name: '茶几 · 东席草编厚蒲团 (访客席/侧身品茗)',
    category: 'living',
    categoryLabel: '暖炉茶室',
    screen: { x: 52.0, y: 124.0 },
    fixedW: 0.0,
  },
  'tea-cushion-west': {
    id: 'tea-cushion-west',
    name: '茶几 · 西席草编厚蒲团 (主人席/侧身对饮)',
    category: 'living',
    categoryLabel: '暖炉茶室',
    screen: { x: -32.0, y: 124.0 },
    fixedW: 0.0,
  },
  'tea-cushion-south': {
    id: 'tea-cushion-south',
    name: '茶几 · 南席草编厚蒲团 (观察席/圆润落肩背影)',
    category: 'living',
    categoryLabel: '暖炉茶室',
    screen: { x: 10.0, y: 154.0 },
    fixedW: 0.0,
  },
  'daybed': {
    id: 'daybed',
    name: '日式实木榻榻米休闲榻',
    category: 'living',
    categoryLabel: '暖炉茶室',
    screen: { x: 0.0, y: 0.0 },
    fixedW: 0.0,
  },
  'wood-stove': {
    id: 'wood-stove',
    name: '经典铸铁柴火暖炉',
    category: 'living',
    categoryLabel: '暖炉茶室',
    screen: { x: 0.0, y: 0.0 },
    fixedW: 0.0,
  },

  // --- 3. 林木的花园书房 ---
  'lazy-sofa': {
    id: 'lazy-sofa',
    name: '软糯面包懒人沙发',
    category: 'study',
    categoryLabel: '花园书房',
    screen: { x: 142.0, y: 118.0 },
    fixedW: 0.0,
  },
  'fiddle-plant': {
    id: 'fiddle-plant',
    name: '红陶盆栽琴叶榕',
    category: 'study',
    categoryLabel: '花园书房',
    screen: { x: 112.0, y: 90.0 },
    fixedW: 0.0,
  },
  'wall-posters': {
    id: 'wall-posters',
    name: '右墙艺术海报三联组 (整体)',
    category: 'study',
    categoryLabel: '花园书房',
    screen: { x: 0.0, y: 0.0 },
    fixedW: 0.0,
  },

  // --- 4. 前廊门厅 ---
  'shiba-inu': {
    id: 'shiba-inu',
    name: '编织软窝柴犬',
    category: 'porch',
    categoryLabel: '前廊门厅',
    screen: { x: -70.0, y: 172.0 },
    fixedW: 0.0,
  },
};

const STORAGE_KEY = 'live_with_me_room_layout_v6';

export function loadSavedRoomLayout(): RoomLayoutConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ROOM_LAYOUT;
    const parsed = JSON.parse(raw);
    const result: Partial<RoomLayoutConfig> = {};
    (Object.keys(DEFAULT_ROOM_LAYOUT) as EditableObjectId[]).forEach((key) => {
      result[key] = {
        ...DEFAULT_ROOM_LAYOUT[key],
        ...(parsed[key] || {}),
        screen: {
          ...DEFAULT_ROOM_LAYOUT[key].screen,
          ...(parsed[key]?.screen || {}),
        },
      };
    });
    return result as RoomLayoutConfig;
  } catch {
    return DEFAULT_ROOM_LAYOUT;
  }
}

export function saveRoomLayout(config: RoomLayoutConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save room layout', e);
  }
}

export function clearSavedRoomLayout() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear room layout', e);
  }
}

// 兼容别名导出
export type CabinetLayoutConfig = RoomLayoutConfig;
export const DEFAULT_CABINET_LAYOUT = DEFAULT_ROOM_LAYOUT;
export const loadSavedCabinetLayout = loadSavedRoomLayout;
export const saveCabinetLayout = saveRoomLayout;
export const clearSavedCabinetLayout = clearSavedRoomLayout;
