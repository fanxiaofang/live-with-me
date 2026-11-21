import React from 'react';
import { ATMOSPHERE_REVIEW_CHOICES, type AtmosphereStudy } from '../../world/render/f2/F3AtmosphereStudy';

const choices = ATMOSPHERE_REVIEW_CHOICES;

/** Explicit review URL only. Changes no persisted preferences or layout. */
export function AtmosphereStudyPanel({ study, onChange }: {
  study: AtmosphereStudy; onChange: (study: AtmosphereStudy) => void;
}) {
  return <details data-atmosphere-review-controls open style={{ position: 'absolute', zIndex: 50,
    top: 100, left: '50%', transform: 'translateX(-50%)', width: 'max-content',
    maxWidth: 'calc(100vw - 24px)', padding: '10px 14px', borderRadius: 12,
    color: '#ece9df', background: 'rgba(22,35,33,.95)', border: '1px solid #58716a', font: '13px/1.6 system-ui' }}>
    <summary style={{ cursor: 'pointer' }}>F3 · 大气分层 · 三时段已通过</summary>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
      {choices.map(c => <button key={c.id} data-study-choice={c.id} aria-pressed={study === c.id}
        onClick={() => onChange(c.id)} style={{ padding: '5px 9px', cursor: 'pointer', borderRadius: 6,
          border: '1px solid #728c82', background: study === c.id ? '#d9e9dc' : '#253e37',
          color: study === c.id ? '#18342b' : '#ece9df' }}>{c.label}</button>)}
    </div>
    <p style={{ margin: '7px 0 0', color: '#b9cdc2' }}>三时段天空、暗角与地形材质适配均已通过；低雾仅白天启用，黄昏与夜晚无局部低雾。</p>
  </details>;
}
