import React, { Profiler, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { EditableObjectId } from '../../src/components/layout-gizmo/layoutStore';
import { ThreeWorld } from '../../src/components/ThreeWorld';
import { INITIAL_PEOPLE } from '../../src/data/initialData';
import { useLayoutEditor } from '../../src/features/layout-editor/useLayoutEditor';
import { resolvePresenceSlots } from '../../src/features/presence/presenceAllocation';
import '../../src/index.css';
import type { RoomId, TimeOfDay } from '../../src/types';
import { DEFAULT_SCENE_LAYOUT } from '../../src/world/scene/sceneLayout';
import type { EntityId } from '../../src/world/scene/sceneTypes';
import { MeadowVegetationTrial } from './meadow/MeadowVegetationTrial';
import { MeadowGrassOnlyTrial } from './meadow/MeadowGrassOnlyTrial';
import { MeadowMicroCommunityTrial } from './meadow/MeadowMicroCommunityTrial';
import { MeadowSurfaceTrial } from './meadow/MeadowSurfaceTrial';
import { MeadowCommunityTrialV7 } from './meadow/MeadowCommunityTrialV7';
import { BeehiveMeadowTrial, CottageVergeMeadowTrial } from './meadow/LocalMeadowSystemTrial';
import { MeadowCommunityTrialV8 } from './meadow/MeadowCommunityTrialV8';
import { MeadowCommunityTrialV6 } from './meadow/MeadowCommunityTrialV6';
import { COUNTRYSIDE_THEMES } from '../../src/world/theme/worldTheme';

const query = new URLSearchParams(location.search);
const requestedTheme = query.get('theme');
const timeOfDay: TimeOfDay = requestedTheme === 'morning' || requestedTheme === 'dusk'
  || requestedTheme === 'night' || requestedTheme === 'rainy' ? requestedTheme : 'afternoon';
const renderSamples: number[] = [];
if (query.has('profile')) (window as unknown as { renderSamples: number[] }).renderSamples = renderSamples;
const stationX = Number(query.get('stationX') ?? DEFAULT_SCENE_LAYOUT.observatory.position.x);
const sceneLayout = { ...DEFAULT_SCENE_LAYOUT, observatory: {
  ...DEFAULT_SCENE_LAYOUT.observatory, position: { ...DEFAULT_SCENE_LAYOUT.observatory.position, x: stationX },
} };
const entity = query.get('entity') as EntityId;
if (entity && entity in sceneLayout) sceneLayout[entity] = {
  ...sceneLayout[entity], scale: Number(query.get('scale') ?? sceneLayout[entity].scale),
  position: { ...sceneLayout[entity].position, x: Number(query.get('x') ?? sceneLayout[entity].position.x) },
};
const occupantRoom = query.has('observer') ? 'observatory' : query.get('occupantRoom') as RoomId;
const people = query.has('empty') ? [] : INITIAL_PEOPLE.map((p, index) => {
  if (query.has('deskCount')) return { ...p,
    currentRoom: index < Number(query.get('deskCount')) ? 'my_room' as const : p.isSelf ? 'porch_mailbox' as const : p.currentRoom,
    currentState: index < Number(query.get('deskCount')) ? 'coding' as const : p.currentState,
    ...(query.get('deskHair') ? { hairStyle: query.get('deskHair')! } : {}),
  };
  return occupantRoom && p.isSelf ? { ...p, currentRoom: occupantRoom } : p;
});
function Fixture() {
  const editor=useLayoutEditor(() => {});
  const [requestedZoom,setRequestedZoom]=useState<number|null>(null);
  const [activeRoom,setActiveRoom]=useState<RoomId|'overview'>(query.has('focusStation') ? 'observatory' : (query.get('focusRoom') as RoomId) || 'overview');
  useEffect(()=>{
    if(query.has('edit')){editor.setIsLayoutInspectorOpen(true);editor.setActiveGizmoId(query.get('edit') as EditableObjectId);}
  },[]);
  useEffect(()=>{
    if(requestedZoom===null) return;
    const stage=document.querySelector('#panoramic-world-stage')!;
    const current=Number(stage.getAttribute('data-zoom'));
    const svg=stage.closest('svg')!;
    svg.dispatchEvent(new WheelEvent('wheel',{deltaY:(current-requestedZoom)/0.0012,bubbles:true,cancelable:true}));
    editor.setIsLayoutInspectorOpen(true);
    editor.setActiveGizmoId(query.get('edit') as EditableObjectId);
  },[requestedZoom]);
  return <div style={{ width: '100vw', height: '100vh' }}>
    {query.get('meadow') === 'bare' && <style>{`
      #lawn-natural-grass-tufts,#clover-turf-patches,#meadow-field-blossoms,
      #pasture-chamomile-dots,#pasture-wildflowers,#guardian-tree-root-flora,
      #homestead-organic-meadow-grounds .animate-sunbeam-breathe {display:none!important}
    `}</style>}
    {query.has('edit')&&<input aria-label="Fixture camera zoom" data-testid="fixture-zoom" type="number" step="0.01"
      style={{position:'absolute',zIndex:100,left:0,top:0,width:70}}
      onChange={e=>{editor.setIsLayoutInspectorOpen(false);setRequestedZoom(Number(e.target.value));}} />}
    <Profiler id="world" onRender={(_, __, duration) => { if (query.has('profile')) renderSamples.push(duration); }}>
    <ThreeWorld timeOfDay={timeOfDay} people={people} presenceAllocation={resolvePresenceSlots(people)} sceneLayout={sceneLayout}
      meadowComposition={query.has('vegetationTrial') || query.get('meadow') === 'legacy' ? 'legacy' : 'current'}
      meadowSurface={['4', '5', '6', '7', '8', '9'].includes(query.get('vegetationTrial') ?? '')
        ? <MeadowSurfaceTrial sceneLayout={sceneLayout} theme={COUNTRYSIDE_THEMES[timeOfDay]}
            revision={['8', '9'].includes(query.get('vegetationTrial') ?? '') ? 8 : query.get('vegetationTrial') === '7' ? 7 : query.get('vegetationTrial') === '6' ? 6 : query.get('vegetationTrial') === '5' ? 5 : 4} /> : undefined}
      beehivePlanting={query.get('vegetationTrial') === '9' ? <BeehiveMeadowTrial theme={COUNTRYSIDE_THEMES[timeOfDay]} /> : undefined}
      cottageVergeDecoration={query.get('vegetationTrial') === '9' ? <CottageVergeMeadowTrial theme={COUNTRYSIDE_THEMES[timeOfDay]} /> : undefined}
      groundDecoration={['8', '9'].includes(query.get('vegetationTrial') ?? '')
        ? <MeadowCommunityTrialV8 sceneLayout={sceneLayout} theme={COUNTRYSIDE_THEMES[timeOfDay]} />
        : query.get('vegetationTrial') === '7'
        ? <MeadowCommunityTrialV7 sceneLayout={sceneLayout} theme={COUNTRYSIDE_THEMES[timeOfDay]} />
        : query.get('vegetationTrial') === '6'
        ? <MeadowCommunityTrialV6 sceneLayout={sceneLayout} theme={COUNTRYSIDE_THEMES[timeOfDay]} />
        : ['3', '4', '5'].includes(query.get('vegetationTrial') ?? '')
        ? <MeadowMicroCommunityTrial sceneLayout={sceneLayout} theme={COUNTRYSIDE_THEMES[timeOfDay]} />
        : query.get('vegetationTrial') === '2'
        ? <MeadowGrassOnlyTrial sceneLayout={sceneLayout} theme={COUNTRYSIDE_THEMES[timeOfDay]} />
        : query.get('vegetationTrial') === '1'
        ? <MeadowVegetationTrial sceneLayout={sceneLayout} theme={COUNTRYSIDE_THEMES[timeOfDay]} /> : undefined}
      activeRoom={activeRoom} roomLayout={editor.roomLayout} unreadMailCount={2} onSelectPerson={() => {}}
      onSelectMailbox={() => {}} onSelectRoom={setActiveRoom}
      isInspectorOpen={editor.isLayoutInspectorOpen} activeGizmoId={editor.activeGizmoId}
      onDragGizmoDelta={editor.dragDelta} onDragGizmoBegin={editor.beginDrag}
      onDragGizmoEnd={editor.commitDrag} onDragGizmoCancel={editor.cancelDrag} />
    </Profiler>
  </div>;
}
createRoot(document.getElementById('root')!).render(<Fixture />);
