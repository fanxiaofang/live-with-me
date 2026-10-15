import { X } from 'lucide-react';
import React, { useId, useRef } from 'react';
import { useDialogFocus } from '../../shared/hooks/useDialogFocus';
import { SvgDetailView } from '../inspection/SvgDetailView';
import type { RoomLayoutConfig } from '../layout-gizmo';
import { CABINET_DETAILS, type CabinetPartId } from './cabinetDetails';
import { RecordCabinet } from './RecordCabinet';

interface CabinetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  layout: RoomLayoutConfig;
  selectedPart: CabinetPartId;
  onSelectPart: (id: CabinetPartId) => void;
}

export function CabinetDetailModal({ isOpen, onClose, layout, selectedPart, onSelectPart }: CabinetDetailModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(isOpen, panel, onClose);
  if (!isOpen) return null;
  const detail = CABINET_DETAILS.find(item => item.id === selectedPart) ?? CABINET_DETAILS[0];
  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div ref={panel} tabIndex={-1} className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-[#523b2c] bg-[#211712] text-[#f7f2ea] shadow-2xl overflow-hidden">
        <header className="flex shrink-0 items-center justify-between gap-3 px-5 py-4 border-b border-[#3d2a1f] bg-[#291d17]">
          <div>
            <h2 id={titleId} className="text-base sm:text-lg font-medium">咖啡与黑胶角</h2>
            <p className="mt-1 text-xs text-[#c3ad97]">看看木柜和每一件日常小物 · 当前房间陈设</p>
          </div>
          <button type="button" aria-label="关闭咖啡黑胶柜" onClick={onClose}
            className="p-2 rounded-lg text-[#d5bea6] hover:text-[#faf5ee] hover:bg-[#493123]"><X className="w-5 h-5" /></button>
        </header>
        <div className="min-h-0 overflow-y-auto p-4 sm:p-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
            <SvgDetailView label="柜子细节视图" initialBounds={{ x: -62, y: -48, width: 124, height: 100 }} focusItem={selectedPart}>
              <RecordCabinet layout={layout} onInspect={onSelectPart} />
            </SvgDetailView>
            <div>
              <p className="mb-2 text-xs text-[#c3ad97]">选择一件小物，靠近看看</p>
              <div className="flex flex-wrap gap-2 lg:flex-col">
                {CABINET_DETAILS.map(item => (
                  <button key={item.id} type="button" aria-pressed={selectedPart === item.id} onClick={() => onSelectPart(item.id)}
                    className={`rounded-lg border px-3 py-2.5 text-left text-xs ${selectedPart === item.id
                      ? 'border-[#b58851] bg-[#493123] text-[#fff1dc]' : 'border-[#4b3526] text-[#d5bea6] hover:bg-[#35241a]'}`}>
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 border-t border-[#493123] pt-4">
            <h3 className="text-sm font-medium text-[#f6ddbb]">{detail.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#d5bea6]">{detail.description}</p>
          </div>
        </div>
        <footer className="shrink-0 border-t border-[#3d2a1f] bg-[#291d17] px-5 py-3 text-xs text-[#c3ad97]">放大与拖动只改变这里的视角，家具仍留在原处。</footer>
      </div>
    </div>
  );
}
