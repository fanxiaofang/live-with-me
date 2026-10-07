import React, { useState } from 'react';
import {
  BookshelfPreset,
  BookItemConfig,
  ShelfDecorationConfig,
  TierConfig,
} from './bookshelfTypes';
import { Bookshelf } from './Bookshelf';
import {
  BookOpen,
  Bookmark,
  Sparkles,
  Layers,
  X,
  Plus,
  RotateCcw,
  Check,
  Feather,
  Info,
  Eye,
} from 'lucide-react';

interface BookshelfModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPreset: BookshelfPreset;
  onSelectPreset: (preset: BookshelfPreset) => void;
  tiers: TierConfig[];
  selectedItem: { type: 'book' | 'dec'; item: BookItemConfig | ShelfDecorationConfig } | null;
  onSelectItem: (item: { type: 'book' | 'dec'; item: BookItemConfig | ShelfDecorationConfig } | null) => void;
  onToggleBookPulled?: (bookId: string) => void;
  onAddCustomBook?: (tierIndex: number, newBook: Partial<BookItemConfig>) => void;
}

export const BookshelfModal: React.FC<BookshelfModalProps> = ({
  isOpen,
  onClose,
  currentPreset,
  onSelectPreset,
  tiers,
  selectedItem,
  onSelectItem,
  onToggleBookPulled,
  onAddCustomBook,
}) => {
  const [activeTab, setActiveTab] = useState<'tiers' | 'presets' | 'add'>('tiers');
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newColor, setNewColor] = useState('#b45309');
  const [newNote, setNewNote] = useState('');
  const [newTierIndex, setNewTierIndex] = useState(2);
  const [hasRibbon, setHasRibbon] = useState(true);

  if (!isOpen) return null;

  const presetsList: { id: BookshelfPreset; label: string; desc: string; icon: string }[] = [
    {
      id: 'cozy',
      label: '经典温馨生活感',
      desc: '博尔赫斯、梭罗手记、小松果竹篓与垂蔓多肉，温暖的生活呼吸感',
      icon: '🪴',
    },
    {
      id: 'reading_lin',
      label: '林木借读状态',
      desc: '林木正陷在懒人沙发读《沙之书》，书架第二层留出借阅槽与木质便笺',
      icon: '📖',
    },
    {
      id: 'packed',
      label: '满载学者书房',
      desc: '密密麻麻大开本与精装典籍，各色彩色书签丝带垂落',
      icon: '📚',
    },
    {
      id: 'botanical',
      label: '田园植物志',
      desc: '野外草木笔记、标本集、松果竹篓与苍翠藤蔓',
      icon: '🌿',
    },
    {
      id: 'empty',
      label: '新居初搬入',
      desc: '纯净开阔的做旧粗原木大板，仅留一杯温热咖啡与第一本空白手记',
      icon: '🪵',
    },
  ];

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddCustomBook?.(newTierIndex, {
      title: newTitle.trim(),
      author: newAuthor.trim() || '我',
      color: newColor,
      thickness: 2.6,
      height: 9.0,
      donor: '我',
      note: newNote.trim() || '随手插在书架上的安静手记。',
      bookmarkRibbon: hasRibbon ? '#f59e0b' : undefined,
    });
    setNewTitle('');
    setNewAuthor('');
    setNewNote('');
    setActiveTab('tiers');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#211712] text-[#f7f2ea] rounded-2xl border border-[#523b2c] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#3d2a1f] bg-[#291d17]">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#3d2a1f] text-[#f59e0b]">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-medium tracking-wide text-[#faf5ee]">
                手作做旧粗原木书架 · 藏书插槽
              </h2>
              <p className="text-xs text-[#b89f8c]">
                纯净架体与参数化插槽（ShelfFrame + BookSlots）· 结构与内容解耦
              </p>
            </div>
          </div>
          <button
            aria-label="关闭书架"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#b89f8c] hover:text-[#faf5ee] hover:bg-[#3d2a1f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 px-5 pt-3 pb-2 border-b border-[#35251b] bg-[#241914] text-xs">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeTab === 'tiers'
                ? 'bg-[#4a3426] text-[#faf5ee] shadow-xs'
                : 'text-[#a38c7a] hover:text-[#e8ded1] hover:bg-[#2f2018]'
            }`}
          >
            📚 四层藏书与摆件
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeTab === 'presets'
                ? 'bg-[#4a3426] text-[#faf5ee] shadow-xs'
                : 'text-[#a38c7a] hover:text-[#e8ded1] hover:bg-[#2f2018]'
            }`}
          >
            🎨 场景预设一键切换 ({presetsList.find((p) => p.id === currentPreset)?.label})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1 ${
              activeTab === 'add'
                ? 'bg-[#4a3426] text-[#faf5ee] shadow-xs'
                : 'text-[#a38c7a] hover:text-[#e8ded1] hover:bg-[#2f2018]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> 插放新书/便笺
          </button>
        </div>

        {/* 2.5D 纯净骨架与插槽实时视窗 */}
        <div className="px-5 pt-3">
          <div className="p-3 rounded-2xl bg-[#1e140f] border border-[#3f2a1e] flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-52 h-44 bg-[#140c08] rounded-xl border border-[#332014] overflow-hidden flex items-center justify-center p-2 relative shadow-inner">
              <div className="absolute top-2 left-2 text-[10px] text-[#b89f8c] flex items-center gap-1 bg-[#251710]/90 px-2 py-0.5 rounded-md border border-[#3f271a] z-10">
                <Eye className="w-3 h-3 text-[#f59e0b]" /> 2.5D 纯净骨架实时预览
              </div>
              <svg viewBox="160 56 72 82" className="w-full h-full drop-shadow-md">
                <Bookshelf
                  preset={currentPreset}
                  customTiers={tiers}
                  selectedItemId={selectedItem?.item.id}
                  onBookClick={(book) => onSelectItem({ type: 'book', item: book })}
                  onDecorationClick={(dec) => onSelectItem({ type: 'dec', item: dec })}
                />
              </svg>
            </div>
            <div className="flex-1 text-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#faf5ee]">
                  {presetsList.find((p) => p.id === currentPreset)?.label || '当前书架状态'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#422e22] text-[#f59e0b] font-mono">
                  统一 2.5D 轴向体系
                </span>
              </div>
              <p className="text-[#a8907e] leading-relaxed text-[11px]">
                全四层大板严格依循统一宽轴 (Slope 0.28) 与深轴 (+9, -2.5) 投射，四根通顶实木细立柱与对称侧框横撑稳固承托，采用温润琥珀蜜柚木质感，视觉开阔舒展。
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] text-[#c4b09e] pt-1">
                <span className="px-2 py-0.5 rounded bg-[#2b1c15] border border-[#442c1f]">
                  左柱轴心: X = 173.0 (飞檐 5px)
                </span>
                <span className="px-2 py-0.5 rounded bg-[#2b1c15] border border-[#442c1f]">
                  右柱轴心: X = 213.0 (飞檐 5px)
                </span>
                <span className="px-2 py-0.5 rounded bg-[#2b1c15] border border-[#442c1f]">
                  四柱通顶 · 侧框加固
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm scrollbar-thin scrollbar-thumb-[#4a3426]">
          {/* TAB 1: TIERS BREAKDOWN */}
          {activeTab === 'tiers' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#291d17] border border-[#422e22] text-xs text-[#c4b09e] flex items-center justify-between">
                <span>💡 点击任意一本书可「借出 / 归位」，体验实时的插槽互动状态。</span>
                <span className="text-[#eab308] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> 数据驱动
                </span>
              </div>

              {/* Reverse to show Tier 5 (Top) down to Tier 1 (Bottom) */}
              {[...tiers]
                .sort((a, b) => b.index - a.index)
                .map((tier) => (
                  <div
                    key={tier.index}
                    className="p-3.5 rounded-xl bg-[#281b15] border border-[#3d2a1f] space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#eedec9] flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-[#422e22] text-[#f59e0b] font-mono">
                          Tier {tier.index}
                        </span>
                        {tier.name || `第 ${tier.index} 层`}
                      </span>
                      <span className="text-[#8c7463]">
                        {(tier.books?.length || 0) + (tier.decorations?.length || 0)} 件内容物
                      </span>
                    </div>

                    {/* Books & Decorations Chips */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tier.books?.map((book) => (
                        <div
                          key={book.id}
                          onClick={() => onSelectItem({ type: 'book', item: book })}
                          className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                            book.isPulled
                              ? 'bg-[#1e1511] border-dashed border-[#5e4534] opacity-80'
                              : 'bg-[#31221a] border-[#4a3325] hover:border-[#73523c]'
                          }`}
                        >
                          {/* Color bar */}
                          <div
                            className="w-3.5 h-10 rounded shrink-0 shadow-xs flex items-center justify-center text-[10px]"
                            style={{ backgroundColor: book.color }}
                          >
                            {book.bookmarkRibbon && (
                              <div
                                className="w-0.5 h-4 rounded-full mt-4"
                                style={{ backgroundColor: book.bookmarkRibbon }}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-medium text-[#f5ede1] truncate">
                                《{book.title}》
                              </h4>
                              {book.isPulled ? (
                                <span className="text-[10px] px-1 py-0.2 rounded bg-[#452718] text-[#f97316]">
                                  借读中
                                </span>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleBookPulled?.(book.id);
                                  }}
                                  className="text-[10px] text-[#b89f8c] hover:text-[#facc15] underline"
                                >
                                  拿去翻翻
                                </button>
                              )}
                            </div>
                            <p className="text-[11px] text-[#9c8473] truncate">
                              {book.author ? `作: ${book.author}` : ''}{' '}
                              {book.donor ? `· 留自: ${book.donor}` : ''}
                            </p>
                            {book.isPulled && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleBookPulled?.(book.id);
                                }}
                                className="mt-1 text-[10px] text-[#38bdf8] hover:underline block"
                              >
                                放回书架插槽
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {tier.decorations?.map((dec) => (
                        <div
                          key={dec.id}
                          onClick={() => onSelectItem({ type: 'dec', item: dec })}
                          className="p-2.5 rounded-lg bg-[#2d1e17] border border-[#422d21] hover:border-[#6b4a37] transition-all cursor-pointer flex items-center gap-2.5"
                        >
                          <span className="text-lg">
                            {dec.type === 'trailing-ivy'
                              ? '🌿'
                              : dec.type === 'dry-vase'
                              ? '🏺'
                              : dec.type === 'pinecone-basket'
                              ? '🧺'
                              : dec.type === 'brass-compass'
                              ? '🧭'
                              : dec.type === 'wooden-bird'
                              ? '🐦'
                              : dec.type === 'friend-letter'
                              ? '✉️'
                              : dec.type === 'stone-bookend'
                              ? '🪨'
                              : '✨'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-[#ede3d5] truncate">
                              {dec.label || dec.type}
                            </h4>
                            <p className="text-[10px] text-[#8c7463] truncate">
                              {dec.note || '原木架面点缀饰物'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* TAB 2: PRESET SWITCHER */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-[#a8907e]">
                一键切换书架所承载的岁月与生活痕迹。所有状态均由统一参数驱动：
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {presetsList.map((preset) => {
                  const isCurrent = currentPreset === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => onSelectPreset(preset.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-[#3b271d] border-[#f59e0b] shadow-md ring-1 ring-[#f59e0b]/40'
                          : 'bg-[#281b15] border-[#3f2a1e] hover:border-[#634330] hover:bg-[#2d1e17]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{preset.icon}</span>
                          <h3 className="font-medium text-sm text-[#f5ede1]">{preset.label}</h3>
                        </div>
                        {isCurrent && (
                          <span className="p-1 rounded-full bg-[#f59e0b] text-[#211712]">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#9e8675] leading-relaxed">{preset.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ADD CUSTOM BOOK / NOTE */}
          {activeTab === 'add' && (
            <form onSubmit={handleCreateBook} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#291d17] border border-[#422e22] text-xs text-[#c4b09e]">
                📝 无论是朋友来串门留下的手写信，还是你自己常读的心头好，都可以在书架某个插槽里安放。
              </div>

              <div>
                <label className="block text-xs font-medium text-[#cbb5a2] mb-1">
                  书名 / 手记标题 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：《夏日晚风手记》或《给你的留言便笺》"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#2c1d16] border border-[#4d3425] text-[#f5ede1] focus:outline-none focus:border-[#f59e0b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#cbb5a2] mb-1">
                    作者 / 留言人
                  </label>
                  <input
                    type="text"
                    placeholder="如：我、小鱼、林木"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#2c1d16] border border-[#4d3425] text-[#f5ede1] focus:outline-none focus:border-[#f59e0b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#cbb5a2] mb-1">插放层级</label>
                  <select
                    value={newTierIndex}
                    onChange={(e) => setNewTierIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#2c1d16] border border-[#4d3425] text-[#f5ede1] focus:outline-none focus:border-[#f59e0b]"
                  >
                    <option value={2}>第 2 层 (经典主藏书区与垂蔓)</option>
                    <option value={3}>第 3 层 (诗集、陶艺与手作鸣禽)</option>
                    <option value={4}>第 4 层 (皇冠原木顶层)</option>
                    <option value={1}>第 1 层 (底层重典与松果篓)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#cbb5a2] mb-1.5">
                  封面/书脊基色
                </label>
                <div className="flex items-center gap-2">
                  {[
                    '#bf432f',
                    '#3d7d4f',
                    '#d99938',
                    '#39608f',
                    '#7a426f',
                    '#4d7862',
                    '#b45309',
                    '#1e293b',
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        newColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#cbb5a2] mb-1">
                  题词 / 随书便笺 (可选)
                </label>
                <textarea
                  rows={2}
                  placeholder="写一句送给这间屋子或朋友的安静絮语..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#2c1d16] border border-[#4d3425] text-[#f5ede1] focus:outline-none focus:border-[#f59e0b]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-[#cbb5a2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasRibbon}
                    onChange={(e) => setHasRibbon(e.target.checked)}
                    className="rounded bg-[#2c1d16] border-[#4d3425] text-[#f59e0b]"
                  />
                  <span>垂落一枚暖黄色丝带书签</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-[#211712] font-medium text-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> 安放到书架
                </button>
              </div>
            </form>
          )}

          {/* DETAIL INSPECTION DRAWER (IF ITEM SELECTED) */}
          {selectedItem && (
            <div className="p-4 rounded-xl bg-[#2a1c15] border border-[#523727] animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#f59e0b] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {selectedItem.type === 'book' ? '书籍插槽检视' : '摆件信物检视'}
                </span>
                <button
                  onClick={() => onSelectItem(null)}
                  className="text-xs text-[#9e8675] hover:text-[#f5ede1]"
                >
                  收起
                </button>
              </div>

              {selectedItem.type === 'book' ? (
                (() => {
                  const b = selectedItem.item as BookItemConfig;
                  return (
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-semibold text-[#fbf6ef]">《{b.title}》</h3>
                      {b.author && <p className="text-xs text-[#baa391]">著/辑: {b.author}</p>}
                      {b.donor && (
                        <p className="text-xs text-[#9c8473]">
                          来源信物: {b.donor} 留存在此
                        </p>
                      )}
                      {b.note && (
                        <blockquote className="mt-2 p-2.5 rounded bg-[#1e140f] text-xs text-[#eedec9] italic border-l-2 border-[#f59e0b]">
                          “{b.note}”
                        </blockquote>
                      )}
                      <div className="pt-2 flex items-center gap-3">
                        <button
                          onClick={() => onToggleBookPulled?.(b.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#422e22] hover:bg-[#523a2b] text-xs text-[#f5ede1] transition-colors"
                        >
                          {b.isPulled ? '📥 放回书架插槽' : '📖 抽出来在沙发翻读'}
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                (() => {
                  const d = selectedItem.item as ShelfDecorationConfig;
                  return (
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-[#fbf6ef]">{d.label || d.type}</h3>
                      <p className="text-xs text-[#cbb5a2]">
                        {d.note || '做旧原木大板上的自然点缀饰品。'}
                      </p>
                    </div>
                  );
                })()
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#3d2a1f] bg-[#291d17] text-xs text-[#9c8473]">
          <span>🌿 Live with me · 低打扰的安静陪伴</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#3d2a1f] hover:bg-[#4a3426] text-[#faf5ee] transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
