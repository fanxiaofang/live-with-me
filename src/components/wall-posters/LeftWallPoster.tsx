import React from 'react';
import { PosterId, POSTER_CATALOG } from './posterTypes';

interface LeftWallPosterProps {
  onSelectPoster: (id: PosterId) => void;
  onHoverPoster: (name: string | null) => void;
}

export const LeftWallPoster: React.FC<LeftWallPosterProps> = ({
  onSelectPoster,
  onHoverPoster,
}) => {
  // 左墙 2.5D 轴测透视斜率 (与左侧窗洞、踢脚线、窗帘挂杆严格完全平行)
  const SLOPE = -0.2852;
  const SHEAR_MATRIX = `matrix(1, ${SLOPE}, 0, 1, 0, 0)`;

  // 画框尺寸：宽 28, 高 41 (优美 2:3 比例，比例温润与左墙呼吸感自然契合)
  const FRAME_W = 28;
  const FRAME_H = 41;

  const posterData = POSTER_CATALOG['pastoral-valley'];

  return (
    <g id="left-wall-poster-group">
      <defs>
        {/* 左墙木质温润橡木框渐变 */}
        <linearGradient id="left-poster-oak-frame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7a5234" />
          <stop offset="35%" stopColor="#634027" />
          <stop offset="70%" stopColor="#53341e" />
          <stop offset="100%" stopColor="#432815" />
        </linearGradient>

        {/* 纯铜小挂钉径向渐变 */}
        <radialGradient id="left-poster-brass-peg" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#ca8a04" />
          <stop offset="85%" stopColor="#854d0e" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>

        {/* 裁切路径 */}
        <clipPath id="clip-poster-pv-small">
          <rect x="1.8" y="1.8" width={FRAME_W - 3.6} height={FRAME_H - 3.6} rx="0.3" />
        </clipPath>
      </defs>

      {/* 严格顺应左墙等轴测透视的变形容器 */}
      <g id="left-poster-shear-container" transform={SHEAR_MATRIX}>
        <g
          id="poster-pastoral-valley-frame"
          onClick={(e) => {
            e.stopPropagation();
            onSelectPoster('pastoral-valley');
          }}
          onMouseEnter={() =>
            onHoverPoster('海报:《山谷与远行》· 约克郡田园牧歌艺术 (点击赏析)')
          }
          onMouseLeave={() => onHoverPoster(null)}
          className="cursor-pointer group/leftposter"
        >
          {/* 温馨手作挂绳系统：复古圆木/纯铜小挂钉 + 天然黄麻悬绳 */}
          <g className="pointer-events-none">
            {/* 墙面小钉投影 */}
            <circle cx={FRAME_W / 2} cy="-7.6" r="1.3" fill="#2d1c10" opacity="0.35" />
            {/* 暖调黄麻吊绳 (三角对称悬挂) */}
            <line
              x1={FRAME_W / 2}
              y1="-8"
              x2="4.5"
              y2="0.6"
              stroke="#9a7b56"
              strokeWidth="0.55"
              strokeLinecap="round"
            />
            <line
              x1={FRAME_W / 2}
              y1="-8"
              x2={FRAME_W - 4.5}
              y2="0.6"
              stroke="#846543"
              strokeWidth="0.55"
              strokeLinecap="round"
            />
            {/* 挂绳高光细线 */}
            <line
              x1={FRAME_W / 2}
              y1="-8"
              x2="4.5"
              y2="0.6"
              stroke="#ecd7b5"
              strokeWidth="0.2"
              opacity="0.6"
            />
            {/* 复古纯铜小挂钉 */}
            <circle
              cx={FRAME_W / 2}
              cy="-8"
              r="1.2"
              fill="url(#left-poster-brass-peg)"
              stroke="#451a03"
              strokeWidth="0.25"
            />
            <circle cx={FRAME_W / 2 - 0.3} cy="-8.3" r="0.4" fill="#fef08a" />
          </g>

          {/* 温暖柔和的木框墙面柔和阴影 */}
          <rect
            x="1.4"
            y="1.8"
            width={FRAME_W}
            height={FRAME_H}
            rx="0.8"
            fill="#2d1c10"
            opacity="0.25"
          />

          {/* 温润实木框体 (温暖白橡木/胡桃木双重微光) */}
          <rect
            x="0"
            y="0"
            width={FRAME_W}
            height={FRAME_H}
            rx="0.8"
            fill="url(#left-poster-oak-frame)"
            stroke="#2b170a"
            strokeWidth="0.6"
          />

          {/* 木框微受光与立体切角 */}
          <line
            x1="0.4"
            y1="0.4"
            x2={FRAME_W - 0.4}
            y2="0.4"
            stroke="#966a48"
            strokeWidth="0.4"
          />
          <line
            x1="0.4"
            y1="0.4"
            x2="0.4"
            y2={FRAME_H - 0.4}
            stroke="#966a48"
            strokeWidth="0.4"
          />
          <line
            x1={FRAME_W - 0.4}
            y1="0.4"
            x2={FRAME_W - 0.4}
            y2={FRAME_H - 0.4}
            stroke="#261307"
            strokeWidth="0.4"
          />
          <line
            x1="0.4"
            y1={FRAME_H - 0.4}
            x2={FRAME_W - 0.4}
            y2={FRAME_H - 0.4}
            stroke="#261307"
            strokeWidth="0.4"
          />

          {/* 温润米黄艺术卡纸衬底 (Natural Cream Mat) */}
          <rect
            x="1.2"
            y="1.2"
            width={FRAME_W - 2.4}
            height={FRAME_H - 2.4}
            rx="0.3"
            fill="#fcf8f0"
          />

          {/* 纯净画芯 + 优雅纸质质感融合 */}
          <g clipPath="url(#clip-poster-pv-small)">
            {/* 底色衬托 */}
            <rect
              x="1.8"
              y="1.8"
              width={FRAME_W - 3.6}
              height={FRAME_H - 3.6}
              fill="#2e4732"
            />
            {/* 高清田园画作 */}
            <image
              href={posterData.imageUrl}
              x="1.8"
              y="1.8"
              width={FRAME_W - 3.6}
              height={FRAME_H - 3.6}
              preserveAspectRatio="xMidYMid slice"
            />

            {/* 底部微小复古英伦旅行海报字样饰边 (精工微缩标签) */}
            <rect
              x="1.8"
              y={FRAME_H - 5.4}
              width={FRAME_W - 3.6}
              height="3.6"
              fill="#19231cd0"
            />
            <text
              x={FRAME_W / 2}
              y={FRAME_H - 3.0}
              textAnchor="middle"
              fill="#faf3e6"
              fontSize="1.1"
              fontWeight="bold"
              letterSpacing="0.08em"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              YORKSHIRE DALES
            </text>
            <text
              x={FRAME_W / 2}
              y={FRAME_H - 2.0}
              textAnchor="middle"
              fill="#c8b292"
              fontSize="0.75"
              letterSpacing="0.06em"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              BRITISH RAILWAYS
            </text>

            {/* 极简清透玻璃微光 */}
            <polygon
              points={`1.8,1.8 ${FRAME_W * 0.7},1.8 1.8,${FRAME_H * 0.7}`}
              fill="#ffffff"
              opacity="0.07"
            />
            <polygon
              points={`${FRAME_W - 1.8},${FRAME_H * 0.4} ${FRAME_W - 1.8},${FRAME_H - 1.8} ${FRAME_W * 0.4},${FRAME_H - 1.8}`}
              fill="#ffffff"
              opacity="0.04"
            />
          </g>

          {/* 鼠标悬停时的微微温润光晕与外边框交互反馈 */}
          <rect
            x="0"
            y="0"
            width={FRAME_W}
            height={FRAME_H}
            rx="0.8"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="0.8"
            opacity="0"
            className="group-hover/leftposter:opacity-75 transition-opacity duration-200 pointer-events-none"
          />
        </g>
      </g>
    </g>
  );
};
