import React from 'react';

/**
 * 2.5D 轴测便携轻薄笔记本电脑
 * 包含键盘基座、俯仰微仰显示屏、青空荧光屏面、代码流光与屏幕柔光
 */
export const LaptopDisplay: React.FC = () => {
  return (
    <g id="component-isometric-laptop" className="select-none">
      {/* 1. 底部漫反射微阴影 (严格遵循 ±0.2852 桌面轴测四边形) */}
      <polygon points="-15,-2.2 0,-6.5 15,-2.2 0,2.1" fill="#24160d" opacity="0.22" filter="url(#softShadow)" />

      {/* 2. C 面机身底座厚度立面 (Front-Left & Front-Right Chamfer Faces) */}
      {/* 靠近视角的左前立面 (V 轴方向: 斜率 +0.2857) */}
      <polygon points="-14,-3 0,1 0,2.8 -14,-1.2" fill="#0f172a" />
      {/* 靠近视角的右前立面 (U 轴方向: 斜率 -0.2857) */}
      <polygon points="0,1 14,-3 14,-1.2 0,2.8" fill="#1e293b" />

      {/* 3. 笔记本 C 面键盘底座顶面 (严格等轴测菱形: 四边均为 |斜率|=0.2857) */}
      <polygon points="-14,-3 0,-7 14,-3 0,1" fill="#334155" />

      {/* 3.1 键盘微凹键区 (Recessed Keyboard Well) */}
      <polygon points="-11,-2.8 -1,-5.6 9,-2.8 -1,0" fill="#1e293b" />
      {/* 键帽高光条纹 (微等宽键盘列) */}
      <line x1="-8" y1="-2.6" x2="6" y2="-2.6" stroke="#0f172a" strokeWidth="0.8" opacity="0.6" />
      <line x1="-6" y1="-3.6" x2="4" y2="-3.6" stroke="#0f172a" strokeWidth="0.8" opacity="0.6" />

      {/* 3.2 一体化精密触控板 (Trackpad) */}
      <polygon points="-2,0.1 2,-1 3,-0.7 -1,0.4" fill="#273549" stroke="#1e293b" strokeWidth="0.3" />

      {/* 4. 屏幕与键盘转轴连接机构 (Ergonomic Cylindrical Hinge Seam) */}
      {/* 转轴底槽阴影缝隙 (沿 U 轴方向: 斜率 -0.2857) */}
      <line x1="-13" y1="-3.3" x2="-1" y2="-6.7" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
      {/* 精密金属转轴柱体 (Metallic Hinge Barrel) */}
      <line x1="-12" y1="-3.6" x2="-2" y2="-6.5" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="-11.5" y1="-3.9" x2="-2.5" y2="-6.5" stroke="#94a3b8" strokeWidth="0.5" strokeLinecap="round" opacity="0.8" />

      {/* 5. A/B 面外壳厚度与上盖 (Lid Shell & Side/Top Thickness) */}
      {/* 屏幕左侧厚度立面 (0.8px 铝合金边框侧沿) */}
      <polygon points="-14.8,-3.2 -14,-3 -14,-17 -14.8,-17.2" fill="#1e293b" />
      {/* 屏幕顶部厚度上沿 (斜率严格 -0.2857) */}
      <polygon points="-14.8,-17.2 -14,-17 0,-21 -0.8,-21.2" fill="#334155" />

      {/* 6. B 面屏幕外框正面 (Bezel Front Face) */}
      <polygon points="-14,-3 0,-7 0,-21 -14,-17" fill="#1e293b" stroke="#0f172a" strokeWidth="0.5" />

      {/* 7. 青空护眼高分液晶屏 (LCD Screen Panel: 四周绝对均等 1px 边框, 屏面斜率严格 -0.2857) */}
      <polygon points="-13,-3.8 -1,-7.2 -1,-19.8 -13,-16.4" fill="#38bdf8" opacity="0.92" />
      {/* 屏幕荧光漫反射层 (Soft Screen Glow) */}
      <polygon points="-13,-3.8 -1,-7.2 -1,-19.8 -13,-16.4" fill="#bae6fd" opacity="0.32" />

      {/* 8. 屏幕代码行 (Code Lines: 每一行均严格按斜率 -0.2857 渲染，与屏边、转轴完全平行) */}
      {/* 第一行: Δx = 7.0, Δy = -2.0, 斜率 -0.2857 */}
      <line x1="-11" y1="-14.0" x2="-4" y2="-16.0" stroke="#0369a1" strokeWidth="0.9" strokeLinecap="round" />
      {/* 第二行: Δx = 5.25, Δy = -1.5, 斜率 -0.2857 */}
      <line x1="-11" y1="-11.5" x2="-5.75" y2="-13.0" stroke="#0369a1" strokeWidth="0.9" strokeLinecap="round" />
      {/* 第三行: Δx = 8.75, Δy = -2.5, 斜率 -0.2857 (修正了原先向下耷拉至-0.20的错乱角度) */}
      <line x1="-11" y1="-9.0" x2="-2.25" y2="-11.5" stroke="#0369a1" strokeWidth="0.9" strokeLinecap="round" />
    </g>
  );
};

/**
 * 2.5D 复古墨绿银行家台灯
 * 包含重质黄铜铸造底座、微弯黄铜灯颈、墨绿透光玻璃灯罩与桌面暖光光晕
 */
export const BankerLampDisplay: React.FC = () => {
  return (
    <g id="component-banker-lamp" className="select-none">
      {/* 桌面暖黄光晕 (Soft Light Pool on Desk) */}
      <ellipse cx="6" cy="-1" rx="13" ry="6.5" fill="#fef08a" opacity="0.24" className="pointer-events-none" />

      {/* 底座投影 */}
      <ellipse cx="0" cy="1" rx="4" ry="1.8" fill="#24160d" opacity="0.3" />

      {/* Brass Base */}
      <ellipse cx="0" cy="0" rx="3.5" ry="1.6" fill="#d97706" />

      {/* Curved Brass Neck */}
      <path d="M0,0 Q-1,-12 4,-15" stroke="#b45309" strokeWidth="1.4" fill="none" />

      {/* Green Glass Hood */}
      <ellipse
        cx="5"
        cy="-15"
        rx="5.5"
        ry="2.8"
        fill="#166534"
        stroke="#14532d"
        strokeWidth="0.7"
        transform="rotate(15 5 -15)"
      />
      {/* 灯罩顶部微光 */}
      <ellipse
        cx="4"
        cy="-16.2"
        rx="3"
        ry="1.2"
        fill="#4ade80"
        opacity="0.4"
        transform="rotate(15 4 -16.2)"
      />
    </g>
  );
};

/**
 * 2.5D 手作白瓷温热咖啡杯 / 水杯
 * 包含白瓷杯身、咖啡液面、圆润把手与冉冉升起的治愈蒸汽
 */
export const CoffeeMugDisplay: React.FC = () => {
  return (
    <g id="component-coffee-mug" className="select-none">
      {/* 杯底微阴影 */}
      <ellipse cx="0" cy="1" rx="3.3" ry="1.5" fill="#24160d" opacity="0.25" />

      {/* 白瓷底座与侧面 */}
      <ellipse cx="0" cy="0" rx="3" ry="1.4" fill="#fcf9f2" />
      <rect x="-3" y="-5" width="6" height="5" fill="#fcf9f2" />

      {/* 杯口外沿 */}
      <ellipse cx="0" cy="-5" rx="3" ry="1.4" fill="#ffffff" stroke="#e5e0d3" strokeWidth="0.5" />

      {/* 醇厚咖啡/热茶液面 */}
      <ellipse cx="0" cy="-5" rx="2.2" ry="1.0" fill="#543312" />

      {/* 杯把手 */}
      <path d="M3,-4 C4.5,-4 4.5,-1.5 3,-1.5" stroke="#fcf9f2" strokeWidth="0.9" fill="none" />

      {/* 飘动的热气微雾 (Steam) */}
      <path
        d="M0,-7 Q-1.5,-11 1,-15"
        stroke="#ffffff"
        strokeWidth="0.9"
        fill="none"
        opacity="0.7"
        className="animate-pulse"
      />
    </g>
  );
};
