import { Armchair, ChevronDown, ChevronUp, Edit3, Image as ImageIcon, Users } from 'lucide-react';
import React, { useState } from 'react';
import { LIFE_STATES, ROOMS } from '../data/initialData';
import { Person } from '../types';
import { CharacterHead } from './CharacterAvatar';

import { isRoomFull, PresenceAllocation, ROOM_FULL_MESSAGE } from '../features/presence/presenceAllocation';

interface PresencePanelProps {
  people: Person[];
  allocation: PresenceAllocation;
  onSelectPerson: (person: Person) => void;
  onEditMyStatus: () => void;
  onOpenSvgExport?: () => void;
  onOpenChairInspector?: () => void;
}

export const PresencePanel: React.FC<PresencePanelProps> = ({
  people,
  allocation,
  onSelectPerson,
  onEditMyStatus,
  onOpenSvgExport,
  onOpenChairInspector,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const me = people.find((p) => p.isSelf);
  const friends = people.filter((p) => !p.isSelf);

  if (isCollapsed) {
    return (
      <aside aria-label="同住人状态" className="fixed top-14 left-5 z-20 pointer-events-auto">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e1c19]/85 backdrop-blur-md border border-[#3b332b] shadow-xl text-xs text-[#cfc5b6] hover:text-white hover:border-[#524538] transition-all group"
          title="展开同住人面板"
        >
          <span className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse" />
          <Users className="w-3.5 h-3.5 text-[#d68c68]" />
          <span className="font-medium text-[11px] text-[#e3ded4]">同一屋檐下 ({people.length})</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#8a7f72] group-hover:text-[#e3ded4]" />
        </button>
      </aside>
    );
  }

  return (
    <aside aria-label="同住人状态" className="fixed top-14 left-5 z-20 pointer-events-auto max-w-[280px]">
      <div className="p-3 rounded-2xl bg-[#1e1c19]/85 backdrop-blur-md border border-[#3b332b] shadow-xl space-y-2.5">
        {/* Header indicator */}
        <div className="flex items-center justify-between text-[11px] text-[#9c9183] px-1 pb-1 border-b border-[#302a24]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#52b788] animate-pulse" />
            <span className="font-medium text-[#e3ded4]">同一屋檐下</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#786e63]">静默在场</span>
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-[#8a7f72] hover:text-[#e3ded4] p-0.5 rounded transition-colors"
              title="收起面板（查看完整约克郡风光）"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* My Status Card */}
        {me && (
          <div
            onClick={onEditMyStatus}
            className="p-2.5 rounded-xl bg-[#282420] border border-[#423930] hover:border-[#c4794e]/60 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full overflow-hidden border border-white/15 shrink-0 flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: me.shirtColor }}
                >
                  <svg viewBox="-9 -25 18 19" className="w-7 h-7">
                    <CharacterHead
                      cx={0}
                      cy={-14}
                      r={7}
                      skinColor={me.skinColor}
                      hairColor={me.hairColor}
                      hairStyle={me.hairStyle}
                      beanieColor={me.beanieColor}
                      hasPompom={me.hasPompom}
                      showBeanie={true}
                    />
                  </svg>
                </div>
                <div className="text-xs font-medium text-[#f0e8dc] flex items-center gap-1.5">
                  <span>{LIFE_STATES[me.currentState]?.emoji}</span>
                  <span>{LIFE_STATES[me.currentState]?.label}</span>
                </div>
              </div>
              <Edit3 className="w-3 h-3 text-[#7d7367] group-hover:text-[#d68c68] transition-colors" />
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#8c8275]">
              <span>{ROOMS[me.currentRoom]?.name.split('&')[0]}</span>
              <span className="text-[#a89d8f] underline underline-offset-2 decoration-[#5c5144]">
                更换状态与装扮
              </span>
            </div>
            {isRoomFull(allocation, me.id) && <p role="status" className="mt-1 text-[10px] text-[#d6a77b]">{ROOM_FULL_MESSAGE}</p>}
          </div>
        )}

        {/* Friends Status Cards */}
        <div className="space-y-1.5 pt-0.5">
          <div className="text-[10px] text-[#7d7265] px-1">正在度过时光的好友：</div>
          {friends.map((friend) => {
            const state = LIFE_STATES[friend.currentState];
            const room = ROOMS[friend.currentRoom];
            return (
              <div
                key={friend.id}
                onClick={() => onSelectPerson(friend)}
                className="p-2 rounded-xl bg-[#231f1c] border border-[#362f27] hover:border-[#4d4237] transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full overflow-hidden border border-white/15 shrink-0 flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: friend.shirtColor }}
                  >
                    <svg viewBox="-9 -25 18 19" className="w-7 h-7">
                      <CharacterHead
                        cx={0}
                        cy={-14}
                        r={7}
                        skinColor={friend.skinColor}
                        hairColor={friend.hairColor}
                        hairStyle={friend.hairStyle}
                        beanieColor={friend.beanieColor}
                        hasPompom={friend.hasPompom}
                        showBeanie={true}
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-[#e3dad0] font-medium flex items-center gap-1">
                      <span>{friend.name}</span>
                      <span className="text-[11px]">{state?.emoji}</span>
                      <span className="text-[11px] text-[#ad9f8f]">{state?.label}</span>
                    </div>
                    <div className="text-[10px] text-[#7d7367] mt-0.5">
                      {room?.name.split('&')[0]} · {friend.sinceTime.split('已安静')[1] || friend.sinceTime}
                      {isRoomFull(allocation, friend.id) && <p role="status" className="mt-1 text-[#d6a77b]">{ROOM_FULL_MESSAGE}</p>}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-[#6b6053] group-hover:text-[#c4794e] transition-colors">
                  查看
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick Tools Buttons */}
        <div className="pt-2 border-t border-[#302a24] space-y-1.5">
          {onOpenChairInspector && (
            <button
              type="button"
              onClick={onOpenChairInspector}
              className="w-full py-1.5 px-2 rounded-lg bg-[#26201b] hover:bg-[#332b24] border border-[#3b3127] hover:border-[#4d4033] text-[11px] text-[#c9bcad] hover:text-[#f0e8dc] flex items-center justify-center gap-1.5 transition-all group"
            >
              <Armchair className="w-3.5 h-3.5 text-[#d97736] group-hover:scale-110 transition-transform" />
              <span>检视工位椅子 (空椅 / 组合态)</span>
            </button>
          )}

          {onOpenSvgExport && (
            <button
              type="button"
              onClick={onOpenSvgExport}
              className="w-full py-1.5 px-2 rounded-lg bg-[#26201b] hover:bg-[#332b24] border border-[#3b3127] hover:border-[#4d4033] text-[11px] text-[#c9bcad] hover:text-[#f0e8dc] flex items-center justify-center gap-1.5 transition-all group"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#c4794e] group-hover:scale-110 transition-transform" />
              <span>导出 短发 4 视图 SVG</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
