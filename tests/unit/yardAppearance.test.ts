import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveNightPathTone, nightPathReference } from '../../src/features/yard-editor/yardAppearance';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { WearMaterialSurface } from '../../src/components/scenery/yorkshire/dressing/WearBrushSurface';
import { createF2SceneTheme } from '../../src/world/render/f2/F2Environment';
import { COUNTRYSIDE_THEMES } from '../../src/world/theme/worldTheme';

test('old or invalid yard appearance preferences default to original warm brown',()=>{
  for(const value of [undefined,null,{},'path','purple',0])assert.equal(resolveNightPathTone(value),'warmBrown');
  for(const value of ['warmBrown','grassTaupe','oliveBrown'] as const)assert.equal(resolveNightPathTone(value),value);
});
test('saved appearance reaches the real material renderer without changing daytime, dusk or blur',()=>{
  const strokes=[{strength:'trail' as const,size:64,points:[{x:400,y:400},{x:540,y:430}]}];
  for(const time of ['day','dusk','night'] as const){
    const theme=createF2SceneTheme(COUNTRYSIDE_THEMES[time],time);
    const render=(nightPathTone:'warmBrown'|'grassTaupe'|'oliveBrown')=>renderToStaticMarkup(React.createElement('svg',null,React.createElement(WearMaterialSurface,{strokes,theme,nightPathTone})));
    const original=render('warmBrown');
    for(const tone of ['grassTaupe','oliveBrown'] as const){
      const candidate=render(tone);
      assert.ok(candidate.includes('data-wear-blur="on"'));
      assert.ok(candidate.includes(`data-wear-tone="${nightPathReference(tone,time==='night')}"`));
      if(time!=='night')assert.equal(candidate,original);
      else assert.notEqual(candidate,original);
    }
  }
});
test('night references never change daytime or dusk colour selection',()=>{
  for(const value of ['warmBrown','grassTaupe','oliveBrown'] as const)assert.equal(nightPathReference(value,false),'original');
  assert.equal(nightPathReference('warmBrown',true),'original');
  assert.equal(nightPathReference('grassTaupe',true),'path');
  assert.equal(nightPathReference('oliveBrown',true),'garden');
});
