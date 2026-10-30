import React, { useState } from 'react';
import { useTimerScope } from '../../../../shared/timers/useTimerScope';
import { svgAction } from '../../../../world/interactions/svgAction';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';
import { guardianTreePalette, OsmanthusWood, OsmanthusCanopy, OsmanthusSwing, OsmanthusRootGrass } from '../vegetation/GuardianOsmanthus';

/**
 * 🐑 YorkshireDressing (Swaledale Sheep Flock, Meadow Dressing & The Guardian Heritage Tree)
 *
 * Layer: 06 DRESSING
 * Spatial Region: foreground meadow, with the guardian tree on the southwest slope.
 *
 * Features:
 * - 5 interactive Swaledale sheep with quotes, click animations & speech bubbles
 * - 🌳 庄园百年守护树 (The Heritage Guardian Tree): 造型独特、极具故事性与视觉平衡的成年桂花树，带斑驳树荫、铜制风铃、木牌与微风落叶
 */
export const YorkshireDressing: React.FC<YorkshireCommonProps> = ({
  theme,
  onTriggerToast,
  setHoveredObject,
  className,
}) => {
  const timers = useTimerScope();
  const tree = YORKSHIRE_LAYOUT.guardianTree;
  const treePalette = guardianTreePalette(theme);
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
    '🌳 守护古树在微风中沙沙作响，送来桂花、泥土与青草的气息...',
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

    timers.schedule('feedback-0', () => {
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

    timers.schedule('feedback-1', () => {
      setIsTreeRustling(false);
    }, 1200);

    timers.schedule('feedback-2', () => {
      setGuardianTreeSaying(null);
    }, 5500);
  };

  return (
    <g id="yorkshire-sheep-flock-and-dressing" className={className}>
      <style>{`
        .guardian-osmanthus-canopy { transform-origin: -10px -45px; transition: transform 700ms ease-out; }
        .guardian-osmanthus-canopy[data-rustling="true"] { transform: rotate(-1.2deg); transition-duration: 300ms; }
        @media (prefers-reduced-motion: reduce) {
          .guardian-osmanthus-canopy { transition: none; transform: none !important; }
          #guardian-heritage-tree .animate-pulse, #guardian-heritage-tree .animate-bounce { animation: none; }
        }
      `}</style>
      <defs>
        {/* 蓬松米白羊毛体 (Cream White Wool) */}
        <linearGradient id="ysSheepWoolGradV2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffdfa" />
          <stop offset="55%" stopColor="#f3ede2" />
          <stop offset="100%" stopColor="#ded5c4" />
        </linearGradient>

        {/* 树荫斑驳漫反射光晕 */}
        <radialGradient id="guardianCanopyShadowRadial" cx="45%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#0f1a0e" stopOpacity="0.27" />
          <stop offset="60%" stopColor="#142413" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#142413" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ========================================================================= */}
      {/* 左前方守护树；根部约在 y=613–628，避开全景底栏并承接较低的树下缓坡。 */}
      {/* ========================================================================= */}
      <g {...svgAction('桂花守护树，轻拂树梢听风')}
        id="guardian-heritage-tree"
        data-tree-species="osmanthus"
        transform={`translate(${tree.position.x}, ${tree.position.y}) scale(${tree.scale})`}
        className="cursor-pointer group/tree"
        onClick={handleTreeClick}
        onMouseEnter={() => setHoveredObject?.({ kind: 'entity', id: 'guardian-tree' })}
        onMouseLeave={() => setHoveredObject?.(null)}
      >
        {/* 1. 树下广袤斑驳树荫 (Dappled Tree Canopy Ground Shadow) */}
        <ellipse cx="6" cy="46" rx="68" ry="20" fill="url(#guardianCanopyShadowRadial)" />
        <path id="guardian-root-contact" d="M-23,46 Q-15,41 -7,44 Q2,42 14,47 L19,49 Q6,53 -6,51 Q-18,53 -28,49Z" fill={treePalette.deep} opacity=".28" />
        <OsmanthusWood palette={treePalette} />
        <OsmanthusRootGrass theme={theme} />
        <OsmanthusSwing palette={treePalette} />
        <OsmanthusCanopy palette={treePalette} rustling={isTreeRustling} />

        {/* 5. 守护树的诗意小信物 (The Tree's Storytelling Trinkets) */}
        {/* A. 挂在分枝上的复古黄铜微风小风铃 (Brass Wind Chime) */}
        <g id="guardian-tree-chime" transform="translate(-48, -50)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#8c6d3b" strokeWidth="0.8" />
          <circle cx="0" cy="8" r="1.8" fill="#d97706" />
          <line x1="-2" y1="8" x2="-2" y2="16" stroke="#fcd34d" strokeWidth="0.9" />
          <line x1="0" y1="8" x2="0" y2="19" stroke="#f59e0b" strokeWidth="1.0" />
          <line x1="2" y1="8" x2="2" y2="15" stroke="#fcd34d" strokeWidth="0.9" />
          <circle cx="0" cy="21" r="1.2" fill="#ef4444" />
        </g>

        {/* B. 树干上系着的精致手作木牌: "守护之树 · 1892" (Weathered Heritage Plaque) */}
        <g id="guardian-tree-sign" transform="translate(-16, -7) rotate(-6)">
          <line x1="-10" y1="-4" x2="-6" y2="0" stroke="#785532" strokeWidth="0.8" />
          <line x1="10" y1="-4" x2="6" y2="0" stroke="#785532" strokeWidth="0.8" />
          <rect x="-14" y="0" width="28" height="13" rx="2" fill="#eedcc5" stroke="#6b4624" strokeWidth="0.9" />
          <text x="0" y="8.5" fill="#4a2e16" fontSize="5.2" fontWeight="bold" textAnchor="middle">
            守护之树
          </text>
        </g>

        {/* C. 树梢歇脚的英伦小知更鸟 (Little Perched Songbird) */}
        <g id="guardian-tree-bird" transform="translate(68, -54)">
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
          <ellipse cx="-48" cy="-12" rx="2.5" ry="1.4" fill={treePalette.tip} transform="rotate(25 -48 -12)" className="animate-pulse" />
          <ellipse cx="54" cy="-18" rx="2.8" ry="1.5" fill={treePalette.flowerLight} transform="rotate(-35 54 -18)" className="animate-bounce" />
          <ellipse cx="38" cy="18" rx="2.2" ry="1.2" fill={treePalette.tip} transform="rotate(15 38 18)" />
          <ellipse cx="-32" cy="24" rx="2.4" ry="1.3" fill={treePalette.flowerLight} transform="rotate(-20 -32 24)" />
        </g>

        {/* 6. 点击树木时弹出的温情故事气泡 (Guardian Tree Speech/Story Bubble) */}
        {guardianTreeSaying && (
          <g transform="translate(0, -163)"><g  className="animate-bounce pointer-events-none">
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
          </g></g>
        )}
      </g>


      {/* 🐑 Sheep 1: 西侧河畔开阔草场啃草羊 (x: -420, y: 460) */}
      <g {...svgAction('sheep-1')}
        id="sheep-1"
        transform="translate(-420, 460) scale(0.95)"
        className="cursor-pointer group/sheep"
        onClick={(e) => handleSheepClick(0, e)}
        onMouseEnter={() => setHoveredObject?.({ kind: 'entity', id: 'sheep-0' })}
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
          <g transform="translate(0, -32)"><g  className="animate-bounce pointer-events-none">
            <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#1c1917" opacity="0.95" stroke="#f59e0b" strokeWidth="0.8" />
            <text x="0" y="4" fill="#fef3c7" fontSize="8.5" fontWeight="bold" textAnchor="middle">{sheepSaying}</text>
          </g></g>
        )}
      </g>

      {/* 🐑 Sheep 2: 主屋台地前方中景草场安睡羊 (x: -50, y: 610) */}
      <g {...svgAction('sheep-2')}
        id="sheep-2"
        transform="translate(-50, 610) scale(1.0)"
        className="cursor-pointer group/sheep"
        onClick={(e) => handleSheepClick(1, e)}
        onMouseEnter={() => setHoveredObject?.({ kind: 'entity', id: 'sheep-1' })}
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
          {/* Tranquil Slumber Bubbles (静谧睡眠气泡) */}
          <g className="pointer-events-none" id="sheep-slumber-bubbles">
            <g className="animate-sleep-bubble-1">
              <circle cx="-6" cy="-6" r="1.8" fill="#fef08a" opacity="0.75" />
              <circle cx="-6.4" cy="-6.5" r="0.55" fill="#ffffff" opacity="0.9" />
            </g>
            <g className="animate-sleep-bubble-2">
              <circle cx="-3" cy="-12" r="2.6" fill="#fde68a" opacity="0.7" />
              <circle cx="-3.6" cy="-12.6" r="0.8" fill="#ffffff" opacity="0.9" />
            </g>
            <g className="animate-sleep-bubble-3">
              <circle cx="1" cy="-18" r="3.4" fill="#fef3c7" opacity="0.6" />
              <circle cx="0.2" cy="-18.8" r="1.0" fill="#ffffff" opacity="0.85" />
            </g>
          </g>
        </g>
        {activeSheepIndex === 1 && sheepSaying && (
          <g transform="translate(0, -32)"><g  className="animate-bounce pointer-events-none">
            <rect x="-70" y="-12" width="140" height="24" rx="12" fill="#1c1917" opacity="0.95" stroke="#f59e0b" strokeWidth="0.8" />
            <text x="0" y="4" fill="#fef3c7" fontSize="8.5" fontWeight="bold" textAnchor="middle">{sheepSaying}</text>
          </g></g>
        )}
      </g>

      {/* 母子羊移至右前方开阔草地，避开左前方树冠并留出中央前院。 */}
      <g id="sheep-mother-and-lamb-group">
        <g {...svgAction('sheep-3')}
          id="sheep-3"
          transform="translate(735, 575) scale(1.0)"
          className="cursor-pointer group/sheep"
          onClick={(e) => handleSheepClick(2, e)}
          onMouseEnter={() => setHoveredObject?.({ kind: 'entity', id: 'sheep-2' })}
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
            <g transform="translate(0, -34)"><g  className="animate-bounce pointer-events-none">
              <rect x="-70" y="-12" width="140" height="24" rx="12" fill="#1c1917" opacity="0.95" stroke="#f59e0b" strokeWidth="0.8" />
              <text x="0" y="4" fill="#fef3c7" fontSize="8.5" fontWeight="bold" textAnchor="middle">{sheepSaying}</text>
            </g></g>
          )}
        </g>

        {/* 欢脱小羊羔 */}
        <g {...svgAction('sheep-4')}
          id="sheep-4"
          transform="translate(790, 595) scale(0.68)"
          className="cursor-pointer group/sheep"
          onClick={(e) => handleSheepClick(3, e)}
          onMouseEnter={() => setHoveredObject?.({ kind: 'entity', id: 'sheep-3' })}
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
            <g transform="translate(0, -32)"><g  className="animate-bounce pointer-events-none">
              <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#1c1917" opacity="0.95" stroke="#f59e0b" strokeWidth="0.8" />
              <text x="0" y="4" fill="#fef3c7" fontSize="8.5" fontWeight="bold" textAnchor="middle">{sheepSaying}</text>
            </g></g>
          )}
        </g>
      </g>

      {/* 🐑 Sheep 5: 右上山麓石墙边探头小羊 (x: 640, y: 420) */}
      <g {...svgAction('sheep-5')}
        id="sheep-5"
        transform="translate(640, 420) scale(0.75)"
        className="cursor-pointer group/sheep"
        onClick={(e) => handleSheepClick(4, e)}
        onMouseEnter={() => setHoveredObject?.({ kind: 'entity', id: 'sheep-4' })}
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
          <g transform="translate(0, -32)"><g  className="animate-bounce pointer-events-none">
            <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#1c1917" opacity="0.95" stroke="#f59e0b" strokeWidth="0.8" />
            <text x="0" y="4" fill="#fef3c7" fontSize="8.5" fontWeight="bold" textAnchor="middle">{sheepSaying}</text>
          </g></g>
        )}
      </g>
    </g>
  );
};

export const YorkshireSheepFlock = YorkshireDressing;

