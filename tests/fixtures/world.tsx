import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThreeWorld } from '../../src/components/ThreeWorld';
import { INITIAL_PEOPLE } from '../../src/data/initialData';
import { loadSavedRoomLayout } from '../../src/components/layout-gizmo/layoutStore';
import { DEFAULT_SCENE_LAYOUT } from '../../src/world/scene/sceneLayout';
import type { EntityId } from '../../src/world/scene/sceneTypes';
import type { RoomId } from '../../src/types';
import '../../src/index.css';

const query = new URLSearchParams(location.search);
const stationX = Number(query.get('stationX') ?? 1000);
const sceneLayout = { ...DEFAULT_SCENE_LAYOUT, observatory: {
  ...DEFAULT_SCENE_LAYOUT.observatory, position: { ...DEFAULT_SCENE_LAYOUT.observatory.position, x: stationX },
} };
const entity = query.get('entity') as EntityId;
if (entity && entity in sceneLayout) sceneLayout[entity] = {
  ...sceneLayout[entity], scale: Number(query.get('scale') ?? sceneLayout[entity].scale),
  position: { ...sceneLayout[entity].position, x: Number(query.get('x') ?? sceneLayout[entity].position.x) },
};
const occupantRoom = query.has('observer') ? 'observatory' : query.get('occupantRoom') as RoomId;
const people = query.has('empty') ? [] : INITIAL_PEOPLE.map(p => occupantRoom && p.isSelf ? { ...p, currentRoom: occupantRoom } : p);
createRoot(document.getElementById('root')!).render(
  <div style={{ width: '100vw', height: '100vh' }}>
    <ThreeWorld timeOfDay="afternoon" people={people} sceneLayout={sceneLayout}
      activeRoom={query.has('focusStation') ? 'observatory' : 'overview'} roomLayout={loadSavedRoomLayout()} unreadMailCount={2} onSelectPerson={() => {}}
      onSelectMailbox={() => {}} onSelectRoom={() => {}} />
  </div>,
);
