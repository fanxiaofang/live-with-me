import React, { useId } from 'react';
import type { YorkshireSceneTheme } from '../scenery/yorkshire/landscapeTypes';
import type { SceneLayout } from '../../world/scene/sceneTypes';
import { RoofRuneEngravings } from './RoofRuneEngravings';

const center = { x: 35, y: -76 };
const loftDeck = 'M-150,-67.25 L-116,-78.1 L-88,-86.2 L-54,-96.8 L-27,-104.1 L0,-112 L28,-104.1 L54,-96 L90,-85.8 L125,-74.375 L-25,-31.625 Z';

// Map the engraving's local axes onto the loft's two plank-plane directions.
const floorWardPoint = (angle: number, t: number) => {
  const along = (angle - Math.PI * 1.5) * 100;
  const across = (t - .5) * 100;
  return {
    x: center.x + along - across,
    y: center.y + (along + across) * .285,
  };
};

/** The Venus flower is engraved directly into the loft boards and moves as one yard object. */
export function CottageVenusFloorWard({ theme, layout }: { theme: YorkshireSceneTheme; layout: SceneLayout }) {
  const clipId = `cottage-loft-venus-${useId().replace(/:/g, '')}`;
  const { position, scale } = layout.main_cottage;
  return <g id="cottage-loft-venus-ward"
    transform={`translate(${position.x} ${position.y}) scale(${scale})`}
    pointerEvents="none" data-ward-material="loft-timber">
    <defs>
      <clipPath id={clipId}><path d={loftDeck} /></clipPath>
    </defs>
    <RoofRuneEngravings variant="venus-flower" material="timber" radius={9}
      project={floorWardPoint} clipId={clipId} night={!!theme.isNight} dusk={theme.timeOfDay === 'dusk'} />
  </g>;
}
