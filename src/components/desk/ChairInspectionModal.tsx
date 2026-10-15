import { X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { INITIAL_PEOPLE } from '../../data/initialData';
import { useDialogFocus } from '../../shared/hooks/useDialogFocus';
import { SvgDetailView } from '../inspection/SvgDetailView';
import { DEFAULT_ROOM_LAYOUT, type RoomLayoutConfig } from '../layout-gizmo/layoutStore';
import { AtticDesk } from './AtticDesk';
import { DESK_SEATS, deskKeyboardInChairSpace, type DeskSeatId } from './chairGeometry';
import { DeskWorkstations, type DeskOccupants } from './DeskWorkstations';
import { WindsorChair } from './WindsorChair';

export interface ChairInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  occupants: DeskOccupants;
  selectedSeat: DeskSeatId;
  onSelectSeat: (seat: DeskSeatId) => void;
  layout?: RoomLayoutConfig;
}

export const ChairInspectionModal: React.FC<ChairInspectionModalProps> = ({
  isOpen, onClose, occupants, selectedSeat, onSelectSeat, layout = DEFAULT_ROOM_LAYOUT,
}) => {
  const panel = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'both' | 'desk' | 'sample'>('both');
  const [showPeople, setShowPeople] = useState(true);
  useDialogFocus(isOpen, panel, onClose);
  if (!isOpen) return null;
  const seat = DESK_SEATS.find(item => item.slot === selectedSeat)!;
  const currentPerson = occupants[selectedSeat];
  const person = currentPerson ?? { ...INITIAL_PEOPLE[0], currentState: 'coding' as const };
  const sampleOccupants: DeskOccupants = {
    desk_workstation: occupants.desk_workstation ?? { ...INITIAL_PEOPLE[0], currentState: 'coding' },
    desk_workstation_secondary: occupants.desk_workstation_secondary ?? { ...INITIAL_PEOPLE[1], currentState: 'coding' },
  };
  const hasOccupants = Object.values(occupants).some(Boolean);
  const visibleOccupants = showPeople ? occupants : { desk_workstation: null, desk_workstation_secondary: null };
  const keyboard = deskKeyboardInChairSpace(layout, selectedSeat);
  const button = (selected: boolean) => `px-3 py-2 rounded-lg text-sm transition-colors ${selected
    ? 'bg-[#93603d] text-[#fff5e9]' : 'text-[#d5c2ad] hover:bg-[#3b2b21]'}`;
  const comparisonBounds = { x: -19, y: -32, width: 40, height: 58 };
  const shadow = <defs><filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
    <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.18" /></filter></defs>;

  return <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70" onClick={onClose}>
    <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="chair-modal-title" tabIndex={-1}
      className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl bg-[#241b16] text-[#eee2d3] shadow-xl"
      onClick={event => event.stopPropagation()}>
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[#513b2b]">
        <div><h2 id="chair-modal-title" className="font-semibold text-lg">工位椅与桌前坐姿</h2>
          <p className="mt-1 text-sm text-[#d1bca5]">对照两种椅子与长袍坐姿，查看当前工位或双人样例。</p></div>
        <button type="button" aria-label="关闭工位椅查看" onClick={onClose} className="p-2 rounded-lg hover:bg-[#493123]"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex flex-wrap gap-1 px-5 pt-3" role="group" aria-label="工位查看方式">
        <button type="button" className={button(mode === 'both')} aria-pressed={mode === 'both'} onClick={() => setMode('both')}>空椅与坐姿对比</button>
        <button type="button" className={button(mode === 'desk')} aria-pressed={mode === 'desk'} onClick={() => setMode('desk')}>查看桌椅关系</button>
        <button type="button" className={button(mode === 'sample')} aria-pressed={mode === 'sample'} onClick={() => setMode('sample')}>双人姿态样例</button>
      </div>
      <div className="flex flex-wrap gap-1 px-5 py-3" role="group" aria-label={mode === 'both' ? '对比工位' : '预览显示'}>
        {mode === 'both' ? DESK_SEATS.map(item => <button type="button" key={item.slot}
          className={button(item.slot === selectedSeat)} aria-pressed={item.slot === selectedSeat}
          onClick={() => onSelectSeat(item.slot)}>{item.label}</button>) : mode === 'desk' && <>
          <button type="button" className={button(!showPeople || !hasOccupants)} aria-pressed={!showPeople || !hasOccupants}
            onClick={() => setShowPeople(false)}>只看空椅</button>
          <button type="button" className={`${button(showPeople && hasOccupants)} disabled:opacity-40 disabled:cursor-not-allowed`}
            disabled={!hasOccupants} aria-pressed={showPeople && hasOccupants} onClick={() => setShowPeople(true)}>显示就坐人物</button>
        </>}
      </div>
      <div className="px-5 pb-5">
        {mode === 'both' ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SvgDetailView label="空椅" initialBounds={comparisonBounds} autoFit={false} resetKey={`chair-empty-${selectedSeat}`}>
            {shadow}<WindsorChair interactive={false} variant={seat.variant} chairId={seat.chair} />
          </SvgDetailView>
          <SvgDetailView label="桌前坐姿" initialBounds={comparisonBounds} autoFit={false} resetKey={`chair-seated-${selectedSeat}`}>
            {shadow}<WindsorChair interactive={false} variant={seat.variant} chairId={seat.chair}
              isSeated occupant={person} keyboardAnchor={keyboard} />
          </SvgDetailView>
        </div> : <SvgDetailView label={mode === 'sample' ? '双人姿态样例' : '当前桌椅关系'}
          initialBounds={{ x: -60, y: -35, width: 125, height: 85 }} resetKey={`desk-chair-${mode}`}>
          {shadow}<g pointerEvents="none">
            <AtticDesk layout={layout} />
            <DeskWorkstations layout={layout} relativeToDesk occupants={mode === 'sample' ? sampleOccupants : visibleOccupants} />
          </g>
        </SvgDetailView>}
        <p className="mt-4 text-sm leading-relaxed text-[#d1bca5]">
          {mode === 'sample' ? '双人姿态示意，复用当前桌椅摆放；不会改变同住人的位置或席位。' : mode === 'both'
            ? `${seat.label}：坐垫承托髋部，长袍遮住腿脚。${currentPerson ? `使用${currentPerson.name}的当前装扮。` : '当前工位无人，右侧坐姿仅供参考。'}`
            : `${hasOccupants ? '当前桌椅关系使用实际在座人物与装扮。' : '当前工位无人，两张椅子空置。'}预览显示切换不改变实际席位。`}
        </p>
      </div>
    </div>
  </div>;
};
