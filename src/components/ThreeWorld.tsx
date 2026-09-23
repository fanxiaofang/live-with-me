import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { TimeOfDay, Person, RoomId } from '../types';
import { ROOMS } from '../data/initialData';
import { CharacterHead } from './CharacterAvatar';
import { resolvePresenceSlots, SceneSlotConfig } from '../utils/sceneViewMapping';
import { Bookshelf, BookshelfPreset, BookItemConfig, TierConfig } from './bookshelf';
import { CastIronWoodStove, StoveColorVariant } from './CastIronWoodStove';
import { RecordCabinet, RetroTurntable } from './cabinet';
import { AtticDesk } from './desk';
import { MonsteraPlant, FiddleLeafFig } from './plants';
import { RoomLayoutConfig, EditableObjectId, IsoGizmo } from './layout-gizmo';
import { WallPostersGallery, PosterDetailModal, PosterId } from './wall-posters';
import { LeftWallCraftBoard } from './LeftWallCraftBoard';
import { CottageFoundation, TimberFlooring, CottageRoofFraming, CottageWallProfiles } from './architecture';

interface ThreeWorldProps {
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
}

// Room Camera Pan/Scale configurations in the 2.5D countryside landscape
const ROOM_VIEWPORTS: Record<string, { x: number; y: number; scale: number }> = {
  overview: { x: 0, y: 0, scale: 1.0 },
  my_room: { x: 220, y: 150, scale: 1.6 },
  living_nook: { x: 20, y: 130, scale: 1.6 },
  friend_room: { x: -180, y: 140, scale: 1.6 },
  porch_mailbox: { x: 40, y: -80, scale: 1.55 },
  capsule_pod: { x: -330, y: 60, scale: 1.65 },
  corn_lounge: { x: 360, y: -20, scale: 1.65 },
  observatory: { x: -280, y: 280, scale: 1.65 },
};

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
    // Sunny Makoto Shinkai summer palette with true atmospheric depth
    skyTop: '#42a5ea',
    skyBottom: '#bcebfd',
    hillGreenFar: '#7caa84',
    hillGreenMid: '#5cb850',
    hillGreenNear: '#48a43c',
    wheatFar: '#fae998',
    wheatNear: '#e8b738',
    roadColor: '#6c7784',
    riverColor: '#2b82c7',
    riverReflect: '#74beff',
    riverRipples: '#c0e9ff',
    ambientTint: 'rgba(255, 255, 240, 0.04)',
    cottageGlow: 'rgba(255, 236, 179, 0.45)',
    tractorLightGlow: 'rgba(255, 248, 200, 0.25)',
    roofColor: '#d66743',
    isNight: false,
    isRainy: false,
  },
  morning: {
    skyTop: '#3c9bd6',
    skyBottom: '#c4edfe',
    hillGreenFar: '#72a67e',
    hillGreenMid: '#56b34c',
    hillGreenNear: '#449e38',
    wheatFar: '#faebaa',
    wheatNear: '#dfaf38',
    roadColor: '#626d7a',
    riverColor: '#267ec4',
    riverReflect: '#6cb7fa',
    riverRipples: '#daf0ff',
    ambientTint: 'rgba(230, 248, 255, 0.06)',
    cottageGlow: 'rgba(255, 230, 160, 0.35)',
    tractorLightGlow: 'rgba(255, 245, 180, 0.2)',
    roofColor: '#cb603d',
    isNight: false,
    isRainy: false,
  },
  dusk: {
    skyTop: '#372958',
    skyBottom: '#f58450',
    hillGreenFar: '#7b9249',
    hillGreenMid: '#4e6831',
    hillGreenNear: '#557034',
    wheatFar: '#d58042',
    wheatNear: '#af5428',
    roadColor: '#4b434f',
    riverColor: '#964860',
    riverReflect: '#ea7868',
    riverRipples: '#fcceb0',
    ambientTint: 'rgba(230, 110, 60, 0.16)',
    cottageGlow: 'rgba(255, 180, 80, 0.8)',
    tractorLightGlow: 'rgba(255, 190, 80, 0.75)',
    roofColor: '#a13c28',
    isNight: false,
    isRainy: false,
  },
  night: {
    skyTop: '#080f20',
    skyBottom: '#13213a',
    hillGreenFar: '#152520',
    hillGreenMid: '#0d1a15',
    hillGreenNear: '#112019',
    wheatFar: '#242314',
    wheatNear: '#19190f',
    roadColor: '#1b2027',
    riverColor: '#122340',
    riverReflect: '#213a63',
    riverRipples: '#4b75a8',
    ambientTint: 'rgba(10, 15, 30, 0.38)',
    cottageGlow: 'rgba(255, 205, 110, 0.95)',
    tractorLightGlow: 'rgba(255, 220, 120, 0.9)',
    roofColor: '#3c2320',
    isNight: true,
    isRainy: false,
  },
  rainy: {
    skyTop: '#2d3e4b',
    skyBottom: '#5c7484',
    hillGreenFar: '#527b58',
    hillGreenMid: '#3a6242',
    hillGreenNear: '#426b4b',
    wheatFar: '#a1935b',
    wheatNear: '#807240',
    roadColor: '#434c56',
    riverColor: '#285874',
    riverReflect: '#4e85a6',
    riverRipples: '#99cbde',
    ambientTint: 'rgba(50, 75, 95, 0.22)',
    cottageGlow: 'rgba(255, 215, 140, 0.65)',
    tractorLightGlow: 'rgba(255, 220, 130, 0.55)',
    roofColor: '#7a4738',
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

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const ThreeWorld: React.FC<ThreeWorldProps> = ({
  timeOfDay,
  people,
  activeRoom,
  unreadMailCount,
  onSelectPerson,
  onSelectMailbox,
  onSelectRoom,
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
}) => {
  const currentLayout = roomLayout || cabinetLayout;
  const effectiveGizmoId = isInspectorOpen ? activeGizmoId : null;
  const containerRef = useRef<HTMLDivElement>(null);

  // Active Wall Poster Modal State (右墙电影海报高清艺术展陈卡片)
  const [selectedPosterId, setSelectedPosterId] = useState<PosterId | null>(null);

  // Pan & Zoom state for the 2.5D anime world
  const [camera, setCamera] = useState<{ x: number; y: number; zoom: number }>({
    x: 0,
    y: 0,
    zoom: 1.0,
  });

  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [alienMsgIndex, setAlienMsgIndex] = useState(0);
  const [alienPulseEffect, setAlienPulseEffect] = useState(false);
  const [alienTransmissionText, setAlienTransmissionText] = useState<string | null>(null);
  const [sofaSquish, setSofaSquish] = useState(false);
  const [sofaThought, setSofaThought] = useState<string | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([
    { id: 1, x: 520, y: 550 },
    { id: 2, x: 680, y: 560 },
    { id: 3, x: 340, y: 570 },
  ]);

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

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const cameraStartRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  const theme = COUNTRYSIDE_THEMES[timeOfDay] || COUNTRYSIDE_THEMES.afternoon;

  // Align camera with active room changes
  useEffect(() => {
    const target = ROOM_VIEWPORTS[activeRoom] || ROOM_VIEWPORTS.overview;
    setCamera({
      x: target.x,
      y: target.y,
      zoom: target.scale,
    });
  }, [activeRoom]);

  // Continuous gentle ripple generation in rainy mode
  useEffect(() => {
    if (!theme.isRainy) return;
    const interval = setInterval(() => {
      const rx = 100 + Math.random() * 950;
      const ry = 530 + Math.random() * 60;
      setRipples((prev) => [...prev.slice(-6), { id: Date.now(), x: rx, y: ry }]);
    }, 800);
    return () => clearInterval(interval);
  }, [theme.isRainy]);

  // Click on river creates interactive water ripples
  const handleRiverClick = (e: React.MouseEvent<SVGGElement>) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (svg && svg.getScreenCTM) {
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (ctm) {
        const svgP = pt.matrixTransform(ctm.inverse());
        setRipples((prev) => [...prev.slice(-5), { id: Date.now(), x: svgP.x, y: svgP.y }]);
        return;
      }
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const svgPointX = ((e.clientX - rect.left) / rect.width) * 1200;
    const svgPointY = ((e.clientY - rect.top) / rect.height) * 800;
    setRipples((prev) => [...prev.slice(-5), { id: Date.now(), x: svgPointX, y: svgPointY }]);
  };

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

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = -e.deltaY * 0.0012;
    setCamera((prev) => ({
      ...prev,
      zoom: Math.min(Math.max(prev.zoom + zoomDelta, 0.65), 2.3),
    }));
  }, []);

  // Mouse drag to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    cameraStartRef.current = { x: camera.x, y: camera.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMovedRef.current = true;
    }
    setCamera((prev) => ({
      ...prev,
      x: cameraStartRef.current.x + dx / prev.zoom,
      y: cameraStartRef.current.y + dy / prev.zoom,
    }));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch handlers for mobile
  const touchStartRef = useRef({ x: 0, y: 0, dist: 0 });
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      hasMovedRef.current = false;
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      cameraStartRef.current = { x: camera.x, y: camera.y };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartRef.current.dist = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        hasMovedRef.current = true;
      }
      setCamera((prev) => ({
        ...prev,
        x: cameraStartRef.current.x + dx / prev.zoom,
        y: cameraStartRef.current.y + dy / prev.zoom,
      }));
    } else if (e.touches.length === 2 && touchStartRef.current.dist > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const factor = (dist - touchStartRef.current.dist) * 0.003;
      setCamera((prev) => ({
        ...prev,
        zoom: Math.min(Math.max(prev.zoom + factor, 0.65), 2.3),
      }));
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const handleZoomIn = () => {
    setCamera((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 0.25, 2.3) }));
  };

  const handleZoomOut = () => {
    setCamera((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 0.25, 0.65) }));
  };

  const handleResetOverview = () => {
    onSelectRoom('overview');
    setCamera({ x: 0, y: 0, zoom: 1.0 });
  };

  // Dynamic Scene-based View Mapping for Character Presence
  const { slots: presenceSlots } = resolvePresenceSlots(people);

  // Group characters for polaroid photos and room context
  const selfPerson = people.find((p) => p.id === 'self');
  const linPerson = people.find((p) => p.id === 'lin');
  const yuPerson = people.find((p) => p.id === 'yu');
  const isLinReading = presenceSlots.sofa_lounge?.occupant?.id === 'lin';

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{
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

      {/* 2.5D ANIME COUNTRYSIDE STAGE CONTAINER */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform"
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* Main 2.5D Anime Landscape SVG (Full-bleed panoramic canvas without floating card cut-offs) */}
        <svg
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full max-w-none pointer-events-auto"
        >
          <defs>
            {/* Seamless Panoramic Sky Fill Gradient */}
            <linearGradient id="skyFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.skyTop} />
              <stop offset="100%" stopColor={theme.skyBottom} />
            </linearGradient>

            {/* Wheat field textures */}
            <pattern id="wheatPattern" width="16" height="16" patternTransform="rotate(35 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="16" stroke="#eed158" strokeWidth="2.5" />
              <line x1="8" y1="0" x2="8" y2="16" stroke="#fce67e" strokeWidth="2" />
            </pattern>

            <pattern id="grassPattern" width="14" height="14" patternTransform="rotate(-25 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="14" stroke="#68cf59" strokeWidth="2" />
              <line x1="7" y1="0" x2="7" y2="14" stroke="#8ae37b" strokeWidth="2.5" />
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

            {/* Roof terracotta tile pattern */}
            <linearGradient id="terracottaRoof" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={theme.roofColor} />
              <stop offset="100%" stopColor="#873523" />
            </linearGradient>

            {/* Fireplace Wall & Floor Ambient Glow (消除贴纸感，提供墙面与地面的真实光影漫反射) */}
            <radialGradient id="hearthWallWarmGlow" cx="50%" cy="75%" r="65%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.48" />
              <stop offset="45%" stopColor="#ea580c" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#9a3412" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
            </radialGradient>

            {/* Corn Lounge Interior Warm Candlelight Radial Glow */}
            <radialGradient id="cornGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff8eb" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#fed7aa" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#c27329" stopOpacity="0" />
            </radialGradient>

            {/* Toasted Harvest Corn Shell Gradient */}
            <linearGradient id="toastedCornGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dfb770" />
              <stop offset="55%" stopColor="#c58e42" />
              <stop offset="100%" stopColor="#9c6628" />
            </linearGradient>

            {/* Unified Homestead Garden Lawn Gradient (软萌翠绿家园大草坪，带有自然向阳微光) */}
            <linearGradient id="homesteadLawnGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.hillGreenMid} />
              <stop offset="60%" stopColor={theme.hillGreenMid} />
              <stop offset="100%" stopColor={theme.hillGreenNear} />
            </linearGradient>

            {/* Foreground Pasture Sunlit Gradient */}
            <linearGradient id="foregroundPastureGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.hillGreenMid} />
              <stop offset="35%" stopColor={theme.hillGreenNear} />
              <stop offset="100%" stopColor={theme.hillGreenNear} />
            </linearGradient>

            {/* 3D Volumetric Cloud Shading Gradient */}
            <linearGradient id="cloudShadeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#f4f9fd" />
              <stop offset="100%" stopColor="#c8def0" />
            </linearGradient>

            {/* Distant Atmospheric Aerial Haze */}
            <linearGradient id="distantHazeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.skyBottom} stopOpacity="0" />
              <stop offset="70%" stopColor={theme.skyBottom} stopOpacity="0.55" />
              <stop offset="100%" stopColor={theme.skyBottom} stopOpacity="0.85" />
            </linearGradient>

            {/* Deep Water Translucent Depth Gradient */}
            <linearGradient id="riverDepthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.riverReflect} stopOpacity="0.85" />
              <stop offset="30%" stopColor={theme.riverColor} stopOpacity="0.96" />
              <stop offset="75%" stopColor={theme.riverColor} stopOpacity="0.98" />
              <stop offset="100%" stopColor={theme.riverReflect} stopOpacity="0.88" />
            </linearGradient>

            {/* North Shore Grassy Bank Slope Gradient */}
            <linearGradient id="northBankSlope" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.hillGreenMid} />
              <stop offset="60%" stopColor="#537549" />
              <stop offset="100%" stopColor="#8f7f6a" />
            </linearGradient>

            {/* South Shore Pebble Verge to Meadow Gradient */}
            <linearGradient id="southBankSlope" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8f7f6a" />
              <stop offset="40%" stopColor="#537549" />
              <stop offset="100%" stopColor={theme.hillGreenNear} />
            </linearGradient>

            {/* Terraced Agricultural Retaining Bund Loam Gradient */}
            <linearGradient id="terraceLoamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6e4c2b" />
              <stop offset="60%" stopColor="#54371b" />
              <stop offset="100%" stopColor="#3d2611" />
            </linearGradient>

            {/* 2.5D Isometric Terraced Stone Retaining Wall Gradients (石砌护土台地梯级，提供真实的垂直高差与生根感) */}
            <linearGradient id="stoneWallCapGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8d8071" />
              <stop offset="50%" stopColor="#a49788" />
              <stop offset="100%" stopColor="#857869" />
            </linearGradient>
            <linearGradient id="stoneWallFaceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5a4e42" />
              <stop offset="50%" stopColor="#433930" />
              <stop offset="100%" stopColor="#2c241e" />
            </linearGradient>

            {/* Continuous Country Flagstone & Loam Road Gradient (贯穿全景的乡间泥土与石板主干道) */}
            <linearGradient id="countryRoadGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#cfbba2" />
              <stop offset="50%" stopColor="#ba9f83" />
              <stop offset="100%" stopColor="#9d8366" />
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
          </defs>

          {/* Panoramic Seamless Sky Background Fill (全景天空底层底色，消除任何边缘露白与悬浮卡片感) */}
          <rect x="-600" y="-400" width="2400" height="1600" fill="url(#skyFillGrad)" />

          {/* ======================================================== */}
          {/* 1. BACKGROUND: BILLOWING 3D CUMULUS & ATMOSPHERIC SKY    */}
          {/* ======================================================== */}
          <g id="sky-and-clouds">
            {/* Deep Volumetric Cloud Bank with soft ambient shaded base (全景宽幅延展) */}
            <path
              d="M-600,180 C-400,130 -200,140 -20,165 C30,90 110,105 160,118 C220,50 320,40 390,75 C460,25 570,20 650,55 C730,15 840,22 910,55 C980,18 1080,32 1130,75 C1180,55 1240,80 1380,110 C1560,95 1680,140 1800,180 L1800,260 L-600,260 Z"
              fill="url(#cloudShadeGrad)"
              opacity="0.88"
            />

            {/* Brilliant Sunlit Billowing Cumulus Domes (Layered organic clouds) */}
            <path
              d="M-600,170 C-380,110 -180,120 30,150 C60,85 130,75 170,105 C210,52 300,45 350,78 C410,32 500,35 550,72 C610,25 720,20 780,62 C840,18 930,22 980,58 C1040,28 1120,42 1150,88 C1190,75 1240,105 1380,85 C1560,70 1680,120 1800,170 L1800,250 L-600,250 Z"
              fill="#ffffff"
            />
            {/* Soft volumetric billow highlights & depth modeling */}
            <ellipse cx="-120" cy="95" rx="55" ry="30" fill="#f8fcff" />
            <ellipse cx="260" cy="85" rx="55" ry="32" fill="#f8fcff" />
            <ellipse cx="460" cy="72" rx="65" ry="36" fill="#f8fcff" />
            <ellipse cx="670" cy="62" rx="70" ry="38" fill="#f8fcff" />
            <ellipse cx="880" cy="58" rx="65" ry="35" fill="#f8fcff" />
            <ellipse cx="1070" cy="75" rx="58" ry="30" fill="#f8fcff" />
            <ellipse cx="1400" cy="80" rx="65" ry="32" fill="#f8fcff" />

            {/* Atmosphere Horizon Mist (Fades clouds seamlessly into the distant skyline - no paper cuts!) */}
            <rect x="-600" y="100" width="2400" height="150" fill="url(#distantHazeGrad)" />
          </g>

          {/* Rolling Terraced Hills & Sunny Wheat Slopes */}
          <g id="hills">
            {/* Distant Mountain Range 1 (Atmospheric soft sage ridge with depth) */}
            <path
              d="M-600,210 Q-200,160 180,145 Q420,172 680,132 Q940,158 1240,140 Q1520,165 1800,180 L1800,340 L-600,340 Z"
              fill={theme.hillGreenFar}
            />

            {/* Subtle distant mountain haze layer */}
            <path
              d="M-600,215 Q-180,170 260,175 Q580,192 890,165 Q1240,185 1520,175 1800,195 L1800,265 L-600,265 Z"
              fill={theme.skyBottom}
              opacity="0.32"
            />

            {/* Distant Mountain Ridge 2 (Mid-slope ridge supporting country road) */}
            <path
              d="M-600,230 Q-150,185 240,178 Q560,198 880,168 Q1240,192 1520,182 1800,210 L1800,360 L-600,360 Z"
              fill={theme.hillGreenMid}
              opacity="0.75"
            />

            {/* Distant farmsteads */}
            <g transform="translate(720, 150)">
              <rect x="0" y="8" width="18" height="12" fill="#fffaf2" />
              <polygon points="-2,8 9,0 20,8" fill="#e8613c" />
            </g>
            <g transform="translate(1100, 135)">
              <rect x="0" y="6" width="15" height="10" fill="#fffaf2" />
              <polygon points="-2,6 7,0 17,6" fill="#e8613c" />
            </g>

            {/* Distant Rolling Golden Wheat Slopes (远方丘陵金色麦田，开阔起伏的大自然风光) */}
            <path
              d="M-600,245 Q-150,210 240,185 Q560,210 Q880,180 1240,212 Q1520,195 1800,225 L1800,320 Q1240,280 860,265 Q480,270 160,280 Q-150,290 -600,295 Z"
              fill={theme.wheatFar}
            />
            {/* Distant soft grain shimmer (极柔和远景麦浪质感，不再是近处粗暴的条纹拼贴) */}
            <path
              d="M-600,245 Q-150,210 240,185 Q560,210 Q880,180 1240,212 Q1520,195 1800,225 L1800,320 Q1240,280 860,265 Q480,270 160,280 Q-150,290 -600,295 Z"
              fill="url(#wheatPattern)"
              opacity="0.1"
            />

            {/* Distant Hedgerow & Countryside Trees (远方绿篱与行道树列，自然区隔远景农田与家园草坪) */}
            <g opacity="0.8">
              {[-120, -20, 80, 180, 280, 390, 680, 790, 910, 1040, 1150, 1280, 1420].map((tx) => (
                <g key={`hedge-${tx}`} transform={`translate(${tx}, ${268 + (tx % 15) - 7})`}>
                  <ellipse cx="0" cy="0" rx="16" ry="6.5" fill={theme.hillGreenFar} />
                  <ellipse cx="-3" cy="-1.5" rx="10" ry="4.5" fill={theme.hillGreenMid} opacity="0.65" />
                </g>
              ))}
            </g>

            {/* ======================================================== */}
            {/* 2.5D ISOMETRIC TOPOGRAPHY & TERRACED HOMESTEAD SYSTEM      */}
            {/*    彻底告别扁平横条与贴纸感，建立多级真实等轴测台地、护土墙与连贯路网 */}
            {/* ======================================================== */}

            {/* 1. Mountain Trail Switchback from Observatory to Valley (从山巅观星台蜿蜒而下的山道) */}
            <g id="mountain-switchback-trail" opacity="0.8">
              <path
                d="M890,110 Q830,135 840,165 Q850,195 780,215 Q710,235 620,250 Q500,265 380,270 Q240,285 140,295"
                fill="none"
                stroke="#baa58c"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="12 4"
              />
              <path
                d="M890,110 Q830,135 840,165 Q850,195 780,215 Q710,235 620,250 Q500,265 380,270 Q240,285 140,295"
                fill="none"
                stroke="#8c7760"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            {/* 2. Upper Agricultural & Farmstead Terrace (上层农作与拖拉机停驻台地) */}
            <path
              d="M-600,280 C-200,265 160,248 420,244 C720,250 1020,238 1350,258 C1580,270 1800,280 1800,370 C1400,375 1060,360 740,350 C460,345 180,335 -100,325 C-360,315 -600,310 -600,310 Z"
              fill={theme.hillGreenMid}
            />

            {/* 3. Upper-to-Mid Retaining Stone Wall & Slope (上层与主台地之间的石砌护土台阶) */}
            <g id="upper-terrace-retaining-wall">
              {/* Shaded vertical stone face */}
              <path
                d="M-280,318 C-60,328 160,336 380,346 C600,356 860,352 1140,362 L1140,376 C860,366 600,370 380,360 C160,350 -60,342 -280,332 Z"
                fill="url(#stoneWallFaceGrad)"
              />
              {/* Sunlit top stone coping */}
              <path
                d="M-280,315 C-60,325 160,333 380,343 C600,353 860,349 1140,359 L1140,363 C860,353 600,357 380,347 C160,337 -60,329 -280,319 Z"
                fill="url(#stoneWallCapGrad)"
                stroke="#6b5e52"
                strokeWidth="0.8"
              />
              {/* Moss & climbing creepers softening the stone wall */}
              <g opacity="0.75">
                {[
                  { x: -180, y: 324 }, { x: -40, y: 334 }, { x: 90, y: 340 },
                  { x: 260, y: 348 }, { x: 480, y: 356 }, { x: 720, y: 360 }, { x: 980, y: 366 }
                ].map((mw, i) => (
                  <ellipse key={`mw-${i}`} cx={mw.x} cy={mw.y} rx="9" ry="3.5" fill="#385435" />
                ))}
              </g>
            </g>

            {/* 4. Unified Homestead Garden Lawn Plateau (主宅庭院广阔大台地，与主屋基座、西侧玉米仓、东侧胶囊仓真正融为一体) */}
            <path
              d="M-600,310 C-200,322 180,338 460,348 C760,358 1060,364 1350,372 C1580,378 1800,385 1800,600 C1400,600 1100,590 720,580 C520,560 340,545 160,515 C-100,480 -380,470 -600,470 Z"
              fill="url(#homesteadLawnGrad)"
            />

            {/* Gentle Sunlit Warmth across the Home Garden Lawn */}
            <path
              d="M-200,340 C200,290 600,275 1100,310 C1400,330 1600,350 1400,380 C1100,390 600,365 100,350 C-100,350 -200,340 -200,340 Z"
              fill="#ffffff"
              opacity="0.06"
            />

            {/* 5. Continuous 2.5D Country Road & Courtyard Network (贯穿全景的乡间主路网：串联拖拉机、主屋门廊、玉米仓与河道) */}
            <g id="country-road-network" opacity="0.92">
              {/* Main Spine Road from Tractor Farm Corner down to Central Cottage Courtyard */}
              <path
                d="M120,320 C180,335 290,365 390,395 C450,412 500,430 540,455"
                fill="none"
                stroke="url(#countryRoadGrad)"
                strokeWidth="28"
                strokeLinecap="round"
              />
              {/* Road edge soft blend & gravel texturing */}
              <path
                d="M120,320 C180,335 290,365 390,395 C450,412 500,430 540,455"
                fill="none"
                stroke="#8f785e"
                strokeWidth="1.2"
                strokeDasharray="8 16"
              />

              {/* West Spur Branch Road to Corn Lounge Steps */}
              <path
                d="M360,390 C300,410 260,428 220,455"
                fill="none"
                stroke="url(#countryRoadGrad)"
                strokeWidth="18"
                strokeLinecap="round"
              />

              {/* East Spur Branch Road to Capsule Pod Boardwalk Landing */}
              <path
                d="M620,440 C690,415 760,380 810,356"
                fill="none"
                stroke="url(#countryRoadGrad)"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* Central Courtyard Paved Forecourt in front of Main Cottage Porch Steps */}
              <ellipse cx="540" cy="460" rx="68" ry="24" fill="url(#countryRoadGrad)" />
              <ellipse cx="540" cy="460" rx="64" ry="22" fill="none" stroke="#a38c71" strokeWidth="1" strokeDasharray="6 8" />

              {/* South Road Continuation: Meandering down from Courtyard directly to River Stepping Stones */}
              <path
                d="M540,465 C542,485 540,515 536,546"
                fill="none"
                stroke="url(#countryRoadGrad)"
                strokeWidth="20"
                strokeLinecap="round"
              />

              {/* Natural Flagstones embedded into the Road surface */}
              {[
                { x: 190, y: 342, rx: 7, ry: 3.5 },
                { x: 260, y: 362, rx: 8, ry: 4 },
                { x: 330, y: 382, rx: 8.5, ry: 4.2 },
                { x: 420, y: 410, rx: 9, ry: 4.5 },
                { x: 480, y: 432, rx: 8, ry: 4 },
                { x: 270, y: 426, rx: 7.5, ry: 3.8 },
                { x: 710, y: 405, rx: 7.5, ry: 3.8 },
                { x: 538, y: 495, rx: 9, ry: 4.5 },
                { x: 537, y: 522, rx: 9.5, ry: 4.8 },
              ].map((fs, i) => (
                <ellipse key={`rfs-${i}`} cx={fs.x} cy={fs.y} rx={fs.rx} ry={fs.ry} fill="#948473" stroke="#6b5c4d" strokeWidth="0.8" />
              ))}
            </g>

            {/* 6. Lower Cottage Terrace Stone Retaining Wall (主屋南侧梯级护土石墙，将主屋牢牢扎根于大地) */}
            <g id="lower-cottage-terrace-wall">
              {/* Shaded vertical dry-stone wall along isometric front edge */}
              <path
                d="M240,470 L480,488 L480,504 L240,486 Z"
                fill="url(#stoneWallFaceGrad)"
              />
              <path
                d="M240,470 L480,488 L480,492 L240,474 Z"
                fill="url(#stoneWallCapGrad)"
                stroke="#66594c"
                strokeWidth="0.8"
              />
              <path
                d="M596,488 L840,470 L840,486 L596,504 Z"
                fill="url(#stoneWallFaceGrad)"
              />
              <path
                d="M596,488 L840,470 L840,474 L596,492 Z"
                fill="url(#stoneWallCapGrad)"
                stroke="#66594c"
                strokeWidth="0.8"
              />
              {/* Moss tufts clinging to stone terrace */}
              <ellipse cx="360" cy="484" rx="10" ry="4" fill="#3d583b" opacity="0.8" />
              <ellipse cx="720" cy="484" rx="10" ry="4" fill="#3d583b" opacity="0.8" />
            </g>

            {/* Delicate Homestead Garden Flora (野甘菊与三叶草，自然点缀主屋四周的庭院草地) */}
            <g id="homestead-garden-flora" opacity="0.75">
              {[
                { x: 140, y: 360 }, { x: 180, y: 440 }, { x: 260, y: 460 },
                { x: 380, y: 490 }, { x: 440, y: 520 }, { x: 620, y: 525 },
                { x: 740, y: 535 }, { x: 820, y: 480 }, { x: 960, y: 515 },
                { x: 1080, y: 460 }, { x: 1140, y: 520 }
              ].map((fl, i) => (
                <g key={`hfl-${i}`} transform={`translate(${fl.x}, ${fl.y})`}>
                  <circle cx="0" cy="0" r="1.6" fill="#ffffff" />
                  <circle cx="0" cy="0" r="0.6" fill="#fef08a" />
                </g>
              ))}
            </g>
          </g>

          {/* ======================================================== */}
          {/* 1.5 TRACTOR & HAY BALES AT THE FARMYARD CORNER (农家角落·拖拉机与草垛) */}
          {/* ======================================================== */}
          <g
            id="tractor-in-field"
            transform="translate(100, 280)"
            className="cursor-pointer transition-opacity hover:opacity-95"
            onMouseEnter={() => setHoveredObject('tractor')}
            onMouseLeave={() => setHoveredObject(null)}
          >
            {/* 2.5D Isometric boundary wooden split-rail fence behind the tractor */}
            <g id="farm-yard-fence" opacity="0.88">
              <line x1="-40" y1="10" x2="115" y2="30" stroke="#5a422e" strokeWidth="2.6" strokeLinecap="round" />
              <line x1="-40" y1="20" x2="115" y2="40" stroke="#5a422e" strokeWidth="2.4" strokeLinecap="round" />
              {[-30, 10, 50, 90].map((fx, idx) => {
                const fy = 8 + idx * 6.5;
                return (
                  <line key={`fx-${fx}`} x1={fx} y1={fy} x2={fx} y2={fy + 28} stroke="#483321" strokeWidth="3.4" strokeLinecap="round" />
                );
              })}
            </g>

            {/* Packed earth & fine gravel parking pad under tractor */}
            <ellipse cx="46" cy="46" rx="58" ry="13" fill="#604f3d" opacity="0.32" />

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

            {/* Main Elevated SETI Alien Radio Station (Mountain Peak Y=82) */}
            <g
              id="room-observatory"
              transform="translate(890, 82)"
              onClick={() => {
                if (!hasMovedRef.current) onSelectRoom('observatory');
              }}
              onMouseEnter={() => setHoveredObject('room-observatory')}
              onMouseLeave={() => setHoveredObject(null)}
              className="cursor-pointer group/observatory"
            >
              {/* Massive Cliff Outcrop Drop Shadow casting onto lower slopes */}
              <ellipse cx="0" cy="52" rx="78" ry="20" fill="#1b231d" opacity="0.38" filter="url(#softShadow)" />

              {/* Active Room Focus Aura (Cosmic Emerald Glow) */}
              {activeRoom === 'observatory' && (
                <ellipse
                  cx="0"
                  cy="-12"
                  rx="86"
                  ry="74"
                  fill="rgba(56, 239, 125, 0.14)"
                  stroke="#38ef7d"
                  strokeWidth="2.5"
                  strokeDasharray="7 5"
                  className="animate-[pulse_3s_infinite]"
                />
              )}

              {/* 1. MOUNTAIN SUMMIT CLIFF CRAG / ROCKY PROMONTORY (山巅悬崖基座) */}
              <g id="summit-cliff-crag">
                {/* Stratified Craggy Rock Faces raising the station high into the air */}
                <polygon points="-65,22 0,4 66,22 4,50 -65,22" fill="#363f38" stroke="#242c26" strokeWidth="1.5" />
                {/* Left Shadow Facet */}
                <polygon points="-65,22 4,50 4,62 -65,34" fill="#252c26" />
                {/* Center / Right Lit Rock Facet */}
                <polygon points="4,50 66,22 66,34 4,62" fill="#2f3731" />
                {/* Stratification & Geological Crevice Lines */}
                <path d="M-40,28 L-10,42 L35,28" stroke="#1d231e" strokeWidth="1.8" fill="none" />
                <path d="M-20,38 L15,48 L50,34" stroke="#1d231e" strokeWidth="1.6" fill="none" />
                {/* Alpine Lichen & Grass Tuffs on Cliff Ledges */}
                <ellipse cx="-45" cy="24" rx="8" ry="3.5" fill="#4d6953" />
                <ellipse cx="38" cy="26" rx="10" ry="4" fill="#4d6953" />
                <ellipse cx="2" cy="46" rx="7" ry="3" fill="#3f5744" />
              </g>

              {/* 2. Natural Mountain Stone Terrace Platform */}
              <g id="observatory-terrace-deck">
                <polygon points="-62,22 0,6 64,22 0,38" fill="#525d54" stroke="#333b35" strokeWidth="1.4" />
                {/* Stone Flagstones Surface */}
                <polygon points="-58,21 0,8 60,21 0,35" fill="#717e73" />
                <line x1="-36" y1="16" x2="-8" y2="29" stroke="#48524a" strokeWidth="1.2" opacity="0.65" />
                <line x1="8" y1="12" x2="38" y2="25" stroke="#48524a" strokeWidth="1.2" opacity="0.65" />
                <line x1="-15" y1="11" x2="16" y2="24" stroke="#48524a" strokeWidth="1" opacity="0.5" />

                {/* Heavy Wrought Iron Perimeter Safety Railing with Brass Stanchions */}
                <g id="observatory-railing" opacity="0.9">
                  <line x1="-58" y1="18" x2="58" y2="18" stroke="#252c27" strokeWidth="2.2" />
                  <line x1="-58" y1="13" x2="58" y2="13" stroke="#252c27" strokeWidth="1.4" />
                  {[-54, -36, -18, 0, 18, 36, 54].map((rx) => (
                    <g key={rx}>
                      <line x1={rx} y1="21" x2={rx} y2="10" stroke="#252c27" strokeWidth="2" strokeLinecap="round" />
                      <circle cx={rx} cy="10" r="1.3" fill="#d4af37" />
                    </g>
                  ))}
                </g>
              </g>

              {/* 3. RADIO TELEMETRY CONTROL CABIN & POWER STATION (山巅射电监听工作站/操作机柜室) */}
              <g id="radio-control-cabin" transform="translate(-40, 2)">
                {/* Cabin Shadow on Deck */}
                <polygon points="-6,22 28,14 32,24 0,32" fill="#202922" opacity="0.4" />

                {/* Cabin Body Walls */}
                <polygon points="-8,4 18,-4 18,22 -8,30" fill="#38453d" stroke="#252e28" strokeWidth="1.2" />
                <polygon points="18,-4 28,-1 28,25 18,22" fill="#29332c" />

                {/* Corrugated Texture / Panel Seams */}
                <line x1="-8" y1="12" x2="18" y2="4" stroke="#47574d" strokeWidth="0.8" />
                <line x1="-8" y1="20" x2="18" y2="12" stroke="#47574d" strokeWidth="0.8" />

                {/* Slanted Alpine Roof with Solar Panel Array */}
                <polygon points="-10,4 16,-6 30,-2 4,8" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                {/* Solar Cells Grid */}
                <line x1="-2" y1="1" x2="22" y2="-7" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />
                <line x1="2" y1="5" x2="26" y2="-3" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />
                <line x1="10" y1="-2" x2="14" y2="6" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />

                {/* Front Heavy Duty Equipment Door */}
                <rect x="-4" y="11" width="10" height="16" rx="2" fill="#252d27" stroke="#181f1a" strokeWidth="0.9" />
                <circle cx="4" cy="19" r="1.2" fill="#fcd34d" />

                {/* Illuminated Monitoring Observation Window (Glowing with phosphor meters) */}
                <rect x="8" y="5" width="7" height="8" rx="1.5" fill="#064e3b" stroke="#10b981" strokeWidth="0.8" />
                <line x1="9" y1="9" x2="14" y2="9" stroke="#38ef7d" strokeWidth="1" className="animate-pulse" />
                <circle cx="10" cy="7" r="0.8" fill="#fcd34d" />
                <circle cx="13" cy="7" r="0.8" fill="#38ef7d" />

                {/* Tall Communications Beacon Mast atop Cabin Roof */}
                <line x1="16" y1="-6" x2="16" y2="-28" stroke="#334155" strokeWidth="1.6" />
                <line x1="13" y1="-22" x2="19" y2="-22" stroke="#475569" strokeWidth="1" />
                <line x1="14" y1="-16" x2="18" y2="-16" stroke="#475569" strokeWidth="1" />
                {/* Strobe Warning Light */}
                <circle cx="16" cy="-28" r="2.2" fill="#ef4444" className="animate-ping" />
                <circle cx="16" cy="-28" r="1.6" fill="#f87171" />

                {/* Cable Conduit Bridge running to the Radio Dish */}
                <path d="M26,20 Q36,18 42,22" stroke="#1e293b" strokeWidth="2.5" fill="none" />
                <path d="M26,22 Q36,20 42,24" stroke="#047857" strokeWidth="1.6" fill="none" />
              </g>

              {/* 4. GRAND PARABOLIC SETI ALIEN RADIO DISH & LATTICE STEEL TOWER (大口径外星射电抛物面天线塔架) */}
              <g
                id="alien-receiver-assembly"
                transform="translate(16, 2)"
                onClick={(e) => {
                  triggerAlienSignal(e);
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  setHoveredObject('alien-receiver');
                }}
                onMouseLeave={() => setHoveredObject(null)}
                className="group/dish cursor-pointer"
              >
                {/* Base Shadow on Terrace Deck */}
                <ellipse cx="0" cy="22" rx="26" ry="10" fill="#1b231d" opacity="0.45" filter="url(#softShadow)" />

                {/* Heavy Structural Steel Quad-Pylon Lattice Tower (高架钢桁架塔体) */}
                <g id="dish-lattice-mast">
                  {/* Concrete Anchorage Footings */}
                  <rect x="-18" y="19" width="6" height="4" rx="1" fill="#3f4a42" stroke="#252d27" strokeWidth="0.8" />
                  <rect x="12" y="19" width="6" height="4" rx="1" fill="#3f4a42" stroke="#252d27" strokeWidth="0.8" />
                  <rect x="-8" y="14" width="5" height="3" rx="1" fill="#2d352f" />
                  <rect x="3" y="14" width="5" height="3" rx="1" fill="#2d352f" />

                  {/* Main Steel Truss Legs */}
                  <line x1="-15" y1="20" x2="-6" y2="-12" stroke="#242c26" strokeWidth="3.2" strokeLinecap="round" />
                  <line x1="15" y1="20" x2="6" y2="-12" stroke="#242c26" strokeWidth="3.2" strokeLinecap="round" />
                  <line x1="-6" y1="15" x2="-3" y2="-10" stroke="#333d36" strokeWidth="2.2" />
                  <line x1="5" y1="15" x2="3" y2="-10" stroke="#333d36" strokeWidth="2.2" />

                  {/* Steel Diagonal Lattice Cross Bracings */}
                  <line x1="-14" y1="16" x2="5" y2="6" stroke="#3f4d42" strokeWidth="1.6" />
                  <line x1="14" y1="16" x2="-5" y2="6" stroke="#3f4d42" strokeWidth="1.6" />
                  <line x1="-10" y1="7" x2="4" y2="-3" stroke="#3f4d42" strokeWidth="1.6" />
                  <line x1="10" y1="7" x2="-4" y2="-3" stroke="#3f4d42" strokeWidth="1.6" />
                  <line x1="-6" y1="-2" x2="3" y2="-10" stroke="#3f4d42" strokeWidth="1.4" />
                  <line x1="6" y1="-2" x2="-3" y2="-10" stroke="#3f4d42" strokeWidth="1.4" />

                  {/* Central Service Maintenance Ladder */}
                  <line x1="0" y1="18" x2="0" y2="-10" stroke="#48594d" strokeWidth="1.4" />
                  {[-8, -4, 0, 4, 8, 12, 16].map((ly) => (
                    <line key={ly} x1="-2.5" y1={ly} x2="2.5" y2={ly} stroke="#48594d" strokeWidth="1" />
                  ))}

                  {/* Maintenance Circular Walkway Platform with Safety Rail */}
                  <ellipse cx="0" cy="-12" rx="14" ry="4.5" fill="#3e4d42" stroke="#222b24" strokeWidth="1" />
                  <ellipse cx="0" cy="-15" rx="13" ry="4" fill="none" stroke="#222b24" strokeWidth="0.9" />
                  <line x1="-13" y1="-12" x2="-13" y2="-15" stroke="#222b24" strokeWidth="1" />
                  <line x1="13" y1="-12" x2="13" y2="-15" stroke="#222b24" strokeWidth="1" />
                  <line x1="0" y1="-7.5" x2="0" y2="-11" stroke="#222b24" strokeWidth="1" />

                  {/* Dual-Axis Motorized Antenna Pedestal & Gimbal Turret */}
                  <rect x="-6" y="-18" width="12" height="7" rx="2" fill="#2d3730" stroke="#161d18" strokeWidth="1" />
                  <circle cx="0" cy="-15" r="3" fill="#b09361" />
                  {/* Heavy Mechanical Counterweight Cylinders */}
                  <rect x="-12" y="-21" width="5" height="8" rx="1.5" fill="#1f2621" stroke="#141815" strokeWidth="0.8" />
                  <rect x="7" y="-21" width="5" height="8" rx="1.5" fill="#1f2621" stroke="#141815" strokeWidth="0.8" />
                </g>

                {/* 🌟 GRAND PARABOLIC DISH (Angled skyward 34° toward Deep Space / Cosmos) */}
                <g transform="translate(0, -22) rotate(-34 0 0)">
                  {/* Outer Dish Structural Shell & Dark Rim */}
                  <ellipse cx="0" cy="0" rx="30" ry="20" fill="#232d26" stroke="#161c17" strokeWidth="1.8" filter="url(#softShadow)" />

                  {/* Dish Interior Parabolic Reflecting Surface (Scientific Ivory-White) */}
                  <ellipse cx="0" cy="0" rx="28" ry="18" fill="#edf4ee" stroke="#637667" strokeWidth="1.6" />

                  {/* Concentric Microwave Radar Reflective Wire Mesh Rings */}
                  <ellipse cx="0" cy="0" rx="21" ry="13.5" fill="none" stroke="#68786d" strokeWidth="1" strokeDasharray="4 2.5" />
                  <ellipse cx="0" cy="0" rx="14" ry="9" fill="none" stroke="#68786d" strokeWidth="1" strokeDasharray="3 2" />
                  <ellipse cx="0" cy="0" rx="7" ry="4.5" fill="none" stroke="#68786d" strokeWidth="0.9" />

                  {/* Parabolic Radial Rib Spokes (8 structural sectors) */}
                  <line x1="-27" y1="0" x2="27" y2="0" stroke="#87998c" strokeWidth="0.9" opacity="0.8" />
                  <line x1="0" y1="-17" x2="0" y2="17" stroke="#87998c" strokeWidth="0.9" opacity="0.8" />
                  <line x1="-20" y1="-12" x2="20" y2="12" stroke="#87998c" strokeWidth="0.8" opacity="0.65" />
                  <line x1="-20" y1="12" x2="20" y2="-12" stroke="#87998c" strokeWidth="0.8" opacity="0.65" />

                  {/* Quad-pod Struts converging to Sub-Reflector Feed Horn Tip */}
                  <line x1="-23" y1="0" x2="0" y2="-24" stroke="#324036" strokeWidth="1.6" />
                  <line x1="23" y1="0" x2="0" y2="-24" stroke="#324036" strokeWidth="1.6" />
                  <line x1="0" y1="16" x2="0" y2="-24" stroke="#324036" strokeWidth="1.6" />
                  <line x1="0" y1="-16" x2="0" y2="-24" stroke="#324036" strokeWidth="1.6" />

                  {/* Central Sub-reflector Horn & Alien Detection Sensor Feed */}
                  <circle cx="0" cy="-24" r="4.2" fill="#131d16" stroke="#38ef7d" strokeWidth="1.5" />
                  <circle cx="0" cy="-24" r="2.8" fill="#38ef7d" className="animate-pulse" />
                  {/* High Gain Core Sensor Tip */}
                  <circle cx="0" cy="-24" r="1.4" fill="#ffffff" />
                </g>

                {/* 📡 COSMIC ALIEN WAVE RESONANCE & PULSES (从天线馈源激荡射向宇宙深空的动态外星电波) */}
                <g transform="translate(14, -54)">
                  {/* Steady Cosmic Ambient Wave Ripple */}
                  <circle cx="0" cy="0" r="10" fill="#38ef7d" opacity="0.3" className="animate-ping pointer-events-none" />
                  <circle cx="0" cy="0" r="20" fill="none" stroke="#38ef7d" strokeWidth="1.5" opacity="0.5" className="animate-[ping_2s_infinite] pointer-events-none" />

                  {/* Expanded Multi-Ring Waves on Click Trigger */}
                  {alienPulseEffect && (
                    <>
                      <circle cx="0" cy="0" r="32" fill="none" stroke="#38ef7d" strokeWidth="2.2" className="animate-ping pointer-events-none" />
                      <circle cx="0" cy="0" r="54" fill="none" stroke="#38bdf8" strokeWidth="1.8" className="animate-ping pointer-events-none" />
                      <circle cx="0" cy="0" r="76" fill="none" stroke="#a78bfa" strokeWidth="1.2" className="animate-ping pointer-events-none" />
                    </>
                  )}
                </g>

                {/* Signal Direction Beam Pointer Arc */}
                <path d="M8,-58 Q24,-76 42,-90" stroke="#38ef7d" strokeWidth="1.4" strokeDasharray="3 4" fill="none" opacity="0.6" className="animate-pulse pointer-events-none" />
                <polygon points="42,-90 35,-88 38,-82" fill="#38ef7d" opacity="0.8" />
              </g>

              {/* 5. OUTDOOR FIELD TELEMETRY CONSOLE & CRT OSCILLOSCOPE (户外射电监听操作台与频谱示波器) */}
              <g id="telemetry-field-desk" transform="translate(-16, 12)">
                {/* Console Desk Body */}
                <rect x="0" y="0" width="22" height="17" rx="2.5" fill="#222b24" stroke="#141a15" strokeWidth="1.2" />

                {/* Dual CRT Phosphor Display Screens */}
                {/* CRT Screen 1: Pulsing Signal Oscilloscope Waveform */}
                <rect x="2" y="2" width="10" height="7.5" rx="1.2" fill="#08140c" stroke="#10b981" strokeWidth="0.7" />
                <path
                  d="M3,5.5 Q5,3.2 6.5,5.5 T9,5.5 T11,5.5"
                  fill="none"
                  stroke="#38ef7d"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  className="animate-pulse"
                />

                {/* CRT Screen 2: Frequency Spectrum Analyzer */}
                <rect x="13" y="2" width="7" height="7.5" rx="1.2" fill="#08140c" stroke="#38bdf8" strokeWidth="0.7" />
                <line x1="14.5" y1="8" x2="14.5" y2="4.5" stroke="#38bdf8" strokeWidth="1" />
                <line x1="16.5" y1="8" x2="16.5" y2="3.2" stroke="#38ef7d" strokeWidth="1" className="animate-pulse" />
                <line x1="18.5" y1="8" x2="18.5" y2="5.5" stroke="#38bdf8" strokeWidth="1" />

                {/* Instrument Dials, Knobs & LED Indicators */}
                <circle cx="4" cy="12.5" r="1.3" fill="#fcd34d" />
                <circle cx="8" cy="12.5" r="1.3" fill="#ef4444" />
                <circle cx="12" cy="12.5" r="1.3" fill="#38ef7d" className="animate-ping" />
                <circle cx="16" cy="12.5" r="1.3" fill="#38bdf8" />
                <line x1="2" y1="15.5" x2="20" y2="15.5" stroke="#37453b" strokeWidth="0.8" />

                {/* Frequency Badge Tag */}
                <g transform="translate(11, 24)" className="pointer-events-none">
                  <rect x="-26" y="-5.5" width="52" height="11" rx="5.5" fill="#121a14" stroke="#10b981" strokeWidth="0.8" opacity="0.95" />
                  <text x="0" y="2.8" fill="#38ef7d" fontSize="6.8" fontWeight="bold" textAnchor="middle">
                    1420.4 MHz · SETI
                  </text>
                </g>
              </g>

              {/* 6. SETI RESEARCHER / LISTENING SPECIALIST (由 Presence 场景槽位 observatory_post 动态分配与驱动：侧身监听外星电波) */}
              {(() => {
                const obsOccupant = presenceSlots.observatory_post?.occupant;
                const slotCfg = presenceSlots.observatory_post?.config;
                if (!obsOccupant || !slotCfg) return null;

                return (
                  <g
                    id={`person-in-observatory-${obsOccupant.id}`}
                    transform={`translate(${slotCfg.offset.dx}, ${slotCfg.offset.dy})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPerson(obsOccupant);
                    }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setHoveredObject(`person-${obsOccupant.id}`);
                    }}
                    onMouseLeave={() => setHoveredObject(null)}
                    className="cursor-pointer group/char"
                  >
                    {/* Floor Shadow */}
                    <ellipse cx="0" cy="12" rx="7" ry="3" fill="#1a201b" opacity="0.45" />
                    {/* Warm Winter Parka / Character Body */}
                    <rect x="-6" y="-2" width="12" height="14" rx="4" fill={obsOccupant.shirtColor} filter="url(#softShadow)" />
                    {/* Character Head: 侧身视角 (facing="side") */}
                    <CharacterHead
                      cx={0}
                      cy={-7}
                      r={5.5}
                      skinColor={obsOccupant.skinColor || '#f5d6be'}
                      hairColor={obsOccupant.hairColor || '#302319'}
                      hairStyle={obsOccupant.hairStyle || 'curtain_crescent'}
                      beanieColor={obsOccupant.beanieColor || '#1f3a2c'}
                      hasPompom={obsOccupant.hasPompom ?? true}
                      facing={slotCfg.facing}
                    />

                    {/* Over-Ear Radio Communication Headset (监听耳机与麦克风) */}
                    <path d="M-6,-7 Q0,-13 6,-7" stroke="#1e293b" strokeWidth="1.8" fill="none" />
                    <rect x="-7" y="-9" width="2.5" height="4.5" rx="1.2" fill="#38ef7d" />
                    <rect x="4.5" y="-9" width="2.5" height="4.5" rx="1.2" fill="#38ef7d" />
                    <path d="M-5,-5 Q-2,-2 1,-4" stroke="#1e293b" strokeWidth="0.9" fill="none" />

                    {/* Clipboard / Radio Log in Hand */}
                    <polygon points="5,1 11,1 11,8 5,8" fill="#e2e8f0" stroke="#475569" strokeWidth="0.6" />
                    <line x1="7" y1="3" x2="10" y2="3" stroke="#059669" strokeWidth="0.6" />
                    <line x1="7" y1="5" x2="10" y2="5" stroke="#059669" strokeWidth="0.6" />

                    {/* Character Name & Activity Whispers */}
                    <g transform="translate(0, -23)" className="pointer-events-none">
                      <rect x="-46" y="-7" width="92" height="15" rx="7.5" fill="#121a14" stroke="#10b981" strokeWidth="0.8" opacity="0.94" />
                      <text x="0" y="3.5" fill="#d1fae5" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                        📡 {obsOccupant.name} · {slotCfg.badgeLabel.split('(')[0].trim()}
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* Hover Pill Label for Alien Radio Station */}
              <g
                transform="translate(0, 48)"
                className="opacity-0 group-hover/observatory:opacity-100 transition-opacity pointer-events-none"
              >
                <rect x="-76" y="-8.5" width="152" height="17" rx="8.5" fill="#131c15" stroke="#10b981" strokeWidth="0.9" opacity="0.95" />
                <text x="0" y="3.8" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
                  📡 山巅外星电波监听站 · 点击捕获信号
                </text>
              </g>
            </g>
          </g>

          {/* ======================================================== */}
          {/* 2. THE COTTAGE HAVEN (NOW SITUATED ACROSS THE ROAD)       */}
          {/*    Surrounded by lawn, stone path, garden & trees        */}
          {/* ======================================================== */}
          <g id="living-cottage-haven" transform="translate(540, 210)">
            {/* Rear Cottage Garden Trees & Orchard (屋后自然果林与绿灌木，有真实的树干生根扎进山丘土壤) */}
            <g id="cottage-rear-foliage" opacity="0.95">
              {/* Left Rear Apple Tree with grounded trunk */}
              <g transform="translate(-230, -50)">
                {/* Natural weathered tree trunk and roots */}
                <path d="M-6,20 Q-4,60 -8,90 L6,90 Q4,60 6,20 Z" fill="#4d3521" stroke="#2b1a0d" strokeWidth="0.8" />
                <ellipse cx="-1" cy="90" rx="14" ry="4" fill="#1b2518" opacity="0.45" />
                {/* Foliage canopy */}
                <ellipse cx="0" cy="10" rx="35" ry="30" fill="#2d5231" />
                <ellipse cx="-8" cy="0" rx="28" ry="24" fill="#3f7245" />
                <ellipse cx="10" cy="-6" rx="20" ry="18" fill="#4d8854" />
                {/* Tiny ripe apples */}
                <circle cx="-12" cy="4" r="2.8" fill="#ef4444" />
                <circle cx="8" cy="2" r="2.8" fill="#ef4444" />
                <circle cx="-2" cy="-10" r="2.5" fill="#f87171" />
              </g>

              {/* Center Rear Orchard Crown */}
              <g transform="translate(0, -115)">
                <path d="M-5,10 Q-3,50 -6,75 L6,75 Q3,50 5,10 Z" fill="#422e1c" />
                <ellipse cx="0" cy="0" rx="42" ry="28" fill="#28482c" />
                <ellipse cx="-10" cy="-8" rx="32" ry="22" fill="#37673c" />
                <ellipse cx="12" cy="-6" rx="25" ry="18" fill="#4a8551" />
              </g>

              {/* Right Rear Pear/Birch Grove with grounded trunk */}
              <g transform="translate(230, -50)">
                <path d="M-5,18 Q-2,60 -6,90 L6,90 Q4,60 6,18 Z" fill="#4d3521" stroke="#2b1a0d" strokeWidth="0.8" />
                <ellipse cx="0" cy="90" rx="14" ry="4" fill="#1b2518" opacity="0.45" />
                <ellipse cx="0" cy="8" rx="38" ry="32" fill="#2a4f2e" />
                <ellipse cx="10" cy="-2" rx="28" ry="24" fill="#3c7041" />
                <ellipse cx="-8" cy="-8" rx="22" ry="18" fill="#528e57" />
                {/* Tiny golden pears */}
                <circle cx="10" cy="6" r="2.8" fill="#fbbf24" />
                <circle cx="-6" cy="4" r="2.8" fill="#f59e0b" />
              </g>
            </g>

            {/* 2.5D Architectural Foundation, Ventilated Crawl Space & Porch Steps (工匠级建筑基底体系) */}
            <CottageFoundation />

            {/* 2.5D Artisan Hardwood Timber Flooring (工匠级实木企口地板与收边地袱大梁) */}
            <TimberFlooring />

            {/* Back Walls & Timber Frames */}
            <polygon points="-270,135 -270,-10 0,-90 0,58" fill="#e8decb" stroke="#70533c" strokeWidth="2.5" />
            <polygon points="0,58 0,-90 270,-10 270,135" fill="#dfd3be" stroke="#70533c" strokeWidth="2.5" />

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
                transform={`translate(${currentLayout?.['desk-group']?.screen.x ?? -147}, ${currentLayout?.['desk-group']?.screen.y ?? 95})`}
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
                    displayCoords={currentLayout?.['desk-group']?.screen}
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
                transform={`translate(${currentLayout?.['desk-monstera']?.screen.x ?? -198}, ${currentLayout?.['desk-monstera']?.screen.y ?? 122})`}
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
                    displayCoords={currentLayout?.['desk-monstera']?.screen}
                    fixedW={0}
                    label="书桌生机龟背竹"
                    onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
                    onDragEnd={() => onDragGizmoEnd?.()}
                  />
                )}
              </g>

              {/* 1.4 2.5D ERGONOMIC WORK CHAIR & CHARACTER: Self (阁楼人体工学转椅与工作人物：支持椅子与人物随动校准) */}
              <g
                id="isometric-chair-container"
                transform={`translate(${currentLayout?.['attic-chair']?.screen.x ?? -132}, ${currentLayout?.['attic-chair']?.screen.y ?? 101})`}
                onClick={(e) => {
                  if (isInspectorOpen) {
                    e.stopPropagation();
                    onSelectGizmo?.(effectiveGizmoId === 'attic-chair' ? null : 'attic-chair');
                  }
                }}
                onMouseEnter={(e) => {
                  if (isInspectorOpen) {
                    e.stopPropagation();
                    setHoveredObject('chair:手作白橡木温莎椅 (点击可校准工位座椅及人物)');
                  }
                }}
                onMouseLeave={() => {
                  if (isInspectorOpen) {
                    setHoveredObject(null);
                  }
                }}
                className={isInspectorOpen ? 'cursor-pointer' : ''}
              >
                {/* 1. Ground Cast Shadow (温润实木四脚在木地板上的柔和漫反射投影，落地于 y=20.5 水平地面) */}
                <ellipse cx="0" cy="20.5" rx="12" ry="5" fill="#1f150d" opacity="0.28" filter="url(#softShadow)" />

                {/* 2. 2.5D Rustic Handcrafted White Oak Windsor Spindle Chair (日式手作温润白橡木温莎纺锤椅：外八圆柱木腿、环形加固枨、马鞍形实木座板、优雅圆弧纺锤梳背) */}
                <g id="desk-chair">
                  {/* Four Turned Splayed Solid Wood Legs (四根外八锥形实木腿，温润木蜡油柚木色) */}
                  {/* Back-Left Leg (后左椅腿) */}
                  <polygon points="-6.5,7 -5,6.5 -8.5,19.5 -10,19.5" fill="#4d2f16" stroke="#321c0b" strokeWidth="0.4" />
                  <ellipse cx="-9.2" cy="19.5" rx="1.2" ry="0.6" fill="#321c0b" />

                  {/* Back-Right Leg (后右椅腿) */}
                  <polygon points="5,6.5 6.5,7 10,18.5 8.5,18.5" fill="#58351b" stroke="#321c0b" strokeWidth="0.4" />
                  <ellipse cx="9.2" cy="18.5" rx="1.2" ry="0.6" fill="#321c0b" />

                  {/* Under-Seat H-Stretcher Wood Braces (实木H型加固横枨，展现扎实手作榫卯结构) */}
                  <line x1="-8.5" y1="14" x2="8.5" y2="13" stroke="#663f22" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="-2" y1="13.5" x2="-2" y2="17" stroke="#4a2a11" strokeWidth="1.1" strokeLinecap="round" />

                  {/* Front-Left Leg (前左椅腿：微外八，温润受光) */}
                  <polygon points="-7.5,7.5 -5.8,7.5 -8,21.5 -10,21.5" fill="#87562e" stroke="#482b13" strokeWidth="0.5" />
                  <line x1="-6.8" y1="8" x2="-8.8" y2="21" stroke="#b07746" strokeWidth="0.7" strokeLinecap="round" />
                  <ellipse cx="-9" cy="21.5" rx="1.3" ry="0.65" fill="#482b13" />

                  {/* Front-Right Leg (前右椅腿：微外八，温润高光) */}
                  <polygon points="5.8,7.5 7.5,7.5 10,20.5 8,20.5" fill="#7a4b24" stroke="#40240d" strokeWidth="0.5" />
                  <line x1="6.8" y1="8" x2="8.8" y2="20" stroke="#a36b3b" strokeWidth="0.7" strokeLinecap="round" />
                  <ellipse cx="9" cy="20.5" rx="1.3" ry="0.65" fill="#40240d" />

                  {/* Ergonomic Curved Windsor Backrest Crest Rail & Vertical Spindles (典雅优雅弧形温莎梳背与多根实木纺锤立柱) */}
                  {/* Vertical Turned Spindles (7根梳背细圆木柱：严格沿等轴测透视朝向座板延伸) */}
                  <line x1="-7" y1="-3" x2="-7" y2="5" stroke="#7a4b24" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="-4.5" y1="-4.5" x2="-4.5" y2="4" stroke="#87562e" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="-2.2" y1="-5.5" x2="-2.2" y2="3.5" stroke="#9a6639" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="0" y1="-6.2" x2="0" y2="3" stroke="#a67142" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="2.2" y1="-6.8" x2="2.2" y2="3.5" stroke="#9a6639" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="4.5" y1="-7.5" x2="4.5" y2="4" stroke="#87562e" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="7" y1="-8.5" x2="7" y2="5" stroke="#7a4b24" strokeWidth="1.2" strokeLinecap="round" />

                  {/* Curved Continuous Top Bentwood Crest Rail (温润蒸汽弯曲白橡木椅背顶梁：顺应-0.2852透视微倾) */}
                  <path
                    d="M-8.5,-1.5 C-8.5,-7.5 0,-10.5 8.5,-7.0"
                    stroke="#543217"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M-8.5,-1.5 C-8.5,-7.5 0,-10.5 8.5,-7.0"
                    stroke="#945f34"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M-7.5,-2.8 C-7.5,-7.8 0,-9.8 7.5,-7.2"
                    stroke="#bf8554"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.85"
                  />

                  {/* Hand-Carved Saddle Seat (厚实白橡木微凹马鞍坐板：侧面与前缘厚重温润) */}
                  {/* Seat Underside Chamfer Rim */}
                  <polygon points="-9.2,6.5 0,3.8 9.2,6.5 0,9.2" fill="#4a2a11" />
                  {/* Seat Top Wooden Plank */}
                  <polygon points="-9,5.5 0,2.8 9,5.5 0,8.2" fill="#915e34" stroke="#543217" strokeWidth="0.5" />
                  {/* Wooden Plank Highlight on Front Edge */}
                  <line x1="-8.5" y1="5.7" x2="0" y2="8.1" stroke="#b88050" strokeWidth="0.85" strokeLinecap="round" />
                  <line x1="0" y1="8.1" x2="8.5" y2="5.7" stroke="#a66e40" strokeWidth="0.85" strokeLinecap="round" />

                  {/* Handwoven Linen Cushion (质朴棉麻椅垫：增添温馨森系居家感) */}
                  <polygon points="-7.5,5.2 0,3.0 7.5,5.2 0,7.2" fill="#ded4c3" stroke="#b8ab96" strokeWidth="0.4" />
                  <polygon points="-7,5.0 0,3.2 7,5.0 0,6.8" fill="#ebe4d6" />
                </g>

                {/* 3. Character Body (由 Presence 场景槽位 desk_workstation 动态分配与驱动：背身工作态) */}
                {(() => {
                  const deskOccupant = presenceSlots.desk_workstation?.occupant;
                  const slotCfg = presenceSlots.desk_workstation?.config;
                  if (!deskOccupant || !slotCfg) return null;

                  return (
                    <g
                      id={`character-seated-desk-${deskOccupant.id}`}
                      onClick={(e) => {
                        if (isInspectorOpen) {
                          e.stopPropagation();
                          onSelectGizmo?.(effectiveGizmoId === 'attic-chair' ? null : 'attic-chair');
                        } else {
                          e.stopPropagation();
                          onSelectPerson(deskOccupant);
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (isInspectorOpen) {
                          e.stopPropagation();
                          setHoveredObject(`chair:手作白橡木温莎椅 (${deskOccupant.name} 正在此工作 · 点击校准)`);
                        } else {
                          e.stopPropagation();
                          setHoveredObject(`person-${deskOccupant.id}`);
                        }
                      }}
                      onMouseLeave={() => setHoveredObject(null)}
                      className="cursor-pointer group/char"
                    >
                      {/* Seated Pelvis on Cushion (稳坐于座垫中央的卫衣下摆) */}
                      <polygon points="-6.5,4.5 0,2.8 6.5,4.5 0,6.2" fill={deskOccupant.shirtColor} />

                      {/* Torso & Hoodie (从座垫向上升起、贴紧椅背的后背卫衣剪影，双肩斜率严格为-0.2852) */}
                      <polygon
                        points="-6,-5 0,-6.7 6,-8.4 5.5,3.5 -5.5,4.5"
                        fill={deskOccupant.shirtColor}
                      />

                      {/* Spine Crease & Neckline (自然的卫衣后背中缝与领口微皱) */}
                      <line x1="0" y1="-6.5" x2="0" y2="3.5" stroke="#000000" strokeWidth="0.8" opacity="0.16" strokeLinecap="round" />
                      <path d="M-2.5,-6.7 Q0,-5.2 2.5,-7.4" stroke="#000000" strokeWidth="0.8" opacity="0.22" fill="none" />

                      {/* Arms & Hands (手臂顺着等轴测朝向自然向前舒展，双手舒适平放于笔记本键盘上) */}
                      {/* Left Arm (近侧手臂：自左肩下垂微屈伸向键盘前部) */}
                      <path d="M-5.5,-5 C-8,-2.5 -6.5,-5.5 -4,-7" stroke={deskOccupant.shirtColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />
                      {/* Right Arm (远侧手臂：自右肩顺延向键盘深处伸出) */}
                      <path d="M5.5,-8.4 C7.5,-5.5 5,-7 2.5,-8.5" stroke={deskOccupant.shirtColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />
                      {/* Delicate Hands resting on Laptop Keyboard (双手搭在键盘上正在敲击代码) */}
                      <ellipse cx="-4" cy="-7" rx="1.4" ry="1.1" fill={deskOccupant.skinColor || '#fad4c0'} />
                      <ellipse cx="2.5" cy="-8.5" rx="1.4" ry="1.1" fill={deskOccupant.skinColor || '#fad4c0'} />

                      {/* Head: 后背视角 (facing="back") - 严格居中正对笔记本屏幕 */}
                      <CharacterHead
                        cx={0}
                        cy={-14}
                        r={7}
                        skinColor={deskOccupant.skinColor || '#fad4c0'}
                        hairColor={deskOccupant.hairColor || '#1a1a1a'}
                        hairStyle={deskOccupant.hairStyle || 'curtain_crescent'}
                        beanieColor={deskOccupant.beanieColor || '#425b6e'}
                        hasPompom={deskOccupant.hasPompom ?? true}
                        facing={slotCfg.facing}
                      />
                      {/* Headphones on Head (两耳罩与头梁沿-0.2852斜率微倾，紧密贴合头部) */}
                      <path d="M-7,-13 C-8,-19.5 8,-23.5 7,-17" stroke="#1e293b" strokeWidth="1.8" fill="none" />
                      <circle cx="-7" cy="-13" r="2.2" fill="#334155" />
                      <circle cx="7" cy="-17" r="2.2" fill="#334155" />

                      {/* Character Status Tag (悬浮状态标签：保持水平正向展示，清晰易读) */}
                      <g
                        transform="translate(0, -32)"
                        className="opacity-0 group-hover/char:opacity-100 transition-opacity duration-200 pointer-events-none"
                      >
                        <rect x="-42" y="-8" width="84" height="17" rx="8.5" fill="#1c1917" opacity="0.92" />
                        <text x="0" y="4" fill="#f0ebe1" fontSize="9" fontWeight="bold" textAnchor="middle">
                          {deskOccupant.currentState === 'coding' ? '💻' : '🌿'} {deskOccupant.name} · {slotCfg.badgeLabel.split('(')[0].trim()}
                        </text>
                      </g>
                    </g>
                  );
                })()}

                {/* 4. 2.5D 轴测校准把手 (仅在校准器开启且选中温莎椅时渲染) */}
                {effectiveGizmoId === 'attic-chair' && (
                  <IsoGizmo
                    pos={{ x: 0, y: 19.5 }}
                    displayCoords={currentLayout?.['attic-chair']?.screen}
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
                transform={`translate(${currentLayout?.['wood-stove']?.screen.x ?? 0}, ${currentLayout?.['wood-stove']?.screen.y ?? 0})`}
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
                    displayCoords={currentLayout?.['wood-stove']?.screen}
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
                transform={`translate(${(currentLayout?.['daybed']?.screen.x ?? 0) + 14}, ${(currentLayout?.['daybed']?.screen.y ?? 0) + 4})`}
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
                    displayCoords={currentLayout?.['daybed']?.screen}
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
                transform={`translate(${currentLayout?.['cabinet-group']?.screen.x ?? -72}, ${currentLayout?.['cabinet-group']?.screen.y ?? 75})`}
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
                    displayCoords={currentLayout?.['cabinet-group']?.screen}
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
                transform={`translate(${currentLayout?.['tea-table']?.screen.x ?? 10}, ${currentLayout?.['tea-table']?.screen.y ?? 128})`}
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
                    displayCoords={currentLayout?.['tea-table']?.screen}
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

                // 茶桌基准中心坐标
                const tableBaseX = currentLayout?.['tea-table']?.screen.x ?? 10;
                const tableBaseY = currentLayout?.['tea-table']?.screen.y ?? 128;
                // 若 layout 中存在独立蒲团坐标，优先采用；否则按茶桌默认偏移量
                const defaultX = tableBaseX + slotCfg.offset.dx;
                const defaultY = tableBaseY + slotCfg.offset.dy;
                const posX = currentLayout?.[gizmoKey]?.screen.x ?? defaultX;
                const posY = currentLayout?.[gizmoKey]?.screen.y ?? defaultY;

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
                        displayCoords={currentLayout?.[gizmoKey]?.screen}
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
                transform={`translate(${currentLayout?.['wall-posters']?.screen.x ?? 0}, ${currentLayout?.['wall-posters']?.screen.y ?? 0})`}
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
                    displayCoords={currentLayout?.['wall-posters']?.screen}
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
                transform={`translate(${(currentLayout?.['bookshelf-group']?.screen.x ?? 193) - 193}, ${(currentLayout?.['bookshelf-group']?.screen.y ?? 124) - 124})`}
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
                    displayCoords={currentLayout?.['bookshelf-group']?.screen}
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
                transform={`translate(${currentLayout?.['fiddle-plant']?.screen.x ?? 112}, ${currentLayout?.['fiddle-plant']?.screen.y ?? 90})`}
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
                    displayCoords={currentLayout?.['fiddle-plant']?.screen}
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
                transform={`translate(${currentLayout?.['lazy-sofa']?.screen.x ?? 142}, ${currentLayout?.['lazy-sofa']?.screen.y ?? 118})`}
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
                    displayCoords={currentLayout?.['lazy-sofa']?.screen}
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
                    transform={`translate(${currentLayout?.['lazy-sofa']?.screen.x ?? 142}, ${(currentLayout?.['lazy-sofa']?.screen.y ?? 118) - 4})`}
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
                transform={`translate(${currentLayout?.['shiba-inu']?.screen.x ?? -70}, ${currentLayout?.['shiba-inu']?.screen.y ?? 172})`}
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
                    displayCoords={currentLayout?.['shiba-inu']?.screen}
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

            {/* Stepping Stones Path leading naturally from house porch step down to the garden path */}
            <g id="stepping-stones" opacity="0.88">
              <ellipse cx="6" cy="254" rx="15" ry="8" fill="#7a7065" stroke="#5c544b" strokeWidth="0.8" />
              <ellipse cx="14" cy="272" rx="16" ry="8.5" fill="#6e655c" stroke="#524a42" strokeWidth="0.8" />
              <ellipse cx="0" cy="294" rx="17" ry="9" fill="#7a7065" stroke="#5c544b" strokeWidth="0.8" />
            </g>
          </g>

          {/* ======================================================== */}
          {/* 2.5 VINTAGE CAPSULE CABIN (屋旁旧胶囊仓 · 卧室/休息室)    */}
          {/*     Renovated retro aerospace capsule bedroom & lounge   */}
          {/* ======================================================== */}
          <g id="capsule-pod-haven">
            {/* 1. Weathered Wooden Connecting Boardwalk from Cottage Veranda to Capsule Entrance */}
            <g id="capsule-boardwalk">
              {/* Thick timber planks */}
              <polygon points="806,342 856,350 853,366 803,358" fill="#755034" stroke="#482e18" strokeWidth="1" />
              <line x1="818" y1="344" x2="815" y2="360" stroke="#3b2413" strokeWidth="1.4" />
              <line x1="830" y1="346" x2="827" y2="362" stroke="#3b2413" strokeWidth="1.4" />
              <line x1="842" y1="348" x2="839" y2="364" stroke="#3b2413" strokeWidth="1.4" />

              {/* Timber handrail & vintage brass lantern on stake */}
              <line x1="808" y1="341" x2="852" y2="348" stroke="#523824" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="830" y1="346" x2="830" y2="330" stroke="#523824" strokeWidth="2.2" strokeLinecap="round" />
              {/* Miniature Lantern */}
              <rect x="826" y="324" width="8" height="9" rx="1.5" fill="#3b2b1e" stroke="#261b13" strokeWidth="0.8" />
              <circle cx="830" cy="328" r="2.8" fill="#fce47c" />
              <circle cx="830" cy="328" r="14" fill={theme.cottageGlow} opacity="0.55" className="animate-pulse pointer-events-none" />
            </g>

            {/* 2. The Main Capsule Pod Group */}
            <g
              id="room-capsule_pod"
              transform="translate(930, 320)"
              onClick={() => {
                if (!hasMovedRef.current) onSelectRoom('capsule_pod');
              }}
              onMouseEnter={() => setHoveredObject('room-capsule_pod')}
              onMouseLeave={() => setHoveredObject(null)}
              className="cursor-pointer group/pod"
            >
              {/* Solid gravel footing & ambient ground shadow under stilts */}
              <ellipse cx="-8" cy="62" rx="66" ry="15" fill="#1e241c" opacity="0.5" />
              <ellipse cx="-8" cy="61" rx="58" ry="12" fill="#695c4d" opacity="0.4" />

              {/* Active Room Indicator Aura */}
              {activeRoom === 'capsule_pod' && (
                <ellipse
                  cx="-5"
                  cy="16"
                  rx="78"
                  ry="48"
                  fill="rgba(214, 140, 104, 0.12)"
                  stroke="#d68c68"
                  strokeWidth="2.2"
                  strokeDasharray="6 4"
                  className="animate-[pulse_3s_infinite]"
                />
              )}

              {/* 3. Four Heavy-Duty Industrial Support Stilts / Hydraulic Struts */}
              <g id="pod-support-stilts">
                {/* Rear Legs */}
                <line x1="-42" y1="20" x2="-46" y2="56" stroke="#373c38" strokeWidth="4.5" strokeLinecap="round" />
                <ellipse cx="-46" cy="56" rx="6" ry="2.5" fill="#232624" />
                <line x1="36" y1="20" x2="38" y2="54" stroke="#373c38" strokeWidth="4.5" strokeLinecap="round" />
                <ellipse cx="38" cy="54" rx="6" ry="2.5" fill="#232624" />

                {/* Front Legs with Hydraulic Shock Absorber detailing */}
                <line x1="-30" y1="24" x2="-33" y2="62" stroke="#48504a" strokeWidth="5.5" strokeLinecap="round" />
                <rect x="-35" y="36" width="4" height="12" rx="1.5" fill="#b09361" />
                <ellipse cx="-33" cy="62" rx="7" ry="3" fill="#282d29" />

                <line x1="22" y1="24" x2="24" y2="60" stroke="#48504a" strokeWidth="5.5" strokeLinecap="round" />
                <rect x="22" y="34" width="4" height="12" rx="1.5" fill="#b09361" />
                <ellipse cx="24" cy="60" rx="7" ry="3" fill="#282d29" />

                {/* Lush Meadow Flora, Lavender & Climbing Wild Ivy around Stilts */}
                <g id="stilt-vines" opacity="0.9">
                  <path d="M-35,62 Q-32,50 -34,40 Q-30,46 -33,62" fill="#4d7853" />
                  <ellipse cx="-31" cy="46" rx="3.5" ry="2" fill="#5c8f64" />
                  <ellipse cx="-35" cy="53" rx="3" ry="1.8" fill="#5c8f64" />
                  {/* Lavender Spikes */}
                  <line x1="28" y1="60" x2="30" y2="48" stroke="#3d6642" strokeWidth="1.8" />
                  <circle cx="30" cy="47" r="2.5" fill="#a07dc9" />
                  <circle cx="29.5" cy="43" r="2.2" fill="#b594dc" />
                  <circle cx="30" cy="39" r="1.8" fill="#cfb7ed" />
                  <line x1="34" y1="60" x2="36" y2="51" stroke="#3d6642" strokeWidth="1.5" />
                  <circle cx="36" cy="50" r="2" fill="#a07dc9" />
                  <circle cx="36" cy="46" r="1.7" fill="#b594dc" />
                </g>
              </g>

              {/* 4. Streamlined Capsule Hull (Double-Curved Aerospace Shell) */}
              <g id="pod-hull">
                {/* Main Body Hull Base (Off-white / Retro Cream) */}
                <rect x="-70" y="-30" width="136" height="66" rx="33" fill="#e9ebe5" stroke="#758279" strokeWidth="2.2" />

                {/* Aerodynamic Lower Accent Racing Band (Muted Sage Green / Vintage Teal) */}
                <path
                  d="M-70,3 C-70,21 -52,36 -33,36 L33,36 C52,36 66,21 66,3 L-70,3 Z"
                  fill="#5f7c6d"
                />
                {/* Thin Brass Dividing Seam Line */}
                <line x1="-68" y1="3" x2="65" y2="3" stroke="#bda273" strokeWidth="1.6" />

                {/* Top Gloss Highlight on Curved Roof */}
                <path
                  d="M-55,-22 Q-3,-34 50,-22 Q-3,-28 -55,-22 Z"
                  fill="#ffffff"
                  opacity="0.65"
                />

                {/* Panel Rivets along the Circumference */}
                <path
                  d="M-66,-10 L-66,16 M62,-10 L62,16"
                  stroke="#475249"
                  strokeWidth="1.2"
                  strokeDasharray="2 4"
                />

                {/* Stenciled Vintage Identification Typography */}
                <text
                  x="-25"
                  y="-14"
                  fill="#78887e"
                  fontSize="7.5"
                  fontWeight="700"
                  letterSpacing="1.2"
                  className="pointer-events-none"
                >
                  ORBITAL-POD · REST 03
                </text>
              </g>

              {/* 5. Roof Fixtures: Antenna, Dome Light & Solar Strips */}
              <g id="pod-roof-hardware">
                {/* Solar Panel Plates */}
                <rect x="5" y="-35" width="22" height="7" rx="2" fill="#2d3b48" stroke="#1f2832" strokeWidth="0.8" />
                <line x1="16" y1="-35" x2="16" y2="-28" stroke="#486073" strokeWidth="0.8" />

                {/* Roof Air Exhaust Cowling with Gentle Warm Air Puff */}
                <ellipse cx="-40" cy="-30" rx="6" ry="3" fill="#4d5951" stroke="#333b35" strokeWidth="1" />
                <ellipse cx="-40" cy="-35" rx="3.5" ry="2" fill="#fcf9f2" opacity="0.35" className="animate-pulse" />

                {/* Vintage Slanted Radio Antenna with Blinking Beacon Diode */}
                <line x1="42" y1="-28" x2="52" y2="-54" stroke="#3c453e" strokeWidth="2" strokeLinecap="round" />
                <circle cx="52" cy="-54" r="2.8" fill="#e85241" />
                <circle cx="52" cy="-54" r="7" fill="#e85241" opacity="0.4" className="animate-ping pointer-events-none" />
              </g>

              {/* 6. Left Airlock Entrance Hatch Door */}
              <g id="pod-entrance-hatch">
                {/* Door Frame */}
                <rect x="-64" y="-18" width="20" height="44" rx="7" fill="#3b473f" stroke="#2c362f" strokeWidth="1.5" />
                <rect x="-62" y="-16" width="16" height="40" rx="5" fill="#4f5e54" />
                {/* Round Inspection Window */}
                <circle cx="-54" cy="-5" r="4.5" fill="#222b26" stroke="#bda273" strokeWidth="1" />
                <circle cx="-54" cy="-5" r="2.5" fill={theme.cottageGlow} opacity="0.75" />
                {/* Brass Hatch Lever / Wheel Handle */}
                <rect x="-49" y="8" width="3" height="7" rx="1.5" fill="#d4ad65" />
              </g>

              {/* 7. THE PANORAMIC OBSERVATION PORTHOLE & CUTAWAY BEDROOM (核心卧室/休息空间) */}
              <g id="pod-bedroom-interior" transform="translate(10, 3)">
                {/* Heavy Bolted Outer Porthole Flange */}
                <circle cx="0" cy="0" r="28" fill="#434e46" stroke="#8c7347" strokeWidth="2.5" filter="url(#softShadow)" />
                {/* Porthole Bolts */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                  <circle
                    key={ang}
                    cx={Math.cos((ang * Math.PI) / 180) * 25.5}
                    cy={Math.sin((ang * Math.PI) / 180) * 25.5}
                    r="1.2"
                    fill="#e0c79b"
                  />
                ))}

                {/* Inner Room Cavity Glass & Warm Illumination */}
                <circle cx="0" cy="0" r="24" fill="#1b242e" />
                {/* Ambient Warm Golden Bedroom Glow emanating outward */}
                <circle cx="0" cy="0" r="23.5" fill={theme.cottageGlow} opacity="0.82" />

                {/* Soft Radial Ambient Lighting Cone */}
                <ellipse cx="2" cy="5" rx="20" ry="15" fill="#ffea9f" opacity="0.45" />

                {/* Celestial Constellation Chart pinned on the curved interior wall */}
                <g id="star-chart" opacity="0.75">
                  <rect x="-14" y="-18" width="16" height="10" rx="1" fill="#1b2636" />
                  <circle cx="-11" cy="-14" r="0.8" fill="#ffe082" />
                  <circle cx="-7" cy="-15" r="0.8" fill="#ffe082" />
                  <circle cx="-4" cy="-12" r="0.8" fill="#ffe082" />
                  <line x1="-11" y1="-14" x2="-7" y2="-15" stroke="#ffe082" strokeWidth="0.5" />
                  <line x1="-7" y1="-15" x2="-4" y2="-12" stroke="#ffe082" strokeWidth="0.5" />
                </g>

                {/* Wall-mounted Brass Gooseneck Reading Light */}
                <path d="M-18,-4 Q-12,-8 -12,-2" fill="none" stroke="#b08c4e" strokeWidth="1.8" strokeLinecap="round" />
                <ellipse cx="-11" cy="-2" rx="2.5" ry="1.5" fill="#e8ba46" />
                <polygon points="-12,-2 -5,8 -17,8" fill="#fff3c4" opacity="0.4" className="pointer-events-none" />

                {/* Bedside Shelf with Steaming Drink & Cassette Tape */}
                <rect x="13" y="-3" width="9" height="3" rx="1" fill="#694a32" />
                <rect x="14" y="-8" width="4" height="5" rx="1" fill="#fcf9f2" />
                <path d="M16,-8 Q17,-12 15,-15" stroke="#fcf9f2" strokeWidth="0.9" fill="none" opacity="0.8" className="animate-pulse" />

                {/* Curved Bed Mattress */}
                <path d="M-22,12 C-22,23 22,23 22,12 L22,7 C10,12 -10,12 -22,7 Z" fill="#cfbfa8" />

                {/* Plump Feather Sleeping Pillow */}
                <ellipse cx="-12" cy="9" rx="7" ry="4.5" fill="#ffffff" filter="url(#softShadow)" />

                {/* Fluffy Down Duvet (Folded Warm Terracotta Quilt) */}
                <path
                  d="M-8,10 C5,10 16,11 22,12 C22,22 -20,22 -20,15 C-12,15 -9,12 -8,10 Z"
                  fill="#d66e4a"
                  filter="url(#softShadow)"
                />
                {/* White Duvet Top Border Fold */}
                <path d="M-8,10 C-3,8 9,9 21,11" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                {/* ======================================================== */}
                {/* SLEEPER / OCCUPANT IN CAPSULE POD (Presence 槽位 tatami_capsule) */}
                {/* ======================================================== */}
                {(() => {
                  const podOccupant = presenceSlots.tatami_capsule?.occupant;
                  const slotCfg = presenceSlots.tatami_capsule?.config;
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
                        {/* Sleeping Head tucked in pillow with thin beanie & peeking bangs */}
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
                        {/* Sleeping Shirt collar just above the duvet */}
                        <path d="M-4,4 Q0,6 4,4" stroke={podOccupant.shirtColor} strokeWidth="2.5" fill="none" />

                        {/* Character Status Tag (仅悬停时柔和显现) */}
                        <g
                          transform="translate(0, -22)"
                          className="opacity-0 group-hover/char:opacity-100 transition-opacity duration-200 pointer-events-none"
                        >
                          <rect x="-42" y="-7.5" width="84" height="15" rx="7.5" fill="#1c1917" opacity="0.94" stroke="#c47a4f" strokeWidth="0.6" />
                          <text x="0" y="3" fill="#f0ebe1" fontSize="8" fontWeight="bold" textAnchor="middle">
                            🛌 {podOccupant.name} · {slotCfg.badgeLabel.split('(')[0].trim()}
                          </text>
                        </g>
                      </g>
                    );
                  }
                  return (
                    /* Ambient Turn-Down Bed Waiting for Someone */
                    <g opacity="0.65">
                      <ellipse cx="-12" cy="9" rx="4" ry="2" fill="#ede3d5" />
                    </g>
                  );
                })()}

                {/* Glass Reflection Arc on the Porthole */}
                <path
                  d="M-18,-14 A23,23 0 0,1 18,-14"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.38"
                  className="pointer-events-none"
                />
              </g>

              {/* 8. Floating Sleep & Status Indicators */}
              {presenceSlots.tatami_capsule?.occupant && (
                <g id="capsule-sleep-whispers" transform="translate(15, -42)" className="pointer-events-none">
                  {/* Rising z Z dream bubbles */}
                  <text x="18" y="2" fill="#f0d5a8" fontSize="9" fontWeight="bold" className="animate-bounce">z</text>
                  <text x="25" y="-8" fill="#e8ba46" fontSize="12" fontWeight="bold" className="animate-pulse">Z</text>

                  {/* Character Name & Quiet State Pill */}
                  <g transform="translate(-12, 10)">
                    <rect x="-44" y="-8" width="88" height="17" rx="8.5" fill="#1c1917" opacity="0.92" />
                    <text x="0" y="4" fill="#f0ebe1" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                      🌙 {presenceSlots.tatami_capsule.occupant.name} · 安睡中
                    </text>
                  </g>
                </g>
              )}

              {/* 9. Hover Pill Label for the Capsule Pod */}
              <g
                transform="translate(0, 48)"
                className="opacity-0 group-hover/pod:opacity-100 transition-opacity pointer-events-none"
              >
                <rect x="-56" y="-8" width="112" height="17" rx="8.5" fill="#1c1917" opacity="0.94" />
                <text x="0" y="4" fill="#e8ba46" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  🚀 旧胶囊仓 · 卧室休息室
                </text>
              </g>
            </g>
          </g>

          {/* ======================================================== */}
          {/* 2.6 WARM HARVEST CORN CABIN (暖阳玉米仓 · 田园卧房休息室) */}
          {/*     Harmonious rustic timber, toasted golden grain, and  */}
          {/*     terracotta eaves matching the living cottage haven   */}
          {/* ======================================================== */}
          <g id="corn-lounge-haven">
            {/* Connecting Footpath with Natural Stepping Stones from Porch */}
            <g id="corn-stepping-stones" opacity="0.85">
              <ellipse cx="295" cy="405" rx="10" ry="5.5" fill="#655d54" />
              <ellipse cx="268" cy="418" rx="11" ry="6" fill="#756c62" />
              <ellipse cx="240" cy="425" rx="12" ry="6.5" fill="#625a52" />
            </g>

            {/* Main Corn Lounge Interactive Group */}
            <g
              id="room-corn_lounge"
              transform="translate(210, 400)"
              onClick={() => {
                if (!hasMovedRef.current) onSelectRoom('corn_lounge');
              }}
              onMouseEnter={() => setHoveredObject('room-corn_lounge')}
              onMouseLeave={() => setHoveredObject(null)}
              className="cursor-pointer group/corn"
            >
              {/* Deep Ground Contact Shadow Grounding the Cabin onto Meadow */}
              <ellipse cx="10" cy="62" rx="76" ry="16" fill="#1b2518" opacity="0.55" />

              {/* Active Room Indicator Aura */}
              {activeRoom === 'corn_lounge' && (
                <ellipse
                  cx="10"
                  cy="15"
                  rx="88"
                  ry="58"
                  fill="rgba(196, 87, 56, 0.12)"
                  stroke="#c45738"
                  strokeWidth="2.4"
                  strokeDasharray="6 4"
                  className="animate-[pulse_2.8s_infinite]"
                />
              )}

              {/* RUSTIC TIMBER & STONE CRADLE FOUNDATION (呼应主屋石砌基座与原木梁架构) */}
              <g id="corn-cradle-foundation">
                {/* Stone Plinth Footers (同主屋深灰石料 #4a4239) */}
                <ellipse cx="-42" cy="58" rx="10" ry="5" fill="#38322a" />
                <ellipse cx="-42" cy="56" rx="8" ry="4" fill="#4a4239" />
                <ellipse cx="48" cy="60" rx="10" ry="5" fill="#38322a" />
                <ellipse cx="48" cy="58" rx="8" ry="4" fill="#4a4239" />

                {/* Heavy Cedar Timber Upright Struts (深暖棕原木 #5c3f29) */}
                <polygon points="-48,56 -36,56 -32,32 -44,32" fill="#5c3f29" stroke="#362315" strokeWidth="1" />
                <ellipse cx="-38" cy="32" rx="6" ry="3" fill="#755236" />

                <polygon points="42,58 54,58 58,34 46,34" fill="#5c3f29" stroke="#362315" strokeWidth="1" />
                <ellipse cx="52" cy="34" rx="6" ry="3" fill="#755236" />

                {/* Horizontal Heavy Timber Beam */}
                <rect x="-44" y="44" width="98" height="9" rx="3.5" fill="#4e331f" stroke="#2c1a0c" strokeWidth="1" />
                <line x1="-40" y1="48.5" x2="50" y2="48.5" stroke="#704b2e" strokeWidth="1.2" />

                {/* 2-Step Weathered Wood Steps */}
                <polygon points="4,58 26,58 28,63 2,63" fill="#4a301b" />
                <rect x="3" y="56" width="24" height="3.5" rx="1.5" fill="#7a522f" stroke="#3a2211" strokeWidth="0.8" />
                <rect x="6" y="51" width="20" height="3" rx="1.5" fill="#8c5f37" stroke="#3a2211" strokeWidth="0.8" />

                {/* Pastoral Wild Chamomiles & Wheat Stalks at Base */}
                <g id="corn-wildflowers">
                  {/* Wild chamomile clump left */}
                  <g transform="translate(-56, 44)">
                    <line x1="0" y1="18" x2="-2" y2="2" stroke="#3a5635" strokeWidth="1.8" />
                    <circle cx="-2" cy="2" r="4.2" fill="#ffffff" />
                    <circle cx="-2" cy="2" r="1.8" fill="#d97706" />
                  </g>
                  <g transform="translate(-68, 52)">
                    <line x1="0" y1="14" x2="0" y2="2" stroke="#3a5635" strokeWidth="1.6" />
                    <circle cx="0" cy="2" r="3.5" fill="#ffffff" />
                    <circle cx="0" cy="2" r="1.5" fill="#d97706" />
                  </g>
                  {/* Wheat stalk right */}
                  <g transform="translate(68, 48)">
                    <line x1="0" y1="18" x2="3" y2="2" stroke="#486842" strokeWidth="1.8" />
                    <ellipse cx="3" cy="2" rx="2.5" ry="5" fill="#deb46a" stroke="#8c5f28" strokeWidth="0.6" transform="rotate(15 3 2)" />
                    <ellipse cx="2" cy="6" rx="2.2" ry="4.5" fill="#cf9d4e" stroke="#8c5f28" strokeWidth="0.6" transform="rotate(-15 2 6)" />
                  </g>
                  <circle cx="-28" cy="60" r="2.2" fill="#ffffff" />
                  <circle cx="-28" cy="60" r="1" fill="#d97706" />
                  <circle cx="34" cy="62" r="2.2" fill="#ffffff" />
                  <circle cx="34" cy="62" r="1" fill="#d97706" />
                </g>
              </g>

              {/* NATURAL DRIED SAGE & HUSK BACK WRAPPERS (风干鼠尾草绿与麦秆米色苞叶，告别荧光绿) */}
              <g id="corn-back-husks">
                <path
                  d="M-60,30 C-75,45 -35,62 30,58 C68,54 85,38 78,20 C60,42 0,50 -55,26 Z"
                  fill="#4d6645"
                  stroke="#354830"
                  strokeWidth="1.4"
                />
                <path
                  d="M-40,8 C-65,-12 -30,-28 10,-32 C30,-34 60,-24 70,-10 C45,-24 0,-24 -35,2 Z"
                  fill="#5f7e56"
                  stroke="#3d5437"
                  strokeWidth="1.4"
                />
                {/* Natural dried straw edge highlight */}
                <path d="M-55,28 C-35,54 15,54 65,36" stroke="#cbb897" strokeWidth="1.2" fill="none" opacity="0.6" />
              </g>

              {/* TOASTED GOLDEN HARVEST CORN BODY (烘烤暖金麦穗色，与主屋暖米白/原木/红陶瓦和谐共鸣) */}
              <g id="corn-cob-body">
                {/* Base Warm Toasted Corn Shell */}
                <path
                  d="M-62,24 C-76,-4 -54,-24 -12,-28 C34,-32 76,-12 82,14 C86,34 56,48 10,48 C-36,48 -54,42 -62,24 Z"
                  fill="url(#toastedCornGrad)"
                  stroke="#7c4c1a"
                  strokeWidth="1.8"
                />
                {/* Sun-warmed soft grain undertone */}
                <path
                  d="M-58,22 C-70,-2 -50,-20 -10,-24 C30,-28 70,-10 76,12 C80,30 52,44 10,44 C-32,44 -50,38 -58,22 Z"
                  fill="#deb264"
                  opacity="0.65"
                />

                {/* HARMONIOUS TOASTED CORN KERNELS (温暖烘焙燕麦与成熟金色玉米粒，质感温润素雅) */}
                <g id="corn-kernels" opacity="0.95">
                  {/* Row 1 (Top curved row) */}
                  {[
                    { x: -34, y: -20, w: 10, h: 7, r: 2.5, rot: -18 },
                    { x: -21, y: -23, w: 11, h: 7, r: 2.5, rot: -10 },
                    { x: -8, y: -25, w: 11, h: 7.5, r: 2.8, rot: -4 },
                    { x: 5, y: -25, w: 11, h: 7.5, r: 2.8, rot: 2 },
                    { x: 18, y: -23, w: 11, h: 7, r: 2.5, rot: 8 },
                    { x: 31, y: -19, w: 10, h: 7, r: 2.5, rot: 15 },
                    { x: 43, y: -13, w: 9, h: 6.5, r: 2.2, rot: 22 },
                    { x: 54, y: -6, w: 8, h: 6, r: 2, rot: 28 },
                  ].map((k, i) => (
                    <g key={`k1-${i}`} transform={`translate(${k.x}, ${k.y}) rotate(${k.rot})`}>
                      <rect x={-k.w / 2} y={-k.h / 2} width={k.w} height={k.h} rx={k.r} fill="#eed59f" stroke="#925c22" strokeWidth="0.8" />
                      <ellipse cx={-k.w / 4} cy={-k.h / 4} rx={k.w / 3.5} ry={k.h / 4} fill="#fffcf0" opacity="0.5" />
                    </g>
                  ))}

                  {/* Row 2 (Upper-mid curved row) */}
                  {[
                    { x: -48, y: -10, w: 10, h: 7.5, r: 2.5, rot: -22 },
                    { x: -36, y: -12, w: 11, h: 8, r: 2.8, rot: -15 },
                    { x: -22, y: -14, w: 12, h: 8, r: 2.8, rot: -8 },
                    { x: -8, y: -15, w: 12, h: 8.5, r: 3, rot: -2 },
                    { x: 6, y: -15, w: 12, h: 8.5, r: 3, rot: 4 },
                    { x: 20, y: -13, w: 12, h: 8, r: 2.8, rot: 10 },
                    { x: 34, y: -9, w: 11, h: 7.5, r: 2.6, rot: 18 },
                    { x: 47, y: -3, w: 10, h: 7, r: 2.4, rot: 25 },
                    { x: 59, y: 5, w: 9, h: 6.5, r: 2.2, rot: 32 },
                  ].map((k, i) => (
                    <g key={`k2-${i}`} transform={`translate(${k.x}, ${k.y}) rotate(${k.rot})`}>
                      <rect x={-k.w / 2} y={-k.h / 2} width={k.w} height={k.h} rx={k.r} fill="#e4be78" stroke="#8a531b" strokeWidth="0.8" />
                      <ellipse cx={-k.w / 4} cy={-k.h / 4} rx={k.w / 3.5} ry={k.h / 4} fill="#fffbf0" opacity="0.45" />
                    </g>
                  ))}

                  {/* Left Taper Tip Kernels */}
                  {[
                    { x: -55, y: 6, w: 9, h: 7, r: 2.2, rot: -18 },
                    { x: -60, y: 17, w: 8, h: 6.5, r: 2, rot: -10 },
                    { x: -52, y: 26, w: 9, h: 7, r: 2.2, rot: 0 },
                  ].map((k, i) => (
                    <g key={`ktip-${i}`} transform={`translate(${k.x}, ${k.y}) rotate(${k.rot})`}>
                      <rect x={-k.w / 2} y={-k.h / 2} width={k.w} height={k.h} rx={k.r} fill="#d8aa60" stroke="#7e4a17" strokeWidth="0.8" />
                      <ellipse cx={-k.w / 4} cy={-k.h / 4} rx={k.w / 3.5} ry={k.h / 4} fill="#fffcf2" opacity="0.4" />
                    </g>
                  ))}

                  {/* Bottom Framing Kernels */}
                  {[
                    { x: -44, y: 34, w: 11, h: 7.5, r: 2.8, rot: 6 },
                    { x: -30, y: 38, w: 11, h: 7.5, r: 2.8, rot: 4 },
                    { x: 38, y: 36, w: 11, h: 7.5, r: 2.8, rot: -4 },
                    { x: 52, y: 30, w: 10, h: 7, r: 2.6, rot: -12 },
                    { x: 64, y: 20, w: 9, h: 6.5, r: 2.2, rot: -20 },
                    { x: 68, y: 10, w: 8, h: 6, r: 2, rot: -28 },
                  ].map((k, i) => (
                    <g key={`kb-${i}`} transform={`translate(${k.x}, ${k.y}) rotate(${k.rot})`}>
                      <rect x={-k.w / 2} y={-k.h / 2} width={k.w} height={k.h} rx={k.r} fill="#caa056" stroke="#6d3e11" strokeWidth="0.8" />
                      <ellipse cx={-k.w / 4} cy={-k.h / 4} rx={k.w / 3.5} ry={k.h / 4} fill="#fffdf5" opacity="0.35" />
                    </g>
                  ))}
                </g>
              </g>

              {/* NATURAL AMBER CORN SILK TASSELS (柔和琥珀色玉米须) */}
              <g id="corn-silk-tassels" transform="translate(74, -12)">
                <path d="M0,0 C12,-12 24,-8 34,-16 C38,-20 44,-16 48,-22" stroke="#deb46a" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8" />
                <path d="M2,4 C16,-4 26,-2 36,-8 C42,-12 50,-10 54,-14" stroke="#c58e42" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.75" />
                <path d="M-2,6 C10,2 22,6 30,2 C38,0 46,2 52,-2" stroke="#9c6628" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
                <path d="M4,10 C18,8 28,14 38,10 C44,8 52,12 56,8" stroke="#eed59f" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.8" />
              </g>

              {/* COZY SLEEPING CABIN INTERIOR (同主屋暖白抹灰、原木横梁与红陶被褥) */}
              <g id="corn-sleeping-interior">
                {/* Heavy Cedar Timber Frame (深色雪松木门框 #523924) */}
                <path
                  d="M-36,2 C-36,-14 26,-14 26,2 L26,38 C26,42 -36,42 -36,38 Z"
                  fill="#523924"
                  stroke="#332114"
                  strokeWidth="2"
                />

                {/* MINIATURE TERRACOTTA TILE AWNING (红陶瓦小门檐，与主屋红瓦屋顶绝对呼应！) */}
                <path
                  d="M-40,-8 C-15,-20 18,-20 32,-8 L30,-5 C16,-16 -13,-16 -38,-5 Z"
                  fill="url(#terracottaRoof)"
                  stroke="#482e18"
                  strokeWidth="1.2"
                />
                <line x1="-38" y1="-5" x2="30" y2="-5" stroke="#70533c" strokeWidth="1.5" />

                {/* Warm Cream Plaster Interior Wall (与主屋墙壁 #e8decb 完全同色) */}
                <path
                  d="M-33,3 C-33,-11 23,-11 23,3 L23,36 C23,40 -33,40 -33,36 Z"
                  fill="#e8decb"
                />
                {/* Candlelight Warmth Glow inside */}
                <path
                  d="M-33,3 C-33,-11 23,-11 23,3 L23,36 C23,40 -33,40 -33,36 Z"
                  fill="url(#cornGlow)"
                  opacity="0.6"
                />

                {/* Subtle Timber Slat Wallpaper */}
                <g opacity="0.12" stroke="#70533c" strokeWidth="0.8">
                  <line x1="-24" y1="-8" x2="-24" y2="34" />
                  <line x1="-12" y1="-10" x2="-12" y2="34" />
                  <line x1="0" y1="-10" x2="0" y2="34" />
                  <line x1="12" y1="-8" x2="12" y2="34" />
                </g>

                {/* Bedside Rustic Nightstand */}
                <rect x="-30" y="16" width="12" height="18" rx="2" fill="#755034" stroke="#432c1b" strokeWidth="0.8" />
                <rect x="-26" y="12" width="5" height="4.5" rx="1.2" fill="#e8decb" />
                <path d="M-23.5,11 Q-22,7 -24,4" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.7" className="animate-pulse" />

                {/* Warm Brass Nightstand Lamp */}
                <circle cx="-24" cy="8" r="2.8" fill="#d97706" />
                <circle cx="-24" cy="8" r="1.4" fill="#fef3c7" />
                <circle cx="-24" cy="8" r="11" fill="#fed7aa" opacity="0.32" className="animate-pulse pointer-events-none" />

                {/* Plump Cloud Bed with Polished Pine Base */}
                <polygon points="-16,22 21,22 21,38 -16,38" fill="#9e734c" stroke="#5c3f29" strokeWidth="1" />
                <path d="M-15,22 C-15,18 20,18 20,22 L20,28 C20,30 -15,30 -15,28 Z" fill="#fffdfa" />

                {/* Soft Pillow */}
                <ellipse cx="-7" cy="18" rx="7.5" ry="4.5" fill="#fcfaf6" filter="url(#softShadow)" />
                <path d="M-10,18 Q-7,16 -4,18" stroke="#d5ccbd" strokeWidth="0.8" fill="none" />

                {/* Quilt in Terracotta & Sage Green (红陶瓦色与鼠尾草绿拼布软被，呼应主屋与草坪) */}
                <path
                  d="M-3,19 C6,19 16,20 21,21 L21,36 C10,36 -12,36 -14,28 C-6,28 -3,22 -3,19 Z"
                  fill="#b94e32"
                  filter="url(#softShadow)"
                />
                {/* Sage Green Turned-down Quilt Cuff */}
                <path d="M-3,19 C5,18 14,19 21,21" stroke="#527c54" strokeWidth="3" strokeLinecap="round" fill="none" />
                <line x1="2" y1="23" x2="16" y2="34" stroke="#a03f26" strokeWidth="0.8" strokeDasharray="2,2" />
                <line x1="12" y1="22" x2="4" y2="34" stroke="#a03f26" strokeWidth="0.8" strokeDasharray="2,2" />

                {/* SLEEPER / CHARACTER IN CORN LOUNGE (Presence 槽位 tatami_corn) */}
                {(() => {
                  const cornOccupant = presenceSlots.tatami_corn?.occupant;
                  const slotCfg = presenceSlots.tatami_corn?.config;
                  if (cornOccupant && slotCfg) {
                    return (
                      <g
                        id={`person-in-corn-${cornOccupant.id}`}
                        transform={`translate(${slotCfg.offset.dx}, ${slotCfg.offset.dy})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPerson(cornOccupant);
                        }}
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          setHoveredObject(`person-${cornOccupant.id}`);
                        }}
                        onMouseLeave={() => setHoveredObject(null)}
                        className="cursor-pointer group/char"
                      >
                        {/* Sleeping Head in Corn Lounge with thin beanie & peeking bangs */}
                        <CharacterHead
                          cx={0}
                          cy={0}
                          r={5.5}
                          skinColor={cornOccupant.skinColor || '#fad4c0'}
                          hairColor={cornOccupant.hairColor || '#1a1a1a'}
                          hairStyle={cornOccupant.hairStyle || 'curtain_crescent'}
                          beanieColor={cornOccupant.beanieColor || '#425b6e'}
                          hasPompom={cornOccupant.hasPompom ?? true}
                          isSleeping={true}
                          facing={slotCfg.facing}
                        />
                        <path d="M-3.5,4 Q0,6 3.5,4" stroke={cornOccupant.shirtColor} strokeWidth="2.4" fill="none" />

                        {/* Character Status Tag (仅悬停时柔和显现) */}
                        <g
                          transform="translate(0, -20)"
                          className="opacity-0 group-hover/char:opacity-100 transition-opacity duration-200 pointer-events-none"
                        >
                          <rect x="-42" y="-7.5" width="84" height="15" rx="7.5" fill="#1c1917" opacity="0.94" stroke="#c47a4f" strokeWidth="0.6" />
                          <text x="0" y="3" fill="#f0ebe1" fontSize="8" fontWeight="bold" textAnchor="middle">
                            🌾 {cornOccupant.name} · {slotCfg.badgeLabel.split('(')[0].trim()}
                          </text>
                        </g>
                      </g>
                    );
                  }
                  return (
                    <g opacity="0.6">
                      <ellipse cx="-7" cy="18" rx="4" ry="2.2" fill="#deb46a" />
                    </g>
                  );
                })()}

                {/* Arched Window Reflection */}
                <path
                  d="M-30,-2 C-15,-10 10,-10 20,-2"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.4"
                  className="pointer-events-none"
                />
              </g>

              {/* FOREGROUND NATURAL SAGE & DRIED HUSK HOOD (质朴素雅的苞叶遮阳小门廊) */}
              <g id="corn-front-husks">
                <path
                  d="M-42,-12 C-30,-28 15,-28 32,-16 C38,-12 36,-6 28,-8 C14,-18 -18,-18 -32,-4 C-38,2 -44,0 -42,-12 Z"
                  fill="#5c7a52"
                  stroke="#384f33"
                  strokeWidth="1.5"
                />
                <path d="M-30,-18 Q-5,-24 24,-12" stroke="#a1be99" strokeWidth="1.2" fill="none" opacity="0.75" />

                <path
                  d="M-64,20 C-78,35 -56,52 -38,50 C-46,42 -52,32 -50,22 Z"
                  fill="#4c6645"
                  stroke="#2e402a"
                  strokeWidth="1.4"
                />
                <path
                  d="M24,42 C38,52 64,44 72,28 C60,38 42,42 24,42 Z"
                  fill="#455f3f"
                  stroke="#293b26"
                  strokeWidth="1.2"
                />

                {/* Weathered Oak Signpost beside entrance: "🌽 暖阳玉米仓" */}
                <g transform="translate(-48, 22)">
                  <line x1="0" y1="0" x2="0" y2="28" stroke="#54371d" strokeWidth="2.2" strokeLinecap="round" />
                  <rect x="-16" y="-2" width="32" height="14" rx="2.5" fill="#dfd3be" stroke="#70533c" strokeWidth="1.2" filter="url(#softShadow)" />
                  <text x="0" y="8" fill="#4d321d" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                    🌽 暖阳仓
                  </text>
                  {/* Brass mounting studs */}
                  <circle cx="-13" cy="5" r="0.8" fill="#b45309" />
                  <circle cx="13" cy="5" r="0.8" fill="#b45309" />
                </g>
              </g>

              {/* FLOATING SLEEP & STATUS BUBBLES */}
              {presenceSlots.tatami_corn?.occupant && (
                <g id="corn-sleep-whispers" transform="translate(10, -42)" className="pointer-events-none">
                  <text x="8" y="2" fill="#deb46a" fontSize="10" fontWeight="bold" className="animate-bounce">z</text>
                  <text x="16" y="-8" fill="#c58e42" fontSize="13" fontWeight="bold" className="animate-pulse">Z</text>

                  <g transform="translate(-10, 8)">
                    <rect x="-44" y="-8" width="88" height="17" rx="8.5" fill="#1c1917" opacity="0.94" />
                    <text x="0" y="4" fill="#deb46a" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                      🌽 {presenceSlots.tatami_corn.occupant.name} · 玉米仓甜梦
                    </text>
                  </g>
                </g>
              )}

              {/* HOVER PILL LABEL FOR CORN LOUNGE */}
              <g
                transform="translate(0, 52)"
                className="opacity-0 group-hover/corn:opacity-100 transition-opacity pointer-events-none"
              >
                <rect x="-68" y="-8" width="136" height="17" rx="8.5" fill="#1c1917" opacity="0.94" />
                <text x="0" y="4" fill="#deb46a" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  🌽 暖阳玉米仓 · 休憩甜梦卧房
                </text>
              </g>
            </g>
          </g>

          {/* ======================================================== */}
          {/* 3. MEANDERING COUNTRYSIDE STREAM/RIVER (清澈小河与自然驳岸) */}
          {/*    沿2.5D等高线自西北向东南斜向自然蜿蜒，彻底消除拼贴横割感   */}
          {/* ======================================================== */}
          <g id="country-river" onClick={handleRiverClick} className="cursor-pointer">
            {/* 3.1 River Bed & Basin (下凹河床深层，宽幅贯穿全景) */}
            <path
              d="M-600,470 C-200,480 180,504 360,534 C520,554 720,576 960,586 C1230,574 1500,590 1800,580 L1800,670 C1500,680 970,664 730,652 C510,632 330,616 150,586 C-100,560 -350,540 -600,530 Z"
              fill="#3a4d3f"
            />

            {/* 3.2 North Shore Grassy Slope & Riverbank Verge (北岸：临屋草地斜坡与浅滩过渡) */}
            <path
              d="M-600,470 C-200,480 180,504 360,534 C520,554 720,576 960,586 C1230,574 1500,590 1800,580 L1800,615 C1500,625 970,612 730,602 C520,578 350,558 170,528 C-100,505 -350,485 -600,478 Z"
              fill="url(#northBankSlope)"
            />

            {/* North Shore Sandy Gravel Strand (北岸卵石浅滩) */}
            <path
              d="M-600,482 C-200,492 180,516 360,544 C520,563 720,584 960,593 C1230,582 1500,598 1800,588 L1800,606 C1500,616 960,605 720,596 C520,574 360,554 180,526 C-100,512 -350,496 -600,488 Z"
              fill="#968570"
              opacity="0.75"
            />

            {/* 3.3 Clear Water Flow Surface (清澈透底的水体，中央深两侧浅渐变) */}
            <path
              d="M-600,486 C-200,496 180,520 360,548 C520,567 720,588 960,596 C1230,585 1500,602 1800,592 L1800,650 C1500,660 970,652 730,642 C510,622 330,606 150,576 C-100,550 -350,530 -600,520 Z"
              fill="url(#riverDepthGrad)"
            />

            {/* Floating Soft Sky & Cloud Reflections on River Surface (随水面斜向透视自然延展) */}
            <path
              d="M140,542 C260,526 380,560 480,572 C410,588 280,586 160,564 Z"
              fill="#ffffff"
              opacity="0.4"
            />
            <path
              d="M720,602 C840,594 980,614 1100,604 C1020,626 880,634 750,622 Z"
              fill="#ffffff"
              opacity="0.36"
            />

            {/* Soft Current Ripple Lines (流淌水波反光) */}
            <path
              d="M-600,510 C-200,520 180,542 340,570 C510,590 710,612 940,618 C1210,606 1500,624 1800,614"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeDasharray="18 32"
              opacity="0.45"
            />
            <path
              d="M-550,525 C-180,535 210,556 370,586 C530,604 730,624 970,628 C1190,620 1480,638 1800,628"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.4"
              strokeDasharray="24 40"
              opacity="0.5"
            />

            {/* River Reeds & Bank Wild Plants (芦苇与驳岸绿植交错咬合，打破生硬边界) */}
            <g id="river-reeds">
              {/* Left bank reed cluster */}
              <g transform="translate(130, 528)">
                <ellipse cx="0" cy="8" rx="10" ry="4.5" fill="#4d5f46" opacity="0.6" />
                <line x1="-4" y1="8" x2="-8" y2="-16" stroke="#3b683e" strokeWidth="2.4" strokeLinecap="round" />
                <line x1="2" y1="8" x2="6" y2="-22" stroke="#48804c" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="7" y1="8" x2="14" y2="-12" stroke="#3b683e" strokeWidth="2" strokeLinecap="round" />
                <line x1="-1" y1="8" x2="-2" y2="-18" stroke="#5da162" strokeWidth="1.6" strokeLinecap="round" />
              </g>

              {/* Mid-right bank reed cluster */}
              <g transform="translate(860, 592)">
                <ellipse cx="0" cy="8" rx="12" ry="5" fill="#4d5f46" opacity="0.6" />
                <line x1="-6" y1="8" x2="-12" y2="-18" stroke="#3b683e" strokeWidth="2.4" strokeLinecap="round" />
                <line x1="1" y1="8" x2="4" y2="-24" stroke="#48804c" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="8" y1="8" x2="16" y2="-14" stroke="#3b683e" strokeWidth="2" strokeLinecap="round" />
                <line x1="-2" y1="8" x2="-3" y2="-20" stroke="#5da162" strokeWidth="1.6" strokeLinecap="round" />
              </g>
            </g>

            {/* Interactive & Ambient Water Ripples in the River */}
            {ripples.map((rip) => (
              <g key={rip.id} className="pointer-events-none">
                <ellipse
                  cx={rip.x}
                  cy={rip.y}
                  rx="36"
                  ry="12"
                  fill="none"
                  stroke={theme.riverRipples}
                  strokeWidth="1.8"
                  opacity="0.8"
                  className="animate-[ping_2.2s_cubic-bezier(0,0,0.2,1)_infinite]"
                />
                <ellipse
                  cx={rip.x}
                  cy={rip.y}
                  rx="18"
                  ry="6"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.4"
                  opacity="0.85"
                />
              </g>
            ))}

            {/* 3.4 2.5D Isometric Stepping Stones Crossing (踏石过河：具有真实3D厚度、水下阴影与高光) */}
            <g id="river-crossing-stones">
              {/* Stone 1 (North shore shallow water) */}
              <g transform="translate(536, 546)">
                <ellipse cx="0" cy="4" rx="13" ry="6.8" fill="#1b2e25" opacity="0.45" />
                {/* 3D Base rim */}
                <ellipse cx="0" cy="2.5" rx="12" ry="6.2" fill="#44544b" />
                {/* Sunlit top slab */}
                <ellipse cx="0" cy="0" rx="11.5" ry="6" fill="#88988e" stroke="#68786e" strokeWidth="0.8" />
                <ellipse cx="-1.5" cy="-1.5" rx="6" ry="2.5" fill="#a5b6ac" opacity="0.6" />
              </g>

              {/* Stone 2 (Mid-channel stepping stone) */}
              <g transform="translate(528, 570)">
                <ellipse cx="0" cy="4.5" rx="14" ry="7.2" fill="#1b2e25" opacity="0.5" />
                <ellipse cx="0" cy="2.8" rx="13" ry="6.6" fill="#46574d" />
                <ellipse cx="0" cy="0" rx="12.5" ry="6.4" fill="#8d9d93" stroke="#6b7c72" strokeWidth="0.8" />
                <ellipse cx="-2" cy="-1.8" rx="7" ry="2.8" fill="#abc0b4" opacity="0.6" />
                {/* Water wake parting around stone */}
                <path d="M-15,1 Q0,7 15,1" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.5" />
              </g>

              {/* Stone 3 (Main current stepping stone) */}
              <g transform="translate(519, 595)">
                <ellipse cx="0" cy="5" rx="15" ry="7.8" fill="#1b2e25" opacity="0.5" />
                <ellipse cx="0" cy="3" rx="14" ry="7.2" fill="#42534a" />
                <ellipse cx="0" cy="0" rx="13.5" ry="7" fill="#88978e" stroke="#66776d" strokeWidth="0.8" />
                <ellipse cx="-2" cy="-2" rx="8" ry="3.2" fill="#a3b8ab" opacity="0.6" />
                <path d="M-16,1 Q0,8 16,1" stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.55" />
              </g>

              {/* Stone 4 (South shore stepping stone) */}
              <g transform="translate(508, 620)">
                <ellipse cx="0" cy="5.5" rx="16" ry="8.2" fill="#1b2e25" opacity="0.45" />
                <ellipse cx="0" cy="3.2" rx="15" ry="7.6" fill="#485950" />
                <ellipse cx="0" cy="0" rx="14.5" ry="7.4" fill="#90a096" stroke="#6e7f75" strokeWidth="0.8" />
                <ellipse cx="-2" cy="-2" rx="8.5" ry="3.5" fill="#a9bfae" opacity="0.65" />
              </g>
            </g>

            {/* 3.5 South Shore Pebble Verge (南岸卵石滩与缓升地貌，与近景草甸自然咬合) */}
            <path
              d="M-600,526 C-200,538 150,572 330,602 C510,618 730,638 970,648 C1230,632 1500,654 1800,644 L1800,664 C1500,674 970,662 730,652 C510,632 330,616 150,586 C-100,558 -350,538 -600,532 Z"
              fill="url(#southBankSlope)"
            />

            {/* Riverbank Shore Stones & Smooth Pebbles */}
            <g opacity="0.85">
              <ellipse cx="90" cy="578" rx="8" ry="4.2" fill="#7d7263" />
              <ellipse cx="230" cy="596" rx="9" ry="4.5" fill="#8c8071" />
              <ellipse cx="380" cy="614" rx="10" ry="5" fill="#7a6f60" />
              <ellipse cx="680" cy="636" rx="9.5" ry="4.8" fill="#8c8071" />
              <ellipse cx="840" cy="642" rx="11" ry="5.2" fill="#7a6f60" />
              <ellipse cx="1060" cy="636" rx="8.5" ry="4.2" fill="#8c8071" />
            </g>
          </g>

          {/* ======================================================== */}
          {/* 4. EXPANSIVE FOREGROUND MEADOW & SHEEP PASTURE (辽阔青青草甸) */}
          {/*    草地自南岸平滑展开，双层起伏丘陵建立丰富纵深感           */}
          {/* ======================================================== */}
          <g id="foreground-pasture-meadow">
            {/* Main Foreground Lush Meadow (全景近景草甸，向下彻底延伸至 y=1200，绝无底部露底或缝隙) */}
            <path
              d="M-600,530 C-200,544 150,578 330,608 C510,622 730,642 970,652 C1230,636 1500,658 1800,648 L1800,1200 L-600,1200 Z"
              fill="url(#foregroundPastureGrad)"
            />

            {/* Subtle soft sunlit warmth overlay */}
            <path
              d="M-600,530 C-200,544 150,578 330,608 C510,622 730,642 970,652 C1230,636 1500,658 1800,648 L1800,1200 L-600,1200 Z"
              fill="#a3f282"
              opacity="0.08"
            />

            {/* Gentle Rolling Foreground Turf Knolls with bright, natural contours */}
            <path
              d="M-600,610 Q-200,595 280,612 Q560,638 Q880,614 Q1230,640 1800,620 L1800,1200 L-600,1200 Z"
              fill="#5bb848"
              opacity="0.35"
            />
            {/* Crest highlight on first knoll */}
            <path
              d="M-600,610 Q-200,595 280,612 Q560,638 Q880,614 Q1230,640 1800,620"
              stroke="#8de36e"
              strokeWidth="2.8"
              fill="none"
              opacity="0.45"
            />

            <path
              d="M-600,680 Q-180,660 360,676 Q740,700 Q1040,674 Q1230,696 1800,680 L1800,1200 L-600,1200 Z"
              fill="#4ba838"
              opacity="0.38"
            />
            {/* Crest highlight on second knoll */}
            <path
              d="M-600,680 Q-180,660 360,676 Q740,700 Q1040,674 Q1230,696 1800,680"
              stroke="#82dc64"
              strokeWidth="2.5"
              fill="none"
              opacity="0.4"
            />

            {/* Scattered natural sunny grass blades/tufts */}
            <g id="meadow-grass-tufts" opacity="0.65">
              {[
                { x: 70, y: 648 }, { x: 190, y: 655 }, { x: 320, y: 650 },
                { x: 440, y: 652 }, { x: 620, y: 645 }, { x: 790, y: 642 },
                { x: 890, y: 646 }, { x: 1040, y: 645 }, { x: 1130, y: 640 },
                { x: 120, y: 742 }, { x: 380, y: 755 }, { x: 690, y: 735 },
                { x: 840, y: 760 }, { x: 990, y: 748 }, { x: 1110, y: 752 },
              ].map((gt, i) => (
                <g key={`gt-${i}`} transform={`translate(${gt.x}, ${gt.y})`}>
                  <path d="M-3,0 Q-4,-8 -7,-12 M0,0 Q0,-10 0,-14 M3,0 Q4,-8 7,-11" stroke="#3fa22d" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                </g>
              ))}
            </g>

            {/* Natural Flagstone Stepping Trail continuing down through the Meadow (与河道踏石顺畅衔接) */}
            <g id="meadow-stepping-stones" opacity="0.85">
              <ellipse cx="498" cy="650" rx="13" ry="6.5" fill="#786b5e" />
              <ellipse cx="490" cy="685" rx="14" ry="7" fill="#887a6d" />
              <ellipse cx="480" cy="722" rx="15" ry="7.5" fill="#75675a" />
              <ellipse cx="466" cy="758" rx="16" ry="8" fill="#847668" />
              <ellipse cx="448" cy="794" rx="17" ry="8.5" fill="#736558" />
            </g>

            {/* Low Rustic Post-and-Rail Wooden Pasture Fence */}
            <g id="meadow-rustic-fence">
              <line x1="80" y1="715" x2="420" y2="730" stroke="#75563a" strokeWidth="3" strokeLinecap="round" />
              <line x1="80" y1="729" x2="420" y2="744" stroke="#5e432c" strokeWidth="2.8" strokeLinecap="round" />
              {[90, 170, 250, 330, 410].map((fx, idx) => {
                const fy = 710 + idx * 3.8;
                return (
                  <g key={fx}>
                    <rect x={fx} y={fy} width="5.5" height="26" rx="1.5" fill="#543922" />
                    <polygon points={`${fx},${fy} ${fx + 2.75},${fy - 3} ${fx + 5.5},${fy}`} fill="#6e4d30" />
                  </g>
                );
              })}
              {/* Flowering clover and wild roses climbing the fence */}
              <circle cx="130" cy="723" r="3" fill="#f472b6" />
              <circle cx="210" cy="727" r="3" fill="#fb7185" />
              <circle cx="290" cy="731" r="3" fill="#f472b6" />
              <circle cx="370" cy="735" r="3" fill="#ffffff" />
            </g>

            {/* 🐑 Expanded Happy Fluffy Sheep & Lambs Grazing on Meadow */}
            <g
              id="sheep-herd"
              transform="translate(210, 652)"
              className="cursor-pointer transition-opacity hover:opacity-90"
              onMouseEnter={() => setHoveredObject('sheep-pasture')}
              onMouseLeave={() => setHoveredObject(null)}
            >
              {/* Mother Sheep 1 */}
              <g transform="translate(0, 0)">
                <ellipse cx="16" cy="18" rx="20" ry="15" fill="#ffffff" />
                <circle cx="32" cy="14" r="8" fill="#2d2621" />
                <circle cx="33" cy="12" r="1.5" fill="#ffffff" />
                <ellipse cx="28" cy="10" rx="3.5" ry="2" fill="#2d2621" transform="rotate(-20 28 10)" />
                <line x1="8" y1="28" x2="8" y2="39" stroke="#2d2621" strokeWidth="2.8" />
                <line x1="22" y1="28" x2="22" y2="39" stroke="#2d2621" strokeWidth="2.8" />
              </g>
              {/* Little Baby Lamb 1 */}
              <g transform="translate(48, 16)">
                <ellipse cx="10" cy="10" rx="11" ry="8" fill="#ffffff" />
                <circle cx="20" cy="8" r="5" fill="#38302a" />
                <circle cx="21" cy="7" r="1" fill="#ffffff" />
                <line x1="5" y1="17" x2="5" y2="24" stroke="#38302a" strokeWidth="2" />
                <line x1="14" y1="17" x2="14" y2="24" stroke="#38302a" strokeWidth="2" />
              </g>
              {/* Resting Sheep 2 (Lying on grass) */}
              <g transform="translate(85, 8)">
                <ellipse cx="18" cy="16" rx="19" ry="13" fill="#f8fafc" />
                <circle cx="2" cy="12" r="7.5" fill="#38302a" />
                <circle cx="1" cy="11" r="1.2" fill="#ffffff" />
                <ellipse cx="6" cy="9" rx="3" ry="1.8" fill="#38302a" transform="rotate(20 6 9)" />
              </g>
              {/* Grazing Sheep 3 */}
              <g transform="translate(135, 4)">
                <ellipse cx="16" cy="17" rx="18" ry="13" fill="#ffffff" />
                <circle cx="0" cy="22" r="7" fill="#2d2621" />
                <line x1="12" y1="26" x2="12" y2="36" stroke="#2d2621" strokeWidth="2.5" />
                <line x1="24" y1="26" x2="24" y2="36" stroke="#2d2621" strokeWidth="2.5" />
              </g>
            </g>

            {/* Cozy Meadow Rest Bench on the sunny grass overlooking the river (把长椅安放在草地上) */}
            <g
              id="meadow-bench"
              transform="translate(680, 656)"
              className="cursor-pointer transition-opacity hover:opacity-90"
              onMouseEnter={() => setHoveredObject('meadow-bench')}
              onMouseLeave={() => setHoveredObject(null)}
            >
              {/* Ground shadow beneath bench on grass */}
              <ellipse cx="36" cy="45" rx="42" ry="8" fill="#294d24" opacity="0.36" />
              {/* Bench legs */}
              <rect x="6" y="24" width="6.5" height="20" rx="1.5" fill="#4d321d" />
              <rect x="60" y="24" width="6.5" height="20" rx="1.5" fill="#4d321d" />
              <rect x="2" y="42" width="14" height="3.5" rx="1.5" fill="#3b2413" />
              <rect x="56" y="42" width="14" height="3.5" rx="1.5" fill="#3b2413" />
              {/* Backrest Uprights */}
              <rect x="8" y="4" width="5" height="24" rx="1.5" fill="#4d321d" />
              <rect x="59" y="4" width="5" height="24" rx="1.5" fill="#4d321d" />
              {/* Backrest slats */}
              <rect x="0" y="5" width="72" height="6.5" rx="2" fill="#94653a" stroke="#52351c" strokeWidth="0.8" />
              <rect x="0" y="14" width="72" height="6.5" rx="2" fill="#885b32" stroke="#52351c" strokeWidth="0.8" />
              {/* Seat slats */}
              <rect x="-2" y="23" width="76" height="7" rx="2" fill="#a07042" stroke="#52351c" strokeWidth="0.9" />
              <rect x="0" y="29" width="72" height="3.5" rx="1" fill="#754b26" />
              {/* Armrests */}
              <path d="M4,24 L4,15 L14,15" fill="none" stroke="#4d321d" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M68,24 L68,15 L58,15" fill="none" stroke="#4d321d" strokeWidth="2.8" strokeLinecap="round" />

              {/* Woven Picnic Basket on bench */}
              <g transform="translate(42, 12)">
                <rect x="0" y="0" width="18" height="12" rx="2.5" fill="#d4a359" stroke="#875822" strokeWidth="0.9" />
                <path d="M5,0 C5,-5 13,-5 13,0" fill="none" stroke="#875822" strokeWidth="1.4" strokeLinecap="round" />
                <rect x="7" y="4" width="9" height="4" fill="#e25353" rx="0.8" />
              </g>

              {/* Tiny Daisies growing beside bench legs on grass */}
              <circle cx="-3" cy="44" r="2.8" fill="#ffffff" />
              <circle cx="-3" cy="44" r="1" fill="#eab308" />
              <circle cx="78" cy="43" r="2.8" fill="#ffffff" />
              <circle cx="78" cy="43" r="1" fill="#eab308" />
            </g>

            {/* Vibrant Wildflower Sprinkles across the Foreground */}
            <g id="foreground-wildflowers">
              {/* Buttercups & Dandelions (Yellow) */}
              {[
                { x: 120, y: 660 }, { x: 180, y: 685 }, { x: 220, y: 765 },
                { x: 380, y: 675 }, { x: 440, y: 730 }, { x: 590, y: 650 },
                { x: 650, y: 715 }, { x: 750, y: 665 }, { x: 890, y: 740 },
                { x: 960, y: 675 }, { x: 1040, y: 750 }, { x: 1140, y: 700 },
              ].map((f, i) => (
                <circle key={`bf-${i}`} cx={f.x} cy={f.y} r={2.4} fill="#facc15" />
              ))}
              {/* Daisies (White) */}
              {[
                { x: 150, y: 705 }, { x: 260, y: 750 }, { x: 340, y: 695 },
                { x: 470, y: 675 }, { x: 630, y: 750 }, { x: 710, y: 775 },
                { x: 840, y: 675 }, { x: 920, y: 748 }, { x: 1080, y: 720 },
              ].map((f, i) => (
                <g key={`df-${i}`}>
                  <circle cx={f.x} cy={f.y} r={2.6} fill="#ffffff" />
                  <circle cx={f.x} cy={f.y} r={1} fill="#eab308" />
                </g>
              ))}
              {/* Lavender / Bluebells */}
              {[
                { x: 170, y: 735 }, { x: 310, y: 775 }, { x: 640, y: 670 },
                { x: 770, y: 745 }, { x: 870, y: 710 }, { x: 1010, y: 690 },
              ].map((f, i) => (
                <circle key={`lf-${i}`} cx={f.x} cy={f.y} r={2.2} fill="#a855f7" />
              ))}
            </g>
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
      <div className="absolute bottom-24 right-4 hidden md:block z-10 pointer-events-none opacity-60 hover:opacity-90 transition-opacity">
        <span className="text-[11px] text-[#b8ab96] bg-[#141210]/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/5">
          点击小河激起水纹 · 滚轮缩放 · 拖拽平移
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
              {hoveredObject === 'room-corn_lounge' && '🌽 暖阳玉米仓 · 烘焙暖金与红陶瓦田园安睡卧房（点击对焦参观）'}
              {hoveredObject === 'room-observatory' && '📡 山巅外星电波监听站 · 频率 1420.405 MHz 监听地外文明电波（点击对焦参观）'}
              {hoveredObject === 'alien-receiver' && '📡 外星信号接收装置 · 频率 1420.405 MHz 监听深空（点击捕获电波）'}
              {hoveredObject === 'sheep-pasture' && '🐑 辽阔青青前沿草场 · 悠闲吃草的小羊群与雏菊野花甸'}
              {hoveredObject === 'meadow-bench' && '🪑 草甸原木长椅 · 阳光草地上的临河休憩处，迎着微风看小羊与流云'}
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
  );
};
