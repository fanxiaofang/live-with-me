import { Armchair, Check, Compass, Sparkles, UserCheck, X, ZoomIn, ZoomOut } from 'lucide-react';
import React, { useState } from 'react';
import { Person } from '../../types';
import { LaptopDisplay } from './DeskItems';
import { WindsorChair } from './WindsorChair';

export interface ChairInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSeatedInRoom: boolean;
  onToggleSeatedInRoom: (seated: boolean) => void;
  currentPerson?: Person | null;
}

export const ChairInspectionModal: React.FC<ChairInspectionModalProps> = ({
  isOpen,
  onClose,
  isSeatedInRoom,
  onToggleSeatedInRoom,
  currentPerson,
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'empty' | 'seated'>('both');
  const [zoomScale, setZoomScale] = useState<number>(1.8);

  if (!isOpen) return null;

  const mockOccupant: Person = currentPerson || {
    id: 'self',
    name: '我',
    avatarColor: '#425b6e',
    shirtColor: '#3b82f6',
    hairColor: '#1a1a1a',
    skinColor: '#fad4c0',
    beanieColor: '#425b6e',
    hairStyle: 'curtain_crescent',
    hasPompom: true,
    isSelf: true,
    currentRoom: 'my_room',
    currentState: 'coding',
    sinceTime: '沉浸工作中',
    favoriteItem: '便携电脑',
    mailCount: 0,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chair-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#1c1916] border border-[#3e342b] rounded-2xl shadow-2xl overflow-hidden text-[#ece4d8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d251e] bg-[#221e1a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d97736]/15 border border-[#d97736]/30 flex items-center justify-center text-[#e28747]">
              <Armchair className="w-5 h-5" />
            </div>
            <div>
              <h2 id="chair-modal-title" className="text-base font-semibold text-[#f5ede3] flex items-center gap-2">
                电脑桌工学软包椅透视与就座状态检视
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#342a20] text-[#cfb088] border border-[#4a3b2c]">
                  修身紧凑 · 久坐释压升级
                </span>
              </h2>
              <p className="text-xs text-[#9a8d7d] mt-0.5">
                高精度对比「空椅态」与「小人组合态」，去除金属铜套回归纯实木收口，配备加厚云朵坐垫、护脊腰靠与流线型小扶手
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center bg-[#15120f] rounded-lg p-1 border border-[#2f2720] text-xs">
              <button
                onClick={() => setZoomScale((prev) => Math.max(1.0, prev - 0.3))}
                className="p-1 rounded text-[#9a8d7d] hover:text-[#e8ded0] hover:bg-[#251f19]"
                title="缩小"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-[11px] font-mono text-[#bfb29e]">{zoomScale.toFixed(1)}x</span>
              <button
                onClick={() => setZoomScale((prev) => Math.min(2.8, prev + 0.3))}
                className="p-1 rounded text-[#9a8d7d] hover:text-[#e8ded0] hover:bg-[#251f19]"
                title="放大"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8c7f70] hover:text-[#e8ded0] hover:bg-[#2a221b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Tabs & Live State Quick Switch */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-[#171411] border-b border-[#2d251e] text-xs">
          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 bg-[#221d18] p-1 rounded-xl border border-[#342a21]">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'both'
                  ? 'bg-[#d97736] text-white shadow-md'
                  : 'text-[#9c8e7e] hover:text-[#e5dad0]'
              }`}
            >
              并排对比 (双重视角)
            </button>
            <button
              onClick={() => setActiveTab('empty')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'empty'
                  ? 'bg-[#d97736] text-white shadow-md'
                  : 'text-[#9c8e7e] hover:text-[#e5dad0]'
              }`}
            >
              仅看空椅子态
            </button>
            <button
              onClick={() => setActiveTab('seated')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'seated'
                  ? 'bg-[#d97736] text-white shadow-md'
                  : 'text-[#9c8e7e] hover:text-[#e5dad0]'
              }`}
            >
              仅看小人组合态
            </button>
          </div>

          {/* Room Live State Switch */}
          <div className="flex items-center gap-2">
            <span className="text-[#8c7f70]">当前全景房间工位：</span>
            <div className="flex items-center rounded-xl bg-[#231e19] border border-[#3c3125] p-0.5">
              <button
                onClick={() => onToggleSeatedInRoom(false)}
                className={`flex items-center gap-1.5 px-3 py-1.2 rounded-lg transition-all ${
                  !isSeatedInRoom
                    ? 'bg-[#3b3024] text-[#f4ecd8] font-medium shadow-sm'
                    : 'text-[#8a7d6d] hover:text-[#cfc3b0]'
                }`}
              >
                <Armchair className="w-3.5 h-3.5" />
                空椅待客
              </button>
              <button
                onClick={() => onToggleSeatedInRoom(true)}
                className={`flex items-center gap-1.5 px-3 py-1.2 rounded-lg transition-all ${
                  isSeatedInRoom
                    ? 'bg-[#d97736] text-white font-medium shadow-sm'
                    : 'text-[#8a7d6d] hover:text-[#cfc3b0]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                小人敲代码 (组合态)
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body / Canvas Previews */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Inspection Canvas */}
          <div
            className={`grid gap-6 ${
              activeTab === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-xl mx-auto'
            }`}
          >
            {/* View 1: 空椅子状态 (Empty Chair State) */}
            {(activeTab === 'both' || activeTab === 'empty') && (
              <div className="flex flex-col bg-[#221e1a] rounded-2xl border border-[#382d23] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#28221c] border-b border-[#382d23]">
                  <span className="text-xs font-medium text-[#e4d6c4] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#b58252]" />
                    ① 空椅子时的状态 (手作白橡木温莎椅)
                  </span>
                  {!isSeatedInRoom ? (
                    <span className="text-[11px] text-[#4ade80] flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" /> 场景正在显示
                    </span>
                  ) : (
                    <button
                      onClick={() => onToggleSeatedInRoom(false)}
                      className="text-[11px] text-[#e09867] hover:underline"
                    >
                      应用此状态至场景
                    </button>
                  )}
                </div>

                <div className="relative h-72 flex items-center justify-center bg-[#15120f] overflow-hidden select-none">
                  {/* Subtle 2.5D Isometric Floor Grid lines */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at center, #9c7b5a 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />

                  {/* SVG Stage */}
                  <svg
                    viewBox="-50 -40 100 80"
                    className="w-full h-full"
                    style={{ transform: `scale(${zoomScale})` }}
                  >
                    <defs>
                      <filter id="modalSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                      </filter>
                    </defs>

                    {/* Desk Outline Reference Behind the Chair */}
                    <g opacity="0.35" transform="translate(-15, -7)">
                      {/* Desk edge line */}
                      <line x1="-30" y1="14" x2="40" y2="-6" stroke="#875326" strokeWidth="1.5" strokeDasharray="4 2" />
                      {/* Laptop mockup */}
                      <g transform="translate(15, -2)">
                        <LaptopDisplay />
                      </g>
                    </g>

                    {/* Empty Windsor Chair */}
                    <WindsorChair isSeated={false} />
                  </svg>

                  {/* Perspective Indicator Badge */}
                  <div className="absolute bottom-3 left-3 bg-[#1b1713]/85 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#382d23] text-[10px] text-[#baa894] flex items-center gap-1.5">
                    <Compass className="w-3 h-3 text-[#d97736]" />
                    <span>朝向 NW · 与书桌长边绝对垂直对齐 (斜率 ±0.2852)</span>
                  </div>
                </div>

                {/* Annotation List */}
                <div className="p-4 space-y-2 text-xs text-[#a99c8c] bg-[#1d1915] border-t border-[#2d241c]">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#d97736]/20 text-[#e09867] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="leading-snug">
                      <strong className="text-[#ece4d8]">修身紧凑比例：</strong>
                      座面宽度收拢至匀称贴身的 15.5px，告别原先过宽笨拙感；椅背顶梁与前后沿严格锁定 <code className="text-[#e2935d] font-mono">-0.2852</code> 斜率，与书桌长边绝对平行。
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#d97736]/20 text-[#e09867] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="leading-snug">
                      <strong className="text-[#ece4d8]">纯实木自然车削脚端（无金属铜套）：</strong>
                      彻底去除突兀的工业金属铜套，采用纯手工白橡木车削与天然木蜡油深色收口，完美融入约克郡乡村木屋氛围。
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#d97736]/20 text-[#e09867] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <p className="leading-snug">
                      <strong className="text-[#ece4d8]">久坐舒适工学配置：</strong>
                      配备加厚双层高回弹云朵棉麻坐垫、贴合人体的护脊亚麻腰靠、以及温润流线型实木小扶手，彻底解决硬木椅久坐腰酸背痛问题。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* View 2: 小人组合态 (Combined Seated State) */}
            {(activeTab === 'both' || activeTab === 'seated') && (
              <div className="flex flex-col bg-[#221e1a] rounded-2xl border border-[#382d23] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#28221c] border-b border-[#382d23]">
                  <span className="text-xs font-medium text-[#e4d6c4] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                    ② 椅子与小人组合的状态 (专注编程工作中)
                  </span>
                  {isSeatedInRoom ? (
                    <span className="text-[11px] text-[#4ade80] flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" /> 场景正在显示
                    </span>
                  ) : (
                    <button
                      onClick={() => onToggleSeatedInRoom(true)}
                      className="text-[11px] text-[#e09867] hover:underline"
                    >
                      应用此状态至场景
                    </button>
                  )}
                </div>

                <div className="relative h-72 flex items-center justify-center bg-[#15120f] overflow-hidden select-none">
                  {/* Subtle 2.5D Isometric Floor Grid lines */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at center, #9c7b5a 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />

                  {/* SVG Stage */}
                  <svg
                    viewBox="-50 -40 100 80"
                    className="w-full h-full"
                    style={{ transform: `scale(${zoomScale})` }}
                  >
                    {/* Desk Outline Reference Behind the Chair */}
                    <g opacity="0.45" transform="translate(-15, -7)">
                      <line x1="-30" y1="14" x2="40" y2="-6" stroke="#875326" strokeWidth="1.5" strokeDasharray="4 2" />
                      <g transform="translate(15, -2)">
                        <LaptopDisplay />
                      </g>
                    </g>

                    {/* Windsor Chair Seated Combined */}
                    <WindsorChair isSeated={true} occupant={mockOccupant} />
                  </svg>

                  {/* Posture Indicator Badge */}
                  <div className="absolute bottom-3 left-3 bg-[#1b1713]/85 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#382d23] text-[10px] text-[#baa894] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#38bdf8]" />
                    <span>NW 朝向专注工作 · 双手放于键盘敲字</span>
                  </div>
                </div>

                {/* Annotation List */}
                <div className="p-4 space-y-2 text-xs text-[#a99c8c] bg-[#1d1915] border-t border-[#2d241c]">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#3b82f6]/20 text-[#60a5fa] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="leading-snug">
                      <strong className="text-[#ece4d8]">深陷云感坐垫与腰部释压：</strong>
                      长袍下摆柔和铺展，小人自然微陷于加厚高回弹坐垫中，护脊腰靠温润托住下背腰椎，提供全天专注编程的充盈包裹感。
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#3b82f6]/20 text-[#60a5fa] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="leading-snug">
                      <strong className="text-[#ece4d8]">手肘轻搭小扶手、圆手敏捷敲字：</strong>
                      双臂自然落肩，手肘依托实木流线型小扶手得到放松支撑，3D 饱满圆手轻盈搭在键盘按键上，敲代码轻快惬意。
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#3b82f6]/20 text-[#60a5fa] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <p className="leading-snug">
                      <strong className="text-[#ece4d8]">严格对中顺应轴测：</strong>
                      椅背梳背与蒸汽弯木顶梁紧凑修身、以脊柱 <code className="text-[#60a5fa] font-mono">x=0</code> 严格对称合围，双肩与耳机顺应 <code className="text-[#60a5fa] font-mono">-0.2852</code> 轴测斜率，朝向书桌深处。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Technical Explanation Card */}
          <div className="p-4 rounded-xl bg-[#231e19] border border-[#3b3024] text-xs text-[#b8ab9a] space-y-2">
            <div className="flex items-center gap-2 text-[#e8ded0] font-medium">
              <Compass className="w-4 h-4 text-[#d97736]" />
              <span>为什么椅子朝向必须是 NW（西北）并与书桌垂直对齐？</span>
            </div>
            <p className="leading-relaxed text-[#9a8e80]">
              在当前 2.5D 轴测世界中，白橡木书桌的长边沿 <code className="text-[#e2935d] font-mono">U 轴 (斜率 -0.2852)</code> 延伸，桌子的进深短边沿 <code className="text-[#e2935d] font-mono">V 轴 (斜率 +0.2852)</code> 延伸。坐在桌前面对电脑时，视线与正面朝向在空间中正是指向 <strong className="text-[#ece4d8]">NW（西北，沿深处桌案方向）</strong>。
            </p>
            <p className="leading-relaxed text-[#9a8e80]">
              此前椅子的座面与靠背沿完全水平的平面绘制，导致与倾斜 <code className="text-[#e2935d] font-mono">15.9°</code> 的书桌产生了明显的旋转角度脱节。在本次修正中，椅子的宽度轴与靠背顶梁完全锁定至 <code className="text-[#e2935d] font-mono">-0.2852</code> 斜率，进深轴对齐 <code className="text-[#e2935d] font-mono">+0.2852</code> 斜率，达到了完美的空间正交垂直对齐。
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#201b17] border-t border-[#2d251e]">
          <div className="text-xs text-[#8c7e6e]">
            提示：在主房间中直接点击工位椅子，也可即时切换「空椅待客」与「小人沉浸工作」状态。
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#d97736] hover:bg-[#eb8643] text-white text-xs font-medium transition-colors shadow-md"
          >
            完成检视
          </button>
        </div>
      </div>
    </div>
  );
};
