import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { resolveRoomCamera } from '../../src/world/scene/roomTargets';
import { DEFAULT_SCENE_LAYOUT } from '../../src/world/scene/sceneLayout';
import { visibleViewBox } from '../../src/world/coordinates/viewport';

export async function selectView(page: Page, label: string) {
  const navigation = page.getByRole('navigation', { name: '房间视角' });
  if (await navigation.getByRole('button', { name: '展开视角工具栏', exact: true }).isVisible()) {
    await navigation.getByRole('button', { name: '展开视角工具栏', exact: true }).click();
  }
  const button = navigation.getByRole('button', { name: label, exact: true });
  if (!(await button.isVisible())) await navigation.getByText('更多去处', { exact: true }).click();
  await button.click();
}

export async function expectOverviewCamera(page: Page) {
  const stage = page.locator('#panoramic-world-stage');
  const size = await stage.evaluate(e => {
    const { width, height } = e.closest('svg')!.getBoundingClientRect();
    return { width, height };
  });
  const expected = resolveRoomCamera('overview', DEFAULT_SCENE_LAYOUT, visibleViewBox(size.width, size.height));
  await expect.poll(() => stage.evaluate((e, target) => {
    const m = new DOMMatrix((e as SVGElement).style.transform);
    return Math.max(Math.abs(m.e - target.x), Math.abs(m.f - target.y), Math.abs(m.a - target.zoom));
  }, expected)).toBeLessThan(.001);
}

export async function stableScene(page: Page, path = '/') {
  await page.goto(path);
  await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.querySelectorAll('svg').forEach(svg => { svg.pauseAnimations(); svg.setCurrentTime(0); });
  });
  await page.locator('#panoramic-world-stage').waitFor();
  if (await page.locator('[data-hills-requested]').getAttribute('data-hills-requested') === 'f2') {
    await page.locator('[data-hills-mode="f2"], [data-hills-failure]').waitFor();
  }
}

export const ROOM_VIEWS = [
  ['overview', '整栋小屋'], ['loft', '阁楼'],
  ['living_nook', '公共起居角'],
  ['capsule_pod', '旧胶囊仓'], ['corn_lounge', '林间小木屋'],
  ['observatory', '外星电波观测台'],
] as const;
