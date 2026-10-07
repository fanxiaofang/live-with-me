import { Check, Copy, Download, ExternalLink, Eye, Image as ImageIcon, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTimerScope } from '../shared/timers/useTimerScope';

interface SvgExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SvgExportModal: React.FC<SvgExportModalProps> = ({ isOpen, onClose }) => {
  const timers = useTimerScope(isOpen);
  const [copiedView, setCopiedView] = useState<string | null>(null);
  useEffect(() => { if (!isOpen) setCopiedView(null); }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async (filename: string, label: string) => {
    try {
      const response = await fetch(`/${filename}`);
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

  const views = [
    {
      id: 'hills',
      title: '约克郡田园山丘完整地貌 (Hills & Mountains Landscape)',
      desc: '包含折纸低多边形山脉、阶梯麦田、山脚森林树林带与连绵草坡台地',
      filename: 'yorkshire-hills-landscape.svg',
      preview: '/yorkshire-hills-landscape.svg',
    },
    {
      id: 'all',
      title: '短发 4 视图设计全表 (Turnaround Sheet)',
      desc: '包含正面(SE)、左侧(SW)、正后(NW)、右侧(NE) 4 大视图与标准色板',
      filename: 'character-shorthair-4views.svg',
      preview: '/character-shorthair-4views.svg',
      isFullSheet: true,
    },
    {
      id: 'front',
      title: '01 · 正面视图 (Front View)',
      desc: 'SE 朝向 · 饱满圆脸 · 微八字月牙刘海 · 双手自然端茶',
      filename: 'character-shorthair-front.svg',
      preview: '/character-shorthair-front.svg',
    },
    {
      id: 'left',
      title: '02 · 左侧视图 (Left Profile)',
      desc: 'SW 朝向 · 侧面饱满轮廓 · 额侧探出微翘月牙发梢',
      filename: 'character-shorthair-left.svg',
      preview: '/character-shorthair-left.svg',
    },
    {
      id: 'back',
      title: '03 · 背面视图 (Back View)',
      desc: 'NW 朝向 · 毛线帽饱满包裹后脑勺 · 利落短发后发际 · 零穿模',
      filename: 'character-shorthair-back.svg',
      preview: '/character-shorthair-back.svg',
    },
    {
      id: 'right',
      title: '04 · 右侧视图 (Right Profile)',
      desc: 'NE 朝向 · 侧向右侧对称平衡 · 轴测空间走廊对齐',
      filename: 'character-shorthair-right.svg',
      preview: '/character-shorthair-right.svg',
    },
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
              <h2 className="text-base font-bold text-[#f5eee4]">导出 经典短发 4 视图 SVG</h2>
              <p className="text-xs text-[#9c8e7e]">
                纯矢量矢量图 (Pure Vector SVG) · 适配 Figma / Illustrator / 网页开发
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
          {/* Main 4-View Sheet Banner Card */}
          <div className="p-4 rounded-xl bg-[#231d18] border border-[#3b3026] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#c4794e]/20 text-[#e0a96d] border border-[#c4794e]/40">
                    4 视图总表推荐
                  </span>
                  <span className="text-sm font-semibold text-[#f5eee4]">
                    短发 4 视图设计规范总表 (SVG)
                  </span>
                </div>
                <p className="text-xs text-[#968777]">
                  包含正前、左侧、正后、右侧 4 大轴测视图、色板标尺与特征解析，1000×700 高清矢量画布。
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy('character-shorthair-4views.svg', '4视图总表')}
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
                  onClick={() => handleDownload('character-shorthair-4views.svg')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#c4794e] hover:bg-[#b56d43] text-xs font-medium text-[#ffffff] flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载总表 SVG</span>
                </button>
                <a
                  href="/character-shorthair-4views.svg"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-[#2e2620] hover:bg-[#3d3229] text-[#9c8e7e] hover:text-[#ded5c7] border border-[#4a3e33] transition-colors"
                  title="新标签页预览"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Preview Frame */}
            <div className="mt-3 rounded-lg overflow-hidden border border-[#332921] bg-[#171412] p-2 flex items-center justify-center">
              <img
                src="/character-shorthair-4views.svg"
                alt="4 视图总表预览"
                className="w-full max-h-56 object-contain rounded"
              />
            </div>
          </div>

          {/* 4 Individual Views Grid */}
          <div>
            <div className="text-xs font-semibold text-[#b5aa9d] mb-3 flex items-center justify-between">
              <span>单独单视角 SVG 导出 (1:1 独立矢量组件)：</span>
              <span className="text-[11px] text-[#7d7164]">点击直接下载或复制独立 SVG</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {views.slice(1).map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-xl bg-[#211b17] border border-[#332a22] flex items-center justify-between gap-3 hover:border-[#473b30] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-14 rounded-lg bg-[#181412] border border-[#2d241d] flex items-center justify-center shrink-0 p-1">
                      <img src={v.preview} alt={v.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#f0e8dc] truncate">{v.title}</div>
                      <div className="text-[11px] text-[#857769] truncate mt-0.5">{v.desc}</div>
                      <div className="text-[10px] text-[#c4794e] font-mono mt-0.5">{v.filename}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(v.filename, v.title)}
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
                      onClick={() => handleDownload(v.filename)}
                      className="p-1.5 rounded-lg bg-[#3b3027] hover:bg-[#4a3d31] text-[#f5eee4] border border-[#524436] transition-colors"
                      title="下载 SVG 文件"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`/${v.filename}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-[#2a221b] hover:bg-[#382f27] text-[#8c8072] hover:text-[#ded5c7] border border-[#3d3329] transition-colors"
                      title="在新标签页打开"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#2d251f] bg-[#221c18] flex items-center justify-between">
          <div className="text-xs text-[#807466]">
            文件保存在 <code className="text-[#a89988] bg-[#2e2620] px-1.5 py-0.5 rounded">/public/character-shorthair-*.svg</code>
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
