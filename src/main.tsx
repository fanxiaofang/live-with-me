import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installRuntimeFailureReporting, showRuntimeFailure } from './shared/errors/runtimeFailure';

const removeRuntimeFailureReporting = installRuntimeFailureReporting();
if (import.meta.hot) import.meta.hot.dispose(removeRuntimeFailureReporting);

createRoot(document.getElementById('root')!, {
  onUncaughtError: (error: unknown, info: { componentStack?: string | null }) => showRuntimeFailure(error, info.componentStack),
}).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
