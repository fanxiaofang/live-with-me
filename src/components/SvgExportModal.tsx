import { Check, Copy, Download, ExternalLink, Eye, Image as ImageIcon, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTimerScope } from '../shared/timers/useTimerScope';
import { useDialogFocus } from '../shared/hooks/useDialogFocus';
import { CHARACTER_PREVIEW_PALETTE } from './characters/characterPreviewPalette';

interface SvgExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SvgExportModal: React.FC<SvgExportModalProps> = ({ isOpen, onClose }) => {
  const timers = useTimerScope(isOpen);
  const panel = useRef<HTMLDivElement>(null);
  const [pose, setPose] = useState<'seated' | 'standing'>('standing');
  const [hairstyle, setHairstyle] = useState<'short' | 'curly' | 'sidepart' | 'shaggy'>('short');
  const [standingView, setStandingView] = useState<'shape' | 'comparison' | 'ground' | 'surfaces'>('shape');
  const [copiedView, setCopiedView] = useState<string | null>(null);
  useEffect(() => { setCopiedView(null); }, [isOpen, hairstyle, pose, standingView]);
  useDialogFocus(isOpen, panel, onClose);

  if (!isOpen) return null;

  const handleCopy = async (filename: string, label: string) => {
    try {
      const response = await fetch(`/${filename}`);
      if (!response.ok) throw new Error('SVG asset unavailable');
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      if (!timers.isActive) return;
      setCopiedView(label);
      timers.schedule('copy-feedback', () => setCopiedView(null), 2000);
    } catch {
      if (!timers.isActive) return;
      // Fallback
      setCopiedView('复制失败');
      timers.schedule('copy-feedback', () => setCopiedView(null), 2000);
    }
  };

  const handleDownload = (filename: string) => {
    const a = document.createElement('a');
    a.href = `/${filename}`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const curly = hairstyle === 'curly';
  const sidepart = hairstyle === 'sidepart';
  const shaggy = hairstyle === 'shaggy';
  const standing = pose === 'standing';
  const shortStanding = standing && hairstyle === 'short';
  const seatedNwStudy = !standing;
  const hairLabel = shaggy ? '双色蓬松碎发' : sidepart ? '偏分低束发' : curly ? '层叠长卷发' : '经典短发';
  const fiveViews = seatedNwStudy || (standing && (!shortStanding || standingView === 'shape'));
  const poseLabel = shaggy ? `双色蓬松碎发${standing ? '站姿' : '坐姿'}` : sidepart ? `偏分低束发${standing ? '站姿' : '坐姿'}` : curly ? standing ? '长卷发站姿' : '长卷发坐姿' : standing ? '长袍站姿' : '标准坐姿';
  const filenamePrefix = `${shaggy ? 'character-shaggy' : sidepart ? 'character-sidepart' : curly ? 'character-curly' : 'character-shorthair'}${standing ? '-standing' : ''}`;
  const sheetFilename = seatedNwStudy ? `${filenamePrefix}-seated-5views-study.svg`
    : shortStanding && standingView === 'comparison' ? 'character-shorthair-proportion-comparison.svg'
    : shortStanding && standingView === 'ground' ? 'character-shorthair-standing-ground-4views.svg'
    : shortStanding && standingView === 'surfaces' ? 'character-shorthair-standing-surfaces.svg' : `${filenamePrefix}-${fiveViews ? '5' : '4'}views.svg`;
  const sheetLabel = seatedNwStudy ? `${hairLabel}坐姿四视图 + NW${hairstyle === 'short' ? '（当前定稿）' : ''}`
    : fiveViews ? `${shaggy ? '双色蓬松碎发' : sidepart ? '偏分低束发' : curly ? '层叠长卷发' : '长袍'}站姿五视图总表` : shaggy ? `${poseLabel}四视图总表` : sidepart ? `偏分低束发${standing ? '站姿' : '坐姿'}四视图总表` : curly ? standing ? '层叠长卷发站姿四视图总表' : '层叠长卷发四视图总表' : standing && standingView === 'comparison' ? '坐站同头大小对照'
    : standing && standingView === 'ground' ? '浅轴测地面参照'
    : standing && standingView === 'surfaces' ? '木地板与草地接地对照' : `${poseLabel}四视图总表`;
  const views = [
    {
      id: 'front',
      title: '01 · 正面视图 (Front View)',
      desc: shaggy ? 'SE 朝向 · 碎刘海长短错落 · 两侧外翘' : sidepart ? 'SE 朝向 · 一侧长前发 · 另一侧收向耳后' : curly ? 'SE 朝向 · 帽下分束 · 脸侧卷梢自然展开' : standing ? 'SE 朝向 · 自然落肩 · 双手垂在袖口旁 · 袍摆盖脚' : 'SE 朝向 · 微八字月牙刘海 · 双手交叠于膝前',
    },
    {
      id: 'left',
      title: '02 · 左侧视图 (Left Profile)',
      desc: shaggy ? 'SW 朝向 · 脸侧分束 · 后颈深色底发' : sidepart ? 'SW 朝向 · 耳后侧 · 远侧长前发窄轮廓' : curly ? 'SW 朝向 · 脸侧内弯 · 长后发层叠外翻' : standing ? 'SW 朝向 · 近侧袖在前 · 袍身自然垂坠' : 'SW 朝向 · 侧面饱满轮廓 · 额侧月牙发梢',
    },
    {
      id: 'back',
      title: '03 · 背面视图 (Back View)',
      desc: shaggy ? 'NW 朝向 · 浅色上层 · 深色后颈碎发' : sidepart ? 'NW 朝向 · 紧凑后发 · 小发束与发尾' : curly ? 'NW 朝向 · 层叠长发覆盖肩背' : standing ? 'NW 朝向 · 后领与背缝 · 统一落地位置' : 'NW 朝向 · 毛线帽包裹后脑勺 · 利落短发后发际',
    },
    {
      id: 'right',
      title: '04 · 右侧视图 (Right Profile)',
      desc: shaggy ? 'NE 朝向 · 与左侧对应 · 两层短碎发' : sidepart ? 'NE 朝向 · 长前发侧 · 太阳穴垂落主发片' : curly ? 'NE 朝向 · 与左侧对应转向' : standing ? 'NE 朝向 · 与左侧共享比例 · 袍摆盖脚' : 'NE 朝向 · 侧向右侧对称平衡',
    },
    ...(standing ? [{ id: 'nw', title: '05 · NW 斜侧视图', desc: '定稿的背左斜侧站姿 · 保留独立背面视图' }]
      : [{id:'seated-nw-floor-study',title:`05 · NW 斜侧坐姿${hairstyle === 'short' ? '（当前定稿）' : ''}`,desc:'共用定稿收腿身体 · 配用各自定稿 NW 头部'}]),
  ];

  return (
    <div
      id="svg-export-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panel} role="dialog" aria-modal="true" aria-labelledby="svg-export-title" tabIndex={-1}
        id="svg-export-modal-dialog"
        className="w-full max-w-3xl max-h-[90vh] bg-[#1a1613] border border-[#3d332a] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#e8dfd5]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d251f] bg-[#221c18]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2e241d] border border-[#4a392c] flex items-center justify-center text-[#d9a066]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 id="svg-export-title" className="text-base font-bold text-[#f5eee4]">人物五视图 · 查看与导出</h2>
              <p className="text-xs text-[#c3b29e]">
                四款发型均可查看和导出站姿、坐姿五方向
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭导出窗口"
            className="p-1.5 rounded-lg text-[#8c7f71] hover:text-[#ded5c7] hover:bg-[#2b231d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex flex-wrap gap-2" role="group" aria-label="人物发型">
            {(['short', 'curly', 'sidepart', 'shaggy'] as const).map(option => <button key={option} type="button"
              aria-pressed={hairstyle === option} onClick={() => setHairstyle(option)}
              className={`px-3.5 py-2 rounded-lg text-sm border ${hairstyle === option ? 'bg-[#93603d] border-[#b77a50] text-[#fff5e9]' : 'border-[#5a4534] text-[#d6c6b4] hover:bg-[#34271f]'}`}>
              {option === 'short' ? '经典短发' : option === 'curly' ? '层叠长卷发' : option === 'sidepart' ? '偏分低束发' : '双色蓬松碎发'}
            </button>)}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="人物姿态">
            {(['seated', 'standing'] as const).map(option => <button key={option} type="button"
              aria-pressed={pose === option} onClick={() => setPose(option)}
              className={`px-3.5 py-2 rounded-lg text-sm border ${pose === option ? 'bg-[#93603d] border-[#b77a50] text-[#fff5e9]' : 'border-[#5a4534] text-[#d6c6b4] hover:bg-[#34271f]'}`}>
              {option === 'seated' ? '坐姿四视图 + NW' : '站姿五视图'}
            </button>)}
          </div>
          {shortStanding && <label className="flex flex-wrap items-center gap-3 text-sm text-[#d6c6b4]">
            站姿查看内容
            <select aria-label="站姿查看内容" value={standingView} onChange={event => setStandingView(event.target.value as typeof standingView)}
              className="rounded-lg border border-[#5a4534] bg-[#2b211a] px-3 py-2 text-[#f5ede2]">
              <option value="shape">比例五视图</option>
              <option value="comparison">坐站同头大小对照</option>
              <option value="ground">浅轴测地面参照</option>
              <option value="surfaces">木地板与草地接地对照</option>
            </select>
          </label>}
          {/* Main 4-View Sheet Banner Card */}
          <div className="p-4 rounded-xl bg-[#231d18] border border-[#3b3026] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#c4794e]/20 text-[#e0a96d] border border-[#c4794e]/40">
                    {fiveViews ? '5 视图总表' : '视图总表'}
                  </span>
                  <span className="text-sm font-semibold text-[#f5eee4]">
                    {sheetLabel}
                  </span>
                </div>
                <p className="text-xs text-[#c3b29e]">
                  {seatedNwStudy ? 'NW 共用定稿收腿坐姿身体，配用各自的定稿 NW 头部与发型；原四视图保持。'
                    : shaggy ? '浅麦金碎刘海、两侧外翘发梢与深色后颈底发，坐站共享同一头部。'
                    : sidepart ? '偏分长前发、耳后收拢与后颈小发束，左右侧面分别展示发型的两侧。'
                    : curly ? standing ? '与坐姿共享头部和卷发，标准站高约 48，长袍自然垂落并盖住脚。'
                    : '帽下分束、脸侧卷梢与肩背长发，四个朝向按相同倍率展示。'
                    : standing ? standingView === 'comparison' ? '坐站按相同头圆直径、相同倍率展示，便于比较肩颈与袍身。'
                    : standingView === 'ground' ? '地面斜线约为 ±15.81°，检查人物接地位置、朝向与小尺寸轮廓。'
                    : standingView === 'surfaces' ? '木地板和草地按同倍率展示，左侧放大参照、右侧约 65px 高，比较接地效果。'
                    : '站高约 48 场景单位，约 3.2 头身；接触阴影贴住袍摆。'
                    : '蒲团坐高约 35 场景单位，与站姿保持相同头部大小；侧坐胸腹舒展，圆手轻放在膝面。'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0 max-w-full">
                <button
                  type="button"
                  onClick={() => handleCopy(sheetFilename, '4视图总表')}
                  className="px-3 py-1.5 rounded-lg bg-[#2e2620] hover:bg-[#3d3229] text-xs font-medium text-[#ded5c7] border border-[#4a3e33] flex items-center gap-1.5 transition-colors"
                >
                  {copiedView === '4视图总表' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#38ef7d]" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制代码</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(sheetFilename)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#c4794e] hover:bg-[#b56d43] text-xs font-medium text-[#ffffff] flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载总表 SVG</span>
                </button>
                <a
                  href={`/${sheetFilename}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#2e2620] hover:bg-[#3d3229] text-xs text-[#ded5c7] border border-[#4a3e33] transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{fiveViews ? '打开完整五视图' : '打开完整视图'}</span>
                </a>
              </div>
            </div>

            {/* Preview Frame */}
            <div style={{ backgroundColor: CHARACTER_PREVIEW_PALETTE.background }}
              className="mt-3 rounded-lg overflow-hidden border border-[#8c8276] p-2 flex items-center justify-center">
              <img
                src={`/${sheetFilename}`}
                alt={`${sheetLabel}预览`}
                className={`w-full ${hairstyle !== 'short' ? 'max-h-[min(24rem,40vh)]' : 'max-h-56'} object-contain rounded`}
              />
            </div>
          </div>

          {seatedNwStudy && <a href="/character-seated-nw-review.html" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#f0c394] underline underline-offset-4">
            <Eye className="w-4 h-4"/>查看四款发型 NW 坐姿同倍率对照
          </a>}

          {/* 4 Individual Views Grid */}
          <div>
            <div className="text-xs font-semibold text-[#b5aa9d] mb-3 flex items-center justify-between">
              <span>单独单视角 SVG 导出 (1:1 独立矢量组件)：</span>
              <span className="text-[11px] text-[#c3b29e]">下载或复制独立 SVG</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {views.map((v) => {
                const filename = `${filenamePrefix}-${v.id}.svg`;
                return (
                <div
                  key={v.id}
                  className="p-3.5 rounded-xl bg-[#211b17] border border-[#332a22] flex items-center justify-between gap-3 hover:border-[#473b30] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div style={{ backgroundColor: CHARACTER_PREVIEW_PALETTE.background }}
                      className="w-12 h-14 rounded-lg border border-[#8c8276] flex items-center justify-center shrink-0 p-1">
                      <img src={`/${filename}`} alt={`${poseLabel} · ${v.title}`} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#f0e8dc] truncate">{v.title}</div>
                      <div className="text-[11px] text-[#c3b29e] truncate mt-0.5">{v.desc}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(filename, v.title)}
                      aria-label={`复制${poseLabel}${v.title} SVG`}
                      className="p-1.5 rounded-lg bg-[#2a221b] hover:bg-[#382f27] text-[#ded5c7] border border-[#3d3329] transition-colors"
                      title="复制 SVG 代码"
                    >
                      {copiedView === v.title ? (
                        <Check className="w-3.5 h-3.5 text-[#38ef7d]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(filename)}
                      aria-label={`下载${poseLabel}${v.title} SVG`}
                      className="p-1.5 rounded-lg bg-[#3b3027] hover:bg-[#4a3d31] text-[#f5eee4] border border-[#524436] transition-colors"
                      title="下载 SVG 文件"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`/${filename}`}
                      aria-label={`预览${poseLabel}${v.title}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-[#2a221b] hover:bg-[#382f27] text-[#8c8072] hover:text-[#ded5c7] border border-[#3d3329] transition-colors"
                      title="在新标签页打开"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ); })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#2d251f] bg-[#221c18] flex items-center justify-between">
          <div className="text-xs text-[#c3b29e]">
            纯 SVG，缩放后保持清晰
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#2e2620] hover:bg-[#3a3028] text-xs font-medium text-[#ded5c7] border border-[#44382e] transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
