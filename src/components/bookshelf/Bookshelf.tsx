import React, { useMemo } from 'react';
import type { InteractionTarget } from '../../world/interactions/interactionTypes';
import { svgAction } from '../../world/interactions/svgAction';
import { EditableObjectId, IsoGizmo, RoomLayoutConfig } from '../layout-gizmo';
import { DEFAULT_ROOM_LAYOUT } from '../layout-gizmo/layoutStore';
import { BookItem } from './BookItem';
import {
BookItemConfig,
BookshelfPreset,
ShelfDecorationConfig,
TierConfig,
} from './bookshelfTypes';
import { RenderShelfDecoration } from './ShelfDecorations';
import {
PillarsTier1To2,
PillarsTier2To3,
PillarsTier3To4,
ShelfBaseFeet,
Tier1Plank,
Tier2Plank,
Tier3Plank,
Tier4CrownPlank,
getTierPosition,
} from './ShelfFrame';

/**
 * 经典预设数据配置库 (四层参数化原木书架)
 * 已将书架高度优化为四层，原第3层所有藏书与饰品均优雅重定位：
 * - 垂蔓多肉 -> 第 2 层左翼悬垂
 * - 溪流石书立 -> 第 1 层松果竹篓旁
 * - 陶艺手记与《时间的秩序》 -> 第 3 层诗集区
 */

// 1. 经典温馨生活感
export const PRESET_COZY_TIERS: TierConfig[] = [
  {
    index: 1,
    name: '底层重典与手作竹篓',
    books: [
      {
        id: 'tier1-botany-stack',
        title: '《群落植物与大地标本图鉴》',
        author: '植物学工作坊',
        color: '#3b5944',
        pageColor: '#ede8dc',
        thickness: 5,
        height: 6,
        depth: 4.5,
        type: 'stack',
        stackCount: 2,
        donor: '林木',
        note: '厚重的硬壳大开本，里面夹着秋天拾取的压花银杏与栎树叶。',
        offset: 190,
      },
    ],
    decorations: [
      {
        id: 'tier3-stone',
        type: 'stone-bookend',
        offset: 198,
        label: '天然风化溪流石书立',
        note: '河谷里捡回来的深灰青卵石，质地坚实温凉。',
      },
      {
        id: 'tier1-pinecones',
        type: 'pinecone-basket',
        offset: 206,
        label: '手工编织小松果篓',
        note: '去后山杉树林散步时捡拾的干松果，散发着干燥木质清香。',
      },
    ],
  },
  {
    index: 2,
    name: '经典藏书主展层与垂蔓',
    decorations: [
      {
        id: 'tier3-ivy',
        type: 'trailing-ivy',
        offset: 179,
        label: '微型红陶垂蔓多肉',
        note: '生机盎然的悬垂多肉，叶片饱满圆润，枝蔓安静垂在层板边沿。',
      },
    ],
    books: [
      {
        id: 'b-borges',
        title: '沙之书',
        author: '豪尔赫·路易斯·博尔赫斯',
        color: '#bf432f',
        pageColor: '#f5ede1',
        thickness: 2.5,
        height: 9.7,
        depth: 4.0,
        tilt: 0,
        donor: '林木',
        note: '“线条由无数个点组成；面由无数条线组成；书由无数页组成...没有第一页，也没有末页。”',
        offset: 188,
      },
      {
        id: 'b-walden',
        title: '瓦尔登湖手记',
        author: '亨利·戴维·梭罗',
        color: '#3d7d4f',
        pageColor: '#ecf5ee',
        thickness: 2.5,
        height: 9.0,
        depth: 4.0,
        tilt: 0,
        donor: '我',
        note: '“我步入丛林，因为我希望生活得从容自若，面对生活的本质。”',
        offset: 191.5,
      },
      {
        id: 'b-woodcraft',
        title: '造微入妙的榫卯与原木',
        author: '佚名老匠人',
        color: '#d99938',
        pageColor: '#fcf6e8',
        thickness: 2.2,
        height: 7.0,
        depth: 3.8,
        tilt: 0,
        donor: '小鱼',
        note: '记录了活边大板打磨、蜂蜡保养与传统木作智慧的手工书。',
        offset: 195,
      },
      {
        id: 'b-calvino',
        title: '看不见的城市',
        author: '伊塔洛·卡尔维诺',
        color: '#39608f',
        pageColor: '#edf3fa',
        thickness: 2.5,
        height: 7.3,
        depth: 4.0,
        tilt: 7, // 7° 斜倚在邻书上
        bookmarkRibbon: '#f59e0b',
        donor: '林木',
        note: '斜倚在书堆旁的精装薄册，留有一枚温润鹅黄色丝带书签。',
        offset: 198.5,
      },
    ],
  },
  {
    index: 3,
    name: '诗集、手记与手作木雕',
    books: [
      {
        id: 'b-poetry-1',
        title: '山居杂感与诗抄',
        author: '林中读者',
        color: '#4d7862',
        pageColor: '#f0f7f3',
        thickness: 2.2,
        height: 8.1,
        depth: 3.3,
        donor: '林木',
        offset: 188,
      },
      {
        id: 'b-poetry-2',
        title: '风、沙与星辰',
        author: '安托万·德·圣-埃克苏佩里',
        color: '#c49241',
        pageColor: '#fcf7ee',
        thickness: 2.2,
        height: 7.6,
        depth: 3.3,
        donor: '我',
        offset: 191.2,
      },
      {
        id: 'b-pottery',
        title: '海盐与陶器笔记',
        author: '小鱼手记',
        color: '#7a426f',
        pageColor: '#faedf8',
        thickness: 2.5,
        height: 9.2,
        depth: 3.5,
        donor: '小鱼',
        note: '小鱼在陶艺工房亲手烧制粗陶器皿与调制釉料的温润手稿。',
        offset: 194.5,
      },
      {
        id: 'b-time',
        title: '时间的秩序',
        author: '卡洛·罗韦利',
        color: '#ded5c5',
        pageColor: '#ffffff',
        thickness: 2.3,
        height: 8.2,
        depth: 3.2,
        donor: '我',
        note: '世界不是物体的集合，而是事件的集合。',
        offset: 197.8,
      },
    ],
    decorations: [
      {
        id: 'tier4-bird',
        type: 'wooden-bird',
        offset: 206,
        label: '手作木雕小鸣禽',
        note: '用废弃胡桃木块手工削出的小鸟雕刻，尾巴微微上扬。',
      },
    ],
  },
  {
    index: 4,
    name: '皇冠顶台与守望罗盘',
    decorations: [
      {
        id: 'tier5-vase-flowers',
        type: 'dry-vase',
        offset: 186,
        label: '粗陶细颈干花瓶',
        note: '插着金黄球花与淡紫薰衣草的粗陶素烧花瓶，散发阳光气味。',
      },
      {
        id: 'tier5-compass-device',
        type: 'brass-compass',
        offset: 206,
        label: '复古黄铜折叠罗盘',
        note: '远行勘测麦田与寻找北极星方位用的折叠黄铜航海指南针。',
      },
    ],
  },
];

// 2. 林木借阅状态 (《沙之书》被抽走至懒人沙发，留借阅插槽与便笺)
export const PRESET_READING_LIN_TIERS: TierConfig[] = PRESET_COZY_TIERS.map((tier) => {
  if (tier.index === 2 && tier.books) {
    return {
      ...tier,
      books: tier.books.map((b) =>
        b.id === 'b-borges'
          ? {
              ...b,
              isPulled: true,
              isReading: true,
              note: '林木正在懒人沙发里捧读《沙之书》，这里留下了刻有他名字的借书木签。',
            }
          : b
      ),
    };
  }
  return tier;
});

// 3. 新居搬入/极简空居 (纯净做旧大板，展现天然原木质感)
export const PRESET_EMPTY_TIERS: TierConfig[] = [
  {
    index: 1,
    name: '底层清空',
    books: [],
    decorations: [
      {
        id: 'dec-mug',
        type: 'ceramic-mug',
        offset: 192,
        label: '温热粗陶咖啡杯',
        note: '刚冲好的热黑咖啡，香气在空旷的原木书房里飘散。',
      },
    ],
  },
  {
    index: 2,
    name: '第一本入住之书',
    books: [
      {
        id: 'b-first',
        title: '新居生活手记',
        color: '#bf432f',
        thickness: 3.5,
        height: 10,
        donor: '我',
        note: '空白的麻布封面笔记本，等待在这里写下未来的四季记忆。',
        offset: 192,
      },
    ],
  },
  {
    index: 3,
    name: '嫩芽陪伴',
    decorations: [
      {
        id: 'tier3-ivy-empty',
        type: 'trailing-ivy',
        offset: 182,
        label: '初栽多肉',
      },
    ],
  },
  {
    index: 4,
    name: '顶台晶石',
    decorations: [
      {
        id: 'tier5-crystal',
        type: 'crystal-geode',
        offset: 196,
        label: '石英矿石标本',
      },
    ],
  },
];

// 4. 老学者满载书房 (密密麻麻大部头与书签飘落)
export const PRESET_PACKED_TIERS: TierConfig[] = [
  {
    index: 1,
    books: [
      {
        id: 'pk-t1-1',
        title: '《世界地理大通志》',
        color: '#2a4436',
        thickness: 6,
        height: 6,
        depth: 4.8,
        type: 'stack',
        stackCount: 3,
        offset: 188,
      },
    ],
    decorations: [
      {
        id: 'pk-letter',
        type: 'friend-letter',
        offset: 198,
        label: '小鱼手写信笺',
      },
      {
        id: 'pk-dec-basket',
        type: 'pinecone-basket',
        offset: 206,
        label: '满满一篓松果',
      },
    ],
  },
  {
    index: 2,
    decorations: [
      { id: 'pk-ivy', type: 'trailing-ivy', offset: 179 },
    ],
    books: [
      { id: 'pk-1', title: '追忆似水年华', color: '#8a2b2b', thickness: 2.8, height: 11, offset: 186 },
      { id: 'pk-2', title: '喧哗与骚动', color: '#bf432f', thickness: 2.2, height: 9.8, offset: 189 },
      { id: 'pk-3', title: '沙之书', color: '#993d28', thickness: 2.2, height: 9.0, offset: 191.5 },
      { id: 'pk-4', title: '瓦尔登湖手记', color: '#2b573a', thickness: 2.6, height: 9.2, offset: 194 },
      { id: 'pk-5', title: '天工开物', color: '#3d7d4f', thickness: 2.4, height: 8.6, offset: 197 },
      { id: 'pk-6', title: '营造法式考', color: '#d99938', thickness: 2.8, height: 8.0, offset: 200 },
      { id: 'pk-7', title: '看不见的城市', color: '#254873', thickness: 2.5, height: 7.5, tilt: 6, bookmarkRibbon: '#ef4444', offset: 203.5 },
    ],
  },
  {
    index: 3,
    books: [
      { id: 'pk-b-1', title: '草木记', color: '#577a45', thickness: 2.3, height: 8.5, offset: 187 },
      { id: 'pk-b-2', title: '昆虫记', color: '#385e33', thickness: 2.2, height: 8.2, offset: 189.5 },
      { id: 'pk-b-3', title: '时间的秩序', color: '#7a426f', thickness: 2.5, height: 9.4, bookmarkRibbon: '#10b981', offset: 192 },
      { id: 'pk-p-1', title: '波德莱尔恶之花', color: '#4d7862', thickness: 2.2, height: 8.2, offset: 195 },
      { id: 'pk-p-2', title: '里尔克诗选', color: '#3d5c4b', thickness: 2.3, height: 8.6, offset: 197.5 },
      { id: 'pk-p-5', title: '夜航西飞', color: '#684a8c', thickness: 2.2, height: 8.0, tilt: 5, offset: 200.5 },
    ],
    decorations: [
      { id: 'pk-bird', type: 'wooden-bird', offset: 206 },
    ],
  },
  {
    index: 4,
    decorations: [
      { id: 'pk-vase', type: 'dry-vase', offset: 185 },
      { id: 'pk-geode', type: 'crystal-geode', offset: 196 },
      { id: 'pk-compass', type: 'brass-compass', offset: 205 },
    ],
  },
];

// 5. 自然植物与野外学者 (标本、手账与蔓藤)
export const PRESET_BOTANICAL_TIERS: TierConfig[] = [
  {
    index: 1,
    books: [
      {
        id: 'bot-1',
        title: '《野生草木全志》',
        color: '#2e4d38',
        thickness: 5,
        height: 6,
        type: 'stack',
        stackCount: 2,
        offset: 189,
      },
    ],
    decorations: [
      { id: 'bot-stone', type: 'stone-bookend', offset: 198 },
      { id: 'bot-dec-basket', type: 'pinecone-basket', offset: 206 },
    ],
  },
  {
    index: 2,
    decorations: [
      { id: 'bot-ivy-main', type: 'trailing-ivy', offset: 179 },
      { id: 'bot-letter', type: 'friend-letter', offset: 205, label: '林木采茶归来留言' },
    ],
    books: [
      { id: 'bot-b1', title: '树木的秘密生命', color: '#386343', thickness: 2.8, height: 9.5, offset: 188 },
      { id: 'bot-b2', title: '植物知道生命的答案', color: '#4d7d59', thickness: 2.4, height: 8.8, offset: 191.5 },
      { id: 'bot-b3', title: '草木染手作记', color: '#d99938', thickness: 2.2, height: 7.4, offset: 195 },
      { id: 'bot-b4', title: '苔藓之书', color: '#2b573a', thickness: 2.5, height: 7.2, tilt: 7, bookmarkRibbon: '#84cc16', offset: 198.5 },
    ],
  },
  {
    index: 3,
    books: [
      { id: 'bot-b5', title: '溪谷苔原野外勘测', color: '#7a426f', thickness: 2.4, height: 8.8, offset: 188 },
      { id: 'bot-b6', title: '自然笔记与手绘', color: '#ded5c5', thickness: 2.2, height: 7.8, offset: 191.5 },
      { id: 'bot-b7', title: '林中空地', color: '#4d7862', thickness: 2.4, height: 8.0, offset: 195 },
      { id: 'bot-b8', title: '远山淡影', color: '#c49241', thickness: 2.2, height: 7.5, offset: 198.5 },
    ],
    decorations: [
      { id: 'bot-bird', type: 'wooden-bird', offset: 206 },
    ],
  },
  {
    index: 4,
    decorations: [
      { id: 'bot-dry-vase', type: 'dry-vase', offset: 185 },
      { id: 'bot-compass', type: 'brass-compass', offset: 205 },
    ],
  },
];

export interface BookshelfProps {
  preset?: BookshelfPreset;
  customTiers?: TierConfig[];
  selectedBookId?: string | null;
  selectedItemId?: string | null;
  onBookClick?: (book: BookItemConfig, tierIndex: number, e: React.MouseEvent) => void;
  onDecorationClick?: (decoration: ShelfDecorationConfig, tierIndex: number, e: React.MouseEvent) => void;
  onShelfClick?: (e: React.MouseEvent) => void;
  onHoverObject?: (target: InteractionTarget | null) => void;
  className?: string;
  isLinReadingHere?: boolean; // 若为 true，自动将《沙之书》呈现借出阅读态
  // --- 2.5D 校准系统 Props ---
  layout?: RoomLayoutConfig;
  activeGizmoId?: EditableObjectId | null;
  isInspectorOpen?: boolean;
  onSelectGizmo?: (id: EditableObjectId | null) => void;
  onDragGizmoDelta?: (dx: number, dy: number) => void;
  onDragGizmoEnd?: () => void;
}

export const SHELF_SLOT_IDS: EditableObjectId[] = [
  'shelf-vase',
  'shelf-compass',
  'shelf-tier3-books',
  'shelf-bird',
  'shelf-ivy',
  'shelf-tier2-books',
  'shelf-tier1-books',
  'shelf-stone',
  'shelf-basket',
];

export function getDecorationSlotId(
  dec: ShelfDecorationConfig,
  tierIndex: number
): EditableObjectId | null {
  if (tierIndex === 4) {
    if (dec.type === 'dry-vase' || dec.id.includes('vase')) return 'shelf-vase';
    if (dec.type === 'brass-compass' || dec.id.includes('compass')) return 'shelf-compass';
  }
  if (tierIndex === 3) {
    if (dec.type === 'wooden-bird' || dec.id.includes('bird')) return 'shelf-bird';
  }
  if (tierIndex === 2) {
    if (dec.type === 'trailing-ivy' || dec.id.includes('ivy')) return 'shelf-ivy';
  }
  if (tierIndex === 1) {
    if (dec.type === 'stone-bookend' || dec.id.includes('stone')) return 'shelf-stone';
    if (dec.type === 'pinecone-basket' || dec.id.includes('basket') || dec.id.includes('pinecone'))
      return 'shelf-basket';
  }
  return null;
}

export function getBooksSlotId(tierIndex: number): EditableObjectId | null {
  if (tierIndex === 1) return 'shelf-tier1-books';
  if (tierIndex === 2) return 'shelf-tier2-books';
  if (tierIndex === 3) return 'shelf-tier3-books';
  return null;
}

export const Bookshelf: React.FC<BookshelfProps> = ({
  preset = 'cozy',
  customTiers,
  selectedBookId,
  selectedItemId,
  onBookClick,
  onDecorationClick,
  onShelfClick,
  onHoverObject,
  className = '',
  isLinReadingHere = false,
  layout = DEFAULT_ROOM_LAYOUT,
  activeGizmoId,
  isInspectorOpen = false,
  onSelectGizmo,
  onDragGizmoDelta,
  onDragGizmoEnd,
}) => {
  // 当前解析的书架层级数据
  const tiers = useMemo<TierConfig[]>(() => {
    if (customTiers && customTiers.length > 0) {
      if (isLinReadingHere) {
        return customTiers.map((tier) => {
          if (tier.index === 2 && tier.books) {
            return {
              ...tier,
              books: tier.books.map((b) =>
                b.id === 'b-borges'
                  ? {
                      ...b,
                      isPulled: true,
                      isReading: true,
                      note: '林木正在懒人沙发里捧读《沙之书》，这里留下了刻有他名字的借书木签。',
                    }
                  : b
              ),
            };
          }
          return tier;
        });
      }
      return customTiers;
    }

    switch (preset) {
      case 'reading_lin':
        return PRESET_READING_LIN_TIERS;
      case 'empty':
        return PRESET_EMPTY_TIERS;
      case 'packed':
        return PRESET_PACKED_TIERS;
      case 'botanical':
        return PRESET_BOTANICAL_TIERS;
      case 'cozy':
      default:
        return isLinReadingHere ? PRESET_READING_LIN_TIERS : PRESET_COZY_TIERS;
    }
  }, [preset, customTiers, isLinReadingHere]);

  const isShelfChild = Boolean(
    isInspectorOpen && activeGizmoId && SHELF_SLOT_IDS.includes(activeGizmoId)
  );

  // 渲染某一层的内容物 (书籍与装饰摆件)
  const renderTierContents = (tierIndex: number) => {
    const tier = tiers.find((t) => t.index === tierIndex);
    if (!tier) return null;

    const vOffset = 0;

    // 当前层书籍槽位位移
    const bookSlotId = getBooksSlotId(tierIndex);
    let bookDeltaX = 0;
    let bookDeltaY = 0;
    if (bookSlotId && layout[bookSlotId].screen) {
      const defaultSlotX = DEFAULT_ROOM_LAYOUT[bookSlotId].screen.x;
      const defaultSlotY = DEFAULT_ROOM_LAYOUT[bookSlotId].screen.y;
      bookDeltaX = layout[bookSlotId].screen.x - defaultSlotX;
      bookDeltaY = layout[bookSlotId].screen.y - defaultSlotY;
    }

    return (
      <g id={`shelf-tier-${tierIndex}-contents`}>
        {/* 1. 书籍插槽 (Book Slots) */}
        <g {...svgAction('场景互动')}
          id={`shelf-tier-${tierIndex}-books-group`}
          transform={`translate(${bookDeltaX}, ${bookDeltaY})`}
          className={isInspectorOpen && bookSlotId ? 'cursor-pointer' : ''}
          onClick={(e) => {
            if (isInspectorOpen && bookSlotId) {
              e.stopPropagation();
              onSelectGizmo?.(activeGizmoId === bookSlotId ? null : bookSlotId);
            }
          }}
          onMouseEnter={(e) => {
            if (isInspectorOpen && bookSlotId) {
              e.stopPropagation();
              onHoverObject?.({ kind: 'furniture-part', id: bookSlotId });
            }
          }}
          onMouseLeave={() => {
            if (isInspectorOpen && bookSlotId) {
              onHoverObject?.(null);
            }
          }}
        >
          {tier.books?.map((book) => {
            const rawOffset = book.offset ?? 190;
            const pos = getTierPosition(tierIndex, rawOffset);
            const isSelected = selectedBookId === book.id || selectedItemId === book.id;

            return (
              <g
                key={book.id}
                transform={`translate(${pos.x}, ${pos.y + vOffset})`}
                onMouseEnter={(e) => {
                  if (!isInspectorOpen) {
                    e.stopPropagation();
                    onHoverObject?.(
                      { kind: 'book', id: book.id, tierIndex }
                    );
                  }
                }}
                onMouseLeave={() => {
                  if (!isInspectorOpen) {
                    onHoverObject?.(null);
                  }
                }}
              >
                <BookItem
                  config={book}
                  isSelected={isSelected}
                  onClick={(e) => {
                    if (isInspectorOpen && bookSlotId) {
                      e.stopPropagation();
                      onSelectGizmo?.(activeGizmoId === bookSlotId ? null : bookSlotId);
                    } else {
                      e.stopPropagation();
                      onBookClick?.(book, tierIndex, e);
                    }
                  }}
                />
              </g>
            );
          })}
        </g>

        {/* 2. 摆件插槽 (Decoration Slots) */}
        {tier.decorations?.map((dec) => {
          const slotId = getDecorationSlotId(dec, tierIndex);
          let pos: { x: number; y: number };
          if (slotId && layout[slotId].screen) {
            pos = {
              x: 193.0 + layout[slotId].screen.x,
              y: 124.0 + layout[slotId].screen.y,
            };
          } else {
            const rawOffset = dec.offset ?? 195;
            pos = getTierPosition(tierIndex, rawOffset);
          }
          const isSelected = selectedItemId === dec.id;

          return (
            <g {...svgAction('场景互动')}
              key={dec.id}
              transform={`translate(${pos.x}, ${pos.y + vOffset})`}
              className={isInspectorOpen && slotId ? 'cursor-pointer' : ''}
              onClick={(e) => {
                if (isInspectorOpen && slotId) {
                  e.stopPropagation();
                  onSelectGizmo?.(activeGizmoId === slotId ? null : slotId);
                } else {
                  e.stopPropagation();
                  onDecorationClick?.(dec, tierIndex, e);
                }
              }}
              onMouseEnter={(e) => {
                e.stopPropagation();
                if (isInspectorOpen && slotId) {
                  onHoverObject?.(
                    { kind: 'furniture-part', id: slotId }
                  );
                } else {
                  onHoverObject?.({ kind: 'entity', id: dec.id });
                }
              }}
              onMouseLeave={() => onHoverObject?.(null)}
            >
              <RenderShelfDecoration
                config={dec}
                isSelected={isSelected}
                onClick={(e) => {
                  if (isInspectorOpen && slotId) {
                    e.stopPropagation();
                    onSelectGizmo?.(activeGizmoId === slotId ? null : slotId);
                  } else {
                    e.stopPropagation();
                    onDecorationClick?.(dec, tierIndex, e);
                  }
                }}
              />
            </g>
          );
        })}

        {/* 3. 自定义注入节点 (如好友手写便笺挂坠) */}
        {tier.customChildren}
      </g>
    );
  };

  return (
    <g {...svgAction('检视与管理书架')}
      id="isometric-bookshelf"
      className={`select-none cursor-pointer group/bookshelf ${className}`}
      onClick={(e) => {
        if (isInspectorOpen) {
          e.stopPropagation();
          onSelectGizmo?.(activeGizmoId === 'bookshelf-group' ? null : 'bookshelf-group');
        } else {
          onShelfClick?.(e);
        }
      }}
      onMouseEnter={() =>
        onHoverObject?.(
          { kind: 'furniture-part', id: 'bookshelf-group' }
        )
      }
      onMouseLeave={() => onHoverObject?.(null)}
    >
      {/* 1. 地面接触阴影与底座粗矮原木桩脚 */}
      <ShelfBaseFeet />

      {/* 2. TIER 1 (底层大板 -> 底层内容物 -> 承托1至2立柱) */}
      <Tier1Plank />
      {renderTierContents(1)}
      <PillarsTier1To2 />

      {/* 3. TIER 2 (第2层大板 -> 藏书主展区与垂蔓多肉 -> 承托2至3立柱) */}
      <Tier2Plank />
      {renderTierContents(2)}
      <PillarsTier2To3 />

      {/* 4. TIER 3 (第3层大板 -> 诗集、陶艺手记与木雕鸣禽 -> 承托3至4立柱) */}
      <Tier3Plank />
      {renderTierContents(3)}
      <PillarsTier3To4 />

      {/* 5. TIER 4 (皇冠原木顶板 -> 粗陶干花瓶与复古罗盘) */}
      <Tier4CrownPlank />
      {renderTierContents(4)}

      {/* 6. 可视化 2.5D 轴测 Gizmo 把手 (当选中属于书架上的各个槽位时在书架局部渲染) */}
      {layout && isShelfChild && activeGizmoId && (
        <IsoGizmo
          pos={{
            x: 193.0 + layout[activeGizmoId].screen.x,
            y: 124.0 + layout[activeGizmoId].screen.y,
          }}
          displayCoords={layout[activeGizmoId].screen}
          fixedW={layout[activeGizmoId].fixedW}
          objectName={layout[activeGizmoId].name}
          onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
          onDragEnd={() => onDragGizmoEnd?.()}
        />
      )}
    </g>
  );
};
