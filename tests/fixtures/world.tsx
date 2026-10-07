import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThreeWorld } from '../../src/components/ThreeWorld';
import { INITIAL_PEOPLE } from '../../src/data/initialData';
import { loadSavedRoomLayout } from '../../src/components/layout-gizmo/layoutStore';
import '../../src/index.css';

const query = new URLSearchParams(location.search);
createRoot(document.getElementById('root')!).render(
  <div style={{ width: '100vw', height: '100vh' }}>
    <ThreeWorld timeOfDay="afternoon" people={query.has('empty') ? [] : INITIAL_PEOPLE}
      activeRoom="overview" roomLayout={loadSavedRoomLayout()} unreadMailCount={2} onSelectPerson={() => {}}
      onSelectMailbox={() => {}} onSelectRoom={() => {}} />
  </div>,
);
