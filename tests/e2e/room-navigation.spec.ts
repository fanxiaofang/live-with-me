import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { ROOM_VIEWS, stableScene } from './helpers';

const subjects = {
  my_room: '#isometric-desk-container', living_nook: '#isometric-tea-table',
  friend_room: '#isometric-bookshelf-container', capsule_pod: '#capsule-pod-haven',
  corn_lounge: '#wooden-cabin-haven', observatory: '#alien-receiver-assembly',
  porch_mailbox: '#mailbox-group',
} as const;

test('room selection commits its camera immediately and rapid navigation settles on the latest room', async ({ page }) => {
  await page.goto('/');
  const stage = page.locator('#panoramic-world-stage');
  await stage.waitFor();
  await page.evaluate(() => {
    const stage = document.querySelector('#panoramic-world-stage') as SVGGraphicsElement;
    const samples: { room: string | null; transform: string }[] = [];
    (window as unknown as { roomCommits: typeof samples }).roomCommits = samples;
    new MutationObserver(() => samples.push({ room: stage.getAttribute('data-room'), transform: stage.style.transform }))
      .observe(stage, { attributes: true, attributeFilter: ['data-room', 'style'] });
  });
  await page.getByRole('button', { name: '我的阁楼房间', exact: true }).click();
  const commits = await page.evaluate(() => (window as unknown as { roomCommits: {room:string;transform:string}[] }).roomCommits);
  const selection = commits.find(sample => sample.room === 'my_room')!;
  expect(selection.transform).toBe('translate(246px, 144px) scale(1.2)');
  const timing = await page.locator('#parallax-sky-layer, #parallax-mountains-layer, #parallax-wheat-layer, #panoramic-world-stage')
    .evaluateAll(elements => elements.map(e => getComputedStyle(e).transitionDuration));
  expect(timing).toEqual(['0.4s', '0.4s', '0.4s', '0.4s']);
  // Deliver consecutive selections without Playwright's actionability frames
  // between them, so the assertion exercises genuinely rapid updates.
  await page.evaluate(async () => {
    const buttons = [...document.querySelectorAll<HTMLButtonElement>('nav[aria-label="房间视角"] button')];
    buttons.find(button => button.textContent?.trim() === '公共起居角')!.click();
    await Promise.resolve();
    buttons.find(button => button.textContent?.trim() === '林木的书房')!.click();
  });
  await expect(stage).toHaveAttribute('data-room', 'friend_room');
  await expect(stage).toHaveAttribute('style', /translate\(-96px, 120px\) scale\(1.2\)/);
  await expect(page.locator('[data-room-hit-area="friend_room"]')).toHaveAttribute('fill', 'transparent');
  await expect(page.getByRole('button', { name: '林木的书房', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect.poll(() => stage.evaluate(e => new DOMMatrix(getComputedStyle(e).transform).a)).toBeCloseTo(1.2, 4);
  await page.waitForTimeout(500);
  await expect(stage).toHaveAttribute('data-room', 'friend_room');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: '整栋小屋', exact: true }).click();
  expect(await stage.evaluate(e => getComputedStyle(e).transitionDuration)).toBe('0s');
  await expect(stage).toHaveAttribute('style', /translate\(0px, 135px\) scale\(0.66\)/);
});

for (const viewport of [{width:1200,height:800},{width:1600,height:900},{width:390,height:844}]) {
  test(`all room subjects stay visible with surrounding context at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize(viewport);
    await stableScene(page);
    await page.getByTitle('收起面板（查看完整约克郡风光）', { exact: true }).click();
    for (const [id, label] of ROOM_VIEWS.slice(1)) {
      await page.getByRole('button', { name: label, exact: true }).click();
      const box = (await page.locator(subjects[id as keyof typeof subjects]).boundingBox())!;
      expect(box.x, id).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, id).toBeLessThanOrEqual(viewport.width);
      expect(box.y, id).toBeGreaterThan(45);
      expect(box.y + box.height, id).toBeLessThan(viewport.height - 70);
      await page.mouse.move(10, viewport.height * 0.4);
      if (process.env.LWM_ROOM_SCREENSHOT_DIR) {
        const directory = path.join(process.env.LWM_ROOM_SCREENSHOT_DIR, `${viewport.width}x${viewport.height}`);
        fs.mkdirSync(directory, { recursive: true });
        await page.screenshot({ path: path.join(directory, `${id}.png`) });
      }
    }
    await page.getByRole('button', { name: '整栋小屋', exact: true }).click();
    await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('style', /translate\(0px, 135px\) scale\(0.66\)/);
  });
}

test('focused room adapts to resize and a subsequent manual pan starts at the displayed camera', async ({ page }) => {
  await stableScene(page);
  await page.getByTitle('收起面板（查看完整约克郡风光）', { exact: true }).click();
  await page.getByRole('button', { name: '我的阁楼房间', exact: true }).click();
  await page.setViewportSize({width:390,height:844});
  const stage = page.locator('#panoramic-world-stage');
  await expect.poll(async () => Number(await stage.getAttribute('data-zoom'))).toBeLessThan(0.8);
  const original = await stage.getAttribute('style');
  const before = await stage.evaluate(e => { const m=new DOMMatrix(getComputedStyle(e).transform); return {x:m.e,y:m.f}; });
  await page.mouse.move(170,180); await page.mouse.down();
  await page.mouse.move(190,195,{steps:3}); await page.mouse.up();
  const after = await stage.evaluate(e => { const m=new DOMMatrix(getComputedStyle(e).transform); return {x:m.e,y:m.f}; });
  expect(after.x-before.x).toBeCloseTo(20*800/844,3);
  expect(after.y-before.y).toBeCloseTo(15*800/844,3);
  await page.getByRole('button', {name:'我的阁楼房间',exact:true}).click();
  expect(await stage.getAttribute('style')).toBe(original);
});
