import React from 'react';

export interface PicnicSpotAssetProps {
  x?: number;
  y?: number;
  scale?: number;
  showAppleTree?: boolean;
  onTriggerToast?: (msg: string) => void;
  onSelect?: () => void;
  className?: string;
}

/**
 * 🧺 约克郡草坡野餐与百年苹果树资产 (Countryside Picnic Spot & Gnarled Apple Tree Asset)
 * 保留资产：包含手绘红白格野餐布、柳条编织篮、陶土手冲热茶壶、大吉岭红茶杯、
 * 农夫酸面包与切片奶酪、宽檐编织草帽，以及苍劲老苹果树与繁茂绣球花丛。
 * 可在任何 2.5D/SVG 场景中作为微缩景观资产独立或组合调用。
 */
export const PicnicSpotAsset: React.FC<PicnicSpotAssetProps> = ({
  x = 0,
  y = 0,
  scale = 1.0,
  showAppleTree = true,
  onTriggerToast,
  onSelect,
  className = '',
}) => {
  return (
    <g
      id="asset-country-picnic-spot"
      transform={`translate(${x}, ${y}) scale(${scale})`}
      className={`group/picnic-asset ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
        onTriggerToast?.('🧺 阳光草坡野餐 · 刚沏好的大吉岭热红茶与现切乡村面包');
      }}
    >
      <defs>
        {/* Picnic Gingham Check Pattern */}
        <pattern
          id="assetPicnicGinghamPattern"
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(22)"
        >
          <rect width="14" height="14" fill="#fdfbf7" />
          <rect x="0" y="0" width="7" height="14" fill="#e25353" fillOpacity="0.45" />
          <rect x="0" y="0" width="14" height="7" fill="#e25353" fillOpacity="0.45" />
          <rect x="0" y="0" width="7" height="7" fill="#be123c" fillOpacity="0.72" />
        </pattern>

        {/* Apple Tree Bark Gradient */}
        <linearGradient id="assetAppleBarkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4a3220" />
          <stop offset="45%" stopColor="#322013" />
          <stop offset="100%" stopColor="#1e130a" />
        </linearGradient>

        {/* Apple Fruit Radial Highlight */}
        <radialGradient id="assetAppleFruitHighlight" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="25%" stopColor="#ef4444" />
          <stop offset="70%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
      </defs>

      {/* 1. COUNTRYSIDE PICNIC BLANKET & PROVISIONS */}
      <g id="picnic-blanket-provisions" className="cursor-pointer">
        {/* Ground Drop Shadow */}
        <polygon
          points="162,652 278,630 306,686 188,708"
          fill="#152113"
          opacity="0.38"
        />

        {/* Gingham Checked Picnic Blanket */}
        <polygon
          points="165,650 275,632 298,682 186,702"
          fill="url(#assetPicnicGinghamPattern)"
          stroke="#e2d6c3"
          strokeWidth="0.8"
        />

        {/* Blanket Hem Stitches */}
        <polygon
          points="167,651 273,634 296,680 188,699"
          fill="none"
          stroke="#c2410c"
          strokeWidth="0.6"
          strokeDasharray="3 2"
          opacity="0.5"
        />

        {/* Corner Weighting River Pebbles */}
        <ellipse cx="168" cy="652" rx="3.5" ry="2" fill="#7a6c5a" stroke="#483d31" strokeWidth="0.4" />
        <ellipse cx="272" cy="634" rx="4" ry="2.2" fill="#8c7d6b" stroke="#483d31" strokeWidth="0.4" />
        <ellipse cx="295" cy="680" rx="3.8" ry="2" fill="#7a6c5a" stroke="#483d31" strokeWidth="0.4" />
        <ellipse cx="188" cy="700" rx="4.2" ry="2.2" fill="#8c7d6b" stroke="#483d31" strokeWidth="0.4" />

        {/* Woven Wicker Picnic Hamper */}
        <g transform="translate(255, 638)">
          <ellipse cx="8" cy="16" rx="14" ry="5" fill="#141f12" opacity="0.35" />
          <rect x="0" y="4" width="18" height="12" rx="2.5" fill="#b47b42" stroke="#694119" strokeWidth="0.8" />
          <line x1="4" y1="4" x2="4" y2="16" stroke="#875322" strokeWidth="0.8" />
          <line x1="9" y1="4" x2="9" y2="16" stroke="#875322" strokeWidth="0.8" />
          <line x1="14" y1="4" x2="14" y2="16" stroke="#875322" strokeWidth="0.8" />
          <line x1="0" y1="8" x2="18" y2="8" stroke="#875322" strokeWidth="0.8" />
          <line x1="0" y1="12" x2="18" y2="12" stroke="#875322" strokeWidth="0.8" />
          <polygon points="-2,4 10,-3 14,-2 2,5" fill="#a36b35" stroke="#5c3614" strokeWidth="0.7" />
          <polygon points="1,4 8,0 12,6 3,7" fill="#fffaf5" />
          <path d="M 3,4 Q 9,-4 15,4" fill="none" stroke="#694119" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Ceramic Teapot & Steaming Cups */}
        <g transform="translate(210, 656)">
          <ellipse cx="0" cy="5" rx="7" ry="3" fill="#182315" opacity="0.35" />
          <ellipse cx="0" cy="0" rx="6" ry="4.8" fill="#ea580c" stroke="#9a3412" strokeWidth="0.7" />
          <ellipse cx="0" cy="-4" rx="3.2" ry="1.4" fill="#fed7aa" stroke="#9a3412" strokeWidth="0.5" />
          <circle cx="0" cy="-5" r="0.9" fill="#c2410c" />
          <path d="M 5,-1 Q 9,-3 10,-5" fill="none" stroke="#9a3412" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M -5,1 Q -9,0 -7,-3 Q -5,-3 -5,-1" fill="none" stroke="#9a3412" strokeWidth="1.2" />
          <path
            d="M 10,-7 Q 12,-12 9,-16 Q 11,-20 8,-24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.65"
          />
          <g transform="translate(-10, 6)">
            <rect x="-2.5" y="-2" width="5" height="4" rx="1.2" fill="#fffaf0" stroke="#a89a85" strokeWidth="0.5" />
            <ellipse cx="0" cy="-2" rx="2.4" ry="1" fill="#92400e" />
          </g>
          <g transform="translate(10, 8)">
            <rect x="-2.5" y="-2" width="5" height="4" rx="1.2" fill="#fffaf0" stroke="#a89a85" strokeWidth="0.5" />
            <ellipse cx="0" cy="-2" rx="2.4" ry="1" fill="#92400e" />
          </g>
        </g>

        {/* Olive Wood Cutting Board with Sourdough & Cheese */}
        <g transform="translate(185, 672)">
          <polygon points="0,0 26,-6 32,8 6,14" fill="#a16207" stroke="#713f12" strokeWidth="0.7" />
          <polygon points="2,1 25,-5 29,7 7,12" fill="#ca8a04" />
          <ellipse cx="12" cy="3" rx="7" ry="4.5" fill="#b45309" stroke="#78350f" strokeWidth="0.7" />
          <path d="M 8,1 Q 12,5 16,1 M 9,5 Q 12,1 15,5" fill="none" stroke="#fde68a" strokeWidth="0.7" />
          <ellipse cx="23" cy="5" rx="3.5" ry="2.5" fill="#fef3c7" stroke="#92400e" strokeWidth="0.5" />
          <polygon points="20,8 26,6 28,11 21,12" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
        </g>

        {/* Straw Hat */}
        <g transform="translate(235, 680)">
          <ellipse cx="0" cy="2" rx="13" ry="6.5" fill="#152014" opacity="0.32" />
          <ellipse cx="0" cy="0" rx="12" ry="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.6" />
          <ellipse cx="0" cy="-1.5" rx="6" ry="3.5" fill="#eab308" stroke="#a16207" strokeWidth="0.6" />
          <ellipse cx="0" cy="-0.2" rx="6.2" ry="3.2" fill="none" stroke="#3f6212" strokeWidth="1.2" />
          <path d="M 5,2 Q 9,6 8,10" fill="none" stroke="#3f6212" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </g>

      {/* 2. GNARLED OLD ENGLISH APPLE TREE & HYDRANGEAS */}
      {showAppleTree && (
        <g id="gnarled-apple-tree" transform="translate(50, 680)">
          <ellipse cx="0" cy="48" rx="26" ry="8" fill="#10190e" opacity="0.45" />
          <path d="M -8,42 Q -22,48 -32,50 M 8,42 Q 20,47 28,49 M -2,44 Q -4,52 -6,56" stroke="#26170d" strokeWidth="2.8" strokeLinecap="round" />

          {/* Trunk */}
          <path
            d="M -12,45 C -16,20 -10,-5 0,-30 C 6,-46 16,-62 25,-85 L 36,-80 C 26,-58 14,-40 8,-20 C -2,5 -6,22 -2,45 Z"
            fill="url(#assetAppleBarkGrad)"
            stroke="#1c1209"
            strokeWidth="1.2"
          />
          <path
            d="M 6,-25 C 22,-28 45,-38 65,-50 L 68,-44 C 48,-32 24,-22 4,-18 Z"
            fill="url(#assetAppleBarkGrad)"
            stroke="#1c1209"
            strokeWidth="1.0"
          />
          <path d="M -8,30 Q -6,10 0,-10 Q 5,-32 18,-60" fill="none" stroke="#4d7c38" strokeWidth="1.4" opacity="0.75" />
          <path d="M -4,38 Q -2,15 4,-5" fill="none" stroke="#1c1209" strokeWidth="0.8" opacity="0.6" />

          {/* Foliage */}
          <g id="apple-foliage-masses">
            <ellipse cx="25" cy="-90" rx="36" ry="24" fill="#1b361c" />
            <ellipse cx="65" cy="-55" rx="28" ry="18" fill="#1b361c" />
            <ellipse cx="-15" cy="-70" rx="30" ry="20" fill="#1b361c" />
            <ellipse cx="22" cy="-95" rx="38" ry="26" fill="#2b522d" />
            <ellipse cx="68" cy="-58" rx="30" ry="20" fill="#2b522d" />
            <ellipse cx="-18" cy="-76" rx="32" ry="22" fill="#284e2a" />
            <ellipse cx="38" cy="-115" rx="32" ry="22" fill="#346337" />
            <ellipse cx="20" cy="-105" rx="30" ry="18" fill="#467e49" />
            <ellipse cx="62" cy="-68" rx="24" ry="15" fill="#467e49" />
            <ellipse cx="-12" cy="-85" rx="25" ry="16" fill="#407543" />
            <ellipse cx="35" cy="-125" rx="24" ry="15" fill="#589c5c" />
            <circle cx="28" cy="-132" r="8" fill="#6eb873" opacity="0.85" />
          </g>

          {/* Apples */}
          {[
            { x: -5, y: -65, r: 4.8 },
            { x: 18, y: -78, r: 5.2 },
            { x: 42, y: -92, r: 5.0 },
            { x: 55, y: -45, r: 4.6 },
            { x: 75, y: -52, r: 4.8 },
            { x: 10, y: -115, r: 4.5 },
            { x: 38, y: -130, r: 4.4 },
          ].map((ap, idx) => (
            <g key={`asset-apple-${idx}`} transform={`translate(${ap.x}, ${ap.y})`}>
              <line x1="0" y1="0" x2="0" y2="-4" stroke="#362213" strokeWidth="0.8" />
              <ellipse cx="2" cy="-3.5" rx="2" ry="1" fill="#4d7c38" transform="rotate(-20 2 -3.5)" />
              <circle cx="0" cy="0" r={ap.r} fill="url(#assetAppleFruitHighlight)" stroke="#7f1d1d" strokeWidth="0.5" />
              <circle cx="-1.5" cy="-1.5" r={ap.r * 0.35} fill="#fca5a5" opacity="0.65" />
            </g>
          ))}

          {/* Hydrangeas */}
          <g id="base-hydrangeas" transform="translate(18, 42)">
            <ellipse cx="0" cy="5" rx="16" ry="6" fill="#121d10" opacity="0.4" />
            <ellipse cx="-8" cy="2" rx="9" ry="5" fill="#2d592f" transform="rotate(-25 -8 2)" />
            <ellipse cx="8" cy="2" rx="9" ry="5" fill="#2d592f" transform="rotate(25 8 2)" />
            <ellipse cx="-6" cy="-4" rx="10" ry="7" fill="#818cf8" stroke="#6366f1" strokeWidth="0.4" />
            <ellipse cx="6" cy="-3" rx="11" ry="8" fill="#a78bfa" stroke="#8b5cf6" strokeWidth="0.4" />
            <ellipse cx="0" cy="-8" rx="9" ry="6.5" fill="#c084fc" stroke="#a855f7" strokeWidth="0.4" />
          </g>
        </g>
      )}
    </g>
  );
};

export default PicnicSpotAsset;
