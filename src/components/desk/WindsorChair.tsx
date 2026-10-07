import { svgAction } from '../../world/interactions/svgAction';
import type { InteractionTarget } from '../../world/interactions/interactionTypes';
import React from 'react';
import { Person } from '../../types';
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

        {/* 蒸汽弯木顶梁温润实木渐变 */}
        <linearGradient id="oakRailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ba8554" />
          <stop offset="45%" stopColor="#a36e3e" />
          <stop offset="85%" stopColor="#875327" />
          <stop offset="100%" stopColor="#633917" />
        </linearGradient>

        {/* 白橡木马鞍雕刻座板顶面渐变 (带木蜡油缎面光泽) */}
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

        {/* 质朴米白棉麻座垫 (天然亚麻杂色质感) */}
        <linearGradient id="linenCushionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#faf6ed" />
          <stop offset="50%" stopColor="#ece2d0" />
          <stop offset="100%" stopColor="#d5c7b1" />
        </linearGradient>

        {/* 复古旋削黄铜脚套 (Brass Ferrules: 金光闪耀) */}
        <linearGradient id="chairBrassTipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#facc15" />
          <stop offset="75%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#854d0e" />
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

      {/* --- 1. 地面漫反射接触阴影 (优化后的紧凑比例，落在 y=20 地板水平面) --- */}
      <g id="chair-floor-shadow">
        {/* 主投影：轻微椭圆旋转 -15.9° 顺应轴测地面 */}
        <ellipse
          cx="-1.5"
          cy="19.5"
          rx="11.5"
          ry="5.0"
          transform="rotate(-15.9, -1.5, 19.5)"
          fill="#1b120a"
          opacity="0.25"
          filter="url(#softShadow)"
        />
        {/* 4个椅脚着地精准接触遮蔽点 */}
        <ellipse cx="-13.8" cy="19.0" rx="1.5" ry="0.75" fill="#150d06" opacity="0.4" />
        <ellipse cx="-2.3" cy="14.8" rx="1.4" ry="0.7" fill="#150d06" opacity="0.35" />
        <ellipse cx="-7.2" cy="22.0" rx="1.6" ry="0.8" fill="#150d06" opacity="0.45" />
        <ellipse cx="6.8" cy="17.8" rx="1.5" ry="0.75" fill="#150d06" opacity="0.4" />
      </g>

      {/* --- 2. 紧凑比例的四根外八锥形实木腿与 H 型榫卯横枨 --- */}
      <g id="chair-legs-and-stretchers">
        {/* 2.1 右前腿 (FR: 位于桌案深处，温和暗色受光) */}
        <polygon points="-2.0,1.2 -0.8,0.9 -1.6,14.8 -3.0,14.8" fill="#4d2e15" stroke="#2e1a0b" strokeWidth="0.35" />
        <polygon points="-3.0,13.2 -1.6,13.2 -1.6,14.8 -3.0,14.8" fill="url(#chairBrassTipGrad)" />

        {/* 2.2 右后腿 (BR: 侧后受光，略有黄铜脚套光泽) */}
        <polygon points="5.2,3.2 6.4,2.9 7.6,17.8 6.0,17.8" fill="#5c3619" stroke="#2e1a0b" strokeWidth="0.35" />
        <polygon points="6.0,16.2 7.6,16.2 7.6,17.8 6.0,17.8" fill="url(#chairBrassTipGrad)" />

        {/* 2.3 实木 H 型横枨 (斜率严格对齐轴测：左右侧梁 +0.2852，横跨连梁 -0.2852) */}
        {/* 右侧连梁 (FR 到 BR 侧梁，斜率 +0.2852) */}
        <line x1="-2.1" y1="9.5" x2="6.5" y2="12.0" stroke="#482910" strokeWidth="1.2" strokeLinecap="round" />
        {/* 左侧连梁 (FL 到 BL 侧梁，斜率 +0.2852) */}
        <line x1="-12.8" y1="13.5" x2="-6.8" y2="15.2" stroke="#5d371b" strokeWidth="1.3" strokeLinecap="round" />
        {/* 中心加固跨梁 (横跨左右，斜率 -0.2852，平行于书桌长边) */}
        <line x1="-9.8" y1="14.3" x2="2.2" y2="10.8" stroke="#683d1c" strokeWidth="1.3" strokeLinecap="round" />

        {/* 2.4 左前腿 (FL: 微外八向左前伸展，温润受光) */}
        <polygon points="-11.2,4.8 -10.0,4.5 -12.4,19.0 -13.8,19.0" fill="url(#oakLegGrad)" stroke="#452710" strokeWidth="0.4" />
        <line x1="-10.5" y1="5.0" x2="-13.0" y2="18.5" stroke="#ba8252" strokeWidth="0.6" strokeLinecap="round" />
        <polygon points="-13.8,17.3 -12.4,17.3 -12.4,19.0 -13.8,19.0" fill="url(#chairBrassTipGrad)" />

        {/* 2.5 左后腿 (BL: 靠近视点前方，高光通透外八，黄铜脚套明亮) */}
        <polygon points="-6.2,7.2 -5.0,6.9 -5.8,22.0 -7.2,22.0" fill="url(#oakLegGrad)" stroke="#3e200a" strokeWidth="0.4" />
        <line x1="-5.5" y1="7.4" x2="-6.4" y2="21.5" stroke="#c08c58" strokeWidth="0.7" strokeLinecap="round" />
        <polygon points="-7.2,20.3 -5.8,20.3 -5.8,22.0 -7.2,22.0" fill="url(#chairBrassTipGrad)" />
      </g>

      {/* --- 3. 优化尺寸与温润质感的白橡木马鞍雕刻座板与质朴棉麻座垫 --- */}
      <g id="chair-seat-plank">
        {/*
          【尺寸优化】：
          宽度缩减至 16.5px (告别过宽的 27px 长凳感，舒适贴合单人身材)
          后缘中心对准 x=0, y=5.0；前沿中心对准 x=-8.0, y=2.7。
          四边与对角线斜率严格锁定 ±0.2852。
        */}
        {/* 3.1 坐板侧沿厚度立面 (面向镜头的 SW 立面与 SE 立面) */}
        {/* SW 侧立面 (斜率 +0.2852) */}
        <polygon points="-16.2,4.6 -8.2,6.9 -8.2,8.8 -16.2,6.5" fill="url(#oakSeatEdgeGrad)" stroke="#361a08" strokeWidth="0.3" />
        {/* SE 正立面厚度 (斜率 -0.2852，平行于书桌) */}
        <polygon points="-8.2,6.9 8.2,2.2 8.2,4.1 -8.2,8.8" fill="#583115" stroke="#361a08" strokeWidth="0.3" />

        {/* 3.2 坐板上表层 (白橡木马鞍凹凸雕刻面，自然圆润倒角) */}
        <path
          d="M-16.2,4.6
             C-14.0,2.5 -6.0,0.2 0.2,-0.1
             L8.2,2.2
             C8.5,3.2 4.0,4.5 0.0,5.8
             L-8.2,6.9
             C-12.0,6.5 -15.5,5.5 -16.2,4.6 Z"
          fill="url(#oakSaddleSeatGrad)"
          stroke="#543015"
          strokeWidth="0.5"
        />

        {/* 细腻实木木纹肌理 (手作白橡木自然年轮) */}
        <path
          d="M-13.5,4.3 Q-4.0,1.8 5.5,2.4 M-11.0,5.0 Q-2.0,2.8 3.5,3.8"
          stroke="#78421b"
          strokeWidth="0.35"
          strokeDasharray="8 2 12 3"
          opacity="0.35"
          fill="none"
        />

        {/* 坐板边缘倒角金色受光高光 */}
        <line x1="-15.8" y1="4.7" x2="-8.2" y2="6.9" stroke="#d59e69" strokeWidth="0.75" strokeLinecap="round" />
        <line x1="-8.2" y1="6.9" x2="7.8" y2="2.3" stroke="#be8753" strokeWidth="0.75" strokeLinecap="round" />

        {/* 3.3 质朴米白棉麻坐垫 (Linen Cushion: 柔软蓬松嵌于马鞍座中) */}
        <g id="chair-cushion-group">
          {/* 坐垫柔和底座与外边缘 */}
          <path
            d="M-12.5,4.5
               C-10.5,3.0 -4.5,1.2 0.5,1.0
               C3.8,1.2 6.5,2.0 6.2,2.8
               C5.8,3.6 2.0,4.8 -1.5,5.8
               C-5.5,6.2 -11.0,5.8 -12.5,4.5 Z"
            fill="url(#linenCushionGrad)"
            stroke="#b5a793"
            strokeWidth="0.4"
          />
          {/* 坐垫顶部膨起柔光 */}
          <ellipse cx="-2.5" cy="3.6" rx="6.5" ry="1.8" transform="rotate(-15.9, -2.5, 3.6)" fill="#ffffff" opacity="0.45" />
          {/* 棉麻十字微皱缝线 (Hand-Stitched Tuft) */}
          <line x1="-4.2" y1="4.2" x2="-0.8" y2="3.2" stroke="#ab9c86" strokeWidth="0.45" strokeLinecap="round" />
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

      {/* --- 5. 比例匀称、严格对中 (x=0) 的温莎梳背与弯木顶梁 (Windsor Backrest) --- */}
      {/*
        【对称性与居中修正】：
        此前立柱偏至 x=-2 ~ 10，导致右侧空出很多竖条、左侧缺失。
        现完全以 x=0 为对称中轴线，7 根立柱优雅排布在 x ∈ [-6.0, 6.0]，
        顶梁圆弧自 x=-7.2 延伸至 x=7.2，正对就座者后背，空椅与就座均极其优雅和谐。
      */}
      <g id="chair-windsor-backrest">
        {/* 5.1 七根实木纺锤立柱 (Turned Spindles: 严格垂直线，沿 -0.2852 斜率对称排布) */}
        {/* 立柱 1 (左主柱: x=-6.0) */}
        <line x1="-6.0" y1="6.7" x2="-6.0" y2="-3.8" stroke="#78471e" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="-5.8" y1="6.5" x2="-5.8" y2="-3.6" stroke="#b88350" strokeWidth="0.5" strokeLinecap="round" opacity="0.85" />
        <ellipse cx="-6.0" cy="1.5" rx="0.8" ry="0.4" fill="#583115" />

        {/* 立柱 2 (x=-4.0) */}
        <line x1="-4.0" y1="6.1" x2="-4.0" y2="-4.4" stroke="#875327" strokeWidth="1.15" strokeLinecap="round" />
        <ellipse cx="-4.0" cy="0.8" rx="0.75" ry="0.38" fill="#5c3518" />

        {/* 立柱 3 (x=-2.0) */}
        <line x1="-2.0" y1="5.6" x2="-2.0" y2="-5.0" stroke="#996336" strokeWidth="1.15" strokeLinecap="round" />
        <ellipse cx="-2.0" cy="0.2" rx="0.75" ry="0.38" fill="#623a1a" />

        {/* 立柱 4 (正中主立柱: x=0.0，直对人体脊柱) */}
        <line x1="0.0" y1="5.0" x2="0.0" y2="-5.6" stroke="#aa7243" strokeWidth="1.25" strokeLinecap="round" />
        <line x1="0.2" y1="4.8" x2="0.2" y2="-5.4" stroke="#d59e69" strokeWidth="0.5" strokeLinecap="round" opacity="0.9" />
        <ellipse cx="0.0" cy="-0.4" rx="0.85" ry="0.42" fill="#6c401e" />

        {/* 立柱 5 (x=2.0) */}
        <line x1="2.0" y1="4.4" x2="2.0" y2="-6.2" stroke="#996336" strokeWidth="1.15" strokeLinecap="round" />
        <ellipse cx="2.0" cy="-1.0" rx="0.75" ry="0.38" fill="#623a1a" />

        {/* 立柱 6 (x=4.0) */}
        <line x1="4.0" y1="3.9" x2="4.0" y2="-6.8" stroke="#875327" strokeWidth="1.15" strokeLinecap="round" />
        <ellipse cx="4.0" cy="-1.6" rx="0.75" ry="0.38" fill="#5c3518" />

        {/* 立柱 7 (右主柱: x=6.0) */}
        <line x1="6.0" y1="3.3" x2="6.0" y2="-7.4" stroke="#78471e" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="5.8" y1="3.1" x2="5.8" y2="-7.2" stroke="#b07746" strokeWidth="0.5" strokeLinecap="round" opacity="0.85" />
        <ellipse cx="6.0" cy="-2.2" rx="0.8" ry="0.4" fill="#583115" />

        {/* 5.2 蒸汽弯木圆弧梳背顶梁 (Steam-Bent Oak Crest Rail: 对称居中横跨于后背) */}
        {/* 顶梁下部厚度投影底线 */}
        <path
          d="M-7.2,-3.3 C-3.5,-5.2 0.0,-6.0 0.0,-5.2 C0.0,-6.0 3.5,-7.0 7.2,-7.2"
          stroke="#42250d"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* 顶梁主体白橡木渐变 */}
        <path
          d="M-7.2,-3.5 C-3.5,-5.4 0.0,-6.2 0.0,-5.4 C0.0,-6.2 3.5,-7.2 7.2,-7.4"
          stroke="url(#oakRailGrad)"
          strokeWidth="2.1"
          strokeLinecap="round"
          fill="none"
        />
        {/* 顶梁上沿温润受光倒角高光 (捕捉木蜡油光泽) */}
        <path
          d="M-6.8,-4.1 C-3.2,-6.0 0.0,-6.8 0.0,-6.0 C0.0,-6.8 3.2,-7.7 6.8,-8.0"
          stroke="#e0af7e"
          strokeWidth="0.75"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        {/* 顶梁两端温莎耳端雕花微凸圆钮 (Turned Horns) */}
        <circle cx="-7.2" cy="-3.5" r="1.1" fill="#78471e" stroke="#42250d" strokeWidth="0.35" />
        <circle cx="7.2" cy="-7.4" r="1.1" fill="#78471e" stroke="#42250d" strokeWidth="0.35" />
      </g>

      {/* --- 6. 悬浮交互与状态说明气泡 (Hover / Selection Tooltip) --- */}
      <g
        transform="translate(4, -32)"
        className="opacity-0 group-hover/windsor-chair:opacity-100 transition-opacity duration-200 pointer-events-none"
      >
        <rect
          x="-60"
          y="-11"
          width="120"
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
          {isSeated ? `💻 ${occupant?.name || '我'} · 面对电脑敲代码` : '🪑 白橡木温莎椅 · NW垂直对齐'}
        </text>
      </g>
    </g>
  );
};
