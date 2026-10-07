import { svgAction } from '../../world/interactions/svgAction';
import type { InteractionTarget } from '../../world/interactions/interactionTypes';
import React from 'react';
import { PosterId, POSTER_CATALOG } from './posterTypes';

interface WallPostersGalleryProps {
  onSelectPoster: (id: PosterId) => void;
  onHoverPoster: (target: InteractionTarget | null) => void;
}

export const WallPostersGallery: React.FC<WallPostersGalleryProps> = ({
  onSelectPoster,
  onHoverPoster,
}) => {
  // 共享常数：右墙 2.5D 轴测透视斜率
  const SLOPE = 0.2852;
  const SHEAR_MATRIX = `matrix(1, ${SLOPE}, 0, 1, 0, 0)`;

  // 尺寸调整：适度缩小 ~30%，恢复木屋亲切宜居尺度 (宽 26, 高 37.5)
  const FRAME_W = 26;
  const FRAME_H = 37.5;

  return (
    <g id="right-wall-posters-gallery">
      <defs>
        {/* 温润暖木画框渐变（与木屋大书架、茶几相呼应的温暖橡木/柚木纹理） */}
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

        {/* 复古纯铜钉渐变 */}
        <radialGradient id="brass-peg-grad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#ca8a04" />
          <stop offset="85%" stopColor="#854d0e" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>

        {/* 柔和微哑光反光层 */}
        <linearGradient id="cozy-glass-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.03" />
        </linearGradient>

        {/* 裁切路径 (保持 2:3 纵向优雅微小边距) */}
        <clipPath id="clip-poster-yw-small">
          <rect x="1.8" y="1.8" width={FRAME_W - 3.6} height={FRAME_H - 3.6} rx="0.3" />
        </clipPath>
        <clipPath id="clip-poster-cd-small">
          <rect x="1.8" y="1.8" width={FRAME_W - 3.6} height={FRAME_H - 3.6} rx="0.3" />
        </clipPath>
        <clipPath id="clip-poster-pk-small">
          <rect x="1.8" y="1.8" width={FRAME_W - 3.6} height={FRAME_H - 3.6} rx="0.3" />
        </clipPath>
      </defs>

      {/* ========================================================================= */}
      {/* 统一右墙轴测透视画廊组 (位置居中舒适，上方留足木梁空间，下方呼吸感充足)  */}
      {/* ========================================================================= */}
      <g id="wall-gallery-shear-group" transform={`translate(0, -12) ${SHEAR_MATRIX}`}>

        {/* ----------------------------------------------------------------------- */}
        {/* 1. 海报 1: 《泳者之心》 (Young Woman and the Sea)                       */}
        {/* 位置：x = 37 (向左略舒展，呼吸感充裕，距离中间画作适度拉开)            */}
        {/* ----------------------------------------------------------------------- */}
        <g {...svgAction('赏析泳者之心海报')}
          id="poster-young-woman"
          transform="translate(37, 0)"
          onClick={(e) => {
            e.stopPropagation();
            onSelectPoster('young-woman');
          }}
          onMouseEnter={() => onHoverPoster({ kind: 'poster', id: 'young-woman' })}
          onMouseLeave={() => onHoverPoster(null)}
          className="cursor-pointer group/p1"
        >
          {/* 温馨手作挂绳系统：复古圆木/纯铜小挂钉 + 天然黄麻悬绳 */}
          <g className="pointer-events-none">
            {/* 墙面小钉投影 */}
            <circle cx="13" cy="-7.6" r="1.3" fill="#2d1c10" opacity="0.35" />
            {/* 暖调黄麻吊绳 (三角悬挂) */}
            <line x1="13" y1="-8" x2="4.5" y2="0.6" stroke="#9a7b56" strokeWidth="0.55" strokeLinecap="round" />
            <line x1="13" y1="-8" x2="21.5" y2="0.6" stroke="#846543" strokeWidth="0.55" strokeLinecap="round" />
            {/* 挂绳高光细线 */}
            <line x1="13" y1="-8" x2="4.5" y2="0.6" stroke="#ecd7b5" strokeWidth="0.2" opacity="0.6" />
            {/* 复古纯铜小挂钉 */}
            <circle cx="13" cy="-8" r="1.2" fill="url(#brass-peg-grad)" stroke="#451a03" strokeWidth="0.25" />
            <circle cx="12.7" cy="-8.3" r="0.4" fill="#fef08a" />
          </g>

          {/* 温暖柔和的木框墙面投影 */}
          <rect
            x="1.4"
            y="1.8"
            width={FRAME_W}
            height={FRAME_H}
            rx="0.8"
            fill="#2d1c10"
            opacity="0.24"
          />

          {/* 温润实木框体 (温暖胡桃木色) */}
          <rect
            x="0"
            y="0"
            width={FRAME_W}
            height={FRAME_H}
            rx="0.8"
            fill="url(#cabin-walnut-frame)"
            stroke="#2b170a"
            strokeWidth="0.6"
          />
          {/* 木框微受光与暗部高光切角 */}
          <line x1="0.4" y1="0.4" x2={FRAME_W - 0.4} y2="0.4" stroke="#966a48" strokeWidth="0.4" />
          <line x1="0.4" y1="0.4" x2="0.4" y2={FRAME_H - 0.4} stroke="#966a48" strokeWidth="0.4" />
          <line x1={FRAME_W - 0.4} y1="0.4" x2={FRAME_W - 0.4} y2={FRAME_H - 0.4} stroke="#261307" strokeWidth="0.4" />
          <line x1="0.4" y1={FRAME_H - 0.4} x2={FRAME_W - 0.4} y2={FRAME_H - 0.4} stroke="#261307" strokeWidth="0.4" />

          {/* 温润米黄艺术卡纸衬底 (Natural Cream Mat) */}
          <rect x="1.2" y="1.2" width={FRAME_W - 2.4} height={FRAME_H - 2.4} rx="0.3" fill="#fcf8f0" />

          {/* 高精度画芯 + 木屋暖调纸质质感融合 */}
          <g clipPath="url(#clip-poster-yw-small)">
            {/* 底色防闪烁 */}
            <rect x="1.8" y="1.8" width={FRAME_W - 3.6} height={FRAME_H - 3.6} fill="#203a4b" />
            <image
              href={POSTER_CATALOG['young-woman'].imageUrl}
              x="1.8"
              y="1.8"
              width={FRAME_W - 3.6}
              height={FRAME_H - 3.6}
              preserveAspectRatio="xMidYMid slice"
            />

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
            rx="0.8"
            fill="none"
            stroke="#fef08a"
            strokeWidth="0.7"
            className="opacity-0 group-hover/p1:opacity-100 transition-opacity duration-200"
          />
        </g>

        {/* ----------------------------------------------------------------------- */}
        {/* 2. 海报 2: 《还有明天》 (C'è ancora domani)                             */}
        {/* 位置：x = 79 (位于居中绿植上方，与叶片自然错落)                          */}
        {/* ----------------------------------------------------------------------- */}
        <g {...svgAction('赏析还有明天海报')}
          id="poster-ancora-domani"
          transform="translate(79, 0)"
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
            <circle cx="13" cy="-7.6" r="1.3" fill="#2d1c10" opacity="0.35" />
            <line x1="13" y1="-8" x2="4.5" y2="0.6" stroke="#9a7b56" strokeWidth="0.55" strokeLinecap="round" />
            <line x1="13" y1="-8" x2="21.5" y2="0.6" stroke="#846543" strokeWidth="0.55" strokeLinecap="round" />
            <line x1="13" y1="-8" x2="4.5" y2="0.6" stroke="#ecd7b5" strokeWidth="0.2" opacity="0.6" />
            <circle cx="13" cy="-8" r="1.2" fill="url(#brass-peg-grad)" stroke="#451a03" strokeWidth="0.25" />
            <circle cx="12.7" cy="-8.3" r="0.4" fill="#fef08a" />
          </g>

          {/* 投影 */}
          <rect
            x="1.4"
            y="1.8"
            width={FRAME_W}
            height={FRAME_H}
            rx="0.8"
            fill="#2d1c10"
            opacity="0.24"
          />

          {/* 温润实木框体 (暖橡木质感) */}
          <rect
            x="0"
            y="0"
            width={FRAME_W}
            height={FRAME_H}
            rx="0.8"
            fill="url(#cabin-oak-frame)"
            stroke="#2b170a"
            strokeWidth="0.6"
          />
          <line x1="0.4" y1="0.4" x2={FRAME_W - 0.4} y2="0.4" stroke="#9f724e" strokeWidth="0.4" />
          <line x1="0.4" y1="0.4" x2="0.4" y2={FRAME_H - 0.4} stroke="#9f724e" strokeWidth="0.4" />
          <line x1={FRAME_W - 0.4} y1="0.4" x2={FRAME_W - 0.4} y2={FRAME_H - 0.4} stroke="#281408" strokeWidth="0.4" />
          <line x1="0.4" y1={FRAME_H - 0.4} x2={FRAME_W - 0.4} y2={FRAME_H - 0.4} stroke="#281408" strokeWidth="0.4" />

          {/* 温暖棉纸内衬 */}
          <rect x="1.2" y="1.2" width={FRAME_W - 2.4} height={FRAME_H - 2.4} rx="0.3" fill="#faf5ea" />

          {/* 画芯 + 纸质柔化融合 (纯净精简矢量画作，彻底去除原图缩放后的密集噪点杂线) */}
          <g clipPath="url(#clip-poster-cd-small)">
            {/* 纯净复古温润棉纸底色 */}
            <rect x="1.8" y="1.8" width={FRAME_W - 3.6} height={FRAME_H - 3.6} fill="#faf7f0" />

            {/* 顶部优雅导演标语 (纯净小字排版) */}
            <text
              x="13.0"
              y="4.5"
              textAnchor="middle"
              fill="#8a8075"
              fontSize="0.95"
              fontWeight="600"
              letterSpacing="0.08em"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              UN FILM DI PAOLA CORTELLESI
            </text>

            {/* 罗马晨曦远景建筑色块 (极简平面几何，无任何凌乱网点噪点与黑线) */}
            {/* 左侧街景建筑体块 */}
            <polygon points="1.8,7.0 7.5,9.5 7.5,23.5 1.8,24.5" fill="#ebe4d8" />
            <polygon points="1.8,9.2 4.8,10.6 4.8,18.0 1.8,18.8" fill="#dfd6c8" opacity="0.65" />
            <rect x="2.6" y="11.5" width="1.5" height="2.2" rx="0.3" fill="#cfc5b6" />
            <rect x="2.6" y="15.0" width="1.5" height="2.2" rx="0.3" fill="#cfc5b6" />

            {/* 右侧街景建筑体块 */}
            <polygon points="24.2,6.8 18.5,9.5 18.5,23.5 24.2,24.5" fill="#ebe4d8" />
            <polygon points="24.2,9.0 21.0,10.5 21.0,18.5 24.2,19.2" fill="#dfd6c8" opacity="0.65" />
            <rect x="21.9" y="11.5" width="1.5" height="2.2" rx="0.3" fill="#cfc5b6" />
            <rect x="21.9" y="15.0" width="1.5" height="2.2" rx="0.3" fill="#cfc5b6" />

            {/* 晨曦中的罗马远景拱门 */}
            <path d="M10.4,22.0 L10.4,14.5 Q13,12.6 15.6,14.5 L15.6,22.0 Z" fill="#f1ebe0" />
            <path d="M11.2,22.0 L11.2,15.2 Q13,13.8 14.8,15.2 L14.8,22.0 Z" fill="#fcfaf6" />

            {/* 街道路面微透视基底 */}
            <polygon points="1.8,23.8 24.2,23.8 24.2,35.7 1.8,35.7" fill="#f0eae0" />
            {/* 平滑素雅的街道透视弱线条 (极淡暖灰，建立纵深，毫无杂乱噪点) */}
            <line x1="9.2" y1="23.8" x2="3.2" y2="35.7" stroke="#e0d6c8" strokeWidth="0.3" />
            <line x1="16.8" y1="23.8" x2="22.8" y2="35.7" stroke="#e0d6c8" strokeWidth="0.3" />

            {/* 主角迪莉娅 (Delia) 经典昂首迈步剪影 - 纯净色块，线条利落 */}
            {/* 人物脚底柔和接触阴影 */}
            <ellipse cx="13.0" cy="28.8" rx="3.6" ry="0.7" fill="#2d251e" opacity="0.18" />

            {/* 双腿与步伐 */}
            {/* 后步右腿 */}
            <path d="M11.8,24.8 L11.4,28.2 L12.5,28.2 L12.7,24.8 Z" fill="#ebdcd0" />
            <path d="M10.7,28.0 L12.7,28.0 L12.6,28.7 L10.3,28.7 Z" fill="#231e1c" />

            {/* 前迈左腿 */}
            <path d="M13.3,24.8 L13.9,28.0 L15.0,28.0 L14.3,24.8 Z" fill="#f3e4d8" />
            <path d="M13.5,27.8 L15.6,27.8 L15.7,28.5 L13.2,28.5 Z" fill="#231e1c" />

            {/* 1940年代高腰百褶长裙 (深黑墨灰，结构分明) */}
            <path
              d="M11.3,18.6 L14.7,18.6 Q15.6,21.5 15.9,25.2 L10.1,25.2 Q10.4,21.5 11.3,18.6 Z"
              fill="#2c2825"
            />
            {/* 裙摆褶皱立体感与受光面 */}
            <path d="M12.7,18.6 L13.3,25.2 L14.4,25.2 L13.9,18.6 Z" fill="#393430" />
            <path d="M10.1,25.2 L15.9,25.2 L15.7,25.6 L10.3,25.6 Z" fill="#1b1816" />

            {/* 经典束腰皮带 */}
            <rect x="11.2" y="18.1" width="3.6" height="0.65" rx="0.2" fill="#181514" />

            {/* 复古短袖衬衫 (纯净暖白，利落剪裁) */}
            <path d="M11.1,13.8 L14.9,13.8 L14.7,18.2 L11.3,18.2 Z" fill="#f8f5ef" />
            <path d="M12.7,13.8 L13.5,18.2 L14.6,18.2 L13.9,13.8 Z" fill="#ece5d8" />

            {/* 衬衫小翻领与领口 */}
            <path d="M12.1,13.8 L13.0,15.1 L13.9,13.8 Z" fill="#eddcd0" />
            <polygon points="11.9,13.8 12.8,14.6 12.2,15.0" fill="#ffffff" />
            <polygon points="14.1,13.8 13.2,14.6 13.8,15.0" fill="#ffffff" />

            {/* 右手臂 (自然摆动) */}
            <path d="M11.1,14.0 L9.8,16.7 L10.6,17.1 L11.7,14.7 Z" fill="#eedfd2" />

            {/* 左手臂与手提包 */}
            <path d="M14.9,14.0 L16.1,16.4 L15.5,16.9 L14.4,14.7 Z" fill="#eddcd0" />
            <path d="M15.5,16.7 Q16.3,17.7 16.1,19.1" fill="none" stroke="#221e1c" strokeWidth="0.4" />
            {/* 经典黑色小手提包 */}
            <rect x="15.3" y="18.9" width="2.3" height="2.9" rx="0.3" fill="#221e1c" />
            <rect x="16.1" y="19.6" width="0.7" height="0.5" rx="0.1" fill="#cba45d" />

            {/* 颈部与自信脸庞 */}
            <rect x="12.5" y="12.6" width="1.0" height="1.4" fill="#eddcd0" />
            <ellipse cx="13.0" cy="11.8" rx="1.3" ry="1.6" fill="#f6ece2" />
            <circle cx="12.6" cy="11.6" r="0.22" fill="#29231f" />
            <circle cx="13.4" cy="11.6" r="0.22" fill="#29231f" />
            {/* 经典红唇 */}
            <path d="M12.7,12.5 Q13.0,12.8 13.3,12.5" stroke="#a32845" strokeWidth="0.32" fill="none" strokeLinecap="round" />

            {/* 标志性1940年代浓密黑色波浪卷发 */}
            <path
              d="M11.3,12.2 Q11.1,9.7 13.0,9.5 Q14.9,9.7 14.7,12.2 Q15.1,13.2 14.5,13.8 Q13.9,14.2 13.0,14.0 Q12.1,14.2 11.5,13.8 Q10.9,13.2 11.3,12.2 Z"
              fill="#1e1b19"
            />
            <path d="M12.0,10.3 Q13.0,9.8 14.0,10.3" stroke="#463f3a" strokeWidth="0.4" fill="none" strokeLinecap="round" />

            {/* 电影标志性鲜明洋红标题标牌 (Zero noise, 鲜明利落纯净) */}
            <g>
              {/* C'È 标牌 */}
              <rect x="9.9" y="27.4" width="6.2" height="2.8" rx="0.3" fill="#e11d48" />
              <text
                x="13.0"
                y="29.4"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="1.75"
                fontWeight="900"
                letterSpacing="0.04em"
                fontFamily="'Arial Black', 'Impact', sans-serif"
              >
                C'È
              </text>

              {/* ANCORA DOMANI 主标牌 */}
              <rect x="2.5" y="29.8" width="21.0" height="4.6" rx="0.4" fill="#e11d48" />
              <text
                x="13.0"
                y="33.3"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="2.35"
                fontWeight="900"
                letterSpacing="0.03em"
                fontFamily="'Arial Black', 'Impact', 'Trebuchet MS', sans-serif"
              >
                ANCORA DOMANI
              </text>
            </g>

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
            rx="0.8"
            fill="none"
            stroke="#fef08a"
            strokeWidth="0.7"
            className="opacity-0 group-hover/p2:opacity-100 transition-opacity duration-200"
          />
        </g>

        {/* ----------------------------------------------------------------------- */}
        {/* 3. 海报 3: 《红辣椒》 (Paprika)                                         */}
        {/* 位置：x = 121 (向右拉开间距，与书架和绿植错落得宜，毫不逼仄)             */}
        {/* ----------------------------------------------------------------------- */}
        <g {...svgAction('赏析红辣椒海报')}
          id="poster-paprika"
          transform="translate(121, 0)"
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
            <circle cx="13" cy="-7.6" r="1.3" fill="#2d1c10" opacity="0.35" />
            <line x1="13" y1="-8" x2="4.5" y2="0.6" stroke="#9a7b56" strokeWidth="0.55" strokeLinecap="round" />
            <line x1="13" y1="-8" x2="21.5" y2="0.6" stroke="#846543" strokeWidth="0.55" strokeLinecap="round" />
            <line x1="13" y1="-8" x2="4.5" y2="0.6" stroke="#ecd7b5" strokeWidth="0.2" opacity="0.6" />
            <circle cx="13" cy="-8" r="1.2" fill="url(#brass-peg-grad)" stroke="#451a03" strokeWidth="0.25" />
            <circle cx="12.7" cy="-8.3" r="0.4" fill="#fef08a" />
          </g>

          {/* 投影 */}
          <rect
            x="1.4"
            y="1.8"
            width={FRAME_W}
            height={FRAME_H}
            rx="0.8"
            fill="#2d1c10"
            opacity="0.24"
          />

          {/* 温润实木框体 (深色柚木质感) */}
          <rect
            x="0"
            y="0"
            width={FRAME_W}
            height={FRAME_H}
            rx="0.8"
            fill="url(#cabin-walnut-frame)"
            stroke="#2b170a"
            strokeWidth="0.6"
          />
          <line x1="0.4" y1="0.4" x2={FRAME_W - 0.4} y2="0.4" stroke="#966a48" strokeWidth="0.4" />
          <line x1="0.4" y1="0.4" x2="0.4" y2={FRAME_H - 0.4} stroke="#966a48" strokeWidth="0.4" />
          <line x1={FRAME_W - 0.4} y1="0.4" x2={FRAME_W - 0.4} y2={FRAME_H - 0.4} stroke="#261307" strokeWidth="0.4" />
          <line x1="0.4" y1={FRAME_H - 0.4} x2={FRAME_W - 0.4} y2={FRAME_H - 0.4} stroke="#261307" strokeWidth="0.4" />

          {/* 内衬 */}
          <rect x="1.2" y="1.2" width={FRAME_W - 2.4} height={FRAME_H - 2.4} rx="0.3" fill="#faf4eb" />

          {/* 画芯 */}
          <g clipPath="url(#clip-poster-pk-small)">
            <rect x="1.8" y="1.8" width={FRAME_W - 3.6} height={FRAME_H - 3.6} fill="#1e1b4b" />
            <image
              href={POSTER_CATALOG['paprika'].imageUrl}
              x="1.8"
              y="1.8"
              width={FRAME_W - 3.6}
              height={FRAME_H - 3.6}
              preserveAspectRatio="xMidYMid slice"
            />

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
            rx="0.8"
            fill="none"
            stroke="#fef08a"
            strokeWidth="0.7"
            className="opacity-0 group-hover/p3:opacity-100 transition-opacity duration-200"
          />
        </g>
      </g>
    </g>
  );
};
