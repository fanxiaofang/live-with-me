import React, { useState } from 'react';
import { useTimerScope } from '../../shared/timers/useTimerScope';

export interface MonsteraPlantProps {
  onHover?: (hovered: boolean) => void;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * 2.5D 治愈系室内生机龟背竹盆栽 (Monstera Deliciosa)
 * 特色：
 * 1. 经典龟背竹深裂开背叶与椭圆叶穿孔 (Fenestrations)
 * 2. 幼嫩新叶卷芯与生动垂挂的气生根 (Aerial roots)
 * 3. 北欧暖沙灰哑光粗陶筒盆与白橡木十字托架
 * 4. 湿润多孔黑沃土与微石点缀
 * 5. 点击微摇曳与露水闪烁微动效
 */
export const MonsteraPlant: React.FC<MonsteraPlantProps> = ({ onHover, onClick }) => {
  const timers = useTimerScope();
  const [rustle, setRustle] = useState(false);
  const [dropEffect, setDropEffect] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
    setRustle(true);
    setDropEffect(true);
    timers.schedule('feedback-0', () => setRustle(false), 900);
    timers.schedule('feedback-1', () => setDropEffect(false), 1400);
  };

  return (
    <g
      id="component-monstera-deliciosa"
      className="cursor-pointer select-none group/monstera"
      onClick={handleClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <defs>
        {/* 陶瓷花盆表面哑光渐变 */}
        <linearGradient id="monsteraPotGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f3efe8" />
          <stop offset="35%" stopColor="#e5ded3" />
          <stop offset="75%" stopColor="#cbbeab" />
          <stop offset="100%" stopColor="#a3937d" />
        </linearGradient>

        {/* 盆内沃土深色渐变 */}
        <radialGradient id="monsteraSoilGrad" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#3d2a1b" />
          <stop offset="70%" stopColor="#24160c" />
          <stop offset="100%" stopColor="#150c06" />
        </radialGradient>

        {/* 龟背竹叶面深浅光泽渐变 */}
        <linearGradient id="leafGradMature" x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#3b824b" />
          <stop offset="50%" stopColor="#266436" />
          <stop offset="100%" stopColor="#174422" />
        </linearGradient>

        <linearGradient id="leafGradBright" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5bb36d" />
          <stop offset="45%" stopColor="#3c9450" />
          <stop offset="100%" stopColor="#226633" />
        </linearGradient>

        <linearGradient id="leafGradBack" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#265a32" />
          <stop offset="100%" stopColor="#14361c" />
        </linearGradient>
      </defs>

      {/* --- 1. 地面漫反射接触阴影 (花盆底在木地板上的投影) --- */}
      <ellipse cx="0" cy="11.5" rx="10" ry="4.5" fill="#1b120c" opacity="0.32" filter="url(#softShadow)" />

      {/* --- 2. 北欧实木矮脚花架 (Wooden Plant Stand Legs) --- */}
      {/* 4条圆柱实木矮脚 */}
      {/* 后左脚 */}
      <line x1="-5.5" y1="5" x2="-5.5" y2="10.5" stroke="#754c2a" strokeWidth="1.6" strokeLinecap="round" />
      {/* 后右脚 */}
      <line x1="5.5" y1="4" x2="5.5" y2="9.5" stroke="#663f20" strokeWidth="1.6" strokeLinecap="round" />
      {/* 前左脚 */}
      <line x1="-4.5" y1="7" x2="-4.5" y2="12.2" stroke="#99683d" strokeWidth="1.8" strokeLinecap="round" />
      {/* 前右脚 */}
      <line x1="4.5" y1="6" x2="4.5" y2="11.5" stroke="#875830" strokeWidth="1.8" strokeLinecap="round" />

      {/* --- 3. 极简哑光粗陶筒花盆 (Minimal Matte Ceramic Cylinder Planter) --- */}
      {/* 3.1 盆身圆筒 */}
      <path
        d="M-7,-1.5 L-6.2,7.5 A6.2,2.4 0 0,0 6.2,7.5 L7,-1.5 Z"
        fill="url(#monsteraPotGrad)"
        stroke="#8f806d"
        strokeWidth="0.4"
      />
      {/* 3.2 盆壁微凸边缘线 */}
      <path d="M-6.2,7.5 A6.2,2.4 0 0,0 6.2,7.5" fill="none" stroke="#6b5e4e" strokeWidth="0.5" opacity="0.4" />

      {/* 3.3 盆口与湿润沃土 (Potting Soil) */}
      <ellipse cx="0" cy="-1.5" rx="7" ry="2.6" fill="url(#monsteraPotGrad)" stroke="#7d6f5d" strokeWidth="0.4" />
      <ellipse cx="0" cy="-1.3" rx="6.1" ry="2.1" fill="url(#monsteraSoilGrad)" />

      {/* 沃土表面小颗粒与陶粒 */}
      <circle cx="-2.5" cy="-1.0" r="0.4" fill="#694d36" opacity="0.7" />
      <circle cx="2.2" cy="-0.8" r="0.45" fill="#523924" opacity="0.8" />
      <circle cx="0.5" cy="-1.8" r="0.35" fill="#78593e" opacity="0.6" />
      <circle cx="-1.2" cy="-1.6" r="0.3" fill="#ffffff" opacity="0.25" />

      {/* --- 4. 生态趣味：蜿蜒垂挂的气生根 (Aerial Roots) --- */}
      <path
        d="M-1.5,-1 Q-4,1 -4.2,4 Q-4.4,7 -3.5,9.5"
        fill="none"
        stroke="#593b22"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M2.5,-1 Q4.2,1.5 3.8,4.5 Q3.5,6.5 4.5,8"
        fill="none"
        stroke="#52361d"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* --- 5. 龟背竹枝叶簇 (Monstera Foliage Cluster) --- */}
      {/* 点击或悬浮时产生轻微生动的微风摇曳 */}
      <g
        id="monstera-leaves-group"
        className={`origin-[0_0] transition-transform duration-500 ease-out ${
          rustle ? 'scale-[1.03] -rotate-1' : 'group-hover/monstera:scale-[1.01]'
        }`}
      >
        {/* 5.1 挺立优雅叶柄 (Arching Stems) */}
        {/* 远景叶叶柄 */}
        <path d="M0,-1.5 Q-1,-8 -2,-17" fill="none" stroke="#25542b" strokeWidth="1.2" strokeLinecap="round" />
        {/* 左大叶叶柄 */}
        <path d="M-0.5,-1.5 Q-6,-7 -11,-12" fill="none" stroke="#2c6233" strokeWidth="1.3" strokeLinecap="round" />
        {/* 右舒展叶叶柄 */}
        <path d="M0.5,-1.5 Q6,-6 10,-11" fill="none" stroke="#2f6937" strokeWidth="1.2" strokeLinecap="round" />
        {/* 主前叶叶柄 */}
        <path d="M0,-1.2 Q-1,-6 -2,-10" fill="none" stroke="#36783f" strokeWidth="1.4" strokeLinecap="round" />

        {/* 5.2 远景深绿色阔叶 (Background Deep Leaf: 奠定层次阴影) */}
        <g id="monstera-leaf-back" transform="translate(-2, -18) rotate(-8)">
          <path
            d="M0,0 C-3,-4 -6,-8 -5,-13 C-4,-17 0,-20 3,-18 C6,-16 7,-11 6,-6 C5,-3 2,-1 0,0 Z"
            fill="url(#leafGradBack)"
            stroke="#122f18"
            strokeWidth="0.4"
          />
          {/* 叶裂缺口 (Back slits) */}
          <path d="M-4.2,-10 L-1.8,-11" stroke="#122f18" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M4.6,-9 L1.8,-10" stroke="#122f18" strokeWidth="0.8" strokeLinecap="round" />
        </g>

        {/* 5.3 左侧舒展大开背叶 (Mature Left Leaf with Splits & Fenestration) */}
        <g id="monstera-leaf-left" transform="translate(-11, -12) rotate(-22)">
          {/* 主叶片轮廓 (经典心形钝尖龟背叶) */}
          <path
            d="M0,0 C-4,-3 -9,-5 -11,-9 C-13,-14 -11,-19 -7,-21 C-2,-23 3,-20 5,-15 C7,-11 5,-5 0,0 Z"
            fill="url(#leafGradMature)"
            stroke="#163f20"
            strokeWidth="0.45"
          />
          {/* 主叶脉 */}
          <path d="M0,0 Q-2,-9 -4,-18" fill="none" stroke="#4ade80" strokeWidth="0.6" opacity="0.4" />
          {/* 龟背竹特色：左侧深刻裂口 (Slits) */}
          <path d="M-10,-9 Q-6,-11 -4,-11" stroke="#0e2a15" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M-11.5,-13 Q-7,-14 -4,-14" stroke="#0e2a15" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M-9,-17 Q-6,-17 -4,-16" stroke="#0e2a15" strokeWidth="0.9" strokeLinecap="round" />
          {/* 右侧裂口 */}
          <path d="M3,-7 Q0,-9 -2,-9" stroke="#0e2a15" strokeWidth="1.0" strokeLinecap="round" />
          <path d="M4.5,-12 Q1,-13 -2,-13" stroke="#0e2a15" strokeWidth="1.0" strokeLinecap="round" />
          {/* 标志性椭圆穿孔 (Fenestration holes) */}
          <ellipse cx="-4.5" cy="-8.5" rx="0.7" ry="1.4" fill="#14361c" opacity="0.9" transform="rotate(-15 -4.5 -8.5)" />
          <ellipse cx="-4.8" cy="-14.5" rx="0.6" ry="1.2" fill="#14361c" opacity="0.9" transform="rotate(-10 -4.8 -14.5)" />
        </g>

        {/* 5.4 右侧向书桌舒展的侧叶 (Right Leaf arching gracefully toward desk) */}
        <g id="monstera-leaf-right" transform="translate(10, -11) rotate(26)">
          <path
            d="M0,0 C3,-3 7,-5 9,-9 C11,-13 9,-18 5,-19 C1,-20 -3,-17 -5,-13 C-6,-9 -4,-4 0,0 Z"
            fill="url(#leafGradMature)"
            stroke="#163f20"
            strokeWidth="0.45"
          />
          {/* 主叶脉 */}
          <path d="M0,0 Q2,-8 3,-16" fill="none" stroke="#4ade80" strokeWidth="0.55" opacity="0.35" />
          {/* 右侧深裂口 */}
          <path d="M8,-9 Q5,-10 3,-10" stroke="#0e2a15" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M9.5,-13 Q5.5,-13.5 3,-13" stroke="#0e2a15" strokeWidth="1.0" strokeLinecap="round" />
          {/* 左侧裂口 */}
          <path d="M-3,-8 Q-1,-9 1,-10" stroke="#0e2a15" strokeWidth="0.9" strokeLinecap="round" />
          {/* 叶孔 */}
          <ellipse cx="3.2" cy="-8" rx="0.6" ry="1.2" fill="#14361c" opacity="0.9" transform="rotate(15 3.2 -8)" />
        </g>

        {/* 5.5 前景主视觉大裂叶 (Dominant Front Leaf with Gloss & Clear Cutouts) */}
        <g id="monstera-leaf-front" transform="translate(-2, -10) rotate(5)">
          <path
            d="M0,0 C-5,-3 -10,-7 -11,-12 C-12,-18 -7,-23 -1,-24 C5,-24 10,-19 10,-13 C10,-7 5,-3 0,0 Z"
            fill="url(#leafGradBright)"
            stroke="#1c5229"
            strokeWidth="0.5"
          />
          {/* 明亮主叶脉 */}
          <path d="M0,0 Q-0.5,-10 -0.8,-21" fill="none" stroke="#86efac" strokeWidth="0.75" opacity="0.6" />
          {/* 细腻侧副叶脉 */}
          <path d="M-0.5,-6 Q-4,-7 -7,-8" fill="none" stroke="#86efac" strokeWidth="0.4" opacity="0.4" />
          <path d="M-0.6,-11 Q-5,-12 -8,-13" fill="none" stroke="#86efac" strokeWidth="0.4" opacity="0.4" />
          <path d="M-0.4,-6 Q4,-7 7,-8" fill="none" stroke="#86efac" strokeWidth="0.4" opacity="0.4" />
          <path d="M-0.6,-11 Q4,-12 7,-13" fill="none" stroke="#86efac" strokeWidth="0.4" opacity="0.4" />

          {/* 经典镂空深裂开背 (Deep Leaf Slits) */}
          <path d="M-10,-9 Q-6,-9.5 -3,-8.5" stroke="#12361b" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M-11,-13.5 Q-6.5,-13.5 -3,-12.5" stroke="#12361b" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M-9,-18 Q-5,-17.5 -2.5,-16.5" stroke="#12361b" strokeWidth="1.1" strokeLinecap="round" />

          <path d="M8,-9 Q5,-9.5 2,-8.5" stroke="#12361b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M9,-13.5 Q5.5,-13.5 2,-12.5" stroke="#12361b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M7,-18 Q4,-17.5 1.5,-16.5" stroke="#12361b" strokeWidth="1.0" strokeLinecap="round" />

          {/* 龟背竹招牌穿孔 (Classic fenestrations inside leaf body) */}
          <ellipse cx="-2.8" cy="-7.5" rx="0.7" ry="1.6" fill="#14361c" opacity="0.85" transform="rotate(-12 -2.8 -7.5)" />
          <ellipse cx="-3.2" cy="-12.5" rx="0.75" ry="1.8" fill="#14361c" opacity="0.85" transform="rotate(-10 -3.2 -12.5)" />
          <ellipse cx="2.6" cy="-7.8" rx="0.65" ry="1.5" fill="#14361c" opacity="0.85" transform="rotate(10 2.6 -7.8)" />
          <ellipse cx="2.8" cy="-12.8" rx="0.7" ry="1.7" fill="#14361c" opacity="0.85" transform="rotate(8 2.8 -12.8)" />

          {/* 娇艳叶面漫反射高光 (Leaf Surface Luster) */}
          <path
            d="M-1,-3 Q-4,-8 -4,-15 Q-1,-18 0,-15"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.8"
            opacity="0.35"
            strokeLinecap="round"
          />
        </g>

        {/* 5.6 顶端正破土初展的嫩芽卷芯 (Tender Unfurling Leaf Sprout) */}
        <path
          d="M0,-3 Q1,-10 0.5,-18 Q0,-22 2,-26"
          fill="none"
          stroke="#86efac"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M0.5,-18 Q2,-22 3,-25 Q1.5,-23 0,-21"
          fill="#4ade80"
          stroke="#22c55e"
          strokeWidth="0.4"
        />
      </g>

      {/* --- 6. 交互点击时的露珠滴落或生机光斑效果 --- */}
      {dropEffect && (
        <g id="monstera-dewdrop" className="animate-[ping_1s_ease-out]">
          <circle cx="-5" cy="-22" r="1.4" fill="#a7f3d0" opacity="0.9" />
          <circle cx="6" cy="-24" r="1.2" fill="#6ee7b7" opacity="0.8" />
        </g>
      )}

      {/* --- 7. 悬浮精致标签 (Hover Tooltip Badge) --- */}
      <g
        transform="translate(0, -42)"
        className="opacity-0 group-hover/monstera:opacity-100 transition-opacity duration-200 pointer-events-none"
      >
        <rect x="-38" y="-9" width="76" height="18" rx="9" fill="#18231c" opacity="0.92" />
        <text x="0" y="3.5" fill="#e2f7e8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
          🌿 生机龟背竹
        </text>
      </g>
    </g>
  );
};
