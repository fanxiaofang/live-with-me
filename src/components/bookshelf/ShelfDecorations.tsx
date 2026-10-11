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

/** 方案 2：复古黄铜浑天星仪与天然透光星辉水晶球 (Antique Burnished Brass Astrolabe & Natural Optical Quartz Sphere) */
export const AstrolabeSphere: React.FC<{
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ isSelected, isHovered, onClick }) => (
  <g
    id="dec-astrolabe-sphere"
    className="cursor-pointer group/dec transition-transform duration-200 hover:scale-105 select-none"
    onClick={onClick}
  >
    <title>复古黄铜浑天星仪 · 沉厚雕花胡桃木底座，环抱古老学者注魔的天然透光星辉水晶球 ✨</title>
    {/* 1. 地板漫反射环境光遮蔽投影 */}
    <ellipse cx="0" cy="1.6" rx="4.0" ry="1.8" fill="#1b120c" opacity="0.36" />
    <ellipse cx="0" cy="1.2" rx="2.8" ry="1.2" fill="#0d0805" opacity="0.45" />

    {/* 2. 沉厚古董胡桃木车削雕花底座 (Sculpted Aged Walnut Pedestal) */}
    <polygon points="-3.6,0.8 3.6,0.8 2.8,2.8 -2.8,2.8" fill="#3f2314" stroke="#25140a" strokeWidth="0.35" />
    <ellipse cx="0" cy="0.8" rx="3.5" ry="1.4" fill="#58341b" stroke="#3f2314" strokeWidth="0.3" />
    {/* 底座内层凹凸嵌线 */}
    <ellipse cx="0" cy="0.4" rx="2.6" ry="1.0" fill="#744627" />
    <ellipse cx="0" cy="0.0" rx="1.6" ry="0.7" fill="#422512" />

    {/* 3. 做旧黄铜承托短柱与承轴套筒 (Aged Brass Spindle & Swivel Collar) */}
    <line x1="0" y1="0.2" x2="0" y2="-1.6" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="0" y1="0.2" x2="0" y2="-1.6" stroke="#d97706" strokeWidth="0.6" strokeLinecap="round" />
    <circle cx="0" cy="-1.6" r="1.2" fill="#b45309" stroke="#78350f" strokeWidth="0.3" />
    <circle cx="0" cy="-1.6" r="0.6" fill="#f59e0b" />

    {/* 4. 黄铜子午天体主环 (Antique Burnished Meridian Ring) */}
    {/* 背部深色厚度阴影环 */}
    <ellipse cx="0" cy="-6.2" rx="4.2" ry="6.0" fill="none" stroke="#5a2e0a" strokeWidth="0.9" />
    {/* 主黄铜外环 */}
    <ellipse cx="0" cy="-6.2" rx="3.9" ry="5.7" fill="none" stroke="#b45309" strokeWidth="0.7" />
    {/* 黄铜内缘高光与刻度棱线 */}
    <ellipse cx="0" cy="-6.2" rx="3.5" ry="5.2" fill="none" stroke="#f59e0b" strokeWidth="0.35" opacity="0.85" />

    {/* 5. 倾斜赤道刻度星环 (Inclined Equator Celestial Ring with Tick Marks) */}
    <g transform="rotate(-24 0 -6.2)">
      {/* 背部环弧 */}
      <ellipse cx="0" cy="-6.2" rx="5.2" ry="1.9" fill="none" stroke="#78350f" strokeWidth="0.75" />
      {/* 迎光正面赤道环 */}
      <ellipse cx="0" cy="-6.2" rx="4.8" ry="1.7" fill="none" stroke="#d97706" strokeWidth="0.65" />
      <ellipse cx="0" cy="-6.2" rx="4.5" ry="1.5" fill="none" stroke="#fbbf24" strokeWidth="0.3" opacity="0.8" />
      {/* 刻度小齿纹 (Celestial Ticks) */}
      <line x1="-3.6" y1="-6.2" x2="-3.6" y2="-6.7" stroke="#92400e" strokeWidth="0.35" />
      <line x1="0" y1="-7.8" x2="0" y2="-8.3" stroke="#92400e" strokeWidth="0.35" />
      <line x1="3.6" y1="-6.2" x2="3.6" y2="-6.7" stroke="#92400e" strokeWidth="0.35" />
    </g>

    {/* 6. 顶端黄铜指针与微型星冕 (Gimbal Finial & Northern Star Pointer) */}
    <circle cx="0" cy="-12.2" r="0.8" fill="#b45309" stroke="#78350f" strokeWidth="0.25" />
    <circle cx="0" cy="-12.2" r="0.45" fill="#fbbf24" />
    <polygon points="0,-13.8 0.5,-12.6 1.4,-12.3 0.5,-12.0 0,-10.8 -0.5,-12.0 -1.4,-12.3 -0.5,-12.6" fill="#fef08a" stroke="#d97706" strokeWidth="0.25" />

    {/* 7. 天然透光星辉水晶球主体 (Natural Optical Quartz Sphere with Crystalline Depth) */}
    {/* 柔和环境光晕 (摒弃刺眼塑料纯蓝霓虹，采用温润通透的星宿微光) */}
    <circle cx="0" cy="-6.2" r="3.4" fill="#93c5fd" opacity="0.18" className="pointer-events-none" />
    
    {/* 水晶球深层折射基底 (Deep Translucent Optical Quartz Body) */}
    <circle cx="0" cy="-6.2" r="2.4" fill="#1e3a5f" opacity="0.85" />
    <circle cx="0" cy="-6.2" r="2.2" fill="#2563eb" opacity="0.6" />

    {/* 水晶内部多面体折射光斑 (Internal Prismatic Caustic Facets) */}
    <path
      d="M-1.4,-7.2 Q0,-5.2 1.4,-6.8 Q0.8,-7.8 -1.4,-7.2 Z"
      fill="#60a5fa"
      opacity="0.75"
    />
    <path
      d="M-0.8,-5.2 Q0,-7.0 1.2,-5.6 Q0,-4.5 -0.8,-5.2 Z"
      fill="#93c5fd"
      opacity="0.7"
      className="animate-[pulse_2.8s_ease-in-out_infinite]"
    />

    {/* 水晶球核心悬浮星尘星核 (Floating Celestial Starlight Inclusion) */}
    <circle cx="0.2" cy="-6.4" r="0.7" fill="#ffffff" opacity="0.95" />
    <circle cx="0.2" cy="-6.4" r="1.3" fill="#e0f2fe" opacity="0.5" className="animate-[pulse_1.8s_infinite]" />

    {/* 水晶球面真实双弧高光 (Dual Spherical Specular Glare Lines) */}
    {/* 主高光弧 (迎窗天光反射) */}
    <path
      d="M-1.4,-7.6 C-0.6,-8.3 0.8,-8.3 1.5,-7.6"
      stroke="#ffffff"
      strokeWidth="0.65"
      strokeLinecap="round"
      fill="none"
      opacity="0.9"
    />
    {/* 次级点高光 */}
    <circle cx="-1.1" cy="-7.1" r="0.4" fill="#ffffff" />
    {/* 底部暖光反光弧 (反弹屋内心火与原木温润光泽) */}
    <path
      d="M-1.0,-4.8 C-0.3,-4.4 0.6,-4.4 1.2,-4.8"
      stroke="#fed7aa"
      strokeWidth="0.45"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
    />

    {isSelected && <circle cx="0" cy="-6.2" r="6.0" fill="none" stroke="#facc15" strokeWidth="0.75" strokeDasharray="1.5 1" />}
  </g>
);

/** 方案 3：天然生态厚壁吹制玻璃微景瓶 (Artisan Hand-Blown Botanical Glass Terrarium) */
export const MushroomTerrarium: React.FC<{
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ isSelected, isHovered, onClick }) => (
  <g
    id="dec-mushroom-terrarium"
    className="cursor-pointer group/dec transition-transform duration-200 hover:scale-105 select-none"
    onClick={onClick}
  >
    <title>古法吹制生态玻璃微景瓶 · 封存着从约克郡林间采集的夜光菌丝、青苔与温润黑沃土 🍄🌿</title>
    {/* 1. 底托漫反射微阴影 */}
    <ellipse cx="0" cy="1.6" rx="3.8" ry="1.8" fill="#1b120c" opacity="0.35" />
    <ellipse cx="0" cy="1.0" rx="2.8" ry="1.2" fill="#0f0905" opacity="0.45" />

    {/* 2. 玻璃瓶底部有机沃土与湿润青苔底床 (Forest Peat Soil & Cushion Moss) */}
    {/* 深黑腐殖沃土底座 */}
    <ellipse cx="0" cy="0.6" rx="3.3" ry="1.5" fill="#1c130b" />
    <path d="M-3.3,0.6 Q0,1.2 3.3,0.6 L3.1,-0.6 Q0,-0.1 -3.1,-0.6 Z" fill="#2d1d12" />
    {/* 郁郁葱葱的深翠天鹅绒青苔底床 */}
    <ellipse cx="0" cy="-0.6" rx="3.1" ry="1.3" fill="#1e3a1e" />
    <ellipse cx="-0.8" cy="-0.7" rx="1.8" ry="0.9" fill="#2d5a27" />
    <ellipse cx="1.1" cy="-0.5" rx="1.6" ry="0.8" fill="#3f6e35" />
    {/* 天然溪流白卵石与微型碎木屑点缀 */}
    <ellipse cx="1.6" cy="-0.3" rx="0.7" ry="0.45" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.2" />
    <ellipse cx="-1.5" cy="-0.4" rx="0.5" ry="0.35" fill="#e2e8f0" />
    <circle cx="0.2" cy="-0.8" r="0.3" fill="#58341b" />

    {/* 3. 森林生态发光灵菇 (Natural Bioluminescent Forest Fungi · 摒弃刺眼高饱和纯青塑料荧光) */}
    {/* 1) 主夜光菇 (清润翡翠月光色伞盖，带温润微光) */}
    {/* 菇柄 (自然弯曲的象牙白柔韧茎秆) */}
    <path d="M-0.6,-0.6 Q-0.8,-3.2 -0.5,-5.0" stroke="#f0fdf4" strokeWidth="0.7" fill="none" strokeLinecap="round" />
    <path d="M-0.5,-0.6 Q-0.7,-3.2 -0.4,-5.0" stroke="#bbf7d0" strokeWidth="0.4" fill="none" strokeLinecap="round" />
    {/* 菇盖菌褶与伞体 */}
    <path
      d="M-2.2,-5.0 C-2.2,-7.2 1.2,-7.2 1.2,-5.0 Q-0.5,-4.4 -2.2,-5.0 Z"
      fill="#4ade80"
      stroke="#22c55e"
      strokeWidth="0.35"
      className="animate-[pulse_2.6s_ease-in-out_infinite]"
    />
    {/* 伞面天然渐变暖光斑点 */}
    <circle cx="-0.6" cy="-6.0" r="0.45" fill="#fef08a" opacity="0.95" />
    <circle cx="0.3" cy="-5.5" r="0.35" fill="#ffffff" opacity="0.9" />
    <circle cx="-1.4" cy="-5.4" r="0.25" fill="#bbf7d0" opacity="0.8" />

    {/* 2) 伴生幼菇 (柔嫩草木初萌小伞) */}
    <path d="M1.2,-0.5 Q1.4,-2.2 1.7,-3.0" stroke="#f0fdf4" strokeWidth="0.5" fill="none" strokeLinecap="round" />
    <path
      d="M0.8,-3.0 C0.8,-4.4 2.6,-4.4 2.6,-3.0 Q1.7,-2.6 0.8,-3.0 Z"
      fill="#86efac"
      stroke="#4ade80"
      strokeWidth="0.25"
      className="animate-[pulse_3.2s_ease-in-out_infinite]"
    />
    <circle cx="1.6" cy="-3.6" r="0.25" fill="#fef08a" opacity="0.9" />

    {/* 3) 飘渺灵动游离微孢子星尘 (Ambient Firefly Spore Motes) */}
    <circle cx="-0.5" cy="-5.2" r="3.2" fill="#86efac" opacity="0.16" className="pointer-events-none" />
    <circle cx="1.0" cy="-6.8" r="0.35" fill="#fef08a" opacity="0.85" className="animate-[pulse_1.9s_infinite]" />
    <circle cx="-1.6" cy="-3.8" r="0.25" fill="#ffffff" opacity="0.75" className="animate-[pulse_2.4s_infinite]" />

    {/* 4. 手工吹制复古厚壁药剂玻璃瓶 (Hand-Blown Vintage Glass Body with Realistic Refraction) */}
    {/* 外壁轮廓与厚度 */}
    <path
      d="M-3.4,0.6 C-4.1,-3.2 -2.5,-6.8 -1.3,-8.2 L1.3,-8.2 C2.5,-6.8 4.1,-3.2 3.4,0.6 Z"
      fill="#ecfdf5"
      fillOpacity="0.12"
      stroke="#6ee7b7"
      strokeWidth="0.4"
      strokeOpacity="0.7"
    />
    {/* 瓶底厚重玻璃沉底透光 (Thick Glass Bottom Meniscus) */}
    <ellipse cx="0" cy="0.6" rx="3.3" ry="1.2" fill="none" stroke="#a7f3d0" strokeWidth="0.5" opacity="0.6" />

    {/* 瓶身左侧优雅弧面高光反射条 (Elegant Curved Specular Glass Flare) */}
    <path
      d="M-2.5,-1.2 C-3.0,-3.6 -1.9,-6.2 -1.1,-7.4"
      stroke="#ffffff"
      strokeWidth="0.65"
      strokeLinecap="round"
      fill="none"
      opacity="0.85"
    />
    <path
      d="M-2.0,-2.0 C-2.4,-3.8 -1.5,-5.8 -0.8,-6.8"
      stroke="#ffffff"
      strokeWidth="0.3"
      strokeLinecap="round"
      fill="none"
      opacity="0.5"
    />
    {/* 右侧微光反光点 */}
    <ellipse cx="2.4" cy="-2.4" rx="0.4" ry="0.8" fill="#ffffff" opacity="0.6" transform="rotate(15 2.4 -2.4)" />

    {/* 5. 传统微倒角软木塞与麻绳捆扎 (Handmade Textured Cork Stopper with Twine Wrap) */}
    {/* 软木塞主体 */}
    <polygon points="-1.5,-8.2 1.5,-8.2 1.2,-10.4 -1.2,-10.4" fill="#a27b50" stroke="#6e4f2d" strokeWidth="0.35" />
    <ellipse cx="0" cy="-10.4" rx="1.2" ry="0.5" fill="#c49b6e" />
    {/* 软木自然孔隙与斑驳质感 */}
    <circle cx="-0.4" cy="-9.2" r="0.25" fill="#6e4f2d" />
    <circle cx="0.5" cy="-8.8" r="0.2" fill="#6e4f2d" />
    <circle cx="0.1" cy="-9.8" r="0.2" fill="#543c22" />

    {/* 复古粗麻绳双圈缠系与垂落绳结 (Artisan Jute Twine Wrap & Hanging Knot) */}
    <line x1="-1.4" y1="-8.8" x2="1.4" y2="-8.8" stroke="#5a3d1d" strokeWidth="0.55" />
    <line x1="-1.3" y1="-8.3" x2="1.3" y2="-8.3" stroke="#855b32" strokeWidth="0.45" />
    {/* 垂在瓶颈侧面的小麻绳结头 */}
    <path d="M1.3,-8.5 Q2.0,-7.8 1.8,-6.8" stroke="#78532d" strokeWidth="0.45" fill="none" strokeLinecap="round" />

    {isSelected && <circle cx="0" cy="-4.5" r="5.6" fill="none" stroke="#facc15" strokeWidth="0.75" strokeDasharray="1.5 1" />}
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
    case 'astrolabe-sphere':
      return <AstrolabeSphere isSelected={isSelected} isHovered={isHovered} onClick={onClick} />;
    case 'mushroom-terrarium':
      return <MushroomTerrarium isSelected={isSelected} isHovered={isHovered} onClick={onClick} />;
    default:
      return null;
  }
};
