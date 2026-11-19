import { expect, test } from '@playwright/test';

test('麦田电波塔在拖动缩放后保持田内位置，聚焦、庭院拖动和刷新正常', async ({page}) => {
  test.setTimeout(240000);
  await page.setViewportSize({width:1680,height:1050});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  const tower=page.locator('#room-observatory');
  await expect(page.locator('#parallax-wheat-layer #room-observatory')).toHaveCount(1,{timeout:60000});
  const ground=()=>tower.evaluate(el=>{
    const wheat=document.querySelector('#parallax-wheat-layer') as SVGGraphicsElement;
    const screen=new DOMPoint(0,48).matrixTransform((el as SVGGraphicsElement).getScreenCTM()!);
    const local=screen.matrixTransform(wheat.getScreenCTM()!.inverse());
    return {x:local.x,y:local.y,screenX:screen.x,screenY:screen.y};
  });
  const initial=await ground();
  const assertGround=async()=>{
    const now=await ground();expect(now.x).toBeCloseTo(initial.x,3);expect(now.y).toBeCloseTo(initial.y,3);
  };
  const stage=page.locator('#panoramic-world-stage');
  const waitForFocus=async()=>{
    await expect(stage).toHaveAttribute('data-room','observatory');
    // Settle and capture the final camera state after wheel and pointer gestures.
    await page.screenshot({path:'test-results/observatory-projection/focused.png',animations:'disabled'});
    await expect.poll(async()=>{const box=(await tower.boundingBox())!;return Math.abs(box.x+box.width/2-840);},{timeout:15000}).toBeLessThan(160);
  };
  await stage.evaluate(e=>e.closest('svg')!.dispatchEvent(new WheelEvent('wheel',{deltaY:-600,bubbles:true,cancelable:true})));
  let panIndex=0;
  for (const dy of [-240,480,-240]) {
    await page.mouse.move(800,400);await page.mouse.down();await page.mouse.move(800,400+dy,{steps:1});await page.mouse.up();
    await assertGround();
    if (panIndex<2) await page.screenshot({path:`test-results/observatory-projection/pan-${panIndex}.png`});
    panIndex++;
  }
  await stage.evaluate(e=>e.closest('svg')!.dispatchEvent(new WheelEvent('wheel',{deltaY:400,bubbles:true,cancelable:true})));
  await assertGround();
  await page.getByText('更多去处',{exact:true}).click();await page.locator('#nav-room-observatory').click();
  await waitForFocus();
  const box=(await tower.boundingBox())!;
  expect(Math.abs(box.x+box.width/2-840)).toBeLessThan(160);
  expect(box.y).toBeGreaterThan(50);expect(box.y+box.height).toBeLessThan(1000);
  await assertGround();
  const dishPoint=await page.locator('#dish-mechanics-and-reflector > g').first().evaluate(el=>{const p=new DOMPoint(0,0).matrixTransform((el as SVGGraphicsElement).getScreenCTM()!);return {x:p.x,y:p.y};});
  await page.mouse.click(dishPoint.x,dishPoint.y);await expect(page.locator('[data-frequency-readout]')).toHaveCount(1,{timeout:15000});
  await page.getByRole('button',{name:'布置庭院',exact:true}).click();
  const panel=page.getByRole('complementary',{name:'庭院布置',exact:true});
  await panel.getByLabel('选择庭院物件').selectOption('observatory');
  await panel.getByRole('button',{name:'收起',exact:true}).click();
  // Entering yard editing returns to overview; refocus before dragging the remote station.
  await page.locator('#nav-room-observatory').click();
  await waitForFocus();
  const old=await ground();const body=(await page.locator('#observatory-stone-tower').boundingBox())!;
  const x=body.x+body.width/2,y=body.y+body.height/2;
  await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+48,y+24,{steps:1});await page.mouse.up();
  const moved=await ground();expect(moved.screenX-old.screenX).toBeCloseTo(48,0);expect(moved.screenY-old.screenY).toBeCloseTo(24,0);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('live_with_me_yard_layout_v1')!).objects.observatory);
  expect(saved.dx).not.toBe(540);
  await page.reload();await expect(page.locator('#parallax-wheat-layer #room-observatory')).toHaveCount(1,{timeout:60000});
  const restored=await ground();expect(restored.x).toBeCloseTo(moved.x,3);expect(restored.y).toBeCloseTo(moved.y,3);
  expect(errors).toEqual([]);
});
