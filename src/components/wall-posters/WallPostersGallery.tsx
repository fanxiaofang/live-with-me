import React from 'react';
import type { InteractionTarget } from '../../world/interactions/interactionTypes';
import { svgAction } from '../../world/interactions/svgAction';
import { POSTER_CATALOG, PosterId } from './posterTypes';

interface WallPostersGalleryProps {
  onSelectPoster: (id: PosterId) => void;
  onHoverPoster: (target: InteractionTarget | null) => void;
}

/**
 * 2.5D 高清右墙电影艺术展陈画廊 (Right Wall Fine-Art Posters Gallery)
 * 彻底消除斜向锯齿效应（Anti-Aliasing Jaggies）与纸片薄弱感：
 * 1. 消除高频干涉线：移除原先 4 条密集并排的 0.4px 边框线，改为统一的实木框体与整洁卡纸衬底。
 * 2. 根除圆角剪切畸变：移除在 matrix 剪切下变形的 rx 圆角，采用精准直角接缝。
 * 3. 注入真实 2.5D 进深厚度：为每个画框追加真实的左侧立面（-1.2px）与下侧挑檐立面，立体感坚实。
 * 4. 强制几何高精度渲染：群组声明 shapeRendering="geometricPrecision"。
 */
export const WallPostersGallery: React.FC<WallPostersGalleryProps> = ({
  onSelectPoster,
  onHoverPoster,
}) => {
  // 共享常数：右墙 2.5D 轴测透视斜率
  const SLOPE = 0.2852;
  const SHEAR_MATRIX = `matrix(1, ${SLOPE}, 0, 1, 0, 0)`;

  // 画框尺寸 (宽 26, 高 37.5)
  const FRAME_W = 26;
  const FRAME_H = 37.5;

  return (
    <g id="right-wall-posters-gallery">
      <defs>
        {/* 暖橡木画框渐变 */}
        <linearGradient id="cabin-oak-frame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7a5234" />
          <stop offset="35%" stopColor="#634027" />
          <stop offset="70%" stopColor="#53341e" />
          <stop offset="100%" stopColor="#432815" />
        </linearGradient>

        {/* 暖胡桃木画框渐变 */}
        <linearGradient id="cabin-walnut-frame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#694328" />
          <stop offset="50%" stopColor="#52331c" />
          <stop offset="100%" stopColor="#3d2311" />
        </linearGradient>

        {/* 复古纯铜挂钉渐变 */}
        <radialGradient id="brass-peg-grad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#ca8a04" />
          <stop offset="85%" stopColor="#854d0e" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>

        {/* 柔和清透玻璃微光 */}
        <linearGradient id="cozy-glass-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.03" />
        </linearGradient>

        {/* 精确直角裁切路径 (无变形圆角，边缘平整无锯齿) */}
        <clipPath id="clip-poster-yw-small">
          <rect x="1.8" y="1.8" width={FRAME_W - 3.6} height={FRAME_H - 3.6} />
        </clipPath>
        <clipPath id="clip-poster-cd-small">
          <rect x="1.8" y="1.8" width={FRAME_W - 3.6} height={FRAME_H - 3.6} />
        </clipPath>
        <clipPath id="clip-poster-pk-small">
          <rect x="1.8" y="1.8" width={FRAME_W - 3.6} height={FRAME_H - 3.6} />
        </clipPath>
      </defs>

      {/* ========================================================================= */}
      {/* 统一右墙轴测透视画廊组 (启用几何高精度抗锯齿渲染，彻底消除斜线锯齿)     */}
      {/* ========================================================================= */}
      <g
        id="wall-gallery-shear-group"
        transform={`translate(0, -12) ${SHEAR_MATRIX}`}
        shapeRendering="geometricPrecision"
      >

        {/* ----------------------------------------------------------------------- */}
        {/* 1. 海报 1: 《泳者之心》 (Young Woman and the Sea)                       */}
        {/* 位置：x = 30                                                            */}
        {/* ----------------------------------------------------------------------- */}
        <g {...svgAction('赏析泳者之心海报')}
          id="poster-young-woman"
          transform="translate(30, 0)"
          onClick={(e) => {
            e.stopPropagation();
            onSelectPoster('young-woman');
          }}
          onMouseEnter={() => onHoverPoster({ kind: 'poster', id: 'young-woman' })}
          onMouseLeave={() => onHoverPoster(null)}
          className="cursor-pointer group/p1"
        >
          {/* 温馨手作挂绳系统 */}
          <g className="pointer-events-none">
            <circle cx="13" cy="-7.6" r="1.3" fill="#2d1c10" opacity="0.3" />
            <line x1="13" y1="-8" x2="4.0" y2="0.2" stroke="#8a6c4b" strokeWidth="0.6" strokeLinecap="round" />
            <line x1="13" y1="-8" x2="22.0" y2="0.2" stroke="#75583b" strokeWidth="0.6" strokeLinecap="round" />
            <circle cx="13" cy="-8" r="1.2" fill="url(#brass-peg-grad)" stroke="#3e1a06" strokeWidth="0.3" />
            <circle cx="12.7" cy="-8.3" r="0.35" fill="#fef08a" />
          </g>

          {/* 温暖柔和的木框墙面投影 */}
          <rect
            x="1.6"
            y="1.8"
            width={FRAME_W}
            height={FRAME_H}
            fill="#26170d"
            opacity="0.22"
          />

          {/* 2.5D 实木画框厚度立面 (从墙面真实凸出，坚实立体，消除纸片感) */}
          <polygon
            points={`-1.2,0 0,0 0,${FRAME_H} -1.2,${FRAME_H}`}
            fill="#2e1a0d"
            stroke="#1e1007"
            strokeWidth="0.4"
            strokeLinejoin="round"
          />
          <polygon
            points={`-1.2,${FRAME_H} 0,${FRAME_H} ${FRAME_W},${FRAME_H} ${FRAME_W - 1.2},${FRAME_H + 1.0}`}
            fill="#241308"
            stroke="#180c05"
            strokeWidth="0.4"
            strokeLinejoin="round"
          />

          {/* 温润实木框体正面 (一体化纯净色块，无高频并排细线，彻底消除锯齿) */}
          <rect
            x="0"
            y="0"
            width={FRAME_W}
            height={FRAME_H}
            fill="url(#cabin-walnut-frame)"
            stroke="#261307"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />

          {/* 质朴米黄艺术卡纸衬底 */}
          <rect
            x="1.4"
            y="1.4"
            width={FRAME_W - 2.8}
            height={FRAME_H - 2.8}
            fill="#fcf8f0"
            stroke="#dcd2c4"
            strokeWidth="0.3"
          />

          {/* 高精度纯矢量画芯 */}
          <g clipPath="url(#clip-poster-yw-small)">
            {/* 苍茫深邃的英吉利海峡夜海底色 */}
            <rect x="1.8" y="1.8" width={FRAME_W - 3.6} height={FRAME_H - 3.6} fill="#0d1b2a" />
            
            {/* 海天交际处的晨曦微芒 */}
            <polygon points="1.8,1.8 24.2,1.8 24.2,13.5 1.8,11.5" fill="#1b3a4b" />
            <polygon points="1.8,5.5 24.2,6.5 24.2,12.0 1.8,10.0" fill="#2d6a8f" opacity="0.55" />
            <ellipse cx="13" cy="8.2" rx="8" ry="1.8" fill="#72b5d4" opacity="0.3" />

            {/* 汹涌翻卷的大海波涛体块 */}
            <path d="M1.8,14.2 Q7.5,12.8 13.0,14.0 Q18.5,15.2 24.2,13.6 L24.2,35.7 L1.8,35.7 Z" fill="#132a3a" />
            <path d="M1.8,18.0 Q8.0,16.5 14.0,18.2 Q19.5,19.5 24.2,17.8 L24.2,35.7 L1.8,35.7 Z" fill="#0f2230" />
            <path d="M1.8,22.8 Q6.8,21.0 13.0,22.5 Q19.2,23.8 24.2,21.8 L24.2,35.7 L1.8,35.7 Z" fill="#0a1824" />
            
            {/* 浪花飞溅的高光线束 */}
            <path d="M2.5,14.5 Q7.5,13.2 12.8,14.4" stroke="#60a5fa" strokeWidth="0.35" fill="none" opacity="0.6" />
            <path d="M13.2,18.2 Q18.5,19.5 23.5,18.0" stroke="#93c5fd" strokeWidth="0.4" fill="none" opacity="0.7" />
            <path d="M2.5,23.0 Q7.8,21.5 13.5,22.8" stroke="#dbeafe" strokeWidth="0.45" fill="none" opacity="0.75" />

            {/* 水面背影近景：后颈连接肩线，躯干与四肢留在水下。 */}
            <path
              d="M12.1,26.9 L13.9,26.9 L14.1,27.8 C14.8,28.1 16.3,28.2 17.1,29.1 L17.5,30.1 L8.5,30.1 L8.9,29.1 C9.7,28.2 11.2,28.1 11.9,27.8 Z"
              fill="#b98867"
            />
            <path
              d="M9.4,28.8 L10.4,28.4 L11.1,29.4 L14.9,29.4 L15.6,28.4 L16.6,28.8 L17.1,30.3 L8.9,30.3 Z"
              fill="#0f172a"
            />

            {/* 沿用红色泳帽轮廓，浅色接缝呼应 JPG，移至画面下三分之一。 */}
            <g transform="translate(13, 25) scale(1.35) translate(-13, -21)">
              <path
                d="M11.8,21.6 C11.8,19.8 12.6,18.8 13.4,18.8 C14.3,18.8 15.0,19.8 14.8,21.6 C14.6,22.6 13.8,23.2 13.0,23.2 C12.2,23.2 11.8,22.6 11.8,21.6 Z"
                fill="#b91c1c"
              />
              <path d="M12.4,19.2 C13.0,19.0 13.8,19.1 14.2,19.6" stroke="#ef4444" strokeWidth="0.4" fill="none" strokeLinecap="round" />
              <path d="M12.9,19.2 C12.6,20.3 12.6,21.5 12.8,22.8 M13.8,19.4 C14.0,20.5 13.9,21.9 13.6,22.8" stroke="#f4ede2" strokeWidth="0.24" fill="none" strokeLinecap="round" opacity="0.9" />
              <path d="M11.8,21.0 Q13.2,21.8 14.8,21.0" stroke="#090d16" strokeWidth="0.45" fill="none" />
            </g>

            {/* 前景海水遮住泳衣下缘，用开放的浪线代替环形白色浮圈。 */}
            <path
              d="M1.8,29.8 C5.5,28.9 8.2,29.1 11.1,29.8 C14.5,30.6 19.6,29.1 24.2,29.4 L24.2,35.7 L1.8,35.7 Z"
              fill="#0a1824"
            />
            <path d="M5.8,29.3 C7.6,29.2 9.0,29.5 10.4,29.8 M15.1,30.0 C17.1,29.7 18.6,29.3 20.5,29.4" stroke="#93c5fd" strokeWidth="0.35" strokeLinecap="round" fill="none" opacity="0.7" />

            {/* 极简清透玻璃微光 */}
            <polygon
              points={`1.8,1.8 ${FRAME_W * 0.4},1.8 ${FRAME_W * 0.08},${FRAME_H - 1.8} 1.8,${FRAME_H - 1.8}`}
              fill="url(#cozy-glass-sheen)"
            />
          </g>

          {/* 交互高光提示 */}
          <rect
            x="0"
            y="0"
            width={FRAME_W}
            height={FRAME_H}
            fill="none"
            stroke="#fef08a"
            strokeWidth="0.8"
            strokeLinejoin="round"
            className="opacity-0 group-hover/p1:opacity-100 transition-opacity duration-200"
          />
        </g>

        {/* ----------------------------------------------------------------------- */}
        {/* 2. 海报 2: 《还有明天》 (C'è ancora domani)                             */}
        {/* 位置：x = 68                                                            */}
        {/* ----------------------------------------------------------------------- */}
        <g {...svgAction('赏析还有明天海报')}
          id="poster-ancora-domani"
          transform="translate(68, 0)"
          onClick={(e) => {
            e.stopPropagation();
            onSelectPoster('ancora-domani');
          }}
          onMouseEnter={() => onHoverPoster({ kind: 'poster', id: 'ancora-domani' })}
          onMouseLeave={() => onHoverPoster(null)}
          className="cursor-pointer group/p2"
        >
          {/* 温馨手作挂绳系统 */}
          <g className="pointer-events-none">
            <circle cx="13" cy="-7.6" r="1.3" fill="#2d1c10" opacity="0.3" />
            <line x1="13" y1="-8" x2="4.0" y2="0.2" stroke="#8a6c4b" strokeWidth="0.6" strokeLinecap="round" />
            <line x1="13" y1="-8" x2="22.0" y2="0.2" stroke="#75583b" strokeWidth="0.6" strokeLinecap="round" />
            <circle cx="13" cy="-8" r="1.2" fill="url(#brass-peg-grad)" stroke="#3e1a06" strokeWidth="0.3" />
            <circle cx="12.7" cy="-8.3" r="0.35" fill="#fef08a" />
          </g>

          {/* 投影 */}
          <rect
            x="1.6"
            y="1.8"
            width={FRAME_W}
            height={FRAME_H}
            fill="#26170d"
            opacity="0.22"
          />

          {/* 2.5D 实木画框厚度立面 */}
          <polygon
            points={`-1.2,0 0,0 0,${FRAME_H} -1.2,${FRAME_H}`}
            fill="#2e1a0d"
            stroke="#1e1007"
            strokeWidth="0.4"
            strokeLinejoin="round"
          />
          <polygon
            points={`-1.2,${FRAME_H} 0,${FRAME_H} ${FRAME_W},${FRAME_H} ${FRAME_W - 1.2},${FRAME_H + 1.0}`}
            fill="#241308"
            stroke="#180c05"
            strokeWidth="0.4"
            strokeLinejoin="round"
          />

          {/* 温润实木正面主框体 (暖橡木质感) */}
          <rect
            x="0"
            y="0"
            width={FRAME_W}
            height={FRAME_H}
            fill="url(#cabin-oak-frame)"
            stroke="#261307"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />

          {/* 质朴棉纸内衬 */}
          <rect
            x="1.4"
            y="1.4"
            width={FRAME_W - 2.8}
            height={FRAME_H - 2.8}
            fill="#faf5ea"
            stroke="#dcd2c4"
            strokeWidth="0.3"
          />

          {/* 画芯 */}
          <g clipPath="url(#clip-poster-cd-small)">
            {/* 纯净复古温润棉纸底色 */}
            <rect x="1.8" y="1.8" width={FRAME_W - 3.6} height={FRAME_H - 3.6} fill="#fbf8f2" />

            {/* 罗马晨光街景建筑群 */}
            <rect x="1.8" y="1.8" width={FRAME_W - 3.6} height="18" fill="#f4ece1" opacity="0.6" />
            <polygon points="1.8,1.8 15,1.8 12,18 1.8,18" fill="#fff9ef" opacity="0.45" />

            {/* 左侧街景建筑体块 */}
            <polygon points="1.8,6.0 8.0,8.5 8.0,24.5 1.8,25.5" fill="#e8dfd2" />
            <polygon points="1.8,8.2 5.0,9.6 5.0,20.0 1.8,20.8" fill="#dbd0c0" opacity="0.7" />
            <rect x="2.6" y="11.5" width="1.6" height="2.5" fill="#cfc2b0" />
            <rect x="2.6" y="15.8" width="1.6" height="2.5" fill="#cfc2b0" />

            {/* 右侧街景建筑体块 */}
            <polygon points="24.2,5.8 17.5,8.5 17.5,24.5 24.2,25.5" fill="#e8dfd2" />
            <polygon points="24.2,8.0 20.2,9.6 20.2,20.5 24.2,21.2" fill="#dbd0c0" opacity="0.7" />
            <rect x="21.5" y="11.5" width="1.6" height="2.5" fill="#cfc2b0" />
            <rect x="21.5" y="15.8" width="1.6" height="2.5" fill="#cfc2b0" />

            {/* 古典罗马石砌拱廊 */}
            <path d="M10.0,24.0 L10.0,13.5 Q13.0,11.2 16.0,13.5 L16.0,24.0 Z" fill="#eee7dc" />
            <path d="M11.0,24.0 L11.0,14.6 Q13.0,12.8 15.0,14.6 L15.0,24.0 Z" fill="#faf4eb" />

            {/* 罗马石板街道路面基底 */}
            <polygon points="1.8,24.0 24.2,24.0 24.2,35.7 1.8,35.7" fill="#ece4d8" />
            <line x1="8.5" y1="24.0" x2="2.5" y2="35.7" stroke="#dccebd" strokeWidth="0.35" />
            <line x1="17.5" y1="24.0" x2="23.5" y2="35.7" stroke="#dccebd" strokeWidth="0.35" />

            {/* 女主角迪莉娅 (Delia) 坚韧典雅背影 */}
            <ellipse cx="13.0" cy="33.8" rx="3.6" ry="0.7" fill="#8c7866" opacity="0.35" />

            {/* 黑色及膝百褶裙 */}
            <path
              d="M11.2,25.2 L14.8,25.2 L16.2,31.8 L9.8,31.8 Z"
              fill="#18181b"
            />
            <line x1="12.0" y1="25.2" x2="11.4" y2="31.8" stroke="#09090b" strokeWidth="0.3" />
            <line x1="13.0" y1="25.2" x2="13.0" y2="31.8" stroke="#09090b" strokeWidth="0.3" />
            <line x1="14.0" y1="25.2" x2="14.6" y2="31.8" stroke="#09090b" strokeWidth="0.3" />

            {/* 小腿与罗马复古系带小皮鞋 */}
            <path d="M11.6,31.8 L11.4,34.0 L12.2,34.0 L12.4,31.8 Z" fill="#f5ebe0" />
            <path d="M13.6,31.8 L13.8,33.8 L14.6,33.8 L14.4,31.8 Z" fill="#f5ebe0" />
            <ellipse cx="11.8" cy="34.0" rx="0.7" ry="0.35" fill="#18181b" />
            <ellipse cx="14.2" cy="33.8" rx="0.7" ry="0.35" fill="#18181b" />

            {/* 白色棉麻收腰短袖衬衫 */}
            <path
              d="M10.8,19.2 L15.2,19.2 C15.8,21.0 15.4,23.5 14.8,25.4 L11.2,25.4 C10.6,23.5 10.2,21.0 10.8,19.2 Z"
              fill="#ffffff"
            />
            <path d="M12.0,19.2 L14.0,19.2 L13.6,25.4 L12.4,25.4 Z" fill="#f4ece1" />

            {/* 手臂与提着的重要秘密信封手袋 */}
            <path d="M10.6,19.5 L9.6,23.5 L10.4,24.0 L11.4,20.2 Z" fill="#ffffff" />
            <path d="M15.4,19.5 L16.4,24.0 L15.6,24.5 L14.6,20.2 Z" fill="#ffffff" />
            {/* 右手挎着标志性黑色小手袋 */}
            <rect x="15.8" y="24.0" width="1.8" height="2.4" rx="0.2" fill="#18181b" />
            <path d="M16.2,24.0 Q16.7,22.8 17.2,24.0" stroke="#09090b" strokeWidth="0.3" fill="none" />

            {/* 盘发发髻与优雅后颈 */}
            <path d="M12.4,17.8 L13.6,17.8 L13.4,19.2 L12.4,19.2 Z" fill="#f5ebe0" />
            <ellipse cx="13.0" cy="16.5" rx="1.6" ry="1.8" fill="#27272a" />
            <ellipse cx="13.0" cy="15.2" rx="1.2" ry="0.9" fill="#18181b" />
            <line x1="12.2" y1="16.8" x2="13.8" y2="16.8" stroke="#3f3f46" strokeWidth="0.35" />

            {/* 清透玻璃微光 */}
            <polygon
              points={`1.8,1.8 ${FRAME_W * 0.4},1.8 ${FRAME_W * 0.08},${FRAME_H - 1.8} 1.8,${FRAME_H - 1.8}`}
              fill="url(#cozy-glass-sheen)"
            />
          </g>

          {/* 交互高光提示 */}
          <rect
            x="0"
            y="0"
            width={FRAME_W}
            height={FRAME_H}
            fill="none"
            stroke="#fef08a"
            strokeWidth="0.8"
            strokeLinejoin="round"
            className="opacity-0 group-hover/p2:opacity-100 transition-opacity duration-200"
          />
        </g>

        {/* ----------------------------------------------------------------------- */}
        {/* 3. 海报 3: 《红辣椒》 (Paprika)                                         */}
        {/* 位置：x = 106                                                           */}
        {/* ----------------------------------------------------------------------- */}
        <g {...svgAction('赏析红辣椒海报')}
          id="poster-paprika"
          transform="translate(106, 0)"
          onClick={(e) => {
            e.stopPropagation();
            onSelectPoster('paprika');
          }}
          onMouseEnter={() => onHoverPoster({ kind: 'poster', id: 'paprika' })}
          onMouseLeave={() => onHoverPoster(null)}
          className="cursor-pointer group/p3"
        >
          {/* 温馨手作挂绳系统 */}
          <g className="pointer-events-none">
            <circle cx="13" cy="-7.6" r="1.3" fill="#2d1c10" opacity="0.3" />
            <line x1="13" y1="-8" x2="4.0" y2="0.2" stroke="#8a6c4b" strokeWidth="0.6" strokeLinecap="round" />
            <line x1="13" y1="-8" x2="22.0" y2="0.2" stroke="#75583b" strokeWidth="0.6" strokeLinecap="round" />
            <circle cx="13" cy="-8" r="1.2" fill="url(#brass-peg-grad)" stroke="#3e1a06" strokeWidth="0.3" />
            <circle cx="12.7" cy="-8.3" r="0.35" fill="#fef08a" />
          </g>

          {/* 投影 */}
          <rect
            x="1.6"
            y="1.8"
            width={FRAME_W}
            height={FRAME_H}
            fill="#26170d"
            opacity="0.22"
          />

          {/* 2.5D 实木画框厚度立面 */}
          <polygon
            points={`-1.2,0 0,0 0,${FRAME_H} -1.2,${FRAME_H}`}
            fill="#2e1a0d"
            stroke="#1e1007"
            strokeWidth="0.4"
            strokeLinejoin="round"
          />
          <polygon
            points={`-1.2,${FRAME_H} 0,${FRAME_H} ${FRAME_W},${FRAME_H} ${FRAME_W - 1.2},${FRAME_H + 1.0}`}
            fill="#241308"
            stroke="#180c05"
            strokeWidth="0.4"
            strokeLinejoin="round"
          />

          {/* 温润实木正面主框体 (深色柚木/胡桃木质感) */}
          <rect
            x="0"
            y="0"
            width={FRAME_W}
            height={FRAME_H}
            fill="url(#cabin-walnut-frame)"
            stroke="#261307"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />

          {/* 内衬 */}
          <rect
            x="1.4"
            y="1.4"
            width={FRAME_W - 2.8}
            height={FRAME_H - 2.8}
            fill="#faf4eb"
            stroke="#dcd2c4"
            strokeWidth="0.3"
          />

          {/* 画芯 */}
          <g clipPath="url(#clip-poster-pk-small)">
            {/* 深紫午夜星空：少量低对比星点为人物近景留出空间。 */}
            <rect x="1.8" y="1.8" width={FRAME_W - 3.6} height={FRAME_H - 3.6} fill="#140f29" />
            <path d="M1.8,22.0 C7.2,18.5 17.8,19.8 24.2,15.6 L24.2,35.7 L1.8,35.7 Z" fill="#281637" />
            <g fill="#b9a0c4" opacity="0.65">
              <circle cx="5.1" cy="6.2" r="0.18" />
              <circle cx="17.8" cy="4.7" r="0.2" />
              <circle cx="21.2" cy="10.4" r="0.16" />
              <circle cx="3.9" cy="16.9" r="0.16" />
              <circle cx="22.0" cy="21.0" r="0.18" />
            </g>

            {/* 红衣肩部延伸至画框下缘，省略手臂、裤腿与鞋子。 */}
            <path
              d="M10.2,22.4 L15.5,22.4 C17.1,23.2 21.2,24.0 22.0,26.0 L24.2,35.7 L1.8,35.7 L3.8,26.4 C4.6,24.5 8.1,23.6 10.2,22.4 Z"
              fill="#ad2c3d"
            />
            <path d="M3.8,26.4 C4.5,27.2 5.3,28.3 5.5,30.0 L6.5,35.7 L1.8,35.7 Z" fill="#7e2033" />
            <path d="M20.5,27.1 L18.8,33.8 L11.2,35.7 L24.2,35.7 L22.0,26.0 Z" fill="#88243a" />
            <path d="M11.0,20.6 L15.0,20.6 L15.9,24.1 Q13.0,26.3 10.2,24.1 Z" fill="#c48b6e" />
            <path d="M9.6,22.7 Q10.8,24.8 13.1,25.4 Q15.2,24.9 16.1,22.8 L17.4,23.6 Q16.0,27.0 13.0,27.4 Q9.3,26.0 8.3,23.6 Z" fill="#721f31" />

            {/* 短发外轮廓与外翘发尾呼应详情 JPG，避免小尺寸下的双侧圆团。 */}
            <path
              d="M6.9,17.4 C5.8,14.8 6.6,11.4 8.9,9.8 C10.4,8.8 11.5,8.6 13.1,8.7 C15.5,8.0 18.3,10.4 19.1,13.4 C19.9,16.0 19.7,18.1 18.7,19.5 C19.1,20.0 19.7,20.1 20.2,19.8 C19.7,21.3 18.1,21.8 16.6,21.2 L15.7,20.2 L10.1,20.6 C9.2,22.2 7.2,22.0 6.3,21.1 L7.9,20.6 C6.6,20.3 6.0,19.5 5.9,18.9 L7.2,19.2 Z"
              fill="#7e272b"
            />

            {/* 用明暗两块塑造脸部，五官细节交给点开后的大图。 */}
            <path
              d="M8.9,14.4 C9.1,12.6 10.8,11.6 13.0,11.6 C15.2,11.6 16.9,12.6 17.1,14.4 L16.4,18.6 C15.8,20.0 14.3,21.8 13.0,22.4 C11.7,21.8 10.2,20.0 9.6,18.6 Z"
              fill="#efc095"
            />
            <path d="M13.1,11.6 C15.2,11.6 16.9,12.6 17.1,14.4 L16.4,18.6 C15.8,20.0 14.3,21.8 13.0,22.4 L12.8,18.3 L13.4,17.8 L12.8,16.8 Z" fill="#a46558" />

            {/* 额发采用连续色块，在墙面缩放后仍能辨认红棕短发。 */}
            <path
              d="M7.1,17.5 C6.5,14.9 7.1,12.0 9.3,10.4 C11.9,8.5 15.2,8.9 17.3,11.3 C19.2,13.4 19.3,16.8 17.8,18.9 C16.9,19.4 16.3,19.7 15.8,19.6 L16.5,18.4 L16.6,15.0 L15.7,15.5 L15.5,13.7 L14.6,15.3 L13.7,12.4 L13.4,15.1 L12.6,14.3 L12.0,15.3 L11.4,14.6 L10.4,15.4 L9.4,14.7 L8.9,16.1 L9.2,18.8 L10.2,19.7 C9.2,20.0 8.2,19.7 7.7,19.1 Z"
              fill="#b54a34"
            />
            <path d="M7.8,15.8 C7.4,13.3 8.6,11.1 10.3,10.3 C11.3,9.6 12.1,9.5 13.0,9.5 C10.0,10.3 8.9,12.7 8.8,15.9 L9.2,18.8 C8.4,18.1 8.0,17.1 7.8,15.8 Z" fill="#c45a3c" opacity="0.5" />

            {/* 极简清透玻璃微光 */}
            <polygon
              points={`1.8,1.8 ${FRAME_W * 0.4},1.8 ${FRAME_W * 0.08},${FRAME_H - 1.8} 1.8,${FRAME_H - 1.8}`}
              fill="url(#cozy-glass-sheen)"
            />
          </g>

          {/* 交互高光提示 */}
          <rect
            x="0"
            y="0"
            width={FRAME_W}
            height={FRAME_H}
            fill="none"
            stroke="#fef08a"
            strokeWidth="0.8"
            strokeLinejoin="round"
            className="opacity-0 group-hover/p3:opacity-100 transition-opacity duration-200"
          />
        </g>
      </g>
    </g>
  );
};
