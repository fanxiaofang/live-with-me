import React, { useState } from 'react';

export interface YorkshireSceneTheme {
  skyTop: string;
  skyBottom: string;
  hillGreenFar: string;
  hillGreenMid: string;
  hillGreenNear: string;
  wheatFar: string;
  wheatNear: string;
  roadColor: string;
  riverColor: string;
  riverReflect: string;
  riverRipples: string;
  ambientTint: string;
  cottageGlow: string;
  tractorLightGlow: string;
  roofColor: string;
  isNight: boolean;
  isRainy: boolean;
}

export interface YorkshireCommonProps {
  theme: YorkshireSceneTheme;
  onTriggerToast?: (msg: string) => void;
  setHoveredObject?: (name: string | null) => void;
}

/**
 * 🌊 1. 左侧远景清澈山涧河湾 (Yorkshire Far-Left Beck & Meander)
 * 严格遵照草图一：河流位于最左侧山谷（x: -720 ~ -460），从高架桥远景自然蜿蜒而下，
 * 绝不侵入中央草坪，保留左侧广袤通透的田园负空间！
 */
export const YorkshireRiverBeck: React.FC<YorkshireCommonProps> = ({
  theme,
  onTriggerToast,
  setHoveredObject,
}) => {
  return (
    <g id="yorkshire-river-beck" opacity="0.96">
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
        <ellipse cx="-605" cy="270" rx="9" ry="5" fill="#6f6558" stroke="#484036" strokeWidth="0.8" />
        <ellipse cx="-595" cy="274" rx="6" ry="3.2" fill="#8a7e70" />
        <ellipse cx="-690" cy="420" rx="12" ry="6.5" fill="#665d51" stroke="#423b32" strokeWidth="0.8" />
        <ellipse cx="-692" cy="418" rx="8" ry="3.5" fill="#8c8072" opacity="0.75" />
        <ellipse cx="-535" cy="630" rx="14" ry="7.5" fill="#6c6255" stroke="#453d34" strokeWidth="0.8" />
        <ellipse cx="-538" cy="627" rx="9" ry="4" fill="#928678" opacity="0.7" />
      </g>

      {/* 溪边悠闲嬉戏白鸭母子 (Ducks swimming quietly in the far beck) */}
      <g
        id="far-river-ducks"
        transform="translate(-640, 480)"
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

/**
 * 🏰 2. 主屋石砌高台底座与弧形护土石围墙 (The Grand Terrace Bastion & Curved Retaining Wall)
 * 严格还原草图一的核心骨架！
 * - 主屋下方拥有 38px 厚实垂直落差的规整风化灰岩基座；
 * - 主屋庭院外围环抱着优雅的【弧形干砌石围墙 (Curved Drystone Wall)】；
 * - 围墙正中有【宽阔石台阶 (Stone Steps)】与【田园小木门 (Cottage Gate)】通向下方的中景缓坡！
 */
export const YorkshireStoneBastion: React.FC<YorkshireCommonProps> = ({
  onTriggerToast,
  setHoveredObject,
}) => {
  return (
    <g id="homestead-grand-bastion-system">
      <defs>
        {/* 规整风化灰砂岩墙体渐变 (暖调厚重石材) */}
        <linearGradient id="ysBastionFaceGradV2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#766d61" />
          <stop offset="35%" stopColor="#62594e" />
          <stop offset="75%" stopColor="#4c4338" />
          <stop offset="100%" stopColor="#352e26" />
        </linearGradient>

        {/* 饱满圆润石冠石帽渐变 (Coping Stones) */}
        <linearGradient id="ysBastionCapGradV2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a89d8e" />
          <stop offset="50%" stopColor="#beb3a4" />
          <stop offset="100%" stopColor="#968b7d" />
        </linearGradient>

        {/* 台地草坪向阳渐变 (Terrace Courtyard Turf) */}
        <linearGradient id="ysTerraceTurfGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9eb54a" />
          <stop offset="50%" stopColor="#80993c" />
          <stop offset="100%" stopColor="#5f772e" />
        </linearGradient>
      </defs>

      {/* ========================================================================= */}
      {/* A. 紧贴主屋底部的垂直厚重石基 (Elevated House Plinth Foundation)            */}
      {/*    主屋木梁真正坐落其上，垂直厚度 38px，彻底解决主屋悬空浮空感！            */}
      {/* ========================================================================= */}
      <g id="house-immediate-stone-plinth">
        {/* 地基接触阴影 */}
        <polygon points="-305,152 0,60 305,152 0,285" fill="#141c12" opacity="0.5" filter="url(#softShadow)" />

        {/* 实心平整石台顶面 (Plinth Top Surface) */}
        <polygon points="-300,150 0,62 300,150 0,242" fill="#756a5c" stroke="#483f34" strokeWidth="1.0" />

        {/* 西南垂直石立面 (South-West Plinth Face - 厚度 36px) */}
        <polygon points="-300,150 0,242 0,278 -300,186" fill="url(#ysBastionFaceGradV2)" stroke="#261f18" strokeWidth="1.0" />

        {/* 东南垂直石立面 (South-East Plinth Face) */}
        <polygon points="0,242 300,150 300,186 0,278" fill="#3b332a" stroke="#261f18" strokeWidth="1.0" />

        {/* 规整建筑石材水平错缝与竖向砌缝 (Masonry Coursing) */}
        <g opacity="0.6">
          {/* 中间水平贯通缝 */}
          <line x1="-300" y1="168" x2="0" y2="260" stroke="#1f1812" strokeWidth="1.2" />
          <line x1="0" y1="260" x2="300" y2="168" stroke="#1c150f" strokeWidth="1.2" />
          {/* 错落竖缝 */}
          {[-240, -180, -120, -60].map((sx, i) => {
            const syTop = 150 + ((sx + 300) / 300) * 92 + (i % 2 === 0 ? 0 : 18);
            return <line key={`pl-seam-w-${sx}`} x1={sx} y1={syTop} x2={sx} y2={syTop + 18} stroke="#1f1812" strokeWidth="1.0" />;
          })}
          {[60, 120, 180, 240].map((sx, i) => {
            const syTop = 242 - (sx / 300) * 92 + (i % 2 === 0 ? 0 : 18);
            return <line key={`pl-seam-e-${sx}`} x1={sx} y1={syTop} x2={sx} y2={syTop + 18} stroke="#1c150f" strokeWidth="1.0" />;
          })}
        </g>

        {/* 基座顶边向阳高光倒角 */}
        <line x1="-300" y1="150" x2="0" y2="242" stroke="#d5cabb" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0" y1="242" x2="300" y2="150" stroke="#a49787" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* ========================================================================= */}
      {/* B. 草图核心：主屋台地外围【弧形干砌石围墙与石台阶】(Curved Bastion & Steps) */}
      {/*    顺应等轴测透视，环抱着主屋前院（x: -260 ~ 360, y: 380 ~ 490），           */}
      {/*    正中央开有宽阔大石阶与原木小门，通往下方的中景缓坡！                     */}
      {/* ========================================================================= */}
      <g id="curved-bastion-terrace-perimeter">
        {/* 台地前庭平坦草皮 (Raised Terrace Forecourt Lawn) */}
        <path
          d="M-300,186 C-280,290 -240,410 -65,465 L65,465 C220,420 320,310 300,186 Z"
          fill="url(#ysTerraceTurfGrad)"
        />

        {/* 弧形挡土石墙垂直立面 (Curved Retaining Wall Face - 高度 26px) */}
        {/* 西翼弧形段 */}
        <path
          d="M-280,260 C-260,350 -200,435 -65,465 L-65,491 C-200,461 -260,376 -280,286 Z"
          fill="url(#ysBastionFaceGradV2)"
          stroke="#261f18"
          strokeWidth="0.9"
        />
        {/* 东翼弧形段 */}
        <path
          d="M65,465 C200,435 280,350 320,260 L320,286 C280,376 200,461 65,491 Z"
          fill="#3e362d"
          stroke="#261f18"
          strokeWidth="0.9"
        />

        {/* 弧形墙体规整块面石缝阴影 (Masonry Seams on Curved Wall) */}
        <g opacity="0.6">
          {/* 水平分层缝 */}
          <path d="M-280,273 C-260,363 -200,448 -65,478" fill="none" stroke="#211a14" strokeWidth="1.0" />
          <path d="M65,478 C200,448 280,363 320,273" fill="none" stroke="#1f1812" strokeWidth="1.0" />
          {/* 纵向石块错缝 */}
          {[-230, -180, -130, -90].map((wx, i) => (
            <line key={`cw-seam-w-${i}`} x1={wx} y1={330 + i * 32} x2={wx + 2} y2={344 + i * 32} stroke="#211a14" strokeWidth="1.0" />
          ))}
          {[90, 130, 180, 230].map((wx, i) => (
            <line key={`cw-seam-e-${i}`} x1={wx} y1={426 - i * 32} x2={wx - 2} y2={440 - i * 32} stroke="#1f1812" strokeWidth="1.0" />
          ))}
        </g>

        {/* 墙顶厚实整齐的半圆石冠帽 (Coping Stones - 参考图3优美饱满弧顶) */}
        <path
          d="M-280,260 C-260,350 -200,435 -65,465"
          fill="none"
          stroke="url(#ysBastionCapGradV2)"
          strokeWidth="6.0"
          strokeLinecap="round"
        />
        <path
          d="M-280,258.5 C-260,348.5 -200,433.5 -65,463.5"
          fill="none"
          stroke="#dcd2c4"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />

        <path
          d="M65,465 C200,435 280,350 320,260"
          fill="none"
          stroke="url(#ysBastionCapGradV2)"
          strokeWidth="6.0"
          strokeLinecap="round"
        />
        <path
          d="M65,463.5 C200,433.5 280,348.5 320,258.5"
          fill="none"
          stroke="#dcd2c4"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* 🌟 核心：台地正中宽阔迎宾大石阶 (Grand Terraced Steps leading to gentle slope) */}
        {/* 严格对应草图一中台地正前方的【石台阶】！ */}
        <g id="bastion-central-stone-steps" transform="translate(0, 465)">
          {/* 接地阴影 */}
          <ellipse cx="0" cy="46" rx="72" ry="16" fill="#151e13" opacity="0.45" />

          {/* 第4级 (底阶·嵌入中景缓坡) */}
          <polygon points="-58,34 0,44 58,34 0,24" fill="#665b4f" stroke="#3d352b" strokeWidth="0.8" />
          <polygon points="-58,34 0,44 0,50 -58,40" fill="#4d4338" />
          <polygon points="0,44 58,34 58,40 0,50" fill="#383027" />

          {/* 第3级 */}
          <polygon points="-50,22 0,31 50,22 0,13" fill="#786c5e" stroke="#483f34" strokeWidth="0.8" />
          <polygon points="-50,22 0,31 0,37 -50,28" fill="#584e42" />
          <polygon points="0,31 50,22 50,28 0,37" fill="#42392f" />

          {/* 第2级 */}
          <polygon points="-42,10 0,18 42,10 0,2" fill="#8a7c6c" stroke="#54493c" strokeWidth="0.8" />
          <polygon points="-42,10 0,18 0,24 -42,16" fill="#635748" />
          <polygon points="0,18 42,10 42,16 0,24" fill="#4c4136" />

          {/* 第1级 (顶阶·与围墙台面齐平) */}
          <polygon points="-34,-1 0,6 34,-1 0,-8" fill="#9e907e" stroke="#605445" strokeWidth="0.8" />
          <polygon points="-34,-1 0,6 0,12 -34,5" fill="#6f6353" />
          <polygon points="0,6 34,-1 34,5 0,12" fill="#54483b" />

          {/* 台阶踏面高光微线 */}
          <line x1="-54" y1="34" x2="0" y2="43" stroke="#b8ad9e" strokeWidth="0.9" />
          <line x1="-46" y1="22" x2="0" y2="30" stroke="#c4b9aa" strokeWidth="0.9" />
          <line x1="-38" y1="10" x2="0" y2="17" stroke="#d2c7b8" strokeWidth="0.9" />

          {/* 台阶两侧经典的英伦原木田园矮门 (Rustic Bastion Wicket Gate - 草图一中的门) */}
          <g
            id="terrace-wicket-gate"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onTriggerToast?.('🚪 庄园台地原木小门 · 拾级而下，通向阳光明媚的中景缓坡');
            }}
            onMouseEnter={() => setHoveredObject?.('🚪 台地田园小门 · 连通主屋石台与下方中景缓坡牧场')}
            onMouseLeave={() => setHoveredObject?.(null)}
          >
            {/* 左立柱与合页 */}
            <rect x="-65" y="-12" width="6" height="32" rx="1.5" fill="#48321e" stroke="#26180c" strokeWidth="0.8" />
            <polygon points="-66,-12 -62,-16 -58,-12" fill="#63452b" />
            <rect x="-65" y="-4" width="10" height="2.5" fill="#1f2320" />
            <rect x="-65" y="10" width="10" height="2.5" fill="#1f2320" />

            {/* 右立柱与锁扣 */}
            <rect x="59" y="-12" width="6" height="32" rx="1.5" fill="#48321e" stroke="#26180c" strokeWidth="0.8" />
            <polygon points="58,-12 62,-16 66,-12" fill="#63452b" />

            {/* 左右对开的木条小栅门 (Open Wicket Gates - 敞开迎宾状态) */}
            <g transform="rotate(-35 -65 0)">
              <line x1="-65" y1="0" x2="-40" y2="0" stroke="#755234" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="-65" y1="10" x2="-40" y2="10" stroke="#755234" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="-42" y1="-4" x2="-42" y2="16" stroke="#5a3d24" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="-64" y1="10" x2="-42" y2="0" stroke="#5a3d24" strokeWidth="2.0" />
            </g>
            <g transform="rotate(35 65 0)">
              <line x1="65" y1="0" x2="40" y2="0" stroke="#755234" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="65" y1="10" x2="40" y2="10" stroke="#755234" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="42" y1="-4" x2="42" y2="16" stroke="#5a3d24" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="64" y1="10" x2="42" y2="0" stroke="#5a3d24" strokeWidth="2.0" />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
};

/**
 * 🧱 3. 约克郡开阔牧场石墙网格与田亩色块 (Yorkshire Pasture Fields & Drystone Walls)
 * 严格按照草图一与参考图1、3：
 * - 顺应等轴测斜线，将原野划分为 4~5 个宽敞大气的【几何田亩色块】（Patchwork Dales Fields）；
 * - 石墙只作为田亩的天然分界脊线自然咬合，完全消灭生硬悬浮的圆规细线！
 */
export const YorkshireDrystoneWalls: React.FC<YorkshireCommonProps> = ({
  onTriggerToast,
  setHoveredObject,
}) => {
  return (
    <g id="yorkshire-pasture-fields-and-walls">
      <defs>
        {/* 牧场田亩明度交错渐变 (消除单调死板平绿) */}
        <linearGradient id="ysPastureField1Grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8da846" />
          <stop offset="100%" stopColor="#698533" />
        </linearGradient>

        <linearGradient id="ysPastureField2Grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9cb34c" />
          <stop offset="100%" stopColor="#7a943a" />
        </linearGradient>

        <linearGradient id="ysPastureField3Grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#819b3d" />
          <stop offset="100%" stopColor="#5d7529" />
        </linearGradient>

        {/* 规整灰岩石墙立面与顶石 */}
        <linearGradient id="ysFieldWallFaceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6e6557" />
          <stop offset="50%" stopColor="#554d40" />
          <stop offset="100%" stopColor="#3c352a" />
        </linearGradient>

        <linearGradient id="ysFieldWallCapGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a49989" />
          <stop offset="50%" stopColor="#b6ab9a" />
          <stop offset="100%" stopColor="#928676" />
        </linearGradient>
      </defs>

      {/* ========================================================================= */}
      {/* A. 广袤几何田亩地块层 (Patchwork Dales Fields Base)                         */}
      {/* ========================================================================= */}
      <g id="patchwork-pasture-fields" opacity="0.95">
        {/* 田亩 1：西侧河畔开阔草场 (West Beck Meadow) */}
        <polygon
          points="-720,440 -460,370 -310,480 -560,640"
          fill="url(#ysPastureField1Grad)"
          stroke="#425824"
          strokeWidth="0.8"
        />

        {/* 田亩 2：中景宽广缓坡草场 (Central Sunny Slope) */}
        <polygon
          points="-310,480 0,510 260,490 200,690 -160,720"
          fill="url(#ysPastureField2Grad)"
          stroke="#425824"
          strokeWidth="0.8"
        />

        {/* 田亩 3：东侧山麓牧场 (East Hillside Fell Pasture) */}
        <polygon
          points="260,490 580,440 760,480 620,720 200,690"
          fill="url(#ysPastureField3Grad)"
          stroke="#425824"
          strokeWidth="0.8"
        />
      </g>

      {/* ========================================================================= */}
      {/* B. 经典田埂干砌石墙 (Authentic Drystone Boundary Walls)                     */}
      {/*    顺应田亩边界自然铺展，大方整齐，绝不杂乱！                                 */}
      {/* ========================================================================= */}
      <g id="field-boundary-walls">
        {/* ----------------------------------------------------------------------- */}
        {/* 墙 1：西侧河畔牧场分界石墙 (West Field Wall)                            */}
        {/* ----------------------------------------------------------------------- */}
        <g id="wall-west-pasture">
          <polygon
            points="-720,440 -460,370 -460,378 -720,448"
            fill="url(#ysFieldWallFaceGrad)"
            stroke="#211a14"
            strokeWidth="0.7"
          />
          <line
            x1="-720"
            y1="440"
            x2="-460"
            y2="370"
            stroke="url(#ysFieldWallCapGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <line
            x1="-720"
            y1="440"
            x2="-460"
            y2="370"
            stroke="#241e18"
            strokeWidth="1.0"
            strokeDasharray="4 16"
          />

          {/* 南段下倾衔接石墙 */}
          <polygon
            points="-460,370 -310,480 -310,488 -460,378"
            fill="url(#ysFieldWallFaceGrad)"
            stroke="#211a14"
            strokeWidth="0.7"
          />
          <line
            x1="-460"
            y1="370"
            x2="-310"
            y2="480"
            stroke="url(#ysFieldWallCapGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </g>

        {/* ----------------------------------------------------------------------- */}
        {/* 墙 2：东侧草坡梯级分界石墙与大木门 (East Pasture Dividing Wall & 5-Bar Gate)*/}
        {/* ----------------------------------------------------------------------- */}
        <g id="wall-east-pasture">
          {/* 石墙前半段 */}
          <polygon
            points="260,490 440,460 440,468 260,498"
            fill="url(#ysFieldWallFaceGrad)"
            stroke="#211a14"
            strokeWidth="0.7"
          />
          <line
            x1="260"
            y1="490"
            x2="440"
            y2="460"
            stroke="url(#ysFieldWallCapGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* 🌟 标志性五杠斜撑原木牧场门 (5-Bar Field Gate - x: 440 ~ 495, y: 460) */}
          <g
            id="east-5bar-pasture-gate"
            transform="translate(440, 452)"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onTriggerToast?.('🚪 约克郡传统原木牧场门 · 5-Bar Field Gate，通往东侧开阔羊群山坡');
            }}
            onMouseEnter={() => setHoveredObject?.('🚪 英伦传统五木杠栅栏门 · 经典的农夫手工斜撑牧场大门')}
            onMouseLeave={() => setHoveredObject?.(null)}
          >
            <rect x="0" y="-6" width="5" height="28" rx="1.2" fill="#442f1b" stroke="#25170a" strokeWidth="0.8" />
            <rect x="52" y="3" width="4.5" height="25" rx="1.2" fill="#442f1b" stroke="#25170a" strokeWidth="0.8" />
            {[0, 4.5, 9, 13.5, 18].map((ry, i) => (
              <line key={`gate-rail-${i}`} x1="3" y1={ry} x2="53" y2={ry + 7} stroke="#735234" strokeWidth={i === 0 ? '2.6' : '1.8'} strokeLinecap="round" />
            ))}
            <line x1="4" y1="16" x2="52" y2="7" stroke="#5a3d24" strokeWidth="2.2" strokeLinecap="round" />
          </g>

          {/* 石墙后半段向上延伸至山脚 */}
          <polygon
            points="498,467 680,435 680,443 498,475"
            fill="url(#ysFieldWallFaceGrad)"
            stroke="#211a14"
            strokeWidth="0.7"
          />
          <line
            x1="498"
            y1="467"
            x2="680"
            y2="435"
            stroke="url(#ysFieldWallCapGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </g>

        {/* ----------------------------------------------------------------------- */}
        {/* 墙 3：右上通讯站山包修筑石径与台阶 (Observatory Hill Terraced Wall)      */}
        {/* 严格对应草图一中的【通讯站山包】！                                       */}
        {/* ----------------------------------------------------------------------- */}
        <g id="observatory-hill-terrace-walls">
          {/* 半山腰护坡石墙 (Lower Terrace Wall) */}
          <path
            d="M740,240 C800,260 880,270 980,270 L980,278 C880,278 800,268 740,248 Z"
            fill="url(#ysFieldWallFaceGrad)"
            stroke="#211a14"
            strokeWidth="0.7"
          />
          <path
            d="M740,240 C800,260 880,270 980,270"
            fill="none"
            stroke="url(#ysFieldWallCapGrad)"
            strokeWidth="4.2"
            strokeLinecap="round"
          />

          {/* 直通山顶电波站的修筑石径与石阶 (Stone Ascent Steps) */}
          <g id="observatory-stone-ascent" opacity="0.88">
            {[
              { x: 835, y: 195, w: 22 },
              { x: 825, y: 210, w: 24 },
              { x: 810, y: 225, w: 26 },
              { x: 790, y: 240, w: 28 },
              { x: 765, y: 255, w: 30 },
            ].map((st, i) => (
              <g key={`obs-step-${i}`}>
                <ellipse cx={st.x} cy={st.y + 1} rx={st.w / 2} ry="3.5" fill="#241d16" opacity="0.45" />
                <ellipse cx={st.x} cy={st.y} rx={st.w / 2} ry="3.2" fill="#8e8274" stroke="#544a3e" strokeWidth="0.6" />
                <line x1={st.x - st.w / 3} y1={st.y - 0.5} x2={st.x + st.w / 3} y2={st.y - 0.5} stroke="#bfb4a5" strokeWidth="0.6" />
              </g>
            ))}
          </g>
        </g>
      </g>
    </g>
  );
};

/**
 * 🐑 4. 约克郡黑脸羊群生态 (Swaledale Sheep Flock)
 * 5 只小羊安然分布在各个划分清晰的开阔田亩中，悠闲吃草、打盹、相依，治愈不拥挤！
 */
export const YorkshireSheepFlock: React.FC<YorkshireCommonProps> = ({
  onTriggerToast,
  setHoveredObject,
}) => {
  const [activeSheepIndex, setActiveSheepIndex] = useState<number | null>(null);
  const [sheepSaying, setSheepSaying] = useState<string | null>(null);

  const sheepQuotes = [
    '🐑 咩~ 这里的牧草带着清晨甘露，真甜！',
    '🐑 咩咩~ 阳光晒在毛茸茸的身上好舒服。',
    '🐑 咩~ 坐在石墙边，看远处的蒸汽小火车开过去。',
    '🐑 咩~ 午后微风吹过草甸，适合打个舒服的盹。',
    '🐑 咩咩~ 慢慢来，生活本就该像流云一样从容。',
  ];

  const handleSheepClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const quote = sheepQuotes[index % sheepQuotes.length];
    setActiveSheepIndex(index);
    setSheepSaying(quote);
    onTriggerToast?.(quote);

    setTimeout(() => {
      setActiveSheepIndex((prev) => (prev === index ? null : prev));
      setSheepSaying(null);
    }, 4500);
  };

  return (
    <g id="yorkshire-sheep-flock">
      <defs>
        {/* 蓬松米白羊毛体 (Cream White Wool) */}
        <linearGradient id="ysSheepWoolGradV2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffdfa" />
          <stop offset="55%" stopColor="#f3ede2" />
          <stop offset="100%" stopColor="#ded5c4" />
        </linearGradient>
      </defs>

      {/* 🐑 Sheep 1: 西侧河畔开阔草场啃草羊 (x: -420, y: 460) */}
      <g
        id="sheep-1"
        transform="translate(-420, 460) scale(0.95)"
        className="cursor-pointer group/sheep"
        onClick={(e) => handleSheepClick(0, e)}
        onMouseEnter={() => setHoveredObject?.('🐑 约克郡黑脸羊 · 在西侧开阔草场安静吃草（点击互动）')}
        onMouseLeave={() => setHoveredObject?.(null)}
      >
        <ellipse cx="0" cy="14" rx="16" ry="5.5" fill="#182315" opacity="0.35" />
        <line x1="-8" y1="8" x2="-9" y2="16" stroke="#241e1a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="-3" y1="8" x2="-3" y2="17" stroke="#1d1714" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="5" y1="8" x2="6" y2="16" stroke="#241e1a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="10" y1="8" x2="11" y2="17" stroke="#1d1714" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="0" cy="2" rx="17" ry="12" fill="url(#ysSheepWoolGradV2)" stroke="#d4cab7" strokeWidth="0.8" />
        <ellipse cx="-4" cy="-2" rx="14" ry="10" fill="#fffdfa" />
        <g transform="translate(-16, 6) rotate(15)">
          <ellipse cx="0" cy="0" rx="6" ry="4.5" fill="#2d2621" />
          <ellipse cx="-2" cy="0" rx="4.5" ry="3.5" fill="#1b1511" />
          <ellipse cx="-4" cy="0" rx="1.8" ry="1.2" fill="#ded5c4" />
          <ellipse cx="2" cy="-4" rx="2.5" ry="1.2" fill="#241d18" transform="rotate(-30 2 -4)" />
          <ellipse cx="2" cy="4" rx="2.5" ry="1.2" fill="#241d18" transform="rotate(30 2 4)" />
        </g>
        {activeSheepIndex === 0 && sheepSaying && (
          <g transform="translate(0, -32)" className="animate-bounce pointer-events-none">
            <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#1c1917" opacity="0.95" stroke="#f59e0b" strokeWidth="0.8" />
            <text x="0" y="4" fill="#fef3c7" fontSize="8.5" fontWeight="bold" textAnchor="middle">{sheepSaying}</text>
          </g>
        )}
      </g>

      {/* 🐑 Sheep 2: 主屋台地前方中景草场安睡羊 (x: -50, y: 610) */}
      <g
        id="sheep-2"
        transform="translate(-50, 610) scale(1.0)"
        className="cursor-pointer group/sheep"
        onClick={(e) => handleSheepClick(1, e)}
        onMouseEnter={() => setHoveredObject?.('🐑 约克郡黑脸羊 · 在向阳草坡上惬意打盹（点击互动）')}
        onMouseLeave={() => setHoveredObject?.(null)}
      >
        <ellipse cx="0" cy="10" rx="20" ry="7" fill="#182315" opacity="0.38" />
        <ellipse cx="-12" cy="11" rx="3" ry="1.5" fill="#241d18" />
        <ellipse cx="12" cy="11" rx="3" ry="1.5" fill="#241d18" />
        <ellipse cx="0" cy="2" rx="20" ry="11" fill="url(#ysSheepWoolGradV2)" stroke="#d4cab7" strokeWidth="0.8" />
        <ellipse cx="2" cy="0" rx="17" ry="9" fill="#fffdfa" />
        <g transform="translate(-16, 1)">
          <ellipse cx="0" cy="0" rx="6" ry="4.5" fill="#2b231e" />
          <ellipse cx="-2" cy="0" rx="4.5" ry="3.5" fill="#1c1612" />
          <path d="M-1,-1 Q0,-0.2 1,-1" stroke="#fef08a" strokeWidth="0.8" fill="none" />
          <ellipse cx="2" cy="-4" rx="3" ry="1.2" fill="#221a15" transform="rotate(-10 2 -4)" />
          <text x="-8" y="-6" fill="#fef3c7" fontSize="7.5" fontWeight="bold" className="animate-pulse">z</text>
          <text x="-4" y="-11" fill="#fef3c7" fontSize="9.5" fontWeight="bold" className="animate-bounce">Z</text>
        </g>
        {activeSheepIndex === 1 && sheepSaying && (
          <g transform="translate(0, -32)" className="animate-bounce pointer-events-none">
            <rect x="-70" y="-12" width="140" height="24" rx="12" fill="#1c1917" opacity="0.95" stroke="#f59e0b" strokeWidth="0.8" />
            <text x="0" y="4" fill="#fef3c7" fontSize="8.5" fontWeight="bold" textAnchor="middle">{sheepSaying}</text>
          </g>
        )}
      </g>

      {/* 🐑 Sheep 3 & 4: 东侧开阔大草场母子羊 (x: 360, y: 560) */}
      <g id="sheep-mother-and-lamb-group">
        <g
          id="sheep-3"
          transform="translate(360, 560) scale(1.0)"
          className="cursor-pointer group/sheep"
          onClick={(e) => handleSheepClick(2, e)}
          onMouseEnter={() => setHoveredObject?.('🐑 约克郡母羊 · 在牧场大门旁照看着小羊（点击互动）')}
          onMouseLeave={() => setHoveredObject?.(null)}
        >
          <ellipse cx="0" cy="16" rx="18" ry="6" fill="#182315" opacity="0.35" />
          <line x1="-9" y1="9" x2="-9" y2="18" stroke="#241e1a" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="-3" y1="9" x2="-3" y2="19" stroke="#1d1714" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="6" y1="9" x2="6" y2="18" stroke="#241e1a" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="12" y1="9" x2="13" y2="19" stroke="#1d1714" strokeWidth="2.2" strokeLinecap="round" />
          <ellipse cx="0" cy="2" rx="19" ry="13" fill="url(#ysSheepWoolGradV2)" stroke="#d4cab7" strokeWidth="0.8" />
          <ellipse cx="-3" cy="-1" rx="16" ry="10" fill="#fffdfa" />
          <g transform="translate(16, 4) rotate(20)">
            <ellipse cx="0" cy="0" rx="6.5" ry="5" fill="#2d2621" />
            <ellipse cx="2" cy="0" rx="4.5" ry="3.5" fill="#1b1511" />
            <ellipse cx="4" cy="0.5" rx="1.8" ry="1.2" fill="#ded5c4" />
            <circle cx="1" cy="-2" r="0.9" fill="#fef08a" />
            <circle cx="1" cy="-2" r="0.5" fill="#000000" />
            <ellipse cx="-1" cy="-4" rx="3" ry="1.4" fill="#241d18" transform="rotate(-20 -1 -4)" />
          </g>
          {activeSheepIndex === 2 && sheepSaying && (
            <g transform="translate(0, -34)" className="animate-bounce pointer-events-none">
              <rect x="-70" y="-12" width="140" height="24" rx="12" fill="#1c1917" opacity="0.95" stroke="#f59e0b" strokeWidth="0.8" />
              <text x="0" y="4" fill="#fef3c7" fontSize="8.5" fontWeight="bold" textAnchor="middle">{sheepSaying}</text>
            </g>
          )}
        </g>

        {/* 欢脱小羊羔 */}
        <g
          id="sheep-4"
          transform="translate(410, 575) scale(0.68)"
          className="cursor-pointer group/sheep"
          onClick={(e) => handleSheepClick(3, e)}
          onMouseEnter={() => setHoveredObject?.('🐑 雀跃小羊羔 · 活蹦乱跳的黑脸小羊羔（点击互动）')}
          onMouseLeave={() => setHoveredObject?.(null)}
        >
          <ellipse cx="0" cy="14" rx="12" ry="4.5" fill="#182315" opacity="0.32" />
          <line x1="-7" y1="6" x2="-10" y2="15" stroke="#241e1a" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="-2" y1="6" x2="-3" y2="16" stroke="#1d1714" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="5" y1="6" x2="8" y2="14" stroke="#241e1a" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="9" y1="6" x2="13" y2="15" stroke="#1d1714" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="0" cy="0" rx="13" ry="9" fill="url(#ysSheepWoolGradV2)" stroke="#d4cab7" strokeWidth="0.7" />
          <ellipse cx="-1" cy="-2" rx="11" ry="7" fill="#fffdfa" />
          <g transform="translate(10, -4)">
            <ellipse cx="0" cy="0" rx="4.8" ry="3.8" fill="#2d2621" />
            <circle cx="1" cy="-1.5" r="0.8" fill="#fef08a" />
            <circle cx="1" cy="-1.5" r="0.45" fill="#000000" />
            <ellipse cx="-1" cy="-3.5" rx="2.2" ry="1" fill="#221a15" />
          </g>
          {activeSheepIndex === 3 && sheepSaying && (
            <g transform="translate(0, -32)" className="animate-bounce pointer-events-none">
              <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#1c1917" opacity="0.95" stroke="#f59e0b" strokeWidth="0.8" />
              <text x="0" y="4" fill="#fef3c7" fontSize="8.5" fontWeight="bold" textAnchor="middle">{sheepSaying}</text>
            </g>
          )}
        </g>
      </g>

      {/* 🐑 Sheep 5: 右上山麓石墙边探头小羊 (x: 640, y: 420) */}
      <g
        id="sheep-5"
        transform="translate(640, 420) scale(0.75)"
        className="cursor-pointer group/sheep"
        onClick={(e) => handleSheepClick(4, e)}
        onMouseEnter={() => setHoveredObject?.('🐑 山麓小羊 · 静立在石墙边迎风远眺（点击互动）')}
        onMouseLeave={() => setHoveredObject?.(null)}
      >
        <ellipse cx="0" cy="14" rx="14" ry="5" fill="#182315" opacity="0.3" />
        <line x1="-7" y1="7" x2="-7" y2="15" stroke="#241e1a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="-2" y1="7" x2="-2" y2="16" stroke="#1d1714" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="5" y1="7" x2="5" y2="15" stroke="#241e1a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="9" y1="7" x2="10" y2="16" stroke="#1d1714" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="0" cy="1" rx="15" ry="10" fill="url(#ysSheepWoolGradV2)" stroke="#d4cab7" strokeWidth="0.7" />
        <ellipse cx="2" cy="-1" rx="12" ry="8" fill="#fffdfa" />
        <g transform="translate(12, -4)">
          <ellipse cx="0" cy="0" rx="5" ry="4" fill="#2d2621" />
          <ellipse cx="2" cy="0" rx="3.5" ry="2.8" fill="#1e1814" />
          <ellipse cx="-1" cy="-3.5" rx="2.5" ry="1.2" fill="#241d18" transform="rotate(-20 -1 -3.5)" />
        </g>
        {activeSheepIndex === 4 && sheepSaying && (
          <g transform="translate(0, -32)" className="animate-bounce pointer-events-none">
            <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#1c1917" opacity="0.95" stroke="#f59e0b" strokeWidth="0.8" />
            <text x="0" y="4" fill="#fef3c7" fontSize="8.5" fontWeight="bold" textAnchor="middle">{sheepSaying}</text>
          </g>
        )}
      </g>
    </g>
  );
};
