import React from 'react';
import { DEFAULT_SCENE_LAYOUT } from '../scene/sceneLayout';
import type { EntityId, SceneLayout } from '../scene/sceneTypes';

type Props = Omit<React.SVGProps<SVGGElement>, 'transform'> & { entityId: EntityId; layout?: SceneLayout };

/** The sole executor of building placement; asset geometry stays local. */
export const SceneEntity = React.forwardRef<SVGGElement, Props>(function SceneEntity(
  { entityId, layout = DEFAULT_SCENE_LAYOUT, children, ...props }, ref,
) {
  const { position, scale } = layout[entityId];
  return <g {...props} ref={ref} data-entity={entityId}
    transform={`translate(${position.x}, ${position.y}) scale(${scale})`}>{children}</g>;
});
