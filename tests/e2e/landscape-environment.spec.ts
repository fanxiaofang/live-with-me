import { frontEdgeY } from '../../src/world/scene/fieldEdges';
import { expect, test } from '@playwright/test';
import { stableScene } from './helpers';

test('rooted landscape and the original ground projection survive zoom and pan', async ({ page }) => {
  await stableScene(page, '/tests/fixtures/world.html');
  const contactPoints=[-150,200,690,1110].map(x=>({x,y:frontEdgeY(x)}));
  const contacts = () => page.evaluate(({points}) => {
    const $ = (s:string) => document.querySelector(s) as SVGGraphicsElement;
    const field = $('#parallax-wheat-layer'), ground = $('#panoramic-world-stage');
    const meadow = $('#master-axonometric-ground-plane > path:nth-of-type(2)') as SVGGeometryElement;
    const surface = $('[data-foothill-surface]') as SVGGeometryElement;
    const f=new DOMMatrix(getComputedStyle(field).transform),g=new DOMMatrix(getComputedStyle(ground).transform);
    const projection = (s: string) => {
      const { a, b, c, d, e, f } = $(s).getScreenCTM()!;
      return [a, b, c, d, e, f].join(',');
    };
    const projects = Math.abs(f.a-(.66+(g.a-.66)*.7))<.0002 && Math.abs(f.e-g.e*.65)<.01 && Math.abs(f.f-(135+(g.f-135)*.55))<.01
      && ['#parallax-foothill-layer','#parallax-foothill-trees-layer']
        .every(s => projection(s) === projection('#f2-nearest-landmarks'))
      && projection('#parallax-railway-layer') === projection('#parallax-mountains-layer');
    const wheel = new DOMPoint(22,46).matrixTransform($('#tractor-in-field').getScreenCTM()!).matrixTransform(meadow.getScreenCTM()!.inverse());
    const landforms=[surface,...document.querySelectorAll<SVGGeometryElement>('[data-meadow-hill-body] > path')];
    const roots = [...document.querySelectorAll('[data-surface-root]')].every(e => {
      const screen = new DOMPoint(0,0).matrixTransform((e as SVGGraphicsElement).getScreenCTM()!);
      return landforms.some(landform=>landform.isPointInFill(screen.matrixTransform(landform.getScreenCTM()!.inverse())));
    });
    const bales = [...document.querySelectorAll('#perspective-hay-bales > g')].every(e => {
      const p = new DOMPoint(0,17.5).matrixTransform((e as SVGGraphicsElement).getScreenCTM()!).matrixTransform(meadow.getScreenCTM()!.inverse());
      return !meadow.isPointInFill(p);
    });
    const crop=$('#organic-rolling-wheat-fields > path') as SVGGeometryElement;
    // Suspended supports deliberately have no terrain-contact contract. Their
    // detached stones must remain separated and travel with the railway layer.
    const supports = [...document.querySelectorAll('[data-suspended-pier]')];
    const floating = supports.filter(e => e.querySelector('[data-floating-body]'));
    const bridgeSuspended = supports.length === 8 && floating.length === 3
      && !document.querySelector('#viaduct-pier-grounding-foliage, #viaduct-pier-ground-shadows')
      && floating.every(e => {
        const body = e.querySelector('[data-pier-body]')!.getBoundingClientRect();
        const stone = e.querySelector('[data-floating-body]')!.getBoundingClientRect();
        return stone.top > body.bottom && stone.left < body.right && stone.right > body.left;
      });
    const seam=points.every(p=>{const q=new DOMPoint(p.x,p.y).matrixTransform(meadow.getScreenCTM()!);
      const above=new DOMPoint(q.x,q.y-.6),below=new DOMPoint(q.x,q.y+.6);
      return crop.isPointInFill(above.matrixTransform(crop.getScreenCTM()!.inverse()))
        && !meadow.isPointInFill(above.matrixTransform(meadow.getScreenCTM()!.inverse())) && meadow.isPointInFill(below.matrixTransform(meadow.getScreenCTM()!.inverse()));
    });
    const independentGrass = projection('#master-axonometric-ground-plane') === projection('#panoramic-world-stage')
      && !document.querySelector('#field-meadow-contact-clip');
    return {projects,seam, independentGrass, wheelVisible: !meadow.isPointInFill(wheel), roots, bales, bridgeSuspended,
      railwaySeparate: !$('#parallax-mountains-layer').contains($('#yorkshire-railway-viaduct')) && $('#parallax-railway-layer').contains($('#yorkshire-railway-viaduct'))};
  },{points:contactPoints});
  const all = {projects:true,seam:true,independentGrass:true,wheelVisible:true,roots:true,bales:true,bridgeSuspended:true,railwaySeparate:true};
  expect(await contacts()).toEqual(all);
  // Field props can be naturally occluded by nearer grass after large zooms.
  // Check their overview clearance without requiring a crop-locked grass edge.
  const spatial = async () => {
    const { wheelVisible, bales, ...relationship } = await contacts();
    return relationship;
  };
  const { wheelVisible, bales, ...relationships } = all;
  for (const zoom of [1.05,1.6,.45,2.5,.66]) {
    await page.locator('#panoramic-world-stage').evaluate((e,z) => e.closest('svg')!.dispatchEvent(new WheelEvent('wheel', {deltaY:(Number(e.getAttribute('data-zoom'))-z)/.0012,bubbles:true,cancelable:true})), zoom);
    await expect.poll(spatial).toEqual(relationships);
  }
  await page.mouse.move(90,80); await page.mouse.down(); await page.mouse.move(210,130,{steps:8}); await page.mouse.up();
  expect(await spatial()).toEqual(relationships);
  // Motion is checked separately without the stable-scene helper.
  await page.locator('#room-living_nook').dispatchEvent('click');
  await expect.poll(spatial).toEqual(relationships);
  await page.getByTitle('重置为田园全景').click();
  await expect.poll(spatial).toEqual(relationships);
});

for (const failure of ['initialization','shader'] as const) {
  test(`background ${failure} failure retains the current SVG landform and usable scene`, async ({ page }) => {
    if (failure === 'initialization') await page.addInitScript(()=>{
      const original=HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:string,...args:unknown[]){
        return type.includes('webgl') ? null : (original as Function).call(this,type,...args);
      } as typeof original;
    });
    else await page.addInitScript(()=>{
      const original=WebGL2RenderingContext.prototype.shaderSource;
      WebGL2RenderingContext.prototype.shaderSource=function(shader,source){original.call(this,shader,source+'\nFORCED_BACKGROUND_SHADER_ERROR');};
    });
    await page.goto('/tests/fixtures/world.html');
    await page.locator('[data-hills-failure]').waitFor();
    await expect(page.locator('[data-f2-hills] canvas')).toHaveCount(0);
    await expect(page.locator('[data-transition-tree]')).toHaveCount(31);
    await expect(page.locator('[data-meadow-entrance]')).toHaveCount(1);
    await expect(page.locator('[data-meadow-study]')).toHaveAttribute('data-meadow-study','complete');
    await page.locator('#room-living_nook').dispatchEvent('click');
    await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('data-room','living_nook');
  });
}

test('real environment switching keeps source sky, B, mesh identities and an idle renderer', async ({ page }) => {
  await page.goto('/'); await page.locator('[data-hills-mode="f2"]').waitFor();
  const stats = () => page.locator('[data-f2-hills]').evaluate(e => JSON.parse((e as HTMLElement).dataset.stats!));
  const original = await stats();
  for (const [label,environment] of [['黄昏','dusk'],['夜晚','night'],['白天','day']]) {
    await page.getByRole('button',{name:label,exact:true}).click();
    await expect.poll(async()=>{const s=await stats();return s.environment===environment&&s.environmentProgress===1;}).toBe(true);
    const current=await stats();
    expect(current.materialIds).toEqual(original.materialIds); expect(current.geometryIds).toEqual(original.geometryIds);
    expect(current.environmentOwner).toBe('source-v2'); expect(current.drawCalls).toBe(4);
    expect(current.mode).toBe('B'); expect(current.skyDither).toBe(true);
    await expect(page.locator('[data-f2-hills] canvas')).toHaveCount(1);
  }
  const settled=(await stats()).renderSamples; await page.waitForTimeout(250);
  expect((await stats()).renderSamples).toBe(settled);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  await page.getByRole('button',{name:'夜晚',exact:true}).click(); await page.waitForTimeout(150);
  expect((await stats()).renderSamples).toBe(settled);
  await page.evaluate(()=>{delete (document as unknown as {hidden?:boolean}).hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await expect.poll(async()=>{const s=await stats();return s.environment==='night'&&s.environmentProgress===1;}).toBe(true);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.getByRole('button',{name:'白天',exact:true}).click();
  await expect.poll(async()=> { const s=await stats(); return s.environment==='day'&&s.environmentProgress===1; }).toBe(true);
});

test('unmount releases the complete background renderer and remount retains one canvas', async ({ page }) => {
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    (window as unknown as {ownedContexts:WebGLRenderingContext[]}).ownedContexts=[];
    HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:string,...args:unknown[]){
      const result=(original as Function).call(this,type,...args);
      const list=(window as unknown as {ownedContexts:WebGLRenderingContext[]}).ownedContexts;
      if(result&&type.includes('webgl')&&!list.includes(result))list.push(result);
      return result;
    } as typeof original;
  });
  await page.goto('/tests/fixtures/f2-lifecycle.html');
  for(let i=0;i<2;i++){
    await page.locator('[data-hills-mode="f2"]').waitFor();
    await expect(page.locator('[data-f2-hills] canvas')).toHaveCount(1);
    await page.getByRole('button',{name:'切换世界挂载'}).click();
    await expect(page.locator('[data-f2-hills]')).toHaveCount(0);
    expect(await page.evaluate(()=>(window as unknown as {ownedContexts:WebGLRenderingContext[]}).ownedContexts.every(c=>c.isContextLost()))).toBe(true);
    await page.getByRole('button',{name:'切换世界挂载'}).click();
  }
});
