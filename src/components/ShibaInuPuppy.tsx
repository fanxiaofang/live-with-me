import React, { useState } from 'react';
import { svgAction } from '../world/interactions/svgAction';
import { IsoGizmo } from './layout-gizmo/IsoGizmo';

export interface ShibaInuPuppyProps {
  x: number;
  y: number;
  isInspectorOpen?: boolean;
  effectiveGizmoId?: string | null;
  onSelectGizmo?: (id: string | null) => void;
  onDragGizmoDelta?: (dx: number, dy: number) => void;
  onDragGizmoEnd?: () => void;
  onTriggerToast?: (msg: string) => void;
  setHoveredObject?: (obj: { kind: 'entity'; id: string } | null) => void;
}

/**
 * ChineseRuralDog / ShibaInuPuppy (参考用户实拍图重构的中华田园犬 · 大黄狗)
 * 严格还原参考照片的核心特征：
 * 1. 经典黄白毛色分布：背部与后颈为温暖沙黄/姜黄色，脸颊、口鼻、胸腹与四肢为清爽米白/浅燕麦色
 * 2. 标志性精神小立耳：尖翘微圆的直立三角耳，外侧姜黄、内侧米浅，忠诚机警又憨厚温顺
 * 3. 蓬松丰满的扫帚大尾巴：毛茸茸自然舒展伏在身侧，尾尖蓬松厚实
 * 4. 舒坦伏卧姿态：前爪双双叠在身前，清秀的黑鼻头与温柔有神的深色眼眸
 * 5. 保持简洁矢量风格（不用过度写实杂乱），纯净稳固画面（绝无一明一暗闪烁）
 */
export const ShibaInuPuppy: React.FC<ShibaInuPuppyProps> = ({
  x,
  y,
  isInspectorOpen = false,
  effectiveGizmoId = null,
  onSelectGizmo,
  onDragGizmoDelta,
  onDragGizmoEnd,
  onTriggerToast,
  setHoveredObject,
}) => {
  const [isWiggle, setIsWiggle] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (isInspectorOpen) {
      e.stopPropagation();
      onSelectGizmo?.(effectiveGizmoId === 'shiba-inu' ? null : 'shiba-inu');
      return;
    }
    e.stopPropagation();
    setIsWiggle(true);
    setTimeout(() => setIsWiggle(false), 600);

    const quotes = [
      '汪呜~ 🐾 趴在前廊的小黄狗竖起尖尖的小耳朵，忠诚地望着小院，毛茸茸的大尾巴轻轻扫了扫窝垫~ 🌾☀️',
      '嗷呜！(•ᴥ•) 🐾 大黄把两只白糯糯的前爪舒展了一下，眨了眨温和清亮的黑眼睛，安心地守着前廊~ 🏡',
      '呼噜噜… 🐾 前廊微风拂过，小黄狗晒着暖洋洋的太阳，黄白相间的绒毛软乎乎的，正惬意地享受午后时光~ 🐾✨',
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    onTriggerToast?.(quote);
  };

  return (
    <g
      {...svgAction('抚摸前廊的小黄狗')}
      id="shiba-inu"
      transform={`translate(${x}, ${y})`}
      className="cursor-pointer group/shiba select-none"
      onClick={handleClick}
      onMouseEnter={() => setHoveredObject?.({ kind: 'entity', id: 'shiba-inu' })}
      onMouseLeave={() => setHoveredObject?.(null)}
    >
      <title>前廊软窝里的中华田园犬（大黄）· 忠诚温顺地趴在窝里晒太阳 🐾☀️</title>

      {/* ========================================================
          1. 前廊麻色编织宠物软垫窝 (2.5D Woven Veranda Pet Bed)
          ======================================================== */}
      <g id="rural-dog-bed">
        {/* 1.1 地面柔和接触阴影 (纯矢量无滤镜高清平滑阴影，彻底消除滤镜模糊噪点) */}
        <ellipse cx="0" cy="11.5" rx="17.5" ry="7.2" fill="#1b120c" opacity="0.14" />
        <ellipse cx="0" cy="11.2" rx="15.8" ry="6.2" fill="#160e08" opacity="0.22" />
        <ellipse cx="-0.5" cy="10.8" rx="13.5" ry="5.0" fill="#120a06" opacity="0.30" />

        {/* 1.2 编织窝垫厚度外立面 */}
        <path
          d="M-15.5,5.5 C-15.5,11.2 15.5,11.2 15.5,5.5 L15.5,8.2 C15.5,13.8 -15.5,13.8 -15.5,8.2 Z"
          fill="#543b24"
        />

        {/* 1.3 窝垫饱满卷边外圈 */}
        <ellipse
          cx="0"
          cy="5.2"
          rx="15.5"
          ry="7.6"
          fill="#826243"
          stroke="#684c31"
          strokeWidth="0.5"
        />

        {/* 1.4 编织滚边顶层柔和采光 */}
        <path
          d="M-13.5,4.0 C-7.5,1.8 7.5,1.8 13.5,4.0 C9.5,2.8 -4.5,2.8 -13.5,4.0 Z"
          fill="#9c7855"
          opacity="0.6"
        />

        {/* 1.5 软窝内凹陷米色垫芯 */}
        <ellipse cx="0" cy="4.5" rx="12.5" ry="5.8" fill="#c4b29b" />
        <ellipse cx="0" cy="4.0" rx="11.8" ry="5.2" fill="#ded3c1" />

        {/* 1.6 窝垫下陷压痕暗影 */}
        <ellipse cx="0.5" cy="4.8" rx="9.8" ry="4.2" fill="#9e8972" opacity="0.45" />
      </g>

      {/* ========================================================
          2. 中华田园犬 (严格参考实拍图：黄背白脸、立耳、蓬松扫帚尾)
          保持简洁矢量风，稳固画面无闪烁
          ======================================================== */}
      <g
        id="rural-dog-body-group"
        className={`origin-center ${isWiggle ? 'animate-bounce' : ''}`}
        transform="translate(0, 2)"
      >
        {/* 2.1 主体躯干背部（实拍图同款：温暖沙黄姜色被毛） */}
        <path
          d="M-7.5,1.0 C-9.8,-3.0 -5.0,-6.5 2.8,-6.0 C8.5,-5.5 11.5,-1.8 10.8,2.8 C10.0,6.0 4.0,6.8 -1.2,6.2 C-5.5,5.6 -6.8,3.5 -7.5,1.0 Z"
          fill="#cf853c"
          stroke="#a96320"
          strokeWidth="0.45"
          strokeLinejoin="round"
        />

        {/* 2.2 背脊微暗沉淀毛色 */}
        <path
          d="M-3.5,-5.5 C1.5,-5.8 7.2,-4.8 9.2,-2.2 C7.5,-4.0 2.5,-5.0 -3.5,-5.5 Z"
          fill="#b5702b"
          opacity="0.6"
        />

        {/* 2.3 腹侧与胸口浅米白过渡（实拍图同款：白胸腹） */}
        <path
          d="M-6.2,1.8 C-4.8,4.2 -0.8,5.5 3.8,5.2 C7.0,4.8 8.8,3.5 9.2,2.0 C8.0,4.0 4.0,4.6 -0.5,4.5 C-3.8,4.4 -5.5,3.2 -6.2,1.8 Z"
          fill="#f4ece2"
          stroke="#e0d4c3"
          strokeWidth="0.3"
        />

        {/* 2.4 实拍图同款：蓬松毛茸茸的扫帚大尾巴 (Fluffy Brush Tail) */}
        <g id="rural-dog-brush-tail" transform="translate(8.5, 0.8)">
          {/* 尾根至尾尖蓬松大毛羽 */}
          <path
            d="M-0.5,1.8 C2.5,3.2 5.8,2.8 6.5,0.8 C7.0,-1.0 5.2,-2.8 2.5,-2.5 C0.5,-2.2 -1.2,-0.8 -0.8,0.8 Z"
            fill="#cf853c"
            stroke="#a96320"
            strokeWidth="0.4"
          />
          {/* 尾巴内层米浅色蓬松羽毛 */}
          <path
            d="M1.2,2.2 C3.5,2.8 5.5,2.0 5.8,0.8 C4.5,1.6 2.8,1.8 1.2,2.2 Z"
            fill="#f4ece2"
          />
        </g>

        {/* 2.5 实拍图同款：米白白爪爪叠在身前 (Front White Paws tucked) */}
        <g id="rural-dog-front-paws" transform="translate(-3.2, 4.4)">
          {/* 左前小白爪 */}
          <ellipse cx="-1.2" cy="0" rx="2.0" ry="1.2" fill="#f4ece2" stroke="#d8ccbb" strokeWidth="0.35" />
          <line x1="-1.6" y1="-0.4" x2="-1.6" y2="0.6" stroke="#b5a695" strokeWidth="0.3" />
          <line x1="-0.8" y1="-0.4" x2="-0.8" y2="0.6" stroke="#b5a695" strokeWidth="0.3" />

          {/* 右前小白爪 */}
          <ellipse cx="1.2" cy="0.4" rx="2.0" ry="1.2" fill="#f4ece2" stroke="#d8ccbb" strokeWidth="0.35" />
          <line x1="0.8" y1="0.0" x2="0.8" y2="1.0" stroke="#b5a695" strokeWidth="0.3" />
          <line x1="1.6" y1="0.0" x2="1.6" y2="1.0" stroke="#b5a695" strokeWidth="0.3" />
        </g>

        {/* 2.6 实拍图同款田园犬头部 (黄顶白颊、黑鼻、立耳、有神双眸) */}
        <g id="rural-dog-head" transform="translate(-4.8, -1.2)">
          {/* 头部上脑壳与后颈（姜黄色） */}
          <ellipse cx="0" cy="0" rx="4.8" ry="4.4" fill="#cf853c" stroke="#a96320" strokeWidth="0.4" />

          {/* 脸颊与下巴大面积米白色（实拍图最显著的特征：白脸盘与白喉） */}
          <path
            d="M-4.6,0.5 C-4.6,3.4 -1.8,4.5 0.5,4.5 C2.8,4.5 4.6,3.4 4.6,0.5 C3.2,2.0 1.5,2.6 0,2.6 C-1.5,2.6 -3.2,2.0 -4.6,0.5 Z"
            fill="#f4ece2"
            stroke="#d8ccbb"
            strokeWidth="0.35"
          />

          {/* 吻部略微前探的白毛包口 */}
          <path
            d="M-2.2,0.8 C-2.2,2.8 0,3.2 1.8,2.8 C2.2,1.8 1.5,0.8 -0.2,0.6 Z"
            fill="#f4ece2"
          />

          {/* 实拍图最关键核心：两只精神的直立尖立耳 (Prick Triangular Ears) */}
          {/* 左立耳 */}
          <g id="ear-left">
            <polygon
              points="-4.2,-2.0 -5.8,-6.8 -1.8,-4.2"
              fill="#cf853c"
              stroke="#a96320"
              strokeWidth="0.35"
              strokeLinejoin="round"
            />
            {/* 耳窝内侧浅色绒毛 */}
            <polygon points="-3.8,-2.4 -5.0,-5.8 -2.4,-3.8" fill="#f4ece2" />
          </g>

          {/* 右立耳 */}
          <g id="ear-right">
            <polygon
              points="1.5,-4.2 4.8,-7.0 3.8,-2.0"
              fill="#cf853c"
              stroke="#a96320"
              strokeWidth="0.35"
              strokeLinejoin="round"
            />
            {/* 耳窝内侧浅色绒毛 */}
            <polygon points="1.8,-3.8 4.0,-6.0 3.2,-2.4" fill="#f4ece2" />
          </g>

          {/* 实拍图同款：温和有神、带深色眼圈的黑色眼眸 */}
          <g id="rural-dog-eyes">
            {/* 左眼 */}
            <ellipse cx="-2.2" cy="-0.4" rx="0.9" ry="1.1" fill="#1c1917" />
            <circle cx="-2.5" cy="-0.7" r="0.35" fill="#ffffff" />

            {/* 右眼 */}
            <ellipse cx="1.6" cy="-0.4" rx="0.8" ry="1.0" fill="#1c1917" />
            <circle cx="1.3" cy="-0.7" r="0.3" fill="#ffffff" />
          </g>

          {/* 纯净黑鼻头（带高光） */}
          <ellipse cx="-0.4" cy="1.2" rx="0.9" ry="0.65" fill="#1a1614" />
          <circle cx="-0.65" cy="1.0" r="0.22" fill="#ffffff" opacity="0.85" />

          {/* 憨厚三瓣嘴线 */}
          <path
            d="M-1.0,2.0 Q-0.4,2.4 -0.4,1.8 Q-0.4,2.4 0.2,2.0"
            stroke="#452a0a"
            strokeWidth="0.35"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </g>

      {/* ========================================================
          3. 2.5D 轴测校准交互把手 (Gizmo Inspector 微调支持)
          ======================================================== */}
      {effectiveGizmoId === 'shiba-inu' && (
        <IsoGizmo
          pos={{ x: 0, y: 10 }}
          displayCoords={{ x, y }}
          fixedW={0}
          label="前廊中华田园犬"
          onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
          onDragEnd={() => onDragGizmoEnd?.()}
        />
      )}
    </g>
  );
};

// 语义化别名
export const ChineseRuralDog = ShibaInuPuppy;
