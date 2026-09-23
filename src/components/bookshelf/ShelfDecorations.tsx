import React from 'react';
import { ShelfDecorationConfig } from './bookshelfTypes';

/**
 * 书架可插拔摆件合集 (ShelfDecorations)
 * 提取自原有精细做旧矢量元素，并做模块化解耦
 */

export const PineconeBasket: React.FC<{
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ isSelected, isHovered, onClick }) => (
  <g
    id="dec-pinecone-basket"
    className="cursor-pointer group/dec transition-transform duration-200 hover:scale-105"
    onClick={onClick}
  >
    <ellipse cx="0" cy="1.2" rx="3.5" ry="1.6" fill="#1b120c" opacity="0.25" />
    <polygon points="-3,0 3,0 2.2,2.5 -2.2,2.5" fill="#a07a50" stroke="#6e5030" strokeWidth="0.4" />
    <ellipse cx="0" cy="0" rx="3" ry="1.2" fill="#755232" />
    {/* 松果细节 */}
    <ellipse cx="-1" cy="-0.6" rx="1.3" ry="1.5" fill="#4d321c" stroke="#332010" strokeWidth="0.3" />
    <ellipse cx="1.2" cy="-0.4" rx="1.2" ry="1.4" fill="#5a3b22" stroke="#332010" strokeWidth="0.3" />
    {isSelected && <circle cx="0" cy="0" r="4.2" fill="none" stroke="#facc15" strokeWidth="0.6" strokeDasharray="1.5 1" />}
  </g>
);

export const TrailingIvy: React.FC<{
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ isSelected, isHovered, onClick }) => (
  <g
    id="dec-trailing-ivy"
    className="cursor-pointer group/dec transition-transform duration-200 hover:scale-105"
    onClick={onClick}
  >
    <ellipse cx="0" cy="1.0" rx="2.5" ry="1.2" fill="#1b120c" opacity="0.25" />
    {/* 红陶微盆 */}
    <polygon points="-2,0 2,0 1.5,3 -1.5,3" fill="#c06941" stroke="#8c4322" strokeWidth="0.3" />
    <ellipse cx="0" cy="0" rx="2" ry="0.8" fill="#523522" />
    {/* 多肉与垂蔓 */}
    <circle cx="-0.8" cy="-0.8" r="1.4" fill="#4d8c58" />
    <circle cx="1.0" cy="-0.6" r="1.3" fill="#3a7044" />
    <circle cx="0" cy="-1.4" r="1.2" fill="#62a86f" />
    <path d="M-1,1 Q-2.5,4 -2,7 Q-1.5,9 -2.5,11" stroke="#40784a" strokeWidth="0.6" fill="none" />
    <circle cx="-2.2" cy="4" r="0.7" fill="#4d8c58" />
    <circle cx="-1.8" cy="7.5" r="0.8" fill="#5ea36b" />
    <circle cx="-2.5" cy="11" r="0.6" fill="#6eb87c" />
    {isSelected && <circle cx="0" cy="0" r="3.8" fill="none" stroke="#facc15" strokeWidth="0.6" strokeDasharray="1.5 1" />}
  </g>
);

export const DryVase: React.FC<{
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ isSelected, isHovered, onClick }) => (
  <g
    id="dec-dry-vase"
    className="cursor-pointer group/dec transition-transform duration-200 hover:scale-105"
    onClick={onClick}
  >
    <ellipse cx="0" cy="1.0" rx="2.0" ry="1.0" fill="#1b120c" opacity="0.2" />
    {/* 细颈粗陶瓶 */}
    <path d="M-1.5,0.5 C-2,-1 -1,-3 -0.7,-4.5 L0.7,-4.5 C1,-3 2,-1 1.5,0.5 Z" fill="#d9cebf" stroke="#ab9e8c" strokeWidth="0.3" />
    {/* 干花枝与金黄球花 */}
    <line x1="0" y1="-4.5" x2="-2.5" y2="-10.5" stroke="#b0936b" strokeWidth="0.5" />
    <circle cx="-2.5" cy="-10.5" r="0.8" fill="#d6b885" />
    <line x1="0" y1="-4.5" x2="1.8" y2="-11.2" stroke="#b0936b" strokeWidth="0.5" />
    <circle cx="1.8" cy="-11.2" r="0.7" fill="#c4aa76" />
    <line x1="0" y1="-4.5" x2="3.2" y2="-9.0" stroke="#b0936b" strokeWidth="0.5" />
    <circle cx="3.2" cy="-9.0" r="0.7" fill="#8c789e" />
    {isSelected && <circle cx="0" cy="-4" r="5.2" fill="none" stroke="#facc15" strokeWidth="0.6" strokeDasharray="1.5 1" />}
  </g>
);

export const BrassCompass: React.FC<{
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ isSelected, isHovered, onClick }) => (
  <g
    id="dec-brass-compass"
    className="cursor-pointer group/dec transition-transform duration-200 hover:scale-105"
    onClick={onClick}
  >
    <ellipse cx="0" cy="0" rx="2.2" ry="1.2" fill="#cfa546" stroke="#947024" strokeWidth="0.3" />
    <ellipse cx="0" cy="0" rx="1.6" ry="0.8" fill="#faf5e8" />
    <line x1="-0.8" y1="0" x2="0.8" y2="0" stroke="#942a20" strokeWidth="0.4" />
    {isSelected && <circle cx="0" cy="0" r="3.0" fill="none" stroke="#facc15" strokeWidth="0.6" strokeDasharray="1.5 1" />}
  </g>
);

export const WoodenBird: React.FC<{
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ isSelected, isHovered, onClick }) => (
  <g
    id="dec-wooden-bird"
    className="cursor-pointer group/dec transition-transform duration-200 hover:scale-105"
    onClick={onClick}
  >
    <ellipse cx="0" cy="0" rx="1.8" ry="1.2" fill="#8c5832" stroke="#5a351a" strokeWidth="0.3" />
    <circle cx="1.4" cy="-1.0" r="0.9" fill="#a46d42" />
    <polygon points="2.1,-1.0 3.0,-0.8 2.1,-0.5" fill="#d49e59" />
    <polygon points="-1.8,0 -3.0,0.8 -1.5,0.6" fill="#754724" />
    {isSelected && <circle cx="0" cy="0" r="3.2" fill="none" stroke="#facc15" strokeWidth="0.6" strokeDasharray="1.5 1" />}
  </g>
);

export const StoneBookend: React.FC<{
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ isSelected, isHovered, onClick }) => (
  <g
    id="dec-stone-bookend"
    className="cursor-pointer group/dec transition-transform duration-200 hover:scale-105"
    onClick={onClick}
  >
    <ellipse cx="0" cy="0" rx="2.2" ry="1.6" fill="#667078" stroke="#4a5359" strokeWidth="0.3" />
    <ellipse cx="0" cy="-0.4" rx="1.6" ry="1.0" fill="#889299" opacity="0.7" />
    {isSelected && <circle cx="0" cy="0" r="3.2" fill="none" stroke="#facc15" strokeWidth="0.6" strokeDasharray="1.5 1" />}
  </g>
);

export const FriendLetter: React.FC<{
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ isSelected, isHovered, onClick }) => (
  <g
    id="dec-friend-letter"
    className="cursor-pointer group/dec transition-transform duration-200 hover:scale-105"
    onClick={onClick}
  >
    {/* 斜插在书本间的折叠信笺/信封 */}
    <polygon points="0,0 3,0.8 2,-7 -1,-7.8" fill="#fdfaf4" stroke="#d5be9b" strokeWidth="0.3" />
    {/* 红色火漆印 / 干花压角 */}
    <circle cx="1" cy="-3.5" r="0.8" fill="#a83232" />
    <line x1="0.3" y1="-6" x2="1.8" y2="-5.6" stroke="#997b5a" strokeWidth="0.3" />
    {isSelected && <circle cx="1" cy="-3.5" r="3.2" fill="none" stroke="#facc15" strokeWidth="0.6" strokeDasharray="1.5 1" />}
  </g>
);

export const CeramicMug: React.FC<{
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ isSelected, isHovered, onClick }) => (
  <g
    id="dec-ceramic-mug"
    className="cursor-pointer group/dec transition-transform duration-200 hover:scale-105"
    onClick={onClick}
  >
    <ellipse cx="0" cy="0.6" rx="2.0" ry="1.0" fill="#1b120c" opacity="0.25" />
    <path d="M-1.8,-3 L1.8,-3 L1.4,0.4 L-1.4,0.4 Z" fill="#e8dfd1" stroke="#a3927d" strokeWidth="0.3" />
    <ellipse cx="0" cy="-3" rx="1.8" ry="0.8" fill="#523927" />
    {/* 把手 */}
    <path d="M1.6,-2 C2.5,-2 2.5,-0.5 1.3,-0.5" fill="none" stroke="#a3927d" strokeWidth="0.4" />
    {/* 极轻微热气 */}
    <path d="M-0.2,-4.5 Q0.3,-6 -0.3,-7.5" fill="none" stroke="#ffffff" strokeWidth="0.3" opacity="0.4" />
    {isSelected && <circle cx="0" cy="-2" r="3.0" fill="none" stroke="#facc15" strokeWidth="0.6" strokeDasharray="1.5 1" />}
  </g>
);

export const CrystalGeode: React.FC<{
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ isSelected, isHovered, onClick }) => (
  <g
    id="dec-crystal-geode"
    className="cursor-pointer group/dec transition-transform duration-200 hover:scale-105"
    onClick={onClick}
  >
    <ellipse cx="0" cy="0.8" rx="2.2" ry="1.1" fill="#1b120c" opacity="0.2" />
    <polygon points="-1.5,0.2 0,-3.5 1.8,0.2" fill="#7fa6c7" stroke="#486d8c" strokeWidth="0.3" />
    <polygon points="0.2,0.2 1.2,-2.8 2.2,0.4" fill="#a4c6e2" stroke="#5d83a1" strokeWidth="0.3" />
    <polygon points="-1.8,0.4 -0.6,-2.0 0.2,0.2" fill="#5c87aa" stroke="#3b5e7a" strokeWidth="0.3" />
    {isSelected && <circle cx="0" cy="-1.5" r="3.2" fill="none" stroke="#facc15" strokeWidth="0.6" strokeDasharray="1.5 1" />}
  </g>
);

export const RenderShelfDecoration: React.FC<{
  config: ShelfDecorationConfig;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ config, isSelected, isHovered, onClick }) => {
  switch (config.type) {
    case 'pinecone-basket':
      return <PineconeBasket isSelected={isSelected} isHovered={isHovered} onClick={onClick} />;
    case 'trailing-ivy':
      return <TrailingIvy isSelected={isSelected} isHovered={isHovered} onClick={onClick} />;
    case 'dry-vase':
      return <DryVase isSelected={isSelected} isHovered={isHovered} onClick={onClick} />;
    case 'brass-compass':
      return <BrassCompass isSelected={isSelected} isHovered={isHovered} onClick={onClick} />;
    case 'wooden-bird':
      return <WoodenBird isSelected={isSelected} isHovered={isHovered} onClick={onClick} />;
    case 'stone-bookend':
      return <StoneBookend isSelected={isSelected} isHovered={isHovered} onClick={onClick} />;
    case 'friend-letter':
      return <FriendLetter isSelected={isSelected} isHovered={isHovered} onClick={onClick} />;
    case 'ceramic-mug':
      return <CeramicMug isSelected={isSelected} isHovered={isHovered} onClick={onClick} />;
    case 'crystal-geode':
      return <CrystalGeode isSelected={isSelected} isHovered={isHovered} onClick={onClick} />;
    default:
      return null;
  }
};
