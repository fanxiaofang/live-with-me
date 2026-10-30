import { memo, useId, useLayoutEffect, useRef, useState } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { Grass, Plant } from './MeadowVegetationAssets';
import { meadowPlantPaletteCss } from './meadowPalette';
import { MEADOW_STUDY, nearPlantAnchors } from './meadowStudy';

/** Two small rooted clumps, cropped by the real world viewport, never a screen overlay. */
export const NearMeadowPlants = memo(function NearMeadowPlants({ theme }: { theme: YorkshireSceneTheme }) {
  const ref = useRef<SVGGElement>(null);
  const id = 'near-meadow-' + useId().replace(/:/g, '');
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const svg = ref.current?.ownerSVGElement;
    if (!svg) return;
    const measure = () => {
      const { width, height } = svg.getBoundingClientRect();
      setSize(old => old.width === width && old.height === height ? old : { width, height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);
  const anchors = nearPlantAnchors(size.width, size.height);
  const plume = theme.isNight ? '#879987' : theme.isRainy ? '#adb7a2' : '#c9cbb0';
  const stem = theme.isNight ? '#536344' : theme.isRainy ? '#6c8051' : '#87945c';
  return <g ref={ref} id={id} data-near-meadow-plants="" pointerEvents="none" aria-hidden="true">
    <style>{meadowPlantPaletteCss(theme, '#' + id)}</style>
    {size.width > 0 && <>
      <g data-near-clump="left" data-world-root={anchors.left.x + ',' + anchors.left.y}
        transform={'translate(' + anchors.left.x + ' ' + anchors.left.y + ') scale(' + (anchors.compact ? .76 : 1) + ')'}>
        <Grass type="meadow" x={-16} y={1} scale={.72} flip />
        <Grass type="leaning" x={29} y={7} scale={.85} />
        <Grass type="short" x={-48} y={4} scale={.55} />
        {MEADOW_STUDY.panicles.slice(0, anchors.compact ? 3 : 4).map(({ x, height, lean }, i) =>
          <g key={x} transform={'translate(' + x + ',0)'}>
            <path d={'M0,3 Q' + (lean * .25) + ',' + (-height * .5) + ' ' + lean + ',' + (-height)}
              fill="none" stroke={stem} strokeWidth=".85" />
            <g transform={'translate(' + lean + ',' + (-height) + ') rotate(' + (lean * 1.2) + ')'}>
              <path d="M0,4 C-4,0 -3,-8 0,-12 C3,-8 4,-1 0,4Z" fill={plume} fillOpacity={.7 + i * .04} />
              <path d="M-1,1 l-3,-3 M0,-3 l-3,-3 M1,0 l3,-3 M1,-5 l2,-3"
                stroke={plume} strokeOpacity=".65" strokeWidth=".6" fill="none" />
            </g>
          </g>)}
      </g>
      <g data-near-clump="right" data-world-root={anchors.right.x + ',' + anchors.right.y}
        transform={'translate(' + anchors.right.x + ' ' + anchors.right.y + ') scale(' + (anchors.compact ? .68 : .9) + ')'}>
        <Grass type="leaning" x={4} y={0} scale={.8} flip />
        <Grass type="woven" x={-29} y={-3} scale={.8} />
        <Grass type="short" x={37} y={2} scale={.65} />
        <g transform="translate(-21,-9) scale(.66)"><Plant species="daisy" /></g>
        {!anchors.compact && <g transform="translate(27,-3) scale(.49)"><Plant species="buttercup" /></g>}
      </g>
    </>}
  </g>;
});
