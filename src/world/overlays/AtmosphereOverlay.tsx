import React from 'react';
import type { YorkshireSceneTheme } from '../../components/scenery/yorkshire/landscapeTypes';
export interface AtmosphereOverlayProps {
  theme: YorkshireSceneTheme;
}
export function AtmosphereOverlay({ theme }: AtmosphereOverlayProps) {
  return <>      {theme.isNight && (
        <div className="absolute inset-0 pointer-events-none opacity-85">
          <div className="absolute top-[8%] left-[20%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white] animate-pulse" />
          <div className="absolute top-[14%] left-[35%] w-1 h-1 bg-[#fffbe6] rounded-full" />
          <div className="absolute top-[6%] left-[65%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
          <div className="absolute top-[16%] left-[78%] w-1.5 h-1.5 bg-[#d6ebff] rounded-full animate-ping" />
          <div className="absolute top-[8%] right-[14%] w-12 h-12 rounded-full border-t-2 border-r-2 border-[#fff3d4] shadow-[0_0_24px_#ffeaa7] -rotate-45" />
        </div>
      )}

      {/* Rainy Atmosphere Streaks */}
      {theme.isRainy && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-60">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="rainPattern" width="80" height="80" patternUnits="userSpaceOnUse">
                <line x1="20" y1="0" x2="10" y2="40" stroke="#b2d8f0" strokeWidth="1.2" strokeOpacity="0.5" />
                <line x1="60" y1="20" x2="50" y2="60" stroke="#a2cee8" strokeWidth="1.4" strokeOpacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rainPattern)" className="animate-[pulse_1.5s_infinite]" />
          </svg>
        </div>
      )}


  </>;
}
