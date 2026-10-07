import { useState } from 'react';
import { BookshelfPreset, BookItemConfig, ShelfDecorationConfig, TierConfig, PRESET_COZY_TIERS, PRESET_READING_LIN_TIERS, PRESET_EMPTY_TIERS, PRESET_PACKED_TIERS, PRESET_BOTANICAL_TIERS } from '../../components/bookshelf';
export function useBookshelf(triggerToast: (message: string) => void) {
  const [bookshelfPreset, setBookshelfPreset] = useState<BookshelfPreset>('cozy');
  const [customBookshelfTiers, setCustomBookshelfTiers] = useState<TierConfig[]>(PRESET_COZY_TIERS);
  const [selectedBookshelfItem, setSelectedBookshelfItem] = useState<{
    type: 'book' | 'dec';
    item: BookItemConfig | ShelfDecorationConfig;
  } | null>(null);

  const handleSelectBookshelfPreset = (preset: BookshelfPreset) => {
    setBookshelfPreset(preset);
    let baseTiers: TierConfig[];
    switch (preset) {
      case 'empty':
        baseTiers = PRESET_EMPTY_TIERS;
        break;
      case 'packed':
        baseTiers = PRESET_PACKED_TIERS;
        break;
      case 'botanical':
        baseTiers = PRESET_BOTANICAL_TIERS;
        break;
      case 'reading_lin':
        baseTiers = PRESET_READING_LIN_TIERS;
        break;
      case 'cozy':
      default:
        baseTiers = PRESET_COZY_TIERS;
        break;
    }
    setCustomBookshelfTiers(baseTiers);
    const presetNames: Record<BookshelfPreset, string> = {
      cozy: '岁月沉淀 · 惬意日常',
      reading_lin: '林木正在翻读 · 抽出空位',
      empty: '新居搬入 · 纯净空架',
      packed: '博览藏书 · 满满当当',
      botanical: '绿意垂蔓 · 森林氧吧',
    };
    triggerToast(`📚 书架场景已切换：${presetNames[preset] || preset}`);
  };

  const handleToggleBookPulled = (bookId: string) => {
    const book = customBookshelfTiers.flatMap(t => t.books ?? []).find(b => b.id === bookId);
    if (!book) return;
    const willPull = !book.isPulled;
    setCustomBookshelfTiers(previous => previous.map(t => ({ ...t, books: t.books?.map(b => b.id === bookId ? { ...b, isPulled: willPull, isReading: willPull } : b) })));
    triggerToast(willPull ? `📖 已从书架抽出《${book.title}》，在沙发上安静翻读` : `📥 已将《${book.title}》放回原木书架插槽`);
  };

  const handleAddCustomBook = (tierIndex: number, newBook: Partial<BookItemConfig>) => {
    const bookItem: BookItemConfig = {
      id: `custom-book-${Date.now()}`,
      title: newBook.title || '无名手记',
      author: newBook.author || '我',
      color: newBook.color || '#b45309',
      pageColor: '#f7f2ea',
      thickness: newBook.thickness || 2.5,
      height: newBook.height || 8.8,
      depth: 4.0,
      donor: newBook.donor || '我',
      note: newBook.note || '随手插在原木架上的一本心头好。',
      bookmarkRibbon: newBook.bookmarkRibbon,
      offset: 196 + (Math.random() * 8 - 4),
    };

    setCustomBookshelfTiers((prev) =>
      prev.map((tier) => {
        if (tier.index === tierIndex) {
          return {
            ...tier,
            books: [...(tier.books || []), bookItem],
          };
        }
        return tier;
      })
    );

    triggerToast(`✨ 已将《${bookItem.title}》安放到书架第 ${tierIndex} 层插槽`);
  };


  return { bookshelfPreset, customBookshelfTiers, selectedBookshelfItem, setSelectedBookshelfItem, handleSelectBookshelfPreset, handleToggleBookPulled, handleAddCustomBook };
}
