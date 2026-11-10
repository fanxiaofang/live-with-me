import { Armchair, BedDouble, ChevronDown, ChevronRight, Home, Layers3, Radio, Trees } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { WorldViewId } from '../types';

const primaryViews = [
  { id: 'overview', label: '整栋小屋', icon: Home },
  { id: 'loft', label: '阁楼', icon: Layers3 },
  { id: 'living_nook', label: '公共起居角', icon: Armchair },
] as const;
const otherViews = [
  { id: 'capsule_pod', label: '旧胶囊仓', icon: BedDouble },
  { id: 'corn_lounge', label: '林间小木屋', icon: Trees },
  { id: 'observatory', label: '外星电波观测台', icon: Radio },
] as const;

type BalloonPosition = { x: number; y: number };
const POSITION_KEY = 'live_with_me_view_balloon_position';
const keepInScreen = (point: BalloonPosition) => ({
  x: Math.max(38, Math.min(window.innerWidth - 38, point.x)),
  y: Math.max(44, Math.min(window.innerHeight - 44, point.y)),
});
function initialPosition(): BalloonPosition {
  try {
    const point = JSON.parse(localStorage.getItem(POSITION_KEY) || 'null');
    if (point && Number.isFinite(point.x) && Number.isFinite(point.y)) return keepInScreen(point);
  } catch { /* A blocked store must not prevent opening the view controls. */ }
  return keepInScreen({ x: window.innerWidth - 42, y: window.innerHeight / 2 });
}
function rememberPosition(point: BalloonPosition) {
  try { localStorage.setItem(POSITION_KEY, JSON.stringify(point)); } catch { /* Keep the current position in memory. */ }
}

function HotAirBalloon() {
  const id = `view-balloon-${useId().replace(/:/g, '')}`;
  const canopy = 'M20 3.2C10.2 3.2 4.2 9.7 4.4 18.1c.2 8.2 7.3 14.1 11.1 19h9c3.8-4.9 10.9-10.8 11.1-19C35.8 9.7 29.8 3.2 20 3.2Z';
  // Match the scene's pumpkin lobes, honey/linen tones, celadon tea ware and wooden baskets.
  return <svg data-view-balloon="" viewBox="0 0 40 56" width="30" height="42" aria-hidden="true" focusable="false"
    strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id={`${id}-orange`} x1="0" y1="0" x2="1" y2=".7">
        <stop stopColor="#f59e0b" /><stop offset=".48" stopColor="#ea580c" /><stop offset="1" stopColor="#c25e00" />
      </linearGradient>
      <linearGradient id={`${id}-linen`} x1="0" y1="0" x2="1" y2=".6">
        <stop stopColor="#fffdf0" /><stop offset=".55" stopColor="#f5ede0" /><stop offset="1" stopColor="#e2c8a2" />
      </linearGradient>
      <linearGradient id={`${id}-honey`} x1="0" y1="0" x2="1" y2=".5">
        <stop stopColor="#fde047" /><stop offset=".42" stopColor="#fbbf24" /><stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>
    {/* Broad curved gores describe volume, with fine edges in the material's own hue. */}
    <path d={canopy} fill={`url(#${id}-orange)`} stroke="#92400e" strokeWidth=".65" />
    <path d="M20 3.2C10.6 5.2 7.2 12.7 8.8 21c1.1 5.8 5 11.6 8 16.1h2.1C14 25.6 12.7 10.8 20 3.2Z"
      fill={`url(#${id}-linen)`} stroke="#b5834e" strokeWidth=".45" />
    <path d="M20 3.2c9.4 2 12.8 9.5 11.2 17.8-1.1 5.8-5 11.6-8 16.1h-2.1C26 25.6 27.3 10.8 20 3.2Z"
      fill={`url(#${id}-linen)`} stroke="#a4723c" strokeWidth=".45" />
    <path d="M20 3.2c-7.3 7.6-6 22.4-1.1 33.9h2.2C26 25.6 27.3 10.8 20 3.2Z"
      fill={`url(#${id}-honey)`} stroke="#b45309" strokeWidth=".45" />
    <path d="M18.2 7.1c-2 4.7-2.1 10.4-.9 15.6" fill="none" stroke="#fef08a" strokeWidth=".8" opacity=".8" />
    <path d="M15.5 36.2Q20 37.4 24.5 36.2l-1.1 3Q20 40.3 16.6 39.2Z" fill="#466944" stroke="#324c31" strokeWidth=".55" />
    <path d="M16.3 36.9q3.7.9 7.4 0" fill="none" stroke="#88ad84" strokeWidth=".55" />
    {/* Fine suspension cords and a shallow open basket, like the hive and shelf basket. */}
    <path d="m16.7 39.5 1 5m5.5-5-1 5" fill="none" stroke="#6e5030" strokeWidth=".7" />
    <path d="m17 39.6 1 4.6" fill="none" stroke="#e2c8a2" strokeWidth=".3" />
    <ellipse cx="20" cy="45.1" rx="5.7" ry="2" fill="#755232" stroke="#6e5030" strokeWidth=".55" />
    <path d="M14.3 45.1Q18.2 47.4 22.8 46.8l-.5 6.2q-3.6.8-6.9-1Z" fill="#c69a68" stroke="#6e5030" strokeWidth=".55" />
    <path d="M22.8 46.8q1.8-.5 2.9-1.7l-1 6.3-2.4 1.6Z" fill="#9a6e3e" stroke="#6e5030" strokeWidth=".55" />
    <path d="M14.5 45.4q3.5 1.9 8.1 1.3" fill="none" stroke="#e2c8a2" strokeWidth=".7" />
    <path d="M15 48.4q3.6 1.5 7.6.9m-7.1 1.4q3.1 1.2 6.9.6m-4.8-3.5.3 4.4m2.4-3.8-.1 4.3" fill="none" stroke="#a4723c" strokeWidth=".4" />
  </svg>;
}

export function WorldViewToolbar({ activeRoom, onSelectRoom }: {
  activeRoom: WorldViewId; onSelectRoom: (view: WorldViewId) => void;
}) {
  const [expanded, setExpanded] = useState(() => !window.matchMedia('(max-width: 639px)').matches);
  const [position, setPosition] = useState(initialPosition);
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const [panelSize, setPanelSize] = useState({ width: 192, height: 280 });
  const panelRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const gesture = useRef<{ id: number; x: number; y: number; origin: BalloonPosition; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const selected = activeRoom === 'friend_room' ? 'living_nook' : activeRoom;
  const currentLabel = [...primaryViews, ...otherViews].find(v => v.id === selected)?.label ?? (activeRoom === 'my_room' ? '工作区' : '前廊');
  useEffect(() => {
    const resize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      setPosition(previous => keepInScreen(previous));
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!expanded || !panel) return;
    const measure = () => {
      const { width, height } = panel.getBoundingClientRect();
      setPanelSize(previous => previous.width === width && previous.height === height ? previous : { width, height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [expanded]);
  const startDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (expanded || event.button !== 0 || gesture.current) return;
    suppressClick.current = false;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, origin: position, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = gesture.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    drag.moved = true;
    event.preventDefault();
    setPosition(keepInScreen({ x: drag.origin.x + dx, y: drag.origin.y + dy }));
  };
  const finishDrag = (event: ReactPointerEvent<HTMLButtonElement>, cancel = false) => {
    const drag = gesture.current;
    if (!drag || drag.id !== event.pointerId) return;
    gesture.current = null;
    suppressClick.current = drag.moved;
    if (drag.moved) {
      const next = cancel ? keepInScreen(drag.origin) : keepInScreen({ x: drag.origin.x + event.clientX - drag.x, y: drag.origin.y + event.clientY - drag.y });
      setPosition(next);
      if (!cancel) rememberPosition(next);
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const collapse = () => { setExpanded(false); toggleRef.current?.focus(); };
  const select = (view: WorldViewId) => {
    onSelectRoom(view);
    if (window.matchMedia('(max-width: 639px)').matches) collapse();
  };
  const renderView = ({ id, label, icon: Icon }: typeof primaryViews[number] | typeof otherViews[number]) => (
    <button key={id} id={`nav-room-${id}`} type="button" onClick={() => select(id)}
      aria-current={selected === id ? 'page' : undefined}
      className={`mt-1.5 flex min-h-11 w-full items-center gap-2 rounded-xl border px-2.5 text-left text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d68c68] ${
        selected === id ? 'border-[#423930] bg-[#282420] text-[#f0e8dc]' : 'border-[#302a24] bg-[#231f1c] text-[#cfc5b6] hover:border-[#4d4237] hover:text-[#f0e8dc]'
      }`}>
      <Icon className={`h-3.5 w-3.5 shrink-0 ${selected === id ? 'text-[#d68c68]' : 'text-[#8a7f72]'}`} aria-hidden="true" />
      <span className="flex-1">{label}</span>
      {selected === id && <span className="h-1.5 w-1.5 rounded-full bg-[#52b788]" aria-hidden="true" />}
    </button>
  );
  const left = expanded ? Math.max(12, Math.min(viewport.width - panelSize.width - 12, position.x + 26 - panelSize.width)) : position.x - 26;
  const top = expanded ? Math.max(12, Math.min(viewport.height - panelSize.height - 12, position.y - panelSize.height / 2)) : position.y - 32;
  return <nav ref={panelRef} aria-label="房间视角" style={{ left, top }}
    onKeyDown={event => { if (event.key === 'Escape' && expanded) { event.preventDefault(); collapse(); } }}
    className="fixed z-30 pointer-events-auto">
    <div className={expanded ? 'w-48 rounded-2xl border border-[#3b332b] bg-[#1e1c19]/85 p-3 shadow-overlay-panel backdrop-blur-md' : 'h-16 w-[52px]'}>
      <button ref={toggleRef} type="button" aria-expanded={expanded} aria-controls="world-view-options"
        aria-label={expanded ? '收起视角工具栏' : '展开视角工具栏'} title={expanded ? '收起视角工具栏' : `点击展开，拖动热气球移动位置 · ${currentLabel}`}
        onClick={event => { if (suppressClick.current && event.detail !== 0) { suppressClick.current = false; return; } setExpanded(value => !value); }}
        onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={event => finishDrag(event)}
        onPointerCancel={event => finishDrag(event, true)} onLostPointerCapture={event => finishDrag(event, true)}
        onKeyDown={event => {
          if (expanded || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
          event.preventDefault();
          const step = event.shiftKey ? 30 : 10;
          const next = keepInScreen({ x: position.x + (event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0), y: position.y + (event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0) });
          setPosition(next); rememberPosition(next);
        }}
        className={`flex w-full items-center justify-center gap-1.5 text-[#e3ded4] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-[#d68c68] ${expanded ? 'min-h-11 border-b border-[#302a24] px-1 pb-1 sm:min-h-7' : 'h-16 cursor-grab select-none touch-none active:cursor-grabbing'}`}>
        {expanded ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#52b788]" aria-hidden="true" /> : <HotAirBalloon />}
        {expanded && <><span className="flex-1 text-left text-[11px] font-medium">小屋视角</span><ChevronRight className="h-3.5 w-3.5 text-[#8a7f72]" aria-hidden="true" /></>}
      </button>
      <div id="world-view-options" hidden={!expanded} className="max-h-[calc(100dvh-14rem)] overflow-y-auto pt-1">
        {primaryViews.map(renderView)}
        <details className="mt-2.5">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-lg border border-[#302a24] bg-[#231f1c] px-2.5 text-[11px] text-[#cfc5b6] hover:border-[#4d4237] hover:text-[#f0e8dc] focus-visible:outline-2 focus-visible:outline-[#d68c68] [&::-webkit-details-marker]:hidden">
            更多去处<ChevronDown className="h-3 w-3 text-[#8a7f72]" aria-hidden="true" />
          </summary>
          {otherViews.map(renderView)}
        </details>
      </div>
    </div>
  </nav>;
}
