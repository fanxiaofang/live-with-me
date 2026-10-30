import { memo } from 'react';
import { FIELD_EDGE_STUDY, frontEdgeY } from '../../../../world/scene/fieldEdges';

/** Sparse plants overlap a level contact edge; no continuous border or raised soil face. */
export const FieldContactFringe = memo(function FieldContactFringe() {
  return <g data-field-contact-fringe="" pointerEvents="none" aria-hidden="true">
    {FIELD_EDGE_STUDY.fringeCenters.map((center, cluster) => <g key={center}>
      {[-22, -7, 10, 29].map((dx, i) => {
        const x = center + dx, y = frontEdgeY(x) + 1 + (i % 2);
        return <g key={dx} transform={'translate(' + x + ',' + y + ')'}>
          <path d="M0,1 Q-3,-3 -5,-5 M0,1 Q1,-4 3,-6 M0,1 Q-1,-3 -1,-7"
            stroke="#7f913d" strokeOpacity=".75" strokeWidth="1.1" fill="none" strokeLinecap="round" />
          {(i + cluster) % 2 === 0 && <g>
            <path d="M5,4 Q5,-1 6,-5" stroke="#a4913d" strokeOpacity=".75" strokeWidth=".8" fill="none" />
            <ellipse cx="6" cy="-5" rx="1.2" ry="2" fill="#d6b554" fillOpacity=".8" />
          </g>}
        </g>;
      })}
    </g>)}
  </g>;
});
