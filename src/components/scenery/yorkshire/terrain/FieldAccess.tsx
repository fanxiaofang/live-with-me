import { memo, useId } from 'react';
import { FIELD_ACCESS, FIELD_ACCESS_BANK, FIELD_ACCESS_WASH, fieldAccessPoint } from '../../../../world/scene/fieldAccess';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { MeadowWearPatch } from '../dressing/MeadowWearPatch';

/** Foreground-owned wear through a clear lawn corridor. Overlap is restricted to
 * the soil foot; no rigid path tries to bridge the two camera transforms. */
export const FieldAccess = memo(function FieldAccess({ theme }: { theme: YorkshireSceneTheme }) {
  const id = 'field-access-' + useId().replace(/:/g, '');
  const soil = theme.isNight ? '#68694e' : theme.isRainy ? '#9b9269' : theme.timeOfDay === 'dusk' ? '#b2a176' : '#bcb180';
  // The old global road palette becomes almost black at dusk/night. This longer
  // exposed path needs soil close to the current meadow, while reusing entry wear.
  const wearTheme = {
    roadColor: theme.isNight ? '#68715a' : theme.isRainy ? '#8b8964' : theme.timeOfDay === 'dusk' ? '#a39771' : theme.roadColor,
    hillGreenFar: theme.isNight ? '#5f6e50' : theme.hillGreenFar,
  };
  return <g id={id} data-field-access="" data-access-owner="meadow" pointerEvents="none" aria-hidden="true">
    <defs>
      <linearGradient id={id + '-bank'} x1="0" y1={FIELD_ACCESS.foot.y - 2} x2="0" y2={FIELD_ACCESS.foot.y + 10} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={soil} stopOpacity="0" />
        <stop offset=".4" stopColor={soil} stopOpacity=".38" />
        <stop offset=".75" stopColor={soil} stopOpacity=".2" />
        <stop offset="1" stopColor={soil} stopOpacity="0" />
      </linearGradient>
      <linearGradient id={id + '-trail'} x1={FIELD_ACCESS.start.x} y1={FIELD_ACCESS.start.y} x2={FIELD_ACCESS.foot.x} y2={FIELD_ACCESS.foot.y} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={wearTheme.roadColor} stopOpacity="0" />
        <stop offset=".18" stopColor={wearTheme.roadColor} stopOpacity=".16" />
        <stop offset=".8" stopColor={wearTheme.roadColor} stopOpacity=".24" />
        <stop offset="1" stopColor={soil} stopOpacity=".13" />
      </linearGradient>
    </defs>
    <path data-access-bank="" data-access-mouth="worn-opening" d={FIELD_ACCESS_BANK} fill={`url(#${id}-bank)`} />
    <path data-access-trail="" d={FIELD_ACCESS_WASH} fill={`url(#${id}-trail)`} />
    {[.09, .17, .26, .35, .43, .52, .61, .69, .77, .84, .91, .97].map((t, i) => {
      const p = fieldAccessPoint(t);
      return <MeadowWearPatch key={t} id={`${id}-scuff-${i}`} theme={wearTheme} variant="scuff"
        transform={`translate(${p.x} ${p.y}) rotate(${p.angle}) scale(${.55 - t * .19} ${p.halfWidth / 12})`}
        opacity={.65 + t * .25} />;
    })}
  </g>;
});
