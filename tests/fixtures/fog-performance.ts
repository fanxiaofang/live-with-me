import { createHillFootFog } from '../../src/world/render/f2/HillFootFog';
import { F2_STUDIES } from '../../src/world/render/f2/f2Config';

const host=document.querySelector<HTMLElement>('#fog-host')!;
const button=document.querySelector<HTMLButtonElement>('#start')!;
const status=document.querySelector<HTMLElement>('#status')!;
const output=document.querySelector<HTMLElement>('#result-json')!;
button.addEventListener('click',async()=>{
  button.disabled=true;
  status.textContent='正在预热并测量；请保持此页可见。';
  const fog=createHillFootFog(host,()=>{});
  try {
    const result=await fog.measurePerformance({width:1600,height:900,camera:{x:0,y:207.104,zoom:.54}},F2_STUDIES.refined.placement);
    const cache=JSON.parse(host.querySelector<HTMLCanvasElement>('canvas')!.dataset.fogBake!);
    const data={...result,cache,measuredAt:new Date().toISOString()};
    output.textContent=JSON.stringify(data,null,2);
    const fmt=(n:number|null)=>n===null?'不可用':n.toFixed(3)+' ms';
    document.querySelector('#summary')!.innerHTML=`<table style="border-spacing:20px 8px"><tr><th>雾层</th><th>GPU 中位耗时</th><th>CPU 提交中位耗时</th></tr><tr><td>实时 C+</td><td>${fmt(result.summary.live.gpu.medianMs)}</td><td>${fmt(result.summary.live.submission.medianMs)}</td></tr><tr><td>烘焙缓存</td><td>${fmt(result.summary.baked.gpu.medianMs)}</td><td>${fmt(result.summary.baked.submission.medianMs)}</td></tr></table><p>缓存纹理：${cache.width} × ${cache.height} ${cache.format}；烘焙次数 ${cache.bakeCount}（含一次主动重烘焙测试）</p><p>着色器预热后的单次重烘焙 GPU：${fmt(result.warmRebake.gpuMs)}；含一次合成。</p>`;
    status.textContent='测量完成';status.dataset.complete='true';
  } catch(error) { status.textContent=String(error);status.dataset.complete='error'; }
  finally { fog.dispose(); }
});
