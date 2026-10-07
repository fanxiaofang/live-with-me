import React from 'react';
import type { CommunicationHillProps } from '../landscapeTypes';
import { ObservatoryHaven } from '../../../architecture/ObservatoryHaven';
import { SceneEntity } from '../../../../world/render/SceneEntity';

/** Compatibility entry; the production-derived station is the only asset. */
export function CommunicationHill({ activeRoom, onSelectRoom, onSelectPerson, presenceSlots,
  alienPulseEffect, triggerAlienSignal, hasMovedRef, setHoveredObject, className }: CommunicationHillProps) {
  return <SceneEntity id="room-observatory" entityId="observatory" className={`group/observatory ${className ?? ''}`}
    onClick={() => { if (!hasMovedRef?.current) onSelectRoom?.('observatory'); }}
    onMouseEnter={() => setHoveredObject?.({ kind: 'room', id: 'observatory' })} onMouseLeave={() => setHoveredObject?.(null)}>
    <ObservatoryHaven activeRoom={activeRoom === 'observatory' ? 'observatory' : undefined}
      presenceSlots={presenceSlots ?? {}} alienPulseEffect={alienPulseEffect}
      triggerAlienSignal={triggerAlienSignal ?? (() => {})} onSelectPerson={onSelectPerson ?? (() => {})}
      setHoveredObject={setHoveredObject ?? (() => {})} />
  </SceneEntity>;
}
