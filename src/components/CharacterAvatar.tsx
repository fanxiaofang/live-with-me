import React, { useState } from 'react';
import { IsoDirection4, normalizeIsoFacing } from '../utils/isometric';

/**
 * 2.5D Isometric Character Avatar System
 * 包含：
 * 1. 小人核心模板 (Core Humanoid Puppet Template)
 * 2. 薄款纯色包头帽与自然刘海骨骼系统 (Thin Solid Beanie & Natural Peeking Bangs)
 * 3. 个性化差异参数配置表 (Character Variant Props Schema)
 * 4. 5种典型角色姿态变体 (Sitting cross-legged, Desk coding, Sofa lounging, Standing observatory, Sleeping in bed)
 */

export type CharacterFacing = 'front' | 'side' | 'back' | IsoDirection4;

export interface CharacterHeadProps {
  cx?: number;
  cy?: number;
  r?: number;
  skinColor?: string;
  hairColor?: string;
  hairStyle?: 'curtain_crescent' | 'wavy_curly' | 'long_wavy' | 'medium_straight' | string;
  beanieColor?: string;
  showBeanie?: boolean;
  isSleeping?: boolean;
  hasPompom?: boolean;
  facing?: CharacterFacing; // 2.5D 轴测三大核心视角：'front' (正身) | 'side' (侧身) | 'back' (后背)
  className?: string;
}

/**
 * 核心小人头部骨骼渲染组件
 * - 2.5D 轴测支持三大视角：正身(front)、侧身(side)、后背(back)
 * - 后背视角(back)：毛线帽包裹住绝大部分后脑勺，无任何前额刘海穿模，呈现真实专注的背影
 * - 侧身视角(side)：侧脸弧线、侧面毛线帽包裹枕骨，额侧探出一小缕月牙发梢
 * - 正身视角(front)：前额微八字月牙刘海紧贴翻折卷檐自然探出，纯哑光无反光
 */
export const CharacterHead: React.FC<CharacterHeadProps> = ({
  cx = 0,
  cy = -14,
  r = 7,
  skinColor = '#f5d6be',
  hairColor = '#1f1b18',
  hairStyle = 'curtain_crescent',
  beanieColor = '#425b6e',
  showBeanie = true,
  isSleeping = false,
  hasPompom = true,
  facing = 'front',
  className = '',
}) => {
  if (isSleeping) {
    // 侧睡/卧榻安睡状态下的头部与毛线帽
    const scale = r / 6.5;
    return (
      <g
        id="character-head-sleeping"
        className={className}
        transform={`translate(${cx}, ${cy}) scale(${scale})`}
      >
        {/* 睡枕微陷阴影 */}
        <ellipse cx="0" cy="2.5" rx="7.2" ry="2.2" fill="#1b120a" opacity="0.18" />

        {/* 睡眠头部基底 (Skin) */}
        <circle cx="0" cy="0" r="6.5" fill={skinColor} />

        {/* 枕边散开的发束 (根据所选发型) */}
        {renderSleepingHairstyle(hairStyle, hairColor)}

        {/* 极简闭目弧线 (Peaceful Eyes) */}
        <path
          d="M-2.5,1.2 Q-1.1,2.1 0.3,1.2 M1.6,1.2 Q3.0,2.1 4.4,1.2"
          fill="none"
          stroke="#5c432d"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        {/* 柔和晚安腮红 */}
        <circle cx="-3.2" cy="2.4" r="1.1" fill="#f87171" opacity="0.3" />
        <circle cx="3.2" cy="2.4" r="1.1" fill="#f87171" opacity="0.3" />

        {showBeanie ? (
          <g id="sleeping-knit-beanie-group">
            {/* 顶端毛线小绒球 (Pompom) - 哑光质感 */}
            {hasPompom && (
              <g id="sleeping-beanie-pompom">
                <circle cx="-4.5" cy="-7.2" r="1.8" fill={beanieColor} />
                <path
                  d="M-5.6,-8.2 Q-4.5,-8.8 -3.4,-7.8 Q-2.8,-6.8 -4.0,-6.0"
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="0.5"
                  fill="none"
                />
              </g>
            )}

            {/* 毛线帽冠体 (Dome Crown) - 饱满包裹住整个后脑勺 */}
            <path
              d="M-7.2,-0.2 C-7.6,-6.8 -4.2,-8.5 0,-8.5 C4.2,-8.5 7.6,-6.8 7.2,-0.2 C5.0,-1.0 -5.0,-1.0 -7.2,-0.2 Z"
              fill={beanieColor}
            />

            {/* 翻折帽檐 (Folded Cuff) - 有厚度且包裹头部两端 */}
            <path
              d="M-7.3,0.5 C-7.5,-2.2 -4.0,-3.4 0,-3.4 C4.0,-3.4 7.5,-2.2 7.3,0.5 C5.0,-0.4 -5.0,-0.4 -7.3,0.5 Z"
              fill={beanieColor}
            />
            {/* 折檐暗色分界线 (无白色反光，仅同色系暗影沉淀) */}
            <path
              d="M-7.0,-1.4 Q0,-2.4 7.0,-1.4"
              stroke="rgba(0,0,0,0.25)"
              strokeWidth="0.65"
              strokeLinecap="round"
              fill="none"
            />

            {/* 翻折帽檐下露出的经典微八字月牙刘海 */}
            {renderPeekingBangs(hairStyle, hairColor, true)}
          </g>
        ) : (
          /* 无毛线帽时的原始侧散发型 */
          <path d="M-5,-2 Q0,-8 5,-2 Q3,-5 -5,-2 Z" fill={hairColor} />
        )}
      </g>
    );
  }

  // 常规小人头部统一比例 (Standard Upright Metric: r=7, cy=-14)
  const scale = r / 7;
  const transY = cy - (-14) * scale;
  const transX = cx;

  // 统一映射到 2.5D 轴测 4 大空间朝向 (SE: 正前 | SW: 侧身左下 | NW: 后背 | NE: 侧身后上)
  const isoDir = normalizeIsoFacing(facing);
  const isBack = isoDir === 'NW';
  const isSide = isoDir === 'SW' || isoDir === 'NE';
  const sideFlipX = isoDir === 'NE' ? -1 : 1;

  // ==========================================
  // 视角 1: 后背视角 (NW / back)
  // 桌子旁/背对镜头时：毛线帽饱满包裹住绝大部分后脑勺，无任何前额刘海！
  // ==========================================
  if (isBack) {
    return (
      <g
        id="character-head-back"
        className={className}
        transform={`translate(${transX}, ${transY}) scale(${scale})`}
      >
        {/* 1. 后脑勺下沉入后颈的轮廓底基 */}
        <circle cx="0" cy="-14" r="7.0" fill={skinColor} />
        
        {/* 后颈发脚与后颈皮肉微露 (后领口上方一截自然沉静的后颈) */}
        <path
          d="M-3.8,-8.5 C-3.8,-6.4 3.8,-6.4 3.8,-8.5 Z"
          fill={skinColor}
        />
        {/* 后发际发型 (严格对应参考图：按所选发型从毛线帽檐下自然延展出波浪卷/披肩长发/及肩直发/默认短发) */}
        {renderBackHairstyle(hairStyle, hairColor)}

        {showBeanie ? (
          <g id="knit-beanie-back-view">
            {/* 2. 帽顶小绒球 (Pompom) - 位于头顶正上方偏中后部 */}
            {hasPompom && (
              <g id="beanie-pompom-back">
                <circle cx="0" cy="-22.6" r="2.3" fill={beanieColor} />
                <path
                  d="M-1.4,-23.6 C-0.6,-24.4 0.8,-24.4 1.5,-23.5 C2.1,-22.6 1.4,-21.3 0,-21.3 C-1.3,-21.3 -2.0,-22.3 -1.4,-23.6 Z"
                  fill="rgba(0,0,0,0.14)"
                />
                <path
                  d="M-1.2,-23.0 Q0,-24.0 1.2,-23.2 M-1.0,-22.0 Q0,-21.2 0.8,-22.0"
                  stroke="rgba(0,0,0,0.24)"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            )}

            {/* 3. 饱满覆盖整个后脑勺的毛线帽冠 (Back Beanie Crown) */}
            {/* 覆盖后脑勺面积超过 88%，从头顶圆润向两侧和后下方大幅延伸，彻底包裹住枕骨 */}
            <path
              d="M-7.6,-10.8 C-8.3,-19.5 -4.8,-23.4 0,-23.4 C4.8,-23.4 8.3,-19.5 7.6,-10.8 C6.0,-8.2 -6.0,-8.2 -7.6,-10.8 Z"
              fill={beanieColor}
            />

            {/* 后脑勺自然编织曲面微暗弧线 (纯哑光深色沉淀，绝无高光) */}
            <path
              d="M-5.4,-14.0 C-5.6,-19.2 -2.8,-22.2 0,-22.6 C2.8,-22.2 5.6,-19.2 5.4,-14.0"
              stroke="rgba(0,0,0,0.16)"
              strokeWidth="0.55"
              strokeDasharray="1.5 1.5"
              fill="none"
            />

            {/* 4. 后颈部的翻折卷檐 (Back Folded Cuff) - 从后方看，卷檐包裹住后脑勺下沿 */}
            <path
              d="M-7.7,-10.8 C-5.4,-8.6 5.4,-8.6 7.7,-10.8 C7.3,-14.0 0,-14.6 -7.3,-14.0 Z"
              fill={beanieColor}
            />

            {/* 翻折折痕下边缘微暗阴影 */}
            <path
              d="M-7.5,-11.0 C-5.0,-8.8 5.0,-8.8 7.5,-11.0"
              stroke="rgba(0,0,0,0.22)"
              strokeWidth="0.8"
              fill="none"
            />
            {/* 翻折帽檐上边缘针缝暗线 */}
            <path
              d="M-7.0,-13.8 Q0,-14.6 7.0,-13.8"
              stroke="rgba(0,0,0,0.18)"
              strokeWidth="0.6"
              fill="none"
            />

            {/* 竖向毛线织纹细缝 (Back Rib Texture) */}
            <line x1="-5.0" y1="-13.8" x2="-5.2" y2="-11.4" stroke="rgba(0,0,0,0.14)" strokeWidth="0.5" />
            <line x1="-2.5" y1="-14.2" x2="-2.6" y2="-10.6" stroke="rgba(0,0,0,0.14)" strokeWidth="0.5" />
            <line x1="0" y1="-14.4" x2="0" y2="-10.2" stroke="rgba(0,0,0,0.14)" strokeWidth="0.5" />
            <line x1="2.5" y1="-14.2" x2="2.6" y2="-10.6" stroke="rgba(0,0,0,0.14)" strokeWidth="0.5" />
            <line x1="5.0" y1="-13.8" x2="5.2" y2="-11.4" stroke="rgba(0,0,0,0.14)" strokeWidth="0.5" />

            {/* 注意：后背视角严格不渲染任何前额刘海！ */}
          </g>
        ) : (
          /* 无毛线帽时的后脑勺短发底座 */
          <path d="M-7,-13 C-7,-22 7,-22 7,-13 C6,-8 -6,-8 -7,-13 Z" fill={hairColor} />
        )}
      </g>
    );
  }

  // ==========================================
  // 视角 2: 侧身视角 (SW: 侧身左下 / NE: 侧身后上镜像)
  // 核心原则：
  // 1. 绝对圆润饱满：脑门与后脑勺向外自然隆起（横向外扩到 -8.2 与 +8.2），消除被压扁感
  // 2. 彻底告别“墨镜”误解：绝不使用封闭大圆厚块！
  //    改为正身同款工艺的优雅纤细月牙发梢（厚度仅 1px，轻盈探出一抹微翘细月牙，自然贴服脑门侧边）
  // 3. 帽檐温和圆润斜扣：前额高位自然包裹，后脑勺厚实圆满，与正身/后背风格浑然天成
  // ==========================================
  if (isSide) {
    return (
      <g
        id="character-head-side"
        className={className}
        transform={`translate(${transX}, ${transY}) scale(${scale * sideFlipX}, ${scale})`}
      >
        {/* 1. 头部基底：绝对饱满圆润的标准圆球，呈现极致 Q 版治愈感 */}
        <circle cx="0" cy="-14" r="7.1" fill={skinColor} />

        {/* 侧面视角延展发型 (卷发/长发/及肩直发自然落入后颈) */}
        {renderSideHairstyle(hairStyle, hairColor)}

        {showBeanie ? (
          <g id="knit-beanie-side-view">
            {/* 2. 顶部小毛球 (Pompom) - 用户微调位点偏后斜角 */}
            {hasPompom && (
              <g id="beanie-pompom-side">
                <circle cx="3.528" cy="-22.138" r="2.2" fill={beanieColor} />
                <path
                  d="M 2.239 -23.226 C 3.039 -24.026 4.439 -23.65 5.039 -22.75 C 5.639 -21.75 4.839 -20.826 3.839 -20.826 C 2.739 -20.826 1.939 -21.826 2.239 -23.226 Z"
                  fill="rgba(0,0,0,0.14)"
                />
                <path
                  d="M 2.969 -22.891 C 3.635 -23.491 3.993 -22.906 4.66 -22.373 M 2.816 -21.538 C 3.482 -20.871 4.082 -20.871 4.616 -21.538"
                  stroke="rgba(0,0,0,0.22)"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            )}

            {/* 3. 饱满高拱帽冠 (Beanie Crown Dome) - 用户微调拱度与后枕包裹 */}
            <path
              d="M -7.603 -13.394 C -9.375 -20.675 -3.422 -23.264 0.485 -23.664 C 4.392 -24.064 10.006 -19.44 7.599 -11.044 C 3.999 -12.544 -0.003 -13.694 -7.603 -13.394 Z"
              fill={beanieColor}
            />

            {/* 帽冠暗弧虚线质感 (纯哑光，无反光) */}
            <path
              d="M-4.8,-17.2 C-4.4,-20.8 -1.5,-22.8 1.5,-22.6 C4.8,-22.2 6.8,-19.2 6.4,-14.2"
              stroke="rgba(0,0,0,0.16)"
              strokeWidth="0.55"
              strokeDasharray="1.5 1.5"
              fill="none"
            />

            {/* 4. 翻折厚卷檐 (Folded Cuff) - 用户微调贴合前额与后脑弧度 */}
            <path
              d="M -7.303 -13.221 C -5.177 -18.749 -2 -16.6 3 -15.2 C 5.5 -14.4 7.288 -13.401 7.688 -12.401 C 8.145 -11.357 6.652 -9.425 7.179 -10.045 C 3.092 -11.554 0.628 -12.459 -3.412 -12.907 C -5.928 -13.186 -7.003 -12.621 -7.303 -13.221 Z"
              fill={beanieColor}
            />

            {/* 卷檐下边缘接触阴影线 */}
            <path
              d="M -7.485 -13.071 C -3.113 -14.442 1.439 -12.028 6.823 -10.297"
              stroke="rgba(0,0,0,0.22)"
              strokeWidth="0.75"
              fill="none"
            />

            {/* 卷檐上边缘接缝暗线 */}
            <path
              d="M -7.112 -16.059 C -1.687 -16.688 3.437 -14.942 7.818 -12.423"
              stroke="rgba(0,0,0,0.18)"
              strokeWidth="0.55"
              fill="none"
            />

            {/* 卷檐针织竖向折纹 */}
            <line x1="-5.456" y1="-15.797" x2="-5.291" y2="-13.418" stroke="rgba(0,0,0,0.14)" strokeWidth="0.45" />
            <line x1="-2.724" y1="-13.592" x2="-2.931" y2="-16.044" stroke="rgba(0,0,0,0.14)" strokeWidth="0.45" />
            <line x1="-0.188" y1="-13.125" x2="-0.263" y2="-15.667" stroke="rgba(0,0,0,0.14)" strokeWidth="0.45" />
            <line x1="2.8" y1="-14.735" x2="2.788" y2="-12.039" stroke="rgba(0,0,0,0.14)" strokeWidth="0.45" />
            <line x1="5.906" y1="-13.358" x2="5.674" y2="-10.865" stroke="rgba(0,0,0,0.14)" strokeWidth="0.45" />

            {/* 5. 经典短发侧颜发梢 (用户手动微调的高质感月牙弧线) */}
            <path
              d="M -6.873 -13.063 C -7.207 -12.431 -4.624 -11.731 -4.031 -11.783 C -2.144 -11.949 -2.13 -11.731 -2.381 -12.176 C -3.259 -11.654 -1.213 -11.98 -2.137 -12.044 C -2.63 -11.596 -2.334 -13.829 -6.873 -13.063 Z"
              fill={hairColor}
            />
          </g>
        ) : (
          <path d="M-6,-14 Q0,-22 7,-13 Q6,-8 0,-8 Z" fill={hairColor} />
        )}
      </g>
    );
  }

  // ==========================================
  // 视角 3: 正身视角 (facing === 'front', 默认)
  // 面对镜头：完整呈现饱满圆脸、前折毛线帽檐、经典微八字月牙刘海
  // ==========================================
  return (
    <g
      id="character-head-front"
      className={className}
      transform={`translate(${transX}, ${transY}) scale(${scale})`}
    >
      {/* 头部基底 (Skin Tone Base) - 饱满圆脸 */}
      <circle cx="0" cy="-14" r="7.1" fill={skinColor} />

      {/* 后脑勺深色底衬 */}
      <ellipse cx="0" cy="-14.5" rx="5.5" ry="2.0" fill={hairColor} opacity="0.15" />

      {/* 正面两侧垂落修饰发丝 (长发/卷发/直发在脸颊两侧的延展，不遮挡五官) */}
      {renderFrontFramingHair(hairStyle, hairColor)}

      {showBeanie ? (
        <g id="knit-beanie-with-curtain-bangs">
          {/* 1. 毛线帽顶部小绒球/顶撮 (Pompom) - 位于头顶偏左上方 */}
          {hasPompom && (
            <g id="beanie-pompom-front">
              <circle cx="-2.6" cy="-22.6" r="2.2" fill={beanieColor} />
              <path
                d="M-3.8,-23.6 C-3.0,-24.5 -1.8,-24.2 -1.4,-23.4 C-0.8,-22.4 -1.6,-21.2 -2.6,-21.2 C-3.6,-21.2 -4.2,-22.2 -3.8,-23.6 Z"
                fill="rgba(0,0,0,0.12)"
              />
              <path
                d="M-3.6,-23.0 Q-2.6,-24.0 -1.6,-23.2 M-3.4,-22.0 Q-2.4,-21.0 -1.8,-22.2"
                stroke="rgba(0,0,0,0.22)"
                strokeWidth="0.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* 2. 毛线帽饱满帽冠 (Beanie Crown Dome) */}
          <path
            d="M-7.6,-13.2 C-8.2,-20.5 -4.8,-23.2 0,-23.2 C4.8,-23.2 8.2,-20.5 7.6,-13.2 C5.2,-14.8 -5.2,-14.8 -7.6,-13.2 Z"
            fill={beanieColor}
          />

          {/* 帽身自然针织弧面微暗褶线 (纯暗调，绝无反光) */}
          <path
            d="M-5.2,-15.5 C-5.4,-19.0 -2.6,-22.0 0,-22.4 C2.6,-22.0 5.4,-19.0 5.2,-15.5"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="0.55"
            strokeDasharray="1.5 1.5"
            fill="none"
          />

          {/* 3. 翻折帽檐 (Folded Cuff) - 宽边针织卷边，紧紧包裹住头部两侧 */}
          <path
            d="M-7.7,-11.8 C-8.0,-15.6 -4.2,-17.0 0,-17.0 C4.2,-17.0 8.0,-15.6 7.7,-11.8 C5.2,-13.6 -5.2,-13.6 -7.7,-11.8 Z"
            fill={beanieColor}
          />

          {/* 翻折折痕下边缘微暗影 (Cuff contact shadow) */}
          <path
            d="M-7.5,-12.0 C-5.0,-13.8 5.0,-13.8 7.5,-12.0"
            stroke="rgba(0,0,0,0.22)"
            strokeWidth="0.75"
            fill="none"
          />

          {/* 翻折帽檐上边缘暗缝线 (Cuff Top Seam) */}
          <path
            d="M-7.2,-15.3 Q0,-16.8 7.2,-15.3"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.6"
            fill="none"
          />

          {/* 翻折帽檐左右针织竖向折缝 (Knitted rib texture) - 仅用淡暗线描摹针织纹路，不带任何反光 */}
          <line x1="-5.0" y1="-15.4" x2="-5.2" y2="-13.2" stroke="rgba(0,0,0,0.14)" strokeWidth="0.45" />
          <line x1="-2.4" y1="-16.1" x2="-2.5" y2="-13.8" stroke="rgba(0,0,0,0.14)" strokeWidth="0.45" />
          <line x1="0" y1="-16.4" x2="0" y2="-14.0" stroke="rgba(0,0,0,0.14)" strokeWidth="0.45" />
          <line x1="2.4" y1="-16.1" x2="2.5" y2="-13.8" stroke="rgba(0,0,0,0.14)" strokeWidth="0.45" />
          <line x1="5.0" y1="-15.4" x2="5.2" y2="-13.2" stroke="rgba(0,0,0,0.14)" strokeWidth="0.45" />

          {/* 4. 帽檐下露出的经典微八字月牙刘海 (Classic Crescent Curtain Bangs) */}
          {renderPeekingBangs(hairStyle, hairColor, false)}
        </g>
      ) : (
        /* 无帽子时 fallback 传统发型 */
        renderLegacyHair(hairStyle, hairColor)
      )}
    </g>
  );
};

/**
 * 经典微八字月牙刘海与发型渲染：
 * 严格按照用户提供的示意图（image.png）造型：
 * - 紧贴在毛线帽翻折边下沿，从左至右划出一道利落优雅的饱满月牙弧线，右侧自然挑起微翘收尖
 * - 纯色填色，线条流畅优美，现代扁平无杂乱，极具高级感
 */
function renderPeekingBangs(
  style: string = 'curtain_crescent',
  color: string = '#1f1b18',
  isSleeping: boolean = false
) {
  if (isSleeping) {
    // 睡眠姿势下的微八字刘海
    return (
      <g id="bangs-sleeping-crescent">
        <path
          d="M-3.6,-1.2 C-1.8,0.3 0.8,0.3 2.6,-0.8 C1.8,-1.4 0.2,-1.6 -1.2,-1.7 C-2.4,-1.8 -3.2,-1.5 -3.6,-1.2 Z"
          fill={color}
        />
      </g>
    );
  }

  switch (style) {
    case 'soft_bangs':
    case 'curtain_crescent':
    default:
      return (
        <g id="bangs-classic-crescent-curtain">
          {/* 用户原图同款：经典的微八字月牙弧刘海 (Classic Crescent Curtain Bangs) */}
          {/* 起于左侧帽檐下边缘，下缘圆润划过一道饱满优美的弧线，右端优雅微扬收尖 */}
          <path
            d="M-5.6,-13.4 C-4.8,-11.0 -0.8,-10.5 3.6,-12.8 C1.4,-13.6 -0.6,-14.2 -3.4,-14.2 C-4.6,-14.2 -5.2,-13.9 -5.6,-13.4 Z"
            fill={color}
          />
          {/* 右侧极其克制的一抹呼应小梢 (使整体具备灵动的微八字开合结构) */}
          <path
            d="M2.2,-13.8 C3.2,-12.8 4.6,-12.6 5.4,-13.0 C4.6,-13.7 3.4,-14.0 2.2,-13.8 Z"
            fill={color}
            opacity="0.9"
          />
        </g>
      );

    case 'symmetric_curtain':
      return (
        <g id="bangs-symmetric-curtain">
          {/* 双侧对称微八字轻羽刘海 */}
          <path
            d="M-5.2,-13.5 C-4.2,-11.2 -1.8,-11.0 -0.4,-12.8 C-1.6,-13.6 -3.2,-14.0 -5.2,-13.5 Z"
            fill={color}
          />
          <path
            d="M0.4,-12.8 C1.8,-11.0 4.2,-11.2 5.2,-13.5 C3.2,-14.0 1.6,-13.6 0.4,-12.8 Z"
            fill={color}
          />
        </g>
      );

    case 'clean_part':
      return (
        <g id="bangs-clean-part">
          {/* 斜向微八字洗练月牙 */}
          <path
            d="M-4.2,-13.6 C-3.0,-11.2 0.8,-11.0 3.2,-12.6 C1.8,-13.6 0,-14.0 -2.4,-14.0 C-3.4,-14.0 -3.9,-13.8 -4.2,-13.6 Z"
            fill={color}
          />
        </g>
      );

    case 'bob':
      return (
        <g id="bangs-curtain-bob">
          {/* 温和宽八字弧线 */}
          <path
            d="M-5.4,-13.4 C-4.2,-11.4 -2.2,-11.2 -1.0,-12.4 C-2.4,-13.6 -4.0,-13.8 -5.4,-13.4 Z"
            fill={color}
          />
          <path
            d="M1.0,-12.4 C2.2,-11.2 4.2,-11.4 5.4,-13.4 C4.0,-13.8 2.4,-13.6 1.0,-12.4 Z"
            fill={color}
          />
        </g>
      );
  }
}

/**
 * 规范化发型 ID：
 * 默认保持原先的经典月牙短发 ('curtain_crescent')
 * 新增 3 种发型严格参考用户提供的示意图（image.png）：
 * 1. wavy_curly: 蓬松波浪卷发 (图左)
 * 2. long_wavy: 随性披肩长发 (图中)
 * 3. medium_straight: 利落及肩直发 (图右)
 */
export function normalizeHairStyle(
  style?: string
): 'curtain_crescent' | 'wavy_curly' | 'long_wavy' | 'medium_straight' {
  if (style === 'wavy_curly' || style === 'curly') return 'wavy_curly';
  if (style === 'long_wavy' || style === 'long') return 'long_wavy';
  if (style === 'medium_straight' || style === 'straight' || style === 'bob') return 'medium_straight';
  return 'curtain_crescent';
}

/**
 * 视角 1 后背发型渲染：
 * 严格按照用户提供的参考图 (image.png)：
 * - 帽子设定原封不动 (保持毛线帽翻折卷檐与轮廓)
 * - 头发从帽檐下沿自然倾泻而下：
 *   - 图左款：蓬松波浪卷发，自然卷曲披落至肩颈
 *   - 图中款：随性披肩长发，轻盈微卷垂坠至肩背
 *   - 图右款：利落及肩直发，整齐垂直发束，发梢微散微翘
 *   - 默认款：经典利落短发后颈
 */
function renderBackHairstyle(style?: string, color: string = '#1f1b18') {
  const normStyle = normalizeHairStyle(style);

  if (normStyle === 'wavy_curly') {
    return (
      <g id="hair-back-wavy-curly">
        {/* 蓬松波浪卷发 (参考图左款) */}
        <path
          d="M-7.6,-10.8
             C-9.5,-9.5 -10.8,-7.0 -9.5,-4.2
             C-10.8,-2.0 -9.6,0.8 -7.2,0.5
             C-6.2,-0.5 -5.8,-1.8 -5.0,-0.8
             C-4.2,1.2 -1.8,1.6 0,-0.2
             C1.8,1.6 4.2,1.2 5.0,-0.8
             C5.8,-1.8 6.2,-0.5 7.2,0.5
             C9.6,0.8 10.8,-2.0 9.5,-4.2
             C10.8,-7.0 9.5,-9.5 7.6,-10.8
             Z"
          fill={color}
        />
        {/* 卷曲波浪内部生动线条 (同图左细腻手绘卷纹) */}
        <path
          d="M-7.5,-7.2 C-8.6,-5.2 -7.2,-3.2 -8.0,-1.0
             M-4.6,-7.8 C-3.6,-5.2 -5.6,-3.0 -4.2,-0.8
             M-1.8,-8.2 C-2.8,-5.5 -0.6,-3.2 -1.2,-0.6
             M1.8,-8.2 C2.8,-5.5 0.6,-3.2 1.2,-0.6
             M4.6,-7.8 C3.6,-5.2 5.6,-3.0 4.2,-0.8
             M7.5,-7.2 C8.6,-5.2 7.2,-3.2 8.0,-1.0"
          stroke="rgba(0,0,0,0.32)"
          strokeWidth="0.65"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  }

  if (normStyle === 'long_wavy') {
    return (
      <g id="hair-back-long-wavy">
        {/* 随性披肩长发 (参考图中款) */}
        <path
          d="M-7.6,-10.8
             C-8.4,-6.5 -8.8,-2.0 -8.2,1.2
             C-7.6,3.2 -6.2,4.2 -5.2,2.8
             C-4.6,1.8 -4.8,0.2 -4.0,2.2
             C-3.2,4.0 -1.6,4.5 -0.8,2.4
             C-0.3,1.2 0,0.6 0.8,2.4
             C1.6,4.5 3.2,4.0 4.0,2.2
             C4.8,0.2 4.6,1.8 5.2,2.8
             C6.2,4.2 7.6,3.2 8.2,1.2
             C8.8,-2.0 8.4,-6.5 7.6,-10.8
             Z"
          fill={color}
        />
        {/* 随性长发内部垂坠波浪纹理 (同图中自然光泽束线) */}
        <path
          d="M-5.8,-7.0 C-6.2,-3.0 -5.6,0.6 -5.2,2.2
             M-2.6,-7.6 C-2.9,-3.5 -2.0,0.2 -1.6,2.6
             M1.6,-7.6 C2.2,-3.5 1.6,0.2 1.8,2.6
             M5.4,-7.0 C6.0,-3.0 5.4,0.6 5.2,2.2"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="0.6"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  }

  if (normStyle === 'medium_straight') {
    return (
      <g id="hair-back-medium-straight">
        {/* 利落及肩直发 (参考图右款) */}
        <path
          d="M-7.6,-10.8
             C-7.9,-6.0 -8.0,-1.8 -9.0,1.2
             C-8.4,1.8 -6.6,1.5 -6.2,-0.2
             L-6.0,1.2
             C-5.4,1.6 -3.8,1.5 -3.5,-0.2
             L-3.2,1.2
             C-2.5,1.6 -0.8,1.5 -0.4,-0.2
             L0,1.2
             C0.6,1.6 2.3,1.5 2.6,-0.2
             L2.9,1.2
             C3.6,1.6 5.2,1.5 5.6,-0.2
             L5.8,1.2
             C6.5,1.6 8.4,1.8 9.0,1.2
             C8.0,-1.8 7.9,-6.0 7.6,-10.8
             Z"
          fill={color}
        />
        {/* 直发发丝纵向垂直整齐分缕线 (同图右一缕一缕的利落质感) */}
        <line x1="-6.0" y1="-8.2" x2="-6.0" y2="0.6" stroke="rgba(0,0,0,0.32)" strokeWidth="0.55" />
        <line x1="-3.2" y1="-8.5" x2="-3.2" y2="0.6" stroke="rgba(0,0,0,0.32)" strokeWidth="0.55" />
        <line x1="0" y1="-8.8" x2="0" y2="0.6" stroke="rgba(0,0,0,0.32)" strokeWidth="0.55" />
        <line x1="3.2" y1="-8.5" x2="3.2" y2="0.6" stroke="rgba(0,0,0,0.32)" strokeWidth="0.55" />
        <line x1="6.0" y1="-8.2" x2="6.0" y2="0.6" stroke="rgba(0,0,0,0.32)" strokeWidth="0.55" />
      </g>
    );
  }

  // 默认短发：经典干净利落后颈 (curtain_crescent)
  return (
    <path
      d="M-4.2,-9.2 Q0,-7.8 4.2,-9.2"
      stroke={color}
      strokeWidth="1.1"
      strokeLinecap="round"
      fill="none"
      opacity="0.8"
    />
  );
}

/**
 * 视角 2 正身两侧垂发渲染：
 * 搭配正额经典月牙刘海，并在两侧脸颊/肩头露出对应发型的自然弧度
 */
function renderFrontFramingHair(style?: string, color: string = '#1f1b18') {
  const normStyle = normalizeHairStyle(style);

  if (normStyle === 'wavy_curly') {
    return (
      <g id="hair-front-wavy-curly">
        {/* 左侧卷曲发束 */}
        <path
          d="M-6.6,-12.0 C-8.4,-10.5 -9.4,-8.0 -8.2,-5.8 C-9.0,-4.2 -7.8,-3.2 -6.5,-4.0 C-5.8,-4.5 -6.0,-6.5 -5.8,-8.5 Z"
          fill={color}
        />
        <path
          d="M-7.6,-9.5 C-8.4,-7.8 -7.2,-5.8 -7.4,-4.5"
          stroke="rgba(0,0,0,0.28)"
          strokeWidth="0.5"
          fill="none"
        />
        {/* 右侧卷曲发束 */}
        <path
          d="M6.6,-12.0 C8.4,-10.5 9.4,-8.0 8.2,-5.8 C9.0,-4.2 7.8,-3.2 6.5,-4.0 C5.8,-4.5 6.0,-6.5 5.8,-8.5 Z"
          fill={color}
        />
        <path
          d="M7.6,-9.5 C8.4,-7.8 7.2,-5.8 7.4,-4.5"
          stroke="rgba(0,0,0,0.28)"
          strokeWidth="0.5"
          fill="none"
        />
      </g>
    );
  }

  if (normStyle === 'long_wavy') {
    return (
      <g id="hair-front-long-wavy">
        {/* 左侧微卷长发 */}
        <path
          d="M-6.6,-12.0 C-8.0,-8.0 -8.2,-4.0 -7.6,-1.5 C-7.0,-0.5 -6.0,-1.0 -5.8,-2.5 C-5.6,-4.5 -5.6,-8.0 -5.6,-10.5 Z"
          fill={color}
        />
        <path
          d="M-7.2,-8.0 C-7.6,-4.5 -7.0,-2.0 -6.6,-1.8"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="0.5"
          fill="none"
        />
        {/* 右侧微卷长发 */}
        <path
          d="M6.6,-12.0 C8.0,-8.0 8.2,-4.0 7.6,-1.5 C7.0,-0.5 6.0,-1.0 5.8,-2.5 C5.6,-4.5 5.6,-8.0 5.6,-10.5 Z"
          fill={color}
        />
        <path
          d="M7.2,-8.0 C7.6,-4.5 7.0,-2.0 6.6,-1.8"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="0.5"
          fill="none"
        />
      </g>
    );
  }

  if (normStyle === 'medium_straight') {
    return (
      <g id="hair-front-medium-straight">
        {/* 左侧及肩直发 */}
        <path
          d="M-6.6,-12.0 C-7.4,-8.5 -7.6,-5.5 -8.2,-3.5 C-7.6,-3.0 -6.4,-3.2 -6.0,-4.5 C-5.8,-6.5 -5.6,-9.0 -5.6,-11.0 Z"
          fill={color}
        />
        <line x1="-7.0" y1="-8.5" x2="-7.0" y2="-4.0" stroke="rgba(0,0,0,0.28)" strokeWidth="0.5" />
        {/* 右侧及肩直发 */}
        <path
          d="M6.6,-12.0 C7.4,-8.5 7.6,-5.5 8.2,-3.5 C7.6,-3.0 6.4,-3.2 6.0,-4.5 C5.8,-6.5 5.6,-9.0 5.6,-11.0 Z"
          fill={color}
        />
        <line x1="7.0" y1="-8.5" x2="7.0" y2="-4.0" stroke="rgba(0,0,0,0.28)" strokeWidth="0.5" />
      </g>
    );
  }

  // 默认短发：清爽面部无外延侧发
  return null;
}

/**
 * 视角 3 侧身发型渲染：
 * 卷发/长发/及肩直发沿侧后颈部自然垂落
 */
function renderSideHairstyle(style?: string, color: string = '#1f1b18') {
  const normStyle = normalizeHairStyle(style);

  if (normStyle === 'wavy_curly') {
    return (
      <g id="hair-side-wavy-curly">
        <path
          d="M3.2,-11.0 C5.8,-10.0 8.4,-7.5 7.2,-4.5 C8.2,-3.0 7.0,-1.5 5.2,-2.2 C4.2,-2.8 4.0,-5.0 2.8,-8.0 Z"
          fill={color}
        />
        <path
          d="M5.2,-8.0 C6.5,-6.0 6.2,-4.0 6.0,-2.8"
          stroke="rgba(0,0,0,0.28)"
          strokeWidth="0.5"
          fill="none"
        />
      </g>
    );
  }

  if (normStyle === 'long_wavy') {
    return (
      <g id="hair-side-long-wavy">
        <path
          d="M3.2,-11.0 C6.2,-7.0 7.5,-2.0 7.0,1.2 C6.0,2.0 5.0,1.0 4.5,-0.8 C4.0,-3.5 3.6,-7.0 2.8,-8.5 Z"
          fill={color}
        />
        <path
          d="M5.0,-7.0 C5.8,-3.0 5.5,0.2 5.2,1.0"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="0.5"
          fill="none"
        />
      </g>
    );
  }

  if (normStyle === 'medium_straight') {
    return (
      <g id="hair-side-medium-straight">
        <path
          d="M3.2,-11.0 C5.5,-7.5 6.5,-4.0 7.2,-1.5 C6.5,-1.0 5.2,-1.2 4.8,-2.5 C4.2,-5.0 3.8,-8.0 2.8,-8.5 Z"
          fill={color}
        />
        <line x1="5.4" y1="-7.0" x2="5.4" y2="-2.0" stroke="rgba(0,0,0,0.28)" strokeWidth="0.5" />
      </g>
    );
  }

  // 默认短发：干净侧颜
  return null;
}

/**
 * 视角 4 睡眠姿态散发渲染：
 */
function renderSleepingHairstyle(style?: string, color: string = '#1f1b18') {
  const normStyle = normalizeHairStyle(style);

  if (normStyle === 'wavy_curly') {
    return (
      <g id="hair-sleeping-wavy-curly">
        <path
          d="M-5.5,0 C-7.5,1.5 -8.5,3.5 -6.5,5.2 C-5.0,5.8 -4.2,4.5 -4.5,2.5 Z"
          fill={color}
          opacity="0.9"
        />
        <path
          d="M4.5,0 C6.5,1.5 8.0,3.5 6.2,5.2 C4.8,5.8 4.0,4.5 4.0,2.5 Z"
          fill={color}
          opacity="0.9"
        />
      </g>
    );
  }

  if (normStyle === 'long_wavy') {
    return (
      <g id="hair-sleeping-long-wavy">
        <path
          d="M-5.8,0 C-7.8,2.0 -8.2,5.0 -6.0,6.5 C-4.8,6.8 -4.5,4.8 -4.8,2.8 Z"
          fill={color}
          opacity="0.9"
        />
        <path
          d="M5.0,0 C7.5,2.0 8.0,5.0 5.8,6.5 C4.6,6.8 4.2,4.8 4.4,2.8 Z"
          fill={color}
          opacity="0.9"
        />
      </g>
    );
  }

  if (normStyle === 'medium_straight') {
    return (
      <g id="hair-sleeping-medium-straight">
        <path
          d="M-5.5,0 C-7.2,1.8 -7.5,4.5 -6.2,5.5 C-5.2,5.8 -4.8,4.2 -4.8,2.2 Z"
          fill={color}
          opacity="0.9"
        />
        <path
          d="M4.8,0 C6.8,1.8 7.2,4.5 5.8,5.5 C4.8,5.8 4.4,4.2 4.2,2.2 Z"
          fill={color}
          opacity="0.9"
        />
      </g>
    );
  }

  return null;
}

/**
 * 传统发型备选（保留向后兼容）
 */
function renderLegacyHair(style: string, color: string) {
  switch (style) {
    case 'soft_bangs':
      return (
        <path
          d="M-7,-14 Q-3,-22 7,-14 Q4,-20 -2,-21 Q-7,-18 -7,-14 Z"
          fill={color}
        />
      );
    case 'clean_part':
      return (
        <path
          d="M-7,-13 Q-1,-22 7,-14 Q5,-19 0,-20 Q-5,-19 -7,-13 Z"
          fill={color}
        />
      );
    case 'bob':
      return (
        <g>
          <path d="M-7,-14 Q0,-22 7,-14 Q7,-8 6,-4 L-6,-4 Q-7,-8 -7,-14 Z" fill={color} />
        </g>
      );
    case 'short_textured':
    default:
      return (
        <path
          d="M-7,-14 Q0,-22 7,-14 Q5,-19 -7,-14 Z"
          fill={color}
        />
      );
  }
}

export interface CharacterVariantProps {
  id: string;
  name: string;
  pose: 'desk_sitting' | 'tea_crosslegged' | 'sofa_lounging' | 'observatory_standing' | 'bed_sleeping';
  skinColor?: string;      // 默认 #f5d6be (温暖亚洲浅肤色)
  hairColor?: string;      // 头发色值
  hairStyle?: string;
  beanieColor?: string;    // 薄款纯色包头帽颜色 (默认 #425b6e)
  showBeanie?: boolean;    // 是否佩戴薄款包头帽 (默认 true)
  hasPompom?: boolean;     // 帽子顶端毛线小绒球 (默认 true)
  facing?: CharacterFacing;// 2.5D 轴测视角：'front' | 'side' | 'back'
  shirtColor: string;      // 衣服主色
  shirtShadow?: string;    // 衣服阴影面颜色 (可选，默认基于主色加深)
  accessory?: 'none' | 'headphones' | 'glasses' | 'tea_cup' | 'book' | 'parka_hood' | 'headset';
  scale?: number;          // 缩放尺寸倍率 (默认 1)
  statusText?: string;     // 悬停提示文字
  statusEmoji?: string;    // 状态表情
}

export const CharacterAvatar: React.FC<CharacterVariantProps> = ({
  id,
  name,
  pose = 'tea_crosslegged',
  skinColor = '#f5d6be',
  hairColor = '#2d221b',
  hairStyle = 'curtain_crescent',
  beanieColor = '#425b6e',
  showBeanie = true,
  hasPompom = true,
  facing,
  shirtColor = '#e07a5f',
  shirtShadow,
  accessory = 'none',
  scale = 1,
  statusText,
  statusEmoji,
}) => {
  const [hovered, setHovered] = useState(false);

  // 统一黄金比例标准几何参数 (Golden Standard Metric)
  // Head: circle r=7, cy=-14
  // Shoulder line: y=-9, width span from x=-6 to x=6 (沉入头部2px，彻底根除生硬脖子)
  // Seated base: ellipse cx=0, cy=4~5, rx=8.5~10, ry=3.8~4
  
  return (
    <g
      id={`iso-character-${id}`}
      transform={`scale(${scale})`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer select-none"
    >
      {/* 1. 姿态分流渲染 (Poses) */}
      {pose === 'tea_crosslegged' && (
        <g id="pose-crosslegged">
          {/* 地面接触柔和环境光阴影 */}
          <ellipse cx="0" cy="8" rx="13" ry="5.5" fill="#1b120a" opacity="0.25" />
          
          {/* 盘腿底座 (Folded Knees Base) */}
          <ellipse cx="0" cy="4" rx="10" ry="4.2" fill={shirtShadow || shirtColor} opacity={shirtShadow ? 1 : 0.9} />
          <ellipse cx="0" cy="3.5" rx="9" ry="3.6" fill={shirtColor} />

          {/* 躯干长袍 (Torso & Cozy Robe: 肩线 y=-9, 领口与头部浑然一体) */}
          <path
            d="M-6,2 C-7,-4 -5,-9 0,-9 C5,-9 7,-4 6,2 Z"
            fill={shirtColor}
          />
          {/* 袍边衣褶微阴影 */}
          <path d="M-4,1 Q0,3 4,1" stroke="#000000" strokeWidth="0.6" opacity="0.16" fill="none" />

          {/* 自然交叠双手 / 端茶姿态 */}
          {accessory === 'tea_cup' ? (
            <>
              <ellipse cx="-2" cy="1" rx="2.5" ry="1.8" fill={skinColor} />
              <g id="accessory-tea-cup" transform="translate(-2, 0)">
                <ellipse cx="0" cy="0" rx="2.2" ry="1.4" fill="#fcfbf7" stroke="#e2d8c3" strokeWidth="0.5" />
                <ellipse cx="0" cy="-0.4" rx="1.6" ry="0.9" fill="#527c50" />
                {/* 微温蒸汽 */}
                <path d="M0,-2 Q-1,-4 0,-6" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.75" />
              </g>
            </>
          ) : (
            <g id="neutral-folded-hands">
              <ellipse cx="-1.6" cy="1.2" rx="2.2" ry="1.5" fill={skinColor} />
              <ellipse cx="1.6" cy="1.2" rx="2.2" ry="1.5" fill={skinColor} />
            </g>
          )}

          {/* 统一头部骨骼：正身视角 */}
          <CharacterHead
            cx={0}
            cy={-14}
            r={7}
            skinColor={skinColor}
            hairColor={hairColor}
            hairStyle={hairStyle}
            beanieColor={beanieColor}
            showBeanie={showBeanie}
            hasPompom={hasPompom}
            facing={facing || 'front'}
          />
        </g>
      )}

      {pose === 'desk_sitting' && (
        <g id="pose-desk-sitting">
          {/* 地面阴影 */}
          <ellipse cx="0" cy="8" rx="12" ry="5.0" fill="#1b120a" opacity="0.22" />

          {/* 坐椅坐垫与垂落底座 */}
          <ellipse cx="0" cy="4" rx="10" ry="4.2" fill={shirtShadow || '#c56349'} />
          <ellipse cx="0" cy="3.5" rx="9" ry="3.6" fill={shirtColor} />

          {/* 连贯实心后背 (与正视完全一致的圆润自然落肩，消除所有凸起凹陷) */}
          <path
            d="M-6,2 C-7,-4 -5,-9 0,-9 C5,-9 7,-4 6,2 Z"
            fill={shirtColor}
          />
          {/* 后背脊柱中缝与后领口 */}
          <line x1="0" y1="-7.5" x2="0" y2="1.5" stroke="#000000" strokeWidth="0.65" opacity="0.14" strokeLinecap="round" />
          <path d="M-3.5,-8.8 Q0,-8.0 3.5,-8.8" stroke="#000000" strokeWidth="0.6" opacity="0.18" fill="none" />
          <path d="M-4,1 Q0,3 4,1" stroke="#000000" strokeWidth="0.6" opacity="0.16" fill="none" />

          {/* 统一头部骨骼：桌面背对视角 (默认 facing='back'，后脑勺完全包裹，无前额刘海) */}
          <CharacterHead
            cx={0}
            cy={-14}
            r={7}
            skinColor={skinColor}
            hairColor={hairColor}
            hairStyle={hairStyle}
            beanieColor={beanieColor}
            showBeanie={showBeanie}
            hasPompom={hasPompom}
            facing={facing || 'back'}
          />

          {/* 头戴式降噪耳机配件 (从后脑勺横跨的耳机头梁与两侧耳罩) */}
          {accessory === 'headphones' && (
            <g id="accessory-headphones-back">
              <path d="M-7,-14 C-8,-21.5 8,-21.5 7,-14" stroke="#1e293b" strokeWidth="1.8" fill="none" />
              <circle cx="-7" cy="-14" r="2.2" fill="#334155" />
              <circle cx="7" cy="-14" r="2.2" fill="#334155" />
            </g>
          )}
        </g>
      )}

      {pose === 'sofa_lounging' && (
        <g id="pose-sofa-lounging">
          {/* 沙发深陷长袍底座 */}
          <ellipse cx="0" cy="4" rx="9" ry="4" fill={shirtShadow || shirtColor} />
          
          {/* 躯干 (Torso) */}
          <path
            d="M-6,2 C-7,-4 -5,-9 0,-9 C5,-9 7,-4 6,2 Z"
            fill={shirtColor}
          />
          <ellipse cx="0" cy="5.5" rx="8" ry="3" fill={shirtColor} />
          <path d="M-4,3 Q0,5.5 4,3" fill="none" stroke="#000000" strokeWidth="0.6" opacity="0.16" strokeLinecap="round" />

          {/* 惬意搭在膝上的双臂 */}
          <path d="M-5,-5 Q-8,-1 -2,1" stroke={shirtColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M5,-5 Q8,-1 2,1" stroke={shirtColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />

          {/* 腿上张开的精装书配件 */}
          {accessory === 'book' && (
            <g id="accessory-book" transform="translate(0, 1)">
              <polygon points="0,0 -6,-2 -5,-7 0,-4" fill="#fcfaf6" stroke="#d5cebe" strokeWidth="0.5" />
              <polygon points="0,0 6,-2 5,-7 0,-4" fill="#ffffff" stroke="#d5cebe" strokeWidth="0.5" />
              <line x1="-6" y1="-2" x2="6" y2="-2" stroke="#854d0e" strokeWidth="1" />
              <line x1="-4.5" y1="-3.5" x2="-1.5" y2="-2.8" stroke="#a8a29e" strokeWidth="0.5" />
              <line x1="1.5" y1="-2.8" x2="4.5" y2="-3.5" stroke="#a8a29e" strokeWidth="0.5" />
            </g>
          )}

          {/* 统一头部骨骼 */}
          <CharacterHead
            cx={0}
            cy={-14}
            r={7}
            skinColor={skinColor}
            hairColor={hairColor}
            hairStyle={hairStyle}
            beanieColor={beanieColor}
            showBeanie={showBeanie}
            hasPompom={hasPompom}
            facing={facing || 'front'}
          />
        </g>
      )}

      {pose === 'observatory_standing' && (
        <g id="pose-standing-observatory">
          {/* 脚底影子 */}
          <ellipse cx="0" cy="11" rx="8" ry="3.5" fill="#1b120a" opacity="0.3" />
          
          {/* 防风派克大衣 / 站立身体 */}
          <rect x="-6" y="-3" width="12" height="13" rx="4" fill={shirtColor} />
          <line x1="0" y1="-3" x2="0" y2="10" stroke="#000000" strokeWidth="0.8" opacity="0.25" />

          {/* 双腿站立 */}
          <line x1="-3" y1="9" x2="-3" y2="12" stroke="#262626" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="3" y1="9" x2="3" y2="12" stroke="#262626" strokeWidth="2.4" strokeLinecap="round" />

          {/* 统一头部骨骼：侧身/正身自由支持 */}
          <CharacterHead
            cx={0}
            cy={-14}
            r={7}
            skinColor={skinColor}
            hairColor={hairColor}
            hairStyle={hairStyle}
            beanieColor={beanieColor}
            showBeanie={showBeanie}
            hasPompom={hasPompom}
            facing={facing || 'side'}
          />

          {/* 监听通讯专业耳机配件 */}
          {accessory === 'headset' && (
            <g id="accessory-headset">
              <path d="M-6,-14 Q0,-21.5 6,-14" stroke="#1e293b" strokeWidth="1.8" fill="none" />
              <rect x="-7.5" y="-16" width="3" height="5" rx="1.2" fill="#38ef7d" />
              <rect x="4.5" y="-16" width="3" height="5" rx="1.2" fill="#38ef7d" />
              <path d="M-5,-12 Q-2,-9 1,-11" stroke="#1e293b" strokeWidth="1" fill="none" />
            </g>
          )}
        </g>
      )}

      {pose === 'bed_sleeping' && (
        <g id="pose-sleeping">
          {/* 睡眠头部骨骼与睡帽刘海 */}
          <CharacterHead
            cx={0}
            cy={0}
            r={6.5}
            skinColor={skinColor}
            hairColor={hairColor}
            hairStyle={hairStyle}
            beanieColor={beanieColor}
            showBeanie={showBeanie}
            isSleeping={true}
          />
          {/* 被沿露出的睡衣领口 */}
          <path d="M-4,3.5 Q0,5.5 4,3.5" stroke={shirtColor} strokeWidth="2.4" fill="none" />
        </g>
      )}

      {/* 2. 悬停状态徽章 (Hover Status Pill) */}
      {(statusText || name) && (
        <g
          transform="translate(0, -30)"
          className={`transition-all duration-200 pointer-events-none ${hovered ? 'opacity-100 transform -translate-y-1' : 'opacity-0'}`}
        >
          <rect x="-42" y="-9" width="84" height="18" rx="9" fill="#1c1917" opacity="0.95" stroke="#44403c" strokeWidth="0.8" />
          <text x="0" y="3.5" fill="#f5f5f4" fontSize="9" fontWeight="bold" textAnchor="middle">
            {statusEmoji && `${statusEmoji} `}{name} {statusText ? `· ${statusText}` : ''}
          </text>
        </g>
      )}
    </g>
  );
};

