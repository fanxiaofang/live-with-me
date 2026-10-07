export type EntityId = 'main_cottage' | 'capsule_pod' | 'wooden_cabin' | 'observatory';
type Point<S extends string> = Readonly<{ x: number; y: number; space: S }>;
type Delta<S extends string> = Readonly<{ dx: number; dy: number; space: S }>;
export type ScenePoint = Point<'scene'>;
export type ViewBoxPoint = Point<'viewBox'>;
export type ClientPoint = Point<'client'>;
export type LocalPoint<P extends string = string> = Point<'local'> & { parent: P };
export type SceneDelta = Delta<'scene'>;
export type ViewBoxDelta = Delta<'viewBox'>;
export type ClientDelta = Delta<'client'>;
export type LocalDelta<P extends string = string> = Delta<'local'> & { parent: P };
export const localPoint = <P extends string>(parent: P, x: number, y: number): LocalPoint<P> => ({ parent, x, y, space: 'local' });
export const scenePoint = (x: number, y: number): ScenePoint => ({ x, y, space: 'scene' });
export const viewBoxPoint = (x: number, y: number): ViewBoxPoint => ({ x, y, space: 'viewBox' });
export const clientPoint = (x: number, y: number): ClientPoint => ({ x, y, space: 'client' });
export interface Placement { readonly position: ScenePoint; readonly scale: number }
export type SceneLayout = Readonly<Record<EntityId, Placement>>;
