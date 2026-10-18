import { Maximize2, Minus, Plus } from 'lucide-react';
import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { usePreviewSvgIds } from './usePreviewSvgIds';

interface Bounds { x: number; y: number; width: number; height: number }
interface Point { x: number; y: number }
interface SvgDetailViewProps {
  label: string;
  children: React.ReactNode;
  initialBounds: Bounds;
  focusItem?: string | null;
  resetKey?: string;
  className?: string;
  autoFit?: boolean;
  surfaceColor?: string;
}

const padded = (box: Bounds): Bounds => {
  const margin = Math.max(box.width, box.height) * 0.09 + 1;
  return { x: box.x - margin, y: box.y - margin, width: box.width + margin * 2, height: box.height + margin * 2 };
};

/** Re-render the original vector asset through a local viewBox, without world-camera changes. */
export function SvgDetailView({ label, children, initialBounds, focusItem, resetKey, className = '', autoFit = true, surfaceColor }: SvgDetailViewProps) {
  const svg = useRef<SVGSVGElement>(null);
  const content = useRef<SVGGElement>(null);
  const fit = useRef(padded(initialBounds));
  const current = useRef(fit.current);
  const [view, setView] = useState(fit.current);
  const pointers = useRef(new Map<number, Point>());
  const starts = useRef(new Map<number, Point>());
  const moved = useRef(false);
  const hintId = useId();
  usePreviewSvgIds(content, children);

  const update = (next: Bounds) => { current.current = next; setView(next); };
  const localPoint = (point: Point): Point => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };
    return new DOMPoint(point.x, point.y).matrixTransform(matrix.inverse());
  };
  const zoom = (factor: number, anchor?: Point, destination?: Point) => {
    const old = current.current;
    const width = Math.max(fit.current.width / 6, Math.min(fit.current.width, old.width * factor));
    const ratio = width / old.width;
    const at = anchor ?? { x: old.x + old.width / 2, y: old.y + old.height / 2 };
    const to = destination ?? at;
    update({ x: at.x - (to.x - old.x) * ratio, y: at.y - (to.y - old.y) * ratio,
      width, height: old.height * ratio });
  };

  useLayoutEffect(() => {
    if (!autoFit || !content.current) return;
    const box = content.current.getBBox();
    if (!box.width || !box.height) return;
    const previous = fit.current;
    fit.current = padded(box);
    if (Math.abs(current.current.width - previous.width) < 0.01) update(fit.current);
  }, [children, autoFit]);

  useLayoutEffect(() => { update(fit.current); }, [resetKey]);

  useLayoutEffect(() => {
    if (!focusItem || !content.current) return;
    const target = Array.from(content.current.querySelectorAll<SVGGraphicsElement>('[data-preview-item]'))
      .find(node => node.dataset.previewItem === focusItem);
    const rootMatrix = content.current.getCTM(), targetMatrix = target?.getCTM();
    if (!target || !rootMatrix || !targetMatrix) return;
    const box = target.getBBox(), matrix = rootMatrix.inverse().multiply(targetMatrix);
    const points = [[box.x, box.y], [box.x + box.width, box.y], [box.x, box.y + box.height],
      [box.x + box.width, box.y + box.height]].map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
    const x = Math.min(...points.map(p => p.x)), y = Math.min(...points.map(p => p.y));
    const itemWidth = Math.max(...points.map(p => p.x)) - x;
    const itemHeight = Math.max(...points.map(p => p.y)) - y;
    const ratio = fit.current.height / fit.current.width;
    const width = Math.max(fit.current.width / 6, Math.min(fit.current.width, Math.max(itemWidth, itemHeight / ratio) * 1.6));
    update({ x: x + itemWidth / 2 - width / 2, y: y + itemHeight / 2 - width * ratio / 2,
      width, height: width * ratio });
  }, [focusItem]);

  useEffect(() => {
    const node = svg.current;
    if (!node) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault(); event.stopPropagation();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? node.clientHeight : 1);
      zoom(Math.exp(Math.max(-200, Math.min(200, delta)) * 0.003), localPoint({ x: event.clientX, y: event.clientY }));
    };
    node.addEventListener('wheel', wheel, { passive: false });
    return () => node.removeEventListener('wheel', wheel);
  }, []);

  const endPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    pointers.current.delete(event.pointerId); starts.current.delete(event.pointerId);
    const target = event.target as Element;
    if (target.hasPointerCapture?.(event.pointerId)) target.releasePointerCapture(event.pointerId);
  };
  const level = fit.current.width / view.width;
  return (
    <section aria-label={label} className={`min-w-0 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 text-xs text-[#e5d1bc]">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-1.5">
          <button type="button" aria-label={`${label}缩小`} disabled={level <= 1.001}
            onClick={() => zoom(1.3)} className="p-2 rounded-lg hover:bg-[#493123] disabled:opacity-35"><Minus className="w-4 h-4" /></button>
          <output aria-label={`${label}倍率`} className="w-10 text-center tabular-nums">{level.toFixed(1)}×</output>
          <button type="button" aria-label={`${label}放大`} disabled={level >= 5.999}
            onClick={() => zoom(1 / 1.3)} className="p-2 rounded-lg hover:bg-[#493123] disabled:opacity-35"><Plus className="w-4 h-4" /></button>
          <button type="button" aria-label={`${label}恢复完整视图`} onClick={() => update(fit.current)}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-[#60452f] hover:bg-[#493123]">
            <Maximize2 className="w-3.5 h-3.5" /> 完整视图
          </button>
        </div>
      </div>
      <div role="region" aria-label={`${label}画布`} aria-describedby={hintId} tabIndex={0}
        style={surfaceColor ? { backgroundColor: surfaceColor } : undefined}
        className="h-[clamp(190px,32vh,340px)] rounded-xl border border-[#5a402c] bg-[#19120e] overflow-hidden focus-visible:outline-2 focus-visible:outline-[#e7b76c]"
        onKeyDown={event => {
          if (event.target !== event.currentTarget) return;
          const box = current.current;
          const offsets: Record<string, Point> = { ArrowLeft: { x: -box.width * 0.08, y: 0 }, ArrowRight: { x: box.width * 0.08, y: 0 },
            ArrowUp: { x: 0, y: -box.height * 0.08 }, ArrowDown: { x: 0, y: box.height * 0.08 } };
          if (offsets[event.key]) { event.preventDefault(); update({ ...box, x: box.x + offsets[event.key].x, y: box.y + offsets[event.key].y }); }
          else if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(1 / 1.3); }
          else if (event.key === '-') { event.preventDefault(); zoom(1.3); }
          else if (event.key === 'Home') { event.preventDefault(); update(fit.current); }
        }}>
        <svg ref={svg} viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`} shapeRendering="geometricPrecision"
          className="w-full h-full select-none cursor-grab active:cursor-grabbing" style={{ touchAction: 'none' }}
          onClickCapture={event => { if (moved.current) { event.preventDefault(); event.stopPropagation(); } }}
          onPointerDown={event => {
            if (event.button !== 0) return;
            event.stopPropagation();
            if (!pointers.current.size) moved.current = false;
            const point = { x: event.clientX, y: event.clientY };
            pointers.current.set(event.pointerId, point); starts.current.set(event.pointerId, point);
            if (pointers.current.size > 1) moved.current = true;
            // Capture the original object so a stationary tap retains its click.
            (event.target as Element).setPointerCapture(event.pointerId);
          }}
          onPointerMove={event => {
            const previous = pointers.current.get(event.pointerId);
            if (!previous) return;
            event.stopPropagation();
            const before = [...pointers.current.values()];
            const next = { x: event.clientX, y: event.clientY };
            pointers.current.set(event.pointerId, next);
            const start = starts.current.get(event.pointerId)!;
            if (Math.hypot(next.x - start.x, next.y - start.y) > 4) moved.current = true;
            if (!moved.current) return;
            const after = [...pointers.current.values()];
            if (before.length === 2) {
              const midpoint = (p: Point[]) => ({ x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 });
              const distance = (p: Point[]) => Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
              if (distance(before) > 0 && distance(after) > 0) zoom(distance(before) / distance(after), localPoint(midpoint(before)), localPoint(midpoint(after)));
            } else if (before.length === 1) {
              const from = localPoint(previous), to = localPoint(next), box = current.current;
              update({ ...box, x: box.x + from.x - to.x, y: box.y + from.y - to.y });
            }
          }}
          onPointerUp={endPointer} onPointerCancel={endPointer}
          onLostPointerCapture={event => { pointers.current.delete(event.pointerId); starts.current.delete(event.pointerId); }}>
          <g ref={content}>{children}</g>
        </svg>
      </div>
      <p id={hintId} className="pt-2 text-[11px] leading-relaxed text-[#c3ad97]">滚轮或双指缩放，拖动查看细节。键盘可用方向键、＋／－与 Home。</p>
    </section>
  );
}
