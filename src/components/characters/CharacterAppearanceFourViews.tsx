import { APPEARANCE_DIRECTIONS } from './CharacterAppearancePreview';
import { StandingCharacter, type StandingCharacterProps } from './StandingCharacter';
import { CHARACTER_PREVIEW_PALETTE } from './characterPreviewPalette';

type Props = Omit<StandingCharacterProps, 'facing' | 'parentScale' | 'showBeanie'> & {
  onCollapse: () => void;
};

/** Render the current draft with the same standing asset used by the world. */
export function CharacterAppearanceFourViews({ onCollapse, ...appearance }: Props) {
  return <section id="appearance-four-views" aria-label="完整装扮四视图">
    <div className="flex items-center justify-between gap-3 mb-2">
      <h3 className="text-xs font-medium text-[#b5aa9d]">完整装扮</h3>
      <button type="button" onClick={onCollapse}
        className="min-h-8 px-2 text-xs text-[#c3b29e] rounded-md hover:bg-[#38312b] focus-visible:outline-2 focus-visible:outline-[#e0a96d]">
        收起四视图
      </button>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-4 rounded-xl px-2 py-3"
      style={{ backgroundColor: CHARACTER_PREVIEW_PALETTE.background }}>
      {APPEARANCE_DIRECTIONS.map(view => <figure key={view.facing} data-testid="appearance-four-view" className="min-w-0">
        <svg viewBox="-17 -51 34 58" role="img" aria-label={`站立装扮：${view.label}`}
          width="100%" height="156" className="block w-full h-[140px] sm:h-[156px]">
          <StandingCharacter {...appearance} facing={view.facing} />
        </svg>
        <figcaption className="text-center text-xs mt-1" style={{ color: CHARACTER_PREVIEW_PALETTE.caption }}>
          {view.label}
        </figcaption>
      </figure>)}
    </div>
  </section>;
}
