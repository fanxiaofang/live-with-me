export type LifeStateId =
  | 'coding'
  | 'study'
  | 'reading'
  | 'writing'
  | 'eating'
  | 'resting'
  | 'walking'
  | 'dog_walking'
  | 'bath'
  | 'sleeping'
  | 'dazing'
  | 'listening_music'
  | 'tea_time'
  | 'outdoor'
  | 'stargazing';

export interface LifeState {
  id: LifeStateId;
  label: string;
  emoji: string;
  actionDesc: string; // e.g., "在敲代码写小工具", "在翻阅喜欢的短篇小说"
  roomDefault: RoomId;
  color: string;
}

export type RoomId = 'my_room' | 'friend_room' | 'living_nook' | 'porch_mailbox' | 'capsule_pod' | 'observatory' | 'corn_lounge';

export interface RoomInfo {
  id: RoomId;
  name: string;
  enName: string;
  desc: string;
}

export type GiftType = 'coffee' | 'plant' | 'tea' | 'cookie' | 'postcard' | 'book' | 'candle';

export interface GiftItem {
  id: GiftType;
  name: string;
  emoji: string;
  desc: string;
  shelfVisual: string;
}

export interface MailLetter {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  date: string;
  content: string;
  gift?: GiftType;
  read: boolean;
  replyToId?: string;
  type: 'letter' | 'note' | 'gift';
}

export interface Person {
  id: string;
  name: string;
  avatarColor: string;
  shirtColor: string;
  hairColor: string;
  skinColor?: string;
  beanieColor?: string;
  hairStyle?: string;
  hasPompom?: boolean;
  isSelf: boolean;
  currentRoom: RoomId;
  currentState: LifeStateId;
  stateNote?: string;
  sinceTime: string; // e.g. "已安静度过 42 分钟"
  favoriteItem: string;
  mailCount: number;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'dusk' | 'night' | 'rainy';

export interface TimePreset {
  id: TimeOfDay;
  label: string;
  subLabel: string;
  skyColor: string;
  ambientLight: string;
  ambientIntensity: number;
  sunLight: string;
  sunIntensity: number;
  lampIntensity: number;
  windowGlow: string;
  weather: 'clear' | 'rain';
}

export interface LivingMemory {
  id: string;
  title: string;
  desc: string;
  timestamp: string;
  participants: string[];
  icon: string;
}
