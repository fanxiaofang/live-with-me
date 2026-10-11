import React from 'react';
import { Person } from '../../types';
import type { InteractionTarget } from '../../world/interactions/interactionTypes';
import { svgAction } from '../../world/interactions/svgAction';
import { CharacterHead } from '../CharacterAvatar';

export interface WindsorChairProps {
  /**
   * 是否处于有人就座的组合态 (true: 组合态; false: 空椅子状态)
   */
  isSeated?: boolean;
  /**
   * 当前就座的人物信息（包含卫衣颜色、毛线帽、发型、肤色等）
   */
  occupant?: Person | null;
  /**
   * 校准器是否打开
   */
  isInspectorOpen?: boolean;
  /**
   * 是否处于选中状态
   */
  isSelected?: boolean;
  /**
   * 点击座椅或人物的回调
   */
  onClick?: (e: React.MouseEvent) => void;
  /**
   * 鼠标悬浮回调
   */
  onHover?: (target: InteractionTarget | null) => void;
  /**
   * 快捷切换组合态 / 空椅子状态的回调
   */
  onToggleSeated?: () => void;
  /**
   * 打开专门的座椅检视弹窗
   */
  onOpenInspectorModal?: () => void;
}

/**
 * 2.5D 手作白橡木温莎纺锤椅 (Rustic Handcrafted White Oak Windsor Chair)
 *
 * 几何视角与轴测对齐 (NW 朝向与书桌严格垂直对齐)：
 * 1. 空间朝向：电脑桌长边沿 U 轴（斜率 -0.2852），进深沿 V 轴（斜率 +0.2852）。
 *    椅子正面朝向 NW（西北，朝向电脑桌与笔记本屏幕），进深法线与书桌完全垂直对齐。
 * 2. 结构对称轴与斜率：
 *    - 坐板前沿、后沿及温莎梳背顶梁：斜率严格为 -0.2852，与书桌长边绝对平行。
 *    - 坐板左右侧边、腿部跨距及进深轴：沿 NW-SE 轴线延伸（斜率 +0.2852），与书桌垂直对齐。
 *    - 温莎梳背（Windsor Spindle Backrest）：生根于坐板 SE 南侧后缘，沿 -0.2852 轴线排布，
 *      7根细圆木立柱保持垂直，弧形蒸汽弯木顶梁顺应斜率，温润支撑就座者后背。
 * 3. 状态支持：
 *    - 空椅子态 (isSeated = false)：清晰呈现白橡木马鞍凹凸坐板、倒角高光、棉麻坐垫与朝向书桌的温莎梳背。
 *    - 人物组合态 (isSeated = true)：小人双肩与耳机沿 -0.2852 斜率倾斜，双臂自然伸向 NW 笔记本键盘敲击代码。
 */
export const WindsorChair: React.FC<WindsorChairProps> = ({
  isSeated = false,
  occupant = null,
  isInspectorOpen = false,
  isSelected = false,
  onClick,
  onHover,
  onToggleSeated,
  onOpenInspectorModal,
}) => {
  const shirtColor = occupant?.shirtColor || '#3b82f6';
  const skinColor = occupant?.skinColor || '#fad4c0';
  const hairColor = occupant?.hairColor || '#1a1a1a';
  const hairStyle = occupant?.hairStyle || 'curtain_crescent';
  const beanieColor = occupant?.beanieColor || '#425b6e';
  const hasPompom = occupant?.hasPompom ?? true;

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    onHover?.(!isInspectorOpen && isSeated && occupant ? { kind: 'person', id: occupant.id } : { kind: 'furniture-part', id: 'attic-chair' });
  };

  const handleMouseLeave = () => {
    onHover?.(null);
  };

  return (
    <g {...svgAction('windsor-chair-root')}
      id="windsor-chair-root"
      className="select-none cursor-pointer group/windsor-chair"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 渐变定义 */}
      <defs>
        {/* 白橡木车削腿实木渐变 (立体受光，自暖金至深邃橡木影) */}
        <linearGradient id="oakLegGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c4c23" />
          <stop offset="35%" stopColor="#aa7445" />
          <stop offset="70%" stopColor="#c48d5a" />
          <stop offset="100%" stopColor="#5f3516" />
        </linearGradient>

        {/* 手工车削橡木脚端自然实木收口渐变 (纯木质感，深邃原木色，无突兀金属) */}
        <linearGradient id="oakFootTipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4d2c13" />
          <stop offset="50%" stopColor="#683d1c" />
          <stop offset="100%" stopColor="#3d210b" />
        </linearGradient>

        {/* 蒸汽弯木顶梁温润实木渐变 */}
        <linearGradient id="oakRailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ba8554" />
          <stop offset="45%" stopColor="#a36e3e" />
          <stop offset="85%" stopColor="#875327" />
          <stop offset="100%" stopColor="#633917" />
        </linearGradient>

        {/* 白橡木马鞍雕刻座板顶面渐变 */}
        <linearGradient id="oakSaddleSeatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#be8a58" />
          <stop offset="40%" stopColor="#a67140" />
          <stop offset="80%" stopColor="#8c582b" />
          <stop offset="100%" stopColor="#70401c" />
        </linearGradient>

        {/* 座板立面厚度暗影 */}
        <linearGradient id="oakSeatEdgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7a461e" />
          <stop offset="100%" stopColor="#48250e" />
        </linearGradient>

        {/* 加厚双层高回弹云朵棉麻坐垫渐变 (天然亚麻透气杂色，久坐不累) */}
        <linearGradient id="plushCushionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#faf7f0" />
          <stop offset="40%" stopColor="#efe5d5" />
          <stop offset="80%" stopColor="#dfd1bd" />
          <stop offset="100%" stopColor="#cbbba5" />
        </linearGradient>

        {/* 人体工学护脊腰靠亚麻渐变 (温润托腰) */}
        <linearGradient id="lumbarPillowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f7f3ea" />
          <stop offset="50%" stopColor="#e8dcce" />
          <stop offset="100%" stopColor="#cbbaa5" />
        </linearGradient>

        {/* 立体感圆手 3D 径向光泽 (Plump Volumetric Chibi Hands) */}
        <radialGradient id="handVolumetricGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fff4ea" />
          <stop offset="40%" stopColor="#fad4c0" />
          <stop offset="80%" stopColor="#e4ab8c" />
          <stop offset="100%" stopColor="#c88765" />
        </radialGradient>

        {/* 长袍下摆深陷阴影 */}
        <linearGradient id="robeHemShadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* --- 1. 地面漫反射接触阴影 (修身紧凑比例，落在 y=19.5 地板水平面) --- */}
      <g id="chair-floor-shadow">
        {/* 主投影：紧凑椭圆旋转 -15.9° 顺应轴测地面 */}
        <ellipse
          cx="-1.0"
          cy="18.5"
          rx="8.5"
          ry="4.2"
          transform="rotate(-15.9, -1.0, 18.5)"
          fill="#1b120a"
          opacity="0.26"
          filter="url(#softShadow)"
        />
        {/* 4个纯实木椅脚着地精准接触遮蔽点 (自然原木着地深度) */}
        <ellipse cx="-1.6" cy="14.8" rx="1.2" ry="0.6" fill="#150d06" opacity="0.4" />
        <ellipse cx="5.2" cy="17.2" rx="1.3" ry="0.65" fill="#150d06" opacity="0.38" />
        <ellipse cx="-9.2" cy="18.8" rx="1.3" ry="0.65" fill="#150d06" opacity="0.45" />
        <ellipse cx="-4.6" cy="21.5" rx="1.4" ry="0.7" fill="#150d06" opacity="0.45" />
      </g>

      {/* --- 2. 比例收拢的四根外八实木车削腿与 H 型横枨 (纯实木自然质感，无金属铜套) --- */}
      <g id="chair-legs-and-stretchers">
        {/* 2.1 右前腿 (FR: 深入桌案，温润暗调实木) */}
        <polygon points="-1.0,1.8 0.2,1.5 -0.8,14.8 -2.0,14.8" fill="#4d2e15" stroke="#2e1a0b" strokeWidth="0.35" />
        {/* 实木车削脚端微倒角 (自然深色木蜡油收口，替代金属铜套) */}
        <polygon points="-2.0,13.6 -0.8,13.6 -0.8,14.8 -2.0,14.8" fill="url(#oakFootTipGrad)" />
        <line x1="-2.0" y1="13.6" x2="-0.8" y2="13.6" stroke="#361f0d" strokeWidth="0.4" />

        {/* 2.2 右后腿 (BR: 侧后受光，纯实木质朴温润) */}
        <polygon points="4.2,3.0 5.4,2.7 6.0,17.2 4.6,17.2" fill="#5c3619" stroke="#2e1a0b" strokeWidth="0.35" />
        <polygon points="4.6,15.8 6.0,15.8 6.0,17.2 4.6,17.2" fill="url(#oakFootTipGrad)" />
        <line x1="4.6" y1="15.8" x2="6.0" y2="15.8" stroke="#3d210b" strokeWidth="0.4" />

        {/* 2.3 实木 H 型横枨 (斜率严格对齐轴测：左右侧梁 +0.2852，横跨连梁 -0.2852) */}
        {/* 右侧连梁 (FR 到 BR 侧梁) */}
        <line x1="-1.4" y1="9.5" x2="5.2" y2="11.4" stroke="#482910" strokeWidth="1.15" strokeLinecap="round" />
        {/* 左侧连梁 (FL 到 BL 侧梁) */}
        <line x1="-8.5" y1="13.2" x2="-4.8" y2="14.8" stroke="#5d371b" strokeWidth="1.2" strokeLinecap="round" />
        {/* 中心加固跨梁 (横跨左右，斜率 -0.2852，平行于书桌长边) */}
        <line x1="-6.8" y1="13.8" x2="1.8" y2="10.4" stroke="#683d1c" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="-6.8" cy="13.8" r="0.7" fill="#7a4823" />
        <circle cx="1.8" cy="10.4" r="0.7" fill="#5a3418" />

        {/* 2.4 左前腿 (FL: 微外八向左前伸展，紧凑匀称) */}
        <polygon points="-8.0,4.6 -6.8,4.3 -8.4,18.8 -9.6,18.8" fill="url(#oakLegGrad)" stroke="#452710" strokeWidth="0.38" />
        <line x1="-7.4" y1="4.8" x2="-8.8" y2="18.3" stroke="#ba8252" strokeWidth="0.55" strokeLinecap="round" />
        <polygon points="-9.6,17.4 -8.4,17.4 -8.4,18.8 -9.6,18.8" fill="url(#oakFootTipGrad)" />
        <line x1="-9.6" y1="17.4" x2="-8.4" y2="17.4" stroke="#3a1e0b" strokeWidth="0.4" />

        {/* 2.5 左后腿 (BL: 靠近视点前方，木质纹理清晰，纯实木脚端) */}
        <polygon points="-4.8,6.8 -3.6,6.5 -3.8,21.5 -5.2,21.5" fill="url(#oakLegGrad)" stroke="#3e200a" strokeWidth="0.38" />
        <line x1="-4.2" y1="7.0" x2="-4.4" y2="21.0" stroke="#c08c58" strokeWidth="0.65" strokeLinecap="round" />
        <polygon points="-5.2,20.0 -3.8,20.0 -3.8,21.5 -5.2,21.5" fill="url(#oakFootTipGrad)" />
        <line x1="-5.2" y1="20.0" x2="-3.8" y2="20.0" stroke="#361a08" strokeWidth="0.4" />
      </g>

      {/* --- 3. 修身白橡木座板与加厚高回弹人体工学云朵棉麻坐垫 (久坐舒适配置) --- */}
      <g id="chair-seat-plank">
        {/* 3.1 紧凑白橡木底板厚度立面 (宽度收拢至 15.5px，告别原先 24.4px 笨拙宽感) */}
        {/* SW 侧立面 (斜率 +0.2852) */}
        <path
          d="M -9.8,4.8
             C -9.2,5.6 -6.8,6.4 -4.2,6.9
             L -4.2,8.6
             C -6.8,8.1 -9.2,7.3 -9.8,6.5 Z"
          fill="url(#oakSeatEdgeGrad)"
          stroke="#361a08"
          strokeWidth="0.3"
        />
        {/* SE 正立面厚度 (顺应前沿曲线) */}
        <path
          d="M 6.4,2.4
             C 3.2,4.4 -0.5,5.6 -4.2,6.9
             L -4.2,8.6
             C -0.5,7.3 3.2,6.1 6.4,4.1 Z"
          fill="#583115"
          stroke="#361a08"
          strokeWidth="0.3"
        />

        {/* 3.2 坐板上表层 (白橡木修身马鞍微雕底座) */}
        <path
          d="M -9.8,4.8
             C -8.2,3.0 -3.0,0.8 0.5,0.6
             L 6.4,2.4
             C 6.6,3.2 3.0,4.5 -0.5,5.6
             L -4.2,6.9
             C -7.0,6.5 -9.2,5.7 -9.8,4.8 Z"
          fill="url(#oakSaddleSeatGrad)"
          stroke="#543015"
          strokeWidth="0.45"
        />

        {/* 边缘倒角高光线 */}
        <path
          d="M -9.6,4.9 C -8.2,5.6 -6.5,6.3 -4.2,6.9"
          stroke="#d59e69"
          strokeWidth="0.65"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M -4.2,6.9 C -0.5,5.6 3.0,4.5 6.2,2.5"
          stroke="#be8753"
          strokeWidth="0.65"
          strokeLinecap="round"
          fill="none"
        />

        {/* 3.3 🌟 加厚双层高回弹云朵棉麻坐垫 (Plush Ergonomic Dual-Layer Cloud Cushion: 久坐释压) */}
        <g id="chair-cushion-group">
          {/* 坐垫下层微陷承托阴影 */}
          <path
            d="M -8.5,4.6
               C -7.2,3.2 -2.5,1.5 0.8,1.3
               C 3.5,1.5 5.5,2.4 5.2,3.1
               C 4.8,3.9 1.5,5.0 -1.2,5.9
               C -4.5,6.3 -7.5,5.8 -8.5,4.6 Z"
            fill="#362516"
            opacity="0.3"
          />

          {/* 坐垫加厚立体边沿下层 */}
          <path
            d="M -8.8,4.2
               C -7.0,2.6 -2.0,0.8 1.0,0.7
               C 4.0,0.9 6.0,1.8 5.6,2.6
               C 5.0,3.6 1.8,5.1 -1.5,5.9
               C -5.0,6.3 -8.0,5.7 -8.8,4.2 Z"
            fill="#c4b29c"
            stroke="#9f8d77"
            strokeWidth="0.4"
          />

          {/* 坐垫加厚上层主囊体 (饱满绵密，双层滚边) */}
          <path
            d="M -8.6,3.7
               C -6.8,2.2 -1.8,0.5 1.2,0.4
               C 4.0,0.6 5.8,1.4 5.4,2.2
               C 4.8,3.2 1.6,4.6 -1.6,5.4
               C -4.8,5.8 -7.8,5.1 -8.6,3.7 Z"
            fill="url(#plushCushionGrad)"
            stroke="#b8a892"
            strokeWidth="0.45"
          />

          {/* 坐垫顶部云朵高回弹膨起柔光 */}
          <ellipse cx="-1.8" cy="2.8" rx="4.8" ry="1.6" transform="rotate(-15.9, -1.8, 2.8)" fill="#ffffff" opacity="0.6" />

          {/* 慢回弹十字拉点与纽扣微凹折痕 (Tufted Button Depression) */}
          <circle cx="-1.6" cy="3.0" r="0.8" fill="#a4937d" opacity="0.65" />
          <line x1="-3.2" y1="3.4" x2="0.0" y2="2.6" stroke="#9e8d77" strokeWidth="0.45" strokeLinecap="round" />
          <line x1="-2.1" y1="3.9" x2="-1.1" y2="2.1" stroke="#9e8d77" strokeWidth="0.45" strokeLinecap="round" />
        </g>

        {/* 3.4 🌟 人体工学护脊腰靠 (Ergonomic Lumbar Cushion: 紧贴下背支撑腰椎) */}
        <g id="chair-lumbar-pillow">
          <ellipse cx="0.0" cy="2.2" rx="4.2" ry="1.7" transform="rotate(-15.9, 0.0, 2.2)" fill="url(#lumbarPillowGrad)" stroke="#b5a48e" strokeWidth="0.4" />
          <ellipse cx="0.0" cy="2.0" rx="3.2" ry="1.0" transform="rotate(-15.9, 0.0, 2.0)" fill="#ffffff" opacity="0.45" />
          <line x1="-1.6" y1="2.6" x2="1.6" y2="1.8" stroke="#aa9983" strokeWidth="0.4" strokeLinecap="round" />
        </g>

        {/* 3.5 🌟 温润流线型实木小扶手 (Sculpted Ergonomic Armrests: 让手肘放松休息) */}
        {/* 左侧实木小扶手 */}
        <g id="chair-armrest-left">
          <line x1="-7.0" y1="5.0" x2="-7.0" y2="2.2" stroke="#683d1c" strokeWidth="0.9" strokeLinecap="round" />
          <path
            d="M -5.8,0.4 C -6.6,0.8 -7.4,1.6 -7.4,2.5 C -7.4,2.8 -7.0,2.8 -6.6,2.6 C -5.8,2.2 -5.0,1.3 -4.8,0.7 Z"
            fill="url(#oakRailGrad)"
            stroke="#4a2a11"
            strokeWidth="0.35"
          />
        </g>
        {/* 右侧实木小扶手 */}
        <g id="chair-armrest-right">
          <line x1="4.6" y1="2.2" x2="4.6" y2="-0.6" stroke="#583115" strokeWidth="0.8" strokeLinecap="round" />
          <path
            d="M 5.8,-2.0 C 5.2,-1.6 4.4,-0.8 4.4,0.1 C 4.4,0.4 4.8,0.4 5.2,0.2 C 5.8,-0.2 6.4,-1.1 6.5,-1.7 Z"
            fill="url(#oakRailGrad)"
            stroke="#4a2a11"
            strokeWidth="0.3"
          />
        </g>
      </g>

      {/* --- 4. 小人就座状态 (如同蒲团上长袍般的自然垂坠与立体感圆手) --- */}
      {isSeated && occupant && (
        <g id="seated-character-body" className="transition-transform duration-200">
          {/* 4.1 坐垫微凹深陷阴影 (呈现体重自然压在棉麻坐垫上的柔和重力感) */}
          <ellipse cx="-0.5" cy="4.2" rx="6.8" ry="2.2" fill="#000000" opacity="0.28" filter="url(#softShadow)" />

          {/* 4.2 长袍/卫衣自然铺展下摆 (类似蒲团盘坐的长袍垂裾，饱满温润消除生硬折角) */}
          {/* 下摆底座阴影层 (Robe Base Shadow) */}
          <path
            d="M-6.2,1.8
               C-7.2,3.5 -5.8,5.8 -1.2,6.0
               C3.2,6.2 6.5,4.6 6.0,2.5
               C5.6,0.8 4.5,-0.6 4.0,-1.5
               L-4.5,-0.5
               C-5.2,0.2 -5.8,1.0 -6.2,1.8 Z"
            fill="#1e1814"
            opacity="0.25"
          />

          {/* 饱满长袍下摆主体 (铺展在坐垫上，带柔和布料圆弧) */}
          <path
            d="M-5.8,1.2
               C-7.0,2.8 -5.2,5.2 -1.0,5.4
               C3.2,5.6 6.2,4.0 5.6,2.0
               C5.2,0.8 4.2,-1.0 3.8,-2.0
               L-4.0,-1.0
               C-4.8,-0.2 -5.4,0.5 -5.8,1.2 Z"
            fill={shirtColor}
          />
          {/* 袍摆衣褶阴影纹理 (极具沉浸感的垂坠弧线) */}
          <path
            d="M-3.8,2.8 Q-0.8,4.5 3.2,2.8 M-4.8,1.8 Q-1.5,3.2 2.2,1.6"
            stroke="#000000"
            strokeWidth="0.65"
            strokeLinecap="round"
            opacity="0.18"
            fill="none"
          />

          {/* 4.3 躯干与卫衣后背 (肩线严格顺应 -0.2852 斜率，圆润落肩，体态放松微倾) */}
          <path
            d="M-4.8,-4.2
               C-6.0,-1.5 -5.5,1.2 -4.8,2.2
               C-2.0,3.2 2.0,2.0 4.8,0.8
               C5.2,-0.5 5.5,-3.8 4.5,-6.8
               C1.5,-6.0 -1.8,-5.0 -4.8,-4.2 Z"
            fill={shirtColor}
          />

          {/* 后背脊柱中缝与大衣后片剪裁线 */}
          <line x1="-0.2" y1="-5.2" x2="-0.2" y2="2.5" stroke="#000000" strokeWidth="0.75" opacity="0.18" strokeLinecap="round" />
          {/* 后领口/卫衣兜帽后垂自然折痕 */}
          <path d="M-2.8,-4.8 Q-0.2,-3.5 2.5,-5.5" stroke="#000000" strokeWidth="0.8" opacity="0.22" fill="none" />
          <path d="M-2.0,-3.8 Q-0.2,-2.8 2.0,-4.4" stroke="#ffffff" strokeWidth="0.5" opacity="0.15" fill="none" />

          {/* 4.4 双臂自然前伸至笔记本键盘，带立体感宽松袖筒与圆润袖口 */}
          {/* 左臂 (近侧手臂：自左肩向前下方弯曲搭向键盘) */}
          <path
            d="M-4.6,-4.2
               C-7.2,-2.8 -8.5,-4.0 -7.2,-6.2
               C-6.2,-7.2 -5.2,-7.5 -5.2,-7.5"
            stroke={shirtColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* 左袖口立体翻边与暗影开口 */}
          <ellipse cx="-5.4" cy="-7.2" rx="1.5" ry="0.9" fill="#1b120c" opacity="0.3" />
          <ellipse cx="-5.4" cy="-7.5" rx="1.5" ry="0.8" fill={shirtColor} stroke="#ffffff" strokeWidth="0.35" strokeOpacity="0.25" />

          {/* 右臂 (远侧手臂：自右肩向键盘上方自然伸展) */}
          <path
            d="M4.2,-6.8
               C4.8,-5.0 3.2,-6.8 2.5,-8.6
               C2.2,-9.2 2.6,-9.6 2.6,-9.6"
            stroke={shirtColor}
            strokeWidth="3.0"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* 右袖口立体翻边 */}
          <ellipse cx="2.6" cy="-9.2" rx="1.4" ry="0.8" fill="#1b120c" opacity="0.3" />
          <ellipse cx="2.6" cy="-9.5" rx="1.4" ry="0.75" fill={shirtColor} stroke="#ffffff" strokeWidth="0.35" strokeOpacity="0.25" />

          {/* 4.5 极富立体感的圆手 (Plump 3D Chibi Hands: 质感饱满，微有光影与按压键帽的可爱弧度) */}
          {/* 左圆手：从左袖口伸出，自然微倾搭在键盘 A/S/D 键位 */}
          <g id="volumetric-left-hand">
            {/* 键盘接触微投影 */}
            <ellipse cx="-5.2" cy="-7.0" rx="1.6" ry="0.7" fill="#0f172a" opacity="0.45" />
            {/* 3D 饱满圆球状手掌 (Radial Grad 带来球形立体光泽) */}
            <circle cx="-5.2" cy="-7.6" r="1.5" fill="url(#handVolumetricGrad)" />
            {/* 萌系圆拇指按压轮廓 */}
            <ellipse cx="-4.2" cy="-7.4" rx="0.7" ry="0.5" transform="rotate(-20, -4.2, -7.4)" fill="#fad4c0" />
            {/* 手背柔和高光点 */}
            <circle cx="-5.5" cy="-8.0" r="0.4" fill="#ffffff" opacity="0.6" />
          </g>

          {/* 右圆手：从右袖口伸出，搭在键盘 J/K/L 键位，完美顺应 -0.2852 键盘轴测斜率 */}
          <g id="volumetric-right-hand">
            {/* 键盘接触微投影 */}
            <ellipse cx="2.8" cy="-9.2" rx="1.6" ry="0.7" fill="#0f172a" opacity="0.45" />
            {/* 3D 饱满圆手 */}
            <circle cx="2.8" cy="-9.8" r="1.5" fill="url(#handVolumetricGrad)" />
            {/* 拇指微曲形态 */}
            <ellipse cx="1.9" cy="-9.5" rx="0.7" ry="0.5" transform="rotate(20, 1.9, -9.5)" fill="#fad4c0" />
            {/* 手背柔和高光点 */}
            <circle cx="2.5" cy="-10.2" r="0.4" fill="#ffffff" opacity="0.6" />
          </g>

          {/* 4.6 小人头部：面向前方后背视角 (facing="back") */}
          <CharacterHead
            cx={0}
            cy={-13.0}
            r={7}
            skinColor={skinColor}
            hairColor={hairColor}
            hairStyle={hairStyle}
            beanieColor={beanieColor}
            hasPompom={hasPompom}
            facing="back"
          />

          {/* 头戴式无线监听耳机 (沿 -0.2852 斜率贴合头部) */}
          <path d="M-6.5,-11.5 C-7.5,-18 7.5,-22 6.5,-15.2" stroke="#1e293b" strokeWidth="1.8" fill="none" />
          <circle cx="-6.5" cy="-11.5" r="2.2" fill="#334155" />
          <circle cx="6.5" cy="-15.2" r="2.2" fill="#334155" />
        </g>
      )}

      {/* --- 5. 比例匀称修身、严格对中 (x=0) 的工学梳背与蒸汽弯木顶梁 --- */}
      <g id="chair-windsor-backrest">
        {/* 5.1 七根实木立柱 (Turned Spindles: 严格垂直，紧凑收拢 x ∈ [-4.8, 4.8]) */}
        {/* 立柱 1 (左主柱: x=-4.8) */}
        <line x1="-4.8" y1="5.8" x2="-4.8" y2="-4.0" stroke="#78471e" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="-4.6" y1="5.6" x2="-4.6" y2="-3.8" stroke="#b88350" strokeWidth="0.45" strokeLinecap="round" opacity="0.85" />
        {!isSeated && <ellipse cx="-4.8" cy="1.2" rx="0.75" ry="0.38" fill="#583115" />}

        {/* 立柱 2 (x=-3.2) */}
        <line x1="-3.2" y1={isSeated ? "-4.4" : "5.3"} x2="-3.2" y2="-4.8" stroke="#875327" strokeWidth="1.1" strokeLinecap="round" />
        {!isSeated && <ellipse cx="-3.2" cy="0.6" rx="0.7" ry="0.35" fill="#5c3518" />}

        {/* 立柱 3 (x=-1.6) */}
        <line x1="-1.6" y1={isSeated ? "-5.0" : "4.8"} x2="-1.6" y2="-5.6" stroke="#996336" strokeWidth="1.1" strokeLinecap="round" />
        {!isSeated && <ellipse cx="-1.6" cy="0.0" rx="0.7" ry="0.35" fill="#623a1a" />}

        {/* 立柱 4 (正中主立柱: x=0.0，直对人体脊柱) */}
        <line x1="0.0" y1={isSeated ? "-5.5" : "4.4"} x2="0.0" y2="-6.3" stroke="#aa7243" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="0.2" y1={isSeated ? "-5.5" : "4.2"} x2="0.2" y2="-6.1" stroke="#d59e69" strokeWidth="0.45" strokeLinecap="round" opacity="0.9" />
        {!isSeated && <ellipse cx="0.0" cy="-0.6" rx="0.8" ry="0.4" fill="#6c401e" />}

        {/* 立柱 5 (x=1.6) */}
        <line x1="1.6" y1={isSeated ? "-6.0" : "3.9"} x2="1.6" y2="-6.8" stroke="#996336" strokeWidth="1.1" strokeLinecap="round" />
        {!isSeated && <ellipse cx="1.6" cy="-1.1" rx="0.7" ry="0.35" fill="#623a1a" />}

        {/* 立柱 6 (x=3.2) */}
        <line x1="3.2" y1={isSeated ? "-6.5" : "3.4"} x2="3.2" y2="-7.1" stroke="#875327" strokeWidth="1.1" strokeLinecap="round" />
        {!isSeated && <ellipse cx="3.2" cy="-1.6" rx="0.7" ry="0.35" fill="#5c3518" />}

        {/* 立柱 7 (右主柱: x=4.8) */}
        <line x1="4.8" y1="2.9" x2="4.8" y2="-7.2" stroke="#78471e" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="4.6" y1="2.7" x2="4.6" y2="-7.0" stroke="#b07746" strokeWidth="0.45" strokeLinecap="round" opacity="0.85" />
        {!isSeated && <ellipse cx="4.8" cy="-2.1" rx="0.75" ry="0.38" fill="#583115" />}

        {/* 5.2 蒸汽弯木圆弧梳背顶梁 (Crest Rail: 紧凑收拢 span x ∈ [-5.8, 5.8]，连贯优雅无凹陷拱形) */}
        {/* 顶梁下部厚度投影底线 */}
        <path
          d="M-5.8,-3.1 C-2.8,-5.0 2.8,-7.0 5.8,-6.8"
          stroke="#42250d"
          strokeWidth="2.3"
          strokeLinecap="round"
          fill="none"
        />
        {/* 顶梁主体白橡木渐变 */}
        <path
          d="M-5.8,-3.5 C-2.8,-5.4 2.8,-7.4 5.8,-7.2"
          stroke="url(#oakRailGrad)"
          strokeWidth="2.0"
          strokeLinecap="round"
          fill="none"
        />
        {/* 顶梁上沿温润受光倒角高光 */}
        <path
          d="M-5.4,-4.0 C-2.6,-5.9 2.6,-7.9 5.4,-7.7"
          stroke="#e0af7e"
          strokeWidth="0.7"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        {/* 顶梁两端温莎耳端雕花微凸圆钮 */}
        <circle cx="-5.8" cy="-3.5" r="1.0" fill="#78471e" stroke="#42250d" strokeWidth="0.3" />
        <circle cx="5.8" cy="-7.2" r="1.0" fill="#78471e" stroke="#42250d" strokeWidth="0.3" />
      </g>

      {/* --- 6. 悬浮交互与状态说明气泡 (Hover / Selection Tooltip) --- */}
      <g
        transform="translate(4, -32)"
        className="opacity-0 group-hover/windsor-chair:opacity-100 transition-opacity duration-200 pointer-events-none"
      >
        <rect
          x="-75"
          y="-11"
          width="150"
          height="22"
          rx="11"
          fill="#1c1917"
          stroke="#44382e"
          strokeWidth="0.8"
          opacity="0.95"
          filter="url(#cozyShadow)"
        />
        <text
          x="0"
          y="3.5"
          fill="#f5eee3"
          fontSize="9.5"
          fontWeight="bold"
          textAnchor="middle"
          className="font-sans"
        >
          {isSeated ? `💻 ${occupant?.name || '我'} · 坐在工学软包椅上敲代码` : '🪑 手作实木工学软包椅 · 久坐舒适'}
        </text>
      </g>
    </g>
  );
};
