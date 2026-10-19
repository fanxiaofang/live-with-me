import { useRef, useState, type PointerEvent } from 'react';
import { INITIAL_PEOPLE } from '../../data/initialData';
import { SvgDetailView } from '../inspection/SvgDetailView';
import type { EditableObjectId, RoomLayoutConfig } from '../layout-gizmo/layoutStore';
import { AtticDesk } from './AtticDesk';
import { DESK_SEATS, deskKeyboardInChairSpace, type DeskSeatId } from './chairGeometry';
import { sofaDeskHandTargets } from './SofaDeskCharacter';
import { DeskWorkstations, type DeskOccupants } from './DeskWorkstations';
import { DeskStudyContext } from './DeskStudyContext';
import { createDeskStudy, deskStudyRise, type DeskStudyDraft } from './deskStudyModel';

export interface DeskCalibrationProps {
  draft: DeskStudyDraft | null;
  layout: RoomLayoutConfig;
  occupants: DeskOccupants;
  selectedSeat: DeskSeatId;
  onSelectSeat: (seat: DeskSeatId) => void;
  onChange: (draft: DeskStudyDraft) => void;
  onPreviewRoom: (draft: DeskStudyDraft, guides: boolean) => void;
  history: DeskStudyDraft[];
  onHistoryChange: (history: DeskStudyDraft[]) => void;
}
const control = 'rounded-md border border-[#70523b] bg-[#30231b] px-2 py-1.5 text-sm text-[#f2e4d2] focus-visible:outline-2 focus-visible:outline-[#e7b76c]';
const action = `${control} hover:bg-[#493123] disabled:opacity-40 disabled:cursor-not-allowed`;
const download = (name: string, content: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** An isolated draft: no persistent storage, occupancy assignment or editor runtime. */
export function DeskCalibrationWorkbench({ draft: savedDraft, layout, occupants, selectedSeat, onSelectSeat, onChange, onPreviewRoom, history, onHistoryChange }: DeskCalibrationProps) {
  const draft = savedDraft ?? createDeskStudy(layout);
  const [compare, setCompare] = useState(false);
  const [guides, setGuides] = useState(true);
  const [view, setView] = useState<'assembly' | 'desk'>('assembly');
  const [people, setPeople] = useState(true);
  const canvas = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: EditableObjectId; start: DOMPoint; draft: DeskStudyDraft } | null>(null);
  const seat = DESK_SEATS.find(s => s.slot === selectedSeat)!;
  const shown = compare ? createDeskStudy(layout) : draft;
  const rise = deskStudyRise(shown.surface);
  const origin = shown.layout['desk-group'].screen;
  const keyboard = deskKeyboardInChairSpace(shown.layout, selectedSeat, rise);
  const target = sofaDeskHandTargets(keyboard, true);
  const reference = occupants[selectedSeat] ?? { ...INITIAL_PEOPLE[0], currentState: 'coding' as const };
  const previewOccupants = { ...occupants, [selectedSeat]: reference };
  const empty: DeskOccupants = { desk_workstation: null, desk_workstation_secondary: null };
  const change = (next: DeskStudyDraft) => {
    onHistoryChange([...history.slice(-39), structuredClone(draft)]);
    onChange(next);
  };
  const surface = (key: 'height' | 'thickness' | 'width', value: number) => change({ ...draft, surface: { ...draft.surface, [key]: value } });
  const move = (id: EditableObjectId, axis: 'x' | 'y', value: number) => {
    const next = structuredClone(draft); next.layout[id].screen[axis] = value; change(next);
  };
  const local = (event: PointerEvent<SVGCircleElement>) => {
    const matrix = event.currentTarget.ownerSVGElement?.getScreenCTM();
    return matrix ? new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse()) : new DOMPoint();
  };
  const anchor = (id: EditableObjectId, x: number, y: number, label: string) => <circle
    key={id} data-calibration-anchor={id} role="img" aria-label={label} cx={x} cy={y} r="2.1"
    fill={id === seat.chair ? '#b4e1dc' : '#ebc77f'} stroke="#231c16" strokeWidth=".7" className="cursor-move"
    onPointerDown={event => {
      event.preventDefault(); event.stopPropagation();
      onHistoryChange([...history.slice(-39), structuredClone(draft)]);
      drag.current = { id, start: local(event), draft: structuredClone(draft) };
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={event => {
      if (!drag.current) return;
      event.stopPropagation(); const at = local(event), start = drag.current;
      const next = structuredClone(start.draft);
      next.layout[start.id].screen = {
        x: Number((start.draft.layout[start.id].screen.x + at.x - start.start.x).toFixed(2)),
        y: Number((start.draft.layout[start.id].screen.y + at.y - start.start.y).toFixed(2)),
      };
      onChange(next);
    }}
    onPointerUp={event => { event.stopPropagation(); drag.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
    onPointerCancel={event => { event.stopPropagation(); if (drag.current) onChange(drag.current.draft); drag.current = null; }}
  ><title>{label}，也可用下方坐标输入调节</title></circle>;
  const exportParameters = () => download('desk-study.json', JSON.stringify({
    schema: 'live-with-me/desk-study/v1', status: 'draft-not-approved', units: 'scene-units', surface: draft.surface,
    layout: Object.fromEntries(['desk-group', 'desk-lamp', 'desk-cup', 'desk-cup-secondary', ...DESK_SEATS.flatMap(s => [s.chair, s.laptop])].map(id => [id, draft.layout[id as EditableObjectId]])),
    fixedSeatHeight: 14.2, note: '仅制作草稿，不自动导入保存布局；新轮廓和双席容量均待评审。',
  }, null, 2), 'application/json');
  const exportSvg = () => {
    const source = canvas.current?.querySelector('svg'); if (!source) return;
    const clone = source.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', '1000'); clone.setAttribute('height', '700');
    clone.setAttribute('data-draft-status', 'not-approved');
    clone.querySelectorAll('[data-calibration-guides], [data-calibration-anchor]').forEach(n => n.remove());
    download('desk-study.svg', new XMLSerializer().serializeToString(clone), 'image/svg+xml');
  };
  return <section aria-label="桌椅接触校准工具" data-desk-calibration className="space-y-4">
    <p className="text-sm leading-relaxed text-[#d1bca5]">制作草稿：先核对接触，再试一张浅凹前沿、右端略宽的桌面。可拖动彩色锚点，也可输入坐标；关闭或结束试放即恢复，正式布局不变。</p>
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className={action} aria-pressed={view === 'desk'} onClick={() => setView(v => v === 'desk' ? 'assembly' : 'desk')}>{view === 'desk' ? '切到桌椅组合' : '只看桌子'}</button>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={guides} onChange={e => setGuides(e.target.checked)} />显示接触点</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={people} onChange={e => setPeople(e.target.checked)} />显示参考人物</label>
      <button type="button" className={action} aria-pressed={compare} onClick={() => setCompare(v => !v)}>{compare ? '返回草稿' : '对照原稿'}</button>
    </div>
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
      <div ref={canvas} className="min-w-0">
        <DeskStudyContext.Provider value={compare ? null : { surface: shown.surface, guides }}>
          <SvgDetailView label={compare ? '原稿对照' : '校准草稿'} autoFit={false} initialBounds={{ x: -68, y: -39, width: 140, height: 100 }}>
            <g pointerEvents="none"><AtticDesk layout={shown.layout} />
              {view === 'assembly' && <DeskWorkstations layout={shown.layout} relativeToDesk occupants={people ? previewOccupants : empty} />}
            </g>
            {!compare && guides && <g data-calibration-guides="handles">
              {view === 'assembly' && anchor(seat.chair, shown.layout[seat.chair].screen.x - origin.x, shown.layout[seat.chair].screen.y - origin.y + 5.8, '拖动椅子坐面')}
              {anchor(seat.laptop, shown.layout[seat.laptop].screen.x, shown.layout[seat.laptop].screen.y - rise, '拖动键盘位置')}
            </g>}
          </SvgDetailView>
        </DeskStudyContext.Provider>
        <p role="status" className={`mt-2 text-sm ${target.mode === 'desk' ? 'text-[#b4e1dc]' : 'text-[#ebaa8e]'}`}>
          {target.mode === 'desk' ? '近手放在桌面，远手靠近键盘。' : '桌前目标超出双臂可达范围，人物将收手到扶手上。'} 坐高固定 14.2，桌面与坐面相差 {(shown.surface.height - 14.2).toFixed(1)}。
        </p>
        {shown.surface.height - shown.surface.thickness - 14.2 < 5.5 && <p role="status" className="mt-1 text-sm text-[#ebaa8e]">桌板下沿到坐面仅 {(shown.surface.height - shown.surface.thickness - 14.2).toFixed(1)}，需检查膝部空间；当前草稿不作接触验收。</p>}
        <p className="mt-1 text-xs leading-relaxed text-[#d1bca5]">青色为坐面与接触线，金色为键盘和桌脚。{occupants[selectedSeat] ? `参考${reference.name}的当前装扮。` : '此席无人，人物仅为姿态参照。'} 本试点不确认单桌双席的空间容量。</p>
      </div>
      <fieldset disabled={compare} className="min-w-0 space-y-3 disabled:opacity-50">
        <legend className="mb-2 text-sm font-semibold">桌面与接触参数</legend>
        <label className="block text-sm">桌面轮廓<select aria-label="桌面轮廓" className={`${control} mt-1 w-full`} value={draft.surface.outline}
          onChange={e => change({ ...draft, surface: { ...draft.surface, outline: e.target.value as 'straight' | 'cove' } })}>
          <option value="straight">原桌尺寸参照</option><option value="cove">异形靠窗桌 · 未定稿</option>
        </select></label>
        {([['height', '桌面高度', 20, 27, .2], ['thickness', '桌板厚度', 1.2, 3.6, .2], ['width', '桌面宽度比例', .85, 1.15, .01]] as const).map(([key, label, min, max, step]) => <label key={key} className="block text-sm">
          <span className="flex justify-between"><span>{label}</span><output>{draft.surface[key].toFixed(key === 'width' ? 2 : 1)}</output></span>
          <input aria-label={label} className="mt-1 w-full accent-[#c29366]" type="range" min={min} max={max} step={step} value={draft.surface[key]} onChange={e => surface(key, Number(e.target.value))} />
        </label>)}
        <label className="block text-sm">校准工位<select aria-label="校准工位" value={selectedSeat} className={`${control} mt-1 w-full`} onChange={e => onSelectSeat(e.target.value as DeskSeatId)}>
          {DESK_SEATS.map(s => <option key={s.slot} value={s.slot}>{s.label}</option>)}
        </select></label>
        {([[seat.chair, '椅子'], [seat.laptop, '键盘']] as const).map(([id, label]) => <div key={id} className="grid grid-cols-2 gap-2">
          {(['x', 'y'] as const).map(axis => <label key={axis} className="text-xs">{label} {axis.toUpperCase()}<input aria-label={`${label} ${axis.toUpperCase()}`} type="number" step=".5" value={draft.layout[id].screen[axis]}
            className={`${control} mt-1 w-full min-w-0`} onChange={e => { if (e.target.value !== '' && Number.isFinite(e.target.valueAsNumber)) move(id, axis, e.target.valueAsNumber); }} /></label>)}
        </div>)}
      </fieldset>
    </div>
    <div className="flex flex-wrap gap-2 border-t border-[#513b2b] pt-3">
      <button type="button" className={action} disabled={history.length === 0 || compare} onClick={() => { const previous = history.at(-1); if (previous) { onChange(previous); onHistoryChange(history.slice(0, -1)); } }}>撤销一步</button>
      <button type="button" className={action} disabled={compare} onClick={() => change(createDeskStudy(layout))}>恢复初始草稿</button>
      <button type="button" className={action} disabled={compare} onClick={exportParameters}>导出参数</button>
      <button type="button" className={action} disabled={compare} onClick={exportSvg}>导出当前 SVG</button>
      <button type="button" className={`${action} bg-[#705039]`} disabled={compare} onClick={() => onPreviewRoom(draft, guides)}>放回房间试看</button>
    </div>
    <p className="text-xs text-[#d1bca5]">参数均为场景单位。桌高会同步带动桌上物件和手部目标；桌面缩窄不会自动挪动电脑和杯子，需在试放时检查承托、桌沿与腿部空间。导出用于制作记录，不会自动应用。</p>
  </section>;
}
