import React from 'react';

/**
 * 2.5D 工匠级主屋两侧山墙剖面与承重角柱体系 (Cottage Wall Profiles & Heavy Corner Posts)
 * 
 * 解决原先房屋两侧单薄如纸、切面无厚度、立柱孤立浮空的问题：
 * 1. 粗壮实木转角大柱 (Heavy Oak King Posts)：直径达 12-14px 的通体实木立柱，自地袱大梁直通屋顶主椽；
 * 2. 真实的剖切墙体断面 (Cutaway Wall Depth Profile)：展现外立面耐候实木挂板 (Weatherboard Siding) 叠层与室内饰面；
 * 3. 底部锻铁地脚防震底座 (Base Iron Anchors & Bolts)：牢牢锚固在实木地板地袱与花岗岩柱础上；
 * 4. 顶部大梁衔接铁艺夹板 (Top Timber Connector Plates)：与主椽大梁榫卯无缝嵌合；
 * 5. 柱身工匠级木纹、定心木销 (Wooden Pegs) 与迎光倒角微高光。
 */
export const CottageWallProfiles: React.FC = () => {
  return (
    <g id="cottage-wall-profiles" className="pointer-events-none">
      {/* ======================================================== */}
      {/* 1. 左侧墙体剖面与承重角柱 (Left Wall Cutaway & Corner Post) */}
      {/* ======================================================== */}
      <g id="left-wall-profile">
        {/* 外侧墙体剖切厚度层 (7px 复合墙体断面：外立面挂板 + 龙骨) */}
        <polygon
          points="-278,-9 -270,-10 -270,135 -278,137"
          fill="#3e2819"
        />
        {/* 耐候木挂板外切口叠压凹凸微齿痕 (Weatherboard Siding Layers) */}
        {[
          -4, 10, 24, 38, 52, 66, 80, 94, 108, 122
        ].map((sy) => (
          <g key={`lw-siding-${sy}`}>
            <line
              x1="-278"
              y1={sy}
              x2="-270"
              y2={sy - 1}
              stroke="#24160d"
              strokeWidth="0.9"
            />
            <line
              x1="-278"
              y1={sy + 0.6}
              x2="-270"
              y2={sy - 0.4}
              stroke="#5a3922"
              strokeWidth="0.5"
              opacity="0.75"
            />
          </g>
        ))}

        {/* 粗壮实木角柱主体 (Left Heavy Corner King Post: x=-272 到 -260) */}
        {/* 立柱背光侧阴影面 */}
        <polygon
          points="-272,-10 -266,-8 -266,137 -272,135"
          fill="#4a301e"
        />
        {/* 立柱正面受光主木面 */}
        <polygon
          points="-266,-8 -258,-5 -258,140 -266,137"
          fill="#734c2f"
          stroke="#422918"
          strokeWidth="0.6"
        />
        {/* 柱脊向光倒角高光线 */}
        <line
          x1="-266"
          y1="-8"
          x2="-266"
          y2="137"
          stroke="#9e6c46"
          strokeWidth="1.2"
        />

        {/* 柱身工匠实木定心木销 (Traditional Oak Pegs) */}
        {[-2, 32, 70, 108].map((py) => (
          <g key={`lpeg-${py}`}>
            <circle cx="-262" cy={py} r="1.3" fill="#3b2314" />
            <circle cx="-262" cy={py - 0.3} r="0.8" fill="#8c5d39" />
          </g>
        ))}

        {/* 柱顶承托屋檐收口金属柱箍 (Top Post Cap Collar) */}
        <g id="left-top-post-collar">
          <polygon
            points="-272,-10 -258,-5 -258,-2 -272,-7"
            fill="#2c221a"
            stroke="#17110c"
            strokeWidth="0.6"
          />
          <circle cx="-265" cy="-6" r="1.0" fill="#756456" />
        </g>

        {/* 底部紧固于地袱大梁上的铸铁地脚靴套 (Base Iron Anchor Shoe) */}
        <g id="left-base-anchor-shoe">
          <polygon
            points="-273,127 -257,133 -257,141 -273,136"
            fill="#271f18"
            stroke="#16110d"
            strokeWidth="0.7"
          />
          <line x1="-273" y1="131" x2="-257" y2="137" stroke="#483a2f" strokeWidth="0.8" />
          <circle cx="-265" cy="134" r="1.2" fill="#786658" />
          <circle cx="-260" cy="136" r="1.2" fill="#786658" />
        </g>
      </g>

      {/* ======================================================== */}
      {/* 2. 右侧墙体剖面与承重角柱 (Right Wall Cutaway & Corner Post) */}
      {/* ======================================================== */}
      <g id="right-wall-profile">
        {/* 外侧墙体剖切厚度层 (7px 复合墙体断面) */}
        <polygon
          points="270,-10 278,-9 278,137 270,135"
          fill="#332014"
        />
        {/* 耐候木挂板外切口叠压凹凸微齿痕 */}
        {[
          -4, 10, 24, 38, 52, 66, 80, 94, 108, 122
        ].map((sy) => (
          <g key={`rw-siding-${sy}`}>
            <line
              x1="270"
              y1={sy - 1}
              x2="278"
              y2={sy}
              stroke="#1f130b"
              strokeWidth="0.9"
            />
            <line
              x1="270"
              y1={sy - 0.4}
              x2="278"
              y2={sy + 0.6}
              stroke="#4c2f1b"
              strokeWidth="0.5"
              opacity="0.75"
            />
          </g>
        ))}

        {/* 粗壮实木角柱主体 (Right Heavy Corner King Post: x=258 到 272) */}
        {/* 立柱背光深色侧面 */}
        <polygon
          points="266,-8 272,-10 272,135 266,137"
          fill="#3a2416"
        />
        {/* 立柱正面木面 (背光侧稍暗于左柱) */}
        <polygon
          points="258,-5 266,-8 266,137 258,140"
          fill="#613e25"
          stroke="#362012"
          strokeWidth="0.6"
        />
        {/* 柱脊倒角微光 */}
        <line
          x1="266"
          y1="-8"
          x2="266"
          y2="137"
          stroke="#855938"
          strokeWidth="1.1"
        />

        {/* 柱身定心木销 */}
        {[-2, 32, 70, 108].map((py) => (
          <g key={`rpeg-${py}`}>
            <circle cx="262" cy={py} r="1.3" fill="#2d190d" />
            <circle cx="262" cy={py - 0.3} r="0.8" fill="#754b2d" />
          </g>
        ))}

        {/* 柱顶承托屋檐收口金属柱箍 (Top Post Cap Collar) */}
        <g id="right-top-post-collar">
          <polygon
            points="258,-5 272,-10 272,-7 258,-2"
            fill="#241c15"
            stroke="#130e0a"
            strokeWidth="0.6"
          />
          <circle cx="265" cy="-6" r="1.0" fill="#69584b" />
        </g>

        {/* 底部紧固于地袱大梁上的铸铁地脚靴套 */}
        <g id="right-base-anchor-shoe">
          <polygon
            points="257,133 273,127 273,136 257,141"
            fill="#211913"
            stroke="#120d09"
            strokeWidth="0.7"
          />
          <line x1="257" y1="137" x2="273" y2="131" stroke="#3d3026" strokeWidth="0.8" />
          <circle cx="265" cy="134" r="1.2" fill="#69584b" />
          <circle cx="260" cy="136" r="1.2" fill="#69584b" />
        </g>
      </g>
    </g>
  );
};
