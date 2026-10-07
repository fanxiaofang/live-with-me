import React from 'react';
import { svgAction } from '../../world/interactions/svgAction';
import { BookItemConfig } from './bookshelfTypes';

// 实用颜色深浅混合工具
function adjustHex(hex: string, percent: number): string {
  if (!hex.startsWith('#')) return hex;
  let num = parseInt(hex.slice(1), 16);
  if (hex.length === 4) {
    const r = parseInt(hex[1] + hex[1], 16);
    const g = parseInt(hex[2] + hex[2], 16);
    const b = parseInt(hex[3] + hex[3], 16);
    num = (r << 16) | (g << 8) | b;
  }
  let r = (num >> 16) + Math.round((percent / 100) * 255);
  let g = ((num >> 8) & 0x00ff) + Math.round((percent / 100) * 255);
  let b = (num & 0x0000ff) + Math.round((percent / 100) * 255);
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

interface BookItemProps {
  config: BookItemConfig;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const BookItem: React.FC<BookItemProps> = ({
  config,
  isSelected = false,
  isHovered = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const {
    id,
    title,
    color,
    spineDarkColor,
    pageColor = '#faf4eb',
    thickness = 3,
    height = 9,
    depth = 4.0,
    tilt = 0,
    type = 'stand',
    bookmarkRibbon,
    isReading = false,
    isPulled = false,
    note,
    donor,
  } = config;

  const darkSideColor = spineDarkColor || adjustHex(color, -28);
  const lightSpineColor = adjustHex(color, 12);
  const depthY = depth * 0.275; // 轴测向深处的 Y 偏移 (负向向后或正向微调)

  // 1. 若书本处于抽出/借阅状态 (如林木拿走去读)
  if (isPulled) {
    return (
      <g
        id={`book-slot-pulled-${id}`}
        className="cursor-pointer group/pulled-slot transition-all duration-300"
        {...(onClick ? svgAction(`检视书籍：${config.title}`) : {})}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* 虚线空位标记：标示这里原本存放的书籍 */}
        <polygon
          points={`0,0 ${thickness},${thickness * 0.28} ${thickness + depth},${thickness * 0.28 - depthY} ${depth},${-depthY}`}
          fill="#301b0f"
          opacity="0.3"
        />
        <polygon
          points={`0,0 ${thickness},${thickness * 0.28} ${thickness},${thickness * 0.28 - height * 0.3} 0,${-height * 0.3}`}
          fill="none"
          stroke="#e2b17a"
          strokeWidth="0.5"
          strokeDasharray="1.5 1.5"
          opacity="0.75"
        />
        {/* 借阅书签木片 / 便笺纸留存 */}
        <g transform={`translate(${thickness * 0.5}, ${thickness * 0.14})`}>
          <polygon
            points="0,0 2,0.5 1,-7 -1,-7.5"
            fill="#faeed9"
            stroke="#b88d57"
            strokeWidth="0.3"
          />
          <line x1="0.5" y1="-6" x2="0.8" y2="-1" stroke="#875727" strokeWidth="0.4" strokeDasharray="1 1" />
        </g>
        {/* 悬停时的温和小气泡提示 */}
        {isHovered && (
          <title>{`[借阅中] 《${title}》· ${donor || '好友'}正在翻阅`}</title>
        )}
      </g>
    );
  }

  // 2. 横卧堆叠模式 (Stack: 如底层厚重大开本)
  if (type === 'stack') {
    const stackCount = config.stackCount || 1;
    const baseWidth = Math.max(7, depth * 1.8);
    const bookH = Math.max(1.2, height * 0.16);

    return (
      <g
        id={`book-stack-${id}`}
        className="cursor-pointer transition-all duration-200"
        {...(onClick ? svgAction(`检视书籍：${config.title}`) : {})}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* 底部柔和接触阴影 */}
        <ellipse cx={baseWidth * 0.4} cy={baseWidth * 0.15 + 0.5} rx={baseWidth * 0.55} ry={1.2} fill="#1a110a" opacity="0.3" />

        {Array.from({ length: stackCount }).map((_, idx) => {
          const yOff = -idx * (bookH + 0.3);
          const curColor = idx === 0 ? color : adjustHex(color, idx % 2 === 1 ? -15 : 20);
          const curDark = adjustHex(curColor, -25);
          const w = baseWidth - idx * 0.8;
          const d = depth - idx * 0.2;

          return (
            <g key={idx} transform={`translate(${idx * 0.4}, ${yOff})`}>
              {/* 封面顶面 (Top cover) */}
              <polygon
                points={`0,0 ${w},${w * 0.28} ${w - d},${w * 0.28 + d * 0.3} ${-d},${d * 0.3}`}
                fill={curColor}
                stroke={curDark}
                strokeWidth="0.3"
              />
              {/* 书脊/前边缘 (Front edge) */}
              <polygon
                points={`${-d},${d * 0.3} ${w - d},${w * 0.28 + d * 0.3} ${w - d},${w * 0.28 + d * 0.3 + bookH} ${-d},${d * 0.3 + bookH}`}
                fill={curDark}
              />
              {/* 侧面切口纸张泛白 (Side cut page texture) */}
              <polygon
                points={`${w - d},${w * 0.28 + d * 0.3} ${w},${w * 0.28} ${w},${w * 0.28 + bookH} ${w - d},${w * 0.28 + d * 0.3 + bookH}`}
                fill={pageColor}
              />
            </g>
          );
        })}

        {/* 选中有微黄柔和呼吸光圈 */}
        {isSelected && (
          <ellipse
            cx={baseWidth * 0.4}
            cy={baseWidth * 0.15}
            rx={baseWidth * 0.65}
            ry={baseWidth * 0.25}
            fill="none"
            stroke="#facc15"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
          />
        )}
      </g>
    );
  }

  // 3. 经典 2.5D 立放模式 (Stand: 极简精确 3 面多边形)
  // 面 1: 书脊 (Spine Facet) - 迎向视线
  const pSpine = `0,0 ${thickness},${thickness * 0.28} ${thickness},${thickness * 0.28 - height} 0,${-height}`;
  // 面 2: 书侧面 (Side Facet) - 朝向进深，受背阴
  const pSide = `${thickness},${thickness * 0.28} ${thickness + depth},${thickness * 0.28 - depthY} ${thickness + depth},${thickness * 0.28 - depthY - height} ${thickness},${thickness * 0.28 - height}`;
  // 面 3: 书顶切面 (Top Facet) - 纸张裁切面与封面边沿
  const pTop = `0,${-height} ${thickness},${thickness * 0.28 - height} ${thickness + depth},${thickness * 0.28 - depthY - height} ${depth},${-depthY - height}`;

  const transformStr = tilt !== 0 ? `rotate(${tilt} ${thickness * 0.5} 0)` : undefined;

  return (
    <g
      id={`book-item-${id}`}
      className="cursor-pointer group/book transition-all duration-200"
      transform={transformStr}
      {...(onClick ? svgAction(`检视书籍：${config.title}`) : {})}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 底部微小环境阴影 */}
      <ellipse
        cx={thickness * 0.5}
        cy={0.4}
        rx={thickness * 0.8 + 0.8}
        ry={0.6}
        fill="#1a110a"
        opacity="0.32"
      />

      {/* 面 1: 书脊 (Spine) */}
      <polygon
        points={pSpine}
        fill={color}
        stroke={darkSideColor}
        strokeWidth="0.3"
      />

      {/* 书脊装饰压线 / 烫金轻细微纹 */}
      <line
        x1={thickness * 0.2}
        y1={-height * 0.85}
        x2={thickness * 0.8}
        y2={-height * 0.85 + (thickness * 0.6) * 0.28}
        stroke={lightSpineColor}
        strokeWidth="0.4"
        opacity="0.65"
      />
      <line
        x1={thickness * 0.2}
        y1={-height * 0.15}
        x2={thickness * 0.8}
        y2={-height * 0.15 + (thickness * 0.6) * 0.28}
        stroke={lightSpineColor}
        strokeWidth="0.4"
        opacity="0.65"
      />

      {/* 面 2: 书侧面 (Side: 封面侧板或微露书页) */}
      <polygon
        points={pSide}
        fill={darkSideColor}
      />
      {/* 书页内页边缘微缝 */}
      <line
        x1={thickness + depth * 0.3}
        y1={thickness * 0.28 - depthY * 0.3}
        x2={thickness + depth * 0.3}
        y2={thickness * 0.28 - depthY * 0.3 - height}
        stroke={pageColor}
        strokeWidth="0.3"
        opacity="0.4"
      />

      {/* 面 3: 书顶切面 (Top: 米泛白旧书页与顶边缘) */}
      <polygon
        points={pTop}
        fill={pageColor}
        stroke={darkSideColor}
        strokeWidth="0.2"
      />

      {/* 可选：小丝带书签垂落 (Bookmark Ribbon) */}
      {bookmarkRibbon && (
        <path
          d={`M ${thickness * 0.55},${thickness * 0.28 - height} Q ${thickness * 0.4},${-height * 0.4} ${thickness * 0.65},${1.2}`}
          stroke={bookmarkRibbon}
          strokeWidth="0.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
      )}

      {/* 正在阅读状态 (isReading: 温和的光晕与微星辉) */}
      {isReading && (
        <g transform={`translate(${thickness * 0.5}, ${-height - 1.5})`}>
          <circle cx="0" cy="0" r="1.6" fill="#facc15" opacity="0.6" className="animate-pulse" />
          <circle cx="0" cy="0" r="0.8" fill="#ffffff" />
        </g>
      )}

      {/* 选中高亮外框 */}
      {isSelected && (
        <polygon
          points={pSpine}
          fill="none"
          stroke="#facc15"
          strokeWidth="0.8"
          strokeDasharray="2 1"
        />
      )}

      {/* 悬停微高亮浮动 */}
      {isHovered && (
        <polygon
          points={pSpine}
          fill="#ffffff"
          opacity="0.18"
        />
      )}
    </g>
  );
};
