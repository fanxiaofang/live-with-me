import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import type { Person } from '../../types';
import type { TierConfig } from '../../components/bookshelf/bookshelfTypes';
import type { InteractionTarget } from '../interactions/interactionTypes';
import { describeInteraction } from '../interactions/registry';
export interface WorldOverlaysProps {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetOverview: () => void;
  hoveredObject: InteractionTarget | null;
  people: Person[];
  interactionTiers: TierConfig[];
  isInspectorOpen: boolean;
  alienTransmissionText: string | null;
  setAlienTransmissionText: (value: string | null) => void;
  triggerAlienSignal: () => void;
}
export function WorldOverlays({ handleZoomIn, handleZoomOut, handleResetOverview, hoveredObject, people, interactionTiers, isInspectorOpen, alienTransmissionText, setAlienTransmissionText, triggerAlienSignal }: WorldOverlaysProps) {
  return <>      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#1e1c19]/85 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 shadow-lg">
        <button
          onClick={handleZoomIn}
          title="放大画面"
          className="w-7 h-7 flex items-center justify-center rounded-full text-[#c8bfa8] hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          title="缩小镜头（查看全景）"
          className="w-7 h-7 flex items-center justify-center rounded-full text-[#c8bfa8] hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-3.5 bg-white/15 mx-0.5" />
        <button
          onClick={handleResetOverview}
          title="重置为田园全景"
          className="flex items-center gap-1.5 px-2.5 h-7 rounded-full text-xs font-medium text-[#d8cfbe] hover:text-white hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>田园全景</span>
        </button>
      </div>

      {/* Subtle interaction whisper */}
      <div className="absolute bottom-6 right-6 hidden md:block z-10 pointer-events-none opacity-60 hover:opacity-90 transition-opacity">
        <span className="text-[11px] text-[#b8ab96] bg-[#141210]/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/5">
          约克郡谷箱庭全景 · 滚轮自由缩放 · 拖拽漫游
        </span>
      </div>

      {/* Contextual Hover Whispers */}
      {hoveredObject && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <div className="px-3.5 py-1.5 rounded-full bg-[#1e1c1a]/85 backdrop-blur-md border border-[#ffffff]/10 text-xs text-[#e6ded0] shadow-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d68c68] animate-pulse" />
            <span>
              {describeInteraction(hoveredObject, { people, tiers: interactionTiers, editing: isInspectorOpen })}
            </span>
          </div>
        </div>
      )}

      {/* Decoded Alien Transmission Card */}
      {alienTransmissionText && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[92%] sm:w-auto">
          <div className="px-4 py-3 rounded-2xl bg-[#09130d]/94 backdrop-blur-xl border border-[#38ef7d]/40 text-xs text-[#d1fae5] shadow-2xl shadow-[#38ef7d]/10 flex items-start gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38ef7d] animate-ping mt-1 shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#38ef7d]">
                  DEEP SPACE SETI · 1420.405 MHz
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAlienTransmissionText(null);
                  }}
                  className="text-[#6ee7b7] hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-white/10"
                >
                  ✕
                </button>
              </div>
              <p className="text-[12px] text-[#ecfdf5] leading-relaxed font-mono">
                {alienTransmissionText}
              </p>
              <div className="flex items-center justify-between pt-1 text-[10px] text-[#6ee7b7]/80">
                <span>示波器捕获频率：脉冲正弦波稳定</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerAlienSignal();
                  }}
                  className="underline hover:text-white"
                >
                  继续接收下一个频段 →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


  </>;
}
