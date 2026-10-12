import React from 'react';
import type { PresenceAllocation } from '../../features/presence/presenceAllocation';
import type { Person, RoomId } from '../../types';
import type { HoverTarget, InteractionTarget } from '../../world/interactions/interactionTypes';
import { svgAction } from '../../world/interactions/svgAction';
import { RoomHitArea } from '../../world/render/RoomSelection';
import { CastIronWoodStove, StoveColorVariant } from '../CastIronWoodStove';
import { CharacterHead } from '../CharacterAvatar';
import { NyankoSenseiCat } from '../NyankoSenseiCat';
import { ShibaInuPuppy } from '../ShibaInuPuppy';
import { LeftWallCraftBoard } from '../LeftWallCraftBoard';
import { BookItemConfig, Bookshelf, BookshelfPreset, TierConfig } from '../bookshelf';
import { RecordCabinet } from '../cabinet';
import { AtticDesk, WindsorChair } from '../desk';
import { EditableObjectId, IsoGizmo, RoomLayoutConfig } from '../layout-gizmo';
import { FiddleLeafFig, MonsteraPlant } from '../plants';
import type { YorkshireSceneTheme } from '../scenery/yorkshire/landscapeTypes';
import { WallPostersGallery } from '../wall-posters';
import { CottageFoundation, CottageGroundPlanting } from './CottageFoundation';
import { CottageRoofFraming } from './CottageRoofFraming';
import { CottageWallProfiles } from './CottageWallProfiles';
import { TimberFlooring } from './TimberFlooring';
export interface MainCottageHavenProps {
  theme: YorkshireSceneTheme;
  hasMovedRef: React.RefObject<boolean>;
  onSelectRoom: (id: RoomId | 'overview') => void;
  setHoveredObject: HoverTarget;
  selfPerson?: Person;
  linPerson?: Person;
  yuPerson?: Person;
  currentLayout: RoomLayoutConfig;
  effectiveGizmoId?: EditableObjectId | null;
  isInspectorOpen: boolean;
  onSelectGizmo?: (id: EditableObjectId | null) => void;
  onDragGizmoDelta?: (dx: number, dy: number) => void;
  onDragGizmoEnd?: () => void;
  presenceSlots: PresenceAllocation['slots'];
  isChairEmptyOverride: boolean;
  onOpenChairInspector?: () => void;
  onToggleChairSeated?: (seated?: boolean) => void;
  stoveColor: StoveColorVariant;
  setStoveColor: React.Dispatch<React.SetStateAction<StoveColorVariant>>;
  dispatchInteraction: (target: InteractionTarget) => void;
  onSelectPerson: (person: Person) => void;
  bookshelfPreset?: BookshelfPreset;
  customBookshelfTiers?: TierConfig[];
  isLinReading: boolean;
  onBookshelfClick: () => void;
  onBookClick: (book: BookItemConfig, tierIndex: number) => void;
  triggerSofaSquish: (event?: React.MouseEvent) => void;
  sofaSquish: boolean;
  sofaThought: string | null;
  onSelectMailbox: () => void;
  unreadMailCount: number;
  onTriggerToast?: (msg: string) => void;
}
function MainCottageHavenAsset({ theme, hasMovedRef, onSelectRoom, setHoveredObject, selfPerson, linPerson, yuPerson, currentLayout, effectiveGizmoId, isInspectorOpen, onSelectGizmo, onDragGizmoDelta, onDragGizmoEnd, presenceSlots, isChairEmptyOverride, onOpenChairInspector, onToggleChairSeated, stoveColor, setStoveColor, dispatchInteraction, onSelectPerson, bookshelfPreset, customBookshelfTiers, isLinReading, onBookshelfClick, onBookClick, triggerSofaSquish, sofaSquish, sofaThought, onSelectMailbox, unreadMailCount, onTriggerToast }: MainCottageHavenProps) {
  return <>
            {/* 2.5D Architectural Foundation, Ventilated Crawl Space & Porch Steps (工匠级建筑基底体系) */}
            <CottageFoundation theme={theme} />

            {/* 2.5D Artisan Hardwood Timber Flooring (工匠级实木企口地板与收边地袱大梁) */}
            <TimberFlooring />
            <CottageGroundPlanting />

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
              {/* Soft Puffy Marshmallow Clouds drifting into sky (与下方烟道严格对齐的柔美半透明慢速升腾水彩白云烟雾) */}
              <g id="chimney-smoke-drifts">
                <circle cx="0" cy="-58" r="4.5" fill="#f8fafc" opacity="0.65" className="animate-[pulse_3.2s_infinite]" />
                <circle cx="1.5" cy="-68" r="6.5" fill="#f8fafc" opacity="0.5" className="animate-[pulse_3.8s_infinite]" />
                <circle cx="-1" cy="-80" r="8.5" fill="#ffffff" opacity="0.32" />
                <circle cx="2" cy="-93" r="10.5" fill="#ffffff" opacity="0.18" />
              </g>
            </g>

            {/* 2.5D Heavy Timber Corner King Posts & Siding Cutaway Wall Profiles */}
            <CottageWallProfiles />

            {/* --- ROOM 1: MY ROOM (LEFT WING) - 我的阁楼书屋 (2.5D 重构) --- */}
            <g {...svgAction('我的田园阁楼书屋')}
              id="room-my_room"
              onClick={() => {
                if (!hasMovedRef.current) onSelectRoom('my_room');
              }}
              onMouseEnter={() => setHoveredObject({ kind: 'room', id: 'my_room' })}
              onMouseLeave={() => setHoveredObject(null)}
              className="cursor-pointer group"
            >
              {/* Invisible room floor hit area */}
              <RoomHitArea room="my_room" points="-270,135 -100,85 -40,130 -210,180" />

              {/* 1.1 2.5D ISOMETRIC WINDOW ON LEFT WALL (精致紧凑双拼木窗：收窄16%更具人文尺度，窗外地貌层次由近及远校正) */}
              <g id="isometric-bay-window">
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
                  <linearGradient id="cottageWindowVistaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.88" />
                    <stop offset="30%" stopColor="#dbeafe" stopOpacity="0.82" />
                    <stop offset="60%" stopColor="#fef08a" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#a3e635" stopOpacity="0.72" />
                  </linearGradient>
                </defs>
                <polygon
                  points="-219,34.5 -160,17.7 -160,58.5 -219,75.3"
                  fill="url(#cottageWindowVistaGrad)"
                />

                {/* 正确的约克郡风光地貌纵深层次： */}
                {/* 1. 远景：连绵起伏的黛青紫蓝群山微景 (Distant Yorkshire Dales) */}
                <path
                  d="M-219,45 Q-190,32 -160,38 L-160,46 Q-190,40 -219,47 Z"
                  fill="#7c92b8"
                  opacity="0.45"
                />
                {/* 2. 中景：层叠起伏的金黄麦浪丘陵与微缩石墙 (Rolling Wheat Fields) */}
                <path
                  d="M-219,47 Q-185,38 -160,44 L-160,52 Q-185,47 -219,53 Z"
                  fill="#eab308"
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
                  fill="#65a30d"
                  opacity="0.75"
                />
                {/* 草地野花小碎点 */}
                <circle cx="-195" cy="58" r="0.9" fill="#fef08a" opacity="0.8" />
                <circle cx="-175" cy="54" r="0.8" fill="#ffffff" opacity="0.8" />
                <circle cx="-205" cy="64" r="0.9" fill="#fef08a" opacity="0.8" />


                {/* Soft diagonal sunbeams on glass (通透玻璃高光与斜射晨光) */}
                <polygon points="-215,35 -202,31 -182,68 -195,72" fill="#ffffff" opacity="0.12" />
                <polygon points="-192,27 -181,24 -165,56 -176,59" fill="#ffffff" opacity="0.08" />

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
                  fill="#f5ede0"
                  stroke="#d5c8b5"
                  strokeWidth="0.8"
                />
                <ellipse cx="-222" cy="64" rx="3.2" ry="1.8" fill="#c47a4f" />

                {/* Sunlight Cast onto Timber Floor (从调整后的窗户自然倾泻在桌面与地面的暖金光斑) */}
                <polygon
                  points="-222,78.0 -158,59.7 -122,86.0 -192,106.0"
                  fill={theme.cottageGlow}
                  opacity="0.16"
                  className="pointer-events-none"
                />
              </g>

              {/* 1.12 墙面干花挂件：由暖炉移至左墙空白木板处 (x: -115, y: 32)，配原木挂钩，安全温馨 */}
              <g
                id="dried-herb-bouquet"
                transform="translate(-115, 32)"
                className="cursor-pointer group/herb select-none"
              >
                <title>倒挂风干香草束 · 散发着淡淡薰衣草与鼠尾草安神清香 🌿</title>
                <rect x="-8" y="-2" width="16" height="24" fill="transparent" />
                <ellipse cx="1.2" cy="1.6" rx="2.4" ry="1.4" fill="#1b120c" opacity="0.32" filter="url(#softShadow)" />
                <circle cx="0" cy="0" r="1.8" fill="#6b3e1f" stroke="#3b200e" strokeWidth="0.4" />
                <circle cx="-0.3" cy="-0.3" r="1.2" fill="#8f572b" />
                <circle cx="-0.6" cy="-0.6" r="0.5" fill="#d99b64" />
                <line x1="0" y1="0.5" x2="0" y2="3.2" stroke="#87603c" strokeWidth="0.8" strokeLinecap="round" />
                <path d="M0,2.6 C-2.4,1.4 -3.6,3.4 -1.2,3.6 C-0.3,3.5 0,3.0 0,2.6 Z" fill="#cbb396" stroke="#785536" strokeWidth="0.35" />
                <path d="M0,2.6 C2.4,1.4 3.6,3.4 1.2,3.6 C0.3,3.5 0,3.0 0,2.6 Z" fill="#cbb396" stroke="#785536" strokeWidth="0.35" />
                <circle cx="0" cy="2.7" r="0.9" fill="#8d623d" stroke="#5c381c" strokeWidth="0.3" />
                <path d="M-0.4,3.3 Q-2.0,5.8 -1.4,7.8" fill="none" stroke="#9a734c" strokeWidth="0.5" strokeLinecap="round" />
                <path d="M0.4,3.3 Q1.6,6.0 1.0,8.2" fill="none" stroke="#9a734c" strokeWidth="0.5" strokeLinecap="round" />
                <path d="M-0.4,3.5 Q-3.5,8 -4.8,14.5" fill="none" stroke="#5e754a" strokeWidth="0.65" strokeLinecap="round" />
                <path d="M0.4,3.5 Q3.5,8 4.6,14.5" fill="none" stroke="#5e754a" strokeWidth="0.65" strokeLinecap="round" />
                <path d="M0,3.5 Q-0.8,8.5 -0.6,15.5" fill="none" stroke="#556d43" strokeWidth="0.75" strokeLinecap="round" />
                <ellipse cx="-2.6" cy="6.8" rx="1.5" ry="1.0" transform="rotate(-30 -2.6 6.8)" fill="#789269" stroke="#48613d" strokeWidth="0.25" />
                <ellipse cx="2.6" cy="7.2" rx="1.5" ry="1.0" transform="rotate(30 2.6 7.2)" fill="#849e75" stroke="#48613d" strokeWidth="0.25" />
                {/* 薰衣草花穗 */}
                <g transform="translate(-4.8, 14)">
                  {[-3.5, -2.5, -1.5, -0.5, 0.5].map((oy, idx) => (
                    <circle key={`lav-l-${idx}`} cx="0" cy={oy} r="0.7" fill="#a78bfa" />
                  ))}
                  <circle cx="0" cy="1.2" r="0.6" fill="#7c3aed" />
                </g>
                <g transform="translate(4.5, 14)">
                  {[-3.5, -2.5, -1.5, -0.5, 0.5].map((oy, idx) => (
                    <circle key={`lav-r-${idx}`} cx="0" cy={oy} r="0.7" fill="#a78bfa" />
                  ))}
                  <circle cx="0" cy="1.2" r="0.6" fill="#7c3aed" />
                </g>
                {/* 雏菊花朵与麦穗 */}
                <circle cx="-1" cy="12" r="1.4" fill="#fefce8" />
                <circle cx="-1" cy="12" r="0.6" fill="#f59e0b" />
                <circle cx="1.5" cy="13.5" r="1.3" fill="#fefce8" />
                <circle cx="1.5" cy="13.5" r="0.5" fill="#f59e0b" />
                <ellipse cx="-0.5" cy="16.5" rx="0.9" ry="1.5" fill="#fde047" stroke="#d97706" strokeWidth="0.2" />
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
              <g {...svgAction('校准书桌整体')}
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
              <g {...svgAction('轻拂或校准龟背竹')}
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
                      setHoveredObject(hovered ? { kind: 'furniture-part', id: 'desk-monstera' } : null);
                    } else {
                      setHoveredObject(hovered ? { kind: 'furniture-part', id: 'desk-monstera' } : null);
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
            <g {...svgAction('暖炉起居角')}
              id="room-living_nook"
              onClick={() => {
                if (!hasMovedRef.current) onSelectRoom('living_nook');
              }}
              onMouseEnter={() => setHoveredObject({ kind: 'room', id: 'living_nook' })}
              onMouseLeave={() => setHoveredObject(null)}
              className="cursor-pointer group"
            >
              {/* 2.1 2.5D FREESTANDING CAST-IRON WOOD STOVE (经典铸铁柴火暖炉：支持2.5D轴测校准对齐与即时换色) */}
              <g {...svgAction('校准炉火位置')}
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
                    dispatchInteraction({ kind: 'furniture-part', id: 'wood-stove' });
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
              <g {...svgAction('校准休闲榻')}
                id="isometric-daybed"
                transform={`translate(${(currentLayout['daybed'].screen.x) + 14}, ${(currentLayout['daybed'].screen.y) + 4})`}
                onClick={(e) => {
                  if (isInspectorOpen) {
                    e.stopPropagation();
                    onSelectGizmo?.(effectiveGizmoId === 'daybed' ? null : 'daybed');
                  }
                }}
                className="cursor-pointer group/daybed"
                onMouseEnter={() => setHoveredObject({ kind: 'furniture-part', id: 'daybed' })}
                onMouseLeave={() => setHoveredObject(null)}
              >
                {/* 1. Floor Ambient Occlusion & Plinth Shadows (微内收满跨度地袱大梁投影：稳如泰山、扎实沉稳) */}
                <polygon
                  points="22,76 48,68 103,84 77,93"
                  fill="#1b120a"
                  opacity="0.25"
                  filter="url(#softShadow)"
                />
                {/* Plinth Base Footprint Contact Shadow (满跨度底座与地板严密咬合的接触深阴影) */}
                <polygon
                  points="25,79.4 76,93.7 99,87.4 48,73.1"
                  fill="#0e0704"
                  opacity="0.55"
                  filter="url(#softShadow)"
                />

                {/* 2. Full-Span Subtly Inset Timber Plinth Base (方案 1：日式微内收 2px 满跨度实木地袱大梁底座，力学绝对对称稳固) */}
                <g id="daybed-recessed-plinth-box">
                  {/* Plinth Left-Front Face (面向暖炉方向的侧立面：宽 22px，承托床头枕头区) */}
                  <polygon
                    points="48,67.6 26,73.9 26,79.4 48,73.1"
                    fill="#3d2314"
                    stroke="#25140b"
                    strokeWidth="0.5"
                    strokeLinejoin="round"
                  />
                  {/* Subtle Hearth Warmth Reflection */}
                  <polygon
                    points="48,67.6 26,73.9 26,79.4 48,73.1"
                    fill="#f59e0b"
                    opacity="0.10"
                  />

                  {/* Plinth Main Front Face (正前实木大立面：跨度达 50px 满跨度承重，仅左右各微内收 2px) */}
                  <polygon
                    points="26,73.9 76,88.2 76,93.7 26,79.4"
                    fill="#4e2e19"
                    stroke="#2c170c"
                    strokeWidth="0.5"
                    strokeLinejoin="round"
                  />

                  {/* Plinth Right Face (面向右墙的背光深木立面：宽 22px，承托床尾区) */}
                  <polygon
                    points="76,88.2 98,81.9 98,87.4 76,93.7"
                    fill="#2d180c"
                    stroke="#1c0d06"
                    strokeWidth="0.5"
                    strokeLinejoin="round"
                  />

                  {/* Plinth Reveal Shadow Line Under Bed Skirt (床架下沿精致的 1.5px 地袱倒角收口阴影线) */}
                  <line x1="26" y1="73.9" x2="76" y2="88.2" stroke="#1c0f07" strokeWidth="1.2" opacity="0.8" />
                  <line x1="76" y1="88.2" x2="98" y2="81.9" stroke="#150a04" strokeWidth="1.1" opacity="0.85" />
                  <line x1="48" y1="67.6" x2="26" y2="73.9" stroke="#1c0f07" strokeWidth="1.0" opacity="0.75" />

                  {/* Floor Contact Ground Crease Lines (底座接地扎实刻线) */}
                  <line x1="26" y1="79.4" x2="76" y2="93.7" stroke="#0e0704" strokeWidth="1.0" opacity="0.75" />
                  <line x1="76" y1="93.7" x2="98" y2="87.4" stroke="#0e0704" strokeWidth="1.0" opacity="0.75" />
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

                {/* 6. Leisure Elements on Tatami: Open Book for Afternoon Reading (榻席右前角随手翻开便携小说，留出中央空位避免挤压) */}
                <g id="tatami-book" transform="translate(62, 70)">
                  <ellipse cx="0" cy="2" rx="4.8" ry="2.4" fill="#2b3b2c" opacity="0.25" />
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

                {/* 8. Cozily Slipped-Off Straw Slippers on Timber Floor in Front of Daybed (挪出至床沿前地板整齐摆放的小草编拖鞋) */}
                <g id="daybed-slippers-front" transform="translate(40, 91)">
                  {/* Left Slipper */}
                  <ellipse cx="-4.5" cy="0.8" rx="4.0" ry="2.0" fill="#1b120a" opacity="0.35" filter="url(#softShadow)" />
                  <ellipse cx="-4.5" cy="0" rx="3.6" ry="1.8" fill="#c4aa7f" stroke="#8a6e4d" strokeWidth="0.4" />
                  <ellipse cx="-4.5" cy="0" rx="2.8" ry="1.2" fill="#d9c298" opacity="0.6" />
                  <path d="M-6.8,-0.2 C-6.8,-2.4 -2.2,-2.4 -2.2,-0.2" fill="#523824" stroke="#382416" strokeWidth="0.5" />

                  {/* Right Slipper (并排稍错开半步，自然生活化) */}
                  <ellipse cx="4.0" cy="2.8" rx="4.0" ry="2.0" fill="#1b120a" opacity="0.35" filter="url(#softShadow)" />
                  <ellipse cx="4.0" cy="2.0" rx="3.6" ry="1.8" fill="#c4aa7f" stroke="#8a6e4d" strokeWidth="0.4" />
                  <ellipse cx="4.0" cy="2.0" rx="2.8" ry="1.2" fill="#d9c298" opacity="0.6" />
                  <path d="M1.7,1.8 C1.7,-0.4 6.3,-0.4 6.3,1.8" fill="#523824" stroke="#382416" strokeWidth="0.5" />
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
              <g {...svgAction('校准咖啡黑胶柜')}
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


              {/* 2.3 2.5D ISOMETRIC WOVEN TATAMI HEARTH RUG (扩建28%温润大织毯：完全契合等轴测±0.2852轴线，充实中央生活区) */}
              <g id="isometric-hearth-rug">
                {/* Floor Contact Soft Ambient Shadow */}
                <polygon
                  points="-87,130 12,101.5 111,130 12,158.5"
                  fill="#1f140b"
                  opacity="0.25"
                  filter="url(#softShadow)"
                />

                {/* Outer Dark Linen Border (深咖色外滚边：严格平行于左右墙轴线) */}
                <polygon
                  points="-83,130 12,102.9 107,130 12,157.1"
                  fill="#785c41"
                  stroke="#543d28"
                  strokeWidth="1.2"
                />

                {/* Main Woven Straw / Linen Surface (暖亚麻麦秆编织面：扩大包裹茶几与坐垫生活区) */}
                <polygon
                  points="-79,130 12,104.0 103,130 12,156.0"
                  fill="#ded4bf"
                  stroke="#c5b9a0"
                  strokeWidth="0.8"
                />

                {/* Inner Double Inset Border (精致内双框虚线工艺) */}
                <polygon
                  points="-68,130 12,107.1 92,130 12,152.9"
                  fill="none"
                  stroke="#8f7253"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  opacity="0.75"
                />

                {/* Inner Medallion Border (中央核心区精致菱形织纹内框) */}
                <polygon
                  points="-54,130 12,111.1 78,130 12,148.9"
                  fill="none"
                  stroke="#b09b82"
                  strokeWidth="0.6"
                  opacity="0.6"
                />

                {/* 2.35 Cozy Sleeping Nyanko-Sensei Cat in Bed (夏目友人帐 · 猫咪老师与日式软垫猫窝：无红纹纯净白脸、前额双色斑块、红项圈小金铃铛、软糯猫窝) */}
                {(() => {
                  const catScreenX = currentLayout['hearth-cat'] ? currentLayout['hearth-cat'].screen.x : -46.0;
                  const catScreenY = currentLayout['hearth-cat'] ? currentLayout['hearth-cat'].screen.y : 134.0;
                  return (
                    <NyankoSenseiCat
                      x={catScreenX}
                      y={catScreenY}
                      isInspectorOpen={isInspectorOpen}
                      effectiveGizmoId={effectiveGizmoId}
                      onSelectGizmo={onSelectGizmo}
                      onDragGizmoDelta={onDragGizmoDelta}
                      onDragGizmoEnd={onDragGizmoEnd}
                      onTriggerToast={onTriggerToast}
                      setHoveredObject={setHoveredObject}
                    />
                  );
                })()}
              </g>

              {/* 2.4 2.5D SOLID WOOD ELEVATED LOW TEA TABLE (日式原木圆矮茶几：重构真实三维离地高度、外八实木腿、桌底通透结构与标准圆柱厚度立面) */}
              <g {...svgAction('校准茶桌')}
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

                {/* 6. Tea Service Set (精准轴测椭圆长短轴比、立体实木茶盘、青瓷急须壶、品茗杯与茶点) */}
                <g id="tea-set">
                  {/* Tea Tray Contact Ambient Occlusion Shadow on Wooden Tabletop (茶盘与茶桌的微暗贴合阴影，彻底消除悬浮) */}
                  <ellipse cx="-2" cy="-7.0" rx="14.8" ry="6.2" fill="#2e1a0b" opacity="0.35" filter="url(#softShadow)" />

                  {/* Solid Walnut Tea Tray (实木小茶盘底托：严格锁定等轴椭圆比，消除俯视畸变) */}
                  <ellipse cx="-2" cy="-7.5" rx="14" ry="5.8" fill="#4d3018" stroke="#361f0e" strokeWidth="0.5" />
                  <ellipse cx="-2" cy="-8.0" rx="13.2" ry="5.4" fill="#694324" />
                  <path d="M-14,-7.8 A 14 5.8 0 0 0 10,-7.8" stroke="#8a5c36" strokeWidth="0.6" fill="none" opacity="0.55" />

                  {/* Kyusu Teapot (立体青瓷侧把急须茶壶：精准轴测长短轴) */}
                  <ellipse cx="-6" cy="-8.2" rx="4.8" ry="2.0" fill="#2d1b0d" opacity="0.35" />
                  <path d="M-10.8,-10.5 L-10.8,-8.5 A 4.8 2.0 0 0 0 -1.2,-8.5 L-1.2,-10.5 A 4.8 2.0 0 1 -10.8,-10.5 Z" fill="#324c31" />
                  <ellipse cx="-6" cy="-10.5" rx="4.8" ry="2.0" fill="#466944" stroke="#5d8a5a" strokeWidth="0.5" />
                  <ellipse cx="-6" cy="-11.2" rx="3" ry="1.2" fill="#558053" />
                  <circle cx="-6" cy="-12" r="0.85" fill="#f59e0b" />
                  <path d="M-10.8,-9.5 Q-13.5,-10.5 -13.5,-12" stroke="#466944" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                  <path d="M-9.5,-10.5 C-9.5,-17 -2.5,-17 -2.5,-10.5" stroke="#b45309" strokeWidth="1.3" fill="none" />
                  {/* Rising Tea Steam from Kyusu Spout (自急须壶嘴口袅袅升起) */}
                  <path d="M-13.5,-13.0 C-15.5,-16.5 -13.5,-19.5 -15.0,-23.5" stroke="#ffffff" strokeWidth="1.0" strokeLinecap="round" fill="none" opacity="0.75" className="animate-[pulse_1.8s_infinite]" />

                  {/* Ceramic Teacups (白瓷品茗杯：底面与杯口严格统一为 0.42 轴测扁平椭圆) */}
                  {/* Cup 1 (Host Cup) */}
                  <ellipse cx="2.2" cy="-7.6" rx="2.4" ry="1.0" fill="#2d1b0d" opacity="0.32" />
                  <path d="M-0.2,-9.2 L-0.2,-7.8 A 2.4 1.0 0 0 0 4.6,-7.8 L4.6,-9.2 A 2.4 1.0 0 1 -0.2,-9.2 Z" fill="#dedad2" />
                  <ellipse cx="2.2" cy="-9.2" rx="2.4" ry="1.0" fill="#fcfbf7" stroke="#e2ded4" strokeWidth="0.4" />
                  <ellipse cx="2.2" cy="-9.4" rx="1.8" ry="0.75" fill="#4d7c0f" />

                  {/* Cup 2 (Guest Cup) */}
                  <ellipse cx="7.0" cy="-4.8" rx="2.4" ry="1.0" fill="#2d1b0d" opacity="0.32" />
                  <path d="M4.6,-6.4 L4.6,-5.0 A 2.4 1.0 0 0 0 9.4,-5.0 L9.4,-6.4 A 2.4 1.0 0 1 4.6,-6.4 Z" fill="#dedad2" />
                  <ellipse cx="7.0" cy="-6.4" rx="2.4" ry="1.0" fill="#fcfbf7" stroke="#e2ded4" strokeWidth="0.4" />
                  <ellipse cx="7.0" cy="-6.6" rx="1.8" ry="0.75" fill="#4d7c0f" />

                  {/* Wagashi Sweets Plate (和果子茶点小碟：轴测比校准) */}
                  <ellipse cx="-2" cy="-3.0" rx="3.6" ry="1.5" fill="#f5f0e8" stroke="#dbd3c5" strokeWidth="0.5" />
                  <ellipse cx="-2.8" cy="-3.3" rx="1.2" ry="0.6" fill="#f472b6" />
                  <ellipse cx="-1.1" cy="-3.1" rx="1.1" ry="0.6" fill="#84cc16" />
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
                  <g {...svgAction('查看人物状态')}
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
                        setHoveredObject({ kind: 'person', id: person.id });
                      } else {
                        setHoveredObject({ kind: 'furniture-part', id: gizmoKey });
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
            <g {...svgAction('进入林木的书房')}
              id="room-friend_room"
              onClick={() => {
                if (!hasMovedRef.current) onSelectRoom('friend_room');
              }}
              onMouseEnter={() => setHoveredObject({ kind: 'room', id: 'friend_room' })}
              onMouseLeave={() => setHoveredObject(null)}
              className="cursor-pointer group"
            >
              {/* Invisible room floor hit area */}
              <RoomHitArea room="friend_room" points="40,130 100,85 270,135 210,180" />

              {/* 3.0 2.5D HARMONIOUS RIGHT WALL ART GALLERY (全新右墙艺术海报三联组：《泳者之心》+《还有明天》+《红辣椒》) */}
              <g {...svgAction('校准右墙海报组')}
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
                      dispatchInteraction({ kind: 'poster', id });
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
              <g {...svgAction('校准书架整体')}
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
                  onHoverObject={(text) => setHoveredObject(text)}
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
              <g {...svgAction('isometric-houseplant')}
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
                      setHoveredObject(hovered ? { kind: 'furniture-part', id: 'fiddle-plant' } : null);
                    } else {
                      setHoveredObject(hovered ? { kind: 'furniture-part', id: 'fiddle-plant' } : null);
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
              <g {...svgAction('捏一捏懒人沙发')}
                id="isometric-lazy-sofa"
                transform={`translate(${currentLayout['lazy-sofa'].screen.x}, ${currentLayout['lazy-sofa'].screen.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerSofaSquish();
                  if (isInspectorOpen) {
                    onSelectGizmo?.(effectiveGizmoId === 'lazy-sofa' ? null : 'lazy-sofa');
                  }
                }}
                onMouseEnter={() => setHoveredObject({ kind: 'furniture-part', id: 'lazy-sofa' })}
                onMouseLeave={() => setHoveredObject(null)}
                className="cursor-pointer group/sofa"
              >
                {/* 1. Floor Shadow & Hand-Braided Jute & Wool Oval Rug (复古粗纺双色麻毛编织圆毯：厚重扎实，连续锁边与柔和编织毛边) */}
                <ellipse cx="0" cy="12" rx="19" ry="8.5" fill="#1b120c" opacity="0.28" filter="url(#softShadow)" />
                {/* 暖燕麦黄麻厚实底毯 */}
                <ellipse cx="0" cy="11" rx="21" ry="9.8" fill="#d9cbba" stroke="#b5a18a" strokeWidth="0.9" />
                {/* 外缘连续细腻手工锁边滚边 (Continuous Artisan Overlock Stitch Band，消除孤零牙签碎刺) */}
                <ellipse cx="0" cy="11" rx="20.2" ry="9.2" fill="none" stroke="#9e8469" strokeWidth="0.8" strokeDasharray="2 1.5" opacity="0.85" />
                {/* 焦糖粗纺同心螺旋经纬压缝线 */}
                <ellipse cx="0" cy="11" rx="16.5" ry="7.6" fill="none" stroke="#876747" strokeWidth="0.75" strokeDasharray="3 2" opacity="0.75" />
                <ellipse cx="0" cy="11" rx="12.5" ry="5.6" fill="none" stroke="#6e5033" strokeWidth="0.65" strokeDasharray="2.5 1.8" opacity="0.65" />
                {/* 前缘平整细腻的微织羊毛贴边小裙带 (Dense Soft Woven Wool Hem Accent) */}
                <path
                  d="M -16,17.2 Q 0,21.8 16,17.2"
                  stroke="#ab9680"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.8"
                />
                <path
                  d="M -14,18.0 Q 0,22.4 14,18.0"
                  stroke="#7c634c"
                  strokeWidth="0.5"
                  strokeDasharray="1.5 1.5"
                  fill="none"
                  opacity="0.65"
                />

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
                  <g {...svgAction('查看人物状态')}
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
                        setHoveredObject({ kind: 'furniture-part', id: 'lazy-sofa' });
                      } else {
                        e.stopPropagation();
                        setHoveredObject({ kind: 'person', id: sofaOccupant.id });
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
                      <g transform="translate(0, -50)"><g  className="pointer-events-none animate-bounce">
                        <rect x="-70" y="-9" width="140" height="18" rx="9" fill="#292524" stroke="#e28547" strokeWidth="0.8" opacity="0.96" />
                        <polygon points="0,9 -3,13 3,9" fill="#292524" />
                        <text x="0" y="3" fill="#fed7aa" fontSize="7.5" fontWeight="medium" textAnchor="middle">
                          {sofaThought}
                        </text>
                      </g></g>
                    )}
                  </g>
                );
              })()}
            </g>

            {/* --- FRONT VERANDA & PORCH (前廊、中华田园小黄狗软窝与信箱) --- */}
            <g id="front-veranda-features">
              {/* Sleeping Chinese Rural Dog in Woven Pet Bed (前廊软窝打盹的中华田园犬大黄狗) */}
              <ShibaInuPuppy
                x={currentLayout['shiba-inu'].screen.x}
                y={currentLayout['shiba-inu'].screen.y}
                isInspectorOpen={isInspectorOpen}
                effectiveGizmoId={effectiveGizmoId}
                onSelectGizmo={onSelectGizmo}
                onDragGizmoDelta={onDragGizmoDelta}
                onDragGizmoEnd={onDragGizmoEnd}
                onTriggerToast={onTriggerToast}
                setHoveredObject={setHoveredObject}
              />

              {/* 🌟 WOODEN MAILBOX (门口草地迎客美式木信箱) */}
              <g {...svgAction('前廊木信箱')}
                id="mailbox-group"
                transform="translate(58, 246)"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMailbox();
                }}
                onMouseEnter={() => setHoveredObject({ kind: 'entity', id: 'mailbox' })}
                onMouseLeave={() => setHoveredObject(null)}
                className="cursor-pointer group/mail"
              >
                {/* 1. 扎入草坪的深层漫反射阴影 (Ground Contact Shadow on Lawn) */}
                <ellipse cx="0" cy="1" rx="14" ry="5.5" fill="#1b2e17" opacity="0.45" filter="url(#softShadow)" />

                {/* 2. 迎客草台天然凿刻石柱础基座 (Chiseled Granite Plinth Footing) */}
                <polygon
                  points="-7,-1.5 0,-3.5 7,-1.5 7,1.5 0,3.5 -7,1.5"
                  fill="#524a40"
                  stroke="#373129"
                  strokeWidth="0.6"
                />
                <polygon
                  points="-7,-1.5 0,-3.5 7,-1.5 0,0.5"
                  fill="#786e63"
                />

                {/* 3. 伴生在石础边的一簇天然嫩草丝与小雏菊 (Natural Meadow Verge Sprouting) */}
                <path d="M-8,1 Q-11,-3 -13,-7 M-6,1 Q-8,-3 -9,-6" stroke="#486d26" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                <path d="M6,1 Q9,-2 11,-5 M8,1 Q10,-1 11,-3" stroke="#486d26" strokeWidth="0.75" fill="none" strokeLinecap="round" />
                <circle cx="-13" cy="-7" r="1.5" fill="#ffffff" />
                <circle cx="-13" cy="-7" r="0.6" fill="#facc15" />

                {/* 4. 稳固挺拔的防腐雪松原木立柱 (Weathered Cedar Timber Post) */}
                <rect x="-3.5" y="-36" width="7" height="36" rx="1" fill="#523924" stroke="#332113" strokeWidth="0.6" filter="url(#softShadow)" />
                <line x1="-1.8" y1="-35" x2="-1.8" y2="-1" stroke="#7d5939" strokeWidth="0.6" opacity="0.8" />
                <line x1="1.8" y1="-35" x2="1.8" y2="-1" stroke="#362214" strokeWidth="0.5" opacity="0.6" />

                {/* 木立柱顶端加固三角托臂 (Corbel Bracket Under Box) */}
                <polygon points="-5,-34 5,-34 3,-30 -3,-30" fill="#422c1b" />
                <path d="M0,-30 Q-2,-26 -5,-26 L-5,-24 Q0,-24 0,-28 Z" fill="#422c1b" />

                {/* 5. 经典美式圆拱乡村木质信箱 (Curved Roof Mailbox Compartment) */}
                <g transform="translate(0, -44)">
                  <rect x="-13" y="-11" width="26" height="18" rx="5" fill="#3d2c1d" stroke="#261b11" strokeWidth="0.6" />
                  <ellipse cx="-13" cy="-2" rx="4" ry="9" fill="#2c1e13" />
                  <path d="M-13,-11 Q0,-19 13,-11 L13,-7 Q0,-15 -13,-7 Z" fill="#694f3b" />
                  <circle cx="-14" cy="-2" r="2.5" fill="#e6b35a" stroke="#876326" strokeWidth="0.5" />

                  {/* 旋转可动投递提示小红旗 (Swinging Red Postal Flag: 有信时端正竖起) */}
                  <g
                    style={{
                      transform: unreadMailCount > 0 ? 'rotate(0deg)' : 'rotate(85deg)',
                      transformOrigin: '12px 0px',
                      transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  >
                    <rect x="12" y="-16" width="3" height="18" rx="1" fill="#c43b2f" />
                    <polygon points="12,-16 0,-9.5 12,-3" fill="#e04a3d" />
                    <circle cx="13.5" cy="-1" r="1.2" fill="#f59e0b" />
                  </g>

                  {/* 门缝微露带火漆封印的微光羊皮纸信角 (Peeked Sealed Letter Corner) */}
                  {unreadMailCount > 0 && (
                    <g id="mailbox-peek-letter" transform="translate(-15, -4)">
                      <polygon points="-3,-5 5,-2 4,3 -4,0" fill="#fefce8" stroke="#ca8a04" strokeWidth="0.4" />
                      <circle cx="0.5" cy="-1" r="1.2" fill="#dc2626" />
                    </g>
                  )}

                  {/* 悬停微光晕 */}
                  <ellipse cx="0" cy="8" rx="18" ry="9" fill="rgba(217, 119, 6, 0.2)" className="opacity-0 group-hover/mail:opacity-100 transition-opacity pointer-events-none" />

                  {/* 前廊真实木信箱上的质朴自然木牌提示 (彻底消除室内刺眼红胶囊) */}
                  {unreadMailCount > 0 && (
                    <g transform="translate(0, -28)">
                      <g className="animate-[pulse_2.8s_infinite]">
                        <rect x="-32" y="-8.5" width="64" height="17" rx="8.5" fill="#2d1c10" stroke="#d97706" strokeWidth="0.8" opacity="0.95" filter="url(#softShadow)" />
                        <text x="0" y="3.5" fill="#fef3c7" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                          📬 新信件 ({unreadMailCount})
                        </text>
                      </g>
                    </g>
                  )}
                </g>
              </g>
            </g>
          
  </>;
}

export const MainCottageHaven = React.memo(MainCottageHavenAsset);
