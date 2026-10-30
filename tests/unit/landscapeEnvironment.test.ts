import assert from 'node:assert/strict';
import { test } from 'node:test';
import { FOOTHILL_WOODLAND, FOOTHILL_FARMSTEADS, nearestMountainRidgeY, foothillGroundY, foothillRidgeY, foothillSurfaceY, foothillSurfacePath } from '../../src/world/scene/foothillGeometry';
import { createF2SceneTheme, resolveF2Environment } from '../../src/world/render/f2/F2Environment';
import { COUNTRYSIDE_THEMES } from '../../src/world/theme/worldTheme';
import { PARALLAX_PRESETS, resolveParallaxCamera } from '../../src/world/camera/parallaxMath';
import { resolveSourceHillsLook } from '../../src/world/render/f2/F2Atmosphere';
import { Color } from 'three';
import { railwayAppearance } from '../../src/components/scenery/yorkshire/infrastructure/railwayAppearance';
import { MEADOW_HILL_TREES, MEADOW_HILL_FARM, MEADOW_HILL_WINDMILL, meadowHillSurfaceY } from '../../src/world/scene/meadowFoothill';

const sourceFootY=(x:number,depth:number)=>foothillSurfaceY(x,depth,'?foothillForm=source-foot');

test('railway shares nearest-ridge air with a nearer distance and linear colour mixing', () => {
  const emission: number[] = [];
  for (const time of ['day','dusk','night'] as const) {
    const theme = createF2SceneTheme(COUNTRYSIDE_THEMES[time], time);
    const { config } = resolveF2Environment(time);
    const nearest = resolveSourceHillsLook(config, 2);
    const railway = theme.railwayAtmosphere!;
    const appearance = railwayAppearance(theme);
    assert.equal(railway.air, '#' + nearest.air.getHexString());
    assert.ok(railway.strength > 0 && railway.strength < nearest.layerAir);
    const air = new Color(railway.air);
    for (const hex of ['#000000', '#bdb5a7', '#ffffff']) {
      const original = new Color(hex);
      const expected = original.clone().lerp(air, railway.strength);
      const input = [original.r, original.g, original.b];
      const output = input.map((c, i) => c * appearance.air.slope + appearance.air.intercepts[i]);
      [expected.r, expected.g, expected.b].forEach((c, i) => assert.ok(Math.abs(output[i] - c) < 1e-9));
    }
    emission.push(appearance.emission);
  }
  assert.ok(emission[0] < emission[1] && emission[1] < emission[2]);
});

test('historical source-foot roots and farms remain on the original ridge surface', () => {
  for (const root of [...FOOTHILL_WOODLAND,...FOOTHILL_FARMSTEADS]) {
    const y = sourceFootY(root.x,root.depth);
    assert.ok(y > foothillRidgeY(root.x));
    assert.ok(y < foothillGroundY(root.x));
  }
  assert.equal(new Set(FOOTHILL_WOODLAND.map(t => t.species)).size,3);
  assert.equal((foothillSurfacePath().match(/M /g) || []).length,1);
  assert.ok(!foothillSurfacePath().includes('NaN'));
});

test('approved default roots follow the reviewed meadow while the east group keeps its source foot',()=>{
  for(const root of [...MEADOW_HILL_TREES,MEADOW_HILL_FARM,MEADOW_HILL_WINDMILL]) {
    const y=foothillSurfaceY(root.x,root.depth);
    assert.equal(y,meadowHillSurfaceY(root.x,root.depth));
    assert.ok(y>meadowHillSurfaceY(root.x,0)! && y<meadowHillSurfaceY(root.x,1)!);
  }
  for(const root of [...FOOTHILL_WOODLAND.filter(tree=>tree.group==='east'),FOOTHILL_FARMSTEADS[1]])assert.equal(foothillSurfaceY(root.x,root.depth),sourceFootY(root.x,root.depth));
});

test('three source periods retain source sky/air while key SVG surfaces follow that environment', () => {
  const night = createF2SceneTheme(COUNTRYSIDE_THEMES.night,'night');
  const day = createF2SceneTheme(COUNTRYSIDE_THEMES.day,'day');
  assert.equal(night.skyTop,'#' + resolveF2Environment('night').sky.top.getHexString());
  for (const key of ['grassTop','wheatTop','farmWall'] as const) {
    const luminance = (hex:string) => [1,3,5].reduce((sum,i) => sum + parseInt(hex.slice(i,i+2),16),0);
    assert.ok(luminance(night.landscapeEnvironment![key]) < luminance(day.landscapeEnvironment![key]) * .7,key);
  }
  assert.deepEqual(Object.keys(COUNTRYSIDE_THEMES),['day','dusk','night']);
  assert.equal(resolveF2Environment('day').study.lighting.sunElevation,35);
  assert.equal(resolveF2Environment('night').study.lighting.sunIntensity,0);
});

test('distance calibration preserves the source air colour and a monotonic depth hierarchy', () => {
  for (const time of ['day','dusk','night'] as const) {
    const {config,sky}=resolveF2Environment(time);
    const looks=config.layers.map((_,i)=>resolveSourceHillsLook(config,i));
    for (const look of looks) assert.equal(look.air.getHexString(),sky.air.getHexString());
    assert.ok(looks[0].layerAir>looks[1].layerAir && looks[1].layerAir>looks[2].layerAir);
    const distance = (i: number) => {
      const c=looks[i].base.clone().lerp(looks[i].air,looks[i].layerAir), air=looks[i].air;
      return Math.hypot(c.r-air.r,c.g-air.g,c.b-air.b);
    };
    assert.ok(distance(0)<distance(2));
  }
});

test('the crop retains its original independent translation and zoom response', () => {
  const camera={x:100,y:235,zoom:1.66};
  assert.deepEqual(resolveParallaxCamera(camera,PARALLAX_PRESETS.wheat),{x:65,y:190,zoom:1.36});
  assert.deepEqual(resolveParallaxCamera(camera,PARALLAX_PRESETS.stage),camera);
});

test('historical source-foot crowns and roofs stay below the actual F2 ridge, including its low valleys', () => {
  for(const tree of FOOTHILL_WOODLAND){
    const top=sourceFootY(tree.x,tree.depth)-40*tree.scale;
    assert.ok(top>nearestMountainRidgeY(tree.x)+8,tree.id);
  }
  for(const farm of FOOTHILL_FARMSTEADS)
    assert.ok(sourceFootY(farm.x,farm.depth)-farm.height>nearestMountainRidgeY(farm.x)+8);
});
