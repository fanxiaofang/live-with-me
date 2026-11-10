import React, { useEffect, useId, useRef } from 'react';

type Props = {
  path: string;
  rest: { x: number; y: number };
  night: boolean;
  dusk: boolean;
};

const flightSeconds = 18;
const trailLengthRatio = .3;
const trailSampleSegments = 64;
const fadeSegmentCount = 16;
const samplesPerFadeSegment = trailSampleSegments / fadeSegmentCount;
const fadeSegments = Array.from({ length: fadeSegmentCount }, (_, i) => i);
const dissolveStartSeconds = 3.8;
const trailLayers = [
  { name: 'aura', tailTrim: 0, width: 3.8, offset: 0, colors: ['#d9a76b', '#eec58c', '#f6d6bb', '#e7d6dd', '#fff0cf'], opacity: .16 },
  { name: 'light', tailTrim: 0, width: .76, offset: -.12, colors: ['#d7b090', '#edc995', '#f9d98f', '#f6e5bb', '#fff2d2'], opacity: .72 },
  { name: 'highlight', tailTrim: 10, width: .27, offset: -.85, colors: ['#c7a3ca', '#e4bdd1', '#f3d8c2', '#fff1ce', '#ffe9e1'], opacity: .88 },
  { name: 'moon', tailTrim: 5, width: .32, offset: 1.15, colors: ['#bfa1d6', '#b9d4e1', '#b9e2d7', '#e3ecd1', '#def1ea'], opacity: .65 },
];
const sparkPalette = {
  amethyst: { color: '#b777ee', core: '#f3e0ff', glow: '#a860dc' },
  moonJade: { color: '#48cbbd', core: '#defff3', glow: '#36bfae' },
  roseGold: { color: '#ee87b1', core: '#fff0d8', glow: '#de719d' },
} as const;
const trailSparks = [
  { phase: .035, lifetime: 6.6, offset: -1.7, radius: .36, star: false, tone: 'roseGold' },
  { phase: .09, lifetime: 7.1, offset: 2.4, radius: .54, star: false, tone: 'amethyst' },
  { phase: .125, lifetime: 6.4, offset: -.8, radius: .28, star: false, tone: 'moonJade' },
  { phase: .18, lifetime: 6.5, offset: -3.2, radius: .9, star: true, tone: 'amethyst' },
  { phase: .23, lifetime: 6.2, offset: 1.4, radius: .3, star: false, tone: 'moonJade' },
  { phase: .275, lifetime: 7, offset: 3.7, radius: .72, star: true, tone: 'roseGold' },
  { phase: .31, lifetime: 6.7, offset: -2.1, radius: .42, star: false, tone: 'roseGold' },
  { phase: .36, lifetime: 7, offset: 3.1, radius: .45, star: false, tone: 'moonJade' },
  { phase: .42, lifetime: 6.6, offset: -2.6, radius: .34, star: false, tone: 'amethyst' },
  { phase: .465, lifetime: 6.3, offset: .9, radius: .3, star: false, tone: 'moonJade' },
  { phase: .52, lifetime: 6.9, offset: 2.2, radius: 1.1, star: true, tone: 'amethyst' },
  { phase: .57, lifetime: 7.2, offset: -1.2, radius: .5, star: false, tone: 'moonJade' },
  { phase: .635, lifetime: 6.8, offset: -3.9, radius: .65, star: true, tone: 'moonJade' },
  { phase: .69, lifetime: 6.6, offset: -3.6, radius: .3, star: false, tone: 'roseGold' },
  { phase: .77, lifetime: 6.4, offset: 2.6, radius: .42, star: false, tone: 'amethyst' },
  { phase: .81, lifetime: 6.9, offset: .8, radius: .33, star: false, tone: 'moonJade' },
  { phase: .84, lifetime: 6.7, offset: -2, radius: .8, star: true, tone: 'roseGold' },
  { phase: .95, lifetime: 7, offset: 1.5, radius: .36, star: false, tone: 'roseGold' },
] as const;

type Point = { x: number; y: number };

const pointText = (point: Point) => `${point.x.toFixed(3)},${point.y.toFixed(3)}`;
const smooth01 = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

// Interpolated cubic edges avoid visible polygon corners as the trail moves through a bend.
function smoothEdge(points: Point[]) {
  return points.slice(0, -1).map((point, i) => {
    const before = points[Math.max(0, i - 1)];
    const next = points[i + 1];
    const after = points[Math.min(points.length - 1, i + 2)];
    const controlFrom = { x: point.x + (next.x - before.x) / 6, y: point.y + (next.y - before.y) / 6 };
    const controlTo = { x: next.x - (after.x - point.x) / 6, y: next.y - (after.y - point.y) / 6 };
    return `C${pointText(controlFrom)} ${pointText(controlTo)} ${pointText(next)}`;
  }).join(' ');
}

// A single tapered contour per layer keeps the wake continuous through turns.
function trailContour(points: Point[], width: number, offset = 0, taper = true) {
  const left: Point[] = [], right: Point[] = [];
  for (let i = 0; i < points.length; i++) {
    const before = points[Math.max(0, i - 1)];
    const after = points[Math.min(points.length - 1, i + 1)];
    const dx = after.x - before.x, dy = after.y - before.y;
    const length = Math.hypot(dx, dy) || 1;
    const progress = i / (points.length - 1);
    const taperWidth = Math.sqrt(smooth01(progress)) * (1 - .7 * smooth01((progress - .72) / .28));
    const halfWidth = width * .5 * (taper ? taperWidth : 1);
    const incoming = { x: points[i].x - before.x, y: points[i].y - before.y };
    const outgoing = { x: after.x - points[i].x, y: after.y - points[i].y };
    const turn = Math.abs(Math.atan2(incoming.x * outgoing.y - incoming.y * outgoing.x,
      incoming.x * outgoing.x + incoming.y * outgoing.y));
    const bendGather = 1 / (1 + turn * 7);
    const fan = (.35 + .9 * Math.sin(Math.PI * progress)) * bendGather;
    const displacement = offset * fan;
    const x = points[i].x - dy / length * displacement;
    const y = points[i].y + dx / length * displacement;
    left.push({ x: x - dy / length * halfWidth, y: y + dx / length * halfWidth });
    right.push({ x: x + dy / length * halfWidth, y: y - dx / length * halfWidth });
  }
  const head = points[points.length - 1], beforeHead = points[points.length - 2];
  const length = Math.hypot(head.x - beforeHead.x, head.y - beforeHead.y) || 1;
  const cap = {
    x: (left[left.length - 1].x + right[right.length - 1].x) / 2 + (head.x - beforeHead.x) / length * width * (taper ? .15 : .5),
    y: (left[left.length - 1].y + right[right.length - 1].y) / 2 + (head.y - beforeHead.y) / length * width * (taper ? .15 : .5),
  };
  const returnEdge = right.reverse();
  return `M${pointText(left[0])} ${smoothEdge(left)} Q${pointText(cap)} ${pointText(returnEdge[0])} ${smoothEdge(returnEdge)} Z`;
}

/** One clock drives both the butterfly and its recent history on the same SVG route. */
export function EaveSleepButterfly({ path, rest, night, dusk }: Props) {
  const uid = `sleep-butterfly-${useId().replace(/:/g, '')}`;
  const wingClass = `${uid}-wing`;
  const routeRef = useRef<SVGPathElement>(null);
  const butterflyRef = useRef<SVGGElement>(null);
  const fadeRefs = useRef<(SVGLinearGradientElement | null)[]>([]);
  const fadePathRefs = useRef<(SVGPathElement | null)[]>([]);
  const fadeStopRefs = useRef<(SVGStopElement | null)[]>([]);
  const trailRefs = useRef<(SVGPathElement | null)[]>([]);
  const tintAxisRef = useRef<SVGLinearGradientElement>(null);
  const sparkRefs = useRef<(SVGGElement | null)[]>([]);
  const strength = night ? 1 : dusk ? .82 : .68;

  useEffect(() => {
    const route = routeRef.current;
    if (!route) return;
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
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sparkAnchors = trailSparks.map(spark => {
      const distance = totalLength * spark.phase;
      const anchor = pointAt(distance);
      const before = pointAt(distance - 1), after = pointAt(distance + 1);
      const length = Math.hypot(after.x - before.x, after.y - before.y) || 1;
      return { ...anchor, nx: -(after.y - before.y) / length, ny: (after.x - before.x) / length };
    });
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
    const sparkBirthTimes = trailSparks.map(spark => {
      const index = spark.phase * sampleCount;
      const lower = Math.floor(index);
      return travelTimes[lower] + (travelTimes[lower + 1] - travelTimes[lower]) * (index - lower);
    });
    const trailSeconds = flightSeconds * trailLengthRatio;
    const gapSeconds = .14;
    const fadeAt = (age: number, materialDistance: number) => {
      const dissolve = smooth01((age - dissolveStartSeconds) / (trailSeconds - dissolveStartSeconds));
      const phase = materialDistance / totalLength * Math.PI * 2;
      const grain = .5 + .5 * Math.sin(phase * 27 + 1.2 * Math.sin(phase * 11));
      const fragment = smooth01((grain - .32) / .42);
      const freshness = Math.max(0, 1 - age / trailSeconds);
      return freshness ** 1.65 * (1 - dissolve + dissolve * fragment);
    };
    let frame = 0, elapsed = 0;
    let previousTime: number | null = null;
    const clearTrail = () => {
      trailRefs.current.forEach(element => element?.setAttribute('d', ''));
      sparkRefs.current.forEach(element => element?.setAttribute('opacity', '0'));
    };
    const tick = (time: number) => {
      if (previousTime !== null) elapsed += (time - previousTime) / 1000;
      previousTime = time;
      const distance = distanceAtTime(elapsed);
      const butterflyPoint = pointAt(distance);
      const ahead = pointAt(distanceAtTime(elapsed + .32)), behind = pointAt(distanceAtTime(elapsed - .12));
      const bank = Math.atan2(ahead.y - behind.y, Math.abs(ahead.x - behind.x)) * 180 / Math.PI * .18;
      butterflyRef.current?.setAttribute('transform', `translate(${butterflyPoint.x} ${butterflyPoint.y}) rotate(${bank})`);
      const visibleSeconds = Math.min(trailSeconds - gapSeconds, Math.max(0, elapsed - gapSeconds));
      if (visibleSeconds > 0) {
        const points = Array.from({ length: trailSampleSegments + 1 }, (_, i) => {
          const age = gapSeconds + visibleSeconds * (1 - i / trailSampleSegments);
          const materialDistance = distanceAtTime(elapsed - age);
          const point = pointAt(materialDistance);
          const before = pointAt(materialDistance - 1), after = pointAt(materialDistance + 1);
          const length = Math.hypot(after.x - before.x, after.y - before.y) || 1;
          const spread = smooth01((age - .7) / (trailSeconds - .7));
          const drift = .65 * Math.sin(materialDistance / totalLength * Math.PI * 6) * spread;
          return { x: point.x - (after.y - before.y) / length * drift,
            y: point.y + (after.x - before.x) / length * drift - spread * .9 };
        });
        const tail = points[0], head = points[points.length - 1];
        tintAxisRef.current?.setAttribute('x1', String(tail.x));
        tintAxisRef.current?.setAttribute('y1', String(tail.y));
        tintAxisRef.current?.setAttribute('x2', String(head.x));
        tintAxisRef.current?.setAttribute('y2', String(head.y));
        // Short adjoining mask sections carry opacity along arc length, including hairpin turns.
        // One head-to-tail linear gradient would fade across space and brighten the wrong section.
        fadeSegments.forEach(i => {
          const section = points.slice(i * samplesPerFadeSegment, (i + 1) * samplesPerFadeSegment + 1);
          const tail = section[0], head = section[section.length - 1];
          const gradient = fadeRefs.current[i];
          gradient?.setAttribute('x1', String(tail.x));
          gradient?.setAttribute('y1', String(tail.y));
          gradient?.setAttribute('x2', String(head.x));
          gradient?.setAttribute('y2', String(head.y));
          const tailAge = gapSeconds + visibleSeconds * (1 - i / fadeSegmentCount);
          const headAge = gapSeconds + visibleSeconds * (1 - (i + 1) / fadeSegmentCount);
          const tailGray = Math.round(255 * fadeAt(tailAge, distanceAtTime(elapsed - tailAge)));
          const headGray = Math.round(255 * fadeAt(headAge, distanceAtTime(elapsed - headAge)));
          fadeStopRefs.current[i * 2]?.setAttribute('stop-color', `rgb(${tailGray},${tailGray},${tailGray})`);
          fadeStopRefs.current[i * 2 + 1]?.setAttribute('stop-color', `rgb(${headGray},${headGray},${headGray})`);
          fadePathRefs.current[i]?.setAttribute('d', trailContour(section, 6, 0, false));
        });
        trailLayers.forEach((layer, i) => {
          trailRefs.current[i]?.setAttribute('d', trailContour(points.slice(layer.tailTrim), layer.width, layer.offset));
        });
      } else clearTrail();
      trailSparks.forEach((spark, i) => {
        const birthTime = sparkBirthTimes[i];
        const age = ((elapsed - birthTime) % flightSeconds + flightSeconds) % flightSeconds;
        const element = sparkRefs.current[i];
        const releaseAge = dissolveStartSeconds + (i % 4) * .16;
        if (elapsed < birthTime || age < releaseAge || age >= spark.lifetime) {
          element?.setAttribute('opacity', '0');
          return;
        }
        const progress = (age - releaseAge) / (spark.lifetime - releaseAge);
        const anchor = sparkAnchors[i];
        const drift = spark.offset * smooth01(progress) + Math.sign(spark.offset) * progress * .7;
        const x = anchor.x + anchor.nx * drift;
        const y = anchor.y + anchor.ny * drift - progress * 1.6;
        const shimmer = .82 + .18 * Math.sin(age * 4 + i * 1.7);
        // Fragments appear on the fading filament first, then open out into dust and stars.
        const envelope = Math.sin(Math.PI * progress) ** .85;
        const opacity = envelope * shimmer * (spark.star ? .85 : .7);
        element?.setAttribute('transform', `translate(${x} ${y})`);
        element?.setAttribute('opacity', String(opacity));
      });
      frame = requestAnimationFrame(tick);
    };
    const syncMotion = () => {
      cancelAnimationFrame(frame);
      previousTime = null;
      if (motion.matches) {
        elapsed = 0;
        clearTrail();
        butterflyRef.current?.setAttribute('transform', `translate(${rest.x} ${rest.y})`);
      } else if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    syncMotion();
    motion.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncMotion);
    return () => {
      cancelAnimationFrame(frame);
      motion.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncMotion);
    };
  }, [path, rest.x, rest.y, trailLayers, trailSparks]);

  const butterfly = <g data-sleep-butterfly="rounded-rune" opacity={strength}>
    <ellipse cy="-.2" rx="7" ry="5" fill={`url(#${uid}-aura)`} opacity={night ? .3 : .12} />
    {[-1, 1].map(side => <g key={side} transform={`scale(${side} 1)`}>
      <g className={wingClass}>
        <path d="M0,-.4 C-1.4,-3.5 -4.1,-4 -4.4,-2.3 C-4.7,-.7 -2.7,.7 -1,1 C-3.2,.5 -3.8,2.1 -2.7,2.8 C-1.5,3.5 -.5,1.9 0,.6 Z"
          fill={`url(#${uid}-wings)`} stroke="#e3bf7f" strokeWidth=".3" strokeLinejoin="round" />
        <path d="M-1.1,-.5 Q-2.1,-1.5 -2.9,-1.5" fill="none" stroke="#fff7df"
          strokeWidth=".4" opacity=".8" strokeLinecap="round" />
      </g>
    </g>)}
    <path d="M0,-1.8 Q.35,0 0,1.8 M-.8,-2.7 Q0,-1.7 .8,-2.7"
      fill="none" stroke="#fff8e7" strokeWidth=".65" strokeLinecap="round" />
    <circle cy="-.2" r=".5" fill="#fffdf3" />
  </g>;

  return <g data-cabin-eave-effect="sleep-butterfly" data-trail-history="time-based" pointerEvents="none" aria-hidden="true">
    <defs>
      <path ref={routeRef} data-butterfly-flight-route="" d={path} />
      <linearGradient ref={tintAxisRef} id={`${uid}-tint-axis`} gradientUnits="userSpaceOnUse"
        x1={rest.x - 1} y1={rest.y} x2={rest.x} y2={rest.y} />
      {trailLayers.map(layer => <linearGradient key={layer.name} id={`${uid}-tint-${layer.name}`}
        href={`#${uid}-tint-axis`}>
        {layer.colors.map((color, i) => <stop key={i} offset={i / (layer.colors.length - 1)} stopColor={color} />)}
      </linearGradient>)}
      {fadeSegments.map(i => {
        const tailGray = Math.round(255 * (i / fadeSegmentCount) ** 1.3);
        const headGray = Math.round(255 * ((i + 1) / fadeSegmentCount) ** 1.3);
        return <linearGradient key={i} id={`${uid}-fade-${i}`} gradientUnits="userSpaceOnUse"
          ref={element => { fadeRefs.current[i] = element; }}>
          <stop ref={element => { fadeStopRefs.current[i * 2] = element; }}
            stopColor={`rgb(${tailGray},${tailGray},${tailGray})`} />
          <stop offset="1" ref={element => { fadeStopRefs.current[i * 2 + 1] = element; }}
            stopColor={`rgb(${headGray},${headGray},${headGray})`} />
        </linearGradient>;
      })}
      <mask id={`${uid}-trail-fade`} maskUnits="userSpaceOnUse" x="-160" y="-110" width="320" height="220"
        style={{ maskType: 'luminance' }}>
        {fadeSegments.map(i => <path key={i} ref={element => { fadePathRefs.current[i] = element; }}
          fill={`url(#${uid}-fade-${i})`} stroke={`url(#${uid}-fade-${i})`} strokeWidth=".15" />)}
      </mask>
      <filter id={`${uid}-soft-aura`} filterUnits="userSpaceOnUse" x="-160" y="-110" width="320" height="220"
        colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="1.1" />
      </filter>
      <radialGradient id={`${uid}-wings`} cx="85%" cy="45%" r="90%">
        <stop stopColor="#fff9e8" />
        <stop offset=".55" stopColor="#f4dfab" />
        <stop offset="1" stopColor="#dfbc7c" />
      </radialGradient>
      <radialGradient id={`${uid}-aura`}>
        <stop stopColor="#fff3cb" stopOpacity=".8" />
        <stop offset=".45" stopColor="#f4dba3" stopOpacity=".28" />
        <stop offset="1" stopColor="#f4dba3" stopOpacity="0" />
      </radialGradient>
      {Object.entries(sparkPalette).map(([name, tone]) => <radialGradient key={name} id={`${uid}-spark-${name}`}>
        <stop stopColor={tone.glow} stopOpacity=".8" />
        <stop offset=".4" stopColor={tone.glow} stopOpacity=".3" />
        <stop offset="1" stopColor={tone.glow} stopOpacity="0" />
      </radialGradient>)}
    </defs>
    <style>{`
      @keyframes ${uid}-flutter {
        0%,100% { transform:scaleX(1) }
        50% { transform:scaleX(.55) }
      }
      @media (prefers-reduced-motion:no-preference) {
        .${wingClass} { transform-origin:0px 0px; animation:${uid}-flutter 1.7s ease-in-out infinite }
      }
    `}</style>
    {trailLayers.map((layer, i) => <g key={layer.name}
      opacity={layer.opacity * strength}
      filter={layer.name === 'aura' ? `url(#${uid}-soft-aura)` : undefined}>
      <path ref={element => { trailRefs.current[i] = element; }}
        data-butterfly-trail={layer.name} data-trail-length-ratio={trailLengthRatio}
        fill={`url(#${uid}-tint-${layer.name})`} mask={`url(#${uid}-trail-fade)`} />
    </g>)}
    <g data-butterfly-stardust="sparse-emissions" opacity={strength}>
      {trailSparks.map((spark, i) => {
        const tone = sparkPalette[spark.tone];
        return <g key={spark.phase} opacity="0" data-stardust-tone={spark.tone}
          ref={element => { sparkRefs.current[i] = element; }}>
          <circle r={spark.radius * (spark.star ? 2.5 : 2)}
            fill={`url(#${uid}-spark-${spark.tone})`} opacity=".5" />
          {spark.star
            ? <>
              <path d="M0,-1.6 Q.25,-.25 1.15,0 Q.25,.25 0,1.6 Q-.25,.25 -1.15,0 Q-.25,-.25 0,-1.6 Z"
                transform={`scale(${spark.radius})`} fill={tone.color} />
              <circle r={spark.radius * .2} fill={tone.core} />
            </>
            : <circle r={spark.radius} fill={tone.color} />}
        </g>;
      })}
    </g>
    <g ref={butterflyRef} transform={`translate(${rest.x} ${rest.y})`}>{butterfly}</g>
  </g>;
}
