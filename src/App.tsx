import { useToast } from './features/feedback/useToast';
import { usePresenceState } from './features/presence/usePresenceState';
import { useMailbox } from './features/mailbox/useMailbox';
import { useBookshelf } from './features/bookshelf/useBookshelf';
import { useLayoutEditor } from './features/layout-editor/useLayoutEditor';
/**
 * Live With Me
 * 低打扰陪伴空间 · Presence without conversation
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TimeOfDay, Person, RoomId, MailLetter, LifeStateId, LivingMemory } from './types';
import { INITIAL_PEOPLE, INITIAL_LETTERS, INITIAL_MEMORIES, LIFE_STATES, ROOMS } from './data/initialData';
import { ThreeWorld } from './components/ThreeWorld';
import { AtmosphereBar } from './components/AtmosphereBar';
import { PresencePanel } from './components/PresencePanel';
import { MailboxModal } from './components/MailboxModal';
import { StatusPickerModal } from './components/StatusPickerModal';
import { SvgExportModal } from './components/SvgExportModal';
import { FriendCardModal } from './components/FriendCardModal';
import { MemoryLogModal } from './components/MemoryLogModal';
import {
  BookshelfModal,
  BookshelfPreset,
  BookItemConfig,
  ShelfDecorationConfig,
  TierConfig,
  PRESET_COZY_TIERS,
  PRESET_READING_LIN_TIERS,
  PRESET_EMPTY_TIERS,
  PRESET_PACKED_TIERS,
  PRESET_BOTANICAL_TIERS,
} from './components/bookshelf';
import { ambientAudio } from './audio/ambientAudio';
import { Sparkles, Info, X } from 'lucide-react';
import { ChairInspectionModal } from './components/desk';
import {
  RoomLayoutConfig,
  EditableObjectId,
  DEFAULT_ROOM_LAYOUT,
  loadSavedRoomLayout,
  saveRoomLayout,
  clearSavedRoomLayout,
  LayoutInspectorPanel,
} from './components/layout-gizmo';

import { resolvePresenceSlots } from './features/presence/presenceAllocation';

export default function App() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
  const [memories, setMemories] = useState<LivingMemory[]>(INITIAL_MEMORIES);
  const [activeRoom, setRoom] = useState<RoomId | 'overview'>('overview');
  const [focusRevision, setFocusRevision] = useState(0);
  const setActiveRoom = (room: RoomId | 'overview') => { setRoom(room); setFocusRevision(value => value + 1); };

  // Modals
  const [isMailboxOpen, setIsMailboxOpen] = useState(false);
  const [isStatusPickerOpen, setIsStatusPickerOpen] = useState(false);
  const [isSvgExportOpen, setIsSvgExportOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);
  const [showManifesto, setShowManifesto] = useState(false);
  const { toastMessage, triggerToast } = useToast();

  // 电脑桌椅子状态管理 (空椅态 vs 小人组合态)
  const [isChairModalOpen, setIsChairModalOpen] = useState(false);
  const [isChairEmptyOverride, setIsChairEmptyOverride] = useState(false);

  const handleToggleChairSeated = (nextSeated?: boolean) => {
    const nextVal = nextSeated !== undefined ? !nextSeated : !isChairEmptyOverride;
    setIsChairEmptyOverride(nextVal);
    triggerToast(nextVal ? '🪑 已切换为【空椅子态】：清晰查看白橡木温莎椅的坐垫、木纹与朝向桌案的靠背' : '💻 已切换为【小人组合态】：小人就座敲代码，后背自然贴合温莎梳背');
  };

  // Bookshelf state
  const [isBookshelfModalOpen, setIsBookshelfModalOpen] = useState(false);
  const { people, presenceAllocation, saveStatus: handleSaveMyStatus } = usePresenceState(triggerToast);
  const { letters, unreadCount, sendLetter: handleSendLetter, markRead: handleMarkLetterRead } = useMailbox(people, memory => setMemories(previous => [memory, ...previous]), triggerToast);
  const { bookshelfPreset, customBookshelfTiers, selectedBookshelfItem, setSelectedBookshelfItem, handleSelectBookshelfPreset, handleToggleBookPulled, handleAddCustomBook } = useBookshelf(triggerToast);

  // Send quick gift from friend card
  const handleSendQuickGift = (friendId: string, giftType: 'coffee' | 'plant') => {
    const recipient = people.find((p) => p.id === friendId);
    if (!recipient) return;

    handleSendLetter({
      fromId: 'self',
      fromName: '我',
      toId: friendId,
      content:
        giftType === 'coffee'
          ? '路过起居室，顺便给你门前的几案上放了一杯刚煮好的温热咖啡。不用回，慢慢喝。'
          : '在窗台转角给你添置了一小盆水润的多肉，放在光线柔和的地方。',
      gift: giftType,
      type: 'gift',
    });
    ambientAudio.playGentleChime();
  };

  // Bookshelf handlers
  const {roomLayout,activeGizmoId,setActiveGizmoId,isLayoutInspectorOpen,setIsLayoutInspectorOpen,
    updatePosition:handleUpdateLayoutPosition,dragDelta:handleDragGizmoDelta,
    beginDrag,commitDrag,cancelDrag,reset:handleResetLayoutDefaults} = useLayoutEditor(triggerToast);

  useEffect(() => () => ambientAudio.dispose(), []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#141210] font-sans">
      {/* 1. Top Atmosphere Bar (Time presets, ambient sound mixer, mailbox icon) */}
      <AtmosphereBar
        timeOfDay={timeOfDay}
        onChangeTime={(t) => {
          setTimeOfDay(t);
          if (t === 'rainy') {
            ambientAudio.setRainVolume(0.6);
          }
        }}
        activeRoom={activeRoom}
        onSelectRoom={setActiveRoom}
        unreadMailCount={unreadCount}
        onOpenMailbox={() => setIsMailboxOpen(true)}
        onOpenMemories={() => setIsMemoriesOpen(true)}
        onOpenBookshelf={() => setIsBookshelfModalOpen(true)}
      />

      {/* 2. Floating Presence Panel (Left corner: Me + Friends state in house) */}
      <PresencePanel
        allocation={presenceAllocation}
        people={people}
        onSelectPerson={(p) => setSelectedPerson(p)}
        onEditMyStatus={() => setIsStatusPickerOpen(true)}
        onOpenSvgExport={() => setIsSvgExportOpen(true)}
        onOpenChairInspector={() => setIsChairModalOpen(true)}
      />

      {/* 3. Stylized Cozy 2.5D Layered World */}
      <div className="absolute inset-0 z-0">
        <ThreeWorld
          timeOfDay={timeOfDay}
          presenceAllocation={presenceAllocation}
          people={people}
          activeRoom={activeRoom}
          focusRevision={focusRevision}
          unreadMailCount={unreadCount}
          onSelectPerson={(p) => {
            if (p.isSelf) {
              setIsStatusPickerOpen(true);
            } else {
              setSelectedPerson(p);
            }
          }}
          onSelectMailbox={() => setIsMailboxOpen(true)}
          onSelectRoom={setActiveRoom}
          bookshelfPreset={bookshelfPreset}
          customBookshelfTiers={customBookshelfTiers}
          onBookshelfClick={() => setIsBookshelfModalOpen(true)}
          onBookClick={(book) => {
            setSelectedBookshelfItem({ type: 'book', item: book });
            setIsBookshelfModalOpen(true);
          }}
          roomLayout={roomLayout}
          isInspectorOpen={isLayoutInspectorOpen}
          activeGizmoId={isLayoutInspectorOpen ? activeGizmoId : null}
          onSelectGizmo={(id) => {
            if (isLayoutInspectorOpen) {
              setActiveGizmoId(id);
            }
          }}
          onDragGizmoDelta={handleDragGizmoDelta}
          onDragGizmoBegin={beginDrag}
          onDragGizmoEnd={commitDrag}
          onDragGizmoCancel={cancelDrag}
          isChairEmptyOverride={isChairEmptyOverride}
          onToggleChairSeated={handleToggleChairSeated}
          onOpenChairInspector={() => setIsChairModalOpen(true)}
          onTriggerToast={triggerToast}
        />
      </div>

      {/* 3.5 2.5D 全屋轴测拖拽对齐校准面板 */}
      <LayoutInspectorPanel
        layout={roomLayout}
        activeId={isLayoutInspectorOpen ? activeGizmoId : null}
        onSelectObject={setActiveGizmoId}
        onUpdatePosition={handleUpdateLayoutPosition}
        onResetDefaults={handleResetLayoutDefaults}
        isOpen={isLayoutInspectorOpen}
        isChairEmpty={isChairEmptyOverride}
        onToggleChairSeated={handleToggleChairSeated}
        onOpenChairInspector={() => setIsChairModalOpen(true)}
        onToggleOpen={() => {
          setIsLayoutInspectorOpen((prev) => {
            const next = !prev;
            if (!next) {
              setActiveGizmoId(null);
            }
            return next;
          });
        }}
      />

      {/* 4. Philosophy Badge / Manifesto (Dismissible subtle note) */}
      {showManifesto && (
        <aside aria-label="设计初心" className="fixed bottom-16 right-5 z-20 pointer-events-auto max-w-xs">
          <div className="p-3.5 rounded-2xl bg-[#1e1c19]/85 backdrop-blur-md border border-[#3c342d] shadow-xl text-xs text-[#cfc5b6] space-y-1.5">
            <div className="flex items-center justify-between text-[#e8ded0]">
              <span className="font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d68c68]" />
                Live With Me 的初心
              </span>
              <button
                onClick={() => setShowManifesto(false)}
                className="text-[#8a7f72] hover:text-[#e8ded0]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-[#9c9183] leading-relaxed">
              不是 Todo、Pomodoro 或自习室，而是少数亲近朋友安静生活的线上小世界。
            </p>
            <div className="pt-1 text-[11px] text-[#c49a6c] font-serif italic border-t border-[#312a24]">
              “Presence without conversation —— 今天在生活。”
            </div>
          </div>
        </aside>
      )}

      {/* 5. Quiet Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in duration-200">
          <div className="px-4 py-2 rounded-full bg-[#27221e] border border-[#524538] text-xs text-[#f2ece2] shadow-2xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d68c68]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 6. Mailbox Modal (Iconic core product symbol) */}
      <MailboxModal
        isOpen={isMailboxOpen}
        onClose={() => setIsMailboxOpen(false)}
        letters={letters}
        people={people}
        currentUserId="self"
        onSendLetter={handleSendLetter}
        onMarkAsRead={handleMarkLetterRead}
      />

      {/* 7. Life State Picker Modal */}
      {isStatusPickerOpen && (() => {
        const selfPerson = people.find((p) => p.isSelf);
        return (
          <StatusPickerModal
            isOpen={isStatusPickerOpen}
            people={people}
            personId={selfPerson?.id || 'self'}
            onClose={() => setIsStatusPickerOpen(false)}
            currentState={selfPerson?.currentState || 'coding'}
            currentRoom={selfPerson?.currentRoom || 'my_room'}
            stateNote={selfPerson?.stateNote}
            initialAppearance={{
              skinColor: selfPerson?.skinColor,
              beanieColor: selfPerson?.beanieColor,
              hairColor: selfPerson?.hairColor,
              hairStyle: selfPerson?.hairStyle,
              shirtColor: selfPerson?.shirtColor,
              hasPompom: selfPerson?.hasPompom,
            }}
            onSaveStatus={handleSaveMyStatus}
          />
        );
      })()}

      {/* 8. Friend Presence Details Modal */}
      {selectedPerson && (
        <FriendCardModal
          isOpen={!!selectedPerson}
          onClose={() => setSelectedPerson(null)}
          person={selectedPerson}
          onOpenMailboxToFriend={(friendId) => {
            setIsMailboxOpen(true);
          }}
          onSendQuickGift={handleSendQuickGift}
        />
      )}

      {/* 9. Shared Memories Modal */}
      <MemoryLogModal
        isOpen={isMemoriesOpen}
        onClose={() => setIsMemoriesOpen(false)}
        memories={memories}
      />

      {/* 10. Modular Bookshelf System Modal */}
      <BookshelfModal
        isOpen={isBookshelfModalOpen}
        onClose={() => {
          setIsBookshelfModalOpen(false);
          setSelectedBookshelfItem(null);
        }}
        activePreset={bookshelfPreset}
        onSelectPreset={handleSelectBookshelfPreset}
        tiers={customBookshelfTiers}
        onToggleBookPulled={handleToggleBookPulled}
        onAddBook={handleAddCustomBook}
        selectedItem={selectedBookshelfItem}
      />

      {/* 11. 4-View SVG Export Modal */}
      <SvgExportModal
        isOpen={isSvgExportOpen}
        onClose={() => setIsSvgExportOpen(false)}
      />

      {/* 12. 电脑桌工位座椅透视与就座组合态检视弹窗 */}
      <ChairInspectionModal
        isOpen={isChairModalOpen}
        onClose={() => setIsChairModalOpen(false)}
        isSeatedInRoom={!isChairEmptyOverride}
        onToggleSeatedInRoom={(seated) => {
          setIsChairEmptyOverride(!seated);
          triggerToast(seated ? '💻 已应用【小人组合态】' : '🪑 已应用【空椅子态】');
        }}
        currentPerson={people.find((p) => p.isSelf)}
      />
    </main>
  );
}
