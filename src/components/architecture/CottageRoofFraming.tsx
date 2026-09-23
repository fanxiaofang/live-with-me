import React from 'react';

interface CottageRoofFramingProps {
  roofColor?: string;
}

/**
 * 2.5D 童话主屋暖红陶瓦人字屋檐与立体挑檐构架 (Artisan Terracotta Eaves & Corbel System)
 * 
 * 彻底解决此前屋檐“像红黑胶带贴条”、“两端生硬切断悬空”、“山尖烟囱突刺”的问题：
 * 1. 饱满温暖的经典陶瓦红渐变 (url(#terracottaRoof))，辅以瓦片排布的微起伏节律与向光暖金微高光；
 * 2. 瓦下采用温润的实木封檐厚梁 (Solid Fascia Beam)，替代死板发黑的粗记号笔描边；
 * 3. 左右两端与山墙角柱自然承托咬合，增设精巧的实木挑檐托拱 (Corbel Brackets)，力学上稳稳托住屋檐；
 * 4. 屋檐在室内后墙上投射柔和自然的漫反射环境光阴影，展现真实的挑高挑檐纵深。
 */
export const CottageRoofFraming: React.FC<CottageRoofFramingProps> = () => {
  return (
    <g id="cottage-roof-framing" className="pointer-events-none">
      {/* 1. 屋檐在室内后墙上的柔和漫反射深远阴影 (Ambient Occlusion Drop Shadow on Back Walls) */}
      <polygon
        points="-270,-10 0,-90 0,-77 -270,3"
        fill="#1e130c"
        opacity="0.14"
      />
      <polygon
        points="0,-90 270,-10 270,3 0,-77"
        fill="#1e130c"
        opacity="0.18"
      />

      {/* 2. 左右两侧角柱顶部的挑檐实木托撑 (Corbel Brackets: 消除两端悬空感，牢固承托挑檐) */}
      {/* 左托撑 */}
      <g id="left-corbel-bracket">
        <polygon
          points="-272,-10 -258,-5 -258,4 -278, -3"
          fill="#4a2e1c"
          stroke="#2d190d"
          strokeWidth="0.6"
        />
        <polygon
          points="-278,-3 -258,4 -261,12 -282,1"
          fill="#3b2214"
        />
      </g>
      {/* 右托撑 */}
      <g id="right-corbel-bracket">
        <polygon
          points="258,-5 272,-10 278,-3 258,4"
          fill="#3a2214"
          stroke="#24140b"
          strokeWidth="0.6"
        />
        <polygon
          points="258,4 278,-3 282,1 261,12"
          fill="#2b170c"
        />
      </g>

      {/* 3. 实木承檐大底梁 (Timber Soffit & Fascia Bed: 沉稳温润的木质厚度层) */}
      {/* 左斜梁厚度底面 */}
      <polygon
        points="-285,-3 0,-88 0,-81 -285,4"
        fill="#3b2314"
      />
      {/* 右斜梁厚度底面 */}
      <polygon
        points="0,-88 285,-3 285,4 0,-81"
        fill="#2a170b"
      />

      {/* 4. 实木封檐板正面 (Fascia Board Face: 具有真实原木色泽与向阳微光) */}
      {/* 左坡封檐木板 */}
      <polygon
        points="-286,-8 0,-93 0,-87 -286,-2"
        fill="#5a3821"
      />
      {/* 右坡封檐木板 */}
      <polygon
        points="0,-93 286,-8 286,-2 0,-87"
        fill="#492c19"
      />
      {/* 木梁迎光微倒角中缝线 */}
      <line
        x1="-286"
        y1="-8"
        x2="0"
        y2="-93"
        stroke="#805132"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="0"
        y1="-93"
        x2="286"
        y2="-8"
        stroke="#6e4428"
        strokeWidth="0.9"
        strokeLinecap="round"
      />

      {/* 5. 温暖童话陶瓦主屋顶层 (Terracotta Clay Tile Overhang) */}
      {/* 左坡红陶瓦面 */}
      <polygon
        points="-287,-10 0,-96 0,-84 -287,-2"
        fill="url(#terracottaRoof)"
        stroke="#b84f2f"
        strokeWidth="0.5"
      />
      {/* 右坡红陶瓦面 (背光侧稍显沉静温馨) */}
      <polygon
        points="0,-96 287,-10 287,-2 0,-84"
        fill="url(#terracottaRoof)"
        stroke="#a34427"
        strokeWidth="0.5"
      />

      {/* 6. 陶瓦起伏微节律与瓦当阴影 (Tile Rim Scallops & Interlocking Shadows) */}
      {/* 左坡瓦片微重叠分格 */}
      {[-245, -205, -165, -125, -85, -45].map((tx) => {
        const ty = -96 - tx * 0.2996; // 依据坡度推算 y
        return (
          <g key={`l-tile-${tx}`}>
            <line
              x1={tx}
              y1={ty}
              x2={tx + 2}
              y2={ty + 11.5}
              stroke="#7a2d18"
              strokeWidth="0.8"
              opacity="0.65"
            />
            <line
              x1={tx + 1}
              y1={ty}
              x2={tx + 3}
              y2={ty + 11.5}
              stroke="#ffa185"
              strokeWidth="0.6"
              opacity="0.6"
            />
          </g>
        );
      })}

      {/* 右坡瓦片微重叠分格 */}
      {[45, 85, 125, 165, 205, 245].map((tx) => {
        const ty = -96 + tx * 0.2996;
        return (
          <g key={`r-tile-${tx}`}>
            <line
              x1={tx}
              y1={ty}
              x2={tx - 2}
              y2={ty + 11.5}
              stroke="#6b2412"
              strokeWidth="0.8"
              opacity="0.6"
            />
            <line
              x1={tx - 1}
              y1={ty}
              x2={tx - 3}
              y2={ty + 11.5}
              stroke="#f58f73"
              strokeWidth="0.6"
              opacity="0.5"
            />
          </g>
        );
      })}

      {/* 7. 陶瓦迎光天光微高光 (Sunlit Eave Crest Highlight) */}
      <line
        x1="-287"
        y1="-10"
        x2="0"
        y2="-96"
        stroke="#ffb39b"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="0"
        y1="-96"
        x2="287"
        y2="-10"
        stroke="#f79c82"
        strokeWidth="1.0"
        strokeLinecap="round"
      />

      {/* 8. 左右出挑平滑圆润端头 (Fascia Tail Returns) */}
      <path
        d="M-287,-10 Q-290,-6 -287,-2 L-285,4 L-281,4 L-285,-8 Z"
        fill="#4a2d1a"
      />
      <path
        d="M287,-10 Q290,-6 287,-2 L285,4 L281,4 L285,-8 Z"
        fill="#382011"
      />

      {/* 9. 屋脊中央工匠金属压脊片 (Ridge Crest Cap Plate: 消除山尖生硬转折) */}
      <g id="roof-ridge-cap">
        <polygon
          points="0,-98 -8,-93 0,-91 8,-93"
          fill="#3d3027"
          stroke="#1e1610"
          strokeWidth="0.6"
        />
        <circle cx="0" cy="-94" r="1.1" fill="#8c7a6b" />
      </g>
    </g>
  );
};
