import type { WorldViewId } from '../../types';
import React from 'react';
import type { PresenceAllocation } from '../../features/presence/presenceAllocation';
import type { Person, RoomId } from '../../types';
import type { InteractionTarget } from '../../world/interactions/interactionTypes';
import { ContactGroundShadow, SoftContactShadow } from '../../world/render/GroundShadow';
import { svgAction } from '../../world/interactions/svgAction';
import { CharacterHead } from '../CharacterAvatar';
import { MeadowWearPatch } from '../scenery/yorkshire/dressing/MeadowWearPatch';
import type { YorkshireSceneTheme } from '../scenery/yorkshire/landscapeTypes';
import { CapsuleStonePlatform } from './CapsuleStonePlatform';

export interface CapsulePodHavenProps {
  onSelectRoom: (roomId: WorldViewId) => void;
  presenceSlots: PresenceAllocation['slots'];
  onSelectPerson: (person: Person) => void;
  setHoveredObject: (target: InteractionTarget | null) => void;
  hasMovedRef: React.MutableRefObject<boolean> | React.RefObject<boolean>;
  theme: Pick<YorkshireSceneTheme, 'roadColor' | 'hillGreenFar'> & {
    cottageGlow: string;
    isNight?: boolean;
    isRainy?: boolean;
    timeOfDay?: YorkshireSceneTheme['timeOfDay'];
  };
}

/** Detached retro sleeping pod, preserving its original frontal silhouette. */
export const CapsulePodHaven: React.FC<CapsulePodHavenProps> = React.memo(({
  onSelectRoom,
  presenceSlots,
  onSelectPerson,
  setHoveredObject,
  hasMovedRef,
  theme,
}) => {
  const podOccupant = presenceSlots.tatami_capsule?.occupant;
  const slotCfg = presenceSlots.tatami_capsule?.config;
  const gearMaterialId = 'pod-gear-' + React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const plantingSoil = theme.isNight ? '#3d4235' : theme.timeOfDay === 'dusk' ? '#786e55' : '#8a8066';
  const plantingMoss = theme.isNight ? '#4e5d43' : theme.timeOfDay === 'dusk' ? '#72764f' : '#7c845c';
  const plantingCore = theme.isNight ? '#353b30' : theme.timeOfDay === 'dusk' ? '#655e49' : '#726b55';

  return (
    <g id="capsule-pod-haven" data-capsule-design="original">
      <defs>
        {/* 1. 胶囊舱体外轮廓裁切路径 (用于保证舱门及内部组件严密嵌入，杜绝穿帮) */}
        <clipPath id="podHullSilhouetteClip">
          <path d="M-70,3 C-70,-18 -52,-30 -33,-30 L33,-30 C52,-30 66,-18 66,3 C66,22 52,36 33,36 L-33,36 C-52,36 -70,22 -70,3 Z" />
        </clipPath>

        <clipPath id="podBedroomAperture"><circle r="22.5" /></clipPath>

        {/* 2. 胶囊舱体 3D 柱面受光垂直渐变 (上壳象牙白) */}
        <linearGradient id="podShellUpperGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5f0df" />
          <stop offset="20%" stopColor="#eee9d9" />
          <stop offset="68%" stopColor="#dce0d1" />
          <stop offset="100%" stopColor="#bfc8bf" />
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
          <stop offset="0%" stopColor="#e2ca8b" />
          <stop offset="30%" stopColor="#bc984e" />
          <stop offset="70%" stopColor="#896b34" />
          <stop offset="100%" stopColor="#594729" />
        </linearGradient>

        {/* 7. 重型液压活塞连杆高光镜面铬铁渐变 */}
        <linearGradient id="podChromePistonGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f5954" />
          <stop offset="25%" stopColor="#dce4df" />
          <stop offset="45%" stopColor="#dce1d6" />
          <stop offset="75%" stopColor="#9db0a6" />
          <stop offset="100%" stopColor="#3b433e" />
        </linearGradient>

        <linearGradient id={`${gearMaterialId}-podHydraulicCylinderGrad`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3e4c42" />
          <stop offset="16%" stopColor="#849487" />
          <stop offset="34%" stopColor="#6b7b6f" />
          <stop offset="72%" stopColor="#526157" />
          <stop offset="100%" stopColor="#354239" />
        </linearGradient>
        <linearGradient id={`${gearMaterialId}-podHydraulicRodGrad`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#354239" />
          <stop offset="22%" stopColor="#8e9e91" />
          <stop offset="40%" stopColor="#c1cdbf" />
          <stop offset="68%" stopColor="#829286" />
          <stop offset="100%" stopColor="#435047" />
        </linearGradient>
        <linearGradient id={`${gearMaterialId}-podLadderBeamGrad`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#70816f" /><stop offset="0.32" stopColor="#4e6452" /><stop offset="1" stopColor="#2e4033" />
        </linearGradient>
        <linearGradient id={`${gearMaterialId}-podFootPadWallGrad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#66766a" />
          <stop offset="42%" stopColor="#4b594f" />
          <stop offset="100%" stopColor="#303b33" />
        </linearGradient>
        <linearGradient id={`${gearMaterialId}-podFootPadTopGrad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8e9d8c" />
          <stop offset="55%" stopColor="#71816f" />
          <stop offset="100%" stopColor="#536451" />
        </linearGradient>
        <radialGradient id={`${gearMaterialId}-podBallJointGrad`} cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#9aa99b" />
          <stop offset="42%" stopColor="#68796d" />
          <stop offset="100%" stopColor="#3c493f" />
        </radialGradient>

        {/* 8. 旋压黄铜舷窗多层金属法兰环渐变 */}
        <linearGradient id="portholeBrassRingGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8d5a1" />
          <stop offset="25%" stopColor="#c2a05a" />
          <stop offset="50%" stopColor="#806638" />
          <stop offset="75%" stopColor="#cda85f" />
          <stop offset="100%" stopColor="#604c2d" />
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

      <MeadowWearPatch id="pod-entry-grass-wear" theme={theme}
        transform="translate(-62,79) scale(0.42,0.26)" />

      <CapsuleStonePlatform theme={theme} />

      {/* ========================================================================= */}
      {/* 2. 胶囊睡眠舱交互主组 (The 3D Sculpted Capsule Pod Interactive Room)        */}
      {/* ========================================================================= */}
      <g {...svgAction('旧太空胶囊仓')}
        id="room-capsule_pod"
        onClick={() => {
          if (!hasMovedRef.current) onSelectRoom('capsule_pod');
        }}
        onMouseEnter={() => setHoveredObject({ kind: 'room', id: 'capsule_pod' })}
        onMouseLeave={() => setHoveredObject(null)}
        className="cursor-pointer group/pod"
      >
        {/* A. TerrainMass owns broad ground AO; landing-gear contacts stay local. */}


        {/* B. 四足重型液压升降支撑架 (每个支脚配备独立精确的 Contact Shadows) */}
        <g id="pod-landing-gear">
          {/* ============ 1. 后置支撑足 (处于舱体遮蔽阴影中) ============ */}
          {/* 左后足接地接触阴影与主腿 */}
          <g id="rear-stilt-left" opacity="0.88">
            {/* 独立深浅接触阴影 (Contact Shadow) */}
            <SoftContactShadow cx={-47} cy={56.45} rx={7.6} ry={2.4} color="#233126" opacity={0.09} />
            <ContactGroundShadow cx={-47} cy={56.45} rx={5.4} ry={1.7} color="#121913" opacity={0.3} />

            <rect x="-47" y="16" width="7" height="6" rx="1.5" fill="#242b26" />
            <ellipse cx="-47" cy="56.45" rx="6" ry="2.2" fill="#354139" />
            <path d="M-53,54.8 A6,2.2 0 0 1 -41,54.8 L-41,56.45 A6,2.2 0 0 1 -53,56.45 Z" fill={`url(#${gearMaterialId}-podFootPadWallGrad)`} />
            <ellipse cx="-47" cy="54.8" rx="6" ry="2.2" fill={`url(#${gearMaterialId}-podFootPadTopGrad)`} />
            <ellipse cx="-47" cy="54.8" rx="2.35" ry="0.8" fill="#4d6052" />
            <path d="M-45.9,20 H-42.1 L-45.1,54.8 H-48.9 Z" fill={`url(#${gearMaterialId}-podHydraulicRodGrad)`} />
            <path d="M-44.8,20 L-47.8,54.5" fill="none" stroke="#a0afa1" strokeWidth="0.42" opacity="0.55" />
          </g>

          {/* 右后足接地接触阴影与主腿 */}
          <g id="rear-stilt-right" opacity="0.88">
            <SoftContactShadow cx={38} cy={54.45} rx={7.6} ry={2.4} color="#233126" opacity={0.09} />
            <ContactGroundShadow cx={38} cy={54.45} rx={5.4} ry={1.7} color="#121913" opacity={0.3} />

            <rect x="35" y="16" width="7" height="6" rx="1.5" fill="#242b26" />
            <ellipse cx="38" cy="54.45" rx="6" ry="2.2" fill="#354139" />
            <path d="M32,52.8 A6,2.2 0 0 1 44,52.8 L44,54.45 A6,2.2 0 0 1 32,54.45 Z" fill={`url(#${gearMaterialId}-podFootPadWallGrad)`} />
            <ellipse cx="38" cy="52.8" rx="6" ry="2.2" fill={`url(#${gearMaterialId}-podFootPadTopGrad)`} />
            <ellipse cx="38" cy="52.8" rx="2.35" ry="0.8" fill="#4d6052" />
            <path d="M36.1,20 H39.9 L39.9,52.8 H36.1 Z" fill={`url(#${gearMaterialId}-podHydraulicRodGrad)`} />
            <path d="M37.2,20 L37.2,52.5" fill="none" stroke="#a0afa1" strokeWidth="0.42" opacity="0.55" />
          </g>

          {/* ============ 2. 前置重型工业液压足 (前景高亮，配备重力压缩触地阴影) ============ */}
          {/* 左前足 */}
          <g id="front-stilt-left">
            {/* 左前脚接地重力接触阴影 */}
            <SoftContactShadow cx={-20} cy={63.15} rx={9.2} ry={3} color="#223126" opacity={0.14} />
            <ContactGroundShadow cx={-20} cy={63.1} rx={6.2} ry={2} color="#101712" opacity={0.46} />

            {/* 锻造三角底座夹板与六角螺栓 */}
            <polygon points="-26,24 -14,24 -17,33 -23,33" fill="#323d36" stroke="#58685d" strokeWidth="0.5" />
            <circle cx="-23" cy="26" r="1.1" fill="#75887c" />
            <circle cx="-17" cy="26" r="1.1" fill="#75887c" />

            {/* 液压外缸套筒 (Gunmetal Sleeve) */}
            <rect x="-23.5" y="32" width="7" height="15" rx="2" fill={`url(#${gearMaterialId}-podHydraulicCylinderGrad)`} stroke="#5c6b60" strokeWidth="0.55" />
            <path d="M-18.5,32.5 Q-16.5,32 -16.5,34 V45 Q-16.5,46.8 -18.5,46.8 Z" fill="#344239" opacity="0.52" />
            <line x1="-22.5" y1="34" x2="-22.5" y2="45" stroke="#b0bcae" strokeWidth="0.42" opacity="0.48" />
            <circle cx="-24.5" cy="35" r="1.4" fill="#c49d52" stroke="#806f49" strokeWidth="0.4" />
            {/* 螺纹高度微调铜锁环 (Knurled Brass Collar) */}
            <rect x="-24.5" y="44" width="9" height="3.5" rx="1" fill="#c9a45b" stroke="#9b8760" strokeWidth="0.36" />
            <line x1="-23" y1="44" x2="-23" y2="47.5" stroke="#ffe59e" strokeWidth="0.6" />

            {/* 镜面镀铬伸缩活塞杆 (High-Mirror Chrome Piston Rod) */}
            <rect x="-22" y="47" width="4" height="15" fill={`url(#${gearMaterialId}-podHydraulicRodGrad)`} stroke="#617066" strokeWidth="0.32" />
            <line x1="-21" y1="47.5" x2="-21" y2="61.5" stroke="#dfe6d6" strokeWidth="0.5" opacity="0.22" />

            {/* 万向球形铰接脚座与加厚接地吸震垫 (Swivel Footpad) */}
            <ellipse cx="-20" cy="63.1" rx="7.5" ry="2.5" fill="#354139" />
            <path d="M-27.5,61.5 A7.5,2.5 0 0 1 -12.5,61.5 L-12.5,63.1 A7.5,2.5 0 0 1 -27.5,63.1 Z" fill={`url(#${gearMaterialId}-podFootPadWallGrad)`} />
            <ellipse cx="-20" cy="61.5" rx="7.5" ry="2.5" fill={`url(#${gearMaterialId}-podFootPadTopGrad)`} />
            <ellipse cx="-20" cy="61.5" rx="2.8" ry="0.9" fill="#45564a" />
            <rect x="-22" y="57.5" width="4" height="3.2" fill={`url(#${gearMaterialId}-podHydraulicRodGrad)`} />
            <line x1="-21" y1="57.5" x2="-21" y2="60.5" stroke="#dfe6d6" strokeWidth="0.4" opacity="0.22" />
            <path d="M-22,59.6 Q-20,58.7 -18,59.6 L-17.7,61 Q-20,62 -22.3,61 Z" fill={`url(#${gearMaterialId}-podBallJointGrad)`} />
            <path d="M-26.4,61.6 Q-23,63.5 -19.3,63.5" fill="none" stroke="#9eae9e" strokeWidth="0.35" opacity="0.55" />
          </g>

          {/* 右前足 */}
          <g id="front-stilt-right">
            {/* 右前脚接地接触阴影 */}
            <SoftContactShadow cx={24} cy={62.15} rx={9.2} ry={3} color="#223126" opacity={0.14} />
            <ContactGroundShadow cx={24} cy={62.1} rx={6.2} ry={2} color="#101712" opacity={0.46} />

            <polygon points="18,24 30,24 27,33 21,33" fill="#323d36" stroke="#58685d" strokeWidth="0.5" />
            <circle cx="21" cy="26" r="1.1" fill="#75887c" />
            <circle cx="27" cy="26" r="1.1" fill="#75887c" />

            {/* 外缸套筒 */}
            <rect x="20.5" y="32" width="7" height="14" rx="2" fill={`url(#${gearMaterialId}-podHydraulicCylinderGrad)`} stroke="#5c6b60" strokeWidth="0.55" />
            <path d="M25,32.5 Q27,32 27,34 V44 Q27,45.8 25,45.8 Z" fill="#344239" opacity="0.52" />
            <line x1="21.5" y1="34" x2="21.5" y2="44" stroke="#b0bcae" strokeWidth="0.42" opacity="0.48" />
            <circle cx="28.5" cy="35" r="1.4" fill="#c49d52" stroke="#806f49" strokeWidth="0.4" />
            <rect x="19.5" y="43" width="9" height="3.5" rx="1" fill="#c9a45b" stroke="#9b8760" strokeWidth="0.36" />
            <line x1="21" y1="43" x2="21" y2="46.5" stroke="#ffe59e" strokeWidth="0.6" />

            {/* 镜面活塞杆 */}
            <rect x="22" y="46" width="4" height="15" fill={`url(#${gearMaterialId}-podHydraulicRodGrad)`} stroke="#617066" strokeWidth="0.32" />
            <line x1="23" y1="46.5" x2="23" y2="60.5" stroke="#dfe6d6" strokeWidth="0.5" opacity="0.22" />

            {/* 脚座吸震垫 */}
            <ellipse cx="24" cy="62.1" rx="7.5" ry="2.5" fill="#354139" />
            <path d="M16.5,60.5 A7.5,2.5 0 0 1 31.5,60.5 L31.5,62.1 A7.5,2.5 0 0 1 16.5,62.1 Z" fill={`url(#${gearMaterialId}-podFootPadWallGrad)`} />
            <ellipse cx="24" cy="60.5" rx="7.5" ry="2.5" fill={`url(#${gearMaterialId}-podFootPadTopGrad)`} />
            <ellipse cx="24" cy="60.5" rx="2.8" ry="0.9" fill="#45564a" />
            <rect x="22" y="56.5" width="4" height="3.2" fill={`url(#${gearMaterialId}-podHydraulicRodGrad)`} />
            <line x1="23" y1="56.5" x2="23" y2="59.5" stroke="#dfe6d6" strokeWidth="0.4" opacity="0.22" />
            <path d="M22,58.6 Q24,57.7 26,58.6 L26.3,60 Q24,61 21.7,60 Z" fill={`url(#${gearMaterialId}-podBallJointGrad)`} />
            <path d="M17.6,60.6 Q21,62.5 24.7,62.5" fill="none" stroke="#9eae9e" strokeWidth="0.35" opacity="0.55" />
          </g>

          {/* ============ 3. 支脚周边的山野草甸植被 ============ */}
          <g id="stilt-meadow-flora">
            <g id="pod-stilt-planting-pockets" pointerEvents="none">
              {/* Recessed earth follows each joint; moss hugs its edges rather than forming beads. */}
              <path d="M-26.9,62.1 L-26.9,63.4 L-27.4,64.5 L-27.6,65.5 L-28.2,66.2 L-28.6,67.1 L-29.3,67.6 L-29.1,66.6 L-29.3,65.8 L-28.7,65 L-28.7,63.9 L-27.7,63.1Z" fill={plantingSoil} />
              <path d="M-27.3,62.8 L-27.5,64.1 L-28.2,65.2 L-28.6,66.4 L-29,67.1 L-28.8,65.7 L-28,63.7Z" fill={plantingCore} opacity="0.62" />
              <path d="M-28.7,63.8 L-28.6,64.5 Q-29.5,65 -29.7,66.1 L-29.2,65.9 L-28.7,65.1 L-28.1,64.7 L-28.2,64Z" fill={plantingMoss} />

              <path d="M34.5,60.6 L35.4,61 L35.7,61.8 L36.7,62.3 L37,63.1 L38,63.8 L38,64.7 L38.9,66.3 L37.8,65.6 L37.3,64.6 L36.3,64.2 L35.9,63.5 L34.9,63 L34.8,62 L34.2,61.4Z" fill={plantingSoil} />
              <path d="M34.7,61.1 L35.6,62.1 L36.5,62.5 L36.9,63.5 L37.6,64.1 L38.3,65.6 L37.1,64.5 L36,63.8 L35.5,62.7 L34.7,62Z" fill={plantingCore} opacity="0.72" />
              <path d="M34.2,61.2 Q33.9,62 34.6,62.7 L35.1,63 L35.5,63.6 L36.2,63.8 L36,63.3 L35.3,62.8 L35,62.2 L34.5,62Z M37.7,64.1 L38.2,64.4 L38.7,65.6 L38.1,65.3 L37.9,64.7 L37.4,64.5Z" fill={plantingMoss} />
            </g>

            <g id="pod-vine">
              {/* The main vine lifts gently from the seam and climbs the cylinder. */}
              <path d="M-27.8,64.1 C-27.7,61.1 -26.4,58.1 -25.7,54.4" fill="none" stroke="#3c6b45" strokeWidth="0.72" strokeLinecap="round" />
            </g>

            <g id="pod-purple-flowers">
              <path d="M36,63.1 C35.5,61.3 35.9,59.5 35.6,57.8 C35.1,53.7 33.6,50.1 34.2,46 L34.2,38" fill="none" stroke="#3d6642" strokeWidth="0.95" strokeLinecap="round" />
              <path d="M36.1,63.1 C35.6,60.9 37,59.2 37.5,57.8 C38.6,54.7 39.3,52.2 38.8,50 L38.8,46" fill="none" stroke="#3d6642" strokeWidth="0.8" strokeLinecap="round" />
              <path d="M36,62.9 C34.7,62.9 32.2,62.1 32.7,61.1 C33.3,60.1 35.4,61.1 36,62.9Z" fill="#4d8258" />
              <path d="M36,62.9 C36.6,61.1 38.3,60.6 38.8,61.4 C39.1,62.2 37.4,62.9 36,62.9Z" fill="#528e5e" />
              <circle cx="34.2" cy="46" r="2.6" fill="#8f65be" />
              <circle cx="33.7" cy="42" r="2.3" fill="#a77ed9" />
              <circle cx="34.2" cy="38" r="1.9" fill="#cbb3ed" />
              <circle cx="38.8" cy="50" r="2.2" fill="#8f65be" />
              <circle cx="38.8" cy="46" r="1.9" fill="#a77ed9" />
            </g>

            <g id="pod-yellow-flower">
              <path d="M-28.6,66.4 C-29.2,65.7 -29.7,64.4 -29.9,62.8" fill="none" stroke="#3d6642" strokeWidth="0.48" strokeLinecap="round" />
              <ellipse cx="-28.9" cy="65" rx="1" ry="0.5" fill="#4d8258" transform="rotate(-28 -28.9 65)" />
              <circle cx="-29.9" cy="62.8" r="1.7" fill="#fcd34d" />
              <circle cx="-29.9" cy="62.8" r="0.68" fill="#b45309" />
            </g>

            {/* A continuous near lip hides the stem tips inside the recessed joint. */}
            <path d="M-28.7,64.4 L-28.1,63.9 L-27.7,64 L-27.4,63.7 L-27.4,64.5 L-28,65.3 L-28.2,66.2 L-28.8,66.8 L-29.1,66.4 L-28.5,65.3Z" fill={plantingSoil} />
            <path d="M-28.7,64.5 L-28.2,64.3 L-28.1,65 L-28.6,65.5 L-28.8,66.2 L-29.1,66.1 L-28.9,65.3Z" fill={plantingMoss} />
            <path d="M35.2,63.1 L35.7,62.9 L36.1,63.1 L36.4,62.8 L36.7,63.7 L37.2,64 L37.5,64.7 L36.7,64.3 L36.1,63.9 L35.7,63.8Z" fill={plantingSoil} />
            <path d="M35.1,63.1 L35.6,63.2 L35.8,63.6 L36.4,63.9 L36.8,64.4 L36.1,64.1 L35.5,63.9Z" fill={plantingMoss} />
          </g>
        </g>

        {/* C. 胶囊主舱体与嵌入式组件组 (使用 clipPath 严密受限，杜绝任何外部穿帮) */}
        <g id="pod-main-shell-assembly">
          {/* 1. 舱体垂直受光上部 (Off-white / Retro Cream Shell) */}
          <path
            d="M-70,3 C-70,-18 -52,-30 -33,-30 L33,-30 C52,-30 66,-18 66,3 L-70,3 Z"
            fill="url(#podShellUpperGrad)"
            stroke="#6b796e"
            strokeWidth="1.1"
          />

          {/* 2. 舱体下部深色防污草木绿弧面 (Sage Green / Vintage Teal Hull) */}
          <path
            d="M-70,3 C-70,22 -52,36 -33,36 L33,36 C52,36 66,22 66,3 L-70,3 Z"
            fill="url(#podHullLowerGrad)"
            stroke="#4b6154"
            strokeWidth="1.1"
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

          {/* 5. 经日晒的烤漆保留宽弱反光，避免连续镜面亮带。 */}
          <path
            d="M-52,-23 Q-3,-32 46,-23 Q-3,-27 -52,-23 Z"
            fill="#fff8e5"
            opacity="0.36"
            className="pointer-events-none"
          />
          <path d="M-47,-19 L-33,-19 M-23,-19 L-12,-19" stroke="#fff8e5" strokeWidth="0.7" opacity="0.25" />

          {/* Weathering follows seams and exposed edges; large paint planes stay quiet. */}
          <g id="pod-shell-weathering" pointerEvents="none" clipPath="url(#podHullSilhouetteClip)">
            <path d="M-29,-25 Q-27.5,-19 -28.4,-12 L-29.3,-17 Z M43,-24 Q45,-19 44,-17 L43,-20 Z"
              fill="#978967" opacity=".2" />
            <path d="M-61,16 L-59,17 L-59.8,18.3 L-62,17.5 Z M46,27 L49,26.6 L50.3,27.4 L47.4,28.3 Z M-25,32.5 L-21,33 L-22,34 L-26,33.6 Z"
              fill="#8e9a83" opacity="0.75" />
            <path d="M-61.5,17.3 L-60.3,17.7 M47,27.8 L48.6,27.4" fill="none" stroke="#384b41" strokeWidth="0.45" />
            {/* One small brush-applied repair below the right-hand identification plate. */}
            <path id="pod-repair-paint" d="M46,12.2 L55,11.7 L56.2,13.1 L55.8,20.3 L53.6,20 L47,20.7 L46.3,18.8 Z"
              fill="#617d68" opacity="0.88" />
            <path d="M48,13.4 L53.8,13 M48.1,18.8 L51.2,18.6" fill="none" stroke="#85967a" strokeWidth="0.45" opacity="0.48" />


          </g>

          {/* 6. 3D 立体锻造金属防撞中腰线 (Molded 3D Midline Belt) */}
          <g id="pod-midline-belt">
            <line x1="-69" y1="1.8" x2="65" y2="1.8" stroke="#526057" strokeWidth="0.58" opacity="0.78" />
            <line x1="-69" y1="3" x2="65" y2="3" stroke="url(#podBrassBeltGrad)" strokeWidth="2.2" opacity="0.82" />
            <path d="M-66,2.2 H-58 M-28,2.2 H-19 M43,2.2 H54 M59,2.2 H63" stroke="#f0e4c7" strokeWidth="0.45" opacity="0.45" />
            <line x1="-69" y1="4.2" x2="65" y2="4.2" stroke="#536057" strokeWidth="0.58" opacity="0.62" />
            <path d="M-63,3.8 H-60 M49,3.8 H52 M60,3.8 H63" stroke="#71816d" strokeWidth="0.5" opacity="0.55" />

            {/* 沿防撞条均匀分布的精密航空微铆钉 */}
            {[-62, -54, -46, -38, -30, -22, 10, 18, 26, 34, 42, 50, 58].map((rv) => (
              <g key={`belt-rivet-${rv}`}>
                <circle cx={rv} cy="3" r="0.8" fill="#594b2c" opacity="0.78" />
                <circle cx={rv - 0.2} cy="2.8" r="0.4" fill="#f5e2b3" opacity="0.45" />
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
          <g id="pod-spec-plate" transform="translate(50, -9) scale(0.92)">
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
              {'ORBITAL'}
            </text>
            <text x="0" y="3.2" textAnchor="middle" fill="#9db5a8" fontSize="3.2" fontWeight="700" letterSpacing="0.6">
              {'POD · 03'}
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
            <path d="M-51,25 L-47,25 M-45,24.8 L-40,24.8 M-54.6,17 L-54.3,19.5"
              fill="none" stroke="#d3c398" strokeWidth="0.65" opacity="0.75" pointerEvents="none" />
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
          <g id="pod-climate-cowl" transform="translate(-44, -28.6)">
            {/* A. 贴合舱顶三次贝塞尔弧线的精密密封垫与超薄紧固法兰 (优雅消除突兀棱角与断层) */}
            <path
              d="M-7,2.7 Q0,0.6 7,-0.5 L7,-1.6 Q0,-0.5 -7,1.6 Z"
              fill="#2e3c33"
              stroke="#1b251f"
              strokeWidth="0.6"
            />
            {/* 法兰上缘微高光倒角 */}
            <path d="M-6.5,1.5 Q0,-0.6 6.5,-1.7" stroke="#60796a" strokeWidth="0.4" fill="none" opacity="0.85" />
            {/* 左右对齐的沉头航空紧固微铆钉 */}
            <circle cx="-4.5" cy="0.5" r="0.5" fill="#9db0a4" />
            <circle cx="4.5" cy="-1.1" r="0.5" fill="#9db0a4" />

            {/* B. 低风阻曲面一体化整流罩壳 (柔和起伏，与舱顶弧线自然交融) */}
            <path
              d="M-5.5,1.4 C-5.5,-2.2 -3.2,-5.4 0,-5.4 C3.2,-5.4 5.5,-3.2 5.5,-1.8 Q0,-0.7 -5.5,1.4 Z"
              fill="#435549"
              stroke="#253229"
              strokeWidth="0.75"
            />
            {/* 罩身顶部金属受光丝滑高光弧 */}
            <path d="M-3.8,-2.2 Q0,-4.5 3.8,-2.7" stroke="#87a391" strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.75" />

            {/* C. 顺应倾角的微型横向进排风导流百叶 (Airflow Micro-Louvers) */}
            <line x1="-2.8" y1="-3.2" x2="2.8" y2="-4.0" stroke="#1d2720" strokeWidth="0.75" strokeLinecap="round" />
            <line x1="-2.8" y1="-3.0" x2="2.8" y2="-3.8" stroke="#5b7465" strokeWidth="0.3" strokeLinecap="round" />
            <line x1="-3.5" y1="-1.6" x2="3.5" y2="-2.4" stroke="#1d2720" strokeWidth="0.75" strokeLinecap="round" />
            <line x1="-3.5" y1="-1.4" x2="3.5" y2="-2.2" stroke="#5b7465" strokeWidth="0.3" strokeLinecap="round" />

            {/* D. 罩顶微型嵌入式低风阻工况航标灯 (Flush Beacon Jewel: 典雅紧凑，不突兀拔高) */}
            <ellipse cx="0" cy="-5.5" rx="1.6" ry="0.6" fill="#222c24" stroke="#151d17" strokeWidth="0.3" />
            <ellipse cx="0" cy="-6.0" rx="1.3" ry="0.7" fill="#6ee7b7" />
            <circle cx="-0.3" cy="-6.2" r="0.35" fill="#ffffff" />
            <circle cx="0" cy="-6.0" r="2.2" fill="#6ee7b7" opacity="0.3" className="animate-pulse pointer-events-none" />
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

        </g>

        {/* ========================================================================= */}
        {/* The climbing canopy crosses in front of the hull; roots stay beneath the soil lip. */}
        <g id="pod-vine-canopy" pointerEvents="none">
          <path d="M-25.7,54.4 C-25.1,50.9 -22.5,48.4 -22.8,44 C-23.1,40.5 -22.6,37.7 -21.5,35.2" fill="none" stroke="#3c6b45" strokeWidth="0.95" strokeLinecap="round" />
          <path d="M-21.5,35.2 Q-20.8,33.9 -21.3,33.3" fill="none" stroke="#3c6b45" strokeWidth="0.65" strokeLinecap="round" />
          <path d="M-25.7,54.4 C-22.8,53.2 -19.1,51.6 -18.4,48 C-18,45.7 -17.4,43 -18,40.5 Q-18.5,39 -19.1,39.7 Q-19.5,40.4 -18.8,40.7" fill="none" stroke="#3c6b45" strokeWidth="0.65" strokeLinecap="round" />
          <path d="M-25.7,54.4 L-27,54 M-19.7,51.3 L-20.8,51.5 M-21.5,35.2 L-20.8,34.9" fill="none" stroke="#3c6b45" strokeWidth="0.65" strokeLinecap="round" />
          <ellipse cx="-23" cy="46" rx="3.5" ry="2.2" fill="#528e5e" />
          <ellipse cx="-27" cy="54" rx="3.2" ry="2" fill="#62a36f" />
          <ellipse cx="-20.8" cy="51.5" rx="3" ry="1.8" fill="#4d8258" transform="rotate(-10 -20.8 51.5)" />
          <ellipse cx="-20.6" cy="34.8" rx="1.8" ry="1.15" fill="#528e5e" transform="rotate(-24 -20.6 34.8)" />
        </g>

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

          {/* 局部铜绿留在下缘凹处，凸缘仍保留金属反光。 */}
          <path d="M-23.2,13 A26.6,26.6 0 0,0 -18.2,19.4 M16.5,20.9 A26.6,26.6 0 0,0 20,17.5"
            fill="none" stroke="#596f56" strokeWidth="1.1" opacity="0.62" pointerEvents="none" />

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

          <g clipPath="url(#podBedroomAperture)">
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

          {/* 8. 墙面黄铜弯颈床头阅读壁灯 (Brass Gooseneck Bedside Reading Sconce) */}
          <g id="interior-reading-lamp">
            {/* 墙壁金属法兰底座与电源微开关 */}
            <rect x="-19.5" y="-4.5" width="2.2" height="3.6" rx="0.8" fill="#bfa054" stroke="#68501e" strokeWidth="0.4" />
            <circle cx="-18.4" cy="-2.7" r="0.6" fill="#ffe082" />


            {/* 可调角度的精致黄铜金属弯管 (鹅颈灯臂) */}
            <path
              d="M-18.4,-2.7 C-14.8,-6.7 -7.4,-7 -6,-3.2"
              fill="none"
              stroke="#dfb758"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* 弯管金属高光细线 */}
            <path
              d="M-18.4,-2.7 C-14.8,-6.7 -7.4,-7 -6,-3.2"
              fill="none"
              stroke="#fff7cf"
              strokeWidth="0.4"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* The shade and round light pearl share a gently tilted local axis. */}
            <g transform="translate(-6 -3.2) rotate(-20)">
              <circle cx="0" cy="4.1" r="2.8" fill="#fef08a" opacity="0.4" pointerEvents="none" />
              <path d="M-1.2,0 Q0,-0.4 1.2,0 L2.5,3.4 Q0,4.2 -2.5,3.4Z" fill="#dfb758" stroke="#7c5c1d" strokeWidth="0.45" strokeLinejoin="round" />
              <path d="M-0.8,0.4 L-1.8,3.1" fill="none" stroke="#fff7cf" strokeWidth="0.35" opacity="0.65" strokeLinecap="round" />
              <ellipse cx="0" cy="3.4" rx="2.5" ry="0.65" fill="#b18b3f" stroke="#7c5c1d" strokeWidth="0.32" />
              <ellipse cx="0" cy="3.48" rx="1.85" ry="0.43" fill="#ffe6a0" />
              <circle cx="0" cy="4.1" r="1.25" fill="#fff7cf" />
              <path d="M-2.5,3.4 Q0,2.75 2.5,3.4 L2.28,3.7 Q0,3.12 -2.28,3.7Z" fill="#b18b3f" />
            </g>
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

          </g>

          {/* ======================================================== */}
          {/* 13. 胶囊卧舱安睡角色 (Sleeper in Capsule Pod · tatami_capsule) */}
          {/* ======================================================== */}
          {(() => {
            if (podOccupant && slotCfg) {
              return (
                <g {...svgAction('查看人物状态')}
                  id={`person-in-pod-${podOccupant.id}`}
                  transform={`translate(${slotCfg.offset.dx}, ${slotCfg.offset.dy})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPerson(podOccupant);
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setHoveredObject({ kind: 'person', id: podOccupant.id });
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

        <g id="pod-entry-steps">
          <defs>
            <clipPath id={`${gearMaterialId}-ladder-interior`}>
              <path d="M-53.5,24 L-34.5,24 L-39.365,61.95 L-59.338,61.95 Z" />
            </clipPath>
          </defs>
          {/* Each pad, pivot and receiving shadow share the beam axis at its contact height. */}
          <SoftContactShadow cx={-61.088} cy={63.35} rx={5.2} ry={2.1} color="#29392d" opacity={0.24} />
          <ContactGroundShadow cx={-61.088} cy={63.35} rx={3.6} ry={1.35} color="#111813" opacity={0.35} />
          <ellipse cx="-61.088" cy="63.35" rx="4" ry="1.8" fill="#354139" />
          <path d="M-65.088,61.95 A4,1.8 0 0 1 -57.088,61.95 L-57.088,63.35 A4,1.8 0 0 1 -65.088,63.35 Z" fill={`url(#${gearMaterialId}-podFootPadWallGrad)`} />
          <ellipse cx="-61.088" cy="61.95" rx="4" ry="1.8" fill={`url(#${gearMaterialId}-podFootPadTopGrad)`} />
          <ellipse cx="-61.088" cy="61.95" rx="2.05" ry="0.78" fill="#4c6051" />
          <SoftContactShadow cx={-37.615} cy={63.35} rx={5.2} ry={2.1} color="#29392d" opacity={0.24} />
          <ContactGroundShadow cx={-37.615} cy={63.35} rx={3.6} ry={1.35} color="#111813" opacity={0.35} />
          <ellipse cx="-37.615" cy="63.35" rx="4" ry="1.8" fill="#354139" />
          <path d="M-41.615,61.95 A4,1.8 0 0 1 -33.615,61.95 L-33.615,63.35 A4,1.8 0 0 1 -41.615,63.35 Z" fill={`url(#${gearMaterialId}-podFootPadWallGrad)`} />
          <ellipse cx="-37.615" cy="61.95" rx="4" ry="1.8" fill={`url(#${gearMaterialId}-podFootPadTopGrad)`} />
          <ellipse cx="-37.615" cy="61.95" rx="2.05" ry="0.78" fill="#4c6051" />
          {/* Treads terminate at the rail interiors; the rails cover their embedded ends. */}
          <g clipPath={`url(#${gearMaterialId}-ladder-interior)`}>
            <g id="pod-step-1">
              <path d="M-54.885,33 L-35.654,33 L-36.231,37.5 L-55.577,37.5 Z" fill="#6b7b6d" />
              <path d="M-55.577,37.5 L-36.231,37.5 L-36.641,40.7 L-56.069,40.7 Z" fill="#39493e" />
              <path d="M-55.577,37.5 L-54.927,37.5 L-55.419,40.7 L-56.069,40.7 Z M-36.881,37.5 L-36.231,37.5 L-36.641,40.7 L-37.291,40.7 Z" fill="#2e3d33" opacity="0.75" />
              <path d="M-55.177,37.5 H-36.631" stroke="#9eac9b" strokeWidth="0.48" opacity="0.75" />
              <path d="M-55.669,40.55 H-37.041" stroke="#293c30" strokeWidth="0.32" opacity="0.55" />
              <path d="M-48.346,33.7 L-48.999,36.7" stroke="#94a390" strokeWidth="0.5" opacity="0.65" />
              <path d="M-41.423,33.7 L-42.035,36.7" stroke="#94a390" strokeWidth="0.5" opacity="0.65" />
            </g>
            <g id="pod-step-2">
              <path d="M-56.577,44 L-37.064,44 L-37.641,48.5 L-57.269,48.5 Z" fill="#667868" />
              <path d="M-57.269,48.5 L-37.641,48.5 L-38.051,51.7 L-57.762,51.7 Z" fill="#36473c" />
              <path d="M-57.269,48.5 L-56.619,48.5 L-57.112,51.7 L-57.762,51.7 Z M-38.291,48.5 L-37.641,48.5 L-38.051,51.7 L-38.701,51.7 Z" fill="#2e3d33" opacity="0.75" />
              <path d="M-56.869,48.5 H-38.041" stroke="#9eac9b" strokeWidth="0.48" opacity="0.75" />
              <path d="M-57.362,51.55 H-38.451" stroke="#293c30" strokeWidth="0.32" opacity="0.55" />
              <path d="M-49.943,44.7 L-50.596,47.7" stroke="#94a390" strokeWidth="0.5" opacity="0.65" />
              <path d="M-42.918,44.7 L-43.529,47.7" stroke="#94a390" strokeWidth="0.5" opacity="0.65" />
            </g>
            <g id="pod-step-3">
              <path d="M-58.269,55 L-38.474,55 L-39.051,59.5 L-58.962,59.5 Z" fill="#627363" />
              <path d="M-58.962,59.5 L-39.051,59.5 L-39.333,61.7 L-59.3,61.7 Z" fill="#35453a" />
              <path d="M-58.962,59.5 L-58.312,59.5 L-58.65,61.7 L-59.3,61.7 Z M-39.701,59.5 L-39.051,59.5 L-39.333,61.7 L-39.983,61.7 Z" fill="#2e3d33" opacity="0.75" />
              <path d="M-58.562,59.5 H-39.451" stroke="#9eac9b" strokeWidth="0.48" opacity="0.75" />
              <path d="M-58.9,61.55 H-39.733" stroke="#293c30" strokeWidth="0.32" opacity="0.55" />
              <path d="M-51.539,55.7 L-52.192,58.7" stroke="#94a390" strokeWidth="0.5" opacity="0.65" />
              <path d="M-44.413,55.7 L-45.024,58.7" stroke="#94a390" strokeWidth="0.5" opacity="0.65" />
            </g>
          </g>
          <g id="pod-ladder-rail-left">
            <path d="M-57,24 H-53.5 L-59.338,61.95 H-62.838 Z" fill={`url(#${gearMaterialId}-podLadderBeamGrad)`} stroke="#59695e" strokeWidth="0.4" />
            <path d="M-57,24 L-56.25,24 L-62.088,61.95 L-62.838,61.95 Z" fill="#26382c" opacity="0.78" />
            <path d="M-54,24 L-59.838,61.95" fill="none" stroke="#98a792" strokeWidth="0.45" opacity="0.65" />
          </g>
          <g id="pod-ladder-rail-right">
            <path d="M-34.5,24 H-31 L-35.865,61.95 H-39.365 Z" fill={`url(#${gearMaterialId}-podLadderBeamGrad)`} stroke="#59695e" strokeWidth="0.4" />
            <path d="M-31,24 L-31.75,24 L-36.615,61.95 L-35.865,61.95 Z" fill="#26382c" opacity="0.78" />
            <path d="M-34,24 L-38.865,61.95" fill="none" stroke="#98a792" strokeWidth="0.45" opacity="0.65" />
          </g>
          <rect x="-58" y="24" width="4.5" height="3.5" rx="0.8" fill="#1f2722" stroke="#46544a" strokeWidth="0.38" />
          <circle cx="-56" cy="25.5" r="0.8" fill="#c49d52" />
          <rect x="-34.5" y="24" width="4" height="3.5" rx="0.8" fill="#1f2722" stroke="#46544a" strokeWidth="0.38" />
          <circle cx="-32.5" cy="25.5" r="0.8" fill="#c49d52" />
        </g>

        {/* F. 安睡角色梦境浮标与宁静气泡 */}
        {presenceSlots.tatami_capsule?.occupant && (
          <g id="capsule-sleep-whispers" transform="translate(15, -42)" className="pointer-events-none">
            {/* Tranquil Slumber Bubbles (静谧睡眠气泡) */}
            <g id="capsule-slumber-bubbles" transform="translate(20, 0)">
              <g className="animate-sleep-bubble-1">
                <circle cx="2" cy="0" r="1.8" fill="#fde68a" opacity="0.8" />
                <circle cx="1.5" cy="-0.5" r="0.6" fill="#ffffff" opacity="0.9" />
              </g>
              <g className="animate-sleep-bubble-2">
                <circle cx="7" cy="-7" r="2.6" fill="#fef08a" opacity="0.75" />
                <circle cx="6.2" cy="-7.8" r="0.8" fill="#ffffff" opacity="0.9" />
              </g>
              <g className="animate-sleep-bubble-3">
                <circle cx="13" cy="-15" r="3.4" fill="#fed7aa" opacity="0.65" />
                <circle cx="12" cy="-16" r="1.0" fill="#ffffff" opacity="0.85" />
              </g>
            </g>

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
});
