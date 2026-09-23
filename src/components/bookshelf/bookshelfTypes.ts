import React from 'react';

/**
 * 2.5D 轴测书架数据结构与插槽定义
 */

export interface BookItemConfig {
  id: string;
  title: string;
  author?: string;
  color: string;            // 封面/书脊基色 (如 #bf432f)
  spineDarkColor?: string;  // 书脊阴影/侧面深色 (若不填则自动计算阴影)
  pageColor?: string;       // 纸张微黄泛白色 (默认 #faf4eb)
  thickness: number;        // 书厚 (沿层板轴宽度，如 2.5px ~ 6px)
  height: number;           // 书高 (垂直向上，如 7px ~ 13px)
  depth?: number;           // 进深 (轴测进深，默认 4.0px)
  tilt?: number;            // 倾斜角度 (如 0° 笔挺，7° 斜倚在邻书上)
  type?: 'stand' | 'stack'; // 立放 或 横卧堆叠
  stackCount?: number;      // 若为 stack，堆叠的书籍本数 (默认 1)
  bookmarkRibbon?: string;  // 可选的小丝带书签垂落颜色 (如 #d64545, #3b7d52, #f59e0b)
  isReading?: boolean;      // 是否正处于翻动/被阅读状态 (微光高亮)
  isPulled?: boolean;       // 是否被抽出/借阅 (留出虚线空位或抽出一段)
  note?: string;            // 随书便笺 / 题词 / 好友赠言
  donor?: string;           // 赠送者/所有者 (如 "林木", "小鱼", "我")
  offset?: number;          // 沿层板轴的水平进度或偏移 (0.0 ~ 1.0 或像素值)
}

export type DecorationType =
  | 'pinecone-basket' // 小松果竹编篓
  | 'trailing-ivy'    // 红陶垂蔓多肉植物
  | 'dry-vase'        // 粗陶细颈干花瓶 (黄金球与薰衣草)
  | 'brass-compass'   // 复古黄铜折叠罗盘
  | 'wooden-bird'     // 手作木雕鸣禽
  | 'stone-bookend'   // 天然原石书立
  | 'friend-letter'   // 好友手写留言信封
  | 'crystal-geode'   // 剔透微光矿石标本
  | 'ceramic-mug';    // 手作粗陶咖啡马克杯

export interface ShelfDecorationConfig {
  id: string;
  type: DecorationType;
  offset?: number;     // 沿层板的相对进度 (0.0 ~ 1.0)
  label?: string;      // 悬停/检视提示语
  customScale?: number;
  note?: string;
  giftFrom?: string;   // 谁留下的信物
}

export interface TierConfig {
  index: number; // 1 (底) 到 5 (顶)
  name?: string; // 层名称，如 "底层重典" | "主藏书架" | "植物与原石" | "诗集与木雕" | "皇冠顶台"
  books?: BookItemConfig[];
  decorations?: ShelfDecorationConfig[];
  customChildren?: React.ReactNode;
}

export type BookshelfPreset =
  | 'cozy'        // 经典温馨生活感 (原汁原味高质感复刻与增强)
  | 'empty'       // 新居搬入/极简空架 (纯净做旧大板，仅零星几本与嫩芽)
  | 'packed'      // 老学者满载书房 (密密麻麻大部头、堆叠典籍与各色书签)
  | 'reading_lin' // 林木借读状态 (第二层《沙之书》被抽走在懒人沙发读，留借阅便笺)
  | 'botanical';  // 自然手作与标本 (大量野外图鉴、松果、蔓藤、手写标本笺)
