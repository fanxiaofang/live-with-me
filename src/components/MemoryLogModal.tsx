import React from 'react';
import { LivingMemory } from '../types';
import { X, Sparkles, Calendar, Users, Heart } from 'lucide-react';

interface MemoryLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: LivingMemory[];
}

export const MemoryLogModal: React.FC<MemoryLogModalProps> = ({
  isOpen,
  onClose,
  memories,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="memory-log-modal"
        className="w-full max-w-lg bg-[#201d1a] border border-[#443c34] rounded-2xl shadow-2xl overflow-hidden text-[#e8e2d8] flex flex-col max-h-[80vh]"
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#36302a] flex items-center justify-between bg-[#272320]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3b322a] border border-[#524436] flex items-center justify-center text-[#d68c68]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-wide text-[#f2ece2]">共同生活记忆</h2>
              <p className="text-xs text-[#a39a8f] mt-0.5">
                共同度过的安静夜晚、留下的植物与信笺
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9c9186] hover:text-[#f2ece2] hover:bg-[#38312b] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Memories */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {memories.map((mem) => (
            <div
              key={mem.id}
              className="p-4 rounded-xl bg-[#26221f] border border-[#3c342d] space-y-2 hover:border-[#52463b] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{mem.icon}</span>
                  <span className="text-xs font-semibold text-[#f0e8dc]">{mem.title}</span>
                </div>
                <span className="text-[11px] text-[#82776a] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {mem.timestamp}
                </span>
              </div>
              <p className="font-serif text-xs leading-relaxed text-[#cfc5b6]">
                {mem.desc}
              </p>
              <div className="pt-1.5 flex items-center gap-2 text-[10px] text-[#8a7f72]">
                <Users className="w-3 h-3 text-[#d68c68]" />
                <span>一起生活的：{mem.participants.join('、')}</span>
              </div>
            </div>
          ))}

          <div className="p-4 rounded-xl border border-dashed border-[#3a322a] text-center text-xs text-[#786e63]">
            <p className="font-serif italic">“时间慢慢流走，留下的都是安静的陪伴与微光。”</p>
          </div>
        </div>
      </div>
    </div>
  );
};
