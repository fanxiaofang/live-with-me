import type { SceneLayout } from '../../../src/world/scene/sceneTypes';
import { YORKSHIRE_LAYOUT } from '../../../src/components/scenery/yorkshire/landscapeLayout';

// Each passage is authored as one little drift of marks. Some nearly vanish;
// their varied spacing and direction avoid the cadence of a repeated pattern.
const HOUSE_VEIL = [
  'M-212 272q2 -1 4 -1 M-204 276l2 -.5 M-187 269q2 0 3 -1',
  'M-177 288l3 -1 M-170 291q2 -1 3 -1 M-155 286l2 -.5 M-149 282l2 -1',
  'M-137 301q2 0 3 -1 M-127 298l2 -.5 M-116 304l3 -1 M-107 294l2 -1',
  'M-238 314l2 -1 M-229 317q2 0 4 -1 M-210 310l2 -.5',
  'M-202 340q2 -1 4 -1 M-191 343l2 -.5 M-176 335q2 0 3 -1',
  'M-160 331l2 -1 M-146 338q2 0 3 -1 M-134 344l2 -.5 M-121 337l2 -1',
  'M-102 352l2 -1 M-90 349q2 0 4 -1 M-79 357l2 -.5',
  'M-229 368l2 -1 M-218 374q2 0 3 -1 M-203 366l2 -.5',
  'M-183 386q3 0 5 -1 M-166 379l2 -1 M-152 391l3 -.5 M-138 381l2 -1',
  'M-108 393l2 -.5 M-94 390q2 0 4 -1 M-77 397l2 -1',
  'M-43 374l2 -.5 M-31 380q2 0 4 -1',
  'M16 398l2 -.5 M31 404q2 0 4 -1 M43 394l2 -.5',
  'M62 378q2 0 4 -1 M75 384l2 -.5 M87 375l2 -1',
  'M85 294q2 0 4 -1 M99 301l2 -.5 M111 296q2 -1 3 -1',
  'M121 316l2 -.5 M132 312q2 0 4 -1 M148 323l2 -1',
  'M117 349q2 0 4 -1 M134 355l2 -.5 M151 346l2 -1 M160 356l2 -.5',
  'M181 365l2 -.5 M193 360q2 0 4 -1 M209 370l2 -1',
  'M202 279q2 0 4 -1 M218 286l2 -.5 M229 276l2 -1',
  'M251 294q2 0 4 -1 M266 289l2 -.5 M276 298l2 -1',
  'M294 262l2 -1 M308 270q2 0 4 -1 M320 261l2 -.5',
  'M333 280l2 -1 M347 276q2 0 4 -1 M358 285l2 -.5',
  'M244 332l2 -1 M256 327q2 0 4 -1 M271 337l2 -.5',
];
const CABIN_VEIL = [
  'M-99 153l2 -1 M-86 158q2 0 4 -1 M-72 152l2 -.5',
  'M-66 178q2 0 4 -1 M-51 173l2 -.5 M-42 184l2 -1',
  'M28 159l2 -.5 M40 163q2 0 4 -1 M55 157l2 -1',
  'M63 130q2 0 3 -1 M77 134l2 -.5 M89 128l2 -1',
  'M103 145q2 0 4 -1 M118 139l2 -.5 M131 149l2 -1',
];
const TREE_VEIL = [
  'M-139 76q2 0 4 -1 M-125 80l2 -.5 M-111 73l2 -1',
  'M-103 91l2 -.5 M-88 86q2 0 4 -1 M-70 93l2 -.5',
];
const POD_VEIL = [
  'M78 95l2 -.5 M91 101q2 0 4 -1 M105 93l2 -1',
  'M119 81q2 0 4 -1 M132 87l2 -.5 M146 78l2 -1',
  'M171 62l2 -1 M184 68q2 0 4 -1 M200 61l2 -.5',
];

// Low, gently bent blades are loosely related to existing small clumps.
// Each brush contains different lengths and gaps; none is a repeated symbol.
const HOUSE_BRUSHES = [
  'M-159 315q5 -3 12 -3 M-153 319q5 -2 9 -2 M-137 316q3 -2 8 -2 M-128 323q4 -2 6 -2',
  'M-118 342q4 -1 9 -1 M-109 346q6 -3 13 -3 M-91 343q3 -2 6 -2',
  'M75 307q5 -2 11 -1 M88 314q7 -2 12 -1 M105 318q4 -1 8 0 M118 313q5 -1 8 -1',
  'M129 337q4 0 10 1 M144 342q5 1 9 1 M159 337q3 0 7 1',
  'M266 245q5 -3 13 -2 M278 250q7 -2 12 -2 M294 244q5 0 9 -1',
  'M307 264q6 0 11 2 M320 268q4 1 8 1 M337 262q5 1 9 2',
  'M-208 351q4 -3 9 -3 M-196 355q6 -2 11 -2 M-181 352q3 -1 7 -1',
];
const CABIN_BRUSHES = [
  'M69 116q5 -3 11 -2 M82 121q5 -2 10 -2 M96 117q4 -1 7 -1 M107 124q4 -1 7 0',
  'M39 174q4 -2 9 -2 M52 179q5 -2 10 -2 M68 171q3 -1 7 -1',
];
const TREE_BRUSHES = [
  'M-127 66q5 -2 11 -1 M-114 71q5 -1 10 0 M-99 66q4 -1 7 -1',
];
const POD_BRUSHES = [
  'M88 65q5 -3 11 -3 M101 70q6 -2 12 -2 M117 64q4 -1 8 -1',
  'M174 49q6 -3 12 -3 M186 54q6 -1 10 -1 M201 48q4 -2 8 -1',
];

// A few shallow ribbons give the longer marks a soft leaf silhouette at close zoom.
// They stay under the authored clumps and never form a continuous dark base.
const HOUSE_RIBBONS = [
  'M-159 315q5 -5 12 -4q-5 2 -12 5z M-148 320q5 -4 10 -3q-5 1 -10 4z',
  'M-111 344q6 -4 11 -3q-5 1 -11 4z M-100 347q5 -3 9 -2q-4 1 -9 3z',
  'M78 307q5 -3 11 -2q-5 2 -11 3z M89 315q6 -3 12 -2q-6 1 -12 3z',
  'M131 338q5 -1 10 1q-5 -1 -10 0z M145 343q5 0 9 2q-4 -1 -9 -1z',
  'M267 245q6 -5 12 -4q-6 2 -12 5z M281 251q5 -4 10 -4q-4 2 -10 5z',
  'M310 264q5 0 10 3q-6 -2 -10 -2z M323 269q5 1 9 4q-5 -2 -9 -3z',
];
const CABIN_RIBBONS = [
  'M69 116q6 -4 11 -3q-5 2 -11 4z M84 122q5 -3 10 -3q-4 2 -10 4z',
  'M40 175q5 -3 10 -3q-5 2 -10 4z',
];
const TREE_RIBBONS = ['M-127 66q6 -4 11 -3q-5 2 -11 4z M-113 72q5 -2 10 -1q-5 0 -10 2z'];
const POD_RIBBONS = [
  'M88 65q6 -4 11 -4q-5 2 -11 5z M102 70q6 -3 11 -3q-5 2 -11 4z',
  'M175 49q6 -5 11 -5q-5 2 -11 6z M189 54q5 -3 9 -2q-5 1 -9 3z',
];

type TraceColors = { trace: string; pale: string; strength: number };

function Veil({ paths }: { paths: string[] }) {
  return <>{paths.map((d, i) => <path key={d} d={d} opacity={[.78, .56, .9, .64, .47][i % 5]} />)}</>;
}

function Brush({ paths }: { paths: string[] }) {
  return <>{paths.map((d, i) => <path key={d} d={d} opacity={[.75, .9, .55, .7][i % 4]} />)}</>;
}

export function MeadowBaseTracesV5({ sceneLayout, colors, id = 'meadow-surface-veil' }: { sceneLayout: SceneLayout; colors: TraceColors; id?: string }) {
  const house = sceneLayout.main_cottage, cabin = sceneLayout.wooden_cabin;
  const pod = sceneLayout.capsule_pod, tree = YORKSHIRE_LAYOUT.guardianTree;
  return <g id={id} stroke={colors.trace} strokeWidth=".8" opacity=".23">
      <g data-surface-anchor="main_cottage" transform={`translate(${house.position.x} ${house.position.y}) scale(${house.scale})`}><Veil paths={HOUSE_VEIL} /></g>
      <g data-surface-anchor="wooden_cabin" transform={`translate(${cabin.position.x} ${cabin.position.y}) scale(${cabin.scale})`}><Veil paths={CABIN_VEIL} /></g>
      <g data-surface-anchor="guardian-tree" transform={`translate(${tree.position.x} ${tree.position.y}) scale(${tree.scale}) translate(0 ${tree.root.y})`}><Veil paths={TREE_VEIL} /></g>
      <g data-surface-anchor="capsule_pod" transform={`translate(${pod.position.x} ${pod.position.y}) scale(${pod.scale})`}><Veil paths={POD_VEIL} /></g>
    </g>;
}

export function MeadowSurfaceTracesV5({ sceneLayout, colors }: { sceneLayout: SceneLayout; colors: TraceColors }) {
  const house = sceneLayout.main_cottage, cabin = sceneLayout.wooden_cabin;
  const pod = sceneLayout.capsule_pod, tree = YORKSHIRE_LAYOUT.guardianTree;
  return <g id="meadow-surface-traces" fill="none" strokeLinecap="round" opacity={colors.strength}>
    <MeadowBaseTracesV5 sceneLayout={sceneLayout} colors={colors} />
    <g id="meadow-surface-brushes" stroke={colors.trace} strokeWidth="1.25" opacity=".4">
      <g fill={colors.trace} stroke="none" opacity=".45">
        <g transform={`translate(${house.position.x} ${house.position.y}) scale(${house.scale})`}>{HOUSE_RIBBONS.map(d => <path key={d} d={d} />)}</g>
        <g transform={`translate(${cabin.position.x} ${cabin.position.y}) scale(${cabin.scale})`}>{CABIN_RIBBONS.map(d => <path key={d} d={d} />)}</g>
        <g transform={`translate(${tree.position.x} ${tree.position.y}) scale(${tree.scale}) translate(0 ${tree.root.y})`}>{TREE_RIBBONS.map(d => <path key={d} d={d} />)}</g>
        <g transform={`translate(${pod.position.x} ${pod.position.y}) scale(${pod.scale})`}>{POD_RIBBONS.map(d => <path key={d} d={d} />)}</g>
      </g>
      <g data-surface-anchor="main_cottage" transform={`translate(${house.position.x} ${house.position.y}) scale(${house.scale})`}><Brush paths={HOUSE_BRUSHES} /></g>
      <g data-surface-anchor="wooden_cabin" transform={`translate(${cabin.position.x} ${cabin.position.y}) scale(${cabin.scale})`}><Brush paths={CABIN_BRUSHES} /></g>
      <g data-surface-anchor="guardian-tree" transform={`translate(${tree.position.x} ${tree.position.y}) scale(${tree.scale}) translate(0 ${tree.root.y})`}><Brush paths={TREE_BRUSHES} /></g>
      <g data-surface-anchor="capsule_pod" transform={`translate(${pod.position.x} ${pod.position.y}) scale(${pod.scale})`}><Brush paths={POD_BRUSHES} /></g>
    </g>
    {/* A few warm ends lighten the heavier passages without a new colour field. */}
    <g stroke={colors.pale} strokeWidth=".85" opacity=".18">
      <g transform={`translate(${house.position.x} ${house.position.y}) scale(${house.scale})`}>
        <path d="M-149 321q4 -1 8 -1 M-106 349l6 -1 M96 321q5 0 9 0 M137 345l5 1 M287 254q5 -1 9 -1" />
      </g>
      <g transform={`translate(${cabin.position.x} ${cabin.position.y}) scale(${cabin.scale})`}>
        <path d="M84 126q4 -1 8 -1 M58 183l5 -1" />
      </g>
    </g>
  </g>;
}
