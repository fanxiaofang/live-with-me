import React, { Profiler } from 'react';
import { createRoot } from 'react-dom/client';
import App from '../../src/App';
import '../../src/index.css';

const samples: { duration: number; commitTime: number }[] = [];
(window as unknown as { roomRenderSamples: typeof samples }).roomRenderSamples = samples;
createRoot(document.getElementById('root')!).render(
  <Profiler id="app" onRender={(_, __, duration, ___, ____, commitTime) => samples.push({ duration, commitTime })}>
    <App />
  </Profiler>,
);
