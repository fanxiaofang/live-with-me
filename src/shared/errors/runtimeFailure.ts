/** Render outside React's root, which is unmounted after an uncaught render error. */
function renderRuntimeFailure(error: unknown, componentStack?: string | null) {
  const details = error instanceof Error ? error.stack || `${error.name}: ${error.message}` : String(error);
  const report = `${details}${componentStack ? `\n\nReact component stack:${componentStack}` : ''}`.slice(0, 16000);
  let panel = document.getElementById('runtime-failure');
  if (!panel) {
    panel = document.createElement('section');
    panel.id = 'runtime-failure';
    panel.setAttribute('role', 'alert');
    panel.setAttribute('aria-label', '页面运行错误');
    Object.assign(panel.style, {
      position: 'fixed', inset: '0', zIndex: '2147483647', overflow: 'auto',
      padding: '24px', background: '#141210', color: '#f4ece1', fontFamily: 'sans-serif',
    });
    const title = document.createElement('h1');
    title.textContent = '页面遇到运行错误';
    const description = document.createElement('p');
    description.textContent = '请复制下方错误信息，便于定位问题。重新加载不会清空已保存的布局。';
    const output = document.createElement('textarea');
    output.readOnly = true;
    output.setAttribute('aria-label', '前端错误详情');
    Object.assign(output.style, { display: 'block', boxSizing: 'border-box', width: '100%', height: '50vh', margin: '16px 0', padding: '12px', color: '#f4ece1', background: '#241c14', fontFamily: 'monospace' });
    const copy = document.createElement('button');
    copy.textContent = '复制错误信息';
    const reload = document.createElement('button');
    reload.textContent = '重新加载页面';
    for (const button of [copy, reload]) Object.assign(button.style, { padding: '10px 16px', marginRight: '12px', cursor: 'pointer' });
    copy.onclick = async () => {
      try {
        await navigator.clipboard.writeText(output.value);
        copy.textContent = '已复制错误信息';
      } catch {
        output.focus(); output.select();
        copy.textContent = '请手动复制已选中的文字';
      }
    };
    reload.onclick = () => location.reload();
    panel.append(title, description, output, copy, reload);
    document.body.append(panel);
  }
  (panel.querySelector('textarea') as HTMLTextAreaElement).value = report;
}

export function showRuntimeFailure(error: unknown, componentStack?: string | null) {
  renderRuntimeFailure(error, componentStack);
  if (typeof window.reportError === 'function') window.reportError(error);
  else console.error(error, componentStack);
}

/** Pointer-handler and asynchronous failures do not pass through React's root callback. */
export function installRuntimeFailureReporting() {
  const showFirstError = (error: unknown) => {
    if (!document.getElementById('runtime-failure')) renderRuntimeFailure(error);
  };
  const onError = (event: ErrorEvent) => showFirstError(event.error ?? event.message);
  const onRejection = (event: PromiseRejectionEvent) => showFirstError(event.reason);
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  return () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
  };
}
