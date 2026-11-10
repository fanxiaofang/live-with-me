import { useId } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { Grass } from '../vegetation/MeadowVegetationAssets';
import { meadowPlantPaletteCss } from '../vegetation/meadowPalette';
import { YardObject, useYardPlacement } from '../../../../features/yard-editor/YardWorld';
import { rotateGroundPoint, TILLED_PLOTS, TILLED_PLOT_IDS, type TilledPlotId } from '../../../../features/yard-editor/yardLayout';
import { gardenPlantingSlots, type PlantingRow } from '../../../../features/yard-editor/yardCrops';
import { GardenVegetable } from './GardenVegetable';
import { GardenCropContactShadow } from './GardenCropContactShadow';
import { gardenSoilPalette as soilPalette } from '../terrain/groundReferencePalette';

/** Unequal crumbly lobes and a broken shoulder, without a stone outline or glossy rim. */
function SoilAggregate({ palette:p, variant=0 }: { palette: ReturnType<typeof soilPalette>; variant?: number }) {
  return <g>
    <path d="M-3,.4 Q-3.8,-1.2 -2,-1.8 Q-1.5,-3 .3,-2.2 Q2.3,-2.4 2.7,-.8 Q4,-.3 2.7,.9 Q1.3,1.8 -.1,1.3 Q-1.8,2 -3,.4Z" fill={p.clod} opacity=".65" />
    <path d={variant%2 ? 'M-3,-.1 Q-3.3,-1.2 -1.7,-1.4 Q-1.2,-2.4 .3,-1.9 Q2,-2.1 2.5,-.7 L1,.4 -.7,.1 -1.6,.6Z' : 'M-2.8,-.4 Q-2.2,-1.9 -.7,-1.8 Q-.1,-2.6 1.1,-1.6 Q2.5,-1.4 2.4,-.3 L.7,.6 -.5,.2 -1.5,.7Z'} fill={p.patch} />
    <path d={variant%2 ? 'M-1.6,-1.2 Q-.8,-2.3 .5,-1.5 L.2,-.7 -.6,-.8Z' : 'M-2,-.9 Q-1.2,-1.8 -.3,-1.5 L-.8,-.4Z'} fill={p.ridge} opacity=".45" />
  </g>;
}
const OUTLINE: readonly (readonly [number, number])[] = [
  [-77,-30],[-63,-34],[-20,-33],[12,-35],[58,-33],[76,-28],[78,-10],[75,4],[78,24],[69,32],
  [35,33],[16,31],[-13,34],[-52,32],[-74,34],[-79,25],[-77,8],[-80,-10],
];

type SoilPoint = readonly [number, number];
type SoilStudy = {
  outline: readonly SoilPoint[];
  patches: readonly (readonly SoilPoint[])[];
  // Individually drawn ridge length, cross-position, bend, shoulder width and rise.
  rows: readonly (readonly [number, number, number, number, number, number])[];
  clods: readonly (readonly [number, number, number])[];
  turf: readonly SoilPoint[];
  edges: readonly (readonly SoilPoint[])[];
};

// Separate drawings for each heading: no preset reuses the original silhouette or furrows.
// Coordinates share the yard ground projection; lighting is applied after projection.
const SOIL_STUDIES = {
  front: {
    outline: [[-76,-27],[-66,-32],[-46,-30],[-31,-34],[-6,-31],[18,-33],[39,-30],[64,-31],[75,-25],[73,-11],[78,0],[74,13],[76,25],[64,29],[43,27],[19,33],[-2,30],[-26,32],[-45,29],[-65,31],[-77,24],[-74,10],[-79,-4]],
    patches: [[[-72,-24],[-33,-30],[-17,-20],[-26,0],[-58,13],[-73,8]],[[17,10],[48,2],[73,8],[73,25],[40,27],[18,31],[4,25]]],
    rows: [[-65,62,-22,1.5,2.1,.65],[-68,67,-11,-1.1,2.6,.8],[-63,69,1,.8,2.8,.9],[-67,64,13,-1.4,2.3,.75],[-58,60,24,.7,2,.55]],
    clods: [[-69,-24,.8],[-37,29,.6],[32,-28,.7],[70,16,.85],[55,27,.5]],
    turf: [[-74,20],[13,31],[72,-21]],
    edges: [[[-68,30],[-46,28],[-27,31]],[[-4,30],[18,32],[42,27]],[[64,28],[76,24],[74,14]]],
  },
  perpendicular: {
    outline: [[-75,-27],[-60,-33],[-38,-30],[-17,-34],[5,-31],[28,-33],[52,-29],[69,-31],[78,-22],[74,-7],[79,8],[75,25],[62,31],[39,29],[18,34],[-4,31],[-24,34],[-48,30],[-67,32],[-78,23],[-75,9],[-80,-7]],
    patches: [[[-71,-23],[-40,-29],[-18,-16],[-25,3],[-60,20],[-74,13]],[[25,-27],[57,-25],[74,-17],[72,3],[46,9],[21,-4]]],
    rows: [[-63,63,-23,.7,2.2,.7],[-68,67,-11,-1.5,2.7,.85],[-65,69,1,1.2,3,.95],[-67,63,13,-.8,2.5,.8],[-57,58,25,1,1.8,.6]],
    clods: [[-71,16,.8],[-48,-29,.65],[11,31,.7],[66,-23,.55],[72,20,.85]],
    turf: [[-70,-26],[24,32],[75,9]],
    edges: [[[-73,-26],[-78,-8],[-74,8]],[[-75,13],[-77,23],[-66,31]],[[-63,31],[-47,29],[-26,33]]],
  },
} as const satisfies Record<'front' | 'perpendicular', SoilStudy>;

const GROUND_ORIGIN = { x: 0, y: 0 };
const ORIGINAL_PLANTING_ROWS: readonly PlantingRow[] = [
  [-67,67,-23,-1,2,1.1],[-67,67,-11,-1,2,1.1],[-67,67,1,-1,2,1.1],
  [-67,67,13,-1,2,1.1],[-67,67,25,-1,2,1.1],
];

/** All three independent patches reuse the existing world mount and yard editing contract. */
export function TilledGardenPlot({ theme }: { theme: YorkshireSceneTheme }) {
  return <>{TILLED_PLOT_IDS.map(objectId => <TilledPlot key={objectId} objectId={objectId} theme={theme} />)}</>;
}

/** A freshly turned patch with shallow furrows and a torn turf edge, on the ground rather than a raised bed. */
function TilledPlot({ theme, objectId }: { theme: YorkshireSceneTheme; objectId: TilledPlotId }) {
  const id = 'tilled-soil-' + useId().replace(/:/g, '');
  const p = soilPalette(theme);
  const anchor = TILLED_PLOTS[objectId];
  const placement = useYardPlacement(objectId);
  const study: SoilStudy | null = anchor.plotView === 'original' ? null : SOIL_STUDIES[anchor.plotView];
  const heading = anchor.heading + placement.angle;
  // Only the projection is shared. Each study owns its contour, ridges and broken edges.
  // Upright relief and light offsets are applied after rotation, in scene space.
  const groundPoint = (u: number, v: number, height = 0) => {
    u *= (placement.length ?? 100) / 100;
    v *= (placement.width ?? 100) / 100;
    const ground = rotateGroundPoint({ x: u - .8 * v, y: .285 * (u + v) }, GROUND_ORIGIN, heading);
    return { x: ground.x, y: ground.y - height };
  };
  const point = (u: number, v: number, height = 0) => {
    const ground = groundPoint(u, v, height);
    return `${ground.x},${ground.y}`;
  };
  const crop = placement.crop;
  const rows = study?.rows ?? ORIGINAL_PLANTING_ROWS;
  const plants = crop ? gardenPlantingSlots(rows,
    placement.length ?? 100, placement.width ?? 100, crop, placement.cropDensity ?? 'normal')
    .map((slot, index) => ({ ...slot, index, root: groundPoint(slot.u, slot.v, slot.rise) }))
    .sort((a,b) => a.root.y - b.root.y || a.root.x - b.root.x) : [];
  const clearOfRoots = (u:number,v:number) => !plants.some(plant =>
    Math.hypot((u-plant.u)*(placement.length??100)/100,(v-plant.v)*(placement.width??100)/100)<5);
  const polygon = (points: readonly (readonly [number, number])[]) => 'M' + points.map(p => point(...p)).join(' L') + 'Z';
  const boundary = study?.outline ?? OUTLINE;
  // Rounded torn turf, rather than a sequence of straight saw-tooth cuts.
  const midpoint = (a: SoilPoint,b: SoilPoint): SoilPoint => [(a[0]+b[0])/2,(a[1]+b[1])/2];
  const outline = 'M'+point(...midpoint(boundary.at(-1)!,boundary[0]))+boundary.map((p,i) =>
    ` Q${point(...p)} ${point(...midpoint(p,boundary[(i+1)%boundary.length]))}`).join('')+'Z';
  const turfBites: readonly (readonly SoilPoint[])[] = [
    [[-81,-17],[-77,-16],[-74.3,-14],[-77,-12.5],[-81,-12]],
    [[-40,-37],[-36,-31],[-30,-28],[-27,-34],[-25,-37]],
    [[16,37],[20,31],[25,28],[29,34],[32,37]],
    [[81,9],[75,11],[71,15],[77,18],[82,18]],
    [[-61,36],[-58,31],[-55,29],[-51,34],[-48,36]],
  ];
  const bitePath = (points: readonly SoilPoint[]) => 'M'+point(...points[0])+points.slice(1).map((p,i) =>
    ` Q${point(...midpoint(points[i],p))} ${point(...p)}`).join('')+'Z';
  const turfCutPaths=turfBites.map((bite,i)=>i===0
    ? `M${point(-81,-17)} C${point(-78,-17)} ${point(-76.3,-16)} ${point(-75.6,-15.4)} C${point(-73.9,-14.8)} ${point(-74.1,-13.3)} ${point(-76.1,-12.9)} Q${point(-79,-12)} ${point(-81,-12)}Z`
    : bitePath(bite));
  return <YardObject id={objectId}>
    <g id={objectId === 'tilled_plot' ? 'tilled-garden-plot' : `tilled-garden-plot-${anchor.plotView}`}
      transform={`translate(${anchor.x} ${anchor.y})`} data-material="turned-soil" data-plot-view={anchor.plotView}
      pointerEvents="none" aria-hidden="true" data-soil-edge="soft">
      <defs>
        <clipPath id={`${id}-clip`}><path d={outline} /></clipPath>
        <>
          <filter id={`${id}-edge-fade`} x="-6%" y="-20%" width="112%" height="140%" colorInterpolationFilters="sRGB">
            <feMorphology in="SourceGraphic" operator="erode" radius=".35" result="inset" />
            <feTurbulence type="fractalNoise" baseFrequency=".075 .13" numOctaves="2" seed="39" result="edge-noise" />
            <feDisplacementMap in="inset" in2="edge-noise" scale="1.65" xChannelSelector="R" yChannelSelector="G" result="torn-edge" />
            <feGaussianBlur in="torn-edge" stdDeviation=".45" />
          </filter>
          <filter id={`${id}-turf-cut-fade`} x="-20%" y="-80%" width="140%" height="260%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency=".16 .35" numOctaves="2" seed="61" result="cut-noise" />
            <feDisplacementMap in="SourceGraphic" in2="cut-noise" scale=".95" xChannelSelector="R" yChannelSelector="G" result="torn-cut" />
            <feGaussianBlur in="torn-cut" stdDeviation=".28" />
          </filter>
          <filter id={`${id}-soil-fringe`} x="-6%" y="-20%" width="112%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation=".65" />
          </filter>
        </>
        <mask id={`${id}-turf-edge`} maskUnits="userSpaceOnUse" x="-1000" y="-1000" width="2000" height="2000" style={{maskType:'luminance'}}>
          {/* Fade the actual surface inward as well as its low-opacity outer soil fringe. */}
          <path d={outline} fill="white" filter={`url(#${id}-edge-fade)`} />
          <>
            {/* Restore actual edge areas at turf cuts; these are patches, not a continuous sharp frame. */}
            <path d={polygon([[-84,-37],[-62,-37],[-62,-23],[-84,-23]])} fill="white" />
            <path d={polygon([[-66,26],[-48,26],[-48,39],[-66,39]])} fill="white" />
            <path d={polygon([[-25,27],[2,27],[2,40],[-25,40]])} fill="white" />
            <path d={polygon([[69,11],[84,11],[84,23],[69,23]])} fill="white" />
          </>
          {turfCutPaths.map((d,i) => <path key={i} d={d} fill="black"
            filter={`url(#${id}-turf-cut-fade)`} />)}
        </mask>
      </defs>
      {/* Only selected loose-soil stretches bleed out; no full-outline brown halo. */}
      <g fill={p.earth} opacity=".11" filter={`url(#${id}-soil-fringe)`}>
        <path d={bitePath([[-55,-32],[-44,-33],[-30,-32],[-18,-32],[-20,-30],[-43,-30]])} />
        <path d={bitePath([[74,-11],[77,-4],[77,3],[74,8],[73,0],[73,-7]])} />
        <path d={bitePath([[35,29],[47,28],[61,29],[65,30],[53,31],[40,31]])} />
      </g>
      {/* The broken silhouette and a few crumbs merge with the surrounding turf without a raised rim. */}
      <g mask={`url(#${id}-turf-edge)`}>
      <path data-soil-surface="" d={outline} fill={p.earth} />
      <g clipPath={`url(#${id}-clip)`}>
        <path d={polygon(study?.patches[0] ?? [[-80,-32],[-22,-32],[-10,-13],[-33,12],[-74,23]])} fill={p.patch} opacity=".38" />
        <path d={polygon(study?.patches[1] ?? [[14,-34],[74,-27],[76,30],[38,31],[22,13],[34,-10]])} fill={p.clod} opacity=".18" />
        {rows.map(([start,end,v,bend,shoulder,rise], i) => {
          // Use the exact planting centreline and root height, even on curved, resized rows.
          const at = (t:number,cross=0,height=rise*.5) => point(start+(end-start)*t, v+2*(1-t)*t*bend+cross, height);
          const ranges = i%2 ? [[.01,.49],[.54,.98]] : [[.02,.34],[.39,.76],[.8,.97]];
          // Three hand-placed, staggered changes per plot, away from occupied roots.
          const sculptAt=i===0 ? .23 : i===2 ? .67 : i===4 ? .42 : -1;
          const sculptU=start+(end-start)*sculptAt;
          const sculptV=v+2*(1-sculptAt)*sculptAt*bend;
          const canSculpt=sculptAt>0 && !plants.some(plant=>
            Math.hypot((sculptU-plant.u)*(placement.length??100)/100,(sculptV-plant.v)*(placement.width??100)/100)<8);
          return <g key={i} data-soil-row={i}>
            {ranges.map(([a,b],j) => {
              const mid=(a+b)/2, span=b-a, w=shoulder*(j===1 ? 1.3 : 1.05);
              return <g key={j}>
                {/* A settled groove and a broad dry shoulder, with unequal breaks and soft ends. */}
                <path d={`M${at(a+.025,w+.4,0)} Q${at(mid-.025,w+1.6,0)} ${at(b-.04,w+.3,0)} Q${at(mid+.03,w+.65,0)} ${at(a+.025,w+.4,0)}Z`}
                  fill={p.trough} opacity=".28" />
                <path d={`M${at(a,0)} Q${at(a+span*.12,-w*.65)} ${at(a+span*.24,-w*.55)} Q${at(a+span*.27,-w*1.18)} ${at(a+span*.38,-w*.83)} Q${at(mid,-w*1.05)} ${at(mid+span*.12,-w*.63)} Q${at(b-span*.14,-w*.98)} ${at(b,.1)} Q${at(mid+span*.12,w*.95)} ${at(mid,w*.48)} Q${at(a+span*.2,w*.94)} ${at(a,0)}Z`}
                  fill={p.ridge} opacity={.3+(i+j)%3*.04} />
                {/* A broken earth-colour bite merges the shoulder back into the base, not a bright pebble. */}
                {(i+j)%2===0 && <path d={`M${at(mid-span*.08,-w*1.2)} Q${at(mid+span*.02,-w*.22)} ${at(mid+span*.13,-w*.55)} L${at(mid+span*.2,-w*1.3)}Z`} fill={p.earth} opacity=".8" />}
                {canSculpt && sculptAt>a && sculptAt<b && <g data-soil-sculpt={i}>
                  {/* A low wide shoulder, its short dark underside, and an offset settled gap. */}
                  <path d={`M${at(sculptAt-.065,0)} Q${at(sculptAt-.035,-w*1.65,rise*.5+.25)} ${at(sculptAt+.025,-w*1.15,rise*.5+.25)} Q${at(sculptAt+.065,-w*.9)} ${at(sculptAt+.08,.2)} Q${at(sculptAt+.01,w*.5)} ${at(sculptAt-.065,0)}Z`}
                    fill={p.ridge} opacity=".42" />
                  <path d={`M${at(sculptAt-.045,w*.55,0)} Q${at(sculptAt+.005,w*1.25,0)} ${at(sculptAt+.05,w*.7,0)} Q${at(sculptAt+.015,w*.85,0)} ${at(sculptAt-.045,w*.55,0)}Z`}
                    fill={p.trough} opacity=".25" />
                  <path d={`M${at(sculptAt+.055,-w*1.35)} Q${at(sculptAt+.073,-w*.18)} ${at(sculptAt+.103,-w*.45)} L${at(sculptAt+.12,-w*1.2)}Z`}
                    fill={p.earth} opacity=".85" />
                </g>}
              </g>;
            })}
          </g>;
        })}
        {/* Only two turned-up patches at irregular ridge ends; most of the surface stays quiet. */}
        {(study?.clods ?? [[-70,-17,1],[-51,30,.8],[9,-30,.75],[71,8,.9],[53,31,.7],[-74,17,.65]])
          .filter((_,i)=>i===0 || i===3)
          .filter(([u,v])=>clearOfRoots(u,v))
          .map(([u,v,size],i)=><g key={i} transform={`translate(${point(u,v)}) scale(${size*.85})`}>
            <SoilAggregate palette={p} variant={i} />
            <path d={i===0 ? 'M1,.6 Q4,-1.2 5.2,.5 L3.1,1.1Z' : 'M-5,.4 Q-3.7,-.9 -2.4,.2 L-3,1Z'} fill={p.clod} opacity=".55" />
          </g>)}
        {study?.edges.map((edge, i) => <path key={i} d={'M' + edge.map(([u,v]) => point(u,v)).join(' L')}
          transform="translate(.25 .45)" fill="none" stroke={p.trough} strokeWidth=".6" strokeLinecap="round" opacity=".23" />)}
      </g>
      </g>
      {/* One incomplete spill adjoining a turf break, rather than repeated dots around the perimeter. */}
      <g transform={`translate(${point(anchor.plotView==='perpendicular' ? -75 : 74,anchor.plotView==='perpendicular' ? -27 : 28)})`}>
        <g transform="scale(.65)"><SoilAggregate palette={p} variant={1} /></g>
        <path d="M2.2,1 Q3.1,.2 4,.8 L3.5,1.4Z" fill={p.clod} opacity=".65" />
      </g>
      <g id={`${id}-turf`}>
        <style>{meadowPlantPaletteCss(theme, '#' + id + '-turf')}</style>
        <g transform={`translate(${point(...(study?.turf[0] ?? [-76,25] as const))})`}><Grass type="short" scale={.18} flip /></g>
        <g transform={`translate(${point(...(study?.turf[1] ?? [47,33] as const))})`}><Grass type="woven" scale={.14} /></g>
        <g transform={`translate(${point(...(study?.turf[2] ?? [70,-31] as const))})`}><Grass type="short" scale={.13} /></g>
        {/* A few real upright blades overlie the cuts; the gaps reveal the actual lawn colour. */}
        {turfBites.slice(0,4).map((bite,i) => <g key={i} transform={`translate(${point(...bite[2])})`}>
          <Grass type="short" scale={i%2 ? .095 : .12} flip={i%2===0} />
        </g>)}
      </g>
      {/* Plants sit outside the soil clip: roots attach to ridges, foliage grows upright. */}
      {crop && <g id={`${id}-plants`} data-plot-crops={crop} data-plant-count={plants.length}>
        <>
          {/* Replace legacy root ellipses on every plot, avoiding doubled shadows. */}
          <style>{`#${id}-plants [data-crop-ground-shadow]{display:none}`}</style>
          <g data-plot-contact-shadows="layered">
            {plants.map(plant=><g key={plant.index} transform={`translate(${plant.root.x} ${plant.root.y})`}>
              <GardenCropContactShadow crop={crop} color={p.trough} variation={plant.variation} />
            </g>)}
          </g>
        </>
        {plants.map(plant => <g key={plant.index} transform={`translate(${plant.root.x} ${plant.root.y})`}>
          <GardenVegetable crop={crop} theme={theme} variation={plant.variation} />
          <path d="M-1.4,.2 Q-.5,-.6 .3,-.3 Q1.1,-.6 1.6,.3 Q.1,.8 -1.4,.2Z" fill={p.earth} opacity=".85" />
        </g>)}
      </g>}
    </g>
  </YardObject>;
}
