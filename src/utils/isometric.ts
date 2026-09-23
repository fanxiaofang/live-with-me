/**
 * 2.5D 等轴测 (Isometric / Dimetric) 统一投影系统
 * 
 * 采用现代 2D 像素与矢量游戏行业标准的 2:1 轴测投影 (Dimetric 26.565°):
 * - X 轴：向左下延伸 (dx = -2, dy = +1)
 * - Y 轴：向右下延伸 (dx = +2, dy = +1)
 * - Z 轴：垂直向上   (dx = 0,  dy = -1)
 * 
 * 保证所有家具 (沙发、书桌、书架、茶几、地毯) 与人物 (4个标准朝向) 共享同一套数学空间！
 */

// 4 个标准空间朝向
export type IsoDirection4 = 'SE' | 'SW' | 'NW' | 'NE';

// 8 个空间朝向 (含正交)
export type IsoDirection8 = 'S' | 'SE' | 'E' | 'NE' | 'N' | 'NW' | 'W' | 'SW';

export interface IsoPoint3D {
  x: number; // 空间 X 轴 (向左下)
  y: number; // 空间 Y 轴 (向右下)
  z?: number; // 空间高度 Z (向上)
}

export interface ScreenPoint2D {
  u: number; // 屏幕水平坐标 X
  v: number; // 屏幕垂直坐标 Y
}

/**
 * 2.5D 轴测网格基准配置
 */
export const ISO_CONFIG = {
  // 水平与垂直步长比率 (严格 2:1 轴测钻石网格)
  ratioX: 2,
  ratioY: 1,
  // 倾斜角度 (约 26.565 度: Math.atan(0.5) * (180 / Math.PI))
  angleDeg: 26.565051177,
  // 椭圆投影标准垂直压缩率 (ry / rx = 0.5)
  ellipseCompression: 0.5,
  // 光照默认系数 (顶面亮，右侧微明，左侧深阴影)
  lighting: {
    top: 1.0,
    right: 0.92,
    left: 0.78,
    ambientOcclusion: 0.65,
  },
};

/**
 * 将 3D 网格坐标 (x, y, z) 投影为屏幕 2D 坐标 (u, v)
 * @param x 沿 X 轴距离 (向左下)
 * @param y 沿 Y 轴距离 (向右下)
 * @param z 离地高度 (向上)
 * @param unit 基础网格单元大小 (像素)
 */
export function isoToScreen(
  x: number,
  y: number,
  z: number = 0,
  unit: number = 1
): ScreenPoint2D {
  const u = (y - x) * ISO_CONFIG.ratioX * unit;
  const v = (x + y) * ISO_CONFIG.ratioY * unit - z * unit;
  return { u, v };
}

/**
 * 获取 3D 物体在 2.5D 视角下的深度排序键 (Z-Index / Depth)
 * 在等轴测下，越靠近镜头 (X + Y 越大)，越应该排在前面
 */
export function getIsoDepth(x: number, y: number, z: number = 0): number {
  // x + y 决定前后深度，z 略微影响（保证同一地面的立面上方物体层级正确）
  return (x + y) * 1000 + z * 0.1;
}

/**
 * 将传统的 front/side/back 转换为统一的 2.5D 轴测朝向
 */
export function normalizeIsoFacing(facing?: string): IsoDirection4 {
  switch (facing) {
    case 'SE':
    case 'front':
      return 'SE'; // 东南（正对镜头）
    case 'SW':
    case 'side':
      return 'SW'; // 西南（侧身面向左下）
    case 'NW':
    case 'back':
      return 'NW'; // 西北（背对镜头）
    case 'NE':
      return 'NE'; // 东北（侧身背向右上）
    default:
      return 'SE';
  }
}

/**
 * 生成 2.5D 轴测地面菱形网格/地毯路径 (x, y 为起始网格，w 为沿X跨度，l 为沿Y跨度)
 */
export function getIsoTilePath(
  x: number,
  y: number,
  w: number = 1,
  l: number = 1,
  z: number = 0,
  unit: number = 1
): string {
  const p1 = isoToScreen(x, y, z, unit);
  const p2 = isoToScreen(x + w, y, z, unit);
  const p3 = isoToScreen(x + w, y + l, z, unit);
  const p4 = isoToScreen(x, y + l, z, unit);
  return `M ${p1.u},${p1.v} L ${p2.u},${p2.v} L ${p3.u},${p3.v} L ${p4.u},${p4.v} Z`;
}

/**
 * 生成 2.5D 轴测长方体 (Box) 各面路径与着色
 * 适用于：书桌、书架、床架、小柜子、电脑机箱等
 */
export interface IsoBoxFaces {
  top: string;
  left: string;
  right: string;
  depth: number;
}

export function getIsoBoxPaths(
  x: number,
  y: number,
  z: number,
  widthX: number,
  lengthY: number,
  heightZ: number,
  unit: number = 1
): IsoBoxFaces {
  // 底面 4 点
  const b1 = isoToScreen(x, y, z, unit);
  const b2 = isoToScreen(x + widthX, y, z, unit);
  const b3 = isoToScreen(x + widthX, y + lengthY, z, unit);
  const b4 = isoToScreen(x, y + lengthY, z, unit);

  // 顶面 4 点
  const t1 = isoToScreen(x, y, z + heightZ, unit);
  const t2 = isoToScreen(x + widthX, y, z + heightZ, unit);
  const t3 = isoToScreen(x + widthX, y + lengthY, z + heightZ, unit);
  const t4 = isoToScreen(x, y + lengthY, z + heightZ, unit);

  return {
    top: `M ${t1.u},${t1.v} L ${t2.u},${t2.v} L ${t3.u},${t3.v} L ${t4.u},${t4.v} Z`,
    left: `M ${b1.u},${b1.v} L ${b2.u},${b2.v} L ${t2.u},${t2.v} L ${t1.u},${t1.v} Z`,
    right: `M ${b2.u},${b2.v} L ${b3.u},${b3.v} L ${t3.u},${t3.v} L ${t2.u},${t2.v} Z`,
    depth: getIsoDepth(x + widthX / 2, y + lengthY / 2, z),
  };
}

/**
 * 生成 2.5D 轴测圆柱体 (Cylinder) 路径与参数
 * 适用于：圆地毯、咖啡杯、圆茶几、花盆、圆蜡烛等
 * 顶部椭圆严格遵守 2:1 轴测比例 (ry = rx * 0.5)
 */
export interface IsoCylinderData {
  topEllipse: { cx: number; cy: number; rx: number; ry: number };
  bottomEllipse: { cx: number; cy: number; rx: number; ry: number };
  bodyPath: string;
  depth: number;
}

export function getIsoCylinderData(
  centerX: number,
  centerY: number,
  baseZ: number,
  radius: number,
  height: number,
  unit: number = 1
): IsoCylinderData {
  const bottomPos = isoToScreen(centerX, centerY, baseZ, unit);
  const topPos = isoToScreen(centerX, centerY, baseZ + height, unit);

  const rx = radius * ISO_CONFIG.ratioX * unit;
  const ry = radius * ISO_CONFIG.ratioY * unit; // 严格 2:1

  // 侧边外轮廓
  const bodyPath = `M ${bottomPos.u - rx},${bottomPos.v} 
    L ${topPos.u - rx},${topPos.v} 
    A ${rx} ${ry} 0 0 0 ${topPos.u + rx},${topPos.v} 
    L ${bottomPos.u + rx},${bottomPos.v} 
    A ${rx} ${ry} 0 0 1 ${bottomPos.u - rx},${bottomPos.v} Z`;

  return {
    topEllipse: { cx: topPos.u, cy: topPos.v, rx, ry },
    bottomEllipse: { cx: bottomPos.u, cy: bottomPos.v, rx, ry },
    bodyPath,
    depth: getIsoDepth(centerX, centerY, baseZ),
  };
}
