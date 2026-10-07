import React, { Profiler, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { EditableObjectId } from '../../src/components/layout-gizmo/layoutStore';
import { ThreeWorld } from '../../src/components/ThreeWorld';
import { INITIAL_PEOPLE } from '../../src/data/initialData';
import { useLayoutEditor } from '../../src/features/layout-editor/useLayoutEditor';
import { resolvePresenceSlots } from '../../src/features/presence/presenceAllocation';
import '../../src/index.css';
import type { RoomId } from '../../src/types';
import { DEFAULT_SCENE_LAYOUT } from '../../src/world/scene/sceneLayout';
import type { EntityId } from '../../src/world/scene/sceneTypes';

const query = new URLSearchParams(location.search);
const renderSamples: number[] = [];
if (query.has('profile')) (window as unknown as { renderSamples: number[] }).renderSamples = renderSamples;
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
    {query.has('edit')&&<input aria-label="Fixture camera zoom" data-testid="fixture-zoom" type="number" step="0.01"
      style={{position:'absolute',zIndex:100,left:0,top:0,width:70}}
      onChange={e=>{editor.setIsLayoutInspectorOpen(false);setRequestedZoom(Number(e.target.value));}} />}
    <Profiler id="world" onRender={(_, __, duration) => { if (query.has('profile')) renderSamples.push(duration); }}>
    <ThreeWorld timeOfDay="afternoon" people={people} presenceAllocation={resolvePresenceSlots(people)} sceneLayout={sceneLayout}
      activeRoom={activeRoom} roomLayout={editor.roomLayout} unreadMailCount={2} onSelectPerson={() => {}}
      onSelectMailbox={() => {}} onSelectRoom={setActiveRoom}
      isInspectorOpen={editor.isLayoutInspectorOpen} activeGizmoId={editor.activeGizmoId}
      onDragGizmoDelta={editor.dragDelta} onDragGizmoBegin={editor.beginDrag}
      onDragGizmoEnd={editor.commitDrag} onDragGizmoCancel={editor.cancelDrag} />
    </Profiler>
  </div>;
}
createRoot(document.getElementById('root')!).render(<Fixture />);
