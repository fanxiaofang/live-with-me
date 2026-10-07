import { ROOMS } from '../../data/initialData';
import { DEFAULT_ROOM_LAYOUT } from '../../components/layout-gizmo/layoutStore';
import type { Person } from '../../types';
import type { TierConfig } from '../../components/bookshelf/bookshelfTypes';
import type { InteractionTarget } from './interactionTypes';

export const ENTITY_REGISTRY: Readonly<Record<string, string>> = {
  tractor: '🚜 麦浪拖拉机 · 梯田里的丰收耕耘与南瓜丰收',
  mailbox: '📪 前廊木信箱 · 点击查看信件或留言',
  'alien-receiver': '📡 外星信号接收装置 · 频率 1420.405 MHz 监听深空（点击捕获电波）',
  'pasture-gate': '🚪 英伦传统五木杠栅栏门 · 经典的农夫手工斜撑牧场大门',
  'guardian-tree': '🌳 庄园百年守护树 · 见证岁月流转的古橡树（点击轻拂树梢听风）',
  'sheep-0': '🐑 约克郡黑脸羊 · 在西侧开阔草场安静吃草（点击互动）',
  'sheep-1': '🐑 约克郡黑脸羊 · 在向阳草坡上惬意打盹（点击互动）',
  'sheep-2': '🐑 约克郡母羊 · 在牧场大门旁照看着小羊（点击互动）',
  'sheep-3': '🐑 雀跃小羊羔 · 活蹦乱跳的黑脸小羊羔（点击互动）',
  'sheep-4': '🐑 山麓小羊 · 静立在石墙边迎风远眺（点击互动）',
};
export const POSTER_DESCRIPTIONS = {
  'young-woman': '海报:《泳者之心》· 手作木框艺术印画 (点击赏析)',
  'ancora-domani': '海报:《还有明天》· 手作木框艺术印画 (点击赏析)',
  paprika: '海报:《红辣椒》· 手作木框艺术印画 (点击赏析)',
  'pastoral-valley': '海报:《山谷与远行》· 英伦牧歌艺术印画 (点击赏析)',
} as const;
export interface DescriptionContext { people: readonly Person[]; tiers: readonly TierConfig[]; editing: boolean }
export function describeInteraction(target: InteractionTarget, context: DescriptionContext): string {
  switch (target.kind) {
    case 'room': return target.id === 'overview' ? '田园全景' : ROOMS[target.id].name;
    case 'person': { const p = context.people.find(p => p.id === target.id); return p?.isSelf ? '🌿 我 · 点击更新生活状态' : `${p?.name ?? '同住人'} · 点击查看状态与留下便笺`; }
    case 'poster': return POSTER_DESCRIPTIONS[target.id];
    case 'book': { const b = context.tiers.find(t => t.index === target.tierIndex)?.books?.find(b => b.id === target.id); return b ? `📖 《${b.title}》${b.author ? ` · ${b.author}` : ''}${b.isPulled ? ' (正在阅读中)' : ''}` : '📖 藏书 · 点击检视'; }
    case 'furniture-part': return `${DEFAULT_ROOM_LAYOUT[target.id].name}${context.editing ? ' (点击可调优坐标)' : ''}`;
    case 'entity': return ENTITY_REGISTRY[target.id] ?? context.tiers.flatMap(t => t.decorations ?? []).find(d => d.id === target.id)?.label ?? '原木书架摆件';
  }
}
