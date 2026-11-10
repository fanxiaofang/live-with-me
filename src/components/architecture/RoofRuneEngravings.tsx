import React from 'react';

type Point = readonly [number, number];
type Stroke = Point[];
type Projection = (angle: number, t: number) => { x: number; y: number };

const line = (...points: Point[]): Stroke => points;
const circle = (x: number, y: number, r: number): Stroke => Array.from({ length: 49 }, (_, i) => {
  const a = i / 48 * Math.PI * 2;
  return [x + Math.cos(a) * r, y + Math.sin(a) * r];
});
const curve = (a: Point, b: Point, c: Point, d: Point): Stroke => Array.from({ length: 25 }, (_, i) => {
  const t = i / 24, s = 1 - t;
  return [s ** 3 * a[0] + 3 * s * s * t * b[0] + 3 * s * t * t * c[0] + t ** 3 * d[0],
    s ** 3 * a[1] + 3 * s * s * t * b[1] + 3 * s * t * t * c[1] + t ** 3 * d[1]];
});
const join = (...strokes: Stroke[]) => strokes.flat();
const rotate = (points: Stroke, angle: number): Stroke => points.map(([x, y]) => [
  x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle),
]);

const crescent = join(
  curve([-1, -.38], [-.43, -.38], [-.43, .38], [-1, .38]),
  curve([-1, .38], [-.73, .2], [-.73, -.2], [-1, -.38]),
);
const pentagon = Array.from({ length: 5 }, (_, i): Point => [
  Math.cos(-Math.PI / 2 + i * Math.PI * 2 / 5) * .79,
  Math.sin(-Math.PI / 2 + i * Math.PI * 2 / 5) * .79,
]);
const petal = join(
  curve([-.35, .16], [-.48, -.28], [-.25, -.73], [0, -.96]),
  curve([0, -.96], [.25, -.73], [.48, -.28], [.35, .16]),
  curve([.35, .16], [.12, .24], [-.12, .24], [-.35, .16]),
);
const hamsa = join(
  curve([-.48, .85], [-.62, .66], [-.68, .22], [-.8, .02]),
  curve([-.8, .02], [-1, -.22], [-.66, -.38], [-.5, -.2]),
  line([-.5, -.2], [-.5, -.65]),
  curve([-.5, -.65], [-.5, -.98], [-.18, -.98], [-.18, -.65]),
  line([-.18, -.65], [-.18, -.89]),
  curve([-.18, -.89], [-.18, -1.16], [.18, -1.16], [.18, -.89]),
  line([.18, -.89], [.18, -.65]),
  curve([.18, -.65], [.18, -.98], [.5, -.98], [.5, -.65]),
  line([.5, -.65], [.5, -.2]),
  curve([.5, -.2], [.66, -.38], [1, -.22], [.8, .02]),
  curve([.8, .02], [.68, .22], [.62, .66], [.48, .85]),
  curve([.48, .85], [.2, .97], [-.2, .97], [-.48, .85]),
);
const eye = join(curve([-.38, .22], [-.12, -.02], [.12, -.02], [.38, .22]),
  curve([.38, .22], [.12, .46], [-.12, .46], [-.38, .22]));
const risingMoon = join(
  curve([-.65, -.65], [-.94, .5], [.94, .5], [.65, -.65]),
  curve([.65, -.65], [.6, .12], [-.6, .12], [-.65, -.65]),
);

// These are contemporary protective motifs, not a single historical rune alphabet.
const motifs: Record<string, Stroke[]> = {
  'triple-moon': [crescent, crescent.map(([x, y]): Point => [-x, y]), circle(0, 0, .33),
    line([-.19, 0], [.19, 0]), line([0, -.19], [0, .19]),
    ...[-1, 1].flatMap(x => [-1, 1].map(y => circle(x * .12, y * .12, .018)))],
  pentagram: [circle(0, 0, .97), line(...[0, 2, 4, 1, 3, 0].map(i => pentagon[i]))],
  'venus-flower': Array.from({ length: 5 }, (_, i) => rotate(petal, i * Math.PI * 2 / 5)),
  hamsa: [hamsa, eye, circle(0, .22, .065)],
  'rising-woman': [risingMoon, ...Array.from({ length: 7 }, (_, i) => {
    const x = (i - 3) / 5;
    return line([x, .2 - Math.abs(x) * .3], [x * 1.2, 1.2 - Math.abs(x) * .85]);
  })],
};
const wardBandHeight = (turns: number) => .39 + .1 * Math.exp(-Math.pow((turns - 1.49) / .19, 2));
const placement = [
  { kind: 'triple-moon', angle: 1.49, t: .49, radius: 18.5, weight: 1 },
  { kind: 'venus-flower', angle: 1.27, t: wardBandHeight(1.27), radius: 5.3, weight: .48 },
  { kind: 'pentagram', angle: 1.73, t: wardBandHeight(1.73), radius: 5.1, weight: .42 },
  { kind: 'hamsa', angle: 1.10, t: .46, radius: 6.1, weight: .16 },
  { kind: 'rising-woman', angle: 1.47, t: .77, radius: 4.6, weight: .16 },
] as const;
/** Engraved paths are sampled onto the actual roof, including its changing curvature. */
export function RoofRuneEngravings({ project, night, dusk, clipId, variant = 'cabin', radius = 12, material = 'terracotta' }: {
  project: Projection; night: boolean; dusk: boolean; clipId: string;
  variant?: 'cabin' | 'pentagram' | 'venus-flower'; radius?: number;
  material?: 'terracotta' | 'timber' | 'plaster';
}) {
  const uid = React.useId().replace(/:/g, '');
  const glowId = `roof-engraving-glow-${uid}`;
  const reflectionId = `roof-engraving-reflection-${uid}`;
  const lightId = `roof-ward-light-${uid}`;
  const mineralId = `ward-mineral-${uid}`;
  const groove = material === 'plaster' ? '#4e6458' : material === 'timber' ? '#3d291b' : '#66301f';
  const cutLight = material === 'plaster' ? '#f1e4c7' : material === 'timber' ? '#c4a274' : '#e09b57';
  const auraClass = `roof-ward-aura-${uid}`, moteClass = `roof-ward-mote-${uid}`;
  const effectClass = `roof-ward-effect-${uid}`, flowClass = `roof-ward-flow-${uid}`;
  const bloomClass = `roof-ward-bloom-${uid}`, shieldClass = `roof-ward-shield-${uid}`;
  const petalClass = `roof-ward-petal-${uid}`, sealClass = `roof-ward-seal-${uid}`;
  const liftClass = `roof-ward-lift-${uid}`, eyeClass = `roof-ward-eye-${uid}`;
  const center = variant === 'cabin' ? project(Math.PI * 1.49, .49) : project(Math.PI * 1.5, .5);
  const upper = project(Math.PI * 1.47, .69);
  const motes = [
    { x: center.x - 17, y: center.y - 7, size: .8, delay: '-1.2s' },
    { x: center.x + 16, y: center.y - 9, size: 1.15, delay: '-3.5s' },
    { x: upper.x + 2, y: upper.y - 4, size: .65, delay: '-2.1s' },
  ];
  const selectedPlacement = variant === 'cabin'
    ? placement.filter(p => p.kind !== 'pentagram' && p.kind !== 'venus-flower')
    : placement.filter(p => p.kind === variant).map(p => ({ ...p, angle: 1.5, t: .5, radius, weight: .4 }));
  const glyphs = selectedPlacement.map(({ kind, angle: turns, t, radius, weight }) => {
    const angle = turns * Math.PI, p = project(angle, t);
    const dx = project(angle + .001, t), dy = project(angle, t + .001);
    // Do not restore equal apparent widths at the side of the crown.
    const facing = .5 + .5 * Math.abs(Math.sin(angle));
    const across = radius * facing / (Math.hypot(dx.x - p.x, dx.y - p.y) / .001);
    const depth = radius * (material === 'plaster' ? .95 : .82) / (Math.hypot(dy.x - p.x, dy.y - p.y) / .001);
    const surface = ([x, y]: Point) => project(angle + x * across, t - y * depth);
    const surfacePath = (stroke: Stroke) => stroke.flatMap((point, i): Point[] => {
      if (i === 0) return [point];
      const previous = stroke[i - 1];
      const steps = Math.max(1, Math.ceil(Math.hypot(point[0] - previous[0], point[1] - previous[1]) / .08));
      return Array.from({ length: steps }, (_, step): Point => [
        previous[0] + (point[0] - previous[0]) * (step + 1) / steps,
        previous[1] + (point[1] - previous[1]) * (step + 1) / steps,
      ]);
    }).map(([x, y], i) => {
      const q = surface([x, y]);
      return `${i ? 'L' : 'M'}${q.x.toFixed(3)},${q.y.toFixed(3)}`;
    }).join(' ');
    const paths = motifs[kind].map(surfacePath);
    return { kind, d: paths.join(' '), paths, surface, surfacePath, weight, band: false };
  });
  const venus = glyphs.find(g => g.kind === 'venus-flower');
  const pent = glyphs.find(g => g.kind === 'pentagram');
  const hand = glyphs.find(g => g.kind === 'hamsa');
  const rising = glyphs.find(g => g.kind === 'rising-woman');
  const seed = rising ? rising.surface([0, -.65]) : center;
  const shield = hand ? hand.surfacePath(join(
    curve([-1.05, .7], [-1.65, -.3], [-.9, -1.5], [.2, -1.35]),
    curve([.2, -1.35], [.65, -1.3], [1.08, -.7], [1.1, -.2]),
  )) : '';
  const bounds = variant === 'cabin' ? { x: -145, y: -110, width: 290, height: 160 }
    : { x: center.x - radius * 3, y: center.y - radius * 3, width: radius * 6, height: radius * 6 };
  const lightStroke = (d: string, color: string, className: string, key: string, style?: React.CSSProperties) => <g key={key}
    fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
    <g opacity=".35"><path d={d} pathLength="1" className={className} style={style}
      strokeWidth="1.65" filter={`url(#${glowId})`} /></g>
    <path d={d} pathLength="1" className={className} style={style} strokeWidth=".55" />
  </g>;
  return <g data-roof-ornament="engraved-wards" data-ward-owner={variant} pointerEvents="none">
    <defs>
      <linearGradient id={mineralId} gradientUnits="userSpaceOnUse"
        x1={center.x - radius} y1={center.y - radius} x2={center.x + radius} y2={center.y + radius}>
        <stop offset="0%" stopColor="#98af8b" />
        <stop offset="48%" stopColor="#65866d" />
        <stop offset="100%" stopColor="#819d7b" />
      </linearGradient>
      <linearGradient id={lightId} gradientUnits="userSpaceOnUse"
        x1={center.x - 19} y1={center.y} x2={center.x + 19} y2={center.y - 3}>
        <stop offset="0%" stopColor="#b8d8b6" />
        <stop offset="38%" stopColor="#fff1c7" />
        <stop offset="65%" stopColor="#f6e6b6" />
        <stop offset="100%" stopColor="#b9d4b0" />
      </linearGradient>
      {/* Local user-space region, no whole-scene bloom; the sharp core is drawn separately. */}
      <filter id={glowId} filterUnits="userSpaceOnUse" {...bounds}
        colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="1.15" />
      </filter>
      <filter id={reflectionId} filterUnits="userSpaceOnUse" {...bounds}
        colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>
    <style>{`
      @keyframes roofWardAura${uid} { 0%,100% { opacity:.65 } 50% { opacity:1 } }
      @keyframes roofWardMote${uid} { 0%,100% { opacity:.25; transform:translateY(0px) } 50% { opacity:.85; transform:translateY(-1.8px) } }
      @keyframes wardWindow${uid} { 0%,3% { opacity:0 } 5%,18% { opacity:.9 } 22%,100% { opacity:0 } }
      @keyframes wardFlow${uid} { 0%,4% { opacity:0; stroke-dashoffset:-1 } 6% { opacity:1 } 12% { opacity:1; stroke-dashoffset:0 } 15%,100% { opacity:0; stroke-dashoffset:0 } }
      @keyframes wardBloom${uid} { 0%,10% { opacity:0 } 13% { opacity:1 } 17% { opacity:.65 } 21%,100% { opacity:0 } }
      @keyframes wardEye${uid} { 0%,3% { opacity:0 } 5% { opacity:1 } 9% { opacity:.65 } 18% { opacity:.35 } 22%,100% { opacity:0 } }
      @keyframes wardShield${uid} { 0%,11% { opacity:0; stroke-dashoffset:1 } 13% { opacity:.8 } 17% { opacity:.65; stroke-dashoffset:0 } 21%,100% { opacity:0; stroke-dashoffset:0 } }
      @keyframes wardPetal${uid} { 0%,5% { opacity:0 } 7% { opacity:1 } 10% { opacity:.2 } 18% { opacity:.12 } 22%,100% { opacity:0 } }
      @keyframes wardSeal${uid} { 0%,11% { opacity:0; stroke-dashoffset:1 } 13% { opacity:.5 } 17% { opacity:1; stroke-dashoffset:0 } 20% { opacity:.6 } 22%,100% { opacity:0; stroke-dashoffset:0 } }
      @keyframes wardLift${uid} { 0%,13% { opacity:0; transform:translateY(0px) } 15% { opacity:.9; transform:translateY(-.5px) } 21%,100% { opacity:0; transform:translateY(-5px) } }
      .${effectClass} { opacity:0 }
      @media (prefers-reduced-motion:no-preference) {
        .${auraClass} { animation:roofWardAura${uid} 7s ease-in-out infinite }
        .${moteClass} { animation:roofWardMote${uid} 6s ease-in-out infinite }
        .${effectClass} { animation:wardWindow${uid} 32s linear infinite; animation-delay:var(--ward-shift,0s) }
        .${flowClass} { stroke-dasharray:.25 .75; animation:wardFlow${uid} 32s linear infinite; animation-delay:var(--ward-shift,0s) }
        .${bloomClass} { animation:wardBloom${uid} 32s linear infinite; animation-delay:var(--ward-shift,0s) }
        .${eyeClass} { animation:wardEye${uid} 32s linear infinite; animation-delay:var(--ward-shift,0s) }
        .${shieldClass} { stroke-dasharray:1; animation:wardShield${uid} 32s linear infinite; animation-delay:var(--ward-shift,0s) }
        .${petalClass} { animation:wardPetal${uid} 32s linear infinite; animation-delay:var(--ward-shift,0s) }
        .${sealClass} { stroke-dasharray:1; animation:wardSeal${uid} 32s linear infinite; animation-delay:var(--ward-shift,0s) }
        .${liftClass} { animation:wardLift${uid} 32s linear infinite; animation-delay:var(--ward-shift,0s) }
      }
      @media (prefers-reduced-motion:reduce) { .${effectClass} { opacity:.12 } }
    `}</style>
    <g clipPath={`url(#${clipId})`}>
    {/* Nearby clay receives warm spill before the incised edges and sharp cores are drawn. */}
    {variant === 'cabin' && <g className={night || dusk ? auraClass : undefined}>
      <path d={glyphs[0].d} fill="none" stroke="#e6a54e" strokeWidth="7"
        filter={`url(#${reflectionId})`} opacity={night ? .27 : dusk ? .09 : .035} />
      <path d={glyphs[0].d} fill="none" stroke="#b7d5af" strokeWidth="3.5"
        filter={`url(#${glowId})`} opacity={night ? .55 : dusk ? .25 : .1} />
    </g>}
    {glyphs.map(({ kind, d, weight, band }) => <g key={kind} data-roof-rune={kind}
      fill="none" strokeLinecap="round" strokeLinejoin="round">
      {material === 'plaster' && <path d={d} fill={`url(#${mineralId})`} stroke="none" opacity={night ? .1 : .17} />}
      <path d={d} transform="translate(.16 .28)" stroke={cutLight} strokeWidth={band ? .7 : material === 'plaster' ? 1.4 : 1.5}
        opacity={band ? .13 : .2 + weight * .23} />
      <path d={d} transform={material === 'plaster' ? undefined : 'translate(-.1 -.13)'}
        stroke={groove} strokeWidth={band ? .6 : material === 'plaster' ? 1.15 : weight === 1 ? 1.32 : 1.05}
        opacity={band ? .22 : .24 + weight * .48} />
      {(night || dusk) && !band && weight >= .4 && <path d={d} stroke="#adc899" strokeWidth="2.1"
        filter={`url(#${glowId})`} opacity={(night ? .55 : .1) * weight} />}
      <path d={d} stroke={weight === 1 ? `url(#${lightId})` : night ? '#e4d9aa' : material === 'plaster' ? `url(#${mineralId})` : material === 'timber' ? '#ceb281' : '#c17f42'}
        strokeWidth={band ? .28 : material === 'plaster' ? .72 : weight === 1 ? .67 : .48}
        opacity={night ? weight * .94 : weight === 1 ? (dusk ? .75 : .62) : .42 + weight * .35} />
    </g>)}
    </g>
    {/* Each attached ward retains its original short blessing and quiet interval. */}
    <g data-roof-magic="individual-blessings" opacity={night ? 1 : dusk ? .45 : .12}>
      {rising && <g className={effectClass} style={{ '--ward-shift': '0s' } as React.CSSProperties}
        data-ward-effect="rising-woman">
        <g clipPath={`url(#${clipId})`}>
          {[4, 3, 5, 2, 6].map((ray, i) => lightStroke(rising.paths[ray], '#f0ce91', flowClass, `ray-${ray}`,
            { animationDelay: `calc(var(--ward-shift) + ${i * .12}s)` }))}
          {lightStroke(rising.paths[0], '#f8e7b5', bloomClass, 'rising-crescent')}
        </g>
        <g className={liftClass}>
          <circle cx={seed.x} cy={seed.y} r="1.15" fill="#e4d7a4" opacity=".5" filter={`url(#${glowId})`} />
          <ellipse cx={seed.x} cy={seed.y} rx=".38" ry=".65" fill="#fff1c9" />
        </g>
      </g>}
      {hand && <g className={effectClass} style={{ '--ward-shift': '-24s' } as React.CSSProperties}
        data-ward-effect="hamsa" clipPath={`url(#${clipId})`}>
        {lightStroke(hand.paths[1] + ' ' + hand.paths[2], '#e1edc7', eyeClass, 'hand-eye')}
        {lightStroke(hand.paths[0], '#c3dcc0', flowClass, 'hand-outline')}
        {lightStroke(shield, '#a7cebb', shieldClass, 'hand-shield')}
      </g>}
      {venus && <g className={effectClass} style={{ '--ward-shift': '-16s' } as React.CSSProperties}
        data-ward-effect="venus-flower" clipPath={`url(#${clipId})`}>
        {venus.paths.map((d, i) => lightStroke(d, i % 2 ? '#f1d6b2' : '#edcfa0', petalClass, `petal-${i}`,
          { animationDelay: `calc(var(--ward-shift) + ${i * .45}s)` }))}
        {lightStroke(venus.surfacePath(circle(0, 0, .075)), '#fff0cf', bloomClass, 'flower-heart')}
      </g>}
      {pent && <g className={effectClass} style={{ '--ward-shift': '-8s' } as React.CSSProperties}
        data-ward-effect="pentagram" clipPath={`url(#${clipId})`}>
        {pentagon.map((point, i) => lightStroke(pent.surfacePath(circle(point[0], point[1], .065)),
          '#deebc7', petalClass, `element-${i}`, { animationDelay: `calc(var(--ward-shift) + ${i * .4}s)` }))}
        {lightStroke(pent.paths[1], '#c7d6b3', bloomClass, 'protective-star')}
        {lightStroke(pent.paths[0], '#e5e9c8', sealClass, 'protective-circle')}
      </g>}
    </g>
    {variant === 'cabin' && (night || dusk) && <g data-roof-magic="lifted-light" opacity={night ? 1 : .5}>
      <path d={`M${center.x + 14},${center.y - 1} Q${center.x + 20},${center.y - 5} ${center.x + 16},${center.y - 9}`}
        fill="none" stroke="#bed9b6" strokeWidth=".35" opacity=".4" strokeLinecap="round" />
      {motes.map(({ x, y, size, delay }, index) => <g key={index} className={moteClass}
        style={{ animationDelay: delay }} opacity=".7">
        <circle cx={x} cy={y} r={size * 1.8} fill="#bbdcb6" opacity=".55" filter={`url(#${glowId})`} />
        <path d={`M${x - size},${y} Q${x},${y} ${x},${y - size * 1.5} Q${x},${y} ${x + size},${y} Q${x},${y} ${x},${y + size * 1.5} Q${x},${y} ${x - size},${y}Z`}
          fill="#fff1c5" />
      </g>)}
    </g>}
  </g>;
}
