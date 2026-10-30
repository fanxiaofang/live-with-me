import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import baseline from '../../src/world/render/f2/config/baseline.json' with { type: 'json' };
import { WorldViewAdapter } from '../../src/world/render/f2/vendor/backdrop/WorldViewAdapter.js';
import { frontEdgeY } from '../../src/world/scene/fieldEdges';

const output = path.resolve('docs/visual-system/f2-distance-response-2026-10-24');
test.use({video:{mode:'on',size:{width:960,height:540}}});

// Only read rendered meshes, actual SVG matrices and the visible contour. The
// expected response below comes from the original experiment, not the host adapter.
function installProbe(edgeY: number) {
  const read = () => {
    const $ = (selector: string) => document.querySelector(selector) as SVGGraphicsElement;
    const host = document.querySelector('[data-f2-hills]') as HTMLElement;
    const stats = JSON.parse(host.dataset.stats!);
    const rect = host.getBoundingClientRect();
    const matrix = (selector: string) => {
      const m = new DOMMatrix(getComputedStyle($(selector)).transform);
      return { x: m.e, y: m.f, zoom: m.a };
    };
    const point = (selector: string, x: number, y: number) => {
      const p = new DOMPoint(x,y).matrixTransform($(selector).getScreenCTM()!);
      return {x:p.x,y:p.y};
    };
    const roots = [...document.querySelectorAll('[data-surface-root], [data-farmstead-root]')].map(element => {
      const e = element as SVGGraphicsElement;
      const world = (e.getAttribute('data-surface-root') || e.getAttribute('data-farmstead-root'))!.split(',').map(Number);
      const box = e.getBBox();
      const p = new DOMPoint(0,e.hasAttribute('data-farmstead-root') ? box.y+box.height : 0).matrixTransform(e.getScreenCTM()!);
      return {world,screen:{x:p.x,y:p.y}};
    });
    const grass = $('#master-axonometric-ground-plane > path:nth-of-type(2)');
    const grassMatrix = grass.getScreenCTM()!, stageMatrix = $('#panoramic-world-stage').getScreenCTM()!;
    return {
      stats, rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},
      camera:matrix('#panoramic-world-stage'), clock:matrix('#parallax-mountains-layer'),
      field:matrix('#parallax-wheat-layer'), railway:matrix('#parallax-railway-layer'), roots,
      grass:point('#master-axonometric-ground-plane > path:nth-of-type(2)',200,edgeY),
      tractor:point('#tractor-in-field',22,46),
      railPoint:point('#parallax-railway-layer',600,100),
      grassUsesStage:['a','b','c','d','e','f'].every(k=>Math.abs(grassMatrix[k as keyof SVGMatrix] as number-(stageMatrix[k as keyof SVGMatrix] as number))<1e-6),
      legacyHidden:['lawn-natural-grass-tufts','clover-turf-patches','meadow-field-blossoms','beehive-meadow-grass','beehive-meadow-wildflowers','beehive-lavender-flowers']
        .every(id=>getComputedStyle(document.getElementById(id)!).display==='none'),
      noCropClip:!document.querySelector('#field-meadow-contact-clip') && !!grass.closest('#panoramic-world-stage'),
      rootsOutsideClock:!$('#parallax-mountains-layer').contains($('#f2-nearest-landmarks')),
    };
  };
  const probe = {read,frames:[] as ReturnType<typeof read>[],active:false};
  (window as unknown as {distanceProbe:typeof probe}).distanceProbe = probe;
}
// Browser functions are serialized by Playwright; keep their shared type structural.
type Sample = { stats:any; rect:{x:number;y:number;width:number;height:number}; camera:{x:number;y:number;zoom:number};
  clock:{x:number;y:number;zoom:number}; field:{x:number;y:number;zoom:number}; railway:{x:number;y:number;zoom:number};
  roots:{world:number[];screen:{x:number;y:number}}[]; grass:{x:number;y:number}; tractor:{x:number;y:number};
  railPoint:{x:number;y:number}; grassUsesStage:boolean;legacyHidden:boolean;noCropClip:boolean;rootsOutsideClock:boolean };
type Probe = {read:()=>Sample;frames:Sample[];active:boolean};

function errors(s: Sample) {
  const {width,height}=s.rect, fit=Math.max(width/1200,height/800), unit=2/height;
  const left=(width-1200*fit)/2,top=(height-800*fit)/2,p=s.stats.placement;
  let meshError=0,rootError=0;
  for(const [i,layer] of baseline.layers.entries()) {
    const response=WorldViewAdapter({camera:s.camera,viewport:{width,height}},layer.response).backdrop;
    const originX=left+fit*(600+.66*(p.centerX+p.offsetX-600));
    const originY=top+fit*(400+.66*(p.horizonY+p.offsetY+p.layerOffsetY[i]-400)+135);
    const expected={x:(originX-width/2)*unit+response.x,y:(height/2-originY)*unit+response.y,
      scale:p.unitsPerDesignUnit*p.scale*p.layerScale[i]*.66*fit*unit*response.scale};
    const actual=s.stats.transforms[i];
    meshError=Math.max(meshError,Math.abs(expected.x-actual.x)/unit,Math.abs(expected.y-actual.y)/unit,
      Math.abs(expected.scale-actual.scale)/unit);
  }
  const nearest=s.stats.transforms[2],units=p.unitsPerDesignUnit*p.scale*p.layerScale[2];
  for(const root of s.roots) {
    const u=(root.world[0]-p.centerX-p.offsetX)/units;
    const v=(p.horizonY+p.offsetY+p.layerOffsetY[2]-(root.world[1]-115))/units;
    const expected={x:s.rect.x+width/2+(nearest.x+u*nearest.scale)/unit,
      y:s.rect.y+height/2-(nearest.y+v*nearest.scale)/unit};
    rootError=Math.max(rootError,Math.hypot(expected.x-root.screen.x,expected.y-root.screen.y));
  }
  const groundError=Math.max(Math.abs(s.field.x-s.camera.x*.65)*fit,
    Math.abs(s.field.y-(135+(s.camera.y-135)*.55))*fit,
    Math.abs(s.field.zoom-(.66+(s.camera.zoom-.66)*.7))*fit*400,
    Math.abs(s.railway.x-s.camera.x*.28)*fit,
    Math.abs(s.railway.y-(135+(s.camera.y-135)*.2))*fit,
    Math.abs(s.railway.zoom-(.66+(s.camera.zoom-.66)*.4))*fit*400);
  return {meshError,rootError,groundError};
}
const read = (page: Page):Promise<Sample> => page.evaluate(()=>(window as unknown as {distanceProbe:Probe}).distanceProbe.read());
async function settled(page:Page) {
  await expect.poll(async()=>{
    const s=await read(page),e=errors(s);
    return Math.max(e.meshError,e.rootError,e.groundError);
  }).toBeLessThan(.15);
}
function assertSample(s:Sample) {
  const e=errors(s);
  expect(e.meshError,JSON.stringify(e)).toBeLessThan(.15);
  expect(e.rootError,JSON.stringify(e)).toBeLessThan(.01);
  expect(e.groundError,JSON.stringify(e)).toBeLessThan(.15);
  expect(s.roots).toHaveLength(27);
  expect(s.grassUsesStage && s.legacyHidden && s.noCropClip && s.rootsOutsideClock).toBe(true);
  expect(s.stats.responseOwner).toBe('source-v2');
}

for(const [width,height] of [[1600,900],[390,844]]) {
  test(`source ridge response and real SVG roots agree at ${width}px through zoom and bounded pan`,async({page})=>{
    await fs.mkdir(output,{recursive:true});
    await page.setViewportSize({width,height});
    await page.goto('/tests/fixtures/world.html');
    await page.locator('[data-hills-mode=f2]').waitFor();
    await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
    await page.evaluate(()=>document.querySelectorAll('svg').forEach(s=>{s.pauseAnimations();s.setCurrentTime(0)}));
    await page.evaluate(installProbe,frontEdgeY(200));
    const samples=[];
    for(const zoom of [.66,1.18,1.6,.45,2.5,.66]) {
      await page.locator('#panoramic-world-stage').evaluate((e,z)=>e.closest('svg')!.dispatchEvent(new WheelEvent('wheel',{
        deltaY:(Number(e.getAttribute('data-zoom'))-z)/.0012,bubbles:true,cancelable:true})),zoom);
      await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('data-zoom',String(zoom));
      await settled(page);
      const s=await read(page);assertSample(s);samples.push({action:'zoom-'+zoom,snapshot:s,errors:errors(s)});
    }
    await page.getByTitle('重置为田园全景').click();await settled(page);
    const before=await read(page);
    await page.mouse.move(150,80);await page.mouse.down();await page.mouse.move(85,80,{steps:8});await page.mouse.up();
    await settled(page);
    const after=await read(page);assertSample(after);
    const delta=after.grass.x-before.grass.x;
    expect(Math.abs(delta)).toBeGreaterThan(10);
    expect(after.tractor.x-before.tractor.x).toBeCloseTo(delta*.65,1);
    expect(after.railPoint.x-before.railPoint.x).toBeCloseTo(delta*.28,1);
    const ridges=after.stats.transforms.map((p:any,i:number)=>(p.x-before.stats.transforms[i].x)*height/2);
    for(const [i,response] of [0,.015,.035].entries()) expect(ridges[i]).toBeCloseTo(delta*response,1);
    samples.push({action:'pan',snapshot:after,errors:errors(after)});
    await page.screenshot({path:path.join(output,`panned-${width}.png`)});
    await fs.writeFile(path.join(output,`response-${width}.json`),JSON.stringify({passed:true,delta,ridges,samples},null,2));
  });
}

test('actual homepage keeps distance, grounding and independent field/grass motion through interrupted camera easing',async({page})=>{
  test.setTimeout(90000);
  await page.setViewportSize({width:1600,height:900});
  await fs.mkdir(output,{recursive:true});
  const pageErrors:string[]=[];page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto('/');await page.locator('[data-hills-mode=f2]').waitFor();
  await page.getByRole('button',{name:'白天',exact:true}).click();
  await page.getByRole('button',{name:'收起面板（查看完整约克郡风光）',exact:true}).click();
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important}'});
  await page.evaluate(()=>document.querySelectorAll('svg').forEach(s=>{s.pauseAnimations();s.setCurrentTime(0)}));
  await page.evaluate(installProbe,frontEdgeY(200));await settled(page);
  await page.screenshot({path:path.join(output,'after-overview.png')});
  await page.evaluate(()=>{
    const p=(window as unknown as {distanceProbe:Probe}).distanceProbe;p.active=true;
    // Observe publication of a completed render, before the next paint. A timer
    // between frames can see a new React commit paired with the previous canvas.
    const observer=new MutationObserver(()=>{if(p.active)p.frames.push(p.read());});
    observer.observe(document.querySelector('[data-f2-hills]')!,{attributes:true,attributeFilter:['data-stats']});
  });
  await page.getByRole('button',{name:'公共起居角',exact:true}).click();
  await page.waitForTimeout(110);
  await page.getByRole('button',{name:'整栋小屋',exact:true}).click();
  await page.waitForTimeout(90);
  await page.getByRole('button',{name:'公共起居角',exact:true}).click();
  await page.waitForTimeout(550);await settled(page);
  await page.screenshot({path:path.join(output,'after-living.png')});
  const before=await read(page);
  await page.mouse.move(900,200);await page.mouse.down();await page.mouse.move(1020,260,{steps:8});await page.mouse.up();
  await page.waitForTimeout(500);await settled(page);
  const after=await read(page);
  expect(after.grass.x-before.grass.x).toBeCloseTo(120,1);
  expect(after.tractor.x-before.tractor.x).toBeCloseTo(78,1);
  expect(after.grass.y-before.grass.y).toBeCloseTo(60,1);
  expect(after.tractor.y-before.tractor.y).toBeCloseTo(33,1);
  await page.getByRole('button',{name:'整栋小屋',exact:true}).click();
  await page.waitForTimeout(550);await settled(page);
  const frames=await page.evaluate(()=>{const p=(window as unknown as {distanceProbe:Probe}).distanceProbe;p.active=false;return p.frames;});
  const framePath=test.info().outputPath('rendered-motion-frames.json');
  await fs.writeFile(framePath,JSON.stringify(frames));
  await test.info().attach('rendered-motion-frames',{path:framePath,contentType:'application/json'});
  expect(frames.length).toBeGreaterThan(8);frames.forEach(assertSample);
  const materialIds=(await read(page)).stats.materialIds;
  for(const [label,id] of [['黄昏','dusk'],['夜晚','night'],['白天','day']]) {
    await page.getByRole('button',{name:label,exact:true}).click();
    await expect.poll(async()=>{const s=await read(page);return s.stats.environment===id&&s.stats.environmentProgress===1;}).toBe(true);
    const s=await read(page);assertSample(s);expect(s.stats.materialIds).toEqual(materialIds);
    await page.screenshot({path:path.join(output,`after-${id}.png`)});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.getByRole('button',{name:'公共起居角',exact:true}).click();await settled(page);assertSample(await read(page));
  await expect(page.locator('#panoramic-world-stage')).toHaveCSS('transition-duration','0s');
  const idle=(await read(page)).stats.renderSamples;await page.waitForTimeout(600);const idleEnd=(await read(page)).stats.renderSamples;
  await page.waitForTimeout(250);expect((await read(page)).stats.renderSamples).toBe(idleEnd);
  expect(idleEnd).toBeGreaterThanOrEqual(idle);
  expect(pageErrors).toEqual([]);
  const maximum=(key:keyof ReturnType<typeof errors>)=>Math.max(...frames.map(s=>errors(s)[key]));
  await fs.writeFile(path.join(output,'motion.json'),JSON.stringify({passed:true,frames:frames.length,
    maximumMeshErrorPx:maximum('meshError'),maximumRootErrorPx:maximum('rootError'),maximumGroundErrorPx:maximum('groundError'),
    grassDelta:{x:after.grass.x-before.grass.x,y:after.grass.y-before.grass.y},
    tractorDelta:{x:after.tractor.x-before.tractor.x,y:after.tractor.y-before.tractor.y},pageErrors,samples:frames},null,2));
  await page.getByRole('button',{name:'整栋小屋',exact:true}).click();await settled(page);
  await page.setViewportSize({width:390,height:844});await settled(page);assertSample(await read(page));
  await page.screenshot({path:path.join(output,'after-mobile.png')});
  expect(pageErrors).toEqual([]);
  const video=page.video();await page.close();await video?.saveAs(path.join(output,'motion.webm'));
});
