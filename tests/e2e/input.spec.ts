import {test,expect} from '@playwright/test';
import {stableScene} from './helpers';

for(const viewport of [{width:1200,height:800},{width:1600,height:900},{width:390,height:844}]) {
  for(const zoom of [0.66,1.6,2.5]) {
    test(`parent CTM free drag ${viewport.width}x${viewport.height} zoom=${zoom}`,async({page})=>{
      await page.setViewportSize(viewport);
      await stableScene(page,'/tests/fixtures/world.html?edit=record-player&focusRoom=my_room&entity=main_cottage&scale=0.8');
      const stage=page.locator('#panoramic-world-stage');
      // Fixture UI sends the native wheel command before enabling the editor.
      await page.getByTestId('fixture-zoom').fill(String(zoom));
      await expect(stage).toHaveAttribute('data-zoom',String(zoom));
      const handle=page.locator('[data-gizmo-axis="free"]');
      const start=await handle.evaluate(e=>{const p=new DOMPoint(0,0).matrixTransform((e as SVGGraphicsElement).getScreenCTM()!);return {x:p.x,y:p.y};});
      const before=await stage.getAttribute('style');
      await page.mouse.move(start.x,start.y);
      await page.mouse.down();
      await page.mouse.move(start.x+40,start.y+25,{steps:5});
      expect(await page.evaluate(()=>localStorage.getItem('live_with_me_room_layout_v6'))).toBeNull();
      const end=await handle.evaluate(e=>{const p=new DOMPoint(0,0).matrixTransform((e as SVGGraphicsElement).getScreenCTM()!);return {x:p.x,y:p.y};});
      expect(Math.hypot(end.x-start.x-40,end.y-start.y-25)).toBeLessThanOrEqual(1);
      await page.mouse.up();
      const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('live_with_me_room_layout_v6')!));
      expect(saved['record-player'].screen.x).not.toBe(-6.7);
      expect(await stage.getAttribute('style')).toBe(before);
    });
  }
}

test('cancel and lost capture restore layout without saving; axis drag follows its parent vector',async({page})=>{
  await stableScene(page,'/tests/fixtures/world.html?edit=cabinet-group&focusRoom=my_room');
  const handle=page.locator('[data-gizmo-axis="free"]');
  const point=async()=>handle.evaluate(e=>{const p=new DOMPoint(0,0).matrixTransform((e as SVGGraphicsElement).getScreenCTM()!);return {x:p.x,y:p.y};});
  const start=await point();
  for(const event of ['pointercancel','lostpointercapture']) {
    await page.mouse.move(start.x,start.y);await page.mouse.down();
    await page.mouse.move(start.x+30,start.y+20,{steps:3});
    await handle.dispatchEvent(event,{pointerId:1});
    await page.mouse.up();
    const end=await point();
    expect(Math.hypot(end.x-start.x,end.y-start.y)).toBeLessThan(0.01);
    expect(await page.evaluate(()=>localStorage.getItem('live_with_me_room_layout_v6'))).toBeNull();
  }
  const axis=page.locator('[data-gizmo-axis="u"]');
  const box=(await axis.boundingBox())!;
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();
  await page.mouse.move(box.x+box.width/2+35,box.y+box.height/2+8,{steps:4});await page.mouse.up();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('live_with_me_room_layout_v6')!));
  const p=saved['cabinet-group'].screen;
  expect((p.y-75)/(p.x+72)).toBeCloseTo(-0.2852,4);
});

test('manual pan uses root SVG deltas, suppresses navigation, cancels, and the selected room refocuses',async({page})=>{
  await stableScene(page);
  await page.getByRole('button',{name:'我的阁楼房间',exact:true}).click();
  const stage=page.locator('#panoramic-world-stage');
  const original=await stage.getAttribute('style');
  await page.mouse.move(800,180);await page.mouse.down();await page.mouse.move(840,210,{steps:4});await page.mouse.up();
  await expect(stage).toHaveAttribute('style',/translate\(260px, 180px\)/);
  await page.getByRole('button',{name:'我的阁楼房间',exact:true}).click();
  expect(await stage.getAttribute('style')).toBe(original);
  await page.mouse.move(800,180);await page.mouse.down();await page.mouse.move(830,195,{steps:3});
  await page.locator('#panoramic-world-stage').dispatchEvent('pointercancel',{pointerId:1});await page.mouse.up();
  expect(await stage.getAttribute('style')).toBe(original);
});

test('left-wall shear is included in the editable parent inverse',async({page})=>{
  await stableScene(page,'/tests/fixtures/world.html?edit=craft-tool-wall&focusRoom=my_room');
  const handle=page.locator('[data-gizmo-axis="free"]');
  const point=async()=>handle.evaluate(e=>{const p=new DOMPoint(0,0).matrixTransform((e as SVGGraphicsElement).getScreenCTM()!);return {x:p.x,y:p.y};});
  const start=await point();
  await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(start.x+25,start.y+15,{steps:4});await page.mouse.up();
  const end=await point();
  expect(Math.hypot(end.x-start.x-25,end.y-start.y-15)).toBeLessThanOrEqual(1);
});

test('storage quota failure keeps the memory edit and shows one gentle warning',async({page})=>{
  await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Quota','QuotaExceededError');};});
  await stableScene(page);
  await page.getByRole('button',{name:'全屋 2.5D 布局校准器',exact:true}).click();
  await page.getByText('北欧轻量咖啡黑胶柜 (整体)',{exact:true}).click();
  await page.getByRole('button',{name:'→',exact:true}).click();
  await expect(page.getByText('布局已更新，但本地保存失败；请保持当前页面打开。',{exact:true})).toHaveCount(1);
  await page.getByRole('button',{name:'→',exact:true}).click();
  await expect(page.locator('#isometric-turntable-console')).toHaveAttribute('transform','translate(-70, 75)');
});

test('one-to-two-to-one touch switching rebases smoothly and cancels the whole gesture',async({page})=>{
  await stableScene(page,'/tests/fixtures/world.html');
  const stage=page.locator('#panoramic-world-stage');
  const initial=await stage.getAttribute('style');
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:500,y:160,id:1}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:520,y:170,id:1}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:520,y:170,id:1},{x:700,y:170,id:2}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:510,y:170,id:1},{x:710,y:170,id:2}]});
  const pinch=await stage.getAttribute('style');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[{x:710,y:170,id:2}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:520,y:170,id:1}]});
  const after=await stage.getAttribute('style');
  const translation=(value:string|null)=>Number(value!.match(/translate\(([^p]+)px/)![1]);
  expect(translation(after)-translation(pinch)).toBeCloseTo(10,3);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
  expect(await stage.getAttribute('style')).toBe(initial);
});

test('editor gestures and scene clicks cannot navigate or pan',async({page})=>{
  await stableScene(page,'/tests/fixtures/world.html?edit=cabinet-group&focusRoom=my_room');
  const stage=page.locator('#panoramic-world-stage');
  const initial=await stage.getAttribute('style');
  await page.locator('#room-friend_room').click({force:true});
  expect(await stage.getAttribute('style')).toBe(initial);
  await page.mouse.move(800,160);await page.mouse.down();await page.mouse.move(850,190,{steps:3});await page.mouse.up();
  expect(await stage.getAttribute('style')).toBe(initial);
});
