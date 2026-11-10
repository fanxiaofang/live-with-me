import { useMemo, useRef, useState } from 'react';
import { emptyYardLayout, constrainPlacement, resolveYardLayout, yardSceneLayout, yardExplorationBounds, YARD_STORAGE_KEY, PAVING_IDS, isPaving, type PavingMaterial, type PavingSize, type YardId, type YardLayout, type YardPlacement } from './yardLayout';
import { extendWearStroke, isWearPoint, MAX_WEAR_POINTS, MAX_ERASE_POINTS, resolveWearStrokes, type WearPoint, type WearStrength, type WearStroke } from './yardWear';
import { fitWearStroke } from './wearCurve';
import { isWearDab } from './wearMaterial';
import { resolveNightPathTone, type NightPathTone } from './yardAppearance';

type YardSnapshot = { layout: YardLayout; wearStrokes: WearStroke[]; nightPathTone: NightPathTone };

function load(): YardSnapshot {
  try {
    const saved = JSON.parse(localStorage.getItem(YARD_STORAGE_KEY) || 'null');
    return { layout: resolveYardLayout(saved?.objects), wearStrokes: resolveWearStrokes(saved?.wearStrokes), nightPathTone: resolveNightPathTone(saved?.nightPathTone) };
  } catch { return { layout: emptyYardLayout(), wearStrokes: [], nightPathTone: 'warmBrown' }; }
}
export function useYardEditor() {
  const [snapshot, setSnapshot] = useState(load);
  // Newly introduced groups start at zero without disturbing existing saved edits.
  const layout = useMemo(() => resolveYardLayout(snapshot.layout), [snapshot.layout]);
  const wearStrokes = snapshot.wearStrokes;
  const [active, setActive] = useState(false);
  const [selected, select] = useState<YardId | null>(null);
  const [pavingMaterial, setPaving] = useState<PavingMaterial | null>(null);
  const [pavingSize, setPavingSize] = useState<PavingSize>('medium');
  const [wearBrush, setBrush] = useState<WearStrength | null>(null);
  const [wearBrushSize, setWearBrushSize] = useState(64);
  const setPavingMaterial = (material: PavingMaterial | null) => { setPaving(material); if (material) setBrush(null); };
  const setWearBrush = (strength: WearStrength | null) => { setBrush(strength); if (strength) { setPaving(null); select(null); } };
  const [dragging, setDragging] = useState(false);
  const [guide, setGuide] = useState(false);
  const [saveState, setSaveState] = useState('已载入本地布局');
  const [history, setHistory] = useState<YardSnapshot[]>([]);
  const [future, setFuture] = useState<YardSnapshot[]>([]);
  const current = useRef(snapshot);
  current.current = snapshot;
  const transaction = useRef<YardSnapshot | null>(null);
  const wearDraft=useRef<WearStroke|null>(null);
  const wearBudget=useRef(0);
  const [wearFitReview,setWearFitReview]=useState<{raw:WearPoint[];path:string;maxError:number}|null>(null);
  const apply = (next: YardSnapshot) => { current.current = next; setSnapshot(next); };
  const save = (next = current.current) => {
    try { localStorage.setItem(YARD_STORAGE_KEY, JSON.stringify({ version: 1, objects: next.layout, wearStrokes: next.wearStrokes, nightPathTone: resolveNightPathTone(next.nightPathTone) })); setSaveState('已自动保存到本机'); }
    catch { setSaveState('本地保存失败，请导出布局备份'); }
  };
  const record = (before: YardSnapshot) => { setHistory(h => [...h.slice(-49), before]); setFuture([]); };
  const setNightPathTone = (value: NightPathTone) => {
    const nightPathTone = resolveNightPathTone(value);
    if (transaction.current || current.current.nightPathTone === nightPathTone) return;
    record(current.current);
    const next = { ...current.current, nightPathTone };
    apply(next); save(next);
  };
  const begin = () => { if (!transaction.current) transaction.current = current.current; setDragging(true); };
  const cancel = () => { wearDraft.current=null; if (transaction.current) apply(transaction.current); transaction.current = null; setDragging(false); };
  const commit = () => {
    if(wearDraft.current){
      const raw=wearDraft.current;
      let fit=isWearDab(raw)?{stroke:raw,path:'',maxError:0}:fitWearStroke(raw);
      // Flattening a curve must not silently overflow the existing save budget.
      if(fit.stroke.points.length>raw.points.length+wearBudget.current)fit={stroke:raw,path:'',maxError:0};
      apply({...current.current,wearStrokes:[...current.current.wearStrokes,fit.stroke]});
      if(new URLSearchParams(window.location.search).has('wearCurveStudy'))setWearFitReview({raw:raw.points,path:fit.path,maxError:fit.maxError});
      wearDraft.current=null;
    }
    const before = transaction.current; transaction.current = null; setDragging(false);
    if (before && JSON.stringify(before) !== JSON.stringify(current.current)) { record(before); save(); }
  };
  const update = (id: YardId, p: YardPlacement) => {
    if (![p.dx, p.dy, p.angle].every(Number.isFinite)) return;
    const next = { ...current.current, layout: { ...current.current.layout, [id]: constrainPlacement(id, p) } };
    if (JSON.stringify(next.layout[id]) === JSON.stringify(current.current.layout[id])) return;
    if (!transaction.current) { record(current.current); apply(next); save(next); }
    else apply(next);
  };
  const startWearStroke = (point: WearPoint) => {
    if (!wearBrush || !isWearPoint(point) || transaction.current) return false;
    const erasing = wearBrush === 'erase';
    if (erasing && !current.current.wearStrokes.some(stroke => stroke.strength !== 'erase')) return false;
    const limit = erasing ? MAX_ERASE_POINTS : MAX_WEAR_POINTS;
    if (current.current.wearStrokes.filter(stroke => (stroke.strength === 'erase') === erasing).reduce((total, stroke) => total + stroke.points.length, 0) >= limit) {
      setSaveState(erasing ? '擦除记录已达容量上限，可撤销或清空全部手绘痕迹' : '笔刷已达到容量上限，仍可局部擦除或清空全部手绘痕迹'); return false;
    }
    begin();
    wearBudget.current=limit-current.current.wearStrokes.filter(stroke=>(stroke.strength==='erase')===erasing).reduce((sum,stroke)=>sum+stroke.points.length,0)-1;
    wearDraft.current={strength:wearBrush,size:wearBrushSize,points:[point]};
    return true;
  };
  const paintWear = (point: WearPoint | WearPoint[]) => {
    if (!transaction.current) return;
    const last=wearDraft.current;
    if (!last) return;
    let next=last;
    for(const sample of Array.isArray(point)?point:[point]) {
      const extended=extendWearStroke(next,sample,wearBudget.current);
      wearBudget.current-=extended.points.length-next.points.length;
      next=extended;
    }
    wearDraft.current=next;
  };
  const clearWear = () => {
    if (transaction.current || !current.current.wearStrokes.length) return;
    record(current.current);
    const next = { ...current.current, wearStrokes: [] };
    apply(next); save(next);
  };
  const placePaving = (point: { x: number; y: number }) => {
    if (!pavingMaterial) return;
    const id = PAVING_IDS.find(candidate => !current.current.layout[candidate].material);
    if (!id) { setSaveState('道路铺装槽位已用完'); return; }
    update(id, { dx: point.x, dy: point.y, angle: 0, material: pavingMaterial, pavingSize });
    select(id);
  };
  const removePaving = (id: YardId) => {
    if (!isPaving(id)) return;
    update(id, { dx: 0, dy: 0, angle: 0 });
    select(null);
  };
  const undo = () => {
    if (transaction.current) { cancel(); return; }
    const previous = history.at(-1); if (!previous) return;
    const present = current.current;
    setFuture(f => [...f, present]); setHistory(h => h.slice(0, -1)); apply(previous); save(previous);
  };
  const redo = () => {
    if (transaction.current) return;
    const next = future.at(-1); if (!next) return;
    const present = current.current;
    setHistory(h => [...h, present]); setFuture(f => f.slice(0, -1)); apply(next); save(next);
  };
  const reset = () => { cancel(); setPavingMaterial(null); setBrush(null); select(null); record(current.current); const next: YardSnapshot = { layout: emptyYardLayout(), wearStrokes: [], nightPathTone: 'warmBrown' }; apply(next); save(next); };
  const close = () => { cancel(); setPavingMaterial(null); setBrush(null); setActive(false); };
  const sceneLayout = useMemo(() => yardSceneLayout(layout), [layout]);
  const bounds = useMemo(() => yardExplorationBounds(layout, sceneLayout), [layout, sceneLayout]);
  return { layout, active, setActive, selected, select, pavingMaterial, setPavingMaterial, pavingSize, setPavingSize, placePaving, removePaving, dragging, guide, setGuide, saveState,
    wearStrokes, wearBrush, setWearBrush, wearBrushSize, setWearBrushSize, startWearStroke, paintWear, clearWear,
    getWearDraft:()=>wearDraft.current, wearFitReview, nightPathTone: resolveNightPathTone(snapshot.nightPathTone), setNightPathTone,
    begin, cancel, commit, update, undo, redo, reset, close, save,
    canUndo: history.length > 0, canRedo: future.length > 0, sceneLayout, bounds };
}
export type YardEditor = ReturnType<typeof useYardEditor>;
