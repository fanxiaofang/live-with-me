import React, { createContext, createRef, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { YardEditor } from './useYardEditor';
import { YARD_IDS, YARD_OBJECTS, isLocked, isGrass, isGround, yardDepth, type YardId, type YardPlacement } from './yardLayout';
import { wearPolyline } from './wearCurve';

type Drag = { pointer: number; id: YardId; matrix: DOMMatrix; x: number; y: number; origin: YardPlacement; svg: SVGSVGElement };
type BrushDrag = { pointer: number; matrix: DOMMatrix; svg: SVGSVGElement };
type Context = { editor: YardEditor; ready: boolean; targets: Record<YardId, React.RefObject<SVGGElement>>;
  start: (id: YardId, event: React.PointerEvent<SVGGElement>) => void };
const YardContext = createContext<Context | null>(null);
export function useYardPlacement(id: YardId): YardPlacement {
  return useContext(YardContext)?.editor.layout[id] ?? { dx: 0, dy: 0, angle: 0 };
}
export function useYardWearStrokes() { return useContext(YardContext)?.editor.wearStrokes ?? []; }
export function useYardNightPathTone() { return useContext(YardContext)?.editor.nightPathTone ?? 'warmBrown'; }

/** Portals keep asset state/handlers intact while placing complete objects in one depth-sorted SVG layer. */
export function YardWorld({ editor, children }: { editor?: YardEditor; children: React.ReactNode }) {
  const targets = useRef({} as Context['targets']).current;
  for (const id of YARD_IDS) if (!targets[id]) targets[id] = createRef<SVGGElement>();
  const [targetCount, setTargetCount] = useState(0);
  const ready = targetCount === YARD_IDS.length;
  const drag = useRef<Drag | null>(null);
  const brushDrag = useRef<BrushDrag | null>(null);
  const brushSurface = useRef<SVGRectElement>(null);
  const brushCursor=useRef<{x:number;y:number}|null>(null);
  const previewPath=useRef<SVGPathElement>(null);
  const cursorEllipse=useRef<SVGEllipseElement>(null);
  const schedulePreview=useRef<()=>void>(()=>{});
  const live = useRef(editor); live.current = editor;
  const order = useRef([...YARD_IDS]);
  useLayoutEffect(() => { setTargetCount(YARD_IDS.length); }, [YARD_IDS.length]);
  if (editor && !editor.dragging) order.current = [...YARD_IDS].sort((a, b) => Number(isGround(b)) - Number(isGround(a)) || yardDepth(a, editor.layout) - yardDepth(b, editor.layout));

  useEffect(() => {
    let frame=0;
    schedulePreview.current=()=>{
      if(frame)return;
      frame=requestAnimationFrame(()=>{
        frame=0;
        const cursor=brushCursor.current;
        cursorEllipse.current?.setAttribute('visibility',cursor?'visible':'hidden');
        if(cursor){cursorEllipse.current?.setAttribute('cx',String(cursor.x));cursorEllipse.current?.setAttribute('cy',String(cursor.y));}
        const draft=live.current?.getWearDraft();
        previewPath.current?.setAttribute('d',draft?wearPolyline(draft.points.map(p=>({x:p.x,y:p.y/.285}))):'');
      });
    };
    const finish = (cancelled: boolean) => {
      const d = brushDrag.current ?? drag.current; if (!d) return;
      drag.current = null; brushDrag.current = null;
      if (cancelled) live.current?.cancel(); else live.current?.commit();
      previewPath.current?.setAttribute('d','');
      if (d.svg.hasPointerCapture(d.pointer)) d.svg.releasePointerCapture(d.pointer);
    };
    const move = (e: PointerEvent) => {
      const brush = brushDrag.current;
      if (brush && e.pointerId === brush.pointer) {
        e.preventDefault();
        const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(brush.matrix);
        brushCursor.current={ x: point.x, y: point.y };
        const samples=e.getCoalescedEvents?.()??[];
        live.current?.paintWear([...samples,e].map(sample=>{
          const p=new DOMPoint(sample.clientX,sample.clientY).matrixTransform(brush.matrix);
          return {x:p.x,y:p.y};
        }));
        schedulePreview.current();
        return;
      }
      const d = drag.current; if (!d || e.pointerId !== d.pointer) return;
      e.preventDefault();
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(d.matrix);
      live.current?.update(d.id, { ...d.origin, dx: d.origin.dx + p.x - d.x, dy: d.origin.dy + p.y - d.y });
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId === brushDrag.current?.pointer) {
        const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(brushDrag.current.matrix);
        live.current?.paintWear(point);
      }
      if (e.pointerId === (brushDrag.current ?? drag.current)?.pointer) finish(false);
    };
    const cancel = (e: PointerEvent) => {
      const d = brushDrag.current ?? drag.current;
      if (d && e.pointerId === d.pointer && (e.type !== 'lostpointercapture' || e.target === d.svg)) finish(true);
    };
    const abort = () => finish(true);
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape' && (drag.current || brushDrag.current)) { e.preventDefault(); e.stopImmediatePropagation(); finish(true); } };
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    window.addEventListener('lostpointercapture', cancel);
    window.addEventListener('blur', abort);
    window.addEventListener('keydown', key, true);
    return () => {
      if(frame)cancelAnimationFrame(frame);
      schedulePreview.current=()=>{};
      abort();
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel); window.removeEventListener('lostpointercapture', cancel);
      window.removeEventListener('blur', abort); window.removeEventListener('keydown', key, true);
    };
  }, []);
  useEffect(() => {
    if (!editor?.active && (drag.current || brushDrag.current)) {
      const d = (brushDrag.current ?? drag.current)!; drag.current = null; brushDrag.current = null;
      if (d.svg.hasPointerCapture(d.pointer)) d.svg.releasePointerCapture(d.pointer);
    }
  }, [editor?.active]);
  if (!editor) return <>{children}</>;
  const start: Context['start'] = (id, e) => {
    if (!editor.active || e.button !== 0) return;
    e.preventDefault(); e.stopPropagation();
    if (drag.current) return;
    editor.select(id);
    e.currentTarget.focus();
    if (isLocked(id)) return;
    const svg = e.currentTarget.ownerSVGElement;
    const stage = targets[id].current?.parentElement as unknown as SVGGraphicsElement;
    const matrix = stage?.getScreenCTM()?.inverse();
    if (!svg || !matrix) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix);
    editor.begin();
    drag.current = { pointer: e.pointerId, id, matrix, origin: { ...editor.layout[id] }, x: p.x, y: p.y, svg };
    svg.setPointerCapture(e.pointerId);
  };
  return <YardContext.Provider value={{ editor, ready, targets, start }}>
    {children}
    <g id="yard-depth-layer" data-yard-editing={editor.active}>
      {editor.active && editor.pavingMaterial && <rect data-paving-placement-surface="" x="-700" y="240" width="2550" height="600"
        fill="transparent" pointerEvents="all" style={{ cursor: 'crosshair' }}
        onPointerDown={event => {
          if (event.button !== 0 || !live.current?.pavingMaterial) return;
          event.preventDefault(); event.stopPropagation();
          const matrix = event.currentTarget.getScreenCTM()?.inverse();
          if (!matrix) return;
          const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix);
          live.current.placePaving({ x: point.x, y: point.y });
        }} />}
      {order.current.map(id => <g key={id} ref={targets[id]} data-yard-slot={id} />)}
      {editor.active && editor.wearBrush && <>
        <rect ref={brushSurface} data-wear-brush-surface="" x="-700" y="240" width="2550" height="600"
          fill="transparent" pointerEvents="all" style={{ cursor: 'crosshair', touchAction: 'none' }}
          onPointerDown={event => {
            if (event.button !== 0 || drag.current || brushDrag.current) return;
            event.preventDefault(); event.stopPropagation();
            const matrix = event.currentTarget.getScreenCTM()?.inverse(), svg = event.currentTarget.ownerSVGElement;
            if (!matrix || !svg) return;
            const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix);
            if (!live.current?.startWearStroke({ x: point.x, y: point.y })) return;
            brushCursor.current={ x: point.x, y: point.y };
            schedulePreview.current();
            brushDrag.current = { pointer: event.pointerId, matrix, svg };
            svg.setPointerCapture(event.pointerId);
          }}
          onPointerMove={event => {
            if (brushDrag.current) return;
            const matrix = event.currentTarget.getScreenCTM()?.inverse();
            if (matrix) { const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix); brushCursor.current={ x: p.x, y: p.y }; schedulePreview.current(); }
          }}
          onPointerLeave={() => { if (!brushDrag.current) {brushCursor.current=null;schedulePreview.current();} }} />
        <path ref={previewPath} data-wear-preview="lightweight" transform="scale(1 .285)" d="" fill="none" stroke={editor.wearBrush==='erase'?'#e9a297':'#bda77e'} strokeOpacity=".45" strokeWidth={editor.wearBrushSize*.65} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />
        <ellipse ref={cursorEllipse} visibility="hidden" rx={editor.wearBrushSize / 2} ry={editor.wearBrushSize * .285 / 2}
          data-wear-cursor={editor.wearBrush} fill={editor.wearBrush === 'erase' ? '#e9a297' : '#ecd6a4'} fillOpacity=".08" stroke={editor.wearBrush === 'erase' ? '#f0b2a5' : '#f4d99e'} strokeWidth="1.2" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" pointerEvents="none" />
      </>}
    </g>
    {editor.wearFitReview&&editor.active&&<g data-wear-fit-review="" pointerEvents="none" fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke">
      <path d={wearPolyline(editor.wearFitReview.raw)} stroke="#e9b356" strokeDasharray="3 3"/>
      <path d={editor.wearFitReview.path} stroke="#81d9d0"/>
    </g>}
    {editor.active && editor.guide && <g id="yard-route-guide" pointerEvents="none" fill="none" stroke="#f4d99e" strokeWidth="2" strokeDasharray="8 7" opacity=".6">
      {(['wooden_cabin', 'capsule_pod', 'sheep_pen', 'osmanthus'] as YardId[]).map(id => {
        const target = YARD_OBJECTS[id], p = editor.layout[id];
        return <path key={id} d={`M535,505 Q535,555 ${target.x + p.dx},${target.y + p.dy}`} />;
      })}
    </g>}
  </YardContext.Provider>;
}

export function YardObject({ id, children, positioned = false }: { id: YardId; children: React.ReactNode; positioned?: boolean }) {
  const context = useContext(YardContext);
  const content = useRef<SVGGElement>(null);
  const [box, setBox] = useState<DOMRect | null>(null);
  const selected = context?.editor.active && context.editor.selected === id;
  useLayoutEffect(() => {
    if (!context?.editor.active || context.editor.wearBrush || !content.current) return;
    const b = content.current.getBBox();
    setBox(old => old && old.x === b.x && old.y === b.y && old.width === b.width && old.height === b.height ? old : b);
  });
  if (!context) return <>{children}</>;
  if (!context.ready || !context.targets[id].current) return null;
  const { editor } = context, p = editor.layout[id];
  if (p.removed) return null;
  return createPortal(<g data-yard-object={id} data-selected={selected || undefined}
    pointerEvents={(isGrass(id) || isGround(id)) && !editor.active ? 'none' : undefined}
    transform={positioned ? undefined : `translate(${p.dx} ${p.dy})`}
    tabIndex={editor.active ? 0 : undefined} role={editor.active ? 'button' : undefined}
    aria-label={editor.active ? `布置${YARD_OBJECTS[id].name}` : undefined}
    style={editor.active ? { cursor: isLocked(id) ? 'default' : editor.dragging && selected ? 'grabbing' : 'grab', outline: 'none' } : undefined}
    onPointerDownCapture={event => context.start(id, event)}
    onFocus={event => { if (editor.active && event.target === event.currentTarget) editor.select(id); }}
    onKeyDownCapture={event => {
      if (!editor.active) return;
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); editor.select(id); }
      const delta = ({ ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] } as Record<string, number[]>)[event.key];
      if (delta) {
        event.preventDefault(); event.stopPropagation();
        const step = event.shiftKey ? 10 : 2;
        editor.update(id, { ...p, dx: p.dx + delta[0] * step, dy: p.dy + delta[1] * step });
      }
    }}>
    {editor.active && box && <rect x={box.x - 4} y={box.y - 4} width={box.width + 8} height={box.height + 8}
      fill="transparent" pointerEvents="all" />}
    <g ref={content}>{children}</g>
    {selected && box && <rect x={box.x - 5} y={box.y - 5} width={box.width + 10} height={box.height + 10}
      rx="5" fill="none" stroke="#f4d99e" strokeWidth="1.5" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" pointerEvents="none" />}
  </g>, context.targets[id].current!);
}

/** Ground companions remain below all solid objects, but follow their owner's translation. */
export function YardAttachment({ id, children }: { id: YardId; children: React.ReactNode }) {
  const p = useYardPlacement(id);
  return <g data-yard-attachment={id} transform={`translate(${p.dx} ${p.dy})`}>{children}</g>;
}
