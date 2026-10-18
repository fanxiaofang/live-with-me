import {useRef, type ReactNode} from 'react';
import {usePreviewSvgIds} from '../inspection/usePreviewSvgIds';
import { APPEARANCE_DIRECTIONS } from './CharacterAppearancePreview';
import { StandingCharacter, type StandingCharacterProps } from './StandingCharacter';
import { FinalizedNwStandingCharacter } from './FinalizedNwStandingCharacter';
import { CHARACTER_PREVIEW_PALETTE } from './characterPreviewPalette';

type Props=Omit<StandingCharacterProps,'facing'|'parentScale'|'showBeanie'> & {onCollapse:()=>void};

function ScopedView({children}:{children:ReactNode}){
  const root=useRef<SVGGElement>(null);
  usePreviewSvgIds(root,children);
  return <g ref={root}>{children}</g>;
}

export function CharacterAppearanceFiveViews({onCollapse,...appearance}:Props){
  return <section id="appearance-five-views" aria-label="完整装扮五视图">
    <div className="flex items-center justify-between gap-3 mb-2">
      <h3 className="text-xs font-medium text-[#c3b29e]">完整装扮 · 五视图</h3>
      <button type="button" onClick={onCollapse} className="min-h-8 px-2 text-xs text-[#c3b29e] rounded-md hover:bg-[#38312b] focus-visible:outline-2 focus-visible:outline-[#e0a96d]">收起五视图</button>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-2 gap-y-4 rounded-xl px-2 py-3" style={{backgroundColor:CHARACTER_PREVIEW_PALETTE.background}}>
      {[...APPEARANCE_DIRECTIONS,{facing:'NW-eight-view',label:'NW 斜侧'} as const].map(view=><figure key={view.facing} data-testid="appearance-five-view" className={`min-w-0 ${view.facing==='NW-eight-view'?'col-span-2 sm:col-span-1':''}`}>
        <svg viewBox="-20 -50 40 56" role="img" aria-label={`站立装扮：${view.label}`} width="100%" height="156" className="block w-full h-[140px] sm:h-[156px]">
          <ScopedView>{view.facing==='NW-eight-view'?<FinalizedNwStandingCharacter {...appearance}/>:<StandingCharacter {...appearance} facing={view.facing}/>}</ScopedView>
        </svg>
        <figcaption className="text-center text-xs mt-1" style={{color:CHARACTER_PREVIEW_PALETTE.caption}}>{view.label}</figcaption>
      </figure>)}
    </div>
  </section>;
}
