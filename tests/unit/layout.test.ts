import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEFAULT_ROOM_LAYOUT, resolveRoomLayout, saveRoomLayout } from '../../src/components/layout-gizmo/layoutStore';
import { FURNITURE_PARENTS, furnitureScenePoint } from '../../src/features/layout-editor/furnitureParents';

test('v6 accepts only known finite edits and positive scales; each corrupt entry falls back alone', () => {
  const layout=resolveRoomLayout({
    'cabinet-group':{id:'wrong',name:'unsafe',category:'wrong',screen:{x:-80.25,y:81.5}},
    'moka-pot':{screen:{x:1,y:2},scale:-1},
    'desk-group':{screen:{x:Infinity,y:0}},
    'record-player':{screen:{x:-8,y:-22},scale:0.75},
    unknown:{screen:{x:0,y:0}},
  });
  assert.deepEqual(layout['cabinet-group'].screen,{x:-80.25,y:81.5});
  assert.equal(layout['cabinet-group'].name,DEFAULT_ROOM_LAYOUT['cabinet-group'].name);
  assert.deepEqual(layout['moka-pot'],DEFAULT_ROOM_LAYOUT['moka-pot']);
  assert.deepEqual(layout['desk-group'],DEFAULT_ROOM_LAYOUT['desk-group']);
  assert.equal(layout['record-player'].scale,0.75);
  assert.equal(Object.keys(layout).length,Object.keys(DEFAULT_ROOM_LAYOUT).length);
  assert.deepEqual(resolveRoomLayout(null),DEFAULT_ROOM_LAYOUT);
});
test('cabinet and desk children follow their original parents; chairs and tea seats remain independent', () => {
  const layout=resolveRoomLayout(DEFAULT_ROOM_LAYOUT);
  const player=furnitureScenePoint('record-player',layout);
  const chair=furnitureScenePoint('attic-chair',layout);
  const cushion=furnitureScenePoint('tea-cushion-east',layout);
  layout['cabinet-group'].screen.x+=20;
  layout['desk-group'].screen.x+=20;
  layout['tea-table'].screen.x+=20;
  assert.equal(furnitureScenePoint('record-player',layout).x,player.x+20);
  assert.deepEqual(furnitureScenePoint('attic-chair',layout),chair);
  assert.deepEqual(furnitureScenePoint('tea-cushion-east',layout),cushion);
  assert.equal(FURNITURE_PARENTS['desk-lamp'].parent,'desk-group');
});
test('storage failure is reported to the owner while resolved memory data remains intact', () => {
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{setItem(){throw new Error('quota');}}});
  const layout=resolveRoomLayout({ 'cabinet-group':{screen:{x:-80,y:82}} });
  try { assert.equal(saveRoomLayout(layout),false); assert.equal(layout['cabinet-group'].screen.x,-80); }
  finally { delete globalThis.localStorage; }
});

test('two-seat defaults upgrade only untouched legacy desk items and preserve custom v6 positions', () => {
  const legacy = resolveRoomLayout({
    'desk-group': { screen: { x: -130, y: 88 } },
    'attic-chair': { screen: { x: -132, y: 101 } },
    'desk-laptop': { screen: { x: 15, y: -1 } },
  });
  assert.deepEqual(legacy['desk-group'].screen, { x: -130, y: 88 });
  assert.deepEqual(legacy['desk-laptop'].screen, DEFAULT_ROOM_LAYOUT['desk-laptop'].screen);
  assert.deepEqual(legacy['attic-chair'].screen, DEFAULT_ROOM_LAYOUT['attic-chair'].screen);
  const custom = resolveRoomLayout({
    'desk-group': { screen: { x: -130, y: 88 } },
    'attic-chair': { screen: { x: -111, y: 96 } },
    'desk-laptop': { screen: { x: 18, y: -4 } },
  });
  assert.deepEqual(custom['attic-chair'].screen, { x: -111, y: 96 });
  assert.deepEqual(custom['desk-laptop'].screen, { x: 18, y: -4 });
  assert.equal(custom['desk-laptop-secondary'].screen.x, -14);
  assert.equal(custom['attic-chair-secondary'].screen.x, -144);
  assert.equal(FURNITURE_PARENTS['desk-laptop-secondary'].parent, 'desk-group');
  assert.equal(FURNITURE_PARENTS['attic-chair-secondary'].parent, 'main_cottage');
  const editedCurrent = structuredClone(DEFAULT_ROOM_LAYOUT);
  editedCurrent['desk-laptop'].screen = { x: 15, y: -1 };
  editedCurrent['attic-chair'].screen = { x: -132, y: 101 };
  assert.deepEqual(resolveRoomLayout(editedCurrent)['desk-laptop'].screen, { x: 15, y: -1 });
  assert.deepEqual(resolveRoomLayout(editedCurrent)['attic-chair'].screen, { x: -132, y: 101 });
});
