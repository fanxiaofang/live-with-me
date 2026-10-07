import { Person, RoomId } from '../../types';

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
  | 'tatami_corn'        // 林间小木屋 · 暖木卧榻 (安心沉眠)
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
    furnitureName: '小木屋暖木卧榻',
    slotName: '暖木大床',
    room: 'corn_lounge',
    viewAngle: 'sleeping',
    facing: 'side',
    mirrored: false,
    pose: 'bed_sleeping',
    accessory: 'none',
    badgeLabel: '小木屋 · 暖榻 (安睡)',
    actionDesc: '在雪松原木幽香与温暖炉火微光中沉沉熟睡',
    offset: { dx: 0, dy: 26 },
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


export interface UnplacedPerson { personId: string; reason: 'room_full' | 'no_indoor_slot' }
export interface PresenceAllocation {
  slots: Record<FurnitureSlotId, ResolvedPresenceSlot>;
  personToSlot: Record<string, SceneSlotConfig>;
  unplaced: UnplacedPerson[];
}
export const ROOM_SLOT_CANDIDATES: Readonly<Record<RoomId, readonly FurnitureSlotId[]>> = {
  my_room: ['desk_workstation'], friend_room: ['sofa_lounge'],
  living_nook: ['tea_cushion_east', 'tea_cushion_west', 'tea_cushion_south'],
  capsule_pod: ['tatami_capsule'], corn_lounge: ['tatami_corn'],
  observatory: ['observatory_post'], porch_mailbox: [],
};
export const ROOM_FULL_MESSAGE = '该房间席位已满，状态已保留';
/** Each slot has capacity one. Room choice takes precedence over life state. */
export function resolvePresenceSlots(people: readonly Person[]): PresenceAllocation {
  const slots = Object.fromEntries(Object.entries(SCENE_SLOT_CONFIGS).map(([id, config]) =>
    [id, { config, occupant: null, isOccupied: false }])) as PresenceAllocation['slots'];
  const personToSlot: PresenceAllocation['personToSlot'] = {};
  const unplaced: UnplacedPerson[] = [];
  const seen = new Set<string>();
  for (const person of people) {
    if (seen.has(person.id)) continue;
    seen.add(person.id);
    const candidates = ROOM_SLOT_CANDIDATES[person.currentRoom];
    const id = candidates.find(id => !slots[id].isOccupied);
    if (!id) { unplaced.push({ personId: person.id, reason: candidates.length ? 'room_full' : 'no_indoor_slot' }); continue; }
    slots[id] = { config: SCENE_SLOT_CONFIGS[id], occupant: person, isOccupied: true };
    personToSlot[person.id] = slots[id].config;
  }
  return { slots, personToSlot, unplaced };
}
export function previewPresence(people: readonly Person[], personId: string, room: RoomId, state: Person['currentState']): PresenceAllocation {
  return resolvePresenceSlots(people.map(p => p.id === personId ? { ...p, currentRoom: room, currentState: state } : p));
}
export function isRoomFull(allocation: PresenceAllocation, personId: string): boolean {
  return allocation.unplaced.some(p => p.personId === personId && p.reason === 'room_full');
}
