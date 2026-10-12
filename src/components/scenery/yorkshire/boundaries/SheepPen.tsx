import React, { useState } from 'react';
import { ambientAudio } from '../../../../audio/ambientAudio';
import { useTimerScope } from '../../../../shared/timers/useTimerScope';
import { svgAction } from '../../../../world/interactions/svgAction';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';
import { YorkshireCommonProps } from '../landscapeTypes';
import { MeadowWearPatch } from '../dressing/MeadowWearPatch';

/**
 * 🐑 SheepPen (Yorkshire Authentic Masterpiece 2.5D Stone-and-Timber Meadow Sheepfold)
 *
 * Layer: 04 BOUNDARIES & MEADOW LIVING
 * Location: East Pasture, beside the terrace (placement owned by YORKSHIRE_LAYOUT)
 *
 * 核心针对性全方位重构升级：
 * 1. 避风雪松木高挑大草棚 (High-Clearance Lean-to Field Barn):
 *    - 彻底解除矮后墙限制！后脊立木挑高 24px（超越石墙顶冠），前檐拔高至 36px 净空，通透开阔无压抑感；
 *    - 补齐右侧山墙木桁架（Bargeboard & Truss）与斜撑，告别右侧悬空截断；内部设干草架、扎实金色草垛与宽敞深邃遮阴；
 * 2. 天然老磨石立体水槽 (Carved Gritstone Trough with Southeast Face & Depth):
 *    - 完整补齐东南立面（右侧转折立面），解决纸片空心漏底穿帮；
 *    - 槽口设厚度石唇，向下凹陷内壁暗面阴影，天青泉水深盛其中；配木质注水龙口与红褐舔盐矿石；
 * 3. 西北方向适度自然扩展 (Northwest Meadow Expansion · 严格不越界到草台):
 *    - 沿 2.5D 轴向西北延伸 35px，空间更豁达舒展，离草台保留充足绿茵缓冲带；
 *    - 后干砌石墙与前围栏严格平行对称延伸，后石墙远东端增加立体端面收头，消除纸片切口；
 * 4. 接地生根感与农场田园质感 (Grounded Earth, Straw Bedding & Soft Lighting):
 *    - 所有立柱脚下增添接地接触暗影与青草掩映；母羊身下铺垫蓬松温暖金黄麦草窝；
 *    - 白天马灯收敛过曝脉冲光圈，回归精致做旧质感；门外小羊羔配欢快小蹄印与金色蒲公英。
 */
export const SheepPen: React.FC<YorkshireCommonProps> = ({
  theme,
  onTriggerToast,
  setHoveredObject,
  className,
}) => {
  const timers = useTimerScope();
  const [isGateOpen, setIsGateOpen] = useState(true);
  const [activeSheep, setActiveSheep] = useState<'mother' | 'peeking' | 'grazing' | null>(null);
  const [sheepSaying, setSheepSaying] = useState<string | null>(null);

  const anchor = YORKSHIRE_LAYOUT.sheepPen.anchor;

  const handleGateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isGateOpen;
    setIsGateOpen(nextState);
    ambientAudio.playGentleChime();

    const toastMsg = nextState
      ? '🚪 约克郡原木五杠门轻启 · 羊圈大门敞开，小羊羔欢快地跑到门外大草甸上撒欢！'
      : '🚪 约克郡原木五杠门轻掩 · 门闩扣合牢靠，圈内温暖避风';
    onTriggerToast?.(toastMsg);
  };

  const handleSheepClick = (type: 'mother' | 'peeking' | 'grazing', e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSheep(type);

    const quotes: Record<typeof type, string> = {
      mother: '🐑 咩~ 高顶木棚通风又遮阴，麦草晒得又香又脆，太惬意了。',
      peeking: '🐑 咩咩~ 门开着呢！外面的草甸好大好宽，开满了金色蒲公英！',
      grazing: '🐑 咩~ 这片草甸的苜蓿草汁水好丰盛，细嚼慢咽才尝得出清甜。',
    };

    const quote = quotes[type];
    setSheepSaying(quote);
    onTriggerToast?.(quote);

    timers.schedule('pen-sheep-quote', () => {
      setActiveSheep(null);
      setSheepSaying(null);
    }, 4500);
  };

  return (
    <g
      id="yorkshire-sheep-pen-cluster"
      className={className}
      transform={`translate(${anchor.x}, ${anchor.y})`}
    >
      <defs>
        {/* 沉稳橡木/雪松立柱与横梁渐变 */}
        <linearGradient id="spOakTimberGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a522a" />
          <stop offset="50%" stopColor="#5f3a1b" />
          <stop offset="100%" stopColor="#432610" />
        </linearGradient>

        {/* 木柱受光侧面渐变 */}
        <linearGradient id="spOakHighlightGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#966738" />
          <stop offset="100%" stopColor="#71451f" />
        </linearGradient>

        {/* 柱顶切角金黄高光 */}
        <linearGradient id="spOakTopGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ab7843" />
          <stop offset="100%" stopColor="#7b4d24" />
        </linearGradient>

        {/* 做旧雪松木瓦坡屋顶渐变 */}
        <linearGradient id="spCedarRoofGrad" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#694121" />
          <stop offset="45%" stopColor="#4f2f17" />
          <stop offset="100%" stopColor="#321b0a" />
        </linearGradient>

        {/* 屋顶山墙与椽木深色渐变 */}
        <linearGradient id="spRoofTimberTrussGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#543419" />
          <stop offset="100%" stopColor="#2c1708" />
        </linearGradient>

        {/* 约克郡古法干砌片石立面渐变 */}
        <linearGradient id="spDrystoneFaceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#786f61" />
          <stop offset="45%" stopColor="#5d5446" />
          <stop offset="100%" stopColor="#3d372b" />
        </linearGradient>

        {/* 石墙顶冠片石渐变 */}
        <linearGradient id="spStoneCopingGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9e9381" />
          <stop offset="50%" stopColor="#b3a896" />
          <stop offset="100%" stopColor="#877b69" />
        </linearGradient>

        {/* 粗凿砂岩水槽受光外立面渐变 (西南立面) */}
        <linearGradient id="spTroughStoneFrontGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#756b5a" />
          <stop offset="55%" stopColor="#595042" />
          <stop offset="100%" stopColor="#3c3529" />
        </linearGradient>

        {/* 粗凿砂岩水槽背阴外立面渐变 (东南立面 - 关键立体补齐) */}
        <linearGradient id="spTroughStoneSideGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4c4335" />
          <stop offset="60%" stopColor="#383126" />
          <stop offset="100%" stopColor="#231e17" />
        </linearGradient>

        {/* 清澈天然山泉水面渐变 */}
        <linearGradient id="spSpringWaterGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e5868" />
          <stop offset="50%" stopColor="#2c798e" />
          <stop offset="100%" stopColor="#15424d" />
        </linearGradient>

        {/* 经典正统纯净羊毛渐变 */}
        <linearGradient id="spCanonicalWoolGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffdfa" />
          <stop offset="55%" stopColor="#f3ede2" />
          <stop offset="100%" stopColor="#ded5c4" />
        </linearGradient>

        {/* 踩踏泥土小径与底床柔和渐变 */}
        <radialGradient id="spLoamBaseGrad" cx="45%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#3d301e" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#483823" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#57452b" stopOpacity="0.0" />
        </radialGradient>

        {/* 白昼温润微弱马灯光晕 */}
        <radialGradient id="spDaytimeLanternGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
        </radialGradient>

        {/* 雅致砂岩立柱柱础顶面温润渐变 */}
        <linearGradient id="spPlinthTopGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7e7465" />
          <stop offset="50%" stopColor="#696052" />
          <stop offset="100%" stopColor="#554d40" />
        </linearGradient>

        {/* 雅致砂岩立柱柱础侧立面立体深色渐变 */}
        <linearGradient id="spPlinthBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#544c3f" />
          <stop offset="60%" stopColor="#433b30" />
          <stop offset="100%" stopColor="#2e271e" />
        </linearGradient>
      </defs>

      {/* ========================================================================= */}
      {/* 1. 地面柔和沉底阴影 (Ground AO Contact Shadow)                             */}
      {/* ========================================================================= */}
      <polygon
        points="-112,10 115,-56 360,12 138,90"
        fill="#101a0c"
        opacity="0.2"
      />

      {/* ========================================================================= */}
      {/* 2. 羊圈踩踏泥土底坪与有机小径 (Paddock Loam Bed & Footprints)               */}
      {/*    四边严格对齐 2.5D 等轴测（西北适度扩展 35px，绝不触碰草台）：           */}
      {/*    SW (-100, 16) -> NW (120, -46.5) -> NE (345, 18) -> SE (125, 80.5)      */}
      {/* ========================================================================= */}
      {/* A. 踩踏暗黄褐泥土底盘 (微起伏羽化，与大草甸自然接壤) */}
      <polygon
        points="-100,16 120,-46.5 345,18 125,80.5"
        fill="url(#spLoamBaseGrad)"
      />

      {/* B. Disconnected hoof wear at the gate, shelter approach and trough. */}
      <g id="sheep-pen-interior-grass-wear" pointerEvents="none">
        <MeadowWearPatch id="pen-gate-inner-wear" theme={theme} variant="scuff"
          transform="matrix(0.7 -0.198 0.15 0.65 -6 40)" opacity={0.85} />
        <MeadowWearPatch id="pen-grazing-approach-wear" theme={theme} variant="scuff"
          transform="matrix(0.75 -0.212 0.15 0.7 42 30)" opacity={0.75} />
        <MeadowWearPatch id="pen-shelter-approach-wear" theme={theme} variant="scuff"
          transform="matrix(0.95 -0.269 0.2 0.75 130 9)" opacity={0.85} />
        <MeadowWearPatch id="pen-trough-approach-wear" theme={theme} variant="scuff"
          transform="matrix(0.65 -0.184 0.13 0.65 228 8)" opacity={0.65} />
      </g>
      <MeadowWearPatch id="sheep-pen-entry-grass-wear" theme={theme}
        transform="matrix(0.36 0.102 -0.95 0.269 -28 43)" opacity={0.85} />

      {/* C. 围栏底沿低矮石砌基础 (平整收纳于各柱础内，消灭断裂刺角) */}
      <g id="sp-stone-footings" opacity="0.76">
        {/* 前围栏左段基础 (SW 角柱至大门悬挂柱，平滑收于柱础垫石内) */}
        <polygon points="-98,16 -46,31.5 -46,33.8 -98,18.3" fill="#4d4336" stroke="#2a231a" strokeWidth="0.35" />
        {/* 前围栏右段基础 (大门关门柱至 SE 角柱) */}
        <polygon points="26,52 123,79.5 123,81.8 26,54.3" fill="#4d4336" stroke="#2a231a" strokeWidth="0.35" />
        {/* 东南侧木栏基础 (SE 至 NE) */}
        <polygon points="123,79.5 343,18.2 343,15.9 123,77.2" fill="#4d4336" stroke="#2a231a" strokeWidth="0.35" />
        {/* 左侧封闭木栏基础 (SW 至 NW) */}
        <polygon points="-98,15 118,-46.2 118,-48.5 -98,12.7" fill="#4d4336" stroke="#2a231a" strokeWidth="0.35" />
      </g>

      {/* ========================================================================= */}
      {/* 3. 贯通后侧古法干砌石墙 (Continuous Yorkshire Drystone Wall)                */}
      {/*    从 NW (120, -46.5) 连绵横贯至 NE (345, 18)                              */}
      {/*    【新增】：远东端头立体断面与咬合收口，彻底告别纸片感！                     */}
      {/* ========================================================================= */}
      <g id="sp-back-drystone-wall">
        {/* 石墙深层地面阴影 */}
        <polygon points="120,-46.5 345,18 345,24 120,-40.5" fill="#12180c" opacity="0.4" />

        {/* 石墙主体立面 (高 18px，沿等轴测斜率 0.2867) */}
        <polygon
          points="120,-46.5 345,18 345,0 120,-64.5"
          fill="url(#spDrystoneFaceGrad)"
          stroke="#261f17"
          strokeWidth="0.8"
        />

        {/* 【关键立体补齐】：远东 NE 端头石块立体截面 (Quoin End Face) */}
        <polygon
          points="345,18 345,0 340,1.4 340,19.4"
          fill="#352e25"
          stroke="#201a13"
          strokeWidth="0.7"
        />

        {/* 约克郡传统不规则风化压顶石冠 (Coping Stones) */}
        <polygon
          points="118,-64.5 347,0 346,-6 117,-70.5"
          fill="url(#spStoneCopingGrad)"
          stroke="#221b14"
          strokeWidth="0.75"
        />
        {/* 远东压顶石厚度端面 */}
        <polygon
          points="347,0 346,-6 341,-4.5 342,1.5"
          fill="#706554"
          stroke="#221b14"
          strokeWidth="0.6"
        />

        {/* 压顶片石刻线 */}
        {[
          { x: 135, y: -60 }, { x: 155, y: -54 }, { x: 175, y: -48 },
          { x: 195, y: -42 }, { x: 215, y: -36 }, { x: 235, y: -31 },
          { x: 255, y: -25 }, { x: 275, y: -19 }, { x: 295, y: -13 },
          { x: 315, y: -7 },  { x: 335, y: -2 },
        ].map((cp, idx) => (
          <line
            key={`cp-edge-${idx}`}
            x1={cp.x}
            y1={cp.y - 3.5}
            x2={cp.x - 1}
            y2={cp.y + 2.5}
            stroke="#1c150e"
            strokeWidth="0.85"
            opacity="0.8"
          />
        ))}

        {/* 错落石缝细节 */}
        <path
          d="M124,-54 Q180,-38 240,-21 T342,6"
          stroke="#1d1610"
          strokeWidth="0.9"
          fill="none"
          opacity="0.65"
        />
        <path
          d="M122,-45 Q175,-30 235,-13 T340,13"
          stroke="#1d1610"
          strokeWidth="0.85"
          fill="none"
          opacity="0.6"
        />

        {/* 竖缝短线 */}
        {[
          { x: 140, y: -58, h: 7 }, { x: 165, y: -51, h: 8 }, { x: 190, y: -44, h: 8 },
          { x: 215, y: -36, h: 7 }, { x: 242, y: -29, h: 8 }, { x: 270, y: -21, h: 8 },
          { x: 298, y: -13, h: 7 }, { x: 325, y: -5, h: 8 },  { x: 150, y: -48, h: 7 },
          { x: 178, y: -40, h: 8 }, { x: 204, y: -32, h: 7 }, { x: 230, y: -24, h: 8 },
          { x: 256, y: -17, h: 7 }, { x: 284, y: -9, h: 8 },  { x: 310, y: -2, h: 7 },
        ].map((st, i) => (
          <line
            key={`stone-joint-${i}`}
            x1={st.x}
            y1={st.y}
            x2={st.x + 0.5}
            y2={st.y + st.h}
            stroke="#1f1811"
            strokeWidth="0.85"
            opacity="0.6"
          />
        ))}

        {/* 石缝微生青苔 */}
        <circle cx="155" cy="-44" r="2.2" fill="#365314" opacity="0.65" />
        <circle cx="210" cy="-28" r="2.5" fill="#4d7c0f" opacity="0.55" />
        <circle cx="280" cy="-8" r="2.4" fill="#365314" opacity="0.6" />
        <circle cx="330" cy="5" r="2.2" fill="#4d7c0f" opacity="0.5" />
      </g>

      {/* ========================================================================= */}
      {/* 4. 左侧厚实封闭木围栏 (Left-Flank Heavy Timber Fence)                       */}
      {/*    SW (-100, 16) -> NW (120, -46.5)                                       */}
      {/* ========================================================================= */}
      <g id="sp-left-flank-timber-fence">
        {/* 下横梁 */}
        <line x1="-98" y1="8" x2="118" y2="-54.5" stroke="url(#spOakTimberGrad)" strokeWidth="3.6" strokeLinecap="round" />
        <line x1="-98" y1="6.8" x2="118" y2="-55.7" stroke="url(#spOakHighlightGrad)" strokeWidth="1.0" opacity="0.75" />
        {/* 上横梁 */}
        <line x1="-98" y1="-2" x2="118" y2="-64.5" stroke="url(#spOakTimberGrad)" strokeWidth="3.8" strokeLinecap="round" />
        <line x1="-98" y1="-3.2" x2="118" y2="-65.7" stroke="url(#spOakHighlightGrad)" strokeWidth="1.1" opacity="0.8" />

        {/* 间隔立柱 1 (x: -30, y: -4) */}
        <g transform="translate(-30, -4)">
          <ellipse cx="0" cy="1.6" rx="4.2" ry="1.8" fill="#12180d" opacity="0.38" />
          <path d="M-3.8,0 C-3.8,1.6 3.8,1.6 3.8,0 L3.8,1.8 C3.8,3.4 -3.8,3.4 -3.8,1.8 Z" fill="url(#spPlinthBodyGrad)" stroke="#221a13" strokeWidth="0.45" />
          <ellipse cx="0" cy="0" rx="3.8" ry="1.6" fill="url(#spPlinthTopGrad)" stroke="#221a13" strokeWidth="0.5" />
          <rect x="-3" y="-24" width="6" height="24" rx="0.6" fill="url(#spOakTimberGrad)" stroke="#1f1105" strokeWidth="0.7" />
          <line x1="-2.2" y1="-23.5" x2="-2.2" y2="-0.5" stroke="url(#spOakHighlightGrad)" strokeWidth="1.2" opacity="0.75" />
          <line x1="-3" y1="-0.6" x2="3" y2="-0.6" stroke="#22140a" strokeWidth="0.7" />
          <polygon points="-3,-24 0,-27.5 3,-24" fill="url(#spOakTopGrad)" stroke="#1f1105" strokeWidth="0.5" />
          <path d="M-3,2 Q-2.2,0.4 -1,1.2" stroke="#4d7c0f" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>
        {/* 间隔立柱 2 (x: 45, y: -25) */}
        <g transform="translate(45, -25)">
          <ellipse cx="0" cy="1.6" rx="4.2" ry="1.8" fill="#12180d" opacity="0.38" />
          <path d="M-3.8,0 C-3.8,1.6 3.8,1.6 3.8,0 L3.8,1.8 C3.8,3.4 -3.8,3.4 -3.8,1.8 Z" fill="url(#spPlinthBodyGrad)" stroke="#221a13" strokeWidth="0.45" />
          <ellipse cx="0" cy="0" rx="3.8" ry="1.6" fill="url(#spPlinthTopGrad)" stroke="#221a13" strokeWidth="0.5" />
          <rect x="-3" y="-24" width="6" height="24" rx="0.6" fill="url(#spOakTimberGrad)" stroke="#1f1105" strokeWidth="0.7" />
          <line x1="-2.2" y1="-23.5" x2="-2.2" y2="-0.5" stroke="url(#spOakHighlightGrad)" strokeWidth="1.2" opacity="0.75" />
          <line x1="-3" y1="-0.6" x2="3" y2="-0.6" stroke="#22140a" strokeWidth="0.7" />
          <polygon points="-3,-24 0,-27.5 3,-24" fill="url(#spOakTopGrad)" stroke="#1f1105" strokeWidth="0.5" />
          <path d="M-3,2 Q-2.2,0.4 -1,1.2" stroke="#4d7c0f" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>
        {/* 西北转角柱 NW (120, -46.5 · 坚实衔接左侧木栏与后侧干砌石墙) */}
        <g id="sp-post-northwest" transform="translate(120, -46.5)">
          <ellipse cx="0" cy="1.8" rx="4.8" ry="2.2" fill="#12180d" opacity="0.4" />
          <path d="M-4.4,0 C-4.4,1.8 4.4,1.8 4.4,0 L4.4,2.0 C4.4,3.8 -4.4,3.8 -4.4,2.0 Z" fill="url(#spPlinthBodyGrad)" stroke="#221a13" strokeWidth="0.5" />
          <ellipse cx="0" cy="0" rx="4.4" ry="1.8" fill="url(#spPlinthTopGrad)" stroke="#221a13" strokeWidth="0.55" />
          <path d="M-3.8,0.2 Q0,1.5 3.8,0.2" stroke="#948773" strokeWidth="0.6" fill="none" opacity="0.8" />
          <rect x="-3.5" y="-26" width="7" height="26" rx="0.7" fill="url(#spOakTimberGrad)" stroke="#1f1105" strokeWidth="0.8" />
          <line x1="-2.5" y1="-25.5" x2="-2.5" y2="-0.5" stroke="url(#spOakHighlightGrad)" strokeWidth="1.3" opacity="0.8" />
          <line x1="-3.5" y1="-0.7" x2="3.5" y2="-0.7" stroke="#22140a" strokeWidth="0.8" />
          <polygon points="-3.5,-26 0,-30 3.5,-26" fill="url(#spOakTopGrad)" stroke="#1f1105" strokeWidth="0.6" />
          <path d="M-3.5,2.4 Q-2.6,0.3 -1.4,1.3" stroke="#4d7c0f" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 5. 避风雪松木深邃大草棚 (Masterpiece Deep-Clearance Lean-to Field Barn)        */}
      {/*    【系统级全方位终极精修】：                                                   */}
      {/*    1. 彻底解决“右柱斜撑悬空”：精确计算榫卯几何，斜撑顶端严丝合缝咬合大托梁底面； */}
      {/*    2. 解决“后排无柱浮空”：增设左右两根坚实后排承重立木柱，山墙形成完整落地排架；  */}
      {/*    3. 解决“右挑檐不对称”：右侧屋面与檐口向外延展 8px，左右出挑对称舒展大气；      */}
      {/*    4. 增强后壁木板质感：添加立木加强龙骨与风化板条，彻底消除纸板单调感；        */}
      {/*    5. 草垛环境光调和：温润天然草金，告别暗影区突兀荧光。                          */}
      {/* ========================================================================= */}
      <g id="sp-lean-to-shelter">
        {/* A. 坚固后排承重主立柱 (Solid Rear Timber Posts · 奠定整座建筑生根骨架) */}
        {/* 左后立柱 (地面 -40 直通脊梁 -76) */}
        <line x1="148" y1="-42" x2="148" y2="-76" stroke="#2c1708" strokeWidth="4.0" strokeLinecap="round" />
        <line x1="147" y1="-42" x2="147" y2="-76" stroke="#4a280e" strokeWidth="1.2" opacity="0.7" />
        {/* 右后立柱 (地面 -12 直通脊梁 -43) */}
        <line x1="260" y1="-12" x2="260" y2="-43" stroke="#2c1708" strokeWidth="4.0" strokeLinecap="round" />
        <line x1="259" y1="-12" x2="259" y2="-43" stroke="#4a280e" strokeWidth="1.2" opacity="0.7" />

        {/* B. 后壁实木雪松羽状挡风板 (Cedar Weatherboard Back Wall) */}
        <polygon
          points="148,-56 262,-23.3 262,-43 148,-75.4"
          fill="#3c2512"
          stroke="#1e1106"
          strokeWidth="0.8"
        />
        {/* 横向重叠挡风木板木纹沟线 */}
        {[-70, -65, -60, -55, -50, -45, -40, -35, -30].map((baseY, idx) => {
          const y1 = baseY + (148 - 148) * 0.2867;
          const y2 = baseY + (262 - 148) * 0.2867;
          if (idx % 2 === 0) {
            return (
              <line
                key={`wb-line-${idx}`}
                x1="148"
                y1={y1}
                x2="262"
                y2={y2}
                stroke="#221308"
                strokeWidth="1.1"
                opacity="0.85"
              />
            );
          }
          return null;
        })}
        {/* 后壁纵向实木加强龙骨 (Vertical Timber Studs) */}
        {[182, 218].map((studX, idx) => {
          const wallBot = -56 + (studX - 148) * 0.2867;
          const wallTop = -75.4 + (studX - 148) * 0.2867;
          return (
            <line
              key={`wb-stud-${idx}`}
              x1={studX}
              y1={wallBot}
              x2={studX}
              y2={wallTop}
              stroke="#2c1708"
              strokeWidth="2.2"
              opacity="0.85"
            />
          );
        })}

        {/* C. 棚下深邃凉爽的地面接触阴影 (双层柔和渐变羽化) */}
        <polygon
          points="146,-44 262,-10 236,16 114,-18"
          fill="#0c140a"
          opacity="0.25"
        />
        <polygon
          points="148,-42 258,-12 228,12 118,-15"
          fill="#0c140a"
          opacity="0.38"
        />

        {/* D. 后壁挂壁实木干草架 (Slatted Timber Hay Manger) */}
        <g id="sp-timber-hay-manger" transform="translate(182, -52)">
          <polygon points="0,0 38,10.9 36,19 -2,8" fill="#2c1708" stroke="#140a02" strokeWidth="0.7" />
          {/* 实木横纵栅条 */}
          {[4, 11, 18, 25, 32].map((rx, idx) => (
            <line
              key={`hm-s-${idx}`}
              x1={rx}
              y1={rx * 0.28}
              x2={rx - 1}
              y2={rx * 0.28 + 9}
              stroke="#6c421e"
              strokeWidth="1.3"
            />
          ))}
          {/* 金黄甜麦草自然溢出 */}
          <ellipse cx="19" cy="4" rx="17" ry="4" fill="#b45309" opacity="0.95" />
          <ellipse cx="18" cy="3" rx="14" ry="3" fill="#d97706" />
          <path d="M4,5 Q1,9 -2,7" stroke="#b45309" strokeWidth="0.9" fill="none" />
          <path d="M15,7 Q19,12 17,15" stroke="#d97706" strokeWidth="0.8" fill="none" />
          <path d="M28,9 Q33,13 34,10" stroke="#f59e0b" strokeWidth="0.8" fill="none" />
        </g>

        {/* E. 单个扎实金黄草垛 (Single Compact Golden Hay Bale · 温润沉稳草金色) */}
        <g id="sp-single-hay-bale" transform="translate(214, -14)">
          <ellipse cx="0" cy="8" rx="14" ry="7" fill="#141a0f" opacity="0.4" />
          <ellipse cx="0" cy="6" rx="13" ry="6.5" fill="#a16207" />
          <rect x="-13" y="-4" width="26" height="10" fill="#b45309" />
          <ellipse cx="0" cy="-4" rx="13" ry="6.0" fill="#d97706" stroke="#92400e" strokeWidth="0.7" />
          {/* 麻绳扎带 */}
          <line x1="-7" y1="-4" x2="-7" y2="6" stroke="#542308" strokeWidth="0.9" strokeDasharray="3,1.5" />
          <line x1="7" y1="-4" x2="7" y2="6" stroke="#542308" strokeWidth="0.9" strokeDasharray="3,1.5" />
          <circle cx="0" cy="-4" r="3.2" fill="none" stroke="#92400e" strokeWidth="0.6" strokeDasharray="2,2" />
        </g>

        {/* F. 暴露的厚实屋架木椽 (Timber Rafters Under Eaves) */}
        {[0.04, 0.26, 0.50, 0.74, 0.96].map((t, i) => {
          const backX = 146 + t * 118;
          const backY = -76 + t * 33.8;
          const frontX = 114 + t * 118;
          const frontY = -53 + t * 33.8;
          return (
            <line
              key={`rafter-${i}`}
              x1={backX}
              y1={backY}
              x2={frontX}
              y2={frontY}
              stroke="#241305"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          );
        })}

        {/* G. 【通长实木前檐大托梁】 (Heavy Front Timber Tie Beam / Lintel) */}
        {/*    横跨左前柱至右前柱，贯通支撑前挑檐 */}
        <g id="sp-shelter-tie-beam">
          <line
            x1="116"
            y1="-51"
            x2="230"
            y2="-18.3"
            stroke="url(#spOakTimberGrad)"
            strokeWidth="4.6"
            strokeLinecap="round"
          />
          <line
            x1="116"
            y1="-52.3"
            x2="230"
            y2="-19.6"
            stroke="url(#spOakHighlightGrad)"
            strokeWidth="1.2"
            opacity="0.8"
          />
        </g>

        {/* H. 前排两根坚固实木立柱与榫接斜撑木 */}
        {/* 左前木柱 (地面 120, -16 直通梁下 -50) */}
        <g id="sp-shelter-post-left" transform="translate(120, -16)">
          <ellipse cx="0" cy="1.6" rx="4.5" ry="2.0" fill="#12180d" opacity="0.4" />
          <path d="M-4.2,0 C-4.2,1.8 4.2,1.8 4.2,0 L4.2,2.0 C4.2,3.8 -4.2,3.8 -4.2,2.0 Z" fill="url(#spPlinthBodyGrad)" stroke="#221a13" strokeWidth="0.5" />
          <ellipse cx="0" cy="0" rx="4.2" ry="1.8" fill="url(#spPlinthTopGrad)" stroke="#221a13" strokeWidth="0.5" />
          <path d="M-3.6,0.2 Q0,1.4 3.6,0.2" stroke="#948773" strokeWidth="0.6" fill="none" opacity="0.8" />
          <rect x="-3" y="-34" width="6" height="34" rx="0.5" fill="url(#spOakTimberGrad)" stroke="#190c03" strokeWidth="0.8" />
          <line x1="-2" y1="-33.5" x2="-2" y2="-0.5" stroke="url(#spOakHighlightGrad)" strokeWidth="1.1" opacity="0.8" />
          <line x1="-3" y1="-0.7" x2="3" y2="-0.7" stroke="#22140a" strokeWidth="0.75" />
          {/* 左三角斜撑 (稳固榫接前梁) */}
          <line x1="2" y1="-26" x2="16" y2="-32" stroke="#482b12" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M-3.5,2.2 Q-2.5,0.4 -1.2,1.2" stroke="#4d7c0f" strokeWidth="0.85" fill="none" strokeLinecap="round" />
        </g>

        {/* 右前木柱 (地面 222, 13 直通梁下 -18.5) */}
        <g id="sp-shelter-post-right" transform="translate(222, 13)">
          <ellipse cx="0" cy="1.6" rx="4.5" ry="2.0" fill="#12180d" opacity="0.4" />
          <path d="M-4.2,0 C-4.2,1.8 4.2,1.8 4.2,0 L4.2,2.0 C4.2,3.8 -4.2,3.8 -4.2,2.0 Z" fill="url(#spPlinthBodyGrad)" stroke="#221a13" strokeWidth="0.5" />
          <ellipse cx="0" cy="0" rx="4.2" ry="1.8" fill="url(#spPlinthTopGrad)" stroke="#221a13" strokeWidth="0.5" />
          <path d="M-3.6,0.2 Q0,1.4 3.6,0.2" stroke="#948773" strokeWidth="0.6" fill="none" opacity="0.8" />
          <rect x="-3" y="-32" width="6" height="32" rx="0.5" fill="url(#spOakTimberGrad)" stroke="#190c03" strokeWidth="0.8" />
          <line x1="-2" y1="-31.5" x2="-2" y2="-0.5" stroke="url(#spOakHighlightGrad)" strokeWidth="1.1" opacity="0.8" />
          <line x1="-3" y1="-0.7" x2="3" y2="-0.7" stroke="#22140a" strokeWidth="0.75" />
          {/* 右三角斜撑精准顶接大托梁底面 */}
          <line x1="-2" y1="-22" x2="-16" y2="-38.2" stroke="#482b12" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M2.5,2.4 Q3.4,0.5 4.2,1.5" stroke="#365314" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>

        {/* I. 左侧规整雪松封檐山墙梁 (Left Sloping Bargeboard) */}
        <polygon
          points="146,-76 114,-53 114,-46 146,-69"
          fill="url(#spRoofTimberTrussGrad)"
          stroke="#190d04"
          strokeWidth="0.75"
        />
        <line x1="146" y1="-75" x2="114" y2="-52" stroke="#966738" strokeWidth="0.8" opacity="0.75" />

        {/* J. 【舒展对称右侧山墙桁架】：向右拓展 8px，左右出挑对称 (Right Airy Gable Truss) */}
        <polygon
          points="264,-42.2 232,-19.2 232,-12.2 264,-35.2"
          fill="url(#spRoofTimberTrussGrad)"
          stroke="#190d04"
          strokeWidth="0.75"
        />
        <line x1="264" y1="-41.2" x2="232" y2="-18.2" stroke="#966738" strokeWidth="0.8" opacity="0.75" />
        {/* 右侧山墙排架撑梁 (与右后立柱相交承托) */}
        <line x1="262" y1="-34" x2="232" y2="-15" stroke="#3b2310" strokeWidth="2.0" strokeLinecap="round" />

        {/* K. 【宽进深·舒缓乡村坡度雪松木瓦坡屋顶】 (Weathered Cedar Shingle Pitched Roof) */}
        {/*    后脊 (146, -76 -> 264, -42.2)；前檐 (114, -53 -> 232, -19.2) 左右对称出挑 */}
        <polygon
          points="146,-76 264,-42.2 232,-19.2 114,-53"
          fill="url(#spCedarRoofGrad)"
          stroke="#170c04"
          strokeWidth="0.85"
        />

        {/* 前檐厚度封檐板 (Eaves Fascia Board) */}
        <polygon
          points="114,-53 232,-19.2 232,-15.2 114,-49"
          fill="#361f0e"
          stroke="#170c04"
          strokeWidth="0.75"
        />
        {/* 前檐受光滴水棱线金棕高光 */}
        <line x1="114" y1="-52.5" x2="232" y2="-18.7" stroke="#9a693b" strokeWidth="1.1" opacity="0.85" />

        {/* 屋面做旧木瓦层次 (顺应坡度法线与横向排瓦) */}
        {[0.25, 0.5, 0.75].map((t, i) => (
          <g key={`shingle-tier-${i}`}>
            <line
              x1={146 + t * 118}
              y1={-76 + t * 33.8}
              x2={114 + t * 118}
              y2={-53 + t * 33.8}
              stroke="#1b0d04"
              strokeWidth="1.1"
              opacity="0.75"
            />
            <line
              x1={114 + (1 - t) * 32}
              y1={-53 - (1 - t) * 23}
              x2={232 + (1 - t) * 32}
              y2={-19.2 - (1 - t) * 23}
              stroke="#180c04"
              strokeWidth="0.85"
              opacity="0.7"
            />
            <line
              x1={114 + (1 - t) * 32}
              y1={-52.5 - (1 - t) * 23}
              x2={232 + (1 - t) * 32}
              y2={-18.7 - (1 - t) * 23}
              stroke="#734522"
              strokeWidth="0.6"
              opacity="0.55"
            />
          </g>
        ))}

        {/* 屋脊背阴青苔小斑 */}
        <ellipse cx="178" cy="-66" rx="4.5" ry="1.8" fill="#365314" opacity="0.6" />
        <ellipse cx="224" cy="-53" rx="4.0" ry="1.6" fill="#4d7c0f" opacity="0.5" />

        {/* L. 悬挂于前梁左侧的黄铜防风马灯 */}
        <g id="sp-shelter-lantern" transform="translate(120, -41)">
          <ellipse cx="0" cy="4" rx="7" ry="5.5" fill="url(#spDaytimeLanternGlow)" />
          <path d="M-2.5,-2 Q0,-5 2.5,-2" stroke="#854d0e" strokeWidth="0.8" fill="none" />
          <polygon points="-2.5,-2 2.5,-2 2,-3.5 -2,-3.5" fill="#a16207" />
          <rect x="-2.5" y="6" width="5" height="2" rx="0.4" fill="#78350f" />
          <ellipse cx="0" cy="2" rx="2.4" ry="3.2" fill="#fef08a" opacity="0.8" />
          <circle cx="0" cy="2" r="1.0" fill="#fbbf24" />
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 6. 天然老磨石凿雕饮水槽 (Authentic 3D Carved Gritstone Water Trough)        */}
      {/*    【核心优化落实】：                                                         */}
      {/*    1. 彻底补齐【东南立面】（右侧立面），消灭纸片空心漏底穿帮；                */}
      {/*    2. 雕琢槽壁厚度（Beveled Stone Rim）与内壁阴影，泉水真正盛在石槽内凹中；   */}
      {/*    3. 位置协调适度，避免紧贴石墙或被外围木栏遮挡。                           */}
      {/* ========================================================================= */}
      <g id="sp-stone-water-trough" transform="translate(262, -2)">
        {/* A. 底部青苔石板垫基 (Mossy Flagstone Apron) */}
        <polygon points="-16,4 26,16 22,24 -20,12" fill="#383227" stroke="#211d16" strokeWidth="0.6" />
        <ellipse cx="-12" cy="8" rx="4.5" ry="2.0" fill="#2d4212" opacity="0.75" />
        <ellipse cx="16" cy="18" rx="4.0" ry="1.8" fill="#3e6312" opacity="0.65" />

        {/* 槽体立面参数：长边 (0,0)->(36, 10.3)；进深 (0,0)->(-14, 4.0)；高 11px 直立 */}
        {/* B. 【关键补齐】：槽体东南外立面 (Right-SE Face · 彻底解决纸片感) */}
        {/*    顶点：FR (22, 14.3) -> BR (36, 10.3) -> BR_bot (36, 21.3) -> FR_bot (22, 25.3) */}
        <polygon
          points="22,14.3 36,10.3 36,21.3 22,25.3"
          fill="url(#spTroughStoneSideGrad)"
          stroke="#1b1610"
          strokeWidth="0.8"
        />

        {/* C. 槽体西南前立面 (Front-SW Face) */}
        {/*    顶点：FL (-14, 4.0) -> FR (22, 14.3) -> FR_bot (22, 25.3) -> FL_bot (-14, 15.0) */}
        <polygon
          points="-14,4.0 22,14.3 22,25.3 -14,15.0"
          fill="url(#spTroughStoneFrontGrad)"
          stroke="#1f1a14"
          strokeWidth="0.8"
        />

        {/* D. 槽体西北左立面 (Left-NW Face) */}
        {/*    顶点：BL (0, 0) -> FL (-14, 4.0) -> FL_bot (-14, 15.0) -> BL_bot (0, 11.0) */}
        <polygon
          points="0,0 -14,4.0 -14,15.0 0,11.0"
          fill="#3c352a"
          stroke="#1f1a14"
          strokeWidth="0.8"
        />

        {/* E. 槽口厚边石唇 (Beveled Gritstone Coping Rim) */}
        {/*    BL (0,0) -> BR (36, 10.3) -> FR (22, 14.3) -> FL (-14, 4.0) */}
        <polygon
          points="0,0 36,10.3 22,14.3 -14,4.0"
          fill="#786e5c"
          stroke="#1f1a14"
          strokeWidth="0.75"
        />

        {/* F. 【石槽内壁深陷暗面】 (Inner Wall Occlusion - 形成真实凹陷容积感) */}
        {/* 内壁后立面与右立面阴影 */}
        <polygon
          points="0.5,1.0 34.0,10.5 34.0,12.5 0.5,3.0"
          fill="#1f1b14"
          opacity="0.85"
        />
        <polygon
          points="34.0,10.5 20.5,14.3 20.5,16.3 34.0,12.5"
          fill="#17140e"
          opacity="0.9"
        />

        {/* G. 【开阔天青澄澈泉水面】 (Sunken Crystal Mountain Water) */}
        <polygon
          points="-11.8,4.7 20.5,13.8 33.5,10.1 0.8,1.0"
          fill="url(#spSpringWaterGrad)"
        />
        {/* 天青覆光与反光 */}
        <polygon
          points="-11.8,4.7 20.5,13.8 33.5,10.1 0.8,1.0"
          fill="#38bdf8"
          opacity="0.28"
        />

        {/* 水面轻柔微澜高光 */}
        <line x1="-7" y1="4.2" x2="16" y2="10.8" stroke="#ffffff" strokeWidth="0.75" opacity="0.8" strokeLinecap="round" />
        <line x1="3" y1="5.6" x2="28" y2="12.6" stroke="#bae6fd" strokeWidth="0.6" opacity="0.65" strokeLinecap="round" />

        {/* 水底圆润溪石 */}
        <circle cx="2" cy="5.2" r="1.4" fill="#29231a" opacity="0.65" />
        <circle cx="16" cy="9.2" r="1.5" fill="#332b21" opacity="0.6" />

        {/* 木质注水龙口 (Wooden Spring Spout · 注入纯净山泉) */}
        <polygon points="12,1.5 16,2.6 15,5.5 11,4.4" fill="#5c3817" stroke="#190c03" strokeWidth="0.4" />
        <line x1="11" y1="4.4" x2="9" y2="7.5" stroke="#e0f2fe" strokeWidth="0.8" opacity="0.85" />
        <ellipse cx="8.8" cy="8" rx="0.9" ry="0.5" fill="#ffffff" opacity="0.85" />
        <ellipse cx="9" cy="8.2" rx="1.6" ry="0.8" fill="#7dd3fc" opacity="0.5" />

        {/* 侧旁独立圆木截桩与天然矿物红褐舔盐石 (Mineral Salt Lick Block) */}
        <g transform="translate(-16, 12)">
          <ellipse cx="0" cy="5" rx="6.0" ry="3.0" fill="#12180d" opacity="0.35" />
          <ellipse cx="0" cy="4" rx="5.5" ry="2.7" fill="#3e2612" stroke="#1c0f04" strokeWidth="0.5" />
          <rect x="-5.5" y="0" width="11" height="4" fill="#543418" />
          <ellipse cx="0" cy="0" rx="5.5" ry="2.5" fill="#734923" stroke="#1c0f04" strokeWidth="0.5" />
          {/* 天然红褐舔盐矿石 */}
          <polygon points="-3.5,-1.5 3.5,0.8 1.5,4.5 -5,2.5" fill="#b96a56" stroke="#6c2411" strokeWidth="0.5" />
          <polygon points="-3.5,-1.5 0,-3.5 3.5,0.8 0,2.0" fill="#d98975" />
          <circle cx="0.5" cy="-0.5" r="1.0" fill="#fde68a" opacity="0.75" />
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 7. 散落金黄麦草与圈内生机野花 (Loose Straw Bedding & Wildflowers)            */}
      {/*    【核心优化】：彻底剔除同心光滑长弧线（消灭“水波涟漪/冲击波”感），        */}
      {/*    改用短促、交错、自然散落的真实金黄麦草茎秸秆碎屑，温暖蓬松。               */}
      {/* ========================================================================= */}
      <g id="sp-straw-bedding">
        {/* 母羊身下柔和温暖厚麦草卧垫 (蓬松有机的深邃草窝基底，包裹娇小温顺母羊) */}
        <ellipse cx="174" cy="-8" rx="23" ry="9.5" fill="#b45309" opacity="0.18" />
        <ellipse cx="174" cy="-9" rx="19" ry="8" fill="#ca8a04" opacity="0.25" />
        <ellipse cx="172" cy="-10" rx="15" ry="6.5" fill="#eab308" opacity="0.3" />

        {/* 真实交错散落的短麦秸秆 (短而细密、多角度交叠，绝无水波感) */}
        {[
          // 母羊前侧散落麦草
          { x1: 158, y1: -4, x2: 165, y2: -2, col: '#ca8a04', w: 1.0 },
          { x1: 160, y1: -1, x2: 167, y2: -5, col: '#eab308', w: 0.9 },
          { x1: 164, y1: -4, x2: 171, y2: -3, col: '#facc15', w: 0.95 },
          { x1: 162, y1: 2, x2: 169, y2: 0, col: '#ca8a04', w: 0.85 },
          { x1: 167, y1: 2.5, x2: 174, y2: 1, col: '#eab308', w: 0.95 },
          // 母羊下侧与身旁麦草
          { x1: 170, y1: -1, x2: 177, y2: 2, col: '#facc15', w: 0.9 },
          { x1: 173, y1: 3.5, x2: 180, y2: 2.5, col: '#ca8a04', w: 0.95 },
          { x1: 175, y1: 1, x2: 182, y2: 3.5, col: '#eab308', w: 0.85 },
          { x1: 178, y1: -2, x2: 185, y2: 1, col: '#d97706', w: 1.0 },
          { x1: 181, y1: 2.5, x2: 188, y2: 0, col: '#facc15', w: 0.85 },
          // 母羊后侧与边缘散落麦草
          { x1: 184, y1: -4, x2: 191, y2: -2, col: '#ca8a04', w: 0.95 },
          { x1: 186, y1: -7, x2: 193, y2: -5, col: '#eab308', w: 0.9 },
          { x1: 188, y1: -1, x2: 195, y2: -4, col: '#facc15', w: 0.85 },
          { x1: 191, y1: -5, x2: 198, y2: -7, col: '#ca8a04', w: 0.8 },
          { x1: 194, y1: -2, x2: 200, y2: 1, col: '#eab308', w: 0.85 },
          // 几处轻巧折角麦秸
          { x1: 155, y1: -6, x2: 161, y2: -7, col: '#d97706', w: 0.9 },
          { x1: 169, y1: -12, x2: 175, y2: -11, col: '#ca8a04', w: 0.8 },
          { x1: 176, y1: -14, x2: 182, y2: -12, col: '#eab308', w: 0.85 },
          { x1: 186, y1: -11, x2: 191, y2: -12, col: '#facc15', w: 0.8 },
        ].map((st, i) => (
          <line
            key={`straw-stalk-${i}`}
            x1={st.x1}
            y1={st.y1}
            x2={st.x2}
            y2={st.y2}
            stroke={st.col}
            strokeWidth={st.w}
            strokeLinecap="round"
          />
        ))}

        {/* 细小松散麦草屑与碎草点 */}
        {[
          { cx: 160, cy: -3, r: 0.7, col: '#fde047' },
          { cx: 166, cy: 1, r: 0.65, col: '#eab308' },
          { cx: 173, cy: 2.5, r: 0.75, col: '#facc15' },
          { cx: 180, cy: 1.8, r: 0.65, col: '#ca8a04' },
          { cx: 186, cy: -2, r: 0.75, col: '#fde047' },
          { cx: 192, cy: -5, r: 0.7, col: '#eab308' },
          { cx: 171, cy: -12, r: 0.6, col: '#facc15' },
        ].map((pt, i) => (
          <circle key={`straw-dot-${i}`} cx={pt.cx} cy={pt.cy} r={pt.r} fill={pt.col} opacity="0.9" />
        ))}

        {/* 圈内伴生野生小白雏菊与毛茛花 */}
        <g id="pen-wildflowers" opacity="0.95">
          <circle cx="-10" cy="36" r="1.8" fill="#ffffff" />
          <circle cx="-10" cy="36" r="0.7" fill="#facc15" />
          <circle cx="45" cy="52" r="1.6" fill="#fef08a" />
          <circle cx="45" cy="52" r="0.65" fill="#ca8a04" />
          <circle cx="150" cy="38" r="1.7" fill="#ffffff" />
          <circle cx="150" cy="38" r="0.7" fill="#facc15" />
          <circle cx="110" cy="50" r="1.5" fill="#ffffff" />
          <circle cx="110" cy="50" r="0.6" fill="#facc15" />
          <circle cx="280" cy="34" r="1.7" fill="#fef08a" />
          <circle cx="280" cy="34" r="0.65" fill="#ca8a04" />
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 8. 经典正统 Swaledale 绵羊群 (Canonical Smooth Picture-Book Sheep)         */}
      {/* ========================================================================= */}

      {/* 🐑 1. 高挑木棚内安睡反刍母羊 (Lounging Mother Sheep Safely In Airy Barn · 减人体积 18% 娇小安适) */}
      <g
        {...svgAction('羊圈温顺母羊')}
        id="pen-resting-mother-sheep"
        transform="translate(174, -10) scale(0.82)"
        className="cursor-pointer group/sheep"
        onClick={(e) => handleSheepClick('mother', e)}
        onMouseEnter={() => setHoveredObject?.({ kind: 'entity', id: 'sheep-2' })}
        onMouseLeave={() => setHoveredObject?.(null)}
      >
        {/* 卧姿接触阴影 */}
        <ellipse cx="0" cy="9" rx="16" ry="5.5" fill="#141a0f" opacity="0.35" />
        <ellipse cx="-9" cy="9.5" rx="2.5" ry="1.3" fill="#241d18" />
        <ellipse cx="9" cy="9.5" rx="2.5" ry="1.3" fill="#241d18" />

        {/* 纯净圆润鹅蛋羊身 */}
        <ellipse cx="0" cy="2" rx="16" ry="10" fill="url(#spCanonicalWoolGrad)" stroke="#d4cab7" strokeWidth="0.8" />
        <ellipse cx="2" cy="0" rx="13.5" ry="8" fill="#fffdfa" />

        {/* 黑脸、反刍眯眯眼微笑与小圆耳 */}
        <g transform="translate(-13, 0)">
          <ellipse cx="0" cy="0" rx="5.2" ry="4.0" fill="#2b231e" />
          <ellipse cx="-1.5" cy="0" rx="3.8" ry="3.0" fill="#1c1612" />
          {/* 反刍眯眯眼弯线 */}
          <path d="M-1,-0.8 Q0,-0.1 1,-0.8" stroke="#fef08a" strokeWidth="0.75" fill="none" strokeLinecap="round" />
          {/* 小黑耳 */}
          <ellipse cx="1.5" cy="-3.5" rx="2.4" ry="1.0" fill="#221a15" transform="rotate(-15 1.5 -3.5)" />
          {/* 嘴边叼着的细麦秸秆 */}
          <path d="M-1.5,1.5 Q-5,3 -8,2" stroke="#eab308" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* 🐑 2. 圈内开阔草地低头吃草羊 (Grazing Sheep in Center Meadow · 缩减至 0.76，呼吸感倍增) */}
      <g
        {...svgAction('羊圈低头啃草羊')}
        id="pen-grazing-sheep"
        transform="translate(85, 28) scale(0.76)"
        className="cursor-pointer group/sheep"
        onClick={(e) => handleSheepClick('grazing', e)}
        onMouseEnter={() => setHoveredObject?.({ kind: 'entity', id: 'sheep-1' })}
        onMouseLeave={() => setHoveredObject?.(null)}
      >
        <ellipse cx="0" cy="15" rx="16" ry="5.5" fill="#141a0f" opacity="0.35" />
        {/* 四条整齐小黑腿 */}
        <line x1="-8" y1="8" x2="-8" y2="16" stroke="#241e1a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="-3" y1="8" x2="-3" y2="17" stroke="#1d1714" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="5" y1="8" x2="6" y2="16" stroke="#241e1a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="10" y1="8" x2="11" y2="17" stroke="#1d1714" strokeWidth="2.2" strokeLinecap="round" />

        {/* 纯净圆润鹅蛋身躯 */}
        <ellipse cx="0" cy="2" rx="17" ry="12" fill="url(#spCanonicalWoolGrad)" stroke="#d4cab7" strokeWidth="0.8" />
        <ellipse cx="-3" cy="-1" rx="14.5" ry="9.5" fill="#fffdfa" />

        {/* 低头嚼草黑脸与明亮黄眼 */}
        <g transform="translate(14, 5) rotate(20)">
          <ellipse cx="0" cy="0" rx="5.8" ry="4.5" fill="#2d2621" />
          <ellipse cx="1.8" cy="0" rx="4.0" ry="3.2" fill="#1b1511" />
          <circle cx="1" cy="-1.8" r="0.85" fill="#fef08a" />
          <circle cx="1" cy="-1.8" r="0.45" fill="#000000" />
          <ellipse cx="-1" cy="-3.5" rx="2.4" ry="1.1" fill="#241d18" transform="rotate(-15 -1 -3.5)" />
          {/* 嘴边新鲜三叶草 */}
          <path d="M2,3 Q5,6 8,4" stroke="#84cc16" strokeWidth="0.9" fill="none" strokeLinecap="round" />
          <circle cx="7" cy="3.5" r="1.3" fill="#65a30d" />
        </g>
      </g>

      {/* 🐑 3. 欢脱奔向门外草甸的小羊羔 (Playful Lamb Outside Open Gate) */}
      <g
        {...svgAction('羊圈探头小羊羔')}
        id="pen-peeking-lamb"
        transform="translate(-62, 54) scale(0.68)"
        className="cursor-pointer group/sheep"
        onClick={(e) => handleSheepClick('peeking', e)}
        onMouseEnter={() => setHoveredObject?.({ kind: 'entity', id: 'sheep-3' })}
        onMouseLeave={() => setHoveredObject?.(null)}
      >
        <ellipse cx="0" cy="14" rx="12" ry="4.5" fill="#141a0f" opacity="0.32" />
        {/* 四条欢脱小黑腿 */}
        <line x1="-7" y1="6" x2="-9" y2="15" stroke="#241e1a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="-2" y1="6" x2="-3" y2="16" stroke="#1d1714" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="5" y1="6" x2="7" y2="14" stroke="#241e1a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="9" y1="6" x2="12" y2="15" stroke="#1d1714" strokeWidth="1.8" strokeLinecap="round" />

        {/* 纯净小鹅蛋羊身 */}
        <ellipse cx="0" cy="0" rx="13" ry="9" fill="url(#spCanonicalWoolGrad)" stroke="#d4cab7" strokeWidth="0.7" />
        <ellipse cx="-1" cy="-2" rx="11" ry="7" fill="#fffdfa" />

        {/* 好奇小黑脸与圆黄大眼 */}
        <g transform="translate(-10, -3)">
          <ellipse cx="0" cy="0" rx="4.8" ry="3.8" fill="#2d2621" />
          <circle cx="-1" cy="-1.4" r="0.9" fill="#fef08a" />
          <circle cx="-1" cy="-1.4" r="0.45" fill="#000000" />
          <ellipse cx="2" cy="-3" rx="2.2" ry="1.0" fill="#221a15" />
        </g>
        {/* 门外小羊脚边的欢快蒲公英与小蹄印 */}
        <circle cx="15" cy="12" r="1.6" fill="#facc15" />
        <circle cx="15" cy="12" r="0.7" fill="#ca8a04" />
        <circle cx="-16" cy="15" r="1.5" fill="#ffffff" />
        <circle cx="-16" cy="15" r="0.6" fill="#eab308" />
      </g>

      {/* ========================================================================= */}
      {/* 9. 东南侧厚实木围栏与角柱 (South-East Heavy Timber Fence)                  */}
      {/*    SE (125, 80.5) -> NE (345, 18)                                         */}
      {/* ========================================================================= */}
      <g id="sp-southeast-timber-fence">
        {/* 下横梁 */}
        <line x1="127" y1="72" x2="343" y2="10" stroke="url(#spOakTimberGrad)" strokeWidth="3.6" strokeLinecap="round" />
        <line x1="127" y1="70.8" x2="343" y2="8.8" stroke="url(#spOakHighlightGrad)" strokeWidth="1.0" opacity="0.75" />
        {/* 上横梁 */}
        <line x1="127" y1="62" x2="343" y2="0" stroke="url(#spOakTimberGrad)" strokeWidth="3.8" strokeLinecap="round" />
        <line x1="127" y1="60.8" x2="343" y2="-1.2" stroke="url(#spOakHighlightGrad)" strokeWidth="1.1" opacity="0.8" />

        {/* 间隔立柱 1 (x: 198, y: 60) */}
        <g transform="translate(198, 60)">
          <ellipse cx="0" cy="1.6" rx="4.2" ry="1.8" fill="#12180d" opacity="0.38" />
          <path d="M-3.8,0 C-3.8,1.6 3.8,1.6 3.8,0 L3.8,1.8 C3.8,3.4 -3.8,3.4 -3.8,1.8 Z" fill="url(#spPlinthBodyGrad)" stroke="#221a13" strokeWidth="0.45" />
          <ellipse cx="0" cy="0" rx="3.8" ry="1.6" fill="url(#spPlinthTopGrad)" stroke="#221a13" strokeWidth="0.5" />
          <rect x="-3" y="-24" width="6" height="24" rx="0.6" fill="url(#spOakTimberGrad)" stroke="#1f1105" strokeWidth="0.7" />
          <line x1="-2.2" y1="-23.5" x2="-2.2" y2="-0.5" stroke="url(#spOakHighlightGrad)" strokeWidth="1.2" opacity="0.75" />
          <line x1="-3" y1="-0.6" x2="3" y2="-0.6" stroke="#22140a" strokeWidth="0.7" />
          <polygon points="-3,-24 0,-27.5 3,-24" fill="url(#spOakTopGrad)" stroke="#1f1105" strokeWidth="0.5" />
          <path d="M-3,2 Q-2.2,0.4 -1,1.2" stroke="#4d7c0f" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>
        {/* 间隔立柱 2 (x: 271, y: 39) */}
        <g transform="translate(271, 39)">
          <ellipse cx="0" cy="1.6" rx="4.2" ry="1.8" fill="#12180d" opacity="0.38" />
          <path d="M-3.8,0 C-3.8,1.6 3.8,1.6 3.8,0 L3.8,1.8 C3.8,3.4 -3.8,3.4 -3.8,1.8 Z" fill="url(#spPlinthBodyGrad)" stroke="#221a13" strokeWidth="0.45" />
          <ellipse cx="0" cy="0" rx="3.8" ry="1.6" fill="url(#spPlinthTopGrad)" stroke="#221a13" strokeWidth="0.5" />
          <rect x="-3" y="-24" width="6" height="24" rx="0.6" fill="url(#spOakTimberGrad)" stroke="#1f1105" strokeWidth="0.7" />
          <line x1="-2.2" y1="-23.5" x2="-2.2" y2="-0.5" stroke="url(#spOakHighlightGrad)" strokeWidth="1.2" opacity="0.75" />
          <line x1="-3" y1="-0.6" x2="3" y2="-0.6" stroke="#22140a" strokeWidth="0.7" />
          <polygon points="-3,-24 0,-27.5 3,-24" fill="url(#spOakTopGrad)" stroke="#1f1105" strokeWidth="0.5" />
          <path d="M-3,2 Q-2.2,0.4 -1,1.2" stroke="#4d7c0f" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>
        {/* 远东角柱 NE (345, 18 · 雅致衔接东南围栏与干砌石墙远端) */}
        <g id="sp-post-fareast" transform="translate(345, 18)">
          <ellipse cx="0" cy="1.8" rx="4.8" ry="2.2" fill="#12180d" opacity="0.4" />
          <path d="M-4.4,0 C-4.4,1.8 4.4,1.8 4.4,0 L4.4,2.0 C4.4,3.8 -4.4,3.8 -4.4,2.0 Z" fill="url(#spPlinthBodyGrad)" stroke="#221a13" strokeWidth="0.5" />
          <ellipse cx="0" cy="0" rx="4.4" ry="1.8" fill="url(#spPlinthTopGrad)" stroke="#221a13" strokeWidth="0.55" />
          <path d="M-3.8,0.2 Q0,1.5 3.8,0.2" stroke="#948773" strokeWidth="0.6" fill="none" opacity="0.8" />
          <rect x="-3.5" y="-26" width="7" height="26" rx="0.7" fill="url(#spOakTimberGrad)" stroke="#1f1105" strokeWidth="0.8" />
          <line x1="-2.5" y1="-25.5" x2="-2.5" y2="-0.5" stroke="url(#spOakHighlightGrad)" strokeWidth="1.3" opacity="0.8" />
          <line x1="-3.5" y1="-0.7" x2="3.5" y2="-0.7" stroke="#22140a" strokeWidth="0.8" />
          <polygon points="-3.5,-26 0,-30 3.5,-26" fill="url(#spOakTopGrad)" stroke="#1f1105" strokeWidth="0.6" />
          <path d="M-3.5,2.4 Q-2.6,0.3 -1.4,1.3" stroke="#4d7c0f" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 10. 西南前侧围栏与五杠牧场门 (Front Heavy Fence & 5-Bar Pasture Gate)       */}
      {/*     SW (-100, 16) -> SE (125, 80.5)，门洞 (-45, 31.8) 到 (25, 51.8)        */}
      {/* ========================================================================= */}
      {/* --- A. 门左侧固定栏段 (-100, 16 -> -45, 31.8 先于立柱渲染，立柱在最前覆盖接缝) --- */}
      <g id="sp-front-left-rail">
        <line x1="-98" y1="8" x2="-47" y2="23.5" stroke="url(#spOakTimberGrad)" strokeWidth="3.6" strokeLinecap="round" />
        <line x1="-98" y1="6.8" x2="-47" y2="22.3" stroke="url(#spOakHighlightGrad)" strokeWidth="1.0" opacity="0.75" />
        <line x1="-98" y1="-2" x2="-47" y2="13.5" stroke="url(#spOakTimberGrad)" strokeWidth="3.8" strokeLinecap="round" />
        <line x1="-98" y1="-3.2" x2="-47" y2="12.3" stroke="url(#spOakHighlightGrad)" strokeWidth="1.1" opacity="0.8" />
      </g>

      {/* --- B. 前左转角柱 SW (-100, 16 · 雅致风化砂岩柱础，完美生根消灭生硬杂角) --- */}
      <g id="sp-post-frontleft" transform="translate(-100, 16)">
        <ellipse cx="0" cy="2" rx="5.5" ry="2.6" fill="#12180d" opacity="0.42" />
        {/* 柱础侧壁 */}
        <path
          d="M-4.8,0 C-4.8,2.0 4.8,2.0 4.8,0 L4.8,2.2 C4.8,4.2 -4.8,4.2 -4.8,2.2 Z"
          fill="url(#spPlinthBodyGrad)"
          stroke="#221a13"
          strokeWidth="0.5"
        />
        {/* 柱础顶面 */}
        <ellipse cx="0" cy="0" rx="4.8" ry="2.0" fill="url(#spPlinthTopGrad)" stroke="#221a13" strokeWidth="0.55" />
        <path d="M-4.2,0.3 Q0,1.8 4.2,0.3" stroke="#9e917d" strokeWidth="0.65" fill="none" opacity="0.8" />
        {/* 立柱主体 */}
        <rect x="-3.5" y="-25" width="7" height="25" rx="0.7" fill="url(#spOakTimberGrad)" stroke="#1f1105" strokeWidth="0.8" />
        <line x1="-2.5" y1="-24.5" x2="-2.5" y2="-0.5" stroke="url(#spOakHighlightGrad)" strokeWidth="1.3" opacity="0.8" />
        <line x1="-3.5" y1="-0.8" x2="3.5" y2="-0.8" stroke="#22150a" strokeWidth="0.8" />
        <circle cx="-1.5" cy="-0.8" r="0.4" fill="#9ca3af" />
        <circle cx="1.5" cy="-0.8" r="0.4" fill="#9ca3af" />
        <polygon points="-3.5,-25 0,-29 3.5,-25" fill="url(#spOakTopGrad)" stroke="#1f1105" strokeWidth="0.6" />
        {/* 生根青草叶 */}
        <path d="M-4.2,2.6 Q-3.2,0.2 -1.8,1.4" stroke="#4d7c0f" strokeWidth="0.95" fill="none" strokeLinecap="round" />
        <path d="M2.2,2.8 Q3.6,0.6 4.6,1.8" stroke="#365314" strokeWidth="0.85" fill="none" strokeLinecap="round" />
        <circle cx="-3.2" cy="2.2" r="0.9" fill="#365314" opacity="0.65" />
      </g>

      {/* --- C. 门右侧固定栏段与中间立柱 (25, 51.8 -> 125, 80.5) --- */}
      <g id="sp-front-right-rail">
        <line x1="27" y1="43.8" x2="123" y2="71" stroke="url(#spOakTimberGrad)" strokeWidth="3.6" strokeLinecap="round" />
        <line x1="27" y1="42.6" x2="123" y2="69.8" stroke="url(#spOakHighlightGrad)" strokeWidth="1.0" opacity="0.75" />
        <line x1="27" y1="33.8" x2="123" y2="61" stroke="url(#spOakTimberGrad)" strokeWidth="3.8" strokeLinecap="round" />
        <line x1="27" y1="32.6" x2="123" y2="59.8" stroke="url(#spOakHighlightGrad)" strokeWidth="1.1" opacity="0.8" />

        {/* 间隔立柱 (x: 75, y: 66) */}
        <g transform="translate(75, 66)">
          <ellipse cx="0" cy="1.6" rx="4.2" ry="1.8" fill="#12180d" opacity="0.38" />
          <path d="M-3.8,0 C-3.8,1.6 3.8,1.6 3.8,0 L3.8,1.8 C3.8,3.4 -3.8,3.4 -3.8,1.8 Z" fill="url(#spPlinthBodyGrad)" stroke="#221a13" strokeWidth="0.45" />
          <ellipse cx="0" cy="0" rx="3.8" ry="1.6" fill="url(#spPlinthTopGrad)" stroke="#221a13" strokeWidth="0.5" />
          <rect x="-3" y="-24" width="6" height="24" rx="0.6" fill="url(#spOakTimberGrad)" stroke="#1f1105" strokeWidth="0.7" />
          <line x1="-2.2" y1="-23.5" x2="-2.2" y2="-0.5" stroke="url(#spOakHighlightGrad)" strokeWidth="1.2" opacity="0.75" />
          <line x1="-3" y1="-0.6" x2="3" y2="-0.6" stroke="#22140a" strokeWidth="0.7" />
          <polygon points="-3,-24 0,-27.5 3,-24" fill="url(#spOakTopGrad)" stroke="#1f1105" strokeWidth="0.5" />
          <path d="M-3,2 Q-2.2,0.4 -1,1.2" stroke="#4d7c0f" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* --- D. 前东南转角柱 SE (125, 80.5 · 坚固连接前栏与侧栏的砂岩柱础) --- */}
      <g id="sp-post-frontsouth" transform="translate(125, 80.5)">
        <ellipse cx="0" cy="2" rx="5.5" ry="2.6" fill="#12180d" opacity="0.42" />
        {/* 柱础侧壁 */}
        <path
          d="M-4.8,0 C-4.8,2.0 4.8,2.0 4.8,0 L4.8,2.2 C4.8,4.2 -4.8,4.2 -4.8,2.2 Z"
          fill="url(#spPlinthBodyGrad)"
          stroke="#221a13"
          strokeWidth="0.5"
        />
        {/* 柱础顶面 */}
        <ellipse cx="0" cy="0" rx="4.8" ry="2.0" fill="url(#spPlinthTopGrad)" stroke="#221a13" strokeWidth="0.55" />
        <path d="M-4.2,0.3 Q0,1.8 4.2,0.3" stroke="#9e917d" strokeWidth="0.65" fill="none" opacity="0.8" />
        {/* 立柱主体 */}
        <rect x="-3.5" y="-25" width="7" height="25" rx="0.7" fill="url(#spOakTimberGrad)" stroke="#1f1105" strokeWidth="0.8" />
        <line x1="-2.5" y1="-24.5" x2="-2.5" y2="-0.5" stroke="url(#spOakHighlightGrad)" strokeWidth="1.3" opacity="0.8" />
        <line x1="-3.5" y1="-0.8" x2="3.5" y2="-0.8" stroke="#22150a" strokeWidth="0.8" />
        <circle cx="-1.5" cy="-0.8" r="0.4" fill="#9ca3af" />
        <circle cx="1.5" cy="-0.8" r="0.4" fill="#9ca3af" />
        <polygon points="-3.5,-25 0,-29 3.5,-25" fill="url(#spOakTopGrad)" stroke="#1f1105" strokeWidth="0.6" />
        {/* 生根青草叶 */}
        <path d="M-4.2,2.6 Q-3.2,0.2 -1.8,1.4" stroke="#4d7c0f" strokeWidth="0.95" fill="none" strokeLinecap="round" />
        <path d="M2.2,2.8 Q3.6,0.6 4.6,1.8" stroke="#365314" strokeWidth="0.85" fill="none" strokeLinecap="round" />
        <circle cx="3.2" cy="2.2" r="0.9" fill="#365314" opacity="0.65" />
      </g>

      {/* --- E. 经典五杠原木牧场门与扇形地面磨损痕 (5-Bar Gate) --- */}
      <g
        {...svgAction('羊圈原木五杠门')}
        id="east-5bar-pasture-gate"
        className="cursor-pointer group/gate"
        onClick={handleGateClick}
        onMouseEnter={() => setHoveredObject?.({ kind: 'entity', id: 'pasture-gate' })}
        onMouseLeave={() => setHoveredObject?.(null)}
      >
        {/* 扇形开合踩踏磨损痕 */}
        <path
          d="M25,51.8 Q18,36 2,21"
          stroke="#4e3e29"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.22"
        />

        {/* 左侧悬挂门柱 (Hanging Post at -45, 31.8 · 稳固承重柱础) */}
        <g id="gate-hanging-post" transform="translate(-45, 31.8)">
          <ellipse cx="0" cy="1.8" rx="5.2" ry="2.4" fill="#12180d" opacity="0.42" />
          <path
            d="M-4.6,0 C-4.6,2.0 4.6,2.0 4.6,0 L4.6,2.2 C4.6,4.0 -4.6,4.0 -4.6,2.2 Z"
            fill="url(#spPlinthBodyGrad)"
            stroke="#221a13"
            strokeWidth="0.5"
          />
          <ellipse cx="0" cy="0" rx="4.6" ry="1.9" fill="url(#spPlinthTopGrad)" stroke="#221a13" strokeWidth="0.55" />
          <path d="M-4.0,0.3 Q0,1.7 4.0,0.3" stroke="#9e917d" strokeWidth="0.65" fill="none" opacity="0.8" />
          <rect x="-3.5" y="-26" width="7" height="26" rx="0.8" fill="url(#spOakTimberGrad)" stroke="#1e1005" strokeWidth="0.85" />
          <line x1="-2.5" y1="-25.5" x2="-2.5" y2="-0.5" stroke="url(#spOakHighlightGrad)" strokeWidth="1.3" opacity="0.8" />
          <line x1="-3.5" y1="-0.8" x2="3.5" y2="-0.8" stroke="#22150a" strokeWidth="0.8" />
          <polygon points="-3.5,-26 0,-30 3.5,-26" fill="url(#spOakTopGrad)" stroke="#1e1005" strokeWidth="0.6" />

          {/* 锻铁粗铰链带与铆钉 */}
          <rect x="-4.5" y="-20" width="9" height="3.2" rx="0.6" fill="#1f2937" />
          <rect x="-4.5" y="-7" width="9" height="3.2" rx="0.6" fill="#1f2937" />
          <circle cx="0" cy="-18.4" r="0.75" fill="#9ca3af" />
          <circle cx="0" cy="-5.4" r="0.75" fill="#9ca3af" />
          <path d="M-3.5,2.4 Q-2.5,0.4 -1.2,1.4" stroke="#4d7c0f" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        </g>

        {/* 2.5D 等轴测旋转门扇 */}
        {(() => {
          const hinge = { x: -45, y: 31.8 };
          const end = isGateOpen ? { x: 2, y: 21 } : { x: 25, y: 51.8 };
          const dx = end.x - hinge.x;
          const dy = end.y - hinge.y;

          return (
            <g
              id="gate-leaf-geometry"
              style={{
                transition: 'all 0.45s cubic-bezier(0.34, 1.25, 0.64, 1)',
              }}
            >
              {/* 门扇地面投影 */}
              <ellipse
                cx={(hinge.x + end.x) / 2}
                cy={(hinge.y + end.y) / 2 + 1.5}
                rx={Math.hypot(dx, dy) * 0.48}
                ry="3.6"
                fill="#12180d"
                opacity="0.22"
              />

              {/* 5 根加厚实木横梁 */}
              {[
                { yOff: -22, w: 3.8, col: '#7a522a' },
                { yOff: -16.5, w: 2.6, col: '#633e1d' },
                { yOff: -11, w: 2.6, col: '#633e1d' },
                { yOff: -5.5, w: 2.6, col: '#633e1d' },
                { yOff: 0, w: 2.8, col: '#45270f' },
              ].map((rail, i) => (
                <g key={`gate-r-${i}`}>
                  <line
                    x1={hinge.x + 2}
                    y1={hinge.y + rail.yOff}
                    x2={end.x - 2}
                    y2={end.y + rail.yOff}
                    stroke={rail.col}
                    strokeWidth={rail.w}
                    strokeLinecap="round"
                  />
                  <line
                    x1={hinge.x + 3}
                    y1={hinge.y + rail.yOff - rail.w * 0.22}
                    x2={end.x - 3}
                    y2={end.y + rail.yOff - rail.w * 0.22}
                    stroke="#9a693b"
                    strokeWidth={rail.w * 0.35}
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                </g>
              ))}

              {/* 经典英式斜撑木 */}
              <line
                x1={hinge.x + 3}
                y1={hinge.y}
                x2={end.x - 3}
                y2={end.y - 22}
                stroke="#5c3818"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <line
                x1={hinge.x + 3.5}
                y1={hinge.y - 0.7}
                x2={end.x - 3.5}
                y2={end.y - 22.7}
                stroke="#8c582a"
                strokeWidth="0.9"
                strokeLinecap="round"
                opacity="0.75"
              />

              {/* 中间加固纵立撑木 */}
              {(() => {
                const midX = (hinge.x + end.x) / 2;
                const midY = (hinge.y + end.y) / 2;
                return (
                  <line
                    x1={midX}
                    y1={midY - 23}
                    x2={midX}
                    y2={midY + 1}
                    stroke="#503115"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                );
              })()}

              {/* 门扇末端立木 */}
              <rect
                x={end.x - 4.5}
                y={end.y - 24}
                width="5.5"
                height="26"
                rx="0.7"
                fill="#442a14"
                stroke="#201206"
                strokeWidth="0.7"
              />

              {/* 锻铁门闩与插销 */}
              <path
                d={`M${end.x - 4},${end.y - 12} L${end.x + 3.5},${end.y - 12}`}
                stroke="#9ca3af"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <circle cx={end.x + 2.5} cy={end.y - 12} r="0.9" fill="#4b5563" />
            </g>
          );
        })()}

        {/* 右侧关门立柱 (Shutting Post at 25, 51.8 · 柱础受力底座) */}
        <g id="gate-shutting-post" transform="translate(25, 51.8)">
          <ellipse cx="0" cy="1.8" rx="5.0" ry="2.4" fill="#12180d" opacity="0.42" />
          <path
            d="M-4.4,0 C-4.4,2.0 4.4,2.0 4.4,0 L4.4,2.2 C4.4,4.0 -4.4,4.0 -4.4,2.2 Z"
            fill="url(#spPlinthBodyGrad)"
            stroke="#221a13"
            strokeWidth="0.5"
          />
          <ellipse cx="0" cy="0" rx="4.4" ry="1.9" fill="url(#spPlinthTopGrad)" stroke="#221a13" strokeWidth="0.55" />
          <path d="M-3.8,0.3 Q0,1.7 3.8,0.3" stroke="#9e917d" strokeWidth="0.65" fill="none" opacity="0.8" />
          <rect x="-3" y="-25" width="6" height="25" rx="0.8" fill="url(#spOakTimberGrad)" stroke="#1e1005" strokeWidth="0.8" />
          <line x1="-2.2" y1="-24.5" x2="-2.2" y2="-0.5" stroke="url(#spOakHighlightGrad)" strokeWidth="1.2" opacity="0.8" />
          <line x1="-3" y1="-0.8" x2="3" y2="-0.8" stroke="#22150a" strokeWidth="0.8" />
          <polygon points="-3,-25 0,-29 3,-25" fill="url(#spOakTopGrad)" stroke="#1e1005" strokeWidth="0.6" />
          <rect x="-4" y="-14" width="3" height="4.5" rx="0.5" fill="#374151" />
          <path d="M2.5,2.4 Q3.4,0.5 4.2,1.5" stroke="#4d7c0f" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 11. 温馨交互对白气泡 (Speech Bubble for Sheep in Pen)                      */}
      {/* ========================================================================= */}
      {sheepSaying && (
        <g
          transform={
            activeSheep === 'mother'
              ? 'translate(174, -46)'
              : activeSheep === 'peeking'
              ? 'translate(-62, 24)'
              : 'translate(85, 2)'
          }
        >
          <g className="animate-bounce pointer-events-none">
            <rect
              x="-92"
              y="-13"
              width="184"
              height="26"
              rx="13"
              fill="#1c1917"
              opacity="0.96"
              stroke="#f59e0b"
              strokeWidth="0.9"
            />
            <polygon points="0,13 -3,17 3,13" fill="#1c1917" />
            <text x="0" y="4.5" fill="#fef3c7" fontSize="8" fontWeight="bold" textAnchor="middle">
              {sheepSaying}
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

