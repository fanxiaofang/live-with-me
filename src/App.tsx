/**
 * Live With Me
 * 低打扰陪伴空间 · Presence without conversation
 */

import React, { useState, useEffect } from 'react';
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
import {
  RoomLayoutConfig,
  EditableObjectId,
  DEFAULT_ROOM_LAYOUT,
  loadSavedRoomLayout,
  saveRoomLayout,
  clearSavedRoomLayout,
  LayoutInspectorPanel,
} from './components/layout-gizmo';

export default function App() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
  const [people, setPeople] = useState<Person[]>(INITIAL_PEOPLE);
  const [letters, setLetters] = useState<MailLetter[]>(INITIAL_LETTERS);
  const [memories, setMemories] = useState<LivingMemory[]>(INITIAL_MEMORIES);
  const [activeRoom, setActiveRoom] = useState<RoomId | 'overview'>('overview');

  // 2.5D 全屋轴测拖拽对齐组件布局状态
  const [roomLayout, setRoomLayout] = useState<RoomLayoutConfig>(() => loadSavedRoomLayout());
  const [activeGizmoId, setActiveGizmoId] = useState<EditableObjectId | null>(null);
  const [isLayoutInspectorOpen, setIsLayoutInspectorOpen] = useState(false);

  // Modals
  const [isMailboxOpen, setIsMailboxOpen] = useState(false);
  const [isStatusPickerOpen, setIsStatusPickerOpen] = useState(false);
  const [isSvgExportOpen, setIsSvgExportOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);
  const [showManifesto, setShowManifesto] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bookshelf state
  const [isBookshelfModalOpen, setIsBookshelfModalOpen] = useState(false);
  const [bookshelfPreset, setBookshelfPreset] = useState<BookshelfPreset>('cozy');
  const [customBookshelfTiers, setCustomBookshelfTiers] = useState<TierConfig[]>(PRESET_COZY_TIERS);
  const [selectedBookshelfItem, setSelectedBookshelfItem] = useState<{
    type: 'book' | 'dec';
    item: BookItemConfig | ShelfDecorationConfig;
  } | null>(null);

  // Unread mail for self
  const unreadCount = letters.filter((l) => l.toId === 'self' && !l.read).length;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Change self status
  // Change self status and appearance
  const handleSaveMyStatus = (
    stateId: LifeStateId,
    roomId: RoomId,
    note: string,
    appearance?: {
      skinColor?: string;
      beanieColor?: string;
      hairColor?: string;
      hairStyle?: string;
      shirtColor?: string;
      hasPompom?: boolean;
    }
  ) => {
    setPeople((prev) =>
      prev.map((p) => {
        if (p.id === 'self') {
          return {
            ...p,
            currentState: stateId,
            currentRoom: roomId,
            stateNote: note || p.stateNote,
            sinceTime: '刚刚更新状态',
            ...(appearance || {}),
          };
        }
        return p;
      })
    );
    const stateObj = LIFE_STATES[stateId];
    triggerToast(`状态与小人特征已更新：${stateObj?.emoji} ${stateObj?.label}`);
  };

  // Send letter or gift
  const handleSendLetter = (newLetter: Omit<MailLetter, 'id' | 'date' | 'read'>) => {
    const letterId = `m-${Date.now()}`;
    const newMail: MailLetter = {
      ...newLetter,
      id: letterId,
      date: '刚刚',
      read: false,
    };

    setLetters((prev) => [newMail, ...prev]);

    // Also record a gentle LivingMemory
    const recipient = people.find((p) => p.id === newLetter.toId);
    if (recipient) {
      const newMem: LivingMemory = {
        id: `mem-${Date.now()}`,
        title: `给${recipient.name}门前留下的心意`,
        desc: `在信箱里悄悄放入了便笺，附带着${newLetter.gift ? '一份小礼物' : '几句安静的话'}。没有催促，只有挂念。`,
        timestamp: '刚才',
        participants: ['我', recipient.name],
        icon: newLetter.gift === 'coffee' ? '☕' : newLetter.gift === 'plant' ? '🪴' : '✉️',
      };
      setMemories((prev) => [newMem, ...prev]);
    }

    triggerToast(`便笺与心意已投递至 ${recipient?.name || '朋友'} 的信箱`);
  };

  // Mark letter as read
  const handleMarkLetterRead = (letterId: string) => {
    setLetters((prev) =>
      prev.map((l) => (l.id === letterId ? { ...l, read: true } : l))
    );
  };

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
  const handleSelectBookshelfPreset = (preset: BookshelfPreset) => {
    setBookshelfPreset(preset);
    let baseTiers: TierConfig[];
    switch (preset) {
      case 'empty':
        baseTiers = PRESET_EMPTY_TIERS;
        break;
      case 'packed':
        baseTiers = PRESET_PACKED_TIERS;
        break;
      case 'botanical':
        baseTiers = PRESET_BOTANICAL_TIERS;
        break;
      case 'reading_lin':
        baseTiers = PRESET_READING_LIN_TIERS;
        break;
      case 'cozy':
      default:
        baseTiers = PRESET_COZY_TIERS;
        break;
    }
    setCustomBookshelfTiers(baseTiers);
    const presetNames: Record<BookshelfPreset, string> = {
      cozy: '岁月沉淀 · 惬意日常',
      reading_lin: '林木正在翻读 · 抽出空位',
      empty: '新居搬入 · 纯净空架',
      packed: '博览藏书 · 满满当当',
      botanical: '绿意垂蔓 · 森林氧吧',
    };
    triggerToast(`📚 书架场景已切换：${presetNames[preset] || preset}`);
  };

  const handleToggleBookPulled = (bookId: string) => {
    let bookTitle = '';
    let willPull = false;

    setCustomBookshelfTiers((prev) =>
      prev.map((tier) => {
        if (!tier.books) return tier;
        return {
          ...tier,
          books: tier.books.map((b) => {
            if (b.id === bookId) {
              bookTitle = b.title;
              willPull = !b.isPulled;
              return { ...b, isPulled: willPull, isReading: willPull };
            }
            return b;
          }),
        };
      })
    );

    triggerToast(
      willPull
        ? `📖 已从书架抽出《${bookTitle}》，在沙发上安静翻读`
        : `📥 已将《${bookTitle}》放回原木书架插槽`
    );
  };

  const handleAddCustomBook = (tierIndex: number, newBook: Partial<BookItemConfig>) => {
    const bookItem: BookItemConfig = {
      id: `custom-book-${Date.now()}`,
      title: newBook.title || '无名手记',
      author: newBook.author || '我',
      color: newBook.color || '#b45309',
      pageColor: '#f7f2ea',
      thickness: newBook.thickness || 2.5,
      height: newBook.height || 8.8,
      depth: 4.0,
      donor: newBook.donor || '我',
      note: newBook.note || '随手插在原木架上的一本心头好。',
      bookmarkRibbon: newBook.bookmarkRibbon,
      offset: 196 + (Math.random() * 8 - 4),
    };

    setCustomBookshelfTiers((prev) =>
      prev.map((tier) => {
        if (tier.index === tierIndex) {
          return {
            ...tier,
            books: [...(tier.books || []), bookItem],
          };
        }
        return tier;
      })
    );

    triggerToast(`✨ 已将《${bookItem.title}》安放到书架第 ${tierIndex} 层插槽`);
  };

  // 2.5D 全屋轴测拖拽对齐操作
  const handleUpdateLayoutPosition = (id: EditableObjectId, pos: { x: number; y: number }) => {
    setRoomLayout((prev) => {
      const next = {
        ...prev,
        [id]: {
          ...prev[id],
          screen: pos,
        },
      };
      saveRoomLayout(next);
      return next;
    });
  };

  const handleDragGizmoDelta = (dx: number, dy: number) => {
    if (!activeGizmoId) return;
    const cur = roomLayout[activeGizmoId]?.screen;
    if (!cur) return;
    const nextPos = {
      x: Number((cur.x + dx).toFixed(1)),
      y: Number((cur.y + dy).toFixed(1)),
    };
    handleUpdateLayoutPosition(activeGizmoId, nextPos);
  };

  const handleResetLayoutDefaults = () => {
    clearSavedRoomLayout();
    setRoomLayout(DEFAULT_ROOM_LAYOUT);
    triggerToast('↺ 已恢复全屋家具与摆件默认 2.5D 摆放位置');
  };

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
        people={people}
        onSelectPerson={(p) => setSelectedPerson(p)}
        onEditMyStatus={() => setIsStatusPickerOpen(true)}
        onOpenSvgExport={() => setIsSvgExportOpen(true)}
      />

      {/* 3. Stylized Cozy 2.5D Layered World */}
      <div className="absolute inset-0 z-0">
        <ThreeWorld
          timeOfDay={timeOfDay}
          people={people}
          activeRoom={activeRoom}
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
    </main>
  );
}
