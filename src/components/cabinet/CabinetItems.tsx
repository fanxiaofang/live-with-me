import React from 'react';
import { CabinetSlotGeometry } from './cabinetTypes';

/**
 * 2.5D 储物格插槽物品组件 (CabinetItems)
 * 严格按照用户需求与参考图（图一）高保真重塑：
 * 1. 两个不同色的编织框 (完全复刻图一下层两只编织收纳篮)：
 *    - 自然麦秆粗绳编织框 (粗麻绳草编 + 蓝灰细条纹亚麻布衬 + 中央粗麻绳打结拉手)
 *    - 烟熏深灰黑细密柳编框 (深灰炭黑柳编 + 鼠尾草灰绿亚麻布衬 + 中央复古青铜半圆提手)
 * 2. 一袋和一瓶咖啡豆 (牛皮纸密封折口咖啡熟豆袋 + 塞满深烘焙咖啡豆的软木塞透明玻璃罐)
 * 3. 三个不一样的无耳朵咖啡杯 (抹茶绿手拉坯直壁陶杯、暖陶土红釉矮杯、燕麦微瑕浓缩宽口杯，全无手柄)
 */

// 1. 编织收纳框 (精确对应参考图一中的两款编织篮)
export const WovenBasketItem: React.FC<{
  geom: CabinetSlotGeometry;
  variant: 'natural' | 'charcoal';
}> = ({ geom, variant }) => {
  const isNatural = variant === 'natural';
  const center = geom.floorCenter;

  return (
    <g id={`woven-basket-${variant}`} transform={`translate(${center.x}, ${center.y})`}>
      <defs>
        {/* 自然麦秆/水草绳粗编渐变 */}
        <linearGradient id="wovenBasketNaturalGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a3723f" />
          <stop offset="35%" stopColor="#c5945e" />
          <stop offset="70%" stopColor="#dfb47e" />
          <stop offset="100%" stopColor="#ad7c48" />
        </linearGradient>

        {/* 烟熏灰黑细柳编渐变 */}
        <linearGradient id="wovenBasketCharcoalGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#292623" />
          <stop offset="35%" stopColor="#3d3833" />
          <stop offset="70%" stopColor="#4c4640" />
          <stop offset="100%" stopColor="#2f2b26" />
        </linearGradient>

        {/* 细条纹亚麻布衬渐变 (如参考图一左下) */}
        <linearGradient id="stripedLinerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#dedcd5" />
          <stop offset="50%" stopColor="#f4f1ea" />
          <stop offset="100%" stopColor="#e3e0d8" />
        </linearGradient>

        {/* 鼠尾草灰绿亚麻布衬渐变 (如参考图一右下) */}
        <linearGradient id="sageLinerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#485644" />
          <stop offset="45%" stopColor="#5d6e58" />
          <stop offset="85%" stopColor="#6e8168" />
          <stop offset="100%" stopColor="#4a5946" />
        </linearGradient>
      </defs>

      {/* 底部承重接触阴影 */}
      <polygon
        points="-8.2,1.2 5.8,-2.8 8.4,-0.8 -5.6,3.2"
        fill="#100803"
        opacity="0.45"
      />

      {/* --- A. 编织框立体外壁 (前受光面 + 左侧影面) --- */}
      {isNatural ? (
        // 1. 图一左下：自然麦秆粗麻绳编织筐
        <g id="natural-rope-basket">
          {/* 左侧进深暗面 */}
          <polygon
            points="-8.0,-4.5 -3.5,-5.8 -3.5,-0.2 -8.0,1.1"
            fill="#87582b"
            stroke="#633d19"
            strokeWidth="0.3"
          />
          {/* 左侧粗绳横向盘绕阴影 */}
          <line x1="-7.6" y1="-3.2" x2="-3.7" y2="-4.3" stroke="#523012" strokeWidth="0.45" opacity="0.6" />
          <line x1="-7.6" y1="-1.8" x2="-3.7" y2="-2.9" stroke="#523012" strokeWidth="0.45" opacity="0.6" />
          <line x1="-7.6" y1="-0.4" x2="-3.7" y2="-1.5" stroke="#523012" strokeWidth="0.45" opacity="0.6" />

          {/* 前立面受光主体 (粗绳草编盘条) */}
          <polygon
            points="-8.0,1.1 6.4,-3.0 6.4,-8.6 -8.0,-4.5"
            fill="url(#wovenBasketNaturalGrad2)"
            stroke="#70441d"
            strokeWidth="0.35"
          />

          {/* 粗绳索盘圈水平织纹 (厚实、颗粒感、自然起伏，如参考图一) */}
          <line x1="-7.8" y1="-3.0" x2="6.2" y2="-7.0" stroke="#75471d" strokeWidth="0.5" strokeDasharray="1.6 0.8" />
          <line x1="-7.8" y1="-2.7" x2="6.2" y2="-6.7" stroke="#f1cb9a" strokeWidth="0.4" strokeDasharray="1.6 0.8" opacity="0.8" />

          <line x1="-7.8" y1="-1.6" x2="6.2" y2="-5.6" stroke="#75471d" strokeWidth="0.5" strokeDasharray="1.6 0.8" />
          <line x1="-7.8" y1="-1.3" x2="6.2" y2="-5.3" stroke="#f1cb9a" strokeWidth="0.4" strokeDasharray="1.6 0.8" opacity="0.8" />

          <line x1="-7.8" y1="-0.2" x2="6.2" y2="-4.2" stroke="#75471d" strokeWidth="0.5" strokeDasharray="1.6 0.8" />
          <line x1="-7.8" y1="0.1" x2="6.2" y2="-3.9" stroke="#f1cb9a" strokeWidth="0.4" strokeDasharray="1.6 0.8" opacity="0.8" />

          {/* 顶部翻折蓝灰细条纹亚麻布衬 (Striped Ticking Fabric Liner 如参考图一) */}
          {/* 布衬侧面 */}
          <polygon
            points="-8.0,-4.5 -3.5,-5.8 6.6,-2.9 2.1,-1.6"
            fill="#e2dfd7"
            stroke="#b8b2a5"
            strokeWidth="0.25"
          />
          {/* 翻折在正面的布衬外翻檐 */}
          <polygon
            points="-8.0,-4.5 6.4,-8.6 6.4,-6.8 -8.0,-2.7"
            fill="url(#stripedLinerGrad)"
            stroke="#9e988b"
            strokeWidth="0.3"
          />
          {/* 经典的复古细条纹 (Navy/Grey pinstripes) */}
          <line x1="-6.5" y1="-4.1" x2="-6.5" y2="-2.3" stroke="#5a6b7d" strokeWidth="0.35" opacity="0.75" />
          <line x1="-4.5" y1="-4.7" x2="-4.5" y2="-2.9" stroke="#5a6b7d" strokeWidth="0.35" opacity="0.75" />
          <line x1="-2.5" y1="-5.3" x2="-2.5" y2="-3.5" stroke="#5a6b7d" strokeWidth="0.35" opacity="0.75" />
          <line x1="-0.5" y1="-5.9" x2="-0.5" y2="-4.1" stroke="#5a6b7d" strokeWidth="0.35" opacity="0.75" />
          <line x1="1.5" y1="-6.5" x2="1.5" y2="-4.7" stroke="#5a6b7d" strokeWidth="0.35" opacity="0.75" />
          <line x1="3.5" y1="-7.1" x2="3.5" y2="-5.3" stroke="#5a6b7d" strokeWidth="0.35" opacity="0.75" />
          <line x1="5.2" y1="-7.6" x2="5.2" y2="-5.8" stroke="#5a6b7d" strokeWidth="0.35" opacity="0.75" />

          {/* 正中央粗麻绳打结拉手 (Thick Knotted Rope Pull Handle 如参考图一) */}
          <g id="rope-knotted-pull">
            {/* 左右两个穿绳气孔圈 (Grommets) */}
            <circle cx="-2.6" cy="-1.5" r="0.65" fill="#241407" stroke="#4a2e16" strokeWidth="0.25" />
            <circle cx="0.8" cy="-2.5" r="0.65" fill="#241407" stroke="#4a2e16" strokeWidth="0.25" />

            {/* 自双孔延伸并交汇打结的粗麻绳 (Knotted Hemp Rope) */}
            <path
              d="
                M -2.5,-1.5
                Q -1.5,-0.6 -0.9,0.2
                Q -0.1,-1.2 0.7,-2.4
              "
              fill="none"
              stroke="#b58752"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            {/* 粗麻绳螺旋纹理 */}
            <path
              d="M -2.5,-1.5 Q -1.5,-0.6 -0.9,0.2"
              fill="none"
              stroke="#7c5327"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeDasharray="0.6 0.6"
            />
            {/* 饱满垂落的打结绳头 (Hanging Knot) */}
            <ellipse cx="-0.9" cy="0.4" rx="0.85" ry="0.65" fill="#a47743" stroke="#5a3717" strokeWidth="0.25" />
            <line x1="-0.9" y1="0.8" x2="-0.9" y2="1.8" stroke="#b58752" strokeWidth="0.7" strokeLinecap="round" />
            <line x1="-0.9" y1="0.8" x2="-0.9" y2="1.8" stroke="#714820" strokeWidth="0.7" strokeLinecap="round" strokeDasharray="0.4 0.4" />
          </g>
        </g>
      ) : (
        // 2. 图一右下：烟熏炭灰黑细柳编筐 + 鼠尾草灰绿布衬 + 复古青铜半圆提手
        <g id="charcoal-wicker-basket">
          {/* 左侧进深暗面 */}
          <polygon
            points="-8.0,-4.5 -3.5,-5.8 -3.5,-0.2 -8.0,1.1"
            fill="#1f1c19"
            stroke="#12100e"
            strokeWidth="0.3"
          />
          {/* 左侧柳编排线 */}
          <line x1="-7.6" y1="-3.4" x2="-3.7" y2="-4.5" stroke="#12100e" strokeWidth="0.35" />
          <line x1="-7.6" y1="-2.1" x2="-3.7" y2="-3.2" stroke="#12100e" strokeWidth="0.35" />
          <line x1="-7.6" y1="-0.8" x2="-3.7" y2="-1.9" stroke="#12100e" strokeWidth="0.35" />

          {/* 前立面受光主体 (细密深灰黑柳编) */}
          <polygon
            points="-8.0,1.1 6.4,-3.0 6.4,-8.6 -8.0,-4.5"
            fill="url(#wovenBasketCharcoalGrad2)"
            stroke="#1a1815"
            strokeWidth="0.35"
          />

          {/* 细密编织微肌理 */}
          <line x1="-7.8" y1="-3.2" x2="6.2" y2="-7.2" stroke="#5a534c" strokeWidth="0.35" strokeDasharray="1.2 0.8" />
          <line x1="-7.8" y1="-2.0" x2="6.2" y2="-6.0" stroke="#1a1815" strokeWidth="0.35" strokeDasharray="0.8 1.2" />
          <line x1="-7.8" y1="-0.8" x2="6.2" y2="-4.8" stroke="#5a534c" strokeWidth="0.35" strokeDasharray="1.2 0.8" />
          <line x1="-7.8" y1="0.3" x2="6.2" y2="-3.7" stroke="#1a1815" strokeWidth="0.35" strokeDasharray="0.8 1.2" />

          {/* 顶部翻折鼠尾草灰绿亚麻布衬 (Sage Green Linen Liner 如参考图一) */}
          {/* 布衬侧面 */}
          <polygon
            points="-8.0,-4.5 -3.5,-5.8 6.6,-2.9 2.1,-1.6"
            fill="#4a5946"
            stroke="#343f31"
            strokeWidth="0.25"
          />
          {/* 翻折在正面的布衬外翻檐 */}
          <polygon
            points="-8.0,-4.5 6.4,-8.6 6.4,-6.8 -8.0,-2.7"
            fill="url(#sageLinerGrad)"
            stroke="#384534"
            strokeWidth="0.3"
          />
          {/* 纯净素雅的布料微边缘高光 */}
          <line x1="-7.8" y1="-4.4" x2="6.2" y2="-8.4" stroke="#8fa687" strokeWidth="0.35" opacity="0.65" />
          <line x1="-7.8" y1="-2.7" x2="6.2" y2="-6.7" stroke="#323e2f" strokeWidth="0.3" opacity="0.8" />

          {/* 正中央复古青铜半圆提环 (Antique Bronze Bail Drop Handle 如参考图一) */}
          <g id="bronze-bail-pull">
            {/* 左右金属固定基座 */}
            <circle cx="-2.2" cy="-4.3" r="0.45" fill="#8c5828" stroke="#42250d" strokeWidth="0.2" />
            <circle cx="0.4" cy="-5.1" r="0.45" fill="#8c5828" stroke="#42250d" strokeWidth="0.2" />
            <circle cx="-2.2" cy="-4.3" r="0.2" fill="#d97706" />
            <circle cx="0.4" cy="-5.1" r="0.2" fill="#d97706" />

            {/* 半圆形垂挂青铜提环 (Curved Bail) */}
            <path
              d="
                M -2.2,-4.3
                C -2.2,-2.8 -1.2,-2.2 -0.9,-2.2
                C -0.6,-2.2 0.4,-3.6 0.4,-5.1
              "
              fill="none"
              stroke="#a66e38"
              strokeWidth="0.75"
              strokeLinecap="round"
            />
            {/* 青铜高光微反光 */}
            <path
              d="
                M -2.0,-4.2
                C -2.0,-3.0 -1.2,-2.5 -0.9,-2.5
              "
              fill="none"
              stroke="#fbbf24"
              strokeWidth="0.35"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>
        </g>
      )}

      {/* 外框高光微棱角线 */}
      <line x1="-8.0" y1="-4.5" x2="-8.0" y2="1.1" stroke="#ffffff" strokeWidth="0.4" opacity="0.2" />
      <line x1="-8.0" y1="1.1" x2="6.4" y2="-3.0" stroke="#ffffff" strokeWidth="0.35" opacity="0.18" />
    </g>
  );
};

// 2. 一袋和一瓶咖啡豆 (牛皮纸熟豆袋 + 满装深烘咖啡豆透明软木塞玻璃罐)
export const CoffeeBeansItem: React.FC<{ geom: CabinetSlotGeometry }> = ({ geom }) => {
  const center = geom.floorCenter;

  return (
    <g id="coffee-beans-corner" transform={`translate(${center.x}, ${center.y})`}>
      <defs>
        {/* 牛皮纸熟豆袋温润纸张渐变 */}
        <linearGradient id="kraftBagBodyGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ab8152" />
          <stop offset="35%" stopColor="#cda576" />
          <stop offset="70%" stopColor="#e0be92" />
          <stop offset="100%" stopColor="#ba8f5f" />
        </linearGradient>

        {/* 玻璃储豆罐晶莹质感渐变 */}
        <linearGradient id="glassJarWallGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.25" />
          <stop offset="8%" stopColor="#94a3b8" stopOpacity="0.10" />
          <stop offset="25%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="75%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="92%" stopColor="#94a3b8" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.22" />
        </linearGradient>

        {/* 柔和玻璃光学反射微光渐变 */}
        <linearGradient id="softGlassSheenGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="15%" stopColor="#ffffff" stopOpacity="0.30" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="85%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>

        {/* 天然质感软木塞渐变 */}
        <linearGradient id="naturalCorkGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a37242" />
          <stop offset="35%" stopColor="#c69768" />
          <stop offset="70%" stopColor="#d5a87b" />
          <stop offset="100%" stopColor="#ab7a49" />
        </linearGradient>

        {/* 深烘熟咖啡豆颗粒集聚渐变 */}
        <linearGradient id="roastedBeansGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a2a14" />
          <stop offset="50%" stopColor="#331b0c" />
          <stop offset="100%" stopColor="#221107" />
        </linearGradient>
      </defs>

      {/* --- A. 底部接触柔和暗影 --- */}
      {/* 咖啡袋阴影 */}
      <ellipse cx="-4.2" cy="0.6" rx="3.5" ry="1.4" fill="#1b1008" opacity="0.4" />
      {/* 玻璃储豆罐阴影 */}
      <ellipse cx="3.8" cy="-1.4" rx="2.8" ry="1.2" fill="#1b1008" opacity="0.4" />

      {/* --- B. 一袋手冲单品咖啡熟豆 (左侧直立牛皮纸气阀袋) --- */}
      <g id="coffee-bean-kraft-pouch" transform="translate(-4.2, 0)">
        {/* 咖啡袋侧立面 */}
        <polygon
          points="-2.6,-1.2 -1.4,-1.8 -1.4,-7.0 -2.6,-6.4"
          fill="#a47748"
          stroke="#7a5530"
          strokeWidth="0.25"
        />

        {/* 咖啡袋主正面 (微鼓蓬松纸袋) */}
        <polygon
          points="-2.6,-1.2 2.2,-2.6 2.2,-7.8 -2.6,-6.4"
          fill="url(#kraftBagBodyGrad2)"
          stroke="#7a5530"
          strokeWidth="0.3"
        />

        {/* 顶部卷折压边与密封金属夹 */}
        <polygon
          points="-2.6,-6.4 2.2,-7.8 2.0,-8.4 -2.8,-7.0"
          fill="#8c6136"
          stroke="#5e3e20"
          strokeWidth="0.25"
        />
        {/* 复古黄铜封口夹 */}
        <line x1="-2.5" y1="-7.0" x2="1.8" y2="-8.3" stroke="#d97706" strokeWidth="0.65" strokeLinecap="round" />
        <circle cx="-0.3" cy="-7.6" r="0.45" fill="#fef08a" />

        {/* 咖啡袋极简手作贴纸标签 */}
        <polygon
          points="-1.8,-2.8 1.4,-3.8 1.4,-5.8 -1.8,-4.8"
          fill="#faf6ee"
          stroke="#baa68c"
          strokeWidth="0.2"
        />
        {/* 标签上的烘焙单品咖啡豆印标 */}
        <ellipse cx="-0.2" cy="-4.3" rx="0.75" ry="0.5" fill="#54311c" />
        <line x1="-0.6" y1="-4.3" x2="0.2" y2="-4.3" stroke="#faf6ee" strokeWidth="0.25" strokeLinecap="round" />
        {/* 细小说明文字排版微线条 */}
        <line x1="-1.3" y1="-5.2" x2="0.9" y2="-5.8" stroke="#8a735c" strokeWidth="0.3" />
        <line x1="-1.3" y1="-3.4" x2="0.6" y2="-4.0" stroke="#a38c75" strokeWidth="0.25" />

        {/* 单向排气阀 (One-way Degassing Valve) */}
        <circle cx="-0.2" cy="-2.0" r="0.4" fill="#a47b4e" stroke="#684729" strokeWidth="0.15" />

        {/* 纸袋折角高光 */}
        <line x1="-2.6" y1="-6.4" x2="-2.6" y2="-1.2" stroke="#f5e1c8" strokeWidth="0.3" opacity="0.7" />
      </g>

      {/* --- C. 一瓶咖啡豆 (右侧高透透明圆柱玻璃储豆罐 + 软木塞) --- */}
      <g id="coffee-bean-glass-jar" transform="translate(4.0, -1.2)">
        {/* 罐底加厚实心玻璃底座折射层 */}
        <path
          d="M -3.2,0.5 L -3.2,-0.3 C -3.2,0.35 3.2,0.35 3.2,-0.3 L 3.2,0.5 C 3.2,1.2 -3.2,1.2 -3.2,0.5 Z"
          fill="#94a3b8"
          fillOpacity="0.12"
        />
        <path
          d="M -2.6,0.65 C -1.2,1.05 1.2,1.05 2.6,0.65"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.22"
          opacity="0.25"
        />

        {/* 满装深烘焙咖啡豆主体 */}
        <path
          d="M -2.9,-0.2 L -2.9,-5.3 C -2.9,-6.0 2.9,-6.0 2.9,-5.3 L 2.9,-0.2 C 2.9,0.5 -2.9,0.5 -2.9,-0.2 Z"
          fill="url(#roastedBeansGrad2)"
        />
        <ellipse cx="0" cy="-5.3" rx="2.9" ry="0.8" fill="#422511" stroke="#251208" strokeWidth="0.18" />

        {/* 咖啡豆颗粒纹理 */}
        <g id="cabinet-jar-beans-detail" opacity="0.95">
          <ellipse cx="-1.5" cy="-4.9" rx="0.75" ry="0.46" transform="rotate(-15, -1.5, -4.9)" fill="#5e371e" stroke="#221107" strokeWidth="0.14" />
          <line x1="-1.9" y1="-5.0" x2="-1.1" y2="-4.8" stroke="#1c0d05" strokeWidth="0.16" />

          <ellipse cx="0.1" cy="-5.1" rx="0.8" ry="0.48" fill="#522f18" stroke="#221107" strokeWidth="0.14" />
          <line x1="-0.3" y1="-5.1" x2="0.5" y2="-5.1" stroke="#1c0d05" strokeWidth="0.16" />

          <ellipse cx="1.7" cy="-4.7" rx="0.75" ry="0.45" transform="rotate(20, 1.7, -4.7)" fill="#63391f" stroke="#221107" strokeWidth="0.14" />
          <line x1="1.3" y1="-4.8" x2="2.1" y2="-4.5" stroke="#1c0d05" strokeWidth="0.16" />

          <ellipse cx="-1.8" cy="-3.8" rx="0.8" ry="0.48" fill="#4c2a15" stroke="#221107" strokeWidth="0.14" />
          <ellipse cx="-0.3" cy="-4.0" rx="0.82" ry="0.5" fill="#5a331b" stroke="#221107" strokeWidth="0.14" />
          <line x1="-0.7" y1="-4.0" x2="0.1" y2="-4.0" stroke="#1c0d05" strokeWidth="0.16" />

          <ellipse cx="1.4" cy="-3.6" rx="0.8" ry="0.48" fill="#4e2b16" stroke="#221107" strokeWidth="0.14" />
          <ellipse cx="-1.2" cy="-2.6" rx="0.82" ry="0.5" fill="#61371e" stroke="#221107" strokeWidth="0.14" />
          <line x1="-1.6" y1="-2.6" x2="-0.8" y2="-2.6" stroke="#1c0d05" strokeWidth="0.16" />

          <ellipse cx="0.6" cy="-2.7" rx="0.85" ry="0.5" fill="#522d17" stroke="#221107" strokeWidth="0.14" />
          <ellipse cx="2.0" cy="-2.4" rx="0.72" ry="0.44" fill="#462411" stroke="#221107" strokeWidth="0.14" />

          <ellipse cx="-1.8" cy="-1.4" rx="0.8" ry="0.48" fill="#4c2813" stroke="#221107" strokeWidth="0.14" />
          <ellipse cx="-0.1" cy="-1.5" rx="0.85" ry="0.52" fill="#59321b" stroke="#221107" strokeWidth="0.14" />
          <line x1="-0.5" y1="-1.5" x2="0.3" y2="-1.5" stroke="#1c0d05" strokeWidth="0.16" />

          <ellipse cx="1.5" cy="-1.3" rx="0.8" ry="0.48" fill="#482612" stroke="#221107" strokeWidth="0.14" />
          <ellipse cx="-0.8" cy="-0.5" rx="0.8" ry="0.5" fill="#563019" stroke="#221107" strokeWidth="0.14" />
          <ellipse cx="0.9" cy="-0.6" rx="0.8" ry="0.5" fill="#492713" stroke="#221107" strokeWidth="0.14" />
        </g>

        {/* 罐身高透高硼硅玻璃壁 */}
        <path
          d="M -3.2,0.5 L -3.2,-6.8 C -3.2,-7.5 3.2,-7.5 3.2,-6.8 L 3.2,0.5 C 3.2,1.2 -3.2,1.2 -3.2,0.5 Z"
          fill="url(#glassJarWallGrad2)"
          stroke="#94a3b8"
          strokeWidth="0.22"
          strokeOpacity="0.35"
        />

        {/* 玻璃罐口双层圆润收边 */}
        <ellipse cx="0" cy="-6.8" rx="3.2" ry="0.88" fill="none" stroke="#ffffff" strokeWidth="0.22" opacity="0.35" />
        <ellipse cx="0" cy="-6.8" rx="2.8" ry="0.75" fill="none" stroke="#cbd5e1" strokeWidth="0.16" opacity="0.25" />

        {/* 软木塞 */}
        <ellipse cx="0" cy="-6.9" rx="2.7" ry="0.72" fill="#78471f" opacity="0.6" />
        <path
          d="M -2.8,-6.9 L -2.5,-8.3 C -2.5,-9.0 2.5,-9.0 2.5,-8.3 L 2.8,-6.9 Z"
          fill="url(#naturalCorkGrad2)"
          stroke="#7a461d"
          strokeWidth="0.2"
        />
        <ellipse cx="0" cy="-8.3" rx="2.5" ry="0.7" fill="#deb688" stroke="#966535" strokeWidth="0.18" />
        <circle cx="-1.1" cy="-7.6" r="0.16" fill="#5e3414" opacity="0.32" />
        <circle cx="0.8" cy="-7.8" r="0.14" fill="#5e3414" opacity="0.32" />

        {/* 柔和光学反射微光 */}
        <line
          x1="-2.3"
          y1="-6.4"
          x2="-2.3"
          y2="0.0"
          stroke="url(#softGlassSheenGrad2)"
          strokeWidth="0.28"
          strokeLinecap="round"
        />
        <line
          x1="-2.3"
          y1="-5.5"
          x2="-2.3"
          y2="-1.5"
          stroke="#ffffff"
          strokeWidth="0.15"
          strokeLinecap="round"
          opacity="0.24"
        />
        <line
          x1="2.4"
          y1="-6.0"
          x2="2.4"
          y2="-0.6"
          stroke="#ffffff"
          strokeWidth="0.16"
          strokeLinecap="round"
          opacity="0.12"
        />
      </g>
    </g>
  );
};

// 3. 四只手作无耳朵陶杯 (Four Handcrafted Handleless Ceramic Tumblers 如参考图一)
export const HandlelessCupsItem: React.FC<{ geom: CabinetSlotGeometry }> = ({ geom }) => {
  const center = geom.floorCenter;

  return (
    <g id="handleless-ceramic-cups" transform={`translate(${center.x}, ${center.y})`}>
      <defs>
        {/* 杯1：抹茶绿粗陶高杯渐变 */}
        <linearGradient id="cupSagePotteryGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#435845" />
          <stop offset="40%" stopColor="#607b62" />
          <stop offset="75%" stopColor="#7a9a7c" />
          <stop offset="100%" stopColor="#516953" />
        </linearGradient>

        {/* 杯2：粉白斑纹手作陶杯渐变 */}
        <linearGradient id="cupPinkSpotGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a86050" />
          <stop offset="40%" stopColor="#c57f6e" />
          <stop offset="75%" stopColor="#d9998b" />
          <stop offset="100%" stopColor="#b46a5a" />
        </linearGradient>

        {/* 杯3：瑞典温暖赤陶红双色釉杯渐变 */}
        <linearGradient id="cupTerracottaGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#873520" />
          <stop offset="40%" stopColor="#b44d32" />
          <stop offset="75%" stopColor="#cb654b" />
          <stop offset="100%" stopColor="#963c25" />
        </linearGradient>

        {/* 杯4：燕麦微瑕手工粗陶杯渐变 */}
        <linearGradient id="cupOatmealGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b8ac9c" />
          <stop offset="40%" stopColor="#ded5c7" />
          <stop offset="80%" stopColor="#ede6db" />
          <stop offset="100%" stopColor="#c5baa9" />
        </linearGradient>
      </defs>

      {/* --- 底层接触投影 --- */}
      {/* 杯1阴影 (后左高杯) */}
      <ellipse cx="-5.2" cy="-2.0" rx="1.8" ry="0.8" fill="#180e07" opacity="0.35" />
      {/* 杯2阴影 (前左粉斑杯) */}
      <ellipse cx="-5.0" cy="1.6" rx="2.0" ry="0.85" fill="#180e07" opacity="0.4" />
      {/* 杯3阴影 (前中赤陶杯) */}
      <ellipse cx="0.0" cy="0.4" rx="2.1" ry="0.9" fill="#180e07" opacity="0.4" />
      {/* 杯4阴影 (前右燕麦铁斑杯) */}
      <ellipse cx="4.8" cy="-0.6" rx="2.2" ry="0.95" fill="#180e07" opacity="0.4" />

      {/* --- 杯 1: 后左 · 抹茶绿手拉坯直壁高杯 (Tall Sage Matcha Yunomi, 无耳朵，图一后排) --- */}
      <g id="cup-1-tall-sage" transform="translate(-5.2, -2.4)">
        <ellipse cx="0" cy="0.2" rx="1.5" ry="0.6" fill="#69462d" stroke="#422a19" strokeWidth="0.2" />
        <path
          d="M -1.5,0.1 L -1.7,-6.2 L 1.7,-6.2 L 1.5,0.1 Z"
          fill="url(#cupSagePotteryGrad2)"
          stroke="#394b3a"
          strokeWidth="0.25"
        />
        {/* 手工拉坯微起伏肋纹 */}
        <line x1="-1.55" y1="-1.5" x2="1.55" y2="-1.5" stroke="#7e9e80" strokeWidth="0.3" opacity="0.75" />
        <line x1="-1.6" y1="-3.0" x2="1.6" y2="-3.0" stroke="#364938" strokeWidth="0.3" opacity="0.7" />
        <line x1="-1.65" y1="-4.5" x2="1.65" y2="-4.5" stroke="#7e9e80" strokeWidth="0.3" opacity="0.75" />
        {/* 杯口圆唇与深色热茶/咖啡 */}
        <ellipse cx="0" cy="-6.2" rx="1.7" ry="0.65" fill="#84a687" stroke="#364938" strokeWidth="0.25" />
        <ellipse cx="0" cy="-6.2" rx="1.3" ry="0.45" fill="#24160d" />
        <line x1="-1.1" y1="-5.8" x2="-0.9" y2="-0.2" stroke="#ffffff" strokeWidth="0.35" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* --- 杯 2: 前左 · 粉白云斑手作矮陶杯 (Pink Terracotta Cloud Spotted Cup, 图一前左) --- */}
      <g id="cup-2-spotted" transform="translate(-5.0, 1.2)">
        <ellipse cx="0" cy="0.3" rx="1.9" ry="0.7" fill="#7a4635" />
        <path
          d="M -1.9,0.2 L -2.0,-3.8 L 2.0,-3.8 L 1.9,0.2 Z"
          fill="url(#cupPinkSpotGrad2)"
          stroke="#753d30"
          strokeWidth="0.25"
        />
        {/* 粉白手绘云斑色块 (如参考图一) */}
        <ellipse cx="-0.8" cy="-2.4" rx="0.9" ry="0.6" fill="#f2dfd8" opacity="0.9" />
        <ellipse cx="0.9" cy="-1.4" rx="0.8" ry="0.55" fill="#f2dfd8" opacity="0.85" />
        <ellipse cx="-0.4" cy="-0.8" rx="0.6" ry="0.4" fill="#f2dfd8" opacity="0.8" />
        {/* 口沿与内壁黑咖啡 */}
        <ellipse cx="0" cy="-3.8" rx="2.0" ry="0.7" fill="#f5ede7" stroke="#753d30" strokeWidth="0.2" />
        <ellipse cx="0" cy="-3.8" rx="1.6" ry="0.5" fill="#29160d" />
        <line x1="-1.3" y1="-3.5" x2="-1.2" y2="-0.5" stroke="#ffffff" strokeWidth="0.35" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* --- 杯 3: 前中 · 双色赤陶红釉白沿矮杯 (Dipped Terracotta Tumbler, 图一前中) --- */}
      <g id="cup-3-terracotta" transform="translate(0.0, 0.0)">
        {/* 粗砂裸陶底 */}
        <ellipse cx="0" cy="0.3" rx="1.9" ry="0.7" fill="#753f22" />
        <path
          d="M -1.9,0.2 L -2.0,-1.4 L 2.0,-1.4 L 1.9,0.2 Z"
          fill="#8f522e"
          stroke="#5a3118"
          strokeWidth="0.2"
        />
        {/* 温暖赤陶红釉主体 */}
        <path
          d="M -2.0,-1.4 L -2.1,-4.2 L 2.1,-4.2 L 2.0,-1.4 Z"
          fill="url(#cupTerracottaGrad2)"
          stroke="#6e2513"
          strokeWidth="0.25"
        />
        {/* 顶部白色浸釉口沿带 (White Dipped Rim 如参考图一) */}
        <path
          d="M -2.1,-3.4 L -2.1,-4.2 L 2.1,-4.2 L 2.1,-3.4 Q 0,-3.7 -2.1,-3.4 Z"
          fill="#fbf7f0"
          stroke="#d1c5b4"
          strokeWidth="0.2"
        />
        <ellipse cx="0" cy="-4.2" rx="2.1" ry="0.75" fill="#fbf7f0" stroke="#752916" strokeWidth="0.2" />
        <ellipse cx="0" cy="-4.2" rx="1.7" ry="0.55" fill="#2c1409" />
        <line x1="-1.3" y1="-3.9" x2="-1.2" y2="-1.6" stroke="#ffffff" strokeWidth="0.4" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* --- 杯 4: 前右 · 燕麦微瑕手工铁斑宽口杯 (Speckled Oatmeal Flared Tumbler, 图一前右) --- */}
      <g id="cup-4-oatmeal" transform="translate(4.8, -1.0)">
        <ellipse cx="0" cy="0.3" rx="2.0" ry="0.75" fill="#784725" stroke="#4a2a14" strokeWidth="0.2" />
        <path
          d="M -1.8,0.2 L -2.3,-4.0 L 2.3,-4.0 L 1.8,0.2 Z"
          fill="url(#cupOatmealGrad2)"
          stroke="#948574"
          strokeWidth="0.25"
        />
        {/* 手工铁斑黑芝麻微粒 (如参考图一) */}
        <circle cx="-0.8" cy="-1.4" r="0.2" fill="#4d3b2e" />
        <circle cx="0.9" cy="-2.4" r="0.22" fill="#4d3b2e" />
        <circle cx="-1.1" cy="-3.0" r="0.16" fill="#4d3b2e" />
        <circle cx="0.3" cy="-0.9" r="0.18" fill="#4d3b2e" />
        {/* 宽敞敞口沿与意式香浓咖啡 */}
        <ellipse cx="0" cy="-4.0" rx="2.3" ry="0.8" fill="#fbf8f2" stroke="#877767" strokeWidth="0.2" />
        <ellipse cx="0" cy="-4.0" rx="1.9" ry="0.6" fill="#241208" />
        <ellipse cx="0.2" cy="-4.0" rx="1.2" ry="0.35" fill="#b45309" opacity="0.85" />
        <line x1="-1.5" y1="-3.7" x2="-1.1" y2="-0.5" stroke="#ffffff" strokeWidth="0.45" strokeLinecap="round" opacity="0.75" />
      </g>
    </g>
  );
};

// 4. 插槽项统一派发渲染器 (Slot Dispatcher)
export const RenderCabinetSlotItem: React.FC<{
  geom: CabinetSlotGeometry;
  itemType: string;
}> = ({ geom, itemType }) => {
  switch (itemType) {
    case 'woven-basket-natural':
      return <WovenBasketItem geom={geom} variant="natural" />;
    case 'woven-basket-charcoal':
      return <WovenBasketItem geom={geom} variant="charcoal" />;
    case 'coffee-beans':
      return <CoffeeBeansItem geom={geom} />;
    case 'handleless-cups':
      return <HandlelessCupsItem geom={geom} />;
    default:
      return null;
  }
};
