import preset from './defaultYardLayout.json';
import { resolveYardLayout, type YardLayout } from './yardLayout';
import { resolveWearStrokes, type WearStroke } from './yardWear';
import { resolveNightPathTone, type NightPathTone } from './yardAppearance';

export type YardSnapshot = { layout: YardLayout; wearStrokes: WearStroke[]; nightPathTone: NightPathTone };

/** User-arranged baseline exported on 2026-11-12. Offsets retain their original anchors. */
export function defaultYardSnapshot(): YardSnapshot {
  return {
    layout: resolveYardLayout(preset.objects),
    wearStrokes: resolveWearStrokes(preset.wearStrokes),
    nightPathTone: resolveNightPathTone(preset.nightPathTone),
  };
}

/** A real local save owns all its fields, including empty paving and wear. */
export function resolveSavedYardSnapshot(value: unknown): YardSnapshot {
  const saved = value as { objects?: unknown; wearStrokes?: unknown; nightPathTone?: unknown } | null;
  if (!saved || !saved.objects || typeof saved.objects !== 'object' || Array.isArray(saved.objects)) return defaultYardSnapshot();
  return {
    layout: resolveYardLayout(saved.objects),
    wearStrokes: resolveWearStrokes(saved.wearStrokes),
    nightPathTone: resolveNightPathTone(saved.nightPathTone),
  };
}
