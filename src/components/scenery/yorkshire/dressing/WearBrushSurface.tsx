import { memo, useId, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { WearStroke } from '../../../../features/yard-editor/yardWear';
import { buildWearMaterial, wearHash, wearPalette, wearCalmPalette, type WearMaterialGeometry } from '../../../../features/yard-editor/wearMaterial';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { Grass } from '../vegetation/MeadowVegetationAssets';
import { meadowGrassOpacity, meadowPlantPaletteCss } from '../vegetation/meadowPalette';
import { HomesteadMeadowSurface } from '../vegetation/HomesteadMeadowSurface';
import { wearReferencePalette } from '../../../../features/yard-editor/wearReferencePalette';
import { nightPathReference, type NightPathTone } from '../../../../features/yard-editor/yardAppearance';

type WearTone='original'|'calm'|'path'|'garden';
const toneNames:Record<WearTone,string>={original:'暖棕色',calm:'历史暖棕实验',path:'草灰褐',garden:'深橄榄褐'};

/** One renderer for the editor and SSR studies. Neither geometry nor material
 * changes with travel direction; only the final ground projection does. */
export function WearMaterialDrawing({ geometry, theme, id, tone='original', edge='original', nightCrisp=false, contactShade=true }: {
  geometry: WearMaterialGeometry; theme: YorkshireSceneTheme; id: string; tone?:WearTone; edge?:'original'|'clean'; nightCrisp?:boolean; contactShade?:boolean;
}) {
  if(!geometry.outline)return null;
  const p=tone==='path'||tone==='garden'?wearReferencePalette(theme,tone):tone==='calm'?wearCalmPalette(theme):wearPalette(theme);
  const coverage=edge!=='original'&&(theme.isNight||theme.timeOfDay==='dusk')&&geometry.coverage.length>0;
  const grassCss=meadowPlantPaletteCss(theme,'#'+id+'-grass');
  const crisp=theme.isNight&&nightCrisp;
  const edgeFilter=crisp?undefined:`url(#${id}-edge)`;
  return <g data-wear-surface="ground-material" data-wear-tone={tone} data-wear-edge={coverage?edge:'original'} data-wear-composite="original" data-wear-contact-shade={contactShade?'on':'off'} data-wear-outline="restrained" data-wear-blur={crisp?'off':'on'} data-wear-material-count={geometry.operations}>
    <defs>
      <clipPath id={id+'-clip'}><path d={geometry.outline} fillRule="evenodd" /></clipPath>
      {/* Feather in ground proportions: thin horizontal paths keep a solid centre. */}
      {!crisp&&<filter id={id+'-edge'} x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="1.35 .385" /></filter>}
      <mask id={id+'-shoulder'} maskUnits="userSpaceOnUse" {...geometry.bounds} style={{maskType:'luminance'}}>
        {coverage?<g filter={edgeFilter}>{geometry.coverage.map((layer,i)=>{
          const value=Math.round(layer.alpha*255);
          return <path key={i} d={layer.d} fill={`rgb(${value},${value},${value})`} fillRule="evenodd"/>;
        })}</g>:<path d={geometry.outline} fill="white" fillRule="evenodd" filter={edgeFilter} />}
      </mask>
    </defs>
    <g data-wear-material-body="" mask={coverage?`url(#${id}-shoulder)`:undefined}>
    <rect {...geometry.bounds} fill={p.soil} opacity=".9" mask={coverage?undefined:`url(#${id}-shoulder)`} />
    <g data-wear-material-details="" clipPath={coverage?undefined:`url(#${id}-clip)`}>
      {geometry.facets.map((facet,i)=><path key={i} d={facet.d} fill={facet.light?p.light:p.shade} opacity=".4" />)}
      <path d={geometry.lips} fill="none" stroke={p.shade} strokeWidth=".8" opacity=".18" strokeLinecap="round" />
      {/* Same local colour fields and world coordinates as the meadow, applied
          once to this exposed material. No soft-light tinting of grass into soil. */}
      {theme.landscapeEnvironment&&<HomesteadMeadowSurface theme={theme} surfaceId={id+'-lighting'} />}
    </g>
    </g>
    {/* Shallow turf contacts belong to the boundary, outside the soil's alpha
        mask. No surrounding drop shadow or closed dark outline. */}
    <g data-wear-turf-contact="" fill="none" strokeLinecap="round" pointerEvents="none">
      {geometry.contacts.map((contact,i)=><g key={i}>
        {contactShade&&<path d={contact.d} transform={`translate(${contact.dx} ${contact.dy})`} stroke={p.shade} strokeWidth="1.05" opacity={theme.isNight?.42:.3}/>}
        <path d={contact.d} transform="translate(0 -.4)" stroke={theme.landscapeEnvironment?.grassTop??theme.hillGreenMid} strokeWidth=".55" opacity={theme.isNight?.22:.18}/>
      </g>)}
    </g>
    <g id={id+'-grass'}><style>{grassCss}</style>
      {geometry.tufts.map(t=>{const variant=Math.floor(wearHash(t.x,17)*9);
        const minimumScale=(theme.isNight || theme.timeOfDay==='dusk') ? .2 : 0;
        const scale=Math.max(minimumScale,(t.side===-1?.14:.17)+wearHash(t.x,t.y)*.04);
        return <g key={`${t.x},${t.y}`} opacity={meadowGrassOpacity(theme,t.side===-1?.65:.85,scale)}>
        <Grass type={variant%3===1?'woven':'short'} x={t.x} y={t.y} scale={scale} flip={variant%2===0}/>
      </g>;})}
    </g>
  </g>;
}

export const WearMaterialSurface = memo(function WearMaterialSurface({ strokes, theme, nightPathTone='warmBrown' }: { strokes: WearStroke[]; theme: YorkshireSceneTheme; nightPathTone?: NightPathTone }) {
  const id='yard-wear-material-'+useId().replace(/:/g,'');
  const query=typeof window==='undefined'?new URLSearchParams():new URLSearchParams(window.location.search);
  const edge=query.get('wearEdgeStudy')==='clean'?'clean':'original';
  const nightCrisp=query.get('wearNightEdge')==='crisp';
  const geometry=useMemo(()=>buildWearMaterial(strokes,edge==='clean'),[strokes,edge]);
  // Saved appearance is authoritative, including when opening an old study URL.
  const tone:WearTone=nightPathReference(nightPathTone,theme.isNight);
  const reviewing=query.has('wearToneStudy')||query.has('wearCurveStudy')||query.has('wearEdgeStudy')||query.has('wearNightEdge');
  const href=(variant:string,time=theme.timeOfDay??'night',edgeVariant=edge,crispVariant=nightCrisp)=>`?wearToneStudy=${variant}&wearTime=${time}${query.has('wearCurveStudy')?'&wearCurveStudy=1':''}&wearEdgeStudy=${edgeVariant}&wearNightEdge=${crispVariant?'crisp':'soft'}`;
  return <><WearMaterialDrawing geometry={geometry} theme={theme} id={id} tone={tone} edge={edge} nightCrisp={nightCrisp}/>
    {reviewing&&createPortal(<aside aria-label="笔刷路线与配色对照" style={{position:'fixed',right:20,bottom:76,zIndex:10000,padding:16,width:300,pointerEvents:'auto',background:'#282e25f5',color:'#eee8d8',border:'1px solid #69735a',borderRadius:10,fontSize:12,lineHeight:1.8}}>
      <strong>笔刷路线与配色对照</strong>
      <details><summary>查看对照设置</summary>
      <p style={{margin:'6px 0'}}>收笔后：黄虚线为原始路线，青线为拟合路线。对照线不保存。</p>
      <p style={{margin:'6px 0'}}>新画笔迹按距离去抖后拟合，已有笔迹不自动重拟合。<a style={{color:'#dfd8a6'}} href="/art-studies/wear-fit/index.html">理想／抖动／拟合对照</a></p>
      <p style={{margin:'6px 0'}}>本轮减弱端头收窄，平顺细小折痕，让边草贴合土边；已有路径也会更新轮廓。<a style={{color:'#dfd8a6'}} href="/art-studies/wear-outline/index.html">轮廓前后对照</a></p>
      <p style={{margin:'6px 0'}}>颜色：{toneNames[tone]}。边缘：{edge==='clean'?'明确中心＋轻薄路肩':'原版'}；单点沿用原组件。</p>
      <p style={{margin:'6px 0'}}>夜间色调在「布置庭院 → 土径外观」选择。旧配色实验链接不覆盖已保存的选择。</p>
      <a style={{color:'#dfd8a6'}} href={href(tone,theme.timeOfDay,'original')}>原版边缘</a>　<a style={{color:'#dfd8a6'}} href={href(tone,theme.timeOfDay,'clean')}>轻薄路肩</a><br/>
      <p style={{margin:'6px 0'}}>夜间模糊：{nightCrisp?'关闭':'保留'}（仅夜间生效；轻薄路肩自身的覆盖过渡仍保留）。<br/>
        <a style={{color:'#dfd8a6'}} href={href(tone,'night',edge,false)}>保留模糊</a>　<a style={{color:'#dfd8a6'}} href={href(tone,'night',edge,true)}>关闭模糊</a>
      </p>
      <a style={{color:'#dfd8a6'}} href={href(tone,'dusk')}>黄昏对照</a>　<a style={{color:'#dfd8a6'}} href={href(tone,'night')}>夜间对照</a>
      {'　'}<a style={{color:'#dfd8a6'}} href={href(tone,'day')}>白天对照</a>
      </details>
    </aside>,document.body)}
  </>;
});
