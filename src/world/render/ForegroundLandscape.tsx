import React from 'react';
import { YorkshireDressing } from '../../components/scenery/yorkshire';
import type { YorkshireSceneTheme } from '../../components/scenery/yorkshire/landscapeTypes';
import type { HoverTarget } from '../interactions/interactionTypes';
export interface ForegroundLandscapeProps {
  theme: YorkshireSceneTheme;
  setHoveredObject: HoverTarget;
  onTriggerToast?: (message: string) => void;
}
function ForegroundLandscapeAsset({ theme, setHoveredObject, onTriggerToast }: ForegroundLandscapeProps) {
  return <><g id="foreground-meadow-elements">
            {/* 🌟 06 DRESSING: Swaledale Sheep Flock & Meadow Elements */}
            <YorkshireDressing
              theme={theme}
              onTriggerToast={onTriggerToast}
              setHoveredObject={setHoveredObject}
            />

            {/* 稀疏雅致的微型草花点缀（仅附着于小径旁，下方大面积纯净草坪全部留白） */}
            <g id="pasture-wildflowers" opacity="0.8">
              {[
                { x: 380, y: 535 }, { x: 440, y: 545 }, { x: 500, y: 530 }
              ].map((f, i) => (
                <circle key={`pbf-${i}`} cx={f.x} cy={f.y} r={2.0} fill="#facc15" />
              ))}
              {[
                { x: 340, y: 520 }, { x: 470, y: 540 }
              ].map((f, i) => (
                <g key={`pdf-${i}`}>
                  <circle cx={f.x} cy={f.y} r={2.2} fill="#ffffff" />
                  <circle cx={f.x} cy={f.y} r={0.8} fill="#eab308" />
                </g>
              ))}
            </g>
          </g>
  </>;
}

export const ForegroundLandscape = React.memo(ForegroundLandscapeAsset);
