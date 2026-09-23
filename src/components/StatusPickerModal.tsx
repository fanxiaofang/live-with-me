import React, { useState } from 'react';
import { LifeStateId, RoomId } from '../types';
import { LIFE_STATES, ROOMS } from '../data/initialData';
import { X, Check, MapPin, Sparkles, User, Palette, Download } from 'lucide-react';
import { CharacterAvatar, CharacterHead } from './CharacterAvatar';
import { SvgExportModal } from './SvgExportModal';

interface StatusPickerModalProps {
  isOpen: boolean;
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
    name: '蓬松波浪卷发 (参考图左)',
    desc: '帽檐下散落一圈生动波浪小卷，自然披覆至肩颈，随性治愈',
    tag: '图同款 1',
  },
  {
    id: 'long_wavy',
    name: '随性披肩长发 (参考图中)',
    desc: '从帽檐下延展出多缕轻盈微卷长发，自然披垂至后背与肩头，温柔慵懒',
    tag: '图同款 2',
  },
  {
    id: 'medium_straight',
    name: '利落及肩直发 (参考图右)',
    desc: '帽檐下垂落整齐垂顺的齐肩发束，发梢微散微翘，简约清新',
    tag: '图同款 3',
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
  const [previewFacing, setPreviewFacing] = useState<'SE' | 'SW' | 'NW' | 'NE'>('SE');
  const [showSvgExportModal, setShowSvgExportModal] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="status-picker-modal"
        className="w-full max-w-xl bg-[#201d1a] border border-[#443c34] rounded-2xl shadow-2xl overflow-hidden text-[#e8e2d8] flex flex-col max-h-[88vh]"
      >
        {/* Header with Navigation Tabs */}
        <div className="px-6 pt-4 pb-3 border-b border-[#36302a] bg-[#272320]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold tracking-wide text-[#f2ece2]">状态与小人特征配置</h2>
              <p className="text-xs text-[#a39a8f] mt-0.5">
                薄款纯色包头帽下露出一小撮自然刘海 · 肤色与参数随时自选
              </p>
            </div>
            <button
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
              <span>包头帽与刘海装扮</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
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
                        <div className="text-xs font-medium">{rInfo.name.split('&')[0]}</div>
                        <div className="text-[10px] text-[#7d7367] mt-0.5 truncate">{rInfo.enName}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

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
              {/* Live Character Visualizer with 3-Angle Perspective Switcher */}
              <div className="p-4 rounded-xl bg-[#1a1715] border border-[#383028] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#26211d] border border-[#3d342c] flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
                    <svg viewBox="-14 -25 28 36" className="w-14 h-14">
                      {/* Character Avatar Live Preview */}
                      <ellipse cx="0" cy="8" rx="12" ry="4.5" fill="#150f0a" opacity="0.4" />
                      {/* Body according to 2.5D facing */}
                      {(previewFacing === 'SW' || previewFacing === 'NE') ? (
                        <g id="body-side-preview" transform={previewFacing === 'NE' ? 'scale(-1, 1)' : ''}>
                          <path
                            d="M-5.5,2 C-7.0,-3 -4.5,-8.5 -1.0,-9 C2.5,-9.5 5.5,-5.5 5.0,2 Z"
                            fill={shirtColor}
                          />
                          <path
                            d="M-2.2,-5.5 Q-4.2,-1.5 -2.0,2.0"
                            stroke={shirtColor}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            fill="none"
                            opacity="0.85"
                          />
                        </g>
                      ) : (
                        <path
                          d="M-6,2 C-7,-4 -5,-9 0,-9 C5,-9 7,-4 6,2 Z"
                          fill={shirtColor}
                        />
                      )}
                      {previewFacing === 'NW' && (
                        <path d="M-4,-9 Q0,-7 4,-9" stroke="#000000" strokeWidth="0.8" opacity="0.18" fill="none" />
                      )}
                      <CharacterHead
                        cx={0}
                        cy={-14}
                        r={7}
                        skinColor={skinColor}
                        hairColor={hairColor}
                        hairStyle={hairStyle}
                        beanieColor={beanieColor}
                        hasPompom={hasPompom}
                        showBeanie={true}
                        facing={previewFacing}
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#f0e8dc] flex items-center gap-2">
                      <span>2.5D 轴测毛线帽小人</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#354652] text-[#9dc2dc]">
                        2:1 菱形轴测对齐
                      </span>
                    </div>
                    <div className="text-[11px] text-[#948777] mt-1 space-y-0.5">
                      <div>
                        空间朝向：
                        <span className="text-[#ded5c7] ml-1 font-medium">
                          {previewFacing === 'SE' && '东南 SE · 面向正前（露出自然月牙刘海）'}
                          {previewFacing === 'SW' && '西南 SW · 面向左下（侧身向桌，露侧发梢）'}
                          {previewFacing === 'NW' && '西北 NW · 正对后背（后脑勺厚实包裹，无刘海）'}
                          {previewFacing === 'NE' && '东北 NE · 侧身后上（背向镜头右上方）'}
                        </span>
                      </div>
                      <div>
                        帽子质感：
                        <span className="text-[#ded5c7] ml-1">
                          翻折帽檐 · {hasPompom ? '带毛线顶球' : '平顶卷檐'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  {/* 2.5D 轴测四大标准方向切换开关 */}
                  <div className="flex items-center gap-1 bg-[#241e1a] p-1 rounded-lg border border-[#3b322a]">
                    <button
                      type="button"
                      onClick={() => setPreviewFacing('SE')}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                        previewFacing === 'SE'
                          ? 'bg-[#3b322a] text-[#f5eee4] border border-[#c4794e]/40 shadow-xs'
                          : 'text-[#8c8175] hover:text-[#ded5c7]'
                      }`}
                      title="东南：正前视角"
                    >
                      正前 SE
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewFacing('SW')}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                        previewFacing === 'SW'
                          ? 'bg-[#3b322a] text-[#f5eee4] border border-[#c4794e]/40 shadow-xs'
                          : 'text-[#8c8175] hover:text-[#ded5c7]'
                      }`}
                      title="西南：侧前左下"
                    >
                      侧身 SW
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewFacing('NW')}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                        previewFacing === 'NW'
                          ? 'bg-[#3b322a] text-[#f5eee4] border border-[#c4794e]/40 shadow-xs'
                          : 'text-[#8c8175] hover:text-[#ded5c7]'
                      }`}
                      title="西北：后背视角"
                    >
                      后背 NW
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewFacing('NE')}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                        previewFacing === 'NE'
                          ? 'bg-[#3b322a] text-[#f5eee4] border border-[#c4794e]/40 shadow-xs'
                          : 'text-[#8c8175] hover:text-[#ded5c7]'
                      }`}
                      title="东北：侧后右上"
                    >
                      侧后 NE
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHasPompom(!hasPompom)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors ${
                        hasPompom
                          ? 'bg-[#3b4b59] border-[#5a778c] text-[#d6e7f2]'
                          : 'bg-[#25211e] border-[#3d352e] text-[#8c8175]'
                      }`}
                    >
                      {hasPompom ? '顶端毛球：开' : '顶端毛球：关'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSvgExportModal(true)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#382e26] hover:bg-[#483a2f] border border-[#594738] text-[#f2ce9d] flex items-center gap-1 transition-colors shadow-xs"
                      title="导出标准 4 视图矢量 SVG"
                    >
                      <Download className="w-3 h-3" />
                      <span>导出 4视图 SVG</span>
                    </button>
                    <span className="text-[10px] text-[#73685a] italic hidden sm:inline">
                      实时同步世界
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. 毛线帽颜色 (Knit Beanie Color) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#b5aa9d]">厚织毛线帽颜色（纯哑光无反光）：</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#80766a]">自定义：</span>
                    <input
                      type="color"
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
                    帽檐下露出的发型款式 (参考图发型)：
                  </span>
                  <span className="text-[10px] text-[#80766a]">
                    毛线帽设定保持不变 · 支持正面与背影视角
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BANGS_STYLES.map((style) => {
                    const isSelected = hairStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setHairStyle(style.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#3b322a] border-[#c4794e] text-[#f5eee4] ring-1 ring-[#c4794e]/40 shadow-sm'
                            : 'bg-[#25211e] border-[#38312b] text-[#9c9186] hover:border-[#4d4237] hover:text-[#ded5c7]'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#1a1715] flex items-center justify-center shrink-0 border border-[#332b24]">
                          <svg viewBox="-12 -25 24 30" className="w-9 h-9">
                            <CharacterHead
                              cx={0}
                              cy={-14}
                              r={7}
                              skinColor={skinColor}
                              hairColor={hairColor}
                              hairStyle={style.id}
                              beanieColor={beanieColor}
                              hasPompom={hasPompom}
                              showBeanie={true}
                              facing={previewFacing === 'NW' ? 'NW' : 'SE'}
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
                  <div className="text-xs font-medium text-[#b5aa9d] mb-2">刘海发丝色泽：</div>
                  <div className="flex gap-2">
                    {HAIR_PRESETS.map((hp) => {
                      const isSelected = hairColor.toLowerCase() === hp.value.toLowerCase();
                      return (
                        <button
                          key={hp.value}
                          type="button"
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
        <div className="px-6 py-3.5 border-t border-[#332e29] flex items-center justify-between bg-[#24201d]">
          <span className="text-[11px] text-[#807567]">
            {activeTab === 'status' ? '朋友能在小世界里看到你的静默状态' : '实时保存在小世界和同住人视角中'}
          </span>
          <div className="flex items-center gap-2">
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

      {/* 4 视图 SVG 导出弹窗 */}
      <SvgExportModal
        isOpen={showSvgExportModal}
        onClose={() => setShowSvgExportModal(false)}
      />
    </div>
  );
};

