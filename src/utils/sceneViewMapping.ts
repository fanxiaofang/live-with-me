import { Person, RoomId, LifeStateId } from '../types';

/**
 * 2.5D 等轴测场景家具与人物交互槽位体系 (Scene-based View Mapping System)
 * 
 * 核心原则：
 * 1. 严格映射：每个人物在不同家具（茶桌、电脑桌、沙发、榻榻米）上的存在感与其交互槽位几何视角严格匹配。
 * 2. 多席位自适应：例如茶桌拥有东、西、南三处预设蒲团，依据在场人数与状态动态分配席位并渲染对应的侧身、侧身镜像或正背影。
 * 3. 虚位以待：未就坐的蒲团呈现自然空置的草编厚蒲团，支持点击直接落座交互。
 */

export type FurnitureType = 'tea_table' | 'computer_desk' | 'lazy_sofa' | 'tatami_mat' | 'observatory_deck';

export type FurnitureSlotId =
  | 'tea_cushion_east'   // 茶桌 · 东席蒲团 (侧身向左品茶，访客席)
  | 'tea_cushion_west'   // 茶桌 · 西席蒲团 (侧身向右镜像对坐，主人席)
  | 'tea_cushion_south'  // 茶桌 · 南席蒲团 (正背影朝桌静坐，观察席)
  | 'desk_workstation'   // 电脑桌 · 人体工学工作椅 (背影专注敲键盘)
  | 'sofa_lounge'        // 懒人沙发 · 阅卷席 (正身放松倚靠，腿上展书)
  | 'tatami_capsule'     // 胶囊舱 · 榻榻米卧榻 (侧卧安睡裹被)
  | 'tatami_corn'        // 玉米仓 · 阁楼铺位 (安心沉眠)
  | 'observatory_post';  // 观测站 · 操作台 (侧身戴耳机监听电波)

export type CharacterViewAngle = 'front' | 'side' | 'side_mirrored' | 'back' | 'sleeping';

export interface SceneSlotConfig {
  slotId: FurnitureSlotId;
  furniture: FurnitureType;
  furnitureName: string;
  slotName: string;
  room: RoomId;
  viewAngle: CharacterViewAngle;
  facing: 'front' | 'side' | 'back';
  mirrored?: boolean;
  pose: 'desk_sitting' | 'tea_crosslegged' | 'sofa_lounging' | 'observatory_standing' | 'bed_sleeping';
  accessory?: 'none' | 'headphones' | 'glasses' | 'tea_cup' | 'book' | 'headset';
  badgeLabel: string;
  actionDesc: string;
  // 相对家具坐标原点的偏移
  offset: { dx: number; dy: number };
}

/**
 * 家具交互槽位固定配置表
 */
export const SCENE_SLOT_CONFIGS: Record<FurnitureSlotId, SceneSlotConfig> = {
  tea_cushion_east: {
    slotId: 'tea_cushion_east',
    furniture: 'tea_table',
    furnitureName: '圆矮茶几',
    slotName: '东席蒲团',
    room: 'living_nook',
    viewAngle: 'side',
    facing: 'side',
    mirrored: false,
    pose: 'tea_crosslegged',
    accessory: 'tea_cup',
    badgeLabel: '茶桌 · 东席 (侧身)',
    actionDesc: '侧身对坐，双手端茶细品',
    offset: { dx: 42, dy: -4 },
  },
  tea_cushion_west: {
    slotId: 'tea_cushion_west',
    furniture: 'tea_table',
    furnitureName: '圆矮茶几',
    slotName: '西席蒲团',
    room: 'living_nook',
    viewAngle: 'side_mirrored',
    facing: 'side',
    mirrored: true,
    pose: 'tea_crosslegged',
    accessory: 'tea_cup',
    badgeLabel: '茶桌 · 西席 (侧影对坐)',
    actionDesc: '侧对茶几，与同住人悠然对饮',
    offset: { dx: -42, dy: -4 },
  },
  tea_cushion_south: {
    slotId: 'tea_cushion_south',
    furniture: 'tea_table',
    furnitureName: '圆矮茶几',
    slotName: '南席蒲团',
    room: 'living_nook',
    viewAngle: 'back',
    facing: 'back',
    mirrored: false,
    pose: 'tea_crosslegged',
    accessory: 'none',
    badgeLabel: '茶桌 · 南席 (背影正坐)',
    actionDesc: '背对镜头面朝茶台，圆润落肩沉静入定',
    offset: { dx: 0, dy: 26 },
  },
  desk_workstation: {
    slotId: 'desk_workstation',
    furniture: 'computer_desk',
    furnitureName: '阁楼电脑桌',
    slotName: '工作转椅',
    room: 'my_room',
    viewAngle: 'back',
    facing: 'back',
    mirrored: false,
    pose: 'desk_sitting',
    accessory: 'headphones',
    badgeLabel: '电脑桌 · 工作椅 (背身)',
    actionDesc: '头戴监听耳机，双手专注敲击键盘',
    offset: { dx: 0, dy: 0 },
  },
  sofa_lounge: {
    slotId: 'sofa_lounge',
    furniture: 'lazy_sofa',
    furnitureName: '懒人沙发',
    slotName: '阅卷席',
    room: 'friend_room',
    viewAngle: 'front',
    facing: 'front',
    mirrored: false,
    pose: 'sofa_lounging',
    accessory: 'book',
    badgeLabel: '懒人沙发 · 阅卷席 (正身)',
    actionDesc: '陷在柔软沙发中，膝上摊开喜欢的书卷',
    offset: { dx: 0, dy: 0 },
  },
  tatami_capsule: {
    slotId: 'tatami_capsule',
    furniture: 'tatami_mat',
    furnitureName: '胶囊舱榻榻米',
    slotName: '安睡铺位',
    room: 'capsule_pod',
    viewAngle: 'sleeping',
    facing: 'side',
    mirrored: false,
    pose: 'bed_sleeping',
    accessory: 'none',
    badgeLabel: '胶囊舱 · 榻榻米 (安睡)',
    actionDesc: '裹着红陶厚被，在窗外风声中微酣',
    offset: { dx: -10, dy: 8 },
  },
  tatami_corn: {
    slotId: 'tatami_corn',
    furniture: 'tatami_mat',
    furnitureName: '玉米仓卧榻',
    slotName: '阁楼暖铺',
    room: 'corn_lounge',
    viewAngle: 'sleeping',
    facing: 'side',
    mirrored: false,
    pose: 'bed_sleeping',
    accessory: 'none',
    badgeLabel: '玉米仓 · 卧榻 (安睡)',
    actionDesc: '在阳光温热的麦秆香气中熟睡',
    offset: { dx: -6, dy: 17 },
  },
  observatory_post: {
    slotId: 'observatory_post',
    furniture: 'observatory_deck',
    furnitureName: '星空观测站',
    slotName: '监听操作台',
    room: 'observatory',
    viewAngle: 'side',
    facing: 'side',
    mirrored: false,
    pose: 'observatory_standing',
    accessory: 'headset',
    badgeLabel: '观测台 · 操作台 (侧身)',
    actionDesc: '佩戴无线电耳机，手持日志记录深空信号',
    offset: { dx: -2, dy: 14 },
  },
};

export interface ResolvedPresenceSlot {
  config: SceneSlotConfig;
  occupant: Person | null;
  isOccupied: boolean;
}

/**
 * 根据同住人列表动态分配交互槽位 (Dynamic Slot Assignment Engine)
 */
export function resolvePresenceSlots(people: Person[]): {
  slots: Record<FurnitureSlotId, ResolvedPresenceSlot>;
  personToSlot: Record<string, SceneSlotConfig>;
} {
  const result: Record<FurnitureSlotId, ResolvedPresenceSlot> = {
    tea_cushion_east: { config: SCENE_SLOT_CONFIGS.tea_cushion_east, occupant: null, isOccupied: false },
    tea_cushion_west: { config: SCENE_SLOT_CONFIGS.tea_cushion_west, occupant: null, isOccupied: false },
    tea_cushion_south: { config: SCENE_SLOT_CONFIGS.tea_cushion_south, occupant: null, isOccupied: false },
    desk_workstation: { config: SCENE_SLOT_CONFIGS.desk_workstation, occupant: null, isOccupied: false },
    sofa_lounge: { config: SCENE_SLOT_CONFIGS.sofa_lounge, occupant: null, isOccupied: false },
    tatami_capsule: { config: SCENE_SLOT_CONFIGS.tatami_capsule, occupant: null, isOccupied: false },
    tatami_corn: { config: SCENE_SLOT_CONFIGS.tatami_corn, occupant: null, isOccupied: false },
    observatory_post: { config: SCENE_SLOT_CONFIGS.observatory_post, occupant: null, isOccupied: false },
  };

  const personToSlot: Record<string, SceneSlotConfig> = {};

  // 茶桌预设槽位队列（东 -> 西 -> 南）
  const teaSlotsQueue: FurnitureSlotId[] = ['tea_cushion_east', 'tea_cushion_west', 'tea_cushion_south'];
  let teaSlotIndex = 0;

  people.forEach((person) => {
    let targetSlotId: FurnitureSlotId | null = null;

    // 1. 胶囊舱专属槽位
    if (person.currentRoom === 'capsule_pod') {
      targetSlotId = 'tatami_capsule';
    }
    // 2. 玉米仓专属槽位
    else if (person.currentRoom === 'corn_lounge') {
      targetSlotId = 'tatami_corn';
    }
    // 3. 观测台专属槽位
    else if (person.currentRoom === 'observatory') {
      targetSlotId = 'observatory_post';
    }
    // 4. 起居角落 (茶几蒲团) 或 品茶状态
    else if (
      person.currentRoom === 'living_nook' ||
      person.currentState === 'tea_time' ||
      person.currentState === 'dazing'
    ) {
      if (teaSlotIndex < teaSlotsQueue.length) {
        targetSlotId = teaSlotsQueue[teaSlotIndex];
        teaSlotIndex++;
      } else {
        // 蒲团已满时备用
        targetSlotId = 'tea_cushion_south';
      }
    }
    // 5. 电脑工作桌 (我的房间且在工作/学习/码代码)
    else if (
      person.currentRoom === 'my_room' &&
      (person.currentState === 'coding' ||
        person.currentState === 'study' ||
        person.currentState === 'writing')
    ) {
      targetSlotId = 'desk_workstation';
    }
    // 6. 懒人沙发 (林木书房 或 正在阅读/休息)
    else if (
      person.currentRoom === 'friend_room' ||
      person.currentState === 'reading' ||
      person.currentState === 'resting' ||
      person.currentState === 'listening_music'
    ) {
      targetSlotId = 'sofa_lounge';
    }
    // 7. 安睡状态兜底至榻榻米
    else if (person.currentState === 'sleeping') {
      targetSlotId = !result.tatami_capsule.isOccupied ? 'tatami_capsule' : 'tatami_corn';
    }
    // 8. 默认分配
    else {
      if (person.isSelf) {
        targetSlotId = 'desk_workstation';
      } else if (teaSlotIndex < teaSlotsQueue.length) {
        targetSlotId = teaSlotsQueue[teaSlotIndex];
        teaSlotIndex++;
      } else {
        targetSlotId = 'sofa_lounge';
      }
    }

    if (targetSlotId && result[targetSlotId]) {
      result[targetSlotId].occupant = person;
      result[targetSlotId].isOccupied = true;
      personToSlot[person.id] = result[targetSlotId].config;
    }
  });

  return { slots: result, personToSlot };
}

/**
 * 根据状态和房间预测小人即将入驻的家具交互槽位（用于状态编辑时的即时反馈）
 */
export function predictPresenceSlot(roomId: RoomId, stateId: LifeStateId): SceneSlotConfig {
  if (roomId === 'capsule_pod' || stateId === 'sleeping') {
    return SCENE_SLOT_CONFIGS.tatami_capsule;
  }
  if (roomId === 'corn_lounge') {
    return SCENE_SLOT_CONFIGS.tatami_corn;
  }
  if (roomId === 'observatory' || stateId === 'stargazing') {
    return SCENE_SLOT_CONFIGS.observatory_post;
  }
  if (roomId === 'living_nook' || stateId === 'tea_time' || stateId === 'dazing') {
    return SCENE_SLOT_CONFIGS.tea_cushion_east;
  }
  if (roomId === 'friend_room' || stateId === 'reading' || stateId === 'resting') {
    return SCENE_SLOT_CONFIGS.sofa_lounge;
  }
  if (roomId === 'my_room' || stateId === 'coding' || stateId === 'study') {
    return SCENE_SLOT_CONFIGS.desk_workstation;
  }
  return SCENE_SLOT_CONFIGS.tea_cushion_east;
}
