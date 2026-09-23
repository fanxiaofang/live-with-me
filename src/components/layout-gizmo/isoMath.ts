/**
 * 2.5D 轴测空间变换与投影数学核心 (Isometric Transform Math)
 * 严格映射当前项目的 2.5D 轴测几何关系：
 * X_screen = u * 1.0 + v * 0.8
 * Y_screen = -0.2852 * u + 0.228 * v - w
 *
 * u 轴：柜体/房间长边向右下（+u 沿右下方移动）
 * v 轴：进深向右上（+v 沿右上方后退）
 * w 轴：垂直空间高度（+w 垂直向上悬浮/提升高度）
 */

export interface IsoPoint3D {
  u: number; // 长边轴
  v: number; // 进深轴
  w: number; // 高度轴 (垂直向上)
}

export interface ScreenPoint2D {
  x: number;
  y: number;
}

// 正向投影常数
export const ISO_CONSTANTS = {
  cosU: 1.0,
  sinU: -0.2852,
  cosV: 0.8,
  sinV: 0.228,
  det: 1.0 * 0.228 - 0.8 * -0.2852, // 0.228 + 0.22816 = 0.45616
};

/**
 * 3D 轴测世界坐标 (u, v, w) -> 屏幕 2D 偏移量 (x, y)
 */
export function projectIsoToScreen(point: IsoPoint3D): ScreenPoint2D {
  return {
    x: point.u * ISO_CONSTANTS.cosU + point.v * ISO_CONSTANTS.cosV,
    y: point.u * ISO_CONSTANTS.sinU + point.v * ISO_CONSTANTS.sinV - point.w,
  };
}

/**
 * 屏幕 2D 偏移量 (x, y) + 固定高度平面 w -> 逆解出 (u, v, w)
 */
export function unprojectScreenToIso(screen: ScreenPoint2D, fixedW: number): IsoPoint3D {
  const adjustedY = screen.y + fixedW;
  // x = u + 0.8 * v
  // y' = -0.2852 * u + 0.228 * v
  // 利用二阶行列式 Cramer 法则求精确解：
  const u = (screen.x * ISO_CONSTANTS.sinV - ISO_CONSTANTS.cosV * adjustedY) / ISO_CONSTANTS.det;
  const v = (ISO_CONSTANTS.cosU * adjustedY - screen.x * ISO_CONSTANTS.sinU) / ISO_CONSTANTS.det;

  return {
    u: Number(u.toFixed(2)),
    v: Number(v.toFixed(2)),
    w: Number(fixedW.toFixed(2)),
  };
}

/**
 * 将屏幕像素位移 (dx, dy) 转换为水平面 (u, v) 上的空间位移增量
 */
export function deltaScreenToIsoDelta(dx: number, dy: number): { du: number; dv: number } {
  const du = (dx * ISO_CONSTANTS.sinV - ISO_CONSTANTS.cosV * dy) / ISO_CONSTANTS.det;
  const dv = (ISO_CONSTANTS.cosU * dy - dx * ISO_CONSTANTS.sinU) / ISO_CONSTANTS.det;
  return {
    du: Number(du.toFixed(2)),
    dv: Number(dv.toFixed(2)),
  };
}
