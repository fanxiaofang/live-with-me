import { useEffect, useRef, useState } from 'react';
import { loadSavedRoomLayout, resolveRoomLayout, saveRoomLayout, type EditableObjectId, type RoomLayoutConfig } from '../../components/layout-gizmo/layoutStore';

export function useLayoutEditor(notify:(message:string)=>void) {
  const [roomLayout,setRoomLayout]=useState(loadSavedRoomLayout);
  const [activeGizmoId,setActiveGizmoId]=useState<EditableObjectId|null>(null);
  const [isLayoutInspectorOpen,setIsLayoutInspectorOpen]=useState(false);
  const current=useRef(roomLayout);
  const transaction=useRef<RoomLayoutConfig|null>(null);
  const warned=useRef(false);
  const persist=(layout:RoomLayoutConfig)=>{
    const saved=saveRoomLayout(layout);
    if(!saved&&!warned.current){warned.current=true;notify('布局已更新，但本地保存失败；请保持当前页面打开。');}
    return saved;
  };
  const replace=(layout:RoomLayoutConfig,save=false)=>{
    current.current=layout;setRoomLayout(layout);if(save) persist(layout);
  };
  const cancelDrag=()=>{if(transaction.current){replace(transaction.current);transaction.current=null;}};
  const beginDrag=()=>{transaction.current=current.current;};
  const commitDrag=()=>{if(transaction.current){transaction.current=null;persist(current.current);}};
  const updatePosition=(id:EditableObjectId,pos:{x:number;y:number},save=true)=>{
    if(!Number.isFinite(pos.x)||!Number.isFinite(pos.y)) return;
    replace({...current.current,[id]:{...current.current[id],screen:pos}},save);
  };
  const dragDelta=(dx:number,dy:number)=>{
    if(!activeGizmoId) return;
    const pos=current.current[activeGizmoId].screen;
    updatePosition(activeGizmoId,{x:pos.x+dx,y:pos.y+dy},false);
  };
  const reset=()=>{transaction.current=null;const layout=resolveRoomLayout(undefined);replace(layout);if(persist(layout)) notify('↺ 已恢复全屋家具与摆件默认 2.5D 摆放位置');};
  useEffect(()=>{if(!isLayoutInspectorOpen){if(transaction.current){current.current=transaction.current;setRoomLayout(transaction.current);transaction.current=null;}setActiveGizmoId(null);}},[isLayoutInspectorOpen]);
  useEffect(()=>()=>{transaction.current=null;},[]);
  return {roomLayout,activeGizmoId,setActiveGizmoId,isLayoutInspectorOpen,setIsLayoutInspectorOpen,
    updatePosition,dragDelta,beginDrag,commitDrag,cancelDrag,reset};
}
