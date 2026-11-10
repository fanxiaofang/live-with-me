import { parseArgs } from 'node:util';
import { DEFAULT_SCENE_LAYOUT, entityPointToScene } from '../../src/world/scene/sceneLayout';
import { scenePoint, localPoint, type EntityId } from '../../src/world/scene/sceneTypes';
import { scaleAroundLocalAnchor, rotateGroundPoint } from '../../src/world/scene/placementMath';
import { isMain, cli, report } from './common.mjs';

const groundAnchors: Partial<Record<EntityId, readonly [number, number]>> = {
  capsule_pod: [0, 63], wooden_cabin: [9, 63], observatory: [0, 48],
};
export function point(value: string | undefined, label: string) {
  const parts = value?.split(',');
  if (parts?.length !== 2 || parts.some(p => !p.trim()) || !parts.every(p => Number.isFinite(Number(p))))
    throw new Error(`${label} must be two finite numbers: x,y`);
  return { x: Number(parts[0]), y: Number(parts[1]) };
}
export function calculate(operation: string, values: Record<string, string | boolean | undefined>) {
  const number = (key: string) => {
    const value = values[key];
    if (typeof value !== 'string' || !value.trim() || !Number.isFinite(Number(value))) throw new Error(`Invalid --${key}.`);
    return Number(value);
  };
  if (operation === 'rotate') return { readOnly: true, plane: 'ground, vertical compression 0.285',
    point: rotateGroundPoint(point(values.point as string, '--point'), point(values.pivot as string, '--pivot'), number('angle')) };
  if (!['scale', 'point'].includes(operation)) throw new Error('Choose scale, rotate or point.');
  const entity = values.entity as EntityId | undefined;
  if (entity && !Object.hasOwn(DEFAULT_SCENE_LAYOUT, entity)) throw new Error(`Unknown entity: ${entity}`);
  if (!entity && (!values.position || !values.scale)) throw new Error('Supply --entity or both --position and --scale.');
  const base = entity ? DEFAULT_SCENE_LAYOUT[entity] : null;
  const position = values.position ? point(values.position as string, '--position') : base!.position;
  const scale = values.scale ? number('scale') : base!.scale;
  if (scale <= 0) throw new Error('--scale must be positive.');
  const placement = { position: scenePoint(position.x, position.y), scale };
  if (operation === 'point') {
    const p = point(values.local as string, '--local');
    return { readOnly: true, basis: 'Provided placement or repository defaults; browser layout offsets are not included.',
      point: entityPointToScene(localPoint('main_cottage', p.x, p.y), { ...DEFAULT_SCENE_LAYOUT, main_cottage: placement }) };
  }
  if (!!values.percent === !!values.factor) throw new Error('Supply exactly one of --percent or --factor.');
  const factor = values.percent ? 1 + number('percent') / 100 : number('factor');
  const defaultAnchor = entity && groundAnchors[entity];
  if (!values.anchor && !defaultAnchor) throw new Error('Supply the local ground --anchor x,y for this object.');
  const anchor = values.anchor ? point(values.anchor as string, '--anchor') : { x: defaultAnchor![0], y: defaultAnchor![1] };
  const after = scaleAroundLocalAnchor(placement, scale * factor, anchor);
  const contact = { x: position.x + anchor.x * scale, y: position.y + anchor.y * scale };
  return { readOnly: true, basis: 'Provided placement or repository defaults; browser layout offsets are not included.',
    entity: entity ?? null, factor, anchor, before: placement, after, fixedContact: contact,
    review: ['Apply to the complete entity, not individual SVG parts.', 'Review scene layout, exploration envelope and room framing if the asset extent changed.'] };
}
export async function main(args = process.argv.slice(2)) {
  const { values, positionals } = parseArgs({ args, allowPositionals: true, options: {
    entity: { type: 'string' }, position: { type: 'string' }, scale: { type: 'string' }, anchor: { type: 'string' },
    percent: { type: 'string' }, factor: { type: 'string' }, point: { type: 'string' }, pivot: { type: 'string' },
    angle: { type: 'string' }, local: { type: 'string' }, help: { type: 'boolean' },
  } });
  if (values.help) return console.log('scene:geometry -- scale --entity capsule_pod --percent=-5 | rotate --point 100,28.5 --pivot 0,0 --angle 45 | point --entity capsule_pod --local 0,63');
  if (positionals.length !== 1) throw new Error('Choose one operation: scale, rotate or point.');
  report(calculate(positionals[0], values));
}
if (isMain(import.meta.url)) await cli(main);
