import React from 'react';
import {
  IsoDirection4,
  getIsoTilePath,
  getIsoBoxPaths,
  getIsoCylinderData,
  isoToScreen,
  ISO_CONFIG,
} from '../../utils/isometric';

/**
 * 2.5D 轴测辅助对齐网格线 (便于开发调试透视、或展示等轴测网格底盘)
 */
export const IsoGridGuide: React.FC<{
  size?: number;
  step?: number;
  unit?: number;
  strokeColor?: string;
  showAxes?: boolean;
}> = ({
  size = 6,
  step = 1,
  unit = 16,
  strokeColor = 'rgba(255, 255, 255, 0.08)',
  showAxes = true,
}) => {
  const lines: React.ReactNode[] = [];

  // X 轴平行线
  for (let y = -size; y <= size; y += step) {
    const start = isoToScreen(-size, y, 0, unit);
    const end = isoToScreen(size, y, 0, unit);
    lines.push(
      <line
        key={`x-${y}`}
        x1={start.u}
        y1={start.v}
        x2={end.u}
        y2={end.v}
        stroke={strokeColor}
        strokeWidth="1"
      />
    );
  }

  // Y 轴平行线
  for (let x = -size; x <= size; x += step) {
    const start = isoToScreen(x, -size, 0, unit);
    const end = isoToScreen(x, size, 0, unit);
    lines.push(
      <line
        key={`y-${x}`}
        x1={start.u}
        y1={start.v}
        x2={end.u}
        y2={end.v}
        stroke={strokeColor}
        strokeWidth="1"
      />
    );
  }

  return (
    <g id="iso-grid-guide" opacity="0.8">
      {lines}
      {showAxes && (
        <>
          {/* X 轴 (向左下，红线) */}
          <line
            x1={0}
            y1={0}
            x2={isoToScreen(size, 0, 0, unit).u}
            y2={isoToScreen(size, 0, 0, unit).v}
            stroke="#f87171"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          {/* Y 轴 (向右下，绿线) */}
          <line
            x1={0}
            y1={0}
            x2={isoToScreen(0, size, 0, unit).u}
            y2={isoToScreen(0, size, 0, unit).v}
            stroke="#4ade80"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          {/* Z 轴 (垂直向上，蓝线) */}
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={-size * unit}
            stroke="#60a5fa"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        </>
      )}
    </g>
  );
};

/**
 * 2.5D 标准轴测圆地毯 (严格遵守 2:1 椭圆与地面贴合)
 */
export const IsoRug: React.FC<{
  x: number;
  y: number;
  radius?: number;
  unit?: number;
  baseColor?: string;
  fringeColor?: string;
}> = ({
  x,
  y,
  radius = 1.6,
  unit = 16,
  baseColor = '#f3ede3',
  fringeColor = '#ded4c5',
}) => {
  const center = isoToScreen(x, y, 0, unit);
  const rx = radius * ISO_CONFIG.ratioX * unit;
  const ry = radius * ISO_CONFIG.ratioY * unit; // 严格 2:1

  return (
    <g id="iso-rug" transform={`translate(${center.u}, ${center.v})`}>
      {/* 柔和接触阴影 */}
      <ellipse cx="0" cy="1" rx={rx + 2} ry={ry + 1} fill="#1b120c" opacity="0.25" />
      {/* 纯棉麻地垫底面 */}
      <ellipse cx="0" cy="0" rx={rx} ry={ry} fill={baseColor} stroke={fringeColor} strokeWidth="1" />
      {/* 内圈编织纹路 */}
      <ellipse cx="0" cy="0" rx={rx * 0.82} ry={ry * 0.82} fill="none" stroke={fringeColor} strokeWidth="0.8" strokeDasharray="3 3" />
    </g>
  );
};

/**
 * 2.5D 标准面包懒人沙发 (遵循 2:1 轴测透视，可根据朝向旋转/镜像)
 */
export const IsoBeanbagSofa: React.FC<{
  x: number;
  y: number;
  z?: number;
  facing?: IsoDirection4;
  scale?: number;
  primaryColor?: string;
  backColor?: string;
  shadowColor?: string;
  highlightColor?: string;
  onClick?: () => void;
  className?: string;
}> = ({
  x,
  y,
  z = 0,
  facing = 'SE',
  scale = 1,
  primaryColor = '#de7d43',
  backColor = '#cf733a',
  shadowColor = '#9e4e1f',
  highlightColor = '#f6af7c',
  onClick,
  className,
}) => {
  const center = isoToScreen(x, y, z);

  // 根据轴测朝向进行投影变换
  // SE: 面对镜头(默认)
  // SW: 面对左下 (沿 X 轴)
  // NE: 面对右上 (反向镜像)
  // NW: 背对镜头 (翻转靠背深度)
  const isFlippedX = facing === 'SW';

  return (
    <g
      id="iso-beanbag-sofa"
      transform={`translate(${center.u}, ${center.v}) scale(${isFlippedX ? -scale : scale}, ${scale})`}
      onClick={onClick}
      className={className}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* 1. 地面柔和接触阴影 (严格 2:1 椭圆) */}
      <ellipse cx="0" cy="9" rx="19" ry="9.5" fill="#1b120c" opacity="0.32" />

      {/* 2. 靠背包 (焦糖色) */}
      <path
        d="M-13,-5 C-16,-18 -8,-24 3,-24 C13,-24 18,-17 15,-4 C13,6 -9,6 -13,-5 Z"
        fill={backColor}
        stroke={shadowColor}
        strokeWidth="1"
      />
      {/* 靠背上檐柔光高光 */}
      <path
        d="M-7,-21 Q3,-24 11,-21"
        fill="none"
        stroke={highlightColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* 靠背分瓣竖缝线 */}
      <path d="M-6,-19 C-4,-12 -2,-5 -2,0" fill="none" stroke={shadowColor} strokeWidth="0.8" opacity="0.6" />
      <path d="M3,-21 C4,-14 5,-5 5,0" fill="none" stroke={shadowColor} strokeWidth="0.8" opacity="0.6" />
      <path d="M10,-18 C11,-12 11,-4 11,0" fill="none" stroke={shadowColor} strokeWidth="0.8" opacity="0.6" />

      {/* 3. 坐包主体 (圆润南瓜色，下沉 2:1 椭圆) */}
      <path
        d="M-17,2 C-18,11 -10,16 0,16 C10,16 18,11 17,2 C15,-4 12,-7 0,-7 C-12,-7 -15,-4 -17,2 Z"
        fill={primaryColor}
        stroke={shadowColor}
        strokeWidth="1"
      />
      {/* 座包下沿立体弧暗部 */}
      <path
        d="M-15,6 C-15,13 -1,17 12,12 C17,9 17,4 17,2 C14,9 6,14 -1,14 C-10,14 -15,10 -15,6 Z"
        fill={shadowColor}
        opacity="0.45"
      />
      {/* 坐垫中部深凹阴影 (2:1 比例椭圆) */}
      <ellipse cx="0" cy="3" rx="10" ry="5" fill="#8f4117" opacity="0.38" />
      {/* 软褶皱 */}
      <path d="M-12,1 Q-7,4 -3,3" fill="none" stroke={shadowColor} strokeWidth="0.9" strokeLinecap="round" opacity="0.75" />
      <path d="M12,1 Q7,4 3,3" fill="none" stroke={shadowColor} strokeWidth="0.9" strokeLinecap="round" opacity="0.75" />
    </g>
  );
};
