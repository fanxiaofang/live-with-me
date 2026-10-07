import React from 'react';
import { Person } from '../types';
import { LIFE_STATES, ROOMS } from '../data/initialData';
import { X, Send, Gift, MapPin, Clock, Heart, Coffee } from 'lucide-react';
import { CharacterHead } from './CharacterAvatar';

interface FriendCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person | null;
  onOpenMailboxToFriend: (friendId: string) => void;
  onSendQuickGift: (friendId: string, giftType: 'coffee' | 'plant') => void;
}

export const FriendCardModal: React.FC<FriendCardModalProps> = ({
  isOpen,
  onClose,
  person,
  onOpenMailboxToFriend,
  onSendQuickGift,
}) => {
  if (!isOpen || !person) return null;

  const stateObj = LIFE_STATES[person.currentState];
  const roomObj = ROOMS[person.currentRoom] || ROOMS.living_nook;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="friend-card-modal"
        className="w-full max-w-md bg-[#201d1a] border border-[#443c34] rounded-2xl shadow-2xl overflow-hidden text-[#e8e2d8] flex flex-col"
      >
        {/* Header with warm avatar */}
        <div className="p-6 pb-5 border-b border-[#36302a] bg-[#272320] flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border border-white/10 overflow-hidden shrink-0 bg-[#26211d]"
            >
              <svg viewBox="-12 -25 24 35" className="w-12 h-12">
                <ellipse cx="0" cy="8" rx="10" ry="4" fill="#150f0a" opacity="0.35" />
                <path
                  d="M-6,2 C-7,-4 -5,-9 0,-9 C5,-9 7,-4 6,2 Z"
                  fill={person.shirtColor}
                />
                <CharacterHead
                  cx={0}
                  cy={-14}
                  r={7}
                  skinColor={person.skinColor}
                  hairColor={person.hairColor}
                  hairStyle={person.hairStyle}
                  beanieColor={person.beanieColor}
                  hasPompom={person.hasPompom}
                  showBeanie={true}
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#f2ece2]">{person.name}</h3>
                {person.isSelf ? (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#537d6e]/30 text-[#85b5a3] border border-[#537d6e]/40">
                    我自己
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#b57954]/25 text-[#dba07b] border border-[#b57954]/30">
                    常驻密友
                  </span>
                )}
              </div>
              <p className="text-xs text-[#9c9186] mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#b87c53]" />
                <span>{person.sinceTime}</span>
              </p>
            </div>
          </div>
          <button
            aria-label="关闭人物状态"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9c9186] hover:text-[#f2ece2] hover:bg-[#38312b] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4 text-xs">
          {/* Current State & Location */}
          <div className="p-3.5 rounded-xl bg-[#26221f] border border-[#3c342d] space-y-2">
            <div className="flex items-center justify-between text-[#8c8174]">
              <span className="flex items-center gap-1">
                <span className="text-base">{stateObj?.emoji}</span>
                <span className="font-medium text-[#ded5c7]">{stateObj?.label}</span>
              </span>
              <span className="flex items-center gap-1 text-[#8f9ca8]">
                <MapPin className="w-3 h-3" />
                <span>{roomObj.name.split('&')[0]}</span>
              </span>
            </div>
            {person.stateNote && (
              <p className="font-serif italic text-xs text-[#cfc5b6] pt-1 border-t border-[#332c25]">
                “{person.stateNote}”
              </p>
            )}
          </div>

          {/* Vibe & Favorite things */}
          <div className="space-y-1.5 text-[11px] text-[#8e8376]">
            <div className="flex justify-between py-1 border-b border-[#2d2823]">
              <span>在小世界里喜欢：</span>
              <span className="text-[#ded5c7]">{person.favoriteItem}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#2d2823]">
              <span>生活模式：</span>
              <span className="text-[#ded5c7]">静默在场 · 异步信箱</span>
            </div>
          </div>

          {/* Low disturbance actions if not self */}
          {!person.isSelf && (
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenMailboxToFriend(person.id);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#362e27] hover:bg-[#423830] border border-[#4d4035] text-[#f0e8db] font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-[#d68c68]" />
                去门前信箱留一封便笺
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onSendQuickGift(person.id, 'coffee');
                    onClose();
                  }}
                  className="py-2 px-3 rounded-xl bg-[#26221f] hover:bg-[#302a25] border border-[#3a322a] text-[#c9bfae] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Coffee className="w-3.5 h-3.5 text-[#d68c68]" />
                  放一杯温咖啡
                </button>
                <button
                  onClick={() => {
                    onSendQuickGift(person.id, 'plant');
                    onClose();
                  }}
                  className="py-2 px-3 rounded-xl bg-[#26221f] hover:bg-[#302a25] border border-[#3a322a] text-[#c9bfae] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="text-xs">🪴</span>
                  送一盆多肉
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
