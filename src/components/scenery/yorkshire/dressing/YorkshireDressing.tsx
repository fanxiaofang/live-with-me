import React, { useState } from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';

/**
 * 🐑 YorkshireDressing (Swaledale Sheep Flock, Meadow Dressing & The Guardian Heritage Tree)
 *
 * Layer: 06 DRESSING
 * Spatial Region: YORKSHIRE_LAYOUT.foregroundSlope.sheepFlock & right open meadow
 *
 * Features:
 * - 5 interactive Swaledale sheep with quotes, click animations & speech bubbles
 * - 🌳 庄园百年守护树 (The Heritage Guardian Tree): 造型独特、极具故事性与视觉平衡的百年老橡树，带斑驳树荫、铜制风铃、木牌与微风落叶
 */
export const YorkshireDressing: React.FC<YorkshireCommonProps> = ({
  onTriggerToast,
  setHoveredObject,
  className,
}) => {
  const [activeSheepIndex, setActiveSheepIndex] = useState<number | null>(null);
  const [sheepSaying, setSheepSaying] = useState<string | null>(null);

  // 守护古树状态管理
  const [guardianTreeSaying, setGuardianTreeSaying] = useState<string | null>(null);
  const [isTreeRustling, setIsTreeRustling] = useState(false);

  const sheepQuotes = [
    '🐑 咩~ 这里的牧草带着清晨甘露，真甜！',
    '🐑 咩咩~ 阳光晒在毛茸茸的身上好舒服。',
    '🐑 咩~ 坐在石墙边，看远处的蒸汽小火车开过去。',
    '🐑 咩~ 午后微风吹过草甸，适合打个舒服的盹。',
    '🐑 咩咩~ 慢慢来，生活本就该像流云一样从容。',
  ];

  const treeQuotes = [
    '🌳 守护古树在微风中沙沙作响，送来阳光、泥土与青草的气息...',
    '🍃 枝叶轻拂过远山与流云，无论走得多远，这里的绿荫总在静静等候。',
    '✨ 树梢的风铃叮咚作响，每一片落叶都是写给大自然的晚安信。',
    '🌳 百年年轮见证着每一个平凡安宁的午后，愿你也拥有从容与温柔。',
    '🍃 阳光穿透树冠洒下斑驳光斑，树下的草地永远为你留着最舒服的位置。',
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

  const handleTreeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTreeRustling(true);
    const randomQuote = treeQuotes[Math.floor(Math.random() * treeQuotes.length)];
    setGuardianTreeSaying(randomQuote);
    onTriggerToast?.(randomQuote);

    setTimeout(() => {
      setIsTreeRustling(false);
    }, 1200);

    setTimeout(() => {
      setGuardianTreeSaying(null);
    }, 5500);
  };

  return (
    <g id="yorkshire-sheep-flock-and-dressing" className={className}>
      <defs>
        {/* 蓬松米白羊毛体 (Cream White Wool) */}
        <linearGradient id="ysSheepWoolGradV2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffdfa" />
          <stop offset="55%" stopColor="#f3ede2" />
          <stop offset="100%" stopColor="#ded5c4" />
        </linearGradient>

        {/* 守护古树粗壮树干皮层渐变 (Weathered Heritage Oak Bark) */}
        <linearGradient id="guardianTreeBarkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2c1a0e" />
          <stop offset="35%" stopColor="#452c1a" />
          <stop offset="70%" stopColor="#362012" />
          <stop offset="100%" stopColor="#1f1208" />
        </linearGradient>

        {/* 树荫斑驳漫反射光晕 */}
        <radialGradient id="guardianCanopyShadowRadial" cx="45%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#0f1a0e" stopOpacity="0.52" />
          <stop offset="60%" stopColor="#142413" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#142413" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ========================================================================= */}
      {/* 🌳 庄园百年守护树 (The Heritage Guardian Tree · 前景右侧草地上的核心视觉焦点) */}
      {/*    位置：右侧向阳开阔草甸 (x: 710, y: 520)，平衡构图，打破右侧单调，富有诗意故事性 */}
      {/* ========================================================================= */}
      <g
        id="guardian-heritage-tree"
        transform="translate(710, 520) scale(1.08)"
        className="cursor-pointer group/tree"
        onClick={handleTreeClick}
        onMouseEnter={() => setHoveredObject?.('🌳 庄园百年守护树 · 见证岁月流转的古橡树（点击轻拂树梢听风）')}
        onMouseLeave={() => setHoveredObject?.(null)}
      >
        {/* 1. 树下广袤斑驳树荫 (Dappled Tree Canopy Ground Shadow) */}
        <ellipse cx="6" cy="46" rx="68" ry="20" fill="url(#guardianCanopyShadowRadial)" />
        <ellipse cx="-12" cy="44" rx="42" ry="14" fill="#132212" opacity="0.38" />
        {/* 树荫下穿透的金色光斑 (Sunlight Dappling) */}
        <ellipse cx="22" cy="42" rx="10" ry="4.5" fill="#a8cf58" opacity="0.28" />
        <ellipse cx="-20" cy="45" rx="7" ry="3.2" fill="#a8cf58" opacity="0.22" />
        <ellipse cx="8" cy="48" rx="6" ry="2.8" fill="#a8cf58" opacity="0.25" />

        {/* 2. 牢牢扎入沃土的苍劲树根 (Gnarled Root System) */}
        <g id="guardian-tree-roots">
          <path d="M-18,42 Q-36,46 -52,48" stroke="#2a180e" strokeWidth="4.2" strokeLinecap="round" fill="none" />
          <path d="M-12,44 Q-24,50 -38,53" stroke="#362012" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d="M16,42 Q32,46 48,47" stroke="#2a180e" strokeWidth="4.0" strokeLinecap="round" fill="none" />
          <path d="M12,44 Q22,50 34,52" stroke="#382214" strokeWidth="3.0" strokeLinecap="round" fill="none" />
          <path d="M-2,46 Q2,54 8,56" stroke="#24140a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          
          {/* 树根旁生机小雏菊与绿苔 (Moss & Daisies at tree base) */}
          <ellipse cx="-24" cy="45" rx="8" ry="3.5" fill="#2d4a23" opacity="0.85" />
          <ellipse cx="26" cy="46" rx="7" ry="3" fill="#2d4a23" opacity="0.8" />
          <circle cx="-28" cy="44" r="2.2" fill="#ffffff" />
          <circle cx="-28" cy="44" r="0.8" fill="#facc15" />
          <circle cx="-21" cy="46" r="1.8" fill="#ffffff" />
          <circle cx="-21" cy="46" r="0.7" fill="#facc15" />
          <circle cx="28" cy="45" r="2.0" fill="#fef08a" />
          <circle cx="28" cy="45" r="0.8" fill="#ca8a04" />
        </g>

        {/* 3. 苍劲古老主树干与伸展大枝 (Stately Ancient Oak Trunk & Sprawling Limbs) */}
        <g id="guardian-tree-trunk">
          {/* 主树干外轮廓 */}
          <path
            d="M-18,44 C-16,22 -12,-8 -22,-38 L-6,-38 C-2,-14 6,10 16,44 Z"
            fill="url(#guardianTreeBarkGrad)"
            stroke="#1c1007"
            strokeWidth="1.2"
          />
          {/* 右主分枝 (向右上方遒劲舒展) */}
          <path
            d="M2,-12 Q18,-24 38,-35 L44,-28 Q24,-16 8,6 Z"
            fill="#382213"
            stroke="#1c1007"
            strokeWidth="0.9"
          />
          {/* 左副分枝 (向左上方微垂承托) */}
          <path
            d="M-10,-6 Q-26,-16 -42,-22 L-40,-28 Q-22,-20 -8,-18 Z"
            fill="#321e10"
            stroke="#1c1007"
            strokeWidth="0.9"
          />

          {/* 树皮深邃木纹与自然光影 (Bark Grain Lines & Knots) */}
          <path d="M-8,38 Q-5,12 -9,-18" stroke="#5a381f" strokeWidth="1.6" fill="none" opacity="0.75" />
          <path d="M3,36 Q0,14 6,-8" stroke="#5a381f" strokeWidth="1.4" fill="none" opacity="0.75" />
          <line x1="-12" y1="28" x2="-10" y2="4" stroke="#24140a" strokeWidth="1.2" />
          <line x1="8" y1="24" x2="10" y2="2" stroke="#24140a" strokeWidth="1.2" />
          
          {/* 树干天然树洞与树瘤 (Characterful Tree Knot Hollow) */}
          <ellipse cx="-2" cy="14" rx="3.5" ry="5.5" fill="#140b05" stroke="#482b15" strokeWidth="0.8" />
          <ellipse cx="-2" cy="14" rx="2.2" ry="3.8" fill="#0a0502" />
          <ellipse cx="-2" cy="12" rx="1.2" ry="1.8" fill="#2d1c0e" opacity="0.6" />
        </g>

        {/* 4. 丰茂轻盈、层叠舒展的古树叶冠 (Multi-Tiered Layered Foliage Canopy) */}
        {/*    采用吉卜力与万物生灵经典饱满云团风格，点击时伴随微风自然摇曳 */}
        <g
          id="guardian-tree-canopy"
          className={isTreeRustling ? 'transition-transform duration-300 scale-[1.03] origin-bottom' : 'transition-transform duration-700 scale-100 origin-bottom'}
        >
          {/* --- 底层深邃阴影层 (Deep Under-canopy) --- */}
          <ellipse cx="-34" cy="-42" rx="32" ry="24" fill="#182e1d" />
          <ellipse cx="36" cy="-40" rx="34" ry="25" fill="#182e1d" />
          <ellipse cx="0" cy="-62" rx="38" ry="28" fill="#1b3320" />

          {/* --- 中层饱满苍翠冠体 (Rich Midtone Foliage Masses) --- */}
          <ellipse cx="-42" cy="-56" rx="34" ry="25" fill="#274b2f" />
          <ellipse cx="38" cy="-54" rx="36" ry="26" fill="#2e5737" />
          <ellipse cx="-16" cy="-76" rx="36" ry="26" fill="#35633e" />
          <ellipse cx="22" cy="-74" rx="36" ry="26" fill="#3b6e45" />
          <ellipse cx="0" cy="-90" rx="38" ry="28" fill="#427a4e" />

          {/* --- 前景向阳暖金绿微光云团 (Sunlit Foliage Crests & Golden Edge Highlights) --- */}
          <ellipse cx="-28" cy="-86" rx="28" ry="20" fill="#4d8c5a" />
          <ellipse cx="26" cy="-82" rx="28" ry="20" fill="#559963" />
          <ellipse cx="-8" cy="-104" rx="28" ry="19" fill="#5ea86e" />
          <ellipse cx="14" cy="-100" rx="26" ry="18" fill="#67b779" />
          <ellipse cx="2" cy="-114" rx="22" ry="15" fill="#78c98b" />
          
          {/* 树冠向阳顶端亮金微反光 (Sun-drenched Leaf Shimmer) */}
          <ellipse cx="-4" cy="-118" rx="14" ry="8" fill="#93e0a5" opacity="0.7" />
          <circle cx="8" cy="-112" r="7" fill="#88d89a" opacity="0.65" />
          <circle cx="-16" cy="-98" r="6" fill="#75c587" opacity="0.6" />
        </g>

        {/* 5. 守护树的诗意小信物 (The Tree's Storytelling Trinkets) */}
        {/* A. 挂在分枝上的复古黄铜微风小风铃 (Brass Wind Chime) */}
        <g id="guardian-tree-chime" transform="translate(-28, -20)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#8c6d3b" strokeWidth="0.8" />
          <circle cx="0" cy="8" r="1.8" fill="#d97706" />
          <line x1="-2" y1="8" x2="-2" y2="16" stroke="#fcd34d" strokeWidth="0.9" />
          <line x1="0" y1="8" x2="0" y2="19" stroke="#f59e0b" strokeWidth="1.0" />
          <line x1="2" y1="8" x2="2" y2="15" stroke="#fcd34d" strokeWidth="0.9" />
          <circle cx="0" cy="21" r="1.2" fill="#ef4444" />
        </g>

        {/* B. 树干上系着的精致手作木牌: "守护之树 · 1892" (Weathered Heritage Plaque) */}
        <g id="guardian-tree-sign" transform="translate(18, -12) rotate(6)">
          <line x1="-10" y1="-4" x2="-6" y2="0" stroke="#785532" strokeWidth="0.8" />
          <line x1="10" y1="-4" x2="6" y2="0" stroke="#785532" strokeWidth="0.8" />
          <rect x="-14" y="0" width="28" height="13" rx="2" fill="#eedcc5" stroke="#6b4624" strokeWidth="0.9" />
          <text x="0" y="8.5" fill="#4a2e16" fontSize="5.2" fontWeight="bold" textAnchor="middle">
            守护之树
          </text>
        </g>

        {/* C. 树梢歇脚的英伦小知更鸟 (Little Perched Songbird) */}
        <g id="guardian-tree-bird" transform="translate(36, -38)">
          <ellipse cx="0" cy="0" rx="3.5" ry="2.5" fill="#784b28" />
          <circle cx="2.5" cy="-1.5" r="2.0" fill="#a05d32" />
          <ellipse cx="2.5" cy="0.5" rx="1.8" ry="1.5" fill="#e05a38" /> {/* 暖橙胸脯 */}
          <polygon points="4.5,-1.5 7,-1 4.5,-0.5" fill="#d97706" /> {/* 鸟喙 */}
          <line x1="-3" y1="1" x2="-6" y2="3" stroke="#4a2e16" strokeWidth="0.9" /> {/* 尾羽 */}
          <circle cx="3.2" cy="-2" r="0.45" fill="#ffffff" />
          <circle cx="3.3" cy="-2" r="0.25" fill="#000000" />
        </g>

        {/* D. 微风中从树冠飘散的金色小落叶 (Drifting Leaves) */}
        <g id="guardian-drifting-leaves" opacity="0.85">
          <ellipse cx="-48" cy="-12" rx="2.5" ry="1.4" fill="#86efac" transform="rotate(25 -48 -12)" className="animate-pulse" />
          <ellipse cx="54" cy="-18" rx="2.8" ry="1.5" fill="#facc15" transform="rotate(-35 54 -18)" className="animate-bounce" />
          <ellipse cx="38" cy="18" rx="2.2" ry="1.2" fill="#86efac" transform="rotate(15 38 18)" />
          <ellipse cx="-32" cy="24" rx="2.4" ry="1.3" fill="#facc15" transform="rotate(-20 -32 24)" />
        </g>

        {/* 6. 点击树木时弹出的温情故事气泡 (Guardian Tree Speech/Story Bubble) */}
        {guardianTreeSaying && (
          <g transform="translate(0, -145)" className="animate-bounce pointer-events-none">
            <rect
              x="-90"
              y="-14"
              width="180"
              height="28"
              rx="14"
              fill="#1c1917"
              opacity="0.96"
              stroke="#22c55e"
              strokeWidth="1.2"
            />
            <polygon points="0,14 -4,19 4,14" fill="#1c1917" />
            <text x="0" y="4" fill="#dcfce7" fontSize="8.2" fontWeight="bold" textAnchor="middle">
              {guardianTreeSaying}
            </text>
          </g>
        )}
      </g>

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

export const YorkshireSheepFlock = YorkshireDressing;

