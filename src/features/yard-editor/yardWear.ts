export const WEAR_STRENGTHS = { heavy: '重度踩踏', medium: '中度踩踏', light: '轻度踩踏', trail: '土径', erase: '局部擦除' } as const;
export type WearStrength = keyof typeof WEAR_STRENGTHS;
export type WearPoint = { x: number; y: number };
export type WearStroke = { strength: WearStrength; size: number; points: WearPoint[] };
export const WEAR_GROUND_Y = .285;
export const MAX_WEAR_POINTS = 8000;
export const MAX_ERASE_POINTS = 8000;
export const isWearStrength = (value: unknown): value is WearStrength =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(WEAR_STRENGTHS, value);
export const isWearPoint = (point: WearPoint) => Number.isFinite(point.x) && Number.isFinite(point.y)
  && point.x >= -700 && point.x <= 1850 && point.y >= 240 && point.y <= 840;

/** Old yard saves have no painted wear. Limit imported data without changing object placements. */
export function resolveWearStrokes(value: unknown): WearStroke[] {
  if (!Array.isArray(value)) return [];
  const result: WearStroke[] = [];
  const remaining = { paint: MAX_WEAR_POINTS, erase: MAX_ERASE_POINTS };
  for (const item of value) {
    if (!item || !isWearStrength(item.strength) || !Number.isFinite(item.size) || !Array.isArray(item.points)) continue;
    const kind = item.strength === 'erase' ? 'erase' : 'paint';
    if (!remaining[kind]) continue;
    const points: WearPoint[] = [];
    for (const point of item.points) {
      if (point && isWearPoint(point)) points.push({ x: point.x, y: point.y });
      if (points.length === remaining[kind]) break;
    }
    if (!points.length) continue;
    result.push({ strength: item.strength, size: Math.max(24, Math.min(140, item.size)), points });
    remaining[kind] -= points.length;
  }
  return result;
}

/** Retain actual turns and the latest endpoint. The renderer covers complete
 * segments, so no interpolated stamp points or smoothing are needed here. */
export function extendWearStroke(stroke: WearStroke, point: WearPoint, budget: number): WearStroke {
  if (!isWearPoint(point) || budget <= 0) return stroke;
  const last = stroke.points[stroke.points.length - 1];
  const dx = point.x - last.x, dy = point.y - last.y;
  if (Math.hypot(dx, dy / WEAR_GROUND_Y) < .01) return stroke;
  const points = [...stroke.points];
  const previous = points.at(-2);
  if (previous) {
    const ax=last.x-previous.x, ay=(last.y-previous.y)/WEAR_GROUND_Y;
    const bx=point.x-previous.x, by=(point.y-previous.y)/WEAR_GROUND_Y;
    const den=bx*bx+by*by, t=den?(ax*bx+ay*by)/den:0;
    // Merge only nearly collinear samples, never a reversal or a real corner.
    if(t>0&&t<1&&Math.hypot(ax-t*bx,ay-t*by)<.35) {
      points[points.length-1]={...point};
      return {...stroke,points};
    }
  }
  return { ...stroke, points: [...points, {...point}] };
}
