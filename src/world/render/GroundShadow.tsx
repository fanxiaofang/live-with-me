import { useId, type ReactNode } from 'react';

/** Geometry stays in the asset's local receiving plane and follows its parent CTM. */
interface GroundShadowProps {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  color: string;
  opacity: number;
}

/** A small, defined footprint at a support point. No blur or offset. */
export function ContactGroundShadow({ cx, cy, rx, ry, color, opacity }: GroundShadowProps) {
  return <ellipse data-shadow-role="contact" aria-hidden="true" pointerEvents="none"
    cx={cx} cy={cy} rx={rx} ry={ry} fill={color} opacity={opacity} />;
}

/** Broad grounding fades to transparent inside the ellipse, without filter clipping.
 * Use on a separate shadow shape, never on an object's visible body. */
export function AmbientGroundShadow({ cx, cy, rx, ry, color, opacity }: GroundShadowProps) {
  const id = `ambient-ground-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return <g data-shadow-role="ambient" aria-hidden="true" pointerEvents="none">
    <defs>
      <radialGradient id={id} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor={color} />
        <stop offset="0.6" stopColor={color} stopOpacity="0.45" />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id})`} opacity={opacity} />
  </g>;
}

/** A supported soft object keeps a compact core and fades at its contact edge. */
export function SoftContactShadow({ cx, cy, rx, ry, color, opacity }: GroundShadowProps) {
  const id = `soft-contact-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return <g data-shadow-role="soft-contact" aria-hidden="true" pointerEvents="none">
    <defs>
      <radialGradient id={id} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor={color} />
        <stop offset="0.55" stopColor={color} stopOpacity="0.85" />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id})`} opacity={opacity} />
  </g>;
}

interface SoftSurfaceShadowProps {
  bounds: { x: number; y: number; width: number; height: number };
  blur: number;
  role?: 'ambient' | 'soft-contact';
  children: ReactNode;
}

/** Feather a separately authored shadow shape, never the visible object.
 * Bounds include 3 sigma plus one local unit on every side, independently of size. */
export function SoftSurfaceShadow({ bounds, blur, role = 'ambient', children }: SoftSurfaceShadowProps) {
  const id = `surface-shadow-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const padding = Math.ceil(blur * 3) + 1;
  return <g data-shadow-role={role} aria-hidden="true" pointerEvents="none">
    <defs>
      <filter id={id} data-surface-shadow-filter="true" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse"
        x={bounds.x - padding} y={bounds.y - padding}
        width={bounds.width + padding * 2} height={bounds.height + padding * 2}>
        <feGaussianBlur stdDeviation={blur} />
      </filter>
    </defs>
    <g filter={`url(#${id})`}>{children}</g>
  </g>;
}
