import React from 'react';

/**
 * 2.5D 纯净做旧温润原木四层开放书架 (ShelfFrame)
 * 
 * 视觉调优与结构重构重点：
 * 1. 降低过高明度：告别原先苍白发黄的“漂白塑料感/生硬卡其色”，转为饱含天然木蜡油质感的“温润焦糖蜜柚木/暖琥珀橡木”色调，
 *    与木屋内的书桌、地板、黑胶柜和茶几形成舒适、沉稳、温暖的整体美学呼应。
 * 2. 彻底重构立柱结构（告别原本断裂、突兀、粗壮笨重的圆木桩）：
 *    - 结构一体化：建立完整的“前左、后左、前右、后右”四根通顶连续实木细立柱（从地面直贯顶板）；
 *    - 比例精炼：将原本突兀臃肿的粗圆木桩（直径 7.2px）精简为纤巧优雅的实木方圆柱身（宽度 2.4px），轻盈通透；
 *    - 对称悬挑（Cantilever）：书架两侧大板均保持精准对称的 5.0px 悬挑飞檐（X=173 与 X=213），视觉极度舒展平衡；
 *    - 侧边梯框横撑（Side Ladder Bracing）：在左右两侧立柱之间引入嵌入式实木托档横撑，形成真实家具经典的梯构力学，质感倍增。
 */

// 统一几何骨架常数
export const SHELF_X0 = 168.0;
export const SHELF_WIDTH = 50.0;
export const SLOPE_W = 0.28; // dy / dx = 14.0 / 50.0
export const SHELF_DELTA_Y = SHELF_WIDTH * SLOPE_W; // 14.0

export const DEPTH_DX = 9.0;
export const DEPTH_DY = -2.5;

export const TIER_GAP_Y = 14.0;
export const PLANK_THICKNESS = 3.2;

// 4层大板前缘左端点 Y 坐标 (严格统一等距 14.0px)
export const TIER_Y: Record<number, number> = {
  4: 67.0,  // 第4层 皇冠顶层大板
  3: 81.0,  // 第3层 诗集与陶艺层
  2: 95.0,  // 第2层 经典藏书主展层
  1: 109.0, // 第1层 底层重典大板
};

// 四根通顶连续立柱在 2.5D 空间中的水平 X 锚点 (对称 5px 飞檐)
export const COL_L_FRONT_X = 173.0; // 左前柱 (距左缘 5px)
export const COL_L_REAR_X = 182.0;  // 左后柱 (173 + 9)
export const COL_R_FRONT_X = 213.0; // 右前柱 (距右缘 5px)
export const COL_R_REAR_X = 222.0;  // 右后柱 (213 + 9)

// 兼容别名与半径常数 (纤巧轻盈 1.2px 半径 / 2.4px 宽度)
export const COL_A_X = COL_L_FRONT_X;
export const COL_B_X = COL_R_FRONT_X;
export const RADIUS_BASE_A = 1.2;
export const RADIUS_BASE_B = 1.2;
export const RADIUS_T1_A = 1.2;
export const RADIUS_T1_B = 1.2;
export const RADIUS_T2_A = 1.2;
export const RADIUS_T2_B = 1.2;
export const RADIUS_T3_A = 1.2;
export const RADIUS_T3_B = 1.2;
export const COL_RADIUS = 1.2;

export interface TierBaseline {
  index: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  slotMinX: number;
  slotMaxX: number;
}

export const TIER_BASELINES: Record<number, TierBaseline> = {
  1: { index: 1, startX: 168.0, startY: 109.0, endX: 218.0, endY: 123.0, slotMinX: 184.0, slotMaxX: 210.0 },
  2: { index: 2, startX: 168.0, startY: 95.0,  endX: 218.0, endY: 109.0, slotMinX: 184.0, slotMaxX: 210.0 },
  3: { index: 3, startX: 168.0, startY: 81.0,  endX: 218.0, endY: 95.0,  slotMinX: 184.0, slotMaxX: 210.0 },
  4: { index: 4, startX: 168.0, startY: 67.0,  endX: 218.0, endY: 81.0,  slotMinX: 184.0, slotMaxX: 210.0 },
};

/**
 * 沿统一 2.5D 骨架计算书籍与饰品的精准落脚点坐标
 */
export function getTierPosition(tierIndex: number, progressOrX: number): { x: number; y: number } {
  const base = TIER_BASELINES[tierIndex] || TIER_BASELINES[2];
  let x = progressOrX;
  if (progressOrX >= 0 && progressOrX <= 1) {
    x = base.slotMinX + progressOrX * (base.slotMaxX - base.slotMinX);
  }
  const ratio = (x - base.startX) / (base.endX - base.startX);
  const y = base.startY + ratio * (base.endY - base.startY) - 1.1;
  return { x, y };
}

/**
 * 通用木纹与立柱渐变定义组 (木蜡油温润暖调，降低刺眼明度)
 */
const ShelfGradientsDefs: React.FC = () => (
  <defs>
    {/* 温暖原木层板顶面受光面渐变 (柔和焦糖蜜柚木，告别原本发白发灰的高明度卡其黄) */}
    <linearGradient id="plankTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#9b6c3e" />
      <stop offset="35%" stopColor="#8a5b30" />
      <stop offset="70%" stopColor="#784b25" />
      <stop offset="100%" stopColor="#673c1a" />
    </linearGradient>

    {/* 实木大板前缘厚度立面渐变 (饱满实木切面微深质感) */}
    <linearGradient id="plankFrontGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#71421b" />
      <stop offset="48%" stopColor="#5d3313" />
      <stop offset="100%" stopColor="#48240a" />
    </linearGradient>

    {/* 前侧实木细立柱渐变 (迎光微暖，立体挺拔) */}
    <linearGradient id="woodPillarFrontGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#4e2a10" />
      <stop offset="28%" stopColor="#6e3e1a" />
      <stop offset="72%" stopColor="#8a5528" />
      <stop offset="100%" stopColor="#663914" />
    </linearGradient>

    {/* 后侧实木细立柱渐变 (置于景深微暗处，自然景深衰减) */}
    <linearGradient id="woodPillarRearGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#3d1f0a" />
      <stop offset="35%" stopColor="#583113" />
      <stop offset="75%" stopColor="#72441c" />
      <stop offset="100%" stopColor="#502b0f" />
    </linearGradient>

    {/* 侧向实木托档横撑渐变 */}
    <linearGradient id="woodCrossbarGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#542e12" />
      <stop offset="50%" stopColor="#693b18" />
      <stop offset="100%" stopColor="#4f270e" />
    </linearGradient>
  </defs>
);

/**
 * 绘制单层温润原木层板 (纯平精雕，端切年轮与温润木蜡油倒角)
 */
interface PlankProps {
  id: string;
  tierIndex: number;
}

const WoodenPlank: React.FC<PlankProps> = ({ id, tierIndex }) => {
  const y = TIER_Y[tierIndex];
  const t = PLANK_THICKNESS;

  return (
    <g id={id}>
      {/* 1. 左侧端切面 End-grain */}
      <polygon
        points={`${SHELF_X0 + DEPTH_DX},${y + DEPTH_DY} ${SHELF_X0},${y} ${SHELF_X0},${y + t} ${SHELF_X0 + DEPTH_DX},${y + DEPTH_DY + t}`}
        fill="#583114"
        stroke="#3d1f0a"
        strokeWidth="0.35"
      />
      {/* 左端面微年轮弧纹 */}
      <path
        d={`M ${SHELF_X0 + 2.5},${y + 0.9} Q ${SHELF_X0 + 5.2},${y - 0.4} ${SHELF_X0 + 6.8},${y - 1.2}`}
        stroke="#44220b"
        strokeWidth="0.35"
        fill="none"
        opacity="0.5"
      />

      {/* 2. 右侧端切面 */}
      <polygon
        points={`${SHELF_X0 + SHELF_WIDTH},${y + SHELF_DELTA_Y} ${SHELF_X0 + SHELF_WIDTH + DEPTH_DX},${y + SHELF_DELTA_Y + DEPTH_DY} ${SHELF_X0 + SHELF_WIDTH + DEPTH_DX},${y + SHELF_DELTA_Y + DEPTH_DY + t} ${SHELF_X0 + SHELF_WIDTH},${y + SHELF_DELTA_Y + t}`}
        fill="#46240d"
        stroke="#2e1506"
        strokeWidth="0.35"
      />
      <path
        d={`M ${SHELF_X0 + SHELF_WIDTH + 2.6},${y + SHELF_DELTA_Y + 0.6} Q ${SHELF_X0 + SHELF_WIDTH + 5.0},${y + SHELF_DELTA_Y - 0.7} ${SHELF_X0 + SHELF_WIDTH + 7.0},${y + SHELF_DELTA_Y - 1.4}`}
        stroke="#331706"
        strokeWidth="0.35"
        fill="none"
        opacity="0.5"
      />

      {/* 3. 前缘立面 (实木厚度，微深温润) */}
      <polygon
        points={`${SHELF_X0},${y} ${SHELF_X0 + SHELF_WIDTH},${y + SHELF_DELTA_Y} ${SHELF_X0 + SHELF_WIDTH},${y + SHELF_DELTA_Y + t} ${SHELF_X0},${y + t}`}
        fill="url(#plankFrontGrad)"
        stroke="#3b1d09"
        strokeWidth="0.35"
      />
      {/* 前缘端面柔和顺纹纤维 */}
      <line
        x1={SHELF_X0 + 1.5}
        y1={y + 1.1}
        x2={SHELF_X0 + SHELF_WIDTH - 1.5}
        y2={y + SHELF_DELTA_Y + 1.1}
        stroke="#47230b"
        strokeWidth="0.4"
        opacity="0.45"
        strokeLinecap="round"
      />
      <line
        x1={SHELF_X0 + 3.0}
        y1={y + 2.1}
        x2={SHELF_X0 + SHELF_WIDTH - 3.5}
        y2={y + SHELF_DELTA_Y + 2.1}
        stroke="#825227"
        strokeWidth="0.3"
        opacity="0.3"
        strokeLinecap="round"
      />

      {/* 4. 顶面平整大板 (严格轴测平行四边形) */}
      <polygon
        points={`${SHELF_X0 + DEPTH_DX},${y + DEPTH_DY} ${SHELF_X0 + SHELF_WIDTH + DEPTH_DX},${y + SHELF_DELTA_Y + DEPTH_DY} ${SHELF_X0 + SHELF_WIDTH},${y + SHELF_DELTA_Y} ${SHELF_X0},${y}`}
        fill="url(#plankTopGrad)"
        stroke="#593214"
        strokeWidth="0.35"
      />

      {/* 5. 顶面实木顺纹与年轮山水微波 (温和琥珀色，告别刺眼白黄) */}
      <path
        d={`M ${SHELF_X0 + 3.5},${y - 0.6} Q ${SHELF_X0 + 22.0},${y + 5.8} ${SHELF_X0 + 47.0},${y + 13.0}`}
        stroke="#754722"
        strokeWidth="0.4"
        fill="none"
        opacity="0.35"
      />
      <path
        d={`M ${SHELF_X0 + 5.5},${y - 1.3} Q ${SHELF_X0 + 26.0},${y + 5.2} ${SHELF_X0 + 49.0},${y + 12.3}`}
        stroke="#b88954"
        strokeWidth="0.35"
        fill="none"
        opacity="0.3"
      />
      <path
        d={`M ${SHELF_X0 + 2.0},${y + 0.1} Q ${SHELF_X0 + 18.0},${y + 4.9} ${SHELF_X0 + 44.0},${y + 12.1}`}
        stroke="#673c1a"
        strokeWidth="0.35"
        fill="none"
        opacity="0.3"
      />

      {/* 6. 前缘木蜡油微倒角高光 (温和琥珀柔光，不生硬) */}
      <line
        x1={SHELF_X0}
        y1={y}
        x2={SHELF_X0 + SHELF_WIDTH}
        y2={y + SHELF_DELTA_Y}
        stroke="#cca170"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* 7. 板底沉稳下沉阴影微线 */}
      <line
        x1={SHELF_X0}
        y1={y + t}
        x2={SHELF_X0 + SHELF_WIDTH}
        y2={y + SHELF_DELTA_Y + t}
        stroke="#271104"
        strokeWidth="0.4"
        opacity="0.75"
      />
    </g>
  );
};

/**
 * 辅助：绘制单根纤巧实木细立柱节段 (带微倒角、纵向导管微纹与榫接承托)
 */
interface PillarStemProps {
  x: number;
  yTop: number;
  yBot: number;
  isRear?: boolean;
  addJointBrackets?: boolean;
}

const PillarStem: React.FC<PillarStemProps> = ({
  x,
  yTop,
  yBot,
  isRear = false,
  addJointBrackets = true,
}) => {
  const w = 2.4; // 纤细精巧立柱宽度 (半宽 1.2px)
  const leftX = x - w / 2;
  const height = yBot - yTop;
  const gradUrl = isRear ? 'url(#woodPillarRearGrad)' : 'url(#woodPillarFrontGrad)';
  const strokeColor = isRear ? '#331807' : '#3f1f0a';

  return (
    <g>
      {/* 主立柱柱身 */}
      <rect
        x={leftX}
        y={yTop}
        width={w}
        height={height}
        rx="0.5"
        fill={gradUrl}
        stroke={strokeColor}
        strokeWidth="0.3"
      />
      {/* 纵向实木微导管丝纹 */}
      <line
        x1={x - 0.4}
        y1={yTop + 0.8}
        x2={x - 0.4}
        y2={yBot - 0.8}
        stroke={isRear ? '#2c1405' : '#45220c'}
        strokeWidth="0.25"
        opacity="0.35"
        strokeDasharray="3 1.5 4 1.5"
      />
      <line
        x1={x + 0.4}
        y1={yTop + 0.8}
        x2={x + 0.4}
        y2={yBot - 0.8}
        stroke={isRear ? '#825227' : '#b07f4f'}
        strokeWidth="0.25"
        opacity="0.4"
      />

      {/* 柱端实木微榫接抱箍/承托件 (告别原先断裂的黑圆饼) */}
      {addJointBrackets && (
        <>
          {/* 上接触面微阴影抱箍 */}
          <rect
            x={x - 1.4}
            y={yTop - 0.2}
            width="2.8"
            height="0.9"
            rx="0.3"
            fill={isRear ? '#3a1c09' : '#4c250e'}
            opacity="0.75"
          />
          {/* 下支撑承托件 */}
          <rect
            x={x - 1.4}
            y={yBot - 0.7}
            width="2.8"
            height="0.9"
            rx="0.3"
            fill={isRear ? '#2b1305' : '#381a08'}
            opacity="0.8"
          />
        </>
      )}
    </g>
  );
};

/**
 * 辅助：绘制左右两侧侧向实木托档横撑 (连接前柱与后柱，赋予真实家具力学框架)
 */
interface SideCrossbarProps {
  xFront: number;
  yFront: number;
  xRear: number;
  yRear: number;
}

const SideCrossbar: React.FC<SideCrossbarProps> = ({ xFront, yFront, xRear, yRear }) => {
  // 横撑厚度约 1.2px，贴合在层板下方
  return (
    <polygon
      points={`${xFront},${yFront} ${xRear},${yRear} ${xRear},${yRear + 1.2} ${xFront},${yFront + 1.2}`}
      fill="url(#woodCrossbarGrad)"
      stroke="#331707"
      strokeWidth="0.25"
      opacity="0.9"
    />
  );
};

/**
 * 1. 地面接触阴影与稳固接地实木支脚 (ShelfBaseFeet)
 * 彻底重构：前后左右四根立柱严密对齐，纤巧扎实贴地，附带整体地面环境软阴影与侧向底撑
 */
export const ShelfBaseFeet: React.FC = () => {
  const y1 = TIER_Y[1]; // 109.0 (Tier 1 底板)
  const t = PLANK_THICKNESS; // 3.2

  // Tier 1 底部与四立柱交汇点 Y 坐标
  const yBotLF = y1 + (COL_L_FRONT_X - SHELF_X0) * SLOPE_W + t; // 109 + 1.4 + 3.2 = 113.6
  const yBotLR = yBotLF + DEPTH_DY;                             // 113.6 - 2.5 = 111.1
  const yBotRF = y1 + (COL_R_FRONT_X - SHELF_X0) * SLOPE_W + t; // 109 + 12.6 + 3.2 = 124.8
  const yBotRR = yBotRF + DEPTH_DY;                             // 124.8 - 2.5 = 122.3

  // 脚底离地间隙统一为 8.5px (轻盈通透但扎实稳重)
  const legClearance = 8.5;
  const yGroundLF = yBotLF + legClearance; // 122.1
  const yGroundLR = yBotLR + legClearance; // 119.6
  const yGroundRF = yBotRF + legClearance; // 133.3
  const yGroundRR = yBotRR + legClearance; // 130.8

  return (
    <g id="shelf-base-ground">
      <ShelfGradientsDefs />

      {/* 1. 地面整体环境柔和投影 (沿 2.5D 轴测平面展开) */}
      <polygon
        points={`${COL_L_REAR_X - 4},${yGroundLR - 1.2} ${COL_R_REAR_X + 4},${yGroundRR - 1.2} ${COL_R_FRONT_X + 4},${yGroundRF + 1.5} ${COL_L_FRONT_X - 4},${yGroundLF + 1.5}`}
        fill="#221005"
        opacity="0.16"
      />

      {/* 2. 四柱单独触地紧密接触暗影 */}
      <ellipse cx={COL_L_REAR_X} cy={yGroundLR} rx="2.4" ry="0.8" fill="#1b0c04" opacity="0.45" />
      <ellipse cx={COL_R_REAR_X} cy={yGroundRR} rx="2.4" ry="0.8" fill="#1b0c04" opacity="0.45" />
      <ellipse cx={COL_L_FRONT_X} cy={yGroundLF} rx="2.8" ry="0.9" fill="#1b0c04" opacity="0.55" />
      <ellipse cx={COL_R_FRONT_X} cy={yGroundRF} rx="2.8" ry="0.9" fill="#1b0c04" opacity="0.55" />

      {/* 3. 后侧两根接地立柱 (先渲染深处的后立柱) */}
      <PillarStem
        x={COL_L_REAR_X}
        yTop={yBotLR}
        yBot={yGroundLR}
        isRear={true}
        addJointBrackets={false}
      />
      <PillarStem
        x={COL_R_REAR_X}
        yTop={yBotRR}
        yBot={yGroundRR}
        isRear={true}
        addJointBrackets={false}
      />

      {/* 4. 左右两侧低位侧向加固横撑 (距地面约 2.5px，北欧梯架构力学) */}
      <SideCrossbar
        xFront={COL_L_FRONT_X}
        yFront={yGroundLF - 2.5}
        xRear={COL_L_REAR_X}
        yRear={yGroundLR - 2.5}
      />
      <SideCrossbar
        xFront={COL_R_FRONT_X}
        yFront={yGroundRF - 2.5}
        xRear={COL_R_REAR_X}
        yRear={yGroundRR - 2.5}
      />

      {/* 5. 前侧两根接地立柱 (挺拔优雅，与底板紧密咬合) */}
      <PillarStem
        x={COL_L_FRONT_X}
        yTop={yBotLF}
        yBot={yGroundLF}
        isRear={false}
        addJointBrackets={false}
      />
      <PillarStem
        x={COL_R_FRONT_X}
        yTop={yBotRF}
        yBot={yGroundRF}
        isRear={false}
        addJointBrackets={false}
      />

      {/* 6. 立柱接触底板榫口接缝加固线 */}
      <line x1={COL_L_FRONT_X - 1.5} y1={yBotLF} x2={COL_L_FRONT_X + 1.5} y2={yBotLF} stroke="#271104" strokeWidth="0.4" />
      <line x1={COL_R_FRONT_X - 1.5} y1={yBotRF} x2={COL_R_FRONT_X + 1.5} y2={yBotRF} stroke="#271104" strokeWidth="0.4" />
    </g>
  );
};

/**
 * 2. TIER 1 底层大板
 */
export const Tier1Plank: React.FC = () => <WoodenPlank id="frame-plank-tier-1" tierIndex={1} />;

/**
 * 3. TIER 1 TO 2 承托立柱 (PillarsTier1To2)
 * 前后共四根通顶立柱段 + 左右侧向托档横撑
 */
export const PillarsTier1To2: React.FC = () => {
  const y1 = TIER_Y[1]; // 109.0 (下板顶面)
  const y2 = TIER_Y[2]; // 95.0  (上板底面 = 95 + 3.2 = 98.2)
  const t = PLANK_THICKNESS;

  // 下板顶面各柱接触点 Y
  const yTopPlank1_LF = y1 + (COL_L_FRONT_X - SHELF_X0) * SLOPE_W; // 110.4
  const yTopPlank1_LR = yTopPlank1_LF + DEPTH_DY;                  // 107.9
  const yTopPlank1_RF = y1 + (COL_R_FRONT_X - SHELF_X0) * SLOPE_W; // 121.6
  const yTopPlank1_RR = yTopPlank1_RF + DEPTH_DY;                  // 119.1

  // 上板底面各柱接触点 Y
  const yBotPlank2_LF = y2 + (COL_L_FRONT_X - SHELF_X0) * SLOPE_W + t; // 99.6
  const yBotPlank2_LR = yBotPlank2_LF + DEPTH_DY;                      // 97.1
  const yBotPlank2_RF = y2 + (COL_R_FRONT_X - SHELF_X0) * SLOPE_W + t; // 110.8
  const yBotPlank2_RR = yBotPlank2_RF + DEPTH_DY;                      // 108.3

  return (
    <g id="frame-pillars-tier-1-2">
      {/* 1. 后侧双细立柱 (置于景深后方) */}
      <PillarStem
        x={COL_L_REAR_X}
        yTop={yBotPlank2_LR}
        yBot={yTopPlank1_LR}
        isRear={true}
      />
      <PillarStem
        x={COL_R_REAR_X}
        yTop={yBotPlank2_RR}
        yBot={yTopPlank1_RR}
        isRear={true}
      />

      {/* 2. 左右侧向托板横撑 (托住上板底面) */}
      <SideCrossbar
        xFront={COL_L_FRONT_X}
        yFront={yBotPlank2_LF - 0.6}
        xRear={COL_L_REAR_X}
        yRear={yBotPlank2_LR - 0.6}
      />
      <SideCrossbar
        xFront={COL_R_FRONT_X}
        yFront={yBotPlank2_RF - 0.6}
        xRear={COL_R_REAR_X}
        yRear={yBotPlank2_RR - 0.6}
      />

      {/* 3. 前侧双细立柱 (挺拔通透) */}
      <PillarStem
        x={COL_L_FRONT_X}
        yTop={yBotPlank2_LF}
        yBot={yTopPlank1_LF}
        isRear={false}
      />
      <PillarStem
        x={COL_R_FRONT_X}
        yTop={yBotPlank2_RF}
        yBot={yTopPlank1_RF}
        isRear={false}
      />
    </g>
  );
};

/**
 * 4. TIER 2 经典藏书主展层大板
 */
export const Tier2Plank: React.FC = () => <WoodenPlank id="frame-plank-tier-2" tierIndex={2} />;

/**
 * 5. TIER 2 TO 3 承托立柱 (PillarsTier2To3)
 */
export const PillarsTier2To3: React.FC = () => {
  const y2 = TIER_Y[2]; // 95.0
  const y3 = TIER_Y[3]; // 81.0
  const t = PLANK_THICKNESS;

  const yTopPlank2_LF = y2 + (COL_L_FRONT_X - SHELF_X0) * SLOPE_W; // 96.4
  const yTopPlank2_LR = yTopPlank2_LF + DEPTH_DY;                  // 93.9
  const yTopPlank2_RF = y2 + (COL_R_FRONT_X - SHELF_X0) * SLOPE_W; // 107.6
  const yTopPlank2_RR = yTopPlank2_RF + DEPTH_DY;                  // 105.1

  const yBotPlank3_LF = y3 + (COL_L_FRONT_X - SHELF_X0) * SLOPE_W + t; // 85.6
  const yBotPlank3_LR = yBotPlank3_LF + DEPTH_DY;                      // 83.1
  const yBotPlank3_RF = y3 + (COL_R_FRONT_X - SHELF_X0) * SLOPE_W + t; // 96.8
  const yBotPlank3_RR = yBotPlank3_RF + DEPTH_DY;                      // 94.3

  return (
    <g id="frame-pillars-tier-2-3">
      {/* 1. 后侧双立柱 */}
      <PillarStem
        x={COL_L_REAR_X}
        yTop={yBotPlank3_LR}
        yBot={yTopPlank2_LR}
        isRear={true}
      />
      <PillarStem
        x={COL_R_REAR_X}
        yTop={yBotPlank3_RR}
        yBot={yTopPlank2_RR}
        isRear={true}
      />

      {/* 2. 侧向托档横撑 */}
      <SideCrossbar
        xFront={COL_L_FRONT_X}
        yFront={yBotPlank3_LF - 0.6}
        xRear={COL_L_REAR_X}
        yRear={yBotPlank3_LR - 0.6}
      />
      <SideCrossbar
        xFront={COL_R_FRONT_X}
        yFront={yBotPlank3_RF - 0.6}
        xRear={COL_R_REAR_X}
        yRear={yBotPlank3_RR - 0.6}
      />

      {/* 3. 前侧双立柱 */}
      <PillarStem
        x={COL_L_FRONT_X}
        yTop={yBotPlank3_LF}
        yBot={yTopPlank2_LF}
        isRear={false}
      />
      <PillarStem
        x={COL_R_FRONT_X}
        yTop={yBotPlank3_RF}
        yBot={yTopPlank2_RF}
        isRear={false}
      />
    </g>
  );
};

/**
 * 6. TIER 3 诗集与陶艺手记层大板
 */
export const Tier3Plank: React.FC = () => <WoodenPlank id="frame-plank-tier-3" tierIndex={3} />;

/**
 * 7. TIER 3 TO 4 承托立柱 (PillarsTier3To4)
 */
export const PillarsTier3To4: React.FC = () => {
  const y3 = TIER_Y[3]; // 81.0
  const y4 = TIER_Y[4]; // 67.0
  const t = PLANK_THICKNESS;

  const yTopPlank3_LF = y3 + (COL_L_FRONT_X - SHELF_X0) * SLOPE_W; // 82.4
  const yTopPlank3_LR = yTopPlank3_LF + DEPTH_DY;                  // 79.9
  const yTopPlank3_RF = y3 + (COL_R_FRONT_X - SHELF_X0) * SLOPE_W; // 93.6
  const yTopPlank3_RR = yTopPlank3_RF + DEPTH_DY;                  // 91.1

  const yBotPlank4_LF = y4 + (COL_L_FRONT_X - SHELF_X0) * SLOPE_W + t; // 71.6
  const yBotPlank4_LR = yBotPlank4_LF + DEPTH_DY;                      // 69.1
  const yBotPlank4_RF = y4 + (COL_R_FRONT_X - SHELF_X0) * SLOPE_W + t; // 82.8
  const yBotPlank4_RR = yBotPlank4_RF + DEPTH_DY;                      // 80.3

  return (
    <g id="frame-pillars-tier-3-4">
      {/* 1. 后侧双立柱 */}
      <PillarStem
        x={COL_L_REAR_X}
        yTop={yBotPlank4_LR}
        yBot={yTopPlank3_LR}
        isRear={true}
      />
      <PillarStem
        x={COL_R_REAR_X}
        yTop={yBotPlank4_RR}
        yBot={yTopPlank3_RR}
        isRear={true}
      />

      {/* 2. 侧向托档横撑 */}
      <SideCrossbar
        xFront={COL_L_FRONT_X}
        yFront={yBotPlank4_LF - 0.6}
        xRear={COL_L_REAR_X}
        yRear={yBotPlank4_LR - 0.6}
      />
      <SideCrossbar
        xFront={COL_R_FRONT_X}
        yFront={yBotPlank4_RF - 0.6}
        xRear={COL_R_REAR_X}
        yRear={yBotPlank4_RR - 0.6}
      />

      {/* 3. 前侧双立柱 */}
      <PillarStem
        x={COL_L_FRONT_X}
        yTop={yBotPlank4_LF}
        yBot={yTopPlank3_LF}
        isRear={false}
      />
      <PillarStem
        x={COL_R_FRONT_X}
        yTop={yBotPlank4_RF}
        yBot={yTopPlank3_RF}
        isRear={false}
      />
    </g>
  );
};

/**
 * 8. TIER 4 皇冠顶层大板 (承托干花瓶与复古罗盘)
 * 并在顶板顶面点缀四根立柱的平齐实木通榫端帽 (Tenon End Caps)
 */
export const Tier4CrownPlank: React.FC = () => {
  const y4 = TIER_Y[4]; // 67.0
  const yTopPlank4_LF = y4 + (COL_L_FRONT_X - SHELF_X0) * SLOPE_W; // 68.4
  const yTopPlank4_LR = yTopPlank4_LF + DEPTH_DY;                  // 65.9
  const yTopPlank4_RF = y4 + (COL_R_FRONT_X - SHELF_X0) * SLOPE_W; // 79.6
  const yTopPlank4_RR = yTopPlank4_RF + DEPTH_DY;                  // 77.1

  return (
    <g id="frame-plank-tier-4-crown">
      <WoodenPlank id="plank-tier-4" tierIndex={4} />

      {/* 四柱顶端实木微凸圆柱帽/平齐榫卯头 (平整温润，凸显榫卯工艺) */}
      <ellipse cx={COL_L_REAR_X} cy={yTopPlank4_LR} rx="1.3" ry="0.5" fill="#542e12" stroke="#361a08" strokeWidth="0.25" />
      <ellipse cx={COL_R_REAR_X} cy={yTopPlank4_RR} rx="1.3" ry="0.5" fill="#542e12" stroke="#361a08" strokeWidth="0.25" />
      <ellipse cx={COL_L_FRONT_X} cy={yTopPlank4_LF} rx="1.4" ry="0.55" fill="#693b18" stroke="#3f1f0a" strokeWidth="0.25" />
      <ellipse cx={COL_R_FRONT_X} cy={yTopPlank4_RF} rx="1.4" ry="0.55" fill="#693b18" stroke="#3f1f0a" strokeWidth="0.25" />
    </g>
  );
};

// 兼容导出别名
export const Tier4Plank = Tier4CrownPlank;
export const Tier5CrownPlank = Tier4CrownPlank;
export const PillarsTier4To5: React.FC = () => null;
