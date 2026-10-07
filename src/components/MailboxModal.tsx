import { Check, Mail, Send, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ambientAudio } from '../audio/ambientAudio';
import { GIFTS } from '../data/initialData';
import { useTimerScope } from '../shared/timers/useTimerScope';
import { GiftType, MailLetter, Person } from '../types';

interface MailboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  letters: MailLetter[];
  people: Person[];
  currentUserId: string;
  onSendLetter: (newLetter: Omit<MailLetter, 'id' | 'date' | 'read'>) => void;
  onMarkAsRead: (letterId: string) => void;
}

export const MailboxModal: React.FC<MailboxModalProps> = ({
  isOpen,
  onClose,
  letters,
  people,
  currentUserId,
  onSendLetter,
  onMarkAsRead,
}) => {
  const timers = useTimerScope(isOpen);
  const [tab, setTab] = useState<'inbox' | 'compose'>('inbox');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(
    people.find((p) => p.id !== currentUserId)?.id || 'lin'
  );
  const [selectedGift, setSelectedGift] = useState<GiftType>('coffee');
  const [content, setContent] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  useEffect(() => { if (!isOpen) setSentSuccess(false); }, [isOpen]);

  if (!isOpen) return null;

  // Filter letters for user
  const myLetters = letters.filter((l) => l.toId === currentUserId);
  const unreadCount = myLetters.filter((l) => !l.read).length;

  const quickInspireQuotes = [
    '今天窗外阳光正好，顺路把新泡的温茶放在你信箱里。不用回，慢慢喝。',
    '刚才听了一首很舒服的老歌，想到你可能也在写东西。祝今天松弛无虑。',
    '给你门前放了一小盆多肉，它喜欢有散光的地方，偶尔喷点水就好。',
    '今天在炉火边读了几页诗，给你留了两块自烤的坚果曲奇，垫垫肚子～',
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const recipient = people.find((p) => p.id === selectedRecipientId);
    if (!recipient) return;

    onSendLetter({
      fromId: currentUserId,
      fromName: '我',
      toId: selectedRecipientId,
      content: content.trim(),
      gift: selectedGift,
      type: selectedGift ? 'gift' : 'letter',
    });

    ambientAudio.playGentleChime();
    setSentSuccess(true);
    timers.schedule('feedback-0', () => {
      setSentSuccess(false);
      setContent('');
      setTab('inbox');
    }, 1200);
  };

  const handleOpenLetter = (letter: MailLetter) => {
    if (!letter.read) {
      onMarkAsRead(letter.id);
      ambientAudio.playGentleChime();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="mailbox-modal-container"
        className="w-full max-w-2xl bg-[#201d1a] border border-[#443c34] rounded-2xl shadow-2xl overflow-hidden text-[#e8e2d8] flex flex-col max-h-[85vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-[#36302a] flex items-center justify-between bg-[#272320]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3c342c] border border-[#52463b] flex items-center justify-center text-[#e8a36e]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold tracking-wide text-[#f2ece2]">前廊木信箱</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#c44237] text-white">
                    {unreadCount} 封新心意
                  </span>
                )}
              </div>
              <p className="text-xs text-[#a39a8f] mt-0.5">
                “表达‘我想到了你’，但不要求你现在回复。”
              </p>
            </div>
          </div>
          <button
            id="close-mailbox-btn"
            aria-label="关闭信箱"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9c9186] hover:text-[#f2ece2] hover:bg-[#38312b] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 pt-3 pb-2 border-b border-[#332e29] flex items-center gap-2 bg-[#201d1a]">
          <button
            id="mailbox-tab-inbox"
            onClick={() => setTab('inbox')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 ${
              tab === 'inbox'
                ? 'bg-[#3c342c] text-[#f2ece2] border border-[#584c3e]'
                : 'text-[#9c9186] hover:text-[#ded5c7]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            信件与礼物 ({myLetters.length})
          </button>
          <button
            id="mailbox-tab-compose"
            onClick={() => setTab('compose')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 ${
              tab === 'compose'
                ? 'bg-[#3c342c] text-[#f2ece2] border border-[#584c3e]'
                : 'text-[#9c9186] hover:text-[#ded5c7]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            给朋友留便笺 / 赠礼物
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {tab === 'inbox' ? (
            myLetters.length === 0 ? (
              <div className="py-16 text-center text-[#8e8477]">
                <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">信箱里现在安安静静的</p>
                <p className="text-xs mt-1 text-[#70685e]">朋友上线看到你时，可能会塞进一封信或一盆小绿植。</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myLetters.map((letter) => {
                  const giftObj = GIFTS.find((g) => g.id === letter.gift);
                  return (
                    <div
                      key={letter.id}
                      onClick={() => handleOpenLetter(letter)}
                      className={`relative p-5 rounded-xl border transition-all cursor-pointer ${
                        letter.read
                          ? 'bg-[#282421] border-[#3d362f] hover:border-[#52483f]'
                          : 'bg-[#302a25] border-[#a86542]/60 shadow-lg ring-1 ring-[#a86542]/30'
                      }`}
                    >
                      {/* Top Stamp / Date / Unread badge */}
                      <div className="flex items-center justify-between text-xs mb-3 text-[#a89d90]">
                        <div className="flex items-center gap-2">
                          <span className="font-serif italic font-medium text-sm text-[#f0e8db]">
                            来自：{letter.fromName}
                          </span>
                          {!letter.read && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#d68c68]/20 text-[#e89b78] border border-[#d68c68]/30">
                              未启封
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#857b6f]">{letter.date}</span>
                      </div>

                      {/* Gift Banner if attached */}
                      {giftObj && (
                        <div className="mb-3 px-3 py-2 rounded-lg bg-[#211d1a] border border-[#3e352d] flex items-center gap-3">
                          <span className="text-2xl">{giftObj.emoji}</span>
                          <div>
                            <div className="text-xs font-medium text-[#e3dad0]">附带心意：{giftObj.name}</div>
                            <div className="text-[11px] text-[#91877b]">{giftObj.desc}</div>
                          </div>
                        </div>
                      )}

                      {/* Letter Content Styled as warm stationery */}
                      <p className="font-serif text-[13.5px] leading-relaxed text-[#e0d6c8] whitespace-pre-line">
                        “{letter.content}”
                      </p>

                      {/* Reply shortcut */}
                      <div className="mt-3 pt-2.5 border-t border-[#38312b] flex items-center justify-between text-xs text-[#8c8275]">
                        <span className="text-[11px]">低侵入陪伴 · 无需立即应答</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecipientId(letter.fromId);
                            setTab('compose');
                          }}
                          className="text-[#d68c68] hover:text-[#f0a986] flex items-center gap-1 transition-colors"
                        >
                          回赠一封信 / 小礼物 →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Compose Tab */
            <form onSubmit={handleSend} className="space-y-4">
              {/* Select Recipient */}
              <div>
                <label className="block text-xs font-medium text-[#b5aa9d] mb-2">选择朋友门口信箱：</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {people
                    .filter((p) => p.id !== currentUserId)
                    .map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedRecipientId(p.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                          selectedRecipientId === p.id
                            ? 'bg-[#3b322a] border-[#c4794e] text-[#f2ece2]'
                            : 'bg-[#26221f] border-[#3d352e] text-[#a69c8f] hover:border-[#52463b]'
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                          style={{ backgroundColor: p.shirtColor }}
                        >
                          {p.name.slice(0, 1)}
                        </div>
                        <div>
                          <div className="text-xs font-medium">{p.name} 的门前信箱</div>
                          <div className="text-[10px] text-[#877d71] mt-0.5">{p.sinceTime}</div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Select a low-pressure Gift */}
              <div>
                <label className="block text-xs font-medium text-[#b5aa9d] mb-2">
                  附带一份温暖小礼物（放在门前几案或窗台）：
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {GIFTS.map((gift) => (
                    <button
                      key={gift.id}
                      type="button"
                      onClick={() => setSelectedGift(gift.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        selectedGift === gift.id
                          ? 'bg-[#3b322a] border-[#c4794e] text-[#f5eee4] scale-105'
                          : 'bg-[#24201d] border-[#38312b] text-[#998f82] hover:border-[#4d4237]'
                      }`}
                    >
                      <span className="text-xl">{gift.emoji}</span>
                      <span className="text-[10px] font-medium truncate w-full">{gift.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-[#b5aa9d]">手写便笺内容：</label>
                  <span className="text-[10px] text-[#786e63]">表达心意，不施加回复负担</span>
                </div>
                <textarea
                  id="compose-letter-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="写下几句安静的话。比如今天天气、窗台的光影、或者留下一杯热咖啡……"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[#191715] border border-[#3e362e] text-[#f0e8dc] placeholder-[#6b6256] text-xs font-serif leading-relaxed focus:outline-none focus:border-[#c4794e] transition-colors resize-none"
                />
              </div>

              {/* Quick inspiration bubbles */}
              <div className="space-y-1.5">
                <div className="text-[11px] text-[#8a8073]">便笺灵感参考（点击填入）：</div>
                <div className="flex flex-wrap gap-1.5">
                  {quickInspireQuotes.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setContent(q)}
                      className="px-2.5 py-1 rounded-lg text-[11px] bg-[#292421] hover:bg-[#342e2a] border border-[#3d352e] text-[#b3a89a] text-left transition-colors truncate max-w-full"
                    >
                      {q.slice(0, 24)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className={`px-5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                    sentSuccess
                      ? 'bg-[#4a7c59] text-white'
                      : !content.trim()
                      ? 'bg-[#2e2823] text-[#6b6155] cursor-not-allowed'
                      : 'bg-[#b8693c] hover:bg-[#c97544] text-white shadow-md'
                  }`}
                >
                  {sentSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      已悄悄塞入信箱
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      投递到朋友信箱
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
