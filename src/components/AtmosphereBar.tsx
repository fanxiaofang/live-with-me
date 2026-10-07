import {
CloudRain,
Home,
Moon,
Sliders,
Sparkles,
Sun,
Sunrise,
Sunset,
Volume2,
VolumeX,
} from 'lucide-react';
import React, { useState } from 'react';
import { ambientAudio } from '../audio/ambientAudio';
import { ROOMS } from '../data/initialData';
import { RoomId, TimeOfDay } from '../types';

interface AtmosphereBarProps {
  timeOfDay: TimeOfDay;
  onChangeTime: (time: TimeOfDay) => void;
  activeRoom: RoomId | 'overview';
  onSelectRoom: (roomId: RoomId | 'overview') => void;
  unreadMailCount: number;
  onOpenMailbox: () => void;
  onOpenMemories: () => void;
  onOpenBookshelf?: () => void;
}

export const AtmosphereBar: React.FC<AtmosphereBarProps> = ({
  timeOfDay,
  onChangeTime,
  activeRoom,
  onSelectRoom,
  unreadMailCount,
  onOpenMailbox,
  onOpenMemories,
  onOpenBookshelf,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showAudioMixer, setShowAudioMixer] = useState(false);

  // Audio sliders
  const [rainVol, setRainVol] = useState(0.45);
  const [fireVol, setFireVol] = useState(0.4);
  const [vinylVol, setVinylVol] = useState(0.25);
  const [droneVol, setDroneVol] = useState(0.2);

  const handleToggleAudio = () => {
    const isNowPlaying = ambientAudio.toggleMute();
    setIsPlayingAudio(isNowPlaying);
  };

  const timeOptions: { id: TimeOfDay; label: string; icon: React.ReactNode }[] = [
    { id: 'morning', label: '清晨', icon: <Sunrise className="w-3.5 h-3.5 text-[#9ac5d4]" /> },
    { id: 'afternoon', label: '午后', icon: <Sun className="w-3.5 h-3.5 text-[#e8c07a]" /> },
    { id: 'dusk', label: '黄昏', icon: <Sunset className="w-3.5 h-3.5 text-[#e88758]" /> },
    { id: 'night', label: '深夜', icon: <Moon className="w-3.5 h-3.5 text-[#8b9ecc]" /> },
    { id: 'rainy', label: '静雨', icon: <CloudRain className="w-3.5 h-3.5 text-[#7aa7ba]" /> },
  ];

  return (
    <div className="relative z-30 pointer-events-auto">
      {/* Top Floating Bar */}
      <header className="px-5 py-3 flex items-center justify-between">
        {/* App Title & Low Disturbance Philosophy */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d68c68] shadow-[0_0_10px_#d68c68]" />
            <h1 className="text-sm font-semibold tracking-wider text-[#ede7dc]">Live With Me</h1>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1c19]/70 border border-[#3b342e]/60 text-[11px] text-[#9c9183]">
            <span className="text-[#c49a6c]">Presence without conversation</span>
            <span>·</span>
            <span>安静在线陪伴</span>
          </div>
        </div>

        {/* Action Controls: Sound, Mailbox, Time & Memories */}
        <div className="flex items-center gap-2">
          {/* Ambient Sound Trigger */}
          <div className="relative">
            <button
              id="ambient-sound-btn"
              onClick={handleToggleAudio}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                isPlayingAudio
                  ? 'bg-[#3b332b] border-[#c4794e] text-[#f2ece2]'
                  : 'bg-[#1e1c19]/80 border-[#38312a] text-[#9c9183] hover:text-[#ded5c7]'
              }`}
              title="切换治愈环境白噪音"
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#d68c68]" />
                  <span className="hidden sm:inline">白噪音已开启</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">静音挂机</span>
                </>
              )}
            </button>

            {/* Slider toggle icon */}
            {isPlayingAudio && (
              <button
                onClick={() => setShowAudioMixer(!showAudioMixer)}
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#524538] border border-[#736352] flex items-center justify-center text-[9px] text-[#f2ece2]"
                title="调节各轨道音量"
              >
                <Sliders className="w-2.5 h-2.5" />
              </button>
            )}

            {/* Audio Mixer Dropdown */}
            {showAudioMixer && isPlayingAudio && (
              <div className="absolute right-0 top-10 w-52 p-3.5 rounded-2xl bg-[#231f1c] border border-[#423930] shadow-2xl space-y-2.5 text-xs text-[#cfc5b6]">
                <div className="font-medium text-[11px] text-[#8e8274] pb-1 border-b border-[#362e26]">
                  治愈白噪音混音台
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span>🌧️ 雨打玻璃窗</span>
                    <span>{Math.round(rainVol * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={rainVol}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setRainVol(v);
                      ambientAudio.setRainVolume(v);
                    }}
                    className="w-full accent-[#d68c68] h-1 bg-[#3a3229] rounded"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span>🔥 壁炉柴火轻响</span>
                    <span>{Math.round(fireVol * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={fireVol}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setFireVol(v);
                      ambientAudio.setFireVolume(v);
                    }}
                    className="w-full accent-[#d68c68] h-1 bg-[#3a3229] rounded"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span>📻 黑胶唱片温润沙沙声</span>
                    <span>{Math.round(vinylVol * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={vinylVol}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVinylVol(v);
                      ambientAudio.setVinylVolume(v);
                    }}
                    className="w-full accent-[#d68c68] h-1 bg-[#3a3229] rounded"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span>🎹 温暖冥想和弦</span>
                    <span>{Math.round(droneVol * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={droneVol}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setDroneVol(v);
                      ambientAudio.setDroneVolume(v);
                    }}
                    className="w-full accent-[#d68c68] h-1 bg-[#3a3229] rounded"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Time of Day Pills */}
          <div className="flex items-center p-1 rounded-xl bg-[#1e1c19]/80 border border-[#38312a]">
            {timeOptions.map((opt) => {
              const active = timeOfDay === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onChangeTime(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    active ? 'bg-[#3b332b] text-[#f2ece2] shadow-sm' : 'text-[#877d71] hover:text-[#cfc5b6]'
                  }`}
                >
                  {opt.icon}
                  <span className="hidden sm:inline text-[11px]">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bookshelf Management Button */}
          {onOpenBookshelf && (
            <button
              id="top-bookshelf-btn"
              onClick={onOpenBookshelf}
              className="px-3 py-1.5 rounded-xl bg-[#1e1c19]/80 border border-[#38312a] text-xs font-medium text-[#e2b170] hover:bg-[#332b24] transition-colors flex items-center gap-1.5"
            >
              <span>📚</span>
              <span className="hidden sm:inline">原木书架</span>
            </button>
          )}

          {/* Shared Footprints / Memories */}
          <button
            id="living-memories-btn"
            onClick={onOpenMemories}
            className="px-3 py-1.5 rounded-xl bg-[#1e1c19]/80 border border-[#38312a] text-xs font-medium text-[#c49a6c] hover:bg-[#332b24] transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">生活印记</span>
          </button>

          {/* Mailbox Top Button */}
          <button
            id="top-mailbox-btn"
            onClick={onOpenMailbox}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
              unreadMailCount > 0
                ? 'bg-[#c44237]/20 border-[#c44237]/60 text-[#f5c6c2]'
                : 'bg-[#1e1c19]/80 border-[#38312a] text-[#bdafa0] hover:text-[#f2ece2]'
            }`}
          >
            <span>📪</span>
            <span>信箱</span>
            {unreadMailCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#c44237] animate-ping" />
            )}
          </button>
        </div>
      </header>

      {/* Bottom Floating Room Navigation Bar */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <div className="px-3 py-2 rounded-2xl bg-[#1e1c19]/85 backdrop-blur-md border border-[#3c342c] shadow-2xl flex items-center gap-1.5 text-xs">
          <button
            id="nav-room-overview"
            onClick={() => onSelectRoom('overview')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              activeRoom === 'overview'
                ? 'bg-[#3b322a] border border-[#59493a] text-[#f2ece2]'
                : 'text-[#94897d] hover:text-[#e0d6c8]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>整栋小屋</span>
          </button>

          <div className="h-4 w-px bg-[#38312a]" />

          {(['my_room', 'living_nook', 'friend_room', 'capsule_pod', 'corn_lounge', 'observatory', 'porch_mailbox'] as RoomId[]).map((rId) => {
            const rInfo = ROOMS[rId];
            const active = activeRoom === rId;
            return (
              <button
                key={rId}
                onClick={() => onSelectRoom(rId)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  active
                    ? 'bg-[#3b322a] border border-[#59493a] text-[#f2ece2]'
                    : 'text-[#94897d] hover:text-[#e0d6c8]'
                }`}
              >
                <span>{rInfo.name.split('&')[0].split('·')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
