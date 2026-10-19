import { X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { INITIAL_PEOPLE } from '../../data/initialData';
import { useDialogFocus } from '../../shared/hooks/useDialogFocus';
import { SvgDetailView } from '../inspection/SvgDetailView';
import { DEFAULT_ROOM_LAYOUT, type RoomLayoutConfig } from '../layout-gizmo/layoutStore';
import { AtticDesk } from './AtticDesk';
import { DESK_SEATS, deskKeyboardInChairSpace, type DeskSeatId } from './chairGeometry';
import { DeskWorkstations, type DeskOccupants } from './DeskWorkstations';
import { WindsorChair } from './WindsorChair';
import { DeskCalibrationWorkbench } from './DeskCalibrationWorkbench';
import type { DeskStudyDraft } from './deskStudyModel';
import { WindsorSeatedCharacter, WindsorPoseGuides, usesNwChairStudy } from './WindsorSeatedCharacter';
import { CHARACTER_PREVIEW_PALETTE } from '../characters/characterPreviewPalette';
import { SofaWorkChair, SOFA_CHAIR_NAMES } from './SofaWorkChair';

export interface ChairInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  occupants: DeskOccupants;
  selectedSeat: DeskSeatId;
  onSelectSeat: (seat: DeskSeatId) => void;
  layout?: RoomLayoutConfig;
  studyDraft?: DeskStudyDraft | null;
  onStudyChange: (draft: DeskStudyDraft) => void;
  onStudyPreview: (draft: DeskStudyDraft, guides: boolean) => void;
  startInStudy?: boolean;
  onViewWindsorRoom: () => void;
}

export const ChairInspectionModal: React.FC<ChairInspectionModalProps> = ({
  isOpen, onClose, occupants, selectedSeat, onSelectSeat, layout = DEFAULT_ROOM_LAYOUT,
  studyDraft = null, onStudyChange, onStudyPreview, startInStudy = false, onViewWindsorRoom,
}) => {
  const panel = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'sofa' | 'both' | 'desk' | 'sample' | 'calibrate' | 'windsor'>(startInStudy ? 'calibrate' : 'sofa');
  const [showPeople, setShowPeople] = useState(true);
  const [showPoseGuides, setShowPoseGuides] = useState(false);
  const [studyHistory, setStudyHistory] = useState<DeskStudyDraft[]>([]);
  useEffect(() => {
    if (!isOpen && !studyDraft) setStudyHistory([]);
  }, [isOpen, studyDraft]);
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
  const sofaVariant = selectedSeat === 'desk_workstation' ? 'club' : 'recliner';
  const windsorPerson = sampleOccupants.desk_workstation!;
  const windsorKeyboard = deskKeyboardInChairSpace(layout, 'desk_workstation');
  const button = (selected: boolean) => `px-3 py-2 rounded-lg text-sm transition-colors ${selected
    ? 'bg-[#93603d] text-[#fff5e9]' : 'text-[#d5c2ad] hover:bg-[#3b2b21]'}`;
  const comparisonBounds = { x: -19, y: -32, width: 40, height: 58 };

  return <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70" onClick={onClose}>
    <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="chair-modal-title" tabIndex={-1}
      className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl bg-[#241b16] text-[#eee2d3] shadow-xl"
      onClick={event => event.stopPropagation()}>
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[#513b2b]">
        <div><h2 id="chair-modal-title" className="font-semibold text-lg">工位椅与桌前坐姿</h2>
          <p className="mt-1 text-sm text-[#d1bca5]">两款沙发椅测试：复用 NW 站姿上身，由实体靠背与扶手遮住腰腿。</p></div>
        <button type="button" aria-label="关闭工位椅查看" onClick={onClose} className="p-2 rounded-lg hover:bg-[#493123]"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex flex-wrap gap-1 px-5 pt-3" role="group" aria-label="工位查看方式">
        <button type="button" className={button(mode === 'sofa')} aria-pressed={mode === 'sofa'} onClick={() => setMode('sofa')}>沙发椅测试</button>
        <button type="button" className={button(mode === 'both')} aria-pressed={mode === 'both'} onClick={() => setMode('both')}>原椅保留对比</button>
        <button type="button" className={button(mode === 'windsor')} aria-pressed={mode === 'windsor'} onClick={() => setMode('windsor')}>温莎椅单人姿态</button>
        <button type="button" className={button(mode === 'desk')} aria-pressed={mode === 'desk'} onClick={() => setMode('desk')}>查看桌椅关系</button>
        <button type="button" className={button(mode === 'sample')} aria-pressed={mode === 'sample'} onClick={() => setMode('sample')}>双人姿态样例</button>
        <button type="button" className={button(mode === 'calibrate')} aria-pressed={mode === 'calibrate'} onClick={() => setMode('calibrate')}>接触校准 · 草稿</button>
      </div>
      <div className="flex flex-wrap gap-1 px-5 py-3" role="group" aria-label={mode === 'both' || mode === 'sofa' ? '对比工位' : '预览显示'}>
        {mode === 'both' || mode === 'sofa' ? DESK_SEATS.map(item => <button type="button" key={item.slot}
          className={button(item.slot === selectedSeat)} aria-pressed={item.slot === selectedSeat}
          onClick={() => onSelectSeat(item.slot)}>{mode === 'sofa' ? item.slot === 'desk_workstation' ? 'A · 方扶手沙发椅' : 'B · 高背电竞沙发椅' : item.label}</button>) : mode === 'desk' && <>
          <button type="button" className={button(!showPeople || !hasOccupants)} aria-pressed={!showPeople || !hasOccupants}
            onClick={() => setShowPeople(false)}>只看空椅</button>
          <button type="button" className={`${button(showPeople && hasOccupants)} disabled:opacity-40 disabled:cursor-not-allowed`}
            disabled={!hasOccupants} aria-pressed={showPeople && hasOccupants} onClick={() => setShowPeople(true)}>显示就坐人物</button>
        </>}
      </div>
      <div className="px-5 pb-5">
        {mode === 'sofa' ? <section aria-label="沙发椅 NW 遮挡测试">
          <p className="mb-3 text-sm leading-relaxed text-[#d1bca5]">{SOFA_CHAIR_NAMES[sofaVariant]} · {sofaVariant === 'club'
            ? '参考第 1 张的低靠背、方扶手和包裹侧板，保留更多肩背。'
            : '参考第 3 张的厚扶手、高靠背和软包底座，测试更大范围的遮挡。'}当前为待审阅试样。</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SvgDetailView label="沙发空椅" initialBounds={comparisonBounds} autoFit={false} resetKey={`sofa-empty-${selectedSeat}`} surfaceColor={CHARACTER_PREVIEW_PALETTE.background}>
              <SofaWorkChair interactive={false} variant={sofaVariant} chairId={seat.chair} />
            </SvgDetailView>
            <SvgDetailView label="NW 上身入椅" initialBounds={comparisonBounds} autoFit={false} resetKey={`sofa-person-${selectedSeat}`} surfaceColor={CHARACTER_PREVIEW_PALETTE.background}>
              <SofaWorkChair interactive={false} variant={sofaVariant} chairId={seat.chair} isSeated occupant={person} keyboardAnchor={keyboard} />
            </SvgDetailView>
          </div>
          <p className="mt-3 text-sm text-[#d1bca5]">{currentPerson ? `使用${currentPerson.name}的当前装扮。` : '当前工位无人，右侧使用参考人物。'}头身沿用定稿 NW 站姿，重新绘制前伸袖臂；近手放桌面，远手靠近键盘，休息时放回扶手。</p>
          <a className="mt-3 inline-block text-sm text-[#e7bb86] underline underline-offset-4" href="/sofa-chair-nw-review.html" target="_blank" rel="noreferrer">打开两款并排对照与 SVG 下载</a>
        </section> : mode === 'windsor' ? <section aria-label="温莎椅单人姿态审阅">
          <p className="mb-3 text-sm leading-relaxed text-[#d1bca5]">{usesNwChairStudy(windsorPerson)
            ? `${windsorPerson.name} · 按新参考重绘的 NW 坐姿：保留原头部与原椅，审阅背部、臀部、大腿和垂袍的连续关系。圆手放腿上，本稿待审阅。`
            : `${windsorPerson.name} · 当前发型仍显示未通过的旧坐姿。本批只制作经典短发 NW 垂腿稿。`}</p>
          <label className="mb-4 flex items-center gap-2 text-sm text-[#d1bca5]">
            <input type="checkbox" checked={showPoseGuides} onChange={e => setShowPoseGuides(e.target.checked)} />查看坐姿结构
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SvgDetailView label="身体无遮挡" initialBounds={{ x: -24, y: -33, width: 45, height: 59 }} autoFit={false} surfaceColor={CHARACTER_PREVIEW_PALETTE.background}>
              <WindsorSeatedCharacter occupant={windsorPerson} keyboardAnchor={windsorKeyboard} showSeatContact={false} />
              {showPoseGuides && <WindsorPoseGuides classic={usesNwChairStudy(windsorPerson)} />}
            </SvgDetailView>
            <SvgDetailView label="坐入温莎椅" initialBounds={{ x: -24, y: -33, width: 45, height: 59 }} autoFit={false} surfaceColor={CHARACTER_PREVIEW_PALETTE.background}>
              <WindsorChair interactive={false} isSeated occupant={windsorPerson} keyboardAnchor={windsorKeyboard} />
              {showPoseGuides && <WindsorPoseGuides classic={usesNwChairStudy(windsorPerson)} />}
            </SvgDetailView>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a href="/character-shorthair-seated-nw-study.svg" download className="text-sm text-[#e7bb86] underline underline-offset-4">下载独立 NW 坐姿 SVG</a>
            <button type="button" className={button(true)} onClick={onViewWindsorRoom}>查看实际房间</button>
            <p className="text-sm text-[#d1bca5]">{occupants.desk_workstation
              ? '关闭查看窗口，回到同一人物的真实工位。' : '当前工位无人，上方使用参考人物；实际房间保持空椅。'}</p>
          </div>
        </section> : mode === 'calibrate' ? <DeskCalibrationWorkbench draft={studyDraft} layout={layout} occupants={occupants}
          selectedSeat={selectedSeat} onSelectSeat={onSelectSeat} onChange={onStudyChange} onPreviewRoom={onStudyPreview}
          history={studyHistory} onHistoryChange={setStudyHistory} /> : mode === 'both' ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SvgDetailView label="空椅" initialBounds={comparisonBounds} autoFit={false} resetKey={`chair-empty-${selectedSeat}`}>
            <WindsorChair interactive={false} variant={seat.variant} chairId={seat.chair} />
          </SvgDetailView>
          <SvgDetailView label="桌前坐姿" initialBounds={comparisonBounds} autoFit={false} resetKey={`chair-seated-${selectedSeat}`}>
            <WindsorChair interactive={false} variant={seat.variant} chairId={seat.chair}
              isSeated occupant={person} keyboardAnchor={keyboard} />
          </SvgDetailView>
        </div> : <SvgDetailView label={mode === 'sample' ? '双人姿态样例' : '当前桌椅关系'}
          initialBounds={{ x: -60, y: -35, width: 125, height: 85 }} resetKey={`desk-chair-${mode}`}>
          <g pointerEvents="none">
            <AtticDesk layout={layout} />
            <DeskWorkstations layout={layout} relativeToDesk occupants={mode === 'sample' ? sampleOccupants : visibleOccupants} />
          </g>
        </SvgDetailView>}
        {mode !== 'calibrate' && mode !== 'windsor' && mode !== 'sofa' && <p className="mt-4 text-sm leading-relaxed text-[#d1bca5]">
          {mode === 'sample' ? '双人姿态示意，复用当前桌椅摆放；不会改变同住人的位置或席位。' : mode === 'both'
            ? `${seat.label}：坐垫承托髋部，长袍遮住腿脚。${currentPerson ? `使用${currentPerson.name}的当前装扮。` : '当前工位无人，右侧坐姿仅供参考。'}`
            : `${hasOccupants ? '当前桌椅关系使用实际在座人物与装扮。' : '当前工位无人，两张椅子空置。'}预览显示切换不改变实际席位。`}
        </p>}
      </div>
    </div>
  </div>;
};
