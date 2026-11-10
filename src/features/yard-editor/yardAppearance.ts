export const NIGHT_PATH_TONES = {
  warmBrown: { label: '暖棕色', swatch: '#584f40' },
  grassTaupe: { label: '草灰褐', swatch: '#59604d' },
  oliveBrown: { label: '深橄榄褐', swatch: '#515446' },
} as const;
export type NightPathTone = keyof typeof NIGHT_PATH_TONES;
export function resolveNightPathTone(value: unknown): NightPathTone {
  return value === 'grassTaupe' || value === 'oliveBrown' ? value : 'warmBrown';
}
/** Saved preferences affect nighttime only; historical review URLs are separate. */
export function nightPathReference(tone: NightPathTone, isNight: boolean): 'original' | 'path' | 'garden' {
  return !isNight || tone === 'warmBrown' ? 'original' : tone === 'grassTaupe' ? 'path' : 'garden';
}
