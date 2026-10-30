import React, { useId } from 'react';
import type { YorkshireSceneTheme } from '../scenery/yorkshire/landscapeTypes';

// The same view across all three times; only light and the visibility of detail change.
const windowPalettes = {
  day: { sky: ['#bfdbfe', '#dbeafe', '#fef08a', '#a3e635'], hills: '#7c92b8', wheat: '#eab308', meadow: '#65a30d', reflection: '#ffffff', reflectionStrength: .12, curtain: '#f5ede0', curtainShade: '#d5c8b5', floorLight: '#ffe6a5', floorStrength: .09 },
  dusk: { sky: ['#94749f', '#e8ac95', '#edbb6d', '#8fa04c'], hills: '#82708a', wheat: '#d79b37', meadow: '#768a38', reflection: '#ffe0ad', reflectionStrength: .09, curtain: '#efd9b7', curtainShade: '#c7ab83', floorLight: '#ffc677', floorStrength: .10 },
  night: { sky: ['#203c5d', '#345675', '#5d7280', '#405e45'], hills: '#465c7b', wheat: '#8a8045', meadow: '#416b3d', reflection: '#a5cbe4', reflectionStrength: .045, curtain: '#e3ceb0', curtainShade: '#bea584', floorLight: '#9dc4e0', floorStrength: .025 },
};
export function CottageWindow({ theme }: { theme: YorkshireSceneTheme }) {
  const time = theme.isNight ? 'night' : theme.timeOfDay ?? 'day';
  const p = windowPalettes[time];
  const id = 'cottage-window-' + useId().replace(/:/g, '');
  return (<g id="isometric-bay-window" data-window-time={time}>
                {/* 墙体窗洞阴影与外实木窗框 (严格顺应左墙等轴测坡度 k = -77/270 ≈ -0.2852，尺寸收敛至精致 72x52px) */}
                <polygon
                  points="-225,29.3 -155,9.3 -155,61.3 -225,81.3"
                  fill="#452f1e"
                  stroke="#2c1d12"
                  strokeWidth="1.5"
                />

                {/* 窗洞内凹暗部与右侧厚度壁 (向内凹陷 3px 进深) */}
                <polygon
                  points="-222,31.0 -158,12.7 -158,59.7 -222,78.0"
                  fill="#23170e"
                />
                {/* 窗洞上内壁阴影面 */}
                <polygon
                  points="-222,31.0 -158,12.7 -158,15.7 -222,34.0"
                  fill="#180f08"
                />

                {/* Sunlit Glass Pane with Translucent Vista (通透半透明采光观景窗：天光渐变) */}
                <defs>
                  <clipPath id={`${id}-pane`}><polygon points="-219,34.5 -160,17.7 -160,58.5 -219,75.3" /></clipPath>
                  <linearGradient id={`${id}-vista`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={p.sky[0]} stopOpacity="0.88" />
                    <stop offset="30%" stopColor={p.sky[1]} stopOpacity="0.82" />
                    <stop offset="60%" stopColor={p.sky[2]} stopOpacity="0.75" />
                    <stop offset="100%" stopColor={p.sky[3]} stopOpacity="0.72" />
                  </linearGradient>
                </defs>
                <polygon
                  points="-219,34.5 -160,17.7 -160,58.5 -219,75.3"
                  fill={`url(#${id}-vista)`}
                />

                {/* 正确的约克郡风光地貌纵深层次： */}
                {/* 1. 远景：连绵起伏的黛青紫蓝群山微景 (Distant Yorkshire Dales) */}
                <path
                  d="M-219,45 Q-190,32 -160,38 L-160,46 Q-190,40 -219,47 Z"
                  fill={p.hills}
                  opacity="0.45"
                />
                {/* 2. 中景：层叠起伏的金黄麦浪丘陵与微缩石墙 (Rolling Wheat Fields) */}
                <path
                  d="M-219,47 Q-185,38 -160,44 L-160,52 Q-185,47 -219,53 Z"
                  fill={p.wheat}
                  opacity="0.65"
                />
                {/* 约克郡干石墙微小暗色轮廓 (Drystone Wall silhouette) */}
                <path
                  d="M-219,52 Q-185,46 -160,51"
                  stroke="#574635"
                  strokeWidth="0.8"
                  fill="none"
                  opacity="0.5"
                />
                {/* 3. 近景（窗根下方）：温润丰美的生机草甸坡地与野花点缀 (Near Green Pasture Meadow) */}
                <path
                  d="M-219,53 Q-188,48 -160,52 L-160,58.5 L-219,75.3 Z"
                  fill={p.meadow}
                  opacity="0.75"
                />
                {/* 草地野花小碎点 */}
                <g opacity={time === 'night' ? .12 : .8}>
                  <circle cx="-195" cy="58" r=".9" fill="#f7d86b" />
                  <circle cx="-175" cy="54" r=".8" fill="#fff3cc" />
                  <circle cx="-205" cy="64" r=".9" fill="#f7d86b" />
                </g>


                {/* Soft diagonal sunbeams on glass (通透玻璃高光与斜射晨光) */}
                <polygon points="-215,35 -202,31 -182,68 -195,72" fill={p.reflection} opacity={p.reflectionStrength} />
                <polygon points="-192,27 -181,24 -165,56 -176,59" fill={p.reflection} opacity={p.reflectionStrength * .6} />
                {time === 'night' && <g clipPath={`url(#${id}-pane)`}>
                  <circle cx="-180" cy="29" r=".55" fill="#d4e7f5" opacity=".7" />
                  <circle cx="-168" cy="26" r=".35" fill="#d4e7f5" opacity=".55" />
                  {/* A faint reflection of the indoor lamp, not another outdoor sun. */}
                  <path d="M-211,48 Q-209,43 -207,47 L-206,54 Q-208,57 -210,54 Z" fill="#ffc96b" opacity=".16" />
                </g>}

                {/* 2.5D Window Mullions (田字格实木窗棂：竖棂严格垂直向下，横棂严格沿左墙轴倾斜 k = -0.2852) */}
                <line x1="-189.5" y1="26.0" x2="-189.5" y2="67.0" stroke="#4a3321" strokeWidth="2.0" />
                <line x1="-219" y1="54.8" x2="-160" y2="38.0" stroke="#4a3321" strokeWidth="2.0" />

                {/* Curtain Rod above Window (窗帘挂杆：严格沿左墙轴倾斜 k = -0.2852) */}
                <line x1="-229" y1="28.0" x2="-151" y2="5.8" stroke="#382415" strokeWidth="2.0" strokeLinecap="round" />
                <circle cx="-229" cy="28.0" r="2.2" fill="#523924" />
                <circle cx="-151" cy="5.8" r="2.2" fill="#523924" />

                {/* Cozy Linen Curtain on Left side (微卷亚麻米白窗帘与红陶扎带) */}
                <path
                  d="M-227,29 Q-222,46 -225,64 Q-228,74 -224,82 L-219,84 Q-223,74 -220,64 Q-217,46 -222,30 Z"
                  fill={p.curtain}
                  stroke={p.curtainShade}
                  strokeWidth="0.8"
                />
                <ellipse cx="-222" cy="64" rx="3.2" ry="1.8" fill="#c47a4f" />

                {/* Sunlight Cast onto Timber Floor (从调整后的窗户自然倾泻在桌面与地面的暖金光斑) */}
                <polygon
                  points="-222,78.0 -158,59.7 -122,86.0 -192,106.0"
                  fill={p.floorLight}
                  opacity={p.floorStrength}
                  className="pointer-events-none"
                />
              </g>
  );
}
