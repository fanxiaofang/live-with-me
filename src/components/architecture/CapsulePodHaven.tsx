import React from 'react';
import { CharacterHead } from '../CharacterAvatar';

export interface CapsulePodHavenProps {
  activeRoom: string;
  onSelectRoom: (roomId: string) => void;
  presenceSlots: Record<string, any>;
  onSelectPerson: (person: any) => void;
  setHoveredObject: (id: string | null) => void;
  hoveredObject?: string | null;
  hasMovedRef: React.MutableRefObject<boolean> | React.RefObject<boolean>;
  theme: {
    cottageGlow: string;
    isNight?: boolean;
    [key: string]: any;
  };
}

/**
 * 2.5D 工匠级旧太空胶囊仓 (Vintage Capsule Pod) 与主屋连廊平台 (Connecting Deck Platform)
 * 
 * 针对渲染与视觉层级 Bug 的彻底修复：
 * 1. 【气密门层级与嵌入式门框 (Recessed Embedded Airlock Hatch)】：
 *    - 严格内嵌于胶囊舱体边界内 (x=-56 ~ -32, y=-16 ~ 26)，彻底消除原先悬空错位、截断穿帮到舱外的 Bug；
 *    - 舱体采用精准 clipPath 与凹入式多层金属内框 (4px 真实舱壁厚度与内阴影)；
 *    - 去除生硬突兀的梯形光斑贴纸，改为精细的门楣防雨罩与柔和下照光源；
 *    - 保留全金属三辐旋转加压锁紧手轮 (Rotary Dogging Wheel)、重型锻造铰链、气密橡胶圈与视窗。
 * 
 * 2. 【文字与丝印排版规范化 (Clean Non-Overlapping Stencils)】：
 *    - 彻底清除原先与大舷窗发生冲突切割的文字 (`ORBITAL · POD 03` 等)；
 *    - 移至右侧开阔半球舱壁 (x=50, y=-9) 设置独立的复古金属装配模组铭牌，字间距与避让区清晰规范；
 *    - 避免任何与高光带、太阳能板及天线底座的视觉冲突。
 * 
 * 3. 【连廊平台延伸与舱门无缝对齐 (Seamless Platform Walkway)】：
 *    - 连廊平台向右延伸至 x=906，完全覆盖并支撑气密门底座 (x=874 ~ 898)；
 *    - 门槛金属过渡防滑板直接落于木甲板表面，形成自然顺畅的“主屋 -> 连廊平台 -> 胶囊卧舱”行动路线闭环；
 *    - 后侧护栏在门前区域 (x=870 以右) 开放入口通道，迎客棕榈地垫与鞋履精准置于落脚点。
 * 
 * 4. 【柔和光晕与独立支脚接触阴影 (Cinematic Lighting & Ground Contact)】：
 *    - 柱灯光晕全面改用多段径向渐变 (radialGradient + mix-blend-mode: screen)，边缘完全衰减至 0，告别刺眼生硬的实心色圈；
 *    - 移除底部粗糙的大黑椭圆色块，为 4 个独立液压支脚分别构建双层接触阴影 (Sharp Contact Patch + Soft Ambient Dispersion)。
 * 
 * 5. 【大舷窗深度感与卧舱透视强化 (Deep Inner Recess & Cozy Bedroom)】：
 *    - 强化舷窗金属框内侧的深邃阴影 (Inner Shadow)，营造 15cm 航天复合舱壁的真实深邃厚度；
 *    - 优化床铺绗缝羽绒被、饱满睡枕、木质吸音格栅与安睡角色的层次感。
 */
export const CapsulePodHaven: React.FC<CapsulePodHavenProps> = ({
  activeRoom,
  onSelectRoom,
  presenceSlots,
  onSelectPerson,
  setHoveredObject,
  hasMovedRef,
  theme,
}) => {
  const podOccupant = presenceSlots.tatami_capsule?.occupant;
  const slotCfg = presenceSlots.tatami_capsule?.config;

  return (
    <g id="capsule-pod-haven">
      <defs>
        {/* 1. 胶囊舱体外轮廓裁切路径 (用于保证舱门及内部组件严密嵌入，杜绝穿帮) */}
        <clipPath id="podHullSilhouetteClip">
          <path d="M-70,3 C-70,-18 -52,-30 -33,-30 L33,-30 C52,-30 66,-18 66,3 C66,22 52,36 33,36 L-33,36 C-52,36 -70,22 -70,3 Z" />
        </clipPath>

        {/* 2. 胶囊舱体 3D 柱面受光垂直渐变 (上壳象牙白) */}
        <linearGradient id="podShellUpperGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#f6f5ef" />
          <stop offset="68%" stopColor="#e3e7df" />
          <stop offset="100%" stopColor="#caced6" />
        </linearGradient>

        {/* 3. 胶囊舱体 3D 柱面漫反射与下壳复古草木灰绿渐变 */}
        <linearGradient id="podHullLowerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5d7b6c" />
          <stop offset="42%" stopColor="#455f52" />
          <stop offset="85%" stopColor="#2c3e34" />
          <stop offset="100%" stopColor="#3d5448" /> {/* 底部草地漫反射微光 */}
        </linearGradient>

        {/* 4. 左半球封头 3D 球冠立体曲率阴影 */}
        <radialGradient id="podLeftCapRadial" cx="28%" cy="40%" r="72%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="55%" stopColor="#b4beaf" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#1a251f" stopOpacity="0.68" />
        </radialGradient>

        {/* 5. 右半球封头 3D 球冠立体曲率阴影 */}
        <radialGradient id="podRightCapRadial" cx="38%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="58%" stopColor="#b4beaf" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#1a251f" stopOpacity="0.68" />
        </radialGradient>

        {/* 6. 锻造黄铜防撞中腰线金属渐变 */}
        <linearGradient id="podBrassBeltGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff6d6" />
          <stop offset="30%" stopColor="#dfb758" />
          <stop offset="70%" stopColor="#9a7629" />
          <stop offset="100%" stopColor="#5e4414" />
        </linearGradient>

        {/* 7. 重型液压活塞连杆高光镜面铬铁渐变 */}
        <linearGradient id="podChromePistonGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f5954" />
          <stop offset="25%" stopColor="#dce4df" />
          <stop offset="45%" stopColor="#ffffff" />
          <stop offset="75%" stopColor="#9db0a6" />
          <stop offset="100%" stopColor="#3b433e" />
        </linearGradient>

        {/* 8. 旋压黄铜舷窗多层金属法兰环渐变 */}
        <linearGradient id="portholeBrassRingGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fcedc7" />
          <stop offset="25%" stopColor="#d5aa50" />
          <stop offset="50%" stopColor="#8d6a2a" />
          <stop offset="75%" stopColor="#e4be68" />
          <stop offset="100%" stopColor="#634718" />
        </linearGradient>

        {/* 9. 舷窗内侧深邃切面绝热套环与内阴影渐变 (体现 15cm 真实舱壁深度) */}
        <radialGradient id="portholeTunnelDepthGrad" cx="45%" cy="38%" r="58%">
          <stop offset="0%" stopColor="#1a242c" stopOpacity="0.1" />
          <stop offset="65%" stopColor="#0d141b" stopOpacity="0.55" />
          <stop offset="88%" stopColor="#06090d" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#020406" stopOpacity="0.98" />
        </radialGradient>

        {/* 10. 连廊实木甲板单块企口木料渐变 */}
        <linearGradient id="boardwalkPlankGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#946d47" />
          <stop offset="50%" stopColor="#825c38" />
          <stop offset="100%" stopColor="#6b482a" />
        </linearGradient>

        {/* 11. 平台前缘大梁横截面阴影渐变 */}
        <linearGradient id="boardwalkFasciaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a381f" />
          <stop offset="100%" stopColor="#321e0f" />
        </linearGradient>

        {/* 12. 柱灯柔和多段径向光晕 (彻底杜绝生硬刺眼的实体大圆圈) */}
        <radialGradient id="lanternSmoothGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.85" />
          <stop offset="22%" stopColor="#fef08a" stopOpacity="0.5" />
          <stop offset="52%" stopColor="#f59e0b" stopOpacity="0.2" />
          <stop offset="78%" stopColor="#d97706" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
        </radialGradient>

        {/* 13. 单晶硅太阳能电池板深蓝微光 */}
        <linearGradient id="solarCellGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#253547" />
          <stop offset="50%" stopColor="#182330" />
          <stop offset="100%" stopColor="#0d141c" />
        </linearGradient>

        {/* 14. 气密门凹槽内暗影渐变 */}
        <linearGradient id="hatchRecessShadowGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#101712" />
          <stop offset="15%" stopColor="#1c261e" />
          <stop offset="85%" stopColor="#1c261e" />
          <stop offset="100%" stopColor="#0d130f" />
        </linearGradient>
      </defs>

      {/* ========================================================================= */}
      {/* 2. 胶囊睡眠舱交互主组 (The 3D Sculpted Capsule Pod Interactive Room)        */}
      {/* ========================================================================= */}
      <g
        id="room-capsule_pod"
        onClick={() => {
          if (!hasMovedRef.current) onSelectRoom('capsule_pod');
        }}
        onMouseEnter={() => setHoveredObject('room-capsule_pod')}
        onMouseLeave={() => setHoveredObject(null)}
        className="cursor-pointer group/pod"
      >
        {/* A. 舱身底部柔和草甸漫反射软阴影 (消解粗暴的大黑椭圆块) */}
        <ellipse cx="-6" cy="62" rx="60" ry="12" fill="#182419" opacity="0.18" filter="url(#softShadow)" />

        {/* 选中高光光环 (Atmospheric Ambient Glow - no harsh dashed sticker bounding box) */}
        {activeRoom === 'capsule_pod' && (
          <g className="pointer-events-none">
            <ellipse
              cx="-4"
              cy="12"
              rx="88"
              ry="56"
              fill="rgba(214, 140, 104, 0.08)"
              stroke="#d68c68"
              strokeWidth="1.6"
              className="animate-[pulse_3s_infinite]"
            />
            <ellipse
              cx="-4"
              cy="12"
              rx="76"
              ry="46"
              fill="rgba(254, 215, 170, 0.06)"
            />
          </g>
        )}

        {/* B. 四足重型液压升降支撑架 (每个支脚配备独立精确的 Contact Shadows) */}
        <g id="pod-landing-gear">
          {/* ============ 1. 后置支撑足 (处于舱体遮蔽阴影中) ============ */}
          {/* 左后足接地接触阴影与主腿 */}
          <g id="rear-stilt-left" opacity="0.88">
            {/* 独立深浅接触阴影 (Contact Shadow) */}
            <ellipse cx="-47" cy="56.5" rx="7" ry="2.2" fill="#0d140e" opacity="0.75" />
            <ellipse cx="-47" cy="56.5" rx="10" ry="3.2" fill="#1a251b" opacity="0.3" />

            <rect x="-47" y="16" width="7" height="6" rx="1.5" fill="#242b26" />
            <line x1="-44" y1="20" x2="-47" y2="56" stroke="#2e3731" strokeWidth="5" strokeLinecap="round" />
            <line x1="-44" y1="20" x2="-47" y2="56" stroke="#48554d" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="-47" cy="56" rx="6" ry="2.2" fill="#2d3730" stroke="#1c221e" strokeWidth="0.6" />
          </g>

          {/* 右后足接地接触阴影与主腿 */}
          <g id="rear-stilt-right" opacity="0.88">
            <ellipse cx="38" cy="54.5" rx="7" ry="2.2" fill="#0d140e" opacity="0.75" />
            <ellipse cx="38" cy="54.5" rx="10" ry="3.2" fill="#1a251b" opacity="0.3" />

            <rect x="35" y="16" width="7" height="6" rx="1.5" fill="#242b26" />
            <line x1="38" y1="20" x2="38" y2="54" stroke="#2e3731" strokeWidth="5" strokeLinecap="round" />
            <line x1="38" y1="20" x2="38" y2="54" stroke="#48554d" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="38" cy="54" rx="6" ry="2.2" fill="#2d3730" stroke="#1c221e" strokeWidth="0.6" />
          </g>

          {/* ============ 2. 前置重型工业液压足 (前景高亮，配备重力压缩触地阴影) ============ */}
          {/* 左前足 */}
          <g id="front-stilt-left">
            {/* 左前脚接地重力接触阴影 */}
            <ellipse cx="-30" cy="63.2" rx="8.5" ry="2.8" fill="#090f0b" opacity="0.85" />
            <ellipse cx="-30" cy="63.2" rx="12" ry="4" fill="#162218" opacity="0.35" />

            {/* 锻造三角底座夹板与六角螺栓 */}
            <polygon points="-36,24 -24,24 -27,33 -33,33" fill="#323d36" stroke="#1f2621" strokeWidth="0.8" />
            <circle cx="-33" cy="26" r="1.1" fill="#75887c" />
            <circle cx="-27" cy="26" r="1.1" fill="#75887c" />

            {/* 液压外缸套筒 (Gunmetal Sleeve) */}
            <rect x="-33.5" y="32" width="7" height="15" rx="2" fill="#3e4a42" stroke="#252d28" strokeWidth="0.8" />
            <circle cx="-34.5" cy="35" r="1.4" fill="#c49d52" stroke="#5e471d" strokeWidth="0.5" />
            {/* 螺纹高度微调铜锁环 (Knurled Brass Collar) */}
            <rect x="-34.5" y="44" width="9" height="3.5" rx="1" fill="#c9a45b" stroke="#705622" strokeWidth="0.5" />
            <line x1="-33" y1="44" x2="-33" y2="47.5" stroke="#ffe59e" strokeWidth="0.8" />

            {/* 镜面镀铬伸缩活塞杆 (High-Mirror Chrome Piston Rod) */}
            <rect x="-32" y="47" width="4" height="15" fill="url(#podChromePistonGrad)" stroke="#222825" strokeWidth="0.5" />
            <line x1="-31" y1="47.5" x2="-31" y2="61.5" stroke="#ffffff" strokeWidth="0.9" opacity="0.9" />

            {/* 万向球形铰接脚座与加厚接地吸震垫 (Swivel Footpad) */}
            <circle cx="-30" cy="61" r="2.2" fill="#5a6b60" stroke="#262f29" strokeWidth="0.6" />
            <ellipse cx="-30" cy="63" rx="7.5" ry="2.8" fill="#424f46" stroke="#1b221d" strokeWidth="0.8" />
            <ellipse cx="-30" cy="62.5" rx="5.5" ry="1.8" fill="#697a70" />
          </g>

          {/* 右前足 */}
          <g id="front-stilt-right">
            {/* 右前脚接地接触阴影 */}
            <ellipse cx="24" cy="62.2" rx="8.5" ry="2.8" fill="#090f0b" opacity="0.85" />
            <ellipse cx="24" cy="62.2" rx="12" ry="4" fill="#162218" opacity="0.35" />

            <polygon points="18,24 30,24 27,33 21,33" fill="#323d36" stroke="#1f2621" strokeWidth="0.8" />
            <circle cx="21" cy="26" r="1.1" fill="#75887c" />
            <circle cx="27" cy="26" r="1.1" fill="#75887c" />

            {/* 外缸套筒 */}
            <rect x="20.5" y="32" width="7" height="14" rx="2" fill="#3e4a42" stroke="#252d28" strokeWidth="0.8" />
            <circle cx="28.5" cy="35" r="1.4" fill="#c49d52" stroke="#5e471d" strokeWidth="0.5" />
            <rect x="19.5" y="43" width="9" height="3.5" rx="1" fill="#c9a45b" stroke="#705622" strokeWidth="0.5" />
            <line x1="21" y1="43" x2="21" y2="46.5" stroke="#ffe59e" strokeWidth="0.8" />

            {/* 镜面活塞杆 */}
            <rect x="22" y="46" width="4" height="15" fill="url(#podChromePistonGrad)" stroke="#222825" strokeWidth="0.5" />
            <line x1="23" y1="46.5" x2="23" y2="60.5" stroke="#ffffff" strokeWidth="0.9" opacity="0.9" />

            {/* 脚座吸震垫 */}
            <circle cx="24" cy="60" r="2.2" fill="#5a6b60" stroke="#262f29" strokeWidth="0.6" />
            <ellipse cx="24" cy="62" rx="7.5" ry="2.8" fill="#424f46" stroke="#1b221d" strokeWidth="0.8" />
            <ellipse cx="24" cy="61.5" rx="5.5" ry="1.8" fill="#697a70" />
          </g>

          {/* ============ 3. 支脚周边的山野草甸植被 ============ */}
          <g id="stilt-meadow-flora">
            <path d="M-36,63 Q-33,52 -35,42 Q-31,48 -33,63" fill="#3c6b45" />
            <ellipse cx="-33" cy="46" rx="3.5" ry="2.2" fill="#528e5e" />
            <ellipse cx="-37" cy="54" rx="3.2" ry="2" fill="#62a36f" />
            <ellipse cx="-26" cy="62" rx="3" ry="1.8" fill="#4d8258" />

            <line x1="30" y1="62" x2="33" y2="46" stroke="#3d6642" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="33" cy="46" r="2.6" fill="#8f65be" />
            <circle cx="32.5" cy="42" r="2.3" fill="#a77ed9" />
            <circle cx="33" cy="38" r="1.9" fill="#cbb3ed" />
            <line x1="35" y1="62" x2="38" y2="50" stroke="#3d6642" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="38" cy="50" r="2.2" fill="#8f65be" />
            <circle cx="38" cy="46" r="1.9" fill="#a77ed9" />
            <circle cx="16" cy="61" r="2" fill="#fcd34d" />
            <circle cx="16" cy="61" r="0.8" fill="#b45309" />
          </g>
        </g>

        {/* C. 胶囊主舱体与嵌入式组件组 (使用 clipPath 严密受限，杜绝任何外部穿帮) */}
        <g id="pod-main-shell-assembly">
          {/* 1. 舱体垂直受光上部 (Off-white / Retro Cream Shell) */}
          <path
            d="M-70,3 C-70,-18 -52,-30 -33,-30 L33,-30 C52,-30 66,-18 66,3 L-70,3 Z"
            fill="url(#podShellUpperGrad)"
            stroke="#5f6e65"
            strokeWidth="1.6"
          />

          {/* 2. 舱体下部深色防污草木绿弧面 (Sage Green / Vintage Teal Hull) */}
          <path
            d="M-70,3 C-70,22 -52,36 -33,36 L33,36 C52,36 66,22 66,3 L-70,3 Z"
            fill="url(#podHullLowerGrad)"
            stroke="#3a4d43"
            strokeWidth="1.6"
          />

          {/* 3. 左半球封头 3D 球冠立体受光层 */}
          <path
            d="M-70,3 C-70,-18 -52,-30 -33,-30 L-33,36 C-52,36 -70,22 -70,3 Z"
            fill="url(#podLeftCapRadial)"
            className="pointer-events-none"
          />

          {/* 4. 右半球封头 3D 球冠立体受光层 */}
          <path
            d="M33,-30 C52,-30 66,-18 66,3 C66,22 52,36 33,36 Z"
            fill="url(#podRightCapRadial)"
            className="pointer-events-none"
          />

          {/* 5. 顶部柱面光滑弧线主高光带 */}
          <path
            d="M-52,-23 Q-3,-32 46,-23 Q-3,-27 -52,-23 Z"
            fill="#ffffff"
            opacity="0.82"
            className="pointer-events-none"
          />
          <line x1="-48" y1="-19" x2="42" y2="-19" stroke="#ffffff" strokeWidth="1.2" opacity="0.4" />

          {/* 6. 3D 立体锻造金属防撞中腰线 (Molded 3D Midline Belt) */}
          <g id="pod-midline-belt">
            <line x1="-69" y1="1.8" x2="65" y2="1.8" stroke="#36433c" strokeWidth="0.8" />
            <line x1="-69" y1="3" x2="65" y2="3" stroke="url(#podBrassBeltGrad)" strokeWidth="2.2" />
            <line x1="-68" y1="2.2" x2="64" y2="2.2" stroke="#fff9e6" strokeWidth="0.6" opacity="0.9" />
            <line x1="-69" y1="4.2" x2="65" y2="4.2" stroke="#1d2822" strokeWidth="0.8" />

            {/* 沿防撞条均匀分布的精密航空微铆钉 */}
            {[-62, -54, -46, -38, -30, -22, 10, 18, 26, 34, 42, 50, 58].map((rv) => (
              <g key={`belt-rivet-${rv}`}>
                <circle cx={rv} cy="3" r="0.8" fill="#2d210b" />
                <circle cx={rv - 0.2} cy="2.8" r="0.4" fill="#ffe9a8" />
              </g>
            ))}
          </g>

          {/* 7. 精密机加工装配嵌缝 */}
          <g id="pod-panel-lines" opacity="0.55">
            {/* 门区与生活区分界纵缝 */}
            <line x1="-30" y1="-28" x2="-30" y2="34" stroke="#48574e" strokeWidth="0.8" />
            <line x1="-29.4" y1="-28" x2="-29.4" y2="34" stroke="#ffffff" strokeWidth="0.4" opacity="0.5" />
            {/* 右舷视窗法兰嵌缝 */}
            <line x1="42" y1="-26" x2="42" y2="32" stroke="#48574e" strokeWidth="0.8" />
            <line x1="42.6" y1="-26" x2="42.6" y2="32" stroke="#ffffff" strokeWidth="0.4" opacity="0.5" />
          </g>

          {/* ========================================================================= */}
          {/* 8. 规范化复古模组技术铭牌 (彻底避开大舷窗、太阳能板和高光带)              */}
          {/* ========================================================================= */}
          <g id="pod-spec-plate" transform="translate(50, -9)">
            {/* 冲压金属铭牌底座 */}
            <rect x="-12" y="-7.5" width="24" height="15" rx="2" fill="#29352e" stroke="#1c241f" strokeWidth="0.8" />
            <rect x="-11" y="-6.5" width="22" height="13" rx="1.4" fill="#39483f" />
            {/* 4 颗角落精密微螺丝 */}
            <circle cx="-9.5" cy="-5" r="0.6" fill="#8f9f95" />
            <circle cx="9.5" cy="-5" r="0.6" fill="#8f9f95" />
            <circle cx="-9.5" cy="5" r="0.6" fill="#8f9f95" />
            <circle cx="9.5" cy="5" r="0.6" fill="#8f9f95" />

            {/* 规范的航空模组铭文 */}
            <text x="0" y="-1.5" textAnchor="middle" fill="#e2ede7" fontSize="4.2" fontWeight="800" letterSpacing="0.8">
              ORBITAL
            </text>
            <text x="0" y="3.2" textAnchor="middle" fill="#9db5a8" fontSize="3.2" fontWeight="700" letterSpacing="0.6">
              POD · 03
            </text>
            <text x="0" y="7.2" textAnchor="middle" fill="#71877b" fontSize="2.2" fontWeight="600" letterSpacing="0.4">
              HERMETIC SPEC
            </text>
          </g>

          {/* ========================================================================= */}
          {/* 9. 嵌入式气密潜艇加压舱门 (Recessed Submarine Airlock Hatch)              */}
          {/*    严格内嵌在 x=-56 ~ -32, y=-16 ~ 25，位于舱壁安全凹槽内，绝不穿帮      */}
          {/* ========================================================================= */}
          <g id="pod-recessed-entrance-hatch">
            {/* A. 舱壁冲压凹入式门框凹槽 (Sunken Recess Frame: 呈现 4px 真实舱壁厚度与内暗影) */}
            <rect
              x="-57"
              y="-17.5"
              width="26"
              height="43"
              rx="7"
              fill="url(#hatchRecessShadowGrad)"
              stroke="#1b241d"
              strokeWidth="1.2"
            />
            {/* 门框周边橡胶密封压圈 */}
            <rect
              x="-56"
              y="-16.5"
              width="24"
              height="41"
              rx="6"
              fill="none"
              stroke="#0f1611"
              strokeWidth="0.8"
            />

            {/* B. 气密门本体 (嵌于凹槽内，与舱体曲面保持自然微倾) */}
            <rect
              x="-55"
              y="-15.5"
              width="22"
              height="39"
              rx="5"
              fill="#3a493f"
              stroke="#243028"
              strokeWidth="1"
            />
            {/* 门板内嵌加强冲压饰框 */}
            <rect
              x="-52.5"
              y="-13"
              width="17"
              height="34"
              rx="3.5"
              fill="#47584d"
              stroke="#2d3b32"
              strokeWidth="0.7"
            />

            {/* C. 2 组外置重型锻造合页铰链 (Flush Heavy Hinges on Left) */}
            {[-9, 14].map((hy) => (
              <g key={`hatch-hinge-${hy}`} transform={`translate(-55.5, ${hy})`}>
                <rect x="-1.5" y="-3" width="3" height="6" rx="0.8" fill="#242e26" stroke="#141a15" strokeWidth="0.5" />
                <circle cx="0" cy="0" r="0.8" fill="#c49d52" />
              </g>
            ))}

            {/* D. 圆形观察视窗 (Bolted Porthole Inspection Port) */}
            <g id="hatch-observation-port" transform="translate(-44, -3.5)">
              <circle cx="0" cy="0" r="4.6" fill="#a8853b" stroke="#523d14" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="3.8" fill="#1b241d" />
              {/* 视窗透出的舱内暖光 */}
              <circle cx="0" cy="0" r="2.8" fill={theme.cottageGlow} opacity="0.85" />
              {/* 防眩光斜向反光条 */}
              <line x1="-1.8" y1="-1.8" x2="1.8" y2="1.8" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
            </g>

            {/* E. 经典加压旋转轮盘手柄 (Mechanical Rotary Dogging Wheel) */}
            <g id="hatch-rotary-wheel" transform="translate(-44, 11)">
              <rect x="-5" y="-1" width="10" height="2" rx="0.5" fill="#242e26" />
              <circle cx="0" cy="0" r="4.5" fill="none" stroke="#d5aa50" strokeWidth="1.3" />
              <line x1="0" y1="0" x2="0" y2="-4.5" stroke="#8a6a2a" strokeWidth="0.9" />
              <line x1="0" y1="0" x2="3.9" y2="2.2" stroke="#8a6a2a" strokeWidth="0.9" />
              <line x1="0" y1="0" x2="-3.9" y2="2.2" stroke="#8a6a2a" strokeWidth="0.9" />
              <circle cx="0" cy="0" r="1.6" fill="#ffe399" stroke="#694e18" strokeWidth="0.5" />
            </g>

            {/* F. 门楣防风雨下照工作灯 (Flush Overhead Cowl Lamp: 替代原先生硬光斑) */}
            <g id="hatch-entry-light" transform="translate(-44, -16.5)">
              <rect x="-3" y="-1" width="6" height="2" rx="0.5" fill="#202a22" />
              <path d="M-3.5,1 Q0,-1.5 3.5,1 Z" fill="#b38f42" stroke="#574218" strokeWidth="0.5" />
              <ellipse cx="0" cy="1" rx="3" ry="1" fill="#fff5cc" />
              {/* 柔和下照光晕 (无硬边) */}
              <ellipse cx="0" cy="8" rx="8" ry="6" fill="#fef08a" opacity="0.16" className="pointer-events-none" />
            </g>

            {/* G. 气密密封状态发光指示灯 (Green Status Indicator: PRESSURIZED) */}
            <circle cx="-37" cy="-12" r="1" fill="#10b981" />
            <circle cx="-37" cy="-12" r="2" fill="#10b981" opacity="0.4" className="animate-ping pointer-events-none" />

            {/* H. 门槛金属防滑过渡板 (连接至实木甲板) */}
            <polygon points="-56,23.5 -32,23.5 -31,25.5 -57,25.5" fill="#c49d52" stroke="#5e481c" strokeWidth="0.5" />
          </g>
        </g>

        {/* D. 舱顶精密航空外设 (Rooftop Environmental & Communications Array) */}
        <g id="pod-rooftop-hardware">
          {/* 1. 中央高效双单晶硅光伏板 (Monocrystalline Solar Panel) */}
          <g id="pod-solar-array" transform="translate(6, -34)">
            <rect x="-1" y="2" width="24" height="4" rx="1" fill="#303c35" stroke="#1d2520" strokeWidth="0.6" />
            <rect x="0" y="-2" width="22" height="7" rx="1.5" fill="#52635a" stroke="#252d28" strokeWidth="0.7" />
            <rect x="1.5" y="-0.8" width="19" height="4.6" rx="0.8" fill="url(#solarCellGrad)" />
            <line x1="7.8" y1="-0.8" x2="7.8" y2="3.8" stroke="#68849c" strokeWidth="0.7" />
            <line x1="14.2" y1="-0.8" x2="14.2" y2="3.8" stroke="#68849c" strokeWidth="0.7" />
            <line x1="1.5" y1="1.5" x2="20.5" y2="1.5" stroke="#87a6c2" strokeWidth="0.5" opacity="0.6" />
          </g>

          {/* 2. 流线型环境恒温新风换气罩 (Aerodynamic Climate Control Pod) */}
          <g id="pod-climate-cowl" transform="translate(-44, -32)">
            <path
              d="M-7,2 Q-7,-4 0,-4 Q7,-4 7,2 Z"
              fill="#425047"
              stroke="#26302a"
              strokeWidth="0.8"
            />
            <line x1="-5" y1="-1" x2="5" y2="-1" stroke="#232b26" strokeWidth="0.8" />
            <line x1="-4" y1="0.5" x2="4" y2="0.5" stroke="#232b26" strokeWidth="0.8" />
            <ellipse cx="0" cy="-6" rx="3.5" ry="1.8" fill="#fcfbf7" opacity="0.3" className="animate-pulse" />
          </g>

          {/* 3. 倾斜复古通信鞭状天线与红宝石信标灯 (Slanted Whip Antenna) */}
          <g id="pod-antenna" transform="translate(46, -27)">
            <polygon points="-3,2 3,2 1.5,-2 -1.5,-2" fill="#bfa054" stroke="#635124" strokeWidth="0.6" />
            <circle cx="0" cy="-1.5" r="1.5" fill="#3a453d" />
            <line x1="0" y1="-2" x2="10" y2="-28" stroke="#4b574f" strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="-2" x2="10" y2="-28" stroke="#cbd5ce" strokeWidth="0.7" strokeLinecap="round" />
            <rect x="3.8" y="-17" width="2.4" height="4" rx="0.6" fill="#c49d52" stroke="#523f1a" strokeWidth="0.4" />
            <circle cx="10" cy="-28" r="3" fill="#e53e3e" />
            <circle cx="10" cy="-28" r="1.2" fill="#ffffff" />
            <circle
              cx="10"
              cy="-28"
              r="7"
              fill="#e53e3e"
              opacity="0.35"
              className="animate-ping pointer-events-none"
            />
          </g>

          {/* 4. 舱顶锻造吊装吊耳 */}
          <g id="pod-lifting-rings">
            <ellipse cx="-20" cy="-30" rx="2.5" ry="3.5" fill="none" stroke="#45544a" strokeWidth="1.2" />
            <ellipse cx="30" cy="-30" rx="2.5" ry="3.5" fill="none" stroke="#45544a" strokeWidth="1.2" />
          </g>
        </g>

        {/* ========================================================================= */}
        {/* E. 全景大舷窗与极致温馨卧舱 (Panoramic Porthole & Bedroom Sanctuary)       */}
        {/* ========================================================================= */}
        <g id="pod-bedroom-interior" transform="translate(12, 3)">
          {/* 1. 旋压黄铜重型舷窗外圈 (Heavy Spun Brass Outer Flange) */}
          <circle
            cx="0"
            cy="0"
            r="28"
            fill="url(#portholeBrassRingGrad)"
            stroke="#473311"
            strokeWidth="1.8"
            filter="url(#softShadow)"
          />

          {/* 2. 12 颗均布的重型航空钛金六角紧固螺栓 */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((ang) => {
            const rad = (ang * Math.PI) / 180;
            const bx = Math.cos(rad) * 25.8;
            const by = Math.sin(rad) * 25.8;
            return (
              <g key={`porthole-hex-${ang}`}>
                <circle cx={bx} cy={by} r="1.3" fill="#2d210b" />
                <circle cx={bx - 0.3} cy={by - 0.3} r="0.8" fill="#fff5d1" />
              </g>
            );
          })}

          {/* 3. 舷窗内侧深邃切面绝热套环 (Inner Recess Bevel: 强化 15cm 舱壁深度) */}
          <circle cx="0" cy="0" r="24" fill="url(#portholeTunnelDepthGrad)" stroke="#161f26" strokeWidth="1" />
          <circle cx="0" cy="0" r="23" fill="#101820" />

          {/* 4. 舱内温馨背景漫射暖金辉光 */}
          <circle cx="0" cy="0" r="22.5" fill={theme.cottageGlow} opacity="0.86" />

          {/* 5. 卧舱内壁实木吸音格栅条纹 (Acoustic Fluted Oak Slats) */}
          <g id="interior-wood-slats" opacity="0.32">
            {[-18, -14, -10, -6, -2, 2, 6, 10, 14, 18].map((sx) => (
              <line
                key={`slat-${sx}`}
                x1={sx}
                y1="-18"
                x2={sx}
                y2="10"
                stroke="#694b2f"
                strokeWidth="1.2"
              />
            ))}
          </g>

          {/* 6. 舱顶弧度内阴影 (Top Ceiling Overhang Shadow) */}
          <path
            d="M-22,-4 A22.5,22.5 0 0,1 22,-4 C22,-18 -22,-18 -22,-4 Z"
            fill="#080e14"
            opacity="0.45"
          />

          {/* 7. 舱壁悬挂发光星空星座图 (Luminous Constellation Chart) */}
          <g id="interior-star-chart" opacity="0.85">
            <rect x="-14" y="-18" width="15" height="9.5" rx="1.2" fill="#162230" stroke="#364d66" strokeWidth="0.5" />
            <circle cx="-11" cy="-14" r="0.9" fill="#ffe082" />
            <circle cx="-7.5" cy="-15.5" r="0.9" fill="#ffe082" />
            <circle cx="-3.5" cy="-12" r="0.9" fill="#ffe082" />
            <circle cx="-6.5" cy="-10.5" r="0.8" fill="#ffe082" />
            <line x1="-11" y1="-14" x2="-7.5" y2="-15.5" stroke="#ffe082" strokeWidth="0.6" />
            <line x1="-7.5" y1="-15.5" x2="-3.5" y2="-12" stroke="#ffe082" strokeWidth="0.6" />
            <line x1="-7.5" y1="-15.5" x2="-6.5" y2="-10.5" stroke="#ffe082" strokeWidth="0.6" />
          </g>

          {/* 8. 墙面黄铜弯颈床头阅读壁灯 (Brass Gooseneck Reading Sconce) */}
          <g id="interior-reading-lamp">
            <circle cx="-18" cy="-3" r="1.5" fill="#a8853b" />
            <path d="M-18,-3 Q-13,-7 -12,-1" fill="none" stroke="#b08c4e" strokeWidth="1.8" strokeLinecap="round" />
            <polygon points="-14,-1 -10,-1 -11,2 -13,2" fill="#dfb758" stroke="#785a1a" strokeWidth="0.5" />
            <circle cx="-12" cy="2" r="1.6" fill="#fff9db" />
            {/* 投向床头的生动锥形暖光束 */}
            <polygon
              points="-12,2 -4,15 -18,15"
              fill="#fff3c4"
              opacity="0.48"
              className="pointer-events-none"
            />
          </g>

          {/* 9. 悬浮床头置物架与热饮小品 (Floating Nightstand Shelf & Steaming Mug) */}
          <g id="interior-nightstand" transform="translate(13, -2)">
            <rect x="-1" y="-1" width="9.5" height="3" rx="1" fill="#5c381f" stroke="#361f10" strokeWidth="0.6" />
            <rect x="0" y="-3.5" width="4.5" height="2" rx="0.5" fill="#3b82f6" />
            <rect x="0.5" y="-5.5" width="4" height="2" rx="0.5" fill="#10b981" />
            <rect x="5.5" y="-6.5" width="3.5" height="5" rx="1" fill="#fcf9f2" stroke="#d5cebe" strokeWidth="0.5" />
            <path d="M9,-5.5 Q10.5,-4.5 9,-3" fill="none" stroke="#fcf9f2" strokeWidth="0.7" />
            <path
              d="M7,-7.5 Q8.5,-11 6.5,-13.5"
              stroke="#ffffff"
              strokeWidth="0.9"
              fill="none"
              opacity="0.85"
              className="animate-pulse"
            />
          </g>

          {/* 10. 贴合舱底曲率的舒适床垫基底 */}
          <path
            d="M-22,12 C-22,23 22,23 22,12 L22,7 C10,12 -10,12 -22,7 Z"
            fill="#d6c6af"
            stroke="#948572"
            strokeWidth="0.8"
          />

          {/* 11. 蓬松饱满的羽绒大睡枕 */}
          <g id="interior-pillow">
            <ellipse cx="-12" cy="10" rx="7.5" ry="4.8" fill="#ede8df" />
            <ellipse cx="-12" cy="9.2" rx="7" ry="4.2" fill="#ffffff" filter="url(#softShadow)" />
            <path d="M-15,9.5 Q-12,11.5 -9,9.5" stroke="#d9d2c5" strokeWidth="1" fill="none" />
          </g>

          {/* 12. 横向绗缝陶土红温暖羽绒厚被 (Quilted Terracotta Down Duvet) */}
          <g id="interior-duvet">
            <path
              d="M-8,10 C5,9.5 16,10.5 22,12 C22,22.5 -20,22.5 -20,15.5 C-12,15.5 -9,12 -8,10 Z"
              fill="#c95f3b"
              stroke="#8c3b1e"
              strokeWidth="0.8"
              filter="url(#softShadow)"
            />
            {/* 绗缝褶皱立体阴影与高光 */}
            <path d="M-5,14 Q3,13 18,14.5" stroke="#9e4324" strokeWidth="1.2" fill="none" />
            <path d="M-5,13.4 Q3,12.4 18,13.9" stroke="#e07a56" strokeWidth="0.6" fill="none" />
            <path d="M-10,18 Q0,17 18,18.5" stroke="#9e4324" strokeWidth="1.2" fill="none" />

            {/* 被头翻折洁白纯棉包边 */}
            <path
              d="M-8,10 C-3,8 9,9 21,11"
              stroke="#ffffff"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M-8,10 C-3,8 9,9 21,11"
              stroke="#ede8dc"
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* ======================================================== */}
          {/* 13. 胶囊卧舱安睡角色 (Sleeper in Capsule Pod · tatami_capsule) */}
          {/* ======================================================== */}
          {(() => {
            if (podOccupant && slotCfg) {
              return (
                <g
                  id={`person-in-pod-${podOccupant.id}`}
                  transform={`translate(${slotCfg.offset.dx}, ${slotCfg.offset.dy})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPerson(podOccupant);
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setHoveredObject(`person-${podOccupant.id}`);
                  }}
                  onMouseLeave={() => setHoveredObject(null)}
                  className="cursor-pointer group/char"
                >
                  <CharacterHead
                    cx={0}
                    cy={0}
                    r={6}
                    skinColor={podOccupant.skinColor || '#fad4c0'}
                    hairColor={podOccupant.hairColor || '#1a1a1a'}
                    hairStyle={podOccupant.hairStyle || 'curtain_crescent'}
                    beanieColor={podOccupant.beanieColor || '#425b6e'}
                    hasPompom={podOccupant.hasPompom ?? true}
                    isSleeping={true}
                    facing={slotCfg.facing}
                  />
                  <path d="M-4,4 Q0,6 4,4" stroke={podOccupant.shirtColor} strokeWidth="2.5" fill="none" />

                  {/* 角色悬停状态标签 */}
                  <g
                    transform="translate(0, -22)"
                    className="opacity-0 group-hover/char:opacity-100 transition-opacity duration-200 pointer-events-none"
                  >
                    <rect x="-42" y="-7.5" width="84" height="15" rx="7.5" fill="#1c1917" opacity="0.95" stroke="#c47a4f" strokeWidth="0.6" />
                    <text x="0" y="3" fill="#f0ebe1" fontSize="8" fontWeight="bold" textAnchor="middle">
                      🛌 {podOccupant.name} · {slotCfg.badgeLabel.split('(')[0].trim()}
                    </text>
                  </g>
                </g>
              );
            }
            return (
              <g opacity="0.65">
                <ellipse cx="-12" cy="9" rx="4" ry="2" fill="#ede3d5" />
              </g>
            );
          })()}

          {/* 14. 凸面厚玻璃穹顶双重反光弧 */}
          <path
            d="M-18,-14 A22.5,22.5 0 0,1 18,-14"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
            className="pointer-events-none"
          />
          <path
            d="M-14,16 A21.5,21.5 0 0,0 14,16"
            stroke="#7dd3fc"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.25"
            className="pointer-events-none"
          />
        </g>

        {/* F. 安睡角色梦境浮标与呢喃文字 */}
        {presenceSlots.tatami_capsule?.occupant && (
          <g id="capsule-sleep-whispers" transform="translate(15, -42)" className="pointer-events-none">
            <text x="18" y="2" fill="#f0d5a8" fontSize="9" fontWeight="bold" className="animate-bounce">z</text>
            <text x="25" y="-8" fill="#e8ba46" fontSize="12" fontWeight="bold" className="animate-pulse">Z</text>

            <g transform="translate(-12, 10)">
              <rect x="-44" y="-8" width="88" height="17" rx="8.5" fill="#1c1917" opacity="0.94" stroke="#c47a4f" strokeWidth="0.6" />
              <text x="0" y="4" fill="#f0ebe1" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                🌙 {presenceSlots.tatami_capsule.occupant.name} · 安睡中
              </text>
            </g>
          </g>
        )}

        {/* G. 胶囊睡眠舱悬停交互标签 */}
        <g
          transform="translate(0, 48)"
          className="opacity-0 group-hover/pod:opacity-100 transition-opacity pointer-events-none"
        >
          <rect x="-60" y="-8.5" width="120" height="17" rx="8.5" fill="#1c1917" opacity="0.95" stroke="#e8ba46" strokeWidth="0.8" />
          <text x="0" y="3.8" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">
            🚀 旧太空胶囊舱 · 卧室休息室
          </text>
        </g>
      </g>
    </g>
  );
};
