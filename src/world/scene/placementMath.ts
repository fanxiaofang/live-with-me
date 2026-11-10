import { scenePoint, type Placement } from './sceneTypes';

export function scaleAroundLocalAnchor(placement: Placement, nextScale: number, anchor: { x: number; y: number }): Placement {
  if (![placement.position.x, placement.position.y, placement.scale, nextScale, anchor.x, anchor.y].every(Number.isFinite)
    || placement.scale <= 0 || nextScale <= 0) throw new Error('Placement scales must be positive and coordinates finite.');
  return { position: scenePoint(placement.position.x + anchor.x * (placement.scale - nextScale),
    placement.position.y + anchor.y * (placement.scale - nextScale)), scale: nextScale };
}

export function rotateGroundPoint(p: { x: number; y: number }, pivot: { x: number; y: number }, angle: number) {
  if (![p.x, p.y, pivot.x, pivot.y, angle].every(Number.isFinite)) throw new Error('Ground rotation requires finite coordinates and angle.');
  const a = angle * Math.PI / 180, x = p.x - pivot.x, y = (p.y - pivot.y) / .285;
  return { x: pivot.x + x * Math.cos(a) - y * Math.sin(a), y: pivot.y + .285 * (x * Math.sin(a) + y * Math.cos(a)) };
}
