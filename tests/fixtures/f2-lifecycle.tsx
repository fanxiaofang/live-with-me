import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThreeWorld } from '../../src/components/ThreeWorld';
import { resolvePresenceSlots } from '../../src/features/presence/presenceAllocation';
import '../../src/index.css';
function Lifecycle() {
  const [mounted, setMounted] = useState(true);
  return <><button style={{position:'fixed',zIndex:100,left:0,top:0}} onClick={()=>setMounted(v=>!v)}>切换世界挂载</button>
    <div style={{width:'100vw',height:'100vh'}}>{mounted && <ThreeWorld timeOfDay="day" people={[]}
      presenceAllocation={resolvePresenceSlots([])} activeRoom="overview" unreadMailCount={0}
      onSelectPerson={()=>{}} onSelectMailbox={()=>{}} onSelectRoom={()=>{}} />}</div></>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Lifecycle /></StrictMode>);
