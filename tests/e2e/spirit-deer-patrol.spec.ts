import {test,expect} from '@playwright/test';

test('灵鹿巡视锁地生花，编辑与减少动态时回原位，且不改布局存档',async({page})=>{
  // Drive the real React/renderer/ground chain with controlled animation time.
  // Wall-clock polling can skip an entire transition on a slow software GPU.
  test.setTimeout(240000);
  const errors:string[]=[],warnings:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',msg=>{if(msg.type()==='warning'&&msg.text().includes('Spirit deer'))warnings.push(msg.text());});
  const epoch=new Date('2026-11-19T12:00:00Z');
  await page.clock.install({time:epoch});
  await page.clock.pauseAt(new Date(epoch.getTime()+1000));
  let clock=0;
  const advanceTo=async(seconds:number)=>{await page.clock.fastForward(Math.round((seconds-clock)*1000));clock=seconds;};
  await page.setViewportSize({width:1440,height:1000});
  // Finish initial scene/shader loading before starting the real patrol clock.
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/?wearTime=night');
  const deer=page.locator('[data-deer-apparition]');
  await expect(deer).toHaveAttribute('data-spirit-renderer','webgl',{timeout:60000});
  const saved=await page.evaluate(()=>localStorage.getItem('live_with_me_yard_layout_v1'));
  await deer.evaluate(node=>{
    const samples:{time:number;phase:string;opacity:number;light:number;x:number;state:string}[]=[];
    (window as unknown as {deerEffectSamples:typeof samples}).deerEffectSamples=samples;
    new MutationObserver(()=>{
      const phase=node.getAttribute('data-deer-effect-phase')??'none';
      if(phase==='none')return;
      samples.push({time:Number(node.getAttribute('data-deer-patrol-time')),phase,opacity:Number(node.getAttribute('data-deer-opacity')),light:Number(document.querySelector('[data-deer-moving-light]')?.getAttribute('opacity')),x:Number(node.getAttribute('transform')?.match(/translate\(([-\d.]+)/)?.[1]??0),state:node.getAttribute('data-deer-patrol')??''});
    }).observe(node,{attributes:true,attributeFilter:['data-deer-patrol-time']});
  });
  await expect(deer).toHaveAttribute('data-deer-patrol','watch');
  await page.emulateMedia({reducedMotion:'no-preference'});
  expect(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(false);
  // A paused browser clock needs an explicit visible-page resume notification.
  await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
  // Deliver the media-change handler and prime its first RAF before a large jump.
  await page.clock.runFor(100);clock=.1;
  await advanceTo(25);
  await expect(deer).toHaveAttribute('data-deer-patrol','walk-out');
  const flowers=page.locator('[data-deer-footprint]');
  await expect.poll(()=>flowers.evaluateAll(nodes=>nodes.some(n=>Number(n.getAttribute('opacity'))>.05)),{timeout:12000}).toBe(true);
  const visibleFlower=await flowers.evaluateAll(nodes=>nodes.findIndex(n=>Number(n.getAttribute('opacity'))>.05));
  expect(visibleFlower).toBeGreaterThanOrEqual(0);
  const flower=flowers.nth(visibleFlower),birth=await flower.getAttribute('transform');
  await advanceTo(25.3);
  const moved=await flower.getAttribute('transform');
  expect(moved?.split(' scale(')[0]).toBe(birth?.split(' scale(')[0]);
  await advanceTo(39);
  expect(Number((await deer.getAttribute('transform'))?.match(/translate\(([-\d.]+)/)?.[1])).toBeGreaterThan(390);
  await page.screenshot({path:'test-results/deer-patrol-fixed-scene.png'});
  for(const time of [39.6,40.5,41.5,42.1,43.5,44.9,45.2,46,47.1])await advanceTo(time);
  await expect(deer).toHaveAttribute('data-deer-patrol','walk-home');
  const effects=await page.evaluate(()=>(window as unknown as {deerEffectSamples:{time:number;phase:string;opacity:number;light:number;x:number;state:string}[]}).deerEffectSamples);
  const scatter=effects.filter(s=>s.phase==='dispersing');
  expect(scatter.every(s=>s.state==='walk-out')).toBe(true);
  expect(scatter.at(-1)!.x-scatter[0].x).toBeGreaterThan(.5);
  expect(Math.max(...scatter.map(s=>s.x))).toBeGreaterThan(430);
  const absent=effects.filter(s=>s.phase==='absent');
  expect(absent.length).toBeGreaterThan(2);
  expect(absent.at(-1)!.time-absent[0].time).toBeGreaterThan(2.5);
  expect(absent.every(s=>s.opacity===0&&s.light===0)).toBe(true);
  const condensed=effects.find(s=>s.phase==='condensing')!;
  expect(condensed.time-absent[0].time).toBeGreaterThan(2.7);
  expect(condensed.time-absent[0].time).toBeLessThan(3.3);
  await page.getByRole('button',{name:'布置庭院',exact:true}).click();
  await advanceTo(47.2);
  await expect(deer).toHaveAttribute('data-deer-patrol-enabled','false');
  await expect(deer).toHaveAttribute('data-deer-patrol','watch');
  await expect(deer).toHaveAttribute('data-deer-patrol-time','0.00');
  expect(await deer.getAttribute('transform')).toBeNull();
  const panel=page.getByRole('complementary',{name:'庭院布置',exact:true});
  await panel.getByLabel('选择庭院物件').selectOption('gate_spirit_deer');
  await expect(page.locator('[data-yard-object="gate_spirit_deer"] > rect[stroke="#f4d99e"]')).toHaveAttribute('width','146');
  await panel.getByRole('button',{name:'完成庭院布置',exact:true}).click();
  await expect(deer).toHaveAttribute('data-deer-patrol-enabled','true');
  await advanceTo(47.3);
  expect(Number(await deer.getAttribute('data-deer-patrol-time'))).toBeGreaterThan(.05);
  await expect(deer).toHaveAttribute('data-deer-patrol','watch');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(deer).toHaveAttribute('data-deer-patrol','watch');
  await expect(deer).toHaveAttribute('data-deer-patrol-time','0.00');
  expect(await deer.getAttribute('transform')).toBeNull();
  await page.getByRole('button',{name:'白天',exact:true}).click();
  await expect(deer).toHaveCount(0);
  expect(await page.evaluate(()=>localStorage.getItem('live_with_me_yard_layout_v1'))).toBe(saved);
  expect(errors).toEqual([]);expect(warnings).toEqual([]);
});
