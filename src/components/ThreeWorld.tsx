import { useWorldFeedback } from '../world/interactions/useWorldFeedback';
import { COUNTRYSIDE_THEMES } from '../world/theme/worldTheme';
import { WorldOverlays } from '../world/overlays/WorldOverlays';
import { ForegroundLandscape } from '../world/render/ForegroundLandscape';
import { MainCottageHaven } from './architecture/MainCottageHaven';
import { DistantPines } from '../world/render/DistantPines';
import { BackgroundLandscape } from '../world/render/BackgroundLandscape';
import { WorldDefs } from '../world/render/WorldDefs';
import { AtmosphereOverlay } from '../world/overlays/AtmosphereOverlay';
import type { InteractionTarget } from '../world/interactions/interactionTypes';
import { svgAction } from '../world/interactions/svgAction';
import { describeInteraction } from '../world/interactions/registry';
import { createInteractionDispatcher } from '../world/interactions/dispatcher';
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
import { PresenceAllocation, SceneSlotConfig } from '../utils/sceneViewMapping';
import { Bookshelf, BookshelfPreset, BookItemConfig, TierConfig, PRESET_COZY_TIERS } from './bookshelf';
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
  presenceAllocation: PresenceAllocation;
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
export const ThreeWorld: React.FC<ThreeWorldProps> = ({
  sceneLayout = DEFAULT_SCENE_LAYOUT,
  focusRevision = 0,
  onDragGizmoBegin,
  onDragGizmoCancel,
  timeOfDay,
  people,
  presenceAllocation,
  activeRoom,
  unreadMailCount,
  onSelectPerson: selectPerson,
  onSelectMailbox: selectMailbox,
  onSelectRoom: requestRoom,
  onFireplaceClick,
  bookshelfPreset,
  onBookshelfClick: openBookshelf,
  onBookClick: selectBook,
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
  const currentLayout = roomLayout || cabinetLayout || DEFAULT_ROOM_LAYOUT;
  const effectiveGizmoId = isInspectorOpen ? activeGizmoId : null;
  const containerRef = useRef<HTMLDivElement>(null);

  // Active Wall Poster Modal State (右墙电影海报高清艺术展陈卡片)
  const [selectedPosterId, setSelectedPosterId] = useState<PosterId | null>(null);

  const { camera, isDragging, svgRef, hasMovedRef, pointerHandlers, zoomBy, restoreFocus } = useWorldCamera(activeRoom, sceneLayout, focusRevision, isInspectorOpen);

  const { hoveredObject, setHoveredObject, alienPulseEffect, alienTransmissionText, setAlienTransmissionText, sofaSquish, sofaThought, stoveColor, setStoveColor, triggerAlienSignal, triggerSofaSquish } = useWorldFeedback();

  const theme = COUNTRYSIDE_THEMES[timeOfDay] || COUNTRYSIDE_THEMES.afternoon;

  const interactionTiers = customBookshelfTiers ?? PRESET_COZY_TIERS;
  const dispatchInteraction = createInteractionDispatcher({
    focusRoom: requestRoom, selectPerson, openMailbox: selectMailbox, openBookshelf, selectBook,
    selectPoster: id => { setSelectedPosterId(id); onSelectPoster?.(id); },
    captureSignal: () => triggerAlienSignal(), selectFurniture: onSelectGizmo, fireplace: onFireplaceClick,
  }, { people, tiers: interactionTiers, editing: isInspectorOpen, activeFurniture: effectiveGizmoId });
  const onSelectRoom = (id: RoomId | 'overview') => dispatchInteraction({ kind: 'room', id });
  const onSelectPerson = (person: Person) => dispatchInteraction({ kind: 'person', id: person.id });
  const onSelectMailbox = () => dispatchInteraction({ kind: 'entity', id: 'mailbox' });
  const onBookshelfClick = () => dispatchInteraction({ kind: 'furniture-part', id: 'bookshelf-group' });
  const onBookClick = (book: BookItemConfig, tierIndex: number) => dispatchInteraction({ kind: 'book', id: book.id, tierIndex });

  const handleZoomIn = () => zoomBy(0.25);
  const handleZoomOut = () => zoomBy(-0.25);
  const handleResetOverview = () => { requestRoom('overview'); restoreFocus(); };

  // Dynamic Scene-based View Mapping for Character Presence
  const { slots: presenceSlots } = presenceAllocation;

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
      onKeyDownCapture={event => { if (event.key === 'Enter' || event.key === ' ') hasMovedRef.current = false; }}
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{
        touchAction: 'none',
        background: `linear-gradient(180deg, ${theme.skyTop} 0%, ${theme.skyBottom} 100%)`,
        transition: 'background 1.4s ease-in-out',
      }}
    >
      {/* Night Sky Stars */}
<AtmosphereOverlay theme={theme} />
      {/* 2.5D ANIME COUNTRYSIDE FULL-BLEED STAGE CONTAINER */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Main 2.5D Anime Landscape SVG (Full-bleed panoramic canvas permanently locked to viewport) */}
        <svg
          ref={svgRef}
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full pointer-events-auto"
        >
          <WorldDefs theme={theme} />

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
          <BackgroundLandscape theme={theme} setHoveredObject={setHoveredObject} onTriggerToast={onTriggerToast} />
<g id="hilltop-observatory-haven">
            {/* Mountain Ridge Wild Pines on the crest */}
            <DistantPines />

            {/* Main Elevated SETI Alien Radio Station (Moved to Right Meadow Lawn at Green Box Location) */}
            <SceneEntity entityId="observatory" layout={sceneLayout}
              id="room-observatory"
              onClick={() => {
                if (!hasMovedRef.current) onSelectRoom('observatory');
              }}
              {...svgAction('电波观测台')}
              onMouseEnter={() => setHoveredObject({ kind: 'room', id: 'observatory' })}
              onMouseLeave={() => setHoveredObject(null)}
              className="cursor-pointer group/observatory"
            >
  <ObservatoryHaven activeRoom={activeRoom} presenceSlots={presenceSlots} alienPulseEffect={alienPulseEffect}
    triggerAlienSignal={() => dispatchInteraction({ kind: 'entity', id: 'alien-receiver' })} onSelectPerson={onSelectPerson} setHoveredObject={setHoveredObject} />
</SceneEntity>
          </g>

          {/* ======================================================== */}
          {/* 2. THE COTTAGE HAVEN (NOW SITUATED ACROSS THE ROAD)       */}
          {/*    Surrounded by lawn, stone path & garden               */}
          {/* ======================================================== */}
          <SceneEntity entityId="main_cottage" layout={sceneLayout} id="living-cottage-haven">
<MainCottageHaven theme={theme} hasMovedRef={hasMovedRef} onSelectRoom={onSelectRoom} setHoveredObject={setHoveredObject} activeRoom={activeRoom} selfPerson={selfPerson} linPerson={linPerson} yuPerson={yuPerson} currentLayout={currentLayout} effectiveGizmoId={effectiveGizmoId} isInspectorOpen={isInspectorOpen} onSelectGizmo={onSelectGizmo} onDragGizmoDelta={onDragGizmoDelta} onDragGizmoEnd={onDragGizmoEnd} presenceSlots={presenceSlots} isChairEmptyOverride={isChairEmptyOverride} onOpenChairInspector={onOpenChairInspector} onToggleChairSeated={onToggleChairSeated} stoveColor={stoveColor} setStoveColor={setStoveColor} dispatchInteraction={dispatchInteraction} onSelectPerson={onSelectPerson} bookshelfPreset={bookshelfPreset} customBookshelfTiers={customBookshelfTiers} isLinReading={isLinReading} onBookshelfClick={onBookshelfClick} onBookClick={onBookClick} triggerSofaSquish={triggerSofaSquish} sofaSquish={sofaSquish} sofaThought={sofaThought} onSelectMailbox={onSelectMailbox} unreadMailCount={unreadMailCount} />
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
          <ForegroundLandscape theme={theme} setHoveredObject={setHoveredObject} onTriggerToast={onTriggerToast} />
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
<WorldOverlays handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} handleResetOverview={handleResetOverview} hoveredObject={hoveredObject} people={people} interactionTiers={interactionTiers} isInspectorOpen={isInspectorOpen} alienTransmissionText={alienTransmissionText} setAlienTransmissionText={setAlienTransmissionText} triggerAlienSignal={triggerAlienSignal} />
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
