import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThreeWorld } from '../../src/components/ThreeWorld';
import { INITIAL_PEOPLE } from '../../src/data/initialData';
import { resolvePresenceSlots } from '../../src/features/presence/presenceAllocation';
import type { TimeOfDay, WorldViewId } from '../../src/types';
import { ATMOSPHERE_REVIEW_CHOICES, DEFAULT_ATMOSPHERE_STUDY, type AtmosphereStudy } from '../../src/world/render/f2/F3AtmosphereStudy';
import '../../src/index.css';

const choices = ATMOSPHERE_REVIEW_CHOICES;
const requested = new URLSearchParams(location.search).get('study');
const allocation = resolvePresenceSlots(INITIAL_PEOPLE);

function Review() {
  const [study, setStudy] = useState<AtmosphereStudy>(choices.find(c => c.id === requested)?.id || DEFAULT_ATMOSPHERE_STUDY);
  const [time, setTime] = useState<TimeOfDay>('day');
  const [room, setRoom] = useState<WorldViewId>('overview');
  return <main style={{ width: '100vw', height: '100dvh', background: '#1a2927' }}>
    <ThreeWorld atmosphereStudy={study} timeOfDay={time} activeRoom={room}
      people={INITIAL_PEOPLE} presenceAllocation={allocation} unreadMailCount={0}
      onSelectPerson={() => {}} onSelectMailbox={() => {}} onSelectRoom={setRoom} />
    <details data-atmosphere-review-controls open style={{ position: 'absolute', zIndex: 50, top: 12, left: 12,
      maxWidth: 'min(650px, calc(100vw - 24px))', padding: '10px 14px', borderRadius: 12,
      color: '#ece9df', background: 'rgba(22,35,33,.95)', border: '1px solid #58716a', font: '13px/1.6 system-ui' }}>
      <summary style={{ cursor: 'pointer' }}>F3 · 大气分层 · 三时段已通过</summary>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {choices.map(c => <button key={c.id} data-study-choice={c.id} aria-pressed={study === c.id}
          onClick={() => setStudy(c.id)} style={{ padding: '5px 9px', cursor: 'pointer', borderRadius: 6,
            border: '1px solid #728c82', background: study === c.id ? '#d9e9dc' : '#253e37',
            color: study === c.id ? '#18342b' : '#ece9df' }}>{c.label}</button>)}
      </div>
      <p style={{ margin: '7px 0' }}>同一场景即时切换，镜头保持。先看天空与山体的关系，再看桥和丘陵是否仍显灰。</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <label>时段 <select aria-label="时段" value={time} onChange={e => setTime(e.target.value as TimeOfDay)}
          style={{ background: '#253e37', color: '#ece9df', padding: 4 }}>
          <option value="day">白天</option><option value="dusk">黄昏</option><option value="night">夜晚</option>
        </select></label>
        <button onClick={() => setRoom('overview')} style={{ cursor: 'pointer' }}>全景</button>
        <button onClick={() => setRoom('living_nook')} style={{ cursor: 'pointer' }}>主屋局部</button>
        <span>可收起面板后拖动、缩放。</span>
      </div>
      <p style={{ margin: '7px 0 0', color: '#b9cdc2' }}>当前组合包含三时段谷地与铁路；局部低雾仅白天启用。基线与各对照独立切换，无布局存档写入。</p>
    </details>
  </main>;
}

createRoot(document.getElementById('root')!).render(<Review />);
