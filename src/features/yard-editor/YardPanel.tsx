import { Download, Move, Redo2, RotateCcw, Undo2, X, Sprout } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { YardEditor } from './useYardEditor';
import { canRotate, canResize, isLocked, isGrass, isPaving, PAVING_MATERIALS, PAVING_SIZES, TILLED_PLOT_IDS, YARD_IDS, YARD_OBJECTS, type PavingId, type PavingMaterial, type PavingSize } from './yardLayout';
import { NaturalPavingStone } from '../../components/scenery/yorkshire/dressing/NaturalPavingStone';
import { WEAR_STRENGTHS, type WearStrength } from './yardWear';
import { GARDEN_CROPS, CROP_DENSITIES, type GardenCrop, type CropDensity } from './yardCrops';
import { NIGHT_PATH_TONES, type NightPathTone } from './yardAppearance';

export function YardPanel({ editor, onOpen }: { editor: YardEditor; onOpen: () => void }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [exportError, setExportError] = useState('');
  const [minimized, setMinimized] = useState(false);
  useEffect(() => {
    if (!editor.active) return;
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,select,textarea,[contenteditable=true]')) return;
      if (e.key === 'Escape') {
        if (editor.dragging) return;
        if (editor.wearBrush) editor.setWearBrush(null); else editor.close();
      }
      if ((e.ctrlKey || e.metaKey) && ['z', 'y'].includes(e.key.toLowerCase())) {
        e.preventDefault(); if (e.shiftKey || e.key.toLowerCase() === 'y') editor.redo(); else editor.undo();
      }
    };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  }, [editor]);
  const button = 'rounded-lg border border-[#5b4a38] px-3 py-2 text-xs text-[#eadfce] hover:bg-[#453626] focus-visible:outline-2 focus-visible:outline-[#d9b47d] disabled:opacity-40 disabled:cursor-not-allowed';
  if (!editor.active) return <button type="button" onClick={onOpen} className={`fixed bottom-5 left-5 z-40 flex items-center gap-2 bg-[#29231b] ${button}`}>
    <Move size={15} />布置庭院
  </button>;
  const id = editor.selected, p = id ? editor.layout[id] : null;
  const pavingIds = YARD_IDS.filter((key): key is PavingId => isPaving(key) && !!editor.layout[key].material);
  const exportLayout = () => {
    try {
      const blob = new Blob([JSON.stringify({ version: 1, objects: editor.layout, wearStrokes: editor.wearStrokes, nightPathTone: editor.nightPathTone, sceneLayout: editor.sceneLayout }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = 'live-with-me-yard-layout.json'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); setExportError('');
    } catch { setExportError('导出失败，请重试'); }
  };
  return <aside aria-label="庭院布置" className="fixed bottom-5 left-5 z-40 w-[min(318px,calc(100vw-40px))] max-h-[70vh] overflow-y-auto rounded-xl border border-[#554735] bg-[#27221b]/95 p-4 text-[#ede3d3]">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm font-medium"><Move size={16} className="text-[#d8b277]" />布置庭院</div>
      <div className="flex items-center gap-1">
        <button type="button" className="rounded px-2 py-2 text-xs hover:bg-[#453626]" onClick={() => setMinimized(v => !v)}>{minimized ? '展开' : '收起'}</button>
        <button type="button" className="rounded p-2 hover:bg-[#453626]" aria-label="完成庭院布置" onClick={editor.close}><X size={17} /></button>
      </div>
    </div>
    {!minimized && <>
    <p className="mt-2 text-xs leading-5 text-[#c5b9a5]">拖动物件调整位置，拖动空地移动视野。<br />方向键微调，Shift 加快；Esc 退出。</p>
    <label className="mt-3 block text-xs">选择物件
      <select aria-label="选择庭院物件" value={id ?? ''} onChange={e => { editor.setPavingMaterial(null); editor.setWearBrush(null); editor.select(e.target.value as NonNullable<typeof id> || null); }}
        className="mt-2 w-full rounded-lg border border-[#66543d] bg-[#332a20] px-2 py-2 text-sm">
        <option value="">点击场景中的物件</option>
        <optgroup label="建筑与生活摆设">
          {YARD_IDS.filter(key => !isGrass(key) && !isPaving(key) && !canResize(key)).map(key => <option key={key} value={key}>{YARD_OBJECTS[key].name}{isLocked(key) ? ' · 已锁定' : ''}</option>)}
        </optgroup>
        <optgroup label="开垦土地">
          {YARD_IDS.filter(canResize).map(key => <option key={key} value={key}>{YARD_OBJECTS[key].name}{editor.layout[key].removed ? ' · 已收回' : ''}</option>)}
        </optgroup>
        <optgroup label="草簇与花草群落">
          {YARD_IDS.filter(isGrass).map(key => <option key={key} value={key}>{YARD_OBJECTS[key].name}</option>)}
        </optgroup>
        {pavingIds.length > 0 && <optgroup label="道路铺装">
          {pavingIds.map(key => <option key={key} value={key}>{YARD_OBJECTS[key].name} · {PAVING_MATERIALS[editor.layout[key].material!]}</option>)}
        </optgroup>}
      </select>
    </label>
    <section className="mt-4 border-t border-[#4f4232] pt-3" aria-label="踩踏笔刷">
      <h3 className="text-xs font-medium text-[#e1cfad]">踩踏笔刷</h3>
      <p className="mt-1 text-[11px] leading-4 text-[#bdb29d]">踩踏适合局部磨损，土径适合连续小路。按住拖动涂刷或局部擦除，每一笔都可撤销；擦除仅影响已有手绘痕迹。</p>
      <div className="mt-2 grid grid-cols-6 gap-1.5">
        {(Object.entries(WEAR_STRENGTHS) as [WearStrength, string][]).map(([strength, label]) => <button key={strength} type="button"
          aria-pressed={editor.wearBrush === strength} disabled={editor.dragging}
          onClick={() => editor.setWearBrush(editor.wearBrush === strength ? null : strength)}
          className={`${strength === 'trail' || strength === 'erase' ? 'col-span-3' : 'col-span-2'} rounded-md border px-2 py-2 text-[11px] disabled:opacity-40 ${editor.wearBrush === strength ? 'border-[#d5b476] bg-[#51422e] text-[#f5e4c0]' : 'border-[#514633] bg-[#332d23] text-[#d5c8b1] hover:bg-[#433a2b]'}`}>
          <span aria-hidden="true" className={`mx-auto mb-1.5 block h-2.5 w-8 ${strength === 'erase' ? 'rounded border border-dashed border-[#dfa59a]' : 'rounded-[50%] bg-[#b19b68]'}`}
            style={{ opacity: strength === 'light' ? .28 : strength === 'medium' ? .62 : 1 }} />{label}
        </button>)}
      </div>
      <label className="mt-3 flex items-center gap-2 text-xs">笔刷大小
        <input aria-label="踩踏笔刷大小" type="range" min="24" max="140" step="4" value={editor.wearBrushSize}
          disabled={editor.dragging} onChange={e => editor.setWearBrushSize(Number(e.target.value))} className="min-w-0 flex-1 accent-[#cfaa73]" />
        <span className="w-8 text-right tabular-nums">{editor.wearBrushSize}</span>
      </label>
      {editor.wearBrush && <div className="mt-2 flex items-center justify-between rounded-md bg-[#3a3327] px-2.5 py-2 text-[11px] text-[#ddc99f]">
        <span>{WEAR_STRENGTHS[editor.wearBrush]} · Esc 结束笔刷</span>
        <button type="button" disabled={editor.dragging} className="underline underline-offset-2" onClick={() => editor.setWearBrush(null)}>结束涂刷</button>
      </div>}
      {editor.wearStrokes.length > 0 && <button type="button" disabled={editor.dragging} className={`${button} mt-2 w-full`} onClick={editor.clearWear}>清空全部手绘痕迹（可撤销）</button>}
      <details className="mt-3 rounded-lg border border-[#514633] px-2.5 py-2">
        <summary className="cursor-pointer text-xs text-[#ddc99f]">土径外观</summary>
        <fieldset className="mt-3" disabled={editor.dragging}>
          <legend className="text-xs text-[#e1cfad]">夜间土径色调</legend>
          <div className="mt-2 space-y-1.5">
            {(Object.entries(NIGHT_PATH_TONES) as [NightPathTone, typeof NIGHT_PATH_TONES[NightPathTone]][]).map(([value, option])=><label key={value} className={`flex cursor-pointer items-center gap-2 rounded-md border px-2 py-2 text-xs ${editor.nightPathTone===value?'border-[#d5b476] bg-[#51422e] text-[#f5e4c0]':'border-[#514633] bg-[#332d23] text-[#d5c8b1]'}`}>
              <input type="radio" name="night-path-tone" value={value} checked={editor.nightPathTone===value} onChange={()=>editor.setNightPathTone(value)} className="accent-[#cfaa73]"/>
              <span aria-hidden="true" className="h-3 w-5 rounded-sm border border-white/10" style={{background:option.swatch}}/>
              {option.label}{value==='warmBrown'&&<span className="ml-auto text-[10px] text-[#bdb29d]">默认</span>}
            </label>)}
          </div>
        </fieldset>
        <p className="mt-2 text-[11px] leading-4 text-[#bdb29d]">仅在夜晚生效，统一应用于庭院连续土面。白天、黄昏和单点踩踏沿用原有配色。</p>
      </details>
    </section>
    <section className="mt-4 border-t border-[#4f4232] pt-3" aria-label="道路铺装素材">
      <h3 className="text-xs font-medium text-[#e1cfad]">道路铺装素材</h3>
      <p className="mt-1 text-[11px] leading-4 text-[#bdb29d]">选素材后点草地放一块；重复点击可连续铺设，拖动已铺石块可调整位置。</p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {(Object.entries(PAVING_MATERIALS) as [PavingMaterial,string][]).map(([material,name])=>{
          const painting=editor.pavingMaterial===material;
          const editing=!!id && isPaving(id) && p?.material===material;
          return <button key={material} type="button" aria-pressed={painting || editing}
            onClick={()=>editor.setPavingMaterial(painting ? null : material)}
            className={`rounded-md border px-2 py-2 text-left text-[11px] leading-4 transition-colors ${painting || editing ? 'border-[#d5b476] bg-[#51422e] text-[#f5e4c0]' : 'border-[#514633] bg-[#332d23] text-[#d5c8b1] hover:bg-[#433a2b]'}`}>
            <span className="mb-1.5 flex h-5 items-center gap-0.5" aria-hidden="true">
              {material==='fieldstone' && <><i className="h-2 w-4 -skew-x-12 rounded-[3px] bg-[#b8a77e]"/><i className="h-2 w-3 rounded-[3px] bg-[#998966]"/></>}
              {material==='limestone' && <i className="h-2 w-6 rounded-[3px] bg-[#d2c8a9]"/>}
              {material==='cobble' && <><i className="h-2 w-2 rounded-full bg-[#9a9b86]"/><i className="h-2.5 w-2.5 rounded-full bg-[#818572]"/><i className="h-2 w-2 rounded-full bg-[#b7b59a]"/></>}
              {(material==='rawGranite' || material==='riverRock' || material==='splitSlate') && <svg viewBox="-23 -12 46 25" className="h-5 w-10"><NaturalPavingStone kind={material} index={1} /></svg>}
              {material==='brick' && <><i className="h-2 w-3 rounded-sm bg-[#a66d4d]"/><i className="h-2 w-3 rounded-sm bg-[#90573e]"/></>}
              {material==='oak' && <i className="h-2 w-6 rounded-sm bg-[#c49a63]"/>}
              {material==='weathered' && <i className="h-2 w-6 rounded-sm bg-[#756044]"/>}
            </span>{name}
          </button>;
        })}
      </div>
      <div className="mt-3 flex items-center gap-1.5" aria-label="新铺道路尺寸">
        <span className="mr-1 text-[11px] text-[#bdb29d]">新铺尺寸</span>
        {(Object.entries(PAVING_SIZES) as [PavingSize,string][]).map(([size,label])=><button key={size} type="button"
          aria-pressed={editor.pavingSize===size} data-paving-size-choice={size}
          onClick={()=>editor.setPavingSize(size)}
          className={`flex-1 rounded-md border py-1.5 text-[11px] ${editor.pavingSize===size ? 'border-[#d5b476] bg-[#51422e] text-[#f5e4c0]' : 'border-[#514633] bg-[#332d23] text-[#d5c8b1] hover:bg-[#433a2b]'}`}>
          <span className="mr-1 inline-block rounded-sm bg-[#b8a77e] align-middle" style={{width:size==='small'?8:size==='medium'?12:16,height:4}} />{label}
        </button>)}
      </div>
      {editor.pavingMaterial && <div className="mt-2 flex items-center justify-between rounded-md bg-[#3a3327] px-2.5 py-2 text-[11px] text-[#ddc99f]">
        <span>铺设中：{PAVING_MATERIALS[editor.pavingMaterial]}</span>
        <button type="button" className="underline underline-offset-2" onClick={()=>editor.setPavingMaterial(null)}>结束铺设</button>
      </div>}
    </section>
    {id && p && <div className="mt-3 border-t border-[#4f4232] pt-3">
      {isLocked(id) ? <p className="text-xs text-[#d8c6a8]">大木屋作为庭院中心，位置已锁定。</p> : <>
        {isPaving(id) && <label className="mb-3 block text-xs">此块材质
          <select aria-label="此块道路材质" value={p?.material ?? 'fieldstone'} onChange={e=>editor.update(id,{...p!,material:e.target.value as PavingMaterial})}
            className="mt-1.5 w-full rounded-lg border border-[#66543d] bg-[#332a20] px-2 py-2 text-xs">
            {(Object.entries(PAVING_MATERIALS) as [PavingMaterial,string][]).map(([value,label])=><option key={value} value={value}>{label}</option>)}
          </select>
        </label>}
        {isPaving(id) && <label className="mb-3 block text-xs">此块尺寸
          <select aria-label="此块道路尺寸" value={p?.pavingSize ?? 'medium'} onChange={e=>editor.update(id,{...p!,pavingSize:e.target.value as PavingSize})}
            className="mt-1.5 w-full rounded-lg border border-[#66543d] bg-[#332a20] px-2 py-2 text-xs">
            {(Object.entries(PAVING_SIZES) as [PavingSize,string][]).map(([value,label])=><option key={value} value={value}>{label}</option>)}
          </select>
        </label>}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-[#c5b9a5]">{canRotate(id) ? '调整位置与朝向' : '调整位置'}</span>
          <button className={button} onClick={() => editor.update(id, canResize(id) ? { ...p, dx: 0, dy: 0, angle: 0, length: 100, width: 100 } : { dx: 0, dy: 0, angle: 0 })}>还原此物件</button>
        </div>
        {isPaving(id) && <button type="button" className={`${button} mt-2 w-full`} onClick={()=>editor.removePaving(id)}>收回这块铺装</button>}
        {canResize(id) && <>
          {p.removed ? <div className="mt-3 rounded-lg border border-[#76603e] bg-[#3a3327] p-3">
            <p className="text-xs text-[#ddc99f]">这块土地与作物已一起收回，位置、尺寸和种植设置仍会保留。</p>
            <button type="button" className={`${button} mt-2 w-full border-[#b9935c]`} onClick={() => editor.update(id, { ...p, removed: false })}><Sprout size={14} className="mr-1 inline" />放回庭院</button>
          </div> : <button type="button" className={`${button} mt-3 w-full`} onClick={() => editor.update(id, { ...p, removed: true })}>收回这块土地</button>}
        </>}
        <div className="mt-2 flex justify-center gap-1" aria-label="微调位置">
          {([['←', -5, 0, '向左移动'], ['↑', 0, -5, '向上移动'], ['↓', 0, 5, '向下移动'], ['→', 5, 0, '向右移动']] as const).map(([label, dx, dy, name]) =>
            <button key={name} aria-label={name} className={button} onClick={() => editor.update(id, { ...p, dx: p.dx + dx, dy: p.dy + dy })}>{label}</button>)}
        </div>
        {canResize(id) && <section className="mt-3 rounded-lg border border-[#514633] bg-[#30291f] p-3" aria-label="开垦土地调整">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-medium text-[#e1cfad]">土地朝向与尺寸</h3>
            <span className="rounded-full bg-[#51422e] px-2 py-0.5 text-[10px] text-[#f0d3a7]">地面旋转</span>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-1.5" aria-label="选择要调整的开垦土地">
            {TILLED_PLOT_IDS.map(plotId => {
              const selected = id === plotId;
              const removed = editor.layout[plotId].removed;
              const label = YARD_OBJECTS[plotId].name.replace('开垦土地 · ', '');
              return <button key={plotId} type="button" aria-pressed={selected}
                onClick={() => { editor.setPavingMaterial(null); editor.setWearBrush(null); editor.select(plotId); }}
                className={`flex min-w-0 items-center justify-between gap-1 rounded-md border px-2 py-2 text-left text-[11px] ${selected ? 'border-[#d5b476] bg-[#51422e] text-[#f5e4c0]' : 'border-[#514633] bg-[#332d23] text-[#d5c8b1] hover:bg-[#433a2b]'}`}>
                <span className="truncate">{label}</span><span className="shrink-0 text-[10px] opacity-70">{removed ? '已收回' : selected ? '编辑中' : ''}</span>
              </button>;
            })}
          </div>
          {p.removed ? <p className="text-[11px] leading-4 text-[#bdb29d]">当前土地已收回。可在上方切换其他土地，或点击“放回庭院”后继续调整。</p> : <>
          <p className="mb-3 text-[11px] leading-4 text-[#bdb29d]">以原土地长边为东西轴；三种朝向均贴合同一地面。旋转 0° 为当前土地的默认朝向。</p>
          <fieldset className="mb-4 border-b border-[#514633] pb-3" disabled={editor.dragging}>
            <legend className="mb-2 text-xs font-medium text-[#e1cfad]">种植作物</legend>
            <div className="grid grid-cols-2 gap-1.5">
              {([['', '留空 / 清空作物'], ...Object.entries(GARDEN_CROPS)] as [GardenCrop | '', string][]).map(([crop, label]) => <button
                key={crop} type="button" aria-pressed={(p.crop ?? '') === crop}
                onClick={() => editor.update(id, { ...p, crop: crop || undefined })}
                className={`rounded-md border px-2 py-2 text-[11px] disabled:opacity-40 ${(p.crop ?? '') === crop ? 'border-[#d5b476] bg-[#51422e] text-[#f5e4c0]' : 'border-[#514633] bg-[#332d23] text-[#d5c8b1] hover:bg-[#433a2b]'}`}>
                {label}
              </button>)}
            </div>
            {p.crop && <>
              <div className="mt-2 flex items-center gap-1.5" aria-label="种植疏密">
                <span className="mr-1 text-[11px] text-[#bdb29d]">疏密</span>
                {(Object.entries(CROP_DENSITIES) as [CropDensity, string][]).map(([density, label]) => <button key={density} type="button"
                  aria-pressed={(p.cropDensity ?? 'normal') === density} onClick={() => editor.update(id, { ...p, cropDensity: density })}
                  className={`flex-1 rounded-md border py-1.5 text-[11px] ${(p.cropDensity ?? 'normal') === density ? 'border-[#d5b476] bg-[#51422e] text-[#f5e4c0]' : 'border-[#514633] bg-[#332d23] text-[#d5c8b1] hover:bg-[#433a2b]'}`}>
                  {label}
                </button>)}
              </div>
              <p className="mt-2 text-[11px] leading-4 text-[#bdb29d]">沿土垄自动排列；调整土地长宽会改变株数与间距，菜株保持原大小。</p>
            </>}
          </fieldset>
          <div className="space-y-3">
            {(['length', 'width'] as const).map(key => <label key={key} className="flex items-center gap-3 text-xs">
              {key === 'length' ? '长度' : '宽度'}
              <input aria-label={key === 'length' ? '土地长度' : '土地宽度'} type="range" min="50" max="250" step="5" value={p[key] ?? 100}
                onPointerDown={() => editor.begin()} onPointerUp={() => editor.commit()} onPointerCancel={() => editor.cancel()}
                onBlur={() => editor.commit()} onChange={e => editor.update(id, { ...p, [key]: Number(e.target.value) })}
                className="min-w-0 flex-1 accent-[#cfaa73]" />
              <span className="w-10 text-right tabular-nums">{p[key] ?? 100}%</span>
            </label>)}
            <label className="flex items-center gap-3 text-xs">旋转
              <input aria-label="土地旋转" type="range" min="-180" max="180" step="5" value={p.angle}
                onPointerDown={() => editor.begin()} onPointerUp={() => editor.commit()} onPointerCancel={() => editor.cancel()}
                onBlur={() => editor.commit()} onChange={e => editor.update(id, { ...p, angle: Number(e.target.value) })} className="min-w-0 flex-1 accent-[#cfaa73]" />
              <span className="w-8 tabular-nums">{p.angle}°</span>
            </label>
          </div>
          </>}
        </section>}
        {canRotate(id) && !canResize(id) && <label className="mt-3 flex items-center gap-3 text-xs">转向
          <input aria-label={canResize(id) ? '土地旋转' : '栅栏转向'} type="range" min={canResize(id) ? -180 : -75} max={canResize(id) ? 180 : 75} step="5" value={p.angle}
            onPointerDown={() => editor.begin()} onPointerUp={() => editor.commit()} onPointerCancel={() => editor.cancel()}
            onBlur={() => editor.commit()} onChange={e => editor.update(id, { ...p, angle: Number(e.target.value) })} className="min-w-0 flex-1 accent-[#cfaa73]" />
          <span className="w-8 tabular-nums">{p.angle}°</span>
        </label>}
      </>}
    </div>}
    <label className="mt-4 flex items-center gap-2 text-xs text-[#dfd0b8]"><input type="checkbox" checked={editor.guide} onChange={e => editor.setGuide(e.target.checked)} className="accent-[#cfaa73]" />显示通行参考线</label>
    <div className="mt-4 flex flex-wrap gap-2">
      <button title="撤销 Ctrl+Z" aria-label="撤销庭院调整" disabled={!editor.canUndo || editor.dragging} className={button} onClick={editor.undo}><Undo2 size={15} /></button>
      <button title="重做 Ctrl+Shift+Z" aria-label="重做庭院调整" disabled={!editor.canRedo || editor.dragging} className={button} onClick={editor.redo}><Redo2 size={15} /></button>
      <button className={`${button} flex items-center gap-1.5`} disabled={editor.dragging} onClick={exportLayout}><Download size={14} />导出布局</button>
      <button aria-label="恢复庭院默认布局" className={button} disabled={editor.dragging} onClick={() => setConfirmReset(true)}><RotateCcw size={15} /></button>
    </div>
    {confirmReset && <div className="mt-3 rounded-lg bg-[#3a2d20] p-3 text-xs">
      <p>恢复庭院初始布局，并清除道路铺装与手绘踩踏痕迹？可撤销。</p>
      <div className="mt-2 flex gap-2"><button className={button} onClick={() => { editor.reset(); setConfirmReset(false); }}>恢复默认</button><button className={button} onClick={() => setConfirmReset(false)}>取消</button></div>
    </div>}
    <p role="status" className="mt-3 text-xs leading-5 text-[#c5b9a5]">{exportError || editor.saveState}</p>
    <button className="mt-3 w-full rounded-lg bg-[#ad8453] px-3 py-2 text-sm font-medium text-[#201b14] hover:bg-[#c59b65] focus-visible:outline-2 focus-visible:outline-[#f0d3a7]" onClick={editor.close}>完成布置</button>
    </>}
  </aside>;
}
