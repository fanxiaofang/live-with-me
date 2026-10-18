import { Check, MapPin, Palette, Sparkles, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { LIFE_STATES, ROOMS } from '../data/initialData';
import { LifeStateId, Person, RoomId } from '../types';
import { CharacterHead, normalizeHairStyle } from './CharacterAvatar';
import { SHAGGY_HAIR_PALETTE } from './characters/ShaggyHair';
import { CHARACTER_PREVIEW_PALETTE } from './characters/characterPreviewPalette';
import { CharacterAppearancePreview } from './characters/CharacterAppearancePreview';
import { CharacterAppearanceFiveViews } from './characters/CharacterAppearanceFiveViews';
import { useDialogFocus } from '../shared/hooks/useDialogFocus';

import { isRoomFull, previewPresence, ROOM_FULL_MESSAGE } from '../features/presence/presenceAllocation';

interface StatusPickerModalProps {
  isOpen: boolean;
  people: Person[];
  personId: string;
  onClose: () => void;
  currentState: LifeStateId;
  currentRoom: RoomId;
  stateNote?: string;
  initialAppearance?: {
    skinColor?: string;
    beanieColor?: string;
    hairColor?: string;
    hairStyle?: string;
    shirtColor?: string;
    hasPompom?: boolean;
  };
  onSaveStatus: (
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
  ) => void;
}

const SKIN_PRESETS = [
  { label: '柔粉暖白', value: '#fad4c0' },
  { label: '温润象牙', value: '#f5d6be' },
  { label: '柔白暖杏', value: '#faebd7' },
  { label: '清浅麦金', value: '#e5c3a6' },
  { label: '健康暖棕', value: '#d4a373' },
];

const BEANIE_PRESETS = [
  { label: '经典石板蓝 (图同款)', value: '#425b6e' },
  { label: '牛仔灰蓝', value: '#4f6d85' },
  { label: '极夜深青', value: '#2c3e50' },
  { label: '炭麻黑', value: '#242424' },
  { label: '暮杉深绿', value: '#38493d' },
  { label: '暖咖浓褐', value: '#47382d' },
  { label: '燕麦灰米', value: '#a3988a' },
  { label: '复古赤陶', value: '#9c5339' },
];

const HAIR_PRESETS = [
  { label: '浅麦金 (参考图)', value: SHAGGY_HAIR_PALETTE.top },
  { label: '银灰', value: '#b8afa0' },
  { label: '经典纯墨黑 (图同款)', value: '#1a1a1a' },
  { label: '自然深褐', value: '#2b231d' },
  { label: '暖栗红棕', value: '#4a3020' },
  { label: '深炭灰', value: '#363636' },
];

const BANGS_STYLES = [
  {
    id: 'curtain_crescent',
    name: '经典利落短发 (默认)',
    desc: '经典干练短发，帽檐下露出一抹灵动微八字月牙刘海，后颈清爽利落',
    tag: '默认',
  },
  {
    id: 'wavy_curly',
    name: '层叠长卷发',
    desc: '帽下轻盈分束，脸侧发梢弯曲，长卷发层叠披落至肩背',
    tag: '长卷发',
  },
  {
    id: 'long_wavy',
    name: '偏分低束发',
    desc: '一侧长前发贴脸垂落，另一侧收向耳后，后颈留一束短发尾',
    tag: '偏分',
  },
  {
    id: 'medium_straight',
    name: '双色蓬松碎发',
    desc: '浅麦金碎刘海与两侧外翘发梢，后颈深色底发；上层发色可调',
    tag: '双色碎发',
  },
];

const SHIRT_PRESETS = [
  { label: '牛仔同色蓝', value: '#425b6e' },
  { label: '暖柿红', value: '#e07a5f' },
  { label: '鼠尾草绿', value: '#527c50' },
  { label: '浅暖奶杏', value: '#d4c5b9' },
  { label: '炭灰黑', value: '#292524' },
];

export const StatusPickerModal: React.FC<StatusPickerModalProps> = ({
  isOpen,
  people,
  personId,
  onClose,
  currentState,
  currentRoom,
  stateNote = '',
  initialAppearance,
  onSaveStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'appearance'>('status');
  const [selectedState, setSelectedState] = useState<LifeStateId>(currentState);
  const [selectedRoom, setSelectedRoom] = useState<RoomId>(currentRoom);
  const [note, setNote] = useState(stateNote);

  // Appearance states
  const [skinColor, setSkinColor] = useState(initialAppearance?.skinColor || '#fad4c0');
  const [beanieColor, setBeanieColor] = useState(initialAppearance?.beanieColor || '#425b6e');
  const [hairColor, setHairColor] = useState(initialAppearance?.hairColor || '#1a1a1a');
  const [hairStyle, setHairStyle] = useState<string>(
    initialAppearance?.hairStyle || 'curtain_crescent'
  );
  const [shirtColor, setShirtColor] = useState(initialAppearance?.shirtColor || '#425b6e');
  const [hasPompom, setHasPompom] = useState(initialAppearance?.hasPompom ?? true);
  const [showAppearanceViews, setShowAppearanceViews] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const viewsToggle = useRef<HTMLButtonElement>(null);
  const selectedHairstyle = BANGS_STYLES.find(style => style.id === normalizeHairStyle(hairStyle))!;
  const panel = useRef<HTMLDivElement>(null);
  useDialogFocus(isOpen, panel, onClose);

  const preview = previewPresence(people, personId, selectedRoom, selectedState);
  const predictedSlot = preview.personToSlot[personId];
  if (!isOpen) return null;

  const handleStateSelect = (stateId: LifeStateId) => {
    setSelectedState(stateId);
    const stateObj = LIFE_STATES[stateId];
    if (stateObj && stateObj.roomDefault) {
      setSelectedRoom(stateObj.roomDefault);
    }
  };

  const handleSave = () => {
    onSaveStatus(selectedState, selectedRoom, note.trim(), {
      skinColor,
      beanieColor,
      hairColor,
      hairStyle,
      shirtColor,
      hasPompom,
    });
    onClose();
  };

  const toggleAppearanceViews = () => {
    setShowAppearanceViews(!showAppearanceViews);
    if (!showAppearanceViews) content.current?.scrollTo({ top: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="status-picker-modal"
        ref={panel} role="dialog" aria-modal="true" aria-labelledby="status-picker-title" tabIndex={-1}
        className="w-full max-w-xl bg-[#201d1a] border border-[#443c34] rounded-2xl shadow-2xl overflow-hidden text-[#e8e2d8] flex flex-col max-h-[88vh]"
      >
        {/* Header with Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-[#36302a] bg-[#272320] shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 id="status-picker-title" className="text-base font-semibold tracking-wide text-[#f2ece2]">状态与小人特征配置</h2>
              <p className="text-xs text-[#a39a8f] mt-0.5">
                选择生活状态，搭配喜欢的帽子、发型和颜色
              </p>
            </div>
            <button
              type="button" aria-label="关闭配置"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9c9186] hover:text-[#f2ece2] hover:bg-[#38312b] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('status')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'status'
                  ? 'bg-[#3b322a] text-[#f5eee4] border border-[#c4794e]/50'
                  : 'text-[#9c9186] hover:text-[#ded5c7]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d68c68]" />
              <span>生活切片与房间</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('appearance')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'appearance'
                  ? 'bg-[#3b322a] text-[#f5eee4] border border-[#c4794e]/50'
                  : 'text-[#9c9186] hover:text-[#ded5c7]'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[#53907c]" />
              <span>人物装扮</span>
            </button>
          </div>
        </div>

        {activeTab === 'appearance' && <div className="px-4 sm:px-6 pt-4 shrink-0">
          <div data-testid="appearance-summary" style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            className="p-3 rounded-xl bg-[#1a1715] border border-[#383028]">
              <button type="button" aria-label="查看完整装扮五视图"
                aria-expanded={showAppearanceViews} aria-controls="appearance-five-views"
                onClick={toggleAppearanceViews} style={{ flex: '0 0 auto' }}
                className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0a96d]">
                <CharacterAppearancePreview facing="SE" skinColor={skinColor}
                  beanieColor={beanieColor} hairColor={hairColor} hairStyle={hairStyle}
                  shirtColor={shirtColor} hasPompom={hasPompom} />
              </button>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#a39a8f]">当前装扮</span>
                    <button type="button" aria-pressed={hasPompom} onClick={() => setHasPompom(!hasPompom)}
                      className={`min-h-8 px-2 rounded-lg text-xs border ${hasPompom
                        ? 'bg-[#3b4b59] border-[#5a778c] text-[#d6e7f2]'
                        : 'bg-[#25211e] border-[#5a4d40] text-[#c3b29e]'}`}>
                      帽顶毛球：{hasPompom ? '有' : '无'}
                    </button>
                  </div>
                  <p className="text-xs text-[#c3b29e] mt-1">{selectedHairstyle.name}</p>
                  <button ref={viewsToggle} type="button" onClick={toggleAppearanceViews}
                    aria-expanded={showAppearanceViews} aria-controls="appearance-five-views"
                    className="mt-1 min-h-8 rounded-md px-2 -ml-2 text-xs text-[#e0a96d] hover:bg-[#38312b] focus-visible:outline-2 focus-visible:outline-[#e0a96d]">
                    {showAppearanceViews ? '收起完整装扮' : '查看完整装扮'}
                  </button>
                </div>
          </div>
        </div>}

        {/* Body */}
        <div ref={content} className="p-4 sm:p-6 min-h-0 flex-1 overflow-y-auto space-y-5" data-testid="status-picker-content">
          {/* TAB 1: STATUS & ROOM */}
          {activeTab === 'status' && (
            <div className="space-y-5">
              {/* Life State Selector */}
              <div>
                <div className="text-xs font-medium text-[#b5aa9d] mb-2.5">
                  选择当下的生活切片：
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(LIFE_STATES).map((st) => {
                    const isSelected = selectedState === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleStateSelect(st.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-[#3b322a] border-[#c4794e] text-[#f5eee4] ring-1 ring-[#c4794e]/40 shadow-sm'
                            : 'bg-[#25211e] border-[#38312b] text-[#9c9186] hover:border-[#4d4237] hover:text-[#ded5c7]'
                        }`}
                      >
                        <span className="text-lg">{st.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate">{st.label}</div>
                          <div className="text-[10px] text-[#80766a] mt-0.5 line-clamp-1">{st.actionDesc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location in House */}
              <div>
                <div className="text-xs font-medium text-[#b5aa9d] mb-2.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#d68c68]" />
                  <span>待在屋里的哪个角落：</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['my_room', 'living_nook', 'friend_room', 'capsule_pod', 'corn_lounge', 'observatory', 'porch_mailbox'] as RoomId[]).map((rId) => {
                    const rInfo = ROOMS[rId];
                    const isSelected = selectedRoom === rId;
                    return (
                      <button
                        key={rId}
                        type="button"
                        onClick={() => setSelectedRoom(rId)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-[#3b322a] border-[#c4794e] text-[#f5eee4]'
                            : 'bg-[#25211e] border-[#38312b] text-[#998e81] hover:border-[#4d4237]'
                        }`}
                      >
                        <div className="text-xs font-medium">{rInfo.name.split('&')[0].split('·')[0].trim()}</div>
                        <div className="text-[10px] text-[#7d7367] mt-0.5 truncate">{rInfo.enName}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p role="status" data-testid="presence-preview" className="text-xs text-[#b5aa9d]">{isRoomFull(preview, personId) ? ROOM_FULL_MESSAGE : predictedSlot ? `落座预览：${predictedSlot.badgeLabel}` : '前廊：保留室外状态'}</p>
              {/* Optional quiet state note */}
              <div>
                <label className="block text-xs font-medium text-[#b5aa9d] mb-1.5">
                  随手一记（一句安静的话）：
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="例如：戴上薄帽煮好水，窗台微风正好..."
                  maxLength={60}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#191715] border border-[#3e362e] text-[#f0e8dc] placeholder-[#665e52] text-xs focus:outline-none focus:border-[#c4794e] transition-colors"
                />
              </div>
            </div>
          )}

          {/* TAB 2: APPEARANCE CUSTOMIZATION */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              {showAppearanceViews && <CharacterAppearanceFiveViews skinColor={skinColor}
                beanieColor={beanieColor} hairColor={hairColor} hairStyle={hairStyle}
                shirtColor={shirtColor} hasPompom={hasPompom}
                onCollapse={() => { setShowAppearanceViews(false); viewsToggle.current?.focus(); }} />}
              {/* 1. 毛线帽颜色 (Knit Beanie Color) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#b5aa9d]">毛线帽颜色：</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#80766a]">自定义：</span>
                    <input
                      type="color"
                      aria-label="自定义毛线帽颜色"
                      value={beanieColor}
                      onChange={(e) => setBeanieColor(e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {BEANIE_PRESETS.map((bp) => {
                    const isSelected = beanieColor.toLowerCase() === bp.value.toLowerCase();
                    return (
                      <button
                        key={bp.value}
                        type="button"
                        aria-label={bp.label}
                        aria-pressed={isSelected}
                        onClick={() => setBeanieColor(bp.value)}
                        className={`p-1.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'bg-[#38312b] border-[#c4794e] ring-1 ring-[#c4794e]/50'
                            : 'bg-[#25211e] border-[#38312b] hover:border-[#4d4237]'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: bp.value }}
                        />
                        <span className="text-[9px] text-[#a39789] truncate max-w-full">{bp.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. 帽檐下发型款式 (参考图同款发型，保留帽子设定) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#b5aa9d]">
                    发型：
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BANGS_STYLES.map((style) => {
                    const isSelected = hairStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => {
                          if (style.id === 'medium_straight' && hairStyle !== style.id) setHairColor(SHAGGY_HAIR_PALETTE.top);
                          setHairStyle(style.id);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#3b322a] border-[#c4794e] text-[#f5eee4] ring-1 ring-[#c4794e]/40 shadow-sm'
                            : 'bg-[#25211e] border-[#38312b] text-[#9c9186] hover:border-[#4d4237] hover:text-[#ded5c7]'
                        }`}
                      >
                        <div style={{ backgroundColor: CHARACTER_PREVIEW_PALETTE.background }}
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-[#8c8276]">
                          <svg viewBox="-12 -25 24 30" className="w-9 h-9">
                            <CharacterHead
                              cx={0}
                              cy={-14}
                              r={7}
                              skinColor={skinColor}
                              hairColor={style.id === 'medium_straight' && !isSelected ? SHAGGY_HAIR_PALETTE.top : hairColor}
                              hairStyle={style.id}
                              beanieColor={beanieColor}
                              hasPompom={hasPompom}
                              showBeanie={true}
                              facing="SE"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <div className="text-xs font-medium truncate">{style.name}</div>
                            {style.tag && (
                              <span className={`text-[9px] px-1.5 py-0.2 rounded shrink-0 ${
                                isSelected ? 'bg-[#c4794e]/30 text-[#e0a96d]' : 'bg-[#332c25] text-[#8c8072]'
                              }`}>
                                {style.tag}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#7d7367] mt-0.5 leading-relaxed line-clamp-2">
                            {style.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. 肤色动态配置 (Skin Tone) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#b5aa9d]">小人肤色：</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#80766a]">自定义：</span>
                    <input
                      type="color"
                      aria-label="自定义小人肤色"
                      value={skinColor}
                      onChange={(e) => setSkinColor(e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {SKIN_PRESETS.map((sp) => {
                    const isSelected = skinColor.toLowerCase() === sp.value.toLowerCase();
                    return (
                      <button
                        key={sp.value}
                        type="button"
                        aria-label={sp.label}
                        aria-pressed={isSelected}
                        onClick={() => setSkinColor(sp.value)}
                        className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#38312b] border-[#c4794e] ring-1 ring-[#c4794e]/50'
                            : 'bg-[#25211e] border-[#38312b] hover:border-[#4d4237]'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: sp.value }}
                        />
                        <span className="text-[10px] text-[#a39789]">{sp.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. 发色与衣服 (Hair Color & Shirt) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-[#b5aa9d] mb-2">发丝色泽：</div>
                  <div className="flex gap-2">
                    {HAIR_PRESETS.map((hp) => {
                      const isSelected = hairColor.toLowerCase() === hp.value.toLowerCase();
                      return (
                        <button
                          key={hp.value}
                          type="button"
                          aria-label={hp.label}
                          aria-pressed={isSelected}
                          title={hp.label}
                          onClick={() => setHairColor(hp.value)}
                          className={`flex-1 p-1.5 rounded-lg border text-center flex flex-col items-center gap-1 ${
                            isSelected
                              ? 'bg-[#38312b] border-[#c4794e]'
                              : 'bg-[#25211e] border-[#38312b] hover:border-[#4d4237]'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: hp.value }}
                          />
                          <span className="text-[9px] text-[#a39789]">{hp.label.slice(0, 2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-[#b5aa9d] mb-2">衣服底色：</div>
                  <div className="flex gap-2">
                    {SHIRT_PRESETS.map((shp) => {
                      const isSelected = shirtColor.toLowerCase() === shp.value.toLowerCase();
                      return (
                        <button
                          key={shp.value}
                          type="button"
                          aria-label={shp.label}
                          aria-pressed={isSelected}
                          onClick={() => setShirtColor(shp.value)}
                          className={`flex-1 p-1.5 rounded-lg border text-center flex flex-col items-center gap-1 ${
                            isSelected
                              ? 'bg-[#38312b] border-[#c4794e]'
                              : 'bg-[#25211e] border-[#38312b] hover:border-[#4d4237]'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: shp.value }}
                          />
                          <span className="text-[9px] text-[#a39789]">{shp.label.slice(0, 2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-[#332e29] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#24201d] shrink-0">
          <span className="text-[11px] text-[#b5aa9d]">
            {activeTab === 'status' ? '朋友能在小世界里看到你的静默状态' : '保存后，小世界里的你会同步更新'}
          </span>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs text-[#a39789] hover:text-[#e8e2d8] hover:bg-[#332c26] transition-colors"
            >
              取消
            </button>
            <button
              id="confirm-status-btn"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-medium bg-[#b8693c] hover:bg-[#c97544] text-white shadow-md flex items-center gap-1.5 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              保存小人与生活切片
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

