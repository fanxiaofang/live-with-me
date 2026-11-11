import React, { useEffect, useId, useRef } from 'react';
import { createSleepButterflyTrail } from './sleepButterflyTrail';

type Props = {
  path: string;
  rest: { x: number; y: number };
  night: boolean;
  dusk: boolean;
};

type Point = { x: number; y: number };
const flightSeconds = 21;
const smooth01 = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};
const butterflyPalettes = {
  day: {
    inner: '#d8efbc', middle: '#74d7b8', outer: '#55b2ad', edge: '#87cbb8',
    vein: '#d8f2bc', body: '#dbe8b0', core: '#f5f5cf', aura: '#c6f5bc', auraSoft: '#7fd6b6',
    root: '#f2c76b', rootLight: '#fff6c9', bodyShade: '#7fab94',
  },
  dusk: {
    inner: '#e1f6f9', middle: '#a7d6f1', outer: '#988bd8', edge: '#b5b3ed',
    vein: '#e9edff', body: '#dbeefa', core: '#eef3ff', aura: '#d2e7ff', auraSoft: '#ac9fe8',
    root: '#badfff', rootLight: '#f4fcff', bodyShade: '#91a5c4',
  },
  night: {
    inner: '#fff9e8', middle: '#f4dfab', outer: '#dfbc7c', edge: '#e3bf7f',
    vein: '#fff7df', body: '#fff8e7', core: '#fffdf3', aura: '#fff3cb', auraSoft: '#f4dba3',
    root: '#f4dba3', rootLight: '#fffdf3', bodyShade: '#bb9b64',
  },
};
const forewingShape = 'M-.16,-.25 C-.85,-1.55 -2.08,-3.18 -3.78,-3.65 '
  + 'C-4.43,-3.84 -4.77,-3.27 -4.57,-2.53 C-4.4,-1.5 -3.68,-.57 -2.52,-.13 '
  + 'C-1.7,.19 -.8,.26 -.16,-.25 Z';
const hindwingShape = 'M-.16,.08 C-.98,.18 -1.8,.55 -2.46,1.05 '
  + 'C-3.03,1.48 -3.27,2.18 -2.87,2.67 Q-2.6,2.99 -2.25,2.83 '
  + 'Q-1.84,3.15 -1.5,2.68 C-.83,2.2 -.41,1.23 -.16,.08 Z';
const wingRuneMarks = 'M-3.72,-2.92 L-3.84,-2.32 L-3.33,-2.47 M-3.78,-2.61 L-4.07,-2.73 '
  + 'M-2.95,-2.9 L-2.67,-2.58 L-2.35,-2.77 M-2.65,1.45 Q-2.78,1.95 -2.3,2.2 M-2.48,1.72 L-2.1,1.84';

/** One clock drives the SVG butterfly and its cabin-local Canvas wake. */
export function EaveSleepButterfly({ path, rest, night, dusk }: Props) {
  const uid = `sleep-butterfly-${useId().replace(/:/g, '')}`;
  const routeRef = useRef<SVGPathElement>(null);
  const butterflyRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const wingRefs = useRef<(SVGGElement | null)[]>([]);
  const surfaceRef = useRef<SVGForeignObjectElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef({ night, dusk });
  themeRef.current = { night, dusk };
  const strength = night ? 1 : dusk ? .95 : .96;
  const palette = butterflyPalettes[night ? 'night' : dusk ? 'dusk' : 'day'];

  useEffect(() => {
    const route = routeRef.current;
    const canvas = canvasRef.current;
    const surface = surfaceRef.current;
    if (!route || !canvas || !surface) return;
    const totalLength = route.getTotalLength();
    if (!Number.isFinite(totalLength) || totalLength <= 0) return;
    // Cache the native curve once; every moving element uses the same arc-length clock.
    const sampleCount = 1024;
    const samples = Array.from({ length: sampleCount + 1 }, (_, i) => {
      const phase = i / sampleCount * Math.PI * 2;
      const point = route.getPointAtLength(totalLength * i / sampleCount);
      // Small periodic excursions belong to the flight history, including its dust anchors.
      return {
        x: point.x + .35 * Math.sin(phase * 2),
        y: point.y + 1.1 * Math.sin(phase * 3) + .4 * Math.sin(phase * 5),
      };
    });
    const pointAt = (distance: number): Point => {
      const wrapped = ((distance % totalLength) + totalLength) % totalLength;
      const index = wrapped / totalLength * sampleCount;
      const lower = Math.floor(index), fraction = index - lower;
      return {
        x: samples[lower].x + (samples[lower + 1].x - samples[lower].x) * fraction,
        y: samples[lower].y + (samples[lower + 1].y - samples[lower].y) * fraction,
      };
    };
    // Integrate a smooth curvature-dependent pace, then retain history in seconds.
    // The table is periodic, so changing pace never changes the loop duration.
    const travelTimes = [0];
    for (let i = 1; i <= sampleCount; i++) {
      const distance = totalLength * (i - .5) / sampleCount;
      const before = pointAt(distance - 5), center = pointAt(distance), after = pointAt(distance + 5);
      const ax = center.x - before.x, ay = center.y - before.y;
      const bx = after.x - center.x, by = after.y - center.y;
      const turn = Math.abs(Math.atan2(ax * by - ay * bx, ax * bx + ay * by));
      travelTimes.push(travelTimes[i - 1] + 1 + .55 * smooth01(turn / 1.2));
    }
    const travelWeight = travelTimes[sampleCount];
    travelTimes.forEach((value, i) => { travelTimes[i] = value / travelWeight * flightSeconds; });
    const distanceAtTime = (time: number) => {
      const loops = Math.floor(time / flightSeconds);
      const localTime = time - loops * flightSeconds;
      let lower = 0, upper = sampleCount;
      while (upper - lower > 1) {
        const middle = Math.floor((lower + upper) / 2);
        if (travelTimes[middle] <= localTime) lower = middle;
        else upper = middle;
      }
      const fraction = (localTime - travelTimes[lower]) / (travelTimes[upper] - travelTimes[lower]);
      return totalLength * (loops + (lower + fraction) / sampleCount);
    };
    const box = route.getBBox();
    const bounds = { x: box.x - 16, y: box.y - 16, width: box.width + 32, height: box.height + 32 };
    surface.setAttribute('x', String(bounds.x));
    surface.setAttribute('y', String(bounds.y));
    surface.setAttribute('width', String(bounds.width));
    surface.setAttribute('height', String(bounds.height));
    const trail = createSleepButterflyTrail(canvas, bounds, time => pointAt(distanceAtTime(time)));
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, elapsed = 0;
    let heading: number | null = null;
    let bank = 0, wingPhase = 0;
    let previousTime: number | null = null;
    const tick = (time: number) => {
      const delta = previousTime === null ? 0 : (time - previousTime) / 1000;
      elapsed += delta;
      previousTime = time;
      const butterflyPoint = pointAt(distanceAtTime(elapsed));
      const ahead = pointAt(distanceAtTime(elapsed + .16)), behind = pointAt(distanceAtTime(elapsed - .16));
      const dx = ahead.x - behind.x, dy = ahead.y - behind.y;
      const targetHeading = Math.atan2(dy, dx) + Math.PI / 2;
      // The SVG's head points up. Follow the complete tangent, including leftward
      // flight, and unwrap turns so crossing +/- PI never spins the butterfly.
      heading ??= targetHeading;
      const headingChange = Math.atan2(Math.sin(targetHeading - heading), Math.cos(targetHeading - heading));
      heading += headingChange * (1 - Math.exp(-delta * 12));
      const incomingX = butterflyPoint.x - behind.x, incomingY = butterflyPoint.y - behind.y;
      const outgoingX = ahead.x - butterflyPoint.x, outgoingY = ahead.y - butterflyPoint.y;
      const turn = Math.atan2(incomingX * outgoingY - incomingY * outgoingX,
        incomingX * outgoingX + incomingY * outgoingY);
      const targetBank = Math.max(-1, Math.min(1, turn * 3));
      bank += (targetBank - bank) * (1 - Math.exp(-delta * 8));
      const climb = -dy / (Math.hypot(dx, dy) || 1);
      // Climbing beats are quicker and deeper; descending wings open into a glide.
      const wingRate = 1.7 + Math.max(0, climb) * .5 + Math.min(0, climb) * .35 + .1 * Math.sin(elapsed * 1.9);
      wingPhase = (wingPhase + delta * wingRate * Math.PI * 2) % (Math.PI * 2);
      const glide = Math.max(0, -climb) * (.5 + .5 * Math.sin(elapsed * 2.1)) * .38;
      wingRefs.current.forEach((wing, index) => {
        // Mirroring the left-wing outline puts the first wing on the body's right.
        const side = index === 0 ? 1 : -1;
        const beat = (.5 + .5 * Math.cos(wingPhase + side * bank * .18)) ** .7;
        const spread = .14 + .86 * (glide + (1 - glide) * beat);
        const turnFold = 1 - Math.max(0, side * bank) * .24;
        wing?.setAttribute('transform', `rotate(${(1 - beat) * -9 + side * bank * 5}) scale(${spread * turnFold} ${1 - Math.abs(bank) * .06})`);
      });
      butterflyRef.current?.setAttribute('transform', `translate(${butterflyPoint.x} ${butterflyPoint.y}) rotate(${heading * 180 / Math.PI})`);
      bodyRef.current?.setAttribute('transform', `skewY(${bank * 7}) scale(${1 - Math.abs(bank) * .12} ${1 - Math.abs(climb) * .07})`);
      trail?.draw(elapsed, themeRef.current);
      frame = requestAnimationFrame(tick);
    };
    const syncMotion = () => {
      cancelAnimationFrame(frame);
      previousTime = null;
      if (motion.matches) {
        elapsed = 0;
        heading = null;
        bank = 0;
        wingPhase = 0;
        trail?.reset();
        butterflyRef.current?.setAttribute('transform', `translate(${rest.x} ${rest.y})`);
        bodyRef.current?.removeAttribute('transform');
        wingRefs.current.forEach(wing => wing?.removeAttribute('transform'));
      } else if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    syncMotion();
    motion.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncMotion);
    return () => {
      cancelAnimationFrame(frame);
      trail?.reset();
      motion.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncMotion);
    };
  }, [path, rest.x, rest.y]);

  const butterfly = <g ref={bodyRef} data-sleep-butterfly="rounded-rune" opacity={strength}>
    <ellipse cy="-.2" rx="7" ry="5" fill={`url(#${uid}-aura)`} opacity={night ? .3 : dusk ? .18 : .1} />
    {[-1, 1].map((side, index) => <g key={side} transform={`scale(${side} 1)`}>
      <g ref={element => { wingRefs.current[index] = element; }}>
        <path data-butterfly-wing="hind" d={hindwingShape}
          fill={`url(#${uid}-${night ? 'wings' : 'membrane'})`} stroke={palette.edge}
          strokeWidth={night ? .22 : .1} strokeOpacity={night ? .85 : .35} strokeLinejoin="round" />
        <path data-butterfly-wing="fore" d={forewingShape}
          fill={`url(#${uid}-${night ? 'wings' : 'membrane'})`} stroke={palette.edge}
          strokeWidth={night ? .22 : .1} strokeOpacity={night ? .85 : .35} strokeLinejoin="round" />
        {!night && <path d="M-.5,.75 Q-2.4,.8 -2.7,1.65 Q-2.1,2.45 -1.5,2.1 Q-.6,1.6 -.5,.75 Z"
          fill={palette.inner} opacity=".13" />}
        {!night && <path d="M-4.4,-2.62 Q-4.18,-1.63 -3.53,-1.05 M-3.73,-3.44 Q-3.2,-3.28 -2.72,-2.93 M-2.73,2.57 Q-2.49,2.85 -2.25,2.66 M-2.13,2.75 Q-1.88,2.94 -1.65,2.59"
          fill="none" stroke={dusk ? palette.edge : palette.vein} strokeWidth=".16" opacity={dusk ? .8 : .55} strokeLinecap="round" />}
        <path d="M-.32,-.35 Q-1.72,-1.35 -3.65,-2.72 M-1.6,-1.25 Q-1.8,-2.14 -2.65,-2.94 M-.32,.25 Q-1.28,1.04 -2.65,2.2 M-1.3,1.05 Q-1.35,1.9 -1.8,2.54"
          fill="none" stroke={night ? palette.vein : `url(#${uid}-vein-light)`}
          strokeWidth={night ? .24 : .16} opacity={night ? .7 : .78} strokeLinecap="round" />
        <g data-butterfly-wing-runes="edge-inscriptions" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={wingRuneMarks} stroke={palette.vein} strokeWidth=".55" opacity={night ? .2 : dusk ? .17 : .12} />
          <path d={wingRuneMarks} stroke={palette.core} strokeWidth=".16" opacity={night ? .9 : dusk ? .8 : .72} />
          <circle cx="-3.9" cy="-1.25" r=".13" fill={palette.core} opacity={night ? .9 : .65} />
        </g>
      </g>
    </g>)}
    {!night && <circle data-butterfly-root-light={dusk ? 'moon-white' : 'soft-gold'} cy="-.2" r="2.6"
      fill={`url(#${uid}-root-light)`} opacity={dusk ? .76 : .82} />}
    <g data-butterfly-anatomy="head-thorax-abdomen">
      <path data-butterfly-abdomen="tapered" d="M-.25,.46 C-.4,1 -.31,1.77 -.03,2.34 C.28,1.96 .43,1.13 .25,.46 Q0,.61 -.25,.46 Z"
        fill={`url(#${uid}-body)`} />
      <path d="M-.28,1 Q0,1.1 .3,1 M-.23,1.49 Q0,1.58 .25,1.49"
        fill="none" stroke={palette.bodyShade} strokeWidth=".1" opacity=".35" />
      <path d="M-.14,.78 Q-.2,1.43 -.04,1.97" fill="none" stroke={palette.rootLight}
        strokeWidth=".1" opacity=".55" strokeLinecap="round" />
      <ellipse cy="-1.14" rx=".18" ry=".2" fill={palette.body} />
      <path data-butterfly-thorax="spindle" d="M0,-1.14 C-.35,-1.05 -.45,-.64 -.38,-.13 C-.38,.29 -.22,.64 0,.72 C.26,.61 .4,.28 .4,-.13 C.46,-.63 .34,-1.06 0,-1.14 Z"
        fill={`url(#${uid}-body)`} />
      <path d="M-.13,-1.91 C-.24,-2.32 -.42,-2.84 -.78,-3.02 M.13,-1.94 C.22,-2.48 .54,-3.05 .94,-3.15"
        fill="none" stroke={palette.bodyShade} strokeWidth={night ? .16 : .13} strokeLinecap="round" />
      <ellipse cx="-.79" cy="-3.03" rx=".105" ry=".17" transform="rotate(-32 -.79 -3.03)" fill={palette.body} />
      <ellipse cx=".95" cy="-3.16" rx=".1" ry=".16" transform="rotate(38 .95 -3.16)" fill={palette.body} />
      <ellipse data-butterfly-head="oval" cy="-1.57" rx=".34" ry=".43" fill={`url(#${uid}-body)`} />
      <ellipse cx="-.25" cy="-1.59" rx=".065" ry=".11" fill={palette.bodyShade} opacity=".8" />
      <ellipse cx=".25" cy="-1.59" rx=".065" ry=".11" fill={palette.bodyShade} opacity=".8" />
      <path d="M-.12,-1.83 Q-.2,-1.7 -.15,-1.55" fill="none" stroke={palette.rootLight}
        strokeWidth=".08" opacity=".65" strokeLinecap="round" />
      <ellipse cy="-.18" rx=".16" ry=".28" fill={palette.rootLight} stroke={palette.root} strokeWidth=".08" />
    </g>
  </g>;

  return <g data-cabin-eave-effect="sleep-butterfly" data-trail-history="time-based" pointerEvents="none" aria-hidden="true">
    <defs>
      <path ref={routeRef} data-butterfly-flight-route="" d={path} />
      <radialGradient id={`${uid}-wings`} cx="85%" cy="45%" r="90%">
        <stop stopColor={palette.inner} />
        <stop offset=".55" stopColor={palette.middle} />
        <stop offset="1" stopColor={palette.outer} />
      </radialGradient>
      <linearGradient id={`${uid}-membrane`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="-4.4" y2="-.8">
        <stop stopColor={palette.inner} stopOpacity=".96" />
        <stop offset=".18" stopColor={palette.middle} stopOpacity=".96" />
        <stop offset="1" stopColor={palette.outer} stopOpacity={dusk ? .9 : .84} />
      </linearGradient>
      <radialGradient id={`${uid}-root-light`} gradientUnits="userSpaceOnUse" cx="0" cy="-.2" r="2.6">
        <stop stopColor={palette.rootLight} stopOpacity=".95" />
        <stop offset=".17" stopColor={palette.root} stopOpacity=".8" />
        <stop offset=".5" stopColor={palette.root} stopOpacity=".28" />
        <stop offset="1" stopColor={palette.root} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${uid}-vein-light`} gradientUnits="userSpaceOnUse" x1="0" y1="-.2" x2="-3.4" y2="-1.7">
        <stop stopColor={palette.rootLight} stopOpacity=".98" />
        <stop offset=".4" stopColor={palette.vein} stopOpacity=".7" />
        <stop offset="1" stopColor={palette.vein} stopOpacity=".2" />
      </linearGradient>
      <linearGradient id={`${uid}-body`} gradientUnits="userSpaceOnUse" x1="-.45" y1="-.3" x2=".45" y2=".15">
        <stop stopColor={palette.rootLight} />
        <stop offset=".42" stopColor={palette.body} />
        <stop offset="1" stopColor={palette.bodyShade} />
      </linearGradient>
      <radialGradient id={`${uid}-aura`}>
        <stop stopColor={palette.aura} stopOpacity=".8" />
        <stop offset=".45" stopColor={palette.auraSoft} stopOpacity=".28" />
        <stop offset="1" stopColor={palette.auraSoft} stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* This surface stays inside the cabin's depth-sorted SVG group. */}
    <foreignObject ref={surfaceRef} x="-160" y="-110" width="320" height="220"
      data-butterfly-trail="canvas" pointerEvents="none">
      <canvas ref={canvasRef} aria-hidden="true" style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }} />
    </foreignObject>
    <g ref={butterflyRef} transform={`translate(${rest.x} ${rest.y})`}>{butterfly}</g>
  </g>;
}
