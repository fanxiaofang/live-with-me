import React from 'react';
import type { TimeOfDay } from '../../types';

/** One light response for all cottage timber. Day preserves the approved base.
 * Dusk warms the lit colours; night lowers light while retaining brown chroma. */
const timberLight = {
  day: { gain: [1, 1, 1], lift: [0, 0, 0] },
  dusk: { gain: [.98, .91, .81], lift: [6, 3, 2] },
  // The interior retains warm ambient light after sunset, even away from lamps.
  night: { gain: [.82, .80, .78], lift: [4, 3, 3] },
};
export function timberColor(hex: string, time: TimeOfDay = 'day'): string {
  if (time === 'day') return hex;
  const light = timberLight[time];
  return '#' + [1, 3, 5].map((start, i) => Math.max(0, Math.min(255,
    Math.round(parseInt(hex.slice(start, start + 2), 16) * light.gain[i] + light.lift[i])
  )).toString(16).padStart(2, '0')).join('');
}

const woodBases = {
  honey: { wood: '#86562f', woodShade: '#55351e', woodLight: '#ad7b49', endGrain: '#9b693d', dark: '#3d2818' },
  left: { wood: '#734c2f', woodShade: '#4a301e', woodLight: '#9e6c46', endGrain: '#8c5d39', dark: '#422918' },
  right: { wood: '#613e25', woodShade: '#3a2416', woodLight: '#855938', endGrain: '#754b2d', dark: '#362012' },
};
export function timberMaterial(time: TimeOfDay, kind: keyof typeof woodBases = 'honey') {
  const base = woodBases[kind];
  return { wood: timberColor(base.wood, time), woodShade: timberColor(base.woodShade, time),
    woodLight: timberColor(base.woodLight, time), endGrain: timberColor(base.endGrain, time),
    dark: timberColor(base.dark, time) };
}


/** Original cottage hardwood. Geometry stays local; both floors share the finish. */
export const timberPlankTones = [
    { fill: '#784a27', opacity: 0.16 },
    { fill: '#6c3f1e', opacity: 0.20 },
    { fill: '#83512c', opacity: 0.14 },
    { fill: '#663b1a', opacity: 0.22 },
    { fill: '#7b4c28', opacity: 0.16 },
    { fill: '#86542f', opacity: 0.12 },
    { fill: '#6a3e1d', opacity: 0.19 },
    { fill: '#744624', opacity: 0.15 },
    { fill: '#804f2a', opacity: 0.14 },
    { fill: '#633818', opacity: 0.24 },
    { fill: '#794a26', opacity: 0.16 },
    { fill: '#84522d', opacity: 0.13 },
    { fill: '#6d401f', opacity: 0.18 },
    { fill: '#774725', opacity: 0.15 },
    { fill: '#653a19', opacity: 0.21 },
    { fill: '#7e4d28', opacity: 0.14 },
  ];

export const timberSeam = { stroke: '#2a1609', strokeWidth: .75, opacity: .45 };
export const timberJoint = { stroke: '#241207', strokeWidth: .8, opacity: .45 };
const finishes = {
  surface: [['0%', '#8c582f'], ['35%', '#7b4b26'], ['70%', '#693d1d'], ['100%', '#552f14']],
  // Slightly lighter warm timber upstairs, with the same stops and layering.
  loftSurface: [['0%', '#9b6539'], ['35%', '#8b582f'], ['70%', '#784926'], ['100%', '#633a1d']],
  left: [['0%', '#673d1c'], ['100%', '#482711']],
  right: [['0%', '#543015'], ['100%', '#361c0a']],
};
export function TimberFinishGradient({ id, face = 'surface', time = 'day' }: { id: string; face?: keyof typeof finishes; time?: TimeOfDay }) {
  return <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
    {finishes[face].map(([offset, color]) => <stop key={offset} offset={offset} stopColor={timberColor(color, time)} />)}
  </linearGradient>;
}

/** Two quiet, broken grain traces per floor, never a repeated knot on every board. */
export function SparseTimberGrain({ paths, time = 'day' }: { paths: readonly [string, string]; time?: TimeOfDay }) {
  return <>
    <path d={paths[0]} stroke={timberColor("#3d210f", time)} strokeWidth=".6" strokeDasharray="40 18 60 25" opacity=".12" fill="none" />
    <path d={paths[1]} stroke={timberColor("#2d160a", time)} strokeWidth=".5" strokeDasharray="50 30 70 20" opacity=".1" fill="none" />
  </>;
}
