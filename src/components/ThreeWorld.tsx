import { useWorldCamera } from '../world/camera/useWorldCamera';
import { LayoutGestureContext } from '../features/layout-editor/LayoutGestureContext';
import { DEFAULT_ROOM_LAYOUT } from './layout-gizmo/layoutStore';
import { ObservatoryHaven } from './architecture/ObservatoryHaven';
import { SceneEntity } from '../world/render/SceneEntity';
import { DEFAULT_SCENE_LAYOUT } from '../world/scene/sceneLayout';
import type { SceneLayout } from '../world/scene/sceneTypes';
import { resolveRoomCamera } from '../world/scene/roomTargets';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { TimeOfDay, Person, RoomId } from '../types';
import { ROOMS } from '../data/initialData';
import { CharacterHead } from './CharacterAvatar';
import { resolvePresenceSlots, SceneSlotConfig } from '../utils/sceneViewMapping';
import { Bookshelf, BookshelfPreset, BookItemConfig, TierConfig } from './bookshelf';
import { CastIronWoodStove, StoveColorVariant } from './CastIronWoodStove';
import { RecordCabinet, RetroTurntable } from './cabinet';
import { AtticDesk, WindsorChair } from './desk';
import { MonsteraPlant, FiddleLeafFig } from './plants';
import { RoomLayoutConfig, EditableObjectId, IsoGizmo } from './layout-gizmo';
import { WallPostersGallery, PosterDetailModal, PosterId } from './wall-posters';
import { LeftWallCraftBoard } from './LeftWallCraftBoard';
import { CottageFoundation, TimberFlooring, CottageRoofFraming, CottageWallProfiles, CapsulePodHaven, WoodenCabinHaven } from './architecture';
import {
  YorkshireDefs,
  TerrainSilhouette,
  RailwayLandscape,
  TerrainMass,
  RiverValley,
  PastureFields,
  DrystoneWalls,
  YorkshireDressing,
} from './scenery/yorkshire';

interface ThreeWorldProps {
  sceneLayout?: SceneLayout;
  focusRevision?: number;
  onDragGizmoBegin?: () => void;
  onDragGizmoCancel?: () => void;
  timeOfDay: TimeOfDay;
  people: Person[];
  activeRoom: RoomId | 'overview';
  unreadMailCount: number;
  onSelectPerson: (person: Person) => void;
  onSelectMailbox: () => void;
  onSelectRoom: (roomId: RoomId | 'overview') => void;
  onFireplaceClick?: () => void;
  bookshelfPreset?: BookshelfPreset;
  onBookshelfClick?: () => void;
  onBookClick?: (book: BookItemConfig, tierIndex: number) => void;
  customBookshelfTiers?: TierConfig[];
  roomLayout?: RoomLayoutConfig;
  cabinetLayout?: RoomLayoutConfig; // 兼容
  activeGizmoId?: EditableObjectId | null;
  isInspectorOpen?: boolean;
  onSelectGizmo?: (id: EditableObjectId | null) => void;
  onDragGizmoDelta?: (dx: number, dy: number) => void;
  onDragGizmoEnd?: () => void;
  onSelectPoster?: (id: PosterId) => void;
  isChairEmptyOverride?: boolean;
  onToggleChairSeated?: (seated?: boolean) => void;
  onOpenChairInspector?: () => void;
  onTriggerToast?: (msg: string) => void;
}

// Anime countryside atmospheric color palettes & lighting
const COUNTRYSIDE_THEMES: Record<
  TimeOfDay,
  {
    skyTop: string;
    skyBottom: string;
    hillGreenFar: string;
    hillGreenMid: string;
    hillGreenNear: string;
    wheatFar: string;
    wheatNear: string;
    roadColor: string;
    riverColor: string;
    riverReflect: string;
    riverRipples: string;
    ambientTint: string;
    cottageGlow: string;
    tractorLightGlow: string;
    roofColor: string;
    isNight: boolean;
    isRainy: boolean;
  }
> = {
  afternoon: {
    // Exact palette extracted from "All Creatures Great and Small" (万物生灵) intro reference:
    // Sky: English summer cerulean into warm golden buttercream horizon glow
    skyTop: '#4a7896',
    skyBottom: '#faedd6',
    hillGreenFar: '#73896b',
    hillGreenMid: '#8ea344',
    hillGreenNear: '#485f2a',
    wheatFar: '#dab757',
    wheatNear: '#bf9536',
    roadColor: '#a89379',
    riverColor: '#3c8585',
    riverReflect: '#7cbdbb',
    riverRipples: '#c2ebe9',
    ambientTint: 'rgba(255, 246, 230, 0.05)',
    cottageGlow: 'rgba(255, 235, 180, 0.45)',
    tractorLightGlow: 'rgba(255, 235, 170, 0.25)',
    roofColor: '#ad4c32',
    isNight: false,
    isRainy: false,
  },
  morning: {
    // Yorkshire Dales crisp morning: misty silvery azure sky, soft morning gold horizon, dewy olive hills
    skyTop: '#42708e',
    skyBottom: '#f5ead4',
    hillGreenFar: '#6d8367',
    hillGreenMid: '#869b40',
    hillGreenNear: '#445926',
    wheatFar: '#d4b150',
    wheatNear: '#b88f30',
    roadColor: '#9e8972',
    riverColor: '#387e7e',
    riverReflect: '#74b4b2',
    riverRipples: '#b8e4e2',
    ambientTint: 'rgba(255, 248, 235, 0.06)',
    cottageGlow: 'rgba(255, 230, 160, 0.35)',
    tractorLightGlow: 'rgba(255, 242, 170, 0.18)',
    roofColor: '#a4472c',
    isNight: false,
    isRainy: false,
  },
  dusk: {
    // Yorkshire Dales golden hour: slate violet sky into dusty apricot, bronze-olive knolls
    skyTop: '#393452',
    skyBottom: '#e5906c',
    hillGreenFar: '#5d5843',
    hillGreenMid: '#474f30',
    hillGreenNear: '#313a22',
    wheatFar: '#b86d38',
    wheatNear: '#8c4520',
    roadColor: '#524647',
    riverColor: '#63394a',
    riverReflect: '#b65e52',
    riverRipples: '#f2b7a0',
    ambientTint: 'rgba(215, 95, 45, 0.14)',
    cottageGlow: 'rgba(255, 175, 75, 0.85)',
    tractorLightGlow: 'rgba(255, 185, 75, 0.7)',
    roofColor: '#80301d',
    isNight: false,
    isRainy: false,
  },
  night: {
    // Yorkshire moorland night: deep slate indigo, dark woodland shadows, warm lantern glow
    skyTop: '#0b111a',
    skyBottom: '#141f2e',
    hillGreenFar: '#131d1a',
    hillGreenMid: '#0e1814',
    hillGreenNear: '#0a120f',
    wheatFar: '#1c1c13',
    wheatNear: '#14140d',
    roadColor: '#181b20',
    riverColor: '#0f1c30',
    riverReflect: '#1b2e4b',
    riverRipples: '#3a5982',
    ambientTint: 'rgba(8, 12, 22, 0.35)',
    cottageGlow: 'rgba(255, 205, 105, 0.95)',
    tractorLightGlow: 'rgba(255, 215, 110, 0.9)',
    roofColor: '#2e1b19',
    isNight: true,
    isRainy: false,
  },
  rainy: {
    // Yorkshire Dales drizzle: stormy charcoal-slate sky, wet limestone and deep rainy moss
    skyTop: '#323f4b',
    skyBottom: '#5c6d7a',
    hillGreenFar: '#465c50',
    hillGreenMid: '#364a3b',
    hillGreenNear: '#26372b',
    wheatFar: '#7a7050',
    wheatNear: '#63583c',
    roadColor: '#42474e',
    riverColor: '#254354',
    riverReflect: '#48677a',
    riverRipples: '#8bb1c4',
    ambientTint: 'rgba(40, 58, 70, 0.2)',
    cottageGlow: 'rgba(255, 210, 130, 0.65)',
    tractorLightGlow: 'rgba(255, 215, 125, 0.5)',
    roofColor: '#63392d',
    isNight: false,
    isRainy: true,
  },
};

const ALIEN_TRANSMISSIONS = [
  '📡 [SETI 频率 1420.405 MHz · 宇宙中性氢波段] 正在捕获来自猎户座大星云的微弱脉冲信号，信噪比极佳...',
  '✦ [深空信号解码] “01001100... 无论跨越多少光年，请在你们温柔的小世界里好好生活。”',
  '🛸 [地外引力波回响] 接收到一段来自半人马座阿尔法星的温和音频脉冲，如同浩瀚星海中的一声低语。',
  '🌌 [微波背景回响] “今夜你们地球麦浪的气息很安详，我们正用引力透镜安静守望。”',
  '✨ [宇宙无线电] 示波器上跳跃出一段舒缓的正弦波形——这是星系给守望者谱写的晚安曲。',
];

export const ThreeWorld: React.FC<ThreeWorldProps> = ({
  sceneLayout = DEFAULT_SCENE_LAYOUT,
  focusRevision = 0,
  onDragGizmoBegin,
  onDragGizmoCancel,
  timeOfDay,
  people,
  activeRoom,
  unreadMailCount,
  onSelectPerson,
  onSelectMailbox,
  onSelectRoom: requestRoom,
  onFireplaceClick,
  bookshelfPreset,
  onBookshelfClick,
  onBookClick,
  customBookshelfTiers,
  roomLayout,
  cabinetLayout,
  activeGizmoId,
  isInspectorOpen = false,
  onSelectGizmo,
  onDragGizmoDelta,
  onDragGizmoEnd,
  onSelectPoster,
  isChairEmptyOverride = false,
  onToggleChairSeated,
  onOpenChairInspector,
  onTriggerToast,
}) => {
  const onSelectRoom = (room: RoomId | 'overview') => { if (!isInspectorOpen) requestRoom(room); };
  const currentLayout = roomLayout || cabinetLayout || DEFAULT_ROOM_LAYOUT;
  const effectiveGizmoId = isInspectorOpen ? activeGizmoId : null;
  const containerRef = useRef<HTMLDivElement>(null);

  // Active Wall Poster Modal State (右墙电影海报高清艺术展陈卡片)
  const [selectedPosterId, setSelectedPosterId] = useState<PosterId | null>(null);

  const { camera, isDragging, svgRef, hasMovedRef, pointerHandlers, zoomBy, restoreFocus } = useWorldCamera(activeRoom, sceneLayout, focusRevision, isInspectorOpen);

  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [alienMsgIndex, setAlienMsgIndex] = useState(0);
  const [alienPulseEffect, setAlienPulseEffect] = useState(false);
  const [alienTransmissionText, setAlienTransmissionText] = useState<string | null>(null);
  const [sofaSquish, setSofaSquish] = useState(false);
  const [sofaThought, setSofaThought] = useState<string | null>(null);

  // Freestanding Cast-Iron Stove Color Variant (支持陶土红砖、焦糖胡桃、柔和草席绿、经典炭黑等全套同色系)
  const [stoveColor, setStoveColor] = useState<StoveColorVariant>(() => {
    try {
      const saved = localStorage.getItem('storybook_stove_color');
      if (
        saved === 'terracotta' ||
        saved === 'walnut' ||
        saved === 'sage' ||
        saved === 'charcoal' ||
        saved === 'forest_green'
      ) {
        return saved as StoveColorVariant;
      }
    } catch {}
    return 'terracotta'; // 默认优先采用与室外红砖烟囱、红瓦屋顶 100% 呼应的同色系暖陶土红
  });

  const theme = COUNTRYSIDE_THEMES[timeOfDay] || COUNTRYSIDE_THEMES.afternoon;

  // Click on alien signal dish triggers cosmic transmission & decoded message
  const triggerAlienSignal = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAlienPulseEffect(true);
    setTimeout(() => setAlienPulseEffect(false), 1400);
    const msg = ALIEN_TRANSMISSIONS[alienMsgIndex];
    setAlienTransmissionText(msg);
    setAlienMsgIndex((prev) => (prev + 1) % ALIEN_TRANSMISSIONS.length);
  };

  // Click on lazy beanbag sofa triggers cozy squish & thoughts
  const triggerSofaSquish = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSofaSquish(true);
    setTimeout(() => setSofaSquish(false), 500);
    const thoughts = [
      '整个人陷在懒人沙发里，好像被温暖的云朵抱住了...',
      '陷在沙发深处，连翻书的节奏都变轻慢了。',
      '超软的豆袋大面包，窝着看一整个下午的书...',
      '窗外微风拂过，这里的凹陷坐感刚刚好。',
      '深陷在懒人沙发里，感觉骨头都完全放松了...',
    ];
    setSofaThought(thoughts[Math.floor(Math.random() * thoughts.length)]);
    setTimeout(() => setSofaThought(null), 3600);
  };

  const handleZoomIn = () => zoomBy(0.25);
  const handleZoomOut = () => zoomBy(-0.25);
  const handleResetOverview = () => { requestRoom('overview'); restoreFocus(); };

  // Dynamic Scene-based View Mapping for Character Presence
  const { slots: presenceSlots } = resolvePresenceSlots(people);

  // Group characters for polaroid photos and room context
  const selfPerson = people.find((p) => p.id === 'self');
  const linPerson = people.find((p) => p.id === 'lin');
  const yuPerson = people.find((p) => p.id === 'yu');
  const isLinReading = presenceSlots.sofa_lounge?.occupant?.id === 'lin';

  return (
    <LayoutGestureContext.Provider value={{ activeId: effectiveGizmoId ?? null, begin: () => { hasMovedRef.current = false; onDragGizmoBegin?.(); }, commit: () => onDragGizmoEnd?.(), cancel: () => onDragGizmoCancel?.(), markMoved: () => { hasMovedRef.current = true; } }}>
    <div
      ref={containerRef}
      {...pointerHandlers}
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{
        touchAction: 'none',
        background: `linear-gradient(180deg, ${theme.skyTop} 0%, ${theme.skyBottom} 100%)`,
        transition: 'background 1.4s ease-in-out',
      }}
    >
      {/* Night Sky Stars */}
      {theme.isNight && (
        <div className="absolute inset-0 pointer-events-none opacity-85">
          <div className="absolute top-[8%] left-[20%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white] animate-pulse" />
          <div className="absolute top-[14%] left-[35%] w-1 h-1 bg-[#fffbe6] rounded-full" />
          <div className="absolute top-[6%] left-[65%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
          <div className="absolute top-[16%] left-[78%] w-1.5 h-1.5 bg-[#d6ebff] rounded-full animate-ping" />
          <div className="absolute top-[8%] right-[14%] w-12 h-12 rounded-full border-t-2 border-r-2 border-[#fff3d4] shadow-[0_0_24px_#ffeaa7] -rotate-45" />
        </div>
      )}

      {/* Rainy Atmosphere Streaks */}
      {theme.isRainy && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-60">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="rainPattern" width="80" height="80" patternUnits="userSpaceOnUse">
                <line x1="20" y1="0" x2="10" y2="40" stroke="#b2d8f0" strokeWidth="1.2" strokeOpacity="0.5" />
                <line x1="60" y1="20" x2="50" y2="60" stroke="#a2cee8" strokeWidth="1.4" strokeOpacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rainPattern)" className="animate-[pulse_1.5s_infinite]" />
          </svg>
        </div>
      )}

      {/* 2.5D ANIME COUNTRYSIDE FULL-BLEED STAGE CONTAINER */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Main 2.5D Anime Landscape SVG (Full-bleed panoramic canvas permanently locked to viewport) */}
        <svg
          ref={svgRef}
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full pointer-events-auto"
        >
          <defs>
            {/* Unified Low-Poly Theme Defs, Gradients & Patterns */}
            <YorkshireDefs theme={theme} />

            {/* Seamless Panoramic Sky Fill Gradient (万物生灵参考图经典4阶渐变：夏日灰蓝天际 -> 柔和浅青 -> 暖金晨雾 -> 地平线奶油杏黄) */}
            <linearGradient id="skyFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.skyTop} />
              <stop offset="48%" stopColor="#96bac5" />
              <stop offset="78%" stopColor="#dbe8e0" />
              <stop offset="100%" stopColor={theme.skyBottom} />
            </linearGradient>

            {/* Yorkshire Dales wheat field texture (toasted oat & straw) */}
            <pattern id="wheatPattern" width="16" height="16" patternTransform="rotate(35 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="16" stroke="#cbb274" strokeWidth="2" opacity="0.6" />
              <line x1="8" y1="0" x2="8" y2="16" stroke="#ded0a8" strokeWidth="1.6" opacity="0.4" />
            </pattern>

            {/* Yorkshire Dales pasture texture (muted olive & sage) */}
            <pattern id="grassPattern" width="14" height="14" patternTransform="rotate(-25 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="14" stroke="#4d643d" strokeWidth="1.8" opacity="0.6" />
              <line x1="7" y1="0" x2="7" y2="14" stroke="#667f53" strokeWidth="2" opacity="0.5" />
            </pattern>

            {/* River Water Gradient */}
            <linearGradient id="riverGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={theme.riverColor} />
              <stop offset="50%" stopColor={theme.riverReflect} />
              <stop offset="100%" stopColor={theme.riverColor} />
            </linearGradient>

            {/* Soft Shadow Filter */}
            <filter id="cozyShadow" x="-10%" y="-10%" width="125%" height="125%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.2" />
            </filter>
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.18" />
            </filter>

            {/* Diorama Atmospheric Cloud & Mist Diffusion Filters (消除贴画生硬边缘，提供水彩漫反射与空气透视羽化) */}
            <filter id="cloudAtmosphereBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.6" />
            </filter>
            <filter id="ridgeMistBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6.5" />
            </filter>
            <filter id="wispyCloudSoft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.0" />
            </filter>

            {/* Retro Anime Parallax Cloud Drift Animations (长周期舒缓漂移，赋予微缩景观呼吸感) */}
            <style>{`
              @keyframes driftFarClouds {
                0% { transform: translateX(-160px); }
                100% { transform: translateX(200px); }
              }
              @keyframes driftRidgeMist {
                0% { transform: translateX(180px); }
                100% { transform: translateX(-170px); }
              }
              .cloud-drift-far {
                animation: driftFarClouds 130s ease-in-out infinite alternate;
              }
              .cloud-drift-mist {
                animation: driftRidgeMist 90s ease-in-out infinite alternate;
              }
            `}</style>

            {/* Roof terracotta tile pattern (饱满哑光老陶瓦层次) */}
            <linearGradient id="terracottaRoof" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.roofColor} />
              <stop offset="60%" stopColor="#8c3822" />
              <stop offset="100%" stopColor="#6e2716" />
            </linearGradient>

            {/* Fireplace Wall & Floor Ambient Glow (消除贴纸感，提供墙面与地面的真实光影漫反射) */}
            <radialGradient id="hearthWallWarmGlow" cx="50%" cy="75%" r="65%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.48" />
              <stop offset="45%" stopColor="#ea580c" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#9a3412" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
            </radialGradient>

            {/* Wooden Cabin Interior Warm Candlelight Radial Glow */}
            <radialGradient id="cabinGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff8eb" stopOpacity="0.92" />
              <stop offset="45%" stopColor="#fed7aa" stopOpacity="0.48" />
              <stop offset="100%" stopColor="#9a5824" stopOpacity="0" />
            </radialGradient>

            {/* Wooden Cabin Shingle, Log, and Stone Gradients */}
            <linearGradient id="cabinLogGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9e693d" />
              <stop offset="35%" stopColor="#82522b" />
              <stop offset="70%" stopColor="#673e1f" />
              <stop offset="100%" stopColor="#482710" />
            </linearGradient>

            <linearGradient id="cabinStoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#635b50" />
              <stop offset="50%" stopColor="#494137" />
              <stop offset="100%" stopColor="#2e2720" />
            </linearGradient>

            <linearGradient id="cabinShingleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c55f3a" />
              <stop offset="50%" stopColor="#a34524" />
              <stop offset="100%" stopColor="#722b13" />
            </linearGradient>

            {/* 3D Sloping Roof Side Shingle Gradient (Sunlit Terracotta) */}
            <linearGradient id="cabinRoofSideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#df7a57" />
              <stop offset="35%" stopColor="#c55f3a" />
              <stop offset="70%" stopColor="#a34524" />
              <stop offset="100%" stopColor="#682913" />
            </linearGradient>

            {/* 3D Timber Floor Waxed Hardwood Gradient */}
            <linearGradient id="cabinFloorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a87a4e" />
              <stop offset="50%" stopColor="#8c5f35" />
              <stop offset="100%" stopColor="#674121" />
            </linearGradient>

            {/* 2.5D Isometric Cabin Floorboard Perspective Gradient (Back depth to front threshold) */}
            <linearGradient id="cabinFloorIsoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4f2f16" />
              <stop offset="35%" stopColor="#6d4422" />
              <stop offset="70%" stopColor="#8c5d35" />
              <stop offset="100%" stopColor="#9e6d40" />
            </linearGradient>

            {/* 2.5D West Side Wall Ambient Occlusion Gradient */}
            <linearGradient id="cabinSideWallGrad" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#4d321d" />
              <stop offset="60%" stopColor="#6d4627" />
              <stop offset="100%" stopColor="#845833" />
            </linearGradient>

            {/* 2.5D East Partition Wall Interior Shadow Gradient */}
            <linearGradient id="cabinEastWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#482e1a" />
              <stop offset="50%" stopColor="#5d3a20" />
              <stop offset="100%" stopColor="#7a4e2a" />
            </linearGradient>

            {/* 2.5D Ceiling & Soffit Ambient Occlusion Drop Shadow */}
            <linearGradient id="cabinCeilingAOGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a0f07" stopOpacity="0.75" />
              <stop offset="65%" stopColor="#28170c" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#28170c" stopOpacity="0" />
            </linearGradient>

            {/* Brass Hurricane Porch Lantern Radial Glow */}
            <radialGradient id="cabinLanternGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#fde68a" stopOpacity="0.6" />
              <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </radialGradient>

            {/* Corn Lounge / Cabin Fallback Radial Glow */}
            <radialGradient id="cornGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff8eb" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#fed7aa" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#c27329" stopOpacity="0" />
            </radialGradient>

            {/* Toasted Harvest Corn Shell Gradient */}
            <linearGradient id="toastedCornGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dfb770" />
              <stop offset="55%" stopColor="#c58e42" />
              <stop offset="100%" stopColor="#9c6628" />
            </linearGradient>

            {/* Unified Homestead Garden Lawn Gradient (阳光明媚温暖的约克郡金橄榄草坪，从向阳草绿自然过渡到温和暗苔) */}
            <linearGradient id="homesteadLawnGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#98ad48" />
              <stop offset="42%" stopColor={theme.hillGreenMid} />
              <stop offset="85%" stopColor="#637c35" />
              <stop offset="100%" stopColor={theme.hillGreenNear} />
            </linearGradient>

            {/* Foreground Pasture Sunlit Gradient (近景辽阔草甸：暖金草尖、深邃厚实苔藓底座，层次鲜明) */}
            <linearGradient id="foregroundPastureGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#829940" />
              <stop offset="30%" stopColor={theme.hillGreenNear} />
              <stop offset="75%" stopColor="#2c3c18" />
              <stop offset="100%" stopColor="#1a2510" />
            </linearGradient>

            {/* Retro Anime & Diorama Atmospheric Cloud Gradients (低对比度灰蓝、柔乳灰与晨霭紫蓝，融入远山与大气) */}
            <linearGradient id="cloudFarBandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c2d5e2" stopOpacity="0.68" />
              <stop offset="35%" stopColor="#d5e3ec" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#a8bfd0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#92abc0" stopOpacity="0.08" />
            </linearGradient>

            {/* Cloud Crest Soft Highlight (绝非死板纯白，而是晨光透射下的极淡乳蓝灰天光) */}
            <linearGradient id="cloudCrestGlaze" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#edf3f7" stopOpacity="0.48" />
              <stop offset="50%" stopColor="#cde0ed" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#b2c8d8" stopOpacity="0.0" />
            </linearGradient>

            {/* Midground Mountain Ridge & Valley Mist (山谷流岚与山脊薄雾，与远山交融晕染) */}
            <linearGradient id="ridgeValleyMistGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c8dbe6" stopOpacity="0.0" />
              <stop offset="30%" stopColor="#dde7ee" stopOpacity="0.45" />
              <stop offset="65%" stopColor={theme.skyBottom} stopOpacity="0.55" />
              <stop offset="100%" stopColor={theme.skyBottom} stopOpacity="0.0" />
            </linearGradient>

            {/* Upper Atmosphere Wispy Cirrus Gradient */}
            <linearGradient id="wispyCirrusGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9bb4c7" stopOpacity="0.0" />
              <stop offset="25%" stopColor="#c0d4e2" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#d4e3ed" stopOpacity="0.5" />
              <stop offset="85%" stopColor="#b2c8d8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#9bb4c7" stopOpacity="0.0" />
            </linearGradient>

            {/* Distant Atmospheric Aerial Haze (极致空气透视雾霭，让远山与天际线柔和交融) */}
            <linearGradient id="distantHazeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.skyBottom} stopOpacity="0" />
              <stop offset="50%" stopColor={theme.skyBottom} stopOpacity="0.45" />
              <stop offset="100%" stopColor={theme.skyBottom} stopOpacity="0.8" />
            </linearGradient>

            {/* Deep Water Translucent Depth Gradient (万物生灵参考图纯正青碧宝石溪水·Teal-Cyan Beck) */}
            <linearGradient id="riverDepthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#76bcbb" stopOpacity="0.9" />
              <stop offset="30%" stopColor={theme.riverColor} stopOpacity="0.98" />
              <stop offset="70%" stopColor="#286969" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#4c9391" stopOpacity="0.92" />
            </linearGradient>

            {/* North Shore Grassy Bank Slope Gradient (北岸：向阳草坡过渡到暖褐溪流泥滩) */}
            <linearGradient id="northBankSlope" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.hillGreenMid} />
              <stop offset="55%" stopColor="#556c32" />
              <stop offset="100%" stopColor="#826848" />
            </linearGradient>

            {/* South Shore Pebble Verge to Meadow Gradient (南岸：暖砂卵石滩平滑衔接青青草甸) */}
            <linearGradient id="southBankSlope" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#786144" />
              <stop offset="40%" stopColor="#52692e" />
              <stop offset="100%" stopColor={theme.hillGreenNear} />
            </linearGradient>

            {/* Terraced Agricultural Retaining Bund Loam Gradient */}
            <linearGradient id="terraceLoamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5d4227" />
              <stop offset="60%" stopColor="#473019" />
              <stop offset="100%" stopColor="#301e0f" />
            </linearGradient>

            {/* 2.5D Isometric Terraced Stone Retaining Wall Gradients (石砌护土台地梯级) */}
            <linearGradient id="stoneWallCapGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#827769" />
              <stop offset="50%" stopColor="#9a8e7f" />
              <stop offset="100%" stopColor="#7c7062" />
            </linearGradient>
            <linearGradient id="stoneWallFaceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f4439" />
              <stop offset="50%" stopColor="#3a3128" />
              <stop offset="100%" stopColor="#251f19" />
            </linearGradient>

            {/* Yorkshire Dales Drystone Wall Gradients (万物生灵经典干砌石墙：风化灰岩材质) */}
            <linearGradient id="drystoneCapGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#948d82" />
              <stop offset="45%" stopColor="#aba398" />
              <stop offset="100%" stopColor="#878075" />
            </linearGradient>
            <linearGradient id="drystoneFaceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#524d45" />
              <stop offset="60%" stopColor="#3d3831" />
              <stop offset="100%" stopColor="#292621" />
            </linearGradient>

            {/* Yorkshire Ribblehead Stone Railway Viaduct Gradients (约克郡经典石砌高架铁路拱桥) */}
            <linearGradient id="viaductStoneGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#857e72" />
              <stop offset="50%" stopColor="#6f685d" />
              <stop offset="100%" stopColor="#565046" />
            </linearGradient>
            <linearGradient id="viaductArchShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38332c" />
              <stop offset="100%" stopColor="#28241f" />
            </linearGradient>

            {/* Frame Vignette Gradient (四周边缘画框式压暗，让用户视觉高度聚拢于中心建筑群) */}
            <radialGradient id="frameVignetteRadial" cx="50%" cy="48%" r="62%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0" />
              <stop offset="85%" stopColor="#121811" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0a0e09" stopOpacity="0.45" />
            </radialGradient>
            <linearGradient id="bottomEdgeVignetteGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10170e" stopOpacity="0" />
              <stop offset="40%" stopColor="#10170e" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0a1008" stopOpacity="0.55" />
            </linearGradient>

            {/* Cast-Iron Stove Surface Gradients (独立式铸铁柴火炉材质渐变) */}
            <linearGradient id="castIronBodyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3d3731" />
              <stop offset="35%" stopColor="#48423b" />
              <stop offset="70%" stopColor="#2b2724" />
              <stop offset="100%" stopColor="#1e1b19" />
            </linearGradient>
            <linearGradient id="castIronPipeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34302c" />
              <stop offset="28%" stopColor="#4d463f" />
              <stop offset="65%" stopColor="#2a2623" />
              <stop offset="100%" stopColor="#191715" />
            </linearGradient>

            {/* 焦糖南瓜色懒人沙发布艺渐变 (Warm Caramel Pumpkin Fabric Gradients) */}
            <linearGradient id="caramelPumpkinBack" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e57b37" />
              <stop offset="50%" stopColor="#cb6324" />
              <stop offset="100%" stopColor="#a34712" />
            </linearGradient>
            <linearGradient id="caramelPumpkinSeat" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f08b46" />
              <stop offset="55%" stopColor="#d96f2a" />
              <stop offset="100%" stopColor="#ab4d15" />
            </linearGradient>

            {/* --- NEW FOREGROUND & TERRACE GROUNDING SYSTEM GRADIENTS --- */}
            {/* 1. Countryside Picnic Red-and-Cream Gingham Check Pattern */}
            <pattern id="picnicGinghamPattern" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(22 0 0)">
              <rect width="14" height="14" fill="#fffaf5" />
              <rect width="7" height="14" fill="#e0533c" opacity="0.38" />
              <rect width="14" height="7" fill="#e0533c" opacity="0.38" />
              <rect width="7" height="7" fill="#b91c1c" opacity="0.65" />
            </pattern>

            {/* 2. Ha-ha Stone Retaining Terrace Wall Gradients (英式跌水石砌护坡体系) */}
            <linearGradient id="terraceCopingGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#cfc2af" />
              <stop offset="45%" stopColor="#ded3c1" />
              <stop offset="85%" stopColor="#bdaf9b" />
              <stop offset="100%" stopColor="#9a8d7a" />
            </linearGradient>
            <linearGradient id="terraceWallCoursesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5a4e40" />
              <stop offset="35%" stopColor="#453b30" />
              <stop offset="75%" stopColor="#322920" />
              <stop offset="100%" stopColor="#1e1813" />
            </linearGradient>

            {/* 3. Wooden Boardwalk Pier & Pilings Gradients */}
            <linearGradient id="boardwalkPlankGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9c7a56" />
              <stop offset="50%" stopColor="#ba976f" />
              <stop offset="100%" stopColor="#876644" />
            </linearGradient>
            <linearGradient id="pierPilingGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3d2b1a" />
              <stop offset="50%" stopColor="#543c26" />
              <stop offset="100%" stopColor="#2b1d11" />
            </linearGradient>

            {/* 4. Moored Wooden Rowboat Clinker Hull & Interior */}
            <linearGradient id="rowboatClinkerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94592a" />
              <stop offset="45%" stopColor="#75411a" />
              <stop offset="100%" stopColor="#48250c" />
            </linearGradient>
            <linearGradient id="rowboatFloorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ba854f" />
              <stop offset="60%" stopColor="#966535" />
              <stop offset="100%" stopColor="#69401d" />
            </linearGradient>

            {/* 5. Gnarled Old Apple Tree Bark & Foliage Gradients */}
            <linearGradient id="oldAppleBarkGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#382a1d" />
              <stop offset="35%" stopColor="#4f3c2a" />
              <stop offset="70%" stopColor="#3a291b" />
              <stop offset="100%" stopColor="#23170e" />
            </linearGradient>
            <radialGradient id="appleFruitHighlight" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="40%" stopColor="#ef4444" />
              <stop offset="85%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>

            {/* 6. Diorama Island Strata Cutaway Base (沙盘微缩手办土壤切面基座) */}
            <linearGradient id="dioramaIslandSoilGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2e421c" />
              <stop offset="12%" stopColor="#382516" />
              <stop offset="45%" stopColor="#291a0e" />
              <stop offset="85%" stopColor="#1c1108" />
              <stop offset="100%" stopColor="#100a04" />
            </linearGradient>
            <linearGradient id="dioramaBasePlinthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#45382b" />
              <stop offset="50%" stopColor="#2e241a" />
              <stop offset="100%" stopColor="#17120c" />
            </linearGradient>

            {/* ========================================================================= */}
            {/* PRESERVED ASSET: SCANDINAVIAN CORNER MASONRY HEARTH                       */}
            {/* (用户要求保留当前石材壁炉作为资产的一部分，不在场景中使用，安全收录于此处) */}
            {/* ========================================================================= */}
            <g id="asset-corner-masonry-hearth">
              <g id="asset-hearth-ground-shadow">
                <polygon
                  points="-27,65.5 -18,68.2 -7,65.2 7,65.2 18,68.2 27,65.5 25,62 0,56 -25,62"
                  fill="#150f0a"
                  opacity="0.28"
                  filter="url(#softShadow)"
                />
                <ellipse cx="0" cy="67" rx="19" ry="6" fill="#f59e0b" opacity="0.25" />
              </g>
              <g id="asset-hearth-unified-base-and-benches">
                <polyline
                  points="-25,65.1 -18,67.1 -7,64.0 7,64.0 18,67.1 25,65.1"
                  fill="none"
                  stroke="#b3a38c"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polygon points="-25,53.1 -18,55.1 -18,67.1 -25,65.1" fill="#ded3c1" stroke="#cbbfa9" strokeWidth="0.4" strokeLinejoin="round" />
                <polygon points="-18,55.1 -7,52.0 -7,64.0 -18,67.1" fill="#ede4d5" stroke="#d6cbba" strokeWidth="0.4" strokeLinejoin="round" />
                <polygon points="-7,52.0 7,52.0 7,64.0 -7,64.0" fill="#e4d9c8" stroke="#d1c5b2" strokeWidth="0.4" strokeLinejoin="round" />
                <polygon points="7,52.0 18,55.1 18,67.1 7,64.0" fill="#d6cbb8" stroke="#c2b49e" strokeWidth="0.4" strokeLinejoin="round" />
                <polygon points="18,55.1 25,53.1 25,65.1 18,67.1" fill="#c8bca7" stroke="#b5a892" strokeWidth="0.4" strokeLinejoin="round" />
                <polygon points="-25,53.1 -14,50.0 -7,52.0 -18,55.1" fill="#f6f0e6" stroke="#ded5c4" strokeWidth="0.4" strokeLinejoin="round" />
                <line x1="-18" y1="55.1" x2="-7" y2="52.0" stroke="#ffffff" strokeWidth="0.7" strokeLinecap="round" />
                <polygon points="14,50.0 25,53.1 18,55.1 7,52.0" fill="#ede3d4" stroke="#d7ccba" strokeWidth="0.4" strokeLinejoin="round" />
                <line x1="7" y1="52.0" x2="18" y2="55.1" stroke="#faf5ed" strokeWidth="0.6" strokeLinecap="round" />
                <polygon points="-14.5,49.6 -7,51.6 7,51.6 14.5,49.6 14.0,50.4 7,52.4 -7,52.4 -14.0,50.4" fill="#dfd5c3" />
                <line x1="-7" y1="52.0" x2="7" y2="52.0" stroke="#fffdfa" strokeWidth="0.6" strokeLinecap="round" />
              </g>
              <g id="asset-hearth-wood-cavity">
                <rect x="-5.2" y="54.6" width="10.4" height="8.4" rx="1.0" fill="#201812" stroke="#362a20" strokeWidth="0.4" />
                <rect x="-4.8" y="55.0" width="9.6" height="1.2" fill="#ea580c" opacity="0.18" />
                <circle cx="-3.4" cy="61.0" r="1.3" fill="#e5d2ba" stroke="#5c3a21" strokeWidth="0.3" />
                <circle cx="-1.0" cy="61.2" r="1.15" fill="#dfc9af" stroke="#5c3a21" strokeWidth="0.3" />
                <circle cx="1.4" cy="61.1" r="1.2" fill="#ebd8c2" stroke="#5c3a21" strokeWidth="0.3" />
                <circle cx="3.6" cy="61.0" r="1.25" fill="#e5d2ba" stroke="#5c3a21" strokeWidth="0.3" />
                <path d="M-4.8,59.0 L-3.2,57.6 L-3.4,59.4 Z" fill="#c29a6e" stroke="#5c3a21" strokeWidth="0.25" />
                <circle cx="-2.1" cy="58.4" r="0.95" fill="#dfc9af" stroke="#5c3a21" strokeWidth="0.3" />
                <path d="M-0.8,59.2 L1.4,59.2 L0.3,57.8 Z" fill="#cca478" stroke="#5c3a21" strokeWidth="0.25" />
                <circle cx="2.3" cy="58.5" r="0.95" fill="#dfc9af" stroke="#5c3a21" strokeWidth="0.3" />
                <path d="M3.4,57.6 L4.8,59.0 L3.6,59.4 Z" fill="#b99064" stroke="#5c3a21" strokeWidth="0.25" />
              </g>
              <g id="asset-bench-cushions">
                <g transform="translate(-16, 53.6)">
                  <ellipse cx="0" cy="1.2" rx="4.5" ry="2.0" fill="#1b120c" opacity="0.18" />
                  <ellipse cx="0" cy="0.6" rx="4.2" ry="1.9" fill="#c4b998" />
                  <ellipse cx="0" cy="-0.6" rx="4.0" ry="1.8" fill="#ded7c0" stroke="#b8ad90" strokeWidth="0.4" />
                  <circle cx="0" cy="-0.6" r="0.6" fill="#8f856c" />
                </g>
                <g transform="translate(16, 53.6)">
                  <ellipse cx="0" cy="1.2" rx="4.5" ry="2.0" fill="#1b120c" opacity="0.18" />
                  <ellipse cx="0" cy="0.6" rx="4.2" ry="1.9" fill="#beb291" />
                  <ellipse cx="0" cy="-0.6" rx="4.0" ry="1.8" fill="#d6ceb6" stroke="#aea285" strokeWidth="0.4" />
                  <circle cx="0" cy="-0.6" r="0.6" fill="#827860" />
                </g>
              </g>
              <g id="asset-hearth-upper-masonry-body">
                <polygon points="-14,23.0 -7,25.0 -7,52.0 -14,50.0" fill="#f3ece0" stroke="#ded5c4" strokeWidth="0.4" strokeLinejoin="round" />
                <polygon points="-7,25.0 7,25.0 7,52.0 -7,52.0" fill="#e8dfce" stroke="#d4cab7" strokeWidth="0.4" strokeLinejoin="round" />
                <polygon points="7,25.0 14,23.0 14,50.0 7,52.0" fill="#d2c5b1" stroke="#c0b39e" strokeWidth="0.4" strokeLinejoin="round" />
                <line x1="-7" y1="25.0" x2="-7" y2="52.0" stroke="#ffffff" strokeWidth="0.6" opacity="0.85" />
                <line x1="7" y1="25.0" x2="7" y2="52.0" stroke="#bfb29c" strokeWidth="0.5" opacity="0.6" />
              </g>
              <g id="asset-hearth-firebox-door">
                <rect x="-5.6" y="29.0" width="11.2" height="19.5" rx="1.2" fill="#24201e" stroke="#161312" strokeWidth="0.6" />
                <rect x="-4.8" y="30.0" width="9.6" height="17.5" rx="0.7" fill="#171514" />
                <rect x="-4.0" y="31.0" width="8.0" height="15.5" rx="0.5" fill="#120c08" />
                <ellipse cx="0" cy="44.5" rx="3.5" ry="1.4" fill="#ef4444" opacity="0.85" />
                <ellipse cx="0" cy="44.0" rx="2.5" ry="1.1" fill="#f59e0b" opacity="0.75" />
              </g>
              <g id="asset-hearth-flat-top-shelf">
                <polygon points="-14.8,22.2 -7.5,24.4 -7.5,26.0 -14.8,23.8" fill="#cfc4b0" />
                <polygon points="-7.5,24.4 7.5,24.4 7.5,26.0 -7.5,26.0" fill="#d6cbba" />
                <polygon points="7.5,24.4 14.8,22.2 14.8,23.8 7.5,26.0" fill="#b9ab96" />
                <polygon points="-14.8,22.2 -7.5,24.4 7.5,24.4 14.8,22.2 14.0,21.0 0,17.5 -14.0,21.0" fill="#fbf7f1" stroke="#eae0d0" strokeWidth="0.4" strokeLinejoin="round" />
              </g>
              <g id="asset-hearth-square-chimney">
                <polygon points="-5.5,19.5 0,21.0 0,-86.6 -5.5,-88.1" fill="#ede4d6" stroke="#d4c8b6" strokeWidth="0.4" />
                <polygon points="0,21.0 5.5,19.5 5.5,-88.1 0,-86.6" fill="#c8bcab" stroke="#b6a895" strokeWidth="0.4" />
                <line x1="0" y1="21.0" x2="0" y2="-86.6" stroke="#faf5ed" strokeWidth="0.8" opacity="0.85" />
              </g>
            </g>

            {/* ========================================================================= */}
            {/* PRESERVED ASSET: COUNTRYSIDE GINGHAM PICNIC SCENE & GNARLED APPLE TREE    */}
            {/* (用户要求保留野餐垫及全套组件作为项目资产保留，不在场景中强塞，安全收录于此处) */}
            {/* ========================================================================= */}
            <g id="asset-country-picnic-scene">
              <polygon points="162,652 278,630 306,686 188,708" fill="#152113" opacity="0.4" filter="url(#softShadow)" />
              <polygon points="165,650 275,632 298,682 186,702" fill="url(#picnicGinghamPattern)" stroke="#e2d6c3" strokeWidth="0.8" />
              <polygon points="167,651 273,634 296,680 188,699" fill="none" stroke="#c2410c" strokeWidth="0.6" strokeDasharray="3 2" opacity="0.5" />
              <ellipse cx="168" cy="652" rx="3.5" ry="2" fill="#7a6c5a" stroke="#483d31" strokeWidth="0.4" />
              <ellipse cx="272" cy="634" rx="4" ry="2.2" fill="#8c7d6b" stroke="#483d31" strokeWidth="0.4" />
              <ellipse cx="295" cy="680" rx="3.8" ry="2" fill="#7a6c5a" stroke="#483d31" strokeWidth="0.4" />
              <ellipse cx="188" cy="700" rx="4.2" ry="2.2" fill="#8c7d6b" stroke="#483d31" strokeWidth="0.4" />
              <g transform="translate(255, 638)">
                <ellipse cx="8" cy="16" rx="14" ry="5" fill="#141f12" opacity="0.35" />
                <rect x="0" y="4" width="18" height="12" rx="2.5" fill="#b47b42" stroke="#694119" strokeWidth="0.8" />
                <line x1="4" y1="4" x2="4" y2="16" stroke="#875322" strokeWidth="0.8" />
                <line x1="9" y1="4" x2="9" y2="16" stroke="#875322" strokeWidth="0.8" />
                <line x1="14" y1="4" x2="14" y2="16" stroke="#875322" strokeWidth="0.8" />
                <line x1="0" y1="8" x2="18" y2="8" stroke="#875322" strokeWidth="0.8" />
                <line x1="0" y1="12" x2="18" y2="12" stroke="#875322" strokeWidth="0.8" />
                <polygon points="-2,4 10,-3 14,-2 2,5" fill="#a36b35" stroke="#5c3614" strokeWidth="0.7" />
                <polygon points="1,4 8,0 12,6 3,7" fill="#fffaf5" />
                <path d="M 3,4 Q 9,-4 15,4" fill="none" stroke="#694119" strokeWidth="1.2" strokeLinecap="round" />
              </g>
              <g transform="translate(210, 656)">
                <ellipse cx="0" cy="5" rx="7" ry="3" fill="#182315" opacity="0.35" />
                <ellipse cx="0" cy="0" rx="6" ry="4.8" fill="#ea580c" stroke="#9a3412" strokeWidth="0.7" />
                <ellipse cx="0" cy="-4" rx="3.2" ry="1.4" fill="#fed7aa" stroke="#9a3412" strokeWidth="0.5" />
                <circle cx="0" cy="-5" r="0.9" fill="#c2410c" />
                <path d="M 5,-1 Q 9,-3 10,-5" fill="none" stroke="#9a3412" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M -5,1 Q -9,0 -7,-3 Q -5,-3 -5,-1" fill="none" stroke="#9a3412" strokeWidth="1.2" />
                <g transform="translate(-10, 6)">
                  <rect x="-2.5" y="-2" width="5" height="4" rx="1.2" fill="#fffaf0" stroke="#a89a85" strokeWidth="0.5" />
                  <ellipse cx="0" cy="-2" rx="2.4" ry="1" fill="#92400e" />
                </g>
                <g transform="translate(10, 8)">
                  <rect x="-2.5" y="-2" width="5" height="4" rx="1.2" fill="#fffaf0" stroke="#a89a85" strokeWidth="0.5" />
                  <ellipse cx="0" cy="-2" rx="2.4" ry="1" fill="#92400e" />
                </g>
              </g>
              <g transform="translate(185, 672)">
                <polygon points="0,0 26,-6 32,8 6,14" fill="#a16207" stroke="#713f12" strokeWidth="0.7" />
                <polygon points="2,1 25,-5 29,7 7,12" fill="#ca8a04" />
                <ellipse cx="12" cy="3" rx="7" ry="4.5" fill="#b45309" stroke="#78350f" strokeWidth="0.7" />
                <ellipse cx="23" cy="5" rx="3.5" ry="2.5" fill="#fef3c7" stroke="#92400e" strokeWidth="0.5" />
                <polygon points="20,8 26,6 28,11 21,12" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
              </g>
              <g transform="translate(235, 680)">
                <ellipse cx="0" cy="2" rx="13" ry="6.5" fill="#152014" opacity="0.32" />
                <ellipse cx="0" cy="0" rx="12" ry="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.6" />
                <ellipse cx="0" cy="-1.5" rx="6" ry="3.5" fill="#eab308" stroke="#a16207" strokeWidth="0.6" />
                <ellipse cx="0" cy="-0.2" rx="6.2" ry="3.2" fill="none" stroke="#3f6212" strokeWidth="1.2" />
                <path d="M 5,2 Q 9,6 8,10" fill="none" stroke="#3f6212" strokeWidth="1.2" strokeLinecap="round" />
              </g>
            </g>
            <g id="asset-gnarled-apple-tree">
              <ellipse cx="50" cy="728" rx="26" ry="8" fill="#10190e" opacity="0.5" />
              <path d="M 42,722 Q 28,728 18,730 M 58,722 Q 70,727 78,729" stroke="#26170d" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M 38,725 C 34,700 40,675 50,650 C 56,634 66,618 75,595 L 86,600 C 76,622 64,640 58,660 C 48,685 44,702 48,725 Z" fill="url(#oldAppleBarkGrad)" stroke="#1c1209" strokeWidth="1.2" />
              <ellipse cx="75" cy="590" rx="36" ry="24" fill="#2b522d" />
              <ellipse cx="115" cy="625" rx="28" ry="18" fill="#346337" />
              <ellipse cx="70" cy="580" rx="30" ry="18" fill="#467e49" />
            </g>
          </defs>

          {/* Panoramic Seamless Sky Background Fill (全景天空底层底色，消除任何边缘露白与悬浮卡片感) */}
          <rect x="-4000" y="-3000" width="10000" height="7000" fill="url(#skyFillGrad)" />

          {/* ======================================================== */}
          {/* CAMERA-DRIVEN WORLD STAGE (Panoramic 2.5D World Layer)    */}
          {/* ======================================================== */}
          <g
            id="panoramic-world-stage"
            data-zoom={camera.zoom}
            style={{
              transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
              transformOrigin: '600px 400px',
              transition: isDragging ? 'none' : 'transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >

          {/* ======================================================== */}
          {/* 1. BACKGROUND: RETRO ANIME ATMOSPHERIC CLOUDS & RIDGE MIST */}
          {/* (微缩景观Diorama重构：连动远山向上平移，保持背景天空与云彩在远山脊上方舒展) */}
          {/* ======================================================== */}
          <g id="sky-and-clouds" transform="translate(0, -115)">
            {/* --- Layer 1: High-Altitude Atmospheric Stratiform & Cirrus Ribbon (极远处慢速舒展云带) --- */}
            <g id="sky-clouds-far-layer" className="cloud-drift-far" filter="url(#cloudAtmosphereBlur)">
              {/* Upper delicate wispy cirrus filaments (高空手绘舒卷轻羽云) */}
              <path
                d="M-2800,52 C-2200,40 -1600,65 -1000,45 C-400,30 200,58 800,42 C1400,28 2000,55 2600,38 C3200,25 3800,48 4200,38 L4200,72 C3800,82 3200,60 2600,75 C2000,90 1400,62 800,75 C200,92 -400,65 -1000,80 C-1600,95 -2200,70 -2800,82 Z"
                fill="url(#wispyCirrusGrad)"
                opacity="0.6"
              />
              <path
                d="M-2600,80 C-2000,65 -1400,90 -800,70 C-200,55 400,82 1000,68 C1600,52 2200,80 2800,62 C3400,50 3900,70 4200,60 L4200,92 C3900,102 3400,82 2800,96 C2200,112 1600,85 1000,100 C400,115 -200,88 -800,102 C-1400,118 -2000,92 -2600,106 Z"
                fill="url(#wispyCirrusGrad)"
                opacity="0.45"
              />

              {/* Main Retro-Anime Elongated Horizon Cloud Bank (经典复古动画长条状、连笔柔和剪影，底色汲取天空灰蓝) */}
              <path
                d="M-3000,145 C-2400,115 -1800,98 -1200,128 C-700,102 -200,88 250,108 C550,82 850,75 1150,98 C1450,78 1850,68 2250,98 C2650,82 3150,108 3650,92 C4000,82 4200,102 4400,98 L4400,225 L-3000,225 Z"
                fill="url(#cloudFarBandGrad)"
                opacity="0.85"
              />

              {/* Soft Sunlit Glaze across cloud crests (低饱和度天光漫反射，微量柔和采光，非刺眼纯白) */}
              <path
                d="M-3000,138 C-2400,110 -1800,92 -1200,122 C-700,98 -200,82 250,102 C550,78 850,70 1150,92 C1450,72 1850,62 2250,92 C2650,78 3150,102 3650,88 C4000,78 4200,98 4400,92 L4400,128 C4200,132 4000,112 3650,122 C3150,138 2650,112 2250,128 C1850,98 1450,108 1150,128 C850,105 550,112 250,138 C-200,118 -700,132 -1200,158 C-1800,128 -2400,148 -3000,178 Z"
                fill="url(#cloudCrestGlaze)"
                opacity="0.75"
              />
            </g>

            {/* --- Layer 2: Midground Mountain Ridge & Valley Mist (中景山峦流岚与山脊薄雾，实现视差与山脊天然晕染) --- */}
            <g id="sky-clouds-ridge-mist" className="cloud-drift-mist" filter="url(#ridgeMistBlur)">
              {/* Meandering soft valley mist dipping across mountain saddles (在远山脊线间柔缓游走) */}
              <path
                d="M-3000,165 C-2300,145 -1700,175 -1100,150 C-600,132 -100,165 350,142 C750,122 1150,158 1550,138 C2050,118 2550,158 3050,138 C3550,122 4000,152 4400,142 L4400,240 C4000,250 3550,225 3050,240 C2550,255 2050,220 1550,235 C1150,250 750,220 350,235 C-100,255 -600,225 -1100,245 C-1700,265 -2300,235 -3000,255 Z"
                fill="url(#ridgeValleyMistGrad)"
                opacity="0.65"
              />
              <path
                d="M-2800,178 C-2100,160 -1500,185 -900,165 C-400,145 100,175 550,152 C950,135 1350,168 1850,148 C2350,130 2850,165 3350,145 C3850,132 4200,160 4400,152 L4400,220 L-2800,220 Z"
                fill="url(#ridgeValleyMistGrad)"
                opacity="0.5"
              />
            </g>

            {/* Atmosphere Horizon Mist Wash (暖金晨雾将云底、谷雾与远山天际线无缝交融) */}
            <rect x="-3000" y="80" width="7400" height="200" fill="url(#distantHazeGrad)" />
          </g>

          {/* ========================================================================= */}
          {/* 🌟 REFACTORED LOW-POLY COUNTRYSIDE TERRAIN & PRESERVED RAILWAY INFRASTRUCTURE */}
          {/*    100% 低多边形设计风格 · 严格遵循 2.5D 轴测平面层级与中景金色麦田过渡     */}
          {/*    远山峰峦与中远景麦田/高架桥往后移，草地扩大包围主屋草台后方              */}
          {/* ========================================================================= */}
          <g id="hills">
            {/* 01 & 05 DISTANT MOUNTAINS, WHEAT TERRACES & RAILWAY (整体往后平移至远景层) */}
            <g id="distant-mountain-wheat-railway-depth" transform="translate(0, -115)">
              {/* 01 TERRAIN SILHOUETTE (低多边形折纸远山峰峦与阶梯麦田) */}
              <TerrainSilhouette theme={theme} />

              {/* 05 INFRASTRUCTURE: RAILWAY (经典石拱高架桥、穿山隧道与复古蒸汽机车) */}
              <RailwayLandscape theme={theme} />
            </g>

            {/* 02 TERRAIN MASS (平整低多边形各级台地、主庭院大台面与底板) */}
            <TerrainMass theme={theme} />

            {/* 02 TERRAIN: River Valley (纯净连贯无断流谷地) */}
            <RiverValley
              theme={theme}
              onTriggerToast={onTriggerToast}
              setHoveredObject={setHoveredObject}
            />

            {/* 03 LAND PARCELS (低多边形几何草甸分块与平整田亩) */}
            <PastureFields theme={theme} />

            {/* 04 BOUNDARIES (低多边形石墙与标志性五杠原木门) */}
            <DrystoneWalls
              theme={theme}
              onTriggerToast={onTriggerToast}
              setHoveredObject={setHoveredObject}
            />

            {/* 5. Natural Meadow Flora & Wildflowers (纯净草甸上的点缀野花 · 全景微风律动) */}
            <g id="meadow-flanking-flora" opacity="0.9">
              {[
                { x: 470, y: 516, col: '#fef08a', h: 8, curv: 1 },
                { x: 420, y: 496, col: '#ffffff', h: 9, curv: -1 },
                { x: 375, y: 500, col: '#a855f7', h: 8, curv: 1 },
                { x: 330, y: 474, col: '#ffffff', h: 9, curv: -1 },
                { x: 285, y: 460, col: '#fef08a', h: 7, curv: 1 },
                { x: 245, y: 432, col: '#ffffff', h: 8, curv: -1 },
                { x: 205, y: 408, col: '#a855f7', h: 7, curv: 1 },
                { x: 150, y: 415, col: '#fef08a', h: 8, curv: -1 },
                { x: 90, y: 422, col: '#ffffff', h: 7, curv: 1 },
                { x: 20, y: 428, col: '#fef08a', h: 8, curv: -1 },
              ].map((fl, i) => {
                const flDelay = Number(((fl.x + 300) * 0.003).toFixed(2));
                return (
                  <g key={`spf-${i}`} transform={`translate(${fl.x}, ${fl.y})`}>
                    <g
                      className="animate-wind-flower"
                      style={{
                        animationDelay: `${flDelay}s`,
                        transformOrigin: '0px 0px',
                      }}
                    >
                      <path
                        d={`M0,0 Q${fl.curv},${-fl.h * 0.5} 0,${-fl.h}`}
                        stroke="#486d26"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <g transform={`translate(0, ${-fl.h})`}>
                        <circle cx="0" cy="0" r="1.9" fill={fl.col} />
                        {fl.col === '#ffffff' && <circle cx="0" cy="0" r="0.7" fill="#facc15" />}
                        {fl.col === '#fef08a' && <circle cx="0" cy="0" r="0.65" fill="#ca8a04" />}
                      </g>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* 6. COTTAGE VEGETABLE & PUMPKIN GARDEN (西翼阳光缓坡南瓜菜圃与香草地) */}
            <g id="cottage-pumpkin-patch" transform="translate(-120, 395)">
              {/* Ground contact shadow under garden beds */}
              <ellipse cx="50" cy="38" rx="60" ry="18" fill="#1b2518" opacity="0.35" />

              {/* Terraced Cedar Timber Raised Beds */}
              {/* Bed 1: Lower Raised Bed (Loam soil with ripe pumpkins) */}
              <polygon points="0,22 96,22 104,44 6,44" fill="#382210" stroke="#241407" strokeWidth="0.8" />
              <polygon points="2,23 94,23 100,42 8,42" fill="#4a2e16" />
              {/* Dark Loam Texture lines */}
              <line x1="8" y1="28" x2="92" y2="28" stroke="#321e0e" strokeWidth="0.8" />
              <line x1="12" y1="35" x2="96" y2="35" stroke="#321e0e" strokeWidth="0.8" />

              {/* Plump Golden-Orange Pumpkins with green vines & leaves */}
              {/* Pumpkin 1 (Big ripe prize pumpkin) */}
              <g transform="translate(26, 32)">
                <ellipse cx="0" cy="3" rx="10" ry="8" fill="#d97706" />
                <ellipse cx="-4" cy="3" rx="6" ry="7.5" fill="#ea580c" />
                <ellipse cx="4" cy="3" rx="6" ry="7.5" fill="#ea580c" />
                <ellipse cx="0" cy="2" rx="4" ry="7.5" fill="#f59e0b" />
                {/* Curly Green Stem */}
                <path d="M0,-4 Q2,-9 -2,-11" stroke="#365314" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                {/* Tendril leaf */}
                <ellipse cx="6" cy="-2" rx="3.5" ry="2" fill="#4d7c0f" transform="rotate(-15 6 -2)" />
              </g>

              {/* Pumpkin 2 */}
              <g transform="translate(54, 30)">
                <ellipse cx="0" cy="3" rx="8.5" ry="7" fill="#d97706" />
                <ellipse cx="-3.5" cy="3" rx="5.5" ry="6.5" fill="#ea580c" />
                <ellipse cx="3.5" cy="3" rx="5.5" ry="6.5" fill="#ea580c" />
                <ellipse cx="0" cy="2" rx="3.5" ry="6.5" fill="#f59e0b" />
                <path d="M0,-3 Q-2,-8 2,-9" stroke="#365314" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                <ellipse cx="-5" cy="-2" rx="3" ry="1.8" fill="#4d7c0f" transform="rotate(20 -5 -2)" />
              </g>

              {/* Pumpkin 3 */}
              <g transform="translate(78, 34)">
                <ellipse cx="0" cy="2.5" rx="7.5" ry="6" fill="#f59e0b" />
                <ellipse cx="-3" cy="2.5" rx="4.8" ry="5.5" fill="#d97706" />
                <ellipse cx="3" cy="2.5" rx="4.8" ry="5.5" fill="#d97706" />
                <path d="M0,-2 Q1,-6 -1,-7" stroke="#365314" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              </g>

              {/* Bed 2: Upper Raised Bed (Cabbages & Garden Herbs) */}
              <polygon points="12,4 86,4 92,20 18,20" fill="#382210" stroke="#241407" strokeWidth="0.8" />
              <polygon points="14,5 84,5 89,18 19,18" fill="#4a2e16" />
              {/* Savoy Cabbages */}
              {[28, 46, 64, 80].map((cx, idx) => (
                <g key={`cabbage-${idx}`} transform={`translate(${cx}, 12)`}>
                  <ellipse cx="0" cy="0" rx="4.5" ry="3.5" fill="#2d5236" />
                  <ellipse cx="-1" cy="-0.5" rx="3.5" ry="3" fill="#3f6e4a" />
                  <ellipse cx="0.5" cy="0" rx="2.5" ry="2" fill="#5ea56e" />
                  <circle cx="0" cy="-0.2" r="1.2" fill="#86efac" />
                </g>
              ))}

              {/* Hand-carved Wooden Garden Sign Stake */}
              <g transform="translate(-4, 38)">
                <rect x="0" y="0" width="2.5" height="14" rx="0.5" fill="#5c381e" stroke="#2a1608" strokeWidth="0.5" />
                <polygon points="-8,-9 16,-9 14,0 -10,0" fill="#eedcc5" stroke="#684628" strokeWidth="0.8" />
                <text x="3" y="-3" fill="#4a2c14" fontSize="5.5" fontWeight="bold" textAnchor="middle">
                  🎃 PUMPKINS
                </text>
              </g>

              {/* Stone Water Basin & Watering Can in Garden */}
              <g transform="translate(108, 32)">
                <ellipse cx="0" cy="7" rx="8" ry="4" fill="#1b2518" opacity="0.3" />
                <rect x="-6" y="0" width="12" height="7" rx="2" fill="#696053" stroke="#332c25" strokeWidth="0.8" />
                <ellipse cx="0" cy="0" rx="6" ry="2.2" fill="#386b68" stroke="#332c25" strokeWidth="0.6" />
                <ellipse cx="0" cy="0" rx="4.5" ry="1.4" fill="#64a5a1" opacity="0.75" />
              </g>
            </g>

            {/* 7. WEST HOMESTEAD WOODPILE & FLOWER BEDS */}
            <g id="west-cottage-grounds" transform="translate(-130, 330)">
              {/* Stacked split birch logs */}
              <ellipse cx="8" cy="18" rx="14" ry="5" fill="#1b2518" opacity="0.3" />
              <rect x="0" y="6" width="16" height="12" rx="1.5" fill="#523924" stroke="#2c1d12" strokeWidth="0.7" />
              {/* Log ends with birch bark and rings */}
              {[
                { x: 3, y: 10, r: 2.4 }, { x: 8, y: 10, r: 2.4 }, { x: 13, y: 10, r: 2.4 },
                { x: 5.5, y: 14.5, r: 2.4 }, { x: 10.5, y: 14.5, r: 2.4 },
              ].map((lg, i) => (
                <circle key={`wlog-${i}`} cx={lg.x} cy={lg.y} r={lg.r} fill="#d8cbba" stroke="#382618" strokeWidth="0.6" />
              ))}

              {/* Flowering Lavender Clump (迎风轻曳薰衣草) */}
              <g transform="translate(24, 14)">
                <g className="animate-wind-flower" style={{ animationDelay: '0.6s', transformOrigin: '0px 0px' }}>
                  <path d="M-2,5 Q-4,-4 -6,-10 M0,5 Q0,-5 0,-12 M2,5 Q4,-4 5,-9" stroke="#385434" strokeWidth="1.2" fill="none" />
                  <circle cx="-6" cy="-10" r="1.6" fill="#a855f7" />
                  <circle cx="0" cy="-12" r="1.8" fill="#9333ea" />
                  <circle cx="5" cy="-9" r="1.5" fill="#c084fc" />
                </g>
              </g>
            </g>

            {/* Delicate Homestead Garden Flora (野甘菊与三叶草，自然点缀主屋四周的开阔庭院草地 · 连动微风律动) */}
            <g id="homestead-garden-flora" opacity="0.85">
              {[
                { x: -160, y: 350 }, { x: -80, y: 360 }, { x: 80, y: 370 },
                { x: -40, y: 440 }, { x: 140, y: 460 }, { x: -180, y: 480 },
                { x: -90, y: 520 }, { x: 160, y: 510 }, { x: 320, y: 480 },
                { x: 440, y: 460 }, { x: 620, y: 420 }, { x: 740, y: 430 },
              ].map((fl, i) => {
                const hflDelay = Number(((fl.x + 200) * 0.003 + (fl.y - 350) * 0.001).toFixed(2));
                return (
                  <g key={`hfl-${i}`} transform={`translate(${fl.x}, ${fl.y})`}>
                    <g
                      className="animate-wind-flower"
                      style={{
                        animationDelay: `${hflDelay}s`,
                        transformOrigin: '0px 0px',
                      }}
                    >
                      <path d="M0,0 Q0.5,-3 0,-6" stroke="#486d26" strokeWidth="0.75" fill="none" />
                      <g transform="translate(0, -6)">
                        <circle cx="0" cy="0" r="1.7" fill="#ffffff" />
                        <circle cx="0" cy="0" r="0.65" fill="#fef08a" />
                      </g>
                    </g>
                  </g>
                );
              })}
            </g>
          </g>

          {/* ======================================================== */}
          {/* 1.5 TRACTOR & HAY BALES AT THE FARMYARD CORNER (农家角落·拖拉机与草垛) */}
          {/*     配备田园原木栅栏、农夫机耕车辙印与工具木桶，彻底摆脱悬空孤立感 */}
          {/* ======================================================== */}
          <g
            id="tractor-in-field"
            transform="translate(110, 220)"
            className="cursor-pointer transition-opacity hover:opacity-95"
            onMouseEnter={() => setHoveredObject('tractor')}
            onMouseLeave={() => setHoveredObject(null)}
          >
            {/* Weathered Timber Paddock Fence behind Tractor (木制农庄围栏) */}
            <g id="farm-paddock-fence" opacity="0.85">
              <line x1="-55" y1="18" x2="115" y2="18" stroke="#523d29" strokeWidth="2.5" />
              <line x1="-55" y1="26" x2="115" y2="26" stroke="#523d29" strokeWidth="2" />
              {[-45, -5, 35, 75, 110].map((fx) => (
                <rect key={`pf-${fx}`} x={fx - 1.5} y="10" width="3.2" height="24" rx="0.8" fill="#422f1f" />
              ))}
            </g>

            {/* Earthy Tractor Wheel Ruts & Farm Track (机耕泥泞车辙印) */}
            <g opacity="0.45">
              <path d="M22,46 C32,60 45,78 60,98" stroke="#52402e" strokeWidth="3" strokeDasharray="5 4" fill="none" />
              <path d="M42,46 C52,60 65,78 80,98" stroke="#52402e" strokeWidth="3" strokeDasharray="5 4" fill="none" />
            </g>

            {/* Packed earth & fine gravel parking pad under tractor */}
            <ellipse cx="46" cy="46" rx="54" ry="12" fill="#604f3d" opacity="0.32" />

            {/* Farmyard Wooden Water Barrel & Vintage Milk Churn at Corner */}
            <g transform="translate(100, 26)">
              <rect x="0" y="0" width="10" height="15" rx="1.5" fill="#523d28" stroke="#332415" strokeWidth="0.8" />
              <line x1="0" y1="4" x2="10" y2="4" stroke="#2b1f14" strokeWidth="0.9" />
              <line x1="0" y1="11" x2="10" y2="11" stroke="#2b1f14" strokeWidth="0.9" />
              <ellipse cx="5" cy="0" rx="4.5" ry="1.8" fill="#695137" />
            </g>

            {/* Golden Cylindrical Hay Bales neatly stacked beside tractor */}
            <g transform="translate(-32, 22)">
              {/* Bottom Left Hay Bale */}
              <ellipse cx="0" cy="12" rx="14" ry="9" fill="#e8c956" />
              <rect x="-14" y="0" width="28" height="12" fill="#d9b434" />
              <ellipse cx="0" cy="0" rx="14" ry="7" fill="#fae274" stroke="#c9a224" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="3" fill="none" stroke="#bfa02c" strokeWidth="1" strokeDasharray="3,2" />
            </g>
            <g transform="translate(-10, 26)">
              {/* Bottom Right Hay Bale */}
              <ellipse cx="0" cy="10" rx="13" ry="8" fill="#e8c956" />
              <rect x="-13" y="0" width="26" height="10" fill="#d9b434" />
              <ellipse cx="0" cy="0" rx="13" ry="6.5" fill="#fce47c" stroke="#c9a224" strokeWidth="0.8" />
            </g>
            <g transform="translate(-20, 10)">
              {/* Top Center Hay Bale */}
              <ellipse cx="0" cy="9" rx="12" ry="7" fill="#e8c956" />
              <rect x="-12" y="0" width="24" height="9" fill="#d9b434" />
              <ellipse cx="0" cy="0" rx="12" ry="6" fill="#fae274" stroke="#c9a224" strokeWidth="0.8" />
            </g>

            {/* Red Countryside Farm Tractor */}
            {/* Big Rear Wheel with Deep Tread & Bright Yellow Hub */}
            <circle cx="22" cy="30" r="18" fill="#242629" />
            {/* Rear Tire Tread Lugs */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1={22 + 14 * Math.cos((deg * Math.PI) / 180)}
                y1={30 + 14 * Math.sin((deg * Math.PI) / 180)}
                x2={22 + 18 * Math.cos((deg * Math.PI) / 180)}
                y2={30 + 18 * Math.sin((deg * Math.PI) / 180)}
                stroke="#141517"
                strokeWidth="2.5"
              />
            ))}
            <circle cx="22" cy="30" r="10" fill="#e0c868" stroke="#beaa46" strokeWidth="1.2" />
            <circle cx="22" cy="30" r="4" fill="#242629" />

            {/* Small Front Steering Wheel */}
            <circle cx="76" cy="37" r="10" fill="#242629" />
            <circle cx="76" cy="37" r="5" fill="#e0c868" stroke="#beaa46" strokeWidth="1" />
            <circle cx="76" cy="37" r="2.2" fill="#242629" />

            {/* Tractor Chassis & Transmission Link */}
            <rect x="22" y="32" width="54" height="6" fill="#303338" rx="1" />

            {/* Rear Mudguard / Fender */}
            <path d="M4,30 C4,14 40,14 40,30" stroke="#b83320" strokeWidth="5" fill="none" strokeLinecap="round" />

            {/* Tractor Engine Body & Hood (Crimson & Coral Highlights) */}
            <polygon points="16,18 48,15 82,23 82,37 32,37" fill="#d9402b" />
            <polygon points="16,18 48,15 48,22 18,24" fill="#f05b46" />
            {/* Front Radiator Grille */}
            <rect x="80" y="24" width="3" height="12" fill="#42474f" rx="1" />
            <line x1="81.5" y1="26" x2="81.5" y2="34" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />

            {/* Tractor Vertical Exhaust Chimney with gentle animated smoke */}
            <line x1="64" y1="21" x2="64" y2="6" stroke="#2b2d30" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="64" cy="6" r="2" fill="#4d5057" />
            <circle cx="64" cy="2" r="3" fill="#ffffff" opacity="0.6" className="animate-ping" />
            <circle cx="68" cy="-5" r="4.5" fill="#ffffff" opacity="0.35" className="animate-pulse" />

            {/* Tractor Open Driver Seat & Steering Wheel */}
            <rect x="18" y="10" width="12" height="9" rx="2.5" fill="#1b1c1e" />
            <line x1="38" y1="18" x2="33" y2="11" stroke="#222" strokeWidth="2.2" strokeLinecap="round" />
            <ellipse cx="32" cy="10" rx="3.5" ry="2" fill="none" stroke="#222" strokeWidth="1.8" />

            {/* Front Brass Headlight */}
            <circle cx="82" cy="28" r="3.2" fill="#fce47c" stroke="#947a28" strokeWidth="1" />
            {/* Headlight beam casting softly across the wheat field */}
            <polygon points="85,28 135,20 142,42 85,34" fill={theme.tractorLightGlow} className="pointer-events-none" />

            {/* Little harvest wooden basket on rear bracket with pumpkins */}
            <rect x="0" y="17" width="14" height="11" rx="1.5" fill="#9c7149" stroke="#6e4f32" strokeWidth="1" />
            <ellipse cx="4.5" cy="16" rx="3.5" ry="3" fill="#e88a38" />
            <ellipse cx="10" cy="16" rx="3.5" ry="3" fill="#eb9846" />
            <ellipse cx="7.2" cy="13.5" rx="3" ry="2.5" fill="#d97d2e" />
            {/* Pumpkin stems */}
            <line x1="7.2" y1="13.5" x2="7.2" y2="11" stroke="#3d6e42" strokeWidth="1.2" strokeLinecap="round" />
          </g>

          {/* ======================================================== */}
          {/* 1.8 HIGH MOUNTAIN DEEP-SPACE ALIEN RADIO STATION         */}
          {/*     (山巅高耸深空外星电波监听站 & 射电望远镜天线)         */}
          {/* ======================================================== */}
          <g id="hilltop-observatory-haven">
            {/* Mountain Ridge Wild Pines on the crest */}
            <g id="mountain-ridge-pines" opacity="0.85">
              <g transform="translate(820, 165)">
                <polygon points="0,0 8,-20 16,0" fill="#294833" />
                <polygon points="2,-12 8,-28 14,-12" fill="#355e42" />
                <line x1="8" y1="0" x2="8" y2="6" stroke="#2b2018" strokeWidth="2" />
              </g>
              <g transform="translate(945, 110)">
                <polygon points="0,0 7,-18 14,0" fill="#294833" />
                <polygon points="2,-10 7,-24 12,-10" fill="#355e42" />
                <line x1="7" y1="0" x2="7" y2="5" stroke="#2b2018" strokeWidth="1.8" />
              </g>
            </g>

            {/* Main Elevated SETI Alien Radio Station (Moved to Right Meadow Lawn at Green Box Location) */}
            <SceneEntity entityId="observatory" layout={sceneLayout}
              id="room-observatory"
              onClick={() => {
                if (!hasMovedRef.current) onSelectRoom('observatory');
              }}
              onMouseEnter={() => setHoveredObject('room-observatory')}
              onMouseLeave={() => setHoveredObject(null)}
              className="cursor-pointer group/observatory"
            >
  <ObservatoryHaven activeRoom={activeRoom} presenceSlots={presenceSlots} alienPulseEffect={alienPulseEffect}
    triggerAlienSignal={triggerAlienSignal} onSelectPerson={onSelectPerson} setHoveredObject={setHoveredObject} />
</SceneEntity>
          </g>

          {/* ======================================================== */}
          {/* 2. THE COTTAGE HAVEN (NOW SITUATED ACROSS THE ROAD)       */}
          {/*    Surrounded by lawn, stone path & garden               */}
          {/* ======================================================== */}
          <SceneEntity entityId="main_cottage" layout={sceneLayout} id="living-cottage-haven">
            {/* 2.5D Architectural Foundation, Ventilated Crawl Space & Porch Steps (工匠级建筑基底体系) */}
            <CottageFoundation />

            {/* 2.5D Artisan Hardwood Timber Flooring (工匠级实木企口地板与收边地袱大梁) */}
            <TimberFlooring />

            {/* Back Walls & Timber Frames (温润燕麦奶油暖灰泥墙，消除冷白暴晒灯箱感) */}
            <polygon points="-270,135 -270,-10 0,-90 0,58" fill="#d6c5ae" stroke="#5e412c" strokeWidth="2.2" />
            <polygon points="0,58 0,-90 270,-10 270,135" fill="#c9b79e" stroke="#5e412c" strokeWidth="2.2" />
            {/* Corner Ambient Shadow (两面墙接缝处的自然阴影深邃感) */}
            <polygon points="-8,56 0,58 8,56 0,-90" fill="#2d1c10" opacity="0.12" />

            {/* 2.5D Baseboards & Corner Ambient Occlusion Shadows (消除墙地漂浮感) */}
            <g id="cottage-baseboards-and-ao">
              {/* Left Wall Baseboard (沿 -270, 77 轴) */}
              <polygon points="-270,135 0,58 0,52 -270,129" fill="#5c3f29" stroke="#3d2a1b" strokeWidth="0.8" />
              <line x1="-270" y1="129" x2="0" y2="52" stroke="#875c3b" strokeWidth="1" opacity="0.8" />
              {/* Right Wall Baseboard (沿 270, 77 轴) */}
              <polygon points="0,58 270,135 270,129 0,52" fill="#4d3422" stroke="#332216" strokeWidth="0.8" />
              <line x1="0" y1="52" x2="270" y2="129" stroke="#755034" strokeWidth="1" opacity="0.8" />
              {/* Corner Floor Crease Ambient Occlusion Shadows */}
              <polygon points="-270,135 0,58 0,64 -270,141" fill="#1b120c" opacity="0.2" />
              <polygon points="0,58 270,135 270,141 0,64" fill="#1b120c" opacity="0.25" />
            </g>




            {/* 2.5D Storybook Terracotta Tile Roof Eaves & Vaulted Timber Rafters */}
            <CottageRoofFraming roofColor={theme.roofColor} />

            {/* Exterior Storybook Red Brick Rooftop Chimney (严格居中于屋脊 x=0，与室内烟道 100% 同轴绝对对齐) */}
            <g id="exterior-rooftop-chimney" transform="translate(0, -90)">
              {/* Neat Brick Collar / Ridge Skirt (平整服帖的烟囱贴脊砖座，杜绝生硬突出的异物小翅膀) */}
              <polygon points="-10,3 0,0 10,3 10,6 0,3 -10,6" fill="#7a341f" stroke="#522012" strokeWidth="0.6" />
              {/* Storybook Red Brick Chimney Stem */}
              <rect x="-8" y="-48" width="16" height="48" rx="2" fill="#ab5438" stroke="#6d2e1b" strokeWidth="0.8" />
              <rect x="-8" y="-48" width="8" height="48" rx="2" fill="#8c3f25" stroke="#6d2e1b" strokeWidth="0.6" />
              {/* Soft Brick Texture & Mortar Lines */}
              <line x1="0" y1="-48" x2="0" y2="0" stroke="#d4795b" strokeWidth="1" opacity="0.7" />
              <line x1="-8" y1="-36" x2="8" y2="-36" stroke="#6d2e1b" strokeWidth="0.7" />
              <line x1="-8" y1="-24" x2="8" y2="-24" stroke="#6d2e1b" strokeWidth="0.7" />
              <line x1="-8" y1="-12" x2="8" y2="-12" stroke="#6d2e1b" strokeWidth="0.7" />
              <line x1="-4" y1="-36" x2="-4" y2="-24" stroke="#6d2e1b" strokeWidth="0.5" />
              <line x1="4" y1="-24" x2="4" y2="-12" stroke="#6d2e1b" strokeWidth="0.5" />
              {/* Stepped Terracotta Cap & Pot (圆润陶土出烟风帽) */}
              <rect x="-10.5" y="-53" width="21" height="5" rx="2" fill="#8c3f25" stroke="#5c2615" strokeWidth="0.8" />
              <ellipse cx="0" cy="-53" rx="5.5" ry="2.2" fill="#522010" stroke="#3b160b" strokeWidth="0.7" />
              {/* Soft Puffy Marshmallow Clouds drifting into sky (与下方烟道严格对齐的白云慢烟) */}
              <circle cx="0" cy="-62" r="4.5" fill="#ffffff" opacity="0.75" className="animate-[bounce_3.2s_infinite]" />
              <circle cx="2" cy="-74" r="7" fill="#ffffff" opacity="0.55" className="animate-[pulse_3.8s_infinite]" />
              <circle cx="-1" cy="-90" r="9.5" fill="#ffffff" opacity="0.38" />
              <circle cx="3" cy="-108" r="12.5" fill="#ffffff" opacity="0.2" />
            </g>

            {/* 2.5D Heavy Timber Corner King Posts & Siding Cutaway Wall Profiles */}
            <CottageWallProfiles />

            {/* --- ROOM 1: MY ROOM (LEFT WING) - 我的阁楼书屋 (2.5D 重构) --- */}
            <g
              id="room-my_room"
              onClick={() => {
                if (!hasMovedRef.current) onSelectRoom('my_room');
              }}
              onMouseEnter={() => setHoveredObject('room-my_room')}
              onMouseLeave={() => setHoveredObject(null)}
              className="cursor-pointer group"
            >
              {/* Room Highlight Aura */}
              <polygon
                points="-270,135 -100,85 -40,130 -210,180"
                fill={activeRoom === 'my_room' ? 'rgba(214, 140, 104, 0.16)' : 'transparent'}
                stroke={activeRoom === 'my_room' ? '#d68c68' : 'transparent'}
                strokeWidth="2"
                strokeDasharray={activeRoom === 'my_room' ? '6 4' : 'none'}
              />

              {/* 1.1 2.5D ISOMETRIC WINDOW ON LEFT WALL (高度整体下移 +22px，完美契合书桌工作视线，消解贴梁紧迫感与下方大片冷清留白) */}
              <g id="isometric-bay-window">
                {/* 墙体窗洞阴影与外实木窗框 (严格顺应左墙等轴测坡度 k = -77/270 ≈ -0.2852) */}
                <polygon
                  points="-234,24.3 -146,-0.8 -146,61.2 -234,86.3"
                  fill="#452f1e"
                  stroke="#2c1d12"
                  strokeWidth="1.5"
                />

                {/* 窗洞内凹暗部与右侧厚度壁 (向内凹陷 3px 进深，展现轻盈内嵌墙体厚度) */}
                <polygon
                  points="-231,26.0 -149,2.6 -149,59.6 -231,83.0"
                  fill="#23170e"
                />
                {/* 窗洞上内壁阴影面 */}
                <polygon
                  points="-231,26.0 -149,2.6 -149,5.6 -231,29.0"
                  fill="#180f08"
                />

                {/* Sunlit Glass Pane with Landscape (窗外远山与柔和天光：严格保持原版 theme.cottageGlow 温馨色调) */}
                <polygon
                  points="-228,30.0 -151,8.0 -151,58.5 -228,80.5"
                  fill={theme.cottageGlow}
                />
                {/* Distant Hills Silhouette viewed through window (原版田园远山微景) */}
                <path
                  d="M-228,64 Q-190,50 -151,54 L-151,58.5 L-228,80.5 Z"
                  fill="#9bc48e"
                  opacity="0.45"
                />

                {/* 2.5D Window Mullions (田字格实木窗棂：竖棂严格垂直向下，横棂严格沿左墙轴倾斜 k = -0.2852) */}
                <line x1="-189.5" y1="19.0" x2="-189.5" y2="69.5" stroke="#4a3321" strokeWidth="2.2" />
                <line x1="-228" y1="55.2" x2="-151" y2="33.2" stroke="#4a3321" strokeWidth="2.2" />

                {/* Curtain Rod above Window (窗帘挂杆：严格沿左墙轴倾斜 k = -0.2852) */}
                <line x1="-239" y1="22.5" x2="-141" y2="-5.4" stroke="#382415" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="-239" cy="22.5" r="2.5" fill="#523924" />
                <circle cx="-141" cy="-5.4" r="2.5" fill="#523924" />

                {/* Cozy Linen Curtain on Left side (微卷亚麻米白窗帘与红陶扎带) */}
                <path
                  d="M-237,23.5 Q-231,43 -235,65 Q-239,77 -234,86 L-228,88 Q-233,77 -230,65 Q-226,43 -232,25 Z"
                  fill="#f5ede0"
                  stroke="#d5c8b5"
                  strokeWidth="0.8"
                />
                <ellipse cx="-232" cy="65" rx="3.5" ry="2" fill="#c47a4f" />

                {/* Sunlight Cast onto Timber Floor (从调整后的窗户自然倾泻在桌面与地面的暖金光斑) */}
                <polygon
                  points="-231,85.0 -149,61.6 -108,94.0 -195,118.0"
                  fill={theme.cottageGlow}
                  opacity="0.16"
                  className="pointer-events-none"
                />
              </g>

              {/* 1.15 2.5D LEFT WALL CRAFT BOARD (手作工具洞洞墙 + 陶木风铃挂饰 + 三人温馨拍立得合照) */}
              <LeftWallCraftBoard
                onHover={(label) => setHoveredObject(label)}
                selfPerson={selfPerson}
                linPerson={linPerson}
                yuPerson={yuPerson}
                layout={currentLayout}
                effectiveGizmoId={effectiveGizmoId}
                isInspectorOpen={isInspectorOpen}
                onSelectGizmo={onSelectGizmo}
                onDragGizmoDelta={onDragGizmoDelta}
                onDragGizmoEnd={onDragGizmoEnd}
              />

              {/* 1.2 2.5D LIGHTWEIGHT CRAFT DESK (独立 SVG 结构与桌面插槽系统：支持整桌移动与摆件独立微调) */}
              <g
                id="isometric-desk-container"
                transform={`translate(${currentLayout['desk-group'].screen.x}, ${currentLayout['desk-group'].screen.y})`}
                onClick={(e) => {
                  if (isInspectorOpen) {
                    e.stopPropagation();
                    onSelectGizmo?.(effectiveGizmoId === 'desk-group' ? null : 'desk-group');
                  }
                }}
              >
                <AtticDesk
                  layout={currentLayout}
                  isInspectorOpen={isInspectorOpen}
                  activeGizmoId={effectiveGizmoId}
                  onSelectGizmo={onSelectGizmo}
                  onDragGizmoDelta={onDragGizmoDelta}
                  onDragGizmoEnd={onDragGizmoEnd}
                  onHoverObject={(label) => setHoveredObject(label)}
                />

                {/* 2.5D 书桌整体交互把手 (仅在校准器开启且选中书桌整体时渲染) */}
                {effectiveGizmoId === 'desk-group' && (
                  <IsoGizmo
                    pos={{ x: 0, y: 15 }}
                    displayCoords={currentLayout['desk-group'].screen}
                    fixedW={0}
                    label="阁楼手工书桌"
                    onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
                    onDragEnd={() => onDragGizmoEnd?.()}
                  />
                )}
              </g>

              {/* 1.3 2.5D POTTED MONSTERA DELICIOSA (书桌左侧生机龟背竹盆栽：带开背深裂叶、沃土粗陶盆与微风摇曳) */}
              <g
                id="isometric-monstera-container"
                transform={`translate(${currentLayout['desk-monstera'].screen.x}, ${currentLayout['desk-monstera'].screen.y})`}
                onClick={(e) => {
                  if (isInspectorOpen) {
                    e.stopPropagation();
                    onSelectGizmo?.(effectiveGizmoId === 'desk-monstera' ? null : 'desk-monstera');
                  }
                }}
                className={isInspectorOpen ? 'cursor-pointer' : ''}
              >
                <MonsteraPlant
                  onHover={(hovered) => {
                    if (isInspectorOpen) {
                      setHoveredObject(hovered ? 'plant:书桌左侧生机龟背竹 (点击可校准位置)' : null);
                    } else {
                      setHoveredObject(hovered ? 'plant:书桌生机龟背竹 (点击轻拂叶片与露水)' : null);
                    }
                  }}
                />

                {/* 2.5D 龟背竹交互把手 (仅在校准器开启且选中龟背竹时渲染) */}
                {effectiveGizmoId === 'desk-monstera' && (
                  <IsoGizmo
                    pos={{ x: 0, y: 11 }}
                    displayCoords={currentLayout['desk-monstera'].screen}
                    fixedW={0}
                    label="书桌生机龟背竹"
                    onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
                    onDragEnd={() => onDragGizmoEnd?.()}
                  />
                )}
              </g>

              {/* 1.4 2.5D ERGONOMIC WORK CHAIR & CHARACTER: Self (阁楼手作白橡木温莎椅与工作人物：支持椅子与人物随动校准，修正朝向) */}
              <g
                id="isometric-chair-container"
                transform={`translate(${currentLayout['attic-chair'].screen.x}, ${currentLayout['attic-chair'].screen.y})`}
                className={isInspectorOpen ? 'cursor-pointer' : ''}
              >
                {(() => {
                  const deskOccupant = presenceSlots.desk_workstation?.occupant;
                  const isActuallySeated = !isChairEmptyOverride && Boolean(deskOccupant);

                  return (
                    <WindsorChair
                      isSeated={isActuallySeated}
                      occupant={deskOccupant}
                      isInspectorOpen={isInspectorOpen}
                      isSelected={effectiveGizmoId === 'attic-chair'}
                      onClick={(e) => {
                        if (isInspectorOpen) {
                          e.stopPropagation();
                          onSelectGizmo?.(effectiveGizmoId === 'attic-chair' ? null : 'attic-chair');
                        } else {
                          e.stopPropagation();
                          onOpenChairInspector?.();
                        }
                      }}
                      onHover={(label) => setHoveredObject(label)}
                      onToggleSeated={() => onToggleChairSeated?.(!isActuallySeated)}
                      onOpenInspectorModal={onOpenChairInspector}
                    />
                  );
                })()}

                {/* 2.5D 轴测校准把手 (仅在校准器开启且选中温莎椅时渲染) */}
                {effectiveGizmoId === 'attic-chair' && (
                  <IsoGizmo
                    pos={{ x: 0, y: 19.5 }}
                    displayCoords={currentLayout['attic-chair'].screen}
                    fixedW={0}
                    label="手作白橡木温莎椅"
                    onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
                    onDragEnd={() => onDragGizmoEnd?.()}
                  />
                )}
              </g>
            </g>

            {/* --- ROOM 2: LIVING NOOK (CENTER) - 暖炉黑胶与茶室 (2.5D 重构) --- */}
            <g
              id="room-living_nook"
              onClick={() => {
                if (!hasMovedRef.current) onSelectRoom('living_nook');
              }}
              onMouseEnter={() => setHoveredObject('room-living_nook')}
              onMouseLeave={() => setHoveredObject(null)}
              className="cursor-pointer group"
            >
              {/* 2.1 2.5D FREESTANDING CAST-IRON WOOD STOVE (经典铸铁柴火暖炉：支持2.5D轴测校准对齐与即时换色) */}
              <g
                id="isometric-wood-stove"
                transform={`translate(${currentLayout['wood-stove'].screen.x}, ${currentLayout['wood-stove'].screen.y})`}
                onClick={(e) => {
                  if (isInspectorOpen) {
                    e.stopPropagation();
                    onSelectGizmo?.(effectiveGizmoId === 'wood-stove' ? null : 'wood-stove');
                  }
                }}
                className="cursor-pointer group/stove"
              >
                <CastIronWoodStove
                  color={stoveColor}
                  onSelectColor={(newColor) => {
                    setStoveColor(newColor);
                    try {
                      localStorage.setItem('storybook_stove_color', newColor);
                    } catch {}
                    if (onFireplaceClick) onFireplaceClick();
                  }}
                  onClick={
                    isInspectorOpen
                      ? (e) => {
                          e.stopPropagation();
                          onSelectGizmo?.(effectiveGizmoId === 'wood-stove' ? null : 'wood-stove');
                        }
                      : undefined
                  }
                  scale={1.38}
                  showSwitchUI={!isInspectorOpen}
                />

                {/* 2.5D 暖炉交互把手 */}
                {effectiveGizmoId === 'wood-stove' && (
                  <IsoGizmo
                    pos={{ x: 0, y: 66 }}
                    displayCoords={currentLayout['wood-stove'].screen}
                    fixedW={0}
                    label="铸铁柴火暖炉"
                    onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
                    onDragEnd={() => onDragGizmoEnd?.()}
                  />
                )}
              </g>

              {/* 2.15 2.5D RECONSTRUCTED SOLID WOOD TATAMI DAYBED (全新重构日式实木榻榻米休闲榻：与铸铁暖炉保持适宜的生活安全间距与透视呼吸感) */}
              <g
                id="isometric-daybed"
                transform={`translate(${(currentLayout['daybed'].screen.x) + 14}, ${(currentLayout['daybed'].screen.y) + 4})`}
                onClick={(e) => {
                  if (isInspectorOpen) {
                    e.stopPropagation();
                    onSelectGizmo?.(effectiveGizmoId === 'daybed' ? null : 'daybed');
                  }
                }}
                className="cursor-pointer group/daybed"
                onMouseEnter={() => setHoveredObject('daybed')}
                onMouseLeave={() => setHoveredObject(null)}
              >
                {/* 1. Floor Ambient Occlusion Shadow (地板上的温润漫反射投影，稳稳扎根) */}
                <polygon
                  points="21,79 48,70 105,86 77,96"
                  fill="#1b120a"
                  opacity="0.28"
                  filter="url(#softShadow)"
                />
                <polygon
                  points="24,78 48,71 101,86 76,93"
                  fill="#120c06"
                  opacity="0.35"
                  filter="url(#softShadow)"
                />

                {/* Fireplace Breathing Space: Floor warmth & Straw Slippers (暖炉与榻榻米之间的安全通透空间及日式草编小拖鞋) */}
                <g id="daybed-slippers" transform="translate(36, 78)">
                  {/* Left Slipper */}
                  <ellipse cx="-2.5" cy="0" rx="3.5" ry="1.8" fill="#1b120c" opacity="0.3" />
                  <ellipse cx="-2.5" cy="-0.5" rx="3.2" ry="1.6" fill="#c2a77a" stroke="#8c704f" strokeWidth="0.4" />
                  <path d="M-4.5,-0.6 C-4.5,-2.2 -0.8,-2.2 -0.8,-0.6" fill="#523824" stroke="#3b2618" strokeWidth="0.5" />
                  {/* Right Slipper */}
                  <ellipse cx="4.5" cy="1.8" rx="3.5" ry="1.8" fill="#1b120c" opacity="0.3" />
                  <ellipse cx="4.5" cy="1.3" rx="3.2" ry="1.6" fill="#c2a77a" stroke="#8c704f" strokeWidth="0.4" />
                  <path d="M2.5,1.2 C2.5,-0.4 6.2,-0.4 6.2,1.2" fill="#523824" stroke="#3b2618" strokeWidth="0.5" />
                </g>

                {/* 2. 4 Solid Wood Corner Feet (4根实木转角立柱脚：与围架底角 100% 严丝合缝对齐，稳固支撑) */}
                {/* Back-Left Foot (后左转角脚：顶面严格接合 frame BL 底角 48, 67) */}
                <g id="daybed-foot-bl">
                  <polygon points="45.5,67.7 48,67 48,72 45.5,72.7" fill="#2d1c10" />
                  <polygon points="48,67 50.5,67.7 50.5,72.7 48,72" fill="#22150c" />
                  <ellipse cx="48" cy="72.4" rx="2" ry="0.8" fill="#1b120a" opacity="0.4" filter="url(#softShadow)" />
                </g>
                {/* Back-Right Foot (靠墙右上角转角立柱脚：顶面严密咬合木架底角 102, 82.4，垂直下垂到地面 87.4，绝不外凸) */}
                <g id="daybed-foot-br">
                  {/* Right Facet (沿右侧围板底缘：从 98.8, 83.3 严丝合缝连至 102, 82.4，垂直向下延伸 5px) */}
                  <polygon
                    points="98.8,83.3 102,82.4 102,87.4 98.8,88.3"
                    fill="#362012"
                    stroke="#24150b"
                    strokeWidth="0.35"
                  />
                  {/* Rear Facet (沿后侧墙面底缘：从 99.0, 81.5 连至 102, 82.4，垂直向下延伸 5px) */}
                  <polygon
                    points="99.0,81.5 102,82.4 102,87.4 99.0,86.5"
                    fill="#22140a"
                    stroke="#160c06"
                    strokeWidth="0.35"
                  />
                  {/* Shared Vertical Outer Corner Edge (严密对齐床架右上转角顶点 102, 82.4) */}
                  <line x1="102" y1="82.4" x2="102" y2="87.4" stroke="#5c361c" strokeWidth="0.6" strokeLinecap="round" />
                  {/* Protective Foot Pad (立柱底部微型静音防护脚垫：严格居中对齐立柱正下方，宽度与腿柱 100% 严丝合缝) */}
                  <ellipse cx="100.4" cy="87.6" rx="1.6" ry="0.65" fill="#1b120a" stroke="#0e0804" strokeWidth="0.3" />
                  {/* Foot Ground Contact Shadow (地面软接触阴影：同轴垂直居中) */}
                  <ellipse cx="100.4" cy="88.0" rx="2.0" ry="0.75" fill="#140c06" opacity="0.45" filter="url(#softShadow)" />
                </g>
                {/* Front-Left Foot (正前左转角脚：与前立面 24, 73.8 与左立面严格共线同轴，下垂 5px 到地面 24, 78.8) */}
                <g id="daybed-foot-fl">
                  {/* Left Facet (沿左立面斜率 -0.2852) */}
                  <polygon points="24,73.8 26.5,73.1 26.5,78.1 24,78.8" fill="#362012" />
                  {/* Front Facet (沿前立面斜率 +0.2852) */}
                  <polygon points="24,73.8 27.5,74.8 27.5,79.8 24,78.8" fill="#4d301c" />
                  {/* Shared Vertical Corner Edge (与围架转角无缝一体) */}
                  <line x1="24" y1="73.8" x2="24" y2="78.8" stroke="#754b2c" strokeWidth="0.8" strokeLinecap="round" />
                  {/* Protective Foot Pad */}
                  <ellipse cx="25.5" cy="78.8" rx="2.2" ry="0.8" fill="#1b120a" stroke="#0e0804" strokeWidth="0.3" />
                  {/* Foot Ground Contact Shadow */}
                  <ellipse cx="25.5" cy="79.3" rx="2.5" ry="1.0" fill="#1b120a" opacity="0.45" filter="url(#softShadow)" />
                </g>
                {/* Front-Right Foot (正前右转角脚：与前立面 78, 89.2 及右侧立面严格共线，下垂到地面 78, 94.2) */}
                <g id="daybed-foot-fr">
                  {/* Front Facet (沿前立面斜率 +0.2852) */}
                  <polygon points="74.5,88.2 78,89.2 78,94.2 74.5,93.2" fill="#4a2e1a" />
                  {/* Side Facet (沿右侧转角斜率 -0.2852) */}
                  <polygon points="78,89.2 81.2,88.3 81.2,93.3 78,94.2" fill="#301c0f" />
                  {/* Shared Vertical Corner Edge */}
                  <line x1="78" y1="89.2" x2="78" y2="94.2" stroke="#704729" strokeWidth="0.8" strokeLinecap="round" />
                  {/* Protective Foot Pad */}
                  <ellipse cx="77.0" cy="94.0" rx="2.2" ry="0.8" fill="#1b120a" stroke="#0e0804" strokeWidth="0.3" />
                  {/* Foot Ground Contact Shadow */}
                  <ellipse cx="77.0" cy="94.4" rx="2.6" ry="1.0" fill="#1b120a" opacity="0.45" filter="url(#softShadow)" />
                </g>

                {/* 3. Solid Wood Timber Platform Frame (厚重实木底台：厚度 6px，温润原木边框) */}
                {/* Timber Frame Rear Skirt Under-Shadow (床架背部深色闭塞阴影，隔断墙脚踢脚线穿透) */}
                <polygon points="48,67 102,82.4 102,84.0 48,68.6" fill="#180e07" opacity="0.75" />

                {/* Timber Frame Left Face (面向暖炉的左侧实木厚度立面) */}
                <polygon points="48,61 24,67.8 24,73.8 48,67" fill="#422916" stroke="#2d1a0c" strokeWidth="0.6" strokeLinejoin="round" />
                {/* Warm Hearth Firelight Reflection on Left Timber Face (炉火打在侧板上的呼吸感温暖橙光) */}
                <polygon points="48,61 24,67.8 24,73.8 48,67" fill="#f59e0b" opacity="0.22" className="animate-[pulse_2.4s_infinite]" />

                {/* Timber Frame Front Face (正前方实木大立面：温润柚木色与倒角高光) */}
                <polygon points="24,67.8 78,83.2 78,89.2 24,73.8" fill="#5c3a21" stroke="#3d2413" strokeWidth="0.6" strokeLinejoin="round" />
                {/* Timber Grain Line */}
                <line x1="26" y1="71" x2="76" y2="86.2" stroke="#4a2d18" strokeWidth="0.8" opacity="0.6" />
                {/* Front Bottom Shadow Crease */}
                <line x1="24" y1="73.8" x2="78" y2="89.2" stroke="#29160a" strokeWidth="0.8" />
                {/* Front Top Chamfer Highlight */}
                <line x1="24" y1="67.8" x2="78" y2="83.2" stroke="#875b36" strokeWidth="0.9" strokeLinecap="round" />

                {/* Timber Frame Right Face (面向墙面与绿植的右侧厚重实木大梁裙板，彻底消除“薄片”感) */}
                <polygon
                  points="78,83.2 102,76.4 102,82.4 78,89.2"
                  fill="#3e2514"
                  stroke="#29170b"
                  strokeWidth="0.6"
                  strokeLinejoin="round"
                />
                {/* Right Side Timber Grain & Depth Accents */}
                <line x1="80" y1="86.2" x2="100" y2="80.5" stroke="#2c1a0e" strokeWidth="0.8" opacity="0.7" />
                {/* Right Bottom Shadow Crease */}
                <line x1="78" y1="89.2" x2="102" y2="82.4" stroke="#1a0e06" strokeWidth="0.8" />
                {/* Right Top Chamfer / Bevel Highlight */}
                <line x1="78" y1="83.2" x2="102" y2="76.4" stroke="#683f21" strokeWidth="0.8" strokeLinecap="round" />
                {/* Back-Right Corner Vertical Seam (后右转角垂直棱线：与下方腿柱垂直轴心 100% 同轴对齐) */}
                <line x1="102" y1="76.4" x2="102" y2="82.4" stroke="#52321a" strokeWidth="0.7" strokeLinecap="round" />
                {/* Front-Right Corner Joinery Seam (转角榫卯咬合坚固分界线) */}
                <line x1="78" y1="83.2" x2="78" y2="89.2" stroke="#754b2b" strokeWidth="0.9" strokeLinecap="round" />

                {/* Timber Frame Exposed Top Rim Border (四周实木包边外缘顶面) */}
                <polygon points="48,61 102,76.4 78,83.2 24,67.8" fill="#754b2b" stroke="#52321a" strokeWidth="0.6" />

                {/* 4. Authentic Thick Woven Tatami Mat with Dark Linen Border (厚实质朴蔺草榻榻米席面 + 传统深咖/黑织物包边缘边) */}
                {/* Mat Left Thickness (草席左侧厚度立面，高出木架 4px) */}
                <polygon points="47.5,57.5 24.5,64 24.5,67.8 47.5,61.3" fill="#3e5239" stroke="#2a3827" strokeWidth="0.5" />
                {/* Mat Front Thickness (草席正前厚度立面) */}
                <polygon points="24.5,64 77.5,79.1 77.5,83.1 24.5,67.8" fill="#4d6648" stroke="#334530" strokeWidth="0.5" />

                {/* Mat Right Thickness (蔺草席靠墙侧厚实立面，与木架无缝贴合，彻底消除草席“薄片”感) */}
                <polygon
                  points="77.5,79.1 100.5,72.6 100.5,76.5 77.5,83.1"
                  fill="#384c35"
                  stroke="#253523"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
                {/* Mat Right Bottom Shadow Seam on Timber Rim */}
                <line x1="77.5" y1="83.1" x2="100.5" y2="76.5" stroke="#22150a" strokeWidth="0.6" opacity="0.8" />

                {/* Mat Top Main Rush Surface (榻榻米平整席面：温润天然风干蔺草绿 #7e9c76) */}
                <polygon points="47.5,57.5 100.5,72.6 77.5,79.1 24.5,64" fill="#7e9c76" stroke="#66825f" strokeWidth="0.6" />
                {/* Hearth Ambient Fire Glow on Tatami Head (暖炉给榻榻米头部带来的微暖过渡) */}
                <polygon points="47.5,57.5 65,62.5 42,69 24.5,64" fill="#d97706" opacity="0.14" className="animate-[pulse_2.4s_infinite]" />

                {/* Traditional Japanese Tatami Weave Ribs (天然蔺草紧密细腻经纬编织纹理) */}
                <line x1="41.8" y1="59.1" x2="94.8" y2="74.2" stroke="#6e8a67" strokeWidth="0.6" strokeDasharray="3 2" opacity="0.75" />
                <line x1="36.0" y1="60.8" x2="89.0" y2="75.9" stroke="#6e8a67" strokeWidth="0.6" strokeDasharray="3 2" opacity="0.75" />
                <line x1="30.2" y1="62.4" x2="83.2" y2="77.5" stroke="#6e8a67" strokeWidth="0.6" strokeDasharray="3 2" opacity="0.75" />

                {/* Traditional Dark Linen Binding Tape - Tatami-Beri (日式传统深青黑织物滚边包角，带手工米金暗缝线) */}
                {/* Back Edge Binding (后沿包边) */}
                <polygon points="47.5,57.5 100.5,72.6 98.2,73.3 45.2,58.2" fill="#202922" />
                <line x1="45.5" y1="58.1" x2="98.5" y2="73.2" stroke="#b3a282" strokeWidth="0.5" strokeDasharray="2 1.5" opacity="0.7" />
                {/* Front Edge Binding (前沿包边) */}
                <polygon points="24.5,64 77.5,79.1 75.2,79.8 22.2,64.7" fill="#202922" />
                <line x1="22.5" y1="64.6" x2="75.5" y2="79.7" stroke="#b3a282" strokeWidth="0.5" strokeDasharray="2 1.5" opacity="0.7" />
                {/* Front-Right Corner Binding Wrap (右前角织物封边包裹，严密闭合) */}
                <polygon points="76.2,79.5 77.5,79.1 77.5,83.1 76.2,83.5" fill="#202922" stroke="#161c17" strokeWidth="0.3" />
                {/* Back-Right Corner Binding Wrap (右后角织物封边包裹) */}
                <polygon points="99.2,73.0 100.5,72.6 100.5,76.5 99.2,76.9" fill="#202922" stroke="#161c17" strokeWidth="0.3" />

                {/* 5. Plump 3D Cloud Pillow (温润天然亚麻燕麦米色羽绒枕：柔和舒适，告别生硬死白) */}
                <g id="tatami-pillow" transform="translate(38, 62)">
                  {/* Pillow Drop Shadow on Tatami (落在草席上的真实凹陷柔和投影) */}
                  <ellipse cx="0" cy="3.5" rx="10" ry="5.2" fill="#2b3b2c" opacity="0.32" filter="url(#softShadow)" />
                  {/* Plump Pillow Bottom Shaded Cushion (枕下侧阴影托底) */}
                  <path
                    d="M-9,2 C-10,5 -3,7 0,7 C3,7 10,5 9,2 C8,-1 4,-2 0,-2 C-4,-2 -8,-1 -9,2 Z"
                    fill="#c2b8a3"
                    stroke="#9e947f"
                    strokeWidth="0.6"
                  />
                  {/* Plump Pillow Top Surface (温润天然未漂白亚麻燕麦米色) */}
                  <path
                    d="M-8.5,1.2 C-9.5,4 -2.5,5.8 0,5.8 C2.5,5.8 9.5,4 8.5,1.2 C7.5,-1.8 3.5,-2.8 0,-2.8 C-3.5,-2.8 -7.5,-1.8 -8.5,1.2 Z"
                    fill="#dfd6c4"
                    stroke="#b8ad96"
                    strokeWidth="0.5"
                  />
                  {/* Soft Warm Inner Glow Highlight (轻柔高光晕，非纯白) */}
                  <ellipse cx="-0.8" cy="0.6" rx="6.2" ry="3.2" fill="#eae3d3" opacity="0.85" />
                  {/* Upper Rim Piping Accent */}
                  <path d="M-7.5,0.8 C-4.5,-1.8 2,-1.8 7.2,0.8" stroke="#f0ebe0" strokeWidth="0.6" fill="none" opacity="0.75" />
                  {/* Gentle Head Resting Indentation (头部依偎轻微凹陷折痕与同色布包纽扣) */}
                  <path d="M-3.5,1.6 Q0,2.6 3.5,1.6" stroke="#9e937d" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                  <circle cx="0" cy="1.7" r="0.9" fill="#8c8069" />
                </g>

                {/* 6. Leisure Elements on Tatami: Open Book for Afternoon Reading (榻席上的随手翻开便携小说，充满生活恬适感) */}
                <g id="tatami-book" transform="translate(53, 65)">
                  <ellipse cx="0" cy="2" rx="4.5" ry="2.2" fill="#2b3b2c" opacity="0.25" />
                  {/* Book Cover */}
                  <polygon points="-4.5,0.5 0,1.8 4.5,0.5 4,2 0,3.2 -4,2" fill="#4a5d4e" />
                  {/* Open Paper Pages */}
                  <polygon points="-4,0.3 0,1.5 0,-1.5 -4,-2.7" fill="#f5ede0" stroke="#d5c8b2" strokeWidth="0.3" />
                  <polygon points="0,1.5 4,0.3 4,-2.7 0,-1.5" fill="#fcf8f2" stroke="#d5c8b2" strokeWidth="0.3" />
                  {/* Spine Crease */}
                  <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#9e8a70" strokeWidth="0.5" />
                  {/* Text lines hint */}
                  <line x1="-3" y1="-1.6" x2="-0.8" y2="-0.8" stroke="#a3927d" strokeWidth="0.3" opacity="0.7" />
                  <line x1="-3" y1="-0.8" x2="-0.8" y2="0" stroke="#a3927d" strokeWidth="0.3" opacity="0.7" />
                  <line x1="0.8" y1="-0.8" x2="3" y2="-1.6" stroke="#a3927d" strokeWidth="0.3" opacity="0.7" />
                  <line x1="0.8" y1="0" x2="3" y2="-0.8" stroke="#a3927d" strokeWidth="0.3" opacity="0.7" />
                </g>

                {/* 7. Thick Folded Terracotta Quilt (温润红陶瓦色双层厚折叠羊毛盖毯：居中安放在榻榻米席面中间，平整安全扎实，告别边缘滑落感) */}
                <g id="tatami-folded-quilt">
                  {/* Quilt Cast Ambient Shadow on Mat Surface */}
                  <polygon
                    points="67,73.5 89,79.8 83,82.8 61,76.5"
                    fill="#233024"
                    opacity="0.25"
                    filter="url(#softShadow)"
                  />

                  {/* Quilt Lower Fold Layer (底层折叠垫层：厚实温润红陶色) */}
                  <polygon
                    points="73,67.5 89,72.1 83,76.8 67,72.2"
                    fill="#9c3b22"
                    stroke="#7a2a16"
                    strokeWidth="0.5"
                    strokeLinejoin="round"
                  />
                  {/* Lower Layer Front Thickness Rim */}
                  <polygon
                    points="67,72.2 83,76.8 83,78.2 67,73.6"
                    fill="#752714"
                  />

                  {/* Quilt Top Fold Layer (上层折叠主被面：蓬松微鼓、饱满圆角、稳稳居中) */}
                  <path
                    d="M 72.5,65.5 L 88.5,70.1 C 89.8,70.5 89.8,71.8 88.5,72.3 L 81.5,76.2 C 80.5,76.7 79.2,76.4 78.5,75.6 L 66.5,70.5 C 65.2,70.0 65.2,68.8 66.5,68.3 L 71.5,65.8 C 71.8,65.6 72.1,65.5 72.5,65.5 Z"
                    fill="#b9482f"
                    stroke="#8a2e18"
                    strokeWidth="0.6"
                    strokeLinejoin="round"
                  />
                  {/* Top Layer Front Thickness Rim */}
                  <polygon
                    points="66.5,70.5 78.5,75.6 78.5,77.2 66.5,72.1"
                    fill="#872914"
                  />

                  {/* Quilt Top Highlight & Texture (温暖羊毛肌理压线与圆润折边微反光) */}
                  <line x1="72.5" y1="65.5" x2="66.5" y2="70.5" stroke="#df7258" strokeWidth="1" strokeLinecap="round" />
                  <line x1="77.5" y1="67.0" x2="71.5" y2="72.0" stroke="#df7258" strokeWidth="0.6" strokeLinecap="round" opacity="0.75" />
                  <line x1="82.5" y1="68.5" x2="76.5" y2="73.5" stroke="#df7258" strokeWidth="0.6" strokeLinecap="round" opacity="0.75" />
                  {/* Waffle Knit Stitch Dashed Thread Accent */}
                  <line x1="72.5" y1="65.5" x2="88.5" y2="70.1" stroke="#e8856e" strokeWidth="0.7" opacity="0.6" strokeDasharray="3 2" />
                  <line x1="68.5" y1="68.8" x2="84.5" y2="73.4" stroke="#e8856e" strokeWidth="0.6" opacity="0.5" strokeDasharray="3 2" />
                </g>

                {/* 2.5D 榻榻米交互把手 */}
                {effectiveGizmoId === 'daybed' && (
                  <IsoGizmo
                    pos={{ x: 60, y: 74 }}
                    displayCoords={currentLayout['daybed'].screen}
                    fixedW={0}
                    label="榻榻米休闲榻"
                    onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
                    onDragEnd={() => onDragGizmoEnd?.()}
                  />
                )}
              </g>

              {/* 2.2 2.5D 轻盈日式咖啡黑胶边柜 (告别笨重沉闷实木，纤细斜腿，收纳咖啡豆、手作杯子、摩卡壶与黑胶唱片机) */}
              <g
                id="isometric-turntable-console"
                transform={`translate(${currentLayout['cabinet-group'].screen.x}, ${currentLayout['cabinet-group'].screen.y})`}
                onClick={(e) => {
                  if (isInspectorOpen) {
                    e.stopPropagation();
                    onSelectGizmo?.(effectiveGizmoId === 'cabinet-group' ? null : 'cabinet-group');
                  }
                }}
              >
                <RecordCabinet
                  onHoverObject={(label) => setHoveredObject(label)}
                  layout={currentLayout}
                  isInspectorOpen={isInspectorOpen}
                  activeGizmoId={effectiveGizmoId}
                  onSelectGizmo={onSelectGizmo}
                  onDragGizmoDelta={onDragGizmoDelta}
                  onDragGizmoEnd={onDragGizmoEnd}
                />

                {/* 2.5D 边柜整体交互把手 */}
                {effectiveGizmoId === 'cabinet-group' && (
                  <IsoGizmo
                    pos={{ x: 0, y: 0 }}
                    displayCoords={currentLayout['cabinet-group'].screen}
                    fixedW={0}
                    label="咖啡黑胶边柜"
                    onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
                    onDragEnd={() => onDragGizmoEnd?.()}
                  />
                )}
              </g>


              {/* 2.3 2.5D ISOMETRIC WOVEN TATAMI HEARTH RUG (完全契合等轴测轴线与地板木纹的日式编织大织毯：四边斜率绝对为 ±0.2852) */}
              <g id="isometric-hearth-rug">
                {/* Floor Contact Soft Ambient Shadow */}
                <polygon
                  points="-68,130 12,107.2 92,130 12,152.8"
                  fill="#1f140b"
                  opacity="0.25"
                  filter="url(#softShadow)"
                />

                {/* Outer Dark Linen Border (深咖色外滚边：平行于左右墙轴线) */}
                <polygon
                  points="-64,130 12,108.3 88,130 12,151.7"
                  fill="#785c41"
                  stroke="#543d28"
                  strokeWidth="1.2"
                />

                {/* Main Woven Straw / Linen Surface (浅亚麻麦秆编织面) */}
                <polygon
                  points="-60,130 12,109.5 84,130 12,150.5"
                  fill="#ddd3be"
                  stroke="#c5b9a0"
                  strokeWidth="0.8"
                />

                {/* Inner Double Inset Border (精致内双框虚线) */}
                <polygon
                  points="-50,130 12,112.3 74,130 12,147.7"
                  fill="none"
                  stroke="#8f7253"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  opacity="0.75"
                />
              </g>

              {/* 2.4 2.5D SOLID WOOD ELEVATED LOW TEA TABLE (日式原木圆矮茶几：重构真实三维离地高度、外八实木腿、桌底通透结构与标准圆柱厚度立面) */}
              <g
                id="isometric-tea-table"
                transform={`translate(${currentLayout['tea-table'].screen.x}, ${currentLayout['tea-table'].screen.y})`}
                onClick={(e) => {
                  if (isInspectorOpen) {
                    e.stopPropagation();
                    onSelectGizmo?.(effectiveGizmoId === 'tea-table' ? null : 'tea-table');
                  }
                }}
                className="cursor-pointer group/teatable"
              >
                {/* 1. Ground Contact Shadows on Tatami Rug (地毯上的柔和漫反射环境光遮蔽投影) */}
                <ellipse cx="0" cy="11" rx="25" ry="10" fill="#29180c" opacity="0.22" filter="url(#softShadow)" />
                <ellipse cx="0" cy="10" rx="16" ry="6.5" fill="#1b1008" opacity="0.28" filter="url(#softShadow)" />

                {/* 2. Rear Legs (后方两根实木桌腿：稳稳扎根于地毯上，呈现真实桌下离地纵深) */}
                {/* Back-Left Leg (后左桌腿) */}
                <g id="tea-leg-back-left">
                  <ellipse cx="-13" cy="8.2" rx="2.5" ry="1.1" fill="#1c0f06" opacity="0.4" filter="url(#softShadow)" />
                  <polygon points="-11,-2.5 -8,-3.5 -11.5,8 -14.5,8" fill="#422915" stroke="#2e1b0c" strokeWidth="0.4" />
                  <ellipse cx="-13" cy="8" rx="1.6" ry="0.75" fill="#2d1a0b" />
                </g>
                {/* Back-Right Leg (后右桌腿) */}
                <g id="tea-leg-back-right">
                  <ellipse cx="13" cy="8.2" rx="2.5" ry="1.1" fill="#1c0f06" opacity="0.4" filter="url(#softShadow)" />
                  <polygon points="8,-3.5 11,-2.5 14.5,8 11.5,8" fill="#4a2e18" stroke="#2e1b0c" strokeWidth="0.4" />
                  <ellipse cx="13" cy="8" rx="1.6" ry="0.75" fill="#2d1a0b" />
                </g>

                {/* Under-Table Wood Apron & Cross-Bracing (桌底加固原木X龙骨，展现扎实木作结构) */}
                <polygon points="-11,-1 11,-4.5 12,-3 -10,0.5" fill="#54351c" />
                <polygon points="-5,-4.5 5,-1 4,0.5 -6,-3" fill="#442913" />

                {/* 3. Front Splayed Legs (前侧两根微外八受光实木桌腿：高光分明，支撑有力) */}
                {/* Front-Left Leg (前左实木桌腿) */}
                <g id="tea-leg-front-left">
                  {/* Floor Contact Occlusion Shadow */}
                  <ellipse cx="-12" cy="13.2" rx="3.2" ry="1.3" fill="#1f1208" opacity="0.4" filter="url(#softShadow)" />
                  {/* Leg Tapered Body */}
                  <polygon points="-9,0.5 -5.8,2.2 -10.5,12.8 -13.8,12" fill="#754b27" stroke="#4d2f16" strokeWidth="0.5" />
                  {/* Highlight along leg */}
                  <line x1="-7.5" y1="1.8" x2="-11.8" y2="12.2" stroke="#996639" strokeWidth="0.8" strokeLinecap="round" />
                  {/* Foot Tip */}
                  <ellipse cx="-12.1" cy="12.2" rx="1.9" ry="0.85" fill="#54351a" />
                </g>
                {/* Front-Right Leg (前右实木桌腿) */}
                <g id="tea-leg-front-right">
                  {/* Floor Contact Occlusion Shadow */}
                  <ellipse cx="12" cy="13.2" rx="3.2" ry="1.3" fill="#1f1208" opacity="0.4" filter="url(#softShadow)" />
                  {/* Leg Tapered Body */}
                  <polygon points="5.8,2.2 9,0.5 13.8,12 10.5,12.8" fill="#694120" stroke="#3d240f" strokeWidth="0.5" />
                  {/* Highlight along leg */}
                  <line x1="7.5" y1="1.8" x2="11.8" y2="12.2" stroke="#8a582b" strokeWidth="0.8" strokeLinecap="round" />
                  {/* Foot Tip */}
                  <ellipse cx="12.1" cy="12.2" rx="1.9" ry="0.85" fill="#472a12" />
                </g>

                {/* 4. Tabletop Solid Wood Cylinder (5px 厚度实木圆盘立面：严谨弧形投影，彻底根除“扁平浅盘”错觉) */}
                {/* Cylindrical Rim Band (侧面厚度立面：自 y=-6 到 y=-1，前弧高度延伸至 y=9) */}
                <path
                  d="M -24,-6 L -24,-1 A 24 10 0 0 0 24,-1 L 24,-6 A 24 10 0 0 1 -24,-6 Z"
                  fill="#8c5a31"
                  stroke="#59361a"
                  strokeWidth="0.7"
                  strokeLinejoin="round"
                />
                {/* Rim Bottom Shadow Arc */}
                <path
                  d="M -24,-1 A 24 10 0 0 0 24,-1"
                  stroke="#422610"
                  strokeWidth="0.8"
                  fill="none"
                />
                {/* Left Shaded Cylinder Arc */}
                <path
                  d="M -24,-6 L -24,-1 A 24 10 0 0 0 -6,8.4 L -6,3.4 A 24 10 0 0 1 -24,-6 Z"
                  fill="#704422"
                  opacity="0.55"
                />

                {/* 5. Tabletop Smooth Top Surface (顶面平整圆盘：温润浅橡木/黄松木色泽) */}
                <ellipse cx="0" cy="-6" rx="24" ry="10" fill="#c49462" stroke="#b08050" strokeWidth="0.6" />

                {/* Decorative Inlaid White Accent Ring (工艺镶嵌式象牙白整圈装饰环线：工整闭环贴合轴测，增添层次破除单调) */}
                <ellipse cx="0" cy="-6" rx="22.2" ry="9.25" fill="none" stroke="#fdfcf8" strokeWidth="1.2" opacity="0.9" />
                <ellipse cx="0" cy="-6" rx="20.8" ry="8.67" fill="none" stroke="#f5ede0" strokeWidth="0.6" strokeDasharray="3 2" opacity="0.65" />

                {/* Natural Wood Grain Rings (细腻原木微年轮纹) */}
                <path d="M-17,-6 C-9,-9.5 9,-9.5 17,-6" stroke="#b07e4e" strokeWidth="0.6" fill="none" opacity="0.3" />
                <path d="M-13,-4 C-6,-7 6,-7 13,-4" stroke="#b07e4e" strokeWidth="0.5" fill="none" opacity="0.25" />

                {/* 6. Tea Service Set (立体木茶盘、手作青瓷急须茶壶、白瓷品茗杯与茶点) */}
                <g id="tea-set">
                  {/* Solid Walnut Tea Tray (实木小茶盘底托：赋予茶具有序沉稳的陈设感) */}
                  <ellipse cx="-2" cy="-7.5" rx="14" ry="5.8" fill="#4d3018" stroke="#361f0e" strokeWidth="0.5" />
                  <ellipse cx="-2" cy="-8" rx="13.2" ry="5.3" fill="#694324" />
                  <path d="M-14,-7.8 A 14 5.8 0 0 0 10,-7.8" stroke="#8a5c36" strokeWidth="0.6" fill="none" opacity="0.55" />

                  {/* Kyusu Teapot (立体青瓷侧把提梁急须茶壶) */}
                  {/* Teapot Drop Shadow */}
                  <ellipse cx="-6" cy="-8" rx="5" ry="2.2" fill="#2d1b0d" opacity="0.35" />
                  {/* Teapot Body Cylinder */}
                  <path d="M-10.8,-10.5 L-10.8,-8.5 A 4.8 2.2 0 0 0 -1.2,-8.5 L-1.2,-10.5 A 4.8 2.2 0 0 1 -10.8,-10.5 Z" fill="#324c31" />
                  <ellipse cx="-6" cy="-10.5" rx="4.8" ry="2.1" fill="#466944" stroke="#5d8a5a" strokeWidth="0.5" />
                  {/* Pot Lid & Amber Knob */}
                  <ellipse cx="-6" cy="-11.2" rx="3" ry="1.3" fill="#558053" />
                  <circle cx="-6" cy="-12" r="0.9" fill="#f59e0b" />
                  {/* Curved Spout */}
                  <path d="M-10.8,-9.5 Q-13.5,-10.5 -13.5,-12" stroke="#466944" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                  {/* Bamboo Overhead Handle */}
                  <path d="M-9.5,-10.5 C-9.5,-17 -2.5,-17 -2.5,-10.5" stroke="#b45309" strokeWidth="1.3" fill="none" />
                  {/* Rising Tea Steam (袅袅茶香水汽) */}
                  <path d="M-6,-14 C-7.5,-18 -4.5,-21 -6.5,-25" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.75" className="animate-[pulse_1.8s_infinite]" />

                  {/* Ceramic Teacups (两只具有高度立面的白瓷品茗杯与碧绿茶汤) */}
                  {/* Cup 1 (Host Cup) */}
                  <ellipse cx="2.2" cy="-7.5" rx="2.5" ry="1.2" fill="#2d1b0d" opacity="0.3" />
                  <path d="M0,-9.2 L0,-7.8 A 2.2 1 0 0 0 4.4,-7.8 L4.4,-9.2 A 2.2 1 0 0 1 0,-9.2 Z" fill="#dedad2" />
                  <ellipse cx="2.2" cy="-9.2" rx="2.2" ry="1" fill="#fcfbf7" stroke="#e2ded4" strokeWidth="0.4" />
                  <ellipse cx="2.2" cy="-9.4" rx="1.6" ry="0.7" fill="#4d7c0f" />

                  {/* Cup 2 (Guest Cup, facing Yu) */}
                  <ellipse cx="7" cy="-4.5" rx="2.5" ry="1.2" fill="#2d1b0d" opacity="0.3" />
                  <path d="M4.8,-6.2 L4.8,-4.8 A 2.2 1 0 0 0 9.2,-4.8 L9.2,-6.2 A 2.2 1 0 0 1 4.8,-6.2 Z" fill="#dedad2" />
                  <ellipse cx="7" cy="-6.2" rx="2.2" ry="1" fill="#fcfbf7" stroke="#e2ded4" strokeWidth="0.4" />
                  <ellipse cx="7" cy="-6.4" rx="1.6" ry="0.7" fill="#4d7c0f" />

                  {/* Wagashi Sweets Plate (和果子茶点小碟) */}
                  <ellipse cx="-2" cy="-3" rx="3.6" ry="1.6" fill="#f5f0e8" stroke="#dbd3c5" strokeWidth="0.5" />
                  <ellipse cx="-2.8" cy="-3.3" rx="1.2" ry="0.7" fill="#f472b6" />
                  <ellipse cx="-1.1" cy="-3.1" rx="1.1" ry="0.7" fill="#84cc16" />
                </g>

                {/* 2.5D 交互把手 (三维轴向拖拽) */}
                {effectiveGizmoId === 'tea-table' && (
                  <IsoGizmo
                    pos={{ x: 0, y: 10 }}
                    displayCoords={currentLayout['tea-table'].screen}
                    fixedW={0}
                    label="圆矮茶几"
                    onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
                    onDragEnd={() => onDragGizmoEnd?.()}
                  />
                )}
              </g>

              {/* 2.5 SCENE-BASED PRESENCE SLOTS: Tea Table Cushions (茶桌交互槽位映射：东席侧身、西席侧身镜像、南席圆润落肩背身，支持 2.5D 布局校准器独立微调) */}
              {(['tea_cushion_east', 'tea_cushion_west', 'tea_cushion_south'] as const).map((slotKey) => {
                const resolvedSlot = presenceSlots[slotKey];
                const person = resolvedSlot?.occupant;
                const slotCfg = resolvedSlot?.config;
                if (!resolvedSlot || !slotCfg) return null;

                // 映射对应的 gizmoId
                const gizmoKey: EditableObjectId =
                  slotKey === 'tea_cushion_east'
                    ? 'tea-cushion-east'
                    : slotKey === 'tea_cushion_west'
                    ? 'tea-cushion-west'
                    : 'tea-cushion-south';

                // v6 tea seats remain independently editable in cottage space.
                const posX = currentLayout[gizmoKey].screen.x;
                const posY = currentLayout[gizmoKey].screen.y;

                const isGizmoActive = effectiveGizmoId === gizmoKey;

                return (
                  <g
                    key={slotKey}
                    id={`tea-slot-${slotKey}`}
                    transform={`translate(${posX}, ${posY})`}
                    onClick={(e) => {
                      if (isInspectorOpen) {
                        e.stopPropagation();
                        onSelectGizmo?.(isGizmoActive ? null : gizmoKey);
                        return;
                      }
                      if (person) {
                        e.stopPropagation();
                        onSelectPerson(person);
                      } else {
                        // 空蒲团点击：若有配置，可提示或选中房间
                        e.stopPropagation();
                        onSelectRoom('living_nook');
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      if (person) {
                        setHoveredObject(`person-${person.id}`);
                      } else {
                        setHoveredObject(`slot:茶桌${slotCfg.slotName} (虚位以待)`);
                      }
                    }}
                    onMouseLeave={() => setHoveredObject(null)}
                    className="cursor-pointer group/char"
                  >
                    {/* Ground Cushion Shadow (草编蒲团接触阴影) */}
                    <ellipse cx="0" cy="8" rx="14" ry="5" fill="#24180f" opacity="0.3" filter="url(#softShadow)" />

                    {/* 2.5D Thick Zabuton Cushion (草编厚蒲团坐垫：透视贴合地面) */}
                    <g id={`zabuton-${slotKey}`}>
                      <path d="M-12,3.5 C-12,7 12,7 12,3.5 L12,6.5 C12,10 -12,10 -12,6.5 Z" fill="#99876a" />
                      <ellipse
                        cx="0"
                        cy="3.5"
                        rx="12"
                        ry="4.5"
                        fill="#c7b99d"
                        stroke={isGizmoActive ? '#fbbf24' : '#ded4bd'}
                        strokeWidth={isGizmoActive ? 1.4 : 0.8}
                      />
                    </g>

                    {/* Character Nestled on Cushion based on Slot View Mapping */}
                    {person && (
                      <g transform={slotCfg.mirrored ? 'scale(-1, 1)' : undefined}>
                        {/* 1. SEATED LOWER BODY / ROBE BASE */}
                        <ellipse cx="0" cy="3" rx="10" ry="3.5" fill={person.shirtColor} filter="url(#softShadow)" />

                        {/* 2. TORSO & SHOULDERS ACCORDING TO VIEW ANGLE */}
                        {slotCfg.viewAngle === 'back' ? (
                          /* 南席背身视效：圆润自然落肩，无凸起凹陷，温和后颈与脊柱中缝 */
                          <g id="tea-person-back-torso">
                            <path
                              d="M-6,2 C-7,-4 -5,-9 0,-9 C5,-9 7,-4 6,2 Z"
                              fill={person.shirtColor}
                            />
                            {/* 后背脊柱中缝与后领口 */}
                            <line x1="0" y1="-7.5" x2="0" y2="1.5" stroke="#000000" strokeWidth="0.65" opacity="0.14" strokeLinecap="round" />
                            <path d="M-3.5,-8.8 Q0,-8.0 3.5,-8.8" stroke="#000000" strokeWidth="0.6" opacity="0.18" fill="none" />
                            <path d="M-4,1 Q0,3 4,1" stroke="#000000" strokeWidth="0.6" opacity="0.16" fill="none" />
                          </g>
                        ) : (
                          /* 东西席侧身对坐视效：圆润落肩，双手端茶/捧杯轻品 */
                          <g id="tea-person-side-torso">
                            <path
                              d="M-6,1 C-7,-5 -5,-10 0,-10 C5,-10 7,-5 6,1 Z"
                              fill={person.shirtColor}
                            />
                            {/* Cupped Hands holding a cup */}
                            <ellipse cx="-2" cy="0.5" rx="2.5" ry="1.5" fill={person.skinColor || '#f5d6be'} />
                            <ellipse cx="-2" cy="-0.5" rx="1.8" ry="1.0" fill="#fcfbf7" />
                            <path d="M-4,1.5 Q0,3 4,1.5" stroke="#000000" strokeWidth="0.5" opacity="0.15" fill="none" />
                          </g>
                        )}

                        {/* 3. HEAD & BEANIE (Strictly driven by slot facing: side / side_mirrored / back) */}
                        <CharacterHead
                          cx={0}
                          cy={-14}
                          r={7}
                          skinColor={person.skinColor || '#fad4c0'}
                          hairColor={person.hairColor || '#1a1a1a'}
                          hairStyle={person.hairStyle || 'curtain_crescent'}
                          beanieColor={person.beanieColor || '#38493d'}
                          hasPompom={person.hasPompom ?? true}
                          facing={slotCfg.facing}
                        />

                        {/* Character Status Tag (仅悬停时柔和显现，纠正镜像翻转) */}
                        <g
                          transform={slotCfg.mirrored ? 'scale(-1, 1) translate(0, -28)' : 'translate(0, -28)'}
                          className="opacity-0 group-hover/char:opacity-100 transition-opacity duration-200 pointer-events-none"
                        >
                          <rect x="-44" y="-8" width="88" height="17" rx="8.5" fill="#1c1917" opacity="0.94" stroke="#c47a4f" strokeWidth="0.6" />
                          <text x="0" y="4" fill="#f0ebe1" fontSize="9" fontWeight="bold" textAnchor="middle">
                            🍵 {person.name} · {slotCfg.badgeLabel.split('(')[0].trim()}
                          </text>
                        </g>
                      </g>
                    )}

                    {/* Empty Cushion Subtle Indicator on Hover (虚位以待提示) */}
                    {!person && (
                      <g
                        transform="translate(0, -14)"
                        className="opacity-0 group-hover/char:opacity-100 transition-opacity duration-200 pointer-events-none"
                      >
                        <rect x="-38" y="-7.5" width="76" height="15" rx="7.5" fill="#1c1917" opacity="0.9" stroke="#99876a" strokeWidth="0.6" />
                        <text x="0" y="3" fill="#e8dfd1" fontSize="8" fontWeight="medium" textAnchor="middle">
                          🍵 {slotCfg.slotName} · 空置
                        </text>
                      </g>
                    )}

                    {/* 2.5D 轴测校准把手 */}
                    {isGizmoActive && (
                      <IsoGizmo
                        pos={{ x: 0, y: 4 }}
                        displayCoords={currentLayout[gizmoKey].screen}
                        fixedW={0}
                        label={slotCfg.slotName}
                        onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
                        onDragEnd={() => onDragGizmoEnd?.()}
                      />
                    )}
                  </g>
                );
              })}
            </g>

            {/* --- ROOM 3: LIN'S ROOM (RIGHT WING) - 林木的花园书房 (2.5D 重构) --- */}
            <g
              id="room-friend_room"
              onClick={() => {
                if (!hasMovedRef.current) onSelectRoom('friend_room');
              }}
              onMouseEnter={() => setHoveredObject('room-friend_room')}
              onMouseLeave={() => setHoveredObject(null)}
              className="cursor-pointer group"
            >
              {/* Room Highlight Aura */}
              <polygon
                points="40,130 100,85 270,135 210,180"
                fill={activeRoom === 'friend_room' ? 'rgba(214, 140, 104, 0.16)' : 'transparent'}
                stroke={activeRoom === 'friend_room' ? '#d68c68' : 'transparent'}
                strokeWidth="2"
                strokeDasharray={activeRoom === 'friend_room' ? '6 4' : 'none'}
              />

              {/* 3.0 2.5D HARMONIOUS RIGHT WALL ART GALLERY (全新右墙艺术海报三联组：《泳者之心》+《还有明天》+《红辣椒》) */}
              <g
                id="isometric-wall-posters-container"
                transform={`translate(${currentLayout['wall-posters'].screen.x}, ${currentLayout['wall-posters'].screen.y})`}
                onClick={(e) => {
                  if (isInspectorOpen) {
                    e.stopPropagation();
                    onSelectGizmo?.(effectiveGizmoId === 'wall-posters' ? null : 'wall-posters');
                  }
                }}
              >
                <WallPostersGallery
                  onSelectPoster={(id) => {
                    if (isInspectorOpen) {
                      onSelectGizmo?.('wall-posters');
                    } else {
                      setSelectedPosterId(id);
                      onSelectPoster?.(id);
                    }
                  }}
                  onHoverPoster={(text) => setHoveredObject(text)}
                />

                {/* 2.5D 艺术海报三联组交互微调把手 */}
                {effectiveGizmoId === 'wall-posters' && (
                  <IsoGizmo
                    pos={{ x: 101, y: 15 }}
                    displayCoords={currentLayout['wall-posters'].screen}
                    fixedW={0}
                    label="右墙海报三联组"
                    onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
                    onDragEnd={() => onDragGizmoEnd?.()}
                  />
                )}
              </g>

              {/* 3.1 2.5D RUSTIC HANDCRAFTED 5-TIER LOG BOOKSHELF (纯净架体 + 参数化插槽解耦资产，支持整体与槽位独立校准) */}
              <g
                id="isometric-bookshelf-container"
                transform={`translate(${(currentLayout['bookshelf-group'].screen.x) - 193}, ${(currentLayout['bookshelf-group'].screen.y) - 124})`}
                onClick={(e) => {
                  if (isInspectorOpen) {
                    e.stopPropagation();
                    onSelectGizmo?.(effectiveGizmoId === 'bookshelf-group' ? null : 'bookshelf-group');
                  }
                }}
              >
                <Bookshelf
                  preset={bookshelfPreset}
                  customTiers={customBookshelfTiers}
                  isLinReadingHere={isLinReading}
                  onShelfClick={(e) => {
                    if (isInspectorOpen) {
                      e?.stopPropagation();
                      onSelectGizmo?.(effectiveGizmoId === 'bookshelf-group' ? null : 'bookshelf-group');
                    } else {
                      if (onBookshelfClick) onBookshelfClick();
                    }
                  }}
                  onBookClick={(book, tierIndex, e) => {
                    if (isInspectorOpen) {
                      e?.stopPropagation();
                    } else {
                      onBookClick?.(book, tierIndex);
                      if (onBookshelfClick) onBookshelfClick();
                    }
                  }}
                  onDecorationClick={(_dec, _tierIndex, e) => {
                    if (isInspectorOpen) {
                      e?.stopPropagation();
                    } else {
                      if (onBookshelfClick) onBookshelfClick();
                    }
                  }}
                  onHoverObject={(text) => setHoveredObject(text ? `bookshelf:${text}` : null)}
                  layout={currentLayout}
                  activeGizmoId={effectiveGizmoId}
                  isInspectorOpen={isInspectorOpen}
                  onSelectGizmo={onSelectGizmo}
                  onDragGizmoDelta={onDragGizmoDelta}
                  onDragGizmoEnd={onDragGizmoEnd}
                />

                {/* 2.5D 书架整体交互把手 (仅在校准器开启且选中书架整体时渲染) */}
                {effectiveGizmoId === 'bookshelf-group' && (
                  <IsoGizmo
                    pos={{ x: 193, y: 124 }}
                    displayCoords={currentLayout['bookshelf-group'].screen}
                    fixedW={0}
                    label="原木四层书架 (整体)"
                    onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
                    onDragEnd={() => onDragGizmoEnd?.()}
                  />
                )}
              </g>

              {/* 3.2 2.5D ARTISAN NORDIC POTTED FIDDLE-LEAF FIG (北欧哑光燕麦竖棱陶筒盆 + 天然胡桃木十字高脚架 + 生态感琴叶榕) */}
              <g
                id="isometric-houseplant"
                transform={`translate(${currentLayout['fiddle-plant'].screen.x}, ${currentLayout['fiddle-plant'].screen.y})`}
                onClick={(e) => {
                  if (isInspectorOpen) {
                    e.stopPropagation();
                    onSelectGizmo?.(effectiveGizmoId === 'fiddle-plant' ? null : 'fiddle-plant');
                  }
                }}
                className={isInspectorOpen ? 'cursor-pointer' : ''}
              >
                <FiddleLeafFig
                  onHover={(hovered) => {
                    if (isInspectorOpen) {
                      setHoveredObject(hovered ? 'plant:客厅生机琴叶榕 (点击可校准位置)' : null);
                    } else {
                      setHoveredObject(hovered ? 'plant:客厅生机琴叶榕 (点击轻拂叶片与微光)' : null);
                    }
                  }}
                />

                {/* 2.5D 交互把手 (仅在校准器开启且选中琴叶榕时渲染) */}
                {effectiveGizmoId === 'fiddle-plant' && (
                  <IsoGizmo
                    pos={{ x: 0, y: 15 }}
                    displayCoords={currentLayout['fiddle-plant'].screen}
                    fixedW={0}
                    label="客厅生机琴叶榕"
                    onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
                    onDragEnd={() => onDragGizmoEnd?.()}
                  />
                )}
              </g>

              {/* 3.3 2.5D ULTRA-COZY ISOMETRIC LAZY BEANBAG SOFA (紧凑小巧的软糯面包懒人沙发 · 比例恰当不显屋小) */}
              <g
                id="isometric-lazy-sofa"
                transform={`translate(${currentLayout['lazy-sofa'].screen.x}, ${currentLayout['lazy-sofa'].screen.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerSofaSquish();
                  if (isInspectorOpen) {
                    onSelectGizmo?.(effectiveGizmoId === 'lazy-sofa' ? null : 'lazy-sofa');
                  }
                }}
                onMouseEnter={() => setHoveredObject('lazy-sofa')}
                onMouseLeave={() => setHoveredObject(null)}
                className="cursor-pointer group/sofa"
              >
                {/* 1. Floor Shadow & Braided Linen Oval Rug (精致小巧的编织棉麻圆毯) */}
                <ellipse cx="0" cy="12" rx="18" ry="8" fill="#1b120c" opacity="0.28" filter="url(#softShadow)" />
                <ellipse cx="0" cy="11" rx="21" ry="10" fill="#f3ede3" stroke="#ded4c5" strokeWidth="0.8" />
                <ellipse cx="0" cy="11" rx="18" ry="8.5" fill="none" stroke="#cfc1af" strokeWidth="0.6" strokeDasharray="2.5 2.5" />
                {/* Wool fringe tassels */}
                {[-16, -10, -4, 2, 8, 14].map((tx) => (
                  <line key={tx} x1={tx} y1="19" x2={tx + 1.5} y2="21.5" stroke="#cfc1af" strokeWidth="0.8" strokeLinecap="round" />
                ))}

                {/* 2. Main Beanbag Body with Interactive Squish Spring (温润治愈焦糖南瓜色无骨懒人沙发) */}
                <g className={sofaSquish ? 'transition-transform duration-300 scale-95 origin-bottom' : 'transition-transform duration-300 scale-100 origin-bottom'}>
                  {/* High Plush Backrest Puff (饱满小靠背包，焦糖南瓜饱满色泽) */}
                  <path
                    d="M-13,-5 C-16,-18 -8,-24 3,-24 C13,-24 18,-17 15,-4 C13,6 -9,6 -13,-5 Z"
                    fill="url(#caramelPumpkinBack)"
                    stroke="#8c3b0d"
                    strokeWidth="1"
                  />
                  {/* Backrest Upper Rim Highlight (南瓜金橙柔和绒面反光) */}
                  <path d="M-7,-21 Q3,-24 11,-21" fill="none" stroke="#fec590" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
                  {/* Fabric Seam Lines */}
                  <path d="M-6,-19 C-4,-12 -2,-5 -2,0" fill="none" stroke="#943d0f" strokeWidth="0.8" opacity="0.65" />
                  <path d="M3,-21 C4,-14 5,-5 5,0" fill="none" stroke="#943d0f" strokeWidth="0.8" opacity="0.65" />
                  <path d="M10,-18 C11,-12 11,-4 11,0" fill="none" stroke="#943d0f" strokeWidth="0.8" opacity="0.65" />

                  {/* Main Sunken Cushion Pouf (厚实小圆座包，焦糖南瓜渐变软糯布艺) */}
                  <path
                    d="M-17,2 C-18,11 -10,16 0,16 C10,16 18,11 17,2 C15,-4 12,-7 0,-7 C-12,-7 -15,-4 -17,2 Z"
                    fill="url(#caramelPumpkinSeat)"
                    stroke="#8c3b0d"
                    strokeWidth="1"
                  />
                  {/* Lower Rim Shadow Facet */}
                  <path
                    d="M-15,6 C-15,13 -1,17 12,12 C17,9 17,4 17,2 C14,9 6,14 -1,14 C-10,14 -15,10 -15,6 Z"
                    fill="#752e09"
                    opacity="0.48"
                  />
                  {/* Sunken Seat Cavity Crease (舒适深凹陷焦糖暗影) */}
                  <ellipse cx="0" cy="3" rx="10" ry="5.5" fill="#782f09" opacity="0.4" />
                  {/* Soft Gather Wrinkles */}
                  <path d="M-12,1 Q-7,4 -3,3" fill="none" stroke="#8c3b0d" strokeWidth="0.9" strokeLinecap="round" opacity="0.75" />
                  <path d="M12,1 Q7,4 3,3" fill="none" stroke="#8c3b0d" strokeWidth="0.9" strokeLinecap="round" opacity="0.75" />
                </g>

                {/* 2.5D 交互把手 */}
                {effectiveGizmoId === 'lazy-sofa' && (
                  <IsoGizmo
                    pos={{ x: 0, y: 11 }}
                    displayCoords={currentLayout['lazy-sofa'].screen}
                    fixedW={0}
                    label="懒人沙发"
                    onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
                    onDragEnd={() => onDragGizmoEnd?.()}
                  />
                )}
              </g>

              {/* 3.4 CHARACTER NESTLED IN LAZY SOFA (由 Presence 场景槽位 sofa_lounge 动态驱动：正面/膝上捧书) */}
              {(() => {
                const sofaOccupant = presenceSlots.sofa_lounge?.occupant;
                const slotCfg = presenceSlots.sofa_lounge?.config;
                if (!sofaOccupant || !slotCfg) return null;

                return (
                  <g
                    id={`person-study-${sofaOccupant.id}`}
                    transform={`translate(${currentLayout['lazy-sofa'].screen.x}, ${(currentLayout['lazy-sofa'].screen.y) - 4})`}
                    onClick={(e) => {
                      if (isInspectorOpen) {
                        e.stopPropagation();
                        onSelectGizmo?.(effectiveGizmoId === 'lazy-sofa' ? null : 'lazy-sofa');
                      } else {
                        e.stopPropagation();
                        triggerSofaSquish();
                        onSelectPerson(sofaOccupant);
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (isInspectorOpen) {
                        e.stopPropagation();
                        setHoveredObject(`study:软糯面包懒人沙发 (${sofaOccupant.name} 正在此阅读 · 点击校准)`);
                      } else {
                        e.stopPropagation();
                        setHoveredObject(`person-${sofaOccupant.id}`);
                      }
                    }}
                    onMouseLeave={() => setHoveredObject(null)}
                    className="cursor-pointer group/char"
                  >
                    {/* Character Body Nestled Deep into Beanbag */}
                    <g className={sofaSquish ? 'transition-transform duration-300 scale-95 origin-bottom' : 'transition-transform duration-300 scale-100 origin-bottom'}>
                      {/* Continuous Long Cozy Robe (严格采用小鱼黄金比例标准模板：肩线与小鱼完全一致，长袍自然垂坠盖住腿脚) */}
                      {/* Robe Seated Base Settled in Beanbag Cushion */}
                      <ellipse cx="0" cy="4" rx="9" ry="4" fill={sofaOccupant.shirtColor} filter="url(#softShadow)" />
                      {/* Main Robe & Shoulders (黄金 2px 领口沉入，完美消解脖子生硬感) */}
                      <path
                        d="M-6,2 C-7,-4 -5,-9 0,-9 C5,-9 7,-4 6,2 Z"
                        fill={sofaOccupant.shirtColor}
                      />
                      {/* Robe Side Drape Shadow into Sofa Seat */}
                      <ellipse cx="0" cy="5.5" rx="8" ry="3" fill={sofaOccupant.shirtColor} />
                      <path d="M-4,3 Q0,5.5 4,3" fill="none" stroke="#000000" strokeWidth="0.6" opacity="0.16" strokeLinecap="round" />

                      {/* Relaxed Robe Sleeves Resting on Lap */}
                      <path d="M-5,-5 Q-8,-1 -2,1" stroke={sofaOccupant.shirtColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />
                      <path d="M5,-5 Q8,-1 2,1" stroke={sofaOccupant.shirtColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />

                      {/* Open Hardcover Book Nestled on Robe Lap (腿上张开的精装书) */}
                      <g transform="translate(0, 1)">
                        <polygon points="0,0 -6,-2 -5,-7 0,-4" fill="#fcfaf6" stroke="#d5cebe" strokeWidth="0.5" />
                        <polygon points="0,0 6,-2 5,-7 0,-4" fill="#ffffff" stroke="#d5cebe" strokeWidth="0.5" />
                        <line x1="-6" y1="-2" x2="6" y2="-2" stroke="#854d0e" strokeWidth="1" />
                        <line x1="-4.5" y1="-3.5" x2="-1.5" y2="-2.8" stroke="#a8a29e" strokeWidth="0.5" />
                        <line x1="1.5" y1="-2.8" x2="4.5" y2="-3.5" stroke="#a8a29e" strokeWidth="0.5" />
                      </g>

                      {/* Head & Thin Solid Beanie with Peeking Bangs (与全体人物严格统一的标准小人模板) */}
                      <CharacterHead
                        cx={0}
                        cy={-14}
                        r={7}
                        skinColor={sofaOccupant.skinColor || '#f5d6be'}
                        hairColor={sofaOccupant.hairColor || '#1a1a1a'}
                        hairStyle={sofaOccupant.hairStyle || 'curtain_crescent'}
                        beanieColor={sofaOccupant.beanieColor || '#47382d'}
                        hasPompom={sofaOccupant.hasPompom ?? true}
                        facing={slotCfg.facing}
                      />
                    </g>

                    {/* Character Status Tag (仅悬停时柔和显现) */}
                    <g
                      transform="translate(0, -28)"
                      className="opacity-0 group-hover/char:opacity-100 transition-opacity duration-200 pointer-events-none"
                    >
                      <rect x="-44" y="-7.5" width="88" height="15" rx="7.5" fill="#1c1917" opacity="0.94" stroke="#c47a4f" strokeWidth="0.6" />
                      <text x="0" y="3" fill="#f0ebe1" fontSize="8" fontWeight="bold" textAnchor="middle">
                        🛋️ {sofaOccupant.name} · {slotCfg.badgeLabel.split('(')[0].trim()}
                      </text>
                    </g>

                    {/* Interactive Cozy Thought Bubble */}
                    {sofaThought && (
                      <g transform="translate(0, -50)" className="pointer-events-none animate-bounce">
                        <rect x="-70" y="-9" width="140" height="18" rx="9" fill="#292524" stroke="#e28547" strokeWidth="0.8" opacity="0.96" />
                        <polygon points="0,9 -3,13 3,9" fill="#292524" />
                        <text x="0" y="3" fill="#fed7aa" fontSize="7.5" fontWeight="medium" textAnchor="middle">
                          {sofaThought}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })()}
            </g>

            {/* --- FRONT VERANDA & PORCH (前廊、柴犬软窝与信箱) --- */}
            <g id="front-veranda-features">
              {/* Sleeping Shiba Inu in Woven Pet Bed (睡在编织软窝垫上的柴犬) */}
              <g
                id="shiba-inu"
                transform={`translate(${currentLayout['shiba-inu'].screen.x}, ${currentLayout['shiba-inu'].screen.y})`}
                onClick={(e) => {
                  if (isInspectorOpen) {
                    e.stopPropagation();
                    onSelectGizmo?.(effectiveGizmoId === 'shiba-inu' ? null : 'shiba-inu');
                  }
                }}
                className="cursor-pointer group/shiba"
              >
                {/* Bed Floor Shadow */}
                <ellipse cx="0" cy="12" rx="18" ry="8" fill="#1b120c" opacity="0.32" filter="url(#softShadow)" />

                {/* 2.5D Woven Pet Cushion Bed (麻色等轴测宠物软垫) */}
                <path d="M-16,6 C-16,12 16,12 16,6 L16,9 C16,15 -16,15 -16,9 Z" fill="#543d28" />
                <ellipse cx="0" cy="6" rx="16" ry="7.5" fill="#8f7253" stroke="#a68868" strokeWidth="0.8" />
                <ellipse cx="0" cy="5" rx="13" ry="5.8" fill="#cfbfa8" />

                {/* Curled Sleeping Shiba Inu Body */}
                <g transform="translate(0, 2)">
                  <ellipse cx="-1" cy="2" rx="10" ry="6.5" fill="#c48a4d" />
                  <circle cx="7" cy="0" r="5.5" fill="#b0783d" />
                  <polygon points="9,-4 11,-8 13,-3" fill="#8f5d2b" />
                  <ellipse cx="-7" cy="0" rx="3" ry="2.2" fill="#fff" />
                  <text x="11" y="-6" fill="#fef3c7" fontSize="9" fontWeight="bold" className="animate-bounce">z</text>
                  <text x="17" y="-12" fill="#fef3c7" fontSize="11" fontWeight="bold" className="animate-pulse">Z</text>
                </g>

                {/* 2.5D 交互把手 */}
                {effectiveGizmoId === 'shiba-inu' && (
                  <IsoGizmo
                    pos={{ x: 0, y: 10 }}
                    displayCoords={currentLayout['shiba-inu'].screen}
                    fixedW={0}
                    label="柴犬宠物窝"
                    onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
                    onDragEnd={() => onDragGizmoEnd?.()}
                  />
                )}
              </g>

              {/* 🌟 WOODEN MAILBOX (前廊立柱美式信箱) */}
              <g
                id="mailbox-group"
                transform="translate(45, 182)"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMailbox();
                }}
                onMouseEnter={() => setHoveredObject('mailbox')}
                onMouseLeave={() => setHoveredObject(null)}
                className="cursor-pointer group/mail"
              >
                {/* Stone Pedestal on Deck */}
                <ellipse cx="0" cy="26" rx="10" ry="4.5" fill="#3a322a" />
                <ellipse cx="0" cy="25" rx="8" ry="3.5" fill="#54493e" />

                <ellipse cx="0" cy="24" rx="20" ry="10" fill="rgba(196, 66, 55, 0.2)" className="opacity-0 group-hover/mail:opacity-100 transition-opacity" />
                <rect x="-4" y="0" width="8" height="26" rx="2" fill="#523924" filter="url(#softShadow)" />

                <g transform="translate(0, -8)">
                  <rect x="-13" y="-11" width="26" height="18" rx="5" fill="#3d2c1d" />
                  <ellipse cx="-13" cy="-2" rx="4" ry="9" fill="#2c1e13" />
                  <path d="M-13,-11 Q0,-19 13,-11 L13,-7 Q0,-15 -13,-7 Z" fill="#694f3b" />
                  <circle cx="-14" cy="-2" r="2.5" fill="#e6b35a" />

                  {/* Red Flag */}
                  <g
                    style={{
                      transform: unreadMailCount > 0 ? 'rotate(0deg)' : 'rotate(85deg)',
                      transformOrigin: '12px 0px',
                      transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  >
                    <rect x="12" y="-15" width="3" height="17" rx="1" fill="#c43b2f" />
                    <polygon points="12,-15 1,-9 12,-3" fill="#e04a3d" />
                  </g>

                  {unreadMailCount > 0 && (
                    <g transform="translate(0, -28)" className="animate-bounce">
                      <rect x="-34" y="-9" width="68" height="18" rx="9" fill="#c43b2f" filter="url(#softShadow)" />
                      <text x="0" y="3.5" fill="#fff" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                        📪 新信件 ({unreadMailCount})
                      </text>
                    </g>
                  )}
                </g>
              </g>
            </g>
          </SceneEntity>

          {/* ======================================================== */}
          {/* 2.5 VINTAGE CAPSULE CABIN (屋旁旧胶囊仓 · 卧室/休息室)    */}
          {/*     向中央主木屋收拢靠拢，形成紧密温暖的生活聚落          */}
          {/* ======================================================== */}
          <SceneEntity entityId="capsule_pod" layout={sceneLayout} id="capsule-pod-cluster">
            <CapsulePodHaven
              activeRoom={activeRoom}
              onSelectRoom={onSelectRoom}
              presenceSlots={presenceSlots}
              onSelectPerson={onSelectPerson}
              setHoveredObject={setHoveredObject}
              hoveredObject={hoveredObject}
              hasMovedRef={hasMovedRef}
              theme={theme}
            />
          </SceneEntity>

          {/* ======================================================== */}
          {/* 2.6 COZY TIMBER SLEEPING CABIN (左侧独立安睡小木屋 · 暖木卧房) */}
          {/*     向中央主木屋收拢靠拢，形成紧密温暖的生活聚落          */}
          {/* ======================================================== */}
          <SceneEntity entityId="wooden_cabin" layout={sceneLayout} id="wooden-cabin-cluster">
            <WoodenCabinHaven
              activeRoom={activeRoom}
              onSelectRoom={onSelectRoom}
              presenceSlots={presenceSlots}
              onSelectPerson={onSelectPerson}
              setHoveredObject={setHoveredObject}
              hoveredObject={hoveredObject}
              hasMovedRef={hasMovedRef}
              theme={theme}
            />
          </SceneEntity>

          {/* ======================================================== */}
          {/* 3. FOREGROUND MEADOW & TRANQUIL MORANDI NEGATIVE SPACE   */}
          {/*    (前景大面积纯净留白负空间与点缀长椅，彻底解决杂乱与拥挤) */}
          {/* ======================================================== */}
          <g id="foreground-meadow-elements">
            {/* 🌟 06 DRESSING: Swaledale Sheep Flock & Meadow Elements */}
            <YorkshireDressing
              theme={theme}
              onTriggerToast={onTriggerToast}
              setHoveredObject={setHoveredObject}
            />

            {/* 稀疏雅致的微型草花点缀（仅附着于小径旁，下方大面积纯净草坪全部留白） */}
            <g id="pasture-wildflowers" opacity="0.8">
              {[
                { x: 380, y: 535 }, { x: 440, y: 545 }, { x: 500, y: 530 }
              ].map((f, i) => (
                <circle key={`pbf-${i}`} cx={f.x} cy={f.y} r={2.0} fill="#facc15" />
              ))}
              {[
                { x: 340, y: 520 }, { x: 470, y: 540 }
              ].map((f, i) => (
                <g key={`pdf-${i}`}>
                  <circle cx={f.x} cy={f.y} r={2.2} fill="#ffffff" />
                  <circle cx={f.x} cy={f.y} r={0.8} fill="#eab308" />
                </g>
              ))}
            </g>
          </g>
        </g>

        {/* ======================================================== */}
        {/* 5. MASTER ATMOSPHERE FRAME VIGNETTE (全景顶级艺术画框压暗) */}
        {/*    万物生灵片头经典摄影构图：四周温和暗角自然汇聚视觉于中心 */}
        {/* ======================================================== */}
        <g id="master-viewport-frame-vignette" className="pointer-events-none">
          {/* Subtle Viewport Radial Vignette */}
          <rect x="0" y="0" width="1200" height="800" fill="url(#frameVignetteRadial)" />
        </g>
      </svg>
      </div>

      {/* ======================================================== */}
      {/* 6. FLOATING CAMERA CONTROLS (Top-Right)                  */}
      {/* ======================================================== */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#1e1c19]/85 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 shadow-lg">
        <button
          onClick={handleZoomIn}
          title="放大画面"
          className="w-7 h-7 flex items-center justify-center rounded-full text-[#c8bfa8] hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          title="缩小镜头（查看全景）"
          className="w-7 h-7 flex items-center justify-center rounded-full text-[#c8bfa8] hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-3.5 bg-white/15 mx-0.5" />
        <button
          onClick={handleResetOverview}
          title="重置为田园全景"
          className="flex items-center gap-1.5 px-2.5 h-7 rounded-full text-xs font-medium text-[#d8cfbe] hover:text-white hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>田园全景</span>
        </button>
      </div>

      {/* Subtle interaction whisper */}
      <div className="absolute bottom-6 right-6 hidden md:block z-10 pointer-events-none opacity-60 hover:opacity-90 transition-opacity">
        <span className="text-[11px] text-[#b8ab96] bg-[#141210]/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/5">
          约克郡谷箱庭全景 · 滚轮自由缩放 · 拖拽漫游
        </span>
      </div>

      {/* Contextual Hover Whispers */}
      {hoveredObject && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <div className="px-3.5 py-1.5 rounded-full bg-[#1e1c1a]/85 backdrop-blur-md border border-[#ffffff]/10 text-xs text-[#e6ded0] shadow-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d68c68] animate-pulse" />
            <span>
              {hoveredObject === 'tractor' && '🚜 麦浪拖拉机 · 梯田里的丰收耕耘与南瓜丰收'}
              {hoveredObject === 'mailbox' && '📪 前廊木信箱 · 点击查看信件或留言'}
              {hoveredObject === 'person-self' && '🌿 我 · 点击更新生活状态'}
              {hoveredObject === 'daybed' && '🛋️ 日式实木蔺草榻榻米 · 暖炉旁小憩好去处'}
              {hoveredObject?.startsWith('bookshelf:') && hoveredObject.replace('bookshelf:', '')}
              {hoveredObject === 'bookshelf' && '📚 手作做旧粗原木五层书架 · 纯净架体与参数化藏书插槽（点击检视/管理）'}
              {hoveredObject?.startsWith('cabinet:') && hoveredObject.replace('cabinet:', '')}
              {hoveredObject === 'cabinet' && '🪵 中古实木四格唱机收纳柜 · 纯净SVG骨架与编织框/咖啡豆/无耳陶杯'}
              {hoveredObject === 'person-lin' && '📖 林木 · 陷在懒人沙发读博尔赫斯（点击捏一捏/查看状态）'}
              {hoveredObject === 'person-study' && '🛋️ 角色 · 窝在懒人沙发里翻书放空（点击捏一捏/互动）'}
              {hoveredObject === 'lazy-sofa' && '🛋️ 超松软面包懒人沙发 · 陷进去看一本不需要读完的书（点击捏一捏/互动）'}
              {hoveredObject === 'person-yu' && '🍵 小鱼 · 点击查看状态与留下便笺'}
              {hoveredObject === 'room-my_room' && '我的田园阁楼书屋'}
              {hoveredObject === 'room-living_nook' && '暖炉起居角与黑胶唱机'}
              {hoveredObject === 'room-friend_room' && '🛋️ 林木的花园书房 · 惬意懒人沙发角（点击对焦参观）'}
              {hoveredObject === 'room-capsule_pod' && '🚀 旧太空胶囊仓 · 卧室与午休小天地（点击对焦参观）'}
              {hoveredObject === 'room-corn_lounge' && '🪵 林间小木屋 · 质朴原木与雪松清香的安睡木屋（点击对焦参观）'}
              {hoveredObject === 'room-observatory' && '📡 山巅外星电波监听站 · 频率 1420.405 MHz 监听地外文明电波（点击对焦参观）'}
              {hoveredObject === 'alien-receiver' && '📡 外星信号接收装置 · 频率 1420.405 MHz 监听深空（点击捕获电波）'}
              {hoveredObject === 'sheep-pasture' && '🐑 阳光草丘牧场 · 悠闲吃草的小羊群与雏菊野花草甸'}
              {hoveredObject === 'corner-pond' && '💧 约克郡清冽山溪 · 涉水跳石小径与水生鸢尾，点击荡漾水纹涟漪'}
              {(hoveredObject.startsWith('🐑') || hoveredObject.startsWith('🦆') || hoveredObject.startsWith('🚪')) && hoveredObject}
              {![
                'tractor', 'mailbox', 'person-self', 'daybed', 'bookshelf', 'cabinet', 'person-lin',
                'person-study', 'lazy-sofa', 'person-yu', 'room-my_room', 'room-living_nook',
                'room-friend_room', 'room-capsule_pod', 'room-corn_lounge', 'room-observatory',
                'alien-receiver', 'sheep-pasture', 'corner-pond'
              ].includes(hoveredObject) && !hoveredObject.startsWith('bookshelf:') && !hoveredObject.startsWith('cabinet:') && !hoveredObject.startsWith('🐑') && !hoveredObject.startsWith('🦆') && !hoveredObject.startsWith('🚪') && hoveredObject}
            </span>
          </div>
        </div>
      )}

      {/* Decoded Alien Transmission Card */}
      {alienTransmissionText && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[92%] sm:w-auto">
          <div className="px-4 py-3 rounded-2xl bg-[#09130d]/94 backdrop-blur-xl border border-[#38ef7d]/40 text-xs text-[#d1fae5] shadow-2xl shadow-[#38ef7d]/10 flex items-start gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38ef7d] animate-ping mt-1 shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#38ef7d]">
                  DEEP SPACE SETI · 1420.405 MHz
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAlienTransmissionText(null);
                  }}
                  className="text-[#6ee7b7] hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-white/10"
                >
                  ✕
                </button>
              </div>
              <p className="text-[12px] text-[#ecfdf5] leading-relaxed font-mono">
                {alienTransmissionText}
              </p>
              <div className="flex items-center justify-between pt-1 text-[10px] text-[#6ee7b7]/80">
                <span>示波器捕获频率：脉冲正弦波稳定</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerAlienSignal();
                  }}
                  className="underline hover:text-white"
                >
                  继续接收下一个频段 →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4.0 电影海报高清艺术展陈与背景故事展牌 (点击海报任意画作唤出) */}
      <PosterDetailModal
        activePosterId={selectedPosterId}
        onClose={() => setSelectedPosterId(null)}
        onSelectPoster={(id) => {
          setSelectedPosterId(id);
          onSelectPoster?.(id);
        }}
      />
    </div>
    </LayoutGestureContext.Provider>
  );
};
