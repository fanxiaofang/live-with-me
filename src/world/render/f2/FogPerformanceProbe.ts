import type * as THREE from 'three';

type TimerExtension = { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number };
const summarize = (values: number[]) => {
  const sorted = [...values].sort((a,b) => a-b);
  return { samples: sorted.length, medianMs: sorted[Math.floor(sorted.length / 2)] ?? null,
    p95Ms: sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * .95))] ?? null };
};

/** Explicitly invoked, isolated fog benchmark. Never runs in normal scene rendering. */
export async function measureFogPerformance(renderer: THREE.WebGLRenderer,
  setup: (mode: 'expanded' | 'baked') => void, draw: () => void, rebake: () => void) {
  const gl = renderer.getContext() as WebGL2RenderingContext;
  const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2') as TimerExtension | null;
  const debug = gl.getExtension('WEBGL_debug_renderer_info');
  const frames = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  const result = {
    environment: { userAgent: navigator.userAgent, dpr: renderer.getPixelRatio(),
      drawingBuffer: { width: renderer.domElement.width, height: renderer.domElement.height }, gpuTimerAvailable: !!ext,
      vendor: gl.getParameter(debug?.UNMASKED_VENDOR_WEBGL ?? gl.VENDOR),
      renderer: gl.getParameter(debug?.UNMASKED_RENDERER_WEBGL ?? gl.RENDERER) },
    firstUseSubmissionMs: {} as Record<string,number>,
    live: { submission: [] as number[], gpu: [] as number[] },
    baked: { submission: [] as number[], gpu: [] as number[] },
    discardedGpuSamples: 0,
    limitations: 'Isolated fog draw only; Submission wall time includes gl.finish calls, but browser command buffering means it does not establish GPU completion; use the GPU timer result for GPU cost. GPU query available only if supported and not disjoint. Not presented FPS, whole-app latency, production-browser matrix, or phone performance.',
  };
  for (const mode of ['expanded','baked'] as const) {
    gl.finish();
    const start = performance.now();
    setup(mode);
    gl.finish();
    result.firstUseSubmissionMs[mode] = performance.now() - start;
    for (let i=0;i<3;i++) { await frames(); draw(); gl.finish(); }
  }
  result.environment.dpr = renderer.getPixelRatio();
  result.environment.drawingBuffer = { width: renderer.domElement.width, height: renderer.domElement.height };
  // Alternate order to reduce drift; 16 measured draws per variant, after warmup.
  for (const mode of ['expanded','baked','expanded','baked'] as const) {
    setup(mode); gl.finish();
    const bucket = mode === 'expanded' ? result.live : result.baked;
    for (let i=0;i<8;i++) {
      await frames();
      if (document.hidden) throw new Error('Keep this diagnostic page visible during sampling');
      gl.finish();
      const query = ext ? gl.createQuery() : null;
      const start = performance.now();
      if (ext && query) gl.beginQuery(ext.TIME_ELAPSED_EXT,query);
      draw();
      if (ext && query) gl.endQuery(ext.TIME_ELAPSED_EXT);
      gl.finish();
      bucket.submission.push(performance.now()-start);
      if (ext && query) {
        const deadline=performance.now()+3000;
        while (!gl.getQueryParameter(query,gl.QUERY_RESULT_AVAILABLE) && performance.now()<deadline) await frames();
        if (gl.getQueryParameter(query,gl.QUERY_RESULT_AVAILABLE) && !gl.getParameter(ext.GPU_DISJOINT_EXT))
          bucket.gpu.push(gl.getQueryParameter(query,gl.QUERY_RESULT)/1e6);
        else result.discardedGpuSamples++;
        gl.deleteQuery(query);
      }
    }
  }
  await frames(); gl.finish();
  const bakeQuery=ext?gl.createQuery():null;
  const bakeStart=performance.now();
  if(ext && bakeQuery)gl.beginQuery(ext.TIME_ELAPSED_EXT,bakeQuery);
  rebake();
  if(ext && bakeQuery)gl.endQuery(ext.TIME_ELAPSED_EXT);
  gl.finish();
  const warmRebake={submissionMs:performance.now()-bakeStart,gpuMs:null as number|null,
    note:'One explicitly invalidated, shader-warm rebake plus one composition draw; not first-ever shader compilation.'};
  if(ext && bakeQuery){
    const deadline=performance.now()+5000;
    while(!gl.getQueryParameter(bakeQuery,gl.QUERY_RESULT_AVAILABLE) && performance.now()<deadline)await frames();
    if(gl.getQueryParameter(bakeQuery,gl.QUERY_RESULT_AVAILABLE) && !gl.getParameter(ext.GPU_DISJOINT_EXT))
      warmRebake.gpuMs=gl.getQueryParameter(bakeQuery,gl.QUERY_RESULT)/1e6;
    gl.deleteQuery(bakeQuery);
  }
  return { ...result, warmRebake, summary: {
    live: { submission: summarize(result.live.submission), gpu: summarize(result.live.gpu) },
    baked: { submission: summarize(result.baked.submission), gpu: summarize(result.baked.gpu) },
  } };
}
