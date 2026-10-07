import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useToast } from '../../src/features/feedback/useToast';
import { useWorldFeedback } from '../../src/world/interactions/useWorldFeedback';
function Feedback() {
  const { toastMessage, triggerToast } = useToast();
  const feedback = useWorldFeedback();
  return <><button onClick={() => { triggerToast('当前反馈'); feedback.triggerAlienSignal(); }}>触发反馈</button>
    <output data-testid="toast">{toastMessage}</output><output data-testid="pulse">{String(feedback.alienPulseEffect)}</output>
    <output data-testid="signal">{feedback.alienTransmissionText}</output></>;
}
function Fixture() { const [mounted, setMounted] = useState(true); return <><button onClick={() => setMounted(p => !p)}>切换挂载</button>{mounted && <Feedback />}</>; }
createRoot(document.getElementById('root')!).render(<StrictMode><Fixture /></StrictMode>);
