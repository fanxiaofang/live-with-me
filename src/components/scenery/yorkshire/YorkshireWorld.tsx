import React from 'react';
import { YorkshireCommonProps, CommunicationHillProps } from './landscapeTypes';
import { TerrainSilhouette } from './terrain/TerrainSilhouette';
import { TerrainMass } from './terrain/TerrainMass';
import { RiverValley } from './terrain/RiverValley';
import { HouseTerrace } from './terrain/HouseTerrace';
import { PastureFields } from './parcels/PastureFields';
import { DrystoneWalls } from './boundaries/DrystoneWalls';
import { RailwayLandscape } from './infrastructure/RailwayLandscape';
import { FarmsteadLandscape } from './infrastructure/FarmsteadLandscape';
import { CommunicationHill } from './infrastructure/CommunicationHill';
import { YorkshireDressing } from './dressing/YorkshireDressing';
import { YorkshireDefs } from './landscapeTheme';
import { DEBUG_TERRAIN } from './landscapeLayout';

export interface YorkshireWorldProps extends YorkshireCommonProps {
  /** Optional communication hill props for interactive room navigation & alien signals */
  communicationProps?: Partial<CommunicationHillProps>;
  /** Whether to render the house terrace (disable if house group renders it locally) */
  renderHouseTerrace?: boolean;
  /** Whether to render the foreground dressing (disable if foreground renders it locally) */
  renderDressing?: boolean;
}

/**
 * 🌿 YorkshireWorld
 *
 * Central Yorkshire Scenery Architecture Orchestrator.
 * Combines the 6 semantic layers:
 * 01 TERRAIN SILHOUETTE
 * 02 TERRAIN MASS & RIVER VALLEY
 * 03 LAND PARCELS
 * 04 BOUNDARIES
 * 05 INFRASTRUCTURE
 * 06 DRESSING
 */
export const YorkshireWorld: React.FC<YorkshireWorldProps> = ({
  theme,
  onTriggerToast,
  setHoveredObject,
  communicationProps,
  renderHouseTerrace = false,
  renderDressing = true,
  className,
}) => {
  return (
    <g id="yorkshire-world" className={className}>
      <YorkshireDefs theme={theme} />

      {/* 01 TERRAIN SILHOUETTE */}
      <TerrainSilhouette theme={theme} />

      {/* 05 INFRASTRUCTURE (A: Viaduct Railway) */}
      <RailwayLandscape theme={theme} />

      {/* 02 TERRAIN MASS */}
      <TerrainMass theme={theme} />

      {/* 02 TERRAIN: River Valley */}
      <RiverValley
        theme={theme}
        onTriggerToast={onTriggerToast}
        setHoveredObject={setHoveredObject}
      />

      {/* 03 LAND PARCELS */}
      <PastureFields theme={theme} />

      {/* 04 BOUNDARIES */}
      <DrystoneWalls
        theme={theme}
        onTriggerToast={onTriggerToast}
        setHoveredObject={setHoveredObject}
      />

      {/* 05 INFRASTRUCTURE (B: Farmstead & C: Communication Hill) */}
      <FarmsteadLandscape
        theme={theme}
        setHoveredObject={setHoveredObject}
      />

      <CommunicationHill
        theme={theme}
        setHoveredObject={setHoveredObject}
        {...communicationProps}
      />

      {/* 02 TERRAIN: House Terrace (if rendered globally) */}
      {renderHouseTerrace && (
        <HouseTerrace
          theme={theme}
          onTriggerToast={onTriggerToast}
          setHoveredObject={setHoveredObject}
        />
      )}

      {/* 06 DRESSING (Swaledale Sheep Flock & Flora) */}
      {renderDressing && (
        <YorkshireDressing
          theme={theme}
          onTriggerToast={onTriggerToast}
          setHoveredObject={setHoveredObject}
        />
      )}

      {/* DEBUG: Global terrain boundary overlay */}
      {DEBUG_TERRAIN && (
        <g id="debug-yorkshire-world" pointerEvents="none">
          <rect x="-2400" y="0" width="6000" height="2400" fill="none" stroke="#ff00ff" strokeWidth="2" strokeDasharray="10 5" opacity="0.3" />
          <text x="0" y="30" fill="#ff00ff" fontSize="14" textAnchor="middle" opacity={0.6}>
            DEBUG_TERRAIN ACTIVE
          </text>
        </g>
      )}
    </g>
  );
};

export {
  TerrainSilhouette,
  TerrainMass,
  RiverValley,
  HouseTerrace,
  PastureFields,
  DrystoneWalls,
  RailwayLandscape,
  FarmsteadLandscape,
  CommunicationHill,
  YorkshireDressing,
};
