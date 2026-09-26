import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';

/**
 * 🌊 RiverValley (Yorkshire Far-Left Beck & Meander)
 *
 * Layer: 02 TERRAIN / River Valley
 * Spatial Region: YORKSHIRE_LAYOUT.riverValley
 *
 * Preserves the meandering river stream, moist verge, ripples,
 * boulders, and the swimming ducks interaction.
 */
export const RiverValley: React.FC<YorkshireCommonProps> = ({
  theme,
  onTriggerToast,
  setHoveredObject,
  className,
}) => {
  const layout = YORKSHIRE_LAYOUT.riverValley;

  return (
    <g id="yorkshire-river-valley" className={className} opacity="0.96">
      <defs>
        {/* 溪水河湾清澈碧青渐变 (Teal-Cyan Beck) */}
        <linearGradient id="ysRiverGradClean" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme.riverColor} />
          <stop offset="50%" stopColor={theme.riverReflect} />
          <stop offset="100%" stopColor={theme.riverColor} />
        </linearGradient>
      </defs>

      {/* 河谷缓坡凹地阴影底色 (Valley Dip Shading) */}
      <path
        d="M-520,210 C-620,240 -740,320 -720,440 C-700,560 -580,640 -590,750 L-850,800 L-850,210 Z"
        fill="#3f502c"
        opacity="0.45"
      />

      {/* 河岸湿润泥滩与卵石浅滩 (Moist River Verge) */}
      <path
        d="M-500,215 C-600,245 -710,320 -690,440 C-670,555 -550,635 -560,750 L-760,780 C-790,660 -780,520 -800,410 C-820,310 -720,230 -620,210 Z"
        fill="#5a4e3d"
        opacity="0.6"
      />

      {/* 清澈溪流主水体 (Meandering River Stream - 舒缓自然的双S弯) */}
      <path
        d="M-510,218 C-595,248 -690,325 -675,438 C-660,545 -545,628 -552,750 L-680,770 C-695,650 -740,560 -750,450 C-760,350 -680,260 -590,222 Z"
        fill="url(#ysRiverGradClean)"
        stroke="#4fa5a3"
        strokeWidth="1.2"
      />

      {/* 溪流柔和镜面天光倒影 (Water Surface Glaze) */}
      <path
        d="M-525,225 C-600,255 -678,335 -665,435 C-652,535 -555,618 -560,725 L-615,735 C-610,635 -700,550 -710,445 C-720,355 -650,270 -580,230 Z"
        fill={theme.riverReflect}
        opacity="0.35"
      />

      {/* 水波涟漪反光微线 (Soft Ripple Accents) */}
      <g opacity="0.65">
        <path d="M-550,240 Q-580,252 -610,262" fill="none" stroke={theme.riverRipples} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M-640,320 Q-670,340 -680,370" fill="none" stroke={theme.riverRipples} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M-670,440 Q-655,480 -630,510" fill="none" stroke={theme.riverRipples} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M-590,580 Q-565,610 -555,645" fill="none" stroke={theme.riverRipples} strokeWidth="2.0" strokeLinecap="round" />
        <path d="M-560,685 Q-570,720 -595,750" fill="none" stroke={theme.riverRipples} strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* 溪畔圆润平整河卵石 (River Boulders - 纯净块面感) */}
      <g id="far-river-pebbles">
        {layout.pebbles.map((p, idx) => (
          <ellipse key={`pebble-${idx}`} cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} fill="#6f6558" stroke="#484036" strokeWidth="0.8" />
        ))}
        <ellipse cx="-595" cy="274" rx="6" ry="3.2" fill="#8a7e70" />
        <ellipse cx="-692" cy="418" rx="8" ry="3.5" fill="#8c8072" opacity="0.75" />
        <ellipse cx="-538" cy="627" rx="9" ry="4" fill="#928678" opacity="0.7" />
      </g>

      {/* 溪边悠闲嬉戏白鸭母子 (Ducks swimming quietly in the far beck) */}
      <g
        id="far-river-ducks"
        transform={`translate(${layout.ducksAnchor.x}, ${layout.ducksAnchor.y})`}
        className="cursor-pointer transition-transform hover:scale-110"
        onClick={(e) => {
          e.stopPropagation();
          onTriggerToast?.('🦆 嘎嘎~ 远山溪流清澈见底，小鸭子正在顺水漂游');
        }}
        onMouseEnter={() => setHoveredObject?.('🦆 约克郡白鸭 · 在西侧清澈山溪中自由游曳')}
        onMouseLeave={() => setHoveredObject?.(null)}
      >
        <ellipse cx="0" cy="4" rx="10" ry="3" fill="#1b4d4c" opacity="0.4" />
        <ellipse cx="0" cy="5" rx="14" ry="3.5" fill="none" stroke="#a5e5e3" strokeWidth="0.8" opacity="0.5" className="animate-ping" />
        <path d="M-6,2 C-8,-1 -3,-5 3,-3 C8,-1 8,3 5,4 C2,5 -3,5 -6,2 Z" fill="#fffdfa" stroke="#d5cbba" strokeWidth="0.5" />
        <circle cx="6" cy="-4" r="2.8" fill="#fffdfa" />
        <path d="M7,-5 L12,-4 L7,-3 Z" fill="#f59e0b" />
        <circle cx="7" cy="-5" r="0.5" fill="#1e293b" />
        {/* 小鸭 */}
        <g transform="translate(-13, -5)">
          <ellipse cx="0" cy="1" rx="3.5" ry="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.3" />
          <circle cx="2.5" cy="-1" r="1.6" fill="#fef08a" />
          <path d="M3.5,-1.5 L5.5,-1 L3.5,-0.5 Z" fill="#f59e0b" />
        </g>
      </g>
    </g>
  );
};
