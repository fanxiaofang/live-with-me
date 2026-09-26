/**
 * Yorkshire Landscape Scenery Module
 *
 * Refactored into a layered spatial architecture in `src/components/scenery/yorkshire/`:
 * 01 TERRAIN SILHOUETTE (TerrainSilhouette)
 * 02 TERRAIN MASS (TerrainMass, RiverValley, HouseTerrace)
 * 03 LAND PARCELS (PastureFields)
 * 04 BOUNDARIES (DrystoneWalls)
 * 05 INFRASTRUCTURE (RailwayLandscape, FarmsteadLandscape, CommunicationHill)
 * 06 DRESSING (YorkshireDressing)
 *
 * This file maintains 100% backward compatibility for all prior imports.
 */

import React from 'react';
import {
  RiverValley,
  HouseTerrace,
  PastureFields,
  DrystoneWalls as BoundariesDrystoneWalls,
  YorkshireDressing,
} from './yorkshire';
import { YorkshireCommonProps } from './yorkshire/landscapeTypes';

export * from './yorkshire';

// Backward compatibility aliases
export const YorkshireRiverBeck = RiverValley;
export const YorkshireStoneBastion = HouseTerrace;
export const YorkshireSheepFlock = YorkshireDressing;

/**
 * Composite backward compatibility component for YorkshireDrystoneWalls
 * Combines Land Parcels (03) and Boundaries (04)
 */
export const YorkshireDrystoneWalls: React.FC<YorkshireCommonProps> = (props) => {
  return (
    <g id="yorkshire-pasture-fields-and-walls">
      <PastureFields {...props} />
      <BoundariesDrystoneWalls {...props} />
    </g>
  );
};
