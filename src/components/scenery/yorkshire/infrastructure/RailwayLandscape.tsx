import React from 'react';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';
import { YorkshireCommonProps } from '../landscapeTypes';

/**
 * 🚂 RailwayLandscape (Ribblehead Viaduct · Symmetrical Fade & Subtle Ethereal Air Barriers)
 *
 * Layer: 05 INFRASTRUCTURE / Railway
 * Spatial Region: YORKSHIRE_LAYOUT.railway
 *
 * 用户精准审美重构 (极简超自然空气结界与纯净通透):
 * 1. 彻底拆除西侧笨重大水泥墙 (No Concrete Wall / Abutment):
 *    - 消除西端所有生硬的水泥大斜块与直角切坡。
 *    - 西端与东端同构，完全回归自然舒展的石拱高架桥。
 * 2. 两端平滑透明化渐变 (Symmetrical Smooth Opacity Fade to Transparent):
 *    - 西侧从 Pier 0 (x=-685) 向西延伸至 x=-735，桥体/铁轨/栏杆 100% -> 0% 渐渐透明化。
 *    - 东侧从 Pier 7 (x=50) 向东延伸至 x=100，桥体/铁轨/栏杆 100% -> 0% 渐渐透明化。
 * 3. 彻底告别夸张大白光朵云，替换为“薄薄的空气结界” (Subtle Ethereal Air Barriers):
 *    - 移除所有厚重不透明的大白云团与烟雾包。
 *    - 在西端 (x=-735) 与东端 (x=100) 尾端设置极为轻盈、半透明的竖向微光空气结界 (Air Barrier Membrane)。
 *    - 带有微弱晶亮空气折射环、极细光棱与微光光晕，宛如水波般薄透的次元结界，神秘且极具高级感。
 * 4. 8 座石砌桥墩与 7 跨舒展大石拱:
 *    - 纯正的水平桥面 (y=175)，罗马圆拱跨距 105px、净跨 87px。
 *    - 麦浪与草甸在石拱下方无遮挡穿流，全景视野纯净开阔。
 */
interface PierFlowerDef {
  x: number;
  y: number;
  stemEnd: [number, number];
  stemCurve: [number, number];
  petalColor: string;
  centerColor: string;
  size: number;
  delayOffset: number;
}

interface PierLobeDef {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  tone: 'base' | 'mid' | 'top' | 'accent';
}

interface PierBushDef {
  offsetX: number;
  scaleX: number;
  scaleY: number;
  baseColor: string;
  midColor: string;
  topColor: string;
  accentColor?: string;
  lobes: PierLobeDef[];
  flowers?: PierFlowerDef[];
  bladeAccent?: { d: string; color: string };
}

interface PierCenterGrassDef {
  scale: number;
  delayOffset: number;
  bladesD1: string;
  bladesD2: string;
  stroke1: string;
  stroke2: string;
  flower?: { x: number; y: number; r: number; fill: string; stemD: string };
}

interface PierFoliageConfig {
  leftBush: PierBushDef;
  rightBush: PierBushDef;
  centerGrass: PierCenterGrassDef;
}

// 8 座石砌桥墩差异化灌木与地被野花微生态配置 (Differentiated foliage per pier)
const PIER_FOLIAGE_CONFIGS: PierFoliageConfig[] = [
  // 0: Pier 0 (x=-685) - 西侧结界旁，轻盈紧凑石楠丛，左小白花，右双金毛茛
  {
    leftBush: {
      offsetX: -3,
      scaleX: 0.88,
      scaleY: 0.86,
      baseColor: '#2d3f18',
      midColor: '#3e5821',
      topColor: '#54782c',
      lobes: [
        { cx: -1.8, cy: -2.2, rx: 5.5, ry: 3.8, tone: 'base' },
        { cx: 1.0, cy: -1.8, rx: 5.0, ry: 3.6, tone: 'mid' },
        { cx: -0.8, cy: -4.2, rx: 4.2, ry: 3.0, tone: 'top' },
      ],
      flowers: [
        { x: -4, y: -9, stemEnd: [-4, -9], stemCurve: [-2, -5], petalColor: '#ffffff', centerColor: '#eab308', size: 1.8, delayOffset: 0 },
      ],
      bladeAccent: { d: 'M1,0 Q3,-4 4,-7', color: '#456725' },
    },
    rightBush: {
      offsetX: 4,
      scaleX: 1.15,
      scaleY: 1.08,
      baseColor: '#283b15',
      midColor: '#3a541e',
      topColor: '#507229',
      lobes: [
        { cx: 2.8, cy: -2.6, rx: 7.2, ry: 4.8, tone: 'base' },
        { cx: -0.5, cy: -2.0, rx: 6.2, ry: 4.2, tone: 'mid' },
        { cx: 1.8, cy: -5.2, rx: 5.4, ry: 3.8, tone: 'top' },
        { cx: 4.5, cy: -3.8, rx: 4.8, ry: 3.2, tone: 'top' },
      ],
      flowers: [
        { x: 3, y: -11, stemEnd: [3, -11], stemCurve: [2, -6], petalColor: '#facc15', centerColor: '#ca8a04', size: 1.8, delayOffset: 0.15 },
        { x: 7, y: -8, stemEnd: [7, -8], stemCurve: [5, -4], petalColor: '#fef08a', centerColor: '#ca8a04', size: 1.5, delayOffset: 0.35 },
      ],
      bladeAccent: { d: 'M-2,0 Q-4,-4 -3,-7', color: '#456725' },
    },
    centerGrass: {
      scale: 0.9,
      delayOffset: 0.1,
      bladesD1: 'M-3,0 Q-4,-4 -6,-6 M-1,0 Q-1,-5 -2,-7 M2,0 Q3,-4 4,-7',
      bladesD2: 'M-2,0 Q-3,-4 -3,-6 M1,0 Q2,-4 2,-7',
      stroke1: '#486826',
      stroke2: '#739a38',
    },
  },
  // 1: Pier 1 (x=-580) - 谷底低洼湿地，丰茂双冠灌木，双白雏菊，深墨绿厚灌
  {
    leftBush: {
      offsetX: -4,
      scaleX: 1.25,
      scaleY: 1.22,
      baseColor: '#263814',
      midColor: '#38511c',
      topColor: '#4d6e26',
      accentColor: '#5e8530',
      lobes: [
        { cx: -3.5, cy: -3.0, rx: 7.5, ry: 5.2, tone: 'base' },
        { cx: 1.5, cy: -2.2, rx: 6.5, ry: 4.6, tone: 'mid' },
        { cx: -2.5, cy: -5.8, rx: 5.8, ry: 4.0, tone: 'top' },
        { cx: 2.0, cy: -5.2, rx: 5.0, ry: 3.5, tone: 'accent' },
      ],
      flowers: [
        { x: -5, y: -13, stemEnd: [-5, -13], stemCurve: [-3, -7], petalColor: '#ffffff', centerColor: '#eab308', size: 2.0, delayOffset: 0.05 },
        { x: 0, y: -12, stemEnd: [0, -12], stemCurve: [0, -6], petalColor: '#ffffff', centerColor: '#eab308', size: 1.7, delayOffset: 0.25 },
      ],
      bladeAccent: { d: 'M-5,0 Q-7,-5 -8,-8', color: '#38521c' },
    },
    rightBush: {
      offsetX: 3,
      scaleX: 0.96,
      scaleY: 0.92,
      baseColor: '#223211',
      midColor: '#324719',
      topColor: '#446023',
      lobes: [
        { cx: 2.0, cy: -2.2, rx: 5.8, ry: 4.0, tone: 'base' },
        { cx: -0.5, cy: -1.8, rx: 5.2, ry: 3.6, tone: 'mid' },
        { cx: 1.2, cy: -4.2, rx: 4.5, ry: 3.2, tone: 'top' },
      ],
      flowers: [
        { x: 3, y: -9, stemEnd: [3, -9], stemCurve: [2, -5], petalColor: '#facc15', centerColor: '#ca8a04', size: 1.7, delayOffset: 0.2 },
      ],
    },
    centerGrass: {
      scale: 1.15,
      delayOffset: 0.18,
      bladesD1: 'M-5,0 Q-6,-5 -8,-8 M-2,0 Q-2,-6 -3,-9 M2,0 Q3,-6 5,-9 M6,0 Q8,-5 9,-7',
      bladesD2: 'M-3,0 Q-4,-5 -5,-8 M1,0 Q2,-6 3,-9',
      stroke1: '#3d5920',
      stroke2: '#688c32',
      flower: { x: 5, y: -10, r: 1.4, fill: '#facc15', stemD: 'M2,0 Q3,-5 5,-10' },
    },
  },
  // 2: Pier 2 (x=-475) - 谷底向阳缓坡，左侧舒展，右侧阶梯石楠带石南淡紫花蕾
  {
    leftBush: {
      offsetX: -4,
      scaleX: 1.12,
      scaleY: 0.96,
      baseColor: '#2b3e17',
      midColor: '#3e5822',
      topColor: '#54772d',
      lobes: [
        { cx: -3.0, cy: -2.2, rx: 7.0, ry: 4.2, tone: 'base' },
        { cx: 1.8, cy: -1.8, rx: 6.0, ry: 3.8, tone: 'mid' },
        { cx: -1.0, cy: -4.5, rx: 5.2, ry: 3.4, tone: 'top' },
      ],
      flowers: [
        { x: -3, y: -10, stemEnd: [-3, -10], stemCurve: [-2, -5], petalColor: '#facc15', centerColor: '#ca8a04', size: 1.8, delayOffset: 0.1 },
      ],
      bladeAccent: { d: 'M2,0 Q4,-4 5,-7', color: '#486826' },
    },
    rightBush: {
      offsetX: 3,
      scaleX: 1.2,
      scaleY: 1.14,
      baseColor: '#273915',
      midColor: '#39531e',
      topColor: '#4f7029',
      lobes: [
        { cx: 2.5, cy: -2.5, rx: 6.8, ry: 4.8, tone: 'base' },
        { cx: -0.8, cy: -2.0, rx: 5.8, ry: 4.0, tone: 'mid' },
        { cx: 2.0, cy: -5.4, rx: 5.2, ry: 3.6, tone: 'top' },
        { cx: 5.0, cy: -3.5, rx: 4.2, ry: 3.0, tone: 'mid' },
      ],
      flowers: [
        { x: 3, y: -12, stemEnd: [3, -12], stemCurve: [2, -6], petalColor: '#ffffff', centerColor: '#eab308', size: 1.85, delayOffset: 0.12 },
        { x: 7, y: -8, stemEnd: [7, -8], stemCurve: [5, -4], petalColor: '#e9d5ff', centerColor: '#a855f7', size: 1.4, delayOffset: 0.28 },
      ],
    },
    centerGrass: {
      scale: 1.05,
      delayOffset: 0.14,
      bladesD1: 'M-4,0 Q-5,-4 -7,-7 M-1,0 Q-2,-5 -2,-8 M2,0 Q4,-5 5,-8 M5,0 Q7,-4 7,-6',
      bladesD2: 'M-2,0 Q-3,-4 -4,-7 M1,0 Q2,-5 3,-8',
      stroke1: '#446424',
      stroke2: '#6e9435',
    },
  },
  // 3: Pier 3 (x=-370) - 强烈非对称对比：左侧茂密高耸大黑刺丛，右侧贴石极小矮灌
  {
    leftBush: {
      offsetX: -5,
      scaleX: 1.3,
      scaleY: 1.26,
      baseColor: '#253713',
      midColor: '#364f1c',
      topColor: '#4b6c26',
      accentColor: '#5c812f',
      lobes: [
        { cx: -3.5, cy: -3.2, rx: 7.8, ry: 5.4, tone: 'base' },
        { cx: 1.5, cy: -2.4, rx: 6.8, ry: 4.6, tone: 'mid' },
        { cx: -2.8, cy: -6.2, rx: 6.0, ry: 4.2, tone: 'top' },
        { cx: 2.2, cy: -5.0, rx: 4.8, ry: 3.6, tone: 'accent' },
      ],
      flowers: [
        { x: -5, y: -13, stemEnd: [-5, -13], stemCurve: [-3, -7], petalColor: '#ffffff', centerColor: '#eab308', size: 2.05, delayOffset: 0.08 },
        { x: 1, y: -11, stemEnd: [1, -11], stemCurve: [1, -6], petalColor: '#ffffff', centerColor: '#eab308', size: 1.75, delayOffset: 0.3 },
      ],
      bladeAccent: { d: 'M-6,0 Q-8,-4 -9,-8', color: '#38521c' },
    },
    rightBush: {
      offsetX: 2,
      scaleX: 0.74,
      scaleY: 0.75,
      baseColor: '#2c3e18',
      midColor: '#3e5822',
      topColor: '#54762d',
      lobes: [
        { cx: 1.5, cy: -1.8, rx: 4.5, ry: 3.2, tone: 'base' },
        { cx: 0.0, cy: -1.4, rx: 3.8, ry: 2.8, tone: 'mid' },
        { cx: 1.0, cy: -3.2, rx: 3.2, ry: 2.4, tone: 'top' },
      ],
      flowers: [
        { x: 2, y: -7, stemEnd: [2, -7], stemCurve: [1, -4], petalColor: '#ffffff', centerColor: '#eab308', size: 1.4, delayOffset: 0.18 },
      ],
    },
    centerGrass: {
      scale: 0.85,
      delayOffset: 0.12,
      bladesD1: 'M-3,0 Q-4,-3 -5,-5 M-1,0 Q-1,-4 -2,-6 M2,0 Q2,-4 3,-6 M4,0 Q5,-3 6,-5',
      bladesD2: 'M-2,0 Q-2,-3 -3,-5 M1,0 Q1,-4 2,-6',
      stroke1: '#4a6b28',
      stroke2: '#759d39',
    },
  },
  // 4: Pier 4 (x=-265) - 阳光充裕区，金绿暖调圆润灌木，左金毛茛，右双白花
  {
    leftBush: {
      offsetX: -3,
      scaleX: 1.06,
      scaleY: 1.05,
      baseColor: '#304418',
      midColor: '#435e23',
      topColor: '#597d2e',
      lobes: [
        { cx: -2.0, cy: -2.4, rx: 6.5, ry: 4.4, tone: 'base' },
        { cx: 1.2, cy: -1.8, rx: 5.8, ry: 4.0, tone: 'mid' },
        { cx: -0.6, cy: -4.8, rx: 5.0, ry: 3.5, tone: 'top' },
      ],
      flowers: [
        { x: -3, y: -11, stemEnd: [-3, -11], stemCurve: [-2, -6], petalColor: '#facc15', centerColor: '#ca8a04', size: 1.85, delayOffset: 0.05 },
      ],
      bladeAccent: { d: 'M1,0 Q3,-4 3,-7', color: '#4c6e28' },
    },
    rightBush: {
      offsetX: 4,
      scaleX: 1.18,
      scaleY: 1.12,
      baseColor: '#283b16',
      midColor: '#3c5620',
      topColor: '#51732a',
      lobes: [
        { cx: 2.6, cy: -2.6, rx: 7.0, ry: 4.8, tone: 'base' },
        { cx: -0.6, cy: -2.0, rx: 6.0, ry: 4.2, tone: 'mid' },
        { cx: 1.8, cy: -5.2, rx: 5.4, ry: 3.8, tone: 'top' },
        { cx: 4.8, cy: -3.6, rx: 4.5, ry: 3.2, tone: 'top' },
      ],
      flowers: [
        { x: 2, y: -12, stemEnd: [2, -12], stemCurve: [1, -6], petalColor: '#ffffff', centerColor: '#eab308', size: 1.9, delayOffset: 0.1 },
        { x: 6, y: -9, stemEnd: [6, -9], stemCurve: [5, -5], petalColor: '#ffffff', centerColor: '#eab308', size: 1.55, delayOffset: 0.32 },
      ],
    },
    centerGrass: {
      scale: 1.1,
      delayOffset: 0.16,
      bladesD1: 'M-4,0 Q-5,-5 -7,-8 M-1,0 Q-1,-6 -2,-9 M2,0 Q3,-6 4,-9 M5,0 Q7,-5 8,-7',
      bladesD2: 'M-2,0 Q-3,-5 -4,-8 M1,0 Q2,-6 2,-9',
      stroke1: '#436323',
      stroke2: '#6d9234',
    },
  },
  // 5: Pier 5 (x=-160) - 阳光充足向阳坡，右倾舒展大灌木，三朵繁花，左低平矮丛
  {
    leftBush: {
      offsetX: -2,
      scaleX: 0.8,
      scaleY: 0.82,
      baseColor: '#2c3f18',
      midColor: '#3e5822',
      topColor: '#53762d',
      lobes: [
        { cx: -1.5, cy: -1.8, rx: 5.0, ry: 3.5, tone: 'base' },
        { cx: 0.8, cy: -1.5, rx: 4.2, ry: 3.0, tone: 'mid' },
        { cx: -0.5, cy: -3.5, rx: 3.6, ry: 2.6, tone: 'top' },
      ],
      flowers: [
        { x: -2, y: -8, stemEnd: [-2, -8], stemCurve: [-1, -4], petalColor: '#ffffff', centerColor: '#eab308', size: 1.5, delayOffset: 0.2 },
      ],
    },
    rightBush: {
      offsetX: 5,
      scaleX: 1.28,
      scaleY: 1.22,
      baseColor: '#293c15',
      midColor: '#3b551f',
      topColor: '#51742a',
      accentColor: '#638c33',
      lobes: [
        { cx: 3.2, cy: -2.8, rx: 7.5, ry: 5.2, tone: 'base' },
        { cx: -0.5, cy: -2.2, rx: 6.2, ry: 4.4, tone: 'mid' },
        { cx: 2.2, cy: -5.6, rx: 5.6, ry: 4.0, tone: 'top' },
        { cx: 5.5, cy: -4.2, rx: 4.8, ry: 3.4, tone: 'accent' },
      ],
      flowers: [
        { x: 3, y: -13, stemEnd: [3, -13], stemCurve: [2, -7], petalColor: '#facc15', centerColor: '#ca8a04', size: 1.95, delayOffset: 0.05 },
        { x: 7, y: -10, stemEnd: [7, -10], stemCurve: [5, -5], petalColor: '#facc15', centerColor: '#ca8a04', size: 1.65, delayOffset: 0.28 },
        { x: 0, y: -8, stemEnd: [0, -8], stemCurve: [0, -4], petalColor: '#ffffff', centerColor: '#eab308', size: 1.35, delayOffset: 0.4 },
      ],
      bladeAccent: { d: 'M-1,0 Q-3,-4 -3,-7', color: '#466725' },
    },
    centerGrass: {
      scale: 1.02,
      delayOffset: 0.15,
      bladesD1: 'M-3,0 Q-4,-4 -5,-7 M-1,0 Q-1,-5 -1,-8 M2,0 Q3,-5 5,-8 M6,0 Q8,-4 9,-6',
      bladesD2: 'M-2,0 Q-2,-4 -3,-7 M1,0 Q2,-5 3,-8',
      stroke1: '#476826',
      stroke2: '#719736',
    },
  },
  // 6: Pier 6 (x=-55) - 近景主墩，挺拔黑刺丛双白雏菊，右侧舒展石缝草花
  {
    leftBush: {
      offsetX: -4,
      scaleX: 1.22,
      scaleY: 1.26,
      baseColor: '#253814',
      midColor: '#364f1c',
      topColor: '#4b6c26',
      lobes: [
        { cx: -2.8, cy: -3.0, rx: 7.2, ry: 5.0, tone: 'base' },
        { cx: 1.5, cy: -2.2, rx: 6.2, ry: 4.4, tone: 'mid' },
        { cx: -1.8, cy: -6.0, rx: 5.5, ry: 4.0, tone: 'top' },
        { cx: 2.0, cy: -4.8, rx: 4.6, ry: 3.4, tone: 'top' },
      ],
      flowers: [
        { x: -4, y: -13, stemEnd: [-4, -13], stemCurve: [-2, -7], petalColor: '#ffffff', centerColor: '#eab308', size: 2.0, delayOffset: 0.08 },
        { x: 1, y: -11, stemEnd: [1, -11], stemCurve: [1, -6], petalColor: '#ffffff', centerColor: '#eab308', size: 1.75, delayOffset: 0.28 },
      ],
      bladeAccent: { d: 'M-4,0 Q-6,-4 -7,-7', color: '#39531d' },
    },
    rightBush: {
      offsetX: 3,
      scaleX: 1.08,
      scaleY: 0.98,
      baseColor: '#2d4018',
      midColor: '#3f5922',
      topColor: '#55782d',
      lobes: [
        { cx: 2.5, cy: -2.2, rx: 6.6, ry: 4.4, tone: 'base' },
        { cx: -0.5, cy: -1.8, rx: 5.8, ry: 3.8, tone: 'mid' },
        { cx: 1.5, cy: -4.5, rx: 5.0, ry: 3.4, tone: 'top' },
      ],
      flowers: [
        { x: 4, y: -10, stemEnd: [4, -10], stemCurve: [3, -5], petalColor: '#facc15', centerColor: '#ca8a04', size: 1.8, delayOffset: 0.15 },
      ],
      bladeAccent: { d: 'M-1,0 Q-3,-3 -2,-6', color: '#476826' },
    },
    centerGrass: {
      scale: 1.12,
      delayOffset: 0.18,
      bladesD1: 'M-4,0 Q-6,-5 -8,-8 M-1,0 Q-1,-6 -2,-9 M2,0 Q3,-6 4,-9 M5,0 Q7,-5 8,-7',
      bladesD2: 'M-2,0 Q-3,-5 -4,-8 M1,0 Q2,-6 3,-9',
      stroke1: '#416122',
      stroke2: '#6a8f33',
    },
  },
  // 7: Pier 7 (x=50) - 东端结界边，温和轻柔微小灌木，融入结界微光
  {
    leftBush: {
      offsetX: -3,
      scaleX: 0.95,
      scaleY: 0.92,
      baseColor: '#2d4018',
      midColor: '#405b22',
      topColor: '#567a2f',
      lobes: [
        { cx: -1.8, cy: -2.2, rx: 5.8, ry: 4.0, tone: 'base' },
        { cx: 1.0, cy: -1.8, rx: 5.0, ry: 3.5, tone: 'mid' },
        { cx: -0.6, cy: -4.4, rx: 4.4, ry: 3.0, tone: 'top' },
      ],
      flowers: [
        { x: -3, y: -9, stemEnd: [-3, -9], stemCurve: [-2, -5], petalColor: '#ffffff', centerColor: '#eab308', size: 1.7, delayOffset: 0.1 },
      ],
      bladeAccent: { d: 'M1,0 Q2,-4 3,-7', color: '#476826' },
    },
    rightBush: {
      offsetX: 3,
      scaleX: 0.88,
      scaleY: 0.86,
      baseColor: '#30441a',
      midColor: '#436024',
      topColor: '#5a7f32',
      lobes: [
        { cx: 2.0, cy: -2.0, rx: 5.2, ry: 3.6, tone: 'base' },
        { cx: -0.5, cy: -1.6, rx: 4.6, ry: 3.2, tone: 'mid' },
        { cx: 1.2, cy: -3.8, rx: 4.0, ry: 2.8, tone: 'top' },
      ],
      flowers: [
        { x: 3, y: -8, stemEnd: [3, -8], stemCurve: [2, -4], petalColor: '#fef08a', centerColor: '#ca8a04', size: 1.5, delayOffset: 0.25 },
      ],
    },
    centerGrass: {
      scale: 0.9,
      delayOffset: 0.1,
      bladesD1: 'M-3,0 Q-4,-4 -5,-6 M-1,0 Q-1,-5 -2,-7 M2,0 Q3,-4 4,-7',
      bladesD2: 'M-2,0 Q-2,-4 -3,-6 M1,0 Q1,-4 2,-7',
      stroke1: '#4a6b28',
      stroke2: '#759d39',
    },
  },
];

export const RailwayLandscape: React.FC<YorkshireCommonProps> = React.memo(({ theme, className }) => {
  const layout = YORKSHIRE_LAYOUT.railway;
  // 8 个石砌桥墩中心间距 105px，构成 7 跨完整舒展石拱
  const piers = React.useMemo(() => [
    ...layout.piers, // [-685, -580, -475, -370, -265, -160, -55]
    50,              // Pier 7 at x = 50
  ], [layout.piers]);

  const PIER_WIDTH = 18;

  // 桥墩接地高度匹配谷地微地形起伏
  const PIER_BASE_Y = [226, 233, 231, 229, 227, 225, 222, 222];

  // 桥面水平基准线与两端消隐端点
  const DECK_Y = 175;
  const WEST_BARRIER_X = -735;
  const EAST_BARRIER_X = 100;

  // 7 跨标准 87px 宏大连续石拱 (Pier 0 至 Pier 7)
  const ARCH_SPANS = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < piers.length - 1; i++) {
      list.push({
        spanLeft: piers[i] + PIER_WIDTH,
        spanRight: piers[i + 1],
      });
    }
    return list;
  }, [piers]);

  // 桥面轨枕序列：每 5.5px 一根，贯穿两端结界
  const sleeperPositions = React.useMemo(() => {
    const list: number[] = [];
    for (let x = WEST_BARRIER_X + 4; x <= EAST_BARRIER_X - 4; x += 5.5) {
      list.push(Math.round(x * 10) / 10);
    }
    return list;
  }, [WEST_BARRIER_X, EAST_BARRIER_X]);

  return (
    <g id="yorkshire-railway-viaduct" className={className}>
      <defs>
        {/* 桥体温暖灰砂岩受光面 (Sunlit Stone) */}
        <linearGradient id="viaductSunlitStoneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfc8bd" />
          <stop offset="40%" stopColor="#c2baa9" />
          <stop offset="100%" stopColor="#b0a797" />
        </linearGradient>

        {/* 拱圈三角拱肩实面渐变 (Arch Spandrel Masonry) */}
        <linearGradient id="viaductSpandrelGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c6bfa9" />
          <stop offset="100%" stopColor="#aca494" />
        </linearGradient>

        {/* 桥墩向阳主立面立体明暗 */}
        <linearGradient id="pierFrontFacetGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c9c2b4" />
          <stop offset="80%" stopColor="#bdb5a7" />
          <stop offset="100%" stopColor="#b3ab9d" />
        </linearGradient>

        {/* 桥墩右侧轴测阴影切面 */}
        <linearGradient id="pierShadowFacetGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8d8477" />
          <stop offset="100%" stopColor="#7a7266" />
        </linearGradient>

        {/* 3D 拱腹内侧透视进深阴影面 */}
        <linearGradient id="viaductArchSoffitGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#787063" />
          <stop offset="100%" stopColor="#5e574c" />
        </linearGradient>

        {/* ✨ 两端自然透明化消融遮罩渐变 (Symmetrical Linear Opacity Mask) */}
        {/* 在西侧 x=-735 到 -685，由 0% 平滑过渡至 100%；在东侧 x=50 到 100，由 100% 平滑过渡至 0% */}
        <linearGradient
          id="viaductGlobalFadeGrad"
          x1={WEST_BARRIER_X}
          y1="0"
          x2={EAST_BARRIER_X}
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          {/* 西端渐变消隐: x=-735 为 0, x=-685 为 1 */}
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="6.0%" stopColor="#ffffff" stopOpacity="1" />
          {/* 中间桥体 100% 实心 */}
          <stop offset="94.0%" stopColor="#ffffff" stopOpacity="1" />
          {/* 东端渐变消隐: x=50 为 1, x=100 为 0 */}
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <mask id="viaductEndsFadeMask">
          <rect
            x={WEST_BARRIER_X - 20}
            y="140"
            width={EAST_BARRIER_X - WEST_BARRIER_X + 40}
            height="110"
            fill="url(#viaductGlobalFadeGrad)"
          />
        </mask>

        {/* ✨ 薄薄空气结界微光环渐变 (Air Barrier Ring Shimmer Gradient) */}
        <linearGradient id="airBarrierRingGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.25" />
          <stop offset="30%" stopColor="#e0f2fe" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#93c5fd" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.25" />
        </linearGradient>

        {/* ✨ 空气结界内部透镜空气折射渐变 (Translucent Air Lens Radial) */}
        <radialGradient id="airBarrierLensGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.18" />
          <stop offset="85%" stopColor="#60a5fa" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ========================================================================= */}
      {/* 1. 桥墩下方柔和投影 (Ground Ambient Occlusion Shadows)                     */}
      {/* ========================================================================= */}
      <g id="viaduct-pier-ground-shadows">
        {piers.map((px, idx) => {
          const baseY = PIER_BASE_Y[idx];
          return (
            <g key={`pier-shadow-group-${idx}`}>
              <ellipse
                cx={px + 9}
                cy={baseY + 2.5}
                rx="22"
                ry="4.2"
                fill="#243419"
                opacity="0.32"
              />
              <ellipse
                cx={px + 9}
                cy={baseY + 1.2}
                rx="14"
                ry="2.2"
                fill="#16220f"
                opacity="0.28"
              />
            </g>
          );
        })}
      </g>

      {/* ========================================================================= */}
      {/* 2. 宏阔舒展的 7 跨大石拱与 8 座石砌桥墩 (Magnificent Stone Viaduct Body)       */}
      {/* ========================================================================= */}
      <g id="viaduct-arches-and-piers">
        {/* 7 跨连续大石拱 */}
        {ARCH_SPANS.map((span, idx) => {
          const { spanLeft, spanRight } = span;
          const springY = 197;
          const spanWidth = spanRight - spanLeft; // 87px
          const rx = spanWidth / 2; // 43.5px
          const ry = 13.5;

          return (
            <g key={`viaduct-grand-arch-${idx}`}>
              {/* 拱券上方连续平整三角拱肩 */}
              <path
                d={`M ${spanLeft},${DECK_Y + 7.5} L ${spanRight},${DECK_Y + 7.5} L ${spanRight},${springY} A ${rx} ${ry} 0 0 0 ${spanLeft},${springY} Z`}
                fill="url(#viaductSpandrelGrad)"
              />

              {/* 3D 拱腹内侧透视进深阴影面 */}
              <path
                d={`M ${spanLeft},${springY} A ${rx} ${ry} 0 0 1 ${spanRight},${springY} L ${spanRight},${springY + 3.2} A ${rx} ${ry} 0 0 0 ${spanLeft},${springY + 3.2} Z`}
                fill="url(#viaductArchSoffitGrad)"
              />

              {/* 拱圈发券精细弧线 */}
              <path
                d={`M ${spanLeft},${springY} A ${rx} ${ry} 0 0 1 ${spanRight},${springY}`}
                fill="none"
                stroke="#6b6357"
                strokeWidth="0.75"
              />
            </g>
          );
        })}

        {/* 8 座极简几何石砌桥墩 */}
        {piers.map((px, idx) => {
          const baseY = PIER_BASE_Y[idx];
          const litWidth = 12;
          const shadeWidth = 6;
          const midY = Math.round((197 + baseY) / 2);

          return (
            <g key={`viaduct-pier-${idx}`}>
              {/* 桥墩主受光面 */}
              <rect
                x={px}
                y={DECK_Y + 7.5}
                width={litWidth}
                height={baseY - (DECK_Y + 7.5)}
                fill="url(#pierFrontFacetGrad)"
              />

              {/* 桥墩右侧轴测阴影切面 */}
              <rect
                x={px + litWidth}
                y={DECK_Y + 7.5}
                width={shadeWidth}
                height={baseY - (DECK_Y + 7.5)}
                fill="url(#pierShadowFacetGrad)"
              />

              {/* 极简水平腰线分格脚 */}
              <line
                x1={px}
                y1={midY}
                x2={px + litWidth}
                y2={midY}
                stroke="#a8a092"
                strokeWidth="0.75"
                opacity="0.7"
              />
              <line
                x1={px + litWidth}
                y1={midY}
                x2={px + PIER_WIDTH}
                y2={midY}
                stroke="#6e665a"
                strokeWidth="0.75"
                opacity="0.8"
              />

              {/* 起拱线上方分水线脚 */}
              <line
                x1={px}
                y1="197"
                x2={px + litWidth}
                y2="197"
                stroke="#a8a092"
                strokeWidth="0.75"
                opacity="0.6"
              />
              <line
                x1={px + litWidth}
                y1="197"
                x2={px + PIER_WIDTH}
                y2="197"
                stroke="#6e665a"
                strokeWidth="0.75"
                opacity="0.7"
              />
            </g>
          );
        })}
      </g>

      {/* ========================================================================= */}
      {/* 3. 桥面结构、道砟、枕木与立体双轨 (两端应用透明化渐变遮罩)                      */}
      {/*    彻底去除水泥墙！轨道在两端平滑自然地由实化虚，渐变消失入结界之中             */}
      {/* ========================================================================= */}
      <g id="viaduct-deck-and-rails" mask="url(#viaductEndsFadeMask)">
        {/* 连续水平桥面石托梁主体 */}
        <rect
          x={WEST_BARRIER_X}
          y={DECK_Y + 2}
          width={EAST_BARRIER_X - WEST_BARRIER_X}
          height="5.5"
          fill="url(#viaductSunlitStoneGrad)"
        />

        {/* 桥面托梁上沿石帽高光线 */}
        <line
          x1={WEST_BARRIER_X}
          y1={DECK_Y + 2}
          x2={EAST_BARRIER_X}
          y2={DECK_Y + 2}
          stroke="#dfd9cd"
          strokeWidth="0.85"
          opacity="0.95"
        />

        {/* 桥面托梁下方悬挑阴影带 */}
        <rect
          x={WEST_BARRIER_X}
          y={DECK_Y + 6.7}
          width={EAST_BARRIER_X - WEST_BARRIER_X}
          height="0.8"
          fill="#6b6458"
        />

        {/* 碎石道砟层 */}
        <rect
          x={WEST_BARRIER_X}
          y={DECK_Y - 0.5}
          width={EAST_BARRIER_X - WEST_BARRIER_X}
          height="2.5"
          fill="#222824"
        />
        <line
          x1={WEST_BARRIER_X}
          y1={DECK_Y - 0.5}
          x2={EAST_BARRIER_X}
          y2={DECK_Y - 0.5}
          stroke="#3d4640"
          strokeWidth="0.6"
          opacity="0.8"
        />

        {/* 等距铺设的木质轨枕阵列 */}
        <g id="railroad-sleepers" opacity="0.85">
          {sleeperPositions.map((sx, i) => (
            <React.Fragment key={`slp-${i}`}>
              <line
                x1={sx}
                y1={DECK_Y - 0.6}
                x2={sx}
                y2={DECK_Y + 1.8}
                stroke="#151a16"
                strokeWidth="1.6"
              />
              <line
                x1={sx}
                y1={DECK_Y - 0.6}
                x2={sx}
                y2={DECK_Y + 0.1}
                stroke="#3e382d"
                strokeWidth="1.6"
                opacity="0.7"
              />
            </React.Fragment>
          ))}
        </g>

        {/* 钢轨结构 */}
        <line
          x1={WEST_BARRIER_X}
          y1={DECK_Y + 0.5}
          x2={EAST_BARRIER_X}
          y2={DECK_Y + 0.5}
          stroke="#101512"
          strokeWidth="1.2"
        />
        <line
          x1={WEST_BARRIER_X}
          y1={DECK_Y + 0.1}
          x2={EAST_BARRIER_X}
          y2={DECK_Y + 0.1}
          stroke="#64748b"
          strokeWidth="0.65"
          opacity="0.85"
        />
        <line
          x1={WEST_BARRIER_X}
          y1={DECK_Y - 0.5}
          x2={EAST_BARRIER_X}
          y2={DECK_Y - 0.5}
          stroke="#e2e8f0"
          strokeWidth="0.85"
          opacity="0.98"
        />

        {/* 栏杆 */}
        <line
          x1={WEST_BARRIER_X}
          y1={DECK_Y - 2.4}
          x2={EAST_BARRIER_X}
          y2={DECK_Y - 2.4}
          stroke="#857e72"
          strokeWidth="0.75"
          opacity="0.85"
        />
        <line
          x1={WEST_BARRIER_X}
          y1={DECK_Y - 1.0}
          x2={EAST_BARRIER_X}
          y2={DECK_Y - 1.0}
          stroke="#857e72"
          strokeWidth="0.45"
          opacity="0.5"
        />

        {/* 桥墩正上方英式高架桥经典避车台 */}
        <g id="parapet-refuges">
          {piers.map((px, i) => (
            <g key={`refuge-${i}`} transform={`translate(${px + 9}, 0)`}>
              <polygon
                points="-4.5,175.5 4.5,175.5 5.5,172.4 -5.5,172.4"
                fill="#b8b0a2"
                stroke="#686154"
                strokeWidth="0.5"
              />
              <line x1="-5.5" y1="172.4" x2="5.5" y2="172.4" stroke="#dfd8cb" strokeWidth="0.8" />
            </g>
          ))}
        </g>

        {/* 栏杆立柱 */}
        <g id="parapet-posts">
          {Array.from({ length: Math.floor((EAST_BARRIER_X - WEST_BARRIER_X) / 26) }).map((_, i) => {
            const postX = WEST_BARRIER_X + 10 + i * 26;
            return (
              <line
                key={`pp-${i}`}
                x1={postX}
                y1={DECK_Y - 2.4}
                x2={postX}
                y2={DECK_Y + 0.2}
                stroke="#857e72"
                strokeWidth="0.6"
                opacity="0.7"
              />
            );
          })}
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 4. 🌀 薄薄的空气结界 (Subtle Translucent Air Barrier Membranes)             */}
      {/*    绝非大团白光！极为通透轻薄的空气折射薄膜与微光波纹，优雅作为世界的边界            */}
      {/* ========================================================================= */}
      <g id="subtle-air-barriers">
        {/* --- A. 西侧空气结界 (West Air Barrier at x = -735) --- */}
        <g
          id="west-air-barrier"
          transform={`translate(${WEST_BARRIER_X}, ${DECK_Y})`}
          className="animate-[pulse_4s_infinite]"
        >
          {/* 外圈微弱扩散空间空气涟漪 (Soft Spatial Ripple Ring) */}
          <ellipse cx="0" cy="0" rx="6.5" ry="24" fill="none" stroke="#93c5fd" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.3" />

          {/* 结界主透镜空气薄膜 (Thin Refraction Lens Membrane) */}
          <ellipse cx="0" cy="0" rx="3.5" ry="19" fill="url(#airBarrierLensGrad)" />

          {/* 结界垂直高光细边缘 (Crystalline Light Rim) */}
          <ellipse cx="0" cy="0" rx="3.5" ry="19" fill="none" stroke="url(#airBarrierRingGrad)" strokeWidth="1.0" opacity="0.8" />

          {/* 空间折射中心极细微光轴线 */}
          <line x1="0" y1="-21" x2="0" y2="21" stroke="#ffffff" strokeWidth="0.75" opacity="0.65" />
          <circle cx="0" cy="-21" r="0.8" fill="#ffffff" opacity="0.8" />
          <circle cx="0" cy="21" r="0.8" fill="#ffffff" opacity="0.8" />

          {/* 边缘微光星屑 (Tiny Glimmering Motets) */}
          <circle cx="2" cy="-9" r="0.8" fill="#ffffff" opacity="0.75" />
          <circle cx="-1.5" cy="8" r="0.7" fill="#bae6fd" opacity="0.6" />
        </g>

        {/* --- B. 东侧空气结界 (East Air Barrier at x = 100) --- */}
        <g
          id="east-air-barrier"
          transform={`translate(${EAST_BARRIER_X}, ${DECK_Y})`}
          className="animate-[pulse_4s_infinite]"
          style={{ animationDelay: '1.2s' }}
        >
          {/* 外圈微弱扩散空间空气涟漪 */}
          <ellipse cx="0" cy="0" rx="6.5" ry="24" fill="none" stroke="#93c5fd" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.3" />

          {/* 结界主透镜空气薄膜 */}
          <ellipse cx="0" cy="0" rx="3.5" ry="19" fill="url(#airBarrierLensGrad)" />

          {/* 结界垂直高光细边缘 */}
          <ellipse cx="0" cy="0" rx="3.5" ry="19" fill="none" stroke="url(#airBarrierRingGrad)" strokeWidth="1.0" opacity="0.8" />

          {/* 空间折射中心极细微光轴线 */}
          <line x1="0" y1="-21" x2="0" y2="21" stroke="#ffffff" strokeWidth="0.75" opacity="0.65" />
          <circle cx="0" cy="-21" r="0.8" fill="#ffffff" opacity="0.8" />
          <circle cx="0" cy="21" r="0.8" fill="#ffffff" opacity="0.8" />

          {/* 边缘微光星屑 */}
          <circle cx="-2" cy="-10" r="0.9" fill="#ffffff" opacity="0.8" />
          <circle cx="1.8" cy="7" r="0.75" fill="#bae6fd" opacity="0.65" />
          <circle cx="-1.2" cy="14" r="0.65" fill="#e0f2fe" opacity="0.55" />
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 5. 桥墩脚下自然植被 (Shrubs & Wildflowers Transition · 每座桥墩保持自然微差) */}
      {/* ========================================================================= */}
      <g id="viaduct-pier-grounding-foliage">
        {piers.map((px, idx) => {
          const baseY = PIER_BASE_Y[idx];
          const windDelay = Number(((px + 700) * 0.003).toFixed(2));
          const config = PIER_FOLIAGE_CONFIGS[idx % PIER_FOLIAGE_CONFIGS.length];
          const { leftBush, rightBush, centerGrass } = config;

          return (
            <g key={`pier-grounding-foliage-${idx}`}>
              {/* 桥墩左侧灌木丛 */}
              <g
                transform={`translate(${px + leftBush.offsetX}, ${baseY}) scale(${leftBush.scaleX}, ${leftBush.scaleY})`}
              >
                {leftBush.lobes.map((lobe, li) => {
                  const fill =
                    lobe.tone === 'base'
                      ? leftBush.baseColor
                      : lobe.tone === 'mid'
                      ? leftBush.midColor
                      : lobe.tone === 'top'
                      ? leftBush.topColor
                      : leftBush.accentColor || leftBush.topColor;
                  return (
                    <ellipse
                      key={`left-lobe-${li}`}
                      cx={lobe.cx}
                      cy={lobe.cy}
                      rx={lobe.rx}
                      ry={lobe.ry}
                      fill={fill}
                    />
                  );
                })}

                {leftBush.flowers?.map((fl, fi) => (
                  <g
                    key={`left-fl-${fi}`}
                    className="animate-wind-flower"
                    style={{
                      animationDelay: `${(windDelay + fl.delayOffset).toFixed(2)}s`,
                      transformOrigin: '0px 0px',
                    }}
                  >
                    <path
                      d={`M${fl.x * 0.2},0 Q${fl.stemCurve[0]},${fl.stemCurve[1]} ${fl.stemEnd[0]},${fl.stemEnd[1]}`}
                      stroke="#426022"
                      strokeWidth="0.85"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <circle cx={fl.stemEnd[0]} cy={fl.stemEnd[1]} r={fl.size} fill={fl.petalColor} />
                    <circle cx={fl.stemEnd[0]} cy={fl.stemEnd[1]} r={fl.size * 0.42} fill={fl.centerColor} />
                  </g>
                ))}

                {leftBush.bladeAccent && (
                  <path
                    d={leftBush.bladeAccent.d}
                    stroke={leftBush.bladeAccent.color}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
              </g>

              {/* 桥墩右侧灌木丛 */}
              <g
                transform={`translate(${px + PIER_WIDTH + rightBush.offsetX}, ${baseY}) scale(${rightBush.scaleX}, ${rightBush.scaleY})`}
              >
                {rightBush.lobes.map((lobe, li) => {
                  const fill =
                    lobe.tone === 'base'
                      ? rightBush.baseColor
                      : lobe.tone === 'mid'
                      ? rightBush.midColor
                      : lobe.tone === 'top'
                      ? rightBush.topColor
                      : rightBush.accentColor || rightBush.topColor;
                  return (
                    <ellipse
                      key={`right-lobe-${li}`}
                      cx={lobe.cx}
                      cy={lobe.cy}
                      rx={lobe.rx}
                      ry={lobe.ry}
                      fill={fill}
                    />
                  );
                })}

                {rightBush.flowers?.map((fl, fi) => (
                  <g
                    key={`right-fl-${fi}`}
                    className="animate-wind-flower"
                    style={{
                      animationDelay: `${(windDelay + 0.25 + fl.delayOffset).toFixed(2)}s`,
                      transformOrigin: '0px 0px',
                    }}
                  >
                    <path
                      d={`M${fl.x * 0.2},0 Q${fl.stemCurve[0]},${fl.stemCurve[1]} ${fl.stemEnd[0]},${fl.stemEnd[1]}`}
                      stroke="#426022"
                      strokeWidth="0.85"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <circle cx={fl.stemEnd[0]} cy={fl.stemEnd[1]} r={fl.size} fill={fl.petalColor} />
                    <circle cx={fl.stemEnd[0]} cy={fl.stemEnd[1]} r={fl.size * 0.42} fill={fl.centerColor} />
                  </g>
                ))}

                {rightBush.bladeAccent && (
                  <path
                    d={rightBush.bladeAccent.d}
                    stroke={rightBush.bladeAccent.color}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
              </g>

              {/* 桥墩正下方接地草丛 */}
              <g transform={`translate(${px + 9}, ${baseY + 1}) scale(${centerGrass.scale})`}>
                <g
                  className="animate-wind-grass"
                  style={{
                    animationDelay: `${(windDelay + centerGrass.delayOffset).toFixed(2)}s`,
                    transformOrigin: '0px 0px',
                  }}
                >
                  <path
                    d={centerGrass.bladesD1}
                    stroke={centerGrass.stroke1}
                    strokeWidth="0.95"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d={centerGrass.bladesD2}
                    stroke={centerGrass.stroke2}
                    strokeWidth="0.75"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {centerGrass.flower && (
                    <g>
                      <path d={centerGrass.flower.stemD} stroke="#426022" strokeWidth="0.7" fill="none" />
                      <circle cx={centerGrass.flower.x} cy={centerGrass.flower.y} r={centerGrass.flower.r} fill={centerGrass.flower.fill} />
                    </g>
                  )}
                </g>
              </g>
            </g>
          );
        })}
      </g>

      {/* ========================================================================= */}
      {/* 6. 约克郡复古蒸汽小火车 (Vintage Steam Locomotive & Carriages)               */}
      {/* ========================================================================= */}
      <g
        id="ribblehead-steam-train"
        transform={`translate(${layout.locomotive.x}, ${layout.locomotive.y})`}
      >
        {/* 铁轨运行微弱投影 */}
        <ellipse cx="-12" cy="13.5" rx="38" ry="1.6" fill="#141a15" opacity="0.4" />

        {/* 车轮与转向架 (稳稳落在 y=174.5 的钢轨上) */}
        {[-44, -36, -20, -12, 4, 12, 20].map((wx, i) => (
          <g key={`wheel-${i}`} transform={`translate(${wx}, 12)`}>
            <circle cx="0" cy="0" r="2.2" fill="#1b1c1e" />
            <circle cx="0" cy="0" r="1.4" fill="#3f454a" />
            <circle cx="0" cy="0" r="0.6" fill="#717a82" />
          </g>
        ))}

        {/* 蒸汽机车主体 (Brunswick Green Steam Engine) */}
        <g id="steam-engine-unit">
          {/* 锅炉主体 */}
          <rect x="0" y="5" width="22" height="7" rx="1.2" fill="#253a29" stroke="#142117" strokeWidth="0.5" />
          {/* 锅炉黄铜装饰圈 */}
          <line x1="6" y1="5" x2="6" y2="12" stroke="#d99b38" strokeWidth="0.7" />
          <line x1="12" y1="5" x2="12" y2="12" stroke="#d99b38" strokeWidth="0.7" />
          <line x1="18" y1="5" x2="18" y2="12" stroke="#d99b38" strokeWidth="0.7" />

          {/* 驾驶室 */}
          <rect x="18" y="1" width="10" height="11" rx="1" fill="#18271c" stroke="#0e1710" strokeWidth="0.5" />
          {/* 驾驶室车窗 */}
          <rect x="20" y="3" width="5" height="4" rx="0.5" fill="#fef08a" opacity="0.9" />
          <rect x="22" y="4" width="2" height="3" fill="#332a1e" opacity="0.7" />

          {/* 锅炉黄铜汽包 */}
          <circle cx="9" cy="5" r="1.8" fill="#eab308" stroke="#a16207" strokeWidth="0.5" />

          {/* 烟囱与排障器 */}
          <rect x="2.5" y="0.5" width="3.2" height="4.5" rx="0.5" fill="#17191a" />
          <polygon points="1.5,0.5 6.5,0.5 5.5,2 2.5,2" fill="#27292d" />
          <polygon points="-1,10 0,10 2,13 -1,13" fill="#1f2421" />

          {/* 前照灯 */}
          <circle cx="0.5" cy="8" r="1.2" fill="#fef3c7" />
        </g>

        {/* 客车车厢 1 & 2 */}
        <g id="passenger-carriages">
          <rect x="-24" y="4" width="20" height="8" rx="1" fill="#742d1e" stroke="#481a11" strokeWidth="0.5" />
          <rect x="-23" y="3.5" width="18" height="1" fill="#3c160e" />
          <rect x="-48" y="4" width="20" height="8" rx="1" fill="#742d1e" stroke="#481a11" strokeWidth="0.5" />
          <rect x="-47" y="3.5" width="18" height="1" fill="#3c160e" />

          {/* 车厢连接挂钩 */}
          <rect x="-27" y="9" width="3" height="1.5" fill="#1c1917" />
          <rect x="-3" y="9" width="3" height="1.5" fill="#1c1917" />

          {/* 车窗 */}
          {[-44, -36, -20, -12].map((wx, i) => (
            <g key={`win-${i}`}>
              <rect x={wx} y="5.8" width="4.5" height="3.4" rx="0.5" fill="#fef3c7" opacity="0.95" />
              <line x1={wx + 2.25} y1="5.8" x2={wx + 2.25} y2="9.2" stroke="#78350f" strokeWidth="0.5" opacity="0.7" />
            </g>
          ))}
        </g>

        {/* 白烟云朵 (随风舒卷律动) */}
        <g id="locomotive-steam-plumes">
          <circle cx="4" cy="-2.5" r="3.6" fill="#ffffff" opacity="0.82" className="animate-[pulse_3s_infinite]" />
          <circle cx="-6" cy="-7" r="5.2" fill="#ffffff" opacity="0.62" className="animate-[bounce_3.5s_infinite]" />
          <circle cx="-18" cy="-11.5" r="6.8" fill="#ffffff" opacity="0.42" />
          <circle cx="-33" cy="-16" r="8.5" fill="#ffffff" opacity="0.25" />
          <circle cx="-50" cy="-20" r="10.5" fill="#ffffff" opacity="0.12" />
        </g>
      </g>
    </g>
  );
});
