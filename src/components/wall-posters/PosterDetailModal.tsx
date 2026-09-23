import React from 'react';
import { PosterId, POSTER_CATALOG } from './posterTypes';
import { X, ChevronLeft, ChevronRight, Film, Sparkles, Quote, Compass } from 'lucide-react';

interface PosterDetailModalProps {
  activePosterId: PosterId | null;
  onClose: () => void;
  onSelectPoster: (id: PosterId) => void;
}

export const PosterDetailModal: React.FC<PosterDetailModalProps> = ({
  activePosterId,
  onClose,
  onSelectPoster,
}) => {
  if (!activePosterId) return null;

  const currentPoster = POSTER_CATALOG[activePosterId];
  const posterIds: PosterId[] = ['pastoral-valley', 'young-woman', 'ancora-domani', 'paprika'];
  const currentIndex = posterIds.indexOf(activePosterId);

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + posterIds.length) % posterIds.length;
    onSelectPoster(posterIds[prevIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % posterIds.length;
    onSelectPoster(posterIds[nextIdx]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#241c14] border border-[#523d2b] rounded-2xl shadow-2xl overflow-hidden text-[#f4ede2] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-[#d4c6b5] hover:text-white transition-colors border border-white/10"
          title="关闭画作"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: High-Resolution Poster Showcase */}
        <div className="w-full md:w-5/12 bg-[#17120c] p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#3d2c1e] relative">
          {/* Framed Artwork Display */}
          <div
            className="w-full max-w-[240px] aspect-[2/3] rounded-lg shadow-2xl p-2.5 relative flex flex-col justify-between overflow-hidden"
            style={{
              backgroundColor:
                activePosterId === 'pastoral-valley'
                  ? '#283626'
                  : activePosterId === 'young-woman'
                  ? '#422a19'
                  : activePosterId === 'ancora-domani'
                  ? '#2b2723'
                  : '#3b1c14',
              border: `2px solid ${
                activePosterId === 'pastoral-valley'
                  ? '#4d6945'
                  : activePosterId === 'young-woman'
                  ? '#784c2e'
                  : activePosterId === 'ancora-domani'
                  ? '#4d463f'
                  : '#6e2f20'
              }`,
            }}
          >
            {/* Poster Inner Mat & Graphic */}
            <div className="w-full h-full rounded overflow-hidden relative shadow-inner flex flex-col bg-black/40">
              <img
                src={currentPoster.imageUrl}
                alt={currentPoster.title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              {/* Glass Glint Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Quick Carousel Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-full bg-[#2a2016] hover:bg-[#3d2f21] border border-[#4d3a29] text-[#cbd5e1] hover:text-white transition-colors"
              title="上一幅画"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-[#a89988] font-mono">
              {currentIndex + 1} / {posterIds.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-full bg-[#2a2016] hover:bg-[#3d2f21] border border-[#4d3a29] text-[#cbd5e1] hover:text-white transition-colors"
              title="下一幅画"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Film / Art Story & Curation Notes */}
        <div className="w-full md:w-7/12 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Header Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#3d2c1e] text-[#f59e0b] text-[11px] font-medium border border-[#523d2b]">
                {currentPoster.wall === 'left' ? (
                  <>
                    <Compass className="w-3.5 h-3.5 text-[#34d399]" />
                    <span className="text-[#a7f3d0]">左墙手作画廊 · 田园牧歌</span>
                  </>
                ) : (
                  <>
                    <Film className="w-3.5 h-3.5" />
                    右墙艺术画廊 · 经典映画
                  </>
                )}
              </span>
              <span className="text-xs text-[#a89988] font-mono">{currentPoster.year}</span>
            </div>

            {/* Film / Artwork Title */}
            <div>
              <h3 className="text-xl font-bold text-[#fdfbf7] flex items-center gap-2">
                {currentPoster.title}
              </h3>
              <p className="text-xs text-[#a89988] font-mono mt-0.5">{currentPoster.originalTitle}</p>
            </div>

            {/* Director / Origin & Subtitle */}
            <div className="text-xs text-[#d1c2b0] flex flex-col gap-1 border-l-2 border-[#f59e0b] pl-3 py-0.5">
              <span className="text-[#a89988]">出处 / 创作：{currentPoster.director}</span>
              <span className="text-[#fef3c7] font-medium">{currentPoster.subtitle}</span>
            </div>

            {/* Quote Card */}
            <div className="p-3 rounded-xl bg-[#1b1510] border border-[#3d2e20] text-xs text-[#ecd8c2] relative">
              <Quote className="w-4 h-4 text-[#f59e0b]/50 absolute top-2.5 right-2.5" />
              <p className="italic font-serif leading-relaxed pr-6">{currentPoster.quote}</p>
            </div>

            {/* Curation Description */}
            <p className="text-xs text-[#b8a896] leading-relaxed">
              {currentPoster.description}
            </p>
          </div>

          {/* Bottom Switcher Tabs */}
          <div className="pt-3 border-t border-[#3d2c1e] flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {posterIds.map((id) => (
                <button
                  key={id}
                  onClick={() => onSelectPoster(id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    activePosterId === id
                      ? 'bg-[#f59e0b] text-[#1c140c] font-bold shadow'
                      : 'bg-[#2a2016] text-[#b8a896] hover:bg-[#382b1f] hover:text-[#fdfbf7]'
                  }`}
                >
                  {id === 'pastoral-valley'
                    ? '山谷与远行'
                    : id === 'young-woman'
                    ? '泳者之心'
                    : id === 'ancora-domani'
                    ? '还有明天'
                    : '红辣椒'}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="px-3 py-1 text-xs rounded-lg bg-[#3d2e20] hover:bg-[#4d3a29] text-[#ded3c5] transition-colors shrink-0"
            >
              返回木屋
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
