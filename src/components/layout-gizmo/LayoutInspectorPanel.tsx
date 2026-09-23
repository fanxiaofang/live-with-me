import React, { useState, useEffect } from 'react';
import {
  RoomLayoutConfig,
  EditableObjectId,
  RoomCategory,
  DEFAULT_ROOM_LAYOUT,
} from './layoutStore';
import { unprojectScreenToIso } from './isoMath';
import {
  Move,
  RotateCcw,
  Copy,
  Check,
  Wrench,
  ChevronUp,
  ChevronDown,
  Layers,
  Coffee,
  Armchair,
  BookOpen,
  Home,
  Laptop,
  Library,
  Keyboard,
} from 'lucide-react';

interface LayoutInspectorPanelProps {
  layout: RoomLayoutConfig;
  activeId: EditableObjectId | null;
  onSelectObject: (id: EditableObjectId | null) => void;
  onUpdatePosition: (id: EditableObjectId, pos: { x: number; y: number }) => void;
  onResetDefaults: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  isChairEmpty?: boolean;
  onToggleChairSeated?: (seated?: boolean) => void;
  onOpenChairInspector?: () => void;
}

const CATEGORIES: { id: RoomCategory | 'all'; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'all', label: '全部', icon: Layers },
  { id: 'bookshelf', label: '原木书架', icon: Library },
  { id: 'attic', label: '阁楼工位', icon: Laptop },
  { id: 'cabinet', label: '咖啡黑胶', icon: Coffee },
  { id: 'living', label: '暖炉茶室', icon: Armchair },
  { id: 'study', label: '花园书房', icon: BookOpen },
  { id: 'porch', label: '门厅前廊', icon: Home },
];

export const LayoutInspectorPanel: React.FC<LayoutInspectorPanelProps> = ({
  layout,
  activeId,
  onSelectObject,
  onUpdatePosition,
  onResetDefaults,
  isOpen,
  onToggleOpen,
  isChairEmpty = false,
  onToggleChairSeated,
  onOpenChairInspector,
}) => {
  const [copied, setCopied] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeCategory, setActiveCategory] = useState<RoomCategory | 'all'>('all');

  const handleCopyCode = () => {
    const formattedObj: Record<string, { x: number; y: number }> = {};
    (Object.keys(layout) as EditableObjectId[]).forEach((key) => {
      formattedObj[key] = {
        x: Number(layout[key].screen.x.toFixed(1)),
        y: Number(layout[key].screen.y.toFixed(1)),
      };
    });

    const codeSnippet = `// 2.5D 室内全屋轴测校准布局导出
export const roomLayoutConfig = ${JSON.stringify(formattedObj, null, 2)};`;
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleNudge = (id: EditableObjectId, dx: number, dy: number) => {
    const cur = layout[id].screen;
    const next = {
      x: Number((cur.x + dx).toFixed(1)),
      y: Number((cur.y + dy).toFixed(1)),
    };
    onUpdatePosition(id, next);
  };

  // 键盘快捷键监听：选中组件后，支持通过方向键 (Arrow Keys) 以 1px 步长微调 x/y 位置
  useEffect(() => {
    if (!isOpen || !activeId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 避免干扰输入框、文本域以及正在组合的输入法事件
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const step = e.shiftKey ? 5 : 1; // 默认 1px 精密微调，按住 Shift 时以 5px 步长快速微调

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleNudge(activeId, -step, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNudge(activeId, step, 0);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleNudge(activeId, 0, -step);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleNudge(activeId, 0, step);
          break;
        case 'Escape':
          e.preventDefault();
          onSelectObject(null);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeId, layout, onUpdatePosition, onSelectObject]);

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#241c14]/90 backdrop-blur-md border border-[#523d29] text-[#ecd8c2] text-xs font-medium shadow-2xl hover:bg-[#34271c] hover:border-[#b48053] transition-all group"
        title="打开 2.5D 轴测室内全屋校准器"
      >
        <Wrench className="w-4 h-4 text-[#d97706] group-hover:rotate-45 transition-transform duration-300" />
        <span>全屋 2.5D 布局校准器</span>
      </button>
    );
  }

  // 过滤当前分类项
  const filteredIds = (Object.keys(layout) as EditableObjectId[]).filter((id) => {
    if (activeCategory === 'all') return true;
    return layout[id].category === activeCategory;
  });

  return (
    <aside
      aria-label="2.5D 室内全屋布局校准面板"
      className="fixed bottom-5 right-5 z-40 w-84 max-h-[82vh] flex flex-col rounded-2xl bg-[#1c1815]/95 backdrop-blur-md border border-[#4a3b2c] shadow-2xl text-[#e6ded5] overflow-hidden select-none transition-all"
    >
      {/* 头部标题与收起/关闭按钮 */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#2a221b] border-b border-[#3d2f23] shrink-0">
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 text-[#e28547]" />
          <span className="text-xs font-semibold tracking-wide text-[#f4ece1]">
            全屋 2.5D 布局校准器
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded text-[#9c8e7e] hover:text-[#f4ece1] hover:bg-[#382d23]"
          >
            {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onToggleOpen}
            className="px-1.5 py-0.5 rounded text-[11px] text-[#9c8e7e] hover:text-[#f4ece1] hover:bg-[#382d23]"
          >
            关闭
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* 分类筛选 Tab 栏 */}
          <div className="px-2.5 py-2 bg-[#221a14] border-b border-[#382a1d] flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#d97706] text-white shadow-sm'
                      : 'bg-[#2a2018] text-[#a89988] hover:text-[#f4ece1] hover:bg-[#362a20]'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 overflow-y-auto space-y-2.5 text-xs flex-1">
            <div className="p-2 rounded-xl bg-[#281f17] border border-[#483726] space-y-1.5">
              <div className="flex items-center justify-between text-[#ecd8c2]">
                <span className="flex items-center gap-1.5 font-medium text-[11px] text-[#f59e0b]">
                  <Keyboard className="w-3.5 h-3.5 text-[#f59e0b]" />
                  方向键微调支持 (已激活)
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e1711] text-[#9c8d7d] font-mono">
                  1px / 5px
                </span>
              </div>
              <p className="text-[11px] text-[#bdae9e] leading-snug">
                选中任意组件后，按键盘 <kbd className="px-1 py-0.5 rounded bg-[#1a140f] border border-[#4d3d2c] font-mono text-[10px] text-[#fcd34d]">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-[#1a140f] border border-[#4d3d2c] font-mono text-[10px] text-[#fcd34d]">↓</kbd> <kbd className="px-1 py-0.5 rounded bg-[#1a140f] border border-[#4d3d2c] font-mono text-[10px] text-[#fcd34d]">←</kbd> <kbd className="px-1 py-0.5 rounded bg-[#1a140f] border border-[#4d3d2c] font-mono text-[10px] text-[#fcd34d]">→</kbd> 即可按 <strong className="text-[#fcd34d]">1px</strong> 精密微调；按住 <kbd className="px-1 py-0.5 rounded bg-[#1a140f] border border-[#4d3d2c] font-mono text-[10px] text-[#cbd5e1]">Shift</kbd> 可按 5px 快速位移，按 <kbd className="px-1 py-0.5 rounded bg-[#1a140f] border border-[#4d3d2c] font-mono text-[10px] text-[#cbd5e1]">Esc</kbd> 取消选中。
              </p>
            </div>

            {/* 物件列表 */}
            <div className="space-y-1.5">
              {filteredIds.map((id) => {
                const item = layout[id];
                const isSelected = activeId === id;
                const iso = unprojectScreenToIso(item.screen, item.fixedW);

                return (
                  <div
                    key={id}
                    onClick={() => onSelectObject(isSelected ? null : id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#3b2d21] border-[#d97706] shadow-sm'
                        : 'bg-[#221c17] border-[#362b21] hover:border-[#4d3d2f]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-1 py-0.2 rounded bg-[#2e2319] text-[#c49a6c]">
                          {item.categoryLabel}
                        </span>
                        <span className={`font-medium ${isSelected ? 'text-[#fef3c7]' : 'text-[#d6c7b2]'}`}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#18130f] text-[#a39483] font-mono">
                        {isSelected ? '选中中 · 可拖拽' : '点击对齐'}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-[#9e907e]">
                      <span>
                        2D: ({item.screen.x.toFixed(1)}, {item.screen.y.toFixed(1)})
                      </span>
                      <span className="text-[#d97706]">
                        3D(u,v,w): ({iso.u}, {iso.v}, {item.fixedW})
                      </span>
                    </div>

                    {/* 选中时展现方向微调手柄 */}
                    {isSelected && (
                      <div className="mt-2 pt-2 border-t border-[#4a3928] flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-[#9c8d7d]">微调(px):</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNudge(id, -1, 0);
                            }}
                            title="向左微调 1px (快捷键: ←)"
                            className="px-1.5 py-0.5 rounded bg-[#2b2219] hover:bg-[#453628] text-[10px] font-mono text-[#ecd8c2]"
                          >
                            ←
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNudge(id, 1, 0);
                            }}
                            title="向右微调 1px (快捷键: →)"
                            className="px-1.5 py-0.5 rounded bg-[#2b2219] hover:bg-[#453628] text-[10px] font-mono text-[#ecd8c2]"
                          >
                            →
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNudge(id, 0, -1);
                            }}
                            title="向上微调 1px (快捷键: ↑)"
                            className="px-1.5 py-0.5 rounded bg-[#2b2219] hover:bg-[#453628] text-[10px] font-mono text-[#ecd8c2]"
                          >
                            ↑
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNudge(id, 0, 1);
                            }}
                            title="向下微调 1px (快捷键: ↓)"
                            className="px-1.5 py-0.5 rounded bg-[#2b2219] hover:bg-[#453628] text-[10px] font-mono text-[#ecd8c2]"
                          >
                            ↓
                          </button>
                          <span className="text-[9px] text-[#786a5a] ml-0.5">或方向键</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-[#9c8d7d]">Z轴高低:</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNudge(id, 0, -0.5);
                            }}
                            className="px-1.5 py-0.5 rounded bg-[#2b2219] hover:bg-[#453628] text-[10px] text-[#60a5fa]"
                          >
                            +Z
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNudge(id, 0, 0.5);
                            }}
                            className="px-1.5 py-0.5 rounded bg-[#2b2219] hover:bg-[#453628] text-[10px] text-[#60a5fa]"
                          >
                            -Z
                          </button>
                        </div>
                      </div>
                    )}
                    {/* 工位座椅专属：空椅/组合态即时切换与检视 */}
                    {id === 'attic-chair' && (
                      <div
                        className="mt-2 pt-2 border-t border-[#3a2d20] flex items-center justify-between text-[11px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#9c8d7d]">工位就座:</span>
                          <button
                            type="button"
                            onClick={() => onToggleChairSeated?.(isChairEmpty)}
                            className="px-2 py-0.5 rounded bg-[#2b2118] hover:bg-[#3d2f22] text-[#d97736] border border-[#4d3a28] font-medium transition-colors"
                          >
                            {isChairEmpty ? '🪑 当前: 空椅态 (点击就坐)' : '💻 当前: 组合态 (点击离开)'}
                          </button>
                        </div>
                        {onOpenChairInspector && (
                          <button
                            type="button"
                            onClick={onOpenChairInspector}
                            className="px-2 py-0.5 rounded bg-[#d97736]/20 hover:bg-[#d97736]/35 text-[#f0a36e] border border-[#d97736]/40 text-[10px] font-medium transition-colors"
                          >
                            检视对比
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 底部操作区：复制代码与恢复默认 */}
          <div className="p-3 bg-[#221b15] border-t border-[#3a2d21] flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={onResetDefaults}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#27201a] hover:bg-[#382d23] text-[#b3a493] text-[11px] transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-[#9ca3af]" />
              <span>恢复默认</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d97706] hover:bg-[#b45309] text-white text-[11px] font-medium transition-colors shadow-md"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? '已复制全屋坐标' : '导出全屋坐标'}</span>
            </button>
          </div>
        </>
      )}
    </aside>
  );
};
