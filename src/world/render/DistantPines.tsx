import React from 'react';

export interface DistantPinesProps {

}
function DistantPinesAsset({  }: DistantPinesProps) {
  return <><g id="mountain-ridge-pines" opacity="0.85">
              <g transform="translate(820, 165)">
                <polygon points="0,0 8,-20 16,0" fill="#294833" />
                <polygon points="2,-12 8,-28 14,-12" fill="#355e42" />
                <line x1="8" y1="0" x2="8" y2="6" stroke="#2b2018" strokeWidth="2" />
              </g>
              <g transform="translate(945, 110)">
                <polygon points="0,0 7,-18 14,0" fill="#294833" />
                <polygon points="2,-10 7,-24 12,-10" fill="#355e42" />
                <line x1="7" y1="0" x2="7" y2="5" stroke="#2b2018" strokeWidth="1.8" />
              </g>
            </g>
  </>;
}

export const DistantPines = React.memo(DistantPinesAsset);
