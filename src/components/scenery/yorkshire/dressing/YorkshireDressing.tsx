import React, { useState } from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';

/**
 * 🐑 YorkshireDressing (Swaledale Sheep Flock & Meadow Dressing)
 *
 * Layer: 06 DRESSING
 * Spatial Region: YORKSHIRE_LAYOUT.foregroundSlope.sheepFlock
 *
 * Preserves the 5 Swaledale sheep with quotes, click interactions,
 * speech bubble popups, and hover text.
 */
export const YorkshireDressing: React.FC<YorkshireCommonProps> = ({
  onTriggerToast,
  setHoveredObject,
  className,
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
    <g id="yorkshire-sheep-flock-and-dressing" className={className}>
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

export const YorkshireSheepFlock = YorkshireDressing;
