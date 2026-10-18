import { chairPoint, chairSeatPath } from './chairGeometry';
import { deskHandTargets } from './DeskSeatedCharacter';
import { sofaDeskHandTargets } from './SofaDeskCharacter';
import { WINDSOR_SEATED_POSE } from './windsorSeatedPose';
import { NW_CHAIR_SEATED } from '../characters/nwChairSeatedGeometry';
import { deskSurfacePaths, type DeskSurfaceStudy } from './deskStudyModel';

const ink = '#b4e1dc';
export function DeskSurfaceGuide({ surface }: { surface: DeskSurfaceStudy }) {
  return <g data-calibration-guides="surface" pointerEvents="none" fill="none" stroke={ink} strokeWidth=".6">
    <path d={deskSurfacePaths(surface).top} strokeDasharray="2 1.5" />
    <path d={`M${-53 * surface.width},28 L${21 * surface.width},7 L${53 * surface.width},16 L${-21 * surface.width},37 Z`} stroke="#dfbb83" strokeDasharray="2 2" />
    <text x={-51 * surface.width} y="42" stroke="none" fill="#dfbb83" fontSize="4">地面 / 桌脚</text>
  </g>;
}
export function ChairContactGuide({ keyboard, working, resting = false, classicNw = false, sofa = false }: {
  keyboard: { x: number; y: number }; working: boolean; resting?: boolean; classicNw?: boolean; sofa?: boolean;
}) {
  const pose = classicNw ? NW_CHAIR_SEATED : WINDSOR_SEATED_POSE;
  const targets = sofa ? sofaDeskHandTargets(keyboard, working) : resting ? { shoulders: pose.shoulders, hands: pose.hands, mode: 'lap' }
    : deskHandTargets(keyboard, working);
  const seat = chairPoint(0, 0, 14.2);
  return <g data-calibration-guides="chair" pointerEvents="none" fontSize="3.8">
    <path d={chairSeatPath(14.2)} fill="none" stroke={ink} strokeWidth=".6" strokeDasharray="2 1" />
    <circle cx={seat.x} cy={seat.y} r="1.3" fill={ink} />
    <path d="M-13,20 H13" stroke="#dfbb83" strokeWidth=".6" />
    <text x="10" y={seat.y + 1} fill={ink}>坐面</text>
    <rect x={keyboard.x - 8} y={keyboard.y - 5} width="14" height="5" fill="none" stroke="#ebc77f" strokeWidth=".7" />
    {targets.shoulders.map((shoulder, i) => <line key={i} x1={shoulder.x} y1={shoulder.y} x2={targets.hands[i].x} y2={targets.hands[i].y}
      stroke={targets.mode === 'keyboard' || targets.mode === 'desk' ? ink : '#ebaa8e'} strokeWidth=".55" strokeDasharray="1 1" />)}
    <text x={keyboard.x + 8} y={keyboard.y - 2} fill="#ebc77f">键盘</text>
  </g>;
}
