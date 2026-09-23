export type CabinetSlotId = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type CabinetItemType =
  | 'woven-basket-natural'
  | 'woven-basket-charcoal'
  | 'coffee-beans'
  | 'handleless-cups';

export interface CabinetSlotConfig {
  id: string;
  type: CabinetItemType;
  label?: string;
  note?: string;
}

export type CabinetSlotMap = Record<CabinetSlotId, CabinetSlotConfig>;

export interface CabinetSlotGeometry {
  slotId: CabinetSlotId;
  colIndex: number; // 0: left, 1: right
  rowIndex: number; // 0: top, 1: bottom
  // Front opening vertices
  frontTopLeft: { x: number; y: number };
  frontTopRight: { x: number; y: number };
  frontBottomRight: { x: number; y: number };
  frontBottomLeft: { x: number; y: number };
  // Interior backboard vertices
  backTopLeft: { x: number; y: number };
  backTopRight: { x: number; y: number };
  backBottomRight: { x: number; y: number };
  backBottomLeft: { x: number; y: number };
  // Center of floor surface (where items rest)
  floorCenter: { x: number; y: number };
  // Bounding widths
  widthProj: number;
  heightProj: number;
}

export const DEFAULT_CABINET_SLOTS: CabinetSlotMap = {
  'top-left': {
    id: 'coffee-set',
    type: 'coffee-beans',
    label: '一袋和一瓶咖啡豆',
    note: '手冲单品牛皮纸咖啡熟豆袋与盛满深烘焙咖啡豆的软木塞透明玻璃储豆罐。',
  },
  'top-right': {
    id: 'ceramic-cups',
    type: 'handleless-cups',
    label: '三个不一样的无耳朵咖啡杯',
    note: '三只器型与釉色各异的无把手手作陶杯：抹茶绿手拉坯高杯、暖陶土红釉矮杯与燕麦微瑕浓缩宽杯。',
  },
  'bottom-left': {
    id: 'basket-natural',
    type: 'woven-basket-natural',
    label: '粗麻绳草编框 · 细条纹亚麻衬',
    note: '参考图一左下：粗绳麦秆编织收纳框，搭配翻折蓝灰细条纹亚麻布衬与正中央粗麻绳打结拉手。',
  },
  'bottom-right': {
    id: 'basket-charcoal',
    type: 'woven-basket-charcoal',
    label: '深灰黑柳编框 · 鼠尾草灰绿布衬',
    note: '参考图一右下：深炭黑密织细柳编收纳框，搭配鼠尾草灰绿亚麻布衬与复古青铜半圆提手。',
  },
};
